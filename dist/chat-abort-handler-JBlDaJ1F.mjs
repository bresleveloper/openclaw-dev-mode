import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { n as assertExistingDatabaseIdentity, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { U as validateChatAbortParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { f as resolveSqliteWriteAdmissionScope, i as prepareSqliteScope, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { a as withSessionEntryWorker } from "./session-accessor.sqlite-replacement-worker-9fiwLkM3.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { a as resolveSessionStoreKey } from "./session-store-key-Ci099tm9.mjs";
import { t as chatRunBelongsToAgent } from "./chat-run-owner-Ci8Mz1ow.mjs";
import { r as isChatAbortControllerEntryAbortable, t as abortChatRunById } from "./chat-abort-DsJ_Zmkt.mjs";
import { i as isQueuedChatTurnForSession, t as abortQueuedChatTurnById } from "./chat-queued-turns-Dn_FgmH5.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-BrASrBY_.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DrLraxiU.mjs";
import { r as resolveStateContentionPresentation } from "./session-run-error-presentation-Mm1GMV0-.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { r as emitSessionsChanged } from "./session-change-event-CooG4AKR.mjs";
import { i as getWorkerInferenceSessionControl } from "./inference-control-internal-h8yXQYae.mjs";
import { n as createChatAbortOps, t as captureWorkerInferenceForSession } from "./chat-abort-ops-BfEknC6Y.mjs";
import { a as withAbortedPartialPersistenceWarning, i as deferAbortedPartialPersistence, n as abortedPartialPersistenceError, r as captureAbortedPartial } from "./chat-aborted-partial-CGL7cMIA.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as formatStopRequest } from "./control-plane-audit-DhEbrRsy.mjs";
import { n as pendingChatSendDedupeKey } from "./server-shared-C-7Ahu3n.mjs";
import { d as resolveChatAbortRequester, f as writePreRegisteredAgentAbort, i as descendantAbortError, l as readPreRegisteredAgentDedupePayloadForSession, n as abortControlledSubagents, o as canRequesterAbortChatRun, p as writePreRegisteredChatAbort, s as canRequesterAbortPreRegisteredRun, t as abortChatRunsForSessionKeyWithPartials } from "./chat-abort-runtime-BC_FxZrY.mjs";
import { i as persistAbortedPartials } from "./chat-transcript-persistence-glkdI6Fz.mjs";
//#region src/config/sessions/session-pending-input-withdrawal.ts
function readWithdrawalResult(receipt, input) {
	return isRecord(receipt) && receipt.kind === "session-pending-input-withdrawal" && receipt.sessionKey === input.sessionKey && receipt.sessionId === input.sessionId && receipt.runId === input.runId && typeof receipt.withdrawn === "boolean" ? receipt.withdrawn : void 0;
}
/** The caller retains live cancellation authority until withdrawal commits. */
async function discardSessionPendingInput(scope, runId, assertCurrent) {
	assertCurrent();
	const env = cloneEnvWithPlatformSemantics(scope.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const target = {
		...scope,
		env
	};
	const logical = resolveSqliteScope({
		...target,
		storePath: void 0
	});
	const storePath = logical.path ?? target.storePath ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(logical));
	const input = {
		sessionKey: logical.sessionKey,
		sessionId: target.sessionId,
		runId
	};
	if (isIncognitoOpenClawAgentSqlitePath(storePath, toDatabaseOptions(logical))) throw new Error("Queued input removal is unavailable for incognito chats; use Stop to cancel execution");
	const candidates = captureSessionStoreReadCandidates(storePath);
	const identities = new Map(candidates.filter((candidate) => !candidate.scope).map((candidate) => {
		const identity = readDatabasePathIdentitySync(candidate.path);
		return [identity.canonicalPath, identity];
	}));
	const writeAdmission = resolveSqliteWriteAdmissionScope(target);
	const withdraw = async () => {
		const resolved = await prepareSqliteScope(target);
		assertCurrent();
		const options = toDatabaseOptions(resolved);
		const path = resolveOpenClawAgentSqlitePath(options);
		const identity = identities.get(assertSessionStoreReadCandidate(path, candidates));
		if (!identity) throw new Error("Pending input withdrawal changed its captured database owner");
		if (!identity.key.startsWith("file:")) return false;
		const assertHeld = () => {
			assertSessionStoreReadCandidate(path, candidates);
			assertExistingDatabaseIdentity(path, identity.key, identity.birthtime);
			assertCurrent();
		};
		assertHeld();
		let admitted;
		return withSessionEntryWorker({
			...options,
			path
		}, void 0, assertHeld, async (execution, source) => {
			return await execution.runExisting(source, async (worker) => {
				const outcome = await worker.execute({
					type: "session.pendingInputs.withdraw",
					input
				}).then(() => ({ ok: true }), (error) => ({
					ok: false,
					error
				}));
				if (admitted) {
					await admitted.retained.settled;
					const withdrawn = readWithdrawalResult(admitted.admission.committed?.facts, input);
					if (admitted.admission.settlement?.kind === "completed" && withdrawn !== void 0) return withdrawn;
				}
				if (!outcome.ok) throw outcome.error;
				throw new SqliteWorkerError("Pending input withdrawal has no confirmed native completion and commit receipt", "outcome-unknown");
			}) ?? false;
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
	const inferredSessionAgentId = !agentIdOverride && parsedAbortSessionKey ? normalizeAgentId(parsedAbortSessionKey.agentId) : void 0;
	const bareSessionAgentResolution = !parsedAbortSessionKey ? resolveRequestedSessionAgentId(abortCfg, rawSessionKey, agentIdOverride) : void 0;
	if (bareSessionAgentResolution && !bareSessionAgentResolution.ok) {
		respond(false, void 0, bareSessionAgentResolution.error);
		return;
	}
	const abortAgentId = parsedAbortSessionKey ? agentIdOverride ?? inferredSessionAgentId : bareSessionAgentResolution?.agentId;
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
	const abortSession = (() => {
		try {
			return {
				ok: true,
				value: loadGatewaySessionEntry(canonicalAbortSessionKey, { agentId: abortAgentId })
			};
		} catch (error) {
			return {
				ok: false,
				error
			};
		}
	})();
	const abortSessionEntry = abortSession.ok ? abortSession.value.entry : void 0;
	if (!runId) {
		const res = await abortChatRunsForSessionKeyWithPartials({
			context,
			ops,
			sessionKey: canonicalAbortSessionKey,
			sessionKeyAliases: canonicalAbortSessionKey === rawSessionKey ? void 0 : [rawSessionKey],
			agentId: abortAgentId,
			sessionId: abortSessionEntry?.sessionId,
			requiredSessionId,
			session: abortSession,
			defaultAgentId: compatibilityDefaultAgentId,
			abortOrigin: "rpc",
			stopReason: "rpc",
			requester,
			assertCurrent,
			preserveSideRuns,
			onAuthorizedAfterQueuedAbort: lifecycle.onAuthorizedAfterQueuedAbort,
			cascadeDescendants: lifecycle.cascadeDescendants
		});
		if (res.unauthorized) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
			return;
		}
		if (res.descendants?.killed) lifecycle.onDescendantsCancelled?.();
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
	const active = context.chatAbortControllers.get(runId);
	const withdrawalQueue = discardPendingInput ? context.chatQueuedTurns.get(runId) : void 0;
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
		const activeTarget = active && {
			entry: active,
			sessionKey: active.sessionKey,
			sessionId: active.sessionId,
			agentId: active.agentId
		};
		const queuedTarget = queued && {
			entry: queued,
			sessionKey: queued.sessionKey,
			sessionId: queued.sessionId,
			agentId: queued.agentId
		};
		const release = queued?.holdPendingInputWithdrawal?.();
		if (!queued || !release) throw new Error("Queued input is already starting; refresh before removing it.");
		return () => {
			try {
				if (!inputWithdrawn || controller.signal.aborted) return;
				if (activeTarget && context.chatAbortControllers.get(runId) === activeTarget.entry && activeTarget.entry.controller === controller && activeTarget.entry.sessionKey === activeTarget.sessionKey && activeTarget.entry.sessionId === activeTarget.sessionId && activeTarget.entry.agentId === activeTarget.agentId) abortChatRunById(ops, {
					runId,
					sessionKey: activeTarget.sessionKey,
					stopReason: "rpc"
				});
				if (!controller.signal.aborted && queuedTarget && context.chatQueuedTurns.get(runId) === queuedTarget.entry && queuedTarget.entry.controller === controller && queuedTarget.entry.sessionKey === queuedTarget.sessionKey && queuedTarget.entry.sessionId === queuedTarget.sessionId && queuedTarget.entry.agentId === queuedTarget.agentId) abortQueuedChatTurnById(context.chatQueuedTurns, {
					runId,
					sessionKey: queuedTarget.sessionKey,
					stopReason: "rpc"
				});
			} finally {
				release?.();
			}
		};
	};
	const discardBeforeAbort = async (target, ownsTarget) => {
		if (!abortSession.ok) throw abortSession.error;
		const captured = {
			agentId: target.agentId ?? abortAgentId,
			sessionKey: target.sessionKey,
			sessionId: target.sessionId,
			storePath: abortSession.value.storePath
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
	const respondWithWorkerRuns = async (localRunIds, warning) => {
		const runIds = new Set(localRunIds);
		if (inputWithdrawn) runIds.add(runId);
		if (requester.isAdmin) {
			assertCurrent();
			await workerCancellation?.cancel({
				assertCurrent,
				onCancelled: (id) => runIds.add(id)
			});
		}
		if (!abortSession.ok) throw abortSession.error;
		respond(true, {
			ok: true,
			aborted: runIds.size > 0,
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
		const queued = chatQueuedTurns.get(runId);
		if (queued) {
			if (!discardPendingInput && !authorizeRunTarget(queued)) return;
			const { sessionKey, sessionId, agentId } = queued;
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
				if (chatQueuedTurns.get(runId) !== queued || queued.sessionKey !== sessionKey || queued.sessionId !== sessionId || queued.agentId !== agentId) throw new Error("Run changed before cancellation; retry Stop.");
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
		if (!workerCancellation?.runIds.length) {
			if (!abortSession.ok) throw abortSession.error;
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
	const ownsTarget = () => context.chatAbortControllers.get(runId) === active && active.sessionKey === sessionKey && active.sessionId === sessionId && active.agentId === agentId && isChatAbortControllerEntryAbortable(active) && (!discardPendingInput || ownsWithdrawalQueue());
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
		const snapshot = controlUiVisible !== false && partialText?.trim() ? captureAbortedPartial({
			runId,
			sessionKey,
			sessionId,
			agentId: agentId ?? abortAgentId,
			text: partialText,
			abortOrigin: "rpc",
			resolveTerminalProducer: active.resolveTerminalProducer,
			...sessionKey === rawSessionKey || sessionKey === canonicalAbortSessionKey ? { session: abortSession } : {}
		}) : void 0;
		let descendants;
		let failure;
		let warning;
		try {
			descendants = await abortControlledSubagents({
				cfg: abortCfg,
				sessionKey,
				agentId,
				requesterTurnRunId: runId,
				assertCurrent,
				beforeKill: () => {
					assertCurrent();
					if (context.chatAbortControllers.get(runId) !== active || active.sessionKey !== sessionKey || active.sessionId !== sessionId || active.agentId !== agentId) {
						if (inputWithdrawn) return false;
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
		if (!abortSession.ok) throw abortedPartialPersistenceError(abortSession.error, warning);
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
