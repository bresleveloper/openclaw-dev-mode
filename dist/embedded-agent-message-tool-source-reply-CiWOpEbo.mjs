import { g as readStringValue, t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-PsZCKeeN.mjs";
import "./tool-policy-14GRhbFd.mjs";
import { a as readToolResultDetails, n as isToolResultError } from "./tool-result-error-IpvGgAny.mjs";
import { n as isMessageToolSendActionName } from "./message-action-names-cweW7syH.mjs";
import { o as isPluginNativeMessagingTool, r as isMessagingToolDeliveryAction, t as isMessageToolConversationCreateActionName } from "./embedded-agent-messaging-BHfhPlTk.mjs";
import { a as pluginEnvelopeHas, c as readEmbeddedMessageDeliveryFact, i as pluginBroadcastHasDelivery, l as normalizeMessageDeliveryStatus } from "./embedded-agent-message-delivery-DeQ0PPQm.mjs";
//#region src/agents/embedded-agent-message-tool-source-reply.ts
const EXPLICIT_MESSAGE_ROUTE_KEYS = [
	"channel",
	"target",
	"to",
	"channelId",
	"provider"
];
function resolveMessageToolSourceReplyFinal(args) {
	return (asOptionalRecord(args) ?? {}).final !== false;
}
function resultConfirmsCurrentSourceRoute(value) {
	return asOptionalRecord(asOptionalRecord(value)?.details)?.sourceReplyRoute === "current-source";
}
function hasExplicitMessageRoute(args) {
	return EXPLICIT_MESSAGE_ROUTE_KEYS.some((key) => hasNonEmptyString(args[key])) || Array.isArray(args.targets) && args.targets.some((value) => hasNonEmptyString(value));
}
function isMessageToolSourceReplyActionName(action) {
	return isMessageToolSendActionName(action) || [
		"reply",
		"thread-reply",
		"poll"
	].includes(normalizeMessageDeliveryStatus(action) ?? "");
}
function readMessageToolSourceReplyText(args) {
	const record = asOptionalRecord(args) ?? {};
	if (!isMessageToolSourceReplyActionName(record.action)) return;
	if (normalizeMessageDeliveryStatus(record.action) === "poll") return readStringValue(record.pollQuestion) ?? readStringValue(record.poll_question);
	return [
		"content",
		"message",
		"text",
		"body"
	].map((key) => readStringValue(record[key])).find((value) => value !== void 0);
}
function isDeliveredMessagingToolResult(params) {
	const args = asOptionalRecord(params.args) ?? {};
	if (args.dryRun === true) return false;
	const normalizedToolName = normalizeToolPolicyName(params.toolName ?? "message");
	if (normalizedToolName === "conversations_send" || normalizedToolName === "conversations_turn") {
		const status = readToolResultDetails(params.result)?.status;
		return status === "sent" || normalizedToolName === "conversations_turn" && (status === "replied" || status === "timeout");
	}
	if (!isPluginNativeMessagingTool(normalizedToolName)) return false;
	const action = normalizeMessageDeliveryStatus(args.action);
	const results = [params.result, params.hookResult];
	const hasSignal = (signal) => results.some((result) => pluginEnvelopeHas(result, signal));
	if (hasSignal("dryRun") || params.requirePluginDeliveryId && !hasSignal("deliveryId")) return false;
	if (hasSignal("partial")) return true;
	if (action && isMessageToolConversationCreateActionName(action) && hasSignal("conversation")) return true;
	if (action === "broadcast" && results.some(pluginBroadcastHasDelivery)) return true;
	if (params.isError || results.some((result) => isToolResultError(result) || pluginEnvelopeHas(result, "failure"))) return false;
	const nonDelivery = hasSignal("nonDelivery");
	const noOp = hasSignal("noOp");
	return !nonDelivery && !noOp && (isMessagingToolDeliveryAction(normalizedToolName, args) && action !== "broadcast" && hasSignal("ok") || hasSignal("delivery"));
}
function isDeliveredMessageToolOnlySourceReplyResult(params) {
	const deliveryFact = readEmbeddedMessageDeliveryFact(readToolResultDetails(params.hookResult)?.messageDelivery) ?? readEmbeddedMessageDeliveryFact(readToolResultDetails(params.result)?.messageDelivery);
	const confirmedCurrentSourceRoute = deliveryFact?.sourceReplyDelivered === true || resultConfirmsCurrentSourceRoute(params.result) || resultConfirmsCurrentSourceRoute(params.hookResult);
	if (params.sourceReplyDeliveryMode !== "message_tool_only" && !confirmedCurrentSourceRoute && params.allowExplicitSourceRoute !== true) return false;
	if (normalizeToolPolicyName(params.toolName) !== "message") return false;
	const args = asOptionalRecord(params.args) ?? {};
	if (args.dryRun === true || params.isError && !deliveryFact?.sourceReplyDelivered || deliveryFact?.partialDelivery || [params.result, params.hookResult].some((result) => pluginEnvelopeHas(result, "partial"))) return false;
	const sourceRouteReplyAction = (params.allowExplicitSourceRoute === true || confirmedCurrentSourceRoute) && isMessageToolSourceReplyActionName(args.action);
	if (deliveryFact?.sourceReplyDelivered !== true && !isMessageToolSendActionName(args.action) && !sourceRouteReplyAction) return false;
	if (hasExplicitMessageRoute(args) && params.allowExplicitSourceRoute !== true && !confirmedCurrentSourceRoute) return false;
	return params.deliveryConfirmed ?? (deliveryFact ? deliveryFact.status === "settled" : isDeliveredMessagingToolResult(params));
}
//#endregion
export { resolveMessageToolSourceReplyFinal as i, isDeliveredMessagingToolResult as n, readMessageToolSourceReplyText as r, isDeliveredMessageToolOnlySourceReplyResult as t };
