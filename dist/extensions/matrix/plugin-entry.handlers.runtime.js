import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
//#region extensions/matrix/src/plugin-entry.runtime.ts
const loadMatrixVerificationRuntime = createLazyRuntimeModule(() => import("./.setup/verification-0o8MOW9T.mjs").then((n) => n.y));
function sendError(respond, err) {
	respond(false, { error: formatErrorMessage(err) });
}
async function handleVerifyRecoveryKey({ params, respond }) {
	try {
		const { verifyMatrixRecoveryKey } = await loadMatrixVerificationRuntime();
		const key = normalizeOptionalString(params?.key);
		if (!key) {
			respond(false, { error: "key required" });
			return;
		}
		const result = await verifyMatrixRecoveryKey(key, { accountId: normalizeOptionalString(params?.accountId) });
		respond(result.success, result);
	} catch (err) {
		sendError(respond, err);
	}
}
async function handleVerificationBootstrap({ params, respond }) {
	try {
		const { bootstrapMatrixVerification } = await loadMatrixVerificationRuntime();
		const result = await bootstrapMatrixVerification({
			accountId: normalizeOptionalString(params?.accountId),
			recoveryKey: typeof params?.recoveryKey === "string" ? params.recoveryKey : void 0,
			forceResetCrossSigning: params?.forceResetCrossSigning === true
		});
		respond(result.success, result);
	} catch (err) {
		sendError(respond, err);
	}
}
async function handleVerificationStatus({ params, respond }) {
	try {
		const { getMatrixVerificationStatus } = await loadMatrixVerificationRuntime();
		respond(true, await getMatrixVerificationStatus({
			accountId: normalizeOptionalString(params?.accountId),
			includeRecoveryKey: params?.includeRecoveryKey === true
		}));
	} catch (err) {
		sendError(respond, err);
	}
}
//#endregion
export { handleVerificationBootstrap, handleVerificationStatus, handleVerifyRecoveryKey };
