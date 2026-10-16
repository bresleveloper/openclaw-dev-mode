import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as asBoolean } from "./boolean-BEb0Fdt8.mjs";
import { l as resolveRuntimeServiceVersion } from "./version-BJGPJZu6.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as normalizePluginProviderBaseUrl, r as matchesPluginProviderEndpoint } from "./plugin-metadata-provider-facts-Bs366hg9.mjs";
import { n as loadPluginMetadataSnapshotRuntime, t as getCurrentPluginMetadataSnapshotRequiredRuntime } from "./plugin-metadata-snapshot-required-CHFOr4pK.mjs";
//#region src/agents/provider-attribution.ts
function readCompatBoolean(compat, key) {
	if (!compat || typeof compat !== "object") return;
	return asBoolean(compat[key]);
}
const OPENCLAW_ATTRIBUTION_PRODUCT = "OpenClaw";
const OPENCLAW_ATTRIBUTION_ORIGINATOR = "openclaw";
const OPENROUTER_ATTRIBUTION_CATEGORIES = "personal-agent,cli-agent";
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
function resolveUrlHostname(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	const candidate = /^[a-z0-9.[\]-]+(?::\d+)?(?:[/?#].*)?$/i.test(trimmed) ? `https://${trimmed}` : trimmed;
	return normalizeOptionalLowercaseString(URL.parse(candidate)?.hostname);
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
/** Classify loopback and private-network endpoint names without loading plugin metadata. */
function isLocalProviderEndpoint(baseUrl) {
	const host = resolveUrlHostname(baseUrl);
	return host !== void 0 && isLocalEndpointHost(host);
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
	return provider && OPENAI_RESPONSES_PROVIDERS.has(provider) ? "openai-family" : provider || "unknown";
}
function resolveProviderAttributionPolicy(provider, env = process.env) {
	const normalized = normalizeProviderId(provider ?? "");
	const version = resolveRuntimeServiceVersion(env);
	const userAgent = `${OPENCLAW_ATTRIBUTION_ORIGINATOR}/${version}`;
	const policy = {
		provider: normalized,
		enabledByDefault: true,
		verification: "vendor-documented",
		hook: "request-headers",
		product: OPENCLAW_ATTRIBUTION_PRODUCT,
		version
	};
	switch (normalized) {
		case "openrouter": return {
			...policy,
			docsUrl: "https://openrouter.ai/docs/app-attribution",
			reviewNote: "Documented app attribution headers. Applied on OpenRouter endpoints regardless of configured provider id.",
			headers: {
				"HTTP-Referer": "https://openclaw.ai",
				"X-OpenRouter-Title": policy.product,
				"X-OpenRouter-Categories": OPENROUTER_ATTRIBUTION_CATEGORIES
			}
		};
		case "nvidia": return {
			...policy,
			reviewNote: "NVIDIA NIM billing invoke-origin attribution header. Applied only on verified NVIDIA routes.",
			headers: { "X-BILLING-INVOKE-ORIGIN": policy.product }
		};
		case "google": return {
			...policy,
			docsUrl: "https://ai.google.dev/gemini-api/docs/partner-integration",
			reviewNote: "Gemini API partner integration guidance requires x-goog-api-client on partner and library traffic.",
			headers: { "x-goog-api-client": userAgent }
		};
		case "vercel-ai-gateway": return {
			...policy,
			docsUrl: "https://vercel.com/docs/ai-gateway/ecosystem/app-attribution",
			reviewNote: "Vercel documents: \"AI Gateway reads two request headers when present: http-referer … x-title\". Applied on ai-gateway.vercel.sh regardless of configured provider id.",
			headers: {
				"HTTP-Referer": "https://openclaw.ai",
				"X-Title": policy.product
			}
		};
		case "perplexity": return {
			...policy,
			docsUrl: "https://docs.perplexity.ai/docs/getting-started/integrations/opencode",
			reviewNote: "Perplexity documents integrations identifying themselves with \"X-Pplx-Integration\": \"<client>/<version>\". Applied only on the direct Perplexity API.",
			headers: { "X-Pplx-Integration": userAgent }
		};
		case "openai":
		case "xai": return {
			...policy,
			verification: "vendor-hidden-api-spec",
			reviewNote: normalized === "openai" ? "OpenAI native traffic supports hidden originator/User-Agent attribution. Verified against the Codex wire contract." : "xAI api.x.ai accepts a standard openclaw User-Agent. Companion originator/version headers mirror the OpenAI attribution shape for consistency; they are not validated against an xAI-specific spec and are expected to be ignored by xAI's OpenAI-compatible surface.",
			headers: {
				originator: OPENCLAW_ATTRIBUTION_ORIGINATOR,
				version,
				"User-Agent": userAgent
			}
		};
		case "opencode-go": return {
			...policy,
			docsUrl: "https://opencode.ai/docs/go/",
			reviewNote: "OpenCode Go requires coding agents to identify themselves with a specific User-Agent.",
			headers: { "User-Agent": userAgent }
		};
		case "anthropic":
		case "groq":
		case "together":
		case "mistral": {
			const reviewNotes = {
				anthropic: "Anthropic JS SDK exposes defaultHeaders, but app attribution is not yet verified.",
				groq: "Groq JS SDK exposes defaultHeaders, but app attribution is not yet verified.",
				together: "Together JS SDK exposes defaultHeaders, but app attribution is not yet verified.",
				mistral: "Mistral JS SDK exposes a custom userAgent option, but app attribution is not yet verified."
			};
			return {
				...policy,
				enabledByDefault: false,
				verification: "vendor-sdk-hook-only",
				hook: normalized === "mistral" ? "custom-user-agent" : "default-headers",
				reviewNote: reviewNotes[normalized]
			};
		}
		default: return;
	}
}
function resolveProviderRequestPolicy(input, env = process.env) {
	const provider = normalizeProviderId(input.provider ?? "");
	const policy = resolveProviderAttributionPolicy(provider, env);
	const endpointClass = resolveProviderEndpoint(input.baseUrl, input.providerMetadataOwners).endpointClass;
	const usesConfiguredBaseUrl = endpointClass !== "default";
	const usesKnownNativeOpenAIEndpoint = endpointClass === "openai-public" || endpointClass === "openai" || endpointClass === "azure-openai";
	const usesVerifiedOpenAIAttributionHost = endpointClass === "openai-public" || endpointClass === "openai";
	const usesExplicitProxyLikeEndpoint = usesConfiguredBaseUrl && !usesKnownNativeOpenAIEndpoint;
	let attributionProvider;
	if (provider === "openai" && usesVerifiedOpenAIAttributionHost) attributionProvider = "openai";
	else if (provider === "xai" && policy?.enabledByDefault) {
		if (endpointClass === "xai-native" || endpointClass === "default") attributionProvider = "xai";
	} else if (provider === "opencode-go" && policy?.enabledByDefault && endpointClass === "opencode-go-native") attributionProvider = "opencode-go";
	if (!attributionProvider && (endpointClass === "openrouter" || provider === "openrouter" && endpointClass === "default")) attributionProvider = "openrouter";
	if (!attributionProvider && (endpointClass === "vercel-ai-gateway" || provider === "vercel-ai-gateway" && endpointClass === "default")) attributionProvider = "vercel-ai-gateway";
	if (!attributionProvider && provider === "perplexity" && endpointClass === "default") attributionProvider = "perplexity";
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
		usesKnownNativeOpenAIRoute: endpointClass === "default" ? provider === "openai" : usesKnownNativeOpenAIEndpoint,
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
	const isResponsesApi = api !== void 0 && OPENAI_RESPONSES_APIS.has(api);
	const promptCacheKeySupport = readCompatBoolean(input.compat, "supportsPromptCacheKey");
	const shouldStripResponsesPromptCache = promptCacheKeySupport === true ? false : promptCacheKeySupport === false ? isResponsesApi : isResponsesApi && policy.usesExplicitProxyLikeEndpoint;
	return {
		...policy,
		isKnownNativeEndpoint,
		allowsOpenAIServiceTier: provider === "openai" && api === "openai-responses" && endpointClass === "openai-public" || provider === "openai" && (api === "openai-chatgpt-responses" || api === "openai-responses") && endpointClass === "openai",
		supportsOpenAIReasoningCompatPayload: provider !== void 0 && api !== void 0 && !policy.usesExplicitProxyLikeEndpoint && (provider === "openai" || provider === "azure-openai" || provider === "azure-openai-responses") && (api === "openai-completions" || api === "openai-responses" || api === "openai-chatgpt-responses" || api === "azure-openai-responses"),
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
		default: return "none";
	}
}
function describeProviderRequestRouteClass(policy) {
	switch (policy.endpointClass) {
		case "default":
		case "invalid":
		case "local": return policy.endpointClass;
		case "custom":
		case "openrouter": return "proxy-like";
		default: return "native";
	}
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
export { resolveProviderRequestPolicy as a, resolveProviderRequestCapabilities as i, isLocalProviderEndpoint as n, resolveProviderEndpoint as r, describeProviderRequestRoutingSummary as t };
