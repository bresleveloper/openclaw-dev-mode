import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { l as normalizeMediaFacts, m as resolveMediaFactKind } from "./media-facts-CJdQ4R61.mjs";
import { assertNoWindowsNetworkPath, safeFileURLToPath } from "@openclaw/fs-safe/advanced";
//#region src/media-understanding/attachments.normalize.ts
/** Normalizes a local attachment path while rejecting remote file URLs and Windows UNC paths. */
function normalizeAttachmentPath(raw) {
	const value = normalizeOptionalString(raw);
	if (!value) return;
	if (/^file:/iu.test(value)) try {
		return safeFileURLToPath(value);
	} catch {
		return;
	}
	try {
		assertNoWindowsNetworkPath(value, "Attachment path");
	} catch {
		return;
	}
	return value;
}
/** Converts ordered media facts into indexed attachment records. */
function normalizeAttachments(ctx) {
	return normalizeMediaFacts(ctx.media).map((fact, index) => {
		const attachment = {
			path: normalizeOptionalString(fact.path),
			url: normalizeOptionalString(fact.url),
			mime: normalizeOptionalString(fact.contentType),
			index,
			alreadyTranscribed: fact.transcribed === true
		};
		const kind = fact.fileName ? resolveMediaFactKind(fact) ?? fact.kind : fact.kind;
		if (kind) attachment.kind = kind;
		const fileName = normalizeOptionalString(fact.fileName);
		if (fileName) attachment.fileName = fileName;
		if (fact.workspaceDir) attachment.workspaceDir = fact.workspaceDir;
		return attachment;
	}).filter((entry) => Boolean(entry.path ?? entry.url));
}
/** Classifies an attachment by authoritative kind, MIME, then canonical filename metadata. */
function resolveAttachmentKind(attachment) {
	const kind = resolveMediaFactKind({
		path: attachment.path,
		url: attachment.url,
		contentType: attachment.mime,
		kind: attachment.kind
	});
	return kind === "sticker" ? "image" : kind === "document" ? "unknown" : kind ?? "unknown";
}
/** Returns true when the attachment is classified as audio media. */
function isAudioAttachment(attachment) {
	return resolveAttachmentKind(attachment) === "audio";
}
/** Returns true when the attachment is classified as image media. */
function isImageAttachment(attachment) {
	return resolveAttachmentKind(attachment) === "image";
}
//#endregion
export { resolveAttachmentKind as a, normalizeAttachments as i, isImageAttachment as n, normalizeAttachmentPath as r, isAudioAttachment as t };
