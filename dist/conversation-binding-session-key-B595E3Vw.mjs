import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import crypto from "node:crypto";
//#region src/plugins/conversation-binding-session-key.ts
const PLUGIN_BINDING_SESSION_PREFIX = "plugin-binding";
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
	return `${PLUGIN_BINDING_SESSION_PREFIX}:${params.pluginId}:${hash}`;
}
//#endregion
export { buildPluginBindingSessionKey as n, normalizeChannel as r, PLUGIN_BINDING_SESSION_PREFIX as t };
