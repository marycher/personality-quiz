import { mockQuestions, mockQuizResults } from "./mock-data";

// Questions
export async function getQuestions() {
  return mockQuestions;
}

export async function createQuestion(data: { text: string; options: { text: string; isCorrect: boolean }[] }) {
  const id = Math.random().toString(36).substring(2, 15);
  const item = { id, ...data };
  mockQuestions.push(item);
  return item;
}

export async function updateQuestion(id: string, data: { text: string; options: { text: string; isCorrect: boolean }[] }) {
  const index = mockQuestions.findIndex((q) => q.id === id);
  if (index !== -1) {
    mockQuestions[index] = { ...mockQuestions[index], ...data };
    return mockQuestions[index];
  }
  return null;
}

export async function deleteQuestion(id: string) {
  const index = mockQuestions.findIndex((q) => q.id === id);
  if (index !== -1) {
    mockQuestions.splice(index, 1);
  }
}

// Quiz Results
export async function saveQuizResult(data: {
  name: string;
  percentage: number;
  wish: string;
  story: string;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
}) {
  const id = Math.random().toString(36).substring(2, 15);
  const item = { id, ...data, createdAt: new Date().toISOString() };
  mockQuizResults.push(item);
  return item;
}
