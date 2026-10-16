import { i as optionalFiniteNumberSchema, o as optionalPositiveIntegerSchema } from "./typebox-X-jU33BZ.mjs";
import "./channel-actions-DF1kQl0D.mjs";
import { Type } from "typebox";
//#region extensions/llm-task/src/llm-task-tool-definition.ts
const llmTaskToolDefinition = {
	name: "llm-task",
	label: "LLM Task",
	description: "Run a generic JSON-only LLM task and return schema-validated JSON. Designed for orchestration from Lobster workflows via openclaw.invoke.",
	parameters: Type.Object({
		prompt: Type.String({ description: "Task instruction for the LLM." }),
		input: Type.Optional(Type.Unknown({ description: "Optional input payload for the task." })),
		schema: Type.Optional(Type.Unknown({ description: "Optional JSON Schema to validate the returned JSON." })),
		provider: Type.Optional(Type.String({ description: "Provider override (e.g. openai, anthropic)." })),
		model: Type.Optional(Type.String({ description: "Model id override." })),
		thinking: Type.Optional(Type.String({ description: "Thinking level override." })),
		authProfileId: Type.Optional(Type.String({ description: "Auth profile override." })),
		temperature: optionalFiniteNumberSchema({ description: "Best-effort temperature override." }),
		maxTokens: optionalPositiveIntegerSchema({ description: "Best-effort maxTokens override." }),
		timeoutMs: optionalPositiveIntegerSchema({ description: "Timeout for the LLM run." })
	})
};
//#endregion
export { llmTaskToolDefinition as t };
