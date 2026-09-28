//#region node_modules/.pnpm/ansi-regex@6.3.0/node_modules/ansi-regex/index.js
function ansiRegex({ onlyFirst = false } = {}) {
	return new RegExp(`(?:\\u001B\\][^\\u0007\\u001B\\u009C]*(?:\\u0007|\\u001B\\u005C|\\u009C))|[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]`, onlyFirst ? void 0 : "g");
}
//#endregion
//#region node_modules/.pnpm/strip-ansi@7.2.0/node_modules/strip-ansi/index.js
const regex = ansiRegex();
function stripAnsi$1(string) {
	if (typeof string !== "string") throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
	if (!string.includes("\x1B") && !string.includes("")) return string;
	return string.replace(regex, "");
}
const ambiguousRanges = [
	161,
	161,
	164,
	164,
	167,
	168,
	170,
	170,
	173,
	174,
	176,
	180,
	182,
	186,
	188,
	191,
	198,
	198,
	208,
	208,
	215,
	216,
	222,
	225,
	230,
	230,
	232,
	234,
	236,
	237,
	240,
	240,
	242,
	243,
	247,
	250,
	252,
	252,
	254,
	254,
	257,
	257,
	273,
	273,
	275,
	275,
	283,
	283,
	294,
	295,
	299,
	299,
	305,
	307,
	312,
	312,
	319,
	322,
	324,
	324,
	328,
	331,
	333,
	333,
	338,
	339,
	358,
	359,
	363,
	363,
	462,
	462,
	464,
	464,
	466,
	466,
	468,
	468,
	470,
	470,
	472,
	472,
	474,
	474,
	476,
	476,
	593,
	593,
	609,
	609,
	708,
	708,
	711,
	711,
	713,
	715,
	717,
	717,
	720,
	720,
	728,
	731,
	733,
	733,
	735,
	735,
	768,
	879,
	913,
	929,
	931,
	937,
	945,
	961,
	963,
	969,
	1025,
	1025,
	1040,
	1103,
	1105,
	1105,
	8208,
	8208,
	8211,
	8214,
	8216,
	8217,
	8220,
	8221,
	8224,
	8226,
	8228,
	8231,
	8240,
	8240,
	8242,
	8243,
	8245,
	8245,
	8251,
	8251,
	8254,
	8254,
	8308,
	8308,
	8319,
	8319,
	8321,
	8324,
	8364,
	8364,
	8451,
	8451,
	8453,
	8453,
	8457,
	8457,
	8467,
	8467,
	8470,
	8470,
	8481,
	8482,
	8486,
	8486,
	8491,
	8491,
	8531,
	8532,
	8539,
	8542,
	8544,
	8555,
	8560,
	8569,
	8585,
	8585,
	8592,
	8601,
	8632,
	8633,
	8658,
	8658,
	8660,
	8660,
	8679,
	8679,
	8704,
	8704,
	8706,
	8707,
	8711,
	8712,
	8715,
	8715,
	8719,
	8719,
	8721,
	8721,
	8725,
	8725,
	8730,
	8730,
	8733,
	8736,
	8739,
	8739,
	8741,
	8741,
	8743,
	8748,
	8750,
	8750,
	8756,
	8759,
	8764,
	8765,
	8776,
	8776,
	8780,
	8780,
	8786,
	8786,
	8800,
	8801,
	8804,
	8807,
	8810,
	8811,
	8814,
	8815,
	8834,
	8835,
	8838,
	8839,
	8853,
	8853,
	8857,
	8857,
	8869,
	8869,
	8895,
	8895,
	8978,
	8978,
	9312,
	9449,
	9451,
	9547,
	9552,
	9587,
	9600,
	9615,
	9618,
	9621,
	9632,
	9633,
	9635,
	9641,
	9650,
	9651,
	9654,
	9655,
	9660,
	9661,
	9664,
	9665,
	9670,
	9672,
	9675,
	9675,
	9678,
	9681,
	9698,
	9701,
	9711,
	9711,
	9733,
	9734,
	9737,
	9737,
	9742,
	9743,
	9756,
	9756,
	9758,
	9758,
	9792,
	9792,
	9794,
	9794,
	9824,
	9825,
	9827,
	9829,
	9831,
	9834,
	9836,
	9837,
	9839,
	9839,
	9886,
	9887,
	9919,
	9919,
	9926,
	9933,
	9935,
	9939,
	9941,
	9953,
	9955,
	9955,
	9960,
	9961,
	9963,
	9969,
	9972,
	9972,
	9974,
	9977,
	9979,
	9980,
	9982,
	9983,
	10045,
	10045,
	10102,
	10111,
	11094,
	11097,
	12872,
	12879,
	57344,
	63743,
	65024,
	65039,
	65533,
	65533,
	127232,
	127242,
	127248,
	127277,
	127280,
	127337,
	127344,
	127373,
	127375,
	127376,
	127387,
	127404,
	917760,
	917999,
	983040,
	1048573,
	1048576,
	1114109
];
const fullwidthRanges = [
	12288,
	12288,
	65281,
	65376,
	65504,
	65510
];
const halfwidthRanges = [
	8361,
	8361,
	65377,
	65470,
	65474,
	65479,
	65482,
	65487,
	65490,
	65495,
	65498,
	65500,
	65512,
	65518
];
const narrowRanges = [
	32,
	126,
	162,
	163,
	165,
	166,
	172,
	172,
	175,
	175,
	10214,
	10221,
	10629,
	10630
];
const wideRanges = [
	4352,
	4447,
	8986,
	8987,
	9001,
	9002,
	9193,
	9196,
	9200,
	9200,
	9203,
	9203,
	9725,
	9726,
	9748,
	9749,
	9776,
	9783,
	9800,
	9811,
	9855,
	9855,
	9866,
	9871,
	9875,
	9875,
	9889,
	9889,
	9898,
	9899,
	9917,
	9918,
	9924,
	9925,
	9934,
	9934,
	9940,
	9940,
	9962,
	9962,
	9970,
	9971,
	9973,
	9973,
	9978,
	9978,
	9981,
	9981,
	9989,
	9989,
	9994,
	9995,
	10024,
	10024,
	10060,
	10060,
	10062,
	10062,
	10067,
	10069,
	10071,
	10071,
	10133,
	10135,
	10160,
	10160,
	10175,
	10175,
	11035,
	11036,
	11088,
	11088,
	11093,
	11093,
	11904,
	11929,
	11931,
	12019,
	12032,
	12245,
	12272,
	12287,
	12289,
	12350,
	12353,
	12438,
	12441,
	12543,
	12549,
	12591,
	12593,
	12686,
	12688,
	12773,
	12783,
	12830,
	12832,
	12871,
	12880,
	42124,
	42128,
	42182,
	43360,
	43388,
	44032,
	55203,
	63744,
	64255,
	65040,
	65049,
	65072,
	65106,
	65108,
	65126,
	65128,
	65131,
	94176,
	94180,
	94192,
	94198,
	94208,
	101589,
	101631,
	101662,
	101760,
	101874,
	110576,
	110579,
	110581,
	110587,
	110589,
	110590,
	110592,
	110882,
	110898,
	110898,
	110928,
	110930,
	110933,
	110933,
	110948,
	110951,
	110960,
	111355,
	119552,
	119638,
	119648,
	119670,
	126980,
	126980,
	127183,
	127183,
	127374,
	127374,
	127377,
	127386,
	127488,
	127490,
	127504,
	127547,
	127552,
	127560,
	127568,
	127569,
	127584,
	127589,
	127744,
	127776,
	127789,
	127797,
	127799,
	127868,
	127870,
	127891,
	127904,
	127946,
	127951,
	127955,
	127968,
	127984,
	127988,
	127988,
	127992,
	128062,
	128064,
	128064,
	128066,
	128252,
	128255,
	128317,
	128331,
	128334,
	128336,
	128359,
	128378,
	128378,
	128405,
	128406,
	128420,
	128420,
	128507,
	128591,
	128640,
	128709,
	128716,
	128716,
	128720,
	128722,
	128725,
	128728,
	128732,
	128735,
	128747,
	128748,
	128756,
	128764,
	128992,
	129003,
	129008,
	129008,
	129292,
	129338,
	129340,
	129349,
	129351,
	129535,
	129648,
	129660,
	129664,
	129674,
	129678,
	129734,
	129736,
	129736,
	129741,
	129756,
	129759,
	129770,
	129775,
	129784,
	131072,
	196605,
	196608,
	262141
];
//#endregion
//#region node_modules/.pnpm/get-east-asian-width@1.6.0/node_modules/get-east-asian-width/utilities.js
/**
Binary search on a sorted flat array of [start, end] pairs.

@param {number[]} ranges - Flat array of inclusive [start, end] range pairs, e.g. [0, 5, 10, 20].
@param {number} codePoint - The value to search for.
@returns {boolean} Whether the value falls within any of the ranges.
*/
const isInRange = (ranges, codePoint) => {
	let low = 0;
	let high = Math.floor(ranges.length / 2) - 1;
	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const i = mid * 2;
		if (codePoint < ranges[i]) high = mid - 1;
		else if (codePoint > ranges[i + 1]) low = mid + 1;
		else return true;
	}
	return false;
};
//#endregion
//#region node_modules/.pnpm/get-east-asian-width@1.6.0/node_modules/get-east-asian-width/lookup.js
const commonCjkCodePoint = 19968;
const [wideFastPathStart, wideFastPathEnd] = /* #__PURE__ */ findWideFastPathRange(wideRanges);
function findWideFastPathRange(ranges) {
	let fastPathStart = ranges[0];
	let fastPathEnd = ranges[1];
	for (let index = 0; index < ranges.length; index += 2) {
		const start = ranges[index];
		const end = ranges[index + 1];
		if (commonCjkCodePoint >= start && commonCjkCodePoint <= end) return [start, end];
		if (end - start > fastPathEnd - fastPathStart) {
			fastPathStart = start;
			fastPathEnd = end;
		}
	}
	return [fastPathStart, fastPathEnd];
}
const isAmbiguous = (codePoint) => {
	if (codePoint < 161 || codePoint > 1114109) return false;
	return isInRange(ambiguousRanges, codePoint);
};
const isFullWidth = (codePoint) => {
	if (codePoint < 12288 || codePoint > 65510) return false;
	return isInRange(fullwidthRanges, codePoint);
};
const isHalfWidth = (codePoint) => {
	if (codePoint < 8361 || codePoint > 65518) return false;
	return isInRange(halfwidthRanges, codePoint);
};
const isNarrow = (codePoint) => {
	if (codePoint < 32 || codePoint > 10630) return false;
	return isInRange(narrowRanges, codePoint);
};
const isWide = (codePoint) => {
	if (codePoint >= wideFastPathStart && codePoint <= wideFastPathEnd) return true;
	if (codePoint < 4352 || codePoint > 262141) return false;
	return isInRange(wideRanges, codePoint);
};
function getCategory(codePoint) {
	if (isAmbiguous(codePoint)) return "ambiguous";
	if (isFullWidth(codePoint)) return "fullwidth";
	if (isHalfWidth(codePoint)) return "halfwidth";
	if (isNarrow(codePoint)) return "narrow";
	if (isWide(codePoint)) return "wide";
	return "neutral";
}
//#endregion
//#region node_modules/.pnpm/get-east-asian-width@1.6.0/node_modules/get-east-asian-width/index.js
function validate(codePoint) {
	if (!Number.isSafeInteger(codePoint)) throw new TypeError(`Expected a code point, got \`${typeof codePoint}\`.`);
}
function eastAsianWidthType(codePoint) {
	validate(codePoint);
	return getCategory(codePoint);
}
function eastAsianWidth(codePoint, { ambiguousAsWide = false } = {}) {
	validate(codePoint);
	if (isFullWidth(codePoint) || isWide(codePoint) || ambiguousAsWide && isAmbiguous(codePoint)) return 2;
	return 1;
}
//#endregion
//#region node_modules/.pnpm/string-width@8.2.2/node_modules/string-width/index.js
/**
Logic:
- Segment graphemes to match how terminals render clusters.
- Width rules:
1. Skip non-printing clusters (Default_Ignorable, Control, pure nonspacing/enclosing Mark, lone Surrogates). Tabs are ignored by design.
2. RGI emoji clusters (\p{RGI_Emoji}) are double-width.
3. Minimally-qualified/unqualified emoji clusters (ZWJ sequences with 2+ Extended_Pictographic, or keycap sequences) are double-width.
4. Hangul jamo collapse each standard modern Hangul L+V or L+V+T syllable piece to width 2.
Unmatched repeated leading/vowel/trailing jamo stay additive because that matches how the terminals we target render them.
5. Otherwise use East Asian Width of the cluster's first visible code point, and add widths for trailing spacing marks and Halfwidth/Fullwidth Forms within the same cluster (e.g., dakuten/handakuten/prolonged sound mark).
*/
const segmenter = new Intl.Segmenter();
const zeroWidthClusterRegex = /^(?:\p{Default_Ignorable_Code_Point}|\p{Control}|\p{Format}|\p{Nonspacing_Mark}|\p{Enclosing_Mark}|\p{Surrogate})+$/v;
const leadingNonPrintingRegex = /^[\p{Default_Ignorable_Code_Point}\p{Control}\p{Format}\p{Nonspacing_Mark}\p{Enclosing_Mark}\p{Surrogate}]+/v;
const spacingMarkRegex = /\p{Spacing_Mark}/v;
const rgiEmojiRegex = /^\p{RGI_Emoji}$/v;
const unqualifiedKeycapRegex = /^[\d#*]\u20E3$/;
const extendedPictographicRegex = /\p{Extended_Pictographic}/gu;
function isDoubleWidthNonRgiEmojiSequence(segment) {
	if (segment.length > 50) return false;
	if (unqualifiedKeycapRegex.test(segment)) return true;
	if (segment.includes("‍")) {
		const pictographics = segment.match(extendedPictographicRegex);
		return pictographics !== null && pictographics.length >= 2;
	}
	return false;
}
function baseVisible(segment) {
	return segment.replace(leadingNonPrintingRegex, "");
}
function isZeroWidthCluster(segment) {
	return zeroWidthClusterRegex.test(segment);
}
function isHangulLeadingJamo(codePoint) {
	return codePoint >= 4352 && codePoint <= 4447 || codePoint >= 43360 && codePoint <= 43388;
}
function isHangulVowelJamo(codePoint) {
	return codePoint >= 4448 && codePoint <= 4519 || codePoint >= 55216 && codePoint <= 55238;
}
function isHangulTrailingJamo(codePoint) {
	return codePoint >= 4520 && codePoint <= 4607 || codePoint >= 55243 && codePoint <= 55291;
}
function isHangulJamo(codePoint) {
	return isHangulLeadingJamo(codePoint) || isHangulVowelJamo(codePoint) || isHangulTrailingJamo(codePoint);
}
function hangulClusterWidth(visibleSegment, eastAsianWidthOptions) {
	const codePoints = [];
	for (const character of visibleSegment) {
		if (zeroWidthClusterRegex.test(character)) continue;
		codePoints.push(character.codePointAt(0));
	}
	if (codePoints.length === 0) return;
	let width = 0;
	for (let index = 0; index < codePoints.length; index++) {
		const codePoint = codePoints[index];
		if (!isHangulJamo(codePoint)) {
			if (width === 0) return;
			for (let remaining = index; remaining < codePoints.length; remaining++) width += eastAsianWidth(codePoints[remaining], eastAsianWidthOptions);
			return width;
		}
		if (isHangulLeadingJamo(codePoint) && isHangulVowelJamo(codePoints[index + 1])) {
			width += 2;
			index += isHangulTrailingJamo(codePoints[index + 2]) ? 2 : 1;
			continue;
		}
		width += eastAsianWidth(codePoint, eastAsianWidthOptions);
	}
	return width;
}
function trailingWidth(visibleSegment, eastAsianWidthOptions) {
	let extra = 0;
	let first = true;
	for (const character of visibleSegment) {
		if (first) {
			first = false;
			continue;
		}
		if (spacingMarkRegex.test(character) || character >= "＀" && character <= "￯") extra += eastAsianWidth(character.codePointAt(0), eastAsianWidthOptions);
	}
	return extra;
}
function stringWidth(input, options = {}) {
	if (typeof input !== "string" || input.length === 0) return 0;
	const { ambiguousIsNarrow = true, countAnsiEscapeCodes = false } = options;
	let string = input;
	if (!countAnsiEscapeCodes && (string.includes("\x1B") || string.includes(""))) string = stripAnsi$1(string);
	if (string.length === 0) return 0;
	if (/^[\u0020-\u007E]*$/.test(string)) return string.length;
	let width = 0;
	const eastAsianWidthOptions = { ambiguousAsWide: !ambiguousIsNarrow };
	for (const { segment } of segmenter.segment(string)) {
		if (isZeroWidthCluster(segment)) continue;
		if (rgiEmojiRegex.test(segment) || isDoubleWidthNonRgiEmojiSequence(segment)) {
			width += 2;
			continue;
		}
		const visibleSegment = baseVisible(segment);
		const hangulWidth = hangulClusterWidth(visibleSegment, eastAsianWidthOptions);
		if (hangulWidth !== void 0) {
			width += hangulWidth;
			continue;
		}
		const codePoint = visibleSegment.codePointAt(0);
		width += eastAsianWidth(codePoint, eastAsianWidthOptions);
		width += trailingWidth(visibleSegment, eastAsianWidthOptions);
	}
	return width;
}
//#endregion
//#region packages/terminal-core/src/ansi-sequences.ts
const ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
const ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
const ANSI_OSC_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`;
const ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
const ansiOscAtIndexRegex = new RegExp(ANSI_OSC_PATTERN, "y");
function matchAnsiOscAt(input, index) {
	ansiOscAtIndexRegex.lastIndex = index;
	return ansiOscAtIndexRegex.exec(input)?.[0];
}
function csiIntroducerLength(input, index) {
	const code = input.charCodeAt(index);
	if (code === 155) return 1;
	return code === 27 && input.charCodeAt(index + 1) === 91 ? 2 : 0;
}
function isCompatPrefixCode(code) {
	return code === 91 || code === 93 || code === 40 || code === 41 || code === 35 || code === 59 || code === 63;
}
function isCompatParameterCode(code) {
	return code >= 48 && code <= 57 || code === 58 || code === 59;
}
function isDigitCode(code) {
	return code >= 48 && code <= 57;
}
function isCompatFinalCode(code) {
	return code >= 48 && code <= 57 || code >= 64 && code <= 90 || code === 99 || code >= 102 && code <= 110 || code >= 113 && code <= 117 || code === 121 || code === 61 || code === 62 || code === 60 || code === 126;
}
/**
* Incrementally strip the ANSI grammar accepted by the agent output sanitizer.
* Parser state stays constant-size so unterminated OSC payloads cannot escape
* or accumulate outside the caller's output limits.
*/
var AnsiSequenceStripper = class {
	constructor(onCsi) {
		this.onCsi = onCsi;
		this.state = "text";
		this.csiCompatPrefixOnly = false;
		this.compatInParameters = false;
		this.compatParameterDigits = 0;
	}
	startCsi() {
		this.state = "csi";
		this.csiCompatPrefixOnly = true;
		this.csi = this.onCsi ? "" : void 0;
	}
	write(input) {
		if (typeof input !== "string") throw new TypeError(`Expected a \`string\`, got \`${typeof input}\``);
		if (this.state === "text" && !input.includes("\x1B") && !input.includes("") && !input.includes("")) return input;
		const output = [];
		let index = 0;
		while (index < input.length) {
			const code = input.charCodeAt(index);
			if (this.state === "text") {
				if (code === 27) this.state = "escape";
				else if (code === 155) this.startCsi();
				else if (code === 157) this.state = "osc";
				else output.push(input.charAt(index));
				index += 1;
				continue;
			}
			if (this.state === "osc") {
				if (code === 7 || code === 156) this.state = "text";
				else if (code === 27) this.state = "osc-escape";
				index += 1;
				continue;
			}
			if (this.state === "osc-escape") {
				if (code === 92 || code === 7 || code === 156) this.state = "text";
				else if (code !== 27) this.state = "osc";
				index += 1;
				continue;
			}
			if (code === 27 || code === 155 || code === 157) {
				if (code === 155) this.startCsi();
				else this.state = code === 27 ? "escape" : "osc";
				index += 1;
				continue;
			}
			if (this.state === "csi") {
				if (code === 24 || code === 26) {
					this.state = "text";
					index += 1;
				} else if (code <= 31 || code === 127) {
					output.push(input.charAt(index));
					index += 1;
				} else if (code >= 32 && code <= 63) {
					if (this.csi !== void 0) this.csi = this.csi.length < 64 ? this.csi + input.charAt(index) : void 0;
					if (!isCompatPrefixCode(code)) this.csiCompatPrefixOnly = false;
					index += 1;
				} else if ((code === 91 || code === 93) && this.csiCompatPrefixOnly) {
					this.state = "compat";
					this.compatInParameters = false;
					this.compatParameterDigits = 0;
					index += 1;
				} else if (code >= 64 && code <= 126) {
					if (this.csi !== void 0) this.onCsi?.(this.csi + input.charAt(index));
					this.state = "text";
					index += 1;
				} else this.state = "text";
				continue;
			}
			if (this.state === "escape") {
				if (code === 93) {
					this.state = "osc";
					index += 1;
				} else if (code === 91) {
					this.startCsi();
					index += 1;
				} else if (isCompatPrefixCode(code)) {
					this.state = "compat";
					this.compatInParameters = false;
					this.compatParameterDigits = 0;
					index += 1;
				} else if (isDigitCode(code)) {
					this.state = "compat";
					this.compatInParameters = true;
					this.compatParameterDigits = 1;
					index += 1;
				} else if (isCompatFinalCode(code)) {
					this.state = "text";
					index += 1;
				} else this.state = "text";
				continue;
			}
			if (code === 24 || code === 26) {
				this.state = "text";
				index += 1;
			} else if (!this.compatInParameters && isCompatPrefixCode(code)) index += 1;
			else if (!this.compatInParameters && isDigitCode(code)) {
				this.compatInParameters = true;
				this.compatParameterDigits = 1;
				index += 1;
			} else if (this.compatInParameters && isCompatParameterCode(code)) {
				if (code === 58 || code === 59) {
					this.compatParameterDigits = 0;
					index += 1;
				} else if (this.compatParameterDigits < 4) {
					this.compatParameterDigits += 1;
					index += 1;
				} else {
					this.state = "text";
					index += 1;
				}
			} else if (isCompatFinalCode(code)) {
				this.state = "text";
				index += 1;
			} else this.state = "text";
		}
		return output.join("");
	}
	finish() {
		this.csi = void 0;
		this.state = "text";
		this.csiCompatPrefixOnly = false;
		this.compatInParameters = false;
		this.compatParameterDigits = 0;
		return "";
	}
};
/** Scan one CSI parser pass, retaining independently executed C0 controls. */
function scanAnsiCsiAt(input, index) {
	const introducerLength = csiIntroducerLength(input, index);
	if (introducerLength === 0) return;
	let cursor = index + introducerLength;
	const controls = [];
	let ended = false;
	while (cursor < input.length) {
		const code = input.charCodeAt(cursor);
		if (code === 24 || code === 26) {
			cursor += 1;
			ended = true;
			break;
		}
		if (code === 27 || code === 155) {
			ended = true;
			break;
		}
		if (code <= 31 || code === 127) {
			controls.push(input.charAt(cursor));
			cursor += 1;
			continue;
		}
		if (code >= 32 && code <= 63) {
			cursor += 1;
			continue;
		}
		if (code >= 64 && code <= 126) cursor += 1;
		ended = true;
		break;
	}
	return {
		controls,
		ended,
		value: input.slice(index, cursor)
	};
}
function* iterateAnsiSegments(input) {
	let position = 0;
	let index = 0;
	while (index < input.length) {
		const code = input.charCodeAt(index);
		if (code !== 27 && code !== 155 && code !== 157) {
			index += 1;
			continue;
		}
		const osc = matchAnsiOscAt(input, index);
		const csi = osc ? void 0 : scanAnsiCsiAt(input, index);
		const value = osc ?? csi?.value;
		if (!value) {
			index += 1;
			continue;
		}
		if (index > position) yield {
			kind: "text",
			value: input.slice(position, index)
		};
		yield {
			controls: csi?.controls ?? [],
			kind: "ansi",
			value
		};
		index += value.length;
		position = index;
	}
	if (position < input.length) yield {
		kind: "text",
		value: input.slice(position)
	};
}
const ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX = new RegExp(`${`${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`}|${ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN}`, "y");
const graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function hasAnsiIntroducer(input) {
	return input.includes("\x1B") || input.includes("") || input.includes("");
}
/**
* Strip ANSI against original input positions so one removal cannot synthesize
* a second sequence. C0 controls execute without ending CSI, CAN/SUB cancel it,
* and ESC restarts escape parsing.
*/
function stripAnsiInternal(input, options) {
	const output = [];
	let copyStart = 0;
	let index = 0;
	while (index < input.length) {
		const introducerCode = input.charCodeAt(index);
		if (introducerCode !== 27 && introducerCode !== 155 && introducerCode !== 157) {
			index += 1;
			continue;
		}
		const osc = matchAnsiOscAt(input, index);
		if (osc) {
			output.push(input.slice(copyStart, index));
			index += osc.length;
			copyStart = index;
			continue;
		}
		const csi = scanAnsiCsiAt(input, index);
		ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.lastIndex = index;
		const compatibilityMatch = options.compatibilityGrammar ? ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.exec(input) : null;
		if (!csi) {
			if (compatibilityMatch) {
				output.push(input.slice(copyStart, index));
				index += compatibilityMatch[0].length;
				copyStart = index;
				continue;
			}
			index += 1;
			continue;
		}
		if (!csi.ended && options.preserveIncompleteCsi) break;
		let cursor = index + csi.value.length;
		const canonicalLength = csi.value.length;
		if (csi.controls.length === 0 && compatibilityMatch && compatibilityMatch[0].length > canonicalLength) cursor = index + compatibilityMatch[0].length;
		output.push(input.slice(copyStart, index), ...csi.controls);
		index = cursor;
		copyStart = cursor;
	}
	output.push(input.slice(copyStart));
	return output.join("");
}
function stripAnsi(input) {
	if (!hasAnsiIntroducer(input)) return input;
	return stripAnsiInternal(input, { compatibilityGrammar: false });
}
function stripAnsiSequences(input) {
	if (typeof input !== "string") throw new TypeError(`Expected a \`string\`, got \`${typeof input}\``);
	if (!hasAnsiIntroducer(input)) return input;
	return stripAnsiInternal(input, { compatibilityGrammar: true });
}
/** Preserve pending CSI visibly because an output chunk boundary is not true EOF. */
function stripAnsiForStreamChunk(input, options) {
	if (!hasAnsiIntroducer(input)) return input;
	return stripAnsiInternal(input, {
		compatibilityGrammar: options?.compatibilityGrammar === true,
		preserveIncompleteCsi: true
	});
}
/** Let sequential renderers consume graphemes without retaining a full-run array. */
function* iterateGraphemes(input) {
	for (const { segment } of graphemeSegmenter.segment(input)) yield segment;
}
function splitGraphemes(input) {
	if (!input) return [];
	return Array.from(graphemeSegmenter.segment(input), (segment) => segment.segment);
}
const LOG_CONTROL_CHARS_REGEX = new RegExp(`[${String.fromCharCode(0)}-${String.fromCharCode(31)}${String.fromCharCode(127)}-${String.fromCharCode(159)}]`, "g");
/**
* Sanitize a value for safe interpolation into log messages.
* Strips ANSI escape sequences, C0/C1 control characters, and DEL to
* prevent log forging / terminal escape injection (CWE-117).
*/
function sanitizeForLog(v) {
	return stripAnsi(v).replace(LOG_CONTROL_CHARS_REGEX, "");
}
function textWidth(text) {
	let width = stringWidth(/[\u115F\u3164\uFFA0\uD800-\uDFFF]/u.test(text) ? text.replace(/[\uD800-\uDFFF]/gu, "�").replaceAll("ᅟ", "ᄀ").replaceAll("ㅤ", "ㄱ").replaceAll("ﾠ", "ﾊ") : text, { countAnsiEscapeCodes: true });
	for (let index = text.indexOf("	"); index !== -1; index = text.indexOf("	", index + 1)) width += 1;
	return width;
}
function visibleWidth(input) {
	return textWidth(stripAnsi(input));
}
/**
* Truncate to at most `maxWidth` visible columns, dropping whole grapheme
* clusters that would overflow while preserving zero-width ANSI sequences
* verbatim. Independently executed controls inside CSI count toward the budget
* while the containing sequence stays atomic. A single wide grapheme that
* cannot fit is dropped whole, so `visibleWidth(result) <= maxWidth`.
*/
function truncateToVisibleWidth(input, maxWidth) {
	if (maxWidth <= 0) return "";
	const plainInput = stripAnsi(input);
	const inputWidth = textWidth(plainInput);
	if (inputWidth <= maxWidth) return input;
	let out = "";
	let used = 0;
	let budgetSpent = false;
	const appendVisible = (segment) => {
		if (budgetSpent) return;
		const remaining = maxWidth - used;
		const width = segment === plainInput ? inputWidth : textWidth(segment);
		if (width <= remaining) {
			out += segment;
			used += width;
			return;
		}
		const segments = graphemeSegmenter.segment(segment);
		const measurePrefix = remaining <= width / 2;
		let current;
		let candidateWidth = 0;
		let low = 0;
		let high = segment.length;
		let end = 0;
		let fittedWidth = 0;
		const fits = (position) => {
			if (position === segment.length) return false;
			if (!current || position < current.index || position >= current.index + current.segment.length) {
				current = segments.containing(position);
				candidateWidth = current.index === 0 ? 0 : measurePrefix ? textWidth(segment.slice(0, current.index)) : width - textWidth(segment.slice(current.index));
			}
			if (candidateWidth > remaining) return false;
			end = current.index;
			fittedWidth = candidateWidth;
			return true;
		};
		let probe = Math.min(segment.length - 1, Math.floor(remaining * segment.length / width));
		let fitting = fits(probe);
		const initiallyFits = fitting;
		let stride = 1;
		while (low < high) {
			if (fitting) low = probe;
			else high = probe;
			if (fitting !== initiallyFits || probe === 0 || probe === segment.length) break;
			probe = initiallyFits ? Math.min(segment.length, probe + stride) : Math.max(0, probe - stride);
			stride *= 2;
			fitting = fits(probe);
		}
		while (low + 1 < high) {
			const middle = Math.floor((low + high) / 2);
			if (fits(middle)) low = middle;
			else high = middle;
		}
		out += segment.slice(0, end);
		used += fittedWidth;
		budgetSpent = true;
	};
	for (const segment of iterateAnsiSegments(input)) if (segment.kind === "ansi") {
		const controlWidth = segment.controls.filter((control) => control === "	").length;
		if (!budgetSpent && used + controlWidth <= maxWidth) {
			out += segment.value;
			used += controlWidth;
		} else if (controlWidth > 0) {
			out += segment.value.replaceAll("	", "");
			budgetSpent = true;
		} else out += segment.value;
	} else appendVisible(segment.value);
	return out;
}
//#endregion
export { stripAnsiForStreamChunk as a, visibleWidth as c, eastAsianWidthType as d, stripAnsi as i, AnsiSequenceStripper as l, sanitizeForLog as n, stripAnsiSequences as o, splitGraphemes as r, truncateToVisibleWidth as s, iterateGraphemes as t, iterateAnsiSegments as u };
