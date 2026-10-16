import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { l as tryResolveSoleAgentId, n as listAgentEntries, t as hasAgentRosterProperty } from "./agent-roster-BXD1uMJD.mjs";
import { p as resolveSessionTranscriptsDirForAgent } from "./paths-dpReqUI8.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as mutateConfigFileWithRetry } from "./mutate-Br6nKTV_.mjs";
import "./config-CzeZu5J_.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { i as pruneAgentConfig, r as findAgentEntryIndex, t as applyAgentConfig } from "./agents.config-CEaxMlw1.mjs";
//#region src/gateway/server-methods/agents-config-mutations.ts
var AgentConfigPreconditionError = class extends Error {};
var AgentModelSelectionError = class extends Error {};
function isModelOnlyUpdate(params) {
	return Boolean(params.model) && params.name === void 0 && params.workspace === void 0 && params.identity === void 0;
}
function validateAgentModelSelectionUpdate(params) {
	if (!params.agentRuntime) return;
	if (!isModelOnlyUpdate(params) || params.emoji !== void 0 || params.avatar !== void 0 || !params.model) return "Runtime selection requires a model-only update.";
	if (splitTrailingAuthProfile(params.model).profile) return "Choose a model without an OpenClaw sign-in override for this runtime.";
}
function isConfiguredAgent(cfg, agentId) {
	return findAgentEntryIndex(listAgentEntries(cfg), agentId) >= 0;
}
function isImplicitAgentModelUpdate(cfg, params) {
	return !hasAgentRosterProperty(cfg) && tryResolveSoleAgentId(cfg) === params.agentId && isModelOnlyUpdate(params) && params.agentRuntime !== void 0;
}
async function updateAgentConfigEntry(params) {
	const selectionError = validateAgentModelSelectionUpdate(params);
	if (selectionError) throw new AgentModelSelectionError(selectionError);
	const selectionModules = params.agentRuntime ? await Promise.all([
		import("./model-runtime-choice-jlUbgk-m.mjs"),
		import("./shared-D9Gh-Bv1.mjs"),
		import("./setup-model-selection-DxGf3GdB.mjs")
	]) : void 0;
	let validateSelection;
	await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		writeOptions: {
			...params.identity ? { allowConfigSizeDrop: true } : {},
			assertConfigPathForWrite: () => {
				params.assertCurrent?.();
				const error = validateSelection?.();
				if (error) throw new AgentModelSelectionError(error);
			}
		},
		mutate: async (draft) => {
			validateSelection = void 0;
			const configured = isConfiguredAgent(draft, params.agentId);
			if (!configured && !isImplicitAgentModelUpdate(draft, params)) throw new AgentConfigPreconditionError(`agent "${params.agentId}" not found`);
			let next = draft;
			if (params.model && selectionModules) {
				const [runtimeChoice, modelConfig, modelSelection] = selectionModules;
				const target = modelConfig.resolveModelTarget({
					raw: params.model,
					cfg: draft
				});
				const choice = await runtimeChoice.preparePublishedModelRuntimeChoice({
					cfg: draft,
					agentId: params.agentId,
					provider: target.provider,
					model: target.model,
					runtimeId: params.agentRuntime
				});
				if (choice.kind === "unavailable") throw new AgentModelSelectionError(choice.message);
				validateSelection = choice.validate;
				next = await modelSelection.applySystemAgentModelSelection({
					config: draft,
					model: params.model,
					agentRuntimeId: choice.runtimeId,
					...configured ? { targetAgentId: params.agentId } : { runtimeInDefaults: true }
				});
			}
			const latestNextConfig = configured ? applyAgentConfig(next, {
				agentId: params.agentId,
				...params.name ? { name: params.name } : {},
				...params.workspace ? { workspace: params.workspace } : {},
				...!params.agentRuntime && params.model !== void 0 ? { model: params.model } : {},
				...params.identity ? { identity: params.identity } : {}
			}) : next;
			Object.assign(draft, latestNextConfig);
		}
	});
}
/** Removes an agent entry and returns filesystem roots the caller should clean up. */
async function deleteAgentConfigEntry(params) {
	const committed = await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		writeOptions: {
			allowedAgentRosterRemovals: [params.agentId],
			assertConfigPathForWrite: params.assertCurrent,
			...params.allowConfigSizeDrop ? { allowConfigSizeDrop: true } : {}
		},
		mutate: (draft) => {
			params.validateConfig?.(draft);
			if (!isConfiguredAgent(draft, params.agentId) && !params.allowMissing) throw new AgentConfigPreconditionError(`agent "${params.agentId}" not found`);
			const agent = listAgentEntries(draft).find((candidate) => candidate.id === params.agentId);
			if (agent) params.validate?.(agent);
			const workspaceDir = agent ? resolveAgentWorkspaceDir(draft, params.agentId) : params.fallbackWorkspace ?? "";
			const agentDir = resolveAgentDir(draft, params.agentId);
			const sessionsDir = resolveSessionTranscriptsDirForAgent(params.agentId);
			const result = pruneAgentConfig(draft, params.agentId);
			Object.assign(draft, result.config);
			if (!agent) return;
			return {
				workspaceDir,
				agentDir,
				sessionsDir,
				removedBindings: result.removedBindings
			};
		}
	});
	return {
		nextConfig: committed.nextConfig,
		result: committed.result
	};
}
//#endregion
export { isImplicitAgentModelUpdate as a, isConfiguredAgent as i, AgentModelSelectionError as n, updateAgentConfigEntry as o, deleteAgentConfigEntry as r, validateAgentModelSelectionUpdate as s, AgentConfigPreconditionError as t };
