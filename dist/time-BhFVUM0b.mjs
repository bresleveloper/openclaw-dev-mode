//#region extensions/memory-core/src/time.ts
function resolveMemoryCoreNowMs(nowMs) {
	const candidate = nowMs ?? NaN;
	return new Date(candidate).toJSON() === null ? Date.now() : candidate;
}
function resolveMemoryCoreTimestamp(nowMs) {
	const timestampMs = resolveMemoryCoreNowMs(nowMs);
	return new Date(timestampMs).toJSON() ?? (/* @__PURE__ */ new Date()).toISOString();
}
//#endregion
export { resolveMemoryCoreTimestamp as n, resolveMemoryCoreNowMs as t };
