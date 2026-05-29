import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <main
      className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 30% 10%, rgba(147, 51, 234, 0.2), transparent 28rem), radial-gradient(circle at 70% 90%, rgba(37, 99, 235, 0.2), transparent 28rem), #000",
      }}
    >
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-3">{title}</h1>

          <p className="text-white/60 mb-8 leading-relaxed">{subtitle}</p>

          {children}
        </div>
      </div>
    </main>
  );
}
