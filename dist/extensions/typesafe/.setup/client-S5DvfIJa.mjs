import { c as providerBaseUrl, n as encodeTypeSafeLocalInput, o as HOSTED_ORIGIN, r as restoreTypeSafeLocalLegends, t as decodeTypeSafeDecisionResult, u as usesHostedEndpoint } from "./decision-codec-BJkpuJSs.mjs";
import { encodeSystemOneQuestions } from "openclaw/plugin-sdk/decisions";
import { evaluateDecisionHttp } from "openclaw/plugin-sdk/decisions-http-runtime";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { isDeepStrictEqual } from "node:util";
// extensions/typesafe/src/schema-validator.generated.js
/*!
TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
function CodePointCount(value) {
	let result = 0, index = 0, prev = 0;
	for (; index < value.length;) {
		let next = value.charCodeAt(index++) >> 10;
		result += +((prev << 8 | next) !== 13879), prev = next;
	}
	return result;
}
var isEvaluationInput = (() => {
	let External = [
		/(^state$|^questions$|^model$)/u,
		/(?!)/u,
		/(?!)/u,
		/(^type$|^instructions$|^criteria$)/u,
		/(?!)/u,
		/(^true$|^false$)/u,
		/(?!)/u,
		/(?!)/u,
		/(^type$|^instructions$|^criteria$)/u,
		/(?!)/u,
		/(?!)/u,
		/(?!)/u,
		/(^type$|^instructions$|^criteria$)/u,
		/(?!)/u,
		/(?!)/u,
		/^[a-zA-Z0-9._/-]+$/u
	], check_0 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "state" in value && "questions" in value && Object.getOwnPropertyNames(value).every((unique_0, unique_1) => External[0].test(unique_0) || !1) && (typeof value.state == "string" || typeof value.state == "object" && value.state !== null && !Array.isArray(value.state) && Object.getOwnPropertyNames(value.state).every((unique_2, unique_3) => External[1].test(unique_2) || !0) && !0 || Array.isArray(value.state) && value.state.every((unique_4, index) => !0) || value.state === null) && typeof value.questions == "object" && value.questions !== null && !Array.isArray(value.questions) && Object.getOwnPropertyNames(value.questions).every((unique_5, unique_6) => External[2].test(unique_5) || typeof value.questions[unique_5] == "object" && value.questions[unique_5] !== null && !Array.isArray(value.questions[unique_5]) && "type" in value.questions[unique_5] && Object.getOwnPropertyNames(value.questions[unique_5]).every((unique_7, unique_8) => External[3].test(unique_7) || !1) && typeof value.questions[unique_5].type == "string" && value.questions[unique_5].type === "noul" && (value.questions[unique_5].instructions === void 0 || !("instructions" in value.questions[unique_5]) || typeof value.questions[unique_5].instructions == "string" || typeof value.questions[unique_5].instructions == "object" && value.questions[unique_5].instructions !== null && !Array.isArray(value.questions[unique_5].instructions) && Object.getOwnPropertyNames(value.questions[unique_5].instructions).every((unique_9, unique_10) => External[4].test(unique_9) || !0) && !0 || Array.isArray(value.questions[unique_5].instructions) && value.questions[unique_5].instructions.every((unique_11, index) => !0) || value.questions[unique_5].instructions === null) && (value.questions[unique_5].criteria === void 0 || !("criteria" in value.questions[unique_5]) || typeof value.questions[unique_5].criteria == "object" && value.questions[unique_5].criteria !== null && !Array.isArray(value.questions[unique_5].criteria) && Object.getOwnPropertyNames(value.questions[unique_5].criteria).every((unique_12, unique_13) => External[5].test(unique_12) || !1) && (value.questions[unique_5].criteria.true === void 0 || !("true" in value.questions[unique_5].criteria) || typeof value.questions[unique_5].criteria.true == "string" || typeof value.questions[unique_5].criteria.true == "object" && value.questions[unique_5].criteria.true !== null && !Array.isArray(value.questions[unique_5].criteria.true) && Object.getOwnPropertyNames(value.questions[unique_5].criteria.true).every((unique_14, unique_15) => External[6].test(unique_14) || !0) && !0 || Array.isArray(value.questions[unique_5].criteria.true) && value.questions[unique_5].criteria.true.every((unique_16, index) => !0) || value.questions[unique_5].criteria.true === null) && (value.questions[unique_5].criteria.false === void 0 || !("false" in value.questions[unique_5].criteria) || typeof value.questions[unique_5].criteria.false == "string" || typeof value.questions[unique_5].criteria.false == "object" && value.questions[unique_5].criteria.false !== null && !Array.isArray(value.questions[unique_5].criteria.false) && Object.getOwnPropertyNames(value.questions[unique_5].criteria.false).every((unique_17, unique_18) => External[7].test(unique_17) || !0) && !0 || Array.isArray(value.questions[unique_5].criteria.false) && value.questions[unique_5].criteria.false.every((unique_19, index) => !0) || value.questions[unique_5].criteria.false === null) || value.questions[unique_5].criteria === null) || typeof value.questions[unique_5] == "object" && value.questions[unique_5] !== null && !Array.isArray(value.questions[unique_5]) && "type" in value.questions[unique_5] && "criteria" in value.questions[unique_5] && Object.getOwnPropertyNames(value.questions[unique_5]).every((unique_20, unique_21) => External[8].test(unique_20) || !1) && typeof value.questions[unique_5].type == "string" && value.questions[unique_5].type === "choice" && (value.questions[unique_5].instructions === void 0 || !("instructions" in value.questions[unique_5]) || typeof value.questions[unique_5].instructions == "string" || typeof value.questions[unique_5].instructions == "object" && value.questions[unique_5].instructions !== null && !Array.isArray(value.questions[unique_5].instructions) && Object.getOwnPropertyNames(value.questions[unique_5].instructions).every((unique_22, unique_23) => External[9].test(unique_22) || !0) && !0 || Array.isArray(value.questions[unique_5].instructions) && value.questions[unique_5].instructions.every((unique_24, index) => !0) || value.questions[unique_5].instructions === null) && typeof value.questions[unique_5].criteria == "object" && value.questions[unique_5].criteria !== null && !Array.isArray(value.questions[unique_5].criteria) && Object.getOwnPropertyNames(value.questions[unique_5].criteria).every((unique_25, unique_26) => External[10].test(unique_25) || typeof value.questions[unique_5].criteria[unique_25] == "string" || typeof value.questions[unique_5].criteria[unique_25] == "object" && value.questions[unique_5].criteria[unique_25] !== null && !Array.isArray(value.questions[unique_5].criteria[unique_25]) && Object.getOwnPropertyNames(value.questions[unique_5].criteria[unique_25]).every((unique_27, unique_28) => External[11].test(unique_27) || !0) && !0 || Array.isArray(value.questions[unique_5].criteria[unique_25]) && value.questions[unique_5].criteria[unique_25].every((unique_29, index) => !0) || value.questions[unique_5].criteria[unique_25] === null) && Object.getOwnPropertyNames(value.questions[unique_5].criteria).length >= 2 && Object.getOwnPropertyNames(value.questions[unique_5].criteria).length <= 255 || typeof value.questions[unique_5] == "object" && value.questions[unique_5] !== null && !Array.isArray(value.questions[unique_5]) && "type" in value.questions[unique_5] && "criteria" in value.questions[unique_5] && Object.getOwnPropertyNames(value.questions[unique_5]).every((unique_30, unique_31) => External[12].test(unique_30) || !1) && typeof value.questions[unique_5].type == "string" && value.questions[unique_5].type === "score" && (value.questions[unique_5].instructions === void 0 || !("instructions" in value.questions[unique_5]) || typeof value.questions[unique_5].instructions == "string" || typeof value.questions[unique_5].instructions == "object" && value.questions[unique_5].instructions !== null && !Array.isArray(value.questions[unique_5].instructions) && Object.getOwnPropertyNames(value.questions[unique_5].instructions).every((unique_32, unique_33) => External[13].test(unique_32) || !0) && !0 || Array.isArray(value.questions[unique_5].instructions) && value.questions[unique_5].instructions.every((unique_34, index) => !0) || value.questions[unique_5].instructions === null) && Array.isArray(value.questions[unique_5].criteria) && value.questions[unique_5].criteria.every((unique_35, index) => typeof unique_35 == "string" || typeof unique_35 == "object" && unique_35 !== null && !Array.isArray(unique_35) && Object.getOwnPropertyNames(unique_35).every((unique_36, unique_37) => External[14].test(unique_36) || !0) && !0 || Array.isArray(unique_35) && unique_35.every((unique_38, index2) => !0) || unique_35 === null) && value.questions[unique_5].criteria.length >= 2 && value.questions[unique_5].criteria.length <= 10) && Object.getOwnPropertyNames(value.questions).length >= 1 && (value.model === void 0 || !("model" in value) || typeof value.model == "string" && (value.model.length >= 2 || value.model.length >= 1 && CodePointCount(value.model) >= 1) && (value.model.length <= 128 || value.model.length <= 256 && CodePointCount(value.model) <= 128) && External[15].test(value.model));
	return (value) => check_0(value);
})();
var isEvaluation = (() => {
	let External = [
		/^[a-zA-Z0-9._/-]+$/u,
		/(?!)/u,
		/(?!)/u,
		/(?!)/u,
		/(?!)/u,
		/(?!)/u
	], check_0 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "model" in value && "answers" in value && "usage" in value && typeof value.model == "string" && (value.model.length >= 2 || value.model.length >= 1 && CodePointCount(value.model) >= 1) && (value.model.length <= 128 || value.model.length <= 256 && CodePointCount(value.model) <= 128) && External[0].test(value.model) && typeof value.answers == "object" && value.answers !== null && !Array.isArray(value.answers) && Object.getOwnPropertyNames(value.answers).every((unique_0, unique_1) => External[1].test(unique_0) || typeof value.answers[unique_0] == "object" && value.answers[unique_0] !== null && !Array.isArray(value.answers[unique_0]) && "type" in value.answers[unique_0] && "noul" in value.answers[unique_0] && Object.getOwnPropertyNames(value.answers[unique_0]).length === 2 && typeof value.answers[unique_0].type == "string" && value.answers[unique_0].type === "noul" && Number.isFinite(value.answers[unique_0].noul) && value.answers[unique_0].noul >= 0 && value.answers[unique_0].noul <= 1 || typeof value.answers[unique_0] == "object" && value.answers[unique_0] !== null && !Array.isArray(value.answers[unique_0]) && "type" in value.answers[unique_0] && "choice" in value.answers[unique_0] && "confidence" in value.answers[unique_0] && "probabilities" in value.answers[unique_0] && Object.getOwnPropertyNames(value.answers[unique_0]).length === 4 && typeof value.answers[unique_0].type == "string" && value.answers[unique_0].type === "choice" && typeof value.answers[unique_0].choice == "string" && Number.isFinite(value.answers[unique_0].confidence) && value.answers[unique_0].confidence >= 0 && value.answers[unique_0].confidence <= 1 && typeof value.answers[unique_0].probabilities == "object" && value.answers[unique_0].probabilities !== null && !Array.isArray(value.answers[unique_0].probabilities) && Object.getOwnPropertyNames(value.answers[unique_0].probabilities).every((unique_2, unique_3) => External[2].test(unique_2) || Number.isFinite(value.answers[unique_0].probabilities[unique_2]) && value.answers[unique_0].probabilities[unique_2] >= 0 && value.answers[unique_0].probabilities[unique_2] <= 1) && Object.getOwnPropertyNames(value.answers[unique_0].probabilities).length >= 2 && Object.getOwnPropertyNames(value.answers[unique_0].probabilities).length <= 255 || typeof value.answers[unique_0] == "object" && value.answers[unique_0] !== null && !Array.isArray(value.answers[unique_0]) && "type" in value.answers[unique_0] && "score" in value.answers[unique_0] && "confidence" in value.answers[unique_0] && "probabilities" in value.answers[unique_0] && "legend" in value.answers[unique_0] && Object.getOwnPropertyNames(value.answers[unique_0]).length === 5 && typeof value.answers[unique_0].type == "string" && value.answers[unique_0].type === "score" && Number.isFinite(value.answers[unique_0].score) && value.answers[unique_0].score >= 0 && value.answers[unique_0].score <= 9 && Number.isFinite(value.answers[unique_0].confidence) && value.answers[unique_0].confidence >= 0 && value.answers[unique_0].confidence <= 1 && typeof value.answers[unique_0].probabilities == "object" && value.answers[unique_0].probabilities !== null && !Array.isArray(value.answers[unique_0].probabilities) && Object.getOwnPropertyNames(value.answers[unique_0].probabilities).every((unique_4, unique_5) => External[3].test(unique_4) || Number.isFinite(value.answers[unique_0].probabilities[unique_4]) && value.answers[unique_0].probabilities[unique_4] >= 0 && value.answers[unique_0].probabilities[unique_4] <= 1) && Object.getOwnPropertyNames(value.answers[unique_0].probabilities).length >= 2 && Object.getOwnPropertyNames(value.answers[unique_0].probabilities).length <= 255 && typeof value.answers[unique_0].legend == "object" && value.answers[unique_0].legend !== null && !Array.isArray(value.answers[unique_0].legend) && Object.getOwnPropertyNames(value.answers[unique_0].legend).every((unique_6, unique_7) => External[4].test(unique_6) || typeof value.answers[unique_0].legend[unique_6] == "string" || typeof value.answers[unique_0].legend[unique_6] == "object" && value.answers[unique_0].legend[unique_6] !== null && !Array.isArray(value.answers[unique_0].legend[unique_6]) && Object.getOwnPropertyNames(value.answers[unique_0].legend[unique_6]).every((unique_8, unique_9) => External[5].test(unique_8) || !0) && !0 || Array.isArray(value.answers[unique_0].legend[unique_6]) && value.answers[unique_0].legend[unique_6].every((unique_10, index) => !0) || value.answers[unique_0].legend[unique_6] === null) && Object.getOwnPropertyNames(value.answers[unique_0].legend).length >= 2 && Object.getOwnPropertyNames(value.answers[unique_0].legend).length <= 10) && Object.getOwnPropertyNames(value.answers).length >= 1 && typeof value.usage == "object" && value.usage !== null && !Array.isArray(value.usage) && "input_tokens" in value.usage && "output_tokens" in value.usage && Number.isInteger(value.usage.input_tokens) && (!(Number.isFinite(value.usage.input_tokens) || typeof value.usage.input_tokens == "bigint") || value.usage.input_tokens >= 0 && value.usage.input_tokens <= 9007199254740991) && Number.isInteger(value.usage.output_tokens) && (!(Number.isFinite(value.usage.output_tokens) || typeof value.usage.output_tokens == "bigint") || value.usage.output_tokens >= 0 && value.usage.output_tokens <= 9007199254740991);
	return (value) => check_0(value);
})();
var isEvaluationQuestion = (() => {
	let External = [
		/(^type$|^instructions$|^criteria$)/u,
		/(?!)/u,
		/(^true$|^false$)/u,
		/(?!)/u,
		/(?!)/u,
		/(^type$|^instructions$|^criteria$)/u,
		/(?!)/u,
		/(?!)/u,
		/(?!)/u,
		/(^type$|^instructions$|^criteria$)/u,
		/(?!)/u,
		/(?!)/u
	], check_0 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && Object.getOwnPropertyNames(value).every((unique_0, unique_1) => External[0].test(unique_0) || !1) && typeof value.type == "string" && value.type === "noul" && (value.instructions === void 0 || !("instructions" in value) || typeof value.instructions == "string" || typeof value.instructions == "object" && value.instructions !== null && !Array.isArray(value.instructions) && Object.getOwnPropertyNames(value.instructions).every((unique_2, unique_3) => External[1].test(unique_2) || !0) && !0 || Array.isArray(value.instructions) && value.instructions.every((unique_4, index) => !0) || value.instructions === null) && (value.criteria === void 0 || !("criteria" in value) || typeof value.criteria == "object" && value.criteria !== null && !Array.isArray(value.criteria) && Object.getOwnPropertyNames(value.criteria).every((unique_5, unique_6) => External[2].test(unique_5) || !1) && (value.criteria.true === void 0 || !("true" in value.criteria) || typeof value.criteria.true == "string" || typeof value.criteria.true == "object" && value.criteria.true !== null && !Array.isArray(value.criteria.true) && Object.getOwnPropertyNames(value.criteria.true).every((unique_7, unique_8) => External[3].test(unique_7) || !0) && !0 || Array.isArray(value.criteria.true) && value.criteria.true.every((unique_9, index) => !0) || value.criteria.true === null) && (value.criteria.false === void 0 || !("false" in value.criteria) || typeof value.criteria.false == "string" || typeof value.criteria.false == "object" && value.criteria.false !== null && !Array.isArray(value.criteria.false) && Object.getOwnPropertyNames(value.criteria.false).every((unique_10, unique_11) => External[4].test(unique_10) || !0) && !0 || Array.isArray(value.criteria.false) && value.criteria.false.every((unique_12, index) => !0) || value.criteria.false === null) || value.criteria === null) || typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && "criteria" in value && Object.getOwnPropertyNames(value).every((unique_13, unique_14) => External[5].test(unique_13) || !1) && typeof value.type == "string" && value.type === "choice" && (value.instructions === void 0 || !("instructions" in value) || typeof value.instructions == "string" || typeof value.instructions == "object" && value.instructions !== null && !Array.isArray(value.instructions) && Object.getOwnPropertyNames(value.instructions).every((unique_15, unique_16) => External[6].test(unique_15) || !0) && !0 || Array.isArray(value.instructions) && value.instructions.every((unique_17, index) => !0) || value.instructions === null) && typeof value.criteria == "object" && value.criteria !== null && !Array.isArray(value.criteria) && Object.getOwnPropertyNames(value.criteria).every((unique_18, unique_19) => External[7].test(unique_18) || typeof value.criteria[unique_18] == "string" || typeof value.criteria[unique_18] == "object" && value.criteria[unique_18] !== null && !Array.isArray(value.criteria[unique_18]) && Object.getOwnPropertyNames(value.criteria[unique_18]).every((unique_20, unique_21) => External[8].test(unique_20) || !0) && !0 || Array.isArray(value.criteria[unique_18]) && value.criteria[unique_18].every((unique_22, index) => !0) || value.criteria[unique_18] === null) && Object.getOwnPropertyNames(value.criteria).length >= 2 && Object.getOwnPropertyNames(value.criteria).length <= 255 || typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && "criteria" in value && Object.getOwnPropertyNames(value).every((unique_23, unique_24) => External[9].test(unique_23) || !1) && typeof value.type == "string" && value.type === "score" && (value.instructions === void 0 || !("instructions" in value) || typeof value.instructions == "string" || typeof value.instructions == "object" && value.instructions !== null && !Array.isArray(value.instructions) && Object.getOwnPropertyNames(value.instructions).every((unique_25, unique_26) => External[10].test(unique_25) || !0) && !0 || Array.isArray(value.instructions) && value.instructions.every((unique_27, index) => !0) || value.instructions === null) && Array.isArray(value.criteria) && value.criteria.every((unique_28, index) => typeof unique_28 == "string" || typeof unique_28 == "object" && unique_28 !== null && !Array.isArray(unique_28) && Object.getOwnPropertyNames(unique_28).every((unique_29, unique_30) => External[11].test(unique_29) || !0) && !0 || Array.isArray(unique_28) && unique_28.every((unique_31, index2) => !0) || unique_28 === null) && value.criteria.length >= 2 && value.criteria.length <= 10;
	return (value) => check_0(value);
})();
// extensions/typesafe/src/schema.ts
const MAX_JSON_BYTES = 4194304;
const MAX_JSON_NODES = 262144;
const MAX_JSON_DEPTH = 64;
/** Reject non-JSON values and excessive structure before schema validation or serialization. */
function assertBoundedJson(value) {
	let nodes = 0;
	const visit = (node, depth) => {
		if (++nodes > MAX_JSON_NODES || depth > MAX_JSON_DEPTH) throw new Error("TypeSafe JSON exceeds resource limits (262144 nodes or depth 64).");
		if (node === null || typeof node === "string" || typeof node === "boolean") return;
		if (typeof node === "number" && Number.isFinite(node)) return;
		if (typeof node !== "object" || !node) throw new Error("TypeSafe input must be JSON.");
		const array = Array.isArray(node);
		const prototype = Object.getPrototypeOf(node);
		if (array ? prototype !== Array.prototype : prototype !== Object.prototype && prototype !== null) throw new Error("TypeSafe input must be plain JSON.");
		if (array) {
			if (node.length > MAX_JSON_NODES || Object.keys(node).length !== node.length || Object.hasOwn(node, "toJSON")) throw new Error("TypeSafe input must be a bounded JSON array.");
			for (let index = 0; index < node.length; index++) {
				const descriptor = Object.getOwnPropertyDescriptor(node, index);
				if (!descriptor?.enumerable || !("value" in descriptor)) throw new Error("TypeSafe input must be plain JSON.");
				visit(descriptor.value, depth + 1);
			}
			return;
		}
		for (const key of Object.getOwnPropertyNames(node)) {
			if ([
				"__proto__",
				"constructor",
				"prototype"
			].includes(key)) throw new Error("TypeSafe input contains a reserved key.");
			const descriptor = Object.getOwnPropertyDescriptor(node, key);
			if (!descriptor?.enumerable || !("value" in descriptor)) throw new Error("TypeSafe input must be plain JSON.");
			visit(descriptor.value, depth + 1);
		}
	};
	visit(value, 0);
	if (Buffer.byteLength(JSON.stringify(value), "utf8") > 4194304) throw new Error("TypeSafe JSON exceeds the plugin resource limit of 4 MiB.");
}
/** Validate without including supplied state in diagnostics. */
function parseInput(value) {
	assertBoundedJson(value);
	if (!isEvaluationInput(value)) {
		if (value && typeof value === "object" && "questions" in value && value.questions && typeof value.questions === "object" && !Array.isArray(value.questions)) {
			for (const [index, q] of Object.values(value.questions).entries()) if (!isEvaluationQuestion(q)) {
				const kind = q && typeof q === "object" && "type" in q ? q.type : void 0;
				const hint = kind === "choice" ? "Choice requires 2–255 criteria descriptions." : kind === "score" ? "Score requires 2–10 ordered criteria descriptions." : kind === "noul" ? "Noul criteria may contain only true/false descriptions, or null." : "type must be choice, score, or noul.";
				throw new Error(`Invalid TypeSafe questions entry #${index + 1}: ${hint} Instructions/descriptions accept text, object, array, or null; no extra question fields.`);
			}
		}
		throw new Error("Invalid TypeSafe evaluation input: supply state (text/object/array/null), a nonempty questions map, and optionally a valid model ID; no extra fields.");
	}
	return value;
}
/** Check the response schema and correspondence to this exact question batch. */
function parseResult(value, input) {
	try {
		assertBoundedJson(value);
		if (!isEvaluation(value)) throw new Error();
		const questions = Object.entries(input.questions);
		if (Object.keys(value.answers).length !== questions.length) throw new Error();
		for (const [id, expected] of questions) {
			const answer = value.answers[id];
			if (!answer || answer.type !== expected.type) throw new Error();
			if (answer.type === "noul") continue;
			const labels = expected.type === "score" ? expected.criteria.map((_, index) => String(index)) : expected.type === "choice" ? Object.keys(expected.criteria) : [];
			if (Object.keys(answer.probabilities).length !== labels.length || labels.some((label) => !Object.hasOwn(answer.probabilities, label))) throw new Error();
			if (!(Object.values(answer.probabilities).reduce((sum, item) => sum + item, 0) > 0)) throw new Error();
			if (answer.type === "choice" && !labels.includes(answer.choice)) throw new Error();
			if (answer.type === "score" && expected.type === "score") {
				if (answer.score > labels.length - 1 || Object.keys(answer.legend).length !== labels.length || labels.some((label, index) => !isDeepStrictEqual(answer.legend[label], expected.criteria[index]))) throw new Error();
			}
		}
		return value;
	} catch {
		throw new Error("TypeSafe returned an invalid evaluation response.");
	}
}
// extensions/typesafe/src/client.ts
const IMAGE_OPT_IN_HEADER = "TypeSafe-Danger-Zone-Images";
const API_BASE_URL = `${HOSTED_ORIGIN}/v1`;
const unsupported = {
	status: "unavailable",
	reason: "unsupported-input"
};
/** Evaluate explicit state without ambient credentials, retries, or vendor diagnostics. */
async function evaluateTypeSafeDecision(batch, assets, context, config) {
	const model = context.model.id;
	const hosted = usesHostedEndpoint(config);
	if (model === "kev-latest" && hosted) return unsupported;
	let parsed;
	let baseUrl;
	try {
		parsed = parseInput({
			state: batch.state.type === "text" ? batch.state.text : batch.state.value,
			questions: encodeSystemOneQuestions(batch),
			model
		});
		baseUrl = config.providerConfig ? providerBaseUrl(context.model.baseUrl ?? config.providerConfig.baseUrl) : config.baseUrl ? `${config.baseUrl}/v1` : API_BASE_URL;
	} catch {
		return unsupported;
	}
	const local = !assets && !hosted;
	const wireInput = local ? encodeTypeSafeLocalInput(parsed) : parsed;
	const body = JSON.stringify({
		...wireInput,
		model,
		...assets ? { assets } : {}
	});
	if (assets && baseUrl !== API_BASE_URL || Buffer.byteLength(body) > (assets ? 33554432 : 4194304)) return unsupported;
	const sendsCredential = (!config.baseUrl || Boolean(config.providerConfig)) && config.providerConfig?.authHeader !== false;
	return evaluateDecisionHttp({
		...context,
		deadlineMonotonicMs: Math.min(context.deadlineMonotonicMs, performance.now() + config.timeoutMs)
	}, {
		provider: "typesafe",
		baseUrl,
		endpointPath: "systemone",
		body,
		requestHeaders: { [IMAGE_OPT_IN_HEADER]: assets ? "true" : null },
		authHeaders: (apiKey) => sendsCredential && apiKey !== "typesafe-local" ? { Authorization: `Bearer ${apiKey}` } : {},
		maxResponseBytes: MAX_JSON_BYTES,
		decode: (payload) => {
			let value = payload;
			if (local) {
				if (!isRecord(value)) throw new Error("Invalid local System One response.");
				if ("latency_ms" in value) {
					const { latency_ms, ...rest } = value;
					if (typeof latency_ms !== "number" || !Number.isFinite(latency_ms) || latency_ms < 0) throw new Error("Invalid local System One latency metadata.");
					value = rest;
				}
			}
			const evaluation = parseResult(value, wireInput);
			if (local) restoreTypeSafeLocalLegends(evaluation, parsed);
			const result = decodeTypeSafeDecisionResult(batch, evaluation);
			return result ? {
				status: "ok",
				result
			} : {
				status: "unavailable",
				reason: "invalid-response"
			};
		}
	});
}
export { evaluateTypeSafeDecision };
