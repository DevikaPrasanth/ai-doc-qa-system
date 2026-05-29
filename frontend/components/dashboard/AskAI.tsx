interface Document {
  id: string;
  file_name: string;
}

interface Citation {
  document: string;
  chunk: number;
}

interface Props {
  documents: Document[];
  selectedDocument: string;
  question: string;
  answer: string;
  citations: Citation[];
  loading: boolean;
  error?: string;
  compact?: boolean;
  onSelectedDocumentChange: (value: string) => void;
  onQuestionChange: (value: string) => void;
  onAsk: () => void;
}

export default function AskAI({
  documents,
  selectedDocument,
  question,
  answer,
  citations,
  loading,
  error,
  compact = false,
  onSelectedDocumentChange,
  onQuestionChange,
  onAsk,
}: Props) {
  const selectedDoc = documents.find(
    (doc) => doc.id === selectedDocument
  );

  return (
    <div
      className={`lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl flex flex-col overflow-hidden ${
        compact ? "self-start min-h-0" : "min-h-[460px]"
      }`}
    >
      <div className={`border-b border-white/10 ${compact ? "p-4" : "p-5"}`}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className={compact ? "text-xl font-semibold" : "text-2xl font-semibold"}>
              AI Chat
            </h3>
            <p className={`text-sm text-white/50 ${compact ? "mt-1" : "mt-2"}`}>
              Ask focused questions and get grounded answers with sources.
            </p>
          </div>

          <div className="min-w-0 xl:w-80">
            <select
              value={selectedDocument}
              onChange={(e) =>
                onSelectedDocumentChange(e.target.value)
              }
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition text-sm"
            >
              <option value="">Select a document</option>

              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.file_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`mt-4 rounded-2xl border border-white/10 bg-black/25 ${compact ? "p-3" : "p-3"}`}>
          <p className="text-xs uppercase text-white/35">
            Active source
          </p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium truncate">
                {selectedDoc?.file_name || "No document selected"}
              </p>
              <p className="text-sm text-white/45 mt-1">
                {selectedDoc
                  ? "Ready for document-grounded answers"
                  : "Choose a document before asking"}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                selectedDoc
                  ? "bg-emerald-500/10 text-emerald-200 border border-emerald-400/20"
                  : "bg-white/5 text-white/45 border border-white/10"
              }`}
            >
              {selectedDoc ? "Connected" : "Waiting"}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`${
          compact
            ? "p-4 space-y-4"
            : "p-5 flex-1 space-y-5 overflow-y-auto"
        }`}
      >
        {!answer && !loading && !error && (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-start gap-3">
              <div className={`${compact ? "h-8 w-8" : "h-10 w-10"} shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-xs font-semibold`}>
                AI
              </div>
              <div>
                <p className="text-white/80 font-medium">
                  Ask about your selected document.
                </p>
                <p className="text-sm text-white/45 mt-1 leading-relaxed">
                  Use the input below to get a sourced answer.
                </p>
              </div>
            </div>
          </div>
        )}

        {(question || answer || loading) && (
          <div className="space-y-5">
            {question && (
              <div className="flex justify-end">
                <div className="max-w-full sm:max-w-[80%] rounded-2xl rounded-tr-md bg-white text-black px-5 py-4 shadow-xl">
                  <p className="text-sm font-medium mb-1">
                    You asked
                  </p>
                  <p className="leading-relaxed">{question}</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-full sm:max-w-[80%] rounded-2xl rounded-tl-md border border-white/10 bg-black/25 px-5 py-4">
                  <p className="text-sm text-white/45 mb-3">
                    DocuMind is reading the selected document
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-300 animate-pulse" />
                    <span className="h-2 w-2 rounded-full bg-purple-300 animate-pulse [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-purple-300 animate-pulse [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {answer && (
              <div className="flex justify-start">
                <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-white/10 bg-black/25 px-5 py-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-purple-500/15 border border-purple-400/20 flex items-center justify-center text-xs font-semibold text-purple-100">
                      AI
                    </div>
                    <div>
                      <p className="font-medium">DocuMind</p>
                      <p className="text-xs text-white/40">
                        Answered from document context
                      </p>
                    </div>
                  </div>

                  <p className="text-white/82 leading-relaxed whitespace-pre-wrap">
                    {answer}
                  </p>

                  {citations.length > 0 && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <p className="text-sm font-medium mb-3">
                        Sources
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {citations.map((citation, index) => (
                          <span
                            key={index}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/65"
                          >
                            {citation.document} - Chunk {citation.chunk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {error && (
          <div className="border border-red-400/20 bg-red-500/10 text-red-200 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-4 bg-black/20">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Ask something about your documents..."
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                onAsk();
              }
            }}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition"
          />

          <button
            onClick={onAsk}
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:scale-[1.02] transition disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? "Thinking" : "Ask"}
          </button>

        </div>
      </div>
    </div>
  );
}
