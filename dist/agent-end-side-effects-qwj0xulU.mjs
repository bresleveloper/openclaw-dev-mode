import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { w as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { i as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import "./config-B3oiWDlr.mjs";
import { t as readActiveTranscriptEntryAnchorAsync } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
import { D as consumeRunSkillUsage } from "./agent-tools.before-tool-call-CtP0G8Wg.mjs";
import { _ as isExpectedRunCancellation } from "./command-queue-Dvag6gVL.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-BJIyIMth.mjs";
import { a as completedTurnMessageAnchor } from "./session-manager-Mve5HWCW.mjs";
import { r as runAgentHarnessAgentEndHook, t as awaitAgentHarnessAgentEndHook } from "./lifecycle-hook-helpers-BAkeSLPH.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/skill-workshop-workspace-context.ts
const canonicalSkillWorkspace = new AsyncLocalStorage();
function runWithCanonicalSkillWorkspace(canonicalWorkspaceDir, run) {
	return canonicalWorkspaceDir ? canonicalSkillWorkspace.run(canonicalWorkspaceDir, run) : run();
}
function getCanonicalSkillWorkspace() {
	return canonicalSkillWorkspace.getStore();
}
//#endregion
//#region src/skills/workshop/experience-review-scheduler.ts
/** Model iterations a session accumulates across turns before a review is due. */
const EXPERIENCE_REVIEW_ITERATION_THRESHOLD = 10;
const EXPERIENCE_REVIEW_IDLE_MS = 3e4;
const EXPERIENCE_REVIEW_RETRY_IDLE_MS = 3e4;
const EXPERIENCE_REVIEW_MAX_PENDING = 32;
const EXPERIENCE_REVIEW_MAX_COUNTERS = 1024;
const EXPERIENCE_REVIEW_BLOCKED_TRIGGERS = /* @__PURE__ */ new Set([
	"cron",
	"heartbeat",
	"memory",
	"overflow"
]);
const EXPERIENCE_REVIEW_BLOCKED_SESSION_SEGMENTS = /* @__PURE__ */ new Set([
	"acp",
	"cron",
	"hook",
	"subagent"
]);
const log$2 = createSubsystemLogger("skills/workshop");
function isEligibleContext(ctx) {
	if (ctx.skillWorkshopAvailable !== true || !ctx.modelProviderId?.trim() || !ctx.modelId?.trim()) return false;
	const trigger = ctx.foregroundPromptContext.trigger?.trim().toLowerCase();
	if (trigger && EXPERIENCE_REVIEW_BLOCKED_TRIGGERS.has(trigger)) return false;
	const sessionKey = ctx.sessionKey?.trim().toLowerCase();
	if (!sessionKey || sessionKey.includes("active-memory") || isInternalSessionEffectsKey(sessionKey)) return false;
	return !sessionKey.split(":").some((segment) => EXPERIENCE_REVIEW_BLOCKED_SESSION_SEGMENTS.has(segment));
}
/**
* Provider-reported iterations win; otherwise count assistant messages after the last user
* message. A zero report is no report: Codex counts only raw response events, which resumed
* threads do not emit.
*/
function resolveTurnModelIterations(params) {
	const reported = params.ctx.modelIterations;
	if (reported !== void 0 && Number.isSafeInteger(reported) && reported > 0) return reported;
	const { messages } = params.event;
	let count = 0;
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (isRecord(message) && message.role === "user") break;
		if (isRecord(message) && message.role === "assistant") count += 1;
	}
	return count;
}
/**
* Counts model iterations per (agent, session) across turns and queues one background review
* after 10 iterations since its last queued review or its last own Workshop edit.
* Reviews wait for a quiet period and run one at a time.
*/
function createSkillExperienceReviewScheduler(deps) {
	const iterationsBySession = /* @__PURE__ */ new Map();
	const pendingBySession = /* @__PURE__ */ new Map();
	let reviewInFlight = false;
	const setTimer = deps.setTimer ?? ((callback, delayMs) => setTimeout(callback, delayMs));
	const clearTimer = deps.clearTimer ?? clearTimeout;
	const arm = (key, pending, delayMs) => {
		if (pending.timer) clearTimer(pending.timer);
		const generation = ++pending.generation;
		const timerCallback = () => {
			if (pendingBySession.get(key) !== pending || pending.generation !== generation) return;
			pending.timer = void 0;
			(async () => {
				const active = await deps.isSystemActive();
				if (pendingBySession.get(key) !== pending || pending.generation !== generation) return;
				if (active || reviewInFlight) {
					arm(key, pending, EXPERIENCE_REVIEW_RETRY_IDLE_MS);
					return;
				}
				reviewInFlight = true;
				try {
					pendingBySession.delete(key);
					await deps.runReview(pending.candidate);
				} finally {
					reviewInFlight = false;
				}
			})().catch((error) => {
				if (isExpectedRunCancellation(error)) log$2.debug(`skill experience review cancelled: ${formatErrorMessage(error)}`);
				else log$2.warn(`skill experience review failed: ${formatErrorMessage(error)}`);
				if (pendingBySession.get(key) === pending && pending.generation === generation) pendingBySession.delete(key);
			});
		};
		const timer = runInDetachedAsyncContext(() => setTimer(timerCallback, delayMs));
		pending.timer = timer;
		timer.unref?.();
	};
	const cancel = (key) => {
		const pending = pendingBySession.get(key);
		if (pending?.timer) clearTimer(pending.timer);
		pendingBySession.delete(key);
		iterationsBySession.delete(key);
	};
	return {
		schedule(params) {
			const sessionKey = params.ctx.sessionKey?.trim();
			if (!sessionKey || isIncognitoSessionKey(sessionKey) || isIncognitoSessionKey(params.source?.sessionKey)) return;
			const key = JSON.stringify([params.ctx.foregroundPromptContext.agentId, sessionKey]);
			const existing = pendingBySession.get(key);
			if (existing) arm(key, existing, EXPERIENCE_REVIEW_IDLE_MS);
			if (typeof params.event.error === "string" && params.event.error.trim() !== "") {
				log$2.debug(`experience review skipped: reason=errored-completion session=${sessionKey}`);
				return;
			}
			if (resolveSkillWorkshopConfig(params.config).autonomous.mode !== "auto") {
				cancel(key);
				return;
			}
			if (!isEligibleContext(params.ctx)) {
				log$2.debug(`experience review skipped: reason=ineligible-context session=${sessionKey}`);
				return;
			}
			if (params.workshopMutated) {
				cancel(key);
				return;
			}
			const iterations = (iterationsBySession.get(key) ?? 0) + resolveTurnModelIterations(params);
			iterationsBySession.delete(key);
			if (iterations < EXPERIENCE_REVIEW_ITERATION_THRESHOLD) {
				iterationsBySession.set(key, iterations);
				pruneMapToMaxSize(iterationsBySession, EXPERIENCE_REVIEW_MAX_COUNTERS);
				return;
			}
			const workspaceDir = getCanonicalSkillWorkspace() ?? params.ctx.workspaceDir?.trim();
			const modelProviderId = params.ctx.modelProviderId?.trim();
			const modelId = params.ctx.modelId?.trim();
			const { source } = params;
			if (!workspaceDir || !source || !modelProviderId || !modelId) {
				log$2.debug(`experience review skipped: reason=missing-context session=${sessionKey}`);
				return;
			}
			if (!existing && pendingBySession.size >= EXPERIENCE_REVIEW_MAX_PENDING) {
				const oldest = pendingBySession.entries().next().value;
				if (oldest) {
					if (oldest[1].timer) clearTimer(oldest[1].timer);
					pendingBySession.delete(oldest[0]);
				}
			}
			const candidate = {
				ctx: {
					runId: params.ctx.runId,
					workspaceDir,
					modelProviderId,
					modelId,
					authProfileId: params.ctx.authProfileId,
					foregroundPromptContext: params.ctx.foregroundPromptContext
				},
				config: params.config,
				source: { ...source },
				usedSkills: params.usedSkills ? [...params.usedSkills] : void 0,
				turnAborted: !params.event.success
			};
			const pending = existing ?? {
				candidate,
				generation: 0
			};
			pending.candidate = candidate;
			pendingBySession.set(key, pending);
			arm(key, pending, EXPERIENCE_REVIEW_IDLE_MS);
			log$2.debug(`experience review scheduled: session=${sessionKey} iterations=${iterations}`);
		},
		clear() {
			for (const pending of pendingBySession.values()) if (pending.timer) clearTimer(pending.timer);
			pendingBySession.clear();
			iterationsBySession.clear();
		}
	};
}
//#endregion
//#region src/skills/workshop/experience-review-default.ts
const log$1 = createSubsystemLogger("skills/workshop");
const UNUSED_ARCHIVE_INTERVAL_MS = 864e5;
const lastUnusedArchiveByAgent = /* @__PURE__ */ new Map();
const defaultScheduler = createSkillExperienceReviewScheduler({
	isSystemActive: async () => {
		const { getActiveEmbeddedRunCount } = await import("./active-run-projections-Dq7HVD2W.mjs");
		return getActiveEmbeddedRunCount() > 0;
	},
	runReview: async (candidate) => {
		const { getRuntimeConfig } = await import("./config/config.js");
		const { prepareSkillExperienceReviewCandidate, runSkillExperienceReview } = await import("./experience-review-Br5wkIkD.mjs");
		const prepared = await prepareSkillExperienceReviewCandidate(candidate, getRuntimeConfig());
		if (prepared) await runSkillExperienceReview(prepared);
	}
});
/** Counts the finished turn toward a background review; never affects the turn's result. */
function scheduleSkillExperienceReview(params) {
	const runId = params.ctx.runId?.trim();
	if (resolveSkillWorkshopConfig(params.config).autonomous.mode !== "auto" || !runId) {
		defaultScheduler.schedule(params);
		return;
	}
	import("./library-C_owpNRW.mjs").then(({ listWorkshopChanges }) => listWorkshopChanges(params.ctx.foregroundPromptContext.agentId, {
		runId,
		limit: 1
	})).then((changes) => defaultScheduler.schedule({
		...params,
		workshopMutated: changes.length > 0
	})).catch((error) => {
		log$1.warn(`skill experience review scheduling failed: ${formatErrorMessage(error)}`);
	});
}
/**
* Archives an agent's long-unused learned skills, at most once a day per agent. Runs detached
* from the finished turn and never affects its result; no scheduler owns this work.
*/
function scheduleUnusedWorkshopSkillArchive(config, agentId) {
	if (resolveSkillWorkshopConfig(config).autonomous.mode !== "auto") return;
	const nowMs = Date.now();
	const lastMs = lastUnusedArchiveByAgent.get(agentId);
	if (lastMs !== void 0 && nowMs - lastMs < UNUSED_ARCHIVE_INTERVAL_MS) return;
	lastUnusedArchiveByAgent.set(agentId, nowMs);
	runWithGatewayDetachedWorkContinuation(async () => {
		const { archiveUnusedWorkshopSkills } = await import("./unused-archive-CBiI71Zy.mjs");
		const archived = await archiveUnusedWorkshopSkills(config, agentId, nowMs);
		if (archived.length > 0) log$1.info(`archived ${archived.length} unused learned skill(s) for ${agentId}: ${archived.map((change) => change.skillName).join(", ")}`);
	}, "skills:workshop-unused-archive").catch((error) => {
		log$1.warn(`unused skill archive failed: ${formatErrorMessage(error)}`);
	});
}
//#endregion
//#region src/agents/harness/agent-end-side-effects.ts
const log = createSubsystemLogger("agents/harness");
function runCoreAgentEndSideEffects(params, read) {
	const usedSkills = consumeRunSkillUsage(params.ctx.runId);
	const foregroundPromptContext = params.ctx.foregroundPromptContext;
	if (!foregroundPromptContext) return;
	const config = params.ctx.config ?? readRuntimeConfig();
	const schedule = (anchor) => {
		if (!anchor) return;
		const ctx = {
			...params.ctx,
			foregroundPromptContext
		};
		scheduleSkillExperienceReview({
			event: params.event,
			ctx,
			usedSkills,
			config,
			source: anchor
		});
	};
	const failed = (error) => {
		log.warn(`skill experience review scheduling failed: ${String(error)}`);
	};
	try {
		scheduleUnusedWorkshopSkillArchive(config, foregroundPromptContext.agentId);
		const source = params.skillExperienceReviewSource;
		if (!source) return;
		if (read === "worker") {
			const committed = params[completedTurnMessageAnchor];
			const assertCurrent = committed?.assertCurrent ?? captureOwnedTranscriptWriteAssertion(source);
			assertCurrent();
			if (committed) {
				schedule(committed.anchor);
				return;
			}
			return readActiveTranscriptEntryAnchorAsync(source).then((anchor) => {
				assertCurrent();
				schedule(anchor);
			}).catch(failed);
		}
		schedule(readActiveTranscriptEntryAnchor(source));
	} catch (error) {
		failed(error);
	}
}
/** @deprecated Await runAgentEndSideEffectsAsync. Supported through 2026-12-31. */
function runAgentEndSideEffects(params) {
	warnPluginSdkDeprecation({
		family: "agent-end-side-effects",
		method: "runAgentEndSideEffects",
		replacement: "await runAgentEndSideEffectsAsync"
	});
	runCoreAgentEndSideEffects(params, "native");
	runAgentHarnessAgentEndHook(params);
}
/** Keep the turn lease through anchor preparation, then start plugin hooks without waiting. */
async function runAgentEndSideEffectsAsync(params) {
	await runCoreAgentEndSideEffects(params, "worker");
	runAgentHarnessAgentEndHook(params);
}
/** Runs agent-end side effects and waits for plugin/core completion. */
async function awaitAgentEndSideEffects(params) {
	await runCoreAgentEndSideEffects(params, "worker");
	await awaitAgentHarnessAgentEndHook(params);
}
//#endregion
export { runWithCanonicalSkillWorkspace as i, runAgentEndSideEffects as n, runAgentEndSideEffectsAsync as r, awaitAgentEndSideEffects as t };
