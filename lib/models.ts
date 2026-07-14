import { getDbClient, isDatabaseAvailable } from "./db";
import { TableName } from "./schema";
import { GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { mockQuestions, mockQuizResults } from "./mock-data";

// Questions
export async function getQuestions() {
  if (!isDatabaseAvailable()) {
    return mockQuestions;
  }

  const client = getDbClient();
  const command = new ScanCommand({ TableName: TableName.QUESTIONS });
  const result = await client.send(command);

  return (result.Items || []) as any[];
}

export async function createQuestion(data: { text: string; options: { text: string; isCorrect: boolean }[] }) {
  const client = getDbClient();
  const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  const item = { id, ...data };

  const command = new PutCommand({
    TableName: TableName.QUESTIONS,
    Item: item,
  });

  await client.send(command);
  return item;
}

export async function updateQuestion(id: string, data: { text: string; options: { text: string; isCorrect: boolean }[] }) {
  const client = getDbClient();
  const command = new UpdateCommand({
    TableName: TableName.QUESTIONS,
    Key: { id },
    UpdateExpression: "SET #text = :text, #options = :options",
    ExpressionAttributeNames: {
      "#text": "text",
      "#options": "options",
    },
    ExpressionAttributeValues: {
      ":text": data.text,
      ":options": data.options,
    },
    ReturnValues: "ALL_NEW",
  });

  const result = await client.send(command);
  return result.Attributes;
}

export async function deleteQuestion(id: string) {
  const client = getDbClient();
  const command = new DeleteCommand({
    TableName: TableName.QUESTIONS,
    Key: { id },
  });

  await client.send(command);
}

// Quiz Results
export async function saveQuizResult(data: {
  name: string;
  percentage: number;
  wish: string;
  story: string;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
}) {
  const client = getDbClient();
  const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  const item = { id, ...data, createdAt: new Date().toISOString() };

  const command = new PutCommand({
    TableName: TableName.QUIZ_RESULTS,
    Item: item,
  });

  await client.send(command);
  return item;
}
