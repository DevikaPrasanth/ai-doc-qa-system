"use client";

import { ChangeEvent, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import UploadBox from "@/components/dashboard/UploadBox";
import { uploadDocument } from "@/lib/documentApi";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setUploadMessage("");
    setUploadError("");

    const file = e.target.files?.[0];

    if (!file) {
      setUploadError("Please select a file");
      return;
    }

    try {
      setUploading(true);
      await uploadDocument(file);
      setUploadMessage("Upload successful. Your document is ready for questions.");
      e.target.value = "";
    } catch (err) {
      console.error(err);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Uploads"
        subtitle="Add new PDFs to your AI document workspace."
      />

      <div className="max-w-xl">
        <UploadBox
          onUpload={handleUpload}
          loading={uploading}
          message={uploadMessage}
          error={uploadError}
        />
      </div>
    </>
  );
}
