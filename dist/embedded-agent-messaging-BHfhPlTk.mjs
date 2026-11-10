import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import { i as normalizeTargetForProvider } from "./target-normalization-Cz6f81yX.mjs";
import { n as isMessageToolSendActionName, t as CHANNEL_MESSAGE_ACTION_NAMES } from "./message-action-names-cweW7syH.mjs";
import { t as MessageActionDeniedError } from "./message-action-denial-DOmE5Ll7.mjs";
import { n as lookupDirectoryDisplay, t as formatTargetDisplay } from "./target-resolver-c-W9fpkt.mjs";
//#region src/infra/outbound/outbound-policy.ts
const CONTEXT_MARKER_ACTIONS = /* @__PURE__ */ new Set([
	"send",
	"poll",
	"reply",
	"sendWithEffect",
	"sendAttachment",
	"upload-file",
	"thread-reply",
	"sticker"
]);
const CONTEXT_GUARDED_ACTIONS = /* @__PURE__ */ new Set([
	...CONTEXT_MARKER_ACTIONS,
	"poll-vote",
	"edit",
	"delete",
	"pin",
	"unpin",
	"thread-create",
	"topic-create",
	"topic-edit"
]);
function normalizeTarget(channel, raw) {
	return normalizeTargetForProvider(channel, raw) ?? raw.trim();
}
function isCrossContextTarget(params) {
	if (params.toolContext && getChannelPlugin(params.channel)?.threading?.matchesToolContextTarget?.({
		target: params.target,
		toolContext: params.toolContext
	})) return false;
	const currentTargets = [params.toolContext?.currentMessagingTarget?.trim(), params.toolContext?.currentChannelId?.trim()].filter((target) => Boolean(target));
	if (currentTargets.length === 0) return false;
	const normalizedTarget = normalizeTarget(params.channel, params.target);
	if (!normalizedTarget) return false;
	return !currentTargets.some((currentTarget) => normalizeTarget(params.channel, currentTarget) === normalizedTarget);
}
function mergeMessagePolicy(global, agent) {
	return global || agent ? {
		...global,
		...agent
	} : void 0;
}
function resolveEffectiveMessageToolsConfig(params) {
	const { cfg, agentId } = params;
	const trimmedAgentId = agentId?.trim();
	const globalConfig = cfg.tools?.message;
	if (!trimmedAgentId) return globalConfig;
	const agentConfig = resolveAgentConfig(cfg, trimmedAgentId)?.tools?.message;
	if (!agentConfig) return globalConfig;
	const crossContext = mergeMessagePolicy(globalConfig?.crossContext, agentConfig.crossContext);
	return {
		...globalConfig,
		...agentConfig,
		crossContext: crossContext ? {
			...crossContext,
			marker: mergeMessagePolicy(globalConfig?.crossContext?.marker, agentConfig.crossContext?.marker)
		} : void 0,
		broadcast: mergeMessagePolicy(globalConfig?.broadcast, agentConfig.broadcast),
		actions: mergeMessagePolicy(globalConfig?.actions, agentConfig.actions)
	};
}
function resolveAllowedMessageActions(params) {
	const allow = resolveEffectiveMessageToolsConfig(params)?.actions?.allow;
	if (!allow) return;
	const normalized = normalizeUniqueStringEntries(allow);
	return normalized.length > 0 ? normalized : void 0;
}
/**
* Rejects disabled message actions before channel-specific send handling runs.
*/
function enforceMessageActionAllowlist(params) {
	const allowed = resolveAllowedMessageActions(params);
	if (!allowed || allowed.includes(params.action)) return;
	throw new MessageActionDeniedError(`Message action "${params.action}" is disabled for this agent.`, "message_action_disabled", "message-actions:allowlist");
}
/**
* Enforces source-provider policy independently of channel/thread target availability.
*/
function enforceCrossContextPolicy(params) {
	if (!CONTEXT_GUARDED_ACTIONS.has(params.action)) return;
	const messageConfig = resolveEffectiveMessageToolsConfig({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const currentProvider = params.toolContext?.currentChannelProvider;
	const allowWithinProvider = messageConfig?.crossContext?.allowWithinProvider !== false;
	const allowAcrossProviders = messageConfig?.crossContext?.allowAcrossProviders !== false;
	if (currentProvider && currentProvider !== params.channel) {
		if (!allowAcrossProviders) throw new MessageActionDeniedError(`Cross-context messaging denied: action=${params.action} target provider "${params.channel}" while bound to "${currentProvider}".`, "message_cross_context_denied", "message-cross-context:provider");
		return;
	}
	if (allowWithinProvider) return;
	const currentTarget = params.toolContext?.currentChannelId?.trim() ?? params.toolContext?.currentMessagingTarget?.trim();
	if (!currentTarget) return;
	const targetKeys = params.action === "thread-reply" || params.action === "thread-create" ? ["channelId", "to"] : ["to", "channelId"];
	let target;
	for (const key of targetKeys) if (typeof params.args[key] === "string") {
		target = params.args[key];
		break;
	}
	if (!target || !isCrossContextTarget({
		channel: params.channel,
		target,
		toolContext: params.toolContext
	})) return;
	throw new MessageActionDeniedError(`Cross-context messaging denied: action=${params.action} target="${target}" while bound to "${currentTarget}" (channel=${params.channel}).`, "message_cross_context_denied", "message-cross-context:target");
}
async function buildCrossContextDecoration(params) {
	const currentTarget = params.toolContext?.currentChannelId ?? params.toolContext?.currentMessagingTarget;
	if (!currentTarget || params.toolContext?.skipCrossContextDecoration || !isCrossContextTarget(params)) return null;
	const markerConfig = resolveEffectiveMessageToolsConfig({
		cfg: params.cfg,
		agentId: params.agentId
	})?.crossContext?.marker;
	if (markerConfig?.enabled === false) return null;
	const currentName = await lookupDirectoryDisplay({
		cfg: params.cfg,
		channel: params.channel,
		targetId: currentTarget,
		accountId: params.accountId ?? void 0
	}) ?? currentTarget;
	const originLabel = formatTargetDisplay({
		channel: params.channel,
		target: currentTarget,
		display: currentName
	});
	const prefixTemplate = markerConfig?.prefix ?? "[from {channel}] ";
	const suffixTemplate = markerConfig?.suffix ?? "";
	const prefix = prefixTemplate.replaceAll("{channel}", originLabel);
	const suffix = suffixTemplate.replaceAll("{channel}", originLabel);
	const buildPresentation = getChannelPlugin(params.channel)?.messaging?.buildCrossContextPresentation;
	return {
		prefix,
		suffix,
		presentationBuilder: buildPresentation ? (message) => buildPresentation({
			originLabel,
			message,
			cfg: params.cfg,
			accountId: params.accountId ?? void 0
		}) : void 0
	};
}
function shouldApplyCrossContextMarker(action) {
	return CONTEXT_MARKER_ACTIONS.has(action);
}
function applyCrossContextDecoration(params) {
	const buildPresentation = params.decoration.presentationBuilder;
	if (params.preferPresentation && buildPresentation) return {
		message: params.message,
		presentation: buildPresentation(params.message)
	};
	return { message: `${params.decoration.prefix}${params.message}${params.decoration.suffix}` };
}
//#endregion
//#region src/agents/embedded-agent-messaging.ts
/**
* Identifies messaging tools and send actions during embedded-agent runs.
*/
const CORE_MESSAGING_TOOLS = /* @__PURE__ */ new Set([
	"sessions_send",
	"conversations_send",
	"conversations_turn",
	"message"
]);
const MESSAGE_TOOL_READ_ONLY_ACTIONS = /* @__PURE__ */ new Set([
	"read",
	"reactions",
	"list-pins",
	"permissions",
	"thread-list",
	"search",
	"sticker-search",
	"member-info",
	"role-info",
	"emoji-list",
	"channel-info",
	"channel-list",
	"voice-status",
	"event-list",
	"download-file"
]);
const MESSAGE_TOOL_MUTATION_ACTIONS = new Set(CHANNEL_MESSAGE_ACTION_NAMES.filter((action) => !MESSAGE_TOOL_READ_ONLY_ACTIONS.has(action)));
const MESSAGE_TOOL_CONVERSATION_CREATE_ACTIONS = /* @__PURE__ */ new Set([
	"thread-create",
	"topic-create",
	"threadcreate",
	"createforumtopic"
]);
/** Return true when a message action creates a visible destination conversation. */
function isMessageToolConversationCreateActionName(action) {
	const normalized = normalizeOptionalString(action)?.toLowerCase() ?? "";
	return MESSAGE_TOOL_CONVERSATION_CREATE_ACTIONS.has(normalized);
}
/** Return true for core or channel-plugin messaging tool names. */
function isMessagingTool(toolName) {
	return CORE_MESSAGING_TOOLS.has(toolName) || isPluginNativeMessagingTool(toolName);
}
function isPluginNativeMessagingTool(toolName) {
	const providerId = normalizeAnyChannelId(toolName);
	return toolName === "message" || Boolean(providerId && getChannelPlugin(providerId)?.actions);
}
/** Return true when the specific tool invocation is an outbound send. */
function isMessagingToolSendAction(toolName, args) {
	const action = normalizeOptionalString(args.action) ?? "";
	if (CORE_MESSAGING_TOOLS.has(toolName)) return toolName !== "message" || isMessageToolSendActionName(action);
	const providerId = normalizeAnyChannelId(toolName);
	return Boolean(providerId && getChannelPlugin(providerId)?.actions?.extractToolSend?.({ args })?.to);
}
/** Return true when a visible delivery has one target worth recording as evidence. */
function isMessagingToolTargetEvidenceAction(toolName, args) {
	if (toolName === "conversations_send" || toolName === "conversations_turn") return true;
	if (toolName === "message") {
		const action = normalizeOptionalString(args.action) ?? "";
		return shouldApplyCrossContextMarker(action) || isMessageToolConversationCreateActionName(action);
	}
	return isMessagingToolSendAction(toolName, args);
}
/** Return true when a messaging invocation can create visible outbound delivery. */
function isMessagingToolDeliveryAction(toolName, args) {
	if (toolName === "conversations_send" || toolName === "conversations_turn") return true;
	if (toolName === "message") {
		const action = normalizeOptionalString(args.action) ?? "";
		return MESSAGE_TOOL_MUTATION_ACTIONS.has(action) || isMessageToolConversationCreateActionName(action);
	}
	const providerId = normalizeAnyChannelId(toolName);
	if (providerId && getChannelPlugin(providerId)?.actions?.isToolDeliveryAction?.({ args })) return true;
	return isMessagingToolSendAction(toolName, args);
}
//#endregion
export { isMessagingToolTargetEvidenceAction as a, buildCrossContextDecoration as c, resolveAllowedMessageActions as d, resolveEffectiveMessageToolsConfig as f, isMessagingToolSendAction as i, enforceCrossContextPolicy as l, isMessagingTool as n, isPluginNativeMessagingTool as o, shouldApplyCrossContextMarker as p, isMessagingToolDeliveryAction as r, applyCrossContextDecoration as s, isMessageToolConversationCreateActionName as t, enforceMessageActionAllowlist as u };
