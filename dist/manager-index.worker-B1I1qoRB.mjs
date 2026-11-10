import { n as serveWorkerTasks } from "./worker-task-server-sMsYUF1K.mjs";
import "./worker-task-server-T-g3Ibxb.mjs";
import { r as prepareMemoryIndexChunks, t as prepareSessionIndexStream } from "./manager-session-index-preparation-CMSNOXGU.mjs";
//#region extensions/memory-core/src/memory/manager-index.worker.ts
serveWorkerTasks(async (input, channel, control) => {
	const task = input;
	if (task.kind === "prepare") return {
		kind: "prepared",
		value: prepareMemoryIndexChunks(task.input)
	};
	if (task.kind === "prepare-session") {
		if (!channel) throw new Error("Session index preparation requires its source channel");
		await prepareSessionIndexStream(task.input, channel, control);
		return {
			kind: "prepared",
			value: {
				contentHash: void 0,
				chunks: []
			}
		};
	}
	if (task.kind === "transcript-stats") {
		const { readTranscriptStatsBatchReadOnlySync } = await import("./plugin-sdk/memory-core-host-transcript-stats.js");
		return {
			kind: "transcript-stats",
			stats: readTranscriptStatsBatchReadOnlySync(task.scopes.map((scope) => Object.assign({}, scope, { env: task.env })))
		};
	}
	throw new Error("Invalid memory indexing task");
});
//#endregion
export {};
