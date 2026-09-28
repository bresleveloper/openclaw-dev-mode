import { t as avoidTrailingHighSurrogateBreak } from "./utf16-slice-D_ngcYKd.mjs";
//#region packages/normalization-core/src/grapheme.ts
let graphemeSegmenter;
function getGraphemeSegmenter() {
	graphemeSegmenter ??= new Intl.Segmenter(void 0, { granularity: "grapheme" });
	return graphemeSegmenter;
}
/**
* Chooses a whole-grapheme cut within the hard budget, honoring a usable preference.
* If no whole grapheme fits, allowPartial permits a surrogate-safe progress cut;
* a leading surrogate pair can exceed maxEnd by one code unit.
*/
function findGraphemeChunkEnd(text, start, maxEnd, preferredEnd = maxEnd, allowPartial = true) {
	const hardEnd = Math.min(maxEnd, text.length);
	if (hardEnd <= start) return start;
	const preferred = Number.isInteger(preferredEnd) && preferredEnd > start && preferredEnd <= hardEnd ? preferredEnd : hardEnd;
	if (preferred === text.length) return preferred;
	const segments = getGraphemeSegmenter().segment(text);
	let end = segments.containing(preferred)?.index ?? preferred;
	if (end <= start && preferred < hardEnd) end = hardEnd === text.length ? hardEnd : segments.containing(hardEnd)?.index ?? hardEnd;
	return end > start ? end : allowPartial ? avoidTrailingHighSurrogateBreak(text, start, hardEnd) : start;
}
/** Width to reserve for the first whole grapheme, or zero for empty text. */
function firstGraphemeClusterLength(text) {
	if (!text) return 0;
	return getGraphemeSegmenter().segment(text).containing(0)?.segment.length ?? 0;
}
const WHITESPACE_GRAPHEME_RE = /^\s+$/u;
/** Skips only whole whitespace graphemes, never the base of a space-plus-mark cluster. */
function skipWhitespaceGraphemes(text, start = 0, maxGraphemes = Number.POSITIVE_INFINITY) {
	if (!/\s/u.test(text.charAt(start))) return start;
	const segments = getGraphemeSegmenter().segment(text);
	let cursor = start;
	for (let count = 0; count < maxGraphemes && cursor < text.length; count += 1) {
		const cluster = segments.containing(cursor);
		if (!cluster || cluster.index !== cursor || !WHITESPACE_GRAPHEME_RE.test(cluster.segment)) break;
		cursor += cluster.segment.length;
	}
	return cursor;
}
/** Trims only whole trailing whitespace graphemes from a source prefix. */
function trimEndWhitespaceGraphemes(text, end = text.length) {
	if (!/\s/u.test(text.charAt(end - 1))) return text.slice(0, end);
	const segments = getGraphemeSegmenter().segment(text);
	let cursor = end;
	while (cursor > 0) {
		const cluster = segments.containing(cursor - 1);
		if (!cluster || cluster.index + cluster.segment.length > cursor || !WHITESPACE_GRAPHEME_RE.test(cluster.segment)) break;
		cursor = cluster.index;
	}
	return text.slice(0, cursor);
}
//#endregion
export { trimEndWhitespaceGraphemes as i, firstGraphemeClusterLength as n, skipWhitespaceGraphemes as r, findGraphemeChunkEnd as t };
