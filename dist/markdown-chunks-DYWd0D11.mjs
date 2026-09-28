import { n as estimateStringChars } from "./cjk-chars-6ld30jSx.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as hashText } from "./hash-Di28TYtu.mjs";
//#region packages/memory-host-sdk/src/host/embedding-input-limits.ts
function estimateUtf8Bytes(text) {
	if (!text) return 0;
	return Buffer.byteLength(text, "utf8");
}
function estimateStructuredEmbeddingInputBytes(input) {
	if (!input.parts?.length) return estimateUtf8Bytes(input.text);
	let total = 0;
	for (const part of input.parts) {
		if (part.type === "text") {
			total += estimateUtf8Bytes(part.text);
			continue;
		}
		total += estimateUtf8Bytes(part.mimeType);
		total += estimateUtf8Bytes(part.data);
	}
	return total;
}
function splitTextToUtf8ByteLimit(text, maxUtf8Bytes) {
	if (maxUtf8Bytes <= 0) return [text];
	if (estimateUtf8Bytes(text) <= maxUtf8Bytes) return [text];
	const parts = [];
	let cursor = 0;
	while (cursor < text.length) {
		let low = cursor + 1;
		let high = Math.min(text.length, cursor + maxUtf8Bytes);
		let best = cursor;
		while (low <= high) {
			const mid = Math.floor((low + high) / 2);
			if (estimateUtf8Bytes(text.slice(cursor, mid)) <= maxUtf8Bytes) {
				best = mid;
				low = mid + 1;
			} else high = mid - 1;
		}
		if (best <= cursor) best = Math.min(text.length, cursor + 1);
		if (best < text.length && best > cursor && text.charCodeAt(best - 1) >= 55296 && text.charCodeAt(best - 1) <= 56319 && text.charCodeAt(best) >= 56320 && text.charCodeAt(best) <= 57343) best -= 1;
		const part = text.slice(cursor, best);
		if (!part) break;
		parts.push(part);
		cursor = best;
	}
	return parts;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-inputs.ts
/** Build the common text-only embedding input shape. */
function buildTextEmbeddingInput(text) {
	return { text };
}
/** Return true when a chunk needs structured provider handling, not text splitting. */
function hasNonTextEmbeddingParts(input) {
	if (!input?.parts?.length) return false;
	return input.parts.some((part) => part.type === "inline-data");
}
//#endregion
//#region packages/memory-host-sdk/src/host/markdown-chunks.ts
const MEMORY_CHUNKING_VERSION = 5;
function curatedMarkdownEntryKind(line) {
	return line.startsWith("- ") ? "entry" : /^#{1,6}(?:\s|$)/u.test(line) ? "section" : void 0;
}
function splitCuratedMarkdownEntries(content) {
	const lines = content.split("\n");
	const entries = [];
	let startIndex = 0;
	let kind = lines[0]?.startsWith("- ") ? "entry" : "section";
	const flush = (endIndex) => {
		if (endIndex < startIndex) return;
		entries.push({
			startLine: startIndex + 1,
			endLine: endIndex + 1,
			text: lines.slice(startIndex, endIndex + 1).join("\n"),
			kind
		});
	};
	for (let index = 1; index < lines.length; index += 1) {
		const nextKind = curatedMarkdownEntryKind(lines[index] ?? "");
		if (!nextKind) continue;
		flush(index - 1);
		startIndex = index;
		kind = nextKind;
	}
	flush(lines.length - 1);
	return entries;
}
/** Takes the trailing slice of text within the weighted char budget, without splitting surrogate pairs. */
function takeTailByEstimatedChars(text, budget) {
	let acc = 0;
	let start = text.length;
	while (start > 0) {
		const previous = start - ((text.codePointAt(start - 2) ?? 0) > 65535 ? 2 : 1);
		acc += estimateStringChars(text.slice(previous, start));
		if (!(acc <= budget)) break;
		start = previous;
	}
	return text.slice(start);
}
function chunkMarkdown(content, chunking) {
	const lines = content.split("\n");
	const maxChars = Math.max(32, chunking.tokens * 4);
	const overlapChars = Math.max(0, chunking.overlap * 4);
	const chunks = [];
	let current = [];
	let currentChars = 0;
	let entryStartLine;
	let entryFirstChunk = 0;
	const flush = () => {
		const firstEntry = current[0];
		const lastEntry = current[current.length - 1];
		if (!firstEntry || !lastEntry) return;
		const text = current.map((entry) => entry.line).join("\n");
		const startLine = firstEntry.lineNo;
		const endLine = lastEntry.lineNo;
		chunks.push({
			startLine,
			endLine,
			text,
			hash: hashText(text),
			embeddingInput: buildTextEmbeddingInput(text)
		});
	};
	const carryOverlap = (window) => {
		if (window <= 0 || current.length === 0) {
			current = [];
			currentChars = 0;
			return;
		}
		let acc = 0;
		const kept = [];
		for (let i = current.length - 1; i >= 0; i -= 1) {
			const entry = current[i];
			if (!entry) continue;
			const entrySize = estimateStringChars(entry.line) + 1;
			const remaining = window - acc;
			if (entrySize > remaining) {
				const tail = kept.length === 0 ? takeTailByEstimatedChars(entry.line, remaining - 1) : "";
				if (tail.length > 0) {
					kept.unshift({
						line: tail,
						lineNo: entry.lineNo
					});
					acc += estimateStringChars(tail) + 1;
				}
				break;
			}
			acc += entrySize;
			kept.unshift(entry);
			if (acc >= window) break;
		}
		current = kept;
		currentChars = acc;
	};
	const appendSegment = (segment, lineNo, chars) => {
		const lineSize = chars + 1;
		if (currentChars + lineSize > maxChars && current.length > 0) {
			flush();
			carryOverlap(Math.min(overlapChars, Math.max(0, maxChars - lineSize)));
		}
		current.push({
			line: segment,
			lineNo
		});
		currentChars += lineSize;
	};
	const finishEntry = (entryEndLine) => {
		if (entryStartLine === void 0) return;
		for (const chunk of chunks.slice(entryFirstChunk)) {
			chunk.entryStartLine = entryStartLine;
			chunk.entryEndLine = entryEndLine;
		}
	};
	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i] ?? "";
		const lineNo = i + 1;
		const entryKind = chunking.perEntry ? curatedMarkdownEntryKind(line) ?? (i === 0 ? "section" : void 0) : void 0;
		if (entryKind) {
			if (current.length > 0) flush();
			finishEntry(lineNo - 1);
			current = [];
			currentChars = 0;
			entryStartLine = entryKind === "entry" ? lineNo : void 0;
			entryFirstChunk = chunks.length;
		}
		if (line.length === 0) appendSegment("", lineNo, 0);
		else for (let start = 0; start < line.length;) {
			const coarse = truncateUtf16Safe(line.slice(start), maxChars);
			const coarseChars = estimateStringChars(coarse);
			if (coarseChars > maxChars) {
				let partStart = 0;
				let partEnd = 0;
				let partChars = 0;
				for (const character of coarse) {
					const chars = estimateStringChars(character);
					if (partChars + chars > maxChars) {
						appendSegment(coarse.slice(partStart, partEnd), lineNo, partChars);
						partStart = partEnd;
						partChars = 0;
					}
					partEnd += character.length;
					partChars += chars;
				}
				appendSegment(coarse.slice(partStart), lineNo, partChars);
			} else appendSegment(coarse, lineNo, coarseChars);
			start += coarse.length;
		}
	}
	flush();
	finishEntry(lines.length);
	return chunks;
}
/**
* Remap chunk startLine/endLine from content-relative positions to original
* source file positions using a lineMap.  Each entry in lineMap gives the
* 1-indexed source line for the corresponding 0-indexed content line.
*
* This is used for session JSONL files where buildSessionEntry() flattens
* messages into a plain-text string before chunking.  Without remapping the
* stored line numbers would reference positions in the flattened text rather
* than the original JSONL file.
*/
function remapChunkLines(chunks, lineMap) {
	if (!lineMap || lineMap.length === 0) return;
	for (const chunk of chunks) {
		chunk.startLine = lineMap[chunk.startLine - 1] ?? chunk.startLine;
		chunk.endLine = lineMap[chunk.endLine - 1] ?? chunk.endLine;
	}
}
//#endregion
export { hasNonTextEmbeddingParts as a, splitTextToUtf8ByteLimit as c, splitCuratedMarkdownEntries as i, chunkMarkdown as n, estimateStructuredEmbeddingInputBytes as o, remapChunkLines as r, estimateUtf8Bytes as s, MEMORY_CHUNKING_VERSION as t };
