import { t as getZalouserRuntime } from "./runtime-CErzOYdK.mjs";
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
function captureZalouserCredentialsEnv(env = process.env) {
	return {
		...env,
		OPENCLAW_STATE_DIR: resolveStateDir(env),
		OPENCLAW_SUPERVISOR_MODE: env.OPENCLAW_SUPERVISOR_MODE
	};
}
function openZalouserCredentialsStore(env) {
	return getZalouserRuntime().state.openKeyedStore({
		namespace: ZALOUSER_CREDENTIALS_NAMESPACE,
		maxEntries: 256,
		overflowPolicy: "reject-new",
		env
	});
}
async function loadStoredZaloCredentials(profile, env = process.env) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	return normalizeStoredZaloCredentials(await openZalouserCredentialsStore(env).lookup(zalouserCredentialStoreKey(normalizedProfile)), normalizedProfile);
}
async function saveStoredZaloCredentials(profile, credentials, env = process.env, assertCurrent) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	await openZalouserCredentialsStore(env).register(zalouserCredentialStoreKey(normalizedProfile), {
		profile: normalizedProfile,
		...credentials
	}, { assertCurrent });
}
async function refreshStoredZaloCredentials(profile, credentials, isCurrent, env = process.env) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	const store = openZalouserCredentialsStore(env);
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
async function clearStoredZaloCredentials(profile, env = process.env, assertCurrent) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	const opened = openZalouserCredentialsStore(env);
	const store = assertCurrent && opened.withCurrent ? opened.withCurrent({ assertCurrent }) : opened;
	const key = zalouserCredentialStoreKey(normalizedProfile);
	const revoked = {
		kind: "revoked",
		profile: normalizedProfile,
		revokedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (!store.observe || !store.compareAndApply || assertCurrent && !opened.withCurrent) {
		if (!opened.update) throw new Error("Zalo credential logout requires atomic plugin-state updates");
		let hadCredentials = false;
		await opened.update(key, (current) => {
			assertCurrent?.();
			hadCredentials = normalizeStoredZaloCredentials(current, normalizedProfile) !== null;
			return revoked;
		});
		return hadCredentials;
	}
	let observed = await store.observe(key);
	for (;;) {
		const hadCredentials = normalizeStoredZaloCredentials(observed.value, normalizedProfile) !== null;
		const result = await store.compareAndApply(key, observed.comparison, {
			operation: "update",
			action: "set",
			value: revoked
		});
		if (result.status !== "conflict") return hadCredentials;
		observed = result.current;
	}
}
//#endregion
export { loadStoredZaloCredentials as a, refreshStoredZaloCredentials as c, saveStoredZaloCredentials as d, zalouserCredentialStoreKey as f, isZaloCredentialRevocation as i, resolveLegacyZalouserCredentialsDir as l, captureZalouserCredentialsEnv as n, normalizeStoredZaloCredentials as o, clearStoredZaloCredentials as r, normalizeZalouserCredentialProfile as s, ZALOUSER_CREDENTIALS_NAMESPACE as t, resolveLegacyZalouserCredentialsPath as u };
