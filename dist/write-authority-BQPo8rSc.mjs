//#region src/config/write-authority.ts
const composedAssertions = /* @__PURE__ */ new WeakMap();
function runAssertion(assertion, checked) {
	const composed = composedAssertions.get(assertion);
	if (composed) {
		composed(checked);
		return;
	}
	if (!checked.has(assertion)) {
		assertion();
		checked.add(assertion);
	}
}
/** Compose live checks in order, sharing identical leaves only within this call. */
function composeConfigWriteAssertions(...assertions) {
	const run = (checked) => {
		for (const assertion of assertions) if (assertion) runAssertion(assertion, checked);
	};
	const assertion = () => run(/* @__PURE__ */ new Set());
	composedAssertions.set(assertion, run);
	return assertion;
}
/** Caller authority can narrow the captured destination, never replace it. */
function mergeConfigWriteOptions(prepared, caller) {
	const merged = {
		...prepared,
		...caller
	};
	const capturedGuard = prepared.assertConfigPathForWrite;
	const callerGuard = caller?.assertConfigPathForWrite;
	if (capturedGuard && callerGuard && capturedGuard !== callerGuard) merged.assertConfigPathForWrite = composeConfigWriteAssertions(capturedGuard, callerGuard);
	else if (capturedGuard) merged.assertConfigPathForWrite = capturedGuard;
	return merged;
}
/** The physical writer retains lock authority after the caller's pre-commit work. */
function bindConfigWriteLockGuard(options, sourceGuard) {
	if (!sourceGuard) return options;
	return {
		...options,
		assertConfigPathForWrite: composeConfigWriteAssertions(sourceGuard, options.assertConfigPathForWrite),
		beforeCommit: async () => {
			await options.beforeCommit?.();
			sourceGuard();
		}
	};
}
/** Keep a refused operation terminal, even when another composition retained this guard. */
function createConfigWriteAuthorityGuard(...assertions) {
	const composed = composeConfigWriteAssertions(...assertions);
	let refusal;
	const run = (checked) => {
		if (refusal) throw refusal.error;
		try {
			runAssertion(composed, checked);
		} catch (error) {
			refusal = { error };
			throw error;
		}
	};
	const guard = () => run(/* @__PURE__ */ new Set());
	composedAssertions.set(guard, run);
	return guard;
}
//#endregion
export { mergeConfigWriteOptions as i, composeConfigWriteAssertions as n, createConfigWriteAuthorityGuard as r, bindConfigWriteLockGuard as t };
