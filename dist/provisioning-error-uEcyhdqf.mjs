import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { d as isTrustedSecretSurfaceUnavailableError, t as SECRET_DEGRADATION_RETRY_HINT } from "./runtime-degraded-state-DVMYGogL.mjs";
//#region src/agents/sandbox/provisioning-error.ts
const SANDBOX_PROVISIONING_ERROR_CODE = "sandbox_provisioning";
/** A provider has confirmed that this exact runtime can never be resumed. */
var SandboxRuntimeRetiredError = class extends Error {
	constructor(runtimeId) {
		super(`Sandbox runtime "${runtimeId}" has been permanently released.`);
		this.runtimeId = runtimeId;
		this.name = "SandboxRuntimeRetiredError";
	}
};
/** Model-independent sandbox setup failure that must not consume model fallbacks. */
var SandboxProvisioningError = class extends Error {
	constructor(message, params) {
		super(message, { cause: params.cause });
		this.code = SANDBOX_PROVISIONING_ERROR_CODE;
		this.name = "SandboxProvisioningError";
		this.backendId = params.backendId;
	}
};
/** Preserve an existing typed failure or attach sandbox ownership to a backend setup error. */
function toSandboxProvisioningError(error, backendId) {
	if (error instanceof SandboxProvisioningError) return error;
	const detail = formatErrorMessage(error) || `Sandbox backend "${backendId}" provisioning failed.`;
	return new SandboxProvisioningError(isTrustedSecretSurfaceUnavailableError(error) ? `${detail} Fix the referenced secret, run \`${SECRET_DEGRADATION_RETRY_HINT}\`, then retry.` : detail, {
		backendId,
		cause: error
	});
}
/** Recognize the provisioning marker through the shared error-wrapper graph. */
function isSandboxProvisioningError(error) {
	return collectNestedErrorCandidates(error).some((candidate) => {
		try {
			return candidate instanceof SandboxProvisioningError || candidate !== null && typeof candidate === "object" && "name" in candidate && candidate.name === "SandboxProvisioningError" && "code" in candidate && candidate.code === SANDBOX_PROVISIONING_ERROR_CODE;
		} catch {
			return false;
		}
	});
}
//#endregion
export { isSandboxProvisioningError as n, toSandboxProvisioningError as r, SandboxRuntimeRetiredError as t };
