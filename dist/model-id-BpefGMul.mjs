//#region extensions/xai/model-id.ts
function isXaiXhighModelId(id) {
	const normalized = normalizeXaiModelId(id.trim().toLowerCase());
	return normalized === "grok-4.7" || normalized === "grok-4.6";
}
function isXaiFrontierModelId(id) {
	const normalized = normalizeXaiModelId(id.trim().toLowerCase());
	return normalized === "grok-4.7" || normalized === "grok-4.6" || normalized === "grok-4.5" || normalized.startsWith("grok-4.5-");
}
function normalizeXaiModelId(id) {
	if (id === "grok-4.3-latest") return "grok-4.3";
	if (id === "grok-4.5-latest") return "grok-4.5";
	if (id === "grok-4.7-latest") return "grok-4.7";
	if (id === "grok-build-latest") return "grok-4.5";
	if (id === "grok-code-fast-1" || id === "grok-code-fast" || id === "grok-code-fast-1-0825") return "grok-build-0.1";
	if (id === "grok-4-fast-reasoning") return "grok-4-fast";
	if (id === "grok-4-1-fast-reasoning") return "grok-4-1-fast";
	return id;
}
//#endregion
export { isXaiXhighModelId as n, normalizeXaiModelId as r, isXaiFrontierModelId as t };
