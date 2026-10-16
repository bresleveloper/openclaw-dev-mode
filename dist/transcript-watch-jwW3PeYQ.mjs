import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./concurrency-runtime-BTIJsexF.mjs";
import "./types-DgEaE0BK.mjs";
import { i as streamActiveMemoryTranscriptRecords, n as readMemoryResultFromSessionRecord } from "./transcript-B8-8Q4Rd.mjs";
//#region extensions/active-memory/transcript-watch.ts
async function readMergedActiveMemoryTranscriptState(params) {
	let searchDebug;
	let hasUsableMemoryResult = false;
	let hasUnavailableMemorySearchResult = false;
	for (const source of params.sources) await streamActiveMemoryTranscriptRecords({
		source,
		onRecord: (record) => {
			const result = readMemoryResultFromSessionRecord(record, params.toolsAllow);
			searchDebug = result.searchDebug ?? searchDebug;
			hasUnavailableMemorySearchResult ||= result.hasUnavailableMemorySearchResult;
			hasUsableMemoryResult ||= result.hasUsableMemoryResult;
		}
	});
	return {
		searchDebug,
		hasUsableMemoryResult,
		hasUnavailableMemorySearchResult
	};
}
async function readTerminalMemorySearchResult(source, toolsAllow) {
	const recallPathNames = new Set(toolsAllow.map((toolName) => normalizeLowercaseStringOrEmpty(toolName)).filter((toolName) => toolName && toolName !== "memory_get"));
	if (recallPathNames.size === 0) return;
	const unavailablePathNames = /* @__PURE__ */ new Set();
	let hasUsableMemoryResult = false;
	let searchDebug;
	await streamActiveMemoryTranscriptRecords({
		source,
		onRecord: (record) => {
			const result = readMemoryResultFromSessionRecord(record, toolsAllow);
			hasUsableMemoryResult ||= result.hasUsableMemoryResult;
			searchDebug = result.searchDebug ?? searchDebug;
			const toolName = result.toolName;
			if (!toolName || !recallPathNames.has(toolName)) return false;
			if (result.terminalUnavailable) unavailablePathNames.add(toolName);
			else unavailablePathNames.delete(toolName);
			return false;
		}
	});
	if (unavailablePathNames.size !== recallPathNames.size) return;
	return {
		status: "unavailable",
		hasUsableMemoryResult,
		searchDebug
	};
}
async function readTerminalMemorySearchResultFromSources(sources, toolsAllow) {
	for (const source of sources) {
		const result = await readTerminalMemorySearchResult(source, toolsAllow);
		if (result) return result;
	}
}
function watchTerminalMemorySearchResult(params) {
	let stopped = false;
	let timeoutId;
	const { promise, resolve: resolveWatch } = createDeferredCore();
	const stop = () => {
		if (stopped) return;
		stopped = true;
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = void 0;
		}
		params.abortSignal.removeEventListener("abort", stop);
	};
	const tick = async () => {
		if (stopped) return;
		if (params.abortSignal.aborted) {
			stop();
			return;
		}
		try {
			const result = await readTerminalMemorySearchResultFromSources(params.getTranscriptSources(), params.toolsAllow);
			if (stopped || params.abortSignal.aborted) return;
			if (result) {
				stop();
				resolveWatch(result);
				return;
			}
		} catch {}
		if (!stopped) {
			timeoutId = setTimeout(() => {
				tick();
			}, 25);
			timeoutId.unref?.();
		}
	};
	params.abortSignal.addEventListener("abort", stop, { once: true });
	tick();
	return {
		promise,
		stop
	};
}
//#endregion
export { watchTerminalMemorySearchResult as n, readMergedActiveMemoryTranscriptState as t };
