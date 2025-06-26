import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string; // added name field (optional)
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string; // optional name field for User
  }
}
