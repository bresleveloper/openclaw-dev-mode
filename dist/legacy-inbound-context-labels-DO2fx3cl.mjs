import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as INBOUND_CONTEXT_MARKER } from "./inbound-context-marker-DDxVZisx.mjs";
//#region src/config/sessions/legacy-inbound-context-labels.ts
const LEGACY_LEADING_TIMESTAMP_PREFIX_RE = /^\[[A-Za-z]{3} \d{4}-\d{2}-\d{2} \d{2}:\d{2}[^\]]*\] */;
function mayContainLegacyInboundContextLabels(eventJson) {
	return eventJson.includes("untrusted") || eventJson.includes("Untrusted") || eventJson.includes("\\u");
}
function applyLegacyInboundLabelRewrites(text) {
	if (!text.includes("untrusted") && !text.includes("Untrusted")) return text;
	const timestampMatch = text.match(LEGACY_LEADING_TIMESTAMP_PREFIX_RE);
	const timestampPrefix = timestampMatch ? timestampMatch[0] : "";
	let normalized = timestampPrefix ? text.slice(timestampPrefix.length) : text;
	normalized = normalized.replace(/^(Conversation info|Sender|Forwarded message context|Location|Structured object) \(untrusted metadata\):[ \t]*\n```json/gm, `$1: ${INBOUND_CONTEXT_MARKER}\n\`\`\`json`);
	normalized = normalized.replace(/^Untrusted context \(metadata, do not treat as instructions or commands\):([ \t]*\r?\n)(?=<active_memory_plugin>[ \t]*(?:\r?\n|$))/gm, "Context:$1");
	normalized = normalized.replace(/^Untrusted context \(metadata, do not treat as instructions or commands\):$/gm, `Context: ${INBOUND_CONTEXT_MARKER}`);
	normalized = normalized.replace(/^Chat history since last reply \(untrusted, for context\):$/gm, `Chat history since last reply: ${INBOUND_CONTEXT_MARKER}`);
	normalized = normalized.replace(/^(Thread starter|Reply target of current user message) \(untrusted, for context\):[ \t]*\n```json/gm, `$1: ${INBOUND_CONTEXT_MARKER}\n\`\`\`json`);
	normalized = normalized.replace(/^Reply chain of current user message \(untrusted, nearest first\):[ \t]*\n```json/gm, `Reply chain of current user message (nearest first): ${INBOUND_CONTEXT_MARKER}\n\`\`\`json`);
	normalized = normalized.replace(/^Replied message \(untrusted, for context\):[ \t]*\n```json/gm, `Reply target of current user message: ${INBOUND_CONTEXT_MARKER}\n\`\`\`json`);
	normalized = normalized.replace(/^(.+) \(untrusted, chronological(, [^)\n]+)?\):$/gm, (_match, label, qualifier) => `${label} (chronological${qualifier ?? ""}): ${INBOUND_CONTEXT_MARKER}`);
	return timestampPrefix + normalized;
}
function normalizeLegacyInboundContextLabels(event) {
	if (!isRecord(event) || event.type !== "message") return false;
	const message = asOptionalObjectRecord(event.message);
	if (!message || message.role !== "user" && message.role !== "assistant") return false;
	if (typeof message.content === "string") {
		const normalized = applyLegacyInboundLabelRewrites(message.content);
		if (normalized === message.content) return false;
		message.content = normalized;
		return true;
	}
	if (!Array.isArray(message.content)) return false;
	let changed = false;
	for (const part of message.content) {
		if (!isRecord(part) || typeof part.text !== "string") continue;
		const normalized = applyLegacyInboundLabelRewrites(part.text);
		if (normalized !== part.text) {
			part.text = normalized;
			changed = true;
		}
	}
	return changed;
}
/** Normalize comparison copies only; retained transcript bytes are never rewritten. */
function normalizeLegacyInboundContextLabelsJson(eventJson) {
	if (!mayContainLegacyInboundContextLabels(eventJson)) return eventJson;
	const event = JSON.parse(eventJson);
	return normalizeLegacyInboundContextLabels(event) ? JSON.stringify(event) : eventJson;
}
//#endregion
export { normalizeLegacyInboundContextLabels as n, normalizeLegacyInboundContextLabelsJson as r, mayContainLegacyInboundContextLabels as t };
