import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/server/db";
import { router, protectedProcedure, publicProcedure } from "@/server/api/trpc"; // use central trpc setup

export const SecretSchema = z.object({
  content: z.string().min(1, "Secret cannot be empty"),
  password: z.string().optional(),
  oneTimeAccess: z.boolean(),
  expiresInMs: z.number(), // milliseconds until expiry
});

export const secretRouter = router({
  createSecret: protectedProcedure
    .input(SecretSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id; // correct session access

      const secret = await prisma.secret.create({
        data: {
          content: input.content,
          passwordHash: input.password
            ? await bcrypt.hash(input.password, 10)
            : null,
          oneTimeAccess: input.oneTimeAccess,
          expiresAt: new Date(Date.now() + input.expiresInMs),
          userId,
        },
      });

      return { id: secret.id };
    }),

  getSecret: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const secret = await prisma.secret.findUnique({
        where: { id: input.id },
      });

      if (!secret || secret.isDeleted) {
        return { status: "not_found" };
      }

      const now = new Date();

      if (now > secret.expiresAt) {
        await prisma.secret.update({
          where: { id: input.id },
          data: { isDeleted: true },
        });
        return { status: "expired" };
      }

      // If secret is one-time and already viewed
      if (secret.oneTimeAccess && secret.viewedAt) {
        return { status: "used" };
      }

      // Handle one-time access: mark as viewed instantly
      if (secret.oneTimeAccess && !secret.viewedAt) {
        await prisma.secret.update({
          where: { id: input.id },
          data: {
            viewedAt: new Date(),
            isDeleted: true,
          },
        });
      }

      return {
        status: "active",
        content: secret.content,
        passwordProtected: !!secret.passwordHash,
        oneTimeAccess: secret.oneTimeAccess,
      };
    }),

  markAsViewed: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.secret.update({
        where: { id: input.id },
        data: {
          viewedAt: new Date(),
          isDeleted: true,
        },
      });

      return { status: "marked" };
    }),

  updateSecret: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(1, "Secret cannot be empty"),
        expiresInMs: z.number().optional(),
        oneTimeAccess: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const existing = await prisma.secret.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!existing) throw new Error("Secret not found or unauthorized");

      await prisma.secret.update({
        where: { id: input.id },
        data: {
          content: input.content,
          expiresAt: input.expiresInMs
            ? new Date(Date.now() + input.expiresInMs)
            : existing.expiresAt,
          oneTimeAccess: input.oneTimeAccess ?? existing.oneTimeAccess,
          viewedAt: null, // reset viewed flag
          isDeleted: false,
        },
      });

      return { success: true };
    }),
});
