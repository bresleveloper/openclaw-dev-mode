import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Di as validateSessionsGoalClearParams, Oi as validateSessionsGoalUpdateParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { g as SessionGoalOperationError, v as mutateSessionGoal } from "./session-accessor-C05KQ5A3.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { K as resolveSessionSharingTarget, et as gatewayClientSessionCreator, t as resolveSessionMutationAuthorization } from "./session-sharing-C_5FkkwM.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-BAwSgzgQ.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as fingerprintSessionGoalRequest, t as publishCommittedSessionGoalChange } from "./session-goal-change-BXGVTomZ.mjs";
//#region src/gateway/server-methods/sessions-goal.ts
async function handleSessionGoalMutation(options, request) {
	const { client, context, respond } = options;
	const method = request.action === "clear" ? "sessions.goal.clear" : "sessions.goal.update";
	try {
		const authorization = options.sessionMutationAuthorization ? {
			authorization: options.sessionMutationAuthorization,
			error: null
		} : resolveSessionMutationAuthorization({
			client,
			method,
			requestParams: request,
			context
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
		const target = resolveSessionSharingTarget({
			cfg,
			sessionKey: request.sessionKey,
			agentId: requestedAgent.agentId
		});
		if (!target || request.sessionId && target.entry.sessionId !== request.sessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session changed or was removed; refresh its Goal."));
			return;
		}
		const assertCurrent = () => {
			options.sessionMutationCommitGuard?.();
			authorization.authorization?.assertCurrent();
			const current = resolveSessionSharingTarget({
				cfg: context.getRuntimeConfig(),
				sessionKey: request.sessionKey,
				agentId: requestedAgent.agentId
			});
			if (!current || current.agentId !== target.agentId || current.storePath !== target.storePath || current.storeKey !== target.storeKey || current.entry.sessionId !== target.entry.sessionId || current.entry.lifecycleRevision !== target.entry.lifecycleRevision) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.INVALID_REQUEST, "Session changed before its Goal update; retry."));
			const ownershipError = resolvePluginSessionOwnershipError({
				action: "patch",
				entry: current.entry,
				key: current.canonicalKey,
				pluginOwnerId: client?.internal?.pluginRuntimeOwnerId
			});
			if (ownershipError) throw new SessionMutationAuthorizationChangedError(ownershipError);
		};
		assertCurrent();
		const identity = {
			operationId: request.operationId,
			issuedAtMs: request.issuedAtMs,
			requestFingerprint: fingerprintSessionGoalRequest({
				method,
				...request
			}),
			goalId: request.goalId
		};
		if (request.action === "resume") {
			const { handleSessionGoalResumeChat } = await import("./chat-send-handler-B4yY-iXs.mjs");
			await handleSessionGoalResumeChat({
				...options,
				sessionMutationAuthorization: {
					assertCurrent,
					assertTargetCurrent: assertCurrent
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
			assertCurrent
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
	}
}
const sessionGoalHandlers = {
	"sessions.goal.update": async (options) => {
		const { params, respond } = options;
		if (assertValidParams(params, validateSessionsGoalUpdateParams, "sessions.goal.update", respond)) await handleSessionGoalMutation(options, params);
	},
	"sessions.goal.clear": async (options) => {
		const { params, respond } = options;
		if (assertValidParams(params, validateSessionsGoalClearParams, "sessions.goal.clear", respond)) await handleSessionGoalMutation(options, {
			...params,
			action: "clear"
		});
	}
};
//#endregion
export { sessionGoalHandlers };
