import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { H as validateChatAbortParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { i as resolveSessionStoreKey } from "./session-store-key-BoleEY7N.mjs";
import { t as abortChatRunById } from "./chat-abort-D7PkkSq8.mjs";
import { t as chatRunBelongsToAgent } from "./chat-run-owner-HbcABEVb.mjs";
import { t as abortQueuedChatTurnById } from "./chat-queued-turns-D5_b93Ci.mjs";
import { i as readGatewayRequestMutationAuthority } from "./session-mutation-guards-DivkApLb.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DDuAGjCc.mjs";
import "./session-utils-CJ7A982R.mjs";
import { t as createChatAbortOps } from "./chat-abort-ops-lFr576Vk.mjs";
import { t as captureAbortedPartial } from "./chat-aborted-partial-BC2AaxuD.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as pendingChatSendDedupeKey } from "./server-shared-C-7Ahu3n.mjs";
import { n as normalizeUnknownChatText, t as normalizeOptionalChatText } from "./chat-text-normalization-HsVzW9xs.mjs";
import { a as descendantAbortError, c as canRequesterAbortPreRegisteredRun, f as resolveChatAbortRequester, i as captureWorkerInferenceForSession, m as writePreRegisteredChatAbort, n as abortControlledSubagents, p as writePreRegisteredAgentAbort, s as canRequesterAbortChatRun, t as abortChatRunsForSessionKeyWithPartials, u as readPreRegisteredAgentDedupePayloadForSession } from "./chat-abort-runtime-BY_P9k1b.mjs";
import { i as persistAbortedPartials } from "./chat-transcript-persistence-D3pOEA4v.mjs";
//#region src/gateway/server-methods/chat-abort-handler.ts
async function handleChatAbortRequestWithLifecycle(options, lifecycle = {}) {
	const { params, respond, context, client, sessionMutationAuthorization } = options;
	const authority = readGatewayRequestMutationAuthority(options);
	const assertCurrent = () => {
		authority.assertCurrent();
		sessionMutationAuthorization?.assertCurrent();
	};
	if (!assertValidParams(params, validateChatAbortParams, "chat.abort", respond)) return;
	const { sessionKey: rawSessionKey, runId, preserveSideRuns } = params;
	const agentIdOverride = normalizeOptionalChatText(params.agentId);
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
	const narrow = authority.sessionScope === "operator.sessions.write";
	const admittedTarget = sessionMutationAuthorization?.admittedTarget;
	if (narrow && (!admittedTarget?.sessionId.trim() || admittedTarget.sessionKey !== canonicalAbortSessionKey || admittedTarget.agentId !== normalizeAgentId(abortAgentId))) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session target is unavailable"));
		return;
	}
	const requiredSessionId = narrow ? admittedTarget?.sessionId : void 0;
	const ops = createChatAbortOps(context);
	const requester = resolveChatAbortRequester(client);
	const sessionLoadOptions = { agentId: abortAgentId };
	const abortSession = (() => {
		try {
			return {
				ok: true,
				value: loadGatewaySessionEntry(canonicalAbortSessionKey, sessionLoadOptions)
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
			excludeRunIds: lifecycle.excludeRunIds,
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
			respond(false, void 0, error);
			return;
		}
		respond(true, {
			ok: true,
			aborted: res.aborted,
			runIds: res.runIds
		});
		return;
	}
	const normalizedAgentIdOverride = normalizeAgentId(abortAgentId);
	const authorizeRunTarget = (target) => {
		if (narrow && target.sessionId !== requiredSessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "runId does not match session incarnation"));
			return false;
		}
		if (target.sessionKey !== rawSessionKey && target.sessionKey !== canonicalAbortSessionKey && (narrow || !canRequesterAbortChatRun(target, requester, { requireOwnerMatch: true }))) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "runId does not match sessionKey"));
			return false;
		}
		if (!chatRunBelongsToAgent({
			agentId: target.agentId,
			sessionKey: target.sessionKey,
			defaultAgentId: compatibilityDefaultAgentId
		}, normalizedAgentIdOverride)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "runId does not match agentId"));
			return false;
		}
		if (!canRequesterAbortChatRun(target, requester)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
			return false;
		}
		return true;
	};
	const active = context.chatAbortControllers.get(runId);
	const workerCancellation = captureWorkerInferenceForSession({
		context,
		sessionId: active?.sessionId ?? abortSessionEntry?.sessionId,
		runId
	});
	const respondWithWorkerRuns = (localRunIds) => {
		const runIds = new Set(localRunIds);
		if (requester.isAdmin) {
			assertCurrent();
			workerCancellation?.cancel({
				assertCurrent,
				onCancelled: (id) => runIds.add(id)
			});
		}
		if (!abortSession.ok) throw abortSession.error;
		respond(true, {
			ok: true,
			aborted: runIds.size > 0,
			runIds: [...runIds]
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
					includeHidden: true,
					requiredSessionId
				});
				if (payload) return {
					sessionKey: normalizeUnknownChatText(payload.sessionKey) ? sessionKey : void 0,
					payload
				};
			}
		};
		const pendingChatMatch = readPendingRunForAbort(context.dedupe.get(pendingChatSendDedupeKey(runId)));
		if (pendingChatMatch) {
			if (!canRequesterAbortPreRegisteredRun(pendingChatMatch.payload, requester)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
				return;
			}
			assertCurrent();
			respondWithWorkerRuns(writePreRegisteredChatAbort({
				context,
				runId,
				stopReason: "rpc",
				attemptId: normalizeUnknownChatText(pendingChatMatch.payload.attemptId),
				expectedPayload: pendingChatMatch.payload
			}) ? [runId] : []);
			return;
		}
		const pendingAgentMatch = readPendingRunForAbort(context.dedupe.get(`agent:${runId}`));
		if (pendingAgentMatch) {
			const pendingAgentPayload = pendingAgentMatch.payload;
			if (!canRequesterAbortPreRegisteredRun(pendingAgentPayload, requester)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
				return;
			}
			assertCurrent();
			respondWithWorkerRuns(writePreRegisteredAgentAbort({
				context,
				runId,
				sessionKey: pendingAgentMatch.sessionKey,
				payload: pendingAgentPayload,
				expectedPayload: pendingAgentPayload,
				stopReason: "rpc"
			}) ? [runId] : []);
			return;
		}
		const chatQueuedTurns = context.chatQueuedTurns;
		const queued = chatQueuedTurns.get(runId);
		if (queued) {
			if (!authorizeRunTarget(queued)) return;
			const { sessionKey, sessionId, agentId } = queued;
			assertCurrent();
			if (chatQueuedTurns.get(runId) !== queued || queued.sessionKey !== sessionKey || queued.sessionId !== sessionId || queued.agentId !== agentId) throw new Error("Run changed before cancellation; retry Stop.");
			respondWithWorkerRuns(abortQueuedChatTurnById(chatQueuedTurns, {
				runId,
				sessionKey: queued.sessionKey,
				stopReason: "rpc",
				allowSessionMismatch: true
			}).aborted ? [runId] : []);
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
		respondWithWorkerRuns([]);
		return;
	}
	if (!authorizeRunTarget(active)) return;
	let aborted = false;
	const { sessionKey, sessionId, agentId, controlUiVisible } = active;
	const partialText = context.chatRunState.resolveBuffer(runId, { final: true }).text;
	const snapshot = controlUiVisible !== false && partialText?.trim() ? captureAbortedPartial({
		runId,
		sessionKey,
		sessionId,
		agentId: agentId ?? abortAgentId,
		text: partialText,
		abortOrigin: "rpc",
		...sessionKey === rawSessionKey || sessionKey === canonicalAbortSessionKey ? { session: abortSession } : {}
	}) : void 0;
	let descendants;
	try {
		descendants = await abortControlledSubagents({
			cfg: abortCfg,
			sessionKey,
			agentId,
			requesterTurnRunId: runId,
			assertCurrent,
			beforeKill: () => {
				assertCurrent();
				if (context.chatAbortControllers.get(runId) !== active || active.sessionKey !== sessionKey || active.sessionId !== sessionId || active.agentId !== agentId) throw new Error("Run changed before cancellation; retry Stop.");
				return aborted = abortChatRunById(ops, {
					runId,
					sessionKey,
					stopReason: "rpc"
				}).aborted;
			}
		});
	} finally {
		if (aborted && snapshot) await persistAbortedPartials({
			context,
			snapshots: [snapshot]
		});
	}
	if (!abortSession.ok) throw abortSession.error;
	const descendantError = descendantAbortError(descendants, "Parent run");
	if (descendantError) {
		respond(false, void 0, descendantError);
		return;
	}
	respondWithWorkerRuns(aborted ? [runId] : []);
}
async function handleChatAbortRequest(options) {
	await handleChatAbortRequestWithLifecycle(options);
}
//#endregion
export { handleChatAbortRequestWithLifecycle as n, handleChatAbortRequest as t };
