import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { o as getPreparedModelRuntimeAuthStore } from "./prepared-model-runtime-auth-Bd3e65L_.mjs";
//#region src/agents/prepared-model-catalog-owner.ts
var PublishedModelCatalogOwnerResolutionError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "PublishedModelCatalogOwnerResolutionError";
	}
};
function preparePublishedModelCatalogOwnerIdentity(input) {
	const env = input.env ?? process.env;
	const configuredAgentIds = listAgentIds(input.config);
	const directoryAgentIds = input.agentId ? [] : configuredAgentIds.filter((candidate) => resolveAgentDir(input.config, candidate, env) === input.agentDir);
	const agentId = input.agentId ? configuredAgentIds.find((candidate) => normalizeAgentId(candidate) === normalizeAgentId(input.agentId)) : directoryAgentIds.length === 1 ? directoryAgentIds[0] : void 0;
	if (!agentId || resolveAgentDir(input.config, agentId, env) !== input.agentDir) return;
	const workspaceDir = input.workspaceDir ?? resolveAgentWorkspaceDir(input.config, agentId, env);
	return workspaceDir ? Object.freeze({
		agentId,
		workspaceDir
	}) : void 0;
}
function resolvePublishedModelCatalogOwner(snapshot) {
	const { catalogOwner } = snapshot;
	if (!catalogOwner) throw new PublishedModelCatalogOwnerResolutionError(`published model catalog owner did not identify one configured agent (${snapshot.agentDir})`);
	const { agentId, workspaceDir } = catalogOwner;
	const authStore = snapshot.authStore ?? getPreparedModelRuntimeAuthStore(snapshot);
	if (!authStore) throw new PublishedModelCatalogOwnerResolutionError(`published model catalog owner is missing prepared auth state (${agentId})`);
	return Object.freeze({
		catalogOwner,
		agentId,
		agentDir: snapshot.agentDir,
		workspaceDir,
		config: snapshot.config,
		observationConfig: snapshot.observationConfig,
		authModes: snapshot.authModes,
		authStore,
		metadataSnapshot: snapshot.metadataSnapshot,
		pluginRegistry: snapshot.pluginRegistry,
		isCurrent: snapshot.isCurrent,
		modelCatalog: snapshot.modelCatalog
	});
}
function publishedModelCatalogOwnerMatchesAgent(owner, agentId) {
	return owner.agentId === normalizeAgentId(agentId);
}
//#endregion
export { publishedModelCatalogOwnerMatchesAgent as n, resolvePublishedModelCatalogOwner as r, preparePublishedModelCatalogOwnerIdentity as t };
