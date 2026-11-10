//#region src/gateway/worker-environments/worker-ledger-validation.ts
const REQUEST_HASH_PATTERN = /^[a-f0-9]{64}$/u;
function createWorkerLedgerInputValidation(label) {
	return {
		required: (value, field) => {
			if (typeof value !== "string" || !value.trim()) throw new Error(`${label} ${field} must be a non-empty string`);
			return value.trim();
		},
		integer: (value, field, minimum = 0) => {
			if (typeof value !== "number" || !Number.isSafeInteger(value) || value < minimum) throw new Error(`${label} ${field} must be a ${minimum === 0 ? "non-negative" : "positive"} integer`);
			return value;
		},
		requestHash: (value) => {
			if (typeof value !== "string" || !REQUEST_HASH_PATTERN.test(value)) throw new Error(`${label} request hash must be lowercase SHA-256 hex`);
			return value;
		}
	};
}
//#endregion
export { createWorkerLedgerInputValidation as t };
