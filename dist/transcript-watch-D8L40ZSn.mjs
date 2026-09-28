import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./types-DgEaE0BK.mjs";
import { a as hasUnavailableMemoryResultInSessionRecord, i as hasTerminalUnavailableMemoryResultInSessionRecord, l as streamActiveMemoryTranscriptRecords, n as extractActiveMemorySearchDebugFromSessionRecord, o as hasUsableMemoryResultInSessionRecord, r as extractToolResultNameFromSessionRecord } from "./transcript-B36Eu2pe.mjs";
//#region extensions/active-memory/transcript-watch.ts
async function readMergedActiveMemoryTranscriptState(params) {
	let searchDebug;
	let hasUsableMemoryResult = false;
	let hasUnavailableMemorySearchResult = false;
	for (const source of params.sources) await streamActiveMemoryTranscriptRecords({
		source,
		onRecord: (record) => {
			searchDebug = extractActiveMemorySearchDebugFromSessionRecord(record) ?? searchDebug;
			hasUnavailableMemorySearchResult ||= hasUnavailableMemoryResultInSessionRecord(record, params.toolsAllow);
			hasUsableMemoryResult ||= hasUsableMemoryResultInSessionRecord(record, params.toolsAllow);
		}
	});
	return {
		searchDebug,
		hasUsableMemoryResult,
		hasUnavailableMemorySearchResult
	};
}
async function readTerminalMemorySearchResult(source, limits, toolsAllow) {
	const recallPathNames = new Set(toolsAllow?.map((toolName) => normalizeLowercaseStringOrEmpty(toolName)).filter((toolName) => toolName && toolName !== "memory_get"));
	if (recallPathNames.size === 0) return;
	const unavailablePathNames = /* @__PURE__ */ new Set();
	let hasUsableMemoryResult = false;
	let searchDebug;
	await streamActiveMemoryTranscriptRecords({
		source,
		limits,
		onRecord: (record) => {
			hasUsableMemoryResult ||= hasUsableMemoryResultInSessionRecord(record, toolsAllow);
			searchDebug = extractActiveMemorySearchDebugFromSessionRecord(record) ?? searchDebug;
			const toolName = extractToolResultNameFromSessionRecord(record);
			if (!toolName || !recallPathNames.has(toolName)) return false;
			if (hasTerminalUnavailableMemoryResultInSessionRecord(record, toolsAllow ?? [])) unavailablePathNames.add(toolName);
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
async function readTerminalMemorySearchResultFromSources(sources, limits, toolsAllow) {
	for (const source of sources) {
		const result = await readTerminalMemorySearchResult(source, limits, toolsAllow);
		if (result) return result;
	}
}
function watchTerminalMemorySearchResult(params) {
	let stopped = false;
	let timeoutId;
	let inFlight = false;
	let resolveWatch = () => {};
	const stop = () => {
		if (stopped) return;
		stopped = true;
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = void 0;
		}
		params.abortSignal.removeEventListener("abort", onAbort);
	};
	const finish = (result) => {
		stop();
		resolveWatch(result);
	};
	const schedule = () => {
		if (stopped) return;
		timeoutId = setTimeout(() => {
			tick();
		}, 25);
		timeoutId.unref?.();
	};
	const tick = async () => {
		if (stopped || inFlight) return;
		if (params.abortSignal.aborted) {
			stop();
			return;
		}
		inFlight = true;
		try {
			const result = await readTerminalMemorySearchResultFromSources(params.getTranscriptSources(), void 0, params.toolsAllow);
			if (stopped || params.abortSignal.aborted) return;
			if (result) {
				finish(result);
				return;
			}
		} catch {} finally {
			inFlight = false;
		}
		schedule();
	};
	function onAbort() {
		stop();
	}
	return {
		promise: new Promise((resolve) => {
			resolveWatch = resolve;
			params.abortSignal.addEventListener("abort", onAbort, { once: true });
			tick();
		}),
		stop
	};
}
//#endregion
export { watchTerminalMemorySearchResult as n, readMergedActiveMemoryTranscriptState as t };
