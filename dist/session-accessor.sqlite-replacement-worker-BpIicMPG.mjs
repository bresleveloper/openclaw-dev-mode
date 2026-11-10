import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { c as SqliteWorkerError, p as retainSqliteWorkerErrorCode, u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { c as prepareSessionSourceAuthority, t as acceptSessionSourceValidation, u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { r as assertAgentSessionWriteAdmission } from "./session-agent-work-admission-D63nonbM.mjs";
import { o as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { t as parseSessionTranscriptAuthorityReceipts } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { n as decodeSessionTranscriptWorkerReadError } from "./session-history-worker-errors-D75quOgT.mjs";
import { a as withSessionEntryWriterReads } from "./session-entry-read-facts-XUOtyCt0.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { n as retainSessionEntryWorkerPublication } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
//#region src/config/sessions/session-worker-receipt.ts
function throwSessionWorkerOutcomeUnknown(message, cause) {
	if (hasSqliteWorkerOutcomeUnknown(cause)) throw cause;
	const error = new SqliteWorkerError(message, "outcome-unknown");
	error.cause = cause;
	throw error;
}
/** An acknowledged native receipt survives failed result delivery; FIFO stays held until settlement. */
async function settleSessionWorkerReceipt(run, getAdmission, readReceipt, missingMessage, unsettledMessage) {
	const outcome = await run().then(() => ({ ok: true }), (error) => ({
		ok: false,
		error
	}));
	const admitted = getAdmission();
	if (admitted) {
		await admitted.retained.settled;
		if (admitted.admission.settlement?.kind === "completed") {
			const receipt = readReceipt(admitted.admission.committed?.facts);
			if (receipt !== void 0) return receipt;
		} else if (unsettledMessage) throw new SqliteWorkerError(unsettledMessage, "outcome-unknown");
	}
	if (!outcome.ok) throw outcome.error;
	throw new SqliteWorkerError(missingMessage, "outcome-unknown");
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-replacement-worker.ts
async function withSessionEntryWorker(options, databaseIdentity, assertCurrent, run, onCommit, retainedExecution, signal, prepare, onTransaction, onAdmission, releaseSource, operationMode = "write", expectedCreationIdentity) {
	let execution;
	let env;
	try {
		if (operationMode === "write") assertAgentSessionWriteAdmission(options);
		env = Object.freeze({ ...options.env ?? process.env });
		const targetIdentity = !retainedExecution && !databaseIdentity && !expectedCreationIdentity ? readDatabasePathIdentitySync(options.path) : void 0;
		execution = retainedExecution ?? captureOpenClawAgentDatabaseExecution(options, {
			expectedCreationIdentity: databaseIdentity ? void 0 : expectedCreationIdentity ?? (targetIdentity?.key.startsWith("path:") ? targetIdentity : void 0),
			expectedIdentity: databaseIdentity ? {
				kind: "file",
				physicalIdentity: databaseIdentity,
				nativeLocation: options.path
			} : void 0
		});
	} catch (error) {
		try {
			await releaseSource?.();
		} catch (cleanupError) {
			throw retainSqliteWorkerErrorCode(createSqliteLifecycleAggregateError([error, cleanupError], "Session writer acquisition and source cleanup failed", error), error);
		}
		throw error;
	}
	let assertNativeCurrent;
	const context = {
		env,
		assertCurrent() {
			execution.assertCurrent();
			assertNativeCurrent?.();
		}
	};
	const assertHeld = () => {
		if (operationMode === "write") assertAgentSessionWriteAdmission(options);
		execution.assertCurrent();
		assertCurrent();
		preparedReadClaim?.assertCurrent();
	};
	let preparedReadClaim;
	const source = {
		assertCurrent: assertHeld,
		createAdmission(binding) {
			assertNativeCurrent = () => binding.assertCurrent();
			return (retained) => {
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					if (operationMode === "prepared-read" && request.stage !== "prepare") throw new Error("Prepared session read cannot open storage or admit a write");
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
	const withWriterReads = (nativeWorker, consume) => {
		const read = (operation) => nativeWorker ? operation(nativeWorker) : execution.runExisting(source, operation);
		return withSessionEntryWriterReads(options, {
			async entry(scope) {
				const result = await read((worker) => worker.execute({
					type: "session.entry.readResult",
					input: {
						kind: "session-entry-read",
						database: {
							agentId: options.agentId,
							path: options.path
						},
						scope: {
							...scope,
							databaseAgentId: options.agentId
						}
					}
				}));
				assertHeld();
				if (!result || result.kind !== "session-entry-read") throw new Error("Session entry read lost its active writer");
				return {
					...result.readError ? err(decodeSessionTranscriptWorkerReadError(result.readError)) : ok(result.entry),
					source: result.source,
					facts: result.facts
				};
			},
			async entries(request) {
				const result = await read((worker) => worker.execute({
					type: "session.entry.read",
					input: request
				}));
				assertHeld();
				if (!result) throw new Error("Session entry read lost its active writer");
				return result;
			}
		}, consume);
	};
	let preparation;
	let outcome;
	try {
		if (operationMode === "prepared-read") {
			if (prepare) throw new Error("Prepared session read cannot prepare a writer");
			preparedReadClaim = execution.capturePreparedGenerationClaim();
			if (!preparedReadClaim) throw new Error("Session read lost its prepared native generation");
			assertHeld();
		}
		preparation = prepare?.(execution, source);
		if (preparation) {
			if (!await runOpenClawAgentWorkerWrite(options, async () => {
				await execution.prepare(source);
				return execution.runExisting(source, async () => true);
			}, void 0, signal)) throw new Error("Session database disappeared before preparation");
			await preparation.prepare();
		}
		const value = operationMode === "prepared-read" ? await run(execution, source, context) : await runOpenClawAgentWorkerWrite(options, () => {
			preparation?.beforeWrite();
			const writingExecution = {
				...execution,
				get fileIdentity() {
					return execution.fileIdentity;
				},
				runExisting(readSource, operation, readOptions) {
					return execution.runExisting(readSource, (worker) => withWriterReads(worker, () => operation(worker)), readOptions);
				}
			};
			return withWriterReads(void 0, () => run(writingExecution, source, context));
		}, void 0, signal);
		if (operationMode === "prepared-read") assertHeld();
		outcome = {
			ok: true,
			value
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	const cleanupErrors = [];
	for (const cleanup of [
		() => releaseSource?.(),
		() => preparation?.release(),
		() => retainedExecution ? void 0 : execution.release()
	]) try {
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
function prepareSessionEntryReplacementDatabase(options, assertCurrent, retainedExecution, followRegistration) {
	const prepared = retainedExecution?.capturePreparedGenerationClaim();
	if (prepared) {
		assertCurrent();
		prepared.assertCurrent();
		return Promise.resolve();
	}
	return withSessionEntryWorker(options, void 0, assertCurrent, (execution, source) => execution.prepare({
		...source,
		onRegistryChange: followRegistration
	}), void 0, retainedExecution);
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
					...placeholder ? { placeholder } : {},
					transcriptPublication: parseSessionTranscriptAuthorityReceipts(facts.transcriptPublication)
				};
				unknown = admitted.admission.settlement?.kind !== "completed" || !receipt;
				publication.settle(receipt, unknown);
			}
			if (unknown) throwSessionWorkerOutcomeUnknown("Session transcript initialization has no confirmed native completion and commit receipt", outcome.ok ? void 0 : outcome.error);
			if (!outcome.ok) throw outcome.error;
			return true;
		})) throw new Error("Session database disappeared before transcript initialization");
	}, (admission, retained, facts) => {
		if (!isRecord(facts) || !isRecord(facts.publication) || facts.publication.kind !== "session-transcript-initialized" || facts.publication.sessionKey !== input.sessionKey || facts.publication.placeholder !== void 0 && (!isRecord(facts.publication.placeholder) || facts.publication.placeholder.sessionId !== input.sessionId)) throw new Error("Session transcript commit omitted its exact publication facts");
		admitted = {
			admission,
			retained
		};
		publication.begin([input.sessionKey], [], [], [], parseSessionTranscriptAuthorityReceipts(facts.publication.transcriptPublication));
	});
}
async function runSessionEntryWorkerMutation(options, databaseIdentity, assertCurrent, run, lifecycle, executionOptions = {}) {
	const unknownMessage = executionOptions.errors?.unknown ?? "Session entry mutation has no confirmed native completion and commit receipt";
	let publication;
	let completed;
	let admitted;
	const settle = async (retainedPublication, identity) => {
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
				const published = retainedPublication.settle(receipt, unknown);
				if (published) publishCommittedSessionIdentity(lifecycle.identityAgentId, identity, published.previous, published.current, published.prepared);
			}
		} catch (error) {
			if (unknown) throwSessionWorkerOutcomeUnknown(unknownMessage, error);
			throw error;
		}
		return unknown;
	};
	return await withSessionEntryWorker(options, databaseIdentity, assertCurrent, (execution, source, context) => execution.runExisting(source, async (worker) => {
		const identity = databaseIdentity ?? execution.fileIdentity?.physicalIdentity;
		if (!identity) throw new Error(executionOptions.errors?.identity ?? "Session entry mutation has no prepared native database identity");
		publication = retainSessionEntryWorkerPublication({
			agentId: lifecycle.identityAgentId,
			storePath: execution.path,
			databaseIdentity: identity
		});
		const outcome = await run(worker).then((value) => ({
			ok: true,
			value
		}), (error) => ({
			ok: false,
			error
		}));
		if (outcome.ok) completed = outcome.value;
		if (await settle(publication, identity)) throwSessionWorkerOutcomeUnknown(unknownMessage, outcome.ok ? void 0 : outcome.error);
		if (!outcome.ok) throw outcome.error;
		if (outcome.value.kind === "committed") await lifecycle.afterCommitted?.(context);
		return { value: outcome.value.value };
	}).then((result) => {
		if (!result) throw new Error(executionOptions.errors?.missing ?? "Session database disappeared before mutation");
		return result.value;
	}), (admission, retained, facts) => {
		if (!isRecord(facts) || !isRecord(facts.publication) || facts.publication.kind !== "session-entry-replacements" || !publication) throw new Error(executionOptions.errors?.publication ?? "Session entry mutation commit omitted its publication keys");
		const committed = facts.publication;
		lifecycle.beforeCommit?.(committed);
		admitted = {
			admission,
			retained
		};
		publication.begin(committed.changedKeys, committed.membershipInvalidatedKeys, committed.sharingUnchangedKeys, committed.generationUnchangedKeys, committed.transcriptPublication, new Map([...committed.current].filter(([key]) => !committed.unavailableParticipantKeys?.includes(key))));
	}, executionOptions.retainedExecution, executionOptions.signal, executionOptions.prepare, executionOptions.onTransaction);
}
async function commitSessionEntryReplacementsInWorker(options, databaseIdentity, input, assertCurrent, lifecycle, retainedExecution, nativeDeletion) {
	const source = await prepareSessionSourceAuthority(assertCurrent);
	const guardedInput = source.checks.every(({ predicate }) => predicate.source.databaseIdentity === databaseIdentity) ? {
		...input,
		sources: source.checks.map(({ predicate }) => predicate)
	} : input;
	const acceptValidation = (facts) => {
		if (isRecord(facts) && facts.kind === "session-entry-replacements-validated") {
			acceptSessionSourceValidation(source, facts.sourceValidation);
			source.assertCurrent();
			return true;
		}
		return false;
	};
	const failures = [];
	try {
		if (nativeDeletion) {
			const { runSessionNativeBindingWorkerOperation } = await import("./session-native-binding-XGLLrdMc.mjs");
			return await runSessionNativeBindingWorkerOperation({
				database: options,
				databaseIdentity,
				agentId: lifecycle.identityAgentId,
				retainedExecution,
				assertCurrent: source.assertCurrent,
				captured: nativeDeletion,
				entries: nativeDeletion.participants.map(({ sessionKey, entry }) => ({
					sessionKey,
					entry
				})),
				candidateKind: "session-entry-replacements",
				execute: (worker, nativeBindings) => worker.execute({
					type: "session.entries.replace",
					input: {
						...guardedInput,
						nativeBindings
					}
				}),
				onTransactionFacts: acceptValidation,
				async onCommitted(candidate, published, identity, context) {
					try {
						lifecycle.onLifecycleCommitted?.(candidate.result.pendingArchiveRecovery);
					} finally {
						if (published) publishCommittedSessionIdentity(lifecycle.identityAgentId, identity, published.previous, published.current, published.prepared);
					}
					await lifecycle.afterCommitted?.(context);
					return candidate.result;
				}
			});
		}
		return await runSessionEntryWorkerMutation(options, databaseIdentity, source.assertCurrent, async (worker) => {
			const value = await worker.execute({
				type: "session.entries.replace",
				input: guardedInput
			});
			if ("kind" in value) throw new Error("Session replacement returned an unexpected native binding receipt");
			return {
				kind: "committed",
				value,
				publication: value.publication
			};
		}, lifecycle, {
			retainedExecution,
			onTransaction: (facts) => {
				if (isRecord(facts)) acceptValidation(facts.publication);
			}
		});
	} catch (error) {
		failures.push(error);
		throw error;
	} finally {
		await releaseSessionSourceAuthorities([source], failures);
	}
}
//#endregion
export { withSessionEntryWorker as a, runSessionEntryWorkerMutation as i, initializeSessionTranscriptInWorker as n, settleSessionWorkerReceipt as o, prepareSessionEntryReplacementDatabase as r, commitSessionEntryReplacementsInWorker as t };
