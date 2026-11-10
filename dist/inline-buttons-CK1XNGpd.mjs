import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { n as listTelegramAccountIds } from "./account-selection-CQ3hKgoh.mjs";
import "./accounts-CHcpIFN8.mjs";
import { r as inspectTelegramAccount } from "./account-inspect-Dp1wulI-.mjs";
import "./topic-conversation-S0gZB4iY.mjs";
//#region extensions/telegram/src/inline-buttons.ts
const DEFAULT_INLINE_BUTTONS_SCOPE = "allowlist";
const INLINE_BUTTONS_SCOPES = [
	"off",
	"dm",
	"group",
	"all",
	"allowlist"
];
function resolveTelegramInlineButtonsConfigScope(capabilities) {
	if (!capabilities || Array.isArray(capabilities) || typeof capabilities !== "object" || !("inlineButtons" in capabilities)) return;
	const trimmed = normalizeOptionalLowercaseString(capabilities.inlineButtons);
	return INLINE_BUTTONS_SCOPES.find((scope) => scope === trimmed);
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
	const accountIds = params.accountId ? [params.accountId] : listTelegramAccountIds(params.cfg);
	return (accountIds.length > 0 ? accountIds : [params.accountId]).some((accountId) => resolveTelegramInlineButtonsScope({
		cfg: params.cfg,
		accountId
	}) !== "off");
}
//#endregion
export { resolveTelegramInlineButtonsScopeFromCapabilities as i, resolveTelegramInlineButtonsConfigScope as n, resolveTelegramInlineButtonsScope as r, isTelegramInlineButtonsEnabled as t };
