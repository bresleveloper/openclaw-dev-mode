import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/agents/ui-presentation-prompt.ts
/** Tool eligibility and results own surface support; do not infer it from channel names. */
function buildUiPresentationPrompt(params) {
	const { screenToolName, showWidgetToolName, dashboardToolName, portalToolName } = params;
	const messageProperties = asOptionalRecord(asOptionalRecord(params.messageTool?.parameters)?.properties);
	const clawHubMessageToolName = messageProperties && Object.hasOwn(messageProperties, "clawhub") ? params.messageTool?.name : void 0;
	if (!screenToolName && !showWidgetToolName && !dashboardToolName && !portalToolName && !clawHubMessageToolName) return "";
	return [
		"## UI Presentation",
		...screenToolName ? [`\`${screenToolName}\`: Open/show the browser sidebar or side panel with \`${screenToolName}(action="browser_show")\`; browser_hide hides it. sidebar_show/sidebar_hide control the session list, not the browser. terminal_show/terminal_hide control the terminal panel. Set dock="right" or "bottom" when requested. Do not create or expand a dashboard to open a panel.`] : [],
		...clawHubMessageToolName ? [`\`${clawHubMessageToolName}\`: Tools/skills first. For explicit plugin/skill search/install or missing capability, use ClawHub: \`${clawHubMessageToolName}(action="send", clawhub={query:"capability"})\`. Skip routine tasks, tool errors, permissions. Omit channel/target. Trust result status.`] : [],
		...showWidgetToolName ? [`\`${showWidgetToolName}\`: author widgets using this turn's schema. pin=true saves to the dashboard; status=pinned means the widget is on the session dashboard. Follow result.presentation when present. Inline availability is per turn, including after restart.`] : [],
		...dashboardToolName ? [`\`${dashboardToolName}\`: layout/plugin widgets, not HTML authoring; never for opening a browser side panel. For a saved widget, use action="focus_tab" with its tabId.${showWidgetToolName ? "" : " Custom authoring is unavailable this turn, not unsupported by dashboards."}`] : [],
		...portalToolName ? [`\`${portalToolName}\`: separate app in Control UI → Portals. publicUrl is not a launch link; token URLs stay private.`] : [],
		...showWidgetToolName || dashboardToolName || portalToolName ? ["Inspect widgets in their chat/dashboard frame; do not open hosting URLs as browser pages. Verify the delivered interaction or say unverified."] : []
	].join("\n");
}
//#endregion
//#region src/auto-reply/source-reply-delivery-mode.ts
/** Visible-reply ownership and presentation guidance shared with agent harnesses. */
/**
* True when the visible source reply must flow through the message tool, either
* because the run forces it or because the delivery mode is message_tool_only.
* Consumers use this to keep the message tool visible/preserved: hiding the only
* reply path leaves the run mute. The mode is accepted as plain string because
* harness callers carry it untyped; only "message_tool_only" is meaningful here.
*/
function messageToolOwnsVisibleReply(params) {
	return params.forceMessageTool === true || params.sourceReplyDeliveryMode === "message_tool_only";
}
function buildMessageToolTargetGuidance(requireExplicitMessageTarget) {
	return requireExplicitMessageTarget ? "`send`: `target` + `message`; target required this turn." : "`send`: `message`; current source is default target. Set `target` only elsewhere.";
}
function buildHarnessVisibleReplyGuidance(params) {
	return [
		messageToolOwnsVisibleReply(params) ? params.messageToolAvailable ? "Visible source replies are not automatically delivered for this run. Use `message(action=send)` for user-visible source-channel output. For progress, set `final=false`. Set `final=true`, or omit it, for the completed reply to the current source conversation; OpenClaw stops after confirming delivery. Do not repeat visible message content in your final answer." : "No source-conversation reply can be sent from this turn. Final assistant text remains private and returns to the invoking workflow; it is not automatically delivered to the source conversation." : params.messageToolAvailable ? "You can participate in the conversation throughout your work. Use `message` when you have something worth saying; you don’t need to wait until you’re finished, and sending a message doesn’t end your task. OpenClaw delivers your final response automatically." : "For the current source conversation, reply normally in your final assistant message; OpenClaw will deliver it through the active source conversation.",
		params.messageToolAvailable && params.requireExplicitMessageTarget !== void 0 ? buildMessageToolTargetGuidance(params.requireExplicitMessageTarget) : void 0,
		params.messageToolAvailable ? "Commentary is optional progress and may be hidden. Answer user questions or status requests received during ongoing work with `message(action=send, final=false)`, then continue the task. Before finishing, deliver every still-pending answer through this turn's visible-reply route. Do not repeat answers already delivered." : !messageToolOwnsVisibleReply(params) ? "Commentary is optional progress and may be hidden. Include answers to every still-pending user question, including questions received during ongoing work, in your final response." : void 0,
		params.uiPresentation ? buildUiPresentationPrompt(params.uiPresentation) : void 0
	].filter(Boolean).join("\n\n");
}
//#endregion
export { buildUiPresentationPrompt as i, buildMessageToolTargetGuidance as n, messageToolOwnsVisibleReply as r, buildHarnessVisibleReplyGuidance as t };
