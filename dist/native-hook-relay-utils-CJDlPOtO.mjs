import { i as truncateWithMarker, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
//#region src/agents/harness/native-hook-relay-utils.ts
const MAX_NATIVE_HOOK_RELAY_JSON_DEPTH = 64;
const MAX_NATIVE_HOOK_RELAY_JSON_NODES = 2e4;
const MAX_NATIVE_HOOK_RELAY_STRING_LENGTH = 1e6;
const MAX_NATIVE_HOOK_RELAY_TOTAL_STRING_LENGTH = 4e6;
const MAX_NATIVE_HOOK_RELAY_HISTORY_STRING_LENGTH = 4e3;
const MAX_NATIVE_HOOK_RELAY_HISTORY_TOTAL_STRING_LENGTH = 2e4;
const MAX_NATIVE_HOOK_RELAY_HISTORY_ARRAY_ITEMS = 50;
const MAX_NATIVE_HOOK_RELAY_HISTORY_OBJECT_KEYS = 50;
function normalizePositiveInteger(value, fallback) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}
function normalizeOptionalPositiveInteger(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function shellQuoteArgs(args) {
	return args.map((arg) => shellQuoteArg(arg, process.platform)).join(" ");
}
function shellQuoteArg(value, platform) {
	if (/^[A-Za-z0-9_/:=.,@%+-]+$/.test(value)) return value;
	if (platform === "win32") return `"${value.replaceAll("\"", "\\\"")}"`;
	return `'${value.replaceAll("'", "'\\''")}'`;
}
function readNativeHookRelayProvider(value) {
	if (value === "codex") return value;
	throw new Error("unsupported native hook relay provider");
}
function readNativeHookRelayEvent(value) {
	if (value === "pre_tool_use" || value === "post_tool_use" || value === "permission_request" || value === "before_agent_finalize") return value;
	throw new Error("unsupported native hook relay event");
}
function readNonEmptyString(value, name) {
	if (typeof value === "string" && value.trim()) return value.trim();
	throw new Error(`native hook relay ${name} is required`);
}
function readOptionalBoolean(value) {
	return typeof value === "boolean" ? value : void 0;
}
function isJsonValue(value) {
	const stack = [{
		value,
		depth: 0
	}];
	let nodes = 0;
	let totalStringLength = 0;
	while (stack.length) {
		const current = stack.pop();
		nodes += 1;
		if (nodes > MAX_NATIVE_HOOK_RELAY_JSON_NODES || current.depth > MAX_NATIVE_HOOK_RELAY_JSON_DEPTH) return false;
		if (current.value === null) continue;
		if (typeof current.value === "string") {
			if (current.value.length > MAX_NATIVE_HOOK_RELAY_STRING_LENGTH) return false;
			totalStringLength += current.value.length;
			if (totalStringLength > MAX_NATIVE_HOOK_RELAY_TOTAL_STRING_LENGTH) return false;
			continue;
		}
		if (typeof current.value === "number") {
			if (!Number.isFinite(current.value)) return false;
			continue;
		}
		if (typeof current.value === "boolean") continue;
		if (Array.isArray(current.value)) {
			for (const item of current.value) {
				if (nodes + stack.length + 1 > MAX_NATIVE_HOOK_RELAY_JSON_NODES) return false;
				stack.push({
					value: item,
					depth: current.depth + 1
				});
			}
			continue;
		}
		if (!isJsonObject(current.value)) return false;
		try {
			for (const key in current.value) {
				if (!Object.hasOwn(current.value, key)) continue;
				if (key.length > MAX_NATIVE_HOOK_RELAY_STRING_LENGTH) return false;
				totalStringLength += key.length;
				if (totalStringLength > MAX_NATIVE_HOOK_RELAY_TOTAL_STRING_LENGTH) return false;
				if (nodes + stack.length + 1 > MAX_NATIVE_HOOK_RELAY_JSON_NODES) return false;
				stack.push({
					value: current.value[key],
					depth: current.depth + 1
				});
			}
		} catch {
			return false;
		}
	}
	return true;
}
function isJsonObject(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	try {
		const prototype = Object.getPrototypeOf(value);
		return prototype === Object.prototype || prototype === null;
	} catch {
		return false;
	}
}
function snapshotNativeHookRelayPayload(payload) {
	return snapshotJsonValue(payload, { remainingStringLength: MAX_NATIVE_HOOK_RELAY_HISTORY_TOTAL_STRING_LENGTH });
}
function snapshotJsonValue(value, state) {
	if (value === null || typeof value === "number" || typeof value === "boolean") return value;
	if (typeof value === "string") return snapshotString(value, state);
	if (Array.isArray(value)) {
		const items = value.slice(0, MAX_NATIVE_HOOK_RELAY_HISTORY_ARRAY_ITEMS).map((item) => snapshotJsonValue(item, state));
		if (value.length > MAX_NATIVE_HOOK_RELAY_HISTORY_ARRAY_ITEMS) items.push("[truncated]");
		return items;
	}
	const snapshot = {};
	const keys = Object.keys(value);
	for (const key of keys.slice(0, MAX_NATIVE_HOOK_RELAY_HISTORY_OBJECT_KEYS)) {
		const item = value[key];
		if (item !== void 0) snapshot[snapshotString(key, state)] = snapshotJsonValue(item, state);
	}
	if (keys.length > MAX_NATIVE_HOOK_RELAY_HISTORY_OBJECT_KEYS) snapshot["[truncated]"] = keys.length - MAX_NATIVE_HOOK_RELAY_HISTORY_OBJECT_KEYS;
	return snapshot;
}
function snapshotString(value, state) {
	if (state.remainingStringLength <= 0) return "[truncated]";
	const limit = Math.min(value.length, MAX_NATIVE_HOOK_RELAY_HISTORY_STRING_LENGTH, state.remainingStringLength);
	if (limit >= value.length) {
		state.remainingStringLength -= limit;
		return value;
	}
	const prefix = truncateUtf16Safe(value, limit);
	state.remainingStringLength -= prefix.length;
	return `${prefix}...[truncated]`;
}
function truncateRelayText(value, maxLength) {
	return truncateWithMarker(value, maxLength, {
		marker: "...",
		reserve: 3,
		trimEnd: false
	});
}
//#endregion
export { readNativeHookRelayEvent as a, readOptionalBoolean as c, truncateRelayText as d, normalizePositiveInteger as i, shellQuoteArgs as l, isJsonValue as n, readNativeHookRelayProvider as o, normalizeOptionalPositiveInteger as r, readNonEmptyString as s, isJsonObject as t, snapshotNativeHookRelayPayload as u };
