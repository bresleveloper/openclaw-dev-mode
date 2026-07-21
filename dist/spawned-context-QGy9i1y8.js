import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./agent-scope-B2Pk_xhT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-A-JGvyXu.js";
import { u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { o as resolveAgentWorkspaceDir } from "./agent-scope-config-BxAUeF6t.js";
//#region src/agents/spawned-context.ts
/**
* Spawned run metadata helpers.
*
* Projects tool runtime context into persisted lineage, group routing, workspace, and inherited policy metadata.
*/
/** Normalize optional spawn metadata fields from persisted or tool-provided input. */
function normalizeSpawnedRunMetadata(value) {
	return {
		spawnedBy: normalizeOptionalString(value?.spawnedBy),
		groupId: normalizeOptionalString(value?.groupId),
		groupChannel: normalizeOptionalString(value?.groupChannel),
		groupSpace: normalizeOptionalString(value?.groupSpace),
		workspaceDir: normalizeOptionalString(value?.workspaceDir)
	};
}
/** Project tool runtime context down to the persisted spawned-run metadata shape. */
function mapToolContextToSpawnedRunMetadata(value) {
	return {
		groupId: normalizeOptionalString(value?.agentGroupId),
		groupChannel: normalizeOptionalString(value?.agentGroupChannel),
		groupSpace: normalizeOptionalString(value?.agentGroupSpace),
		workspaceDir: normalizeOptionalString(value?.workspaceDir)
	};
}
/** Resolve which workspace a spawned run should inherit. */
function resolveSpawnedWorkspaceInheritance(params) {
	const explicit = normalizeOptionalString(params.explicitWorkspaceDir);
	if (explicit) return explicit;
	const agentId = params.targetAgentId ?? (params.requesterSessionKey ? parseAgentSessionKey(params.requesterSessionKey)?.agentId : void 0);
	return agentId ? resolveAgentWorkspaceDir(params.config, normalizeAgentId(agentId)) : void 0;
}
/** Return a spawned run's ingress workspace override only for child runs. */
function resolveIngressWorkspaceOverrideForSpawnedRun(metadata) {
	const normalized = normalizeSpawnedRunMetadata(metadata);
	return normalized.spawnedBy ? normalized.workspaceDir : void 0;
}
//#endregion
export { resolveSpawnedWorkspaceInheritance as i, normalizeSpawnedRunMetadata as n, resolveIngressWorkspaceOverrideForSpawnedRun as r, mapToolContextToSpawnedRunMetadata as t };
