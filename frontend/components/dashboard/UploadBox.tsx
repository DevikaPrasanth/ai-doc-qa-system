interface Props {
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  loading?: boolean;
  message?: string;
  error?: string;
}

export default function UploadBox({
  onUpload,
  loading,
  message,
  error,
}: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      <h3 className="text-xl font-semibold mb-2">
        Upload Documents
      </h3>

      <p className="text-white/50 text-sm mb-6">
        Upload PDFs and ask AI-powered questions about them.
      </p>

      <label className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-purple-500/40 hover:bg-white/[0.03] transition cursor-pointer">
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-xs font-semibold uppercase tracking-wide">
          PDF
        </div>

        <p className="font-medium">Click to upload PDF</p>

        <p className="text-sm text-white/40 mt-2">
          Secure AI document processing
        </p>

        <input
          type="file"
          accept=".pdf"
          onChange={onUpload}
          className="hidden"
        />
      </label>

      {loading && (
        <div className="mt-5 text-sm text-purple-300">
          Uploading and processing...
        </div>
      )}

      {message && !loading && (
        <div className="mt-5 border border-emerald-400/20 bg-emerald-500/10 text-emerald-200 text-sm p-3 rounded-xl">
          {message}
        </div>
      )}

      {error && !loading && (
        <div className="mt-5 border border-red-400/20 bg-red-500/10 text-red-200 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}
    </div>
  );
}
