"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    pathname === path
      ? "text-blue-600 underline underline-offset-4"
      : "hover:text-blue-600 transition-colors";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          Secret Chit
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-gray-700">
          {session?.user ? (
            <>
              <Link href="/dashboard" className={linkStyle("/dashboard")}>
                Dashboard
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-red-600 hover:underline hover:text-red-700 transition-colors"
              >
                Logout
              </button>

              <span className="text-gray-400 text-xs ml-2 italic truncate max-w-[160px]">
                {session.user.name}
              </span>
            </>
          ) : (
            <>
              <Link href="/login" className={linkStyle("/login")}>
                Login
              </Link>
              <Link
                href="/signup"
                className={`${linkStyle(
                  "/signup"
                )} bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition`}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
