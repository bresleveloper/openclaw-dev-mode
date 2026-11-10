import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/agents/ui-presentation-prompt.ts
/** Tool eligibility and results own surface support; do not infer it from channel names. */
function buildUiPresentationPrompt(params) {
	const { screenToolName, showWidgetToolName, dashboardToolName, portalToolName } = params;
	const messageProperties = asOptionalRecord(asOptionalRecord(params.messageTool?.parameters)?.properties);
	const clawHubMessageToolName = messageProperties && Object.hasOwn(messageProperties, "clawhub") ? params.messageTool?.name : void 0;
	const lines = [
		screenToolName && `\`${screenToolName}\`: For the agent Browser panel specifically, use \`${screenToolName}(action="browser_show")\`; browser_hide hides it. For an app preview, use portal_show with its portalId, not browser_show. A generic "side panel" request needs the intended content, not an automatic Browser panel. sidebar_show/sidebar_hide control the session list; terminal_show/terminal_hide control Terminal. Set dock="right" or "bottom" when requested. Do not create or expand a dashboard to open a panel.`,
		clawHubMessageToolName && `\`${clawHubMessageToolName}\`: Tools/skills first. For explicit plugin/skill search/install or missing capability, use ClawHub: \`${clawHubMessageToolName}(action="send", clawhub={query:"capability"})\`. Skip routine tasks, tool errors, permissions. Omit channel/target. Trust result status.`,
		showWidgetToolName && `\`${showWidgetToolName}\`: author widgets using this turn's schema. pin=true saves to the dashboard; status=pinned means the widget is on the session dashboard. Follow result.presentation when present. Inline availability is per turn, including after restart.`,
		dashboardToolName && `\`${dashboardToolName}\`: layout/plugin widgets, not HTML authoring; never for opening a browser side panel. For a saved widget, use action="focus_tab" with its tabId.${showWidgetToolName ? "" : " Custom authoring is unavailable this turn, not unsupported by dashboards."}`,
		portalToolName && `\`${portalToolName}\`: Open the app port on the correct environment (environmentId for an attachment; omit for a conversation-bound tool/current host), then start it there with PORT and PUBLIC_URL=publicUrl. Read exposure: loopback-only is local to the Gateway host; non-loopback is not proof of remote access. Keep URLs unchanged and bearer URLs private; publicUrl is not a launch link.${screenToolName ? ` Then use \`${screenToolName}(action="portal_show", portalId="<returned id>")\` to request the app side panel.` : " No screen tool is exposed this turn; do not claim to open a side panel. Direct the viewer to Control UI → Portals instead."} Verify app rendering from the requesting viewer; a worker/Gateway fetch or browser test is not delivery proof. Report blocked or unverified results; panel dispatch/transport alone is not app-rendering proof.`,
		(showWidgetToolName || dashboardToolName) && "Inspect widgets in their chat/dashboard frame; do not open hosting URLs as browser pages. Verify the delivered interaction or say unverified."
	].filter(Boolean);
	return lines.length > 0 ? ["## UI Presentation", ...lines].join("\n") : "";
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
		messageToolOwnsVisibleReply(params) ? params.messageToolAvailable ? "Visible source replies are not automatically delivered for this run. Use `message(action=send)` for source output. For progress, set `final=false`. Set `final=true`, or omit it, for a completed reply to the current source. An added reaction to the current source message with `final=true` can also complete the reply. Do not repeat delivered content." : "No source-conversation reply can be sent from this turn. Final assistant text remains private and returns to the invoking workflow; it is not automatically delivered to the source conversation." : params.messageToolAvailable ? "Use `message` with `final=false` for progress. A completed send to the current source conversation (`final=true`, or omitted) or an added reaction to its current message with `final=true` is your complete reply. Do not repeat delivered content. Otherwise, OpenClaw delivers your final response automatically." : "For the current source conversation, reply normally in your final assistant message; OpenClaw will deliver it through the active source conversation.",
		params.messageToolAvailable && params.requireExplicitMessageTarget !== void 0 ? buildMessageToolTargetGuidance(params.requireExplicitMessageTarget) : void 0,
		params.messageToolAvailable ? "Commentary is optional progress and may be hidden. Answer user questions or status requests received during ongoing work with `message(action=send, final=false)`, then continue the task. Before finishing, deliver every still-pending answer through this turn's visible-reply route. Do not repeat answers already delivered." : !messageToolOwnsVisibleReply(params) ? "Commentary is optional progress and may be hidden. Include answers to every still-pending user question, including questions received during ongoing work, in your final response." : void 0,
		params.uiPresentation ? buildUiPresentationPrompt(params.uiPresentation) : void 0
	].filter(Boolean).join("\n\n");
}
//#endregion
export { buildUiPresentationPrompt as i, buildMessageToolTargetGuidance as n, messageToolOwnsVisibleReply as r, buildHarnessVisibleReplyGuidance as t };
