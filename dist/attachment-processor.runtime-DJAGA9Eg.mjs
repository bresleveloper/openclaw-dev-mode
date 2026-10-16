import "./constants-GzjKtFvA.mjs";
import { d as normalizeMimeType, u as mimeTypeFromFilePath } from "./mime-CGDYrRzL.mjs";
import { r as inspectBase64 } from "./base64-CU53EX1R.mjs";
import { t as sniffMimeFromBase64 } from "./sniff-mime-from-base64-G74SYgs-.mjs";
//#region src/media/attachment-processor.runtime.ts
const ATTACHMENT_OFFLOAD_THRESHOLD_BYTES = 2e6;
function isGenericContainerMime(mime) {
	return mime === "application/zip" || mime === "application/octet-stream";
}
async function prepareAttachment(input) {
	const facts = inspectBase64(input.base64, "attachment");
	if (!facts) throw new Error(`attachment ${input.label}: invalid base64 content`);
	let buffer = input.imageStorage !== "inline" && facts.decodedBytes > 2e6 && facts.decodedBytes <= 6291456 ? Buffer.from(input.base64, "base64") : void 0;
	const hints = [normalizeMimeType(input.mime), mimeTypeFromFilePath(input.label)];
	const mime = await sniffMimeFromBase64({
		...facts,
		buffer
	}, { additionalMimeHints: [...hints.filter((hint) => !isGenericContainerMime(hint)), ...hints] }) ?? "application/octet-stream";
	if (!buffer && !mime.startsWith("image/")) buffer = Buffer.from(input.base64, "base64");
	return {
		sizeBytes: facts.decodedBytes,
		mime,
		buffer
	};
}
//#endregion
export { isGenericContainerMime as n, prepareAttachment as r, ATTACHMENT_OFFLOAD_THRESHOLD_BYTES as t };
