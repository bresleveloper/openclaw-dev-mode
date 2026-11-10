import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/channels/chat-type.ts
function normalizeChatType(raw) {
	const value = normalizeOptionalLowercaseString(raw);
	if (value === "dm") return "direct";
	return value === "direct" || value === "group" || value === "channel" ? value : void 0;
}
//#endregion
export { normalizeChatType as t };
