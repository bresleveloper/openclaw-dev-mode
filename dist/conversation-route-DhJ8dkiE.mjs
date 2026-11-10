import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as buildAgentMainSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { f as resolveThreadSessionKeys, p as sanitizeAgentId } from "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { n as deriveLastRoutePolicy, o as resolveAgentRoute, t as buildAgentSessionKey } from "./resolve-route-DvaXhzgP.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { t as getSessionBindingService } from "./session-binding-service-ByKk9LiJ.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import "./routing-Dl7FngGa.mjs";
import { a as resolveRuntimeConversationBindingRouteAsync, n as inspectRuntimeConversationBindingRoute, r as resolveConfiguredBindingRoute } from "./binding-routing-BQzw9Xlb.mjs";
import "./conversation-binding-runtime-Dk-K_XqC.mjs";
import { r as resolveDefaultTelegramAccountId } from "./accounts-CHcpIFN8.mjs";
import { t as buildTelegramConversationId } from "./topic-conversation-S0gZB4iY.mjs";
import { o as buildTelegramParentPeer, x as shouldUseTelegramDmThreadSession } from "./helpers-amKpwD-6.mjs";
//#region extensions/telegram/src/dm-session-key.ts
function resolveTelegramDirectPeerId(params) {
	return (params.senderId == null ? "" : String(params.senderId).trim()) || String(params.chatId);
}
function resolveTelegramNamedAccountBaseSessionKey(defaultAccountId, params) {
	if (!(normalizeAccountId(params.route.accountId) !== normalizeAccountId(defaultAccountId) && params.route.matchedBy === "default") || params.isGroup) return params.route.sessionKey;
	return buildAgentSessionKey({
		agentId: params.route.agentId,
		channel: "telegram",
		accountId: params.route.accountId,
		peer: {
			kind: "direct",
			id: resolveTelegramDirectPeerId(params)
		},
		dmScope: "per-account-channel-peer",
		identityLinks: params.cfg.session?.identityLinks
	});
}
function resolveTelegramSecurityDmRoute(defaultAccountId, params) {
	if (params.principalId !== void 0) return { sessionKey: resolveTelegramNamedAccountBaseSessionKey(defaultAccountId, {
		...params,
		chatId: params.principalId,
		isGroup: false,
		senderId: params.principalId
	}) };
	if (normalizeAccountId(params.accountId) !== normalizeAccountId(defaultAccountId) && params.route.matchedBy === "default" || params.route.dmScope === "per-account-channel-peer") return { kind: "isolated" };
	return params.route.dmScope === "main" ? { sessionKey: params.route.sessionKey } : { kind: "core" };
}
//#endregion
//#region extensions/telegram/src/conversation-route.ts
function prepareTelegramConversationRoute(params) {
	const resolvedThreadId = params.threadSpec.id;
	const conversationId = buildTelegramConversationId({
		chatId: params.chatId,
		thread: params.threadSpec
	});
	const peerId = params.isGroup ? conversationId : resolveTelegramDirectPeerId({
		chatId: params.chatId,
		senderId: params.senderId
	});
	const parentPeer = buildTelegramParentPeer({
		isGroup: params.isGroup,
		resolvedThreadId,
		chatId: params.chatId
	});
	let route = resolveAgentRoute({
		cfg: params.cfg,
		channel: "telegram",
		accountId: params.accountId,
		peer: {
			kind: params.isGroup ? "group" : "direct",
			id: peerId
		},
		parentPeer
	});
	const rawTopicAgentId = params.topicAgentId?.trim();
	if (rawTopicAgentId) {
		const topicAgentId = sanitizeAgentId(rawTopicAgentId);
		const sessionKey = normalizeLowercaseStringOrEmpty(buildAgentSessionKey({
			agentId: topicAgentId,
			mainKey: params.cfg.session?.mainKey,
			channel: "telegram",
			accountId: params.accountId,
			peer: {
				kind: params.isGroup ? "group" : "direct",
				id: peerId
			},
			dmScope: route.dmScope,
			groupScope: route.groupScope,
			identityLinks: params.cfg.session?.identityLinks
		}));
		const mainSessionKey = normalizeLowercaseStringOrEmpty(buildAgentMainSessionKey({
			agentId: topicAgentId,
			mainKey: params.cfg.session?.mainKey
		}));
		route = {
			...route,
			agentId: topicAgentId,
			sessionKey,
			mainSessionKey,
			lastRoutePolicy: deriveLastRoutePolicy({
				sessionKey,
				mainSessionKey
			})
		};
		logVerbose(`telegram: topic route override: topic=${resolvedThreadId} agent=${topicAgentId} sessionKey=${route.sessionKey}`);
	}
	const configuredRoute = resolveConfiguredBindingRoute({
		cfg: params.cfg,
		route,
		conversation: {
			channel: "telegram",
			accountId: params.accountId,
			conversationId: params.isGroup ? conversationId : peerId,
			parentConversationId: conversationId !== String(params.chatId) || params.isGroup ? String(params.chatId) : void 0
		}
	});
	route = configuredRoute.route;
	const bindingMode = configuredRoute.bindingResolution ? {
		kind: "configured",
		binding: configuredRoute.bindingResolution,
		sessionKey: configuredRoute.boundSessionKey ?? route.sessionKey
	} : { kind: "none" };
	return {
		route,
		bindingMode,
		conversation: {
			channel: "telegram",
			accountId: params.accountId,
			conversationId
		}
	};
}
function applyTelegramRuntimeRoute(prepared, runtimeRoute) {
	const route = runtimeRoute.route;
	let bindingMode = prepared.bindingMode;
	const runtimeBindingConversationId = prepared.conversation.conversationId;
	if (runtimeRoute.bindingRecord) {
		bindingMode = runtimeRoute.boundSessionKey ? {
			kind: "runtime-bound",
			sessionKey: runtimeRoute.boundSessionKey
		} : {
			kind: "plugin-owned-runtime",
			pluginId: runtimeRoute.pluginId ?? ""
		};
		logVerbose(runtimeRoute.boundSessionKey ? `telegram: routed via bound conversation ${runtimeBindingConversationId} -> ${runtimeRoute.boundSessionKey}` : `telegram: plugin-bound conversation ${runtimeBindingConversationId}`);
	}
	return {
		route,
		bindingMode,
		bindingOwnerAvailable: runtimeRoute.bindingOwnerAvailable ?? true,
		...runtimeRoute.bindingRecord ? { runtimeBinding: {
			...runtimeRoute.bindingRecord,
			conversation: { ...runtimeRoute.bindingRecord.conversation }
		} } : {}
	};
}
async function resolveTelegramConversationRoute(params) {
	const prepared = prepareTelegramConversationRoute(params);
	return applyTelegramRuntimeRoute(prepared, await resolveRuntimeConversationBindingRouteAsync(prepared));
}
/** Prepare route policy once; the supplied binding facts are checked at the effect. */
function prepareTelegramConversationRouteInspection(params) {
	const prepared = prepareTelegramConversationRoute(params);
	return {
		conversation: prepared.conversation,
		resolve(inspection) {
			return applyTelegramRuntimeRoute(prepared, inspectRuntimeConversationBindingRoute({
				route: prepared.route,
				inspection
			}));
		}
	};
}
async function inspectTelegramConversationRouteAsync(params) {
	const prepared = prepareTelegramConversationRoute(params);
	return applyTelegramRuntimeRoute(prepared, await resolveRuntimeConversationBindingRouteAsync({
		...prepared,
		touchBinding: false
	}));
}
/** Extend only the inspected binding after native command authorization. */
async function touchTelegramConversationRoute(inspected) {
	const captured = inspected.runtimeBinding;
	if (!captured) return;
	await getSessionBindingService().touchAsync(captured.bindingId, void 0, captured.conversation);
}
function resolveTelegramConversationBaseSessionKey(params) {
	return resolveTelegramNamedAccountBaseSessionKey(resolveDefaultTelegramAccountId(params.cfg), params);
}
function resolveTelegramTargetSession(params) {
	const baseSessionKey = resolveTelegramConversationBaseSessionKey(params);
	return shouldUseTelegramDmThreadSession(params) && params.dmThreadId != null ? resolveThreadSessionKeys({
		baseSessionKey,
		threadId: `${params.chatId}:${params.dmThreadId}`
	}).sessionKey : baseSessionKey;
}
/** Route inbound DM-topic and named-account traffic to the same session as its messages. */
function applyTelegramTargetSession(params) {
	const sessionKey = resolveTelegramTargetSession(params);
	return {
		...params.route,
		sessionKey,
		lastRoutePolicy: deriveLastRoutePolicy({
			sessionKey,
			mainSessionKey: params.route.mainSessionKey
		})
	};
}
//#endregion
export { resolveTelegramConversationRoute as a, resolveTelegramDirectPeerId as c, resolveTelegramConversationBaseSessionKey as i, resolveTelegramSecurityDmRoute as l, inspectTelegramConversationRouteAsync as n, resolveTelegramTargetSession as o, prepareTelegramConversationRouteInspection as r, touchTelegramConversationRoute as s, applyTelegramTargetSession as t };
