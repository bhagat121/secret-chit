import { appRouter } from "@/server/api/root";
import { createContext } from "@/server/api/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext, // This will now use req/res
  });
};

export { handler as GET, handler as POST };
