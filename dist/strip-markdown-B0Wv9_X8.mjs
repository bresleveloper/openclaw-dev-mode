import { r as parseMarkdownOwnership } from "./reasoning-tags-Du_476pm.mjs";
import { a as markdownToIR, b as tokenizeHtmlTags, g as mergeStyleSpans, h as mergeAnnotationSpans, p as createStyleSpan, t as appendMarkdownIR, u as sliceMarkdownIRRanges, v as copyHtmlTags, x as findAssistantTranscriptRoleHeaderSpans, y as matchMarkdownHtmlTag } from "./ir-CdrgmCrl.mjs";
import { a as readRawTextBounds, t as RAW_TEXT_TAGS } from "./html-scanner-3p55PREi.mjs";
//#region packages/markdown-core/src/construct-fallbacks.ts
const STYLE_CONSTRUCTS = {
	bold: "bold",
	italic: "italic",
	underline: "underline",
	strikethrough: "strikethrough",
	spoiler: "spoiler",
	code: "codeInline",
	code_block: "codeBlock",
	blockquote: "blockquote"
};
function isHeading(style) {
	return style.startsWith("heading_");
}
function projectStyles(styles, profile) {
	const projected = [];
	let synthesizedHeading = false;
	for (const span of styles) {
		if (isHeading(span.style)) {
			if (profile.constructs.heading === "native") projected.push(span);
			else if (profile.constructs.heading === "fallback" && profile.constructs.bold === "native") {
				projected.push(createStyleSpan({
					...span,
					style: "bold"
				}));
				synthesizedHeading = true;
			}
			continue;
		}
		const construct = STYLE_CONSTRUCTS[span.style];
		if (construct && profile.constructs[construct] !== "native") continue;
		if (span.style === "code_block" && profile.constructs.codeLanguage !== "native") projected.push(createStyleSpan({
			start: span.start,
			end: span.end,
			style: span.style
		}));
		else projected.push(span);
	}
	return synthesizedHeading ? mergeStyleSpans(projected) : projected;
}
function collectLinkFallbacks(ir, profile) {
	if (profile.constructs.linkLabel === "native") return {
		links: ir.links,
		edits: []
	};
	if (profile.constructs.linkLabel === "strip") return {
		links: [],
		edits: []
	};
	return {
		links: [],
		edits: ir.links.flatMap((link) => {
			const href = link.href.trim();
			const label = ir.text.slice(link.start, link.end).trim();
			const comparableHref = href.startsWith("mailto:") ? href.slice(7) : href;
			return href && label && label !== href && label !== comparableHref ? [{
				start: link.end,
				end: link.end,
				text: ` (${href})`
			}] : [];
		})
	};
}
function collectListFallbacks(ir, profile) {
	const edits = [];
	for (const item of ir.listItems ?? []) {
		if (item.task) {
			if (profile.constructs.taskList === "fallback" && item.listMarker) edits.push({
				...item.listMarker,
				text: ""
			});
			else if (profile.constructs.taskList === "strip" && item.taskMarker) edits.push({
				...item.taskMarker,
				text: ""
			});
		}
		if (item.listMarker && item.kind === "bullet" && profile.constructs.bulletList === "strip") edits.push({
			...item.listMarker,
			text: ""
		});
		if (item.listMarker && item.kind === "ordered" && profile.constructs.orderedList === "strip") edits.push({
			...item.listMarker,
			text: ""
		});
	}
	return edits;
}
function applyTextEdits(ir, edits) {
	if (edits.length === 0) return ir;
	const ordered = edits.toSorted((a, b) => a.start - b.start || a.end - b.end).filter((edit, index, all) => {
		const previous = all[index - 1];
		return !previous || edit.start !== previous.start || edit.end !== previous.end;
	});
	const content = copyHtmlTags(ir, {
		text: ir.text,
		styles: ir.styles,
		links: ir.links,
		annotations: ir.annotations
	});
	let cursor = 0;
	const ranges = ordered.map((edit) => {
		const range = {
			start: cursor,
			end: edit.start
		};
		cursor = edit.end;
		return range;
	});
	ranges.push({
		start: cursor,
		end: ir.text.length
	});
	const result = {
		text: "",
		styles: [],
		links: []
	};
	for (const [index, slice] of sliceMarkdownIRRanges(content, ranges).entries()) {
		appendMarkdownIR(result, slice);
		result.text += ordered[index]?.text ?? "";
	}
	result.styles = mergeStyleSpans(result.styles);
	if (result.annotations) result.annotations = mergeAnnotationSpans(result.annotations);
	return result;
}
/** Applies target-declared semantic fallbacks before a mechanism-specific renderer runs. */
function applyConstructFallbacks(ir, profile) {
	const styled = copyHtmlTags(ir, {
		...ir,
		styles: projectStyles(ir.styles, profile)
	});
	const listProjected = applyTextEdits(styled, collectListFallbacks(styled, profile));
	const linkProjection = collectLinkFallbacks(listProjected, profile);
	return applyTextEdits(copyHtmlTags(listProjected, {
		...listProjected,
		links: linkProjection.links
	}), linkProjection.edits);
}
//#endregion
//#region packages/markdown-core/src/strip-html.ts
/** Removes authored HTML before block parsing while preserving code and escaped literals. */
function stripHtmlFromMarkdown(markdown) {
	const firstTagStart = markdown.indexOf("<");
	if (firstTagStart === -1) return markdown;
	const { textSpans } = parseMarkdownOwnership(markdown, { includeText: true });
	let output = "";
	let cursor = 0;
	let textSpanIndex = 0;
	for (let start = firstTagStart; start !== -1; start = markdown.indexOf("<", start + 1)) {
		let textSpan = textSpans[textSpanIndex];
		while (textSpan && textSpan[1] <= start) {
			textSpanIndex += 1;
			textSpan = textSpans[textSpanIndex];
		}
		if (!textSpan || start < textSpan[0]) continue;
		let escaped = false;
		for (let index = start - 1; markdown[index] === "\\"; index -= 1) escaped = !escaped;
		if (escaped) continue;
		const raw = matchMarkdownHtmlTag(markdown.slice(start));
		if (!raw) continue;
		const tag = tokenizeHtmlTags(raw).next().value;
		output += markdown.slice(cursor, start);
		cursor = tag && !tag.closing && RAW_TEXT_TAGS.has(tag.name) ? readRawTextBounds(markdown, tag.name, start + raw.length).end : start + raw.length;
		if (tag && (tag.name === "br" || tag.name === "hr")) output += "\n";
		start = cursor - 1;
	}
	return output + markdown.slice(cursor);
}
//#endregion
//#region src/shared/text/strip-markdown.ts
function collectLinkInsertions(ir, options) {
	const insertions = [];
	if ((options.linkStyle ?? "label-and-url") === "label-and-url") for (const link of ir.links) {
		const href = link.href.trim();
		const label = ir.text.slice(link.start, link.end).trim();
		const comparableHref = href.startsWith("mailto:") ? href.slice(7) : href;
		if (href && label && label !== href && label !== comparableHref) insertions.push({
			position: link.end,
			text: ` (${href})`
		});
	}
	return insertions;
}
function collectAssistantTranscriptRoleInsertions(text, options) {
	if (options.assistantTranscriptRoleHeaders !== true) return [];
	const prefix = options.assistantTranscriptRolePrefix ?? "[assistant-authored transcript] ";
	if (!prefix) return [];
	return findAssistantTranscriptRoleHeaderSpans(text).map((span) => ({
		position: span.start,
		text: prefix
	}));
}
function collectParsedAssistantTranscriptRoleInsertions(ir, options) {
	if (options.assistantTranscriptRoleHeaders !== true) return [];
	const prefix = options.assistantTranscriptRolePrefix ?? "[assistant-authored transcript] ";
	if (!prefix) return [];
	return (ir.annotations ?? []).filter((annotation) => annotation.type === "assistant_transcript_role").map((annotation) => ({
		position: annotation.start,
		text: prefix
	}));
}
function applyPlainTextInsertions(text, insertions) {
	if (insertions.length === 0) return text;
	const sorted = insertions.toSorted((a, b) => a.position - b.position);
	let output = "";
	let cursor = 0;
	for (const insertion of sorted) {
		const position = Math.max(cursor, Math.min(insertion.position, text.length));
		output += text.slice(cursor, position);
		output += insertion.text;
		cursor = position;
	}
	return output + text.slice(cursor);
}
function cleanSpeechText(text) {
	return text.split("\n").map((line) => {
		if (/^[\p{P}\p{S}\s]+$/u.test(line)) return "";
		return line.replace(/^[•◦▪‣⁃]\s+/u, "").replace(/(?:[\p{So}\p{Sk}]\s*){2,}/gu, " ").replace(/\.{4,}/g, "...").replace(/([!?,;:])\1+/g, "$1").replace(/[ \t]{2,}/g, " ").trim();
	}).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
/** Parse Markdown, then protect role headers exposed by the final plain-text projection. */
function stripMarkdown(text, options = {}, profile) {
	const ir = markdownToIR(options.stripHtml ? stripHtmlFromMarkdown(text) : text, {
		assistantTranscriptRoleHeaders: options.assistantTranscriptRoleHeaders,
		autolink: false,
		blockquotePrefix: "",
		enableHtmlUnderline: profile !== void 0,
		enableTaskLists: profile !== void 0,
		headingStyle: "none",
		horizontalRuleText: "",
		linkify: false,
		preserveSourceBlockSpacing: true,
		tableMode: "bullets"
	});
	const effectiveProfile = profile && options.linkStyle === "label" ? {
		...profile,
		constructs: {
			...profile.constructs,
			linkLabel: "strip"
		}
	} : profile;
	const projectedIr = effectiveProfile ? applyConstructFallbacks(ir, effectiveProfile) : ir;
	const plainText = applyPlainTextInsertions(projectedIr.text, [...collectLinkInsertions(projectedIr, options), ...collectParsedAssistantTranscriptRoleInsertions(projectedIr, options)]).trim();
	const projected = applyPlainTextInsertions(plainText, collectAssistantTranscriptRoleInsertions(plainText, options)).trim();
	return options.mode === "speech" ? cleanSpeechText(projected) : projected;
}
//#endregion
export { applyConstructFallbacks as n, stripMarkdown as t };
