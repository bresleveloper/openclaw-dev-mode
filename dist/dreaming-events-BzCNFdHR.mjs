import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as appendMemoryHostEvent } from "./memory-host-events-BnGsdA3l.mjs";
import "./dreaming-shared-CofeOWBR.mjs";
import { n as resolveMemoryCoreTimestamp, t as resolveMemoryCoreNowMs } from "./time-BhFVUM0b.mjs";
//#region extensions/memory-core/src/dreaming-events.ts
async function appendFailedDreamingEvent(params) {
	try {
		await appendMemoryHostEvent(params.workspaceDir, {
			type: "memory.dream.completed",
			timestamp: resolveMemoryCoreTimestamp(resolveMemoryCoreNowMs(params.nowMs)),
			phase: params.phase,
			outcome: "failed",
			error: params.error,
			lineCount: 0,
			storageMode: params.storageMode
		});
	} catch (err) {
		params.logger.warn(`memory-core: failed to write ${params.phase} dreaming outcome event for workspace ${params.workspaceDir}: ${formatErrorMessage(err)}`);
	}
}
//#endregion
export { appendFailedDreamingEvent as t };
