import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { w as resolveRuntimeModelConfigCacheKey } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./session-key-CSDERtm3.mjs";
import { O as withAgentRosterFactsBatch, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { _ as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-CeDA0ojh.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { i as getPreparedModelFullCatalogAuth } from "./prepared-model-runtime-auth-xGBK6WuU.mjs";
import { T as withPreparedModelRuntimeReadBatch } from "./prepared-model-runtime-wDlPVSla.mjs";
import "./prepared-model-catalog-B9Dr8wIV.mjs";
//#region src/gateway/server-methods/chat-metadata-facts.ts
var ChatMetadataSnapshotUnavailableError = class extends Error {
	constructor(message = "prepared chat metadata snapshot is unavailable") {
		super(message);
		this.name = "ChatMetadataSnapshotUnavailableError";
	}
};
function assertPreparedAgentCurrent(agent) {
	if (!agent.owner.isCurrent()) throw new ChatMetadataSnapshotUnavailableError(`prepared chat metadata owner retired for agent "${agent.agentId}"`);
}
function authStoresCurrent(facts, deps) {
	return facts.agents.every(({ owner, authStoreRevision }) => authStoreRevision === `${deps.getAuthStoreRevision(owner.agentDir)}:${deps.getAuthStoreRevision(owner.inheritedAuthDir)}`);
}
function captureGenerationFacts(deps) {
	const config = deps.getConfig();
	const agents = withPreparedModelRuntimeReadBatch(() => withAgentRosterFactsBatch(config, () => listAgentIds(config).filter((agentId) => !readAgentDatabaseAdmissionRefusal(agentId)).flatMap((rawAgentId) => {
		const agentId = normalizeAgentId(rawAgentId);
		const owner = deps.getPreparedOwner({
			agentId,
			config
		});
		if (!owner) return [];
		const workspaceDir = owner.workspaceDir ?? resolveAgentWorkspaceDir(config, agentId);
		const fullModelCatalog = owner.readFullModelCatalog?.();
		const fullCatalogAuth = fullModelCatalog ? getPreparedModelFullCatalogAuth(fullModelCatalog) : void 0;
		if (fullModelCatalog && !fullCatalogAuth) throw new Error("prepared full model catalog omitted its auth generation");
		const catalog = fullModelCatalog ?? owner.modelCatalog;
		return [{
			agentId,
			owner,
			authStore: fullCatalogAuth?.authStore ?? deps.getPreparedAuthStore(owner.agentDir, owner.inheritedAuthDir) ?? {
				version: 1,
				profiles: {}
			},
			authModes: fullCatalogAuth?.authModes ?? owner.authModes,
			authStoreRevision: `${deps.getAuthStoreRevision(owner.agentDir)}:${deps.getAuthStoreRevision(owner.inheritedAuthDir)}`,
			authCatalogRevision: String(deps.getAuthCatalogRevision(owner.agentDir)) + ":" + String(deps.getAuthCatalogRevision(owner.inheritedAuthDir)),
			modelCatalog: catalog,
			catalogRefreshFailed: catalog.refreshFailed === true,
			skillsVersion: deps.getSkillsVersion(workspaceDir)
		}];
	})));
	return {
		config,
		configKey: resolveRuntimeModelConfigCacheKey(config),
		pluginRegistryVersion: deps.getPluginRegistryVersion(),
		agents
	};
}
function generationFactsMatch(left, right, scope = "metadata") {
	if (left.configKey !== right.configKey || left.pluginRegistryVersion !== right.pluginRegistryVersion || left.agents.length !== right.agents.length) return false;
	return left.agents.every((agent, index) => {
		const candidate = right.agents[index];
		return candidate?.agentId === agent.agentId && (scope === "commands" ? candidate.skillsVersion === agent.skillsVersion && candidate.owner.workspaceDir === agent.owner.workspaceDir : candidate.owner.isCurrent === agent.owner.isCurrent && (scope === "catalog-notification" ? candidate.authCatalogRevision === agent.authCatalogRevision : candidate.authStoreRevision === agent.authStoreRevision) && candidate.modelCatalog === agent.modelCatalog && (scope === "auth" || candidate.catalogRefreshFailed === agent.catalogRefreshFailed) && (scope !== "metadata" || candidate.skillsVersion === agent.skillsVersion));
	});
}
//#endregion
export { generationFactsMatch as a, captureGenerationFacts as i, assertPreparedAgentCurrent as n, authStoresCurrent as r, ChatMetadataSnapshotUnavailableError as t };
