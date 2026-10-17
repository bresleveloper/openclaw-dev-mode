import { n as serveWorkerTasks } from "./worker-task-server-BC_7U18u.mjs";
import { S as readTranscriptStatsBatchReadOnlySync } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import "./worker-task-server-OcaoXQUy.mjs";
import "./memory-core-host-engine-sessions-BqHevZaM.mjs";
import { t as prepareMemoryIndexChunks } from "./manager-index-preparation-GBRH0CiB.mjs";
//#region extensions/memory-core/src/memory/manager-index.worker.ts
serveWorkerTasks((input) => {
	const task = input;
	if (task.kind === "prepare") return {
		kind: "prepared",
		value: prepareMemoryIndexChunks(task.input)
	};
	if (task.kind === "transcript-stats") return {
		kind: "transcript-stats",
		stats: readTranscriptStatsBatchReadOnlySync(task.scopes.map((scope) => Object.assign({}, scope, { env: task.env })))
	};
	throw new Error("Invalid memory indexing task");
});
//#endregion
export {};
