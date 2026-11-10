//#region src/infra/restart-recovery-errors.ts
/** Stale input provenance cannot authorize a resend in the current session. */
var GatewayOperatorRecoveryOwnershipError = class extends Error {
	constructor(message = "Restart recovery operator source no longer owns this input.", options) {
		super(message, options);
		this.name = "GatewayOperatorRecoveryOwnershipError";
	}
};
//#endregion
export { GatewayOperatorRecoveryOwnershipError as t };
