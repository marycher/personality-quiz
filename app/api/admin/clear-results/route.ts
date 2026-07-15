import { NextResponse } from "next/server";
import { DynamoDBClient, ScanCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

export async function POST() {
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

    const { Items } = await client.send(new ScanCommand({ TableName: "quiz_results" }));
    let deleted = 0;

    for (const item of Items || []) {
      await client.send(new DeleteItemCommand({
        TableName: "quiz_results",
        Key: { id: item.id },
      }));
      deleted++;
    }

    return NextResponse.json({ deleted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
