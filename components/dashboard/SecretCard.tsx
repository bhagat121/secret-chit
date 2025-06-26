"use client";

type Props = {
  secret: {
    id: string;
    content: string;
    expiresAt: Date;
    viewedAt: Date | null;
    oneTimeAccess: boolean;
    isDeleted: boolean;
  };
  onDelete: () => void;
  onEdit: () => void;
};

export default function SecretCard({ secret, onDelete, onEdit }: Props) {
  const secretUrl = `${window.location.origin}/secret/${secret.id}`;
  const now = new Date();
  const expiresAt = new Date(secret.expiresAt);

  let status = "Active";
  if (now > expiresAt) {
    status = "Expired";
  } else if (secret.viewedAt && secret.oneTimeAccess) {
    status = "Used";
  }

  const faded = status !== "Active";

  const statusColor = {
    Active: "bg-green-100 text-green-800",
    Expired: "bg-gray-200 text-gray-700",
    Used: "bg-yellow-100 text-yellow-800",
  }[status];

  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl shadow-md p-5 flex justify-between items-start gap-4 ${
        faded ? "opacity-60" : ""
      }`}
    >
      <div className="flex-1">
        <p className="text-gray-800 font-medium mb-2">
          {secret.content.length > 100
            ? `${secret.content.slice(0, 100)}...`
            : secret.content}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-1">
          <span>📅 Expires: {expiresAt.toLocaleString()}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
          >
            {status}
          </span>
        </div>

        {status === "Active" && (
          <a
            href={secretUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-600 hover:underline text-sm mt-1"
          >
            🔗 View Secret
          </a>
        )}
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <button onClick={onEdit} className="text-blue-600 hover:underline">
          Edit
        </button>
        <button onClick={onDelete} className="text-red-600 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
}
