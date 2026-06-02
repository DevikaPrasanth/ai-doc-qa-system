"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import AskAI from "@/components/dashboard/AskAI";
import PageHeader from "@/components/dashboard/PageHeader";
import { useDocuments } from "@/hooks/useDocuments";
import { askDocumentQuestion } from "@/lib/documentApi";

export default function ChatPage() {
  const { documents } = useDocuments();
  const [selectedDocument, setSelectedDocument] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [askError, setAskError] = useState("");

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

  // If there are no uploaded documents, show a friendly CTA to upload
  if (!documents || documents.length === 0) {
    return (
      <>
        <PageHeader
          title="AI Chat"
          subtitle="Ask focused questions and get sourced answers from a selected document."
        />

        <div className="mt-8 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No documents uploaded yet.</h3>
            <p className="text-sm text-white/60 mb-6">Upload a document to start asking questions.</p>
            <Link href="/dashboard/upload" className="inline-block bg-white text-black px-5 py-3 rounded-xl font-medium">
              Upload Document
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="AI Chat"
        subtitle="Ask focused questions and get sourced answers from a selected document."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AskAI
          documents={documents}
          selectedDocument={selectedDocument}
          question={question}
          answer={answer}
          citations={citations}
          loading={loading}
          error={askError}
          onSelectedDocumentChange={setSelectedDocument}
          onQuestionChange={setQuestion}
          onAsk={handleAskQuestion}
        />
      </div>
    </>
  );
}
