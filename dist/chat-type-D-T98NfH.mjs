import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/channels/chat-type.ts
/**
* Channel conversation kind normalization.
*
* Maps channel-specific direct/group/channel labels into OpenClaw chat types.
*/
/**
* Normalizes channel-specific chat type labels into OpenClaw conversation kinds.
*/
function normalizeChatType(raw) {
	const value = normalizeOptionalLowercaseString(raw);
	if (value === "dm") return "direct";
	return value === "direct" || value === "group" || value === "channel" ? value : void 0;
}
//#endregion
export { normalizeChatType as t };
