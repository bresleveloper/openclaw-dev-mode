import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { o as resolveMatrixSqliteStateEnv, r as assertMatrixSupportedStateFile } from "./retired-state-BXUQ2I-C.mjs";
import { o as resolveMatrixStoragePaths, r as recordCurrentStorageMetaDeviceId } from "./storage-D7agewjH.mjs";
import path from "node:path";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { timestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
//#region extensions/matrix/src/matrix/monitor/startup-verification.ts
const STARTUP_VERIFICATION_STATE_FILENAME = "startup-verification.json";
const STARTUP_VERIFICATION_NAMESPACE = "startup-verification";
const STARTUP_VERIFICATION_MAX_ENTRIES = 1e3;
const DEFAULT_STARTUP_VERIFICATION_MODE = "if-unverified";
const DEFAULT_STARTUP_VERIFICATION_COOLDOWN_HOURS = 24;
const DEFAULT_STARTUP_VERIFICATION_FAILURE_COOLDOWN_MS = 36e5;
function normalizeCooldownHours(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_STARTUP_VERIFICATION_COOLDOWN_HOURS;
	return Math.max(0, value);
}
function createStartupVerificationStore(params) {
	return getMatrixRuntime().state.openKeyedStore({
		namespace: STARTUP_VERIFICATION_NAMESPACE,
		maxEntries: STARTUP_VERIFICATION_MAX_ENTRIES,
		env: resolveMatrixSqliteStateEnv(params)
	});
}
function resolveStartupVerificationTimestamp(nowMs) {
	return timestampMsToIsoString(nowMs) ?? timestampMsToIsoString(Date.now()) ?? "1970-01-01T00:00:00.000Z";
}
function resolveStartupVerificationRetryAfterMs(params) {
	if (!params.state || params.stateCooldownMs <= 0) return;
	if (params.state.userId && params.verification.userId && params.state.userId !== params.verification.userId) return;
	if (params.state.deviceId && params.verification.deviceId && params.state.deviceId !== params.verification.deviceId) return;
	const attemptedAtMs = Date.parse(params.state.attemptedAt ?? "");
	if (!Number.isFinite(attemptedAtMs)) return;
	const remaining = attemptedAtMs + params.stateCooldownMs - params.nowMs;
	return remaining > 0 ? remaining : void 0;
}
async function ensureMatrixStartupVerification(params) {
	if (params.auth.encryption !== true || !params.client.crypto) return { kind: "unsupported" };
	const verification = await params.client.getOwnDeviceVerificationStatus();
	let statePath = params.stateFilePath;
	if (statePath == null) {
		const storagePaths = await resolveMatrixStoragePaths({
			...params.auth,
			env: params.env,
			stateDir: params.stateDir
		});
		statePath = path.join(storagePaths.rootDir, STARTUP_VERIFICATION_STATE_FILENAME);
	}
	await assertMatrixSupportedStateFile(statePath);
	const stateLocation = {
		env: params.env,
		stateDir: params.stateDir ?? path.dirname(statePath)
	};
	const stateKey = params.auth.accountId.trim() || "default";
	const mode = params.accountConfig.startupVerification ?? DEFAULT_STARTUP_VERIFICATION_MODE;
	if (verification.verified || mode === "off") {
		await createStartupVerificationStore(stateLocation).delete(stateKey).catch(() => {});
		return {
			kind: verification.verified ? "verified" : "disabled",
			verification
		};
	}
	if ((await params.client.crypto.listVerifications().catch(() => [])).some((entry) => entry.isSelfVerification && !entry.completed && entry.pending)) return {
		kind: "pending",
		verification
	};
	const cooldownMs = normalizeCooldownHours(params.accountConfig.startupVerificationCooldownHours) * 60 * 60 * 1e3;
	const nowMs = params.nowMs ?? Date.now();
	const attemptedAt = resolveStartupVerificationTimestamp(nowMs);
	const value = await createStartupVerificationStore(stateLocation).lookup(stateKey);
	const state = value && typeof value === "object" ? value : null;
	const retryAfterMs = resolveStartupVerificationRetryAfterMs({
		state,
		verification,
		stateCooldownMs: state?.outcome === "failed" ? Math.min(cooldownMs, DEFAULT_STARTUP_VERIFICATION_FAILURE_COOLDOWN_MS) : cooldownMs,
		nowMs
	});
	if (retryAfterMs !== void 0) return {
		kind: "cooldown",
		verification,
		retryAfterMs
	};
	const writeState = async (outcome) => {
		await createStartupVerificationStore(stateLocation).register(stateKey, {
			userId: verification.userId,
			deviceId: verification.deviceId,
			attemptedAt,
			...outcome
		});
		if (typeof verification.deviceId === "string" && verification.deviceId.trim()) await recordCurrentStorageMetaDeviceId({
			rootDir: path.dirname(statePath),
			deviceId: verification.deviceId
		});
	};
	try {
		const request = await params.client.crypto.requestVerification({ ownUser: true });
		await writeState({
			outcome: "requested",
			requestId: request.id,
			transactionId: request.transactionId
		});
		return {
			kind: "requested",
			verification,
			requestId: request.id,
			transactionId: request.transactionId ?? void 0
		};
	} catch (err) {
		const error = formatErrorMessage(err);
		await writeState({
			outcome: "failed",
			error
		}).catch(() => {});
		return {
			kind: "request-failed",
			verification,
			error
		};
	}
}
//#endregion
export { ensureMatrixStartupVerification };
