//#region src/agents/embedded-agent-runner/run/prompt-image-metadata.ts
function readPersistedImageBlockFactIndexes(message) {
	const meta = Reflect.get(message, "__openclaw");
	const value = meta && typeof meta === "object" && !Array.isArray(meta) ? meta.mediaImageBlockFactIndexes : void 0;
	if (!Array.isArray(value)) return;
	return value.map((entry) => typeof entry === "number" && Number.isSafeInteger(entry) && entry >= 0 ? entry : null);
}
function readPersistedMediaImageLayout(message) {
	const meta = Reflect.get(message, "__openclaw");
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
	const layout = meta.mediaImageLayout;
	if (!layout || typeof layout !== "object" || Array.isArray(layout)) return;
	const record = layout;
	const slots = Array.isArray(record.slots) ? record.slots.flatMap((entry) => {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
		const slot = entry;
		if (slot.kind !== "inline" && slot.kind !== "offloaded") return [];
		const kind = slot.kind;
		const factIndex = slot.factIndex;
		return [{
			kind,
			...typeof factIndex === "number" && Number.isSafeInteger(factIndex) && factIndex >= 0 ? { factIndex } : {}
		}];
	}) : [];
	const suppressedFactIndexes = Array.isArray(record.suppressedFactIndexes) ? record.suppressedFactIndexes.filter((entry) => typeof entry === "number" && Number.isSafeInteger(entry) && entry >= 0) : [];
	return slots.length > 0 || suppressedFactIndexes.length > 0 ? {
		slots,
		suppressedFactIndexes
	} : void 0;
}
//#endregion
export { readPersistedMediaImageLayout as n, readPersistedImageBlockFactIndexes as t };
