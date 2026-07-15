11:06:39.265 Running build in Washington, D.C., USA (East) – iad1
11:06:39.269 Build machine configuration: 2 cores, 8 GB
11:06:39.564 Cloning github.com/marycher/personality-quiz (Branch: main, Commit: 15b3d55)
11:06:40.665 Cloning completed: 1.101s
11:06:41.311 Restored build cache from previous deployment (9sQyHhp6QkiQrMu7RCvXb2UermCm)
11:06:41.787 Running "vercel build"
11:06:41.828 Vercel CLI 56.2.0
11:06:42.543 Installing dependencies...
11:06:44.857 
11:06:44.858 up to date in 2s
11:06:44.858 
11:06:44.859 162 packages are looking for funding
11:06:44.859   run `npm fund` for details
11:06:44.906 Detected Next.js version: 14.2.35
11:06:44.913 Running "npm run build"
11:06:45.071 
11:06:45.071 > personality-quiz@1.0.0 build
11:06:45.072 > next build
11:06:45.072 
11:06:46.032   ▲ Next.js 14.2.35
11:06:46.035 
11:06:46.058    Creating an optimized production build ...
11:07:12.566  ✓ Compiled successfully
11:07:12.568    Linting and checking validity of types ...
11:07:21.427 Failed to compile.
11:07:21.428 
11:07:21.430 ./app/api/migrate/route.ts:27:50
11:07:21.430 Type error: No overload matches this call.
11:07:21.431   Overload 1 of 2, '(input: CreateTableCommandInput): CreateTableCommand', gave the following error.
11:07:21.431     Argument of type '{ TableName: "questions"; KeySchema: { AttributeName: string; KeyType: string; }[]; AttributeDefinitions: { AttributeName: string; AttributeType: string; }[]; BillingMode: "PAY_PER_REQUEST"; } | { ...; }' is not assignable to parameter of type 'CreateTableCommandInput'.
11:07:21.432       Type '{ TableName: "questions"; KeySchema: { AttributeName: string; KeyType: string; }[]; AttributeDefinitions: { AttributeName: string; AttributeType: string; }[]; BillingMode: "PAY_PER_REQUEST"; }' is not assignable to type 'CreateTableCommandInput'.
11:07:21.432         Types of property 'AttributeDefinitions' are incompatible.
11:07:21.433           Type '{ AttributeName: string; AttributeType: string; }[]' is not assignable to type 'AttributeDefinition[]'.
11:07:21.434             Type '{ AttributeName: string; AttributeType: string; }' is not assignable to type 'AttributeDefinition'.
11:07:21.435               Types of property 'AttributeType' are incompatible.
11:07:21.435                 Type 'string' is not assignable to type 'ScalarAttributeType | undefined'.
11:07:21.436   Overload 2 of 2, '(input: CreateTableCommandInput): CreateTableCommand', gave the following error.
11:07:21.436     Argument of type '{ TableName: "questions"; KeySchema: { AttributeName: string; KeyType: string; }[]; AttributeDefinitions: { AttributeName: string; AttributeType: string; }[]; BillingMode: "PAY_PER_REQUEST"; } | { ...; }' is not assignable to parameter of type 'CreateTableCommandInput'.
11:07:21.437       Type '{ TableName: "questions"; KeySchema: { AttributeName: string; KeyType: string; }[]; AttributeDefinitions: { AttributeName: string; AttributeType: string; }[]; BillingMode: "PAY_PER_REQUEST"; }' is not assignable to type 'CreateTableCommandInput'.
11:07:21.437         Types of property 'AttributeDefinitions' are incompatible.
11:07:21.438           Type '{ AttributeName: string; AttributeType: string; }[]' is not assignable to type 'AttributeDefinition[]'.
11:07:21.438             Type '{ AttributeName: string; AttributeType: string; }' is not assignable to type 'AttributeDefinition'.
11:07:21.439               Types of property 'AttributeType' are incompatible.
11:07:21.439                 Type 'string' is not assignable to type 'ScalarAttributeType | undefined'.
11:07:21.439 
11:07:21.440   25 |     for (const schema of TABLE_SCHEMAS) {
11:07:21.440   26 |       if (!existingTables.has(schema.TableName)) {
11:07:21.441 > 27 |         await client.send(new CreateTableCommand(schema));
11:07:21.441      |                                                  ^
11:07:21.442   28 |         created.push(schema.TableName);
11:07:21.442   29 |       } else {
11:07:21.442   30 |         alreadyExists.push(schema.TableName);
11:07:21.485 Next.js build worker exited with code: 1 and signal: null
11:07:21.533 Error: Command "npm run build" exited with 1