import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { t as executeOpenClawAgentWorkerPublication } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-fork-domain.ts
function executeSessionForkOperation(worker, databaseAgentId, command) {
	return executeOpenClawAgentWorkerPublication(worker, {
		id: randomUUID(),
		moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionForkDomain).href,
		input: { agentId: databaseAgentId },
		command
	});
}
//#endregion
export { executeSessionForkOperation as t };
