import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as extractInboundSenderLabel } from "./strip-inbound-meta-Cqak81y4.mjs";
import { t as stripInternalMetadataForDisplay } from "./display-text-sanitize-CredJWX1.mjs";
import { r as projectChatWorkContextForDisplay } from "./work-context-CdqkpY8G.mjs";
import { t as stripUserEnvelopeForDisplay } from "./user-envelope-display-6WLLj04l.mjs";
//#region src/gateway/chat-sanitize.ts
function extractMessageSenderLabel(entry) {
	if (typeof entry.senderLabel === "string" && entry.senderLabel.trim()) return entry.senderLabel.trim();
	if (typeof entry.content === "string") return extractInboundSenderLabel(entry.content);
	if (Array.isArray(entry.content)) for (const item of entry.content) {
		if (!item || typeof item !== "object") continue;
		const text = item.text;
		if (typeof text !== "string") continue;
		const senderLabel = extractInboundSenderLabel(text);
		if (senderLabel) return senderLabel;
	}
	if (typeof entry.text === "string") return extractInboundSenderLabel(entry.text);
	return null;
}
function stripEnvelopeFromContentWithRole(content, role) {
	const stripUserEnvelope = role === "user";
	let next;
	for (let index = 0; index < content.length; index++) {
		const item = content[index];
		if (!item || typeof item !== "object") continue;
		const entry = item;
		if (!(entry.type === "text" || role === "user" && entry.type === "input_text" || role === "assistant" && (entry.type === "input_text" || entry.type === "output_text")) || typeof entry.text !== "string") continue;
		const stripped = stripUserEnvelope ? stripUserEnvelopeForDisplay(entry.text) : stripInternalMetadataForDisplay(entry.text);
		if (stripped === entry.text) continue;
		next ??= content.slice();
		next[index] = {
			...entry,
			text: stripped
		};
	}
	return next ?? content;
}
/** Strips OpenClaw envelope metadata from one display message without mutating it. */
function stripEnvelopeFromMessage(message) {
	if (!message || typeof message !== "object") return message;
	const projected = projectChatWorkContextForDisplay(message);
	const entry = projected;
	const role = typeof entry.role === "string" ? normalizeLowercaseStringOrEmpty(entry.role) : "";
	const stripUserEnvelope = role === "user";
	let next;
	const senderLabel = stripUserEnvelope ? extractMessageSenderLabel(entry) : null;
	if (senderLabel && entry.senderLabel !== senderLabel) next = {
		...entry,
		senderLabel
	};
	if (typeof entry.content === "string") {
		const stripped = stripUserEnvelope ? stripUserEnvelopeForDisplay(entry.content) : stripInternalMetadataForDisplay(entry.content);
		if (stripped !== entry.content) {
			next ??= { ...entry };
			next.content = stripped;
		}
	} else if (Array.isArray(entry.content)) {
		const updated = stripEnvelopeFromContentWithRole(entry.content, role);
		if (updated !== entry.content) {
			next ??= { ...entry };
			next.content = updated;
		}
	} else if (typeof entry.text === "string") {
		const stripped = stripUserEnvelope ? stripUserEnvelopeForDisplay(entry.text) : stripInternalMetadataForDisplay(entry.text);
		if (stripped !== entry.text) {
			next ??= { ...entry };
			next.text = stripped;
		}
	}
	return next ?? projected;
}
/** Strips envelope metadata from a message array, preserving the original array when unchanged. */
function stripEnvelopeFromMessages(messages) {
	let next;
	for (let index = 0; index < messages.length; index++) {
		const message = messages[index];
		const stripped = stripEnvelopeFromMessage(message);
		if (stripped !== message) {
			next ??= messages.slice();
			next[index] = stripped;
		}
	}
	return next ?? messages;
}
//#endregion
export { stripEnvelopeFromMessages as n, stripEnvelopeFromMessage as t };
