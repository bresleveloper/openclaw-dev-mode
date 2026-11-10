import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import { i as rethrowIncognitoSessionError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./retry-runtime-CUY_Gz8_.mjs";
import "./session-store-runtime-DVNFhqCK.mjs";
import "./concurrency-runtime-Eh-iOyQU.mjs";
import "./types-DgEaE0BK.mjs";
import { i as streamActiveMemoryTranscriptRecords, n as readMemoryResultFromSessionRecord } from "./transcript-DQm3XeOf.mjs";
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
	const controller = new AbortController();
	const signal = AbortSignal.any([controller.signal, params.abortSignal]);
	const { promise, resolve: resolveWatch, reject: rejectWatch } = createDeferredCore();
	const stop = () => controller.abort();
	const poll = async () => {
		while (!signal.aborted) {
			try {
				const result = await readTerminalMemorySearchResultFromSources(params.getTranscriptSources(), params.toolsAllow);
				if (signal.aborted) return;
				if (result) {
					stop();
					resolveWatch(result);
					return;
				}
			} catch (error) {
				rethrowIncognitoSessionError(error);
			}
			await sleepWithAbort(25, signal, { ref: false }).catch(() => void 0);
		}
	};
	poll().catch(rejectWatch);
	return {
		promise,
		stop
	};
}
//#endregion
export { watchTerminalMemorySearchResult as n, readMergedActiveMemoryTranscriptState as t };
