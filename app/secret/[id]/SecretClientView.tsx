"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

type Props = {
  id: string;
};

export default function SecretClientView({ id }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");

  const { data, isLoading } = trpc.secret.getSecret.useQuery({ id });

  if (isLoading) {
    return <p className="p-4 text-gray-600">🔄 Loading...</p>;
  }

  if (!data) {
    return <p className="p-4 text-red-600">❌ Unexpected error occurred.</p>;
  }

  if (data.status === "not_found") {
    return <p className="p-4 text-gray-600">❌ Secret not found.</p>;
  }

  if (data.status === "expired") {
    return <p className="p-4 text-orange-600">⌛ This secret has expired.</p>;
  }

  if (data.status === "used") {
    return (
      <p className="p-4 text-yellow-600">
        ⚠️ This one-time secret has already been viewed.
      </p>
    );
  }

  if (data.passwordProtected && !unlocked) {
    return (
      <div className="p-6 max-w-md mx-auto space-y-4 bg-white shadow-md rounded-lg border">
        <h1 className="text-xl font-semibold text-gray-800">
          🔒 Password Required
        </h1>
        <input
          type="password"
          placeholder="Enter password"
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={() => setUnlocked(true)} // Future: Add password validation here
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Unlock
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4 bg-white rounded-lg border shadow">
      <h1 className="text-2xl font-bold text-gray-800">🔐 Your Secret</h1>

      <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
        <pre className="whitespace-pre-wrap text-gray-700">{data.content}</pre>
      </div>

      {data.oneTimeAccess && (
        <p className="text-sm text-yellow-700 italic">
          ⚠️ This was a one-time secret. You cannot access it again.
        </p>
      )}
    </div>
  );
}
