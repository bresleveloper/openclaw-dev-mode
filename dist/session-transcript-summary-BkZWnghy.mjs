//#region src/gateway/session-transcript-summary.ts
/** Load domain policy before opening the snapshot; only compact facts cross the worker boundary. */
async function prepareSessionTranscriptSummaryReader(query) {
	if (query.kind === "recovery-checkpoint") {
		const { selectMainSessionRecoveryCheckpoint } = await import("./main-session-recovery-checkpoint-BRCFWzhl.mjs");
		return (visit) => ({
			kind: "recovery-checkpoint",
			checkpoint: selectMainSessionRecoveryCheckpoint(visit)
		});
	}
	if (query.kind === "mcp-app") {
		const { selectMcpAppReconstructionData } = await import("./mcp-app-transcript-BBbH7G40.mjs");
		return (visit) => ({
			kind: "mcp-app",
			data: selectMcpAppReconstructionData(visit, query.lookup)
		});
	}
	const { createSessionTranscriptUsageAccumulator } = await import("./session-transcript-derived-readers-DCwIbh3p.mjs");
	return (visit) => {
		const usage = createSessionTranscriptUsageAccumulator();
		visit(usage.add);
		return {
			kind: "usage",
			usage: usage.finish()
		};
	};
}
//#endregion
export { prepareSessionTranscriptSummaryReader as t };
