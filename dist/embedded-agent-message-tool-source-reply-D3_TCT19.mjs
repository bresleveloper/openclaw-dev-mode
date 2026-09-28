import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue, t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { o as readToolResultDetails, r as isToolResultError } from "./tool-result-error-CWadvCKd.mjs";
import { i as isMessagingToolDeliveryAction, n as isMessageToolSendActionName, s as isPluginNativeMessagingTool, t as isMessageToolConversationCreateActionName } from "./embedded-agent-messaging-D4Zw3sB3.mjs";
import { a as pluginEnvelopeHas, c as readEmbeddedMessageDeliveryFact, i as pluginBroadcastHasDelivery } from "./embedded-agent-message-delivery-BkG-vmHL.mjs";
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
	].includes(normalizeStatus(action) ?? "");
}
function readMessageToolSourceReplyText(args) {
	const record = asOptionalRecord(args) ?? {};
	if (!isMessageToolSourceReplyActionName(record.action)) return;
	if (normalizeStatus(record.action) === "poll") return readStringValue(record.pollQuestion) ?? readStringValue(record.poll_question);
	return [
		"content",
		"message",
		"text",
		"body"
	].map((key) => readStringValue(record[key])).find((value) => value !== void 0);
}
function normalizeStatus(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : void 0;
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
	const action = normalizeStatus(args.action);
	const results = [params.result, params.hookResult];
	if (results.some((result) => pluginEnvelopeHas(result, "dryRun")) || params.requirePluginDeliveryId && !results.some((result) => pluginEnvelopeHas(result, "deliveryId"))) return false;
	if (results.some((result) => pluginEnvelopeHas(result, "partial"))) return true;
	if (action && isMessageToolConversationCreateActionName(action) && results.some((result) => pluginEnvelopeHas(result, "conversation"))) return true;
	if (action === "broadcast" && results.some(pluginBroadcastHasDelivery)) return true;
	if (params.isError || results.some((result) => isToolResultError(result) || pluginEnvelopeHas(result, "failure"))) return false;
	const nonDelivery = results.some((result) => pluginEnvelopeHas(result, "nonDelivery"));
	const noOp = results.some((result) => pluginEnvelopeHas(result, "noOp"));
	if (!nonDelivery && !noOp && isMessagingToolDeliveryAction(normalizedToolName, args) && action !== "broadcast" && results.some((result) => pluginEnvelopeHas(result, "ok"))) return true;
	return !nonDelivery && !noOp && results.some((result) => pluginEnvelopeHas(result, "delivery"));
}
function isDeliveredMessageToolOnlySourceReplyResult(params) {
	const deliveryFact = readEmbeddedMessageDeliveryFact(readToolResultDetails(params.hookResult)?.messageDelivery) ?? readEmbeddedMessageDeliveryFact(readToolResultDetails(params.result)?.messageDelivery);
	const confirmedCurrentSourceRoute = deliveryFact?.sourceReplyDelivered === true || resultConfirmsCurrentSourceRoute(params.result) || resultConfirmsCurrentSourceRoute(params.hookResult);
	if (params.sourceReplyDeliveryMode !== "message_tool_only" && !confirmedCurrentSourceRoute) return false;
	if (normalizeToolPolicyName(params.toolName) !== "message") return false;
	const args = asOptionalRecord(params.args) ?? {};
	const sourceRouteReplyAction = (params.allowExplicitSourceRoute === true || confirmedCurrentSourceRoute) && isMessageToolSourceReplyActionName(args.action);
	if (!isMessageToolSendActionName(args.action) && !sourceRouteReplyAction) return false;
	if (hasExplicitMessageRoute(args) && params.allowExplicitSourceRoute !== true && !confirmedCurrentSourceRoute) return false;
	return params.deliveryConfirmed ?? (deliveryFact ? deliveryFact.status === "settled" && (!params.isError || deliveryFact.partialDelivery) : isDeliveredMessagingToolResult(params));
}
//#endregion
export { resolveMessageToolSourceReplyFinal as i, isDeliveredMessagingToolResult as n, readMessageToolSourceReplyText as r, isDeliveredMessageToolOnlySourceReplyResult as t };
