import { n as HEARTBEAT_TASK_DECLARATION_PREFIX } from "./system-owned-declaration-CIFRO5mv.mjs";
import { createHash } from "node:crypto";
//#region src/cron/heartbeat-task.ts
/** Identity and execution metadata for heartbeat tasks migrated into cron. */
/** Whether a declaration key belongs to the doctor-owned heartbeat-task namespace. */
function isHeartbeatTaskDeclarationKey(declarationKey) {
	return declarationKey?.startsWith(HEARTBEAT_TASK_DECLARATION_PREFIX) === true;
}
/** Stable declaration identity; duplicate names add their deterministic occurrence ordinal. */
function heartbeatTaskDeclarationKey(agentId, taskName, occurrenceIndex = 0) {
	const hash = createHash("sha256").update(agentId).update("\0").update(taskName);
	if (occurrenceIndex > 0) hash.update("\0").update(String(occurrenceIndex));
	const identity = hash.digest("hex").slice(0, 24);
	return `${HEARTBEAT_TASK_DECLARATION_PREFIX}${agentId}:${identity}`;
}
/** Migrated jobs keep public system-event payloads so cron tools can edit or remove them normally. */
function isHeartbeatTaskCronJob(job) {
	return isHeartbeatTaskDeclarationKey(job.declarationKey) && job.payload.kind === "systemEvent" && job.sessionTarget === "main";
}
//#endregion
export { isHeartbeatTaskCronJob as n, heartbeatTaskDeclarationKey as t };
