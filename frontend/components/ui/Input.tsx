interface Props
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  ...props
}: Props) {
  return (
    <div className="mb-5">
      <label className="block mb-2 text-sm text-white/70">
        {label}
      </label>

      <input
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition"
      />

      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
