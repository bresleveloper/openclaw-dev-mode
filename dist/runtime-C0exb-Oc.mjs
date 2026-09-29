import { D as resolveExpiresAtMsFromDurationMs, E as resolveDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-BcoYkagW.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./provider-auth-eHeoP8se.mjs";
import { S as resolveConfiguredModelNameHint, a as FOUNDRY_ANTHROPIC_SCOPE, d as buildFoundryProviderBaseUrl, f as extractFoundryEndpoint, h as isFoundryProviderApi } from "./shared-DY30N5AX.mjs";
import { a as getAccessTokenResultAsync } from "./cli-DObYP8HL.mjs";
import { t as getFoundryTokenCacheKey } from "./shared-runtime-BD0CY1mM.mjs";
//#region extensions/microsoft-foundry/runtime.ts
const cachedTokens = /* @__PURE__ */ new Map();
const refreshPromises = /* @__PURE__ */ new Map();
const FOUNDRY_TOKEN_FALLBACK_LIFETIME_MS = 33e5;
const FOUNDRY_TOKEN_CACHE_MAX_ENTRIES = 128;
async function refreshEntraToken(params) {
	const result = await getAccessTokenResultAsync(params);
	const rawExpiry = result.expiresOn ? new Date(result.expiresOn).getTime() : NaN;
	const now = resolveDateTimestampMs(Date.now());
	const expiresAt = asDateTimestampMs(rawExpiry) ?? resolveExpiresAtMsFromDurationMs(FOUNDRY_TOKEN_FALLBACK_LIFETIME_MS, { nowMs: now }) ?? now;
	for (const [cacheKey, cachedToken] of cachedTokens) if (cachedToken.expiresAt <= now) cachedTokens.delete(cacheKey);
	cachedTokens.set(getFoundryTokenCacheKey(params), {
		token: result.accessToken,
		expiresAt
	});
	pruneMapToMaxSize(cachedTokens, FOUNDRY_TOKEN_CACHE_MAX_ENTRIES);
	return {
		apiKey: result.accessToken,
		expiresAt
	};
}
async function prepareFoundryRuntimeAuth(ctx) {
	if (ctx.apiKey !== "__entra_id_dynamic__") return {
		apiKey: ctx.apiKey,
		request: { auth: {
			mode: "header",
			headerName: ctx.model.api === "anthropic-messages" ? "x-api-key" : "api-key",
			value: ctx.apiKey
		} }
	};
	try {
		const authStore = ensureAuthProfileStore(ctx.agentDir, { allowKeychainPrompt: false });
		const credential = ctx.profileId ? authStore.profiles[ctx.profileId] : void 0;
		const metadata = credential?.type === "api_key" ? credential.metadata : void 0;
		const modelId = normalizeOptionalString(ctx.modelId) ?? normalizeOptionalString(metadata?.modelId) ?? ctx.modelId;
		const requestedModelId = normalizeOptionalString(ctx.modelId);
		const metadataModelId = normalizeOptionalString(metadata?.modelId);
		const activeModelUsesMetadata = !requestedModelId || requestedModelId === metadataModelId;
		const activeModelNameHint = activeModelUsesMetadata ? metadata?.modelName : void 0;
		const modelNameHint = resolveConfiguredModelNameHint(modelId, ctx.model.name ?? activeModelNameHint);
		const configuredApi = isFoundryProviderApi(ctx.model.api) ? ctx.model.api : activeModelUsesMetadata && typeof metadata?.api === "string" && isFoundryProviderApi(metadata.api) ? metadata.api : void 0;
		const endpoint = extractFoundryEndpoint(ctx.model.baseUrl ?? "") ?? normalizeOptionalString(metadata?.endpoint);
		const tokenScope = configuredApi === "anthropic-messages" ? FOUNDRY_ANTHROPIC_SCOPE : void 0;
		const baseUrl = endpoint ? buildFoundryProviderBaseUrl(endpoint, modelId, modelNameHint, configuredApi) : void 0;
		const cacheKey = getFoundryTokenCacheKey({
			scope: tokenScope,
			subscriptionId: metadata?.subscriptionId,
			tenantId: metadata?.tenantId
		});
		const cachedToken = cachedTokens.get(cacheKey);
		const rawNow = Date.now();
		const hasValidClock = asDateTimestampMs(rawNow) !== void 0;
		const now = resolveDateTimestampMs(rawNow);
		const refreshAfterMs = resolveExpiresAtMsFromDurationMs(3e5, { nowMs: now }) ?? now;
		if (cachedToken && hasValidClock && cachedToken.expiresAt > refreshAfterMs) {
			cachedTokens.delete(cacheKey);
			cachedTokens.set(cacheKey, cachedToken);
			return {
				apiKey: cachedToken.token,
				expiresAt: cachedToken.expiresAt,
				...baseUrl ? { baseUrl } : {},
				request: { auth: {
					mode: "authorization-bearer",
					token: cachedToken.token
				} }
			};
		}
		cachedTokens.delete(cacheKey);
		let refreshPromise = refreshPromises.get(cacheKey);
		if (!refreshPromise) {
			refreshPromise = refreshEntraToken({
				scope: tokenScope,
				subscriptionId: metadata?.subscriptionId,
				tenantId: metadata?.tenantId
			}).finally(() => {
				refreshPromises.delete(cacheKey);
			});
			refreshPromises.set(cacheKey, refreshPromise);
		}
		const token = await refreshPromise;
		return {
			...token,
			...baseUrl ? { baseUrl } : {},
			request: { auth: {
				mode: "authorization-bearer",
				token: token.apiKey
			} }
		};
	} catch (err) {
		const details = formatErrorMessage(err);
		throw new Error(`Failed to refresh Azure Entra ID token via az CLI: ${details}`, { cause: err });
	}
}
//#endregion
export { prepareFoundryRuntimeAuth as t };
