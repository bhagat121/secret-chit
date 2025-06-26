"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useSession } from "next-auth/react";
import SecretCard from "./SecretCard";
import SecretForm from "./SecretForm";
import Modal from "@/components/ui/Modal";

export default function Dashboard() {
  const { data: session } = useSession();
  const { data, isLoading, refetch } = trpc.dashboard.getMySecrets.useQuery();
  const createSecret = trpc.secret.createSecret.useMutation();
  const updateSecret = trpc.secret.updateSecret.useMutation();
  const deleteMutation = trpc.dashboard.deleteSecret.useMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingSecret, setEditingSecret] = useState<(typeof data)[0] | null>(
    null
  );
  const [editContent, setEditContent] = useState("");
  const [editOneTime, setEditOneTime] = useState(false);
  const [editExpiresIn, setEditExpiresIn] = useState("24h");

  if (!session) return null;
  if (isLoading)
    return (
      <div className="text-center py-8 text-gray-600">
        Loading your secrets...
      </div>
    );

  const filteredSecrets = data.filter((secret) =>
    secret.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = async () => {
    if (!editingSecret || !editContent.trim()) return;
    const expiresMsMap: Record<string, number> = {
      "1h": 3600000,
      "24h": 86400000,
      "7d": 604800000,
    };
    const expiresInMs = expiresMsMap[editExpiresIn] || 86400000;

    await updateSecret.mutateAsync({
      id: editingSecret.id,
      content: editContent,
      expiresInMs,
      oneTimeAccess: editOneTime,
    });
    setEditingSecret(null);
    refetch();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto space-y-6 pt-24">
      <h1 className="text-3xl font-semibold text-center text-blue-900 mb-2">
        Your Secrets
      </h1>

      <input
        type="text"
        placeholder="Search your secrets..."
        className="bg-white shadow-sm focus:ring-2 focus:ring-blue-500 rounded-xl px-4 py-2 w-full transition placeholder:text-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="bg-white p-5 rounded-2xl shadow-md">
        <SecretForm onCreated={refetch} />
      </div>

      {filteredSecrets.length > 0 ? (
        <div
          className="space-y-4 overflow-y-auto pr-1 mt-2"
          style={{
            maxHeight: filteredSecrets.length > 2 ? "350px" : "auto",
          }}
        >
          {filteredSecrets.map((secret) => (
            <SecretCard
              key={secret.id}
              secret={secret}
              onDelete={async () => {
                await deleteMutation.mutateAsync({ id: secret.id });
                refetch();
              }}
              onEdit={() => {
                setEditingSecret(secret);
                setEditContent(secret.content);
                setEditOneTime(secret.oneTimeAccess);
                setEditExpiresIn("24h");
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">
          No matching secrets found.
        </p>
      )}

      <Modal isOpen={!!editingSecret} onClose={() => setEditingSecret(null)}>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Edit Secret
        </h2>

        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full rounded-lg p-3 mb-4 border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium">One-time access</label>
          <input
            type="checkbox"
            checked={editOneTime}
            onChange={(e) => setEditOneTime(e.target.checked)}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Expiration</label>
          <select
            value={editExpiresIn}
            onChange={(e) => setEditExpiresIn(e.target.value)}
            className="w-full border border-gray-200 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="1h">1 hour</option>
            <option value="24h">24 hours</option>
            <option value="7d">7 days</option>
          </select>
        </div>

        <button
          onClick={handleUpdate}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
        >
          Save Changes
        </button>
      </Modal>
    </div>
  );
}
