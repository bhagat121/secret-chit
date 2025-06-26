import { getServerAuthSession } from '@/server/auth'; // your next-auth config
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { Session } from 'next-auth';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

// Step 1: Context function to inject session into tRPC ctx
export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const session = await getServerAuthSession({ req, res });
  return { session };
};

type Context = Awaited<ReturnType<typeof createContext>>;

// Step 2: Create tRPC instance
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Step 3: Public & Protected procedures
export const router = t.router;
export const publicProcedure = t.procedure;

// Protected = requires session
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: ctx.session, // now safe
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
