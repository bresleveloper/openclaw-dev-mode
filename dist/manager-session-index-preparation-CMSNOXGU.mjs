import { t as hashText } from "./hash-BOTtT1fO.mjs";
import { i as remapChunkLines, n as chunkMarkdown, r as createMarkdownChunker } from "./markdown-chunks-D_nW3u36.mjs";
import { a as stripMemoryAnnotationCarriers, n as extractCuratedEntryRecallMetadata } from "./curated-annotations-DM9mz8Th.mjs";
import { t as enforceEmbeddingMaxInputTokens } from "./memory-core-host-engine-indexing-DILm2lK4.mjs";
//#region extensions/memory-core/src/memory/manager-reset-chunk-boundary.ts
function chunkSessionContentAtResetBoundary(params) {
	const cutoffIndex = params.cutoffLine !== void 0 && params.lineMap ? params.lineMap.findIndex((line) => line >= params.cutoffLine) : -1;
	if (cutoffIndex <= 0) return chunkMarkdown(params.content, params.chunking);
	const lines = params.content.split("\n");
	const chunkPartition = (content, lineOffset) => {
		const chunks = chunkMarkdown(content, params.chunking);
		for (const chunk of chunks) {
			chunk.startLine += lineOffset;
			chunk.endLine += lineOffset;
		}
		return chunks;
	};
	return [...chunkPartition(lines.slice(0, cutoffIndex).join("\n"), 0), ...chunkPartition(lines.slice(cutoffIndex).join("\n"), cutoffIndex)];
}
//#endregion
//#region extensions/memory-core/src/memory/manager-index-preparation.ts
function prepareMemoryIndexChunks({ entry, source, content, pathClassification, chunking, cutoffLine, provider, hardMaxInputTokens }) {
	const contentHash = source === "memory" ? hashText(content) : void 0;
	const normalizedEntryPath = entry.path.replaceAll("\\", "/");
	const perEntry = source === "memory" && (normalizedEntryPath === "MEMORY.md" || normalizedEntryPath === "USER.md");
	const indexingContent = source === "memory" ? stripMemoryAnnotationCarriers(content) : content;
	const sourceLines = source === "memory" ? content.replace(/\r\n/gu, "\n").split("\n") : [];
	const chunkOptions = {
		...chunking,
		perEntry
	};
	const baseChunks = [];
	for (const chunk of source === "sessions" ? chunkSessionContentAtResetBoundary({
		content: indexingContent,
		cutoffLine,
		lineMap: entry.lineMap,
		chunking: chunkOptions
	}) : chunkMarkdown(indexingContent, chunkOptions)) {
		if (!chunk.text.trim()) continue;
		const previous = baseChunks.at(-1);
		if (source === "memory" && previous && previous.entryStartLine === void 0 && chunk.endLine > previous.endLine && previous.text.split("\n").every((line, index) => (!line.trim() || /^ {0,3}#{1,6}(?:\s|$)/u.test(line)) && !line.includes("<!--") && line.trimEnd() === (sourceLines[previous.startLine + index - 1] ?? "").trimEnd())) {
			const following = chunk.text.split("\n").slice(Math.max(0, previous.endLine - chunk.startLine + 1));
			chunk.text = [previous.text, ...following].join("\n");
			chunk.startLine = previous.startLine;
			chunk.hash = hashText(chunk.text);
			chunk.embeddingInput = { text: chunk.text };
			baseChunks.pop();
		}
		chunk.provenance = resolveChunkProvenance(entry, source, chunk, pathClassification.originClass);
		baseChunks.push(chunk);
	}
	const recallMetadata = /* @__PURE__ */ new Map();
	const chunks = (provider !== void 0 ? enforceEmbeddingMaxInputTokens(provider, baseChunks, hardMaxInputTokens) : baseChunks).map((chunk) => {
		const start = chunk.entryStartLine ?? chunk.startLine;
		const end = chunk.entryEndLine ?? chunk.endLine;
		const span = `${start}:${end}`;
		let metadata = recallMetadata.get(span);
		if (!metadata) {
			metadata = extractCuratedEntryRecallMetadata({
				curatedRoot: pathClassification.curatedRoot,
				projectScopeEligible: source === "memory" && normalizedEntryPath.toUpperCase() !== "USER.MD",
				sourceLines: sourceLines.slice(start - 1, end)
			});
			recallMetadata.set(span, metadata);
		}
		return Object.assign(chunk, metadata);
	});
	if (source === "sessions" && "lineMap" in entry) remapChunkLines(chunks, entry.lineMap);
	return {
		contentHash,
		chunks
	};
}
function resolveChunkProvenance(entry, source, chunk, pathOriginClass) {
	const lineProvenance = entry.lineProvenance?.slice(chunk.startLine - 1, chunk.endLine) ?? [];
	if (source === "sessions" && lineProvenance.length > 0) {
		const originClass = [
			"owner",
			"agent",
			"system",
			"untrusted"
		].findLast((origin) => lineProvenance.some((item) => item.originClass === origin));
		const sessionKinds = new Set(lineProvenance.map((item) => item.sessionKind));
		const supersedesKeys = new Set(lineProvenance.flatMap((item) => item.supersedesKey ? [item.supersedesKey] : []));
		return {
			originClass: originClass ?? "untrusted",
			sessionKind: sessionKinds.size === 1 ? lineProvenance[0]?.sessionKind ?? "unknown" : "unknown",
			observedAt: Math.max(...lineProvenance.map((item) => item.observedAt)),
			...supersedesKeys.size === 1 ? { supersedesKey: [...supersedesKeys][0] } : {}
		};
	}
	return {
		originClass: pathOriginClass,
		sessionKind: "unknown",
		observedAt: Math.max(0, Math.floor(entry.mtimeMs))
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-session-index-preparation.ts
/** Walk the immutable source without allocating an array for every transcript line. */
function* sessionIndexPages(input) {
	let offset = 0;
	let lineIndex = 0;
	let lines = [];
	let bytes = 0;
	while (offset <= input.content.length) {
		const newline = input.content.indexOf("\n", offset);
		const lineEnd = newline < 0 ? input.content.length : newline;
		do {
			const end = Math.min(lineEnd, offset + 16384);
			const text = input.content.slice(offset, end);
			lines.push({
				text,
				lineNo: lineIndex + 1,
				endOfLine: end === lineEnd,
				sourceLine: input.entry.lineMap?.[lineIndex] ?? lineIndex + 1,
				provenance: input.entry.lineProvenance?.[lineIndex]
			});
			bytes += text.length * 2 + 64;
			offset = end;
			if (lines.length >= 512 || bytes >= 65536) {
				yield {
					lines,
					done: false
				};
				lines = [];
				bytes = 0;
			}
		} while (offset < lineEnd);
		lineIndex++;
		offset = newline < 0 ? input.content.length + 1 : lineEnd + 1;
	}
	yield {
		lines,
		done: true
	};
}
/** Both directions are acknowledged: a bounded worker never retains the full expansion. */
async function prepareSessionIndexStream(input, channel, control) {
	channel.consumeInput();
	let pending = [];
	let crossedReset = false;
	const facts = /* @__PURE__ */ new Map();
	const metadata = extractCuratedEntryRecallMetadata({
		curatedRoot: false,
		projectScopeEligible: false,
		sourceLines: []
	});
	const chunker = createMarkdownChunker(input.chunking, (chunk) => {
		const provenance = [];
		for (const [number, fact] of facts) if (number < chunk.startLine) facts.delete(number);
		else if (number <= chunk.endLine && fact.provenance) provenance.push(fact.provenance);
		if (!chunk.text.trim()) return;
		chunk.provenance = resolveChunkProvenance({
			mtimeMs: input.entry.mtimeMs,
			lineProvenance: provenance
		}, "sessions", {
			...chunk,
			startLine: 1,
			endLine: provenance.length
		}, input.pathClassification.originClass);
		chunk.startLine = facts.get(chunk.startLine)?.sourceLine ?? chunk.startLine;
		chunk.endLine = facts.get(chunk.endLine)?.sourceLine ?? chunk.endLine;
		for (const fragment of input.provider ? enforceEmbeddingMaxInputTokens(input.provider, [chunk], input.hardMaxInputTokens) : [chunk]) {
			delete fragment.embeddingInput;
			pending.push(Object.assign(fragment, metadata));
		}
	});
	for (;;) {
		control.throwIfCancelled();
		const response = await channel.request({ chunks: pending });
		pending = [];
		const page = response.input;
		for (const line of page.lines) {
			control.throwIfCancelled();
			if (!crossedReset && line.lineNo === input.resetAtLine) {
				chunker.flush();
				crossedReset = true;
			}
			facts.set(line.lineNo, line);
			chunker.appendLine(line.text, line.lineNo, line.endOfLine);
		}
		response.consumed();
		if (page.done) {
			chunker.flush();
			(await channel.request({ chunks: pending })).consumed();
			return;
		}
	}
}
//#endregion
export { resolveChunkProvenance as i, sessionIndexPages as n, prepareMemoryIndexChunks as r, prepareSessionIndexStream as t };
