import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { m as stripRuntimeContextCustomMessages } from "./internal-runtime-context-BH-o1oq1.mjs";
import { t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { g as consumeRunSkillUsage } from "./agent-tools.before-tool-call-C2rI0w1x.mjs";
import { y as runWithPreparedMemoryPromptSection } from "./memory-state-D4zZpGOe.mjs";
import { r as runOutsidePreparedModelRuntimePluginGenerationScope } from "./prepared-model-runtime-generation-scope-BA7V9xf7.mjs";
import { a as runWithSessionTranscriptReadFence } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-B0dOIy5w.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-CYRu5kQ6.mjs";
import { n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST } from "./host-compat-xESS3bi6.mjs";
import { t as runContextEngineMaintenance } from "./context-engine-maintenance-5FlnjD_8.mjs";
import { t as getCanonicalSkillWorkspace } from "./skill-workshop-workspace-context-B6qgDkMR.mjs";
import { n as countSkillModelIterations, r as selectCurrentSkillTurnMessages } from "./experience-review-prompt-__4dKrZw.mjs";
import { r as runAgentHarnessAgentEndHook, t as awaitAgentHarnessAgentEndHook } from "./lifecycle-hook-helpers-DTTv5bkq.mjs";
//#region src/context-engine/runtime-settings.ts
const RUNTIME_REASON_CODES = /* @__PURE__ */ new Set([
	"provider_timeout",
	"provider_unavailable",
	"rate_limited",
	"context_overflow",
	"runtime_unavailable",
	"unknown"
]);
const RUNTIME_REASON_PATTERNS = [
	["provider_timeout", /timeout/iu],
	["rate_limited", /rate|limit|429/iu],
	["context_overflow", /overflow|context|pressure/iu],
	["runtime_unavailable", /runtime/iu],
	["provider_unavailable", /provider|primary|unavailable/iu]
];
function normalizeReasonCode(value) {
	const normalized = normalizeNullableString(value);
	if (!normalized) return null;
	if (RUNTIME_REASON_CODES.has(normalized)) return normalized;
	return RUNTIME_REASON_PATTERNS.find(([, pattern]) => pattern.test(normalized))?.[0] ?? "unknown";
}
function buildContextEngineRuntimeSettings(params) {
	const hostId = normalizeNullableString(params.contextEngineHost.id);
	const selectedId = normalizeNullableString(params.selectedContextEngineId);
	const selectionSource = params.contextEngineSelectionSource ?? (selectedId ? "configured" : "unknown");
	const requestedModel = normalizeNullableString(params.requestedModel);
	const resolvedModel = normalizeNullableString(params.resolvedModel);
	const fallbackReason = normalizeReasonCode(params.fallbackReason);
	const degradedReason = normalizeReasonCode(params.degradedReason);
	const resolvedViaFallback = requestedModel !== null && resolvedModel !== null && requestedModel !== resolvedModel;
	return {
		schemaVersion: 1,
		runtime: {
			host: "openclaw",
			mode: params.mode ?? (degradedReason ? "degraded" : fallbackReason || resolvedViaFallback ? "fallback" : "normal"),
			harnessId: normalizeNullableString(params.harnessId),
			runtimeId: normalizeNullableString(params.runtimeId)
		},
		model: {
			requested: requestedModel,
			resolved: resolvedModel,
			provider: normalizeNullableString(params.provider),
			family: normalizeNullableString(params.modelFamily)
		},
		contextEngineSelection: {
			selectedId,
			source: selectionSource
		},
		executionHost: {
			id: hostId,
			label: normalizeNullableString(params.contextEngineHost.label)
		},
		limits: {
			promptTokenBudget: asFiniteNumber(params.promptTokenBudget) ?? null,
			maxOutputTokens: asFiniteNumber(params.maxOutputTokens) ?? null
		},
		diagnostics: {
			fallbackReason,
			degradedReason
		}
	};
}
//#endregion
//#region src/skills/workshop/experience-review-scheduler.ts
const EXPERIENCE_REVIEW_MIN_MODEL_ITERATIONS = 10;
const EXPERIENCE_REVIEW_IDLE_MS = 3e4;
const EXPERIENCE_REVIEW_RETRY_IDLE_MS = 3e4;
const EXPERIENCE_REVIEW_MAX_PENDING = 32;
const EXPERIENCE_REVIEW_BLOCKED_TRIGGERS = /* @__PURE__ */ new Set([
	"cron",
	"heartbeat",
	"memory",
	"overflow"
]);
const EXPERIENCE_REVIEW_BLOCKED_SESSION_SEGMENTS = /* @__PURE__ */ new Set([
	"cron",
	"hook",
	"subagent",
	"skill-workshop-review"
]);
const log$1 = createSubsystemLogger("skills/workshop");
function isEligibleContext(ctx) {
	if (ctx.compacted === true || ctx.skillWorkshopAvailable !== true || !ctx.modelProviderId?.trim() || !ctx.modelId?.trim()) return false;
	const trigger = ctx.foregroundPromptContext.trigger?.trim().toLowerCase();
	if (trigger && EXPERIENCE_REVIEW_BLOCKED_TRIGGERS.has(trigger)) return false;
	const sessionKey = ctx.sessionKey?.trim().toLowerCase();
	if (!sessionKey || sessionKey.includes("active-memory")) return false;
	return !sessionKey.split(":").some((segment) => EXPERIENCE_REVIEW_BLOCKED_SESSION_SEGMENTS.has(segment));
}
function createSkillExperienceReviewScheduler(deps) {
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
			Promise.resolve(deps.isSystemActive()).then(async (active) => {
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
			}).catch((error) => {
				log$1.warn(`skill experience review failed: ${String(error)}`);
				if (pendingBySession.get(key) === pending && pending.generation === generation) pendingBySession.delete(key);
			});
		};
		const timer = runOutsidePreparedModelRuntimePluginGenerationScope(() => runOutsidePluginRuntimeGenerationScope(() => setTimer(timerCallback, delayMs)));
		pending.timer = timer;
		timer.unref?.();
	};
	return {
		schedule(params) {
			const sessionKey = params.ctx.sessionKey?.trim();
			if (!sessionKey) return;
			const key = JSON.stringify([params.ctx.foregroundPromptContext.agentId, sessionKey]);
			const existing = pendingBySession.get(key);
			const errored = typeof params.event.error === "string" && params.event.error.trim() !== "";
			if (existing && errored && params.ctx.runId?.trim() && params.ctx.runId === existing.candidate.ctx.runId) {
				if (existing.timer) clearTimer(existing.timer);
				pendingBySession.delete(key);
				return;
			}
			if (existing) arm(key, existing, EXPERIENCE_REVIEW_IDLE_MS);
			if (errored) {
				log$1.debug(`experience review skipped: reason=errored-completion session=${sessionKey}`);
				return;
			}
			if (resolveSkillWorkshopConfig(params.config).autonomous.mode === "off") return;
			if (!isEligibleContext(params.ctx)) {
				log$1.debug(`experience review skipped: reason=ineligible-context session=${sessionKey}`);
				return;
			}
			const workspaceDir = getCanonicalSkillWorkspace() ?? params.ctx.workspaceDir?.trim();
			if (!workspaceDir) {
				log$1.debug(`experience review skipped: reason=missing-workspace session=${sessionKey}`);
				return;
			}
			const turnMessages = selectCurrentSkillTurnMessages(params.event.messages);
			const reportedModelIterations = params.ctx.modelIterations;
			const modelIterations = reportedModelIterations === void 0 ? countSkillModelIterations(turnMessages) : Number.isSafeInteger(reportedModelIterations) && reportedModelIterations >= 0 ? reportedModelIterations : 0;
			if (modelIterations < EXPERIENCE_REVIEW_MIN_MODEL_ITERATIONS) {
				log$1.debug(`experience review skipped: reason=below-depth-bar iterations=${modelIterations} session=${sessionKey}`);
				return;
			}
			const { source } = params;
			const modelProviderId = params.ctx.modelProviderId?.trim();
			const modelId = params.ctx.modelId?.trim();
			if (!source || !modelProviderId || !modelId) return;
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
			log$1.debug(`experience review scheduled: session=${sessionKey} iterations=${modelIterations} aborted=${!params.event.success}`);
		},
		clear() {
			for (const pending of pendingBySession.values()) if (pending.timer) clearTimer(pending.timer);
			pendingBySession.clear();
		}
	};
}
//#endregion
//#region src/skills/workshop/experience-review-default.ts
const defaultScheduler = createSkillExperienceReviewScheduler({
	isSystemActive: async () => {
		const { getActiveEmbeddedRunCount } = await import("./active-run-projections-Ckmy6zB2.mjs");
		return getActiveEmbeddedRunCount() > 0;
	},
	runReview: async (candidate) => {
		const { getRuntimeConfig } = await import("./config/config.js");
		const { prepareSkillExperienceReviewCandidate, runSkillExperienceReview } = await import("./experience-review-i7TSP_TE.mjs");
		const prepared = await prepareSkillExperienceReviewCandidate(candidate, getRuntimeConfig());
		if (prepared) await runSkillExperienceReview(prepared);
	}
});
/** Queues a conservative, post-run learning review after the agent system becomes idle. */
function scheduleSkillExperienceReview(params) {
	defaultScheduler.schedule(params);
}
//#endregion
//#region src/agents/harness/agent-end-side-effects.ts
/**
* Agent-end side effect runner.
*
* Harnesses use this to trigger skill experience review and plugin agent_end hooks
* either fire-and-forget or awaited during tests/shutdown.
*/
const log = createSubsystemLogger("agents/harness");
function runCoreAgentEndSideEffects(params) {
	const usedSkills = consumeRunSkillUsage(params.ctx.runId);
	const source = params.skillExperienceReviewSource;
	if (!params.ctx.foregroundPromptContext || !source) return;
	const config = params.ctx.config ?? getRuntimeConfig();
	const ctx = {
		...params.ctx,
		foregroundPromptContext: params.ctx.foregroundPromptContext
	};
	try {
		const anchor = readActiveTranscriptEntryAnchor(source);
		if (!anchor) return;
		scheduleSkillExperienceReview({
			event: params.event,
			ctx,
			usedSkills,
			config,
			source: anchor
		});
	} catch (error) {
		log.warn(`skill experience review scheduling failed: ${String(error)}`);
	}
}
/** Starts agent-end side effects without waiting for completion. */
function runAgentEndSideEffects(params) {
	runCoreAgentEndSideEffects(params);
	runAgentHarnessAgentEndHook(params);
}
/** Runs agent-end side effects and waits for plugin/core completion. */
async function awaitAgentEndSideEffects(params) {
	runCoreAgentEndSideEffects(params);
	await awaitAgentHarnessAgentEndHook(params);
}
//#endregion
//#region src/agents/harness/context-engine-lifecycle.ts
function preparePreTurnRuntimeContext(runtimeContext) {
	if (!runtimeContext?.rewriteTranscriptEntries) return runtimeContext;
	const { rewriteTranscriptEntries: _rewriteTranscriptEntries, ...fenced } = runtimeContext;
	return fenced;
}
function buildHarnessContextEngineRuntimeSettings(params) {
	return params.runtimeSettings ?? (() => {
		const selectedId = params.contextEngine?.info.id;
		return buildContextEngineRuntimeSettings({
			contextEngineHost: params.contextEngineHostSupport ?? OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
			harnessId: params.harnessId,
			runtimeId: params.runtimeId,
			provider: params.providerId,
			requestedModel: params.requestedModelId,
			resolvedModel: params.modelId ?? params.requestedModelId,
			modelFamily: params.modelFamily ?? null,
			selectedContextEngineId: selectedId,
			contextEngineSelectionSource: selectedId === "legacy" ? "default" : selectedId ? "configured" : "unknown",
			promptTokenBudget: params.tokenBudget,
			maxOutputTokens: params.maxOutputTokens,
			fallbackReason: params.fallbackReason,
			degradedReason: params.degradedReason
		});
	})();
}
/**
* Run optional bootstrap + bootstrap maintenance for a harness-owned context engine.
*/
async function bootstrapHarnessContextEngine(params) {
	if (!params.hadSessionFile || !(params.contextEngine?.bootstrap || params.contextEngine?.maintain)) return;
	try {
		const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
		const runtimeContext = preparePreTurnRuntimeContext(params.runtimeContext);
		await runWithSessionTranscriptReadFence(params.transcriptReadFence, async () => {
			if (typeof params.contextEngine?.bootstrap === "function") await params.contextEngine.bootstrap({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				sessionTarget: params.sessionTarget,
				sessionFile: params.sessionFile,
				runtimeSettings,
				runtimeContext
			});
			await (params.runMaintenance ?? runHarnessContextEngineMaintenance)({
				contextEngine: params.contextEngine,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				sessionTarget: params.sessionTarget,
				sessionFile: params.sessionFile,
				reason: "bootstrap",
				sessionManager: params.sessionManager,
				runtimeContext,
				runtimeSettings,
				config: params.config
			});
		});
	} catch (bootstrapErr) {
		params.warn(`context engine bootstrap failed: ${String(bootstrapErr)}`);
	}
}
/**
* Assemble model context through the active harness-owned context engine.
*/
async function assembleHarnessContextEngine(params) {
	if (!params.contextEngine) return;
	const contextEngine = params.contextEngine;
	const messages = (params.appendOnlyRuntimeContext ? params.messages : stripRuntimeContextCustomMessages(params.messages)).slice();
	const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
	const runtimeContext = preparePreTurnRuntimeContext(params.runtimeContext);
	const assemble = () => contextEngine.assemble({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		messages,
		tokenBudget: params.tokenBudget,
		...params.availableTools ? { availableTools: params.availableTools } : {},
		...params.citationsMode ? { citationsMode: params.citationsMode } : {},
		model: params.modelId,
		runtimeSettings,
		runtimeContext,
		...params.prompt !== void 0 ? { prompt: params.prompt } : {}
	});
	return ensureAssembleResultShape(await runWithSessionTranscriptReadFence(params.transcriptReadFence, async () => contextEngine.info.id === "legacy" ? await assemble() : await runWithPreparedMemoryPromptSection({
		availableTools: params.availableTools ?? /* @__PURE__ */ new Set(),
		citationsMode: params.citationsMode,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		agentSessionKey: params.sessionKey,
		sandboxed: params.sandboxed
	}, assemble)), contextEngine.info.id);
}
/**
* Validate that a context engine's assemble() return value matches the
* AssembleResult contract before the runner consumes it. Engines that omit
* `messages` or return a non-array previously crashed the runner downstream
* when prompt assembly tried to read `activeSession.messages.length` (#75541).
*
* Throws a descriptive error so the runner's existing assemble try/catch can
* log the offending engine id and fall back to the unmodified pipeline
* messages instead of poisoning session state.
*/
function ensureAssembleResultShape(result, engineId) {
	if (!result || typeof result !== "object") throw new Error(`context engine "${engineId}" assemble() returned an invalid result: expected an object with a "messages" array (got ${describeAssembleResultType(result)})`);
	const candidate = result;
	if (!Array.isArray(candidate.messages)) throw new Error(`context engine "${engineId}" assemble() returned an invalid result: expected an object with a "messages" array (got messages of type ${describeAssembleResultType(candidate.messages)})`);
	return result;
}
function describeAssembleResultType(value) {
	if (value === null) return "null";
	if (Array.isArray(value)) return "array";
	return typeof value;
}
/**
* Finalize a completed harness turn via afterTurn or ingest fallbacks.
*/
async function finalizeHarnessContextEngineTurn(params) {
	if (!params.contextEngine) return { postTurnFinalizationSucceeded: true };
	if (params.promptError || params.aborted || params.yieldAborted) return { postTurnFinalizationSucceeded: true };
	const conversationSnapshot = buildContextEngineConversationSnapshot({
		messagesSnapshot: params.messagesSnapshot,
		prePromptMessageCount: params.prePromptMessageCount
	});
	const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
	const runtimeContext = params.runtimeContext;
	let postTurnFinalizationSucceeded = true;
	if (typeof params.contextEngine.afterTurn === "function") try {
		await params.contextEngine.afterTurn({
			sessionId: params.sessionIdUsed,
			sessionKey: params.sessionKey,
			sessionTarget: params.sessionTarget,
			sessionFile: params.sessionFile,
			messages: conversationSnapshot.messages,
			prePromptMessageCount: conversationSnapshot.prePromptMessageCount,
			tokenBudget: params.tokenBudget,
			runtimeSettings,
			runtimeContext,
			isHeartbeat: params.isHeartbeat
		});
	} catch (afterTurnErr) {
		postTurnFinalizationSucceeded = false;
		params.warn(`context engine afterTurn failed: ${String(afterTurnErr)}`);
	}
	else {
		const newMessages = conversationSnapshot.messages.slice(conversationSnapshot.prePromptMessageCount);
		if (newMessages.length > 0) {
			if (typeof params.contextEngine.ingestBatch === "function") try {
				await params.contextEngine.ingestBatch({
					sessionId: params.sessionIdUsed,
					sessionKey: params.sessionKey,
					messages: newMessages,
					isHeartbeat: params.isHeartbeat
				});
			} catch (ingestErr) {
				postTurnFinalizationSucceeded = false;
				params.warn(`context engine ingest failed: ${String(ingestErr)}`);
			}
			else for (const msg of newMessages) try {
				await params.contextEngine.ingest?.({
					sessionId: params.sessionIdUsed,
					sessionKey: params.sessionKey,
					message: msg,
					isHeartbeat: params.isHeartbeat
				});
			} catch (ingestErr) {
				postTurnFinalizationSucceeded = false;
				params.warn(`context engine ingest failed: ${String(ingestErr)}`);
			}
		}
	}
	if (!params.promptError && !params.aborted && !params.yieldAborted && postTurnFinalizationSucceeded) await (params.runMaintenance ?? runHarnessContextEngineMaintenance)({
		contextEngine: params.contextEngine,
		sessionId: params.sessionIdUsed,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget,
		sessionFile: params.sessionFile,
		reason: "turn",
		sessionManager: params.sessionManager,
		runtimeContext,
		runtimeSettings,
		config: params.config
	});
	return { postTurnFinalizationSucceeded };
}
function buildContextEngineConversationSnapshot(params) {
	const prePromptMessages = stripRuntimeContextCustomMessages(params.messagesSnapshot.slice(0, params.prePromptMessageCount));
	const turnMessages = stripRuntimeContextCustomMessages(params.messagesSnapshot.slice(params.prePromptMessageCount));
	return {
		messages: [...prePromptMessages, ...turnMessages],
		prePromptMessageCount: prePromptMessages.length
	};
}
/**
* Run optional transcript maintenance for a harness-owned context engine.
*/
async function runHarnessContextEngineMaintenance(params) {
	const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
	return await runContextEngineMaintenance({
		contextEngine: params.contextEngine,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget,
		sessionFile: params.sessionFile,
		reason: params.reason,
		sessionManager: params.sessionManager,
		withSessionManagerRewriteLock: params.withSessionManagerRewriteLock,
		runtimeContext: params.runtimeContext,
		runtimeSettings,
		executionMode: params.executionMode,
		onDeferredMaintenance: params.onDeferredMaintenance,
		config: params.config
	});
}
/**
* Return true when a non-legacy context engine should affect plugin harness behavior.
*/
function isActiveHarnessContextEngine(contextEngine) {
	return Boolean(contextEngine && contextEngine.info.id !== "legacy");
}
//#endregion
export { runHarnessContextEngineMaintenance as a, buildContextEngineRuntimeSettings as c, isActiveHarnessContextEngine as i, bootstrapHarnessContextEngine as n, awaitAgentEndSideEffects as o, finalizeHarnessContextEngineTurn as r, runAgentEndSideEffects as s, assembleHarnessContextEngine as t };
