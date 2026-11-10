import { t as resolveCronAgentSessionKey } from "./session-key-CWEGpfa5.mjs";
//#region src/cron/run-authority.ts
var CronSessionLifecycleClaimError = class extends Error {
	constructor(sessionKey, message = `Session "${sessionKey}" changed while starting work. Retry.`) {
		super(message);
		this.admissionDisposition = "session-conflict";
		this.name = "CronSessionLifecycleClaimError";
	}
};
/** Scheduler-owned provenance determines authority, independently of the selected runner. */
function resolveCronRunAdmissionSource(job) {
	return job.owner?.sessionKey || job.owner?.accountId || job.scheduledToolPolicy?.mode === "account" || job.payload.kind === "agentTurn" && job.payload.externalContentSource || job.toolsAllowProvenance?.channelRequester || job.toolsAllowProvenance && job.toolsAllowProvenance.callerOrigin?.kind !== "local" ? "requester-schedule" : "operator-schedule";
}
/** A scheduled requester cannot acquire another conversation's filesystem binding. */
function resolveCronSessionWorkspaceOwnershipError(params) {
	if (!params.hasWorkspaceBinding || params.admissionSource !== "requester-schedule") return;
	const ownerSessionKey = params.ownerSessionKey?.trim();
	if (!ownerSessionKey || resolveCronAgentSessionKey({
		sessionKey: ownerSessionKey,
		agentId: params.agentId,
		cfg: params.cfg,
		mainKey: params.cfg.session?.mainKey
	}) !== params.sessionKey) return "Requester-scoped automation can only use its owning conversation’s workspace.";
}
//#endregion
export { resolveCronRunAdmissionSource as n, resolveCronSessionWorkspaceOwnershipError as r, CronSessionLifecycleClaimError as t };
