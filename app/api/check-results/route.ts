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

    return NextResponse.json({
      count: result.Items?.length || 0,
      items: result.Items,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
