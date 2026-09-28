import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
//#region src/agents/failover/signal-details.ts
const MAX_FAILOVER_DETAIL_CANDIDATES = 12;
const MAX_FAILOVER_DETAIL_CHARS = 1e3;
function normalizeFailoverDetailString(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	return trimmed.length > MAX_FAILOVER_DETAIL_CHARS ? truncateUtf16Safe(trimmed, MAX_FAILOVER_DETAIL_CHARS) : trimmed;
}
function appendFailoverDetailCandidate(candidates, value) {
	const normalized = typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? normalizeFailoverDetailString(String(value)) : void 0;
	if (!normalized || candidates.includes(normalized)) return;
	candidates.push(normalized);
}
function collectFailoverDetailCandidates(value, candidates, seen) {
	if (candidates.length >= MAX_FAILOVER_DETAIL_CANDIDATES || value === void 0 || value === null) return;
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
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	if (seen.has(value)) return;
	seen.add(value);
	const record = value;
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
