import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as APPROVALS_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Bi as validateSessionsMessagesSubscribeParams, Vi as validateSessionsMessagesUnsubscribeParams, sa as validateSessionsViewerPresenceSetParams, zi as validateSessionsListParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveRequestedSessionAgentId, o as resolveSessionSubscriptionKey } from "./session-request-agent-DN7PUqhR.mjs";
import { i as resolveSessionStoreKey } from "./session-store-key-BoleEY7N.mjs";
import "./session-utils-AxixtEyo.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { h as sessionObserverScopeKey } from "./session-observer-model-0XwDKnYM.mjs";
import { r as canReviewOperatorApproval } from "./operator-approval-authorization-CRqUaNvq.mjs";
import { t as canAccessApprovalSession } from "./approval-record-lookup-jJszPHsp.mjs";
import { s as requireSessionKey } from "./sessions-shared-DPyHwOCR.mjs";
import { n as sessionsListHandler } from "./sessions-read-B_iB8pDV.mjs";
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
	"sessions.viewers.set": ({ params, client, context, respond }) => {
		if (!assertValidParams(params, validateSessionsViewerPresenceSetParams, "sessions.viewers.set", respond)) return;
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
			const requested = resolveRequestedSessionAgentId(cfg, trimmed, parseAgentSessionKey(trimmed) ? void 0 : params.agentId);
			if (!requested.ok) {
				respond(false, void 0, requested.error);
				return;
			}
			const canonicalKey = resolveSessionStoreKey({
				cfg,
				sessionKey: trimmed,
				storeAgentId: requested.agentId
			});
			canonicalKeys.push(sessionObserverScopeKey(canonicalKey, requested.agentId));
		}
		respond(true, { sessionKeys: declarations.replace(connId, canonicalKeys) }, void 0);
	},
	"sessions.messages.subscribe": async ({ params, client, context, respond, sessionMutationAuthorization, hasCurrentClientAuthority, signal }) => {
		if (!assertValidParams(params, validateSessionsMessagesSubscribeParams, "sessions.messages.subscribe", respond)) return;
		const connId = client?.connId?.trim();
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		if (p.includeApprovals === true && !canReviewOperatorApproval(client)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `sessions.messages.subscribe includeApprovals requires a paired device and gateway scope: ${APPROVALS_SCOPE}`));
			return;
		}
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const requestedAgentId = requestedAgent.agentId;
		const canonicalKey = resolveSessionStoreKey({
			cfg,
			sessionKey: key,
			storeAgentId: requestedAgentId
		});
		const subscriptionKey = resolveSessionSubscriptionKey(canonicalKey, requestedAgentId);
		if (connId) {
			let approvalReplay;
			if (p.includeApprovals === true) {
				const rollbackSubscription = context.subscribeSessionMessageEvents(connId, subscriptionKey, {
					includeApprovals: true,
					provisional: true
				});
				try {
					let prepared;
					do
						prepared = await context.listSessionPendingApprovals?.(subscriptionKey, client);
					while (prepared && !prepared.isCurrent());
					approvalReplay = prepared?.replay;
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
			} else context.subscribeSessionMessageEvents(connId, subscriptionKey);
			respond(true, {
				subscribed: true,
				key: canonicalKey,
				...p.includeApprovals === true ? { approvalReplay } : {}
			}, void 0);
			return;
		}
		respond(true, {
			subscribed: false,
			key: canonicalKey
		}, void 0);
	},
	"sessions.messages.unsubscribe": ({ params, client, context, respond }) => {
		if (!assertValidParams(params, validateSessionsMessagesUnsubscribeParams, "sessions.messages.unsubscribe", respond)) return;
		const connId = client?.connId?.trim();
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const requestedAgentId = requestedAgent.agentId;
		const canonicalKey = resolveSessionStoreKey({
			cfg,
			sessionKey: key,
			storeAgentId: requestedAgentId
		});
		const subscriptionKey = resolveSessionSubscriptionKey(canonicalKey, requestedAgentId);
		if (connId) context.unsubscribeSessionMessageEvents(connId, subscriptionKey);
		respond(true, {
			subscribed: false,
			key: canonicalKey
		}, void 0);
	}
};
//#endregion
export { sessionSubscriptionHandlers };
