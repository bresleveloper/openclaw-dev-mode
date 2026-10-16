import { n as stylePromptMessage, t as stylePromptHint } from "./prompt-style-zarsDmI2.mjs";
//#region packages/terminal-core/src/prompt-select-styled-params.ts
/** Return select params with styled prompt message and per-option hints. */
function styleSelectParams(params) {
	return {
		...params,
		message: stylePromptMessage(params.message),
		options: params.options.map((opt) => {
			const hint = "hint" in opt && typeof opt.hint === "string" ? opt.hint : void 0;
			return hint === void 0 ? opt : {
				...opt,
				hint: stylePromptHint(hint)
			};
		})
	};
}
//#endregion
export { styleSelectParams as t };
