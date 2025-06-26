// server/api/root.ts
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { secretRouter } from './routers/secret';
import { authRouter } from './routers/auth';
import { dashboardRouter } from './routers/dashboard';

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  secret: secretRouter,
  auth: authRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
