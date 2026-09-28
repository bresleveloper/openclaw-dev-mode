import { r as registerMemoryHostEvent, t as listStoredMemoryHostEvents } from "./event-store-BSL5gH7W.mjs";
import path from "node:path";
//#region src/memory-host-sdk/events.ts
/** Legacy workspace JSONL path retained only for doctor migration discovery. */
const MEMORY_HOST_EVENT_LOG_RELATIVE_PATH = path.join("memory", ".dreams", "events.jsonl");
/** Resolve the retired JSONL source path without reading it at runtime. */
function resolveMemoryHostEventLogPath(workspaceDir) {
	return path.join(workspaceDir, MEMORY_HOST_EVENT_LOG_RELATIVE_PATH);
}
/** Append one memory host event to shared SQLite plugin state. */
async function appendMemoryHostEvent(workspaceDir, event, options = {}) {
	await registerMemoryHostEvent({
		workspaceDir,
		event,
		...options.env ? { env: options.env } : {}
	});
}
async function readMemoryHostEventRecordsRaw(params) {
	return applyMemoryHostEventLimit((await listStoredMemoryHostEvents(params)).map((entry) => entry.value.event), params.limit);
}
function applyMemoryHostEventLimit(events, limit) {
	if (!Number.isFinite(limit)) return events;
	const normalizedLimit = Math.max(0, Math.floor(limit));
	return normalizedLimit === 0 ? [] : events.slice(-normalizedLimit);
}
/** Read recent memory host events, excluding opt-in diagnostic variants. */
async function readMemoryHostEvents(params) {
	return applyMemoryHostEventLimit((await readMemoryHostEventRecordsRaw({
		workspaceDir: params.workspaceDir,
		...params.env ? { env: params.env } : {}
	})).filter((event) => event.type !== "memory.recall.skipped"), params.limit);
}
/** Read recent memory host event records, including opt-in diagnostic variants. */
async function readMemoryHostEventRecords(params) {
	return await readMemoryHostEventRecordsRaw(params);
}
//#endregion
export { resolveMemoryHostEventLogPath as i, readMemoryHostEventRecords as n, readMemoryHostEvents as r, appendMemoryHostEvent as t };
