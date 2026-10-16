import { Fn as object, Jn as string, Lt as boolean, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
//#region src/config/sessions/activity-summary.ts
const ActivitySummarySchema = object({
	version: literal(1),
	formatRevision: number().int().positive().optional(),
	text: string().max(900),
	updatedAt: number().int().nonnegative(),
	sessionId: string().min(1),
	lifecycleRevision: string().optional(),
	generation: string().nullable(),
	maxSeq: number().int().nullable(),
	leafEntryId: string().nullable(),
	coveredMessages: number().int().nonnegative(),
	totalMessages: number().int().nonnegative(),
	omittedContent: boolean()
});
/** Unknown versions remain reconstructible cache misses, including after downgrade. */
function readSessionActivitySummary(entry) {
	const parsed = ActivitySummarySchema.safeParse(entry?.activitySummary);
	if (!parsed.success || parsed.data.sessionId !== entry?.sessionId || parsed.data.lifecycleRevision !== entry.lifecycleRevision || parsed.data.coveredMessages > parsed.data.totalMessages) return;
	return parsed.data;
}
//#endregion
export { readSessionActivitySummary as t };
