import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as asBoolean } from "./boolean-C30ltbL7.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { l as resolveRuntimeServiceVersion } from "./version-BkM1aB4w.mjs";
import { i as normalizePluginProviderBaseUrl, r as matchesPluginProviderEndpoint } from "./plugin-metadata-provider-facts-VzYAAmcr.mjs";
import { n as loadPluginMetadataSnapshotRuntime, t as getCurrentPluginMetadataSnapshotRequiredRuntime } from "./plugin-metadata-snapshot-required-CtdqzvuE.mjs";
//#region src/agents/provider-attribution.ts
function readCompatBoolean(compat, key) {
	if (!compat || typeof compat !== "object") return;
	return asBoolean(compat[key]);
}
const OPENCLAW_ATTRIBUTION_PRODUCT = "OpenClaw";
const OPENCLAW_ATTRIBUTION_ORIGINATOR = "openclaw";
const OPENROUTER_ATTRIBUTION_CATEGORIES = "cli-agent,cloud-agent,programming-app,creative-writing,writing-assistant,general-chat,personal-agent";
const LOCAL_ENDPOINT_HOSTS = /* @__PURE__ */ new Set([
	"localhost",
	"127.0.0.1",
	"::1",
	"[::1]"
]);
const OPENAI_RESPONSES_APIS = /* @__PURE__ */ new Set([
	"openai-responses",
	"azure-openai-responses",
	"openai-chatgpt-responses"
]);
const OPENAI_RESPONSES_PROVIDERS = /* @__PURE__ */ new Set([
	"openai",
	"azure-openai",
	"azure-openai-responses"
]);
function formatOpenClawUserAgent(version) {
	return `${OPENCLAW_ATTRIBUTION_ORIGINATOR}/${version}`;
}
function resolveUrlHostname(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	const candidate = /^[a-z0-9.[\]-]+(?::\d+)?(?:[/?#].*)?$/i.test(trimmed) ? `https://${trimmed}` : trimmed;
	try {
		return normalizeOptionalLowercaseString(new URL(candidate).hostname);
	} catch {
		return;
	}
}
function resolveProviderMetadataOwners(prepared) {
	const owners = prepared ?? getCurrentPluginMetadataSnapshotRequiredRuntime({ allowWorkspaceScopedSnapshot: true })?.owners ?? loadPluginMetadataSnapshotRuntime({ config: {} }).owners;
	return {
		providerEndpoints: owners.providerEndpoints ?? [],
		providerRequests: owners.providerRequests ?? /* @__PURE__ */ new Map()
	};
}
function resolveManifestProviderRequest(params) {
	return params.provider ? resolveProviderMetadataOwners(params.providerMetadataOwners).providerRequests.get(params.provider) : void 0;
}
function buildManifestEndpointResolution(endpoint, host) {
	const regionSuffix = endpoint.googleVertexRegionHostSuffix;
	const googleVertexRegion = endpoint.googleVertexRegion ?? (regionSuffix && host.endsWith(regionSuffix) ? host.slice(0, -regionSuffix.length) : void 0);
	return {
		endpointClass: endpoint.endpointClass,
		hostname: host,
		...googleVertexRegion ? { googleVertexRegion } : {}
	};
}
function resolveManifestProviderEndpoint(params) {
	for (const endpoint of resolveProviderMetadataOwners(params.providerMetadataOwners).providerEndpoints) if (matchesPluginProviderEndpoint(endpoint, params)) return buildManifestEndpointResolution(endpoint, params.host);
}
function isLocalEndpointHost(host) {
	return LOCAL_ENDPOINT_HOSTS.has(host) || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal");
}
function resolveProviderEndpoint(baseUrl, providerMetadataOwners) {
	if (typeof baseUrl !== "string" || !baseUrl.trim()) return { endpointClass: "default" };
	const host = resolveUrlHostname(baseUrl);
	if (!host) return { endpointClass: "invalid" };
	const manifestEndpoint = resolveManifestProviderEndpoint({
		host,
		normalizedBaseUrl: normalizePluginProviderBaseUrl(baseUrl),
		...providerMetadataOwners ? { providerMetadataOwners } : {}
	});
	if (manifestEndpoint) return manifestEndpoint;
	if (isLocalEndpointHost(host)) return {
		endpointClass: "local",
		hostname: host
	};
	return {
		endpointClass: "custom",
		hostname: host
	};
}
function resolveKnownProviderFamily(provider, providerMetadataOwners) {
	const manifestFamily = resolveManifestProviderRequest({
		provider,
		...providerMetadataOwners ? { providerMetadataOwners } : {}
	})?.family;
	if (manifestFamily) return manifestFamily;
	switch (provider) {
		case "openai":
		case "azure-openai":
		case "azure-openai-responses": return "openai-family";
		default: return provider || "unknown";
	}
}
function isOpenAIResponsesApi(api) {
	const normalizedApi = normalizeOptionalLowercaseString(api);
	return normalizedApi !== void 0 && OPENAI_RESPONSES_APIS.has(normalizedApi);
}
function isCanonicalOrLegacyOpenAIProvider(provider) {
	return provider === "openai";
}
function resolveProviderAttributionIdentity(env = process.env) {
	return {
		product: OPENCLAW_ATTRIBUTION_PRODUCT,
		version: resolveRuntimeServiceVersion(env)
	};
}
function buildOpenRouterAttributionPolicy(env = process.env) {
	const identity = resolveProviderAttributionIdentity(env);
	return {
		provider: "openrouter",
		enabledByDefault: true,
		verification: "vendor-documented",
		hook: "request-headers",
		docsUrl: "https://openrouter.ai/docs/app-attribution",
		reviewNote: "Documented app attribution headers. Verified in OpenClaw runtime wrapper.",
		...identity,
		headers: {
			"HTTP-Referer": "https://openclaw.ai",
			"X-OpenRouter-Title": identity.product,
			"X-OpenRouter-Categories": OPENROUTER_ATTRIBUTION_CATEGORIES
		}
	};
}
function buildNvidiaAttributionPolicy(env = process.env) {
	return {
		provider: "nvidia",
		enabledByDefault: true,
		verification: "vendor-documented",
		hook: "request-headers",
		reviewNote: "NVIDIA NIM billing invoke-origin attribution header. Applied only on verified NVIDIA routes.",
		...resolveProviderAttributionIdentity(env),
		headers: { "X-BILLING-INVOKE-ORIGIN": OPENCLAW_ATTRIBUTION_PRODUCT }
	};
}
function buildGoogleAttributionPolicy(env = process.env) {
	const identity = resolveProviderAttributionIdentity(env);
	return {
		provider: "google",
		enabledByDefault: true,
		verification: "vendor-documented",
		hook: "request-headers",
		docsUrl: "https://ai.google.dev/gemini-api/docs/partner-integration",
		reviewNote: "Gemini API partner integration guidance requires x-goog-api-client on partner and library traffic.",
		...identity,
		headers: { "x-goog-api-client": `${OPENCLAW_ATTRIBUTION_ORIGINATOR}/${identity.version}` }
	};
}
function buildOpenAIAttributionPolicy(env = process.env) {
	const identity = resolveProviderAttributionIdentity(env);
	return {
		provider: "openai",
		enabledByDefault: true,
		verification: "vendor-hidden-api-spec",
		hook: "request-headers",
		reviewNote: "OpenAI native traffic supports hidden originator/User-Agent attribution. Verified against the Codex wire contract.",
		...identity,
		headers: {
			originator: OPENCLAW_ATTRIBUTION_ORIGINATOR,
			version: identity.version,
			"User-Agent": formatOpenClawUserAgent(identity.version)
		}
	};
}
function buildOpenCodeGoAttributionPolicy(env) {
	const identity = resolveProviderAttributionIdentity(env);
	return {
		provider: "opencode-go",
		enabledByDefault: true,
		verification: "vendor-documented",
		hook: "request-headers",
		docsUrl: "https://opencode.ai/docs/go/",
		reviewNote: "OpenCode Go requires coding agents to identify themselves with a specific User-Agent.",
		...identity,
		headers: { "User-Agent": formatOpenClawUserAgent(identity.version) }
	};
}
function buildXaiAttributionPolicy(env = process.env) {
	const identity = resolveProviderAttributionIdentity(env);
	return {
		provider: "xai",
		enabledByDefault: true,
		verification: "vendor-hidden-api-spec",
		hook: "request-headers",
		reviewNote: "xAI api.x.ai accepts a standard openclaw User-Agent. Companion originator/version headers mirror the OpenAI attribution shape for consistency; they are not validated against an xAI-specific spec and are expected to be ignored by xAI's OpenAI-compatible surface.",
		...identity,
		headers: {
			originator: OPENCLAW_ATTRIBUTION_ORIGINATOR,
			version: identity.version,
			"User-Agent": formatOpenClawUserAgent(identity.version)
		}
	};
}
function buildSdkHookOnlyPolicy(provider, hook, reviewNote, env = process.env) {
	return {
		provider,
		enabledByDefault: false,
		verification: "vendor-sdk-hook-only",
		hook,
		reviewNote,
		...resolveProviderAttributionIdentity(env)
	};
}
function listProviderAttributionPolicies(env = process.env) {
	return [
		buildOpenRouterAttributionPolicy(env),
		buildNvidiaAttributionPolicy(env),
		buildGoogleAttributionPolicy(env),
		buildOpenAIAttributionPolicy(env),
		buildOpenCodeGoAttributionPolicy(env),
		buildXaiAttributionPolicy(env),
		buildSdkHookOnlyPolicy("anthropic", "default-headers", "Anthropic JS SDK exposes defaultHeaders, but app attribution is not yet verified.", env),
		buildSdkHookOnlyPolicy("groq", "default-headers", "Groq JS SDK exposes defaultHeaders, but app attribution is not yet verified.", env),
		buildSdkHookOnlyPolicy("mistral", "custom-user-agent", "Mistral JS SDK exposes a custom userAgent option, but app attribution is not yet verified.", env),
		buildSdkHookOnlyPolicy("together", "default-headers", "Together JS SDK exposes defaultHeaders, but app attribution is not yet verified.", env)
	];
}
function resolveProviderAttributionPolicy(provider, env = process.env) {
	const normalized = normalizeProviderId(provider ?? "");
	const canonical = normalized === "openai" ? "openai" : normalized;
	return listProviderAttributionPolicies(env).find((policy) => policy.provider === canonical);
}
function resolveProviderRequestPolicy(input, env = process.env) {
	const provider = normalizeProviderId(input.provider ?? "");
	const policy = resolveProviderAttributionPolicy(provider, env);
	const endpointClass = resolveProviderEndpoint(input.baseUrl, input.providerMetadataOwners).endpointClass;
	const usesConfiguredBaseUrl = endpointClass !== "default";
	const usesKnownNativeOpenAIEndpoint = endpointClass === "openai-public" || endpointClass === "openai" || endpointClass === "azure-openai";
	const usesVerifiedOpenAIAttributionHost = endpointClass === "openai-public" || endpointClass === "openai";
	const usesXaiNativeAttributionHost = endpointClass === "xai-native";
	const usesExplicitProxyLikeEndpoint = usesConfiguredBaseUrl && !usesKnownNativeOpenAIEndpoint;
	let attributionProvider;
	if (isCanonicalOrLegacyOpenAIProvider(provider) && usesVerifiedOpenAIAttributionHost) attributionProvider = "openai";
	else if (provider === "openrouter" && policy?.enabledByDefault) {
		if (endpointClass === "openrouter" || endpointClass === "default") attributionProvider = "openrouter";
	} else if (provider === "xai" && policy?.enabledByDefault) {
		if (usesXaiNativeAttributionHost || endpointClass === "default") attributionProvider = "xai";
	} else if (provider === "opencode-go" && policy?.enabledByDefault && endpointClass === "opencode-go-native") attributionProvider = "opencode-go";
	if (!attributionProvider && endpointClass === "nvidia-native") attributionProvider = "nvidia";
	if (!attributionProvider && endpointClass === "google-generative-ai") attributionProvider = "google";
	const attributionPolicy = attributionProvider ? resolveProviderAttributionPolicy(attributionProvider, env) : void 0;
	const attributionHeaders = attributionPolicy?.enabledByDefault ? attributionPolicy.headers : void 0;
	return {
		provider: provider || void 0,
		policy: attributionPolicy ?? policy,
		endpointClass,
		usesConfiguredBaseUrl,
		knownProviderFamily: resolveKnownProviderFamily(provider || void 0, input.providerMetadataOwners),
		attributionProvider,
		attributionHeaders,
		allowsHiddenAttribution: attributionProvider !== void 0 && attributionPolicy?.verification === "vendor-hidden-api-spec",
		usesKnownNativeOpenAIEndpoint,
		usesKnownNativeOpenAIRoute: endpointClass === "default" ? isCanonicalOrLegacyOpenAIProvider(provider) : usesKnownNativeOpenAIEndpoint,
		usesVerifiedOpenAIAttributionHost,
		usesExplicitProxyLikeEndpoint
	};
}
function resolveProviderRequestCapabilities(input, env = process.env) {
	const policy = resolveProviderRequestPolicy(input, env);
	const provider = policy.provider;
	const api = normalizeOptionalLowercaseString(input.api);
	const endpointClass = policy.endpointClass;
	const isKnownNativeEndpoint = endpointClass === "anthropic-public" || endpointClass === "cerebras-native" || endpointClass === "chutes-native" || endpointClass === "deepseek-native" || endpointClass === "github-copilot-native" || endpointClass === "groq-native" || endpointClass === "meta-native" || endpointClass === "mistral-public" || endpointClass === "minimax-native" || endpointClass === "moonshot-native" || endpointClass === "modelstudio-native" || endpointClass === "nvidia-native" || endpointClass === "openai-public" || endpointClass === "openai" || endpointClass === "opencode-native" || endpointClass === "opencode-go-native" || endpointClass === "azure-openai" || endpointClass === "openrouter" || endpointClass === "xai-native" || endpointClass === "xiaomi-native" || endpointClass === "zai-native" || endpointClass === "google-generative-ai" || endpointClass === "google-vertex";
	const manifestProviderRequest = resolveManifestProviderRequest({
		provider,
		...input.providerMetadataOwners ? { providerMetadataOwners: input.providerMetadataOwners } : {}
	});
	const compatibilityFamily = manifestProviderRequest?.compatibilityFamily;
	const isResponsesApi = isOpenAIResponsesApi(api);
	const promptCacheKeySupport = readCompatBoolean(input.compat, "supportsPromptCacheKey");
	const shouldStripResponsesPromptCache = promptCacheKeySupport === true ? false : promptCacheKeySupport === false ? isResponsesApi : isResponsesApi && policy.usesExplicitProxyLikeEndpoint;
	return {
		...policy,
		isKnownNativeEndpoint,
		allowsOpenAIServiceTier: isCanonicalOrLegacyOpenAIProvider(provider) && api === "openai-responses" && endpointClass === "openai-public" || isCanonicalOrLegacyOpenAIProvider(provider) && (api === "openai-chatgpt-responses" || api === "openai-responses") && endpointClass === "openai",
		supportsOpenAIReasoningCompatPayload: provider !== void 0 && api !== void 0 && !policy.usesExplicitProxyLikeEndpoint && (isCanonicalOrLegacyOpenAIProvider(provider) || provider === "azure-openai" || provider === "azure-openai-responses") && (api === "openai-completions" || api === "openai-responses" || api === "openai-chatgpt-responses" || api === "azure-openai-responses"),
		allowsAnthropicServiceTier: provider === "anthropic" && api === "anthropic-messages" && (endpointClass === "default" || endpointClass === "anthropic-public"),
		supportsResponsesStoreField: readCompatBoolean(input.compat, "supportsStore") !== false && isResponsesApi,
		allowsResponsesStore: readCompatBoolean(input.compat, "supportsStore") !== false && provider !== void 0 && isResponsesApi && OPENAI_RESPONSES_PROVIDERS.has(provider) && policy.usesKnownNativeOpenAIEndpoint,
		shouldStripResponsesPromptCache,
		supportsNativeStreamingUsageCompat: endpointClass === "moonshot-native" || endpointClass === "modelstudio-native",
		supportsOpenAICompletionsStreamingUsageCompat: manifestProviderRequest?.openAICompletions?.supportsStreamingUsage === true,
		compatibilityFamily
	};
}
function describeProviderRequestRoutingPolicy(policy) {
	if (!policy.attributionProvider) return "none";
	switch (policy.policy?.verification) {
		case "vendor-hidden-api-spec": return "hidden";
		case "vendor-documented": return "documented";
		case "vendor-sdk-hook-only": return "sdk-hook-only";
		default: return "none";
	}
}
function describeProviderRequestRouteClass(policy) {
	if (policy.endpointClass === "default") return "default";
	if (policy.endpointClass === "invalid") return "invalid";
	if (policy.endpointClass === "local") return "local";
	if (policy.endpointClass === "custom" || policy.endpointClass === "openrouter") return "proxy-like";
	return "native";
}
function describeProviderRequestRoutingSummary(input, env = process.env) {
	const policy = resolveProviderRequestPolicy(input, env);
	const api = normalizeOptionalLowercaseString(input.api) ?? "unknown";
	const provider = policy.provider ?? "unknown";
	const routeClass = describeProviderRequestRouteClass(policy);
	const routingPolicy = describeProviderRequestRoutingPolicy(policy);
	return [
		`provider=${provider}`,
		`api=${api}`,
		`endpoint=${policy.endpointClass}`,
		`route=${routeClass}`,
		`policy=${routingPolicy}`
	].join(" ");
}
//#endregion
export { resolveProviderRequestPolicy as i, resolveProviderEndpoint as n, resolveProviderRequestCapabilities as r, describeProviderRequestRoutingSummary as t };
