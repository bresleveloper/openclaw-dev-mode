import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-BC_7U18u.mjs";
import { c as readIdentityFileSnapshot } from "../identity-file-DQ9_U4uO.mjs";
//#region src/agents/identity-file.worker.ts
serveWorkerTasks((input) => {
	if (!isRecord(input) || typeof input.identityPath !== "string" || input.knownRevision !== void 0 && typeof input.knownRevision !== "string") throw new Error("Invalid identity file read request");
	return readIdentityFileSnapshot({
		identityPath: input.identityPath,
		knownRevision: input.knownRevision
	});
});
//#endregion
export {};
