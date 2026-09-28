import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as isClawHubTelemetryDisabled, d as readClawHubStringField, f as readRequiredClawHubBooleanField, g as resolveClawHubAuthToken, h as readRequiredClawHubStringField, i as fetchClawHubJson, m as readRequiredClawHubStringArrayField, n as createClawHubError, y as withClawHubResponse } from "./clawhub-client-D8cfvjQG.mjs";
//#region src/infra/clawhub-packages.ts
function parseOptionalSecurityPackage(value) {
	if (value === void 0 || value === null) return value;
	if (!isRecord(value)) throw new Error("Malformed ClawHub security response: expected package to be an object or null.");
	const result = {};
	const name = readClawHubStringField(value, "name", "security package");
	const displayName = readClawHubStringField(value, "displayName", "security package");
	const family = readClawHubStringField(value, "family", "security package");
	if (name !== void 0) result.name = name;
	if (displayName !== void 0) result.displayName = displayName;
	if (family !== void 0) result.family = family;
	return result;
}
function parseOptionalSecurityRelease(value) {
	if (value === void 0 || value === null) return value;
	if (!isRecord(value)) throw new Error("Malformed ClawHub security response: expected release to be an object or null.");
	const result = {};
	const releaseId = readClawHubStringField(value, "releaseId", "security release");
	const legacyId = readClawHubStringField(value, "id", "security release");
	const version = readClawHubStringField(value, "version", "security release");
	const id = releaseId ?? legacyId;
	if (id !== void 0) result.id = id;
	if (version !== void 0) result.version = version;
	return result;
}
function parseClawHubPackageSecurityResponse(value) {
	if (!isRecord(value)) throw new Error("Malformed ClawHub security response: expected an object.");
	const trust = value.trust;
	if (!isRecord(trust)) throw new Error("Malformed ClawHub security response: expected trust to be an object.");
	const parsedTrust = {
		blockedFromDownload: readRequiredClawHubBooleanField(trust, "blockedFromDownload", "security trust"),
		reasons: readRequiredClawHubStringArrayField(trust, "reasons", "security trust"),
		pending: readRequiredClawHubBooleanField(trust, "pending", "security trust"),
		stale: readRequiredClawHubBooleanField(trust, "stale", "security trust")
	};
	const scanStatus = readClawHubStringField(trust, "scanStatus", "security trust");
	const moderationState = readClawHubStringField(trust, "moderationState", "security trust");
	if (scanStatus !== void 0) parsedTrust.scanStatus = scanStatus;
	if (moderationState !== void 0) parsedTrust.moderationState = moderationState;
	const result = {
		overview: readRequiredClawHubStringField(value, "overview", "security response"),
		securityAuditUrl: readRequiredClawHubStringField(value, "securityAuditUrl", "security response"),
		trust: parsedTrust
	};
	const parsedPackage = parseOptionalSecurityPackage(value.package);
	const verdict = readClawHubStringField(value, "verdict", "security response");
	if (verdict) result.verdict = verdict;
	const parsedRelease = parseOptionalSecurityRelease(value.release);
	if (parsedPackage !== void 0) result.package = parsedPackage;
	if (parsedRelease !== void 0) result.release = parsedRelease;
	return result;
}
async function fetchClawHubPackageDetail(params) {
	return await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/packages/${encodeURIComponent(params.name)}`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
}
async function fetchClawHubPackageVersion(params) {
	return await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/packages/${encodeURIComponent(params.name)}/versions/${encodeURIComponent(params.version)}`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
}
async function fetchClawHubPackageArtifact(params) {
	return await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/packages/${encodeURIComponent(params.name)}/versions/${encodeURIComponent(params.version)}/artifact`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
}
async function fetchClawHubPackageSecurity(params) {
	return parseClawHubPackageSecurityResponse(await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/packages/${encodeURIComponent(params.name)}/versions/${encodeURIComponent(params.version)}/security`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	}));
}
async function searchClawHubPackages(params) {
	return (await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: "/api/v1/packages/search",
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: {
			q: params.query.trim(),
			family: params.family,
			limit: params.limit ? String(params.limit) : void 0
		}
	})).results ?? [];
}
async function reportClawHubPluginInstallTelemetry(params) {
	const token = normalizeOptionalString(params.token) ?? await resolveClawHubAuthToken();
	if (!token || isClawHubTelemetryDisabled()) return;
	const packageName = normalizeOptionalString(params.packageName);
	if (!packageName) return;
	return await withClawHubResponse({
		baseUrl: params.baseUrl,
		path: "/api/cli/telemetry/install",
		method: "POST",
		token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		json: {
			event: "plugin_install",
			packageName,
			version: params.version ?? void 0
		}
	}, async ({ response, url, hasToken }) => {
		if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
	});
}
function resolveLatestVersionFromPackage(detail) {
	return detail.package?.latestVersion ?? detail.package?.tags?.latest ?? null;
}
//#endregion
export { parseClawHubPackageSecurityResponse as a, searchClawHubPackages as c, fetchClawHubPackageVersion as i, fetchClawHubPackageDetail as n, reportClawHubPluginInstallTelemetry as o, fetchClawHubPackageSecurity as r, resolveLatestVersionFromPackage as s, fetchClawHubPackageArtifact as t };
