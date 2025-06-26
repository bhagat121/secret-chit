"use client";

import { trpc } from "@/lib/trpc";
import Modal from "@/components/ui/Modal";

export default function SecretViewModal({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) {
  const { data, isLoading } = trpc.secret.getSecret.useQuery(
    { id: id ?? "" },
    { enabled: !!id }
  );

  if (!id) return null;

  return (
    <Modal isOpen={!!id} onClose={onClose}>
      {isLoading ? (
        <p className="text-center">🔄 Loading...</p>
      ) : !data ? (
        <p className="text-red-600 text-center">Unexpected error.</p>
      ) : data.status === "not_found" ? (
        <p className="text-center">Secret not found.</p>
      ) : data.status === "expired" ? (
        <p className="text-center">This secret has expired.</p>
      ) : data.status === "used" ? (
        <p className="text-center">
          This one-time secret has already been viewed.
        </p>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">🔐 Secret</h2>
          <div className="bg-gray-100 p-4 rounded border mb-2">
            <pre className="whitespace-pre-wrap text-gray-800">
              {data.content}
            </pre>
          </div>
          {data.oneTimeAccess && (
            <p className="text-sm text-yellow-600">
              ⚠️ This was a one-time secret. You cannot access it again.
            </p>
          )}
        </>
      )}
    </Modal>
  );
}
