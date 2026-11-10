import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { o as composeSessionSourceAssertion, s as createDynamicSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { n as getUserTurnTranscriptAdmissionOwner, r as inheritUserTurnPromptReactionSource, s as registerUserTurnTranscriptAdmissionOwner } from "./user-turn-transcript-admission-BZunVvZI.mjs";
import { O as readModelPromptProjection, S as buildLateResolvedMediaMessage, T as isUserMessage, k as resolvePersistedUserTurnMessage } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { a as normalizePersistedSteerTargetRunId, c as rewritePersistedSteerTargetRunId, i as buildRunUserTurnIdempotencyKey, o as preparePersistedUserTurnMessageForTranscriptWrite } from "./user-turn-transcript.metadata-CtXLmxDa.mjs";
import { c as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { A as withSessionPendingInputPersistence, O as readWithdrawnSessionPendingInputId, T as bindSessionPendingInputSources, a as persistSessionTranscriptTurn, k as stageSessionPendingInput, l as rewritePreparedTranscriptMessageAtAnchor } from "./session-accessor-Czw4l8kI.mjs";
import { c as registerUserTurnInputActor, u as withSessionInputActor } from "./session-accessor.sqlite-transcript-turn-CoODj9qI.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { n as publishTranscriptUpdate } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { t as readActiveTranscriptEntryAnchorAsync } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
import { o as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/sessions/user-turn-transcript.persistence.ts
function admittedUserTurnResult(committed, logicalTurnId, sessionKey) {
	if (!committed.anchor) return;
	return {
		...committed,
		admission: {
			...committed.anchor,
			logicalTurnId,
			role: "user"
		},
		sessionFile: sessionKey
	};
}
async function resolveCommittedUserTurnTranscript(originalCommit, params) {
	let committed = originalCommit;
	if (!committed.anchor) {
		const assertCurrent = captureOwnedTranscriptWriteAssertion(params);
		await waitForSessionTranscriptProjection(params);
		const anchor = await readActiveTranscriptEntryAnchorAsync({
			...params,
			entryId: committed.messageId
		});
		assertCurrent();
		if (anchor) committed = {
			...committed,
			anchor
		};
	}
	return admittedUserTurnResult(committed, params.logicalTurnId ?? randomUUID(), params.sessionKey);
}
async function persistUserTurnTranscript(params) {
	const message = resolvePersistedUserTurnMessage(params);
	if (!message) return;
	let committedWithoutAnchor = false;
	const turn = await persistSessionTranscriptTurn({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry,
		sessionStore: params.sessionStore,
		storePath: params.storePath,
		agentId: params.agentId,
		threadId: params.threadId
	}, {
		cwd: params.cwd,
		config: params.config,
		expectedSessionId: params.expectedSessionId,
		initialSessionEntry: params.initialSessionEntry,
		expectedSessionState: params.expectedSessionState,
		sessionLifecyclePatch: params.sessionLifecyclePatch,
		sessionTurnMutation: params.sessionTurnMutation,
		updateMode: params.updateMode ?? "inline",
		onMessageCommitted: (result, acceptCompletion, committedTurn) => {
			if (!isUserMessage(result.message)) return;
			if (committedTurn) params.onCommitted?.({
				...result,
				message: result.message,
				...committedTurn
			}, acceptCompletion);
			if (!result.appended) return;
			if (result.anchor) params.onOriginalInputCommitted?.({
				message: result.message,
				anchor: result.anchor
			});
			else committedWithoutAnchor = true;
		},
		messages: [{
			message,
			idempotencyLookup: "scan",
			workerPreparation: {
				beforeFreshMessageCommit: params.beforeFreshMessageCommit,
				prepareMessageAfterIdempotencyCheck: (candidate) => preparePersistedUserTurnMessageForTranscriptWrite(candidate, params)
			}
		}]
	});
	const result = turn.messages[0];
	if (!result || !isUserMessage(result.message)) return;
	const appended = await resolveCommittedUserTurnTranscript({
		...result,
		message: result.message,
		sessionEntry: turn.sessionEntry,
		sessionTurnMutationResult: turn.sessionTurnMutationResult
	}, params);
	if (!appended) return;
	if (committedWithoutAnchor && appended.appended) params.onOriginalInputCommitted?.({
		message: appended.message,
		anchor: appended.admission
	});
	return appended;
}
//#endregion
//#region src/sessions/user-turn-transcript-media.ts
const uncertainInputOwners = /* @__PURE__ */ new WeakSet();
function retainUncertainInputMedia(recorder, error) {
	if (hasSqliteWorkerOutcomeUnknown(error)) uncertainInputOwners.add(recorder);
	throw error;
}
function retainsUserTurnTranscriptMedia(recorder) {
	return recorder.hasPersisted() || recorder.getPendingInputMessage?.() !== void 0 || uncertainInputOwners.has(recorder);
}
async function stageUserTurnPendingInput(recorder, target, options) {
	const config = target.config;
	const runtimeTarget = await resolveSessionTranscriptRuntimeTarget(target, config);
	try {
		return await stageSessionPendingInput({
			...target,
			...runtimeTarget
		}, {
			...options,
			config
		});
	} catch (error) {
		return retainUncertainInputMedia(recorder, error);
	}
}
async function persistUserTurnInput(recorder, params) {
	try {
		return await persistUserTurnTranscript(params);
	} catch (error) {
		return retainUncertainInputMedia(recorder, error);
	}
}
//#endregion
//#region src/sessions/user-turn-transcript-processing.ts
/** Adapt the released synchronous callback only when no async companion is provided. */
async function completeUserTurnProcessing(recorder, outcome) {
	if (recorder?.completeProcessingAsync) return await recorder.completeProcessingAsync(outcome);
	if (recorder?.completeProcessing) {
		warnPluginSdkDeprecation({
			family: "session-input-completion",
			method: "UserTurnTranscriptRecorder.completeProcessing",
			replacement: "completeProcessingAsync"
		});
		return recorder.completeProcessing(outcome);
	}
}
/** The recorder owns one completion attempt, including its failure and native settlement. */
function createUserTurnProcessingCompletion(readPendingInput, sources) {
	let processingCompletion;
	let processingCompletionPromise;
	return {
		withPendingInputCurrent: async (run) => {
			const pendingInput = readPendingInput();
			return await (pendingInput?.runAsync ? pendingInput.runAsync(run) : pendingInput ? pendingInput.run(run) : run());
		},
		assertPendingInputLifetimeCurrent: () => {
			const pendingInput = readPendingInput();
			if (pendingInput?.assertLifetimeCurrent) pendingInput.assertLifetimeCurrent();
			else pendingInput?.run(() => {});
		},
		getProcessingCompletion: () => processingCompletion?.ok ? processingCompletion.value : readPendingInput()?.completion,
		completeProcessing: (outcome) => {
			warnPluginSdkDeprecation({
				family: "session-input-completion",
				method: "UserTurnTranscriptRecorder.completeProcessing",
				replacement: "completeProcessingAsync"
			});
			const pendingInput = readPendingInput();
			if (!pendingInput?.complete) return;
			if (!processingCompletion) {
				if (processingCompletionPromise) throw new Error("Input completion is pending; await completeProcessingAsync");
				try {
					processingCompletion = {
						ok: true,
						value: pendingInput.complete(outcome)
					};
				} catch (error) {
					processingCompletion = {
						ok: false,
						error
					};
				}
			}
			if (!processingCompletion.ok) throw processingCompletion.error;
			return processingCompletion.value;
		},
		completeProcessingAsync: (outcome) => {
			const pendingInput = readPendingInput();
			if (processingCompletionPromise) return processingCompletionPromise;
			processingCompletionPromise = (async () => {
				if (processingCompletion) {
					if (!processingCompletion.ok) throw processingCompletion.error;
					return processingCompletion.value;
				}
				if (!pendingInput?.completeAsync) return;
				try {
					const value = await pendingInput.completeAsync(outcome);
					processingCompletion = {
						ok: true,
						value
					};
					return value;
				} catch (error) {
					processingCompletion = {
						ok: false,
						error
					};
					throw error;
				}
			})();
			return processingCompletionPromise;
		},
		waitForPendingInputSettlement: async () => {
			const settled = await Promise.allSettled([
				processingCompletionPromise,
				readPendingInput()?.settled?.(),
				...(sources ?? []).map((source) => source.waitForPendingInputSettlement?.())
			]);
			const failures = [...new Set(settled.flatMap((result) => result.status === "rejected" ? [result.reason] : []))];
			if (failures.length === 1) throw failures[0];
			if (failures.length) throw new AggregateError(failures, "Failed to settle pending input custody");
		}
	};
}
//#endregion
//#region src/sessions/user-turn-transcript-updates.ts
async function confirmPersistedSteerTargetRunId(params) {
	const rewritten = await rewritePreparedTranscriptMessageAtAnchor(params.admission, (message) => {
		if (!isUserMessage(message)) return;
		return normalizePersistedSteerTargetRunId(message["__openclaw"]?.steerTargetRunId) === params.targetRunId ? void 0 : rewritePersistedSteerTargetRunId(message, params.targetRunId);
	});
	if (!rewritten) return;
	const admission = {
		...params.admission,
		generation: rewritten.generation
	};
	await publishTranscriptUpdate(admission, {
		message: rewritten.message,
		messageId: admission.entryId,
		messageSeq: admission.activeMessagePosition + 1
	});
	return {
		admission,
		message: rewritten.message
	};
}
async function capturePersistedModelPromptProjection(params) {
	params.assertCurrent();
	const text = params.text;
	const requireMatchingProjection = (candidate) => {
		const existing = readModelPromptProjection(candidate);
		if (existing !== void 0 && existing !== text) throw new Error("A captured user-turn model prompt projection cannot be changed");
		return existing !== void 0;
	};
	if (requireMatchingProjection(params.message)) return params.message;
	params.assertWritable();
	let captured;
	const rewritten = await rewritePreparedTranscriptMessageAtAnchor(params.admission, (candidate) => {
		if (!isUserMessage(candidate)) throw new Error("Model prompt projection lost its canonical user turn");
		if (requireMatchingProjection(candidate)) {
			captured = candidate;
			return;
		}
		return {
			...candidate,
			__openclaw: {
				...candidate["__openclaw"],
				modelPromptProjection: {
					version: 1,
					text
				}
			}
		};
	}, {
		active: "sequence",
		assertCurrent: params.assertWritable
	});
	params.assertCurrent();
	if (!rewritten) {
		if (!captured) throw new Error("Model prompt projection lost its canonical user turn");
		params.onCommitted(params.admission, captured);
		return captured;
	}
	const admission = {
		...params.admission,
		generation: rewritten.generation
	};
	params.onCommitted(admission, rewritten.message);
	await publishTranscriptUpdate(admission, {
		message: rewritten.message,
		messageId: admission.entryId,
		messageSeq: admission.activeMessagePosition + 1
	});
	params.assertCurrent();
	return rewritten.message;
}
//#endregion
//#region src/sessions/user-turn-transcript.ts
const originalInputCommitNotifiers = /* @__PURE__ */ new WeakMap();
async function resolveUserTurnTranscriptTarget(target) {
	return typeof target === "function" ? await target() : target;
}
function createUserTurnTranscriptRecorder(params) {
	const logicalTurnId = randomUUID();
	let message = resolvePersistedUserTurnMessage(params);
	let blocked = false;
	let runtimePersisted = false;
	let persistedResult;
	let committedInput;
	let resolvedPersistenceTarget;
	let admissionReceipt;
	let admittedMessage;
	let runtimePersistencePromise;
	let selfPersistencePromise;
	let resolvedMessagePromise;
	let persistedMessageNotified = false;
	let originalInputCommitted = false;
	let resolvedSourceMessage;
	let runtimePersistedMessage;
	let sentToProvider = false;
	let admissionHandler;
	let admissionWrite;
	let replacementText;
	let confirmedSteerTargetRunId;
	let pendingInput;
	const processing = createUserTurnProcessingCompletion(() => pendingInput, params.pendingInputSources);
	let staging;
	const applyReplacementText = (candidate) => {
		if (!candidate || replacementText === void 0) return candidate;
		const metadata = { ...candidate["__openclaw"] };
		if (candidate.content !== replacementText) {
			delete metadata.humanMentions;
			delete metadata.workContext;
		}
		const next = {
			...candidate,
			content: replacementText
		};
		delete next["__openclaw"];
		return Object.keys(metadata).length > 0 ? {
			...next,
			__openclaw: metadata
		} : next;
	};
	const applyMessageOverrides = (candidate) => {
		const next = rewritePersistedSteerTargetRunId(applyReplacementText(candidate), confirmedSteerTargetRunId);
		return next && !next.idempotencyKey ? {
			...next,
			idempotencyKey: buildRunUserTurnIdempotencyKey(logicalTurnId)
		} : next;
	};
	const handlePersistenceError = (error) => {
		if (params.onPersistenceError) {
			try {
				params.onPersistenceError(error);
			} catch {}
			return;
		}
		import("./globals-Dy1GBxq1.mjs").then(({ logVerbose }) => {
			logVerbose(`failed to persist ${params.errorContext ?? "user turn transcript"}: ${String(error)}`);
		}).catch(() => void 0);
	};
	const resolveMessageForPersistence = async () => {
		if (!params.message && params.resolveInput && !resolvedMessagePromise) resolvedMessagePromise = (async () => {
			try {
				const resolvedInput = await params.resolveInput?.();
				const resolvedMessage = resolvePersistedUserTurnMessage({
					message: params.message,
					input: resolvedInput ?? params.input
				}) ?? message;
				return applyMessageOverrides(resolvedMessage);
			} catch (error) {
				handlePersistenceError(error);
				return applyMessageOverrides(message);
			}
		})();
		const resolved = await (params.message || !params.resolveInput ? applyMessageOverrides(message) : resolvedMessagePromise);
		resolvedSourceMessage = params.pendingInputSources && resolved ? structuredClone(resolved) : resolved;
		if (!pendingInput && resolved && params.pendingInputSources) {
			const sources = params.pendingInputSources.flatMap((source) => getUserTurnTranscriptAdmissionOwner(source)?.pendingInput() ?? []);
			if (sources.length > 0 && sources.length !== params.pendingInputSources.length) throw new Error("Collected input cannot mix staged and unstaged source approval");
			pendingInput = bindSessionPendingInputSources(sources, resolved);
			if (pendingInput) {
				message = pendingInput.message;
				resolvedMessagePromise = Promise.resolve(message);
			}
		}
		return pendingInput?.message ?? resolved;
	};
	const notifyMessagePersisted = (persistedMessage) => {
		const notificationMessage = persistedMessage ?? persistedResult?.message ?? message;
		if (!notificationMessage || persistedMessageNotified || !params.onMessagePersisted) return;
		persistedMessageNotified = true;
		try {
			Promise.resolve(params.onMessagePersisted(notificationMessage)).catch(handlePersistenceError);
		} catch (error) {
			handlePersistenceError(error);
		}
	};
	const notifyOriginalInputCommitted = (commit) => {
		const sourceMessage = commit.message;
		const metadata = sourceMessage["__openclaw"];
		if (originalInputCommitted || blocked || sourceMessage.display === false || sourceMessage.excludeFromContext === true || sourceMessage.provenance && sourceMessage.provenance.kind !== "external_user" || metadata?.lateMedia === true || metadata?.beforeAgentRunBlocked !== void 0) return;
		originalInputCommitted = true;
		if (params.pendingInputSources && metadata?.humanMentions?.length && isDeepStrictEqual(sourceMessage.content, (pendingInput?.message ?? resolvedSourceMessage ?? message)?.content)) for (const source of params.pendingInputSources) originalInputCommitNotifiers.get(source)?.(commit.anchor);
		try {
			Promise.resolve(params.onOriginalInputCommitted?.(commit)).catch(handlePersistenceError);
		} catch (error) {
			handlePersistenceError(error);
		}
	};
	const recordAdmission = (receipt, persistedMessage, detached = false) => {
		if (admissionReceipt) return admissionWrite ?? Promise.resolve();
		const admission = "logicalTurnId" in receipt ? receipt : {
			...receipt,
			logicalTurnId,
			role: "user"
		};
		admissionReceipt = admission;
		admittedMessage = persistedMessage;
		const run = async () => {
			await admissionHandler?.(admission);
		};
		admissionWrite = detached ? runInDetachedAsyncContext(run) : run();
		admissionWrite.catch(() => void 0);
		return admissionWrite;
	};
	const refreshAdmission = (admission, persistedMessage) => {
		admissionReceipt = admission;
		admittedMessage = persistedMessage;
		runtimePersistedMessage = persistedMessage;
		if (persistedResult) persistedResult = {
			...persistedResult,
			admission,
			message: persistedMessage
		};
	};
	const waitForRuntimePersistence = async () => {
		if (runtimePersistencePromise) try {
			await runtimePersistencePromise;
		} catch (error) {
			handlePersistenceError(error);
		}
		await admissionWrite;
	};
	let inputActorBinding;
	const persistPreparedWithoutActor = async (options) => {
		const storageTarget = options.storageTarget ? { ...options.storageTarget } : void 0;
		if (options.skipWhenBlocked && blocked) return;
		if (!options.message && !message && !params.resolveInput) return;
		if (options.waitForRuntime) await waitForRuntimePersistence();
		if (selfPersistencePromise) {
			const existingPromise = selfPersistencePromise;
			const existingResult = await existingPromise;
			if (existingResult || !options.retryIfUnpersisted) return persistedResult ?? existingResult;
			if (selfPersistencePromise !== existingPromise) return await selfPersistencePromise;
			selfPersistencePromise = void 0;
		}
		if (!options.message && persistedResult) return persistedResult;
		const persistencePromise = (async () => {
			if (!options.message && committedInput && resolvedPersistenceTarget) {
				const result = await resolveCommittedUserTurnTranscript(committedInput, {
					...resolvedPersistenceTarget,
					logicalTurnId
				});
				if (result) {
					persistedResult = result;
					await recordAdmission(result.admission, result.message);
					if (result.appended) notifyOriginalInputCommitted({
						message: result.message,
						anchor: result.admission
					});
				}
				return result;
			}
			const resolvedMessage = options.message ?? await resolveMessageForPersistence();
			if (!resolvedMessage) return;
			const target = await resolveUserTurnTranscriptTarget(options.target ?? params.target);
			if (!target) return;
			if (storageTarget && (storageTarget.agentId !== target.agentId || storageTarget.sessionKey !== target.sessionKey || storageTarget.sessionId !== target.sessionId)) throw new Error("User turn transcript identity changed before its admitted storage write");
			const resolvedTarget = {
				...target,
				...storageTarget ? { storePath: storageTarget.storePath } : {},
				...options.cwd ? { cwd: options.cwd } : {}
			};
			resolvedPersistenceTarget = resolvedTarget;
			const updateMode = options.updateMode ?? params.updateMode ?? "inline";
			const persistMessage = async (candidate, candidateUpdateMode) => {
				const assertOriginalInput = candidate.idempotencyKey === message?.idempotencyKey ? recorder.assertOriginalInputCommit : void 0;
				const persist = () => persistUserTurnInput(recorder, {
					...resolvedTarget,
					logicalTurnId,
					message: candidate,
					sessionTurnMutation: params.sessionTurnMutation,
					expectedSessionId: options.expectedSessionId || resolvedTarget.expectedSessionId,
					sessionLifecyclePatch: options.sessionLifecyclePatch ?? params.sessionLifecyclePatch,
					expectedSessionState: options.expectedSessionState ?? params.expectedSessionState,
					updateMode: candidateUpdateMode,
					beforeMessageWrite: params.beforeMessageWrite ?? resolvedTarget.beforeMessageWrite,
					beforeFreshMessageCommit: options.beforeFreshMessageCommit ? composeSessionSourceAssertion([options.beforeFreshMessageCommit, assertOriginalInput]) : assertOriginalInput,
					onOriginalInputCommitted: notifyOriginalInputCommitted,
					onCommitted: (committed, acceptCompletion) => {
						committedInput = committed;
						admittedMessage = committed.message;
						const result = admittedUserTurnResult(committed, logicalTurnId, resolvedTarget.sessionKey);
						if (result) {
							persistedResult = result;
							acceptCompletion(() => recordAdmission(result.admission, result.message));
						}
						notifyMessagePersisted(committed.message);
					}
				});
				if (pendingInput?.state === "queued" && pendingInput.runAsync) return await pendingInput.runAsync(persist);
				return await (pendingInput ? withSessionPendingInputPersistence(pendingInput, persist) : persist());
			};
			const lateMediaMessage = sentToProvider || runtimePersisted || persistedResult ? buildLateResolvedMediaMessage({
				admittedMessage: admittedMessage ?? runtimePersistedMessage ?? persistedResult?.message ?? message,
				resolvedMessage
			}) : void 0;
			if (lateMediaMessage) {
				if (!runtimePersisted && !persistedResult && message) {
					const admittedResult = await persistMessage(message, updateMode);
					if (admittedResult) {
						persistedResult = admittedResult;
						await recordAdmission(admittedResult.admission, admittedResult.message);
						notifyMessagePersisted(admittedResult.message);
					}
				}
				const appendedMedia = await persistMessage(lateMediaMessage, "none");
				if (appendedMedia) persistedResult = appendedMedia;
				return appendedMedia;
			}
			if (runtimePersisted) return;
			if (persistedResult) return persistedResult;
			const result = await persistMessage(resolvedMessage, updateMode);
			if (result) {
				persistedResult = result;
				await recordAdmission(result.admission, result.message);
				notifyMessagePersisted(result.message);
			}
			return result;
		})();
		selfPersistencePromise = persistencePromise;
		try {
			const result = await persistencePromise;
			if (!result && options.retryIfUnpersisted && selfPersistencePromise === persistencePromise) selfPersistencePromise = void 0;
			return result;
		} catch (error) {
			if ((committedInput || pendingInput) && selfPersistencePromise === persistencePromise) selfPersistencePromise = void 0;
			handlePersistenceError(error);
			throw error;
		}
	};
	const persistPrepared = (options) => withSessionInputActor(inputActorBinding, () => persistPreparedWithoutActor(options));
	const recorder = {
		get message() {
			return message;
		},
		resolveMessage: async () => recorder.getPersistedMessage?.() ?? await resolveMessageForPersistence(),
		assertOriginalInputCommit: params.assertOriginalInputCommit ? createDynamicSessionSourceAssertion(() => !blocked && !persistedResult && !runtimePersisted && !pendingInput ? params.assertOriginalInputCommit : void 0, () => {
			throw new Error("Original input custody changed before transcript commit");
		}) : void 0,
		stageApproved: (options) => withSessionInputActor(inputActorBinding, () => {
			staging ??= (async () => {
				const candidate = await resolveMessageForPersistence();
				const target = await resolveUserTurnTranscriptTarget(params.target);
				if (!candidate || !target || persistedResult || runtimePersisted) return false;
				pendingInput = await stageUserTurnPendingInput(recorder, target, {
					...options,
					requestFingerprint: params.pendingInputRequestFingerprint,
					trackCompletion: params.trackInputCompletion,
					replaySourceSessionKeys: params.pendingInputReplaySourceSessionKeys,
					message: candidate,
					onCommitted: (receipt) => {
						pendingInput = receipt;
						message = receipt.message;
						resolvedMessagePromise = Promise.resolve(message);
					},
					prepareMessageAfterIdempotencyCheck: (next) => preparePersistedUserTurnMessageForTranscriptWrite(next, {
						...target,
						beforeMessageWrite: params.beforeMessageWrite ?? target.beforeMessageWrite
					})
				});
				if (!pendingInput) return false;
				message = pendingInput.message;
				resolvedMessagePromise = Promise.resolve(message);
				return pendingInput.state !== "consumed";
			})();
			return staging;
		}),
		getPendingInputMessage: () => pendingInput?.message,
		...processing,
		isPendingInputConsumed: () => pendingInput?.state === "consumed",
		withPendingInput: (run) => pendingInput ? pendingInput.run(run) : run(),
		finishPendingInput: (disposition) => {
			if (pendingInput) pendingInput.finish(disposition);
			else for (const source of params.pendingInputSources ?? []) source.finishPendingInput?.(disposition);
		},
		replaceTextBeforePersistence: (text) => {
			if (pendingInput || persistedResult || runtimePersisted || sentToProvider) return;
			replacementText = text;
			message = applyMessageOverrides(message);
			resolvedMessagePromise = void 0;
		},
		confirmSteerTargetRunIdForPersistence: async (targetRunId) => {
			const normalizedTargetRunId = normalizePersistedSteerTargetRunId(targetRunId);
			if (!normalizedTargetRunId || confirmedSteerTargetRunId === normalizedTargetRunId) return;
			confirmedSteerTargetRunId = normalizedTargetRunId;
			message = applyMessageOverrides(message);
			resolvedMessagePromise = void 0;
			const pendingSelfPersistence = selfPersistencePromise;
			await waitForRuntimePersistence();
			await pendingSelfPersistence?.catch(() => void 0);
			if (!admissionReceipt) return;
			try {
				const confirmed = await confirmPersistedSteerTargetRunId({
					admission: admissionReceipt,
					targetRunId: normalizedTargetRunId
				});
				if (!confirmed) return;
				refreshAdmission(confirmed.admission, confirmed.message);
			} catch (error) {
				handlePersistenceError(error);
			}
		},
		getPersistedMessage: () => admittedMessage ?? runtimePersistedMessage ?? persistedResult?.message,
		captureModelPromptProjection: async (text, assertCurrent) => {
			assertCurrent();
			await waitForRuntimePersistence();
			assertCurrent();
			if (!admissionReceipt && selfPersistencePromise) {
				await selfPersistencePromise;
				assertCurrent();
			}
			resolvedPersistenceTarget ??= await resolveUserTurnTranscriptTarget(params.target);
			assertCurrent();
			const admission = admissionReceipt;
			if (blocked || !admission || !admittedMessage) throw new Error("Model prompt projection requires a live, persisted user turn");
			return await capturePersistedModelPromptProjection({
				admission,
				message: admittedMessage,
				text,
				assertCurrent,
				assertWritable: () => {
					assertCurrent();
					if (blocked || sentToProvider) throw new Error("Model prompt projection must be captured before provider dispatch");
				},
				onCommitted: refreshAdmission
			});
		},
		getAdmissionReceipt: () => admissionReceipt,
		setAdmissionHandler: (handler) => {
			admissionHandler = handler;
		},
		markSentToProvider: () => {
			sentToProvider = true;
		},
		markRuntimePersistencePending: (pending) => {
			runtimePersistencePromise = pending;
		},
		markRuntimePersisted: (persistedMessage, receipt, persistence) => {
			runtimePersistedMessage = persistedMessage;
			runtimePersisted = true;
			if (persistedMessage && receipt) {
				if (persistence?.appended === true) notifyOriginalInputCommitted({
					message: persistedMessage,
					anchor: receipt
				});
				recordAdmission(receipt, persistedMessage, true);
			}
			if (persistedMessage && persistedResult) persistedResult = {
				...persistedResult,
				message: persistedMessage
			};
			notifyMessagePersisted(persistedMessage);
		},
		markBlocked: () => {
			blocked = true;
		},
		hasPersisted: () => committedInput !== void 0 || persistedResult !== void 0 || runtimePersisted,
		isBlocked: () => blocked,
		hasRuntimePersistencePending: () => runtimePersistencePromise !== void 0 || admissionWrite !== void 0,
		waitForRuntimePersistence,
		persistApproved: async (options) => await persistPrepared({
			waitForRuntime: false,
			skipWhenBlocked: true,
			target: options?.target,
			storageTarget: options?.storageTarget,
			updateMode: options?.updateMode,
			cwd: options?.cwd,
			expectedSessionId: options?.expectedSessionId,
			expectedSessionState: options?.expectedSessionState,
			sessionLifecyclePatch: options?.sessionLifecyclePatch,
			beforeFreshMessageCommit: options?.beforeFreshMessageCommit,
			retryIfUnpersisted: options?.retryIfUnpersisted
		}),
		persistBlocked: async (blockedMessage, options) => {
			blocked = true;
			return await persistPrepared({
				waitForRuntime: false,
				skipWhenBlocked: false,
				message: blockedMessage,
				target: options?.target,
				storageTarget: options?.storageTarget,
				updateMode: options?.updateMode,
				cwd: options?.cwd
			});
		},
		persistFallback: async (options) => await persistPrepared({
			waitForRuntime: true,
			skipWhenBlocked: true,
			target: options?.target,
			storageTarget: options?.storageTarget,
			updateMode: options?.updateMode,
			cwd: options?.cwd
		})
	};
	originalInputCommitNotifiers.set(recorder, (anchor) => {
		const sourceMessage = pendingInput?.message ?? resolvedSourceMessage ?? message;
		if (sourceMessage) notifyOriginalInputCommitted({
			message: sourceMessage,
			anchor
		});
	});
	registerUserTurnInputActor(recorder, (binding) => {
		inputActorBinding = binding;
	});
	registerUserTurnTranscriptAdmissionOwner(recorder, {
		pendingInput: () => pendingInput,
		withdrawnInputId: () => readWithdrawnSessionPendingInputId(pendingInput),
		receipt: () => admissionReceipt,
		message: () => admittedMessage,
		blocked: () => blocked || confirmedSteerTargetRunId !== void 0,
		sentToProvider: () => sentToProvider,
		refresh: refreshAdmission
	});
	inheritUserTurnPromptReactionSource(recorder, params.pendingInputSources);
	return recorder;
}
//#endregion
export { completeUserTurnProcessing as n, retainsUserTurnTranscriptMedia as r, createUserTurnTranscriptRecorder as t };
