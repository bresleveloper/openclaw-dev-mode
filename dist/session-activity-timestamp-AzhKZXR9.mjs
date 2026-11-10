import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
//#region src/shared/session-activity-timestamp.ts
function sessionActivityTimestamp(row) {
	const lastActivityAt = asPositiveFiniteNumber(row.lastActivityAt);
	const lastInteractionAt = asPositiveFiniteNumber(row.lastInteractionAt);
	if (lastActivityAt !== void 0 || lastInteractionAt !== void 0) return Math.max(lastActivityAt ?? 0, lastInteractionAt ?? 0);
	return asPositiveFiniteNumber(row.updatedAt) ?? asPositiveFiniteNumber(row.createdAt) ?? 0;
}
//#endregion
export { sessionActivityTimestamp as t };
