import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createDedupeCache } from "./dedupe-wpcRBJWZ.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { c as formatUnknownChannelMessage } from "./error-format-B21fL1a_.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { n as resolveMissingOfficialExternalChannelPluginRepairHint, r as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-QFuGb490.mjs";
import { n as getRuntimeVisibleChannelPlugin, r as listRuntimeVisibleChannelPlugins } from "./runtime-visible-channels-CiwNdke1.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-CsLQpkZM.mjs";
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
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return false;
	const entry = channels[channelId];
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
	return entry.enabled !== false;
}
function listConfiguredOfficialExternalRepairHints(cfg) {
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return [];
	return resolveMissingOfficialExternalChannelPluginRepairHints({
		config: cfg,
		channelIds: Object.keys(channels).filter((channelId) => isConfiguredChannel(cfg, channelId))
	});
}
function formatMissingOfficialExternalChannelsMessage(hints) {
	if (hints.length === 1) {
		const hint = hints[0];
		if (!hint) return "";
		return `Configured official external channel ${hint.label} is missing its plugin. ${hint.repairHint}`;
	}
	return `Configured official external channels ${hints.map((hint) => hint.label).join(", ")} are missing their plugins. Run: openclaw doctor --fix, or install individually: ${hints.map((hint) => hint.installCommand).join("; ")}.`;
}
function formatNoConfiguredChannelsMessage() {
	return [
		"Channel is required (no configured channels detected).",
		"Run openclaw channels add to configure one, or pass --channel <channel> after enabling a channel.",
		"Use openclaw channels list --all to see available channel ids."
	].join(" ");
}
function formatMultipleConfiguredChannelsMessage(configured) {
	return [`Channel is required when multiple channels are configured: ${configured.join(", ")}.`, "Pass --channel <channel> to choose one."].join(" ");
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
			account = plugin.config.resolveAccount(cfg, accountId);
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
	if (normalized) {
		const availableExplicit = resolveAvailableChannel({
			cfg: params.cfg,
			value: params.channel,
			agentId: params.agentId
		});
		if (!availableExplicit) {
			const fallback = resolveAvailableChannel({
				cfg: params.cfg,
				value: params.fallbackChannel,
				agentId: params.agentId
			});
			if (fallback) return {
				channel: fallback.channel,
				plugin: fallback.plugin,
				configured: [],
				source: "tool-context-fallback"
			};
			if (!isDeliverableMessageChannel(normalized) && !getRuntimeVisibleChannelPlugin(normalized)) throw new Error(formatUnknownChannelMessage({ channel: normalized }));
			const repairHint = isConfiguredChannel(params.cfg, normalized) ? resolveMissingOfficialExternalChannelPluginRepairHint({
				config: params.cfg,
				channelId: normalized
			}) : null;
			if (repairHint?.channelId === normalized) throw new Error(`Channel is unavailable: ${normalized}. ${repairHint.repairHint}`);
			throw new Error(`Channel is unavailable: ${normalized}`);
		}
		return {
			channel: availableExplicit.channel,
			plugin: availableExplicit.plugin,
			configured: [],
			source: "explicit"
		};
	}
	const fallback = resolveAvailableChannel({
		cfg: params.cfg,
		value: params.fallbackChannel,
		agentId: params.agentId
	});
	if (fallback) return {
		channel: fallback.channel,
		plugin: fallback.plugin,
		configured: [],
		source: "tool-context-fallback"
	};
	const configuredPlugins = await listConfiguredMessageChannelPlugins(params.cfg, params.accountResolution);
	const configured = configuredPlugins.map((plugin) => plugin.id);
	if (configuredPlugins.length === 1) {
		const plugin = expectDefined(configuredPlugins[0], "configured plugin at 0");
		return {
			channel: plugin.id,
			plugin,
			configured,
			source: "single-configured"
		};
	}
	if (configured.length === 0) {
		const repairHints = listConfiguredOfficialExternalRepairHints(params.cfg);
		if (repairHints.length > 0) throw new Error(`Channel is required (no available channels detected). ${formatMissingOfficialExternalChannelsMessage(repairHints)}`);
		throw new Error(formatNoConfiguredChannelsMessage());
	}
	throw new Error(formatMultipleConfiguredChannelsMessage(configured));
}
//#endregion
export { listConfiguredMessageChannels as n, resolveMessageChannelSelection as r, isConfiguredChannel as t };
