import { h as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { a as runInDetachedAsyncContext } from "./async-work-scope-CWk2dk1h.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { i as markOpenClawExecEnv } from "./openclaw-exec-env-Cc7ECPuD.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, O as listAgentIds, a as resolveAgentDir, b as tryResolveAmbientOwnerAgentId, l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey, _ as toAgentStoreSessionKey, l as resolveAgentIdFromSessionKey, u as resolveEventSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { i as tryGetLegacyDefaultAgentId, n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { Q as compileSafeRegex, b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { n as formatErrorMessageWithCode, t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as getResolvedLoggerSettings, l as toPinoLikeLogger, r as getChildLogger } from "./logger--ALOusOG.mjs";
import { o as isSilentReplyText } from "./tokens-BTKQYTUd.mjs";
import { t as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-q9v1M311.mjs";
import { r as WorkerTaskError, t as WorkerTaskPool } from "./worker-task-pool-cppt7dT0.mjs";
import { o as PluginInstanceUnavailableError } from "./plugin-generation-artifact-VyjUi6ei.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-B7redWCL.mjs";
import { C as runWithGatewayIndependentRootWorkContinuation, S as runWithGatewayIndependentRootWorkAdmission, c as getGatewaySuspendAdmissionPhase } from "./gateway-work-admission-CHv_0noy.mjs";
import { d as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-BwOPQ1t_.mjs";
import { i as capturePluginLifecycleAuthority } from "./registry-lifecycle-xdpzLZzd.mjs";
import { m as mergeSsrFPolicies, t as SsrFBlockedError } from "./ssrf-BQRtcdBp.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { d as readAgentDatabaseAdmissionRefusal, n as assertAgentDatabaseAdmitted } from "./agent-database-admission-BFwcs62N.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DVMYGogL.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-tOGjxVvH.mjs";
import { l as rewrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-Ub1aezaD.mjs";
import { m as requestSessionEventWakeAndWait, p as requestSessionEventWake } from "./heartbeat-wake-bWS25cgK.mjs";
import { s as withSystemEventOwner } from "./system-event-ownership-CHVGbaAW.mjs";
import { c as resolveSystemMainSessionTarget, n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import { o as enqueueSystemEventWithReceipt } from "./system-events-ANKIkU0W.mjs";
import "./logging-CrcvifP_.mjs";
import { t as ensureAgentWorkspace } from "./workspace-mlzi3k1x.mjs";
import { n as loadAgentRuntimePluginRegistryHandle } from "./runtime-plugins-VTbllcVQ.mjs";
import { l as loadPreparedInboundPluginRegistry } from "./prepared-model-runtime.facts-_kekUcCq.mjs";
import { c as resolveCronStreamBatching, l as truncateCronStreamBatch, o as cronStreamScheduleKey, s as markCronStreamBatchTruncated } from "./normalize-_k1oAXPq.mjs";
import { s as resolveCronScheduledToolPolicy } from "./scheduled-tool-policy-pqnwO5x1.mjs";
import { a as resolveCronDeliverySessionKey, o as resolveCronNotificationSessionKey, s as resolveCronSessionTargetSessionKey } from "./session-target-DJsUULzX.mjs";
import { a as isAgentDeletionBlocked } from "./agent-lifecycle-registry-D47RUurT.mjs";
import { f as listConfiguredSessionStoreAgentIds, n as listKnownSessionStoreAgentIds } from "./targets-Dmb8-YXN.mjs";
import { o as resolveUserTimezone } from "./date-time-CaOYkXPL.mjs";
import { a as createOperationalRunInstanceRef, c as prepareAgentRunAdmission, f as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-BNasoszr.mjs";
import { n as resolveCronJobsStorePathFromConfig } from "./paths-Bz2goYfd.mjs";
import "./store-CV1wrdMb.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { n as createAdmittedGatewayToolCallerIdentity, o as withGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { t as abortAndDrainEmbeddedAgentRun } from "./runs-ciDkXIOQ.mjs";
import { s as waitForActiveCronTaskRuns, t as abortActiveCronTaskRuns } from "./active-run-cancellation-BIgTNPfC.mjs";
import { t as getProcessSupervisor } from "./supervisor-Dye57EtO.mjs";
import "./sessions-Cesa3L0p.mjs";
import { t as beginLifecycleWriteCustody } from "./lifecycle-write-custody-Y0-8ADx0.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-CYRu5kQ6.mjs";
import { t as buildOutboundSessionContext } from "./session-context-B-tubEEv.mjs";
import { t as bindAgentToolSourceExecutionGuard } from "./agent-tool-source-execution-guard-CEFulHpI.mjs";
import { n as sendDurableMessageBatchCore, t as durableMessageBatchMayHaveReachedRecipient } from "./send-BI-ZW_ne.mjs";
import { n as truncateUtf16WithEllipsis } from "./text-truncate-DrDnz8rI.mjs";
import "./runtime-CT_qLH6Y.mjs";
import { t as resolveControlUiAutomationRunUrl } from "./control-ui-link-base-CQdQgsxo.mjs";
import "./agent-bundle-mcp-tools-Bu8LOH7I.mjs";
import { r as resolveMainScopedEventSessionKey } from "./event-session-routing-Dc7D6ZvV.mjs";
import { G as invalidateSessionAutomationIndex, K as registerSessionAutomationSource, W as claimSessionAutomationEpoch, Y as resolveCronJobBoundSessionKeys, q as unregisterSessionAutomationSource } from "./session-row-prepared-read-BZIZR-6Q.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-Cl5l5Sfo.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.mjs";
import { r as formatZonedTimestamp } from "./format-datetime-CSLJIAzN.mjs";
import { n as resolveScheduledToolPolicyContext } from "./scheduled-tool-policy-DRmktKAO.mjs";
import { b as registerHeadlessToolSearchCatalog, h as clearToolSearchCatalog, v as createToolSearchCatalogRef } from "./local-model-lean-CR_fxacF.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-Bd-leLaO.mjs";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-NJJr9z6k.mjs";
import { n as resolveSandboxContext } from "./context-Csq-w9NQ.mjs";
import "./sandbox-wz8zRGj4.mjs";
import { n as wrapToolWithAbortSignal } from "./agent-tools.abort-g8BtZl1O.mjs";
import { n as resolveCronStoredDeliveryContext } from "./cron-tool-lEtpV7qs.mjs";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BqkZLKq3.mjs";
import { r as resolveEmbeddedAttemptToolConstructionPlan, t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-DN-5OrUy.mjs";
import { a as resolveHeartbeatForWake, s as resolveHeartbeatTimeoutOverrideSeconds } from "./heartbeat-config-BvP-hlUW.mjs";
import { a as runCodeModeScriptHeadless, i as createHeadlessDeadlineScope } from "./tool-surface-bridge-DCUFbyYe.mjs";
import { t as createOpenClawCodingTools } from "./agent-tools-Dp5LthCP.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-CHx7Z_89.mjs";
import { n as listConfiguredMessageChannels } from "./channel-selection-DMoOHJCh.mjs";
import { n as CodeModeHeadlessTimeoutError, t as CodeModeHeadlessAbortError } from "./code-mode-errors-C6Ok9ljJ.mjs";
import "./embedded-agent-mYH3aiyf.mjs";
import { n as resolveAgentOutboundIdentity } from "./identity-081bUT3P.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-DOTLPxsJ.mjs";
import { n as cronScriptFailureMetadata, t as CronService } from "./service-DqDFGGs1.mjs";
import { i as errorBackoffMs } from "./jobs-scheduling-BuJ7Yxlw.mjs";
import { n as resolveCronTriggerMinIntervalMs } from "./cron-limits-txevLFpr.mjs";
import { n as resolveCronJobEffectiveAgentId } from "./agent-id-DfuNKDxM.mjs";
import { t as toPublicCronJob } from "./public-job-C0Jx9vVK.mjs";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-D6XdUIQv.mjs";
import { n as applyJobPatch } from "./jobs-D5vlGRHs.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { n as fenceScheduledGatewayContextResolver, t as createScheduledGatewayRunner } from "./scheduled-run-gateway-context-CudRX7U4.mjs";
import { r as isScheduledBackupCommand } from "./backup-command-IVzAG_2T.mjs";
import { a as partitionSystemMonitors, r as reconcileHeartbeatMonitorJobs } from "./heartbeat-monitor-DeyMpz2R.mjs";
import { t as runCronIsolatedAgentTurn } from "./isolated-agent-DGXf0dLZ.mjs";
import { n as resolveCronAgentConfig, t as resolveCronActiveRuntimeConfig } from "./run-config-2R_31zmM.mjs";
import { r as resolveDeliveryTarget } from "./delivery-target-BqsIyBBC.mjs";
import { p as retryTransientDirectCronDelivery } from "./delivery-dispatch-policy-C5m885n_.mjs";
import { n as skillCollectionReviewMonitorAgentId, t as resolveSkillCollectionReviewMonitorSpecs } from "./skill-collection-review-monitor-BRAM7bxZ.mjs";
import fs from "node:fs/promises";
import { setImmediate } from "node:timers/promises";
import crypto from "node:crypto";
//#region src/cron/command-output-summary.ts
const MAX_PRESERVED_ACTION_LINES = 12;
const ACTION_LINE_PATTERNS = [
	/\b(device|user|verification|authorization|auth|login)\s+code\b/i,
	/\benter\s+(?:the\s+)?(?:code|verification code|device code)\b/i,
	/\bcopy\s+(?:this\s+)?code\b/i,
	/\bvisit\s+(?:https?:\/\/|www\.)/i,
	/\bopen\s+(?:https?:\/\/|www\.)/i,
	/\bbrowser\s+(?:to|at)\s+(?:https?:\/\/|www\.)/i,
	/\blog(?:\s|-)?in\s+(?:at|to|with)\b/i,
	/\bauth(?:enticate|orize)\s+(?:at|with|using)\b/i,
	/\bhttps?:\/\/[^\s]+\/(?:device|activate|login|oauth|authorize|auth)\b/i
];
const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/gi;
const CODE_PATTERN = /\b[A-Z0-9]{4}(?:[- ][A-Z0-9]{3,8}){1,4}\b/g;
const UNSEPARATED_CODE_PATTERN = /\b[A-Z0-9]{6,12}\b/g;
const SECRET_ASSIGNMENT_PATTERN = /\b((?:access|refresh)[_-]?token|api[_-]?key|token|password|secret)\s*([:=])\s*([^\s;&]+)/gi;
function isCronCommandActionCriticalLine(line) {
	const normalized = normalizeOptionalString(line);
	return Boolean(normalized && ACTION_LINE_PATTERNS.some((pattern) => pattern.test(normalized)));
}
function normalizeLines(lines) {
	const result = [];
	for (const line of lines ?? []) {
		const normalized = normalizeOptionalString(line);
		if (normalized && !result.includes(normalized)) result.push(normalized);
		if (result.length >= MAX_PRESERVED_ACTION_LINES) break;
	}
	return result;
}
function buildCronCommandSummary(params) {
	const stdout = normalizeOptionalString(params.stdout);
	const stderr = normalizeOptionalString(params.stderr);
	const tail = stdout && stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout ?? stderr;
	const preserved = [...normalizeLines(params.preservedStdoutLines), ...normalizeLines(params.preservedStderrLines)];
	if (preserved.length === 0) return tail;
	const missing = new Set(preserved);
	for (const line of tail?.split(/\r?\n/) ?? []) {
		const normalized = line.trim();
		if (preserved.includes(normalized)) {
			missing.delete(normalized);
			if (missing.size === 0) return tail;
		}
	}
	const actionBlock = `action-required output preserved:\n${preserved.filter((line) => missing.has(line)).join("\n")}`;
	return tail ? `${actionBlock}\n\n${tail}` : actionBlock;
}
function cronCommandSummaryNeedsExternalRedaction(summary) {
	if (!summary) return false;
	return summary.split(/\r?\n/).some((line) => line.startsWith("action-required output preserved:") || isCronCommandActionCriticalLine(line));
}
function redactCronCommandSummaryForExternalDelivery(summary) {
	if (!summary || !cronCommandSummaryNeedsExternalRedaction(summary)) return summary;
	return summary.split(/(\r?\n)/).map((part) => {
		if (/^\r?\n$/.test(part) || !isCronCommandActionCriticalLine(part)) return part;
		return redactToolPayloadText(part).replace(SECRET_ASSIGNMENT_PATTERN, (_match, key, separator) => {
			return `${key}${separator}***`;
		}).replace(URL_PATTERN, "[redacted-url]").replace(CODE_PATTERN, "[redacted-code]").replace(UNSEPARATED_CODE_PATTERN, "[redacted-code]");
	}).join("");
}
//#endregion
//#region src/cron/command-runner.ts
const DEFAULT_COMMAND_TIMEOUT_MS = 6e5;
const EFFECTIVELY_UNBOUNDED_TIMEOUT_MS = 2147483647;
function secondsToMs(value) {
	if (typeof value !== "number") return;
	if (value <= 0) return EFFECTIVELY_UNBOUNDED_TIMEOUT_MS;
	return finiteSecondsToTimerSafeMilliseconds(value) ?? void 0;
}
function formatCommand(argv) {
	return argv.map((arg) => JSON.stringify(arg)).join(" ");
}
function commandErrorMessage(params) {
	if (params.termination === "timeout") return "command timed out";
	if (params.termination === "no-output-timeout") return "command produced no output before noOutputTimeoutSeconds";
	if (params.termination === "signal") return params.signal ? `command stopped by signal ${params.signal}` : "command stopped";
	if (typeof params.code === "number") return `command exited with code ${params.code}`;
	return "command failed";
}
function buildDiagnostics(params) {
	const truncated = Boolean(params.stdoutTruncatedBytes && params.stdoutTruncatedBytes > 0) || Boolean(params.stderrTruncatedBytes && params.stderrTruncatedBytes > 0);
	return {
		...params.summary ? { summary: params.summary } : {},
		entries: [{
			ts: params.nowMs(),
			source: "exec",
			severity: params.status === "ok" ? "info" : "error",
			message: params.summary ? `command ${params.status}: ${params.command}` : `command ${params.status} with no output: ${params.command}`,
			exitCode: params.code,
			truncated,
			...params.signal ? { toolName: `signal:${params.signal}` } : {}
		}]
	};
}
/** Executes a cron command payload without starting an agent/model run. */
async function runCronCommandJob(params) {
	const nowMs = params.nowMs ?? Date.now;
	const { payload } = params.job;
	if (payload.kind !== "command") return {
		status: "skipped",
		error: "command runner requires payload.kind=\"command\""
	};
	if (!Array.isArray(payload.argv) || payload.argv.length === 0) return {
		status: "skipped",
		error: "command payload requires non-empty \"argv\""
	};
	const command = formatCommand(payload.argv);
	const noOutputTimeoutMs = secondsToMs(payload.noOutputTimeoutSeconds);
	const releaseCustody = isScheduledBackupCommand(params.job) ? beginLifecycleWriteCustody("backup") : void 0;
	let failure;
	try {
		const result = await withCommandProcessScope(() => runCommandWithTimeout(payload.argv, {
			timeoutMs: secondsToMs(payload.timeoutSeconds) ?? DEFAULT_COMMAND_TIMEOUT_MS,
			...payload.cwd ? { cwd: payload.cwd } : {},
			...payload.input !== void 0 ? { input: payload.input } : {},
			...payload.env ? { env: payload.env } : {},
			...noOutputTimeoutMs !== void 0 ? { noOutputTimeoutMs } : {},
			...payload.outputMaxBytes !== void 0 ? { maxOutputBytes: payload.outputMaxBytes } : {},
			preserveOutputLine: isCronCommandActionCriticalLine,
			...params.abortSignal ? { signal: params.abortSignal } : {},
			killProcessTree: true
		}));
		const termination = result.termination === "signal" && params.abortSignal?.reason instanceof Error && params.abortSignal.reason.name === "TimeoutError" ? "timeout" : result.termination;
		const ok = result.code === 0 && !result.killed && termination !== "timeout" && termination !== "no-output-timeout" && termination !== "signal";
		const status = ok ? "ok" : "error";
		const summary = buildCronCommandSummary({
			stdout: result.stdout,
			stderr: result.stderr,
			preservedStdoutLines: result.preservedStdoutLines,
			preservedStderrLines: result.preservedStderrLines
		});
		const error = ok ? void 0 : commandErrorMessage({
			code: result.code,
			signal: result.signal,
			termination
		});
		const failureNotificationDetail = termination === "timeout" ? {
			kind: "command-timeout",
			mode: "wall-clock"
		} : termination === "no-output-timeout" ? {
			kind: "command-timeout",
			mode: "no-output"
		} : termination === "exit" && typeof result.code === "number" && result.code !== 0 ? {
			kind: "command-exit",
			exitCode: result.code
		} : void 0;
		return {
			status,
			...error ? { error } : {},
			...failureNotificationDetail ? {
				failureNotificationDetail,
				errorClassification: failureNotificationDetail.kind === "command-timeout" ? {
					kind: "reason",
					reason: "timeout"
				} : { kind: "permanent" }
			} : {},
			...summary ? { summary } : {},
			diagnostics: buildDiagnostics({
				command,
				status,
				summary,
				code: result.code,
				signal: result.signal,
				stdoutTruncatedBytes: result.stdoutTruncatedBytes,
				stderrTruncatedBytes: result.stderrTruncatedBytes,
				nowMs
			})
		};
	} catch (err) {
		failure = err;
		const error = err instanceof Error ? err.message : String(err);
		return {
			status: "error",
			error,
			...err instanceof Error && "code" in err && err.code === "ENOENT" ? { errorClassification: { kind: "permanent" } } : {},
			diagnostics: {
				summary: error,
				entries: [{
					ts: nowMs(),
					source: "exec",
					severity: "error",
					message: `command failed to start: ${command}: ${error}`,
					exitCode: null
				}]
			}
		};
	} finally {
		releaseCustody?.(failure);
	}
}
//#endregion
//#region src/cron/delivery.ts
async function resolveCronAnnounceDelivery(params) {
	const targetResolutionOptions = params.target.inheritSessionThread === false ? { inheritSessionThread: false } : void 0;
	const resolvedTarget = await resolveDeliveryTarget(params.cfg, params.agentId, {
		channel: params.target.channel,
		to: params.target.to,
		threadId: params.target.threadId,
		accountId: params.target.accountId,
		sessionKey: params.target.sessionKey
	}, targetResolutionOptions);
	if (!resolvedTarget.ok) return {
		ok: false,
		error: resolvedTarget.error
	};
	const identity = resolveAgentOutboundIdentity(params.cfg, params.agentId);
	return {
		ok: true,
		resolvedTarget,
		session: buildOutboundSessionContext({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: resolveCronNotificationSessionKey({
				jobId: params.jobId,
				sessionKey: params.target.sessionKey
			})
		}),
		identity
	};
}
/** Sends a cron announce payload and throws if target resolution or delivery fails. */
async function sendCronAnnouncePayloadStrict(params) {
	const delivery = await resolveCronAnnounceDelivery(params);
	if (!delivery.ok) throw delivery.error;
	params.abortSignal.throwIfAborted();
	let recipientReached = false;
	const send = await sendDurableMessageBatchCore({
		cfg: params.cfg,
		channel: delivery.resolvedTarget.channel,
		to: delivery.resolvedTarget.to,
		accountId: delivery.resolvedTarget.accountId,
		threadId: delivery.resolvedTarget.threadId,
		payloads: [params.payload],
		session: delivery.session,
		identity: delivery.identity,
		bestEffort: false,
		deps: createOutboundSendDeps(params.deps),
		signal: params.abortSignal,
		onDeliveryResult: () => {
			if (!recipientReached) {
				recipientReached = true;
				params.onDeliveryAttempt?.(true);
			}
		}
	});
	if (!recipientReached) params.onDeliveryAttempt?.(durableMessageBatchMayHaveReachedRecipient(send));
	if (send.status === "failed" || send.status === "partial_failed") throw send.error;
	return send;
}
//#endregion
//#region src/cron/trigger-script-result.ts
const MAX_TRIGGER_STATE_BYTES = 16384;
function scriptResultCandidate(result, condition = false) {
	if (isRecord(result.value) && (!condition || typeof result.value.fire === "boolean")) return result.value;
	for (let index = result.output.length - 1; index >= 0; index -= 1) {
		const entry = result.output[index];
		if (isRecord(entry) && entry.type === "json") return entry.value;
	}
}
function scriptFailure(error, code = "internal_error") {
	return {
		kind: "error",
		code,
		error
	};
}
function parseTriggerResult(result) {
	const candidate = scriptResultCandidate(result, true);
	if (!isRecord(candidate) || typeof candidate.fire !== "boolean") return scriptFailure("cron trigger script must return an object with boolean fire");
	if (candidate.message !== void 0 && typeof candidate.message !== "string") return scriptFailure("cron trigger script message must be a string");
	const state = validateCronState(candidate, "cron trigger");
	if (!state.ok) return scriptFailure(state.error, state.code);
	return {
		kind: "evaluated",
		fire: candidate.fire,
		...typeof candidate.message === "string" ? { message: candidate.message } : {},
		...state.stateChanged ? { state: state.state } : {}
	};
}
function validateCronState(candidate, label) {
	if (!Object.hasOwn(candidate, "state")) return {
		ok: true,
		stateChanged: false
	};
	let serialized;
	try {
		serialized = JSON.stringify(candidate.state);
	} catch (error) {
		return {
			ok: false,
			code: "internal_error",
			error: `${label} state is not JSON-serializable: ${formatErrorMessageWithCode(error)}`
		};
	}
	if (serialized === void 0) return {
		ok: false,
		code: "internal_error",
		error: `${label} state is not JSON-serializable`
	};
	if (Buffer.byteLength(serialized, "utf8") > MAX_TRIGGER_STATE_BYTES) return {
		ok: false,
		code: "output_limit_exceeded",
		error: `${label} state exceeds the 16KB limit`
	};
	return {
		ok: true,
		stateChanged: true,
		state: JSON.parse(serialized)
	};
}
function parseScriptPayloadResult(result) {
	const candidate = scriptResultCandidate(result);
	if (!isRecord(candidate)) return scriptFailure("cron script payload must return an object");
	if (candidate.notify !== void 0 && typeof candidate.notify !== "string") return scriptFailure("cron script payload notify must be a string");
	if (candidate.wake !== void 0 && candidate.wake !== "now" && candidate.wake !== "next-heartbeat") return scriptFailure("cron script payload wake must be \"now\" or \"next-heartbeat\"");
	let nextCheck;
	if (candidate.nextCheck !== void 0) {
		if (typeof candidate.nextCheck !== "string") return scriptFailure("cron script payload nextCheck must be a duration string");
		try {
			const delayMs = parseDurationMs(candidate.nextCheck);
			if (delayMs <= 0) throw new Error("duration must be positive");
			nextCheck = { delayMs };
		} catch {
			return scriptFailure("cron script payload nextCheck must be a positive duration");
		}
	}
	const state = validateCronState(candidate, "cron script payload");
	if (!state.ok) return scriptFailure(state.error, state.code);
	return {
		kind: "completed",
		...candidate.notify !== void 0 ? { notify: candidate.notify } : {},
		...candidate.wake !== void 0 ? { wake: candidate.wake } : {},
		stateChanged: state.stateChanged,
		...state.stateChanged ? { state: state.state } : {},
		...nextCheck ? { nextCheck } : {}
	};
}
//#endregion
//#region src/cron/trigger-script.ts
const MAX_CONCURRENT_TRIGGER_EVALS = 3;
const MAX_CACHED_TRIGGER_RUNTIMES = 128;
const HEADLESS_TRIGGER_WALL_CLOCK_MS = 3e4;
const HEADLESS_TRIGGER_TOOL_BUDGET = 5;
let activeTriggerEvaluations = 0;
function resolveTriggerAgentId(config, agentId) {
	return agentId?.trim() ? normalizeAgentId(agentId) : resolveDefaultAgentId(config);
}
async function prepareTriggerRuntime(params, loadPluginRegistry = loadAgentRuntimePluginRegistryHandle) {
	params.signal?.throwIfAborted();
	const agentId = resolveTriggerAgentId(params.runtimeConfig, params.agentId);
	const selectedAgentConfig = resolveAgentConfig(params.runtimeConfig, agentId);
	const agentConfigOverride = params.agentId?.trim() ? selectedAgentConfig : void 0;
	const { agentDefaults, cfgWithAgentDefaults: config } = resolveCronAgentConfig({
		config: params.runtimeConfig,
		agentConfigOverride
	});
	const workspaceDirRaw = resolveAgentWorkspaceDir(config, agentId);
	const agentDir = resolveAgentDir(config, agentId);
	const { resolveAcpAgentWorkspaceProvisioningForTurn } = await import("./acp-workspace-provisioning-Bsq5Ij-T.mjs");
	const workspaceProvisioning = await resolveAcpAgentWorkspaceProvisioningForTurn({
		cfg: config,
		agentId,
		workspaceDir: workspaceDirRaw
	});
	const workspace = await ensureAgentWorkspace({
		dir: workspaceDirRaw,
		ensureBootstrapFiles: !agentDefaults.skipBootstrap,
		skipOptionalBootstrapFiles: agentDefaults.skipOptionalBootstrapFiles,
		provisioning: workspaceProvisioning
	});
	params.signal?.throwIfAborted();
	const workspaceDir = workspace.dir;
	const pluginRegistry = loadPluginRegistry({
		config,
		workspaceDir,
		allowGatewaySubagentBinding: true
	});
	const prepare = async () => {
		const rawSessionKey = `cron:${params.jobId}:trigger`;
		const sessionKey = resolveCronAgentSessionKey({
			sessionKey: rawSessionKey,
			agentId,
			mainKey: config.session?.mainKey,
			cfg: config
		});
		const sandbox = await resolveSandboxContext({
			config,
			sessionKey,
			workspaceDir
		});
		params.signal?.throwIfAborted();
		const effectiveWorkspace = sandbox?.enabled && sandbox.workspaceAccess !== "rw" ? sandbox.workspaceDir : workspaceDir;
		const toolPlan = resolveEmbeddedAttemptToolConstructionPlan({
			toolsEnabled: true,
			toolsAllow: params.toolsAllow
		});
		const createTools = (admitted, signal) => {
			const allTools = toolPlan.constructTools ? createOpenClawCodingTools({
				agentId,
				runId: admitted.operationalRunInstance.runId,
				operationalRunInstance: admitted.operationalRunInstance,
				abortSignal: signal,
				exec: { config },
				sandbox,
				sessionKey,
				trigger: "cron",
				jobId: params.jobId,
				agentDir,
				cwd: effectiveWorkspace,
				workspaceDir: effectiveWorkspace,
				spawnWorkspaceDir: workspaceDir,
				config,
				allowGatewaySubagentBinding: true,
				includeCoreTools: toolPlan.includeCoreTools,
				runtimeToolAllowlist: toolPlan.runtimeToolAllowlist,
				inheritRuntimeToolAllowlist: Boolean(toolPlan.runtimeToolAllowlist),
				scheduledToolPolicy: resolveScheduledToolPolicyContext({
					toolsAllow: params.toolsAllow,
					scheduledToolPolicy: params.scheduledToolPolicy,
					execTarget: params.execTarget
				}),
				toolConstructionPlan: toolPlan.codingToolConstructionPlan
			}) : [];
			return applyEmbeddedAttemptToolsAllow(allTools, params.toolsAllow, { toolMeta: (tool) => getPluginToolMeta(tool) });
		};
		return {
			createTools,
			context: {
				agentId,
				config,
				cwd: effectiveWorkspace,
				workspaceDir: effectiveWorkspace,
				sessionKey,
				loopDetection: resolveToolLoopDetectionConfig({
					cfg: config,
					agentId
				})
			},
			...pluginRegistry ? { pluginRegistry } : {}
		};
	};
	return await withPluginRuntimeRegistryScope(pluginRegistry, prepare);
}
function triggerStateNamespace(state, streamBatch) {
	const entries = [["state", {
		kind: "value",
		value: state
	}]];
	if (streamBatch !== void 0) entries.push(["streamBatch", {
		kind: "value",
		value: streamBatch
	}]);
	return {
		id: "cron:trigger",
		globalName: "trigger",
		scope: {
			kind: "object",
			entries
		}
	};
}
function createCronCodeModeRunner(deps) {
	const runHeadless = deps.runHeadless ?? runCodeModeScriptHeadless;
	const prepareRuntime = deps.prepareRuntime ?? ((params) => prepareTriggerRuntime(params, deps.loadPluginRegistry));
	const runtimeCache = /* @__PURE__ */ new Map();
	const resolveCachedRuntime = async (request, scope) => {
		const agentId = resolveTriggerAgentId(request.runtimeConfig, request.agentId);
		const toolsAllowKey = JSON.stringify([
			request.toolsAllow ?? null,
			request.scheduledToolPolicy ?? null,
			request.execTarget ?? null
		]);
		const cached = runtimeCache.get(request.jobId);
		if (cached && cached.configEpoch === request.runtimeConfig && cached.agentId === agentId && cached.toolsAllowKey === toolsAllowKey) {
			runtimeCache.delete(request.jobId);
			runtimeCache.set(request.jobId, cached);
			try {
				return await scope.wait(cached.promise);
			} catch (error) {
				if ((error instanceof CodeModeHeadlessAbortError || error instanceof CodeModeHeadlessTimeoutError) && !scope.signal.aborted) {
					if (runtimeCache.get(request.jobId) === cached) runtimeCache.delete(request.jobId);
					return await resolveCachedRuntime(request, scope);
				}
				throw error;
			}
		}
		const promise = prepareRuntime({
			...request,
			signal: scope.signal
		}).then((runtime) => ({
			...runtime,
			isCurrent: runtime.pluginRegistry ? capturePluginLifecycleAuthority(runtime.pluginRegistry, void 0, { scopedRuntime: true }) ?? (() => false) : () => true,
			invalidate: () => {
				if (runtimeCache.get(request.jobId) === entry) runtimeCache.delete(request.jobId);
			}
		}));
		const entry = {
			promise,
			configEpoch: request.runtimeConfig,
			agentId,
			toolsAllowKey
		};
		runtimeCache.delete(request.jobId);
		runtimeCache.set(request.jobId, entry);
		pruneMapToMaxSize(runtimeCache, MAX_CACHED_TRIGGER_RUNTIMES);
		promise.catch(() => {
			if (runtimeCache.get(request.jobId) === entry) runtimeCache.delete(request.jobId);
		});
		return await scope.wait(entry.promise);
	};
	return async function runCronCodeModeScript(params) {
		const evaluationScope = createHeadlessDeadlineScope(params.abortSignal, params.wallClockMs, params.label);
		const catalogRef = createToolSearchCatalogRef();
		let admission;
		try {
			const request = {
				runtimeConfig: resolveCronActiveRuntimeConfig(deps.config),
				jobId: params.job.id,
				agentId: params.job.agentId,
				toolsAllow: params.job.payload.toolsAllow,
				scheduledToolPolicy: resolveCronScheduledToolPolicy({
					toolsAllow: params.job.payload.toolsAllow,
					scheduledToolPolicy: params.job.scheduledToolPolicy,
					owner: params.job.owner
				}),
				execTarget: params.job.toolsAllowExecTarget
			};
			const runId = `cron-trigger:${params.job.id}:${crypto.randomUUID()}`;
			let runtime;
			let tools;
			let admitted;
			let assertAdmitted;
			let caller;
			function assertActive() {
				if (!assertAdmitted || !caller || caller.gatewayContextResolver && !caller.gatewayContextResolver()) throw new Error("cron script invocation is no longer active");
				assertAdmitted();
			}
			for (let refresh = 0;; refresh += 1) try {
				runtime = await resolveCachedRuntime(request, evaluationScope);
				if (!runtime.isCurrent()) throw new PluginInstanceUnavailableError();
				if (!admitted) {
					admission = prepareAgentRunAdmission({
						cfg: runtime.context.config,
						operationalRunInstance: createOperationalRunInstanceRef(runId),
						facts: {
							runId,
							agentId: runtime.context.agentId,
							ingress: params.executionIdentity?.ingress ?? {
								kind: "schedule",
								boundary: "cron.script",
								state: "present"
							},
							...params.executionIdentity?.invoker ? { invoker: params.executionIdentity.invoker } : {}
						}
					});
					admitted = await admission.admit("gateway");
					bindGatewayContextResolver(admitted, deps.resolveGatewayContext);
					await params.executionIdentity?.onPostAdmission?.(admitted);
					assertAdmitted = resolveAdmittedRunActiveAssertion(admitted, evaluationScope.signal);
					caller = createAdmittedGatewayToolCallerIdentity({
						admittedRunContext: admitted,
						agentId: runtime.context.agentId,
						sessionKey: runtime.context.sessionKey,
						receiptAuthority: assertActive,
						approvalSignals: [evaluationScope.signal]
					});
				}
				assertActive();
				if (!runtime.isCurrent()) throw new PluginInstanceUnavailableError();
				const selected = runtime;
				const authority = admitted;
				tools = withPluginRuntimeRegistryScope(selected.pluginRegistry, () => selected.createTools(authority, evaluationScope.signal));
				if (!runtime.isCurrent()) throw new PluginInstanceUnavailableError();
				break;
			} catch (error) {
				if (error instanceof CodeModeHeadlessAbortError || error instanceof CodeModeHeadlessTimeoutError || evaluationScope.signal.aborted) throw error;
				if (refresh > 0) {
					runtime?.invalidate();
					return scriptFailure(`Plugin tool refresh failed before the script started: ${formatErrorMessageWithCode(error)}`, "plugin_reload_failed");
				}
				if (!(error instanceof PluginInstanceUnavailableError)) throw error;
				runtime?.invalidate();
			}
			const ctx = {
				...runtime.context,
				runtimeConfig: runtime.context.config,
				runId,
				catalogRef,
				abortSignal: evaluationScope.signal,
				executeTool: (call) => withGatewayToolCallerIdentity(caller, async () => {
					assertActive();
					const result = await wrapToolWithAbortSignal(rewrapToolWithBeforeToolCallHook(bindAgentToolSourceExecutionGuard(call.tool, assertActive)), evaluationScope.signal).execute(call.toolCallId, call.input, call.signal, call.onUpdate);
					assertActive();
					return await call.acceptResultBeforeProjection(result);
				})
			};
			const selectedRuntime = runtime;
			return await withPluginRuntimeRegistryScope(selectedRuntime.pluginRegistry, async () => {
				assertActive();
				registerHeadlessToolSearchCatalog({
					catalogRef,
					tools,
					hookContext: {
						...selectedRuntime.context,
						runId
					}
				});
				const remainingWallClockMs = Math.ceil(evaluationScope.deadline - performance.now());
				if (remainingWallClockMs <= 0) throw new CodeModeHeadlessTimeoutError(`${params.label} timed out`);
				await params.onExecutionStarted?.();
				assertActive();
				const result = await runHeadless({
					ctx,
					code: params.script,
					wallClockMs: remainingWallClockMs,
					maxToolCalls: params.maxToolCalls,
					extraNamespaces: [triggerStateNamespace(params.state, params.streamBatch)],
					signal: evaluationScope.signal
				});
				if (result.status === "failed") return scriptFailure(result.error, result.code);
				assertActive();
				return {
					kind: "completed",
					result
				};
			});
		} catch (error) {
			return scriptFailure(formatErrorMessageWithCode(error), error instanceof CodeModeHeadlessTimeoutError ? "timeout" : error instanceof CodeModeHeadlessAbortError ? "aborted" : "internal_error");
		} finally {
			admission?.close();
			clearToolSearchCatalog({ catalogRef });
			evaluationScope.cleanup();
		}
	};
}
function createCronScriptRuntime(deps) {
	const run = createCronCodeModeRunner(deps);
	return {
		evaluateTrigger: async (params) => {
			if (activeTriggerEvaluations >= MAX_CONCURRENT_TRIGGER_EVALS) return { kind: "busy" };
			activeTriggerEvaluations += 1;
			try {
				const outcome = await run({
					...params,
					wallClockMs: HEADLESS_TRIGGER_WALL_CLOCK_MS,
					maxToolCalls: HEADLESS_TRIGGER_TOOL_BUDGET,
					label: "cron trigger evaluation"
				});
				return outcome.kind === "completed" ? parseTriggerResult(outcome.result) : outcome;
			} finally {
				activeTriggerEvaluations -= 1;
			}
		},
		executePayload: async (params) => {
			const payload = params.job.payload;
			if (payload.kind !== "script") return scriptFailure("cron script payload executor is unavailable", "runtime_unavailable");
			const timeoutSeconds = Math.min(900, Math.max(1, Math.floor(payload.timeoutSeconds ?? 300)));
			const toolBudget = Math.min(200, Math.max(1, Math.floor(payload.toolBudget ?? 50)));
			const outcome = await run({
				...params,
				script: payload.script,
				state: params.job.state.triggerState,
				wallClockMs: timeoutSeconds * 1e3,
				maxToolCalls: toolBudget,
				label: "cron script payload",
				onExecutionStarted: params.executionIdentity?.onExecutionStarted
			});
			return outcome.kind === "completed" ? parseScriptPayloadResult(outcome.result) : outcome;
		}
	};
}
//#endregion
//#region src/gateway/cron-exit-watch-shell.ts
/** Resolve the native shell used for watched commands on each gateway platform. */
function resolveExitWatchShell(platform = process.platform) {
	if (platform === "win32") return {
		command: process.env.ComSpec?.trim() || "cmd.exe",
		argsFor: (command) => [
			"/d",
			"/s",
			"/c",
			command
		]
	};
	return {
		command: "bash",
		argsFor: (command) => ["-lc", command]
	};
}
//#endregion
//#region src/gateway/cron-exit-watchers.ts
/**
* Safety bound for a watched command, so a hung/never-exiting command cannot
* keep a gateway-owned process alive forever. Generous (24h) because on-exit
* legitimately watches long-running commands (builds, deploys); on timeout the
* watch ends and the job fires like any other exit.
*/
const ON_EXIT_WATCH_TIMEOUT_MS = 864e5;
const ON_EXIT_WATCH_RETRY_BACKOFF_MS = [
	1e3,
	5e3,
	3e4,
	3e5
];
const SCOPE_PREFIX$1 = "cron-exit";
function scopeKey$1(jobId) {
	return `${SCOPE_PREFIX$1}:${jobId}`;
}
function isWatchableExitJob(job) {
	return job.enabled && job.schedule.kind === "on-exit";
}
function createCronExitWatchers(params) {
	let handlers = params;
	const ownerSettlements = /* @__PURE__ */ new Set();
	const settleOwnerCallback = async (operation) => {
		const settlement = operation.then(() => void 0, () => void 0);
		ownerSettlements.add(settlement);
		try {
			return await operation;
		} finally {
			ownerSettlements.delete(settlement);
		}
	};
	const shell = params.shell ?? resolveExitWatchShell();
	const retryBackoffMs = params.retryBackoffMs && params.retryBackoffMs.length > 0 ? params.retryBackoffMs : ON_EXIT_WATCH_RETRY_BACKOFF_MS;
	const active = /* @__PURE__ */ new Map();
	const settlingCancelledSlots = /* @__PURE__ */ new Set();
	const cancel = (jobId, preserveReserved = false) => {
		const slots = new Set(Array.from(settlingCancelledSlots).filter((slot) => slot.job.id === jobId));
		const current = active.get(jobId);
		if (current) slots.add(current);
		if (slots.size === 0) return;
		for (const slot of slots) {
			slot.cancelled = true;
			if (!preserveReserved || !slot.fired) slot.admission?.abort();
			if (slot.retryTimer) {
				clearTimeout(slot.retryTimer);
				slot.retryTimer = void 0;
			}
			if (!slot.lifecycleSettled) settlingCancelledSlots.add(slot);
			if (!slot.terminalPersisting && active.get(jobId) === slot) active.delete(jobId);
			slot.run?.cancel("manual-cancel");
		}
		try {
			handlers.getProcessSupervisor().cancelScope(scopeKey$1(jobId), "manual-cancel");
		} catch (err) {
			handlers.logger.warn({
				err: String(err),
				jobId
			}, "cron-exit: cancel watcher failed");
		}
	};
	const arm = (job, consecutiveFailures = 0) => {
		const command = job.schedule.command;
		const cwd = job.schedule.cwd;
		const predecessors = Array.from(settlingCancelledSlots).filter((previous) => previous.job.id === job.id).map((previous) => previous.settlement.promise);
		const slot = {
			job,
			run: void 0,
			fired: false,
			terminalPersisting: false,
			cancelled: false,
			admission: void 0,
			lifecycleSettled: false,
			settlement: createDeferredCore(),
			command,
			cwd,
			consecutiveFailures,
			retryTimer: void 0
		};
		active.set(job.id, slot);
		const owns = () => active.get(job.id) === slot;
		const persistWatcherState = async (patch) => {
			const owner = handlers;
			if (!owner.updateWatcherState) return;
			try {
				const updated = await settleOwnerCallback(owner.updateWatcherState(slot.job, patch));
				if (owns() && updated && isWatchableExitJob(updated)) slot.job = updated;
			} catch (err) {
				owner.logger.warn({
					err: String(err),
					jobId: slot.job.id
				}, "cron-exit: failed to persist watcher state");
			}
		};
		const scheduleRetry = async (error, phase) => {
			if (!owns() || slot.cancelled) return;
			slot.consecutiveFailures += 1;
			const errorText = `${phase} failed: ${String(error)}`;
			await persistWatcherState({
				lastError: `cron on-exit watcher ${errorText}`,
				consecutiveErrors: slot.consecutiveFailures
			});
			if (!owns() || slot.cancelled) return;
			const delayMs = retryBackoffMs[Math.min(slot.consecutiveFailures - 1, retryBackoffMs.length - 1)];
			slot.retryTimer = setTimeout(() => {
				slot.retryTimer = void 0;
				if (!owns() || slot.cancelled) return;
				active.delete(slot.job.id);
				arm(slot.job, slot.consecutiveFailures);
			}, delayMs);
			slot.retryTimer.unref?.();
			handlers.logger.warn({
				err: String(error),
				jobId: slot.job.id,
				retryInMs: delayMs
			}, `cron-exit: watcher ${phase} failed; retry scheduled`);
		};
		runInDetachedAsyncContext(() => (async () => {
			let run;
			try {
				run = await handlers.getProcessSupervisor().spawn({
					scopeKey: scopeKey$1(job.id),
					replaceExistingScope: true,
					mode: "child",
					argv: [shell.command, ...shell.argsFor(command)],
					...cwd ? { cwd } : {},
					env: markOpenClawExecEnv({ ...process.env }),
					timeoutMs: ON_EXIT_WATCH_TIMEOUT_MS,
					captureOutput: true
				});
			} catch (err) {
				await scheduleRetry(err, "spawn");
				return;
			}
			if (!owns()) {
				run.cancel("manual-cancel");
				try {
					await run.wait();
				} catch {}
				return;
			}
			slot.run = run;
			handlers.logger.info({
				jobId: job.id,
				runId: run.runId,
				command
			}, "cron-exit: watcher armed");
			let exit;
			try {
				exit = await run.wait();
			} catch (err) {
				await scheduleRetry(err, "wait");
				return;
			}
			if (!owns()) return;
			if (predecessors.length > 0) await Promise.all(predecessors);
			while (owns() && !slot.cancelled) {
				const owner = handlers;
				const admission = new AbortController();
				slot.admission = admission;
				try {
					await settleOwnerCallback(owner.fireOnExit(slot.job, {
						exitCode: exit.exitCode,
						reason: exit.reason,
						stdout: exit.stdout,
						stderr: exit.stderr,
						timedOut: exit.timedOut,
						noOutputTimedOut: exit.noOutputTimedOut
					}, {
						signal: admission.signal,
						commitGuard: () => {
							if (admission.signal.aborted || !slot.fired && (!owns() || slot.cancelled)) throw new Error("cron on-exit watcher no longer owns this exit");
						},
						onTerminalWriteStarted: () => {
							slot.terminalPersisting = true;
						},
						onReserved: () => {
							slot.fired = true;
							slot.terminalPersisting = true;
						}
					}));
				} catch (err) {
					if (!owns() || slot.cancelled) return;
					if (owner !== handlers && !slot.fired) continue;
					active.delete(job.id);
					owner.logger.warn({
						err: String(err),
						jobId: job.id
					}, "cron-exit: fireOnExit after exit failed");
				} finally {
					slot.admission = void 0;
					slot.terminalPersisting = false;
				}
				if (owner === handlers || slot.fired) return;
			}
		})().finally(() => {
			slot.lifecycleSettled = true;
			settlingCancelledSlots.delete(slot);
			if (slot.cancelled && active.get(job.id) === slot) active.delete(job.id);
			slot.settlement.resolve(void 0);
		}));
	};
	const reconcile = (jobs) => {
		const jobsById = new Map(jobs.map((job) => [job.id, job]));
		const want = new Map(jobs.filter(isWatchableExitJob).map((j) => [j.id, j]));
		for (const [jobId, slot] of Array.from(active.entries())) if (!want.has(jobId)) {
			const storedJob = jobsById.get(jobId);
			if (slot.terminalPersisting && storedJob?.schedule.kind === "on-exit" && !storedJob.enabled && slot.command === storedJob.schedule.command && slot.cwd === storedJob.schedule.cwd) continue;
			cancel(jobId);
		}
		for (const [jobId, job] of want) {
			const slot = active.get(jobId);
			if (slot) {
				const { command, cwd } = job.schedule;
				if (!slot.fired && slot.command === command && slot.cwd === cwd) {
					slot.job = job;
					continue;
				}
				cancel(jobId, slot.fired && slot.command === command && slot.cwd === cwd);
			}
			arm(job);
		}
	};
	const cancelAll = async () => {
		const jobIds = /* @__PURE__ */ new Set([...active.keys(), ...Array.from(settlingCancelledSlots, (slot) => slot.job.id)]);
		for (const jobId of jobIds) cancel(jobId);
		await Promise.all(Array.from(settlingCancelledSlots, (slot) => slot.settlement.promise));
	};
	return {
		reconcile,
		cancel,
		cancelAll,
		activeJobIds: () => Array.from(/* @__PURE__ */ new Set([...Array.from(active.entries()).filter(([, slot]) => !slot.fired).map(([jobId]) => jobId), ...Array.from(settlingCancelledSlots, (slot) => slot.job.id)])),
		updateHandlers: (nextHandlers) => {
			if (handlers !== nextHandlers) {
				handlers = nextHandlers;
				for (const slot of active.values()) if (!slot.terminalPersisting) slot.admission?.abort();
			}
			if (ownerSettlements.size > 0) return Promise.all(ownerSettlements).then(() => void 0);
		}
	};
}
//#endregion
//#region src/gateway/cron-stream-matcher.ts
function matchCronStreamLines(pattern, lines, signal) {
	const state = resolveGlobalSingleton(Symbol.for("openclaw.cronStreamMatcher"), () => ({}), (runtime) => {
		runtime.closing ??= (async () => {
			await runtime.pool?.close();
			runtime.pool = void 0;
		})().finally(() => {
			runtime.closing = void 0;
		});
		return runtime.closing;
	});
	if (state.closing) return Promise.reject(new WorkerTaskError("cron stream matcher is closing", "unavailable"));
	return (state.pool ??= new WorkerTaskPool({
		workerUrl: resolveRuntimeProcessEntrypointUrl("cronStreamMatcher"),
		maxWorkers: 2,
		sharedCompute: true,
		maxPendingTasks: 32,
		maxPendingBytes: 8388608
	})).run({
		pattern,
		lines
	}, {
		signal,
		timeoutMs: 3e3,
		inputBytes: lines.reduce((bytes, line) => bytes + 2 * line.length + 8, 2 * pattern.length)
	});
}
//#endregion
//#region src/gateway/cron-stream-output-lines.ts
function* remainingCronStreamLines(params) {
	for (const channel of ["stdout", "stderr"]) {
		let text = params.partialLines[channel];
		let discardUntilNewline = params.discardUntilNewline[channel];
		for (const entry of params.bufferedOutput) {
			if (entry.channel !== channel) continue;
			if (entry.precededByDrop) {
				text = "";
				discardUntilNewline = entry.precededByDrop === "midline";
			}
			text += entry.chunk;
			for (;;) {
				const newline = text.indexOf("\n");
				if (newline < 0) break;
				const rawLine = text.slice(0, newline);
				text = text.slice(newline + 1);
				if (discardUntilNewline) {
					discardUntilNewline = false;
					continue;
				}
				const overCap = Buffer.byteLength(rawLine, "utf8") > params.maxLineBytes;
				if (params.includeTruncated || !overCap) {
					const line = overCap ? truncateUtf8Prefix(rawLine, params.maxLineBytes) : rawLine;
					yield line.endsWith("\r") ? line.slice(0, -1) : line;
				}
			}
			if (discardUntilNewline) {
				text = "";
				continue;
			}
			if (entry.truncatedTail || Buffer.byteLength(text, "utf8") > params.maxLineBytes) {
				if (params.includeTruncated && text) {
					const line = truncateUtf8Prefix(text, params.maxLineBytes);
					yield line.endsWith("\r") ? line.slice(0, -1) : line;
				}
				text = "";
				discardUntilNewline = entry.truncatedTail ? entry.truncatedTailContinuesLine : true;
			}
		}
		if (discardUntilNewline || !text) continue;
		if (params.droppedChunkTail[channel] || !params.includeTruncated && Buffer.byteLength(text, "utf8") > params.maxLineBytes) continue;
		yield text.endsWith("\r") ? text.slice(0, -1) : text;
	}
}
//#endregion
//#region src/gateway/cron-stream-output.ts
const MAX_BUFFERED_OUTPUT_SEGMENTS = 64;
const INTAKE_CAP_MULTIPLIER = 4;
const clearTimer$1 = (timer) => clearTimeout(timer);
function appendBatch(left, right, maxBytes) {
	return left === void 0 ? right : truncateCronStreamBatch(`${left}\n${right}`, maxBytes);
}
async function waitForInFlightBatch(promise, timeoutMs) {
	let timeout;
	try {
		return await Promise.race([promise.then((disposition) => ({
			settled: true,
			disposition
		}), (error) => ({
			settled: true,
			error
		})), new Promise((resolve) => {
			timeout = setTimeout(() => resolve({ settled: false }), timeoutMs);
			timeout.unref?.();
		})]);
	} finally {
		clearTimer$1(timeout);
	}
}
/** Owns one stream source's bounded output and dispatch cadence. */
var CronStreamOutput = class {
	constructor({ job, scheduleKey, sourceIdentity, ...params }) {
		this.matching = new AbortController();
		this.matchFailed = false;
		this.quietEpoch = 0;
		this.rateEpoch = 0;
		this.bufferedOutput = [];
		this.interruptedOutput = [];
		this.bufferedOutputBytes = 0;
		this.queuedOutputDrainGenerations = /* @__PURE__ */ new Set();
		this.outputOverflowGenerations = /* @__PURE__ */ new Set();
		this.droppedChunkTail = {
			stdout: false,
			stderr: false
		};
		this.partialLines = {
			stdout: "",
			stderr: ""
		};
		this.discardUntilNewline = {
			stdout: false,
			stderr: false
		};
		this.batch = "";
		this.batchHasLines = false;
		this.params = params;
		this.job = job;
		this.scheduleKey = scheduleKey;
		this.sourceIdentity = sourceIdentity;
		this.matcher = this.compileMatcher(job.schedule);
		this.lastFireStartedAtMs = job.state.lastRunAtMs ?? 0;
		this.nextEligibleAttemptAtMs = job.state.lastRunAtMs ? job.state.lastRunAtMs + params.minIntervalMs : 0;
	}
	updateSource(job, scheduleKey, sourceIdentity) {
		this.job = job;
		this.scheduleKey = scheduleKey;
		this.sourceIdentity = sourceIdentity;
		this.matcher = this.compileMatcher(job.schedule);
	}
	snapshot() {
		return {
			bufferedOutputBytes: this.bufferedOutputBytes,
			bufferedOutputSegments: this.bufferedOutput.length
		};
	}
	enqueueChunk(channel, chunk, generation) {
		const state = this.params.getState();
		if (!chunk || generation !== this.params.getGeneration() || state !== "starting" && state !== "running") return;
		const { maxBatchBytes } = resolveCronStreamBatching(this.job.schedule);
		const remaining = maxBatchBytes * INTAKE_CAP_MULTIPLIER - this.bufferedOutputBytes;
		if (this.outputOverflowGenerations.has(generation) || remaining <= 0 || this.bufferedOutput.length >= MAX_BUFFERED_OUTPUT_SEGMENTS) {
			this.droppedChunkTail[channel] = chunk.endsWith("\n") ? "clean" : "midline";
			this.outputOverflowGenerations.add(generation);
			this.queueOutputDrain(generation);
			return;
		}
		const accepted = truncateUtf8Prefix(chunk, remaining);
		const truncatedTail = accepted !== chunk;
		const truncatedTailContinuesLine = truncatedTail && !chunk.endsWith("\n");
		const acceptedBytes = Buffer.byteLength(accepted, "utf8");
		if (acceptedBytes === 0 && chunk.length > 0) {
			this.droppedChunkTail[channel] = chunk.endsWith("\n") ? "clean" : "midline";
			this.outputOverflowGenerations.add(generation);
			this.queueOutputDrain(generation);
			return;
		}
		const precededByDrop = this.droppedChunkTail[channel];
		this.droppedChunkTail[channel] = false;
		const last = this.bufferedOutput.at(-1);
		if (last?.channel === channel && last.generation === generation && !precededByDrop) {
			last.chunk += accepted;
			last.truncatedTail ||= truncatedTail;
			last.truncatedTailContinuesLine ||= truncatedTailContinuesLine;
		} else this.bufferedOutput.push({
			channel,
			chunk: accepted,
			generation,
			truncatedTail,
			truncatedTailContinuesLine,
			precededByDrop
		});
		this.bufferedOutputBytes += acceptedBytes;
		if (truncatedTail) this.outputOverflowGenerations.add(generation);
		this.queueOutputDrain(generation);
	}
	async drainBufferedOutput(generation) {
		if (generation !== this.params.getGeneration()) return;
		const buffered = this.bufferedOutput;
		this.bufferedOutput = [];
		this.bufferedOutputBytes = 0;
		const overflowed = this.outputOverflowGenerations.delete(generation);
		for (const entry of buffered) {
			if (!this.params.isDesiredRunning()) {
				this.interruptedOutput.push(entry);
				continue;
			}
			if (this.params.getState() !== "running") {
				if (this.params.getState() !== "stopped") await this.params.recordLoss("not-running");
				continue;
			}
			await this.acceptChunk(entry);
		}
		if (overflowed && this.params.getState() === "running") await this.params.recordLoss("coalesced");
	}
	async flushSourceOutput(generation) {
		for (const channel of ["stdout", "stderr"]) {
			const partialLine = this.partialLines[channel];
			if (!this.discardUntilNewline[channel] && !this.droppedChunkTail[channel] && partialLine) {
				if (!await this.acceptLine(partialLine.endsWith("\r") ? partialLine.slice(0, -1) : partialLine, generation, false)) return;
			}
			this.partialLines[channel] = "";
			this.discardUntilNewline[channel] = false;
			this.droppedChunkTail[channel] = false;
		}
		clearTimer$1(this.quietTimer);
		this.quietTimer = void 0;
		const batch = this.takeOpenBatch();
		if (batch !== void 0) await this.handleClosedBatch(batch, generation);
	}
	async beginStop() {
		clearTimer$1(this.rateTimer);
		this.rateTimer = void 0;
		++this.rateEpoch;
		const state = {
			sourceBatchLost: this.matchFailed ? this.batchHasLines : await this.hasAcceptedSourceInput(),
			pendingBatchLost: this.pendingBatch !== void 0
		};
		this.pendingBatch = void 0;
		this.resetSourceBuffers();
		return state;
	}
	cancelMatching() {
		this.matching.abort();
	}
	async finishStop(state) {
		if (state.sourceBatchLost) await this.params.recordLoss("not-running");
		if (state.pendingBatchLost) await this.params.recordLoss("not-running");
		const firing = this.firing;
		if (firing && !firing.handled) {
			const result = await waitForInFlightBatch(firing.promise, this.params.settleTimeoutMs);
			if (!result.settled) {
				await this.params.recordLoss("not-running");
				firing.handled = true;
			} else if ("error" in result) {
				this.params.logger.warn({
					jobId: this.job.id,
					err: String(result.error)
				}, "cron-stream: batch fire failed during stop");
				await this.params.recordLoss("payload-error");
				firing.handled = true;
			} else await this.classifyFireDisposition(firing, result.disposition, true);
		}
		this.firing = void 0;
	}
	async dropPendingForTerminalStop() {
		clearTimer$1(this.rateTimer);
		this.rateTimer = void 0;
		++this.rateEpoch;
		if (this.pendingBatch === void 0) return;
		this.pendingBatch = void 0;
		await this.params.recordLoss("not-running");
	}
	startSource() {
		this.matching = new AbortController();
		this.matchFailed = false;
		this.resetSourceBuffers();
	}
	resetSourceBuffers() {
		clearTimer$1(this.quietTimer);
		this.quietTimer = void 0;
		++this.quietEpoch;
		this.partialLines = {
			stdout: "",
			stderr: ""
		};
		this.discardUntilNewline = {
			stdout: false,
			stderr: false
		};
		this.droppedChunkTail = {
			stdout: false,
			stderr: false
		};
		this.batch = "";
		this.batchHasLines = false;
		this.bufferedOutput = [];
		this.interruptedOutput = [];
		this.bufferedOutputBytes = 0;
		this.queuedOutputDrainGenerations.clear();
		this.outputOverflowGenerations.clear();
	}
	schedulePendingIfNeeded(generation) {
		if (this.pendingBatch === void 0 || this.params.getState() !== "running") return;
		const nextAt = Math.max(this.nextEligibleAttemptAtMs, this.lastFireStartedAtMs + this.params.minIntervalMs);
		this.schedulePendingFire(Math.max(0, nextAt - this.params.nowMs()), generation);
	}
	queueOutputDrain(generation) {
		if (this.queuedOutputDrainGenerations.has(generation)) return;
		this.queuedOutputDrainGenerations.add(generation);
		this.params.enqueue("output", async () => {
			try {
				await this.drainBufferedOutput(generation);
			} finally {
				this.queuedOutputDrainGenerations.delete(generation);
				const currentGeneration = this.params.getGeneration();
				if (this.bufferedOutput.some((entry) => entry.generation === currentGeneration) || this.outputOverflowGenerations.has(currentGeneration)) this.queueOutputDrain(currentGeneration);
			}
		});
	}
	async acceptChunk(entry) {
		const { channel, chunk, truncatedTail, truncatedTailContinuesLine, generation } = entry;
		if (entry.precededByDrop) {
			this.partialLines[channel] = "";
			this.discardUntilNewline[channel] = entry.precededByDrop === "midline";
		}
		const { maxBatchBytes } = resolveCronStreamBatching(this.job.schedule);
		const partialCapBytes = maxBatchBytes * INTAKE_CAP_MULTIPLIER;
		let text = `${this.partialLines[channel]}${chunk}`;
		this.partialLines[channel] = "";
		for (;;) {
			const newline = text.indexOf("\n");
			if (newline < 0) break;
			const rawLine = text.slice(0, newline);
			text = text.slice(newline + 1);
			if (this.discardUntilNewline[channel]) {
				this.discardUntilNewline[channel] = false;
				continue;
			}
			const overCap = Buffer.byteLength(rawLine, "utf8") > partialCapBytes;
			const boundedLine = overCap ? truncateUtf8Prefix(rawLine, partialCapBytes) : rawLine;
			const processed = await this.acceptLine(boundedLine.endsWith("\r") ? boundedLine.slice(0, -1) : boundedLine, generation, overCap);
			if (!this.params.isDesiredRunning()) {
				this.interruptedOutput.push({
					...entry,
					chunk: processed ? text : `${rawLine}\n${text}`,
					precededByDrop: false
				});
				return;
			}
		}
		if (this.discardUntilNewline[channel]) return;
		if (truncatedTail || Buffer.byteLength(text, "utf8") > partialCapBytes) {
			const rawLine = truncateUtf8Prefix(text, partialCapBytes);
			if (rawLine) await this.acceptLine(rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine, generation, true);
			this.discardUntilNewline[channel] = truncatedTail ? truncatedTailContinuesLine : true;
			return;
		}
		this.partialLines[channel] = text;
	}
	async acceptLine(line, generation, truncated) {
		if (truncated && this.matcher) return true;
		const signal = this.matching.signal;
		let matched;
		try {
			matched = !this.matcher || await matchCronStreamLines(this.matcher.source, [line], signal);
		} catch (error) {
			if (signal.aborted) return false;
			this.matchFailed = true;
			this.params.requestMatchFailureStop(`stream source match failed: ${formatErrorMessage(error)}; check the match expression and Gateway load, then re-enable the job`);
			await this.params.recordLoss("not-running");
			return true;
		}
		if (!matched) return true;
		if (signal.aborted || generation !== this.params.getGeneration() || !this.params.isDesiredRunning()) return false;
		const { batchMs, maxBatchBytes } = resolveCronStreamBatching(this.job.schedule);
		const renderedLine = truncated ? markCronStreamBatchTruncated(line, maxBatchBytes) : line;
		const candidate = this.batchHasLines ? `${this.batch}\n${renderedLine}` : renderedLine;
		const capped = truncateCronStreamBatch(candidate, maxBatchBytes);
		this.batch = capped;
		this.batchHasLines = true;
		++this.quietEpoch;
		if (capped !== candidate || Buffer.byteLength(capped, "utf8") >= maxBatchBytes) {
			clearTimer$1(this.quietTimer);
			this.quietTimer = void 0;
			const batch = this.takeOpenBatch();
			if (batch !== void 0) await this.handleClosedBatch(batch, generation);
			return true;
		}
		if (this.quietTimer) this.quietTimer.refresh();
		else {
			this.quietTimer = setTimeout(() => {
				this.closeQuietBatch(generation, this.quietEpoch);
			}, batchMs);
			this.quietTimer.unref?.();
		}
		return true;
	}
	closeQuietBatch(generation, epoch) {
		return this.params.enqueue("batch-closed", async () => {
			if (generation !== this.params.getGeneration()) return;
			if (this.params.getState() !== "running" || epoch !== this.quietEpoch) {
				if (this.params.getState() !== "stopped" && epoch === this.quietEpoch && this.batchHasLines) {
					this.takeOpenBatch();
					await this.params.recordLoss("not-running");
				}
				return;
			}
			clearTimer$1(this.quietTimer);
			this.quietTimer = void 0;
			const batch = this.takeOpenBatch();
			if (batch !== void 0) await this.handleClosedBatch(batch, generation);
		});
	}
	takeOpenBatch() {
		if (!this.batchHasLines) return;
		const batch = this.batch;
		this.batch = "";
		this.batchHasLines = false;
		return batch;
	}
	async handleClosedBatch(batch, generation) {
		if (generation !== this.params.getGeneration()) return;
		if (!this.params.isDesiredRunning() || this.params.getState() !== "running") {
			if (this.params.getState() !== "stopped") await this.params.recordLoss("not-running");
			return;
		}
		const { maxBatchBytes } = resolveCronStreamBatching(this.job.schedule);
		const spacingRemaining = Math.max(this.nextEligibleAttemptAtMs, this.lastFireStartedAtMs + this.params.minIntervalMs) - this.params.nowMs();
		if (this.firing || spacingRemaining > 0 || this.pendingBatch !== void 0) {
			this.pendingBatch = appendBatch(this.pendingBatch, batch, maxBatchBytes);
			await this.params.recordLoss("coalesced");
			if (!this.firing) this.schedulePendingFire(Math.max(0, spacingRemaining), generation);
			return;
		}
		this.startFire(batch, generation);
	}
	startFire(batch, generation) {
		if (generation !== this.params.getGeneration()) return;
		if (!this.params.isDesiredRunning() || this.params.isRetired()) {
			this.params.recordLoss("not-running");
			return;
		}
		const attemptStartedAtMs = this.params.nowMs();
		this.nextEligibleAttemptAtMs = attemptStartedAtMs + this.params.minIntervalMs;
		const firing = {
			batch,
			sourceIdentity: this.sourceIdentity,
			startedAtMs: attemptStartedAtMs,
			promise: this.params.fireBatch(this.job, batch, this.scheduleKey, this.sourceIdentity),
			handled: false
		};
		this.firing = firing;
		firing.promise.then((disposition) => this.fireCompleted(firing, disposition), (error) => this.fireRejected(firing, error));
	}
	ownsFiring(firing) {
		if (firing.handled) return false;
		if (this.firing === firing && firing.sourceIdentity === this.sourceIdentity) return true;
		firing.handled = true;
		if (this.firing === firing) this.firing = void 0;
		return false;
	}
	fireCompleted(firing, disposition) {
		return this.params.enqueue("fire-completed", async () => {
			if (!this.ownsFiring(firing)) return;
			await this.classifyFireDisposition(firing, disposition, false);
			this.firing = void 0;
			this.schedulePendingIfNeeded(this.params.getGeneration());
		});
	}
	fireRejected(firing, error) {
		return this.params.enqueue("fire-rejected", async () => {
			if (!this.ownsFiring(firing)) return;
			this.params.logger.warn({
				jobId: this.job.id,
				err: String(error)
			}, "cron-stream: batch fire failed");
			await this.params.recordLoss("payload-error");
			firing.handled = true;
			this.firing = void 0;
			this.schedulePendingIfNeeded(this.params.getGeneration());
		});
	}
	async classifyFireDisposition(firing, disposition, stopping) {
		if (firing.handled) return;
		firing.handled = true;
		if (disposition === "fired" || disposition === "disabled") {
			this.lastFireStartedAtMs = firing.startedAtMs;
			if (disposition === "disabled" && !stopping) this.params.requestTriggerDisabledStop();
			return;
		}
		if (disposition === "dropped" || disposition === "error") {
			await this.params.recordLoss(disposition === "dropped" ? "gate-drop" : "payload-error");
			return;
		}
		if (disposition === "busy" && !stopping && this.params.isDesiredRunning() && this.params.getState() !== "stopped") {
			const { maxBatchBytes } = resolveCronStreamBatching(this.job.schedule);
			this.pendingBatch = this.pendingBatch === void 0 ? firing.batch : appendBatch(firing.batch, this.pendingBatch, maxBatchBytes);
			return;
		}
		await this.params.recordLoss("not-running");
	}
	schedulePendingFire(delayMs, generation) {
		clearTimer$1(this.rateTimer);
		const rateEpoch = ++this.rateEpoch;
		this.rateTimer = setTimeout(() => {
			this.attemptPendingFire(generation, rateEpoch);
		}, delayMs);
		this.rateTimer.unref?.();
	}
	attemptPendingFire(generation, rateEpoch) {
		return this.params.enqueue("pending-fire", async () => {
			if (rateEpoch !== this.rateEpoch) return;
			this.rateTimer = void 0;
			if (this.pendingBatch === void 0) return;
			if (generation !== this.params.getGeneration()) {
				if (this.params.isDesiredRunning() && this.params.getState() === "running") this.schedulePendingIfNeeded(this.params.getGeneration());
				return;
			}
			const state = this.params.getState();
			if (state === "starting" || state === "backoff") return;
			if (!this.params.isDesiredRunning()) {
				this.pendingBatch = void 0;
				if (state !== "stopped") await this.params.recordLoss("not-running");
				return;
			}
			if (state !== "running") {
				if (state !== "stopped") {
					this.pendingBatch = void 0;
					await this.params.recordLoss("not-running");
				}
				return;
			}
			if (this.firing) return;
			const spacingRemaining = Math.max(this.nextEligibleAttemptAtMs, this.lastFireStartedAtMs + this.params.minIntervalMs) - this.params.nowMs();
			if (spacingRemaining > 0) {
				this.schedulePendingFire(spacingRemaining, generation);
				return;
			}
			const pending = this.pendingBatch;
			this.pendingBatch = void 0;
			this.startFire(pending, generation);
		});
	}
	compileMatcher(schedule) {
		return (schedule.mode ?? "line") === "match" ? compileSafeRegex(schedule.match ?? "") ?? void 0 : void 0;
	}
	async hasAcceptedSourceInput() {
		if (this.batchHasLines) return true;
		const { maxBatchBytes } = resolveCronStreamBatching(this.job.schedule);
		const remaining = remainingCronStreamLines({
			partialLines: this.partialLines,
			discardUntilNewline: this.discardUntilNewline,
			droppedChunkTail: this.droppedChunkTail,
			bufferedOutput: [...this.interruptedOutput, ...this.bufferedOutput],
			maxLineBytes: maxBatchBytes * INTAKE_CAP_MULTIPLIER,
			includeTruncated: !this.matcher
		});
		if (!this.matcher) return !remaining.next().done;
		const lines = Array.from(remaining);
		if (lines.length === 0) return false;
		try {
			return await matchCronStreamLines(this.matcher.source, lines);
		} catch (error) {
			this.params.logger.warn({
				jobId: this.job.id,
				err: formatErrorMessage(error)
			}, "cron-stream: stopped output could not be classified; counting it as dropped");
			return true;
		}
	}
};
//#endregion
//#region src/gateway/cron-stream-job-owner.ts
const SCOPE_PREFIX = "cron-stream";
const STABLE_RUN_MS = 6e4;
const MAX_CONSECUTIVE_FAILURES = 5;
const COUNTER_MAX = 2147483647;
const STOP_SETTLE_TIMEOUT_MS = 1e4;
const OWNER_STOP_TIMEOUT_MS = STOP_SETTLE_TIMEOUT_MS * 2;
function isCronStreamJob(job) {
	return job.schedule.kind === "stream";
}
function sourceIdentityFor(job) {
	const identity = job.state.streamSourceIdentity?.trim();
	if (!identity) throw new Error(`stream job ${job.id} is missing its source identity`);
	return identity;
}
const scopeKey = (jobId) => `${SCOPE_PREFIX}:${jobId}`;
function stopRequiresSourceRetirement(reason) {
	return reason === "removed" || reason === "shutdown" || reason === "trust-disabled" || reason === "cron-disabled";
}
function clearTimer(timer) {
	if (timer) clearTimeout(timer);
}
function boundedCounter(value, increment = 0) {
	return Math.min(COUNTER_MAX, Math.max(0, Math.floor(value ?? 0)) + increment);
}
async function stopManagedRun(run) {
	run.detachOutput?.();
	run.cancel("manual-cancel");
	let timeout;
	try {
		if (!await Promise.race([run.wait().then(() => true, () => true), new Promise((resolve) => {
			timeout = setTimeout(() => resolve(false), STOP_SETTLE_TIMEOUT_MS);
			timeout.unref?.();
		})])) throw new Error(`stream source did not exit within ${STOP_SETTLE_TIMEOUT_MS}ms`);
	} finally {
		clearTimer(timeout);
	}
}
/** Owns one stream job's serialized process lifecycle and durable counters. */
var CronStreamJobOwner = class {
	constructor(job, params) {
		this.params = params;
		this.state = "idle";
		this.generation = 0;
		this.desiredRunning = false;
		this.retired = false;
		this.removalRequested = false;
		this.restartExhausted = false;
		this.requestEpoch = 0;
		this.opTail = Promise.resolve();
		this.job = job;
		this.scheduleKey = cronStreamScheduleKey(job.schedule);
		this.sourceIdentity = sourceIdentityFor(job);
		this.consecutiveFailures = job.state.streamConsecutiveFailures ?? 0;
		this.droppedBatches = job.state.streamDroppedBatches ?? 0;
		this.coalescedBatches = job.state.streamCoalescedBatches ?? 0;
		this.restartExhausted = job.state.streamRestartExhausted === true;
		this.output = new CronStreamOutput({
			job,
			scheduleKey: this.scheduleKey,
			sourceIdentity: this.sourceIdentity,
			minIntervalMs: params.minIntervalMs,
			settleTimeoutMs: STOP_SETTLE_TIMEOUT_MS,
			nowMs: params.nowMs,
			fireBatch: params.fireBatch,
			recordLoss: async (reason) => await this.recordLoss(reason),
			enqueue: (label, operation) => this.enqueue(label, operation),
			requestTriggerDisabledStop: () => {
				this.stop("trigger-disabled").catch((error) => {
					this.params.logger.warn({
						jobId: this.job.id,
						err: formatErrorMessage(error)
					}, "cron-stream: trigger-disabled stop failed");
				});
			},
			requestMatchFailureStop: (error) => {
				this.stop("restart-exhausted", void 0, error).catch((stopError) => {
					this.params.logger.warn({
						jobId: this.job.id,
						err: formatErrorMessage(stopError)
					}, "cron-stream: match failure teardown failed");
				});
			},
			getGeneration: () => this.generation,
			getState: () => this.state,
			isDesiredRunning: () => this.desiredRunning,
			isRetired: () => this.retired,
			logger: params.logger
		});
	}
	get id() {
		return this.job.id;
	}
	acceptsStart() {
		return !this.removalRequested;
	}
	snapshot() {
		return {
			state: this.state,
			generation: this.generation,
			sourceIdentity: this.sourceIdentity,
			processAlive: this.run !== void 0,
			restartTimerPending: this.restartTimer !== void 0,
			...this.output.snapshot(),
			droppedBatches: this.droppedBatches,
			coalescedBatches: this.coalescedBatches,
			consecutiveFailures: this.consecutiveFailures
		};
	}
	start(job) {
		if (this.removalRequested) return Promise.resolve();
		const requestEpoch = ++this.requestEpoch;
		return this.enqueue("start", async () => {
			if (this.removalRequested || requestEpoch !== this.requestEpoch) return;
			const nextScheduleKey = cronStreamScheduleKey(job.schedule);
			const nextSourceIdentity = sourceIdentityFor(job);
			if (!this.ownsSource(nextScheduleKey, nextSourceIdentity)) await this.stopOperation("schedule-update");
			if (this.removalRequested || requestEpoch !== this.requestEpoch) return;
			if (this.run && this.state !== "running") {
				await this.stopOperation("schedule-update");
				if (this.removalRequested || requestEpoch !== this.requestEpoch) return;
			}
			this.retired = false;
			this.desiredRunning = true;
			this.adoptJob(job, nextScheduleKey, nextSourceIdentity);
			this.droppedBatches = Math.max(this.droppedBatches, boundedCounter(job.state.streamDroppedBatches));
			this.coalescedBatches = Math.max(this.coalescedBatches, boundedCounter(job.state.streamCoalescedBatches));
			if (job.state.streamRestartExhausted) {
				this.desiredRunning = false;
				this.state = "stopped";
				return;
			}
			if (this.state === "running" || this.state === "starting" || this.state === "backoff") return;
			this.consecutiveFailures = job.state.streamConsecutiveFailures ?? 0;
			await this.spawnSource();
		});
	}
	stop(reason, job, failure) {
		++this.requestEpoch;
		this.desiredRunning = false;
		this.output.cancelMatching();
		if (reason === "removed") this.removalRequested = true;
		this.params.getProcessSupervisor().cancelScope(scopeKey(this.job.id), "manual-cancel");
		const queuedStop = this.enqueue("stop", async () => {
			if (failure) {
				this.restartExhausted = true;
				await this.persistFailure(failure, {
					streamStatus: "error",
					streamError: failure,
					streamRestartExhausted: true
				});
			}
			await this.stopOperation(reason, job);
		});
		return this.awaitBoundedStop(queuedStop);
	}
	processExited(exit, generation) {
		return this.enqueue("process-exited", async () => {
			if (generation !== this.generation || this.state !== "running" || !this.desiredRunning) return;
			this.run?.detachOutput?.();
			this.run = void 0;
			clearTimer(this.stableTimer);
			this.stableTimer = void 0;
			await this.output.drainBufferedOutput(generation);
			await this.output.flushSourceOutput(generation);
			if (generation !== this.generation || this.state !== "running" || !this.desiredRunning) return;
			const backoffGeneration = ++this.generation;
			const stable = exit.durationMs >= STABLE_RUN_MS;
			this.consecutiveFailures = stable ? 0 : boundedCounter(this.consecutiveFailures, 1);
			const message = `stream source exited (${exit.reason}, code ${exit.exitCode ?? "none"})`;
			if (this.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
				await this.output.dropPendingForTerminalStop();
				this.desiredRunning = false;
				this.state = "stopped";
				this.restartExhausted = true;
				await this.persistFailure(message, {
					streamStatus: "error",
					streamError: message,
					streamConsecutiveFailures: this.consecutiveFailures,
					streamRestartExhausted: true,
					streamLastExitAtMs: this.params.nowMs()
				});
				return;
			}
			this.state = "backoff";
			await this.persistState({
				streamStatus: "restarting",
				streamError: message,
				streamConsecutiveFailures: this.consecutiveFailures,
				streamLastExitAtMs: this.params.nowMs()
			});
			this.scheduleRestart(stable ? 0 : errorBackoffMs(this.consecutiveFailures, this.params.retryBackoffMs), backoffGeneration);
		});
	}
	ownsSource(scheduleKey, sourceIdentity) {
		return scheduleKey === this.scheduleKey && sourceIdentity === this.sourceIdentity;
	}
	adoptJob(job, scheduleKey, sourceIdentity) {
		this.job = job;
		this.scheduleKey = scheduleKey;
		this.sourceIdentity = sourceIdentity;
		this.output.updateSource(job, scheduleKey, sourceIdentity);
	}
	enqueue(label, operation) {
		return runInDetachedAsyncContext(() => {
			const result = this.opTail.then(operation, operation);
			this.opTail = result.catch((error) => {
				this.params.logger.warn({
					jobId: this.job.id,
					operation: label,
					err: formatErrorMessage(error)
				}, "cron-stream: owner operation failed");
			});
			return result;
		});
	}
	async awaitBoundedStop(stop) {
		let timeout;
		try {
			await Promise.race([stop, new Promise((_resolve, reject) => {
				timeout = setTimeout(() => {
					this.params.getProcessSupervisor().cancelScope(scopeKey(this.job.id), "manual-cancel");
					reject(/* @__PURE__ */ new Error(`stream owner stop did not settle within ${OWNER_STOP_TIMEOUT_MS}ms`));
				}, OWNER_STOP_TIMEOUT_MS);
				timeout.unref?.();
			})]);
		} finally {
			clearTimer(timeout);
		}
	}
	async spawnSource() {
		if (!this.desiredRunning || this.retired) {
			this.state = "stopped";
			return;
		}
		this.state = "starting";
		this.restartExhausted = false;
		const generation = ++this.generation;
		this.output.startSource();
		if (!await this.persistState({
			streamStatus: this.consecutiveFailures > 0 ? "restarting" : "starting",
			streamError: void 0,
			streamConsecutiveFailures: this.consecutiveFailures,
			streamRestartExhausted: void 0
		}) || generation !== this.generation || !this.desiredRunning || this.retired || this.state !== "starting") {
			this.state = "stopped";
			return;
		}
		let run;
		try {
			run = await this.params.getProcessSupervisor().spawn({
				scopeKey: scopeKey(this.job.id),
				replaceExistingScope: true,
				mode: "child",
				argv: this.job.schedule.command,
				...this.job.schedule.cwd ? { cwd: this.job.schedule.cwd } : {},
				env: markOpenClawExecEnv({ ...process.env }),
				stdinMode: "pipe-closed",
				captureOutput: false,
				onStdout: (chunk) => this.output.enqueueChunk("stdout", chunk, generation),
				onStderr: (chunk) => this.output.enqueueChunk("stderr", chunk, generation)
			});
		} catch (error) {
			if (generation !== this.generation || !this.desiredRunning || this.retired) {
				this.state = "stopped";
				return;
			}
			this.consecutiveFailures = boundedCounter(this.consecutiveFailures, 1);
			const message = `stream source failed to start: ${String(error)}`;
			if (this.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
				await this.output.dropPendingForTerminalStop();
				this.desiredRunning = false;
				this.state = "stopped";
				this.restartExhausted = true;
				await this.persistFailure(message, {
					streamStatus: "error",
					streamError: message,
					streamConsecutiveFailures: this.consecutiveFailures,
					streamRestartExhausted: true
				});
				return;
			}
			this.state = "backoff";
			await this.persistState({
				streamStatus: "restarting",
				streamError: message,
				streamConsecutiveFailures: this.consecutiveFailures
			});
			this.scheduleRestart(errorBackoffMs(this.consecutiveFailures, this.params.retryBackoffMs), generation);
			return;
		}
		if (generation !== this.generation || !this.desiredRunning || this.retired) {
			this.run = run;
			await stopManagedRun(run);
			if (this.run === run) this.run = void 0;
			this.state = "stopped";
			return;
		}
		this.run = run;
		this.state = "running";
		this.stableTimer = setTimeout(() => {
			this.markStable(generation);
		}, STABLE_RUN_MS);
		this.stableTimer.unref?.();
		if (!await this.persistState({
			streamStatus: "running",
			streamError: void 0,
			streamLastStartedAtMs: run.startedAtMs
		}) || generation !== this.generation || !this.desiredRunning || this.retired || this.state !== "running") {
			await this.stopOperation("schedule-update");
			return;
		}
		this.params.logger.info({
			jobId: this.job.id,
			runId: run.runId,
			generation
		}, "cron-stream: source running");
		this.output.schedulePendingIfNeeded(generation);
		run.wait().then((exit) => this.processExited(exit, generation), (error) => {
			this.params.logger.warn({
				jobId: this.job.id,
				err: formatErrorMessage(error)
			}, "cron-stream: supervised wait failed");
			return this.processExited({
				reason: "spawn-error",
				exitCode: null,
				exitSignal: null,
				durationMs: Math.max(0, this.params.nowMs() - run.startedAtMs),
				stdout: "",
				stderr: "",
				timedOut: false,
				noOutputTimedOut: false
			}, generation);
		});
	}
	async stopOperation(reason, job) {
		this.desiredRunning = false;
		if (reason === "removed") this.retired = true;
		if (job) this.adoptJob(job, cronStreamScheduleKey(job.schedule), sourceIdentityFor(job));
		this.state = "stopping";
		++this.generation;
		let retirementError;
		if (stopRequiresSourceRetirement(reason)) try {
			const retiredIdentity = await this.params.retireSource(this.job.id, this.scheduleKey, this.sourceIdentity);
			if (retiredIdentity !== void 0) {
				const retiredJob = {
					...this.job,
					state: {
						...this.job.state,
						streamSourceIdentity: retiredIdentity
					}
				};
				this.adoptJob(retiredJob, this.scheduleKey, retiredIdentity);
			}
		} catch (error) {
			retirementError = error;
		}
		clearTimer(this.restartTimer);
		this.restartTimer = void 0;
		clearTimer(this.stableTimer);
		this.stableTimer = void 0;
		const outputStopState = this.output.beginStop();
		const run = this.run;
		let stopError;
		if (run) try {
			await stopManagedRun(run);
			if (this.run === run) this.run = void 0;
		} catch (error) {
			stopError = error;
		}
		else this.params.getProcessSupervisor().cancelScope(scopeKey(this.job.id), "manual-cancel");
		await this.output.finishStop(await outputStopState);
		if (stopError !== void 0) {
			this.state = "stopping";
			this.restartExhausted = true;
			const message = `stream source failed to stop: ${formatErrorMessage(stopError)}`;
			await this.persistFailure(message, {
				streamStatus: "error",
				streamError: message,
				streamRestartExhausted: true
			});
			if (retirementError !== void 0) throw new AggregateError([retirementError, stopError], "stream source retirement and stop both failed");
			throw toErrorObject(stopError, "stream source failed to stop");
		}
		this.state = "stopped";
		await this.persistState(reason === "trust-disabled" ? {
			streamStatus: "disabled",
			streamError: "stream sources are disabled because the operator set cron.triggers.enabled: false; remove it or set it to true"
		} : reason === "cron-disabled" ? {
			streamStatus: "disabled",
			streamError: "cron is disabled"
		} : reason === "restart-exhausted" || reason === "shutdown" && this.restartExhausted ? {} : {
			streamStatus: "stopped",
			streamError: void 0
		});
		if (retirementError !== void 0) throw toErrorObject(retirementError, "stream source retirement failed");
	}
	scheduleRestart(delayMs, generation) {
		return this.enqueue("schedule-restart", async () => {
			if (!this.desiredRunning || this.retired || this.state !== "backoff" || generation !== this.generation) return;
			clearTimer(this.restartTimer);
			if (delayMs <= 0) {
				this.restartAfterBackoff(generation);
				return;
			}
			this.restartTimer = setTimeout(() => {
				this.restartAfterBackoff(generation);
			}, delayMs);
			this.restartTimer.unref?.();
		});
	}
	markStable(generation) {
		return this.enqueue("mark-stable", async () => {
			if (generation !== this.generation || this.state !== "running") return;
			this.stableTimer = void 0;
			this.consecutiveFailures = 0;
			if (!await this.persistState({
				streamStatus: "running",
				streamError: void 0,
				streamConsecutiveFailures: 0
			})) await this.stopOperation("schedule-update");
		});
	}
	restartAfterBackoff(generation) {
		return this.enqueue("restart", async () => {
			if (generation !== this.generation || this.state !== "backoff" || !this.desiredRunning || this.retired) return;
			clearTimer(this.restartTimer);
			this.restartTimer = void 0;
			await this.spawnSource();
		});
	}
	async recordLoss(reason) {
		if (reason === "coalesced") this.coalescedBatches = boundedCounter(this.coalescedBatches, 1);
		else this.droppedBatches = boundedCounter(this.droppedBatches, 1);
		try {
			const counters = {
				streamDroppedBatches: this.droppedBatches,
				streamCoalescedBatches: this.coalescedBatches
			};
			if (this.params.updateCounters) await this.params.updateCounters(this.job.id, counters);
			else await this.params.updateState(this.job.id, counters, this.scheduleKey, this.sourceIdentity);
		} catch (error) {
			this.params.logger.warn({
				jobId: this.job.id,
				err: String(error)
			}, "cron-stream: failed to persist loss counters");
		}
	}
	async persistState(patch) {
		try {
			if (await this.params.updateState(this.job.id, patch, this.scheduleKey, this.sourceIdentity) === false) {
				this.desiredRunning = false;
				return false;
			}
			return true;
		} catch (error) {
			this.params.logger.warn({
				jobId: this.job.id,
				err: String(error)
			}, "cron-stream: failed to persist source state");
			return true;
		}
	}
	async persistFailure(error, patch) {
		try {
			await this.params.recordFailure(this.job.id, error, patch, this.scheduleKey, this.sourceIdentity);
		} catch (failureError) {
			this.params.logger.warn({
				jobId: this.job.id,
				err: String(failureError)
			}, "cron-stream: failed to persist terminal source failure");
		}
	}
};
//#endregion
//#region src/gateway/cron-stream-watchers.ts
const MAX_RETIRED_COUNTER_SEEDS = 1024;
const MAX_MUTATION_EPOCHS = 1024;
/** Keep direct mutations and reconcile decisions on the same stop-reason contract. */
function resolveStreamStopReason(input) {
	if (!input.triggersEnabled) return "trust-disabled";
	if (!input.cronEnabled) return "cron-disabled";
	if (input.restartExhausted) return "restart-exhausted";
	return input.isStream ? "disabled" : "schedule-update";
}
/** Supervise line-producing cron sources through one serialized owner per job. */
function createCronStreamWatchers(params) {
	const owners = /* @__PURE__ */ new Map();
	const retiredCounterSeeds = /* @__PURE__ */ new Map();
	const mutationEpochs = /* @__PURE__ */ new Map();
	let nextMutationToken = 0;
	let mutationEvictionEpoch = 0;
	let reconcileEpoch = 0;
	let stopped = false;
	const mutationEpochFor = (jobId) => mutationEpochs.get(jobId) ?? 0;
	const bumpMutationEpoch = (jobId) => {
		const next = ++nextMutationToken;
		mutationEpochs.delete(jobId);
		mutationEpochs.set(jobId, next);
		while (mutationEpochs.size > MAX_MUTATION_EPOCHS) {
			const oldest = mutationEpochs.keys().next().value;
			if (oldest === void 0 || oldest === jobId) break;
			mutationEpochs.delete(oldest);
			mutationEvictionEpoch += 1;
		}
		return next;
	};
	const ownerParams = {
		getProcessSupervisor: params.getProcessSupervisor,
		minIntervalMs: params.minIntervalMs ?? resolveCronTriggerMinIntervalMs(),
		retryBackoffMs: params.retryBackoffMs,
		updateState: params.updateState,
		retireSource: params.retireSource,
		...params.updateCounters ? { updateCounters: params.updateCounters } : {},
		recordFailure: params.recordFailure,
		fireBatch: params.fireBatch,
		logger: params.logger,
		nowMs: params.nowMs ?? Date.now
	};
	const retainCounterSeed = (owner) => {
		const snapshot = owner.snapshot();
		const current = retiredCounterSeeds.get(owner.id);
		retiredCounterSeeds.delete(owner.id);
		retiredCounterSeeds.set(owner.id, {
			streamDroppedBatches: Math.max(current?.streamDroppedBatches ?? 0, snapshot.droppedBatches),
			streamCoalescedBatches: Math.max(current?.streamCoalescedBatches ?? 0, snapshot.coalescedBatches)
		});
		pruneMapToMaxSize(retiredCounterSeeds, MAX_RETIRED_COUNTER_SEEDS);
	};
	const createOwner = (job) => {
		const seed = retiredCounterSeeds.get(job.id);
		retiredCounterSeeds.delete(job.id);
		const owner = new CronStreamJobOwner(seed ? {
			...job,
			state: {
				...job.state,
				streamDroppedBatches: Math.max(job.state.streamDroppedBatches ?? 0, seed.streamDroppedBatches ?? 0),
				streamCoalescedBatches: Math.max(job.state.streamCoalescedBatches ?? 0, seed.streamCoalescedBatches ?? 0)
			}
		} : job, ownerParams);
		owners.set(job.id, owner);
		return owner;
	};
	const getOrCreateOwner = async (job, isCurrent) => {
		while (true) {
			if (!isCurrent()) return;
			const existing = owners.get(job.id);
			if (existing?.acceptsStart()) return existing;
			if (!existing) return createOwner(job);
			await existing.stop("schedule-update");
			if (!isCurrent()) return;
			if (owners.get(job.id) === existing) {
				retainCounterSeed(existing);
				owners.delete(job.id);
			}
		}
	};
	const stop = async (jobId, reason, job) => {
		bumpMutationEpoch(jobId);
		const streamJob = job && isCronStreamJob(job) ? job : void 0;
		const owner = owners.get(jobId) ?? (reason !== "removed" && streamJob ? createOwner(streamJob) : void 0);
		if (!owner) return;
		await owner.stop(reason, streamJob);
		if (reason === "removed" && owners.get(jobId) === owner) {
			retainCounterSeed(owner);
			owners.delete(jobId);
		}
	};
	const startOwner = async (job, expectedMutationEpoch, expectedReconcileEpoch) => {
		const isCurrent = () => !stopped && expectedMutationEpoch === mutationEpochFor(job.id) && (expectedReconcileEpoch === void 0 || expectedReconcileEpoch === reconcileEpoch);
		if (!isCurrent()) return;
		if (!isCronStreamJob(job)) {
			await stop(job.id, "schedule-update");
			return;
		}
		const owner = await getOrCreateOwner(job, isCurrent);
		if (!owner || !isCurrent()) return;
		await owner.start(job);
	};
	const start = async (job) => {
		const expectedMutationEpoch = bumpMutationEpoch(job.id);
		await startOwner(job, expectedMutationEpoch);
	};
	const stopOwnerLogged = async (owner, reason, job) => {
		try {
			await owner.stop(reason, job);
			return true;
		} catch (error) {
			params.logger.warn({
				jobId: owner.id,
				reason,
				err: String(error)
			}, "cron-stream: owner stop failed");
			return false;
		}
	};
	const stopAll = async (reason) => {
		if (reason === "shutdown") {
			stopped = true;
			++reconcileEpoch;
		}
		const failures = (await Promise.allSettled(Array.from(owners.values(), (owner) => owner.stop(reason)))).filter((result) => result.status === "rejected").map((result) => result.reason);
		if (failures.length === 1) throw failures[0];
		if (failures.length > 1) throw new AggregateError(failures, "stream owner stops failed");
	};
	const reconcile = async (jobs, enabled, triggersEnabled = enabled) => {
		const currentReconcileEpoch = ++reconcileEpoch;
		if (stopped) return;
		const streamJobs = jobs.filter(isCronStreamJob);
		const wantedIds = new Set(streamJobs.map((job) => job.id));
		const mutationSnapshot = /* @__PURE__ */ new Map();
		for (const jobId of /* @__PURE__ */ new Set([...owners.keys(), ...wantedIds])) mutationSnapshot.set(jobId, mutationEpochFor(jobId));
		const snapshotEvictionEpoch = mutationEvictionEpoch;
		const jobMutationIsCurrent = (jobId) => {
			const current = mutationEpochFor(jobId);
			if (current !== mutationSnapshot.get(jobId)) return false;
			return current !== 0 || snapshotEvictionEpoch === mutationEvictionEpoch;
		};
		for (const [jobId, owner] of owners.entries()) {
			if (wantedIds.has(jobId)) continue;
			if (stopped || currentReconcileEpoch !== reconcileEpoch) return;
			if (!jobMutationIsCurrent(jobId)) continue;
			if (await stopOwnerLogged(owner, "removed")) {
				if (owners.get(jobId) === owner) {
					retainCounterSeed(owner);
					owners.delete(jobId);
				}
			}
			if (stopped || currentReconcileEpoch !== reconcileEpoch) return;
		}
		if (stopped || currentReconcileEpoch !== reconcileEpoch) return;
		for (const job of streamJobs) {
			if (stopped || currentReconcileEpoch !== reconcileEpoch) return;
			if (!jobMutationIsCurrent(job.id)) continue;
			const owner = await getOrCreateOwner(job, () => !stopped && currentReconcileEpoch === reconcileEpoch && jobMutationIsCurrent(job.id));
			if (!owner) return;
			if (stopped || currentReconcileEpoch !== reconcileEpoch) return;
			if (!jobMutationIsCurrent(job.id)) continue;
			const stopReason = !enabled ? triggersEnabled ? "cron-disabled" : "trust-disabled" : !job.enabled ? "disabled" : job.state.streamRestartExhausted ? "restart-exhausted" : void 0;
			if (stopReason) {
				await stopOwnerLogged(owner, stopReason, job);
				continue;
			}
			try {
				await startOwner(job, mutationSnapshot.get(job.id) ?? 0, currentReconcileEpoch);
			} catch (error) {
				params.logger.warn({
					jobId: job.id,
					err: String(error)
				}, "cron-stream: reconcile start failed");
			}
		}
	};
	return {
		reconcile,
		resume: () => {
			stopped = false;
			++reconcileEpoch;
		},
		start,
		stop,
		stopAll,
		activeJobIds: () => Array.from(owners.values()).filter((owner) => {
			const state = owner.snapshot().state;
			return state === "starting" || state === "running" || state === "stopping" || state === "backoff";
		}).map((owner) => owner.id),
		inspect: (jobId) => owners.get(jobId)?.snapshot()
	};
}
//#endregion
//#region src/gateway/server-cron-notifications.ts
const CRON_WEBHOOK_TIMEOUT_MS = 1e4;
function redactWebhookUrl(url) {
	try {
		const parsed = new URL(url);
		return `${parsed.origin}${parsed.pathname}`;
	} catch {
		return "<invalid-webhook-url>";
	}
}
function redactOptionalWebhookUrl(url) {
	const normalized = normalizeOptionalString(url);
	return normalized ? redactWebhookUrl(normalized) : void 0;
}
function redactCommandCronEventForExternalDelivery(evt, job) {
	if (job?.payload.kind !== "command") return evt;
	const summary = redactCronCommandSummaryForExternalDelivery(evt.summary);
	const diagnosticsSummary = redactCronCommandSummaryForExternalDelivery(evt.diagnostics?.summary);
	const diagnosticsEntries = evt.diagnostics?.entries.map((entry) => ({
		...entry,
		message: redactCronCommandSummaryForExternalDelivery(entry.message) ?? entry.message
	}));
	const diagnosticsEntriesChanged = diagnosticsEntries?.some((entry, index) => entry.message !== evt.diagnostics?.entries[index]?.message);
	const embeddedJobState = evt.job?.state;
	const stripEmbeddedJobDiagnostics = Boolean(embeddedJobState && ("lastDiagnostics" in embeddedJobState || "lastDiagnosticSummary" in embeddedJobState));
	if (summary === evt.summary && diagnosticsSummary === evt.diagnostics?.summary && !diagnosticsEntriesChanged && !stripEmbeddedJobDiagnostics) return evt;
	const redacted = { ...evt };
	if (summary !== void 0) redacted.summary = summary;
	else delete redacted.summary;
	if (evt.diagnostics) {
		redacted.diagnostics = { ...evt.diagnostics };
		if (diagnosticsSummary !== void 0) redacted.diagnostics.summary = diagnosticsSummary;
		else delete redacted.diagnostics.summary;
		if (diagnosticsEntries) redacted.diagnostics.entries = diagnosticsEntries;
	}
	if (stripEmbeddedJobDiagnostics && evt.job) {
		const state = { ...evt.job.state };
		delete state.lastDiagnostics;
		delete state.lastDiagnosticSummary;
		redacted.job = {
			...evt.job,
			state
		};
	}
	return redacted;
}
function resolveCronCompletionWebhook(params) {
	if (normalizeOptionalLowercaseString(params.delivery?.mode) !== "announce" || normalizeOptionalLowercaseString(params.delivery?.completionDestination?.mode) !== "webhook") return;
	return normalizeHttpWebhookUrl(params.delivery?.completionDestination?.to) ?? void 0;
}
function buildCronWebhookHeaders(webhookToken) {
	const headers = { "Content-Type": "application/json" };
	if (webhookToken) headers.Authorization = `Bearer ${webhookToken}`;
	return headers;
}
function appendCronRunStarted(message, runAtMs, config) {
	if (typeof runAtMs !== "number" || !Number.isFinite(runAtMs)) return message;
	const timestamp = formatZonedTimestamp(new Date(runAtMs), { timeZone: resolveUserTimezone(config.agents?.defaults?.userTimezone) });
	return timestamp ? `${message}\nRun started: ${timestamp}` : message;
}
function appendCronFailureAlertDetails(message, jobId, runAtMs, config) {
	const withRunStarted = appendCronRunStarted(message, runAtMs, config);
	const inspectUrl = resolveControlUiAutomationRunUrl(config, {
		jobId,
		runId: runAtMs ? createCronExecutionId(jobId, runAtMs) : void 0
	});
	return inspectUrl ? `${withRunStarted}\nInspect: ${inspectUrl}` : withRunStarted;
}
function buildCronFinishedWebhookPayload(evt) {
	if (evt.status !== "error") return evt;
	const { summary: _summary, diagnostics: _diagnostics, ...payload } = evt;
	if (evt.job) {
		const state = { ...evt.job.state };
		delete state.lastDiagnostics;
		delete state.lastDiagnosticSummary;
		return {
			...payload,
			job: {
				...evt.job,
				state
			}
		};
	}
	return payload;
}
async function postCronWebhookStrict(params) {
	const remainingMs = params.deadlineAtMs === void 0 ? CRON_WEBHOOK_TIMEOUT_MS : params.deadlineAtMs - Date.now();
	if (remainingMs <= 0) {
		const error = /* @__PURE__ */ new Error("cron webhook delivery deadline exceeded");
		error.name = "TimeoutError";
		throw error;
	}
	const requestTimeoutMs = Math.min(CRON_WEBHOOK_TIMEOUT_MS, remainingMs);
	const requestDeadlineAtMs = Date.now() + requestTimeoutMs;
	assertSecretOwnerAvailable("capability", "cron-webhook");
	const result = await fetchWithSsrFGuard({
		url: params.webhookUrl,
		timeoutMs: requestTimeoutMs,
		policy: params.ssrfPolicy,
		...params.signal ? { signal: params.signal } : {},
		init: {
			method: "POST",
			headers: buildCronWebhookHeaders(params.webhookToken),
			body: JSON.stringify(params.payload)
		}
	});
	let accepted = false;
	try {
		if (!result.response.ok) throw new Error(`Webhook request failed with HTTP ${result.response.status}`);
		accepted = true;
		params.onDeliveryAccepted?.();
	} finally {
		const cleanup = async () => {
			if (!result.response.bodyUsed) {
				const cancellation = result.response.body?.cancel();
				if (cancellation) await withTimeout(cancellation, Math.max(1, requestDeadlineAtMs - Date.now()), "cron webhook response cleanup").catch(() => void 0);
			}
			await result.release();
		};
		if (accepted) await cleanup().catch(() => void 0);
		else await cleanup();
	}
}
/** Posts a detached cron webhook without throwing back into scheduler completion flow. */
async function postCronWebhook(params) {
	try {
		await postCronWebhookStrict(params);
	} catch (err) {
		if (err instanceof SsrFBlockedError) params.logger.warn({
			...params.logContext,
			reason: formatErrorMessage(err),
			webhookUrl: redactWebhookUrl(params.webhookUrl)
		}, params.blockedLog);
		else params.logger.warn({
			...params.logContext,
			err: formatErrorMessage(err),
			webhookUrl: redactWebhookUrl(params.webhookUrl)
		}, params.failedLog);
	}
}
/** Delivers the primary webhook while the cron run still owns its terminal outcome. */
async function sendGatewayCronWebhook(params) {
	const deliveryPlan = resolveCronDeliveryPlan(params.job);
	const webhookUrl = normalizeHttpWebhookUrl(deliveryPlan.to);
	if (!webhookUrl) throw new Error("cron webhook delivery.to must be a valid http(s) URL");
	const event = redactCommandCronEventForExternalDelivery(params.event, params.job);
	await retryTransientDirectCronDelivery({
		jobId: params.job.id,
		label: "webhook",
		...params.abortSignal ? { signal: params.abortSignal } : {},
		...params.deadlineAtMs !== void 0 ? { deadlineAtMs: params.deadlineAtMs } : {},
		run: () => postCronWebhookStrict({
			webhookUrl,
			webhookToken: normalizeOptionalString(params.webhookToken),
			ssrfPolicy: params.ssrfPolicy,
			payload: buildCronFinishedWebhookPayload(event),
			...params.abortSignal ? { signal: params.abortSignal } : {},
			...params.deadlineAtMs !== void 0 ? { deadlineAtMs: params.deadlineAtMs } : {},
			...params.onDeliveryAccepted ? { onDeliveryAccepted: params.onDeliveryAccepted } : {}
		}),
		shouldRetryError: (error) => !(error instanceof SsrFBlockedError)
	});
}
/** Detached sends outlive cron ticks; own roots block mid-delivery suspension snapshots. */
function dispatchDetachedCronNotification(params) {
	runWithGatewayIndependentRootWorkContinuation(params.deliver, "cron:notification-delivery").catch((err) => {
		params.logger.warn({
			jobId: params.jobId,
			err: formatErrorMessage(err)
		}, "cron: detached notification delivery failed");
	});
}
/** Transports a scheduler-authorized cron failure alert. */
async function sendGatewayCronFailureAlert(params) {
	await runWithGatewayIndependentRootWorkContinuation(async () => {
		const settled = await sendGatewayCronFailureAlertUnderAdmission(params);
		await params.onDeliverySettled(settled.outcome);
		if (settled.kind === "failed") throw settled.error;
	}, "cron:failure-alert");
}
async function sendGatewayCronFailureAlertUnderAdmission(params) {
	let mayHaveReachedRecipient = false;
	const onDeliveryAttempt = (reachedRecipient) => {
		mayHaveReachedRecipient ||= reachedRecipient;
	};
	try {
		const { agentId, cfg: runtimeConfig } = params.resolveCronAgent(params.job.agentId);
		if (params.mode === "webhook") {
			if (!params.to) throw new Error("cron failure alert webhook requires a URL");
			const webhookUrl = normalizeHttpWebhookUrl(params.to);
			if (!webhookUrl) throw new Error("cron failure alert webhook requires a valid http(s) URL");
			await postCronWebhookStrict({
				webhookUrl,
				webhookToken: normalizeOptionalString(params.webhookToken),
				ssrfPolicy: params.ssrfPolicy,
				onDeliveryAccepted: () => onDeliveryAttempt(true),
				payload: {
					jobId: params.job.id,
					jobName: params.job.name,
					message: params.payload.text ?? "",
					runAtMs: params.runAtMs
				}
			});
			return {
				kind: "settled",
				outcome: {
					delivered: true,
					status: "delivered"
				}
			};
		}
		const abortController = new AbortController();
		const deliveryTimeoutError = /* @__PURE__ */ new Error("cron: failure alert announcement timed out");
		const result = await withTimeout(sendCronAnnouncePayloadStrict({
			deps: params.deps,
			cfg: runtimeConfig,
			agentId,
			jobId: params.job.id,
			target: {
				channel: params.channel,
				to: params.to,
				accountId: params.accountId,
				threadId: params.threadId,
				sessionKey: resolveCronDeliverySessionKey(params.job),
				inheritSessionThread: params.inheritSessionThread
			},
			payload: {
				...params.payload,
				text: appendCronFailureAlertDetails(params.payload.text ?? "", params.job.id, params.runAtMs, runtimeConfig)
			},
			abortSignal: abortController.signal,
			onDeliveryAttempt
		}), CRON_WEBHOOK_TIMEOUT_MS, { createError: () => {
			abortController.abort(deliveryTimeoutError);
			return deliveryTimeoutError;
		} });
		if (result.status === "sent") return {
			kind: "settled",
			outcome: {
				delivered: true,
				status: "delivered"
			}
		};
		const uncertain = result.reason === "adapter_returned_no_identity";
		return {
			kind: "settled",
			outcome: {
				delivered: uncertain ? void 0 : false,
				status: uncertain ? "unknown" : "not-delivered",
				error: `cron failure alert ${uncertain ? "outcome is unknown" : "was suppressed"}: ${result.reason}`
			}
		};
	} catch (err) {
		const error = formatErrorMessage(err);
		return {
			kind: "failed",
			error: err,
			outcome: {
				delivered: mayHaveReachedRecipient ? void 0 : false,
				status: mayHaveReachedRecipient ? "unknown" : "not-delivered",
				error
			}
		};
	}
}
/** Fans out completion webhooks after a cron run finishes. */
function dispatchGatewayCronFinishedNotifications(params) {
	const webhookToken = normalizeOptionalString(params.webhookToken);
	const redactedWebhookEvent = redactCommandCronEventForExternalDelivery(params.evt, params.job);
	const completionSummary = params.job?.payload.kind === "script" ? normalizeOptionalString(redactedWebhookEvent.summary) : params.evt.summary;
	const completionWebhookUrl = resolveCronCompletionWebhook({ delivery: params.job?.delivery && typeof params.job.delivery.mode === "string" ? {
		mode: params.job.delivery.mode,
		to: params.job.delivery.to,
		completionDestination: params.job.delivery.completionDestination
	} : void 0 });
	if (params.job?.delivery?.completionDestination?.mode === "webhook" && !normalizeHttpWebhookUrl(params.job.delivery.completionDestination.to)) params.logger.warn({
		jobId: params.evt.jobId,
		deliveryTo: redactOptionalWebhookUrl(params.job.delivery.completionDestination.to)
	}, "cron: skipped completion webhook delivery, delivery.completionDestination.to must be a valid http(s) URL");
	if (completionWebhookUrl && (completionSummary || params.evt.completionStatus === "failed")) {
		const payload = buildCronFinishedWebhookPayload(redactedWebhookEvent);
		dispatchDetachedCronNotification({
			jobId: params.evt.jobId,
			logger: params.logger,
			deliver: () => postCronWebhook({
				webhookUrl: completionWebhookUrl,
				webhookToken,
				ssrfPolicy: params.ssrfPolicy,
				payload,
				logContext: {
					jobId: params.evt.jobId,
					source: "completionDestination"
				},
				blockedLog: "cron: webhook delivery blocked by SSRF guard",
				failedLog: "cron: webhook delivery failed",
				logger: params.logger
			})
		});
	}
}
//#endregion
//#region src/gateway/server-cron-plugin-job.ts
/** Map internal CronJob to the public plugin SDK shape. */
function toPluginCronJob(job) {
	return {
		id: job.id,
		agentId: job.agentId,
		name: job.name,
		description: job.description,
		enabled: job.enabled,
		schedule: job.schedule ? structuredClone(job.schedule) : void 0,
		sessionTarget: job.sessionTarget,
		wakeMode: job.wakeMode,
		payload: job.payload ? structuredClone(job.payload) : void 0,
		state: {
			nextRunAtMs: job.state.nextRunAtMs,
			runningAtMs: job.state.runningAtMs,
			lastRunAtMs: job.state.lastRunAtMs,
			lastRunStatus: job.state.lastRunStatus,
			lastError: job.state.lastError,
			lastDurationMs: job.state.lastDurationMs,
			lastDelivered: job.state.lastDelivered,
			lastDeliveryStatus: job.state.lastDeliveryStatus,
			lastDeliveryError: job.state.lastDeliveryError,
			deliverySuppressionReason: job.state.deliverySuppressionReason,
			lastFailureNotificationDelivered: job.state.lastFailureNotificationDelivered,
			lastFailureNotificationDeliveryStatus: job.state.lastFailureNotificationDeliveryStatus,
			lastFailureNotificationDeliveryError: job.state.lastFailureNotificationDeliveryError,
			streamStatus: job.state.streamStatus,
			streamError: job.state.streamError,
			streamConsecutiveFailures: job.state.streamConsecutiveFailures,
			streamRestartExhausted: job.state.streamRestartExhausted,
			streamDroppedBatches: job.state.streamDroppedBatches,
			streamCoalescedBatches: job.state.streamCoalescedBatches,
			streamLastStartedAtMs: job.state.streamLastStartedAtMs,
			streamLastExitAtMs: job.state.streamLastExitAtMs
		},
		createdAtMs: job.createdAtMs,
		updatedAtMs: job.updatedAtMs
	};
}
//#endregion
//#region src/gateway/server-cron-skill-review-jobs.ts
async function reconcileSkillCollectionReviewJobs(params) {
	let ok = true;
	let jobs;
	try {
		jobs = await params.cron.list({ includeDisabled: true });
	} catch (error) {
		params.logger.warn({ err: String(error) }, "cron-skill-review: monitor inventory failed");
		return { ok: false };
	}
	params.commitGuard?.();
	const specs = resolveSkillCollectionReviewMonitorSpecs(params.cfg, jobs);
	const { retained, duplicates } = partitionSystemMonitors(jobs, skillCollectionReviewMonitorAgentId);
	for (const { agentId, job } of duplicates) {
		await setImmediate();
		params.commitGuard?.();
		try {
			await params.cron.remove(job.id, {
				systemOwned: true,
				...params.commitGuard ? { commitGuard: params.commitGuard } : {}
			});
		} catch (error) {
			params.commitGuard?.();
			ok = false;
			params.logger.warn({
				agentId,
				err: String(error)
			}, "cron-skill-review: duplicate monitor cleanup failed");
		}
	}
	for (const spec of specs) {
		await setImmediate();
		params.commitGuard?.();
		retained.delete(spec.agentId);
		try {
			await params.cron.add(spec.input, {
				enabledExplicit: true,
				systemOwned: true,
				matchesExisting: (job) => skillCollectionReviewMonitorAgentId(job) === spec.agentId,
				...params.commitGuard ? { commitGuard: params.commitGuard } : {}
			});
		} catch (error) {
			params.commitGuard?.();
			ok = false;
			params.logger.warn({
				agentId: spec.agentId,
				err: String(error)
			}, "cron-skill-review: monitor convergence failed");
		}
	}
	for (const [agentId, job] of retained) {
		await setImmediate();
		params.commitGuard?.();
		try {
			await params.cron.remove(job.id, {
				systemOwned: true,
				...params.commitGuard ? { commitGuard: params.commitGuard } : {}
			});
		} catch (error) {
			params.commitGuard?.();
			ok = false;
			params.logger.warn({
				agentId,
				err: String(error)
			}, "cron-skill-review: stale monitor cleanup failed");
		}
	}
	return { ok };
}
//#endregion
//#region src/gateway/server-cron.ts
var GatewaySystemJobReconciliationSupersededError = class extends Error {};
function formatOnExitRunSummary(exit) {
	const lines = [
		"Watched command finished.",
		`Exit code: ${exit.exitCode ?? "none"}`,
		`Reason: ${exit.reason}`
	];
	const output = buildCronCommandSummary({
		stdout: exit.stdout,
		stderr: exit.stderr
	});
	return output ? `${lines.join("\n")}\n\nOutput:\n${output}` : lines.join("\n");
}
/**
* On-exit jobs share cron execution, history, notifications, and delivery.
* The admission owner builds their payload from its authoritative job snapshot.
*/
async function fireOnExitJob(job, exit, deps) {
	const summary = formatOnExitRunSummary(exit);
	const result = await deps.run(job.id, (current) => {
		const payload = current.payload;
		return payload.kind === "systemEvent" ? {
			...payload,
			text: `${payload.text}\n\n${summary}`
		} : payload.kind === "agentTurn" ? {
			...payload,
			message: `${payload.message}\n\n${summary}`
		} : void 0;
	});
	if (!result.ok || !("ran" in result && result.ran)) {
		const reason = "reason" in result ? result.reason : "run did not start";
		const evidence = truncateUtf16WithEllipsis(summary, 2e3);
		throw new Error(`cron on-exit run was not admitted: ${reason}\n\n${evidence}`);
	}
}
/** Fire one source batch through the normal trigger and payload pipeline. */
async function fireStreamJob(job, deps) {
	let disposition;
	const result = await deps.run(job.id, (value) => {
		disposition = value;
	});
	if (!disposition && result.ok && result.ran === false && result.reason === "already-running") return "busy";
	if (disposition === "fired" && result.enabled === false) return "disabled";
	return disposition ?? (result.ok && result.ran === true ? "fired" : "not-run");
}
function reconcileCronExitWatchers(params) {
	if (!params.cronEnabled) {
		params.exitWatchers.cancelAll();
		return;
	}
	params.exitWatchers.reconcile(params.jobs);
}
/** Pick only the keys whose values are not `undefined` from an object. */
function pickDefined(obj, keys) {
	const result = {};
	for (const k of keys) if (obj[k] !== void 0) result[k] = obj[k];
	return result;
}
function sanitizeCronHeartbeatOverride(heartbeat) {
	return heartbeat?.target === "last" ? {
		...heartbeat,
		to: void 0,
		accountId: void 0
	} : heartbeat;
}
async function finalizeCronCompletionAnnouncement(params) {
	const plan = resolveCronDeliveryPlan(params.job);
	const delivery = { intended: pickDefined({
		channel: plan.channel,
		to: plan.to,
		accountId: plan.accountId,
		threadId: plan.threadId,
		source: "explicit"
	}, [
		"channel",
		"to",
		"accountId",
		"threadId",
		"source"
	]) };
	if (plan.mode !== "announce") return {
		deliveryAttempted: false,
		delivered: false,
		delivery
	};
	const deliveryState = {
		status: "not-delivered",
		delivered: false,
		failureNotification: { status: "not-requested" }
	};
	const finish = (deliveryAttempted) => ({
		deliveryAttempted,
		delivered: deliveryState.delivered,
		deliveryError: deliveryState.error,
		deliverySuppressionReason: deliveryState.deliverySuppressionReason,
		deliveryState,
		delivery: {
			...delivery,
			delivered: deliveryState.delivered
		}
	});
	if (params.text === void 0) {
		deliveryState.deliverySuppressionReason = params.suppressionReason ?? "empty";
		return finish(false);
	}
	const { agentId, cfg } = params.resolveCronAgent(params.job.agentId);
	const inspectUrl = resolveControlUiAutomationRunUrl(cfg, {
		jobId: params.job.id,
		runId: params.runStartedAtMs === void 0 ? void 0 : createCronExecutionId(params.job.id, params.runStartedAtMs)
	});
	const text = inspectUrl ? `${params.text}\nInspect: ${inspectUrl}` : params.text;
	const abortSignal = params.abortSignal ?? new AbortController().signal;
	let deliveryMayHaveReachedRecipient = false;
	try {
		const result = await retryTransientDirectCronDelivery({
			jobId: params.job.id,
			label: params.label,
			signal: abortSignal,
			shouldRetryError: () => !deliveryMayHaveReachedRecipient,
			run: () => sendCronAnnouncePayloadStrict({
				deps: params.deps,
				cfg,
				agentId,
				jobId: params.job.id,
				target: {
					channel: plan.channel,
					to: plan.to,
					threadId: plan.threadId,
					accountId: plan.accountId,
					sessionKey: resolveCronDeliverySessionKey(params.job)
				},
				payload: { text },
				abortSignal,
				onDeliveryAttempt: (reachedRecipient) => {
					deliveryMayHaveReachedRecipient ||= reachedRecipient;
				}
			})
		});
		if (result.status === "sent") {
			deliveryState.status = "delivered";
			deliveryState.delivered = true;
		} else {
			const uncertain = result.reason === "adapter_returned_no_identity";
			deliveryState.status = uncertain ? "unknown" : "not-delivered";
			deliveryState.delivered = uncertain ? void 0 : false;
			deliveryState.error = `cron delivery ${uncertain ? "outcome is unknown" : "was suppressed"}: ${result.reason}`;
		}
		return finish(true);
	} catch (err) {
		const deliveryError = formatErrorMessage(err);
		params.logger.warn({
			jobId: params.job.id,
			err: deliveryError
		}, `cron: ${params.label} delivery failed`);
		deliveryState.error = deliveryError;
		if (params.traceResolvedFailure) delivery.resolved = {
			channel: plan.channel,
			to: plan.to,
			accountId: plan.accountId,
			threadId: plan.threadId,
			source: "explicit",
			ok: false,
			error: deliveryError
		};
		return finish(true);
	}
}
function isCommandCronJob(job) {
	return job?.payload?.kind === "command";
}
const CRON_ACTIVE_RUN_SHUTDOWN_DRAIN_MS = 1e4;
/** Build the cron service state used by Gateway startup and lazy cron loading. */
function buildGatewayCronService(params) {
	const cronLogger = getChildLogger({ module: "cron" });
	const cronServiceLogger = toPinoLikeLogger(cronLogger, getResolvedLoggerSettings().level);
	const scheduledGatewayContextResolver = fenceScheduledGatewayContextResolver(params.resolveGatewayContext);
	const runSchedulerOwned = createScheduledGatewayRunner(scheduledGatewayContextResolver);
	const env = params.env ?? process.env;
	const storePath = resolveCronJobsStorePathFromConfig(params.cfg, env);
	const cronEnabled = env.OPENCLAW_SKIP_CRON !== "1" && params.cfg.cron?.enabled !== false;
	const webhookSsrfPolicy = mergeSsrFPolicies(params.cfg.cron?.webhookSsrfPolicy);
	const findAgentEntry = (cfg, agentId) => listAgentEntries(cfg).find((entry) => normalizeAgentId(entry.id) === agentId);
	const hasConfiguredAgent = (cfg, agentId) => Boolean(findAgentEntry(cfg, agentId));
	const resolveCronAgent = (requested) => {
		const runtimeConfig = getRuntimeConfig();
		const normalized = typeof requested === "string" && requested.trim() ? normalizeAgentId(requested) : void 0;
		const defaultAgentId = tryResolveAmbientOwnerAgentId(runtimeConfig);
		if (normalized !== void 0 && normalized !== defaultAgentId && !hasConfiguredAgent(runtimeConfig, normalized)) throw new Error(`cron job agent is unavailable: ${normalized}`);
		const agentId = resolveCronJobEffectiveAgentId(normalized ? { agentId: normalized } : {}, defaultAgentId);
		if (isAgentDeletionBlocked(agentId)) throw new Error(`cron job agent is unavailable: ${agentId}`);
		assertAgentDatabaseAdmitted(agentId, { env });
		return {
			agentId,
			cfg: runtimeConfig
		};
	};
	const resolveCronSessionKey = (paramsValue) => {
		const requested = paramsValue.requestedSessionKey?.trim();
		const candidate = toAgentStoreSessionKey({
			agentId: paramsValue.agentId,
			requestKey: requested,
			mainKey: paramsValue.runtimeConfig.session?.mainKey
		});
		const canonical = canonicalizeMainSessionAlias({
			cfg: paramsValue.runtimeConfig,
			agentId: paramsValue.agentId,
			sessionKey: candidate
		});
		if (canonical !== "global") {
			const sessionAgentId = resolveAgentIdFromSessionKey(canonical);
			if (normalizeAgentId(sessionAgentId) !== normalizeAgentId(paramsValue.agentId)) return resolveAgentMainSessionKey({
				cfg: paramsValue.runtimeConfig,
				agentId: paramsValue.agentId
			});
		}
		return resolveMainScopedEventSessionKey({
			cfg: paramsValue.runtimeConfig,
			sessionKey: canonical,
			agentId: paramsValue.agentId
		}) ?? canonical;
	};
	const resolveCronTarget = (opts) => {
		const requestedAgentId = typeof opts?.agentId === "string" && opts.agentId.trim() ? normalizeAgentId(opts.agentId) : void 0;
		const requestedSessionKey = typeof opts?.sessionKey === "string" && opts.sessionKey.trim() ? opts.sessionKey : void 0;
		if (opts?.preserveUntargeted && !requestedAgentId && !requestedSessionKey) return {
			runtimeConfig: getRuntimeConfig(),
			agentId: void 0,
			sessionKey: void 0
		};
		if (!requestedAgentId && !requestedSessionKey) {
			const runtimeConfig = getRuntimeConfig();
			return {
				runtimeConfig,
				...resolveSystemMainSessionTarget(runtimeConfig)
			};
		}
		const derivedAgentId = requestedSessionKey && parseAgentSessionKey(requestedSessionKey) ? resolveAgentIdFromSessionKey(requestedSessionKey) : void 0;
		const { agentId: resolvedAgentId, cfg: runtimeConfig } = resolveCronAgent(requestedAgentId ?? derivedAgentId);
		const agentId = resolvedAgentId || void 0;
		const resolvedSessionKey = agentId ? resolveCronSessionKey({
			runtimeConfig,
			agentId,
			requestedSessionKey
		}) : void 0;
		return {
			runtimeConfig,
			agentId,
			sessionKey: resolvedSessionKey && runtimeConfig.session?.scope === "global" ? resolveEventSessionKey(resolvedSessionKey, runtimeConfig.session?.mainKey, runtimeConfig.session?.scope) : resolvedSessionKey
		};
	};
	const resolveCronHeartbeatWake = (opts) => {
		const { agentId, sessionKey } = resolveCronTarget({
			...opts,
			preserveUntargeted: opts.source !== "manual"
		});
		const useConfiguredSession = opts.source === "interval" && !opts.sessionKey?.trim();
		return {
			source: opts.source,
			intent: opts.intent,
			reason: opts.reason,
			agentId,
			sessionKey: useConfiguredSession ? void 0 : sessionKey,
			heartbeat: sanitizeCronHeartbeatOverride(opts.heartbeat),
			...opts.scheduledEveryMs !== void 0 ? { scheduledEveryMs: opts.scheduledEveryMs } : {},
			...opts.tasks?.length ? { tasks: opts.tasks } : {}
		};
	};
	const defaultAgentId = tryResolveAmbientOwnerAgentId(params.cfg);
	const legacyDefaultAgentId = tryGetLegacyDefaultAgentId(params.cfg);
	const resolveSessionStorePath = (agentId) => resolveSessionStorePathCore(params.cfg.session?.store, { agentId: agentId ?? resolveSessionStoreCompatibilityAgentId(getRuntimeConfig()) });
	const sessionStorePath = resolveSessionStorePath(defaultAgentId);
	const cronTriggersEnabled = params.cfg.cron?.triggers?.enabled !== false;
	const scriptRuntime = cronTriggersEnabled ? createCronScriptRuntime({
		config: params.cfg,
		loadPluginRegistry: loadPreparedInboundPluginRegistry,
		resolveGatewayContext: scheduledGatewayContextResolver
	}) : void 0;
	const runCronChangedHook = (evt) => {
		const hookRunner = getGlobalHookRunner();
		if (!hookRunner?.hasHooks("cron_changed")) return;
		const hookCtx = {
			config: getRuntimeConfig(),
			getCron: () => cron
		};
		runInDetachedAsyncContext(() => runWithGatewayIndependentRootWorkAdmission(async () => {
			await runSchedulerOwned(() => hookRunner.runCronChanged(evt, hookCtx));
		}, "cron:changed-hook").catch((err) => {
			cronLogger.warn({
				err: formatErrorMessage(err),
				jobId: evt.jobId
			}, "cron_changed hook failed");
		}));
	};
	const exitWatchersRef = { current: void 0 };
	const streamWatchersRef = { current: void 0 };
	let exitWatcherReconciliations = 0;
	let streamWatcherReconciliations = 0;
	const terminalExitCompletionTokens = /* @__PURE__ */ new Map();
	let exitWatcherGeneration = 0;
	let exitWatcherMutationRevision = 0;
	let exitWatchersStopped = false;
	let exitWatcherHandoffReady;
	const settleExitWatcherHandoff = (ready, handoff = exitWatcherHandoffReady) => {
		if (!handoff) return;
		handoff.settled = true;
		handoff.result.resolve(ready);
		if (ready && exitWatcherHandoffReady === handoff) exitWatcherHandoffReady = void 0;
	};
	let streamWatcherGeneration = 0;
	let streamWatcherMutationRevision = 0;
	let streamWatchersStopped = false;
	const reconcileExitWatchers = async () => {
		const revision = ++exitWatcherMutationRevision;
		const generation = exitWatcherGeneration;
		exitWatcherReconciliations += 1;
		try {
			if (!exitWatchersRef.current || exitWatchersStopped) return;
			const jobs = await cron.list({ includeDisabled: true });
			if (exitWatchersStopped || generation !== exitWatcherGeneration || revision !== exitWatcherMutationRevision) return;
			reconcileCronExitWatchers({
				cronEnabled,
				exitWatchers: exitWatchersRef.current,
				jobs
			});
		} catch (err) {
			cronLogger.warn({ err: String(err) }, "cron-exit: reconcile failed");
		} finally {
			exitWatcherReconciliations -= 1;
		}
	};
	const reconcileStreamWatchers = async () => {
		const generation = streamWatcherGeneration;
		streamWatcherReconciliations += 1;
		try {
			const watchers = streamWatchersRef.current;
			if (!watchers || streamWatchersStopped) return;
			for (let attempt = 0; attempt < 5; attempt += 1) {
				const revision = streamWatcherMutationRevision;
				const jobs = await cron.list({ includeDisabled: true });
				if (generation !== streamWatcherGeneration || streamWatchersStopped) return;
				if (revision !== streamWatcherMutationRevision) continue;
				await watchers.reconcile(jobs, cronEnabled && cronTriggersEnabled, cronTriggersEnabled);
				return;
			}
			cronLogger.warn({}, "cron-stream: reconcile skipped after repeated concurrent mutations");
		} catch (err) {
			cronLogger.warn({ err: String(err) }, "cron-stream: reconcile failed");
		} finally {
			streamWatcherReconciliations -= 1;
		}
	};
	const routeStreamWatcherMutation = async (jobId, job, action) => {
		const watchers = streamWatchersRef.current;
		if (!watchers || streamWatchersStopped) return;
		streamWatcherMutationRevision += 1;
		streamWatcherReconciliations += 1;
		try {
			if (action === "removed") {
				await watchers.stop(jobId, "removed");
				return;
			}
			if (job?.schedule.kind === "stream" && job.enabled && !job.state.streamRestartExhausted && cronEnabled && cronTriggersEnabled) {
				await watchers.start(job);
				return;
			}
			const reason = resolveStreamStopReason({
				triggersEnabled: cronTriggersEnabled,
				cronEnabled,
				restartExhausted: job?.state.streamRestartExhausted === true,
				isStream: job?.schedule.kind === "stream"
			});
			await watchers.stop(jobId, reason, job);
		} finally {
			streamWatcherReconciliations -= 1;
		}
	};
	const broadcastCronBoundSessionChanges = (evt) => {
		const job = evt.job ?? cron.getJob(evt.jobId);
		if (!job) return;
		const boundKeys = resolveCronJobBoundSessionKeys(job, {
			cfg: getRuntimeConfig(),
			defaultAgentId: cron.getDefaultAgentId()
		});
		for (const sessionKey of boundKeys) {
			const context = scheduledGatewayContextResolver?.();
			const projection = getSessionRowProjection(context);
			const publish = () => params.broadcast("sessions.changed", {
				sessionKey,
				reason: "cron-binding",
				ts: Date.now()
			}, { dropIfSlow: true });
			if (projection) (async () => {
				do
					await projection.ensureMaterialized();
				while (projection.needsMaterialization);
				if (scheduledGatewayContextResolver?.() === context) publish();
			})().catch((error) => cronLogger.warn({ error }, "Cron session publication failed"));
			else publish();
		}
	};
	const cron = new CronService({
		storePath,
		cronEnabled,
		cronConfig: params.cfg.cron,
		listConfiguredChannels: () => listConfiguredMessageChannels(getRuntimeConfig()),
		...scriptRuntime ? { evaluateCronTrigger: scriptRuntime.evaluateTrigger } : {},
		...defaultAgentId ? { defaultAgentId } : {},
		...legacyDefaultAgentId ? { legacyDefaultAgentId } : {},
		resolveDefaultAgentId: () => tryResolveAmbientOwnerAgentId(getRuntimeConfig()),
		resolveSessionStoreAgentIds: () => {
			const cfg = getRuntimeConfig();
			try {
				return listKnownSessionStoreAgentIds(cfg, { env });
			} catch (error) {
				cronLogger.warn({ err: formatErrorMessage(error) }, "cron: persisted session-store owner discovery failed");
				return listConfiguredSessionStoreAgentIds(cfg);
			}
		},
		isAgentAvailable: (agentId) => !isAgentDeletionBlocked(agentId) && !readAgentDatabaseAdmissionRefusal(agentId, { env }) && listAgentIds(getRuntimeConfig()).some((id) => normalizeAgentId(id) === agentId),
		resolveSessionStorePath,
		sessionStorePath,
		enqueueSystemEvent: (text, opts) => {
			const { agentId, sessionKey } = resolveCronTarget(opts);
			if (!agentId || !sessionKey) throw new Error("Cron system event target did not resolve an owner and session key.");
			const remove = enqueueSystemEventWithReceipt(text, withSystemEventOwner({
				sessionKey,
				contextKey: opts?.contextKey,
				deliveryContext: opts?.deliveryContext
			}, agentId));
			return remove ? {
				accepted: true,
				remove
			} : { accepted: false };
		},
		resolveOriginDeliveryContext: (opts) => {
			const { runtimeConfig, sessionKey } = resolveCronTarget({
				...opts,
				preserveUntargeted: true
			});
			if (!sessionKey) return;
			return resolveCronStoredDeliveryContext({
				cfg: runtimeConfig,
				sessionKey
			});
		},
		runSchedulerOwned,
		requestHeartbeat: (opts) => requestSessionEventWake(resolveCronHeartbeatWake(opts)),
		requestHeartbeatAndWait: (opts, lifecycle) => requestSessionEventWakeAndWait(resolveCronHeartbeatWake(opts), lifecycle),
		resolveHeartbeatTimeoutMs: (opts) => {
			const { agentId, cfg: runtimeConfig } = resolveCronAgent(opts.agentId);
			const heartbeat = resolveHeartbeatForWake({
				cfg: runtimeConfig,
				agentId,
				requestedHeartbeat: opts.heartbeat,
				source: opts.source
			});
			const timeoutMs = finiteSecondsToTimerSafeMilliseconds(resolveHeartbeatTimeoutOverrideSeconds(runtimeConfig, heartbeat));
			return timeoutMs === 0 ? void 0 : timeoutMs;
		},
		runIsolatedAgentJob: async (request) => {
			const { job } = request;
			const { agentId, cfg: runtimeConfig } = resolveCronAgent(job.agentId);
			const sessionKey = resolveCronSessionTargetSessionKey(job.sessionTarget) ?? `cron:${job.id}`;
			const reviewAgentId = skillCollectionReviewMonitorAgentId(job);
			if (reviewAgentId && resolveSkillWorkshopConfig(runtimeConfig).autonomous.mode !== "auto") return {
				status: "skipped",
				summary: "Skill collection review disabled."
			};
			const executionRoot = reviewAgentId ? resolveWorkshopSkillsDir(runtimeConfig, agentId) : void 0;
			if (executionRoot) await fs.mkdir(executionRoot, { recursive: true });
			try {
				return await runCronIsolatedAgentTurn({
					...request,
					cfg: runtimeConfig,
					deps: params.deps,
					agentId,
					sessionKey,
					lane: "cron",
					executionRoot,
					skillsSnapshot: executionRoot ? {
						prompt: "",
						skills: []
					} : void 0
				});
			} finally {
				if (executionRoot) bumpSkillsSnapshotVersion({ reason: "workshop" });
			}
		},
		runCommandJob: async ({ job, abortSignal }) => {
			const result = await runCronCommandJob({
				job,
				abortSignal,
				nowMs: Date.now
			});
			if (typeof result.summary === "string" && isSilentReplyText(result.summary, "NO_REPLY")) {
				const { summary: _summary, ...silentResult } = result;
				const completion = await finalizeCronCompletionAnnouncement({
					job,
					suppressionReason: "silent",
					deps: params.deps,
					resolveCronAgent,
					logger: cronLogger,
					label: "command"
				});
				return {
					...silentResult,
					...completion
				};
			}
			const completion = await finalizeCronCompletionAnnouncement({
				job,
				text: typeof result.summary === "string" && result.summary.trim() ? redactCronCommandSummaryForExternalDelivery(result.summary) : void 0,
				runStartedAtMs: job.state.runningAtMs,
				abortSignal,
				deps: params.deps,
				resolveCronAgent,
				logger: cronLogger,
				label: "command",
				traceResolvedFailure: true
			});
			return {
				...result,
				...completion
			};
		},
		sendCronWebhook: async ({ job, event, abortSignal, onDeliveryAccepted }) => {
			await sendGatewayCronWebhook({
				job,
				event,
				abortSignal,
				onDeliveryAccepted,
				webhookToken: params.cfg.cron?.webhookToken,
				ssrfPolicy: webhookSsrfPolicy
			});
		},
		runScriptJob: async ({ job, streamBatch, abortSignal, executionIdentity }) => {
			if (!scriptRuntime || job.payload.kind !== "script") return {
				status: "error",
				error: "cron script payload executor is unavailable",
				...cronScriptFailureMetadata("payload", "runtime_unavailable")
			};
			const execution = await scriptRuntime.executePayload({
				job,
				streamBatch,
				abortSignal,
				executionIdentity
			});
			if (execution.kind === "error") return {
				status: "error",
				error: `cron script payload failed (${execution.code}): ${execution.error}`,
				...cronScriptFailureMetadata("payload", execution.code)
			};
			if (execution.nextCheck && !job.pacing) return {
				status: "error",
				error: "cron script payload returned nextCheck, but this job has no pacing bounds",
				...cronScriptFailureMetadata("payload", "invalid_input")
			};
			const notify = execution.notify?.trim() ? execution.notify : void 0;
			const base = {
				status: "ok",
				notify,
				wake: execution.wake,
				stateChanged: execution.stateChanged,
				...execution.stateChanged ? { state: execution.state } : {},
				nextCheck: execution.nextCheck
			};
			const completion = await finalizeCronCompletionAnnouncement({
				job,
				text: job.sessionTarget === "main" ? void 0 : notify,
				runStartedAtMs: job.state.runningAtMs,
				abortSignal,
				deps: params.deps,
				resolveCronAgent,
				logger: cronLogger,
				label: "script payload"
			});
			return {
				...base,
				...completion
			};
		},
		cleanupTimedOutAgentRun: async ({ job, execution }) => {
			if (!execution?.sessionId) return;
			const result = await abortAndDrainEmbeddedAgentRun({
				sessionId: execution.sessionId,
				sessionKey: execution.sessionKey,
				settleMs: 15e3,
				forceClear: true,
				reason: "cron_timeout"
			});
			cronLogger.warn({
				jobId: job.id,
				sessionId: execution.sessionId,
				sessionKey: execution.sessionKey,
				aborted: result.aborted,
				drained: result.drained,
				forceCleared: result.forceCleared
			}, "cron: cleaned up timed-out agent run");
			await retireSessionMcpRuntime({
				sessionId: execution.sessionId,
				reason: "cron-timeout-cleanup",
				onError: (error, sid) => {
					cronLogger.warn({
						jobId: job.id,
						sessionId: sid
					}, `cron: failed to retire MCP runtime for timed-out session: ${String(error)}`);
				}
			}).catch(() => {});
		},
		onIsolatedAgentSetupTimeout: ({ job, error, timeoutMs }) => {
			cronLogger.warn({
				jobId: job.id,
				jobName: job.name,
				timeoutMs,
				error
			}, "cron: isolated agent setup timed out before runner start; backing off job without gateway restart");
		},
		sendCronFailureAlert: async (alert) => await sendGatewayCronFailureAlert({
			...alert,
			deps: params.deps,
			logger: cronServiceLogger,
			resolveCronAgent,
			webhookToken: params.cfg.cron?.webhookToken,
			ssrfPolicy: webhookSsrfPolicy
		}),
		log: toPinoLikeLogger(getChildLogger({
			module: "cron",
			storeKey: storePath
		}), getResolvedLoggerSettings().level),
		onEvent: (evt) => {
			invalidateSessionAutomationIndex();
			const jobSnapshot = evt.job ?? cron.getJob(evt.jobId);
			const scopedSessionKey = jobSnapshot?.owner?.sessionKey ?? (jobSnapshot && resolveCronSessionTargetSessionKey(jobSnapshot.sessionTarget)) ?? jobSnapshot?.sessionKey ?? evt.sessionKey;
			const scopedAgentId = jobSnapshot?.owner?.agentId ?? jobSnapshot?.agentId;
			params.broadcast("cron", evt.job ? {
				...evt,
				job: toPublicCronJob(evt.job)
			} : evt, {
				dropIfSlow: true,
				...scopedSessionKey ? {
					sessionKeys: [scopedSessionKey],
					...scopedAgentId ? { agentId: scopedAgentId } : {}
				} : {}
			});
			const pluginJob = jobSnapshot ? toPluginCronJob(jobSnapshot) : void 0;
			const hookSummary = isCommandCronJob(jobSnapshot) && typeof evt.summary === "string" ? redactCronCommandSummaryForExternalDelivery(evt.summary) : evt.summary;
			const hookEvt = {
				action: evt.action,
				jobId: evt.jobId,
				...pluginJob ? { job: pluginJob } : {},
				sessionTarget: jobSnapshot?.sessionTarget,
				agentId: jobSnapshot?.agentId,
				...pickDefined(evt, [
					"runAtMs",
					"durationMs",
					"status",
					"completionStatus",
					"error",
					"delivered",
					"deliveryStatus",
					"deliveryError",
					"deliverySuppressionReason",
					"sessionId",
					"sessionKey",
					"runId",
					"nextRunAtMs",
					"model",
					"provider"
				]),
				...hookSummary !== void 0 ? { summary: hookSummary } : {}
			};
			runCronChangedHook(hookEvt);
			if (evt.action === "added" || evt.action === "updated" || evt.action === "removed") {
				broadcastCronBoundSessionChanges(evt);
				reconcileExitWatchers();
				if (evt.action !== "updated") routeStreamWatcherMutation(evt.jobId, evt.job ?? cron.getJob(evt.jobId), evt.action).catch((err) => {
					cronLogger.warn({
						err: formatErrorMessage(err),
						jobId: evt.jobId
					}, "cron-stream: route failed");
				});
			} else if (evt.action === "finished") {
				const finishedJob = evt.job ?? cron.getJob(evt.jobId);
				if (finishedJob?.enabled === false) {
					broadcastCronBoundSessionChanges(evt);
					routeStreamWatcherMutation(evt.jobId, finishedJob, "finished").catch((err) => {
						cronLogger.warn({
							err: formatErrorMessage(err),
							jobId: evt.jobId
						}, "cron-stream: route failed");
					});
				}
			}
			if (evt.action === "finished") dispatchGatewayCronFinishedNotifications({
				evt,
				job: evt.job ?? cron.getJob(evt.jobId),
				deps: params.deps,
				logger: cronServiceLogger,
				resolveCronAgent,
				webhookToken: params.cfg.cron?.webhookToken,
				ssrfPolicy: webhookSsrfPolicy
			});
		}
	});
	const exitWatcherHandlers = {
		getProcessSupervisor,
		fireOnExit: async (job, exit, controls) => {
			if (exitWatcherHandoffReady && !await racePromiseWithAbortSignal(exitWatcherHandoffReady.result.promise, controls.signal)) throw new Error("cron on-exit replacement scheduler did not start");
			controls.commitGuard();
			if (getGatewaySuspendAdmissionPhase() === "draining") {
				const completionToken = (current) => {
					controls.commitGuard();
					if (!current.enabled || current.updatedAtMs !== job.updatedAtMs) throw new Error("cron on-exit job changed before completion");
				};
				terminalExitCompletionTokens.set(job.id, completionToken);
				controls.onTerminalWriteStarted();
				try {
					await cron.updateWithPrecondition(job.id, { enabled: false }, completionToken, { commitGuard: controls.commitGuard });
					controls.onReserved();
					controls.commitGuard();
					throw new Error(`cron on-exit run was not admitted: gateway draining\n\n${truncateUtf16WithEllipsis(formatOnExitRunSummary(exit), 2e3)}`);
				} finally {
					if (terminalExitCompletionTokens.get(job.id) === completionToken) terminalExitCompletionTokens.delete(job.id);
					reconcileExitWatchers();
				}
			}
			await runWithGatewayIndependentRootWorkAdmission(async () => fireOnExitJob(job, exit, { run: (jobId, payload) => cron.runOnExit(jobId, {
				schedule: job.schedule,
				signal: controls.signal,
				commitGuard: controls.commitGuard,
				onReserved: controls.onReserved,
				payload
			}) }), "cron:exit-hook", controls.signal);
		},
		updateWatcherState: async (job, patch) => await runWithGatewayIndependentRootWorkAdmission(async () => {
			try {
				return await cron.updateWithPrecondition(job.id, { state: patch }, (current) => {
					if (!current.enabled || current.schedule.kind !== "on-exit" || current.updatedAtMs !== job.updatedAtMs) throw new Error("cron on-exit job changed before watcher-state write");
				});
			} catch {
				return;
			}
		}, "cron:watcher-state"),
		logger: cronServiceLogger
	};
	exitWatchersRef.current = createCronExitWatchers(exitWatcherHandlers);
	cron.update.bind(cron);
	streamWatchersRef.current = createCronStreamWatchers({
		getProcessSupervisor,
		updateState: async (jobId, patch, streamScheduleKey, streamSourceIdentity) => {
			return await cron.updateExternalState(jobId, streamScheduleKey, streamSourceIdentity, patch);
		},
		retireSource: async (jobId, streamScheduleKey, streamSourceIdentity) => await cron.retireExternalStreamSource(jobId, streamScheduleKey, streamSourceIdentity),
		updateCounters: async (jobId, counters) => {
			await cron.updateExternalCounters(jobId, counters);
		},
		recordFailure: async (jobId, error, patch, streamScheduleKey, streamSourceIdentity) => {
			await cron.recordExternalFailure(jobId, error, patch, {
				scheduleKey: streamScheduleKey,
				identity: streamSourceIdentity
			});
		},
		fireBatch: (job, batch, streamScheduleKey, streamSourceIdentity) => runWithGatewayIndependentRootWorkAdmission(async () => fireStreamJob(job, { run: async (jobId, onDisposition) => {
			return {
				...await cron.run(jobId, "force", {
					evaluateTrigger: true,
					streamBatch: batch,
					streamScheduleKey,
					streamSourceIdentity,
					onTriggerDisposition: onDisposition
				}),
				enabled: cron.getJob(jobId)?.enabled
			};
		} }), "cron:stream-batch"),
		logger: cronServiceLogger
	});
	const routeLiveStreamJob = async (jobId) => {
		const current = cron.getJob(jobId);
		await routeStreamWatcherMutation(jobId, current, current ? "updated" : "removed");
	};
	const queueStreamStopAfterValidation = (current, patch, nowMs) => {
		if (current.schedule.kind !== "stream" || patch.enabled !== false && patch.schedule === void 0) return;
		const validated = structuredClone(current);
		applyJobPatch(validated, patch, {
			defaultAgentId: cron.getDefaultAgentId(),
			scheduleValidationNowMs: nowMs,
			cronConfig: params.cfg.cron
		});
		if (validated.enabled && validated.schedule.kind === "stream" && cronStreamScheduleKey(validated.schedule) === cronStreamScheduleKey(current.schedule)) return;
		return streamWatchersRef.current?.stop(current.id, patch.schedule !== void 0 ? "schedule-update" : "disabled");
	};
	const cancelDisabledExitWatcher = (job) => {
		if (job.enabled || job.schedule.kind !== "on-exit") return;
		exitWatcherMutationRevision += 1;
		exitWatchersRef.current?.cancel(job.id);
	};
	const addCron = cron.add.bind(cron);
	cron.add = async (input, options) => {
		const result = await addCron(input, options);
		const addedJob = "job" in result ? result.job : result;
		if (options?.enabledExplicit && !input.enabled) cancelDisabledExitWatcher(addedJob);
		await routeStreamWatcherMutation(addedJob.id, addedJob, "added");
		return result;
	};
	const settleStopAfterCommittedUpdate = async (jobId, lifecycleStop) => {
		try {
			await lifecycleStop;
		} catch (error) {
			cronLogger.warn({
				jobId,
				err: String(error)
			}, "cron-stream: source teardown failed after committed update");
		}
	};
	const routeLiveStreamJobLogged = async (jobId) => {
		try {
			await routeLiveStreamJob(jobId);
		} catch (error) {
			cronLogger.warn({
				jobId,
				err: String(error)
			}, "cron-stream: post-commit lifecycle routing failed");
		}
	};
	const updateCronWithPrecondition = cron.updateWithPrecondition.bind(cron);
	const updateWithWatchers = async (jobId, patch, opts, precondition) => {
		let lifecycleStop;
		const routeAfterValidation = (current, nowMs) => {
			lifecycleStop = queueStreamStopAfterValidation(current, patch, nowMs);
		};
		const beforeUpdate = precondition ? async (current, nowMs) => {
			await precondition(current, nowMs);
			routeAfterValidation(current, nowMs);
		} : routeAfterValidation;
		try {
			const result = await updateCronWithPrecondition(jobId, patch, beforeUpdate, opts);
			if (patch.enabled === false && (!precondition || terminalExitCompletionTokens.get(jobId) !== precondition)) cancelDisabledExitWatcher(result);
			await settleStopAfterCommittedUpdate(jobId, lifecycleStop);
			await routeLiveStreamJobLogged(jobId);
			return result;
		} catch (error) {
			await lifecycleStop?.catch(() => void 0);
			if (lifecycleStop) await routeLiveStreamJobLogged(jobId);
			throw error;
		}
	};
	cron.update = (jobId, patch, opts) => updateWithWatchers(jobId, patch, opts);
	cron.updateWithPrecondition = (jobId, patch, precondition, opts) => updateWithWatchers(jobId, patch, opts, precondition);
	const removeCron = cron.remove.bind(cron);
	cron.remove = async (jobId, opts) => {
		const previous = cron.getJob(jobId);
		try {
			if (previous?.schedule.kind === "stream") await streamWatchersRef.current?.stop(jobId, "removed", previous);
			const result = await removeCron(jobId, opts);
			if (!result.removed) await routeLiveStreamJobLogged(jobId);
			return result;
		} catch (error) {
			await routeLiveStreamJobLogged(jobId);
			throw error;
		}
	};
	const getCronSuspensionBlockerCount = cron.getSuspensionBlockerCount.bind(cron);
	cron.getSuspensionBlockerCount = () => getCronSuspensionBlockerCount() + exitWatcherReconciliations + streamWatcherReconciliations + (exitWatchersRef.current?.activeJobIds().length ?? 0) + (streamWatchersRef.current?.activeJobIds().length ?? 0);
	let exitWatchersStopPromise;
	const stopExitWatchers = () => {
		exitWatchersStopped = true;
		exitWatcherGeneration += 1;
		exitWatchersStopPromise ??= exitWatchersRef.current?.cancelAll() ?? Promise.resolve();
	};
	let streamWatchersStopPromise;
	const stopStreamWatchers = () => {
		if (streamWatchersStopPromise) return streamWatchersStopPromise;
		const stopPromise = (async () => {
			streamWatcherGeneration += 1;
			streamWatchersStopped = true;
			await streamWatchersRef.current?.stopAll("shutdown");
		})();
		streamWatchersStopPromise = stopPromise;
		stopPromise.catch(() => {
			if (streamWatchersStopPromise === stopPromise) streamWatchersStopPromise = void 0;
		});
		return stopPromise;
	};
	const automationSource = {
		getJobs: () => cron.getLoadedJobs(),
		getDefaultAgentId: () => cron.getDefaultAgentId()
	};
	const automationEpoch = claimSessionAutomationEpoch();
	const stopCron = cron.stop.bind(cron);
	const stopCronLifecycle = (preserveExitWatchers = false) => {
		settleExitWatcherHandoff(false);
		try {
			stopCron();
			if (preserveExitWatchers) {
				exitWatchersStopped = true;
				exitWatcherGeneration += 1;
			} else stopExitWatchers();
			stopSystemJobReconcileRetry();
			stopStreamWatchers().catch((err) => {
				cronLogger.warn({ err: formatErrorMessage(err) }, "cron-stream: asynchronous teardown failed");
			});
		} finally {
			unregisterSessionAutomationSource(automationSource);
		}
	};
	cron.stop = () => {
		stopCronLifecycle();
	};
	const stopAndDrainCron = async (preserveExitWatchers = false) => {
		stopCronLifecycle(preserveExitWatchers);
		const exitWatchersStop = exitWatchersStopPromise ?? Promise.resolve();
		const streamWatchersStop = stopStreamWatchers().then(() => ({ ok: true }), (error) => ({
			ok: false,
			error
		}));
		const abortedRuns = abortActiveCronTaskRuns("Gateway shutting down.");
		const [activeRunDrain, , streamWatchersResult] = await Promise.all([
			waitForActiveCronTaskRuns(CRON_ACTIVE_RUN_SHUTDOWN_DRAIN_MS),
			exitWatchersStop,
			streamWatchersStop
		]);
		if (!activeRunDrain.drained) cronLogger.warn({
			abortedRuns,
			activeRuns: activeRunDrain.active
		}, "cron: active runs did not drain before shutdown timeout");
		if (!streamWatchersResult.ok) throw streamWatchersResult.error;
	};
	cron.stopAndDrain = async () => {
		await stopAndDrainCron();
	};
	let systemJobReconcileEpoch = 0;
	let systemJobReconcileTail = Promise.resolve("converged");
	let systemJobRetryTimer;
	const stopSystemJobReconcileRetry = () => {
		systemJobReconcileEpoch += 1;
		clearTimeout(systemJobRetryTimer);
		systemJobRetryTimer = void 0;
	};
	const reconcileSystemJobs = () => {
		stopSystemJobReconcileRetry();
		const epoch = systemJobReconcileEpoch;
		const pass = async () => {
			const cfg = getRuntimeConfig();
			const assertCurrent = () => {
				if (epoch !== systemJobReconcileEpoch || cfg !== getRuntimeConfig()) throw new GatewaySystemJobReconciliationSupersededError();
			};
			try {
				assertCurrent();
				let converged = true;
				for (const reconcile of [reconcileHeartbeatMonitorJobs, reconcileSkillCollectionReviewJobs]) {
					const { ok } = await reconcile({
						cron,
						cfg,
						logger: cronServiceLogger,
						commitGuard: assertCurrent
					});
					assertCurrent();
					converged &&= ok;
				}
				if (!converged) {
					systemJobRetryTimer = setTimeout(() => {
						systemJobRetryTimer = void 0;
						reconcileSystemJobs();
					}, 3e4);
					systemJobRetryTimer.unref?.();
				}
				return converged ? "converged" : "retry-scheduled";
			} catch (error) {
				if (!(error instanceof GatewaySystemJobReconciliationSupersededError)) throw error;
				return epoch === systemJobReconcileEpoch ? await pass() : "superseded";
			}
		};
		systemJobReconcileTail = systemJobReconcileTail.then(pass, pass);
		return systemJobReconcileTail;
	};
	const startCron = cron.start.bind(cron);
	cron.start = async () => {
		if (exitWatcherHandoffReady?.settled) exitWatcherHandoffReady = {
			result: createDeferredCore(),
			settled: false
		};
		const handoff = exitWatcherHandoffReady;
		const exitGeneration = exitWatcherGeneration;
		const streamGeneration = streamWatcherGeneration;
		const lifecycleChanged = () => exitGeneration !== exitWatcherGeneration || streamGeneration !== streamWatcherGeneration;
		await exitWatchersStopPromise;
		if (lifecycleChanged()) return;
		await startCron();
		if (lifecycleChanged()) return;
		exitWatchersStopped = false;
		streamWatchersStopped = false;
		exitWatchersStopPromise = void 0;
		streamWatchersStopPromise = void 0;
		streamWatchersRef.current?.resume();
		if (lifecycleChanged()) return;
		await reconcileStreamWatchers();
		if (lifecycleChanged()) return;
		await reconcileSystemJobs();
		if (lifecycleChanged()) return;
		registerSessionAutomationSource(automationSource, automationEpoch);
		params.broadcast("sessions.changed", {
			reason: "cron-bindings-loaded",
			ts: Date.now()
		}, { dropIfSlow: true });
		if (handoff) settleExitWatcherHandoff(true, handoff);
	};
	return {
		cron,
		storePath,
		cronEnabled,
		prepareExitWatcherHandoff: async () => ({
			current: () => exitWatchersRef.current,
			adopt: (watchers) => {
				if (watchers !== exitWatchersRef.current) {
					settleExitWatcherHandoff(false);
					exitWatcherHandoffReady = {
						result: createDeferredCore(),
						settled: false
					};
					exitWatcherGeneration += 1;
				}
				exitWatchersRef.current = watchers;
				return watchers.updateHandlers(exitWatcherHandlers);
			},
			stopOwner: async () => {
				await stopAndDrainCron(true);
			}
		}),
		reconcileExitWatchers,
		reconcileStreamWatchers,
		stopStreamWatchers,
		reconcileSystemJobs
	};
}
//#endregion
export { buildGatewayCronService };
