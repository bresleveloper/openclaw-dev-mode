import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/config/sessions/legacy-compaction-history.ts
function readLegacyCompactionMetrics(entry) {
	try {
		return readLegacyCompactionHistory(entry).flatMap((checkpoint) => {
			const entryId = checkpoint.postCompaction.entryId;
			return entryId ? [{
				entryId,
				tokensBefore: checkpoint.tokensBefore,
				tokensAfter: checkpoint.tokensAfter
			}] : [];
		});
	} catch {
		return [];
	}
}
function readLegacyCompactionSnapshotPaths(entry) {
	return readLegacyCompactionHistory(entry).flatMap((checkpoint) => [checkpoint.preCompaction.sessionFile?.trim(), checkpoint.postCompaction.sessionFile?.trim()].filter((filePath) => Boolean(filePath)));
}
function readLegacyCompactionHistory(entry) {
	const checkpoints = asOptionalRecord(entry)?.compactionCheckpoints;
	if (checkpoints == null) return [];
	if (!Array.isArray(checkpoints)) throw new TypeError("Invalid legacy compaction history references");
	return checkpoints.map((checkpoint) => {
		const record = asOptionalRecord(checkpoint);
		const pre = asOptionalRecord(record?.preCompaction);
		const post = asOptionalRecord(record?.postCompaction);
		if (!record || !pre || !post) throw new TypeError("Invalid legacy compaction history references");
		const string = (value) => {
			if (value == null) return;
			if (typeof value !== "string") throw new TypeError("Invalid legacy compaction history reference");
			return value;
		};
		const number = (value) => typeof value === "number" && Number.isFinite(value) ? value : void 0;
		return {
			sessionId: string(record.sessionId),
			preCompaction: {
				sessionId: string(pre.sessionId),
				sessionFile: string(pre.sessionFile)
			},
			postCompaction: {
				sessionId: string(post.sessionId),
				sessionFile: string(post.sessionFile),
				entryId: string(post.entryId)
			},
			tokensBefore: number(record.tokensBefore),
			tokensAfter: number(record.tokensAfter)
		};
	});
}
//#endregion
export { readLegacyCompactionMetrics as n, readLegacyCompactionSnapshotPaths as r, readLegacyCompactionHistory as t };
