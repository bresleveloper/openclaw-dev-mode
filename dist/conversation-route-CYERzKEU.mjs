import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CUi_tcgF.mjs";
import { f as resolveThreadSessionKeys, p as sanitizeAgentId } from "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as getSessionBindingService } from "./session-binding-service-n2QTfkUE.mjs";
import { n as deriveLastRoutePolicy, o as resolveAgentRoute, t as buildAgentSessionKey } from "./resolve-route-zfKT6ZcU.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./routing-JKvWkBDR.mjs";
import { i as resolveRuntimeConversationBindingRoute, r as resolveConfiguredBindingRoute } from "./binding-routing-9358tp5c.mjs";
import "./conversation-runtime-BdU2H6Dm.mjs";
import { a as resolveDefaultTelegramAccountId } from "./accounts-ByNW1Cs3.mjs";
import { t as buildTelegramConversationId } from "./topic-conversation-BlxRQJEK.mjs";
import { C as shouldUseTelegramDmThreadSession, o as buildTelegramParentPeer } from "./helpers-TUQ5gNqR.mjs";
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
			id: resolveTelegramDirectPeerId({
				chatId: params.chatId,
				senderId: params.senderId
			})
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
function resolveTelegramConversationRouteWithRuntimePolicy(params, touchRuntimeBinding) {
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
	let bindingMode = configuredRoute.bindingResolution ? {
		kind: "configured",
		binding: configuredRoute.bindingResolution,
		sessionKey: configuredRoute.boundSessionKey ?? route.sessionKey
	} : { kind: "none" };
	const runtimeBindingConversationId = conversationId;
	const runtimeRoute = resolveRuntimeConversationBindingRoute({
		route,
		touchBinding: touchRuntimeBinding,
		conversation: {
			channel: "telegram",
			accountId: params.accountId,
			conversationId: runtimeBindingConversationId
		}
	});
	route = runtimeRoute.route;
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
function resolveTelegramConversationRoute(params) {
	return resolveTelegramConversationRouteWithRuntimePolicy(params, true);
}
/** Revalidates route ownership without extending runtime-binding liveness. */
function inspectTelegramConversationRoute(params) {
	return resolveTelegramConversationRouteWithRuntimePolicy(params, false);
}
/** Extend only the inspected binding after native command authorization. */
function touchTelegramConversationRoute(inspected) {
	const captured = inspected.runtimeBinding;
	if (!captured) return;
	const bindings = getSessionBindingService();
	const current = bindings.resolveByConversation(captured.conversation);
	if (!current || current.bindingId !== captured.bindingId || current.targetSessionKey !== captured.targetSessionKey || current.targetKind !== captured.targetKind || current.boundAt !== captured.boundAt || current.status !== captured.status) throw new Error("Telegram command route changed; send a new request.");
	bindings.touch(captured.bindingId, void 0, captured.conversation);
}
function resolveTelegramConversationBaseSessionKey(params) {
	return resolveTelegramNamedAccountBaseSessionKey(resolveDefaultTelegramAccountId(params.cfg), params);
}
function resolveTelegramTargetSession(params) {
	const baseSessionKey = resolveTelegramConversationBaseSessionKey(params);
	return (shouldUseTelegramDmThreadSession({
		dmThreadId: params.dmThreadId,
		botHasTopicsEnabled: params.botHasTopicsEnabled
	}) && params.dmThreadId != null ? resolveThreadSessionKeys({
		baseSessionKey,
		threadId: `${params.chatId}:${params.dmThreadId}`
	}) : null)?.sessionKey ?? baseSessionKey;
}
//#endregion
export { touchTelegramConversationRoute as a, resolveTelegramTargetSession as i, resolveTelegramConversationBaseSessionKey as n, resolveTelegramDirectPeerId as o, resolveTelegramConversationRoute as r, resolveTelegramSecurityDmRoute as s, inspectTelegramConversationRoute as t };
