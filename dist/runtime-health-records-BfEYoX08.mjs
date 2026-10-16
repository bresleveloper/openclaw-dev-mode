import { t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/plugin-state/runtime-health-records.ts
function hasValidRuntimeHealthEnvelope(value) {
	if (!value || typeof value !== "object") return false;
	const record = value;
	return typeof record.processId === "number" && Number.isInteger(record.processId) && record.processId > 0 && typeof record.processToken === "string" && record.processToken.length > 0 && (record.processStartTime === null || typeof record.processStartTime === "number" && Number.isFinite(record.processStartTime) && record.processStartTime >= 0) && typeof record.failedAtMs === "number" && Number.isFinite(record.failedAtMs);
}
function normalizeContextEngineQuarantineRecord(value) {
	if (!hasNonEmptyString(value.engineId) || !hasNonEmptyString(value.operation) || !hasNonEmptyString(value.reason)) return;
	return {
		engineId: value.engineId,
		operation: value.operation,
		reason: value.reason,
		failedAtMs: value.failedAtMs,
		processId: value.processId,
		processToken: value.processToken,
		processStartTime: value.processStartTime,
		...hasNonEmptyString(value.owner) ? { owner: value.owner } : {}
	};
}
function normalizeToolSchemaQuarantineRecord(value) {
	if (!hasNonEmptyString(value.toolName) || !hasNonEmptyString(value.reason)) return;
	return {
		toolName: value.toolName,
		reason: value.reason,
		failedAtMs: value.failedAtMs,
		processId: value.processId,
		processToken: value.processToken,
		processStartTime: value.processStartTime,
		...hasNonEmptyString(value.owner) ? { owner: value.owner } : {}
	};
}
function runtimeToolSchemaIdentityKey(identity) {
	return JSON.stringify([identity.owner ?? "", identity.toolName]);
}
function selectRuntimeHealthClearKeys(entries, processId, selection) {
	const toolKeys = new Set(selection.kind === "tool-schema" ? selection.keys : []);
	return entries.flatMap(({ key, value }) => {
		if (!hasValidRuntimeHealthEnvelope(value) || value.processId !== processId) return [];
		if (selection.kind === "context-engine") {
			const record = normalizeContextEngineQuarantineRecord(value);
			return record && (selection.engineId === void 0 || record.engineId === selection.engineId) ? [key] : [];
		}
		const record = normalizeToolSchemaQuarantineRecord(value);
		return record && toolKeys.has(runtimeToolSchemaIdentityKey(record)) ? [key] : [];
	});
}
//#endregion
export { selectRuntimeHealthClearKeys as a, runtimeToolSchemaIdentityKey as i, normalizeContextEngineQuarantineRecord as n, normalizeToolSchemaQuarantineRecord as r, hasValidRuntimeHealthEnvelope as t };
