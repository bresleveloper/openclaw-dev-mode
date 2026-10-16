import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-BC_7U18u.mjs";
import { r as readLocalAgentAvatarSnapshot } from "../identity-avatar-file-CzAdV6tU.mjs";
//#region src/agents/identity-avatar-file.worker.ts
serveWorkerTasks((input) => {
	if (!isRecord(input) || typeof input.workspaceDir !== "string" || typeof input.source !== "string" || typeof input.readBody !== "boolean" || input.knownRevision !== void 0 && typeof input.knownRevision !== "string") throw new Error("Invalid local avatar read request");
	return readLocalAgentAvatarSnapshot({
		workspaceDir: input.workspaceDir,
		source: input.source,
		readBody: input.readBody,
		knownRevision: input.knownRevision
	});
}, { transferList: (result) => "ok" in result && result.ok && result.file.body ? [result.file.body.buffer] : [] });
//#endregion
export {};
