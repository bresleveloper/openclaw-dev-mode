import { a as loadStoredZaloCredentials, c as refreshStoredZaloCredentials, d as saveStoredZaloCredentials, n as captureZalouserCredentialsEnv, r as clearStoredZaloCredentials } from "./session-state-yT2eReQ6.mjs";
import { createStaleWhileRevalidateCache } from "openclaw/plugin-sdk/collection-runtime";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import { enqueueKeyedTask } from "openclaw/plugin-sdk/keyed-async-queue";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/zalouser/src/credential-persistence.ts
function credentialSignature(credentials) {
	return JSON.stringify({
		imei: credentials.imei,
		cookie: credentials.cookie,
		userAgent: credentials.userAgent,
		language: credentials.language
	});
}
function snapshotApiCredentials(api, fallback) {
	const ctx = api.getContext();
	const cookieJson = api.getCookie().toJSON();
	const refreshedCookies = Array.isArray(cookieJson?.cookies) && cookieJson.cookies.length > 0 ? cookieJson.cookies : fallback?.cookie;
	const imei = normalizeOptionalString(ctx.imei) ?? normalizeOptionalString(fallback?.imei);
	const userAgent = normalizeOptionalString(ctx.userAgent) ?? normalizeOptionalString(fallback?.userAgent);
	if (!imei || !refreshedCookies || !userAgent) throw new Error("Zalo API session did not expose refreshed credentials");
	const language = normalizeOptionalString(ctx.language) ?? normalizeOptionalString(fallback?.language);
	return {
		imei,
		cookie: refreshedCookies,
		userAgent,
		...language ? { language } : {}
	};
}
var ZaloCredentialPersistence = class {
	constructor(isCurrentApi) {
		this.isCurrentApi = isCurrentApi;
		this.credentialSignaturesByProfile = /* @__PURE__ */ new Map();
		this.credentialRefreshesByProfile = /* @__PURE__ */ new Map();
		this.credentialRevocationsByProfile = /* @__PURE__ */ new Map();
	}
	dispose() {
		this.credentialSignaturesByProfile.clear();
		this.credentialRefreshesByProfile.clear();
		this.credentialRevocationsByProfile.clear();
	}
	pendingRevocation(profile) {
		return this.credentialRevocationsByProfile.get(profile);
	}
	rememberCredentials(profile, credentials) {
		this.credentialSignaturesByProfile.set(profile, credentialSignature(credentials));
	}
	async writeCredentials(profile, credentials, assertCurrent) {
		const env = captureZalouserCredentialsEnv();
		await this.credentialRevocationsByProfile.get(profile);
		assertCurrent();
		const existing = await loadStoredZaloCredentials(profile, env).catch(() => null);
		assertCurrent();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const next = {
			profile,
			...credentials,
			createdAt: existing?.createdAt ?? now,
			lastUsedAt: now
		};
		const { profile: _profile, ...stored } = next;
		await saveStoredZaloCredentials(profile, stored, env, assertCurrent);
		assertCurrent();
		this.credentialSignaturesByProfile.set(profile, credentialSignature(next));
	}
	async writeApiCredentials(profile, api, assertCurrent, fallback) {
		await this.writeCredentials(profile, snapshotApiCredentials(api, fallback), assertCurrent);
	}
	async persistApiCredentialsIfChanged(profile, api) {
		await enqueueKeyedTask({
			tails: this.credentialRefreshesByProfile,
			key: profile,
			task: async () => {
				try {
					const isCurrent = () => this.isCurrentApi(profile, api);
					if (!isCurrent()) return;
					const credentials = snapshotApiCredentials(api);
					const signature = credentialSignature(credentials);
					if (this.credentialSignaturesByProfile.get(profile) === signature) return;
					if (await refreshStoredZaloCredentials(profile, credentials, isCurrent) && isCurrent()) this.credentialSignaturesByProfile.set(profile, signature);
				} catch {}
			}
		});
	}
	async clearCredentials(profile, assertCurrent) {
		const env = captureZalouserCredentialsEnv();
		const previous = this.credentialRevocationsByProfile.get(profile);
		const pending = (async () => {
			await previous;
			try {
				const cleared = await clearStoredZaloCredentials(profile, env, assertCurrent);
				this.credentialSignaturesByProfile.delete(profile);
				return cleared;
			} catch {
				return false;
			}
		})();
		this.credentialRevocationsByProfile.set(profile, pending);
		try {
			return await pending;
		} finally {
			if (this.credentialRevocationsByProfile.get(profile) === pending) this.credentialRevocationsByProfile.delete(profile);
		}
	}
};
// extensions/zalouser/src/session-runtime.ts
const GROUP_CONTEXT_CACHE_TTL_MS = 3e5;
const GROUP_CONTEXT_CACHE_MAX_ENTRIES = 500;
const zalouserSessionStore = createPluginRuntimeStore({
	key: "zalouser:sessions",
	errorMessage: "Zalouser sessions not initialized"
});
function registerZalouserRuntimeLifecycle(api) {
	api.lifecycle.onDispose?.(() => {
		zalouserSessionStore.tryGetRuntime()?.dispose();
		zalouserSessionStore.clearRuntime();
	});
}
function createZaloSessionState() {
	const apiByProfile = /* @__PURE__ */ new Map();
	const apiInitByProfile = /* @__PURE__ */ new Map();
	const credentials = new ZaloCredentialPersistence((profile, api) => apiByProfile.get(profile) === api);
	const activeQrLogins = /* @__PURE__ */ new Map();
	const activeListeners = /* @__PURE__ */ new Map();
	const groupContextCache = createStaleWhileRevalidateCache({
		maxEntries: GROUP_CONTEXT_CACHE_MAX_ENTRIES,
		maxPending: Infinity,
		ttlMs: GROUP_CONTEXT_CACHE_TTL_MS
	});
	const state = {
		apiByProfile,
		apiInitByProfile,
		credentials,
		activeQrLogins,
		activeListeners,
		groupContextCache,
		dispose() {
			for (const profile of activeQrLogins.keys()) resetQrLogin(profile, state);
			for (const listener of activeListeners.values()) listener.stop();
			for (const profile of apiByProfile.keys()) invalidateApi(profile, state);
			apiInitByProfile.clear();
			groupContextCache.clear();
			credentials.dispose();
		}
	};
	return state;
}
function getZaloSessionState() {
	let state = zalouserSessionStore.tryGetRuntime();
	if (!state) {
		state = createZaloSessionState();
		zalouserSessionStore.setRuntime(state);
	}
	return state;
}
function invalidateApi(profile, state = getZaloSessionState()) {
	const { apiByProfile, apiInitByProfile } = state;
	const api = apiByProfile.get(profile);
	if (api) try {
		api.listener.stop();
	} catch {}
	apiByProfile.delete(profile);
	apiInitByProfile.delete(profile);
}
function resetQrLogin(profile, state = getZaloSessionState()) {
	const { activeQrLogins } = state;
	const active = activeQrLogins.get(profile);
	if (!active) return;
	try {
		active.abort?.();
	} catch {}
	activeQrLogins.delete(profile);
}
export { snapshotApiCredentials as a, resetQrLogin as i, invalidateApi as n, registerZalouserRuntimeLifecycle as r, getZaloSessionState as t };
