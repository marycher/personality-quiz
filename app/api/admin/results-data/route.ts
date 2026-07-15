import { NextResponse } from "next/server";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

export async function GET() {
  try {
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

    const command = new ScanCommand({ TableName: "quiz_results" });
    const result = await client.send(command);

    const items = (result.Items || []).map((item: any) => ({
      id: item.id.S,
      name: item.name.S,
      percentage: Number(item.percentage.N),
      wish: item.wish?.S || "",
      story: item.story?.S || "",
      createdAt: item.createdAt.S,
      answers: item.answers?.L?.map((a: any) => ({
        questionId: a.M.questionId.S,
        selectedIndex: Number(a.M.selectedIndex.N),
        isCorrect: a.M.isCorrect.BOOL,
      })) || [],
    }));

    items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
