import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { O as describeAskUserTool, l as ASK_USER_TOOL_DISPLAY_SUMMARY } from "./tool-catalog-DGlfxTaj.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import "./common-BofcG96e.mjs";
import { a as runWithQuestionChannelDeliveries } from "./question-channel-runtime-DgJgVgIZ.mjs";
import { E as withAgentQuestionAnswerAuthority, w as resolveAgentQuestionAnswerAuthority } from "./host-private-capabilities-eTr803c9.mjs";
import { l as resolveAgentQuestionGatewayCall } from "./gateway-question-dispatch-CakNMdfI.mjs";
import { f as isReplyDispatchDeliveryError } from "./reply-dispatcher-BW8Y2zzZ.mjs";
import { a as registerPendingAgentQuestion, g as readQuestionRejection, h as createQuestionPromptLifetime, m as createGatewayQuestionCanceller, s as buildAgentHarnessQuestionPromptPayload } from "./gateway-question-DpNVBEhx.mjs";
import { n as QUESTION_RPC_GRACE_MS, r as normalizeAskUserParams, t as AskUserToolSchema } from "./ask-user-tool-normalization-Cqh2rKIa.mjs";
import { n as sendDurableMessageBatchCore, t as durableMessageBatchMayHaveReachedRecipient } from "./send-Ccg5tbzy.mjs";
import "./runtime-DV2_kfTG.mjs";
import { r as resolveControlUiSessionLinkBase } from "./control-ui-link-base-C4cbCE5S.mjs";
//#region src/agents/tools/question-prompt-send.ts
/** Builds a portable prompt sender for Gateway-scoped / loopback tool construction. */
function createChannelQuestionPromptDelivery(params) {
	const cfg = params.cfg;
	const channel = normalizeMessageChannel(params.channel);
	const to = params.to?.toString().trim();
	if (!channel || !to || !isDeliverableMessageChannel(channel)) return;
	return {
		messageChannel: channel,
		send: async (payload, options) => {
			const send = await sendDurableMessageBatchCore({
				cfg,
				channel,
				to,
				accountId: params.accountId,
				threadId: params.threadId ?? void 0,
				payloads: [payload],
				bestEffort: false,
				durability: "required",
				deliveryRetryOwner: "caller",
				signal: options?.signal
			});
			if (durableMessageBatchMayHaveReachedRecipient(send)) return;
			if (send.status === "failed") throw send.error;
			throw new Error(send.status === "suppressed" ? `question prompt delivery was suppressed: ${send.reason}` : "question prompt delivery did not reach the conversation");
		}
	};
}
/**
* Publishes the prompt for an already-committed gateway question record.
*
* Rejects when the question cannot become answerable where it was asked, which is
* what tells the caller to cancel the pending record instead of waiting it out.
*/
async function sendQuestionToolPrompt(params) {
	const { questionId, questions } = params;
	const send = (payload) => runWithQuestionChannelDeliveries([questionId], () => params.signal ? params.send(payload, { signal: params.signal }) : params.send(payload));
	if (params.toolName === "secrets") {
		const binding = questions[0]?.secretStore;
		if (!binding) return;
		const controlUiBase = resolveControlUiSessionLinkBase(params.config);
		const text = controlUiBase ? `🔑 Agent requests credential ${binding.name} (${binding.kind}). Reply is disabled for secrets — open to provide it: ${controlUiBase}/ask/${encodeURIComponent(questionId)}` : "Credential request unavailable here: no reachable Control UI link. Open a trusted Control UI or native app and retry, or ask the operator to enable Control UI and configure gateway.publicOrigin. Never send credentials in chat.";
		await send({
			text,
			channelData: { askUser: { questionId } }
		});
		if (!controlUiBase) throw new Error(text);
		return;
	}
	await send(buildAgentHarnessQuestionPromptPayload({
		questionId,
		questions: questions.map(({ questionId: id, ...question }) => Object.assign(question, { id })),
		options: { intro: "Question for you:" }
	}));
}
//#endregion
//#region src/agents/tools/ask-user-tool.ts
const ASK_USER_PROMPT_RECHECK_MS = 50;
const askUserQuestions = resolveGlobalMap(Symbol.for("openclaw.askUserQuestions"));
/** Stable client-generated gateway question id shared with tool-start delivery. */
function buildAskUserQuestionId(toolCallId, sessionKey, runId, agentId) {
	const identity = `${runId?.trim() || askUserSessionKey(sessionKey, agentId)}\0${toolCallId}`;
	return `ask_${sha256Hex(identity).slice(0, 32)}`;
}
function askUserSessionKey(sessionKey, agentId) {
	const normalizedSessionKey = sessionKey?.trim();
	if (normalizedSessionKey && parseAgentSessionKey(normalizedSessionKey)) return normalizedSessionKey;
	return `${agentId?.trim() || "unknown"}\0${normalizedSessionKey || "session:unknown"}`;
}
function findAskUserQuestionForSession(sessionKey) {
	for (const question of askUserQuestions.values()) if (question.sessionKey === sessionKey) return question;
}
function transitionAskUserQuestion(state, phase) {
	state.phase = phase;
	for (const wake of state.waiters) wake();
	state.waiters.clear();
}
function releaseAskUserQuestion(questionId) {
	const state = askUserQuestions.get(questionId);
	if (!state) return;
	askUserQuestions.delete(questionId);
	state.claim?.dispose();
	for (const wake of state.waiters) wake();
	state.waiters.clear();
}
async function waitForQuestionChange(state, signal) {
	signal?.throwIfAborted();
	await new Promise((resolve, reject) => {
		const wake = () => {
			signal?.removeEventListener("abort", onAbort);
			resolve();
		};
		const onAbort = () => {
			state.waiters.delete(wake);
			reject(signal?.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("ask_user aborted"));
		};
		state.waiters.add(wake);
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
/** Reserves one visible ask_user prompt slot before subscriber delivery. */
function reserveAskUserPromptDelivery(params) {
	const sessionKey = askUserSessionKey(params.sessionKey, params.agentId);
	if (findAskUserQuestionForSession(sessionKey)) return;
	const questionId = buildAskUserQuestionId(params.toolCallId, params.sessionKey, params.runId, params.agentId);
	if (askUserQuestions.has(questionId)) return;
	askUserQuestions.set(questionId, {
		questionId,
		sessionKey,
		questions: params.questions,
		expiresAtMs: Date.now() + (params.timeoutSeconds ?? 900) * 1e3,
		phase: { kind: "reserved" },
		waiters: /* @__PURE__ */ new Set()
	});
	return { questionId };
}
/** Waits until policy-accepted tool execution has registered the gateway question. */
async function waitForAskUserPromptReady(questionId, gatewayCall = resolveAgentQuestionGatewayCall()) {
	const state = askUserQuestions.get(questionId);
	if (!state) return;
	while (askUserQuestions.get(questionId) === state) {
		if (state.phase.kind === "prompting" || state.phase.kind === "answerable" || state.phase.kind === "resolving" || state.phase.kind === "prompt-failed") return state.questions;
		try {
			const status = await readAskUserQuestionStatus(questionId, gatewayCall);
			if (status === "pending") return state.questions;
			if (typeof status === "string") return;
		} catch {}
		await sleep(50);
	}
}
async function readAskUserQuestionStatus(questionId, gatewayCall) {
	const result = await gatewayCall("question.list", { timeoutMs: QUESTION_RPC_GRACE_MS }, {});
	const questions = asNullableRecord(result)?.questions;
	const question = Array.isArray(questions) ? questions.find((candidate) => asNullableRecord(candidate)?.id === questionId) : void 0;
	const status = asNullableRecord(question)?.status;
	return typeof status === "string" ? status : void 0;
}
async function readAskUserQuestionStatusBeforeExpiry(questionId, expiresAtMs, gatewayCall) {
	const remainingMs = expiresAtMs - Date.now();
	if (remainingMs <= 0) return { kind: "expired" };
	return await raceWithTimeout(() => readAskUserQuestionStatus(questionId, gatewayCall).then((status) => ({
		kind: "status",
		status
	}), () => ({ kind: "error" })), remainingMs, () => ({ kind: "expired" }));
}
/** Opens prompt delivery after question.request succeeds. */
function markAskUserPromptReady(questionId, questions) {
	const state = askUserQuestions.get(questionId);
	if (!state || state.phase.kind !== "reserved" && state.phase.kind !== "registering") return;
	state.questions = questions;
	transitionAskUserQuestion(state, { kind: "prompting" });
}
/** Records whether the originating-conversation prompt reached its delivery callback. */
function settleAskUserPromptDelivery(questionId, error) {
	const state = askUserQuestions.get(questionId);
	if (!state || state.phase.kind !== "prompting") return;
	transitionAskUserQuestion(state, error === void 0 ? { kind: "answerable" } : {
		kind: "prompt-failed",
		error
	});
}
/**
* Settles the prompt wait from the same run that published the prompt.
*
* Detached on purpose: the waiter below races prompt delivery against the answer,
* so this must not block the tool call that is registering that answer.
*/
function settleAfterOwnPromptDelivery(questionId, delivery) {
	delivery.then(() => settleAskUserPromptDelivery(questionId), (error) => settleAskUserPromptDelivery(questionId, error));
}
/** Rechecks the Gateway immediately before exposing an answerable prompt. */
async function isAskUserPromptPending(questionId, gatewayCall = resolveAgentQuestionGatewayCall()) {
	const state = askUserQuestions.get(questionId);
	if (!state) return false;
	while (askUserQuestions.get(questionId) === state) {
		if (state.phase.kind === "resolving" || state.phase.kind === "prompt-failed") return false;
		const read = await readAskUserQuestionStatusBeforeExpiry(questionId, state.expiresAtMs, gatewayCall);
		if (read.kind === "expired") return false;
		const currentState = askUserQuestions.get(questionId);
		if (currentState !== state || currentState.phase.kind === "resolving" || currentState.phase.kind === "prompt-failed") return false;
		if (read.kind === "status" && read.status === "pending") return true;
		if (read.kind === "status" && typeof read.status === "string") return false;
		const remainingMs = state.expiresAtMs - Date.now();
		if (remainingMs <= 0) return false;
		await sleep(Math.min(ASK_USER_PROMPT_RECHECK_MS, remainingMs));
	}
	return false;
}
/** Releases a tool-start reservation when policy rejects execution. */
function cancelAskUserPromptDelivery(toolCallId, sessionKey, runId, agentId) {
	releaseAskUserQuestion(buildAskUserQuestionId(toolCallId, sessionKey, runId, agentId));
}
function answeredResult(questions, answers) {
	const payload = {
		status: "answered",
		answers
	};
	const lines = questions.map((question) => {
		const values = answers.answers[question.questionId] ?? [];
		return `${question.header}: ${values.length > 0 ? values.join(", ") : "(no answer)"}`;
	});
	return textResult(`${lines.join("\n")}\n\n${JSON.stringify(payload, null, 2)}`, payload);
}
function noAnswerResult(status) {
	const payload = { status: "no_answer" };
	return textResult(`${status === "cancelled" ? "The question was cancelled; proceed with best judgment." : "No answer arrived; proceed with best judgment."}\n\n${JSON.stringify(payload, null, 2)}`, payload);
}
async function waitForPromptDelivery(state, signal) {
	while (askUserQuestions.get(state.questionId) === state) {
		if (state.phase.kind === "answerable" || state.phase.kind === "resolving") return {};
		if (state.phase.kind === "prompt-failed") return { error: state.phase.error };
		await waitForQuestionChange(state, signal);
	}
	return { error: /* @__PURE__ */ new Error("ask_user prompt is no longer active") };
}
/** Shares question ownership and prompt delivery without installing a plaintext answer claim. */
function beginAskUserPromptDelivery(params) {
	return createAskUserPromptDelivery(buildAskUserQuestionId(params.toolCallId, params.sessionKey, params.runId, params.agentId), askUserSessionKey(params.sessionKey, params.agentId), params.questions, params.timeoutSeconds, "a question is already pending for this session; wait for it to resolve before requesting another", params.deliverPrompt).delivery;
}
function createAskUserPromptDelivery(questionId, sessionKey, questions, timeoutSeconds, pendingMessage, deliverPrompt) {
	const reserved = askUserQuestions.get(questionId);
	const existing = findAskUserQuestionForSession(sessionKey);
	if (reserved && reserved.phase.kind !== "reserved" || existing && existing !== reserved) throw new ToolInputError(pendingMessage);
	const state = reserved ?? {
		questionId,
		sessionKey,
		questions,
		expiresAtMs: 0,
		phase: { kind: "registering" },
		waiters: /* @__PURE__ */ new Set()
	};
	Object.assign(state, {
		sessionKey,
		questions
	});
	state.expiresAtMs = Date.now() + timeoutSeconds * 1e3;
	transitionAskUserQuestion(state, { kind: "registering" });
	askUserQuestions.set(questionId, state);
	return {
		state,
		delivery: {
			questionId,
			hasSubscriber: reserved !== void 0 || deliverPrompt !== void 0,
			markReady() {
				if (reserved || deliverPrompt) markAskUserPromptReady(questionId, questions);
				else transitionAskUserQuestion(state, { kind: "answerable" });
				if (!reserved && deliverPrompt) settleAfterOwnPromptDelivery(questionId, deliverPrompt(questionId));
			},
			waitForDelivery(signal) {
				return waitForPromptDelivery(state, signal);
			},
			release() {
				if (askUserQuestions.get(questionId) === state) releaseAskUserQuestion(questionId);
			}
		}
	};
}
function resetPendingAskUserQuestionsForTest() {
	for (const questionId of askUserQuestions.keys()) releaseAskUserQuestion(questionId);
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.askUserToolTestApi")] = { resetPendingAskUserQuestionsForTest };
/** Creates the main-session-only blocking ask_user tool. */
function createAskUserTool(params) {
	const questionAuthority = resolveAgentQuestionAnswerAuthority();
	const gatewayCall = resolveAgentQuestionGatewayCall(params.gatewayCall);
	return {
		label: "Ask User",
		name: "ask_user",
		displaySummary: ASK_USER_TOOL_DISPLAY_SUMMARY,
		description: describeAskUserTool(),
		parameters: AskUserToolSchema,
		execute: async (toolCallId, args, signal) => {
			try {
				var _usingCtx$1 = _usingCtx();
				const questionId = buildAskUserQuestionId(toolCallId, params.sessionKey, params.runId, params.agentId);
				let normalized;
				try {
					signal?.throwIfAborted();
					normalized = normalizeAskUserParams(args);
				} catch (error) {
					releaseAskUserQuestion(questionId);
					throw error;
				}
				const sessionKey = askUserSessionKey(params.sessionKey, params.agentId);
				const timeoutMs = normalized.timeoutSeconds * 1e3;
				const send = params.questionPrompt?.send;
				const { state, delivery } = createAskUserPromptDelivery(questionId, sessionKey, normalized.questions, normalized.timeoutSeconds, "ask_user already has a pending question for this session; wait for it to resolve before asking another", send ? (id) => sendQuestionToolPrompt({
					toolName: "ask_user",
					questionId: id,
					questions: normalized.questions,
					send,
					signal: prompt.signal
				}) : void 0);
				const prompt = _usingCtx$1.u(createQuestionPromptLifetime(signal));
				let registered = false;
				const cancelPendingQuestion = createGatewayQuestionCanceller({
					gatewayCall,
					questionId,
					beforeCancel: prompt.close
				});
				const cancelOnAbort = () => {
					prompt.close();
					delivery.release();
					cancelPendingQuestion("run-abort");
				};
				const finishWait = async (waitResult) => {
					const result = waitResult.status === "pending" ? await cancelPendingQuestion("wait-timeout") ?? waitResult : waitResult;
					if (result.status === "answered") return answeredResult(normalized.questions, result.answers);
					if (result.status === "pending" || result.status === "expired" || result.status === "cancelled") return noAnswerResult(result.status);
					throw new Error("question.waitAnswer returned an invalid status");
				};
				try {
					state.claim = withAgentQuestionAnswerAuthority(questionAuthority, () => registerPendingAgentQuestion({
						questionId,
						sessionKey,
						questions: normalized.questions.map(({ questionId: id, ...question }) => ({
							...question,
							id
						})),
						gatewayCall: params.gatewayCall,
						onCancel: () => {
							prompt.close();
							if (askUserQuestions.get(questionId) === state && state.phase.kind !== "reserved" && state.phase.kind !== "resolving" && state.phase.kind !== "prompt-failed") transitionAskUserQuestion(state, { kind: "resolving" });
						}
					}));
					const registration = Promise.resolve().then(() => gatewayCall("question.request", {}, {
						id: questionId,
						questions: normalized.questions,
						...params.agentId ? { agentId: params.agentId } : {},
						...params.sessionKey ? { sessionKey: params.sessionKey } : {},
						...params.runId ? { runId: params.runId } : {},
						timeoutMs
					}, signal ? { signal } : void 0));
					state.claim.attachRegistration(registration);
					const requestResult = await registration;
					registered = true;
					if (requestResult.id !== questionId) throw new Error("question.request returned an unexpected question id");
					if (state.claim.isCancellationRequested()) {
						const answered = await cancelPendingQuestion("superseded-input");
						return answered ? answeredResult(normalized.questions, answered.answers) : noAnswerResult("cancelled");
					}
					signal?.addEventListener("abort", cancelOnAbort, { once: true });
					if (signal?.aborted) {
						cancelOnAbort();
						signal.throwIfAborted();
					}
					const answerPromise = gatewayCall("question.waitAnswer", { timeoutMs: timeoutMs + QUESTION_RPC_GRACE_MS }, {
						id: questionId,
						timeoutMs,
						includeResolutionId: true
					}, signal ? { signal } : void 0).finally(prompt.close);
					state.claim.setAnswer(answerPromise);
					let consumed;
					do
						consumed = await Promise.race([state.claim.waitForResolution(), answerPromise.then(() => true)]);
					while (!consumed && state.claim.isResolving());
					if (!consumed) delivery.markReady();
					if (delivery.hasSubscriber && !consumed) {
						const promptDeliveryPromise = delivery.waitForDelivery(signal);
						const first = await Promise.race([promptDeliveryPromise.then((result) => ({
							kind: "delivery",
							result
						})), answerPromise.then((result) => ({
							kind: "answer",
							result
						}))]);
						signal?.throwIfAborted();
						if (first.kind === "answer") return await finishWait(first.result);
						const deliveryResult = first.result;
						if (deliveryResult.error !== void 0) {
							const answered = await cancelPendingQuestion("prompt-delivery-failed");
							if (answered) return answeredResult(normalized.questions, answered.answers);
							if (isReplyDispatchDeliveryError(deliveryResult.error) && deliveryResult.error.outcome === "failed-deliver") {
								const details = { status: "delivery_failed" };
								return {
									...textResult(`The prompt became visible, but its controls failed to deliver. The question was cancelled; no retry/fallback should be sent.\n\n${JSON.stringify(details, null, 2)}`, details),
									terminate: true
								};
							}
							throw new Error("ask_user prompt delivery failed", { cause: deliveryResult.error });
						}
					}
					const result = await answerPromise;
					signal?.throwIfAborted();
					return await finishWait(result);
				} catch (error) {
					if (registered || readQuestionRejection(error)?.reason !== "QUESTION_ID_IN_USE") {
						const answered = await cancelPendingQuestion(signal?.aborted ? "run-abort" : registered ? "tool-error" : "registration-failed");
						if (!signal?.aborted && answered) return answeredResult(normalized.questions, answered.answers);
					}
					throw error;
				} finally {
					signal?.removeEventListener("abort", cancelOnAbort);
					delivery.release();
				}
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		}
	};
}
//#endregion
export { reserveAskUserPromptDelivery as a, createChannelQuestionPromptDelivery as c, isAskUserPromptPending as i, sendQuestionToolPrompt as l, cancelAskUserPromptDelivery as n, settleAskUserPromptDelivery as o, createAskUserTool as r, waitForAskUserPromptReady as s, beginAskUserPromptDelivery as t };
