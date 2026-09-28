import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as normalizeOptionalTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
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
/** Maps internal auth failure reasons to public connect-error detail codes. */
function resolveAuthConnectErrorDetailCode(reason) {
	if (reason?.startsWith("trusted_proxy_missing_header_")) return ConnectErrorDetailCodes.AUTH_IDENTITY_HEADER_REQUIRED;
	switch (reason) {
		case "token_missing": return ConnectErrorDetailCodes.AUTH_TOKEN_MISSING;
		case "token_mismatch": return ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH;
		case "token_missing_config": return ConnectErrorDetailCodes.AUTH_TOKEN_NOT_CONFIGURED;
		case "password_missing": return ConnectErrorDetailCodes.AUTH_PASSWORD_MISSING;
		case "password_mismatch": return ConnectErrorDetailCodes.AUTH_PASSWORD_MISMATCH;
		case "password_missing_config": return ConnectErrorDetailCodes.AUTH_PASSWORD_NOT_CONFIGURED;
		case "bootstrap_token_invalid": return ConnectErrorDetailCodes.AUTH_BOOTSTRAP_TOKEN_INVALID;
		case "tailscale_user_missing": return ConnectErrorDetailCodes.AUTH_TAILSCALE_IDENTITY_MISSING;
		case "tailscale_proxy_missing": return ConnectErrorDetailCodes.AUTH_TAILSCALE_PROXY_MISSING;
		case "tailscale_whois_failed": return ConnectErrorDetailCodes.AUTH_TAILSCALE_WHOIS_FAILED;
		case "tailscale_user_mismatch": return ConnectErrorDetailCodes.AUTH_TAILSCALE_IDENTITY_MISMATCH;
		case "rate_limited": return ConnectErrorDetailCodes.AUTH_RATE_LIMITED;
		case "device_token_mismatch": return ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH;
		case "scope_mismatch": return ConnectErrorDetailCodes.AUTH_SCOPE_MISMATCH;
		case void 0: return ConnectErrorDetailCodes.AUTH_REQUIRED;
		default: return ConnectErrorDetailCodes.AUTH_UNAUTHORIZED;
	}
}
/** Maps device-auth verifier reasons to public connect-error detail codes. */
function resolveDeviceAuthConnectErrorDetailCode(reason) {
	switch (reason) {
		case "device-id-mismatch": return ConnectErrorDetailCodes.DEVICE_AUTH_DEVICE_ID_MISMATCH;
		case "device-signature-stale": return ConnectErrorDetailCodes.DEVICE_AUTH_SIGNATURE_EXPIRED;
		case "device-nonce-missing": return ConnectErrorDetailCodes.DEVICE_AUTH_NONCE_REQUIRED;
		case "device-nonce-mismatch": return ConnectErrorDetailCodes.DEVICE_AUTH_NONCE_MISMATCH;
		case "device-signature": return ConnectErrorDetailCodes.DEVICE_AUTH_SIGNATURE_INVALID;
		case "device-public-key": return ConnectErrorDetailCodes.DEVICE_AUTH_PUBLIC_KEY_INVALID;
		default: return ConnectErrorDetailCodes.DEVICE_AUTH_INVALID;
	}
}
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
/** Human-readable requirement summary for a pairing-required reason. */
function describePairingConnectRequirement(reason) {
	return reason ? PAIRING_CONNECT_REASON_METADATA[reason].requirement : "device approval is required";
}
/** Builds the gateway close/error message for a pairing-required connect failure. */
function buildPairingConnectErrorMessage(reason) {
	return reason ? `pairing required: ${describePairingConnectRequirement(reason)}` : "pairing required";
}
function buildPairingConnectRemediationHint(reason) {
	return reason ? PAIRING_CONNECT_REASON_METADATA[reason].remediationHint : "Approve the pending device request before retrying.";
}
/** Short user-facing recovery title for pairing-required connect failures. */
function buildPairingConnectRecoveryTitle(reason) {
	return reason ? PAIRING_CONNECT_REASON_METADATA[reason].recoveryTitle : "Gateway pairing approval required.";
}
/** Builds sanitized structured details for a pairing-required connect failure. */
function buildPairingConnectErrorDetails(params) {
	const requestId = normalizePairingConnectRequestId(params.requestId);
	const remediationHint = normalizeOptionalString(params.remediationHint) ?? buildPairingConnectRemediationHint(params.reason);
	const deviceId = normalizeOptionalString(params.deviceId);
	const requestedRole = normalizeOptionalString(params.requestedRole);
	const requestedScopes = normalizeOptionalTrimmedStringList(params.requestedScopes);
	const approvedRoles = normalizeOptionalTrimmedStringList(params.approvedRoles);
	const approvedScopes = normalizeOptionalTrimmedStringList(params.approvedScopes);
	return createPairingConnectErrorDetails({
		reason: params.reason,
		requestId,
		remediationHint,
		recommendedNextStep: params.recommendedNextStep,
		retryable: params.retryable,
		pauseReconnect: params.pauseReconnect,
		deviceId,
		requestedRole,
		requestedScopes,
		approvedRoles,
		approvedScopes
	});
}
/** Builds a sanitized close reason string for WebSocket pairing rejections. */
function buildPairingConnectCloseReason(params) {
	const requestId = normalizePairingConnectRequestId(params.requestId);
	const message = buildPairingConnectErrorMessage(params.reason);
	return requestId ? `${message} (requestId: ${requestId})` : message;
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
/** Parses legacy/string-only pairing-required messages into structured details. */
function readConnectPairingRequiredMessage(message) {
	const normalizedMessage = normalizeOptionalString(message);
	if (!normalizedMessage) return null;
	const normalized = normalizedMessage.trim().toLowerCase();
	let reason;
	for (const [candidate, prefix] of Object.entries(CONNECT_PAIRING_REQUIRED_MESSAGE_BY_REASON)) if (normalized.includes(prefix)) {
		reason = candidate;
		break;
	}
	if (!reason && normalized.includes("pairing required")) reason = ConnectPairingRequiredReasons.NOT_PAIRED;
	if (!reason) return null;
	const requestId = normalizePairingConnectRequestId(normalizedMessage.match(/\(requestId:\s*([^\s)]+)\)/i)?.[1]);
	return {
		...requestId ? { requestId } : {},
		reason
	};
}
const PAIRING_APPROVAL_REMEDIATION = "Run `openclaw devices approve --latest` to preview the pending request, then rerun the printed `openclaw devices approve <requestId>` command and reconnect (pass the same --url and --token/--password flags if you connected with explicit credentials).";
const DEVICE_TOKEN_REMEDIATION = "Rotate the paired-device token with `openclaw devices rotate --device <deviceId> --role operator`, then reconnect.";
const SHARED_TOKEN_REMEDIATION = "Verify `gateway.remote.token` matches `gateway.auth.token`. If a paired-device token is stale, rotate it with `openclaw devices rotate --device <deviceId> --role operator`, then reconnect.";
const SCOPE_MISMATCH_REMEDIATION = "Review approved scopes with `openclaw devices list`; if an upgrade is pending, preview it with `openclaw devices approve --latest`, approve the printed request, then reconnect.";
const RATE_LIMITED_REMEDIATION = "Wait for the temporary authentication lockout to expire, then retry.";
const IDENTITY_PROXY_REMEDIATION = "An identity-aware proxy rejected the WebSocket upgrade. Configure gateway.remote.edgeAuth for the configured Gateway origin, then reconnect. See https://docs.openclaw.ai/gateway/remote#gateway-behind-an-identity-aware-proxy.";
const CLOUDFLARE_ACCESS_REMEDIATION = "Cloudflare Access detected: configure its token header or service-token headers in gateway.remote.edgeAuth.";
const IDENTITY_PROXY_HTTP_STATUSES = /* @__PURE__ */ new Set([
	301,
	302,
	303,
	307,
	308,
	401,
	403
]);
const GATEWAY_CLOSED_MESSAGE_PATTERN = /\bgateway closed \(\d+\):/i;
function readIdentityProxyRejection(details) {
	if (!isRecord(details)) return null;
	if (details.reason !== "websocket-upgrade-rejected" || typeof details.httpStatus !== "number" || !IDENTITY_PROXY_HTTP_STATUSES.has(details.httpStatus)) return null;
	const location = normalizeOptionalString(details.location);
	if (!location) return { cloudflareAccess: false };
	try {
		return { cloudflareAccess: new URL(location).hostname.toLowerCase().replace(/\.+$/u, "").endsWith(".cloudflareaccess.com") };
	} catch {
		return { cloudflareAccess: false };
	}
}
/** Classifies Gateway connect failures from structured details, with one legacy text fallback. */
function classifyGatewayConnectFailure(input) {
	const code = readConnectErrorDetailCode(input.details);
	const message = normalizeOptionalString(input.message);
	const reason = normalizeOptionalString(input.reason);
	const userMessage = message ?? reason;
	const classificationText = [message, reason].filter((value) => Boolean(value)).join("\n");
	const normalized = classificationText.toLowerCase();
	const pairing = readPairingConnectErrorDetails(input.details) ?? readConnectPairingRequiredMessage(classificationText);
	if (code === ConnectErrorDetailCodes.PAIRING_REQUIRED || pairing) return {
		kind: "pairing-required",
		userMessage: code === ConnectErrorDetailCodes.PAIRING_REQUIRED ? formatConnectPairingRequiredMessage(input.details) : userMessage ?? "device pairing required",
		remediation: PAIRING_APPROVAL_REMEDIATION
	};
	const identityProxy = readIdentityProxyRejection(input.details);
	if (identityProxy) return {
		kind: "identity-proxy",
		userMessage: userMessage ?? "identity-aware proxy rejected websocket upgrade",
		remediation: identityProxy.cloudflareAccess ? `${IDENTITY_PROXY_REMEDIATION}\n${CLOUDFLARE_ACCESS_REMEDIATION}` : IDENTITY_PROXY_REMEDIATION
	};
	const deviceIdentityRequired = code === ConnectErrorDetailCodes.DEVICE_IDENTITY_REQUIRED || code === ConnectErrorDetailCodes.CONTROL_UI_DEVICE_IDENTITY_REQUIRED || normalized.includes("device identity required");
	const scopeMismatch = code === ConnectErrorDetailCodes.AUTH_SCOPE_MISMATCH || normalized.includes("scope mismatch");
	const rateLimited = code === ConnectErrorDetailCodes.AUTH_RATE_LIMITED || !code && normalized.includes("too many failed authentication attempts");
	const deviceTokenMismatch = code === ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH || normalized.includes("device token mismatch");
	const sharedTokenMismatch = code === ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH || normalized.includes("gateway token mismatch");
	const authRejected = deviceTokenMismatch || sharedTokenMismatch || code?.startsWith("AUTH_") || code?.startsWith("DEVICE_AUTH_");
	const kind = deviceIdentityRequired ? "device-identity-required" : scopeMismatch ? "scope-mismatch" : rateLimited ? "rate-limited" : authRejected ? "auth-rejected" : code || GATEWAY_CLOSED_MESSAGE_PATTERN.test(classificationText) ? "gateway-rejected" : "unreachable";
	const remediation = rateLimited ? RATE_LIMITED_REMEDIATION : scopeMismatch ? SCOPE_MISMATCH_REMEDIATION : deviceTokenMismatch ? DEVICE_TOKEN_REMEDIATION : sharedTokenMismatch ? SHARED_TOKEN_REMEDIATION : void 0;
	return {
		kind,
		userMessage: userMessage ?? (kind === "unreachable" ? "gateway unreachable" : "gateway rejected connection"),
		...remediation ? { remediation } : {}
	};
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
export { buildPairingConnectRecoveryTitle as a, formatConnectErrorMessage as c, readConnectErrorRecoveryAdvice as d, readConnectPairingRequiredMessage as f, resolveDeviceAuthConnectErrorDetailCode as h, buildPairingConnectErrorMessage as i, normalizePairingConnectRequestId as l, resolveAuthConnectErrorDetailCode as m, buildPairingConnectCloseReason as n, classifyGatewayConnectFailure as o, readPairingConnectErrorDetails as p, buildPairingConnectErrorDetails as r, describePairingConnectRequirement as s, ConnectErrorDetailCodes as t, readConnectErrorDetailCode as u };
