import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { t as danger } from "./globals-BXbZ1A_g.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CSQ1bLlx.mjs";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-I97ACS0P.mjs";
import { r as resolveMessageChannelSelection } from "./channel-selection-CUk3wUGA.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-Bm4RKejp.mjs";
import { u as getScopedChannelsCommandSecretTargets } from "./command-secret-targets-CAzJsE9W.mjs";
import { r as renderTerminalSafeTable, t as getTerminalTableWidth } from "./table-CvWMfO8o.mjs";
import { n as formatHelpExamples, t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { i as nullChannelDirectorySelf } from "./directory-adapters-CwR372GJ.mjs";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-DJgrlcp9.mjs";
import { t as parseAccountSelector } from "./account-selector-DE7PugtW.mjs";
import { t as resolveInstallableChannelPlugin } from "./channel-plugin-resolution-BDlzAkDd.mjs";
import { t as parseChannelSelector } from "./channel-selector-CTI6xK_s.mjs";
import { r as requireValidConfigForWrite } from "./config-validation-Cf7I75MX.mjs";
//#region src/cli/directory-cli.ts
function parseLimit(value) {
	if (value === void 0 || value === null) return null;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw new Error("--limit must be a positive integer.");
	return parsed;
}
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
		const runtimeConfig = getRuntimeConfig();
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
	const runDirectoryList = async (params) => {
		const limit = parseLimit(params.opts.limit);
		const groupId = normalizeStringifiedOptionalString(params.groupId) ?? "";
		if (params.action === "listGroupMembers" && !groupId) throw new Error("Missing --group-id");
		const resolved = await resolve(params.opts);
		if (!resolved) return;
		const { cfg, channelId, accountId, plugin } = resolved;
		const lookupOptions = {
			cfg,
			accountId,
			limit,
			runtime: defaultRuntime
		};
		let result;
		if (params.action === "listGroupMembers") {
			const fn = plugin.directory?.listGroupMembers;
			if (!fn) throw new Error(`Channel ${channelId} does not support ${params.unsupported}`);
			result = await fn({
				...lookupOptions,
				groupId
			});
		} else {
			const fn = params.action === "listPeers" ? plugin.directory?.listPeersLive ?? plugin.directory?.listPeers : plugin.directory?.listGroupsLive ?? plugin.directory?.listGroups;
			if (!fn) throw new Error(`Channel ${channelId} does not support ${params.unsupported}`);
			result = await fn({
				...lookupOptions,
				query: params.opts.query ?? null
			});
		}
		if (params.opts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		printDirectoryList({
			title: params.title,
			emptyMessage: `${params.emptyMessage} for ${params.action === "listGroupMembers" ? `group ${JSON.stringify(sanitizeTerminalText(groupId))}, ` : ""}${formatDirectoryScope(channelId, accountId)}.`,
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
	for (const [command, action, kind, title] of [[
		peers,
		"listPeers",
		"peers",
		"Peers"
	], [
		groups,
		"listGroups",
		"groups",
		"Groups"
	]]) withChannel(command.command("list").description(`List ${kind}`)).option("--query <text>", "Optional search query").option("--limit <n>", "Limit results").action((opts) => runDirectoryAction(opts, () => runDirectoryList({
		opts,
		action,
		unsupported: `directory ${kind}`,
		title,
		emptyMessage: `No ${kind} found`
	})));
	withChannel(groups.command("members").description("List group members").requiredOption("--group-id <id>", "Group id")).option("--limit <n>", "Limit results").action((opts) => runDirectoryAction(opts, () => runDirectoryList({
		opts,
		action: "listGroupMembers",
		groupId: opts.groupId,
		unsupported: "group members listing",
		title: "Group Members",
		emptyMessage: "No group members found"
	})));
}
//#endregion
export { registerDirectoryCli };
