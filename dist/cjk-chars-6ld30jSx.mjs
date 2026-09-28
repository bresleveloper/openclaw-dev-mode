//#region packages/normalization-core/src/cjk-chars.ts
/**
* Shared CJK-aware character counting for approximate token estimates.
*
* This is a provider-independent budget heuristic, not an exact tokenizer.
* Weighting common CJK, rare BMP characters, width-compatibility forms, and
* supplementary ideographs separately keeps current tokenizers within a
* conservative budget range while preserving the existing Latin behavior.
*/
const CHARS_PER_TOKEN_ESTIMATE = 4;
const DEFAULT_BUDGET_OPTIONS = {};
const ASCII_RUN_OR_NON_ASCII_CODE_POINT_RE = /[\p{ASCII}]+|[^\p{ASCII}]/gu;
const NON_ASCII_RE = /[\u0080-\u{10FFFF}]/u;
const WEIGHTED_CJK_RANGES = [
	[
		[183, 183],
		[12288, 12703],
		[19968, 40869],
		[44032, 55215],
		[65281, 65376]
	],
	[
		[4352, 4607],
		[11904, 12287],
		[12704, 19967],
		[40870, 40959],
		[40960, 42239],
		[42752, 42759],
		[43360, 43391],
		[55216, 55295],
		[63744, 64255]
	],
	[
		[711, 711],
		[713, 715],
		[729, 729],
		[746, 747],
		[773, 773],
		[803, 803],
		[65040, 65103],
		[65377, 65500],
		[65504, 65510]
	],
	[[119648, 119665]],
	[
		[94176, 94207],
		[110576, 110591],
		[110592, 110959],
		[127488, 127743],
		[131072, 195103],
		[196608, 210047]
	]
];
const WEIGHTED_CJK_RE = new RegExp(`[${WEIGHTED_CJK_RANGES.flatMap((ranges) => ranges.map(([start, end]) => `\\u{${start.toString(16)}}-\\u{${end.toString(16)}}`)).join("")}]`, "u");
const CJK_CATEGORY = (() => {
	const maxCodePoint = Math.max(...WEIGHTED_CJK_RANGES.flatMap((ranges) => ranges.map(([, end]) => end)));
	const categories = new Uint8Array(maxCodePoint + 1);
	for (const [bucket, ranges] of WEIGHTED_CJK_RANGES.entries()) for (const [start, end] of ranges) categories.fill(bucket + 1, start, end + 1);
	return categories;
})();
function estimateStringChars(text) {
	return estimateStringCharsWithMinimumRawWeight(text);
}
/** Apply a raw-text safety floor without multiplying CJK adjustments twice. */
function estimateStringCharsWithMinimumRawWeight(text, options = DEFAULT_BUDGET_OPTIONS) {
	const minimumRawWeight = Math.max(1, options.minimumRawWeight ?? 1);
	if (minimumRawWeight !== 1 && minimumRawWeight !== 2) {
		let chars = 0;
		for (const match of text.matchAll(ASCII_RUN_OR_NON_ASCII_CODE_POINT_RE)) {
			const segment = match[0];
			const minimumChars = Math.ceil(segment.length * minimumRawWeight);
			chars += segment.charCodeAt(0) <= 127 ? minimumChars : Math.max(estimateStringChars(segment), minimumChars);
		}
		return chars;
	}
	if (!NON_ASCII_RE.test(text)) return text.length * minimumRawWeight;
	const firstWeighted = text.search(WEIGHTED_CJK_RE);
	if (firstWeighted < 0) return text.length * minimumRawWeight;
	let common = 0;
	let rareBmp = 0;
	let twoToken = 0;
	let threeTokenSupplementary = 0;
	let supplementary = 0;
	for (let index = firstWeighted; index < text.length; index += 1) {
		let codePoint = text.charCodeAt(index);
		if (codePoint < 128) continue;
		if (codePoint >= 55296 && codePoint <= 56319) {
			const low = text.charCodeAt(index + 1);
			if (low >= 56320 && low <= 57343) {
				codePoint = 65536 + (codePoint - 55296) * 1024 + low - 56320;
				index += 1;
			}
		}
		switch (CJK_CATEGORY[codePoint]) {
			case 1:
				common += 1;
				break;
			case 2:
				rareBmp += 1;
				break;
			case 3:
				twoToken += 1;
				break;
			case 4:
				threeTokenSupplementary += 1;
				break;
			case 5: supplementary += 1;
		}
	}
	return text.length * minimumRawWeight + common * (4 - minimumRawWeight) + rareBmp * (12 - minimumRawWeight) + twoToken * (8 - minimumRawWeight) + threeTokenSupplementary * (12 - 2 * minimumRawWeight) + supplementary * (16 - 2 * minimumRawWeight);
}
function estimateTokensFromChars(chars) {
	return Math.ceil(Math.max(0, chars) / 4);
}
//#endregion
export { estimateTokensFromChars as i, estimateStringChars as n, estimateStringCharsWithMinimumRawWeight as r, CHARS_PER_TOKEN_ESTIMATE as t };
