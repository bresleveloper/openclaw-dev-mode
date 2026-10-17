import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { l as rethrowExpectedCliError, r as formatCliJsonFailure, t as ExpectedCliError } from "./failure-output-gtb9zaTk.mjs";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-Bd4757D_.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { T as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, m as resolveConfiguredAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import { a as transformConfigFile } from "./mutate-BkuP-9_H.mjs";
import "./config-9720xhC5.mjs";
import { i as canFallbackToImplicitLocalGateway } from "./gateway-rpc-Cl_Z2Z7Q.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { n as loadGatewayStartupPluginPlanWithMetadata } from "./gateway-startup-plugin-loader-DTE5hf_f.mjs";
import "./channel-plugin-ids-DY8VBQ0g.mjs";
import { r as resolveHookEntries } from "./policy-DntIYegk.mjs";
import { t as summarizeStringEntries } from "./string-sample-BYGbtG9S.mjs";
import { n as decorativePrefix, t as decorativeEmoji } from "./decorative-emoji-DbUbxlxW.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-CvWMfO8o.mjs";
import { t as resolveOptionFromCommand } from "./cli-utils-ClVfZRCr.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { s as withPluginDiagnosticsReport } from "./status-D6dbcWPJ.mjs";
import { t as loadWorkspaceHookEntries } from "./workspace-DbjsEGEK.mjs";
import { t as buildWorkspaceHookStatus } from "./hooks-status-6OtVNQ39.mjs";
import { t as formatCliRequirements } from "./skills-hooks-cli.format-D0aZzj-h.mjs";
import { t as runNativeHookRelayCli } from "./native-hook-relay-cli-XuWej06M.mjs";
//#region src/cli/hooks-cli.format.ts
function formatHookStatus(hook, detailed = false) {
	if (hook.loadable) return theme.success(detailed ? "✓ Ready" : "✓ ready");
	if (!hook.enabledByConfig) return theme.warn(decorativePrefix("⏸", detailed ? "Disabled" : "disabled"));
	const reason = hook.blockedReason && hook.blockedReason !== "missing requirements" ? hook.blockedReason : detailed ? "missing requirements" : "missing";
	return theme.error(`✗ ${detailed ? `${reason.charAt(0).toUpperCase()}${reason.slice(1)}` : reason}`);
}
function formatHookName(hook) {
	const emoji = hook.emoji ?? decorativeEmoji("🔗");
	const name = theme.command(hook.name);
	return emoji ? `${emoji} ${name}` : name;
}
function formatHookSource(hook) {
	if (!hook.managedByPlugin) return hook.source;
	return `plugin:${hook.pluginId ?? "unknown"}`;
}
const HOOK_REQUIREMENT_GROUPS = [
	["bins", "Binaries"],
	["anyBins", "Any binary"],
	["env", "Environment"],
	["config", "Config"],
	["os", "OS"]
];
function formatHookMissingRequirements(hook, itemLimit) {
	const formatEntries = (entries) => itemLimit === void 0 ? entries.join(", ") : summarizeStringEntries({
		entries,
		limit: itemLimit
	});
	return HOOK_REQUIREMENT_GROUPS.filter(([key]) => hook.missing[key].length > 0).map(([key]) => `${key}: ${formatEntries(hook.missing[key])}`);
}
function formatHookMissingSummary(hook, itemLimit) {
	const missing = formatHookMissingRequirements(hook, itemLimit);
	if (hook.enabledByConfig && hook.blockedReason && hook.blockedReason !== "missing requirements") missing.unshift(hook.blockedReason);
	return missing.join("; ");
}
function formatHooksList(report, opts) {
	const hooks = opts.eligible ? report.hooks.filter((h) => h.loadable) : report.hooks;
	if (opts.json) {
		const jsonReport = {
			workspaceDir: report.workspaceDir,
			managedHooksDir: report.managedHooksDir,
			hooks: hooks.map((h) => ({
				name: h.name,
				description: h.description,
				emoji: h.emoji,
				eligible: h.loadable,
				disabled: !h.enabledByConfig,
				enabledByConfig: h.enabledByConfig,
				requirementsSatisfied: h.requirementsSatisfied,
				loadable: h.loadable,
				blockedReason: h.blockedReason,
				source: h.source,
				pluginId: h.pluginId,
				events: h.events,
				unknownEvents: h.unknownEvents,
				homepage: h.homepage,
				missing: h.missing,
				managedByPlugin: h.managedByPlugin
			}))
		};
		return JSON.stringify(jsonReport, null, 2);
	}
	if (hooks.length === 0) return opts.eligible ? `No eligible hooks found. Run \`${formatCliCommand("openclaw hooks list")}\` to see all hooks.` : "No hooks found.";
	const eligible = hooks.filter((h) => h.loadable);
	const tableWidth = getTerminalTableWidth();
	const rows = hooks.map((hook) => ({
		Status: formatHookStatus(hook),
		Hook: formatHookName(hook),
		Description: theme.muted(hook.description),
		Source: formatHookSource(hook),
		Missing: opts.verbose ? theme.warn(formatHookMissingSummary(hook)) : ""
	}));
	const columns = [
		{
			key: "Status",
			header: "Status",
			minWidth: 10
		},
		{
			key: "Hook",
			header: "Hook",
			minWidth: 18,
			flex: true
		},
		{
			key: "Description",
			header: "Description",
			minWidth: 24,
			flex: true
		},
		{
			key: "Source",
			header: "Source",
			minWidth: 12,
			flex: true
		}
	];
	if (opts.verbose) columns.push({
		key: "Missing",
		header: "Missing",
		minWidth: 18,
		flex: true
	});
	return [`${theme.heading("Hooks")} ${theme.muted(`(${eligible.length}/${hooks.length} ready)`)}`, renderTable({
		width: tableWidth,
		columns,
		rows
	}).trimEnd()].join("\n");
}
function formatHookInfo(hook, hookName, opts) {
	if (!hook) {
		if (opts.json) {
			const failure = formatCliJsonFailure(`Hook "${hookName}" not found.`);
			return JSON.stringify({
				...failure,
				hook: hookName
			}, null, 2);
		}
		return `Hook "${hookName}" not found. Run \`${formatCliCommand("openclaw hooks list")}\` to see available hooks.`;
	}
	if (opts.json) return JSON.stringify({
		...hook,
		eligible: hook.loadable,
		disabled: !hook.enabledByConfig
	}, null, 2);
	const emoji = hook.emoji ?? decorativeEmoji("🔗");
	const lines = [
		`${emoji ? `${emoji} ` : ""}${theme.heading(hook.name)} ${formatHookStatus(hook, true)}`,
		"",
		hook.description,
		"",
		theme.heading("Details:"),
		`${theme.muted("  Source:")} ${hook.source}${hook.managedByPlugin ? ` (${hook.pluginId ?? "unknown"})` : ""}`,
		`${theme.muted("  Path:")} ${shortenHomePath(hook.filePath)}`,
		`${theme.muted("  Handler:")} ${shortenHomePath(hook.handlerPath)}`
	];
	if (hook.homepage) lines.push(`${theme.muted("  Homepage:")} ${hook.homepage}`);
	if (hook.events.length > 0) lines.push(`${theme.muted("  Events:")} ${hook.events.join(", ")}`);
	if (hook.unknownEvents.length > 0) lines.push(theme.warn(`  ⚠ Event${hook.unknownEvents.length === 1 ? "" : "s"} not emitted by core (likely typo): ${hook.unknownEvents.join(", ")}`));
	if (hook.managedByPlugin) lines.push(theme.muted("  Managed by plugin; enable/disable via hooks CLI not available."));
	if (hook.blockedReason) lines.push(`${theme.muted("  Blocked reason:")} ${hook.blockedReason}`);
	lines.push(...formatCliRequirements(hook, HOOK_REQUIREMENT_GROUPS, hook.configChecks));
	return lines.join("\n");
}
function formatHooksCheck(report, opts) {
	const eligible = report.hooks.filter((h) => h.loadable);
	const notEligible = report.hooks.filter((h) => !h.loadable);
	if (opts.json) return JSON.stringify({
		total: report.hooks.length,
		eligible: eligible.length,
		notEligible: notEligible.length,
		hooks: {
			eligible: eligible.map((h) => h.name),
			notEligible: notEligible.map((h) => ({
				name: h.name,
				blockedReason: h.blockedReason,
				missing: h.missing
			}))
		}
	}, null, 2);
	const lines = [
		theme.heading("Hooks Status"),
		"",
		`${theme.muted("Total hooks:")} ${report.hooks.length}`,
		`${theme.success("Ready:")} ${eligible.length}`,
		`${theme.warn("Not ready:")} ${notEligible.length}`
	];
	if (notEligible.length > 0) {
		lines.push("");
		lines.push(theme.heading("Hooks not ready:"));
		for (const hook of notEligible) {
			const reasons = formatHookMissingRequirements(hook);
			if (hook.blockedReason && hook.blockedReason !== "missing requirements") reasons.unshift(hook.blockedReason);
			const emoji = hook.emoji ?? decorativeEmoji("🔗");
			lines.push(`  ${emoji ? `${emoji} ` : ""}${hook.name} - ${reasons.join("; ")}`);
		}
	}
	return lines.join("\n");
}
//#endregion
//#region src/cli/hooks-cli.ts
const GATEWAY_HOOKS_STATUS_TIMEOUT_MS = 1500;
function resolveHooksReportTarget(config, rawAgentId) {
	const requested = rawAgentId?.trim();
	if (rawAgentId !== void 0 && !requested) throw new Error("--agent must not be blank");
	const requestedAgentId = requested ? normalizeAgentId(requested) : void 0;
	if (requestedAgentId) resolveConfiguredAgentId(config, requestedAgentId);
	const agentId = requestedAgentId ?? tryResolveLegacyCompatibilityAgentId(config) ?? resolveDefaultAgentId(config, {
		surface: "hooks status reporting",
		hint: "Pass --agent <id> to select a configured agent."
	});
	return {
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(config, agentId)
	};
}
async function withHooksReport(config, target, consume) {
	const workspaceDir = target.workspaceDir;
	const workspaceEntries = loadWorkspaceHookEntries(workspaceDir, { config });
	const startup = loadGatewayStartupPluginPlanWithMetadata({
		config,
		workspaceDir,
		env: process.env
	});
	return withPluginDiagnosticsReport({
		config,
		workspaceDir,
		onlyPluginIds: startup.plan.pluginIds,
		metadataSnapshot: startup.metadataSnapshot
	}, (pluginReport) => {
		const pluginEntries = pluginReport.hooks.map((hook) => hook.entry);
		const entries = resolveHookEntries([...pluginEntries, ...workspaceEntries]);
		return consume(buildWorkspaceHookStatus(workspaceDir, {
			config,
			entries
		}));
	});
}
async function loadHooksReport(agentId, consume) {
	const config = getRuntimeConfig({ skipPluginValidation: true });
	const target = resolveHooksReportTarget(config, agentId);
	const { callGateway } = await import("./call-CWvmXO5x.mjs");
	let report;
	try {
		report = await callGateway({
			config,
			method: "hooks.status",
			params: { agentId: target.agentId },
			timeoutMs: GATEWAY_HOOKS_STATUS_TIMEOUT_MS,
			clientName: GATEWAY_CLIENT_NAMES.CLI,
			mode: GATEWAY_CLIENT_MODES.CLI
		});
	} catch (error) {
		if (!await canFallbackToImplicitLocalGateway({
			config,
			error,
			legacyMethod: "hooks.status",
			legacyAgentId: true
		})) throw error;
		return withHooksReport(config, target, consume);
	}
	return consume(report);
}
function resolveHookSelection(report, hookName) {
	const nameMatches = report.hooks.filter((hook) => hook.name === hookName);
	const matches = nameMatches.length > 0 ? nameMatches : report.hooks.filter((hook) => hook.hookKey === hookName);
	if (matches.length > 1) {
		const candidates = summarizeStringEntries({
			entries: matches.map((hook) => `${hook.name} (${hook.hookKey})`),
			limit: 5
		});
		throw new Error(`Hook "${hookName}" is ambiguous; matches: ${candidates}. Use a unique hook name or hook key.`);
	}
	return matches[0];
}
function writeHooksOutput(value, json) {
	if (json) {
		defaultRuntime.writeStdout(value);
		return;
	}
	defaultRuntime.log(value);
}
async function runOneShotHooksCliAction(action, failureOwner = "command") {
	const result = await action().catch((err) => {
		rethrowExpectedCliError(err);
		const message = formatErrorMessage(err);
		const humanOutput = `${theme.error("Error:")} ${message}`;
		if (failureOwner === "root") throw new ExpectedCliError({
			message,
			humanOutput,
			machineOutput: message
		});
		defaultRuntime.error(humanOutput);
		defaultRuntime.exit(1);
		throw new Error("unreachable");
	});
	requestExitAfterOneShotOutput(defaultRuntime, typeof result === "number" ? result : 0);
}
async function setHookEnabled(hookName, enabled, agentId) {
	const committed = await transformConfigFile({ transform: (config) => withHooksReport(config, resolveHooksReportTarget(config, agentId), (report) => {
		const hook = resolveHookSelection(report, hookName);
		if (!hook) throw new Error(`Hook "${hookName}" not found. Run \`${formatCliCommand("openclaw hooks list")}\` to see available hooks.`);
		if (hook.managedByPlugin) throw new Error(`Hook "${hookName}" is managed by plugin "${hook.pluginId ?? "unknown"}" and cannot be enabled/disabled.`);
		if (enabled && !hook.requirementsSatisfied) {
			const missing = formatHookMissingSummary(hook, 3);
			const installHint = hook.install.length ? ` Install options: ${summarizeStringEntries({
				entries: hook.install.map((option) => option.label),
				limit: 3
			})}.` : "";
			throw new Error(`Hook "${hookName}" is not eligible; missing ${missing}.${installHint} Run \`${formatCliCommand(`openclaw hooks info ${hookName}`)}\` for details.`);
		}
		const entries = { ...config.hooks?.internal?.entries };
		entries[hook.hookKey] = {
			...entries[hook.hookKey],
			enabled
		};
		return {
			nextConfig: {
				...config,
				hooks: {
					...config.hooks,
					internal: {
						...config.hooks?.internal,
						...enabled ? { enabled: true } : {},
						entries
					}
				}
			},
			result: {
				name: hook.name,
				emoji: hook.emoji
			}
		};
	}) });
	const selectedHook = expectDefined(committed.result, "hook mutation result");
	const prefix = enabled ? `${theme.success("✓")} Enabled hook:` : theme.warn(decorativePrefix("⏸", "Disabled hook:"));
	const name = selectedHook.emoji ? `${selectedHook.emoji} ${theme.command(selectedHook.name)}` : decorativePrefix("🔗", theme.command(selectedHook.name));
	defaultRuntime.log(`${prefix} ${name}`);
}
function registerHooksCli(program) {
	const hooks = program.command("hooks").description("Manage internal agent hooks").option("--agent <id>", "Agent id to inspect").option("--json", "Output as JSON", false).addHelpText("after", () => formatDocsHelp("/cli/hooks"));
	const hasJsonOutput = (opts) => Boolean(opts?.json || hooks.opts().json);
	hooks.hook("preAction", (_thisCommand, actionCommand) => {
		const parentAgent = hooks.opts().agent;
		if (parentAgent !== void 0 && !parentAgent.trim()) throw new Error("--agent must not be blank");
		if (parentAgent && actionCommand !== hooks && !(/* @__PURE__ */ new Set([
			"list",
			"info",
			"check",
			"enable",
			"disable"
		])).has(actionCommand.name())) throw new Error(`openclaw hooks ${actionCommand.name()} does not support --agent; the option only selects an owner for read-only hook reports.`);
	});
	const reportAction = (format) => (opts, command) => runOneShotHooksCliAction(async () => {
		const json = hasJsonOutput(opts);
		writeHooksOutput(await loadHooksReport(resolveOptionFromCommand(command, "agent"), (report) => format(report, {
			...opts,
			json
		})), json);
	}, "root");
	const runHooksList = reportAction(formatHooksList);
	hooks.command("list").description("List all hooks").option("--agent <id>", "Agent id to inspect").option("--eligible", "Show only eligible hooks", false).option("--json", "Output as JSON", false).option("-v, --verbose", "Show more details including missing requirements", false).action(runHooksList);
	hooks.command("info <name>").description("Show detailed information about a hook").option("--agent <id>", "Agent id to inspect").option("--json", "Output as JSON", false).action(async (name, opts, command) => runOneShotHooksCliAction(async () => {
		const json = hasJsonOutput(opts);
		const result = await loadHooksReport(resolveOptionFromCommand(command, "agent"), (report) => {
			const hook = resolveHookSelection(report, name);
			return {
				output: formatHookInfo(hook, name, {
					...opts,
					json
				}),
				exitCode: hook ? 0 : 1
			};
		});
		writeHooksOutput(result.output, json);
		return result.exitCode;
	}, "root"));
	hooks.command("check").description("Check hooks eligibility status").option("--agent <id>", "Agent id to inspect").option("--json", "Output as JSON", false).action(reportAction(formatHooksCheck));
	for (const enabled of [true, false]) hooks.command(`${enabled ? "enable" : "disable"} <name>`).description(enabled ? "Enable a hook" : "Disable a hook").option("--agent <id>", "Agent id whose workspace to inspect").action(async (name, _opts, command) => runOneShotHooksCliAction(() => setHookEnabled(name, enabled, resolveOptionFromCommand(command, "agent"))));
	hooks.command("relay", { hidden: true }).description("Internal native harness hook relay").requiredOption("--provider <provider>", "Native harness provider").requiredOption("--relay-id <id>", "Native hook relay id").option("--state-db <path>", "Shared state database path").option("--generation <generation>", "Native hook relay registration generation").requiredOption("--event <event>", "Native hook event").option("--pre-tool-use-unavailable <mode>", "PreToolUse fallback mode when the originating relay is unavailable").option("--timeout <ms>", "Gateway timeout in ms", "5000").action(async (opts) => runOneShotHooksCliAction(() => runNativeHookRelayCli(opts)));
	hooks.command("install").description("Deprecated: install a hook pack via `openclaw plugins install`").argument("<path-or-spec>", "Path to a hook pack or npm package spec").option("-l, --link", "Link a local path instead of copying", false).option("--pin", "Record npm installs as exact resolved <name>@<version>", false).option("--force", "Confirm non-ClawHub sources and overwrite an existing hook pack", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).action(async (raw, opts) => {
		const { runPluginInstallCommand } = await import("./plugins-install-command-BzqGHsQ1.mjs");
		defaultRuntime.log(theme.warn("`openclaw hooks install` is deprecated; use `openclaw plugins install`."));
		await runPluginInstallCommand({
			raw,
			opts,
			allowInstallPolicyWarningPrompt: true,
			invalidateRuntimeCache: false
		});
	});
	hooks.command("update").description("Deprecated: update hook packs via `openclaw plugins update`").argument("[id]", "Hook pack id (omit with --all)").option("--all", "Update all tracked hooks", false).option("--dry-run", "Show what would change without writing", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).action(async (id, opts) => {
		const { runPluginUpdateCommand } = await import("./plugins-update-command-4YMFObEm.mjs");
		defaultRuntime.log(theme.warn("`openclaw hooks update` is deprecated; use `openclaw plugins update`."));
		await runPluginUpdateCommand({
			ids: id ? [id] : [],
			opts
		});
	});
	hooks.action(runHooksList);
}
//#endregion
export { registerHooksCli };
