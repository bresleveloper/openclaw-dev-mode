//#region src/plugins/host-hooks.ts
function normalizePluginHostHookId(value) {
	return (value ?? "").trim();
}
function normalizeQueuedInjectionText(entry, placement) {
	const candidate = entry;
	if (candidate.placement !== placement || typeof candidate.text !== "string") return;
	return candidate.text.trim() || void 0;
}
function buildPluginAgentTurnPrepareContext(params) {
	const prepend = params.queuedInjections.map((entry) => normalizeQueuedInjectionText(entry, "prepend_context")).filter(Boolean);
	const append = params.queuedInjections.map((entry) => normalizeQueuedInjectionText(entry, "append_context")).filter(Boolean);
	return {
		...prepend.length > 0 ? { prependContext: prepend.join("\n\n") } : {},
		...append.length > 0 ? { appendContext: append.join("\n\n") } : {}
	};
}
function normalizeHostHookString(value) {
	return typeof value === "string" ? normalizePluginHostHookId(value) : "";
}
function normalizeOptionalHostHookString(value) {
	if (value === void 0) return;
	if (typeof value !== "string") return "";
	return value.trim();
}
function normalizeHostHookStringList(value) {
	if (value === void 0) return;
	if (!Array.isArray(value)) return null;
	const normalized = [];
	for (const item of value) {
		const text = normalizeOptionalHostHookString(item);
		if (!text) return null;
		normalized.push(text);
	}
	return normalized;
}
//#endregion
export { normalizePluginHostHookId as a, normalizeOptionalHostHookString as i, normalizeHostHookString as n, normalizeHostHookStringList as r, buildPluginAgentTurnPrepareContext as t };
