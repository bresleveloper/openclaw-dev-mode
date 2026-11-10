import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { K as validateChatAbortParams, Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { c as resolveSqliteWriteAdmissionScope, i as prepareSqliteScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { a as withSessionEntryWorker, o as settleSessionWorkerReceipt } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
import { r as captureSessionStoreReadTarget } from "./session-pending-input-history-DRfEA-VZ.mjs";
import { r as resolveRequestedSessionAgentId, s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { o as resolveSessionStoreKey } from "./session-store-key-DKpto8R6.mjs";
import { r as resolveStateContentionPresentation } from "./session-run-error-presentation-TwKM9EqW.mjs";
import { t as chatRunBelongsToAgent } from "./chat-run-owner-BB6L4tWc.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { r as isChatAbortControllerEntryAbortable, t as abortChatRunById } from "./chat-abort-CKC_-urc.mjs";
import { i as isQueuedChatTurnForSession, t as abortQueuedChatTurnById } from "./chat-queued-turns-CBHBVpa_.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { n as captureExecRequestCancellation } from "./bash-process-control-D15pjJye.mjs";
import "./session-utils-CGx9I2of.mjs";
import { i as persistAbortedPartials } from "./chat-transcript-persistence-ClpuE6I1.mjs";
import { a as prepareChatAbortSessionSnapshot, c as withAbortedPartialPersistenceWarning, i as deferAbortedPartialPersistence, n as abortedPartialPersistenceError, r as captureAbortedPartial } from "./chat-aborted-partial-BuPGs0tJ.mjs";
import { i as getWorkerInferenceSessionControl } from "./inference-control-internal-Bk4Jd75M.mjs";
import { n as createChatAbortOps, t as captureWorkerInferenceForSession } from "./chat-abort-ops-cs9Qjbw9.mjs";
import { n as formatStopRequest } from "./control-plane-audit-DhEbrRsy.mjs";
import { n as pendingChatSendDedupeKey } from "./server-shared-C-7Ahu3n.mjs";
import { a as descendantAbortError, c as canRequesterAbortPreRegisteredRun, f as readPreRegisteredAgentDedupePayloadForSession, g as writePreRegisteredChatAbort, h as writePreRegisteredAgentAbort, i as abortControlledSubagents, l as captureAbortTargetIdentity, m as resolveChatAbortRequester, s as canRequesterAbortChatRun, t as abortChatRunsForSessionKeyWithPartials, u as captureSessionAbortRequestOrigin } from "./chat-abort-runtime-BJzZinuj.mjs";
//#region src/config/sessions/session-pending-input-withdrawal.ts
function readWithdrawalResult(receipt, input) {
	return isRecord(receipt) && receipt.kind === "session-pending-input-withdrawal" && receipt.sessionKey === input.sessionKey && receipt.sessionId === input.sessionId && receipt.runId === input.runId && typeof receipt.withdrawn === "boolean" ? receipt.withdrawn : void 0;
}
/** The caller retains live cancellation authority until withdrawal commits. */
async function discardSessionPendingInput(scope, runId, assertCurrent) {
	assertCurrent();
	if (captureSessionActorStorageOwner(scope, {
		assertCurrent,
		authorize: assertCurrent
	})) throw new Error("Queued input removal is unavailable for incognito chats; use Stop to cancel execution");
	const env = cloneEnvWithPlatformSemantics(scope.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const target = {
		...scope,
		env
	};
	const input = {
		sessionKey: resolveSqliteScope({
			...target,
			storePath: void 0
		}).sessionKey,
		sessionId: target.sessionId,
		runId
	};
	const captured = captureSessionStoreReadTarget(target, "Pending input withdrawal changed its captured database owner");
	const writeAdmission = resolveSqliteWriteAdmissionScope(target);
	const withdraw = async () => {
		const resolved = await prepareSqliteScope(target);
		assertCurrent();
		const { options, identity, assertCurrent: assertSourceCurrent } = captured.resolve(resolved);
		if (!identity.key.startsWith("file:")) return false;
		const assertHeld = () => {
			assertSourceCurrent();
			assertCurrent();
		};
		assertHeld();
		let admitted;
		return withSessionEntryWorker(options, void 0, assertHeld, async (execution, source) => {
			return await execution.runExisting(source, (worker) => settleSessionWorkerReceipt(() => worker.execute({
				type: "session.pendingInputs.withdraw",
				input
			}), () => admitted, (facts) => readWithdrawalResult(facts, input), "Pending input withdrawal has no confirmed native completion and commit receipt")) ?? false;
		}, (admission, retained, facts) => {
			if (!isRecord(facts) || readWithdrawalResult(facts.publication, input) === void 0) throw new Error("Pending input withdrawal commit omitted its exact receipt");
			admitted = {
				admission,
				retained
			};
		});
	};
	return writeAdmission ? runOpenClawAgentWriteAdmission(toDatabaseOptions(writeAdmission), withdraw, true) : withdraw();
}
//#endregion
//#region src/gateway/server-methods/chat-abort-handler.ts
async function handleChatAbortRequestWithLifecycle(options, lifecycle = {}) {
	const { params, respond, context, client, sessionMutationAuthorization } = options;
	const authority = readGatewayRequestMutationAuthority(options);
	const requester = resolveChatAbortRequester(client, sessionMutationAuthorization);
	const assertCurrent = () => {
		authority.assertCurrent();
		sessionMutationAuthorization?.assertCurrent();
		requester.sessionAuthority?.assertCurrent();
	};
	if (!assertValidParams(params, validateChatAbortParams, "chat.abort", respond)) return;
	const { sessionKey: rawSessionKey, runId, preserveSideRuns, discardPendingInput } = params;
	if (discardPendingInput && !runId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "discardPendingInput requires an exact runId"));
		return;
	}
	const agentIdOverride = normalizeOptionalString(params.agentId);
	const abortCfg = context.getRuntimeConfig();
	const parsedAbortSessionKey = parseAgentSessionKey(rawSessionKey);
	const compatibilityDefaultAgentId = tryResolveSessionCompatibilityOwnerAgentId(abortCfg, rawSessionKey);
	const bareSessionAgentResolution = !parsedAbortSessionKey ? resolveRequestedSessionAgentId(abortCfg, rawSessionKey, agentIdOverride) : void 0;
	if (bareSessionAgentResolution && !bareSessionAgentResolution.ok) {
		respond(false, void 0, bareSessionAgentResolution.error);
		return;
	}
	const abortAgentId = parsedAbortSessionKey ? agentIdOverride ?? normalizeAgentId(parsedAbortSessionKey.agentId) : bareSessionAgentResolution?.agentId;
	if (!abortAgentId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, rawSessionKey.trim().toLowerCase() === "global" ? "agentId is required for global chat.abort when no compatibility owner exists" : "agentId is required for unscoped chat.abort when no compatibility owner exists"));
		return;
	}
	if (agentIdOverride && parsedAbortSessionKey && normalizeAgentId(parsedAbortSessionKey.agentId) !== normalizeAgentId(agentIdOverride)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agentId "${agentIdOverride}" does not match session key "${rawSessionKey}"`));
		return;
	}
	const canonicalAbortSessionKey = resolveSessionStoreKey({
		cfg: abortCfg,
		sessionKey: rawSessionKey,
		storeAgentId: abortAgentId
	});
	if (discardPendingInput && isIncognitoSessionKey(canonicalAbortSessionKey)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Removing accepted queued input is unavailable in incognito sessions. Use Stop to cancel it."));
		return;
	}
	const narrow = authority.sessionScope === "operator.sessions.write" || requester.sessionAuthority !== void 0;
	const admittedTarget = sessionMutationAuthorization?.admittedTarget;
	if (narrow && (!admittedTarget?.sessionId.trim() || admittedTarget.sessionKey !== canonicalAbortSessionKey || admittedTarget.agentId !== normalizeAgentId(abortAgentId))) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session target is unavailable"));
		return;
	}
	const requiredSessionId = narrow ? admittedTarget?.sessionId : void 0;
	const ops = createChatAbortOps(context);
	const prepareAbortSession = () => prepareChatAbortSessionSnapshot({
		excludeInternalEffects: true,
		cfg: abortCfg,
		key: canonicalAbortSessionKey,
		agentId: abortAgentId
	});
	if (!runId) {
		const res = await abortChatRunsForSessionKeyWithPartials({
			context,
			ops,
			sessionKey: canonicalAbortSessionKey,
			sessionKeyAliases: canonicalAbortSessionKey === rawSessionKey ? void 0 : [rawSessionKey],
			agentId: abortAgentId,
			sessionId: requiredSessionId,
			requiredSessionId,
			defaultAgentId: compatibilityDefaultAgentId,
			abortOrigin: "rpc",
			stopReason: "rpc",
			requester,
			assertCurrent,
			stopEmbeddedRun: true,
			preserveSideRuns,
			onAuthorizedBeforeEmbeddedAbort: lifecycle.onAuthorizedBeforeEmbeddedAbort,
			onAuthorizedAfterQueuedAbort: lifecycle.onAuthorizedAfterQueuedAbort,
			cascadeDescendants: lifecycle.cascadeDescendants
		}, prepareAbortSession);
		if (res.unauthorized) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
			return;
		}
		if (res.descendants?.killed || res.descendants?.continuationRetired) lifecycle.onDescendantsCancelled?.(res.descendants);
		const error = res.error ?? descendantAbortError(res.descendants, "Session");
		if (error) {
			respond(false, void 0, withAbortedPartialPersistenceWarning(error, res.warning));
			return;
		}
		respond(true, {
			ok: true,
			aborted: res.aborted,
			runIds: res.runIds,
			...res.warning ? { warning: res.warning } : {}
		});
		return;
	}
	const active = context.chatAbortControllers.get(runId);
	const queuedCandidate = context.chatQueuedTurns.get(runId);
	let abortSessionRead;
	const readAbortSession = () => abortSessionRead ??= prepareAbortSession();
	const abortSession = !active || discardPendingInput ? await readAbortSession() : void 0;
	const abortSessionEntry = abortSession?.ok ? abortSession.value.entry : void 0;
	const normalizedAgentIdOverride = normalizeAgentId(abortAgentId);
	const authorizeRunTarget = (target) => {
		let error;
		if (discardPendingInput && target.sessionKey !== rawSessionKey && target.sessionKey !== canonicalAbortSessionKey) error = "discarded input runId does not match sessionKey";
		else if (narrow && target.sessionId !== requiredSessionId) error = "runId does not match session incarnation";
		else if (target.sessionKey !== rawSessionKey && target.sessionKey !== canonicalAbortSessionKey && (narrow || !canRequesterAbortChatRun(target, requester, { requireOwnerMatch: true }))) error = "runId does not match sessionKey";
		else if (!chatRunBelongsToAgent({
			agentId: target.agentId,
			sessionKey: target.sessionKey,
			defaultAgentId: compatibilityDefaultAgentId
		}, normalizedAgentIdOverride)) error = "runId does not match agentId";
		else if (!canRequesterAbortChatRun(target, requester)) error = "unauthorized";
		if (error) respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error));
		return error === void 0;
	};
	const withdrawalQueue = discardPendingInput ? queuedCandidate : void 0;
	const withdrawalScope = withdrawalQueue && {
		sessionKey: withdrawalQueue.sessionKey,
		sessionId: withdrawalQueue.sessionId,
		agentId: withdrawalQueue.agentId
	};
	const ownsWithdrawalQueue = () => Boolean(withdrawalQueue && withdrawalScope && context.chatQueuedTurns.get(runId) === withdrawalQueue && isQueuedChatTurnForSession(context.chatQueuedTurns, runId, withdrawalScope));
	if (discardPendingInput) {
		if (active && !authorizeRunTarget(active) || withdrawalQueue && !authorizeRunTarget(withdrawalQueue)) return;
		if (!ownsWithdrawalQueue() || active && withdrawalQueue?.controller !== active.controller) {
			respond(true, {
				ok: true,
				aborted: false,
				runIds: []
			});
			return;
		}
	}
	const workerTarget = getWorkerInferenceSessionControl(context.workerEnvironmentService)?.resolveSessionTargetForRunId(runId);
	const workerCancellation = captureWorkerInferenceForSession({
		context,
		sessionId: active?.sessionId ?? workerTarget?.sessionId ?? abortSessionEntry?.sessionId,
		runId
	});
	let inputWithdrawn = false;
	const holdPendingInputWithdrawal = (controller) => {
		if (!discardPendingInput) return;
		const queued = withdrawalQueue?.controller === controller ? withdrawalQueue : void 0;
		const activeCurrent = active && captureAbortTargetIdentity(context.chatAbortControllers, runId, active);
		const queuedCurrent = queued && captureAbortTargetIdentity(context.chatQueuedTurns, runId, queued);
		const release = queued?.holdPendingInputWithdrawal?.();
		if (!queued || !release) throw new Error("Queued input is already starting; refresh before removing it.");
		return () => {
			try {
				if (!inputWithdrawn || controller.signal.aborted) return;
				if (active && active.controller === controller && activeCurrent?.()) abortChatRunById(ops, {
					runId,
					sessionKey: active.sessionKey,
					stopReason: "rpc"
				});
				if (!controller.signal.aborted && queued.controller === controller && queuedCurrent?.()) abortQueuedChatTurnById(context.chatQueuedTurns, {
					runId,
					sessionKey: queued.sessionKey,
					stopReason: "rpc"
				});
			} finally {
				release();
			}
		};
	};
	const discardBeforeAbort = async (target, ownsTarget) => {
		const preparedSession = await readAbortSession();
		if (!preparedSession.ok) throw preparedSession.error;
		const captured = {
			agentId: target.agentId ?? abortAgentId,
			sessionKey: target.sessionKey,
			sessionId: target.sessionId,
			storePath: preparedSession.value.storePath
		};
		inputWithdrawn = await discardSessionPendingInput(captured, runId, () => {
			assertCurrent();
			if (!ownsTarget()) throw new Error("Run changed before input removal; refresh and retry.");
		});
		if (inputWithdrawn) emitSessionsChanged(context, {
			sessionKey: captured.sessionKey,
			sessionId: captured.sessionId,
			agentId: captured.agentId,
			reason: "agent.input.settled"
		}, { accessChanged: false });
	};
	const respondWithWorkerRuns = async (localRunIds, warning, commandsAborted = false) => {
		const runIds = new Set(localRunIds);
		if (inputWithdrawn) runIds.add(runId);
		if (requester.isAdmin) {
			assertCurrent();
			await workerCancellation?.cancel({
				assertCurrent,
				onCancelled: (id) => runIds.add(id)
			});
		}
		const preparedSession = await readAbortSession();
		if (!preparedSession.ok) throw preparedSession.error;
		respond(true, {
			ok: true,
			aborted: runIds.size > 0 || commandsAborted,
			runIds: [...runIds],
			...warning ? { warning } : {}
		});
	};
	if (!active) {
		const readPendingRunForAbort = (entry) => {
			for (const sessionKey of /* @__PURE__ */ new Set([canonicalAbortSessionKey, rawSessionKey])) {
				const payload = readPreRegisteredAgentDedupePayloadForSession({
					entry,
					runId,
					sessionKey,
					agentId: abortAgentId,
					defaultAgentId: compatibilityDefaultAgentId,
					requiredSessionId
				});
				if (payload) return {
					sessionKey: normalizeOptionalString(payload.sessionKey) ? sessionKey : void 0,
					payload
				};
			}
		};
		const pendingChatMatch = !discardPendingInput && readPendingRunForAbort(context.dedupe.get(pendingChatSendDedupeKey(runId)));
		if (pendingChatMatch) {
			if (!canRequesterAbortPreRegisteredRun(pendingChatMatch.payload, requester)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
				return;
			}
			assertCurrent();
			await respondWithWorkerRuns(writePreRegisteredChatAbort({
				context,
				runId,
				stopReason: "rpc",
				attemptId: normalizeOptionalString(pendingChatMatch.payload.attemptId),
				expectedPayload: pendingChatMatch.payload
			}) ? [runId] : []);
			return;
		}
		const pendingAgentEntry = context.dedupe.get(`agent:${runId}`);
		const pendingAgentMatch = !discardPendingInput && readPendingRunForAbort(pendingAgentEntry);
		if (pendingAgentMatch) {
			const pendingAgentPayload = pendingAgentMatch.payload;
			if (!canRequesterAbortPreRegisteredRun(pendingAgentPayload, requester)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
				return;
			}
			let aborted = false;
			const descendants = await abortControlledSubagents({
				cfg: abortCfg,
				sessionKey: pendingAgentMatch.sessionKey ?? canonicalAbortSessionKey,
				agentId: abortAgentId,
				requesterTurnRunId: runId,
				sessionId: abortSessionEntry?.sessionId,
				lifecycleRevision: abortSessionEntry?.lifecycleRevision,
				assertCurrent,
				beforeKill: () => {
					assertCurrent();
					return aborted = writePreRegisteredAgentAbort({
						context,
						runId,
						sessionKey: pendingAgentMatch.sessionKey,
						payload: pendingAgentPayload,
						expectedPayload: pendingAgentPayload,
						stopReason: "rpc"
					});
				}
			});
			const error = descendantAbortError(descendants, "Parent run");
			if (error) {
				respond(false, void 0, error);
				return;
			}
			await respondWithWorkerRuns(aborted ? [runId] : []);
			return;
		}
		const chatQueuedTurns = context.chatQueuedTurns;
		const queued = queuedCandidate;
		if (queued) {
			if (!discardPendingInput && !authorizeRunTarget(queued)) return;
			const { sessionKey, sessionId, agentId } = queued;
			const isQueuedCurrent = captureAbortTargetIdentity(chatQueuedTurns, runId, queued);
			const ownsTarget = () => chatQueuedTurns.get(runId) === queued && isQueuedChatTurnForSession(chatQueuedTurns, runId, {
				sessionKey,
				sessionId,
				agentId
			});
			const releaseWithdrawal = holdPendingInputWithdrawal(queued.controller);
			try {
				if (discardPendingInput) {
					await discardBeforeAbort(queued, ownsTarget);
					if (!inputWithdrawn) {
						respond(true, {
							ok: true,
							aborted: false,
							runIds: []
						});
						return;
					}
				}
				assertCurrent();
				if (discardPendingInput && !ownsTarget()) {
					await respondWithWorkerRuns([]);
					return;
				}
				if (!isQueuedCurrent()) throw new Error("Run changed before cancellation; retry Stop.");
				await respondWithWorkerRuns(abortQueuedChatTurnById(chatQueuedTurns, {
					runId,
					sessionKey: queued.sessionKey,
					stopReason: "rpc",
					allowSessionMismatch: true
				}).aborted ? [runId] : []);
			} finally {
				releaseWithdrawal?.();
			}
			return;
		}
		const commands = captureExecRequestCancellation({
			runId,
			sessionKey: canonicalAbortSessionKey,
			sessionId: abortSessionEntry?.sessionId,
			agentId: abortAgentId
		});
		if (!discardPendingInput && commands.owners.length > 0) {
			for (const owner of commands.owners) {
				const identity = owner.identity;
				if (!identity.sessionKey || !identity.sessionId || !canRequesterAbortChatRun(identity, requester, { requireOwnerMatch: true })) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
					return;
				}
				if (!authorizeRunTarget({
					...identity,
					sessionKey: identity.sessionKey,
					sessionId: identity.sessionId
				})) return;
			}
			const descendants = await abortControlledSubagents({
				cfg: abortCfg,
				sessionKey: canonicalAbortSessionKey,
				agentId: abortAgentId,
				sessionId: abortSessionEntry?.sessionId,
				requesterTurnRunId: runId,
				lifecycleRevision: abortSessionEntry?.lifecycleRevision,
				execCancellation: commands,
				assertCurrent,
				beforeKill: () => {
					assertCurrent();
					if (context.chatAbortControllers.has(runId)) throw new Error("Run changed before cancellation; retry Stop.");
					return true;
				}
			});
			const error = descendantAbortError(descendants, "Parent run");
			if (error) {
				respond(false, void 0, error);
				return;
			}
			await respondWithWorkerRuns([], void 0, descendants?.execAborted);
			return;
		}
		if (!workerCancellation?.runIds.length) {
			const preparedSession = await readAbortSession();
			if (!preparedSession.ok) throw preparedSession.error;
			respond(true, {
				ok: true,
				aborted: false,
				runIds: []
			});
			return;
		}
		if (!requester.isAdmin) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
			return;
		}
		await respondWithWorkerRuns([]);
		return;
	}
	if (!discardPendingInput && !authorizeRunTarget(active)) return;
	let aborted = false;
	const { sessionKey, sessionId, agentId, controlUiVisible } = active;
	const isActiveCurrent = captureAbortTargetIdentity(context.chatAbortControllers, runId, active);
	const queued = queuedCandidate?.controller === active.controller ? queuedCandidate : void 0;
	const isQueuedCurrent = queued && captureAbortTargetIdentity(context.chatQueuedTurns, runId, queued);
	const ownsTarget = () => isActiveCurrent() && isChatAbortControllerEntryAbortable(active) && (!discardPendingInput || ownsWithdrawalQueue());
	const releaseWithdrawal = holdPendingInputWithdrawal(active.controller);
	try {
		if (discardPendingInput) {
			await discardBeforeAbort(active, ownsTarget);
			if (!inputWithdrawn) {
				respond(true, {
					ok: true,
					aborted: false,
					runIds: []
				});
				return;
			}
		}
		assertCurrent();
		if (discardPendingInput && !ownsTarget()) {
			await respondWithWorkerRuns([]);
			return;
		}
		const partialText = context.chatRunState.resolveBuffer(runId, { final: true }).text;
		let snapshot;
		const commands = captureExecRequestCancellation({
			runId,
			sessionKey,
			sessionId,
			agentId
		});
		let descendants;
		let failure;
		let warning;
		try {
			descendants = await abortControlledSubagents({
				cfg: abortCfg,
				sessionKey,
				agentId,
				requesterTurnRunId: runId,
				execCancellation: commands,
				prepareSelection: {
					acceptsRequest: (identity) => identity.runId === runId,
					prepare: async () => {
						const preparedSession = await readAbortSession();
						const targetSession = sessionKey === rawSessionKey || sessionKey === canonicalAbortSessionKey ? preparedSession : await prepareChatAbortSessionSnapshot({
							cfg: abortCfg,
							key: sessionKey,
							agentId: agentId ?? abortAgentId
						});
						if (controlUiVisible !== false && partialText?.trim()) snapshot = captureAbortedPartial({
							runId,
							sessionKey,
							sessionId,
							text: partialText,
							abortOrigin: "rpc",
							resolveTerminalProducer: active.resolveTerminalProducer,
							session: targetSession
						});
						return {
							execCancellation: commands,
							sessionOrigin: captureSessionAbortRequestOrigin({
								session: targetSession,
								requiredSessionId: sessionId
							}, (identity) => identity.runId === runId)
						};
					}
				},
				sessionId,
				lifecycleRevision: abortSessionEntry?.sessionId === sessionId ? abortSessionEntry.lifecycleRevision : void 0,
				assertCurrent,
				beforeKill: () => {
					assertCurrent();
					if (!isActiveCurrent()) {
						if (inputWithdrawn) return false;
						if (!context.chatAbortControllers.has(runId) && queued && isQueuedCurrent?.()) {
							aborted = abortQueuedChatTurnById(context.chatQueuedTurns, {
								runId,
								sessionKey: queued.sessionKey,
								stopReason: "rpc"
							}).aborted;
							return aborted;
						}
						if (!context.chatAbortControllers.has(runId) && !context.chatQueuedTurns.has(runId)) return false;
						throw new Error("Run changed before cancellation; retry Stop.");
					}
					return abortChatRunById(ops, {
						runId,
						sessionKey,
						stopReason: "rpc",
						onAbortCommitted: () => {
							aborted = true;
							deferAbortedPartialPersistence(snapshot, context);
						}
					}).aborted;
				}
			});
		} catch (error) {
			failure = { error };
		}
		if (aborted && snapshot) try {
			warning = await persistAbortedPartials({
				context,
				snapshots: [snapshot]
			});
		} catch (error) {
			if (failure) throw new AggregateError([failure.error, error], "Chat cancellation and persistence failed", { cause: error });
			throw error;
		}
		if (failure) throw abortedPartialPersistenceError(failure.error, warning);
		const preparedSession = await readAbortSession();
		if (!preparedSession.ok) throw abortedPartialPersistenceError(preparedSession.error, warning);
		const descendantError = descendantAbortError(descendants, "Parent run");
		if (descendantError) {
			respond(false, void 0, withAbortedPartialPersistenceWarning(descendantError, warning));
			return;
		}
		try {
			await respondWithWorkerRuns(aborted ? [runId] : [], warning);
		} catch (error) {
			throw abortedPartialPersistenceError(error, warning);
		}
	} finally {
		releaseWithdrawal?.();
	}
}
async function handleChatAbortRequest(options) {
	if (validateChatAbortParams(options.params)) options.context.logGateway.info(formatStopRequest("chat.abort", options.client, options.params));
	try {
		await handleChatAbortRequestWithLifecycle(options);
	} catch (error) {
		const contention = resolveStateContentionPresentation(error);
		if (!contention) throw error;
		options.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "The server is busy. Check this turn's status before trying Stop again.\n\nSQLite transaction admission remained busy. Stopping may already have taken effect.", { details: { errorKind: contention.errorKind } }));
	}
}
//#endregion
export { handleChatAbortRequestWithLifecycle as n, handleChatAbortRequest as t };
