import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { _ as toAgentStoreSessionKey } from "./session-key-C09ow4h0.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/session-create-key.ts
function buildSessionCatalogImportKey(agentId, locator) {
	const digest = createHash("sha256").update(JSON.stringify([
		locator.catalogId,
		locator.hostId,
		locator.sourceHomeId ?? null,
		locator.threadId
	])).digest("hex");
	return toAgentStoreSessionKey({
		agentId,
		requestKey: `catalog-import:${digest}`
	});
}
function buildDashboardSessionKey(agentId, options = {}) {
	return `agent:${agentId}:dashboard:${`${options.incognito ? "incognito-" : ""}${randomUUID()}`}`;
}
function resolveSessionCreateTargetKey(params) {
	const { cfg, agentId, requestedKey } = params;
	const loweredRequestedKey = normalizeOptionalLowercaseString(requestedKey);
	return requestedKey ? loweredRequestedKey === "global" || loweredRequestedKey === "unknown" ? loweredRequestedKey : toAgentStoreSessionKey({
		agentId,
		requestKey: requestedKey,
		mainKey: cfg.session?.mainKey
	}) : void 0;
}
//#endregion
export { buildSessionCatalogImportKey as n, resolveSessionCreateTargetKey as r, buildDashboardSessionKey as t };
