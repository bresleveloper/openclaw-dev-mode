import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { Cl as QuestionWaitAnswerResultSchema } from "./src-BRUl7oDv.mjs";
import { x as markReplyPayloadForSourceSuppressionDelivery } from "./reply-payload-B2ZQhznY.mjs";
import { a as buildAgentQuestionAnswers, i as QuestionDispatchUnsupportedError, n as QuestionAnswerUnconfirmedError, o as buildAgentQuestionRequestQuestions, r as QuestionDispatchRefusedError, s as resolveAgentQuestionGatewayCall, t as PreparedQuestionAnswerRefusedError } from "./gateway-question-dispatch-Bc0iAUTx.mjs";
import { d as withAgentQuestionAnswerAuthority, l as resolveAgentQuestionAnswerAuthority, t as captureAgentQuestionAnswerAuthority } from "./host-private-capabilities-D8EEgJHq.mjs";
import { a as runWithQuestionChannelDeliveries } from "./question-channel-runtime-iX-d9p2G.mjs";
import { randomBytes } from "node:crypto";
import { Value } from "typebox/value";
//#region src/agents/tools/gateway-question-lifecycle.ts
/** Shared registration, wait, and cancellation for blocking Gateway questions. */
/** Grace added to Gateway RPC deadlines so the question's own timeout wins. */
const QUESTION_RPC_GRACE_MS$1 = 1e4;
/** Publication ends with the answer, before cancellation or post-answer work. */
function createQuestionPromptLifetime(signal) {
	const controller = new AbortController();
	const close = () => controller.abort(createAbortError("Question publication ended"));
	return {
		signal: signal ? AbortSignal.any([signal, controller.signal]) : controller.signal,
		close,
		[Symbol.dispose]: close
	};
}
const TERMINAL_QUESTION_ERROR_REASONS = /* @__PURE__ */ new Set(["QUESTION_ALREADY_TERMINAL", "QUESTION_NOT_FOUND"]);
/** Reads the Gateway's structured failure from a question RPC rejection. */
function readQuestionRejection(error) {
	const requestError = asNullableRecord(error);
	if (requestError?.name !== "GatewayClientRequestError") return;
	const reason = asNullableRecord(requestError.details)?.reason;
	return {
		code: requestError.gatewayCode,
		reason: typeof reason === "string" ? reason : void 0
	};
}
function isTerminalQuestionResolveError(error) {
	const reason = readQuestionRejection(error)?.reason;
	return reason !== void 0 && TERMINAL_QUESTION_ERROR_REASONS.has(reason);
}
/** Waits for one question's terminal state, validating the Gateway's payload. */
async function awaitGatewayQuestionAnswer(params) {
	const result = await params.gatewayCall("question.waitAnswer", { timeoutMs: params.timeoutMs + QUESTION_RPC_GRACE_MS$1 }, {
		id: params.questionId,
		timeoutMs: params.timeoutMs
	}, params.signal ? { signal: params.signal } : void 0);
	if (!Value.Check(QuestionWaitAnswerResultSchema, result)) throw new Error("question.waitAnswer returned an invalid status");
	return result;
}
/**
* Cancels a pending question at most once. An answer that lands between the
* caller's timeout and this cancel makes the Gateway reject it as terminal; the
* recovery read returns that answer so a submitted response is never discarded.
*/
function createGatewayQuestionCanceller(params) {
	let cancellation;
	return (resolvedBy) => {
		params.beforeCancel?.();
		cancellation ??= (async () => {
			try {
				await params.gatewayCall("question.resolve", { timeoutMs: QUESTION_RPC_GRACE_MS$1 }, {
					id: params.questionId,
					cancel: true,
					resolvedBy
				});
				return;
			} catch (error) {
				if (!isTerminalQuestionResolveError(error)) return;
				try {
					const result = await awaitGatewayQuestionAnswer({
						gatewayCall: params.gatewayCall,
						questionId: params.questionId,
						timeoutMs: 1e3
					});
					return result.status === "answered" ? result : void 0;
				} catch {
					return;
				}
			}
		})();
		return cancellation;
	};
}
//#endregion
//#region src/agents/harness/user-input-bridge.ts
function emptyAgentHarnessUserInputAnswers() {
	return { answers: {} };
}
function formatAgentHarnessUserInputPrompt(questions, options = {}) {
	const formatText = options.formatText ?? ((text) => text);
	const lines = [options.intro ?? "Agent needs input:"];
	questions.forEach((question, index) => {
		if (questions.length > 1) lines.push("", `${index + 1}. ${formatText(question.header)}`, formatText(question.question));
		else lines.push("", formatText(question.header), formatText(question.question));
		if (question.isSecret) lines.push(options.secretWarning ?? "This channel may show your reply to other participants.");
		question.options?.forEach((option, optionIndex) => {
			lines.push(`${optionIndex + 1}. ${formatText(option.label)}${option.description ? ` - ${formatText(option.description)}` : ""}`);
		});
		if (question.isOther) lines.push(options.otherLabel ?? "Other: reply with your own answer.");
	});
	return lines.join("\n");
}
async function deliverAgentHarnessUserInputPrompt(params, questions, options = {}) {
	const text = formatAgentHarnessUserInputPrompt(questions, options);
	if (params.onBlockReply) {
		await params.onBlockReply(markReplyPayloadForSourceSuppressionDelivery({
			text,
			presentation: options.presentation
		}));
		return;
	}
	await params.onPartialReply?.({ text });
}
/** Builds the portable one-question presentation shared by tools and harnesses. */
function buildAgentHarnessQuestionPresentation(params) {
	if (params.questions.length !== 1) return;
	const [question] = params.questions;
	const options = question?.options ?? [];
	const formatText = params.formatText ?? ((text) => text);
	if (!question || question.multiSelect || question.isSecret || options.length === 0) return;
	const optionGuidance = [
		...options.map((option) => `- ${formatText(option.label)}${option.description ? `: ${formatText(option.description)}` : ""}`),
		"",
		questionReplyGuidance(params.questions)
	].join("\n");
	return { blocks: [
		{
			type: "text",
			text: formatText(question.question)
		},
		{
			type: "text",
			text: optionGuidance
		},
		{
			type: "buttons",
			buttons: [
				...question.url ? [{
					label: "Open link",
					action: {
						type: "url",
						url: question.url
					}
				}] : [],
				...options.map((option) => ({
					label: formatText(option.label),
					action: {
						type: "question",
						questionId: params.questionId,
						optionValue: option.label
					}
				})),
				...question.isOther ? [{
					label: "Other…",
					action: {
						type: "question",
						questionId: params.questionId,
						intent: "custom-input"
					}
				}] : []
			]
		}
	] };
}
/** Builds the exact question payload consumed by web chat and native channels. */
function buildAgentHarnessQuestionPromptPayload(params) {
	const prompt = formatAgentHarnessUserInputPrompt(params.questions, params.options);
	const presentation = params.options?.presentation ?? buildAgentHarnessQuestionPresentation({
		...params,
		formatText: params.options?.formatText
	});
	const [question] = params.questions;
	const candidateOptionValues = params.questions.length === 1 && question && !question.multiSelect && !question.isSecret ? question.options?.map((option) => option.label) ?? [] : [];
	const normalizedOptionValues = candidateOptionValues.map((option) => option.trim().toLowerCase());
	const optionValues = candidateOptionValues.length >= 2 && candidateOptionValues.length <= 4 && normalizedOptionValues.every(Boolean) && new Set(normalizedOptionValues).size === candidateOptionValues.length ? candidateOptionValues : void 0;
	return markReplyPayloadForSourceSuppressionDelivery({
		text: `${prompt}\n\n${questionReplyGuidance(params.questions)}`,
		...presentation ? {
			presentation,
			presentationTextMode: "fallback"
		} : {},
		channelData: { askUser: {
			questionId: params.questionId,
			...optionValues ? { optionValues } : {}
		} }
	});
}
function questionReplyGuidance(questions) {
	if (questions.length !== 1) return "Reply by number or question id. Use a declared option where choices are fixed.";
	const [question] = questions;
	if (!question || (question.options?.length ?? 0) === 0) return "Reply with your answer.";
	if (question.multiSelect) return "Reply with comma-separated option numbers or text, or your own answer.";
	return question.isOther ? "Reply with the number, the option text, or your own answer." : "Reply with the number or option text.";
}
/** Delivers a gateway-backed question through the harness block-reply surface. */
async function deliverAgentHarnessQuestionPrompt(params, questionId, questions, options, signal) {
	signal?.throwIfAborted();
	const payload = buildAgentHarnessQuestionPromptPayload({
		questionId,
		questions,
		options
	});
	if (params.onBlockReply) {
		await runWithQuestionChannelDeliveries([questionId], () => params.onBlockReply?.(payload, {
			...signal ? { abortSignal: signal } : {},
			deliveryIntentId: `block-reply:v1:agent-question:${questionId}`
		}));
		return;
	}
	signal?.throwIfAborted();
	await params.onPartialReply?.({ text: payload.text });
}
function buildAgentHarnessUserInputAnswers(questions, inputText) {
	const answers = {};
	if (questions.length === 1) {
		const question = questions[0];
		if (question) answers[question.id] = { answers: normalizeAgentHarnessUserInputAnswers(inputText, question) };
		return { answers };
	}
	const keyed = parseKeyedAnswers(inputText);
	const fallbackLines = inputText.split(/\r?\n/).map((line) => line.trim());
	questions.forEach((question, index) => {
		const answer = keyed.get(question.id.toLowerCase()) ?? keyed.get(question.header.toLowerCase()) ?? keyed.get(question.question.toLowerCase()) ?? keyed.get(String(index + 1)) ?? fallbackLines[index] ?? "";
		answers[question.id] = { answers: answer ? normalizeAgentHarnessUserInputAnswers(answer, question) : [] };
	});
	return { answers };
}
function normalizeAgentHarnessUserInputAnswers(answer, question) {
	if (!question.multiSelect) {
		const normalized = normalizeAgentHarnessUserInputAnswer(answer, question);
		return normalized ? [normalized] : [];
	}
	const declaredAnswer = normalizeAgentHarnessUserInputOption(answer, question);
	if (declaredAnswer) return [declaredAnswer];
	const normalized = answer.split(/[,;\n]/u).map((part) => normalizeAgentHarnessUserInputAnswer(part, question)).filter((part) => Boolean(part));
	return [...new Set(normalized)];
}
function normalizeAgentHarnessUserInputAnswer(answer, question) {
	const trimmed = answer.trim();
	const declaredAnswer = normalizeAgentHarnessUserInputOption(trimmed, question);
	if (declaredAnswer) return declaredAnswer;
	if ((question.options?.length ?? 0) > 0 && !question.isOther) return;
	return trimmed || void 0;
}
function normalizeAgentHarnessUserInputOption(answer, question) {
	const trimmed = answer.trim();
	const options = question.options ?? [];
	const optionIndex = /^\d+$/.test(trimmed) ? Number(trimmed) - 1 : -1;
	const indexed = optionIndex >= 0 ? options[optionIndex] : void 0;
	if (indexed) return indexed.label;
	const exact = options.find((option) => option.label.toLowerCase() === trimmed.toLowerCase());
	if (exact) return exact.label;
}
function parseKeyedAnswers(inputText) {
	const answers = /* @__PURE__ */ new Map();
	for (const line of inputText.split(/\r?\n/)) {
		const match = line.match(/^\s*([^:=-]+?)\s*[:=-]\s*(.+?)\s*$/);
		if (!match) continue;
		const key = match[1]?.trim().toLowerCase();
		const value = match[2]?.trim();
		if (key && value) answers.set(key, value);
	}
	return answers;
}
//#endregion
//#region src/agents/harness/gateway-question.ts
const QUESTION_RPC_GRACE_MS = 1e4;
const pendingAgentQuestions = resolveGlobalMap(Symbol.for("openclaw.pendingAgentQuestions"), (questions) => {
	const error = /* @__PURE__ */ new Error("gateway lifecycle ended before question registration completed");
	for (const state of questions.values()) if (state.kind === "gateway") state.rejectRegistration(error);
	else state.settle();
	questions.clear();
});
/** One reservation owns both dispatch refusal and the prompt's release notification. */
function reserveQuestionInput(state, authority) {
	let refused = false;
	const assertCurrent = () => {
		try {
			authority?.assertCurrent();
			state.answerAuthority?.assertActive();
			if (pendingAgentQuestions.get(state.sessionKey) !== state) throw new Error("pending question is no longer current");
		} catch (error) {
			refused = true;
			throw new QuestionDispatchRefusedError(error instanceof Error ? error.message : "question dispatch authority refused", { cause: error });
		}
	};
	assertCurrent();
	if (state.kind === "gateway" && authority?.kind === "source-bound" && !state.supportsSourceBound) throw new QuestionDispatchUnsupportedError("source-bound question input requires the default or a version 2 dispatcher");
	state.resolving = true;
	let finish;
	if (state.kind === "gateway") state.resolution = new Promise((resolve) => {
		finish = resolve;
	});
	return {
		assertCurrent,
		wasRefused: () => refused,
		extra: state.kind === "gateway" && state.supportsSourceBound ? { dispatchAuthority: {
			version: 2,
			kind: authority?.kind ?? "run",
			assertCurrent
		} } : void 0,
		finish: (consumed) => {
			state.resolving = consumed;
			if (state.kind === "gateway") {
				if (!consumed) state.cancelRequested = false;
				state.resolution = void 0;
			}
			finish?.();
		}
	};
}
/** Registers one gateway question as the next plain-text claim target for its session. */
function registerPendingAgentQuestion(params) {
	const sessionKey = params.sessionKey.trim();
	const answerAuthority = captureAgentQuestionAnswerAuthority(sessionKey);
	if (pendingAgentQuestions.get(sessionKey)) throw new Error(`session already has a pending agent input request: ${sessionKey}`);
	let resolveRegistration;
	let rejectRegistration;
	const registration = new Promise((resolve, reject) => {
		resolveRegistration = resolve;
		rejectRegistration = reject;
	});
	registration.catch(() => void 0);
	let registrationAttached = false;
	const state = {
		kind: "gateway",
		...params,
		sessionKey,
		answerAuthority,
		gatewayCall: resolveAgentQuestionGatewayCall(params.gatewayCall),
		supportsSourceBound: typeof params.gatewayCall !== "function",
		registration,
		rejectRegistration,
		attachRegistration: (promise) => {
			if (registrationAttached) throw new Error("gateway question registration already attached");
			registrationAttached = true;
			promise.then(resolveRegistration, rejectRegistration);
		},
		cancelRequested: false,
		resolving: false
	};
	pendingAgentQuestions.set(sessionKey, state);
	return {
		attachRegistration: state.attachRegistration,
		setAnswer: (answer) => {
			state.answer = answer;
		},
		waitForResolution: async () => {
			while (state.resolution) await state.resolution;
			return state.cancelRequested || state.resolving;
		},
		isCancellationRequested: () => state.cancelRequested,
		isResolving: () => state.cancelRequested || state.resolving,
		dispose: () => {
			if (pendingAgentQuestions.get(sessionKey) === state) pendingAgentQuestions.delete(sessionKey);
			if (!registrationAttached) rejectRegistration(/* @__PURE__ */ new Error("gateway question registration disposed before attachment"));
		}
	};
}
/** Core ingress claims require the question creator's policy, not an answering-turn owner. */
async function claimPendingAgentQuestionAnswerFromCaller(params) {
	const state = params.sessionKey ? pendingAgentQuestions.get(params.sessionKey.trim()) : void 0;
	return claimQuestionAnswer({
		sessionKey: params.sessionKey,
		text: params.text,
		persist: params.persist,
		sourceRecorder: params.sourceRecorder,
		authority: {
			kind: "source-bound",
			assertCurrent: () => {
				try {
					params.assertSourceCurrent();
					if (state) {
						if (!state.answerAuthority) throw new Error("pending question has no prepared creator authority");
						state.answerAuthority.assertCaller(params.caller);
						if (pendingAgentQuestions.get(state.sessionKey) !== state) throw new Error("pending question is no longer current");
					}
					params.assertSourceCurrent();
				} catch (error) {
					throw new QuestionDispatchRefusedError(error instanceof Error ? error.message : "question answer authority refused", { cause: error });
				}
			}
		}
	}, params.onAnswerProcessed);
}
/** Owns reservation and persistence; absent questions return before checking caller authority. */
async function claimPendingAgentQuestionAnswer(params) {
	return claimQuestionAnswer(params);
}
/** Core ingress revalidates its prepared route after question and source preparation. */
async function claimPreparedPendingAgentQuestionAnswer(params, assertPreparedCurrent) {
	return claimQuestionAnswer(params, void 0, assertPreparedCurrent);
}
async function claimQuestionAnswer(params, onAnswerProcessed, assertPreparedCurrent) {
	const sessionKey = params.sessionKey?.trim();
	const state = sessionKey ? pendingAgentQuestions.get(sessionKey) : void 0;
	if (!state || state.resolving || state.kind === "gateway" && state.cancelRequested) return false;
	params.authority?.assertCurrent();
	const sourceRecorder = params.sourceRecorder;
	const stagedSource = sourceRecorder?.getPendingInputMessage?.() !== void 0;
	const reservation = reserveQuestionInput(state, params.authority);
	let consumed = false;
	let retainReservation = false;
	try {
		if (state.kind === "gateway" && !state.answer) {
			try {
				await state.registration;
			} catch {
				return false;
			}
			if (pendingAgentQuestions.get(state.sessionKey) !== state) return false;
		}
		reservation.assertCurrent();
		if (state.kind !== "secret" || stagedSource) {
			if (sourceRecorder) try {
				await sourceRecorder.persistApproved();
				if (stagedSource && !sourceRecorder.hasPersisted()) throw new Error("staged question source was not committed");
			} catch (error) {
				if (stagedSource) throw new QuestionDispatchRefusedError("Question answer source was not persisted", { cause: error });
				throw error;
			}
			else await params.persist?.();
		}
		if (assertPreparedCurrent) try {
			await assertPreparedCurrent();
			reservation.assertCurrent();
		} catch (error) {
			throw new PreparedQuestionAnswerRefusedError(error);
		}
		else reservation.assertCurrent();
		if (state.kind === "secret") {
			consumed = state.settle(params.text);
			return consumed;
		}
		state.answerAuthority?.admitTranscriptAnswer?.(sourceRecorder);
		const parsed = buildAgentHarnessUserInputAnswers(state.questions, params.text);
		const answers = buildAgentQuestionAnswers(parsed);
		const resolutionId = randomBytes(16).toString("hex");
		try {
			await state.gatewayCall("question.resolve", {}, {
				id: state.questionId,
				answers,
				resolvedBy: "plain-text",
				resolutionId
			}, ...reservation.extra ? [reservation.extra] : []);
			consumed = true;
		} catch (error) {
			if (reservation.wasRefused()) throw error;
			if (isTerminalQuestionResolveError(error)) {
				retainReservation = true;
				return false;
			}
			const rejection = readQuestionRejection(error);
			if (rejection?.code === "INVALID_REQUEST" || rejection?.code === "FORBIDDEN") {
				if (rejection.code === "INVALID_REQUEST" && rejection.reason === "QUESTION_INVALID_ANSWER") onAnswerProcessed?.();
				throw error;
			}
			const answer = await state.answer?.catch(() => void 0);
			retainReservation = true;
			if (!answer || answer.status === "pending" || answer.status === "answered" && answer.resolutionId === void 0) throw new QuestionAnswerUnconfirmedError(error);
			consumed = answer.status === "answered" && answer.resolutionId === resolutionId;
		}
		if (consumed) onAnswerProcessed?.();
		return consumed;
	} finally {
		reservation.finish(consumed || retainReservation);
	}
}
/** Cancels a question before the same inbound message takes another route. */
async function cancelPendingAgentQuestionForSession(params) {
	params.authority?.assertCurrent();
	const sessionKey = params.sessionKey?.trim();
	const state = sessionKey ? pendingAgentQuestions.get(sessionKey) : void 0;
	if (!state || state.resolving) return false;
	if (state.kind === "secret") {
		state.answerAuthority?.assertActive();
		state.resolving = true;
		return state.settle();
	}
	const reservation = reserveQuestionInput(state, params.authority);
	const sourceBound = params.authority?.kind === "source-bound";
	let consumed = false;
	state.cancelRequested = !sourceBound;
	try {
		if (sourceBound && !state.answer) try {
			await state.registration;
		} catch {
			return false;
		}
		reservation.assertCurrent();
		try {
			await state.gatewayCall("question.resolve", { timeoutMs: QUESTION_RPC_GRACE_MS }, {
				id: state.questionId,
				cancel: true,
				resolvedBy: params.resolvedBy
			}, ...reservation.extra ? [reservation.extra] : []);
		} catch (error) {
			if (reservation.wasRefused() || !isTerminalQuestionResolveError(error)) throw error;
		}
		consumed = true;
		state.onCancel?.(params.resolvedBy);
		return true;
	} finally {
		reservation.finish(consumed);
	}
}
/** Presents one warned secret prompt and keeps its answer out of durable question records. */
function runAgentHarnessSecretInput(params) {
	params.signal?.throwIfAborted();
	const sessionKey = params.sessionKey.trim();
	const answerAuthority = captureAgentQuestionAnswerAuthority(sessionKey);
	if (!sessionKey) throw new Error("secret input requires a session key");
	if (pendingAgentQuestions.has(sessionKey)) throw new Error(`session already has a pending agent input request: ${sessionKey}`);
	return new Promise((resolve) => {
		let settled = false;
		const finish = (text) => {
			if (settled || pendingAgentQuestions.get(sessionKey) !== state) return false;
			settled = true;
			pendingAgentQuestions.delete(sessionKey);
			clearTimeout(timeout);
			params.signal?.removeEventListener("abort", onAbort);
			resolve(text);
			return true;
		};
		const onAbort = () => finish();
		const timeout = setTimeout(onAbort, params.timeoutMs);
		timeout.unref?.();
		const state = {
			kind: "secret",
			sessionKey,
			answerAuthority,
			resolving: false,
			settle: finish
		};
		pendingAgentQuestions.set(sessionKey, state);
		params.signal?.addEventListener("abort", onAbort, { once: true });
		if (params.signal?.aborted) {
			onAbort();
			return;
		}
		deliverAgentHarnessUserInputPrompt(params.delivery, params.questions, params.promptOptions).catch(() => finish());
	});
}
/** Registers, presents, and waits for one harness-owned gateway question record. */
async function runAgentHarnessGatewayQuestion(params) {
	const authority = resolveAgentQuestionAnswerAuthority(params.delivery.hostCapabilities);
	return await withAgentQuestionAnswerAuthority(authority, () => runScopedAgentHarnessQuestion(params));
}
async function runScopedAgentHarnessQuestion(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		if (params.questions.some((question) => question.isSecret)) {
			const text = await runAgentHarnessSecretInput({
				questions: params.questions,
				sessionKey: params.sessionKey,
				timeoutMs: params.timeoutMs,
				delivery: params.delivery,
				promptOptions: params.promptOptions,
				signal: params.signal
			});
			if (text === void 0) return { status: "cancelled" };
			const parsed = buildAgentHarnessUserInputAnswers(params.questions, text);
			return {
				status: "answered",
				answers: buildAgentQuestionAnswers(parsed)
			};
		}
		const gatewayCall = resolveAgentQuestionGatewayCall(params.gatewayCall);
		const questionId = params.questionId ?? `ask_${randomBytes(16).toString("hex")}`;
		const questions = buildAgentQuestionRequestQuestions(params.questions);
		let aborted = false;
		params.signal?.throwIfAborted();
		const prompt = _usingCtx$1.u(createQuestionPromptLifetime(params.signal));
		const claim = registerPendingAgentQuestion({
			questionId,
			sessionKey: params.sessionKey,
			questions: params.questions,
			gatewayCall: params.gatewayCall,
			onCancel: prompt.close
		});
		const registration = Promise.resolve().then(() => gatewayCall("question.request", {}, {
			id: questionId,
			questions,
			sessionKey: params.sessionKey,
			...params.agentId ? { agentId: params.agentId } : {},
			...params.runId ? { runId: params.runId } : {},
			timeoutMs: params.timeoutMs
		}, params.signal ? { signal: params.signal } : void 0));
		claim.attachRegistration(registration);
		const cancel = async (resolvedBy) => {
			prompt.close();
			try {
				return await gatewayCall("question.resolve", { timeoutMs: QUESTION_RPC_GRACE_MS }, {
					id: questionId,
					cancel: true,
					resolvedBy
				});
			} catch (error) {
				if (!isTerminalQuestionResolveError(error)) throw error;
				try {
					const result = await gatewayCall("question.waitAnswer", { timeoutMs: QUESTION_RPC_GRACE_MS }, {
						id: questionId,
						timeoutMs: 1e3
					});
					return result.status === "answered" ? result : void 0;
				} catch {
					return;
				}
			}
		};
		const onAbort = () => {
			aborted = true;
			prompt.close();
			claim.dispose();
			cancel("run-abort").catch(() => void 0);
		};
		try {
			params.signal?.addEventListener("abort", onAbort, { once: true });
			if (params.signal?.aborted) {
				onAbort();
				params.signal.throwIfAborted();
			}
			if ((await registration).id !== questionId) throw new Error("question.request returned an unexpected question id");
			if (aborted || claim.isCancellationRequested() || params.signal?.aborted) {
				const terminal = await cancel(aborted || params.signal?.aborted ? "run-abort" : "superseded-input");
				if (terminal?.status === "answered") return terminal;
				return { status: "cancelled" };
			}
			const answer = gatewayCall("question.waitAnswer", { timeoutMs: params.timeoutMs + QUESTION_RPC_GRACE_MS }, {
				id: questionId,
				timeoutMs: params.timeoutMs,
				includeResolutionId: true
			}, params.signal ? { signal: params.signal } : void 0).finally(prompt.close);
			claim.setAnswer(answer);
			const answerOutcome = answer.then((result) => ({
				kind: "answer",
				result
			}), (error) => ({
				kind: "answer-error",
				error
			}));
			const finishAnswer = async (result) => {
				const terminal = result.status === "pending" ? await cancel("wait-timeout") ?? { status: "cancelled" } : result;
				return terminal.status === "answered" ? {
					status: terminal.status,
					answers: terminal.answers
				} : terminal;
			};
			const beforeDelivery = await Promise.race([answerOutcome, new Promise((resolve) => {
				setTimeout(() => resolve({ kind: "delivery-ready" }), 0);
			})]);
			if (beforeDelivery.kind === "answer") return await finishAnswer(beforeDelivery.result);
			if (beforeDelivery.kind === "answer-error") throw beforeDelivery.error;
			let consumed;
			do
				consumed = await Promise.race([claim.waitForResolution(), answerOutcome.then(() => true)]);
			while (!consumed && claim.isResolving());
			if (consumed) {
				const outcome = await answerOutcome;
				if (outcome.kind === "answer-error") throw outcome.error;
				return await finishAnswer(outcome.result);
			}
			const deliveryOutcome = deliverAgentHarnessQuestionPrompt(params.delivery, questionId, params.questions, params.promptOptions, prompt.signal).then(() => ({ kind: "delivery" }), (error) => ({
				kind: "delivery-error",
				error
			}));
			const first = await Promise.race([answerOutcome, deliveryOutcome]);
			if (first.kind === "answer") return await finishAnswer(first.result);
			if (first.kind === "answer-error") throw first.error;
			if (first.kind === "delivery-error") {
				const terminal = await cancel("prompt-delivery-failed");
				if (terminal?.status === "answered") return terminal;
				throw new Error("harness question prompt delivery failed", { cause: first.error });
			}
			const terminal = await answerOutcome;
			if (terminal.kind === "answer-error") throw terminal.error;
			return await finishAnswer(terminal.result);
		} catch (error) {
			try {
				const terminal = await cancel(params.signal?.aborted ? "run-abort" : "harness-error");
				if (terminal?.status === "answered") return terminal;
			} catch {}
			if (params.signal?.aborted) return { status: "cancelled" };
			throw error;
		} finally {
			params.signal?.removeEventListener("abort", onAbort);
			claim.dispose();
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
export { registerPendingAgentQuestion as a, buildAgentHarnessUserInputAnswers as c, formatAgentHarnessUserInputPrompt as d, normalizeAgentHarnessUserInputAnswer as f, readQuestionRejection as g, createQuestionPromptLifetime as h, claimPreparedPendingAgentQuestionAnswer as i, deliverAgentHarnessUserInputPrompt as l, createGatewayQuestionCanceller as m, claimPendingAgentQuestionAnswer as n, runAgentHarnessGatewayQuestion as o, awaitGatewayQuestionAnswer as p, claimPendingAgentQuestionAnswerFromCaller as r, buildAgentHarnessQuestionPromptPayload as s, cancelPendingAgentQuestionForSession as t, emptyAgentHarnessUserInputAnswers as u };
