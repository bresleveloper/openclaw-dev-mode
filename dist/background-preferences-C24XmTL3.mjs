import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
//#region packages/gateway-protocol/src/schema/background-preferences.ts
const USER_BACKGROUND_MAX_INPUT_BYTES = 8388608;
const USER_BACKGROUND_MAX_OUTPUT_BYTES = 2097152;
const USER_BACKGROUND_PREFERENCE_KEY = "ui.background";
const BACKGROUND_VISIBILITY_MIN = 0;
const BACKGROUND_VISIBILITY_MAX = 1;
const DEFAULT_BACKGROUND_PREFERENCE = {
	source: { kind: "theme" },
	showOnNewSession: true,
	showInSessions: true,
	visibility: .5
};
/** Opaque identifiers, never paths, URLs, CSS, or data URIs. */
function isBackgroundAssetId(value) {
	return typeof value === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(value);
}
function normalizeBackgroundPreference(value) {
	const record = asNullableRecord(value);
	const input = asNullableRecord(record?.source);
	if (!record || !input) return;
	let source;
	if (input.kind === "none" || input.kind === "theme") source = { kind: input.kind };
	else if (input.kind === "custom" && isBackgroundAssetId(input.assetId)) source = {
		kind: "custom",
		assetId: input.assetId
	};
	else return;
	const { presentation, showOnNewSession, showInSessions, visibility } = record;
	if (Object.hasOwn(record, "presentation") && presentation !== "faded" && presentation !== "full-bleed" || typeof showOnNewSession !== "boolean" || typeof showInSessions !== "boolean" || typeof visibility !== "number" || !Number.isFinite(visibility) || visibility < BACKGROUND_VISIBILITY_MIN || visibility > BACKGROUND_VISIBILITY_MAX) return;
	return {
		source,
		...presentation === "faded" || presentation === "full-bleed" ? { presentation } : {},
		showOnNewSession,
		showInSessions,
		visibility
	};
}
/** First upload opts in only on New Session; replacement retains placement choices. */
function selectBackgroundSource(source, previous) {
	return {
		...previous ?? DEFAULT_BACKGROUND_PREFERENCE,
		...!previous && source.kind === "custom" ? { showInSessions: false } : {},
		source
	};
}
//#endregion
export { normalizeBackgroundPreference as a, isBackgroundAssetId as i, USER_BACKGROUND_MAX_OUTPUT_BYTES as n, selectBackgroundSource as o, USER_BACKGROUND_PREFERENCE_KEY as r, USER_BACKGROUND_MAX_INPUT_BYTES as t };
