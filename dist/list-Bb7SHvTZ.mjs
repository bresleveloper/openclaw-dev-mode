import { o as writeRuntimeJson, r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { n as isChannelVisibleInConfiguredLists } from "./channel-meta-Z2puM9_M.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-DZuGS_2S.mjs";
import { t as listPluginContributionIds } from "./plugin-registry-contributions-BDlJJbko.mjs";
import "./plugin-registry-BKRXR0Si.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-Ue6gYZgR.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import { r as callGateway } from "./call-b1jzw5fz.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-BTHRPuD9.mjs";
import { r as listTrustedChannelPluginCatalogEntries } from "./trusted-catalog-DzZMrVDM.mjs";
import { c as requireValidChannelConfig, s as formatChannelAccountLabel, t as NO_CONFIGURED_CHAT_CHANNELS_LINE } from "./shared-BrF4w8qF.mjs";
import { r as resolveChannelAccountSnapshot } from "./status-Dlx2ocaa.mjs";
import { a as resolveChannelAccountStatusRows, i as normalizeRuntimeChannelAccountSnapshots } from "./read-model-gNfylNK1.mjs";
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
function formatEnabled(value) {
	return value === false ? theme.error("disabled") : theme.success("enabled");
}
function formatPresence(label, value) {
	return value ? theme.success(label) : theme.warn(`not ${label}`);
}
function formatSource(label, source, status) {
	const value = source || "none";
	return `${label}=${value === "none" ? theme.error(value) : status === "configured_unavailable" ? theme.warn(`${value}-unavailable`) : value === "env" ? theme.accent(value) : theme.success(value)}`;
}
function formatAccountLine(params) {
	const { plugin: channel, snapshot, installed } = params;
	const label = formatChannelAccountLabel({
		channel: channel.id,
		accountId: snapshot.accountId,
		name: snapshot.name,
		channelLabel: channel.meta.label ?? channel.id,
		channelStyle: theme.accent,
		accountStyle: theme.heading
	});
	const bits = [formatPresence("installed", installed)];
	if (isChannelVisibleInConfiguredLists(channel.meta) && typeof snapshot.configured === "boolean") bits.push(formatPresence("configured", snapshot.configured));
	if (typeof snapshot.enabled === "boolean") bits.push(formatEnabled(snapshot.enabled));
	if (snapshot.linked !== void 0) bits.push(formatPresence("linked", snapshot.linked));
	if (snapshot.tokenSource) bits.push(formatSource("token", snapshot.tokenSource, snapshot.tokenStatus));
	if (snapshot.botTokenSource) bits.push(formatSource("bot", snapshot.botTokenSource, snapshot.botTokenStatus));
	if (snapshot.appTokenSource) bits.push(formatSource("app", snapshot.appTokenSource, snapshot.appTokenStatus));
	if (snapshot.baseUrl) bits.push(`base=${theme.muted(snapshot.baseUrl)}`);
	return `- ${label}: ${bits.join(", ")}`;
}
async function channelsListCommand(opts, runtime = defaultRuntime) {
	const cfg = await requireValidChannelConfig(runtime);
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
	const plugins = listReadOnlyChannelPluginsForConfig(cfg, {
		...!opts.json ? { includeSetupFallbackPlugins: true } : {},
		metadataSnapshot
	});
	const catalogEntries = listTrustedChannelPluginCatalogEntries({
		cfg,
		...workspaceDir ? { workspaceDir } : {},
		...metadataSnapshot.discovery ? { discovery: metadataSnapshot.discovery } : {},
		...metadataSnapshot.index.installRecords ? { installRecords: metadataSnapshot.index.installRecords } : {}
	});
	const runtimeAccountsByChannel = opts.json === true ? /* @__PURE__ */ new Map() : normalizeRuntimeChannelAccountSnapshots(await readGatewayChannelStatus());
	const manifestInstalledChannelIds = new Set(listPluginContributionIds({
		contribution: "channels",
		includeDisabled: true,
		lookUpTable: metadataSnapshot
	}));
	const installedByChannelId = new Map(catalogEntries.map((entry) => [entry.id, manifestInstalledChannelIds.has(entry.id)]));
	const isInstalled = (channelId) => installedByChannelId.get(channelId) ?? true;
	const accountLines = [];
	const accountIdsByPlugin = new Map(plugins.map((plugin) => [plugin.id, plugin.config.listAccountIds(cfg) ?? []]));
	const renderedPlugins = plugins.filter((plugin) => (accountIdsByPlugin.get(plugin.id)?.length ?? 0) > 0 || showAll && isChannelVisibleInConfiguredLists(plugin.meta));
	const renderedChannelIds = new Set(renderedPlugins.map((plugin) => plugin.id));
	for (const plugin of opts.json ? [] : renderedPlugins) {
		const accountIds = accountIdsByPlugin.get(plugin.id) ?? [];
		let rows;
		if (accountIds.length > 0) {
			const runtimeAccounts = runtimeAccountsByChannel.get(plugin.id) ?? [];
			rows = await resolveChannelAccountStatusRows({
				localAccountIds: accountIds,
				runtimeAccounts,
				resolveLocalSnapshot: (accountId) => resolveChannelAccountSnapshot({
					plugin,
					cfg,
					accountId
				})
			});
		} else {
			const snapshot = await resolveChannelAccountSnapshot({
				plugin,
				cfg,
				accountId: "default"
			});
			rows = [{ snapshot: runtimeAccountsByChannel.get(plugin.id)?.find((account) => account.accountId === "default") ?? snapshot }];
		}
		for (const { snapshot } of rows) accountLines.push({
			plugin,
			snapshot,
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
		for (const plugin of renderedPlugins) {
			const accountIds = accountIdsByPlugin.get(plugin.id) ?? [];
			const installed = isInstalled(plugin.id);
			const catalog = catalogById.get(plugin.id);
			const metadata = {
				label: catalog?.meta.label ?? plugin.meta.label,
				...catalog?.officialDocsPath ? { docsPath: catalog.officialDocsPath } : {}
			};
			chat[plugin.id] = {
				accounts: accountIds,
				...metadata,
				installed,
				origin: accountIds.length > 0 ? "configured" : "available"
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
		for (const line of accountLines) lines.push(formatAccountLine(line));
		for (const { entry, installed, configured, repairHint } of catalogOnlyLines) {
			const bits = [
				formatPresence("installed", installed),
				formatPresence("configured", configured),
				formatEnabled(false)
			];
			if (repairHint) bits.push(repairHint);
			lines.push(`- ${theme.accent(sanitizeTerminalText(entry.meta.label ?? entry.id))}: ${bits.join(", ")}`);
		}
	}
	runtime.log(lines.join("\n"));
	runtime.log("");
	runtime.log(theme.muted("Model provider usage moved out of `channels list` — see `openclaw status` or `openclaw models list`."));
	runtime.log(`Docs: ${formatDocsLink("/gateway/configuration", "gateway/configuration")}`);
}
//#endregion
export { channelsListCommand };
