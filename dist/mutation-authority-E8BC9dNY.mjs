//#region src/infra/mutation-authority.ts
/** Keep the first refusal across retries without changing its thrown value. */
function retainMutationAuthority(assertion) {
	let refusal;
	return (...args) => {
		if (refusal) throw refusal.error;
		try {
			const returned = assertion(...args);
			if (returned !== null && (typeof returned === "object" || typeof returned === "function") && typeof returned.then === "function") {
				Promise.resolve(returned).catch(() => void 0);
				throw new TypeError("mutation authority must be synchronous");
			}
		} catch (error) {
			refusal = { error };
			throw error;
		}
	};
}
//#endregion
export { retainMutationAuthority as t };
