import "./src-CdRlGRnW.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
//#region src/agents/tools/computer-tool-outcome.ts
const outcomes = /* @__PURE__ */ new WeakMap();
function recordComputerToolOutcome(result, observed) {
	const observation = observed.observation;
	if (observation?.kind !== "window") return result;
	const { observationId: _observationId, elements, ...state } = observation;
	outcomes.set(result, stableStringify({
		...observed,
		observation: {
			...state,
			elements: elements?.map(({ elementRef: _elementRef, ...element }) => element)
		}
	}));
	return result;
}
function getComputerToolOutcome(result) {
	return outcomes.get(result);
}
//#endregion
export { recordComputerToolOutcome as n, getComputerToolOutcome as t };
