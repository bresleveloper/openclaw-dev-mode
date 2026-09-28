import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as normalizeChannelId, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { t as getSessionBindingService } from "./session-binding-service-n2QTfkUE.mjs";
import { n as commandReply } from "./command-gates-DqpLd5XK.mjs";
import { t as formatRunLabel } from "./subagents-utils-uco3tjYq.mjs";
import { n as resolveCommandSurfaceChannel, t as resolveChannelAccountId } from "./channel-context-Lef-IObJ.mjs";
//#region src/auto-reply/reply/commands-subagents/action-agents.ts
function formatConversationBindingText(params) {
	return `binding:${params.conversationId}`;
}
function supportsConversationBindings(channel) {
	const channelId = normalizeChannelId(channel);
	if (!channelId) return false;
	return getChannelPlugin(channelId)?.conversationBindings?.supportsCurrentConversationBinding === true;
}
function handleSubagentsAgentsAction(ctx) {
	const { params, requesterKey, readContext } = ctx;
	const channel = resolveCommandSurfaceChannel(params);
	const accountId = resolveChannelAccountId(params);
	const currentConversationBindingsSupported = supportsConversationBindings(channel);
	const bindingService = getSessionBindingService();
	const bindingsBySession = /* @__PURE__ */ new Map();
	const resolveSessionBindings = (sessionKey) => {
		const cached = bindingsBySession.get(sessionKey);
		if (cached) return cached;
		const resolved = bindingService.listBySession(sessionKey).filter((entry) => entry.status === "active" && entry.conversation.channel === channel && entry.conversation.accountId === accountId);
		bindingsBySession.set(sessionKey, resolved);
		return resolved;
	};
	const { latest, active, recent } = readContext.list.view;
	const indexByChildSessionKey = new Map([...active, ...recent].map((entry, idx) => [entry.childSessionKey, idx + 1]));
	const activeRuns = new Set(active);
	const visibleRuns = latest.filter((entry) => activeRuns.has(entry) || resolveSessionBindings(entry.childSessionKey).length > 0);
	const lines = ["agents:", "-----"];
	if (visibleRuns.length === 0) lines.push("(none)");
	else for (const entry of visibleRuns) {
		const binding = resolveSessionBindings(entry.childSessionKey)[0];
		const bindingText = binding ? formatConversationBindingText({ conversationId: binding.conversation.conversationId }) : currentConversationBindingsSupported ? "unbound" : "bindings unavailable";
		const resolvedIndex = indexByChildSessionKey.get(entry.childSessionKey);
		const prefix = resolvedIndex ? `${resolvedIndex}.` : "-";
		lines.push(`${prefix} ${formatRunLabel(entry)} (${bindingText})`);
	}
	const requesterBindings = resolveSessionBindings(requesterKey).filter((entry) => entry.targetKind === "session");
	if (requesterBindings.length > 0) {
		lines.push("", "acp/session bindings:", "-----");
		for (const binding of requesterBindings) {
			const label = normalizeOptionalString(binding.metadata?.label) ?? binding.targetSessionKey;
			lines.push(`- ${label} (${formatConversationBindingText({ conversationId: binding.conversation.conversationId })}, session:${binding.targetSessionKey})`);
		}
	}
	return commandReply(lines.join("\n"));
}
//#endregion
export { handleSubagentsAgentsAction };
