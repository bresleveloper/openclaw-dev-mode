import { n as detectMime } from "./mime-1zBUMwu6.mjs";
import { t as canonicalizeBase64 } from "./base64-B5EyWEOm.mjs";
//#region src/media/sniff-mime-from-base64.ts
const BASE64_SNIFF_PREFIX_CHARS = 256;
/** Detects MIME from a bounded base64 prefix and optional caller metadata. */
async function sniffMimeFromBase64(base64, hints = {}) {
	const canonical = canonicalizeBase64(base64);
	if (!canonical) return;
	const take = Math.min(BASE64_SNIFF_PREFIX_CHARS, canonical.length);
	const sliceLength = take - take % 4;
	const head = sliceLength < 8 ? void 0 : Buffer.from(canonical.slice(0, sliceLength), "base64");
	return await detectMime({
		...hints,
		buffer: head
	});
}
//#endregion
export { sniffMimeFromBase64 as t };
