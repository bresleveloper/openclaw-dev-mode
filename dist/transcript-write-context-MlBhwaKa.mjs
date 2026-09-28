import { c as trackAsyncWork } from "./async-work-scope-CWk2dk1h.mjs";
import { r as runWithCliHistoryWriter } from "./cli-history-boundary-CwwMqsE-.mjs";
import { i as sameSessionTranscriptTargetBinding, r as sameSessionTranscriptStorageEnvironment, t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-CqmhHNa_.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/transcript-write-context.ts
const ownedTranscriptWriteContext = new AsyncLocalStorage();
function captureWriteTarget(target) {
	const storePath = target.storePath?.trim();
	return {
		...target,
		...storePath ? { storePath: path.resolve(storePath) } : {},
		env: captureSessionTranscriptStorageEnvironment(target.env ?? process.env)
	};
}
function captureWriteContext(context) {
	return context.sessionTarget ? {
		...context,
		sessionTarget: captureWriteTarget(context.sessionTarget)
	} : context;
}
function sameMetadataChange(left, right) {
	return left.type === "model_change" ? right.type === left.type && left.provider === right.provider && left.modelId === right.modelId : right.type === left.type && left.thinkingLevel === right.thinkingLevel;
}
/** Couple one metadata append to its caller's synchronous state publication. */
async function withSessionMetadataPublication(owner, change, publish, run) {
	const parent = ownedTranscriptWriteContext.getStore();
	const target = owner.getSessionTarget();
	const metadataPublication = { current: {
		owner,
		sessionId: owner.getSessionId(),
		target,
		change,
		publish
	} };
	try {
		return await ownedTranscriptWriteContext.run({
			...parent,
			withTranscriptWrite: parent ? (write) => parent.withTranscriptWrite(write) : trackAsyncWork,
			metadataPublication
		}, run);
	} finally {
		metadataPublication.current = void 0;
	}
}
/** Claim before the append yields, so a reentrant observer cannot take its publisher. */
function captureSessionMetadataPublication(owner, change) {
	const currentTarget = owner.getSessionTarget();
	const captured = {
		sessionId: owner.getSessionId(),
		target: currentTarget
	};
	const slot = ownedTranscriptWriteContext.getStore()?.metadataPublication;
	if (!slot?.current) return {
		...captured,
		publish: () => void 0
	};
	const publication = slot.current;
	if (publication.owner !== owner || publication.sessionId !== owner.getSessionId() || !sameSessionTranscriptTargetBinding(publication.target, owner.getSessionTarget()) || !sameMetadataChange(publication.change, change)) throw new SessionTranscriptWriterClaimReboundError();
	slot.current = void 0;
	return {
		...captured,
		publish: (commit) => {
			if (publication.sessionId !== owner.getSessionId() || !sameSessionTranscriptTargetBinding(publication.target, owner.getSessionTarget())) return;
			if (!sameSessionTranscriptTargetBinding(publication.target, commit.target) || !sameMetadataChange(publication.change, commit.entry)) throw new Error("Committed metadata differs from its publication owner");
			publication.publish(commit);
		}
	};
}
function normalizeConcretePathForCompare(value) {
	const trimmed = value?.trim();
	if (!trimmed || !path.isAbsolute(trimmed) || !trimmed.endsWith(".jsonl")) return;
	return path.resolve(trimmed);
}
function contextMatches(params) {
	const normalizeTarget = (target) => {
		const agentId = target?.agentId?.trim();
		const sessionId = target?.sessionId?.trim();
		const sessionKey = target?.sessionKey?.trim();
		const storePath = target?.storePath?.trim();
		return sessionKey && storePath ? {
			agentId,
			sessionId,
			sessionKey,
			storePath,
			env: target?.env
		} : void 0;
	};
	const contextTarget = normalizeTarget(params.context.sessionTarget);
	const requestedTarget = normalizeTarget(params.sessionTarget);
	if (params.context.sessionTarget || params.sessionTarget) return Boolean(contextTarget && requestedTarget && contextTarget.sessionKey === requestedTarget.sessionKey && contextTarget.storePath === requestedTarget.storePath && sameSessionTranscriptStorageEnvironment(contextTarget.env, requestedTarget.env) && (!contextTarget.agentId || !requestedTarget.agentId || contextTarget.agentId === requestedTarget.agentId) && (!contextTarget.sessionId || !requestedTarget.sessionId || contextTarget.sessionId === requestedTarget.sessionId));
	const contextSessionFile = normalizeConcretePathForCompare(params.context.sessionFile);
	const sessionFile = normalizeConcretePathForCompare(params.sessionFile);
	if (contextSessionFile && sessionFile) return contextSessionFile === sessionFile;
	const contextSessionKey = params.context.sessionKey?.trim();
	const sessionKey = params.sessionKey?.trim();
	return Boolean(contextSessionKey && sessionKey && contextSessionKey === sessionKey);
}
/**
* Ownership test for a writer fence, which is the one gate a caller can reach holding
* nothing but a session key. A delivery mirror knows the session it writes into but not
* that session's store path, so it cannot form a target; `contextMatches` would refuse
* it for not being target-shaped and leave it unable to tell "the running session" from
* "some other session". Compare keys in that case, and defer to the target comparison
* whenever the caller can express one.
*/
function ownsRequestedSession(params) {
	if (params.sessionTarget || params.sessionFile) return contextMatches(params);
	const contextSessionKey = (params.context.sessionTarget?.sessionKey ?? params.context.sessionKey)?.trim();
	const sessionKey = params.sessionKey?.trim();
	return Boolean(contextSessionKey && sessionKey && contextSessionKey === sessionKey);
}
/** Runs transcript writes with the admitted run's teardown and writer-fence context. */
async function withOwnedSessionTranscriptWrites(context, run) {
	return await ownedTranscriptWriteContext.run(captureWriteContext(context), run);
}
/** Add a caller's live capability without replacing its admitted writer or settlement owner. */
function withSessionTranscriptWriteAssertion(scope, assertCurrent, run) {
	const parent = ownedTranscriptWriteContext.getStore();
	const target = captureWriteTarget(scope);
	assertTranscriptWriteContext(parent, target);
	assertCurrent();
	return ownedTranscriptWriteContext.run({
		...parent,
		sessionTarget: parent?.sessionTarget ?? target,
		assertCommitAllowed: () => {
			parent?.assertCommitAllowed?.();
			assertCurrent();
		},
		withTranscriptWrite: parent ? (write) => parent.withTranscriptWrite(write) : trackAsyncWork
	}, run);
}
/** Runs detached work without retaining an attempt-owned transcript context. */
function runWithoutOwnedSessionTranscriptWrites(run) {
	return ownedTranscriptWriteContext.exit(() => runWithCliHistoryWriter(void 0, run));
}
function bindOwnedSessionTranscriptWrites(context, run) {
	const captured = captureWriteContext(context);
	return (...args) => ownedTranscriptWriteContext.run(captured, () => run(...args));
}
/**
* Returns the matching admitted-run fence for a durable write boundary.
*
* Every write boundary must name the session it writes into, or it inherits a claim
* about whichever session happens to be running. Omitting the scope asks for the
* ambient claim itself and is only for diagnostics that observe the running writer.
*/
function getOwnedSessionTranscriptWriterFence(params = {}) {
	const context = ownedTranscriptWriteContext.getStore();
	if (!context || Object.keys(params).length > 0 && !ownsRequestedSession({
		context,
		...params,
		sessionTarget: params.sessionTarget ? captureWriteTarget(params.sessionTarget) : void 0
	})) return;
	const initial = context.initialWriter;
	if (initial) return initial.committedFence ?? {
		expectedLifecycleRevision: void 0,
		expectedWriterRunId: initial.writerRunId
	};
	const target = context.sessionTarget;
	const expectedWriterRunId = target?.expectedWriterRunId?.trim();
	return expectedWriterRunId ? {
		expectedLifecycleRevision: target?.expectedLifecycleRevision,
		expectedWriterRunId
	} : void 0;
}
/** Inherit only the exact host-minted first-insert owner across attempt preparation. */
function getOwnedSessionTranscriptInitialWriter(params) {
	const context = ownedTranscriptWriteContext.getStore();
	if (!context?.initialWriter) return;
	if (!contextMatches({
		context,
		...params,
		sessionTarget: params.sessionTarget ? captureWriteTarget(params.sessionTarget) : void 0
	}) || context.sessionTarget?.sessionId !== params.sessionTarget?.sessionId || context.sessionTarget?.agentId !== params.sessionTarget?.agentId) throw new SessionTranscriptWriterClaimReboundError();
	return context.initialWriter;
}
function assertTranscriptWriteContext(context, scope) {
	if (!context?.assertCommitAllowed && !context?.initialWriter) return;
	if (!contextMatches({
		context,
		sessionTarget: scope
	}) || context.sessionTarget?.sessionId !== scope.sessionId || context.sessionTarget?.agentId !== scope.agentId) throw new SessionTranscriptWriterClaimReboundError();
	context.assertCommitAllowed?.();
	context.initialWriter?.assertActive();
}
/** A guarded context cannot silently become an unfenced write to another target. */
function assertOwnedTranscriptWriteCommit(scope) {
	assertTranscriptWriteContext(ownedTranscriptWriteContext.getStore(), captureWriteTarget(scope));
}
/** Retained post-commit work must revalidate its original owner, not its invocation context. */
function captureOwnedTranscriptWriteAssertion(scope) {
	const context = ownedTranscriptWriteContext.getStore();
	const target = captureWriteTarget(scope);
	return () => assertTranscriptWriteContext(context, target);
}
/** Applies the admitted-run fence inherited by a matching synchronous writer. */
function withOwnedSessionTranscriptWriterFence(scope) {
	const target = captureWriteTarget(scope);
	const fence = getOwnedSessionTranscriptWriterFence({
		sessionKey: target.sessionKey,
		sessionTarget: target
	});
	return fence ? {
		...scope,
		...fence
	} : scope;
}
var SessionTranscriptWriterClaimReboundError = class extends Error {
	constructor(cause) {
		super("session writer claim changed before transcript persistence", { cause });
		this.name = "SessionTranscriptWriterClaimReboundError";
	}
};
async function runWithOwnedSessionTranscriptWrite(params, run) {
	const context = ownedTranscriptWriteContext.getStore();
	if (!context || !contextMatches({
		context,
		...params,
		sessionTarget: params.sessionTarget ? captureWriteTarget(params.sessionTarget) : void 0
	})) return await run();
	return await context.withTranscriptWrite(run);
}
//#endregion
export { captureSessionMetadataPublication as a, runWithOwnedSessionTranscriptWrite as c, withOwnedSessionTranscriptWrites as d, withSessionMetadataPublication as f, captureOwnedTranscriptWriteAssertion as i, runWithoutOwnedSessionTranscriptWrites as l, assertOwnedTranscriptWriteCommit as n, getOwnedSessionTranscriptInitialWriter as o, withSessionTranscriptWriteAssertion as p, bindOwnedSessionTranscriptWrites as r, getOwnedSessionTranscriptWriterFence as s, SessionTranscriptWriterClaimReboundError as t, withOwnedSessionTranscriptWriterFence as u };
