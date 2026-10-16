import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/async-questions.ts
/** Keep unsupported question payloads on Codex's complete plain-text fallback. */
function readCodexAsyncQuestions(value) {
	if (!Array.isArray(value) || value.length === 0 || value.length > 12) return;
	const questions = [];
	for (const entry of value) {
		const question = asOptionalRecord(entry);
		if (!question || !isQuestionText(question.title, 4096)) return;
		const options = question.options;
		if (options === void 0 || options === null) {
			questions.push({ title: question.title });
			continue;
		}
		if (!Array.isArray(options) || options.length === 0 || options.length > 4 || !options.every((option) => isQuestionText(option, 256))) return;
		questions.push({
			title: question.title,
			options: [...options]
		});
	}
	return questions;
}
function isQuestionText(value, maxLength) {
	return typeof value === "string" && value.length <= maxLength && value.trim().length > 0;
}
//#endregion
export { readCodexAsyncQuestions as t };
