import { c as visibleWidth, s as truncateToVisibleWidth } from "./ansi-CWsy0bu4.mjs";
//#region src/commands/text-format.ts
const graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
/** Shortens text to maxLen code points, appending an ellipsis when truncated. */
const shortenText = (value, maxLen) => {
	if (maxLen <= 0) return "";
	if (value.length <= maxLen) return value;
	const chars = Array.from(value.slice(0, (maxLen + 1) * 2));
	return chars.length <= maxLen ? value : `${chars.slice(0, Math.max(0, maxLen - 1)).join("")}…`;
};
/** Fits a plain-text terminal cell using visible width and whole graphemes. */
function formatTextCell(text, width) {
	const overflow = graphemeSegmenter.segment(text).containing(width * 7);
	const bounded = overflow ? `${text.slice(0, overflow.index)}…` : text;
	const boundedWidth = visibleWidth(bounded);
	const fitted = boundedWidth > width ? `${truncateToVisibleWidth(bounded, width - 1)}…` : bounded;
	const fittedWidth = fitted === bounded ? boundedWidth : visibleWidth(fitted);
	return `${fitted}${" ".repeat(width - fittedWidth)}`;
}
//#endregion
export { shortenText as n, formatTextCell as t };
