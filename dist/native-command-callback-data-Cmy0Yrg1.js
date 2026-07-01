//#region extensions/telegram/src/approval-callback-data.ts
const TELEGRAM_CALLBACK_DATA_MAX_BYTES = 64;
const TELEGRAM_APPROVE_ALLOW_ALWAYS_PATTERN = /^\/approve(?:@[^\s]+)?\s+[A-Za-z0-9][A-Za-z0-9._:-]*\s+allow-always$/i;
function fitsTelegramCallbackData(value) {
	return Buffer.byteLength(value, "utf8") <= TELEGRAM_CALLBACK_DATA_MAX_BYTES;
}
function rewriteTelegramApprovalDecisionAlias(value) {
	if (!value.endsWith(" allow-always")) return value;
	if (!TELEGRAM_APPROVE_ALLOW_ALWAYS_PATTERN.test(value)) return value;
	return value.slice(0, -12) + "always";
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
	if (!data) return null;
	const trimmed = data.trim();
	if (!trimmed.startsWith(TELEGRAM_NATIVE_COMMAND_CALLBACK_PREFIX)) return null;
	const commandText = trimmed.slice(6).trim();
	return commandText.startsWith("/") ? commandText : null;
}
function buildTelegramOpaqueCallbackData(value) {
	return `${TELEGRAM_OPAQUE_CALLBACK_PREFIX}${checksumTelegramOpaqueCallbackValue(value)}:${value}`;
}
function parseTelegramOpaqueCallbackData(data) {
	if (!data) return null;
	if (!data.startsWith(TELEGRAM_OPAQUE_CALLBACK_PREFIX)) return null;
	const encoded = data.slice(6);
	const separatorIndex = encoded.indexOf(":");
	if (separatorIndex <= 0) return null;
	const checksum = encoded.slice(0, separatorIndex);
	const value = encoded.slice(separatorIndex + 1);
	if (!value || checksum !== checksumTelegramOpaqueCallbackValue(value)) return null;
	return value;
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
export { fitsTelegramCallbackData as a, parseTelegramOpaqueCallbackData as i, buildTelegramOpaqueCallbackData as n, sanitizeTelegramCallbackData as o, parseTelegramNativeCommandCallbackData as r, buildTelegramNativeCommandCallbackData as t };
