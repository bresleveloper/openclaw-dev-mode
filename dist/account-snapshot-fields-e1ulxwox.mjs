import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { t as asBoolean } from "./boolean-BEb0Fdt8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BnHakqqk.mjs";
import "./utils-DgZn2dLu.mjs";
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
function resolveConfiguredFromCredentialStatusKeys(account, keys, mode) {
	if (!isRecord(account)) return;
	let configured;
	for (const key of keys) {
		const status = readCredentialStatus(account, key);
		if (!status) continue;
		configured = status !== "missing";
		if (mode === "any" ? configured : !configured) return configured;
	}
	return configured;
}
/** Status inspection must not redeem credentials to detect configured-but-unavailable accounts. */
function resolveConfiguredFromCredentialStatuses(account) {
	return resolveConfiguredFromCredentialStatusKeys(account, CREDENTIAL_STATUS_KEYS, "any");
}
/** Infers configured state only from the credential status keys required by a channel. */
function resolveConfiguredFromRequiredCredentialStatuses(account, requiredKeys) {
	return resolveConfiguredFromCredentialStatusKeys(account, requiredKeys, "all");
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
/** Explicitly allowlist status fields so new account fields cannot expose credentials. */
function projectSafeChannelAccountSnapshotFields(account) {
	const record = isRecord(account) ? account : null;
	if (!record) return {};
	const snapshot = {};
	for (const key of [
		"name",
		"statusState",
		"healthState",
		"mode",
		"dmPolicy",
		"identity",
		"audienceType",
		"webhookPath",
		"cliPath",
		"dbPath"
	]) setSnapshotField(snapshot, key, normalizeOptionalString(record[key]));
	for (const key of [
		"linked",
		"running",
		"connected",
		"restartPending",
		"terminalDisconnect",
		"busy",
		"allowUnmentionedGroups"
	]) setSnapshotField(snapshot, key, asBoolean(record[key]));
	for (const key of [
		"reconnectAttempts",
		"lastInboundAt",
		"lastTransportActivityAt",
		"activeRuns",
		"port"
	]) setSnapshotField(snapshot, key, asFiniteNumber(record[key]));
	for (const key of [
		"lastConnectedAt",
		"lastOutboundAt",
		"lastMessageAt",
		"lastEventAt",
		"lastRunActivityAt",
		"activeRunStartedAt"
	]) setSnapshotField(snapshot, key, readNullableNumber(record, key));
	const lifecycle = record.lifecycle;
	if (lifecycle === "starting" || lifecycle === "ready" || lifecycle === "recovering" || lifecycle === "blocked" || lifecycle === "stopped") snapshot.lifecycle = lifecycle;
	if (asBoolean(record.ingressUnavailable) === true) snapshot.ingressUnavailable = true;
	setSnapshotField(snapshot, "allowFrom", readStringArray(record, "allowFrom"));
	Object.assign(snapshot, projectCredentialSnapshotFields(account));
	setSnapshotField(snapshot, "apiCredentialStatus", readCredentialStatus(record, "apiCredentialStatus"));
	for (const key of ["baseUrl", "audience"]) {
		const value = normalizeOptionalString(record[key]);
		if (value) snapshot[key] = stripUrlUserInfo(redactSensitiveUrlLikeString(value));
	}
	return snapshot;
}
//#endregion
export { projectCredentialSnapshotFields as a, resolveConfiguredFromCredentialStatuses as c, hasResolvedCredentialValue as i, resolveConfiguredFromRequiredCredentialStatuses as l, getCredentialUnavailableDiagnostics as n, projectSafeChannelAccountSnapshotFields as o, hasConfiguredUnavailableCredentialStatus as r, redactChannelStatusSummaryBaseUrl as s, CREDENTIAL_STATUS_KEYS as t };
