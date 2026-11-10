import { r as listChannelPlugins } from "./registry-B91r5qN6.mjs";
import { i as ChannelsStatusResultSchema } from "./channels-DP08Fi-Z.mjs";
import "./plugins-CCVkYF8m.mjs";
import { n as DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS, r as evaluateChannelHealth, t as DEFAULT_CHANNEL_CONNECT_GRACE_MS } from "./channel-health-policy-cv1tBUoD.mjs";
import { Value } from "typebox/value";
//#region src/infra/channels-status-issues.ts
const RUNTIME_ISSUE_MESSAGES = /* @__PURE__ */ new Map([
	["not-running", "Channel is enabled and configured, but its runtime is not running."],
	["disconnected", "Channel reports running, but the runtime is disconnected."],
	["stale-socket", "Channel reports connected, but transport activity is stale; inbound delivery may be broken."],
	["stuck", "Channel runtime appears stuck with stale run activity."]
]);
function resolveIssueAccountId(account) {
	return typeof account.accountId === "string" && account.accountId.trim() ? account.accountId : "default";
}
function collectGenericRuntimeStatusIssues(channel, accounts) {
	const now = Date.now();
	const issues = [];
	for (const account of accounts) {
		if (account.enabled === false || account.configured === false) continue;
		const accountId = resolveIssueAccountId(account);
		if (account.ingressUnavailable === true && !account.terminalDisconnect) {
			issues.push({
				channel,
				accountId,
				kind: "runtime",
				message: "Channel cannot admit inbound events; its durable ingress queue is unavailable. Outbound may still work.",
				fix: "check openclaw logs for the ingress failure, then rerun openclaw doctor"
			});
			continue;
		}
		const health = evaluateChannelHealth(account, {
			channelId: channel,
			now,
			channelConnectGraceMs: DEFAULT_CHANNEL_CONNECT_GRACE_MS,
			staleEventThresholdMs: DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS
		});
		if (health.healthy) continue;
		if (health.reason === "not-running" && account.running !== false) continue;
		const blocked = health.reason === "terminal-disconnect" || health.reason === "blocked";
		const message = blocked ? account.lastError || "Channel runtime is blocked and needs operator action." : RUNTIME_ISSUE_MESSAGES.get(health.reason);
		if (message === void 0) continue;
		issues.push({
			channel,
			accountId,
			kind: "runtime",
			message,
			fix: blocked ? "resolve the reported channel error, then restart the channel" : "restart the channel or gateway"
		});
	}
	return issues;
}
/** Collects generic and plugin-specific issues from a channels status payload. */
function collectChannelStatusIssues(payload, plugins) {
	if (Array.isArray(payload.statusIssues) && Value.Check(ChannelsStatusResultSchema.properties.statusIssues, payload.statusIssues)) return payload.statusIssues;
	const issues = [];
	const accountsByChannel = payload.channelAccounts;
	for (const plugin of plugins ?? listChannelPlugins()) {
		const raw = accountsByChannel?.[plugin.id];
		if (!Array.isArray(raw)) continue;
		const accounts = raw;
		issues.push(...collectGenericRuntimeStatusIssues(plugin.id, accounts));
		const collect = plugin.status?.collectStatusIssues;
		if (collect) issues.push(...collect(accounts));
	}
	return issues;
}
//#endregion
export { collectChannelStatusIssues as t };
