import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as captureSessionPendingInputWorkerCustody } from "./session-accessor.sqlite-pending-inputs-DtDOOibA.mjs";
//#region src/agents/sessions/session-manager-message-admission.ts
/** Host closures retain authority; worker commands carry only their matching custody facts. */
function captureSessionMessageAdmission(assertCurrent, controls) {
	const pendingInput = captureSessionPendingInputWorkerCustody();
	return {
		control: {
			...pendingInput ? { pendingInput: {
				facts: pendingInput.facts,
				relocation: pendingInput.relocation
			} } : {},
			...controls?.beforeFreshMessageCommit ? { freshMessageCheck: true } : {}
		},
		assertAdmission(request) {
			const facts = request.facts;
			if (!isRecord(facts) || facts.kind !== "session-message") return request;
			assertCurrent();
			if (facts.check === "pending") {
				if (!pendingInput) throw new Error("Session message has no captured pending input owner");
				pendingInput.assertCurrent();
			} else if (facts.check === "fresh") {
				if (!controls?.beforeFreshMessageCommit) throw new Error("Session message has no captured fresh-message assertion");
				controls.beforeFreshMessageCommit();
			} else if (facts.check !== void 0) throw new Error("Session message requested an invalid admission check");
			assertCurrent();
			return {
				...request,
				facts: facts.domainFacts
			};
		},
		publish(receipt) {
			if (receipt) pendingInput?.publish(receipt);
		}
	};
}
//#endregion
export { captureSessionMessageAdmission as t };
