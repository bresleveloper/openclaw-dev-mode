//#region src/state/openclaw-state-lease-error.ts
const leaseErrorCodes = [
	"OPENCLAW_STATE_LEASE_INVALID_INPUT",
	"OPENCLAW_STATE_LEASE_HELD",
	"OPENCLAW_STATE_LEASE_ABORTED",
	"OPENCLAW_STATE_LEASE_LOST",
	"OPENCLAW_STATE_LEASE_STORAGE_FAILED"
];
function isOpenClawStateLeaseErrorCode(value) {
	return leaseErrorCodes.some((code) => code === value);
}
var OpenClawStateLeaseError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "OpenClawStateLeaseError";
		this.code = options.code;
	}
};
var OpenClawStateLeaseAcquisitionError = class extends OpenClawStateLeaseError {
	constructor(label, outcome, cause) {
		super(outcome.kind === "held" ? `${label} is held by ${outcome.holder.owner} (lease epoch ${outcome.holder.epoch})` : outcome.kind === "aborted" ? `${label} acquisition was aborted after ${outcome.elapsedMs} ms by caller signal` : `failed to acquire ${label}: store unavailable (${outcome.reason})`, {
			code: outcome.kind === "held" ? "OPENCLAW_STATE_LEASE_HELD" : outcome.kind === "aborted" ? "OPENCLAW_STATE_LEASE_ABORTED" : "OPENCLAW_STATE_LEASE_STORAGE_FAILED",
			cause
		});
		this.outcome = outcome;
	}
};
function toOpenClawStateLeaseVerificationError(identity, error) {
	return error instanceof OpenClawStateLeaseError ? error : new OpenClawStateLeaseError(`failed to verify ${identity.leaseLabel ?? "state lease"} ${identity.scope}/${identity.key}`, {
		code: "OPENCLAW_STATE_LEASE_STORAGE_FAILED",
		cause: error
	});
}
function createOpenClawStateLeaseError(code, message, cause) {
	return new OpenClawStateLeaseError(message, {
		code,
		cause
	});
}
function createOpenClawStateLeaseLostError(identity, cause) {
	return createOpenClawStateLeaseError("OPENCLAW_STATE_LEASE_LOST", `${identity.leaseLabel ?? "state lease"} ${identity.scope}/${identity.key} was lost`, cause);
}
function createOpenClawStateLeaseAbortError(signal, label, leaseLabel) {
	return createOpenClawStateLeaseError("OPENCLAW_STATE_LEASE_ABORTED", `${leaseLabel} ${label} was aborted`, signal.reason);
}
//#endregion
export { createOpenClawStateLeaseLostError as a, createOpenClawStateLeaseError as i, OpenClawStateLeaseError as n, isOpenClawStateLeaseErrorCode as o, createOpenClawStateLeaseAbortError as r, toOpenClawStateLeaseVerificationError as s, OpenClawStateLeaseAcquisitionError as t };
