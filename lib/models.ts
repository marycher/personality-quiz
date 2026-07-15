let resultsStore: any[] = [];
let questionsStore: any[] = [
  {
    id: "1",
    text: "Какое любимое время года у Алины?",
    options: [
      { text: "Весна", isCorrect: false },
      { text: "Лето", isCorrect: true },
      { text: "Осень", isCorrect: false },
      { text: "Зима", isCorrect: false },
    ],
  },
  {
    id: "2",
    text: "Какое любимое блюдо у Алины?",
    options: [
      { text: "Паста", isCorrect: true },
      { text: "Суши", isCorrect: false },
      { text: "Пицца", isCorrect: false },
      { text: "Салат", isCorrect: false },
    ],
  },
  {
    id: "3",
    text: "Какое хобби у Алины?",
    options: [
      { text: "Рисование", isCorrect: false },
      { text: "Фотография", isCorrect: true },
      { text: "Танцы", isCorrect: false },
      { text: "Пение", isCorrect: false },
    ],
  },
  {
    id: "4",
    text: "Какой цвет любит Алина?",
    options: [
      { text: "Красный", isCorrect: false },
      { text: "Синий", isCorrect: false },
      { text: "Фиолетовый", isCorrect: true },
      { text: "Зелёный", isCorrect: false },
    ],
  },
  {
    id: "5",
    text: "Какое любимое животное у Алины?",
    options: [
      { text: "Собака", isCorrect: true },
      { text: "Кошка", isCorrect: false },
      { text: "Попугай", isCorrect: false },
      { text: "Хомяк", isCorrect: false },
    ],
  },
];

// Questions
export async function getQuestions() {
  return questionsStore;
}

export async function createQuestion(data: { text: string; options: { text: string; isCorrect: boolean }[] }) {
  const id = Math.random().toString(36).substring(2, 15);
  const item = { id, ...data };
  questionsStore.push(item);
  return item;
}

export async function updateQuestion(id: string, data: { text: string; options: { text: string; isCorrect: boolean }[] }) {
  const index = questionsStore.findIndex((q) => q.id === id);
  if (index !== -1) {
    questionsStore[index] = { ...questionsStore[index], ...data };
    return questionsStore[index];
  }
  return null;
}

export async function deleteQuestion(id: string) {
  questionsStore = questionsStore.filter((q) => q.id !== id);
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
  resultsStore.push(item);
  return item;
}

export async function getQuizResults() {
  return resultsStore.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
