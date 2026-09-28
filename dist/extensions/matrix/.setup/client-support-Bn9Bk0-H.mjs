import { t as formatMatrixErrorReason } from "./errors-DKVS3_DO.mjs";
//#region extensions/matrix/src/matrix/sync-state.ts
function isMatrixReadySyncState(state) {
	return state === "PREPARED" || state === "SYNCING" || state === "CATCHUP";
}
function isMatrixDisconnectedSyncState(state) {
	return state === "RECONNECTING" || state === "ERROR" || state === "STOPPED";
}
function isMatrixTerminalSyncState(state) {
	return state === "STOPPED";
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-support.ts
const MATRIX_STATUS_DIAGNOSTIC_TIMEOUT_MS = 1e4;
const DEFAULT_MATRIX_LOCAL_TIMEOUT_MS = 6e4;
function resolveMatrixLocalTimeoutMs(raw) {
	if (typeof raw !== "number" || !Number.isFinite(raw)) return DEFAULT_MATRIX_LOCAL_TIMEOUT_MS;
	return Math.max(1, Math.floor(raw));
}
function unresolvedMatrixRoomKeyBackupStatus() {
	return {
		serverVersion: null,
		activeVersion: null,
		trusted: null,
		matchesDecryptionKey: null,
		decryptionKeyCached: null,
		keyLoadAttempted: false,
		keyLoadError: null
	};
}
function unresolvedMatrixDeviceVerificationStatus(params) {
	return {
		encryptionEnabled: true,
		userId: params.userId,
		deviceId: params.deviceId,
		verified: false,
		localVerified: false,
		crossSigningVerified: false,
		signedByOwner: false
	};
}
async function resolveMatrixDiagnostic(promise, timeoutMs) {
	return (await resolveMatrixDiagnosticResult(promise, timeoutMs)).value;
}
async function resolveMatrixDiagnosticResult(promise, timeoutMs) {
	let timeoutId;
	try {
		const guarded = promise.then((value) => ({
			error: null,
			timedOut: false,
			value
		})).catch((error) => ({
			error,
			timedOut: false,
			value: null
		}));
		const timeout = new Promise((resolve) => {
			timeoutId = setTimeout(() => resolve({
				error: null,
				timedOut: true,
				value: null
			}), timeoutMs);
			timeoutId.unref?.();
		});
		return await Promise.race([guarded, timeout]);
	} finally {
		if (timeoutId) clearTimeout(timeoutId);
	}
}
function isMatrixAccessTokenInvalidatedError(error) {
	if (!error || typeof error !== "object") return false;
	const err = error;
	const errcode = err.body?.errcode ?? err.data?.errcode;
	if (err.statusCode === 401 && errcode === "M_UNKNOWN_TOKEN") return true;
	const reason = formatMatrixErrorReason(error);
	return reason.includes("m_unknown_token") || reason.includes("unknown token") || reason.includes("access token") && (reason.includes("invalid") || reason.includes("unrecognized") || reason.includes("unknown"));
}
const MATRIX_INITIAL_CRYPTO_BOOTSTRAP_OPTIONS = { allowAutomaticCrossSigningReset: false };
const MATRIX_AUTOMATIC_REPAIR_BOOTSTRAP_OPTIONS = {
	forceResetCrossSigning: true,
	allowSecretStorageRecreateWithoutRecoveryKey: true,
	strict: true
};
function createMatrixExplicitBootstrapOptions(params) {
	return {
		forceResetCrossSigning: params?.forceResetCrossSigning === true,
		allowAutomaticCrossSigningReset: params?.allowAutomaticCrossSigningReset !== false,
		allowSecretStorageRecreateWithoutRecoveryKey: true,
		strict: params?.strict !== false
	};
}
//#endregion
export { isMatrixAccessTokenInvalidatedError as a, resolveMatrixLocalTimeoutMs as c, isMatrixDisconnectedSyncState as d, isMatrixReadySyncState as f, createMatrixExplicitBootstrapOptions as i, unresolvedMatrixDeviceVerificationStatus as l, MATRIX_INITIAL_CRYPTO_BOOTSTRAP_OPTIONS as n, resolveMatrixDiagnostic as o, isMatrixTerminalSyncState as p, MATRIX_STATUS_DIAGNOSTIC_TIMEOUT_MS as r, resolveMatrixDiagnosticResult as s, MATRIX_AUTOMATIC_REPAIR_BOOTSTRAP_OPTIONS as t, unresolvedMatrixRoomKeyBackupStatus as u };
