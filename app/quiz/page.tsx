import { Suspense } from "react";
import QuizClient from "@/components/quiz-client";
import { getQuestions } from "@/lib/models";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: { name?: string };
}) {
  const questions = await getQuestions();
  const name = searchParams.name || "";

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={<div className="text-white text-center">Загрузка...</div>}>
          <QuizClient questions={questions} name={name} />
        </Suspense>
      </div>
    </main>
  );
}
