//#region extensions/memory-core/src/session-backfill-selection.ts
const DEFAULT_SESSION_BACKFILL_LIMIT_DAYS = 92;
const MEMORY_DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
function normalizeMemoryDay(value, flag) {
	if (value === void 0) return;
	const day = value.trim();
	if (!MEMORY_DAY_RE.test(day)) throw new Error(`${flag} must use YYYY-MM-DD.`);
	const parsed = /* @__PURE__ */ new Date(`${day}T00:00:00.000Z`);
	if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== day) throw new Error(`${flag} must be a valid calendar day.`);
	return day;
}
function normalizeSessionBackfillSelection(params, labels = {
	from: "--from",
	to: "--to",
	limitDays: "--limit-days"
}) {
	const from = normalizeMemoryDay(params.from, labels.from);
	const to = normalizeMemoryDay(params.to, labels.to);
	if (from !== void 0 && to !== void 0 && from > to) throw new Error(`${labels.from} must not be after ${labels.to}.`);
	const limitDays = params.limitDays ?? DEFAULT_SESSION_BACKFILL_LIMIT_DAYS;
	if (!Number.isInteger(limitDays) || limitDays <= 0) throw new Error(`${labels.limitDays} must be a positive integer.`);
	return {
		...from !== void 0 ? { from } : {},
		...to !== void 0 ? { to } : {},
		limitDays
	};
}
//#endregion
export { normalizeSessionBackfillSelection as t };
