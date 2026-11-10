import { n as estimateStringChars } from "./cjk-chars-D02XG87t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as hashText } from "./hash-BOTtT1fO.mjs";
//#region packages/memory-host-sdk/src/host/markdown-chunks.ts
const MEMORY_CHUNKING_VERSION = 6;
function curatedMarkdownEntryKind(line) {
	return line.startsWith("- ") ? "entry" : /^#{1,6}(?:\s|$)/u.test(line) ? "section" : void 0;
}
function* curatedMarkdownEntrySpans(lines) {
	let startLine = 1;
	let kind = lines[0]?.startsWith("- ") ? "entry" : "section";
	for (let index = 1; index < lines.length; index += 1) {
		const nextKind = curatedMarkdownEntryKind(lines[index] ?? "");
		if (nextKind) {
			yield {
				startLine,
				endLine: index,
				kind
			};
			startLine = index + 1;
			kind = nextKind;
		}
	}
	yield {
		startLine,
		endLine: lines.length,
		kind
	};
}
function splitCuratedMarkdownEntries(content) {
	const lines = content.split("\n");
	return Array.from(curatedMarkdownEntrySpans(lines), ({ startLine, endLine, kind }) => ({
		startLine,
		endLine,
		text: lines.slice(startLine - 1, endLine).join("\n"),
		kind
	}));
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
/** Incremental text chunking: callers retain only the current chunk and overlap. */
function createMarkdownChunker(chunking, onChunk) {
	const maxChars = Math.max(32, chunking.tokens * 4);
	const overlapChars = Math.max(0, chunking.overlap * 4);
	let current = [];
	let currentChars = 0;
	let pendingLine = "";
	const flush = () => {
		const firstEntry = current[0];
		const lastEntry = current[current.length - 1];
		if (!firstEntry || !lastEntry) return;
		const text = current.map((entry) => entry.line).join("\n");
		const startLine = firstEntry.lineNo;
		const endLine = lastEntry.lineNo;
		onChunk({
			startLine,
			endLine,
			text,
			hash: hashText(text),
			embeddingInput: { text }
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
	return {
		appendLine(part, lineNo, endOfLine = true) {
			const line = pendingLine + part;
			pendingLine = "";
			if (line.length === 0 && endOfLine) appendSegment("", lineNo, 0);
			else for (let start = 0; start < line.length;) {
				if (!endOfLine && line.length - start <= maxChars) {
					pendingLine = line.slice(start);
					break;
				}
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
		},
		flush() {
			flush();
			current = [];
			currentChars = 0;
		}
	};
}
function chunkMarkdown(content, chunking) {
	const lines = content.split("\n");
	const chunks = [];
	const entries = chunking.perEntry ? curatedMarkdownEntrySpans(lines) : [{
		startLine: 1,
		endLine: lines.length,
		kind: "section"
	}];
	for (const entry of entries) {
		const chunker = createMarkdownChunker(chunking, (chunk) => {
			if (entry.kind === "entry") {
				chunk.entryStartLine = entry.startLine;
				chunk.entryEndLine = entry.endLine;
			}
			chunks.push(chunk);
		});
		for (let i = entry.startLine - 1; i < entry.endLine; i += 1) chunker.appendLine(lines[i] ?? "", i + 1);
		chunker.flush();
	}
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
export { splitCuratedMarkdownEntries as a, remapChunkLines as i, chunkMarkdown as n, createMarkdownChunker as r, MEMORY_CHUNKING_VERSION as t };
