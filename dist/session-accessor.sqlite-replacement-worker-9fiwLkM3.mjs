import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { r as getChildLogger } from "./logger-Mnn26Jj7.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as SqliteWorkerError, d as retainSqliteWorkerErrorCode, l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { y as retainSessionEntryWorkerPublication } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { a as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-DY_MUUYo.mjs";
//#region src/config/sessions/session-accessor.sqlite-replacement-worker.ts
function rejectUnknownSessionEntryOutcome(message, cause) {
	if (hasSqliteWorkerOutcomeUnknown(cause)) throw cause;
	const error = new SqliteWorkerError(message, "outcome-unknown");
	error.cause = cause;
	throw error;
}
async function withSessionEntryWorker(options, databaseIdentity, assertCurrent, run, onCommit, retainedExecution, signal, prepare, onTransaction, onAdmission) {
	const execution = retainedExecution ?? captureOpenClawAgentDatabaseExecution(options, databaseIdentity ? { expectedIdentity: {
		kind: "file",
		physicalIdentity: databaseIdentity,
		nativeLocation: options.path
	} } : {});
	const assertRetainedIdentity = () => {
		if (!retainedExecution) return;
		if (!options.env || execution.agentId !== normalizeAgentId(options.agentId)) throw new Error("Session writer differs from its captured database scope");
		const accepted = execution.fileIdentity;
		if (!accepted) {
			if (databaseIdentity !== void 0 || execution.path !== options.path) throw new Error("Session writer has no accepted identity for this target");
			return;
		}
		if (databaseIdentity !== void 0 && accepted.physicalIdentity !== databaseIdentity) throw new Error("Session writer differs from its original read snapshot");
		assertExistingDatabaseIdentity(options.path, `file:${accepted.physicalIdentity}`, accepted.birthtime);
	};
	let assertNativeCurrent;
	const context = {
		env: Object.freeze({ ...options.env ?? process.env }),
		assertCurrent() {
			execution.assertCurrent();
			assertRetainedIdentity();
			assertNativeCurrent?.();
		}
	};
	const assertHeld = () => {
		execution.assertCurrent();
		assertCurrent();
		assertRetainedIdentity();
	};
	const source = {
		assertCurrent: assertHeld,
		createAdmission(binding) {
			assertNativeCurrent = () => binding.assertCurrent();
			return (retained) => {
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					binding.authorize(request);
					assertHeld();
					if (onAdmission?.(admission, retained, request, grant)) return;
					if (request.stage === "commit") onCommit?.(admission, retained, request.facts);
					else if (request.stage === "transaction") onTransaction?.(request.facts);
					if (!grant()) throw new Error("Session replacement authority expired");
				}, binding.attachment);
				return {
					nativeLocations: binding.nativeLocations,
					admission
				};
			};
		}
	};
	let preparation;
	let outcome;
	try {
		preparation = prepare?.(execution, source);
		if (preparation) {
			if (!await runOpenClawAgentWorkerWrite(options, async () => {
				await execution.prepare(source);
				return execution.runExisting(source, async () => true);
			}, void 0, signal)) throw new Error("Session database disappeared before preparation");
			await preparation.prepare();
		}
		outcome = {
			ok: true,
			value: await runOpenClawAgentWorkerWrite(options, () => {
				preparation?.beforeWrite();
				return run(execution, source, context);
			}, void 0, signal)
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	const cleanupErrors = [];
	for (const cleanup of [() => preparation?.release(), () => retainedExecution ? void 0 : execution.release()]) try {
		await cleanup();
	} catch (error) {
		cleanupErrors.push(error);
	}
	if (cleanupErrors.length) {
		if (!outcome.ok) throw retainSqliteWorkerErrorCode(createSqliteLifecycleAggregateError([outcome.error, ...cleanupErrors], "Session mutation and executor cleanup failed", outcome.error), outcome.error);
		try {
			getChildLogger({ subsystem: "session-sqlite" }).warn("Session mutation completed before executor cleanup failed", { errors: cleanupErrors.map((error) => formatErrorMessage(error)) });
		} catch {}
	}
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}
function prepareSessionEntryReplacementDatabase(options, assertCurrent, retainedExecution) {
	return withSessionEntryWorker(options, void 0, assertCurrent, (execution, source) => execution.prepare(source), void 0, retainedExecution);
}
async function initializeSessionTranscriptInWorker(options, databaseIdentity, input, assertCurrent) {
	const publication = retainSessionEntryWorkerPublication({
		agentId: options.agentId,
		storePath: options.path,
		databaseIdentity
	});
	let admitted;
	await withSessionEntryWorker(options, databaseIdentity, assertCurrent, async (execution, source) => {
		if (!await execution.runExisting(source, async (worker) => {
			const outcome = await worker.execute({
				type: "session.transcript.initialize",
				input
			}).then((value) => ({
				ok: true,
				value
			}), (error) => ({
				ok: false,
				error
			}));
			let unknown = outcome.ok;
			if (admitted) {
				await admitted.retained.settled;
				const facts = admitted.admission.committed?.facts;
				const placeholder = isRecord(facts) && isRecord(facts.placeholder) && typeof facts.placeholder.sessionId === "string" ? { sessionId: facts.placeholder.sessionId } : void 0;
				let receipt = outcome.ok ? outcome.value : void 0;
				if (isRecord(facts) && facts.kind === "session-transcript-initialized" && facts.sessionKey === input.sessionKey && (facts.placeholder === void 0 || placeholder?.sessionId === input.sessionId)) receipt = {
					kind: "session-transcript-initialized",
					sessionKey: facts.sessionKey,
					...placeholder ? { placeholder } : {}
				};
				unknown = admitted.admission.settlement?.kind !== "completed" || !receipt;
				publication.settle(receipt, unknown);
			}
			if (unknown) rejectUnknownSessionEntryOutcome("Session transcript initialization has no confirmed native completion and commit receipt", outcome.ok ? void 0 : outcome.error);
			if (!outcome.ok) throw outcome.error;
			return true;
		})) throw new Error("Session database disappeared before transcript initialization");
	}, (admission, retained, facts) => {
		if (!isRecord(facts) || !isRecord(facts.publication) || facts.publication.kind !== "session-transcript-initialized" || facts.publication.sessionKey !== input.sessionKey || facts.publication.placeholder !== void 0 && (!isRecord(facts.publication.placeholder) || facts.publication.placeholder.sessionId !== input.sessionId)) throw new Error("Session transcript commit omitted its exact publication facts");
		admitted = {
			admission,
			retained
		};
		publication.begin([input.sessionKey], []);
	});
}
async function runSessionEntryWorkerMutation(options, databaseIdentity, assertCurrent, run, lifecycle, executionOptions = {}) {
	const unknownMessage = "Session entry mutation has no confirmed native completion and commit receipt";
	const publication = retainSessionEntryWorkerPublication({
		agentId: lifecycle.identityAgentId,
		storePath: options.path,
		databaseIdentity
	});
	let completed;
	let admitted;
	const settle = async () => {
		if (!admitted) {
			if (completed?.kind === "committed") return true;
			if (completed) lifecycle.onResult?.(completed.value);
			return false;
		}
		await admitted.retained.settled;
		const facts = admitted.admission.committed?.facts;
		let receipt;
		if (isRecord(facts) && facts.kind === "session-entry-replacements") receipt = facts;
		else if (completed?.kind === "committed") receipt = completed.publication;
		const unknown = admitted.admission.settlement?.kind !== "completed" || !receipt || completed?.kind === "not-committed";
		try {
			try {
				if (receipt) {
					lifecycle.onResult?.(completed?.value);
					lifecycle.onLifecycleCommitted?.(receipt.pendingArchiveRecovery);
				}
			} finally {
				const published = publication.settle(receipt, unknown);
				if (published) publishCommittedSessionIdentity(lifecycle.identityAgentId, databaseIdentity, published.previous, published.current, published.prepared);
			}
		} catch (error) {
			if (unknown) rejectUnknownSessionEntryOutcome(unknownMessage, error);
			throw error;
		}
		return unknown;
	};
	return await withSessionEntryWorker(options, databaseIdentity, assertCurrent, (execution, source, context) => execution.runExisting(source, async (worker) => {
		const outcome = await run(worker).then((value) => ({
			ok: true,
			value
		}), (error) => ({
			ok: false,
			error
		}));
		if (outcome.ok) completed = outcome.value;
		if (await settle()) rejectUnknownSessionEntryOutcome(unknownMessage, outcome.ok ? void 0 : outcome.error);
		if (!outcome.ok) throw outcome.error;
		if (outcome.value.kind === "committed") await lifecycle.afterCommitted?.(context);
		return { value: outcome.value.value };
	}).then((result) => {
		if (!result) throw new Error("Session database disappeared before mutation");
		return result.value;
	}), (admission, retained, facts) => {
		if (!isRecord(facts) || !isRecord(facts.publication) || facts.publication.kind !== "session-entry-replacements" || !Array.isArray(facts.publication.changedKeys) || !facts.publication.changedKeys.every((key) => typeof key === "string") || !Array.isArray(facts.publication.membershipInvalidatedKeys) || !facts.publication.membershipInvalidatedKeys.every((key) => typeof key === "string") || !Array.isArray(facts.publication.sharingUnchangedKeys) || !facts.publication.sharingUnchangedKeys.every((key) => typeof key === "string")) throw new Error("Session entry mutation commit omitted its publication keys");
		admitted = {
			admission,
			retained
		};
		publication.begin(facts.publication.changedKeys, facts.publication.membershipInvalidatedKeys, facts.publication.sharingUnchangedKeys);
	}, executionOptions.retainedExecution, executionOptions.signal, executionOptions.prepare);
}
function commitSessionEntryReplacementsInWorker(options, databaseIdentity, input, assertCurrent, lifecycle, retainedExecution) {
	return runSessionEntryWorkerMutation(options, databaseIdentity, assertCurrent, async (worker) => {
		const value = await worker.execute({
			type: "session.entries.replace",
			input
		});
		return {
			kind: "committed",
			value,
			publication: value.publication
		};
	}, lifecycle, { retainedExecution });
}
//#endregion
export { withSessionEntryWorker as a, runSessionEntryWorkerMutation as i, initializeSessionTranscriptInWorker as n, prepareSessionEntryReplacementDatabase as r, commitSessionEntryReplacementsInWorker as t };
