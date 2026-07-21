import { t as styleSelectParams } from "./prompt-select-styled-params-CvMQXWIw.js";
import { select } from "@clack/prompts";
//#region packages/terminal-core/src/prompt-select-styled.ts
/** Run a clack select prompt with styled message and hints. */
function selectStyled(params) {
	return select(styleSelectParams(params));
}
//#endregion
export { selectStyled as t };
