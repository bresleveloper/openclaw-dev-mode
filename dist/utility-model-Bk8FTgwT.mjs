import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { r as resolveLegacyImplicitPrimaryModelRef, t as hasUtilityModelSeparationMigrationMarker } from "./utility-model-separation-migration-CoAPHAUL.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { y as readUtilityModelSetting } from "./model-selection-shared-0uvJbX1M.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import "./model-selection-CFnUi6iD.mjs";
//#region src/agents/utility-model.ts
/** Legacy utility settings did not remove the ordinary implicit primary route. */
function resolveConfiguredPrimaryModelForAgent(params) {
	const primary = resolveAgentEffectiveModelPrimary(params.cfg, params.agentId)?.trim();
	if (primary) return primary;
	return !hasUtilityModelSeparationMigrationMarker(params.cfg) && readUtilityModelSetting(params.cfg, params.agentId).kind === "explicit" ? resolveLegacyImplicitPrimaryModelRef(params.cfg) : void 0;
}
/** Setup can use an explicit utility model until the agent has its own primary. */
function resolveConfiguredSetupModelForAgent(params) {
	const primary = resolveConfiguredPrimaryModelForAgent(params);
	if (primary && params.modelTarget !== "utility") return {
		modelRef: primary,
		...!resolveAgentEffectiveModelPrimary(params.cfg, params.agentId)?.trim() ? { implicitPrimary: true } : {}
	};
	const utility = readUtilityModelSetting(params.cfg, params.agentId);
	return utility.kind === "explicit" ? {
		modelRef: utility.modelRef,
		modelTarget: "utility"
	} : void 0;
}
/**
* Automatic utility model for an already-resolved primary provider (manifest
* `modelCatalog.providers.<id>.defaultUtilityModel`), or undefined when the
* provider does not declare one. Reads only the process-current plugin
* metadata snapshot, so the lookup stays synchronous and cheap; contexts
* without a snapshot simply get no derived default.
*/
function resolveAutomaticUtilityModelRef(params) {
	const provider = params.primaryProvider.trim().toLowerCase();
	if (!provider) return;
	const snapshot = params.metadataSnapshot ?? getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		allowWorkspaceScopedSnapshot: true
	});
	if (!snapshot) return;
	for (const plugin of snapshot.plugins) {
		const modelId = (plugin.modelCatalog?.providers?.[provider]?.defaultUtilityModel)?.trim();
		if (modelId) {
			const derived = `${provider}/${modelId}`;
			const profile = params.primaryModelRef ? splitTrailingAuthProfile(params.primaryModelRef).profile : void 0;
			return profile ? `${derived}@${profile}` : derived;
		}
	}
}
/**
* The utility model ref to use for the agent, or undefined when utility
* routing is disabled or no default exists. Callers with a session-specific
* selection pass both primary fields so automatic routing keeps that session's
* provider and auth owner.
*/
function resolveUtilityModelRefForAgent(params) {
	const setting = readUtilityModelSetting(params.cfg, params.agentId);
	if (setting.kind === "explicit") return setting.modelRef;
	if (setting.kind === "disabled") return;
	const provider = params.primaryProvider?.trim() || resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	}).provider;
	return resolveAutomaticUtilityModelRef({
		cfg: params.cfg,
		primaryProvider: provider,
		primaryModelRef: params.primaryModelRef?.trim() || resolveAgentEffectiveModelPrimary(params.cfg, params.agentId),
		metadataSnapshot: params.metadataSnapshot
	});
}
//#endregion
export { resolveUtilityModelRefForAgent as i, resolveConfiguredPrimaryModelForAgent as n, resolveConfiguredSetupModelForAgent as r, resolveAutomaticUtilityModelRef as t };
