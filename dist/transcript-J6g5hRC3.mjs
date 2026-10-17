import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { j as resolveIntegerOption, s as asFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { m as tryParseJson } from "./utils-DgZn2dLu.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { l as readSessionTranscriptRawDelta } from "./session-transcript-runtime-tIU02hJq.mjs";
import "./concurrency-runtime-BTIJsexF.mjs";
import { A as DEFAULT_TRANSCRIPT_READ_MAX_BYTES, N as LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW, f as DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW, j as DEFAULT_TRANSCRIPT_READ_MAX_LINES, x as DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS } from "./types-DgEaE0BK.mjs";
import { i as extractTextContent } from "./query-BSMExMts.mjs";
import { a as readExplicitMemoryEvidence, c as readStructuredMemoryFailureFromContent, o as readStructuredMemoryEvidenceFromContent, s as readStructuredMemoryFailure } from "./prompt-DM3fsjGv.mjs";
//#region extensions/active-memory/transcript.ts
function resolveTranscriptReadLimits(limits) {
	return {
		maxChars: resolveIntegerOption(limits?.maxChars, DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS, {
			min: 1,
			max: DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS
		}),
		maxLines: resolveIntegerOption(limits?.maxLines, DEFAULT_TRANSCRIPT_READ_MAX_LINES, {
			min: 1,
			max: DEFAULT_TRANSCRIPT_READ_MAX_LINES
		}),
		maxBytes: resolveIntegerOption(limits?.maxBytes, DEFAULT_TRANSCRIPT_READ_MAX_BYTES, {
			min: 1,
			max: DEFAULT_TRANSCRIPT_READ_MAX_BYTES
		})
	};
}
async function streamActiveMemoryTranscriptRecords(params) {
	const limits = resolveTranscriptReadLimits(params.limits);
	let page;
	try {
		page = await readSessionTranscriptRawDelta({
			...params.source,
			maxBytes: limits.maxBytes,
			maxEvents: limits.maxLines
		});
	} catch {
		return;
	}
	if (page.kind !== "page") return;
	for (const { event } of page.events) try {
		if (params.onRecord(event)) break;
	} catch {}
}
function resolveToolResultMessage(value) {
	const record = asOptionalRecord(value);
	const message = asOptionalRecord(record?.message) ?? (record?.role === "toolResult" ? record : void 0);
	return message && normalizeOptionalString(message.role) === "toolResult" ? message : void 0;
}
function extractActiveMemorySearchDebug(details) {
	const debug = asOptionalRecord(details?.debug);
	const warning = normalizeOptionalString(details?.warning);
	const action = normalizeOptionalString(details?.action);
	const error = normalizeOptionalString(details?.error);
	if (!debug && !warning && !action && !error) return;
	return {
		backend: normalizeOptionalString(debug?.backend),
		configuredMode: normalizeOptionalString(debug?.configuredMode),
		effectiveMode: normalizeOptionalString(debug?.effectiveMode),
		fallback: normalizeOptionalString(debug?.fallback),
		searchMs: asFiniteNumber(debug?.searchMs),
		hits: asFiniteNumber(debug?.hits),
		warning,
		action,
		error
	};
}
function readMemoryResultFromSessionRecord(value, toolsAllow = [...DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW, ...LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW]) {
	const message = resolveToolResultMessage(value);
	const toolName = normalizeLowercaseStringOrEmpty(message?.toolName);
	const details = asOptionalRecord(message?.details);
	const isSearch = toolName === "memory_search" || toolName === "memory_recall";
	const searchDebug = isSearch ? extractActiveMemorySearchDebug(details) : void 0;
	const allowed = Boolean(toolName && toolsAllow.includes(toolName));
	const hasUnavailableMemorySearchResult = allowed && (message?.isError === true || readStructuredMemoryFailure(details) === true || readStructuredMemoryFailureFromContent(message?.content) === true);
	const status = normalizeOptionalString(details?.status)?.toLowerCase().replace(/[\s-]+/g, "_");
	const terminalUnavailable = allowed && (details?.disabled === true || details?.unavailable === true || status === "disabled" || status === "unavailable" || isSearch && (Boolean(searchDebug?.error) || Boolean(details?.error)));
	return {
		toolName,
		searchDebug,
		hasUnavailableMemorySearchResult,
		hasUsableMemoryResult: allowed && !hasUnavailableMemorySearchResult && hasUsableMemoryResult(toolName, details, message?.content),
		terminalUnavailable
	};
}
function createActiveMemoryHookDeadline() {
	const timeoutSentinel = Symbol("active-memory-hook-timeout");
	let timeoutId;
	let deadlineAt = 0;
	const { promise, resolve: resolveTimeout } = createDeferredCore();
	const stop = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = void 0;
		}
	};
	const arm = (timeoutMs, onTimeout) => {
		stop();
		deadlineAt = performance.now() + timeoutMs;
		timeoutId = setTimeout(() => {
			onTimeout();
			resolveTimeout(timeoutSentinel);
		}, timeoutMs);
		timeoutId.unref?.();
	};
	const remainingMs = () => timeoutId ? Math.max(0, Math.floor(deadlineAt - performance.now())) : 0;
	return {
		arm,
		promise,
		remainingMs,
		stop
	};
}
function hasExpandedSummary(details) {
	return asPositiveFiniteNumber(details?.expandedSummaryCount) !== void 0 && Boolean(normalizeOptionalString(details?.answer));
}
function hasUsableMemoryResult(toolName, details, rawContent) {
	const content = extractTextContent(rawContent);
	if (toolName === "memory_search") {
		if (Array.isArray(details?.results)) return details.results.length > 0;
		return /"results"\s*:\s*\[\s*([^\s\]])/.test(content);
	}
	if (toolName === "memory_recall") {
		if (Array.isArray(details?.memories)) return details.memories.length > 0;
		return /^Found [1-9]\d* memories:/.test(content);
	}
	if (toolName === "memory_get") {
		const text = normalizeOptionalString(details?.text);
		return text !== void 0 ? text.length > 0 : /"text"\s*:\s*"(?!")/.test(content);
	}
	if (toolName === "lcm_grep") {
		if (asPositiveFiniteNumber(details?.totalMatches) !== void 0) return true;
		return /^## LCM Grep Results[\s\S]*^\*\*Total matches:\*\*\s+[1-9]\d*$/m.test(content);
	}
	if (toolName === "lcm_describe") {
		const type = normalizeOptionalString(details?.type);
		if (normalizeOptionalString(details?.id) && (type === "summary" || type === "file")) return true;
		return /^LCM_SUMMARY \S+/m.test(content) || /^## LCM File: \S+/m.test(content);
	}
	if (toolName === "lcm_expand_query") return hasExpandedSummary(details) || hasExpandedSummary(asOptionalRecord(tryParseJson(content)));
	const normalizedContent = normalizeOptionalString(content);
	const explicitEvidence = details ? readExplicitMemoryEvidence(details) : void 0;
	const structuredEvidence = normalizedContent ? readStructuredMemoryEvidenceFromContent(rawContent) : void 0;
	return Boolean(normalizedContent) && explicitEvidence !== false && structuredEvidence !== false;
}
//#endregion
export { streamActiveMemoryTranscriptRecords as i, readMemoryResultFromSessionRecord as n, resolveTranscriptReadLimits as r, createActiveMemoryHookDeadline as t };
