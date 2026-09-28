import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { b as isCronRunSessionKey, l as resolveAgentIdFromSessionKey, s as isUnscopedSessionKeySentinel } from "./session-key-CBvmC8zz.mjs";
import { t as isPluginOwnedBindingMetadata } from "./conversation-binding-metadata-CFOhDjMh.mjs";
//#region src/channels/conversation-binding-route-facts.ts
/** The same normalization governs initial projection and later ownership comparison. */
function resolveConversationBindingSelection(binding) {
	const sessionKey = binding?.targetSessionKey?.trim();
	if (!binding || !sessionKey) return { kind: "none" };
	if (isCronRunSessionKey(sessionKey)) return {
		kind: "none",
		ignoredCronSessionKey: sessionKey
	};
	const metadata = binding.metadata;
	if (isPluginOwnedBindingMetadata(metadata)) {
		const pluginId = metadata.pluginId.trim();
		if (pluginId) return {
			kind: "plugin",
			binding,
			pluginId,
			pluginRoot: metadata.pluginRoot
		};
	}
	return {
		kind: "agent",
		binding,
		sessionKey
	};
}
function resolveConversationBindingAgentId(binding, fallbackAgentId) {
	const sessionKey = binding.targetSessionKey.trim();
	return resolveAgentIdFromSessionKey(sessionKey, isUnscopedSessionKeySentinel(sessionKey) ? normalizeOptionalString(binding.metadata?.agentId) ?? fallbackAgentId : void 0);
}
const BINDING_ROUTE_FACTS = Symbol.for("openclaw.conversationBindingRouteFacts");
function withConversationBindingRouteFacts(route, selection, fallbackAgentId, conversation) {
	const previous = readConversationBindingRouteFacts(route);
	const sameConversation = previous && previous.conversation.channel === conversation.channel && previous.conversation.accountId === conversation.accountId && previous.conversation.conversationId === conversation.conversationId && previous.conversation.parentConversationId === conversation.parentConversationId;
	const scope = {
		agentId: route.agentId,
		observedAgentId: selection.kind === "agent" ? resolveConversationBindingAgentId(selection.binding, fallbackAgentId) : route.agentId,
		previous: sameConversation ? previous.previous : previous,
		fallbackAgentId,
		conversation: Object.freeze({ ...conversation })
	};
	let facts;
	if (selection.kind === "none" || selection.kind === "unavailable") facts = Object.freeze({
		...scope,
		kind: selection.kind
	});
	else {
		const { binding } = selection;
		const identity = {
			...scope,
			bindingId: binding.bindingId,
			boundAt: binding.boundAt,
			targetSessionKey: binding.targetSessionKey,
			targetKind: binding.targetKind,
			bindingConversation: Object.freeze({ ...binding.conversation })
		};
		facts = selection.kind === "plugin" ? Object.freeze({
			...identity,
			kind: "plugin",
			pluginId: selection.pluginId,
			pluginRoot: selection.pluginRoot
		}) : Object.freeze({
			...identity,
			kind: "agent"
		});
	}
	return Object.assign(route, { [BINDING_ROUTE_FACTS]: facts });
}
function readConversationBindingRouteFacts(value) {
	return value[BINDING_ROUTE_FACTS];
}
function copyConversationBindingRouteFacts(route, context) {
	const facts = readConversationBindingRouteFacts(route);
	const selectedSessionKey = route.dispatchSessionKey ?? route.sessionKey;
	if (facts && selectedSessionKey === context.SessionKey && facts.agentId === context.AgentId) Object.assign(context, { [BINDING_ROUTE_FACTS]: facts });
}
function matchesConversationBindingRouteFacts(expected, current) {
	if (expected.kind === "unavailable") return false;
	const selection = resolveConversationBindingSelection(current);
	if (selection.kind === "none") return expected.kind === "none";
	if (expected.kind === "none" || expected.kind !== selection.kind) return false;
	const binding = selection.binding;
	if (binding.bindingId !== expected.bindingId || binding.boundAt !== expected.boundAt || binding.targetSessionKey !== expected.targetSessionKey || binding.targetKind !== expected.targetKind || binding.conversation.channel !== expected.bindingConversation.channel || binding.conversation.accountId !== expected.bindingConversation.accountId || binding.conversation.conversationId !== expected.bindingConversation.conversationId || binding.conversation.parentConversationId !== expected.bindingConversation.parentConversationId) return false;
	return expected.kind === "plugin" ? selection.kind === "plugin" && selection.pluginId === expected.pluginId && selection.pluginRoot === expected.pluginRoot : selection.kind === "agent" && resolveConversationBindingAgentId(selection.binding, expected.fallbackAgentId) === expected.observedAgentId;
}
/** Configured routing changes the dispatch owner without changing the inspected selection. */
function projectConfiguredConversationBindingRouteFacts(route) {
	const facts = readConversationBindingRouteFacts(route);
	return facts ? Object.assign({ ...route }, { [BINDING_ROUTE_FACTS]: Object.freeze({
		...facts,
		agentId: route.agentId
	}) }) : route;
}
function readConversationBindingRouteObservations(value) {
	const observations = [];
	for (let current = readConversationBindingRouteFacts(value); current; current = current.previous) observations.unshift(current);
	return observations;
}
//#endregion
export { readConversationBindingRouteObservations as a, withConversationBindingRouteFacts as c, readConversationBindingRouteFacts as i, matchesConversationBindingRouteFacts as n, resolveConversationBindingAgentId as o, projectConfiguredConversationBindingRouteFacts as r, resolveConversationBindingSelection as s, copyConversationBindingRouteFacts as t };
