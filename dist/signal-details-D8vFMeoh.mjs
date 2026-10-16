import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
//#region src/agents/failover/signal-details.ts
const MAX_FAILOVER_DETAIL_CANDIDATES = 12;
const MAX_FAILOVER_DETAIL_CHARS = 1e3;
function appendFailoverDetailCandidate(candidates, value) {
	const normalized = truncateUtf16Safe(String(value).trim(), MAX_FAILOVER_DETAIL_CHARS);
	if (!normalized || candidates.includes(normalized)) return;
	candidates.push(normalized);
}
function collectFailoverDetailCandidates(value, candidates, seen) {
	if (candidates.length >= MAX_FAILOVER_DETAIL_CANDIDATES) return;
	if (typeof value === "string") {
		appendFailoverDetailCandidate(candidates, value);
		const trimmed = value.trim();
		if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return;
		try {
			collectFailoverDetailCandidates(JSON.parse(trimmed), candidates, seen);
		} catch {}
		return;
	}
	if (typeof value === "number" || typeof value === "boolean") {
		appendFailoverDetailCandidate(candidates, value);
		return;
	}
	const record = asOptionalRecord(value);
	if (!record || seen.has(record)) return;
	seen.add(record);
	for (const key of [
		"message",
		"param",
		"code",
		"type",
		"error",
		"detail",
		"body"
	]) {
		collectFailoverDetailCandidates(record[key], candidates, seen);
		if (candidates.length >= MAX_FAILOVER_DETAIL_CANDIDATES) return;
	}
}
function extractFailoverSignalDetails(...values) {
	const candidates = [];
	const seen = /* @__PURE__ */ new Set();
	for (const value of values) {
		collectFailoverDetailCandidates(value, candidates, seen);
		if (candidates.length >= MAX_FAILOVER_DETAIL_CANDIDATES) break;
	}
	return candidates.length > 0 ? candidates : void 0;
}
//#endregion
export { extractFailoverSignalDetails as t };
