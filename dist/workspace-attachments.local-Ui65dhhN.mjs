import { u as openLocalFileSafely } from "./fs-safe-BUXBSN-4.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { a as wrapExternalContent } from "./external-content-Bkm4w5qo.mjs";
import { n as captureChannelReadScope } from "./channel-read-authority-CyorchNP.mjs";
import { s as getMediaDir } from "./store-A0dMc8iV.mjs";
import { i as resolveMediaReferenceLocalPath } from "./media-reference-BIOMSmeS.mjs";
import { o as resolveLocalMediaRoots } from "./local-media-access-BBHmTniP.mjs";
import { n as classifyAttachmentBytes } from "./attachment-classify-CnNuBUq0.mjs";
import { t as resolveFileExtractionLimits } from "./file-extraction-limits-DhTTSSYi.mjs";
import { i as resolveMediaFactLocalRef } from "./images.media-refs-BF5D5dWC.mjs";
import path from "node:path";
import { readFileWindowFully } from "@openclaw/fs-safe/advanced";
//#region src/agents/workspace-attachments.local.ts
const ATTACHMENT_HEADER_BYTES = 8192;
/** Resolve current managed documents for an eligible local host execution only. */
async function prepareLocalWorkspaceAttachments(params) {
	const { execution } = params;
	if (!execution.readAllowed) return;
	const readScope = captureChannelReadScope();
	const assertCurrent = () => {
		params.assertCurrent();
		readScope?.assertCurrent();
	};
	assertCurrent();
	const roots = await resolveLocalMediaRoots([getMediaDir()]);
	assertCurrent();
	const limits = resolveFileExtractionLimits(execution.config ?? {});
	const maxChars = Number.isFinite(execution.maxChars) ? Math.max(0, Math.floor(execution.maxChars)) : 0;
	const files = [];
	let metadataChars = 0;
	for (const fact of params.media) {
		const ref = resolveMediaFactLocalRef(fact);
		if (!ref) continue;
		try {
			assertCurrent();
			const filePath = await resolveMediaReferenceLocalPath(ref.resolved);
			assertCurrent();
			if (!path.isAbsolute(filePath) || !roots.some((root) => isPathInside(root, filePath))) continue;
			const opened = await openLocalFileSafely({ filePath });
			let classification;
			try {
				var _usingCtx$1 = _usingCtx();
				const handle = _usingCtx$1.a(opened.handle);
				assertCurrent();
				if (opened.stat.nlink > 1 || opened.stat.size > limits.maxBytes || !roots.some((root) => isPathInside(root, opened.realPath))) continue;
				const header = Buffer.alloc(Math.min(opened.stat.size, ATTACHMENT_HEADER_BYTES));
				const bytesRead = await readFileWindowFully(handle, header, 0);
				assertCurrent();
				classification = await classifyAttachmentBytes({
					buffer: header.subarray(0, bytesRead),
					declaredMime: fact.contentType,
					name: path.basename(opened.realPath)
				});
				assertCurrent();
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				await _usingCtx$1.d();
			}
			assertCurrent();
			if ([
				"image",
				"audio",
				"video"
			].includes(classification.class) || limits.allowedMimesConfigured && (!classification.mime || !limits.allowedMimes.has(classification.mime))) continue;
			const file = {
				reference: ref.raw,
				path: opened.realPath,
				...fact.fileName ? { name: fact.fileName } : {}
			};
			metadataChars += JSON.stringify(file).length + 1;
			if (metadataChars > maxChars) break;
			files.push(file);
		} catch {
			assertCurrent();
		}
	}
	assertCurrent();
	const note = files.length ? ["For file tools, use the verified attachment paths below. Media references identify attachments; they are not filesystem paths.", wrapExternalContent(JSON.stringify(files).replaceAll("$", "\\u0024").replaceAll("@", "\\u0040"), {
		source: "unknown",
		includeWarning: false
	})].join("\n") : void 0;
	if (metadataChars > maxChars || note && note.length > maxChars) return;
	return note;
}
//#endregion
export { prepareLocalWorkspaceAttachments };
