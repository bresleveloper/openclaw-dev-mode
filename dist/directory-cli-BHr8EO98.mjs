import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as danger } from "./globals-XVSoVbNQ.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DYmyl_xH.mjs";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-zYfMjC8g.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-CYrCYT-h.mjs";
import { r as resolveMessageChannelSelection } from "./channel-selection-D2GvoKZ-.mjs";
import { u as getScopedChannelsCommandSecretTargets } from "./command-secret-targets-C_0e9XHi.mjs";
import { r as renderTerminalSafeTable, t as getTerminalTableWidth } from "./table-BerrlExF.mjs";
import { n as formatHelpExamples, t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { i as nullChannelDirectorySelf } from "./directory-adapters-gpw20Qsd.mjs";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-yepx543B.mjs";
import { t as parseAccountSelector } from "./account-selector-DE7PugtW.mjs";
import { t as resolveInstallableChannelPlugin } from "./channel-plugin-resolution-DTgSjH6J.mjs";
import { t as parseChannelSelector } from "./channel-selector-CTI6xK_s.mjs";
import { r as requireValidConfigForWrite } from "./config-validation-CHn1iJgM.mjs";
//#region src/cli/directory-cli.ts
const DIRECTORY_LIST_LABELS = {
	listPeers: [
		"Peers",
		"No peers found",
		"directory peers"
	],
	listGroups: [
		"Groups",
		"No groups found",
		"directory groups"
	],
	listGroupMembers: [
		"Group Members",
		"No group members found",
		"group members listing"
	]
};
function formatDirectoryTable(entries, width) {
	return renderTerminalSafeTable({
		width,
		columns: [{
			key: "ID",
			header: "ID",
			minWidth: 16,
			flex: true
		}, {
			key: "Name",
			header: "Name",
			minWidth: 18,
			flex: true
		}],
		rows: entries.map((entry) => ({
			ID: entry.id,
			Name: normalizeOptionalString(entry.name) ?? ""
		}))
	}).trimEnd();
}
function formatDirectoryScope(channelId, accountId) {
	return `channel ${JSON.stringify(sanitizeTerminalText(channelId))}, account ${JSON.stringify(sanitizeTerminalText(accountId))}`;
}
function printDirectoryList(params) {
	if (params.entries.length === 0) {
		defaultRuntime.log(theme.muted(params.emptyMessage));
		return;
	}
	const tableWidth = getTerminalTableWidth();
	defaultRuntime.log(`${theme.heading(params.title)} ${theme.muted(`(${params.entries.length})`)}`);
	defaultRuntime.log(formatDirectoryTable(params.entries, tableWidth));
}
/** Register directory lookup commands and shared channel/account resolution. */
function registerDirectoryCli(program) {
	const directory = program.command("directory").description("Lookup contact and group IDs (self, peers, groups) for supported chat channels").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw directory self --channel slack", "Show the connected account identity."],
		["openclaw directory peers list --channel slack --query \"alice\"", "Search contact/user IDs by name."],
		["openclaw directory groups list --channel discord", "List available groups/channels."],
		["openclaw directory groups members --channel discord --group-id <id>", "List members for a specific group."]
	])}\n${formatDocsHelp("/cli/directory")}`).action(() => {
		directory.help({ error: true });
	});
	const withChannel = (cmd) => cmd.option("--channel <name>", "Channel (auto when only one is configured)", parseChannelSelector).option("--account <id>", "Account id (accountId)", parseAccountSelector).option("--json", "Output JSON", false);
	const resolve = async (opts) => {
		const writeSnapshot = await requireValidConfigForWrite(defaultRuntime);
		if (!writeSnapshot) return null;
		const autoEnabled = applyPluginAutoEnable({
			config: writeSnapshot.snapshot.sourceConfig,
			env: process.env
		});
		const sourceConfig = autoEnabled.config;
		const explicitChannel = opts.channel?.trim();
		const resolvedExplicit = explicitChannel ? await resolveInstallableChannelPlugin({
			cfg: sourceConfig,
			runtime: defaultRuntime,
			rawChannel: explicitChannel,
			allowInstall: true,
			preferRegisteredPlugin: true,
			supports: (plugin) => Boolean(plugin.directory)
		}) : null;
		if (resolvedExplicit?.configChanged || autoEnabled.changes.length > 0) await commitConfigWithPendingPluginInstalls({
			sourceConfig: resolvedExplicit?.cfg ?? sourceConfig,
			baseHash: writeSnapshot.snapshot.hash,
			writeOptions: writeSnapshot.writeOptions
		});
		const runtimeConfig = await captureRuntimeConfigAsyncReader()();
		const selection = explicitChannel ? {
			channel: resolvedExplicit?.channelId,
			plugin: resolvedExplicit?.plugin
		} : await resolveMessageChannelSelection({
			cfg: runtimeConfig,
			channel: opts.channel ?? null,
			accountResolution: "read_only"
		});
		const selectedChannelId = selection.channel;
		const plugin = selection.plugin;
		if (!plugin) throw new Error(`Unsupported channel: ${String(selectedChannelId)}`);
		const channelId = selectedChannelId ?? plugin.id;
		const accountId = normalizeOptionalString(opts.account) || resolveChannelDefaultAccountId({
			plugin,
			cfg: runtimeConfig
		});
		const secretTargets = getScopedChannelsCommandSecretTargets({
			config: runtimeConfig,
			channel: channelId,
			accountId
		});
		const { effectiveConfig } = await resolveCommandConfigWithSecrets({
			config: runtimeConfig,
			commandName: "directory",
			targetIds: secretTargets.targetIds,
			...secretTargets.allowedPaths ? { allowedPaths: secretTargets.allowedPaths } : {},
			mode: "read_only_operational",
			runtime: defaultRuntime
		});
		return {
			cfg: effectiveConfig,
			channelId,
			accountId,
			plugin
		};
	};
	const runDirectoryList = async (opts, action) => {
		const [title, emptyMessage, unsupported] = DIRECTORY_LIST_LABELS[action];
		const limit = opts.limit === void 0 || opts.limit === null ? null : parseStrictPositiveInteger(opts.limit);
		if (limit === void 0) throw new Error("--limit must be a positive integer.");
		const groupId = normalizeStringifiedOptionalString(opts.groupId) ?? "";
		if (action === "listGroupMembers" && !groupId) throw new Error("Missing --group-id");
		const resolved = await resolve(opts);
		if (!resolved) return;
		const { cfg, channelId, accountId, plugin } = resolved;
		const lookupOptions = {
			cfg,
			accountId,
			limit,
			runtime: defaultRuntime
		};
		const lookup = action === "listGroupMembers" ? plugin.directory?.listGroupMembers?.bind(void 0, {
			...lookupOptions,
			groupId
		}) : (action === "listPeers" ? plugin.directory?.listPeersLive ?? plugin.directory?.listPeers : plugin.directory?.listGroupsLive ?? plugin.directory?.listGroups)?.bind(void 0, {
			...lookupOptions,
			query: opts.query ?? null
		});
		if (!lookup) throw new Error(`Channel ${channelId} does not support ${unsupported}`);
		const result = await lookup();
		if (opts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		printDirectoryList({
			title,
			emptyMessage: `${emptyMessage} for ${action === "listGroupMembers" ? `group ${JSON.stringify(sanitizeTerminalText(groupId))}, ` : ""}${formatDirectoryScope(channelId, accountId)}.`,
			entries: result
		});
	};
	const runDirectoryAction = async (opts, action) => {
		try {
			await action();
		} catch (err) {
			if (opts.json) throw err;
			defaultRuntime.error(danger(formatErrorMessage(err)));
			defaultRuntime.exit(1);
		}
	};
	withChannel(directory.command("self").description("Show the current account user")).action((opts) => runDirectoryAction(opts, async () => {
		const resolved = await resolve({
			channel: opts.channel,
			account: opts.account
		});
		if (!resolved) return;
		const { cfg, channelId, accountId, plugin } = resolved;
		const fn = plugin.directory?.self;
		if (!fn) throw new Error(`Channel ${channelId} does not support directory self`);
		const result = await fn({
			cfg,
			accountId,
			runtime: defaultRuntime
		});
		if (!result) {
			const unsupported = fn === nullChannelDirectorySelf;
			if (opts.json) defaultRuntime.writeJson({
				status: "unavailable",
				channel: channelId,
				accountId,
				reason: unsupported ? "self-identity-unsupported" : "plugin-returned-no-self-identity"
			});
			else defaultRuntime.log(theme.muted(unsupported ? `Channel ${JSON.stringify(sanitizeTerminalText(channelId))} does not expose a self identity.` : `No self identity was returned for ${formatDirectoryScope(channelId, accountId)}. Verify the account is configured and authenticated, then retry.`));
			return;
		}
		if (opts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		const tableWidth = getTerminalTableWidth();
		defaultRuntime.log(theme.heading("Self"));
		defaultRuntime.log(formatDirectoryTable([result], tableWidth));
	}));
	const peers = directory.command("peers").description("Peer directory (contacts/users)");
	const groups = directory.command("groups").description("Group directory");
	for (const [command, action, kind] of [[
		peers,
		"listPeers",
		"peers"
	], [
		groups,
		"listGroups",
		"groups"
	]]) withChannel(command.command("list").description(`List ${kind}`)).option("--query <text>", "Optional search query").option("--limit <n>", "Limit results").action((opts) => runDirectoryAction(opts, () => runDirectoryList(opts, action)));
	withChannel(groups.command("members").description("List group members").requiredOption("--group-id <id>", "Group id")).option("--limit <n>", "Limit results").action((opts) => runDirectoryAction(opts, () => runDirectoryList(opts, "listGroupMembers")));
}
//#endregion
export { registerDirectoryCli };
