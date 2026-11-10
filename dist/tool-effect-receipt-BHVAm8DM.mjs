import { c as attachInternalToolResultProvenance, g as getInternalToolResultProvenance } from "./internal-hooks-CSjTREUl.mjs";
//#region src/agents/tool-effect-receipt.ts
const NO_START_RECEIPT = Object.freeze({ state: "not_started" });
/** Keep effect proof private while the lifecycle copies or projects the result. */
function markToolExecutionNotStarted(value) {
	if (typeof value === "object" && value !== null) attachInternalToolResultProvenance(value, NO_START_RECEIPT);
	return value;
}
function readToolEffectReceipt(value) {
	return typeof value === "object" && value !== null && getInternalToolResultProvenance(value) === NO_START_RECEIPT ? NO_START_RECEIPT : void 0;
}
function consumeToolExecutionNotStarted(value) {
	if (typeof value !== "object" || value === null || getInternalToolResultProvenance(value) !== NO_START_RECEIPT) return false;
	attachInternalToolResultProvenance(value, void 0);
	return true;
}
/** The protected operation owns its first possible effect, including reservations. */
async function withToolEffectBoundary(execute) {
	let effectsStarted = false;
	const settle = (value) => {
		if (!effectsStarted) return markToolExecutionNotStarted(value);
		consumeToolExecutionNotStarted(value);
		return value;
	};
	try {
		return settle(await execute(() => {
			effectsStarted = true;
		}));
	} catch (error) {
		throw settle(error);
	}
}
/** Resolve the strongest effect fact available at the terminal lifecycle owner. */
function buildToolEffectReceipt(params) {
	if (!params.executionStarted) return { state: "uncertain" };
	if (params.replaySafe) return { state: params.outcome === "success" ? "read_completed" : "failed_no_effect" };
	return { state: params.mutatingAction && params.outcome === "success" ? "mutation_committed" : "uncertain" };
}
//#endregion
export { withToolEffectBoundary as a, readToolEffectReceipt as i, consumeToolExecutionNotStarted as n, markToolExecutionNotStarted as r, buildToolEffectReceipt as t };
