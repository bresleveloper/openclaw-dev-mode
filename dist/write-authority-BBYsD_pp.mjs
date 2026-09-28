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
export { createConfigWriteAuthorityGuard as n, composeConfigWriteAssertions as t };
