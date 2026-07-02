import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-BONnzNfb.js";
import { r as resolveAgentModelFallbackValues } from "./model-input-BHKiDwaq.js";
import { S as resolveSubagentModelFallbacksOverride, h as resolveEffectiveModelFallbacks } from "./agent-scope-CDZXADgT.js";
import { i as isCronSessionKey } from "./session-key-utils-C7uT9A4s.js";
import "./logger-p_Dm5cGu.js";
import "./paths-CHZBIGhF.js";
import "./model-selection-i8V2iTdL.js";
import { i as resolveModelCandidateChain } from "./model-fallback-xjR_RHVQ.js";
import "./lanes-CI0_P-yC.js";
import "./runtime-plugin-D4UDhDQN.js";
import fs from "node:fs";
//#region src/cron/isolated-agent/channel-output-policy.ts
/** Reads channel plugin output/threading policy for isolated cron delivery. */
const channelPluginRuntimeLoader = createLazyImportLoader(() => import("./plugins-C0wG73MZ.js"));
async function loadChannelPluginRuntime() {
	return await channelPluginRuntimeLoader.load();
}
/** Resolves channel-specific cron output preferences from loaded channel plugins. */
async function resolveCronChannelOutputPolicy(channel, opts) {
	const channelId = normalizeOptionalLowercaseString(channel);
	if (!channelId) return { preferFinalAssistantVisibleText: opts?.deliveryRequested !== true };
	const { getChannelPlugin } = await loadChannelPluginRuntime();
	return { preferFinalAssistantVisibleText: getChannelPlugin(channelId)?.outbound?.preferFinalAssistantVisibleText === true };
}
/** Resolves the provider-specific current-thread target for a delivery address. */
async function resolveCurrentChannelTarget(params) {
	if (!params.to) return;
	const channelId = normalizeOptionalLowercaseString(params.channel);
	if (!channelId) return params.to;
	const { getChannelPlugin } = await loadChannelPluginRuntime();
	return getChannelPlugin(channelId)?.threading?.resolveCurrentChannelId?.({
		to: params.to,
		threadId: params.threadId
	}) ?? params.to;
}
//#endregion
//#region src/cron/isolated-agent/run-execution.runtime.ts
const cronExecutionCliRuntimeLoader = createLazyImportLoader(() => import("./run-execution-cli.runtime.js"));
async function loadCronExecutionCliRuntime() {
	return await cronExecutionCliRuntimeLoader.load();
}
/** Lazily resolves CLI session ids without loading the cron CLI runner at module import time. */
async function getCliSessionId(...args) {
	return (await loadCronExecutionCliRuntime()).getCliSessionId(...args);
}
/** Lazily runs the CLI-backed agent path used by isolated cron execution. */
async function runCliAgent(...args) {
	return (await loadCronExecutionCliRuntime()).runCliAgent(...args);
}
//#endregion
//#region src/cron/isolated-agent/run-fallback-policy.ts
/** Resolves model fallback chains for isolated cron runs and preflight. */
/** Resolves cron model fallbacks, giving explicit payload fallbacks precedence over subagent/default policy. */
function resolveCronFallbacksOverride(params) {
	const payload = params.job.payload.kind === "agentTurn" ? params.job.payload : void 0;
	const payloadFallbacks = Array.isArray(payload?.fallbacks) ? payload.fallbacks : void 0;
	const hasCronPayloadModelOverride = typeof payload?.model === "string" && payload.model.trim().length > 0;
	if (payloadFallbacks !== void 0) return payloadFallbacks;
	if (params.useSubagentFallbacks === true && !hasCronPayloadModelOverride) {
		const subagentFallbacksOverride = resolveSubagentModelFallbacksOverride(params.cfg, params.agentId);
		if (subagentFallbacksOverride !== void 0) return subagentFallbacksOverride;
	}
	if (!hasCronPayloadModelOverride && params.inheritDefaultFallbacksForAgentStringModel === true) {
		const defaultFallbacks = resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
		if (defaultFallbacks.length > 0) return defaultFallbacks;
	}
	return resolveEffectiveModelFallbacks({
		cfg: params.cfg,
		agentId: params.agentId,
		hasSessionModelOverride: hasCronPayloadModelOverride,
		modelOverrideSource: hasCronPayloadModelOverride ? "auto" : void 0
	});
}
/** Builds the ordered model candidates used by cron preflight checks. */
function resolveCronPreflightCandidates(params) {
	const fallbacksOverride = resolveCronFallbacksOverride({
		cfg: params.cfg,
		job: params.job,
		agentId: params.agentId,
		useSubagentFallbacks: params.useSubagentFallbacks,
		inheritDefaultFallbacksForAgentStringModel: params.inheritDefaultFallbacksForAgentStringModel
	});
	return resolveModelCandidateChain({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		fallbacksOverride
	});
}
//#endregion
//#region src/cron/isolated-agent/run-session-state.ts
/** Mutates and persists isolated cron session state around one run. */
function cronTranscriptExists(entry) {
	const sessionFile = entry.sessionFile?.trim();
	return Boolean(sessionFile && fs.existsSync(sessionFile));
}
function normalizeSessionField(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : void 0;
}
function toNonResumableCronSessionEntry(entry) {
	const next = { ...entry };
	delete next.sessionId;
	delete next.sessionFile;
	delete next.sessionStartedAt;
	delete next.lastInteractionAt;
	delete next.cliSessionIds;
	delete next.cliSessionBindings;
	delete next.claudeCliSessionId;
	return next;
}
/** Creates the persistence callback that stores cron session metadata after a run. */
function createPersistCronSessionEntry(params) {
	return async () => {
		if (params.isFastTestEnv) return;
		const persistedEntry = isCronSessionKey(params.agentSessionKey) && params.cronSession.sessionEntry.sessionId && !cronTranscriptExists(params.cronSession.sessionEntry) ? toNonResumableCronSessionEntry(params.cronSession.sessionEntry) : params.cronSession.sessionEntry;
		params.cronSession.store[params.agentSessionKey] = persistedEntry;
		await params.updateSessionStore(params.cronSession.storePath, (store) => {
			store[params.agentSessionKey] = persistedEntry;
		});
	};
}
/** Adopts the session id/file produced by a run and preserves usage-family lineage. */
function adoptCronRunSessionMetadata(params) {
	const nextSessionId = normalizeSessionField(params.runMeta?.sessionId);
	const nextSessionFile = normalizeSessionField(params.runMeta?.sessionFile);
	if (!nextSessionFile) return false;
	let changed = false;
	const previousSessionId = params.entry.sessionId;
	if (nextSessionId && nextSessionId !== previousSessionId) {
		params.entry.sessionId = nextSessionId;
		params.entry.usageFamilyKey = params.entry.usageFamilyKey ?? params.sessionKey;
		params.entry.usageFamilySessionIds = Array.from(new Set([
			...params.entry.usageFamilySessionIds ?? [],
			...previousSessionId ? [previousSessionId] : [],
			nextSessionId
		]));
		changed = true;
	}
	if (nextSessionFile !== params.entry.sessionFile) {
		params.entry.sessionFile = nextSessionFile;
		changed = true;
	}
	return changed;
}
/** Persists a changed skills snapshot onto the cron session entry outside fast tests. */
async function persistCronSkillsSnapshotIfChanged(params) {
	if (params.isFastTestEnv || params.skillsSnapshot === params.cronSession.sessionEntry.skillsSnapshot) return;
	params.cronSession.sessionEntry = {
		...params.cronSession.sessionEntry,
		updatedAt: params.nowMs,
		skillsSnapshot: params.skillsSnapshot
	};
	await params.persistSessionEntry();
}
/** Records the selected provider/model before a cron run starts. */
function markCronSessionPreRun(params) {
	params.entry.modelProvider = params.provider;
	params.entry.model = params.model;
	params.entry.systemSent = true;
}
/** Syncs live model/auth-profile changes from a running cron session back to storage. */
function syncCronSessionLiveSelection(params) {
	params.entry.modelProvider = params.liveSelection.provider;
	params.entry.model = params.liveSelection.model;
	if (params.liveSelection.authProfileId) {
		params.entry.authProfileOverride = params.liveSelection.authProfileId;
		params.entry.authProfileOverrideSource = params.liveSelection.authProfileIdSource;
		if (params.liveSelection.authProfileIdSource === "auto") params.entry.authProfileOverrideCompactionCount = params.entry.compactionCount ?? 0;
		else delete params.entry.authProfileOverrideCompactionCount;
		return;
	}
	delete params.entry.authProfileOverride;
	delete params.entry.authProfileOverrideSource;
	delete params.entry.authProfileOverrideCompactionCount;
}
//#endregion
export { syncCronSessionLiveSelection as a, getCliSessionId as c, resolveCurrentChannelTarget as d, persistCronSkillsSnapshotIfChanged as i, runCliAgent as l, createPersistCronSessionEntry as n, resolveCronFallbacksOverride as o, markCronSessionPreRun as r, resolveCronPreflightCandidates as s, adoptCronRunSessionMetadata as t, resolveCronChannelOutputPolicy as u };
