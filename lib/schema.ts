export const TableName = {
  QUESTIONS: "questions",
  QUIZ_RESULTS: "quiz_results",
} as const;

export const TABLE_SCHEMAS = [
  {
    TableName: TableName.QUESTIONS,
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    BillingMode: "PAY_PER_REQUEST" as const,
  },
  {
    TableName: TableName.QUIZ_RESULTS,
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    BillingMode: "PAY_PER_REQUEST" as const,
  },
];
