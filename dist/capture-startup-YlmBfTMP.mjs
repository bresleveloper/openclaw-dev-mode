//#region src/transcripts/capture-startup.ts
var TranscriptStartError = class extends Error {
	constructor(code, cause, retry) {
		super(cause instanceof Error ? cause.message : String(cause), { cause });
		this.code = code;
		this.retry = retry;
		this.name = "TranscriptStartError";
	}
};
const pendingStartRetries = /* @__PURE__ */ new Set();
function retainTranscriptStartRetry(stateDir, retry) {
	const owner = {
		stateDir,
		session: retry.session
	};
	pendingStartRetries.add(owner);
	return {
		session: retry.session,
		revision: retry.revision,
		assertCurrent: () => {
			if (!pendingStartRetries.has(owner)) throw new TranscriptStartError("id-conflict", /* @__PURE__ */ new Error("transcript changed or stopped before startup retry"));
		},
		release: () => pendingStartRetries.delete(owner)
	};
}
function revokeTranscriptStartRetries(stateDir, session) {
	for (const owner of pendingStartRetries) if (owner.stateDir === stateDir && owner.session.sessionId === session.sessionId && owner.session.startedAt === session.startedAt) pendingStartRetries.delete(owner);
}
const activeSessions = /* @__PURE__ */ new Map();
const startingSessions = /* @__PURE__ */ new Map();
const capturePolicyTransitions = /* @__PURE__ */ new Map();
function assertTranscriptCaptureEnabled(ctx) {
	if (ctx.config?.transcripts?.enabled === false || capturePolicyTransitions.has(ctx.stateDir)) throw new Error("transcripts are disabled");
}
function createStartupAbortScope(parent) {
	const controller = new AbortController();
	const abortFromParent = () => controller.abort(parent?.reason);
	if (parent?.aborted) abortFromParent();
	else parent?.addEventListener("abort", abortFromParent, { once: true });
	return {
		signal: controller.signal,
		abort: () => controller.abort(),
		detach: () => parent?.removeEventListener("abort", abortFromParent)
	};
}
function prepareTranscriptCaptureDisable(stateDir) {
	const transition = Symbol("capture-policy");
	capturePolicyTransitions.set(stateDir, transition);
	const entries = [.../* @__PURE__ */ new Set([...startingSessions.values(), ...activeSessions.values()])].filter((entry) => entry.directCapture?.stateDir === stateDir);
	for (const entry of entries) {
		entry.cleanupPending = true;
		entry.abortStartup?.();
	}
	return {
		async drain() {
			const failures = (await Promise.allSettled(entries.map(async (entry) => entry.directCapture?.drain()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length) throw new AggregateError(failures, "Transcript capture policy drainage failed");
		},
		resume: () => {
			if (capturePolicyTransitions.get(stateDir) === transition) capturePolicyTransitions.delete(stateDir);
		}
	};
}
//#endregion
export { prepareTranscriptCaptureDisable as a, startingSessions as c, createStartupAbortScope as i, activeSessions as n, retainTranscriptStartRetry as o, assertTranscriptCaptureEnabled as r, revokeTranscriptStartRetries as s, TranscriptStartError as t };
