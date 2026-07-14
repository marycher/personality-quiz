"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminQuestions from "@/components/admin-questions";

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/check")
      .then((res) => {
        if (res.ok) {
          setIsAuthed(true);
        } else {
          router.push("/admin/login");
        }
      })
      .catch(() => {
        router.push("/admin/login");
      })
      .finally(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Проверка авторизации...</p>
      </main>
    );
  }

  if (!isAuthed) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Управление вопросами</h1>
        <AdminQuestions />
      </div>
    </main>
  );
}
