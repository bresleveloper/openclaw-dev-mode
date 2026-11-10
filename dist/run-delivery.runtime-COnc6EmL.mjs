import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { ct as resolveAdmittedCronCompletionStatus } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { _ as toAgentStoreSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as mergeCronRunDiagnostics, n as createCronRunDiagnosticsFromError } from "./run-diagnostics-DHdTDo8H.mjs";
import { o as isSilentReplyText } from "./tokens-DHFPcfdZ.mjs";
import { a as normalizeCronRunErrorText } from "./execution-errors-MLvRe_c_.mjs";
import { i as resolveControlUiSessionUrl } from "./control-ui-link-base-C4cbCE5S.mjs";
import { n as resolveMessageToolDeliveryFormatPrompt, t as buildDeliveryFormatPrompt } from "./delivery-format-prompt-DFV20sdy.mjs";
import { t as cleanupCronRunSessionAfterRun } from "./session-cleanup-C6JhW0Um.mjs";
import { n as isLikelyInterimCronMessage } from "./subagent-followup-hints-BBePQpRw.mjs";
import { c as normalizeSilentReplyText, d as resolveStaleCronDeliveryError, l as resolveDescendantSubagentFollowup, n as normalizeDirectCronDeliveryPayloads, o as logCronDeliveryWarn, u as resolveDirectCronDeliveryGeneration } from "./delivery-payload-normalization-CTaUlqpR.mjs";
import { t as pickSummaryFromOutput } from "./helpers-Dt4VJPjQ.mjs";
import { n as requiresExternalCronDelivery, r as resolveDeliveryTarget } from "./delivery-target-Djb3Xk-t.mjs";
//#region src/cron/isolated-agent/delivery-dispatch.ts
const followup = createLazyImportLoader(() => import("./subagent-followup.runtime.js"));
const conversationResult = createLazyImportLoader(() => import("./conversation-result-BXnr5iIk.mjs"));
const notification = createLazyImportLoader(() => import("./delivery-CogXmUQ3.mjs"));
async function dispatchCronDelivery(params) {
	let { summary, outputText, synthesizedText, deliveryPayloads } = params;
	let diagnostics;
	const sentByTool = params.sourceDeliveryOutcome.satisfiesSourceDelivery;
	const state = {
		status: params.deliveryRequested ? "not-delivered" : "not-requested",
		delivered: false,
		failureNotification: { status: "not-requested" }
	};
	let deliveryAttempted = params.sourceDeliveryOutcome.verifiedMessageToolDelivery;
	const record = (status, error, reason) => {
		state.status = status;
		state.delivered = status === "delivered" ? true : status === "not-delivered" ? false : void 0;
		state.error = error;
		state.deliverySuppressionReason = reason;
	};
	if (params.sourceDeliveryOutcome.verifiedMessageToolDelivery) record("delivered");
	const adoptChild = (text) => {
		synthesizedText = text;
		outputText = synthesizedText;
		summary = pickSummaryFromOutput(synthesizedText) ?? summary;
		deliveryPayloads = [{ text: synthesizedText }];
	};
	const finish = async (disposition) => {
		const failed = disposition?.kind === "error" && disposition.errorKind !== "delivery-target";
		const completion = resolveAdmittedCronCompletionStatus(params.job, failed ? "error" : params.undeliveredRunStatus, state.status, state.deliverySuppressionReason);
		if (state.status === "delivered" || state.status === "not-requested" && !failed || completion === "succeeded") await cleanupCronRunSessionAfterRun({
			job: params.job,
			agentSessionKey: params.agentSessionKey,
			sessionId: params.sessionId,
			lifecycleRevision: params.lifecycleRevision,
			sessionUpdatedAt: params.sessionUpdatedAt,
			beforeDelete: params.beforeSessionDelete,
			reason: "cron-delete-after-run-fallback"
		});
		return {
			...disposition ? { disposition } : {},
			deliveryState: state,
			delivered: state.delivered,
			deliveryAttempted,
			deliveryError: state.error,
			deliverySuppressionReason: state.deliverySuppressionReason,
			summary,
			outputText,
			synthesizedText,
			deliveryPayloads,
			diagnostics
		};
	};
	const failTarget = (error) => {
		const detail = params.sourceDeliveryOutcome.unverifiedMessageToolDelivery ? error + "; the agent used the message tool, but OpenClaw could not verify that message matched the cron delivery target" : error;
		record("not-delivered", detail);
		return finish({
			kind: "error",
			error: detail,
			errorKind: "delivery-target"
		});
	};
	if (!params.deliveryRequested) {
		if (params.deliveryPlan.mode === "none" && params.spawnOnlyHandoff) {
			const child = await (await followup.load()).waitForDescendantSubagentResult({
				sessionKey: params.runSessionKey,
				runStartedAt: params.runStartedAt,
				timeoutMs: params.timeoutMs,
				abortSignal: params.abortSignal
			});
			if (!child?.reply || params.isAborted()) return finish({
				kind: "error",
				error: params.isAborted() ? params.abortReason() : child ? "cron child-session handoff completed without a final assistant payload" : "cron child-session handoff timed out before producing a final assistant payload",
				delivered: false
			});
			if (!isSilentReplyText(child.reply, "NO_REPLY")) adoptChild(child.reply);
		}
		return finish();
	}
	if (params.skipDelivery && !sentByTool) {
		deliveryAttempted = true;
		record("not-delivered", void 0, params.skipDelivery);
		return finish({ kind: "suppressed" });
	}
	if (params.isAborted()) return finish({
		kind: "error",
		error: params.abortReason()
	});
	if (!sentByTool && !params.resolvedDelivery.ok && (requiresExternalCronDelivery(params.deliveryPlan, params.resolvedDelivery) || !params.sourceSessionKey && params.job.sessionTarget !== "current")) {
		if (params.deliveryBestEffort) {
			record("not-delivered", params.resolvedDelivery.error.message);
			await logCronDeliveryWarn(params.resolvedDelivery.error.message);
			return finish({ kind: "suppressed" });
		}
		return failTarget(params.resolvedDelivery.error.message);
	}
	if (!sentByTool && (synthesizedText || params.spawnOnlyHandoff)) {
		const initial = synthesizedText?.trim() ?? "";
		const child = await resolveDescendantSubagentFollowup({
			sessionKey: params.runSessionKey,
			runStartedAt: params.runStartedAt,
			timeoutMs: params.timeoutMs,
			deliveryBestEffort: params.deliveryBestEffort,
			spawnOnlyHandoff: params.spawnOnlyHandoff,
			initialSynthesizedText: initial,
			abortSignal: params.abortSignal
		});
		if (child.finalReply) {
			if (isSilentReplyText(child.finalReply, "NO_REPLY")) {
				deliveryAttempted = true;
				record("not-delivered", void 0, "silent");
				return finish({ kind: "suppressed" });
			}
			adoptChild(child.finalReply);
		}
		if (params.spawnOnlyHandoff && !synthesizedText?.trim()) {
			deliveryAttempted = true;
			return finish({
				kind: "error",
				error: params.isAborted() ? params.abortReason() : child.hasUnsettledDescendants ? "cron child-session handoff timed out before producing a final assistant payload" : "cron child-session handoff completed without a final assistant payload",
				delivered: false
			});
		}
		if (!params.deliveryBestEffort && child.hasUnsettledDescendants || child.hadDescendants && synthesizedText?.trim() === initial && isLikelyInterimCronMessage(initial) && !isSilentReplyText(initial, "NO_REPLY")) {
			deliveryAttempted = true;
			record("not-delivered", child.hasUnsettledDescendants ? "cron descendants are still active without a final reply" : "cron descendants completed without a final reply");
			return finish({ kind: "pending" });
		}
	}
	if (sentByTool) {
		const visible = params.sourceDeliveryOutcome.visibleDeliveries.filter((item) => item.verifiedTarget).map(({ target }) => ({
			text: target.text,
			mediaUrls: target.mediaUrls
		}));
		if (visible.some((item) => item.text?.trim() || item.mediaUrls?.length)) deliveryPayloads = visible;
	}
	const normalized = normalizeDirectCronDeliveryPayloads({
		deliveryPayloads,
		outputText,
		summary,
		synthesizedText
	});
	if (normalized.kind === "suppress") {
		if (!sentByTool) {
			deliveryAttempted = normalized.reason !== "empty";
			record("not-delivered", void 0, normalized.reason);
		}
		return finish(sentByTool ? void 0 : { kind: "suppressed" });
	}
	deliveryPayloads = normalized.payload;
	const finalText = normalizeSilentReplyText(synthesizedText);
	synthesizedText = finalText.strippedTrailingSilentToken ? void 0 : finalText.text;
	if (synthesizedText) outputText = synthesizedText;
	if (params.isAborted()) return finish({
		kind: "error",
		error: params.abortReason()
	});
	const conversationRuntime = await conversationResult.load();
	let conversationResolution = {};
	let conversationError;
	const conversationParams = {
		config: params.cfgWithAgentDefaults,
		agentId: params.agentId,
		delivery: params.resolvedDelivery,
		source: params.sourceSessionKey && params.sourceSessionGeneration ? {
			sessionKey: params.sourceSessionKey,
			...params.sourceSessionGeneration
		} : void 0,
		sourceSessionKey: params.runSessionKey,
		deliveryAttemptFence: params.deliveryAttemptFence
	};
	try {
		conversationResolution = await conversationRuntime.resolveCronResultConversation(conversationParams);
	} catch (error) {
		if (!params.resolvedDelivery.ok && !sentByTool) return failTarget(formatErrorMessage(error));
		conversationError = formatErrorMessage(error);
	}
	let { conversation } = conversationResolution;
	diagnostics = conversationResolution.diagnostics;
	if (!conversation && !params.resolvedDelivery.ok && !sentByTool) {
		if (params.job.sessionTarget === "current") return failTarget("current cron delivery is missing its source session binding");
		if (params.deliveryBestEffort) {
			record("not-delivered", params.resolvedDelivery.error.message);
			await logCronDeliveryWarn(params.resolvedDelivery.error.message);
			return finish({ kind: "suppressed" });
		}
		return failTarget(params.resolvedDelivery.error.message);
	}
	if (params.resolvedDelivery.ok && !sentByTool) {
		deliveryAttempted = true;
		const stale = resolveStaleCronDeliveryError(params);
		if (stale) {
			record("not-delivered", stale);
			return finish({ kind: "suppressed" });
		}
		let mayHaveReachedRecipient = false;
		try {
			const { sendCronAnnouncePayloadStrict } = await notification.load();
			const sent = await sendCronAnnouncePayloadStrict({
				deps: params.deps,
				cfg: params.cfgWithAgentDefaults,
				agentId: params.agentId,
				jobId: params.job.id,
				target: {
					...params.resolvedDelivery,
					sessionKey: params.resolvedDelivery.sessionRoute?.sessionKey
				},
				payload: deliveryPayloads,
				sessionGeneration: resolveDirectCronDeliveryGeneration(params),
				tts: { auto: params.ttsAuto },
				inspectionUrl: resolveControlUiSessionUrl(params.cfgWithAgentDefaults, {
					sessionKey: params.runSessionKey,
					fallbackAgentId: params.agentId,
					exactKey: true
				}),
				abortSignal: params.abortSignal ?? new AbortController().signal,
				bestEffort: params.deliveryBestEffort,
				completion: {
					job: params.job,
					runStartedAt: params.runStartedAt,
					deliveryAttemptFence: params.deliveryAttemptFence
				},
				onDeliveryAttempt: (reachedRecipient) => {
					mayHaveReachedRecipient ||= reachedRecipient;
				}
			});
			if (sent.status === "sent") deliveryPayloads = sent.payloads;
			record(sent.status === "sent" ? "delivered" : sent.reason === "adapter_returned_no_identity" ? "unknown" : "not-delivered", sent.status === "suppressed" && !sent.skipReason ? sent.reason === "empty_after_tts" ? "cron delivery payload was empty after TTS" : "cron notification was suppressed: " + sent.reason : void 0, sent.status === "suppressed" ? sent.skipReason : void 0);
		} catch (error) {
			record(mayHaveReachedRecipient ? "unknown" : "not-delivered", normalizeCronRunErrorText(error));
			await logCronDeliveryWarn("[cron:" + params.job.id + "] notification failed: " + formatErrorMessage(error));
		}
		if (state.status !== "delivered") {
			if (state.status === "unknown") diagnostics = mergeCronRunDiagnostics(diagnostics, createCronRunDiagnosticsFromError("delivery", "result may have been delivered but was not added to the conversation", { severity: "warn" }));
			return finish();
		}
	}
	if (params.resolvedDelivery.ok) try {
		conversation = (await conversationRuntime.bindCronResultConversation(conversationParams)).conversation;
		conversationError = void 0;
	} catch (error) {
		conversation = void 0;
		conversationError = formatErrorMessage(error);
	}
	const executionOwnsResult = params.job.sessionTarget.startsWith("session:") && conversation && toAgentStoreSessionKey({
		agentId: params.agentId,
		requestKey: conversation.sessionKey,
		mainKey: params.cfgWithAgentDefaults.session?.mainKey
	}) === toAgentStoreSessionKey({
		agentId: params.agentId,
		requestKey: params.agentSessionKey,
		mainKey: params.cfgWithAgentDefaults.session?.mainKey
	});
	if (conversation && !executionOwnsResult && deliveryPayloads.length > 0) {
		deliveryAttempted = true;
		try {
			const committed = await conversationRuntime.commitCronConversationResult({
				config: params.cfgWithAgentDefaults,
				agentId: params.agentId,
				jobId: params.job.id,
				runStartedAt: params.runStartedAt,
				conversation,
				payloads: deliveryPayloads,
				text: params.resolvedDelivery.ok || sentByTool ? void 0 : synthesizedText,
				signal: params.abortSignal,
				deliveryAttemptFence: params.deliveryAttemptFence
			});
			if (!committed.ok) conversationError = committed.reason;
			else diagnostics = mergeCronRunDiagnostics(diagnostics, committed.diagnostics);
		} catch (error) {
			conversationError = formatErrorMessage(error);
		}
	}
	if (conversationError) {
		if (state.status !== "delivered") return failTarget(conversationError);
		diagnostics = mergeCronRunDiagnostics(diagnostics, createCronRunDiagnosticsFromError("delivery", `result was delivered but was not added to the conversation: ${conversationError}`, { severity: "warn" }));
	} else if (conversation && !params.resolvedDelivery.ok && !sentByTool) record("delivered");
	return finish();
}
//#endregion
export { buildDeliveryFormatPrompt, dispatchCronDelivery, resolveDeliveryTarget, resolveMessageToolDeliveryFormatPrompt };
