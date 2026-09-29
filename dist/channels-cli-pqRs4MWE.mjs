import { i as getCommandArgsWithRootOptions } from "./cli-root-options-vGuJ5JgW.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DszZF2nA.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as normalizeWindowsArgv } from "./windows-argv-C3HwI-HD.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as setVerbose } from "./global-state-BAD7XgmL.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as danger } from "./globals-QODkv80i.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { n as inheritOptionFromParent, t as hasExplicitOptions } from "./command-options-BDuSHeWG.mjs";
import { l as formatUnsupportedChannelActionMessage } from "./error-format-B21fL1a_.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { o as callGateway } from "./call-C_MP4_Gs.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CaqgRIEy.mjs";
import { i as normalizeChannelId, r as listChannelPlugins } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-DDMKSyro.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { t as formatHelpExamples } from "./help-format-Ctl5AOqy.mjs";
import { t as parseAccountSelector } from "./account-selector-DE7PugtW.mjs";
import { t as resolveInstallableChannelPlugin } from "./channel-plugin-resolution-C6WW99tO.mjs";
import { t as parseChannelSelector } from "./channel-selector-CTI6xK_s.mjs";
import { r as requireValidConfigForWrite } from "./config-validation-CdWq9kXm.mjs";
import { t as formatCliChannelOptions } from "./channel-options-Npi7SDvM.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.mjs";
import { Option } from "commander";
//#region src/cli/channel-auth.ts
function supportsChannelAuthMode(plugin, mode) {
	return mode === "login" ? Boolean(plugin.auth?.login) : Boolean(plugin.gateway?.logoutAccount);
}
function isConfiguredAuthPlugin(plugin, cfg) {
	const key = plugin.id;
	if (isBlockedObjectKey(key)) return false;
	const channelCfg = cfg.channels?.[key];
	if (channelCfg && typeof channelCfg === "object" && "enabled" in channelCfg && channelCfg.enabled === false) return false;
	for (const accountId of plugin.config.listAccountIds(cfg)) try {
		const account = plugin.config.resolveAccount(cfg, accountId);
		if (plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : account && typeof account === "object" ? account.enabled ?? true : true) return true;
	} catch {
		continue;
	}
	return false;
}
function resolveConfiguredAuthChannelInput(mode) {
	const cfg = applyPluginAutoEnable({
		config: getRuntimeConfig(),
		env: process.env
	}).config;
	const configured = listChannelPlugins().filter((plugin) => supportsChannelAuthMode(plugin, mode)).filter((plugin) => isConfiguredAuthPlugin(plugin, cfg)).map((plugin) => plugin.id);
	if (configured.length === 1) return expectDefined(configured[0], "configured entry at 0");
	if (configured.length === 0) throw new Error(`No configured channel supports ${mode}. Run ${formatCliCommand("openclaw channels status")} to inspect channels or ${formatCliCommand("openclaw channels add --channel <channel>")} to add one.`);
	const safeIds = configured.map(sanitizeForLog);
	throw new Error(`Multiple configured channels support ${mode}: ${safeIds.join(", ")}. Choose one with --channel <channel>.`);
}
async function resolveChannelPluginForMode(opts, mode, runtime) {
	parseAccountSelector(opts.account);
	parseChannelSelector(opts.channel);
	const writeSnapshot = await requireValidConfigForWrite(runtime);
	if (!writeSnapshot) return null;
	const autoEnabled = applyPluginAutoEnable({
		config: writeSnapshot.snapshot.sourceConfig,
		env: process.env
	});
	const cfg = autoEnabled.config;
	const channelInput = opts.channel?.trim() || resolveConfiguredAuthChannelInput(mode);
	const normalizedChannelId = normalizeChannelId(channelInput);
	const resolved = await resolveInstallableChannelPlugin({
		cfg,
		runtime,
		agentId: opts.agent,
		rawChannel: channelInput,
		...normalizedChannelId ? { channelId: normalizedChannelId } : {},
		allowInstall: true,
		supports: (candidate) => supportsChannelAuthMode(candidate, mode)
	});
	const channelId = resolved.channelId ?? normalizedChannelId;
	if (!channelId) throw new Error(`Unsupported channel "${channelInput}". Run ${formatCliCommand("openclaw channels list")} to see available channels.`);
	const plugin = resolved.plugin;
	if (!plugin || !supportsChannelAuthMode(plugin, mode)) throw new Error(formatUnsupportedChannelActionMessage({
		channel: channelId,
		action: mode,
		inspectCommand: "openclaw channels status --channel " + channelId
	}));
	if (autoEnabled.changes.length > 0 || resolved.configChanged) await commitConfigWithPendingPluginInstalls({
		sourceConfig: resolved.cfg,
		baseHash: writeSnapshot.snapshot.hash,
		writeOptions: writeSnapshot.writeOptions
	});
	return {
		cfg: getRuntimeConfig(),
		channelInput,
		channelId,
		plugin
	};
}
function resolveAccountContext(plugin, opts, cfg) {
	return { accountId: normalizeOptionalString(opts.account) || resolveChannelDefaultAccountId({
		plugin,
		cfg
	}) };
}
function isChannelMissingFromGatewayRegistry(error) {
	const requestError = error;
	return requestError instanceof Error && requestError.name === "GatewayClientRequestError" && requestError.gatewayCode === "INVALID_REQUEST" && requestError.message === "invalid channels.start channel";
}
async function reconcileGatewayRuntimeAfterLocalLogin(params) {
	if (!params.plugin.gateway?.startAccount) return;
	if (params.cfg.gateway?.mode === "remote") {
		params.runtime.log(`Gateway is in remote mode; local login saved auth for ${params.channelId}/${params.accountId} but did not start the remote runtime.`);
		return;
	}
	try {
		const result = await callGateway({
			config: params.cfg,
			method: "channels.start",
			params: {
				channel: params.channelId,
				accountId: params.accountId
			},
			mode: GATEWAY_CLIENT_MODES.BACKEND,
			clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
			deviceIdentity: null
		});
		if (result.outcome && result.outcome.status !== "handed-off") params.runtime.log(`Local login saved auth for ${params.channelId}/${params.accountId}. Gateway start: ${result.outcome.reason}. Check ${formatCliCommand(`openclaw channels status --channel ${params.channelId} --probe`)}.`);
	} catch (error) {
		if (isChannelMissingFromGatewayRegistry(error)) try {
			await callGateway({
				config: params.cfg,
				method: "gateway.restart.request",
				params: { reason: `channel login: load ${params.channelId}` },
				mode: GATEWAY_CLIENT_MODES.BACKEND,
				clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
				deviceIdentity: null
			});
			params.runtime.log(`Gateway restart requested to load ${params.channelId}; the channel will start after restart.`);
			return;
		} catch {}
		params.runtime.log(`Local login saved auth for ${params.channelId}/${params.accountId}, but the running gateway did not restart it: ${formatErrorMessage(error)}`);
	}
}
async function logoutViaGatewayRuntime(params) {
	try {
		return await callGateway({
			config: params.cfg,
			method: "channels.logout",
			params: {
				channel: params.channelId,
				accountId: params.accountId
			},
			mode: GATEWAY_CLIENT_MODES.BACKEND,
			clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
			deviceIdentity: null
		});
	} catch (error) {
		if (params.cfg.gateway?.mode === "remote") throw error;
		params.runtime.log(`Local logout will clear auth for ${params.channelId}/${params.accountId}, but the running gateway did not stop it: ${formatErrorMessage(error)}`);
		return null;
	}
}
async function runChannelLogin(opts, runtime = defaultRuntime) {
	const resolvedChannel = await resolveChannelPluginForMode(opts, "login", runtime);
	if (!resolvedChannel) return;
	const { cfg, channelInput, plugin } = resolvedChannel;
	const login = plugin.auth?.login;
	if (!login) throw new Error(formatUnsupportedChannelActionMessage({
		channel: channelInput,
		action: "login",
		inspectCommand: "openclaw channels status --channel " + channelInput
	}));
	setVerbose(Boolean(opts.verbose));
	const { accountId } = resolveAccountContext(plugin, opts, cfg);
	await login({
		cfg,
		accountId,
		runtime,
		verbose: Boolean(opts.verbose),
		channelInput
	});
	await reconcileGatewayRuntimeAfterLocalLogin({
		cfg,
		plugin,
		channelId: plugin.id,
		accountId,
		runtime
	});
}
async function runChannelLogout(opts, runtime = defaultRuntime) {
	const resolvedChannel = await resolveChannelPluginForMode(opts, "logout", runtime);
	if (!resolvedChannel) return;
	const { cfg, channelInput, plugin } = resolvedChannel;
	const logoutAccount = plugin.gateway?.logoutAccount;
	if (!logoutAccount) throw new Error(formatUnsupportedChannelActionMessage({
		channel: channelInput,
		action: "logout",
		inspectCommand: "openclaw channels status --channel " + channelInput
	}));
	const { accountId } = resolveAccountContext(plugin, opts, cfg);
	let result = await logoutViaGatewayRuntime({
		cfg,
		channelId: plugin.id,
		accountId,
		runtime
	});
	if (!result) result = await logoutAccount({
		cfg,
		accountId,
		account: plugin.config.resolveAccount(cfg, accountId),
		runtime
	});
	const scope = sanitizeForLog(`${plugin.id}/${accountId}`);
	runtime.log(`${result.cleared ? "Cleared saved auth" : "No saved auth was cleared"} for ${scope}.${result.loggedOut === false ? " Other credentials may still be active." : ""}`);
}
//#endregion
//#region src/cli/channels-cli-add-args.ts
const CHANNEL_ADD_SHARED_BOOLEAN_OPTIONS = /* @__PURE__ */ new Set(["--help", "-h"]);
const CHANNEL_ADD_SHARED_VALUE_OPTIONS = /* @__PURE__ */ new Set([
	"--agent",
	"--channel",
	"--account",
	"--name"
]);
const CHANNEL_ADD_SHARED_VALUE_OPTION_PREFIXES = [...CHANNEL_ADD_SHARED_VALUE_OPTIONS].map((flag) => `${flag}=`);
const loadChannelSetupCliOptions = createLazyPromise(() => import("./cli-add-options-Dwfad7bJ.mjs"));
function getChannelSetupOptionSwitches(option) {
	return [option.short, option.long].filter((flag) => Boolean(flag));
}
function resolveChannelSetupFlagArity(flags) {
	return /<[^>]+>|\[[^\]]+\]/u.test(flags) ? "value" : "boolean";
}
function buildChannelSetupFlagArityMap(options) {
	const arityBySwitch = /* @__PURE__ */ new Map();
	const addSwitch = (flag, arity) => {
		const existing = arityBySwitch.get(flag);
		arityBySwitch.set(flag, existing === void 0 || existing === arity ? arity : "conflict");
	};
	for (const option of options) {
		const arity = resolveChannelSetupFlagArity(option.flags);
		for (const flag of getChannelSetupOptionSwitches(new Option(option.flags))) addSwitch(flag, arity);
		if (option.negatedFlags) for (const flag of getChannelSetupOptionSwitches(new Option(option.negatedFlags))) addSwitch(flag, "boolean");
	}
	return arityBySwitch;
}
async function resolveChannelsAddChannelFromArgv(argv) {
	const normalizedArgv = normalizeWindowsArgv(argv);
	const args = getCommandArgsWithRootOptions(normalizedArgv, {
		commandPath: ["channels", "add"],
		valueFlags: ["--agent"],
		mode: "command-path"
	});
	if (!args) return;
	let explicitChannel;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") break;
		if (arg === "--channel") {
			explicitChannel = args[index + 1]?.trim() || explicitChannel;
			index += 1;
			continue;
		}
		if (arg.startsWith("--channel=")) explicitChannel = arg.slice(10).trim() || explicitChannel;
	}
	if (explicitChannel) return explicitChannel;
	let channelFlagArities;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") break;
		if (CHANNEL_ADD_SHARED_VALUE_OPTIONS.has(arg)) {
			index += 1;
			continue;
		}
		if (CHANNEL_ADD_SHARED_VALUE_OPTION_PREFIXES.some((prefix) => arg.startsWith(prefix))) continue;
		if (CHANNEL_ADD_SHARED_BOOLEAN_OPTIONS.has(arg)) continue;
		if (arg.startsWith("-")) {
			if (!channelFlagArities) {
				const { resolveChannelSetupCliOptionMetadata } = await loadChannelSetupCliOptions();
				const { optionCandidates } = resolveChannelSetupCliOptionMetadata(void 0, { includeAll: true });
				channelFlagArities = buildChannelSetupFlagArityMap(optionCandidates);
			}
			const equalsIndex = arg.indexOf("=");
			const optionSwitch = equalsIndex === -1 ? arg : arg.slice(0, equalsIndex);
			const arity = channelFlagArities.get(optionSwitch);
			if (!arity || arity === "conflict") return;
			if (equalsIndex === -1 && arity === "value") index += 1;
			continue;
		}
		return arg;
	}
}
function resolveChannelsAddOptions(channelArg, opts, command, params) {
	const forwardedOpts = command ? Object.fromEntries(Object.entries(opts).filter(([key, value]) => {
		const source = command.getOptionValueSource(key);
		if (source === "cli") return true;
		if (params?.preserveLegacyDefaults !== true || source !== "default" || value === void 0) return false;
		if (value === "") return !params.dropEmptyLegacyDefaultsForAttributeNames?.has(key);
		return true;
	})) : opts;
	return {
		...forwardedOpts,
		channel: forwardedOpts.channel ?? channelArg
	};
}
//#endregion
//#region src/cli/channels-cli.ts
const optionNamesRemove = [
	"channel",
	"account",
	"delete"
];
const CHANNEL_ADD_SELECTION_OPTION_NAMES = /* @__PURE__ */ new Set(["agent", "channel"]);
const LEGACY_CHANNEL_SETUP_OPTIONS = [
	{
		flags: "--token <token>",
		description: "Channel token or credential payload"
	},
	{
		flags: "--token-file <path>",
		description: "Read channel token or credential payload from file"
	},
	{
		flags: "--secret <secret>",
		description: "Channel shared secret"
	},
	{
		flags: "--bot-token <token>",
		description: "Bot token"
	},
	{
		flags: "--app-token <token>",
		description: "App token"
	},
	{
		flags: "--password <password>",
		description: "Channel password or login secret"
	},
	{
		flags: "--cli-path <path>",
		description: "Channel CLI path"
	},
	{
		flags: "--url <url>",
		description: "Channel setup URL"
	},
	{
		flags: "--base-url <url>",
		description: "Channel base URL"
	},
	{
		flags: "--http-url <url>",
		description: "Channel HTTP service URL"
	},
	{
		flags: "--auth-dir <path>",
		description: "Channel auth directory override"
	},
	{
		flags: "--use-env",
		description: "Use env-backed credentials when supported",
		defaultValue: false
	}
];
const loadChannelsCommands = createLazyPromise(() => import("./channels-CxEyBwTb.mjs"));
function runChannelsCommand(action) {
	return runCommandWithRuntime(defaultRuntime, action);
}
function runChannelsCommandWithDanger(action, label) {
	return runCommandWithRuntime(defaultRuntime, action, (err) => {
		defaultRuntime.error(danger(`${label}: ${formatErrorMessage(err)}`));
		defaultRuntime.exit(1);
	});
}
function getOptionNames(command) {
	return command.options.map((option) => option.attributeName());
}
function resolveStringOption(command, name) {
	const source = command.getOptionValueSource(name);
	const localValue = command.getOptionValue(name);
	const value = source && source !== "default" ? localValue : inheritOptionFromParent(command, name) ?? localValue;
	return typeof value === "string" ? value : void 0;
}
function addChannelSetupOption(command, option, seenFlags) {
	const prepared = command.createOption(option.flags, option.description);
	const optionSwitches = getChannelSetupOptionSwitches(prepared);
	if (optionSwitches.some((flag) => seenFlags.has(flag))) return;
	optionSwitches.forEach((flag) => seenFlags.add(flag));
	command.addOption(prepared.makeOptionMandatory(false).default(option.defaultValue));
	if (option.negatedFlags) {
		const negated = command.createOption(option.negatedFlags, option.description);
		const negatedSwitches = getChannelSetupOptionSwitches(negated);
		if (!negatedSwitches.some((flag) => seenFlags.has(flag))) {
			negatedSwitches.forEach((flag) => seenFlags.add(flag));
			command.addOption(negated.makeOptionMandatory(false).default(void 0));
		}
	}
}
function shouldRegisterChannelSetupOptions(argv = process.argv, options = {}) {
	if (options.includeSetupOptions) return true;
	const { commandPath } = resolveCliArgvInvocation(normalizeWindowsArgv(argv));
	return commandPath[0] === "channels" && commandPath[1] === "add";
}
async function addChannelSetupOptions(command, params = {}) {
	const { resolveChannelSetupCliOptionMetadata } = await loadChannelSetupCliOptions();
	const selected = params.channelId?.trim().toLowerCase();
	const { options, selectedChannel, valueMetadataByAttributeName } = resolveChannelSetupCliOptionMetadata(selected, { includeAll: params.includeAll });
	const mode = selected ? selectedChannel?.setup ? "modern" : "legacy" : "none";
	const seenFlags = new Set(command.options.flatMap(getChannelSetupOptionSwitches));
	for (const option of options) addChannelSetupOption(command, option, seenFlags);
	if (params.includeAll || mode === "legacy" && (selectedChannel === void 0 || selectedChannel.setup === void 0)) for (const option of LEGACY_CHANNEL_SETUP_OPTIONS) addChannelSetupOption(command, option, seenFlags);
	const legacyIntDefaultAttributeNames = /* @__PURE__ */ new Set();
	for (const [attributeName, metadata] of valueMetadataByAttributeName) if (metadata.valueType === "int") legacyIntDefaultAttributeNames.add(attributeName);
	return {
		mode,
		legacyIntDefaultAttributeNames
	};
}
async function registerChannelsCli(program, argv = process.argv, options = {}) {
	const channelNames = formatCliChannelOptions();
	const channels = program.command("channels").description("Manage connected chat channels and accounts").option("--agent <id>", "Agent owner for channel commands that require workspace context").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw channels list", "List configured channels."],
		["openclaw channels list --all", "Show configured, bundled, and installable channels."],
		["openclaw channels add", "Open guided channel setup."],
		["openclaw channels status --probe", "Run channel status checks and probes."],
		["openclaw channels add --channel telegram --token <token>", "Add or update a channel account non-interactively."],
		["openclaw channels login --channel whatsapp", "Link a WhatsApp Web account."]
	])}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/channels", "docs.openclaw.ai/cli/channels")}\n`);
	channels.command("list").description("List chat channels (configured by default; pass --all for installable catalog)").option("--all", "Include bundled and installable catalog channels", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runChannelsCommand(async () => {
			const { channelsListCommand } = await import("./list-DRJeJafq.mjs");
			await channelsListCommand(opts, defaultRuntime);
		});
	});
	channels.command("status").description("Show channel status (use openclaw status --deep for a full connection check)").option("--channel <name>", `Only show one channel (${formatCliChannelOptions(["all"])})`).option("--probe", "Probe channel credentials", false).option("--timeout <ms>", "Timeout in ms").option("--json", "Output JSON", false).action(async (opts) => {
		await runChannelsCommand(async () => {
			const { channelsStatusCommand } = await import("./status-JxMILFRO.mjs");
			await channelsStatusCommand(opts, defaultRuntime);
		});
	});
	channels.command("capabilities").description("Show provider capabilities (intents/scopes + supported features)").option("--agent <id>", "Agent owner for channel discovery").option("--channel <name>", `Channel (${formatCliChannelOptions(["all"])})`).option("--account <id>", "Account id (only with --channel)", parseAccountSelector).option("--target <dest>", "Channel target for permission audit (Discord channel:<id>)").option("--timeout <ms>", "Timeout in ms", "10000").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runChannelsCommand(async () => {
			const { channelsCapabilitiesCommand } = await loadChannelsCommands();
			await channelsCapabilitiesCommand({
				...opts,
				agent: resolveStringOption(command, "agent")
			}, defaultRuntime);
		});
	});
	channels.command("resolve").description("Resolve channel/user names to IDs").argument("<entries...>", "Entries to resolve (names or ids)").option("--channel <name>", `Channel (${channelNames})`).option("--account <id>", "Account id (accountId)", parseAccountSelector).option("--agent <id>", "Agent owner for channel resolution").addOption(new Option("--kind <kind>", "Target kind (auto|user|group|channel)").choices([
		"auto",
		"user",
		"group",
		"channel"
	]).default("auto")).option("--json", "Output JSON", false).action(async (entries, opts, command) => {
		await runChannelsCommand(async () => {
			const { channelsResolveCommand } = await loadChannelsCommands();
			await channelsResolveCommand({
				agent: resolveStringOption(command, "agent"),
				channel: opts.channel,
				account: opts.account,
				kind: opts.kind,
				json: Boolean(opts.json),
				entries: Array.isArray(entries) ? entries : [String(entries)]
			}, defaultRuntime);
		});
	});
	channels.command("logs").description("Show recent channel logs from the gateway log file").option("--channel <name>", `Channel (${formatCliChannelOptions(["all"])}; default: all)`).option("--lines <n>", "Number of lines (default: 200)", "200").option("--json", "Output JSON", false).action(async (opts) => {
		await runChannelsCommand(async () => {
			const { channelsLogsCommand } = await loadChannelsCommands();
			await channelsLogsCommand(opts, defaultRuntime);
		});
	});
	const deadLetters = channels.command("dead-letters").description("Inspect and resubmit failed inbound channel events").option("--account <id>", "Account id", "default");
	deadLetters.command("list").description("List failed inbound events for one channel account").requiredOption("--channel <name>", "Channel id").option("--account <id>", "Account id", "default").option("--limit <n>", "Maximum entries", "100").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runChannelsCommand(async () => {
			const { channelsDeadLettersListCommand } = await import("./dead-letters-C60LCLpT.mjs");
			await channelsDeadLettersListCommand({
				...opts,
				account: resolveStringOption(command, "account")
			}, defaultRuntime);
		});
	});
	deadLetters.command("resubmit").description("Re-enqueue one failed inbound event").argument("<event-id>", "Ingress event id").requiredOption("--channel <name>", "Channel id").option("--account <id>", "Account id", "default").option("--json", "Output JSON", false).action(async (eventId, opts, command) => {
		await runChannelsCommand(async () => {
			const { channelsDeadLettersResubmitCommand } = await import("./dead-letters-C60LCLpT.mjs");
			await channelsDeadLettersResubmitCommand(eventId, {
				...opts,
				account: resolveStringOption(command, "account")
			}, defaultRuntime);
		});
	});
	applyParentDefaultHelpAction(deadLetters);
	const addCommand = channels.command("add").description("Add or update a channel account").argument("[channel]", "Channel id").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw channels add", "Open guided setup for available chat channels."],
		["openclaw channels add --channel telegram --token <token>", "Add or update Telegram non-interactively."],
		["openclaw channels list --all", "Find channel ids before using --channel."]
	])}\n`).option("--channel <name>", `Channel (${channelNames})`).option("--agent <id>", "Agent owner for channel setup").option("--account <id>", "Account id (default when omitted)").option("--name <name>", "Display name for this account");
	let channelSetupRegistration = {
		mode: "none",
		legacyIntDefaultAttributeNames: /* @__PURE__ */ new Set()
	};
	const selectedChannelId = await resolveChannelsAddChannelFromArgv(argv);
	if (shouldRegisterChannelSetupOptions(argv, options) && (selectedChannelId !== void 0 || options.includeSetupOptions)) channelSetupRegistration = await addChannelSetupOptions(addCommand, {
		channelId: selectedChannelId,
		includeAll: options.includeSetupOptions
	});
	addCommand.action(async (channelArg, opts, command) => {
		await runChannelsCommand(async () => {
			const { channelsAddCommand } = await loadChannelsCommands();
			const hasFlags = hasExplicitOptions(command, getOptionNames(command).filter((name) => !CHANNEL_ADD_SELECTION_OPTION_NAMES.has(name)));
			await channelsAddCommand({
				...resolveChannelsAddOptions(channelArg, opts, command, channelSetupRegistration.mode === "modern" ? void 0 : {
					preserveLegacyDefaults: true,
					dropEmptyLegacyDefaultsForAttributeNames: channelSetupRegistration.legacyIntDefaultAttributeNames
				}),
				agent: resolveStringOption(command, "agent")
			}, defaultRuntime, { hasFlags });
		});
	});
	channels.command("remove").description("Disable or delete a channel account").option("--agent <id>", "Agent owner for channel discovery").option("--channel <name>", `Channel (${channelNames})`).option("--account <id>", "Account id (default when omitted)").option("--delete", "Delete config entries (no prompt)", false).action(async (opts, command) => {
		await runChannelsCommand(async () => {
			const { channelsRemoveCommand } = await loadChannelsCommands();
			const hasFlags = hasExplicitOptions(command, optionNamesRemove);
			await channelsRemoveCommand({
				...opts,
				agent: resolveStringOption(command, "agent")
			}, defaultRuntime, { hasFlags });
		});
	});
	for (const mode of ["login", "logout"]) {
		const auth = channels.command(mode).description(mode === "login" ? "Link a channel account (if supported)" : "Log out of a channel session (if supported)").option("--agent <id>", "Agent owner for channel discovery").option("--channel <channel>", "Channel alias (auto when only one is configured)").option("--account <id>", "Account id (accountId)");
		if (mode === "login") auth.option("--verbose", "Verbose connection logs", false);
		auth.action(async (opts, command) => {
			await runChannelsCommandWithDanger(() => (mode === "login" ? runChannelLogin : runChannelLogout)({
				agent: resolveStringOption(command, "agent"),
				channel: opts.channel,
				account: opts.account,
				...mode === "login" ? { verbose: Boolean(opts.verbose) } : {}
			}, defaultRuntime), `Channel ${mode} failed`);
		});
	}
	applyParentDefaultHelpAction(channels);
}
//#endregion
export { registerChannelsCli };
