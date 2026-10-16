import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import crypto from "node:crypto";
//#region src/plugins/conversation-binding-session-key.ts
function normalizeChannel(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
function buildPluginBindingSessionKey(params) {
	const hash = crypto.createHash("sha256").update(JSON.stringify({
		pluginId: params.pluginId,
		channel: normalizeChannel(params.channel),
		accountId: params.accountId,
		conversationId: params.conversationId
	})).digest("hex").slice(0, 24);
	return `plugin-binding:${params.pluginId}:${hash}`;
}
//#endregion
export { normalizeChannel as n, buildPluginBindingSessionKey as t };
