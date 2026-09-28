import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as isNonEmptyProtocolString } from "./protocol-value-normalization-Oati9UF1.mjs";
import { t as PLUGIN_DECLARED_SURFACE_GROUPS } from "./plugin-declared-surface-groups-CaZZpMBC.mjs";
//#region packages/gateway-protocol/src/capability-consent-error-details.ts
const PLUGIN_CAPABILITY_CONSENT_REQUIRED = "PLUGIN_CAPABILITY_CONSENT_REQUIRED";
function hasOnlyKeys(record, allowed) {
	return Object.keys(record).every((key) => allowed.includes(key));
}
function readDeclaredSurfaceWidening(value) {
	const record = asNullableRecord(value);
	if (!record || !hasOnlyKeys(record, PLUGIN_DECLARED_SURFACE_GROUPS)) return;
	const widened = {};
	for (const group of PLUGIN_DECLARED_SURFACE_GROUPS) {
		const items = record[group];
		if (items === void 0) continue;
		if (!Array.isArray(items) || !items.every(isNonEmptyProtocolString)) return;
		widened[group] = items;
	}
	return widened;
}
function buildCapabilityConsentErrorDetails(details) {
	return {
		capabilityConsentCode: PLUGIN_CAPABILITY_CONSENT_REQUIRED,
		...details
	};
}
/** Keep the startup-path reader registry-free and preserve wire-significant whitespace. */
function readCapabilityConsentErrorDetails(value) {
	const record = asNullableRecord(value);
	if (!record || record.capabilityConsentCode !== "PLUGIN_CAPABILITY_CONSENT_REQUIRED" || !hasOnlyKeys(record, [
		"capabilityConsentCode",
		"pluginId",
		"reviewToken",
		"widened",
		"acceptedAt"
	]) || !isNonEmptyProtocolString(record.pluginId) || !isNonEmptyProtocolString(record.reviewToken) || record.acceptedAt !== void 0 && !isNonEmptyProtocolString(record.acceptedAt)) return;
	const widened = record.widened === void 0 ? void 0 : readDeclaredSurfaceWidening(record.widened);
	if (record.widened !== void 0 && !widened) return;
	return {
		capabilityConsentCode: PLUGIN_CAPABILITY_CONSENT_REQUIRED,
		pluginId: record.pluginId,
		reviewToken: record.reviewToken,
		...widened ? { widened } : {},
		...record.acceptedAt !== void 0 ? { acceptedAt: record.acceptedAt } : {}
	};
}
//#endregion
export { buildCapabilityConsentErrorDetails as n, readCapabilityConsentErrorDetails as r, PLUGIN_CAPABILITY_CONSENT_REQUIRED as t };
