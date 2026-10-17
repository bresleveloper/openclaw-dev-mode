import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-m7NE2aEm.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-DP2BCaGd.mjs";
import { d as resolveUserTurnTranscriptAdmission, u as registerUserTurnTranscriptAdmissionOwner } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { p as publishTranscriptUpdate } from "./session-history-eviction-D6jaTF6N.mjs";
import { v as redactTranscriptText } from "./session-accessor.sqlite-transcript-store-Bqsq62BI.mjs";
import { a as normalizePersistedSteerTargetRunId, c as rewritePersistedSteerTargetRunId, i as buildRunUserTurnIdempotencyKey, o as preparePersistedUserTurnMessageForTranscriptWrite } from "./user-turn-transcript.metadata-CNurmdgT.mjs";
import { M as stageSessionPendingInput, N as withSessionPendingInputPersistence, k as bindSessionPendingInputSources, o as persistSessionTranscriptTurn, u as rewriteTranscriptMessageAtAnchor } from "./session-accessor-CQ-g9yb2.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-eRtZH9vP.mjs";
import { a as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-CAOPCw68.mjs";
import { a as isUserMessage, c as readModelPromptProjection, l as resolvePersistedUserTurnMessage, n as buildLateResolvedMediaMessage } from "./user-turn-transcript.message-D6tiOY3Z.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/sessions/user-turn-transcript-admission-write.ts
/**
* Tracks the durable write a recorder's admission handler starts, so persistence
* and runtime waits settle it instead of leaving it running beside the turn.
*/
function createUserTurnAdmissionWrite() {
	let handler;
	let write;
	return {
		setHandler(next) {
			handler = next;
		},
		/**
		* An unawaited write reported from inside a session write lane is started
		* detached, so it queues behind that lane instead of reentering it.
		*/
		start(admission, detached) {
			const run = async () => {
				await handler?.(admission);
			};
			const started = detached ? runInDetachedAsyncContext(run) : run();
			started.catch(() => void 0);
			write = started;
			return started;
		},
		get pending() {
			return write;
		}
	};
}
//#endregion
//#region src/sessions/user-turn-transcript-processing.ts
/** Adapt the released synchronous callback only when no async companion is provided. */
async function completeUserTurnProcessing(recorder, outcome) {
	return recorder?.completeProcessingAsync ? await recorder.completeProcessingAsync(outcome) : recorder?.completeProcessing?.(outcome);
}
/** The recorder owns one completion attempt, including its failure and native settlement. */
function createUserTurnProcessingCompletion(readPendingInput, sources) {
	let processingCompletion;
	let processingCompletionPromise;
	return {
		getProcessingCompletion: () => processingCompletion?.ok ? processingCompletion.value : readPendingInput()?.completion,
		completeProcessing: (outcome) => {
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
	const rewritten = await rewriteTranscriptMessageAtAnchor(params.admission, (message) => {
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
	const text = redactTranscriptText(params.text, params.config);
	const projected = (candidate) => ({
		...candidate,
		__openclaw: {
			...candidate["__openclaw"],
			modelPromptProjection: {
				version: 1,
				text
			}
		}
	});
	if (params.requestLocal) return projected(params.message);
	const requireMatchingProjection = (candidate) => {
		const existing = readModelPromptProjection(candidate);
		if (existing !== void 0 && existing !== text) throw new Error("A captured user-turn model prompt projection cannot be changed");
		return existing !== void 0;
	};
	if (requireMatchingProjection(params.message)) return params.message;
	params.assertWritable();
	let captured;
	const rewritten = await rewriteTranscriptMessageAtAnchor(params.admission, (candidate) => {
		params.assertWritable();
		if (readActiveTranscriptEntryAnchor(params.admission)?.rawSeq !== params.admission.rawSeq) throw new SessionTranscriptWriterClaimReboundError();
		if (!isUserMessage(candidate)) throw new Error("Model prompt projection lost its canonical user turn");
		if (requireMatchingProjection(candidate)) {
			captured = candidate;
			return;
		}
		return projected(candidate);
	});
	params.assertCurrent();
	if (!rewritten) {
		if (!captured) throw new SessionTranscriptWriterClaimReboundError();
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
const pendingInputReceipts = /* @__PURE__ */ new WeakMap();
const originalInputCommitNotifiers = /* @__PURE__ */ new WeakMap();
async function persistUserTurnTranscript(params) {
	const message = resolvePersistedUserTurnMessage(params);
	if (!message) return;
	let committedWithoutAnchor = false;
	const turn = await persistSessionTranscriptTurn({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry,
		...params.sessionStore ? { sessionStore: params.sessionStore } : {},
		...params.storePath ? { storePath: params.storePath } : {},
		agentId: params.agentId,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {}
	}, {
		...params.cwd ? { cwd: params.cwd } : {},
		...params.config ? { config: params.config } : {},
		...params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {},
		...params.initialSessionEntry ? { initialSessionEntry: params.initialSessionEntry } : {},
		...params.expectedSessionState ? { expectedSessionState: params.expectedSessionState } : {},
		...params.sessionLifecyclePatch ? { sessionLifecyclePatch: params.sessionLifecyclePatch } : {},
		...params.sessionTurnMutation ? { sessionTurnMutation: params.sessionTurnMutation } : {},
		updateMode: params.updateMode ?? "inline",
		onMessageCommitted: (result) => {
			if (!result.appended || !isUserMessage(result.message)) return;
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
	let appended = {
		...result,
		message: result.message
	};
	if (!appended.anchor) {
		await waitForSessionTranscriptProjection(params);
		const anchor = readActiveTranscriptEntryAnchor({
			...params,
			entryId: appended.messageId
		});
		appended = anchor ? {
			...appended,
			anchor
		} : appended;
	}
	if (!appended.anchor || appended.message.role !== "user") return;
	if (committedWithoutAnchor && appended.appended) params.onOriginalInputCommitted?.({
		message: appended.message,
		anchor: appended.anchor
	});
	return {
		...appended,
		admission: {
			...appended.anchor,
			logicalTurnId: params.logicalTurnId ?? randomUUID(),
			role: "user"
		},
		sessionEntry: turn.sessionEntry,
		...turn.sessionTurnMutationResult ? { sessionTurnMutationResult: turn.sessionTurnMutationResult } : {},
		sessionFile: params.sessionKey
	};
}
async function resolveUserTurnTranscriptTarget(target) {
	return typeof target === "function" ? await target() : target;
}
function createUserTurnTranscriptRecorder(params) {
	const logicalTurnId = randomUUID();
	let message = resolvePersistedUserTurnMessage(params);
	let blocked = false;
	let persisted = false;
	let runtimePersisted = false;
	let persistedResult;
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
	const admissionWrite = createUserTurnAdmissionWrite();
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
		import("./globals-C0jeYe3t.mjs").then(({ logVerbose }) => {
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
			const sources = params.pendingInputSources.flatMap((source) => pendingInputReceipts.get(source)?.() ?? []);
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
		if (admissionReceipt) return admissionWrite.pending ?? Promise.resolve();
		admissionReceipt = resolveUserTurnTranscriptAdmission({
			logicalTurnId,
			receipt
		});
		admittedMessage = persistedMessage;
		return admissionWrite.start(admissionReceipt, detached);
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
		await admissionWrite.pending;
	};
	const persistPrepared = async (options) => {
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
		const persistencePromise = (async () => {
			const resolvedMessage = options.message ?? await resolveMessageForPersistence();
			if (!resolvedMessage) return;
			const target = await resolveUserTurnTranscriptTarget(options.target ?? params.target);
			if (!target) return;
			const resolvedTarget = options.cwd ? {
				...target,
				cwd: options.cwd
			} : target;
			resolvedPersistenceTarget = resolvedTarget;
			const updateMode = options.updateMode ?? params.updateMode ?? "inline";
			const persistMessage = async (candidate, candidateUpdateMode) => {
				const persist = () => persistUserTurnTranscript({
					...resolvedTarget,
					logicalTurnId,
					message: candidate,
					sessionTurnMutation: params.sessionTurnMutation,
					expectedSessionId: options.expectedSessionId || resolvedTarget.expectedSessionId,
					sessionLifecyclePatch: options.sessionLifecyclePatch ?? params.sessionLifecyclePatch,
					expectedSessionState: options.expectedSessionState ?? params.expectedSessionState,
					updateMode: candidateUpdateMode,
					beforeMessageWrite: params.beforeMessageWrite ?? resolvedTarget.beforeMessageWrite,
					beforeFreshMessageCommit: candidate.idempotencyKey === message?.idempotencyKey ? recorder.assertOriginalInputCommit : void 0,
					onOriginalInputCommitted: notifyOriginalInputCommitted
				});
				return await (pendingInput ? withSessionPendingInputPersistence(pendingInput, persist) : persist());
			};
			const lateMediaMessage = sentToProvider || runtimePersisted || persisted ? buildLateResolvedMediaMessage({
				admittedMessage: admittedMessage ?? runtimePersistedMessage ?? persistedResult?.message ?? message,
				resolvedMessage
			}) : void 0;
			if (lateMediaMessage) {
				if (!runtimePersisted && !persisted && message) {
					const admittedResult = await persistMessage(message, updateMode);
					if (admittedResult) {
						persisted = true;
						persistedResult = admittedResult;
						await recordAdmission(admittedResult.admission, admittedResult.message);
						notifyMessagePersisted(admittedResult.message);
					}
				}
				const appendedMedia = await persistMessage(lateMediaMessage, "none");
				if (appendedMedia) {
					persisted = true;
					persistedResult = appendedMedia;
				}
				return appendedMedia;
			}
			if (runtimePersisted) return;
			if (persisted) return persistedResult;
			const result = await persistMessage(resolvedMessage, updateMode);
			if (result) {
				persisted = true;
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
			if (pendingInput && selfPersistencePromise === persistencePromise) selfPersistencePromise = void 0;
			handlePersistenceError(error);
			throw error;
		}
	};
	const recorder = {
		get message() {
			return message;
		},
		resolveMessage: resolveMessageForPersistence,
		assertOriginalInputCommit: params.assertOriginalInputCommit ? () => {
			if (!blocked && !persisted && !runtimePersisted && !pendingInput) params.assertOriginalInputCommit();
		} : void 0,
		stageApproved: (options) => {
			staging ??= (async () => {
				const candidate = await resolveMessageForPersistence();
				const target = await resolveUserTurnTranscriptTarget(params.target);
				if (!candidate || !target || persisted || runtimePersisted) return false;
				const config = target.config;
				const runtimeTarget = await resolveSessionTranscriptRuntimeTarget(target, config);
				pendingInput = await stageSessionPendingInput({
					...target,
					...runtimeTarget
				}, {
					...options,
					requestFingerprint: params.pendingInputRequestFingerprint,
					trackCompletion: params.trackInputCompletion,
					replaySourceSessionKeys: params.pendingInputReplaySourceSessionKeys,
					message: candidate,
					config,
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
		},
		getPendingInputMessage: () => pendingInput?.message,
		...processing,
		isPendingInputConsumed: () => pendingInput?.state === "consumed",
		withPendingInput: (run) => pendingInput ? pendingInput.run(run) : run(),
		finishPendingInput: (disposition) => {
			if (pendingInput) pendingInput.finish(disposition);
			else for (const source of params.pendingInputSources ?? []) source.finishPendingInput?.(disposition);
		},
		replaceTextBeforePersistence: (text) => {
			if (pendingInput || persisted || runtimePersisted || sentToProvider) return;
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
		captureModelPromptProjection: async (text, assertCurrent, options) => {
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
				requestLocal: options?.requestLocal,
				config: resolvedPersistenceTarget?.config,
				assertCurrent,
				assertWritable: () => {
					assertCurrent();
					if (blocked || sentToProvider) throw new Error("Model prompt projection must be captured before provider dispatch");
				},
				onCommitted: refreshAdmission
			});
		},
		getAdmissionReceipt: () => admissionReceipt,
		setAdmissionHandler: (handler) => admissionWrite.setHandler(handler),
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
		hasPersisted: () => persisted || runtimePersisted,
		isBlocked: () => blocked,
		hasRuntimePersistencePending: () => runtimePersistencePromise !== void 0 || admissionWrite.pending !== void 0,
		waitForRuntimePersistence,
		persistApproved: async (options) => await persistPrepared({
			waitForRuntime: false,
			skipWhenBlocked: true,
			target: options?.target,
			updateMode: options?.updateMode,
			cwd: options?.cwd,
			expectedSessionId: options?.expectedSessionId,
			expectedSessionState: options?.expectedSessionState,
			sessionLifecyclePatch: options?.sessionLifecyclePatch,
			retryIfUnpersisted: options?.retryIfUnpersisted
		}),
		persistBlocked: async (blockedMessage, options) => {
			blocked = true;
			return await persistPrepared({
				waitForRuntime: false,
				skipWhenBlocked: false,
				message: blockedMessage,
				target: options?.target,
				updateMode: options?.updateMode,
				cwd: options?.cwd
			});
		},
		persistFallback: async (options) => await persistPrepared({
			waitForRuntime: true,
			skipWhenBlocked: true,
			target: options?.target,
			updateMode: options?.updateMode,
			cwd: options?.cwd
		})
	};
	pendingInputReceipts.set(recorder, () => pendingInput);
	originalInputCommitNotifiers.set(recorder, (anchor) => {
		const sourceMessage = pendingInput?.message ?? resolvedSourceMessage ?? message;
		if (sourceMessage) notifyOriginalInputCommitted({
			message: sourceMessage,
			anchor
		});
	});
	registerUserTurnTranscriptAdmissionOwner(recorder, {
		receipt: () => admissionReceipt,
		message: () => admittedMessage,
		blocked: () => blocked || confirmedSteerTargetRunId !== void 0,
		sentToProvider: () => sentToProvider,
		refresh: refreshAdmission
	});
	return recorder;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.userTurnTranscriptTestApi")] = { persistUserTurnTranscript };
//#endregion
export { completeUserTurnProcessing as n, createUserTurnTranscriptRecorder as t };
