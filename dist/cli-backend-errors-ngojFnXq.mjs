//#region src/plugins/cli-backend-errors.ts
/**
* A selected auth profile could not be staged by its CLI backend.
* Backends must not use this for local preparation or transport failures:
* core treats it as evidence that the exact profile should be quarantined.
*/
var CliBackendAuthProfilePreparationError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options?.cause });
		this.name = "CliBackendAuthProfilePreparationError";
	}
};
//#endregion
export { CliBackendAuthProfilePreparationError as t };
