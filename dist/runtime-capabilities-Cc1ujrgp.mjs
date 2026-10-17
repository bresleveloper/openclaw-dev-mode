import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { d as normalizeStringEntries, f as normalizeStringEntriesLower } from "./string-normalization-CECOqf64.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import "./registry-B3Y-vjit.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
import { O as supportsThreadBindingSpawn } from "./session-binding-service-DzGpg6K8.mjs";
import { a as prepareSkillLibrarySelection, n as captureSkillLibrarySelection } from "./selection-Cr4O9thc.mjs";
import { a as resolveChannelPromptCapabilities } from "./channel-tools-BhIPLlm-.mjs";
import { c as resolveThreadBindingSpawnPolicy } from "./thread-bindings-policy-DE7-D4c0.mjs";
import { t as normalizeWorkspaceSkillRoots } from "./workspace-skill-roots-CL28VeX5.mjs";
import { i as getSkillsSourceVersion } from "./refresh-state-CRa-OKC_.mjs";
import { i as prepareWorkspaceSkills } from "./workspace-skill-loader-CWlRhYtz.mjs";
import { t as resolveSkillRuntimeConfig } from "./runtime-config-O9JalVnY.mjs";
import { r as resolveSkillSnapshotExecutionFileHost } from "./skill-snapshot-provenance-B47tYPIJ.mjs";
//#region src/skills/runtime/embedded-run-entries.ts
/** Resolves skill entries embedded into a run payload into runtime-visible entries. */
async function resolveEmbeddedRunSkillEntries(params) {
	const shouldLoadSkillEntries = !params.skillsSnapshot || Boolean(params.skillsSnapshot.prompt.trim()) && !params.skillsSnapshot.resolvedSkills;
	const config = resolveSkillRuntimeConfig(params.config);
	const persistedRoots = params.skillsSnapshot?.promptFormatVersion === 8 ? params.skillsSnapshot.skillRoots : void 0;
	const skillRoots = normalizeWorkspaceSkillRoots(params.workspaceOnly === true ? { agentWorkspaceDir: params.workspaceDir } : {
		agentWorkspaceDir: persistedRoots?.agentWorkspaceDir ?? params.workspaceDir,
		executionWorkspaceDir: persistedRoots?.executionWorkspaceDir ?? params.executionWorkspaceDir,
		executionWorkspaceFileHost: params.executionWorkspaceFileHost ?? resolveSkillSnapshotExecutionFileHost(params.skillsSnapshot)
	});
	let cachedSkillEntries;
	const loadSkillEntries = async () => {
		if (cachedSkillEntries) return cachedSkillEntries;
		params.assertCurrent?.();
		const librarySelections = captureSkillLibrarySelection(params.workspaceOnly === true ? [] : params.skillsSnapshot?.librarySelections ?? []);
		const libraryContext = librarySelections.length ? captureOpenClawStateWorkerContext() : void 0;
		const assertPreparedEntriesCurrent = () => {
			params.assertCurrent?.();
			libraryContext?.maintenanceScope?.assertAdmission();
			libraryContext?.admission.assertCurrent();
		};
		const options = {
			config,
			agentId: params.agentId,
			executionWorkspaceDir: skillRoots.executionWorkspaceDir,
			executionWorkspaceFileHost: skillRoots.executionWorkspaceFileHost,
			...params.eligibility ? { eligibility: params.eligibility } : {},
			...params.skillsSnapshot?.skillFilter ? { skillFilter: params.skillsSnapshot.skillFilter } : {},
			...params.skillsSnapshot?.skillOverrides ? { skillOverrides: params.skillsSnapshot.skillOverrides } : {},
			...params.workspaceOnly === true ? { workspaceOnly: true } : {}
		};
		for (;;) {
			assertPreparedEntriesCurrent();
			const sourceVersion = getSkillsSourceVersion(skillRoots.agentWorkspaceDir, options);
			const workspaceEntries = await prepareWorkspaceSkills(skillRoots.agentWorkspaceDir, options, params.assertCurrent);
			assertPreparedEntriesCurrent();
			const libraryEntries = libraryContext ? await prepareSkillLibrarySelection(librarySelections, { env: libraryContext.environment }, assertPreparedEntriesCurrent) : void 0;
			assertPreparedEntriesCurrent();
			if (cachedSkillEntries) return cachedSkillEntries;
			if (getSkillsSourceVersion(skillRoots.agentWorkspaceDir, options) !== sourceVersion) continue;
			cachedSkillEntries = libraryEntries ? [...workspaceEntries, ...libraryEntries] : workspaceEntries;
			return cachedSkillEntries;
		}
	};
	return {
		shouldLoadSkillEntries,
		skillEntries: shouldLoadSkillEntries ? await loadSkillEntries() : [],
		loadSkillEntries,
		preserveEntryOrder: skillRoots.executionWorkspaceDir !== void 0
	};
}
//#endregion
//#region src/config/channel-capabilities.ts
const isStringArray = (value) => Array.isArray(value) && value.every((entry) => typeof entry === "string");
function normalizeCapabilities(capabilities) {
	if (!isStringArray(capabilities)) return;
	const normalized = normalizeStringEntries(capabilities);
	return normalized.length > 0 ? normalized : void 0;
}
/** Resolves normalized string capabilities for a channel/account config pair. */
function resolveChannelCapabilities(params) {
	const cfg = params.cfg;
	const channel = normalizeAnyChannelId(params.channel);
	if (!cfg || !channel) return;
	const channelConfig = cfg.channels?.[channel];
	if (!channelConfig) return;
	const normalizedAccountId = normalizeAccountId(params.accountId);
	const accounts = channelConfig.accounts;
	return normalizeCapabilities((accounts && typeof accounts === "object" ? resolveChannelAccountEntry(accounts, normalizedAccountId, channel) : void 0)?.capabilities) ?? normalizeCapabilities(channelConfig.capabilities);
}
//#endregion
//#region src/agents/runtime-capabilities.ts
/**
* Runtime channel capability collector.
*
* Agent startup uses this to merge configured channel capabilities with prompt
* tools and thread-bound spawn features that depend on channel policy.
*/
const THREAD_BOUND_SUBAGENT_SPAWN_CAPABILITY = "threadbound-subagent-spawn";
const THREAD_BOUND_ACP_SPAWN_CAPABILITY = "threadbound-acp-spawn";
function mergeRuntimeCapabilities(base, additions = []) {
	const merged = [...base ?? []];
	const seen = new Set(normalizeStringEntriesLower(merged));
	for (const capability of additions) {
		const normalizedCapability = normalizeOptionalLowercaseString(capability);
		if (!normalizedCapability || seen.has(normalizedCapability)) continue;
		seen.add(normalizedCapability);
		merged.push(capability);
	}
	return merged.length > 0 ? merged : void 0;
}
/** Collects the effective runtime capabilities for a channel/account pair. */
function collectRuntimeChannelCapabilities(params) {
	if (!params.channel) return;
	const internalChannelCapabilities = params.channel === "webchat" ? ["markdownDetails"] : [];
	const threadSpawnCapabilities = [];
	if (params.cfg && supportsThreadBindingSpawn(params.channel)) for (const [kind, capability] of [["subagent", THREAD_BOUND_SUBAGENT_SPAWN_CAPABILITY], ["acp", THREAD_BOUND_ACP_SPAWN_CAPABILITY]]) {
		const policy = resolveThreadBindingSpawnPolicy({
			cfg: params.cfg,
			channel: params.channel,
			accountId: params.accountId ?? void 0,
			kind
		});
		if (policy.enabled && policy.spawnEnabled) threadSpawnCapabilities.push(capability);
	}
	const channelPromptCapabilities = params.cfg ? resolveChannelPromptCapabilities(params) : [];
	return mergeRuntimeCapabilities(resolveChannelCapabilities(params), [
		...channelPromptCapabilities,
		...internalChannelCapabilities,
		...threadSpawnCapabilities
	]);
}
//#endregion
export { resolveEmbeddedRunSkillEntries as n, collectRuntimeChannelCapabilities as t };
