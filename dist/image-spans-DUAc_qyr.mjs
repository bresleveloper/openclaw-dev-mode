import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as MarkdownItCallable } from "./markdown-it-DHkpg-if.mjs";
//#region packages/markdown-core/src/image-spans.ts
let imageParser;
function createImageParser() {
	const md = new MarkdownItCallable("commonmark");
	md.inline.ruler.enableOnly(["image"]);
	const parseImage = expectDefined(md.inline.ruler.getRules("")[0], "Markdown image rule");
	md.configure("commonmark");
	md.core.ruler.disable("inline");
	md.normalizeLink = (url) => url;
	md.validateLink = () => true;
	md.inline.ruler.at("image", (state, silent) => {
		const start = state.pos;
		const matched = parseImage(state, silent);
		if (matched && !silent) state.env.onImage(state, start);
		return matched;
	});
	return md;
}
/** Finds inline image destinations without treating code or escaped syntax as media. */
function findMarkdownImageSpans(markdown) {
	const md = imageParser ??= createImageParser();
	const images = [];
	let source = "";
	let inlineLines = [];
	let inlineLine = 0;
	const sourceOffset = (position) => {
		for (let next = inlineLines[inlineLine + 1]; next && next.start <= position; next = inlineLines[inlineLine + 1]) inlineLine += 1;
		return position + expectDefined(inlineLines[inlineLine], "Markdown inline line").offset;
	};
	const environment = { onImage: (state, start) => {
		if (state.src !== source) return;
		const token = expectDefined(state.tokens.at(-1), "Parsed Markdown image");
		if (token.meta?.label) return;
		images.push({
			start: sourceOffset(start),
			end: sourceOffset(state.pos),
			destination: String(expectDefined(token.attrGet("src"), "Markdown image destination"))
		});
	} };
	const blocks = md.parse(markdown, environment);
	const lineOffsets = [0];
	for (const newline of markdown.matchAll(/\r\n?|\n/g)) lineOffsets.push(newline.index + newline[0].length);
	const sourceLines = markdown.replace(/\0/g, "�").split(/\r\n?|\n/);
	for (const block of blocks) {
		if (block.type !== "inline" || !block.map || !block.content.includes("![")) continue;
		source = block.content;
		const firstLine = block.map[0];
		let start = 0;
		inlineLines = source.split("\n").map((content, index) => {
			const original = expectDefined(sourceLines[firstLine + index], "Markdown source line");
			const text = content.trimStart();
			const offset = expectDefined(lineOffsets[firstLine + index], "Markdown source offset") + original.indexOf(text) - (content.length - text.length) - start;
			const line = {
				start,
				offset
			};
			start += content.length + 1;
			return line;
		});
		inlineLine = 0;
		md.inline.parse(source, md, environment, []);
	}
	return images;
}
//#endregion
export { findMarkdownImageSpans as t };
