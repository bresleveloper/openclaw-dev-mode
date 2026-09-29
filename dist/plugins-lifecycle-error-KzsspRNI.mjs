import { n as OpenClawStateLeaseError, t as OpenClawStateLeaseAcquisitionError } from "./openclaw-state-lease-error-BXipLxiQ.mjs";
import { n as buildCapabilityConsentErrorDetails } from "./capability-consent-error-details-CF5XfV3G.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Fg as isClawHubTrustErrorCode, Pg as buildClawHubTrustErrorDetails } from "./src-BRUl7oDv.mjs";
import { n as readInstallPolicyWarningErrorDetails, t as INSTALL_POLICY_WARNING_ACKNOWLEDGEMENT_REQUIRED } from "./install-policy-warning-error-details-D5Wi7HU5.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { a as projectPluginRuntimeFailure, r as capturePluginRuntimeApplications, t as PluginInstallPersistedError } from "./lifecycle-D58-fLcH.mjs";
//#region src/gateway/server-methods/plugins-lifecycle-error.ts
function captureGatewayPluginRuntimeApplications(applyRuntime, assertCurrent) {
	assertCurrent();
	return capturePluginRuntimeApplications((change) => {
		assertCurrent();
		return applyRuntime({
			...change,
			assertInvokerOwned: () => {
				assertCurrent();
				change.assertInvokerOwned?.();
			}
		});
	});
}
function pluginLifecycleError(caught, { application, entered, signal }) {
	if (!entered && caught instanceof OpenClawStateLeaseAcquisitionError && caught.outcome.kind === "held") return errorShape(ErrorCodes.UNAVAILABLE, "Another plugin or config operation is already running; retry when it completes.", {
		retryable: true,
		retryAfterMs: 1e3
	});
	const error = caught instanceof OpenClawStateLeaseError && caught.code === "OPENCLAW_STATE_LEASE_ABORTED" && signal?.aborted && caught.cause === signal.reason ? signal.reason : caught;
	const failure = projectPluginRuntimeFailure(error, application);
	const cause = error instanceof PluginInstallPersistedError ? error.cause : error;
	const lifecycleError = cause instanceof ManagedPluginLifecycleError ? cause : void 0;
	const installDetails = lifecycleError?.capabilityConsent ? buildCapabilityConsentErrorDetails(lifecycleError.capabilityConsent) : lifecycleError?.installPolicyWarning ? readInstallPolicyWarningErrorDetails({
		installPolicyCode: INSTALL_POLICY_WARNING_ACKNOWLEDGEMENT_REQUIRED,
		...lifecycleError.installPolicyWarning
	}) : lifecycleError ? buildClawHubTrustErrorDetails({
		code: isClawHubTrustErrorCode(lifecycleError.code) ? lifecycleError.code : void 0,
		version: lifecycleError.version,
		warning: lifecycleError.warning
	}) : void 0;
	const refusal = !failure.persistence && lifecycleError?.installRejected ? {
		pluginInstallRejected: true,
		...lifecycleError.code ? { pluginInstallCode: lifecycleError.code } : {},
		...lifecycleError.installSource ? { pluginInstallSource: lifecycleError.installSource } : {}
	} : void 0;
	const details = failure.runtime || failure.persistence || refusal ? {
		...installDetails,
		...refusal,
		...failure.runtime ? { runtime: failure.runtime } : {},
		...failure.persistence ? { persistence: failure.persistence } : {},
		...failure.runtimeAttempt ? { runtimeAttempt: failure.runtimeAttempt } : {}
	} : installDetails;
	return errorShape(lifecycleError?.kind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, failure.message, details ? { details } : void 0);
}
//#endregion
export { pluginLifecycleError as n, captureGatewayPluginRuntimeApplications as t };
