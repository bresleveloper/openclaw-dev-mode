import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as findMarkdownCodeRegions, r as parseMarkdownOwnership } from "./reasoning-tags-DOZ8HVZL.mjs";
//#region src/shared/text/code-regions.ts
/** Index nonempty native parts using the visible text owner's newline separator. */
function indexTextParts(parts) {
	const spans = [];
	const texts = [];
	let offset = 0;
	parts.forEach((part, index) => {
		if (!part) return;
		if (spans.length) offset += 1;
		const start = offset;
		texts.push(part);
		offset += part.length;
		spans.push({
			index,
			start,
			end: offset
		});
	});
	return {
		text: texts.join("\n"),
		spans
	};
}
/** One canonical code scan for a stage's immutable native text parts. */
function createTextPartCodeRegionResolver(parts) {
	const source = indexTextParts(parts);
	const spans = new Map(source.spans.map((span) => [span.index, span]));
	let regions;
	const projected = /* @__PURE__ */ new Map();
	return (index) => {
		const cached = projected.get(index);
		if (cached) return cached;
		const span = spans.get(index);
		if (!span) return [];
		regions ??= findMarkdownCodeRegions(source.text);
		let low = 0;
		let high = regions.length;
		while (low < high) {
			const middle = low + high >>> 1;
			if (expectDefined(regions[middle], "indexed code region").end <= span.start) low = middle + 1;
			else high = middle;
		}
		const result = [];
		for (let at = low; at < regions.length; at++) {
			const region = expectDefined(regions[at], "projected code region");
			if (region.start >= span.end) break;
			result.push({
				start: Math.max(0, region.start - span.start),
				end: Math.min(span.end, region.end) - span.start,
				block: region.block
			});
		}
		projected.set(index, result);
		return result;
	};
}
/** Canonical code ranges, stable-prefix boundary, and completed top-level paragraphs. */
function findCodeOwnership(text, options) {
	const { regions, retainStart, completedParagraphs, paragraphs } = parseMarkdownOwnership(text, options);
	return {
		regions,
		retainStart,
		completedParagraphs,
		...paragraphs ? { paragraphs } : {}
	};
}
function isInsideCode(pos, regions) {
	return regions.some((region) => pos >= region.start && pos < region.end);
}
/** Removes control lines while retaining literal code and original line endings. */
function stripLinesOutsideCode(text, shouldStrip) {
	let regions;
	return text.replace(/[^\n]*(?:\n|$)/g, (raw, offset) => {
		return shouldStrip(raw.endsWith("\n") ? raw.slice(0, -1).replace(/\r$/, "") : raw) && !isInsideCode(offset, regions ??= findMarkdownCodeRegions(text)) ? "" : raw;
	});
}
function isInsideSettledBlockCode(pos, text, regions) {
	return regions.some((region) => region.block && region.start <= pos && pos < region.end && /[\r\n]/.test(text.slice(region.start, pos)));
}
/** Bounded marker-free reuse; complex Markdown retains the canonical parser. */
function canReuseMarkdownOwnership(previousText, nextText, ownership) {
	if (ownership || !nextText.startsWith(previousText)) return false;
	const boundary = previousText.slice(-4) + nextText.slice(previousText.length);
	return !/[\x60~\t|\r[\]():-]| {4}/u.test(boundary);
}
//#endregion
export { isInsideCode as a, indexTextParts as i, createTextPartCodeRegionResolver as n, isInsideSettledBlockCode as o, findCodeOwnership as r, stripLinesOutsideCode as s, canReuseMarkdownOwnership as t };
