import { d as asPositiveSafeInteger } from "../../number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "../../model-selection-shared-0uvJbX1M.mjs";
import { n as validateJsonSchemaValue } from "../../schema-validator-G8odGT6Q.mjs";
import { c as readFiniteNumberParam, d as readPositiveIntegerParam } from "../../common-XfKigJno.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { i as optionalFiniteNumberSchema, o as optionalPositiveIntegerSchema } from "../../typebox-DIBvVmm8.mjs";
import "../../json-schema-runtime-ty5aNvzs.mjs";
import "../../agent-runtime-BXs_VkH-.mjs";
import "../../channel-actions-BjxmEiuN.mjs";
import "../../param-readers-BfezLD6d.mjs";
import { t as defineToolPlugin } from "../../tool-plugin-odJvsmEs.mjs";
import { Type } from "typebox";
//#region extensions/llm-task/src/llm-task-tool.ts
function stripCodeFences(s) {
	const trimmed = s.trim();
	const m = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
	if (m) return (m[1] ?? "").trim();
	return trimmed;
}
function toModelKey(provider, model) {
	const p = provider?.trim();
	const m = model?.trim();
	if (!p || !m) return;
	return `${p}/${m}`;
}
function stripDuplicateProviderPrefix(provider, model) {
	const p = provider?.trim();
	const m = model?.trim();
	if (!p || !m) return m || void 0;
	const prefix = `${p}/`;
	return m.startsWith(prefix) ? m.slice(prefix.length) : m;
}
function resolveLlmTaskModelRef(params) {
	const defaultProvider = normalizeOptionalString(params.provider) ?? normalizeOptionalString(params.api.runtime.agent.defaults.provider);
	const rawModel = normalizeOptionalString(params.rawModel);
	const selectedModelRef = {
		provider: params.provider,
		model: stripDuplicateProviderPrefix(params.provider, rawModel)
	};
	if (!rawModel || !defaultProvider) return selectedModelRef;
	const cfg = params.api.config;
	const aliasIndex = cfg ? buildModelAliasIndex({
		cfg,
		defaultProvider
	}) : void 0;
	const resolved = resolveModelRefFromString({
		cfg,
		raw: rawModel,
		defaultProvider,
		aliasIndex
	});
	if (params.preserveProvider && !resolved?.alias) return selectedModelRef;
	return resolved?.ref ?? selectedModelRef;
}
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
function createLlmTaskTool(api) {
	return {
		...llmTaskToolDefinition,
		async execute(_id, params, signal) {
			const prompt = typeof params.prompt === "string" ? params.prompt : "";
			if (!prompt.trim()) throw new Error("prompt required");
			const pluginCfg = api.pluginConfig ?? {};
			const defaultsModel = api.config?.agents?.defaults?.model;
			const primary = typeof defaultsModel === "string" ? normalizeOptionalString(defaultsModel) : normalizeOptionalString(defaultsModel?.primary);
			const primaryProvider = typeof primary === "string" ? primary.split("/")[0] : void 0;
			const primaryModel = typeof primary === "string" ? primary.split("/").slice(1).join("/") : void 0;
			const requestProvider = typeof params.provider === "string" ? params.provider.trim() : void 0;
			const configuredProvider = typeof pluginCfg.defaultProvider === "string" ? pluginCfg.defaultProvider.trim() : void 0;
			const requestModel = typeof params.model === "string" ? params.model.trim() : void 0;
			const configuredModel = typeof pluginCfg.defaultModel === "string" ? pluginCfg.defaultModel.trim() : void 0;
			const requestedProvider = requestProvider || configuredProvider || primaryProvider || void 0;
			const rawModel = requestModel || configuredModel || primaryModel || void 0;
			const hasModelOverride = Boolean(requestProvider || configuredProvider || requestModel || configuredModel);
			const { provider, model } = resolveLlmTaskModelRef({
				api,
				provider: requestedProvider,
				rawModel,
				preserveProvider: Boolean(requestProvider || !requestModel && configuredProvider)
			});
			const authProfileId = typeof params.authProfileId === "string" && params.authProfileId.trim() || typeof pluginCfg.defaultAuthProfileId === "string" && pluginCfg.defaultAuthProfileId.trim() || void 0;
			const modelKey = toModelKey(provider, model);
			if (!provider || !model || !modelKey) throw new Error(`provider/model could not be resolved (provider=${provider ?? ""}, model=${model ?? ""})`);
			const thinkingRaw = typeof params.thinking === "string" && params.thinking.trim() ? params.thinking : void 0;
			let thinkLevel = void 0;
			if (thinkingRaw) {
				thinkLevel = api.runtime.agent.normalizeThinkingLevel(thinkingRaw);
				if (!thinkLevel) throw new Error(`Invalid thinking level "${thinkingRaw}".`);
			}
			const timeoutMs = readPositiveIntegerParam(params, "timeoutMs") ?? asPositiveSafeInteger(pluginCfg.timeoutMs) ?? 3e4;
			const streamParams = {
				temperature: readFiniteNumberParam(params, "temperature"),
				maxTokens: readPositiveIntegerParam(params, "maxTokens") ?? asPositiveSafeInteger(pluginCfg.maxTokens)
			};
			const input = params.input;
			let inputJson;
			try {
				inputJson = JSON.stringify(input ?? null, null, 2);
			} catch {
				throw new Error("input must be JSON-serializable");
			}
			const system = [
				"You are a JSON-only function.",
				"Return ONLY a valid JSON value.",
				"Do not wrap in markdown fences.",
				"Do not include commentary.",
				"Do not call tools."
			].join(" ");
			const result = await api.runtime.llm.complete({
				messages: [{
					role: "user",
					content: `TASK:\n${prompt}\n\nINPUT_JSON:\n${inputJson}\n`
				}],
				systemPrompt: system,
				model: hasModelOverride ? modelKey : void 0,
				reasoning: thinkLevel,
				maxTokens: streamParams.maxTokens,
				temperature: streamParams.temperature,
				signal,
				purpose: "llm-task",
				execution: {
					mode: "isolated-agent-runtime",
					authProfileId,
					timeoutMs
				}
			});
			const raw = stripCodeFences(result.text);
			let parsed;
			try {
				parsed = JSON.parse(raw);
			} catch {
				throw new Error("LLM returned invalid JSON");
			}
			const schema = params.schema;
			if (schema && typeof schema === "object" && !Array.isArray(schema)) {
				const validation = validateJsonSchemaValue({
					schema,
					cacheKey: "llm-task.result",
					value: parsed,
					cache: false
				});
				if (!validation.ok) {
					const msg = validation.errors.map((error) => error.text).join("; ") || "invalid";
					throw new Error(`LLM JSON did not match schema: ${msg}`);
				}
			}
			return {
				content: [{
					type: "text",
					text: JSON.stringify(parsed, null, 2)
				}],
				details: {
					json: parsed,
					provider: result.provider,
					model: result.model
				}
			};
		}
	};
}
//#endregion
//#region extensions/llm-task/index.ts
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
		factory: ({ api }) => createLlmTaskTool(api)
	})]
});
//#endregion
export { llm_task_default as default };
