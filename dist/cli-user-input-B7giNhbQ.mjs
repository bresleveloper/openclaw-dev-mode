import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/anthropic/cli-user-input.ts
function createClaudeCliUserInputAuthorizer(context) {
	const requests = /* @__PURE__ */ new Map();
	return { authorize(params) {
		const existing = params.toolUseId ? requests.get(params.toolUseId) : void 0;
		if (existing) return existing;
		const request = runClaudeUserInput(context, params);
		if (params.toolUseId) requests.set(params.toolUseId, request);
		return request;
	} };
}
async function runClaudeUserInput(context, params) {
	const parsed = readClaudeUserInputQuestions(params.input);
	if (!parsed.ok) return {
		behavior: "deny",
		message: `OpenClaw rejected malformed Claude user questions: ${parsed.failure}. Correct the invalid field and retry AskUserQuestion.`
	};
	const questions = parsed.questions;
	const result = await context.requestUserInput({
		toolName: "AskUserQuestion",
		questions,
		intro: "Claude needs input:",
		...params.toolUseId ? { toolCallId: params.toolUseId } : {},
		abortSignal: params.signal
	});
	if (result.status !== "answered") return {
		behavior: "deny",
		message: `${result.message} Continue with your best judgment.`
	};
	const answers = {};
	questions.forEach((question) => {
		answers[question.question] = (result.answers[question.id] ?? []).join(", ");
	});
	return {
		behavior: "allow",
		updatedInput: {
			...params.input,
			answers
		}
	};
}
function readClaudeUserInputQuestions(input) {
	const rawQuestions = input.questions;
	if (!Array.isArray(rawQuestions) || rawQuestions.length < 1 || rawQuestions.length > 4) return {
		ok: false,
		failure: "questions must be an array of 1 to 4 questions"
	};
	const questions = [];
	for (const [index, rawQuestion] of rawQuestions.entries()) {
		const questionPath = `questions[${index}]`;
		if (!isRecord(rawQuestion)) return {
			ok: false,
			failure: `${questionPath} must be an object`
		};
		const question = readBoundedText(rawQuestion.question, 4096);
		if (!question.ok) return {
			ok: false,
			failure: `${questionPath}.question ${question.failure}`
		};
		const header = readBoundedText(rawQuestion.header, 12);
		if (!header.ok) return {
			ok: false,
			failure: `${questionPath}.header ${header.failure}`
		};
		const rawOptions = rawQuestion.options;
		if (!Array.isArray(rawOptions) || rawOptions.length < 2 || rawOptions.length > 4) return {
			ok: false,
			failure: `${questionPath}.options must be an array of 2 to 4 options`
		};
		if (typeof rawQuestion.multiSelect !== "boolean") return {
			ok: false,
			failure: `${questionPath}.multiSelect must be a boolean`
		};
		const options = [];
		for (const [optionIndex, rawOption] of rawOptions.entries()) {
			const optionPath = `${questionPath}.options[${optionIndex}]`;
			if (!isRecord(rawOption)) return {
				ok: false,
				failure: `${optionPath} must be an object`
			};
			const label = readBoundedText(rawOption.label, 256);
			if (!label.ok) return {
				ok: false,
				failure: `${optionPath}.label ${label.failure}`
			};
			const description = readBoundedText(rawOption.description, 1024);
			if (!description.ok) return {
				ok: false,
				failure: `${optionPath}.description ${description.failure}`
			};
			options.push({
				label: label.text,
				description: description.text
			});
		}
		questions.push({
			id: `question_${index + 1}`,
			header: header.text,
			question: question.text,
			multiSelect: rawQuestion.multiSelect,
			isOther: true,
			options
		});
	}
	return {
		ok: true,
		questions
	};
}
function readBoundedText(value, maxLength) {
	if (typeof value !== "string") return {
		ok: false,
		failure: "must be a string"
	};
	if (value.length === 0) return {
		ok: false,
		failure: "must not be empty"
	};
	if (value.length > maxLength) return {
		ok: false,
		failure: `must be at most ${maxLength} characters`
	};
	return {
		ok: true,
		text: value
	};
}
//#endregion
export { createClaudeCliUserInputAuthorizer as t };
