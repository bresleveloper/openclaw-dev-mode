import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { b as uniqueValues } from "./string-normalization-D6DKCpwE.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { B as compareCronRunRecordsNewestFirst, J as isCronDeliveryStatus, U as cronRunRecordStoreKey, W as cronRunRecordToRunLogEntry, Y as isCronRunStatus } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import "./session-key-CSDERtm3.mjs";
//#region src/cron/run-link.ts
const CRON_EXECUTION_ID_RE = /^cron:(.+):(\d+)$/u;
/**
* Notifications link runs by execution id (`cron:<jobId>:<startedAtMs>`), while
* ledger entries carry public run ids (receipt UUIDs, `manual:<...>` ids) that
* never equal it. Forwarded cron messages link by transcript session id. Match
* either exact id first, then the entry's recorded run start.
*/
function cronRunEntryMatchesLink(linkedRunId, entry) {
	if (entry.runId === linkedRunId || entry.sessionId === linkedRunId) return true;
	const match = CRON_EXECUTION_ID_RE.exec(linkedRunId);
	return match !== null && match[1] === entry.jobId && entry.runAtMs === Number(match[2]);
}
//#endregion
//#region src/cron/run-history.ts
/** Cron run-history reads backed by authoritative cron-owned history rows. */
const INVALID_CRON_RUN_JOB_ID_MESSAGE = "invalid cron run job id";
function normalizeCronRunJobId(jobId) {
	const trimmed = jobId.trim();
	if (!trimmed || trimmed.includes("/") || trimmed.includes("\\") || trimmed.includes("\0")) throw new Error(INVALID_CRON_RUN_JOB_ID_MESSAGE);
	return trimmed;
}
function isInvalidCronRunJobIdError(error) {
	return error instanceof Error && error.message === INVALID_CRON_RUN_JOB_ID_MESSAGE;
}
function normalizeStatusFilter(values, fallback, predicate) {
	if (values?.length) {
		const validValues = values.filter(predicate);
		if (validValues.length > 0) return uniqueValues(validValues);
	}
	return predicate(fallback) ? [fallback] : null;
}
function queryText(entry, jobNameById) {
	return [
		entry.summary ?? "",
		entry.error ?? "",
		entry.deliveryError ?? "",
		entry.errorReason ?? "",
		entry.diagnostics?.summary ?? "",
		...(entry.diagnostics?.entries ?? []).map((diagnostic) => diagnostic.message),
		entry.jobId,
		jobNameById?.[entry.jobId] ?? "",
		entry.delivery?.intended?.channel ?? "",
		entry.delivery?.resolved?.channel ?? "",
		...(entry.delivery?.messageToolSentTo ?? []).map((target) => target.channel)
	].join(" ");
}
function attachJobNames(entries, jobNameById) {
	for (const entry of entries) {
		const jobName = jobNameById?.[entry.jobId];
		if (jobName) entry.jobName = jobName;
	}
}
function projectCronRunHistoryPage(records, options) {
	const jobId = options.jobId ? normalizeCronRunJobId(options.jobId) : void 0;
	const limit = Math.max(1, Math.min(200, Math.floor(options.limit ?? 50)));
	const offset = Math.max(0, Math.floor(options.offset ?? 0));
	const statuses = normalizeStatusFilter(options.statuses, options.status, isCronRunStatus);
	const deliveryStatuses = normalizeStatusFilter(options.deliveryStatuses, options.deliveryStatus, isCronDeliveryStatus);
	const runId = normalizeOptionalString(options.runId);
	const agentId = options.agentId ? normalizeAgentId(options.agentId) : void 0;
	const query = normalizeLowercaseStringOrEmpty(options.query);
	const sortMultiplier = options.sortDir === "asc" ? -1 : 1;
	let rows = records.filter((record) => (!jobId || record.jobId === jobId) && cronRunRecordStoreKey(record) === options.storeKey).filter((record) => !agentId || record.agentId === agentId).map((record) => ({
		record,
		entry: cronRunRecordToRunLogEntry(record)
	})).filter((row) => row.entry !== null);
	if (runId) {
		const exact = rows.filter(({ entry }) => entry.runId === runId);
		const aliases = exact.length ? [] : rows.filter(({ entry }) => cronRunEntryMatchesLink(runId, entry));
		rows = exact.length ? exact : aliases.length === 1 ? aliases : [];
	}
	rows = rows.filter(({ entry }) => {
		if (statuses && (!entry.status || !statuses.includes(entry.status))) return false;
		if (deliveryStatuses && !deliveryStatuses.includes(entry.deliveryStatus ?? "not-requested")) return false;
		return (!query || normalizeLowercaseStringOrEmpty(queryText(entry, options.jobNameById)).includes(query)) && (!options.entryFilter || options.entryFilter(entry));
	}).toSorted((left, right) => sortMultiplier * compareCronRunRecordsNewestFirst(left.record, right.record));
	const total = rows.length;
	const boundedOffset = Math.min(total, offset);
	const entries = rows.slice(boundedOffset, boundedOffset + limit).map(({ entry }) => entry);
	attachJobNames(entries, options.jobNameById);
	const nextOffset = boundedOffset + entries.length;
	return {
		entries,
		total,
		offset: boundedOffset,
		limit,
		hasMore: nextOffset < total,
		nextOffset: nextOffset < total ? nextOffset : null
	};
}
//#endregion
export { normalizeCronRunJobId as n, projectCronRunHistoryPage as r, isInvalidCronRunJobIdError as t };
