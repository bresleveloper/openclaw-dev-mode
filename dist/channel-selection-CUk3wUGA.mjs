import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createDedupeCache } from "./dedupe-qhwfyIea.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-DeTO1ikE.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { n as resolveMissingOfficialExternalChannelPluginRepairHint, r as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-M7Ed27uG.mjs";
import { n as getRuntimeVisibleChannelPlugin, r as listRuntimeVisibleChannelPlugins } from "./runtime-visible-channels-NjzJcucv.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-DMBKJyb_.mjs";
import { n as resolveChannelAccount } from "./account-resolution-DCHDXWZ0.mjs";
import { c as formatUnknownChannelMessage } from "./error-format-BaRMqGR7.mjs";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.mjs";
//#region src/infra/outbound/channel-selection.ts
function resolveAvailableChannel(params) {
	const normalized = normalizeMessageChannel(params.value);
	if (!normalized) return;
	const plugin = resolveOutboundChannelPlugin({
		channel: normalized,
		cfg: params.cfg,
		agentId: params.agentId,
		allowBootstrap: true
	});
	return plugin ? {
		channel: plugin.id,
		plugin
	} : void 0;
}
/** Checks whether a channel has a non-disabled config entry. */
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
function logChannelSelectionError(params) {
	const message = formatErrorMessage(params.error);
	const key = `${params.pluginId}:${params.accountId}:${params.operation}:${message}`;
	if (loggedChannelSelectionErrors.check(key)) return;
	defaultRuntime.error?.(`[channel-selection] ${params.pluginId}(${params.accountId}) ${params.operation} failed: ${message}`);
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
			logChannelSelectionError({
				pluginId: plugin.id,
				accountId,
				operation,
				error
			});
			continue;
		}
		if (!(plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : isAccountEnabled(account))) continue;
		try {
			if (await plugin.config.isConfigured?.(account, cfg) ?? true) return true;
		} catch (error) {
			logChannelSelectionError({
				pluginId: plugin.id,
				accountId,
				operation: "isConfigured",
				error
			});
		}
	}
	return false;
}
async function listConfiguredMessageChannelPlugins(cfg, accountResolution = "strict") {
	const plugins = [];
	for (const plugin of listRuntimeVisibleChannelPlugins()) {
		if (!resolveOutboundChannelPlugin({
			channel: plugin.id,
			cfg
		})) continue;
		if (await isPluginConfigured(plugin, cfg, accountResolution)) plugins.push(plugin);
	}
	return plugins;
}
/** Lists deliverable channels with at least one enabled, configured account. */
async function listConfiguredMessageChannels(cfg) {
	return (await listConfiguredMessageChannelPlugins(cfg)).map((plugin) => plugin.id);
}
/** Resolves the message action channel from explicit input, context fallback, or config. */
async function resolveMessageChannelSelection(params) {
	const normalized = normalizeMessageChannel(params.channel);
	const explicit = normalized ? resolveAvailableChannel({
		cfg: params.cfg,
		value: params.channel,
		agentId: params.agentId
	}) : void 0;
	if (explicit) return {
		...explicit,
		configured: [],
		source: "explicit"
	};
	const fallback = resolveAvailableChannel({
		cfg: params.cfg,
		value: params.fallbackChannel,
		agentId: params.agentId
	});
	if (fallback) return {
		...fallback,
		configured: [],
		source: "tool-context-fallback"
	};
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
		plugin,
		configured,
		source: "single-configured"
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
