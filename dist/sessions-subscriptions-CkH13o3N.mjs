import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as APPROVALS_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { $i as validateSessionsMessagesUnsubscribeParams, Qi as validateSessionsMessagesSubscribeParams, Zi as validateSessionsListParams, ya as validateSessionsViewerPresenceSetParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { o as resolveSessionSubscriptionKey } from "./session-request-agent-Bxi11ET4.mjs";
import { n as resolveRequestedSessionStoreTarget } from "./session-store-key-Ci099tm9.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-CxCbIrod.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { g as sessionObserverScopeKey } from "./session-observer-model-DBd4UseX.mjs";
import { t as retainSessionScopedRead } from "./session-scoped-read-Byq5IuxM.mjs";
import { t as canAccessApprovalSession } from "./approval-record-lookup-C4cH7L-g.mjs";
import { r as canReviewOperatorApproval } from "./operator-approval-authorization-BCjW3avN.mjs";
import { o as requireSessionKey } from "./sessions-shared-CHxhVZeL.mjs";
import { n as sessionsListHandler } from "./sessions-read-CHvq_7_S.mjs";
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
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		if (p.includeApprovals === true && !canReviewOperatorApproval(client)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `sessions.messages.subscribe includeApprovals requires a paired device and gateway scope: ${APPROVALS_SCOPE}`));
			return;
		}
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionStoreTarget(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { agentId: requestedAgentId, sessionKey: canonicalKey } = requestedAgent.value;
		const subscriptionKey = resolveSessionSubscriptionKey(canonicalKey, requestedAgentId);
		let read;
		let prepared;
		try {
			mark?.("retainedReadAdmission");
			sessionMutationAuthorization?.assertCurrent();
			read = retainSessionScopedRead(options, canonicalKey, requestedAgentId, {
				allowMetadataChanges: true,
				requireMaterialized: readGatewayRequestMutationAuthority(options).sessionScope === "operator.sessions.read"
			});
			options.sessionMutationCommitGuard?.();
			if (connId) {
				mark?.("observerCommit");
				let approvalReplay;
				if (p.includeApprovals === true) {
					const rollbackSubscription = context.subscribeSessionMessageEvents(connId, subscriptionKey, {
						includeApprovals: true,
						provisional: true,
						mode: p.mode,
						subscriptionId: p.subscriptionId
					});
					try {
						mark?.("replayPreparation");
						prepared = await context.listSessionPendingApprovals?.(subscriptionKey, client);
						read?.assertCurrent();
						sessionMutationAuthorization?.assertCurrent();
						if (prepared && !prepared.isCurrent()) {
							prepared.release();
							prepared = await context.listSessionPendingApprovals?.(subscriptionKey, client);
							read?.assertCurrent();
							sessionMutationAuthorization?.assertCurrent();
						}
						if (prepared && !prepared.isCurrent()) throw new Error("session approval replay changed during preparation");
						mark?.("observerCommit");
						approvalReplay = prepared?.replay;
						read?.assertCurrent();
						sessionMutationAuthorization?.assertCurrent();
						if (client?.invalidated || signal?.aborted || hasCurrentClientAuthority?.() === false || !canReviewOperatorApproval(client) || !canAccessApprovalSession({
							cfg: context.getRuntimeConfig(),
							client,
							sessionKey: canonicalKey,
							agentId: requestedAgentId
						})) throw new Error("session approval replay authority is no longer active");
					} catch (error) {
						rollbackSubscription?.();
						context.logGateway.error(`session approval replay failed: ${String(error)}`);
						respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session approval replay unavailable"));
						return;
					}
					if (!approvalReplay) {
						rollbackSubscription?.();
						respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session approval replay unavailable"));
						return;
					}
					rollbackSubscription?.commit?.();
				} else {
					const rollback = context.subscribeSessionMessageEvents(connId, subscriptionKey, {
						provisional: true,
						mode: p.mode,
						subscriptionId: p.subscriptionId
					});
					try {
						read?.assertCurrent();
						sessionMutationAuthorization?.assertCurrent();
						rollback?.commit();
					} catch (error) {
						rollback?.();
						throw error;
					}
				}
				mark?.("response");
				respond(true, {
					subscribed: true,
					key: canonicalKey,
					agentId: requestedAgentId,
					...p.includeApprovals === true ? { approvalReplay } : {}
				}, void 0);
				return;
			}
			mark?.("response");
			respond(true, {
				subscribed: false,
				key: canonicalKey,
				agentId: requestedAgentId
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
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionStoreTarget(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { agentId: requestedAgentId, sessionKey: canonicalKey } = requestedAgent.value;
		const subscriptionKey = resolveSessionSubscriptionKey(canonicalKey, requestedAgentId);
		if (connId) context.unsubscribeSessionMessageEvents(connId, subscriptionKey, p.subscriptionId);
		respond(true, {
			subscribed: false,
			key: canonicalKey
		}, void 0);
	})
};
//#endregion
export { sessionSubscriptionHandlers };
