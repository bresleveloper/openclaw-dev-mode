import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { a as captureExternalSessionCommitGuard, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as sameSessionTranscriptTargetBinding, n as captureSessionTranscriptTargetBinding, r as sameSessionTranscriptStorageEnvironment, t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { r as getCliHistoryWriter } from "./cli-history-boundary-B1eSXpAQ.mjs";
import { t as ownedTranscriptWriteContext } from "./transcript-write-context-owner-Dx0JDp93.mjs";
import { a as readSessionActorEntryFacts } from "./session-actor-replica-D_j2y4I5.mjs";
import { n as matchSessionEntryCohortScope, t as assertSessionEntryCohortScope } from "./session-entry-cohort-scope-BWJvT1Qn.mjs";
import path from "node:path";
//#region src/config/sessions/transcript-write-context.ts
/** Bind an initiating write's acknowledged source before fallible publication observers. */
async function withSessionTranscriptSourcePublication(target, publish, run) {
	const parent = ownedTranscriptWriteContext.getStore();
	const publication = {
		target: captureWriteTarget(target),
		claimed: false,
		publish
	};
	try {
		return await ownedTranscriptWriteContext.run({
			...parent,
			withTranscriptWrite: parent ? (write) => parent.withTranscriptWrite(write) : trackAsyncWork,
			sourcePublication: publication
		}, run);
	} finally {
		publication.publish = void 0;
	}
}
function captureSessionTranscriptSourcePublication(target) {
	const publication = ownedTranscriptWriteContext.getStore()?.sourcePublication;
	if (!publication || publication.claimed || !contextMatches({
		context: {
			sessionTarget: publication.target,
			withTranscriptWrite: trackAsyncWork
		},
		sessionTarget: captureWriteTarget(target)
	})) return;
	publication.claimed = true;
	return (source, entry) => publication.publish?.(source, entry);
}
/** Borrow the selected physical owner only for this exact admitted transcript. */
function getOwnedSessionTranscriptReader(scope) {
	const context = ownedTranscriptWriteContext.getStore();
	const reader = context?.sessionReader;
	const original = context?.sessionTarget;
	if (!reader || !scope.sessionKey || !original?.sessionKey || original.sessionId !== scope.sessionId) return;
	if (!matchSessionEntryCohortScope(reader, { sessionKey: scope.sessionKey })) return;
	assertSessionEntryCohortScope(reader, {
		...original,
		sessionKey: original.sessionKey
	});
	assertSessionEntryCohortScope(reader, {
		...captureWriteTarget(scope),
		sessionKey: scope.sessionKey
	});
	context.assertCommitAllowed?.();
	return reader;
}
function findOwnedSessionTranscriptActor(scope) {
	const context = ownedTranscriptWriteContext.getStore();
	const actor = context?.sessionActor;
	if (!actor) return;
	if (!contextMatches({
		context,
		sessionTarget: captureWriteTarget(scope)
	}) || context.sessionTarget?.sessionId !== scope.sessionId || context.sessionTarget?.agentId !== scope.agentId) return;
	context.assertCommitAllowed?.();
	actor.actor.assertCurrent();
	return actor;
}
/** Borrow only the actor retained for this exact admitted transcript. */
function getOwnedSessionTranscriptActor(scope) {
	const actor = findOwnedSessionTranscriptActor(scope);
	if (!actor && ownedTranscriptWriteContext.getStore()?.sessionActor) throw new SessionTranscriptWriterClaimReboundError();
	return actor;
}
/** Borrow committed transcript facts through the active run's existing authority. */
function readOwnedSessionTranscriptState(scope) {
	const binding = findOwnedSessionTranscriptActor(scope);
	if (!binding) return;
	const assertCurrent = captureOwnedTranscriptWriteAssertion(scope);
	const state = binding.actor.snapshot({
		assertCurrent,
		authorize: assertCurrent
	});
	return state?.entry?.sessionId === scope.sessionId ? state : void 0;
}
/** Borrow committed entry facts only while the caller holds the transcript writer FIFO. */
function readOwnedSessionTranscriptEntry(scope) {
	const binding = findOwnedSessionTranscriptActor(scope);
	if (!binding) return;
	const assertCurrent = captureOwnedTranscriptWriteAssertion(scope);
	const target = binding.actor.target;
	const entry = target.database.kind === "file" ? readSessionActorEntryFacts({
		...target,
		database: target.database
	}, [])?.entry : binding.actor.snapshot({
		assertCurrent,
		authorize: assertCurrent
	})?.entry;
	return entry && {
		sessionId: entry.sessionId,
		updatedAt: entry.updatedAt,
		lifecycleRevision: entry.lifecycleRevision,
		activeWriterRunId: entry.activeWriterRunId,
		cliHistoryBoundary: entry.cliHistoryBoundary,
		permissionMode: entry.permissionMode
	};
}
function captureWriteTarget(target) {
	const storePath = target.storePath?.trim();
	return {
		...storePath ? captureSessionTranscriptTargetBinding({
			...target,
			storePath
		}) : {
			...target,
			env: captureSessionTranscriptStorageEnvironment(target.env ?? process.env)
		},
		...target.expectedOwner ? { expectedOwner: { ...target.expectedOwner } } : {}
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
/** Only the matching transcript owner can admit a restart's interrupted assistant row. */
async function withOwnedSessionRestartAbortWrite(scope, write) {
	const context = ownedTranscriptWriteContext.getStore();
	if (!scope || !context?.withRestartAbortWrite) return await write();
	if (!contextMatches({
		context,
		sessionTarget: captureWriteTarget(scope)
	})) throw new SessionTranscriptWriterClaimReboundError();
	return await context.withRestartAbortWrite(write);
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
		assertCommitAllowed: composeSessionSourceAssertion([captureExternalSessionCommitGuard(parent?.assertCommitAllowed), captureExternalSessionCommitGuard(assertCurrent)]),
		withTranscriptWrite: parent ? (write) => parent.withTranscriptWrite(write) : trackAsyncWork
	}, run);
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
	if (context && Object.keys(params).length > 0 && !ownsRequestedSession({
		context,
		...params,
		sessionTarget: params.sessionTarget ? captureWriteTarget(params.sessionTarget) : void 0
	})) return;
	const initial = context?.initialWriter;
	if (initial) return initial.committedFence ?? {
		expectedLifecycleRevision: void 0,
		expectedWriterRunId: initial.writerRunId
	};
	const target = context?.sessionTarget;
	const expectedWriterRunId = target?.expectedWriterRunId?.trim();
	if (expectedWriterRunId) return {
		expectedLifecycleRevision: target?.expectedLifecycleRevision,
		expectedWriterRunId
	};
	const cliWriter = params.sessionTarget && getCliHistoryWriter(params.sessionTarget);
	cliWriter?.assertCurrent();
	return cliWriter ? {
		expectedLifecycleRevision: cliWriter.lifecycleRevision,
		expectedWriterRunId: cliWriter.runId
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
function assertTranscriptWriteContext(context, scope, assertSource = () => {
	context?.assertCommitAllowed?.();
	context?.initialWriter?.assertActive();
}) {
	if (!context?.assertCommitAllowed && !context?.initialWriter) return;
	if (!contextMatches({
		context,
		sessionTarget: scope
	}) || context.sessionTarget?.sessionId !== scope.sessionId || context.sessionTarget?.agentId !== scope.agentId) throw new SessionTranscriptWriterClaimReboundError();
	assertSource();
}
/** A committed first-insert owner can settle through the current terminal writer. */
function assertSessionTranscriptInitialWriter(writer, scope) {
	const context = ownedTranscriptWriteContext.getStore();
	if (writer.committedFence && context?.settledInitialWriter === writer) {
		assertTranscriptWriteContext(context, captureWriteTarget(scope));
		return;
	}
	writer.assertActive();
}
/** A guarded context cannot silently become an unfenced write to another target. */
function assertOwnedTranscriptWriteCommit(scope) {
	assertTranscriptWriteContext(ownedTranscriptWriteContext.getStore(), captureWriteTarget(scope));
}
/** Retained post-commit work must revalidate its original owner, not its invocation context. */
function captureOwnedTranscriptWriteAssertion(scope) {
	const context = ownedTranscriptWriteContext.getStore();
	const target = captureWriteTarget(scope);
	return composeSessionSourceAssertion([captureExternalSessionCommitGuard(context?.assertCommitAllowed), context?.initialWriter?.assertActive], (assertSource) => assertTranscriptWriteContext(context, target, assertSource));
}
/** Applies the admitted-run fence inherited by a matching writer. */
function withOwnedSessionTranscriptWriterFence(scope) {
	const target = captureWriteTarget(scope);
	const fence = getOwnedSessionTranscriptWriterFence({
		sessionKey: target.sessionKey,
		sessionTarget: target
	});
	const context = ownedTranscriptWriteContext.getStore();
	const expectedOwner = context?.sessionTarget?.expectedOwner;
	if (expectedOwner && context && ownsRequestedSession({
		context,
		sessionTarget: target
	})) return {
		...scope,
		...fence,
		expectedOwner: { ...expectedOwner }
	};
	return fence ? {
		...scope,
		...fence
	} : scope;
}
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
export { withSessionMetadataPublication as _, captureSessionMetadataPublication as a, getOwnedSessionTranscriptInitialWriter as c, readOwnedSessionTranscriptEntry as d, readOwnedSessionTranscriptState as f, withOwnedSessionTranscriptWrites as g, withOwnedSessionTranscriptWriterFence as h, captureOwnedTranscriptWriteAssertion as i, getOwnedSessionTranscriptReader as l, withOwnedSessionRestartAbortWrite as m, assertSessionTranscriptInitialWriter as n, captureSessionTranscriptSourcePublication as o, runWithOwnedSessionTranscriptWrite as p, bindOwnedSessionTranscriptWrites as r, getOwnedSessionTranscriptActor as s, assertOwnedTranscriptWriteCommit as t, getOwnedSessionTranscriptWriterFence as u, withSessionTranscriptSourcePublication as v, withSessionTranscriptWriteAssertion as y };
