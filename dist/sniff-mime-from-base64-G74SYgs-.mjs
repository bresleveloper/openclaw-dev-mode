import { n as detectMime } from "./mime-CGDYrRzL.mjs";
import { r as inspectBase64 } from "./base64-CU53EX1R.mjs";
//#region src/media/sniff-mime-from-base64.ts
const BASE64_SNIFF_PREFIX_CHARS = 256;
/** Validates the whole payload unless facts are prepared; only MIME decoding is prefix-bounded. */
async function sniffMimeFromBase64(base64, hints = {}) {
	const facts = typeof base64 === "string" ? inspectBase64(base64, "canonical") : base64;
	if (!facts?.canonicalPadBits) return;
	const take = Math.min(BASE64_SNIFF_PREFIX_CHARS, facts.base64.length);
	const sliceLength = take - take % 4;
	const decoded = typeof base64 === "string" ? void 0 : base64.buffer;
	const head = sliceLength < 8 ? void 0 : decoded?.subarray(0, sliceLength / 4 * 3) ?? Buffer.from(facts.base64.slice(0, sliceLength), "base64");
	return await detectMime({
		...hints,
		buffer: head
	});
}
//#endregion
export { sniffMimeFromBase64 as t };
