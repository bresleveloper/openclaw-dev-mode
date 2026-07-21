import { a as resolveSessionFilePath, o as resolveSessionFilePathOptions } from "./paths-C2C4lJH6.js";
import { s as resolveFreshSessionTotalTokens } from "./types-CoDcFuoc.js";
import { r as readLatestRecentSessionUsageFromTranscriptAsync } from "./session-utils.fs-CR-Ydxz0.js";
import { n as derivePromptTokens } from "./usage-BJjt0RVM.js";
import fs from "node:fs/promises";
//#region src/auto-reply/reply/session-fork.runtime.ts
/**
* Lazy runtime seam for parent-fork token counting. File-era transcript tail
* reads flow through gateway fs helpers; the SQLite flip estimates parent
* tokens inside the storage boundary instead.
*/
const FALLBACK_TRANSCRIPT_BYTES_PER_TOKEN = 4;
function resolvePositiveTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function maxPositiveTokenCount(...values) {
	let max;
	for (const value of values) {
		const normalized = resolvePositiveTokenCount(value);
		if (typeof normalized === "number" && (max === void 0 || normalized > max)) max = normalized;
	}
	return max;
}
async function estimateParentTranscriptTokensFromBytes(params) {
	try {
		const filePath = resolveSessionFilePath(params.parentEntry.sessionId, params.parentEntry, resolveSessionFilePathOptions({ storePath: params.storePath }));
		const stat = await fs.stat(filePath);
		return resolvePositiveTokenCount(Math.ceil(stat.size / FALLBACK_TRANSCRIPT_BYTES_PER_TOKEN));
	} catch {
		return;
	}
}
/** Resolves the best available token count for a parent session before forking. */
async function resolveParentForkTokenCountRuntime(params) {
	const freshPersistedTokens = resolveFreshSessionTotalTokens(params.parentEntry);
	if (typeof freshPersistedTokens === "number") return freshPersistedTokens;
	const cachedTokens = resolvePositiveTokenCount(params.parentEntry.totalTokens);
	const byteEstimateTokens = await estimateParentTranscriptTokensFromBytes(params);
	try {
		const usage = await readLatestRecentSessionUsageFromTranscriptAsync(params.parentEntry.sessionId, params.storePath, params.parentEntry.sessionFile, void 0, 1024 * 1024);
		let transcriptTokens;
		if (usage?.contextUsage?.state === "available") {
			const trailingTokens = Math.ceil((usage.trailingBytes ?? 0) / FALLBACK_TRANSCRIPT_BYTES_PER_TOKEN);
			transcriptTokens = resolvePositiveTokenCount(usage.contextUsage.totalTokens + trailingTokens);
			if (typeof transcriptTokens === "number") return transcriptTokens;
		} else if (usage?.contextUsage?.state !== "unavailable") {
			const promptTokens = resolvePositiveTokenCount(derivePromptTokens({
				input: usage?.inputTokens,
				cacheRead: usage?.cacheRead,
				cacheWrite: usage?.cacheWrite
			}));
			const outputTokens = resolvePositiveTokenCount(usage?.outputTokens);
			if (typeof promptTokens === "number") transcriptTokens = promptTokens + (outputTokens ?? 0);
		}
		if (typeof transcriptTokens === "number") return maxPositiveTokenCount(transcriptTokens, cachedTokens, byteEstimateTokens);
	} catch {}
	return maxPositiveTokenCount(cachedTokens, byteEstimateTokens);
}
//#endregion
export { resolveParentForkTokenCountRuntime };
