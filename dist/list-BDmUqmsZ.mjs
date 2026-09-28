import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-KhFe5dXK.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as isChannelVisibleInConfiguredLists } from "./channel-meta-BgTks57p.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { o as callGateway } from "./call-C_MP4_Gs.mjs";
import { r as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-B2sBFVIg.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-BvrVstXM.mjs";
import { r as listTrustedChannelPluginCatalogEntries } from "./trusted-catalog-CFYwh8FA.mjs";
import { n as listManifestInstalledChannelIds } from "./discovery-B6rwrffN.mjs";
import { c as requireValidChannelConfig, s as formatChannelAccountLabel, t as NO_CONFIGURED_CHAT_CHANNELS_LINE } from "./shared-B6P66Z06.mjs";
import { r as resolveChannelAccountSnapshot } from "./status-CNILp5Aq.mjs";
import { a as resolveChannelAccountStatusRows, i as normalizeRuntimeChannelAccountSnapshots } from "./read-model-Cye9OM-5.mjs";
//#region src/commands/channels/list.ts
async function readGatewayChannelStatus() {
	try {
		return await callGateway({
			method: "channels.status",
			params: {
				probe: false,
				timeoutMs: 5e3
			},
			timeoutMs: 5e3
		});
	} catch {
		return null;
	}
}
const colorValue = (value) => {
	if (value === "none") return theme.error(value);
	if (value === "env") return theme.accent(value);
	return theme.success(value);
};
function formatEnabled(value) {
	return value === false ? theme.error("disabled") : theme.success("enabled");
}
function formatConfigured(value) {
	return value ? theme.success("configured") : theme.warn("not configured");
}
function formatInstalled(value) {
	return value ? theme.success("installed") : theme.warn("not installed");
}
function formatCredentialSource(source, status) {
	const value = source || "none";
	if (status === "configured_unavailable" && value !== "none") return theme.warn(`${value}-unavailable`);
	return colorValue(value);
}
function formatTokenSource(source, status) {
	return `token=${formatCredentialSource(source, status)}`;
}
function formatSource(label, source, status) {
	return `${label}=${formatCredentialSource(source, status)}`;
}
function formatLinked(value) {
	return value ? theme.success("linked") : theme.warn("not linked");
}
function shouldShowConfigured(channel) {
	return isChannelVisibleInConfiguredLists(channel.meta);
}
function formatAccountLine(params) {
	const { channel, snapshot, installed } = params;
	const label = formatChannelAccountLabel({
		channel: channel.id,
		accountId: snapshot.accountId,
		name: snapshot.name,
		channelLabel: channel.meta.label ?? channel.id,
		channelStyle: theme.accent,
		accountStyle: theme.heading
	});
	const bits = [];
	bits.push(formatInstalled(installed));
	if (shouldShowConfigured(channel) && typeof snapshot.configured === "boolean") bits.push(formatConfigured(snapshot.configured));
	if (typeof snapshot.enabled === "boolean") bits.push(formatEnabled(snapshot.enabled));
	if (snapshot.linked !== void 0) bits.push(formatLinked(snapshot.linked));
	if (snapshot.tokenSource) bits.push(formatTokenSource(snapshot.tokenSource, snapshot.tokenStatus));
	if (snapshot.botTokenSource) bits.push(formatSource("bot", snapshot.botTokenSource, snapshot.botTokenStatus));
	if (snapshot.appTokenSource) bits.push(formatSource("app", snapshot.appTokenSource, snapshot.appTokenStatus));
	if (snapshot.baseUrl) bits.push(`base=${theme.muted(snapshot.baseUrl)}`);
	return `- ${label}: ${bits.join(", ")}`;
}
function formatCatalogOnlyLine(params) {
	const { entry, installed, configured, repairHint } = params;
	const channelText = theme.accent(entry.meta.label ?? entry.id);
	const bits = [
		formatInstalled(installed),
		formatConfigured(configured),
		formatEnabled(false)
	];
	if (repairHint) bits.push(repairHint);
	return `- ${channelText}: ${bits.join(", ")}`;
}
/** Print or serialize configured, available, and installable chat channel accounts. */
async function channelsListCommand(opts, runtime = defaultRuntime) {
	const cfg = await requireValidChannelConfig(runtime, { skipPluginValidation: true });
	if (!cfg) return;
	const showAll = opts.all === true;
	const workspace = resolvePluginControlPlaneWorkspace({
		config: cfg,
		env: process.env
	});
	const workspaceDir = workspace.workspaceDir;
	const metadataSnapshot = resolvePluginMetadataSnapshot({
		config: cfg,
		...workspaceDir ? { workspaceDir } : {},
		env: process.env,
		allowWorkspaceScopedCurrent: true
	});
	const plugins = opts.json ? listReadOnlyChannelPluginsForConfig(cfg, { metadataSnapshot }) : listReadOnlyChannelPluginsForConfig(cfg, {
		includeSetupFallbackPlugins: true,
		metadataSnapshot
	});
	const catalogEntries = listTrustedChannelPluginCatalogEntries({
		cfg,
		...workspaceDir ? { workspaceDir } : {},
		...metadataSnapshot.discovery ? { discovery: metadataSnapshot.discovery } : {},
		...metadataSnapshot.index.installRecords ? { installRecords: metadataSnapshot.index.installRecords } : {}
	});
	const runtimeAccountsByChannel = opts.json === true ? /* @__PURE__ */ new Map() : normalizeRuntimeChannelAccountSnapshots(await readGatewayChannelStatus());
	const manifestInstalledChannelIds = new Set(listManifestInstalledChannelIds({
		cfg,
		...workspaceDir ? { workspaceDir } : {},
		index: metadataSnapshot.index
	}));
	const installedByChannelId = new Map(catalogEntries.map((entry) => [entry.id, manifestInstalledChannelIds.has(entry.id)]));
	const isInstalled = (channelId) => installedByChannelId.get(channelId) ?? true;
	const accountLines = [];
	const accountIdsByPlugin = new Map(plugins.map((plugin) => [plugin.id, plugin.config.listAccountIds(cfg) ?? []]));
	const renderedChannelIds = new Set(plugins.filter((plugin) => (accountIdsByPlugin.get(plugin.id)?.length ?? 0) > 0 || showAll && shouldShowConfigured(plugin)).map((plugin) => plugin.id));
	for (const plugin of opts.json ? [] : plugins) {
		const accountIds = accountIdsByPlugin.get(plugin.id) ?? [];
		if (accountIds && accountIds.length > 0) {
			const runtimeAccounts = runtimeAccountsByChannel.get(plugin.id) ?? [];
			const rows = await resolveChannelAccountStatusRows({
				localAccountIds: accountIds,
				runtimeAccounts,
				resolveLocalSnapshot: (accountId) => resolveChannelAccountSnapshot({
					plugin,
					cfg,
					accountId
				})
			});
			for (const row of rows) accountLines.push({
				plugin,
				snapshot: row.snapshot,
				installed: isInstalled(plugin.id)
			});
			continue;
		}
		if (!showAll) continue;
		if (!shouldShowConfigured(plugin)) continue;
		const snapshot = await resolveChannelAccountSnapshot({
			plugin,
			cfg,
			accountId: "default"
		});
		const runtimeSnapshot = runtimeAccountsByChannel.get(plugin.id)?.find((account) => account.accountId === "default");
		accountLines.push({
			plugin,
			snapshot: runtimeSnapshot ?? snapshot,
			installed: isInstalled(plugin.id)
		});
	}
	const catalogOnlyEntries = catalogEntries.filter((entry) => !renderedChannelIds.has(entry.id));
	const repairHintsByChannelId = new Map(resolveMissingOfficialExternalChannelPluginRepairHints({
		config: cfg,
		channelIds: catalogOnlyEntries.map((entry) => entry.id),
		...workspaceDir ? { workspaceDir } : {},
		manifestRecords: metadataSnapshot.plugins
	}).map((hint) => [hint.channelId, hint]));
	const catalogOnlyLines = catalogOnlyEntries.map((entry) => {
		const hint = repairHintsByChannelId.get(entry.id);
		return {
			entry,
			installed: isInstalled(entry.id),
			configured: Boolean(hint),
			repairHint: hint ? `run ${hint.installCommand} or ${hint.doctorFixCommand}` : void 0
		};
	}).filter((line) => showAll || line.configured);
	if (opts.json) {
		const chat = {};
		const catalogById = new Map(catalogEntries.map((entry) => [entry.id, entry]));
		for (const plugin of plugins) {
			const accountIds = accountIdsByPlugin.get(plugin.id) ?? [];
			const installed = isInstalled(plugin.id);
			const catalog = catalogById.get(plugin.id);
			const metadata = {
				label: catalog?.meta.label ?? plugin.meta.label,
				...catalog?.officialDocsPath ? { docsPath: catalog.officialDocsPath } : {}
			};
			if (accountIds && accountIds.length > 0) chat[plugin.id] = {
				accounts: accountIds,
				...metadata,
				installed,
				origin: "configured"
			};
			else if (showAll && shouldShowConfigured(plugin)) chat[plugin.id] = {
				accounts: [],
				...metadata,
				installed,
				origin: "available"
			};
		}
		for (const line of catalogOnlyLines) chat[line.entry.id] = {
			accounts: [],
			label: line.entry.meta.label,
			...line.entry.officialDocsPath ? { docsPath: line.entry.officialDocsPath } : {},
			installed: line.installed,
			origin: line.configured ? "configured" : line.installed ? "available" : "installable"
		};
		writeRuntimeJson(runtime, {
			chat,
			...workspace.diagnostic ? { diagnostics: [workspace.diagnostic] } : {}
		});
		return;
	}
	const lines = [];
	lines.push(theme.heading("Chat channels:"));
	if (workspace.diagnostic) lines.push(theme.warn(`- ${workspace.diagnostic.message}`));
	if (accountLines.length === 0 && catalogOnlyLines.length === 0) lines.push(theme.muted(showAll ? "- no chat channels found" : NO_CONFIGURED_CHAT_CHANNELS_LINE));
	else {
		for (const line of accountLines) lines.push(formatAccountLine({
			channel: line.plugin,
			snapshot: line.snapshot,
			installed: line.installed
		}));
		for (const line of catalogOnlyLines) lines.push(formatCatalogOnlyLine({
			entry: line.entry,
			installed: line.installed,
			configured: line.configured,
			...line.repairHint ? { repairHint: line.repairHint } : {}
		}));
	}
	runtime.log(lines.join("\n"));
	runtime.log("");
	runtime.log(theme.muted("Model provider usage moved out of `channels list` — see `openclaw status` or `openclaw models list`."));
	runtime.log(`Docs: ${formatDocsLink("/gateway/configuration", "gateway/configuration")}`);
}
//#endregion
export { channelsListCommand as t };
