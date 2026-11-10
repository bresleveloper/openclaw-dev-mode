import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./payload-limits-ChDi8AHf.mjs";
//#region src/config/sessions/session-pending-input-value.ts
function parseSessionPendingInputMessage(messageJson) {
	const value = JSON.parse(messageJson);
	if (asOptionalRecord(value)?.role !== "user") throw new Error("Pending input has an invalid persisted user message");
	return value;
}
function isFinalInputCompletion(outcome) {
	return outcome.reason === "completed" || outcome.reason === "cancelled" && outcome.stopReason !== "restart";
}
function projectSessionPendingInput(row) {
	if (row.state !== "queued" && row.state !== "interrupted" && row.state !== "cancelled") throw new Error("Pending input has an invalid disposition");
	return {
		id: row.input_id,
		runId: row.run_id,
		message: parseSessionPendingInputMessage(row.message_json),
		acceptedAt: row.accepted_at,
		state: row.state
	};
}
function resolvePendingInputHistoryLimit(limit) {
	return Math.max(1, Math.min(20, Math.trunc(limit ?? 20)));
}
/** Select by stored byte sizes before either backend copies accepted message payloads. */
function selectPendingInputHistoryPage(metadata, limit) {
	const selected = [];
	let bytes = 0;
	for (const row of metadata) {
		if (selected.length === limit || bytes + row.serialized_bytes > 26214400) break;
		selected.push(row.seq);
		bytes += row.serialized_bytes;
	}
	if (metadata.length && !selected.length) throw new Error("Stored pending input exceeds the Gateway payload limit");
	return {
		selected,
		nextBefore: selected.length < metadata.length ? selected.at(-1) : void 0
	};
}
function normalizePendingInputReceiptRunIds(runIds) {
	if (runIds.length > 50) throw new Error("Pending input receipt lookup accepts at most 50 run IDs");
	return [...new Set(runIds)];
}
function projectPendingInputReceipts(rows) {
	if (rows.length > 50 || new Set(rows.map((row) => row.run_id)).size !== rows.length) throw new Error("Pending input receipt lookup has ambiguous source run IDs");
	return rows.map((row) => row.consumed_event_id == null ? row.state === "cancelled" ? {
		runId: row.run_id,
		state: "pending",
		cancelled: true
	} : {
		runId: row.run_id,
		state: "pending"
	} : {
		runId: row.run_id,
		state: "consumed",
		consumedByEventId: row.consumed_event_id
	});
}
//#endregion
export { projectSessionPendingInput as a, projectPendingInputReceipts as i, normalizePendingInputReceiptRunIds as n, resolvePendingInputHistoryLimit as o, parseSessionPendingInputMessage as r, selectPendingInputHistoryPage as s, isFinalInputCompletion as t };
