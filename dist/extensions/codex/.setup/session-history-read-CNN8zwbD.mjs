import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import fs from "node:fs/promises";
import { SessionTranscriptReadFenceError, readCodexSessionContext } from "openclaw/plugin-sdk/codex-session-transcript-runtime";
import { INLINE_IMAGE_DATA_URL_PREFIX, sanitizeInlineImageDataUrl } from "openclaw/plugin-sdk/inline-image-data-url-runtime";
//#region extensions/codex/src/app-server/history-rejection.ts
/** Only an owning rejection site can supply a diagnostic; exception text is never evidence. */
var CodexHistoryRejection = class extends Error {
	constructor(reason) {
		super(`Codex history rejected: ${reason}`);
		this.reason = reason;
	}
};
function codexHistoryRejectionReason(error) {
	return error instanceof CodexHistoryRejection ? error.reason : "history_read_failed";
}
//#endregion
//#region extensions/codex/src/app-server/image-payload-sanitizer.ts
/**
* Sanitizes inline image payloads mirrored through Codex history so invalid
* base64 data becomes readable text instead of poisoning replayed transcripts.
*/
const IMAGE_OMITTED_TEXT = "omitted image payload: invalid inline image data";
/** Builds the replacement text inserted when an inline image payload is invalid. */
function invalidInlineImageText(label) {
	return `[${label}] ${IMAGE_OMITTED_TEXT}`;
}
function sanitizeImageContentRecord(record, label) {
	if (record.type === "image" && typeof record.data === "string") {
		const mimeType = typeof record.mimeType === "string" ? record.mimeType : "image/png";
		const imageUrl = sanitizeInlineImageDataUrl(`data:${mimeType};base64,${record.data}`);
		if (!imageUrl) return {
			type: "text",
			text: invalidInlineImageText(label)
		};
		const commaIndex = imageUrl.indexOf(",");
		const mime = imageUrl.slice(INLINE_IMAGE_DATA_URL_PREFIX.length, commaIndex).split(";")[0] ?? mimeType;
		const data = imageUrl.slice(commaIndex + 1);
		return mime === record.mimeType && data === record.data ? record : {
			...record,
			mimeType: mime,
			data
		};
	}
	const urlKey = record.type === "inputImage" ? "imageUrl" : "image_url";
	if ((record.type === "inputImage" || record.type === "input_image") && typeof record[urlKey] === "string") {
		const imageUrl = sanitizeInlineImageDataUrl(record[urlKey]);
		return imageUrl ? imageUrl === record[urlKey] ? record : {
			...record,
			[urlKey]: imageUrl
		} : {
			type: record.type === "inputImage" ? "inputText" : "input_text",
			text: invalidInlineImageText(label)
		};
	}
}
/** Sanitizes images without copying unchanged history or mutating its owned snapshot. */
function sanitizeCodexHistoryImagePayloads(value, label) {
	if (Array.isArray(value)) {
		let next;
		for (let index = 0; index < value.length; index++) {
			const child = sanitizeCodexHistoryImagePayloads(value[index], label);
			if (child !== value[index]) (next ??= value.slice())[index] = child;
		}
		return next ?? value;
	}
	if (!isRecord(value)) return value;
	const imageRecord = sanitizeImageContentRecord(value, label);
	if (imageRecord) return imageRecord;
	let next;
	for (const key in value) {
		if (!Object.hasOwn(value, key)) continue;
		const child = sanitizeCodexHistoryImagePayloads(value[key], label);
		if (child !== value[key]) (next ??= { ...value })[key] = child;
	}
	return next ?? value;
}
//#endregion
//#region extensions/codex/src/app-server/session-history-read.ts
function consumeCodexHistory(messages, header, sessionId, read, imageLabel = "codex mirrored history") {
	if (!isRecord(header) || header.type !== "session") return read([]);
	if (typeof header.id !== "string") throw new CodexHistoryRejection("malformed_header");
	if (header.id !== sessionId) return read([]);
	return read((function* () {
		for (const message of messages) yield sanitizeCodexHistoryImagePayloads(message, imageLabel);
	})());
}
/** Keeps native evidence and its synchronous consumer inside the same readonly snapshot. */
async function readCodexNativeHistory(target, sessionId, read, admission, onSnapshot) {
	const consume = (messages, header, version) => {
		try {
			onSnapshot?.(version);
			return {
				status: "ok",
				value: consumeCodexHistory(messages, header, sessionId, read)
			};
		} catch (error) {
			return {
				status: "rejected",
				reason: codexHistoryRejectionReason(error)
			};
		}
	};
	try {
		if (target.kind === "empty") return consume([], void 0);
		if (target.kind === "sqlite") return readCodexSessionContext(target.target, consume, admission);
		const { buildSessionContext, migrateSessionEntries, parseSessionEntries } = await import("openclaw/plugin-sdk/agent-sessions");
		const entries = parseSessionEntries(await fs.readFile(target.sessionFile, "utf-8"));
		return consume((function* () {
			migrateSessionEntries(entries);
			const sessionEntries = entries.filter((entry) => isRecord(entry) && entry.type !== "session");
			yield* buildSessionContext(sessionEntries).messages;
		})(), entries[0]);
	} catch (error) {
		if (isRecord(error) && error.code === "ENOENT") return consume([], void 0);
		return {
			status: "rejected",
			reason: error instanceof SessionTranscriptReadFenceError || isRecord(error) && (error.code === "EACCES" || error.code === "EPERM") ? "access_rejected" : codexHistoryRejectionReason(error)
		};
	}
}
//#endregion
export { codexHistoryRejectionReason as a, CodexHistoryRejection as i, readCodexNativeHistory as n, invalidInlineImageText as r, consumeCodexHistory as t };
