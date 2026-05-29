"use client";

import { useState } from "react";
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
