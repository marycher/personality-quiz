import { DynamoDBClient, PutCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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
  const docClient = getClient();
  const command = new ScanCommand({ TableName: "questions" });
  const result = await docClient.send(command);
  return (result.Items || []) as any[];
}

export async function createQuestion(data: { text: string; options: { text: string; isCorrect: boolean }[] }) {
  const docClient = getClient();
  const id = Math.random().toString(36).substring(2, 15);
  const item = { id, ...data };

  await docClient.send(new PutCommand({
    TableName: "questions",
    Item: item,
  }));

  return item;
}

export async function updateQuestion(id: string, data: { text: string; options: { text: string; isCorrect: boolean }[] }) {
  const docClient = getClient();
  await docClient.send(new PutCommand({
    TableName: "questions",
    Item: { id, ...data },
  }));

  return { id, ...data };
}

export async function deleteQuestion(id: string) {
  const docClient = getClient();
  const { DeleteCommand } = await import("@aws-sdk/lib-dynamodb");
  await docClient.send(new DeleteCommand({
    TableName: "questions",
    Key: { id },
  }));
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

  await docClient.send(new PutCommand({
    TableName: "quiz_results",
    Item: item,
  }));

  return item;
}
