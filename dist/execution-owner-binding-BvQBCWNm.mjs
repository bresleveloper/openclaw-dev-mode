import { _ as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-h1ULFETN.mjs";
//#region src/audit/execution-owner-binding.ts
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
//#endregion
export { withPostAdmissionExecutionOwnerBinding as t };
