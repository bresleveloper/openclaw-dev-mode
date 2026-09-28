import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import "./types-DgEaE0BK.mjs";
import { i as extractTextContent } from "./query-OBXHW90K.mjs";
import { a as normalizeActiveSummary, u as truncateSummary } from "./prompt-CxzFbTjp.mjs";
import { a as hasUnavailableMemoryResultInSessionRecord, c as resolveTranscriptReadLimits, l as streamActiveMemoryTranscriptRecords, o as hasUsableMemoryResultInSessionRecord, s as isUnavailableMemorySearchDebug } from "./transcript-B36Eu2pe.mjs";
import { t as readMergedActiveMemoryTranscriptState } from "./transcript-watch-D8L40ZSn.mjs";
//#region extensions/active-memory/transcript-result.ts
let timeoutPartialDataGraceMs = 500;
function readMemoryToolResultEvidence(params) {
	const result = asOptionalRecord(params.result);
	const rawContent = result?.content;
	const textContent = normalizeOptionalString(result?.detailedContent) ?? (typeof rawContent === "string" ? normalizeOptionalString(rawContent) : void 0);
	const record = { message: {
		role: "toolResult",
		toolName: params.toolName,
		isError: params.isError,
		content: Array.isArray(rawContent) ? rawContent : textContent ? [{
			type: "text",
			text: textContent
		}] : [],
		details: result?.details
	} };
	return {
		hasUsableMemoryResult: hasUsableMemoryResultInSessionRecord(record, params.toolsAllow),
		hasUnavailableMemorySearchResult: hasUnavailableMemoryResultInSessionRecord(record, params.toolsAllow)
	};
}
function extractAssistantTextFromSessionRecord(value) {
	const record = asOptionalRecord(value);
	if (!record) return "";
	const nestedMessage = asOptionalRecord(record.message);
	const topLevelMessage = normalizeOptionalString(record.role) === "assistant" ? record : void 0;
	const message = nestedMessage ?? topLevelMessage;
	if (!message || normalizeOptionalString(message.role) !== "assistant") return "";
	return extractTextContent(message.content).trim();
}
async function readPartialAssistantText(source, limits) {
	const texts = [];
	const resolvedLimits = resolveTranscriptReadLimits(limits);
	let collectedChars = 0;
	await streamActiveMemoryTranscriptRecords({
		source,
		limits: resolvedLimits,
		onRecord: (record) => {
			const text = extractAssistantTextFromSessionRecord(record);
			if (text) {
				const separatorChars = texts.length > 0 ? 1 : 0;
				const remaining = resolvedLimits.maxChars - collectedChars - separatorChars;
				if (remaining <= 0) return true;
				const nextText = truncateUtf16Safe(text, remaining);
				if (!nextText) return true;
				texts.push(nextText);
				collectedChars += separatorChars + nextText.length;
				return nextText.length < text.length || collectedChars >= resolvedLimits.maxChars;
			}
			return false;
		}
	});
	return texts.join("\n").trim() || null;
}
async function readPartialAssistantTextFromSources(sources, limits) {
	for (const source of sources) {
		const text = await readPartialAssistantText(source, limits);
		if (text) return text;
	}
	return null;
}
function attachPartialTimeoutData(error, data) {
	if (!error || typeof error !== "object") return;
	const target = error;
	target.activeMemoryPartialData = {
		...target.activeMemoryPartialData,
		...data
	};
}
function readPartialTimeoutData(error) {
	if (!error || typeof error !== "object") return {};
	return error.activeMemoryPartialData ?? {};
}
async function waitForSubagentPartialTimeoutData(subagentPromise) {
	if (!subagentPromise) return { settled: true };
	let timeoutId;
	const timeoutPromise = new Promise((resolve) => {
		timeoutId = setTimeout(() => resolve({ settled: false }), timeoutPartialDataGraceMs);
		timeoutId.unref?.();
	});
	try {
		return await Promise.race([subagentPromise.then((result) => ({
			...result,
			settled: true
		}), (error) => ({
			...readPartialTimeoutData(error),
			settled: true
		})), timeoutPromise]);
	} finally {
		if (timeoutId) clearTimeout(timeoutId);
	}
}
function normalizeGroundedSummary(rawReply, maxSummaryChars, hasUsableMemoryResult) {
	const summary = hasUsableMemoryResult ? normalizeActiveSummary(rawReply) : null;
	return summary ? truncateSummary(summary, maxSummaryChars) : null;
}
async function buildTimeoutRecallResult(params) {
	const subagentPartialData = params.rawReply ? { settled: true } : await waitForSubagentPartialTimeoutData(params.subagentPromise);
	const rawReply = params.rawReply ?? subagentPartialData.rawReply ?? await readPartialAssistantTextFromSources(params.transcriptSources);
	const transcriptState = params.transcriptSources.length > 0 ? await readMergedActiveMemoryTranscriptState({
		sources: params.transcriptSources,
		toolsAllow: params.toolsAllow
	}) : void 0;
	const searchDebug = params.searchDebug ?? subagentPartialData.searchDebug ?? transcriptState?.searchDebug;
	const summary = normalizeGroundedSummary(rawReply ?? "", params.maxSummaryChars, params.hasUsableMemoryResult === true || subagentPartialData.hasUsableMemoryResult === true || transcriptState?.hasUsableMemoryResult === true);
	if (summary === null || params.resultStatus === "failed" || subagentPartialData.resultStatus === "failed" || params.cleanupFailed || subagentPartialData.cleanupFailed || isUnavailableMemorySearchDebug(searchDebug) || !subagentPartialData.settled || params.hasUnavailableMemorySearchResult || subagentPartialData.hasUnavailableMemorySearchResult || transcriptState?.hasUnavailableMemorySearchResult) return {
		status: "timeout",
		elapsedMs: params.elapsedMs,
		summary: null,
		searchDebug
	};
	return {
		status: "timeout_partial",
		elapsedMs: params.elapsedMs,
		summary,
		searchDebug
	};
}
function buildSubagentRecallResult(params) {
	const { rawReply, resultStatus } = params.subagentResult;
	const searchDebug = params.subagentResult.searchDebug ?? params.fallbackSearchDebug;
	const hasUsableMemoryResult = params.subagentResult.hasUsableMemoryResult === true || params.fallbackHasUsableMemoryResult === true;
	const summary = normalizeGroundedSummary(rawReply, params.maxSummaryChars, hasUsableMemoryResult);
	if (resultStatus !== "failed" && summary !== null) return {
		status: "ok",
		elapsedMs: params.elapsedMs,
		rawReply,
		summary,
		searchDebug
	};
	return {
		status: resultStatus === "failed" ? "failed" : resultStatus === "unavailable" || isUnavailableMemorySearchDebug(searchDebug) || params.subagentResult.hasUnavailableMemorySearchResult === true ? "unavailable" : "no_relevant_memory",
		elapsedMs: params.elapsedMs,
		summary: null,
		searchDebug
	};
}
function resetActiveMemoryTranscriptForTests() {
	timeoutPartialDataGraceMs = 500;
}
function setTimeoutPartialDataGraceMsForTests(value) {
	timeoutPartialDataGraceMs = Math.max(0, Math.floor(value));
}
//#endregion
export { readPartialAssistantText as a, resetActiveMemoryTranscriptForTests as c, readMemoryToolResultEvidence as i, setTimeoutPartialDataGraceMsForTests as l, buildSubagentRecallResult as n, readPartialAssistantTextFromSources as o, buildTimeoutRecallResult as r, readPartialTimeoutData as s, attachPartialTimeoutData as t };
