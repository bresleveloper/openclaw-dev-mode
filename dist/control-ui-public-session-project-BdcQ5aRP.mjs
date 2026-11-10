import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as extractAssistantTranscriptSourceText } from "./chat-message-content-C-d0FKNG.mjs";
import { r as MAX_IMAGE_BYTES } from "./constants-GzjKtFvA.mjs";
import "./input-provenance-D1LHo5Qj.mjs";
import { t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { c as isMeaningfulMediaFact, f as readPersistedMediaFacts, s as isImageMediaFact } from "./media-facts-BIPREXi-.mjs";
import { r as parseInboundMediaUri } from "./inbound-media-uri-Bc4RWtcM.mjs";
import { n as splitMediaOutput } from "./parse-output-DRIp2d_R.mjs";
import { C as stripSuppressedControlReplyToken } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { l as sanitizeAssistantVisibleTextWithProfile } from "./assistant-visible-text-DZwixI8b.mjs";
import { n as HEARTBEAT_PROMPT } from "./heartbeat-C40cs1ec.mjs";
import { t as stripInternalMetadataForDisplay } from "./display-text-sanitize-DM667iyR.mjs";
import { n as isHeartbeatOkResponse, r as isHeartbeatUserMessage } from "./heartbeat-filter-3DbSzqaf.mjs";
import { t as stripUserEnvelopeForDisplay } from "./user-envelope-display-DD6S7AbG.mjs";
import { t as unwrapToolCallForDisplay } from "./tool-display-call-D2LOOBqc.mjs";
import { n as isToolCallContentType, o as resolveToolBlockArgs } from "./tool-content-CCdCNdqN.mjs";
//#region src/gateway/control-ui-public-session-message.ts
/** Publication excludes private runtime input, including its attachments and tool activity. */
function publicSessionMessageEntry(message) {
	const entry = asOptionalRecord(message);
	if (!entry || ![
		"user",
		"assistant",
		"toolResult",
		"tool"
	].includes(String(entry.role)) || entry.display === false || entry.customType !== void 0 || entry.senderSession !== void 0) return;
	if ((entry.role === "user" || entry.role === "assistant") && (entry.toolCallId !== void 0 || entry.tool_call_id !== void 0)) return;
	const provenance = asOptionalRecord(entry.provenance);
	if (entry.provenance !== void 0 && provenance?.kind !== "external_user") return;
	const raw = rawMessageText(entry);
	if (raw?.includes("[Inter-session message]")) return;
	const roleContent = {
		role: String(entry.role),
		content: raw ?? ""
	};
	if (raw && (isHeartbeatUserMessage(roleContent, HEARTBEAT_PROMPT) || isHeartbeatOkResponse(roleContent))) return;
	return entry;
}
function rawMessageText(entry) {
	let text;
	if (entry.role === "assistant") text = extractAssistantTranscriptSourceText(entry);
	else if (typeof entry.content === "string") text = entry.content;
	else if (Array.isArray(entry.content)) text = entry.content.flatMap((value) => {
		const block = asOptionalRecord(value);
		return (block?.type === "text" || block?.type === "input_text") && typeof block.text === "string" ? [block.text] : [];
	}).join("\n\n");
	else if (typeof entry.text === "string") text = entry.text;
	return text;
}
function publicSessionMessageText(entry) {
	if (entry.role !== "user" && entry.role !== "assistant") return "";
	let text = rawMessageText(entry);
	if (!text) return "";
	text = entry.role === "user" ? stripUserEnvelopeForDisplay(text) : stripInternalMetadataForDisplay(text);
	if (entry.role === "assistant") text = sanitizeAssistantVisibleTextWithProfile(text, "history", true);
	const roleContent = {
		role: entry.role,
		content: text
	};
	if (isHeartbeatUserMessage(roleContent, HEARTBEAT_PROMPT) || isHeartbeatOkResponse(roleContent)) return "";
	if (entry.role === "assistant") text = stripSuppressedControlReplyToken(text);
	return splitMediaOutput(text, { extractAudioDirectives: false }).text.trim();
}
//#endregion
//#region src/gateway/control-ui-public-session-attachments.ts
function getPublicSessionEntryId(message) {
	const id = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.id;
	return typeof id === "string" && id.length > 0 && id.length <= 1024 ? id : void 0;
}
function buildPublicSessionMediaBaseUrl(basePath, token) {
	return `${basePath}/share/session/media?token=${encodeURIComponent(token)}`;
}
function buildPublicSessionMediaUrl(baseUrl, entryId, attachmentId) {
	return `${baseUrl}&entry=${encodeURIComponent(entryId)}&attachment=${encodeURIComponent(attachmentId)}`;
}
function attachmentSource(block) {
	const source = asOptionalRecord(block.source);
	const imageUrl = asOptionalRecord(block.image_url);
	const attachment = asOptionalRecord(block.attachment);
	return {
		source: [
			block.url,
			block.openUrl,
			source?.url,
			block.image_url,
			imageUrl?.url,
			attachment?.url
		].find((value) => typeof value === "string" && value.length > 0),
		data: [block.data, source?.data].find((value) => typeof value === "string" && value.length > 0)
	};
}
function collectAttachments(message) {
	const record = publicSessionMessageEntry(message);
	if (!record) return [];
	const attachments = [];
	const displayContent = record[ASSISTANT_DISPLAY_CONTENT_FIELD];
	const content = Array.isArray(displayContent) ? displayContent : record.content;
	for (const [index, contentBlock] of (Array.isArray(content) ? content : []).entries()) {
		const block = asOptionalRecord(contentBlock);
		if (!block) continue;
		const attachment = asOptionalRecord(block.attachment);
		const image = [
			"image",
			"image_url",
			"input_image"
		].includes(String(block.type));
		if (!image && ![
			"attachment",
			"file",
			"audio",
			"video"
		].includes(String(block.type))) continue;
		if ((record.role === "toolResult" || record.role === "tool") && !image && attachment?.kind !== "image") continue;
		const name = [
			block.fileName,
			attachment?.name,
			attachment?.label,
			block.alt
		].find((value) => typeof value === "string" && value.length > 0);
		attachments.push({
			id: `content-${index}`,
			name: name ?? (image ? "Image" : "Attachment"),
			image: image || attachment?.kind === "image",
			...attachmentSource(block)
		});
	}
	for (const [index, fact] of (readPersistedMediaFacts(record) ?? []).entries()) {
		if (!isMeaningfulMediaFact(fact)) continue;
		const image = isImageMediaFact(fact);
		if ((record.role === "toolResult" || record.role === "tool") && !image) continue;
		attachments.push({
			id: `media-${index}`,
			name: fact.fileName || (image ? "Image" : "Attachment"),
			image,
			source: fact.url ?? fact.path,
			path: fact.path
		});
	}
	return attachments;
}
/** Only descriptors leave the projection; media bytes are recovered after public authorization. */
function collectPublicSessionAttachments(message) {
	return collectAttachments(message).map(({ id, name, image }) => ({
		id,
		name,
		image
	}));
}
async function readPublicSessionAttachment(message, attachmentId, locator) {
	const attachment = collectAttachments(message).find((item) => item.id === attachmentId);
	if (!attachment?.image) return null;
	let data = attachment.data;
	if (attachment.source?.startsWith("data:")) {
		const match = /^data:image\/[a-z0-9.+-]+;base64,/iu.exec(attachment.source);
		data = match ? attachment.source.slice(match[0].length) : void 0;
	}
	if (data) {
		if (data.length > Math.ceil(2097152) * 4 || !/^[A-Za-z0-9+/]*={0,2}$/u.test(data)) return null;
		const buffer = Buffer.from(data, "base64");
		return buffer.byteLength <= 6291456 ? buffer : null;
	}
	if (!attachment.source) return null;
	try {
		const { buildInboundMediaUriFromPath } = await import("./media-reference-D7CWvLds.mjs");
		const inbound = parseInboundMediaUri(buildInboundMediaUriFromPath(attachment.path ?? attachment.source) ?? attachment.source);
		if (inbound) {
			const { readMediaBuffer } = await import("./store-gQkRyHuq.mjs");
			return (await readMediaBuffer(inbound.id, "inbound", MAX_IMAGE_BYTES)).buffer;
		}
		const { parseManagedOutgoingRoute } = await import("./managed-image-attachments-Bg-PvYB8.mjs");
		const outgoing = parseManagedOutgoingRoute(attachment.source);
		if (!outgoing || outgoing.sessionKey !== locator.sessionKey) return null;
		const { readManagedImageRecord } = await import("./managed-image-record-store-DLhi0Ji6.mjs");
		const record = await readManagedImageRecord(outgoing.attachmentId);
		if (!record || record.sessionKey !== locator.sessionKey || record.messageId !== getPublicSessionEntryId(message) || record.agentId !== void 0 && record.agentId !== locator.agentId) return null;
		const { resolveManagedImageOriginalPath } = await import("./managed-image-attachments.custody-CPpZXSut.mjs");
		const { readLocalFileSafely } = await import("./fs-safe-MZ5T9fjO.mjs");
		return (await readLocalFileSafely({
			filePath: resolveManagedImageOriginalPath(record),
			maxBytes: MAX_IMAGE_BYTES
		})).buffer;
	} catch {
		return null;
	}
}
//#endregion
//#region src/gateway/control-ui-public-session-project.ts
function toolSummary(args) {
	const record = asOptionalRecord(args);
	const selected = record ? [
		"command",
		"cmd",
		"path",
		"file_path",
		"query",
		"q",
		"url"
	].map((key) => record[key]).find((value) => typeof value === "string") : typeof args === "string" ? args : void 0;
	return typeof selected === "string" ? truncateUtf16Safe(selected.replace(/\s+/gu, " ").trim(), 160) : "";
}
/** Same visible-content boundary as chat: narration separates adjacent tool activity. */
function projectPublicSessionItems(messages) {
	const items = [];
	for (const [sourceIndex, message] of messages.entries()) {
		const entry = publicSessionMessageEntry(message);
		if (!entry) continue;
		const text = publicSessionMessageText(entry);
		const attachments = collectPublicSessionAttachments(entry);
		if (text || attachments.length > 0) items.push({
			kind: "message",
			role: entry.role === "user" ? "user" : "assistant",
			text,
			message,
			sourceIndex
		});
		if (entry.role !== "assistant" || !Array.isArray(entry.content)) continue;
		for (const value of entry.content) {
			const block = asOptionalRecord(value);
			if (!block || !isToolCallContentType(block.type)) continue;
			const call = unwrapToolCallForDisplay({
				name: typeof block.name === "string" ? block.name : "tool",
				args: resolveToolBlockArgs(block)
			});
			const name = truncateUtf16Safe(call.name, 80);
			const summary = toolSummary(call.args);
			const previous = items.at(-1);
			if (previous?.kind === "tools") previous.calls.push({
				name,
				summary
			});
			else items.push({
				kind: "tools",
				calls: [{
					name,
					summary
				}],
				sourceIndex
			});
		}
	}
	return items;
}
//#endregion
export { getPublicSessionEntryId as a, publicSessionMessageText as c, collectPublicSessionAttachments as i, buildPublicSessionMediaBaseUrl as n, readPublicSessionAttachment as o, buildPublicSessionMediaUrl as r, publicSessionMessageEntry as s, projectPublicSessionItems as t };
