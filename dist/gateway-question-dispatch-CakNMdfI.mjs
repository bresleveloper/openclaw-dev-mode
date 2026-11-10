import { h as readQuestionDispatchCapability, p as prepareQuestionInputAuthority } from "./host-private-capabilities-eTr803c9.mjs";
import { t as isEmbeddedMode } from "./embedded-mode--Mk71zY-.mjs";
//#region src/agents/harness/gateway-question-dispatch.ts
var QuestionDispatchRefusedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "QuestionDispatchRefusedError";
	}
};
function refuseQuestionDispatch(error) {
	throw new QuestionDispatchRefusedError(error instanceof Error ? error.message : "question dispatch authority refused", { cause: error });
}
async function prepareQuestionDispatchAuthority(authority) {
	try {
		const prepared = await prepareQuestionInputAuthority(authority);
		await prepared.prepareCurrent?.();
		return prepared;
	} catch (error) {
		return refuseQuestionDispatch(error);
	}
}
/** No input was submitted; the inherited name preserves legacy runtime refusal propagation. */
var QuestionDispatchUnsupportedError = class extends QuestionDispatchRefusedError {};
/** A core input was refused after question and source preparation. */
var PreparedQuestionAnswerRefusedError = class extends Error {
	constructor(cause) {
		super(cause instanceof Error ? cause.message : "Prepared question input is no longer current", { cause });
		this.name = "PreparedQuestionAnswerRefusedError";
	}
};
function buildAgentQuestionRequestQuestions(questions) {
	return questions.map(({ id, defaultAnswers, ...question }) => ({
		...question,
		questionId: id,
		options: [...question.options ?? []],
		...defaultAnswers ? { defaultAnswers: [...defaultAnswers] } : {}
	}));
}
function buildAgentQuestionAnswers(parsed) {
	return { answers: Object.fromEntries(Object.entries(parsed.answers).map(([id, answer]) => [id, answer.answers])) };
}
/** A failed transport cannot release possibly committed input for another route. */
var QuestionAnswerUnconfirmedError = class extends Error {
	constructor(cause) {
		super("The question answer may have been accepted, but confirmation was lost. It was not sent again; check the conversation before retrying.", { cause });
		this.name = "QuestionAnswerUnconfirmedError";
	}
};
/** The effect starts inside the reader's synchronous consumer, before its authority expires. */
async function withQuestionDispatchAuthority(authority, consume) {
	const capability = readQuestionDispatchCapability(authority?.assertCurrent);
	const callerRead = capability?.callerRead;
	if (!callerRead) {
		(capability?.assertCompatibilityCurrent ?? authority?.assertCurrent)?.();
		return consume();
	}
	const { withSessionEntriesFromStoresInWorker } = await import("./session-entry-read-runtime-BS7SNC06.mjs");
	const consumePrepared = (reads) => {
		callerRead.assertPrepared(reads);
		authority?.assertCurrent();
		return { value: consume() };
	};
	return (await withSessionEntriesFromStoresInWorker(callerRead.reads, consumePrepared, { ordered: true })).value;
}
function resolveAgentQuestionGatewayCall(dispatcher) {
	if (dispatcher && typeof dispatcher !== "function" && dispatcher.version !== 2) throw new Error("unsupported question dispatcher version");
	let embeddedBroker = null;
	return async (...args) => {
		const [method, options, params, extra] = args;
		if (dispatcher && extra?.dispatchAuthority?.kind === "run") {
			const authority = extra.dispatchAuthority;
			(readQuestionDispatchCapability(authority.assertCurrent)?.assertCompatibilityCurrent ?? authority.assertCurrent)();
		}
		if (typeof dispatcher === "function") {
			if (extra?.dispatchAuthority?.kind === "source-bound") {
				extra.dispatchAuthority.assertCurrent();
				throw new QuestionDispatchUnsupportedError("source-bound question input requires the default or a version 2 dispatcher");
			}
			return args.length === 4 && (!extra?.dispatchAuthority || extra.signal) ? dispatcher(method, options, params, extra?.signal ? { signal: extra.signal } : void 0) : dispatcher(method, options, params);
		}
		if (dispatcher) return dispatcher.call({
			method,
			options,
			params,
			signal: extra?.signal,
			authority: extra?.dispatchAuthority?.kind === "source-bound" ? {
				kind: "source-bound",
				assertCurrent: readQuestionDispatchCapability(extra.dispatchAuthority.assertCurrent)?.assertCompatibilityCurrent ?? extra.dispatchAuthority.assertCurrent,
				assertCurrentAsync: extra.dispatchAuthority.prepareCurrent
			} : { kind: "unscoped" }
		});
		if (!embeddedBroker && isEmbeddedMode()) {
			const { getEmbeddedQuestionBroker } = await import("./embedded-question-broker-CLBDHKlj.mjs");
			embeddedBroker = getEmbeddedQuestionBroker();
		}
		if (embeddedBroker) {
			await extra?.dispatchAuthority?.prepareCurrent?.();
			extra?.signal?.throwIfAborted();
			return withQuestionDispatchAuthority(extra?.dispatchAuthority, () => embeddedBroker.call(method, params, extra));
		}
		const { callGatewayTool } = await import("./gateway-question-dispatch.runtime.js");
		return callGatewayTool(method, options, params, extra);
	};
}
//#endregion
export { buildAgentQuestionAnswers as a, refuseQuestionDispatch as c, QuestionDispatchUnsupportedError as i, resolveAgentQuestionGatewayCall as l, QuestionAnswerUnconfirmedError as n, buildAgentQuestionRequestQuestions as o, QuestionDispatchRefusedError as r, prepareQuestionDispatchAuthority as s, PreparedQuestionAnswerRefusedError as t, withQuestionDispatchAuthority as u };
