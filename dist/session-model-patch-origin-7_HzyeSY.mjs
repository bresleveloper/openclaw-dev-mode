import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/session-model-patch-origin.ts
const agentSessionModelPatch = new AsyncLocalStorage();
function withAgentSessionModelPatchOrigin(run) {
	return agentSessionModelPatch.run({ kind: "agent" }, run);
}
async function withSessionStatusModelPatchOrigin(run) {
	const origin = {
		kind: "session-status",
		applied: false
	};
	return {
		result: await agentSessionModelPatch.run(origin, run),
		applied: origin.applied
	};
}
function isAgentSessionModelPatchOrigin() {
	return agentSessionModelPatch.getStore()?.kind === "agent";
}
/** Status selections remain per-session and do not establish an automatic fallback. */
function isSessionStatusModelPatchOrigin() {
	return agentSessionModelPatch.getStore()?.kind === "session-status";
}
/** Only the mutation owner records whether the scoped selection committed a change. */
function recordSessionStatusModelPatchOutcome(applied) {
	const origin = agentSessionModelPatch.getStore();
	if (origin?.kind === "session-status") origin.applied ||= applied;
}
//#endregion
export { withSessionStatusModelPatchOrigin as a, withAgentSessionModelPatchOrigin as i, isSessionStatusModelPatchOrigin as n, recordSessionStatusModelPatchOutcome as r, isAgentSessionModelPatchOrigin as t };
