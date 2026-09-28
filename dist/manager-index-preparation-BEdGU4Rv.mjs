import { n as chunkMarkdown, r as remapChunkLines } from "./markdown-chunks-DYWd0D11.mjs";
import { t as hashText } from "./hash-Di28TYtu.mjs";
import { a as stripMemoryAnnotationCarriers, n as extractCuratedEntryRecallMetadata } from "./curated-annotations-DM9mz8Th.mjs";
import { t as enforceEmbeddingMaxInputTokens } from "./embedding-chunk-limits-DTn13869.mjs";
import "./memory-core-host-engine-indexing-DlKd_hwL.mjs";
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
	const baseChunks = (source === "sessions" ? chunkSessionContentAtResetBoundary({
		content: indexingContent,
		cutoffLine,
		lineMap: entry.lineMap,
		chunking: chunkOptions
	}) : chunkMarkdown(indexingContent, chunkOptions)).filter((chunk) => chunk.text.trim().length > 0);
	for (const chunk of baseChunks) chunk.provenance = resolveChunkProvenance(entry, source, chunk, pathClassification.originClass);
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
export { resolveChunkProvenance as n, prepareMemoryIndexChunks as t };
