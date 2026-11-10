import { r as tryResolveCronJobEffectiveAgentId } from "./agent-id-C6uS-TyD.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-CWEGpfa5.mjs";
import { s as resolveCronSessionTargetSessionKey } from "./session-target-d98pYOqN.mjs";
//#region src/cron/job-session-bindings.ts
/**
* Resolves every canonical session key a job is bound to: the session the run
* joins (main/isolated/session:<key>) plus the explicit wake/delivery lane in
* job.sessionKey. Keys use the same canonicalization as cron run/session
* creation, so they compare equal to gateway session-store row keys.
*/
function resolveCronJobBoundSessionKeys(job, opts) {
	const keys = /* @__PURE__ */ new Set();
	const agentId = tryResolveCronJobEffectiveAgentId(job, opts.defaultAgentId);
	if (!agentId) return keys;
	const add = (sessionKey) => {
		const trimmed = sessionKey?.trim();
		if (!trimmed) return;
		keys.add(resolveCronAgentSessionKey({
			sessionKey: trimmed,
			agentId,
			mainKey: opts.cfg.session?.mainKey,
			cfg: opts.cfg
		}));
	};
	try {
		if (job.sessionTarget === "main") add("main");
		else if (job.sessionTarget === "isolated" || job.sessionTarget === "current") add(`cron:${job.id}`);
		else add(resolveCronSessionTargetSessionKey(job.sessionTarget));
		add(job.sessionKey);
		add(job.sourceConversation?.sessionKey);
	} catch {
		keys.clear();
	}
	return keys;
}
/** Signals a locked re-check found the job no longer bound; a per-job no-op. */
var CronJobBindingStaleError = class extends Error {
	constructor() {
		super("cron job binding changed concurrently");
	}
};
/** Disables enabled jobs bound to any archived session with one job-list scan. */
async function disableCronJobsBoundToSessions(params) {
	const sessionKeys = [...new Set(params.sessionKeys.map((key) => key.trim()).filter(Boolean))];
	const disabledBySession = new Map(sessionKeys.map((sessionKey) => [sessionKey, []]));
	if (sessionKeys.length === 0) return disabledBySession;
	const targetKeys = new Set(sessionKeys);
	const jobs = await params.cron.list();
	const defaultAgentId = params.cron.getDefaultAgentId();
	const matchingSessionKeys = (job) => {
		if (!job.enabled) return [];
		return [...resolveCronJobBoundSessionKeys(job, {
			cfg: params.cfg,
			defaultAgentId
		})].filter((sessionKey) => targetKeys.has(sessionKey));
	};
	const failures = [];
	for (const job of jobs) {
		if (matchingSessionKeys(job).length === 0) continue;
		try {
			let lockedMatches = [];
			await params.cron.updateWithPrecondition(job.id, { enabled: false }, (currentJob) => {
				lockedMatches = matchingSessionKeys(currentJob);
				if (lockedMatches.length === 0) throw new CronJobBindingStaleError();
			});
			for (const sessionKey of lockedMatches) disabledBySession.get(sessionKey)?.push(job.id);
		} catch (error) {
			if (error instanceof CronJobBindingStaleError) continue;
			failures.push(error);
		}
	}
	if (failures.length > 0) {
		const subject = sessionKeys.length === 1 ? `bound to ${sessionKeys[0]}` : `bound to ${sessionKeys.length} archived sessions`;
		throw new AggregateError(failures, `failed to disable ${failures.length} cron job(s) ${subject}`);
	}
	return disabledBySession;
}
//#endregion
export { resolveCronJobBoundSessionKeys as n, disableCronJobsBoundToSessions as t };
