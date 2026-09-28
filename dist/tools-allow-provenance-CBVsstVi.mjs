import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { d as snapshotOwnCronRecord, r as normalizeCronScheduledToolCallerOrigin, s as resolveCronScheduledToolPolicy } from "./scheduled-tool-policy-pqnwO5x1.mjs";
//#region src/cron/runtime-authority.ts
const CRON_RUNTIME_AUTHORITY_MAX_BYTES = 65536;
const CRON_RUNTIME_AUTHORITY_MAX_ID_LENGTH = 128;
const CRON_RUNTIME_AUTHORITY_MAX_DEPTH = 16;
const CRON_RUNTIME_AUTHORITY_ID_PATTERN = /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/u;
const CRON_RUNTIME_AUTHORITY_KEYS = /* @__PURE__ */ new Set([
	"version",
	"runtimeId",
	"namespace",
	"payload"
]);
function normalizeAuthorityId(value) {
	const normalized = normalizeOptionalString(value);
	return normalized && normalized.length <= CRON_RUNTIME_AUTHORITY_MAX_ID_LENGTH && CRON_RUNTIME_AUTHORITY_ID_PATTERN.test(normalized) ? normalized : void 0;
}
function cloneJsonValue(value, seen, depth) {
	if (depth > CRON_RUNTIME_AUTHORITY_MAX_DEPTH) return;
	if (value === null || typeof value === "string" || typeof value === "boolean") return value;
	if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
	if (typeof value !== "object") return;
	if (seen.has(value)) return;
	seen.add(value);
	if (Array.isArray(value)) {
		const result = [];
		for (const item of value) {
			const cloned = cloneJsonValue(item, seen, depth + 1);
			if (cloned === void 0) return;
			result.push(cloned);
		}
		seen.delete(value);
		return result;
	}
	const prototype = Object.getPrototypeOf(value);
	if (prototype !== Object.prototype && prototype !== null) return;
	const result = Object.create(null);
	for (const [key, item] of Object.entries(value)) {
		const cloned = cloneJsonValue(item, seen, depth + 1);
		if (cloned === void 0) return;
		result[key] = cloned;
	}
	seen.delete(value);
	return result;
}
function cloneJsonObject(value) {
	if (!isRecord(value) || Array.isArray(value)) return;
	const cloned = cloneJsonValue(value, /* @__PURE__ */ new WeakSet(), 0);
	return isRecord(cloned) && !Array.isArray(cloned) ? cloned : void 0;
}
function deepFreezeJson(value) {
	if (value && typeof value === "object") {
		for (const item of Array.isArray(value) ? value : Object.values(value)) deepFreezeJson(item);
		Object.freeze(value);
	}
	return value;
}
/** Validates the private persisted transport without learning runtime-owned payload semantics. */
function normalizeCronRuntimeAuthority(value) {
	const input = isRecord(value) ? snapshotOwnCronRecord(value) : void 0;
	if (!input || input.version !== 1 || Object.keys(input).some((key) => !CRON_RUNTIME_AUTHORITY_KEYS.has(key)) || !("runtimeId" in input) || !("namespace" in input) || !("payload" in input)) return;
	const runtimeId = normalizeAuthorityId(input.runtimeId);
	const namespace = normalizeAuthorityId(input.namespace);
	const payload = cloneJsonObject(input.payload);
	if (!runtimeId || !namespace || !payload) return;
	const normalized = {
		version: 1,
		runtimeId,
		namespace,
		payload: deepFreezeJson(payload)
	};
	if (Buffer.byteLength(JSON.stringify(normalized), "utf8") > CRON_RUNTIME_AUTHORITY_MAX_BYTES) return;
	return Object.freeze(normalized);
}
function cloneCronRuntimeAuthority(value) {
	return normalizeCronRuntimeAuthority(value);
}
//#endregion
//#region src/cron/tools-allow-provenance.ts
/** Authority facts must be authored data, never inherited fields or accessor results. */
function snapshotProvenanceRecord(value) {
	if (!isRecord(value)) return;
	const snapshot = Object.create(null);
	for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(value))) if (descriptor.enumerable) snapshot[key] = "value" in descriptor ? descriptor.value : void 0;
	return snapshot;
}
function normalizeCronAuthenticatedChannelRequester(value) {
	const input = snapshotProvenanceRecord(value);
	if (input?.version !== 1) return;
	const channel = normalizeOptionalLowercaseString(input.channel);
	const accountId = normalizeOptionalAccountId(typeof input.accountId === "string" ? input.accountId : void 0);
	const senderId = normalizeOptionalString(input.senderId);
	return channel && accountId && senderId ? {
		version: 1,
		channel,
		accountId,
		senderId
	} : void 0;
}
function normalizeCronToolsAllowProvenance(value) {
	const input = snapshotProvenanceRecord(value);
	if (input?.version !== 1) return;
	const channelRequester = normalizeCronAuthenticatedChannelRequester(input.channelRequester);
	const normalizedCallerOrigin = normalizeCronScheduledToolCallerOrigin(snapshotProvenanceRecord(input.callerOrigin));
	const callerOrigin = normalizedCallerOrigin.kind === "unknown" ? void 0 : normalizedCallerOrigin;
	if (input.source === "authenticated-requester") {
		if (callerOrigin) return {
			version: 1,
			source: "authenticated-requester",
			callerOrigin,
			...channelRequester ? { channelRequester } : {}
		};
		return channelRequester ? {
			version: 1,
			source: "authenticated-requester",
			channelRequester
		} : void 0;
	}
	if (input.source !== "final-executable-surface") return;
	return {
		version: 1,
		source: "final-executable-surface",
		callerOrigin: normalizedCallerOrigin,
		...channelRequester ? { channelRequester } : {}
	};
}
/** Caller origin is usable only within the job's persisted account policy. */
function resolveCronAuthenticatedCallerOrigin(job) {
	if (resolveCronScheduledToolPolicy({
		toolsAllow: job.payload.toolsAllow,
		owner: job.owner,
		scheduledToolPolicy: job.scheduledToolPolicy
	})?.mode !== "account") return;
	const callerOrigin = normalizeCronToolsAllowProvenance(job.toolsAllowProvenance)?.callerOrigin;
	return callerOrigin?.kind === "unknown" ? void 0 : callerOrigin;
}
/** Requester facts are usable only within the existing job owner and account policy. */
function resolveCronAuthenticatedChannelRequester(job) {
	const policy = resolveCronScheduledToolPolicy({
		toolsAllow: job.payload.toolsAllow,
		owner: job.owner,
		scheduledToolPolicy: job.scheduledToolPolicy
	});
	if (policy?.mode !== "account") return;
	const requester = normalizeCronToolsAllowProvenance(job.toolsAllowProvenance)?.channelRequester;
	return requester?.accountId === policy.ownerAccountId ? requester : void 0;
}
//#endregion
export { cloneCronRuntimeAuthority as a, resolveCronAuthenticatedChannelRequester as i, normalizeCronToolsAllowProvenance as n, normalizeCronRuntimeAuthority as o, resolveCronAuthenticatedCallerOrigin as r, normalizeCronAuthenticatedChannelRequester as t };
