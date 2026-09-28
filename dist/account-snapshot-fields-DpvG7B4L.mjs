import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { t as asBoolean } from "./boolean-C30ltbL7.mjs";
import "./utils-aKqR_F_U.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-DspuXlEe.mjs";
//#region packages/net-policy/src/url-userinfo.ts
/** Strip username/password credentials from a URL string when it parses. */
function stripUrlUserInfo(value) {
	try {
		const parsed = new URL(value);
		if (!parsed.username && !parsed.password) return value;
		parsed.username = "";
		parsed.password = "";
		return parsed.toString();
	} catch {
		return value;
	}
}
//#endregion
//#region src/channels/account-snapshot-fields.ts
/**
* Status-safe channel account projection helpers for CLI, status APIs, and plugin SDK callers.
* This file is the redaction boundary between runtime account objects and public snapshots.
*/
const CREDENTIAL_STATUS_KEYS = [
	"tokenStatus",
	"botTokenStatus",
	"appTokenStatus",
	"signingSecretStatus",
	"userTokenStatus"
];
const CREDENTIAL_SOURCE_KEYS = [
	"tokenSource",
	"botTokenSource",
	"appTokenSource",
	"signingSecretSource",
	"userTokenSource",
	"credentialSource",
	"secretSource"
];
/** Redacts a plugin-provided base URL after status hooks have produced their final record. */
function redactChannelStatusSummaryBaseUrl(summary) {
	if (!isRecord(summary) || typeof summary.baseUrl !== "string" || !summary.baseUrl) return summary;
	const redactedBaseUrl = stripUrlUserInfo(redactSensitiveUrlLikeString(summary.baseUrl));
	return redactedBaseUrl === summary.baseUrl ? summary : {
		...summary,
		baseUrl: redactedBaseUrl
	};
}
/** Redacts a plugin-provided base URL at the public account-snapshot boundary. */
function redactChannelAccountSnapshotBaseUrl(snapshot) {
	return redactChannelStatusSummaryBaseUrl(snapshot);
}
function readNullableNumber(record, key) {
	return record[key] === null ? null : asFiniteNumber(record[key]);
}
function setSnapshotField(snapshot, key, value) {
	if (value !== void 0) snapshot[key] = value;
}
function readStringArray(record, key) {
	const value = record[key];
	if (!Array.isArray(value)) return;
	const normalized = normalizeStringEntries(value.map((entry) => typeof entry === "string" || typeof entry === "number" ? entry : ""));
	return normalized.length > 0 ? normalized : void 0;
}
function readCredentialStatus(record, key) {
	const value = record[key];
	return value === "available" || value === "configured_unavailable" || value === "missing" ? value : void 0;
}
/**
* Infers whether any known credential status makes an account configured.
*
* Status commands need this metadata for "configured but unavailable" accounts without reading
* raw credentials from runtime-only helpers.
*/
function resolveConfiguredFromCredentialStatuses(account) {
	const record = isRecord(account) ? account : null;
	if (!record) return;
	let sawCredentialStatus = false;
	for (const key of CREDENTIAL_STATUS_KEYS) {
		const status = readCredentialStatus(record, key);
		if (!status) continue;
		sawCredentialStatus = true;
		if (status !== "missing") return true;
	}
	return sawCredentialStatus ? false : void 0;
}
/** Infers configured state only from the credential status keys required by a channel. */
function resolveConfiguredFromRequiredCredentialStatuses(account, requiredKeys) {
	const record = isRecord(account) ? account : null;
	if (!record) return;
	let sawCredentialStatus = false;
	for (const key of requiredKeys) {
		const status = readCredentialStatus(record, key);
		if (!status) continue;
		sawCredentialStatus = true;
		if (status === "missing") return false;
	}
	return sawCredentialStatus ? true : void 0;
}
/** Returns true when a credential exists but cannot be resolved at status-render time. */
function hasConfiguredUnavailableCredentialStatus(account) {
	const record = isRecord(account) ? account : null;
	if (!record) return false;
	return CREDENTIAL_STATUS_KEYS.some((key) => readCredentialStatus(record, key) === "configured_unavailable");
}
/** Reads typed, redacted credential diagnostics from a resolved channel account. */
function getCredentialUnavailableDiagnostics(account) {
	const record = isRecord(account) ? account : null;
	if (!record || !Array.isArray(record.credentialDiagnostics)) return [];
	const diagnostics = [];
	for (const value of record.credentialDiagnostics) {
		if (!isRecord(value) || value.code !== "CREDENTIAL_FILE_UNAVAILABLE") continue;
		const path = normalizeOptionalString(value.path);
		const reason = normalizeOptionalString(value.reason);
		if (path && reason) diagnostics.push({
			code: value.code,
			path,
			reason
		});
	}
	return diagnostics;
}
/** Returns true when account data contains a resolved credential value or available status. */
function hasResolvedCredentialValue(account) {
	const record = isRecord(account) ? account : null;
	if (!record) return false;
	return [
		"token",
		"botToken",
		"appToken",
		"signingSecret",
		"userToken"
	].some((key) => {
		return normalizeOptionalString(record[key]) !== void 0;
	}) || CREDENTIAL_STATUS_KEYS.some((key) => readCredentialStatus(record, key) === "available");
}
/** Projects credential source/status metadata while omitting raw credential values. */
function projectCredentialSnapshotFields(account) {
	const record = isRecord(account) ? account : null;
	if (!record) return {};
	const snapshot = {};
	for (const key of CREDENTIAL_SOURCE_KEYS) setSnapshotField(snapshot, key, normalizeOptionalString(record[key]));
	for (const key of CREDENTIAL_STATUS_KEYS) setSnapshotField(snapshot, key, readCredentialStatus(record, key));
	return snapshot;
}
/**
* Projects status-safe account fields for read-only channel/account snapshots.
*
* This is the boundary between runtime account objects and status renderers; keep it explicit so
* new channel fields do not accidentally expose webhook URLs, public keys, or raw credentials.
*/
function projectSafeChannelAccountSnapshotFields(account) {
	const record = isRecord(account) ? account : null;
	if (!record) return {};
	const snapshot = {};
	setSnapshotField(snapshot, "name", normalizeOptionalString(record.name));
	for (const key of [
		"linked",
		"running",
		"connected",
		"restartPending"
	]) setSnapshotField(snapshot, key, asBoolean(record[key]));
	setSnapshotField(snapshot, "reconnectAttempts", asFiniteNumber(record.reconnectAttempts));
	setSnapshotField(snapshot, "lastConnectedAt", readNullableNumber(record, "lastConnectedAt"));
	setSnapshotField(snapshot, "lastInboundAt", asFiniteNumber(record.lastInboundAt));
	for (const key of [
		"lastOutboundAt",
		"lastMessageAt",
		"lastEventAt"
	]) setSnapshotField(snapshot, key, readNullableNumber(record, key));
	setSnapshotField(snapshot, "lastTransportActivityAt", asFiniteNumber(record.lastTransportActivityAt));
	for (const key of ["statusState", "healthState"]) setSnapshotField(snapshot, key, normalizeOptionalString(record[key]));
	const lifecycle = record.lifecycle;
	if (lifecycle === "starting" || lifecycle === "ready" || lifecycle === "recovering" || lifecycle === "blocked" || lifecycle === "stopped") snapshot.lifecycle = lifecycle;
	if (asBoolean(record.ingressUnavailable) === true) snapshot.ingressUnavailable = true;
	for (const key of ["terminalDisconnect", "busy"]) setSnapshotField(snapshot, key, asBoolean(record[key]));
	setSnapshotField(snapshot, "activeRuns", asFiniteNumber(record.activeRuns));
	for (const key of ["lastRunActivityAt", "activeRunStartedAt"]) setSnapshotField(snapshot, key, readNullableNumber(record, key));
	for (const key of [
		"mode",
		"dmPolicy",
		"identity",
		"audienceType",
		"webhookPath"
	]) setSnapshotField(snapshot, key, normalizeOptionalString(record[key]));
	setSnapshotField(snapshot, "allowFrom", readStringArray(record, "allowFrom"));
	Object.assign(snapshot, projectCredentialSnapshotFields(account));
	setSnapshotField(snapshot, "apiCredentialStatus", readCredentialStatus(record, "apiCredentialStatus"));
	for (const key of ["baseUrl", "audience"]) {
		const value = normalizeOptionalString(record[key]);
		if (value) snapshot[key] = stripUrlUserInfo(redactSensitiveUrlLikeString(value));
	}
	setSnapshotField(snapshot, "allowUnmentionedGroups", asBoolean(record.allowUnmentionedGroups));
	for (const key of ["cliPath", "dbPath"]) setSnapshotField(snapshot, key, normalizeOptionalString(record[key]));
	setSnapshotField(snapshot, "port", asFiniteNumber(record.port));
	return snapshot;
}
//#endregion
export { projectSafeChannelAccountSnapshotFields as a, resolveConfiguredFromCredentialStatuses as c, projectCredentialSnapshotFields as i, resolveConfiguredFromRequiredCredentialStatuses as l, hasConfiguredUnavailableCredentialStatus as n, redactChannelAccountSnapshotBaseUrl as o, hasResolvedCredentialValue as r, redactChannelStatusSummaryBaseUrl as s, getCredentialUnavailableDiagnostics as t };
