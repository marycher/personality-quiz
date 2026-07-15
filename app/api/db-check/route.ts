import { NextResponse } from "next/server";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

export async function GET() {
  try {
    const endpoint = process.env.DOCUMENT_API_ENDPOINT;
    const region = process.env.DOCUMENT_API_REGION || "ru-central1";
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    return NextResponse.json({
      hasEndpoint: !!endpoint,
      hasAccessKey: !!accessKeyId,
      hasSecretKey: !!secretAccessKey,
      region,
      endpoint: endpoint ? endpoint.substring(0, 50) + "..." : null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
