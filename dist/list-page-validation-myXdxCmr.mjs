import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
//#region src/cron/service/list-page-validation.ts
function isSafeNonNegativeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function readCanonicalCronListPage(value, maxLimit) {
	if (!isRecord(value) || !Array.isArray(value.jobs)) throw new Error("cron.list returned an invalid inventory page");
	const page = value;
	const jobs = value.jobs;
	const limit = typeof page.limit === "number" ? page.limit : 0;
	if (typeof page.snapshotRevision !== "string" || page.snapshotRevision.length === 0 || !isSafeNonNegativeInteger(page.total) || !isSafeNonNegativeInteger(page.offset) || !Number.isSafeInteger(limit) || limit < 1 || limit > maxLimit || jobs.length > limit || typeof page.hasMore !== "boolean" || page.nextOffset !== null && !isSafeNonNegativeInteger(page.nextOffset)) throw new Error("cron.list returned an invalid inventory page");
	return page;
}
function resolveCronListPageNextOffset(page, requestedOffset) {
	const nextOffset = requestedOffset + page.jobs.length;
	if (page.offset !== requestedOffset || !Number.isSafeInteger(nextOffset) || nextOffset > page.total || (page.hasMore ? page.nextOffset !== nextOffset || nextOffset <= requestedOffset || nextOffset >= page.total : page.nextOffset !== null || nextOffset !== page.total)) throw new Error("cron.list returned an invalid inventory page");
	return page.hasMore ? nextOffset : null;
}
//#endregion
export { resolveCronListPageNextOffset as n, readCanonicalCronListPage as t };
