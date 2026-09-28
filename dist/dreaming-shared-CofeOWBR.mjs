import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/memory-core/src/dreaming-shared.ts
function formatRecallRepairDetails(repair) {
	const removedOverflowEntries = repair.removedOverflowEntries ?? 0;
	return [
		repair.removedInvalidEntries > 0 ? `-${repair.removedInvalidEntries} invalid` : null,
		(repair.removedDanglingEntries ?? 0) > 0 ? `-${repair.removedDanglingEntries} dangling` : null,
		removedOverflowEntries > 0 ? `-${removedOverflowEntries} overflow` : null
	].filter(Boolean).join(", ");
}
function includesSystemEventToken(cleanedBody, eventText) {
	const normalizedBody = normalizeOptionalString(cleanedBody);
	const normalizedEventText = normalizeOptionalString(eventText);
	if (!normalizedBody || !normalizedEventText) return false;
	if (normalizedBody === normalizedEventText) return true;
	return normalizedBody.split(/\r?\n/).some((line) => {
		const trimmed = line.trim();
		if (trimmed === normalizedEventText) return true;
		return trimmed.replace(/^\[cron:[^\]]+\]\s*/, "") === normalizedEventText;
	});
}
//#endregion
export { includesSystemEventToken as n, formatRecallRepairDetails as t };
