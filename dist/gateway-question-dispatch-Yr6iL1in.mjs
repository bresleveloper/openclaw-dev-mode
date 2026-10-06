import { t as isEmbeddedMode } from "./embedded-mode--Mk71zY-.mjs";
//#region src/agents/harness/gateway-question-dispatch.ts
var QuestionDispatchRefusedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "QuestionDispatchRefusedError";
	}
};
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
	return questions.map(({ id, ...question }) => ({
		...question,
		questionId: id,
		options: [...question.options ?? []]
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
function resolveAgentQuestionGatewayCall(dispatcher) {
	if (dispatcher && typeof dispatcher !== "function" && dispatcher.version !== 2) throw new Error("unsupported question dispatcher version");
	let embeddedBroker = null;
	return async (...args) => {
		const [method, options, params, extra] = args;
		if (typeof dispatcher === "function") {
			if (extra?.dispatchAuthority?.kind === "source-bound") {
				extra.dispatchAuthority.assertCurrent();
				throw new QuestionDispatchUnsupportedError("source-bound question input requires the default or a version 2 dispatcher");
			}
			return args.length === 4 ? dispatcher(method, options, params, extra?.signal ? { signal: extra.signal } : void 0) : dispatcher(method, options, params);
		}
		if (dispatcher) return dispatcher.call({
			method,
			options,
			params,
			signal: extra?.signal,
			authority: extra?.dispatchAuthority?.kind === "source-bound" ? {
				kind: "source-bound",
				assertCurrent: extra.dispatchAuthority.assertCurrent
			} : { kind: "unscoped" }
		});
		if (!embeddedBroker && isEmbeddedMode()) {
			const { getEmbeddedQuestionBroker } = await import("./embedded-question-broker-Cn7Wb9fW.mjs");
			embeddedBroker = getEmbeddedQuestionBroker();
		}
		if (embeddedBroker) {
			extra?.signal?.throwIfAborted();
			extra?.dispatchAuthority?.assertCurrent();
			return embeddedBroker.call(method, params, extra);
		}
		const { callGatewayTool } = await import("./gateway-question-dispatch.runtime.js");
		return callGatewayTool(method, options, params, extra);
	};
}
//#endregion
export { buildAgentQuestionAnswers as a, QuestionDispatchUnsupportedError as i, QuestionAnswerUnconfirmedError as n, buildAgentQuestionRequestQuestions as o, QuestionDispatchRefusedError as r, resolveAgentQuestionGatewayCall as s, PreparedQuestionAnswerRefusedError as t };
