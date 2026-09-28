import { h as normalizeInputProvenance, m as isSubagentCoordinationInputProvenance, p as isProgressCardRefreshInputProvenance } from "./input-provenance-C4tQegGN.mjs";
//#region src/agents/harness/transcript-visibility.ts
/**
* Keep internal messages in the audit/model transcript without
* projecting them into user-facing chat history.
*/
function projectAgentHarnessTranscriptMessageForDisplay(params) {
	const inputProvenance = params.message.role === "user" ? normalizeInputProvenance(Reflect.get(params.message, "provenance")) ?? params.inputProvenance : params.inputProvenance;
	if (!params.hidden && !isSubagentCoordinationInputProvenance(inputProvenance) && !isProgressCardRefreshInputProvenance(inputProvenance)) return params.message;
	if (Reflect.get(params.message, "display") === false) return params.message;
	return Object.assign({}, params.message, { display: false });
}
//#endregion
export { projectAgentHarnessTranscriptMessageForDisplay as t };
