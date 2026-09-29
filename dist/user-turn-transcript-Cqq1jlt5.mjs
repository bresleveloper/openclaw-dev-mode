import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { d as resolveUserTurnTranscriptAdmission, u as registerUserTurnTranscriptAdmissionOwner } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-B0dOIy5w.mjs";
import { g as publishTranscriptUpdate } from "./session-accessor.sqlite-lifecycle-state-DdmXgBkg.mjs";
import { D as rewriteTranscriptMessageAtAnchor, Y as bindSessionPendingInputSources, nt as withSessionPendingInputPersistence, p as persistSessionTranscriptTurn, tt as stageSessionPendingInput } from "./session-accessor-l-4ZHvKn.mjs";
import { i as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-w5-iuMeM.mjs";
import { a as normalizePersistedSteerTargetRunId, c as rewritePersistedSteerTargetRunId, i as buildRunUserTurnIdempotencyKey, o as preparePersistedUserTurnMessageForTranscriptWrite } from "./user-turn-transcript.metadata-BY4PdwgQ.mjs";
import { a as isUserMessage, n as buildLateResolvedMediaMessage, s as resolvePersistedUserTurnMessage } from "./user-turn-transcript.message-DpTCMkgY.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
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
			prepareMessageAfterIdempotencyCheck: (candidate) => preparePersistedUserTurnMessageForTranscriptWrite(candidate, params)
		}]
	});
	let appended = turn.messages[0];
	if (appended && !appended.anchor && appended.message.role === "user") {
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
	if (!appended?.anchor || appended.message.role !== "user") return;
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
function createUserTurnTranscriptRecorder(params) {
	const logicalTurnId = randomUUID();
	let message = resolvePersistedUserTurnMessage(params);
	let blocked = false;
	let persisted = false;
	let runtimePersisted = false;
	let persistedResult;
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
	let resolvedBeforeProvider = false;
	let replacementText;
	let confirmedSteerTargetRunId;
	let pendingInput;
	let processingCompletion;
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
		import("./globals-BqZPgrwm.mjs").then(({ logVerbose }) => {
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
				resolvedBeforeProvider = !sentToProvider;
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
	const recordAdmission = (receipt, persistedMessage) => {
		if (admissionReceipt) return;
		admissionReceipt = resolveUserTurnTranscriptAdmission({
			logicalTurnId,
			receipt
		});
		admittedMessage = persistedMessage;
		admissionHandler?.(admissionReceipt);
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
		if (!runtimePersistencePromise) return;
		try {
			await runtimePersistencePromise;
		} catch (error) {
			handlePersistenceError(error);
		}
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
					onOriginalInputCommitted: notifyOriginalInputCommitted
				});
				return await (pendingInput ? withSessionPendingInputPersistence(pendingInput, persist) : persist());
			};
			const lateMediaMessage = sentToProvider && !resolvedBeforeProvider ? buildLateResolvedMediaMessage({
				admittedMessage: runtimePersistedMessage ?? message,
				resolvedMessage
			}) : void 0;
			if (lateMediaMessage) {
				if (!runtimePersisted && !persisted && message) {
					const admittedResult = await persistMessage(message, updateMode);
					if (admittedResult) {
						persisted = true;
						persistedResult = admittedResult;
						recordAdmission(admittedResult.admission, admittedResult.message);
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
				recordAdmission(result.admission, result.message);
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
		getProcessingCompletion: () => processingCompletion?.ok ? processingCompletion.value : pendingInput?.completion,
		completeProcessing: (outcome) => {
			if (!pendingInput?.complete) return;
			if (!processingCompletion) try {
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
			if (!processingCompletion.ok) throw processingCompletion.error;
			return processingCompletion.value;
		},
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
		getAdmissionReceipt: () => admissionReceipt,
		setAdmissionHandler: (handler) => admissionHandler = handler,
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
				recordAdmission(receipt, persistedMessage);
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
		hasRuntimePersistencePending: () => runtimePersistencePromise !== void 0,
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
export { createUserTurnTranscriptRecorder as t };
