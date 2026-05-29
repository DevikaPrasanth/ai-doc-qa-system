"use client";

import { FormEvent, useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    setError("");
    setSuccess("");
    setFieldErrors({
      email: "",
      password: "",
    });

    const nextFieldErrors = {
      email: normalizedEmail ? "" : "Email is required",
      password:
        password.length >= 6 ? "" : "Password must be at least 6 characters",
    };

    if (nextFieldErrors.email || nextFieldErrors.password) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? "Signup failed");
        return;
      }

      setSuccess("Signup successful. Check your email if confirmation is required.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start asking questions across your documents."
    >
      <form onSubmit={handleSignup} className="space-y-2">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm p-3 rounded-xl">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-xl font-medium hover:scale-[1.02] transition mt-4 disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-white/50 text-sm mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-white hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
