//#region src/plugins/capability-provider.types.ts
/** Provision failed after allocation and the provider could not prove cleanup completed. */
var WorkerProvisionCleanupError = class extends AggregateError {
	constructor(leaseId, provisionError, cleanupError) {
		super([provisionError, cleanupError], "Worker provision failed after allocation and cleanup is indeterminate", { cause: provisionError });
		this.provisionError = provisionError;
		this.cleanupError = cleanupError;
		this.code = "cleanup_indeterminate";
		this.name = "WorkerProvisionCleanupError";
		this.leaseId = leaseId.trim();
		if (!this.leaseId) throw new TypeError("Worker provision cleanup lease id must be non-empty");
	}
};
/** Provision failed after allocation and the provider confirmed cleanup completed. */
var WorkerProvisionCleanupCompleteError = class extends Error {
	constructor(leaseId, provisionError) {
		super(provisionError instanceof Error ? provisionError.message : String(provisionError), { cause: provisionError });
		this.provisionError = provisionError;
		this.code = "cleanup_complete";
		this.name = "WorkerProvisionCleanupCompleteError";
		this.leaseId = leaseId.trim();
		if (!this.leaseId) throw new TypeError("Worker provision cleanup lease id must be non-empty");
	}
};
/** Permanent provider rejection recorded as a terminal worker failure. */
var WorkerProviderError = class extends Error {
	constructor(message) {
		super(message);
		this.code = "invalid_profile";
		this.name = "WorkerProviderError";
	}
	static cleanupComplete(leaseId, provisionError) {
		return new WorkerProvisionCleanupCompleteError(leaseId, provisionError);
	}
	static isCleanupComplete(error) {
		return error instanceof WorkerProvisionCleanupCompleteError;
	}
	static cleanupIndeterminate(leaseId, provisionError, cleanupError) {
		return new WorkerProvisionCleanupError(leaseId, provisionError, cleanupError);
	}
	static isCleanupIndeterminate(error) {
		return error instanceof WorkerProvisionCleanupError;
	}
};
//#endregion
export { WorkerProviderError as t };
