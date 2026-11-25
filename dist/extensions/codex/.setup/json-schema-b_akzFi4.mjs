import { z } from "zod";
// extensions/codex/src/app-server/json-schema.ts
const jsonValueSchema = z.lazy(() => z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
	z.array(jsonValueSchema),
	z.record(z.string(), jsonValueSchema)
]));
const jsonObjectSchema = z.record(z.string(), jsonValueSchema);
export { jsonValueSchema as n, jsonObjectSchema as t };
