import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/matrix/src/matrix/target-ids.ts
const MATRIX_PREFIX = "matrix:";
const ROOM_PREFIX = "room:";
const CHANNEL_PREFIX = "channel:";
const USER_PREFIX = "user:";
function stripKnownPrefixes(raw, prefixes) {
	let normalized = raw.trim();
	while (normalized) {
		const lowered = normalizeLowercaseStringOrEmpty(normalized);
		const matched = prefixes.find((prefix) => lowered.startsWith(prefix));
		if (!matched) return normalized;
		normalized = normalized.slice(matched.length).trim();
	}
	return normalized;
}
function resolveMatrixTargetIdentity(raw) {
	const normalized = stripKnownPrefixes(raw, [MATRIX_PREFIX]);
	if (!normalized) return null;
	const lowered = normalizeLowercaseStringOrEmpty(normalized);
	if (lowered.startsWith(USER_PREFIX)) {
		const id = normalized.slice(5).trim();
		return id ? {
			kind: "user",
			id
		} : null;
	}
	if (lowered.startsWith(ROOM_PREFIX)) {
		const id = normalized.slice(5).trim();
		return id ? {
			kind: "room",
			id
		} : null;
	}
	if (lowered.startsWith(CHANNEL_PREFIX)) {
		const id = normalized.slice(8).trim();
		return id ? {
			kind: "room",
			id
		} : null;
	}
	if (isMatrixQualifiedUserId(normalized)) return {
		kind: "user",
		id: normalized
	};
	return {
		kind: "room",
		id: normalized
	};
}
function isMatrixQualifiedUserId(raw) {
	const trimmed = raw.trim();
	return trimmed.startsWith("@") && trimmed.includes(":");
}
/**
* Whether `raw` is already a literal room ID rather than a name/query to resolve.
* Room version 12 (MSC4291) dropped the trailing ":server" from room IDs — they're
* now a hash of the create event — so this must not require a colon the way user
* IDs and aliases still do.
*/
function isMatrixRoomId(raw) {
	const trimmed = raw.trim();
	return trimmed.startsWith("!") && trimmed.length > 1;
}
function normalizeMatrixResolvableTarget(raw) {
	return stripKnownPrefixes(raw, [
		MATRIX_PREFIX,
		ROOM_PREFIX,
		CHANNEL_PREFIX
	]);
}
function normalizeMatrixMessagingTarget(raw) {
	return stripKnownPrefixes(raw, [
		MATRIX_PREFIX,
		ROOM_PREFIX,
		CHANNEL_PREFIX,
		USER_PREFIX
	]) || void 0;
}
function resolveMatrixDirectUserId(params) {
	if (params.chatType !== "direct") return;
	if (!normalizeMatrixResolvableTarget(params.to ?? "").startsWith("!")) return;
	const userId = stripKnownPrefixes(params.from ?? "", [MATRIX_PREFIX, USER_PREFIX]);
	return isMatrixQualifiedUserId(userId) ? userId : void 0;
}
//#endregion
export { resolveMatrixDirectUserId as a, normalizeMatrixResolvableTarget as i, isMatrixRoomId as n, resolveMatrixTargetIdentity as o, normalizeMatrixMessagingTarget as r, isMatrixQualifiedUserId as t };
