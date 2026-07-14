import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { TABLE_SCHEMAS } from "../lib/schema";

async function migrate() {
  const endpoint = process.env.DOCUMENT_API_ENDPOINT;
  const region = process.env.DOCUMENT_API_REGION || "ru-central1";

  const client = new DynamoDBClient({
    region,
    endpoint: endpoint || undefined,
  });

  const { TableNames } = await client.send(new ListTablesCommand({}));
  const existingTables = new Set(TableNames || []);

  for (const schema of TABLE_SCHEMAS) {
    if (!existingTables.has(schema.TableName)) {
      console.log(`Creating table: ${schema.TableName}`);
      await client.send(new CreateTableCommand(schema));
      console.log(`Table ${schema.TableName} created successfully`);
    } else {
      console.log(`Table ${schema.TableName} already exists`);
    }
  }

  console.log("Migration complete!");
}

migrate().catch(console.error);
