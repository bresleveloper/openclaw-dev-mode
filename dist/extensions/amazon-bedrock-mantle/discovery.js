import { LiveModelCatalogHttpError } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { createSubsystemLogger } from "openclaw/plugin-sdk/core";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { isFutureDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/amazon-bedrock-mantle/discovery.ts
/**
* Amazon Bedrock Mantle discovery and bearer-token handling. It resolves
* explicit tokens, IAM-generated tokens, model catalogs, and implicit provider config.
*/
const log = createSubsystemLogger("bedrock-mantle-discovery");
const DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const DEFAULT_CONTEXT_WINDOW = 32e3;
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_REFRESH_INTERVAL_SECONDS = 3600;
const MANTLE_DISCOVERY_TIMEOUT_MS = 3e4;
const MANTLE_DISCOVERY_RESPONSE_MAX_BYTES = 4194304;
const SONNET_5_STANDARD_PRICING_START_MS = Date.UTC(2026, 8, 1);
const SONNET_5_PROMOTIONAL_COST = {
	input: 2,
	output: 10,
	cacheRead: .2,
	cacheWrite: 2.5
};
const SONNET_5_STANDARD_COST = {
	input: 3,
	output: 15,
	cacheRead: .3,
	cacheWrite: 3.75
};
/** Config auth marker meaning Mantle should mint runtime bearer tokens from IAM. */
const MANTLE_IAM_TOKEN_MARKER = "__amazon_bedrock_mantle_iam__";
function resolveMantleSonnet5Cost(nowMs = Date.now()) {
	return nowMs >= SONNET_5_STANDARD_PRICING_START_MS ? SONNET_5_STANDARD_COST : SONNET_5_PROMOTIONAL_COST;
}
const MANTLE_SUPPORTED_REGIONS = [
	"us-east-1",
	"us-east-2",
	"us-west-2",
	"ap-northeast-1",
	"ap-south-1",
	"ap-southeast-3",
	"eu-central-1",
	"eu-west-1",
	"eu-west-2",
	"eu-south-1",
	"eu-north-1",
	"sa-east-1"
];
function mantleEndpoint(region) {
	return `https://bedrock-mantle.${region}.api.aws`;
}
function isSupportedRegion(region) {
	return MANTLE_SUPPORTED_REGIONS.includes(region);
}
async function loadMantleBearerTokenProviderFactory() {
	const { getTokenProvider } = await import("@aws/bedrock-token-generator");
	return getTokenProvider;
}
/**
* Resolve a bearer token for Mantle authentication.
*
* Returns the value of AWS_BEARER_TOKEN_BEDROCK if set, undefined otherwise.
* When no explicit token is set, `resolveImplicitMantleProvider` will attempt
* to generate one from IAM credentials via `@aws/bedrock-token-generator`.
*/
function resolveMantleBearerToken(env = process.env) {
	const explicitToken = env.AWS_BEARER_TOKEN_BEDROCK?.trim();
	if (explicitToken) return explicitToken;
}
/** Token cache for IAM-derived bearer tokens, keyed by region. */
const iamTokenCache = /* @__PURE__ */ new Map();
/** Last emitted IAM token failure per region, retained until token generation succeeds. */
const iamTokenFailureDetailByRegion = /* @__PURE__ */ new Map();
/** Success epoch per region; failures spanning a recovery cannot restore stale diagnostics. */
const iamTokenSuccessEpochByRegion = /* @__PURE__ */ new Map();
const IAM_TOKEN_TTL_MS = 72e5;
function resolveMantleRegion(env) {
	return normalizeOptionalString(env.AWS_REGION) ?? normalizeOptionalString(env.AWS_DEFAULT_REGION) ?? "us-east-1";
}
function getCachedIamTokenEntry(region, now = Date.now()) {
	const cached = iamTokenCache.get(region);
	if (cached && isFutureDateTimestampMs(cached.expiresAt, { nowMs: now })) return cached;
	iamTokenCache.delete(region);
}
/**
* Generate a bearer token from IAM credentials using `@aws/bedrock-token-generator`.
*
* Uses the AWS default credential chain (instance roles, SSO, access keys, EKS IRSA).
* Returns undefined if the package is not installed or credentials are unavailable.
*/
async function generateBearerTokenFromIam(params) {
	const now = params.now?.() ?? Date.now();
	const cached = getCachedIamTokenEntry(params.region, now);
	if (cached) return cached.token;
	const successEpoch = iamTokenSuccessEpochByRegion.get(params.region) ?? 0;
	try {
		const token = await (params.tokenProviderFactory ?? await loadMantleBearerTokenProviderFactory())({
			region: params.region,
			expiresInSeconds: 7200
		})();
		const expiresAt = resolveExpiresAtMsFromDurationMs(IAM_TOKEN_TTL_MS, { nowMs: now });
		if (expiresAt !== void 0) iamTokenCache.set(params.region, {
			token,
			expiresAt
		});
		iamTokenSuccessEpochByRegion.set(params.region, (iamTokenSuccessEpochByRegion.get(params.region) ?? 0) + 1);
		iamTokenFailureDetailByRegion.delete(params.region);
		return token;
	} catch (error) {
		if (successEpoch !== (iamTokenSuccessEpochByRegion.get(params.region) ?? 0)) return;
		if (log.isEnabled("debug")) {
			const errorMessage = formatErrorMessage(error);
			if (iamTokenFailureDetailByRegion.get(params.region) !== errorMessage) {
				iamTokenFailureDetailByRegion.set(params.region, errorMessage);
				log.debug("Mantle IAM token generation unavailable", {
					region: params.region,
					error: errorMessage
				});
			}
		}
		return;
	}
}
/**
* Read a cached IAM bearer token for the given region (sync, no generation).
*
* Returns the token if it exists and has not expired, undefined otherwise.
* Used by Mantle runtime auth and tests to inspect the current cache.
*/
function getCachedIamToken(region) {
	return getCachedIamTokenEntry(region)?.token;
}
/** Resolve the actual runtime bearer token for Mantle, generating IAM tokens when needed. */
async function resolveMantleRuntimeBearerToken(params) {
	if (params.apiKey !== "__amazon_bedrock_mantle_iam__") return { apiKey: params.apiKey };
	const now = params.now?.() ?? Date.now();
	const region = resolveMantleRegion(params.env ?? process.env);
	const cached = getCachedIamTokenEntry(region, now);
	if (cached) return {
		apiKey: cached.token,
		expiresAt: cached.expiresAt
	};
	const token = await generateBearerTokenFromIam({
		region,
		now: params.now,
		tokenProviderFactory: params.tokenProviderFactory
	});
	if (!token) return;
	const refreshed = getCachedIamTokenEntry(region, now);
	const expiresAt = refreshed?.expiresAt ?? resolveExpiresAtMsFromDurationMs(IAM_TOKEN_TTL_MS, { nowMs: now });
	return {
		apiKey: refreshed?.token ?? token,
		...expiresAt === void 0 ? {} : { expiresAt }
	};
}
/** Model ID substrings that indicate reasoning/thinking support. */
const REASONING_PATTERNS = [
	"thinking",
	"reasoner",
	"reasoning",
	"deepseek.r",
	"gpt-oss-120b",
	"gpt-oss-safeguard-120b"
];
function inferReasoningSupport(modelId) {
	const lower = normalizeLowercaseStringOrEmpty(modelId);
	return REASONING_PATTERNS.some((p) => lower.includes(p));
}
async function readMantleModelDiscoveryJson(response) {
	const body = await readProviderJsonResponse(response, "Mantle model discovery", {
		maxBytes: MANTLE_DISCOVERY_RESPONSE_MAX_BYTES,
		chunkTimeoutMs: MANTLE_DISCOVERY_TIMEOUT_MS,
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Mantle model discovery response stalled: no data received for ${chunkTimeoutMs}ms`)
	});
	if (!body || typeof body !== "object" || !("data" in body) || !Array.isArray(body.data)) throw new Error("Mantle model discovery response must contain a data array");
	return body;
}
const discoveryCache = /* @__PURE__ */ new Map();
/**
* Discover available models from the Mantle `/v1/models` endpoint.
*
* The response is in standard OpenAI format:
* ```json
* { "data": [{ "id": "anthropic.claude-sonnet-4-6", "object": "model", "owned_by": "anthropic" }] }
* ```
*
* Results are cached per region and bearer credential for `DEFAULT_REFRESH_INTERVAL_SECONDS`.
* Public calls retain advisory results; strict catalog calls propagate acquisition failures.
*/
async function discoverMantleModels(params) {
	const { region, bearerToken, fetchFn = fetch, now = Date.now } = params;
	const cached = discoveryCache.get(region);
	if (cached?.bearerToken === bearerToken && now() - cached.fetchedAt < DEFAULT_REFRESH_INTERVAL_SECONDS * 1e3) return cached.models;
	if (cached?.bearerToken !== bearerToken) discoveryCache.delete(region);
	const endpoint = `${mantleEndpoint(region)}/v1/models`;
	try {
		const response = await fetchFn(endpoint, {
			method: "GET",
			signal: AbortSignal.timeout(MANTLE_DISCOVERY_TIMEOUT_MS),
			headers: {
				Authorization: `Bearer ${bearerToken}`,
				Accept: "application/json"
			}
		});
		if (!response.ok) {
			await response.body?.cancel().catch(() => void 0);
			throw new LiveModelCatalogHttpError("amazon-bedrock-mantle", response.status);
		}
		const models = (await readMantleModelDiscoveryJson(response)).data.filter((model) => model.id?.trim()).map((model) => ({
			id: model.id,
			name: model.id,
			reasoning: inferReasoningSupport(model.id),
			input: ["text"],
			cost: DEFAULT_COST,
			contextWindow: DEFAULT_CONTEXT_WINDOW,
			maxTokens: DEFAULT_MAX_TOKENS
		})).toSorted((left, right) => left.id.localeCompare(right.id));
		discoveryCache.set(region, {
			bearerToken,
			models,
			fetchedAt: now()
		});
		return models;
	} catch (error) {
		if (params.discoveryMode === "strict") throw error;
		return cached?.bearerToken === bearerToken ? cached.models : [];
	}
}
/**
* Resolve an implicit Bedrock Mantle provider if authentication is available.
*
* Detection priority:
* 1. AWS_BEARER_TOKEN_BEDROCK env var → use directly
* 2. IAM credentials → generate bearer token via `@aws/bedrock-token-generator`
* - Region from AWS_REGION / AWS_DEFAULT_REGION / default us-east-1
* - Models discovered from `/v1/models`
*/
/** Public resolution keeps advisory null results; strict catalog callers retain acquired empties. */
async function resolveImplicitMantleProvider(params) {
	const env = params.env ?? process.env;
	if (params.pluginConfig?.discovery?.enabled === false) return null;
	const region = resolveMantleRegion(env);
	const explicitBearerToken = resolveMantleBearerToken(env);
	if (!isSupportedRegion(region)) {
		log.debug?.("Mantle not available in region", { region });
		return null;
	}
	const bearerToken = explicitBearerToken ?? await generateBearerTokenFromIam({
		region,
		tokenProviderFactory: params.tokenProviderFactory
	});
	if (!bearerToken) return null;
	const models = await discoverMantleModels({
		region,
		bearerToken,
		discoveryMode: params.discoveryMode,
		fetchFn: params.fetchFn
	});
	if (models.length === 0 && params.discoveryMode !== "strict") return null;
	log.debug?.("Mantle provider resolved", {
		region,
		modelCount: models.length
	});
	const claudeModels = [
		{
			id: "anthropic.claude-opus-5",
			name: "Claude Opus 5",
			api: "anthropic-messages",
			reasoning: true,
			params: { canonicalModelId: "claude-opus-5" },
			input: ["text", "image"],
			mediaInput: { image: {
				maxSidePx: 2576,
				preferredSidePx: 2576,
				tokenMode: "provider"
			} },
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 1e6,
			maxTokens: 128e3,
			thinkingLevelMap: {
				xhigh: "xhigh",
				max: "max"
			}
		},
		{
			id: "anthropic.claude-sonnet-5",
			name: "Claude Sonnet 5",
			api: "anthropic-messages",
			reasoning: true,
			params: { canonicalModelId: "claude-sonnet-5" },
			input: ["text", "image"],
			mediaInput: { image: {
				maxSidePx: 2576,
				preferredSidePx: 2576,
				tokenMode: "provider"
			} },
			cost: resolveMantleSonnet5Cost(),
			contextWindow: 1e6,
			maxTokens: 128e3,
			thinkingLevelMap: {
				off: "low",
				minimal: "low",
				xhigh: "xhigh",
				max: "max"
			}
		},
		{
			id: "anthropic.claude-opus-4-7",
			name: "Claude Opus 4.7",
			api: "anthropic-messages",
			reasoning: false,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		},
		{
			id: "anthropic.claude-mythos-5",
			name: "Claude Mythos 5",
			api: "anthropic-messages",
			reasoning: true,
			params: { canonicalModelId: "claude-mythos-5" },
			input: ["text", "image"],
			cost: {
				input: 10,
				output: 50,
				cacheRead: 1,
				cacheWrite: 12.5
			},
			contextWindow: 1e6,
			maxTokens: 128e3,
			thinkingLevelMap: {
				off: "low",
				minimal: "low",
				xhigh: "xhigh",
				max: "max"
			}
		},
		{
			id: "anthropic.claude-mythos-preview",
			name: "Claude Mythos Preview",
			api: "anthropic-messages",
			reasoning: true,
			params: { canonicalModelId: "claude-mythos-preview" },
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: 1e6,
			maxTokens: 128e3
		}
	];
	const exactClaudeModelIds = new Set(claudeModels.map((model) => model.id));
	const allModels = [...models.filter((model) => !exactClaudeModelIds.has(model.id)), ...claudeModels];
	return {
		baseUrl: `${mantleEndpoint(region)}/v1`,
		api: "openai-completions",
		auth: "api-key",
		apiKey: explicitBearerToken ? "env:AWS_BEARER_TOKEN_BEDROCK" : MANTLE_IAM_TOKEN_MARKER,
		models: models.length === 0 ? [] : allModels
	};
}
/** Merge an implicit Mantle provider catalog with explicit user config. */
function mergeImplicitMantleProvider(params) {
	const { existing, implicit } = params;
	if (!existing) return implicit;
	return {
		...implicit,
		...existing,
		models: Array.isArray(existing.models) && existing.models.length > 0 ? existing.models : implicit.models
	};
}
//#endregion
export { MANTLE_IAM_TOKEN_MARKER, discoverMantleModels, generateBearerTokenFromIam, getCachedIamToken, mergeImplicitMantleProvider, resolveImplicitMantleProvider, resolveMantleBearerToken, resolveMantleRuntimeBearerToken, resolveMantleSonnet5Cost };
