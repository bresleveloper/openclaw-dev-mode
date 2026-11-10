import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { n as normalizeRouteBindingId } from "./binding-scope-BXbuNO3g.mjs";
import { n as getLoadedChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import { a as assertConversationAuthority } from "./conversation-delivery-policy-BttgDEjN.mjs";
import { i as listRouteBindings } from "./bindings-Cw_QSeBA.mjs";
import { r as getGlobalPluginRegistry } from "./hook-runner-global-yjqy4fXI.mjs";
import { c as peerKindMatches, o as resolveAgentRoute } from "./resolve-route-DvaXhzgP.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-ChQJdCfP.mjs";
import { i as readConversation, l as withConversationAuthority } from "./conversation-registry-DdNx9ZQ8.mjs";
import { r as getConversationDeliveryOperation } from "./conversation-delivery-store-O6xnH1gE.mjs";
import { s as prepareSessionBindingInspections } from "./session-binding-service-ByKk9LiJ.mjs";
import { n as inspectRuntimeConversationBindingRoute, r as resolveConfiguredBindingRoute } from "./binding-routing-BQzw9Xlb.mjs";
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
//#region src/gateway/conversation-route-ownership.ts
function hasActivePluginClaimOwner(pluginId) {
	return getGlobalPluginRegistry()?.typedHooks.some((hook) => hook.pluginId === pluginId && hook.hookName === "inbound_claim") === true;
}
function pluginRouteOwnerInput(config, conversation) {
	return {
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
	};
}
function resolvePluginRouteOwner(config, conversation, preparedResolver) {
	const channelId = normalizeAnyChannelId(conversation.channel);
	const resolver = preparedResolver ?? (channelId ? getLoadedChannelPlugin(channelId)?.messaging?.resolveConversationRouteOwner : void 0);
	if (!resolver) return;
	if (!preparedResolver) warnPluginSdkDeprecation({
		family: "conversation-route-ownership",
		method: "ChannelMessagingAdapter.resolveConversationRouteOwner",
		replacement: "ChannelMessagingAdapter.prepareConversationRouteOwnersAsync"
	});
	try {
		const owner = resolver(pluginRouteOwnerInput(config, conversation));
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
function prepareGenericRoute(params) {
	const conversation = {
		channel: params.conversation.channel,
		accountId: normalizeAccountId(params.conversation.accountId),
		conversationId: params.conversation.peerId,
		...params.context?.parentPeerId ? { parentConversationId: params.context.parentPeerId } : {}
	};
	return {
		conversation,
		route: resolveConfiguredBindingRoute({
			cfg: params.config,
			route: params.route,
			conversation
		}).route
	};
}
function resolveInspectedGenericRouteOwner(route, inspection) {
	const runtime = inspectRuntimeConversationBindingRoute({
		route,
		inspection
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
function finishRouteEligibility(params, owner) {
	if (owner.kind === "unavailable") return "unavailable";
	if (owner.agentId !== normalizeAgentId(params.agentId)) return "denied";
	return !params.conversation.routeContextObserved && !params.conversation.routeContext && hasUnrecordedContextualBinding({
		config: params.config,
		conversation: params.conversation,
		resolvedAgentId: owner.agentId
	}) ? "denied" : "eligible";
}
/** Prepare native reads once; effect callbacks only consume owner-held facts and receipt invalidation. */
async function prepareConversationRouteEligibilitiesForAgent(params) {
	const inputs = params.conversations.map((conversation) => ({
		config: params.config,
		agentId: params.agentId,
		conversation
	}));
	const releases = [];
	const inspectBindings = async (refs) => {
		const snapshot = await prepareSessionBindingInspections(refs);
		releases.push(snapshot.dispose);
		return () => snapshot.inspect();
	};
	try {
		const groups = /* @__PURE__ */ new Map();
		const resolvers = /* @__PURE__ */ new Map();
		const plugins = inputs.map((input, index) => {
			const channel = normalizeAnyChannelId(input.conversation.channel);
			const plugin = channel ? getLoadedChannelPlugin(channel) : void 0;
			const prepare = plugin?.messaging?.prepareConversationRouteOwnersAsync;
			if (prepare) {
				const group = groups.get(prepare) ?? [];
				group.push(index);
				groups.set(prepare, group);
			}
			return {
				channel,
				plugin
			};
		});
		for (const [prepare, indexes] of groups) {
			let preparing = true;
			let selected;
			try {
				selected = await prepare(indexes.map((index) => pluginRouteOwnerInput(params.config, inputs[index].conversation)), (refs) => {
					if (!preparing) throw new Error("Conversation route preparation is no longer active");
					return inspectBindings(refs);
				});
			} finally {
				preparing = false;
			}
			if (selected.length !== indexes.length) throw new Error("Plugin route owner returned an incomplete selection");
			indexes.forEach((index, position) => resolvers.set(index, selected[position]));
		}
		const prepared = inputs.map((input, index) => {
			const resolver = resolvers.get(index);
			if (resolvePluginRouteOwner(input.config, input.conversation, resolver)) return {
				kind: "plugin",
				resolver
			};
			const route = resolveConfiguredRouteOwner(input.config, input.conversation, input.conversation.routeContext);
			return route ? {
				kind: "binding",
				...prepareGenericRoute({
					...input,
					route,
					context: input.conversation.routeContext
				})
			} : { kind: "denied" };
		});
		const inspect = await inspectBindings(prepared.flatMap((entry) => entry.kind === "binding" ? [entry.conversation] : []));
		return {
			read() {
				for (const { channel, plugin } of plugins) if (channel && getLoadedChannelPlugin(channel) !== plugin) throw new Error("Conversation route owner changed. Retry the request.");
				const inspections = inspect();
				let position = 0;
				return prepared.map((entry, index) => {
					if (entry.kind === "denied") return "denied";
					const input = inputs[index];
					const owner = entry.kind === "plugin" ? resolvePluginRouteOwner(input.config, input.conversation, entry.resolver) : resolveInspectedGenericRouteOwner(entry.route, inspections[position++]);
					return owner ? finishRouteEligibility(input, owner) : "unavailable";
				});
			},
			dispose() {
				for (const release of releases) release();
			}
		};
	} catch (error) {
		for (const release of releases) release();
		throw error;
	}
}
async function resolveConversationRouteEligibilitiesForAgent(params) {
	const prepared = await prepareConversationRouteEligibilitiesForAgent(params);
	try {
		return prepared.read();
	} finally {
		prepared.dispose();
	}
}
function assertConversationDeliveryRouteAuthorized(params, eligibility) {
	const conversation = params.conversation;
	try {
		assertConversationAuthority(conversation, params);
	} catch (cause) {
		throw new PlatformMessageNotDispatchedError(`Conversation is no longer available to this agent: ${params.conversationRef}`, {
			cause,
			retryable: false
		});
	}
	if (eligibility === "eligible") return;
	throw new PlatformMessageNotDispatchedError(eligibility === "unavailable" ? `Conversation ownership is temporarily unavailable: ${params.conversationRef}` : `Conversation is no longer available to this agent: ${params.conversationRef}`, {
		cause: void 0,
		retryable: eligibility === "unavailable"
	});
}
async function prepareConversationDeliveryRouteAuthorization(params) {
	const prepared = await prepareConversationRouteEligibilitiesForAgent({
		...params,
		conversations: [params.conversation]
	});
	const assertConfigCurrent = () => {
		if ((params.readCurrentConfig?.() ?? params.config) !== params.config) throw new PlatformMessageNotDispatchedError("Conversation routing configuration changed. Retry the request.", {
			cause: void 0,
			retryable: true
		});
	};
	return {
		assertRequestEligible() {
			assertConfigCurrent();
			const eligibility = prepared.read()[0];
			if (eligibility === "denied") throw new ConversationInputError(`Conversation is not available to this agent: ${params.conversationRef}`);
			if (eligibility === "unavailable") throw new Error(`Conversation ownership is temporarily unavailable: ${params.conversationRef}`);
		},
		assertCurrent(conversation, authority = params) {
			assertConfigCurrent();
			assertConversationDeliveryRouteAuthorized({
				...params,
				...authority,
				conversation
			}, prepared.read()[0]);
		},
		dispose: () => prepared.dispose()
	};
}
async function withAuthorizedConversationDelivery(params, initiate) {
	const conversation = params.routeAuthority ? void 0 : await readConversation(params.scope, params.conversationRef);
	if (!params.routeAuthority && !conversation) throw new PlatformMessageNotDispatchedError("Conversation is no longer available", {
		cause: void 0,
		retryable: false
	});
	const routeAuthority = params.routeAuthority ?? await prepareConversationDeliveryRouteAuthorization({
		...params,
		conversation
	});
	try {
		return await withConversationAuthority(params.scope, { conversationRef: params.conversationRef }, ({ conversation: currentConversation }) => {
			routeAuthority.assertCurrent(currentConversation, params);
			return initiate;
		});
	} finally {
		if (!params.routeAuthority) routeAuthority.dispose();
	}
}
async function withAuthorizedQueuedConversationDelivery(params, capturedScope, initiate) {
	const operation = await getConversationDeliveryOperation(capturedScope, params.operationId);
	if (!operation) throw new PlatformMessageNotDispatchedError(`Conversation delivery operation no longer exists: ${params.operationId}`, {
		cause: void 0,
		retryable: false
	});
	const conversation = await readConversation(capturedScope, operation.conversationRef);
	if (!conversation) throw new PlatformMessageNotDispatchedError("Conversation is no longer available", {
		cause: void 0,
		retryable: false
	});
	const authority = {
		conversationRef: operation.conversationRef,
		expectedRouteFingerprint: params.routeFingerprint
	};
	const routeAuthority = await prepareConversationDeliveryRouteAuthorization({
		...authority,
		config: params.readCurrentConfig(),
		readCurrentConfig: params.readCurrentConfig,
		agentId: capturedScope.agentId,
		conversation
	});
	try {
		return await withConversationAuthority(capturedScope, { operationId: params.operationId }, ({ operation: currentOperation, conversation: currentConversation }) => {
			if (!currentOperation || currentOperation.conversationRef !== authority.conversationRef) throw new PlatformMessageNotDispatchedError(`Conversation delivery operation no longer exists: ${params.operationId}`, {
				cause: void 0,
				retryable: false
			});
			routeAuthority.assertCurrent(currentConversation, authority);
			return initiate;
		});
	} finally {
		routeAuthority.dispose();
	}
}
//#endregion
export { withAuthorizedQueuedConversationDelivery as a, withAuthorizedConversationDelivery as i, prepareConversationRouteEligibilitiesForAgent as n, ConversationInputError as o, resolveConversationRouteEligibilitiesForAgent as r, ConversationOperationConflictError as s, prepareConversationDeliveryRouteAuthorization as t };
