import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createDedupeCache } from "./dedupe-5aqLNx3Q.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { n as getRuntimeVisibleChannelPlugin, r as listRuntimeVisibleChannelPlugins } from "./runtime-visible-channels-GGZXKqeN.mjs";
import { n as resolveMissingOfficialExternalChannelPluginRepairHint, r as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-Ue6gYZgR.mjs";
import { r as resolveChannelAccount } from "./account-resolution-akTcFkRf.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-JZ360Soo.mjs";
import { c as formatUnknownChannelMessage } from "./error-format-Cd0oOG4L.mjs";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.mjs";
//#region src/infra/outbound/channel-selection.ts
function isConfiguredChannel(cfg, channelId) {
	const entry = asOptionalRecord(asOptionalRecord(cfg.channels)?.[channelId]);
	return entry !== void 0 && entry.enabled !== false;
}
function listConfiguredOfficialExternalRepairHints(cfg) {
	const channels = asOptionalRecord(cfg.channels);
	if (!channels) return [];
	return resolveMissingOfficialExternalChannelPluginRepairHints({
		config: cfg,
		channelIds: Object.keys(channels).filter((channelId) => isConfiguredChannel(cfg, channelId))
	});
}
function formatMissingOfficialExternalChannelsMessage(hints) {
	const [onlyHint] = hints;
	if (hints.length === 1 && onlyHint) return `Configured official external channel ${onlyHint.label} is missing its plugin. ${onlyHint.repairHint}`;
	return `Configured official external channels ${hints.map((hint) => hint.label).join(", ")} are missing their plugins. Run: openclaw doctor --fix, or install individually: ${hints.map((hint) => hint.installCommand).join("; ")}.`;
}
const loggedChannelSelectionErrors = createDedupeCache({
	ttlMs: 0,
	maxSize: 1024
});
function logChannelSelectionError(pluginId, accountId, operation, error) {
	const message = formatErrorMessage(error);
	const key = `${pluginId}:${accountId}:${operation}:${message}`;
	if (loggedChannelSelectionErrors.check(key)) return;
	defaultRuntime.error?.(`[channel-selection] ${pluginId}(${accountId}) ${operation} failed: ${message}`);
}
async function isPluginConfigured(plugin, cfg, accountResolution) {
	const accountIds = plugin.config.listAccountIds(cfg);
	for (const accountId of accountIds) {
		let operation = "inspectAccount";
		let account;
		try {
			if (accountResolution === "read_only") {
				const inspection = asOptionalRecord(await plugin.config.inspectAccount?.(cfg, accountId));
				if (inspection) {
					if (isAccountEnabled(inspection) && inspection.configured === true) return true;
					continue;
				}
			}
			operation = "resolveAccount";
			account = await resolveChannelAccount({
				plugin,
				cfg,
				accountId
			});
		} catch (error) {
			logChannelSelectionError(plugin.id, accountId, operation, error);
			continue;
		}
		if (!(plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : isAccountEnabled(account))) continue;
		try {
			if (await plugin.config.isConfigured?.(account, cfg) ?? true) return true;
		} catch (error) {
			logChannelSelectionError(plugin.id, accountId, "isConfigured", error);
		}
	}
	return false;
}
async function listConfiguredMessageChannelPlugins(cfg, accountResolution = "strict") {
	const plugins = [];
	for (const plugin of listRuntimeVisibleChannelPlugins()) if (resolveOutboundChannelPlugin({
		channel: plugin.id,
		cfg
	}) && await isPluginConfigured(plugin, cfg, accountResolution)) plugins.push(plugin);
	return plugins;
}
async function listConfiguredMessageChannels(cfg) {
	return (await listConfiguredMessageChannelPlugins(cfg)).map((plugin) => plugin.id);
}
async function resolveMessageChannelSelection(params) {
	const normalized = normalizeMessageChannel(params.channel);
	for (const field of ["channel", "fallbackChannel"]) {
		const cfg = params.cfg;
		const channel = field === "channel" ? normalized : normalizeMessageChannel(params[field]);
		const agentId = params.agentId;
		if (!channel) continue;
		const selectedPlugin = resolveOutboundChannelPlugin({
			channel,
			cfg,
			agentId,
			allowBootstrap: true
		});
		if (selectedPlugin) return {
			channel: selectedPlugin.id,
			plugin: selectedPlugin
		};
	}
	if (normalized) {
		if (!isDeliverableMessageChannel(normalized) && !getRuntimeVisibleChannelPlugin(normalized)) throw new Error(formatUnknownChannelMessage({ channel: normalized }));
		const repairHint = isConfiguredChannel(params.cfg, normalized) ? resolveMissingOfficialExternalChannelPluginRepairHint({
			config: params.cfg,
			channelId: normalized
		}) : null;
		if (repairHint?.channelId === normalized) throw new Error(`Channel is unavailable: ${normalized}. ${repairHint.repairHint}`);
		throw new Error(`Channel is unavailable: ${normalized}`);
	}
	const configuredPlugins = await listConfiguredMessageChannelPlugins(params.cfg, params.accountResolution);
	const configured = configuredPlugins.map((plugin) => plugin.id);
	const [plugin] = configuredPlugins;
	if (configuredPlugins.length === 1 && plugin) return {
		channel: plugin.id,
		plugin
	};
	if (configured.length === 0) {
		const repairHints = listConfiguredOfficialExternalRepairHints(params.cfg);
		if (repairHints.length > 0) throw new Error(`Channel is required (no available channels detected). ${formatMissingOfficialExternalChannelsMessage(repairHints)}`);
		throw new Error("Channel is required (no configured channels detected). Run openclaw channels add to configure one, or pass --channel <channel> after enabling a channel. Use openclaw channels list --all to see available channel ids.");
	}
	throw new Error(`Channel is required when multiple channels are configured: ${configured.join(", ")}. Pass --channel <channel> to choose one.`);
}
//#endregion
export { listConfiguredMessageChannels as n, resolveMessageChannelSelection as r, isConfiguredChannel as t };
