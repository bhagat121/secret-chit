"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function SecretViewPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const { data, isLoading } = trpc.secret.getSecret.useQuery({ id });

  if (isLoading) return <p className="p-4">🔄 Loading...</p>;
  if (!data) return <p className="p-4 text-red-600">Unexpected error.</p>;

  // Handle various secret statuses
  if (data.status === "not_found")
    return <p className="p-4">Secret not found.</p>;
  if (data.status === "expired")
    return <p className="p-4">This secret has expired.</p>;
  if (data.status === "used")
    return (
      <p className="p-4">This one-time secret has already been viewed.</p>
    );

  // Optional password protection UI
  if (data.passwordProtected && !unlocked) {
    return (
      <div className="p-6 max-w-md mx-auto space-y-4">
        <h1 className="text-xl font-semibold">Password Required</h1>
        <input
          type="password"
          placeholder="Enter password"
          className="border rounded px-3 py-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={() => {
            // For now, no backend password check
            setUnlocked(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Unlock
        </button>
      </div>
    );
  }

  // ✅ Show the actual secret
  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Secret</h1>
      <div className="bg-gray-100 rounded p-4 border">
        <pre className="whitespace-pre-wrap text-gray-700">{data.content}</pre>
      </div>
      {data.oneTimeAccess && (
        <p className="text-sm text-yellow-700">
          ⚠️ This was a one-time secret. You cannot access it again.
        </p>
      )}
    </div>
  );
}
