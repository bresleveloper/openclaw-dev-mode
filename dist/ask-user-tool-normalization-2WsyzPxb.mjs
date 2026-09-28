import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { dl as QuestionOptionSchema, ml as QuestionRequestQuestionSchema } from "./src-BRUl7oDv.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import "./common-XfKigJno.mjs";
import { t as questionShapeError } from "./question-validation-56ns4QXx.mjs";
import { Type } from "typebox";
import { Value } from "typebox/value";
const QUESTION_RPC_GRACE_MS = 1e4;
const MIN_ASK_USER_TIMEOUT_SECONDS = 30;
const MAX_ASK_USER_TIMEOUT_SECONDS = 3600;
/** Validates and canonicalizes model-authored ask_user arguments. */
function normalizeAskUserParams(value) {
	if (!Value.Check(AskUserToolSchema, value)) throw new ToolInputError("ask_user arguments do not match the model-facing question contract");
	const params = value;
	const questions = params.questions.map((question) => ({
		questionId: question.id.trim(),
		header: truncateUtf16Safe(question.header.trim(), 12),
		question: question.question.trim(),
		options: question.options.map((option) => ({
			label: option.label.trim(),
			...option.description?.trim() ? { description: option.description.trim() } : {}
		})),
		...question.multiSelect === true ? { multiSelect: true } : {},
		isOther: true
	}));
	if (!questions.every((question) => Value.Check(QuestionRequestQuestionSchema, question))) throw new ToolInputError("ask_user questions do not match the canonical question contract");
	if (questions.some(({ header, options }) => !header || options.some(({ label }) => label.length > 64))) throw new ToolInputError("ask_user questions exceed the model-facing display contract");
	const semanticError = questionShapeError(questions, {
		allowPlainSecretQuestions: false,
		validateUrls: true
	});
	if (semanticError) throw new ToolInputError(semanticError);
	return {
		questions,
		timeoutSeconds: normalizeQuestionTimeoutSeconds(params.timeoutSeconds)
	};
}
/** Shared human-question wait contract, including credential entry and harness watchdogs. */
function normalizeQuestionTimeoutSeconds(rawTimeoutSeconds) {
	if (rawTimeoutSeconds !== void 0 && (typeof rawTimeoutSeconds !== "number" || !Number.isFinite(rawTimeoutSeconds) || !Number.isInteger(rawTimeoutSeconds))) throw new ToolInputError("timeoutSeconds must be an integer");
	return Math.min(MAX_ASK_USER_TIMEOUT_SECONDS, Math.max(MIN_ASK_USER_TIMEOUT_SECONDS, rawTimeoutSeconds ?? 900));
}
function resolveQuestionTimeoutMs(rawTimeoutSeconds) {
	return normalizeQuestionTimeoutSeconds(rawTimeoutSeconds) * 1e3 + QUESTION_RPC_GRACE_MS;
}
const AskUserQuestionSchema = Type.Object({
	id: {
		...QuestionRequestQuestionSchema.properties.questionId,
		description: "Unique snake_case answer key."
	},
	header: Type.String({
		minLength: 1,
		description: "Short chip label; longer input is truncated to 12 characters."
	}),
	question: {
		...QuestionRequestQuestionSchema.properties.question,
		description: "Single-sentence question only. Put all selectable choices in options."
	},
	options: Type.Array(QuestionOptionSchema, {
		minItems: 2,
		maxItems: 4,
		description: "Every selectable choice. Put the recommended choice first; do not repeat choices only in the question text."
	}),
	multiSelect: Type.Optional({
		...QuestionRequestQuestionSchema.properties.multiSelect,
		description: "True only when the user may choose several options at once."
	})
}, { additionalProperties: false });
const AskUserToolSchema = Type.Object({
	questions: Type.Array(AskUserQuestionSchema, {
		minItems: 1,
		maxItems: 3
	}),
	timeoutSeconds: Type.Optional(Type.Integer({ description: "Maximum human wait in seconds; default 900, clamped 30-3600. Earlier run cancellation or overall run timeout still applies." }))
}, { additionalProperties: false });
//#endregion
export { resolveQuestionTimeoutMs as a, normalizeQuestionTimeoutSeconds as i, QUESTION_RPC_GRACE_MS as n, normalizeAskUserParams as r, AskUserToolSchema as t };
