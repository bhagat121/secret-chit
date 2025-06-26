// server/utils/protectedProcedure.ts
import { initTRPC } from '@trpc/server';
import { Context } from '../context';

const t = initTRPC.context<Context>().create();

export const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new Error('UNAUTHORIZED');
  }
  return next({
    ctx: {
      user: ctx.session.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
