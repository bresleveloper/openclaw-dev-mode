import { n as SessionGoalOperationError } from "./goals-operations.types-DnxMqPtA.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { a as captureExternalSessionCommitGuard, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { Ng as errorShape, ca as validateSessionsGoalUpdateParams, sa as validateSessionsGoalClearParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { t as mutateSessionGoal } from "./goals-operations-DPpmJyei.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DXWhtQve.mjs";
import { g as resolveSessionSharingTargetAsync } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as captureSessionSharingMemoryFacts } from "./session-sharing-incognito-DepuXzQy.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import "./session-sharing-DuL10izq.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
import { t as captureSessionEntryCurrentCheckAsyncInternal } from "./session-entry-current-check-Df7ye0eB.mjs";
import { t as fingerprintSessionGoalRequest } from "./session-goal-request-aWMiuDrs.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-D5Z0-DHb.mjs";
import { t as resolveSessionMutationAuthorizationAsync } from "./session-sharing-authorization-async-DhG3gR3C.mjs";
import { t as publishCommittedSessionGoalChange } from "./session-goal-change-P0SBPF2r.mjs";
//#region src/gateway/server-methods/sessions-goal.ts
async function handleSessionGoalMutation(options, request) {
	const { client, context, respond, sessionMutationAuthorization } = options;
	const method = request.action === "clear" ? "sessions.goal.clear" : "sessions.goal.update";
	let targetRead;
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const resolvedAuthorization = options.sessionMutationAuthorization ? {
				authorization: options.sessionMutationAuthorization,
				error: null
			} : await resolveSessionMutationAuthorizationAsync({
				client,
				method,
				requestParams: request,
				context
			});
			const authorization = _usingCtx$1.u({
				...resolvedAuthorization,
				[Symbol.dispose]: () => {
					if (!sessionMutationAuthorization) resolvedAuthorization.authorization?.release?.();
				}
			});
			if (authorization.error) {
				respond(false, void 0, authorization.error);
				return;
			}
			const cfg = context.getRuntimeConfig();
			const requestedAgent = resolveRequestedSessionAgentId(cfg, request.sessionKey, request.agentId);
			if (!requestedAgent.ok) {
				respond(false, void 0, requestedAgent.error);
				return;
			}
			const target = await resolveSessionSharingTargetAsync({
				cfg,
				sessionKey: request.sessionKey,
				agentId: requestedAgent.agentId
			});
			if (!target || request.sessionId && target.entry.sessionId !== request.sessionId) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session changed or was removed; refresh its Goal."));
				return;
			}
			const sessionChanged = () => new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.INVALID_REQUEST, "Session changed before its Goal update; retry."));
			const actorFacts = captureSessionSharingMemoryFacts({
				agentId: target.agentId,
				sessionKey: target.storeKey,
				resolved: target
			}, () => {
				if (options.hasCurrentClientAuthority?.() === false) throw sessionChanged();
				options.sessionMutationCommitGuard?.();
				options.signal?.throwIfAborted();
			}, false);
			if (!actorFacts && !isIncognitoSessionKey(target.canonicalKey)) targetRead = await captureSessionEntryCurrentCheckAsyncInternal({
				agentId: target.agentId,
				sessionKey: target.storeKey,
				storePath: target.storePath,
				fields: ["pluginOwnerId"],
				errorMessage: "Session changed before its Goal update; retry."
			});
			const assertRouting = captureSessionMutationRouting(cfg, sessionChanged, [request]);
			const assertTarget = (current) => {
				if (!current || current.agentId !== target.agentId || current.storePath !== target.storePath || current.storeKey !== target.storeKey || current.entry.sessionId !== target.entry.sessionId || current.entry.lifecycleRevision !== target.entry.lifecycleRevision) throw sessionChanged();
				const ownershipError = resolvePluginSessionOwnershipError({
					action: "patch",
					entry: current.entry,
					key: current.canonicalKey,
					pluginOwnerId: client?.internal?.pluginRuntimeOwnerId
				});
				if (ownershipError) throw new SessionMutationAuthorizationChangedError(ownershipError);
			};
			const assertCurrent = () => {
				options.sessionMutationCommitGuard?.();
				authorization.authorization?.assertCurrent();
				if (!actorFacts) assertRouting(context.getRuntimeConfig());
				targetRead?.source.assertScopeCurrent?.();
				assertTarget(actorFacts ? actorFacts.readCurrent().target : targetRead ? targetRead.entry ? {
					...target,
					entry: targetRead.entry
				} : null : null);
			};
			if (!actorFacts) assertCurrent();
			const source = targetRead ? composeSessionSourceAssertion([
				targetRead.source,
				captureExternalSessionCommitGuard(options.sessionMutationCommitGuard),
				captureExternalSessionCommitGuard(authorization.authorization?.assertCurrent)
			], (assertSources) => {
				assertSources();
				assertCurrent();
			}) : Object.assign(assertCurrent, { async prepareSessionSource() {
				return {
					assertCurrent,
					checks: []
				};
			} });
			const identity = {
				operationId: request.operationId,
				issuedAtMs: request.issuedAtMs,
				requestFingerprint: await fingerprintSessionGoalRequest({
					method,
					...request
				}),
				goalId: request.goalId
			};
			if (!actorFacts) assertCurrent();
			if (request.action === "resume") {
				const { handleSessionGoalResumeChat } = await import("./chat-send-handler-DDgslroc.mjs");
				await handleSessionGoalResumeChat({
					...options,
					sessionMutationAuthorization: {
						assertCurrent: source,
						assertTargetCurrent: source
					},
					params: {
						sessionKey: target.canonicalKey,
						agentId: target.agentId,
						sessionId: target.entry.sessionId,
						message: request.note ? `Continue pursuing the current goal.\nOperator note: ${request.note}` : "Continue pursuing the current goal.",
						idempotencyKey: request.operationId,
						deliver: false
					}
				}, {
					...identity,
					action: "resume",
					...request.note ? { note: request.note } : {}
				});
				return;
			}
			const operation = request.action === "edit" ? {
				...identity,
				action: "edit",
				objective: request.objective
			} : {
				...identity,
				action: request.action,
				..."note" in request && request.note ? { note: request.note } : {}
			};
			const committed = await mutateSessionGoal({
				agentId: target.agentId,
				sessionKey: target.storeKey,
				storePath: target.storePath,
				expectedSessionId: target.entry.sessionId,
				operation,
				assertCurrent: source
			});
			if (!committed.replayed && committed.sessionEntry) await publishCommittedSessionGoalChange(context, {
				sessionKey: target.canonicalKey,
				agentId: target.agentId,
				entry: committed.sessionEntry,
				actor: gatewayClientSessionCreator(client),
				summary: `goal ${request.action}`
			});
			respond(true, {
				...committed.result,
				...committed.replayed ? { replayed: true } : {}
			}, void 0);
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	} catch (error) {
		if (error instanceof SessionMutationAuthorizationChangedError) respond(false, void 0, error.error);
		else if (error instanceof SessionGoalOperationError) respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: {
			code: "GOAL_OPERATION_REJECTED",
			reason: error.code
		} }));
		else {
			context.logGateway.warn(`Goal update failed: ${String(error)}`);
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Unable to update the Goal; retry the request."));
		}
	} finally {
		targetRead?.release();
	}
}
const sessionGoalHandlers = {
	"sessions.goal.update": defineValidatedGatewayHandler("sessions.goal.update", validateSessionsGoalUpdateParams, (options) => handleSessionGoalMutation(options, options.params)),
	"sessions.goal.clear": defineValidatedGatewayHandler("sessions.goal.clear", validateSessionsGoalClearParams, (options) => handleSessionGoalMutation(options, {
		...options.params,
		action: "clear"
	}))
};
//#endregion
export { sessionGoalHandlers };
