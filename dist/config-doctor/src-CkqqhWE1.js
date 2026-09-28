import "./number-coercion-fuMteyiI.js";
//#region packages/normalization-core/src/cjk-chars.ts
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
new RegExp(`[${WEIGHTED_CJK_RANGES.flatMap((ranges) => ranges.map(([start, end]) => `\\u{${start.toString(16)}}-\\u{${end.toString(16)}}`)).join("")}]`, "u");
(() => {
	const maxCodePoint = Math.max(...WEIGHTED_CJK_RANGES.flatMap((ranges) => ranges.map(([, end]) => end)));
	const categories = new Uint8Array(maxCodePoint + 1);
	for (const [bucket, ranges] of WEIGHTED_CJK_RANGES.entries()) for (const [start, end] of ranges) categories.fill(bucket + 1, start, end + 1);
	return categories;
})();
//#endregion
export {};
