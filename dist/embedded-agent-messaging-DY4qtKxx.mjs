import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { i as normalizeTargetForProvider } from "./target-normalization-CUrXIAtg.mjs";
import { t as CHANNEL_MESSAGE_ACTION_NAMES } from "./message-action-names-BPz1joQd.mjs";
import { t as MessageActionDeniedError } from "./message-action-denial-DOmE5Ll7.mjs";
import { n as lookupDirectoryDisplay, t as formatTargetDisplay } from "./target-resolver-BSpO1GUs.mjs";
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
function resolveContextGuardTarget(action, params) {
	if (!CONTEXT_GUARDED_ACTIONS.has(action)) return;
	const keys = action === "thread-reply" || action === "thread-create" ? ["channelId", "to"] : ["to", "channelId"];
	for (const key of keys) if (typeof params[key] === "string") return params[key];
}
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
/** Resolves message-tool policy after applying agent-specific overrides. */
function resolveEffectiveMessageToolsConfig(params) {
	const { cfg, agentId } = params;
	const trimmedAgentId = agentId?.trim();
	const globalConfig = cfg.tools?.message;
	if (!trimmedAgentId) return globalConfig;
	const agentConfig = resolveAgentConfig(cfg, trimmedAgentId)?.tools?.message;
	if (!agentConfig) return globalConfig;
	return {
		...globalConfig,
		...agentConfig,
		crossContext: globalConfig?.crossContext || agentConfig.crossContext ? {
			...globalConfig?.crossContext,
			...agentConfig.crossContext,
			marker: globalConfig?.crossContext?.marker || agentConfig.crossContext?.marker ? {
				...globalConfig?.crossContext?.marker,
				...agentConfig.crossContext?.marker
			} : void 0
		} : void 0,
		broadcast: globalConfig?.broadcast || agentConfig.broadcast ? {
			...globalConfig?.broadcast,
			...agentConfig.broadcast
		} : void 0,
		actions: globalConfig?.actions || agentConfig.actions ? {
			...globalConfig?.actions,
			...agentConfig.actions
		} : void 0
	};
}
/**
* Returns the normalized allowed message actions for an agent or the global policy.
*/
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
	const target = resolveContextGuardTarget(params.action, params.args);
	if (!target) return;
	if (!isCrossContextTarget({
		channel: params.channel,
		target,
		toolContext: params.toolContext
	})) return;
	throw new MessageActionDeniedError(`Cross-context messaging denied: action=${params.action} target="${target}" while bound to "${currentTarget}" (channel=${params.channel}).`, "message_cross_context_denied", "message-cross-context:target");
}
/**
* Builds cross-context marker text or a channel-native presentation for forwarded sends.
*/
async function buildCrossContextDecoration(params) {
	const currentTarget = params.toolContext?.currentChannelId ?? params.toolContext?.currentMessagingTarget;
	if (!currentTarget) return null;
	if (params.toolContext?.skipCrossContextDecoration) return null;
	if (!isCrossContextTarget(params)) return null;
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
/**
* Reports whether an action can carry a cross-context marker in outbound payloads.
*/
function shouldApplyCrossContextMarker(action) {
	return CONTEXT_MARKER_ACTIONS.has(action);
}
/**
* Applies text markers or a preferred rich presentation to a cross-context message.
*/
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
const MESSAGE_TOOL_SEND_ACTIONS = /* @__PURE__ */ new Set([
	"send",
	"thread-reply",
	"sendWithEffect",
	"sendAttachment",
	"upload-file"
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
/** Return true when a message action sends or uploads user-visible content. */
function isMessageToolSendActionName(action) {
	const normalized = normalizeOptionalString(action) ?? "";
	return MESSAGE_TOOL_SEND_ACTIONS.has(normalized);
}
/** Return true when a message action creates a visible destination conversation. */
function isMessageToolConversationCreateActionName(action) {
	const normalized = normalizeOptionalString(action)?.toLowerCase() ?? "";
	return MESSAGE_TOOL_CONVERSATION_CREATE_ACTIONS.has(normalized);
}
/** Return true for core or channel-plugin messaging tool names. */
function isMessagingTool(toolName) {
	if (CORE_MESSAGING_TOOLS.has(toolName)) return true;
	return isPluginNativeMessagingTool(toolName);
}
function isPluginNativeMessagingTool(toolName) {
	const providerId = normalizeAnyChannelId(toolName);
	return toolName === "message" || Boolean(providerId && getChannelPlugin(providerId)?.actions);
}
/** Return true when the specific tool invocation is an outbound send. */
function isMessagingToolSendAction(toolName, args) {
	const action = normalizeOptionalString(args.action) ?? "";
	if (toolName === "sessions_send" || toolName === "conversations_send" || toolName === "conversations_turn") return true;
	if (toolName === "message") return isMessageToolSendActionName(action);
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
export { isMessagingToolSendAction as a, applyCrossContextDecoration as c, enforceMessageActionAllowlist as d, resolveAllowedMessageActions as f, isMessagingToolDeliveryAction as i, buildCrossContextDecoration as l, shouldApplyCrossContextMarker as m, isMessageToolSendActionName as n, isMessagingToolTargetEvidenceAction as o, resolveEffectiveMessageToolsConfig as p, isMessagingTool as r, isPluginNativeMessagingTool as s, isMessageToolConversationCreateActionName as t, enforceCrossContextPolicy as u };
