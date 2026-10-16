import { d as isRfc8215LocalUseNat64Ipv6Address, l as isLoopbackIpAddress, p as normalizeIpAddress, u as isPrivateOrLoopbackIpAddress$1 } from "./ip-BeZeyE0Z.mjs";
import { a as extractErrorCodeOrErrno } from "./error-coercion-DKQY4wyF.mjs";
import { C as asNullableRecord, D as isRecord, E as asRecord, S as resolveGlobalSingleton, T as asOptionalRecord, g as normalizeLowercaseStringOrEmpty, s as asSafeIntegerInRange, x as resolveGlobalSet, y as normalizeOptionalString } from "./number-coercion-CmpLVzZ6.mjs";
import { O as InvocationFrame, a as StartupMaintenanceRequiredError, h as VERSION, k as getPluginExecutionFrame } from "./sqlite-user-version-C7PVO8Wf.mjs";
import { a as resolveSleepDelayMs, i as raceWithTimeout, n as createAbortError, o as sleepWithAbort, t as RetrySupervisor } from "./src-DTVzOLXp.mjs";
import "./utils-BfTq4rUg.mjs";
import { $ as secretRefKey, A as hasErrnoCode, B as containsEnvVarReference, D as parseJsonWithJson5Fallback, E as resolveConfigIncludes, G as resolveSecretInputRef, H as hasConfiguredSecretInput, M as isMissingPathError, U as normalizeSecretInputString, W as parseSecretRef, ct as redactSensitiveUrlLikeString, et as formatConcreteConfigPath, f as resolveConfigPath, g as resolveIncludeRoots, h as resolveGatewayPort, i as redactToolPayloadText, l as registerSecretValueForRedaction, tt as tokenizeConcreteConfigPath, v as resolveStateDir, y as isVitestRuntimeEnv } from "./redact-TLu2QTmL.mjs";
import { _ as getConfigResolutionFacts, b as setConfigResolutionFacts, c as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, g as getAuthoredConfigSecretRef, h as copyConfigResolutionFactsExcept, m as cloneConfigWithResolutionFacts, n as runOpenClawStateWriteTransaction, p as resolveConfigForRead, t as openOpenClawStateDatabase, v as hasUnresolvedConfigPath, y as resolveConfigSecretRef } from "./openclaw-state-db-Bj56_1ny.mjs";
import { a as describeSecretResolutionOperatorRecovery, i as describeSecretResolutionOperatorDiagnostic, o as isSecretResolutionError, r as resolveSecretRefValues } from "./resolve-CtfCNCm7.mjs";
import { a as normalizeTrimmedStringList, n as normalizeOptionalTrimmedStringList } from "./string-normalization-C9v1UMOm.mjs";
import { a as resolveOpenClawStateDirForDatabasePath, s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D1QtF7Ci.mjs";
import { a as READ_SCOPE, i as QUESTIONS_SCOPE, n as APPROVALS_SCOPE, o as TALK_SECRETS_SCOPE, r as PAIRING_SCOPE, s as WRITE_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-C844xNSs.mjs";
import { a as resolvePreauthHandshakeTimeoutMs, i as resolveFiniteTimeoutDelayMs, n as clearGatewayConnectTimeout, o as resolveSafeTimeoutDelayMs, r as resolveConnectChallengeTimeoutMs, s as startGatewayConnectTimeout, t as DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS } from "./timeouts-B9zvH0xD.mjs";
import { L as executeSqliteQuerySync, R as executeSqliteQueryTakeFirstSync, z as getNodeSqliteKysely } from "./openclaw-state-db-schema-migration-required-DtltEO1E.mjs";
import "./crypto-digest-DFe1GlHl.mjs";
import "./host-env-security-Dgi-NhWK.mjs";
import { t as SUBAGENT_EXEC_ENV_VAR } from "./openclaw-exec-env-_vbUXwNA.mjs";
import { T as createSqliteWorkerOperationAdmission } from "./openclaw-state-db-cache-BjVpQwyn.mjs";
import "./executable-path-CMoZf-QM.mjs";
import { r as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DJL0WCzh.mjs";
import { n as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DzNKG4ET.mjs";
import { a as signEd25519Payload, i as publicKeyRawBase64UrlFromEd25519Pem, n as deriveCanonicalEd25519PublicKeyRaw, t as deriveCanonicalEd25519PrivateKeyRaw } from "./ed25519-signature-Bu4nRTMI.mjs";
import { a as parseGatewayIpAddress, i as normalizeTlsFingerprint, n as isGatewayClientStoppedError, o as parseHostForAddressChecks, r as normalizeGatewayErrorText, s as requireTlsFingerprint, t as formatGatewayClientErrorForLog } from "./client-address-utils-BVGbcfpU.mjs";
import { n as logError, t as logDebug } from "./logger-CzdVvCtS.mjs";
import { c as loadManagedProxyTlsOptionsSync, l as resolveManagedProxyCaFileForUrl, t as forceResetGlobalDispatcher, u as getActiveManagedProxyLoopbackMode } from "./undici-global-dispatcher-DF3TG_Cy.mjs";
import { createRequire } from "node:module";
import fsSync from "node:fs";
import path from "node:path";
import "node:os";
import crypto, { createHash, randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import "kysely";
import { Buffer as Buffer$1 } from "node:buffer";
import net, { isIP } from "node:net";
import { TLSSocket, checkServerIdentity } from "node:tls";
import "typebox/guard";
import { Compile } from "typebox/schema";
import { Type } from "typebox";
//#region packages/gateway-client/src/event-loop-ready.ts
const DEFAULT_MAX_WAIT_MS = 1e4;
const DEFAULT_INTERVAL_MS = 1;
const DEFAULT_DRIFT_THRESHOLD_MS = 200;
const DEFAULT_CONSECUTIVE_READY_CHECKS = 2;
function resolvePositiveInteger(value, fallback) {
	return Number.isFinite(value) && value !== void 0 ? Math.max(1, Math.floor(value)) : fallback;
}
/** Waits until timer drift stays low for consecutive checks, or aborts/times out. */
async function waitForEventLoopReady(options = {}) {
	const maxWaitMs = resolveFiniteTimeoutDelayMs(options.maxWaitMs, DEFAULT_MAX_WAIT_MS, { minMs: 0 });
	const intervalMs = resolveFiniteTimeoutDelayMs(options.intervalMs, DEFAULT_INTERVAL_MS);
	const driftThresholdMs = resolvePositiveInteger(options.driftThresholdMs, DEFAULT_DRIFT_THRESHOLD_MS);
	const consecutiveReadyChecks = resolvePositiveInteger(options.consecutiveReadyChecks, DEFAULT_CONSECUTIVE_READY_CHECKS);
	const signal = options.signal;
	const startedAt = Date.now();
	let readyChecks = 0;
	let checks = 0;
	let maxDriftMs = 0;
	return await new Promise((resolve) => {
		let settled = false;
		let timer = null;
		const finish = (ready, aborted = false) => {
			if (settled) return;
			settled = true;
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			signal?.removeEventListener("abort", onAbort);
			resolve({
				ready,
				elapsedMs: Math.max(0, Date.now() - startedAt),
				maxDriftMs,
				checks,
				aborted
			});
		};
		const onAbort = () => {
			finish(false, true);
		};
		if (signal?.aborted) {
			finish(false, true);
			return;
		}
		signal?.addEventListener("abort", onAbort, { once: true });
		const scheduleNext = () => {
			if (signal?.aborted) {
				finish(false, true);
				return;
			}
			const elapsedMs = Math.max(0, Date.now() - startedAt);
			const remainingMs = maxWaitMs - elapsedMs;
			if (remainingMs <= 0) {
				finish(false);
				return;
			}
			const delayMs = Math.min(intervalMs, remainingMs);
			const scheduledAt = Date.now();
			timer = setTimeout(() => {
				timer = null;
				checks += 1;
				const driftMs = Math.max(0, Date.now() - scheduledAt - delayMs);
				maxDriftMs = Math.max(maxDriftMs, driftMs);
				if (driftMs > driftThresholdMs) readyChecks = 0;
				else readyChecks += 1;
				if (readyChecks >= consecutiveReadyChecks) {
					finish(true);
					return;
				}
				scheduleNext();
			}, delayMs);
		};
		scheduleNext();
	});
}
//#endregion
//#region packages/gateway-client/src/readiness.ts
function resolveGatewayClientStartReadinessTimeoutMs(options = {}) {
	if (typeof options.timeoutMs === "number" && Number.isFinite(options.timeoutMs)) return options.timeoutMs;
	const clientOptions = options.clientOptions ?? {};
	return resolveConnectChallengeTimeoutMs(clientOptions.connectChallengeTimeoutMs, {
		env: clientOptions.env,
		configuredTimeoutMs: clientOptions.preauthHandshakeTimeoutMs
	});
}
/** Starts a gateway client only after the supplied readiness probe succeeds. */
async function startGatewayClientWithReadinessWait(waitForReady, client, options = {}) {
	const readiness = await waitForReady({
		maxWaitMs: resolveGatewayClientStartReadinessTimeoutMs(options),
		signal: options.signal
	});
	if (readiness.ready && !readiness.aborted && options.signal?.aborted !== true) client.start();
	return readiness;
}
/** Starts a gateway client after the default event-loop readiness probe succeeds. */
async function startGatewayClientWhenEventLoopReady(client, options = {}) {
	return startGatewayClientWithReadinessWait(waitForEventLoopReady, client, options);
}
//#endregion
//#region packages/gateway-protocol/src/client-info.ts
/** Canonical client ids accepted in gateway hello/connect payloads. */
const GATEWAY_CLIENT_IDS = {
	WEBCHAT_UI: "webchat-ui",
	CONTROL_UI: "openclaw-control-ui",
	BROWSER_COPILOT: "openclaw-browser-copilot",
	TUI: "openclaw-tui",
	WEBCHAT: "webchat",
	CLI: "cli",
	GATEWAY_CLIENT: "gateway-client",
	MACOS_APP: "openclaw-macos",
	LINUX_APP: "openclaw-linux",
	IOS_APP: "openclaw-ios",
	WATCHOS_APP: "openclaw-watchos",
	ANDROID_APP: "openclaw-android",
	NODE_HOST: "node-host",
	WORKER: "openclaw-worker",
	TEST: "test",
	FINGERPRINT: "fingerprint",
	PROBE: "openclaw-probe"
};
const GATEWAY_CLIENT_NAMES = GATEWAY_CLIENT_IDS;
/** Coarse modes let policy group clients without matching every product id. */
const GATEWAY_CLIENT_MODES = {
	WEBCHAT: "webchat",
	CLI: "cli",
	UI: "ui",
	BACKEND: "backend",
	NODE: "node",
	WORKER: "worker",
	PROBE: "probe",
	TEST: "test"
};
new Set(Object.values(GATEWAY_CLIENT_IDS));
new Set(Object.values(GATEWAY_CLIENT_MODES));
//#endregion
//#region packages/gateway-protocol/src/protocol-value-normalization.ts
/** Checks string presence without changing wire-significant whitespace. */
function isNonEmptyProtocolString(value) {
	return typeof value === "string" && value.length > 0;
}
//#endregion
//#region packages/gateway-protocol/src/connect-error-details.ts
/**
* Shared gateway connect-error detail helpers.
*
* These details cross client/server boundaries, so readers normalize untrusted
* payloads before using them in reconnect decisions or user-facing messages.
*/
/** Structured connect-error codes carried in gateway error `details.code`. */
const ConnectErrorDetailCodes = {
	AUTH_REQUIRED: "AUTH_REQUIRED",
	AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
	AUTH_TOKEN_MISSING: "AUTH_TOKEN_MISSING",
	AUTH_TOKEN_MISMATCH: "AUTH_TOKEN_MISMATCH",
	AUTH_TOKEN_NOT_CONFIGURED: "AUTH_TOKEN_NOT_CONFIGURED",
	AUTH_PASSWORD_MISSING: "AUTH_PASSWORD_MISSING",
	AUTH_PASSWORD_MISMATCH: "AUTH_PASSWORD_MISMATCH",
	AUTH_PASSWORD_NOT_CONFIGURED: "AUTH_PASSWORD_NOT_CONFIGURED",
	AUTH_BOOTSTRAP_TOKEN_INVALID: "AUTH_BOOTSTRAP_TOKEN_INVALID",
	AUTH_DEVICE_TOKEN_MISMATCH: "AUTH_DEVICE_TOKEN_MISMATCH",
	AUTH_SCOPE_MISMATCH: "AUTH_SCOPE_MISMATCH",
	AUTH_RATE_LIMITED: "AUTH_RATE_LIMITED",
	AUTH_TAILSCALE_IDENTITY_MISSING: "AUTH_TAILSCALE_IDENTITY_MISSING",
	AUTH_TAILSCALE_PROXY_MISSING: "AUTH_TAILSCALE_PROXY_MISSING",
	AUTH_TAILSCALE_WHOIS_FAILED: "AUTH_TAILSCALE_WHOIS_FAILED",
	AUTH_TAILSCALE_IDENTITY_MISMATCH: "AUTH_TAILSCALE_IDENTITY_MISMATCH",
	AUTH_IDENTITY_HEADER_REQUIRED: "AUTH_IDENTITY_HEADER_REQUIRED",
	AUTH_VERIFIED_USER_REQUIRED: "AUTH_VERIFIED_USER_REQUIRED",
	AUTHENTICATED_PROFILE_UNAVAILABLE: "AUTHENTICATED_PROFILE_UNAVAILABLE",
	OPERATOR_ACCESS_DENIED: "OPERATOR_ACCESS_DENIED",
	CONTROL_UI_BUILD_MISMATCH: "CONTROL_UI_BUILD_MISMATCH",
	CONTROL_UI_ORIGIN_NOT_ALLOWED: "CONTROL_UI_ORIGIN_NOT_ALLOWED",
	PROTOCOL_MISMATCH: "PROTOCOL_MISMATCH",
	CONTROL_UI_DEVICE_IDENTITY_REQUIRED: "CONTROL_UI_DEVICE_IDENTITY_REQUIRED",
	DEVICE_IDENTITY_REQUIRED: "DEVICE_IDENTITY_REQUIRED",
	DEVICE_AUTH_INVALID: "DEVICE_AUTH_INVALID",
	DEVICE_AUTH_DEVICE_ID_MISMATCH: "DEVICE_AUTH_DEVICE_ID_MISMATCH",
	DEVICE_AUTH_SIGNATURE_EXPIRED: "DEVICE_AUTH_SIGNATURE_EXPIRED",
	DEVICE_AUTH_NONCE_REQUIRED: "DEVICE_AUTH_NONCE_REQUIRED",
	DEVICE_AUTH_NONCE_MISMATCH: "DEVICE_AUTH_NONCE_MISMATCH",
	DEVICE_AUTH_SIGNATURE_INVALID: "DEVICE_AUTH_SIGNATURE_INVALID",
	DEVICE_AUTH_PUBLIC_KEY_INVALID: "DEVICE_AUTH_PUBLIC_KEY_INVALID",
	PAIRING_REQUIRED: "PAIRING_REQUIRED",
	CLIENT_VERSION_MISMATCH: "CLIENT_VERSION_MISMATCH"
};
/** Suggested client-side recovery action for structured connect errors. */
const CONNECT_RECOVERY_NEXT_STEP_VALUES = [
	"retry_with_device_token",
	"update_auth_configuration",
	"update_auth_credentials",
	"wait_then_retry",
	"review_auth_configuration"
];
const PAIRING_CONNECT_REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const PAIRING_CONNECT_REASON_METADATA = {
	"not-paired": {
		message: "device pairing required",
		requirement: "device is not approved yet",
		remediationHint: "Approve this device from the pending pairing requests.",
		recoveryTitle: "Gateway pairing approval required."
	},
	"role-upgrade": {
		message: "role upgrade pending approval",
		requirement: "device is asking for a higher role than currently approved",
		remediationHint: "Review the requested role upgrade, then approve the pending request.",
		recoveryTitle: "Gateway role upgrade approval required."
	},
	"scope-upgrade": {
		message: "scope upgrade pending approval",
		requirement: "device is asking for more scopes than currently approved",
		remediationHint: "Review the requested scopes, then approve the pending upgrade.",
		recoveryTitle: "Gateway scope upgrade approval required."
	},
	"metadata-upgrade": {
		message: "device metadata change pending approval",
		requirement: "device identity changed and must be re-approved",
		remediationHint: "Review the refreshed device details, then approve the pending request.",
		recoveryTitle: "Gateway device refresh approval required."
	}
};
ConnectErrorDetailCodes.AUTH_TOKEN_MISSING, ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH, ConnectErrorDetailCodes.AUTH_TOKEN_NOT_CONFIGURED, ConnectErrorDetailCodes.AUTH_PASSWORD_MISSING, ConnectErrorDetailCodes.AUTH_PASSWORD_MISMATCH, ConnectErrorDetailCodes.AUTH_PASSWORD_NOT_CONFIGURED, ConnectErrorDetailCodes.AUTH_BOOTSTRAP_TOKEN_INVALID, ConnectErrorDetailCodes.AUTH_TAILSCALE_IDENTITY_MISSING, ConnectErrorDetailCodes.AUTH_TAILSCALE_PROXY_MISSING, ConnectErrorDetailCodes.AUTH_TAILSCALE_WHOIS_FAILED, ConnectErrorDetailCodes.AUTH_TAILSCALE_IDENTITY_MISMATCH, ConnectErrorDetailCodes.AUTH_RATE_LIMITED, ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH, ConnectErrorDetailCodes.AUTH_SCOPE_MISMATCH, ConnectErrorDetailCodes.AUTH_REQUIRED;
ConnectErrorDetailCodes.DEVICE_AUTH_DEVICE_ID_MISMATCH, ConnectErrorDetailCodes.DEVICE_AUTH_SIGNATURE_EXPIRED, ConnectErrorDetailCodes.DEVICE_AUTH_NONCE_REQUIRED, ConnectErrorDetailCodes.DEVICE_AUTH_NONCE_MISMATCH, ConnectErrorDetailCodes.DEVICE_AUTH_SIGNATURE_INVALID, ConnectErrorDetailCodes.DEVICE_AUTH_PUBLIC_KEY_INVALID;
/** Reads a non-empty detail code from an untrusted error details payload. */
function readConnectErrorDetailCode(details) {
	if (!isRecord(details)) return null;
	return normalizeOptionalString(details.code) ?? null;
}
/** Extracts normalized retry advice from untrusted connect-error details. */
function readConnectErrorRecoveryAdvice(details) {
	if (!isRecord(details)) return {};
	return {
		canRetryWithDeviceToken: typeof details.canRetryWithDeviceToken === "boolean" ? details.canRetryWithDeviceToken : void 0,
		recommendedNextStep: normalizeConnectRecoveryNextStep(details.recommendedNextStep)
	};
}
function normalizeConnectRecoveryNextStep(value) {
	const normalized = normalizeOptionalString(value) ?? "";
	return CONNECT_RECOVERY_NEXT_STEP_VALUES.find((candidate) => candidate === normalized);
}
function normalizePairingConnectReason(value) {
	const normalized = normalizeOptionalString(value) ?? "";
	return Object.hasOwn(PAIRING_CONNECT_REASON_METADATA, normalized) ? normalized : void 0;
}
/** Normalizes pairing request ids before echoing them in close reasons or UI text. */
function normalizePairingConnectRequestId(value) {
	const normalized = normalizeOptionalString(value);
	return normalized && PAIRING_CONNECT_REQUEST_ID_PATTERN.test(normalized) ? normalized : void 0;
}
function createPairingConnectErrorDetails(params) {
	return {
		code: ConnectErrorDetailCodes.PAIRING_REQUIRED,
		...params.reason ? { reason: params.reason } : {},
		...params.requestId ? { requestId: params.requestId } : {},
		...params.remediationHint ? { remediationHint: params.remediationHint } : {},
		...params.recommendedNextStep ? { recommendedNextStep: params.recommendedNextStep } : {},
		...params.retryable !== void 0 ? { retryable: params.retryable } : {},
		...params.pauseReconnect !== void 0 ? { pauseReconnect: params.pauseReconnect } : {},
		...params.deviceId ? { deviceId: params.deviceId } : {},
		...params.requestedRole ? { requestedRole: params.requestedRole } : {},
		...params.requestedScopes ? { requestedScopes: params.requestedScopes } : {},
		...params.approvedRoles ? { approvedRoles: params.approvedRoles } : {},
		...params.approvedScopes ? { approvedScopes: params.approvedScopes } : {}
	};
}
function normalizePairingConnectMetadata(details, reason) {
	return {
		requestId: normalizePairingConnectRequestId(details.requestId),
		remediationHint: normalizeOptionalString(details.remediationHint) ?? (reason ? PAIRING_CONNECT_REASON_METADATA[reason].remediationHint : "Approve the pending device request before retrying."),
		deviceId: normalizeOptionalString(details.deviceId),
		requestedRole: normalizeOptionalString(details.requestedRole),
		requestedScopes: normalizeOptionalTrimmedStringList(details.requestedScopes),
		approvedRoles: normalizeOptionalTrimmedStringList(details.approvedRoles),
		approvedScopes: normalizeOptionalTrimmedStringList(details.approvedScopes)
	};
}
/** Reads and backfills pairing-required details from an untrusted details object. */
function readPairingConnectErrorDetails(details) {
	if (readConnectErrorDetailCode(details) !== ConnectErrorDetailCodes.PAIRING_REQUIRED) return null;
	if (!isRecord(details)) return null;
	const reason = normalizePairingConnectReason(details.reason);
	return createPairingConnectErrorDetails({
		...normalizePairingConnectMetadata(details, reason),
		reason,
		recommendedNextStep: normalizeConnectRecoveryNextStep(details.recommendedNextStep),
		retryable: typeof details.retryable === "boolean" ? details.retryable : void 0,
		pauseReconnect: typeof details.pauseReconnect === "boolean" ? details.pauseReconnect : void 0
	});
}
/** Formats pairing-required details into the canonical user-facing message. */
function formatConnectPairingRequiredMessage(details) {
	const pairing = readPairingConnectErrorDetails(details);
	const base = PAIRING_CONNECT_REASON_METADATA[pairing?.reason ?? "not-paired"].message;
	return pairing?.requestId ? `${base} (requestId: ${pairing.requestId})` : base;
}
/** Formats connect errors using structured details before falling back to raw messages. */
function formatConnectErrorMessage(params) {
	if (readConnectErrorDetailCode(params.details) === ConnectErrorDetailCodes.PAIRING_REQUIRED) return formatConnectPairingRequiredMessage(params.details);
	if (readConnectErrorDetailCode(params.details) === ConnectErrorDetailCodes.PROTOCOL_MISMATCH) return formatProtocolMismatchMessage(params.message, params.details);
	return normalizeOptionalString(params.message) ?? "gateway request failed";
}
function formatProtocolMismatchMessage(message, details) {
	const raw = details;
	const clientMin = normalizeProtocolNumber(raw.clientMinProtocol);
	const clientMax = normalizeProtocolNumber(raw.clientMaxProtocol);
	const expected = normalizeProtocolNumber(raw.expectedProtocol);
	const probeMin = normalizeProtocolNumber(raw.minimumProbeProtocol);
	const parts = [];
	if (clientMin !== void 0 && clientMax !== void 0) parts.push(clientMin === clientMax ? `Control UI v${clientMin}` : `Control UI v${clientMin}-v${clientMax}`);
	if (expected !== void 0) parts.push(`Gateway v${expected}`);
	if (probeMin !== void 0) parts.push(`probe min v${probeMin}`);
	const normalized = normalizeOptionalString(message) ?? "protocol mismatch";
	return parts.length > 0 ? `${normalized}: ${parts.join(", ")}` : normalized;
}
function normalizeProtocolNumber(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
//#endregion
//#region packages/gateway-protocol/src/gateway-error-details.ts
/** Stable discriminants for structured method-level failures. */
const GatewayErrorDetailCodes = {
	CRON_JOB_NOT_FOUND: "CRON_JOB_NOT_FOUND",
	MISSING_SCOPE: "MISSING_SCOPE",
	MCP_APP_VIEW_EXPIRED: "MCP_APP_VIEW_EXPIRED",
	OUTBOUND_DELIVERY_QUEUED: "OUTBOUND_DELIVERY_QUEUED",
	USER_PREFS_LIMIT_EXCEEDED: "USER_PREFS_LIMIT_EXCEEDED",
	SESSION_COMPANION_BUSY: "SESSION_COMPANION_BUSY",
	SKILL_PROPOSAL_REVISION_CHANGED: "SKILL_PROPOSAL_REVISION_CHANGED",
	PROJECT_CLONE_FAILED: "PROJECT_CLONE_FAILED",
	UNKNOWN_AGENT_ID: "UNKNOWN_AGENT_ID",
	WIZARD_NOT_FOUND: "WIZARD_NOT_FOUND",
	SETUP_ADMISSION_BUSY: "SETUP_ADMISSION_BUSY",
	GITHUB_PUBLICATION_SELECTION_REJECTED: "GITHUB_PUBLICATION_SELECTION_REJECTED",
	SESSION_WORKSPACE_RECOVERY_REQUIRED: "SESSION_WORKSPACE_RECOVERY_REQUIRED",
	TASK_WORKTREE_SOURCE_REQUIRED: "TASK_WORKTREE_SOURCE_REQUIRED",
	TASK_HISTORY_PREVIEW_CAPACITY: "TASK_HISTORY_PREVIEW_CAPACITY"
};
/** Reads validated missing-scope details from an untrusted protocol payload. */
function readMissingScopeErrorDetails(details) {
	const record = asNullableRecord(details);
	if (record?.code !== GatewayErrorDetailCodes.MISSING_SCOPE) return null;
	const missingScope = typeof record.missingScope === "string" ? record.missingScope.trim() : "";
	const requiredScopes = Array.isArray(record.requiredScopes) ? record.requiredScopes.map((scope) => typeof scope === "string" ? scope.trim() : "") : [];
	if (!missingScope || requiredScopes.length === 0 || requiredScopes.some((scope) => !scope)) return null;
	return {
		code: GatewayErrorDetailCodes.MISSING_SCOPE,
		missingScope,
		requiredScopes
	};
}
//#endregion
//#region src/config/gateway-dispatch-config.ts
const GATEWAY_DISPATCH_SHELL_ENV_EXPECTED_KEYS = ["OPENCLAW_GATEWAY_TOKEN", "OPENCLAW_GATEWAY_PASSWORD"];
const GATEWAY_DISPATCH_TOP_LEVEL_KEYS = [
	"agents",
	"env",
	"gateway",
	"plugins",
	"secrets",
	"session"
];
function resolveGatewayDispatchConfig(value, env) {
	if (!isRecord(value)) return {};
	const projected = {};
	for (const key of GATEWAY_DISPATCH_TOP_LEVEL_KEYS) if (Object.hasOwn(value, key)) projected[key] = value[key];
	const { resolvedConfigRaw, resolutionFacts } = resolveConfigForRead(projected, env);
	const config = resolvedConfigRaw;
	if (config.session?.mainKey !== void 0) config.session.mainKey = "main";
	setConfigResolutionFacts(config, resolutionFacts);
	return config;
}
function readRawGatewayDispatchConfig(options = {}) {
	const env = options.env ?? process.env;
	const configPath = options.configPath ?? resolveConfigPath(env);
	if (!fsSync.existsSync(configPath)) return {
		config: {},
		configPath
	};
	const raw = fsSync.readFileSync(configPath, "utf-8");
	const parsed = parseJsonWithJson5Fallback(raw);
	return {
		config: resolveGatewayDispatchConfig(resolveConfigIncludes(parsed, configPath, void 0, { allowedRoots: resolveIncludeRoots(env) }), env),
		configPath
	};
}
function readGatewayDispatchConfig(options = {}) {
	return readRawGatewayDispatchConfig(options).config;
}
async function readGatewayDispatchConfigWithShellEnvFallback(options = {}) {
	const env = options.env ?? process.env;
	const firstRead = readRawGatewayDispatchConfig(options);
	const { loadShellEnvFallback, resolveShellEnvFallbackTimeoutMs, shouldDeferShellEnvFallback, shouldEnableShellEnvFallback } = await import("./shell-env-KgCwsE-L.mjs");
	if ((shouldEnableShellEnvFallback(env) || firstRead.config.env?.shellEnv?.enabled === true) && !shouldDeferShellEnvFallback(env)) {
		const { applied } = loadShellEnvFallback({
			enabled: true,
			env,
			expectedKeys: [...GATEWAY_DISPATCH_SHELL_ENV_EXPECTED_KEYS],
			logger: options.logger ?? console,
			timeoutMs: firstRead.config.env?.shellEnv?.timeoutMs ?? resolveShellEnvFallbackTimeoutMs(env)
		});
		if (applied.length > 0) return readGatewayDispatchConfig({
			...options,
			configPath: path.resolve(firstRead.configPath)
		});
	}
	return firstRead.config;
}
resolveGlobalSet(Symbol.for("openclaw.sessionRowChanges"), "close-and-restart");
resolveGlobalSet(Symbol.for("openclaw.sessionRowFactChanges"), "close-and-restart");
resolveGlobalSet(Symbol.for("openclaw.sessionRowProjectionChanges"), "close-and-restart");
new AsyncLocalStorage();
//#endregion
//#region src/config/runtime-snapshot.ts
let runtimeConfigSnapshot = null;
function getRuntimeConfigSnapshot(options) {
	if (options?.capture && runtimeConfigSnapshot);
	return runtimeConfigSnapshot;
}
//#endregion
//#region src/shared/operator-scope-compat.ts
const OPERATOR_ROLE = "operator";
const OPERATOR_ADMIN_SCOPE = "operator.admin";
const OPERATOR_READ_SCOPE = "operator.read";
const OPERATOR_TALK_SCOPE = "operator.talk";
const OPERATOR_WRITE_SCOPE = "operator.write";
const OPERATOR_SESSION_READ_SCOPE = "operator.sessions.read";
const OPERATOR_SESSION_WRITE_SCOPE = "operator.sessions.write";
const OPERATOR_SCOPE_PREFIX = "operator.";
function operatorScopeSatisfied(requestedScope, granted) {
	if (!requestedScope.startsWith(OPERATOR_SCOPE_PREFIX)) return false;
	return granted.includes(requestedScope) || granted.includes(OPERATOR_ADMIN_SCOPE) || (requestedScope === OPERATOR_READ_SCOPE || requestedScope === OPERATOR_TALK_SCOPE || requestedScope === OPERATOR_SESSION_READ_SCOPE || requestedScope === OPERATOR_SESSION_WRITE_SCOPE) && granted.includes(OPERATOR_WRITE_SCOPE) || requestedScope === OPERATOR_SESSION_READ_SCOPE && (granted.includes(OPERATOR_READ_SCOPE) || granted.includes(OPERATOR_SESSION_WRITE_SCOPE));
}
/** Returns true when a role grant satisfies requested scopes, including operator implications. */
function roleScopesAllow(params) {
	return resolveMissingRequestedScope(params) === null;
}
/** Returns the original first requested scope not covered by the role's allowed scopes. */
function resolveMissingRequestedScope(params) {
	const role = params.role.trim();
	const prefix = `${role}.`;
	const allowedScopes = params.allowedScopes.map((scope) => scope.trim());
	for (const scope of params.requestedScopes) {
		const requestedScope = scope.trim();
		if (!requestedScope) continue;
		if (!(role === OPERATOR_ROLE ? operatorScopeSatisfied(requestedScope, allowedScopes) : requestedScope.startsWith(prefix) && allowedScopes.includes(requestedScope))) return scope;
	}
	return null;
}
//#endregion
//#region src/gateway/credential-planner.ts
/** Normalize optional Gateway credential strings to nonempty values. */
const trimToUndefined = normalizeOptionalString;
/**
* Like trimToUndefined but also rejects unresolved env var placeholders (e.g. `${VAR}`).
* This prevents literal placeholder strings like `${OPENCLAW_GATEWAY_TOKEN}` from being
* accepted as valid credentials when the referenced env var is missing.
* Note: legitimate credential values containing literal `${UPPER_CASE}` patterns will
* also be rejected, but this is an extremely unlikely edge case.
*/
function trimCredentialToUndefined(value) {
	const trimmed = trimToUndefined(value);
	if (trimmed && containsEnvVarReference(trimmed)) return;
	return trimmed;
}
/** Classify one configured credential input without resolving secret refs. */
function resolveConfiguredGatewayCredentialInput(params) {
	const resolutionFacts = getConfigResolutionFacts(params.config);
	if (hasUnresolvedConfigPath(params.config, params.path) || getAuthoredConfigSecretRef(params.config, params.path)) return {
		path: params.path,
		configured: true,
		refPath: params.path,
		hasSecretRef: false
	};
	if (resolutionFacts !== null && typeof params.value === "string") return {
		path: params.path,
		configured: Boolean(trimToUndefined(params.value)),
		value: trimToUndefined(params.value),
		hasSecretRef: false
	};
	const ref = resolveSecretInputRef({
		value: params.value,
		defaults: params.defaults
	}).ref;
	return {
		path: params.path,
		configured: hasConfiguredSecretInput(params.value, params.defaults),
		value: ref ? void 0 : trimToUndefined(params.value),
		refPath: ref ? params.path : void 0,
		hasSecretRef: ref !== null
	};
}
/** Build the shared credential plan for Gateway startup, local auth, and remote client auth. */
function createGatewayCredentialPlan(params) {
	const env = params.env ?? process.env;
	const gateway = params.config.gateway;
	const remote = gateway?.remote;
	const defaults = params.defaults ?? params.config.secrets?.defaults;
	const authMode = gateway?.auth?.mode;
	const envToken = trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
	const envPassword = trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD);
	const localToken = resolveConfiguredGatewayCredentialInput({
		config: params.config,
		value: gateway?.auth?.token,
		defaults,
		path: "gateway.auth.token"
	});
	const localPassword = resolveConfiguredGatewayCredentialInput({
		config: params.config,
		value: gateway?.auth?.password,
		defaults,
		path: "gateway.auth.password"
	});
	const remoteToken = resolveConfiguredGatewayCredentialInput({
		config: params.config,
		value: remote?.token,
		defaults,
		path: "gateway.remote.token"
	});
	const remotePassword = resolveConfiguredGatewayCredentialInput({
		config: params.config,
		value: remote?.password,
		defaults,
		path: "gateway.remote.password"
	});
	const localTokenCanWin = authMode !== "password" && authMode !== "none" && authMode !== "trusted-proxy";
	const tokenCanWin = Boolean(envToken || localToken.configured || remoteToken.configured);
	const passwordCanWin = authMode === "password" || authMode === "trusted-proxy" || authMode !== "token" && authMode !== "none" && !tokenCanWin;
	const localTokenSurfaceActive = localTokenCanWin && (authMode === "token" || authMode === void 0 && !(envPassword || localPassword.configured));
	const remoteMode = gateway?.mode === "remote";
	const remoteUrlConfigured = Boolean(trimToUndefined(remote?.url));
	const tailscaleRemoteExposure = gateway?.tailscale?.mode === "serve" || gateway?.tailscale?.mode === "funnel";
	const remoteConfiguredSurface = remoteMode || remoteUrlConfigured || tailscaleRemoteExposure;
	const remoteTokenFallbackActive = localTokenCanWin && !envToken && !localToken.configured;
	const remotePasswordFallbackActive = authMode !== "trusted-proxy" && !envPassword && !localPassword.configured && passwordCanWin;
	return {
		configuredMode: gateway?.mode === "remote" ? "remote" : "local",
		authMode,
		envToken,
		envPassword,
		localToken,
		localPassword,
		remoteToken,
		remotePassword,
		localTokenCanWin,
		localPasswordCanWin: passwordCanWin,
		localTokenSurfaceActive,
		tokenCanWin,
		passwordCanWin,
		remoteMode,
		remoteUrlConfigured,
		tailscaleRemoteExposure,
		remoteConfiguredSurface,
		remoteTokenFallbackActive,
		remoteTokenActive: remoteConfiguredSurface || remoteTokenFallbackActive,
		remotePasswordFallbackActive,
		remotePasswordActive: remoteConfiguredSurface || remotePasswordFallbackActive
	};
}
//#endregion
//#region src/gateway/credentials.ts
/** Trim caller-supplied Gateway credentials without consulting config or environment. */
function resolveExplicitGatewayAuth(auth) {
	return {
		token: trimToUndefined(auth?.token),
		password: trimToUndefined(auth?.password)
	};
}
const GATEWAY_SECRET_REF_UNAVAILABLE_ERROR_CODE = "GATEWAY_SECRET_REF_UNAVAILABLE";
/** Raised when a command path needs Gateway credentials before secret refs were resolved. */
var GatewaySecretRefUnavailableError = class extends Error {
	constructor(path) {
		super([
			`${path} is configured as a secret reference but is unavailable in this command path.`,
			"Fix: set OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD, pass explicit --token/--password,",
			"or run a gateway command path that resolves secret references before credential selection."
		].join("\n"));
		this.code = GATEWAY_SECRET_REF_UNAVAILABLE_ERROR_CODE;
		this.name = "GatewaySecretRefUnavailableError";
		this.path = path;
	}
};
/** Resolve direct token/password values with caller-selected env-vs-config precedence. */
function resolveGatewayCredentialsFromValues(params) {
	const env = params.env ?? process.env;
	const envToken = trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
	const envPassword = trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD);
	const configToken = trimCredentialToUndefined(params.configToken);
	const configPassword = trimCredentialToUndefined(params.configPassword);
	const tokenPrecedence = params.tokenPrecedence ?? "env-first";
	const passwordPrecedence = params.passwordPrecedence ?? "env-first";
	return {
		token: tokenPrecedence === "config-first" ? configToken || envToken : envToken || configToken,
		password: passwordPrecedence === "config-first" ? configPassword || envPassword : envPassword || configPassword
	};
}
function resolveLocalGatewayCredentials(params) {
	const tokenConfigFallback = params.plan.localToken.configured ? params.plan.localToken.value : params.plan.remoteToken.value;
	const passwordConfigFallback = params.plan.localPassword.configured ? params.plan.localPassword.value : params.plan.authMode === "trusted-proxy" ? void 0 : params.plan.remotePassword.value;
	const localResolved = {
		token: params.localPrecedence === "config-first" ? params.plan.localToken.value || params.plan.envToken || (params.plan.localToken.configured ? void 0 : params.plan.remoteToken.value) : params.plan.envToken || tokenConfigFallback,
		password: params.localPrecedence === "config-first" ? params.plan.localPassword.value || params.plan.envPassword || (params.plan.localPassword.configured ? void 0 : passwordConfigFallback) : params.plan.envPassword || passwordConfigFallback
	};
	const localPasswordCanWin = params.plan.authMode === "password" || params.plan.authMode === "trusted-proxy" || params.plan.authMode !== "token" && params.plan.authMode !== "none" && !localResolved.token;
	const localTokenCanWin = params.plan.authMode === "token" || params.plan.authMode !== "password" && params.plan.authMode !== "none" && params.plan.authMode !== "trusted-proxy" && !localResolved.password;
	if (params.plan.localToken.refPath && params.localPrecedence === "config-first" && !params.plan.localToken.value && Boolean(params.plan.envToken) && localTokenCanWin) throw new GatewaySecretRefUnavailableError(params.plan.localToken.refPath);
	if (params.plan.localPassword.refPath && params.localPrecedence === "config-first" && !params.plan.localPassword.value && Boolean(params.plan.envPassword) && localPasswordCanWin) throw new GatewaySecretRefUnavailableError(params.plan.localPassword.refPath);
	if (params.plan.localToken.refPath && !localResolved.token && !params.plan.envToken && localTokenCanWin) throw new GatewaySecretRefUnavailableError(params.plan.localToken.refPath);
	if (params.plan.localPassword.refPath && !localResolved.password && !params.plan.envPassword && localPasswordCanWin) throw new GatewaySecretRefUnavailableError(params.plan.localPassword.refPath);
	return localResolved;
}
function resolveRemoteGatewayCredentials(params) {
	const token = params.remoteTokenFallback === "remote-only" ? params.plan.remoteToken.value : params.remoteTokenPrecedence === "env-first" ? params.plan.envToken || params.plan.remoteToken.value || params.plan.localToken.value : params.plan.remoteToken.value || params.plan.envToken || params.plan.localToken.value;
	const password = params.remotePasswordFallback === "remote-only" ? params.plan.remotePassword.value : params.remotePasswordPrecedence === "env-first" ? params.plan.envPassword || params.plan.remotePassword.value || params.plan.localPassword.value : params.plan.remotePassword.value || params.plan.envPassword || params.plan.localPassword.value;
	const localTokenFallbackEnabled = params.remoteTokenFallback !== "remote-only";
	const localTokenFallback = params.remoteTokenFallback === "remote-only" ? void 0 : params.plan.localToken.value;
	const localPasswordFallback = params.remotePasswordFallback === "remote-only" ? void 0 : params.plan.localPassword.value;
	if (params.plan.remoteToken.refPath && !token && !params.plan.envToken && !localTokenFallback && !password) throw new GatewaySecretRefUnavailableError(params.plan.remoteToken.refPath);
	if (params.plan.remotePassword.refPath && !password && !params.plan.envPassword && !localPasswordFallback && !token) throw new GatewaySecretRefUnavailableError(params.plan.remotePassword.refPath);
	if (params.plan.localToken.refPath && localTokenFallbackEnabled && !token && !password && !params.plan.envToken && !params.plan.remoteToken.value && params.plan.localTokenCanWin) throw new GatewaySecretRefUnavailableError(params.plan.localToken.refPath);
	return {
		token,
		password
	};
}
/** Resolve Gateway credentials from config, explicit auth, URL overrides, and mode policy. */
function resolveGatewayCredentialsFromConfig(params) {
	const env = params.env ?? process.env;
	const explicitAuth = resolveExplicitGatewayAuth(params.explicitAuth);
	if (explicitAuth.token || explicitAuth.password) return explicitAuth;
	if (trimToUndefined(params.urlOverride)) return params.urlOverrideSource === "env" ? resolveGatewayCredentialsFromValues({ env }) : {};
	const plan = createGatewayCredentialPlan({
		config: params.cfg,
		env
	});
	if ((params.modeOverride ?? plan.configuredMode) === "local") return resolveLocalGatewayCredentials({
		plan,
		localPrecedence: params.localPrecedence ?? "config-first"
	});
	const remoteTokenFallback = params.remoteTokenFallback ?? "remote-env-local";
	const remotePasswordFallback = params.remotePasswordFallback ?? "remote-env-local";
	return resolveRemoteGatewayCredentials({
		plan,
		remoteTokenPrecedence: params.remoteTokenPrecedence ?? "remote-first",
		remotePasswordPrecedence: params.remotePasswordPrecedence ?? "env-first",
		remoteTokenFallback,
		remotePasswordFallback
	});
}
//#endregion
//#region src/gateway/auth-resolve.ts
/** Merge sparse runtime auth overrides without erasing configured values. */
function mergeGatewayAuthConfig(base, override) {
	const merged = { ...base };
	if (!override) return merged;
	for (const key of [
		"mode",
		"token",
		"password",
		"allowTailscale",
		"rateLimit",
		"trustedProxy"
	]) if (override[key] !== void 0) Object.assign(merged, { [key]: override[key] });
	return merged;
}
function finalizeResolvedGatewayAuth(params) {
	const { authConfig, authOverride, token, password } = params;
	const mode = authOverride?.mode ?? authConfig.mode ?? (password ? "password" : "token");
	return {
		mode,
		modeSource: authOverride?.mode !== void 0 ? "override" : authConfig.mode ? "config" : password ? "password" : token ? "token" : "default",
		token,
		password,
		allowTailscale: authConfig.allowTailscale ?? (params.tailscaleMode === "serve" && mode !== "password" && mode !== "trusted-proxy"),
		trustedProxy: authConfig.trustedProxy
	};
}
/** Resolve auth from an env-substituted config while retaining its resolution facts. */
function resolveGatewayAuthForConfig(params) {
	const authOverride = params.authOverride ?? void 0;
	const authConfig = mergeGatewayAuthConfig(params.config.gateway?.auth, authOverride);
	const config = {
		...params.config,
		gateway: {
			...params.config.gateway,
			auth: authConfig
		}
	};
	const overriddenPaths = [...authOverride?.token !== void 0 ? ["gateway.auth.token"] : [], ...authOverride?.password !== void 0 ? ["gateway.auth.password"] : []];
	copyConfigResolutionFactsExcept(params.config, config, overriddenPaths);
	const plan = createGatewayCredentialPlan({
		config,
		env: params.env
	});
	return finalizeResolvedGatewayAuth({
		authConfig,
		authOverride,
		token: plan.localToken.hasSecretRef ? void 0 : plan.localToken.value ?? plan.envToken ?? plan.remoteToken.value,
		password: plan.localPassword.hasSecretRef ? void 0 : plan.localPassword.value ?? plan.envPassword ?? (plan.authMode === "trusted-proxy" ? void 0 : plan.remotePassword.value),
		tailscaleMode: params.tailscaleMode
	});
}
//#endregion
//#region packages/session-url-contract/src/session-key.ts
const INCOGNITO_SESSION_RE = /^agent:[^:]+:(?:dashboard|subagent|internal-session-effects):incognito-[^:]+$/u;
/** Classifies process-only agent session keys without consulting runtime registry state. */
function isIncognitoSessionKey(sessionKey) {
	const raw = sessionKey?.trim().toLowerCase();
	return Boolean(raw && INCOGNITO_SESSION_RE.test(raw));
}
//#endregion
//#region src/shared/device-auth.ts
/** Normalize a device-auth role id without changing its case or namespace. */
function normalizeDeviceAuthRole(role) {
	return role.trim();
}
/** Normalize device-auth scopes, dedupe/sort them, and include implied operator scopes. */
function normalizeDeviceAuthScopes(scopes) {
	const out = new Set(normalizeTrimmedStringList(scopes));
	if (out.has("operator.admin")) {
		out.add("operator.read");
		out.add("operator.write");
	} else if (out.has("operator.write")) out.add("operator.read");
	return [...out].toSorted();
}
//#endregion
//#region src/infra/device-auth-store.kernel.ts
function createDeviceAuthEntry(params) {
	return {
		token: params.token,
		role: normalizeDeviceAuthRole(params.role),
		scopes: normalizeDeviceAuthScopes(params.scopes),
		updatedAtMs: params.updatedAtMs ?? Date.now()
	};
}
//#endregion
//#region src/infra/device-auth-store.ts
const legacyPresenceCache = /* @__PURE__ */ new Map();
function assertNoLegacyDeviceAuth(env) {
	const stateDir = resolveStateDir(env);
	let hasLegacy = legacyPresenceCache.get(stateDir);
	if (hasLegacy === void 0) {
		hasLegacy = fsSync.existsSync(path.join(stateDir, "identity", "device-auth.json"));
		legacyPresenceCache.set(stateDir, hasLegacy);
	}
	if (hasLegacy) throw new Error("Legacy device auth requires migration; stop the Gateway and run `openclaw doctor --fix`.");
}
function captureDeviceAuthOperation(params) {
	assertNoLegacyDeviceAuth(params.env);
	const context = captureOpenClawStateWorkerContext({ env: params.env });
	const { signal, assertCurrent } = params;
	const assertActive = () => {
		context.admission.assertCurrent();
		signal?.throwIfAborted();
		assertCurrent?.();
	};
	return {
		context,
		signal,
		assertActive
	};
}
async function executeDeviceAuth(captured, type, input, readOnly = false) {
	const { context, signal, assertActive } = captured;
	const mutation = type === "deviceAuth.store" || type === "deviceAuth.storeOrigin" || type === "deviceAuth.clear" || type === "deviceAuth.clearOrigin";
	const operation = (scope) => scope.execute({
		type,
		input
	}, { signal });
	const options = {
		assertCurrent: assertActive,
		...mutation ? { createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Device token mutation requires transaction admission");
				assertActive();
				grant();
			})
		}) } : {}
	};
	const result = await (readOnly ? runOpenClawStateWorkerOperation(context, operation, {
		...options,
		existingOnly: true
	}) : runOpenClawStateWorkerOperation(context, operation, options));
	if (!mutation) assertActive();
	return result;
}
/** Prepare the command runtime before connection work, without reading or caching token facts. */
async function prepareDeviceAuthStore(params) {
	await executeDeviceAuth(captureDeviceAuthOperation(params), "deviceAuth.prepare", void 0, params.readOnly === true);
}
async function readDeviceAuth(params, readOnly) {
	const { deviceId, role, gatewayScope, onSnapshot } = params;
	const captured = captureDeviceAuthOperation(params);
	const observation = await (gatewayScope === void 0 ? executeDeviceAuth(captured, "deviceAuth.read", {
		deviceId,
		role,
		readOnly
	}, readOnly) : executeDeviceAuth(captured, "deviceAuth.readOrigin", {
		deviceId,
		role,
		gatewayScope,
		readOnly
	}, readOnly)) ?? {
		entry: null,
		expectedToken: null
	};
	captured.assertActive();
	onSnapshot?.(observation);
	return observation.entry;
}
function loadDeviceAuthToken(params) {
	return readDeviceAuth(params, false);
}
function loadDeviceAuthTokenReadOnly(params) {
	return readDeviceAuth(params, true);
}
async function storeDeviceAuthToken(params) {
	const input = {
		deviceId: params.deviceId,
		...createDeviceAuthEntry(params),
		expectedToken: params.expectedToken
	};
	return await executeDeviceAuth(captureDeviceAuthOperation(params), "deviceAuth.store", input);
}
async function clearDeviceAuthToken(params) {
	const { deviceId, role, expectedToken, observedToken } = params;
	return await executeDeviceAuth(captureDeviceAuthOperation(params), "deviceAuth.clear", {
		deviceId,
		role,
		expectedToken,
		observedToken
	});
}
function loadOriginDeviceToken(params) {
	return readDeviceAuth(params, false);
}
function loadOriginDeviceTokenReadOnly(params) {
	return readDeviceAuth(params, true);
}
async function storeOriginDeviceToken(params) {
	const input = {
		gatewayScope: params.gatewayScope,
		deviceId: params.deviceId,
		...createDeviceAuthEntry(params),
		expectedToken: params.expectedToken
	};
	return await executeDeviceAuth(captureDeviceAuthOperation(params), "deviceAuth.storeOrigin", input);
}
async function clearOriginDeviceToken(params) {
	const { deviceId, role, gatewayScope, expectedToken, observedToken } = params;
	return await executeDeviceAuth(captureDeviceAuthOperation(params), "deviceAuth.clearOrigin", {
		deviceId,
		role,
		gatewayScope,
		expectedToken,
		observedToken
	});
}
//#endregion
//#region src/infra/path-existence.ts
/** Only definite absence, including a non-directory ancestor, permits an absent verdict. */
function pathMayExistSync(filePath) {
	try {
		fsSync.lstatSync(filePath);
		return true;
	} catch (error) {
		return !isMissingPathError(error);
	}
}
//#endregion
//#region src/infra/device-identity-store.ts
const PRIMARY_DEVICE_IDENTITY_KEY = "primary";
var DeviceIdentityStorageError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "DeviceIdentityStorageError";
	}
};
function normalizeIdentityKey(key) {
	const normalized = key ?? PRIMARY_DEVICE_IDENTITY_KEY;
	if (normalized.length === 0 || normalized !== normalized.trim()) throw new DeviceIdentityStorageError("Device identity key must be a non-empty string without surrounding whitespace.");
	if (normalized.length > 128) throw new DeviceIdentityStorageError("Device identity key exceeds 128 characters.");
	return normalized;
}
function invalidStoredIdentityError(identityKey, cause) {
	return new DeviceIdentityStorageError(`SQLite contains an invalid persisted device identity "${identityKey}". Run "openclaw doctor --fix" before starting the gateway or connecting this client.`, cause === void 0 ? void 0 : { cause });
}
function fingerprintPublicKey(publicKeyPem) {
	const raw = deriveCanonicalEd25519PublicKeyRaw(publicKeyPem);
	return crypto.createHash("sha256").update(raw).digest("hex");
}
/** Generate canonical Ed25519 material before entering a synchronous write transaction. */
function generateStoredDeviceIdentity(now = Date.now()) {
	const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
	const publicKeyPem = publicKey.export({
		type: "spki",
		format: "pem"
	});
	const privateKeyPem = privateKey.export({
		type: "pkcs8",
		format: "pem"
	});
	return {
		deviceId: fingerprintPublicKey(publicKeyPem),
		publicKeyPem,
		privateKeyPem,
		createdAtMs: now
	};
}
function keyPairMatches(publicKeyPem, privateKeyPem) {
	try {
		deriveCanonicalEd25519PublicKeyRaw(publicKeyPem);
		deriveCanonicalEd25519PrivateKeyRaw(privateKeyPem);
		const publicKey = crypto.createPublicKey(publicKeyPem);
		const privateKey = crypto.createPrivateKey(privateKeyPem);
		if (publicKey.asymmetricKeyType !== "ed25519" || privateKey.asymmetricKeyType !== "ed25519") return false;
		const derivedPublicKey = crypto.createPublicKey(privateKeyPem).export({
			type: "spki",
			format: "der"
		});
		const storedPublicKey = publicKey.export({
			type: "spki",
			format: "der"
		});
		return Buffer.from(derivedPublicKey).equals(Buffer.from(storedPublicKey));
	} catch {
		return false;
	}
}
function parseCreatedAtMs(value) {
	return asSafeIntegerInRange(value, { min: 0 }) ?? null;
}
/** Validate persisted key material and return the canonical runtime shape. */
function validateStoredDeviceIdentity(value, identityKey = PRIMARY_DEVICE_IDENTITY_KEY) {
	try {
		if (!value.deviceId || !/^[a-f0-9]{64}$/.test(value.deviceId) || !value.publicKeyPem || !value.privateKeyPem || parseCreatedAtMs(value.createdAtMs) === null || !keyPairMatches(value.publicKeyPem, value.privateKeyPem)) throw invalidStoredIdentityError(identityKey);
		if (fingerprintPublicKey(value.publicKeyPem) !== value.deviceId) throw invalidStoredIdentityError(identityKey);
		return {
			deviceId: value.deviceId,
			publicKeyPem: value.publicKeyPem,
			privateKeyPem: value.privateKeyPem
		};
	} catch (error) {
		if (error instanceof DeviceIdentityStorageError) throw error;
		throw invalidStoredIdentityError(identityKey, error);
	}
}
function rowToStoredIdentity(row, expectedIdentityKey) {
	if (row.identity_key !== expectedIdentityKey || typeof row.device_id !== "string" || typeof row.public_key_pem !== "string" || typeof row.private_key_pem !== "string" || parseCreatedAtMs(row.created_at_ms) === null || parseCreatedAtMs(row.updated_at_ms) === null) throw invalidStoredIdentityError(expectedIdentityKey);
	return {
		deviceId: row.device_id,
		publicKeyPem: row.public_key_pem,
		privateKeyPem: row.private_key_pem,
		createdAtMs: row.created_at_ms
	};
}
function storedIdentityToRow(identityKey, stored, updatedAtMs = stored.createdAtMs) {
	return {
		identity_key: identityKey,
		device_id: stored.deviceId,
		public_key_pem: stored.publicKeyPem,
		private_key_pem: stored.privateKeyPem,
		created_at_ms: stored.createdAtMs,
		updated_at_ms: updatedAtMs
	};
}
function readStoredIdentityRowFromDatabase(database, identityKey) {
	const db = getNodeSqliteKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("device_identities").selectAll().where("identity_key", "=", identityKey)) ?? null;
}
function readStoredIdentityFromDatabase(database, identityKey) {
	const row = readStoredIdentityRowFromDatabase(database, identityKey);
	if (!row) return null;
	const stored = rowToStoredIdentity(row, identityKey);
	validateStoredDeviceIdentity(stored, identityKey);
	return stored;
}
function isEmptyBootstrapIdentityTableMiss(database, error) {
	if (!(error instanceof Error) || !hasErrnoCode(error, "ERR_SQLITE_ERROR") || !/\bno such table: device_identities\b/iu.test(error.message)) return false;
	const db = getNodeSqliteKysely(database.db);
	return !executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("sqlite_master").select("name").where("name", "not like", "sqlite_%").limit(1));
}
/** Resolve the concrete database and row identity used by process caches and diagnostics. */
function resolveDeviceIdentityStore(options = {}) {
	return {
		databasePath: path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env)),
		identityKey: normalizeIdentityKey(options.identityKey)
	};
}
function assertNoPendingLegacyIdentity(options) {
	const { databasePath, identityKey } = resolveDeviceIdentityStore(options);
	if (identityKey !== PRIMARY_DEVICE_IDENTITY_KEY) return;
	const legacyPath = path.join(resolveOpenClawStateDirForDatabasePath(databasePath), "identity", "device.json");
	if (pathMayExistSync(`${legacyPath}.doctor-importing`) || pathMayExistSync(`${legacyPath}.native-importing`) || pathMayExistSync(legacyPath)) throw new StartupMaintenanceRequiredError("state-migrations", `Legacy device identity exists at ${legacyPath}. Run "openclaw doctor --fix" before starting the gateway or connecting this client.`);
}
/** Read through the writable shared-state lifecycle, validating any existing row. */
function readStoredDeviceIdentity(options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	return readStoredIdentityFromDatabase(openOpenClawStateDatabase({
		env: options.env,
		path: resolved.databasePath
	}), resolved.identityKey);
}
/** Read without creating, repairing, chmodding, or joining the writer lifecycle. */
function readStoredDeviceIdentityReadOnly(options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly((database) => {
		try {
			return readStoredIdentityFromDatabase(database, resolved.identityKey);
		} catch (error) {
			if (isEmptyBootstrapIdentityTableMiss(database, error)) return null;
			throw error;
		}
	}, {
		env: options.env,
		path: resolved.databasePath
	}) ?? null;
}
/** Insert a candidate only when the key is still absent, then return the authoritative row. */
function insertStoredDeviceIdentityIfAbsent(candidate, options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	validateStoredDeviceIdentity(candidate, resolved.identityKey);
	return runOpenClawStateWriteTransaction(({ db }) => {
		if (!readStoredIdentityFromDatabase({ db }, resolved.identityKey)) {
			assertNoPendingLegacyIdentity({
				...options,
				path: resolved.databasePath,
				identityKey: resolved.identityKey
			});
			const kysely = getNodeSqliteKysely(db);
			executeSqliteQuerySync(db, kysely.insertInto("device_identities").values(storedIdentityToRow(resolved.identityKey, candidate)).onConflict((conflict) => conflict.column("identity_key").doNothing()));
		}
		const authoritative = readStoredIdentityFromDatabase({ db }, resolved.identityKey);
		if (!authoritative) throw new DeviceIdentityStorageError(`SQLite device identity "${resolved.identityKey}" was not durable after insert.`);
		return authoritative;
	}, {
		env: options.env,
		path: resolved.databasePath
	}, { operationLabel: "device-identity.create" });
}
//#endregion
//#region src/infra/device-identity.ts
function toDeviceIdentity(stored) {
	return {
		deviceId: stored.deviceId,
		publicKeyPem: stored.publicKeyPem,
		privateKeyPem: stored.privateKeyPem
	};
}
/** Load a valid canonical identity or atomically create its SQLite row. */
function loadOrCreateDeviceIdentity(options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	const resolvedOptions = {
		...options,
		path: resolved.databasePath,
		identityKey: resolved.identityKey
	};
	const existing = pathMayExistSync(resolved.databasePath) ? readStoredDeviceIdentity(resolvedOptions) : null;
	if (existing) return toDeviceIdentity(existing);
	assertNoPendingLegacyIdentity(resolvedOptions);
	return toDeviceIdentity(insertStoredDeviceIdentityIfAbsent(generateStoredDeviceIdentity(), resolvedOptions));
}
/** Load a valid persisted identity without creating or mutating SQLite state. */
function loadDeviceIdentityIfPresent(options = {}) {
	const stored = readStoredDeviceIdentityReadOnly(options);
	if (stored) return toDeviceIdentity(stored);
	assertNoPendingLegacyIdentity(options);
	return null;
}
//#endregion
//#region src/gateway/websocket-protocol.ts
/** Map the HTTP aliases accepted by WebSocket clients onto their canonical schemes. */
function normalizeWebSocketProtocol(protocol) {
	return protocol === "https:" ? "wss:" : protocol === "http:" ? "ws:" : protocol;
}
//#endregion
//#region src/gateway/net.ts
function isLoopbackAddress(ip) {
	return isLoopbackIpAddress(ip);
}
/**
* Returns true if the IP belongs to a private or loopback network range.
* Private ranges: RFC1918, link-local, ULA IPv6, and CGNAT (100.64/10), plus loopback.
* Excludes RFC8215 local-use NAT64: SSRF policy blocks that allocation, but
* Gateway trust decisions cannot infer a private mapped destination from it.
*/
function isPrivateOrLoopbackAddress(ip) {
	return isPrivateOrLoopbackIpAddress$1(ip) && !isRfc8215LocalUseNat64Ipv6Address(ip);
}
/**
* Check if a hostname or IP refers to the local machine.
* Handles: localhost, 127.x.x.x, ::1, [::1], ::ffff:127.x.x.x
* Note: 0.0.0.0 and :: are NOT loopback - they bind to all interfaces.
*/
function isLoopbackHost(host) {
	const parsed = typeof host === "string" ? parseHostForAddressChecks(host) : null;
	if (!parsed) return false;
	if (parsed.isLocalhost) return true;
	return isLoopbackAddress(parsed.unbracketedHost);
}
function isLoopbackGatewayUrl(rawUrl) {
	try {
		const hostname = new URL(rawUrl).hostname.toLowerCase();
		const unbracketed = hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
		return unbracketed === "localhost" || isLoopbackIpAddress(unbracketed);
	} catch {
		return false;
	}
}
/**
* Check if a hostname or IP refers to a private or loopback address.
* Handles the same hostname formats as isLoopbackHost, but also accepts
* RFC 1918, link-local, CGNAT, and IPv6 ULA/link-local addresses.
*/
function isPrivateOrLoopbackHost$1(host) {
	const parsed = typeof host === "string" ? parseHostForAddressChecks(host) : null;
	if (!parsed) return false;
	if (parsed.isLocalhost) return true;
	const normalized = normalizeIpAddress(parsed.unbracketedHost);
	if (!normalized || !isPrivateOrLoopbackAddress(normalized)) return false;
	if (net.isIP(normalized) === 6) {
		if (normalized.startsWith("ff")) return false;
		if (normalized === "::") return false;
	}
	return true;
}
/**
* Security check for WebSocket URLs (CWE-319: Cleartext Transmission of Sensitive Information).
*
* Returns true if the URL is secure for transmitting data:
* - wss:// (TLS) is always secure
* - ws:// is secure for loopback, private IP literals, .local, and Tailnet hosts
* - optional break-glass: other private-DNS ws:// hostnames can be enabled for trusted networks
*
* All other ws:// URLs are considered insecure because both credentials
* AND chat/conversation data would be exposed to network interception.
*/
function isSecureWebSocketUrl$1(url, opts) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return false;
	}
	const protocol = normalizeWebSocketProtocol(parsed.protocol);
	if (protocol === "wss:") return true;
	if (protocol !== "ws:") return false;
	if (isLoopbackHost(parsed.hostname)) return true;
	if (isTrustedPlaintextWebSocketHost$1(parsed.hostname)) return true;
	if (opts?.allowPrivateWs) {
		const hostForIpCheck = parsed.hostname.startsWith("[") && parsed.hostname.endsWith("]") ? parsed.hostname.slice(1, -1) : parsed.hostname;
		return net.isIP(hostForIpCheck) === 0;
	}
	return false;
}
function isTrustedPlaintextWebSocketHost$1(hostname) {
	if (isPrivateOrLoopbackHost$1(hostname)) return true;
	const normalized = normalizeLowercaseStringOrEmpty(hostname).replace(/\.+$/, "");
	return normalized.endsWith(".local") || normalized.endsWith(".ts.net");
}
//#endregion
//#region src/gateway/call-device-auth.ts
var GatewayCredentialsRequiredError = class extends Error {
	constructor(params) {
		super([
			`gateway ${params.method} requires credentials before opening a websocket`,
			"Fix: configure gateway.auth token/password, pair this device, or pass --token/--password.",
			`Config: ${params.configPath}`
		].join("\n"));
		this.name = "GatewayCredentialsRequiredError";
		this.method = params.method;
		this.configPath = params.configPath;
	}
};
var GatewayStoredDeviceAuthUnavailableError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "GatewayStoredDeviceAuthUnavailableError";
	}
};
var GatewayLocalBackendSharedAuthUnavailableError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "GatewayLocalBackendSharedAuthUnavailableError";
	}
};
function resolveDeviceIdentityForGatewayCall(sharedStateMode) {
	try {
		return sharedStateMode === "read-only" ? loadDeviceIdentityIfPresent() : loadOrCreateDeviceIdentity();
	} catch {
		return null;
	}
}
function resolveGatewayCallDeviceAuth(params) {
	const { opts } = params;
	const isLoopback = isLoopbackGatewayUrl(params.url);
	const clientOptions = {
		clientName: opts.clientName,
		mode: opts.mode,
		requireLocalBackendSharedAuth: opts.requireLocalBackendSharedAuth
	};
	if (opts.allowLocalBackendAuthNone && params.authMode === "none" && params.isImplicitLocalTarget && isLoopback && opts.clientName === GATEWAY_CLIENT_NAMES.CLI && opts.mode === GATEWAY_CLIENT_MODES.CLI && opts.deviceIdentity === void 0 && !opts.useStoredDeviceAuth && !opts.preparedDeviceAuth && !opts.approvalRuntimeToken && !opts.agentRuntimeIdentityToken) {
		clientOptions.clientName = GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT;
		clientOptions.mode = GATEWAY_CLIENT_MODES.BACKEND;
		clientOptions.requireLocalBackendSharedAuth = true;
	}
	const mode = clientOptions.mode ?? GATEWAY_CLIENT_MODES.CLI;
	const clientName = clientOptions.clientName ?? GATEWAY_CLIENT_NAMES.CLI;
	const allowAuthNone = clientOptions.requireLocalBackendSharedAuth === true && params.authMode === "none";
	const hasSharedSecretAuth = params.authMode === "token" && Boolean(params.token) || params.authMode === "password" && Boolean(params.password);
	const isLocalBackendSharedAuth = mode === GATEWAY_CLIENT_MODES.BACKEND && clientName === GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT && (hasSharedSecretAuth || allowAuthNone) && isLoopback;
	const isLocalCliSharedAuth = mode === GATEWAY_CLIENT_MODES.CLI && clientName === GATEWAY_CLIENT_NAMES.CLI && hasSharedSecretAuth && isLoopback;
	const omitDeviceIdentity = isLocalBackendSharedAuth || isLocalCliSharedAuth;
	if (clientOptions.requireLocalBackendSharedAuth && !omitDeviceIdentity) throw new GatewayLocalBackendSharedAuthUnavailableError("local backend shared auth requires a loopback gateway with token/password credentials or auth mode none");
	return {
		clientOptions,
		omitDeviceIdentity,
		deviceIdentity: opts.deviceIdentity === void 0 ? omitDeviceIdentity ? null : resolveDeviceIdentityForGatewayCall(opts.sharedStateMode) : opts.deviceIdentity
	};
}
async function loadStoredOperatorDeviceAuthToken(deviceIdentity, deviceAuthScope, sharedStateMode, env = process.env) {
	if (!deviceIdentity) return null;
	try {
		if (deviceAuthScope) return await (sharedStateMode === "read-only" ? loadOriginDeviceTokenReadOnly : loadOriginDeviceToken)({
			gatewayScope: deviceAuthScope,
			deviceId: deviceIdentity.deviceId,
			role: "operator",
			env
		});
		return await (sharedStateMode === "read-only" ? loadDeviceAuthTokenReadOnly : loadDeviceAuthToken)({
			deviceId: deviceIdentity.deviceId,
			role: "operator",
			env
		});
	} catch {
		return null;
	}
}
//#endregion
//#region src/gateway/call-required-features.ts
function ensureGatewaySupportsRequiredFeatures(params) {
	const required = (params.required ?? []).map((entry) => entry.trim()).filter(Boolean);
	if (required.length === 0) return;
	const supported = new Set((params.supported ?? []).map((entry) => entry.trim()).filter(Boolean));
	for (const feature of required) if (!supported.has(feature)) throw new Error(`active gateway does not support required ${params.kind} "${feature}" for "${params.attemptedMethod}". Update or restart the active gateway and try again.`);
}
//#endregion
//#region src/config/gateway-public-origin.ts
function resolveGatewayPublicOrigin(config) {
	const raw = config?.gateway?.publicOrigin?.trim();
	if (!raw) return;
	try {
		const parsed = new URL(raw);
		return parsed.pathname === "/" && !parsed.search && !parsed.hash ? parsed.origin : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region src/gateway/resolve-configured-secret-input-string.ts
function buildUnresolvedReason(params) {
	if (params.style === "generic") return `${params.path} SecretRef is unresolved (${params.refLabel}).`;
	if (params.kind === "non-string") return `${params.path} SecretRef resolved to a non-string value.`;
	if (params.kind === "empty") return `${params.path} SecretRef resolved to an empty value.`;
	return `${params.path} SecretRef is unresolved (${params.refLabel}).`;
}
async function resolveConfiguredSecretInput(params) {
	const style = params.unresolvedReasonStyle ?? "generic";
	let configPath = params.path;
	if (typeof params.value === "string" && getConfigResolutionFacts(params.config) !== null) try {
		configPath = formatConcreteConfigPath(tokenizeConcreteConfigPath(configPath).tokens, params.config);
	} catch {}
	const ref = resolveConfigSecretRef({
		config: params.config,
		path: configPath,
		value: params.value,
		defaults: params.config.secrets?.defaults
	});
	if (!ref) return {
		refConfigured: false,
		value: normalizeOptionalString(params.value)
	};
	const refLabel = `${ref.source}:${ref.provider}:${ref.id}`;
	try {
		const resolvedValue = (await resolveSecretRefValues([ref], {
			config: params.config,
			env: params.env,
			...params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {}
		})).get(secretRefKey(ref));
		const trimmed = normalizeOptionalString(resolvedValue);
		if (!trimmed) return {
			refConfigured: true,
			unresolvedRefReason: buildUnresolvedReason({
				path: params.path,
				style,
				kind: typeof resolvedValue === "string" ? "empty" : "non-string",
				refLabel
			})
		};
		return {
			refConfigured: true,
			value: trimmed
		};
	} catch (error) {
		const redactedValue = isSecretResolutionError(error) && error.code === "SECRET_REF_REDACTED_VALUE";
		const operatorDiagnostic = style === "detailed" || redactedValue ? describeSecretResolutionOperatorDiagnostic(error) : void 0;
		const operatorRecovery = style === "detailed" || redactedValue ? describeSecretResolutionOperatorRecovery(error) : void 0;
		const unresolvedReason = buildUnresolvedReason({
			path: params.path,
			style,
			kind: "unresolved",
			refLabel
		});
		const operatorDetail = [operatorDiagnostic, operatorRecovery].filter(Boolean).join(". ");
		return {
			refConfigured: true,
			...redactedValue ? { unresolvedRefCode: "SECRET_REF_REDACTED_VALUE" } : {},
			unresolvedRefReason: operatorDetail ? `${unresolvedReason} ${operatorDetail}.` : unresolvedReason
		};
	}
}
async function resolveCanonicalConfiguredSecretInputWithFallback(params) {
	const resolved = await resolveConfiguredSecretInput(params);
	const configValue = !resolved.refConfigured ? resolved.value : void 0;
	if (configValue) return {
		value: configValue,
		source: "config",
		secretRefConfigured: false
	};
	if (!resolved.refConfigured) {
		const fallback = normalizeOptionalString(params.readFallback?.());
		if (fallback) return {
			value: fallback,
			source: "fallback",
			secretRefConfigured: false
		};
		return { secretRefConfigured: false };
	}
	if (resolved.value) return {
		value: resolved.value,
		source: "secretRef",
		secretRefConfigured: true
	};
	return {
		unresolvedRefReason: resolved.unresolvedRefReason,
		...resolved.unresolvedRefCode ? { unresolvedRefCode: resolved.unresolvedRefCode } : {},
		secretRefConfigured: true
	};
}
//#endregion
//#region src/gateway/secret-input-paths.ts
/** Stable scan order for Gateway secret-ref credential selection. */
const ALL_GATEWAY_SECRET_INPUT_PATHS = [
	"gateway.auth.token",
	"gateway.auth.password",
	"gateway.remote.token",
	"gateway.remote.password"
];
/** Narrow an arbitrary error/config path to one of the supported Gateway secret inputs. */
function isSupportedGatewaySecretInputPath(path) {
	return ALL_GATEWAY_SECRET_INPUT_PATHS.includes(path);
}
/** Read a Gateway secret input without assuming whether it is plaintext, a ref, or absent. */
function readGatewaySecretInputValue(config, path) {
	if (path === "gateway.auth.token") return config.gateway?.auth?.token;
	if (path === "gateway.auth.password") return config.gateway?.auth?.password;
	if (path === "gateway.remote.token") return config.gateway?.remote?.token;
	return config.gateway?.remote?.password;
}
/** Replace one Gateway secret input and consume its pending authored provenance atomically. */
function assignResolvedGatewaySecretInput(params) {
	const { config, path, value } = params;
	const target = path === "gateway.auth.token" || path === "gateway.auth.password" ? config.gateway?.auth : config.gateway?.remote;
	if (target) {
		target[isTokenGatewaySecretInputPath(path) ? "token" : "password"] = value;
		copyConfigResolutionFactsExcept(config, config, [path]);
	}
}
/** Distinguish token paths from password paths for auth-mode precedence checks. */
function isTokenGatewaySecretInputPath(path) {
	return path === "gateway.auth.token" || path === "gateway.remote.token";
}
//#endregion
//#region src/gateway/auth-surface-resolution.ts
function createGatewayCredentialResolver(params) {
	return async (path) => {
		const resolved = await resolveCanonicalConfiguredSecretInputWithFallback({
			config: params.config,
			env: params.env,
			value: readGatewaySecretInputValue(params.config, path),
			path,
			unresolvedReasonStyle: "detailed"
		});
		if (resolved.unresolvedRefReason) params.diagnostics.push({
			message: resolved.unresolvedRefReason,
			code: resolved.unresolvedRefCode
		});
		return resolved;
	};
}
function withDiagnostics(diagnostics, result) {
	return diagnostics.length > 0 ? {
		...result,
		diagnostics: diagnostics.map(({ message }) => message),
		...diagnostics.some(({ code }) => code === "SECRET_REF_REDACTED_VALUE") ? { warningCode: "SECRET_REF_REDACTED_VALUE" } : {}
	} : result;
}
/** Resolves best-effort credentials for non-mutating local/remote gateway probes. */
async function resolveGatewayProbeSurfaceAuth(params) {
	const env = params.env ?? process.env;
	const diagnostics = [];
	const resolveCredential = createGatewayCredentialResolver({
		config: params.config,
		env,
		diagnostics
	});
	const authMode = params.config.gateway?.auth?.mode;
	if (params.surface === "remote") {
		const remoteToken = await resolveCredential("gateway.remote.token");
		const remotePassword = remoteToken.value ? {
			value: void 0,
			secretRefConfigured: false
		} : await resolveCredential("gateway.remote.password");
		const envToken = trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
		const envPassword = trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD);
		const hasConfiguredAuth = Boolean(remoteToken.value || remotePassword.value);
		const allowEnvAuth = !hasConfiguredAuth && diagnostics.length === 0;
		return withDiagnostics(diagnostics, {
			token: remoteToken.value ?? (allowEnvAuth ? envToken : void 0),
			password: remotePassword.value ?? (allowEnvAuth ? envPassword : void 0),
			...hasConfiguredAuth ? { source: "config" } : allowEnvAuth && (envToken || envPassword) && { source: "env" }
		});
	}
	if (authMode === "none" || authMode === "trusted-proxy") return {};
	const envToken = trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
	const envPassword = trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD);
	if (authMode === "token" || authMode === "password") {
		const credential = await resolveCredential(`gateway.auth.${authMode}`);
		if (credential.value) return withDiagnostics(diagnostics, {
			[authMode]: credential.value,
			source: "config"
		});
		const envCredential = authMode === "token" ? envToken : envPassword;
		return !credential.secretRefConfigured && envCredential ? {
			[authMode]: envCredential,
			source: "env"
		} : withDiagnostics(diagnostics, {});
	}
	const token = await resolveCredential("gateway.auth.token");
	if (token.value) return withDiagnostics(diagnostics, {
		token: token.value,
		source: "config"
	});
	if (token.secretRefConfigured) return withDiagnostics(diagnostics, {});
	const password = await resolveCredential("gateway.auth.password");
	if (password.secretRefConfigured) return withDiagnostics(diagnostics, password.value ? {
		password: password.value,
		source: "config"
	} : {});
	if (envToken) return {
		token: envToken,
		source: "env"
	};
	if (envPassword) return withDiagnostics(diagnostics, {
		password: envPassword,
		source: "env"
	});
	return withDiagnostics(diagnostics, {
		token: token.value,
		password: password.value,
		...password.value && { source: "config" }
	});
}
/** Resolves credentials for client paths that must either authenticate or explain the failure. */
async function resolveGatewayInteractiveSurfaceAuth(params) {
	const env = params.env ?? process.env;
	const resolveCredential = createGatewayCredentialResolver({
		config: params.config,
		env,
		diagnostics: []
	});
	const explicitToken = trimToUndefined(params.explicitAuth?.token);
	const explicitPassword = trimToUndefined(params.explicitAuth?.password);
	const credentialPlan = createGatewayCredentialPlan({
		config: params.config,
		env
	});
	const authMode = params.config.gateway?.auth?.mode;
	const hasActiveSecretRef = params.surface === "remote" ? credentialPlan.remoteToken.hasSecretRef || credentialPlan.remotePassword.hasSecretRef : credentialPlan.localTokenCanWin && credentialPlan.localToken.hasSecretRef || (authMode === "password" || authMode === void 0) && credentialPlan.localPassword.hasSecretRef;
	if ((explicitToken || explicitPassword) && hasActiveSecretRef) return {
		token: explicitToken,
		password: explicitPassword
	};
	const envToken = params.suppressEnvAuthFallback ? void 0 : trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
	const envPassword = params.suppressEnvAuthFallback ? void 0 : trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD);
	if (params.surface === "remote") {
		const remoteToken = explicitToken ? {
			value: explicitToken,
			secretRefConfigured: false
		} : await resolveCredential("gateway.remote.token");
		if (remoteToken.value && (remoteToken.secretRefConfigured || credentialPlan.remotePassword.hasSecretRef)) return {
			token: remoteToken.value,
			password: void 0
		};
		const remotePassword = explicitPassword ? {
			value: explicitPassword,
			secretRefConfigured: false
		} : await resolveCredential("gateway.remote.password");
		const secretRefConfigured = remoteToken.secretRefConfigured || remotePassword.secretRefConfigured;
		const token = remoteToken.value ?? (secretRefConfigured ? void 0 : envToken);
		const password = explicitPassword ?? (secretRefConfigured ? remotePassword.value : envPassword ?? remotePassword.value);
		return token || password ? {
			token,
			password
		} : { failureReason: remoteToken.unresolvedRefReason ?? remotePassword.unresolvedRefReason ?? "Missing gateway auth credentials." };
	}
	if (authMode === "none" || authMode === "trusted-proxy") return {
		token: explicitToken ?? envToken,
		password: explicitPassword ?? envPassword
	};
	const shouldUsePassword = authMode === "password" || authMode !== "token" && (Boolean(explicitPassword ?? envPassword) && !credentialPlan.localToken.hasSecretRef || credentialPlan.localPassword.configured && !credentialPlan.localToken.configured);
	const credentialKind = shouldUsePassword ? "password" : "token";
	const explicitCredential = shouldUsePassword ? explicitPassword : explicitToken;
	const envCredential = shouldUsePassword ? envPassword : envToken;
	const credential = explicitCredential ? {
		value: explicitCredential,
		secretRefConfigured: false
	} : await resolveCredential(`gateway.auth.${credentialKind}`);
	const value = credential.value ?? (credential.secretRefConfigured ? void 0 : envCredential);
	return {
		token: shouldUsePassword ? credential.secretRefConfigured ? void 0 : explicitToken ?? envToken : value,
		password: shouldUsePassword ? value : credential.secretRefConfigured ? void 0 : explicitPassword ?? envPassword,
		failureReason: value ? void 0 : credential.unresolvedRefReason ?? `Missing gateway auth ${credentialKind}.`
	};
}
//#endregion
//#region packages/gateway-client/src/gateway-origin-scope.ts
function normalizeGatewayScope(gatewayUrl, includeSearch) {
	const trimmed = gatewayUrl.trim();
	if (!trimmed) return "default";
	try {
		const browserLocation = globalThis.location;
		const base = browserLocation ? `${browserLocation.protocol}//${browserLocation.host}${browserLocation.pathname || "/"}` : void 0;
		const parsed = base ? new URL(trimmed, base) : new URL(trimmed);
		const pathname = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/+$/, "") || parsed.pathname;
		return `${parsed.protocol}//${parsed.host}${pathname}${includeSearch ? parsed.search : ""}`;
	} catch {
		return trimmed;
	}
}
/** Normalizes the gateway URL scope used for origin-bound device tokens. */
function gatewayOriginScope(gatewayUrl) {
	return normalizeGatewayScope(gatewayUrl, false);
}
//#endregion
//#region src/gateway/connection-details.ts
/** Resolve the forwarded Gateway port independently of the local tunnel port. */
function resolveGatewaySshRemotePort(config, gatewayUrl = config.gateway?.remote?.url) {
	if (config.gateway?.remote?.remotePort !== void 0) return config.gateway.remote.remotePort;
	const url = gatewayUrl?.trim();
	if (url && URL.canParse(url)) {
		const port = new URL(url.replace(/^wss?:/iu, "openclaw-ssh:")).port;
		if (port) return Number(port);
	}
	return resolveGatewayPort(config);
}
/** Select credential ownership independently of an SSH tunnel's reusable local port. */
function resolveGatewayDeviceAuthRoute(params) {
	if (!params.remote) return { bound: false };
	const url = params.url.trim();
	const deviceAuthScope = gatewayOriginScope(url);
	if (!URL.canParse(url)) return {
		deviceAuthScope,
		bound: false
	};
	const parsed = new URL(url);
	if (!isLoopbackHost(parsed.hostname)) return {
		deviceAuthScope,
		bound: true
	};
	const remote = params.config.gateway?.remote;
	const configuredTarget = normalizeOptionalString(remote?.sshTarget);
	const identity = normalizeOptionalString(remote?.sshIdentity);
	const configuredSshRoute = params.configuredRemote && configuredTarget && remote?.transport !== "direct" && remote?.url?.trim() === url ? {
		target: configuredTarget,
		remotePort: resolveGatewaySshRemotePort(params.config, url),
		...identity ? { identity } : {},
		...remote.sshHostKeyPolicy ? { hostKeyPolicy: remote.sshHostKeyPolicy } : {}
	} : void 0;
	const sshRoute = params.sshRoute ?? configuredSshRoute;
	if (sshRoute) {
		const sshTunnel = {
			...sshRoute,
			target: sshRoute.target.trim()
		};
		const route = `${sshTunnel.target}:gateway-port:${sshTunnel.remotePort}`;
		return {
			deviceAuthScope: `remote:ssh:${createHash("sha256").update(route).digest("hex")}`,
			sshTunnel,
			bound: true
		};
	}
	const fingerprint = normalizeTlsFingerprint(params.tlsFingerprint);
	if (parsed.protocol === "wss:" && fingerprint) return {
		deviceAuthScope: `remote:tls:${createHash("sha256").update(`${deviceAuthScope}:tls-sha256:${fingerprint}`).digest("hex")}`,
		bound: true
	};
	return {
		deviceAuthScope,
		bound: false
	};
}
/** Redact one Gateway URL before it crosses an operator-visible diagnostic boundary. */
function projectGatewayUrlForDiagnostics(url) {
	return redactSensitiveUrlLikeString(url);
}
/** Build gateway target details and reject unsafe remote plaintext websocket URLs. */
function buildGatewayConnectionDetailsWithResolvers(options = {}, resolvers = {}) {
	const config = options.config ?? resolvers.getRuntimeConfig?.() ?? {};
	const configPath = options.configPath ?? resolvers.resolveConfigPath?.(process.env) ?? resolveConfigPath(process.env);
	const isRemoteMode = options.localPortOverride === void 0 && config.gateway?.mode === "remote";
	const remote = isRemoteMode ? config.gateway?.remote : void 0;
	const tlsEnabled = config.gateway?.tls?.enabled === true;
	const localPort = options.localPortOverride ?? resolvers.resolveGatewayPort?.(config, process.env) ?? resolveGatewayPort(config);
	const bindMode = config.gateway?.bind ?? "loopback";
	const localUrl = `${tlsEnabled ? "wss" : "ws"}://127.0.0.1:${localPort}`;
	const cliUrlOverride = normalizeOptionalString(options.url);
	const serviceUrl = normalizeOptionalString(options.serviceTargetUrl);
	const envUrlOverride = cliUrlOverride || serviceUrl || options.ignoreEnvUrlOverride || options.localPortOverride !== void 0 ? void 0 : normalizeOptionalString(process.env.OPENCLAW_GATEWAY_URL);
	const urlOverride = cliUrlOverride ?? envUrlOverride;
	const remoteUrl = normalizeOptionalString(remote?.url);
	const remoteMisconfigured = isRemoteMode && !urlOverride && !serviceUrl && !remoteUrl;
	const urlSourceHint = options.urlSource ?? (cliUrlOverride ? "cli" : envUrlOverride ? "env" : void 0);
	const url = urlOverride || serviceUrl || remoteUrl || localUrl;
	const displayUrl = redactSensitiveUrlLikeString(url);
	const urlSource = urlOverride ? urlSourceHint === "env" ? "env OPENCLAW_GATEWAY_URL" : "cli --url" : serviceUrl ? "service target" : remoteUrl ? "config gateway.remote.url" : remoteMisconfigured ? "missing gateway.remote.url (fallback local)" : "local loopback";
	const bindDetail = !urlOverride && (serviceUrl || !remoteUrl) ? `Bind: ${bindMode}` : void 0;
	const remoteFallbackNote = remoteMisconfigured ? "Warn: gateway.mode=remote but gateway.remote.url is missing; set gateway.remote.url or switch gateway.mode=local." : void 0;
	const allowPrivateWs = process.env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1";
	if (!isSecureWebSocketUrl$1(url, { allowPrivateWs })) throw new Error([
		`SECURITY ERROR: Gateway URL "${displayUrl}" uses plaintext ws:// to a non-loopback address.`,
		"Both credentials and chat data would be exposed to network interception.",
		`Source: ${urlSource}`,
		`Config: ${configPath}`,
		"Fix: Use wss:// for remote gateway URLs.",
		"Safe remote access defaults:",
		"- keep gateway.bind=loopback and use an SSH tunnel (ssh -N -L 18789:127.0.0.1:18789 user@gateway-host)",
		"- or use Tailscale Serve/Funnel for HTTPS remote access",
		allowPrivateWs ? void 0 : "Break-glass (trusted private networks only): set OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1",
		"Doctor: openclaw doctor --fix",
		"Docs: https://docs.openclaw.ai/gateway/remote"
	].join("\n"));
	return {
		url,
		urlSource,
		bindDetail,
		remoteFallbackNote,
		message: [
			`Gateway target: ${displayUrl}`,
			`Source: ${urlSource}`,
			`Config: ${configPath}`,
			bindDetail,
			remoteFallbackNote
		].filter(Boolean).join("\n")
	};
}
//#endregion
//#region src/gateway/control-ui-shared.ts
/** Normalizes a Control UI base path to either "" or a leading-slash path without trailing slash. */
function normalizeControlUiBasePath(basePath) {
	const value = basePath?.trim() ?? "";
	if (!value || value === "/") return "";
	const withSlash = value.startsWith("/") ? value : `/${value}`;
	return withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}
//#endregion
//#region src/secrets/resolve-secret-input-string.ts
/**
* Resolves a config value that may be either an inline string or a SecretRef object.
*
* Gateway and storage callers can override normalization and convert SecretRef resolution errors
* into surface-specific failures without duplicating provider lookup behavior.
*/
async function materializeSecretInput(params) {
	const normalize = params.normalize ?? normalizeSecretInputString;
	const ref = parseSecretRef(params.value, params.defaults ?? params.config.secrets?.defaults);
	if (!ref) return normalize(params.value);
	let resolved;
	try {
		const { resolveSecretRefString } = await import("./resolve-CPRThgks.mjs");
		resolved = await resolveSecretRefString(ref, {
			config: params.config,
			env: params.env
		});
	} catch (error) {
		if (params.onResolveRefError) return params.onResolveRefError(error, ref);
		throw error;
	}
	return normalize(resolved);
}
//#endregion
//#region src/gateway/credentials-secret-inputs.ts
async function resolveConfiguredGatewaySecretInput(params) {
	const configuredValue = readGatewaySecretInputValue(params.config, params.path);
	const ref = resolveConfigSecretRef({
		config: params.config,
		path: params.path,
		value: configuredValue,
		defaults: params.config.secrets?.defaults
	});
	const value = await materializeSecretInput({
		config: params.config,
		value: ref ?? configuredValue,
		env: params.env,
		normalize: trimToUndefined,
		onResolveRefError: (error) => {
			if (isSecretResolutionError(error) && error.code === "SECRET_REF_REDACTED_VALUE") throw error;
			throw new GatewaySecretRefUnavailableError(params.path);
		}
	});
	if (!value) throw new Error(`${params.path} resolved to an empty or non-string value.`);
	return value;
}
function hasConfiguredGatewaySecretRef(config, path) {
	return Boolean(resolveConfigSecretRef({
		config,
		path,
		value: readGatewaySecretInputValue(config, path),
		defaults: config.secrets?.defaults
	}));
}
function localAuthModeAllowsGatewaySecretInputPath(params) {
	const { authMode, path } = params;
	if (authMode === "none") return false;
	if (authMode === "trusted-proxy") return !isTokenGatewaySecretInputPath(path);
	if (authMode === "token") return isTokenGatewaySecretInputPath(path);
	if (authMode === "password") return !isTokenGatewaySecretInputPath(path);
	return true;
}
function canGatewaySecretInputPathWin(params) {
	if (!hasConfiguredGatewaySecretRef(params.config, params.path)) return false;
	const mode = params.options.modeOverride ?? (params.config.gateway?.mode === "remote" ? "remote" : "local");
	if (mode === "local" && !localAuthModeAllowsGatewaySecretInputPath({
		authMode: params.config.gateway?.auth?.mode,
		path: params.path
	})) return false;
	const sentinel = `__OPENCLAW_GATEWAY_SECRET_REF_PROBE_${params.path.replaceAll(".", "_")}__`;
	const probeConfig = cloneConfigWithResolutionFacts(params.config);
	for (const candidatePath of ALL_GATEWAY_SECRET_INPUT_PATHS) {
		if (!hasConfiguredGatewaySecretRef(probeConfig, candidatePath)) continue;
		assignResolvedGatewaySecretInput({
			config: probeConfig,
			path: candidatePath,
			value: void 0
		});
	}
	assignResolvedGatewaySecretInput({
		config: probeConfig,
		path: params.path,
		value: sentinel
	});
	try {
		const resolved = resolveGatewayCredentialsFromConfig({
			...params.options,
			cfg: probeConfig,
			env: params.env
		});
		const authMode = params.config.gateway?.auth?.mode;
		const tokenCanWin = resolved.token === sentinel && (mode === "local" && authMode === "token" || !resolved.password);
		const passwordCanWin = resolved.password === sentinel && (mode === "local" && (authMode === "password" || authMode === "trusted-proxy") || !resolved.token);
		return tokenCanWin || passwordCanWin;
	} catch {
		return false;
	}
}
/** Resolve only secret refs that can win, then select Gateway credentials. */
async function resolveGatewayCredentialsWithSecretInputs(params) {
	const explicitAuth = resolveExplicitGatewayAuth(params.explicitAuth);
	if (explicitAuth.token || explicitAuth.password) return explicitAuth;
	const options = {
		...params,
		explicitAuth
	};
	const env = options.env ?? process.env;
	const config = options.config;
	let resolvedConfig = config;
	for (const path of ALL_GATEWAY_SECRET_INPUT_PATHS) {
		if (!canGatewaySecretInputPathWin({
			options,
			env,
			config: resolvedConfig,
			path
		})) continue;
		if (resolvedConfig === config) resolvedConfig = cloneConfigWithResolutionFacts(config);
		try {
			const value = await resolveConfiguredGatewaySecretInput({
				config: resolvedConfig,
				path,
				env
			});
			assignResolvedGatewaySecretInput({
				config: resolvedConfig,
				path,
				value
			});
		} catch (error) {
			if (isSecretResolutionError(error) && error.code === "SECRET_REF_REDACTED_VALUE") throw error;
		}
	}
	const resolvedPaths = /* @__PURE__ */ new Set();
	for (;;) try {
		return resolveGatewayCredentialsFromConfig({
			...options,
			cfg: resolvedConfig,
			env
		});
	} catch (error) {
		if (!(error instanceof GatewaySecretRefUnavailableError)) throw error;
		const path = error.path;
		if (!isSupportedGatewaySecretInputPath(path) || resolvedPaths.has(path)) throw error;
		if (resolvedConfig === config) resolvedConfig = cloneConfigWithResolutionFacts(config);
		const value = await resolveConfiguredGatewaySecretInput({
			config: resolvedConfig,
			path,
			env
		});
		assignResolvedGatewaySecretInput({
			config: resolvedConfig,
			path,
			value
		});
		resolvedPaths.add(path);
	}
}
//#endregion
//#region packages/net-policy/src/url-protocol.ts
function parseUrl(value) {
	if (value instanceof URL) return value;
	try {
		return new URL(value);
	} catch {
		return null;
	}
}
function isHttpUrl(value) {
	const url = parseUrl(value);
	return url?.protocol === "http:" || url?.protocol === "https:";
}
function isWebSocketUrl(value) {
	const url = parseUrl(value);
	return url?.protocol === "ws:" || url?.protocol === "wss:";
}
function isWssUrl(value) {
	return parseUrl(value)?.protocol === "wss:";
}
//#endregion
//#region src/gateway/tls-fingerprint.ts
/** Resolve the certificate pin for one already-selected Gateway target. */
async function resolveGatewayConnectionTlsFingerprint(params) {
	const explicitTlsFingerprint = params.explicitTlsFingerprint ? requireTlsFingerprint(params.explicitTlsFingerprint) : void 0;
	if (explicitTlsFingerprint) return explicitTlsFingerprint;
	const remoteTlsFingerprint = params.config.gateway?.mode === "remote" && (params.urlSource === "config gateway.remote.url" || params.urlSource === "env OPENCLAW_GATEWAY_URL") ? params.config.gateway.remote?.tlsFingerprint ? requireTlsFingerprint(params.config.gateway.remote.tlsFingerprint) : void 0 : void 0;
	if (remoteTlsFingerprint) return remoteTlsFingerprint;
	if (!isWssUrl(params.url)) return;
	if (!(params.urlSource === "local loopback" || params.urlSource === "missing gateway.remote.url (fallback local)") || params.config.gateway?.tls?.enabled !== true) return;
	const { inspectGatewayTlsCertificate } = await import("./gateway-J_5tOwGl.mjs");
	const certificate = await inspectGatewayTlsCertificate(params.config.gateway.tls);
	return certificate.ok ? certificate.value.fingerprintSha256 : void 0;
}
//#endregion
//#region src/gateway/client-bootstrap.ts
/**
* Maps connection-detail source labels to the override kinds that affect auth fallback.
*/
function resolveGatewayUrlOverrideSource(urlSource) {
	if (urlSource === "cli --url") return "cli";
	if (urlSource === "env OPENCLAW_GATEWAY_URL") return "env";
}
var GatewayExplicitAuthRequiredError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "GatewayExplicitAuthRequiredError";
	}
};
async function ensureExplicitGatewayAuth(params) {
	if (!params.urlOverride || !params.urlOverrideSource) return;
	if (params.explicitAuth?.token || params.explicitAuth?.password) return;
	if (params.urlOverrideSource === "env" && (params.resolvedAuth?.token || params.resolvedAuth?.password)) return;
	if (params.deviceAuthScope && await params.allowStoredOriginAuth?.(params.deviceAuthScope) === true) return;
	const sourceHint = params.urlOverrideSource === "env" ? "Set OPENCLAW_GATEWAY_TOKEN or OPENCLAW_GATEWAY_PASSWORD alongside OPENCLAW_GATEWAY_URL; config credentials are intentionally not reused." : "For the default local or SSH-tunneled Gateway, remove --url to use the configured target.";
	throw new GatewayExplicitAuthRequiredError([
		"gateway url override requires explicit credentials",
		params.errorHint,
		sourceHint,
		params.configPath ? `Config: ${params.configPath}` : void 0
	].filter(Boolean).join("\n"));
}
function resolveExactConfiguredGatewayTarget(params) {
	if (params.config.gateway?.mode === "remote") {
		const remoteUrl = trimToUndefined(params.config.gateway.remote?.url);
		return remoteUrl && remoteUrl === params.explicitUrl ? {
			authSurface: "remote",
			tlsSource: "config gateway.remote.url"
		} : void 0;
	}
	const localGateway = {
		...params.config.gateway,
		mode: "local"
	};
	delete localGateway.remote;
	const localUrl = params.buildConnectionDetails({
		config: {
			...params.config,
			gateway: localGateway
		},
		ignoreEnvUrlOverride: true,
		...params.localPortOverride !== void 0 ? { localPortOverride: params.localPortOverride } : {}
	}).url;
	const basePath = normalizeControlUiBasePath(params.config.gateway?.controlUi?.basePath ?? "");
	if (`${localUrl}${basePath}` === params.explicitUrl) return {
		authSurface: "local",
		tlsSource: "local loopback"
	};
	const publicOrigin = resolveGatewayPublicOrigin(params.config);
	if (publicOrigin && `${publicOrigin.replace(/^https:/u, "wss:").replace(/^http:/u, "ws:")}${basePath}` === params.explicitUrl) return { authSurface: "local" };
}
/** Resolve the only URL overrides allowed to displace configured Gateway targets. */
function resolveGatewayUrlOverride(params) {
	const cliUrl = trimToUndefined(params.gatewayUrl);
	if (cliUrl) return {
		url: cliUrl,
		source: "cli"
	};
	if (params.ignoreEnvUrlOverride || params.localPortOverride !== void 0) return {};
	const envUrl = trimToUndefined((params.env ?? process.env).OPENCLAW_GATEWAY_URL);
	return envUrl ? {
		url: envUrl,
		source: "env"
	} : {};
}
/**
* Resolves the URL, auth material, and handshake tuning needed to start a GatewayClient.
*/
async function resolveGatewayClientBootstrap(params) {
	const env = params.env ?? process.env;
	const explicitAuth = resolveExplicitGatewayAuth(params.explicitAuth);
	const urlOverride = resolveGatewayUrlOverride({
		gatewayUrl: params.gatewayUrl,
		env,
		ignoreEnvUrlOverride: params.ignoreEnvUrlOverride,
		localPortOverride: params.localPortOverride
	});
	const buildConnectionDetails = params.buildConnectionDetails ?? buildGatewayConnectionDetailsWithResolvers;
	const connection = buildConnectionDetails({
		config: params.config,
		url: urlOverride.url,
		...params.configPath ? { configPath: params.configPath } : {},
		...urlOverride.source ? { urlSource: urlOverride.source } : {},
		ignoreEnvUrlOverride: true,
		...params.localPortOverride !== void 0 ? { localPortOverride: params.localPortOverride } : {},
		...params.serviceTargetUrl ? { serviceTargetUrl: params.serviceTargetUrl } : {}
	});
	const detectedUrlOverrideSource = resolveGatewayUrlOverrideSource(connection.urlSource);
	const urlOverrideSource = urlOverride.source ?? detectedUrlOverrideSource;
	const configuredTarget = params.allowConfiguredAuthForExactTarget && urlOverrideSource === "cli" ? resolveExactConfiguredGatewayTarget({
		buildConnectionDetails,
		config: params.config,
		explicitUrl: connection.url,
		...params.localPortOverride !== void 0 ? { localPortOverride: params.localPortOverride } : {}
	}) : void 0;
	const tlsUrlSource = configuredTarget?.tlsSource ?? connection.urlSource;
	const tlsFingerprint = await resolveGatewayConnectionTlsFingerprint({
		config: params.config,
		url: connection.url,
		urlSource: tlsUrlSource,
		explicitTlsFingerprint: params.explicitTlsFingerprint
	});
	const surface = configuredTarget?.authSurface ?? params.modeOverride ?? (params.localPortOverride !== void 0 ? "local" : params.config.gateway?.mode === "remote" ? "remote" : "local");
	let auth;
	if (params.skipImplicitAuth) auth = explicitAuth;
	else if (urlOverrideSource && !configuredTarget) auth = params.suppressEnvAuthFallback ? explicitAuth : await resolveGatewayCredentialsWithSecretInputs({
		config: params.config,
		explicitAuth,
		env,
		urlOverride: connection.url,
		urlOverrideSource,
		modeOverride: params.modeOverride
	});
	else if (params.authPolicy === "probe") auth = await resolveGatewayProbeSurfaceAuth({
		config: params.config,
		env,
		surface
	});
	else if (params.authPolicy === "interactive") auth = await resolveGatewayInteractiveSurfaceAuth({
		config: params.config,
		env,
		explicitAuth,
		suppressEnvAuthFallback: params.suppressEnvAuthFallback,
		surface
	});
	else auth = await resolveGatewayCredentialsWithSecretInputs({
		config: params.config,
		explicitAuth,
		env,
		urlOverride: urlOverrideSource ? connection.url : void 0,
		urlOverrideSource,
		modeOverride: surface
	});
	const { deviceAuthScope, sshTunnel } = resolveGatewayDeviceAuthRoute({
		config: params.config,
		url: connection.url,
		remote: Boolean(urlOverrideSource || connection.urlSource === "config gateway.remote.url"),
		configuredRemote: !urlOverrideSource && connection.urlSource === "config gateway.remote.url" || configuredTarget?.authSurface === "remote",
		tlsFingerprint
	});
	if (params.overrideAuthErrorHint && !configuredTarget) await ensureExplicitGatewayAuth({
		urlOverride: urlOverrideSource ? connection.url : void 0,
		urlOverrideSource,
		explicitAuth,
		resolvedAuth: auth,
		deviceAuthScope,
		allowStoredOriginAuth: params.allowStoredOriginAuth,
		errorHint: params.overrideAuthErrorHint,
		configPath: params.configPath
	});
	return {
		url: connection.url,
		urlSource: connection.urlSource,
		connectionDetails: connection,
		...urlOverrideSource ? { urlOverrideSource } : {},
		...deviceAuthScope ? { deviceAuthScope } : {},
		...sshTunnel ? { sshTunnel } : {},
		...auth.failureReason ? { authFailureReason: auth.failureReason } : {},
		...tlsFingerprint ? { tlsFingerprint } : {},
		auth: {
			token: auth.token,
			password: auth.password
		}
	};
}
const GATEWAY_STARTUP_RETRY_MIN_MS = 100;
const GATEWAY_STARTUP_RETRY_MAX_MS = 2e3;
function isGatewayStartupUnavailableDetails(details) {
	return typeof details === "object" && details !== null && details.reason === "startup-sidecars";
}
/** Detects the structured retryable error emitted while startup sidecars are pending. */
function isRetryableGatewayStartupUnavailableError(error) {
	if (!error || typeof error !== "object") return false;
	const shaped = error;
	return (shaped.gatewayCode ?? shaped.code) === "UNAVAILABLE" && shaped.retryable === true && isGatewayStartupUnavailableDetails(shaped.details);
}
/** Resolves a bounded retry-after delay from a startup-unavailable error. */
function resolveGatewayStartupRetryAfterMs(error) {
	if (!isRetryableGatewayStartupUnavailableError(error)) return null;
	const retryAfterMs = error.retryAfterMs;
	return Math.min(Math.max(Math.floor(typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs) ? retryAfterMs : 500), GATEWAY_STARTUP_RETRY_MIN_MS), GATEWAY_STARTUP_RETRY_MAX_MS);
}
//#endregion
//#region packages/gateway-client/src/client-device-auth.ts
/** Owns pending host storage work for one client across connection generations. */
var GatewayClientDeviceAuth = class {
	constructor(storage) {
		this.storage = storage;
		this.operations = /* @__PURE__ */ new Set();
	}
	load(params) {
		const load = () => {
			params.signal?.throwIfAborted();
			params.assertCurrent?.();
			return this.track(this.storage.loadDeviceAuthToken(params));
		};
		return this.operations.size > 0 ? this.settle().then(load) : load();
	}
	store(params, onStored, onFailed) {
		const failed = (error) => {
			const failure = error instanceof Error ? error : new Error(String(error));
			let reported = false;
			try {
				reported = onFailed(failure);
			} catch {}
			if (!reported) this.unreportedPersistenceFailure ??= failure;
			throw failure;
		};
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
		const stored = this.storage.storeDeviceAuthToken(params);
		return stored instanceof Promise ? this.track(stored.then(onStored).catch(failed)) : onStored();
	}
	clear(params, observation, canClear) {
		const clear = () => {
			if (!canClear()) return;
			const knownTokens = [observation.token, observation.receiptToken].filter((token) => typeof token === "string");
			const expectedTokens = [...new Set(knownTokens)];
			if (observation.token === void 0 && expectedTokens.length === 0) expectedTokens.push(void 0);
			const clearToken = (expectedToken) => {
				params.signal?.throwIfAborted();
				params.assertCurrent?.();
				const cleared = this.storage.clearDeviceAuthToken({
					...params,
					...expectedToken === void 0 ? {} : { expectedToken }
				});
				return cleared instanceof Promise ? cleared.then(() => {}) : void 0;
			};
			let pending;
			for (const expectedToken of expectedTokens) pending = pending ? pending.then(() => clearToken(expectedToken)) : clearToken(expectedToken);
			return pending;
		};
		return this.track(observation.persistence ? observation.persistence.then(clear, clear) : clear());
	}
	async settle() {
		await Promise.allSettled(this.operations);
	}
	async drain() {
		await this.settle();
		const failure = this.unreportedPersistenceFailure;
		this.unreportedPersistenceFailure = void 0;
		if (failure) throw failure;
	}
	track(operation) {
		if (!(operation instanceof Promise)) return operation;
		this.operations.add(operation);
		operation.then(() => this.operations.delete(operation), () => this.operations.delete(operation));
		return operation;
	}
};
//#endregion
//#region packages/gateway-client/src/client-upgrade-error.ts
const MAX_UPGRADE_ERROR_BODY_BYTES = 2048;
const UPGRADE_ERROR_BODY_TIMEOUT_MS = 1e3;
async function readUpgradeErrorBody(response) {
	return await new Promise((resolve) => {
		const chunks = [];
		let totalBytes = 0;
		let settled = false;
		const finish = () => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			response.off("data", onData);
			response.off("end", finish);
			response.off("error", finish);
			response.off("aborted", finish);
			resolve(Buffer.concat(chunks, totalBytes).toString("utf8").replace(/\s+/gu, " ").trim());
		};
		const stop = () => {
			finish();
			response.destroy();
		};
		const onData = (chunk) => {
			const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			const remaining = MAX_UPGRADE_ERROR_BODY_BYTES - totalBytes;
			if (remaining > 0) {
				const prefix = buffer.subarray(0, remaining);
				chunks.push(prefix);
				totalBytes += prefix.byteLength;
			}
			if (buffer.byteLength >= remaining) stop();
		};
		const timer = setTimeout(stop, UPGRADE_ERROR_BODY_TIMEOUT_MS);
		timer.unref?.();
		response.on("data", onData);
		response.once("end", finish);
		response.once("error", finish);
		response.once("aborted", finish);
	});
}
//#endregion
//#region packages/gateway-client/src/connect-auth.ts
function selectGatewayConnectAuth(params) {
	const authToken = normalizeOptionalString(params.token);
	const bootstrapToken = normalizeOptionalString(params.bootstrapToken);
	const explicitDeviceToken = normalizeOptionalString(params.deviceToken);
	const authPassword = normalizeOptionalString(params.password);
	const storedToken = normalizeOptionalString(params.storedToken);
	const stored = {
		storedToken,
		storedScopes: params.storedScopes
	};
	if (params.preferBootstrapToken && bootstrapToken) return {
		authBootstrapToken: bootstrapToken,
		signatureToken: bootstrapToken,
		...stored
	};
	const useRetryToken = params.pendingDeviceTokenRetry === true && !explicitDeviceToken && Boolean(authToken && storedToken && params.trustedDeviceTokenRetry);
	const resolvedDeviceToken = explicitDeviceToken ?? (useRetryToken || !(authToken || authPassword) && (!bootstrapToken || storedToken) ? storedToken : void 0);
	const usingStoredDeviceToken = Boolean(resolvedDeviceToken && !explicitDeviceToken && storedToken) && resolvedDeviceToken === storedToken;
	const selectedToken = authToken ?? resolvedDeviceToken;
	const authBootstrapToken = !authToken && !resolvedDeviceToken && !authPassword ? bootstrapToken : void 0;
	return {
		authToken,
		authBootstrapToken,
		authDeviceToken: useRetryToken ? storedToken : void 0,
		authPassword,
		authApprovalRuntimeToken: normalizeOptionalString(params.approvalRuntimeToken),
		authAgentRuntimeIdentityToken: normalizeOptionalString(params.agentRuntimeIdentityToken),
		signatureToken: selectedToken ?? authBootstrapToken,
		resolvedDeviceToken,
		usingStoredDeviceToken,
		...stored
	};
}
function buildGatewayConnectAuth(selected) {
	const auth = {
		token: selected.authToken,
		bootstrapToken: selected.authBootstrapToken,
		deviceToken: selected.authDeviceToken ?? selected.resolvedDeviceToken,
		password: selected.authPassword,
		approvalRuntimeToken: selected.authApprovalRuntimeToken,
		agentRuntimeIdentityToken: selected.authAgentRuntimeIdentityToken
	};
	return Object.values(auth).some(Boolean) ? auth : void 0;
}
function resolveGatewayConnectScopes(params) {
	return params.requestedScopes ?? (params.usingStoredDeviceToken && params.storedScopes?.length ? params.storedScopes : [...params.defaultScopes]);
}
function shouldRetryGatewayWithDeviceToken(params) {
	if (params.retryBudgetUsed || params.currentDeviceToken || !params.explicitToken || !params.storedToken || !params.trustedEndpoint) return false;
	const advice = readConnectErrorRecoveryAdvice(params.errorDetails);
	return params.canRetryWithDeviceTokenHint === true || advice.canRetryWithDeviceToken === true || advice.recommendedNextStep === "retry_with_device_token" || readConnectErrorDetailCode(params.errorDetails) === ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH;
}
//#endregion
//#region packages/gateway-client/src/device-auth.ts
function normalizeDeviceMetadataForAuth(value) {
	if (typeof value !== "string") return "";
	return value.trim().replace(/[A-Z]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 32));
}
function buildDeviceAuthPayloadV3(params) {
	const scopes = params.scopes.join(",");
	const token = params.token ?? "";
	const platform = normalizeDeviceMetadataForAuth(params.platform);
	const deviceFamily = normalizeDeviceMetadataForAuth(params.deviceFamily);
	return [
		"v3",
		params.deviceId,
		params.clientId,
		params.clientMode,
		params.role,
		scopes,
		String(params.signedAtMs),
		token,
		params.nonce,
		platform,
		deviceFamily
	].join("|");
}
//#endregion
//#region packages/gateway-client/src/model-catalog-connect.ts
const MODEL_CATALOG_SNAPSHOT = "model-catalog-snapshot";
/** A requested snapshot opts in only after the server advertises its connect field. */
function resolveModelCatalogConnect(params) {
	const modelCatalog = params.serverCapabilities.includes(MODEL_CATALOG_SNAPSHOT) ? params.modelCatalog : void 0;
	const caps = params.caps?.filter((cap) => cap !== MODEL_CATALOG_SNAPSHOT);
	if (modelCatalog === void 0) return { caps };
	return {
		modelCatalog,
		caps: [...caps ?? [], MODEL_CATALOG_SNAPSHOT]
	};
}
//#endregion
//#region packages/gateway-protocol/src/frame-guards.ts
function isNonNegativeInteger(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function isGatewayErrorShape(value) {
	if (!isRecord(value)) return false;
	if (!isNonEmptyProtocolString(value.code) || !isNonEmptyProtocolString(value.message)) return false;
	if (value.retryable !== void 0 && typeof value.retryable !== "boolean") return false;
	return value.retryAfterMs === void 0 || isNonNegativeInteger(value.retryAfterMs);
}
function isGatewayEventFrame(value) {
	if (!isRecord(value) || value.type !== "event" || !isNonEmptyProtocolString(value.event)) return false;
	return value.seq === void 0 || isNonNegativeInteger(value.seq);
}
function isGatewayResponseFrame(value) {
	if (!isRecord(value) || value.type !== "res" || !isNonEmptyProtocolString(value.id) || typeof value.ok !== "boolean") return false;
	return value.error === void 0 || isGatewayErrorShape(value.error);
}
//#endregion
//#region packages/gateway-client/src/event-listeners.ts
/** Subscription identity prevents old frames and disposers from reviving callbacks. */
var GatewayEventListeners = class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Map();
	}
	add(listener) {
		const subscription = this.listeners.get(listener) ?? {};
		this.listeners.set(listener, subscription);
		return () => {
			if (this.listeners.get(listener) === subscription) this.listeners.delete(listener);
		};
	}
	snapshot() {
		return [...this.listeners];
	}
	isCurrent(listener, subscription) {
		return this.listeners.get(listener) === subscription;
	}
};
//#endregion
//#region packages/gateway-protocol/src/restart-unavailable.ts
/** Structured error reason used while the gateway drains for a suspension. */
const GATEWAY_SUSPEND_UNAVAILABLE_REASON = "gateway-suspending";
/** Identity reads wait for resume, with a bounded probe if that event is missed. */
const GATEWAY_SUSPEND_IDENTITY_RETRY_AFTER_MS = 6e4;
/** Detects the structured retryable error emitted while suspension refuses work. */
function isGatewaySuspendUnavailableError(error) {
	return hasUnavailableReason(error, GATEWAY_SUSPEND_UNAVAILABLE_REASON);
}
function hasUnavailableReason(error, reason) {
	if (!error || typeof error !== "object" || !("details" in error)) return false;
	const details = error.details;
	return typeof details === "object" && details !== null && "reason" in details && details.reason === reason;
}
//#endregion
//#region packages/gateway-client/src/protocol-request.ts
const gatewayResponseErrors = /* @__PURE__ */ new WeakSet();
var GatewayProtocolRequestError = class extends Error {
	constructor(error) {
		super(error.message ?? "request failed");
		this.name = "GatewayProtocolRequestError";
		this.code = error.code ?? "UNAVAILABLE";
		this.gatewayCode = this.code;
		this.details = error.details;
		this.retryable = error.retryable === true;
		this.retryAfterMs = error.retryAfterMs;
	}
};
/** Preserve response metadata after custom factories without adding it to error JSON. */
function retainGatewayResponsePayload(error, payload) {
	gatewayResponseErrors.add(error);
	Object.defineProperty(error, "responsePayload", {
		value: payload,
		enumerable: false,
		configurable: true
	});
}
/** A local transport deadline, distinct from a Gateway's authoritative rejection. */
var GatewayProtocolRequestTimeoutError = class extends Error {
	constructor(params, message = `gateway request timed out after ${params.timeoutMs}ms: ${params.method}`) {
		super(message);
		this.code = "CLIENT_TIMEOUT";
		this.name = "GatewayProtocolRequestTimeoutError";
		this.method = params.method;
		this.timeoutMs = params.timeoutMs;
		this.requestSent = params.requestSent;
	}
};
//#endregion
//#region packages/gateway-client/src/pending-request.ts
/** Owns request deadlines, correlation, settlement, and generation-scoped IDs. */
var GatewayPendingRequests = class {
	constructor(opts) {
		this.opts = opts;
		this.pending = /* @__PURE__ */ new Map();
		this.requestSequence = 0;
	}
	setSuspensionPhase(phase) {
		if (phase === "accepting") this.resumeIdentityRequests();
		else if (phase === "preparing" || phase === "draining" || phase === "prepared") this.pauseIdentityRequests();
	}
	pauseIdentityRequests(retryAfterMs = GATEWAY_SUSPEND_IDENTITY_RETRY_AFTER_MS) {
		clearTimeout(this.suspensionTimer);
		this.suspensionTimer = setTimeout(() => this.resumeIdentityRequests(), resolveSafeTimeoutDelayMs(Number.isFinite(retryAfterMs) && retryAfterMs > 0 ? retryAfterMs : GATEWAY_SUSPEND_IDENTITY_RETRY_AFTER_MS));
		this.suspensionTimer.unref?.();
	}
	resumeIdentityRequests() {
		clearTimeout(this.suspensionTimer);
		this.suspensionTimer = void 0;
		for (const pending of this.pending.values()) if (pending.waitingForResume) pending.resend?.();
	}
	get hasPending() {
		return this.pending.size > 0;
	}
	get hasUnboundedPending() {
		for (const pending of this.pending.values()) if (pending.unbounded) return true;
		return false;
	}
	request(sender, method, params, options) {
		let id;
		try {
			id = this.allocateRequestId();
		} catch (error) {
			return Promise.reject(error instanceof Error ? error : new Error(String(error)));
		}
		const requestedTimeoutMs = options?.timeoutMs === null ? void 0 : options?.timeoutMs ?? this.opts.requestTimeoutMs;
		const timeoutMs = typeof requestedTimeoutMs === "number" && Number.isFinite(requestedTimeoutMs) ? resolveSafeTimeoutDelayMs(requestedTimeoutMs, { minMs: 0 }) : void 0;
		return new Promise((resolve, reject) => {
			let timeout;
			let requestSent = false;
			const pending = {
				resolve: (value) => resolve(value),
				reject,
				expectFinal: options?.expectFinal === true,
				acceptedNotified: false,
				onAccepted: options?.onAccepted,
				unbounded: timeoutMs === void 0,
				method,
				startedAtMs: this.opts.nowMs()
			};
			const cleanup = () => {
				if (timeout !== void 0) clearTimeout(timeout);
				options?.signal?.removeEventListener("abort", onAbort);
			};
			const retire = (errorCode) => {
				if (this.pending.get(id) !== pending) return false;
				this.pending.delete(id);
				cleanup();
				this.finishTiming(id, pending, false, errorCode);
				return true;
			};
			const onAbort = () => {
				if (!retire("CLIENT_ABORTED")) return;
				reject(this.opts.createRequestAbortError?.(method) ?? /* @__PURE__ */ new Error(`gateway request aborted for ${method}`));
			};
			if (options?.signal?.aborted) {
				reject(this.opts.createRequestAbortError?.(method) ?? /* @__PURE__ */ new Error(`gateway request aborted for ${method}`));
				return;
			}
			pending.cleanup = cleanup;
			if (timeoutMs !== void 0) {
				timeout = setTimeout(() => {
					if (!retire("CLIENT_TIMEOUT")) return;
					reject(this.opts.createRequestTimeoutError?.(method, timeoutMs, requestSent) ?? new GatewayProtocolRequestTimeoutError({
						method,
						timeoutMs,
						requestSent
					}));
				}, timeoutMs);
				timeout.unref?.();
			}
			options?.signal?.addEventListener("abort", onAbort, { once: true });
			this.pending.set(id, pending);
			try {
				const frame = JSON.stringify({
					type: "req",
					id,
					method,
					params
				});
				const send = () => {
					if (this.pending.get(id) !== pending) return;
					pending.waitingForResume = Boolean(pending.resend && this.suspensionTimer);
					if (pending.waitingForResume) return;
					try {
						sender.send(frame);
						if (this.pending.get(id) !== pending) return;
						requestSent = true;
						this.invoke("sent", () => options?.onSent?.(id));
					} catch (error) {
						if (retire("CLIENT_SEND_ERROR")) reject(error instanceof Error ? error : new Error(String(error)));
					}
				};
				if (method === "agent.identity.get") pending.resend = send;
				send();
			} catch (error) {
				if (retire("CLIENT_SEND_ERROR")) reject(error instanceof Error ? error : new Error(String(error)));
			}
		});
	}
	handleResponse(frame) {
		const pending = this.pending.get(frame.id);
		if (!pending) return;
		const status = frame.payload?.status;
		if (frame.ok && pending.expectFinal && status === "accepted") {
			if (!pending.acceptedNotified) {
				pending.acceptedNotified = true;
				this.invoke("accepted", () => pending.onAccepted?.(frame.payload));
			}
			return;
		}
		if (!frame.ok && pending.resend && !pending.acceptedNotified && frame.error?.code === "UNAVAILABLE" && frame.error.retryable === true && isGatewaySuspendUnavailableError(frame.error)) {
			this.pauseIdentityRequests(frame.error.retryAfterMs);
			pending.waitingForResume = true;
			return;
		}
		this.pending.delete(frame.id);
		pending.cleanup?.();
		if (frame.ok) {
			this.finishTiming(frame.id, pending, true);
			pending.resolve(frame.payload);
			return;
		}
		this.finishTiming(frame.id, pending, false, frame.error?.code);
		const error = this.opts.createRequestError?.(frame.error ?? {}) ?? new GatewayProtocolRequestError(frame.error ?? {});
		retainGatewayResponsePayload(error, frame.payload);
		pending.reject(error);
	}
	flush(error) {
		clearTimeout(this.suspensionTimer);
		this.suspensionTimer = void 0;
		const retired = this.pending;
		this.pending = /* @__PURE__ */ new Map();
		this.requestSequence = 0;
		for (const [id, pending] of retired) {
			pending.cleanup?.();
			this.finishTiming(id, pending, false, "CLIENT_CLOSED");
			pending.reject(error);
		}
	}
	allocateRequestId() {
		this.requestSequence += 1;
		return `${this.requestSequence}:${this.opts.createRequestId()}`;
	}
	finishTiming(id, pending, ok, errorCode) {
		const endedAtMs = this.opts.nowMs();
		this.invoke("request timing", () => this.opts.onTiming?.({
			id,
			method: pending.method,
			ok,
			durationMs: Math.max(0, endedAtMs - pending.startedAtMs),
			startedAtMs: pending.startedAtMs,
			endedAtMs,
			errorCode
		}));
	}
	invoke(label, callback) {
		try {
			callback();
		} catch (error) {
			this.opts.onCallbackError?.(label, error);
		}
	}
};
//#endregion
//#region packages/gateway-client/src/protocol-client.ts
/**
* Browser-safe gateway wire client. Environment adapters own transport and auth
* policy; this class owns the single socket/handshake/reconnect/frame state machine.
*/
var GatewayProtocolClient = class {
	constructor(opts) {
		this.opts = opts;
		this.socket = null;
		this.listeners = new GatewayEventListeners();
		this.stopped = true;
		this.generation = 0;
		this.connectionAbort = null;
		this.lastSeq = null;
		this.connectNonce = null;
		this.serverCapabilities = [];
		this.connectSent = false;
		this.connectRequestSent = false;
		this.handshakeTimer = null;
		this.reconnectSignal = null;
		this.socketOpened = false;
		this.helloReceived = false;
		this.connectTiming = null;
		this.reconnectSupervisor = new RetrySupervisor({
			initialMs: opts.reconnect.initialMs,
			maxMs: opts.reconnect.maxMs,
			factor: opts.reconnect.multiplier,
			jitter: 0
		});
		this.requests = new GatewayPendingRequests({
			createRequestId: opts.createRequestId,
			createRequestError: opts.createRequestError,
			createRequestTimeoutError: opts.createRequestTimeoutError,
			createRequestAbortError: opts.createRequestAbortError,
			requestTimeoutMs: opts.requestTimeoutMs,
			nowMs: () => this.nowMs(),
			onTiming: opts.onRequestTiming,
			onCallbackError: opts.onCallbackError
		});
	}
	get connected() {
		return this.socket?.isOpen() ?? false;
	}
	get hasPendingRequests() {
		return this.requests.hasPending;
	}
	get connecting() {
		return this.connectSent && !this.helloReceived;
	}
	get hasUnboundedPendingRequests() {
		return this.requests.hasUnboundedPending;
	}
	start() {
		if (this.socket || this.reconnectSignal) return;
		this.stopped = false;
		this.reconnectSupervisor.cancel();
		this.connect();
	}
	stop() {
		this.stopped = true;
		this.connectionAbort?.abort();
		this.clearHandshakeTimer();
		this.reconnectSignal = null;
		this.reconnectSupervisor.reset();
		const socket = this.socket;
		if (socket && this.opts.notifyStoppedClose) this.stoppedSocket = {
			socket,
			context: this.closeContext()
		};
		this.socket = null;
		this.connectFailure = void 0;
		this.connectTiming = null;
		this.requests.flush(/* @__PURE__ */ new Error("gateway client stopped"));
		socket?.close();
	}
	request(method, params, options) {
		const socket = this.socket;
		if (!socket?.isOpen()) return Promise.reject(/* @__PURE__ */ new Error("gateway not connected"));
		if (typeof method !== "string" || method.length === 0) return Promise.reject(/* @__PURE__ */ new Error("invalid request frame: method must be a non-empty string"));
		return this.requests.request(socket, method, params, options);
	}
	addEventListener(listener) {
		return this.listeners.add(listener);
	}
	closeSocket(code, reason) {
		this.connectionAbort?.abort();
		this.socket?.close(code, reason);
	}
	resetReconnectBackoff(initialMs) {
		this.reconnectSignal = null;
		this.reconnectSupervisor.reset(initialMs);
	}
	recordTiming(phase, generation, plan, detail) {
		const now = this.nowMs();
		const state = this.connectTiming;
		if (!state || state.generation !== generation) return;
		state.hasChallenge ||= phase === "challenge";
		state.usedFallback ||= phase === "fallback";
		this.invoke("connect timing", () => this.opts.onTiming?.({
			phase,
			generation,
			durationMs: Math.max(0, now - state.startedAtMs),
			phaseDurationMs: Math.max(0, now - state.lastAtMs),
			hasChallenge: state.hasChallenge,
			usedFallback: state.usedFallback,
			plan,
			detail
		}));
		state.lastAtMs = now;
		if (phase === "hello" || phase === "failed") this.connectTiming = null;
	}
	connect() {
		if (this.stopped) return;
		const generation = this.generation + 1;
		this.lastSeq = null;
		this.connectNonce = null;
		this.connectChallengeTs = void 0;
		this.serverCapabilities = [];
		this.connectSent = this.connectRequestSent = false;
		this.socketOpened = false;
		this.helloReceived = false;
		this.connectFailure = void 0;
		let socket;
		try {
			socket = this.opts.createSocket({
				open: () => this.handleOpen(socket, generation),
				message: (data) => this.handleMessage(socket, generation, data),
				close: (code, reason) => this.handleClose(socket, generation, code, reason),
				error: (error) => this.handleSocketError(socket, generation, error)
			});
		} catch (error) {
			const normalized = error instanceof Error ? error : new Error(String(error));
			this.opts.onSocketFactoryError?.(normalized);
			this.opts.onConnectError?.(normalized);
			if (this.opts.rethrowSocketFactoryError?.(normalized)) {
				if (this.generation > 0 && !this.stopped && !this.socket && !this.reconnectSignal) this.opts.onReconnectStopped?.(normalized);
				throw normalized;
			}
			if (this.opts.shouldRetrySocketFactoryError?.(normalized) && !this.stopped && !this.socket && !this.reconnectSignal) this.scheduleReconnect();
			else if (this.generation > 0 && !this.stopped && !this.socket && !this.reconnectSignal) this.opts.onReconnectStopped?.(normalized);
			return;
		}
		this.generation = generation;
		this.connectionAbort = new AbortController();
		this.socket = socket;
		const now = this.nowMs();
		this.connectTiming = {
			generation,
			startedAtMs: now,
			lastAtMs: now,
			hasChallenge: false,
			usedFallback: false
		};
	}
	handleOpen(socket, generation) {
		if (!this.isActive(socket, generation)) return;
		this.socketOpened = true;
		this.recordTiming("socket-open", generation);
		if (this.connectNonce) {
			this.sendConnect(socket, generation);
			return;
		}
		this.armHandshakeTimer(socket, generation);
	}
	armHandshakeTimer(socket, generation) {
		this.clearHandshakeTimer();
		const armedAt = Date.now();
		this.handshakeTimer = setTimeout(() => {
			this.handshakeTimer = null;
			if (!this.isActive(socket, generation) || this.connectSent || !socket.isOpen()) return;
			if (this.opts.handshake.mode === "fallback") {
				this.recordTiming("fallback", generation);
				this.sendConnect(socket, generation);
				return;
			}
			const elapsedMs = Date.now() - armedAt;
			const error = new Error(this.opts.handshake.timeoutMessage?.(elapsedMs) ?? `gateway connect challenge timeout after ${elapsedMs}ms`);
			this.opts.onConnectError?.(error);
			socket.close(1008, "connect challenge timeout");
		}, this.opts.handshake.timeoutMs);
		this.handshakeTimer.unref?.();
	}
	sendConnect(socket, generation) {
		if (!this.isActive(socket, generation) || !socket.isOpen() || this.connectSent) return;
		this.connectSent = true;
		this.clearHandshakeTimer();
		this.handshakeTimer = startGatewayConnectTimeout(() => {
			if (this.isActive(socket, generation) && !this.helloReceived) socket.close(4e3, "connect timeout");
		});
		let planOrPromise;
		try {
			planOrPromise = this.opts.buildConnectPlan({
				nonce: this.connectNonce,
				challengeTs: this.connectChallengeTs,
				serverCapabilities: this.serverCapabilities,
				generation,
				...this.connectAuthority(socket, generation)
			});
		} catch (error) {
			this.handleConnectPlanError(socket, generation, error);
			return;
		}
		if (planOrPromise instanceof Promise) {
			planOrPromise.then((plan) => this.sendConnectPlan(socket, generation, plan)).catch((error) => this.handleConnectPlanError(socket, generation, error));
			return;
		}
		this.sendConnectPlan(socket, generation, planOrPromise);
	}
	handleConnectPlanError(socket, generation, error) {
		if (!this.isConnectCurrent(socket, generation)) return;
		const normalized = error instanceof Error ? error : new Error(String(error));
		const outcome = this.opts.onConnectPlanError?.(normalized) ?? {
			closeCode: 1008,
			closeReason: "connect failed"
		};
		this.opts.onConnectError?.(outcome.error ?? normalized);
		if (outcome.stop) this.stopped = true;
		socket.close(outcome.closeCode, outcome.closeReason);
	}
	sendConnectPlan(socket, generation, plan) {
		if (!this.isConnectCurrent(socket, generation)) return;
		const context = {
			...this.connectAuthority(socket, generation),
			generation,
			nonce: this.connectNonce,
			challengeTs: this.connectChallengeTs,
			plan
		};
		this.recordTiming("connect-plan-ready", generation, plan);
		this.recordTiming("request-sent", generation, plan);
		this.connectRequestSent = true;
		this.request("connect", this.opts.buildConnectParams(plan)).then((hello) => {
			if (!this.isConnectCurrent(socket, generation)) return;
			this.helloReceived = true;
			this.requests.setSuspensionPhase(hello.snapshot?.suspension?.phase);
			this.clearHandshakeTimer();
			this.connectFailure = void 0;
			this.reconnectSupervisor.reset();
			this.recordTiming("hello", generation, plan);
			const publishHello = () => {
				if (!this.isConnectCurrent(socket, generation)) return;
				this.invoke("hello", () => this.opts.onHello?.(hello));
			};
			const accepted = this.opts.onConnectHello?.(hello, context);
			if (accepted instanceof Promise) return accepted.then(publishHello);
			return publishHello();
		}).catch((error) => {
			if (!this.isActive(socket, generation)) return;
			const requestError = error instanceof GatewayProtocolRequestError ? error : new GatewayProtocolRequestError({ message: String(error) });
			this.connectFailure = { error: requestError };
			const outcome = this.opts.onConnectFailure?.(requestError, context) ?? {
				closeCode: 1008,
				closeReason: "connect failed"
			};
			const applyFailure = (decision) => {
				if (!this.isActive(socket, generation)) return;
				this.connectFailure = {
					error: requestError,
					reconnectDelayMs: decision.reconnectDelayMs
				};
				if (decision.stop) this.stopped = true;
				this.connectionAbort?.abort();
				socket.close(decision.closeCode, decision.closeReason);
			};
			if (outcome instanceof Promise) return outcome.then(applyFailure);
			return applyFailure(outcome);
		}).catch((error) => {
			if (!this.isConnectCurrent(socket, generation)) return;
			this.opts.onConnectError?.(error instanceof Error ? error : new Error(String(error)));
			this.closeSocket(1008, "connect failed");
		});
	}
	handleMessage(socket, generation, raw) {
		if (!this.isActive(socket, generation) || this.connectionAbort?.signal.aborted) return;
		let parsed;
		try {
			parsed = JSON.parse(raw);
		} catch (error) {
			this.opts.onParseError?.(error);
			return;
		}
		if (isGatewayEventFrame(parsed)) {
			this.opts.onActivity?.();
			if (parsed.event === "connect.challenge") {
				const payload = parsed.payload;
				const nonce = typeof payload?.nonce === "string" ? payload.nonce.trim() : "";
				if (!nonce) {
					if (this.opts.handshake.mode === "require-challenge") {
						const error = /* @__PURE__ */ new Error("gateway connect challenge missing nonce");
						this.opts.onConnectError?.(error);
						socket.close(1008, "connect challenge missing nonce");
					}
					return;
				}
				this.connectNonce = nonce;
				this.serverCapabilities = Array.isArray(payload?.capabilities) ? payload.capabilities.filter((value) => typeof value === "string") : [];
				const challengeTs = payload?.ts;
				this.connectChallengeTs = typeof challengeTs === "number" && Number.isSafeInteger(challengeTs) && challengeTs >= 0 ? challengeTs : null;
				this.recordTiming("challenge", generation);
				this.sendConnect(socket, generation);
				return;
			}
			const seq = typeof parsed.seq === "number" ? parsed.seq : null;
			if (seq !== null) {
				if (this.lastSeq !== null && seq > this.lastSeq + 1) {
					const expected = this.lastSeq + 1;
					const state = asRecord(parsed.payload).state;
					if (parsed.event === "chat" && (state === "final" || state === "error" || state === "aborted")) this.dispatchEvent(socket, generation, parsed);
					if (!this.isActive(socket, generation) || this.connectionAbort?.signal.aborted) return;
					this.invoke("gap", () => this.opts.onGap?.({
						expected,
						received: seq
					}));
					if (this.isActive(socket, generation) && !this.connectionAbort?.signal.aborted) this.closeSocket(4e3, "event sequence gap");
					return;
				}
				this.lastSeq = seq;
			}
			this.dispatchEvent(socket, generation, parsed);
			return;
		}
		if (!isGatewayResponseFrame(parsed)) return;
		this.opts.onActivity?.();
		this.requests.handleResponse(parsed);
	}
	dispatchEvent(socket, generation, event) {
		const listeners = this.listeners.snapshot();
		if (event.event === "gateway.suspension" && typeof event.payload === "object" && event.payload !== null && "phase" in event.payload) this.requests.setSuspensionPhase(event.payload.phase);
		this.invoke("event", () => this.opts.onEvent?.(event));
		for (const [listener, subscription] of listeners) {
			if (!this.isActive(socket, generation) || this.connectionAbort?.signal.aborted) return;
			if (this.listeners.isCurrent(listener, subscription)) this.invoke("event listener", () => listener(event));
		}
	}
	handleClose(socket, generation, code, reason) {
		if (this.socket !== socket) {
			if (this.stoppedSocket?.socket === socket) {
				const context = {
					...this.stoppedSocket.context,
					code,
					reason
				};
				this.stoppedSocket = void 0;
				this.invoke("close", () => this.opts.onClose?.(context, {
					retry: false,
					notify: true
				}));
			}
			return;
		}
		this.socket = null;
		this.connectionAbort?.abort();
		this.clearHandshakeTimer();
		const context = {
			...this.closeContext(),
			code,
			reason,
			generation
		};
		this.connectFailure = void 0;
		const decision = this.opts.resolveClose(context);
		this.requests.flush(decision.pendingError ?? context.connectFailure?.error ?? /* @__PURE__ */ new Error(`gateway closed (${code}): ${reason}`));
		this.invoke("close", () => this.opts.onClose?.(context, decision));
		if (decision.retry && !this.stopped && !this.socket && !this.reconnectSignal) {
			const error = context.connectFailure?.error;
			const retryAfterMs = error instanceof GatewayProtocolRequestError && error.retryable && error.retryAfterMs !== void 0 && Number.isFinite(error.retryAfterMs) && error.retryAfterMs > 0 ? error.retryAfterMs : void 0;
			this.scheduleReconnect(decision.reconnectDelayMs ?? context.connectFailure?.reconnectDelayMs, retryAfterMs);
		}
	}
	handleSocketError(socket, generation, error) {
		if (!this.isActive(socket, generation) || this.connectSent) return;
		this.connectFailure = { error };
		this.opts.onConnectError?.(error);
	}
	scheduleReconnect(overrideMs, minimumMs = 0) {
		if (overrideMs !== void 0) this.reconnectSupervisor.nextDelayOverrideMs = overrideMs;
		const retry = this.reconnectSupervisor.next();
		if (!retry) return;
		this.reconnectSignal = retry.signal;
		let delayMs = overrideMs;
		if (delayMs === void 0) {
			const base = Math.max(retry.delayMs, minimumMs);
			const ceiling = Math.max(this.opts.reconnect.maxMs, Math.min(Number.MAX_VALUE, minimumMs * 1.2));
			const lower = Math.max(minimumMs, Math.min(base, ceiling / 1.2));
			const upper = Math.min(base * 1.2, ceiling);
			delayMs = Math.ceil(lower + Math.random() * (upper - lower));
		}
		delayMs = resolveSleepDelayMs(delayMs);
		sleepWithAbort(delayMs, retry.signal).then(() => {
			if (this.reconnectSignal !== retry.signal) return;
			this.reconnectSignal = null;
			this.invoke("reconnect", () => this.connect());
		}, () => {
			if (this.reconnectSignal === retry.signal) this.reconnectSignal = null;
		});
		this.invoke("reconnect scheduled", () => this.opts.onReconnectScheduled?.(delayMs, retry.signal));
	}
	closeContext() {
		return {
			generation: this.generation,
			socketOpened: this.socketOpened,
			helloReceived: this.helloReceived,
			connectRequestSent: this.connectRequestSent,
			connectFailure: this.connectFailure
		};
	}
	isConnectCurrent(socket, generation) {
		return this.isActive(socket, generation) && socket.isOpen() && !this.connectionAbort?.signal.aborted;
	}
	connectAuthority(socket, generation) {
		const signal = this.connectionAbort?.signal;
		if (!signal) throw new Error("gateway connection authority is unavailable");
		return {
			signal,
			assertCurrent: () => {
				signal.throwIfAborted();
				if (!this.isConnectCurrent(socket, generation)) throw new Error("gateway connection retired");
			}
		};
	}
	isActive(socket, generation) {
		return !this.stopped && this.socket === socket && this.generation === generation;
	}
	nowMs() {
		return this.opts.nowMs?.() ?? Date.now();
	}
	clearHandshakeTimer() {
		this.handshakeTimer = clearGatewayConnectTimeout(this.handshakeTimer);
	}
	invoke(label, callback) {
		try {
			callback();
		} catch (error) {
			this.opts.onCallbackError?.(label, error);
		}
	}
};
//#endregion
//#region packages/gateway-client/src/reconnect-policy.ts
const NON_RECOVERABLE_AUTH_ERRORS = /* @__PURE__ */ new Set([
	ConnectErrorDetailCodes.AUTH_TOKEN_MISSING,
	ConnectErrorDetailCodes.AUTH_BOOTSTRAP_TOKEN_INVALID,
	ConnectErrorDetailCodes.AUTH_PASSWORD_MISSING,
	ConnectErrorDetailCodes.AUTH_PASSWORD_MISMATCH,
	ConnectErrorDetailCodes.AUTH_RATE_LIMITED,
	ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH,
	ConnectErrorDetailCodes.AUTH_SCOPE_MISMATCH,
	ConnectErrorDetailCodes.AUTH_IDENTITY_HEADER_REQUIRED,
	ConnectErrorDetailCodes.AUTH_VERIFIED_USER_REQUIRED,
	ConnectErrorDetailCodes.CONTROL_UI_BUILD_MISMATCH,
	ConnectErrorDetailCodes.PAIRING_REQUIRED,
	ConnectErrorDetailCodes.CONTROL_UI_DEVICE_IDENTITY_REQUIRED,
	ConnectErrorDetailCodes.DEVICE_IDENTITY_REQUIRED
]);
function shouldPauseGatewayReconnect(params) {
	const code = readConnectErrorDetailCode(params.details);
	if (!code) return false;
	const pairing = readPairingConnectErrorDetails(params.details);
	if (code === ConnectErrorDetailCodes.PAIRING_REQUIRED && (pairing?.pauseReconnect === false || pairing?.recommendedNextStep === "wait_then_retry")) return false;
	if (code === ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH) return params.tokenMismatchIsTerminal === true && !params.deviceTokenRetryPending;
	if (code === ConnectErrorDetailCodes.AUTH_IDENTITY_HEADER_REQUIRED) return !params.deviceTokenRetryPending;
	return NON_RECOVERABLE_AUTH_ERRORS.has(code) || params.protocolMismatchIsTerminal === true && code === ConnectErrorDetailCodes.PROTOCOL_MISMATCH || params.clientVersionMismatchIsTerminal === true && code === ConnectErrorDetailCodes.CLIENT_VERSION_MISMATCH;
}
//#endregion
//#region packages/gateway-client/src/request-error.ts
var GatewayClientRequestError = class extends GatewayProtocolRequestError {
	constructor(error) {
		super({
			...error,
			message: formatConnectErrorMessage({
				message: error.message,
				details: error.details
			})
		});
		this.name = "GatewayClientRequestError";
	}
};
const GATEWAY_CONNECT_ASSEMBLY_ERROR = Symbol("gateway.connectAssemblyError");
function markGatewayConnectAssemblyError(error) {
	Object.defineProperty(error, GATEWAY_CONNECT_ASSEMBLY_ERROR, {
		configurable: true,
		value: true
	});
	return error;
}
function isGatewayConnectAssemblyError(value) {
	return value instanceof Error && value[GATEWAY_CONNECT_ASSEMBLY_ERROR] === true;
}
//#endregion
//#region packages/gateway-client/src/websocket-data.ts
function rawDataToString(data, encoding = "utf8") {
	if (Array.isArray(data)) return Buffer$1.concat(data).toString(encoding);
	return data instanceof ArrayBuffer ? Buffer$1.from(data).toString(encoding) : data.toString(encoding);
}
//#endregion
//#region packages/gateway-client/src/websocket-transport.ts
const PRIVATE_OR_LOOPBACK_IPV4_RANGES = /* @__PURE__ */ new Set([
	"loopback",
	"private",
	"linkLocal",
	"carrierGradeNat"
]);
const PRIVATE_OR_LOOPBACK_IPV6_RANGES = /* @__PURE__ */ new Set([
	"loopback",
	"linkLocal",
	"uniqueLocal",
	"deprecatedSiteLocal"
]);
function isPrivateOrLoopbackIpAddress(address) {
	return (address.kind() === "ipv4" ? PRIVATE_OR_LOOPBACK_IPV4_RANGES : PRIVATE_OR_LOOPBACK_IPV6_RANGES).has(address.range());
}
function isGatewayLoopbackHost(host) {
	const parsed = parseHostForAddressChecks(host);
	return Boolean(parsed && (parsed.isLocalhost || isLoopbackIpAddress(parsed.unbracketedHost)));
}
function isPrivateOrLoopbackHost(host) {
	const parsed = parseHostForAddressChecks(host);
	if (!parsed) return false;
	if (parsed.isLocalhost) return true;
	const address = parseGatewayIpAddress(parsed.unbracketedHost);
	return Boolean(address && isPrivateOrLoopbackIpAddress(address));
}
function isTrustedPlaintextWebSocketHost(hostname) {
	if (isPrivateOrLoopbackHost(hostname)) return true;
	const normalized = hostname.toLowerCase().trim().replace(/\.+$/, "");
	return normalized.endsWith(".local") || normalized.endsWith(".ts.net");
}
function isSecureWebSocketUrl(rawUrl, options) {
	try {
		const url = new URL(rawUrl);
		const protocol = url.protocol === "https:" ? "wss:" : url.protocol === "http:" ? "ws:" : url.protocol;
		if (protocol === "wss:") return true;
		if (protocol !== "ws:") return false;
		if (isTrustedPlaintextWebSocketHost(url.hostname)) return true;
		if (options?.allowPrivateWs === true) {
			const hostForIpCheck = url.hostname.startsWith("[") && url.hostname.endsWith("]") ? url.hostname.slice(1, -1) : url.hostname;
			return parseGatewayIpAddress(hostForIpCheck) === void 0;
		}
		return false;
	} catch {
		return false;
	}
}
var GatewayWebSocketTransportConfigurationError = class extends Error {};
var GatewayWebSocketTlsPinError = class extends Error {};
function resolveGatewayWebSocketTransport(params) {
	const usesTls = isWssUrl(params.url);
	if (params.tlsFingerprint && !usesTls) throw new GatewayWebSocketTransportConfigurationError("gateway tls fingerprint requires wss:// gateway url");
	const allowPrivateWs = (params.env ?? process.env).OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1";
	if (!isSecureWebSocketUrl(params.url, { allowPrivateWs })) {
		let displayHost = params.url;
		try {
			displayHost = new URL(params.url).hostname || params.url;
		} catch {}
		throw new GatewayWebSocketTransportConfigurationError(`SECURITY ERROR: Cannot connect to "${displayHost}" over plaintext ws://. Both credentials and chat data would be exposed to network interception. Use wss:// for remote URLs. Safe defaults: keep gateway.bind=loopback and connect via SSH tunnel (ssh -N -L 18789:127.0.0.1:18789 user@gateway-host), or use Tailscale Serve/Funnel. ` + (allowPrivateWs ? "" : "Break-glass (trusted private networks only): set OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1. ") + "Run `openclaw doctor --fix` for guidance.");
	}
	const normalize = params.normalizeTlsFingerprint ?? normalizeTlsFingerprint;
	const expectedFingerprint = params.tlsFingerprint ? normalizeTlsFingerprint(params.tlsFingerprint) : void 0;
	if (params.tlsFingerprint && !expectedFingerprint) throw new GatewayWebSocketTransportConfigurationError("gateway tls fingerprint must be a SHA-256 fingerprint");
	const options = { ...params.options };
	if (usesTls && params.tlsServerName) {
		const peerName = params.tlsServerName;
		options.servername = isIP(peerName) ? "" : peerName;
		options.checkServerIdentity = (_hostname, certificate) => checkServerIdentity(peerName, certificate);
	}
	if (usesTls && expectedFingerprint) applyGatewayWebSocketTlsPin(options, expectedFingerprint, normalize);
	return { options };
}
function applyGatewayWebSocketTlsPin(options, expectedFingerprint, normalize = normalizeTlsFingerprint) {
	options.rejectUnauthorized = false;
	const headers = { ...options.headers };
	const deferredHeaders = Object.entries(headers).filter(([key]) => key.toLowerCase() === "expect");
	for (const [key] of deferredHeaders) delete headers[key];
	options.headers = headers;
	options.finishRequest = (request) => {
		request.once("socket", (socket) => {
			if (!(socket instanceof TLSSocket)) {
				request.destroy(new GatewayWebSocketTlsPinError("gateway tls fingerprint unavailable"));
				return;
			}
			const validatePin = () => {
				if (request.destroyed) return;
				const canonicalFingerprint = normalizeTlsFingerprint(socket.getPeerCertificate()?.fingerprint256);
				const fingerprint = canonicalFingerprint ? normalize(canonicalFingerprint) : "";
				if (!fingerprint || fingerprint !== normalize(expectedFingerprint)) {
					request.destroy(new GatewayWebSocketTlsPinError(fingerprint ? "gateway tls fingerprint mismatch" : "gateway tls fingerprint unavailable"));
					return;
				}
				for (const [key, value] of deferredHeaders) if (value !== void 0) request.setHeader(key, value);
				request.end();
			};
			if (socket.secureConnecting) {
				socket.once("secureConnect", validatePin);
				request.once("close", () => socket.off("secureConnect", validatePin));
			} else validatePin();
		});
	};
}
//#endregion
//#region packages/gateway-client/src/websocket.ts
const require = createRequire(import.meta.url);
const wsPackageRoot = path.dirname(require.resolve("ws/package.json"));
const WebSocket = require(path.join(wsPackageRoot, "lib/websocket.js"));
require(path.join(wsPackageRoot, "lib/websocket-server.js"));
require(path.join(wsPackageRoot, "lib/stream.js"));
//#endregion
//#region packages/gateway-client/src/client.ts
const DEFAULT_HOST_DEPS = {
	loadOrCreateDeviceIdentity: () => void 0,
	signDevicePayload: () => {
		throw new Error("GatewayClient device signature dependency is not configured");
	},
	publicKeyRawBase64UrlFromPem: () => {
		throw new Error("GatewayClient public key dependency is not configured");
	},
	loadDeviceAuthToken: () => null,
	storeDeviceAuthToken: () => {},
	clearDeviceAuthToken: () => {},
	beforeConnect: () => {},
	registerGatewayLoopbackBypass: () => void 0,
	logDebug: () => {},
	logError: () => {},
	redactForLog: (message) => message,
	normalizeTlsFingerprint
};
function resolveHostDeps(overrides) {
	return Object.fromEntries(Object.entries(DEFAULT_HOST_DEPS).map(([key, fallback]) => [key, overrides?.[key] ?? fallback]));
}
const DEFAULT_GATEWAY_CLIENT_URL = "ws://127.0.0.1:18789";
const DEFAULT_CLIENT_VERSION = "0.0.0";
var GatewayClientRequestTimeoutError = class extends GatewayProtocolRequestTimeoutError {
	constructor(params) {
		super(params, `gateway request timeout for ${params.method}`);
		this.name = "GatewayClientRequestTimeoutError";
	}
};
var GatewayClientTransportPolicyError = class extends GatewayWebSocketTransportConfigurationError {};
const FORCE_STOP_TERMINATE_GRACE_MS = 250;
const STOP_AND_WAIT_TIMEOUT_MS = 1e3;
const MAX_SUPPRESSED_TRANSIENT_PRE_HELLO_CLEAN_CLOSES = 1;
function resolveLegacyNodePlatform(platform) {
	switch (platform) {
		case "macos": return "darwin";
		case "windows": return "win32";
		default: return;
	}
}
var GatewayClient$1 = class {
	constructor(opts) {
		this.ws = null;
		this.stopped = false;
		this.useLegacyNodeProtocolEnvelope = false;
		this.nodeProtocolTransitionPending = false;
		this.pendingDeviceTokenRetry = false;
		this.deviceTokenRetryBudgetUsed = false;
		this.approvalRuntimeTokenCompatibilityDisabled = false;
		this.approvalRuntimeTokenRetryBudgetUsed = false;
		this.lastTick = null;
		this.tickIntervalMs = 3e4;
		this.tickTimer = null;
		this.pendingStop = null;
		this.transportValidated = false;
		this.suppressedTransientPreHelloCleanCloses = 0;
		this.deps = resolveHostDeps(opts.hostDeps);
		this.deviceAuth = new GatewayClientDeviceAuth(this.deps);
		this.opts = {
			...opts,
			deviceIdentity: opts.deviceIdentity === null ? void 0 : opts.deviceIdentity ?? this.deps.loadOrCreateDeviceIdentity()
		};
		this.requestTimeoutMs = typeof opts.requestTimeoutMs === "number" && Number.isFinite(opts.requestTimeoutMs) ? opts.requestTimeoutMs : DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS;
		const connectChallengeTimeoutMs = resolveConnectChallengeTimeoutMs(this.opts.connectChallengeTimeoutMs, {
			env: this.opts.env,
			configuredTimeoutMs: this.opts.preauthHandshakeTimeoutMs
		});
		this.protocol = new GatewayProtocolClient({
			createSocket: (handlers) => this.createSocket(handlers),
			createRequestId: randomUUID,
			createRequestError: (error) => new GatewayClientRequestError(error),
			createRequestTimeoutError: (method, timeoutMs, requestSent) => new GatewayClientRequestTimeoutError({
				method,
				timeoutMs,
				requestSent
			}),
			createRequestAbortError: createGatewayRequestAbortError$1,
			buildConnectPlan: ({ nonce, challengeTs, serverCapabilities, generation, ...authority }) => {
				if (!nonce) throw new Error("gateway connect challenge missing nonce");
				if (this.opts.deviceIdentity && challengeTs == null) throw new Error("gateway connect challenge timestamp invalid");
				const role = this.opts.role ?? "operator";
				const assemble = (storedAuth) => {
					authority.assertCurrent();
					const assembled = this.assembleConnectParams({
						role,
						nonce,
						signedAtMs: challengeTs ?? Date.now(),
						serverCapabilities,
						storedAuth
					});
					this.connectionStoredToken = {
						generation,
						token: assembled.storedToken ?? null
					};
					return assembled;
				};
				const storedAuth = this.opts.deviceIdentity ? this.deviceAuth.load({
					deviceId: this.opts.deviceIdentity.deviceId,
					role,
					env: this.opts.env,
					...authority
				}) : null;
				return storedAuth instanceof Promise ? storedAuth.then(assemble) : assemble(storedAuth);
			},
			buildConnectParams: (assembled) => assembled.params,
			onConnectPlanError: (error) => {
				this.stopped = true;
				const marked = markGatewayConnectAssemblyError(error);
				const msg = `gateway connect failed: ${formatGatewayClientErrorForLog(error)}`;
				if (this.opts.mode === GATEWAY_CLIENT_MODES.PROBE || isGatewayClientStoppedError(error)) this.logDebug(msg);
				else this.logError(msg);
				return {
					closeCode: 1008,
					closeReason: "connect failed",
					stop: true,
					error: marked
				};
			},
			onConnectHello: (hello, context) => this.handleConnectHello(hello, context.plan, context),
			onHello: (hello) => {
				this.opts.onHelloOk?.(hello);
			},
			onConnectFailure: (error, context) => this.handleConnectRequestFailure(error, context.plan),
			resolveClose: (context) => this.resolveClose(context),
			onClose: (context, decision) => {
				if (this.tickTimer) {
					clearInterval(this.tickTimer);
					this.tickTimer = null;
				}
				if (decision.notify) this.opts.onClose?.(context.code, context.reason, this.closeInfo(context));
			},
			notifyStoppedClose: true,
			onConnectError: (error) => this.notifyConnectError(error),
			onReconnectStopped: (error) => this.notifyReconnectPaused({
				code: 1008,
				reason: error.message,
				detailCode: null
			}),
			onParseError: (error) => this.logDebug(`gateway client parse error: ${formatGatewayClientErrorForLog(error)}`),
			onEvent: (event) => this.opts.onEvent?.(event),
			onGap: (info) => this.opts.onGap?.(info),
			onRequestTiming: (timing) => this.opts.onRequestTiming?.(timing),
			onActivity: () => {
				this.lastTick = Date.now();
			},
			onCallbackError: (label, error) => this.logDebug(`gateway client ${label === "hello" ? "hello-ok" : label === "gap" ? "event" : label} handler error: ${formatGatewayClientErrorForLog(error)}`),
			handshake: {
				mode: "require-challenge",
				timeoutMs: connectChallengeTimeoutMs,
				timeoutMessage: (elapsedMs) => `gateway connect challenge timeout (waited ${elapsedMs}ms, limit ${connectChallengeTimeoutMs}ms)`
			},
			reconnect: {
				initialMs: 1e3,
				multiplier: 2,
				maxMs: 3e4
			},
			requestTimeoutMs: this.requestTimeoutMs,
			shouldRetrySocketFactoryError: (error) => !(error instanceof GatewayWebSocketTransportConfigurationError) && !(error instanceof SyntaxError) && !(error instanceof TypeError) && !(error instanceof RangeError),
			rethrowSocketFactoryError: (error) => error instanceof GatewayClientTransportPolicyError
		});
	}
	/** Current transport state, including CLOSING before the close callback fires.
	* This is not authentication or readiness evidence on its own. */
	get connected() {
		return !this.stopped && this.protocol.connected;
	}
	getConnectionMetadata() {
		return {
			clientName: this.opts.clientName,
			hasDeviceIdentity: Boolean(this.opts.deviceIdentity),
			mode: this.opts.mode,
			preauthHandshakeTimeoutMs: this.opts.preauthHandshakeTimeoutMs
		};
	}
	updateNodeManifest(manifest) {
		this.opts = {
			...this.opts,
			caps: [...manifest.caps],
			commands: [...manifest.commands],
			computerUse: manifest.computerUse === void 0 ? void 0 : structuredClone(manifest.computerUse),
			workerRuns: manifest.workerRuns ? structuredClone(manifest.workerRuns) : void 0
		};
		if (!this.stopped) this.protocol.closeSocket(1012, "node manifest changed");
	}
	start() {
		if (this.stopped) return;
		this.protocol.start();
	}
	createSocket(handlers) {
		const url = this.opts.url ?? DEFAULT_GATEWAY_CLIENT_URL;
		const configuredEdgeAuthHeaders = this.opts.edgeAuthHeaders;
		const edgeAuthHeaders = configuredEdgeAuthHeaders && Object.keys(configuredEdgeAuthHeaders).length > 0 ? configuredEdgeAuthHeaders : void 0;
		if (edgeAuthHeaders && new URL(url).protocol !== "wss:") throw new GatewayWebSocketTransportConfigurationError("edge auth headers require a wss:// Gateway URL");
		const handshakeTimeoutMs = resolvePreauthHandshakeTimeoutMs({
			env: this.opts.env,
			configuredTimeoutMs: this.opts.preauthHandshakeTimeoutMs
		});
		const transport = resolveGatewayWebSocketTransport({
			url,
			tlsFingerprint: this.opts.tlsFingerprint,
			tlsServerName: this.opts.tlsServerName,
			env: this.opts.env,
			normalizeTlsFingerprint: this.deps.normalizeTlsFingerprint,
			options: {
				maxPayload: 26214400,
				handshakeTimeout: handshakeTimeoutMs,
				...this.opts.origin ? { origin: this.opts.origin } : {},
				...edgeAuthHeaders ? {
					followRedirects: false,
					headers: edgeAuthHeaders
				} : {}
			}
		});
		this.deps.beforeConnect();
		let ws;
		let unregisterGatewayLoopbackBypass;
		try {
			unregisterGatewayLoopbackBypass = this.deps.registerGatewayLoopbackBypass(url);
		} catch (error) {
			throw new GatewayClientTransportPolicyError(error instanceof Error ? error.message : String(error));
		}
		try {
			ws = new WebSocket(url, transport.options);
			ws.binaryType = "nodebuffer";
		} catch (error) {
			throw error instanceof Error ? error : new Error(String(error));
		} finally {
			unregisterGatewayLoopbackBypass?.();
		}
		this.ws = ws;
		this.transportValidated = false;
		let upgradeError;
		ws.on("open", () => {
			this.transportValidated = true;
			handlers.open();
		});
		ws.on("message", (data) => handlers.message(rawDataToString(data)));
		ws.on("close", (code, reason) => {
			const reasonText = reason.toString();
			if (this.ws === ws) this.ws = null;
			this.resolvePendingStop(ws);
			handlers.close(code, reasonText);
		});
		ws.on("unexpected-response", (request, response) => {
			readUpgradeErrorBody(response).then((body) => {
				const statusCode = response.statusCode;
				let gatewayError;
				try {
					const parsed = JSON.parse(body);
					const parsedError = isRecord(parsed) ? parsed.error : void 0;
					gatewayError = isRecord(parsedError) ? parsedError : void 0;
				} catch {}
				const rawLocation = response.headers.location;
				const location = rawLocation ? redactSensitiveUrlLikeString(Array.isArray(rawLocation) ? rawLocation[0] ?? "" : rawLocation) : void 0;
				upgradeError = new GatewayClientRequestError({
					code: "UNAVAILABLE",
					message: `gateway rejected websocket upgrade (HTTP ${statusCode ?? "unknown"})${body ? `: ${body}` : ""}`,
					retryable: true,
					details: {
						reason: "websocket-upgrade-rejected",
						...statusCode === void 0 ? {} : { httpStatus: statusCode },
						...location ? { location } : {},
						...typeof gatewayError?.type === "string" ? {
							gatewayErrorType: gatewayError.type,
							...typeof gatewayError.message === "string" ? { gatewayErrorMessage: gatewayError.message } : {}
						} : {}
					}
				});
				handlers.error(upgradeError);
				request.destroy();
				ws.close();
			});
		});
		ws.on("error", (err) => {
			if (upgradeError) return;
			if (err.message === "Opening handshake has timed out") Object.assign(err, { code: "ETIMEDOUT" });
			this.logDebug(`gateway client error: ${formatGatewayClientErrorForLog(err)}`);
			handlers.error(err instanceof Error ? err : new Error(String(err)));
		});
		return {
			isOpen: () => ws.readyState === WebSocket.OPEN,
			send: (data) => ws.send(data),
			close: (code, reason) => ws.close(code, reason)
		};
	}
	stop() {
		this.beginStop();
	}
	async stopAndWait(opts) {
		const stopPromise = this.beginStop();
		const timeoutMs = opts?.timeoutMs === void 0 ? STOP_AND_WAIT_TIMEOUT_MS : resolveSafeTimeoutDelayMs(opts.timeoutMs);
		try {
			await raceWithTimeout(Promise.resolve(stopPromise), timeoutMs, () => {
				throw new Error(`gateway client stop timed out after ${timeoutMs}ms`);
			}, { ref: false });
		} finally {
			await this.deviceAuth.drain();
		}
	}
	beginStop() {
		this.stopped = true;
		this.pendingDeviceTokenRetry = false;
		this.deviceTokenRetryBudgetUsed = false;
		if (this.tickTimer) {
			clearInterval(this.tickTimer);
			this.tickTimer = null;
		}
		if (this.pendingStop) return this.pendingStop.promise;
		const ws = this.ws;
		this.ws = null;
		if (ws) {
			const pendingStop = this.createPendingStop(ws);
			const forceTerminateTimer = setTimeout(() => {
				try {
					ws.terminate();
				} finally {
					this.resolvePendingStop(ws);
				}
			}, FORCE_STOP_TERMINATE_GRACE_MS);
			forceTerminateTimer.unref?.();
			pendingStop.terminateTimer = forceTerminateTimer;
			if (this.protocol.connecting) {
				const error = /* @__PURE__ */ new Error("gateway client stopped");
				this.notifyConnectError(error);
				this.logDebug(`gateway connect failed: ${formatGatewayClientErrorForLog(error)}`);
			}
			this.protocol.stop();
			return pendingStop.promise;
		}
		this.protocol.stop();
		return null;
	}
	createPendingStop(ws) {
		let resolve = () => {};
		const promise = new Promise((done) => {
			resolve = done;
		});
		this.pendingStop = {
			ws,
			promise,
			resolve
		};
		return this.pendingStop;
	}
	resolvePendingStop(ws) {
		if (this.pendingStop?.ws !== ws) return;
		const { resolve, terminateTimer } = this.pendingStop;
		if (terminateTimer) clearTimeout(terminateTimer);
		this.pendingStop = null;
		resolve();
	}
	logDebug(message) {
		this.deps.logDebug(this.deps.redactForLog(message));
	}
	logError(message) {
		this.deps.logError(this.deps.redactForLog(message));
	}
	assembleConnectParams(params) {
		const { role, nonce, signedAtMs } = params;
		const selectedAuth = this.selectConnectAuth(params.storedAuth);
		const { authDeviceToken, authApprovalRuntimeToken, authAgentRuntimeIdentityToken, signatureToken, resolvedDeviceToken, storedToken, storedScopes, usingStoredDeviceToken } = selectedAuth;
		if (this.pendingDeviceTokenRetry && authDeviceToken) this.pendingDeviceTokenRetry = false;
		const auth = buildGatewayConnectAuth(selectedAuth);
		const scopes = resolveGatewayConnectScopes({
			requestedScopes: this.opts.scopes,
			usingStoredDeviceToken,
			storedScopes,
			defaultScopes: ["operator.admin"]
		});
		const clientMode = this.opts.mode ?? GATEWAY_CLIENT_MODES.BACKEND;
		const clientId = this.opts.clientName ?? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT;
		const isBuiltInNodeHost = role === "node" && clientMode === GATEWAY_CLIENT_MODES.NODE && clientId === GATEWAY_CLIENT_NAMES.NODE_HOST;
		const negotiatesNodeProtocol = this.shouldNegotiateLegacyNodeProtocol();
		const useLegacyNodeProtocolEnvelope = isBuiltInNodeHost && (this.useLegacyNodeProtocolEnvelope || this.opts.maxProtocol === 3 && (this.opts.minProtocol ?? 3) <= 3);
		const minProtocol = useLegacyNodeProtocolEnvelope ? 3 : negotiatesNodeProtocol ? 4 : this.opts.minProtocol ?? (clientMode === GATEWAY_CLIENT_MODES.PROBE ? 3 : role === "node" && clientMode === GATEWAY_CLIENT_MODES.NODE ? 3 : 4);
		const maxProtocol = useLegacyNodeProtocolEnvelope ? 3 : negotiatesNodeProtocol ? 4 : this.opts.maxProtocol ?? 4;
		const configuredPlatform = this.opts.platform ?? process.platform;
		const platform = useLegacyNodeProtocolEnvelope ? resolveLegacyNodePlatform(configuredPlatform) ?? configuredPlatform : configuredPlatform;
		const deviceFamily = useLegacyNodeProtocolEnvelope ? void 0 : this.opts.deviceFamily;
		return {
			params: {
				minProtocol,
				maxProtocol,
				client: {
					id: clientId,
					displayName: this.opts.clientDisplayName,
					version: this.opts.clientVersion ?? DEFAULT_CLIENT_VERSION,
					buildId: this.opts.clientBuildId,
					platform,
					deviceFamily,
					modelIdentifier: useLegacyNodeProtocolEnvelope ? void 0 : this.opts.modelIdentifier,
					mode: clientMode,
					instanceId: this.opts.instanceId
				},
				...resolveModelCatalogConnect({
					caps: Array.isArray(this.opts.caps) ? this.opts.caps : [],
					modelCatalog: useLegacyNodeProtocolEnvelope ? void 0 : this.opts.modelCatalog,
					serverCapabilities: params.serverCapabilities
				}),
				commands: Array.isArray(this.opts.commands) ? this.opts.commands : void 0,
				computerUse: useLegacyNodeProtocolEnvelope ? void 0 : this.opts.computerUse,
				workerRuns: useLegacyNodeProtocolEnvelope ? void 0 : this.opts.workerRuns,
				permissions: this.opts.permissions && typeof this.opts.permissions === "object" ? this.opts.permissions : void 0,
				pathEnv: this.opts.pathEnv,
				auth,
				role,
				scopes,
				device: this.buildDeviceConnectParams({
					nonce,
					role,
					scopes,
					signatureToken,
					signedAtMs,
					platform,
					deviceFamily,
					clientMode
				})
			},
			authApprovalRuntimeToken,
			authAgentRuntimeIdentityToken,
			resolvedDeviceToken,
			storedScopes,
			storedToken,
			usingStoredDeviceToken
		};
	}
	shouldNegotiateLegacyNodeProtocol() {
		if (this.opts.role !== "node" || this.opts.mode !== GATEWAY_CLIENT_MODES.NODE || this.opts.clientName !== GATEWAY_CLIENT_NAMES.NODE_HOST) return false;
		return (this.opts.minProtocol ?? 3) === 3 && (this.opts.maxProtocol ?? 4) === 4;
	}
	shouldRetryWithAlternateNodeProtocol(error) {
		if (!this.shouldNegotiateLegacyNodeProtocol() || !(error instanceof GatewayClientRequestError)) return false;
		const detailCode = readConnectErrorDetailCode(error.details);
		return error.details?.expectedProtocol === (this.useLegacyNodeProtocolEnvelope ? 4 : 3) && (detailCode === ConnectErrorDetailCodes.PROTOCOL_MISMATCH || normalizeGatewayErrorText(error.message).includes("protocol mismatch"));
	}
	buildDeviceConnectParams(params) {
		if (!this.opts.deviceIdentity) return;
		const { nonce, role, scopes, signatureToken, signedAtMs, platform, deviceFamily, clientMode } = params;
		const payload = buildDeviceAuthPayloadV3({
			deviceId: this.opts.deviceIdentity.deviceId,
			clientId: this.opts.clientName ?? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
			clientMode,
			role,
			scopes,
			signedAtMs,
			token: signatureToken ?? null,
			nonce,
			platform,
			deviceFamily
		});
		const signature = this.deps.signDevicePayload(this.opts.deviceIdentity.privateKeyPem, payload);
		return {
			id: this.opts.deviceIdentity.deviceId,
			publicKey: this.deps.publicKeyRawBase64UrlFromPem(this.opts.deviceIdentity.publicKeyPem),
			signature,
			signedAt: signedAtMs,
			nonce
		};
	}
	handleConnectHello(helloOk, assembled, authority) {
		authority.assertCurrent();
		const role = this.opts.role ?? "operator";
		const authInfo = helloOk.auth;
		const observation = this.connectionStoredToken;
		const persisted = () => {
			if (authInfo?.deviceToken && (authInfo.role ?? role) === role && observation) observation.token = authInfo.deviceToken;
			if (this.opts.preferBootstrapToken) {
				this.opts.token = void 0;
				this.opts.bootstrapToken = void 0;
				this.opts.password = void 0;
				this.opts.preferBootstrapToken = false;
			}
		};
		let stored = void 0;
		if (authInfo?.deviceToken && this.opts.deviceIdentity) {
			const tokenRole = authInfo.role ?? role;
			const scopes = tokenRole === role && authInfo.deviceToken === assembled.storedToken ? assembled.storedScopes ?? authInfo.scopes ?? [] : authInfo.scopes ?? [];
			if (tokenRole === role && observation) observation.receiptToken = authInfo.deviceToken;
			stored = this.deviceAuth.store({
				deviceId: this.opts.deviceIdentity.deviceId,
				role: tokenRole,
				token: authInfo.deviceToken,
				scopes,
				env: this.opts.env,
				...tokenRole === role ? { expectedToken: assembled.storedToken ?? null } : {}
			}, persisted, (error) => {
				assembled.persistenceFailed = true;
				const reported = this.notifyConnectError(error);
				this.logError(`gateway device token persistence failed: ${formatGatewayClientErrorForLog(error)}`);
				return reported;
			});
			if (observation && stored instanceof Promise) observation.persistence = stored;
		} else persisted();
		const complete = () => {
			if (authority.signal.aborted || !this.protocol.connected) return;
			authority.assertCurrent();
			this.completeConnectHello(helloOk);
		};
		return stored instanceof Promise ? stored.then(complete) : complete();
	}
	completeConnectHello(helloOk) {
		const reconnectWithCurrentNodeProtocol = this.useLegacyNodeProtocolEnvelope && this.shouldNegotiateLegacyNodeProtocol() && helloOk.protocol > 3;
		if (reconnectWithCurrentNodeProtocol) this.useLegacyNodeProtocolEnvelope = false;
		this.nodeProtocolTransitionPending = false;
		this.pendingDeviceTokenRetry = false;
		this.deviceTokenRetryBudgetUsed = false;
		this.suppressedTransientPreHelloCleanCloses = 0;
		this.tickIntervalMs = typeof helloOk.policy?.tickIntervalMs === "number" ? helloOk.policy.tickIntervalMs : 3e4;
		if (reconnectWithCurrentNodeProtocol) {
			this.protocol.resetReconnectBackoff(250);
			this.protocol.closeSocket(1012, "gateway protocol upgraded");
			return;
		}
		this.lastTick = Date.now();
		this.startTickWatch();
	}
	handleConnectRequestFailure(error, assembled) {
		if (assembled.persistenceFailed) return {
			closeCode: 1008,
			closeReason: "connect failed"
		};
		const detailCode = error instanceof GatewayClientRequestError ? readConnectErrorDetailCode(error.details) : null;
		const cleared = this.opts.deviceIdentity && assembled.usingStoredDeviceToken && detailCode === ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH ? this.clearDeviceToken(this.opts.deviceIdentity.deviceId, { token: assembled.storedToken }) : void 0;
		const decision = this.resolveConnectRequestFailure(error, assembled);
		return cleared instanceof Promise ? cleared.then(() => decision) : decision;
	}
	resolveConnectRequestFailure(error, assembled) {
		if (this.shouldRetryWithAlternateNodeProtocol(error)) {
			const resetBackoff = !this.nodeProtocolTransitionPending;
			this.useLegacyNodeProtocolEnvelope = !this.useLegacyNodeProtocolEnvelope;
			this.nodeProtocolTransitionPending = true;
			if (resetBackoff) this.protocol.resetReconnectBackoff(250);
			this.logDebug(this.useLegacyNodeProtocolEnvelope ? "gateway rejected protocol v4; retrying node host with protocol v3" : "gateway rejected protocol v3; retrying node host with protocol v4");
			return {
				closeCode: 1008,
				closeReason: "connect retry"
			};
		}
		this.nodeProtocolTransitionPending = false;
		const detailCode = error instanceof GatewayClientRequestError ? readConnectErrorDetailCode(error.details) : null;
		if (shouldRetryGatewayWithDeviceToken({
			retryBudgetUsed: this.deviceTokenRetryBudgetUsed,
			currentDeviceToken: assembled.resolvedDeviceToken,
			explicitToken: this.opts.token?.trim() || void 0,
			storedToken: assembled.storedToken,
			trustedEndpoint: this.isTrustedDeviceRetryEndpoint(),
			errorDetails: error instanceof GatewayClientRequestError ? error.details : void 0
		})) {
			this.pendingDeviceTokenRetry = true;
			this.deviceTokenRetryBudgetUsed = true;
			this.protocol.resetReconnectBackoff(250);
		}
		const startupRetryAfterMs = resolveGatewayStartupRetryAfterMs(error);
		if (startupRetryAfterMs !== null) {
			this.logDebug(`gateway connect failed: ${formatGatewayClientErrorForLog(error)}`);
			return {
				closeCode: 1013,
				closeReason: "gateway starting",
				reconnectDelayMs: startupRetryAfterMs
			};
		}
		if (assembled.authAgentRuntimeIdentityToken && this.isUnsupportedConnectAuthField(error, "agentruntimeidentitytoken")) {
			const unsupportedIdentityError = /* @__PURE__ */ new Error("gateway rejected required agent runtime identity auth field; refusing to retry without it");
			this.stopped = true;
			this.notifyConnectError(unsupportedIdentityError);
			this.logError(`gateway connect failed: ${unsupportedIdentityError.message}`);
			return {
				closeCode: 1008,
				closeReason: "connect failed",
				stop: true
			};
		}
		if (!this.approvalRuntimeTokenRetryBudgetUsed && assembled.authApprovalRuntimeToken && this.isUnsupportedConnectAuthField(error, "approvalruntimetoken")) {
			this.approvalRuntimeTokenCompatibilityDisabled = true;
			this.approvalRuntimeTokenRetryBudgetUsed = true;
			this.protocol.resetReconnectBackoff(250);
			this.logDebug("gateway rejected approval runtime auth field; retrying without it");
			return {
				closeCode: 1008,
				closeReason: "connect retry"
			};
		}
		this.notifyConnectError(error);
		const message = `gateway connect failed: ${formatGatewayClientErrorForLog(error)}`;
		if (this.opts.mode === GATEWAY_CLIENT_MODES.PROBE || isGatewayClientStoppedError(error) || detailCode === ConnectErrorDetailCodes.AUTH_RATE_LIMITED) this.logDebug(message);
		else this.logError(message);
		return {
			closeCode: 1008,
			closeReason: "connect failed"
		};
	}
	resolveClose(context) {
		const info = this.closeInfo(context);
		const detailCode = context.connectFailure?.error instanceof GatewayClientRequestError ? readConnectErrorDetailCode(context.connectFailure.error.details) : null;
		const details = context.connectFailure?.error instanceof GatewayClientRequestError ? context.connectFailure.error.details : void 0;
		if (context.code === 1013 && context.connectFailure?.reconnectDelayMs !== void 0) return {
			retry: true,
			notify: this.opts.notifyOnStartupRetry === true,
			reconnectDelayMs: context.connectFailure.reconnectDelayMs
		};
		if (info.transientPreHelloCleanClose && this.suppressedTransientPreHelloCleanCloses < MAX_SUPPRESSED_TRANSIENT_PRE_HELLO_CLEAN_CLOSES) {
			this.suppressedTransientPreHelloCleanCloses += 1;
			return {
				retry: true,
				notify: true,
				pendingError: /* @__PURE__ */ new Error("gateway transient pre-hello clean close")
			};
		}
		if (info.transientPreHelloCleanClose || context.connectRequestSent && !context.helloReceived && !context.connectFailure) {
			const error = /* @__PURE__ */ new Error(`gateway closed (${context.code}): ${context.reason}`);
			this.notifyConnectError(error);
			this.logError(`gateway connect failed: ${formatGatewayClientErrorForLog(error)}`);
		}
		this.clearStaleDeviceTokenForClose(context);
		if (shouldPauseGatewayReconnect({
			details,
			deviceTokenRetryPending: this.pendingDeviceTokenRetry,
			tokenMismatchIsTerminal: true,
			protocolMismatchIsTerminal: !this.nodeProtocolTransitionPending,
			clientVersionMismatchIsTerminal: true
		})) {
			this.notifyReconnectPaused({
				code: context.code,
				reason: context.reason,
				detailCode
			});
			return {
				retry: false,
				notify: true
			};
		}
		return {
			retry: true,
			notify: true,
			reconnectDelayMs: context.connectFailure?.reconnectDelayMs
		};
	}
	closeInfo(context) {
		return {
			phase: context.helloReceived ? "post-hello" : "pre-hello",
			socketOpened: context.socketOpened,
			transportValidated: this.transportValidated,
			connectRequestSent: context.connectRequestSent,
			transientPreHelloCleanClose: !context.helloReceived && context.code === 1e3 && context.reason === "",
			...context.connectFailure?.error ? { connectError: context.connectFailure.error } : {}
		};
	}
	clearStaleDeviceTokenForClose(context) {
		const { code, reason, generation } = context;
		if (code !== 1008 || !normalizeGatewayErrorText(reason).includes("device token mismatch") || !this.opts.deviceIdentity) return;
		const observation = this.connectionStoredToken?.generation === generation ? this.connectionStoredToken : { token: void 0 };
		this.clearDeviceToken(this.opts.deviceIdentity.deviceId, observation, () => !this.opts.token && !this.opts.password);
	}
	clearDeviceToken(deviceId, observation, canClear = () => true) {
		const failed = (error) => {
			this.logDebug(`failed clearing stale device-auth token for device ${deviceId}: ${String(error)}`);
		};
		const cleared = () => this.logDebug(`cleared stale device-auth token for device ${deviceId}`);
		try {
			const result = this.deviceAuth.clear({
				deviceId,
				role: this.opts.role ?? "operator",
				env: this.opts.env,
				assertCurrent: () => {
					if (this.stopped) throw new Error("gateway client stopped");
				}
			}, observation, canClear);
			return result instanceof Promise ? result.then(cleared, failed) : cleared();
		} catch (error) {
			failed(error);
		}
	}
	notifyConnectError(error) {
		if (!this.opts.onConnectError) return false;
		try {
			this.opts.onConnectError(error);
			return true;
		} catch (err) {
			this.logDebug(`gateway client connect error handler error: ${formatGatewayClientErrorForLog(err)}`);
			return false;
		}
	}
	notifyReconnectPaused(info) {
		try {
			this.opts.onReconnectPaused?.(info);
		} catch (err) {
			this.logDebug(`gateway client reconnect paused handler error: ${formatGatewayClientErrorForLog(err)}`);
		}
	}
	isUnsupportedConnectAuthField(error, field) {
		if (!(error instanceof GatewayClientRequestError) || error.gatewayCode !== "INVALID_REQUEST") return false;
		const message = normalizeGatewayErrorText(error.message);
		return message.includes("invalid connect params") && message.includes(field);
	}
	isTrustedDeviceRetryEndpoint() {
		const rawUrl = this.opts.url ?? "ws://127.0.0.1:18789";
		try {
			const parsed = new URL(rawUrl);
			const protocol = parsed.protocol === "https:" ? "wss:" : parsed.protocol === "http:" ? "ws:" : parsed.protocol;
			if (isGatewayLoopbackHost(parsed.hostname)) return true;
			return protocol === "wss:" && Boolean(this.opts.tlsFingerprint?.trim());
		} catch {
			return false;
		}
	}
	selectConnectAuth(storedAuth) {
		return selectGatewayConnectAuth({
			token: this.opts.token,
			bootstrapToken: this.opts.bootstrapToken,
			preferBootstrapToken: this.opts.preferBootstrapToken,
			deviceToken: this.opts.deviceToken,
			password: this.opts.password,
			approvalRuntimeToken: this.approvalRuntimeTokenCompatibilityDisabled ? void 0 : this.opts.approvalRuntimeToken,
			agentRuntimeIdentityToken: this.opts.agentRuntimeIdentityToken,
			storedToken: storedAuth?.token,
			storedScopes: storedAuth?.scopes,
			pendingDeviceTokenRetry: this.pendingDeviceTokenRetry,
			trustedDeviceTokenRetry: this.isTrustedDeviceRetryEndpoint()
		});
	}
	startTickWatch() {
		if (this.tickTimer) clearInterval(this.tickTimer);
		const rawMinInterval = this.opts.tickWatchMinIntervalMs;
		const minInterval = typeof rawMinInterval === "number" && Number.isFinite(rawMinInterval) ? Math.max(1, Math.min(3e4, rawMinInterval)) : 1e3;
		const interval = resolveSafeTimeoutDelayMs(Math.max(this.tickIntervalMs, minInterval));
		this.tickTimer = setInterval(() => {
			if (this.stopped) return;
			if (!this.lastTick) return;
			if (this.protocol.hasPendingRequests && !this.protocol.hasUnboundedPendingRequests) return;
			const gap = Date.now() - this.lastTick;
			const rawTimeoutMs = this.opts.tickWatchTimeoutMs;
			if (gap > (typeof rawTimeoutMs === "number" && Number.isFinite(rawTimeoutMs) ? Math.max(1, rawTimeoutMs) : this.tickIntervalMs * 2)) this.protocol.closeSocket(4e3, "tick timeout");
		}, interval);
	}
	async request(method, params, opts) {
		const expectFinal = opts?.expectFinal === true;
		const timeoutMs = opts?.timeoutMs === null ? null : typeof opts?.timeoutMs === "number" && Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : expectFinal ? null : this.requestTimeoutMs;
		return this.protocol.request(method, params, {
			expectFinal,
			timeoutMs,
			signal: opts?.signal,
			onSent: opts?.onSent,
			onAccepted: opts?.onAccepted
		});
	}
};
function createGatewayRequestAbortError$1(method) {
	const err = /* @__PURE__ */ new Error(`gateway request aborted for ${method}`);
	err.name = "AbortError";
	return err;
}
//#endregion
//#region src/infra/net/proxyline-runtime.ts
function loadProxyline() {
	return createRequire(import.meta.url)("@openclaw/proxyline");
}
//#endregion
//#region src/infra/net/proxy/proxy-lifecycle.ts
const PROXY_ENV_KEYS = [
	"http_proxy",
	"https_proxy",
	"HTTP_PROXY",
	"HTTPS_PROXY"
];
const NO_PROXY_ENV_KEYS = ["no_proxy", "NO_PROXY"];
const LOOPBACK_NO_PROXY = "127.0.0.1,localhost,localhost.,::1,[::1],127.0.0.0/8";
const managedLoopbackBypassPolicy = ({ url }) => getActiveManagedProxyLoopbackMode() === "gateway-only" && isLoopbackProxyUrl(url);
const PROXY_ACTIVE_KEYS = [
	"OPENCLAW_PROXY_ACTIVE",
	"OPENCLAW_PROXY_LOOPBACK_MODE",
	"OPENCLAW_PROXY_CA_FILE"
];
[
	...PROXY_ENV_KEYS,
	...NO_PROXY_ENV_KEYS,
	...PROXY_ACTIVE_KEYS
];
const MANAGED_PROXY_UNDICI_OPTIONS = Object.freeze({ allowH2: false });
function applyProxyEnv(proxyUrl, loopbackMode, proxyCaFile) {
	for (const key of PROXY_ENV_KEYS) process.env[key] = proxyUrl;
	process.env["OPENCLAW_PROXY_ACTIVE"] = "1";
	process.env["OPENCLAW_PROXY_LOOPBACK_MODE"] = loopbackMode;
	if (proxyCaFile) process.env["OPENCLAW_PROXY_CA_FILE"] = proxyCaFile;
	else delete process.env["OPENCLAW_PROXY_CA_FILE"];
	for (const key of NO_PROXY_ENV_KEYS) process.env[key] = loopbackMode === "gateway-only" ? LOOPBACK_NO_PROXY : "";
}
/** Reinstalls Proxyline routing in child processes that inherited active proxy env. */
function ensureInheritedManagedProxyRoutingActive() {
	if (process.env["OPENCLAW_PROXY_ACTIVE"] !== "1") return;
	const proxyUrl = process.env["HTTP_PROXY"];
	if (!proxyUrl || !isHttpUrl(proxyUrl)) return;
	const proxyCaFile = resolveManagedProxyCaFileForUrl({
		proxyUrl,
		caFileOverride: process.env["OPENCLAW_PROXY_CA_FILE"]
	});
	const proxyTls = loadManagedProxyTlsOptionsSync(proxyCaFile);
	applyProxyEnv(proxyUrl, getActiveManagedProxyLoopbackMode() ?? "gateway-only", proxyCaFile);
	loadProxyline().installGlobalProxy({
		mode: "managed",
		proxyUrl,
		...proxyTls ? { proxyTls } : {},
		ifActive: "reuse-compatible",
		bypassPolicy: managedLoopbackBypassPolicy,
		undici: MANAGED_PROXY_UNDICI_OPTIONS
	});
	forceResetGlobalDispatcher({ preserveProxylineManaged: true });
}
function isLoopbackProxyUrl(value) {
	try {
		const url = new URL(value);
		const hostname = url.hostname.toLowerCase().replace(/\.+$/, "");
		return (isHttpUrl(url) || isWebSocketUrl(url)) && (hostname === "localhost" || isLoopbackIpAddress(hostname));
	} catch {
		return false;
	}
}
function assertManagedProxyAllowsLoopback(url, surface) {
	if (isLoopbackProxyUrl(url) && getActiveManagedProxyLoopbackMode() === "block") throw new Error(`proxy: ${surface} connections are blocked by proxy.loopbackMode; run openclaw config set proxy.loopbackMode gateway-only to allow local runtime traffic.`);
}
function registerManagedProxyGatewayLoopbackBypass(url) {
	assertManagedProxyAllowsLoopback(url, "Gateway loopback control-plane");
}
//#endregion
//#region src/shared/gateway-client-platform.ts
function resolveGatewayClientPlatformIdentity(platform) {
	switch (platform) {
		case "darwin": return {
			platform: "macos",
			deviceFamily: "Mac"
		};
		case "win32": return {
			platform: "windows",
			deviceFamily: "Windows"
		};
		case "linux": return {
			platform,
			deviceFamily: "Linux"
		};
		default: return { platform };
	}
}
//#endregion
//#region src/gateway/client.ts
function createOpenClawGatewayClientHostDeps(overrides, deviceAuthScope, suppressStoredDeviceAuth = false, sharedStateMode, preparedDeviceAuth) {
	const readOnly = sharedStateMode === "read-only";
	const rotationFence = preparedDeviceAuth ? { expectedToken: preparedDeviceAuth.token } : void 0;
	let tokenObservation;
	const observe = (params) => {
		const deviceId = params.deviceId;
		const role = normalizeDeviceAuthRole(params.role);
		return (snapshot) => {
			tokenObservation = {
				deviceId,
				role,
				expectedToken: snapshot.expectedToken
			};
		};
	};
	const observedFor = (params) => tokenObservation?.deviceId === params.deviceId && tokenObservation.role === normalizeDeviceAuthRole(params.role) ? tokenObservation : void 0;
	const writeFence = (params) => {
		if (rotationFence) return rotationFence;
		const observed = observedFor(params);
		return observed ? { expectedToken: observed.expectedToken } : void 0;
	};
	const clearFence = (params) => {
		const expectedToken = rotationFence?.expectedToken ?? params.expectedToken;
		const raw = observedFor(params)?.expectedToken;
		return {
			...rotationFence,
			...typeof raw === "string" && raw !== expectedToken && raw.trim() === expectedToken ? { observedToken: raw } : {}
		};
	};
	const deviceAuthDeps = deviceAuthScope ? {
		loadDeviceAuthToken: async (params) => {
			if (readOnly) return suppressStoredDeviceAuth ? null : loadOriginDeviceTokenReadOnly({
				...params,
				gatewayScope: deviceAuthScope
			});
			const load = await loadOriginDeviceToken({
				...params,
				gatewayScope: deviceAuthScope,
				onSnapshot: observe(params)
			});
			return suppressStoredDeviceAuth ? null : load;
		},
		storeDeviceAuthToken: readOnly ? () => {} : (params) => storeOriginDeviceToken({
			...params,
			gatewayScope: deviceAuthScope,
			...writeFence(params)
		}),
		clearDeviceAuthToken: readOnly ? () => {} : (params) => clearOriginDeviceToken({
			...params,
			gatewayScope: deviceAuthScope,
			...clearFence(params)
		})
	} : readOnly ? {
		loadDeviceAuthToken: suppressStoredDeviceAuth ? () => null : loadDeviceAuthTokenReadOnly,
		storeDeviceAuthToken: () => {},
		clearDeviceAuthToken: () => {}
	} : {
		loadDeviceAuthToken: (params) => loadDeviceAuthToken({
			...params,
			onSnapshot: observe(params)
		}),
		storeDeviceAuthToken: (params) => storeDeviceAuthToken({
			...params,
			...writeFence(params)
		}),
		clearDeviceAuthToken: (params) => clearDeviceAuthToken({
			...params,
			...clearFence(params)
		})
	};
	const preparedDeviceAuthDeps = preparedDeviceAuth ? {
		...deviceAuthDeps,
		loadDeviceAuthToken: () => preparedDeviceAuth
	} : deviceAuthDeps;
	return {
		loadOrCreateDeviceIdentity,
		signDevicePayload: signEd25519Payload,
		publicKeyRawBase64UrlFromPem: publicKeyRawBase64UrlFromEd25519Pem,
		...preparedDeviceAuthDeps,
		beforeConnect: ensureInheritedManagedProxyRoutingActive,
		registerGatewayLoopbackBypass: registerManagedProxyGatewayLoopbackBypass,
		logDebug,
		logError,
		redactForLog: redactToolPayloadText,
		...overrides,
		...readOnly ? {
			loadOrCreateDeviceIdentity: () => loadDeviceIdentityIfPresent() ?? void 0,
			...preparedDeviceAuthDeps
		} : {}
	};
}
function shouldSuppressStoredDeviceAuth(opts) {
	return Boolean(opts.deviceAuthScope && (opts.token?.trim() || opts.password?.trim())) || !opts.deviceAuthScope && opts.sharedStateMode === "read-only" && Boolean(opts.password?.trim()) && !opts.token?.trim() && !opts.bootstrapToken?.trim() && !opts.deviceToken?.trim() && !opts.approvalRuntimeToken?.trim() && !opts.agentRuntimeIdentityToken?.trim() && !opts.preferBootstrapToken;
}
/** Prepare storage before the one-shot RPC budget; connection loads still observe current rows. */
async function prepareGatewayClientDeviceAuth(opts, signal) {
	signal?.throwIfAborted();
	if (opts.deviceIdentity === null || opts.preparedDeviceAuth || opts.sharedStateMode === "read-only" && shouldSuppressStoredDeviceAuth(opts)) return;
	try {
		if (Object.keys(opts.edgeAuthHeaders ?? {}).length && new URL(opts.url).protocol !== "wss:") return;
		resolveGatewayWebSocketTransport({
			url: opts.url,
			tlsFingerprint: opts.tlsFingerprint,
			env: opts.env,
			options: {}
		});
	} catch {
		return;
	}
	try {
		await prepareDeviceAuthStore({
			env: opts.env,
			signal,
			readOnly: opts.sharedStateMode === "read-only"
		});
	} catch (error) {
		throw markGatewayConnectAssemblyError(error instanceof Error ? error : new Error(String(error)));
	}
}
var GatewayClient = class {
	#client;
	#options;
	#tunnel;
	#starting;
	#stopping;
	#lifetime = new AbortController();
	constructor(opts) {
		if (opts.sshTunnel && !opts.deviceAuthScope) throw new Error("Gateway SSH route requires its own device-auth scope");
		if (opts.preparedSshTunnel && !opts.sshTunnel) throw new Error("Prepared Gateway SSH tunnel requires its selected route");
		this.#options = opts;
		this.#tunnel = opts.preparedSshTunnel;
		if (!opts.sshTunnel) this.#client = this.createClient(opts.url);
	}
	createClient(url, tlsServerName) {
		const opts = this.#options;
		const { deviceAuthScope, preparedDeviceAuth, sharedStateMode, sshTunnel, preparedSshTunnel: _preparedSshTunnel, ...baseOptions } = opts;
		const runtimeIdentity = resolveGatewayClientPlatformIdentity(process.platform);
		const suppressStoredAuth = shouldSuppressStoredDeviceAuth(opts);
		for (const value of Object.values(baseOptions.edgeAuthHeaders ?? {})) registerSecretValueForRedaction(value);
		const hostDeps = createOpenClawGatewayClientHostDeps(baseOptions.hostDeps, deviceAuthScope, suppressStoredAuth, sharedStateMode, preparedDeviceAuth);
		if (sshTunnel) {
			const beforeConnect = hostDeps.beforeConnect;
			hostDeps.beforeConnect = () => {
				beforeConnect?.();
				if (this.#lifetime.signal.aborted || !this.#tunnel?.isActive()) throw new Error("Gateway SSH tunnel is no longer active");
			};
		}
		return new GatewayClient$1({
			...baseOptions,
			url,
			...tlsServerName ? { tlsServerName } : {},
			clientVersion: baseOptions.clientVersion ?? VERSION,
			platform: baseOptions.platform ?? runtimeIdentity.platform,
			deviceFamily: baseOptions.deviceFamily ?? (baseOptions.platform === void 0 ? runtimeIdentity.deviceFamily : void 0),
			hostDeps
		});
	}
	start() {
		if (!this.#options.sshTunnel) {
			this.#client?.start();
			return;
		}
		if (this.#starting || this.#lifetime.signal.aborted) return;
		this.#starting = this.startSsh().catch((error) => {
			if (this.#lifetime.signal.aborted) return;
			this.stop();
			const failure = error instanceof Error ? error : new Error(String(error));
			this.notifySshClosed(failure);
		});
	}
	async startSsh() {
		const route = this.#options.sshTunnel;
		if (!route) return;
		const url = new URL(this.#options.url ?? "");
		if (!this.#tunnel) {
			const { startSshPortForward } = await import("./ssh-tunnel-prldSM_g.mjs");
			this.#lifetime.signal.throwIfAborted();
			this.#tunnel = await startSshPortForward({
				...route,
				localPortPreferred: Number(url.port) || (url.protocol === "wss:" ? 443 : 80),
				timeoutMs: this.#options.preauthHandshakeTimeoutMs ?? 1e4,
				signal: this.#lifetime.signal
			});
		}
		if (this.#lifetime.signal.aborted) {
			await this.#tunnel.stop();
			return;
		}
		if (!this.#tunnel.isActive()) throw new Error("Gateway SSH tunnel closed before connection");
		this.#tunnel.closed.then(() => {
			if (!this.#lifetime.signal.aborted) {
				this.stop();
				this.notifySshClosed();
			}
		});
		const tlsServerName = url.protocol === "wss:" ? parseHostForAddressChecks(url.hostname)?.unbracketedHost : void 0;
		url.hostname = "127.0.0.1";
		url.port = String(this.#tunnel.localPort);
		this.#client = this.createClient(url.href, tlsServerName);
		this.#client.start();
	}
	notifySshClosed(error) {
		if (error) try {
			this.#options.onConnectError?.(error);
		} catch {
			logError("Gateway SSH connect-error callback failed");
		}
		try {
			this.#options.onClose?.(1006, error?.message ?? "Gateway SSH tunnel closed");
		} catch {
			logError("Gateway SSH close callback failed");
		}
	}
	stop() {
		if (!this.#options.sshTunnel) {
			this.#client?.stop();
			return;
		}
		this.stopAndWait().catch((error) => logError(String(error)));
	}
	stopAndWait(opts) {
		if (!this.#options.sshTunnel) return this.#client?.stopAndWait(opts) ?? Promise.resolve();
		this.#lifetime.abort();
		this.#client?.stop();
		return this.#stopping ??= (async () => {
			try {
				await this.#starting;
				await this.#client?.stopAndWait(opts);
			} finally {
				await this.#tunnel?.stop();
			}
		})();
	}
	request(method, params, opts) {
		return this.#client ? this.#client.request(method, params, opts) : Promise.reject(/* @__PURE__ */ new Error("Gateway SSH connection has not started"));
	}
	/** Current transport state, including CLOSING before the close callback fires.
	* This is not authentication or readiness evidence on its own. */
	get connected() {
		return this.#client?.connected ?? false;
	}
	getConnectionMetadata() {
		return this.#client?.getConnectionMetadata() ?? {
			clientName: this.#options.clientName,
			hasDeviceIdentity: Boolean(this.#options.deviceIdentity),
			mode: this.#options.mode,
			preauthHandshakeTimeoutMs: this.#options.preauthHandshakeTimeoutMs
		};
	}
	updateNodeManifest(manifest) {
		if (this.#client) this.#client.updateNodeManifest(manifest);
		else this.#options = {
			...this.#options,
			...manifest
		};
	}
};
//#endregion
//#region src/shared/gateway-edge-auth-headers.ts
const HTTP_HEADER_NAME_PATTERN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/u;
const TRANSPORT_OWNED_HEADERS = /* @__PURE__ */ new Set([
	"host",
	"connection",
	"upgrade",
	"content-length",
	"sec-websocket-key",
	"sec-websocket-version",
	"sec-websocket-protocol",
	"sec-websocket-extensions"
]);
function findEdgeAuthIssue(headers) {
	const entries = Object.entries(headers);
	if (entries.length === 0) return { message: "invalid gateway.remote.edgeAuth: header map must not be empty" };
	const originalNames = /* @__PURE__ */ new Map();
	for (const [headerName] of entries) {
		if (!HTTP_HEADER_NAME_PATTERN.test(headerName)) return {
			headerName,
			message: `invalid gateway.remote.edgeAuth header name: ${JSON.stringify(headerName)}`
		};
		const normalizedName = headerName.toLowerCase();
		if (TRANSPORT_OWNED_HEADERS.has(normalizedName)) return {
			headerName,
			message: `gateway.remote.edgeAuth cannot set transport-owned header "${headerName}"`
		};
		const originalName = originalNames.get(normalizedName);
		if (originalName) return {
			headerName,
			message: `gateway.remote.edgeAuth header names "${originalName}" and "${headerName}" differ only by case`
		};
		originalNames.set(normalizedName, headerName);
	}
	return null;
}
//#endregion
//#region src/gateway/edge-auth.ts
function normalizeEdgeAuthSecretInput(value, headerName) {
	const ref = parseSecretRef(value);
	if (ref) return ref;
	const literal = normalizeSecretInputString(value);
	if (literal) return literal;
	throw new Error(`invalid gateway.remote.edgeAuth header "${headerName}": expected a non-empty SecretInput`);
}
function normalizeEdgeAuthHeadersConfig(value) {
	if (value === void 0 || value === null) return;
	if (!isRecord(value)) throw new Error("invalid gateway.remote.edgeAuth: expected a header map");
	const shapeIssue = findEdgeAuthIssue(value);
	if (shapeIssue) throw new Error(shapeIssue.message);
	const normalizedEntries = Object.entries(value).map(([headerName, input]) => {
		return [headerName, normalizeEdgeAuthSecretInput(input, headerName)];
	});
	return Object.fromEntries(normalizedEntries);
}
async function resolveEdgeAuthHeaders(params) {
	if (!params.value) return;
	let protocol;
	try {
		protocol = new URL(params.targetUrl).protocol;
	} catch {
		throw new Error("gateway.remote.edgeAuth requires a wss:// connection target");
	}
	if (protocol !== "wss:") throw new Error("gateway.remote.edgeAuth requires a wss:// connection target");
	const resolvedEntries = await Promise.all(Object.entries(params.value).map(async ([headerName, input]) => {
		const value = await materializeSecretInput({
			config: params.config,
			value: input,
			env: params.env
		});
		if (!value) throw new Error(`gateway.remote.edgeAuth header "${headerName}" resolved empty`);
		registerSecretValueForRedaction(value);
		return [headerName, value];
	}));
	return Object.freeze(Object.fromEntries(resolvedEntries));
}
function gatewayEdgeAuthValueForTarget(params) {
	const remote = params.config.gateway?.remote;
	if (!remote?.url || gatewayOriginScope(params.targetUrl) !== gatewayOriginScope(remote.url)) return;
	return remote.edgeAuth;
}
//#endregion
//#region src/gateway/explicit-connection-policy.ts
function hasExplicitGatewayConnectionAuth(auth) {
	return Boolean(trimToUndefined(auth?.token) || trimToUndefined(auth?.password));
}
function targetMayRequireConfiguredEdgeAuth(url) {
	try {
		const protocol = new URL(url).protocol;
		return protocol === "wss:" || protocol === "https:";
	} catch {
		return false;
	}
}
/**
* True when the caller fully addressed the Gateway with flags. Config is then
* consulted only for gateway.remote.edgeAuth, so a broken config must not block
* the connection: this is the historical recovery path for an invalid config.
*/
function isExplicitGatewayConnection(params) {
	return !params.config && Boolean(trimToUndefined(params.urlOverride)) && hasExplicitGatewayConnectionAuth(params.explicitAuth);
}
/** Returns true when url/auth flags are sufficient and loading OpenClaw config is unnecessary. */
function canSkipGatewayConfigLoad(params) {
	const urlOverride = trimToUndefined(params.urlOverride);
	if (!urlOverride || params.config || !hasExplicitGatewayConnectionAuth(params.explicitAuth)) return false;
	return !targetMayRequireConfiguredEdgeAuth(urlOverride);
}
//#endregion
//#region src/infra/node-commands.ts
const NODE_FS_LIST_DIR_COMMAND = "fs.listDir";
const NODE_TERMINAL_UPLOAD_COMMAND = "terminal.upload";
const NODE_BROWSER_PROXY_COMMANDS = ["browser.proxy", "browser.proxy.upload.v1"];
const NODE_ADMIN_ONLY_INVOKE_COMMANDS = [
	...NODE_BROWSER_PROXY_COMMANDS,
	NODE_FS_LIST_DIR_COMMAND,
	NODE_TERMINAL_UPLOAD_COMMAND
];
const NODE_ADMIN_ONLY_INVOKE_COMMAND_SET = new Set(NODE_ADMIN_ONLY_INVOKE_COMMANDS);
/** Returns true when direct node invocation crosses an admin-only host boundary. */
function isAdminOnlyNodeInvokeCommand(command) {
	return typeof command === "string" && NODE_ADMIN_ONLY_INVOKE_COMMAND_SET.has(command);
}
/** Returns true for every versioned Browser node proxy command. */
function isBrowserProxyNodeInvokeCommand(command) {
	return typeof command === "string" && NODE_BROWSER_PROXY_COMMANDS.includes(command);
}
//#endregion
//#region src/plugins/runtime-state-key.ts
/** Process-global symbol shared by every plugin registry runtime projection. */
const PLUGIN_REGISTRY_STATE = Symbol.for("openclaw.pluginRegistryState");
//#endregion
//#region src/plugins/runtime-state.ts
function getPluginRegistryState() {
	return globalThis[PLUGIN_REGISTRY_STATE];
}
//#endregion
//#region src/plugins/runtime/execution-frame.ts
const PluginRuntimeExecutionFrame = resolveGlobalSingleton(Symbol.for("openclaw.pluginRuntimeExecutionFrame"), () => class RuntimeFrame extends InvocationFrame {
	constructor(scopes, gatewayScope, generationRegistry, invocation = scopes.invocation) {
		super(scopes, invocation);
		this.gatewayScope = gatewayScope;
		this.generationRegistry = generationRegistry;
	}
	withScopes(scopes) {
		return new RuntimeFrame(scopes, this.gatewayScope, this.generationRegistry);
	}
});
function getPluginRuntimeExecutionFrame(frame = getPluginExecutionFrame()) {
	return frame instanceof PluginRuntimeExecutionFrame ? frame : void 0;
}
//#endregion
//#region src/plugins/runtime/gateway-request-scope.ts
function getPluginRuntimeGatewayRequestScope() {
	return getPluginRuntimeExecutionFrame()?.gatewayScope;
}
/** Reads registration/request/active registry precedence without initializing a cold runtime. */
function getPluginRegistryForContext() {
	const state = getPluginRegistryState();
	return state?.registrationContext?.registry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? state?.activeRegistry ?? null;
}
//#endregion
//#region src/shared/gateway-method-policy.ts
const RESERVED_ADMIN_GATEWAY_METHOD_PREFIXES = [
	"exec.approvals.",
	"config.",
	"wizard.",
	"update."
];
const RESERVED_ADMIN_GATEWAY_METHOD_SCOPE = "operator.admin";
/** Return whether a gateway method is reserved for operator admin calls. */
function isReservedAdminGatewayMethod(method) {
	return RESERVED_ADMIN_GATEWAY_METHOD_PREFIXES.some((prefix) => method.startsWith(prefix));
}
/** Resolve the mandatory scope for reserved gateway methods. */
function resolveReservedGatewayMethodScope(method) {
	if (!isReservedAdminGatewayMethod(method)) return;
	return RESERVED_ADMIN_GATEWAY_METHOD_SCOPE;
}
//#endregion
//#region src/shared/session-method-scopes-base.ts
const SESSIONS_PATCH_WRITE_SCOPE_MUTATIONS = /* @__PURE__ */ new Set([
	"label",
	"autoLabel",
	"icon",
	"color",
	"category",
	"boardFace",
	"boardPresentation",
	"pinned",
	"archived",
	"snoozedUntil",
	"unread",
	"model",
	"agentRuntime",
	"thinkingLevel",
	"fastMode",
	"permissionMode"
]);
const SESSIONS_PATCH_WRITE_SCOPE_ENVELOPE_FIELDS = /* @__PURE__ */ new Set([
	"key",
	"agentId",
	"expectedSessionId",
	"expectedLifecycleRevision",
	"expectedPermissionMode",
	"expectedMarkedUnreadAt"
]);
const SESSIONS_DELETE_WRITE_SCOPE_FIELDS = /* @__PURE__ */ new Set([
	"key",
	"agentId",
	"deleteTranscript",
	"expectedSessionId",
	"archivedOnly"
]);
function resolveSessionsPatchRequiredScope(params) {
	if (!isRecord(params)) return "operator.write";
	if (params.permissionMode === "full" || Object.hasOwn(params, "sandboxMode")) return "operator.admin";
	return Object.keys(params).every((key) => SESSIONS_PATCH_WRITE_SCOPE_ENVELOPE_FIELDS.has(key) || SESSIONS_PATCH_WRITE_SCOPE_MUTATIONS.has(key)) ? "operator.write" : "operator.admin";
}
function resolveSessionsPatchManyRequiredScope(params) {
	if (!isRecord(params) || !isRecord(params.patch)) return "operator.write";
	if (params.patch.permissionMode === "full" || Object.hasOwn(params.patch, "sandboxMode")) return "operator.admin";
	return Object.keys(params.patch).every((key) => SESSIONS_PATCH_WRITE_SCOPE_MUTATIONS.has(key)) ? "operator.write" : "operator.admin";
}
function resolveSessionsCreateRequiredScope(params) {
	if (!isRecord(params)) return "operator.write";
	if (params.incognito === true || typeof params.key === "string" && isIncognitoSessionKey(params.key) || typeof params.parentSessionKey === "string" && isIncognitoSessionKey(params.parentSessionKey) || Object.hasOwn(params, "execNode") || Object.hasOwn(params, "toolOverrides") || params.permissionMode === "full") return "operator.admin";
	return "operator.write";
}
function resolveSessionsDeleteRequiredScope(params) {
	if (!isRecord(params) || params.archivedOnly !== true) return "operator.admin";
	return Object.keys(params).every((key) => SESSIONS_DELETE_WRITE_SCOPE_FIELDS.has(key)) ? "operator.write" : "operator.admin";
}
/** Browser-safe session mutation policy for methods without protocol validation. */
function resolveBaseSessionMutationRequiredScope(method, params) {
	if (method === "sessions.recover") return "operator.write";
	if (method === "sessions.create") return resolveSessionsCreateRequiredScope(params);
	if (method === "sessions.patch") return resolveSessionsPatchRequiredScope(params);
	if (method === "sessions.patchMany") return resolveSessionsPatchManyRequiredScope(params);
	if (method === "sessions.delete") return resolveSessionsDeleteRequiredScope(params);
}
//#endregion
//#region packages/normalization-core/src/json-schema.ts
/** Remove complete false-schema child groups immediately preceding their aggregate. */
function normalizeTypeBoxValidationErrors(errors) {
	const normalized = [];
	let consecutiveBooleanErrors = 0;
	for (const error of errors) {
		if (error.keyword === "boolean") {
			normalized.push(error);
			consecutiveBooleanErrors += 1;
			continue;
		}
		const properties = error.params?.additionalProperties;
		if (error.keyword === "additionalProperties" && typeof error.schemaPath === "string" && typeof error.instancePath === "string" && Array.isArray(properties) && properties.length > 0 && properties.length <= consecutiveBooleanErrors) {
			if (normalized.slice(-properties.length).every((child, index) => {
				const property = properties[index];
				return typeof property === "string" && child.schemaPath === `${error.schemaPath}/additionalProperties` && child.instancePath === `${error.instancePath}/${property.replace(/~/g, "~0").replace(/\//g, "~1")}`;
			})) normalized.length -= properties.length;
		}
		normalized.push(error);
		consecutiveBooleanErrors = 0;
	}
	return normalized;
}
//#endregion
//#region packages/gateway-protocol/src/protocol-validator.ts
/* @__NO_SIDE_EFFECTS__ */
function lazyCompile(schema, precheck) {
	let compiled;
	let errors = null;
	const validate = ((data) => {
		const precheckError = precheck?.(data);
		if (precheckError) {
			errors = [precheckError];
			return false;
		}
		const current = compiled ??= Compile(schema);
		const valid = current.Check(data);
		errors = valid ? null : normalizeTypeBoxValidationErrors(current.Errors(data)[1]);
		return valid;
	});
	Object.defineProperties(validate, {
		errors: {
			configurable: true,
			enumerable: true,
			get: () => errors,
			set: (nextErrors) => {
				errors = nextErrors ?? null;
			}
		},
		schema: {
			configurable: true,
			enumerable: true,
			get: () => schema
		}
	});
	return validate;
}
//#endregion
//#region packages/gateway-protocol/src/schema/closed-object.ts
const identityKey = "~openclawClosedObjectIdentity";
function closedObject(properties) {
	const schema = Type.Object(properties, { additionalProperties: false });
	Object.defineProperty(schema, identityKey, { value: Symbol("closedObject") });
	return schema;
}
//#endregion
//#region packages/gateway-protocol/src/secret-ref-contract.ts
/** Canonical id for file secret providers that expose exactly one value. */
const SINGLE_VALUE_FILE_REF_ID = "value";
/** Shared alias grammar for env/file/exec/store secret provider names. */
const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
/** JSON-schema fragment that rejects invalid JSON-pointer escape sequences. */
const FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
/** JSON-schema pattern for exec secret ref ids, excluding dot-path traversal. */
const EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN = "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";
//#endregion
//#region packages/gateway-protocol/src/schema/primitives.ts
/**
* Shared schema primitives reused by gateway protocol request/result schemas.
*
* Keep these schemas small and transport-oriented; feature-specific validation
* belongs in the owning schema module or runtime handler.
*/
const ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
const INPUT_PROVENANCE_KIND_VALUES = [
	"external_user",
	"inter_session",
	"internal_system"
];
const SESSION_LABEL_MAX_LENGTH = 512;
/** Non-empty string primitive for protocol fields that reject blank values. */
const NonEmptyString = Type.String({ minLength: 1 });
Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-fA-F0-9]{64}$"
});
Type.String({
	minLength: 1,
	maxLength: 128
});
Type.String({
	minLength: 1,
	maxLength: 512
});
Type.String({
	minLength: 1,
	maxLength: SESSION_LABEL_MAX_LENGTH
});
closedObject({
	kind: Type.String({ enum: [...INPUT_PROVENANCE_KIND_VALUES] }),
	originSessionId: Type.Optional(Type.String()),
	sourceSessionKey: Type.Optional(Type.String()),
	sourceChannel: Type.Optional(Type.String()),
	sourceTool: Type.Optional(Type.String()),
	sourceRole: Type.Optional(Type.Literal("subagent")),
	sourcePromptPrefix: Type.Optional(Type.String()),
	jobId: Type.Optional(Type.String()),
	runId: Type.Optional(Type.String())
});
Type.Enum(GATEWAY_CLIENT_IDS);
Type.Enum(GATEWAY_CLIENT_MODES);
const SecretProviderAliasString = Type.String({ pattern: SECRET_PROVIDER_ALIAS_PATTERN.source });
const EnvSecretRefSchema = closedObject({
	source: Type.Literal("env"),
	provider: SecretProviderAliasString,
	id: Type.String({ pattern: ENV_SECRET_REF_ID_RE.source })
});
const FileSecretRefIdSchema = Type.Unsafe({
	type: "string",
	anyOf: [{ const: SINGLE_VALUE_FILE_REF_ID }, { allOf: [{ pattern: "^/" }, { not: { pattern: FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN } }] }]
});
const FileSecretRefSchema = closedObject({
	source: Type.Literal("file"),
	provider: SecretProviderAliasString,
	id: FileSecretRefIdSchema
});
const ExecSecretRefSchema = closedObject({
	source: Type.Literal("exec"),
	provider: SecretProviderAliasString,
	id: Type.String({ pattern: EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN })
});
const StoreSecretRefSchema = closedObject({
	source: Type.Literal("store"),
	provider: SecretProviderAliasString,
	id: Type.String({ pattern: ENV_SECRET_REF_ID_RE.source })
});
/** Structured secret reference accepted by config and channel protocol payloads. */
const SecretRefSchema = Type.Union([
	EnvSecretRefSchema,
	FileSecretRefSchema,
	ExecSecretRefSchema,
	StoreSecretRefSchema
]);
Type.Union([Type.String(), SecretRefSchema]);
const WORKER_PROTOCOL_MAX_PAYLOAD_BYTES = 65536;
const WorkerIdentifierSchema = Type.String({
	minLength: 1,
	maxLength: 256,
	pattern: "^\\S(?:.*\\S)?$"
});
const WorkerFrameIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const WorkerAdmissionFailureReasonSchema = Type.Union([
	Type.Literal("invalid-credential"),
	Type.Literal("credential-expired"),
	Type.Literal("environment-mismatch"),
	Type.Literal("environment-unavailable"),
	Type.Literal("bundle-mismatch"),
	Type.Literal("version-mismatch"),
	Type.Literal("session-mismatch"),
	Type.Literal("placement-mismatch"),
	Type.Literal("owner-epoch-mismatch"),
	Type.Literal("rpc-set-mismatch"),
	Type.Literal("protocol-features-mismatch")
]);
const WorkerProtocolCloseReasonSchema = Type.Union([
	WorkerAdmissionFailureReasonSchema,
	Type.Literal("admission-rejected"),
	Type.Literal("invalid-handshake"),
	Type.Literal("protocol-mismatch"),
	Type.Literal("gateway-unavailable"),
	Type.Literal("invalid-frame"),
	Type.Literal("slow-consumer"),
	Type.Literal("method-not-allowed"),
	Type.Literal("invalid-heartbeat"),
	Type.Literal("credential-replaced"),
	Type.Literal("gateway-shutdown")
]);
const WorkerErrorShapeSchema = closedObject({
	code: Type.Union([Type.Literal("INVALID_REQUEST"), Type.Literal("UNAVAILABLE")]),
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: closedObject({ reason: WorkerProtocolCloseReasonSchema }),
	retryable: Type.Optional(Type.Boolean()),
	retryAfterMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
function workerErrorResponseSchema(error) {
	return closedObject({
		type: Type.Literal("res"),
		id: WorkerFrameIdSchema,
		ok: Type.Literal(false),
		error
	});
}
workerErrorResponseSchema(WorkerErrorShapeSchema);
closedObject({
	input: Type.Number({ minimum: 0 }),
	output: Type.Number({ minimum: 0 }),
	cacheRead: Type.Number({ minimum: 0 }),
	cacheWrite: Type.Number({ minimum: 0 }),
	contextUsage: Type.Optional(Type.Union([closedObject({
		state: Type.Literal("available"),
		promptTokens: Type.Number({ minimum: 0 }),
		totalTokens: Type.Number({ minimum: 0 })
	}), closedObject({ state: Type.Literal("unavailable") })])),
	totalTokens: Type.Number({ minimum: 0 }),
	cost: closedObject({
		input: Type.Number({ minimum: 0 }),
		output: Type.Number({ minimum: 0 }),
		cacheRead: Type.Number({ minimum: 0 }),
		cacheWrite: Type.Number({ minimum: 0 }),
		total: Type.Number({ minimum: 0 }),
		totalOrigin: Type.Optional(Type.Literal("provider-billed"))
	})
});
closedObject({
	type: WorkerIdentifierSchema,
	timestamp: Type.Integer({ minimum: 0 }),
	error: Type.Optional(closedObject({
		name: Type.Optional(Type.String({ maxLength: 256 })),
		message: Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
		stack: Type.Optional(Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
		code: Type.Optional(Type.Union([Type.String({ maxLength: 256 }), Type.Number()]))
	})),
	details: Type.Optional(Type.Record(Type.String({
		minLength: 1,
		maxLength: 256
	}), Type.Unknown()))
});
Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES });
Type.Integer({
	minimum: 0,
	maximum: Number.MAX_SAFE_INTEGER
});
Type.Integer({
	minimum: 1,
	maximum: Number.MAX_SAFE_INTEGER
});
const WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES = WORKER_PROTOCOL_MAX_PAYLOAD_BYTES;
const WorkerReplayHashSchema = Type.String({
	minLength: 2,
	maxLength: 16,
	pattern: "^[a-z0-9]+$"
});
closedObject({
	v: Type.Literal(1),
	type: WorkerIdentifierSchema,
	id: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	})),
	data: Type.String({
		minLength: 1,
		maxLength: WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES
	}),
	replayIndex: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})),
	provider: WorkerIdentifierSchema,
	api: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema,
	baseUrlHash: Type.Optional(WorkerReplayHashSchema),
	sessionHash: Type.Optional(WorkerReplayHashSchema),
	authProfileHash: Type.Optional(WorkerReplayHashSchema)
});
Type.Union([
	Type.Literal("local"),
	Type.Literal("requested"),
	Type.Literal("provisioning"),
	Type.Literal("syncing"),
	Type.Literal("starting"),
	Type.Literal("active"),
	Type.Literal("draining"),
	Type.Literal("reconciling"),
	Type.Literal("reclaimed"),
	Type.Literal("failed")
]);
const SessionPlacementTimingProperties = {
	generation: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	createdAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	updatedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	stateChangedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
};
const SessionPlacementOwnerEpochSchema = Type.Integer({
	minimum: 1,
	maximum: Number.MAX_SAFE_INTEGER
});
const WorkerBundleHashSchema = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-f0-9]{64}$"
});
const SessionPlacementWorkspaceProperties = {
	workspaceBaseManifestRef: NonEmptyString,
	remoteWorkspaceDir: NonEmptyString
};
const SessionPlacementAckProperties = {
	lastTranscriptAckCursor: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})),
	lastLiveEventAckCursor: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}))
};
const SessionPlacementDiskSpaceSchema = closedObject({
	status: Type.Union([
		Type.Literal("ok"),
		Type.Literal("warning"),
		Type.Literal("critical")
	]),
	availableBytes: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	totalBytes: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	observedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
});
const SessionPlacementWorkerRuntimeInstallSchema = closedObject({
	phase: Type.Union([Type.Literal("transferring"), Type.Literal("installing")]),
	transferredBytes: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	totalBytes: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	startedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	updatedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
});
const SessionPlacementRunnerSchema = closedObject({
	kind: Type.Literal("device"),
	status: Type.Union([Type.Literal("available"), Type.Literal("offline")]),
	deviceId: Type.Optional(WorkerIdentifierSchema)
});
const SessionPlacementDiskSpaceProperties = { diskSpace: Type.Optional(SessionPlacementDiskSpaceSchema) };
const WORKER_MACHINE_CLASS_MAX_LENGTH = 128;
const WORKER_OPERATING_SYSTEM_MAX_LENGTH = 64;
const WorkerMachineClassSchema = Type.String({
	minLength: 1,
	maxLength: WORKER_MACHINE_CLASS_MAX_LENGTH
});
const WorkerOperatingSystemIdSchema = Type.String({
	minLength: 1,
	maxLength: WORKER_OPERATING_SYSTEM_MAX_LENGTH
});
const SessionPlacementMachineSchema = closedObject({
	class: Type.Optional(WorkerMachineClassSchema),
	os: Type.Optional(WorkerOperatingSystemIdSchema),
	osLabel: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_OPERATING_SYSTEM_MAX_LENGTH
	})),
	cpu: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65536
	})),
	memoryGb: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65536
	}))
});
const SessionPlacementIdentityProperties = {
	providerId: Type.Optional(NonEmptyString),
	profileId: Type.Optional(NonEmptyString),
	machine: Type.Optional(SessionPlacementMachineSchema)
};
const WorkspaceResultConflictSchema = closedObject({
	paths: Type.Array(NonEmptyString, {
		minItems: 1,
		maxItems: 256
	}),
	stagedResultRef: NonEmptyString,
	totalCount: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}))
});
const SessionPlacementConflictProperties = { workspaceResultConflict: Type.Optional(WorkspaceResultConflictSchema) };
const SessionPlacementWorkspaceReconciliationProperties = { workspaceResultReconciling: Type.Optional(Type.Literal(true)) };
const TerminalSessionPlacementProperties = {
	...SessionPlacementIdentityProperties,
	environmentId: Type.Optional(NonEmptyString),
	activeOwnerEpoch: Type.Optional(SessionPlacementOwnerEpochSchema),
	workspaceBaseManifestRef: Type.Optional(NonEmptyString),
	remoteWorkspaceDir: Type.Optional(NonEmptyString),
	workerBundleHash: Type.Optional(WorkerBundleHashSchema),
	...SessionPlacementAckProperties,
	...SessionPlacementConflictProperties,
	terminalReason: Type.Optional(NonEmptyString),
	terminalAtMs: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}))
};
function createUnownedSessionPlacementSchema(state) {
	return closedObject({
		state: Type.Literal(state),
		...SessionPlacementTimingProperties
	});
}
function workerOwnedSessionPlacementProperties(state) {
	return {
		state: Type.Literal(state),
		...SessionPlacementTimingProperties,
		...SessionPlacementIdentityProperties,
		environmentId: NonEmptyString,
		activeOwnerEpoch: SessionPlacementOwnerEpochSchema,
		workerBundleHash: WorkerBundleHashSchema,
		...SessionPlacementWorkspaceProperties,
		...SessionPlacementAckProperties,
		...SessionPlacementConflictProperties,
		...SessionPlacementDiskSpaceProperties
	};
}
const LocalSessionPlacementSchema = createUnownedSessionPlacementSchema("local");
const RequestedSessionPlacementSchema = createUnownedSessionPlacementSchema("requested");
const ProvisioningSessionPlacementSchema = closedObject({
	state: Type.Literal("provisioning"),
	...SessionPlacementTimingProperties,
	...SessionPlacementIdentityProperties,
	environmentId: Type.Optional(NonEmptyString),
	workerRuntimeInstall: Type.Optional(SessionPlacementWorkerRuntimeInstallSchema)
});
const SyncingSessionPlacementSchema = closedObject({
	state: Type.Literal("syncing"),
	...SessionPlacementTimingProperties,
	...SessionPlacementIdentityProperties,
	environmentId: NonEmptyString,
	workerBundleHash: WorkerBundleHashSchema
});
const StartingSessionPlacementSchema = closedObject({
	state: Type.Literal("starting"),
	...SessionPlacementTimingProperties,
	...SessionPlacementIdentityProperties,
	environmentId: NonEmptyString,
	workerBundleHash: WorkerBundleHashSchema,
	...SessionPlacementWorkspaceProperties
});
const ActiveWorkerSessionPlacementSchema = closedObject({
	...workerOwnedSessionPlacementProperties("active"),
	...SessionPlacementWorkspaceReconciliationProperties,
	runner: Type.Optional(SessionPlacementRunnerSchema),
	workerRuntimeInstall: Type.Optional(SessionPlacementWorkerRuntimeInstallSchema)
});
const DrainingSessionPlacementSchema = closedObject({
	...workerOwnedSessionPlacementProperties("draining"),
	...SessionPlacementWorkspaceReconciliationProperties
});
const ReconcilingSessionPlacementSchema = closedObject({ ...workerOwnedSessionPlacementProperties("reconciling") });
const ReclaimedSessionPlacementSchema = closedObject({
	state: Type.Literal("reclaimed"),
	...SessionPlacementTimingProperties,
	...TerminalSessionPlacementProperties
});
const FailedSessionPlacementSchema = closedObject({
	state: Type.Literal("failed"),
	...SessionPlacementTimingProperties,
	...TerminalSessionPlacementProperties,
	recoveryError: NonEmptyString,
	recoveryAction: Type.Optional(Type.Enum(["restart", "stop-first"], { type: "string" })),
	retryOnSend: Type.Optional(Type.Literal(true))
});
Type.Union([
	LocalSessionPlacementSchema,
	RequestedSessionPlacementSchema,
	ProvisioningSessionPlacementSchema,
	SyncingSessionPlacementSchema,
	StartingSessionPlacementSchema,
	ActiveWorkerSessionPlacementSchema,
	DrainingSessionPlacementSchema,
	ReconcilingSessionPlacementSchema,
	ReclaimedSessionPlacementSchema,
	FailedSessionPlacementSchema
]);
/**
* Requests one-way dispatch to an explicit or automatically selected device (`operator.write`),
* an explicit profile (`operator.admin`), or an `operator.admin`-only
* `cloudWorkers.projectProfiles` lookup when no target is supplied. Target modes are exclusive.
* An absent, unmatched, or invalid mapping is rejected with `INVALID_REQUEST` instead of
* provisioning or falling back to another target.
*/
const SessionsDispatchParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	profileId: Type.Optional(NonEmptyString),
	deviceId: Type.Optional(NonEmptyString),
	autoDevice: Type.Optional(Type.Literal(true)),
	machineClass: Type.Optional(WorkerMachineClassSchema),
	os: Type.Optional(WorkerOperatingSystemIdSchema)
}, {
	additionalProperties: false,
	oneOf: [
		{
			required: ["profileId"],
			not: { anyOf: [{ required: ["deviceId"] }, { required: ["autoDevice"] }] }
		},
		{
			required: ["deviceId"],
			not: { anyOf: [
				{ required: ["profileId"] },
				{ required: ["autoDevice"] },
				{ required: ["machineClass"] },
				{ required: ["os"] }
			] }
		},
		{
			required: ["autoDevice"],
			not: { anyOf: [
				{ required: ["profileId"] },
				{ required: ["deviceId"] },
				{ required: ["machineClass"] },
				{ required: ["os"] }
			] }
		},
		{ not: { anyOf: [
			{ required: ["profileId"] },
			{ required: ["deviceId"] },
			{ required: ["autoDevice"] },
			{ required: ["machineClass"] },
			{ required: ["os"] }
		] } }
	]
});
closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	placement: ActiveWorkerSessionPlacementSchema
});
closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	recoverToGateway: Type.Optional(closedObject({ expectedGeneration: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}) }))
});
/** Terminal placement returned after a worker reclaim operation. */
const SessionsReclaimResultPlacementSchema = Type.Union([LocalSessionPlacementSchema, ReclaimedSessionPlacementSchema]);
closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	placement: SessionsReclaimResultPlacementSchema
});
/** Exact active source observed before a session placement move. */
const SessionMoveExpectedSourceSchema = closedObject({
	generation: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	environmentId: WorkerIdentifierSchema,
	ownerEpoch: SessionPlacementOwnerEpochSchema
});
/** Moves the session back to the Gateway without redispatching it. */
const SessionMoveGatewayTargetSchema = closedObject({ kind: Type.Literal("gateway") });
/** Moves the session to one configured cloud worker profile. */
const SessionMoveProfileTargetSchema = closedObject({
	kind: Type.Literal("profile"),
	profileId: WorkerIdentifierSchema,
	machineClass: Type.Optional(WorkerMachineClassSchema),
	os: Type.Optional(WorkerOperatingSystemIdSchema)
});
/** Moves the session to one paired device worker. */
const SessionMoveDeviceTargetSchema = closedObject({
	kind: Type.Literal("device"),
	deviceId: WorkerIdentifierSchema
});
/** Closed destination union for session placement moves. */
const SessionMoveTargetSchema = Type.Union([
	SessionMoveGatewayTargetSchema,
	SessionMoveProfileTargetSchema,
	SessionMoveDeviceTargetSchema
]);
closedObject({
	target: SessionMoveTargetSchema,
	updatedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	error: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 1024
	}))
});
const SessionsMoveTargetCorrelationSchema = Type.Union([Type.Object({ target: SessionMoveGatewayTargetSchema }), Type.Object({ target: Type.Union([SessionMoveProfileTargetSchema, SessionMoveDeviceTargetSchema]) }, { not: { required: ["abandonSource"] } })]);
/** Requests one exact-source placement move without replaying active work. */
const SessionsMoveParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	expected: SessionMoveExpectedSourceSchema,
	target: SessionMoveTargetSchema,
	abandonSource: Type.Optional(Type.Literal(true))
}, {
	additionalProperties: false,
	allOf: [SessionsMoveTargetCorrelationSchema]
});
/** Bounded placement state returned by sessions.move. */
const SessionMovePlacementSchema = closedObject({
	state: Type.Union([Type.Literal("local"), Type.Literal("active")]),
	generation: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
});
closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	placement: SessionMovePlacementSchema
});
//#endregion
//#region packages/gateway-protocol/src/session-placement-validators.ts
const validateSessionsDispatchParams = /* @__PURE__ */ lazyCompile(SessionsDispatchParamsSchema);
const validateSessionsMoveParams = /* @__PURE__ */ lazyCompile(SessionsMoveParamsSchema);
//#endregion
//#region src/shared/session-method-scopes.ts
/** Returns the exact Gateway/CLI scope for params-aware session mutations. */
function resolveDynamicSessionMutationRequiredScope(method, params) {
	if (method === "sessions.dispatch") {
		if (!validateSessionsDispatchParams(params)) return "operator.write";
		return params.deviceId !== void 0 || params.autoDevice === true ? "operator.write" : "operator.admin";
	}
	if (method === "sessions.move") return validateSessionsMoveParams(params) && params.target.kind === "profile" ? "operator.admin" : "operator.write";
	return resolveBaseSessionMutationRequiredScope(method, params);
}
//#endregion
//#region src/gateway/agent-command-policy.ts
/** Commands routed through `agent` that mutate session lifecycle state. */
const AGENT_SESSION_RESET_COMMAND_RE = /^\/(new|reset)(?:\s+([\s\S]*))?$/i;
/** Returns true when an agent message requests a session reset. */
function isAgentSessionResetCommand(message) {
	return typeof message === "string" && AGENT_SESSION_RESET_COMMAND_RE.test(message);
}
//#endregion
//#region src/gateway/methods/core-descriptors.ts
const CONTROL_PLANE_WRITE = { controlPlaneWrite: true };
const SIDECAR_CONTROL_PLANE_WRITE = {
	startup: true,
	controlPlaneWrite: true
};
const OBSERVATION = { lifetime: "observation" };
const SESSION_WRITE = { sessionAccess: { mode: "write" } };
const PORTAL_SESSION_WRITE = { sessionAccess: {
	mode: "write",
	allowOwnSessionScope: true,
	requiredTool: "portal"
} };
const CORE_GATEWAY_METHOD_SPECS = [
	[
		"health",
		"health",
		"operator.read",
		"<=2026.7"
	],
	[
		"diagnostics.stability",
		"diagnostics",
		"operator.read",
		"<=2026.7"
	],
	[
		"doctor.memory.status",
		"doctor",
		"operator.read",
		"<=2026.7"
	],
	[
		"doctor.memory.dreamDiary",
		"doctor",
		"operator.read",
		"<=2026.7"
	],
	[
		"doctor.memory.backfillDreamDiary",
		"doctor",
		"operator.write",
		"<=2026.7"
	],
	[
		"doctor.memory.resetDreamDiary",
		"doctor",
		"operator.write",
		"<=2026.7"
	],
	[
		"doctor.memory.resetGroundedShortTerm",
		"doctor",
		"operator.write",
		"<=2026.7"
	],
	[
		"doctor.memory.repairDreamingArtifacts",
		"doctor",
		"operator.write",
		"<=2026.7"
	],
	[
		"doctor.memory.dedupeDreamDiary",
		"doctor",
		"operator.write",
		"<=2026.7"
	],
	[
		"logs.tail",
		"logs",
		"operator.read",
		"<=2026.7"
	],
	[
		"channels.status",
		"channels",
		"operator.read",
		"<=2026.7"
	],
	[
		"channels.start",
		"channels",
		"operator.admin",
		"<=2026.7"
	],
	[
		"channels.stop",
		"channels",
		"operator.admin",
		"<=2026.7"
	],
	[
		"channels.logout",
		"channels",
		"operator.admin",
		"<=2026.7"
	],
	[
		"status",
		"health",
		"operator.read",
		"<=2026.7"
	],
	[
		"usage.status",
		"usage",
		"operator.read",
		"<=2026.7"
	],
	[
		"usage.cost",
		"usage",
		"operator.read",
		"<=2026.7"
	],
	[
		"tts.status",
		"tts",
		"operator.read",
		"<=2026.7"
	],
	[
		"tts.providers",
		"tts",
		"operator.read",
		"<=2026.7"
	],
	[
		"tts.personas",
		"tts",
		"operator.read",
		"<=2026.7"
	],
	[
		"tts.enable",
		"tts",
		"operator.write",
		"<=2026.7"
	],
	[
		"tts.disable",
		"tts",
		"operator.write",
		"<=2026.7"
	],
	[
		"tts.convert",
		"tts",
		"operator.write",
		"<=2026.7"
	],
	[
		"tts.setProvider",
		"tts",
		"operator.write",
		"<=2026.7"
	],
	[
		"tts.setPersona",
		"tts",
		"operator.write",
		"<=2026.7"
	],
	[
		"config.get",
		"config",
		"operator.read",
		"<=2026.7"
	],
	[
		"config.set",
		"config",
		"operator.admin",
		"<=2026.7"
	],
	[
		"config.apply",
		"config",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"config.patch",
		"config",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"config.schema",
		"config",
		"operator.read",
		"<=2026.7"
	],
	[
		"config.schema.lookup",
		"config",
		"operator.read",
		"<=2026.7"
	],
	[
		"exec.approvals.get",
		"exec-approvals",
		"operator.admin",
		"<=2026.7"
	],
	[
		"exec.approvals.set",
		"exec-approvals",
		"operator.admin",
		"<=2026.7"
	],
	[
		"exec.approvals.node.get",
		"exec-approvals",
		"operator.admin",
		"<=2026.7"
	],
	[
		"exec.approvals.node.set",
		"exec-approvals",
		"operator.admin",
		"<=2026.7"
	],
	[
		"exec.approval.get",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"exec.approval.list",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"exec.approval.request",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"exec.approval.waitDecision",
		null,
		"operator.approvals",
		"<=2026.7",
		OBSERVATION
	],
	[
		"exec.approval.resolve",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"exec.approval.grants.list",
		null,
		"operator.approvals",
		"2026.8"
	],
	[
		"exec.approval.grants.revoke",
		null,
		"operator.approvals",
		"2026.8"
	],
	[
		"question.request",
		null,
		"operator.questions",
		"2026.7"
	],
	[
		"question.waitAnswer",
		null,
		"operator.questions",
		"2026.7",
		OBSERVATION
	],
	[
		"question.resolve",
		null,
		"operator.questions",
		"2026.7"
	],
	[
		"question.get",
		null,
		"operator.questions",
		"2026.7"
	],
	[
		"question.list",
		null,
		"operator.questions",
		"2026.7"
	],
	[
		"plugin.approval.list",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"plugin.approval.request",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"plugin.approval.waitDecision",
		null,
		"operator.approvals",
		"<=2026.7",
		OBSERVATION
	],
	[
		"plugin.approval.resolve",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"plugins.uiDescriptors",
		"plugin-host-hooks",
		"operator.read",
		"<=2026.7"
	],
	[
		"plugins.sessionAction",
		"plugin-host-hooks",
		"dynamic",
		"<=2026.7"
	],
	[
		"openclaw.chat",
		"system-agent",
		"operator.admin",
		"<=2026.7"
	],
	[
		"openclaw.chat.history",
		"system-agent",
		"operator.admin",
		"2026.7"
	],
	[
		"openclaw.changes.list",
		"system-changes",
		"operator.admin",
		"<=2026.7"
	],
	[
		"openclaw.approval.list",
		"system-agent-approvals",
		"operator.approvals",
		"<=2026.7"
	],
	[
		"openclaw.setup.detect",
		"system-agent",
		"operator.admin",
		"<=2026.7"
	],
	[
		"openclaw.setup.activate",
		"system-agent",
		"operator.admin",
		"<=2026.7"
	],
	[
		"openclaw.setup.activate.start",
		"system-agent",
		"operator.admin",
		"2026.8"
	],
	[
		"openclaw.setup.auth.start",
		"system-agent",
		"operator.admin",
		"<=2026.7"
	],
	[
		"openclaw.setup.prepare.start",
		"system-agent",
		"operator.admin",
		"<=2026.7"
	],
	[
		"wizard.start",
		"wizard",
		"operator.admin",
		"<=2026.7"
	],
	[
		"wizard.next",
		"wizard",
		"operator.admin",
		"<=2026.7"
	],
	[
		"wizard.cancel",
		"wizard",
		"operator.admin",
		"<=2026.7"
	],
	[
		"wizard.status",
		"wizard",
		"operator.admin",
		"<=2026.7"
	],
	[
		"talk.catalog",
		"talk",
		"operator.read",
		"<=2026.7"
	],
	[
		"talk.config",
		"talk",
		"dynamic",
		"<=2026.7"
	],
	[
		"talk.client.create",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.client.transcript",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.client.close",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.client.toolCall",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.client.steer",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.create",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.appendAudio",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.cancelOutput",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.acknowledgeMark",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.submitToolResult",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.steer",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.close",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.speak",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.mode",
		"talk-mode",
		"operator.talk",
		"<=2026.7"
	],
	[
		"commands.list",
		"commands",
		"operator.read",
		"<=2026.7"
	],
	[
		"models.list",
		"models",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"models.authStatus",
		"models-auth-status",
		"operator.read",
		"<=2026.7"
	],
	[
		"models.authLogout",
		"models-auth-status",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"tools.catalog",
		"tools-catalog",
		"operator.read",
		"<=2026.7"
	],
	[
		"tools.effective",
		"tools-effective",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"tools.invoke",
		"tools-invoke",
		"operator.write",
		"<=2026.7"
	],
	[
		"mcp.app.view",
		"mcp-app",
		"operator.read",
		"<=2026.7"
	],
	[
		"mcp.app.listTools",
		"mcp-app",
		"operator.read",
		"<=2026.7"
	],
	[
		"mcp.app.listResources",
		"mcp-app",
		"operator.read",
		"<=2026.7"
	],
	[
		"mcp.app.listResourceTemplates",
		"mcp-app",
		"operator.read",
		"<=2026.7"
	],
	[
		"mcp.app.readResource",
		"mcp-app",
		"operator.read",
		"<=2026.7"
	],
	[
		"mcp.app.callTool",
		"mcp-app",
		"operator.write",
		"<=2026.7"
	],
	[
		"mcp.app.updateModelContext",
		"mcp-app",
		"operator.write",
		"<=2026.7"
	],
	[
		"board.get",
		"board",
		"operator.read",
		"<=2026.7"
	],
	[
		"board.update",
		"board",
		"operator.write",
		"<=2026.7"
	],
	[
		"board.widget.put",
		"board",
		"operator.write",
		"<=2026.7"
	],
	[
		"board.widget.grant",
		"board",
		"operator.approvals",
		"<=2026.7"
	],
	[
		"board.widget.appView",
		"board",
		"operator.read",
		"2026.7"
	],
	[
		"board.event",
		"board",
		"operator.write",
		"<=2026.7"
	],
	[
		"audit.list",
		"audit",
		"operator.read",
		"2026.7"
	],
	[
		"audit.activity.list",
		"audit",
		"operator.read",
		"2026.7"
	],
	[
		"users.list",
		"users",
		"operator.read",
		"<=2026.7"
	],
	[
		"users.self",
		"users",
		"operator.read",
		"<=2026.7"
	],
	[
		"users.linkEmail",
		"users",
		"operator.admin",
		"<=2026.7"
	],
	[
		"users.setDisplayName",
		"users",
		"operator.write",
		"<=2026.7"
	],
	[
		"users.setAvatar",
		"users",
		"operator.write",
		"<=2026.7"
	],
	[
		"users.setRole",
		"users",
		"operator.admin",
		"2026.8"
	],
	[
		"users.listAuthLinks",
		"users",
		"operator.read",
		"2026.8"
	],
	[
		"users.listModelAccounts",
		"users",
		"operator.read",
		"2026.8"
	],
	[
		"users.selectModelAccount",
		"users",
		"operator.write",
		"2026.8"
	],
	[
		"users.linkAuthProfile",
		"users",
		"operator.admin",
		"2026.8"
	],
	[
		"users.unlinkAuthProfile",
		"users",
		"operator.write",
		"2026.8"
	],
	[
		"users.authConnect.start",
		"users",
		"operator.write",
		"2026.8"
	],
	[
		"users.authConnect.answer",
		"users",
		"operator.write",
		"2026.8"
	],
	[
		"users.authConnect.status",
		"users",
		"operator.write",
		"2026.8"
	],
	[
		"users.authConnect.cancel",
		"users",
		"operator.write",
		"2026.8"
	],
	[
		"users.authConnect.catalog",
		"users",
		"operator.write",
		"2026.8"
	],
	[
		"taskSuggestions.list",
		"task-suggestions",
		"operator.read",
		"<=2026.7"
	],
	[
		"taskSuggestions.create",
		"task-suggestions",
		"operator.write",
		"<=2026.7"
	],
	[
		"taskSuggestions.accept",
		"task-suggestions",
		"operator.admin",
		"<=2026.7"
	],
	[
		"taskSuggestions.dismiss",
		"task-suggestions",
		"operator.write",
		"<=2026.7"
	],
	[
		"environments.list",
		"environments",
		"dynamic",
		"2026.7"
	],
	[
		"environments.status",
		"environments",
		"operator.read",
		"2026.7"
	],
	[
		"worktrees.list",
		"worktrees",
		"operator.read",
		"2026.7"
	],
	[
		"worktrees.branches",
		"worktrees",
		"operator.write",
		"2026.7"
	],
	[
		"fs.listDir",
		"fs",
		"dynamic",
		"<=2026.7"
	],
	[
		"worktrees.create",
		"worktrees",
		"operator.write",
		"2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"worktrees.remove",
		"worktrees",
		"operator.admin",
		"2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"worktrees.restore",
		"worktrees",
		"operator.admin",
		"2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"worktrees.gc",
		"worktrees",
		"operator.admin",
		"2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"agents.list",
		"agents",
		"operator.read",
		"<=2026.7"
	],
	[
		"agents.create",
		"agents",
		"operator.admin",
		"<=2026.7"
	],
	[
		"agents.update",
		"agents",
		"operator.admin",
		"<=2026.7"
	],
	[
		"agents.delete",
		"agents",
		"operator.admin",
		"<=2026.7"
	],
	[
		"agents.files.list",
		"agents",
		"operator.read",
		"<=2026.7"
	],
	[
		"agents.files.get",
		"agents",
		"operator.read",
		"<=2026.7"
	],
	[
		"agents.files.set",
		"agents",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.files.list",
		"sessions-files",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.files.get",
		"sessions-files",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.files.set",
		"sessions-files",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.files.reveal",
		"sessions-files",
		"operator.admin",
		"<=2026.7"
	],
	[
		"artifacts.list",
		"artifacts",
		"operator.read",
		"<=2026.7"
	],
	[
		"artifacts.get",
		"artifacts",
		"operator.read",
		"<=2026.7"
	],
	[
		"artifacts.download",
		"artifacts",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.status",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.library.list",
		"skills",
		"operator.read",
		"2026.8"
	],
	[
		"skills.library.read",
		"skills",
		"operator.read",
		"2026.8"
	],
	[
		"skills.library.save",
		"skills",
		"operator.write",
		"2026.8"
	],
	[
		"skills.library.mutate",
		"skills",
		"operator.write",
		"2026.8"
	],
	[
		"skills.library.activate",
		"skills",
		"operator.write",
		"2026.8"
	],
	[
		"skills.library.import",
		"skills",
		"operator.write",
		"2026.8"
	],
	[
		"skills.library.upload",
		"skills",
		"operator.write",
		"2026.8"
	],
	[
		"skills.search",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.detail",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.securityVerdicts",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.skillCard",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.bins",
		"skills",
		"node",
		"<=2026.7"
	],
	[
		"skills.upload.begin",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.upload.chunk",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.upload.commit",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.install",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.update",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.curator.status",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.curator.pin",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.curator.unpin",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.curator.restore",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.list",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.proposals.inspect",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.proposals.historyStatus",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.proposals.historyScan",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.create",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.update",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.revise",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.requestRevision",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.apply",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.reject",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.quarantine",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"update.status",
		"update",
		"operator.admin",
		"<=2026.7"
	],
	[
		"update.run",
		"update",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"voicewake.get",
		"voicewake",
		"operator.read",
		"<=2026.7"
	],
	[
		"voicewake.set",
		"voicewake",
		"operator.write",
		"<=2026.7"
	],
	[
		"secrets.reload",
		null,
		"operator.admin",
		"<=2026.7"
	],
	[
		"secrets.resolve",
		null,
		"operator.admin",
		"<=2026.7"
	],
	[
		"voicewake.routing.get",
		"voicewake-routing",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.list",
		"sessions-read",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"sessions.subscribe",
		"sessions-subscriptions",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"sessions.messages.subscribe",
		"sessions-subscriptions",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.messages.unsubscribe",
		"sessions-subscriptions",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.viewers.set",
		"sessions-subscriptions",
		"operator.read",
		"2026.7"
	],
	[
		"sessions.preview",
		"sessions-read",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.describe",
		"sessions-read",
		"operator.read",
		"<=2026.7",
		{ lifetime: "observation" }
	],
	[
		"sessions.branches.list",
		"sessions-rewind",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.branches.switch",
		"sessions-rewind",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.rewind",
		"sessions-rewind",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.fork",
		"sessions-rewind",
		"operator.write",
		"<=2026.7"
	],
	[
		"sessions.create",
		"sessions-create",
		"dynamic",
		"<=2026.7",
		{ startup: true }
	],
	[
		"sessions.recover",
		"sessions-recover",
		"operator.write",
		"2026.8",
		{ startup: true }
	],
	[
		"sessions.send",
		"sessions-messaging",
		"operator.write",
		"<=2026.7",
		{ startup: true }
	],
	[
		"sessions.abort",
		"sessions-abort",
		"operator.write",
		"<=2026.7",
		{ startup: true }
	],
	[
		"sessions.patch",
		"sessions-mutations",
		"dynamic",
		"<=2026.7"
	],
	[
		"sessions.goal.update",
		"sessions-goal",
		"operator.write",
		"2026.8"
	],
	[
		"sessions.goal.clear",
		"sessions-goal",
		"operator.write",
		"2026.8"
	],
	[
		"sessions.pluginPatch",
		"sessions-mutations",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.cleanup",
		"sessions-read",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.reset",
		"sessions-mutations",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.delete",
		"sessions-delete",
		"dynamic",
		"<=2026.7"
	],
	[
		"sessions.compact",
		"sessions-compact",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.groups.list",
		"sessions-groups",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.groups.defaults",
		"sessions-groups",
		"operator.write",
		"2026.8"
	],
	[
		"sessions.groups.put",
		"sessions-groups",
		"operator.write",
		"<=2026.7"
	],
	[
		"sessions.groups.rename",
		"sessions-groups",
		"operator.write",
		"<=2026.7"
	],
	[
		"sessions.groups.update",
		"sessions-groups",
		"operator.write",
		"2026.8"
	],
	[
		"sessions.groups.delete",
		"sessions-groups",
		"operator.write",
		"<=2026.7"
	],
	[
		"last-heartbeat",
		"system",
		"operator.read",
		"<=2026.7"
	],
	[
		"set-heartbeats",
		"system",
		"operator.admin",
		"<=2026.7"
	],
	[
		"wake",
		"cron",
		"operator.write",
		"<=2026.7"
	],
	[
		"node.pair.list",
		"nodes",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"node.pair.approve",
		"nodes",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"node.pair.reject",
		"nodes",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"node.pair.remove",
		"nodes",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.pair.list",
		"devices",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.pair.approve",
		"devices",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.pair.reject",
		"devices",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.pair.remove",
		"devices",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.pair.rename",
		"devices",
		"operator.pairing",
		"2026.7"
	],
	[
		"device.token.rotate",
		"devices",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.token.revoke",
		"devices",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.pair.setupCode",
		"device-pair-setup",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"device.pair.setupStatus",
		"device-pair-setup",
		"operator.admin",
		"2026.8",
		{ advertise: false }
	],
	[
		"node.rename",
		"nodes",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"node.list",
		"nodes",
		"operator.read",
		"<=2026.7"
	],
	[
		"node.describe",
		"nodes",
		"operator.read",
		"<=2026.7"
	],
	[
		"node.pluginSurface.refresh",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.pluginTools.update",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.skills.update",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.runnerInventory.update",
		"nodes",
		"node",
		"2026.8",
		{ advertise: false }
	],
	[
		"node.pending.drain",
		"nodes-pending",
		"node",
		"<=2026.7"
	],
	[
		"node.pending.enqueue",
		"nodes-pending",
		"operator.write",
		"<=2026.7"
	],
	[
		"node.invoke",
		"nodes",
		"dynamic",
		"<=2026.7"
	],
	[
		"node.pending.pull",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.pending.ack",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.invoke.progress",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.invoke.result",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.event",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"cron.get",
		"cron",
		"operator.read",
		"<=2026.7"
	],
	[
		"cron.list",
		"cron",
		"operator.read",
		"<=2026.7"
	],
	[
		"cron.status",
		"cron",
		"operator.read",
		"<=2026.7"
	],
	[
		"cron.scratch.get",
		"cron",
		"operator.admin",
		"2026.7"
	],
	[
		"cron.scratch.set",
		"cron",
		"operator.admin",
		"2026.7"
	],
	[
		"cron.add",
		"cron",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"cron.update",
		"cron",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"cron.remove",
		"cron",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"cron.run",
		"cron",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"cron.runs",
		"cron",
		"operator.read",
		"<=2026.7"
	],
	[
		"gateway.identity.get",
		"system",
		"operator.read",
		"<=2026.7"
	],
	[
		"gateway.restart.preflight",
		"restart",
		"operator.read",
		"<=2026.7",
		{ compatibilityRestored: true }
	],
	[
		"gateway.restart.request",
		"restart",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"system-presence",
		"system",
		"operator.read",
		"<=2026.7"
	],
	[
		"system-event",
		"system",
		"operator.admin",
		"<=2026.7"
	],
	[
		"message.action",
		"send",
		"operator.write",
		"<=2026.7"
	],
	[
		"conversations.send",
		"conversations",
		"operator.admin",
		"<=2026.7"
	],
	[
		"conversations.turn",
		"conversations",
		"operator.admin",
		"<=2026.7"
	],
	[
		"conversations.turn.cancel",
		"conversations",
		"operator.admin",
		"<=2026.7"
	],
	[
		"send",
		"send",
		"operator.write",
		"<=2026.7"
	],
	[
		"agent",
		"agent",
		"dynamic",
		"<=2026.7",
		{ startup: true }
	],
	[
		"agent.identity.get",
		"agent-identity",
		"operator.read",
		"<=2026.7"
	],
	[
		"agent.wait",
		"agent",
		"operator.write",
		"<=2026.7",
		{
			startup: true,
			lifetime: "observation"
		}
	],
	[
		"chat.history",
		"chat",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"chat.startup",
		"chat",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"chat.metadata",
		"chat",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"chat.message.get",
		"chat",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"chat.abort",
		"chat-abort",
		"operator.write",
		"<=2026.7"
	],
	[
		"chat.send",
		"chat-send",
		"operator.write",
		"<=2026.7",
		{ startup: true }
	],
	[
		"terminal.open",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"terminal.input",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"terminal.resize",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"terminal.close",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"channels.pairing.list",
		"channel-pairing",
		"operator.pairing",
		"2026.7"
	],
	[
		"channels.pairing.approve",
		"channel-pairing",
		"dynamic",
		"2026.7"
	],
	[
		"channels.pairing.dismiss",
		"channel-pairing",
		"operator.pairing",
		"2026.7"
	],
	[
		"assistant.media.get",
		null,
		"operator.read",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"sessions.get",
		"sessions-read",
		"operator.read",
		"<=2026.7",
		{
			advertise: false,
			lifetime: "observation"
		}
	],
	[
		"sessions.resolve",
		"sessions-read",
		"operator.read",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"sessions.usage",
		"usage",
		"operator.read",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"sessions.usage.timeseries",
		"usage",
		"operator.read",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"sessions.usage.logs",
		"usage",
		"operator.read",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"poll",
		"send",
		"operator.write",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"sessions.steer",
		"sessions-messaging",
		"operator.write",
		"<=2026.7",
		{
			advertise: false,
			description: "Deprecated alias for chat.send queueMode interrupt; removal per protocol deprecation policy."
		}
	],
	[
		"push.test",
		"push",
		"operator.write",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"attach.grant",
		"attach",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"attach.revoke",
		"attach",
		"operator.admin",
		"<=2026.7"
	],
	[
		"push.web.vapidPublicKey",
		"push",
		"operator.write",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"push.web.subscribe",
		"push",
		"operator.write",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"push.web.unsubscribe",
		"push",
		"operator.write",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"push.web.test",
		"push",
		"operator.write",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"push.web.preferences.get",
		"push",
		"operator.read",
		"2026.8"
	],
	[
		"push.web.preferences.set",
		"push",
		"operator.write",
		"2026.8"
	],
	[
		"config.openFile",
		"config",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"connect",
		"connect",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"chat.inject",
		"chat",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"nativeHook.invoke",
		"native-hook-relay",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"web.login.start",
		"web",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"web.login.wait",
		"web",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"terminal.attach",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"terminal.list",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"controlUi.githubPreview",
		"control-ui",
		"operator.read",
		"<=2026.7"
	],
	[
		"system.info",
		"system",
		"operator.read",
		"<=2026.7"
	],
	[
		"agents.workspace.list",
		"agents-workspace",
		"operator.read",
		"2026.7"
	],
	[
		"agents.workspace.get",
		"agents-workspace",
		"operator.read",
		"2026.7"
	],
	[
		"tts.speak",
		"tts",
		"operator.write",
		"2026.7"
	],
	[
		"plugins.list",
		"plugins",
		"operator.read",
		"<=2026.7"
	],
	[
		"plugins.search",
		"plugins",
		"operator.read",
		"<=2026.7"
	],
	[
		"plugins.install",
		"plugins-mutations",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"plugins.setEnabled",
		"plugins-mutations",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"plugins.uninstall",
		"plugins-mutations",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"plugins.refresh",
		"plugins-mutations",
		"operator.admin",
		"<=2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"controlUi.sessionPullRequests.subscribe",
		"control-ui",
		"operator.read",
		"2026.7"
	],
	[
		"controlUi.sessionPreview",
		"control-ui",
		"operator.read",
		"2026.8"
	],
	[
		"gateway.suspend.prepare",
		"suspend",
		"operator.admin",
		"2026.7",
		SIDECAR_CONTROL_PLANE_WRITE
	],
	[
		"gateway.suspend.status",
		"suspend",
		"operator.read",
		"2026.7"
	],
	[
		"gateway.suspend.resume",
		"suspend",
		"operator.admin",
		"2026.7"
	],
	[
		"chat.toolTitles",
		"chat",
		"operator.write",
		"<=2026.7"
	],
	[
		"sessions.diff",
		"sessions-diff",
		"operator.read",
		"<=2026.7"
	],
	[
		"openclaw.setup.verify",
		"system-agent",
		"operator.admin",
		"<=2026.7"
	],
	[
		"environments.create",
		"environments",
		"operator.admin",
		"2026.7",
		SIDECAR_CONTROL_PLANE_WRITE
	],
	[
		"environments.destroy",
		"environments",
		"operator.admin",
		"2026.7",
		SIDECAR_CONTROL_PLANE_WRITE
	],
	[
		"sessions.catalog.list",
		"session-catalog",
		"operator.read",
		"2026.7"
	],
	[
		"sessions.catalog.read",
		"session-catalog",
		"operator.read",
		"2026.7"
	],
	[
		"terminal.upload",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"sessions.catalog.continue",
		"session-catalog",
		"operator.write",
		"2026.7"
	],
	[
		"sessions.catalog.archive",
		"session-catalog",
		"operator.write",
		"2026.7"
	],
	[
		"approval.get",
		null,
		"operator.approvals",
		"2026.7"
	],
	[
		"approval.resolve",
		null,
		"operator.approvals",
		"2026.7"
	],
	[
		"sessions.search",
		"sessions-read",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.dispatch",
		"sessions-dispatch",
		"dynamic",
		"2026.7",
		SIDECAR_CONTROL_PLANE_WRITE
	],
	[
		"sessions.reclaim",
		"sessions-dispatch",
		"operator.write",
		"2026.7",
		SIDECAR_CONTROL_PLANE_WRITE
	],
	[
		"models.probe",
		"models-probe",
		"operator.admin",
		"<=2026.7"
	],
	[
		"migrations.memory.plan",
		"migrations",
		"operator.admin",
		"2026.7"
	],
	[
		"migrations.memory.apply",
		"migrations",
		"operator.admin",
		"2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"ui.command",
		"ui-command",
		"operator.write",
		"2026.7"
	],
	[
		"approval.history",
		null,
		"operator.approvals",
		"2026.7"
	],
	[
		"plugin.surface.refresh",
		"nodes",
		"operator.read",
		"<=2026.7"
	],
	[
		"conversations.list",
		"conversations",
		"operator.admin",
		"<=2026.7"
	],
	[
		"session.discussion.info",
		"session-discussion",
		"operator.read",
		"2026.7"
	],
	[
		"session.discussion.open",
		"session-discussion",
		"operator.write",
		"2026.7"
	],
	[
		"board.prompt.authorize",
		"board",
		"operator.read",
		"2026.7"
	],
	[
		"board.data.read",
		"board",
		"operator.read",
		"2026.7"
	],
	[
		"board.action",
		"board",
		"operator.write",
		"2026.7"
	],
	[
		"sessions.observer.visibility",
		"session-observer-rpc",
		"operator.read",
		"2026.7"
	],
	[
		"session.visibility.set",
		"sessions-sharing",
		"operator.write",
		"2026.7"
	],
	[
		"session.members.list",
		"sessions-sharing",
		"operator.read",
		"2026.7"
	],
	[
		"session.members.add",
		"sessions-sharing",
		"operator.write",
		"2026.7"
	],
	[
		"session.members.remove",
		"sessions-sharing",
		"operator.write",
		"2026.7"
	],
	[
		"session.suggestions.add",
		"sessions-suggestions",
		"operator.write",
		"2026.7"
	],
	[
		"session.suggestions.list",
		"sessions-suggestions",
		"operator.read",
		"2026.7"
	],
	[
		"session.suggestions.resolve",
		"sessions-suggestions",
		"operator.write",
		"2026.7"
	],
	[
		"session.reactions.set",
		"sessions-reactions",
		"operator.write",
		"2026.9"
	],
	[
		"session.reactions.list",
		"sessions-reactions",
		"operator.read",
		"2026.9"
	],
	[
		"session.typing",
		"sessions-suggestions",
		"operator.write",
		"2026.7"
	],
	[
		"sessions.companion.ask",
		"session-companion-rpc",
		"operator.read",
		"2026.7"
	],
	[
		"sessions.companion.state",
		"session-companion-rpc",
		"operator.read",
		"2026.7"
	],
	[
		"sessions.companion.reset",
		"session-companion-rpc",
		"operator.write",
		"2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"memory.search",
		"memory-search",
		"operator.read",
		"2026.7"
	],
	[
		"skills.proposals.events.list",
		"skills",
		"operator.read",
		"2026.7"
	],
	[
		"skills.proposals.evaluate",
		"skills",
		"operator.admin",
		"2026.7",
		CONTROL_PLANE_WRITE
	],
	[
		"hooks.status",
		"hooks-status",
		"operator.read",
		"2026.7"
	],
	[
		"audit.run.inspect",
		"audit",
		"operator.read",
		"2026.7"
	],
	[
		"sessions.patchMany",
		"sessions-mutations",
		"dynamic",
		"2026.8"
	],
	[
		"update.hold",
		"update",
		"operator.admin",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"sessions.catalog.startTerminal",
		"session-catalog",
		"operator.admin",
		"2026.8"
	],
	[
		"worker.desktop.observe",
		"environments",
		"operator.admin",
		"2026.8",
		{ startup: true }
	],
	[
		"projects.list",
		"projects",
		"operator.read",
		"2026.8"
	],
	[
		"projects.register",
		"projects",
		"operator.admin",
		"2026.8"
	],
	[
		"projects.remove",
		"projects",
		"operator.admin",
		"2026.8"
	],
	[
		"worker.desktop.launch",
		"environments",
		"operator.admin",
		"2026.8",
		{ startup: true }
	],
	[
		"secrets.store.list",
		null,
		"operator.admin",
		"2026.8"
	],
	[
		"secrets.store.set",
		null,
		"operator.admin",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"secrets.store.delete",
		null,
		"operator.admin",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"users.prefs.get",
		"users",
		"operator.read",
		"2026.8"
	],
	[
		"users.prefs.set",
		"users",
		"operator.write",
		"2026.8"
	],
	[
		"projects.add",
		"projects",
		"operator.write",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"projects.searchRemote",
		"projects",
		"operator.read",
		"2026.8",
		{ description: "Search GitHub repositories that can be cloned as managed projects." }
	],
	[
		"desktop.observe",
		"environments",
		"operator.admin",
		"2026.8",
		{ startup: true }
	],
	[
		"desktop.launch",
		"environments",
		"operator.admin",
		"2026.8",
		{ startup: true }
	],
	[
		"device.scopes.requestUpgrade",
		"devices",
		"operator.read",
		"2026.8"
	],
	[
		"device.scopes.waitUpgrade",
		"devices",
		"operator.read",
		"2026.8",
		OBSERVATION
	],
	[
		"portal.list",
		"portals",
		"operator.read",
		"2026.8"
	],
	[
		"portal.open",
		"portals",
		"operator.write",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"portal.close",
		"portals",
		"operator.write",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"sessions.move",
		"sessions-dispatch",
		"dynamic",
		"2026.8",
		SIDECAR_CONTROL_PLANE_WRITE
	],
	[
		"sessions.assignOwner",
		"sessions-mutations",
		"operator.write",
		"2026.8"
	],
	[
		"progressCard.get",
		"progress-card",
		"operator.read",
		"2026.8"
	],
	[
		"progressCard.put",
		"progress-card",
		"operator.write",
		"2026.8"
	],
	[
		"tools.github.status",
		"tools-github",
		"operator.read",
		"2026.8"
	],
	[
		"tools.github.configure",
		"tools-github",
		"operator.admin",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"tools.github.authorize.start",
		"tools-github",
		"operator.admin",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"tools.github.authorize.poll",
		"tools-github",
		"operator.admin",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"tools.github.authorize.cancel",
		"tools-github",
		"operator.admin",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"sessions.github.publish",
		"sessions-github",
		"operator.sessions.write",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"diagnostics.lanes",
		"diagnostics",
		"operator.read",
		"2026.8"
	],
	[
		"session.members.listEvidence",
		"sessions-sharing",
		"operator.read",
		"2026.8"
	],
	[
		"plugins.inspect",
		"plugins",
		"operator.read",
		"2026.8"
	],
	[
		"users.github.status",
		"users",
		"operator.read",
		"2026.8",
		{ startup: true }
	],
	[
		"users.github.authorize.start",
		"users",
		"operator.read",
		"2026.8",
		SIDECAR_CONTROL_PLANE_WRITE
	],
	[
		"users.github.authorize.poll",
		"users",
		"operator.read",
		"2026.8",
		SIDECAR_CONTROL_PLANE_WRITE
	],
	[
		"users.github.authorize.cancel",
		"users",
		"operator.read",
		"2026.8",
		SIDECAR_CONTROL_PLANE_WRITE
	],
	[
		"users.github.disconnect",
		"users",
		"operator.read",
		"2026.8",
		SIDECAR_CONTROL_PLANE_WRITE
	],
	[
		"sessions.github.options",
		"sessions-github",
		"operator.read",
		"2026.8",
		{ startup: true }
	],
	[
		"sessions.github.status",
		"sessions-github",
		"operator.read",
		"2026.8",
		{ startup: true }
	],
	[
		"sessions.github.confirm",
		"sessions-github",
		"operator.write",
		"2026.8",
		SIDECAR_CONTROL_PLANE_WRITE
	],
	[
		"sessions.title.prepare",
		"sessions-title",
		"operator.write",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"users.mentionable",
		"users-mentionable",
		"operator.read",
		"2026.8",
		{ startup: true }
	],
	[
		"mentions.list",
		"mentions",
		"operator.read",
		"2026.8",
		{ startup: true }
	],
	[
		"mentions.dismiss",
		"mentions",
		"operator.read",
		"2026.8",
		{ startup: true }
	],
	[
		"transcripts.list",
		"transcripts",
		"operator.read",
		"2026.8"
	],
	[
		"transcripts.get",
		"transcripts",
		"operator.read",
		"2026.8"
	],
	[
		"models.authOrderSet",
		"models-auth-order",
		"operator.admin",
		"2026.8",
		CONTROL_PLANE_WRITE
	],
	[
		"canvas.document.view",
		"canvas",
		"operator.read",
		"2026.9"
	],
	[
		"plugins.controlUi.list",
		"plugins-control-ui",
		"operator.read",
		"2026.9"
	],
	[
		"plugins.controlUi.reload",
		"plugins-control-ui",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"plugins.controlUi.report",
		"plugins-control-ui",
		"operator.read",
		"2026.9"
	],
	[
		"plugins.controlUi.status",
		"plugins-control-ui",
		"operator.admin",
		"2026.9"
	],
	[
		"update.runs.get",
		"update",
		"operator.admin",
		"2026.9"
	],
	[
		"update.runs.list",
		"update",
		"operator.admin",
		"2026.9"
	],
	[
		"gateway.suspend.handoff",
		"suspend",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"transcripts.export",
		"transcripts",
		"operator.read",
		"2026.9"
	],
	[
		"transcripts.status",
		"transcripts",
		"operator.read",
		"2026.9"
	],
	[
		"update.report",
		"update",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"skills.workshop.read",
		"skills",
		"operator.read",
		"2026.9"
	],
	[
		"session.publicShare.set",
		"sessions-sharing",
		"operator.write",
		"2026.9"
	],
	[
		"claws.monitors",
		"claws-monitors",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"plugins.catalog.browse",
		"plugins",
		"operator.read",
		"2026.9"
	],
	[
		"plugins.catalog.categories",
		"plugins",
		"operator.read",
		"2026.9"
	],
	[
		"plugins.catalog.get",
		"plugins",
		"operator.read",
		"2026.9"
	],
	[
		"environments.prepare",
		"environments",
		"operator.admin",
		"2026.9",
		SIDECAR_CONTROL_PLANE_WRITE
	],
	[
		"models.authRefresh",
		"models-auth-status",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"models.authLogin",
		"models-auth-login",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"models.authSetApiKey",
		"models-auth-status",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"sessions.storage.status",
		"sessions-read",
		"operator.admin",
		"2026.9"
	],
	[
		"sessions.storage.run",
		"sessions-read",
		"operator.admin",
		"2026.9"
	],
	[
		"plugins.reload",
		"plugins-mutations",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"claws.packages.remove",
		"claws-packages",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"canvas.document.preview",
		"canvas",
		"operator.read",
		"2026.9"
	],
	[
		"computer.status",
		"computer",
		"operator.read",
		"2026.9"
	],
	[
		"computer.invoke",
		"computer",
		"operator.write",
		"2026.9"
	],
	[
		"sessions.activitySummary.ensure",
		"session-activity-summary",
		"operator.write",
		"2026.9"
	],
	[
		"controlUi.sessionPullRequests.checks",
		"control-ui",
		"operator.read",
		"2026.9"
	],
	[
		"diagnostics.cpuProfile",
		"diagnostics",
		"operator.admin",
		"2026.9"
	],
	[
		"talk.voice.get",
		"talk",
		"operator.talk",
		"2026.9"
	],
	[
		"talk.voice.set",
		"talk",
		"operator.talk",
		"2026.9"
	],
	[
		"talk.voice.complete",
		"talk",
		"operator.talk",
		"2026.9"
	],
	[
		"plugins.credentials.inspect",
		"plugins",
		"operator.admin",
		"2026.9"
	],
	[
		"plugins.skills.read",
		"plugins",
		"operator.read",
		"2026.9"
	],
	[
		"diagnostics.heapProfile",
		"diagnostics",
		"operator.admin",
		"2026.9"
	],
	[
		"desktop.release",
		"environments",
		"operator.admin",
		"2026.9",
		{ startup: true }
	],
	[
		"mcp.authLogin",
		"mcp-auth-login",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"environments.session.status",
		"environments",
		"operator.read",
		"2026.9"
	],
	[
		"environments.session.create",
		"environments",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"environments.session.destroy",
		"environments",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"environments.session.exec",
		"environments",
		"operator.admin",
		"2026.9"
	],
	[
		"sessions.setInvolvement",
		"sessions-mutations",
		"operator.read",
		"2026.9"
	],
	[
		"transcripts.summarize",
		"transcripts",
		"operator.write",
		"2026.9"
	],
	[
		"controlUi.linkPreview",
		"control-ui",
		"operator.read",
		"2026.9"
	],
	[
		"themes.list",
		"themes",
		"operator.read",
		"2026.9"
	],
	[
		"themes.get",
		"themes",
		"operator.read",
		"2026.9"
	],
	[
		"themes.set",
		"themes",
		"operator.write",
		"2026.9"
	],
	[
		"themes.import",
		"themes",
		"operator.write",
		"2026.9"
	],
	[
		"controlUi.githubDetail",
		"control-ui",
		"operator.read",
		"2026.9"
	],
	[
		"progressCard.refresh",
		"progress-card",
		"operator.write",
		"2026.9"
	],
	[
		"webSearch.status",
		"web-search",
		"operator.read",
		"2026.9"
	],
	[
		"webSearch.test",
		"web-search",
		"operator.admin",
		"2026.9"
	],
	[
		"sessions.providerReview.continue",
		"sessions-provider-review",
		"operator.write",
		"2026.9"
	],
	[
		"users.linkChannelIdentity",
		"users",
		"operator.admin",
		"2026.9"
	],
	[
		"users.unlinkChannelIdentity",
		"users",
		"operator.admin",
		"2026.9"
	],
	[
		"users.listChannelIdentities",
		"users",
		"operator.admin",
		"2026.9"
	],
	[
		"users.personalFile.get",
		"users",
		"operator.read",
		"2026.9"
	],
	[
		"users.personalFile.set",
		"users",
		"operator.read",
		"2026.9"
	],
	[
		"portal.session.list",
		"portals",
		"operator.write",
		"2026.9",
		PORTAL_SESSION_WRITE
	],
	[
		"portal.session.open",
		"portals",
		"operator.write",
		"2026.9",
		PORTAL_SESSION_WRITE
	],
	[
		"portal.session.close",
		"portals",
		"operator.write",
		"2026.9",
		PORTAL_SESSION_WRITE
	],
	[
		"cron.history",
		"cron",
		"operator.read",
		"2026.9"
	],
	[
		"presence.activity",
		"system",
		"operator.read",
		"2026.9"
	],
	[
		"presence.query",
		"presence",
		"operator.read",
		"2026.9"
	],
	[
		"users.merge",
		"users",
		"operator.admin",
		"2026.9"
	],
	[
		"gateway.stop.request",
		"restart",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"diagnostics.heapSnapshot",
		"diagnostics",
		"operator.admin",
		"2026.9"
	],
	[
		"sessions.catalog.import",
		"session-catalog",
		"operator.write",
		"2026.9"
	],
	[
		"backup.status",
		"backup",
		"operator.read",
		"2026.9"
	],
	[
		"storage.locations.list",
		"storage",
		"operator.read",
		"2026.9"
	],
	[
		"storage.locations.probe",
		"storage",
		"operator.read",
		"2026.9"
	],
	[
		"mcp.app.onboard",
		"mcp-app-onboarding",
		"operator.write",
		"2026.9",
		SESSION_WRITE
	],
	[
		"mcp.app.discover",
		"mcp-app-extensions",
		"operator.write",
		"2026.9",
		SESSION_WRITE
	],
	[
		"mcp.app.launch",
		"mcp-app-extensions",
		"operator.write",
		"2026.9",
		SESSION_WRITE
	],
	[
		"mcp.app.settings",
		"mcp-app-extensions",
		"operator.write",
		"2026.9",
		SESSION_WRITE
	],
	[
		"mcp.app.mention",
		"mcp-app-extensions",
		"operator.write",
		"2026.9",
		SESSION_WRITE
	],
	[
		"mcp.app.formResource",
		"mcp-app",
		"operator.write",
		"2026.9"
	],
	[
		"mcp.app.modelContext",
		"mcp-app",
		"operator.read",
		"2026.9"
	],
	[
		"mcp.app.removeModelContext",
		"mcp-app",
		"operator.write",
		"2026.9"
	],
	[
		"mcp.app.writeResource",
		"mcp-app",
		"operator.write",
		"2026.9"
	],
	[
		"mcp.app.subscribeResource",
		"mcp-app",
		"operator.read",
		"2026.9"
	],
	[
		"mcp.app.unsubscribeResource",
		"mcp-app",
		"operator.read",
		"2026.9"
	],
	[
		"mcp.app.openFile",
		"mcp-app",
		"operator.read",
		"2026.9"
	],
	[
		"memory.get",
		"memory-search",
		"operator.read",
		"2026.9"
	],
	[
		"memory.status",
		"memory-search",
		"operator.read",
		"2026.9"
	],
	[
		"sessions.files.assets",
		"sessions-files",
		"operator.read",
		"2026.9"
	],
	[
		"worktrees.recoverRemoval",
		"worktrees",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	],
	[
		"worktrees.retireSnapshot",
		"worktrees",
		"operator.admin",
		"2026.9",
		CONTROL_PLANE_WRITE
	]
];
/** Scope marker for methods whose handler derives the required operator scope at runtime. */
const DYNAMIC_GATEWAY_METHOD_SCOPE = "dynamic";
//#endregion
//#region src/gateway/methods/core-method-policy.ts
const CORE_GATEWAY_METHOD_SPEC_LIST = CORE_GATEWAY_METHOD_SPECS.map(([name, family, scope, since, policy]) => Object.assign({
	name,
	scope,
	since,
	...family ? { family } : {}
}, policy));
const CORE_GATEWAY_METHOD_SPEC_BY_NAME = new Map(CORE_GATEWAY_METHOD_SPEC_LIST.map((spec) => [spec.name, spec]));
CORE_GATEWAY_METHOD_SPEC_LIST.filter((spec) => spec.startup === true).map((spec) => spec.name);
/** Looks up an operator-only core method scope, excluding node and dynamic methods. */
function resolveCoreOperatorGatewayMethodScope(method) {
	const scope = CORE_GATEWAY_METHOD_SPEC_BY_NAME.get(method)?.scope;
	return scope === "node" || scope === "dynamic" ? void 0 : scope;
}
/** Returns true for core methods whose required operator scope is resolved by the handler. */
function isDynamicOperatorGatewayMethod(method) {
	return CORE_GATEWAY_METHOD_SPEC_BY_NAME.get(method)?.scope === DYNAMIC_GATEWAY_METHOD_SCOPE;
}
/** Returns true when a method name has an explicit core policy entry. */
function isCoreGatewayMethodClassified(method) {
	return CORE_GATEWAY_METHOD_SPEC_BY_NAME.has(method);
}
//#endregion
//#region src/gateway/node-browser-proxy-policy.ts
function isForbiddenBrowserProxyMutation(params) {
	if (!params || typeof params !== "object") return false;
	const candidate = params;
	const method = normalizeOptionalString(candidate.method)?.toUpperCase();
	const path = normalizeOptionalString(candidate.path);
	if (!method || !path) return false;
	const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
	const normalizedPath = withLeadingSlash.length <= 1 ? withLeadingSlash : withLeadingSlash.replace(/\/+$/, "");
	if (method === "POST" && (normalizedPath === "/profiles/create" || normalizedPath === "/reset-profile")) return true;
	return method === "DELETE" && /^\/profiles\/[^/]+$/.test(normalizedPath);
}
//#endregion
//#region src/gateway/method-scopes.ts
/** Default scopes granted to CLI/operator clients when no narrower local policy is known. */
const CLI_DEFAULT_OPERATOR_SCOPES = [
	ADMIN_SCOPE,
	READ_SCOPE,
	WRITE_SCOPE,
	APPROVALS_SCOPE,
	QUESTIONS_SCOPE,
	PAIRING_SCOPE,
	TALK_SECRETS_SCOPE
];
function resolveScopedMethod(method) {
	const explicitScope = resolveCoreOperatorGatewayMethodScope(method);
	if (explicitScope) return explicitScope;
	const reservedScope = resolveReservedGatewayMethodScope(method);
	if (reservedScope) return reservedScope;
	const pluginScope = (getPluginRegistryForContext()?.gatewayMethodDescriptors?.find((descriptor) => descriptor.name === method))?.scope;
	return pluginScope === "node" || pluginScope === "dynamic" ? void 0 : pluginScope;
}
function resolveSessionActionRegisteredScopes(params) {
	const record = asOptionalRecord(params);
	if (!record) return;
	const pluginId = normalizeOptionalString(record.pluginId);
	const actionId = normalizeOptionalString(record.actionId);
	if (!pluginId || !actionId) return;
	const registration = getPluginRegistryForContext()?.sessionActions?.find((entry) => entry.pluginId === pluginId && entry.action.id === actionId);
	if (!registration) return;
	const requiredScopes = registration.action.requiredScopes;
	return requiredScopes && requiredScopes.length > 0 ? [...requiredScopes] : [WRITE_SCOPE];
}
function resolveSessionActionLeastPrivilegeScopes(params) {
	const registeredScopes = resolveSessionActionRegisteredScopes(params);
	if (registeredScopes) return registeredScopes;
	const record = asOptionalRecord(params);
	if (record) {
		const pluginId = normalizeOptionalString(record.pluginId);
		const actionId = normalizeOptionalString(record.actionId);
		if (pluginId && actionId) return [...CLI_DEFAULT_OPERATOR_SCOPES];
	}
	return [WRITE_SCOPE];
}
function resolveDynamicLeastPrivilegeOperatorScopesForMethod(method, params) {
	if (method === "plugins.sessionAction") return resolveSessionActionLeastPrivilegeScopes(params);
	const record = asOptionalRecord(params);
	if (method === "agent") return isAgentSessionResetCommand(record?.message) ? [ADMIN_SCOPE] : [WRITE_SCOPE];
	if (method === "node.invoke") {
		const command = record?.command;
		if (isBrowserProxyNodeInvokeCommand(command) && isForbiddenBrowserProxyMutation(record?.params)) return [WRITE_SCOPE];
		return isAdminOnlyNodeInvokeCommand(command) ? [ADMIN_SCOPE] : [WRITE_SCOPE];
	}
	if (method === "talk.config") return record?.includeSecrets === true ? [READ_SCOPE, TALK_SECRETS_SCOPE] : [READ_SCOPE];
	if (method === "environments.list") {
		const runtimeId = record && "runtimeId" in record ? record.runtimeId : void 0;
		return typeof runtimeId === "string" && runtimeId ? [WRITE_SCOPE] : [READ_SCOPE];
	}
	if (method === "channels.pairing.approve") return record?.bootstrapCommandOwner === true ? [PAIRING_SCOPE, ADMIN_SCOPE] : [PAIRING_SCOPE];
	if (method === "fs.listDir") return [record && Object.hasOwn(record, "nodeId") ? ADMIN_SCOPE : WRITE_SCOPE];
	if (method === "sessions.patch" || method === "sessions.patchMany" || method === "sessions.create" || method === "sessions.dispatch" || method === "sessions.move") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.write"];
	if (method === "sessions.delete") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.admin"];
	return [WRITE_SCOPE];
}
/** Returns the narrowest known operator scopes needed to call a gateway method. */
function resolveLeastPrivilegeOperatorScopesForMethod(method, params) {
	if (isDynamicOperatorGatewayMethod(method)) return resolveDynamicLeastPrivilegeOperatorScopesForMethod(method, params);
	const requiredScope = resolveScopedMethod(method);
	if (requiredScope) return [requiredScope];
	return [];
}
/** Returns true when a method has any core, node, dynamic, reserved, or plugin scope policy. */
function isGatewayMethodClassified(method) {
	return isCoreGatewayMethodClassified(method) || resolveScopedMethod(method) !== void 0;
}
//#endregion
//#region src/gateway/operator-cli-message-input.ts
/** Operator message RPCs cannot preserve the source of an agent's shell report. */
function assertGatewayCliMessageContext(method, params) {
	const agentExec = process.env.OPENCLAW_SHELL === "exec";
	const subagentExec = process.env[SUBAGENT_EXEC_ENV_VAR] === "1";
	if (!agentExec && !subagentExec) return;
	const sessionMessage = [
		"sessions.send",
		"sessions.steer",
		"chat.send"
	].includes(method);
	if (subagentExec && sessionMessage) throw new Error("Subagent session messages must use the task completion path. Return your result or blocker in the child turn; do not use the CLI to contact other sessions.");
	if (!agentExec) return;
	const input = method === "sessions.create" ? asNullableRecord(params) : null;
	if (input && ([input.message, input.task].some((value) => typeof value === "string" && value.trim()) || Array.isArray(input.attachments) && input.attachments.length > 0) || sessionMessage || method === "agent") throw new Error(`Gateway ${method} from agent exec would lose inter-session attribution. Use the attributed session-messaging tool available to this run, or return the result through normal subagent completion. Do not retry through another CLI route or remove the exec marker.`);
}
//#endregion
//#region src/gateway/transport-error.ts
var GatewayTransportError = class extends Error {
	constructor(params) {
		super(params.message);
		this.name = "GatewayTransportError";
		this.kind = params.kind;
		this.connectionDetails = params.connectionDetails;
		if (params.code !== void 0) this.code = params.code;
		if (params.reason !== void 0) this.reason = params.reason;
		if (params.timeoutMs !== void 0) this.timeoutMs = params.timeoutMs;
		if (params.requestDispatched !== void 0) this.requestDispatched = params.requestDispatched;
	}
};
const DISPATCHED_REQUEST_OUTCOME_GUIDANCE = "The request was already sent to the gateway, so the operation may have been applied even though no response arrived; its outcome is unknown. Verify the current state (for example, re-run the equivalent read-only command) before retrying, especially for write actions.";
function createGatewayCloseTransportError(params) {
	const { code, connectionDetails, requestDispatched } = params;
	const reason = normalizeOptionalString(params.reason) || "no close reason";
	const hint = code === 1006 ? "abnormal closure (no close frame)" : code === 1e3 ? "normal closure" : "";
	let message = `gateway closed (${code}${hint ? ` ${hint}` : ""}): ${reason}\n${connectionDetails.message}`;
	if (code === 1006) message += `\n\nPossible causes:\n${requestDispatched ? "- Connection dropped without a close frame (check network and gateway load)" : "- Connection dropped without a close frame (retry; check network and gateway load)\n- Gateway not yet ready to accept connections (retry after a moment)\n- TLS mismatch (connecting with ws:// to a wss:// gateway, or vice versa)"}
- Gateway process stopped or became unreachable (confirm it is still running)
Run \`openclaw doctor\` for diagnostics.`;
	return new GatewayTransportError({
		kind: "closed",
		code,
		reason,
		connectionDetails,
		requestDispatched,
		message: requestDispatched ? `${message}\n\n${DISPATCHED_REQUEST_OUTCOME_GUIDANCE}` : message
	});
}
function createGatewayTimeoutTransportError(params) {
	const { timeoutMs, connectionDetails, requestDispatched } = params;
	const message = `gateway timeout after ${timeoutMs}ms\n${connectionDetails.message}`;
	return new GatewayTransportError({
		kind: "timeout",
		timeoutMs,
		connectionDetails,
		requestDispatched,
		message: requestDispatched ? `${message}\n\n${DISPATCHED_REQUEST_OUTCOME_GUIDANCE}` : message
	});
}
//#endregion
//#region src/gateway/call.ts
function firstGatewayErrorLine(message) {
	return message.split("\n", 1)[0]?.trim() || message;
}
const GATEWAY_UNREACHABLE_SOCKET_CODES = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"ETIMEDOUT"
]);
function isGatewayUnreachableSocketError(error) {
	const code = extractErrorCodeOrErrno(error);
	return code !== void 0 && GATEWAY_UNREACHABLE_SOCKET_CODES.has(code);
}
async function loadGatewayConfig() {
	return getRuntimeConfigSnapshot() ?? await readGatewayDispatchConfigWithShellEnvFallback();
}
async function stopGatewayClient(client) {
	try {
		await client.stopAndWait({ timeoutMs: 1e3 });
	} catch {
		client.stop();
	}
}
function resolveGatewayClientDisplayName(opts) {
	if (opts.clientDisplayName) return opts.clientDisplayName;
	const clientName = opts.clientName ?? GATEWAY_CLIENT_NAMES.CLI;
	if ((opts.mode ?? GATEWAY_CLIENT_MODES.CLI) !== GATEWAY_CLIENT_MODES.BACKEND && clientName !== GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT) return;
	const method = opts.method.trim();
	return method ? `gateway:${method}` : "gateway:request";
}
/**
* Load config for a fully flag-addressed connection. Config only supplies
* gateway.remote.edgeAuth here, so an unreadable or invalid config degrades to
* empty rather than blocking a connection the flags already describe.
*/
async function loadGatewayConfigForExplicitConnection() {
	try {
		return await loadGatewayConfig();
	} catch {
		return {};
	}
}
function resolveGatewayConfigPath(env) {
	return resolveConfigPath(env, resolveStateDir(env));
}
function buildGatewayConnectionDetails(options = {}) {
	return buildGatewayConnectionDetailsWithResolvers(options, {
		getRuntimeConfig: readGatewayDispatchConfig,
		resolveConfigPath: resolveGatewayConfigPath,
		resolveGatewayPort
	});
}
function resolveGatewayCallAuth(config) {
	return resolveGatewayAuthForConfig({
		config,
		env: process.env,
		tailscaleMode: config.gateway?.tailscale?.mode
	});
}
async function ensureGatewayCallCanAuthenticate(params) {
	const resolvedAuth = resolveGatewayCallAuth(params.context.config);
	const authMode = resolvedAuth.mode;
	if (authMode !== "token" && authMode !== "password") return;
	if (params.token || params.password || params.opts.approvalRuntimeToken) return;
	if (resolvedAuth.allowTailscale) return;
	if ((params.storedAuth === void 0 ? await loadStoredOperatorDeviceAuthToken(params.deviceIdentity, params.deviceAuthScope, params.opts.sharedStateMode) : params.storedAuth)?.token) return;
	throw new GatewayCredentialsRequiredError({
		method: params.opts.method,
		configPath: params.context.configPath
	});
}
function resolveGatewayCallTimeout(timeoutValue) {
	const resolvedHandshakeTimeoutMs = Boolean(process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS) || Boolean(isVitestRuntimeEnv() && process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS) ? resolvePreauthHandshakeTimeoutMs() : void 0;
	const defaultTimeoutMs = typeof resolvedHandshakeTimeoutMs === "number" && resolvedHandshakeTimeoutMs > 1e4 ? resolvedHandshakeTimeoutMs : 1e4;
	const explicitTimeoutMs = typeof timeoutValue === "number" && Number.isFinite(timeoutValue) ? timeoutValue : void 0;
	const startupTimeoutMs = explicitTimeoutMs ?? defaultTimeoutMs;
	const timeoutMs = timeoutValue === null ? null : explicitTimeoutMs ?? defaultTimeoutMs;
	return {
		timeoutMs,
		startupTimeoutMs,
		safeTimerTimeoutMs: resolveSafeTimeoutDelayMs(timeoutMs ?? startupTimeoutMs)
	};
}
async function resolveGatewayCallContext(opts) {
	const explicitAuth = resolveExplicitGatewayAuth({
		token: opts.token,
		password: opts.password
	});
	const urlOverride = resolveGatewayUrlOverride({
		gatewayUrl: opts.url,
		env: process.env,
		ignoreEnvUrlOverride: opts.ignoreEnvUrlOverride,
		localPortOverride: opts.localPortOverride
	}).url;
	const canSkipConfigLoad = canSkipGatewayConfigLoad({
		config: opts.config,
		urlOverride,
		explicitAuth
	});
	const explicitConnection = isExplicitGatewayConnection({
		config: opts.config,
		urlOverride,
		explicitAuth
	});
	const config = opts.config ?? (canSkipConfigLoad ? {} : explicitConnection ? await loadGatewayConfigForExplicitConnection() : await loadGatewayConfig());
	return {
		config,
		configPath: opts.configPath ?? resolveGatewayConfigPath(process.env),
		isRemoteMode: opts.localPortOverride === void 0 && config.gateway?.mode === "remote",
		explicitAuth
	};
}
function ensureRemoteModeUrlConfigured(params) {
	if (!params.context.isRemoteMode || params.urlOverrideSource || trimToUndefined(params.context.config.gateway?.remote?.url)) return;
	throw new Error([
		"gateway remote mode misconfigured: gateway.remote.url missing",
		`Config: ${params.context.configPath}`,
		"Fix: set gateway.remote.url, or set gateway.mode=local."
	].join("\n"));
}
/** Wrap raw socket-level connect failures (ECONNREFUSED etc.) into one actionable message. */
function createGatewayUnreachableTransportError(params) {
	const code = extractErrorCodeOrErrno(params.cause);
	return new GatewayTransportError({
		kind: "closed",
		reason: firstGatewayErrorLine(params.cause.message),
		connectionDetails: params.connectionDetails,
		message: [
			`Gateway not reachable at ${projectGatewayUrlForDiagnostics(params.connectionDetails.url)}${code ? ` (${code})` : ""}.`,
			"Start it with `openclaw gateway run` or check `openclaw gateway status`.",
			params.connectionDetails.message
		].join("\n")
	});
}
function createGatewayRequestAbortError(method) {
	return createAbortError(`gateway request aborted for ${method}`);
}
function isRequiredAgentRuntimeIdentityConnectError(err) {
	return err.message.includes("gateway rejected required agent runtime identity auth field; refusing to retry without it");
}
function isAllowlistedGatewayConnectRequestError(err) {
	if (err.name !== "GatewayClientRequestError") return false;
	return readConnectErrorDetailCode(err.details) === ConnectErrorDetailCodes.AUTH_RATE_LIMITED;
}
async function executeGatewayRequestWithScopes(params) {
	const { opts, scopes, url, token, password, edgeAuthHeaders, tlsFingerprint, timeoutMs, startupTimeoutMs, safeTimerTimeoutMs, deviceIdentity, deviceAuthScope, sshTunnel, storedAuth, surfaceGatewayClientRequestErrors } = params;
	return await new Promise((resolve, reject) => {
		if (opts.signal?.aborted) {
			reject(createGatewayRequestAbortError(opts.method));
			return;
		}
		let settled = false;
		let timer;
		const startAbort = new AbortController();
		let primaryRequestStarted = false;
		let suppressedPreHelloCleanCloses = 0;
		let connectionGeneration = 0;
		const cleanup = () => {
			startAbort.abort();
			opts.signal?.removeEventListener("abort", abortHandler);
			if (timer) clearTimeout(timer);
		};
		const stopClientThenSettle = (err, value) => {
			const complete = () => {
				if (err) reject(err);
				else resolve(value);
			};
			stopGatewayClient(client).finally(complete);
		};
		const stop = (err, value) => {
			if (settled) return;
			settled = true;
			cleanup();
			stopClientThenSettle(err, value);
		};
		const abortHandler = () => {
			if (settled) return;
			settled = true;
			cleanup();
			const err = createGatewayRequestAbortError(opts.method);
			const stopAfterAbortHook = () => stopClientThenSettle(err);
			if (!opts.onSignalAbort || !primaryRequestStarted) {
				stopAfterAbortHook();
				return;
			}
			const request = client.request.bind(client);
			Promise.resolve().then(() => opts.onSignalAbort?.(request)).catch(() => {}).finally(stopAfterAbortHook);
		};
		opts.signal?.addEventListener("abort", abortHandler, { once: true });
		const client = new GatewayClient({
			url,
			sshTunnel,
			token,
			password,
			edgeAuthHeaders,
			tlsFingerprint,
			preauthHandshakeTimeoutMs: opts.preauthHandshakeTimeoutMs,
			instanceId: opts.instanceId ?? randomUUID(),
			clientName: opts.clientName ?? GATEWAY_CLIENT_NAMES.CLI,
			clientDisplayName: resolveGatewayClientDisplayName(opts),
			clientVersion: opts.clientVersion ?? VERSION,
			caps: ["ultrafast", ...opts.caps ?? []],
			platform: opts.platform,
			mode: opts.mode ?? GATEWAY_CLIENT_MODES.CLI,
			...opts.approvalRuntimeToken ? { approvalRuntimeToken: opts.approvalRuntimeToken } : {},
			...opts.agentRuntimeIdentityToken ? { agentRuntimeIdentityToken: opts.agentRuntimeIdentityToken } : {},
			role: "operator",
			...Array.isArray(scopes) ? { scopes } : {},
			deviceIdentity,
			...deviceAuthScope ? { deviceAuthScope } : {},
			...storedAuth ? { preparedDeviceAuth: storedAuth } : {},
			...opts.sharedStateMode ? { sharedStateMode: opts.sharedStateMode } : {},
			minProtocol: opts.minProtocol ?? 4,
			maxProtocol: opts.maxProtocol ?? 4,
			onHelloOk: (hello) => {
				const dispatchGeneration = ++connectionGeneration;
				if (timeoutMs === null && timer) {
					clearTimeout(timer);
					timer = void 0;
				}
				try {
					opts.onHelloOk?.(hello);
				} catch {}
				if (settled) return;
				(async () => {
					try {
						ensureGatewaySupportsRequiredFeatures({
							kind: "method",
							required: Array.isArray(opts.requiredMethods) ? opts.requiredMethods : [],
							supported: Array.isArray(hello.features?.methods) ? hello.features.methods : [],
							attemptedMethod: opts.method
						});
						ensureGatewaySupportsRequiredFeatures({
							kind: "capability",
							required: opts.requiredCapabilities,
							supported: hello.features?.capabilities,
							attemptedMethod: opts.method
						});
						if (opts.prepareDispatchCurrent) await opts.prepareDispatchCurrent();
						if (settled || opts.signal?.aborted || dispatchGeneration !== connectionGeneration) return;
						opts.assertDispatchCurrent?.();
						primaryRequestStarted = true;
						const result = await client.request(opts.method, opts.params, {
							expectFinal: opts.expectFinal,
							timeoutMs: opts.timeoutMs,
							signal: opts.signal,
							onAccepted: opts.onAccepted
						});
						stop(void 0, result);
					} catch (err) {
						if (settled || dispatchGeneration !== connectionGeneration) return;
						stop(err);
					}
				})();
			},
			onClose: (code, reason, info) => {
				connectionGeneration += 1;
				if (settled) return;
				if (info?.connectError) {
					stop(isGatewayUnreachableSocketError(info.connectError) ? createGatewayUnreachableTransportError({
						cause: info.connectError,
						connectionDetails: params.connectionDetails
					}) : info.connectError);
					return;
				}
				if (!primaryRequestStarted && info?.transientPreHelloCleanClose === true && suppressedPreHelloCleanCloses < 1) {
					suppressedPreHelloCleanCloses += 1;
					return;
				}
				stop(createGatewayCloseTransportError({
					code,
					reason,
					connectionDetails: params.connectionDetails,
					requestDispatched: primaryRequestStarted
				}));
			},
			onConnectError: (err) => {
				const gatewayClientRequestError = err.name === "GatewayClientRequestError";
				const isAgentRuntimeIdentityConnectError = Boolean(opts.agentRuntimeIdentityToken) && isRequiredAgentRuntimeIdentityConnectError(err);
				const shouldSurface = isGatewayConnectAssemblyError(err) || isAgentRuntimeIdentityConnectError || isAllowlistedGatewayConnectRequestError(err) || surfaceGatewayClientRequestErrors && gatewayClientRequestError;
				if (settled || !shouldSurface) return;
				stop(err);
			}
		});
		const wrapperTimeoutMs = timeoutMs ?? startupTimeoutMs;
		timer = setTimeout(() => {
			stop(createGatewayTimeoutTransportError({
				timeoutMs: wrapperTimeoutMs,
				connectionDetails: params.connectionDetails,
				requestDispatched: primaryRequestStarted
			}));
		}, safeTimerTimeoutMs);
		startGatewayClientWhenEventLoopReady(client, {
			timeoutMs: safeTimerTimeoutMs,
			signal: startAbort.signal
		}).then((readiness) => {
			if (settled || readiness.ready || readiness.aborted) return;
			stop(createGatewayTimeoutTransportError({
				timeoutMs: startupTimeoutMs,
				connectionDetails: params.connectionDetails,
				requestDispatched: false
			}));
		}).catch((err) => {
			if (settled) return;
			stop(err instanceof Error ? err : new Error(String(err)));
		});
	});
}
async function callGatewayWithScopes(opts, scopes, localCliAbort = false) {
	const context = await resolveGatewayCallContext(opts);
	const { timeoutMs, startupTimeoutMs, safeTimerTimeoutMs } = resolveGatewayCallTimeout(opts.timeoutMs);
	const urlOverrideSource = resolveGatewayUrlOverride({
		gatewayUrl: opts.url,
		env: process.env,
		ignoreEnvUrlOverride: opts.ignoreEnvUrlOverride,
		localPortOverride: opts.localPortOverride
	}).source;
	if (opts.requireLocalBackendSharedAuth && (urlOverrideSource || context.isRemoteMode)) throw new GatewayLocalBackendSharedAuthUnavailableError("local backend shared auth is limited to the configured local gateway");
	const requestedStoredDeviceAuth = opts.useStoredDeviceAuth === true;
	const hasExplicitAuth = Boolean(context.explicitAuth.token || context.explicitAuth.password);
	const useStoredDeviceAuth = requestedStoredDeviceAuth && !hasExplicitAuth;
	const bootstrap = await resolveGatewayClientBootstrap({
		config: context.config,
		gatewayUrl: opts.url,
		explicitAuth: context.explicitAuth,
		env: process.env,
		configPath: context.configPath,
		ignoreEnvUrlOverride: opts.localPortOverride !== void 0 || opts.ignoreEnvUrlOverride === true || opts.serviceTargetUrl !== void 0,
		localPortOverride: opts.localPortOverride,
		explicitTlsFingerprint: opts.tlsFingerprint,
		skipImplicitAuth: useStoredDeviceAuth || opts.skipImplicitAuth === true,
		...useStoredDeviceAuth ? {} : { overrideAuthErrorHint: "Fix: pass --token or --password with --url (or gatewayToken in tools)." },
		buildConnectionDetails: buildGatewayConnectionDetails,
		...opts.serviceTargetUrl ? { serviceTargetUrl: opts.serviceTargetUrl } : {}
	});
	ensureRemoteModeUrlConfigured({
		context,
		urlOverrideSource: bootstrap.urlOverrideSource
	});
	const connectionDetails = bootstrap.connectionDetails;
	const url = bootstrap.url;
	if (opts.expectUrl !== void 0 && url !== opts.expectUrl) throw new Error("Gateway destination changed. Refresh the selected Gateway before retrying.");
	const deviceAuthScope = bootstrap.deviceAuthScope;
	const token = useStoredDeviceAuth ? void 0 : bootstrap.auth.token;
	const password = useStoredDeviceAuth ? void 0 : bootstrap.auth.password;
	const { clientOptions, omitDeviceIdentity, deviceIdentity } = resolveGatewayCallDeviceAuth({
		opts,
		url,
		authMode: resolveGatewayCallAuth(context.config).mode,
		isImplicitLocalTarget: !urlOverrideSource && !context.isRemoteMode,
		token,
		password
	});
	const connectionOpts = {
		...opts,
		...clientOptions
	};
	let storedAuth = connectionOpts.preparedDeviceAuth;
	if (useStoredDeviceAuth) {
		storedAuth ??= await loadStoredOperatorDeviceAuthToken(deviceIdentity, deviceAuthScope, connectionOpts.sharedStateMode);
		if (!storedAuth?.token && deviceAuthScope) throw new GatewayStoredDeviceAuthUnavailableError(["No stored device auth for this gateway origin.", `Run \`openclaw tui${bootstrap.sshTunnel ? "" : ` --url ${projectGatewayUrlForDiagnostics(url)}`}\` to send a pairing request, approve it in that gateway's Control UI (Settings -> Devices) or run \`openclaw devices approve --latest\` on the gateway host, then retry.`].join("\n"));
	}
	const tlsFingerprint = bootstrap.tlsFingerprint;
	const edgeAuthConfig = normalizeEdgeAuthHeadersConfig(gatewayEdgeAuthValueForTarget({
		config: context.config,
		targetUrl: url
	}));
	const edgeAuthHeaders = await resolveEdgeAuthHeaders({
		config: context.config,
		value: edgeAuthConfig,
		targetUrl: url,
		env: process.env
	});
	if (useStoredDeviceAuth) {
		if (!storedAuth?.token) throw new GatewayCredentialsRequiredError({
			method: connectionOpts.method,
			configPath: context.configPath
		});
		if (Array.isArray(connectionOpts.requiredStoredDeviceAuthScopes) && !roleScopesAllow({
			role: "operator",
			requestedScopes: connectionOpts.requiredStoredDeviceAuthScopes,
			allowedScopes: storedAuth.scopes
		})) throw new GatewayStoredDeviceAuthUnavailableError("stored device auth does not grant the required operator scopes");
	}
	await ensureGatewayCallCanAuthenticate({
		opts: connectionOpts,
		context,
		token,
		password,
		deviceIdentity,
		deviceAuthScope,
		storedAuth
	});
	try {
		await prepareGatewayClientDeviceAuth({
			url,
			token,
			password,
			edgeAuthHeaders,
			tlsFingerprint,
			deviceIdentity,
			deviceAuthScope,
			sharedStateMode: connectionOpts.sharedStateMode,
			preparedDeviceAuth: storedAuth ?? void 0,
			approvalRuntimeToken: connectionOpts.approvalRuntimeToken,
			agentRuntimeIdentityToken: connectionOpts.agentRuntimeIdentityToken
		}, connectionOpts.signal);
	} catch (error) {
		if (connectionOpts.signal?.aborted) throw createGatewayRequestAbortError(connectionOpts.method);
		throw error;
	}
	return await executeGatewayRequestWithScopes({
		opts: connectionOpts,
		scopes: requestedStoredDeviceAuth && hasExplicitAuth && connectionOpts.requiredStoredDeviceAuthScopes ? connectionOpts.requiredStoredDeviceAuthScopes : useStoredDeviceAuth ? void 0 : localCliAbort && omitDeviceIdentity && !deviceIdentity ? [ADMIN_SCOPE] : scopes,
		url,
		token,
		password,
		edgeAuthHeaders,
		tlsFingerprint,
		timeoutMs,
		startupTimeoutMs,
		safeTimerTimeoutMs,
		connectionDetails,
		deviceIdentity,
		deviceAuthScope,
		sshTunnel: bootstrap.sshTunnel,
		...storedAuth ? { storedAuth } : {},
		surfaceGatewayClientRequestErrors: useStoredDeviceAuth || connectionOpts.requireLocalBackendSharedAuth === true || Boolean(connectionOpts.agentRuntimeIdentityToken)
	});
}
function shouldEscalateSessionCreateCwdScope(params) {
	if (params.opts.method !== "sessions.create" || !isRecord(params.opts.params) || !normalizeOptionalString(params.opts.params.cwd) || params.scopes.length !== 1 || params.scopes[0] !== "operator.write") return false;
	const missingScope = readMissingScopeErrorDetails((isRecord(params.error) ? params.error : void 0)?.details);
	return missingScope?.missingScope === "operator.admin" && missingScope.requiredScopes.includes("operator.admin");
}
async function callGatewayWithScopeEscalation(opts, scopes) {
	try {
		return await callGatewayWithScopes(opts, scopes);
	} catch (error) {
		if (!shouldEscalateSessionCreateCwdScope({
			opts,
			scopes,
			error
		})) throw error;
		return await callGatewayWithScopes(opts, [ADMIN_SCOPE]);
	}
}
async function callGatewayCli(opts) {
	assertGatewayCliMessageContext(opts.method, opts.params);
	if (Array.isArray(opts.scopes)) return await callGatewayWithScopes(opts, opts.scopes);
	const scopes = isGatewayMethodClassified(opts.method) ? resolveLeastPrivilegeOperatorScopesForMethod(opts.method, opts.params) : CLI_DEFAULT_OPERATOR_SCOPES;
	if (opts.method === "chat.abort" || opts.method === "sessions.abort") return await callGatewayWithScopes(opts, scopes, true);
	return await callGatewayWithScopeEscalation(opts, scopes);
}
async function callGatewayLeastPrivilege(opts) {
	return await callGatewayWithScopeEscalation(opts, resolveLeastPrivilegeOperatorScopesForMethod(opts.method, opts.params));
}
async function callGateway(opts) {
	const callerMode = opts.mode ?? GATEWAY_CLIENT_MODES.BACKEND;
	const callerName = opts.clientName ?? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT;
	if (callerMode === GATEWAY_CLIENT_MODES.CLI || callerName === GATEWAY_CLIENT_NAMES.CLI) return await callGatewayCli(opts);
	if (Array.isArray(opts.scopes)) return await callGatewayWithScopes({
		...opts,
		mode: callerMode,
		clientName: callerName
	}, opts.scopes);
	return await callGatewayLeastPrivilege({
		...opts,
		mode: callerMode,
		clientName: callerName
	});
}
//#endregion
export { callGateway };
