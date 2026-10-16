import { l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { d as asPositiveSafeInteger } from "./number-coercion-CuVhdCBs.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-BZeDVoch.mjs";
import { n as validateJsonSchemaValue } from "./schema-validator-qnYkiHpy.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
import { s as readFiniteNumberParam, u as readPositiveIntegerParam } from "./common-Dyxcwsy8.mjs";
import "./json-schema-runtime-WxokAVVM.mjs";
import "./agent-runtime-BhLWDirV.mjs";
import "./param-readers-B4Zo5Lzz.mjs";
import { t as llmTaskToolDefinition } from "./llm-task-tool-definition-C8MMPIHF.mjs";
//#region extensions/llm-task/src/llm-task-tool.ts
function stripCodeFences(s) {
	const trimmed = s.trim();
	const m = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
	if (m) return (m[1] ?? "").trim();
	return trimmed;
}
function resolveLlmTaskModelRef(params) {
	const defaultProvider = normalizeOptionalString(params.provider) ?? normalizeOptionalString(params.api.runtime.agent.defaults.provider);
	const rawModel = normalizeOptionalString(params.rawModel);
	const providerPrefix = params.provider?.trim();
	const selectedModelRef = {
		provider: params.provider,
		model: providerPrefix && rawModel?.startsWith(`${providerPrefix}/`) ? rawModel.slice(providerPrefix.length + 1) : rawModel
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
function createLlmTaskTool(api) {
	return {
		...llmTaskToolDefinition,
		async execute(_id, args, signal) {
			const params = args;
			const prompt = typeof params.prompt === "string" ? params.prompt : "";
			if (!prompt.trim()) throw new Error("prompt required");
			const pluginCfg = api.pluginConfig ?? {};
			const defaultsModel = api.config?.agents?.defaults?.model;
			const primary = typeof defaultsModel === "string" ? normalizeOptionalString(defaultsModel) : normalizeOptionalString(defaultsModel?.primary);
			const primaryProvider = typeof primary === "string" ? primary.split("/")[0] : void 0;
			const primaryModel = typeof primary === "string" ? primary.split("/").slice(1).join("/") : void 0;
			const requestProvider = normalizeOptionalString(params.provider);
			const configuredProvider = normalizeOptionalString(pluginCfg.defaultProvider);
			const requestModel = normalizeOptionalString(params.model);
			const configuredModel = normalizeOptionalString(pluginCfg.defaultModel);
			const requestedProvider = requestProvider || configuredProvider || primaryProvider || void 0;
			const rawModel = requestModel || configuredModel || primaryModel || void 0;
			const hasModelOverride = Boolean(requestProvider || configuredProvider || requestModel || configuredModel);
			const { provider, model } = resolveLlmTaskModelRef({
				api,
				provider: requestedProvider,
				rawModel,
				preserveProvider: Boolean(requestProvider || !requestModel && configuredProvider)
			});
			const authProfileId = normalizeOptionalString(params.authProfileId) ?? normalizeOptionalString(pluginCfg.defaultAuthProfileId);
			const providerId = provider?.trim();
			const modelId = model?.trim();
			if (!providerId || !modelId) throw new Error(`provider/model could not be resolved (provider=${provider ?? ""}, model=${model ?? ""})`);
			const thinkingRaw = readNonBlankString(params.thinking);
			const thinkLevel = thinkingRaw ? api.runtime.agent.normalizeThinkingLevel(thinkingRaw) : void 0;
			if (thinkingRaw && !thinkLevel) throw new Error(`Invalid thinking level "${thinkingRaw}".`);
			const timeoutMs = readPositiveIntegerParam(params, "timeoutMs") ?? asPositiveSafeInteger(pluginCfg.timeoutMs) ?? 3e4;
			const temperature = readFiniteNumberParam(params, "temperature");
			const maxTokens = readPositiveIntegerParam(params, "maxTokens") ?? asPositiveSafeInteger(pluginCfg.maxTokens);
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
				model: hasModelOverride ? `${providerId}/${modelId}` : void 0,
				reasoning: thinkLevel,
				maxTokens,
				temperature,
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
			return textResult(JSON.stringify(parsed, null, 2), {
				json: parsed,
				provider: result.provider,
				model: result.model
			});
		}
	};
}
//#endregion
export { createLlmTaskTool };
