//#region src/cron/store/run-request-id.ts
const SCHEDULED_RUN_PREFIX = "cron-slot-v1.";
function createCronScheduledRunId(storeKey, jobId, scheduledSlotMs) {
	return SCHEDULED_RUN_PREFIX + Buffer.from(JSON.stringify([
		storeKey,
		jobId,
		scheduledSlotMs
	])).toString("base64url");
}
function parseCronScheduledRunId(receiptId) {
	if (!receiptId.startsWith(SCHEDULED_RUN_PREFIX)) return;
	try {
		const value = JSON.parse(Buffer.from(receiptId.slice(13), "base64url").toString("utf8"));
		if (Array.isArray(value) && value.length === 3 && typeof value[0] === "string" && typeof value[1] === "string" && typeof value[2] === "number" && Number.isSafeInteger(value[2])) return {
			storeKey: value[0],
			jobId: value[1],
			scheduledSlotMs: value[2]
		};
	} catch {}
}
//#endregion
export { parseCronScheduledRunId as n, createCronScheduledRunId as t };
