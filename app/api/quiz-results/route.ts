import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    const docClient = DynamoDBDocumentClient.from(client);
    const id = Math.random().toString(36).substring(2, 15);
    const item = {
      id,
      name: body.name || "Аноним",
      percentage: body.percentage || 0,
      wish: body.wish || "",
      story: body.story || "",
      answers: body.answers || [],
      createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: "quiz_results",
      Item: item,
    }));

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
