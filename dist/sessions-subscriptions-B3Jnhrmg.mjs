import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { Ng as errorShape, Va as validateSessionsViewerPresenceSetParams, ba as validateSessionsMessagesSubscribeParams, xa as validateSessionsMessagesUnsubscribeParams, ya as validateSessionsListParams } from "./src-pLJQA6J5.mjs";
import { n as APPROVALS_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { c as resolveSessionSubscriptionKey } from "./session-request-agent-ByGzV8Af.mjs";
import { r as resolveRequestedSessionStoreTarget } from "./session-store-key-DKpto8R6.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { h as sessionObserverScopeKey } from "./session-observer-model-C1LFMGG7.mjs";
import { t as retainSessionScopedRead } from "./session-scoped-read-COi00Wg4.mjs";
import { i as prepareApprovalSessionAccess } from "./approval-record-lookup-KFM8XG5s.mjs";
import { r as canReviewOperatorApproval } from "./operator-approval-authorization-C9wV2RU-.mjs";
import { a as requireSessionKey } from "./sessions-shared-DECO-QN2.mjs";
import { n as sessionsListHandler } from "./sessions-read-nsRP28GZ.mjs";
//#region src/gateway/server-methods/sessions-subscriptions.ts
const sessionSubscriptionHandlers = {
	"sessions.subscribe": async (options) => {
		const { client, context, params, respond } = options;
		if (!assertValidParams(params, validateSessionsListParams, "sessions.subscribe", respond)) return;
		const connId = client?.connId?.trim();
		if (connId) context.subscribeSessionEvents(connId);
		if (!connId || Object.keys(params).length === 0) {
			respond(true, { subscribed: Boolean(connId) }, void 0);
			return;
		}
		await sessionsListHandler({
			...options,
			params,
			respond: (ok, payload, error, meta) => {
				respond(ok, ok ? {
					subscribed: true,
					list: payload
				} : void 0, error, meta);
			}
		});
	},
	"sessions.viewers.set": defineValidatedGatewayHandler("sessions.viewers.set", validateSessionsViewerPresenceSetParams, ({ params, client, context, respond }) => {
		const connId = client?.connId?.trim();
		const declarations = context.sessionViewerPresence;
		if (!connId || !declarations) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session viewer presence unavailable"));
			return;
		}
		const cfg = context.getRuntimeConfig();
		const canonicalKeys = [];
		for (const rawKey of params.sessionKeys) {
			const trimmed = rawKey.trim();
			if (!trimmed) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid sessions.viewers.set params"));
				return;
			}
			const requested = resolveRequestedSessionStoreTarget(cfg, trimmed, parseAgentSessionKey(trimmed) ? void 0 : params.agentId);
			if (!requested.ok) {
				respond(false, void 0, requested.error);
				return;
			}
			canonicalKeys.push(sessionObserverScopeKey(requested.value.sessionKey, requested.value.agentId));
		}
		respond(true, { sessionKeys: declarations.replace(connId, canonicalKeys) }, void 0);
	}),
	"sessions.messages.subscribe": defineValidatedGatewayHandler("sessions.messages.subscribe", validateSessionsMessagesSubscribeParams, async (options) => {
		const { params, client, context, respond, sessionMutationAuthorization, hasCurrentClientAuthority, signal, markSessionSubscribePhase: mark } = options;
		const connId = client?.connId?.trim();
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		if (params.includeApprovals === true && !canReviewOperatorApproval(client)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `sessions.messages.subscribe includeApprovals requires a paired device and gateway scope: ${APPROVALS_SCOPE}`));
			return;
		}
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionStoreTarget(cfg, key, params.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { agentId: requestedAgentId, sessionKey: canonicalKey } = requestedAgent.value;
		const subscriptionKey = resolveSessionSubscriptionKey(canonicalKey, requestedAgentId);
		let read;
		let prepared;
		let approvalReplay;
		try {
			mark?.("retainedReadAdmission");
			sessionMutationAuthorization?.assertCurrent();
			read = await retainSessionScopedRead(options, canonicalKey, requestedAgentId, {
				allowMetadataChanges: true,
				requireMaterialized: readGatewayRequestMutationAuthority(options).sessionScope === "operator.sessions.read"
			});
			options.sessionMutationCommitGuard?.();
			if (connId) {
				mark?.("observerCommit");
				const includeApprovals = params.includeApprovals === true;
				const rollback = context.subscribeSessionMessageEvents(connId, subscriptionKey, {
					...includeApprovals ? { includeApprovals: true } : {},
					provisional: true,
					mode: params.mode,
					subscriptionId: params.subscriptionId
				});
				const respondReplayUnavailable = () => respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session approval replay unavailable"));
				try {
					if (includeApprovals) try {
						var _usingCtx$1 = _usingCtx();
						const sessionAccess = _usingCtx$1.u(await prepareApprovalSessionAccess({
							client,
							getCfg: context.getRuntimeConfig,
							sources: [{
								sessionKey: canonicalKey,
								agentId: requestedAgentId
							}]
						}));
						read?.assertCurrent();
						sessionMutationAuthorization?.assertCurrent();
						mark?.("replayPreparation");
						prepared = await context.listSessionPendingApprovals?.(subscriptionKey, client);
						if (prepared && !prepared.isCurrent()) {
							read?.assertCurrent();
							sessionMutationAuthorization?.assertCurrent();
							prepared.release();
							prepared = await context.listSessionPendingApprovals?.(subscriptionKey, client);
						}
						if (prepared && !prepared.isCurrent()) throw new Error("session approval replay changed during preparation");
						mark?.("observerCommit");
						approvalReplay = prepared?.replay;
						read?.assertCurrent();
						sessionMutationAuthorization?.assertCurrent();
						if (client?.invalidated || signal?.aborted || hasCurrentClientAuthority?.() === false || !canReviewOperatorApproval(client) || !sessionAccess.canAccess({
							sessionKey: canonicalKey,
							agentId: requestedAgentId
						})) throw new Error("session approval replay authority is no longer active");
					} catch (_) {
						_usingCtx$1.e = _;
					} finally {
						_usingCtx$1.d();
					}
					else {
						read?.assertCurrent();
						sessionMutationAuthorization?.assertCurrent();
						rollback?.commit();
					}
				} catch (error) {
					rollback?.();
					if (!includeApprovals) throw error;
					context.logGateway.error(`session approval replay failed: ${String(error)}`);
					respondReplayUnavailable();
					return;
				}
				if (includeApprovals) {
					if (!approvalReplay) {
						rollback?.();
						respondReplayUnavailable();
						return;
					}
					rollback?.commit?.();
				}
			}
			mark?.("response");
			respond(true, {
				subscribed: Boolean(connId),
				key: canonicalKey,
				agentId: requestedAgentId,
				...connId && params.includeApprovals === true ? { approvalReplay } : {}
			}, void 0);
		} catch (error) {
			if (!(error instanceof SessionMutationAuthorizationChangedError)) throw error;
			respond(false, void 0, error.error);
		} finally {
			mark?.("cleanup");
			prepared?.release();
			read?.release();
		}
	}),
	"sessions.messages.unsubscribe": defineValidatedGatewayHandler("sessions.messages.unsubscribe", validateSessionsMessagesUnsubscribeParams, ({ params, client, context, respond }) => {
		const connId = client?.connId?.trim();
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionStoreTarget(cfg, key, params.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { agentId: requestedAgentId, sessionKey: canonicalKey } = requestedAgent.value;
		const subscriptionKey = resolveSessionSubscriptionKey(canonicalKey, requestedAgentId);
		if (connId) context.unsubscribeSessionMessageEvents(connId, subscriptionKey, params.subscriptionId);
		respond(true, {
			subscribed: false,
			key: canonicalKey
		}, void 0);
	})
};
//#endregion
export { sessionSubscriptionHandlers };
