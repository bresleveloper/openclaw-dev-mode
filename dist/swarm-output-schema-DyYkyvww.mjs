import { n as validateJsonSchemaValue } from "./schema-validator-B9g4ZpIt.mjs";
//#region src/agents/subagents/swarm/swarm-output-schema.ts
function validateStructuredOutputSchema(schema) {
	try {
		validateJsonSchemaValue({
			schema,
			cacheKey: "swarm-output-schema-preflight",
			value: {},
			cache: false
		});
		return;
	} catch (error) {
		return `Invalid sessions_spawn outputSchema: ${error instanceof Error ? error.message : String(error)}`;
	}
}
//#endregion
export { validateStructuredOutputSchema as t };
