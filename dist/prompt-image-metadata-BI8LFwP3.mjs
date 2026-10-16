import { f as asSafeIntegerInRange } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/agents/embedded-agent-runner/run/prompt-image-metadata.ts
function readPersistedImageBlockFactIndexes(message) {
	const value = asOptionalRecord(Reflect.get(message, "__openclaw"))?.mediaImageBlockFactIndexes;
	if (!Array.isArray(value)) return;
	return value.map((entry) => asSafeIntegerInRange(entry, { min: 0 }) ?? null);
}
function readPersistedMediaImageLayout(message) {
	const record = asOptionalRecord(asOptionalRecord(Reflect.get(message, "__openclaw"))?.mediaImageLayout);
	if (!record) return;
	const slots = Array.isArray(record.slots) ? record.slots.flatMap((entry) => {
		const slot = asOptionalRecord(entry);
		if (slot?.kind !== "inline" && slot?.kind !== "offloaded") return [];
		const kind = slot.kind;
		const factIndex = asSafeIntegerInRange(slot.factIndex, { min: 0 });
		return [{
			kind,
			...factIndex !== void 0 ? { factIndex } : {}
		}];
	}) : [];
	const suppressedFactIndexes = Array.isArray(record.suppressedFactIndexes) ? record.suppressedFactIndexes.filter((entry) => asSafeIntegerInRange(entry, { min: 0 }) !== void 0) : [];
	return slots.length > 0 || suppressedFactIndexes.length > 0 ? {
		slots,
		suppressedFactIndexes
	} : void 0;
}
//#endregion
export { readPersistedMediaImageLayout as n, readPersistedImageBlockFactIndexes as t };
