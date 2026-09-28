//#region src/config/mutation-conflict.ts
/** Raised when a config write loses an optimistic snapshot race. */
var ConfigMutationConflictError = class extends Error {
	constructor(message, params = {}) {
		super(message);
		this.name = "ConfigMutationConflictError";
		this.retryable = params.retryable ?? true;
	}
};
const GUARDED_CONFIG_INCLUDE_WRITE_ERROR = "This approved operation cannot update include-owned configuration. Use a trusted shell for this change.";
//#endregion
export { GUARDED_CONFIG_INCLUDE_WRITE_ERROR as n, ConfigMutationConflictError as t };
