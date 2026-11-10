import { r as createLazyRuntimeModule } from "../../lazy-runtime-CJrzFzqU.mjs";
import { o as optionalPositiveIntegerSchema } from "../../typebox-DhJiP5MZ.mjs";
import "../../channel-actions-CaJbCkxs.mjs";
import { t as defineToolPlugin } from "../../tool-plugin-57isMP90.mjs";
import { t as llmTaskToolDefinition } from "../../llm-task-tool-definition-CMcAfH7a.mjs";
import { Type } from "typebox";
//#region extensions/llm-task/index.ts
function createLazyLlmTaskTool(api) {
	const loadTool = createLazyRuntimeModule(() => import("../../llm-task-tool-vv6cSakT.mjs").then(({ createLlmTaskTool }) => createLlmTaskTool(api)));
	return {
		...llmTaskToolDefinition,
		execute: async (id, params, signal) => await (await loadTool()).execute(id, params, signal)
	};
}
var llm_task_default = defineToolPlugin({
	id: "llm-task",
	name: "LLM Task",
	description: "Generic JSON-only LLM tool for structured tasks callable from workflows.",
	configSchema: Type.Object({
		defaultProvider: Type.Optional(Type.String()),
		defaultModel: Type.Optional(Type.String()),
		defaultAuthProfileId: Type.Optional(Type.String()),
		maxTokens: optionalPositiveIntegerSchema(),
		timeoutMs: optionalPositiveIntegerSchema()
	}, { additionalProperties: false }),
	tools: (tool) => [tool({
		...llmTaskToolDefinition,
		optional: true,
		factory: ({ api }) => createLazyLlmTaskTool(api)
	})]
});
//#endregion
export { llm_task_default as default };
