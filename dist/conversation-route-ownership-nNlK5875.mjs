import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { n as normalizeRouteBindingId } from "./binding-scope-uGqaW78p.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
import { n as getGlobalPluginRegistry } from "./hook-runner-global-eJIIEpha.mjs";
import { n as parseConversationRouteContext } from "./conversation-route-context-ulGSQNwr.mjs";
import { n as getLoadedChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-Diy-VQKA.mjs";
import { n as pinConversationDatabaseScope, o as resolveConversation } from "./conversation-registry-CcMjrJ1T.mjs";
import { d as getConversationDeliveryOperation } from "./delivery-completion-D_UNTyTR.mjs";
import { i as listRouteBindings } from "./bindings-Cw_QSeBA.mjs";
import { c as peerKindMatches, o as resolveAgentRoute } from "./resolve-route-Bzb6opva.mjs";
import { i as resolveRuntimeConversationBindingRoute, r as resolveConfiguredBindingRoute } from "./binding-routing-ChYMkaX4.mjs";
//#region src/gateway/conversation-errors.ts
/** Terminal caller/input failure for Gateway-owned conversation operations. */
var ConversationInputError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ConversationInputError";
	}
};
/** Durable operation id already belongs to a different request identity. */
var ConversationOperationConflictError = class extends ConversationInputError {
	constructor(message) {
		super(message);
		this.name = "ConversationOperationConflictError";
	}
};
//#endregion
//#region src/config/sessions/conversation-route-fingerprint.ts
/** Binds queued authority to the exact route facts admitted by the Gateway. */
function resolveConversationRouteFingerprint(route) {
	const context = route.routeContext ? parseConversationRouteContext(route.routeContext) : void 0;
	return sha256Hex(JSON.stringify([
		route.channel,
		route.accountId,
		route.kind,
		route.peerId,
		route.target,
		route.parentConversationRef ?? null,
		route.threadId ?? null,
		route.nativeChannelId ?? null,
		route.nativeDirectUserId ?? null,
		route.routeContextObserved === true,
		context ?? null
	]));
}
//#endregion
//#region src/gateway/conversation-route-ownership.ts
function hasActivePluginClaimOwner(pluginId) {
	return getGlobalPluginRegistry()?.typedHooks.some((hook) => hook.pluginId === pluginId && hook.hookName === "inbound_claim") === true;
}
function resolvePluginRouteOwner(config, conversation) {
	const channelId = normalizeAnyChannelId(conversation.channel);
	const resolver = channelId ? getLoadedChannelPlugin(channelId)?.messaging?.resolveConversationRouteOwner : void 0;
	if (!resolver) return;
	try {
		const owner = resolver({
			cfg: config,
			accountId: normalizeAccountId(conversation.accountId),
			conversation: {
				kind: conversation.kind,
				peerId: conversation.peerId,
				target: conversation.target,
				...conversation.threadId ? { threadId: conversation.threadId } : {},
				...conversation.nativeChannelId ? { nativeChannelId: conversation.nativeChannelId } : {},
				...conversation.routeContext ? { context: conversation.routeContext } : {}
			}
		});
		if (owner === void 0) return;
		if (owner === null) return { kind: "available" };
		if (owner.kind === "unavailable") return owner;
		if (owner.kind === "plugin") return hasActivePluginClaimOwner(owner.pluginId) ? { kind: "available" } : {
			kind: "available",
			agentId: normalizeAgentId(owner.fallbackAgentId)
		};
		return {
			kind: "available",
			agentId: normalizeAgentId(owner.agentId)
		};
	} catch (error) {
		if (error instanceof AgentSelectionRequiredError) return { kind: "available" };
		throw error;
	}
}
function resolveConfiguredRouteOwner(config, conversation, context) {
	try {
		return resolveAgentRoute({
			cfg: config,
			channel: conversation.channel,
			accountId: conversation.accountId,
			peer: {
				kind: conversation.kind,
				id: conversation.peerId
			},
			...context?.parentPeerId && conversation.kind !== "direct" ? { parentPeer: {
				kind: conversation.kind,
				id: context.parentPeerId
			} } : {},
			...context?.guildId ? { guildId: context.guildId } : {},
			...context?.teamId ? { teamId: context.teamId } : {},
			...context?.memberRoleIds ? { memberRoleIds: context.memberRoleIds } : {}
		});
	} catch (error) {
		if (error instanceof AgentSelectionRequiredError) return;
		throw error;
	}
}
function resolveGenericRouteOwner(params) {
	const conversation = {
		channel: params.conversation.channel,
		accountId: normalizeAccountId(params.conversation.accountId),
		conversationId: params.conversation.peerId,
		...params.context?.parentPeerId ? { parentConversationId: params.context.parentPeerId } : {}
	};
	const configured = resolveConfiguredBindingRoute({
		cfg: params.config,
		route: params.route,
		conversation
	});
	const runtime = resolveRuntimeConversationBindingRoute({
		route: configured.route,
		conversation,
		touchBinding: false
	});
	if (runtime.bindingOwnerAvailable === false) return { kind: "unavailable" };
	if (runtime.pluginId && hasActivePluginClaimOwner(runtime.pluginId)) return { kind: "available" };
	return {
		kind: "available",
		agentId: normalizeAgentId(runtime.route.agentId)
	};
}
function bindingPeerCouldMatchConversation(binding, conversation) {
	const peer = binding.match.peer;
	if (!peer) return true;
	const kind = normalizeChatType(peer.kind);
	const id = normalizeRouteBindingId(peer.id);
	if (!kind || !id) return false;
	return peerKindMatches(kind, conversation.kind) && (id === "*" || id === conversation.peerId);
}
function hasUnrecordedContextualBinding(params) {
	const channel = normalizeLowercaseStringOrEmpty(params.conversation.channel);
	const accountId = normalizeAccountId(params.conversation.accountId);
	const hasThreadContext = Boolean(params.conversation.parentConversationRef || params.conversation.threadId);
	const hasGuildContext = params.conversation.kind === "channel";
	return listRouteBindings(params.config).some((binding) => {
		const pattern = binding.match.accountId?.trim() ?? "";
		return Boolean(hasGuildContext && normalizeRouteBindingId(binding.match.guildId) || normalizeRouteBindingId(binding.match.teamId) || hasGuildContext && binding.match.roles?.length || hasThreadContext && binding.match.peer?.kind !== "direct" && normalizeRouteBindingId(binding.match.peer?.id)) && normalizeAgentId(binding.agentId) !== params.resolvedAgentId && normalizeLowercaseStringOrEmpty(binding.match.channel) === channel && (pattern === "*" || normalizeAccountId(pattern) === accountId) && bindingPeerCouldMatchConversation(binding, params.conversation);
	});
}
/** Replays current configured and plugin-owned routing for a persisted conversation address. */
function resolveConversationRouteEligibilityForAgent(params) {
	const requestedAgentId = normalizeAgentId(params.agentId);
	const hasObservedContext = Boolean(params.conversation.routeContextObserved || params.conversation.routeContext);
	let owner = resolvePluginRouteOwner(params.config, params.conversation);
	if (!owner) {
		const route = resolveConfiguredRouteOwner(params.config, params.conversation, params.conversation.routeContext);
		if (!route) return "denied";
		owner = resolveGenericRouteOwner({
			config: params.config,
			conversation: params.conversation,
			route,
			...params.conversation.routeContext ? { context: params.conversation.routeContext } : {}
		});
	}
	if (owner.kind === "unavailable") return "unavailable";
	if (owner.agentId !== requestedAgentId) return "denied";
	return !hasObservedContext && hasUnrecordedContextualBinding({
		config: params.config,
		conversation: params.conversation,
		resolvedAgentId: owner.agentId
	}) ? "denied" : "eligible";
}
/** Enforces current route ownership at a Gateway request boundary. */
function assertConversationRouteEligibleForAgent(params) {
	const eligibility = resolveConversationRouteEligibilityForAgent(params);
	if (eligibility === "eligible") return;
	if (eligibility === "denied") throw new ConversationInputError(`Conversation is not available to this agent: ${params.conversation.conversationRef}`);
	throw new Error(`Conversation ownership is temporarily unavailable: ${params.conversation.conversationRef}`);
}
function assertConversationDeliveryAttemptAuthorized(params) {
	const conversation = resolveConversation(params.scope, params.conversationRef);
	if (!conversation || resolveConversationRouteFingerprint(conversation) !== params.expectedRouteFingerprint || params.expectedSessionId !== void 0 && conversation.sessionId !== params.expectedSessionId || params.expectedSessionKey !== void 0 && conversation.sessionKey !== params.expectedSessionKey) throw new PlatformMessageNotDispatchedError(`Conversation is no longer available to this agent: ${params.conversationRef}`, {
		cause: void 0,
		retryable: false
	});
	const eligibility = resolveConversationRouteEligibilityForAgent({
		config: params.config,
		agentId: params.agentId,
		conversation
	});
	if (eligibility === "eligible") return;
	throw new PlatformMessageNotDispatchedError(eligibility === "unavailable" ? `Conversation ownership is temporarily unavailable: ${params.conversationRef}` : `Conversation is no longer available to this agent: ${params.conversationRef}`, {
		cause: void 0,
		retryable: eligibility === "unavailable"
	});
}
async function assertQueuedConversationDeliveryAttemptAuthorized(params, capturedScope) {
	const { scope } = pinConversationDatabaseScope(capturedScope);
	const operation = await getConversationDeliveryOperation(scope, params.operationId);
	if (!operation) throw new PlatformMessageNotDispatchedError(`Conversation delivery operation no longer exists: ${params.operationId}`, {
		cause: void 0,
		retryable: false
	});
	assertConversationDeliveryAttemptAuthorized({
		config: params.readCurrentConfig(),
		agentId: scope.agentId,
		conversationRef: operation.conversationRef,
		expectedRouteFingerprint: params.routeFingerprint,
		scope
	});
}
//#endregion
export { resolveConversationRouteFingerprint as a, resolveConversationRouteEligibilityForAgent as i, assertConversationRouteEligibleForAgent as n, ConversationInputError as o, assertQueuedConversationDeliveryAttemptAuthorized as r, ConversationOperationConflictError as s, assertConversationDeliveryAttemptAuthorized as t };
