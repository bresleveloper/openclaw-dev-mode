import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { l as resolveRuntimeServiceVersion } from "./version-BkM1aB4w.mjs";
import { n as pickBestEffortPrimaryLanIPv4 } from "./network-discovery-display-DtpXPZuV.mjs";
import { n as resolveDarwinProductVersion } from "./os-summary-B-12bRQs.mjs";
import { t as resolveMachineModelIdentifier } from "./machine-model-BiU9ZpvZ.mjs";
import os from "node:os";
import { randomUUID } from "node:crypto";
//#region src/infra/system-presence.ts
const SELF_KEY = Symbol("system-presence-self");
const entries = /* @__PURE__ */ new Map();
const TTL_MS = 3e5;
const MAX_ENTRIES = 200;
const SELF_INSTANCE_ID = randomUUID();
const uptimeOrigin = os.uptime() * 1e3 - performance.now();
let freshnessTime = Date.now();
let freshnessSample = continuousTimeNow();
function continuousTimeNow() {
	return Math.max(performance.now(), os.uptime() * 1e3 - uptimeOrigin);
}
function freshnessNow() {
	const sample = continuousTimeNow();
	const elapsed = Math.max(0, sample - freshnessSample);
	freshnessSample = sample;
	freshnessTime = Math.max(Date.now(), freshnessTime + elapsed);
	return freshnessTime;
}
function setPresence(key, presence) {
	entries.set(key, {
		presence,
		freshness: freshnessNow()
	});
}
function normalizePresenceKey(key) {
	return normalizeOptionalLowercaseString(key);
}
function resolvePrimaryIPv4() {
	return pickBestEffortPrimaryLanIPv4() ?? os.hostname();
}
function initSelfPresence() {
	const host = os.hostname();
	const ip = resolvePrimaryIPv4() ?? void 0;
	const version = resolveRuntimeServiceVersion(process.env);
	const modelIdentifier = resolveMachineModelIdentifier();
	const platform = (() => {
		const p = os.platform();
		const rel = os.release();
		if (p === "darwin") return `macos ${resolveDarwinProductVersion()}`;
		if (p === "win32") return `windows ${rel}`;
		return `${p} ${rel}`;
	})();
	const deviceFamily = (() => {
		const p = os.platform();
		if (p === "darwin") return "Mac";
		if (p === "win32") return "Windows";
		if (p === "linux") return "Linux";
		return p;
	})();
	const text = `Gateway: ${host}${ip ? ` (${ip})` : ""} · app ${version} · mode gateway · reason self`;
	setPresence(SELF_KEY, {
		host,
		ip,
		version,
		platform,
		deviceFamily,
		modelIdentifier,
		mode: "gateway",
		reason: "self",
		instanceId: SELF_INSTANCE_ID,
		text,
		ts: Date.now()
	});
}
function touchSelfPresence() {
	const existing = entries.get(SELF_KEY)?.presence;
	if (existing) setPresence(SELF_KEY, {
		...existing,
		ts: Date.now()
	});
	else initSelfPresence();
}
initSelfPresence();
function parsePresence(text) {
	const trimmed = text.trim();
	const match = trimmed.match(/Node:\s*([^ (]+)\s*\(([^)]+)\)\s*·\s*app\s*([^·]+?)\s*·\s*last input\s*([0-9]+)s ago\s*·\s*mode\s*([^·]+?)\s*·\s*reason\s*(.+)$/i);
	if (!match) return {
		text: trimmed,
		ts: Date.now()
	};
	const [, host, ip, version, lastInputStr, mode, reasonRaw] = match;
	if (host === void 0 || ip === void 0 || version === void 0 || lastInputStr === void 0 || mode === void 0 || reasonRaw === void 0) return {
		text: trimmed,
		ts: Date.now()
	};
	const lastInputSeconds = Number.parseInt(lastInputStr, 10);
	const reason = reasonRaw.trim();
	return {
		host: host.trim(),
		ip: ip.trim(),
		version: version.trim(),
		lastInputSeconds: Number.isFinite(lastInputSeconds) ? lastInputSeconds : void 0,
		mode: mode.trim(),
		reason,
		text: trimmed,
		ts: Date.now()
	};
}
function mergeStringList(...values) {
	const out = /* @__PURE__ */ new Set();
	for (const list of values) {
		if (!Array.isArray(list)) continue;
		for (const item of list) {
			const trimmed = normalizeOptionalString(item) ?? "";
			if (trimmed) out.add(trimmed);
		}
	}
	return out.size > 0 ? [...out] : void 0;
}
function updateSystemPresence(payload) {
	const parsed = parsePresence(payload.text);
	const key = normalizePresenceKey(payload.deviceId) || normalizePresenceKey(payload.instanceId) || normalizePresenceKey(parsed.instanceId) || normalizePresenceKey(parsed.host) || parsed.ip || truncateUtf16Safe(parsed.text, 64) || normalizeLowercaseStringOrEmpty(os.hostname());
	const existing = entries.get(key)?.presence ?? {};
	const merged = {
		...existing,
		...parsed,
		host: payload.host ?? parsed.host ?? existing.host,
		ip: payload.ip ?? parsed.ip ?? existing.ip,
		version: payload.version ?? parsed.version ?? existing.version,
		platform: payload.platform ?? existing.platform,
		deviceFamily: payload.deviceFamily ?? existing.deviceFamily,
		modelIdentifier: payload.modelIdentifier ?? existing.modelIdentifier,
		mode: payload.mode ?? parsed.mode ?? existing.mode,
		lastInputSeconds: payload.lastInputSeconds === null ? void 0 : payload.lastInputSeconds ?? parsed.lastInputSeconds ?? existing.lastInputSeconds,
		reason: payload.reason ?? parsed.reason ?? existing.reason,
		deviceId: payload.deviceId ?? existing.deviceId,
		roles: mergeStringList(existing.roles, payload.roles),
		scopes: mergeStringList(existing.scopes, payload.scopes),
		instanceId: payload.instanceId ?? parsed.instanceId ?? existing.instanceId,
		text: payload.text || parsed.text || existing.text,
		ts: Date.now()
	};
	setPresence(key, merged);
	return {
		key,
		next: merged,
		changedKeys: [
			"host",
			"ip",
			"version",
			"mode",
			"reason"
		].filter((field) => existing[field] !== merged[field])
	};
}
function upsertPresence(key, presence) {
	const normalizedKey = normalizePresenceKey(key) ?? normalizeLowercaseStringOrEmpty(os.hostname());
	const existing = entries.get(normalizedKey)?.presence ?? {};
	const roles = mergeStringList(existing.roles, presence.roles);
	const scopes = mergeStringList(existing.scopes, presence.scopes);
	setPresence(normalizedKey, {
		...existing,
		...presence,
		roles,
		scopes,
		ts: Date.now(),
		text: presence.text || existing.text || `Node: ${presence.host ?? existing.host ?? "unknown"} · mode ${presence.mode ?? existing.mode ?? "unknown"}`
	});
}
/** Renews an existing connection-owned presence row without recreating expired metadata. */
function touchPresence(key) {
	const normalizedKey = normalizePresenceKey(key);
	if (!normalizedKey) return false;
	const existing = entries.get(normalizedKey)?.presence;
	if (!existing) return false;
	setPresence(normalizedKey, {
		...existing,
		ts: Date.now()
	});
	return true;
}
function listSystemPresence() {
	touchSelfPresence();
	const now = freshnessNow();
	for (const [key, entry] of entries) if (key !== SELF_KEY && now - entry.freshness > TTL_MS) entries.delete(key);
	if (entries.size > MAX_ENTRIES) {
		const sorted = [...entries.entries()].filter(([key]) => key !== SELF_KEY).toSorted((a, b) => a[1].freshness - b[1].freshness);
		const toDrop = entries.size - MAX_ENTRIES;
		for (const [key] of sorted.slice(0, toDrop)) entries.delete(key);
	}
	return [...entries.values()].map((entry) => entry.presence).toSorted((a, b) => b.ts - a.ts);
}
//#endregion
export { upsertPresence as i, touchPresence as n, updateSystemPresence as r, listSystemPresence as t };
