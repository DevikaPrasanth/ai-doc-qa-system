"use client";

import { useState } from "react";
import DocumentList from "@/components/dashboard/DocumentList";
import PageHeader from "@/components/dashboard/PageHeader";
import { useDocuments } from "@/hooks/useDocuments";
import { deleteDocument } from "@/lib/documentApi";

export default function DocumentsPage() {
  const { documents, loadingDocuments, refreshDocuments } =
    useDocuments();
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async (id: string) => {
    setDeleteError("");

    try {
      await deleteDocument(id);
      refreshDocuments();
    } catch (err) {
      console.error(err);
      setDeleteError("Delete failed. Please try again.");
    }
  };

  return (
    <>
      <PageHeader
        title="Documents"
        subtitle="Review uploaded files and remove anything you no longer need."
      />

      <div className="max-w-3xl">
        {loadingDocuments && (
          <p className="text-sm text-white/45 mb-4">
            Loading documents...
          </p>
        )}

        <DocumentList
          documents={documents}
          onDelete={handleDelete}
          error={deleteError}
        />
      </div>
    </>
  );
}
