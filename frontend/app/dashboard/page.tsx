"use client";

import { ChangeEvent, useState } from "react";
import axios from "axios";
import AskAI from "@/components/dashboard/AskAI";
import DocumentList from "@/components/dashboard/DocumentList";
import PageHeader from "@/components/dashboard/PageHeader";
import UploadBox from "@/components/dashboard/UploadBox";
import { useDocuments } from "@/hooks/useDocuments";
import {
  askDocumentQuestion,
  deleteDocument,
  uploadDocument,
} from "@/lib/documentApi";

export default function DashboardPage() {
  const { documents, refreshDocuments } = useDocuments();

  const [selectedDocument, setSelectedDocument] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [askError, setAskError] = useState("");
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

  const handleAskQuestion = async () => {
    setAskError("");

    if (!selectedDocument) {
      setAskError("Please select a document");
      return;
    }

    if (!question.trim()) {
      setAskError("Please enter a question");
      return;
    }

    try {
      setLoading(true);
      setAnswer("");
      setCitations([]);

      const response = await askDocumentQuestion(
        question,
        selectedDocument
      );

      setAnswer(response.answer);
      setCitations(response.citations);
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setAskError(err.response?.data?.error || "Failed to get answer");
      } else {
        setAskError("Failed to get answer");
      }
    } finally {
      setLoading(false);
    }
  };

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
      const uploadResult = await uploadDocument(file);

      setUploadMessage(
        uploadResult?.extraction?.note ||
          "Upload successful. Your document is ready for questions."
      );
      refreshDocuments();
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
        title="AI Workspace"
        subtitle="Upload documents and ask intelligent questions."
      />

      <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <UploadBox
            onUpload={handleUpload}
            loading={uploading}
            message={uploadMessage}
            error={uploadError}
          />

          <DocumentList
            documents={documents}
            onDelete={handleDelete}
            error={deleteError}
          />
        </div>

          <AskAI
            documents={documents}
            selectedDocument={selectedDocument}
            question={question}
            answer={answer}
            citations={citations}
            loading={loading}
            error={askError}
            compact
            onSelectedDocumentChange={setSelectedDocument}
            onQuestionChange={setQuestion}
            onAsk={handleAskQuestion}
        />
      </div>
    </>
  );
}
