import { router, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";

export const dashboardRouter = router({
  getMySecrets: protectedProcedure.query(async ({ ctx }) => {
    return prisma.secret.findMany({
      where: {
        userId: ctx.session.user.id,
        // isDeleted: false,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  deleteSecret: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // Optional: Verify secret belongs to the user
      const secret = await prisma.secret.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!secret) throw new Error("Not found or unauthorized");

      await prisma.secret.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
