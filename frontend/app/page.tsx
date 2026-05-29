import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen bg-black text-white overflow-hidden relative"
      style={{
        background:
          "linear-gradient(135deg, #030303 0%, #101018 45%, #05070b 100%)",
      }}
    >
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md">
        <h1 className="text-2xl font-semibold tracking-wide">
          DocuMind AI
        </h1>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-white/80 hover:text-white transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32">
        
        <div className="mb-6 border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white/70">
          AI-Powered Document Intelligence
        </div>

        <h1 className="text-5xl md:text-7xl font-bold max-w-5xl leading-tight">
          Upload documents.
          <br />
          Ask intelligent questions.
          <br />
          Get answers instantly.
        </h1>

        <p className="mt-8 text-white/60 max-w-2xl text-lg leading-relaxed">
          A secure AI workspace that helps you
          understand PDFs and text documents
          using contextual question answering.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/signup"
            className="bg-white text-black px-8 py-4 rounded-full font-medium hover:scale-105 transition"
          >
            Start Free
          </Link>

          <Link
            href="/login"
            className="border border-white/20 px-8 py-4 rounded-full hover:bg-white/5 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative z-10 grid md:grid-cols-3 gap-6 px-8 py-32 max-w-6xl mx-auto">
        
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">
          <h3 className="text-xl font-semibold mb-4">
            Smart Q&A
          </h3>

          <p className="text-white/60 leading-relaxed">
            Ask contextual questions about your
            uploaded documents and receive
            AI-generated answers instantly.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">
          <h3 className="text-xl font-semibold mb-4">
            Source Citations
          </h3>

          <p className="text-white/60 leading-relaxed">
            Every response includes source
            references so answers remain
            transparent and traceable.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">
          <h3 className="text-xl font-semibold mb-4">
            Secure Workspace
          </h3>

          <p className="text-white/60 leading-relaxed">
            Your documents remain private with
            authenticated access and protected
            storage architecture.
          </p>
        </div>
      </section>
    </main>
  );
}
