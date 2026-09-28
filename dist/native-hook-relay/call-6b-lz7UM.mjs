import { C as isLoopbackIpAddress, D as normalizeIpAddress, O as parseCanonicalIpAddress, T as isRfc8215LocalUseNat64Ipv6Address, c as loadManagedProxyTlsOptionsSync, f as logDebug, l as resolveManagedProxyCaFileForUrl, p as logError, t as forceResetGlobalDispatcher, u as getActiveManagedProxyLoopbackMode, w as isPrivateOrLoopbackIpAddress$1 } from "./undici-global-dispatcher-Dp-3hP64.mjs";
import { a as extractErrorCodeOrErrno, i as extractErrorCode, n as formatErrorMessageWithCode, o as toErrorObject, t as formatErrorMessage } from "./errors-Cy4ii9Fo.mjs";
import { a as READ_SCOPE, c as getFileLockProcessStartTime, d as resolveDiagnosticProcessEnv, f as resolveEnvironmentValue, i as QUESTIONS_SCOPE, n as APPROVALS_SCOPE, o as TALK_SECRETS_SCOPE, r as PAIRING_SCOPE, s as WRITE_SCOPE, t as ADMIN_SCOPE, u as mergeProcessEnv } from "./operator-scopes-Ct3EiSIA.mjs";
import { a as resolveRuntimeWorkerUrl, s as runtimeProcessEntrypoints } from "./worker-cpu-BlFNjOLd.mjs";
import { C as getScopedPluginCaches, D as getPluginExecutionFrame, E as InvocationFrame, S as getScopedPluginCache, T as materializePluginCacheError, _ as bindPluginCacheRoot, b as getPluginCacheRoot, g as PluginCacheFactInvalidatedError, h as resolveOpenClawPackageRootSync, i as resolveOpenClawStateDirForDatabasePath, m as resolveCompatibilityHostVersion, o as resolveOpenClawStateSqlitePath, p as VERSION, v as getPluginCache, w as invalidatePluginCacheMetadata, x as getProcessPluginCache, y as getPluginCacheRetirementSignal } from "./openclaw-state-db.paths-D1f0LUdT.mjs";
import { A as resolveTimerTimeoutMs, C as asPositiveFiniteNumber, F as normalizeLowercaseStringOrEmpty, L as normalizeOptionalLowercaseString, N as asOptionalRecord, P as isRecord, R as normalizeOptionalString, S as asNonNegativeFiniteNumber, T as asSafeIntegerInRange, _ as resolveUserPath, a as isPathInside$1, c as FsSafeError, f as resolveConfigDir, h as resolveRequiredHomeDir, i as isNotFoundPathError, j as asNullableRecord, k as resolvePositiveTimerTimeoutMs, l as readSecureFile, n as RetrySupervisor, o as normalizeWindowsPathForComparison, p as expandHomePrefix, r as sleepWithAbort, t as CONFIG_DIR, v as tryProcessCwd, x as asFiniteNumber, z as readStringValue } from "./utils-C25eiuh1.mjs";
import { $ as isBlockedObjectKey$1, A as resolvePathViaExistingAncestorSync$1, B as normalizeSecretInputString, C as resolveConfigIncludes, D as isPathInside$2, E as formatPosixMode, F as readFileDescriptorBoundedSync$1, G as isValidSecretProviderAlias, H as ENV_SECRET_REF_ID_RE$1, I as containsEnvVarReference, J as secretRefKey, K as normalizeAndGroupSecretRefs, L as resolveConfigEnvVars, M as matchRootFileOpenFailure, N as openRootFileSync, O as hasErrnoCode, P as readFileDescriptorBounded$1, Q as parseConfigPathArrayIndex, R as coerceSecretRef, S as readConfigIncludeFileWithGuards, U as SINGLE_VALUE_FILE_REF_ID$1, V as resolveSecretInputRef, W as isBuiltInDefaultSecretProviderRef, X as formatConcreteConfigPath, Z as tokenizeConcreteConfigPath, _ as resolveIncludeRoots, b as isVitestRuntimeEnv, d as resolveGlobalSingleton, et as pruneMapToMaxSize, g as resolveGatewayPort, h as resolveGatewayLockDir, i as redactToolPayloadText, it as redactSensitiveUrlLikeString, j as resolveRootPathSync, k as isMissingPathError, l as registerSecretValueForRedaction, m as resolveConfigPath, q as resolveSecretRefProviderSourceMismatch, r as redactSensitiveText, tt as expectDefined, u as resolveGlobalSet, v as resolveIsNixMode, w as parseJsonWithJson5Fallback, x as resolveProfileStateDir, y as resolveStateDir, z as hasConfiguredSecretInput } from "./redact-0yyk4gHy.mjs";
import { l as getSpawnBroker } from "./openclaw-state-worker-error-rebMkDGg.mjs";
import { a as isArtifactPreservingStateRead, c as array, d as number, f as object, h as safeParseJson, i as getActiveOpenClawStateDatabaseReadSnapshot, l as boolean, m as union, n as runOpenClawStateWriteTransaction, o as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, p as string, s as withExistingOpenClawStateDatabaseReadOnly, t as openOpenClawStateDatabase, u as literal } from "./openclaw-state-db-C5P1uwEr.mjs";
import { a as normalizeUniqueSingleOrTrimmedStringList, c as sortUniqueStrings, i as normalizeTrimmedStringList, l as uniqueStrings, n as normalizeOptionalTrimmedStringList, r as normalizeStringEntries, s as normalizeUniqueTrimmedStringList, t as normalizeArrayBackedTrimmedStringList } from "./string-normalization-CNyvKrgf.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolvePreauthHandshakeTimeoutMs, i as resolveFiniteTimeoutDelayMs, n as clearGatewayConnectTimeout, o as resolveSafeTimeoutDelayMs, r as resolveConnectChallengeTimeoutMs, s as startGatewayConnectTimeout, t as DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS } from "./timeouts-DVvIntvk.mjs";
import { a as SUBAGENT_EXEC_ENV_VAR, c as isTruthyEnvValue, d as getOrCreatePromise, o as markOpenClawExecEnv } from "./host-env-security-DFM0cQIV.mjs";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import { r as compareOpenClawVersions, t as applyConfigEnvVars } from "./config-env-vars-DXvBb18D.mjs";
import { Et as ensurePrivateSqliteCoordinatorDirectory, G as getNodeSqliteKysely, T as tableExists, Tt as createSqliteLifecycleAggregateError, U as executeSqliteQuerySync, W as executeSqliteQueryTakeFirstSync, _t as resolveStateLifecycleRuntimeDirectory, ct as isStateDatabaseReadAdmissionInvalidatedError, en as sha256HexPrefixCore, et as decodeMountInfoPath, gt as resolveStateDatabaseCoordinatorPath, kt as tryAcquireExclusiveSqliteCoordinator, pt as acquireStateDatabaseCoordinator, wt as SqliteCoordinatorError } from "./openclaw-state-db-cache-BGWj8evC.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { c as sanitizeForLog, o as readRegularFileSync, t as createSubsystemLogger, u as areDiagnosticsEnabledForProcess } from "./subsystem-DA9--fnw.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DLqBlq9x.mjs";
import { i as LEGACY_IMPLICIT_AGENT_ID, n as runOpenClawStateWorkerOperation, r as createSqliteWorkerOperationAdmission } from "./openclaw-state-worker-store-C9rpE3ft.mjs";
import { a as signEd25519Payload, i as publicKeyRawBase64UrlFromEd25519Pem, n as deriveCanonicalEd25519PublicKeyRaw, t as deriveCanonicalEd25519PrivateKeyRaw } from "./ed25519-signature-C0LsxiQM.mjs";
import "./temp-artifact-cleanup-Cy8YyCOG.mjs";
import { g as MANIFEST_KEY, m as resolveOfficialExternalPluginId, o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-D_PnrId8.mjs";
import { a as isPrereleaseResolutionAllowed, i as resolveOfficialExternalPluginLegacyIds, o as parseRegistryNpmSpec, r as resolveOfficialExternalPluginInstall, s as BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES, t as getOfficialExternalPluginCatalogEntryForPackage } from "./official-external-plugin-catalog-3L_moyvU.mjs";
import { createRequire } from "node:module";
import process$1 from "node:process";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import fsSync, { opendirSync, readFileSync } from "node:fs";
import path from "node:path";
import os, { constants } from "node:os";
import { fileURLToPath } from "node:url";
import { tryReadJsonSync } from "@openclaw/fs-safe/json";
import fs from "node:fs/promises";
import { safePathSegmentHashed } from "@openclaw/fs-safe/advanced";
import crypto, { X509Certificate, randomBytes, randomUUID } from "node:crypto";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { prerelease, satisfies, valid } from "semver";
import { stripVTControlCharacters } from "node:util";
import { Buffer as Buffer$1, isUtf8 } from "node:buffer";
import { isProxy } from "node:util/types";
import { EventEmitter, once } from "node:events";
import net, { Socket } from "node:net";
import "commander";
import "@openclaw/fs-safe/atomic";
import { StringDecoder } from "node:string_decoder";
import { execa } from "execa";
import pMap from "p-map";
import { inspectPathPermissions, safeStat } from "@openclaw/fs-safe/permissions";
import { TLSSocket } from "node:tls";
import { installGlobalProxy } from "@openclaw/proxyline";
import "typebox/guard";
import "typebox/schema";
import { Compile } from "typebox/compile";
import { Type } from "typebox";
//#region packages/normalization-core/src/stable-stringify.ts
const preserveString = (value) => value;
/** Deterministically stringifies values, optionally normalizing strings before key ordering. */
function stableStringify(value, normalizeString = preserveString) {
	return stringifyStableValue(value, /* @__PURE__ */ new WeakSet(), normalizeString);
}
function stringifyStableValue(value, stack, normalizeString, write) {
	if (value === null || value === void 0) return String(value);
	if (typeof value === "number" && !Number.isFinite(value)) return JSON.stringify(String(value));
	if (typeof value === "bigint") return JSON.stringify(value.toString());
	if (typeof value === "string") return JSON.stringify(normalizeString(value));
	if (typeof value !== "object") return JSON.stringify(value) ?? "null";
	if (stack.has(value)) return JSON.stringify("[Circular]");
	stack.add(value);
	try {
		return stringifyObjectValue(value, stack, normalizeString, write);
	} finally {
		stack.delete(value);
	}
}
function stringifyObjectValue(value, stack, normalizeString, write) {
	if (value instanceof Error) return stringifyStableValue({
		name: value.name,
		message: value.message,
		stack: value.stack
	}, stack, normalizeString, write);
	if (value instanceof Uint8Array) return stringifyStableValue({
		type: "Uint8Array",
		data: encodeBase64(value)
	}, stack, normalizeString, write);
	if (Array.isArray(value)) {
		if (write) {
			write("[");
			let separator = "";
			for (const entry of value) {
				write(separator);
				write(stringifyStableValue(entry, stack, normalizeString, write));
				separator = ",";
			}
			write("]");
			return "";
		}
		const serializedEntries = [];
		for (const entry of value) serializedEntries.push(stringifyStableValue(entry, stack, normalizeString));
		return `[${serializedEntries.join(",")}]`;
	}
	const record = value;
	if (normalizeString === preserveString) {
		const fields = Object.keys(record).sort();
		if (write) {
			write("{");
			let separator = "";
			for (const key of fields) {
				write(`${separator}${JSON.stringify(key)}:`);
				write(stringifyStableValue(record[key], stack, normalizeString, write));
				separator = ",";
			}
			write("}");
			return "";
		}
		let fieldIndex = 0;
		for (const key of fields) fields[fieldIndex++] = `${JSON.stringify(key)}:${stringifyStableValue(record[key], stack, normalizeString)}`;
		return `{${fields.join(",")}}`;
	}
	const entries = Object.keys(record).map((key) => ({
		key,
		normalizedKey: normalizeString(key)
	})).sort((left, right) => {
		return compareStableStrings(left.normalizedKey, right.normalizedKey) || compareStableStrings(left.key, right.key);
	});
	const serializedFields = [];
	if (write) {
		write("{");
		let separator = "";
		for (const { key, normalizedKey } of entries) {
			write(`${separator}${JSON.stringify(normalizedKey)}:`);
			write(stringifyStableValue(record[key], stack, normalizeString, write));
			separator = ",";
		}
		write("}");
		return "";
	}
	for (const { key, normalizedKey } of entries) serializedFields.push(`${JSON.stringify(normalizedKey)}:${stringifyStableValue(record[key], stack, normalizeString)}`);
	return `{${serializedFields.join(",")}}`;
}
function encodeBase64(value) {
	let binary = "";
	for (const byte of value) binary += String.fromCharCode(byte);
	return btoa(binary);
}
function compareStableStrings(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
//#endregion
//#region src/infra/abort-signal.ts
function createAbortError(message, options) {
	const error = new Error(message, options);
	error.name = "AbortError";
	return error;
}
//#endregion
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
		const clearTimer = () => {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
		};
		const finish = (ready, aborted = false) => {
			if (settled) return;
			settled = true;
			clearTimer();
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
/** Pairing-specific reasons clients can display and use for reconnect policy. */
const ConnectPairingRequiredReasons = {
	NOT_PAIRED: "not-paired",
	ROLE_UPGRADE: "role-upgrade",
	SCOPE_UPGRADE: "scope-upgrade",
	METADATA_UPGRADE: "metadata-upgrade"
};
const CONNECT_RECOVERY_NEXT_STEP_VALUES = /* @__PURE__ */ new Set([
	"retry_with_device_token",
	"update_auth_configuration",
	"update_auth_credentials",
	"wait_then_retry",
	"review_auth_configuration"
]);
const CONNECT_PAIRING_REQUIRED_REASON_VALUES = /* @__PURE__ */ new Set([
	"not-paired",
	"role-upgrade",
	"scope-upgrade",
	"metadata-upgrade"
]);
const PAIRING_CONNECT_REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const PAIRING_CONNECT_REASON_METADATA = {
	"not-paired": {
		requirement: "device is not approved yet",
		remediationHint: "Approve this device from the pending pairing requests.",
		recoveryTitle: "Gateway pairing approval required."
	},
	"role-upgrade": {
		requirement: "device is asking for a higher role than currently approved",
		remediationHint: "Review the requested role upgrade, then approve the pending request.",
		recoveryTitle: "Gateway role upgrade approval required."
	},
	"scope-upgrade": {
		requirement: "device is asking for more scopes than currently approved",
		remediationHint: "Review the requested scopes, then approve the pending upgrade.",
		recoveryTitle: "Gateway scope upgrade approval required."
	},
	"metadata-upgrade": {
		requirement: "device identity changed and must be re-approved",
		remediationHint: "Review the refreshed device details, then approve the pending request.",
		recoveryTitle: "Gateway device refresh approval required."
	}
};
const CONNECT_PAIRING_REQUIRED_MESSAGE_BY_REASON = {
	"not-paired": "device pairing required",
	"role-upgrade": "role upgrade pending approval",
	"scope-upgrade": "scope upgrade pending approval",
	"metadata-upgrade": "device metadata change pending approval"
};
/** Reads a non-empty detail code from an untrusted error details payload. */
function readConnectErrorDetailCode(details) {
	if (!isRecord(details)) return null;
	const code = details.code;
	return typeof code === "string" && code.trim().length > 0 ? code.trim() : null;
}
/** Extracts normalized retry advice from untrusted connect-error details. */
function readConnectErrorRecoveryAdvice(details) {
	if (!isRecord(details)) return {};
	const canRetryWithDeviceToken = typeof details.canRetryWithDeviceToken === "boolean" ? details.canRetryWithDeviceToken : void 0;
	const normalizedNextStep = normalizeOptionalString(details.recommendedNextStep) ?? "";
	return {
		canRetryWithDeviceToken,
		recommendedNextStep: CONNECT_RECOVERY_NEXT_STEP_VALUES.has(normalizedNextStep) ? normalizedNextStep : void 0
	};
}
function normalizePairingConnectReason(value) {
	const normalized = normalizeOptionalString(value) ?? "";
	return CONNECT_PAIRING_REQUIRED_REASON_VALUES.has(normalized) ? normalized : void 0;
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
function buildPairingConnectRemediationHint(reason) {
	return reason ? PAIRING_CONNECT_REASON_METADATA[reason].remediationHint : "Approve the pending device request before retrying.";
}
/** Reads and backfills pairing-required details from an untrusted details object. */
function readPairingConnectErrorDetails(details) {
	if (readConnectErrorDetailCode(details) !== ConnectErrorDetailCodes.PAIRING_REQUIRED) return null;
	if (!isRecord(details)) return null;
	const reason = normalizePairingConnectReason(details.reason);
	const requestId = normalizePairingConnectRequestId(details.requestId);
	const remediationHint = normalizeOptionalString(details.remediationHint) ?? buildPairingConnectRemediationHint(reason);
	const normalizedNextStep = normalizeOptionalString(details.recommendedNextStep) ?? "";
	const recommendedNextStep = CONNECT_RECOVERY_NEXT_STEP_VALUES.has(normalizedNextStep) ? normalizedNextStep : void 0;
	const deviceId = normalizeOptionalString(details.deviceId);
	const requestedRole = normalizeOptionalString(details.requestedRole);
	const requestedScopes = normalizeOptionalTrimmedStringList(details.requestedScopes);
	const approvedRoles = normalizeOptionalTrimmedStringList(details.approvedRoles);
	const approvedScopes = normalizeOptionalTrimmedStringList(details.approvedScopes);
	return createPairingConnectErrorDetails({
		reason,
		requestId,
		remediationHint,
		recommendedNextStep,
		retryable: typeof details.retryable === "boolean" ? details.retryable : void 0,
		pauseReconnect: typeof details.pauseReconnect === "boolean" ? details.pauseReconnect : void 0,
		deviceId,
		requestedRole,
		requestedScopes,
		approvedRoles,
		approvedScopes
	});
}
/** Formats pairing-required details into the canonical user-facing message. */
function formatConnectPairingRequiredMessage(details) {
	const pairing = readPairingConnectErrorDetails(details);
	const base = CONNECT_PAIRING_REQUIRED_MESSAGE_BY_REASON[pairing?.reason ?? ConnectPairingRequiredReasons.NOT_PAIRED];
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
	TASK_WORKTREE_SOURCE_REQUIRED: "TASK_WORKTREE_SOURCE_REQUIRED"
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
	if (Object.hasOwn(value, "env")) applyConfigEnvVars(value, env);
	const projected = {};
	for (const key of GATEWAY_DISPATCH_TOP_LEVEL_KEYS) if (Object.hasOwn(value, key)) projected[key] = value[key];
	return resolveConfigEnvVars(projected, env, { onMissing: () => void 0 });
}
function applyGatewayDispatchSessionDefaults(config) {
	if (config.session?.mainKey === void 0) return config;
	return {
		...config,
		session: {
			...config.session,
			mainKey: "main"
		}
	};
}
function resolveIncludesForGatewayDispatch(parsed, configPath, env) {
	return resolveConfigIncludes(parsed, configPath, {
		readFile: (candidate) => fsSync.readFileSync(candidate, "utf-8"),
		readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => readConfigIncludeFileWithGuards({
			includePath,
			resolvedPath,
			rootRealDir,
			ioFs: fsSync
		}),
		parseJson: parseJsonWithJson5Fallback
	}, { allowedRoots: resolveIncludeRoots(env) });
}
function readRawGatewayDispatchConfig(options = {}) {
	const env = options.env ?? process.env;
	const configPath = options.configPath ?? resolveConfigPath(env);
	if (!fsSync.existsSync(configPath)) return {
		config: {},
		configPath
	};
	const raw = fsSync.readFileSync(configPath, "utf-8");
	return {
		config: applyGatewayDispatchSessionDefaults(resolveGatewayDispatchConfig(resolveIncludesForGatewayDispatch(parseJsonWithJson5Fallback(raw), configPath, env), env)),
		configPath
	};
}
function readGatewayDispatchConfig(options = {}) {
	return readRawGatewayDispatchConfig(options).config;
}
async function readGatewayDispatchConfigWithShellEnvFallback(options = {}) {
	const env = options.env ?? process.env;
	const firstRead = readRawGatewayDispatchConfig(options);
	const { loadShellEnvFallback, resolveShellEnvFallbackTimeoutMs, shouldDeferShellEnvFallback, shouldEnableShellEnvFallback } = await import("./shell-env-Do6gywE5.mjs");
	if ((shouldEnableShellEnvFallback(env) || firstRead.config.env?.shellEnv?.enabled === true) && !shouldDeferShellEnvFallback(env)) loadShellEnvFallback({
		enabled: true,
		env,
		expectedKeys: [...GATEWAY_DISPATCH_SHELL_ENV_EXPECTED_KEYS],
		logger: options.logger ?? console,
		timeoutMs: firstRead.config.env?.shellEnv?.timeoutMs ?? resolveShellEnvFallbackTimeoutMs(env)
	});
	return readGatewayDispatchConfig({
		...options,
		configPath: path.resolve(firstRead.configPath)
	});
}
//#endregion
//#region src/infra/executable-path.ts
function isDriveLessWindowsRootedPath(value) {
	return process.platform === "win32" && /^:[\\/]/.test(value);
}
function resolveExecutablePathCandidate(rawExecutable, options) {
	const expanded = rawExecutable.startsWith("~") ? expandHomePrefix(rawExecutable, { env: options?.env }) : rawExecutable;
	if (isDriveLessWindowsRootedPath(expanded)) return;
	const hasPathSeparator = expanded.includes("/") || expanded.includes("\\");
	if (options?.requirePathSeparator && !hasPathSeparator) return;
	if (!hasPathSeparator) return expanded;
	if (path.isAbsolute(expanded)) return path.resolve(expanded);
	const base = options?.cwd && options.cwd.trim() ? options.cwd.trim() : process.cwd();
	return path.resolve(base, expanded);
}
function resolveWindowsExecutableExtensions(executable, env, includeExtensionless = true) {
	if (process.platform !== "win32") return [""];
	if (path.extname(executable).length > 0) return [""];
	const extensions = [...resolveWindowsExecutableExtSet(env)];
	return includeExtensionless ? ["", ...extensions] : extensions;
}
function resolveWindowsExecutableExtSet(env) {
	return new Set((resolveEnvironmentValue(env, "PATHEXT") ?? resolveEnvironmentValue(process.env, "PATHEXT") ?? ".EXE;.CMD;.BAT;.COM").split(";").map((ext) => normalizeLowercaseStringOrEmpty(ext)).filter(Boolean));
}
function isRegularFile(filePath) {
	try {
		return fsSync.statSync(filePath).isFile();
	} catch {
		return false;
	}
}
const WINDOWS_NATIVE_EXECUTABLE_EXTENSIONS = /* @__PURE__ */ new Set([
	".com",
	".exe",
	".bat",
	".cmd"
]);
/** Checks a supplied path without PATH lookup or lexical normalization. */
function isExecutableFile(filePath, options) {
	if (!isRegularFile(filePath)) return false;
	try {
		if (process.platform === "win32") {
			const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
			if (!ext || WINDOWS_NATIVE_EXECUTABLE_EXTENSIONS.has(ext)) return true;
			return resolveWindowsExecutableExtSet(options?.env).has(ext);
		}
		fsSync.accessSync(filePath, fsSync.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
const EXECUTABLE_PATH_CACHE_TTL_MS = 6e4;
const EXECUTABLE_PATH_CACHE_MAX_ENTRIES = 128;
const executablePathCache = /* @__PURE__ */ new Map();
function cacheExecutablePath(key, resolved) {
	executablePathCache.set(key, {
		expiresAt: Date.now() + EXECUTABLE_PATH_CACHE_TTL_MS,
		resolved: resolved ?? null
	});
	pruneMapToMaxSize(executablePathCache, EXECUTABLE_PATH_CACHE_MAX_ENTRIES);
}
function executablePathCacheKey(executable, pathEnv, env, includeExtensionless, requestedCwd) {
	const pathExt = resolveEnvironmentValue(env, "PATHEXT") ?? resolveEnvironmentValue(process.env, "PATHEXT") ?? "";
	let cwd = "";
	try {
		cwd = requestedCwd ?? process.cwd();
	} catch {}
	return `${process.platform}\0${executable}\0${pathEnv}\0${pathExt}\0${includeExtensionless !== false}\0${cwd}\0${requestedCwd !== void 0}`;
}
function resolveExecutableFromPathEnv(executable, pathEnv, env, options) {
	const cwd = options?.cwd?.trim() ? path.resolve(options.cwd.trim()) : void 0;
	const useCache = options?.useCache !== false;
	const cacheKey = executablePathCacheKey(executable, pathEnv, env, options?.includeExtensionless, cwd);
	const cached = useCache ? executablePathCache.get(cacheKey) : void 0;
	const now = Date.now();
	if (cached && cached.expiresAt > now) {
		cached.expiresAt = now + EXECUTABLE_PATH_CACHE_TTL_MS;
		executablePathCache.delete(cacheKey);
		executablePathCache.set(cacheKey, cached);
		return cached.resolved ?? void 0;
	}
	if (cached) executablePathCache.delete(cacheKey);
	const delimiter = process.platform === "win32" ? ";" : path.delimiter;
	const entries = pathEnv.split(delimiter).filter((entry) => Boolean(entry) || cwd !== void 0 && process.platform !== "win32");
	const extensions = resolveWindowsExecutableExtensions(executable, env, options?.includeExtensionless);
	for (const entry of entries) {
		const hasParentTraversal = process.platform !== "win32" && entry.split("/").includes("..");
		const rawDirectory = cwd !== void 0 && !path.isAbsolute(entry) ? `${cwd}${path.sep}${entry}` : entry;
		for (const ext of extensions) {
			const candidate = hasParentTraversal ? `${rawDirectory}${path.sep}${executable}${ext}` : path.join(cwd === void 0 ? entry : path.resolve(cwd, entry), executable + ext);
			if (isExecutableFile(candidate, { env })) {
				if (useCache) cacheExecutablePath(cacheKey, candidate);
				return candidate;
			}
		}
	}
	if (useCache) cacheExecutablePath(cacheKey, void 0);
}
resolveGlobalSet(Symbol.for("openclaw.sessionRowChanges"), "close-and-restart");
resolveGlobalSet(Symbol.for("openclaw.sessionRowFactChanges"), "close-and-restart");
resolveGlobalSet(Symbol.for("openclaw.sessionRowProjectionChanges"), "close-and-restart");
//#endregion
//#region src/shared/immutable-data.ts
const deeplyFrozenPlainData = /* @__PURE__ */ new WeakSet();
function isPlainDataObject(value) {
	if (isProxy(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype || Array.isArray(value) && prototype === Array.prototype;
}
/** Immutable graphs keep their classification for exactly as long as their objects live. */
function isDeeplyFrozenPlainData(value) {
	if (!value || typeof value !== "object") return typeof value !== "function";
	if (deeplyFrozenPlainData.has(value)) return true;
	if (!isPlainDataObject(value) || !Object.isFrozen(value)) return false;
	const inspected = /* @__PURE__ */ new Set();
	const pending = [value];
	while (pending.length) {
		const candidate = pending.pop();
		if (inspected.has(candidate)) continue;
		if (!isPlainDataObject(candidate) || !Object.isFrozen(candidate)) return false;
		inspected.add(candidate);
		const childStart = pending.length;
		for (const key of Reflect.ownKeys(candidate)) {
			const descriptor = Object.getOwnPropertyDescriptor(candidate, key);
			if (!("value" in descriptor) || typeof descriptor.value === "function") return false;
			if (descriptor.value && typeof descriptor.value === "object" && !deeplyFrozenPlainData.has(descriptor.value)) pending.push(descriptor.value);
		}
		for (let left = childStart, right = pending.length - 1; left < right; left++, right--) {
			const child = pending[left];
			pending[left] = pending[right];
			pending[right] = child;
		}
	}
	for (const candidate of inspected) deeplyFrozenPlainData.add(candidate);
	return true;
}
new AsyncLocalStorage();
//#endregion
//#region src/config/resolution-facts.ts
const configResolutionFacts = /* @__PURE__ */ new WeakMap();
const envSecretRefsByFacts = /* @__PURE__ */ new WeakMap();
function setConfigResolutionFacts(target, facts) {
	if (!target || typeof target !== "object") return;
	if (facts === null) {
		configResolutionFacts.delete(target);
		return;
	}
	configResolutionFacts.set(target, facts);
}
function getConfigResolutionFacts(target) {
	return target && typeof target === "object" ? configResolutionFacts.get(target) ?? null : null;
}
function copyConfigResolutionFacts(source, target) {
	setConfigResolutionFacts(target, getConfigResolutionFacts(source));
}
function cloneConfigWithResolutionFacts(value) {
	const cloned = structuredClone(value);
	copyConfigResolutionFacts(value, cloned);
	return cloned;
}
function copyConfigResolutionFactsExcept(source, target, paths) {
	const facts = getConfigResolutionFacts(source);
	if (facts === null) {
		setConfigResolutionFacts(target, null);
		return;
	}
	const envSecretRefs = envSecretRefsByFacts.get(facts);
	if (!paths.some((path) => facts.has(path) || envSecretRefs?.has(path) === true)) {
		setConfigResolutionFacts(target, facts);
		return;
	}
	const remaining = new Set(facts);
	paths.forEach((path) => remaining.delete(path));
	if (envSecretRefs) {
		const remainingEnvSecretRefs = new Map(envSecretRefs);
		paths.forEach((path) => remainingEnvSecretRefs.delete(path));
		if (remainingEnvSecretRefs.size > 0) envSecretRefsByFacts.set(remaining, remainingEnvSecretRefs);
	}
	setConfigResolutionFacts(target, remaining);
}
function hasUnresolvedConfigPath(target, path) {
	return getConfigResolutionFacts(target)?.has(path) === true;
}
/** Returns only a still-pending reference recorded from the authored config source. */
function getAuthoredConfigSecretRef(target, path) {
	const facts = getConfigResolutionFacts(target);
	const fact = facts ? envSecretRefsByFacts.get(facts)?.get(path) : void 0;
	return fact?.state === "pending" ? fact.ref : null;
}
/** Returns the env source of a value that config substitution already materialized. */
function getResolvedConfigEnvSecretRef(target, path) {
	const facts = getConfigResolutionFacts(target);
	const fact = facts ? envSecretRefsByFacts.get(facts)?.get(path) : void 0;
	return fact?.state === "resolved" ? fact.ref : null;
}
/** Reads inline references from authored facts and structured references from their values. */
function resolveConfigSecretRef(params) {
	return typeof params.value === "string" && getConfigResolutionFacts(params.config) !== null ? getAuthoredConfigSecretRef(params.config, params.path) ?? (params.includeResolved ? getResolvedConfigEnvSecretRef(params.config, params.path) : null) : coerceSecretRef(params.value, params.defaults);
}
//#endregion
//#region src/config/legacy.default-agent-owner-state.ts
const legacyDefaultAgentIdByConfig = /* @__PURE__ */ new WeakMap();
function getRetainedLegacyDefaultAgentId(config) {
	return legacyDefaultAgentIdByConfig.get(config);
}
//#endregion
//#region src/config/runtime-snapshot.ts
let runtimeConfigSnapshot = null;
function getRuntimeConfigSnapshot() {
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
function firstDefined(values) {
	for (const value of values) if (value) return value;
}
function throwUnresolvedGatewaySecretInput(path) {
	throw new GatewaySecretRefUnavailableError(path);
}
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
		token: tokenPrecedence === "config-first" ? firstDefined([configToken, envToken]) : firstDefined([envToken, configToken]),
		password: passwordPrecedence === "config-first" ? firstDefined([configPassword, envPassword]) : firstDefined([envPassword, configPassword])
	};
}
function resolveLocalGatewayCredentials(params) {
	const tokenConfigFallback = params.plan.localToken.configured ? params.plan.localToken.value : params.plan.remoteToken.value;
	const passwordConfigFallback = params.plan.localPassword.configured ? params.plan.localPassword.value : params.plan.authMode === "trusted-proxy" ? void 0 : params.plan.remotePassword.value;
	const localResolved = {
		token: params.localPrecedence === "config-first" ? firstDefined([
			params.plan.localToken.value,
			params.plan.envToken,
			params.plan.localToken.configured ? void 0 : params.plan.remoteToken.value
		]) : firstDefined([params.plan.envToken, tokenConfigFallback]),
		password: params.localPrecedence === "config-first" ? firstDefined([
			params.plan.localPassword.value,
			params.plan.envPassword,
			params.plan.localPassword.configured ? void 0 : passwordConfigFallback
		]) : firstDefined([params.plan.envPassword, passwordConfigFallback])
	};
	const localPasswordCanWin = params.plan.authMode === "password" || params.plan.authMode === "trusted-proxy" || params.plan.authMode !== "token" && params.plan.authMode !== "none" && !localResolved.token;
	const localTokenCanWin = params.plan.authMode === "token" || params.plan.authMode !== "password" && params.plan.authMode !== "none" && params.plan.authMode !== "trusted-proxy" && !localResolved.password;
	if (params.plan.localToken.refPath && params.localPrecedence === "config-first" && !params.plan.localToken.value && Boolean(params.plan.envToken) && localTokenCanWin) throwUnresolvedGatewaySecretInput(params.plan.localToken.refPath);
	if (params.plan.localPassword.refPath && params.localPrecedence === "config-first" && !params.plan.localPassword.value && Boolean(params.plan.envPassword) && localPasswordCanWin) throwUnresolvedGatewaySecretInput(params.plan.localPassword.refPath);
	if (params.plan.localToken.refPath && !localResolved.token && !params.plan.envToken && localTokenCanWin) throwUnresolvedGatewaySecretInput(params.plan.localToken.refPath);
	if (params.plan.localPassword.refPath && !localResolved.password && !params.plan.envPassword && localPasswordCanWin) throwUnresolvedGatewaySecretInput(params.plan.localPassword.refPath);
	return localResolved;
}
function resolveRemoteGatewayCredentials(params) {
	const token = params.remoteTokenFallback === "remote-only" ? params.plan.remoteToken.value : params.remoteTokenPrecedence === "env-first" ? firstDefined([
		params.plan.envToken,
		params.plan.remoteToken.value,
		params.plan.localToken.value
	]) : firstDefined([
		params.plan.remoteToken.value,
		params.plan.envToken,
		params.plan.localToken.value
	]);
	const password = params.remotePasswordFallback === "remote-only" ? params.plan.remotePassword.value : params.remotePasswordPrecedence === "env-first" ? firstDefined([
		params.plan.envPassword,
		params.plan.remotePassword.value,
		params.plan.localPassword.value
	]) : firstDefined([
		params.plan.remotePassword.value,
		params.plan.envPassword,
		params.plan.localPassword.value
	]);
	const localTokenFallbackEnabled = params.remoteTokenFallback !== "remote-only";
	const localTokenFallback = params.remoteTokenFallback === "remote-only" ? void 0 : params.plan.localToken.value;
	const localPasswordFallback = params.remotePasswordFallback === "remote-only" ? void 0 : params.plan.localPassword.value;
	if (params.plan.remoteToken.refPath && !token && !params.plan.envToken && !localTokenFallback && !password) throwUnresolvedGatewaySecretInput(params.plan.remoteToken.refPath);
	if (params.plan.remotePassword.refPath && !password && !params.plan.envPassword && !localPasswordFallback && !token) throwUnresolvedGatewaySecretInput(params.plan.remotePassword.refPath);
	if (params.plan.localToken.refPath && localTokenFallbackEnabled && !token && !password && !params.plan.envToken && !params.plan.remoteToken.value && params.plan.localTokenCanWin) throwUnresolvedGatewaySecretInput(params.plan.localToken.refPath);
	return {
		token,
		password
	};
}
/** Resolve Gateway credentials from config, explicit auth, URL overrides, and mode policy. */
function resolveGatewayCredentialsFromConfig(params) {
	const env = params.env ?? process.env;
	const explicitToken = trimToUndefined(params.explicitAuth?.token);
	const explicitPassword = trimToUndefined(params.explicitAuth?.password);
	if (explicitToken || explicitPassword) return {
		token: explicitToken,
		password: explicitPassword
	};
	if (trimToUndefined(params.urlOverride) && params.urlOverrideSource !== "env") return {};
	if (trimToUndefined(params.urlOverride) && params.urlOverrideSource === "env") return resolveGatewayCredentialsFromValues({
		configToken: void 0,
		configPassword: void 0,
		env,
		tokenPrecedence: "env-first",
		passwordPrecedence: "env-first"
	});
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
	const mode = authOverride?.mode ?? authConfig.mode ?? (password ? "password" : token ? "token" : "token");
	return {
		mode,
		modeSource: authOverride?.mode !== void 0 ? "override" : authConfig.mode ? "config" : password ? "password" : token ? "token" : "default",
		token,
		password,
		allowTailscale: authConfig.allowTailscale ?? (params.tailscaleMode === "serve" && mode !== "password" && mode !== "trusted-proxy"),
		trustedProxy: authConfig.trustedProxy
	};
}
/** Resolve Gateway auth mode, credentials, trusted-proxy policy, and Tailscale allowance. */
function resolveGatewayAuth(params) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	if (runtimeConfig && runtimeConfig.gateway?.auth === params.authConfig) return resolveGatewayAuthForConfig({
		config: runtimeConfig,
		authOverride: params.authOverride,
		env: params.env,
		tailscaleMode: params.tailscaleMode
	});
	const authOverride = params.authOverride ?? void 0;
	const authConfig = mergeGatewayAuthConfig(params.authConfig, authOverride);
	const env = params.env ?? process.env;
	const tokenRef = resolveSecretInputRef({ value: authConfig.token }).ref;
	const passwordRef = resolveSecretInputRef({ value: authConfig.password }).ref;
	const resolvedCredentials = resolveGatewayCredentialsFromValues({
		configToken: tokenRef ? void 0 : authConfig.token,
		configPassword: passwordRef ? void 0 : authConfig.password,
		env,
		tokenPrecedence: "config-first",
		passwordPrecedence: "config-first"
	});
	return finalizeResolvedGatewayAuth({
		authConfig,
		authOverride,
		token: resolvedCredentials.token,
		password: resolvedCredentials.password,
		tailscaleMode: params.tailscaleMode
	});
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
//#region src/process/spawn-broker/protocol.ts
var SpawnBrokerError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.code = "ERR_SPAWN_BROKER_UNAVAILABLE";
		this.name = "SpawnBrokerError";
	}
};
function serializeBrokerError(error) {
	return {
		message: error.message,
		code: error.code,
		errno: error.errno,
		syscall: error.syscall,
		path: error.path
	};
}
//#endregion
//#region src/process/spawn-broker/pipe.ts
const readers = /* @__PURE__ */ new WeakMap();
const holdReadable = () => {};
/** Publish stream data and EOF after the caller's readiness continuation. */
function releasePipe(socket) {
	const held = restoreReader(socket);
	if (!held) return;
	process.nextTick(() => {
		if (socket.destroyed) return;
		socket.emit("readable");
		if (held.resumed) socket.resume();
	});
}
function restoreReader(socket) {
	const held = readers.get(socket);
	if (!held) return;
	socket.read = held.read;
	readers.delete(socket);
	socket.removeListener("resume", held.onResume);
	socket.removeListener("readable", holdReadable);
	return held;
}
//#endregion
//#region src/process/spawn-broker/child.ts
/** Native pipes remain native streams; only lifecycle and IPC cross the broker. */
var BrokerChild = class extends EventEmitter {
	constructor(requestId, argv, transmit) {
		super();
		this.requestId = requestId;
		this.transmit = transmit;
		this.callbackContext = new AsyncResource("OpenClawSpawnBrokerChild");
		this.stdin = null;
		this.stdout = null;
		this.stderr = null;
		this.connected = false;
		this.killed = false;
		this.exitCode = null;
		this.signalCode = null;
		this.stdio = [
			null,
			null,
			null,
			null,
			null
		];
		this.opened = createDeferredCore();
		this.completion = createDeferredCore();
		this.pipes = /* @__PURE__ */ new Set();
		this.sends = /* @__PURE__ */ new Map();
		this.sendSequence = 0;
		this.spawnReceived = false;
		this.eventsReleased = false;
		this.pendingEventOverflow = false;
		this.pendingEvents = [];
		this.exited = false;
		this.closed = false;
		this.processNotStarted = false;
		this.spawnfile = argv[0];
		this.spawnargs = [...argv];
		this.opened.promise.catch(() => {});
		this.on("error", () => {});
	}
	/** Only the admission owner can establish that no native process was started. */
	markNotStarted() {
		this.processNotStarted = true;
	}
	get notStarted() {
		return this.processNotStarted;
	}
	ready() {
		return this.opened.promise;
	}
	emit(event, ...args) {
		return this.callbackContext.runInAsyncScope(() => super.emit(event, ...args));
	}
	/** Transport bookkeeping survives disposal of the caller's event listeners. */
	waitForClose() {
		return this.completion.promise;
	}
	attachPipe(fd, socket) {
		socket.emit = this.callbackContext.bind(socket.emit.bind(socket));
		this.stdio[fd] = socket;
		if (fd === 0) this.stdin = socket;
		if (fd === 1) this.stdout = socket;
		if (fd === 2) this.stderr = socket;
		this.pipes.add(socket);
		let acknowledged = false;
		const acknowledge = (error) => {
			if (acknowledged) return;
			acknowledged = true;
			this.transmit({
				type: "output-drained",
				id: this.requestId,
				fd,
				error: error ? serializeBrokerError(error) : void 0
			}).catch(() => {});
		};
		socket.once(fd === 0 ? "finish" : "end", () => acknowledge());
		socket.on("error", acknowledge);
		socket.once("close", () => {
			acknowledge();
			this.pipes.delete(socket);
			this.finishClose();
		});
	}
	receive(message) {
		if (message.type === "spawned") {
			if (this.spawnReceived || this.closed) return;
			this.spawnReceived = true;
			this.pid = message.pid;
			this.spawnfile = message.spawnfile;
			this.spawnargs = message.spawnargs;
			this.connected = message.connected;
			this.stdio.splice(message.stdioLength);
			while (this.stdio.length < message.stdioLength) this.stdio.push(null);
			if (this.connected) this.channel = Object.assign(new EventEmitter(), {
				ref() {},
				unref() {}
			});
			this.opened.resolve();
			setImmediate(() => {
				if (this.closed) return;
				this.emit("spawn");
				setImmediate(() => {
					for (const [fd, pipe] of this.stdio.entries()) if (fd > 0 && pipe instanceof Socket && !pipe.destroyed) releasePipe(pipe);
					this.eventsReleased = true;
					for (const event of this.pendingEvents.splice(0)) event();
				});
			});
			return;
		}
		if (!this.eventsReleased && (this.spawnReceived || message.type !== "error")) {
			this.deferEvent(() => this.emitMessage(message));
			return;
		}
		this.emitMessage(message);
	}
	deferEvent(event) {
		if (this.pendingEventOverflow) return;
		if (this.pendingEvents.length >= 64) {
			this.pendingEventOverflow = true;
			this.pendingEvents.splice(0);
			this.pendingEvents.push(() => {
				this.kill("SIGKILL");
				this.failNow(new SpawnBrokerError("Spawn broker startup event capacity exceeded"));
			});
			return;
		}
		this.pendingEvents.push(event);
	}
	emitMessage(message) {
		switch (message.type) {
			case "error": {
				const error = Object.assign(new Error(message.error.message), message.error);
				this.opened.reject(error);
				this.emit("error", error);
				if (!this.pid) {
					this.exited = true;
					this.finishClose();
				}
				break;
			}
			case "exit":
				this.exited = true;
				this.exitCode = message.code;
				this.signalCode = message.signal;
				this.stdin?.destroy();
				this.emit("exit", message.code, message.signal);
				process.nextTick(() => {
					for (const pipe of this.pipes) if (pipe.readable) pipe.resume();
				});
				this.finishClose();
				break;
			case "ipc-sent":
				this.finishSend(message.sequence, message.error ? Object.assign(new Error(message.error.message), message.error) : null);
				break;
			case "disconnect":
				this.failSends(/* @__PURE__ */ new Error("Child process IPC channel is closed"));
				this.connected = false;
				this.channel = void 0;
				this.emit("disconnect");
				break;
			case "ipc":
				this.emit("message", message.message);
				break;
			case "closed": this.finishClose();
		}
	}
	fail(error) {
		if (this.spawnReceived && !this.eventsReleased) {
			this.deferEvent(() => this.failNow(error));
			return;
		}
		this.failNow(error);
	}
	failNow(error) {
		if (this.closed) return;
		this.opened.reject(error);
		this.failSends(error);
		const wasConnected = this.connected;
		this.connected = false;
		this.channel = void 0;
		if (wasConnected) this.emit("disconnect");
		if (!this.exited) this.emit("error", error);
		for (const pipe of this.pipes) pipe.destroy(error);
		this.exited = true;
		this.finishClose();
	}
	finishClose() {
		if (!this.exited || this.pipes.size > 0 || this.closed) return;
		this.closed = true;
		this.completion.resolve();
		this.emit("close", this.exitCode, this.signalCode);
	}
	kill(signal = "SIGTERM") {
		if (this.exited) return false;
		this.killed = true;
		this.transmit({
			type: "kill",
			id: this.requestId,
			signal
		}).catch((error) => this.fail(toErrorObject(error, "Spawn broker signal delivery failed")));
		return true;
	}
	send(message, handleOrCallback, optionsOrCallback, callback) {
		const done = typeof handleOrCallback === "function" ? handleOrCallback : typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
		if (!this.connected) {
			const error = /* @__PURE__ */ new Error("Child process IPC channel is closed");
			queueMicrotask(() => done ? done(error) : this.emit("error", error));
			return false;
		}
		if (this.sends.size >= 1024) {
			const error = /* @__PURE__ */ new Error("Child process IPC capacity exceeded");
			queueMicrotask(() => done ? done(error) : this.emit("error", error));
			return false;
		}
		const sequence = ++this.sendSequence;
		this.sends.set(sequence, AsyncResource.bind((error) => {
			if (done) done(error);
			else if (error) this.emit("error", error);
		}));
		const handle = typeof handleOrCallback === "function" ? void 0 : handleOrCallback;
		this.transmit({
			type: "ipc",
			id: this.requestId,
			sequence,
			message
		}, handle).catch((error) => this.finishSend(sequence, toErrorObject(error, "Spawn broker IPC delivery failed")));
		return true;
	}
	finishSend(sequence, error) {
		const callback = this.sends.get(sequence);
		this.sends.delete(sequence);
		callback?.(error);
	}
	failSends(error) {
		for (const sequence of this.sends.keys()) this.finishSend(sequence, error);
	}
	disconnect() {
		if (!this.connected) return;
		this.connected = false;
		this.transmit({
			type: "disconnect",
			id: this.requestId
		}).catch((error) => this.fail(toErrorObject(error, "Spawn broker disconnect failed")));
	}
	ref() {}
	unref() {}
	[Symbol.dispose]() {
		this.kill("SIGTERM");
	}
};
//#endregion
//#region packages/normalization-core/src/result.ts
/** Create a successful {@link Result}. */
function ok(value) {
	return {
		ok: true,
		value
	};
}
/** Create a failed {@link Result}. */
function err(error) {
	return {
		ok: false,
		error
	};
}
//#endregion
//#region packages/normalization-core/src/agent-id.ts
const DEFAULT_AGENT_ID = "main";
const VALID_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
const INVALID_CHARS_RE = /[^a-z0-9_-]+/g;
const LEADING_DASH_RE = /^-+/;
const TRAILING_DASH_RE = /-+$/;
/** Normalizes an OpenClaw agent id to its filesystem-safe canonical form. */
function normalizeAgentId(value) {
	const result = normalizeAgentIdStrict(value);
	return result.ok ? result.value : DEFAULT_AGENT_ID;
}
/** Normalizes an explicitly supplied agent id without falling back to the default agent. */
function normalizeAgentIdStrict(value) {
	const trimmed = (value ?? "").trim();
	const normalized = normalizeLowercaseStringOrEmpty(trimmed);
	if (VALID_ID_RE.test(trimmed)) return ok(normalized);
	const agentId = normalized.replace(INVALID_CHARS_RE, "-").replace(LEADING_DASH_RE, "").replace(TRAILING_DASH_RE, "").slice(0, 64);
	return agentId ? ok(agentId) : err("unrepresentable");
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
	if (!Array.isArray(scopes)) return [];
	const out = /* @__PURE__ */ new Set();
	for (const scope of scopes) {
		if (typeof scope !== "string") continue;
		const trimmed = scope.trim();
		if (trimmed) out.add(trimmed);
	}
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
//#region src/infra/device-identity-coordinator-paths.ts
function resolveDeviceIdentityCoordinatorFilename(databasePath) {
	const canonicalPath = resolvePathViaExistingAncestorSync$1(databasePath);
	return `device-identity.${sha256HexPrefixCore(canonicalPath, 8)}.lock.sqlite`;
}
function resolveDeviceIdentityCoordinatorPath(databasePath, lockDir) {
	return path.join(lockDir, resolveDeviceIdentityCoordinatorFilename(databasePath));
}
function resolveDeviceIdentityCoordinatorPaths(params) {
	const canonicalStateDir = resolvePathViaExistingAncestorSync$1(params.stateDir);
	return [path.join(resolveGatewayLockDir(canonicalStateDir, params.uid), resolveDeviceIdentityCoordinatorFilename(params.databasePath))];
}
//#endregion
//#region src/infra/device-identity-coordinator.ts
const DEFAULT_BUSY_TIMEOUT_MS = 5e3;
var DeviceIdentityCoordinatorError = class extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "DeviceIdentityCoordinatorError";
	}
};
function releaseCoordinators(coordinators) {
	const errors = [];
	for (const coordinator of coordinators.toReversed()) try {
		coordinator.release();
	} catch (error) {
		errors.push(error);
	}
	return errors;
}
function acquireCoordinator(coordinatorPath, busyTimeoutMs) {
	const message = "device identity migration or creation already owns this state database";
	try {
		const coordinator = tryAcquireExclusiveSqliteCoordinator(coordinatorPath, { busyTimeoutMs });
		if (coordinator) return coordinator;
		throw new DeviceIdentityCoordinatorError(message);
	} catch (error) {
		if (error instanceof DeviceIdentityCoordinatorError) throw error;
		throw new DeviceIdentityCoordinatorError(message, error);
	}
}
function ensurePrivateDeviceIdentityCoordinatorDirectory(directoryPath) {
	try {
		ensurePrivateSqliteCoordinatorDirectory(directoryPath, "device identity coordinator");
	} catch (error) {
		if (error instanceof SqliteCoordinatorError) throw new DeviceIdentityCoordinatorError(error.message, error.cause);
		throw error;
	}
}
function acquireDeviceIdentityCoordinator(params) {
	const timeout = Math.max(0, Math.trunc(params.busyTimeoutMs ?? DEFAULT_BUSY_TIMEOUT_MS));
	const coordinatorPaths = params.lockDir !== void 0 ? [resolveDeviceIdentityCoordinatorPath(params.databasePath, params.lockDir)] : resolveDeviceIdentityCoordinatorPaths({
		databasePath: params.databasePath,
		stateDir: params.stateDir,
		uid: typeof process.getuid === "function" ? process.getuid() : void 0
	});
	for (const coordinatorPath of coordinatorPaths) ensurePrivateDeviceIdentityCoordinatorDirectory(path.dirname(coordinatorPath));
	const stateCoordinatorPath = resolveStateDatabaseCoordinatorPath({
		databasePath: params.databasePath,
		runtimeDirectory: resolveStateLifecycleRuntimeDirectory(),
		uid: typeof process.getuid === "function" ? process.getuid() : void 0
	});
	const coordinators = [];
	try {
		coordinators.push(acquireStateDatabaseCoordinator({
			databasePath: params.databasePath,
			coordinatorPath: stateCoordinatorPath,
			busyTimeoutMs: timeout
		}));
		for (const coordinatorPath of coordinatorPaths) coordinators.push(acquireCoordinator(coordinatorPath, timeout));
	} catch (error) {
		const cleanupErrors = releaseCoordinators(coordinators);
		if (cleanupErrors.length === 0) {
			if (error instanceof SqliteCoordinatorError) throw new DeviceIdentityCoordinatorError("device identity migration or creation already owns this state database", error);
			throw error;
		}
		throw new DeviceIdentityCoordinatorError(error instanceof DeviceIdentityCoordinatorError ? `${error.message}; failed to clean up a partially acquired coordinator` : "failed to acquire and clean up device identity coordinators", new AggregateError([error, ...cleanupErrors]));
	}
	let released = false;
	return { release: () => {
		if (released) return;
		released = true;
		const releaseErrors = releaseCoordinators(coordinators);
		if (releaseErrors.length > 0) throw new DeviceIdentityCoordinatorError("failed to release device identity coordinator", releaseErrors.length === 1 ? releaseErrors[0] : new AggregateError(releaseErrors));
	} };
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
	const normalized = key ?? "primary";
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
	return row ? rowToStoredIdentity(row, identityKey) : null;
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
/** Read through the writable shared-state lifecycle, validating any existing row. */
function readStoredDeviceIdentity(options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	const stored = readStoredIdentityFromDatabase(openOpenClawStateDatabase({
		env: options.env,
		path: resolved.databasePath
	}), resolved.identityKey);
	if (stored) validateStoredDeviceIdentity(stored, resolved.identityKey);
	return stored;
}
/** Read without creating, repairing, chmodding, or joining the writer lifecycle. */
function readStoredDeviceIdentityReadOnly(options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly((database) => {
		let stored;
		try {
			stored = readStoredIdentityFromDatabase(database, resolved.identityKey);
		} catch (error) {
			if (isEmptyBootstrapIdentityTableMiss(database, error)) return null;
			throw error;
		}
		if (stored) validateStoredDeviceIdentity(stored, resolved.identityKey);
		return stored;
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
		const existing = readStoredIdentityFromDatabase({ db }, resolved.identityKey);
		if (existing) validateStoredDeviceIdentity(existing, resolved.identityKey);
		else {
			const kysely = getNodeSqliteKysely(db);
			executeSqliteQuerySync(db, kysely.insertInto("device_identities").values(storedIdentityToRow(resolved.identityKey, candidate)).onConflict((conflict) => conflict.column("identity_key").doNothing()));
		}
		const authoritative = readStoredIdentityFromDatabase({ db }, resolved.identityKey);
		if (!authoritative) throw new DeviceIdentityStorageError(`SQLite device identity "${resolved.identityKey}" was not durable after insert.`);
		validateStoredDeviceIdentity(authoritative, resolved.identityKey);
		return authoritative;
	}, {
		env: options.env,
		path: resolved.databasePath
	}, { operationLabel: "device-identity.create" });
}
//#endregion
//#region src/infra/path-existence.ts
/** Only a definite missing leaf permits callers to treat a path as absent. */
function pathMayExistSync(filePath) {
	try {
		fsSync.lstatSync(filePath);
		return true;
	} catch (error) {
		return !hasErrnoCode(error, "ENOENT");
	}
}
//#endregion
//#region src/infra/device-identity.ts
const LEGACY_DEVICE_IDENTITY_RELATIVE_PATH = path.join("identity", "device.json");
const DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const NATIVE_CLAIM_SUFFIX = ".native-importing";
function toDeviceIdentity(stored) {
	return {
		deviceId: stored.deviceId,
		publicKeyPem: stored.publicKeyPem,
		privateKeyPem: stored.privateKeyPem
	};
}
/** Exact retired file owned by Doctor migration code. */
function resolveLegacyDeviceIdentityPath(options = {}) {
	const { databasePath } = resolveDeviceIdentityStore(options);
	return path.join(resolveOpenClawStateDirForDatabasePath(databasePath), LEGACY_DEVICE_IDENTITY_RELATIVE_PATH);
}
function assertNoPendingLegacyIdentity(options) {
	const { identityKey } = resolveDeviceIdentityStore(options);
	if (identityKey !== "primary") return;
	const legacyPath = resolveLegacyDeviceIdentityPath(options);
	if (pathMayExistSync(`${legacyPath}${DOCTOR_CLAIM_SUFFIX}`) || pathMayExistSync(`${legacyPath}${NATIVE_CLAIM_SUFFIX}`) || pathMayExistSync(legacyPath)) throw new Error(`Legacy device identity exists at ${legacyPath}. Run "openclaw doctor --fix" before starting the gateway or connecting this client.`);
}
function withDeviceIdentityCoordinator(options, operation) {
	const resolved = resolveDeviceIdentityStore(options);
	const resolvedOptions = {
		...options,
		path: resolved.databasePath,
		identityKey: resolved.identityKey
	};
	const coordinator = acquireDeviceIdentityCoordinator({
		databasePath: resolved.databasePath,
		stateDir: resolveOpenClawStateDirForDatabasePath(resolved.databasePath)
	});
	let result;
	try {
		result = operation(resolved, resolvedOptions);
	} catch (operationError) {
		let releaseFailed = false;
		let releaseError;
		try {
			coordinator.release();
		} catch (error) {
			releaseFailed = true;
			releaseError = error;
		}
		if (releaseFailed) throw createSqliteLifecycleAggregateError([operationError, releaseError], "device identity operation and coordinator release both failed", operationError);
		throw operationError;
	}
	coordinator.release();
	return result;
}
function loadOrCreateDeviceIdentityOwned(options) {
	const { databasePath } = resolveDeviceIdentityStore(options);
	const existing = pathMayExistSync(databasePath) ? readStoredDeviceIdentity(options) : null;
	if (existing) return toDeviceIdentity(existing);
	assertNoPendingLegacyIdentity(options);
	return toDeviceIdentity(insertStoredDeviceIdentityIfAbsent(generateStoredDeviceIdentity(), options));
}
/** Load a valid canonical identity or atomically create its SQLite row. */
function loadOrCreateDeviceIdentity(options = {}) {
	return withDeviceIdentityCoordinator(options, (_resolved, resolvedOptions) => loadOrCreateDeviceIdentityOwned(resolvedOptions));
}
/** Load a valid persisted identity without creating or mutating SQLite state. */
function loadDeviceIdentityIfPresent(options = {}) {
	const stored = readStoredDeviceIdentityReadOnly(options);
	if (stored) return toDeviceIdentity(stored);
	assertNoPendingLegacyIdentity(options);
	return null;
}
/** Sign a UTF-8 payload with a PEM Ed25519 private key and return base64url bytes. */
function signDevicePayload(privateKeyPem, payload) {
	return signEd25519Payload(privateKeyPem, payload);
}
/** Export a PEM Ed25519 public key as canonical raw base64url bytes. */
function publicKeyRawBase64UrlFromPem(publicKeyPem) {
	return publicKeyRawBase64UrlFromEd25519Pem(publicKeyPem);
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
function normalizeIp(ip) {
	return normalizeIpAddress(ip);
}
/**
* Check if a hostname or IP refers to the local machine.
* Handles: localhost, 127.x.x.x, ::1, [::1], ::ffff:127.x.x.x
* Note: 0.0.0.0 and :: are NOT loopback - they bind to all interfaces.
*/
function isLoopbackHost(host) {
	const parsed = parseHostForAddressChecks$1(host);
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
	const parsed = parseHostForAddressChecks$1(host);
	if (!parsed) return false;
	if (parsed.isLocalhost) return true;
	const normalized = normalizeIp(parsed.unbracketedHost);
	if (!normalized || !isPrivateOrLoopbackAddress(normalized)) return false;
	if (net.isIP(normalized) === 6) {
		if (normalized.startsWith("ff")) return false;
		if (normalized === "::") return false;
	}
	return true;
}
function parseHostForAddressChecks$1(host) {
	if (!host) return null;
	const normalizedHost = normalizeLowercaseStringOrEmpty(host);
	const canonicalHost = normalizedHost.replace(/\.+$/, "");
	if (canonicalHost === "localhost") return {
		isLocalhost: true,
		unbracketedHost: canonicalHost
	};
	return {
		isLocalhost: false,
		unbracketedHost: normalizedHost.startsWith("[") && normalizedHost.endsWith("]") ? normalizedHost.slice(1, -1) : normalizedHost
	};
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
		if (isPrivateOrLoopbackHost$1(parsed.hostname)) return true;
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
function resolveDeviceIdentityForGatewayCall(sharedStateMode) {
	try {
		return sharedStateMode === "read-only" ? loadDeviceIdentityIfPresent() : loadOrCreateDeviceIdentity();
	} catch {
		return null;
	}
}
function shouldOmitDeviceIdentityForGatewayCall(params) {
	const mode = params.opts.mode ?? GATEWAY_CLIENT_MODES.CLI;
	const clientName = params.opts.clientName ?? GATEWAY_CLIENT_NAMES.CLI;
	const hasSharedSecretAuth = params.authMode === "token" && Boolean(params.token) || params.authMode === "password" && Boolean(params.password);
	const isLoopback = isLoopbackGatewayUrl(params.url);
	const isLocalBackendSharedAuth = mode === GATEWAY_CLIENT_MODES.BACKEND && clientName === GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT && (hasSharedSecretAuth || params.allowAuthNone === true) && isLoopback;
	const isLocalCliSharedAuth = mode === GATEWAY_CLIENT_MODES.CLI && clientName === GATEWAY_CLIENT_NAMES.CLI && hasSharedSecretAuth && isLoopback;
	return isLocalBackendSharedAuth || isLocalCliSharedAuth;
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
//#region src/secrets/resolve-errors.ts
/** Error for failures that affect an entire configured secret provider. */
var SecretProviderResolutionError = class extends Error {
	constructor(params) {
		super(params.message, params.cause !== void 0 ? { cause: params.cause } : void 0);
		this.scope = "provider";
		this.name = "SecretProviderResolutionError";
		this.code = params.code;
		this.source = params.source;
		this.provider = params.provider;
	}
};
/** Error for failures limited to one SecretRef id under a provider. */
var SecretRefResolutionError = class extends Error {
	constructor(params) {
		super(params.message, params.cause !== void 0 ? { cause: params.cause } : void 0);
		this.scope = "ref";
		this.name = "SecretRefResolutionError";
		this.code = params.code;
		this.source = params.source;
		this.provider = params.provider;
		this.refId = params.refId;
	}
};
function isSecretResolutionError(value) {
	return value instanceof SecretProviderResolutionError || value instanceof SecretRefResolutionError;
}
/** Sanitized provider detail suitable for operator-facing diagnostics. */
function describeSecretResolutionOperatorDiagnostic(value) {
	if (value instanceof SecretRefResolutionError && value.code === "SECRET_REF_REDACTED_VALUE") return `Secret reference "${value.source}:${value.provider}:${value.refId}" resolves to a redaction placeholder`;
	if (value instanceof SecretProviderResolutionError && value.code === "SECRET_PROVIDER_PATH_SECURITY_UNVERIFIABLE") return "Windows path security could not be verified";
}
/** Sanitized recovery action suitable for operator-facing diagnostics. */
function describeSecretResolutionOperatorRecovery(value) {
	if (value instanceof SecretRefResolutionError && value.code === "SECRET_REF_REDACTED_VALUE") return "Run openclaw doctor --fix to repair a store-backed Gateway token; supply a real credential for other secrets, then restart the Gateway and reconnect or re-pair clients";
	if (!(value instanceof SecretProviderResolutionError) || value.code !== "SECRET_PROVIDER_PATH_SECURITY_UNVERIFIABLE") return;
	return value.source === "exec" ? "Restore Windows path security verification, or use an existing provider command whose owner and ACLs OpenClaw can verify" : "Restore Windows path security verification, or use an existing secret file whose owner and ACLs OpenClaw can verify";
}
function providerResolutionError(params) {
	return new SecretProviderResolutionError({
		...params,
		code: params.code ?? "SECRET_PROVIDER_UNAVAILABLE"
	});
}
function refResolutionError(params) {
	return new SecretRefResolutionError(params);
}
const REDACTED_SECRET_VALUES = /* @__PURE__ */ new Set([
	"__OPENCLAW_REDACTED__",
	"REDACTED",
	"xoxb-REDACTED",
	"xapp-REDACTED",
	"***",
	"[redacted]",
	"[REDACTED]",
	"<redacted>",
	"[REDACTED_PRIVATE_KEY]",
	"[REDACTED CREDENTIAL]"
]);
function isRedactedSecretValue(value) {
	return typeof value === "string" && REDACTED_SECRET_VALUES.has(value.trim());
}
//#endregion
//#region packages/model-catalog-core/src/provider-id.ts
function normalizeProviderId(provider) {
	return normalizeLowercaseStringOrEmpty(provider);
}
//#endregion
//#region src/config/model-policy-allowlist-migration.ts
/** A per-agent policy replaces inherited defaults only when it owns `allow`. */
function hasExplicitModelPolicyAllow(value) {
	return isRecord(value) && Object.hasOwn(value, "allow");
}
//#endregion
//#region src/agents/agent-roster.ts
function collectAgentEntries(cfg, withSource, limit) {
	const roster = readAgentRosterProperty(cfg);
	if (roster?.kind === "entries" && isRecord(roster.value)) {
		const result = [];
		for (const id in roster.value) {
			if (!Object.hasOwn(roster.value, id)) continue;
			const entry = roster.value[id];
			if (isRecord(entry)) {
				const projected = {
					...entry,
					id
				};
				result.push(withSource ? {
					entry: projected,
					source: {
						kind: "entries",
						key: id
					}
				} : projected);
				if (result.length === limit) break;
			}
		}
		return result;
	}
	if (roster?.kind !== "list" || !Array.isArray(roster.value)) return [];
	const listed = [];
	roster.value.some((entry, index) => {
		if (entry !== null && typeof entry === "object") listed.push({
			entry,
			source: {
				kind: "list",
				index
			}
		});
		return listed.length === limit;
	});
	return withSource ? listed : listed.map(({ entry }) => entry);
}
/** Lists valid configured agent entries from config. */
function listAgentEntriesWithSource(cfg) {
	return collectAgentEntries(cfg, true);
}
/** Lists valid configured agent entries from either supported representation. */
function listAgentEntries(cfg) {
	return collectAgentEntries(cfg, false);
}
/** Reads the explicitly owned raw roster without normalizing malformed values. */
function readAgentRosterProperty(raw) {
	if (!isRecord(raw)) return;
	const agents = raw.agents;
	if (!isRecord(agents)) return;
	const entries = agents["entries"];
	if (Object.hasOwn(agents, "entries") && entries !== void 0) return {
		kind: "entries",
		value: entries
	};
	const list = agents["list"];
	if (Object.hasOwn(agents, "list") && list !== void 0) return {
		kind: "list",
		value: list
	};
}
/** True when raw config explicitly owns either supported roster representation. */
function hasAgentRosterProperty(raw) {
	return readAgentRosterProperty(raw) !== void 0;
}
/** Lists unique configured agent ids. */
function listAgentIds(cfg) {
	const agents = listAgentEntries(cfg);
	if (agents.length === 0 && !hasAgentRosterProperty(cfg)) return [LEGACY_IMPLICIT_AGENT_ID];
	const seen = /* @__PURE__ */ new Set();
	const ids = [];
	for (const entry of agents) {
		const id = normalizeAgentId(entry?.id);
		if (seen.has(id)) continue;
		seen.add(id);
		ids.push(id);
	}
	return ids;
}
function tryResolveSoleAgentId(cfg) {
	const agents = collectAgentEntries(cfg, false, 2);
	if (agents.length === 0) {
		if (!hasAgentRosterProperty(cfg)) return LEGACY_IMPLICIT_AGENT_ID;
		return;
	}
	return agents.length === 1 ? normalizeAgentId(agents[0].id) : void 0;
}
function tryResolveRawLegacyDefaultAgentId(cfg) {
	if (cfg.agents?.ownership === "explicit") return;
	const marked = listAgentEntries(cfg).filter((entry) => entry.default === true);
	return marked.length === 1 ? normalizeAgentId(marked[0].id) : void 0;
}
/** @deprecated Use tryResolveSoleAgentId; accepts raw shipped markers only for input compatibility. */
function tryResolveDefaultAgentId(cfg) {
	return tryResolveRawLegacyDefaultAgentId(cfg) ?? tryResolveSoleAgentId(cfg);
}
/** Preserves legacy data locators independently of the configured runtime owner. */
function tryResolveLegacyDataOwner(cfg) {
	const retained = getRetainedLegacyDefaultAgentId(cfg);
	return retained && listAgentIds(cfg).includes(retained) ? retained : tryResolveDefaultAgentId(cfg);
}
//#endregion
//#region src/agents/workspace-default-path.ts
/**
* Default agent workspace resolver.
*
* Derives the process workspace directory from env, profile, and home-directory state.
*/
/** Resolve the default agent workspace directory from env/profile/home state. */
function resolveDefaultAgentWorkspaceDir(env = process.env, homedir = os.homedir) {
	const workspaceDir = env.OPENCLAW_WORKSPACE_DIR?.trim();
	if (workspaceDir) return path.resolve(workspaceDir);
	if (env.OPENCLAW_STATE_DIR?.trim()) return path.join(resolveStateDir(env, homedir), "workspace");
	const home = resolveRequiredHomeDir(env, homedir);
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (profile && normalizeOptionalLowercaseString(profile) !== "default") return path.join(resolveProfileStateDir(profile, env, homedir), "workspace");
	return path.join(home, ".openclaw", "workspace");
}
resolveDefaultAgentWorkspaceDir();
//#endregion
//#region src/agents/agent-scope-config.ts
/** Resolves configured agent ids, directories, workspaces, and merged agent defaults. */
/** Strip null bytes from paths to prevent ENOTDIR errors. */
function stripNullBytes(s) {
	return s.replaceAll("\0", "");
}
let activeAgentRosterFactsBatch;
const immutableAgentRosterFacts = /* @__PURE__ */ new WeakMap();
function readAgentRosterFacts(cfg) {
	if (void 0 === cfg) return activeAgentRosterFactsBatch.facts;
	if (!isDeeplyFrozenPlainData(cfg)) return;
	const legacyOwner = getRetainedLegacyDefaultAgentId(cfg);
	let cached = immutableAgentRosterFacts.get(cfg);
	if (!cached || cached.legacyOwner !== legacyOwner) {
		cached = {
			legacyOwner,
			facts: {}
		};
		immutableAgentRosterFacts.set(cfg, cached);
	}
	return cached.facts;
}
/** Preserves legacy data locators independently of the configured runtime owner. */
function tryResolveLegacyDataOwnerAgentId(cfg) {
	const facts = readAgentRosterFacts(cfg);
	if (facts?.legacyDataOwnerAgentId) return facts.legacyDataOwnerAgentId.value;
	const value = tryResolveLegacyDataOwner(cfg);
	if (facts) facts.legacyDataOwnerAgentId = { value };
	return value;
}
function resolveAgentEntry(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const facts = readAgentRosterFacts(cfg);
	if (facts) {
		const found = (facts.entryByNormalizedId ??= buildAgentEntryIndex(cfg)).get(id);
		return found ? found.clone ? { ...found.entry } : found.entry : void 0;
	}
	const roster = readAgentRosterProperty(cfg);
	if (roster?.kind === "entries" && isRecord(roster.value)) {
		const entries = roster.value;
		for (const key in entries) {
			if (!Object.hasOwn(entries, key)) continue;
			const entry = entries[key];
			if (isRecord(entry) && normalizeAgentId(key) === id) return {
				...entry,
				id: key
			};
		}
		return;
	}
	if (roster?.kind === "list" && Array.isArray(roster.value)) return roster.value.find((entry) => entry !== null && typeof entry === "object" && normalizeAgentId(entry.id) === id);
}
/**
* First-match index over the projected roster for batch point lookups.
*
* Keyed entries must stay clone-on-read (callers may mutate the returned
* entry); list entries keep the original object, matching the direct
* traversal semantics of `resolveAgentEntry` outside a batch.
*/
function buildAgentEntryIndex(cfg) {
	const index = /* @__PURE__ */ new Map();
	for (const { entry, source } of listAgentEntriesWithSource(cfg)) {
		const normalizedId = normalizeAgentId(entry?.id);
		if (!index.has(normalizedId)) index.set(normalizedId, {
			clone: source.kind === "entries",
			entry
		});
	}
	return index;
}
/** Resolves merged config for one agent id. */
function resolveAgentConfig(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const entry = resolveAgentEntry(cfg, id) ?? (!hasAgentRosterProperty(cfg) && id === "main" ? { id } : void 0);
	if (!entry) return;
	const agentDefaults = cfg.agents?.defaults;
	return {
		name: readStringValue(entry.name),
		workspace: readStringValue(entry.workspace),
		agentDir: readStringValue(entry.agentDir),
		model: typeof entry.model === "string" || entry.model && typeof entry.model === "object" ? entry.model : void 0,
		...entry.models ? { models: entry.models } : {},
		...entry.params ? { params: entry.params } : {},
		...entry.runtime ? { runtime: entry.runtime } : {},
		...hasExplicitModelPolicyAllow(entry.modelPolicy) ? { modelPolicy: entry.modelPolicy } : {},
		...entry.agentRuntime ? { agentRuntime: entry.agentRuntime } : {},
		utilityModel: readStringValue(entry.utilityModel),
		decisionModel: readStringValue(entry.decisionModel),
		thinkingDefault: entry.thinkingDefault,
		verboseDefault: entry.verboseDefault ?? agentDefaults?.verboseDefault,
		toolProgressDetail: entry.toolProgressDetail ?? agentDefaults?.toolProgressDetail,
		reasoningDefault: entry.reasoningDefault,
		fastModeDefault: entry.fastModeDefault ?? agentDefaults?.fastModeDefault,
		contextInjection: entry.contextInjection,
		bootstrapMaxChars: entry.bootstrapMaxChars,
		bootstrapTotalMaxChars: entry.bootstrapTotalMaxChars,
		experimental: typeof entry.experimental === "object" && entry.experimental ? {
			...agentDefaults?.experimental,
			...entry.experimental
		} : agentDefaults?.experimental,
		skills: Array.isArray(entry.skills) ? entry.skills : void 0,
		memory: entry.memory,
		humanDelay: entry.humanDelay,
		typingMode: entry.typingMode ?? agentDefaults?.typingMode,
		tts: entry.tts,
		contextLimits: typeof entry.contextLimits === "object" && entry.contextLimits ? {
			...agentDefaults?.contextLimits,
			...entry.contextLimits
		} : agentDefaults?.contextLimits,
		heartbeat: entry.heartbeat,
		identity: entry.identity,
		groupChat: entry.groupChat,
		subagents: typeof entry.subagents === "object" && entry.subagents ? entry.subagents : void 0,
		embeddedAgent: typeof entry.embeddedAgent === "object" && entry.embeddedAgent ? entry.embeddedAgent : void 0,
		sandbox: entry.sandbox,
		tools: entry.tools
	};
}
function resolveAgentWorkspaceDir(cfg, agentId, env = process.env) {
	const id = normalizeAgentId(agentId);
	const configured = resolveAgentConfig(cfg, id)?.workspace?.trim();
	if (configured) return stripNullBytes(resolveUserPath(configured, env));
	const inheritedWorkspaceAgentId = tryResolveLegacyDataOwnerAgentId(cfg);
	const fallback = cfg.agents?.defaults?.workspace?.trim();
	if (inheritedWorkspaceAgentId && id === inheritedWorkspaceAgentId) {
		if (fallback) return stripNullBytes(resolveUserPath(fallback, env));
		return stripNullBytes(resolveDefaultAgentWorkspaceDir(env));
	}
	if (fallback) return stripNullBytes(path.join(resolveUserPath(fallback, env), id));
	const stateDir = resolveStateDir(env);
	return stripNullBytes(path.join(stateDir, `workspace-${id}`));
}
//#endregion
//#region src/agents/workspace-dirs.ts
/** Lists unique workspace directories for configured agents and the default agent. */
function listAgentWorkspaceDirs(cfg, env = process.env) {
	const dirs = /* @__PURE__ */ new Set();
	for (const agentId of listAgentIds(cfg)) dirs.add(resolveAgentWorkspaceDir(cfg, agentId, env));
	return [...dirs];
}
//#endregion
//#region src/plugins/current-plugin-metadata-state.ts
/** Owns config identity reuse for the current immutable metadata snapshot. */
const currentPluginMetadataConfigIdentityCache = {
	add(config) {
		getProcessPluginCache().metadata.current.configIdentities.add(config);
	},
	clear() {
		getProcessPluginCache().metadata.current.configIdentities = /* @__PURE__ */ new WeakSet();
	},
	has(config) {
		return getProcessPluginCache().metadata.current.configIdentities.has(config);
	}
};
/** Stores the process-current plugin metadata snapshot and compatible config fingerprints. */
function setCurrentPluginMetadataSnapshotState(snapshot, configFingerprint, compatiblePolicyHashes, compatibleConfigFingerprints, modelIdNormalizationPolicies, owner = "operation", envFingerprint, defaultDiscoveryCompatible = false, agentWorkspaceFingerprint) {
	const state = getProcessPluginCache().metadata.current;
	state.snapshot = snapshot;
	state.owner = owner;
	state.configFingerprint = snapshot ? configFingerprint : void 0;
	state.agentWorkspaceFingerprint = snapshot ? agentWorkspaceFingerprint : void 0;
	state.envFingerprint = snapshot ? envFingerprint : void 0;
	state.defaultDiscoveryCompatible = Boolean(snapshot && defaultDiscoveryCompatible);
	state.compatiblePolicyHashes = snapshot ? compatiblePolicyHashes : void 0;
	state.compatibleConfigFingerprints = snapshot ? compatibleConfigFingerprints : void 0;
	state.revision = Symbol("plugin-metadata-snapshot");
}
/** Reads the boot inventory without importing discovery into lightweight consumers. */
function getGatewayPluginMetadataSnapshot() {
	const cache = getPluginCache();
	if (cache.kind === "process" && cache.metadata.current.owner === "gateway") return cache.metadata.current.snapshot;
}
/** Captures the current snapshot and the policies eligible for process-wide publication. */
function getCurrentPluginMetadataSnapshotState() {
	const state = getProcessPluginCache().metadata.current;
	return {
		snapshot: state.snapshot,
		owner: state.owner,
		configFingerprint: state.configFingerprint,
		agentWorkspaceFingerprint: state.agentWorkspaceFingerprint,
		envFingerprint: state.envFingerprint,
		defaultDiscoveryCompatible: state.defaultDiscoveryCompatible,
		compatiblePolicyHashes: state.compatiblePolicyHashes,
		compatibleConfigFingerprints: state.compatibleConfigFingerprints,
		revision: state.revision
	};
}
//#endregion
//#region src/state/config-machine-state.ts
function normalizeConfigMachineStateKey(key) {
	const normalized = key.trim();
	if (!normalized) throw new Error("config machine state key must not be empty");
	return normalized;
}
function readConfigMachineStateRowInDatabase(database, key) {
	if (!tableExists(database, "config_machine_state")) return;
	const db = getNodeSqliteKysely(database);
	return executeSqliteQueryTakeFirstSync(database, db.selectFrom("config_machine_state").select(["value_json", "updated_at_ms"]).where("state_key", "=", normalizeConfigMachineStateKey(key)));
}
function readConfigMachineStateWithMetadata(key, options = {}, behavior = {}) {
	const read = ({ db: database }) => {
		const row = readConfigMachineStateRowInDatabase(database, key);
		return row ? {
			value: JSON.parse(row.value_json),
			updatedAtMs: row.updated_at_ms
		} : void 0;
	};
	return behavior.artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(read, options) : withExistingOpenClawStateDatabaseReadOnly(read, options);
}
function readConfigMachineState(key, options = {}, behavior = {}) {
	return readConfigMachineStateWithMetadata(key, options, behavior)?.value;
}
//#endregion
//#region src/plugins/install-root-context.ts
const pluginInstallRootContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstallRootContext"), () => new AsyncLocalStorage());
/** Resolve the ordinary operator-owned plugin roots before a run redirects state. */
function resolvePluginInstallRoots(env = process.env, homedir = os.homedir) {
	const configDir = resolveConfigDir(env, homedir);
	return Object.freeze({
		extensionsDir: path.join(configDir, "extensions"),
		gitDir: path.join(configDir, "git"),
		npmDir: path.join(configDir, "npm"),
		stateDir: resolveStateDir(env, homedir)
	});
}
/** Return run-pinned install roots, or resolve the caller's ordinary roots. */
function resolveActivePluginInstallRoots(env = process.env, homedir = os.homedir) {
	return pluginInstallRootContext.getStore() ?? resolvePluginInstallRoots(env, homedir);
}
/** Artifact paths do not need the state directory's legacy-location filesystem probes. */
function resolveActivePluginInstallDir(kind, env = process.env, homedir = os.homedir) {
	const roots = pluginInstallRootContext.getStore();
	return roots ? roots[`${kind}Dir`] : path.join(resolveConfigDir(env, homedir), kind);
}
/** Return whether the current run pinned operator-owned plugin install roots. */
function hasActivePluginInstallRoots() {
	return pluginInstallRootContext.getStore() !== void 0;
}
//#endregion
//#region src/plugins/plugin-metadata-snapshot-readers.ts
const snapshotReaderSlot = resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaders"), () => ({}));
resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaderCustody"), () => ({ owners: 0 }));
/** Called at module evaluation; a retained Gateway keeps its registered readers. */
function registerPluginMetadataSnapshotReaders(readers) {
	Object.assign(snapshotReaderSlot, readers);
}
resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceCaptureContext"), () => AsyncLocalStorage.snapshot());
//#endregion
//#region src/plugins/plugin-source-capture-directory.ts
const { instances, ownedRoots, sweeps, warningBackoff } = resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceCaptureInstances"), () => {
	process.once("exit", () => {
		for (const [key, instance] of instances) try {
			const root = retireInstance(key, instance);
			if (root) fsSync.rmSync(root, {
				recursive: true,
				force: true
			});
		} catch (error) {
			process.stderr.write(`Plugin source capture exit cleanup failed: ${String(error)}\n`);
		}
	});
	return {
		instances: /* @__PURE__ */ new Map(),
		ownedRoots: /* @__PURE__ */ new Set(),
		sweeps: /* @__PURE__ */ new Map(),
		warningBackoff: /* @__PURE__ */ new Map()
	};
});
function retireInstance(key, instance) {
	instance.closing = true;
	instance.lease?.release();
	if (instance.root) ownedRoots.delete(instance.root);
	instance.references = 0;
	instances.delete(key);
	clearInterval(instance.timer);
	return instance.root;
}
resolveGlobalSingleton(Symbol.for("openclaw.pluginRuntimeCloseRetainedError"), () => class RetainedRuntimeError extends Error {
	constructor(cause) {
		super("Plugin runtime still owns resources; inspect cleanup failures before retrying Gateway close.", { cause });
		this.name = "PluginRuntimeCloseRetainedError";
	}
});
//#endregion
//#region src/plugins/plugin-metadata-lifecycle.ts
/** Coordinates plugin metadata snapshot and process memo cache lifecycle resets. */
const pluginMetadataProcessMemoClears = /* @__PURE__ */ new Map();
resolveGlobalSingleton(Symbol.for("openclaw.gatewayPluginMetadataOwners"), () => /* @__PURE__ */ new Set());
/** Registers a metadata clear hook with the lifetime of its facts. */
function registerPluginMetadataProcessMemoLifecycleClear(clearProcessMemo, options = { owner: "process" }) {
	pluginMetadataProcessMemoClears.set(clearProcessMemo, options.owner);
}
//#endregion
//#region src/plugins/installed-plugin-index-row.ts
const INSTALLED_PLUGIN_INDEX_STATE_KEY = "plugins.installedIndex";
/** Shared inspection commands use the same existing-only, artifact-preserving reader. */
function readPluginMetadataStateRowSync(selector, databaseOptions, artifactPreservingReadOnly = false) {
	const row = readPluginMetadataStateRowsSync([selector === "installed-index" ? INSTALLED_PLUGIN_INDEX_STATE_KEY : "plugins.bundledDiscovery"], databaseOptions, artifactPreservingReadOnly)[0];
	return row ? { value_json: row.value_json } : void 0;
}
/** Acquire related metadata facts from the same prepared database bytes. */
function readPluginMetadataStateRowsSync(stateKeys, databaseOptions, artifactPreservingReadOnly = false) {
	const read = ({ db }) => {
		if (!tableExists(db, "config_machine_state")) return [];
		return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("config_machine_state").select(["state_key", "value_json"]).where("state_key", "in", stateKeys)).rows;
	};
	return (artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(read, databaseOptions) : withExistingOpenClawStateDatabaseReadOnly(read, databaseOptions)) ?? [];
}
//#endregion
//#region src/plugins/bundled-discovery-state.ts
function parseBundledDiscoveryMode(value) {
	return value === "compat" || value === "allowlist" ? value : void 0;
}
function readBundledDiscoveryFact(read) {
	try {
		return read();
	} catch (error) {
		if (isStateDatabaseReadAdmissionInvalidatedError(error)) throw new PluginCacheFactInvalidatedError("Plugin discovery read admission changed during preparation; retry the operation.", { cause: error });
		throw error;
	}
}
function resolveBundledDiscoveryOptions(options) {
	return options.path || options.database || !hasActivePluginInstallRoots() ? options : {
		...options,
		env: {
			...options.env ?? process.env,
			OPENCLAW_STATE_DIR: resolveActivePluginInstallRoots(options.env).stateDir
		}
	};
}
function readBundledDiscoveryMode(options = {}, behavior = {}) {
	const resolvedOptions = resolveBundledDiscoveryOptions(options);
	return parseBundledDiscoveryMode(readBundledDiscoveryFact(() => readConfigMachineState("plugins.bundledDiscovery", resolvedOptions, behavior)));
}
const discoveryState = resolveGlobalSingleton(Symbol.for("openclaw.bundledDiscoveryMode"), () => ({
	generation: {},
	snapshotModes: /* @__PURE__ */ new WeakMap()
}));
registerPluginMetadataProcessMemoLifecycleClear(() => {
	clearBundledDiscoveryModeMemo();
});
function resolveBundledDiscoveryMemoKey(env) {
	const scopedEnv = hasActivePluginInstallRoots() ? {
		...env,
		OPENCLAW_STATE_DIR: resolveActivePluginInstallRoots(env).stateDir
	} : env;
	return resolveOpenClawStateSqlitePath(scopedEnv);
}
/**
* Callers loading a registry with an explicit env pass it so the mode comes
* from that env's state root; omitting it reads the process root. Pinned
* install roots win over both, matching readBundledDiscoveryMode.
*/
function readBundledDiscoveryModeMemoized(env = process.env, behavior = {}, readPreparedValue) {
	const options = env === process.env ? {} : { env };
	const snapshot = behavior.artifactPreservingReadOnly || isArtifactPreservingStateRead() ? readBundledDiscoveryFact(() => getActiveOpenClawStateDatabaseReadSnapshot(resolveBundledDiscoveryOptions(options))) : void 0;
	if (snapshot || behavior.artifactPreservingReadOnly) {
		const prepared = snapshot && discoveryState.snapshotModes.get(snapshot);
		if (prepared) return prepared.value;
		const value = readBundledDiscoveryMode(options, behavior);
		if (snapshot) discoveryState.snapshotModes.set(snapshot, { value });
		return value;
	}
	const key = resolveBundledDiscoveryMemoKey(env);
	if (discoveryState.memoized?.key !== key) {
		const owner = getPluginCache();
		const prepared = owner.preparedBundledDiscoveryModes.get(key);
		if (prepared && "value" in prepared && prepared.value.generation === discoveryState.generation) {
			getPluginCacheRetirementSignal(owner).throwIfAborted();
			discoveryState.memoized = {
				key,
				value: prepared.value.value
			};
		} else discoveryState.memoized = {
			key,
			value: readPreparedValue ? parseBundledDiscoveryMode(readBundledDiscoveryFact(() => readPreparedValue(key))) : readBundledDiscoveryMode(env === process.env ? {} : { env })
		};
	}
	return discoveryState.memoized.value;
}
/**
* Clears the memo after a machine-state write so same-process readers observe
* the new mode. Without this, doctor's migration could cache the pre-migration
* absent mode and rebuild plugin indexes against stale strict-gate decisions.
*/
function clearBundledDiscoveryModeMemo() {
	discoveryState.memoized = void 0;
	discoveryState.snapshotModes = /* @__PURE__ */ new WeakMap();
	discoveryState.generation = {};
	for (const cache of /* @__PURE__ */ new Set([getPluginCache(), getProcessPluginCache()])) cache.preparedBundledDiscoveryModes.clear();
}
//#endregion
//#region src/plugins/compat/deprecation-marking.ts
const MARKING_DATE = "2026-07-25";
const DEFAULT_REMOVE_AFTER = "2026-10-01";
/** Dated metadata for shipped deprecated surfaces that previously had annotations only. */
const DEPRECATION_MARKING_COMPAT_RECORDS = [
	{
		code: "plugin-sdk-channel-setup-input-fields",
		status: "deprecated",
		owner: "channel",
		introduced: MARKING_DATE,
		deprecated: MARKING_DATE,
		warningStarts: MARKING_DATE,
		removeAfter: DEFAULT_REMOVE_AFTER,
		replacement: "plugin-local setup input intersections that declare each owning channel field",
		docsPath: "/plugins/sdk-migration#published-channel-setup-compatibility",
		surfaces: [
			"ChannelSetupInput.privateKey",
			"ChannelSetupInput.secret",
			"ChannelSetupInput.botToken",
			"ChannelSetupInput.appToken",
			"ChannelSetupInput.signingSecret",
			"ChannelSetupInput.mode",
			"ChannelSetupInput.cliPath",
			"ChannelSetupInput.authDir",
			"ChannelSetupInput.httpUrl",
			"ChannelSetupInput.httpPort",
			"ChannelSetupInput.webhookPath",
			"ChannelSetupInput.webhookUrl",
			"ChannelSetupInput.userId",
			"ChannelSetupInput.accessToken",
			"ChannelSetupInput.password",
			"ChannelSetupInput.deviceName",
			"ChannelSetupInput.url",
			"ChannelSetupInput.baseUrl",
			"ChannelSetupInput.code",
			"ChannelSetupInput.groupChannels",
			"ChannelSetupInput.dmAllowlist",
			"ChannelSetupInput.autoDiscoverChannels"
		],
		diagnostics: ["TypeScript @deprecated annotations on the reader-backed ChannelSetupInput compatibility tier", "published-plugin artifact reader sweep required before field removal"],
		tests: ["src/plugin-sdk/channel-setup.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "ChannelSetupInput keeps its reader-backed channel fields through the dated migration window while plugins move them into plugin-local input types."
	},
	{
		code: "plugin-sdk-broad-runtime-barrels",
		status: "deprecated",
		owner: "sdk",
		introduced: MARKING_DATE,
		deprecated: MARKING_DATE,
		warningStarts: MARKING_DATE,
		removeAfter: DEFAULT_REMOVE_AFTER,
		replacement: "focused plugin SDK subpaths for each runtime capability",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"openclaw/plugin-sdk/agent-runtime",
			"openclaw/plugin-sdk/agent-runtime loadModelCatalog params.useCache",
			"openclaw/plugin-sdk/agent-runtime loadModelCatalog params.cacheOnly",
			"openclaw/plugin-sdk/agent-runtime loadModelCatalog params.metadataSnapshot",
			"openclaw/plugin-sdk/agent-runtime loadModelCatalog",
			"openclaw/plugin-sdk/cli-runtime",
			"openclaw/plugin-sdk/conversation-runtime",
			"openclaw/plugin-sdk/hook-runtime",
			"openclaw/plugin-sdk/media-runtime",
			"openclaw/plugin-sdk/media-runtime buildAgentMediaPayload",
			"openclaw/plugin-sdk/plugin-runtime",
			"openclaw/plugin-sdk/security-runtime"
		],
		diagnostics: ["TypeScript @deprecated annotations on broad plugin SDK barrels", "plugin boundary report compatibility inventory"],
		tests: ["src/plugins/contracts/plugin-sdk-subpaths.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Broad agent, CLI, conversation, hook, media, plugin, and security runtime barrels remain available while bundled and external plugins migrate to focused subpaths."
	},
	{
		code: "plugin-sdk-provider-owned-helper-shims",
		status: "deprecated",
		owner: "provider",
		introduced: MARKING_DATE,
		deprecated: MARKING_DATE,
		warningStarts: MARKING_DATE,
		removeAfter: DEFAULT_REMOVE_AFTER,
		replacement: "provider-local auth, model, replay, OAuth, and stream helper APIs",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"openclaw/plugin-sdk/provider-stream GOOGLE_THINKING_STREAM_HOOKS",
			"openclaw/plugin-sdk/provider-stream KILOCODE_THINKING_STREAM_HOOKS",
			"openclaw/plugin-sdk/provider-stream MOONSHOT_THINKING_STREAM_HOOKS",
			"openclaw/plugin-sdk/provider-stream MINIMAX_FAST_MODE_STREAM_HOOKS",
			"openclaw/plugin-sdk/provider-stream OPENAI_RESPONSES_STREAM_HOOKS",
			"openclaw/plugin-sdk/provider-stream OPENROUTER_THINKING_STREAM_HOOKS",
			"openclaw/plugin-sdk/provider-stream TOOL_STREAM_DEFAULT_ON_HOOKS",
			"openclaw/plugin-sdk/provider-stream-shared defaultToolStreamExtraParams",
			"openclaw/plugin-sdk/provider-stream-shared stripTrailingAnthropicAssistantPrefillWhenThinking",
			"openclaw/plugin-sdk/provider-stream-shared createAnthropicThinkingPrefillPayloadWrapper",
			"openclaw/plugin-sdk/provider-stream-shared OpenAICompatibleThinkingLevel",
			"openclaw/plugin-sdk/provider-stream-shared isOpenAICompatibleThinkingEnabled",
			"openclaw/plugin-sdk/provider-stream-shared DeepSeekV4ThinkingLevel",
			"openclaw/plugin-sdk/provider-stream-shared DeepSeekV4ReasoningEffort",
			"openclaw/plugin-sdk/provider-stream-shared createDeepSeekV4OpenAICompatibleThinkingWrapper",
			"openclaw/plugin-sdk/provider-stream-shared createThinkingOnlyFinalTextWrapper",
			"openclaw/plugin-sdk/provider-stream-shared createGoogleThinkingPayloadWrapper",
			"openclaw/plugin-sdk/provider-stream-shared createGoogleThinkingStreamWrapper",
			"openclaw/plugin-sdk/provider-model-shared isProxyReasoningUnsupportedModelHint",
			"openclaw/plugin-sdk/provider-model-shared OPENAI_COMPATIBLE_REPLAY_HOOKS",
			"openclaw/plugin-sdk/provider-model-shared ANTHROPIC_BY_MODEL_REPLAY_HOOKS",
			"openclaw/plugin-sdk/provider-model-shared NATIVE_ANTHROPIC_REPLAY_HOOKS",
			"openclaw/plugin-sdk/provider-model-shared PASSTHROUGH_GEMINI_REPLAY_HOOKS",
			"openclaw/plugin-sdk/provider-auth DEFAULT_COPILOT_API_BASE_URL",
			"openclaw/plugin-sdk/provider-auth deriveCopilotApiBaseUrlFromToken",
			"openclaw/plugin-sdk/provider-auth resolveCopilotApiToken",
			"openclaw/plugin-sdk/provider-auth-copilot-cache CachedCopilotToken",
			"openclaw/plugin-sdk/oauth-utils toFormUrlEncoded",
			"openclaw/plugin-sdk/oauth-utils generatePkceVerifierChallenge",
			"openclaw/plugin-sdk/provider-oauth-runtime OAuthProvider",
			"openclaw/plugin-sdk/provider-oauth-runtime OAuthProviderInfo"
		],
		diagnostics: ["TypeScript @deprecated annotations naming provider-local replacements", "plugin boundary report compatibility inventory"],
		tests: ["src/plugins/contracts/plugin-sdk-subpaths.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Provider-specific auth, model, replay, OAuth, and stream shortcuts remain as deprecated SDK shims while providers move to their local APIs."
	},
	{
		code: "message-presentation-legacy-bridges",
		status: "deprecated",
		owner: "channel",
		introduced: MARKING_DATE,
		deprecated: MARKING_DATE,
		warningStarts: MARKING_DATE,
		removeAfter: DEFAULT_REMOVE_AFTER,
		replacement: "MessagePresentation values and channel presentation renderers",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"InteractiveReplyButton.value",
			"InteractiveReplyButton.url",
			"InteractiveReplyButton.webApp",
			"InteractiveReplyButton.web_app",
			"InteractiveReplyOption.value",
			"InteractiveReplyButton",
			"InteractiveReplyOption",
			"InteractiveReplyBlock",
			"InteractiveReply",
			"normalizeInteractiveReply",
			"hasInteractiveReplyBlocks",
			"presentationToInteractiveReply",
			"presentationToInteractiveControlsReply",
			"interactiveReplyToPresentation",
			"resolveInteractiveTextFallback",
			"src/auto-reply ReplyPayload.interactive",
			"openclaw/plugin-sdk/reply-payload ReplyPayload.interactive",
			"reduceInteractiveReply",
			"@openclaw/discord buildDiscordInteractiveComponents",
			"@openclaw/slack buildSlackInteractiveBlocks",
			"@openclaw/telegram buildTelegramInteractiveButtons"
		],
		diagnostics: ["TypeScript @deprecated annotations naming MessagePresentation replacements", "plugin boundary report compatibility inventory"],
		tests: [
			"src/interactive/payload.test.ts",
			"src/plugin-sdk/reply-payload.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Legacy interactive reply values and channel-specific rendering bridges remain available while producers migrate to MessagePresentation."
	},
	{
		code: "plugin-sdk-focused-compat-aliases",
		status: "deprecated",
		owner: "sdk",
		introduced: MARKING_DATE,
		deprecated: MARKING_DATE,
		warningStarts: MARKING_DATE,
		removeAfter: DEFAULT_REMOVE_AFTER,
		replacement: "the focused replacement named by each TypeScript @deprecated annotation",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"openclaw/plugin-sdk/acp-runtime __testing",
			"openclaw/plugin-sdk/approval-reaction-runtime",
			"openclaw/plugin-sdk/channel-inbound BuildChannelTurnContextParams",
			"openclaw/plugin-sdk/channel-inbound BuiltChannelTurnContext",
			"openclaw/plugin-sdk/channel-inbound buildChannelTurnContext",
			"openclaw/plugin-sdk/channel-inbound finalizeChannelInboundContext",
			"openclaw/plugin-sdk/channel-inbound filterChannelTurnSupplementalContext",
			"openclaw/plugin-sdk/channel-send-result ChannelSendRawResult",
			"openclaw/plugin-sdk/command-auth",
			"openclaw/plugin-sdk/command-auth ResolveSenderCommandAuthorizationParams",
			"openclaw/plugin-sdk/command-auth resolveCommandAuthorizedFromAuthorizers",
			"openclaw/plugin-sdk/command-auth CommandAuthorizationRuntime",
			"openclaw/plugin-sdk/command-auth ResolveSenderCommandAuthorizationWithRuntimeParams",
			"openclaw/plugin-sdk/command-auth resolveDirectDmAuthorizationOutcome",
			"openclaw/plugin-sdk/command-auth resolveSenderCommandAuthorizationWithRuntime",
			"openclaw/plugin-sdk/command-auth resolveSenderCommandAuthorization",
			"openclaw/plugin-sdk/keyed-async-queue KeyedAsyncQueue.getTailMapForTesting",
			"openclaw/plugin-sdk/persistent-dedupe PersistentDedupeLegacyPathOptions.lockOptions",
			"openclaw/plugin-sdk/retry-runtime createTelegramRetryRunner",
			"openclaw/plugin-sdk/ssrf-policy SsrfPolicyOptions.allowPrivateNetwork",
			"openclaw/plugin-sdk/ssrf-policy ssrfPolicyFromAllowPrivateNetwork",
			"openclaw/plugin-sdk/tts-runtime TtsSynthesisStreamResult",
			"openclaw/plugin-sdk/tts-runtime TtsRuntimeFacade._test"
		],
		diagnostics: ["TypeScript @deprecated annotations naming focused replacements", "plugin boundary report compatibility inventory"],
		tests: [
			"src/plugin-sdk/channel-inbound.test.ts",
			"src/plugin-sdk/command-auth.test.ts",
			"src/plugin-sdk/ssrf-policy.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Focused SDK compatibility aliases remain available through a dated window while callers adopt their annotated replacements."
	},
	{
		code: "agent-harness-terminal-result-aliases",
		status: "deprecated",
		owner: "agent-runtime",
		introduced: MARKING_DATE,
		deprecated: MARKING_DATE,
		warningStarts: MARKING_DATE,
		removeAfter: DEFAULT_REMOVE_AFTER,
		replacement: "AgentHarnessAttemptResult.terminal and AgentHarnessDeliveryDefaults.visibleReplies",
		docsPath: "/plugins/sdk-agent-harness",
		surfaces: [
			"AgentHarnessAttemptResult.aborted",
			"AgentHarnessAttemptResult.externalAbort",
			"AgentHarnessAttemptResult.timedOut",
			"AgentHarnessAttemptResult.idleTimedOut",
			"AgentHarnessAttemptResult.timedOutDuringCompaction",
			"AgentHarnessAttemptResult.timedOutDuringToolExecution",
			"AgentHarnessAttemptResult.timedOutByRunBudget",
			"AgentHarnessAttemptResult.promptError",
			"AgentHarnessAttemptResult.promptErrorSource",
			"AgentHarnessDeliveryDefaults.sourceVisibleReplies"
		],
		diagnostics: ["TypeScript @deprecated annotations on agent harness result and delivery defaults", "plugin boundary report compatibility inventory"],
		tests: ["src/agents/harness/settled-turn-finalization-result.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Agent harness result booleans and sourceVisibleReplies remain available while harnesses migrate to terminal outcomes and visibleReplies."
	},
	{
		code: "official-plugin-export-aliases",
		status: "deprecated",
		owner: "channel",
		introduced: MARKING_DATE,
		deprecated: MARKING_DATE,
		warningStarts: MARKING_DATE,
		removeAfter: DEFAULT_REMOVE_AFTER,
		replacement: "the canonical testing export, MessagePresentation renderers, and host-owned timeout/runtime behavior",
		docsPath: "/plugins/compatibility#current-compatibility-areas",
		surfaces: [
			"@openclaw/google-meet __testing",
			"@openclaw/discord buildDiscordInteractiveComponents",
			"@openclaw/discord normalizeDiscordListenerTimeoutMs",
			"@openclaw/discord normalizeDiscordInboundWorkerTimeoutMs",
			"@openclaw/discord isAbortError",
			"@openclaw/discord runDiscordTaskWithTimeout",
			"@openclaw/slack buildSlackInteractiveBlocks"
		],
		diagnostics: ["TypeScript @deprecated annotations on published official-plugin exports", "plugin boundary report compatibility inventory"],
		tests: ["extensions/google-meet/index.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Published Google Meet testing, channel presentation, and Discord timeout aliases remain available while consumers move to their canonical exports and host-owned behavior."
	},
	{
		code: "memory-host-compatibility-aliases",
		status: "deprecated",
		owner: "sdk",
		introduced: MARKING_DATE,
		deprecated: MARKING_DATE,
		warningStarts: MARKING_DATE,
		removeAfter: DEFAULT_REMOVE_AFTER,
		replacement: "canonical memory cache/FTS tables and getRuntimeConfig or caller-provided config",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"@openclaw/memory-host-sdk ensureMemoryIndexSchema.embeddingCacheTable",
			"@openclaw/memory-host-sdk ensureMemoryIndexSchema.ftsTable",
			"@openclaw/memory-host-sdk/runtime-core loadConfig",
			"@openclaw/memory-host-sdk/host/openclaw-runtime loadConfig"
		],
		diagnostics: ["TypeScript @deprecated annotations on memory-host SDK compatibility fields", "plugin boundary report memory-host SDK summary"],
		tests: ["packages/memory-host-sdk/src/host/memory-schema.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Memory-host cache-table overrides and runtime config reload aliases remain available while callers migrate to canonical tables and prepared config."
	},
	{
		code: "plugin-runtime-api-compat-aliases",
		status: "deprecated",
		owner: "plugin-execution",
		introduced: MARKING_DATE,
		deprecated: MARKING_DATE,
		warningStarts: MARKING_DATE,
		removeAfter: DEFAULT_REMOVE_AFTER,
		replacement: "the namespaced plugin API and focused runtime methods named per surface",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"OpenClawPluginApi.registerSessionExtension",
			"OpenClawPluginApi.enqueueNextTurnInjection",
			"OpenClawPluginApi.registerControlUiDescriptor",
			"OpenClawPluginApi.registerRuntimeLifecycle",
			"OpenClawPluginApi.registerAgentEventSubscription",
			"OpenClawPluginApi.emitAgentEvent",
			"OpenClawPluginApi.setRunContext",
			"OpenClawPluginApi.getRunContext",
			"OpenClawPluginApi.clearRunContext",
			"OpenClawPluginApi.registerSessionSchedulerJob",
			"OpenClawPluginApi.registerSessionAction",
			"OpenClawPluginApi.sendSessionAttachment",
			"OpenClawPluginApi.scheduleSessionTurn",
			"OpenClawPluginApi.unscheduleSessionTurnsByTag",
			"PluginHookContext.senderExternalId",
			"PluginAttachmentChannelHints.telegram",
			"PluginAttachmentChannelHints.slack",
			"AgentPromptSurfaceKind pi_main",
			"PluginRuntime.channel.reply.createReplyDispatcherWithTyping",
			"PluginRuntime.channel.reply.resolveHumanDelayConfig",
			"PluginRuntime.channel.reply.dispatchReplyFromConfig",
			"PluginRuntime.channel.reply.finalizeInboundContext",
			"PluginRuntime.channel.media.fetchRemoteMedia",
			"PluginRuntime.channel.session.resolveStorePath",
			"PluginRuntime.channel.session.recordInboundSession",
			"PluginRuntime.channel.inbound.runPreparedReply",
			"PluginRuntime.channel.turn",
			"PluginRuntime.system.requestHeartbeatNow"
		],
		diagnostics: ["TypeScript @deprecated annotations on plugin API and runtime aliases", "plugin boundary report compatibility inventory"],
		tests: [
			"src/plugins/captured-registration.test.ts",
			"src/plugins/runtime/index.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Flat plugin registration and broad runtime aliases remain available while plugins migrate to namespaced APIs and focused runtime methods."
	},
	{
		code: "plugin-provider-manifest-compat-aliases",
		status: "deprecated",
		owner: "provider",
		introduced: MARKING_DATE,
		deprecated: MARKING_DATE,
		warningStarts: MARKING_DATE,
		removeAfter: DEFAULT_REMOVE_AFTER,
		replacement: "manifest-owned plugin kind/setup metadata and model catalog registration",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"DefinePluginEntryOptions.kind",
			"SingleProviderPluginOptions.kind",
			"OpenClawPluginDefinition.kind",
			"PluginPackageChannel.cliAddOptions",
			"ProviderPlugin.catalog",
			"ProviderPlugin.staticCatalog",
			"ProviderPlugin.suppressBuiltInModel",
			"ProviderPlugin.augmentModelCatalog",
			"ProviderBuiltInModelSuppressionContext"
		],
		diagnostics: ["TypeScript @deprecated annotations on plugin manifest and provider catalog aliases", "plugin boundary report compatibility inventory"],
		tests: [
			"src/plugins/contracts/package-manifest.contract.test.ts",
			"src/plugins/contracts/provider-catalog-deprecation.contract.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Runtime plugin kind/setup metadata and provider catalog hooks remain available while plugins migrate ownership into manifests and catalog registrations."
	}
];
//#endregion
//#region src/plugins/compat/plugin-sdk-subpath-records.ts
const PLUGIN_SDK_SUBPATH_SEEDS = [
	{
		code: "plugin-sdk-channel-streaming-subpath",
		subpath: "channel-streaming",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-outbound`",
		releaseNote: "The deprecated `channel-streaming` Plugin SDK subpath was removed; plugins now import channel streaming helpers from `channel-outbound`."
	},
	{
		code: "plugin-sdk-config-runtime-subpath",
		subpath: "config-runtime",
		status: "removal-pending",
		owner: "config",
		removeAfter: "2026-10-01",
		replacement: "`api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`; retain until supported external plugin migration is verified"
	},
	{
		code: "plugin-sdk-inbound-reply-dispatch-subpath",
		subpath: "inbound-reply-dispatch",
		owner: "channel",
		removalGate: "next-plugin-sdk-major",
		replacement: "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`"
	},
	{
		code: "plugin-sdk-channel-reply-pipeline-subpath",
		subpath: "channel-reply-pipeline",
		status: "removal-pending",
		owner: "channel",
		removeAfter: "2026-10-01",
		replacement: "`openclaw/plugin-sdk/channel-outbound`; retain until supported external plugin migration is verified"
	},
	{
		code: "plugin-sdk-infra-runtime-subpath",
		subpath: "infra-runtime",
		status: "removal-pending",
		owner: "sdk",
		removeAfter: "2026-10-01",
		replacement: "focused subpaths including `openclaw/plugin-sdk/delivery-queue-runtime`, `openclaw/plugin-sdk/diagnostic-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/exec-approvals-runtime`, `openclaw/plugin-sdk/fetch-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`; retain until supported external plugin migration is verified and system-event snapshot inspection and consumption have a modern public replacement"
	},
	{
		code: "plugin-sdk-text-runtime-subpath",
		subpath: "text-runtime",
		status: "removed",
		owner: "sdk",
		replacement: "`openclaw/plugin-sdk/logging-core`, `openclaw/plugin-sdk/text-chunking`, `openclaw/plugin-sdk/text-utility-runtime`, and `openclaw/plugin-sdk/string-coerce-runtime`",
		releaseNote: "The deprecated `text-runtime` Plugin SDK facade was removed; plugins now import logging, chunking, text utility, and string coercion helpers from their focused subpaths."
	},
	{
		code: "plugin-sdk-channel-secret-runtime-subpath",
		subpath: "channel-secret-runtime",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-secret-basic-runtime` and `openclaw/plugin-sdk/channel-secret-tts-runtime`",
		releaseNote: "The deprecated `channel-secret-runtime` Plugin SDK subpath was removed; plugins now use the focused basic and TTS secret-runtime subpaths."
	},
	{
		code: "plugin-sdk-agent-config-primitives-subpath",
		subpath: "agent-config-primitives",
		status: "removed",
		owner: "config",
		replacement: "`openclaw/plugin-sdk/channel-config-schema`",
		releaseNote: "The deprecated `agent-config-primitives` Plugin SDK subpath was removed; plugins now use maintained config-schema primitives."
	},
	{
		code: "plugin-sdk-matrix-subpath",
		subpath: "matrix",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/run-command`",
		releaseNote: "The deprecated `matrix` Plugin SDK facade was removed; command execution now uses the generic `run-command` subpath."
	},
	{
		code: "plugin-sdk-channel-logging-subpath",
		subpath: "channel-logging",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`",
		releaseNote: "The deprecated `channel-logging` Plugin SDK subpath was removed; channel logging helpers now come from the inbound and outbound channel surfaces."
	},
	{
		code: "plugin-sdk-channel-lifecycle-subpath",
		subpath: "channel-lifecycle",
		status: "removal-pending",
		owner: "channel",
		removeAfter: "2026-10-01",
		replacement: "`openclaw/plugin-sdk/channel-outbound`; retain until supported external plugin migration is verified"
	},
	{
		code: "plugin-sdk-channel-message-subpath",
		subpath: "channel-message",
		status: "removal-pending",
		owner: "channel",
		removeAfter: "2026-10-01",
		replacement: "`openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`; retain until supported external plugin migration is verified"
	},
	{
		code: "plugin-sdk-group-access-subpath",
		subpath: "group-access",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-ingress-runtime`",
		releaseNote: "The deprecated `group-access` Plugin SDK subpath was removed; plugins now resolve message admission through `channel-ingress-runtime`."
	},
	{
		code: "plugin-sdk-zod-subpath",
		subpath: "zod",
		status: "removed",
		owner: "sdk",
		replacement: "the direct `zod` package import",
		releaseNote: "The deprecated `zod` Plugin SDK re-export was removed; plugins now import `zod` directly."
	}
];
function buildPluginSdkSubpathRecord(seed) {
	if ("status" in seed && seed.status === "removed") return {
		code: seed.code,
		status: seed.status,
		owner: seed.owner,
		introduced: "2026-07-06",
		replacement: seed.replacement,
		docsPath: "/plugins/sdk-migration",
		surfaces: [`openclaw/plugin-sdk/${seed.subpath}`],
		diagnostics: ["plugin SDK compatibility registry and migration guide"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: seed.releaseNote
	};
	return {
		code: seed.code,
		status: "status" in seed ? seed.status : "deprecated",
		owner: seed.owner,
		introduced: "2026-07-06",
		deprecated: "2026-07-06",
		warningStarts: "2026-07-06",
		removeAfter: "removeAfter" in seed ? seed.removeAfter : void 0,
		removalGate: "removalGate" in seed ? seed.removalGate : void 0,
		replacement: seed.replacement,
		docsPath: "/plugins/sdk-migration",
		surfaces: [`openclaw/plugin-sdk/${seed.subpath}`],
		diagnostics: ["repository deprecated API usage guard for core and bundled plugins; no external runtime import warning"],
		tests: ["src/plugins/compat/registry.test.ts"]
	};
}
const PLUGIN_SDK_SUBPATH_RECORDS = PLUGIN_SDK_SUBPATH_SEEDS.map(buildPluginSdkSubpathRecord);
const BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_SEEDS = [
	{
		subpath: "media-understanding",
		status: "removal-pending",
		removeAfter: "2026-09-30",
		replacement: "`api.registerMediaUnderstandingProvider(...)` with provider-owned request helpers and types from `openclaw/plugin-sdk/plugin-entry`; retain the public subpath through the 2026-09-30 window while official plugin consumers migrate",
		docsPath: "/plugins/architecture"
	},
	{
		subpath: "memory-host-core",
		status: "removal-pending",
		removeAfter: "2026-09-30",
		replacement: "host-prepared memory prompts via `openclaw/plugin-sdk/core` and memory capability registration through the injected plugin API; retain the facade through the 2026-09-30 window and until a focused public-artifact read seam exists",
		docsPath: "/plugins/architecture-internals#context-engine-plugins"
	},
	{
		subpath: "plugin-config-runtime",
		status: "removal-pending",
		removeAfter: "2026-12-01",
		replacement: "`api.pluginConfig`, runtime tool context config, and focused `config-contracts`, `runtime-config-snapshot`, or `config-mutation` subpaths; retain the public subpath through the 2026-12-01 window while official plugin consumers migrate",
		docsPath: "/plugins/sdk-runtime"
	},
	{
		subpath: "tool-plugin",
		status: "deprecated",
		replacement: "retain the public subpath until plugin authoring has a nonexecuting static metadata replacement for `defineToolPlugin`; `getToolPluginMetadata` currently reads metadata only from an already-executed entry",
		docsPath: "/plugins/tool-plugins"
	}
];
function buildPublicSdkSubpathRecord({ subpath, ...compat }) {
	return {
		code: `plugin-sdk-${subpath}-public-demotion`,
		owner: "sdk",
		introduced: "2026-07-15",
		deprecated: "2026-07-15",
		warningStarts: "2026-07-15",
		...compat,
		surfaces: [`openclaw/plugin-sdk/${subpath}`],
		diagnostics: ["registry-backed public SDK demotion window; no external runtime import warning"],
		tests: ["src/plugins/compat/registry.test.ts"]
	};
}
const BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_RECORDS = BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_SEEDS.map(buildPublicSdkSubpathRecord);
[
	...PLUGIN_SDK_SUBPATH_RECORDS,
	...BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_RECORDS,
	...DEPRECATION_MARKING_COMPAT_RECORDS
];
//#endregion
//#region src/plugins/plugin-policy-id.ts
/**
* Canonicalizes a plugin id for comparison against `plugins.allow`, `plugins.deny`, and
* `plugins.entries`, which are lowercase-normalized when config is normalized. A manifest declares
* its id in whatever case its author chose, so policy must compare this derived key rather than the
* declared id. The declared id itself stays untouched: the loader matches it against the plugin's
* runtime export id, and rewriting it would break plugins whose export matches a mixed-case manifest.
*/
function normalizePluginPolicyId(id) {
	return normalizeOptionalLowercaseString(id) ?? "";
}
//#endregion
//#region src/plugins/config-activation-shared.ts
const PLUGIN_ACTIVATION_REASON_BY_CAUSE = {
	"enabled-in-config": "enabled in config",
	"bundled-channel-enabled-in-config": "channel enabled in config",
	"selected-memory-slot": "selected memory slot",
	"selected-context-engine-slot": "selected context engine slot",
	"selected-in-allowlist": "selected in allowlist",
	"plugins-disabled": "plugins disabled",
	"blocked-by-denylist": "blocked by denylist",
	"disabled-in-config": "disabled in config",
	"channel-disabled-in-config": "channel disabled in config",
	"workspace-disabled-by-default": "workspace plugin (disabled by default)",
	"not-in-allowlist": "not in allowlist",
	"enabled-by-effective-config": "enabled by effective config",
	"bundled-channel-configured": "channel configured",
	"bundled-default-enablement": "bundled default enablement",
	"bundled-disabled-by-default": "bundled (disabled by default)"
};
function resolvePluginActivationReason(cause, reason) {
	if (reason) return reason;
	return cause ? PLUGIN_ACTIVATION_REASON_BY_CAUSE[cause] : void 0;
}
function toPluginActivationState(decision) {
	return {
		enabled: decision.enabled,
		activated: decision.activated,
		explicitlyEnabled: decision.explicitlyEnabled,
		source: decision.source,
		reason: resolvePluginActivationReason(decision.cause, decision.reason)
	};
}
function resolveExplicitPluginSelectionShared(params) {
	const policyId = normalizePluginPolicyId(params.id);
	if (params.config.entries[policyId]?.enabled === true) return {
		explicitlyEnabled: true,
		cause: "enabled-in-config"
	};
	if (params.origin === "bundled" && params.resolveChannelConfigEnablement(params.rootConfig, params.id, params.channelIds) === true) return {
		explicitlyEnabled: true,
		cause: "bundled-channel-enabled-in-config"
	};
	if (params.config.slots.memory === params.id) return {
		explicitlyEnabled: true,
		cause: "selected-memory-slot"
	};
	if (params.config.slots.contextEngine === params.id) return {
		explicitlyEnabled: true,
		cause: "selected-context-engine-slot"
	};
	if (params.origin !== "bundled" && params.config.allow.includes(policyId)) return {
		explicitlyEnabled: true,
		cause: "selected-in-allowlist"
	};
	return { explicitlyEnabled: false };
}
function resolvePluginActivationDecisionShared(params) {
	const activationSource = params.activationSource ?? {
		plugins: params.config,
		rootConfig: params.rootConfig
	};
	const explicitSelection = resolveExplicitPluginSelectionShared({
		id: params.id,
		origin: params.origin,
		config: activationSource.plugins,
		rootConfig: activationSource.rootConfig,
		channelIds: params.channelIds,
		resolveChannelConfigEnablement: params.resolveChannelConfigEnablement
	});
	const decision = (source, details = {}) => ({
		enabled: source !== "disabled",
		activated: source !== "disabled",
		explicitlyEnabled: explicitSelection.explicitlyEnabled,
		source,
		...details
	});
	if (!params.config.enabled) return decision("disabled", { cause: "plugins-disabled" });
	const policyId = normalizePluginPolicyId(params.id);
	if (params.config.deny.includes(policyId)) return decision("disabled", { cause: "blocked-by-denylist" });
	const entry = params.config.entries[policyId];
	if (entry?.enabled === false) return decision("disabled", { cause: "disabled-in-config" });
	if (params.resolveChannelConfigEnablement(activationSource.rootConfig ?? params.rootConfig, params.id, params.channelIds) === false) return decision("disabled", { cause: "channel-disabled-in-config" });
	const explicitlyAllowed = params.config.allow.includes(policyId);
	if (params.origin === "workspace" && !explicitlyAllowed && entry?.enabled !== true && explicitSelection.cause !== "selected-context-engine-slot") return decision("disabled", { cause: "workspace-disabled-by-default" });
	if (params.config.slots.memory === params.id) return decision("explicit", {
		explicitlyEnabled: true,
		cause: "selected-memory-slot"
	});
	if (params.config.slots.contextEngine === params.id) return decision("explicit", {
		explicitlyEnabled: true,
		cause: "selected-context-engine-slot"
	});
	if (params.allowBundledChannelExplicitBypassesAllowlist === true && explicitSelection.cause === "bundled-channel-enabled-in-config") return decision("explicit", {
		explicitlyEnabled: true,
		cause: explicitSelection.cause
	});
	if (params.config.allow.length > 0 && !explicitlyAllowed) return decision("disabled", { cause: "not-in-allowlist" });
	if (explicitSelection.explicitlyEnabled) return decision("explicit", {
		explicitlyEnabled: true,
		cause: explicitSelection.cause
	});
	if (params.autoEnabledReason) return decision("auto", {
		explicitlyEnabled: false,
		reason: params.autoEnabledReason
	});
	if (entry?.enabled === true) return decision("auto", {
		explicitlyEnabled: false,
		cause: "enabled-by-effective-config"
	});
	if (params.origin === "bundled" && params.resolveChannelConfigEnablement(params.rootConfig, params.id, params.channelIds) === true) return decision("auto", {
		explicitlyEnabled: false,
		cause: "bundled-channel-configured"
	});
	if (params.origin === "bundled" && params.enabledByDefault === true) return decision("default", {
		explicitlyEnabled: false,
		cause: "bundled-default-enablement"
	});
	if (params.origin === "bundled") return decision("disabled", {
		explicitlyEnabled: false,
		cause: "bundled-disabled-by-default"
	});
	return decision("default");
}
//#endregion
//#region src/plugins/path-safety.ts
/** Plugin-local re-export of shared path safety helpers for plugin install/runtime code. */
/** Resolves matching physical spellings when Windows presents one tree through different aliases. */
function resolvePhysicalPathInsideRootSync(rootPath, targetPath) {
	if (process.platform !== "win32") return;
	try {
		const root = fsSync.statSync(rootPath, { bigint: true });
		if (!root.isDirectory() || root.ino === 0n) return;
		let current = path.resolve(targetPath);
		while (true) {
			const candidate = fsSync.statSync(current, { bigint: true });
			if (candidate.dev === root.dev && candidate.ino === root.ino) {
				const physicalRoot = fsSync.lstatSync(current).isSymbolicLink() ? path.resolve(rootPath) : current;
				return {
					rootPath: physicalRoot,
					targetPath: path.resolve(physicalRoot, path.relative(current, targetPath)),
					rootIdentity: Object.freeze({
						dev: root.dev,
						ino: root.ino
					})
				};
			}
			const parent = path.dirname(current);
			if (parent === current) return;
			current = parent;
		}
	} catch {
		return;
	}
}
function isPathInside(rootPath, targetPath) {
	return isPathInside$2(rootPath, targetPath) || resolvePhysicalPathInsideRootSync(rootPath, targetPath) !== void 0;
}
function createIdentityBoundRootFileFs(rootPath, expected) {
	const lstatSync = ((...args) => {
		const stat = Reflect.apply(fsSync.lstatSync, fsSync, args);
		if (args[0] === rootPath) {
			const dev = typeof stat.dev === "bigint" ? stat.dev : BigInt(stat.dev);
			const ino = typeof stat.ino === "bigint" ? stat.ino : BigInt(stat.ino);
			if (!stat.isDirectory() || dev !== expected.dev || ino !== expected.ino) throw new FsSafeError("path-mismatch", "plugin root identity changed during alias reconciliation");
		}
		return stat;
	});
	return {
		closeSync: fsSync.closeSync,
		constants: fsSync.constants,
		fstatSync: fsSync.fstatSync,
		lstatSync,
		openSync: fsSync.openSync,
		readFileSync: fsSync.readFileSync,
		realpathSync: fsSync.realpathSync
	};
}
/** Opens a plugin artifact after reconciling Windows root aliases. */
function openPluginRootFileSync(params) {
	const admittedRoot = params.rootRealPath ?? params.rootPath;
	const physical = isPathInside$2(admittedRoot, params.filePath) ? void 0 : resolvePhysicalPathInsideRootSync(admittedRoot, params.filePath);
	return openRootFileSync({
		absolutePath: physical?.targetPath ?? params.filePath,
		rootPath: physical?.rootPath ?? params.rootPath,
		rootRealPath: physical?.rootPath ?? params.rootRealPath,
		boundaryLabel: params.boundaryLabel ?? "plugin root",
		rejectHardlinks: params.rejectHardlinks,
		maxBytes: params.maxBytes,
		skipLexicalRootCheck: physical ? true : void 0,
		ioFs: physical ? createIdentityBoundRootFileFs(physical.rootPath, physical.rootIdentity) : void 0
	});
}
//#endregion
//#region src/plugins/plugin-cache-files.ts
const DEFAULT_PLUGIN_METADATA_MAX_BYTES = 16777216;
function entryKey(relativePath, rejectHardlinks) {
	return JSON.stringify([path.normalize(relativePath), rejectHardlinks]);
}
function enforceFileSize(entry, maxBytes) {
	if (entry.ok && maxBytes !== void 0 && Math.max(entry.signature.size, entry.contents.length) > maxBytes) return {
		ok: false,
		failure: {
			ok: false,
			reason: "validation",
			error: new FsSafeError("too-large", `File exceeds ${maxBytes} bytes: ${entry.path}`)
		}
	};
	return entry;
}
function pathFacts(targetPath) {
	const absolute = path.resolve(targetPath);
	const root = getPluginCacheRoot(path.dirname(absolute));
	const key = path.basename(absolute);
	let facts = root.paths.get(key);
	if (!facts) {
		facts = {};
		root.paths.set(key, facts);
	}
	return facts;
}
function pluginCacheExistsSync(targetPath) {
	const facts = pathFacts(targetPath);
	return facts.exists ??= fsSync.existsSync(targetPath);
}
function resolveRealpath(targetPath) {
	if (path.resolve(targetPath) === targetPath && pluginCacheRealpathSync(targetPath, true) === targetPath) return targetPath;
	return fsSync.realpathSync(targetPath);
}
function pluginCacheRealpathSync(targetPath, native = false) {
	const facts = pathFacts(targetPath);
	const key = native ? "nativeRealpath" : "realpath";
	if (facts[key] === void 0) try {
		facts[key] = native ? fsSync.realpathSync.native(targetPath) : resolveRealpath(targetPath);
		pathFacts(facts[key])[key] = facts[key];
	} catch {
		facts[key] = null;
	}
	return facts[key];
}
/** A trusted owner that changes permissions replaces its own observed stat. */
function refreshPluginCacheStat(targetPath) {
	pathFacts(targetPath).stat = void 0;
	return pluginCacheStatSync(targetPath);
}
function pluginCacheStatSync(targetPath, throwOnError = false) {
	const facts = pathFacts(targetPath);
	if (facts.stat === void 0) {
		facts.statError = void 0;
		try {
			facts.stat = fsSync.statSync(targetPath);
			facts.exists = true;
		} catch (error) {
			materializePluginCacheError(error);
			facts.statError = error;
			facts.stat = null;
		}
	}
	if (facts.stat === null && throwOnError) throw facts.statError;
	return facts.stat;
}
/** Final symlink checks must retain lstat facts separately from followed target stats. */
function pluginCacheLstatSync(targetPath) {
	const facts = pathFacts(targetPath);
	if (facts.lstat === void 0) try {
		facts.lstat = fsSync.lstatSync(targetPath);
	} catch {
		facts.lstat = null;
	}
	return facts.lstat;
}
function readPluginCacheDirectory(targetPath) {
	const root = getPluginCacheRoot(targetPath);
	if (!root.directory) try {
		root.directory = {
			ok: true,
			entries: fsSync.readdirSync(targetPath, { withFileTypes: true })
		};
	} catch (error) {
		materializePluginCacheError(error);
		root.directory = {
			ok: false,
			error
		};
	}
	if (!root.directory.ok) throw root.directory.error;
	return root.directory.entries;
}
/** Discovery validation is immutable metadata; actual imports validate their own file identity. */
function checkPluginCacheEntry(params) {
	let root = getPluginCacheRoot(params.rootDir);
	const key = entryKey(params.relativePath, params.rejectHardlinks);
	const cached = root.checkedEntries.get(key);
	if (cached) return cached;
	const absolutePath = path.resolve(params.rootDir, params.relativePath);
	let checked;
	if (!pluginCacheExistsSync(absolutePath)) try {
		const resolved = resolveRootPathSync({
			absolutePath,
			rootPath: params.rootDir,
			rootCanonicalPath: params.rootRealPath,
			boundaryLabel: "plugin package directory"
		});
		root = bindPluginCacheRoot(params.rootDir, resolved.rootCanonicalPath);
		checked = {
			ok: true,
			path: resolved.canonicalPath,
			rootRealPath: resolved.rootCanonicalPath,
			exists: false
		};
	} catch (error) {
		checked = {
			ok: false,
			reason: "validation",
			error
		};
	}
	else {
		const opened = openPluginRootFileSync({
			filePath: absolutePath,
			rootPath: params.rootDir,
			rootRealPath: params.rootRealPath,
			boundaryLabel: "plugin package directory",
			rejectHardlinks: params.rejectHardlinks
		});
		if (!opened.ok) checked = opened;
		else {
			fsSync.closeSync(opened.fd);
			root = bindPluginCacheRoot(params.rootDir, opened.rootRealPath);
			Object.assign(pathFacts(opened.path), {
				exists: true,
				stat: opened.stat
			});
			checked = {
				ok: true,
				path: opened.path,
				rootRealPath: opened.rootRealPath,
				exists: true
			};
		}
	}
	if (!checked.ok) materializePluginCacheError(checked.error);
	root.checkedEntries.set(key, checked);
	return checked;
}
/** Reads metadata once under its original boundary policy, including absence and invalid files. */
function readPluginCacheFile(params) {
	const lexicalRoot = path.resolve(params.rootDir);
	let root = getPluginCacheRoot(lexicalRoot);
	const maxBytes = params.maxBytes === null ? void 0 : params.maxBytes ?? DEFAULT_PLUGIN_METADATA_MAX_BYTES;
	const key = entryKey(params.relativePath, params.rejectHardlinks);
	const limitKey = JSON.stringify([key, maxBytes]);
	const strict = params.rejectHardlinks ? void 0 : root.files.get(entryKey(params.relativePath, true));
	const cached = root.files.get(key) ?? root.files.get(limitKey) ?? (strict?.ok ? strict : void 0);
	if (cached) return enforceFileSize(cached, maxBytes);
	const requestedPath = path.resolve(lexicalRoot, params.relativePath);
	const checked = root.checkedEntries.get(key);
	if (pathFacts(requestedPath).exists === false || checked && (!checked.ok || !checked.exists)) {
		const entry = {
			ok: false,
			failure: checked && !checked.ok ? checked : {
				ok: false,
				reason: "path"
			}
		};
		root.files.set(key, entry);
		return entry;
	}
	const canonicalRoot = params.rootRealPath ?? pluginCacheRealpathSync(lexicalRoot) ?? lexicalRoot;
	const canonicalCached = getPluginCacheRoot(canonicalRoot).files.get(key);
	if (canonicalCached?.ok) {
		bindPluginCacheRoot(lexicalRoot, canonicalRoot);
		return enforceFileSize(canonicalCached, maxBytes);
	}
	const absolutePath = path.resolve(canonicalRoot, params.relativePath);
	const opened = openPluginRootFileSync({
		filePath: absolutePath,
		rootRealPath: canonicalRoot,
		rootPath: canonicalRoot,
		boundaryLabel: "plugin root",
		rejectHardlinks: params.rejectHardlinks,
		maxBytes
	});
	let entry;
	if (!opened.ok) {
		entry = {
			ok: false,
			failure: opened
		};
		if (opened.reason === "path" && opened.error && typeof opened.error === "object" && "code" in opened.error && opened.error.code === "ENOENT") {
			pathFacts(requestedPath).exists = false;
			pathFacts(absolutePath).exists = false;
		}
	} else {
		root = bindPluginCacheRoot(lexicalRoot, opened.rootRealPath);
		try {
			const contents = maxBytes === void 0 ? fsSync.readFileSync(opened.fd) : readFileDescriptorBoundedSync$1(opened.fd, maxBytes);
			entry = {
				ok: true,
				path: opened.path,
				rootRealPath: opened.rootRealPath,
				contents,
				hash: crypto.createHash("sha256").update(contents).digest("hex"),
				signature: {
					size: opened.stat.size,
					mtimeMs: opened.stat.mtimeMs,
					ctimeMs: opened.stat.ctimeMs
				}
			};
			Object.assign(pathFacts(absolutePath), {
				exists: true,
				stat: opened.stat
			});
			root.checkedEntries.set(key, {
				ok: true,
				path: opened.path,
				rootRealPath: opened.rootRealPath,
				exists: true
			});
		} catch (error) {
			entry = {
				ok: false,
				failure: {
					ok: false,
					reason: "io",
					error
				},
				failurePhase: "read"
			};
		} finally {
			fsSync.closeSync(opened.fd);
		}
	}
	if (!entry.ok) materializePluginCacheError(entry.failure.error);
	root.files.set(entry.ok ? key : limitKey, entry);
	return entry;
}
/** Catalog files retain the regular-file policy, which rejects final symlinks but allows hardlinks. */
function readPluginCacheRegularFile(params) {
	const absolutePath = path.resolve(params.filePath);
	const lexicalRoot = path.dirname(absolutePath);
	const canonicalRoot = pluginCacheRealpathSync(lexicalRoot) ?? lexicalRoot;
	const root = bindPluginCacheRoot(lexicalRoot, canonicalRoot);
	const filename = path.basename(absolutePath);
	const key = JSON.stringify(["regular", filename]);
	const limitKey = JSON.stringify([
		"regular",
		filename,
		params.maxBytes
	]);
	let entry = root.files.get(key) ?? root.files.get(limitKey);
	if (!entry && pathFacts(absolutePath).exists === false) {
		entry = {
			ok: false,
			failure: {
				ok: false,
				reason: "path"
			}
		};
		root.files.set(key, entry);
	}
	if (!entry) try {
		const { buffer: contents, stat } = readRegularFileSync({
			filePath: absolutePath,
			maxBytes: params.maxBytes
		});
		entry = {
			ok: true,
			path: path.join(canonicalRoot, filename),
			rootRealPath: canonicalRoot,
			contents,
			hash: crypto.createHash("sha256").update(contents).digest("hex"),
			signature: {
				size: stat.size,
				mtimeMs: stat.mtimeMs,
				ctimeMs: stat.ctimeMs
			}
		};
		Object.assign(pathFacts(absolutePath), {
			exists: true,
			stat
		});
		root.files.set(key, entry);
	} catch (error) {
		materializePluginCacheError(error);
		entry = {
			ok: false,
			failure: {
				ok: false,
				reason: "io",
				error
			}
		};
		root.files.set(error instanceof FsSafeError && error.code === "too-large" ? limitKey : key, entry);
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") pathFacts(absolutePath).exists = false;
	}
	if (entry.ok && params.maxBytes !== void 0 && Math.max(entry.signature.size, entry.contents.length) > params.maxBytes) return {
		ok: false,
		failure: {
			ok: false,
			reason: "io",
			error: new FsSafeError("too-large", `File exceeds ${params.maxBytes} bytes: ${absolutePath}`)
		}
	};
	return entry;
}
function readPluginCacheJsonFile(filePath, options = {}) {
	const file = readPluginCacheRegularFile({
		filePath,
		...options
	});
	return file.ok ? parsePluginCacheJson(file) : {
		ok: false,
		error: file.failure.error
	};
}
function parsePluginCacheJson(file, options = {}) {
	const key = options.json5 ? "json5" : "json";
	if (!file[key]) try {
		const source = file.contents.toString("utf8");
		file[key] = {
			ok: true,
			value: options.json5 ? parseJsonWithJson5Fallback(source) : JSON.parse(source)
		};
	} catch (error) {
		materializePluginCacheError(error);
		file[key] = {
			ok: false,
			error
		};
	}
	return file[key];
}
//#endregion
//#region src/plugins/package-entrypoints.ts
/** True when a package entrypoint needs built JavaScript candidates. */
function isTypeScriptPackageEntry(entryPath) {
	return [
		".ts",
		".tsx",
		".mts",
		".cts"
	].includes(path.extname(entryPath).toLowerCase());
}
/** Lists built runtime entry candidates for a TypeScript package entrypoint. */
function listBuiltRuntimeEntryCandidates(entryPath) {
	if (!isTypeScriptPackageEntry(entryPath)) return [];
	const normalized = entryPath.replace(/\\/g, "/");
	const withoutExtension = normalized.replace(/\.[^.]+$/u, "");
	const normalizedRelative = withoutExtension.replace(/^\.\//u, "");
	const distWithoutExtension = normalizedRelative.startsWith("src/") ? `./dist/${normalizedRelative.slice(4)}` : `./dist/${normalizedRelative}`;
	const sourceExtension = path.extname(normalized).toLowerCase();
	const outputExtensions = sourceExtension === ".mts" ? [
		".mjs",
		".js",
		".cjs"
	] : sourceExtension === ".cts" ? [
		".cjs",
		".js",
		".mjs"
	] : [
		".js",
		".mjs",
		".cjs"
	];
	return [
		distWithoutExtension,
		...normalizedRelative.startsWith("src/") ? [`./dist/${normalizedRelative}`] : [],
		withoutExtension
	].flatMap((basePath) => outputExtensions.map((extension) => `${basePath}${extension}`));
}
//#endregion
//#region src/plugins/package-manifest.ts
const DEFAULT_PLUGIN_ENTRY_CANDIDATES = [
	"index.ts",
	"index.js",
	"index.mjs",
	"index.cjs"
];
function getPackageManifestMetadata(manifest) {
	if (!manifest) return;
	return manifest[MANIFEST_KEY];
}
function resolvePackageExtensionEntries(manifest) {
	const rawOpenClaw = manifest?.[MANIFEST_KEY];
	if (rawOpenClaw === void 0 || rawOpenClaw === null) return {
		status: "missing",
		entries: []
	};
	if (!isRecord(rawOpenClaw)) return {
		status: "invalid",
		entries: [],
		error: "package.json openclaw must be an object"
	};
	const raw = rawOpenClaw.extensions;
	if (raw === void 0 || raw === null) return {
		status: "missing",
		entries: []
	};
	if (!Array.isArray(raw)) return {
		status: "invalid",
		entries: [],
		error: "package.json openclaw.extensions must be an array"
	};
	const entries = [];
	for (const [index, entry] of raw.entries()) {
		const normalized = normalizeOptionalString(entry);
		if (!normalized) return {
			status: "invalid",
			entries: [],
			error: `package.json openclaw.extensions[${index}] must be a non-empty string`
		};
		entries.push(normalized);
	}
	if (entries.length === 0) return {
		status: "empty",
		entries: []
	};
	return {
		status: "ok",
		entries
	};
}
//#endregion
//#region src/plugins/plugin-runtime-artifact-selection.ts
/** Built hosts default only checkout plugins to compiled execution, not installed packages. */
function resolvePluginRuntimeArtifactPreference(preferBuiltPluginArtifacts) {
	if (preferBuiltPluginArtifacts !== void 0) return preferBuiltPluginArtifacts ? "all" : "source";
	return /\.[cm]?js$/.test(new URL(import.meta.url).pathname) ? "bundled" : "source";
}
//#endregion
//#region src/plugins/bundled-dir.ts
/** Resolves the bundled plugin directory for source checkouts, dist builds, and tests. */
const DISABLED_BUNDLED_PLUGINS_DIR = path.join(os.tmpdir(), "openclaw-empty-bundled-plugins");
const TEST_TRUST_BUNDLED_PLUGINS_DIR_ENV = "OPENCLAW_TEST_TRUST_BUNDLED_PLUGINS_DIR";
/** Returns true when env disables bundled plugin discovery. */
function areBundledPluginsDisabled(env = process.env) {
	const raw = normalizeOptionalLowercaseString(env.OPENCLAW_DISABLE_BUNDLED_PLUGINS);
	return raw === "1" || raw === "true";
}
function resolveDisabledBundledPluginsDir() {
	if (!pluginCacheExistsSync(DISABLED_BUNDLED_PLUGINS_DIR)) {
		fsSync.mkdirSync(DISABLED_BUNDLED_PLUGINS_DIR, { recursive: true });
		refreshPluginCacheStat(DISABLED_BUNDLED_PLUGINS_DIR);
	}
	return DISABLED_BUNDLED_PLUGINS_DIR;
}
function isSourceCheckoutRoot(packageRoot) {
	return pluginCacheExistsSync(path.join(packageRoot, "pnpm-workspace.yaml")) && pluginCacheExistsSync(path.join(packageRoot, "src")) && pluginCacheExistsSync(path.join(packageRoot, "extensions"));
}
function shouldTrustTestBundledPluginsDirOverride(env) {
	const separateEnv = env !== process.env;
	if (!isTruthyEnvValue(env[TEST_TRUST_BUNDLED_PLUGINS_DIR_ENV]) && !(separateEnv && isTruthyEnvValue(process.env[TEST_TRUST_BUNDLED_PLUGINS_DIR_ENV]))) return false;
	return isVitestRuntimeEnv(env) || separateEnv && isVitestRuntimeEnv(process.env);
}
function hasUsableBundledPluginTree(pluginsDir) {
	if (!pluginCacheExistsSync(pluginsDir)) return false;
	try {
		return readPluginCacheDirectory(pluginsDir).some((entry) => {
			if (!entry.isDirectory()) return false;
			const pluginDir = path.join(pluginsDir, entry.name);
			return pluginCacheExistsSync(path.join(pluginDir, "package.json")) || pluginCacheExistsSync(path.join(pluginDir, "openclaw.plugin.json"));
		});
	} catch {
		return false;
	}
}
function safeRealpathSync(targetPath) {
	return pluginCacheRealpathSync(targetPath, true);
}
function trustedBundledPluginRootsForPackageRoot(packageRoot) {
	const roots = [path.join(packageRoot, "dist", "extensions"), path.join(packageRoot, "dist-runtime", "extensions")];
	if (isSourceCheckoutRoot(packageRoot)) roots.push(path.join(packageRoot, "extensions"));
	return roots;
}
function resolvePackageRootsForBundledPlugins() {
	const argvRoot = resolveOpenClawPackageRootSync({ argv1: process.argv[1] });
	const moduleRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	return uniqueStrings([argvRoot, moduleRoot].filter((entry) => Boolean(entry)));
}
function resolveSourceCheckoutDependencyDiagnostic(env = process.env) {
	if (areBundledPluginsDisabled(env)) return null;
	for (const packageRoot of resolvePackageRootsForBundledPlugins()) {
		if (!isSourceCheckoutRoot(packageRoot)) continue;
		const extensionsDir = path.join(packageRoot, "extensions");
		if (!isPluginInPackageBundledRoots({
			rootDir: extensionsDir,
			packageRoot
		}) || !hasUsableBundledPluginTree(extensionsDir)) continue;
		if (pluginCacheExistsSync(path.join(packageRoot, "node_modules", ".pnpm"))) continue;
		return {
			source: packageRoot,
			message: "OpenClaw source checkout detected without pnpm workspace dependencies; run `pnpm install` from the repo root so bundled plugins can load package-local dependencies."
		};
	}
	return null;
}
function resolveTrustedExistingOverride(resolvedOverride) {
	const realOverride = safeRealpathSync(resolvedOverride);
	if (!realOverride) return null;
	const modulePackageRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	if (!modulePackageRoot || !isPluginInPackageBundledRoots({
		rootDir: realOverride,
		packageRoot: modulePackageRoot
	})) return null;
	if (!hasUsableBundledPluginTree(realOverride)) return null;
	return realOverride;
}
/** Checks physical containment in a package's source or compiled plugin trees. */
function isPluginInPackageBundledRoots(params) {
	const realPluginRoot = safeRealpathSync(params.rootDir);
	const realPackageRoot = safeRealpathSync(params.packageRoot);
	if (!realPluginRoot || !realPackageRoot) return false;
	return trustedBundledPluginRootsForPackageRoot(params.packageRoot).map((trustedRoot) => safeRealpathSync(trustedRoot)).some((trustedRoot) => trustedRoot !== null && isPathInside$1(realPackageRoot, trustedRoot) && isPathInside$1(trustedRoot, realPluginRoot));
}
/** Recognizes compiled bundle ownership only; this never confers plugin trust. */
function isForeignBundledPluginRoot(rootDir, env = process.env) {
	const realRootDir = safeRealpathSync(rootDir);
	if (!realRootDir) return false;
	const extensionsDir = path.dirname(realRootDir);
	const compiledDir = path.dirname(extensionsDir);
	if (path.basename(extensionsDir) !== "extensions" || !["dist", "dist-runtime"].includes(path.basename(compiledDir))) return false;
	const packageRoot = path.dirname(compiledDir);
	if (resolveOpenClawPackageRootSync({ cwd: packageRoot }) !== packageRoot || !isPluginInPackageBundledRoots({
		rootDir: realRootDir,
		packageRoot
	})) return false;
	const activeBundledDir = resolveBundledPluginsDir(env);
	const realActiveDir = activeBundledDir ? safeRealpathSync(activeBundledDir) : null;
	if (realActiveDir && isPathInside$1(realActiveDir, realRootDir)) return false;
	const runningRoots = resolvePackageRootsForBundledPlugins();
	return runningRoots.length > 0 && !runningRoots.some((runningRoot) => isPluginInPackageBundledRoots({
		rootDir: realRootDir,
		packageRoot: runningRoot
	}));
}
function resolveBundledDirFromPackageRoot(packageRoot, preference = "bundled") {
	const builtExtensionsDir = path.join(packageRoot, "dist", "extensions");
	const runtimeExtensionsDir = path.join(packageRoot, "dist-runtime", "extensions");
	if (isSourceCheckoutRoot(packageRoot)) {
		const sourceExtensionsDir = path.join(packageRoot, "extensions");
		return (preference === "source" ? [sourceExtensionsDir] : [
			builtExtensionsDir,
			runtimeExtensionsDir,
			sourceExtensionsDir
		]).find((rootDir) => isPluginInPackageBundledRoots({
			rootDir,
			packageRoot
		}) && hasUsableBundledPluginTree(rootDir));
	}
	return pluginCacheExistsSync(builtExtensionsDir) ? [runtimeExtensionsDir, builtExtensionsDir].find((rootDir) => isPluginInPackageBundledRoots({
		rootDir,
		packageRoot
	})) : void 0;
}
function resolveBundledPluginsDirUncached(env) {
	if (areBundledPluginsDisabled(env)) return resolveDisabledBundledPluginsDir();
	const override = env.OPENCLAW_BUNDLED_PLUGINS_DIR?.trim();
	let rejectedExistingOverride = null;
	if (override) {
		const resolvedOverride = resolveUserPath(override, env);
		if (pluginCacheExistsSync(resolvedOverride)) {
			if (shouldTrustTestBundledPluginsDirOverride(env)) return path.resolve(resolvedOverride);
			const trustedOverride = resolveTrustedExistingOverride(resolvedOverride);
			if (trustedOverride) return trustedOverride;
			rejectedExistingOverride = resolvedOverride;
		}
	}
	try {
		const argvRoot = resolveOpenClawPackageRootSync({ argv1: process.argv[1] });
		const safeArgvRoot = Boolean(argvRoot && rejectedExistingOverride && isPluginInPackageBundledRoots({
			rootDir: rejectedExistingOverride,
			packageRoot: argvRoot
		})) ? null : argvRoot;
		const moduleRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
		const packageRoots = uniqueStrings([safeArgvRoot, moduleRoot].filter((entry) => Boolean(entry)));
		for (const packageRoot of packageRoots) {
			const bundledDir = resolveBundledDirFromPackageRoot(packageRoot, resolvePluginRuntimeArtifactPreference());
			if (bundledDir) return bundledDir;
		}
	} catch {}
	try {
		const execDir = path.dirname(process.execPath);
		const siblingBuilt = path.join(execDir, "dist", "extensions");
		if (pluginCacheExistsSync(siblingBuilt)) return siblingBuilt;
		const sibling = path.join(execDir, "extensions");
		if (pluginCacheExistsSync(sibling)) return sibling;
	} catch {}
	try {
		let cursor = path.dirname(fileURLToPath(import.meta.url));
		for (let i = 0; i < 6; i += 1) {
			const candidate = path.join(cursor, "extensions");
			if (pluginCacheExistsSync(candidate)) return candidate;
			const parent = path.dirname(cursor);
			if (parent === cursor) break;
			cursor = parent;
		}
	} catch {}
}
function resolveBundledPluginsDir(env = process.env) {
	const disabled = areBundledPluginsDisabled(env);
	const override = disabled ? void 0 : env.OPENCLAW_BUNDLED_PLUGINS_DIR?.trim();
	const resolvedOverride = override ? resolveUserPath(override, env) : void 0;
	const trustOverride = shouldTrustTestBundledPluginsDirOverride(env);
	const argv1 = process.argv[1];
	const execPath = process.execPath;
	const cwd = tryProcessCwd();
	const metadata = getPluginCache().metadata;
	const cached = metadata.bundledPluginsDir;
	if (cached && cached.moduleUrl === import.meta.url && cached.disabled === disabled && cached.resolvedOverride === resolvedOverride && cached.trustOverride === trustOverride && cached.argv1 === argv1 && cached.execPath === execPath && cached.cwd === cwd) return cached.value;
	const value = resolveBundledPluginsDirUncached(env);
	metadata.bundledPluginsDir = {
		moduleUrl: import.meta.url,
		disabled,
		resolvedOverride,
		trustOverride,
		argv1,
		execPath,
		cwd,
		value
	};
	return value;
}
//#endregion
//#region src/channels/bundled-channel-catalog-read.ts
/**
* Bundled channel catalog reader.
*
* Loads channel metadata from generated package catalogs and bundled plugin package manifests.
*/
const OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH = path.join("dist", "channel-catalog.json");
function listPackageRoots() {
	return uniqueStrings([resolveOpenClawPackageRootSync({ cwd: process.cwd() }), resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url })].filter((entry) => Boolean(entry)));
}
function readBundledExtensionCatalogEntriesSync(pluginsDir) {
	if (!pluginsDir) return [];
	try {
		return readPluginCacheDirectory(pluginsDir).filter((entry) => entry.isDirectory()).flatMap((entry) => {
			const parsed = readPluginCacheJsonFile(path.join(pluginsDir, entry.name, "package.json"));
			return parsed.ok && isRecord(parsed.value) ? [parsed.value] : [];
		});
	} catch {
		return [];
	}
}
function readOfficialCatalogFileSync() {
	const bundledExternalEntries = BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES.filter((entry) => typeof entry === "object" && entry !== null);
	for (const packageRoot of listPackageRoots()) {
		const payload = readPluginCacheJsonFile(path.join(packageRoot, OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH));
		if (payload.ok && isRecord(payload.value)) {
			const entries = Array.isArray(payload.value.entries) ? payload.value.entries.filter((entry) => isRecord(entry)) : [];
			return [...bundledExternalEntries, ...entries];
		}
	}
	return bundledExternalEntries;
}
function isChannelCatalogEntryLike(entry) {
	return "openclaw" in entry;
}
function toBundledChannelEntry(entry) {
	const channel = isChannelCatalogEntryLike(entry) ? entry.openclaw?.channel : entry;
	const id = normalizeOptionalLowercaseString(channel?.id);
	if (!id || !channel) return null;
	return {
		id,
		channel,
		aliases: Array.isArray(channel.aliases) ? channel.aliases.map((alias) => normalizeOptionalLowercaseString(alias)).filter((alias) => Boolean(alias)) : [],
		order: typeof channel.order === "number" && Number.isFinite(channel.order) ? channel.order : Number.MAX_SAFE_INTEGER
	};
}
/**
* Lists bundled channel catalog entries from package manifests and generated catalog files.
*/
function listBundledChannelCatalogEntries() {
	const pluginsDir = resolveBundledPluginsDir();
	const catalogs = getPluginCache().metadata.bundledChannelCatalogs;
	const key = JSON.stringify([process.cwd(), pluginsDir]);
	const cached = catalogs.get(key);
	if (cached) return cached;
	const entries = /* @__PURE__ */ new Map();
	for (const entry of readBundledExtensionCatalogEntriesSync(pluginsDir)) {
		const channelEntry = toBundledChannelEntry(entry);
		if (channelEntry) entries.set(channelEntry.id, channelEntry);
	}
	for (const entry of readOfficialCatalogFileSync()) {
		const channelEntry = toBundledChannelEntry(entry);
		if (channelEntry) entries.set(channelEntry.id, entries.get(channelEntry.id) ?? channelEntry);
	}
	const catalog = Array.from(entries.values()).toSorted((left, right) => left.order - right.order || left.id.localeCompare(right.id));
	catalogs.set(key, catalog);
	return catalog;
}
//#endregion
//#region src/channels/bundled-channel-ids.generated.ts
const GENERATED_BUNDLED_CHANNEL_IDS = [
	{
		channelId: "a2a",
		order: 75,
		label: "A2A"
	},
	{
		channelId: "buzz",
		order: 56,
		label: "Buzz"
	},
	{
		channelId: "clickclack",
		order: 85,
		label: "ClickClack"
	},
	{
		channelId: "discord",
		label: "Discord"
	},
	{
		channelId: "feishu",
		aliases: ["lark"],
		order: 35,
		label: "Feishu"
	},
	{
		channelId: "googlechat",
		aliases: ["gchat", "google-chat"],
		order: 55,
		label: "Google Chat"
	},
	{
		channelId: "imessage",
		aliases: ["imsg"],
		label: "iMessage"
	},
	{
		channelId: "irc",
		aliases: ["internet-relay-chat"],
		label: "IRC"
	},
	{
		channelId: "line",
		order: 75,
		label: "LINE"
	},
	{
		channelId: "matrix",
		order: 70,
		label: "Matrix"
	},
	{
		channelId: "mattermost",
		order: 65,
		label: "Mattermost"
	},
	{
		channelId: "msteams",
		aliases: ["teams"],
		order: 60,
		label: "Microsoft Teams"
	},
	{
		channelId: "nextcloud-talk",
		aliases: ["nc", "nc-talk"],
		order: 65,
		label: "Nextcloud Talk"
	},
	{
		channelId: "nostr",
		order: 55,
		label: "Nostr"
	},
	{
		channelId: "qa-channel",
		order: 999,
		configurable: false,
		label: "QA Channel"
	},
	{
		channelId: "raft",
		order: 72,
		label: "Raft"
	},
	{
		channelId: "reef",
		label: "Reef"
	},
	{
		channelId: "signal",
		label: "Signal"
	},
	{
		channelId: "slack",
		label: "Slack"
	},
	{
		channelId: "sms",
		order: 88,
		label: "SMS"
	},
	{
		channelId: "synology-chat",
		order: 90,
		label: "Synology Chat"
	},
	{
		channelId: "telegram",
		label: "Telegram"
	},
	{
		channelId: "tlon",
		order: 90,
		label: "Tlon"
	},
	{
		channelId: "twitch",
		aliases: ["twitch-chat"],
		label: "Twitch"
	},
	{
		channelId: "whatsapp",
		label: "WhatsApp"
	},
	{
		channelId: "zalo",
		aliases: ["zl"],
		order: 80,
		label: "Zalo"
	},
	{
		channelId: "zalouser",
		aliases: ["zlu"],
		order: 85,
		label: "Zalo Personal"
	}
];
//#endregion
//#region src/channels/ids.ts
/**
* Built-in chat channel ids and aliases.
*
* Derives canonical ids from generated bundled channel metadata with runtime catalog fallback.
*/
function listBundledChatChannelEntries() {
	return GENERATED_BUNDLED_CHANNEL_IDS.filter((entry) => entry.configurable !== false).map((entry) => ({
		id: normalizeOptionalLowercaseString(entry.channelId) ?? entry.channelId,
		aliases: entry.aliases ?? [],
		label: entry.label?.trim() || void 0,
		order: entry.order ?? Number.MAX_SAFE_INTEGER
	})).toSorted((left, right) => left.order - right.order || left.id.localeCompare(right.id, "en", { sensitivity: "base" }));
}
const BUNDLED_CHAT_CHANNEL_ENTRIES = Object.freeze(listBundledChatChannelEntries());
const CHAT_CHANNEL_ID_SET = new Set(BUNDLED_CHAT_CHANNEL_ENTRIES.map((entry) => entry.id));
Object.freeze(BUNDLED_CHAT_CHANNEL_ENTRIES.map((entry) => entry.id));
/**
* Maps configured built-in channel aliases to canonical chat channel ids.
*/
const CHAT_CHANNEL_ALIASES = Object.freeze(Object.fromEntries(BUNDLED_CHAT_CHANNEL_ENTRIES.flatMap((entry) => entry.aliases.map((alias) => [alias, entry.id]))));
function normalizeRuntimeBundledChatChannelId(normalized) {
	for (const entry of listBundledChannelCatalogEntries()) if (entry.id === normalized || entry.aliases.includes(normalized)) return entry.id;
	return null;
}
/**
* Normalizes a raw chat channel id or alias to a known canonical built-in channel id.
*/
function normalizeChatChannelId(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return null;
	const resolved = CHAT_CHANNEL_ALIASES[normalized] ?? normalized;
	return CHAT_CHANNEL_ID_SET.has(resolved) ? resolved : normalizeRuntimeBundledChatChannelId(normalized);
}
//#endregion
//#region src/plugins/slots.ts
/** Applies mutually exclusive plugin slot selection for memory and context-engine plugins. */
const DEFAULT_SLOT_BY_KEY = {
	memory: "memory-core",
	contextEngine: "legacy"
};
Object.keys(DEFAULT_SLOT_BY_KEY);
/** Returns the implicit plugin id that owns a slot before config overrides it. */
function defaultSlotIdForKey(slotKey) {
	return DEFAULT_SLOT_BY_KEY[slotKey];
}
/** Raw `plugins.slots[key]`: `none` turns the slot off, blank leaves it unset. */
function normalizeSlotValue(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	if (normalizeOptionalLowercaseString(trimmed) === "none") return null;
	return trimmed;
}
function resolveSlotSelection(slotKey, value) {
	const normalized = normalizeSlotValue(value);
	if (normalized === void 0) return {
		kind: "default",
		pluginId: defaultSlotIdForKey(slotKey)
	};
	return normalized === null ? { kind: "off" } : {
		kind: "pinned",
		pluginId: normalized
	};
}
//#endregion
//#region src/plugins/config-normalization-shared.ts
/** Default plugin id normalizer for already-canonical ids. */
const identityNormalizePluginId = (id) => id.trim();
function normalizePluginConfigList(value, normalizePluginId) {
	if (!Array.isArray(value)) return [];
	return value.map((entry) => typeof entry === "string" ? normalizePluginId(entry) : "").filter(Boolean);
}
function normalizeHookTimeoutMs(value) {
	return asSafeIntegerInRange(value, {
		min: 1,
		max: 6e5
	});
}
function normalizeHookTimeouts(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [hookName, timeoutMs] of Object.entries(value)) {
		const normalizedTimeoutMs = normalizeHookTimeoutMs(timeoutMs);
		if (normalizedTimeoutMs !== void 0) normalized[hookName] = normalizedTimeoutMs;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizePluginEntries(entries, normalizePluginId) {
	if (!isRecord(entries)) return {};
	const normalized = {};
	for (const [key, value] of Object.entries(entries)) {
		const normalizedKey = normalizePluginId(key);
		if (!normalizedKey) continue;
		if (!isRecord(value)) {
			normalized[normalizedKey] = {};
			continue;
		}
		const entry = value;
		const hooksRaw = entry.hooks;
		const hooks = isRecord(hooksRaw) ? {
			allowPromptInjection: hooksRaw.allowPromptInjection,
			allowConversationAccess: hooksRaw.allowConversationAccess,
			timeoutMs: normalizeHookTimeoutMs(hooksRaw.timeoutMs),
			timeouts: normalizeHookTimeouts(hooksRaw.timeouts)
		} : void 0;
		const normalizedHooks = hooks && (typeof hooks.allowPromptInjection === "boolean" || typeof hooks.allowConversationAccess === "boolean" || hooks.timeoutMs !== void 0 || hooks.timeouts !== void 0) ? {
			...typeof hooks.allowPromptInjection === "boolean" ? { allowPromptInjection: hooks.allowPromptInjection } : {},
			...typeof hooks.allowConversationAccess === "boolean" ? { allowConversationAccess: hooks.allowConversationAccess } : {},
			...hooks.timeoutMs !== void 0 ? { timeoutMs: hooks.timeoutMs } : {},
			...hooks.timeouts !== void 0 ? { timeouts: hooks.timeouts } : {}
		} : void 0;
		const subagentRaw = entry.subagent;
		const subagent = isRecord(subagentRaw) ? {
			allowModelOverride: subagentRaw.allowModelOverride,
			hasAllowedModelsConfig: Array.isArray(subagentRaw.allowedModels),
			allowedModels: Array.isArray(subagentRaw.allowedModels) ? normalizeArrayBackedTrimmedStringList(subagentRaw.allowedModels) : void 0
		} : void 0;
		const normalizedSubagent = subagent && (typeof subagent.allowModelOverride === "boolean" || subagent.hasAllowedModelsConfig || Array.isArray(subagent.allowedModels) && subagent.allowedModels.length > 0) ? {
			...typeof subagent.allowModelOverride === "boolean" ? { allowModelOverride: subagent.allowModelOverride } : {},
			...subagent.hasAllowedModelsConfig ? { hasAllowedModelsConfig: true } : {},
			...Array.isArray(subagent.allowedModels) && subagent.allowedModels.length > 0 ? { allowedModels: subagent.allowedModels } : {}
		} : void 0;
		const llmRaw = entry.llm;
		const llm = isRecord(llmRaw) ? {
			allowModelOverride: llmRaw.allowModelOverride,
			hasAllowedModelsConfig: Array.isArray(llmRaw.allowedModels),
			allowedModels: Array.isArray(llmRaw.allowedModels) ? normalizeArrayBackedTrimmedStringList(llmRaw.allowedModels) : void 0,
			hasAllowedCompletionModelsConfig: Array.isArray(llmRaw.allowedCompletionModels),
			allowedCompletionModels: Array.isArray(llmRaw.allowedCompletionModels) ? normalizeArrayBackedTrimmedStringList(llmRaw.allowedCompletionModels) : void 0,
			allowAuthProfileOverride: llmRaw.allowAuthProfileOverride,
			allowAgentIdOverride: llmRaw.allowAgentIdOverride
		} : void 0;
		const normalizedLlm = llm && (typeof llm.allowModelOverride === "boolean" || llm.hasAllowedModelsConfig || Array.isArray(llm.allowedModels) && llm.allowedModels.length > 0 || llm.hasAllowedCompletionModelsConfig || Array.isArray(llm.allowedCompletionModels) && llm.allowedCompletionModels.length > 0 || typeof llm.allowAuthProfileOverride === "boolean" || typeof llm.allowAgentIdOverride === "boolean") ? {
			...typeof llm.allowModelOverride === "boolean" ? { allowModelOverride: llm.allowModelOverride } : {},
			...llm.hasAllowedModelsConfig ? { hasAllowedModelsConfig: true } : {},
			...Array.isArray(llm.allowedModels) && llm.allowedModels.length > 0 ? { allowedModels: llm.allowedModels } : {},
			...llm.hasAllowedCompletionModelsConfig ? { hasAllowedCompletionModelsConfig: true } : {},
			...Array.isArray(llm.allowedCompletionModels) && llm.allowedCompletionModels.length > 0 ? { allowedCompletionModels: llm.allowedCompletionModels } : {},
			...typeof llm.allowAuthProfileOverride === "boolean" ? { allowAuthProfileOverride: llm.allowAuthProfileOverride } : {},
			...typeof llm.allowAgentIdOverride === "boolean" ? { allowAgentIdOverride: llm.allowAgentIdOverride } : {}
		} : void 0;
		normalized[normalizedKey] = {
			...normalized[normalizedKey],
			enabled: typeof entry.enabled === "boolean" ? entry.enabled : normalized[normalizedKey]?.enabled,
			hooks: normalizedHooks ?? normalized[normalizedKey]?.hooks,
			subagent: normalizedSubagent ?? normalized[normalizedKey]?.subagent,
			llm: normalizedLlm ?? normalized[normalizedKey]?.llm,
			config: "config" in entry ? entry.config : normalized[normalizedKey]?.config
		};
	}
	return normalized;
}
/** Normalizes plugin config while allowing callers to resolve aliases first. */
function normalizePluginsConfigWithResolverCore(config, normalizePluginId = identityNormalizePluginId) {
	const memorySlot = resolveSlotSelection("memory", config?.slots?.memory);
	return {
		enabled: config?.enabled !== false,
		allow: normalizePluginConfigList(config?.allow, normalizePluginId),
		deny: normalizePluginConfigList(config?.deny, normalizePluginId),
		loadPaths: normalizePluginConfigList(config?.load?.paths, identityNormalizePluginId),
		slots: {
			memory: memorySlot.kind === "off" ? null : memorySlot.pluginId,
			contextEngine: normalizeSlotValue(config?.slots?.contextEngine)
		},
		entries: normalizePluginEntries(config?.entries, normalizePluginId)
	};
}
/**
* Enables an owner for any enabled channel; disables it only when all channels are off.
* Unspecified channels leave the plugin's own activation policy in control.
*/
function resolveChannelConfigEnablement(cfg, pluginId, channelIds = []) {
	const channels = cfg?.channels;
	if (!channels) return;
	const enablement = (channelIds.length ? channelIds.map((channelId) => normalizeChatChannelId(channelId) ?? channelId) : [normalizeChatChannelId(pluginId)]).map((channelId) => {
		const entry = channelId ? channels[channelId] : void 0;
		return isRecord(entry) ? entry.enabled : void 0;
	});
	if (enablement.includes(true)) return true;
	return enablement.every((enabled) => enabled === false) ? false : void 0;
}
//#endregion
//#region src/plugins/config-state.ts
/** Normalizes plugin config and resolves effective enablement, slots, and activation sources. */
const BUILT_IN_PLUGIN_ALIAS_FALLBACKS = [
	["google-gemini-cli", "google"],
	["minimax-portal", "minimax"],
	["minimax-portal-auth", "minimax"]
];
const BUILT_IN_PLUGIN_ALIAS_LOOKUP = new Map([...BUILT_IN_PLUGIN_ALIAS_FALLBACKS, ...BUILT_IN_PLUGIN_ALIAS_FALLBACKS.map(([, pluginId]) => [pluginId, pluginId])]);
/** Normalizes user/config plugin ids into the canonical lowercase key form. */
function normalizePluginId(id) {
	const normalized = normalizeOptionalLowercaseString(id) ?? "";
	return BUILT_IN_PLUGIN_ALIAS_LOOKUP.get(normalized) ?? normalized;
}
const normalizePluginsConfig = (config) => {
	return normalizePluginsConfigWithResolverCore(config, normalizePluginId);
};
function createPluginActivationSource(params) {
	return {
		plugins: params.plugins ?? normalizePluginsConfig(params.config?.plugins),
		rootConfig: params.config
	};
}
function resolveEffectivePluginActivationState(params) {
	return toPluginActivationState(resolvePluginActivationDecisionShared({
		...params,
		activationSource: params.activationSource ?? createPluginActivationSource({
			config: params.rootConfig,
			plugins: params.config
		}),
		allowBundledChannelExplicitBypassesAllowlist: true,
		resolveChannelConfigEnablement
	}));
}
//#endregion
//#region src/plugins/installed-plugin-index-hash.ts
function hashString(value) {
	return crypto.createHash("sha256").update(value).digest("hex");
}
/** Hashes JSON-serializable data with SHA-256. */
function hashJson(value) {
	return hashString(JSON.stringify(value));
}
/** Hashes JSON-like data independently of object property insertion order. */
function hashStableJson(value) {
	return hashString(stableStringify(value));
}
//#endregion
//#region src/plugins/installed-plugin-index-policy.ts
/** Hashes config policy inputs that can change installed plugin activation. */
function resolveInstalledPluginIndexPolicyHash(config, env, behavior = {}) {
	const normalized = normalizePluginsConfig(config?.plugins);
	const channelPolicy = {};
	const channels = config?.channels;
	if (channels && typeof channels === "object" && !Array.isArray(channels)) {
		for (const [channelId, value] of Object.entries(channels)) if (value && typeof value === "object" && !Array.isArray(value)) {
			const enabled = value.enabled;
			if (typeof enabled === "boolean") channelPolicy[channelId] = enabled;
		}
	}
	return hashJson({
		plugins: {
			enabled: normalized.enabled,
			allow: normalized.allow,
			deny: normalized.deny,
			bundledDiscovery: readBundledDiscoveryModeMemoized(env, behavior) ?? null,
			slots: normalized.slots,
			entries: Object.fromEntries(Object.entries(normalized.entries).flatMap(([pluginId, entry]) => typeof entry.enabled === "boolean" ? [[pluginId, entry.enabled]] : []).toSorted(([left], [right]) => left.localeCompare(right)))
		},
		channels: Object.fromEntries(Object.entries(channelPolicy).toSorted(([left], [right]) => left.localeCompare(right)))
	});
}
//#endregion
//#region src/plugins/bundled-load-path-aliases.ts
const PACKAGED_BUNDLED_ROOTS = [path.join("dist", "extensions"), path.join("dist-runtime", "extensions")];
/** Normalizes bundled lookup paths without preserving trailing separators. */
function normalizeBundledLookupPath(targetPath) {
	const normalized = path.normalize(targetPath);
	const root = path.parse(normalized).root;
	let trimmed = normalized;
	while (trimmed.length > root.length && (trimmed.endsWith(path.sep) || trimmed.endsWith("/"))) trimmed = trimmed.slice(0, -1);
	return trimmed;
}
function findPackagedBundledRoot(localPath) {
	const normalized = normalizeBundledLookupPath(localPath);
	for (const packagedRoot of PACKAGED_BUNDLED_ROOTS) {
		const marker = `${path.sep}${packagedRoot}`;
		const markerIndex = normalized.lastIndexOf(marker);
		if (markerIndex === -1) continue;
		const markerEnd = markerIndex + marker.length;
		if (normalized.length !== markerEnd && normalized[markerEnd] !== path.sep) continue;
		return {
			packageRoot: normalized.slice(0, markerIndex),
			bundledRoot: normalized.slice(0, markerEnd)
		};
	}
	return null;
}
/** Builds the legacy extensions root for a packaged bundled plugin root. */
function buildLegacyBundledRootPath(localPath) {
	const packaged = findPackagedBundledRoot(localPath);
	return packaged ? path.join(packaged.packageRoot, "extensions") : null;
}
//#endregion
//#region src/plugins/bundled-source-overlays.ts
/** Parses Linux mountinfo content into absolute mount points. */
function parseLinuxMountInfoMountPoints(mountInfo) {
	const mountPoints = /* @__PURE__ */ new Set();
	for (const line of mountInfo.split(/\r?\n/u)) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const mountPoint = trimmed.split(" ")[4];
		if (!mountPoint) continue;
		mountPoints.add(path.resolve(decodeMountInfoPath(mountPoint)));
	}
	return mountPoints;
}
function readLinuxMountPoints() {
	const metadata = getPluginCache().metadata;
	if (!metadata.discoveryMountPoints) try {
		metadata.discoveryMountPoints = parseLinuxMountInfoMountPoints(fsSync.readFileSync("/proc/self/mountinfo", "utf8"));
	} catch {
		metadata.discoveryMountPoints = /* @__PURE__ */ new Set();
	}
	return metadata.discoveryMountPoints;
}
function isFilesystemMountPoint(targetPath) {
	const target = pluginCacheStatSync(targetPath);
	const parent = pluginCacheStatSync(path.dirname(targetPath));
	return Boolean(target && parent && (target.dev !== parent.dev || target.ino === parent.ino));
}
function sourceOverlaysDisabled(env) {
	const raw = normalizeOptionalLowercaseString(env.OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS);
	return raw === "1" || raw === "true";
}
/** True when a path appears to be a mounted bundled source overlay. */
function isBundledSourceOverlayPath(params) {
	const resolved = path.resolve(params.sourcePath);
	return (params.mountPoints ?? readLinuxMountPoints()).has(resolved) || isFilesystemMountPoint(resolved);
}
/** Lists source overlay directories that shadow packaged bundled plugin dirs. */
function listBundledSourceOverlayDirs(params) {
	if (sourceOverlaysDisabled(params.env ?? process.env) || !params.bundledRoot) return [];
	const legacyRoot = buildLegacyBundledRootPath(params.bundledRoot);
	if (!legacyRoot || !pluginCacheExistsSync(legacyRoot)) return [];
	let entries;
	try {
		entries = readPluginCacheDirectory(legacyRoot);
	} catch {
		return [];
	}
	const mountPoints = params.mountPoints ?? readLinuxMountPoints();
	const legacyRootMounted = isBundledSourceOverlayPath({
		sourcePath: legacyRoot,
		mountPoints
	});
	const overlayDirs = [];
	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		const sourceDir = path.join(legacyRoot, entry.name);
		if (!pluginCacheExistsSync(path.join(params.bundledRoot, entry.name))) continue;
		if (!legacyRootMounted && !isBundledSourceOverlayPath({
			sourcePath: sourceDir,
			mountPoints
		})) continue;
		overlayDirs.push(sourceDir);
	}
	return overlayDirs.toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/plugins/candidate-install-owner.ts
const PLUGIN_CANDIDATE_INSTALL_OWNER = Symbol.for("openclaw.pluginCandidateInstallOwner");
function recordPluginCandidateInstallOwner(candidate, installOwner, ambiguous = false) {
	if (!installOwner && !ambiguous) return candidate;
	Object.defineProperty(candidate, PLUGIN_CANDIDATE_INSTALL_OWNER, {
		configurable: true,
		enumerable: true,
		value: ambiguous ? { ambiguous: true } : { installOwner }
	});
	return candidate;
}
function readPluginCandidateInstallOwner(candidate) {
	return candidate[PLUGIN_CANDIDATE_INSTALL_OWNER];
}
function resolvePluginCandidateInstallOwner(candidate) {
	return readPluginCandidateInstallOwner(candidate)?.installOwner;
}
function isPluginCandidateInstallOwnerAmbiguous(candidate) {
	return readPluginCandidateInstallOwner(candidate)?.ambiguous === true;
}
//#endregion
//#region packages/llm-core/src/model-data.ts
const MODEL_DATA_APIS = [
	"openai-completions",
	"openai-responses",
	"openai-chatgpt-responses",
	"anthropic-messages",
	"google-generative-ai",
	"google-vertex",
	"github-copilot",
	"bedrock-converse-stream",
	"ollama",
	"pi-messages",
	"azure-openai-responses"
];
const MODEL_DATA_THINKING_FORMATS = [
	"openai",
	"openrouter",
	"deepseek",
	"together",
	"qwen",
	"qwen-chat-template",
	"zai"
];
const MODEL_DATA_THINKING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
//#endregion
//#region packages/model-catalog-core/src/model-catalog-types.ts
/** Supported API protocols for model catalog entries. */
const MODEL_CATALOG_APIS = [...MODEL_DATA_APIS];
/** Supported model thinking/reasoning wire formats. */
const MODEL_CATALOG_THINKING_FORMATS = [...MODEL_DATA_THINKING_FORMATS];
/** Narrow a string to a supported model catalog thinking format. */
function isModelCatalogThinkingFormat(value) {
	return MODEL_CATALOG_THINKING_FORMATS.includes(value);
}
/** Model-level thinking settings carried by provider catalog metadata. */
const MODEL_CATALOG_THINKING_LEVELS = [...MODEL_DATA_THINKING_LEVELS];
//#endregion
//#region packages/model-catalog-core/src/model-catalog-context-windows.ts
function normalizePositiveInteger$1(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function normalizeModelCatalogContextWindows(value) {
	if (!Array.isArray(value)) return;
	const seen = /* @__PURE__ */ new Set();
	const contextWindows = value.slice(0, 16).flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const id = normalizeOptionalString(entry.id) ?? "";
		const label = normalizeOptionalString(entry.label) ?? "";
		const contextWindow = normalizePositiveInteger$1(entry.contextWindow);
		if (!id || !label || contextWindow === void 0 || seen.has(id)) return [];
		seen.add(id);
		return [{
			id,
			label,
			contextWindow
		}];
	});
	return contextWindows.length > 0 ? contextWindows.toSorted((left, right) => left.contextWindow - right.contextWindow || left.id.localeCompare(right.id)) : void 0;
}
function normalizeModelCatalogContextWindowDefault(value, contextWindows) {
	const contextWindowDefault = normalizeOptionalString(value);
	return contextWindowDefault && contextWindows?.some((option) => option.id === contextWindowDefault) ? contextWindowDefault : void 0;
}
function normalizeModelCatalogContextWindowSelection(value) {
	const contextWindows = normalizeModelCatalogContextWindows(value.contextWindows);
	const contextWindowDefault = normalizeModelCatalogContextWindowDefault(value.contextWindowDefault, contextWindows);
	return contextWindows && contextWindowDefault ? {
		contextWindows,
		contextWindowDefault
	} : {};
}
//#endregion
//#region packages/model-catalog-core/src/model-catalog-normalize.ts
const MODEL_CATALOG_INPUTS = /* @__PURE__ */ new Set([
	"text",
	"image",
	"document"
]);
const MODEL_CATALOG_DISCOVERY_MODES = /* @__PURE__ */ new Set([
	"static",
	"refreshable",
	"runtime"
]);
const MODEL_CATALOG_STATUSES = /* @__PURE__ */ new Set([
	"available",
	"preview",
	"deprecated",
	"disabled"
]);
const MODEL_CATALOG_API_SET = new Set(MODEL_CATALOG_APIS);
/** Reject object keys that can mutate prototypes when copied into records. */
function isBlockedObjectKey(key) {
	return key === "__proto__" || key === "prototype" || key === "constructor";
}
function normalizeModelCatalogThinkingLevelMap(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const level of MODEL_CATALOG_THINKING_LEVELS) {
		const mapped = value[level];
		if (mapped === null) {
			normalized[level] = null;
			continue;
		}
		const normalizedValue = normalizeOptionalString(mapped);
		if (normalizedValue !== void 0) normalized[level] = normalizedValue;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeSafeRecordKey(value) {
	const key = normalizeOptionalString(value) ?? "";
	return key && !isBlockedObjectKey(key) ? key : "";
}
function normalizeOwnedProviderSet(providers) {
	const normalized = /* @__PURE__ */ new Set();
	for (const provider of providers) {
		const providerId = normalizeProviderId(provider);
		if (providerId) normalized.add(providerId);
	}
	return normalized;
}
function normalizeStringMap(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [rawKey, rawValue] of Object.entries(value)) {
		const key = normalizeSafeRecordKey(rawKey);
		const mapValue = normalizeOptionalString(rawValue) ?? "";
		if (key && mapValue) normalized[key] = mapValue;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeModelCatalogApi(value) {
	const api = normalizeOptionalString(value) ?? "";
	return MODEL_CATALOG_API_SET.has(api) ? api : void 0;
}
function normalizeModelCatalogInputs(value) {
	const inputs = normalizeTrimmedStringList(value).filter((input) => MODEL_CATALOG_INPUTS.has(input));
	return inputs.length > 0 ? inputs : void 0;
}
function normalizePositiveInteger(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function normalizeModelCatalogTieredCost(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry) || !Array.isArray(entry.range)) continue;
		const input = asNonNegativeFiniteNumber(entry.input);
		const output = asNonNegativeFiniteNumber(entry.output);
		const cacheRead = asNonNegativeFiniteNumber(entry.cacheRead);
		const cacheWrite = asNonNegativeFiniteNumber(entry.cacheWrite);
		if (input === void 0 || output === void 0 || cacheRead === void 0 || cacheWrite === void 0 || entry.range.length < 1 || entry.range.length > 2) continue;
		const rangeValues = entry.range.map((rangeValue) => asNonNegativeFiniteNumber(rangeValue));
		if (rangeValues.some((rangeValue) => rangeValue === void 0)) continue;
		normalized.push({
			input,
			output,
			cacheRead,
			cacheWrite,
			range: rangeValues.length === 1 ? [rangeValues[0]] : [rangeValues[0], rangeValues[1]]
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeModelCatalogCost(value) {
	if (!isRecord(value)) return;
	const input = asNonNegativeFiniteNumber(value.input);
	const output = asNonNegativeFiniteNumber(value.output);
	const cacheRead = asNonNegativeFiniteNumber(value.cacheRead);
	const cacheWrite = asNonNegativeFiniteNumber(value.cacheWrite);
	const tieredPricing = normalizeModelCatalogTieredCost(value.tieredPricing);
	const cost = {
		...input !== void 0 ? { input } : {},
		...output !== void 0 ? { output } : {},
		...cacheRead !== void 0 ? { cacheRead } : {},
		...cacheWrite !== void 0 ? { cacheWrite } : {},
		...tieredPricing ? { tieredPricing } : {}
	};
	return Object.keys(cost).length > 0 ? cost : void 0;
}
function normalizeOpenRouterPrice(value) {
	if (!isRecord(value)) return;
	const maxPrice = {};
	for (const field of [
		"prompt",
		"completion",
		"image",
		"audio",
		"request"
	]) {
		const candidate = value[field];
		const normalized = normalizeOptionalString(candidate) ?? asFiniteNumber(candidate);
		if (normalized !== void 0) maxPrice[field] = normalized;
	}
	return Object.keys(maxPrice).length > 0 ? maxPrice : void 0;
}
function normalizeOpenRouterMetricPreference(value) {
	const numeric = asFiniteNumber(value);
	if (numeric !== void 0) return numeric;
	if (!isRecord(value)) return;
	const normalized = {};
	for (const field of [
		"p50",
		"p75",
		"p90",
		"p99"
	]) {
		const cutoff = asFiniteNumber(value[field]);
		if (cutoff !== void 0) normalized[field] = cutoff;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeOpenRouterSort(value) {
	const sort = normalizeOptionalString(value);
	if (sort) return sort;
	if (!isRecord(value)) return;
	const by = normalizeOptionalString(value.by);
	const partition = value.partition === null ? null : normalizeOptionalString(value.partition) ?? void 0;
	const normalized = {
		...by ? { by } : {},
		...partition !== void 0 ? { partition } : {}
	};
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeOpenRouterRouting(value) {
	if (!isRecord(value)) return;
	const routing = {
		...typeof value.allow_fallbacks === "boolean" ? { allow_fallbacks: value.allow_fallbacks } : {},
		...typeof value.require_parameters === "boolean" ? { require_parameters: value.require_parameters } : {},
		...value.data_collection === "deny" || value.data_collection === "allow" ? { data_collection: value.data_collection } : {},
		...typeof value.zdr === "boolean" ? { zdr: value.zdr } : {},
		...typeof value.enforce_distillable_text === "boolean" ? { enforce_distillable_text: value.enforce_distillable_text } : {}
	};
	for (const field of [
		"order",
		"only",
		"ignore",
		"quantizations"
	]) {
		const normalized = normalizeOptionalTrimmedStringList(value[field]);
		if (normalized) routing[field] = normalized;
	}
	const sort = normalizeOpenRouterSort(value.sort);
	if (sort) routing.sort = sort;
	const maxPrice = normalizeOpenRouterPrice(value.max_price);
	if (maxPrice) routing.max_price = maxPrice;
	for (const field of ["preferred_min_throughput", "preferred_max_latency"]) {
		const normalized = normalizeOpenRouterMetricPreference(value[field]);
		if (normalized !== void 0) routing[field] = normalized;
	}
	return Object.keys(routing).length > 0 ? routing : void 0;
}
function normalizeVercelGatewayRouting(value) {
	if (!isRecord(value)) return;
	const routing = {};
	for (const field of ["only", "order"]) {
		const normalized = normalizeOptionalTrimmedStringList(value[field]);
		if (normalized) routing[field] = normalized;
	}
	return Object.keys(routing).length > 0 ? routing : void 0;
}
function normalizeModelCatalogCompat(value) {
	if (!isRecord(value)) return;
	const compat = {};
	for (const field of [
		"supportsStore",
		"supportsPromptCacheKey",
		"supportsDeveloperRole",
		"supportsReasoningEffort",
		"supportsTemperature",
		"supportsInstructions",
		"supportsUsageInStreaming",
		"supportsTools",
		"supportsStrictMode",
		"supportsJsonSchemaResponseFormat",
		"requiresStringContent",
		"strictMessageKeys",
		"requiresToolResultName",
		"requiresAssistantAfterToolResult",
		"requiresThinkingAsText",
		"requiresReasoningContentOnAssistantMessages",
		"zaiToolStream",
		"sendSessionAffinityHeaders",
		"sendSessionIdHeader",
		"supportsEagerToolInputStreaming",
		"supportsLongCacheRetention",
		"supportsResponsesContinuation",
		"requiresOpenAiAnthropicToolPayload"
	]) if (typeof value[field] === "boolean") compat[field] = value[field];
	for (const field of ["toolSchemaProfile", "toolCallArgumentsEncoding"]) {
		const normalized = normalizeOptionalString(value[field]) ?? "";
		if (normalized) compat[field] = normalized;
	}
	for (const field of [
		"visibleReasoningDetailTypes",
		"supportedReasoningEfforts",
		"unsupportedToolSchemaKeywords"
	]) {
		const normalized = normalizeTrimmedStringList(value[field]);
		if (normalized.length > 0 || field === "supportedReasoningEfforts" && Array.isArray(value[field])) compat[field] = normalized;
	}
	if (isRecord(value.reasoningEffortMap)) {
		const reasoningEffortMap = Object.fromEntries(Object.entries(value.reasoningEffortMap).flatMap(([rawKey, rawMapped]) => {
			const key = rawKey.trim();
			const mapped = typeof rawMapped === "string" ? rawMapped.trim() : "";
			return key && mapped ? [[key, mapped]] : [];
		}));
		if (Object.keys(reasoningEffortMap).length > 0) compat.reasoningEffortMap = reasoningEffortMap;
	}
	const codeMode = normalizeOptionalString(value.codeMode) ?? "";
	if (codeMode === "preferred" || codeMode === "capable") compat.codeMode = codeMode;
	const maxTokensField = normalizeOptionalString(value.maxTokensField) ?? "";
	if (maxTokensField === "max_completion_tokens" || maxTokensField === "max_tokens") compat.maxTokensField = maxTokensField;
	const thinkingFormat = normalizeOptionalString(value.thinkingFormat) ?? "";
	if (isModelCatalogThinkingFormat(thinkingFormat)) compat.thinkingFormat = thinkingFormat;
	if (value.cacheControlFormat === "anthropic") compat.cacheControlFormat = "anthropic";
	const openRouterRouting = normalizeOpenRouterRouting(value.openRouterRouting);
	if (openRouterRouting) compat.openRouterRouting = openRouterRouting;
	const vercelGatewayRouting = normalizeVercelGatewayRouting(value.vercelGatewayRouting);
	if (vercelGatewayRouting) compat.vercelGatewayRouting = vercelGatewayRouting;
	return Object.keys(compat).length > 0 ? compat : void 0;
}
function normalizeModelCatalogStatus(value) {
	const status = normalizeOptionalString(value) ?? "";
	return MODEL_CATALOG_STATUSES.has(status) ? status : void 0;
}
function normalizeModelCatalogImageTokenMode(value) {
	const tokenMode = normalizeOptionalString(value) ?? "";
	if (tokenMode === "tile" || tokenMode === "detail" || tokenMode === "provider") return tokenMode;
}
function normalizeModelCatalogMediaInput(value) {
	if (!isRecord(value) || !isRecord(value.image)) return;
	const maxBytes = normalizePositiveInteger(value.image.maxBytes);
	const maxPixels = normalizePositiveInteger(value.image.maxPixels);
	const maxSidePx = normalizePositiveInteger(value.image.maxSidePx);
	const preferredSidePx = normalizePositiveInteger(value.image.preferredSidePx);
	const tokenMode = normalizeModelCatalogImageTokenMode(value.image.tokenMode);
	const normalizedImage = {
		...maxBytes !== void 0 ? { maxBytes } : {},
		...maxPixels !== void 0 ? { maxPixels } : {},
		...maxSidePx !== void 0 ? { maxSidePx } : {},
		...preferredSidePx !== void 0 ? { preferredSidePx } : {},
		...tokenMode ? { tokenMode } : {}
	};
	return Object.keys(normalizedImage).length > 0 ? { image: normalizedImage } : void 0;
}
function normalizeModelCatalogModel(value) {
	if (!isRecord(value)) return;
	const id = normalizeOptionalString(value.id) ?? "";
	if (!id) return;
	const name = normalizeOptionalString(value.name) ?? "";
	const api = normalizeModelCatalogApi(value.api);
	const baseUrl = normalizeOptionalString(value.baseUrl) ?? "";
	const headers = normalizeStringMap(value.headers);
	const input = normalizeModelCatalogInputs(value.input);
	const reasoning = typeof value.reasoning === "boolean" ? value.reasoning : void 0;
	const contextWindow = asPositiveFiniteNumber(value.contextWindow);
	const contextWindowSelection = normalizeModelCatalogContextWindowSelection(value);
	const contextTokens = normalizePositiveInteger(value.contextTokens);
	const maxTokens = asPositiveFiniteNumber(value.maxTokens);
	const thinkingLevelMap = normalizeModelCatalogThinkingLevelMap(value.thinkingLevelMap);
	const cost = normalizeModelCatalogCost(value.cost);
	const compat = normalizeModelCatalogCompat(value.compat);
	const mediaInput = normalizeModelCatalogMediaInput(value.mediaInput);
	const status = normalizeModelCatalogStatus(value.status);
	const statusReason = normalizeOptionalString(value.statusReason) ?? "";
	const replaces = normalizeTrimmedStringList(value.replaces);
	const replacedBy = normalizeOptionalString(value.replacedBy) ?? "";
	const tags = normalizeTrimmedStringList(value.tags);
	return {
		id,
		...name ? { name } : {},
		...api ? { api } : {},
		...baseUrl ? { baseUrl } : {},
		...headers ? { headers } : {},
		...input ? { input } : {},
		...reasoning !== void 0 ? { reasoning } : {},
		...contextWindow !== void 0 ? { contextWindow } : {},
		...contextWindowSelection,
		...contextTokens !== void 0 ? { contextTokens } : {},
		...maxTokens !== void 0 ? { maxTokens } : {},
		...thinkingLevelMap ? { thinkingLevelMap } : {},
		...cost ? { cost } : {},
		...compat ? { compat } : {},
		...mediaInput ? { mediaInput } : {},
		...status ? { status } : {},
		...statusReason ? { statusReason } : {},
		...replaces.length > 0 ? { replaces } : {},
		...replacedBy ? { replacedBy } : {},
		...tags.length > 0 ? { tags } : {}
	};
}
function normalizeModelCatalogProvider(value) {
	if (!isRecord(value)) return;
	const models = Array.isArray(value.models) ? value.models.map((entry) => normalizeModelCatalogModel(entry)).filter((entry) => Boolean(entry)) : [];
	if (models.length === 0) return;
	const baseUrl = normalizeOptionalString(value.baseUrl) ?? "";
	const api = normalizeModelCatalogApi(value.api);
	const headers = normalizeStringMap(value.headers);
	const defaultModel = normalizeOptionalString(value.defaultModel) ?? "";
	const defaultUtilityModel = normalizeOptionalString(value.defaultUtilityModel) ?? "";
	return {
		...baseUrl ? { baseUrl } : {},
		...api ? { api } : {},
		...headers ? { headers } : {},
		...defaultModel ? { defaultModel } : {},
		...defaultUtilityModel ? { defaultUtilityModel } : {},
		models
	};
}
function normalizeModelCatalogProviders(value, ownedProviders) {
	if (!isRecord(value)) return;
	const providers = {};
	for (const [rawProviderId, rawProvider] of Object.entries(value)) {
		const providerId = normalizeProviderId(rawProviderId);
		if (!providerId || !ownedProviders.has(providerId)) continue;
		const provider = normalizeModelCatalogProvider(rawProvider);
		if (provider) providers[providerId] = provider;
	}
	return Object.keys(providers).length > 0 ? providers : void 0;
}
function normalizeModelCatalogAliases(value, ownedProviders) {
	if (!isRecord(value)) return;
	const aliases = {};
	for (const [rawAlias, rawTarget] of Object.entries(value)) {
		const alias = normalizeProviderId(rawAlias);
		if (!alias || !isRecord(rawTarget)) continue;
		const provider = normalizeProviderId(normalizeOptionalString(rawTarget.provider) ?? "");
		if (!provider || !ownedProviders.has(provider)) continue;
		const api = normalizeModelCatalogApi(rawTarget.api);
		const baseUrl = normalizeOptionalString(rawTarget.baseUrl) ?? "";
		aliases[alias] = {
			provider,
			...api ? { api } : {},
			...baseUrl ? { baseUrl } : {}
		};
	}
	return Object.keys(aliases).length > 0 ? aliases : void 0;
}
function normalizeModelCatalogSuppressions(value) {
	if (!Array.isArray(value)) return;
	const suppressions = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const provider = normalizeProviderId(normalizeOptionalString(entry.provider) ?? "");
		const model = normalizeOptionalString(entry.model) ?? "";
		if (!provider || !model) continue;
		const reason = normalizeOptionalString(entry.reason) ?? "";
		const replacedBy = isRecord(entry.retirement) ? normalizeOptionalString(entry.retirement.replacedBy) : void 0;
		const retirement = isRecord(entry.retirement) && (entry.retirement.replacedBy === void 0 || replacedBy) ? replacedBy ? { replacedBy } : {} : void 0;
		const rawWhen = isRecord(entry.when) ? entry.when : void 0;
		const baseUrlHosts = normalizeTrimmedStringList(rawWhen?.baseUrlHosts).map((host) => host.toLowerCase());
		const providerConfigApiIn = normalizeTrimmedStringList(rawWhen?.providerConfigApiIn).map((api) => api.toLowerCase());
		const when = baseUrlHosts.length > 0 || providerConfigApiIn.length > 0 ? {
			...baseUrlHosts.length > 0 ? { baseUrlHosts } : {},
			...providerConfigApiIn.length > 0 ? { providerConfigApiIn } : {}
		} : void 0;
		if (retirement && entry.when !== void 0 && (!rawWhen || !when || rawWhen.baseUrlHosts !== void 0 && baseUrlHosts.length === 0 || rawWhen.providerConfigApiIn !== void 0 && providerConfigApiIn.length === 0)) continue;
		suppressions.push({
			provider,
			model,
			...reason ? { reason } : {},
			...retirement ? { retirement } : {},
			...when ? { when } : {}
		});
	}
	return suppressions.length > 0 ? suppressions : void 0;
}
function normalizeModelCatalogDiscovery(value, ownedProviders) {
	if (!isRecord(value)) return;
	const discovery = {};
	for (const [rawProviderId, rawMode] of Object.entries(value)) {
		const providerId = normalizeProviderId(rawProviderId);
		const mode = normalizeOptionalString(rawMode) ?? "";
		if (providerId && ownedProviders.has(providerId) && MODEL_CATALOG_DISCOVERY_MODES.has(mode)) discovery[providerId] = mode;
	}
	return Object.keys(discovery).length > 0 ? discovery : void 0;
}
/** Normalize a raw model catalog object for the set of providers owned by a plugin/manifest. */
function normalizeModelCatalog(value, params) {
	if (!isRecord(value)) return;
	const ownedProviders = normalizeOwnedProviderSet(params.ownedProviders);
	const modelsDev = Object.fromEntries(Object.entries(normalizeStringMap(value.modelsDev) ?? {}).flatMap(([rawProviderId, sourceId]) => {
		const providerId = normalizeProviderId(rawProviderId);
		return ownedProviders.has(providerId) && !isBlockedObjectKey(providerId) ? [[providerId, sourceId]] : [];
	}));
	const providers = normalizeModelCatalogProviders(value.providers, ownedProviders);
	const aliases = normalizeModelCatalogAliases(value.aliases, ownedProviders);
	const suppressions = normalizeModelCatalogSuppressions(value.suppressions);
	const discovery = normalizeModelCatalogDiscovery(value.discovery, ownedProviders);
	const runtimeAugment = value.runtimeAugment === true;
	const catalog = {
		...Object.keys(modelsDev).length > 0 ? { modelsDev } : {},
		...providers ? { providers } : {},
		...aliases ? { aliases } : {},
		...suppressions ? { suppressions } : {},
		...discovery ? { discovery } : {},
		...runtimeAugment ? { runtimeAugment } : {}
	};
	return Object.keys(catalog).length > 0 ? catalog : void 0;
}
//#endregion
//#region packages/plugin-package-contract/src/categories.ts
/** Active browse taxonomy, ordered with the core configuration surfaces first. */
const PLUGIN_CATEGORY_SLUGS = [
	"channels",
	"models",
	"agent-runtimes",
	"memory",
	"context",
	"voice",
	"web",
	"media",
	"security",
	"integrations",
	"developer-tools",
	"infrastructure",
	"documents-files",
	"inbox-collaboration",
	"productivity",
	"scheduling",
	"finance-payments",
	"sales-marketing",
	"data-analytics",
	"agent-orchestration",
	"research",
	"other"
];
/** Published declarations remain readable while authors adopt the active taxonomy. */
const LEGACY_PLUGIN_CATEGORY_SLUGS = [
	"tools",
	"runtime",
	"gateway"
];
const ACCEPTED_PLUGIN_CATEGORY_SLUGS = [...PLUGIN_CATEGORY_SLUGS, ...LEGACY_PLUGIN_CATEGORY_SLUGS];
/** Validate optional ordered package-owned plugin categories. */
function validatePluginCategories(value) {
	if (value === void 0) return { ok: true };
	if (!Array.isArray(value)) return {
		ok: false,
		error: "must be an array"
	};
	if (value.length < 1 || value.length > 3) return {
		ok: false,
		error: "must contain between 1 and 3 entries"
	};
	const categories = [];
	for (const entry of value) {
		const category = ACCEPTED_PLUGIN_CATEGORY_SLUGS.find((candidate) => candidate === entry);
		if (!category) return {
			ok: false,
			error: `contains unknown category ${JSON.stringify(entry)}`
		};
		if (categories.includes(category)) return {
			ok: false,
			error: "must not contain duplicates"
		};
		categories.push(category);
	}
	return {
		ok: true,
		categories
	};
}
//#endregion
//#region src/plugins/doctor-session-route-state-owner-types.ts
function isDoctorSessionRouteStateOwner(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return typeof candidate.id === "string" && typeof candidate.label === "string" && candidate.id.trim().length > 0 && candidate.label.trim().length > 0 && (candidate.providerIds === void 0 || normalizeTrimmedStringList(candidate.providerIds).length > 0) && (candidate.runtimeIds === void 0 || normalizeTrimmedStringList(candidate.runtimeIds).length > 0) && (candidate.cliSessionKeys === void 0 || normalizeTrimmedStringList(candidate.cliSessionKeys).length > 0) && (candidate.authProfilePrefixes === void 0 || normalizeTrimmedStringList(candidate.authProfilePrefixes).length > 0);
}
function coerceDoctorSessionRouteStateOwners(value) {
	if (!Array.isArray(value)) return [];
	return value.filter(isDoctorSessionRouteStateOwner).map((owner) => ({
		id: owner.id.trim(),
		label: owner.label.trim(),
		providerIds: normalizeTrimmedStringList(owner.providerIds),
		runtimeIds: normalizeTrimmedStringList(owner.runtimeIds),
		cliSessionKeys: normalizeTrimmedStringList(owner.cliSessionKeys),
		authProfilePrefixes: normalizeTrimmedStringList(owner.authProfilePrefixes)
	}));
}
const PLUGIN_MANIFEST_CONTRACT_KEYS = [
	"codeModeExecutors",
	"embeddedExtensionFactories",
	"agentToolResultMiddleware",
	"trustedToolPolicies",
	"externalAuthProviders",
	"decisionProviders",
	"embeddingProviders",
	"speechProviders",
	"realtimeTranscriptionProviders",
	"realtimeVoiceProviders",
	"mediaUnderstandingProviders",
	"transcriptSourceProviders",
	"documentExtractors",
	"imageGenerationProviders",
	"videoGenerationProviders",
	"musicGenerationProviders",
	"webContentExtractors",
	"webFetchProviders",
	"webSearchProviders",
	"workerProviders",
	"usageProviders",
	"migrationProviders",
	"gatewayMethodDispatch",
	"tools"
];
//#endregion
//#region src/plugins/manifest-capability-normalizers.ts
function normalizeManifestDecisionModels(value, providers) {
	if (!Array.isArray(value)) return;
	const models = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const provider = normalizeOptionalString(entry.provider);
		const id = normalizeOptionalString(entry.id);
		const name = normalizeOptionalString(entry.name);
		if (!provider || !id || !name || !providers?.includes(provider)) continue;
		const ref = `${provider}/${id}`;
		if (!seen.has(ref)) {
			models.push({
				provider,
				id,
				name
			});
			seen.add(ref);
		}
	}
	return models.length ? models : void 0;
}
/** Endpoint restrictions constrain a provider alias without changing stored credential identity. */
function normalizeManifestProviderAuthAliases(value) {
	if (!isRecord(value)) return;
	const aliases = Object.create(null);
	for (const [key, entry] of Object.entries(value)) {
		const alias = normalizeOptionalString(key);
		if (!alias || isBlockedObjectKey$1(alias)) continue;
		if (typeof entry === "string") {
			const provider = normalizeOptionalString(entry);
			if (provider) aliases[alias] = provider;
		} else if (isRecord(entry)) {
			const provider = normalizeOptionalString(entry.provider);
			const baseUrls = normalizeTrimmedStringList(entry.baseUrls);
			if (provider && baseUrls.length > 0) aliases[alias] = {
				provider,
				baseUrls
			};
		}
	}
	return Object.keys(aliases).length > 0 ? aliases : void 0;
}
function isPluginToolProfile(profile) {
	return profile === "minimal" || profile === "coding" || profile === "messaging" || profile === "full";
}
function normalizeStringListRecord(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [key, rawValues] of Object.entries(value)) {
		const providerId = normalizeOptionalString(key) ?? "";
		if (!providerId || isBlockedObjectKey$1(providerId)) continue;
		const values = normalizeTrimmedStringList(rawValues);
		if (values.length === 0) continue;
		normalized[providerId] = values;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeManifestStringRecord(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [rawKey, rawValue] of Object.entries(value)) {
		const key = normalizeOptionalString(rawKey) ?? "";
		const valueLocal = normalizeOptionalString(rawValue) ?? "";
		if (!key || isBlockedObjectKey$1(key) || !valueLocal) continue;
		normalized[key] = valueLocal;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeManifestMcpServers(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [rawName, rawServer] of Object.entries(value)) {
		const name = normalizeOptionalString(rawName) ?? "";
		if (!name || isBlockedObjectKey$1(name) || !isRecord(rawServer)) continue;
		normalized[name] = { ...rawServer };
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeNamedMetadataRecord(value, normalizeEntry) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [rawId, rawEntry] of Object.entries(value)) {
		const id = normalizeOptionalString(rawId) ?? "";
		const entry = !id || isBlockedObjectKey$1(id) || !isRecord(rawEntry) ? void 0 : normalizeEntry(rawEntry, id);
		if (entry) normalized[id] = entry;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeManifestTranscriptSources(value, ownedProviders = []) {
	const locatorKeys = [
		"accountId",
		"guildId",
		"channelId",
		"meetingUrl"
	];
	return normalizeNamedMetadataRecord(value, (entry, id) => {
		if (!ownedProviders.includes(id)) return;
		const name = normalizeOptionalString(entry.name);
		const raw = entry.autoStart;
		const autoStart = isRecord(raw) && Object.entries(raw).every(([key, mode]) => locatorKeys.some((locator) => locator === key) && (mode === "optional" || mode === "required")) ? Object.fromEntries(Object.entries(raw)) : void 0;
		return name || autoStart ? {
			...name ? { name } : {},
			...autoStart ? { autoStart } : {}
		} : void 0;
	});
}
const MEDIA_UNDERSTANDING_CAPABILITIES = /* @__PURE__ */ new Set([
	"image",
	"audio",
	"video"
]);
function normalizeMediaUnderstandingCapabilityRecord(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [rawKey, rawValue] of Object.entries(value)) {
		if (!MEDIA_UNDERSTANDING_CAPABILITIES.has(rawKey)) continue;
		const model = normalizeOptionalString(rawValue);
		if (model) normalized[rawKey] = model;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeMediaUnderstandingPriorityRecord(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [rawKey, rawValue] of Object.entries(value)) {
		if (!MEDIA_UNDERSTANDING_CAPABILITIES.has(rawKey) || typeof rawValue !== "number" || !Number.isFinite(rawValue)) continue;
		normalized[rawKey] = rawValue;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeMediaUnderstandingCapabilities(value) {
	const values = normalizeTrimmedStringList(value).filter((entry) => MEDIA_UNDERSTANDING_CAPABILITIES.has(entry));
	return values.length > 0 ? values : void 0;
}
function normalizeMediaUnderstandingNativeDocumentInputs(value) {
	const values = normalizeTrimmedStringList(value).filter((entry) => entry === "pdf");
	return values.length > 0 ? values : void 0;
}
function normalizeMediaUnderstandingDocumentModels(value) {
	if (!isRecord(value)) return;
	const pdfRaw = value.pdf;
	if (!isRecord(pdfRaw)) return;
	const textExtraction = normalizeOptionalString(pdfRaw.textExtraction);
	const image = pdfRaw.image === false ? false : normalizeOptionalString(pdfRaw.image);
	const pdf = {
		...textExtraction ? { textExtraction } : {},
		...image !== void 0 ? { image } : {}
	};
	return Object.keys(pdf).length > 0 ? { pdf } : void 0;
}
function normalizeMediaUnderstandingProviderMetadata(value) {
	return normalizeNamedMetadataRecord(value, (rawMetadata) => {
		const capabilities = normalizeMediaUnderstandingCapabilities(rawMetadata.capabilities);
		const defaultModels = normalizeMediaUnderstandingCapabilityRecord(rawMetadata.defaultModels);
		const autoPriority = normalizeMediaUnderstandingPriorityRecord(rawMetadata.autoPriority);
		const nativeDocumentInputs = normalizeMediaUnderstandingNativeDocumentInputs(rawMetadata.nativeDocumentInputs);
		const documentModels = normalizeMediaUnderstandingDocumentModels(rawMetadata.documentModels);
		const metadata = {
			...capabilities ? { capabilities } : {},
			...defaultModels ? { defaultModels } : {},
			...autoPriority ? { autoPriority } : {},
			...nativeDocumentInputs ? { nativeDocumentInputs } : {},
			...documentModels ? { documentModels } : {}
		};
		return Object.keys(metadata).length > 0 ? metadata : void 0;
	});
}
function normalizeProviderBaseUrlGuard(value) {
	if (!isRecord(value)) return;
	const provider = normalizeOptionalString(value.provider);
	const allowedBaseUrls = normalizeTrimmedStringList(value.allowedBaseUrls);
	if (!provider || allowedBaseUrls.length === 0) return;
	const defaultBaseUrl = normalizeOptionalString(value.defaultBaseUrl);
	return {
		provider,
		...defaultBaseUrl ? { defaultBaseUrl } : {},
		allowedBaseUrls
	};
}
function normalizeCapabilityProviderAuthSignals(value) {
	if (!Array.isArray(value)) return;
	const signals = [];
	for (const rawSignal of value) {
		if (!isRecord(rawSignal)) continue;
		const provider = normalizeOptionalString(rawSignal.provider);
		if (!provider) continue;
		const providerBaseUrl = normalizeProviderBaseUrlGuard(rawSignal.providerBaseUrl);
		signals.push({
			provider,
			...providerBaseUrl ? { providerBaseUrl } : {}
		});
	}
	return signals.length > 0 ? signals : void 0;
}
function normalizeCapabilityProviderModeConfigSignal(value) {
	if (!isRecord(value)) return;
	const pathResult = normalizeOptionalString(value.path);
	const defaultValue = normalizeOptionalString(value.default);
	const allowed = normalizeTrimmedStringList(value.allowed);
	const disallowed = normalizeTrimmedStringList(value.disallowed);
	const signal = {
		...pathResult ? { path: pathResult } : {},
		...defaultValue ? { default: defaultValue } : {},
		...allowed.length > 0 ? { allowed } : {},
		...disallowed.length > 0 ? { disallowed } : {}
	};
	return Object.keys(signal).length > 0 ? signal : void 0;
}
function normalizeCapabilityProviderConfigSignals(value) {
	if (!Array.isArray(value)) return;
	const signals = [];
	for (const rawSignal of value) {
		if (!isRecord(rawSignal)) continue;
		const rootPath = normalizeOptionalString(rawSignal.rootPath);
		if (!rootPath) continue;
		const overlayPath = normalizeOptionalString(rawSignal.overlayPath);
		const overlayMapPath = normalizeOptionalString(rawSignal.overlayMapPath);
		const required = normalizeTrimmedStringList(rawSignal.required);
		const requiredAny = normalizeTrimmedStringList(rawSignal.requiredAny);
		const mode = normalizeCapabilityProviderModeConfigSignal(rawSignal.mode);
		const signal = {
			rootPath,
			...overlayPath ? { overlayPath } : {},
			...overlayMapPath ? { overlayMapPath } : {},
			...required.length > 0 ? { required } : {},
			...requiredAny.length > 0 ? { requiredAny } : {},
			...mode ? { mode } : {}
		};
		if (required.length > 0 || requiredAny.length > 0 || mode) signals.push(signal);
	}
	return signals.length > 0 ? signals : void 0;
}
function normalizeCapabilityProviderMetadataEntry(rawMetadata) {
	const aliases = normalizeTrimmedStringList(rawMetadata.aliases);
	const authProviders = normalizeTrimmedStringList(rawMetadata.authProviders);
	const authSignals = normalizeCapabilityProviderAuthSignals(rawMetadata.authSignals);
	const configSignals = normalizeCapabilityProviderConfigSignals(rawMetadata.configSignals);
	const referenceAudioInputs = rawMetadata.referenceAudioInputs === true ? true : void 0;
	const metadata = {
		...aliases.length > 0 ? { aliases } : {},
		...authProviders.length > 0 ? { authProviders } : {},
		...authSignals ? { authSignals } : {},
		...configSignals ? { configSignals } : {},
		...referenceAudioInputs ? { referenceAudioInputs } : {}
	};
	return Object.keys(metadata).length > 0 ? metadata : void 0;
}
function normalizeCapabilityProviderMetadata(value) {
	return normalizeNamedMetadataRecord(value, normalizeCapabilityProviderMetadataEntry);
}
function normalizePluginToolMetadata(value) {
	return normalizeNamedMetadataRecord(value, (rawMetadata) => {
		const providerMetadata = normalizeCapabilityProviderMetadataEntry(rawMetadata);
		const profiles = normalizeTrimmedStringList(rawMetadata.profiles).filter(isPluginToolProfile);
		const metadata = {
			...providerMetadata,
			...rawMetadata.optional === true ? { optional: true } : {},
			...profiles.length > 0 ? { profiles } : {},
			...rawMetadata.replaySafe === true ? { replaySafe: true } : {},
			...rawMetadata.sideEffecting === true ? { sideEffecting: true } : {}
		};
		return Object.keys(metadata).length > 0 ? metadata : void 0;
	});
}
function normalizeManifestCatalog(value) {
	if (!isRecord(value)) return;
	const featured = typeof value.featured === "boolean" ? value.featured : void 0;
	const order = typeof value.order === "number" && Number.isFinite(value.order) ? value.order : void 0;
	if (featured === void 0 && order === void 0) return;
	return {
		...featured !== void 0 ? { featured } : {},
		...order !== void 0 ? { order } : {}
	};
}
function normalizeManifestContracts(value) {
	if (!isRecord(value)) return;
	const contracts = {};
	for (const key of PLUGIN_MANIFEST_CONTRACT_KEYS) {
		const entries = normalizeTrimmedStringList(value[key]);
		if (entries.length > 0) contracts[key] = entries;
	}
	return Object.keys(contracts).length > 0 ? contracts : void 0;
}
function isManifestConfigLiteral(value) {
	return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function normalizeManifestDangerousConfigFlags(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const pathValue = normalizeOptionalString(entry.path) ?? "";
		if (!pathValue || !isManifestConfigLiteral(entry.equals)) continue;
		normalized.push({
			path: pathValue,
			equals: entry.equals
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeManifestSecretInputPaths(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const pathLocal = normalizeOptionalString(entry.path) ?? "";
		if (!pathLocal) continue;
		const expected = entry.expected === "string" ? entry.expected : void 0;
		const ownerKind = entry.ownerKind === "capability" || entry.ownerKind === "route" ? entry.ownerKind : void 0;
		normalized.push({
			path: pathLocal,
			...expected ? { expected } : {},
			...ownerKind ? { ownerKind } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeManifestConfigContracts(value) {
	if (!isRecord(value)) return;
	const compatibilityMigrationPaths = normalizeTrimmedStringList(value.compatibilityMigrationPaths);
	const compatibilityRuntimePaths = normalizeTrimmedStringList(value.compatibilityRuntimePaths);
	const rawSecretInputs = isRecord(value.secretInputs) ? value.secretInputs : void 0;
	const dangerousFlags = normalizeManifestDangerousConfigFlags(value.dangerousFlags);
	const secretInputPaths = rawSecretInputs ? normalizeManifestSecretInputPaths(rawSecretInputs.paths) : void 0;
	const secretInputs = secretInputPaths && secretInputPaths.length > 0 ? {
		...rawSecretInputs?.bundledDefaultEnabled === true ? { bundledDefaultEnabled: true } : rawSecretInputs?.bundledDefaultEnabled === false ? { bundledDefaultEnabled: false } : {},
		paths: secretInputPaths
	} : void 0;
	const configContracts = {
		...compatibilityMigrationPaths.length > 0 ? { compatibilityMigrationPaths } : {},
		...compatibilityRuntimePaths.length > 0 ? { compatibilityRuntimePaths } : {},
		...dangerousFlags ? { dangerousFlags } : {},
		...secretInputs ? { secretInputs } : {}
	};
	return Object.keys(configContracts).length > 0 ? configContracts : void 0;
}
//#endregion
//#region src/plugins/manifest-command-aliases.ts
/** Normalizes manifest-declared CLI command aliases. */
/** Normalizes manifest command alias records and reports duplicate/invalid entries. */
function normalizeManifestCommandAliases(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (typeof entry === "string") {
			const name = normalizeOptionalString(entry) ?? "";
			if (name) normalized.push({ name });
			continue;
		}
		if (!isRecord(entry)) continue;
		const name = normalizeOptionalString(entry.name) ?? "";
		if (!name) continue;
		const kind = entry.kind === "runtime-slash" ? entry.kind : void 0;
		const cliCommand = normalizeOptionalString(entry.cliCommand) ?? "";
		normalized.push({
			name,
			...kind ? { kind } : {},
			...cliCommand ? { cliCommand } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
//#endregion
//#region src/plugins/manifest-config-groups.ts
/** Invalid presentation metadata leaves the plugin's complete flat settings form available. */
function normalizeConfigGroups(raw, schema) {
	if (!Array.isArray(raw) || raw.length === 0 || !isRecord(schema.properties)) return;
	const ids = /* @__PURE__ */ new Set();
	const assigned = /* @__PURE__ */ new Set();
	const groups = [];
	for (const entry of raw) {
		if (!isRecord(entry)) return;
		const id = typeof entry.id === "string" ? entry.id.trim() : "";
		const title = typeof entry.title === "string" ? entry.title.trim() : "";
		if (!id || !title || ids.has(id) || entry.order !== void 0 && !Number.isInteger(entry.order) || !Array.isArray(entry.properties) || entry.properties.length === 0) return;
		const properties = [];
		for (const property of entry.properties) {
			if (typeof property !== "string" || !property || !Object.hasOwn(schema.properties, property) || assigned.has(property)) return;
			assigned.add(property);
			properties.push(property);
		}
		ids.add(id);
		groups.push({
			id,
			title,
			...typeof entry.order === "number" ? { order: entry.order } : {},
			properties
		});
	}
	return groups;
}
const MODEL_PRICING_SOURCES = [
	{
		id: "openCode",
		label: "OpenCode",
		url: "https://models.opencode.ai/api.json",
		authoritative: true
	},
	{
		id: "venice",
		label: "Venice",
		url: "https://api.venice.ai/api/v1/models",
		authoritative: true
	},
	{
		id: "chutes",
		label: "Chutes",
		url: "https://llm.chutes.ai/v1/models",
		authoritative: true
	},
	{
		id: "cerebras",
		label: "Cerebras",
		url: "https://api.cerebras.ai/public/v1/models",
		authoritative: true
	},
	{
		id: "deepinfra",
		label: "DeepInfra",
		url: "https://api.deepinfra.com/models/list",
		authoritative: true
	},
	{
		id: "openRouter",
		label: "OpenRouter",
		url: "https://openrouter.ai/api/v1/models",
		authoritative: false
	},
	{
		id: "liteLLM",
		label: "LiteLLM",
		url: "https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json",
		authoritative: false
	}
];
/** Normalize source policy without deciding which plugin owns the provider. */
function normalizeModelPricingProvider(value) {
	const record = asOptionalRecord(value);
	if (!record) return;
	const policy = typeof record.external === "boolean" ? { external: record.external } : {};
	for (const { id: sourceId } of MODEL_PRICING_SOURCES) {
		const raw = record[sourceId];
		if (raw === false) {
			policy[sourceId] = false;
			continue;
		}
		const row = asOptionalRecord(raw);
		const provider = normalizeProviderId(normalizeOptionalString(row?.provider) ?? "");
		const modelIdTransforms = normalizeTrimmedStringList(row?.modelIdTransforms).filter((entry) => entry === "version-dots");
		const source = {
			...provider ? { provider } : {},
			...row?.passthroughProviderModel === true ? { passthroughProviderModel: true } : {},
			...modelIdTransforms.length > 0 ? { modelIdTransforms } : {}
		};
		if (Object.keys(source).length > 0) policy[sourceId] = source;
	}
	return Object.keys(policy).length > 0 ? policy : void 0;
}
//#endregion
//#region src/plugins/manifest-model-provider-normalizers.ts
const MAX_SECRET_PROVIDER_EXEC_ARGS = 128;
const MAX_SECRET_PROVIDER_EXEC_ARG_BYTES = 1024;
const MAX_SECRET_PROVIDER_EXEC_TIMEOUT_MS = 12e4;
const MAX_SECRET_PROVIDER_EXEC_OUTPUT_BYTES = 20971520;
const MAX_SECRET_PROVIDER_EXEC_PASS_ENV = 128;
const SECRET_PROVIDER_NODE_COMMAND_PLACEHOLDER = "${node}";
function normalizeManifestModelSupport(value) {
	if (!isRecord(value)) return;
	const modelPrefixes = normalizeTrimmedStringList(value.modelPrefixes);
	const modelPatterns = normalizeTrimmedStringList(value.modelPatterns);
	const modelSupport = {
		...modelPrefixes.length > 0 ? { modelPrefixes } : {},
		...modelPatterns.length > 0 ? { modelPatterns } : {}
	};
	return Object.keys(modelSupport).length > 0 ? modelSupport : void 0;
}
function normalizeOwnedProviderMap(value, ownedProvidersRaw, normalizePolicy) {
	if (!isRecord(value) || !isRecord(value.providers)) return;
	const ownedProviders = new Set([...ownedProvidersRaw].map((provider) => normalizeProviderId(provider)).filter(Boolean));
	const providers = {};
	for (const [rawProviderId, rawPolicy] of Object.entries(value.providers)) {
		const providerId = normalizeProviderId(rawProviderId);
		const policy = providerId && ownedProviders.has(providerId) ? normalizePolicy(rawPolicy) : null;
		if (providerId && policy) providers[providerId] = policy;
	}
	return Object.keys(providers).length > 0 ? providers : void 0;
}
function normalizeManifestModelPricing(value, params) {
	const providers = normalizeOwnedProviderMap(value, params.ownedProviders, normalizeModelPricingProvider);
	return providers ? { providers } : void 0;
}
function normalizeManifestModelIdPrefixRules(value) {
	if (!Array.isArray(value)) return;
	const rules = [];
	for (const rawRule of value) {
		if (!isRecord(rawRule)) continue;
		const modelPrefix = normalizeOptionalString(rawRule.modelPrefix);
		const prefix = normalizeOptionalString(rawRule.prefix);
		if (!modelPrefix || !prefix) continue;
		rules.push({
			modelPrefix,
			prefix
		});
	}
	return rules.length > 0 ? rules : void 0;
}
function normalizeManifestModelIdNormalizationProvider(value) {
	if (!isRecord(value)) return;
	const aliases = {};
	if (isRecord(value.aliases)) for (const [rawAlias, rawCanonical] of Object.entries(value.aliases)) {
		const alias = normalizeProviderId(rawAlias);
		const canonical = normalizeOptionalString(rawCanonical);
		if (alias && canonical) aliases[alias] = canonical;
	}
	const stripPrefixes = normalizeTrimmedStringList(value.stripPrefixes);
	const prefixWhenBare = normalizeOptionalString(value.prefixWhenBare);
	const prefixWhenBareAfterAliasStartsWith = normalizeManifestModelIdPrefixRules(value.prefixWhenBareAfterAliasStartsWith);
	const normalization = {
		...Object.keys(aliases).length > 0 ? { aliases } : {},
		...stripPrefixes.length > 0 ? { stripPrefixes } : {},
		...prefixWhenBare ? { prefixWhenBare } : {},
		...prefixWhenBareAfterAliasStartsWith ? { prefixWhenBareAfterAliasStartsWith } : {}
	};
	return Object.keys(normalization).length > 0 ? normalization : void 0;
}
function normalizeManifestModelIdNormalization(value, params) {
	const providers = normalizeOwnedProviderMap(value, params.ownedProviders, normalizeManifestModelIdNormalizationProvider);
	return providers ? { providers } : void 0;
}
function normalizeManifestProviderEndpoints(value) {
	if (!Array.isArray(value)) return;
	const endpoints = [];
	for (const rawEndpoint of value) {
		if (!isRecord(rawEndpoint)) continue;
		const endpointClass = normalizeOptionalString(rawEndpoint.endpointClass);
		if (!endpointClass) continue;
		const hosts = normalizeTrimmedStringList(rawEndpoint.hosts).map((host) => host.toLowerCase());
		const hostSuffixes = normalizeTrimmedStringList(rawEndpoint.hostSuffixes).map((host) => host.toLowerCase());
		const baseUrls = normalizeTrimmedStringList(rawEndpoint.baseUrls);
		const googleVertexRegion = normalizeOptionalString(rawEndpoint.googleVertexRegion);
		const googleVertexRegionHostSuffix = normalizeOptionalString(rawEndpoint.googleVertexRegionHostSuffix)?.toLowerCase();
		if (hosts.length === 0 && hostSuffixes.length === 0 && baseUrls.length === 0) continue;
		endpoints.push({
			endpointClass,
			...hosts.length > 0 ? { hosts } : {},
			...hostSuffixes.length > 0 ? { hostSuffixes } : {},
			...baseUrls.length > 0 ? { baseUrls } : {},
			...googleVertexRegion ? { googleVertexRegion } : {},
			...googleVertexRegionHostSuffix ? { googleVertexRegionHostSuffix } : {}
		});
	}
	return endpoints.length > 0 ? endpoints : void 0;
}
function normalizeManifestProviderRequestProvider(value) {
	if (!isRecord(value)) return;
	const family = normalizeOptionalString(value.family);
	const compatibilityFamily = normalizeOptionalString(value.compatibilityFamily) === "moonshot" ? "moonshot" : void 0;
	const supportsStreamingUsage = isRecord(value.openAICompletions) ? value.openAICompletions.supportsStreamingUsage : void 0;
	const openAICompletions = typeof supportsStreamingUsage === "boolean" ? { supportsStreamingUsage } : void 0;
	const providerRequest = {
		...family ? { family } : {},
		...compatibilityFamily ? { compatibilityFamily } : {},
		...openAICompletions && Object.keys(openAICompletions).length > 0 ? { openAICompletions } : {}
	};
	return Object.keys(providerRequest).length > 0 ? providerRequest : void 0;
}
function normalizeManifestProviderRequest(value, params) {
	const providers = normalizeOwnedProviderMap(value, params.ownedProviders, normalizeManifestProviderRequestProvider);
	return providers ? { providers } : void 0;
}
function normalizeManifestStringArray(value, options) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (typeof entry !== "string") continue;
		if (options?.maxLength !== void 0 && entry.length > options.maxLength) continue;
		if (options?.pattern && !options.pattern.test(entry)) continue;
		normalized.push(entry);
		if (options?.maxItems !== void 0 && normalized.length >= options.maxItems) break;
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeManifestTrimmedStringArray(value, options) {
	const normalized = normalizeTrimmedStringList(value).filter((entry) => !options?.pattern || options.pattern.test(entry));
	const limited = options?.maxItems !== void 0 ? normalized.slice(0, options.maxItems) : normalized;
	return limited.length > 0 ? limited : void 0;
}
function normalizeManifestPositiveInteger(value, max) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= max ? value : void 0;
}
function normalizeManifestSecretProviderIntegrations(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [rawId, rawIntegration] of Object.entries(value)) {
		const id = normalizeOptionalString(rawId) ?? "";
		if (!id || isBlockedObjectKey$1(id) || !isRecord(rawIntegration)) continue;
		const command = normalizeOptionalString(rawIntegration.command);
		if (rawIntegration.source !== "exec" || command !== SECRET_PROVIDER_NODE_COMMAND_PLACEHOLDER) continue;
		const providerAlias = normalizeOptionalString(rawIntegration.providerAlias);
		const displayName = normalizeOptionalString(rawIntegration.displayName);
		const description = normalizeOptionalString(rawIntegration.description);
		const args = normalizeManifestStringArray(rawIntegration.args, {
			maxItems: MAX_SECRET_PROVIDER_EXEC_ARGS,
			maxLength: MAX_SECRET_PROVIDER_EXEC_ARG_BYTES
		});
		const timeoutMs = normalizeManifestPositiveInteger(rawIntegration.timeoutMs, MAX_SECRET_PROVIDER_EXEC_TIMEOUT_MS);
		const noOutputTimeoutMs = normalizeManifestPositiveInteger(rawIntegration.noOutputTimeoutMs, MAX_SECRET_PROVIDER_EXEC_TIMEOUT_MS);
		const maxOutputBytes = normalizeManifestPositiveInteger(rawIntegration.maxOutputBytes, MAX_SECRET_PROVIDER_EXEC_OUTPUT_BYTES);
		const env = normalizeManifestStringRecord(rawIntegration.env);
		const passEnv = normalizeManifestTrimmedStringArray(rawIntegration.passEnv, {
			maxItems: MAX_SECRET_PROVIDER_EXEC_PASS_ENV,
			pattern: ENV_SECRET_REF_ID_RE$1
		});
		normalized[id] = {
			...providerAlias ? { providerAlias } : {},
			...displayName ? { displayName } : {},
			...description ? { description } : {},
			source: "exec",
			command,
			...args ? { args } : {},
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			...noOutputTimeoutMs !== void 0 ? { noOutputTimeoutMs } : {},
			...maxOutputBytes !== void 0 ? { maxOutputBytes } : {},
			...typeof rawIntegration.jsonOnly === "boolean" ? { jsonOnly: rawIntegration.jsonOnly } : {},
			...env ? { env } : {},
			...passEnv ? { passEnv } : {}
		};
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
//#endregion
//#region src/plugins/manifest-platforms.ts
const MANIFEST_PLATFORMS = /* @__PURE__ */ new Set([
	"aix",
	"android",
	"darwin",
	"freebsd",
	"haiku",
	"linux",
	"openbsd",
	"sunos",
	"win32",
	"cygwin",
	"netbsd"
]);
function normalizeManifestPlatforms(value) {
	return normalizeTrimmedStringList(value).filter((platform) => MANIFEST_PLATFORMS.has(platform));
}
//#endregion
//#region src/cli/program/command-descriptor-utils.ts
const SAFE_COMMAND_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
/** Normalize and validate a command descriptor name for safe Commander registration. */
function normalizeCommandDescriptorName(name) {
	const normalized = name.trim();
	return SAFE_COMMAND_NAME_PATTERN.test(normalized) ? normalized : null;
}
/** Strip unsafe terminal content from descriptor descriptions. */
function sanitizeCommandDescriptorDescription(description) {
	return sanitizeForLog(description).trim();
}
//#endregion
//#region src/plugins/setup-presentation-url.ts
function normalizeSetupPresentationHttpsUrl(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	try {
		const url = new URL(normalized);
		const canonical = url.toString();
		return url.protocol === "https:" && url.hostname && !url.username && !url.password && canonical.length <= 2048 ? canonical : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region src/plugins/manifest-setup-normalizers.ts
function normalizeManifestActivation(value) {
	if (!isRecord(value)) return;
	const onProviders = normalizeTrimmedStringList(value.onProviders);
	const onAgentHarnesses = normalizeTrimmedStringList(value.onAgentHarnesses);
	const onCommands = normalizeTrimmedStringList(value.onCommands);
	const onChannels = normalizeTrimmedStringList(value.onChannels);
	const onRoutes = normalizeTrimmedStringList(value.onRoutes);
	const onConfigPaths = normalizeTrimmedStringList(value.onConfigPaths);
	const onStartup = typeof value.onStartup === "boolean" ? value.onStartup : void 0;
	const onCapabilities = normalizeTrimmedStringList(value.onCapabilities).filter((capability) => capability === "provider" || capability === "channel" || capability === "tool" || capability === "hook");
	const activation = {
		...onStartup !== void 0 ? { onStartup } : {},
		...onProviders.length > 0 ? { onProviders } : {},
		...onAgentHarnesses.length > 0 ? { onAgentHarnesses } : {},
		...onCommands.length > 0 ? { onCommands } : {},
		...onChannels.length > 0 ? { onChannels } : {},
		...onRoutes.length > 0 ? { onRoutes } : {},
		...onConfigPaths.length > 0 ? { onConfigPaths } : {},
		...onCapabilities.length > 0 ? { onCapabilities } : {}
	};
	return Object.keys(activation).length > 0 ? activation : void 0;
}
function normalizeChannelAccountKeyPolicies(value, channels) {
	if (!isRecord(value)) return;
	const policies = Object.create(null);
	for (const channel of channels) {
		if (isBlockedObjectKey$1(channel) || !Object.hasOwn(value, channel)) continue;
		const entry = value[channel];
		const field = isRecord(entry) ? normalizeOptionalString(entry.canonicalAliasesRequireOwnField) : void 0;
		if (field && !isBlockedObjectKey$1(field)) policies[channel] = { canonicalAliasesRequireOwnField: field };
	}
	return Object.keys(policies).length ? policies : void 0;
}
function normalizeManifestCliCommands(value) {
	if (!Array.isArray(value)) return;
	const seen = /* @__PURE__ */ new Set();
	const commands = [];
	for (const entry of value) {
		if (!isRecord(entry) || typeof entry.name !== "string" || typeof entry.description !== "string") continue;
		const name = normalizeCommandDescriptorName(entry.name);
		const description = sanitizeCommandDescriptorDescription(entry.description);
		if (!name || !description || typeof entry.hasSubcommands !== "boolean" || seen.has(name)) continue;
		seen.add(name);
		commands.push({
			name,
			description,
			hasSubcommands: entry.hasSubcommands
		});
	}
	return commands;
}
function normalizeManifestSetupProviders(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const id = normalizeOptionalString(entry.id) ?? "";
		if (!id) continue;
		const authMethods = normalizeTrimmedStringList(entry.authMethods);
		const envVars = normalizeTrimmedStringList(entry.envVars);
		const authEvidence = normalizeManifestSetupProviderAuthEvidence(entry.authEvidence);
		normalized.push({
			id,
			...authMethods.length > 0 ? { authMethods } : {},
			...envVars.length > 0 ? { envVars } : {},
			...authEvidence ? { authEvidence } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeManifestSetupProviderAuthEvidence(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry) || entry.type !== "local-file-with-env") continue;
		const credentialMarker = normalizeOptionalString(entry.credentialMarker);
		if (!credentialMarker) continue;
		const fileEnvVar = normalizeOptionalString(entry.fileEnvVar);
		const fallbackPaths = normalizeTrimmedStringList(entry.fallbackPaths);
		if (!fileEnvVar && fallbackPaths.length === 0) continue;
		const requiresAnyEnv = normalizeTrimmedStringList(entry.requiresAnyEnv);
		const requiresAllEnv = normalizeTrimmedStringList(entry.requiresAllEnv);
		const source = normalizeOptionalString(entry.source);
		normalized.push({
			type: "local-file-with-env",
			...fileEnvVar ? { fileEnvVar } : {},
			...fallbackPaths.length > 0 ? { fallbackPaths } : {},
			...requiresAnyEnv.length > 0 ? { requiresAnyEnv } : {},
			...requiresAllEnv.length > 0 ? { requiresAllEnv } : {},
			credentialMarker,
			...source ? { source } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeManifestSetup(value) {
	if (!isRecord(value)) return;
	const providers = normalizeManifestSetupProviders(value.providers);
	const cliBackends = normalizeTrimmedStringList(value.cliBackends);
	const configMigrations = normalizeTrimmedStringList(value.configMigrations);
	const nativeSessionCatalog = isRecord(value.nativeSessionCatalog) ? {
		label: normalizeOptionalString(value.nativeSessionCatalog.label) ?? "",
		description: normalizeOptionalString(value.nativeSessionCatalog.description),
		nodeCommands: normalizeTrimmedStringList(value.nativeSessionCatalog.nodeCommands),
		legacyDefaultEnabled: value.nativeSessionCatalog.legacyDefaultEnabled === true
	} : void 0;
	const requiresRuntime = typeof value.requiresRuntime === "boolean" ? value.requiresRuntime : void 0;
	const setup = {
		...providers ? { providers } : {},
		...cliBackends.length > 0 ? { cliBackends } : {},
		...configMigrations.length > 0 ? { configMigrations } : {},
		...nativeSessionCatalog?.label ? { nativeSessionCatalog: {
			label: nativeSessionCatalog.label,
			...nativeSessionCatalog.legacyDefaultEnabled ? { legacyDefaultEnabled: true } : {},
			...nativeSessionCatalog.nodeCommands.length > 0 ? { nodeCommands: nativeSessionCatalog.nodeCommands } : {},
			...nativeSessionCatalog.description ? { description: nativeSessionCatalog.description } : {}
		} } : {},
		...requiresRuntime !== void 0 ? { requiresRuntime } : {}
	};
	return Object.keys(setup).length > 0 ? setup : void 0;
}
function normalizeManifestQaRunners(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const commandName = normalizeOptionalString(entry.commandName) ?? "";
		if (!commandName) continue;
		const description = normalizeOptionalString(entry.description) ?? "";
		normalized.push({
			commandName,
			...description ? { description } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeDashboardCapabilityBase(value, field, index) {
	if (!isRecord(value)) return `${field}[${index}] must be an object`;
	const id = normalizeOptionalString(value.id);
	const method = normalizeOptionalString(value.method);
	const description = normalizeOptionalString(value.description);
	if (!id || !/^[a-z0-9][a-z0-9._-]*$/u.test(id)) return `${field}[${index}].id must be a lowercase capability id`;
	if (!method) return `${field}[${index}].method must be a non-empty string`;
	if (!description) return `${field}[${index}].description must be a non-empty string`;
	return {
		id,
		method,
		description
	};
}
function normalizeManifestDashboard(value) {
	if (value === void 0) return { ok: true };
	if (!isRecord(value)) return {
		ok: false,
		error: "dashboard must be an object"
	};
	if (value.dataBindings !== void 0 && !Array.isArray(value.dataBindings)) return {
		ok: false,
		error: "dashboard.dataBindings must be an array"
	};
	if (value.actionVerbs !== void 0 && !Array.isArray(value.actionVerbs)) return {
		ok: false,
		error: "dashboard.actionVerbs must be an array"
	};
	const dataBindings = [];
	for (const [index, entry] of (value.dataBindings ?? []).entries()) {
		const normalized = normalizeDashboardCapabilityBase(entry, "dashboard.dataBindings", index);
		if (typeof normalized === "string") return {
			ok: false,
			error: normalized
		};
		dataBindings.push(normalized);
	}
	const actionVerbs = [];
	for (const [index, entry] of (value.actionVerbs ?? []).entries()) {
		const normalized = normalizeDashboardCapabilityBase(entry, "dashboard.actionVerbs", index);
		if (typeof normalized === "string") return {
			ok: false,
			error: normalized
		};
		const rawParamShape = isRecord(entry) ? entry.paramShape : void 0;
		if (rawParamShape !== void 0 && !isRecord(rawParamShape)) return {
			ok: false,
			error: `dashboard.actionVerbs[${index}].paramShape must be a JSON Schema object`
		};
		actionVerbs.push({
			...normalized,
			...rawParamShape ? { paramShape: rawParamShape } : {}
		});
	}
	if (dataBindings.length === 0 && actionVerbs.length === 0) return { ok: true };
	return {
		ok: true,
		dashboard: {
			...dataBindings.length > 0 ? { dataBindings } : {},
			...actionVerbs.length > 0 ? { actionVerbs } : {}
		}
	};
}
function normalizeManifestControlUi(value) {
	if (value === void 0) return ok(void 0);
	if (!isRecord(value) || Object.keys(value).some((key) => key !== "entry" && key !== "styles")) return err("controlUi must contain only entry and optional styles");
	const entry = typeof value.entry === "string" ? value.entry.replace(/^\.\//u, "") : "";
	if (entry.length > 512 || !/^dist\/(?:[\w-][\w.-]*\/)+[\w-][\w.-]*\.m?js$/u.test(entry)) return err("controlUi.entry must be a JavaScript file in a dedicated dist subdirectory");
	if (value.styles !== void 0 && (!Array.isArray(value.styles) || value.styles.length > 16)) return err("controlUi.styles must be an array of at most 16 stylesheets");
	const assetPrefix = entry.slice(0, entry.lastIndexOf("/") + 1);
	const styles = [];
	for (const rawStyle of value.styles ?? []) {
		const style = typeof rawStyle === "string" ? rawStyle.replace(/^\.\//u, "") : "";
		if (style.length > 512 || !style.startsWith(assetPrefix) || !/^(?:[\w-][\w.-]*\/)+[\w-][\w.-]*\.css$/u.test(style)) return err("controlUi.styles must contain CSS files under the entry's asset directory");
		if (!styles.includes(style)) styles.push(style);
	}
	return ok({
		entry,
		...styles.length > 0 ? { styles } : {}
	});
}
function normalizeProviderChannelLogin(value) {
	if (!isRecord(value) || Object.keys(value).some((key) => key !== "aliases")) return;
	if (value.aliases !== void 0 && (!Array.isArray(value.aliases) || value.aliases.some((alias) => typeof alias !== "string" || !alias.trim()))) return;
	const aliases = normalizeUniqueTrimmedStringList(value.aliases);
	return aliases.length > 0 ? { aliases } : {};
}
function normalizeProviderAuthChoices(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const provider = normalizeOptionalString(entry.provider) ?? "";
		const method = normalizeOptionalString(entry.method) ?? "";
		const choiceId = normalizeOptionalString(entry.choiceId) ?? "";
		if (!provider || !method || !choiceId) continue;
		const choiceLabel = normalizeOptionalString(entry.choiceLabel) ?? "";
		const choiceHint = normalizeOptionalString(entry.choiceHint) ?? "";
		const icon = normalizeSetupPresentationHttpsUrl(entry.icon);
		const website = normalizeSetupPresentationHttpsUrl(entry.website);
		const assistantPriority = typeof entry.assistantPriority === "number" && Number.isFinite(entry.assistantPriority) ? entry.assistantPriority : void 0;
		const assistantVisibility = entry.assistantVisibility === "manual-only" || entry.assistantVisibility === "visible" || entry.assistantVisibility === "detected-only" ? entry.assistantVisibility : void 0;
		const deprecatedChoiceIds = normalizeTrimmedStringList(entry.deprecatedChoiceIds);
		const groupId = normalizeOptionalString(entry.groupId) ?? "";
		const groupLabel = normalizeOptionalString(entry.groupLabel) ?? "";
		const groupHint = normalizeOptionalString(entry.groupHint) ?? "";
		const onboardingFeatured = entry.onboardingFeatured === true;
		const optionKey = normalizeOptionalString(entry.optionKey) ?? "";
		const cliFlag = normalizeOptionalString(entry.cliFlag) ?? "";
		const cliOption = normalizeOptionalString(entry.cliOption) ?? "";
		const cliDescription = normalizeOptionalString(entry.cliDescription) ?? "";
		const appGuidedSecret = entry.appGuidedSecret === true;
		const appGuidedActionLabel = normalizeOptionalString(entry.appGuidedActionLabel) ?? "";
		const appGuidedAuth = entry.appGuidedAuth === "oauth" || entry.appGuidedAuth === "device-code" ? entry.appGuidedAuth : void 0;
		const onboardingScopes = normalizeTrimmedStringList(entry.onboardingScopes).filter((scope) => scope === "text-inference" || scope === "image-generation" || scope === "music-generation");
		const appGuidedDiscovery = entry.appGuidedDiscovery === true;
		const channelLogin = normalizeProviderChannelLogin(entry.channelLogin);
		normalized.push({
			provider,
			method,
			choiceId,
			...entry.modelTarget === "utility" ? { modelTarget: "utility" } : {},
			...entry.platforms !== void 0 ? { platforms: normalizeManifestPlatforms(entry.platforms) } : {},
			...choiceLabel ? { choiceLabel } : {},
			...choiceHint ? { choiceHint } : {},
			...icon ? { icon } : {},
			...website ? { website } : {},
			...assistantPriority !== void 0 ? { assistantPriority } : {},
			...assistantVisibility ? { assistantVisibility } : {},
			...deprecatedChoiceIds.length > 0 ? { deprecatedChoiceIds } : {},
			...groupId ? { groupId } : {},
			...groupLabel ? { groupLabel } : {},
			...groupHint ? { groupHint } : {},
			...onboardingFeatured ? { onboardingFeatured: true } : {},
			...appGuidedDiscovery ? { appGuidedDiscovery: true } : {},
			...optionKey ? { optionKey } : {},
			...cliFlag ? { cliFlag } : {},
			...cliOption ? { cliOption } : {},
			...cliDescription ? { cliDescription } : {},
			...appGuidedSecret ? { appGuidedSecret: true } : {},
			...entry.personalAccount === true ? { personalAccount: true } : {},
			...appGuidedActionLabel ? { appGuidedActionLabel } : {},
			...appGuidedAuth ? { appGuidedAuth } : {},
			...entry.credentialOnly === true ? { credentialOnly: true } : {},
			...channelLogin ? { channelLogin } : {},
			...onboardingScopes.length > 0 ? { onboardingScopes } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeConfigUiHints(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [hintPath, rawHint] of Object.entries(value)) {
		if (!isRecord(rawHint)) continue;
		const hint = { ...rawHint };
		if ("presentation" in hint && hint.presentation !== "phone-number") delete hint.presentation;
		normalized[hintPath] = hint;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeChannelConfigs(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [key, rawEntry] of Object.entries(value)) {
		const channelId = normalizeOptionalString(key) ?? "";
		if (!channelId || isBlockedObjectKey$1(channelId) || !isRecord(rawEntry)) continue;
		const schema = isRecord(rawEntry.schema) ? rawEntry.schema : null;
		if (!schema) continue;
		const uiHints = normalizeConfigUiHints(rawEntry.uiHints);
		const runtime = isRecord(rawEntry.runtime) && typeof rawEntry.runtime.safeParse === "function" ? rawEntry.runtime : void 0;
		const label = normalizeOptionalString(rawEntry.label) ?? "";
		const description = normalizeOptionalString(rawEntry.description) ?? "";
		const preferOver = normalizeTrimmedStringList(rawEntry.preferOver);
		const commandDefaults = normalizeManifestChannelCommandDefaults(rawEntry.commands);
		normalized[channelId] = {
			schema,
			...uiHints ? { uiHints } : {},
			...runtime ? { runtime } : {},
			...label ? { label } : {},
			...description ? { description } : {},
			...preferOver.length > 0 ? { preferOver } : {},
			...commandDefaults ? { commands: commandDefaults } : {}
		};
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeManifestChannelCommandDefaults(value) {
	if (!isRecord(value)) return;
	const nativeCommandsAutoEnabled = typeof value.nativeCommandsAutoEnabled === "boolean" ? value.nativeCommandsAutoEnabled : void 0;
	const nativeSkillsAutoEnabled = typeof value.nativeSkillsAutoEnabled === "boolean" ? value.nativeSkillsAutoEnabled : void 0;
	return nativeCommandsAutoEnabled !== void 0 || nativeSkillsAutoEnabled !== void 0 ? {
		...nativeCommandsAutoEnabled !== void 0 ? { nativeCommandsAutoEnabled } : {},
		...nativeSkillsAutoEnabled !== void 0 ? { nativeSkillsAutoEnabled } : {}
	} : void 0;
}
//#endregion
//#region packages/gateway-protocol/src/theme-ids.ts
/** Lightweight theme identifiers used while browser preferences boot. */
const BUILTIN_THEME_IDS = [
	"claw",
	"knot",
	"dash",
	"absolutely",
	"tide",
	"beacon",
	"phosphor",
	"crt",
	"manuscript",
	"rose",
	"miami"
];
const THEME_LOCAL_ID_PATTERN = new RegExp(`^[a-z0-9][a-z0-9_-]{0,63}$`);
function isBuiltinThemeId(value) {
	return BUILTIN_THEME_IDS.some((id) => id === value);
}
function isThemeId(value) {
	if (isBuiltinThemeId(value)) return true;
	if (typeof value !== "string" || value.length > 256) return false;
	const separator = value.lastIndexOf("/");
	const owner = value.slice(0, separator);
	return separator > 0 && !owner.startsWith("user/") && /^@?[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*)*$/i.test(owner) && THEME_LOCAL_ID_PATTERN.test(value.slice(separator + 1));
}
//#endregion
//#region packages/gateway-protocol/src/theme.ts
const THEME_COLOR_KEYS = [
	"background",
	"foreground",
	"card",
	"card-foreground",
	"popover",
	"popover-foreground",
	"primary",
	"primary-foreground",
	"secondary",
	"secondary-foreground",
	"muted",
	"muted-foreground",
	"accent",
	"accent-foreground",
	"destructive",
	"destructive-foreground",
	"border",
	"input",
	"ring"
];
const THEME_FONT_KEYS = ["font-sans", "font-mono"];
const THEME_MASCOT_VALUES = ["claw", "none"];
const THEME_CRITTER_IDS = ["penguin", "fedora"];
const THEME_AVATAR_HAT_IDS = [
	"fedora",
	"crown",
	"santa",
	"party",
	"pumpkin"
];
const THEME_ARTWORK_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,31}$/;
const MAX_THEME_DEFINITION_BYTES = 4096;
[
	{
		id: "claw",
		name: "Claw",
		description: "Signature coral red and teal on charcoal or pale surfaces, with Instrument Sans throughout. A balanced everyday workspace."
	},
	{
		id: "knot",
		name: "Knot",
		description: "Crimson accents on true black or clean white, with Geist typography. Sharp, minimal, and high contrast."
	},
	{
		id: "dash",
		name: "Dash",
		description: "Toasted caramel on deep cocoa or warm cream, with DM Sans controls and Fraunces serif chat. Warm and bookish."
	},
	{
		id: "absolutely",
		name: "Absolutely",
		description: "Terracotta clay on warm graphite or soft cream, with Space Grotesk controls and Lora serif chat. Quiet editorial character."
	},
	{
		id: "tide",
		name: "Tide",
		description: "Steel cyan on cool slate or pale blue-gray, with IBM Plex Sans throughout. Calm, technical, and understated."
	},
	{
		id: "beacon",
		name: "Beacon",
		description: "High-visibility amber on black or white, bold focus rings, and Atkinson Hyperlegible typography. Designed for maximum readability."
	},
	{
		id: "phosphor",
		name: "Phosphor",
		description: "Luminous green on green-tinted black or pale green, with JetBrains Mono throughout. A classic green terminal atmosphere."
	},
	{
		id: "crt",
		name: "CRT",
		description: "White phosphor and amber on tube black, with a light counterpart, JetBrains Mono, and nearly square corners. A retro computer console."
	},
	{
		id: "manuscript",
		name: "Manuscript",
		description: "Lapis blue and gold on aged paper, with a dark reading-room variant and Lora serif throughout. A quiet illuminated manuscript."
	},
	{
		id: "rose",
		name: "Rosé",
		description: "Dried rose and gold on deep plum-gray or soft rose-tinted cream, with DM Sans. Gentle, muted, and warm."
	},
	{
		id: "miami",
		name: "Miami",
		description: "Hot magenta and cyan on violet-black or pale lavender, with Space Grotesk. Bright neon energy and a synthwave character."
	}
].map((theme) => ({
	id: theme.id,
	name: theme.name,
	description: theme.description,
	source: "builtin",
	modes: ["light", "dark"]
}));
function requireRecord(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
	return value;
}
function requireKeys(value, allowed, label) {
	const unknown = Object.keys(value).find((key) => !allowed.includes(key));
	if (unknown) throw new Error(`${label} has unsupported field ${unknown}`);
}
function requireText(value, label, maxLength) {
	if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength || Array.from(value).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) throw new Error(`${label} must be nonempty text of at most ${maxLength} characters`);
	return value.trim();
}
const NUMBER = "[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:e[+-]?\\d+)?";
const COMPONENT = `${NUMBER}%?`;
const HUE = `${NUMBER}(?:deg|grad|rad|turn)?`;
const LEGACY_COLOR_FUNCTION = new RegExp(`^(?:(?:rgb|rgba)\\( *(?:${NUMBER} *, *${NUMBER} *, *${NUMBER}|${NUMBER}% *, *${NUMBER}% *, *${NUMBER}%)|(?:hsl|hsla)\\( *${HUE} *, *${NUMBER}% *, *${NUMBER}%)(?: *, *${COMPONENT})? *\\)$`, "i");
const COLOR_FUNCTION = new RegExp(`^(?:(?:rgb|rgba|oklab|lab)\\( *${COMPONENT} +${COMPONENT} +${COMPONENT}|(?:hsl|hsla)\\( *${HUE} +${COMPONENT} +${COMPONENT}|(?:oklch|lch)\\( *${COMPONENT} +${COMPONENT} +${HUE})(?: */ *${COMPONENT})? *\\)$`, "i");
const COLOR_SPACE_FUNCTION = new RegExp(`^color\\( *(?:srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020|xyz|xyz-d50|xyz-d65) +${COMPONENT} +${COMPONENT} +${COMPONENT}(?: */ *${COMPONENT})? *\\)$`, "i");
const FONT_IDENTIFIER = "(?:--[a-z0-9_-]*|-?[a-z_][a-z0-9_-]*)";
const FONT_FAMILY = `(?:"[a-z0-9 ,'._-]*"|'[a-z0-9 ,"._-]*'|${FONT_IDENTIFIER}(?: +${FONT_IDENTIFIER})*)`;
const FONT_FAMILY_LIST = new RegExp(`^${FONT_FAMILY}(?: *, *${FONT_FAMILY})*$`, "i");
const CSS_WIDE_KEYWORDS = /* @__PURE__ */ new Set([
	"inherit",
	"initial",
	"unset",
	"revert",
	"revert-layer"
]);
const GENERIC_FONT_FAMILIES = /* @__PURE__ */ new Set([
	"serif",
	"sans-serif",
	"monospace",
	"cursive",
	"fantasy",
	"system-ui",
	"ui-serif",
	"ui-sans-serif",
	"ui-monospace",
	"ui-rounded",
	"emoji",
	"math",
	"fangsong",
	"-webkit-body"
]);
function isFontFamilyList(value) {
	if (!FONT_FAMILY_LIST.test(value)) return false;
	return value.replace(/"[^"]*"|'[^']*'/g, "").split(",").every((family) => {
		const words = family.trim().toLowerCase().split(/ +/);
		return words.every((word) => !CSS_WIDE_KEYWORDS.has(word) && word !== "default" && (words.length === 1 || !GENERIC_FONT_FAMILIES.has(word)));
	});
}
function requireColor(value, label) {
	const color = requireText(value, label, 120);
	if (!/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color) && !/^(?:transparent|black|white)$/i.test(color) && !LEGACY_COLOR_FUNCTION.test(color) && !COLOR_FUNCTION.test(color) && !COLOR_SPACE_FUNCTION.test(color)) throw new Error(`${label} must be a hex, rgb, hsl, lab, lch, oklab, oklch, or color() color`);
	return color;
}
function normalizePalette(value, mode) {
	const palette = requireRecord(value, `theme.${mode}`);
	requireKeys(palette, [...THEME_COLOR_KEYS, ...THEME_FONT_KEYS], `theme.${mode}`);
	const entries = THEME_COLOR_KEYS.map((key) => [key, requireColor(palette[key], `theme.${mode}.${key}`)]);
	const result = { ...Object.fromEntries(entries) };
	for (const key of THEME_FONT_KEYS) {
		if (palette[key] === void 0) continue;
		const font = requireText(palette[key], `theme.${mode}.${key}`, 120);
		if (!isFontFamilyList(font)) throw new Error(`theme.${mode}.${key} must contain only font family names`);
		result[key] = font;
	}
	return result;
}
/** Rejects executable CSS and incomplete palettes before they reach storage or a stylesheet. */
function normalizeThemeDefinition(input, options) {
	const record = requireRecord(input, "theme");
	requireKeys(record, [
		"name",
		"description",
		"mascot",
		"workingPhrases",
		"critters",
		"avatarHat",
		"light",
		"dark"
	], "theme");
	const definition = {
		name: requireText(record.name, "theme.name", 80),
		description: requireText(record.description, "theme.description", 320),
		...record.light !== void 0 ? { light: normalizePalette(record.light, "light") } : {},
		...record.dark !== void 0 ? { dark: normalizePalette(record.dark, "dark") } : {}
	};
	if (record.mascot !== void 0) {
		const mascot = THEME_MASCOT_VALUES.find((candidate) => candidate === record.mascot);
		if (!mascot) throw new Error(`theme.mascot must be one of ${THEME_MASCOT_VALUES.join(", ")}`);
		definition.mascot = mascot;
	}
	if (record.workingPhrases !== void 0) {
		if (!Array.isArray(record.workingPhrases) || record.workingPhrases.length > 24) throw new Error(`theme.workingPhrases must be an array of at most 24 entries`);
		const phrases = Array.from(record.workingPhrases, (phrase, index) => requireText(phrase, `theme.workingPhrases[${index}]`, 24));
		if (new Set(phrases).size !== phrases.length) throw new Error("theme.workingPhrases must not contain duplicate entries after trimming");
		definition.workingPhrases = phrases;
	}
	if (record.critters !== void 0) {
		if (!Array.isArray(record.critters) || record.critters.length > 8) throw new Error("theme.critters must be an array of at most 8 entries");
		const allowedIds = [...THEME_CRITTER_IDS, ...options?.critterIds ?? []];
		const critters = Array.from(record.critters, (entry, index) => {
			const critter = allowedIds.find((id) => id === entry);
			if (!critter) throw new Error(`theme.critters[${index}] must be one of ${allowedIds.join(", ")}`);
			return critter;
		});
		if (new Set(critters).size !== critters.length) throw new Error("theme.critters must not contain duplicate entries");
		definition.critters = critters;
	}
	if (record.avatarHat !== void 0) {
		const allowedIds = [...THEME_AVATAR_HAT_IDS, ...options?.hatIds ?? []];
		const avatarHat = allowedIds.find((id) => id === record.avatarHat);
		if (!avatarHat) throw new Error(`theme.avatarHat must be one of ${allowedIds.join(", ")}`);
		definition.avatarHat = avatarHat;
	}
	if (!definition.light && !definition.dark) throw new Error("theme must provide at least one light or dark palette");
	if (new TextEncoder().encode(JSON.stringify(definition)).length > 4096) throw new Error(`theme definition exceeds ${MAX_THEME_DEFINITION_BYTES} bytes`);
	return definition;
}
//#endregion
//#region src/plugins/manifest-themes.ts
const MAX_PLUGIN_THEMES = 32;
const MAX_THEME_ARTWORK_ENTRIES = 8;
function objectProperties(value) {
	return value.type === "ObjectExpression" ? value.properties.filter((property) => property.type === "Property") : [];
}
function propertyName(property) {
	return property.key.type === "Identifier" ? property.key.name : property.key.type === "Literal" ? String(property.key.value) : "";
}
function validateArtworkDuplicates(source) {
	const { parseExpressionAt } = createRequire(import.meta.url)("acorn");
	const root = parseExpressionAt(`(${source}\n)`, 0, { ecmaVersion: "latest" });
	for (const property of objectProperties(root)) {
		if (propertyName(property) !== "themes" || property.value.type !== "ArrayExpression") continue;
		for (const theme of property.value.elements) {
			if (!theme || theme.type !== "ObjectExpression") continue;
			for (const artwork of objectProperties(theme)) {
				const kind = propertyName(artwork);
				if (kind !== "hats" && kind !== "critters") continue;
				const ids = /* @__PURE__ */ new Set();
				for (const entry of objectProperties(artwork.value)) {
					const id = propertyName(entry);
					if (ids.has(id)) throw new Error(`themes.${kind} has duplicate artwork ID ${id}`);
					ids.add(id);
				}
			}
		}
	}
}
function normalizeArtworkEntries(value, label, catalogIds) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be a map with at most ${MAX_THEME_ARTWORK_ENTRIES} entries`);
	const entries = Object.entries(value);
	if (entries.length > MAX_THEME_ARTWORK_ENTRIES) throw new Error(`${label} must be a map with at most ${MAX_THEME_ARTWORK_ENTRIES} entries`);
	for (const [id] of entries) if (!THEME_ARTWORK_ID_PATTERN.test(id) || catalogIds.includes(id)) throw new Error(`${label}.${id} must use a safe local ID outside the built-in catalog`);
	return entries;
}
function normalizeArtworkPath(value, label) {
	const relativePath = typeof value === "string" ? value.replace(/^\.\//, "") : "";
	if (!/^(?:[a-z0-9_-][a-z0-9._-]*\/)*[a-z0-9_-][a-z0-9._-]*\.svg$/i.test(relativePath)) throw new Error(`${label} must be an SVG file inside the plugin root`);
	return relativePath;
}
function normalizeArtwork(hats, critters, label) {
	return {
		...hats !== void 0 ? { hats: Object.fromEntries(normalizeArtworkEntries(hats, `${label}.hats`, THEME_AVATAR_HAT_IDS).map(([id, source]) => [id, normalizeArtworkPath(source, `${label}.hats.${id}`)])) } : {},
		...critters !== void 0 ? { critters: Object.fromEntries(normalizeArtworkEntries(critters, `${label}.critters`, THEME_CRITTER_IDS).map(([id, metadata]) => {
			const entryLabel = `${label}.critters.${id}`;
			if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) throw new Error(`${entryLabel} must be an object with an SVG source`);
			const { source, title, crossMs } = metadata;
			if (Object.keys(metadata).some((key) => ![
				"source",
				"title",
				"crossMs"
			].includes(key))) throw new Error(`${entryLabel} has unsupported fields`);
			if (title !== void 0 && (typeof title !== "string" || title.length > 60 || /[\p{Cc}\p{Cf}\p{Cs}]/u.test(title))) throw new Error(`${entryLabel}.title must be at most 60 printable characters`);
			if (crossMs !== void 0 && (typeof crossMs !== "number" || !Number.isInteger(crossMs) || crossMs < 5e3 || crossMs > 9e4)) throw new Error(`${entryLabel}.crossMs must be an integer from 5000 to 90000`);
			return [id, {
				source: normalizeArtworkPath(source, `${entryLabel}.source`),
				...title !== void 0 ? { title } : {},
				...crossMs !== void 0 ? { crossMs } : {}
			}];
		})) } : {}
	};
}
function normalizeManifestThemes(value, pluginId, manifestSource) {
	if (value === void 0) return { ok: true };
	if (!Array.isArray(value) || value.length > MAX_PLUGIN_THEMES) return {
		ok: false,
		error: `themes must be an array with at most ${MAX_PLUGIN_THEMES} entries`
	};
	if (value.length && (pluginId === "user" || !isThemeId(`${pluginId}/x`))) return {
		ok: false,
		error: "themes require a portable plugin ID outside the reserved user namespace"
	};
	const themes = [];
	const ids = /* @__PURE__ */ new Set();
	for (const [index, entry] of value.entries()) {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) return {
			ok: false,
			error: `themes[${index}] must be an object`
		};
		const { id, name, description, source, hats, critters } = entry;
		if (Object.keys(entry).some((key) => ![
			"id",
			"name",
			"description",
			"source",
			"hats",
			"critters"
		].includes(key)) || typeof id !== "string" || !THEME_LOCAL_ID_PATTERN.test(id) || ids.has(id) || typeof name !== "string" || !name.trim() || name.trim().length > 80 || typeof description !== "string" || !description.trim() || description.trim().length > 320 || Array.from(name + description).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127) || typeof source !== "string") return {
			ok: false,
			error: `themes[${index}] requires a unique safe id, name, description, and JSON source`
		};
		const relativePath = source.replace(/^\.\//, "");
		if (!/^(?:[a-z0-9_-][a-z0-9._-]*\/)*[a-z0-9_-][a-z0-9._-]*\.json$/i.test(relativePath)) return {
			ok: false,
			error: `themes[${index}].source must be a JSON file inside the plugin root`
		};
		try {
			themes.push({
				id,
				name: name.trim(),
				description: description.trim(),
				source: relativePath,
				...normalizeArtwork(hats, critters, `themes[${index}]`)
			});
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : "invalid theme artwork"
			};
		}
		ids.add(id);
	}
	if (manifestSource && themes.some((theme) => theme.hats || theme.critters)) try {
		validateArtworkDuplicates(manifestSource);
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : "invalid theme artwork"
		};
	}
	return {
		ok: true,
		themes
	};
}
//#endregion
//#region src/plugins/manifest.ts
/** Loads and normalizes OpenClaw plugin manifests, including contracts and config schemas. */
/** Canonical plugin manifest filename inside plugin roots. */
const PLUGIN_MANIFEST_FILENAME = "openclaw.plugin.json";
const MAX_PLUGIN_MANIFEST_BYTES = 262144;
const CORE_RESERVED_PLUGIN_IDS = /* @__PURE__ */ new Set(["node-mcp"]);
const VALID_PLUGIN_KINDS = /* @__PURE__ */ new Set(["memory", "context-engine"]);
function isCoreReservedPluginId(id) {
	return CORE_RESERVED_PLUGIN_IDS.has(normalizePluginPolicyId(id));
}
function parsePluginKind(raw) {
	const values = typeof raw === "string" ? [raw] : Array.isArray(raw) ? raw : [];
	const kinds = [];
	for (const value of values) {
		if (typeof value !== "string" || !VALID_PLUGIN_KINDS.has(value)) continue;
		const kind = value;
		if (!kinds.includes(kind)) kinds.push(kind);
	}
	return kinds.length === 0 ? void 0 : kinds.length === 1 ? kinds[0] : kinds;
}
function parseDoctorStateMigrationDescriptors(raw) {
	if (typeof raw === "boolean") return raw;
	if (!Array.isArray(raw)) return;
	const seen = /* @__PURE__ */ new Set();
	return raw.flatMap((value) => {
		if (!isRecord(value)) return [];
		const id = normalizeOptionalString(value.id);
		if (!id || seen.has(id)) return [];
		seen.add(id);
		return [{
			id,
			...value.doctorOnly === true ? { doctorOnly: true } : {},
			...value.phase === "after-session-repair" ? { phase: "after-session-repair" } : {}
		}];
	});
}
function parseManifestBackupResources(raw) {
	if (raw === void 0) return { ok: true };
	if (!Array.isArray(raw)) return {
		ok: false,
		error: "backupResources must be an array"
	};
	const resources = /* @__PURE__ */ new Map();
	for (const [index, entry] of raw.entries()) {
		if (!isRecord(entry) || Object.keys(entry).length !== 3 || !("disposition" in entry) || !("scope" in entry) || !("relativePath" in entry)) return {
			ok: false,
			error: `backupResources[${index}] must contain only disposition, scope, and relativePath`
		};
		const { disposition, scope, relativePath } = entry;
		if (disposition !== "include" && disposition !== "regenerable") return {
			ok: false,
			error: `backupResources[${index}].disposition is invalid`
		};
		if (scope !== "state" && scope !== "agent") return {
			ok: false,
			error: `backupResources[${index}].scope is invalid`
		};
		if (typeof relativePath !== "string" || !relativePath || relativePath.includes("\\") || relativePath.includes("\0") || path.posix.isAbsolute(relativePath) || path.win32.isAbsolute(relativePath) || /^[A-Za-z][A-Za-z\d+.-]*:/.test(relativePath) || relativePath.split("/").some((segment) => !segment || segment === "." || segment === "..")) return {
			ok: false,
			error: `backupResources[${index}].relativePath must be a strict relative POSIX path`
		};
		const resource = {
			disposition,
			scope,
			relativePath
		};
		resources.set(`${scope}\0${relativePath}\0${disposition}`, resource);
	}
	return {
		ok: true,
		resources: [...resources.entries()].toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([, resource]) => resource)
	};
}
function loadPluginManifest(rootDir, rejectHardlinks = true, rootRealPath) {
	const file = readPluginCacheFile({
		rootDir,
		relativePath: PLUGIN_MANIFEST_FILENAME,
		...rootRealPath !== void 0 ? { rootRealPath } : {},
		maxBytes: MAX_PLUGIN_MANIFEST_BYTES,
		rejectHardlinks
	});
	const manifestPath = file.ok ? file.path : path.join(rootDir, PLUGIN_MANIFEST_FILENAME);
	if (!file.ok) return matchRootFileOpenFailure(file.failure, {
		path: () => ({
			ok: false,
			error: `plugin manifest not found: ${manifestPath}`,
			manifestPath
		}),
		fallback: (failure) => ({
			ok: false,
			error: `unsafe plugin manifest path: ${manifestPath} (${failure.reason})`,
			manifestPath
		})
	});
	if (file.manifest) return file.manifest;
	const cacheResult = (result) => {
		return file.manifest = result;
	};
	const parsed = parsePluginCacheJson(file, { json5: true });
	if (!parsed.ok) return cacheResult({
		ok: false,
		error: `failed to parse plugin manifest: ${String(parsed.error)}`,
		manifestPath
	});
	const raw = parsed.value;
	if (!isRecord(raw)) return cacheResult({
		ok: false,
		error: "plugin manifest must be an object",
		manifestPath
	});
	const id = normalizeOptionalString(raw.id) ?? "";
	if (!id) return cacheResult({
		ok: false,
		error: "plugin manifest requires id",
		manifestPath
	});
	if (isCoreReservedPluginId(id)) return cacheResult({
		ok: false,
		error: `plugin manifest id "${id}" is reserved by OpenClaw core`,
		manifestPath
	});
	const configSchema = isRecord(raw.configSchema) ? raw.configSchema : null;
	if (!configSchema) return cacheResult({
		ok: false,
		error: "plugin manifest requires configSchema",
		manifestPath
	});
	const backupResources = parseManifestBackupResources(raw.backupResources);
	if (!backupResources.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest backupResources: ${backupResources.error}`,
		manifestPath,
		diagnosticCode: "backup-resource-declaration-invalid"
	});
	const categories = validatePluginCategories(raw.categories);
	if (!categories.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest categories: ${categories.error}`,
		manifestPath
	});
	const requiresPlugins = normalizeTrimmedStringList(raw.requiresPlugins);
	const enabledByDefaultOnPlatforms = normalizeManifestPlatforms(raw.enabledByDefaultOnPlatforms);
	const legacyPluginIds = normalizeTrimmedStringList(raw.legacyPluginIds);
	const autoEnableWhenConfiguredProviders = normalizeTrimmedStringList(raw.autoEnableWhenConfiguredProviders);
	const providers = normalizeTrimmedStringList(raw.providers);
	const channels = normalizeTrimmedStringList(raw.channels);
	const contracts = normalizeManifestContracts(raw.contracts);
	const cliBackends = normalizeTrimmedStringList(raw.cliBackends);
	const rawDoctorContract = isRecord(raw.doctorContract) ? raw.doctorContract : void 0;
	const stateMigrations = parseDoctorStateMigrationDescriptors(rawDoctorContract?.stateMigrations);
	const doctorContract = rawDoctorContract ? {
		...Object.fromEntries([
			"configRepair",
			"resolveSessionStoreAgentIds",
			"sessionRouteStateOwners"
		].flatMap((key) => typeof rawDoctorContract[key] === "boolean" ? [[key, rawDoctorContract[key]]] : [])),
		...stateMigrations !== void 0 ? { stateMigrations } : {}
	} : void 0;
	const manifestBeforeDashboard = {
		id,
		configSchema,
		..."categories" in categories ? { categories: categories.categories } : {},
		...backupResources.resources !== void 0 ? { backupResources: backupResources.resources } : {},
		...requiresPlugins.length > 0 ? { requiresPlugins } : {},
		...raw.enabledByDefault === true ? { enabledByDefault: true } : {},
		...enabledByDefaultOnPlatforms.length > 0 ? { enabledByDefaultOnPlatforms } : {},
		...legacyPluginIds.length > 0 ? { legacyPluginIds } : {},
		...autoEnableWhenConfiguredProviders.length > 0 ? { autoEnableWhenConfiguredProviders } : {},
		kind: parsePluginKind(raw.kind),
		channels,
		channelAccountKeyPolicies: normalizeChannelAccountKeyPolicies(raw.channelAccountKeyPolicies, channels),
		providers,
		providerCatalogEntry: normalizeOptionalString(raw.providerCatalogEntry),
		capabilityCatalogEntry: raw.capabilityCatalogEntry === void 0 ? void 0 : normalizeOptionalString(raw.capabilityCatalogEntry) ?? "",
		modelSupport: normalizeManifestModelSupport(raw.modelSupport),
		modelCatalog: normalizeModelCatalog(raw.modelCatalog, { ownedProviders: /* @__PURE__ */ new Set([...providers, ...cliBackends]) }),
		modelPricing: normalizeManifestModelPricing(raw.modelPricing, { ownedProviders: new Set(providers) }),
		modelIdNormalization: normalizeManifestModelIdNormalization(raw.modelIdNormalization, { ownedProviders: new Set(providers) }),
		providerEndpoints: normalizeManifestProviderEndpoints(raw.providerEndpoints),
		providerRequest: normalizeManifestProviderRequest(raw.providerRequest, { ownedProviders: new Set(providers) }),
		secretProviderIntegrations: normalizeManifestSecretProviderIntegrations(raw.secretProviderIntegrations),
		cliBackends,
		syntheticAuthRefs: normalizeTrimmedStringList(raw.syntheticAuthRefs),
		nonSecretAuthMarkers: normalizeTrimmedStringList(raw.nonSecretAuthMarkers),
		commandAliases: normalizeManifestCommandAliases(raw.commandAliases),
		cliCommands: normalizeManifestCliCommands(raw.cliCommands),
		providerUsageAuthEnvVars: normalizeStringListRecord(raw.providerUsageAuthEnvVars),
		providerAuthAliases: normalizeManifestProviderAuthAliases(raw.providerAuthAliases),
		providerAuthChoices: normalizeProviderAuthChoices(raw.providerAuthChoices),
		activation: normalizeManifestActivation(raw.activation),
		setup: normalizeManifestSetup(raw.setup),
		doctorContract,
		doctorHealthChecks: raw.doctorHealthChecks === true ? true : void 0,
		sessionRouteStateOwners: raw.sessionRouteStateOwners === void 0 ? void 0 : coerceDoctorSessionRouteStateOwners(raw.sessionRouteStateOwners),
		qaRunners: normalizeManifestQaRunners(raw.qaRunners)
	};
	const dashboardResult = normalizeManifestDashboard(raw.dashboard);
	if (!dashboardResult.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest dashboard: ${dashboardResult.error}`,
		manifestPath
	});
	const controlUiResult = normalizeManifestControlUi(raw.controlUi);
	if (!controlUiResult.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest controlUi: ${controlUiResult.error}`,
		manifestPath
	});
	const themesResult = normalizeManifestThemes(raw.themes, id, file.contents.toString("utf8"));
	if (!themesResult.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest themes: ${themesResult.error}`,
		manifestPath
	});
	return cacheResult({
		ok: true,
		manifest: {
			...manifestBeforeDashboard,
			dashboard: dashboardResult.dashboard,
			controlUi: controlUiResult.value,
			themes: themesResult.themes,
			mcpServers: normalizeManifestMcpServers(raw.mcpServers),
			skills: normalizeTrimmedStringList(raw.skills),
			name: normalizeOptionalString(raw.name),
			description: normalizeOptionalString(raw.description),
			catalog: normalizeManifestCatalog(raw.catalog),
			version: normalizeOptionalString(raw.version),
			uiHints: normalizeConfigUiHints(raw.uiHints),
			configGroups: normalizeConfigGroups(raw.configGroups, configSchema),
			contracts,
			decisionModels: normalizeManifestDecisionModels(raw.decisionModels, contracts?.decisionProviders),
			transcriptSources: normalizeManifestTranscriptSources(raw.transcriptSources, contracts?.transcriptSourceProviders),
			mediaUnderstandingProviderMetadata: normalizeMediaUnderstandingProviderMetadata(raw.mediaUnderstandingProviderMetadata),
			imageGenerationProviderMetadata: normalizeCapabilityProviderMetadata(raw.imageGenerationProviderMetadata),
			videoGenerationProviderMetadata: normalizeCapabilityProviderMetadata(raw.videoGenerationProviderMetadata),
			musicGenerationProviderMetadata: normalizeCapabilityProviderMetadata(raw.musicGenerationProviderMetadata),
			toolMetadata: normalizePluginToolMetadata(raw.toolMetadata),
			configContracts: normalizeManifestConfigContracts(raw.configContracts),
			channelConfigs: normalizeChannelConfigs(raw.channelConfigs)
		},
		manifestPath
	});
}
//#endregion
//#region src/plugins/bundle-manifest.ts
/** Reads Agent/Codex/Claude/Cursor bundle manifests into OpenClaw plugin manifest metadata. */
/** Relative manifest path for Codex-style plugin bundles. */
const CODEX_BUNDLE_MANIFEST_RELATIVE_PATH = ".codex-plugin/plugin.json";
const CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH = ".claude-plugin/plugin.json";
const CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH = ".cursor-plugin/plugin.json";
const AGENT_BUNDLE_MANIFEST_RELATIVE_PATH = "plugin.json";
const AGENT_BUNDLE_EXTENSION_NAMESPACE = "ai.openclaw";
const AGENT_BUNDLE_MANIFEST_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";
const MAX_AGENT_BUNDLE_MANIFEST_BYTES = 262144;
const log$1 = createSubsystemLogger("plugins/bundle-manifest");
/** Normalizes string-or-list path fields from bundle manifests. */
function normalizeBundlePathList(value) {
	return normalizeUniqueSingleOrTrimmedStringList(value);
}
function mergeBundlePathLists(...groups) {
	const merged = [];
	const seen = /* @__PURE__ */ new Set();
	for (const group of groups) for (const entry of group) {
		if (seen.has(entry)) continue;
		seen.add(entry);
		merged.push(entry);
	}
	return merged;
}
function hasInlineCapabilityValue(value) {
	if (typeof value === "string") return value.trim().length > 0;
	if (Array.isArray(value)) return value.length > 0;
	if (isRecord(value)) return Object.keys(value).length > 0;
	return value === true;
}
function slugifyPluginId(raw, rootDir) {
	const fallback = path.basename(rootDir);
	return (normalizeLowercaseStringOrEmpty(raw) || normalizeLowercaseStringOrEmpty(fallback)).replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") || "bundle-plugin";
}
function loadBundleManifestFile(params) {
	const manifestPath = path.join(params.rootDir, params.manifestRelativePath);
	const file = readPluginCacheFile({
		rootDir: params.rootDir,
		rootRealPath: params.rootRealPath,
		relativePath: params.manifestRelativePath,
		rejectHardlinks: params.rejectHardlinks,
		maxBytes: params.maxBytes ?? MAX_AGENT_BUNDLE_MANIFEST_BYTES
	});
	if (!file.ok) return matchRootFileOpenFailure(file.failure, {
		path: () => {
			if (params.allowMissing) return {
				ok: true,
				raw: {},
				manifestPath
			};
			return {
				ok: false,
				error: `plugin manifest not found: ${manifestPath}`,
				manifestPath
			};
		},
		fallback: (failure) => ({
			ok: false,
			error: `unsafe plugin manifest path: ${manifestPath} (${failure.reason})`,
			manifestPath
		})
	});
	const result = parsePluginCacheJson(file, { json5: !params.strictJson });
	if (!result.ok) return {
		ok: false,
		error: `failed to parse plugin manifest: ${formatErrorMessage(result.error)}`,
		manifestPath
	};
	if (!isRecord(result.value)) return {
		ok: false,
		error: "plugin manifest must be an object",
		manifestPath
	};
	return {
		ok: true,
		raw: result.value,
		manifestPath
	};
}
function resolveCodexSkillDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.skills);
	if (declared.length > 0) return declared;
	return pluginCacheExistsSync(path.join(rootDir, "skills")) ? ["skills"] : [];
}
function resolveCodexHookDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.hooks);
	if (declared.length > 0) return declared;
	return pluginCacheExistsSync(path.join(rootDir, "hooks")) ? ["hooks"] : [];
}
function resolveCursorSkillsRootDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.skills);
	return mergeBundlePathLists(pluginCacheExistsSync(path.join(rootDir, "skills")) ? ["skills"] : [], declared);
}
function resolveCursorCommandRootDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.commands);
	return mergeBundlePathLists(pluginCacheExistsSync(path.join(rootDir, ".cursor", "commands")) ? [".cursor/commands"] : [], declared);
}
function resolveCursorSkillDirs(raw, rootDir) {
	return mergeBundlePathLists(resolveCursorSkillsRootDirs(raw, rootDir), resolveCursorCommandRootDirs(raw, rootDir));
}
function resolveCursorAgentDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.subagents ?? raw.agents);
	return mergeBundlePathLists(pluginCacheExistsSync(path.join(rootDir, ".cursor", "agents")) ? [".cursor/agents"] : [], declared);
}
function hasCursorHookCapability(raw, rootDir) {
	return hasInlineCapabilityValue(raw.hooks) || pluginCacheExistsSync(path.join(rootDir, ".cursor", "hooks.json"));
}
function hasCursorRulesCapability(raw, rootDir) {
	return hasInlineCapabilityValue(raw.rules) || pluginCacheExistsSync(path.join(rootDir, ".cursor", "rules"));
}
function hasCursorMcpCapability(raw, rootDir) {
	return hasInlineCapabilityValue(raw.mcpServers) || pluginCacheExistsSync(path.join(rootDir, ".mcp.json"));
}
function resolveClaudeComponentPaths(raw, key, rootDir, defaults) {
	const declared = normalizeBundlePathList(raw[key]);
	return mergeBundlePathLists(defaults.filter((candidate) => pluginCacheExistsSync(path.join(rootDir, candidate))), declared);
}
function buildCodexCapabilities(raw, rootDir) {
	const capabilities = [];
	if (resolveCodexSkillDirs(raw, rootDir).length > 0) capabilities.push("skills");
	if (resolveCodexHookDirs(raw, rootDir).length > 0) capabilities.push("hooks");
	if (hasInlineCapabilityValue(raw.mcpServers) || pluginCacheExistsSync(path.join(rootDir, ".mcp.json"))) capabilities.push("mcpServers");
	if (hasInlineCapabilityValue(raw.apps) || pluginCacheExistsSync(path.join(rootDir, ".app.json"))) capabilities.push("apps");
	return capabilities;
}
function buildCursorCapabilities(raw, rootDir) {
	const capabilities = [];
	if (resolveCursorSkillDirs(raw, rootDir).length > 0) capabilities.push("skills");
	if (resolveCursorCommandRootDirs(raw, rootDir).length > 0) capabilities.push("commands");
	if (resolveCursorAgentDirs(raw, rootDir).length > 0) capabilities.push("agents");
	if (hasCursorHookCapability(raw, rootDir)) capabilities.push("hooks");
	if (hasCursorRulesCapability(raw, rootDir)) capabilities.push("rules");
	if (hasCursorMcpCapability(raw, rootDir)) capabilities.push("mcpServers");
	return capabilities;
}
function resolveAgentSkillDirs(rootDir) {
	try {
		return pluginCacheStatSync(path.join(rootDir, "skills"))?.isDirectory() ? ["skills"] : [];
	} catch {
		return [];
	}
}
function buildAgentCapabilities(rootDir) {
	const capabilities = [];
	if (resolveAgentSkillDirs(rootDir).length > 0) capabilities.push("skills");
	if (pluginCacheExistsSync(path.join(rootDir, "mcp.json"))) capabilities.push("mcpServers");
	return capabilities;
}
function resolveAgentActivation(raw, manifestPath) {
	if (raw.extensions === void 0) return;
	if (!isRecord(raw.extensions)) {
		log$1.warn(`ignoring Agent Plugins extensions in ${manifestPath}: expected an object`);
		return;
	}
	const openclawExtension = raw.extensions[AGENT_BUNDLE_EXTENSION_NAMESPACE];
	if (openclawExtension === void 0) return;
	if (!isRecord(openclawExtension)) {
		log$1.warn(`ignoring Agent Plugins ${AGENT_BUNDLE_EXTENSION_NAMESPACE} extension in ${manifestPath}: expected an object`);
		return;
	}
	return normalizeManifestActivation(openclawExtension.activation);
}
function loadBundleManifest(params) {
	const rejectHardlinks = params.rejectHardlinks ?? true;
	const manifestRelativePath = params.bundleFormat === "codex" ? CODEX_BUNDLE_MANIFEST_RELATIVE_PATH : params.bundleFormat === "cursor" ? CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH : params.bundleFormat === "agent" ? AGENT_BUNDLE_MANIFEST_RELATIVE_PATH : CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH;
	const loaded = loadBundleManifestFile({
		rootDir: params.rootDir,
		...params.rootRealPath !== void 0 ? { rootRealPath: params.rootRealPath } : {},
		manifestRelativePath,
		rejectHardlinks,
		allowMissing: params.bundleFormat === "claude",
		strictJson: params.bundleFormat === "agent",
		...params.bundleFormat === "agent" ? { maxBytes: MAX_AGENT_BUNDLE_MANIFEST_BYTES } : {}
	});
	if (!loaded.ok) return loaded;
	const raw = loaded.raw;
	const interfaceRecord = isRecord(raw.interface) ? raw.interface : void 0;
	const name = normalizeOptionalString(raw.name);
	const description = normalizeOptionalString(raw.description) ?? normalizeOptionalString(raw.shortDescription) ?? normalizeOptionalString(interfaceRecord?.shortDescription);
	const version = normalizeOptionalString(raw.version);
	if (params.bundleFormat === "agent") {
		if (raw.$schema !== AGENT_BUNDLE_MANIFEST_SCHEMA) return {
			ok: false,
			error: `root plugin.json is not an Agent Plugins manifest; expected $schema ${AGENT_BUNDLE_MANIFEST_SCHEMA}`,
			manifestPath: loaded.manifestPath
		};
		if (!name) return {
			ok: false,
			error: "agent plugin manifest name must be a non-empty string",
			manifestPath: loaded.manifestPath
		};
		return {
			ok: true,
			manifest: {
				id: slugifyPluginId(name, params.rootDir),
				name,
				description,
				version,
				skills: resolveAgentSkillDirs(params.rootDir),
				settingsFiles: [],
				hooks: [],
				bundleFormat: "agent",
				activation: resolveAgentActivation(raw, loaded.manifestPath),
				capabilities: buildAgentCapabilities(params.rootDir)
			},
			manifestPath: loaded.manifestPath
		};
	}
	if (params.bundleFormat === "codex") {
		const skills = resolveCodexSkillDirs(raw, params.rootDir);
		const hooks = resolveCodexHookDirs(raw, params.rootDir);
		return {
			ok: true,
			manifest: {
				id: slugifyPluginId(name, params.rootDir),
				name,
				description,
				version,
				skills,
				settingsFiles: [],
				hooks,
				bundleFormat: "codex",
				activation: normalizeManifestActivation(raw.activation),
				capabilities: buildCodexCapabilities(raw, params.rootDir)
			},
			manifestPath: loaded.manifestPath
		};
	}
	if (params.bundleFormat === "cursor") return {
		ok: true,
		manifest: {
			id: slugifyPluginId(name, params.rootDir),
			name,
			description,
			version,
			skills: resolveCursorSkillDirs(raw, params.rootDir),
			settingsFiles: [],
			hooks: [],
			bundleFormat: "cursor",
			activation: normalizeManifestActivation(raw.activation),
			capabilities: buildCursorCapabilities(raw, params.rootDir)
		},
		manifestPath: loaded.manifestPath
	};
	const id = slugifyPluginId(name, params.rootDir);
	const skillRoots = resolveClaudeComponentPaths(raw, "skills", params.rootDir, ["skills"]);
	const commands = resolveClaudeComponentPaths(raw, "commands", params.rootDir, ["commands"]);
	const agents = resolveClaudeComponentPaths(raw, "agents", params.rootDir, ["agents"]);
	const outputStyles = resolveClaudeComponentPaths(raw, "outputStyles", params.rootDir, ["output-styles"]);
	const skills = mergeBundlePathLists(skillRoots, commands, agents, outputStyles);
	const settingsFiles = pluginCacheExistsSync(path.join(params.rootDir, "settings.json")) ? ["settings.json"] : [];
	const hooks = resolveClaudeComponentPaths(raw, "hooks", params.rootDir, ["hooks/hooks.json"]);
	const activation = normalizeManifestActivation(raw.activation);
	const capabilities = [];
	if (skills.length > 0) capabilities.push("skills");
	if (commands.length > 0) capabilities.push("commands");
	if (agents.length > 0) capabilities.push("agents");
	if (hasInlineCapabilityValue(raw.hooks) || hooks.length > 0) capabilities.push("hooks");
	if (hasInlineCapabilityValue(raw.mcpServers) || resolveClaudeComponentPaths(raw, "mcpServers", params.rootDir, [".mcp.json"]).length > 0) capabilities.push("mcpServers");
	if (hasInlineCapabilityValue(raw.lspServers) || resolveClaudeComponentPaths(raw, "lspServers", params.rootDir, [".lsp.json"]).length > 0) capabilities.push("lspServers");
	if (hasInlineCapabilityValue(raw.outputStyles) || outputStyles.length > 0) capabilities.push("outputStyles");
	if (settingsFiles.length > 0) capabilities.push("settings");
	return {
		ok: true,
		manifest: {
			id,
			name,
			description,
			version,
			skills,
			settingsFiles,
			hooks,
			bundleFormat: "claude",
			activation,
			capabilities
		},
		manifestPath: loaded.manifestPath
	};
}
function detectBundleManifestFormat(rootDir, hasPackageExtensions = false) {
	if (hasPackageExtensions && pluginCacheExistsSync(path.join(rootDir, "openclaw.plugin.json"))) return null;
	if (pluginCacheExistsSync(path.join(rootDir, ".codex-plugin/plugin.json"))) return "codex";
	if (pluginCacheExistsSync(path.join(rootDir, ".cursor-plugin/plugin.json"))) return "cursor";
	if (pluginCacheExistsSync(path.join(rootDir, ".claude-plugin/plugin.json"))) return "claude";
	if (pluginCacheExistsSync(path.join(rootDir, "openclaw.plugin.json"))) return null;
	if (pluginCacheExistsSync(path.join(rootDir, "plugin.json"))) {
		const agentManifest = loadBundleManifestFile({
			rootDir,
			manifestRelativePath: AGENT_BUNDLE_MANIFEST_RELATIVE_PATH,
			rejectHardlinks: false,
			strictJson: true,
			maxBytes: MAX_AGENT_BUNDLE_MANIFEST_BYTES
		});
		if (agentManifest.ok && agentManifest.raw.$schema === AGENT_BUNDLE_MANIFEST_SCHEMA) return "agent";
	}
	if (DEFAULT_PLUGIN_ENTRY_CANDIDATES.some((candidate) => pluginCacheExistsSync(path.join(rootDir, candidate)))) return null;
	if ([
		path.join(rootDir, "skills"),
		path.join(rootDir, "commands"),
		path.join(rootDir, "agents"),
		path.join(rootDir, "hooks", "hooks.json"),
		path.join(rootDir, ".mcp.json"),
		path.join(rootDir, ".lsp.json"),
		path.join(rootDir, "settings.json")
	].some((candidate) => pluginCacheExistsSync(candidate))) return "claude";
	return null;
}
//#endregion
//#region src/plugins/runtime-degraded-state.ts
/** Boot-stable quarantine state for configured plugins whose payload failed verification. */
const PLUGIN_AVAILABILITY_POLICY = {
	state: "configured-unavailable",
	severity: "warning",
	repairCommand: "openclaw doctor --fix"
};
//#endregion
//#region src/plugins/discovery-availability.ts
const CONFIGURED_PLUGIN_PATH_UNAVAILABLE = "configured-plugin-path-unavailable";
const CONFIGURED_PLUGIN_PATH_INSPECTION_FAILED = "configured-plugin-path-inspection-failed";
function pluginPathFailureDiagnostic(source, origin, error) {
	if (origin === "config" && !isMissingPathError(error)) {
		const errorCode = extractErrorCode(error) ?? "UNKNOWN";
		const fixHint = `${errorCode === "EACCES" || errorCode === "EPERM" ? `Fix permissions on ${source}` : errorCode === "ELOOP" ? `Fix the symbolic link loop at ${source}` : `Resolve the filesystem inspection error on ${source}`}, then run \`${PLUGIN_AVAILABILITY_POLICY.repairCommand}\`.`;
		return {
			level: "warn",
			code: CONFIGURED_PLUGIN_PATH_INSPECTION_FAILED,
			configDisposition: "preserve",
			errorCode,
			source,
			fixHint,
			message: `Configured plugin load path inspection failed: ${source} (${formatErrorMessageWithCode(error)}). Uninspected plugin configuration is preserved. ${fixHint}`
		};
	}
	return origin === "config" ? {
		level: "warn",
		code: CONFIGURED_PLUGIN_PATH_UNAVAILABLE,
		configDisposition: "preserve",
		source,
		message: `Configured plugin load path is unavailable: ${source}. Uninspected plugin configuration is preserved. Restore access to the path, then run \`${PLUGIN_AVAILABILITY_POLICY.repairCommand}\`.`
	} : {
		level: "error",
		source,
		message: `plugin path not found: ${source}`
	};
}
function inspectPluginLoadPath(source, origin, diagnostics) {
	try {
		const stat = pluginCacheStatSync(source, origin === "config");
		if (!stat && !pluginCacheExistsSync(source)) diagnostics.push(pluginPathFailureDiagnostic(source, origin, void 0));
		if (origin === "config" && stat) {
			if (stat.isDirectory()) readPluginCacheDirectory(source);
			else if (!stat.isFile()) throw Object.assign(/* @__PURE__ */ new Error("Plugin load path is not a regular file or directory"), { code: "ERR_INVALID_FILE_TYPE" });
		}
		return stat;
	} catch (error) {
		diagnostics.push(pluginPathFailureDiagnostic(source, origin, error));
		return null;
	}
}
//#endregion
//#region src/plugins/hardlink-policy.ts
/** Enforces plugin root hardlink policy with bundled and immutable Nix-store exceptions. */
const NIX_STORE_ROOT = "/nix/store";
/** Returns true when a plugin root resolves inside the immutable Nix store. */
function isNixStorePluginRoot(rootDir) {
	const rootRealPath = pluginCacheRealpathSync(rootDir) ?? path.resolve(rootDir);
	return rootRealPath === NIX_STORE_ROOT || rootRealPath.startsWith(`${NIX_STORE_ROOT}/`);
}
/** Decides whether plugin file hardlinks should fail boundary validation for one root. */
function shouldRejectHardlinkedPluginFiles(params) {
	if (params.origin === "bundled") return false;
	if (resolveIsNixMode(params.env) && isNixStorePluginRoot(params.rootDir)) return false;
	return true;
}
//#endregion
//#region src/plugins/discovery-required-plugins.ts
function addMissingRequiredPluginDiagnostics(result, params) {
	const candidatePolicyIds = new Set(result.candidates.map((candidate) => normalizePluginPolicyId(candidate.idHint)));
	const seen = /* @__PURE__ */ new Set();
	let configuredFileManifestPolicyIds;
	for (const candidate of result.candidates) for (const requiredPluginId of candidate.requiredPluginIds ?? []) {
		const requiredPolicyId = normalizePluginPolicyId(requiredPluginId);
		if (candidatePolicyIds.has(requiredPolicyId)) continue;
		if (!configuredFileManifestPolicyIds) {
			configuredFileManifestPolicyIds = /* @__PURE__ */ new Set();
			for (const configuredCandidate of result.candidates) {
				if (configuredCandidate.origin !== "config" || configuredCandidate.packageDir) continue;
				const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
					origin: configuredCandidate.origin,
					rootDir: configuredCandidate.rootDir,
					env: params.env
				});
				const manifest = loadPluginManifest(configuredCandidate.rootDir, rejectHardlinks);
				if (manifest.ok) configuredFileManifestPolicyIds.add(normalizePluginPolicyId(manifest.manifest.id));
			}
		}
		if (configuredFileManifestPolicyIds.has(requiredPolicyId)) continue;
		const key = `${normalizePluginPolicyId(candidate.idHint)}\0${requiredPolicyId}`;
		if (seen.has(key)) continue;
		seen.add(key);
		result.diagnostics.push({
			level: "warn",
			pluginId: candidate.idHint,
			source: candidate.requiredPluginSource ?? candidate.source,
			message: `plugin "${candidate.idHint}" requires plugin "${requiredPluginId}"; install "${requiredPluginId}" to use it`
		});
	}
}
//#endregion
//#region src/plugins/install-paths.ts
/** Validates a plugin id for install path safety. */
function validatePluginId(pluginId) {
	const trimmed = pluginId.trim();
	if (!trimmed) return "invalid plugin name: missing";
	if (trimmed.includes("\\")) return "invalid plugin name: path separators not allowed";
	const segments = trimmed.split("/");
	if (segments.some((segment) => !segment)) return "invalid plugin name: malformed scope";
	if (segments.some((segment) => segment === "." || segment === "..")) return "invalid plugin name: reserved path segment";
	if (segments.length === 1) {
		if (trimmed.startsWith("@")) return "invalid plugin name: scoped ids must use @scope/name format";
		return null;
	}
	if (segments.length !== 2) return "invalid plugin name: path separators not allowed";
	if (!segments[0]?.startsWith("@") || segments[0].length < 2) return "invalid plugin name: scoped ids must use @scope/name format";
	return null;
}
/** Resolves the default directory for path-installed plugin extensions. */
function resolveDefaultPluginExtensionsDir(env = process.env, homedir) {
	return resolveActivePluginInstallDir("extensions", env, homedir);
}
/** Resolves the default directory for managed npm plugin installs. */
function resolveDefaultPluginNpmDir(env = process.env, homedir) {
	return resolveActivePluginInstallDir("npm", env, homedir);
}
/** Resolves the directory containing managed npm plugin projects. */
function resolvePluginNpmProjectsDir(npmDir) {
	const npmBase = npmDir ? resolveUserPath(npmDir) : resolveDefaultPluginNpmDir();
	return path.join(npmBase, "projects");
}
new RegExp(`^g-[a-f0-9]{16}$`, "u");
//#endregion
//#region src/plugins/legacy-npm-declaration.ts
/** Reads legacy npm plugin declaration files left by early plugin installs. */
/** Legacy declaration filename used by early npm-backed plugin installs. */
const LEGACY_NPM_DECLARATION_FILE = "openclaw.extension.json";
/** Reads a legacy npm plugin declaration when a plugin directory still has one. */
function readLegacyNpmPluginDeclaration(pluginDir) {
	const source = path.join(pluginDir, LEGACY_NPM_DECLARATION_FILE);
	const parsed = tryReadJsonSync(source);
	if (!isRecord(parsed) || parsed.type !== "npm") return null;
	const pluginId = typeof parsed.name === "string" ? parsed.name.trim() : "";
	const npmSpec = typeof parsed.npmSpec === "string" ? parsed.npmSpec.trim() : "";
	if (!pluginId || validatePluginId(pluginId) || !parseRegistryNpmSpec(npmSpec)) return null;
	return {
		pluginId,
		npmSpec,
		source
	};
}
//#endregion
//#region src/plugins/package-compat.ts
function normalizePartialComparableVersion(version) {
	const trimmed = version.trim();
	return /^[vV]?[0-9]+\.[0-9]+$/.test(trimmed) ? {
		version: `${trimmed}.0`,
		isPartial: true
	} : {
		version: trimmed,
		isPartial: false
	};
}
function shouldPreservePluginApiPrereleaseFloor(target) {
	return Boolean(prerelease(normalizePartialComparableVersion(target).version));
}
function normalizePluginApiVersionForComparator(version, target) {
	const normalizedCorrection = normalizeOpenClawNumericCorrectionForPluginApi(version);
	if (normalizedCorrection) return normalizedCorrection;
	return shouldPreservePluginApiPrereleaseFloor(target) ? version : normalizeOpenClawReleaseSuffixForPluginApi(version);
}
function satisfiesComparator(version, token) {
	const trimmed = token.trim();
	if (!trimmed) return true;
	const match = /^(>=|<=|>|<|=|\^|~)?\s*(.+)$/.exec(trimmed);
	if (!match) return false;
	const operator = match[1] ?? "";
	const target = match[2]?.trim();
	if (!target || /^[<>=^~]/.test(target)) return false;
	const comparableVersion = normalizePluginApiVersionForComparator(version, target);
	const normalizedTarget = normalizePartialComparableVersion(target);
	const comparator = normalizedTarget.isPartial && !operator ? `>=${normalizedTarget.version}` : `${operator}${normalizedTarget.version}`;
	return satisfies(comparableVersion, comparator, { includePrerelease: true });
}
function satisfiesSemverRange(version, range) {
	if (range.includes("||")) return false;
	const tokens = normalizeStringEntries(range.trim().split(/\s+/));
	if (tokens.length === 0) return false;
	return tokens.every((token) => satisfiesComparator(version, token));
}
const OPENCLAW_RELEASE_SUFFIX_PATTERN = /^[vV]?(\d{4}\.[1-9]\d?\.[1-9]\d*)(?:-\d+|-(?:alpha|beta|rc)\.\d+)$/i;
const OPENCLAW_NUMERIC_CORRECTION_PATTERN = /^[vV]?(\d{4}\.[1-9]\d?\.[1-9]\d*)-\d+$/;
function normalizeOpenClawNumericCorrectionForPluginApi(pluginApiVersion) {
	return OPENCLAW_NUMERIC_CORRECTION_PATTERN.exec(pluginApiVersion.trim())?.[1];
}
function normalizeOpenClawReleaseSuffixForPluginApi(pluginApiVersion) {
	return OPENCLAW_RELEASE_SUFFIX_PATTERN.exec(pluginApiVersion.trim())?.[1] ?? pluginApiVersion;
}
/** Resolves the plugin API compatibility range declared by package metadata. */
function resolvePackagePluginApiRange(packageMetadata) {
	if (packageMetadata === void 0 || packageMetadata === null) return { ok: true };
	if (!isRecord(packageMetadata)) return { ok: true };
	if (!("compat" in packageMetadata)) return { ok: true };
	const compat = packageMetadata.compat;
	if (compat === void 0 || compat === null) return { ok: true };
	if (!isRecord(compat)) return {
		ok: false,
		error: "package.json openclaw.compat must be an object"
	};
	if (!("pluginApi" in compat)) return { ok: true };
	const pluginApi = compat.pluginApi;
	if (typeof pluginApi !== "string") return {
		ok: false,
		error: "package.json openclaw.compat.pluginApi must be a string"
	};
	const range = pluginApi.trim();
	if (!range) return {
		ok: false,
		error: "package.json openclaw.compat.pluginApi must not be empty"
	};
	return {
		ok: true,
		range
	};
}
/** Checks whether a host plugin API version satisfies a package plugin API range. */
function satisfiesPluginApiRange(pluginApiVersion, pluginApiRange) {
	if (!pluginApiRange) return true;
	return satisfiesSemverRange(pluginApiVersion, pluginApiRange);
}
//#endregion
//#region src/plugins/package-entry-resolution.ts
function runtimeExtensionsLengthMismatchMessage(params) {
	return `package.json openclaw.runtimeExtensions length (${params.runtimeExtensionsLength}) must match openclaw.extensions length (${params.extensionsLength})`;
}
function readPackageManifestStringList(params) {
	if (!Array.isArray(params.value)) return {
		ok: true,
		entries: []
	};
	const entries = [];
	for (const [index, entry] of params.value.entries()) {
		const normalized = normalizeOptionalString(entry);
		if (!normalized) return {
			ok: false,
			error: `package.json ${params.fieldName}[${index}] must be a non-empty string`
		};
		entries.push(normalized);
	}
	return {
		ok: true,
		entries
	};
}
function resolvePackageRuntimeExtensionEntries(params) {
	const runtimeExtensionsResult = readPackageManifestStringList({
		fieldName: "openclaw.runtimeExtensions",
		value: getPackageManifestMetadata(params.manifest ?? void 0)?.runtimeExtensions
	});
	if (!runtimeExtensionsResult.ok) return runtimeExtensionsResult;
	const runtimeExtensions = runtimeExtensionsResult.entries;
	if (runtimeExtensions.length === 0) return {
		ok: true,
		runtimeExtensions: []
	};
	if (runtimeExtensions.length !== params.extensions.length) return {
		ok: false,
		error: runtimeExtensionsLengthMismatchMessage({
			runtimeExtensionsLength: runtimeExtensions.length,
			extensionsLength: params.extensions.length
		})
	};
	return {
		ok: true,
		runtimeExtensions
	};
}
function missingCompiledRuntimeEntryMessage(params) {
	return `${params.label} requires compiled runtime output for TypeScript entry ${params.entry}: expected ${params.candidates.join(", ")}. This is a plugin packaging issue, not a local config problem; update or reinstall the plugin after the publisher ships compiled JavaScript, or disable/uninstall the plugin until then. TypeScript source fallback is only supported for source checkouts and local development paths.`;
}
function resolvePackageEntrySource(params) {
	const source = path.resolve(params.packageDir, params.entryPath);
	const rejectHardlinks = params.rejectHardlinks ?? true;
	const candidates = [source];
	const openCandidate = (absolutePath) => {
		const opened = checkPluginCacheEntry({
			rootDir: params.packageDir,
			relativePath: path.relative(params.packageDir, absolutePath),
			rootRealPath: params.packageRootRealPath,
			rejectHardlinks
		});
		if (!opened.ok) return matchRootFileOpenFailure(opened, {
			path: () => null,
			io: () => {
				params.diagnostics.push({
					level: "warn",
					...params.pluginIdHint ? { pluginId: params.pluginIdHint } : {},
					message: `extension entry unreadable (I/O error): ${params.entryPath}`,
					source: params.sourceLabel
				});
				return null;
			},
			fallback: () => {
				params.diagnostics.push({
					level: "error",
					...params.pluginIdHint ? { pluginId: params.pluginIdHint } : {},
					message: `extension entry escapes package directory: ${params.entryPath}`,
					source: params.sourceLabel
				});
				return null;
			}
		});
		return opened.exists ? opened.path : null;
	};
	if (!rejectHardlinks) {
		const builtCandidate = source.replace(/\.[^.]+$/u, ".js");
		if (builtCandidate !== source) candidates.push(builtCandidate);
	}
	for (const candidate of candidates) {
		if (!pluginCacheExistsSync(candidate)) continue;
		return openCandidate(candidate);
	}
	return openCandidate(source);
}
function shouldInferBuiltRuntimeEntry(origin) {
	return origin === "config" || origin === "global";
}
function shouldRequireBuiltRuntimeEntry(origin) {
	return origin === "global";
}
function resolveSafePackageEntry(params) {
	const absolutePath = path.resolve(params.packageDir, params.entryPath);
	if (pluginCacheExistsSync(absolutePath)) {
		const existingSource = resolvePackageEntrySource({
			packageDir: params.packageDir,
			...params.packageRootRealPath !== void 0 ? { packageRootRealPath: params.packageRootRealPath } : {},
			entryPath: params.entryPath,
			pluginIdHint: params.pluginIdHint,
			sourceLabel: params.sourceLabel,
			diagnostics: params.diagnostics,
			rejectHardlinks: params.rejectHardlinks
		});
		if (!existingSource) return null;
		return {
			relativePath: path.relative(params.packageDir, absolutePath).replace(/\\/g, "/"),
			existingSource
		};
	}
	if (!checkPluginCacheEntry({
		rootDir: params.packageDir,
		relativePath: params.entryPath,
		rootRealPath: params.packageRootRealPath,
		rejectHardlinks: params.rejectHardlinks ?? true
	}).ok) {
		params.diagnostics.push({
			level: "error",
			...params.pluginIdHint ? { pluginId: params.pluginIdHint } : {},
			message: `extension entry escapes package directory: ${params.entryPath}`,
			source: params.sourceLabel
		});
		return null;
	}
	return { relativePath: path.relative(params.packageDir, absolutePath).replace(/\\/g, "/") };
}
function resolveOptionalExistingPackageEntrySource(params) {
	if (!pluginCacheExistsSync(path.resolve(params.packageDir, params.entryPath))) return { status: "missing" };
	const resolved = resolvePackageEntrySource(params);
	return resolved ? {
		status: "resolved",
		source: resolved
	} : { status: "invalid" };
}
function resolvePackageRuntimeEntrySource(params) {
	const safeEntry = resolveSafePackageEntry({
		packageDir: params.packageDir,
		...params.packageRootRealPath !== void 0 ? { packageRootRealPath: params.packageRootRealPath } : {},
		entryPath: params.entryPath,
		pluginIdHint: params.pluginIdHint,
		sourceLabel: params.sourceLabel,
		diagnostics: params.diagnostics,
		rejectHardlinks: params.rejectHardlinks
	});
	if (!safeEntry) return null;
	if (params.runtimeEntryPath) {
		const runtimeSource = resolvePackageEntrySource({
			packageDir: params.packageDir,
			...params.packageRootRealPath !== void 0 ? { packageRootRealPath: params.packageRootRealPath } : {},
			entryPath: params.runtimeEntryPath,
			pluginIdHint: params.pluginIdHint,
			sourceLabel: params.sourceLabel,
			diagnostics: params.diagnostics,
			rejectHardlinks: params.rejectHardlinks
		});
		if (runtimeSource) return runtimeSource;
		params.diagnostics.push({
			level: "error",
			...params.pluginIdHint ? { pluginId: params.pluginIdHint } : {},
			message: `${params.runtimeEntryLabel ?? "runtime entry"} not found: ${params.runtimeEntryPath}`,
			source: params.sourceLabel
		});
		return null;
	}
	if (shouldInferBuiltRuntimeEntry(params.origin)) {
		const builtEntryCandidates = listBuiltRuntimeEntryCandidates(safeEntry.relativePath);
		for (const candidate of builtEntryCandidates) {
			const runtimeSource = resolveOptionalExistingPackageEntrySource({
				packageDir: params.packageDir,
				...params.packageRootRealPath !== void 0 ? { packageRootRealPath: params.packageRootRealPath } : {},
				entryPath: candidate,
				pluginIdHint: params.pluginIdHint,
				sourceLabel: params.sourceLabel,
				diagnostics: params.diagnostics,
				rejectHardlinks: params.rejectHardlinks
			});
			if (runtimeSource.status === "resolved") return runtimeSource.source;
			if (runtimeSource.status === "invalid") return null;
		}
		if ((params.requireBuiltRuntimeEntry ?? shouldRequireBuiltRuntimeEntry(params.origin)) && isTypeScriptPackageEntry(safeEntry.relativePath)) {
			params.diagnostics.push({
				level: "warn",
				...params.pluginIdHint ? { pluginId: params.pluginIdHint } : {},
				message: missingCompiledRuntimeEntryMessage({
					label: "installed plugin package",
					entry: safeEntry.relativePath,
					candidates: builtEntryCandidates
				}),
				source: params.sourceLabel
			});
			return null;
		}
	}
	if (safeEntry.existingSource) return safeEntry.existingSource;
	if (params.rejectHardlinks === false) {
		const trustedFallbackSource = resolvePackageEntrySource({
			packageDir: params.packageDir,
			...params.packageRootRealPath !== void 0 ? { packageRootRealPath: params.packageRootRealPath } : {},
			entryPath: params.entryPath,
			pluginIdHint: params.pluginIdHint,
			sourceLabel: params.sourceLabel,
			diagnostics: params.diagnostics,
			rejectHardlinks: params.rejectHardlinks
		});
		if (trustedFallbackSource) return trustedFallbackSource;
	}
	params.diagnostics.push({
		level: "error",
		...params.pluginIdHint ? { pluginId: params.pluginIdHint } : {},
		message: `${params.sourceEntryLabel ?? "extension entry"} not found: ${safeEntry.relativePath}`,
		source: params.sourceLabel
	});
	return null;
}
/** Resolves the runtime setup source for a plugin package manifest. */
function resolvePackageSetupSource(params) {
	const packageManifest = getPackageManifestMetadata(params.manifest ?? void 0);
	const setupEntryPath = normalizeOptionalString(packageManifest?.setupEntry);
	if (!setupEntryPath) return null;
	return resolvePackageRuntimeEntrySource({
		packageDir: params.packageDir,
		...params.packageRootRealPath !== void 0 ? { packageRootRealPath: params.packageRootRealPath } : {},
		entryPath: setupEntryPath,
		sourceEntryLabel: "setup entry",
		runtimeEntryPath: normalizeOptionalString(packageManifest?.runtimeSetupEntry),
		runtimeEntryLabel: "runtime setup entry",
		pluginIdHint: params.pluginIdHint ?? normalizeOptionalString(packageManifest?.plugin?.id) ?? normalizeOptionalString(packageManifest?.channel?.id),
		origin: params.origin,
		...params.requireBuiltRuntimeEntry !== void 0 ? { requireBuiltRuntimeEntry: params.requireBuiltRuntimeEntry } : {},
		sourceLabel: params.sourceLabel,
		diagnostics: params.diagnostics,
		rejectHardlinks: params.rejectHardlinks
	});
}
/** Keeps declarations paired with their runtime sources when earlier entries cannot resolve. */
function resolvePackageRuntimeExtensions(params) {
	const runtimeResolution = resolvePackageRuntimeExtensionEntries({
		manifest: params.manifest,
		extensions: params.extensions
	});
	if (!runtimeResolution.ok) {
		params.diagnostics.push({
			level: "error",
			...params.pluginIdHint ? { pluginId: params.pluginIdHint } : {},
			message: runtimeResolution.error,
			source: params.sourceLabel
		});
		return [];
	}
	return params.extensions.flatMap((entryPath, index) => {
		const source = resolvePackageRuntimeEntrySource({
			packageDir: params.packageDir,
			...params.packageRootRealPath !== void 0 ? { packageRootRealPath: params.packageRootRealPath } : {},
			entryPath,
			sourceEntryLabel: "extension entry",
			runtimeEntryPath: runtimeResolution.runtimeExtensions[index],
			runtimeEntryLabel: "runtime extension entry",
			pluginIdHint: params.pluginIdHint,
			origin: params.origin,
			...params.requireBuiltRuntimeEntry !== void 0 ? { requireBuiltRuntimeEntry: params.requireBuiltRuntimeEntry } : {},
			sourceLabel: params.sourceLabel,
			diagnostics: params.diagnostics,
			rejectHardlinks: params.rejectHardlinks
		});
		return source ? [{
			entryPath,
			source
		}] : [];
	});
}
//#endregion
//#region src/plugins/plugin-lifecycle-trace.ts
/** Checks the opt-in plugin lifecycle tracing environment flag. */
function isPluginLifecycleTraceEnabled() {
	const raw = process.env.OPENCLAW_PLUGIN_LIFECYCLE_TRACE?.trim().toLowerCase();
	return raw === "1" || raw === "true" || raw === "yes";
}
function formatTraceValue(value) {
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	return JSON.stringify(value);
}
function emitPluginLifecycleTrace(params) {
	const elapsedMs = Number(process.hrtime.bigint() - params.start) / 1e6;
	const detailText = Object.entries(params.details ?? {}).filter((entry) => entry[1] !== void 0).map(([key, value]) => `${key}=${formatTraceValue(value)}`).join(" ");
	const suffix = detailText ? ` ${detailText}` : "";
	console.error(`[plugins:lifecycle] phase=${JSON.stringify(params.phase)} ms=${elapsedMs.toFixed(2)} status=${params.status}${suffix}`);
}
/** Traces a synchronous plugin lifecycle phase when tracing is enabled. */
function tracePluginLifecyclePhase(phase, fn, details) {
	if (!isPluginLifecycleTraceEnabled()) return fn();
	const start = process.hrtime.bigint();
	let status;
	try {
		const result = fn();
		status = "ok";
		return result;
	} catch (error) {
		status = "error";
		throw error;
	} finally {
		emitPluginLifecycleTrace({
			phase,
			start,
			status: status ?? "error",
			details
		});
	}
}
//#endregion
//#region src/plugins/dev-source-root.ts
/** Env var that points bundled-plugin lookup at an OpenClaw source checkout. */
const OPENCLAW_DEV_SOURCE_ROOT_ENV = "OPENCLAW_DEV_SOURCE_ROOT";
function readPackageName(packageJsonPath) {
	try {
		const parsed = JSON.parse(fsSync.readFileSync(packageJsonPath, "utf-8"));
		return typeof parsed.name === "string" ? parsed.name : null;
	} catch {
		return null;
	}
}
/** Resolves and validates the configured OpenClaw development source root. */
function resolveOpenClawDevSourceRoot(env = process.env) {
	const rawRoot = env[OPENCLAW_DEV_SOURCE_ROOT_ENV]?.trim();
	if (!rawRoot) return null;
	const resolvedRoot = resolveUserPath(rawRoot, env);
	const roots = getPluginCache().sdk.devSourceRoots;
	if (roots.has(resolvedRoot)) return roots.get(resolvedRoot) ?? null;
	const realRoot = pluginCacheRealpathSync(resolvedRoot);
	const result = realRoot && readPackageName(path.join(realRoot, "package.json")) === "openclaw" && pluginCacheExistsSync(path.join(realRoot, "src")) && pluginCacheExistsSync(path.join(realRoot, "extensions")) ? realRoot : null;
	roots.set(resolvedRoot, result);
	return result;
}
/** Source builds own their bundled SDK consumers even without an explicit development selector. */
function resolveBundledPluginSourceRoot(env = process.env) {
	const selected = resolveOpenClawDevSourceRoot(env);
	if (selected) return selected;
	const hostRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	return hostRoot && isSourceCheckoutRoot(hostRoot) ? hostRoot : null;
}
/** Prioritizes already-bundled candidates; the selector itself never grants provenance. */
function isBundledPluginInsideDevSourceRoot(params) {
	const devSourceRoot = resolveBundledPluginSourceRoot(params.env);
	if (!devSourceRoot) return false;
	if (!isPluginInPackageBundledRoots({
		packageRoot: devSourceRoot,
		rootDir: resolveUserPath(params.rootDir, params.env)
	})) return false;
	if (resolveOpenClawDevSourceRoot(params.env)) return true;
	const hostRoot = pluginCacheRealpathSync(devSourceRoot);
	const pluginRoot = pluginCacheRealpathSync(resolveUserPath(params.rootDir, params.env));
	return Boolean(hostRoot && pluginRoot && ["dist", "dist-runtime"].some((tree) => isPathInside$1(path.join(hostRoot, tree, "extensions"), pluginRoot)));
}
//#endregion
//#region src/plugins/roots.ts
function resolvePluginSourceRoots(params) {
	const env = params.env ?? process.env;
	const workspaceRoot = params.workspaceDir ? resolveUserPath(params.workspaceDir, env) : void 0;
	return {
		stock: resolveBundledPluginsDir(env),
		global: resolveDefaultPluginExtensionsDir(env),
		workspace: workspaceRoot ? path.join(workspaceRoot, ".openclaw", "extensions") : void 0
	};
}
function resolvePluginCacheInputs(params) {
	const env = params.env ?? process.env;
	return {
		roots: resolvePluginSourceRoots({
			workspaceDir: params.workspaceDir,
			env
		}),
		loadPaths: normalizeStringEntries((params.loadPaths ?? []).filter((entry) => typeof entry === "string")).map((entry) => resolveUserPath(entry, env)),
		devSourceRoot: resolveOpenClawDevSourceRoot(env)
	};
}
//#endregion
//#region src/plugins/status-dependencies-core.ts
function normalizeDependencyMap(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	const normalized = {};
	for (const [name, spec] of Object.entries(raw)) {
		const normalizedName = name.trim();
		if (!normalizedName || typeof spec !== "string" || !spec.trim()) continue;
		normalized[normalizedName] = spec.trim();
	}
	return normalized;
}
/** Normalizes raw package dependency maps into sorted plugin dependency specs. */
function normalizePluginDependencySpecs(params) {
	const dependencies = normalizeDependencyMap(params.dependencies);
	const optionalDependencies = normalizeDependencyMap(params.optionalDependencies);
	for (const name of Object.keys(optionalDependencies)) delete dependencies[name];
	return {
		dependencies,
		optionalDependencies
	};
}
//#endregion
//#region src/plugins/discovery.ts
/** Discovers plugin candidates from bundled, workspace, global, package, and bundle roots. */
const EXTENSION_EXTS = /* @__PURE__ */ new Set([
	".ts",
	".js",
	".mts",
	".cts",
	".mjs",
	".cjs"
]);
const SCANNED_DIRECTORY_IGNORE_NAMES = /* @__PURE__ */ new Set([
	".git",
	".hg",
	".svn",
	".turbo",
	".yarn",
	".yarn-cache",
	"build",
	"coverage",
	"dist",
	"node_modules"
]);
function currentUid(overrideUid) {
	if (overrideUid !== void 0) return overrideUid;
	if (process.platform === "win32") return null;
	if (typeof process.getuid !== "function") return null;
	return process.getuid();
}
function checkSourceEscapesRoot(params) {
	const sourceRealPath = pluginCacheRealpathSync(params.source);
	const rootRealPath = pluginCacheRealpathSync(params.rootDir);
	if (!sourceRealPath || !rootRealPath) return null;
	if (isPathInside(rootRealPath, sourceRealPath)) return null;
	return {
		reason: "source_escapes_root",
		sourcePath: params.source,
		rootPath: params.rootDir,
		targetPath: params.source,
		sourceRealPath,
		rootRealPath
	};
}
function checkPathStatAndPermissions(params) {
	if (process.platform === "win32") return null;
	const pathsToCheck = [params.rootDir, params.source];
	const seen = /* @__PURE__ */ new Set();
	for (const targetPath of pathsToCheck) {
		const normalized = path.resolve(targetPath);
		if (seen.has(normalized)) continue;
		seen.add(normalized);
		let stat = pluginCacheStatSync(targetPath);
		if (!stat) return {
			reason: "path_stat_failed",
			sourcePath: params.source,
			rootPath: params.rootDir,
			targetPath
		};
		let modeBits = stat.mode & 511;
		if ((modeBits & 2) !== 0 && params.origin === "bundled") try {
			fsSync.chmodSync(targetPath, modeBits & -19);
			const repairedStat = refreshPluginCacheStat(targetPath);
			if (!repairedStat) return {
				reason: "path_stat_failed",
				sourcePath: params.source,
				rootPath: params.rootDir,
				targetPath
			};
			stat = repairedStat;
			modeBits = repairedStat.mode & 511;
		} catch {}
		if ((modeBits & 2) !== 0) return {
			reason: "path_world_writable",
			sourcePath: params.source,
			rootPath: params.rootDir,
			targetPath,
			modeBits
		};
		if (params.origin !== "bundled" && params.uid !== null && typeof stat.uid === "number" && stat.uid !== params.uid && stat.uid !== 0) return {
			reason: "path_suspicious_ownership",
			sourcePath: params.source,
			rootPath: params.rootDir,
			targetPath,
			foundUid: stat.uid,
			expectedUid: params.uid
		};
	}
	return null;
}
function findCandidateBlockIssue(params) {
	const escaped = checkSourceEscapesRoot({
		source: params.source,
		rootDir: params.rootDir
	});
	if (escaped) return escaped;
	return checkPathStatAndPermissions({
		source: params.source,
		rootDir: params.rootDir,
		origin: params.origin,
		uid: currentUid(params.ownershipUid)
	});
}
function formatCandidateBlockMessage(issue) {
	if (issue.reason === "source_escapes_root") return `blocked plugin candidate: source escapes plugin root (${issue.sourcePath} -> ${issue.sourceRealPath}; root=${issue.rootRealPath})`;
	if (issue.reason === "path_stat_failed") return `blocked plugin candidate: cannot stat path (${issue.targetPath})`;
	if (issue.reason === "path_world_writable") return `blocked plugin candidate: world-writable path (${issue.targetPath}, mode=${formatPosixMode(issue.modeBits ?? 0)})`;
	return `blocked plugin candidate: suspicious ownership (${issue.targetPath}, uid=${issue.foundUid}, expected uid=${issue.expectedUid} or root)`;
}
function isUnsafePluginCandidate(params) {
	const issue = findCandidateBlockIssue({
		source: params.source,
		rootDir: params.rootDir,
		origin: params.origin,
		ownershipUid: params.ownershipUid
	});
	if (!issue) return false;
	params.diagnostics.push({
		level: "warn",
		...params.pluginId ? { pluginId: params.pluginId } : {},
		source: issue.targetPath,
		message: formatCandidateBlockMessage(issue)
	});
	return true;
}
function isExtensionFile(filePath) {
	const ext = path.extname(filePath);
	if (!EXTENSION_EXTS.has(ext)) return false;
	if (/\.d\.[cm]?ts$/.test(filePath)) return false;
	const baseName = normalizeLowercaseStringOrEmpty(path.basename(filePath));
	return !baseName.includes(".test.") && !baseName.includes(".live.test.") && !baseName.includes(".e2e.test.");
}
function shouldIgnoreScannedDirectory(dirName) {
	const normalized = normalizeLowercaseStringOrEmpty(dirName);
	if (!normalized) return true;
	if (SCANNED_DIRECTORY_IGNORE_NAMES.has(normalized)) return true;
	if (normalized.endsWith(".bak")) return true;
	if (normalized.includes(".backup-")) return true;
	if (normalized.includes(".disabled")) return true;
	return false;
}
function resolveScannedEntryType(entry, fullPath) {
	if (entry.isFile()) return "file";
	if (entry.isDirectory()) return "directory";
	if (!entry.isSymbolicLink()) return null;
	const stat = pluginCacheStatSync(fullPath);
	if (!stat) return null;
	if (stat.isFile()) return "file";
	if (stat.isDirectory()) return "directory";
	return null;
}
function resolvesToSameDirectory(left, right) {
	if (!left || !right) return false;
	const leftRealPath = pluginCacheRealpathSync(left);
	const rightRealPath = pluginCacheRealpathSync(right);
	if (leftRealPath && rightRealPath) return leftRealPath === rightRealPath;
	return path.resolve(left) === path.resolve(right);
}
function mergeCandidateInstallOwner(existing, candidateOwner, candidateOwnerAmbiguous) {
	const existingOwner = resolvePluginCandidateInstallOwner(existing);
	const ownerConflict = existingOwner && candidateOwner && existingOwner !== candidateOwner;
	if (isPluginCandidateInstallOwnerAmbiguous(existing) || candidateOwnerAmbiguous || ownerConflict) recordPluginCandidateInstallOwner(existing, void 0, true);
	else if (candidateOwner) recordPluginCandidateInstallOwner(existing, candidateOwner);
}
function prepareInstalledPluginPaths(installRecords, env, diagnostics) {
	const byPath = /* @__PURE__ */ new Map();
	const installedPluginDirKeys = /* @__PURE__ */ new Set();
	const managedPluginDirs = /* @__PURE__ */ new Set();
	const resolveRecordPath = (rawPath) => typeof rawPath === "string" && rawPath.trim() ? resolveUserPath(rawPath, env) : void 0;
	for (const [installOwner, record] of Object.entries(installRecords ?? {})) {
		const installPath = resolveRecordPath(record.installPath);
		const sourcePath = resolveRecordPath(record.sourcePath);
		for (const recordedPath of [installPath, sourcePath]) if (recordedPath && pluginCacheExistsSync(recordedPath)) {
			const key = resolveManagedPluginDirKey(recordedPath);
			if (key) managedPluginDirs.add(key);
		}
		const resolved = installPath ?? sourcePath;
		if (!resolved || !pluginCacheExistsSync(resolved)) continue;
		const pathKey = pluginCacheRealpathSync(resolved) ?? path.resolve(resolved);
		const requireBuiltRuntimeEntry = !(record.source === "path" && installPath && sourcePath && resolvesToSameDirectory(installPath, sourcePath));
		const existing = byPath.get(pathKey);
		if (existing) {
			existing.requireBuiltRuntimeEntry ||= requireBuiltRuntimeEntry;
			if (existing.installOwner !== installOwner) {
				delete existing.installOwner;
				existing.installOwnerAmbiguous = true;
				diagnostics.push({
					level: "error",
					source: resolved,
					message: "multiple plugin install records claim the same package path; refresh or reinstall the package before using managed lifecycle actions"
				});
			}
		} else {
			byPath.set(pathKey, {
				path: resolved,
				requireBuiltRuntimeEntry,
				installOwner
			});
			const dirKey = resolveManagedPluginDirKey(resolved);
			if (dirKey) installedPluginDirKeys.add(dirKey);
		}
	}
	return {
		installedPaths: [...byPath.values()],
		installedPluginDirKeys,
		managedPluginDirs
	};
}
function resolveManagedPluginDirKey(installedPath) {
	const stat = pluginCacheStatSync(installedPath);
	if (!stat) return null;
	const pluginDir = stat.isFile() ? path.dirname(installedPath) : installedPath;
	return pluginCacheRealpathSync(pluginDir) ?? path.resolve(pluginDir);
}
function isManagedPluginDir(params) {
	if (!params.managedPluginDirs || params.managedPluginDirs.size === 0) return false;
	const key = params.realpath ?? pluginCacheRealpathSync(params.dir) ?? path.resolve(params.dir);
	return params.managedPluginDirs.has(key);
}
function readPackageManifest(dir, rejectHardlinks = true, rootRealPath) {
	const file = readPluginCacheFile({
		rootDir: dir,
		...rootRealPath !== void 0 ? { rootRealPath } : {},
		relativePath: "package.json",
		rejectHardlinks
	});
	if (!file.ok) return null;
	const parsed = parsePluginCacheJson(file);
	return parsed.ok && isRecord(parsed.value) ? parsed.value : null;
}
function readTrustedPackageManifest(dir) {
	return readPackageManifest(dir, false);
}
function readCandidatePackageManifest(params) {
	return readPackageManifest(params.dir, params.rejectHardlinks, params.rootRealPath);
}
function deriveIdHint(params) {
	const base = path.basename(params.filePath, path.extname(params.filePath));
	const pluginId = normalizeOptionalString(params.manifestId) ?? derivePackagePluginIdHint(params.packageName) ?? params.fallbackId;
	return params.hasMultipleExtensions ? `${pluginId}/${base}` : pluginId;
}
function derivePackagePluginIdHint(packageName) {
	const rawPackageName = normalizeOptionalString(packageName);
	if (!rawPackageName) return;
	const unscoped = rawPackageName.includes("/") ? rawPackageName.split("/").pop() ?? rawPackageName : rawPackageName;
	for (const suffix of ["-provider", "-plugin"]) if (unscoped.endsWith(suffix) && unscoped.length > suffix.length) return unscoped.slice(0, -suffix.length);
	return normalizeOptionalString(unscoped);
}
function resolvePluginPackageEntries(params) {
	const entryIdSources = /* @__PURE__ */ new Map();
	for (const entry of resolvePackageRuntimeExtensions(params)) {
		const idHint = deriveIdHint({
			filePath: entry.source,
			manifestId: params.manifestId,
			packageName: params.manifest?.name,
			fallbackId: path.basename(params.packageDir),
			hasMultipleExtensions: params.extensions.length > 1
		});
		const sources = entryIdSources.get(idHint);
		if (sources) sources.push(entry);
		else entryIdSources.set(idHint, [entry]);
	}
	const entries = [];
	for (const [idHint, sources] of entryIdSources) {
		if (params.extensions.length > 1 && sources.length > 1) {
			params.diagnostics.push({
				level: "error",
				pluginId: idHint,
				source: params.sourceLabel,
				message: `plugin package entries collide on derived id "${idHint}" (${sources.map((entry) => path.relative(params.packageDir, entry.source)).join(", ")}); rename the entry files to unique basenames`
			});
			continue;
		}
		for (const entry of sources) entries.push({
			...entry,
			idHint
		});
	}
	return entries;
}
function pushInvalidPackageExtensionDiagnostic(params) {
	if (params.resolution.status === "invalid") {
		params.diagnostics.push({
			level: "error",
			source: params.source,
			message: params.resolution.error,
			...params.pluginId ? { pluginId: params.pluginId } : {}
		});
		return true;
	}
	if (params.resolution.status === "empty") {
		params.diagnostics.push({
			level: "error",
			source: params.source,
			message: "package.json openclaw.extensions is empty",
			...params.pluginId ? { pluginId: params.pluginId } : {}
		});
		return true;
	}
	return false;
}
function resolveCandidateManifest(rootDir, rejectHardlinks, rootRealPath) {
	const manifest = loadPluginManifest(rootDir, rejectHardlinks, rootRealPath);
	return manifest.ok ? {
		manifest: manifest.manifest,
		manifestPath: manifest.manifestPath
	} : void 0;
}
function addLegacyNpmDeclarationDiagnostic(params) {
	const declaration = readLegacyNpmPluginDeclaration(params.pluginDir);
	if (!declaration) return false;
	params.diagnostics.push({
		level: "warn",
		pluginId: declaration.pluginId,
		source: declaration.source,
		message: `legacy npm plugin declaration ignored for "${declaration.pluginId}"; run "openclaw doctor --fix" to install ${declaration.npmSpec} into the managed plugin root`
	});
	return true;
}
function shouldSkipIncompatiblePackagePluginApi(params) {
	if (params.origin === "bundled") return false;
	const packagePluginApiRangeCheck = resolvePackagePluginApiRange(params.packageManifest);
	if (!packagePluginApiRangeCheck.ok) {
		params.diagnostics.push({
			level: "warn",
			source: path.join(params.packageDir, "package.json"),
			message: `invalid package plugin API metadata: ${packagePluginApiRangeCheck.error}; skipping discovery (check package.json openclaw.compat.pluginApi)`,
			pluginId: params.pluginId
		});
		return true;
	}
	const packagePluginApiRange = packagePluginApiRangeCheck.range;
	if (!packagePluginApiRange) return false;
	const compatibilityHostVersion = resolveCompatibilityHostVersion(params.env);
	if (satisfiesPluginApiRange(compatibilityHostVersion, packagePluginApiRange)) return false;
	params.diagnostics.push({
		level: "warn",
		source: path.join(params.packageDir, "package.json"),
		message: `plugin requires plugin API ${packagePluginApiRange}, but this host is ${compatibilityHostVersion}; skipping discovery (check "openclaw --version", OPENCLAW_COMPATIBILITY_HOST_VERSION, or run "openclaw doctor")`,
		pluginId: params.pluginId
	});
	return true;
}
function isSourceCheckoutExtensionsDir(extensionsDir) {
	const packageRoot = path.dirname(extensionsDir);
	return pluginCacheExistsSync(path.join(packageRoot, ".git")) && pluginCacheExistsSync(path.join(packageRoot, "pnpm-workspace.yaml")) && pluginCacheExistsSync(path.join(packageRoot, "src")) && hasUsableBundledPluginTree(extensionsDir);
}
function resolveBundledSourceCheckoutExtensionsDir(bundledRoot) {
	if (!bundledRoot) return;
	const legacyRoot = buildLegacyBundledRootPath(bundledRoot);
	if (!legacyRoot || !isPluginInPackageBundledRoots({
		rootDir: legacyRoot,
		packageRoot: path.dirname(legacyRoot)
	}) || !isSourceCheckoutExtensionsDir(legacyRoot)) return;
	return legacyRoot;
}
function isHostBundledPluginRoot(dir, env) {
	const bundledRoot = resolveBundledPluginsDir(env);
	const realDir = pluginCacheRealpathSync(dir) ?? path.resolve(dir);
	return [bundledRoot, resolveBundledSourceCheckoutExtensionsDir(bundledRoot)].some((root) => root && isPathInside(pluginCacheRealpathSync(root) ?? path.resolve(root), realDir));
}
function readChildDirectoryNames(dir) {
	if (!dir || !pluginCacheExistsSync(dir)) return /* @__PURE__ */ new Set();
	try {
		return new Set(sortUniqueStrings(readPluginCacheDirectory(dir).filter((entry) => entry.isDirectory()).map((entry) => entry.name)));
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function readBundledDistOptOutDirectoryNames(sourceExtensionsDir) {
	const names = /* @__PURE__ */ new Set();
	if (!sourceExtensionsDir) return names;
	for (const name of readChildDirectoryNames(sourceExtensionsDir)) if (getPackageManifestMetadata(readTrustedPackageManifest(path.join(sourceExtensionsDir, name)) ?? void 0)?.build?.bundledDist === false) names.add(name);
	return names;
}
function createPluginScanner(env, ownershipUid) {
	const result = {
		candidates: [],
		diagnostics: []
	};
	const { candidates, diagnostics } = result;
	const attemptedSources = /* @__PURE__ */ new Map();
	function addCandidate(params) {
		const resolved = path.resolve(params.source);
		if (attemptedSources.has(resolved)) {
			const existing = attemptedSources.get(resolved);
			if (existing) mergeCandidateInstallOwner(existing, params.installOwner, params.installOwnerAmbiguous === true);
			return;
		}
		const resolvedRoot = pluginCacheRealpathSync(params.rootDir) ?? path.resolve(params.rootDir);
		if (isUnsafePluginCandidate({
			source: resolved,
			rootDir: resolvedRoot,
			origin: params.origin,
			pluginId: params.idHint,
			diagnostics,
			ownershipUid
		})) {
			attemptedSources.set(resolved, void 0);
			return;
		}
		const manifest = params.manifest ?? null;
		const packageManifest = getPackageManifestMetadata(manifest ?? void 0);
		const packageDependencies = normalizePluginDependencySpecs({
			dependencies: manifest?.dependencies,
			optionalDependencies: manifest?.optionalDependencies
		});
		const candidate = {
			idHint: params.idHint,
			...params.effectivePluginId ? { effectivePluginId: params.effectivePluginId } : {},
			...params.diagnosticIdHint && params.diagnosticIdHint !== params.idHint ? { diagnosticIdHint: params.diagnosticIdHint } : {},
			source: resolved,
			setupSource: params.setupSource,
			rootDir: resolvedRoot,
			origin: params.origin,
			format: params.format ?? "openclaw",
			bundleFormat: params.bundleFormat,
			workspaceDir: params.workspaceDir,
			packageName: normalizeOptionalString(manifest?.name),
			packageVersion: normalizeOptionalString(manifest?.version),
			packageDescription: normalizeOptionalString(manifest?.description),
			packageDir: params.packageDir,
			packageManifest,
			packageDependencies: packageDependencies.dependencies,
			packageOptionalDependencies: packageDependencies.optionalDependencies,
			rawPackageManifest: manifest ?? void 0,
			bundledManifestId: params.bundledManifestId,
			bundledManifest: params.bundledManifest,
			bundledManifestPath: params.bundledManifestPath,
			...params.requiredPluginIds && params.requiredPluginIds.length > 0 ? { requiredPluginIds: params.requiredPluginIds } : {},
			...params.requiredPluginSource ? { requiredPluginSource: params.requiredPluginSource } : {}
		};
		recordPluginCandidateInstallOwner(candidate, params.installOwner, params.installOwnerAmbiguous === true);
		candidates.push(candidate);
		attemptedSources.set(resolved, candidate);
	}
	function discoverBundleInRoot(params) {
		const bundleFormat = detectBundleManifestFormat(params.rootDir, params.hasPackageExtensions);
		if (!bundleFormat) return "none";
		const rootRealPath = pluginCacheRealpathSync(params.rootDir) ?? void 0;
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: params.origin,
			rootDir: params.rootDir,
			env
		});
		const bundleManifest = loadBundleManifest({
			rootDir: params.rootDir,
			...rootRealPath !== void 0 ? { rootRealPath } : {},
			bundleFormat,
			rejectHardlinks
		});
		if (!bundleManifest.ok) {
			diagnostics.push({
				level: "error",
				message: bundleManifest.error,
				source: bundleManifest.manifestPath
			});
			return "invalid";
		}
		addCandidate({
			idHint: bundleManifest.manifest.id,
			source: params.rootDir,
			rootDir: params.rootDir,
			origin: params.origin,
			format: "bundle",
			bundleFormat,
			workspaceDir: params.workspaceDir,
			...params.installOwner ? { installOwner: params.installOwner } : {},
			...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
			manifest: params.manifest,
			packageDir: params.rootDir,
			bundledManifestId: bundleManifest.manifest.id,
			bundledManifestPath: bundleManifest.manifestPath
		});
		return "added";
	}
	function discoverPluginDirectory(params) {
		const { dir, rootRealPath } = params;
		const requireBuiltRuntimeEntry = params.requireBuiltRuntimeEntry ?? isManagedPluginDir({
			dir,
			realpath: rootRealPath,
			managedPluginDirs: params.managedPluginDirs
		});
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: params.origin,
			rootDir: dir,
			env
		});
		const manifest = readCandidatePackageManifest({
			dir,
			origin: params.origin,
			rejectHardlinks,
			...rootRealPath !== void 0 ? { rootRealPath } : {}
		});
		const packageMetadata = getPackageManifestMetadata(manifest ?? void 0);
		const candidateManifest = resolveCandidateManifest(dir, rejectHardlinks, rootRealPath);
		const manifestId = candidateManifest?.manifest.id;
		const pluginIdHint = normalizeOptionalString(manifestId) ?? normalizeOptionalString(packageMetadata?.plugin?.id) ?? normalizeOptionalString(packageMetadata?.channel?.id) ?? derivePackagePluginIdHint(manifest?.name) ?? path.basename(dir);
		if (shouldSkipIncompatiblePackagePluginApi({
			origin: params.origin,
			packageManifest: packageMetadata,
			pluginId: pluginIdHint,
			packageDir: dir,
			env,
			diagnostics
		})) return true;
		const extensionResolution = resolvePackageExtensionEntries(manifest ?? void 0);
		if (pushInvalidPackageExtensionDiagnostic({
			resolution: extensionResolution,
			source: dir,
			pluginId: pluginIdHint,
			diagnostics
		})) return true;
		const extensions = extensionResolution.status === "ok" ? extensionResolution.entries : [];
		const setupSource = resolvePackageSetupSource({
			packageDir: dir,
			...rootRealPath !== void 0 ? { packageRootRealPath: rootRealPath } : {},
			manifest,
			pluginIdHint,
			origin: params.origin,
			requireBuiltRuntimeEntry,
			sourceLabel: dir,
			diagnostics,
			rejectHardlinks
		});
		const addPackageCandidate = (source, idHint, effectivePluginId) => {
			addCandidate({
				idHint,
				...effectivePluginId ? { effectivePluginId } : {},
				diagnosticIdHint: pluginIdHint,
				source,
				...setupSource ? { setupSource } : {},
				rootDir: dir,
				origin: params.origin,
				workspaceDir: params.workspaceDir,
				...params.installOwner ? { installOwner: params.installOwner } : {},
				...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
				manifest,
				packageDir: dir,
				requiredPluginIds: candidateManifest?.manifest.requiresPlugins,
				requiredPluginSource: candidateManifest?.manifestPath
			});
		};
		if (extensions.length > 0) {
			const entries = resolvePluginPackageEntries({
				packageDir: dir,
				...rootRealPath !== void 0 ? { packageRootRealPath: rootRealPath } : {},
				manifest,
				extensions,
				manifestId: manifestId ?? normalizeOptionalString(packageMetadata?.plugin?.id),
				origin: params.origin,
				pluginIdHint,
				requireBuiltRuntimeEntry,
				sourceLabel: dir,
				diagnostics,
				rejectHardlinks
			});
			for (const entry of entries) addPackageCandidate(entry.source, entry.idHint, extensions.length > 1 ? entry.idHint : void 0);
			return true;
		}
		if (discoverBundleInRoot({
			rootDir: dir,
			hasPackageExtensions: extensions.length > 0,
			origin: params.origin,
			workspaceDir: params.workspaceDir,
			...params.installOwner ? { installOwner: params.installOwner } : {},
			...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
			manifest
		}) === "added") return true;
		const indexFile = [...DEFAULT_PLUGIN_ENTRY_CANDIDATES].map((candidate) => path.join(dir, candidate)).find((candidate) => pluginCacheExistsSync(candidate));
		if (indexFile && isExtensionFile(indexFile)) {
			addPackageCandidate(indexFile, manifestId ?? path.basename(dir));
			return true;
		}
		return addLegacyNpmDeclarationDiagnostic({
			pluginDir: dir,
			diagnostics
		});
	}
	function discoverInDirectory(params) {
		if (!pluginCacheExistsSync(params.dir)) return;
		let entries;
		try {
			entries = readPluginCacheDirectory(params.dir).toSorted((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
		} catch (err) {
			diagnostics.push(params.origin === "config" ? pluginPathFailureDiagnostic(params.dir, params.origin, err) : {
				level: "warn",
				message: `failed to read extensions dir: ${params.dir} (${String(err)})`,
				source: params.dir
			});
			return;
		}
		for (const entry of entries) {
			const fullPath = path.join(params.dir, entry.name);
			const entryType = resolveScannedEntryType(entry, fullPath);
			if (entryType === "file") {
				if (!(params.scanFiles ?? params.origin === "bundled") || !isExtensionFile(fullPath)) continue;
				addCandidate({
					idHint: path.basename(entry.name, path.extname(entry.name)),
					source: fullPath,
					rootDir: path.dirname(fullPath),
					origin: params.origin,
					workspaceDir: params.workspaceDir,
					...params.installOwner ? { installOwner: params.installOwner } : {},
					...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {}
				});
				continue;
			}
			if (entryType !== "directory") continue;
			if (params.skipDirectories?.has(entry.name)) continue;
			if (shouldIgnoreScannedDirectory(entry.name)) continue;
			const fullPathRealPath = pluginCacheRealpathSync(fullPath) ?? void 0;
			const fullPathDirKey = fullPathRealPath ?? path.resolve(fullPath);
			if (params.origin === "bundled" && !isPathInside(pluginCacheRealpathSync(params.dir) ?? path.resolve(params.dir), fullPathDirKey)) {
				diagnostics.push({
					level: "error",
					source: fullPath,
					message: `blocked plugin candidate: package directory escapes bundled root (${fullPath})`
				});
				continue;
			}
			if (params.skipRootDirKeys?.has(fullPathDirKey)) continue;
			discoverPluginDirectory({
				...params,
				dir: fullPath,
				rootRealPath: fullPathRealPath
			});
		}
	}
	function discoverFromPath(params) {
		const resolved = resolveUserPath(params.rawPath, env);
		const stat = inspectPluginLoadPath(resolved, params.origin, diagnostics);
		if (!stat) return;
		const origin = (params.origin === "config" || params.origin === "global") && isHostBundledPluginRoot(stat.isFile() ? path.dirname(resolved) : resolved, env) ? "bundled" : params.origin;
		if (stat.isFile()) {
			if (!isExtensionFile(resolved)) {
				diagnostics.push({
					level: "error",
					message: `plugin path is not a supported file: ${resolved}`,
					source: resolved
				});
				return;
			}
			addCandidate({
				idHint: path.basename(resolved, path.extname(resolved)),
				source: resolved,
				rootDir: path.dirname(resolved),
				origin,
				workspaceDir: params.workspaceDir,
				...params.installOwner ? { installOwner: params.installOwner } : {},
				...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {}
			});
			return;
		}
		if (stat.isDirectory()) {
			if (discoverPluginDirectory({
				...params,
				origin,
				dir: resolved,
				rootRealPath: pluginCacheRealpathSync(resolved) ?? void 0
			})) return;
			discoverInDirectory({
				dir: resolved,
				origin,
				workspaceDir: params.workspaceDir,
				...params.scanFiles !== void 0 || params.origin === "config" ? { scanFiles: params.scanFiles ?? true } : {},
				...params.requireBuiltRuntimeEntry !== void 0 ? { requireBuiltRuntimeEntry: params.requireBuiltRuntimeEntry } : {},
				...params.managedPluginDirs ? { managedPluginDirs: params.managedPluginDirs } : {},
				...params.skipRootDirKeys ? { skipRootDirKeys: params.skipRootDirKeys } : {}
			});
		}
	}
	function discoverConfiguredPaths(loadPaths, workspaceDir) {
		const firstConfigured = candidates.length;
		for (const loadPath of loadPaths) if (typeof loadPath === "string" && loadPath.trim()) discoverFromPath({
			rawPath: loadPath.trim(),
			origin: "config",
			workspaceDir
		});
		for (const candidate of candidates.slice(firstConfigured)) candidate.configSelected = true;
	}
	function finish() {
		const candidatesBySource = /* @__PURE__ */ new Map();
		const seenDiagnostics = /* @__PURE__ */ new Set();
		const uniqueDiagnostics = [];
		for (const candidate of candidates) {
			const key = pluginCacheRealpathSync(candidate.source) ?? path.resolve(candidate.source);
			const existing = candidatesBySource.get(key);
			if (existing) {
				const retained = candidate.origin === "bundled" ? candidate : existing;
				const duplicate = retained === candidate ? existing : candidate;
				if (duplicate.origin === "config" || duplicate.configSelected) retained.configSelected = true;
				if (duplicate.sourcePreferred) retained.sourcePreferred = true;
				mergeCandidateInstallOwner(retained, resolvePluginCandidateInstallOwner(duplicate), isPluginCandidateInstallOwnerAmbiguous(duplicate));
				candidatesBySource.set(key, retained);
				continue;
			}
			candidatesBySource.set(key, candidate);
		}
		for (const diagnostic of diagnostics) {
			const key = [
				diagnostic.level,
				diagnostic.pluginId ?? "",
				diagnostic.source ?? "",
				diagnostic.message
			].join("\0");
			if (seenDiagnostics.has(key)) continue;
			seenDiagnostics.add(key);
			uniqueDiagnostics.push(diagnostic);
		}
		result.candidates = [...candidatesBySource.values()];
		result.diagnostics = uniqueDiagnostics;
		return result;
	}
	return {
		result,
		discoverConfiguredPaths,
		discoverFromPath,
		discoverInDirectory,
		finish
	};
}
function discoveryPolicy(env, ownershipUid, bundledRoot) {
	return {
		ownershipUid: currentUid(ownershipUid),
		compatibilityHostVersion: resolveCompatibilityHostVersion(env),
		bundledRoot: bundledRoot ?? resolveBundledPluginsDir(env) ?? "",
		nix: resolveIsNixMode(env),
		sourceOverlaysDisabled: env.OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS ?? "",
		home: env.OPENCLAW_HOME ?? "",
		userHome: env.HOME ?? "",
		userProfile: env.USERPROFILE ?? "",
		cwd: process.cwd()
	};
}
function discoverSharedPluginRoots(params) {
	const { roots, env } = params;
	const cache = getPluginCache().metadata.sharedDiscovery;
	const key = hashStableJson({
		roots,
		installRecords: Object.entries(params.installRecords ?? {}),
		rootScope: params.rootScope ?? "all",
		policy: discoveryPolicy(env, params.ownershipUid, roots.stock)
	});
	const cached = cache.get(key);
	if (cached) return cached;
	const scanner = createPluginScanner(env, params.ownershipUid);
	const { result, discoverInDirectory } = scanner;
	const workspaceCandidates = /* @__PURE__ */ new Set();
	const discoverWorkspacePath = (options) => {
		const first = result.candidates.length;
		scanner.discoverFromPath(options);
		for (const candidate of result.candidates.slice(first)) workspaceCandidates.add(candidate);
	};
	tracePluginLifecyclePhase("discovery scan", () => {
		for (const sourceOverlayDir of listBundledSourceOverlayDirs({
			bundledRoot: roots.stock,
			env
		})) {
			const firstOverlay = result.candidates.length;
			discoverWorkspacePath({
				rawPath: sourceOverlayDir,
				origin: "bundled"
			});
			for (const candidate of result.candidates.slice(firstOverlay)) candidate.sourcePreferred = true;
			result.diagnostics.push({
				level: "warn",
				source: sourceOverlayDir,
				message: "using bind-mounted bundled plugin source overlay; this source overrides the packaged dist bundle for the same plugin id"
			});
		}
		const sourceCheckoutDependencyDiagnostic = resolveSourceCheckoutDependencyDiagnostic(env);
		if (sourceCheckoutDependencyDiagnostic) result.diagnostics.push({
			level: "warn",
			source: sourceCheckoutDependencyDiagnostic.source,
			message: sourceCheckoutDependencyDiagnostic.message
		});
		const sourceCheckoutExtensionsDir = resolveBundledSourceCheckoutExtensionsDir(roots.stock);
		const bundledDistOptOutDirectories = readBundledDistOptOutDirectoryNames(sourceCheckoutExtensionsDir);
		if (sourceCheckoutExtensionsDir) for (const dirName of bundledDistOptOutDirectories) discoverWorkspacePath({
			rawPath: path.join(sourceCheckoutExtensionsDir, dirName),
			origin: "bundled"
		});
		if (roots.stock) discoverInDirectory({
			dir: roots.stock,
			origin: "bundled",
			skipDirectories: bundledDistOptOutDirectories
		});
		const sourceCheckoutMatchesBundledRoot = resolvesToSameDirectory(sourceCheckoutExtensionsDir, roots.stock);
		if (sourceCheckoutExtensionsDir && !sourceCheckoutMatchesBundledRoot) discoverInDirectory({
			dir: sourceCheckoutExtensionsDir,
			origin: "bundled",
			skipDirectories: readChildDirectoryNames(roots.stock)
		});
		if (params.rootScope !== "bundled") {
			const { installedPaths, installedPluginDirKeys, managedPluginDirs } = prepareInstalledPluginPaths(params.installRecords, env, result.diagnostics);
			for (const installedPath of installedPaths) discoverWorkspacePath({
				rawPath: installedPath.path,
				origin: "global",
				...installedPath.installOwner ? { installOwner: installedPath.installOwner } : {},
				...installedPath.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
				requireBuiltRuntimeEntry: installedPath.requireBuiltRuntimeEntry,
				managedPluginDirs,
				scanFiles: true
			});
			discoverInDirectory({
				dir: roots.global,
				origin: "global",
				managedPluginDirs,
				skipRootDirKeys: installedPluginDirKeys
			});
		}
	}, { scope: "shared" });
	const shared = {
		candidates: result.candidates.map((candidate) => ({
			candidate,
			usesWorkspace: workspaceCandidates.has(candidate)
		})),
		diagnostics: result.diagnostics
	};
	cache.set(key, shared);
	return shared;
}
function discoverOpenClawPlugins(params) {
	const env = params.env ?? process.env;
	const workspaceDir = normalizeOptionalString(params.workspaceDir);
	const workspaceRoot = workspaceDir ? resolveUserPath(workspaceDir, env) : void 0;
	const defaultRoots = resolvePluginSourceRoots({
		workspaceDir: workspaceRoot,
		env
	});
	const roots = params.bundledRoot ? {
		...defaultRoots,
		stock: path.resolve(params.bundledRoot)
	} : defaultRoots;
	const cache = getPluginCache().metadata.discovery;
	const key = hashStableJson({
		phase: "all",
		roots,
		workspaceDir,
		loadPaths: params.extraPaths ?? [],
		installRecords: Object.entries(params.installRecords ?? {}),
		rootScope: params.rootScope ?? "all",
		policy: discoveryPolicy(env, params.ownershipUid, roots.stock)
	});
	const cached = cache.get(key);
	if (cached) return cached;
	const scanner = createPluginScanner(env, params.ownershipUid);
	const { result, discoverInDirectory } = scanner;
	if (params.rootScope !== "bundled") tracePluginLifecyclePhase("discovery scan", () => {
		scanner.discoverConfiguredPaths(params.extraPaths ?? [], workspaceDir);
		const workspaceMatchesBundledRoot = resolvesToSameDirectory(workspaceRoot, roots.stock);
		if (roots.workspace && workspaceRoot && !workspaceMatchesBundledRoot) discoverInDirectory({
			dir: roots.workspace,
			origin: "workspace",
			workspaceDir: workspaceRoot
		});
	}, {
		scope: "scoped",
		extraPathCount: params.extraPaths?.length ?? 0
	});
	const shared = discoverSharedPluginRoots({
		roots: {
			stock: roots.stock,
			global: roots.global
		},
		installRecords: params.installRecords,
		ownershipUid: params.ownershipUid,
		env,
		rootScope: params.rootScope
	});
	for (const { candidate, usesWorkspace } of shared.candidates) result.candidates.push({
		...candidate,
		...usesWorkspace ? { workspaceDir } : {}
	});
	result.diagnostics.push(...shared.diagnostics);
	scanner.finish();
	addMissingRequiredPluginDiagnostics(result, { env });
	cache.set(key, result);
	return result;
}
//#endregion
//#region src/plugins/installed-plugin-index-facts.ts
/** Package facts share the existing generation; mutable management inputs stay uncached. */
function getInstalledPluginIndexFacts(index) {
	const entries = getPluginCache().metadata.indexFacts;
	const existing = entries.get(index);
	if (existing) return existing;
	if (!isDeeplyFrozenPlainData(index)) return;
	const facts = {};
	entries.set(index, facts);
	return facts;
}
//#endregion
//#region src/plugins/default-enablement.ts
/** True when a plugin should be enabled by default for a platform. */
function isPluginEnabledByDefaultForPlatform(plugin, platform = process.platform) {
	if (plugin.enabledByDefault === true) return true;
	return plugin.enabledByDefaultOnPlatforms?.includes(platform) === true;
}
//#endregion
//#region src/config/zod-schema.installs.ts
const InstallSourceSchema = union([
	literal("npm"),
	literal("archive"),
	literal("path"),
	literal("clawhub"),
	literal("git")
]);
const PluginInstallSourceSchema = union([InstallSourceSchema, literal("marketplace")]);
/** Zod object shape for persisted generic install records. */
const InstallRecordShape = {
	source: InstallSourceSchema,
	spec: string().optional(),
	sourcePath: string().optional(),
	installPath: string().optional(),
	version: string().optional(),
	resolvedName: string().optional(),
	resolvedVersion: string().optional(),
	resolvedSpec: string().optional(),
	integrity: string().optional(),
	shasum: string().optional(),
	resolvedAt: string().optional(),
	installedAt: string().optional(),
	clawhubUrl: string().optional(),
	clawhubPackage: string().optional(),
	clawhubFamily: union([literal("code-plugin"), literal("bundle-plugin")]).optional(),
	clawhubChannel: union([
		literal("official"),
		literal("community"),
		literal("private")
	]).optional(),
	clawhubTrustDisposition: union([
		literal("clean"),
		literal("review-recommended"),
		literal("review-required"),
		literal("blocked")
	]).optional(),
	clawhubTrustScanStatus: string().optional(),
	clawhubTrustModerationState: string().optional(),
	clawhubTrustReasons: array(string()).optional(),
	clawhubTrustPending: boolean().optional(),
	clawhubTrustStale: boolean().optional(),
	clawhubTrustCheckedAt: string().optional(),
	clawhubTrustAcknowledgedAt: string().optional(),
	artifactKind: union([literal("legacy-zip"), literal("npm-pack")]).optional(),
	artifactFormat: union([literal("zip"), literal("tgz")]).optional(),
	npmIntegrity: string().optional(),
	npmShasum: string().optional(),
	npmTarballName: string().optional(),
	clawpackSha256: string().optional(),
	clawpackSpecVersion: number().int().nonnegative().optional(),
	clawpackManifestSha256: string().optional(),
	clawpackSize: number().int().nonnegative().optional(),
	gitUrl: string().optional(),
	gitRef: string().optional(),
	gitCommit: string().optional()
};
object(InstallRecordShape);
const PluginInstallRecordShape = {
	...InstallRecordShape,
	source: PluginInstallSourceSchema,
	marketplaceName: string().optional(),
	marketplaceSource: string().optional(),
	marketplacePlugin: string().optional(),
	acceptedSurface: object({
		channels: array(string().min(1)),
		providers: array(string().min(1)),
		tools: array(string().min(1)),
		contracts: array(string().min(1)),
		hooks: array(string().min(1)),
		mcpServers: array(string().min(1)),
		cliCommands: array(string().min(1)),
		cliBackends: array(string().min(1)),
		skills: array(string().min(1)),
		dangerousConfigFlags: array(string().min(1))
	}).strict().optional(),
	acceptedSurfaceHash: string().optional(),
	acceptedSurfaceAt: string().optional(),
	acceptedSurfaceIntegrity: string().optional()
};
//#endregion
//#region src/config/plugin-install-record-map.ts
const PluginInstallRecordSchema = object(PluginInstallRecordShape).passthrough();
const NORMALIZED_STRING_FIELDS = [
	"spec",
	"sourcePath",
	"installPath",
	"version",
	"resolvedName",
	"resolvedVersion",
	"resolvedSpec",
	"integrity",
	"shasum",
	"resolvedAt",
	"installedAt",
	"clawhubUrl",
	"clawhubPackage",
	"clawhubFamily",
	"clawhubChannel",
	"clawhubTrustDisposition",
	"clawhubTrustScanStatus",
	"clawhubTrustModerationState",
	"clawhubTrustCheckedAt",
	"clawhubTrustAcknowledgedAt",
	"artifactKind",
	"artifactFormat",
	"npmIntegrity",
	"npmShasum",
	"npmTarballName",
	"clawpackSha256",
	"clawpackManifestSha256",
	"gitUrl",
	"gitRef",
	"gitCommit",
	"marketplaceName",
	"marketplaceSource",
	"marketplacePlugin",
	"acceptedSurfaceHash",
	"acceptedSurfaceAt",
	"acceptedSurfaceIntegrity"
];
new TextEncoder();
function createPluginInstallRecordMap() {
	return Object.create(null);
}
function setPluginInstallRecordMapEntry(records, pluginId, record) {
	Object.defineProperty(records, pluginId, {
		configurable: true,
		enumerable: true,
		value: record,
		writable: true
	});
}
function getPluginInstallRecordMapEntry(records, pluginId) {
	return records && Object.hasOwn(records, pluginId) ? records[pluginId] : void 0;
}
function copyPluginInstallRecordMap(records) {
	const copied = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(records ?? {})) setPluginInstallRecordMapEntry(copied, pluginId, record);
	return copied;
}
function parsePluginInstallRecord(value) {
	const parsed = PluginInstallRecordSchema.safeParse(value);
	if (!parsed.success) return null;
	const record = parsed.data;
	for (const field of NORMALIZED_STRING_FIELDS) {
		const fieldValue = record[field];
		if (typeof fieldValue !== "string") continue;
		const normalized = fieldValue.trim();
		if (normalized) record[field] = normalized;
		else delete record[field];
	}
	if (record.clawhubTrustReasons) {
		const reasons = record.clawhubTrustReasons.map((entry) => entry.trim()).filter(Boolean);
		if (reasons.length > 0) record.clawhubTrustReasons = reasons;
		else delete record.clawhubTrustReasons;
	}
	return record;
}
function parsePluginInstallRecordMap(value) {
	if (!isRecord(value)) return null;
	const records = createPluginInstallRecordMap();
	for (const [pluginId, rawRecord] of Object.entries(value)) {
		const record = parsePluginInstallRecord(rawRecord);
		if (!record) return null;
		setPluginInstallRecordMapEntry(records, pluginId, record);
	}
	return records;
}
function inspectPluginInstallRecordMap(value) {
	if (value === void 0) return { status: "missing" };
	const records = parsePluginInstallRecordMap(value);
	return records ? {
		status: "valid",
		records
	} : { status: "invalid" };
}
//#endregion
//#region src/plugins/doctor-contract-artifact.ts
/** Resolves the Doctor artifact shared by loading, index hashing, and freshness. */
const CONTRACT_API_EXTENSIONS = [
	".js",
	".mjs",
	".cjs",
	".ts",
	".mts",
	".cts"
];
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const ORDERED_EXTENSIONS = CURRENT_MODULE_PATH.includes(`${path.sep}dist${path.sep}`) || CURRENT_MODULE_PATH.includes(`${path.sep}dist-runtime${path.sep}`) ? CONTRACT_API_EXTENSIONS : [...CONTRACT_API_EXTENSIONS.slice(3), ...CONTRACT_API_EXTENSIONS.slice(0, 3)];
["doctor-contract-api", "contract-api"].map((basename) => {
	const rootPaths = ORDERED_EXTENSIONS.map((extension) => `${basename}${extension}`);
	return {
		rootPaths,
		paths: rootPaths.flatMap((filename) => [filename, path.join("dist", filename)])
	};
});
//#endregion
//#region src/infra/clawhub-spec.ts
/** Parses explicit `clawhub:<name>[@version]` package specs for ClawHub installs. */
function parseClawHubPluginSpec(raw) {
	const trimmed = raw.trim();
	if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("clawhub:")) return null;
	const spec = trimmed.slice(8).trim();
	if (!spec) return null;
	const atIndex = spec.lastIndexOf("@");
	if (atIndex <= 0) return { name: spec };
	if (atIndex >= spec.length - 1) return null;
	const name = spec.slice(0, atIndex).trim();
	const version = spec.slice(atIndex + 1).trim();
	if (!name || !version) return null;
	return {
		name,
		version
	};
}
//#endregion
//#region src/plugins/manifest-install-owner.ts
const PLUGIN_MANIFEST_INSTALL_OWNER = Symbol.for("openclaw.pluginManifestInstallOwner");
function recordPluginManifestInstallOwner(record, installOwner, ambiguous = false) {
	if (!installOwner && !ambiguous) return record;
	Object.defineProperty(record, PLUGIN_MANIFEST_INSTALL_OWNER, {
		configurable: false,
		enumerable: true,
		value: ambiguous ? { ambiguous: true } : { installOwner }
	});
	return record;
}
path.join("plugins", "installs.json");
function resolveStoreEnv(options) {
	const env = options.env ?? process.env;
	if (options.stateDir) return {
		...env,
		OPENCLAW_STATE_DIR: options.stateDir
	};
	if (hasActivePluginInstallRoots()) return {
		...env,
		OPENCLAW_STATE_DIR: resolveActivePluginInstallRoots(env).stateDir
	};
	return env;
}
/** Resolves the canonical SQLite-backed installed plugin index path. */
function resolveInstalledPluginIndexStorePath(options = {}) {
	if (options.filePath) return options.filePath;
	return resolveOpenClawStateSqlitePath(resolveStoreEnv(options));
}
/** Resolves state database options for the installed plugin index store. */
function resolveInstalledPluginIndexStateDatabaseOptions(options = {}) {
	if (options.filePath) return {
		...options.env ? { env: options.env } : {},
		path: options.filePath
	};
	return { env: resolveStoreEnv(options) };
}
//#endregion
//#region src/plugins/installed-plugin-index-record-state.ts
/** Read failures must escape before either projection can authorize recovery or rebuilding. */
function readPersistedInstalledPluginIndexRowSync(options) {
	if (options.filePath?.endsWith(".json")) return;
	return readPluginMetadataStateRowSync("installed-index", resolveInstalledPluginIndexStateDatabaseOptions(options), options.artifactPreservingReadOnly);
}
/** Share the SQLite row while validating install records independently from index metadata. */
function getPersistedInstalledPluginIndexCacheEntry(options, readRow = () => readPersistedInstalledPluginIndexRowSync(options)) {
	const cache = getPluginCache().persistedInstalledIndex;
	const key = path.resolve(resolveInstalledPluginIndexStorePath(options));
	const current = cache.get(key);
	if (current && "value" in current) return current.value;
	const row = readRow();
	const entry = { state: row ? {
		status: "present",
		value: safeParseJson(row.value_json)
	} : { status: "missing" } };
	cache.set(key, { value: entry });
	return entry;
}
function inspectPersistedInstalledPluginIndexInstallRecords(entry) {
	if (!entry.records) {
		const state = entry.state;
		const records = (state.status === "present" ? state.value : void 0)?.index?.installRecords;
		entry.records = state.status === "missing" ? { status: "missing" } : records === void 0 ? { status: "invalid" } : inspectPluginInstallRecordMap(records);
	}
	return entry.records;
}
function inspectPersistedInstalledPluginIndexInstallRecordsSync(options = {}) {
	return inspectPersistedInstalledPluginIndexInstallRecords(getPersistedInstalledPluginIndexCacheEntry(options));
}
//#endregion
//#region src/plugins/npm-project-roots.ts
function isMissing(error) {
	return isNotFoundPathError(error);
}
function sortPaths(paths) {
	return paths.toSorted((left, right) => left.localeCompare(right));
}
/** Lists project-level npm roots managed below the plugin npm root. */
function listManagedPluginNpmProjectRootsSync(npmRoot) {
	const projectsDir = resolvePluginNpmProjectsDir(npmRoot);
	try {
		return sortPaths(fsSync.readdirSync(projectsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => path.join(projectsDir, entry.name)));
	} catch (error) {
		if (isMissing(error)) return [];
		throw error;
	}
}
//#endregion
//#region src/plugins/managed-npm-retention.ts
const RETAINED_MANAGED_NPM_INSTALL_MARKER_DIR = ".openclaw-retained-npm-installs";
function resolveRetainedManagedNpmInstallPackageInfo(packageDir) {
	const resolvedPackageDir = path.resolve(packageDir);
	const packageBase = path.basename(resolvedPackageDir);
	const parentDir = path.dirname(resolvedPackageDir);
	const parentBase = path.basename(parentDir);
	const scopedPackage = parentBase.startsWith("@");
	const nodeModulesRoot = scopedPackage ? path.dirname(parentDir) : parentDir;
	if (path.basename(nodeModulesRoot) !== "node_modules") return null;
	const packageName = scopedPackage ? `${parentBase}/${packageBase}` : packageBase;
	if (!packageBase || packageBase === "." || !packageName.trim()) return null;
	const projectRoot = path.dirname(nodeModulesRoot);
	return {
		packageName,
		projectRoot,
		markerPath: path.join(projectRoot, RETAINED_MANAGED_NPM_INSTALL_MARKER_DIR, `${safePathSegmentHashed(packageName)}.json`)
	};
}
function hasRetainedManagedNpmInstallMarker(packageDir) {
	const info = resolveRetainedManagedNpmInstallPackageInfo(packageDir);
	return info ? fsSync.existsSync(info.markerPath) : false;
}
//#endregion
//#region src/plugins/installed-plugin-index-record-reader.ts
/** Reads installed-index records back into manifest registry records. */
function copyInstallRecords(records) {
	return copyPluginInstallRecordMap(records);
}
const BLOCKED_RECORD_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
function isSafeRecordKey(key) {
	return !BLOCKED_RECORD_KEYS.has(key);
}
function readJsonObjectFileSync(filePath) {
	const parsed = tryReadJsonSync(filePath);
	return isRecord(parsed) ? parsed : null;
}
function readStringRecord(value) {
	if (!isRecord(value)) return {};
	const record = {};
	for (const [key, raw] of Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (!isSafeRecordKey(key)) continue;
		if (typeof raw === "string" && raw.trim()) record[key] = raw.trim();
	}
	return record;
}
function hasPackagePluginMetadata(manifest) {
	const openclaw = manifest.openclaw;
	if (!isRecord(openclaw)) return false;
	const extensions = openclaw.extensions;
	return Array.isArray(extensions) && extensions.some((entry) => typeof entry === "string");
}
function readManifestPluginId(packageDir) {
	const manifest = readJsonObjectFileSync(path.join(packageDir, "openclaw.plugin.json"));
	return (typeof manifest?.id === "string" ? manifest.id.trim() : "") || void 0;
}
function resolveRecoveredManagedNpmRoot(options = {}) {
	return path.resolve(options.stateDir ? path.join(options.stateDir, "npm") : resolveDefaultPluginNpmDir(options.env));
}
function resolveRecoveredManagedNpmPluginId(params) {
	const packageManifest = readJsonObjectFileSync(path.join(params.packageDir, "package.json"));
	if (!packageManifest || !hasPackagePluginMetadata(packageManifest)) return;
	const packageName = typeof packageManifest.name === "string" && packageManifest.name.trim() ? packageManifest.name.trim() : params.packageName;
	const pluginId = readManifestPluginId(params.packageDir) ?? packageName;
	return validatePluginId(pluginId) ? void 0 : pluginId;
}
function readManagedNpmInstallTimestampMs(params) {
	const timestampPaths = params.sharedLegacyRoot ? [params.packageDir] : [path.join(params.projectRoot, "package.json"), params.projectRoot];
	for (const filePath of timestampPaths) try {
		return fsSync.statSync(filePath).mtimeMs;
	} catch {}
	return 0;
}
function buildRecoveredManagedNpmInstallCandidatesForRoot(params) {
	const dependencies = readStringRecord(readJsonObjectFileSync(path.join(params.projectRoot, "package.json"))?.dependencies);
	const candidates = [];
	for (const [packageName, dependencySpec] of Object.entries(dependencies)) {
		const packageDir = path.join(params.projectRoot, "node_modules", ...packageName.split("/"));
		let stat;
		try {
			stat = fsSync.statSync(packageDir);
		} catch {
			continue;
		}
		if (!stat.isDirectory()) continue;
		if (hasRetainedManagedNpmInstallMarker(packageDir)) continue;
		const pluginId = resolveRecoveredManagedNpmPluginId({
			packageName,
			packageDir
		});
		if (!pluginId) continue;
		const packageManifest = readJsonObjectFileSync(path.join(packageDir, "package.json"));
		const version = typeof packageManifest?.version === "string" && packageManifest.version.trim() ? packageManifest.version.trim() : void 0;
		candidates.push({
			pluginId,
			installTimestampMs: readManagedNpmInstallTimestampMs({
				packageDir,
				projectRoot: params.projectRoot,
				sharedLegacyRoot: params.sharedLegacyRoot
			}),
			installRecord: {
				source: "npm",
				spec: `${packageName}@${dependencySpec}`,
				installPath: packageDir,
				...version ? {
					version,
					resolvedName: packageName,
					resolvedVersion: version
				} : {},
				...version ? { resolvedSpec: `${packageName}@${version}` } : {}
			}
		});
	}
	return candidates;
}
/** Lists recoverable managed npm installs without assigning active precedence. */
function listRecoveredManagedNpmInstallCandidates(options = {}) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	return [...buildRecoveredManagedNpmInstallCandidatesForRoot({
		projectRoot: npmRoot,
		sharedLegacyRoot: true
	}), ...listManagedPluginNpmProjectRootsSync(npmRoot).flatMap((projectRoot) => buildRecoveredManagedNpmInstallCandidatesForRoot({
		projectRoot,
		sharedLegacyRoot: false
	}))];
}
function recordsShareInstallPath(left, right) {
	if (!left?.installPath || !right.installPath) return false;
	return normalizeInstallPathForComparison(left.installPath) === normalizeInstallPathForComparison(right.installPath);
}
function normalizeInstallPathForComparison(filePath) {
	const resolved = path.resolve(filePath);
	return process.platform === "win32" ? normalizeWindowsPathForComparison(resolved) : resolved;
}
function pickMostRecentRecoveredManagedNpmCandidate(candidates) {
	return candidates.toSorted((left, right) => {
		const byTimestamp = right.installTimestampMs - left.installTimestampMs;
		if (byTimestamp !== 0) return byTimestamp;
		return (right.installRecord.installPath ?? "").localeCompare(left.installRecord.installPath ?? "");
	})[0];
}
function emitManagedNpmRecoveryFallbackWarning(params) {
	process.emitWarning(`Managed npm recovery found ${params.candidates.length} installs for plugin "${params.pluginId}" without an authoritative active path; selected the most recently installed candidate. Run \`openclaw doctor --fix\` to persist and retire stale generations.`, {
		code: "OPENCLAW_PLUGIN_INSTALL_RECOVERY_FALLBACK",
		type: "OpenClawPluginRecoveryWarning",
		detail: JSON.stringify({
			pluginId: params.pluginId,
			selectedInstallPath: params.selected.installRecord.installPath,
			candidates: params.candidates.map((candidate) => ({
				installPath: candidate.installRecord.installPath,
				installTimestampMs: candidate.installTimestampMs
			}))
		})
	});
}
function buildRecoveredManagedNpmInstallRecords(persisted, options = {}) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	const records = createPluginInstallRecordMap();
	const candidatesByPluginId = /* @__PURE__ */ new Map();
	for (const candidate of listRecoveredManagedNpmInstallCandidates(options)) {
		const candidates = candidatesByPluginId.get(candidate.pluginId) ?? [];
		candidates.push(candidate);
		candidatesByPluginId.set(candidate.pluginId, candidates);
	}
	for (const [pluginId, candidates] of candidatesByPluginId) {
		const persistedRecord = getPluginInstallRecordMapEntry(persisted ?? void 0, pluginId);
		const authoritative = candidates.find((candidate) => recordsShareInstallPath(persistedRecord, candidate.installRecord));
		const selected = authoritative ?? pickMostRecentRecoveredManagedNpmCandidate(candidates);
		setPluginInstallRecordMapEntry(records, pluginId, selected.installRecord);
		const recoversUnavailableManagedPath = isUnavailableManagedNpmInstallRecord({
			npmRoot,
			persisted: persistedRecord,
			recovered: selected.installRecord
		});
		if (!authoritative && candidates.length > 1 && (!persistedRecord || recoversUnavailableManagedPath)) emitManagedNpmRecoveryFallbackWarning({
			pluginId,
			selected,
			candidates
		});
	}
	return records;
}
function readInstallRecordVersion(record) {
	return record?.resolvedVersion ?? record?.version;
}
function isUnavailableManagedNpmInstallRecord(params) {
	const installPath = params.persisted?.installPath;
	if (params.persisted?.source !== "npm" || !installPath) return false;
	try {
		if (fsSync.statSync(installPath).isDirectory()) return false;
	} catch (error) {
		if (!isNotFoundPathError(error)) return false;
	}
	const packageInfo = resolveRetainedManagedNpmInstallPackageInfo(installPath);
	if (!packageInfo || packageInfo.packageName !== params.recovered.resolvedName) return false;
	const npmRoot = normalizeInstallPathForComparison(params.npmRoot);
	return normalizeInstallPathForComparison(packageInfo.projectRoot) === npmRoot || normalizeInstallPathForComparison(path.dirname(packageInfo.projectRoot)) === normalizeInstallPathForComparison(resolvePluginNpmProjectsDir(params.npmRoot));
}
function mergeRecoveredManagedNpmMetadata(persisted, recovered, options = {}) {
	const next = {
		...persisted,
		...recovered
	};
	if (options.preservePersistedSpec) {
		const persistedSpec = persisted.spec ? parseRegistryNpmSpec(persisted.spec) : null;
		const selectorIsCompatible = persistedSpec !== null && isPrereleaseResolutionAllowed({
			spec: persistedSpec,
			resolvedVersion: recovered.resolvedVersion
		}) && (persistedSpec.selectorKind !== "exact-version" || persistedSpec.selector !== void 0 && recovered.resolvedVersion !== void 0 && compareValidSemver(persistedSpec.selector, recovered.resolvedVersion) === 0);
		if (persistedSpec?.name === recovered.resolvedName && selectorIsCompatible) next.spec = persisted.spec;
	}
	delete next.integrity;
	delete next.shasum;
	delete next.resolvedAt;
	delete next.installedAt;
	return next;
}
function mergeRecoveredManagedNpmRecord(params) {
	if (params.persisted && isUnavailableManagedNpmInstallRecord(params)) return mergeRecoveredManagedNpmMetadata(params.persisted, params.recovered, { preservePersistedSpec: true });
	const persistedVersion = readInstallRecordVersion(params.persisted);
	const recoveredVersion = readInstallRecordVersion(params.recovered);
	if (params.persisted?.source === "npm" && recordsShareInstallPath(params.persisted, params.recovered) && recoveredVersion && persistedVersion !== recoveredVersion) return mergeRecoveredManagedNpmMetadata(params.persisted, params.recovered);
	return params.persisted ?? params.recovered;
}
/** Merges persisted records with managed npm installs recovered from the current root. */
function mergeRecoveredManagedNpmInstallRecords(persisted, options) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	const recovered = buildRecoveredManagedNpmInstallRecords(persisted, options);
	const merged = copyPluginInstallRecordMap(persisted ?? void 0);
	for (const [pluginId, record] of Object.entries(recovered)) setPluginInstallRecordMapEntry(merged, pluginId, mergeRecoveredManagedNpmRecord({
		npmRoot,
		persisted: getPluginInstallRecordMapEntry(merged, pluginId),
		recovered: record
	}));
	return merged;
}
function requireLoadablePluginInstallRecordState(state) {
	if (state.status === "invalid") throw new Error("Persisted plugin install records are invalid. Run openclaw doctor to inspect and repair plugin installation state.");
	return state.status === "valid" ? state.records : null;
}
function resolveInstallRecordsCacheKey(options) {
	return [path.resolve(resolveInstalledPluginIndexStorePath(options)), resolveRecoveredManagedNpmRoot(options)].join("\0");
}
/** Synchronously loads installed plugin records, recovering managed npm installs and caching them. */
function loadInstalledPluginIndexInstallRecordsSync(params = {}) {
	const cacheKey = resolveInstallRecordsCacheKey(params);
	const cache = getPluginCache().installRecords;
	const cached = cache.get(cacheKey);
	if (cached) return copyInstallRecords(cached);
	const records = mergeRecoveredManagedNpmInstallRecords(requireLoadablePluginInstallRecordState(inspectPersistedInstalledPluginIndexInstallRecordsSync(params)), params);
	cache.set(cacheKey, records);
	return copyInstallRecords(records);
}
//#endregion
//#region src/plugins/official-external-install-records.ts
function resolveNpmSpecPackageName(spec) {
	return spec ? parseRegistryNpmSpec(spec)?.name : void 0;
}
function resolveClawHubSpecPackageName(spec) {
	return spec ? parseClawHubPluginSpec(spec)?.name : void 0;
}
function resolveExactNpmPackageName(value) {
	const packageName = resolveNpmSpecPackageName(value);
	return packageName && value.trim() === packageName ? packageName : void 0;
}
function resolveUnanimousRecordedNpmPackageName(record) {
	if (record.source !== "npm") return;
	const packageNames = [];
	const fields = [
		[record.spec, resolveNpmSpecPackageName],
		[record.resolvedName, resolveExactNpmPackageName],
		[record.resolvedSpec, resolveNpmSpecPackageName]
	];
	for (const [value, resolvePackageName] of fields) {
		if (value === void 0) continue;
		const packageName = resolvePackageName(value);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	return packageNames.length > 0 && new Set(packageNames).size === 1 ? packageNames[0] : void 0;
}
function hasTrustedOfficialNpmProvenance(record) {
	return record.source === "npm" && record.artifactKind === void 0 && record.sourcePath === void 0;
}
function resolveRecordedClawHubPackageNames(record) {
	const packageNames = [];
	if (record.clawhubPackage !== void 0) {
		const packageName = resolveExactNpmPackageName(record.clawhubPackage);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	if (record.spec !== void 0) {
		const packageName = resolveClawHubSpecPackageName(record.spec);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	if (record.resolvedSpec !== void 0) {
		const packageName = resolveClawHubSpecPackageName(record.resolvedSpec) ?? resolveNpmSpecPackageName(record.resolvedSpec);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	if (record.resolvedName !== void 0) {
		const packageName = resolveExactNpmPackageName(record.resolvedName);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	return packageNames;
}
function isOfficialClawHubInstallRecord(record) {
	if (record.source !== "clawhub" || record.clawhubChannel !== "official") return false;
	return (record.clawhubUrl ?? "").trim().replace(/\/+$/, "") === "https://clawhub.ai";
}
/** Resolves one package identity from a current trusted official ClawHub install record. */
function resolveTrustedOfficialClawHubPackageName(record) {
	if (!isOfficialClawHubInstallRecord(record)) return;
	const packageNames = resolveRecordedClawHubPackageNames(record);
	if (!packageNames || packageNames.length === 0 || new Set(packageNames).size !== 1) return;
	return packageNames[0];
}
/** Binds official trust to the actual package and consistent recorded source identity. */
function isTrustedOfficialPluginInstallRecord(params) {
	const packageName = params.packageName?.trim();
	const entry = packageName ? getOfficialExternalPluginCatalogEntryForPackage(packageName) : void 0;
	if (!entry || resolveOfficialExternalPluginId(entry) !== params.pluginId && !resolveOfficialExternalPluginLegacyIds(entry).includes(params.pluginId)) return false;
	const install = resolveOfficialExternalPluginInstall(entry);
	const record = params.record;
	if (record.source === "npm") return hasTrustedOfficialNpmProvenance(record) && resolveNpmSpecPackageName(install?.npmSpec) === packageName && resolveUnanimousRecordedNpmPackageName(record) === packageName && (record.clawhubPackage === void 0 || resolveExactNpmPackageName(record.clawhubPackage) === packageName);
	return Boolean(install?.clawhubSpec || install?.npmSpec) && (record.clawhubPackage !== void 0 || record.spec !== void 0) && resolveTrustedOfficialClawHubPackageName(record) === packageName;
}
//#endregion
//#region src/plugins/installed-plugin-record-match.ts
function resolveCandidateInstallOwner(params) {
	if (isPluginCandidateInstallOwnerAmbiguous(params.candidate)) return;
	const installOwner = resolvePluginCandidateInstallOwner(params.candidate);
	if (installOwner) return Object.hasOwn(params.installRecords, installOwner) ? installOwner : void 0;
}
function matchesInstalledPluginRecord(params) {
	if (params.candidate.origin !== "global" && params.candidate.origin !== "config") return false;
	const installOwner = resolveCandidateInstallOwner(params);
	const record = installOwner ? params.installRecords[installOwner] : void 0;
	if (!record) return false;
	const candidatePaths = [
		params.candidate.rootDir,
		params.candidate.packageDir,
		params.candidate.source,
		params.candidate.setupSource
	].filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => {
		const resolved = resolveUserPath(entry, params.env);
		return pluginCacheRealpathSync(resolved) ?? resolved;
	});
	const trackedPaths = (params.installPathOnly ? [record.installPath] : [record.installPath, record.sourcePath]).filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => {
		const resolved = resolveUserPath(entry, params.env);
		return pluginCacheRealpathSync(resolved) ?? resolved;
	});
	if (candidatePaths.length === 0 || trackedPaths.length === 0) return false;
	return trackedPaths.some((trackedPath) => candidatePaths.some((candidatePath) => candidatePath === trackedPath || isPathInside(trackedPath, candidatePath) || isPathInside(candidatePath, trackedPath)));
}
function resolvePluginTrust(params) {
	const installOwner = resolveCandidateInstallOwner(params);
	const record = installOwner ? params.installRecords[installOwner] : void 0;
	const origin = params.candidate.origin;
	let reason;
	if (origin === "bundled") reason = "bundled";
	else if (isPluginCandidateInstallOwnerAmbiguous(params.candidate)) reason = "owner-ambiguous";
	else if (origin === "workspace" || record?.source === "path" || record?.source === "npm" && (record.artifactKind !== void 0 || record.sourcePath !== void 0)) reason = "origin-path";
	else if (!record || !installOwner) reason = "record-missing";
	else if (!matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.candidate,
		env: params.env,
		installRecords: params.installRecords,
		installPathOnly: true
	})) reason = "install-path-mismatch";
	else if (isTrustedOfficialPluginInstallRecord({
		pluginId: installOwner,
		packageName: params.candidate.packageName,
		record
	})) reason = "trusted-official";
	else if (record.source === "npm" && record.spec === void 0 && record.resolvedName === void 0 && record.resolvedSpec === void 0 || record.source === "clawhub" && record.clawhubUrl === void 0 && record.clawhubChannel === void 0) reason = "provenance-missing";
	else reason = "provenance-invalid";
	return {
		reason,
		registryPath: params.registryPath,
		origin,
		installSource: record?.source,
		installSpec: record?.spec === void 0 ? void 0 : redactSensitiveText(record.spec, { mode: "tools" })
	};
}
//#endregion
//#region packages/gateway-protocol/src/svg-image.ts
const SVG_PROLOGUE_WHITESPACE_RE = /\s*/y;
function skipSvgPrologueWhitespace(text, index) {
	SVG_PROLOGUE_WHITESPACE_RE.lastIndex = index;
	SVG_PROLOGUE_WHITESPACE_RE.exec(text);
	return SVG_PROLOGUE_WHITESPACE_RE.lastIndex;
}
function startsWithToken(text, index, token) {
	return text.slice(index, index + token.length).toLowerCase() === token;
}
/**
* Recognizes an SVG root element after an optional XML declaration and comments.
*
* An index scan rather than a regex on purpose: the equivalent
* `(?:<!--[\s\S]*?-->\s*)*<svg` backtracks exponentially on comment-like bytes that
* never reach a root element, and these bytes arrive from remote icon and
* link-favicon responses on the Gateway's single event loop, so one crafted
* response would stall every session. A comment ends at its first `-->`, so text
* between a closed comment and the root element is rejected, not absorbed.
*/
function startsWithSvgRootElement(text) {
	let index = skipSvgPrologueWhitespace(text, 0);
	if (startsWithToken(text, index, "<?xml")) {
		const declarationEnd = text.indexOf(">", index);
		if (declarationEnd < 0) return false;
		index = skipSvgPrologueWhitespace(text, declarationEnd + 1);
	}
	while (startsWithToken(text, index, "<!--")) {
		const commentEnd = text.indexOf("-->", index + 4);
		if (commentEnd < 0) return false;
		index = skipSvgPrologueWhitespace(text, commentEnd + 3);
	}
	if (!startsWithToken(text, index, "<svg")) return false;
	const delimiter = text[index + 4];
	return delimiter === ">" || delimiter === "/" && text[index + 5] === ">" || delimiter !== void 0 && /\s/u.test(delimiter);
}
/**
* SVG images stay self-contained: no script, document expansion, embedded
* documents, or outbound fetches can reach the browser through an image route.
*/
function isSelfContainedSvg(text) {
	return !text.includes("\0") && !/<!doctype|<!entity/iu.test(text) && !/<\s*(?:script|foreignObject|image|use|iframe)\b/iu.test(text) && !/\b(?:href|xlink:href|src)\s*=/iu.test(text) && startsWithSvgRootElement(text);
}
//#endregion
//#region src/plugins/portable-icon-paths.ts
/** Package-local artwork contracts shared by discovery and package builders. */
const PORTABLE_PLUGIN_ICON_PATH = "assets/icon.png";
const PLUGIN_ACTIVITY_ICON_PATH = "assets/activity.svg";
const PLUGIN_TOOL_ACTIVITY_ICON_DIR = "assets/activity";
const PLUGIN_ACTIVITY_ICON_MAX_BYTES = 32768;
function isPluginActivityToolName(value) {
	return /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$/u.test(value);
}
//#endregion
//#region src/plugins/manifest-theme-definitions.ts
/** Capture palettes and artwork so a published generation never reads changed files. */
function loadManifestThemeDefinitions(params) {
	if (!params.themes?.length) return;
	return params.themes.flatMap((theme) => {
		try {
			if (params.pluginId === "user" || !isThemeId(`${params.pluginId}/${theme.id}`)) throw new Error("qualified theme ID must be portable, outside user/, and at most 256 characters");
			const file = readPluginCacheFile({
				rootDir: params.rootDir,
				relativePath: theme.source,
				rejectHardlinks: params.rejectHardlinks,
				maxBytes: MAX_THEME_DEFINITION_BYTES * 4
			});
			if (!file.ok) throw new Error("source must be a readable JSON file inside the plugin root");
			const definition = normalizeThemeDefinition(JSON.parse(file.contents.toString("utf8")), {
				hatIds: Object.keys(theme.hats ?? {}),
				critterIds: Object.keys(theme.critters ?? {})
			});
			if (definition.name !== theme.name || definition.description !== theme.description) throw new Error("name and description must match the manifest declaration");
			const readSvg = (source) => {
				const svgFile = readPluginCacheFile({
					rootDir: params.rootDir,
					relativePath: source,
					rejectHardlinks: params.rejectHardlinks,
					maxBytes: PLUGIN_ACTIVITY_ICON_MAX_BYTES
				});
				if (!svgFile.ok) throw new Error(`artwork ${source} must be a readable SVG inside the plugin root, at most ${PLUGIN_ACTIVITY_ICON_MAX_BYTES} bytes`);
				const svg = svgFile.contents.toString("utf8");
				if (!isSelfContainedSvg(svg)) throw new Error(`artwork ${source} must be a self-contained SVG`);
				return svg;
			};
			const artwork = {
				...theme.hats ? { hats: Object.fromEntries(Object.entries(theme.hats).map(([id, source]) => [id, { svg: readSvg(source) }])) } : {},
				...theme.critters ? { critters: Object.fromEntries(Object.entries(theme.critters).map(([id, { source, ...metadata }]) => [id, {
					svg: readSvg(source),
					...metadata
				}])) } : {}
			};
			return [{
				id: theme.id,
				definition,
				...theme.hats || theme.critters ? { artwork } : {}
			}];
		} catch (error) {
			params.diagnostics.push({
				level: "warn",
				pluginId: params.pluginId,
				message: `theme ${theme.id} is unavailable: ${error instanceof Error ? error.message : "invalid definition"}`
			});
			return [];
		}
	});
}
//#endregion
//#region src/plugins/manifest-record.ts
function resolvePluginSourcePath(sourcePath) {
	if (pluginCacheExistsSync(sourcePath)) return sourcePath;
	if (sourcePath.endsWith(".ts")) {
		const jsPath = sourcePath.slice(0, -3) + ".js";
		if (pluginCacheExistsSync(jsPath)) return jsPath;
	}
	return sourcePath;
}
function isPluginRootPath(params) {
	const resolvedTargetPath = path.resolve(params.targetPath);
	if (!isPathInside(path.resolve(params.rootPath), resolvedTargetPath)) return false;
	const targetRealPath = pluginCacheRealpathSync(resolvedTargetPath);
	if (!targetRealPath) return params.targetMustExist !== true;
	if (!isPathInside(params.rootRealPath, targetRealPath)) return false;
	if (params.rejectHardlinks === true) {
		const targetStat = pluginCacheStatSync(resolvedTargetPath);
		if (!targetStat || targetStat.nlink > 1) return false;
	}
	return true;
}
function resolveManifestPluginSourcePath(params) {
	const pushDiagnostic = () => {
		params.diagnostics.push({
			level: "warn",
			pluginId: sanitizeForLog(params.pluginId),
			source: sanitizeForLog(params.manifestPath),
			message: `plugin manifest ${params.entryName} must resolve inside the plugin root; ignoring entry`
		});
	};
	if (!params.entry || path.isAbsolute(params.entry)) {
		pushDiagnostic();
		return;
	}
	const rootPath = path.resolve(params.rootDir);
	const rootRealPath = pluginCacheRealpathSync(rootPath) ?? rootPath;
	const sourcePath = path.resolve(rootPath, params.entry);
	if (!isPluginRootPath({
		rootPath,
		targetPath: sourcePath,
		rootRealPath,
		rejectHardlinks: params.rejectHardlinks,
		targetMustExist: pluginCacheExistsSync(sourcePath)
	})) {
		pushDiagnostic();
		return;
	}
	const resolvedSourcePath = resolvePluginSourcePath(sourcePath);
	if (!isPluginRootPath({
		rootPath,
		targetPath: resolvedSourcePath,
		rootRealPath,
		rejectHardlinks: params.rejectHardlinks,
		targetMustExist: pluginCacheExistsSync(resolvedSourcePath)
	})) {
		pushDiagnostic();
		return;
	}
	return resolvedSourcePath;
}
function resolvePortablePluginIcons(params) {
	let root;
	const resolveIcon = (relativePath) => {
		const iconPath = path.resolve(params.rootDir, relativePath);
		const iconStat = pluginCacheLstatSync(iconPath);
		if (!iconStat?.isFile() || params.rejectHardlinks && iconStat.nlink > 1) return;
		if (!root) {
			const rootPath = path.resolve(params.rootDir);
			root = {
				path: rootPath,
				realPath: pluginCacheRealpathSync(rootPath) ?? rootPath
			};
		}
		return isPluginRootPath({
			rootPath: root.path,
			targetPath: iconPath,
			rootRealPath: root.realPath,
			rejectHardlinks: params.rejectHardlinks,
			targetMustExist: true
		}) ? iconPath : void 0;
	};
	const iconPath = resolveIcon(PORTABLE_PLUGIN_ICON_PATH);
	const activityIconPath = resolveIcon(PLUGIN_ACTIVITY_ICON_PATH);
	const directory = path.resolve(params.rootDir, PLUGIN_TOOL_ACTIVITY_ICON_DIR);
	if (!isPluginRootPath({
		rootPath: params.rootDir,
		rootRealPath: params.rootDir === root?.path ? root.realPath : pluginCacheRealpathSync(params.rootDir) ?? params.rootDir,
		targetPath: directory,
		targetMustExist: true
	})) return {
		iconPath,
		activityIconPath
	};
	let entries;
	try {
		entries = readPluginCacheDirectory(directory);
	} catch {
		return {
			iconPath,
			activityIconPath
		};
	}
	if (entries.length > 128) return {
		iconPath,
		activityIconPath
	};
	const paths = [];
	for (const name of entries.map((entry) => entry.name).toSorted()) {
		const toolName = name.endsWith(".svg") ? name.slice(0, -4) : "";
		if (!isPluginActivityToolName(toolName)) continue;
		const toolIconPath = resolveIcon(`${PLUGIN_TOOL_ACTIVITY_ICON_DIR}/${name}`);
		if (toolIconPath) paths.push([toolName, toolIconPath]);
	}
	return {
		iconPath,
		activityIconPath,
		...paths.length ? { toolActivityIconPaths: Object.fromEntries(paths) } : {}
	};
}
function normalizePreferredPluginIds(raw) {
	return normalizeOptionalTrimmedStringList(raw);
}
function mergePackageChannelMetaIntoChannelConfigs(params) {
	const channelId = params.packageChannel?.id?.trim();
	if (!channelId || isBlockedObjectKey$1(channelId) || !params.channelConfigs || !Object.hasOwn(params.channelConfigs, channelId)) return params.channelConfigs;
	const existing = params.channelConfigs[channelId];
	if (!existing) return params.channelConfigs;
	const label = existing.label ?? normalizeOptionalString(params.packageChannel?.label) ?? "";
	const description = existing.description ?? normalizeOptionalString(params.packageChannel?.blurb) ?? "";
	const preferOver = existing.preferOver ?? normalizePreferredPluginIds(params.packageChannel?.preferOver);
	const commands = existing.commands ?? normalizeManifestChannelCommandDefaults(params.packageChannel?.commands);
	const merged = Object.create(null);
	for (const [key, value] of Object.entries(params.channelConfigs)) if (!isBlockedObjectKey$1(key)) merged[key] = value;
	merged[channelId] = {
		...existing,
		...label ? { label } : {},
		...description ? { description } : {},
		...preferOver?.length ? { preferOver } : {},
		...commands ? { commands } : {}
	};
	return merged;
}
function mergeContractLists(left, right) {
	const merged = uniqueStrings([...left ?? [], ...right ?? []].map((value) => value.trim()).filter((value) => value.length > 0));
	return merged.length > 0 ? merged : void 0;
}
function mergeManifestContracts(manifestContracts, catalogContracts) {
	if (!catalogContracts) return manifestContracts;
	const contracts = {};
	for (const key of PLUGIN_MANIFEST_CONTRACT_KEYS) {
		const merged = mergeContractLists(manifestContracts?.[key], catalogContracts[key]);
		if (merged) contracts[key] = merged;
	}
	return Object.keys(contracts).length > 0 ? contracts : void 0;
}
function mergeCatalogChannelConfigs(params) {
	if (!params.catalogChannelConfigs) return params.manifestChannelConfigs;
	const merged = Object.create(null);
	for (const [key, value] of Object.entries(params.catalogChannelConfigs)) if (!isBlockedObjectKey$1(key)) merged[key] = value;
	for (const [key, value] of Object.entries(params.manifestChannelConfigs ?? {})) if (!isBlockedObjectKey$1(key)) {
		const catalogValue = merged[key];
		merged[key] = catalogValue ? {
			...catalogValue,
			...value,
			schema: value.schema ?? catalogValue.schema,
			...catalogValue.uiHints || value.uiHints ? { uiHints: {
				...catalogValue.uiHints,
				...value.uiHints
			} } : {},
			...value.runtime ?? catalogValue.runtime ? { runtime: value.runtime ?? catalogValue.runtime } : {},
			...value.label ?? catalogValue.label ? { label: value.label ?? catalogValue.label } : {},
			...value.description ?? catalogValue.description ? { description: value.description ?? catalogValue.description } : {},
			...value.preferOver ?? catalogValue.preferOver ? { preferOver: value.preferOver ?? catalogValue.preferOver } : {},
			...value.commands ?? catalogValue.commands ? { commands: value.commands ?? catalogValue.commands } : {}
		} : value;
	}
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function mergeManifestCatalog(manifestCatalog, officialCatalog) {
	const featuredCandidate = manifestCatalog?.featured ?? officialCatalog?.featured;
	const orderCandidate = manifestCatalog?.order ?? officialCatalog?.order;
	const featured = typeof featuredCandidate === "boolean" ? featuredCandidate : void 0;
	const order = typeof orderCandidate === "number" && Number.isFinite(orderCandidate) ? orderCandidate : void 0;
	if (featured === void 0 && order === void 0) return;
	return {
		...featured !== void 0 ? { featured } : {},
		...order !== void 0 ? { order } : {}
	};
}
function buildPluginManifestRecord(params) {
	const pluginId = params.candidate.effectivePluginId ?? params.manifest.id;
	const providerSourceEntry = params.manifest.providerCatalogEntry !== void 0 ? {
		entryName: "providerCatalogEntry",
		entry: params.manifest.providerCatalogEntry
	} : void 0;
	const manifestChannelConfigs = params.candidate.origin === "bundled" && params.bundledChannelConfigCollector ? params.bundledChannelConfigCollector({
		pluginDir: params.candidate.packageDir ?? params.candidate.rootDir,
		manifest: params.manifest,
		packageManifest: params.candidate.packageManifest
	}) : params.manifest.channelConfigs;
	const officialCatalogManifest = params.candidate.origin !== "bundled" ? getOfficialExternalPluginCatalogManifest(getOfficialExternalPluginCatalogEntryForPackage(params.candidate.packageName) ?? {}) : void 0;
	const channelConfigs = mergePackageChannelMetaIntoChannelConfigs({
		channelConfigs: mergeCatalogChannelConfigs({
			manifestChannelConfigs,
			catalogChannelConfigs: officialCatalogManifest?.channelConfigs
		}),
		packageChannel: params.candidate.packageManifest?.channel
	});
	const packageChannelCommands = normalizeManifestChannelCommandDefaults(params.candidate.packageManifest?.channel?.commands);
	return {
		id: pluginId,
		categories: params.manifest.categories,
		backupResources: params.manifest.backupResources,
		doctorContract: params.manifest.doctorContract,
		doctorHealthChecks: params.manifest.doctorHealthChecks,
		sessionRouteStateOwners: params.manifest.sessionRouteStateOwners,
		name: normalizeOptionalString(params.manifest.name) ?? params.candidate.packageName,
		description: normalizeOptionalString(params.manifest.description) ?? params.candidate.packageDescription,
		catalog: mergeManifestCatalog(params.manifest.catalog, officialCatalogManifest?.catalog),
		...resolvePortablePluginIcons({
			rootDir: params.candidate.rootDir,
			rejectHardlinks: params.rejectHardlinks
		}),
		version: normalizeOptionalString(params.manifest.version) ?? params.candidate.packageVersion,
		packageName: params.candidate.packageName,
		packageVersion: params.candidate.packageVersion,
		packageDescription: params.candidate.packageDescription,
		enabledByDefault: params.manifest.enabledByDefault === true ? true : void 0,
		enabledByDefaultOnPlatforms: params.manifest.enabledByDefaultOnPlatforms,
		autoEnableWhenConfiguredProviders: params.manifest.autoEnableWhenConfiguredProviders,
		legacyPluginIds: params.manifest.legacyPluginIds,
		format: params.candidate.format ?? "openclaw",
		bundleFormat: params.candidate.bundleFormat,
		kind: params.manifest.kind,
		channels: params.manifest.channels ?? [],
		channelAccountKeyPolicies: params.manifest.channelAccountKeyPolicies,
		providers: params.manifest.providers ?? [],
		providerDiscoverySource: providerSourceEntry ? resolveManifestPluginSourcePath({
			rootDir: params.candidate.rootDir,
			manifestPath: params.manifestPath,
			pluginId,
			entryName: providerSourceEntry.entryName,
			entry: providerSourceEntry.entry,
			rejectHardlinks: params.rejectHardlinks,
			diagnostics: params.diagnostics
		}) : void 0,
		capabilityCatalogSource: params.manifest.capabilityCatalogEntry === void 0 ? void 0 : resolveManifestPluginSourcePath({
			rootDir: params.candidate.rootDir,
			manifestPath: params.manifestPath,
			pluginId,
			entryName: "capabilityCatalogEntry",
			entry: params.manifest.capabilityCatalogEntry,
			rejectHardlinks: params.rejectHardlinks,
			diagnostics: params.diagnostics
		}) ?? null,
		modelSupport: params.manifest.modelSupport,
		modelCatalog: params.manifest.modelCatalog,
		modelPricing: params.manifest.modelPricing,
		modelIdNormalization: params.manifest.modelIdNormalization,
		providerEndpoints: params.manifest.providerEndpoints,
		providerRequest: params.manifest.providerRequest,
		secretProviderIntegrations: params.manifest.secretProviderIntegrations,
		cliBackends: params.manifest.cliBackends ?? [],
		syntheticAuthRefs: params.manifest.syntheticAuthRefs ?? [],
		nonSecretAuthMarkers: params.manifest.nonSecretAuthMarkers ?? [],
		commandAliases: params.manifest.commandAliases,
		cliCommands: params.manifest.cliCommands,
		providerUsageAuthEnvVars: params.manifest.providerUsageAuthEnvVars,
		providerAuthAliases: params.manifest.providerAuthAliases,
		providerAuthChoices: params.manifest.providerAuthChoices,
		activation: params.manifest.activation,
		setup: params.manifest.setup,
		packageManifest: params.candidate.packageManifest,
		packageDependencies: params.candidate.packageDependencies,
		packageOptionalDependencies: params.candidate.packageOptionalDependencies,
		packageChannel: params.candidate.packageManifest?.channel,
		packageInstall: params.candidate.packageManifest?.install,
		trustedOfficialInstall: params.trust.reason === "trusted-official" ? true : void 0,
		trust: params.trust,
		qaRunners: params.manifest.qaRunners,
		dashboard: params.manifest.dashboard,
		controlUi: params.manifest.controlUi,
		themes: params.manifest.themes,
		themeDefinitions: loadManifestThemeDefinitions({
			pluginId,
			rootDir: params.candidate.rootDir,
			themes: params.manifest.themes,
			rejectHardlinks: params.rejectHardlinks,
			diagnostics: params.diagnostics
		}),
		mcpServers: params.manifest.mcpServers,
		skills: params.manifest.skills ?? [],
		settingsFiles: [],
		hooks: [],
		origin: params.candidate.origin,
		workspaceDir: params.candidate.workspaceDir,
		rootDir: params.candidate.rootDir,
		source: params.candidate.source,
		setupSource: params.candidate.setupSource,
		manifestPath: params.manifestPath,
		schemaCacheKey: params.schemaCacheKey,
		configSchema: params.configSchema,
		configUiHints: params.manifest.uiHints,
		configGroups: params.manifest.configGroups,
		contracts: mergeManifestContracts(params.manifest.contracts, officialCatalogManifest?.contracts),
		transcriptSources: params.manifest.transcriptSources,
		decisionModels: params.manifest.decisionModels,
		mediaUnderstandingProviderMetadata: params.manifest.mediaUnderstandingProviderMetadata,
		imageGenerationProviderMetadata: params.manifest.imageGenerationProviderMetadata,
		videoGenerationProviderMetadata: params.manifest.videoGenerationProviderMetadata,
		musicGenerationProviderMetadata: params.manifest.musicGenerationProviderMetadata,
		toolMetadata: params.manifest.toolMetadata,
		configContracts: params.manifest.configContracts,
		channelConfigs,
		...params.candidate.packageManifest?.channel?.id ? { channelCatalogMeta: {
			id: params.candidate.packageManifest.channel.id,
			...typeof params.candidate.packageManifest.channel.label === "string" ? { label: params.candidate.packageManifest.channel.label } : {},
			...typeof params.candidate.packageManifest.channel.blurb === "string" ? { blurb: params.candidate.packageManifest.channel.blurb } : {},
			...params.candidate.packageManifest.channel.preferOver ? { preferOver: params.candidate.packageManifest.channel.preferOver } : {},
			...packageChannelCommands ? { commands: packageChannelCommands } : {}
		} } : {}
	};
}
function buildBundleManifestRecord(params) {
	return {
		id: params.manifest.id,
		name: normalizeOptionalString(params.manifest.name) ?? params.candidate.idHint,
		description: normalizeOptionalString(params.manifest.description),
		...resolvePortablePluginIcons({
			rootDir: params.candidate.rootDir,
			rejectHardlinks: params.rejectHardlinks
		}),
		version: normalizeOptionalString(params.manifest.version),
		packageName: params.candidate.packageName,
		packageVersion: params.candidate.packageVersion,
		packageDescription: params.candidate.packageDescription,
		packageManifest: params.candidate.packageManifest,
		packageDependencies: params.candidate.packageDependencies,
		packageOptionalDependencies: params.candidate.packageOptionalDependencies,
		packageChannel: params.candidate.packageManifest?.channel,
		packageInstall: params.candidate.packageManifest?.install,
		format: "bundle",
		bundleFormat: params.candidate.bundleFormat,
		bundleCapabilities: params.manifest.capabilities,
		activation: params.manifest.activation,
		channels: [],
		providers: [],
		cliBackends: [],
		syntheticAuthRefs: [],
		nonSecretAuthMarkers: [],
		skills: params.manifest.skills ?? [],
		settingsFiles: params.manifest.settingsFiles ?? [],
		hooks: params.manifest.hooks ?? [],
		origin: params.candidate.origin,
		workspaceDir: params.candidate.workspaceDir,
		rootDir: params.candidate.rootDir,
		source: params.candidate.source,
		manifestPath: params.manifestPath,
		schemaCacheKey: void 0,
		configSchema: void 0,
		configUiHints: void 0,
		configContracts: void 0,
		channelConfigs: void 0
	};
}
//#endregion
//#region src/plugins/min-host-version.ts
/** Validation message for plugin minHostVersion manifest fields. */
const MIN_HOST_VERSION_FORMAT = "openclaw.install.minHostVersion must use a semver floor in the form \">=x.y.z[-prerelease][+build]\"";
const SEMVER_LABEL_RE = String.raw`\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?`;
const MIN_HOST_VERSION_RE = new RegExp(`^>=(${SEMVER_LABEL_RE})$`);
const LEGACY_MIN_HOST_VERSION_RE = new RegExp(`^(${SEMVER_LABEL_RE})$`);
/** Parses a plugin minHostVersion manifest field. */
function parseMinHostVersionRequirement(raw, options = {}) {
	if (typeof raw !== "string") return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const match = trimmed.match(MIN_HOST_VERSION_RE) ?? (options.allowLegacyBareSemver ? trimmed.match(LEGACY_MIN_HOST_VERSION_RE) : null);
	if (!match) return null;
	const minimumLabel = match[1] ?? "";
	if (!valid(minimumLabel)) return null;
	return {
		raw: trimmed,
		minimumLabel
	};
}
/** Checks whether the current host satisfies a plugin minHostVersion requirement. */
function checkMinHostVersion(params) {
	if (params.minHostVersion === void 0) return {
		ok: true,
		requirement: null
	};
	const requirement = parseMinHostVersionRequirement(params.minHostVersion, { allowLegacyBareSemver: params.allowLegacyBareSemver });
	if (!requirement) return {
		ok: false,
		kind: "invalid",
		error: MIN_HOST_VERSION_FORMAT
	};
	const currentVersion = normalizeOptionalString(params.currentVersion) || "unknown";
	const comparison = compareOpenClawVersions(currentVersion, requirement.minimumLabel);
	if (comparison === null) return {
		ok: false,
		kind: "unknown_host_version",
		requirement
	};
	if (comparison < 0) return {
		ok: false,
		kind: "incompatible",
		requirement,
		currentVersion
	};
	return {
		ok: true,
		requirement
	};
}
//#endregion
//#region src/plugins/manifest-registry-build.ts
const PLUGIN_ORIGIN_RANK = {
	config: 0,
	workspace: 1,
	global: 2,
	bundled: 3
};
function rejectCaseFoldedIdCollisions(records, diagnostics) {
	const recordsByPolicyId = /* @__PURE__ */ new Map();
	for (const record of records) {
		const policyId = normalizePluginPolicyId(record.id);
		const matches = recordsByPolicyId.get(policyId) ?? [];
		matches.push(record);
		recordsByPolicyId.set(policyId, matches);
	}
	const rejected = /* @__PURE__ */ new Set();
	for (const [policyId, matches] of recordsByPolicyId) {
		const declaredIds = [...new Set(matches.map((record) => record.id))].toSorted();
		if (declaredIds.length < 2) continue;
		const message = `plugin ids ${declaredIds.map((id) => JSON.stringify(id)).join(", ")} collide as normalized id ${JSON.stringify(policyId)}; refusing all colliding plugins`;
		for (const record of matches) {
			rejected.add(record);
			diagnostics.push({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message
			});
		}
	}
	return records.filter((record) => !rejected.has(record));
}
function pushNonBundledChannelConfigDescriptorDiagnostic(params) {
	if (params.record.origin === "bundled" || params.record.format === "bundle") return;
	const configuredEntry = params.normalized?.entries[params.record.id];
	if (params.normalized?.enabled === false || configuredEntry?.enabled === false || params.normalized?.deny.includes(params.record.id) || params.normalized?.allow.length && !params.normalized.allow.includes(params.record.id)) return;
	const declaredChannels = params.record.channels.map((channelId) => channelId.trim()).filter((channelId) => channelId.length > 0);
	if (declaredChannels.length === 0) return;
	const channelConfigs = params.record.channelConfigs ?? {};
	const missingChannels = declaredChannels.filter((channelId) => !Object.hasOwn(channelConfigs, channelId));
	if (missingChannels.length === 0) return;
	const safeMissingChannels = missingChannels.map(sanitizeForLog);
	params.diagnostics.push({
		level: "warn",
		pluginId: sanitizeForLog(params.record.id),
		source: sanitizeForLog(params.record.manifestPath),
		message: `channel plugin manifest declares ${safeMissingChannels.join(", ")} without channelConfigs metadata; add openclaw.plugin.json#channelConfigs so config schema and setup surfaces work before runtime loads. Channels without channelConfigs still appear in channel listings, but setup UI may be limited.`
	});
}
function dedupePluginDiagnostics(diagnostics, discoveryDiagnostics) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const diagnostic of diagnostics) {
		const key = JSON.stringify([
			diagnostic.level,
			diagnostic.pluginId ?? "",
			diagnostic.message,
			diagnostic.level === "error" || discoveryDiagnostics.has(diagnostic) ? diagnostic.source ?? "" : ""
		]);
		if (seen.has(key)) continue;
		seen.add(key);
		deduped.push(diagnostic);
	}
	return deduped;
}
function isStaleForeignBundledPin(params) {
	return isForeignBundledPluginRoot(params.candidate.rootDir, params.env) && !isBundledPluginInsideDevSourceRoot({
		rootDir: params.candidate.rootDir,
		env: params.env
	});
}
function resolveDuplicatePrecedenceRank(params) {
	if (params.candidate.origin === "config" || params.candidate.configSelected) return 0;
	if (params.candidate.origin === "bundled" && isBundledPluginInsideDevSourceRoot({
		rootDir: params.candidate.rootDir,
		env: params.env
	})) return 1;
	if (params.candidate.origin === "global" && !isStaleForeignBundledPin({
		candidate: params.candidate,
		env: params.env
	}) && matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.candidate,
		config: params.config,
		env: params.env,
		installRecords: params.installRecords
	})) return 2;
	if (params.candidate.origin === "bundled") return 3;
	if (params.candidate.origin === "workspace") return 4;
	return 5;
}
function isIntentionalInstalledBundledDuplicate(params) {
	const leftIsInstalled = matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.left,
		config: params.config,
		env: params.env,
		installRecords: params.installRecords
	});
	const rightIsInstalled = matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.right,
		config: params.config,
		env: params.env,
		installRecords: params.installRecords
	});
	return leftIsInstalled && !isStaleForeignBundledPin({
		candidate: params.left,
		env: params.env
	}) && params.right.origin === "bundled" && !isBundledPluginInsideDevSourceRoot({
		rootDir: params.right.rootDir,
		env: params.env
	}) || rightIsInstalled && !isStaleForeignBundledPin({
		candidate: params.right,
		env: params.env
	}) && params.left.origin === "bundled" && !isBundledPluginInsideDevSourceRoot({
		rootDir: params.left.rootDir,
		env: params.env
	});
}
function isSameGlobalPackageDuplicate(left, right) {
	if (left.origin !== "global" || right.origin !== "global") return false;
	const leftPackageName = normalizeOptionalString(left.packageName);
	const rightPackageName = normalizeOptionalString(right.packageName);
	if (!leftPackageName || leftPackageName !== rightPackageName) return false;
	const leftPackageVersion = normalizeOptionalString(left.packageVersion);
	const rightPackageVersion = normalizeOptionalString(right.packageVersion);
	return Boolean(leftPackageVersion && rightPackageVersion && leftPackageVersion === rightPackageVersion);
}
function buildPluginManifestRegistry(params) {
	const config = params.config ?? {};
	const normalized = normalizePluginsConfigWithResolverCore(config.plugins);
	const env = params.env ?? process.env;
	const registryPath = params.registryPath ?? resolveInstalledPluginIndexStorePath({ env });
	const { getInstallRecords } = params;
	const discovery = params.candidates ? {
		candidates: params.candidates,
		diagnostics: params.diagnostics ?? []
	} : params.discovery ?? discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		extraPaths: normalized.loadPaths,
		env,
		installRecords: getInstallRecords()
	});
	const discovered = new Set(discovery.diagnostics);
	const diagnostics = [...discovered];
	const candidates = discovery.candidates;
	const seenIds = /* @__PURE__ */ new Map();
	const currentHostVersion = resolveCompatibilityHostVersion(env);
	const explicitConfiguredFileSources = new Set(normalized.loadPaths.map((loadPath) => resolveUserPath(loadPath, env)).filter((loadPath) => pluginCacheStatSync(loadPath)?.isFile() === true).map((loadPath) => path.resolve(loadPath)));
	for (const candidate of candidates) {
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: candidate.origin,
			rootDir: candidate.rootDir,
			env
		});
		const isBundleRecord = (candidate.format ?? "openclaw") === "bundle";
		const isManifestlessConfiguredFile = candidate.origin === "config" && explicitConfiguredFileSources.has(path.resolve(candidate.source)) && !pluginCacheExistsSync(path.join(candidate.rootDir, "openclaw.plugin.json"));
		if (isManifestlessConfiguredFile && isCoreReservedPluginId(candidate.idHint)) {
			diagnostics.push({
				level: "error",
				pluginId: candidate.idHint,
				source: candidate.source,
				message: `plugin manifest id "${candidate.idHint}" is reserved by OpenClaw core`
			});
			continue;
		}
		const manifestRes = candidate.origin === "bundled" && candidate.bundledManifest && candidate.bundledManifestPath ? {
			ok: true,
			manifest: candidate.bundledManifest,
			manifestPath: candidate.bundledManifestPath
		} : isBundleRecord && candidate.bundleFormat ? loadBundleManifest({
			rootDir: candidate.rootDir,
			bundleFormat: candidate.bundleFormat,
			rejectHardlinks
		}) : isManifestlessConfiguredFile ? {
			ok: true,
			manifest: {
				id: candidate.idHint,
				configSchema: {
					type: "object",
					additionalProperties: false
				}
			},
			manifestPath: candidate.source
		} : loadPluginManifest(candidate.rootDir, rejectHardlinks);
		if (!manifestRes.ok) {
			diagnostics.push({
				level: "error",
				pluginId: candidate.diagnosticIdHint ?? candidate.idHint,
				message: manifestRes.error,
				source: manifestRes.manifestPath,
				..."diagnosticCode" in manifestRes && manifestRes.diagnosticCode ? { code: manifestRes.diagnosticCode } : {}
			});
			continue;
		}
		const manifest = manifestRes.manifest;
		const effectivePluginId = candidate.effectivePluginId ?? manifest.id;
		if (candidate.origin !== "bundled") {
			const packageManifestSource = path.join(candidate.packageDir ?? candidate.rootDir, "package.json");
			const allowLegacyBareMinHostVersion = candidate.origin === "global" && matchesInstalledPluginRecord({
				pluginId: effectivePluginId,
				candidate,
				config,
				env,
				installRecords: getInstallRecords()
			});
			const minHostVersionCheck = checkMinHostVersion({
				currentVersion: currentHostVersion,
				minHostVersion: candidate.packageManifest?.install?.minHostVersion,
				allowLegacyBareSemver: allowLegacyBareMinHostVersion
			});
			if (!minHostVersionCheck.ok) {
				diagnostics.push({
					level: minHostVersionCheck.kind === "invalid" ? "error" : "warn",
					pluginId: effectivePluginId,
					source: packageManifestSource,
					message: minHostVersionCheck.kind === "invalid" ? `plugin manifest invalid | ${minHostVersionCheck.error}` : minHostVersionCheck.kind === "unknown_host_version" ? `plugin requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host version could not be determined; skipping load` : `plugin requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host is ${minHostVersionCheck.currentVersion}; skipping load`
				});
				continue;
			}
			const packagePluginApiRangeCheck = resolvePackagePluginApiRange(candidate.packageManifest);
			if (!packagePluginApiRangeCheck.ok) {
				diagnostics.push({
					level: "error",
					pluginId: effectivePluginId,
					source: packageManifestSource,
					message: `plugin manifest invalid | ${packagePluginApiRangeCheck.error}`
				});
				continue;
			}
			const packagePluginApiRange = packagePluginApiRangeCheck.range;
			if (packagePluginApiRange && !satisfiesPluginApiRange(currentHostVersion, packagePluginApiRange)) {
				diagnostics.push({
					level: "warn",
					pluginId: effectivePluginId,
					source: packageManifestSource,
					message: `plugin requires plugin API ${packagePluginApiRange}, but this host is ${currentHostVersion}; skipping load (check "openclaw --version", OPENCLAW_COMPATIBILITY_HOST_VERSION, or run "openclaw doctor")`
				});
				continue;
			}
		}
		const configSchema = "configSchema" in manifest ? manifest.configSchema : void 0;
		const schemaCacheKey = (() => {
			if (!configSchema || isManifestlessConfiguredFile) return;
			const file = readPluginCacheFile({
				rootDir: candidate.rootDir,
				relativePath: path.relative(candidate.rootDir, manifestRes.manifestPath),
				rejectHardlinks,
				maxBytes: 262144
			});
			return file.ok ? `${manifestRes.manifestPath}:${file.hash}` : manifestRes.manifestPath;
		})();
		const record = isBundleRecord ? buildBundleManifestRecord({
			manifest,
			candidate,
			manifestPath: manifestRes.manifestPath,
			rejectHardlinks
		}) : buildPluginManifestRecord({
			manifest,
			candidate,
			manifestPath: manifestRes.manifestPath,
			diagnostics,
			rejectHardlinks,
			schemaCacheKey,
			configSchema,
			trust: resolvePluginTrust({
				registryPath,
				pluginId: effectivePluginId,
				candidate,
				env,
				installRecords: getInstallRecords()
			}),
			...params.bundledChannelConfigCollector ? { bundledChannelConfigCollector: params.bundledChannelConfigCollector } : {}
		});
		if (candidate.sourcePreferred || candidate.origin === "bundled" && candidate.configSelected) record.sourcePreferred = true;
		recordPluginManifestInstallOwner(record, resolvePluginCandidateInstallOwner(candidate), isPluginCandidateInstallOwnerAmbiguous(candidate));
		const existing = seenIds.get(effectivePluginId);
		if (existing) {
			const samePath = existing.candidate.rootDir === candidate.rootDir;
			if ((() => {
				if (samePath) return true;
				const existingReal = pluginCacheRealpathSync(existing.candidate.rootDir);
				const candidateReal = pluginCacheRealpathSync(candidate.rootDir);
				return Boolean(existingReal && candidateReal && existingReal === candidateReal);
			})()) {
				if (record.sourcePreferred || existing.record.sourcePreferred) {
					record.sourcePreferred = true;
					existing.record.sourcePreferred = true;
				}
				if (PLUGIN_ORIGIN_RANK[candidate.origin] < PLUGIN_ORIGIN_RANK[existing.candidate.origin]) seenIds.set(effectivePluginId, {
					candidate,
					record
				});
				continue;
			}
			const candidateWins = resolveDuplicatePrecedenceRank({
				pluginId: effectivePluginId,
				candidate,
				config,
				env,
				installRecords: getInstallRecords()
			}) < resolveDuplicatePrecedenceRank({
				pluginId: effectivePluginId,
				candidate: existing.candidate,
				config,
				env,
				installRecords: getInstallRecords()
			});
			const winnerCandidate = candidateWins ? candidate : existing.candidate;
			const overriddenCandidate = candidateWins ? existing.candidate : candidate;
			if (candidateWins) seenIds.set(effectivePluginId, {
				candidate,
				record
			});
			if (isIntentionalInstalledBundledDuplicate({
				pluginId: effectivePluginId,
				left: candidate,
				right: existing.candidate,
				config,
				env,
				installRecords: getInstallRecords()
			})) continue;
			if (isSameGlobalPackageDuplicate(candidate, existing.candidate)) continue;
			const staleForeignPin = winnerCandidate.origin === "bundled" && isStaleForeignBundledPin({
				candidate: overriddenCandidate,
				env
			}) && matchesInstalledPluginRecord({
				pluginId: effectivePluginId,
				candidate: overriddenCandidate,
				env,
				installRecords: getInstallRecords()
			});
			diagnostics.push({
				level: "warn",
				pluginId: effectivePluginId,
				source: overriddenCandidate.source,
				message: staleForeignPin ? `stale plugin install record: "${effectivePluginId}" is pinned to ${overriddenCandidate.rootDir}, which belongs to a different OpenClaw installation. This installation's bundled plugin is being used instead. No uninstall is needed to use the bundled plugin. Uninstalling, even with \`--keep-files\`, removes plugin configuration; re-enabling does not restore it.` : winnerCandidate.origin === "config" ? `duplicate plugin id resolved by explicit config-selected plugin; ${overriddenCandidate.origin} plugin will be overridden by config plugin (${winnerCandidate.source})` : `duplicate plugin id detected; ${overriddenCandidate.origin} plugin will be overridden by ${winnerCandidate.origin} plugin (${winnerCandidate.source})`
			});
			continue;
		}
		seenIds.set(effectivePluginId, {
			candidate,
			record
		});
	}
	const plugins = rejectCaseFoldedIdCollisions([...seenIds.values()].map(({ record }) => record), diagnostics);
	for (const record of plugins) pushNonBundledChannelConfigDescriptorDiagnostic({
		record,
		diagnostics,
		normalized
	});
	return {
		plugins,
		diagnostics: dedupePluginDiagnostics(diagnostics, discovered)
	};
}
//#endregion
//#region src/plugins/manifest-registry.ts
function loadPluginManifestRegistryCore(params = {}) {
	if (!params.candidates && !params.discovery && !params.installRecords) {
		const gatewaySnapshot = getGatewayPluginMetadataSnapshot();
		if (gatewaySnapshot) return gatewaySnapshot.manifestRegistry;
	}
	const env = params.env ?? process.env;
	let installRecords = params.installRecords;
	return buildPluginManifestRegistry({
		...params,
		env,
		getInstallRecords: () => installRecords ??= loadInstalledPluginIndexInstallRecordsSync({ env })
	});
}
//#endregion
//#region src/plugins/manifest-registry-installed.ts
function resolveInstalledManifestRegistryIndexFingerprint(index) {
	const facts = getInstalledPluginIndexFacts(index);
	const cached = facts?.fingerprint;
	if (cached) return cached;
	const fingerprint = hashStableJson({
		version: index.version,
		hostContractVersion: index.hostContractVersion,
		compatRegistryVersion: index.compatRegistryVersion,
		migrationVersion: index.migrationVersion,
		policyHash: index.policyHash,
		installRecords: index.installRecords,
		diagnostics: index.diagnostics,
		plugins: index.plugins.map(({ doctorContractFile: _doctorContractFile, packageBuild, ...plugin }) => ({
			...plugin,
			...packageBuild?.bundledDist === void 0 ? {} : { packageBuild: { bundledDist: packageBuild.bundledDist } }
		}))
	});
	if (facts) facts.fingerprint = fingerprint;
	return fingerprint;
}
//#endregion
//#region src/plugins/plugin-control-plane-context.ts
function resolveConfiguredPluginLoadPaths(config) {
	const paths = config?.plugins?.load?.paths;
	return Array.isArray(paths) ? paths : void 0;
}
/** Resolves plugin discovery roots and load paths for cache/fingerprint callers. */
function resolvePluginDiscoveryContext(params = {}) {
	return resolvePluginCacheInputs({
		env: params.env ?? process.env,
		workspaceDir: params.workspaceDir,
		loadPaths: params.loadPaths ?? resolveConfiguredPluginLoadPaths(params.config)
	});
}
/** Resolves a stable fingerprint for plugin control-plane activation state. */
function resolvePluginControlPlaneFingerprint(params = {}) {
	const inventoryFingerprint = params.inventoryFingerprint ?? (params.index ? resolveInstalledManifestRegistryIndexFingerprint(params.index) : void 0);
	return hashJson({
		discovery: resolvePluginDiscoveryContext(params),
		policyFingerprint: params.policyHash ?? resolveInstalledPluginIndexPolicyHash(params.config, params.env),
		...inventoryFingerprint ? { inventoryFingerprint } : {},
		...params.activationFingerprint ? { activationFingerprint: params.activationFingerprint } : {}
	});
}
//#endregion
//#region src/plugins/plugin-metadata-env.ts
const PLUGIN_METADATA_ENV_KEYS = [
	"ANDROID_DATA",
	"APPDATA",
	"HOME",
	"OPENCLAW_BUNDLED_PLUGINS_DIR",
	"OPENCLAW_COMPATIBILITY_HOST_VERSION",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_DEV_SOURCE_ROOT",
	"OPENCLAW_DISABLE_BUNDLED_PLUGINS",
	"OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS",
	"OPENCLAW_HOME",
	"OPENCLAW_NIX_MODE",
	"OPENCLAW_STATE_DIR",
	"PREFIX",
	"USERPROFILE",
	"XDG_CONFIG_HOME"
];
/** Compares discovery namespaces without resolving or probing filesystem roots. */
function resolvePluginMetadataEnvFingerprint(env = process.env) {
	return hashJson({
		env: Object.fromEntries(PLUGIN_METADATA_ENV_KEYS.flatMap((key) => {
			const value = env[key];
			return value === void 0 ? [] : [[key, value]];
		})),
		installRoots: hasActivePluginInstallRoots() ? resolveActivePluginInstallRoots() : void 0,
		trustBundledPluginsDirOverride: shouldTrustTestBundledPluginsDirOverride(env),
		cwd: tryProcessCwd()
	});
}
//#endregion
//#region src/plugins/plugin-scope.ts
/** Normalizes plugin id scope input into a sorted unique string list. */
function normalizePluginIdScope(ids) {
	if (ids === void 0) return;
	return Array.from(new Set(normalizeStringEntries(ids.filter((id) => typeof id === "string")))).toSorted();
}
/** Serializes plugin scope for cache keys. */
function serializePluginIdScope(ids) {
	return ids === void 0 ? "__unscoped__" : JSON.stringify(ids);
}
//#endregion
//#region src/plugins/current-plugin-metadata-snapshot.ts
function resolvePluginMetadataControlPlaneFingerprint(config, options = {}) {
	return resolvePluginControlPlaneFingerprint({
		config,
		...options
	});
}
function resolveAgentWorkspaceFingerprint(config, env) {
	return JSON.stringify(listAgentWorkspaceDirs(config, env));
}
function prepareCurrentPluginMetadataSnapshotPublication(snapshot, options, owner = "operation") {
	const fingerprint = (config, policyHash) => resolvePluginMetadataControlPlaneFingerprint(config, {
		env: options.env,
		index: snapshot.index,
		policyHash,
		workspaceDir: options.workspaceDir ?? snapshot.workspaceDir
	});
	const compatiblePolicyHashes = options.compatibleConfigs?.map((config) => resolveInstalledPluginIndexPolicyHash(config, options.env));
	const compatibleConfigFingerprints = options.compatibleConfigs?.map((config, index) => fingerprint(config, compatiblePolicyHashes?.[index]));
	const configFingerprint = fingerprint(options.config, snapshot.policyHash);
	const defaultDiscoveryConfigFingerprint = fingerprint({}, snapshot.policyHash);
	const defaultDiscoveryCompatible = configFingerprint === defaultDiscoveryConfigFingerprint || snapshot.configFingerprint === defaultDiscoveryConfigFingerprint || Boolean(compatibleConfigFingerprints?.includes(defaultDiscoveryConfigFingerprint));
	const envFingerprint = resolvePluginMetadataEnvFingerprint(options.env);
	const agentWorkspaceFingerprint = owner === "gateway" && options.config ? resolveAgentWorkspaceFingerprint(options.config, options.env) : void 0;
	const configIdentities = [...options.compatibleConfigs ?? []];
	if (options.config) {
		const policyHash = resolveInstalledPluginIndexPolicyHash(options.config, options.env);
		if (policyHash === snapshot.policyHash || Boolean(compatiblePolicyHashes?.includes(policyHash))) configIdentities.push(options.config);
	}
	return () => {
		if (getCurrentPluginMetadataSnapshotState().owner === "gateway" && owner !== "gateway") throw new Error("Gateway plugin metadata can only be replaced after shutdown");
		currentPluginMetadataConfigIdentityCache.clear();
		setCurrentPluginMetadataSnapshotState(snapshot, configFingerprint, compatiblePolicyHashes, compatibleConfigFingerprints, owner === "gateway" || defaultDiscoveryCompatible ? snapshot.owners.modelIdNormalizationPolicies : void 0, owner, envFingerprint, defaultDiscoveryCompatible, agentWorkspaceFingerprint);
		for (const config of configIdentities) currentPluginMetadataConfigIdentityCache.add(config);
	};
}
/** Publishes a prepared CLI snapshot without displacing a lifecycle owner. */
function adoptCurrentPluginMetadataSnapshotIfAbsent(snapshot, options = {}) {
	if (getScopedPluginCache()?.kind === "operation" || getCurrentPluginMetadataSnapshotState().snapshot !== void 0) return;
	prepareCurrentPluginMetadataSnapshotPublication(snapshot, options)();
}
/** Installation revokes operation facts even when it runs between metadata scopes. */
function revokeCurrentPluginMetadataSnapshotScopes() {
	const caches = new Set(getScopedPluginCaches());
	const runtimeCaches = /* @__PURE__ */ new Set();
	for (let scoped = getPluginExecutionFrame()?.metadataScope; scoped; scoped = scoped.parent) if (scoped.immutableRuntimeGeneration) runtimeCaches.add(scoped.cache);
	else caches.add(scoped.cache);
	for (const cache of caches) if (cache.kind === "operation" && !runtimeCaches.has(cache)) invalidatePluginCacheMetadata(cache);
}
function isScopedSnapshotInCurrentCache(scoped) {
	if (!scoped.immutableRuntimeGeneration && scoped.metadata !== scoped.cache.metadata) return false;
	const cache = getScopedPluginCache();
	return cache?.kind !== "operation" || scoped.cache === cache;
}
const NEEDS_PREPARED_POLICY = Symbol("needs-prepared-policy");
function resolveCompatiblePluginMetadataSnapshot(candidate, params, options = {}) {
	const snapshot = candidate.snapshot;
	if (!snapshot) return;
	if (candidate.immutableRuntimeGeneration) return snapshot;
	const env = params.env ?? process.env;
	if (candidate.envFingerprint !== resolvePluginMetadataEnvFingerprint(env)) return;
	const requestedPluginIds = normalizePluginIdScope(params.pluginIds ?? params.pluginIdScope?.resolve({ index: snapshot.index }));
	const snapshotPluginIds = normalizePluginIdScope(snapshot.pluginIds);
	if (requestedPluginIds !== void 0 && serializePluginIdScope(snapshotPluginIds) !== serializePluginIdScope(requestedPluginIds)) return;
	if (snapshotPluginIds !== void 0 && requestedPluginIds === void 0 && params.allowScopedSnapshot !== true) return;
	const requestedWorkspaceDir = params.workspaceDir ?? (params.allowWorkspaceScopedSnapshot === true || options.scopedOwnerContext === true ? snapshot.workspaceDir : void 0);
	if (snapshot.workspaceDir !== void 0 && requestedWorkspaceDir === void 0) return;
	if (requestedWorkspaceDir !== void 0 && (snapshot.workspaceDir ?? "") !== (requestedWorkspaceDir ?? "")) return;
	const canReuseCachedConfig = Boolean(params.config && candidate.hasConfigIdentity?.(params.config));
	if (canReuseCachedConfig && params.requireDefaultDiscoveryContext !== true) return snapshot;
	if (params.config && !canReuseCachedConfig && params.allowSynchronousPolicyRead === false) return NEEDS_PREPARED_POLICY;
	const requestedPolicyHash = params.config && !canReuseCachedConfig ? resolveInstalledPluginIndexPolicyHash(params.config, params.env) : void 0;
	if (requestedPolicyHash && snapshot.policyHash !== requestedPolicyHash) {
		if (!candidate.compatiblePolicyHashes?.includes(requestedPolicyHash)) return;
	}
	if (params.config && !canReuseCachedConfig) {
		const requestedConfigFingerprint = resolvePluginMetadataControlPlaneFingerprint(params.config, {
			env,
			index: snapshot.index,
			policyHash: requestedPolicyHash,
			workspaceDir: requestedWorkspaceDir
		});
		if (!(candidate.configFingerprint === requestedConfigFingerprint || snapshot.configFingerprint === requestedConfigFingerprint || Boolean(candidate.compatibleConfigFingerprints?.includes(requestedConfigFingerprint)))) return;
	}
	if (params.requireDefaultDiscoveryContext === true && options.scopedOwnerContext !== true && candidate.defaultDiscoveryCompatible !== true) return;
	return snapshot;
}
function getCurrentPluginMetadataSnapshot(params = {}) {
	for (let scoped = getPluginExecutionFrame()?.metadataScope; scoped; scoped = scoped.parent) {
		if (!isScopedSnapshotInCurrentCache(scoped)) continue;
		const compatibleScoped = resolveCompatiblePluginMetadataSnapshot(scoped, params, { scopedOwnerContext: true });
		if (compatibleScoped === NEEDS_PREPARED_POLICY) return;
		if (compatibleScoped) return compatibleScoped;
	}
	const scopedCache = getScopedPluginCache();
	if (scopedCache && scopedCache !== getProcessPluginCache()) return;
	const { snapshot, owner, configFingerprint, envFingerprint, defaultDiscoveryCompatible, compatiblePolicyHashes, compatibleConfigFingerprints } = getCurrentPluginMetadataSnapshotState();
	const compatible = resolveCompatiblePluginMetadataSnapshot({
		snapshot,
		configFingerprint,
		envFingerprint,
		defaultDiscoveryCompatible,
		compatiblePolicyHashes,
		compatibleConfigFingerprints,
		hasConfigIdentity: (config) => currentPluginMetadataConfigIdentityCache.has(config),
		immutableRuntimeGeneration: owner === "gateway"
	}, params);
	return compatible === NEEDS_PREPARED_POLICY ? void 0 : compatible;
}
registerPluginMetadataSnapshotReaders({
	adoptCurrentPluginMetadataSnapshotIfAbsent,
	getCurrentPluginMetadataSnapshot
});
registerPluginMetadataProcessMemoLifecycleClear(revokeCurrentPluginMetadataSnapshotScopes, { owner: "operation" });
//#endregion
//#region src/infra/windows-install-roots.ts
const DEFAULT_WINDOWS_SYSTEM_ROOT = "C:\\Windows";
const WINDOWS_NT_CURRENT_VERSION_KEY = "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion";
const REG_QUERY_TIMEOUT_MS = 5e3;
const queryRegistryValueFn = defaultQueryRegistryValue;
const isReadableFileFn = defaultIsReadableFile;
let cachedProcessRoots = null;
function defaultIsReadableFile(filePath) {
	try {
		fsSync.accessSync(filePath, fsSync.constants.R_OK);
		return true;
	} catch {
		return false;
	}
}
function trimTrailingSeparators(value) {
	const parsed = path.win32.parse(value);
	let trimmed = value;
	while (trimmed.length > parsed.root.length && /[\\/]/.test(trimmed.at(-1) ?? "")) trimmed = trimmed.slice(0, -1);
	return trimmed;
}
/**
* Windows install roots should be local absolute directories, not drive-relative
* paths, UNC shares, or PATH-like lists that could widen trust unexpectedly.
*/
function normalizeWindowsInstallRoot(raw) {
	if (typeof raw !== "string") return null;
	const trimmed = raw.trim();
	if (!trimmed || trimmed.includes("\0") || trimmed.includes("\r") || trimmed.includes("\n") || trimmed.includes(";")) return null;
	const normalized = trimTrailingSeparators(path.win32.normalize(trimmed));
	if (!path.win32.isAbsolute(normalized) || normalized.startsWith("\\\\")) return null;
	const parsed = path.win32.parse(normalized);
	if (!/^[A-Za-z]:\\$/.test(parsed.root)) return null;
	if (normalized.length <= parsed.root.length) return null;
	return normalized;
}
function getEnvValueCaseInsensitive(env, expectedKey) {
	const direct = env[expectedKey];
	if (direct !== void 0) return direct;
	const upper = expectedKey.toUpperCase();
	const actualKey = Object.keys(env).find((key) => key.toUpperCase() === upper);
	return actualKey ? env[actualKey] : void 0;
}
function getWindowsRegExeCandidates() {
	return [path.win32.join(DEFAULT_WINDOWS_SYSTEM_ROOT, "System32", "reg.exe")];
}
function locateWindowsRegExe() {
	for (const candidate of getWindowsRegExeCandidates()) if (isReadableFileFn(candidate)) return candidate;
	return null;
}
function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function parseRegQueryValue(stdout, valueName) {
	const pattern = new RegExp(`^\\s*${escapeRegex(valueName)}\\s+REG_[A-Z0-9_]+\\s+(.+)$`, "im");
	return stdout.match(pattern)?.[1]?.trim() || null;
}
function runRegQuery(regExe, key, valueName, use64BitView) {
	const args = [
		"query",
		key,
		"/v",
		valueName
	];
	if (use64BitView) args.push("/reg:64");
	return execFileSync(regExe, args, {
		env: resolveDiagnosticProcessEnv(),
		encoding: "utf8",
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		],
		timeout: REG_QUERY_TIMEOUT_MS,
		windowsHide: true
	});
}
function defaultQueryRegistryValue(key, valueName) {
	const regExe = locateWindowsRegExe();
	if (!regExe) return null;
	for (const use64BitView of [true, false]) try {
		const parsed = parseRegQueryValue(runRegQuery(regExe, key, valueName, use64BitView), valueName);
		if (parsed) return parsed;
	} catch {}
	return null;
}
function resolveSystemRootFromEnv(env) {
	return normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "SystemRoot")) ?? normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "WINDIR")) ?? DEFAULT_WINDOWS_SYSTEM_ROOT;
}
function getProcessRoots() {
	if (!cachedProcessRoots) {
		const env = {};
		for (const key of [
			"SystemRoot",
			"WINDIR",
			"ProgramFiles",
			"ProgramFiles(x86)",
			"ProgramW6432"
		]) env[key] = getEnvValueCaseInsensitive(process.env, key);
		cachedProcessRoots = {
			env,
			systemRoot: normalizeWindowsInstallRoot(queryRegistryValueFn(WINDOWS_NT_CURRENT_VERSION_KEY, "SystemRoot") ?? void 0) ?? resolveSystemRootFromEnv(env)
		};
	}
	return cachedProcessRoots;
}
function getWindowsSystemRoot(env) {
	if (env !== process.env) return resolveSystemRootFromEnv(env);
	const roots = getProcessRoots();
	return roots.installRoots?.systemRoot ?? roots.systemRoot;
}
function getWindowsCmdExePath(env = process.env) {
	return getWindowsSystem32ExePath("cmd.exe", env);
}
function getWindowsSystem32ExePath(executableName, env = process.env) {
	if (path.win32.basename(executableName) !== executableName || !/^[A-Za-z0-9_.-]+\.exe$/u.test(executableName)) throw new Error(`Invalid Windows System32 executable name: ${executableName}`);
	return path.win32.join(getWindowsSystemRoot(env), "System32", executableName);
}
//#endregion
//#region src/infra/windows-encoding.ts
const WINDOWS_CODEPAGE_ENCODING_MAP = {
	65001: "utf-8",
	54936: "gb18030",
	874: "windows-874",
	936: "gbk",
	950: "big5",
	932: "shift_jis",
	949: "euc-kr",
	1250: "windows-1250",
	1251: "windows-1251",
	1252: "windows-1252",
	1253: "windows-1253",
	1254: "windows-1254",
	1255: "windows-1255",
	1256: "windows-1256",
	1257: "windows-1257",
	1258: "windows-1258"
};
const WINDOWS_ENCODING_PROBE_TIMEOUT_MS = 5e3;
new Map(Object.entries({
	65001: "utf-8",
	874: "windows-874",
	932: "shift_jis",
	936: "gbk",
	949: "euc-kr",
	950: "big5",
	1258: "windows-1258",
	437: "cp437",
	720: "cp720",
	737: "cp737",
	775: "cp775",
	850: "cp850",
	852: "cp852",
	855: "cp855",
	857: "cp857",
	858: "cp858",
	860: "cp860",
	861: "cp861",
	862: "cp862",
	863: "cp863",
	865: "cp865",
	866: "cp866",
	869: "cp869"
}).map(([codePage, encoding]) => [encoding, Number.parseInt(codePage, 10)]));
let cachedWindowsConsoleEncoding;
/** Extracts a Windows console code page number from localized `chcp` output. */
function parseWindowsCodePage(raw) {
	if (!raw) return null;
	const match = raw.match(/\b(\d{3,5})\b/);
	if (!match?.[1]) return null;
	const codePage = Number.parseInt(match[1], 10);
	if (!Number.isFinite(codePage) || codePage <= 0) return null;
	return codePage;
}
/** Resolves and caches the current Windows console encoding for subprocess output. */
function resolveWindowsConsoleEncoding() {
	if (process.platform !== "win32") return null;
	if (cachedWindowsConsoleEncoding !== void 0) return cachedWindowsConsoleEncoding;
	try {
		const result = spawnSync(getWindowsCmdExePath(), [
			"/d",
			"/s",
			"/c",
			"chcp"
		], {
			env: resolveDiagnosticProcessEnv(),
			windowsHide: true,
			encoding: "utf8",
			killSignal: "SIGKILL",
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			timeout: WINDOWS_ENCODING_PROBE_TIMEOUT_MS
		});
		const codePage = parseWindowsCodePage(`${result.stdout ?? ""}\n${result.stderr ?? ""}`);
		cachedWindowsConsoleEncoding = codePage !== null ? WINDOWS_CODEPAGE_ENCODING_MAP[codePage] ?? null : null;
	} catch {
		cachedWindowsConsoleEncoding = null;
	}
	return cachedWindowsConsoleEncoding;
}
/** Decodes one complete subprocess output buffer, preferring valid UTF-8 before legacy code pages. */
function decodeWindowsOutputBuffer(params) {
	return decodeWindowsBufferWithFallback({
		...params,
		resolveFallbackEncoding: () => params.windowsEncoding ?? resolveWindowsConsoleEncoding()
	});
}
function decodeWindowsBufferWithFallback(params) {
	if ((params.platform ?? process.platform) !== "win32") return params.buffer.toString("utf8");
	const [first, second] = params.buffer;
	if (first === 255 && second === 254 || first === 254 && second === 255) return new TextDecoder(first === 255 ? "utf-16le" : "utf-16be").decode(params.buffer);
	const utf8 = decodeStrictUtf8(params.buffer);
	if (utf8 !== null) return utf8;
	const encoding = params.resolveFallbackEncoding();
	if (!encoding || normalizeLowercaseStringOrEmpty(encoding) === "utf-8") return params.buffer.toString("utf8");
	try {
		return new TextDecoder(encoding).decode(params.buffer);
	} catch {
		return params.buffer.toString("utf8");
	}
}
function decodeStrictUtf8(buffer) {
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
	} catch {
		return null;
	}
}
//#endregion
//#region src/process/child-process.ts
const EXIT_STDIO_GRACE_MS = 100;
const EXIT_STDIO_MAX_DRAIN_MS = 1e3;
/**
* Execa waits for stdout/stderr after the direct child exits. Bound that wait
* when detached descendants keep inherited pipes open, while still draining
* short output tails. The returned cleanup must run after awaiting the child.
*/
function releaseChildProcessOutputAfterExit(child) {
	let idleTimer;
	let releaseTimer;
	let deadlineTimer;
	const cleanup = () => {
		clearTimeout(idleTimer);
		clearTimeout(releaseTimer);
		clearTimeout(deadlineTimer);
		child.removeListener("exit", onExit);
		child.stdout?.removeListener("data", onData);
		child.stderr?.removeListener("data", onData);
	};
	const release = () => {
		cleanup();
		child.stdout?.destroy();
		child.stderr?.destroy();
	};
	const scheduleRelease = () => {
		releaseTimer ??= setTimeout(release, 0);
		releaseTimer.unref();
	};
	const armIdleTimer = () => {
		clearTimeout(idleTimer);
		clearTimeout(releaseTimer);
		releaseTimer = void 0;
		idleTimer = setTimeout(scheduleRelease, EXIT_STDIO_GRACE_MS);
		idleTimer.unref();
	};
	const onData = () => {
		if (deadlineTimer) armIdleTimer();
	};
	const onExit = () => {
		deadlineTimer = setTimeout(() => {
			deadlineTimer = void 0;
			scheduleRelease();
		}, EXIT_STDIO_MAX_DRAIN_MS);
		deadlineTimer.unref();
		armIdleTimer();
	};
	child.stdout?.on("data", onData);
	child.stderr?.on("data", onData);
	if (child.exitCode != null || child.signalCode != null) onExit();
	else child.once("exit", onExit);
	return cleanup;
}
//#endregion
//#region src/utils/utf8-truncate.ts
function isContinuationByte(byte) {
	return byte !== void 0 && (byte & 192) === 128;
}
/** Keeps the longest UTF-8 suffix that fits within the byte limit. */
function truncateUtf8Suffix(value, maxBytes) {
	if (maxBytes <= 0) return "";
	if (value.length <= maxBytes && Buffer$1.byteLength(value) <= maxBytes) return value;
	const bytes = Buffer$1.from(Number.isInteger(maxBytes) ? value.slice(-maxBytes - 1) : value);
	let start = bytes.byteLength - maxBytes;
	while (start < bytes.byteLength && isContinuationByte(bytes[start])) start += 1;
	return bytes.subarray(start).toString("utf8");
}
//#endregion
//#region src/process/exec-output.ts
const DEFAULT_COMMAND_OUTPUT_MAX_BYTES = 16777216;
const MAX_PRESERVED_PENDING_LINE_BYTES = 8192;
function createCapturedOutputBuffers() {
	return {
		chunks: [],
		bytes: 0,
		truncatedBytes: 0,
		preservedLines: [],
		decoder: new StringDecoder("utf8"),
		pendingLine: ""
	};
}
function normalizeMaxOutputBytes(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return DEFAULT_COMMAND_OUTPUT_MAX_BYTES;
	return Math.max(1, Math.floor(value));
}
function resolveMaxOutputBytes(value, stream) {
	return normalizeMaxOutputBytes(typeof value === "number" ? value : value?.[stream]);
}
function resolveOutputCapture(value, stream) {
	return (typeof value === "string" ? value : value?.[stream]) ?? "tail";
}
function shouldTerminateOnOutputLimit(value, limit) {
	return typeof value === "boolean" ? value : value?.[limit] === true;
}
function shouldTerminateOnOutputError(value, stream) {
	return typeof value === "boolean" ? value : value?.[stream] === true;
}
function appendCapturedOutput(capture, chunk, maxBytes, mode) {
	const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
	if (mode === "discard") {
		capture.truncatedBytes += buffer.byteLength;
		return;
	}
	if (mode === "head") {
		const remaining = Math.max(0, maxBytes - capture.bytes);
		if (remaining > 0) {
			const kept = buffer.subarray(0, remaining);
			capture.chunks.push(kept.byteLength < buffer.byteLength ? Buffer.from(kept) : kept);
			capture.bytes += kept.byteLength;
		}
		capture.truncatedBytes += Math.max(0, buffer.byteLength - remaining);
		return;
	}
	if (buffer.byteLength >= maxBytes) {
		capture.chunks = [Buffer.from(buffer.subarray(buffer.byteLength - maxBytes))];
		capture.truncatedBytes += capture.bytes + buffer.byteLength - maxBytes;
		capture.bytes = maxBytes;
		return;
	}
	capture.chunks.push(buffer);
	capture.bytes += buffer.byteLength;
	while (capture.bytes > maxBytes && capture.chunks.length > 0) {
		const first = expectDefined(capture.chunks[0], "chunks entry at 0");
		const overflow = capture.bytes - maxBytes;
		if (first.byteLength <= overflow) {
			capture.chunks.shift();
			capture.bytes -= first.byteLength;
			capture.truncatedBytes += first.byteLength;
		} else {
			capture.chunks[0] = Buffer.from(first.subarray(overflow));
			capture.bytes -= overflow;
			capture.truncatedBytes += overflow;
		}
	}
}
function trimTruncatedUtf8Boundary(buffer, mode, truncatedBytes, forceUtf8) {
	if (truncatedBytes === 0 || buffer.length === 0 || process$1.platform === "win32" && !forceUtf8) return buffer;
	if (mode === "tail") {
		let start = 0;
		while (start < buffer.length && (expectDefined(buffer[start], "buffer byte") & 192) === 128) start += 1;
		return buffer.subarray(start);
	}
	for (let removed = 0; removed <= 3 && removed <= buffer.length; removed += 1) {
		const end = buffer.length - removed;
		if (isUtf8(buffer.subarray(0, end))) return buffer.subarray(0, end);
	}
	return buffer;
}
function finalizeCapturedOutput(capture, mode, forceUtf8 = false) {
	const buffered = Buffer.concat(capture.chunks, capture.bytes);
	const trimmed = trimTruncatedUtf8Boundary(buffered, mode, capture.truncatedBytes, forceUtf8);
	capture.truncatedBytes += buffered.byteLength - trimmed.byteLength;
	return trimmed;
}
function appendPreservedOutputLines(params) {
	const { capture, maxPreservedOutputLines, preserveOutputLine } = params;
	if (!preserveOutputLine || capture.preservedLines.length >= maxPreservedOutputLines) return;
	const text = Buffer.isBuffer(params.chunk) ? capture.decoder.write(params.chunk) : params.chunk;
	if (!text) return;
	const lines = (capture.pendingLine + text).split(/\r?\n/);
	capture.pendingLine = truncateUtf8Suffix(lines.pop() ?? "", params.maxPendingLineBytes);
	for (const line of lines) if (capture.preservedLines.length < maxPreservedOutputLines && preserveOutputLine(line, params.stream)) capture.preservedLines.push(line);
}
function flushPreservedOutputLine(params) {
	const { capture, maxPreservedOutputLines, preserveOutputLine } = params;
	if (!preserveOutputLine || maxPreservedOutputLines <= 0) return;
	const trailing = truncateUtf8Suffix(capture.pendingLine + capture.decoder.end(), params.maxPendingLineBytes);
	capture.pendingLine = "";
	if (trailing && capture.preservedLines.length < maxPreservedOutputLines && preserveOutputLine(trailing, params.stream)) capture.preservedLines.push(trailing);
}
//#endregion
//#region src/process/exec-result.ts
const commandCleanupUncertain = Symbol.for("openclaw.command-cleanup-uncertain");
/** An admitted command may still write; callers must retain its artifacts for recovery. */
var CommandProcessCleanupError = class extends Error {
	constructor(options) {
		super("Command cleanup could not confirm that owned work stopped", options);
		this.code = "ERR_COMMAND_PROCESS_CLEANUP_UNCERTAIN";
		this.cleanup = "uncertain";
		this.name = "CommandProcessCleanupError";
		Object.defineProperty(this, commandCleanupUncertain, { value: true });
	}
};
function createSanitizedCommandError(result) {
	const code = typeof result.code === "string" ? result.code : void 0;
	const exitCode = typeof result.exitCode === "number" ? result.exitCode : void 0;
	const signal = typeof result.signal === "string" ? result.signal : void 0;
	const message = result.timedOut ? "Command timed out" : result.isMaxBuffer ? "Command output exceeded its capture limit" : result.isCanceled ? "Command was canceled" : result.isTerminated ? `Command was terminated${signal ? ` by ${signal}` : ""}` : exitCode !== void 0 && exitCode !== 0 ? `Command exited with code ${exitCode}` : `Command failed during launch or output capture${code ? ` (${code})` : ""}`;
	return Object.assign(new Error(message), {
		...code ? { code } : {},
		...exitCode !== void 0 ? { exitCode } : {},
		...signal ? { signal } : {}
	});
}
function isPlainCommandExitFailure(result) {
	return result.failed && typeof result.exitCode === "number" && result.exitCode !== 0 && result.signal === void 0 && result.cause === void 0 && !result.timedOut && !result.isCanceled && !result.isMaxBuffer && !result.isTerminated;
}
function isPlainCommandSignalFailure(result) {
	return result.failed && result.exitCode === void 0 && typeof result.signal === "string" && result.cause === void 0 && !result.timedOut && !result.isCanceled && !result.isMaxBuffer && result.isTerminated === true;
}
function resolveProcessExitCode(params) {
	return params.explicitCode ?? params.childExitCode ?? (params.usesWindowsExitCodeShim && params.resolvedSignal == null && !params.timedOut && !params.noOutputTimedOut && !params.killIssuedByTimeout && !params.killIssuedByAbort ? 0 : null);
}
//#endregion
//#region packages/agent-core/src/harness/env/kill-tree.ts
const DEFAULT_GRACE_MS = 3e3;
const MAX_GRACE_MS = 6e4;
const TASKKILL_COMPLETION_TIMEOUT_MS = 3e3;
const UNIX_PROCESS_TREE_TIMEOUT_MS = 500;
const MAX_UNIX_PROCESS_TREE_PIDS = 4096;
const MAX_UNIX_PROCESS_TREE_DEPTH = 128;
/**
* Best-effort process-tree termination with graceful shutdown.
* - Windows: use taskkill /T to include descendants. Sends SIGTERM-equivalent
*   first (without /F), then force-kills if taskkill refuses or the process
*   survives the grace period.
* - Unix: send SIGTERM to the process group when ownership is known, wait the
*   grace period, then SIGKILL. Linux attached children are enumerated and
*   signaled descendants-first because their process group belongs to the gateway.
*
* Group kill (`process.kill(-pid, ...)`) is only used when the PID is verified
* as its own process group leader, unless `detached: true` is explicitly passed.
* This prevents accidentally signaling the gateway's process group when the
* child shares its parent's group.
*
* - `detached: false`: skip group kill unconditionally.
* - `detached: true`: use group kill unconditionally (trust caller).
* - `detached` omitted: use group kill only when PID is the group leader.
*/
function killProcessTree(pid, opts) {
	if (!Number.isFinite(pid) || pid <= 0) return;
	if (process.platform === "win32") {
		if (opts?.force === true) {
			signalProcessTreeWindows(pid, "SIGKILL");
			return;
		}
		killProcessTreeWindows(pid, normalizeGraceMs(opts?.graceMs));
		return;
	}
	const useGroupKill = opts?.detached === true || opts?.detached !== false && isProcessGroupLeader(pid);
	const attachedLinuxTree = opts?.detached === false && !useGroupKill && process.platform === "linux";
	const processTree = attachedLinuxTree ? collectUnixProcessTree(pid) : void 0;
	if (attachedLinuxTree && !processTree) {
		signalProcessTreeUnix(pid, opts?.force === true ? "SIGKILL" : "SIGTERM", false);
		return;
	}
	let forceRequested = false;
	const force = () => {
		if (forceRequested) return;
		forceRequested = true;
		const liveProcessTree = processTree?.filter(verifiedProcessInstanceAlive) ?? [];
		if (!(useGroupKill ? isProcessAlive(-pid) : attachedLinuxTree ? liveProcessTree.length > 0 : isProcessAlive(pid))) return;
		signalProcessTreeUnix(pid, "SIGKILL", useGroupKill, processTree ? liveProcessTree : void 0);
	};
	if (opts?.force === true) {
		if (processTree) force();
		else signalProcessTreeUnix(pid, "SIGKILL", useGroupKill);
		return;
	}
	signalProcessTreeUnix(pid, "SIGTERM", useGroupKill, processTree);
	const graceMs = normalizeGraceMs(opts?.graceMs);
	const forceTimer = setTimeout(force, graceMs);
	if (!attachedLinuxTree) forceTimer.unref();
	return { force: () => {
		clearTimeout(forceTimer);
		force();
	} };
}
function normalizeGraceMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_GRACE_MS;
	return Math.max(0, Math.min(MAX_GRACE_MS, Math.floor(value)));
}
function isProcessAlive(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}
function parseProcessGroupId(value) {
	if (typeof value !== "string" || !/^\d+$/.test(value.trim())) return;
	const pgid = Number(value.trim());
	return Number.isSafeInteger(pgid) && pgid > 0 ? pgid : void 0;
}
function readProcessGroupIdFromPs(pid) {
	try {
		const res = spawnSync("ps", [
			"-p",
			String(pid),
			"-o",
			"pgid="
		], {
			encoding: "utf8",
			timeout: 500
		});
		if (res.error || res.status !== 0) return;
		return parseProcessGroupId(res.stdout);
	} catch {
		return;
	}
}
function readProcessGroupIdFromProc(pid) {
	try {
		const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
		const commEnd = stat.lastIndexOf(")");
		if (commEnd < 0) return;
		return parseProcessGroupId(stat.slice(commEnd + 1).trim().split(/\s+/)[2]);
	} catch {
		return;
	}
}
/** Fail closed to direct-PID signaling when group ownership cannot be proved. */
function isProcessGroupLeader(pid) {
	return ((process.platform === "linux" ? readProcessGroupIdFromProc(pid) : void 0) ?? readProcessGroupIdFromPs(pid)) === pid;
}
function parsePositivePids(value) {
	if (typeof value !== "string") return [];
	return value.trim().split(/\s+/u).map((entry) => Number(entry)).filter((entry) => Number.isSafeInteger(entry) && entry > 0);
}
/**
* Read a stable process-instance identity for `pid`. Linux `starttime` from
* `/proc/<pid>/stat` distinguishes recycled PIDs. Other Unix platforms do not
* expose a sufficiently precise portable identity, so attached snapshots stay
* disabled there rather than authorizing a stale signal.
*/
function readUnixProcessIdentity(pid, deadlineMs) {
	return readUnixProcessInstance(pid, deadlineMs)?.identity;
}
/**
* Read a process-instance identity and its current parent PID from
* `/proc/<pid>/stat`. The `ppid` lets the caller revalidate that a numeric PID
* reported by `/proc/<parent>/children` still belongs to the verified parent at
* capture time, so a PID reused between the children read and this read cannot
* be admitted as an authorized descendant.
*/
function readUnixProcessInstance(pid, deadlineMs) {
	if (deadlineMs !== void 0 && Date.now() >= deadlineMs) return;
	if (process.platform !== "linux") return;
	try {
		const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
		const commEnd = stat.lastIndexOf(")");
		if (commEnd < 0) return;
		const fields = stat.slice(commEnd + 1).trim().split(/\s+/);
		const ppid = Number(fields[1]);
		const starttime = fields[19];
		if (!starttime || !/^\d+$/u.test(starttime) || !Number.isSafeInteger(ppid)) return;
		return {
			identity: `${pid}:${starttime}`,
			ppid
		};
	} catch {
		return;
	}
}
/**
* True when the captured process instance is still alive at the same identity.
* Missing identities are never eligible for an attached-tree signal.
*/
function verifiedProcessInstanceAlive(entry) {
	if (!entry.identity || !isProcessAlive(entry.pid)) return false;
	return readUnixProcessIdentity(entry.pid) === entry.identity;
}
function* readUnixProcessChildren(pid, canReadTask) {
	let tasks;
	try {
		tasks = opendirSync(`/proc/${pid}/task`);
		while (canReadTask()) {
			const task = tasks.readSync();
			if (!task) return;
			const tid = parseProcessGroupId(task.name);
			if (!tid) continue;
			try {
				yield* parsePositivePids(readFileSync(`/proc/${pid}/task/${tid}/children`, "utf8"));
			} catch {}
		}
	} catch {} finally {
		try {
			tasks?.closeSync();
		} catch {}
	}
}
/**
* Capture an attached process tree before signaling its root.
* Descendants are returned first so they retain their parent relationship.
*
* Each entry carries a stable process-instance identity captured at discovery
* time so delayed grace-period signals can be verified against the original
* instance instead of a numeric PID that may have been recycled. A descendant
* whose identity cannot be captured is omitted (fail-closed for that subtree)
* rather than retained as an identity-less PID that a delayed signal could
* target after reuse. The supervisor-owned root PID is always trusted as the
* caller's direct child, so the snapshot always contains it once the root's own
* identity verifies, even when every descendant probe fails.
*/
function collectUnixProcessTree(rootPid) {
	if (process.platform !== "linux") return;
	const descendants = [];
	const seen = /* @__PURE__ */ new Set([rootPid]);
	let taskReads = 0;
	const deadline = Date.now() + UNIX_PROCESS_TREE_TIMEOUT_MS;
	const rootIdentity = readUnixProcessIdentity(rootPid, deadline);
	if (!rootIdentity || Date.now() >= deadline) return;
	const withinBounds = (depth) => Date.now() < deadline && depth <= MAX_UNIX_PROCESS_TREE_DEPTH;
	const hasCapacity = () => seen.size < MAX_UNIX_PROCESS_TREE_PIDS;
	const visit = (parentPid, parentIdentity, depth) => {
		if (!withinBounds(depth) || !hasCapacity()) return;
		if (readUnixProcessIdentity(parentPid, deadline) !== parentIdentity) return;
		const children = readUnixProcessChildren(parentPid, () => withinBounds(depth) && hasCapacity() && taskReads++ < MAX_UNIX_PROCESS_TREE_PIDS && readUnixProcessIdentity(parentPid, deadline) === parentIdentity);
		for (const childPid of children) {
			if (!withinBounds(depth + 1) || !hasCapacity()) return;
			if (seen.has(childPid) || childPid === process.pid) continue;
			seen.add(childPid);
			const instance = readUnixProcessInstance(childPid, deadline);
			if (!instance || instance.ppid !== parentPid || !withinBounds(depth + 1)) continue;
			visit(childPid, instance.identity, depth + 1);
			descendants.push({
				pid: childPid,
				identity: instance.identity
			});
		}
	};
	visit(rootPid, rootIdentity, 0);
	return [...descendants, {
		pid: rootPid,
		identity: rootIdentity
	}];
}
function signalProcessTreeUnix(pid, signal, useGroupKill, processTree) {
	if (useGroupKill) {
		signalUnixTarget(-pid, signal);
		return;
	}
	const targets = processTree ?? [{ pid }];
	for (const entry of targets) {
		if (processTree && !verifiedProcessInstanceAlive(entry)) continue;
		try {
			process.kill(entry.pid, signal);
		} catch {}
	}
}
function signalUnixTarget(pid, signal) {
	try {
		process.kill(pid, signal);
	} catch {}
}
function runTaskkill(args, onExit) {
	return new Promise((resolve) => {
		let settled = false;
		const finish = (code) => {
			if (settled) return;
			settled = true;
			clearTimeout(completionTimer);
			onExit?.(code);
			resolve();
		};
		const completionTimer = setTimeout(() => finish(null), TASKKILL_COMPLETION_TIMEOUT_MS);
		completionTimer.unref?.();
		try {
			const child = spawn("taskkill", args, {
				stdio: "ignore",
				detached: true,
				windowsHide: true
			});
			child.once("error", () => finish(null));
			child.once("close", (code) => finish(code));
		} catch {
			finish(null);
		}
	});
}
function killProcessTreeWindows(pid, graceMs) {
	let forced = false;
	let graceTimer;
	const forceKill = () => {
		if (forced) return;
		forced = true;
		if (graceTimer !== void 0) {
			clearTimeout(graceTimer);
			graceTimer = void 0;
		}
		if (!isProcessAlive(pid)) return;
		signalProcessTreeWindows(pid, "SIGKILL");
	};
	signalProcessTreeWindows(pid, "SIGTERM", (code) => {
		if (code !== null && code !== 0) forceKill();
	});
	graceTimer = setTimeout(forceKill, graceMs);
	graceTimer.unref();
}
function signalProcessTreeWindows(pid, signal, onExit) {
	signalProcessTreeWindowsAndWait(pid, signal, onExit);
}
function signalProcessTreeWindowsAndWait(pid, signal, onExit) {
	return runTaskkill(signal === "SIGKILL" ? [
		"/F",
		"/T",
		"/PID",
		String(pid)
	] : [
		"/T",
		"/PID",
		String(pid)
	], onExit);
}
createRequire(import.meta.url);
//#endregion
//#region src/process/child-process-tree.ts
function shouldDetachChildForProcessTree() {
	return process.platform !== "win32";
}
function isChildProcessTreeAlive(child) {
	if (typeof child.pid !== "number" || child.pid <= 0) return false;
	const target = shouldDetachChildForProcessTree() ? -child.pid : child.pid;
	try {
		process.kill(target, 0);
		return true;
	} catch (error) {
		return !hasErrnoCode(error, "ESRCH");
	}
}
//#endregion
//#region src/process/spawn-broker/execa-message.ts
const decoder = new TextDecoder();
const commonEscapes = /* @__PURE__ */ new Map([
	[" ", " "],
	["\n", "\n"],
	["\b", "\\b"],
	["\f", "\\f"],
	["\r", "\\r"],
	["	", "\\t"]
]);
function renderOutput(output) {
	let text = typeof output === "string" ? output : decoder.decode(output);
	if (text.endsWith("\n")) text = text.slice(0, text.endsWith("\r\n") ? -2 : -1);
	return stripVTControlCharacters(text).replace(/[\p{Separator}\p{Other}]/gu, (character) => {
		const common = commonEscapes.get(character);
		if (common !== void 0) return common;
		const codepoint = character.codePointAt(0);
		const hex = codepoint.toString(16);
		return codepoint <= 65535 ? `\\u${hex.padStart(4, "0")}` : `\\U${hex}`;
	});
}
function decodeExecaMessage(encoded, output) {
	return encoded.messageOutputs ? [encoded.message, ...encoded.messageOutputs.map((stream) => renderOutput(output[stream]))].join("\n\n") : encoded.message;
}
//#endregion
//#region src/process/spawn-broker/execa-protocol.ts
function restoreError(error, output) {
	const restored = new Error(decodeExecaMessage(error, output), { cause: error.cause ? restoreError(error.cause, output) : void 0 });
	return Object.assign(restored, {
		name: error.name,
		code: error.code
	});
}
/** Failed reject:false results are still Errors, as they are with local execa. */
function restoreExecaResult(result) {
	const { error, ...received } = result;
	const properties = {
		...received,
		stdout: received.stdout,
		stderr: received.stderr,
		shortMessage: received.shortMessage,
		code: received.code
	};
	if (error) {
		const restored = restoreError(error, properties);
		return Object.assign(restored, properties, { cause: restored.cause });
	}
	return {
		...properties,
		cause: void 0
	};
}
//#endregion
//#region src/process/spawn-broker/execa-client.ts
const SERIALIZABLE_OPTIONS = /* @__PURE__ */ new Set([
	"buffer",
	"cancelSignal",
	"cwd",
	"detached",
	"encoding",
	"env",
	"extendEnv",
	"forceKillAfterDelay",
	"input",
	"killDescendants",
	"killSignal",
	"maxBuffer",
	"reject",
	"shell",
	"stderr",
	"stdin",
	"stdio",
	"stdout",
	"stripFinalNewline",
	"timeout",
	"windowsHide",
	"windowsVerbatimArguments"
]);
function isOutputOption(value) {
	return value === void 0 || value === "pipe" || value === "ignore" || value === "inherit" || typeof value === "object" && value !== null && "file" in value && typeof value.file === "string" && Object.keys(value).length === 1;
}
/** Unsupported native descriptors and independent-lifetime commands remain explicit local paths. */
function brokerExecaOptions(options) {
	if (options.ipc || options.cleanup === false || typeof options.stdin === "number") return;
	if (options.stdout === "inherit" || options.stderr === "inherit" || options.stdio === "inherit" || typeof options.stdout === "number" || typeof options.stderr === "number") return;
	if (options.stdio && typeof options.stdio !== "string" && options.stdio.some((entry, fd) => typeof entry === "number" || fd > 0 && entry === "inherit")) return;
	for (const key of Object.keys(options)) if (!SERIALIZABLE_OPTIONS.has(key)) throw new TypeError(`Unsupported spawn broker execa option: ${key}`);
	if (options.cwd !== void 0 && typeof options.cwd !== "string" || options.input !== void 0 && typeof options.input !== "string" && !(options.input instanceof Uint8Array) || options.stdin !== void 0 && options.stdin !== "pipe" && options.stdin !== "ignore" && options.stdin !== "inherit" || !isOutputOption(options.stdout) || !isOutputOption(options.stderr) || options.shell !== void 0 && options.shell !== false) throw new TypeError("Unsupported spawn broker execa stream or invocation options");
	if (options.stdio !== void 0 && typeof options.stdio === "string" && options.stdio !== "pipe" && options.stdio !== "ignore") throw new TypeError("Unsupported spawn broker execa stdio");
	if (Array.isArray(options.stdio) && (options.stdio.length !== 3 || ![
		"pipe",
		"ignore",
		"inherit"
	].includes(String(options.stdio[0])) || !isOutputOption(options.stdio[1]) || !isOutputOption(options.stdio[2]))) throw new TypeError("Unsupported spawn broker execa stdio");
	const { cancelSignal: _cancelSignal, ...serializable } = options;
	return serializable;
}
function spawnBrokerCommand(host, argv, options, prepared) {
	const remote = host.spawnExeca(argv, prepared);
	const child = remote.child;
	const closed = child.waitForClose();
	const onAbort = () => {
		child.killed = true;
		remote.cancel();
	};
	options.cancelSignal?.addEventListener("abort", onAbort, { once: true });
	if (options.cancelSignal?.aborted) onAbort();
	const promise = remote.result.then(async (result) => {
		await closed;
		const restored = restoreExecaResult(result);
		if (restored instanceof Error && (options.reject !== false || restored.code === "ERR_SPAWN_BROKER_UNAVAILABLE")) throw restored;
		return restored;
	}).finally(() => options.cancelSignal?.removeEventListener("abort", onAbort));
	promise.catch(() => {});
	once(child, "spawn").then(() => {
		setImmediate(() => {
			for (const stream of [child.stdout, child.stderr]) if (stream?.readableFlowing === null) stream.resume();
		});
	}, () => {});
	const properties = {
		nodeChildProcess: child,
		get pid() {
			return child.pid;
		},
		get stdin() {
			return child.stdin;
		},
		get stdout() {
			return child.stdout;
		},
		get stderr() {
			return child.stderr;
		},
		kill: (signal) => child.kill(signal ?? options.killSignal)
	};
	const command = Object.assign(promise, properties);
	return Object.defineProperties(command, Object.getOwnPropertyDescriptors(properties));
}
//#endregion
//#region src/process/spawn-broker/host.ts
const spawnBrokerWorkerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.spawnBroker);
fileURLToPath(spawnBrokerWorkerUrl);
//#endregion
//#region src/process/spawn-utils.ts
const spawnCounts = resolveGlobalSingleton(Symbol.for("openclaw.childProcessSpawnCounts"), () => ({
	counts: /* @__PURE__ */ new Map(),
	sampledAt: performance.now()
}));
const COMMAND_FAMILIES = /^(node|git|ps|pgrep|lsof|sh|bash|zsh|cmd|powershell|pwsh|npm|pnpm|python|python3|uv|ssh|openclaw)$/;
/** Count admitted local and broker launches, without recording paths or arguments. */
function recordChildProcessSpawn(command, child) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const name = path.win32.basename(command).toLowerCase().replace(/\.(exe|cmd)$/, "");
	const family = COMMAND_FAMILIES.test(name) ? name : "other";
	child.once("spawn", () => {
		if (areDiagnosticsEnabledForProcess()) spawnCounts.counts.set(family, (spawnCounts.counts.get(family) ?? 0) + 1);
	});
}
//#endregion
//#region src/process/windows-command.ts
const WINDOWS_UNSAFE_CMD_CHARS_RE = /[&|<>%\r\n]/;
function resolveNpmArgvForWindows(argv) {
	if (process$1.platform !== "win32" || argv.length === 0) return null;
	const basename = normalizeLowercaseStringOrEmpty(path.basename(expectDefined(argv[0], "argv entry at 0"))).replace(/\.(cmd|exe|bat)$/, "");
	const cliName = basename === "npx" ? "npx-cli.js" : basename === "npm" ? "npm-cli.js" : null;
	if (!cliName) return null;
	const cliPath = path.join(path.dirname(process$1.execPath), "node_modules", "npm", "bin", cliName);
	if (fsSync.existsSync(cliPath)) return [
		process$1.execPath,
		cliPath,
		...argv.slice(1)
	];
	const command = argv[0] ?? "";
	return [normalizeLowercaseStringOrEmpty(path.extname(command)) ? command : `${command}.cmd`, ...argv.slice(1)];
}
function createWindowsCommandNotFoundError(command) {
	const error = /* @__PURE__ */ new Error(`spawn ${command} ENOENT`);
	error.code = "ENOENT";
	error.path = command;
	error.syscall = `spawn ${command}`;
	return error;
}
function resolveWindowsCommandFromCwdOrPath(params) {
	if (params.command.includes("/") || params.command.includes("\\")) {
		const candidate = resolveExecutablePathCandidate(params.command, {
			cwd: params.cwd,
			env: params.env
		});
		if (!candidate) return;
		if (path.extname(candidate)) return isRegularFile(candidate) ? candidate : void 0;
		return resolveExecutableFromPathEnv(path.basename(candidate), path.dirname(candidate), params.env, { includeExtensionless: false });
	}
	const cwd = params.cwd?.trim() || process$1.cwd();
	const pathEntries = (resolveEnvironmentValue(params.env, "PATH") ?? resolveEnvironmentValue(process$1.env, "PATH") ?? "").split(";").map((entry) => entry.replace(/^"(.*)"$/, "$1").trim()).filter(Boolean).map((entry) => path.isAbsolute(entry) ? entry : path.resolve(cwd, entry));
	return resolveExecutableFromPathEnv(params.command, pathEntries.join(";"), params.env, { includeExtensionless: false });
}
function resolveSupportedWindowsCommand(params) {
	if (process$1.platform !== "win32") return params.command;
	let resolved = resolveWindowsCommandFromCwdOrPath(params);
	const shimmedCommand = resolveWindowsCommandShim({
		command: params.command,
		cmdCommands: [
			"corepack",
			"pnpm",
			"yarn"
		]
	});
	if (!resolved && shimmedCommand !== params.command) resolved = resolveWindowsCommandFromCwdOrPath({
		...params,
		command: shimmedCommand
	});
	if (!resolved) throw createWindowsCommandNotFoundError(params.command);
	const extension = normalizeLowercaseStringOrEmpty(path.extname(resolved));
	if ([
		".exe",
		".com",
		".cmd",
		".bat"
	].includes(extension)) return resolved;
	throw new Error(`Unsupported Windows command extension ${JSON.stringify(extension || "<none>")} for ${JSON.stringify(params.command)}; use an explicit executable or shell wrapper.`);
}
/** Resolve one shell-free invocation before Execa can apply Windows fallbacks. */
function resolveSafeChildProcessInvocation(params) {
	const finalArgv = resolveNpmArgvForWindows(params.argv) ?? params.argv;
	const cwd = params.cwd instanceof URL ? fileURLToPath(params.cwd) : params.cwd;
	const resolvedCommand = resolveSupportedWindowsCommand({
		command: finalArgv[0] ?? "",
		cwd,
		env: params.env
	});
	const useCmdWrapper = isWindowsBatchCommand(resolvedCommand);
	return {
		command: useCmdWrapper ? resolveSupportedWindowsCommand({
			command: resolveTrustedWindowsCmdExe(),
			cwd,
			env: params.env
		}) : resolvedCommand,
		args: useCmdWrapper ? [
			"/d",
			"/s",
			"/c",
			buildWindowsCmdExeCommandLine(resolvedCommand, finalArgv.slice(1))
		] : finalArgv.slice(1),
		usesWindowsExitCodeShim: process$1.platform === "win32" && (useCmdWrapper || finalArgv !== params.argv),
		windowsHide: true,
		windowsVerbatimArguments: useCmdWrapper ? true : params.windowsVerbatimArguments
	};
}
function isWindowsBatchCommand(resolvedCommand, platform = process$1.platform) {
	if (platform !== "win32") return false;
	const ext = normalizeLowercaseStringOrEmpty(path.extname(resolvedCommand));
	return ext === ".cmd" || ext === ".bat";
}
function buildWindowsCmdExeCommandLine(command, args) {
	return `"${[command, ...args].map((arg) => {
		if (WINDOWS_UNSAFE_CMD_CHARS_RE.test(arg)) throw new Error(`Unsafe Windows cmd.exe argument detected: ${JSON.stringify(arg)}. Pass an explicit shell-wrapper argv at the call site instead.`);
		return `"${arg.replace(/\\+/g, (backslashes, offset) => {
			const next = arg[offset + backslashes.length];
			return next === "\"" || next === void 0 ? backslashes.repeat(2) : backslashes;
		}).replace(/"/g, "\"\"")}"`;
	}).join(" ")}"`;
}
function resolveTrustedWindowsCmdExe(platform = process$1.platform) {
	if (platform !== "win32") return "cmd.exe";
	return getWindowsCmdExePath();
}
/**
* Resolve package-manager commands that Windows exposes through .cmd shims.
* Explicit extensions are preserved so callers can pass already-resolved tools.
*/
function resolveWindowsCommandShim(params) {
	if ((params.platform ?? process$1.platform) !== "win32") return params.command;
	const basename = normalizeLowercaseStringOrEmpty(path.basename(params.command));
	if (path.extname(basename)) return params.command;
	if (params.cmdCommands.includes(basename)) return `${params.command}.cmd`;
	return params.command;
}
/** Remote PID and pipes arrive together before admission or stream subscription. */
async function waitForCommandSpawn(child) {
	if (child.nodeChildProcess instanceof BrokerChild) try {
		await child.nodeChildProcess.ready();
	} catch {
		await child;
	}
}
const commandProcessScope = new AsyncLocalStorage();
function resolveCommandProcessSignal(signal) {
	const inherited = commandProcessScope.getStore()?.signal;
	return inherited ? AbortSignal.any(signal ? [inherited, signal] : [inherited]) : signal;
}
/** Cleanup helpers must outlive cancellation of the commands they are settling. */
function runOutsideCommandProcessScope(run) {
	return commandProcessScope.exit(run);
}
/** Join the command owner's cleanup separately from its bounded caller result. */
function retainCommandProcessCleanup(cleanup) {
	const scope = commandProcessScope.getStore();
	if (!scope) return;
	const settled = cleanup.then((result) => {
		if (result === "uncertain") scope.failure ??= { error: new CommandProcessCleanupError() };
	}, (error) => {
		scope.failure ??= { error };
	});
	scope.cleanups.add(settled);
	settled.then(() => scope.cleanups.delete(settled));
}
function retainCommandProcess(scope, child) {
	let pid;
	let startedAt = null;
	let stopped = false;
	const nativeChild = child.nodeChildProcess;
	let observedExit = nativeChild.exitCode != null || nativeChild.signalCode != null;
	const onExit = () => {
		observedExit = true;
	};
	nativeChild.once("exit", onExit);
	const closed = nativeChild instanceof BrokerChild ? nativeChild.waitForClose() : void 0;
	const stop = () => {
		if (stopped || pid === void 0 || process$1.platform === "win32") return;
		stopped = true;
		if (nativeChild.exitCode !== null || nativeChild.signalCode !== null) {
			const currentStart = getFileLockProcessStartTime(pid);
			if (currentStart !== null && currentStart !== startedAt) throw new CommandProcessCleanupError();
		}
		killProcessTree(pid, {
			detached: true,
			force: true
		});
	};
	const initialize = () => {
		pid = child.pid;
		if (pid !== void 0 && process$1.platform !== "win32") {
			startedAt = getFileLockProcessStartTime(pid);
			if (scope.signal.aborted) stop();
		}
	};
	const readiness = child.nodeChildProcess instanceof BrokerChild && child.pid === void 0 ? child.nodeChildProcess.ready().then(initialize) : Promise.resolve(initialize());
	const completed = Promise.resolve(child).then(() => void 0, () => void 0).then(async () => {
		await closed;
		nativeChild.removeListener("exit", onExit);
	});
	const initialized = readiness.catch((error) => {
		if (!(nativeChild instanceof BrokerChild && nativeChild.notStarted)) scope.failure ??= { error };
	});
	const owned = {
		stop,
		async settle() {
			await initialized;
			await completed;
			if (pid === void 0) {
				if (nativeChild instanceof BrokerChild && !nativeChild.notStarted) throw new CommandProcessCleanupError();
				return;
			}
			if (process$1.platform === "win32") {
				if (!observedExit) throw new CommandProcessCleanupError();
				return;
			}
			const deadline = Date.now() + 300;
			while (isChildProcessTreeAlive({ pid })) {
				const currentStart = getFileLockProcessStartTime(pid);
				const remaining = deadline - Date.now();
				if (currentStart !== null && currentStart !== startedAt || remaining <= 0) throw new CommandProcessCleanupError();
				await new Promise((resolve) => {
					setTimeout(resolve, Math.min(25, remaining));
				});
			}
		}
	};
	scope.children.add(owned);
	completed.then(() => {
		if (pid !== void 0 && process$1.platform !== "win32" && !isChildProcessTreeAlive({ pid })) scope.children.delete(owned);
	});
}
function spawnCommandWithInvocation(argv, options = {}) {
	const scope = commandProcessScope.getStore();
	if (scope?.signal.aborted) throw new Error("Command process scope is closed");
	const { baseEnv, env, windowsVerbatimArguments, cancelSignal, inheritScopeCancellation = true, ...execaOptions } = options;
	const commandEnv = resolveCommandEnv({
		argv,
		baseEnv,
		env
	});
	const invocation = resolveSafeChildProcessInvocation({
		argv,
		cwd: execaOptions.cwd,
		env: commandEnv,
		windowsVerbatimArguments
	});
	const commandOptions = {
		...execaOptions,
		cancelSignal: inheritScopeCancellation ? resolveCommandProcessSignal(cancelSignal) : cancelSignal,
		...scope ? { killDescendants: true } : {},
		env: commandEnv,
		extendEnv: false,
		shell: false,
		windowsHide: invocation.windowsHide,
		windowsVerbatimArguments: invocation.windowsVerbatimArguments
	};
	const broker = getSpawnBroker();
	const remoteOptions = broker ? brokerExecaOptions(commandOptions) : void 0;
	const child = broker && remoteOptions ? spawnBrokerCommand(broker, [invocation.command, ...invocation.args], commandOptions, remoteOptions) : execa(invocation.command, invocation.args, commandOptions);
	recordChildProcessSpawn(invocation.command, child.nodeChildProcess);
	if (scope) retainCommandProcess(scope, child);
	return {
		child,
		invocation
	};
}
/** Spawn through the canonical argv, environment, and Windows safety boundary. */
function spawnCommand(argv, options = {}) {
	return spawnCommandWithInvocation(argv, options).child;
}
function resolveCommandEnv(params) {
	const baseEnv = params.baseEnv ?? process$1.env;
	const platform = params.platform ?? process$1.platform;
	const argv = params.argv;
	const shouldSuppressNpmFund = (() => {
		const cmd = path.basename(argv[0] ?? "");
		if (cmd === "npm" || cmd === "npm.cmd" || cmd === "npm.exe") return true;
		if (cmd === "node" || cmd === "node.exe") return (argv[1] ?? "").includes("npm-cli.js");
		return false;
	})();
	const resolvedEnv = mergeProcessEnv([baseEnv, params.env], platform);
	if (shouldSuppressNpmFund) {
		if (resolvedEnv.NPM_CONFIG_FUND == null) resolvedEnv.NPM_CONFIG_FUND = "false";
		if (resolvedEnv.npm_config_fund == null) resolvedEnv.npm_config_fund = "false";
	}
	return markOpenClawExecEnv(resolvedEnv);
}
//#endregion
//#region src/process/exec-termination.ts
const WINDOWS_TASKKILL_TIMEOUT_MS = 5e3;
function createCommandTerminationController(params) {
	let processTreeSettlement;
	let cleanup = "normal";
	const readOriginalStart = () => params.processTree && params.child.pid && process$1.platform !== "win32" ? getFileLockProcessStartTime(params.child.pid) : null;
	let awaitingSpawn = params.spawned !== void 0;
	let terminateWhenSpawned = false;
	let originalStart = awaitingSpawn ? null : readOriginalStart();
	let windowsTerminationPromise;
	const isDirectChildAlive = () => !params.isChildExited() && params.child.exitCode == null && params.child.signalCode == null;
	const spawnTaskkill = async (args) => {
		try {
			await runOutsideCommandProcessScope(() => spawnCommand([getWindowsSystem32ExePath("taskkill.exe"), ...args], {
				baseEnv: params.baseEnv,
				env: params.env,
				forceKillAfterDelay: 300,
				reject: false,
				stdio: "ignore",
				timeout: WINDOWS_TASKKILL_TIMEOUT_MS
			}));
		} catch {}
	};
	const startWindowsTermination = (childPid, graceful) => {
		const taskkills = [];
		windowsTerminationPromise = (async () => {
			if (graceful) {
				taskkills.push(spawnTaskkill([
					"/PID",
					String(childPid),
					"/T"
				]));
				await new Promise((resolve) => {
					setTimeout(resolve, params.killGraceMs).unref();
				});
				if (isDirectChildAlive()) taskkills.push(spawnTaskkill([
					"/PID",
					String(childPid),
					"/T",
					"/F"
				]));
			} else taskkills.push(spawnTaskkill([
				"/PID",
				String(childPid),
				"/T",
				"/F"
			]));
			await Promise.allSettled(taskkills);
			if (!params.isCommandSettled()) params.cancelController.abort();
		})();
	};
	const terminate = () => {
		if (awaitingSpawn) {
			terminateWhenSpawned = true;
			return false;
		}
		const childPid = params.child.pid;
		const directChildAlive = isDirectChildAlive();
		if (process$1.platform === "win32" && !directChildAlive) return false;
		if (params.processTree && typeof childPid === "number") {
			if (process$1.platform === "win32") {
				startWindowsTermination(childPid, params.processTree.mode !== "force");
				return true;
			}
			const force = params.processTree.mode === "force" || params.killSignal === "SIGKILL" || params.killSignal === constants.signals.SIGKILL;
			if (processTreeSettlement) return !force;
			const groupAlive = () => isChildProcessTreeAlive({ pid: childPid });
			const forceAndObserve = async () => {
				const start = getFileLockProcessStartTime(childPid);
				if (start !== null && start !== originalStart) {
					cleanup = "uncertain";
					if (isDirectChildAlive()) params.cancelController.abort();
					return;
				}
				cleanup = "forced";
				killProcessTree(childPid, {
					force: true,
					detached: true
				});
				const deadline = Date.now() + 300;
				while (groupAlive()) {
					const currentStart = getFileLockProcessStartTime(childPid);
					const remaining = deadline - Date.now();
					if (currentStart !== null && currentStart !== originalStart) {
						cleanup = "uncertain";
						return;
					}
					if (remaining <= 0) {
						cleanup = groupAlive() ? "uncertain" : "forced";
						return;
					}
					await new Promise((resolve) => {
						setTimeout(resolve, Math.min(25, remaining));
					});
				}
			};
			if (!directChildAlive && !groupAlive()) return false;
			if (force) {
				processTreeSettlement = forceAndObserve();
				return false;
			}
			cleanup = "cooperative";
			try {
				process$1.kill(-childPid, params.killSignal ?? "SIGTERM");
			} catch (error) {
				if (error.code !== "ESRCH") cleanup = "uncertain";
			}
			processTreeSettlement = new Promise((resolve) => {
				const deadline = Date.now() + params.killGraceMs;
				const check = () => {
					if (!groupAlive()) {
						cleanup = "cooperative";
						resolve();
						return;
					}
					if (Date.now() < deadline) {
						setTimeout(check, Math.min(25, deadline - Date.now()));
						return;
					}
					forceAndObserve().then(resolve);
				};
				check();
			});
			return true;
		}
		if (!directChildAlive) return false;
		if (process$1.platform === "win32" && typeof childPid === "number") {
			startWindowsTermination(childPid, false);
			return true;
		}
		return false;
	};
	const settle = async () => {
		if (windowsTerminationPromise) {
			await windowsTerminationPromise;
			return "forced";
		}
		await processTreeSettlement;
		return cleanup;
	};
	if (params.spawned) params.spawned.then(() => {
		originalStart = readOriginalStart();
		awaitingSpawn = false;
		if (terminateWhenSpawned && !terminate()) params.cancelController.abort();
	}, () => {
		awaitingSpawn = false;
	});
	return {
		terminate,
		settle
	};
}
//#endregion
//#region src/process/exec-runner.ts
const WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS = 250;
const WINDOWS_CLOSE_STATE_POLL_MS = 10;
async function runCommandWithTimeout(argv, optionsOrTimeout) {
	return await runCommandWithOutputEncoding(argv, optionsOrTimeout, false);
}
async function runCommandWithOutputEncoding(argv, optionsOrTimeout, forceUtf8, raw = false) {
	const options = typeof optionsOrTimeout === "number" ? { timeoutMs: optionsOrTimeout } : optionsOrTimeout;
	const { timeoutMs, cwd, input, stdinFileDescriptor, baseEnv, env, noOutputTimeoutMs, killProcessTree, killSignal, killGraceMs } = options;
	const signal = resolveCommandProcessSignal(options.signal);
	const resolvedTimeoutMs = typeof timeoutMs === "number" ? resolveTimerTimeoutMs(timeoutMs, 1) : void 0;
	if (options.requireProcessTreeExtinction && !killProcessTree) throw new Error("Process-tree extinction requires process-tree ownership");
	const hasInput = input !== void 0;
	if (stdinFileDescriptor !== void 0) {
		if (!Number.isInteger(stdinFileDescriptor) || stdinFileDescriptor < 0) throw new Error("stdinFileDescriptor must be a nonnegative integer");
		if (hasInput) throw new Error("Command accepts either input or stdinFileDescriptor, not both");
	}
	if (options.beforeInput && !hasInput) throw new Error("Child input admission requires explicit input");
	const resolvedKillGraceMs = resolveTimerTimeoutMs(killGraceMs, 300, 0);
	if (signal?.aborted) {
		const interrupted = {
			code: null,
			signal: null,
			killed: false,
			termination: "signal",
			cleanup: "normal",
			noOutputTimedOut: false
		};
		return raw ? {
			...interrupted,
			stdout: Buffer.alloc(0),
			stderr: Buffer.alloc(0),
			windowsEncoding: null
		} : {
			...interrupted,
			stdout: "",
			stderr: ""
		};
	}
	const stdoutCapture = createCapturedOutputBuffers();
	const stderrCapture = createCapturedOutputBuffers();
	const maxStdoutBytes = resolveMaxOutputBytes(options.maxOutputBytes, "stdout");
	const maxStderrBytes = resolveMaxOutputBytes(options.maxOutputBytes, "stderr");
	const maxCombinedOutputBytes = typeof options.maxCombinedOutputBytes === "number" && Number.isFinite(options.maxCombinedOutputBytes) && options.maxCombinedOutputBytes > 0 ? Math.max(1, Math.floor(options.maxCombinedOutputBytes)) : void 0;
	const stdoutCaptureMode = resolveOutputCapture(options.outputCapture, "stdout");
	const stderrCaptureMode = resolveOutputCapture(options.outputCapture, "stderr");
	if (maxCombinedOutputBytes !== void 0 && stdoutCaptureMode !== stderrCaptureMode) throw new Error("maxCombinedOutputBytes requires matching stdout and stderr capture modes");
	const usesCombinedTailCapture = maxCombinedOutputBytes !== void 0 && stdoutCaptureMode === "tail" && stderrCaptureMode === "tail";
	const maxPreservedPendingLineBytes = Math.min(Math.max(maxStdoutBytes, maxStderrBytes), MAX_PRESERVED_PENDING_LINE_BYTES);
	const maxPreservedOutputLines = Math.max(0, Math.floor(options.maxPreservedOutputLines ?? 16));
	const windowsEncoding = forceUtf8 ? null : resolveWindowsConsoleEncoding();
	const cancelController = new AbortController();
	let termination;
	let childExitState;
	let commandSettled = false;
	let combinedOutputBytes = 0;
	let combinedCapturedBytes = 0;
	const outputBytesByStream = {
		stdout: 0,
		stderr: 0
	};
	const combinedCapturedBytesByStream = {
		stdout: 0,
		stderr: 0
	};
	const combinedTailChunks = [];
	let noOutputTimer;
	let outputObserverError;
	let outputErrorStream;
	let terminatingOutputError;
	const { child, invocation } = spawnCommandWithInvocation(argv, {
		buffer: false,
		cancelSignal: cancelController.signal,
		inheritScopeCancellation: false,
		cwd,
		detached: Boolean(killProcessTree && process$1.platform !== "win32"),
		encoding: "buffer",
		baseEnv,
		env,
		forceKillAfterDelay: resolvedKillGraceMs,
		killSignal,
		...hasInput && !options.beforeInput ? { input } : {},
		reject: false,
		stdio: [
			options.stdinFileDescriptor ?? (hasInput ? "pipe" : "inherit"),
			"pipe",
			"pipe"
		],
		stripFinalNewline: false,
		windowsVerbatimArguments: options.windowsVerbatimArguments
	});
	const startupReady = child.pid === void 0 ? waitForCommandSpawn(child) : void 0;
	let waitingForSpawn = startupReady !== void 0;
	const startupCanceled = createDeferredCore();
	const nodeChild = child.nodeChildProcess;
	const ownsExitedProcessTree = Boolean(killProcessTree && process$1.platform !== "win32");
	const resolvedNoOutputTimeoutMs = typeof noOutputTimeoutMs === "number" && Number.isFinite(noOutputTimeoutMs) && noOutputTimeoutMs > 0 ? resolveTimerTimeoutMs(noOutputTimeoutMs, 1) : void 0;
	const ownsOutputDeadline = ownsExitedProcessTree && (resolvedTimeoutMs !== void 0 || resolvedNoOutputTimeoutMs !== void 0);
	let releaseOutput;
	const terminationController = createCommandTerminationController({
		child: nodeChild,
		spawned: startupReady,
		cancelController,
		baseEnv,
		env,
		processTree: killProcessTree ? { mode: "graceful" } : void 0,
		isChildExited: () => childExitState !== void 0,
		isCommandSettled: () => commandSettled,
		killGraceMs: resolvedKillGraceMs,
		killSignal
	});
	const processCleanup = (async () => {
		await child.then(() => void 0, () => void 0);
		commandSettled = true;
		await startupReady?.catch(() => {});
		return await terminationController.settle();
	})();
	retainCommandProcessCleanup(processCleanup);
	processCleanup.catch(() => {});
	nodeChild.once("exit", (code, signalValue) => {
		childExitState = {
			code,
			signal: signalValue
		};
		if (!ownsOutputDeadline || code !== 0 || termination) releaseOutput = releaseChildProcessOutputAfterExit(nodeChild);
		if (killProcessTree && !termination && (code !== 0 || options.requireProcessTreeExtinction)) terminationController.terminate();
	});
	const cancel = (reason) => {
		if (termination || commandSettled || childExitState && reason !== "output-limit" && (!ownsExitedProcessTree || childExitState.code !== 0)) return;
		termination = reason;
		if (waitingForSpawn) startupCanceled.resolve(reason);
		if (childExitState) releaseOutput ??= releaseChildProcessOutputAfterExit(nodeChild);
		if (!terminationController.terminate()) cancelController.abort();
	};
	const armNoOutputTimer = () => {
		if (resolvedNoOutputTimeoutMs === void 0 || commandSettled || termination || childExitState && !ownsExitedProcessTree) return;
		noOutputTimer = noOutputTimer?.refresh() ?? setTimeout(() => cancel("no-output-timeout"), resolvedNoOutputTimeoutMs);
	};
	const timeoutTimer = resolvedTimeoutMs === void 0 ? void 0 : setTimeout(() => cancel("timeout"), resolvedTimeoutMs);
	const onAbort = () => cancel("signal");
	signal?.addEventListener("abort", onAbort, { once: true });
	armNoOutputTimer();
	const clearTimers = () => {
		if (timeoutTimer) clearTimeout(timeoutTimer);
		clearTimeout(noOutputTimer);
		noOutputTimer = void 0;
		signal?.removeEventListener("abort", onAbort);
	};
	if (startupReady) {
		let interrupted;
		try {
			interrupted = await Promise.race([startupReady.then(() => void 0), startupCanceled.promise]);
		} catch (error) {
			clearTimers();
			throw error;
		}
		if (interrupted) {
			clearTimers();
			processCleanup.finally(() => releaseOutput?.()).catch(() => {});
			const stopped = {
				pid: nodeChild.pid,
				code: interrupted === "timeout" || interrupted === "no-output-timeout" ? 124 : null,
				signal: null,
				killed: nodeChild.killed,
				cleanup: "uncertain",
				termination: interrupted === "output-limit" ? "signal" : interrupted,
				noOutputTimedOut: interrupted === "no-output-timeout",
				outputLimitExceeded: interrupted === "output-limit" || void 0
			};
			return raw ? {
				...stopped,
				stdout: Buffer.alloc(0),
				stderr: Buffer.alloc(0),
				windowsEncoding
			} : {
				...stopped,
				stdout: "",
				stderr: ""
			};
		}
		waitingForSpawn = false;
	}
	const captureOutput = (capture, chunk, maxBytes, stream, captureMode) => {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		outputBytesByStream[stream] += buffer.byteLength;
		const streamLimitExceeded = outputBytesByStream[stream] > maxBytes;
		if (maxCombinedOutputBytes === void 0) {
			appendCapturedOutput(capture, buffer, maxBytes, captureMode);
			if (streamLimitExceeded && shouldTerminateOnOutputLimit(options.terminateOnOutputLimit, stream)) cancel("output-limit");
			return;
		}
		const combinedBytesBeforeChunk = combinedOutputBytes;
		combinedOutputBytes += buffer.byteLength;
		const combinedLimitExceeded = combinedOutputBytes > maxCombinedOutputBytes;
		if (usesCombinedTailCapture) {
			combinedTailChunks.push({
				stream,
				buffer
			});
			combinedCapturedBytes += buffer.byteLength;
			combinedCapturedBytesByStream[stream] += buffer.byteLength;
			const removeCapturedBytes = (index, requestedBytes) => {
				const entry = expectDefined(combinedTailChunks[index], "combined tail chunk");
				const removedBytes = Math.min(requestedBytes, entry.buffer.byteLength);
				if (removedBytes === entry.buffer.byteLength) combinedTailChunks.splice(index, 1);
				else entry.buffer = Buffer.from(entry.buffer.subarray(removedBytes));
				combinedCapturedBytes -= removedBytes;
				combinedCapturedBytesByStream[entry.stream] -= removedBytes;
				(entry.stream === "stdout" ? stdoutCapture : stderrCapture).truncatedBytes += removedBytes;
			};
			while (combinedCapturedBytesByStream[stream] > maxBytes) {
				const index = combinedTailChunks.findIndex((entry) => entry.stream === stream);
				if (index < 0) break;
				removeCapturedBytes(index, combinedCapturedBytesByStream[stream] - maxBytes);
			}
			let combinedOverflow = combinedCapturedBytes - maxCombinedOutputBytes;
			while (combinedOverflow > 0) {
				removeCapturedBytes(0, combinedOverflow);
				combinedOverflow = combinedCapturedBytes - maxCombinedOutputBytes;
			}
		} else {
			const remaining = Math.max(0, maxCombinedOutputBytes - combinedBytesBeforeChunk);
			appendCapturedOutput(capture, buffer, Math.min(maxBytes, capture.bytes + remaining), captureMode);
		}
		if (combinedLimitExceeded && shouldTerminateOnOutputLimit(options.terminateOnOutputLimit, "combined") || streamLimitExceeded && shouldTerminateOnOutputLimit(options.terminateOnOutputLimit, stream)) cancel("output-limit");
	};
	const observeOutputChunk = (chunk, stream) => {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		if (termination || !options.onOutputChunk) return buffer;
		try {
			if (options.onOutputChunk(buffer, stream) === false) cancel("output-limit");
		} catch (error) {
			outputObserverError = error;
			cancel("output-limit");
		}
		return buffer;
	};
	const onOutputError = (error, stream) => {
		outputErrorStream ??= stream;
		if (termination || options.tolerateOutputError?.[stream] === true || !shouldTerminateOnOutputError(options.terminateOnOutputError, stream)) return;
		terminatingOutputError = toErrorObject(error, `Command ${stream} stream failed`);
		Object.assign(terminatingOutputError, { outputErrorStream: stream });
		cancel("signal");
	};
	child.stdout?.once("error", (error) => onOutputError(error, "stdout"));
	child.stderr?.once("error", (error) => onOutputError(error, "stderr"));
	child.stdout?.on("data", (chunk) => {
		const buffer = observeOutputChunk(chunk, "stdout");
		appendPreservedOutputLines({
			capture: stdoutCapture,
			chunk: buffer,
			stream: "stdout",
			preserveOutputLine: options.preserveOutputLine,
			maxPreservedOutputLines,
			maxPendingLineBytes: maxPreservedPendingLineBytes
		});
		captureOutput(stdoutCapture, buffer, maxStdoutBytes, "stdout", stdoutCaptureMode);
		armNoOutputTimer();
	});
	child.stderr?.on("data", (chunk) => {
		const buffer = observeOutputChunk(chunk, "stderr");
		appendPreservedOutputLines({
			capture: stderrCapture,
			chunk: buffer,
			stream: "stderr",
			preserveOutputLine: options.preserveOutputLine,
			maxPreservedOutputLines,
			maxPendingLineBytes: maxPreservedPendingLineBytes
		});
		captureOutput(stderrCapture, buffer, maxStderrBytes, "stderr", stderrCaptureMode);
		armNoOutputTimer();
	});
	let inputAdmissionError;
	if (options.beforeInput) {
		nodeChild.stdin?.once("error", (cause) => {
			if (hasErrnoCode(cause, "EPIPE")) return;
			inputAdmissionError ??= toErrorObject(cause, "Command input failed");
			cancel("signal");
		});
		try {
			if (nodeChild.pid === void 0 || !nodeChild.stdin) throw new Error("Child input admission has no spawned process");
			const admitted = options.beforeInput(nodeChild.pid, nodeChild.spawnargs);
			if (admitted !== void 0) {
				if (isPromiseLike(admitted)) Promise.resolve(admitted).catch(() => void 0);
				throw new TypeError("Child input admission must complete synchronously");
			}
			nodeChild.stdin.end(input);
		} catch (cause) {
			inputAdmissionError = toErrorObject(cause, "Child input admission failed");
			cancel("signal");
		}
	}
	const result = await child.finally(() => {
		commandSettled = true;
		clearTimers();
		releaseOutput?.();
	});
	let cleanup = await processCleanup;
	const resolvedSignal = result.signal ?? childExitState?.signal ?? nodeChild.signalCode ?? null;
	if (cleanup === "normal" && resolvedSignal) cleanup = "uncertain";
	if (inputAdmissionError) throw Object.assign(inputAdmissionError, { cleanup });
	if (terminatingOutputError) throw Object.assign(terminatingOutputError, { cleanup });
	if (outputObserverError !== void 0) throw Object.assign(toErrorObject(outputObserverError, "Command output observer failed"), { cleanup });
	const isCauseLessWindowsShimResult = !termination && invocation.usesWindowsExitCodeShim && typeof nodeChild.pid === "number" && result.code === void 0 && result.cause === void 0 && !result.timedOut && !result.isCanceled && !result.isMaxBuffer && !result.isTerminated;
	if (isCauseLessWindowsShimResult) for (let elapsedMs = 0; elapsedMs < WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS; elapsedMs += WINDOWS_CLOSE_STATE_POLL_MS) {
		if (childExitState?.code != null || childExitState?.signal != null || nodeChild.exitCode != null || nodeChild.signalCode != null) break;
		await new Promise((resolve) => {
			setTimeout(resolve, WINDOWS_CLOSE_STATE_POLL_MS);
		});
	}
	if (result.failed && !termination && !isPlainCommandExitFailure(result) && !isPlainCommandSignalFailure(result) && !isCauseLessWindowsShimResult && !(result.exitCode === 0 && outputErrorStream !== void 0 && options.tolerateOutputError?.[outputErrorStream] === true)) {
		const error = createSanitizedCommandError(result);
		Object.assign(error, { cleanup: typeof nodeChild.pid === "number" ? cleanup === "normal" ? "uncertain" : cleanup : "normal" });
		if (outputErrorStream) Object.assign(error, { outputErrorStream });
		throw error;
	}
	const killIssuedByAbort = termination === "signal" || termination === "output-limit";
	const resolvedCode = resolveProcessExitCode({
		explicitCode: result.exitCode ?? childExitState?.code,
		childExitCode: nodeChild.exitCode,
		resolvedSignal,
		usesWindowsExitCodeShim: invocation.usesWindowsExitCodeShim,
		timedOut: termination === "timeout",
		noOutputTimedOut: termination === "no-output-timeout",
		killIssuedByTimeout: termination === "timeout" || termination === "no-output-timeout",
		killIssuedByAbort
	});
	termination ??= resolvedSignal != null || result.isTerminated ? "signal" : "exit";
	const normalizedCode = termination === "timeout" || termination === "no-output-timeout" ? resolvedCode == null || resolvedCode === 0 ? 124 : resolvedCode : resolvedCode;
	flushPreservedOutputLine({
		capture: stdoutCapture,
		stream: "stdout",
		preserveOutputLine: options.preserveOutputLine,
		maxPreservedOutputLines,
		maxPendingLineBytes: maxPreservedPendingLineBytes
	});
	flushPreservedOutputLine({
		capture: stderrCapture,
		stream: "stderr",
		preserveOutputLine: options.preserveOutputLine,
		maxPreservedOutputLines,
		maxPendingLineBytes: maxPreservedPendingLineBytes
	});
	if (usesCombinedTailCapture) for (const entry of combinedTailChunks) {
		const capture = entry.stream === "stdout" ? stdoutCapture : stderrCapture;
		capture.chunks.push(entry.buffer);
		capture.bytes += entry.buffer.byteLength;
	}
	const stdout = finalizeCapturedOutput(stdoutCapture, stdoutCaptureMode, forceUtf8);
	const stderr = finalizeCapturedOutput(stderrCapture, stderrCaptureMode, forceUtf8);
	const settled = {
		pid: nodeChild.pid,
		stdoutTruncatedBytes: stdoutCapture.truncatedBytes || void 0,
		stderrTruncatedBytes: stderrCapture.truncatedBytes || void 0,
		preservedStdoutLines: stdoutCapture.preservedLines.length > 0 ? stdoutCapture.preservedLines : void 0,
		preservedStderrLines: stderrCapture.preservedLines.length > 0 ? stderrCapture.preservedLines : void 0,
		code: normalizedCode,
		signal: resolvedSignal,
		killed: nodeChild.killed,
		killIssuedByAbort: killIssuedByAbort || void 0,
		cleanup,
		termination: termination === "output-limit" ? "signal" : termination,
		noOutputTimedOut: termination === "no-output-timeout",
		outputLimitExceeded: termination === "output-limit" || void 0,
		...outputErrorStream ? { outputErrorStream } : {}
	};
	return raw ? {
		...settled,
		stdout,
		stderr,
		windowsEncoding
	} : {
		...settled,
		stdout: forceUtf8 ? stdout.toString("utf8") : decodeWindowsOutputBuffer({
			buffer: stdout,
			windowsEncoding
		}),
		stderr: forceUtf8 ? stderr.toString("utf8") : decodeWindowsOutputBuffer({
			buffer: stderr,
			windowsEncoding
		})
	};
}
//#endregion
//#region src/utils/run-with-concurrency.ts
/** Runs async tasks with bounded concurrency while preserving result indexes. */
async function runTasksWithConcurrency(params) {
	const { tasks, limit, onTaskError, throwOnError = false } = params;
	const errorMode = params.errorMode ?? "continue";
	if (tasks.length === 0) return {
		results: [],
		firstError: void 0,
		hasError: false
	};
	const resolvedLimit = Number.isFinite(limit) ? Math.max(1, Math.min(Math.floor(limit), tasks.length)) : tasks.length;
	const results = Array.from({ length: tasks.length });
	let firstError = void 0;
	let hasError = false;
	return new Promise((resolve, reject) => {
		const runOne = async (task, index) => {
			if (errorMode === "stop" && hasError) return;
			try {
				results[index] = await task();
			} catch (error) {
				if (!hasError) {
					firstError = error;
					hasError = true;
				}
				let rejectionError = error;
				try {
					onTaskError?.(error, index);
				} catch (callbackError) {
					rejectionError = callbackError;
				}
				if (throwOnError) reject(rejectionError);
			}
		};
		const mapper = AsyncLocalStorage.bind((task, index) => Promise.resolve().then(() => runOne(task, index)));
		pMap(tasks.slice(), mapper, { concurrency: resolvedLimit }).then(() => resolve({
			results,
			firstError,
			hasError
		}), reject);
	});
}
//#endregion
//#region src/secrets/exec-provider-path-validation.ts
/** Checks the same command-path trust boundary before validation, writes, and execution. */
async function assertSecureExecCommandPath(params) {
	const commandPath = resolveUserPath(params.command);
	if (!commandPath) throw new Error(`${params.label} must be an absolute path.`);
	const stat = await safeStat(commandPath);
	if (!stat.ok) throw new Error(`${params.label} is not readable: ${commandPath}`);
	if (stat.isDir) throw new Error(`${params.label} must be a file: ${commandPath}`);
	if (stat.isSymlink) throw new Error(`${params.label} must not be a symlink: ${commandPath}`);
	if (params.trustedDirs && params.trustedDirs.length > 0) {
		if (!params.trustedDirs.map((entry) => resolveUserPath(entry)).some((dir) => isPathInside$2(dir, commandPath))) throw new Error(`${params.label} is outside trustedDirs: ${commandPath}`);
	}
	const perms = await inspectPathPermissions(commandPath);
	if (!perms.ok) throw new Error(`${params.label} permissions could not be verified: ${commandPath}`);
	if (perms.worldWritable || perms.groupWritable) throw new Error(`${params.label} permissions are too open: ${commandPath}`);
	if (process.platform === "win32" && perms.source === "unknown") throw new FsSafeError("permission-unverified", `${params.label} ACL verification unavailable on Windows for ${commandPath}. Move the command to a path whose ACLs OpenClaw can verify; there is no provider-level bypass.`);
	if (process.platform !== "win32" && typeof process.getuid === "function" && stat.uid != null) {
		const uid = process.getuid();
		if (stat.uid !== uid) throw new Error(`${params.label} must be owned by the current user (uid=${uid}): ${commandPath}`);
	}
	return commandPath;
}
//#endregion
//#region src/secrets/json-pointer.ts
/** JSON Pointer token helpers for file-backed secret refs. */
function failOrUndefined(params) {
	if (params.onMissing === "throw") throw new Error(params.message);
}
function decodeJsonPointerToken(token) {
	return token.replace(/~1/g, "/").replace(/~0/g, "~");
}
/**
* Reads a value from a JSON-like document using an absolute JSON Pointer.
* Missing segments throw by default; `onMissing: "undefined"` is for optional probes.
*/
function readJsonPointer(root, pointer, options = {}) {
	const onMissing = options.onMissing ?? "throw";
	if (!pointer.startsWith("/")) return failOrUndefined({
		onMissing,
		message: "File-backed secret ids must be absolute JSON pointers (for example: \"/providers/openai/apiKey\")."
	});
	const tokens = pointer.slice(1).split("/").map((token) => decodeJsonPointerToken(token));
	let current = root;
	for (const token of tokens) {
		if (Array.isArray(current)) {
			const index = parseConfigPathArrayIndex(token);
			if (index === void 0 || index >= current.length) return failOrUndefined({
				onMissing,
				message: `JSON pointer segment "${token}" is out of bounds.`
			});
			current = current[index];
			continue;
		}
		if (!isRecord(current)) return failOrUndefined({
			onMissing,
			message: `JSON pointer segment "${token}" does not exist.`
		});
		if (!Object.hasOwn(current, token)) return failOrUndefined({
			onMissing,
			message: `JSON pointer segment "${token}" does not exist.`
		});
		current = current[token];
	}
	return current;
}
//#endregion
//#region src/plugins/manifest-owner-policy.ts
/** Resolves whether a manifest owner plugin is effectively activated. */
function isActivatedManifestOwner(params) {
	return resolveEffectivePluginActivationState({
		id: params.plugin.id,
		origin: params.plugin.origin,
		channelIds: params.plugin.channels,
		config: params.normalizedConfig,
		rootConfig: params.rootConfig,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin)
	}).activated;
}
//#endregion
//#region src/secrets/provider-integrations.ts
/** Materializes trusted plugin secret-provider integrations into exec provider configs. */
const NODE_COMMAND_PLACEHOLDER = "${node}";
function resolvePluginRelativePath(value, pluginRoot) {
	const resolved = path.resolve(pluginRoot, value);
	return isPathInside$1(pluginRoot, resolved) ? resolved : void 0;
}
function isPluginRelativeEntrypoint(value) {
	return value.startsWith("./");
}
function resolveArg(arg, pluginRoot) {
	if (!arg.startsWith("./") && !arg.startsWith("../")) return arg;
	return resolvePluginRelativePath(arg, pluginRoot);
}
function withNodeCommandTrustedDir(command, pluginRoot) {
	return command === NODE_COMMAND_PLACEHOLDER ? [.../* @__PURE__ */ new Set([path.dirname(process.execPath), pluginRoot])] : [pluginRoot];
}
function isSecurePosixPathStat(stat) {
	if (process.platform === "win32") return true;
	if ((stat.mode & 18) !== 0) return false;
	if (typeof process.getuid !== "function" || typeof stat.uid !== "number") return true;
	const uid = process.getuid();
	return stat.uid === uid || stat.uid === 0;
}
function pathSegmentsBetween(rootDir, targetDir) {
	if (!isPathInside$1(rootDir, targetDir)) return;
	const relative = path.relative(rootDir, targetDir);
	if (relative === "") return [];
	return relative.split(path.sep).filter(Boolean);
}
function isSecurePluginEntrypointPath(params) {
	if (process.platform === "win32") return true;
	const originalSegments = pathSegmentsBetween(path.resolve(params.pluginRoot), path.dirname(path.resolve(params.resolvedEntrypoint)));
	const realpathSegments = pathSegmentsBetween(params.pluginRootRealpath, path.dirname(params.entrypointRealpath));
	if (!originalSegments || !realpathSegments) return false;
	let originalDir = path.resolve(params.pluginRoot);
	for (const [index, segment] of ["", ...originalSegments].entries()) {
		if (segment) originalDir = path.join(originalDir, segment);
		const stat = fsSync.lstatSync(originalDir);
		if (index === 0 && stat.isSymbolicLink()) continue;
		if (!stat.isDirectory() || stat.isSymbolicLink() || !isSecurePosixPathStat(stat)) return false;
	}
	let realpathDir = params.pluginRootRealpath;
	for (const segment of ["", ...realpathSegments]) {
		if (segment) realpathDir = path.join(realpathDir, segment);
		const stat = fsSync.lstatSync(realpathDir);
		if (!stat.isDirectory() || !isSecurePosixPathStat(stat)) return false;
	}
	return true;
}
function resolveNodeEntrypointArg(params) {
	const entrypoint = params.integration.args?.[0];
	if (!entrypoint || !isPluginRelativeEntrypoint(entrypoint)) return;
	let pluginRootRealpath;
	try {
		pluginRootRealpath = fsSync.realpathSync(params.pluginRoot);
	} catch {
		return;
	}
	const resolved = resolvePluginRelativePath(entrypoint, params.pluginRoot);
	if (!resolved) return;
	let stat;
	try {
		stat = fsSync.lstatSync(resolved);
	} catch {
		return;
	}
	if (!stat.isFile() || stat.isSymbolicLink()) return;
	if (params.rejectHardlinks && stat.nlink > 1) return;
	if (!isSecurePosixPathStat(stat)) return;
	try {
		const realpath = fsSync.realpathSync(resolved);
		if (!isPathInside$1(pluginRootRealpath, realpath)) return;
		if (!isSecurePluginEntrypointPath({
			pluginRoot: params.pluginRoot,
			pluginRootRealpath,
			resolvedEntrypoint: resolved,
			entrypointRealpath: realpath
		})) return;
		return realpath;
	} catch {
		return;
	}
}
function materializeExecProviderConfig(integration, record, env) {
	const pluginRoot = record.rootDir;
	if (integration.command !== NODE_COMMAND_PLACEHOLDER) return;
	const nodeEntrypoint = resolveNodeEntrypointArg({
		integration,
		pluginRoot,
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: record.origin,
			rootDir: pluginRoot,
			env
		})
	});
	if (!nodeEntrypoint) return;
	const args = integration.args?.map((arg, index) => nodeEntrypoint && index === 0 ? nodeEntrypoint : resolveArg(arg, pluginRoot)).filter((arg) => arg !== void 0);
	if (integration.args && args?.length !== integration.args.length) return;
	const trustedDirs = withNodeCommandTrustedDir(integration.command, pluginRoot);
	return {
		source: "exec",
		command: process.execPath,
		...args ? { args } : {},
		...integration.timeoutMs !== void 0 ? { timeoutMs: integration.timeoutMs } : {},
		...integration.noOutputTimeoutMs !== void 0 ? { noOutputTimeoutMs: integration.noOutputTimeoutMs } : {},
		...integration.maxOutputBytes !== void 0 ? { maxOutputBytes: integration.maxOutputBytes } : {},
		...integration.jsonOnly === false ? { jsonOnly: false } : {},
		...integration.env ? { env: integration.env } : {},
		...integration.passEnv ? { passEnv: integration.passEnv } : {},
		trustedDirs
	};
}
function canExposeSecretProviderIntegrations(params) {
	if (params.record.origin !== "bundled" && params.record.origin !== "global") return false;
	return isActivatedManifestOwner({
		plugin: params.record,
		normalizedConfig: params.normalizedConfig,
		rootConfig: params.config
	});
}
/** Narrows a secret provider config to the plugin-integration exec shape. */
function isPluginIntegrationSecretProviderConfig(value) {
	return typeof value === "object" && value !== null && "source" in value && value.source === "exec" && "pluginIntegration" in value && typeof value.pluginIntegration === "object" && value.pluginIntegration !== null && "pluginId" in value.pluginIntegration && typeof value.pluginIntegration.pluginId === "string" && value.pluginIntegration.pluginId.trim().length > 0 && "integrationId" in value.pluginIntegration && typeof value.pluginIntegration.integrationId === "string" && value.pluginIntegration.integrationId.trim().length > 0;
}
/** Materializes an active trusted plugin secret-provider integration into an exec provider. */
/** Resolves a trusted plugin secret-provider integration into executable provider config. */
function resolveSecretProviderIntegrationConfig(params) {
	const config = params.config ?? {};
	const normalizedConfig = normalizePluginsConfig(config.plugins);
	const env = params.env ?? process.env;
	const { pluginId, integrationId } = params.providerConfig.pluginIntegration;
	if (!isValidSecretProviderAlias(params.providerAlias)) return {
		ok: false,
		reason: `provider alias "${params.providerAlias}" is invalid`
	};
	const record = params.manifestRegistry.plugins.find((candidate) => candidate.id === pluginId);
	if (!record) return {
		ok: false,
		reason: `plugin "${pluginId}" is not installed`
	};
	if (!canExposeSecretProviderIntegrations({
		record,
		normalizedConfig,
		config
	})) return {
		ok: false,
		reason: `plugin "${pluginId}" is not active or is not from a trusted install origin`
	};
	const integration = record.secretProviderIntegrations?.[integrationId];
	if (!integration) return {
		ok: false,
		reason: `plugin "${record.id}" does not declare secret provider integration "${integrationId}"`
	};
	const materialized = materializeExecProviderConfig(integration, record, env);
	if (!materialized) return {
		ok: false,
		reason: `plugin "${record.id}" integration "${integrationId}" could not be materialized`
	};
	return {
		ok: true,
		providerConfig: materialized
	};
}
//#endregion
//#region src/secrets/sentinel.ts
const SECRET_SENTINEL_SOURCE = "oc-sent-v2\\.[A-Za-z0-9_-]+\\.end";
11 + Math.ceil(262288 / 3) + 4;
new RegExp(SECRET_SENTINEL_SOURCE, "g");
const secretSentinelKeys = resolveGlobalSingleton(Symbol.for("openclaw.secretSentinel.keys"), () => ({ keys: randomBytes(64) })).keys;
secretSentinelKeys.subarray(0, 32);
secretSentinelKeys.subarray(32);
//#endregion
//#region src/secrets/store/secret-store-sqlite.ts
function isMissingSecretStoreTableError(error) {
	return error instanceof Error && hasErrnoCode(error, "ERR_SQLITE_ERROR") && error.message === "no such table: secret_store_entries";
}
//#endregion
//#region src/secrets/store/secret-store-validation-error.ts
var SecretStoreValidationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SecretStoreValidationError";
	}
};
const SECRET_STORE_VALUE_MAX_BYTES = 65536;
createSubsystemLogger("secrets/store");
function normalizeScope(_scope) {
	return {
		scopeKind: "team",
		scopeId: ""
	};
}
function assertSecretStoreEnvName(name) {
	if (!ENV_SECRET_REF_ID_RE$1.test(name)) throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", `Secret store name must match ${String(ENV_SECRET_REF_ID_RE$1)}.`);
}
function readSecretStoreValue(params) {
	try {
		assertSecretStoreEnvName(params.name);
		const { scopeKind, scopeId } = normalizeScope(params.scope);
		const row = withExistingOpenClawStateDatabaseReadOnly(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			return executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("secret_store_entries").select(["value", "kind"]).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name).where("deleted_at_ms", "is", null));
		}, params.database ?? {});
		if (!row) return err({
			code: "SECRET_STORE_NOT_FOUND",
			message: `Secret store entry "${params.name}" was not found.`
		});
		if (row.kind === "secret") registerSecretValueForRedaction(row.value);
		return ok(row.value);
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return err({
			code: "SECRET_STORE_NOT_FOUND",
			message: `Secret store entry "${params.name}" was not found.`
		});
		if (error instanceof SecretStoreValidationError) return err({
			code: "SECRET_STORE_INVALID_NAME",
			message: error.message
		});
		return err({
			code: "SECRET_STORE_UNAVAILABLE",
			message: "Secret store database is unavailable.",
			cause: error
		});
	}
}
//#endregion
//#region src/secrets/resolve-store.ts
const STORE_SECRET_REF_BATCH_MAX_BYTES = 512 * SECRET_STORE_VALUE_MAX_BYTES;
function resolveStoreRefs(params) {
	const resolved = /* @__PURE__ */ new Map();
	let resolvedBytes = 0;
	for (const ref of params.refs) {
		const result = readSecretStoreValue({
			scope: { kind: "team" },
			name: ref.id,
			database: params.database
		});
		if (!result.ok) {
			if (result.error.code === "SECRET_STORE_NOT_FOUND") {
				params.onRefError(refResolutionError({
					code: "SECRET_REF_NOT_FOUND",
					source: "store",
					provider: params.providerName,
					refId: ref.id,
					message: result.error.message
				}));
				continue;
			}
			if (result.error.code === "SECRET_STORE_INVALID_NAME") {
				params.onRefError(refResolutionError({
					code: "SECRET_REF_INVALID",
					source: "store",
					provider: params.providerName,
					refId: ref.id,
					message: result.error.message
				}));
				continue;
			}
			throw providerResolutionError({
				code: "SECRET_PROVIDER_UNAVAILABLE",
				source: "store",
				provider: params.providerName,
				message: result.error.message,
				cause: result.error.cause
			});
		}
		resolvedBytes += Buffer.byteLength(result.value, "utf8");
		if (resolvedBytes > STORE_SECRET_REF_BATCH_MAX_BYTES) throw providerResolutionError({
			code: "SECRET_PROVIDER_INVALID",
			source: "store",
			provider: params.providerName,
			message: `Store provider "${params.providerName}" exceeded its ${STORE_SECRET_REF_BATCH_MAX_BYTES}-byte batch limit.`
		});
		resolved.set(ref.id, result.value);
	}
	return resolved;
}
//#endregion
//#region src/secrets/shared.ts
/** Shared parsing helpers for secrets migration/runtime code. */
/**
* Narrows to strings that contain non-whitespace content.
*/
function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
/**
* Normalizes numeric config to a positive integer, falling back when the input is not finite.
*/
function normalizePositiveInt(value, fallback) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.max(1, Math.floor(value));
	return Math.max(1, Math.floor(fallback));
}
/**
* Normalizes timer values with the shared timeout coercion rules used by secret providers.
*/
function normalizePositiveTimerMs(value, fallback) {
	return resolvePositiveTimerTimeoutMs(value, fallback);
}
//#endregion
//#region src/secrets/resolve.ts
/** Resolves SecretRef values from env, file, exec, and store secret providers. */
const DEFAULT_PROVIDER_CONCURRENCY = 4;
const DEFAULT_MAX_REFS_PER_PROVIDER = 512;
const DEFAULT_MAX_BATCH_BYTES = 262144;
const DEFAULT_FILE_MAX_BYTES = 1048576;
const DEFAULT_FILE_TIMEOUT_MS = 5e3;
const DEFAULT_EXEC_TIMEOUT_MS = 5e3;
const DEFAULT_EXEC_MAX_OUTPUT_BYTES = 1048576;
const SAFE_EXEC_ERROR_CODES = /* @__PURE__ */ new Set(["AMBIGUOUS_DUPLICATE_KEY", "NOT_FOUND"]);
function throwUnknownProviderResolutionError(params) {
	if (isSecretResolutionError(params.err)) throw params.err;
	throw providerResolutionError({
		...process.platform === "win32" && (params.source === "file" || params.source === "exec") && params.err instanceof FsSafeError && params.err.code === "permission-unverified" ? { code: "SECRET_PROVIDER_PATH_SECURITY_UNVERIFIABLE" } : {},
		source: params.source,
		provider: params.provider,
		message: formatErrorMessage(params.err),
		cause: params.err
	});
}
function resolveResolutionLimits() {
	return {
		maxProviderConcurrency: DEFAULT_PROVIDER_CONCURRENCY,
		maxRefsPerProvider: DEFAULT_MAX_REFS_PER_PROVIDER,
		maxBatchBytes: DEFAULT_MAX_BATCH_BYTES
	};
}
function resolveConfiguredProvider(params) {
	const { ref, config } = params;
	const providerConfig = config.secrets?.providers?.[ref.provider];
	if (isBuiltInDefaultSecretProviderRef(config, ref)) {
		if (ref.source === "env") return { source: "env" };
		if (ref.source === "store") return { source: "store" };
	}
	if (!providerConfig) throw providerResolutionError({
		code: "SECRET_PROVIDER_NOT_CONFIGURED",
		source: ref.source,
		provider: ref.provider,
		message: `Secret provider "${ref.provider}" is not configured (ref: ${ref.source}:${ref.provider}:${ref.id}).`
	});
	const configuredSource = resolveSecretRefProviderSourceMismatch(config, ref);
	if (configuredSource) throw providerResolutionError({
		code: "SECRET_PROVIDER_INVALID",
		source: ref.source,
		provider: ref.provider,
		message: `Secret provider "${ref.provider}" has source "${configuredSource}" but ref requests "${ref.source}".`
	});
	if (isPluginIntegrationSecretProviderConfig(providerConfig)) {
		const resolved = resolveSecretProviderIntegrationConfig({
			manifestRegistry: params.manifestRegistry ?? getCurrentPluginMetadataSnapshot({
				config,
				env: params.env,
				allowWorkspaceScopedSnapshot: true
			})?.manifestRegistry ?? loadPluginManifestRegistryCore({
				config,
				env: params.env
			}),
			providerAlias: ref.provider,
			providerConfig,
			config,
			env: params.env
		});
		if (!resolved.ok) throw providerResolutionError({
			source: ref.source,
			provider: ref.provider,
			message: `Secret provider "${ref.provider}" plugin integration is unavailable: ${resolved.reason}.`
		});
		return resolved.providerConfig;
	}
	return providerConfig;
}
async function readFileProviderPayload(params) {
	const cacheKey = params.providerName;
	const cache = params.cache;
	const read = async () => {
		const filePath = resolveUserPath(params.providerConfig.path);
		const timeoutMs = normalizePositiveTimerMs(params.providerConfig.timeoutMs, DEFAULT_FILE_TIMEOUT_MS);
		const maxBytes = normalizePositiveInt(params.providerConfig.maxBytes, DEFAULT_FILE_MAX_BYTES);
		try {
			const { buffer: payload } = await readSecureFile({
				filePath,
				label: `secrets.providers.${params.providerName}.path`,
				io: {
					maxBytes,
					timeoutMs
				},
				permissions: { allowInsecure: false }
			});
			const text = payload.toString("utf8").replace(/^\uFEFF/, "");
			if (params.providerConfig.mode === "singleValue") return text.replace(/\r?\n$/, "");
			const parsed = JSON.parse(text);
			if (!isRecord(parsed)) throw new Error(`File provider "${params.providerName}" payload is not a JSON object.`);
			return parsed;
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "timeout") throw new Error(`File provider "${params.providerName}" timed out after ${timeoutMs}ms.`, { cause: error });
			throw error;
		}
	};
	if (!cache) return await read();
	cache.filePayloadByProvider ??= /* @__PURE__ */ new Map();
	return await getOrCreatePromise(cache.filePayloadByProvider, cacheKey, read);
}
async function resolveEnvRefs(params) {
	const resolved = /* @__PURE__ */ new Map();
	const allowlist = params.providerConfig.allowlist ? new Set(params.providerConfig.allowlist) : null;
	for (const ref of params.refs) {
		if (allowlist && !allowlist.has(ref.id)) {
			params.onRefError(refResolutionError({
				code: "SECRET_REF_POLICY_DENIED",
				source: "env",
				provider: params.providerName,
				refId: ref.id,
				message: `Environment variable "${ref.id}" is not allowlisted in secrets.providers.${params.providerName}.allowlist.`
			}));
			continue;
		}
		const envValue = params.env[ref.id];
		if (!isNonEmptyString(envValue)) {
			params.onRefError(refResolutionError({
				code: "SECRET_REF_NOT_FOUND",
				source: "env",
				provider: params.providerName,
				refId: ref.id,
				message: `Environment variable "${ref.id}" is missing or empty.`
			}));
			continue;
		}
		resolved.set(ref.id, envValue);
	}
	return resolved;
}
async function resolveFileRefs(params) {
	let payload;
	try {
		payload = await readFileProviderPayload({
			providerName: params.providerName,
			providerConfig: params.providerConfig,
			cache: params.cache
		});
	} catch (err) {
		throwUnknownProviderResolutionError({
			source: "file",
			provider: params.providerName,
			err
		});
	}
	const mode = params.providerConfig.mode ?? "json";
	const resolved = /* @__PURE__ */ new Map();
	if (mode === "singleValue") {
		for (const ref of params.refs) {
			if (ref.id !== "value") {
				params.onRefError(refResolutionError({
					code: "SECRET_REF_INVALID",
					source: "file",
					provider: params.providerName,
					refId: ref.id,
					message: `singleValue file provider "${params.providerName}" expects ref id "${SINGLE_VALUE_FILE_REF_ID$1}".`
				}));
				continue;
			}
			resolved.set(ref.id, payload);
		}
		return resolved;
	}
	for (const ref of params.refs) try {
		resolved.set(ref.id, readJsonPointer(payload, ref.id, { onMissing: "throw" }));
	} catch (err) {
		params.onRefError(refResolutionError({
			code: "SECRET_REF_NOT_FOUND",
			source: "file",
			provider: params.providerName,
			refId: ref.id,
			message: formatErrorMessage(err),
			cause: err
		}));
	}
	return resolved;
}
function parseExecValues(params) {
	const trimmed = params.stdout.trim();
	if (!trimmed) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" returned empty stdout.`
	});
	let parsed;
	if (!params.jsonOnly && params.ids.length === 1) try {
		parsed = JSON.parse(trimmed);
	} catch {
		return { [expectDefined(params.ids[0], "ids entry at 0")]: trimmed };
	}
	else try {
		parsed = JSON.parse(trimmed);
	} catch {
		throw providerResolutionError({
			source: "exec",
			provider: params.providerName,
			message: `Exec provider "${params.providerName}" returned invalid JSON.`
		});
	}
	if (!isRecord(parsed)) {
		if (!params.jsonOnly && params.ids.length === 1 && typeof parsed === "string") return { [expectDefined(params.ids[0], "ids entry at 0")]: parsed };
		throw providerResolutionError({
			source: "exec",
			provider: params.providerName,
			message: `Exec provider "${params.providerName}" response must be an object.`
		});
	}
	if (parsed.protocolVersion !== 1) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" protocolVersion must be 1.`
	});
	const responseValues = parsed.values;
	if (!isRecord(responseValues)) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" response missing "values".`
	});
	const responseErrors = isRecord(parsed.errors) ? parsed.errors : null;
	const out = {};
	for (const id of params.ids) {
		if (responseErrors && Object.hasOwn(responseErrors, id)) {
			const entry = responseErrors[id];
			const code = isRecord(entry) && typeof entry.code === "string" ? entry.code : null;
			const safeCode = code && SAFE_EXEC_ERROR_CODES.has(code) ? code : null;
			params.onRefError(refResolutionError({
				code: safeCode === "NOT_FOUND" ? "SECRET_REF_NOT_FOUND" : "SECRET_REF_PROVIDER_ERROR",
				source: "exec",
				provider: params.providerName,
				refId: id,
				message: `Exec provider "${params.providerName}" failed for id "${id}"${safeCode ? ` (${safeCode})` : ""}.`
			}));
			continue;
		}
		if (!Object.hasOwn(responseValues, id)) {
			params.onRefError(refResolutionError({
				code: "SECRET_REF_NOT_FOUND",
				source: "exec",
				provider: params.providerName,
				refId: id,
				message: `Exec provider "${params.providerName}" response missing id "${id}".`
			}));
			continue;
		}
		out[id] = responseValues[id];
	}
	return out;
}
async function resolveExecRefs(params) {
	const ids = uniqueStrings(params.refs.map((ref) => ref.id));
	if (ids.length > params.limits.maxRefsPerProvider) throw providerResolutionError({
		code: "SECRET_PROVIDER_INVALID",
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" exceeded maxRefsPerProvider (${params.limits.maxRefsPerProvider}).`
	});
	let secureCommandPath;
	try {
		secureCommandPath = await assertSecureExecCommandPath({
			command: params.providerConfig.command,
			label: `secrets.providers.${params.providerName}.command`,
			trustedDirs: params.providerConfig.trustedDirs
		});
	} catch (err) {
		throwUnknownProviderResolutionError({
			source: "exec",
			provider: params.providerName,
			err
		});
	}
	const input = JSON.stringify({
		protocolVersion: 1,
		provider: params.providerName,
		ids
	});
	if (Buffer.byteLength(input, "utf8") > params.limits.maxBatchBytes) throw providerResolutionError({
		code: "SECRET_PROVIDER_INVALID",
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" request exceeded maxBatchBytes (${params.limits.maxBatchBytes}).`
	});
	const childEnv = {};
	for (const key of params.providerConfig.passEnv ?? []) {
		const value = params.env[key];
		if (value !== void 0) childEnv[key] = value;
	}
	for (const [key, value] of Object.entries(params.providerConfig.env ?? {})) childEnv[key] = value;
	const timeoutMs = normalizePositiveTimerMs(params.providerConfig.timeoutMs, DEFAULT_EXEC_TIMEOUT_MS);
	const noOutputTimeoutMs = normalizePositiveTimerMs(params.providerConfig.noOutputTimeoutMs, timeoutMs);
	const maxOutputBytes = normalizePositiveInt(params.providerConfig.maxOutputBytes, DEFAULT_EXEC_MAX_OUTPUT_BYTES);
	const jsonOnly = params.providerConfig.jsonOnly ?? true;
	let result;
	try {
		result = await runCommandWithTimeout([secureCommandPath, ...params.providerConfig.args ?? []], {
			baseEnv: {},
			cwd: path.dirname(secureCommandPath),
			env: childEnv,
			input,
			killProcessTree: true,
			maxCombinedOutputBytes: maxOutputBytes,
			maxOutputBytes,
			noOutputTimeoutMs,
			outputCapture: "head",
			terminateOnOutputLimit: true,
			timeoutMs
		});
	} catch (err) {
		throwUnknownProviderResolutionError({
			source: "exec",
			provider: params.providerName,
			err
		});
	}
	if (result.termination === "timeout") throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" timed out after ${timeoutMs}ms.`
	});
	if (result.termination === "no-output-timeout") throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" produced no output for ${noOutputTimeoutMs}ms.`
	});
	if (result.outputLimitExceeded) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider output exceeded maxOutputBytes (${maxOutputBytes}).`
	});
	if (result.code !== 0) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" exited with code ${String(result.code)}.`
	});
	let values;
	try {
		values = parseExecValues({
			providerName: params.providerName,
			ids,
			stdout: result.stdout,
			jsonOnly,
			onRefError: params.onRefError
		});
	} catch (err) {
		throwUnknownProviderResolutionError({
			source: "exec",
			provider: params.providerName,
			err
		});
	}
	return new Map(Object.entries(values));
}
async function resolveProviderRefs(params) {
	try {
		if (params.providerConfig.source === "env") return await resolveEnvRefs({
			refs: params.refs,
			providerName: params.providerName,
			onRefError: params.onRefError,
			providerConfig: params.providerConfig,
			env: params.options.env ?? process.env
		});
		if (params.providerConfig.source === "file") return await resolveFileRefs({
			refs: params.refs,
			providerName: params.providerName,
			onRefError: params.onRefError,
			providerConfig: params.providerConfig,
			cache: params.options.cache
		});
		if (params.providerConfig.source === "store") return resolveStoreRefs({
			refs: params.refs,
			providerName: params.providerName,
			onRefError: params.onRefError,
			database: { env: params.options.env ?? process.env }
		});
		if (params.providerConfig.source === "exec") {
			if (isPluginIntegrationSecretProviderConfig(params.providerConfig)) throw providerResolutionError({
				source: params.source,
				provider: params.providerName,
				message: `Secret provider "${params.providerName}" plugin integration was not materialized before exec resolution.`
			});
			return await resolveExecRefs({
				refs: params.refs,
				providerName: params.providerName,
				onRefError: params.onRefError,
				providerConfig: params.providerConfig,
				env: params.options.env ?? process.env,
				limits: params.limits
			});
		}
		throw providerResolutionError({
			source: params.source,
			provider: params.providerName,
			message: `Unsupported secret provider source "${String(params.providerConfig.source)}".`
		});
	} catch (err) {
		return throwUnknownProviderResolutionError({
			source: params.source,
			provider: params.providerName,
			err
		});
	}
}
function createProviderResolutionTasks(params) {
	return params.groups.map((group) => async () => {
		const refFailures = /* @__PURE__ */ new Map();
		const onRefError = (error) => {
			if (params.errorMode === "stop") throw error;
			refFailures.set(error.refId, error);
		};
		if (group.refs.length > params.limits.maxRefsPerProvider) throw providerResolutionError({
			code: "SECRET_PROVIDER_INVALID",
			source: group.source,
			provider: group.providerName,
			message: `Secret provider "${group.providerName}" exceeded maxRefsPerProvider (${params.limits.maxRefsPerProvider}).`
		});
		const providerConfig = resolveConfiguredProvider({
			ref: expectDefined(group.refs[0], "refs entry at 0"),
			config: params.options.config,
			env: params.options.env ?? process.env,
			manifestRegistry: params.options.manifestRegistry
		});
		const values = await resolveProviderRefs({
			refs: group.refs,
			source: group.source,
			providerName: group.providerName,
			providerConfig,
			options: params.options,
			limits: params.limits,
			onRefError
		});
		for (const ref of group.refs) {
			if (refFailures.has(ref.id)) continue;
			if (!values.has(ref.id)) {
				onRefError(refResolutionError({
					code: "SECRET_REF_PROVIDER_CONTRACT",
					source: group.source,
					provider: group.providerName,
					refId: ref.id,
					message: `Secret provider "${group.providerName}" did not return id "${ref.id}".`
				}));
				continue;
			}
			if (isRedactedSecretValue(values.get(ref.id))) onRefError(refResolutionError({
				code: "SECRET_REF_REDACTED_VALUE",
				source: group.source,
				provider: group.providerName,
				refId: ref.id,
				message: `Secret reference "${group.source}:${group.providerName}:${ref.id}" resolves to a redaction placeholder. Run openclaw doctor --fix to repair a store-backed Gateway token; supply a real credential for other secrets.`
			}));
		}
		return {
			group,
			values,
			refFailures
		};
	});
}
async function resolveSecretRefProviderGroups(params) {
	const groups = normalizeAndGroupSecretRefs(params.refs);
	const limits = resolveResolutionLimits();
	const errorsByIndex = /* @__PURE__ */ new Map();
	const taskResults = await runTasksWithConcurrency({
		tasks: createProviderResolutionTasks({
			groups,
			options: params.options,
			limits,
			errorMode: params.errorMode
		}),
		limit: limits.maxProviderConcurrency,
		errorMode: params.errorMode,
		onTaskError: (error, index) => {
			errorsByIndex.set(index, error);
		}
	});
	const resolved = /* @__PURE__ */ new Map();
	const failures = [];
	for (const result of taskResults.results) {
		if (!result) continue;
		for (const ref of result.group.refs) {
			const error = result.refFailures.get(ref.id);
			if (error) failures.push({
				group: result.group,
				error
			});
			else resolved.set(secretRefKey(ref), result.values.get(ref.id));
		}
	}
	for (const [index, group] of groups.entries()) if (errorsByIndex.has(index)) failures.push({
		group,
		error: errorsByIndex.get(index)
	});
	return {
		resolved,
		failures,
		hasError: taskResults.hasError,
		firstError: taskResults.firstError
	};
}
/** Resolves a batch of SecretRefs, grouped by provider for bounded provider concurrency. */
async function resolveSecretRefValues(refs, options) {
	const result = await resolveSecretRefProviderGroups({
		refs,
		options,
		errorMode: "stop"
	});
	if (result.hasError) throw result.firstError;
	return result.resolved;
}
/** Resolves one SecretRef, using the optional shared runtime cache. */
/** Resolves one SecretRef to an unknown value using configured provider state. */
async function resolveSecretRefValue(ref, options) {
	const cache = options.cache;
	const key = secretRefKey(ref);
	const resolve = async () => {
		const resolved = await resolveSecretRefValues([ref], options);
		if (!resolved.has(key)) throw refResolutionError({
			code: "SECRET_REF_PROVIDER_CONTRACT",
			source: ref.source,
			provider: ref.provider,
			refId: ref.id,
			message: `Secret reference "${key}" resolved to no value.`
		});
		return resolved.get(key);
	};
	if (!cache) return await resolve();
	cache.resolvedByRefKey ??= /* @__PURE__ */ new Map();
	return await getOrCreatePromise(cache.resolvedByRefKey, key, resolve);
}
/** Resolves one SecretRef and requires a non-empty string result. */
async function resolveSecretRefString(ref, options) {
	const resolved = await resolveSecretRefValue(ref, options);
	if (!isNonEmptyString(resolved)) throw new Error(`Secret reference "${ref.source}:${ref.provider}:${ref.id}" resolved to a non-string or empty value.`);
	return resolved;
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
		if (typeof resolvedValue !== "string") return {
			refConfigured: true,
			unresolvedRefReason: buildUnresolvedReason({
				path: params.path,
				style,
				kind: "non-string",
				refLabel
			})
		};
		const trimmed = normalizeOptionalString(resolvedValue);
		if (!trimmed) return {
			refConfigured: true,
			unresolvedRefReason: buildUnresolvedReason({
				path: params.path,
				style,
				kind: "empty",
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
async function resolveConfiguredSecretInputWithFallback(params) {
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
//#region src/gateway/auth-surface-resolution.ts
async function resolveGatewayCredential(params) {
	const resolved = await resolveConfiguredSecretInputWithFallback({
		config: params.config,
		env: params.env,
		value: params.value,
		path: params.path,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.unresolvedRefReason) params.diagnostics.push({
		message: resolved.unresolvedRefReason,
		code: resolved.unresolvedRefCode
	});
	return resolved;
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
	const authMode = params.config.gateway?.auth?.mode;
	if (params.surface === "remote") {
		const remoteToken = await resolveGatewayCredential({
			config: params.config,
			env,
			diagnostics,
			path: "gateway.remote.token",
			value: params.config.gateway?.remote?.token
		});
		const remotePassword = remoteToken.value ? {
			value: void 0,
			secretRefConfigured: false
		} : await resolveGatewayCredential({
			config: params.config,
			env,
			diagnostics,
			path: "gateway.remote.password",
			value: params.config.gateway?.remote?.password
		});
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
		const credential = await resolveGatewayCredential({
			config: params.config,
			env,
			diagnostics,
			path: `gateway.auth.${authMode}`,
			value: params.config.gateway?.auth?.[authMode]
		});
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
	const token = await resolveGatewayCredential({
		config: params.config,
		env,
		diagnostics,
		path: "gateway.auth.token",
		value: params.config.gateway?.auth?.token
	});
	if (token.value) return withDiagnostics(diagnostics, {
		token: token.value,
		source: "config"
	});
	if (token.secretRefConfigured) return withDiagnostics(diagnostics, {});
	const password = await resolveGatewayCredential({
		config: params.config,
		env,
		diagnostics,
		path: "gateway.auth.password",
		value: params.config.gateway?.auth?.password
	});
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
	const diagnostics = [];
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
		} : await resolveGatewayCredential({
			config: params.config,
			env,
			diagnostics,
			path: "gateway.remote.token",
			value: params.config.gateway?.remote?.token
		});
		if (remoteToken.value && (remoteToken.secretRefConfigured || credentialPlan.remotePassword.hasSecretRef)) return {
			token: remoteToken.value,
			password: void 0
		};
		const remotePassword = explicitPassword ? {
			value: explicitPassword,
			secretRefConfigured: false
		} : await resolveGatewayCredential({
			config: params.config,
			env,
			diagnostics,
			path: "gateway.remote.password",
			value: params.config.gateway?.remote?.password
		});
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
	} : await resolveGatewayCredential({
		config: params.config,
		env,
		diagnostics,
		path: `gateway.auth.${credentialKind}`,
		value: params.config.gateway?.auth?.[credentialKind]
	});
	const value = credential.value ?? (credential.secretRefConfigured ? void 0 : envCredential);
	return {
		token: shouldUsePassword ? credential.secretRefConfigured ? void 0 : explicitToken ?? envToken : value,
		password: shouldUsePassword ? value : credential.secretRefConfigured ? void 0 : explicitPassword ?? envPassword,
		failureReason: value ? void 0 : credential.unresolvedRefReason ?? `Missing gateway auth ${credentialKind}.`
	};
}
//#endregion
//#region src/gateway/connection-details.ts
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
* Plugin and gateway callers can override normalization and convert SecretRef resolution errors
* into surface-specific failures without duplicating provider lookup behavior.
*/
async function materializeSecretInput(params) {
	const normalize = params.normalize ?? normalizeSecretInputString;
	const { ref } = resolveSecretInputRef({
		value: params.value,
		defaults: params.defaults ?? params.config.secrets?.defaults
	});
	if (!ref) return normalize(params.value);
	let resolved;
	try {
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
	let assigned = false;
	if (path === "gateway.auth.token") {
		if (config.gateway?.auth) {
			config.gateway.auth.token = value;
			assigned = true;
		}
	} else if (path === "gateway.auth.password") {
		if (config.gateway?.auth) {
			config.gateway.auth.password = value;
			assigned = true;
		}
	} else if (path === "gateway.remote.token") {
		if (config.gateway?.remote) {
			config.gateway.remote.token = value;
			assigned = true;
		}
	} else if (config.gateway?.remote) {
		config.gateway.remote.password = value;
		assigned = true;
	}
	if (assigned) copyConfigResolutionFactsExcept(config, config, [path]);
}
/** Distinguish token paths from password paths for auth-mode precedence checks. */
function isTokenGatewaySecretInputPath(path) {
	return path === "gateway.auth.token" || path === "gateway.remote.token";
}
//#endregion
//#region src/gateway/credentials-secret-inputs.ts
async function resolveGatewaySecretInputString(params) {
	const ref = resolveConfigSecretRef({
		config: params.config,
		path: params.path,
		value: params.value,
		defaults: params.config.secrets?.defaults
	});
	const value = await materializeSecretInput({
		config: params.config,
		value: ref ?? params.value,
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
function resolveGatewayCredentialsFromConfigOptions(params) {
	const { cfg, env, options } = params;
	return {
		cfg,
		env,
		explicitAuth: options.explicitAuth,
		urlOverride: options.urlOverride,
		urlOverrideSource: options.urlOverrideSource,
		modeOverride: options.modeOverride,
		localPrecedence: options.localPrecedence,
		remoteTokenPrecedence: options.remoteTokenPrecedence,
		remotePasswordPrecedence: options.remotePasswordPrecedence ?? "env-first",
		remoteTokenFallback: options.remoteTokenFallback,
		remotePasswordFallback: options.remotePasswordFallback
	};
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
		const resolved = resolveGatewayCredentialsFromConfig(resolveGatewayCredentialsFromConfigOptions({
			cfg: probeConfig,
			env: params.env,
			options: params.options
		}));
		const authMode = params.config.gateway?.auth?.mode;
		const tokenCanWin = resolved.token === sentinel && (mode === "local" && authMode === "token" || !resolved.password);
		const passwordCanWin = resolved.password === sentinel && (mode === "local" && (authMode === "password" || authMode === "trusted-proxy") || !resolved.token);
		return tokenCanWin || passwordCanWin;
	} catch {
		return false;
	}
}
async function resolveConfiguredGatewaySecretInput(params) {
	return resolveGatewaySecretInputString({
		config: params.config,
		value: readGatewaySecretInputValue(params.config, params.path),
		path: params.path,
		env: params.env
	});
}
async function resolvePreferredGatewaySecretInputs(params) {
	let nextConfig = params.config;
	for (const path of ALL_GATEWAY_SECRET_INPUT_PATHS) {
		if (!canGatewaySecretInputPathWin({
			options: params.options,
			env: params.env,
			config: nextConfig,
			path
		})) continue;
		if (nextConfig === params.config) nextConfig = cloneConfigWithResolutionFacts(params.config);
		try {
			const resolvedValue = await resolveConfiguredGatewaySecretInput({
				config: nextConfig,
				path,
				env: params.env
			});
			assignResolvedGatewaySecretInput({
				config: nextConfig,
				path,
				value: resolvedValue
			});
		} catch (error) {
			if (isSecretResolutionError(error) && error.code === "SECRET_REF_REDACTED_VALUE") throw error;
			continue;
		}
	}
	return nextConfig;
}
/** Resolve only secret refs that can win, then select Gateway credentials. */
async function resolveGatewayCredentialsFromConfigWithSecretInputs(params) {
	let resolvedConfig = await resolvePreferredGatewaySecretInputs({
		options: params.options,
		env: params.env,
		config: params.options.config
	});
	const resolvedPaths = /* @__PURE__ */ new Set();
	for (;;) try {
		return resolveGatewayCredentialsFromConfig(resolveGatewayCredentialsFromConfigOptions({
			cfg: resolvedConfig,
			env: params.env,
			options: params.options
		}));
	} catch (error) {
		if (!(error instanceof GatewaySecretRefUnavailableError)) throw error;
		const path = error.path;
		if (!isSupportedGatewaySecretInputPath(path) || resolvedPaths.has(path)) throw error;
		if (resolvedConfig === params.options.config) resolvedConfig = cloneConfigWithResolutionFacts(params.options.config);
		const resolvedValue = await resolveConfiguredGatewaySecretInput({
			config: resolvedConfig,
			path,
			env: params.env
		});
		assignResolvedGatewaySecretInput({
			config: resolvedConfig,
			path,
			value: resolvedValue
		});
		resolvedPaths.add(path);
	}
}
/** Resolve Gateway credentials after materializing winning configured secret refs. */
async function resolveGatewayCredentialsWithSecretInputs(params) {
	const options = {
		...params,
		explicitAuth: resolveExplicitGatewayAuth(params.explicitAuth)
	};
	if (options.explicitAuth.token || options.explicitAuth.password) return {
		token: options.explicitAuth.token,
		password: options.explicitAuth.password
	};
	return await resolveGatewayCredentialsFromConfigWithSecretInputs({
		options,
		env: params.env ?? process.env
	});
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
//#region packages/gateway-client/src/client-address-utils.ts
function normalizeGatewayErrorText(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function isSensitiveUrlQueryParamName(key) {
	return /(?:token|password|secret|key|auth|credential)/iu.test(key);
}
function isGatewayClientStoppedError(err) {
	const message = err instanceof Error ? err.message : String(err);
	return message === "gateway client stopped" || message === "Error: gateway client stopped";
}
function formatGatewayClientErrorForLog(err) {
	return String(err).replace(/\/\/([^@/?#\s]+)@/g, "//***:***@").replace(/(Authorization:\s*Bearer\s+)[^\s]+/giu, "$1***").replace(/([?&])([^=&\s]+)=([^&#\s"'<>)]*)/g, (match, prefix, key) => isSensitiveUrlQueryParamName(key) ? `${prefix}${key}=***` : match);
}
const SHA256_HEX_FINGERPRINT = /^[a-fA-F0-9]{64}$/u;
const SHA256_COLON_FINGERPRINT = /^(?:[a-fA-F0-9]{2}:){31}[a-fA-F0-9]{2}$/u;
function normalizeTlsFingerprint(fingerprint) {
	const value = (fingerprint ?? "").trim().replace(/^sha256:/iu, "");
	if (SHA256_HEX_FINGERPRINT.test(value)) return value.toLowerCase();
	return SHA256_COLON_FINGERPRINT.test(value) ? value.replaceAll(":", "").toLowerCase() : "";
}
function requireTlsFingerprint(fingerprint) {
	const normalized = normalizeTlsFingerprint(fingerprint);
	if (!normalized) throw new Error("Invalid TLS fingerprint; expected a SHA-256 certificate fingerprint.");
	return normalized;
}
function parseHostForAddressChecks(host) {
	if (!host) return null;
	const normalizedHost = host.toLowerCase().trim();
	const canonicalHost = normalizedHost.replace(/\.+$/, "");
	if (canonicalHost === "localhost") return {
		isLocalhost: true,
		unbracketedHost: canonicalHost
	};
	return {
		isLocalhost: false,
		unbracketedHost: normalizedHost.startsWith("[") && normalizedHost.endsWith("]") ? normalizedHost.slice(1, -1) : normalizedHost
	};
}
function parseGatewayIpAddress(host) {
	const normalized = normalizeIpAddress(host);
	return normalized ? parseCanonicalIpAddress(normalized) : void 0;
}
//#endregion
//#region src/infra/tls/gateway.ts
const MAX_TLS_LEAF_FILE_BYTES = 65536;
async function readTlsLeafFile(filePath) {
	const file = await fs.open(filePath, "r");
	try {
		return (await readFileDescriptorBounded$1(file.fd, MAX_TLS_LEAF_FILE_BYTES)).toString("utf8");
	} finally {
		await file.close();
	}
}
function resolveGatewayTlsCertPath(certPath) {
	return resolveUserPath(typeof certPath === "string" && certPath.trim() ? certPath : path.join(CONFIG_DIR, "gateway", "tls", "gateway-cert.pem"));
}
/** Read only public certificate bytes. Inspection never provisions or requires server secrets. */
async function inspectGatewayTlsCertificate(cfg) {
	if (cfg?.enabled !== true) return err("gateway tls is disabled");
	try {
		const cert = await readTlsLeafFile(resolveGatewayTlsCertPath(cfg.certPath));
		const fingerprintSha256 = normalizeTlsFingerprint(new X509Certificate(cert).fingerprint256);
		return fingerprintSha256 ? ok({
			cert,
			fingerprintSha256
		}) : err("gateway tls: unable to compute certificate fingerprint");
	} catch (error) {
		return err(`gateway tls: failed to load cert (${String(error)})`);
	}
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
function appendControlUiBasePath(url, basePath) {
	return `${url}${normalizeControlUiBasePath(basePath)}`;
}
function resolveExactConfiguredGatewayTarget(params) {
	const candidates = [];
	if (params.config.gateway?.mode === "remote") {
		const remoteUrl = trimToUndefined(params.config.gateway.remote?.url);
		if (remoteUrl) candidates.push({
			target: remoteUrl,
			identity: {
				authSurface: "remote",
				tlsSource: "config gateway.remote.url"
			}
		});
	} else {
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
		const basePath = params.config.gateway?.controlUi?.basePath ?? "";
		candidates.push({
			target: appendControlUiBasePath(localUrl, basePath),
			identity: {
				authSurface: "local",
				tlsSource: "local loopback"
			}
		});
		const publicOrigin = resolveGatewayPublicOrigin(params.config);
		if (publicOrigin) candidates.push({
			target: appendControlUiBasePath(publicOrigin.replace(/^https:/u, "wss:").replace(/^http:/u, "ws:"), basePath),
			identity: { authSurface: "local" }
		});
	}
	return candidates.find(({ target }) => target === params.explicitUrl)?.identity;
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
	const deviceAuthScope = urlOverrideSource || params.config.gateway?.mode === "remote" ? gatewayOriginScope(connection.url) : void 0;
	if (params.overrideAuthErrorHint && !configuredTarget) await ensureExplicitGatewayAuth({
		urlOverride: urlOverrideSource ? connection.url : void 0,
		urlOverrideSource,
		explicitAuth,
		resolvedAuth: auth,
		deviceAuthScope,
		allowStoredOriginAuth: params.allowStoredOriginAuth,
		errorHint: params.overrideAuthErrorHint ?? "Fix: pass --token or --password with --url.",
		configPath: params.configPath
	});
	return {
		url: connection.url,
		urlSource: connection.urlSource,
		connectionDetails: connection,
		...urlOverrideSource ? { urlOverrideSource } : {},
		...deviceAuthScope ? { deviceAuthScope } : {},
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
function normalized(value) {
	return typeof value === "string" ? value.trim() || void 0 : void 0;
}
function selectGatewayConnectAuth(params) {
	const authToken = normalized(params.token);
	const bootstrapToken = normalized(params.bootstrapToken);
	const explicitDeviceToken = normalized(params.deviceToken);
	const authPassword = normalized(params.password);
	const storedToken = normalized(params.storedToken);
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
		authApprovalRuntimeToken: normalized(params.approvalRuntimeToken),
		authAgentRuntimeIdentityToken: normalized(params.agentRuntimeIdentityToken),
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
	const trimmed = value.trim();
	if (!trimmed) return "";
	return trimmed.replace(/[A-Z]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 32));
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
				sender.send(JSON.stringify({
					type: "req",
					id,
					method,
					params
				}));
				if (this.pending.get(id) !== pending) return;
				requestSent = true;
				this.invoke("sent", () => options?.onSent?.(id));
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
		try {
			this.opts.onTiming?.({
				id,
				method: pending.method,
				ok,
				durationMs: Math.max(0, endedAtMs - pending.startedAtMs),
				startedAtMs: pending.startedAtMs,
				endedAtMs,
				errorCode
			});
		} catch (error) {
			this.opts.onCallbackError?.("request timing", error);
		}
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
		if (!this.isActive(socket, generation)) return;
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
					this.invoke("gap", () => this.opts.onGap?.({
						expected,
						received: seq
					}));
					if (!this.isActive(socket, generation)) return;
				}
				this.lastSeq = seq;
			}
			const listeners = this.listeners.snapshot();
			this.invoke("event", () => this.opts.onEvent?.(parsed));
			for (const [listener, subscription] of listeners) {
				if (!this.isActive(socket, generation)) return;
				if (this.listeners.isCurrent(listener, subscription)) this.invoke("event listener", () => listener(parsed));
			}
			return;
		}
		if (!isGatewayResponseFrame(parsed)) return;
		this.opts.onActivity?.();
		this.requests.handleResponse(parsed);
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
		const delayMs = overrideMs ?? Math.max(retry.delayMs, minimumMs);
		sleepWithAbort(delayMs, retry.signal).then(() => {
			if (this.reconnectSignal !== retry.signal) return;
			this.reconnectSignal = null;
			this.invoke("reconnect", () => this.connect());
		}, () => {
			if (this.reconnectSignal === retry.signal) this.reconnectSignal = null;
		});
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
		if (isGatewayLoopbackHost(url.hostname) || isTrustedPlaintextWebSocketHost(url.hostname)) return true;
		if (options?.allowPrivateWs === true) {
			const hostForIpCheck = url.hostname.startsWith("[") && url.hostname.endsWith("]") ? url.hostname.slice(1, -1) : url.hostname;
			return isPrivateOrLoopbackHost(url.hostname) || parseGatewayIpAddress(hostForIpCheck) === void 0;
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
		let timeout = null;
		try {
			await Promise.race([stopPromise, new Promise((_, reject) => {
				timeout = setTimeout(() => {
					reject(/* @__PURE__ */ new Error(`gateway client stop timed out after ${timeoutMs}ms`));
				}, timeoutMs);
				timeout.unref?.();
			})]);
		} finally {
			if (timeout) clearTimeout(timeout);
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
		if (this.pendingStop?.ws === ws) return this.pendingStop;
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
	shouldRetryWithLegacyNodeProtocol(error) {
		if (this.useLegacyNodeProtocolEnvelope || !this.shouldNegotiateLegacyNodeProtocol() || !(error instanceof GatewayClientRequestError)) return false;
		const detailCode = readConnectErrorDetailCode(error.details);
		return error.details?.expectedProtocol === 3 && (detailCode === ConnectErrorDetailCodes.PROTOCOL_MISMATCH || normalizeGatewayErrorText(error.message).includes("protocol mismatch"));
	}
	shouldRetryWithCurrentNodeProtocol(error) {
		if (!this.useLegacyNodeProtocolEnvelope || !this.shouldNegotiateLegacyNodeProtocol() || !(error instanceof GatewayClientRequestError)) return false;
		const detailCode = readConnectErrorDetailCode(error.details);
		return error.details?.expectedProtocol === 4 && (detailCode === ConnectErrorDetailCodes.PROTOCOL_MISMATCH || normalizeGatewayErrorText(error.message).includes("protocol mismatch"));
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
		if (this.shouldRetryWithCurrentNodeProtocol(error)) {
			const resetBackoff = !this.nodeProtocolTransitionPending;
			this.useLegacyNodeProtocolEnvelope = false;
			this.nodeProtocolTransitionPending = true;
			if (resetBackoff) this.protocol.resetReconnectBackoff(250);
			this.logDebug("gateway rejected protocol v3; retrying node host with protocol v4");
			return {
				closeCode: 1008,
				closeReason: "connect retry"
			};
		}
		if (this.shouldRetryWithLegacyNodeProtocol(error)) {
			const resetBackoff = !this.nodeProtocolTransitionPending;
			this.useLegacyNodeProtocolEnvelope = true;
			this.nodeProtocolTransitionPending = true;
			if (resetBackoff) this.protocol.resetReconnectBackoff(250);
			this.logDebug("gateway rejected protocol v4; retrying node host with protocol v3");
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
		if (this.shouldFailClosedForUnsupportedAgentRuntimeIdentity({
			error,
			authAgentRuntimeIdentityToken: assembled.authAgentRuntimeIdentityToken
		})) {
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
		if (this.shouldRetryWithoutApprovalRuntimeToken({
			error,
			authApprovalRuntimeToken: assembled.authApprovalRuntimeToken
		})) {
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
	shouldRetryWithoutApprovalRuntimeToken(params) {
		if (this.approvalRuntimeTokenRetryBudgetUsed) return false;
		if (!params.authApprovalRuntimeToken) return false;
		if (!(params.error instanceof GatewayClientRequestError)) return false;
		if (params.error.gatewayCode !== "INVALID_REQUEST") return false;
		const message = normalizeGatewayErrorText(params.error.message);
		return message.includes("invalid connect params") && message.includes("approvalruntimetoken");
	}
	shouldFailClosedForUnsupportedAgentRuntimeIdentity(params) {
		if (!params.authAgentRuntimeIdentityToken) return false;
		if (!(params.error instanceof GatewayClientRequestError)) return false;
		if (params.error.gatewayCode !== "INVALID_REQUEST") return false;
		const message = normalizeGatewayErrorText(params.error.message);
		return message.includes("invalid connect params") && message.includes("agentruntimeidentitytoken");
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
	installGlobalProxy({
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
		signDevicePayload,
		publicKeyRawBase64UrlFromPem,
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
	constructor(opts) {
		const { deviceAuthScope, preparedDeviceAuth, sharedStateMode, ...baseOptions } = opts;
		const runtimeIdentity = resolveGatewayClientPlatformIdentity(process.platform);
		const suppressStoredAuth = shouldSuppressStoredDeviceAuth(opts);
		for (const value of Object.values(baseOptions.edgeAuthHeaders ?? {})) registerSecretValueForRedaction(value);
		this.#client = new GatewayClient$1({
			...baseOptions,
			clientVersion: baseOptions.clientVersion ?? VERSION,
			platform: baseOptions.platform ?? runtimeIdentity.platform,
			deviceFamily: baseOptions.deviceFamily ?? (baseOptions.platform === void 0 ? runtimeIdentity.deviceFamily : void 0),
			hostDeps: createOpenClawGatewayClientHostDeps(baseOptions.hostDeps, deviceAuthScope, suppressStoredAuth, sharedStateMode, preparedDeviceAuth)
		});
	}
	start() {
		this.#client.start();
	}
	stop() {
		this.#client.stop();
	}
	stopAndWait(opts) {
		return this.#client.stopAndWait(opts);
	}
	request(method, params, opts) {
		return this.#client.request(method, params, opts);
	}
	/** Current transport state, including CLOSING before the close callback fires.
	* This is not authentication or readiness evidence on its own. */
	get connected() {
		return this.#client.connected;
	}
	getConnectionMetadata() {
		return this.#client.getConnectionMetadata();
	}
	updateNodeManifest(manifest) {
		this.#client.updateNodeManifest(manifest);
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
	const ref = coerceSecretRef(value);
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
	constructor(scopes, gatewayScope, generationRegistry) {
		super(scopes);
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
function getPluginGatewayScope() {
	return getPluginRuntimeExecutionFrame()?.gatewayScope;
}
/**
* Returns the current plugin gateway request scope when called from a plugin request handler.
*/
function getPluginRuntimeGatewayRequestScope() {
	return getPluginGatewayScope();
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
				return typeof property === "string" && child.schemaPath === `${error.schemaPath}/additionalProperties` && child.instancePath === `${error.instancePath}/${property}`;
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
	const getCompiled = () => {
		compiled ??= Compile(schema);
		return compiled;
	};
	const validate = ((data) => {
		const precheckError = precheck?.(data);
		if (precheckError) {
			errors = [precheckError];
			return false;
		}
		const current = getCompiled();
		const valid = current.Check(data);
		errors = valid ? null : normalizeTypeBoxValidationErrors([...current.Errors(data)]);
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
const WorkerErrorCodeSchema = Type.Union([Type.Literal("INVALID_REQUEST"), Type.Literal("UNAVAILABLE")]);
const WorkerErrorDetailsSchema = closedObject({ reason: WorkerProtocolCloseReasonSchema });
const WorkerErrorShapeSchema = closedObject({
	code: WorkerErrorCodeSchema,
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: WorkerErrorDetailsSchema,
	retryable: Type.Optional(Type.Boolean()),
	retryAfterMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(false),
	error: WorkerErrorShapeSchema
});
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
	environmentId: Type.Optional(NonEmptyString)
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
	runner: Type.Optional(SessionPlacementRunnerSchema)
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
	recoveryAction: Type.Optional(Type.Enum(["restart", "stop-first"], { type: "string" }))
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
Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	recoverToGateway: Type.Optional(closedObject({ expectedGeneration: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}) }))
}, { additionalProperties: false });
/** Terminal placement returned after a worker reclaim operation. */
const SessionsReclaimResultPlacementSchema = Type.Union([LocalSessionPlacementSchema, ReclaimedSessionPlacementSchema]);
Type.Object({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	placement: SessionsReclaimResultPlacementSchema
}, { additionalProperties: false });
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
		"<=2026.7"
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
		"2026.7"
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
		"<=2026.7"
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
		"system-agent",
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
		"tasks.list",
		"tasks",
		"operator.read",
		"<=2026.7"
	],
	[
		"tasks.get",
		"tasks",
		"operator.read",
		"<=2026.7"
	],
	[
		"tasks.cancel",
		"tasks",
		"operator.write",
		"<=2026.7"
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
		"<=2026.7"
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
		{ startup: true }
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
		{ advertise: false }
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
		{
			startup: true,
			controlPlaneWrite: true
		}
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
		{
			startup: true,
			controlPlaneWrite: true
		}
	],
	[
		"environments.destroy",
		"environments",
		"operator.admin",
		"2026.7",
		{
			startup: true,
			controlPlaneWrite: true
		}
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
		{
			startup: true,
			controlPlaneWrite: true
		}
	],
	[
		"sessions.reclaim",
		"sessions-dispatch",
		"operator.write",
		"2026.7",
		{
			startup: true,
			controlPlaneWrite: true
		}
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
		"tasks.retry",
		"tasks",
		"operator.write",
		"2026.7"
	],
	[
		"tasks.dismiss",
		"tasks",
		"operator.write",
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
		"2026.8"
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
		{
			startup: true,
			controlPlaneWrite: true
		}
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
		{
			startup: true,
			controlPlaneWrite: true
		}
	],
	[
		"users.github.authorize.poll",
		"users",
		"operator.read",
		"2026.8",
		{
			startup: true,
			controlPlaneWrite: true
		}
	],
	[
		"users.github.authorize.cancel",
		"users",
		"operator.read",
		"2026.8",
		{
			startup: true,
			controlPlaneWrite: true
		}
	],
	[
		"users.github.disconnect",
		"users",
		"operator.read",
		"2026.8",
		{
			startup: true,
			controlPlaneWrite: true
		}
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
		{
			startup: true,
			controlPlaneWrite: true
		}
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
		{ controlPlaneWrite: true }
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
		"tasks.history",
		"tasks",
		"operator.read",
		"2026.9"
	],
	[
		"environments.prepare",
		"environments",
		"operator.admin",
		"2026.9",
		{
			startup: true,
			controlPlaneWrite: true
		}
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
		{ controlPlaneWrite: true }
	],
	[
		"environments.session.destroy",
		"environments",
		"operator.admin",
		"2026.9",
		{ controlPlaneWrite: true }
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
	]
];
new Map([
	["skills.library.activate", ["sessionKey"]],
	["agent", ["sessionKey"]],
	["board.event", ["sessionKey"]],
	["board.update", ["sessionKey"]],
	["board.widget.grant", ["sessionKey"]],
	["board.widget.put", ["sessionKey"]],
	["chat.abort", ["sessionKey"]],
	["chat.inject", ["sessionKey"]],
	["chat.send", ["sessionKey"]],
	["mcp.app.callTool", ["sessionKey"]],
	["mcp.app.updateModelContext", ["sessionKey"]],
	["message.action", ["sessionKey"]],
	["plugins.sessionAction", ["sessionKey"]],
	["progressCard.get", ["sessionKey"]],
	["progressCard.put", ["sessionKey"]],
	["progressCard.refresh", ["sessionKey"]],
	["send", ["sessionKey"]],
	["session.discussion.open", ["sessionKey"]],
	["sessions.abort", ["key"]],
	["sessions.assignOwner", ["key"]],
	["sessions.setInvolvement", ["key"]],
	["sessions.companion.ask", ["sessionKey"]],
	["sessions.companion.reset", ["sessionKey"]],
	["sessions.companion.state", ["sessionKey"]],
	["sessions.compact", ["key"]],
	["sessions.create", ["key", "parentSessionKey"]],
	["sessions.delete", ["key"]],
	["sessions.dispatch", ["key"]],
	["sessions.files.set", ["sessionKey"]],
	["sessions.github.publish", ["sessionKey"]],
	["sessions.github.confirm", ["sessionKey"]],
	["sessions.fork", ["sessionKey"]],
	["sessions.patch", ["key"]],
	["sessions.goal.update", ["sessionKey"]],
	["sessions.goal.clear", ["sessionKey"]],
	["sessions.providerReview.continue", ["sessionKey"]],
	["sessions.pluginPatch", ["key"]],
	...["sessions.move", "sessions.reclaim"].map((method) => [method, ["key"]]),
	["sessions.recover", ["key"]],
	["sessions.reset", ["key"]],
	["sessions.rewind", ["sessionKey"]],
	["sessions.send", ["key"]],
	["sessions.steer", ["key"]],
	["sessions.branches.switch", ["sessionKey"]],
	["talk.voice.set", ["sessionKey"]],
	...[
		"taskSuggestions.create",
		"talk.client.close",
		"talk.client.create",
		"talk.client.steer",
		"talk.client.toolCall",
		"talk.client.transcript",
		"talk.session.create",
		"talk.session.steer",
		"wake"
	].map((method) => [method, ["sessionKey"]]),
	["tools.invoke", ["sessionKey"]]
]);
//#endregion
//#region src/gateway/methods/descriptor.ts
/** Scope marker for methods that only authenticated node clients may call. */
const NODE_GATEWAY_METHOD_SCOPE = "node";
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
/** Returns true for core methods reserved for authenticated node clients. */
function isCoreNodeGatewayMethod(method) {
	return CORE_GATEWAY_METHOD_SPEC_BY_NAME.get(method)?.scope === NODE_GATEWAY_METHOD_SCOPE;
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
function normalizeBrowserProxyPath(value) {
	const trimmed = value.trim();
	if (!trimmed) return trimmed;
	const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	if (withLeadingSlash.length <= 1) return withLeadingSlash;
	return withLeadingSlash.replace(/\/+$/, "");
}
function isPersistentBrowserProxyMutation(method, path) {
	const normalizedPath = normalizeBrowserProxyPath(path);
	if (method === "POST" && (normalizedPath === "/profiles/create" || normalizedPath === "/reset-profile")) return true;
	return method === "DELETE" && /^\/profiles\/[^/]+$/.test(normalizedPath);
}
function isForbiddenBrowserProxyMutation(params) {
	if (!params || typeof params !== "object") return false;
	const candidate = params;
	const method = (normalizeOptionalString(candidate.method) ?? "").toUpperCase();
	const path = normalizeOptionalString(candidate.path) ?? "";
	return Boolean(method && path && isPersistentBrowserProxyMutation(method, path));
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
/** Returns true when a method is reserved for node-role clients instead of operators. */
function isNodeRoleMethod(method) {
	return isCoreNodeGatewayMethod(method);
}
function resolveSessionActionRegisteredScopes(params) {
	if (!params || typeof params !== "object" || Array.isArray(params)) return;
	const pluginId = normalizeOptionalString(params.pluginId);
	const actionId = normalizeOptionalString(params.actionId);
	if (!pluginId || !actionId) return;
	const registration = getPluginRegistryForContext()?.sessionActions?.find((entry) => entry.pluginId === pluginId && entry.action.id === actionId);
	if (!registration) return;
	const requiredScopes = registration.action.requiredScopes;
	return requiredScopes && requiredScopes.length > 0 ? [...requiredScopes] : [WRITE_SCOPE];
}
function resolveSessionActionLeastPrivilegeScopes(params) {
	const registeredScopes = resolveSessionActionRegisteredScopes(params);
	if (registeredScopes) return registeredScopes;
	if (params && typeof params === "object" && !Array.isArray(params)) {
		const pluginId = normalizeOptionalString(params.pluginId);
		const actionId = normalizeOptionalString(params.actionId);
		if (pluginId && actionId) return [...CLI_DEFAULT_OPERATOR_SCOPES];
	}
	return [WRITE_SCOPE];
}
function resolveDynamicLeastPrivilegeOperatorScopesForMethod(method, params) {
	if (method === "plugins.sessionAction") return resolveSessionActionLeastPrivilegeScopes(params);
	if (method === "agent") return isAgentSessionResetCommand(params && typeof params === "object" && !Array.isArray(params) ? params.message : void 0) ? [ADMIN_SCOPE] : [WRITE_SCOPE];
	if (method === "node.invoke") {
		const record = params && typeof params === "object" && !Array.isArray(params) ? params : void 0;
		const command = record?.command;
		if (isBrowserProxyNodeInvokeCommand(command) && isForbiddenBrowserProxyMutation(record?.params)) return [WRITE_SCOPE];
		return isAdminOnlyNodeInvokeCommand(command) ? [ADMIN_SCOPE] : [WRITE_SCOPE];
	}
	if (method === "talk.config") return (params && typeof params === "object" && !Array.isArray(params) ? params.includeSecrets : void 0) === true ? [READ_SCOPE, TALK_SECRETS_SCOPE] : [READ_SCOPE];
	if (method === "environments.list") {
		const runtimeId = params && typeof params === "object" && !Array.isArray(params) && "runtimeId" in params ? params.runtimeId : void 0;
		return typeof runtimeId === "string" && runtimeId ? [WRITE_SCOPE] : [READ_SCOPE];
	}
	if (method === "channels.pairing.approve") return (params && typeof params === "object" && !Array.isArray(params) ? params.bootstrapCommandOwner : void 0) === true ? [PAIRING_SCOPE, ADMIN_SCOPE] : [PAIRING_SCOPE];
	if (method === "fs.listDir") return [params !== null && typeof params === "object" && !Array.isArray(params) && Object.hasOwn(params, "nodeId") ? ADMIN_SCOPE : WRITE_SCOPE];
	if (method === "sessions.patch") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.write"];
	if (method === "sessions.patchMany") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.write"];
	if (method === "sessions.create") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.write"];
	if (method === "sessions.dispatch") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.write"];
	if (method === "sessions.move") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.write"];
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
	if (isNodeRoleMethod(method)) return true;
	if (isDynamicOperatorGatewayMethod(method)) return true;
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
		message: requestDispatched ? `${message}\n\n${DISPATCHED_REQUEST_OUTCOME_GUIDANCE}` : message
	});
}
//#endregion
//#region src/gateway/call.ts
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
const defaultGetRuntimeConfig = async () => getRuntimeConfigSnapshot() ?? await readGatewayDispatchConfigWithShellEnvFallback();
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
async function loadGatewayConfig() {
	return await defaultGetRuntimeConfig();
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
function loadGatewayConfigForConnectionDetails() {
	return readGatewayDispatchConfig();
}
function resolveGatewayStateDir(env) {
	return resolveStateDir(env);
}
function resolveGatewayConfigPath(env) {
	return resolveConfigPath(env, resolveGatewayStateDir(env));
}
function resolveGatewayPortValue(config, env) {
	return resolveGatewayPort(config, env);
}
function buildGatewayConnectionDetails(options = {}) {
	return buildGatewayConnectionDetailsWithResolvers(options, {
		getRuntimeConfig: () => loadGatewayConfigForConnectionDetails(),
		resolveConfigPath: (env) => resolveGatewayConfigPath(env),
		resolveGatewayPort: (config, env) => resolveGatewayPortValue(config, env)
	});
}
function resolveGatewayCallAuth(config) {
	return resolveGatewayAuth({
		authConfig: config.gateway?.auth,
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
function ensureGatewaySupportsRequiredMethods(params) {
	const requiredMethods = Array.isArray(params.requiredMethods) ? params.requiredMethods.map((entry) => entry.trim()).filter((entry) => entry.length > 0) : [];
	if (requiredMethods.length === 0) return;
	const supportedMethods = new Set((Array.isArray(params.methods) ? params.methods : []).map((entry) => entry.trim()).filter((entry) => entry.length > 0));
	for (const method of requiredMethods) {
		if (supportedMethods.has(method)) continue;
		throw new Error([`active gateway does not support required method "${method}" for "${params.attemptedMethod}".`, "Update or restart the active gateway and try again."].join(" "));
	}
}
function ensureGatewaySupportsRequiredCapabilities(params) {
	const required = (params.requiredCapabilities ?? []).map((entry) => entry.trim()).filter(Boolean);
	if (required.length === 0) return;
	const supported = new Set((params.capabilities ?? []).map((entry) => entry.trim()).filter(Boolean));
	for (const capability of required) if (!supported.has(capability)) throw new Error(`active gateway does not support required capability "${capability}" for "${params.attemptedMethod}". Update or restart the active gateway and try again.`);
}
function isRequiredAgentRuntimeIdentityConnectError(err) {
	return err.message.includes("gateway rejected required agent runtime identity auth field; refusing to retry without it");
}
function isAllowlistedGatewayConnectRequestError(err) {
	if (err.name !== "GatewayClientRequestError") return false;
	return readConnectErrorDetailCode(err.details) === ConnectErrorDetailCodes.AUTH_RATE_LIMITED;
}
async function executeGatewayRequestWithScopes(params) {
	const { opts, scopes, url, token, password, edgeAuthHeaders, tlsFingerprint, timeoutMs, startupTimeoutMs, safeTimerTimeoutMs, deviceIdentity, deviceAuthScope, storedAuth, surfaceGatewayClientRequestErrors } = params;
	return await new Promise((resolve, reject) => {
		if (opts.signal?.aborted) {
			reject(createGatewayRequestAbortError(opts.method));
			return;
		}
		let settled = false;
		let ignoreClose = false;
		let timer;
		const startAbort = new AbortController();
		let primaryRequestStarted = false;
		let suppressedPreHelloCleanCloses = 0;
		const cleanup = () => {
			startAbort.abort();
			if (abortHandler) opts.signal?.removeEventListener("abort", abortHandler);
			if (timer) clearTimeout(timer);
		};
		const stopClientThenSettle = (activeClient, err, value) => {
			const complete = () => {
				if (err) reject(err);
				else resolve(value);
			};
			if (!activeClient) {
				complete();
				return;
			}
			stopGatewayClient(activeClient).finally(complete);
		};
		const stop = (err, value) => {
			if (settled) return;
			settled = true;
			cleanup();
			stopClientThenSettle(client, err, value);
		};
		const abortHandler = () => {
			if (settled) return;
			ignoreClose = true;
			settled = true;
			cleanup();
			const err = createGatewayRequestAbortError(opts.method);
			const activeClient = client;
			const stopAfterAbortHook = () => stopClientThenSettle(activeClient, err);
			if (!activeClient || !opts.onSignalAbort || !primaryRequestStarted) {
				stopAfterAbortHook();
				return;
			}
			const request = activeClient.request.bind(activeClient);
			Promise.resolve().then(() => opts.onSignalAbort?.(request)).catch(() => {}).finally(stopAfterAbortHook);
		};
		opts.signal?.addEventListener("abort", abortHandler, { once: true });
		const client = new GatewayClient({
			url,
			token,
			password,
			edgeAuthHeaders,
			tlsFingerprint,
			preauthHandshakeTimeoutMs: opts.preauthHandshakeTimeoutMs,
			instanceId: opts.instanceId ?? randomUUID(),
			clientName: opts.clientName ?? GATEWAY_CLIENT_NAMES.CLI,
			clientDisplayName: resolveGatewayClientDisplayName(opts),
			clientVersion: opts.clientVersion ?? VERSION,
			caps: opts.caps,
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
						ensureGatewaySupportsRequiredMethods({
							requiredMethods: opts.requiredMethods,
							methods: hello.features?.methods,
							attemptedMethod: opts.method
						});
						ensureGatewaySupportsRequiredCapabilities({
							requiredCapabilities: opts.requiredCapabilities,
							capabilities: hello.features?.capabilities,
							attemptedMethod: opts.method
						});
						const activeClient = client;
						if (!activeClient) throw new Error("gateway client not initialized");
						opts.assertDispatchCurrent?.();
						primaryRequestStarted = true;
						const result = await activeClient.request(opts.method, opts.params, {
							expectFinal: opts.expectFinal,
							timeoutMs: opts.timeoutMs,
							signal: opts.signal,
							onAccepted: opts.onAccepted
						});
						ignoreClose = true;
						stop(void 0, result);
					} catch (err) {
						ignoreClose = true;
						stop(err);
					}
				})();
			},
			onClose: (code, reason, info) => {
				if (settled || ignoreClose) return;
				if (info?.connectError) {
					ignoreClose = true;
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
				ignoreClose = true;
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
				ignoreClose = true;
				stop(err);
			}
		});
		const wrapperTimeoutMs = timeoutMs ?? startupTimeoutMs;
		timer = setTimeout(() => {
			ignoreClose = true;
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
			ignoreClose = true;
			stop(createGatewayTimeoutTransportError({
				timeoutMs: startupTimeoutMs,
				connectionDetails: params.connectionDetails,
				requestDispatched: false
			}));
		}).catch((err) => {
			if (settled) return;
			ignoreClose = true;
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
	const authMode = resolveGatewayCallAuth(context.config).mode;
	const omitDeviceIdentity = shouldOmitDeviceIdentityForGatewayCall({
		opts,
		url,
		authMode,
		token,
		password,
		allowAuthNone: opts.requireLocalBackendSharedAuth === true && authMode === "none"
	});
	if (opts.requireLocalBackendSharedAuth && !omitDeviceIdentity) throw new GatewayLocalBackendSharedAuthUnavailableError("local backend shared auth requires a loopback gateway with token/password credentials or auth mode none");
	const deviceIdentity = opts.deviceIdentity === void 0 ? omitDeviceIdentity ? null : resolveDeviceIdentityForGatewayCall(opts.sharedStateMode) : opts.deviceIdentity;
	let storedAuth = opts.preparedDeviceAuth;
	if (useStoredDeviceAuth) {
		storedAuth ??= await loadStoredOperatorDeviceAuthToken(deviceIdentity, deviceAuthScope, opts.sharedStateMode);
		if (!storedAuth?.token && deviceAuthScope) throw new GatewayStoredDeviceAuthUnavailableError(["No stored device auth for this gateway origin.", `Run \`openclaw tui --url ${deviceAuthScope}\` to send a pairing request, approve it in that gateway's Control UI (Settings -> Devices) or run \`openclaw devices approve --latest\` on the gateway host, then retry.`].join("\n"));
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
			method: opts.method,
			configPath: context.configPath
		});
		if (Array.isArray(opts.requiredStoredDeviceAuthScopes) && !roleScopesAllow({
			role: "operator",
			requestedScopes: opts.requiredStoredDeviceAuthScopes,
			allowedScopes: storedAuth.scopes
		})) throw new GatewayStoredDeviceAuthUnavailableError("stored device auth does not grant the required operator scopes");
	}
	await ensureGatewayCallCanAuthenticate({
		opts,
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
			sharedStateMode: opts.sharedStateMode,
			preparedDeviceAuth: storedAuth ?? void 0,
			approvalRuntimeToken: opts.approvalRuntimeToken,
			agentRuntimeIdentityToken: opts.agentRuntimeIdentityToken
		}, opts.signal);
	} catch (error) {
		if (opts.signal?.aborted) throw createGatewayRequestAbortError(opts.method);
		throw error;
	}
	return await executeGatewayRequestWithScopes({
		opts,
		scopes: requestedStoredDeviceAuth && hasExplicitAuth && opts.requiredStoredDeviceAuthScopes ? opts.requiredStoredDeviceAuthScopes : useStoredDeviceAuth ? void 0 : localCliAbort && omitDeviceIdentity && !deviceIdentity ? [ADMIN_SCOPE] : scopes,
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
		...storedAuth ? { storedAuth } : {},
		surfaceGatewayClientRequestErrors: useStoredDeviceAuth || opts.requireLocalBackendSharedAuth === true || Boolean(opts.agentRuntimeIdentityToken)
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
