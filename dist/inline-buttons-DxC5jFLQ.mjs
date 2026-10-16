import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as listTelegramAccountIds } from "./accounts-Dt8wbZ2I.mjs";
import { r as inspectTelegramAccount } from "./account-inspect-DoeQ6S2Q.mjs";
import "./topic-conversation-C-lzScEI.mjs";
//#region extensions/telegram/src/inline-buttons.ts
const DEFAULT_INLINE_BUTTONS_SCOPE = "allowlist";
function normalizeInlineButtonsScope(value) {
	const trimmed = normalizeOptionalLowercaseString(value);
	if (trimmed === "off" || trimmed === "dm" || trimmed === "group" || trimmed === "all" || trimmed === "allowlist") return trimmed;
}
function resolveTelegramInlineButtonsConfigScope(capabilities) {
	if (!capabilities || Array.isArray(capabilities) || typeof capabilities !== "object" || !("inlineButtons" in capabilities)) return;
	return normalizeInlineButtonsScope(capabilities.inlineButtons);
}
function resolveTelegramInlineButtonsScopeFromCapabilities(capabilities) {
	if (Array.isArray(capabilities) && capabilities.length > 0) return capabilities.some((entry) => normalizeLowercaseStringOrEmpty(String(entry)) === "inlinebuttons") ? "all" : "off";
	return resolveTelegramInlineButtonsConfigScope(capabilities) ?? DEFAULT_INLINE_BUTTONS_SCOPE;
}
function resolveTelegramInlineButtonsScope(params) {
	return resolveTelegramInlineButtonsScopeFromCapabilities(inspectTelegramAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).config.capabilities);
}
function isTelegramInlineButtonsEnabled(params) {
	if (params.accountId) return resolveTelegramInlineButtonsScope(params) !== "off";
	const accountIds = listTelegramAccountIds(params.cfg);
	if (accountIds.length === 0) return resolveTelegramInlineButtonsScope(params) !== "off";
	return accountIds.some((accountId) => resolveTelegramInlineButtonsScope({
		cfg: params.cfg,
		accountId
	}) !== "off");
}
//#endregion
export { resolveTelegramInlineButtonsScopeFromCapabilities as i, resolveTelegramInlineButtonsConfigScope as n, resolveTelegramInlineButtonsScope as r, isTelegramInlineButtonsEnabled as t };
