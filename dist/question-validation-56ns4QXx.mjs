import { n as ENV_SECRET_REF_ID_RE } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
//#region src/gateway/question-validation.ts
/** Shape rules after protocol validation; callers retain admission policy and error types. */
function questionShapeError(questions, options) {
	const ids = /* @__PURE__ */ new Set();
	for (const question of questions) {
		if (ids.has(question.questionId)) return `duplicate question id '${question.questionId}'`;
		ids.add(question.questionId);
		if (options.validateUrls && question.url !== void 0) {
			const url = URL.parse(question.url);
			if (!url || !hasHttpUrlPrefix(question.url) || url.username || url.password) return `question '${question.questionId}' requires an absolute HTTP(S) URL without credentials`;
		}
		if (question.options.length === 1) return `question '${question.questionId}' must have either no options or 2 to 4 options`;
		const binding = question.secretStore;
		if (question.isSecret && !binding && !options.allowPlainSecretQuestions) return `question '${question.questionId}': secret questions are not supported yet`;
		if (binding) {
			if (!question.isSecret) return `question '${question.questionId}': secret store binding requires a secret question`;
			if (questions.length !== 1 || question.options.length !== 0 || question.multiSelect) return `question '${question.questionId}': secret store requests require one free-text, single-select question`;
			if (!ENV_SECRET_REF_ID_RE.test(binding.name)) return `question '${question.questionId}': invalid secret store entry name`;
			if (binding.kind !== "secret") return `question '${question.questionId}': masked requests require kind "secret"; set environment values in Settings or the CLI`;
			if ((binding.allowedHosts?.length ?? 0) > 128) return `question '${question.questionId}': secret store allowed hosts exceed the limit`;
		}
		const optionLabels = /* @__PURE__ */ new Set();
		for (const option of question.options) {
			const normalizedLabel = option.label.trim().toLowerCase();
			if (optionLabels.has(normalizedLabel)) return `question '${question.questionId}' has duplicate option label '${option.label}'`;
			optionLabels.add(normalizedLabel);
		}
	}
}
//#endregion
export { questionShapeError as t };
