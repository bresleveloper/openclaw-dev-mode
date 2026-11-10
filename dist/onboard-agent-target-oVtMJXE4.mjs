import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, S as toAgentEntriesRecord, a as resolveAgentDir, f as resolveAgentWorkspaceDir, x as resolveSoleAgentId, y as resolveMutableAgentEntry } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { l as toAgentModelListLike, n as normalizeAgentModelMapForConfig, o as resolveAgentModelFallbackValues, r as normalizeAgentModelRefForConfig } from "./model-input-CeM8o97s.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import { t as applyPrimaryModel } from "./provider-model-primary-4ptnbByb.mjs";
import { r as ensureWorkspaceAndSessions } from "./onboard-helpers-m0Fx_yHI.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/onboard-agent-target.ts
function splitAgentModelDefaults({ model, utilityModel, models, modelPolicy, ...rest }) {
	return {
		rest,
		modelDefaults: {
			...model !== void 0 ? { model } : {},
			...utilityModel !== void 0 ? { utilityModel } : {},
			...models !== void 0 ? { models } : {},
			...modelPolicy !== void 0 ? { modelPolicy } : {}
		}
	};
}
function resolveOnboardingAgentTarget(config, explicitAgentId) {
	const agentId = normalizeAgentId(explicitAgentId ?? tryResolveLegacyCompatibilityAgentId(config) ?? resolveSoleAgentId(config));
	return {
		agentId,
		agentDir: resolveAgentDir(config, agentId),
		workspaceDir: resolveAgentWorkspaceDir(config, agentId)
	};
}
/** Resolve the configured System Agent as the owner of onboarding effects. */
function resolveSystemAgentOnboardingTarget(config) {
	return resolveOnboardingAgentTarget(config, config.agents?.defaults?.systemAgent?.agentId);
}
/** Resolve onboarding setup to its existing or pending first-agent owner. */
function resolveOnboardingSetupTarget(config, pendingAgent) {
	if (config.agents?.ownership === "explicit") return resolveSystemAgentOnboardingTarget(config);
	if (pendingAgent) return {
		...resolveOnboardingAgentTarget(config, pendingAgent.name),
		workspaceDir: pendingAgent.workspaceDir
	};
	return resolveOnboardingAgentTarget(config);
}
async function ensureOnboardingAgentWorkspace(target, runtime, options) {
	try {
		return await ensureWorkspaceAndSessions(target.workspaceDir, runtime, {
			...options,
			agentId: target.agentId
		});
	} catch (error) {
		throw new Error(`Workspace provisioning for agent "${target.agentId}" at ${shortenHomePath(target.workspaceDir)} failed: ${formatErrorMessage(error)}`, { cause: error });
	}
}
function replaceOnboardingAgentEntry(config, updated, target, nextEntry) {
	const entries = listAgentEntries(config);
	const index = entries.findIndex((entry) => normalizeAgentId(entry.id) === target.agentId);
	const nextEntries = [...entries];
	const replacement = {
		id: index >= 0 ? entries[index].id : target.agentId,
		...nextEntry
	};
	if (index >= 0) nextEntries[index] = replacement;
	else nextEntries.push(replacement);
	return {
		...updated,
		agents: {
			...config.agents,
			entries: toAgentEntriesRecord(nextEntries)
		}
	};
}
function applyOnboardingWorkspace(config, target, workspace) {
	const entry = resolveMutableAgentEntry(config, target.agentId);
	if (entry?.workspace !== void 0 || config.agents?.ownership === "explicit" && entry) return replaceOnboardingAgentEntry(config, config, target, {
		...entry,
		workspace
	});
	return {
		...config,
		agents: {
			...config.agents,
			defaults: {
				...config.agents?.defaults,
				workspace
			}
		}
	};
}
function applyOnboardingPrimaryModel(config, target, model) {
	const entry = resolveMutableAgentEntry(config, target.agentId);
	if (entry?.model === void 0 && config.agents?.ownership !== "explicit") return applyPrimaryModel(config, model);
	const primary = normalizeAgentModelRefForConfig(model);
	const fallbackValues = resolveAgentModelFallbackValues(entry?.model).map((fallback) => normalizeAgentModelRefForConfig(fallback));
	const models = normalizeAgentModelMapForConfig(entry?.models ?? {});
	return replaceOnboardingAgentEntry(config, config, target, {
		...entry,
		model: {
			...fallbackValues.length > 0 ? { fallbacks: fallbackValues } : {},
			primary
		},
		models: {
			...models,
			[primary]: models[primary] ?? {}
		}
	});
}
/** Apply a utility selection to its existing agent/default owner without changing primary. */
function applyOnboardingUtilityModel(config, target, model) {
	const utilityModel = normalizeAgentModelRefForConfig(model);
	const entry = resolveMutableAgentEntry(config, target.agentId);
	if (entry?.utilityModel === void 0 && config.agents?.ownership !== "explicit") return {
		...config,
		agents: {
			...config.agents,
			defaults: {
				...config.agents?.defaults,
				utilityModel
			}
		}
	};
	return replaceOnboardingAgentEntry(config, config, target, {
		...entry,
		utilityModel
	});
}
/** Expose one agent's effective model settings through the defaults-based provider contract. */
function prepareAgentModelDefaults(config, target) {
	const entry = resolveMutableAgentEntry(config, target.agentId);
	return {
		...config,
		agents: {
			...config.agents,
			defaults: {
				...config.agents?.defaults,
				...splitAgentModelDefaults(entry ?? {}).modelDefaults
			}
		}
	};
}
/** Apply a model-default mutation to one agent without flattening it globally. */
function applyAgentModelDefaults(config, target, mutate) {
	return projectAgentModelDefaults(config, target, mutate(prepareAgentModelDefaults(config, target)));
}
/** Move a defaults-based model mutation onto one agent while preserving its other config changes. */
function projectAgentModelDefaults(config, target, updated) {
	const entry = resolveMutableAgentEntry(config, target.agentId);
	if (!entry && config.agents?.ownership !== "explicit") return updated;
	const updatedDefaults = updated.agents?.defaults;
	const originalDefaults = config.agents?.defaults;
	const agentModels = entry?.models !== void 0 ? updatedDefaults?.models : Object.fromEntries(Object.entries(updatedDefaults?.models ?? {}).filter(([modelRef, model]) => !Object.hasOwn(originalDefaults?.models ?? {}, modelRef) || !isDeepStrictEqual(model, originalDefaults?.models?.[modelRef])));
	const hasAgentModel = entry?.model !== void 0 || !isDeepStrictEqual(toAgentModelListLike(updatedDefaults?.model), toAgentModelListLike(originalDefaults?.model));
	const hasAgentModelPolicy = entry?.modelPolicy !== void 0 || !isDeepStrictEqual(updatedDefaults?.modelPolicy, originalDefaults?.modelPolicy);
	const hasAgentUtilityModel = entry?.utilityModel !== void 0 || updatedDefaults?.utilityModel !== originalDefaults?.utilityModel;
	const nextEntry = {
		...splitAgentModelDefaults(entry ?? {}).rest,
		...hasAgentModel && updatedDefaults?.model !== void 0 ? { model: updatedDefaults.model } : {},
		...agentModels && Object.keys(agentModels).length > 0 ? { models: agentModels } : {},
		...hasAgentModelPolicy && updatedDefaults?.modelPolicy !== void 0 ? { modelPolicy: updatedDefaults.modelPolicy } : {},
		...hasAgentUtilityModel && updatedDefaults?.utilityModel !== void 0 ? { utilityModel: updatedDefaults.utilityModel } : {}
	};
	return replaceOnboardingAgentEntry({
		...config,
		agents: {
			...config.agents,
			...originalDefaults || updatedDefaults ? { defaults: {
				...splitAgentModelDefaults(updatedDefaults ?? {}).rest,
				...splitAgentModelDefaults(originalDefaults ?? {}).modelDefaults
			} } : {}
		}
	}, updated, target, nextEntry);
}
//#endregion
export { ensureOnboardingAgentWorkspace as a, resolveOnboardingAgentTarget as c, applyOnboardingWorkspace as i, resolveOnboardingSetupTarget as l, applyOnboardingPrimaryModel as n, prepareAgentModelDefaults as o, applyOnboardingUtilityModel as r, projectAgentModelDefaults as s, applyAgentModelDefaults as t, resolveSystemAgentOnboardingTarget as u };
