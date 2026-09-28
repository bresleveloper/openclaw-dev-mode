import { n as computeBackoff, s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import "./backoff-CszdOMiF.mjs";
//#region src/auto-reply/reply/session-init-conflict-retry.ts
const log = createSubsystemLogger("session-init");
/**
* Raised when reply-session initialization loses its revision compare-and-swap.
* The message shape is load-bearing for channel retry classification.
*/
var ReplySessionInitConflictError = class extends Error {
	constructor(sessionKey) {
		super(`reply session initialization conflicted for ${sessionKey}`);
		this.name = "ReplySessionInitConflictError";
	}
};
const SESSION_INIT_CONFLICT_MESSAGE_RE = /^reply session initialization conflicted for \S+$/u;
function isReplySessionInitConflictError(error) {
	return error instanceof ReplySessionInitConflictError || SESSION_INIT_CONFLICT_MESSAGE_RE.test(error instanceof Error ? error.message : String(error));
}
const SESSION_INIT_CONFLICT_MAX_ATTEMPTS = 5;
const SESSION_INIT_CONFLICT_BACKOFF_POLICY = {
	initialMs: 250,
	maxMs: 4e3,
	factor: 2,
	jitter: .05
};
/**
* Retry only the unlocked outer attempt. Sleeping while holding the session-store
* writer lane would prevent the competing commit from settling.
*/
async function runWithSessionInitConflictRetry(attempt, options) {
	const retryDelaysMs = options?.retryDelaysMs;
	const maxRetries = Math.min((options?.maxAttempts ?? (retryDelaysMs ? retryDelaysMs.length + 1 : SESSION_INIT_CONFLICT_MAX_ATTEMPTS)) - 1, retryDelaysMs?.length ?? Number.POSITIVE_INFINITY);
	const sleep = options?.sleep ?? sleepWithAbort;
	for (let attemptIndex = 0;; attemptIndex += 1) try {
		return await attempt();
	} catch (error) {
		if (!isReplySessionInitConflictError(error) || attemptIndex >= maxRetries || options?.signal?.aborted === true) throw error;
		const backoffMs = retryDelaysMs?.[attemptIndex] ?? computeBackoff(SESSION_INIT_CONFLICT_BACKOFF_POLICY, attemptIndex + 1);
		log.debug(`reply session initialization conflicted; retrying in ${backoffMs}ms (attempt ${attemptIndex + 2}/${maxRetries + 1})`);
		await sleep(backoffMs, options?.signal);
	}
}
//#endregion
export { runWithSessionInitConflictRetry as n, ReplySessionInitConflictError as t };
