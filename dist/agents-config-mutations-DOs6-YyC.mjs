import { a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { l as tryResolveSoleAgentId, n as listAgentEntries, t as hasAgentRosterProperty } from "./agent-roster-gkYP38su.mjs";
import { d as resolveSessionTranscriptsDirForAgent } from "./paths-YgcBNLgG.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { S as copyRuntimeConfigWriteApplication } from "./io.runtime-Ds5uC0Bf.mjs";
import { n as mutateConfigFileWithRetry, o as transformConfigFileWithRetry } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import "./sessions-CnzPI1yx.mjs";
import { i as pruneAgentConfig, r as findAgentEntryIndex, t as applyAgentConfig } from "./agents.config-B7znCYIL.mjs";
import { n as createAgent } from "./agent-create-BV29J2Xa.mjs";
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
function createAgentConfigEntry(params, writeOptions) {
	return createAgent({
		...params,
		transformConfig: (mutation) => transformConfigFileWithRetry({
			...mutation,
			writeOptions: copyRuntimeConfigWriteApplication(writeOptions, mutation.writeOptions ?? {})
		})
	});
}
async function updateAgentConfigEntry(params, writeOptions) {
	const selectionError = validateAgentModelSelectionUpdate(params);
	if (selectionError) throw new AgentModelSelectionError(selectionError);
	const selectionModules = params.agentRuntime ? await Promise.all([
		import("./model-runtime-choice-9usX3gbl.mjs"),
		import("./shared-mQIoSSd9.mjs"),
		import("./setup-model-selection-DzNjszZz.mjs")
	]) : void 0;
	let validateSelection;
	await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		writeOptions: copyRuntimeConfigWriteApplication(writeOptions, {
			...params.identity ? { allowConfigSizeDrop: true } : {},
			assertConfigPathForWrite: () => {
				params.assertCurrent?.();
				const error = validateSelection?.();
				if (error) throw new AgentModelSelectionError(error);
			}
		}),
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
		writeOptions: copyRuntimeConfigWriteApplication(params.writeOptions, {
			allowedAgentRosterRemovals: [params.agentId],
			assertConfigPathForWrite: params.assertCurrent,
			beforeCommit: params.assertCurrentAsync,
			...params.allowConfigSizeDrop ? { allowConfigSizeDrop: true } : {}
		}),
		mutate: async (draft) => {
			await params.validateConfig?.(draft);
			params.assertCurrent?.();
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
export { isConfiguredAgent as a, validateAgentModelSelectionUpdate as c, deleteAgentConfigEntry as i, AgentModelSelectionError as n, isImplicitAgentModelUpdate as o, createAgentConfigEntry as r, updateAgentConfigEntry as s, AgentConfigPreconditionError as t };
