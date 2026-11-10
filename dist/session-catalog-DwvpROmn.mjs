import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { _ as resolveSessionAgentIds } from "./agent-scope-DXrnO3F4.mjs";
import { createHash } from "node:crypto";
//#region src/plugins/session-catalog.ts
function normalizeUserText(text) {
	return text.trim().replace(/\s+/g, " ");
}
function isExternalUserText(probe, text) {
	const normalized = text === void 0 ? "" : normalizeUserText(text);
	return !probe.ownRecentUserTexts.includes(normalized);
}
function listSessionCatalogEntries(params) {
	const requiresExplicitOwner = params.config.agents?.ownership === "explicit";
	const requestedAgentId = params.agentId || requiresExplicitOwner ? resolveSessionAgentIds({
		config: params.config,
		agentId: params.agentId
	}).sessionAgentId : void 0;
	const requestEntries = params.sessionEntries?.entriesForCatalog?.();
	if (requestEntries) return requiresExplicitOwner && requestedAgentId ? requestEntries.filter((entry) => entry.agentId === requestedAgentId) : requestEntries;
	const defaultAgentId = requestedAgentId ?? resolveSessionAgentIds({ config: params.config }).defaultAgentId;
	return (requiresExplicitOwner ? [defaultAgentId] : [defaultAgentId, ...listAgentIds(params.config).filter((agentId) => agentId !== defaultAgentId)]).flatMap((agentId) => {
		return (params.sessionEntries ? params.sessionEntries.entriesForAgent(agentId) : params.runtime.agent.session.listSessionEntries({
			agentId,
			readOnly: true
		})).map((entry) => Object.assign({}, entry, { agentId }));
	});
}
function sessionCatalogAdoptedSourceKey(hostId, threadId) {
	return `${hostId}\0${threadId}`;
}
function sessionCatalogAdoptedSessionKey(prefix, source) {
	return `${prefix}${createHash("sha256").update(source).digest("hex")}`;
}
function listAdoptedSessionCatalogSessions(params) {
	const adopted = /* @__PURE__ */ new Map();
	for (const { sessionKey, entry } of listSessionCatalogEntries(params)) {
		const source = params.sourceFromEntry(entry);
		if (source && entry.pluginOwnerId === params.pluginId && entry.initializationPending !== true) adopted.set(sessionCatalogAdoptedSourceKey(source.hostId, source.threadId), sessionKey);
	}
	return adopted;
}
function createSessionCatalogAdoptionCoordinator() {
	const operations = /* @__PURE__ */ new Map();
	return async (params) => {
		return await getOrCreatePromise(operations, params.sourceKey, async () => {
			const existing = await params.findExisting();
			const continued = existing ? { sessionKey: existing } : await params.create().catch(async (error) => {
				const raced = await params.findExisting();
				if (raced) return { sessionKey: raced };
				throw error;
			});
			return await params.complete(continued);
		}, { evictOnSettled: true });
	};
}
//#endregion
export { normalizeUserText as a, listSessionCatalogEntries as i, isExternalUserText as n, sessionCatalogAdoptedSessionKey as o, listAdoptedSessionCatalogSessions as r, sessionCatalogAdoptedSourceKey as s, createSessionCatalogAdoptionCoordinator as t };
