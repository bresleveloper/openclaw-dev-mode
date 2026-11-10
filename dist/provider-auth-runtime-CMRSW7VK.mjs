import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./model-auth-env-CPdn6zH8.mjs";
import { i as ensureAuthProfileStoreAsync, r as ensureAuthProfileStore } from "./store-runtime-CwqGD12G.mjs";
import { i as renderOAuthPage } from "./oauth-page-CdAMKCs_.mjs";
import { t as startOAuthLoopbackCallbackServer } from "./oauth-loopback-callback-CLXfm8vF.mjs";
import "./profiles-Df1OQ7iN.mjs";
import "./api-key-rotation-Dw4l5GMT.mjs";
import "./provider-auth-helpers-olPFvVdo.mjs";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import crypto from "node:crypto";
import path from "node:path";
import { createServer } from "node:http";
//#region src/plugin-sdk/provider-auth-runtime.ts
/**
* Binds a hardened loopback listener before returning so provider plugins can open the browser
* only after the callback route is ready. Invalid request candidates remain nonterminal.
*/
async function startProviderOAuthLoopbackCallbackServer(params) {
	return await startOAuthLoopbackCallbackServer(params);
}
/** @deprecated Use resolveProviderAuthProfileMetadataAsync. Final compatibility day: 2026-12-31. */
function resolveProviderAuthProfileMetadata(params) {
	warnPluginSdkDeprecation({
		family: "auth-profiles",
		method: "resolveProviderAuthProfileMetadata",
		replacement: "resolveProviderAuthProfileMetadataAsync"
	});
	return selectProviderAuthProfileMetadata(params, ensureAuthProfileStore(params.agentDir, {
		config: params.cfg,
		readOnly: true
	}));
}
async function resolveProviderAuthProfileMetadataAsync(params) {
	return selectProviderAuthProfileMetadata(params, await ensureAuthProfileStoreAsync(params.agentDir, {
		config: params.cfg,
		readOnly: true
	}));
}
function selectProviderAuthProfileMetadata(params, store) {
	const normalizedProvider = normalizeProviderId(params.provider);
	const [profileId, profile] = (params.profileId ? [params.profileId, store.profiles[params.profileId]] : Object.entries(store.profiles).find(([, profile]) => normalizeProviderId(profile.provider) === normalizedProvider)) ?? [];
	if (!profile) return {};
	return {
		profileId,
		...profile.type === "oauth" && profile.accountId ? { accountId: profile.accountId } : {}
	};
}
function buildOAuthCallbackOriginResolver(allowedHosts) {
	if (!allowedHosts || allowedHosts.length === 0) return () => void 0;
	const normalized = new Set(allowedHosts.map((host) => host.trim().toLowerCase()).filter((host) => host.length > 0));
	if (normalized.size === 0) return () => void 0;
	return (originHeader) => {
		const value = Array.isArray(originHeader) ? originHeader[0] : originHeader;
		if (!value) return;
		const parsed = URL.parse(value);
		return parsed?.protocol === "https:" && normalized.has(parsed.host.toLowerCase()) ? parsed.origin : void 0;
	};
}
/**
* Generates a high-entropy OAuth state token for local callback validation.
*/
function generateHexOAuthState() {
	return crypto.randomBytes(32).toString("hex");
}
/**
* Parses a pasted OAuth redirect URL into callback code/state fields.
*/
function parseOAuthCallbackInput(input, messages = {}) {
	const trimmed = input.trim();
	if (!trimmed) return { error: "No input provided" };
	const url = URL.parse(trimmed);
	if (!url) return { error: messages.invalidInput ?? "Paste the full redirect URL, not just the code." };
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	if (!code) return { error: "Missing 'code' parameter in URL" };
	if (!state) return { error: messages.missingState ?? "Missing 'state' parameter in URL" };
	return {
		code,
		state
	};
}
/**
* Starts a temporary loopback HTTP listener and waits for a validated OAuth callback.
*/
async function waitForLocalOAuthCallback(params) {
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	const callbackUrl = new URL(params.redirectUri);
	callbackUrl.port = String(params.port);
	callbackUrl.pathname = params.callbackPath;
	const resolveOAuthCallbackOrigin = buildOAuthCallbackOriginResolver(params.corsOriginAllowlist);
	const hasCorsOriginAllowlist = params.corsOriginAllowlist?.some((host) => host.trim().length > 0) ?? false;
	const callback = await startOAuthLoopbackCallbackServer({
		redirectUrl: callbackUrl,
		expectedState: params.expectedState,
		timeoutMs,
		...params.hostname ? { bindHostname: params.hostname } : {},
		createServer,
		...params.signal ? { signal: params.signal } : {},
		resolveCorsOrigin: hasCorsOriginAllowlist ? resolveOAuthCallbackOrigin : (originHeader) => {
			const value = Array.isArray(originHeader) ? originHeader[0] : originHeader;
			return value && isHttpOrigin(value) ? value : void 0;
		},
		renderSuccess: () => ({
			body: renderOAuthPage({
				title: params.successTitle,
				heading: params.successTitle,
				message: "You can close this window and return to OpenClaw."
			}),
			contentType: "text/html; charset=utf-8"
		})
	});
	try {
		params.onProgress?.(params.progressMessage ?? `Waiting for OAuth callback on ${params.redirectUri}...`);
		const result = await callback.waitForCallback();
		if (result.type === "oauth_error") throw new Error(`OAuth error: ${result.error}`);
		return {
			code: result.code,
			state: result.state
		};
	} finally {
		await callback.close();
	}
}
function isHttpOrigin(value) {
	const url = URL.parse(value);
	return (url?.protocol === "http:" || url?.protocol === "https:") && url.origin === value;
}
const RUNTIME_MODEL_AUTH_CANDIDATES = ["./runtime-model-auth.runtime", "../plugins/runtime/runtime-model-auth.runtime"];
const RUNTIME_MODEL_AUTH_EXTENSIONS = [
	".js",
	".ts",
	".mjs",
	".mts",
	".cjs",
	".cts"
];
function resolveRuntimeModelAuthModuleHref() {
	const baseDir = path.dirname(fileURLToPath(import.meta.url));
	for (const relativeBase of RUNTIME_MODEL_AUTH_CANDIDATES) for (const ext of RUNTIME_MODEL_AUTH_EXTENSIONS) {
		const candidate = path.resolve(baseDir, `${relativeBase}${ext}`);
		if (fs.existsSync(candidate)) return pathToFileURL(candidate).href;
	}
	throw new Error(`Unable to resolve runtime model auth module from ${import.meta.url}`);
}
async function loadRuntimeModelAuthModule() {
	return await import(resolveRuntimeModelAuthModuleHref());
}
/**
* Resolves provider API-key auth through the runtime auth module.
*/
async function resolveApiKeyForProvider(params) {
	params.signal?.throwIfAborted();
	const runtimeAuth = await loadRuntimeModelAuthModule();
	params.signal?.throwIfAborted();
	return runtimeAuth.resolveProviderRuntimeApiKey(params);
}
/**
* Resolves the prepared runtime auth payload for a concrete model request.
*/
async function getRuntimeAuthForModel(params) {
	const { getRuntimeAuthForModelCore: getRuntimeAuthForModelLocal } = await loadRuntimeModelAuthModule();
	return getRuntimeAuthForModelLocal(params);
}
//#endregion
export { resolveApiKeyForProvider as a, startProviderOAuthLoopbackCallbackServer as c, parseOAuthCallbackInput as i, waitForLocalOAuthCallback as l, generateHexOAuthState as n, resolveProviderAuthProfileMetadata as o, getRuntimeAuthForModel as r, resolveProviderAuthProfileMetadataAsync as s, buildOAuthCallbackOriginResolver as t };
