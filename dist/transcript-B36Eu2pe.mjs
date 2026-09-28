import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { l as readSessionTranscriptRawDelta } from "./session-transcript-runtime-CcxVjmxZ.mjs";
import { A as DEFAULT_TRANSCRIPT_READ_MAX_BYTES, N as LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW, f as DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW, j as DEFAULT_TRANSCRIPT_READ_MAX_LINES, x as DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS } from "./types-DgEaE0BK.mjs";
import { n as clampInt } from "./config-BxNoMMde.mjs";
import { i as extractTextContent } from "./query-OBXHW90K.mjs";
import { c as readStructuredMemoryFailure, l as readStructuredMemoryFailureFromContent, o as readExplicitMemoryEvidence, s as readStructuredMemoryEvidenceFromContent } from "./prompt-CxzFbTjp.mjs";
//#region extensions/active-memory/transcript.ts
function isUnavailableMemorySearchDebug(debug) {
	return Boolean(debug?.error);
}
function resolveTranscriptReadLimits(limits) {
	return {
		maxChars: clampInt(limits?.maxChars, DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS, 1, DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS),
		maxLines: clampInt(limits?.maxLines, DEFAULT_TRANSCRIPT_READ_MAX_LINES, 1, DEFAULT_TRANSCRIPT_READ_MAX_LINES),
		maxBytes: clampInt(limits?.maxBytes, DEFAULT_TRANSCRIPT_READ_MAX_BYTES, 1, DEFAULT_TRANSCRIPT_READ_MAX_BYTES)
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
function extractActiveMemorySearchDebugFromSessionRecord(value) {
	const message = resolveToolResultMessage(value);
	if (!message) return;
	const toolName = normalizeLowercaseStringOrEmpty(message.toolName);
	if (toolName !== "memory_search" && toolName !== "memory_recall") return;
	const details = asOptionalRecord(message.details);
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
		searchMs: typeof debug?.searchMs === "number" && Number.isFinite(debug.searchMs) ? debug.searchMs : void 0,
		hits: typeof debug?.hits === "number" && Number.isFinite(debug.hits) ? debug.hits : void 0,
		warning,
		action,
		error
	};
}
function extractToolResultNameFromSessionRecord(value) {
	const message = resolveToolResultMessage(value);
	if (!message) return;
	return normalizeLowercaseStringOrEmpty(message.toolName) || void 0;
}
function hasUnavailableMemoryResultInSessionRecord(value, toolsAllow = [...DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW, ...LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW]) {
	const message = resolveToolResultMessage(value);
	if (!message) return false;
	const toolName = normalizeLowercaseStringOrEmpty(message.toolName);
	if (!toolName || !toolsAllow.includes(toolName)) return false;
	const details = asOptionalRecord(message.details);
	if (message.isError === true || readStructuredMemoryFailure(details) === true) return true;
	return readStructuredMemoryFailureFromContent(message.content) === true;
}
function hasTerminalUnavailableMemoryResultInSessionRecord(value, toolsAllow) {
	const message = resolveToolResultMessage(value);
	if (!message) return false;
	const toolName = normalizeLowercaseStringOrEmpty(message.toolName);
	if (!toolName || !toolsAllow.includes(toolName)) return false;
	const details = asOptionalRecord(message.details);
	if (details?.disabled === true || details?.unavailable === true) return true;
	const status = normalizeOptionalString(details?.status)?.toLowerCase().replace(/[\s-]+/g, "_");
	if (status === "disabled" || status === "unavailable") return true;
	if (toolName !== "memory_search" && toolName !== "memory_recall") return false;
	const debug = extractActiveMemorySearchDebugFromSessionRecord(value);
	return Boolean(debug?.error) || Boolean(details?.error);
}
function createActiveMemoryHookDeadline() {
	const timeoutSentinel = Symbol("active-memory-hook-timeout");
	let timeoutId;
	let deadlineAt = 0;
	let resolveTimeout = () => {};
	const promise = new Promise((resolve) => {
		resolveTimeout = resolve;
	});
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
function hasUsableMemoryResultInSessionRecord(value, toolsAllow = [...DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW, ...LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW]) {
	const message = resolveToolResultMessage(value);
	if (!message) return false;
	const toolName = normalizeLowercaseStringOrEmpty(message.toolName);
	if (!toolName || !toolsAllow.includes(toolName)) return false;
	if (hasUnavailableMemoryResultInSessionRecord(value, toolsAllow)) return false;
	const details = asOptionalRecord(message.details);
	const content = extractTextContent(message.content);
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
		if (typeof details?.totalMatches === "number" && Number.isFinite(details.totalMatches) && details.totalMatches > 0) return true;
		return /^## LCM Grep Results[\s\S]*^\*\*Total matches:\*\*\s+[1-9]\d*$/m.test(content);
	}
	if (toolName === "lcm_describe") {
		const type = normalizeOptionalString(details?.type);
		if (normalizeOptionalString(details?.id) && (type === "summary" || type === "file")) return true;
		return /^LCM_SUMMARY \S+/m.test(content) || /^## LCM File: \S+/m.test(content);
	}
	if (toolName === "lcm_expand_query") {
		if (typeof details?.expandedSummaryCount === "number" && Number.isFinite(details.expandedSummaryCount) && details.expandedSummaryCount > 0 && Boolean(normalizeOptionalString(details?.answer))) return true;
		try {
			const parsed = asOptionalRecord(JSON.parse(content));
			return typeof parsed?.expandedSummaryCount === "number" && Number.isFinite(parsed.expandedSummaryCount) && parsed.expandedSummaryCount > 0 && Boolean(normalizeOptionalString(parsed?.answer));
		} catch {
			return false;
		}
	}
	const normalizedContent = normalizeOptionalString(content);
	const explicitEvidence = details ? readExplicitMemoryEvidence(details) : void 0;
	const structuredEvidence = normalizedContent ? readStructuredMemoryEvidenceFromContent(message.content) : void 0;
	return Boolean(normalizedContent) && explicitEvidence !== false && structuredEvidence !== false;
}
//#endregion
export { hasUnavailableMemoryResultInSessionRecord as a, resolveTranscriptReadLimits as c, hasTerminalUnavailableMemoryResultInSessionRecord as i, streamActiveMemoryTranscriptRecords as l, extractActiveMemorySearchDebugFromSessionRecord as n, hasUsableMemoryResultInSessionRecord as o, extractToolResultNameFromSessionRecord as r, isUnavailableMemorySearchDebug as s, createActiveMemoryHookDeadline as t };
