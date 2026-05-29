"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const links = [
  {
    href: "/dashboard",
    label: "Workspace",
  },
  {
    href: "/dashboard/documents",
    label: "Documents",
  },
  {
    href: "/dashboard/upload",
    label: "Uploads",
  },
  {
    href: "/dashboard/chat",
    label: "AI Chat",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="relative w-72 shrink-0 border-r border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">DocuMind AI</h1>

        {userEmail && (
          <p className="text-sm text-white/45 mt-2 truncate">
            {userEmail}
          </p>
        )}
      </div>

      <nav className="space-y-3">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block w-full text-left px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={handleLogout}
          className="w-full border border-white/10 py-3 rounded-xl hover:bg-white/5 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
