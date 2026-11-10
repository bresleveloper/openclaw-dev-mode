import { t as buildApprovalResolutionRef } from "./approval-resolution-ref-DRRWcLCw.mjs";
import "./approval-reference-runtime-DLZBzRTo.mjs";
const TELEGRAM_APPROVAL_CALLBACK_PREFIX = "tga1:";
const APPROVAL_KINDS = [
	["exec", "e"],
	["plugin", "p"],
	["system-agent", "s"]
];
const APPROVAL_DECISIONS = [
	["allow-once", "o"],
	["allow-always", "a"],
	["deny", "d"]
];
const TELEGRAM_APPROVE_ALLOW_ALWAYS_PATTERN = /^\/approve(?:@[^\s]+)?\s+[A-Za-z0-9][A-Za-z0-9._:-]*\s+allow-always(?![\s\S])/i;
function fitsTelegramCallbackData(value) {
	return Buffer.byteLength(value, "utf8") <= 64;
}
/** Reserve the Telegram approval namespace even when a callback is malformed. */
function hasTelegramApprovalCallbackPrefix(data) {
	return data?.startsWith(TELEGRAM_APPROVAL_CALLBACK_PREFIX) === true;
}
/** Encode a typed approval action into Telegram-private, versioned callback data. */
function buildTelegramApprovalCallbackData(action) {
	const approvalKind = action.approvalKind;
	const kind = APPROVAL_KINDS.find(([value]) => value === approvalKind)?.[1];
	const decision = APPROVAL_DECISIONS.find(([value]) => value === action.decision)?.[1];
	if (!action.approvalId || !kind || !decision) return;
	const encode = (approvalId) => `${TELEGRAM_APPROVAL_CALLBACK_PREFIX}${kind}:${decision}:${approvalId}`;
	const exact = encode(action.approvalId);
	if (fitsTelegramCallbackData(exact)) return exact;
	return encode(buildApprovalResolutionRef({
		approvalId: action.approvalId,
		approvalKind
	}));
}
/** Decode only callbacks emitted by buildTelegramApprovalCallbackData. */
function parseTelegramApprovalCallbackData(data) {
	if (!hasTelegramApprovalCallbackPrefix(data) || !data || !fitsTelegramCallbackData(data)) return null;
	const encoded = data.slice(5);
	if (encoded.length < 5 || encoded[1] !== ":" || encoded[3] !== ":") return null;
	const approvalKind = APPROVAL_KINDS.find(([, code]) => code === encoded[0])?.[0];
	const decision = APPROVAL_DECISIONS.find(([, code]) => code === encoded[2])?.[0];
	const approvalId = encoded.slice(4);
	if (!approvalKind || !decision) return null;
	return {
		type: "approval",
		approvalId,
		approvalKind,
		decision
	};
}
function rewriteTelegramApprovalDecisionAlias(value) {
	return TELEGRAM_APPROVE_ALLOW_ALWAYS_PATTERN.test(value) ? value.slice(0, -12) + "always" : value;
}
function sanitizeTelegramCallbackData(value) {
	const rewritten = rewriteTelegramApprovalDecisionAlias(value);
	return fitsTelegramCallbackData(rewritten) ? rewritten : void 0;
}
//#endregion
//#region extensions/telegram/src/native-command-callback-data.ts
const TELEGRAM_NATIVE_COMMAND_CALLBACK_PREFIX = "tgcmd:";
const TELEGRAM_OPAQUE_CALLBACK_PREFIX = "tgcb1:";
function buildTelegramNativeCommandCallbackData(commandText) {
	return `${TELEGRAM_NATIVE_COMMAND_CALLBACK_PREFIX}${commandText}`;
}
function parseTelegramNativeCommandCallbackData(data) {
	const trimmed = data?.trim();
	if (!trimmed?.startsWith(TELEGRAM_NATIVE_COMMAND_CALLBACK_PREFIX)) return null;
	const commandText = trimmed.slice(6).trim();
	return commandText.startsWith("/") ? commandText : null;
}
function buildTelegramOpaqueCallbackData(value) {
	return `${TELEGRAM_OPAQUE_CALLBACK_PREFIX}${checksumTelegramOpaqueCallbackValue(value)}:${value}`;
}
function hasTelegramOpaqueCallbackPrefix(data) {
	return data?.startsWith(TELEGRAM_OPAQUE_CALLBACK_PREFIX) === true;
}
function parseTelegramOpaqueCallbackData(data) {
	if (!data || !hasTelegramOpaqueCallbackPrefix(data)) return null;
	const encoded = data.slice(6);
	const separatorIndex = encoded.indexOf(":");
	const value = encoded.slice(separatorIndex + 1);
	return separatorIndex > 0 && value && encoded.slice(0, separatorIndex) === checksumTelegramOpaqueCallbackValue(value) ? value : null;
}
function checksumTelegramOpaqueCallbackValue(value) {
	let hash = 2166136261;
	for (let index = 0; index < value.length; index += 1) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619) >>> 0;
	}
	return hash.toString(36).slice(0, 5).padStart(5, "0");
}
//#endregion
export { parseTelegramOpaqueCallbackData as a, hasTelegramApprovalCallbackPrefix as c, sanitizeTelegramCallbackData as d, parseTelegramNativeCommandCallbackData as i, parseTelegramApprovalCallbackData as l, buildTelegramOpaqueCallbackData as n, buildTelegramApprovalCallbackData as o, hasTelegramOpaqueCallbackPrefix as r, fitsTelegramCallbackData as s, buildTelegramNativeCommandCallbackData as t, rewriteTelegramApprovalDecisionAlias as u };
