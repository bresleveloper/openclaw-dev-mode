import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { d as snapshotOwnCronRecord } from "./scheduled-tool-policy-Bjq61U8o.mjs";
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
		payload: freezeJsonSnapshot(payload)
	};
	if (Buffer.byteLength(JSON.stringify(normalized), "utf8") > CRON_RUNTIME_AUTHORITY_MAX_BYTES) return;
	return Object.freeze(normalized);
}
function cloneCronRuntimeAuthority(value) {
	return normalizeCronRuntimeAuthority(value);
}
//#endregion
export { normalizeCronRuntimeAuthority as n, cloneCronRuntimeAuthority as t };
