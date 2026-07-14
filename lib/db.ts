import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let docClient: DynamoDBDocumentClient | null = null;

function createClient() {
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

export function getDbClient(): DynamoDBDocumentClient {
  if (!docClient) {
    docClient = createClient();
  }
  return docClient;
}

export function isDatabaseAvailable(): boolean {
  return process.env.USE_DATABASE === "true";
}
