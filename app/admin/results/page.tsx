"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Answer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

interface QuizResult {
  id: string;
  name: string;
  percentage: number;
  wish: string;
  story: string;
  createdAt: string;
  answers: Answer[];
}

export default function AdminResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch("/api/admin/results");
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (e) {
      console.error("Failed to fetch results", e);
    } finally {
      setLoading(false);
    }
  };

  const getPercentageColor = (pct: number) => {
    if (pct <= 40) return "text-red-600";
    if (pct <= 70) return "text-yellow-600";
    if (pct <= 90) return "text-green-600";
    return "text-purple-600";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Результаты</h1>

        {results.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            Пока нет результатов прохождения квиза
          </p>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="bg-white rounded-xl border p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{result.name}</h3>
                      <span className={`text-2xl font-bold ${getPercentageColor(result.percentage)}`}>
                        {result.percentage}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      {result.wish && <p>💝 {result.wish}</p>}
                      {result.story && <p>📖 {result.story}</p>}
                      <p>📅 {new Date(result.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
                    variant="ghost"
                    size="sm"
                  >
                    {expandedId === result.id ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>

                {expandedId === result.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <h4 className="font-medium text-sm text-gray-700">Ответы:</h4>
                    {result.answers.map((answer, idx) => (
                      <div key={idx} className={`p-3 rounded-lg text-sm ${answer.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                        <span className={answer.isCorrect ? "text-green-700" : "text-red-700"}>
                          {answer.isCorrect ? "✓" : "✗"} Вопрос {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
