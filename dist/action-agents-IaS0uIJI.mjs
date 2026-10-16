import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { t as getSessionBindingService } from "./session-binding-service-DzGpg6K8.mjs";
import { n as commandReply } from "./command-gates-BzqqR9SG.mjs";
import { t as formatRunLabel } from "./subagents-utils-DtuM-aOJ.mjs";
import { n as resolveCommandSurfaceChannel, t as resolveChannelAccountId } from "./channel-context-e883zHX4.mjs";
//#region src/auto-reply/reply/commands-subagents/action-agents.ts
function supportsConversationBindings(channel) {
	const channelId = normalizeAnyChannelId(channel);
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
		const bindingText = binding ? `binding:${binding.conversation.conversationId}` : currentConversationBindingsSupported ? "unbound" : "bindings unavailable";
		const resolvedIndex = indexByChildSessionKey.get(entry.childSessionKey);
		const prefix = resolvedIndex ? `${resolvedIndex}.` : "-";
		lines.push(`${prefix} ${formatRunLabel(entry)} (${bindingText})`);
	}
	const requesterBindings = resolveSessionBindings(requesterKey).filter((entry) => entry.targetKind === "session");
	if (requesterBindings.length > 0) {
		lines.push("", "acp/session bindings:", "-----");
		for (const binding of requesterBindings) {
			const label = normalizeOptionalString(binding.metadata?.label) ?? binding.targetSessionKey;
			lines.push(`- ${label} (binding:${binding.conversation.conversationId}, session:${binding.targetSessionKey})`);
		}
	}
	return commandReply(lines.join("\n"));
}
//#endregion
export { handleSubagentsAgentsAction };
