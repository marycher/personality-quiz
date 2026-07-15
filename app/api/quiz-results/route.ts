import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";

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

    const id = Math.random().toString(36).substring(2, 15);
    const item = {
      id: { S: id },
      name: { S: body.name || "Аноним" },
      percentage: { N: String(body.percentage || 0) },
      wish: { S: body.wish || "" },
      story: { S: body.story || "" },
      answers: { L: (body.answers || []).map((a: any) => ({
        M: {
          questionId: { S: a.questionId || "" },
          selectedIndex: { N: String(a.selectedIndex || 0) },
          isCorrect: { BOOL: a.isCorrect || false },
        }
      })) },
      createdAt: { S: new Date().toISOString() },
    };

    await client.send(new PutItemCommand({
      TableName: "quiz_results",
      Item: item,
    }));

    // Проверяем, что запись появилась
    const check = await client.send(new ScanCommand({ TableName: "quiz_results" }));
    
    return NextResponse.json({ 
      success: true, 
      id, 
      totalRecords: check.Items?.length || 0 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
