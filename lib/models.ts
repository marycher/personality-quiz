import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

function getClient() {
  const endpoint = process.env.DOCUMENT_API_ENDPOINT;
  const region = process.env.DOCUMENT_API_REGION || "ru-central1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  const client = new DynamoDBClient({
    region,
    endpoint: endpoint || undefined,
    credentials:
      accessKeyId && secretAccessKey
        ? { accessKeyId, secretAccessKey }
        : undefined,
  });

  return DynamoDBDocumentClient.from(client);
}

// Questions
export async function getQuestions() {
  try {
    const docClient = getClient();
    const command = new ScanCommand({ TableName: "questions" });
    const result = await docClient.send(command);
    const items = result.Items || [];
    
    if (items.length === 0) {
      // Default questions if DB is empty
      return [
        {
          id: "1",
          text: "На что похож смех Алины?",
          options: [
            { text: "Свист чайника", isCorrect: false },
            { text: "Скрип двери", isCorrect: false },
            { text: "Крик чайки", isCorrect: true },
            { text: "Звуки гиены", isCorrect: false },
          ],
        },
        {
          id: "2",
          text: "В какой цвет Алина красила волосы?",
          options: [
            { text: "Рыжий", isCorrect: true },
            { text: "Красный", isCorrect: false },
            { text: "Синий", isCorrect: false },
            { text: "Фиолетовый", isCorrect: false },
          ],
        },
        {
          id: "3",
          text: "Кто из знаменитостей кормил Алину медом?",
          options: [
            { text: "Билан", isCorrect: false },
            { text: "Арбенина", isCorrect: true },
            { text: "Лолита", isCorrect: false },
            { text: "Розенбаум", isCorrect: false },
          ],
        },
        {
          id: "4",
          text: "Что из этого не умеет Алина?",
          options: [
            { text: "Играть в теннис", isCorrect: false },
            { text: "Быстро бегать", isCorrect: false },
            { text: "Кататься на велосипеде", isCorrect: true },
            { text: "Прыгать на скакалке", isCorrect: false },
          ],
        },
        {
          id: "5",
          text: "Какой болезнью страдает Алина?",
          options: [
            { text: "Топографический критинизм", isCorrect: true },
            { text: "Словесное недержание", isCorrect: true },
            { text: "Повышенное чувство ответственности", isCorrect: true },
            { text: "Пониженное мнение об окружающих", isCorrect: true },
          ],
        },
      ];
    }
    
    return items as any[];
  } catch {
    return [];
  }
}


export async function createQuestion(data: { text: string; options: { text: string; isCorrect: boolean }[] }) {
  const docClient = getClient();
  const id = Math.random().toString(36).substring(2, 15);
  const item = { id, ...data };
  await docClient.send(new PutCommand({ TableName: "questions", Item: item }));
  return item;
}

export async function updateQuestion(id: string, data: { text: string; options: { text: string; isCorrect: boolean }[] }) {
  const docClient = getClient();
  const item = { id, ...data };
  await docClient.send(new PutCommand({ TableName: "questions", Item: item }));
  return item;
}

export async function deleteQuestion(id: string) {
  const docClient = getClient();
  await docClient.send(new DeleteCommand({ TableName: "questions", Key: { id } }));
}

// Quiz Results
export async function saveQuizResult(data: {
  name: string;
  percentage: number;
  wish: string;
  story: string;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
}) {
  const docClient = getClient();
  const id = Math.random().toString(36).substring(2, 15);
  const item = { id, ...data, createdAt: new Date().toISOString() };
  
  console.log("Saving to DB:", JSON.stringify(item));
  
  await docClient.send(new PutCommand({ TableName: "quiz_results", Item: item }));
  return item;
}

export async function getQuizResults() {
  try {
    const docClient = getClient();
    const command = new ScanCommand({ TableName: "quiz_results" });
    const result = await docClient.send(command);
    const items = (result.Items || []).sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return items;
  } catch (error) {
    console.error("Error fetching results:", error);
    return [];
  }
}
