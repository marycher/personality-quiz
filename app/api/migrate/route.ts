import { NextResponse } from "next/server";
import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";

const TABLE_SCHEMAS = [
  {
    TableName: "questions",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    BillingMode: "PAY_PER_REQUEST",
  },
  {
    TableName: "quiz_results",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    BillingMode: "PAY_PER_REQUEST",
  },
];

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

    const { TableNames } = await client.send(new ListTablesCommand({}));
    const existingTables = new Set(TableNames || []);
    const created: string[] = [];
    const alreadyExists: string[] = [];

    for (const schema of TABLE_SCHEMAS) {
      if (!existingTables.has(schema.TableName)) {
        await client.send(new CreateTableCommand(schema as any));
        created.push(schema.TableName);
      } else {
        alreadyExists.push(schema.TableName);
      }
    }

    return NextResponse.json({
      message: "Migration complete",
      created,
      alreadyExists,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
