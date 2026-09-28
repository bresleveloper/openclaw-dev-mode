import { o as parseExecutionIdentityAdmissionToken } from "./execution-identity-admission-3hhMmAVK.mjs";
import { f as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-BNasoszr.mjs";
//#region src/audit/execution-owner-binding.ts
function isRetainedExecutionOwnerBinding(result) {
	return result === "bound" || result === "already-bound";
}
/** Extracts only an admitted exact identity; operational run correlation cannot bind owner rows. */
function executionOwnerBindingFromAdmission(admitted) {
	if (!admitted.executionIdentityToken) return;
	const token = parseExecutionIdentityAdmissionToken(admitted.executionIdentityToken);
	if (token.runId !== admitted.operationalRunInstance.runId) throw new Error("owner execution binding disagrees with the admitted run");
	return {
		contextId: token.contextId,
		executionId: token.executionId
	};
}
function classifyExecutionOwnerBinding(current, binding) {
	if (current.contextId === null && current.executionId === null) return "unbound";
	return current.contextId === binding.contextId && current.executionId === binding.executionId ? "already-bound" : "mismatch";
}
/** Adds one exact owner write after admission resolves, never inside the admission callback. */
function withPostAdmissionExecutionOwnerBinding(prepared, bind) {
	let binding;
	return Object.freeze({
		...prepared,
		admit: async (runtimeKind, runtimeInstanceId) => {
			const admitted = await prepared.admit(runtimeKind, runtimeInstanceId);
			const assertActive = resolveAdmittedRunActiveAssertion(admitted);
			if (!assertActive) throw new Error("prepared execution authority closed during owner binding");
			binding ??= Promise.resolve().then(() => {
				assertActive();
				return bind(admitted);
			});
			await binding;
			assertActive();
			return admitted;
		}
	});
}
/** Requires both exact admission and actual execution start, in either runtime order. */
function createExecutionStartedOwnerBinding(bind) {
	let admitted;
	let executionStarted = false;
	let binding;
	const bindIfReady = async () => {
		if (!admitted || !executionStarted) return;
		const context = admitted;
		binding ??= Promise.resolve().then(() => bind(context));
		await binding;
	};
	return {
		onPostAdmission: (context) => {
			admitted = context;
			return bindIfReady();
		},
		onExecutionStarted: () => {
			executionStarted = true;
			return bindIfReady();
		}
	};
}
//#endregion
export { withPostAdmissionExecutionOwnerBinding as a, isRetainedExecutionOwnerBinding as i, createExecutionStartedOwnerBinding as n, executionOwnerBindingFromAdmission as r, classifyExecutionOwnerBinding as t };
