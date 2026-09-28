import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { r as findCodeRegions } from "./code-regions-NxEObIZm.mjs";
//#region src/shared/text/text-projection.ts
function createActivatedProjector(filter) {
	const activation = new RegExp(filter.activationTokens.map(escapeRegExp).join("|"), "i");
	const overlap = Math.max(0, ...filter.activationTokens.map((token) => token.length - 1));
	let tail = "";
	let active = false;
	let previous = "";
	let identity = true;
	return (input) => {
		if (input.delta === "") return identity ? input : {
			text: previous,
			delta: ""
		};
		if (!active) {
			const appended = tail + (input.delta ?? input.text);
			active = activation.test(appended);
			tail = !active && overlap ? appended.slice(-overlap) : "";
		}
		const text = active ? filter.transform(input.text) : input.text;
		const nextIdentity = text === input.text;
		const delta = input.delta === null ? null : identity && nextIdentity ? input.delta : text.startsWith(previous) ? text.slice(previous.length) : null;
		previous = text;
		identity = nextIdentity;
		return nextIdentity && delta === input.delta ? input : {
			text,
			delta
		};
	};
}
function applyTextFilters(input, filters) {
	let text = input;
	for (const filter of filters) text = filter.transform(text);
	return text;
}
function createTextProjection(filters) {
	const stages = filters.map((filter) => ({ filter }));
	let source = "";
	let text = "";
	const project = (value) => {
		let input = value;
		for (const stage of stages) {
			if (!stage.projector || input.delta === null) stage.projector = "create" in stage.filter ? stage.filter.create() : createActivatedProjector(stage.filter);
			input = stage.projector(input);
		}
		return input;
	};
	return {
		get source() {
			return source;
		},
		get text() {
			return text;
		},
		append(delta) {
			source += delta;
			const next = project({
				text: source,
				delta
			});
			if (next.delta === null && next.text.startsWith(text)) next.delta = next.text.slice(text.length);
			text = next.text;
			return next;
		},
		replace(value) {
			source = value;
			const next = project({
				text: source,
				delta: null
			});
			next.delta = null;
			text = next.text;
			return next;
		}
	};
}
/** Trim surrounding padding without removing Markdown block indentation. */
function trimTextPreservingCode(text, mode = "both", codeRegions) {
	let trimmed = text.trimStart();
	if (trimmed && trimmed.length !== text.length) {
		const contentStart = text.length - trimmed.length;
		const leadingCode = (codeRegions ?? findCodeRegions(text)).find((region) => (region.block || codeRegions && region.start === 0) && region.start <= contentStart && contentStart < region.end);
		if (leadingCode) trimmed = text.slice(leadingCode.start);
	}
	if (mode === "both") {
		const contentEnd = text.trimEnd().length;
		if (codeRegions?.some((region) => region.start <= contentEnd && region.end === text.length)) return trimmed;
		return trimmed.trimEnd();
	}
	return trimmed;
}
function trimTextFilter(mode, options) {
	return {
		transform: (text) => mode === "none" ? text : options?.preserveCodeIndentation ? trimTextPreservingCode(text, mode) : mode === "both" ? text.trim() : text.trimStart(),
		create: () => {
			let text = "";
			let leading = true;
			let removedLeading = false;
			let pending = "";
			return (input) => {
				if (mode === "none") return input;
				const appended = input.delta ?? input.text;
				let delta = leading ? appended.trimStart() : appended;
				if (leading && options?.preserveCodeIndentation && delta) {
					delta = trimTextPreservingCode(input.text, "start");
					removedLeading = delta.length !== input.text.length;
				} else removedLeading ||= delta.length !== appended.length;
				leading &&= !delta;
				if (mode === "both") {
					const content = delta.trimEnd();
					if (content) {
						const trailing = delta.slice(content.length);
						delta = pending + content;
						pending = trailing;
					} else {
						pending += delta;
						delta = "";
					}
				}
				text = !removedLeading && !pending ? input.text : text + delta;
				return {
					text,
					delta: input.delta === null ? null : delta
				};
			};
		}
	};
}
function stripLeadingEmptyLines(text) {
	return text.trim() ? text.replace(/^(?:[ \t]*\r?\n)+/, "") : "";
}
const leadingEmptyLinesTextFilter = {
	transform: stripLeadingEmptyLines,
	create: () => {
		let started = false;
		let identity = false;
		let text = "";
		return (input) => {
			let delta = input.delta ?? input.text;
			if (!started) {
				started = /\S/.test(delta);
				text = started ? stripLeadingEmptyLines(input.text) : "";
				identity = text === input.text;
				delta = text;
			} else text = identity ? input.text : text + delta;
			return {
				text,
				delta: input.delta === null ? null : delta
			};
		};
	}
};
function collapsePlainDuplicateParagraphs(text) {
	return createDuplicateParagraphProjector(false)({
		text,
		delta: null
	}).text;
}
function collapseDuplicateParagraphs(text) {
	const collapsed = collapsePlainDuplicateParagraphs(text);
	if (collapsed === text) return text;
	const regions = findCodeRegions(text);
	if (regions.length === 0) return collapsed;
	let marker = "\0";
	while (text.includes(marker)) marker += "\0";
	const inlineTokens = /* @__PURE__ */ new Map();
	let masked = "";
	let cursor = 0;
	const protectedText = regions.map((region, index) => {
		const source = text.slice(region.start, region.end);
		let token = `${marker}${index}${marker}`;
		if (!region.block) {
			token = inlineTokens.get(source) ?? token;
			inlineTokens.set(source, token);
		}
		masked += text.slice(cursor, region.start) + token;
		cursor = region.end;
		return source;
	});
	return collapsePlainDuplicateParagraphs(masked + text.slice(cursor)).replace(new RegExp(`${marker}(\\d+)${marker}`, "g"), (_token, index) => expectDefined(protectedText[Number(index)], "protected code text"));
}
function createDuplicateParagraphProjector(protectCode = true) {
	let active = false;
	let trailingNewline = false;
	let text = "";
	let completed = "";
	let lastNormalized = null;
	let pendingEmpty = 0;
	let paragraph = "";
	let pending = "";
	let normalizedLength = 0;
	let equal = false;
	let newlines = 0;
	let hasDuplicate = false;
	let wasCollapsed = false;
	let wasDuplicate = false;
	return (input) => {
		let appended = input.delta ?? input.text;
		if (!active) {
			active = trailingNewline && appended.startsWith("\n") || appended.includes("\n\n");
			trailingNewline = appended ? appended.endsWith("\n") : trailingNewline;
			if (!active) {
				text = input.text;
				return input;
			}
			appended = input.text;
		}
		let completedParagraph = false;
		let added = "";
		for (const part of appended.matchAll(/\n+|[^\n]+/g)) {
			if (part[0].startsWith("\n")) {
				if (newlines < 2 && newlines + part[0].length >= 2) {
					completedParagraph = true;
					if (!paragraph) {
						if (lastNormalized !== null) pendingEmpty++;
					} else if (equal && normalizedLength === lastNormalized?.length) hasDuplicate = true;
					else {
						completed += (completed ? "\n\n" : "") + paragraph;
						lastNormalized = paragraph.replace(/\s+/g, " ");
					}
					paragraph = "";
					pending = "";
					normalizedLength = 0;
					equal = Boolean(lastNormalized);
				} else if (newlines + part[0].length < 2 && paragraph) pending += part[0];
				newlines += part[0].length;
				continue;
			}
			newlines = 0;
			const raw = paragraph ? part[0] : part[0].trimStart();
			const content = raw.trimEnd();
			if (!content) {
				pending += raw;
				continue;
			}
			const piece = pending + content;
			pending = raw.slice(content.length);
			if (!paragraph) {
				const empty = "\n\n".repeat(pendingEmpty);
				if (pendingEmpty) {
					completed += empty;
					pendingEmpty = 0;
					lastNormalized = "";
					equal = false;
				}
				added += completed ? empty + "\n\n" : "";
			}
			paragraph += piece;
			added += piece;
			if (equal) {
				const normalized = piece.replace(/\s+/g, " ");
				equal = lastNormalized?.startsWith(normalized, normalizedLength) === true;
				normalizedLength += normalized.length;
			}
		}
		const duplicate = Boolean(paragraph) && equal && normalizedLength === lastNormalized?.length;
		const collapsed = hasDuplicate || duplicate;
		let delta = input.delta;
		if (collapsed) {
			delta = input.delta === null || !wasCollapsed || duplicate !== wasDuplicate || completedParagraph || protectCode && /\s$/.test(text) ? null : added;
			text = delta === null ? protectCode ? collapseDuplicateParagraphs(input.text) : completed + (paragraph && !duplicate ? (completed ? "\n\n" : "") + paragraph : "") : text + delta;
		} else {
			text = input.text;
			if (wasCollapsed) delta = null;
		}
		wasCollapsed = collapsed;
		wasDuplicate = duplicate;
		return {
			text,
			delta
		};
	};
}
const duplicateParagraphTextFilter = {
	transform: collapseDuplicateParagraphs,
	create: createDuplicateParagraphProjector
};
//#endregion
export { trimTextFilter as a, leadingEmptyLinesTextFilter as i, createTextProjection as n, trimTextPreservingCode as o, duplicateParagraphTextFilter as r, applyTextFilters as t };
