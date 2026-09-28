import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
//#region src/agents/embedded-agent-runner/model-context-tokens.ts
/**
* Reads normalized context-token metadata from resolved model definitions.
*/
/** Returns finite context-token metadata when a model discovery source provided it. */
/** Prefer contextTokens, then contextWindow, when present on model metadata. */
function readAgentModelContextTokens(model) {
	const value = model?.contextTokens;
	return asFiniteNumber(value);
}
//#endregion
export { readAgentModelContextTokens as t };
