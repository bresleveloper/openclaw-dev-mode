import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
//#region extensions/matrix/src/plugin-entry.runtime.ts
const loadMatrixVerificationRuntime = createLazyRuntimeModule(() => import("./.setup/verification-kMlFYUn0.mjs").then((n) => n.y));
function sendError(respond, err) {
	respond(false, { error: formatErrorMessage(err) });
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
		respond(result.success, result);
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
		respond(result.success, result);
	} catch (err) {
		sendError(respond, err);
	}
}
async function handleVerificationStatus({ params, respond, context }) {
	try {
		const { getMatrixVerificationStatus } = await loadMatrixVerificationRuntime();
		respond(true, await getMatrixVerificationStatus({
			accountId: normalizeOptionalString(params?.accountId),
			includeRecoveryKey: params?.includeRecoveryKey === true,
			cfg: context.getRuntimeConfig()
		}));
	} catch (err) {
		sendError(respond, err);
	}
}
//#endregion
export { handleVerificationBootstrap, handleVerificationStatus, handleVerifyRecoveryKey };
