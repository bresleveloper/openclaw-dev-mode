import { r as modelCatalog } from "./openclaw.plugin-CbQGYxPU.mjs";
import { executeDecisionHttp } from "openclaw/plugin-sdk/decisions-http-runtime";
import { isDeepStrictEqual } from "node:util";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/subq/src/decision-codec.ts
const RETIRED = new Set(modelCatalog.suppressions.map((rule) => rule.model));
const MAX_QUESTIONS = 128;
const MAX_CHOICE_OPTIONS = 255;
const MAX_SCORE_LEVELS = 10;
function supportsSubQDecisionBatch(batch, model) {
	const questions = Object.entries(batch.questions);
	return model.length > 0 && !RETIRED.has(model) && batch.state !== null && questions.length > 0 && questions.length <= MAX_QUESTIONS && questions.every(([id, question]) => {
		if (id.length > 100) return false;
		if (question.type === "choice") {
			const count = Object.keys(question.criteria).length;
			return count >= 2 && count <= MAX_CHOICE_OPTIONS;
		}
		if (question.type === "score") return question.criteria.length >= 2 && question.criteria.length <= MAX_SCORE_LEVELS;
		return true;
	});
}
function record(value) {
	if (!isRecord(value)) throw new Error("Invalid SubQ response.");
	return value;
}
function probability(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) throw new Error("Invalid SubQ probability.");
	return value;
}
/** Translate the documented wire contract; the host also validates the resulting Decision batch. */
function decodeSubQDecisionResult(payload, batch) {
	const result = record(payload);
	const wireAnswers = record(result.answers);
	if (typeof result.model !== "string" || !result.model || Object.keys(wireAnswers).length !== Object.keys(batch.questions).length) throw new Error("Invalid SubQ result.");
	const answers = Object.create(null);
	for (const [id, question] of Object.entries(batch.questions)) {
		const answer = record(wireAnswers[id]);
		if (question.type === "boolean") {
			if (answer.type !== "noul") throw new Error("Invalid SubQ answer type.");
			answers[id] = {
				type: "boolean",
				probabilityTrue: probability(answer.noul)
			};
			continue;
		}
		if (answer.type !== question.type) throw new Error("Invalid SubQ answer type.");
		const labels = question.type === "score" ? question.criteria.map((_, i) => String(i)) : Object.keys(question.criteria);
		const distribution = record(answer.probabilities);
		if (Object.keys(distribution).length !== labels.length || labels.some((key) => !Object.hasOwn(distribution, key))) throw new Error("Invalid SubQ distribution.");
		const probabilities = labels.map((key) => probability(distribution[key]));
		if (!probabilities.some((p) => p > 0)) throw new Error("Invalid SubQ distribution.");
		const confidence = answer.confidence === void 0 ? void 0 : probability(answer.confidence);
		if (question.type === "choice") {
			if (typeof answer.choice !== "string" || !labels.includes(answer.choice)) throw new Error("Invalid SubQ choice.");
			answers[id] = {
				type: "choice",
				choice: answer.choice,
				probabilities: Object.fromEntries(labels.map((key, i) => [key, probabilities[i]])),
				...confidence === void 0 ? {} : { confidence }
			};
		} else {
			const legend = record(answer.legend);
			if (typeof answer.score !== "number" || !Number.isFinite(answer.score) || answer.score < 0 || answer.score > labels.length - 1 || Object.keys(legend).length !== labels.length || labels.some((key, i) => !isDeepStrictEqual(legend[key], question.criteria[i]))) throw new Error("Invalid SubQ score.");
			answers[id] = {
				type: "score",
				score: answer.score,
				probabilities,
				...confidence === void 0 ? {} : { confidence }
			};
		}
	}
	const usage = record(result.usage);
	const inputTokens = usage.input_tokens;
	if (typeof inputTokens !== "number" || !Number.isSafeInteger(inputTokens) || inputTokens < 0) throw new Error("Invalid SubQ usage.");
	if (usage.output_tokens !== 0) throw new Error("Invalid SubQ output usage.");
	return {
		model: result.model,
		answers,
		usage: {
			inputTokens,
			outputTokens: 0
		}
	};
}
function encodeSubQDecisionRequest(batch, modelId) {
	return JSON.stringify({
		model: modelId,
		state: batch.state,
		questions: Object.fromEntries(Object.entries(batch.questions).map(([id, question]) => [id, question.type === "boolean" ? {
			...question,
			type: "noul"
		} : question]))
	});
}
// extensions/subq/src/runtime.ts
const MAX_BYTES = 1048576;
async function evaluate(batch, context, apiKey) {
	context.signal.throwIfAborted();
	if (!supportsSubQDecisionBatch(batch, context.model)) return {
		status: "unavailable",
		reason: "unsupported-input"
	};
	const body = encodeSubQDecisionRequest(batch, context.model);
	if (Buffer.byteLength(body) > MAX_BYTES) return {
		status: "unavailable",
		reason: "unsupported-input"
	};
	return executeDecisionHttp({
		provider: "subq",
		baseUrl: "https://api.subq.ai/v1",
		endpointPath: "systemone",
		body,
		auth: {
			mode: "api-key",
			apiKey
		},
		signal: context.signal,
		deadlineMonotonicMs: context.deadlineMonotonicMs,
		isAdmissible: context.isAdmissible ?? (() => true),
		decode: (payload) => ({
			status: "ok",
			result: decodeSubQDecisionResult(payload, batch)
		})
	});
}
export { evaluate };
