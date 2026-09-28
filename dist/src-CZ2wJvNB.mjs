import "./number-coercion-CLj0HTDM.mjs";
import "./cjk-chars-6ld30jSx.mjs";
//#region packages/normalization-core/src/balanced-json.ts
function isJsonOpeningDelimiter(char, openers) {
	return (char === "{" || char === "[") && openers.includes(char);
}
function extractBalancedJsonAt(raw, opts, offset) {
	const openers = opts.openers ?? ["{", "["];
	let start = offset;
	if (!opts.skipQuotedOpeners) while (start < raw.length && !isJsonOpeningDelimiter(raw[start], openers)) start += 1;
	const stack = [];
	let inString = false;
	let escaped = false;
	for (let index = start; index < raw.length; index += 1) {
		const char = raw[index];
		if (inString) {
			if (escaped) escaped = false;
			else if (char === "\\") escaped = true;
			else if (char === "\"") inString = false;
		} else if (char === "\"") inString = true;
		else if (isJsonOpeningDelimiter(char, openers)) {
			if (stack.length === 0) start = index;
			stack.push(char);
		} else if (stack.length > 0 && char === (stack.at(-1) === "{" ? "}" : "]")) {
			stack.pop();
			if (stack.length === 0) return {
				json: raw.slice(start, index + 1),
				startIndex: start,
				endIndex: index
			};
		}
	}
	return null;
}
/** Extracts the first balanced JSON object/array from text. */
function extractBalancedJsonPrefix(raw, opts = {}) {
	return extractBalancedJsonAt(raw, opts, 0);
}
/** Extracts every balanced JSON object/array fragment from arbitrary text. */
function extractBalancedJsonFragments(raw, opts = {}) {
	const fragments = [];
	for (let offset = 0; offset < raw.length;) {
		const fragment = extractBalancedJsonAt(raw, opts, offset);
		if (!fragment) break;
		fragments.push(fragment);
		offset = fragment.endIndex + 1;
	}
	return fragments;
}
//#endregion
//#region packages/normalization-core/src/response-bytes.ts
async function consumeResponseBytes(options) {
	let size = 0;
	while (true) {
		const { done, value } = await options.read();
		if (done) return {
			size,
			truncated: false
		};
		if (options.skipEmptyChunks !== false && !value?.length) continue;
		const remaining = options.maxBytes - size;
		size += value.length;
		if (size > options.maxBytes || options.stopAtLimit && size === options.maxBytes) {
			if (remaining > 0) options.onChunk(value.subarray(0, remaining));
			await options.onLimit(size);
			return {
				size,
				truncated: true
			};
		}
		options.onChunk(value);
	}
}
//#endregion
//#region packages/normalization-core/src/text-decoding.ts
/** Decodes a byte prefix without inventing a replacement character for a cut trailing sequence. */
function decodeTextPrefix(bytes, options = {}) {
	return new TextDecoder(options.encoding).decode(bytes, options.truncated ? { stream: true } : void 0);
}
//#endregion
export { extractBalancedJsonPrefix as i, consumeResponseBytes as n, extractBalancedJsonFragments as r, decodeTextPrefix as t };
