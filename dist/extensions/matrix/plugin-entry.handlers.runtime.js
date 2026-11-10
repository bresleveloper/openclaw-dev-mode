import { d as resolveMatrixAuthContext } from "./.setup/client-BEl7PU1_.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/matrix/src/plugin-entry.runtime.ts
const loadMatrixVerificationRuntime = createLazyRuntimeModule(() => import("./.setup/verification-CuT5ZBDO.mjs").then((n) => n.y));
function sendError(respond, err) {
	respond(false, { error: formatErrorMessage(err) });
}
function respondVerification(request, result, success) {
	if (request.params.expectedOwnerId !== void 0) {
		const accountId = resolveMatrixAuthContext({
			cfg: request.context.getRuntimeConfig(),
			accountId: normalizeOptionalString(request.params.accountId)
		}).accountId;
		request.respond(true, {
			result,
			accountId
		});
	} else request.respond(success, result);
}
async function handleVerifyRecoveryKey({ params, respond, context }) {
	try {
		const { verifyMatrixRecoveryKey } = await loadMatrixVerificationRuntime();
		const key = normalizeOptionalString(params?.key);
		if (!key) {
			respond(false, { error: "key required" });
			return;
		}
		const result = await verifyMatrixRecoveryKey(key, {
			accountId: normalizeOptionalString(params?.accountId),
			cfg: context.getRuntimeConfig()
		});
		respondVerification({
			params,
			respond,
			context
		}, result, result.success);
	} catch (err) {
		sendError(respond, err);
	}
}
async function handleVerificationBootstrap({ params, respond, context }) {
	try {
		const { bootstrapMatrixVerification } = await loadMatrixVerificationRuntime();
		const accountId = normalizeOptionalString(params?.accountId);
		const recoveryKey = typeof params?.recoveryKey === "string" ? params.recoveryKey : void 0;
		const forceResetCrossSigning = params?.forceResetCrossSigning === true;
		const result = await bootstrapMatrixVerification({
			accountId,
			cfg: context.getRuntimeConfig(),
			recoveryKey,
			forceResetCrossSigning
		});
		respondVerification({
			params,
			respond,
			context
		}, result, result.success);
	} catch (err) {
		sendError(respond, err);
	}
}
async function handleVerificationStatus({ params, respond, context }) {
	try {
		const { getMatrixVerificationStatus } = await loadMatrixVerificationRuntime();
		const status = await getMatrixVerificationStatus({
			accountId: normalizeOptionalString(params?.accountId),
			includeRecoveryKey: params?.includeRecoveryKey === true,
			...params.allowDegradedLocalState === true ? { readiness: "none" } : {},
			cfg: context.getRuntimeConfig()
		});
		respondVerification({
			params,
			respond,
			context
		}, status, true);
	} catch (err) {
		sendError(respond, err);
	}
}
//#endregion
export { handleVerificationBootstrap, handleVerificationStatus, handleVerifyRecoveryKey };
