import { t as getMatrixRuntime } from "./runtime-Ck8TjD7L.mjs";
import { r as assertMatrixSupportedStateFile } from "./retired-state-BsxdpJNk.mjs";
import { t as resolveMatrixSqliteStateEnv } from "./sqlite-state-D6Zpz1q1.mjs";
import { o as resolveMatrixStoragePaths, r as recordCurrentStorageMetaDeviceId } from "./storage-CCarF_gm.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import path from "node:path";
import { resolveDateTimestampMs } from "openclaw/plugin-sdk/number-runtime";
// extensions/matrix/src/matrix/monitor/startup-verification.ts
const STARTUP_VERIFICATION_STATE_FILENAME = "startup-verification.json";
const STARTUP_VERIFICATION_NAMESPACE = "startup-verification";
const STARTUP_VERIFICATION_MAX_ENTRIES = 1e3;
const DEFAULT_STARTUP_VERIFICATION_MODE = "if-unverified";
const DEFAULT_STARTUP_VERIFICATION_COOLDOWN_HOURS = 24;
const DEFAULT_STARTUP_VERIFICATION_FAILURE_COOLDOWN_MS = 36e5;
function createStartupVerificationStore(params) {
	return getMatrixRuntime().state.openKeyedStoreV2({
		namespace: STARTUP_VERIFICATION_NAMESPACE,
		maxEntries: STARTUP_VERIFICATION_MAX_ENTRIES,
		env: resolveMatrixSqliteStateEnv(params)
	});
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
			env: params.env
		});
		statePath = path.join(storagePaths.rootDir, STARTUP_VERIFICATION_STATE_FILENAME);
	}
	await assertMatrixSupportedStateFile(statePath);
	const stateLocation = {
		env: params.env,
		stateDir: path.dirname(statePath)
	};
	const stateKey = params.auth.accountId.trim() || "default";
	const mode = params.accountConfig.startupVerification ?? DEFAULT_STARTUP_VERIFICATION_MODE;
	if (verification.verified || mode === "off") {
		await createStartupVerificationStore(stateLocation).delete(stateKey).catch(() => {});
		return { kind: verification.verified ? "verified" : "disabled" };
	}
	if ((await params.client.crypto.listVerifications().catch(() => [])).some((entry) => entry.isSelfVerification && !entry.completed && entry.pending)) return { kind: "pending" };
	const cooldownMs = Math.max(0, params.accountConfig.startupVerificationCooldownHours ?? DEFAULT_STARTUP_VERIFICATION_COOLDOWN_HOURS) * 60 * 60 * 1e3;
	const nowMs = resolveDateTimestampMs(params.nowMs);
	const attemptedAt = new Date(nowMs).toISOString();
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
		return { kind: "requested" };
	} catch (err) {
		const error = formatErrorMessage(err);
		await writeState({
			outcome: "failed",
			error
		}).catch(() => {});
		return {
			kind: "request-failed",
			error
		};
	}
}
export { ensureMatrixStartupVerification };
