import { _ as LLAMA_CPP_PROVIDER_ID } from "./defaults-DX4XN2j1.mjs";
import { n as normalizeLlamaServerProviderConfig, o as LLAMA_SERVER_DISCOVERY_TIMEOUT_MS, r as resolveLlamaServerEndpoint } from "./provider-discovery-SxEYhgMV.mjs";
import { asOptionalRecord, asPositiveSafeInteger } from "openclaw/plugin-sdk/string-coerce-runtime";
import { isNonSecretApiKeyMarker } from "openclaw/plugin-sdk/provider-auth";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import { resolveConfiguredSecretInputString } from "openclaw/plugin-sdk/secret-input-runtime";
import { SELF_HOSTED_DEFAULT_CONTEXT_WINDOW, SELF_HOSTED_DEFAULT_COST, discoverOpenAICompatibleLocalModels } from "openclaw/plugin-sdk/provider-setup";
import { resolveDefaultModelMaxTokens } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/llama-cpp/src/external-server/auth.ts
async function resolveLlamaServerProviderHeaders(params) {
	const headers = asOptionalRecord(params.headers);
	if (!headers) return;
	const resolved = {};
	for (const [name, value] of Object.entries(headers)) {
		if (!params.config) {
			if (typeof value === "string" && value.trim()) resolved[name] = value.trim();
			continue;
		}
		const path = `models.providers.${LLAMA_CPP_PROVIDER_ID}.headers[${JSON.stringify(name)}]`;
		const header = await resolveConfiguredSecretInputString({
			config: params.config,
			env: params.env ?? process.env,
			value,
			path,
			unresolvedReasonStyle: "detailed"
		});
		if (header.unresolvedRefReason) throw new Error(`${path}: ${header.unresolvedRefReason}`);
		if (header.value) resolved[name] = header.value;
	}
	return Object.keys(resolved).length > 0 ? resolved : void 0;
}
async function resolveLlamaServerRuntimeApiKey(params) {
	const apiKey = (await resolveApiKeyForProvider({
		provider: LLAMA_CPP_PROVIDER_ID,
		cfg: params.config,
		agentDir: params.agentDir,
		profileId: params.profileId,
		lockedProfile: params.profileId !== void 0
	})).apiKey?.trim();
	return apiKey && !isNonSecretApiKeyMarker(apiKey) ? apiKey : void 0;
}
//#endregion
//#region extensions/llama-cpp/src/external-server/models.ts
function normalizeStatus(value) {
	switch (value) {
		case "unloaded":
		case "loading":
		case "loaded":
		case "sleeping":
		case "downloading": return value;
		default: return "unknown";
	}
}
function resolveMaxTokens(props, contextWindow) {
	const params = props?.default_generation_settings?.params;
	const advertised = asPositiveSafeInteger(params?.max_tokens) ?? asPositiveSafeInteger(params?.n_predict);
	return Math.min(advertised ?? resolveDefaultModelMaxTokens(contextWindow), contextWindow);
}
function resolveInput(row, props) {
	const advertised = row.architecture?.input_modalities;
	return Array.isArray(advertised) && advertised.includes("image") || props?.modalities?.vision === true ? ["text", "image"] : ["text"];
}
function buildCompat(props, useRuntimeDefaults) {
	const caps = props?.chat_template_caps;
	return {
		supportsStore: false,
		supportsDeveloperRole: false,
		supportsReasoningEffort: caps?.supports_reasoning_effort === true,
		supportsTemperature: true,
		supportsUsageInStreaming: true,
		...typeof caps?.supports_tool_calls === "boolean" || useRuntimeDefaults ? { supportsTools: caps?.supports_tool_calls === true } : {},
		supportsStrictMode: false,
		supportsJsonSchemaResponseFormat: true,
		requiresStringContent: caps?.supports_typed_content !== true,
		maxTokensField: "max_tokens"
	};
}
/** Maps one llama-server model row plus optional runtime properties into OpenClaw config. */
function mapLlamaServerModel(row, props, useRuntimeDefaults = true) {
	const id = typeof row.id === "string" ? row.id.trim() : "";
	if (!id || row.object !== void 0 && row.object !== "model") return null;
	const contextWindow = asPositiveSafeInteger(props?.default_generation_settings?.n_ctx) ?? asPositiveSafeInteger(props?.n_ctx) ?? (useRuntimeDefaults ? SELF_HOSTED_DEFAULT_CONTEXT_WINDOW : void 0);
	const compat = buildCompat(props, useRuntimeDefaults);
	return {
		config: {
			id,
			name: id,
			reasoning: compat.supportsReasoningEffort === true,
			input: resolveInput(row, props),
			cost: { ...SELF_HOSTED_DEFAULT_COST },
			contextWindow,
			contextTokens: contextWindow,
			maxTokens: resolveMaxTokens(props, contextWindow ?? SELF_HOSTED_DEFAULT_CONTEXT_WINDOW),
			compat
		},
		status: normalizeStatus(row.status?.value),
		failed: row.status?.failed === true
	};
}
function buildLlamaServerProviderConfig(params) {
	const baseUrl = resolveLlamaServerEndpoint(params.configured?.baseUrl).inferenceBaseUrl;
	const discoveredById = new Map(params.discoveredModels.map(({ config }) => [config.id, config]));
	const models = (params.configured?.models ?? []).map((configured) => {
		const discovered = discoveredById.get(configured.id);
		discoveredById.delete(configured.id);
		const matchesRoute = (!configured.api || configured.api === "openai-completions") && resolveLlamaServerEndpoint(configured.baseUrl?.trim() || baseUrl).inferenceBaseUrl === baseUrl;
		return discovered && matchesRoute ? Object.assign({}, discovered, configured, {
			contextWindow: configured.contextWindow ?? discovered.contextWindow,
			contextTokens: configured.contextTokens ?? discovered.contextTokens,
			compat: {
				...discovered.compat,
				...configured.compat
			}
		}) : configured;
	});
	models.push(...discoveredById.values());
	return normalizeLlamaServerProviderConfig({
		...params.configured,
		baseUrl,
		models
	});
}
//#endregion
//#region extensions/llama-cpp/src/external-server/discovery.ts
/** Discovers llama-server models without loading, waking, or unloading them. */
async function discoverLlamaServer(params) {
	const endpoint = resolveLlamaServerEndpoint(params.baseUrl);
	const result = await discoverOpenAICompatibleLocalModels({
		baseUrl: endpoint.inferenceBaseUrl,
		serverBaseUrl: endpoint.origin,
		allowPrivateNetwork: params.allowPrivateNetwork,
		apiKey: params.apiKey,
		headers: params.headers,
		label: "llama-server",
		healthPath: "/health",
		modelsPathOrder: "server-first",
		routerModelProps: true,
		timeoutMs: LLAMA_SERVER_DISCOVERY_TIMEOUT_MS,
		signal: params.signal,
		rawResult: true
	});
	if (result.kind !== "success") return {
		...result,
		endpoint
	};
	return {
		kind: "success",
		endpoint,
		models: result.rows.flatMap(({ model, props }) => {
			const mapped = mapLlamaServerModel(model, props, params.useRuntimeDefaults);
			return mapped ? [mapped] : [];
		})
	};
}
//#endregion
export { resolveLlamaServerRuntimeApiKey as i, buildLlamaServerProviderConfig as n, resolveLlamaServerProviderHeaders as r, discoverLlamaServer as t };
