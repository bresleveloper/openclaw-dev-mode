import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as ExpectedCliError } from "./failure-output-gtb9zaTk.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-DoGHpXtD.mjs";
import { m as resolveConfiguredAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-DbRsdayc.mjs";
import { i as normalizeChatChannelId, n as CHAT_CHANNEL_ORDER } from "./ids-BFfFS5ep.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-JwCDUODD.mjs";
import "./registry-B3Y-vjit.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import "./message-channel-j-k-Nup3.mjs";
import "./plugin-registry-Cl9kmLsR.mjs";
import { t as danger } from "./globals-BXbZ1A_g.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { r as callGateway } from "./call-DnqhP17M.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-DLjFn1TE.mjs";
import { r as createMessageActionDiscoveryContext, u as resolveMessageActionDiscoveryForPlugin } from "./message-action-discovery-DWmJ1tG-.mjs";
import { n as resolveChannelAccount } from "./account-resolution-DCHDXWZ0.mjs";
import { c as formatUnknownChannelMessage, l as formatUnsupportedChannelActionMessage } from "./error-format-BaRMqGR7.mjs";
import { r as resolveMessageChannelSelection } from "./channel-selection-D6ROr8H-.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-Bm4RKejp.mjs";
import { a as getChannelsCommandSecretTargetIds } from "./command-secret-targets-C5LZrFZ5.mjs";
import { t as createClackPrompter } from "./clack-prompter-D76Rt341.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DXeKniz_.mjs";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-BYPIp_np.mjs";
import { t as parseAccountSelector } from "./account-selector-DE7PugtW.mjs";
import { t as resolveInstallableChannelPlugin } from "./channel-plugin-resolution-CT2vmPze.mjs";
import { i as withCommandPluginMetadata, n as requireValidConfigFileSnapshot, r as requireValidConfigForWrite } from "./config-validation-rbvSz7RM.mjs";
import { n as readConfiguredParsedLogTail } from "./log-tail-DwxGxkhZ.mjs";
import { n as channelLabel, r as applyChannelAccountRemoval, t as channelsAddCommand } from "./add-5sDP4kSE.mjs";
import { t as persistChannelPluginConfig } from "./plugin-config-persistence-C_AChhZ6.mjs";
import { s as formatChannelAccountLabel } from "./shared-zO2myBLe.mjs";
import { t as channelsListCommand } from "./list-dsTRqDvd.mjs";
import { t as channelsStatusCommand } from "./status-Qh1_W360.mjs";
//#region src/commands/channels/capabilities.ts
const CHANNEL_CAPABILITIES_TIMEOUT_MAX_MS = 3e4;
async function runChannelCapabilitiesProbe(params) {
	try {
		const result = await awaitWithinDeadline(async () => params.run(), Date.now() + params.timeoutMs);
		return result === ABSOLUTE_DEADLINE_EXPIRED ? {
			ok: false,
			timedOut: true,
			error: `probe timed out after ${params.timeoutMs}ms`
		} : result;
	} catch (error) {
		return {
			ok: false,
			error: formatErrorMessage(error)
		};
	}
}
async function runChannelCapabilitiesDiagnostics(params) {
	try {
		const result = await awaitWithinDeadline(async () => params.run(), Date.now() + params.timeoutMs);
		return result === ABSOLUTE_DEADLINE_EXPIRED ? {
			lines: [{
				text: `Diagnostics: timed out after ${params.timeoutMs}ms`,
				tone: "error"
			}],
			details: { timedOut: true }
		} : result;
	} catch (error) {
		return { lines: [{
			text: `Diagnostics: failed (${formatErrorMessage(error)})`,
			tone: "error"
		}] };
	}
}
function formatSupport(capabilities) {
	if (!capabilities) return "unknown";
	const bits = [];
	if (capabilities.chatTypes?.length) bits.push(`chatTypes=${capabilities.chatTypes.join(",")}`);
	for (const capability of [
		"polls",
		"reactions",
		"edit",
		"unsend",
		"reply",
		"effects",
		"groupManagement",
		"threads",
		"media",
		"nativeCommands",
		"blockStreaming"
	]) if (capabilities[capability]) bits.push(capability);
	return bits.length ? bits.join(" ") : "none";
}
function formatGenericProbeLines(probe) {
	if (!probe || typeof probe !== "object") return [];
	const probeObj = probe;
	const ok = typeof probeObj.ok === "boolean" ? probeObj.ok : void 0;
	if (ok === true) return [{ text: "Probe: ok" }];
	if (ok === false) return [{
		text: `Probe: failed${typeof probeObj.error === "string" && probeObj.error ? ` (${probeObj.error})` : ""}`,
		tone: "error"
	}];
	return [];
}
function renderDisplayLine(line) {
	switch (line.tone) {
		case "muted": return theme.muted(line.text);
		case "success": return theme.success(line.text);
		case "warn": return theme.warn(line.text);
		case "error": return theme.error(line.text);
		default: return line.text;
	}
}
async function resolveChannelReports(params) {
	const { plugin, cfg, timeoutMs } = params;
	const accountIds = params.accountOverride ? [params.accountOverride] : (() => {
		const ids = plugin.config.listAccountIds(cfg);
		return ids.length > 0 ? ids : [resolveChannelDefaultAccountId({
			plugin,
			cfg,
			accountIds: ids
		})];
	})();
	const reports = [];
	for (const accountId of accountIds) {
		const resolvedAccount = await resolveChannelAccount({
			plugin,
			cfg,
			accountId
		});
		const configured = plugin.config.isConfigured ? await plugin.config.isConfigured(resolvedAccount, cfg) : Boolean(resolvedAccount);
		const enabled = plugin.config.isEnabled ? plugin.config.isEnabled(resolvedAccount, cfg) : resolvedAccount.enabled !== false;
		let probe;
		if (configured && enabled && plugin.status?.probeAccount) probe = await runChannelCapabilitiesProbe({
			timeoutMs,
			run: () => plugin.status?.probeAccount?.({
				account: resolvedAccount,
				timeoutMs,
				cfg
			})
		});
		const diagnostics = configured && enabled && plugin.status?.buildCapabilitiesDiagnostics ? await runChannelCapabilitiesDiagnostics({
			timeoutMs,
			run: () => plugin.status?.buildCapabilitiesDiagnostics?.({
				account: resolvedAccount,
				timeoutMs,
				cfg,
				probe,
				target: params.target
			})
		}) : void 0;
		const discoveredActions = resolveMessageActionDiscoveryForPlugin({
			pluginId: plugin.id,
			actions: plugin.actions,
			context: createMessageActionDiscoveryContext({
				cfg,
				accountId
			}),
			includeActions: true
		}).actions;
		const actions = Array.from(/* @__PURE__ */ new Set([
			"send",
			"broadcast",
			...discoveredActions
		]));
		reports.push({
			plugin,
			channel: plugin.id,
			accountId,
			accountName: typeof resolvedAccount.name === "string" ? normalizeOptionalString(resolvedAccount.name) : void 0,
			configured,
			enabled,
			support: plugin.capabilities,
			probe,
			actions,
			diagnostics
		});
	}
	return reports;
}
async function resolveCapabilitiesRuntimeConfig(config, runtime) {
	return (await resolveCommandConfigWithSecrets({
		config,
		commandName: "channels",
		targetIds: getChannelsCommandSecretTargetIds(),
		runtime
	})).effectiveConfig;
}
/** Print or serialize configured channel capabilities, actions, and optional health probe details. */
async function channelsCapabilitiesCommand(opts, runtime = defaultRuntime) {
	const rawChannel = normalizeLowercaseStringOrEmpty(opts.channel);
	const canInstall = Boolean(rawChannel && rawChannel !== "all");
	const writeSnapshot = canInstall ? await requireValidConfigForWrite(runtime) : null;
	const configSnapshot = canInstall ? writeSnapshot?.snapshot : await requireValidConfigFileSnapshot(runtime);
	if (!configSnapshot) return;
	let cfg = await resolveCapabilitiesRuntimeConfig(configSnapshot.config, runtime);
	const timeoutMs = Math.min(parseTimeoutMsWithFallback(opts.timeout, 1e4, { invalidType: "error" }), CHANNEL_CAPABILITIES_TIMEOUT_MAX_MS);
	const rawTarget = normalizeOptionalString(opts.target) ?? "";
	if ((!rawChannel || rawChannel === "all") && (opts.account || rawTarget)) {
		const message = `${opts.account ? "--account" : "--target"} requires a specific --channel. Run ${formatCliCommand("openclaw channels list")} to choose one.`;
		throw new ExpectedCliError({
			message,
			humanOutput: danger(message),
			machineOutput: message
		});
	}
	let selected = listReadOnlyChannelPluginsForConfig(cfg, { includeSetupFallbackPlugins: true });
	if (canInstall) {
		const resolved = await resolveInstallableChannelPlugin({
			cfg: configSnapshot.sourceConfig,
			runtime,
			agentId: opts.agent,
			rawChannel,
			allowInstall: true
		});
		if (resolved.configChanged) {
			await persistChannelPluginConfig({
				cfg: resolved.cfg,
				pluginInstalled: resolved.pluginInstalled,
				baseHash: configSnapshot.hash,
				writeOptions: writeSnapshot?.writeOptions,
				runtime
			});
			cfg = await resolveCapabilitiesRuntimeConfig(getRuntimeConfig(), runtime);
		}
		selected = resolved.plugin ? [resolved.plugin] : [];
	}
	if (selected.length === 0) {
		if (!canInstall) {
			if (opts.json) {
				writeRuntimeJson(runtime, { channels: [] });
				return;
			}
			runtime.log(theme.muted(`No configured channel capabilities found. Run ${formatCliCommand("openclaw channels list --all")} to see available channels.`));
			return;
		}
		const message = formatUnknownChannelMessage({ channel: rawChannel });
		throw new ExpectedCliError({
			message,
			humanOutput: danger(message),
			machineOutput: message
		});
	}
	const reports = [];
	for (const plugin of selected) {
		const accountOverride = normalizeOptionalString(opts.account);
		reports.push(...await resolveChannelReports({
			plugin,
			cfg,
			timeoutMs,
			accountOverride,
			target: rawTarget || void 0
		}));
	}
	if (opts.json) {
		writeRuntimeJson(runtime, { channels: reports });
		return;
	}
	const lines = [];
	for (const report of reports) {
		const label = formatChannelAccountLabel({
			channel: report.channel,
			accountId: report.accountId,
			name: report.accountName,
			channelLabel: report.plugin.meta.label ?? report.channel,
			channelStyle: theme.accent,
			accountStyle: theme.heading
		});
		lines.push(theme.heading(label));
		lines.push(`Support: ${formatSupport(report.support)}`);
		lines.push(`Actions: ${report.actions.join(", ")}`);
		if (report.configured === false || report.enabled === false) {
			const configuredLabel = report.configured === false ? "not configured" : "configured";
			const enabledLabel = report.enabled === false ? "disabled" : "enabled";
			lines.push(`Status: ${configuredLabel}, ${enabledLabel}`);
		}
		const formattedProbeLines = report.plugin.status?.formatCapabilitiesProbe?.({ probe: report.probe });
		const probeLines = formattedProbeLines?.length ? formattedProbeLines : formatGenericProbeLines(report.probe);
		if (probeLines.length > 0) lines.push(...probeLines.map(renderDisplayLine));
		else if (report.configured && report.enabled) lines.push(theme.muted("Probe: unavailable"));
		if (report.diagnostics?.lines?.length) lines.push(...report.diagnostics.lines.map(renderDisplayLine));
		lines.push("");
	}
	runtime.log(lines.join("\n").trimEnd());
}
//#endregion
//#region src/commands/channels/logs.ts
const DEFAULT_LIMIT = 200;
const MAX_BYTES = 1e6;
function listManifestChannels() {
	return loadPluginManifestRegistryForPluginRegistry({
		includeDisabled: true,
		env: process.env
	}).plugins.flatMap((plugin) => plugin.channels.flatMap((rawChannel) => {
		const id = normalizeLowercaseStringOrEmpty(rawChannel);
		return id ? [{
			id,
			pluginId: plugin.id
		}] : [];
	}));
}
function parseChannelFilter(raw) {
	if (raw === void 0) return {
		channel: "all",
		pluginIds: /* @__PURE__ */ new Set()
	};
	const trimmed = normalizeLowercaseStringOrEmpty(raw);
	if (trimmed === "all") return {
		channel: "all",
		pluginIds: /* @__PURE__ */ new Set()
	};
	const manifestChannels = listManifestChannels();
	const bundled = normalizeChatChannelId(trimmed);
	const channel = bundled ?? trimmed;
	const pluginIds = new Set(manifestChannels.filter((entry) => entry.id === channel).map((entry) => entry.pluginId));
	if (bundled || pluginIds.size > 0) return {
		channel,
		pluginIds
	};
	const manifestIds = [...new Set(manifestChannels.map((entry) => entry.id))].toSorted();
	const validChannels = ["all", .../* @__PURE__ */ new Set([...CHAT_CHANNEL_ORDER, ...manifestIds])];
	throw new Error(`Unknown channel ${JSON.stringify(raw)}. Valid channels: ${validChannels.join(", ")}`);
}
function matchesChannelContext(value, channel) {
	return [
		channel,
		`channels/${channel}`,
		`gateway/channels/${channel}`
	].some((root) => value === root || value?.startsWith(`${root}/`) === true);
}
function matchesChannel(line, filter) {
	const { channel } = filter;
	if (channel === "all") return true;
	return [line.subsystem, line.module].some((value) => matchesChannelContext(value, channel)) || line.plugin !== void 0 && filter.pluginIds.has(line.plugin);
}
function parseLinesOption(value) {
	if (value === void 0 || value === null) return DEFAULT_LIMIT;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw new Error("--lines must be a positive integer.");
	return parsed;
}
/** Print or serialize recent log lines matching one channel subsystem/module. */
async function channelsLogsCommand(opts, runtime = defaultRuntime) {
	const filter = parseChannelFilter(opts.channel);
	const { channel } = filter;
	const limit = parseLinesOption(opts.lines);
	const tail = await readConfiguredParsedLogTail({
		limit,
		maxBytes: MAX_BYTES,
		filter: (line) => matchesChannel(line, filter)
	});
	const { lines, truncated } = tail;
	if (opts.json) {
		writeRuntimeJson(runtime, {
			file: tail.file,
			channel,
			truncated,
			lines
		});
		return;
	}
	runtime.log(theme.info(`Log file: ${tail.file}`));
	if (channel !== "all") runtime.log(theme.info(`Channel: ${channel}`));
	if (truncated) runtime.log(theme.warn("Log tail truncated; earlier entries were omitted."));
	if (lines.length === 0) {
		runtime.log(theme.muted("No matching log lines."));
		return;
	}
	for (const line of lines) {
		const ts = line.time ? `${line.time} ` : "";
		const level = line.level ? `${normalizeLowercaseStringOrEmpty(line.level)} ` : "";
		runtime.log(`${ts}${level}${line.message}`.trim());
	}
}
//#endregion
//#region src/commands/channels/remove.ts
function formatAccountRemovalErrorMessage(params) {
	const label = channelLabel(params.channel);
	const inspect = `Run ${formatCliCommand(`openclaw channels status --channel ${params.channel}`)} to inspect configured accounts.`;
	const known = params.accountIds.length ? ` Known accounts: ${params.accountIds.join(", ")}.` : "";
	if (params.kind === "nothing-to-remove") return `${label} account "${params.accountId}" has no configuration to delete.${known} ${inspect}`;
	if (!params.requestedAccount) return `${label} has no ${DEFAULT_ACCOUNT_ID} account to remove.${known} Name an account with ${formatCliCommand("--account <id>")}. ${inspect}`;
	return `${label} has no account "${params.requestedAccount}" to remove.${known} ${inspect}`;
}
async function stopGatewayRuntimeBeforeRemove(params) {
	if (!params.shouldStopRuntime) return;
	try {
		await callGateway({
			config: params.cfg,
			method: "channels.stop",
			params: {
				channel: params.channel,
				accountId: params.accountId
			},
			mode: GATEWAY_CLIENT_MODES.BACKEND,
			clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
			deviceIdentity: null
		});
	} catch (error) {
		params.runtime.log(`Could not stop running ${channelLabel(params.channel)} account "${params.accountId}" before removing it: ${formatErrorMessage(error)}`);
	}
}
/** Disable or delete a channel account, stopping gateway runtime state before mutation. */
async function channelsRemoveCommand(opts, runtime = defaultRuntime, params) {
	parseAccountSelector(opts.account);
	const writeSnapshot = await requireValidConfigForWrite(runtime);
	if (!writeSnapshot) return;
	return withCommandPluginMetadata({
		config: writeSnapshot.snapshot.sourceConfig,
		snapshot: writeSnapshot.writeOptions.basePluginMetadataSnapshot
	}, () => removeChannelAccount(writeSnapshot, opts, runtime, params));
}
async function removeChannelAccount(writeSnapshot, opts, runtime, params) {
	const cfg = writeSnapshot.snapshot.sourceConfig;
	const useWizard = params?.hasFlags === false;
	const prompter = useWizard ? createClackPrompter() : null;
	const rawChannel = normalizeOptionalString(opts.channel) ?? "";
	let lookupChannel = rawChannel;
	let channel = normalizeAnyChannelId(rawChannel);
	let accountId = normalizeAccountId(opts.account);
	const deleteConfig = Boolean(opts.delete);
	if (useWizard && prompter) {
		await prompter.intro("Remove channel account");
		const readOnlyPlugins = listReadOnlyChannelPluginsForConfig(cfg, { includeSetupFallbackPlugins: true });
		const selectedChannel = await prompter.select({
			message: "Channel",
			options: readOnlyPlugins.map((plugin) => ({
				value: plugin.id,
				label: plugin.meta.label
			}))
		});
		channel = selectedChannel;
		lookupChannel = selectedChannel;
		const ids = (readOnlyPlugins.find((plugin) => plugin.id === selectedChannel) ?? getChannelPlugin(selectedChannel))?.config.listAccountIds(cfg) ?? [];
		accountId = normalizeAccountId(await prompter.select({
			message: "Account",
			options: ids.map((id) => ({
				value: id,
				label: id === "default" ? "default (primary)" : id
			})),
			initialValue: ids[0] ?? "default"
		}));
		if (!await prompter.confirm({
			message: `Disable ${channelLabel(selectedChannel)} account "${accountId}"? (keeps config)`,
			initialValue: true
		})) {
			await prompter.outro("Cancelled.");
			return;
		}
	} else {
		if (!rawChannel) {
			runtime.error(`Missing channel. Use ${formatCliCommand("openclaw channels remove --channel <name>")} or run ${formatCliCommand("openclaw channels status")} to inspect configured channels.`);
			runtime.exit(1);
			return;
		}
		if (!deleteConfig) {
			const confirm = createClackPrompter();
			const channelPromptLabel = channel ? channelLabel(channel) : rawChannel;
			if (!await confirm.confirm({
				message: `Disable ${channelPromptLabel} account "${accountId}"? (keeps config)`,
				initialValue: true
			})) return;
		}
	}
	const resolvedPluginState = Boolean(lookupChannel || channel) ? await (async () => {
		const { resolveInstallableChannelPlugin } = await import("./channel-plugin-resolution-B62nXZJb.mjs");
		return await resolveInstallableChannelPlugin({
			cfg,
			runtime,
			agentId: opts.agent,
			rawChannel: lookupChannel,
			allowInstall: false
		});
	})() : null;
	const resolvedChannel = resolvedPluginState?.channelId ?? channel;
	if (!resolvedChannel) {
		runtime.error(formatUnknownChannelMessage({ channel: rawChannel }));
		runtime.exit(1);
		return;
	}
	channel = resolvedChannel;
	const plugin = resolvedPluginState?.plugin ?? getChannelPlugin(resolvedChannel);
	if (!plugin) {
		if (resolvedPluginState?.catalogEntry) {
			runtime.error(`Channel plugin "${resolvedPluginState.catalogEntry.id}" is not installed. Run ${formatCliCommand(`openclaw channels add --channel ${resolvedPluginState.catalogEntry.id}`)} first.`);
			runtime.exit(1);
			return;
		}
		runtime.error(formatUnknownChannelMessage({ channel: resolvedChannel }));
		runtime.exit(1);
		return;
	}
	const resolvedChannelId = resolvedChannel;
	const removal = await applyChannelAccountRemoval({
		cfg,
		plugin,
		accountId,
		action: deleteConfig ? "delete" : "disable",
		runtime,
		beforeRemoval: () => stopGatewayRuntimeBeforeRemove({
			cfg,
			channel: resolvedChannelId,
			accountId,
			shouldStopRuntime: Boolean(plugin.gateway?.startAccount || plugin.gateway?.logoutAccount),
			runtime
		})
	});
	if (!removal.ok) {
		if (removal.error.kind !== "unsupported-action") {
			runtime.error(formatAccountRemovalErrorMessage({
				channel: resolvedChannelId,
				kind: removal.error.kind,
				accountId,
				requestedAccount: useWizard ? accountId : normalizeOptionalString(opts.account),
				accountIds: removal.error.accountIds
			}));
			runtime.exit(1);
			return;
		}
		runtime.error(removal.error.action === "delete" ? `${formatUnsupportedChannelActionMessage({
			channel,
			action: "delete"
		})} Use ${formatCliCommand("openclaw channels remove --channel " + channel)} to disable it without deleting config.` : `${formatUnsupportedChannelActionMessage({
			channel,
			action: "disable"
		})} Use ${formatCliCommand("openclaw channels remove --channel " + channel + " --delete")} only if you want to remove config.`);
		runtime.exit(1);
		return;
	}
	await persistChannelPluginConfig({
		cfg: removal.value.nextConfig,
		pluginInstalled: false,
		writeOptions: writeSnapshot.writeOptions,
		baseHash: writeSnapshot.snapshot.hash,
		runtime
	});
	const message = deleteConfig ? `Deleted ${channelLabel(resolvedChannelId)} account "${accountId}".` : `Disabled ${channelLabel(resolvedChannelId)} account "${accountId}".`;
	if (useWizard && prompter) await prompter.outro(message);
	else runtime.log(message);
}
//#endregion
//#region src/commands/channels/resolve.ts
function detectAutoKindForPlugin(input, plugin) {
	const trimmed = input.trim();
	if (trimmed.startsWith("@") || /^<@!?/.test(trimmed) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || /^user:/i.test(trimmed)) return "user";
	try {
		const chatType = plugin.messaging?.inferTargetChatType?.({ to: trimmed });
		if (chatType === "direct") return "user";
		if (chatType === "group" || chatType === "channel") return "group";
	} catch {}
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	const prefixes = [plugin.id, ...plugin.meta?.aliases ?? []].map((entry) => normalizeOptionalLowercaseString(entry)).filter((entry) => Boolean(entry));
	for (const prefix of prefixes) {
		if (!lowered.startsWith(`${prefix}:`)) continue;
		const remainder = lowered.slice(prefix.length + 1);
		if (remainder.startsWith("group:") || remainder.startsWith("channel:") || remainder.startsWith("room:") || remainder.startsWith("conversation:") || remainder.startsWith("spaces/") || remainder.startsWith("channels/")) return "group";
		return "user";
	}
	return "group";
}
function formatResolveResult(result) {
	const name = result.name ? ` (${result.name})` : "";
	const note = result.note ? ` [${result.note}]` : "";
	return `${result.input} -> ${result.id}${name}${note}`;
}
async function channelsResolveCommand(opts, runtime) {
	const entries = normalizeStringEntries(opts.entries);
	if (entries.length === 0) throw new Error(`At least one entry is required. Example: ${formatCliCommand("openclaw channels resolve --channel discord <name-or-id>")}.`);
	const loadedRaw = getRuntimeConfig();
	const requestedAgent = opts.agent?.trim();
	if (opts.agent !== void 0 && !requestedAgent) throw new Error("--agent must not be blank");
	const agentId = requestedAgent ? resolveConfiguredAgentId(loadedRaw, requestedAgent) : void 0;
	const { effectiveConfig: cfg } = await resolveCommandConfigWithSecrets({
		config: loadedRaw,
		commandName: "channels resolve",
		targetIds: getChannelsCommandSecretTargetIds(),
		agentId,
		mode: "read_only_operational",
		runtime,
		autoEnable: true
	});
	const explicitChannel = opts.channel?.trim();
	const resolvedExplicit = explicitChannel ? await resolveInstallableChannelPlugin({
		cfg,
		runtime,
		agentId,
		rawChannel: explicitChannel,
		allowInstall: false,
		supports: (plugin) => Boolean(plugin.resolver?.resolveTargets)
	}) : null;
	if (explicitChannel && resolvedExplicit?.catalogEntry && !resolvedExplicit.plugin) throw new Error(`Channel plugin "${resolvedExplicit.catalogEntry.id}" is not installed. Run ${formatCliCommand(`openclaw channels add --channel ${resolvedExplicit.catalogEntry.id}`)} first.`);
	const selection = explicitChannel ? {
		channel: resolvedExplicit?.channelId,
		plugin: resolvedExplicit?.plugin
	} : await resolveMessageChannelSelection({
		cfg,
		channel: opts.channel ?? null,
		agentId
	});
	const plugin = selection.plugin;
	if (!plugin?.resolver?.resolveTargets) {
		const channelText = selection.channel ?? explicitChannel ?? "";
		throw new Error(formatUnsupportedChannelActionMessage({
			channel: channelText,
			action: "resolve"
		}));
	}
	const preferredKind = !opts.kind || opts.kind === "auto" ? void 0 : opts.kind === "user" ? "user" : "group";
	const byKind = /* @__PURE__ */ new Map();
	if (preferredKind) byKind.set(preferredKind, entries);
	else for (const entry of entries) {
		const kind = detectAutoKindForPlugin(entry, plugin);
		byKind.set(kind, [...byKind.get(kind) ?? [], entry]);
	}
	const resolved = [];
	for (const [kind, inputs] of byKind) resolved.push(...await plugin.resolver.resolveTargets({
		cfg,
		accountId: opts.account ?? null,
		inputs,
		kind,
		runtime
	}));
	let results;
	if (preferredKind) results = resolved.map(({ input, resolved: isResolved, id, name, note }) => ({
		input,
		resolved: isResolved,
		id,
		name,
		note
	}));
	else {
		const byInput = new Map(resolved.map((entry) => [entry.input, entry]));
		results = entries.map((input) => {
			const entry = byInput.get(input);
			return {
				input,
				resolved: entry?.resolved ?? false,
				id: entry?.id,
				name: entry?.name,
				note: entry?.note
			};
		});
	}
	if (opts.json) {
		writeRuntimeJson(runtime, results);
		return;
	}
	for (const result of results) if (result.resolved && result.id) runtime.log(formatResolveResult(result));
	else runtime.error(danger(`${result.input} -> unresolved${result.note ? ` (${result.note})` : ""}`));
}
//#endregion
export { channelsAddCommand, channelsCapabilitiesCommand, channelsListCommand, channelsLogsCommand, channelsRemoveCommand, channelsResolveCommand, channelsStatusCommand };
