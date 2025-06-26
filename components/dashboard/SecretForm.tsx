"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function SecretForm({ onCreated }: { onCreated?: () => void }) {
  const [content, setContent] = useState("");
  const [oneTimeAccess, setOneTimeAccess] = useState(false);
  const [expiresInMs, setExpiresInMs] = useState(24 * 60 * 60 * 1000); // 24h default

  const createSecret = trpc.secret.createSecret.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createSecret.mutateAsync({
      content,
      oneTimeAccess,
      expiresInMs,
      password: "", // Reserved for future password support
    });

    setContent("");
    setOneTimeAccess(false);
    onCreated?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your secret..."
        rows={4}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="oneTimeAccess"
          checked={oneTimeAccess}
          onChange={(e) => setOneTimeAccess(e.target.checked)}
          className="accent-blue-600 w-4 h-4"
        />
        <label htmlFor="oneTimeAccess" className="text-sm text-gray-700">
          Enable <strong>One-time access</strong>
        </label>
      </div>

      <div>
        <label htmlFor="expiry" className="block text-sm text-gray-700 mb-1">
          Expiry Duration
        </label>
        <select
          id="expiry"
          value={expiresInMs}
          onChange={(e) => setExpiresInMs(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value={60 * 60 * 1000}>1 hour</option>
          <option value={24 * 60 * 60 * 1000}>24 hours</option>
          <option value={7 * 24 * 60 * 60 * 1000}>7 days</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
      >
        Share Secret
      </button>
    </form>
  );
}
