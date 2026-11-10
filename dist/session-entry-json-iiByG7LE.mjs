import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/config/sessions/session-entry-json.ts
function hasValidSessionEntryIdentity(entry) {
	return typeof entry.sessionId === "string" && typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt);
}
function parseSqliteSessionEntryRecord(row) {
	try {
		const record = JSON.parse(row.entry_json);
		if (!isRecord(record)) return null;
		if (!hasValidSessionEntryIdentity(record)) return null;
		if (row.current_session_id !== void 0 && row.current_session_id !== record.sessionId || row.updated_at !== void 0 && row.updated_at !== record.updatedAt) return null;
		return record;
	} catch {
		return null;
	}
}
function normalizeSessionEntryTimestamp(entry) {
	const hasLegacyDeliveryFields = [
		"route",
		"deliveryContext",
		"origin",
		"channel",
		"lastChannel",
		"lastTo",
		"lastAccountId",
		"lastThreadId"
	].some((key) => key in entry);
	const delivery = entry.delivery ?? (hasLegacyDeliveryFields ? void 0 : { kind: "none" });
	if (asFiniteNumber(entry.updatedAt) !== void 0) {
		if (entry.delivery === delivery) return entry;
		return delivery ? {
			...entry,
			delivery
		} : entry;
	}
	const updatedAt = asFiniteNumber(entry.sessionStartedAt) ?? Date.now();
	return delivery ? {
		...entry,
		delivery,
		updatedAt
	} : {
		...entry,
		updatedAt
	};
}
//#endregion
export { normalizeSessionEntryTimestamp as n, parseSqliteSessionEntryRecord as r, hasValidSessionEntryIdentity as t };
