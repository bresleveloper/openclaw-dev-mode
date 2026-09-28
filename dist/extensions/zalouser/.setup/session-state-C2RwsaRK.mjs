import { r as getZalouserRuntime } from "./doctor-contract-DcONa6Y4.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { createHash } from "node:crypto";
import os from "node:os";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
//#region extensions/zalouser/src/session-state.ts
const ZALOUSER_CREDENTIALS_NAMESPACE = "credentials";
function normalizeZalouserCredentialProfile(profile) {
	return normalizeLowercaseStringOrEmpty(profile) || "default";
}
function zalouserCredentialStoreKey(profile) {
	return `profile:${createHash("sha256").update(normalizeZalouserCredentialProfile(profile)).digest("hex")}`;
}
function resolveLegacyZalouserCredentialsDir(env = process.env) {
	return path.join(resolveStateDir(env, os.homedir), "credentials", "zalouser");
}
function resolveLegacyZalouserCredentialsPath(profile, env = process.env) {
	const normalized = normalizeZalouserCredentialProfile(profile);
	const filename = normalized === "default" ? "credentials.json" : `credentials-${encodeURIComponent(normalized)}.json`;
	return path.join(resolveLegacyZalouserCredentialsDir(env), filename);
}
function normalizeStoredZaloCredentials(value, profile) {
	if (!value || typeof value !== "object") return null;
	const parsed = value;
	if (typeof parsed.imei !== "string" || !parsed.imei || !parsed.cookie || typeof parsed.userAgent !== "string" || !parsed.userAgent || typeof parsed.createdAt !== "string" || !parsed.createdAt) return null;
	return {
		profile: normalizeZalouserCredentialProfile(profile ?? parsed.profile),
		imei: parsed.imei,
		cookie: parsed.cookie,
		userAgent: parsed.userAgent,
		...typeof parsed.language === "string" ? { language: parsed.language } : {},
		createdAt: parsed.createdAt,
		...typeof parsed.lastUsedAt === "string" ? { lastUsedAt: parsed.lastUsedAt } : {}
	};
}
function isZaloCredentialRevocation(value, profile) {
	if (!value || typeof value !== "object") return false;
	const parsed = value;
	return parsed.kind === "revoked" && typeof parsed.revokedAt === "string" && parsed.revokedAt.length > 0 && normalizeZalouserCredentialProfile(parsed.profile) === normalizeZalouserCredentialProfile(profile ?? parsed.profile);
}
function openZalouserCredentialsStore(env = process.env) {
	return getZalouserRuntime().state.openSyncKeyedStore({
		namespace: ZALOUSER_CREDENTIALS_NAMESPACE,
		maxEntries: 256,
		overflowPolicy: "reject-new",
		env
	});
}
function loadStoredZaloCredentials(profile, env = process.env) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	const parsed = normalizeStoredZaloCredentials(openZalouserCredentialsStore(env).lookup(zalouserCredentialStoreKey(normalizedProfile)), normalizedProfile);
	return parsed?.profile === normalizedProfile ? parsed : null;
}
function saveStoredZaloCredentials(profile, credentials, env = process.env) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	openZalouserCredentialsStore(env).register(zalouserCredentialStoreKey(normalizedProfile), {
		profile: normalizedProfile,
		...credentials
	});
}
function openAsyncZalouserCredentialsStore(env) {
	return getZalouserRuntime().state.openKeyedStore({
		namespace: ZALOUSER_CREDENTIALS_NAMESPACE,
		maxEntries: 256,
		overflowPolicy: "reject-new",
		env
	});
}
async function loadStoredZaloCredentialsAsync(profile, env = process.env) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	return normalizeStoredZaloCredentials(await openAsyncZalouserCredentialsStore(env).lookup(zalouserCredentialStoreKey(normalizedProfile)), normalizedProfile);
}
async function refreshStoredZaloCredentials(profile, credentials, isCurrent, env = process.env) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	const store = openAsyncZalouserCredentialsStore(env);
	const key = zalouserCredentialStoreKey(normalizedProfile);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const prepare = (current) => {
		if (!isCurrent() || isZaloCredentialRevocation(current, normalizedProfile)) return null;
		const existing = normalizeStoredZaloCredentials(current, normalizedProfile);
		return {
			...credentials,
			profile: normalizedProfile,
			createdAt: existing?.createdAt ?? now,
			lastUsedAt: now
		};
	};
	if (!store.observe || !store.compareAndApply) {
		if (!store.update) throw new Error("Zalo credential refresh requires atomic plugin-state updates");
		let saved = null;
		await store.update(key, (current) => {
			saved = prepare(current);
			return saved ?? void 0;
		});
		return isCurrent() ? saved : null;
	}
	let observed = await store.observe(key);
	while (isCurrent()) {
		const next = prepare(observed.value);
		if (!next) return null;
		const result = await store.compareAndApply(key, observed.comparison, {
			operation: "update",
			action: "set",
			value: next
		});
		if (result.status !== "conflict") return isCurrent() ? next : null;
		observed = result.current;
	}
	return null;
}
function clearStoredZaloCredentials(profile, env = process.env) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	const store = openZalouserCredentialsStore(env);
	const hadCredentials = normalizeStoredZaloCredentials(store.lookup(zalouserCredentialStoreKey(normalizedProfile)), normalizedProfile) !== null;
	store.register(zalouserCredentialStoreKey(normalizedProfile), {
		kind: "revoked",
		profile: normalizedProfile,
		revokedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
	return hadCredentials;
}
//#endregion
export { loadStoredZaloCredentialsAsync as a, refreshStoredZaloCredentials as c, saveStoredZaloCredentials as d, zalouserCredentialStoreKey as f, loadStoredZaloCredentials as i, resolveLegacyZalouserCredentialsDir as l, clearStoredZaloCredentials as n, normalizeStoredZaloCredentials as o, isZaloCredentialRevocation as r, normalizeZalouserCredentialProfile as s, ZALOUSER_CREDENTIALS_NAMESPACE as t, resolveLegacyZalouserCredentialsPath as u };
