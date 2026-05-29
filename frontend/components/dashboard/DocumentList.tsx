"use client";

import { useState } from "react";

interface Document {
  id: string;
  file_name: string;
}

interface Props {
  documents: Document[];
  onDelete: (id: string) => void;
  error?: string;
}

export default function DocumentList({
  documents,
  onDelete,
  error,
}: Props) {
  const [pendingDeleteId, setPendingDeleteId] = useState("");

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold">My Documents</h3>
        <span className="text-xs text-white/45">
          {documents.length} total
        </span>
      </div>

      {error && (
        <div className="mb-4 border border-red-400/20 bg-red-500/10 text-red-200 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {documents.length === 0 && (
          <p className="text-sm text-white/45">
            Uploaded documents will appear here.
          </p>
        )}

        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border border-white/10 rounded-2xl p-4 bg-black/20"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-white/80 truncate">
                {doc.file_name}
              </p>

              {pendingDeleteId === doc.id ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onDelete(doc.id);
                      setPendingDeleteId("");
                    }}
                    className="text-xs text-red-100 bg-red-500/20 border border-red-400/20 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => setPendingDeleteId("")}
                    className="text-xs text-white/65 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setPendingDeleteId(doc.id)}
                  className="text-xs text-red-300 border border-red-400/20 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
