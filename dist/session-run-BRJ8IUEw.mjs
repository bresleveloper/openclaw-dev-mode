import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { ot as STARTUP_INTERRUPTED_ERROR } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { r as captureSessionEventTargetForHost, t as enqueueSessionEventForHost } from "./session-event-handoff-BLWR3ywE.mjs";
import { n as SILENT_REPLY_TOKEN } from "./tokens-DHFPcfdZ.mjs";
import "./config-B3oiWDlr.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { n as mapHookExternalContentSource, r as resolveHookExternalContentSource, t as isExternalHookSession } from "./external-content-source-BKc9v74i.mjs";
import { n as resolveCronStyleNow } from "./current-time-DzUuABk8.mjs";
import { a as resolveCronDeliveryContext, r as finalizeCronPromptForResolvedTools, t as buildCronDeliveryTrace } from "./run-delivery-trace-B5sykZWn.mjs";
//#region src/cron/run-prompt.ts
const cronExternalContentRuntimeLoader = createLazyImportLoader(() => import("./run-external-content.runtime.js"));
function appendCronUnattendedRunPreamble(commandBody, opts) {
	const core = `This is an unattended scheduled run. Nobody is present to clarify or approve, so complete the task with what you have. Your final reply is the deliverable — not a plan, an acknowledgement, or a request for input. If nothing needs doing, reply with exactly ${SILENT_REPLY_TOKEN} as the entire final answer. ${SILENT_REPLY_TOKEN} discards anything written this turn that was not sent, so send confirmations before ending silently. If you cannot complete the task, explain what blocked it and what you tried.`;
	const trustedExtra = " Where the job's own instructions conflict with this preamble, the job's instructions win (a question or plan the job explicitly requests is a valid deliverable). If this job is no longer needed, remove it if your available tools allow.";
	const restartGuidance = opts.restartContinuation ? "\n\nThe previous attempt was interrupted by a Gateway restart. Continue the unfinished task. Inspect the retained conversation and any tool effects before acting; do not repeat work or deliveries that already completed." : "";
	return `${commandBody}\n\n${core}${opts.externalHook ? "" : trustedExtra}${restartGuidance}`;
}
/** Builds the cron prompt while preserving hook wrapping and the stable unattended suffix. */
async function buildCronCommandBody(params) {
	const { job, message, baseSessionKey, hookExternalContentSource, timeLine } = params;
	const sourcePromptPrefix = `[cron:${job.id} ${job.name}]`;
	const base = `${sourcePromptPrefix} ${message}`.trim();
	const isExternalHook = hookExternalContentSource !== void 0 || isExternalHookSession(baseSessionKey);
	const allowUnsafeExternalContent = job.payload.kind === "agentTurn" && job.payload.allowUnsafeExternalContent === true || hookExternalContentSource === "gmail" && params.cfg.hooks?.gmail?.allowUnsafeExternalContent === true;
	const shouldWrapExternal = isExternalHook && !allowUnsafeExternalContent;
	let commandBody;
	if (isExternalHook) {
		const { detectSuspiciousPatterns } = await cronExternalContentRuntimeLoader.load();
		const suspiciousPatterns = detectSuspiciousPatterns(message);
		if (suspiciousPatterns.length > 0) logWarn(`[security] Suspicious patterns detected in external hook content (session=${baseSessionKey}, patterns=${suspiciousPatterns.length}): ${suspiciousPatterns.slice(0, 3).join(", ")}`);
	}
	if (shouldWrapExternal) {
		const { buildSafeExternalPrompt } = await cronExternalContentRuntimeLoader.load();
		commandBody = `${buildSafeExternalPrompt({
			content: message,
			source: mapHookExternalContentSource(hookExternalContentSource ?? "webhook"),
			jobName: job.name,
			jobId: job.id,
			timestamp: params.formattedTime
		})}\n\n${timeLine}`.trim();
	} else commandBody = `${base}\n${timeLine}`.trim();
	commandBody = appendCronUnattendedRunPreamble(commandBody, {
		externalHook: isExternalHook,
		restartContinuation: job.state?.lastError === STARTUP_INTERRUPTED_ERROR
	});
	return {
		sourcePromptPrefix,
		isExternalHook,
		commandBody
	};
}
//#endregion
//#region src/cron/session-run.ts
async function runCronSessionTurn(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { job } = params;
		await params.prepare?.();
		params.assertCurrent();
		let operatorAuthority;
		let controlUiAdmin;
		const operatorLease = _usingCtx$1.u(new DisposableStack());
		const assertCurrent = () => {
			params.assertCurrent();
			operatorAuthority?.assertCurrent();
		};
		const delivery = await resolveCronDeliveryContext(params);
		assertCurrent();
		const expectedTarget = await captureSessionEventTargetForHost(params.agentId, params.sessionKey, { assertCurrent });
		assertCurrent();
		if (job.operatorSource) {
			const { restoreCronOperatorSource } = await import("./cron-operator-source-DjXpJWR2.mjs");
			const operator = await restoreCronOperatorSource({
				job,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				entry: expectedTarget,
				signal: params.abortSignal,
				deliveryAttemptFence: params.deliveryAttemptFence
			});
			if (operator) {
				operatorLease.defer(operator.release);
				operatorAuthority = operator.authority;
				controlUiAdmin = operator.controlUiAdmin ? true : void 0;
			}
			assertCurrent();
		}
		const requestedChat = delivery.deliveryRequested && delivery.deliveryPlan.mode !== "webhook";
		const deliveryError = requestedChat && !delivery.resolvedDelivery.ok ? delivery.resolvedDelivery.error.message : void 0;
		const route = delivery.resolvedDelivery.ok ? delivery.resolvedDelivery : void 0;
		const beforeDeliver = async () => {
			await params.prepare?.();
			assertCurrent();
			const cfg = readRuntimeConfig();
			const current = await resolveCronDeliveryContext({
				...params,
				cfg
			});
			assertCurrent();
			if (!current.deliveryRequested || !current.resolvedDelivery.ok || !route || current.resolvedDelivery.channel !== route.channel || current.resolvedDelivery.to !== route.to || current.resolvedDelivery.accountId !== route.accountId || current.resolvedDelivery.threadId !== route.threadId) throw new Error("Automation delivery policy or route changed while queued; inspect the run and retry with the current destination");
			await params.deliveryAttemptFence?.beforeAttempt();
			assertCurrent();
		};
		const baseSessionKey = parseAgentSessionKey(params.sessionKey)?.rest ?? params.sessionKey;
		const externalSource = (job.payload.kind === "agentTurn" ? job.payload.externalContentSource : void 0) ?? resolveHookExternalContentSource(baseSessionKey);
		const promptTimeMs = Date.now();
		let sessionId;
		const result = await enqueueSessionEventForHost(params.text, {
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			source: "cron",
			contextKey: `cron:${job.id}`,
			expectedTarget,
			createIfMissing: true,
			deliveryContext: route,
			abortSignal: params.abortSignal,
			scheduledAutomation: {
				job,
				operatorAuthority,
				controlUiAdmin,
				admissionSource: params.admissionSource,
				prepare: params.prepare,
				preparePrompt: async (cfg) => {
					const { commandBody } = await buildCronCommandBody({
						job,
						cfg,
						message: params.text,
						baseSessionKey,
						hookExternalContentSource: externalSource,
						...resolveCronStyleNow(cfg, promptTimeMs)
					});
					return commandBody;
				},
				executionIdentity: params.executionIdentity,
				deliveryAttemptFence: requestedChat && route && params.deliveryAttemptFence ? {
					...params.deliveryAttemptFence,
					beforeAttempt: beforeDeliver
				} : params.deliveryAttemptFence,
				assertCurrent,
				beforeDeliver,
				sourceDelivery: delivery.sourceDelivery,
				finalizePromptForResolvedTools: (candidate) => finalizeCronPromptForResolvedTools({
					...candidate,
					deliveryRequested: delivery.deliveryRequested,
					resolvedDelivery: delivery.resolvedDelivery,
					sourceDelivery: delivery.sourceDelivery,
					messageToolFormatPrompt: delivery.messageToolFormatPrompt
				}),
				onLaneWait: params.onLaneWait,
				onExecutionStarted: (info) => {
					sessionId = info.sessionId;
					params.onExecutionStarted?.({
						jobId: job.id,
						agentId: params.agentId,
						sessionId,
						sessionKey: info.sessionKey,
						runId: info.runId,
						provider: info.provider,
						model: info.model,
						isFallback: info.isFallback,
						phase: "runner_entered"
					});
				},
				onExecutionPhase: params.onExecutionPhase
			},
			deliver: requestedChat && !deliveryError
		}).settled;
		return {
			...result.automationResult,
			status: result.status === "completed" ? "ok" : "error",
			interruptedByRestart: result.interruptedByRestart,
			error: result.error ?? (result.status === "cancelled" ? "Automation session turn was cancelled" : void 0),
			summary: result.summary,
			sessionId,
			sessionKey: expectedTarget.sessionKey,
			executionStarted: result.executionStarted,
			delivered: result.deliveryAmbiguous ? void 0 : result.delivered,
			deliveryState: result.deliveryAmbiguous ? {
				status: "unknown",
				failureNotification: { status: "not-requested" }
			} : void 0,
			deliveryError: result.deliveryError ?? deliveryError,
			deliveryAttempted: result.deliveryAttempted,
			deliverySuppressionReason: result.deliverySuppressionReason,
			delivery: buildCronDeliveryTrace({
				deliveryPlan: delivery.deliveryPlan,
				resolvedDelivery: delivery.resolvedDelivery,
				sourceDeliveryOutcome: result.sourceDeliveryOutcome ?? {
					visibleDeliveries: [],
					verifiedMessageToolDelivery: false,
					satisfiesSourceDelivery: result.delivered && !result.deliveryAmbiguous,
					unverifiedMessageToolDelivery: false
				},
				fallbackUsed: false,
				delivered: result.deliveryAmbiguous ? void 0 : result.delivered
			}),
			...result.nextCheckMs !== void 0 ? { nextCheck: { delayMs: result.nextCheckMs } } : {}
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
export { runCronSessionTurn };
