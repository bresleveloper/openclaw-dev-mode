import { c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../../string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "../../string-normalization-_gRhJUDw.mjs";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-BPNHa36e.mjs";
import { n as normalizeAgentId } from "../../agent-id-GA8mwdTG.mjs";
import { O as listAgentIds } from "../../agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "../../errors-DnjwnOju.mjs";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-BTKQYTUd.mjs";
import { v as resolveSessionAgentIdStrict } from "../../agent-scope-CTuYDtny.mjs";
import { v as parseNonNegativeByteSize } from "../../zod-schema-B-u3AXjg.mjs";
import { t as ErrorCodes } from "../../gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "../../error-codes-DvB36bCj.mjs";
import { C as resolveMemoryDreamingPluginConfig, E as resolveMemoryDreamingWorkspaces, O as resolveMemoryRemDreamingConfig, _ as MANAGED_MEMORY_DREAMING_CRON_TAG, g as MANAGED_MEMORY_DREAMING_CRON_NAME, v as MEMORY_DREAMING_SYSTEM_EVENT_TEXT, x as resolveMemoryDeepDreamingConfig } from "../../dreaming-Rnb_FGdU.mjs";
import { l as peekSystemEventEntriesFromSdk } from "../../system-events-DevGIiH8.mjs";
import { n as resolveCronStyleNow } from "../../current-time-ojiw0e0p.mjs";
import { t as resolveEffectiveCompactionReserveTokens } from "../../agent-compaction-constants-DmXQuPyL.mjs";
import { t as DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR } from "../../openclaw-runtime-agent-C9en88xH.mjs";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.mjs";
import { d as readPositiveIntegerParam, h as readToolStringParam } from "../../common-XfKigJno.mjs";
import { t as resolveMemoryBackendConfig } from "../../backend-config-D3tXhXDP.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../routing-JKvWkBDR.mjs";
import "../../agent-scope-runtime-OY7yRyJL.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-CaI6yWBc.mjs";
import "../../system-event-runtime-BeN9tHJs.mjs";
import "../../gateway-runtime-BCC8MoQW.mjs";
import "../../channel-actions-BjxmEiuN.mjs";
import "../../memory-core-host-status-CWOM9o6Y.mjs";
import "../../memory-core-host-runtime-core-gHJe4_81.mjs";
import "../../memory-core-host-runtime-files-u1TC5L8O.mjs";
import { p as configureMemoryCoreDreamingState } from "../../dreaming-state-DJfKblhZ.mjs";
import { n as includesSystemEventToken, t as formatRecallRepairDetails } from "../../dreaming-shared-CofeOWBR.mjs";
import { t as resolveMemoryCoreNowMs } from "../../time-BhFVUM0b.mjs";
import { t as appendFailedDreamingEvent } from "../../dreaming-events-BzCNFdHR.mjs";
import { r as resolveMemoryPromotionFileMaxChars } from "../../memory-budget-BD5Ujhwr.mjs";
import "../../background-context-tbmmWTrm.mjs";
import { i as resolveMemoryToolContext, n as MEMORY_SEARCH_TOOL_CONTRACT, r as buildMemoryPromptSection, t as MEMORY_GET_TOOL_CONTRACT } from "../../memory-tool-contract-6TdJ3y2j.mjs";
import { r as prepareMemoryManagerReload } from "../../lifecycle-CtUK0V21.mjs";
import { t as normalizeSessionBackfillSelection } from "../../session-backfill-selection-CjIn4YJO.mjs";
//#region extensions/memory-core/src/dreaming-cron.ts
/** Stateless convergence of the memory-core-owned dreaming cron job family. */
const MANAGED_DREAMING_DECLARATION_KEY = "memory-core:memory-dreaming-promotion";
function resolveManagedCronDescription(config) {
	const recencyHalfLifeDays = config.recencyHalfLifeDays;
	return `${MANAGED_MEMORY_DREAMING_CRON_TAG} Promote weighted short-term recalls into MEMORY.md (limit=${config.limit}, minScore=${config.minScore.toFixed(3)}, minRecallCount=${config.minRecallCount}, minUniqueQueries=${config.minUniqueQueries}, recencyHalfLifeDays=${recencyHalfLifeDays}, maxAgeDays=${config.maxAgeDays ?? "none"}).`;
}
function buildManagedDreamingCronJob(config) {
	return {
		declarationKey: MANAGED_DREAMING_DECLARATION_KEY,
		name: MANAGED_MEMORY_DREAMING_CRON_NAME,
		description: resolveManagedCronDescription(config),
		enabled: true,
		schedule: {
			kind: "cron",
			expr: config.cron,
			...config.timezone ? { tz: config.timezone } : {}
		},
		sessionTarget: "isolated",
		wakeMode: "now",
		payload: {
			kind: "agentTurn",
			message: MEMORY_DREAMING_SYSTEM_EVENT_TEXT,
			lightContext: true
		},
		delivery: { mode: "none" }
	};
}
function resolveManagedDreamingPayloadToken(payload) {
	const payloadKind = normalizeLowercaseStringOrEmpty(normalizeOptionalString(payload?.kind));
	if (payloadKind === "systemevent") return normalizeOptionalString(payload?.text);
	if (payloadKind === "agentturn") return normalizeOptionalString(payload?.message);
}
function isManagedDreamingJob(job) {
	if (normalizeOptionalString(job.declarationKey) === MANAGED_DREAMING_DECLARATION_KEY) return true;
	if (normalizeOptionalString(job.name) !== "Memory Dreaming Promotion") return false;
	if (normalizeOptionalString(job.description)?.includes("[managed-by=memory-core.short-term-promotion]")) return true;
	return resolveManagedDreamingPayloadToken(job.payload) === MEMORY_DREAMING_SYSTEM_EVENT_TEXT;
}
function isLegacyPhaseDreamingJob(job) {
	const description = normalizeOptionalString(job.description);
	if (description?.includes("[managed-by=memory-core.dreaming.light]") || description?.includes("[managed-by=memory-core.dreaming.rem]")) return true;
	const name = normalizeOptionalString(job.name);
	const payloadText = normalizeOptionalString(job.payload?.text);
	if (name === "Memory Light Dreaming" && payloadText === "__openclaw_memory_core_light_sleep__") return true;
	return name === "Memory REM Dreaming" && payloadText === "__openclaw_memory_core_rem_sleep__";
}
async function removeStaleManagedDreamingRows(cron) {
	return await cron.removeStaleJobFamily({
		declarationKey: MANAGED_DREAMING_DECLARATION_KEY,
		name: "Memory Dreaming Promotion",
		ownerPluginTag: "[managed-by=memory-core.short-term-promotion]"
	}) ?? 0;
}
async function migrateLegacyPhaseDreamingCronJobs(params) {
	let migrated = 0;
	for (const job of params.legacyJobs) try {
		if ((await params.cron.remove(job.id)).removed === true) migrated += 1;
	} catch (err) {
		params.logger.warn(`memory-core: failed to migrate legacy phase dreaming cron job ${job.id}: ${formatErrorMessage(err)}`);
	}
	if (migrated > 0) {
		if (params.mode === "enabled") params.logger.info(`memory-core: migrated ${migrated} legacy phase dreaming cron job(s) to the unified dreaming controller.`);
		else params.logger.info(`memory-core: completed legacy phase dreaming cron migration while unified dreaming is disabled (${migrated} job(s) removed).`);
	}
	return migrated;
}
function buildManagedDreamingPatch(job, desired) {
	const patch = {};
	if (normalizeOptionalString(job.name) !== desired.name) patch.name = desired.name;
	if (normalizeOptionalString(job.description) !== desired.description) patch.description = desired.description;
	if (job.enabled !== true) patch.enabled = true;
	const scheduleKind = normalizeLowercaseStringOrEmpty(normalizeOptionalString(job.schedule?.kind));
	const scheduleExpr = normalizeOptionalString(job.schedule?.expr);
	const scheduleTz = normalizeOptionalString(job.schedule?.tz);
	if (scheduleKind !== "cron" || scheduleExpr !== desired.schedule.expr || scheduleTz !== desired.schedule.tz) patch.schedule = desired.schedule;
	if (normalizeLowercaseStringOrEmpty(normalizeOptionalString(job.sessionTarget)) !== desired.sessionTarget) patch.sessionTarget = desired.sessionTarget;
	if (normalizeLowercaseStringOrEmpty(normalizeOptionalString(job.wakeMode)) !== "now") patch.wakeMode = "now";
	const payloadKind = normalizeLowercaseStringOrEmpty(normalizeOptionalString(job.payload?.kind));
	const payloadToken = resolveManagedDreamingPayloadToken(job.payload);
	const desiredPayloadToken = desired.payload.kind === "systemEvent" ? desired.payload.text : desired.payload.message;
	if (payloadKind !== normalizeLowercaseStringOrEmpty(desired.payload.kind) || payloadToken !== desiredPayloadToken || desired.payload.kind === "agentTurn" && job.payload?.lightContext !== desired.payload.lightContext) patch.payload = desired.payload;
	if (normalizeLowercaseStringOrEmpty(normalizeOptionalString(job.delivery?.mode)) !== "none") patch.delivery = desired.delivery;
	return Object.keys(patch).length > 0 ? patch : null;
}
function sortManagedJobs(managed) {
	return managed.toSorted((a, b) => {
		const aCreated = typeof a.createdAtMs === "number" && Number.isFinite(a.createdAtMs) ? a.createdAtMs : Number.MAX_SAFE_INTEGER;
		const bCreated = typeof b.createdAtMs === "number" && Number.isFinite(b.createdAtMs) ? b.createdAtMs : Number.MAX_SAFE_INTEGER;
		if (aCreated !== bCreated) return aCreated - bCreated;
		return a.id.localeCompare(b.id);
	});
}
function isCronServiceLike(candidate) {
	return isRecord(candidate) && (candidate.isEnabled === void 0 || typeof candidate.isEnabled === "function") && typeof candidate.list === "function" && typeof candidate.add === "function" && typeof candidate.update === "function" && typeof candidate.remove === "function" && typeof candidate.removeStaleJobFamily === "function";
}
function resolveCronServiceFromGatewayContext(context) {
	const cron = context.getCron?.();
	return isCronServiceLike(cron) ? cron : null;
}
async function reconcileShortTermDreamingCronJob(params) {
	const cron = params.cron;
	if (!cron) return {
		status: "unavailable",
		removed: 0
	};
	const allJobs = await cron.list({ includeDisabled: true });
	const managed = allJobs.filter(isManagedDreamingJob);
	const legacyPhaseJobs = allJobs.filter(isLegacyPhaseDreamingJob);
	if (!params.config.enabled) {
		let removed = await migrateLegacyPhaseDreamingCronJobs({
			cron,
			legacyJobs: legacyPhaseJobs,
			logger: params.logger,
			mode: "disabled"
		});
		for (const job of managed) try {
			if ((await cron.remove(job.id)).removed === true) removed += 1;
		} catch (err) {
			params.logger.warn(`memory-core: failed to remove managed dreaming cron job ${job.id}: ${formatErrorMessage(err)}`);
		}
		removed += await removeStaleManagedDreamingRows(cron);
		if (removed > 0) params.logger.info(`memory-core: removed ${removed} managed dreaming cron job(s).`);
		return {
			status: "disabled",
			removed
		};
	}
	const desired = buildManagedDreamingCronJob(params.config);
	const primary = managed.find((job) => job.declarationKey === MANAGED_DREAMING_DECLARATION_KEY);
	if (!primary) {
		await cron.add(desired);
		let removed = await migrateLegacyPhaseDreamingCronJobs({
			cron,
			legacyJobs: legacyPhaseJobs,
			logger: params.logger,
			mode: "enabled"
		});
		for (const job of managed) {
			if ((await cron.remove(job.id)).removed !== true) throw new Error(`failed to replace legacy managed dreaming cron job ${job.id}`);
			removed += 1;
		}
		removed += await removeStaleManagedDreamingRows(cron);
		params.logger.info(managed.length === 0 ? "memory-core: created managed dreaming cron job." : "memory-core: replaced legacy managed dreaming cron job identity.");
		return {
			status: "added",
			removed
		};
	}
	const duplicates = sortManagedJobs(managed.filter((job) => job.id !== primary.id));
	let removed = await migrateLegacyPhaseDreamingCronJobs({
		cron,
		legacyJobs: legacyPhaseJobs,
		logger: params.logger,
		mode: "enabled"
	});
	for (const duplicate of duplicates) try {
		if ((await cron.remove(duplicate.id)).removed === true) removed += 1;
	} catch (err) {
		params.logger.warn(`memory-core: failed to prune duplicate managed dreaming cron job ${duplicate.id}: ${formatErrorMessage(err)}`);
	}
	removed += await removeStaleManagedDreamingRows(cron);
	const patch = buildManagedDreamingPatch(primary, desired);
	if (!patch) {
		if (removed > 0) params.logger.info("memory-core: pruned duplicate managed dreaming cron jobs.");
		return {
			status: "noop",
			removed
		};
	}
	await cron.update(primary.id, patch);
	params.logger.info("memory-core: updated managed dreaming cron job.");
	return {
		status: "updated",
		removed
	};
}
//#endregion
//#region extensions/memory-core/src/dreaming.ts
const RUNTIME_CRON_RECONCILE_INTERVAL_MS = 6e4;
const HEARTBEAT_ISOLATED_SESSION_SUFFIX = ":heartbeat";
function formatRepairSummary(repair) {
	const actions = [];
	if (repair.rewroteStore) {
		const details = formatRecallRepairDetails(repair);
		actions.push(`rewrote recall store${details ? ` (${details})` : ""}`);
	}
	if (repair.removedStaleLock) actions.push("removed stale promotion lock");
	return actions.join(", ");
}
function resolveDreamingTriggerSessionKeys(sessionKey) {
	const normalized = normalizeOptionalString(sessionKey);
	if (!normalized) return [];
	const keys = [normalized];
	if (normalized.endsWith(HEARTBEAT_ISOLATED_SESSION_SUFFIX)) {
		const baseSessionKey = normalized.slice(0, -10).trim();
		if (baseSessionKey) keys.push(baseSessionKey);
	}
	return uniqueStrings(keys);
}
function hasPendingManagedDreamingCronEvent(sessionKey, agentId) {
	return resolveDreamingTriggerSessionKeys(sessionKey).some((candidateSessionKey) => peekSystemEventEntriesFromSdk(candidateSessionKey, agentId).some((event) => event.contextKey?.startsWith("cron:") === true && normalizeOptionalString(event.text) === "__openclaw_memory_core_short_term_promotion_dream__"));
}
async function runShortTermDreamingPromotionIfTriggered(params) {
	if (params.trigger !== "heartbeat" && params.trigger !== "cron") return;
	if (!includesSystemEventToken(params.cleanedBody, "__openclaw_memory_core_short_term_promotion_dream__")) return;
	if (!params.config.enabled) return {
		handled: true,
		reason: "memory-core: short-term dreaming disabled"
	};
	const recencyHalfLifeDays = params.config.recencyHalfLifeDays;
	const fallbackWorkspaceDir = normalizeOptionalString(params.workspaceDir);
	const triggerAgentId = normalizeLowercaseStringOrEmpty(params.agentId);
	const seenWorkspaces = /* @__PURE__ */ new Set();
	const workspaces = [];
	const addWorkspace = (workspaceDir, agentId, agentIds = [agentId]) => {
		if (!workspaceDir || seenWorkspaces.has(workspaceDir)) return;
		seenWorkspaces.add(workspaceDir);
		workspaces.push({
			...agentId ? { agentId } : {},
			agentIds,
			workspaceDir
		});
	};
	const resolveWorkspaceOwnerAgentId = (agentIds) => {
		if (triggerAgentId && agentIds.includes(triggerAgentId)) return triggerAgentId;
		return agentIds.toSorted()[0] ?? triggerAgentId;
	};
	if (params.cfg) for (const entry of resolveMemoryDreamingWorkspaces(params.cfg, {
		primaryWorkspaceDir: fallbackWorkspaceDir,
		...triggerAgentId ? { primaryAgentId: triggerAgentId } : {}
	})) addWorkspace(entry.workspaceDir, resolveWorkspaceOwnerAgentId(entry.agentIds), entry.agentIds);
	if (workspaces.length === 0 && fallbackWorkspaceDir) addWorkspace(fallbackWorkspaceDir, triggerAgentId);
	if (workspaces.length === 0) {
		params.logger.warn("memory-core: dreaming promotion skipped because no memory workspace is available.");
		return {
			handled: true,
			reason: "memory-core: short-term dreaming missing workspace"
		};
	}
	if (params.config.limit === 0) {
		params.logger.info("memory-core: dreaming promotion skipped because limit=0.");
		return {
			handled: true,
			reason: "memory-core: short-term dreaming disabled by limit"
		};
	}
	if (params.config.verboseLogging) params.logger.info(`memory-core: dreaming verbose enabled (cron=${params.config.cron}, limit=${params.config.limit}, minScore=${params.config.minScore.toFixed(3)}, minRecallCount=${params.config.minRecallCount}, minUniqueQueries=${params.config.minUniqueQueries}, recencyHalfLifeDays=${recencyHalfLifeDays}, maxAgeDays=${params.config.maxAgeDays ?? "none"}, workspaces=${workspaces.length}).`);
	let totalCandidates = 0;
	let totalApplied = 0;
	let failedWorkspaces = 0;
	let degradedNarratives = 0;
	let pendingNarratives = 0;
	const pluginConfig = params.cfg ? resolveMemoryDreamingPluginConfig(params.cfg) : void 0;
	const detachNarratives = params.trigger === "cron";
	const [{ writeDeepDreamingReport }, { appendFallbackNarrativeEntry, runDreamNarrative }, { runDreamingSweepPhases }, { applyShortTermPromotions, repairShortTermPromotionArtifacts, rankShortTermPromotionCandidates }] = await Promise.all([
		import("../../dreaming-markdown-6vlMsWHM.mjs"),
		import("../../dreaming-narrative-B0v5K0Tx.mjs"),
		import("../../dreaming-phases-9t0JaSng.mjs"),
		import("../../short-term-promotion-6_TYe__0.mjs")
	]);
	for (const { agentId, agentIds, workspaceDir } of workspaces) {
		const sweepNowMs = Date.now();
		try {
			const phaseResult = await runDreamingSweepPhases({
				agentId,
				workspaceDir,
				pluginConfig,
				cfg: params.cfg,
				logger: params.logger,
				subagent: params.subagent,
				detachNarratives,
				nowMs: sweepNowMs
			});
			degradedNarratives += phaseResult?.degradedPhases ?? 0;
			pendingNarratives += phaseResult?.pendingNarratives ?? 0;
		} catch (err) {
			failedWorkspaces += 1;
			params.logger.error(`memory-core: dreaming sweep failed for workspace ${workspaceDir}: ${formatErrorMessage(err)}`);
			continue;
		}
		try {
			const reportLines = [];
			const repair = await repairShortTermPromotionArtifacts({ workspaceDir });
			if (repair.changed) {
				params.logger.info(`memory-core: normalized recall artifacts before dreaming (${formatRepairSummary(repair)}) [workspace=${workspaceDir}].`);
				reportLines.push(`- Repaired recall artifacts: ${formatRepairSummary(repair)}.`);
			}
			const candidates = await rankShortTermPromotionCandidates({
				workspaceDir,
				limit: params.config.limit,
				minScore: params.config.minScore,
				minRecallCount: params.config.minRecallCount,
				minUniqueQueries: params.config.minUniqueQueries,
				recencyHalfLifeDays,
				maxAgeDays: params.config.maxAgeDays,
				nowMs: sweepNowMs
			});
			totalCandidates += candidates.length;
			reportLines.push(`- Ranked ${candidates.length} candidate(s) for durable promotion.`);
			if (params.config.verboseLogging) {
				const candidateSummary = candidates.length > 0 ? candidates.map((candidate) => `${candidate.path}:${candidate.startLine}-${candidate.endLine} score=${candidate.score.toFixed(3)} signals=${candidate.signalCount} recalls=${candidate.recallCount} queries=${candidate.uniqueQueries} components={freq=${candidate.components.frequency.toFixed(3)},rel=${candidate.components.relevance.toFixed(3)},div=${candidate.components.diversity.toFixed(3)},rec=${candidate.components.recency.toFixed(3)},cons=${candidate.components.consolidation.toFixed(3)},concept=${candidate.components.conceptual.toFixed(3)}}`).join(" | ") : "none";
				params.logger.info(`memory-core: dreaming candidate details [workspace=${workspaceDir}] ${candidateSummary}`);
			}
			const applied = await applyShortTermPromotions({
				agentId,
				workspaceAgentIds: agentIds,
				workspaceDir,
				candidates,
				limit: params.config.limit,
				minScore: params.config.minScore,
				minRecallCount: params.config.minRecallCount,
				minUniqueQueries: params.config.minUniqueQueries,
				maxAgeDays: params.config.maxAgeDays,
				maxPromotedSnippetTokens: params.config.maxPromotedSnippetTokens,
				maxPriorEntryLossFraction: params.config.maxPriorEntryLossFraction,
				memoryFileMaxChars: resolveMemoryPromotionFileMaxChars({
					cfg: params.cfg,
					agentIds
				}),
				consolidation: {
					...params.subagent ? { subagent: params.subagent } : {},
					...params.config.execution?.model ? { model: params.config.execution.model } : {},
					logger: params.logger
				},
				timezone: params.config.timezone,
				nowMs: sweepNowMs
			});
			totalApplied += applied.applied;
			reportLines.push(`- Promoted ${applied.applied} candidate(s) into MEMORY.md.`);
			if (applied.rejectedCandidates.length > 0) {
				const rejectionCounts = /* @__PURE__ */ new Map();
				for (const { category } of applied.rejectedCandidates) rejectionCounts.set(category, (rejectionCounts.get(category) ?? 0) + 1);
				const summary = [...rejectionCounts].toSorted(([left], [right]) => left.localeCompare(right)).map(([category, count]) => `${category}: ${count}`).join(", ");
				reportLines.push(`- Not promoted: ${applied.rejectedCandidates.length} candidate(s) (${summary}).`);
			}
			if (params.config.verboseLogging) {
				const appliedSummary = applied.appliedCandidates.length > 0 ? applied.appliedCandidates.map((candidate) => `${candidate.path}:${candidate.startLine}-${candidate.endLine} score=${candidate.score.toFixed(3)} signals=${candidate.signalCount} recalls=${candidate.recallCount}`).join(" | ") : "none";
				params.logger.info(`memory-core: dreaming applied details [workspace=${workspaceDir}] ${appliedSummary}`);
			}
			const hasReportableRejections = applied.rejectedCandidates.some(({ category }) => category !== "memory budget");
			await writeDeepDreamingReport({
				workspaceDir,
				bodyLines: reportLines,
				hasContent: repair.changed || applied.applied > 0 || hasReportableRejections,
				nowMs: sweepNowMs,
				timezone: params.config.timezone,
				storage: params.config.storage ?? {
					mode: "separate",
					separateReports: false
				}
			});
			if (applied.applied > 0) {
				const data = {
					phase: "deep",
					snippets: applied.appliedCandidates.map((c) => c.snippet).filter(Boolean),
					promotions: applied.appliedCandidates.map((c) => c.snippet).filter(Boolean),
					sourceEntryKeys: [...new Set(applied.appliedCandidates.map((c) => c.key))]
				};
				if (!params.subagent) await appendFallbackNarrativeEntry({
					workspaceDir,
					data,
					nowMs: sweepNowMs,
					timezone: params.config.timezone,
					logger: params.logger,
					reason: "subagent runtime is unavailable"
				});
				else {
					const narrativeOutcome = await runDreamNarrative({
						agentId,
						subagent: params.subagent,
						workspaceDir,
						data,
						nowMs: sweepNowMs,
						timezone: params.config.timezone,
						model: params.config.execution?.model,
						logger: params.logger,
						detached: detachNarratives
					});
					if (narrativeOutcome.status === "degraded") degradedNarratives += 1;
					else if (narrativeOutcome.status === "pending") pendingNarratives += 1;
				}
			}
		} catch (err) {
			failedWorkspaces += 1;
			const error = formatErrorMessage(err);
			params.logger.error(`memory-core: dreaming promotion failed for workspace ${workspaceDir}: ${error}`);
			await appendFailedDreamingEvent({
				workspaceDir,
				phase: "deep",
				error,
				storageMode: params.config.storage?.mode ?? "separate",
				nowMs: sweepNowMs,
				logger: params.logger
			});
		}
	}
	const summary = `memory-core: dreaming promotion complete (workspaces=${workspaces.length}, candidates=${totalCandidates}, applied=${totalApplied}, failed=${failedWorkspaces}, degraded=${degradedNarratives}, narrativesPending=${pendingNarratives}).`;
	if (failedWorkspaces === workspaces.length || degradedNarratives > 0) params.logger.warn(summary);
	else params.logger.info(summary);
	return {
		handled: true,
		reason: degradedNarratives > 0 ? "memory-core: short-term dreaming degraded" : "memory-core: short-term dreaming processed"
	};
}
function registerShortTermPromotionDreaming(api) {
	let resolveServiceCron = null;
	let unavailableCronWarningEmitted = false;
	let startupDreamingCleanupTimer = null;
	const dreamingTasks = /* @__PURE__ */ new Set();
	let runtimeCronReconcileTimer = null;
	let gatewayLifecycleGeneration = 0;
	let disposed = true;
	let serviceStartedAtMs;
	const resolveCurrentConfig = () => api.runtime.config?.current?.() ?? api.config;
	const disposeDreaming = () => {
		disposed = true;
		gatewayLifecycleGeneration += 1;
		if (startupDreamingCleanupTimer) {
			clearTimeout(startupDreamingCleanupTimer);
			startupDreamingCleanupTimer = null;
		}
		if (runtimeCronReconcileTimer) {
			clearInterval(runtimeCronReconcileTimer);
			runtimeCronReconcileTimer = null;
		}
		resolveServiceCron = null;
	};
	const reconcileManagedDreamingCron = async (params) => {
		const startupCfg = params.reason === "startup" ? params.startupConfig ?? api.config : resolveCurrentConfig();
		const pluginConfig = params.reason === "startup" ? resolveMemoryDreamingPluginConfig(startupCfg) ?? resolveMemoryDreamingPluginConfig(api.config) ?? api.pluginConfig : resolveMemoryDreamingPluginConfig(startupCfg);
		const config = resolveMemoryDeepDreamingConfig({
			pluginConfig,
			cfg: startupCfg
		});
		const cron = resolveServiceCron?.() ?? null;
		if (config.enabled && cron?.isEnabled && !await cron.isEnabled()) return;
		if (!cron && config.enabled && !unavailableCronWarningEmitted) {
			if (params.reason === "startup") api.logger.debug?.("memory-core: cron service not yet available at service start; deferring to runtime reconciliation.");
			else {
				api.logger.warn("memory-core: managed dreaming cron could not be reconciled (cron service unavailable).");
				unavailableCronWarningEmitted = true;
			}
		}
		if (cron) unavailableCronWarningEmitted = false;
		await reconcileShortTermDreamingCronJob({
			cron,
			config,
			logger: api.logger
		});
	};
	const startRuntimeCronReconcileTimer = () => {
		if (disposed || runtimeCronReconcileTimer) return;
		runtimeCronReconcileTimer = setInterval(() => {
			trackDreamingTask(reconcileManagedDreamingCron({ reason: "runtime" })).catch((err) => {
				api.logger.error(`memory-core: dreaming cron reconcile failed: ${formatErrorMessage(err)}`);
			});
		}, RUNTIME_CRON_RECONCILE_INTERVAL_MS);
		runtimeCronReconcileTimer.unref?.();
	};
	const trackDreamingTask = (task) => {
		dreamingTasks.add(task);
		task.then(() => dreamingTasks.delete(task), () => dreamingTasks.delete(task));
		return task;
	};
	const startDreamingSessionCleanup = async (config, generation, startupStartedAtMs) => {
		const { DREAMING_ORPHAN_MIN_AGE_MS, scrubDreamingNarrativeArtifacts } = await import("../../dreaming-session-cleanup-Ui8XheL9.mjs");
		if (disposed || generation !== gatewayLifecycleGeneration) return;
		const scrubConfiguredAgents = async (currentConfig, nowMs) => {
			const agentIds = uniqueStrings(resolveMemoryDreamingWorkspaces(currentConfig).flatMap(({ agentIds: workspaceAgentIds }) => workspaceAgentIds));
			for (const agentId of agentIds) {
				if (disposed || generation !== gatewayLifecycleGeneration) return;
				try {
					await scrubDreamingNarrativeArtifacts({
						agentId,
						config: currentConfig,
						logger: api.logger,
						...nowMs === void 0 ? {} : { nowMs }
					});
				} catch (error) {
					api.logger.warn(`memory-core: dreaming startup cleanup failed for agent ${agentId}: ${formatErrorMessage(error)}`);
				}
			}
		};
		await scrubConfiguredAgents(config, startupStartedAtMs);
		if (disposed || generation !== gatewayLifecycleGeneration) return;
		const cleanupTimer = setTimeout(() => {
			if (disposed || generation !== gatewayLifecycleGeneration || startupDreamingCleanupTimer !== cleanupTimer) return;
			startupDreamingCleanupTimer = null;
			trackDreamingTask(scrubConfiguredAgents(resolveCurrentConfig(), startupStartedAtMs + DREAMING_ORPHAN_MIN_AGE_MS - 1).catch((error) => {
				api.logger.warn(`memory-core: deferred dreaming startup cleanup failed: ${formatErrorMessage(error)}`);
			}));
		}, DREAMING_ORPHAN_MIN_AGE_MS);
		startupDreamingCleanupTimer = cleanupTimer;
		startupDreamingCleanupTimer.unref?.();
	};
	api.registerService({
		id: "memory-core-dreaming",
		async start(ctx) {
			if (!ctx.getCron) return;
			serviceStartedAtMs = Date.now();
			disposed = false;
			resolveServiceCron = () => resolveCronServiceFromGatewayContext(ctx);
			try {
				await trackDreamingTask(reconcileManagedDreamingCron({
					reason: "startup",
					startupConfig: ctx.config
				}));
			} catch (err) {
				api.logger.error(`memory-core: dreaming startup reconciliation failed: ${formatErrorMessage(err)}`);
			} finally {
				startRuntimeCronReconcileTimer();
			}
		},
		async stop() {
			disposeDreaming();
			await Promise.allSettled(dreamingTasks);
		}
	});
	api.on("gateway_start", async (_event, ctx) => {
		if (disposed || serviceStartedAtMs === void 0) return;
		if (startupDreamingCleanupTimer) {
			clearTimeout(startupDreamingCleanupTimer);
			startupDreamingCleanupTimer = null;
		}
		const generation = ++gatewayLifecycleGeneration;
		await trackDreamingTask(startDreamingSessionCleanup(ctx.config ?? api.config, generation, serviceStartedAtMs)).catch((error) => {
			api.logger.warn(`memory-core: dreaming startup cleanup failed: ${formatErrorMessage(error)}`);
		});
	});
	api.on("before_agent_reply", async (event, ctx) => {
		try {
			if (ctx.trigger !== "heartbeat" && ctx.trigger !== "cron") return;
			const currentConfig = resolveCurrentConfig();
			const hasManagedDreamingToken = includesSystemEventToken(event.cleanedBody, MEMORY_DREAMING_SYSTEM_EVENT_TEXT);
			const isManagedTrigger = ctx.trigger === "cron" || hasPendingManagedDreamingCronEvent(ctx.sessionKey, ctx.agentId);
			if (!hasManagedDreamingToken || !isManagedTrigger) return;
			const config = resolveMemoryDeepDreamingConfig({
				pluginConfig: resolveMemoryDreamingPluginConfig(currentConfig),
				cfg: currentConfig
			});
			return await runShortTermDreamingPromotionIfTriggered({
				cleanedBody: event.cleanedBody,
				trigger: ctx.trigger,
				agentId: ctx.agentId,
				workspaceDir: ctx.workspaceDir,
				cfg: currentConfig,
				config,
				logger: api.logger,
				subagent: config.enabled ? api.runtime?.subagent : void 0
			});
		} catch (err) {
			api.logger.error(`memory-core: dreaming trigger failed: ${formatErrorMessage(err)}`);
			return;
		}
	}, { eligibleTriggers: ["heartbeat", "cron"] });
}
//#endregion
//#region extensions/memory-core/src/flush-plan.ts
const DEFAULT_MEMORY_FLUSH_SOFT_TOKENS = 4e3;
const DEFAULT_MEMORY_FLUSH_FORCE_TRANSCRIPT_BYTES = 2097152;
const MEMORY_FLUSH_TARGET_HINT = "Store durable memories only in memory/YYYY-MM-DD.md (create memory/ if needed).";
const MEMORY_FLUSH_APPEND_ONLY_HINT = "If memory/YYYY-MM-DD.md already exists, APPEND new content only and do not overwrite existing entries.";
const MEMORY_FLUSH_READ_ONLY_HINT = "Treat workspace bootstrap/reference files such as MEMORY.md, DREAMS.md, SOUL.md, and AGENTS.md as read-only during this flush; never overwrite, replace, or edit them.";
const MEMORY_FLUSH_REQUIRED_HINTS = [
	MEMORY_FLUSH_TARGET_HINT,
	MEMORY_FLUSH_APPEND_ONLY_HINT,
	MEMORY_FLUSH_READ_ONLY_HINT
];
const DEFAULT_MEMORY_FLUSH_PROMPT = [
	"Pre-compaction memory flush.",
	MEMORY_FLUSH_TARGET_HINT,
	MEMORY_FLUSH_READ_ONLY_HINT,
	MEMORY_FLUSH_APPEND_ONLY_HINT,
	"Do NOT create timestamped variant files (e.g., YYYY-MM-DD-HHMM.md); always use the canonical YYYY-MM-DD.md filename.",
	`If nothing to store, reply with ${SILENT_REPLY_TOKEN}.`
].join(" ");
const DEFAULT_MEMORY_FLUSH_SYSTEM_PROMPT = [
	"Pre-compaction memory flush turn.",
	"The session is near auto-compaction; capture durable memories to disk.",
	MEMORY_FLUSH_TARGET_HINT,
	MEMORY_FLUSH_READ_ONLY_HINT,
	MEMORY_FLUSH_APPEND_ONLY_HINT,
	`You may reply, but usually ${SILENT_REPLY_TOKEN} is correct.`
].join(" ");
function formatDateStampInTimezone(nowMs, timezone) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(new Date(nowMs));
	const year = parts.find((part) => part.type === "year")?.value;
	const month = parts.find((part) => part.type === "month")?.value;
	const day = parts.find((part) => part.type === "day")?.value;
	if (year && month && day) return `${year}-${month}-${day}`;
	return new Date(resolveMemoryCoreNowMs(nowMs)).toISOString().slice(0, 10);
}
function normalizeNonNegativeInt(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return null;
	const int = Math.floor(value);
	return int >= 0 ? int : null;
}
function ensureNoReplyHint(text) {
	if (text.includes("NO_REPLY")) return text;
	return `${text}\n\nIf no user-visible reply is needed, start with ${SILENT_REPLY_TOKEN}.`;
}
function ensureMemoryFlushSafetyHints(text) {
	let next = text.trim();
	for (const hint of MEMORY_FLUSH_REQUIRED_HINTS) if (!next.includes(hint)) next = next ? `${next}\n\n${hint}` : hint;
	return next;
}
function appendCurrentTimeLine(text, timeLine) {
	const trimmed = text.trimEnd();
	if (!trimmed) return timeLine;
	if (trimmed.includes("Current time:")) return trimmed;
	return `${trimmed}\n${timeLine}`;
}
function buildMemoryFlushPlan(params = {}) {
	const resolved = params;
	const nowMs = resolveMemoryCoreNowMs(resolved.nowMs);
	const cfg = resolved.cfg;
	const defaults = cfg?.agents?.defaults?.compaction?.memoryFlush;
	if (defaults?.enabled === false) return null;
	let softThresholdTokens = normalizeNonNegativeInt(defaults?.softThresholdTokens) ?? DEFAULT_MEMORY_FLUSH_SOFT_TOKENS;
	const forceFlushTranscriptBytes = parseNonNegativeByteSize(defaults?.forceFlushTranscriptBytes) ?? DEFAULT_MEMORY_FLUSH_FORCE_TRANSCRIPT_BYTES;
	let reserveTokensFloor = DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR;
	const contextWindowTokens = normalizeNonNegativeInt(params.contextWindowTokens);
	if (contextWindowTokens !== null && contextWindowTokens > 0) {
		reserveTokensFloor = resolveEffectiveCompactionReserveTokens({
			contextTokenBudget: contextWindowTokens,
			reserveTokens: reserveTokensFloor
		});
		softThresholdTokens = Math.min(softThresholdTokens, Math.floor((contextWindowTokens - reserveTokensFloor) / 2));
	}
	const { timeLine, userTimezone } = resolveCronStyleNow(cfg ?? {}, nowMs);
	const dateStamp = formatDateStampInTimezone(nowMs, userTimezone);
	const relativePath = `memory/${dateStamp}.md`;
	const promptBase = ensureNoReplyHint(ensureMemoryFlushSafetyHints(DEFAULT_MEMORY_FLUSH_PROMPT));
	const systemPrompt = ensureNoReplyHint(ensureMemoryFlushSafetyHints(DEFAULT_MEMORY_FLUSH_SYSTEM_PROMPT));
	return {
		softThresholdTokens,
		forceFlushTranscriptBytes,
		reserveTokensFloor,
		model: defaults?.model?.trim() || void 0,
		prompt: appendCurrentTimeLine(promptBase.replaceAll("YYYY-MM-DD", dateStamp), timeLine),
		systemPrompt: systemPrompt.replaceAll("YYYY-MM-DD", dateStamp),
		relativePath
	};
}
//#endregion
//#region extensions/memory-core/src/session-backfill-gateway.ts
const SESSION_BACKFILL_GATEWAY_METHODS = {
	preview: "memory.sessionBackfill.preview",
	apply: "memory.sessionBackfill.apply",
	rollback: "memory.sessionBackfill.rollback"
};
var InvalidSessionBackfillRequestError = class extends Error {};
const loadSessionBackfillGatewayRuntime = createLazyRuntimeModule(() => import("../../session-backfill-gateway.runtime-BkswF1Rt.mjs"));
function paramsRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("params must be an object.");
	return value;
}
function assertOnlyKeys(params, allowed) {
	const unexpected = Object.keys(params).filter((key) => !allowed.has(key));
	if (unexpected.length > 0) throw new Error(`unexpected parameter: ${unexpected[0]}`);
}
function readOptionalSessionBoundary(params, key) {
	const raw = params[key];
	if (raw !== void 0 && typeof raw !== "string") throw new Error(`${key} must be a string.`);
	return readToolStringParam(params, key);
}
function readGatewayParams(value) {
	const params = paramsRecord(value);
	assertOnlyKeys(params, /* @__PURE__ */ new Set([
		"agentId",
		"from",
		"to",
		"limitDays"
	]));
	return {
		agentId: normalizeAgentId(readToolStringParam(params, "agentId", { required: true })),
		...normalizeSessionBackfillSelection({
			from: readOptionalSessionBoundary(params, "from"),
			to: readOptionalSessionBoundary(params, "to"),
			limitDays: readPositiveIntegerParam(params, "limitDays")
		}, {
			from: "from",
			to: "to",
			limitDays: "limitDays"
		})
	};
}
function readRollbackParams(value) {
	const params = paramsRecord(value);
	assertOnlyKeys(params, /* @__PURE__ */ new Set(["agentId"]));
	return { agentId: normalizeAgentId(readToolStringParam(params, "agentId", { required: true })) };
}
function resolveExecutionContext(api, agentId) {
	const config = api.runtime.config.current();
	if (!listAgentIds(config).includes(agentId)) throw new InvalidSessionBackfillRequestError(`Unknown agent id "${agentId}".`);
	const workspaceDir = api.runtime.agent.resolveAgentWorkspaceDir(config, agentId);
	const pluginConfig = resolvePluginConfigObject(config, "memory-core");
	const remConfig = resolveMemoryRemDreamingConfig({
		cfg: config,
		pluginConfig
	});
	return {
		workspaceDir,
		...pluginConfig ? { pluginConfig } : {},
		...remConfig.timezone !== void 0 ? { timezone: remConfig.timezone } : {}
	};
}
function gatewayResult(result, options) {
	return {
		days: result.days.length,
		candidates: result.candidateCount,
		perDay: result.days.map((day) => ({
			day: day.day,
			candidateCount: day.candidateCount,
			sample: day.topCandidates.slice(0, 3)
		})),
		staged: result.stagedEntries,
		...!options.includeCursor ? { truncated: options.continuation.hasMore } : {},
		...options.includeCursor ? { cursor: {
			advanced: options.continuation.advanced,
			exhausted: result.candidateCount === 0 && !options.continuation.hasMore,
			hasMore: options.continuation.hasMore
		} } : {}
	};
}
function respondInvalid(respond, error) {
	const message = error instanceof Error ? error.message : String(error);
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
}
function respondUnavailable(respond, error) {
	const message = error instanceof Error ? error.message : String(error);
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message));
}
function registerSessionBackfillGatewayMethods(api) {
	const registerBackfill = (method, apply) => {
		api.registerGatewayMethod(method, async ({ params, respond }) => {
			let request;
			try {
				request = readGatewayParams(params);
			} catch (error) {
				respondInvalid(respond, error);
				return;
			}
			try {
				const context = resolveExecutionContext(api, request.agentId);
				const { executeSessionBackfillBatch } = await loadSessionBackfillGatewayRuntime();
				const execution = await executeSessionBackfillBatch({
					...request,
					...context,
					...apply ? { apply: true } : {}
				});
				respond(true, gatewayResult(execution.result, {
					includeCursor: apply,
					continuation: execution.continuation
				}));
			} catch (error) {
				if (error instanceof InvalidSessionBackfillRequestError) respondInvalid(respond, error);
				else respondUnavailable(respond, error);
			}
		}, { scope: apply ? "operator.admin" : "operator.read" });
	};
	registerBackfill(SESSION_BACKFILL_GATEWAY_METHODS.preview, false);
	registerBackfill(SESSION_BACKFILL_GATEWAY_METHODS.apply, true);
	api.registerGatewayMethod(SESSION_BACKFILL_GATEWAY_METHODS.rollback, async ({ params, respond }) => {
		let request;
		try {
			request = readRollbackParams(params);
		} catch (error) {
			respondInvalid(respond, error);
			return;
		}
		try {
			const context = resolveExecutionContext(api, request.agentId);
			const { executeSessionBackfill } = await loadSessionBackfillGatewayRuntime();
			const result = await executeSessionBackfill({
				...request,
				...context,
				rollback: true
			});
			respond(true, {
				removedDiaryEntries: result.rollback?.removedDiaryEntries ?? 0,
				removedStagedEntries: result.rollback?.removedStagedEntries ?? 0
			});
		} catch (error) {
			if (error instanceof InvalidSessionBackfillRequestError) respondInvalid(respond, error);
			else respondUnavailable(respond, error);
		}
	}, { scope: "operator.admin" });
}
//#endregion
//#region extensions/memory-core/index.ts
const loadMemoryToolsModule = createLazyRuntimeModule(() => import("../../tools-BJe5Xw7B.mjs"));
const loadStandingIntentsModule = createLazyRuntimeModule(() => import("../../standing-intents-DCNg_exD.mjs"));
const loadStandingIntentToolModule = createLazyRuntimeModule(() => import("../../standing-intents-tool-D8yY29a-.mjs"));
const loadRuntimeProviderModule = createLazyRuntimeModule(() => import("../../runtime-provider-BAxxPbIo.mjs"));
function createLazyMemoryTool(params) {
	const initialContext = resolveMemoryToolContext(params.options);
	if (!initialContext) return null;
	let toolPromise;
	const loadTool = async () => {
		toolPromise ??= loadMemoryToolsModule().then((module) => params.load(module, params.options));
		return await toolPromise;
	};
	return {
		label: params.contract.label,
		name: params.contract.name,
		description: params.contract.describe(initialContext.sources),
		parameters: params.contract.parameters,
		execute: async (toolCallId, toolParams, signal, onUpdate) => {
			const tool = await loadTool();
			if (!tool) return jsonResult({
				disabled: true,
				unavailable: true,
				error: "memory search unavailable"
			});
			return await tool.execute(toolCallId, toolParams, signal, onUpdate);
		}
	};
}
function createLazyMemorySearchTool(options) {
	return createLazyMemoryTool({
		options,
		contract: MEMORY_SEARCH_TOOL_CONTRACT,
		load: (module, loadOptions) => module.createMemorySearchTool(loadOptions)
	});
}
function createLazyMemoryGetTool(options) {
	return createLazyMemoryTool({
		options,
		contract: MEMORY_GET_TOOL_CONTRACT,
		load: (module, loadOptions) => module.createMemoryGetTool(loadOptions)
	});
}
function createLazyStandingIntentTool(ctx, reportUnavailable) {
	if (ctx.senderIsOwner !== true) return null;
	const cfg = ctx.getRuntimeConfig?.() ?? ctx.runtimeConfig ?? ctx.config;
	const provider = ctx.messageChannel?.trim();
	const senderId = ctx.requesterSenderId?.trim();
	if (!cfg) {
		reportUnavailable("runtime config is unavailable for this turn");
		return null;
	}
	const agentId = resolveSessionAgentIdStrict({
		sessionKey: ctx.sessionKey,
		config: cfg,
		agentId: ctx.agentId
	});
	let toolPromise;
	const loadTool = async () => {
		toolPromise ??= loadStandingIntentToolModule().then((module) => module.createStandingIntentTool({
			agentId,
			assertCurrent: ctx.assertInvocationCurrent,
			...ctx.sessionId ? { sourceSessionId: ctx.sessionId } : {},
			...ctx.nativeChannelId ? { conversationId: ctx.nativeChannelId } : {},
			...provider ? { provider } : {},
			...ctx.agentAccountId ? { accountId: ctx.agentAccountId } : {},
			...senderId ? { senderId } : {}
		}));
		return await toolPromise;
	};
	return {
		label: "Standing Intent",
		name: "intent",
		description: "Create, list, or explicitly cancel event-conditioned standing intents. A created intent is armed; the system injects the reminder automatically when it triggers. Do not deliver it early or cancel it unless the user asks. Use scheduled tasks for time-based reminders.",
		parameters: {
			type: "object",
			properties: {
				action: {
					type: "string",
					enum: [
						"create",
						"list",
						"cancel"
					]
				},
				id: { type: "string" },
				description: { type: "string" },
				triggerKeywords: {
					type: "array",
					items: { type: "string" }
				},
				scope: {
					type: "string",
					enum: [
						"conversation",
						"channel",
						"anywhere"
					],
					default: "channel"
				},
				senderScope: {
					type: "string",
					enum: ["sender", "anyone"],
					default: "sender"
				},
				expiresAt: { type: "string" },
				maxFires: {
					type: "integer",
					minimum: 1
				},
				cooldownSeconds: {
					type: "integer",
					minimum: 0
				},
				status: {
					type: "string",
					enum: [
						"pending",
						"armed",
						"fired",
						"done",
						"cancelled",
						"expired"
					]
				}
			},
			required: ["action"],
			additionalProperties: false
		},
		execute: async (toolCallId, params, signal, onUpdate) => {
			return await (await loadTool()).execute(toolCallId, params, signal, onUpdate);
		}
	};
}
function resolveMemoryToolOptions(ctx, host) {
	const getConfig = ctx.getRuntimeConfig ? () => ctx.getRuntimeConfig?.() : () => ctx.runtimeConfig ?? ctx.config;
	return {
		config: getConfig(),
		getConfig,
		agentId: ctx.agentId,
		agentSessionKey: ctx.sessionKey,
		sandboxed: ctx.sandboxed,
		oneShotCliRun: ctx.oneShotCliRun,
		conversationRecall: ctx.conversationRecall,
		activeProjectKeys: ctx.activeProjectKeys,
		...host.acquireLocalService ? { acquireLocalService: host.acquireLocalService } : {}
	};
}
function createLazyMemoryRuntime(host) {
	return {
		supportsWorkspaceMemoryReadSources: true,
		prepareReload: prepareMemoryManagerReload,
		async getMemorySearchManager(params) {
			const { createMemoryRuntime } = await loadRuntimeProviderModule();
			return await createMemoryRuntime(host).getMemorySearchManager(params);
		},
		async authorizeSearchHits(params) {
			const { createMemoryRuntime } = await loadRuntimeProviderModule();
			return await createMemoryRuntime(host).authorizeSearchHits(params);
		},
		async classifyWorkspaceMemoryPaths(params) {
			const [{ classifyWorkspaceMemoryPaths }, dreamingState] = await Promise.all([import("../../workspace-path-classifier-BDngnDce.mjs"), import("../../dreaming-state-GgIReYWB.mjs")]);
			if (host.openKeyedStore) dreamingState.configureMemoryCoreDreamingState(host.openKeyedStore);
			return await classifyWorkspaceMemoryPaths(params);
		},
		resolveMemoryBackendConfig,
		async closeAllMemorySearchManagers() {
			const { memoryRuntime: runtime } = await loadRuntimeProviderModule();
			await runtime.closeAllMemorySearchManagers();
		},
		async closeMemorySearchManager(params) {
			const { memoryRuntime: runtime } = await loadRuntimeProviderModule();
			await runtime.closeMemorySearchManager(params);
		}
	};
}
var memory_core_default = definePluginEntry({
	id: "memory-core",
	name: "OpenClaw Memory",
	description: "File-backed memory search tools and CLI",
	kind: "memory",
	register(api) {
		const acquireLocalService = (...args) => api.runtime.llm.acquireLocalService(...args);
		const openKeyedStore = (options) => api.runtime.state.openKeyedStore(options);
		const host = {
			acquireLocalService,
			openKeyedStore
		};
		configureMemoryCoreDreamingState(openKeyedStore);
		const memoryRuntime = createLazyMemoryRuntime(host);
		registerShortTermPromotionDreaming(api);
		registerSessionBackfillGatewayMethods(api);
		api.registerMemoryCapability({
			deterministicRecallToolName: "memory_search",
			supportsPrivateTranscriptRecall: true,
			promptBuilder: (params) => {
				if (!params.availableTools.has("memory_search") && !params.availableTools.has("memory_get")) return [];
				const liveConfig = api.runtime.config?.current ? api.runtime.config.current() : api.config;
				return resolveMemoryToolContext({
					config: liveConfig,
					agentId: params.agentId,
					agentSessionKey: params.agentSessionKey
				}) ? buildMemoryPromptSection(params) : [];
			},
			flushPlanResolver: buildMemoryFlushPlan,
			runtime: memoryRuntime,
			publicArtifacts: { async listArtifacts(params) {
				const { listMemoryCorePublicArtifacts } = await import("../../public-artifacts-BhrV2PiZ.mjs");
				return await listMemoryCorePublicArtifacts(params);
			} }
		});
		api.registerTool((ctx) => createLazyMemorySearchTool(resolveMemoryToolOptions(ctx, host)), { names: ["memory_search"] });
		api.registerTool((ctx) => createLazyMemoryGetTool(resolveMemoryToolOptions(ctx, host)), { names: ["memory_get"] });
		api.registerTool({
			contextVersion: 2,
			create: (ctx) => createLazyStandingIntentTool(ctx, (reason) => {
				api.logger.warn(`memory-core: intent tool unavailable: ${reason}`);
			})
		}, { names: ["intent"] });
		api.on("before_prompt_build", async (event, ctx) => {
			if (ctx.trigger !== "user") return;
			try {
				const invocation = ctx.hookInvocation;
				if (!invocation) throw new Error("prompt hook invocation support is required; intent matching skipped");
				const module = await loadStandingIntentsModule();
				invocation.assertActive();
				if (!module.isEligibleStandingIntentTurn(ctx)) return;
				const config = api.runtime.config?.current?.() ?? api.config;
				const agentId = resolveSessionAgentIdStrict({
					sessionKey: ctx.sessionKey,
					config,
					agentId: ctx.agentId
				});
				const intents = await module.matchStandingIntents({
					agentId,
					prompt: event.prompt,
					assertCurrent: invocation.assertActive,
					...ctx.channelId ?? ctx.chatId ? { channel: ctx.channelId ?? ctx.chatId } : {},
					...ctx.channel ?? ctx.messageProvider ? { provider: ctx.channel ?? ctx.messageProvider } : {},
					...ctx.accountId ? { accountId: ctx.accountId } : {},
					...ctx.senderId ? { senderId: ctx.senderId } : {}
				});
				const prependContext = module.buildStandingIntentContext(intents);
				return prependContext ? { prependContext } : void 0;
			} catch (error) {
				api.logger.warn?.(`memory-core: standing intent matching failed: ${error instanceof Error ? error.message : String(error)}`);
				return;
			}
		});
		api.on("before_agent_reply", async (_event, ctx) => {
			if (ctx.trigger !== "heartbeat" && ctx.trigger !== "cron") return;
			try {
				const module = await loadStandingIntentsModule();
				const config = api.runtime.config?.current?.() ?? api.config;
				const agentId = resolveSessionAgentIdStrict({
					sessionKey: ctx.sessionKey,
					config,
					agentId: ctx.agentId
				});
				await module.sweepStandingIntents({ agentId });
			} catch (error) {
				api.logger.warn?.(`memory-core: standing intent maintenance failed: ${error instanceof Error ? error.message : String(error)}`);
			}
		}, { eligibleTriggers: ["heartbeat", "cron"] });
		api.registerCommand({
			name: "dreaming",
			description: "Enable or disable memory dreaming.",
			acceptsArgs: true,
			exposeSenderIsOwner: true,
			handler: async (ctx) => {
				const { handleDreamingCommand } = await import("../../dreaming-command-WY4aMYFi.mjs");
				return await handleDreamingCommand(api, ctx);
			}
		});
		api.registerCli(async ({ program }) => {
			const { registerMemoryCli } = await import("./cli.js");
			registerMemoryCli(program, host);
		}, { descriptors: [{
			name: "memory",
			description: "Search, inspect, and reindex memory files",
			hasSubcommands: true
		}] });
	}
});
//#endregion
export { memory_core_default as default };
