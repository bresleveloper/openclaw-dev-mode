import { v as sameWorkerSessionTurnClaim } from "./placement-record-CB6gcJKw.mjs";
//#region src/gateway/worker-environments/worker-skill-authoring.ts
const active = /* @__PURE__ */ new Map();
/** The launch owner retains the closure; the worker receives no profile or role bearer grant. */
function registerWorkerSkillAuthoring(claim, tool, assertCurrent) {
	const registration = {
		claim,
		tool,
		assertCurrent,
		calls: /* @__PURE__ */ new Map()
	};
	if (active.has(claim.sessionId)) throw new Error("Worker skill authoring already has an active owner.");
	active.set(claim.sessionId, registration);
	return () => {
		if (active.get(claim.sessionId) === registration) active.delete(claim.sessionId);
	};
}
async function invokeWorkerSkillAuthoring(claim, request) {
	const registration = active.get(claim.sessionId);
	if (!registration || !sameWorkerSessionTurnClaim(registration.claim, claim)) throw new Error("Worker skill authoring expired. Send a fresh attributed message.");
	registration.assertCurrent();
	const digest = JSON.stringify(request);
	const previous = registration.calls.get(request.toolCallId);
	if (previous && previous.digest !== digest) throw new Error("Workshop tool call id was reused with different arguments.");
	if (!previous && registration.calls.size >= 64) throw new Error("This turn reached its Workshop operation limit. Continue in a fresh turn.");
	const result = previous?.result ?? registration.tool.execute(request.toolCallId, request.arguments);
	registration.calls.set(request.toolCallId, {
		digest,
		result
	});
	const value = await result;
	registration.assertCurrent();
	return value;
}
//#endregion
export { registerWorkerSkillAuthoring as n, invokeWorkerSkillAuthoring as t };
