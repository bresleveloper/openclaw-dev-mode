import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as getCommandPositionalsWithRootOptions, s as isValueToken } from "./cli-root-options-vGuJ5JgW.mjs";
import { i as MODELS_PARENT_VALUE_FLAGS, r as MODELS_PARENT_BOOLEAN_FLAGS } from "./config-output-mode-DrhJ7F5x.mjs";
import { i as getPositiveIntFlagValue, o as getVerboseFlag, r as getFlagValue, s as hasFlag } from "./argv-IYTsfFsq.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DszZF2nA.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { i as tryParseLogLevel } from "./levels-qpAN12Fm.mjs";
import { t as parseGatewayPortOption } from "./gateway-port-option-BydhPR1U.mjs";
import { i as cliCommandCatalog, r as matchesCommandPath } from "./command-path-policy-CrthWODq.mjs";
import { t as resolveCliStartupPolicy } from "./command-startup-policy-gB_2DGw2.mjs";
import { n as ensureCliExecutionBootstrap, t as applyCliExecutionStartupPresentation } from "./command-execution-startup-BVq3u9D6.mjs";
//#region src/cli/program/route-args.ts
function parseOptionalFlagValue(argv, name) {
	const value = getFlagValue(argv, name);
	if (value === null) return { ok: false };
	return {
		ok: true,
		value
	};
}
function parseRepeatedFlagValues(argv, name) {
	const values = [];
	const args = argv.slice(2);
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (!arg || arg === "--") break;
		if (arg === name) {
			const next = args[i + 1];
			if (next === void 0 || !isValueToken(next)) return null;
			values.push(next);
			i += 1;
			continue;
		}
		if (arg.startsWith(`${name}=`)) {
			const value = arg.slice(name.length + 1).trim();
			if (!value) return null;
			values.push(value);
		}
	}
	return values;
}
function getRoutedCommandPositionals(argv, shape) {
	if (argv.slice(2).includes("--")) return null;
	return getCommandPositionalsWithRootOptions(argv, shape);
}
function parseSinglePositional(argv, params) {
	const positionals = getRoutedCommandPositionals(argv, params);
	if (!positionals || positionals.length !== 1) return null;
	return positionals[0] ?? null;
}
/** Parse `openclaw health` flags for the route-first status family. */
function parseHealthRouteArgs(argv) {
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath: ["health"],
		booleanFlags: [
			"--json",
			"--verbose",
			"--debug"
		],
		valueFlags: ["--timeout"]
	});
	if (!positionals || positionals.length !== 0) return null;
	const timeoutMs = getPositiveIntFlagValue(argv, "--timeout");
	if (timeoutMs === null) return null;
	return {
		json: hasFlag(argv, "--json"),
		verbose: getVerboseFlag(argv, { includeDebug: true }),
		timeoutMs
	};
}
/** Parse `openclaw status` flags without registering the full command tree. */
function parseStatusRouteArgs(argv) {
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath: ["status"],
		booleanFlags: [
			"--json",
			"--deep",
			"--all",
			"--usage",
			"--verbose",
			"--debug"
		],
		valueFlags: ["--timeout", "--agent"]
	});
	if (!positionals || positionals.length !== 0) return null;
	const timeoutMs = getPositiveIntFlagValue(argv, "--timeout");
	if (timeoutMs === null) return null;
	const agent = parseOptionalFlagValue(argv, "--agent");
	if (!agent.ok) return null;
	return {
		json: hasFlag(argv, "--json"),
		deep: hasFlag(argv, "--deep"),
		all: hasFlag(argv, "--all"),
		usage: hasFlag(argv, "--usage"),
		...agent.value !== void 0 ? { agent: agent.value } : {},
		verbose: getVerboseFlag(argv, { includeDebug: true }),
		timeoutMs
	};
}
/** Parse `openclaw gateway status` RPC-only flags accepted by the fast route. */
function parseGatewayStatusRouteArgs(argv) {
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath: ["gateway", "status"],
		booleanFlags: [
			"--deep",
			"--json",
			"--require-rpc",
			"--no-probe",
			"--ssh-auto"
		],
		valueFlags: [
			"--url",
			"--token",
			"--password",
			"--timeout",
			"--ssh",
			"--ssh-identity"
		]
	});
	if (!positionals || positionals.length !== 0) return null;
	const url = parseOptionalFlagValue(argv, "--url");
	if (!url.ok) return null;
	const token = parseOptionalFlagValue(argv, "--token");
	if (!token.ok) return null;
	const password = parseOptionalFlagValue(argv, "--password");
	if (!password.ok) return null;
	const timeout = parseOptionalFlagValue(argv, "--timeout");
	if (!timeout.ok) return null;
	const ssh = parseOptionalFlagValue(argv, "--ssh");
	if (!ssh.ok || ssh.value !== void 0) return null;
	const sshIdentity = parseOptionalFlagValue(argv, "--ssh-identity");
	if (!sshIdentity.ok || sshIdentity.value !== void 0) return null;
	if (hasFlag(argv, "--ssh-auto")) return null;
	return {
		rpc: {
			url: url.value,
			token: token.value,
			password: password.value,
			timeout: timeout.value
		},
		deep: hasFlag(argv, "--deep"),
		json: hasFlag(argv, "--json"),
		requireRpc: hasFlag(argv, "--require-rpc"),
		probe: !hasFlag(argv, "--no-probe")
	};
}
/** Parse machine-readable `openclaw gateway health` calls for route-first execution. */
function parseGatewayHealthRouteArgs(argv) {
	if (!hasFlag(argv, "--json")) return null;
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath: ["gateway", "health"],
		booleanFlags: ["--expect-final", "--json"],
		valueFlags: [
			"--url",
			"--token",
			"--password",
			"--timeout",
			"--port"
		]
	});
	if (!positionals || positionals.length !== 0) return null;
	const url = parseOptionalFlagValue(argv, "--url");
	const token = parseOptionalFlagValue(argv, "--token");
	const password = parseOptionalFlagValue(argv, "--password");
	const timeout = parseOptionalFlagValue(argv, "--timeout");
	const port = parseOptionalFlagValue(argv, "--port");
	if (!url.ok || !token.ok || !password.ok || !timeout.ok || !port.ok) return null;
	if (timeout.value !== void 0 && parseStrictPositiveInteger(timeout.value) === void 0) return null;
	let localPortOverride;
	if (port.value !== void 0) {
		try {
			localPortOverride = parseGatewayPortOption(port.value);
		} catch {
			return null;
		}
		if (localPortOverride === void 0) return null;
	}
	if (url.value && localPortOverride !== void 0) return null;
	return {
		rpc: {
			url: url.value,
			token: token.value,
			password: password.value,
			timeout: timeout.value ?? "10000",
			expectFinal: hasFlag(argv, "--expect-final"),
			json: true
		},
		localPortOverride
	};
}
/** Parse `openclaw sessions` filters for JSON/list route execution. */
function parseSessionsRouteArgs(argv) {
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath: ["sessions"],
		booleanFlags: ["--json", "--all-agents"],
		valueFlags: [
			"--agent",
			"--store",
			"--active",
			"--limit"
		]
	});
	if (!positionals || positionals.length !== 0) return null;
	const agent = parseOptionalFlagValue(argv, "--agent");
	if (!agent.ok) return null;
	const store = parseOptionalFlagValue(argv, "--store");
	if (!store.ok) return null;
	const active = parseOptionalFlagValue(argv, "--active");
	if (!active.ok) return null;
	const limit = parseOptionalFlagValue(argv, "--limit");
	if (!limit.ok) return null;
	return {
		json: hasFlag(argv, "--json"),
		allAgents: hasFlag(argv, "--all-agents"),
		agent: agent.value,
		store: store.value,
		active: active.value,
		limit: limit.value
	};
}
/** Parse `openclaw agents list` display switches for route-first execution. */
function parseAgentsListRouteArgs(argv) {
	const listPositionals = getRoutedCommandPositionals(argv, {
		commandPath: ["agents", "list"],
		booleanFlags: [
			"--json",
			"--bindings",
			"--tree"
		]
	});
	if (listPositionals && listPositionals.length === 0) return {
		json: hasFlag(argv, "--json"),
		bindings: hasFlag(argv, "--bindings"),
		tree: hasFlag(argv, "--tree")
	};
	return getRoutedCommandPositionals(argv, {
		commandPath: ["agents"],
		booleanFlags: [
			"--json",
			"--bindings",
			"--tree"
		]
	})?.length === 0 ? {
		json: hasFlag(argv, "--json"),
		bindings: hasFlag(argv, "--bindings"),
		tree: hasFlag(argv, "--tree")
	} : null;
}
/** Parse `openclaw config get <path>` while preserving root option handling. */
function parseConfigGetRouteArgs(argv) {
	const path = parseSinglePositional(argv, {
		commandPath: ["config", "get"],
		booleanFlags: ["--json"]
	});
	if (!path) return null;
	return {
		path,
		json: hasFlag(argv, "--json")
	};
}
/** Parse `openclaw config unset <path>` and its mutation guard flags. */
function parseConfigUnsetRouteArgs(argv) {
	const path = parseSinglePositional(argv, {
		commandPath: ["config", "unset"],
		booleanFlags: [
			"--dry-run",
			"--allow-exec",
			"--json"
		]
	});
	if (!path) return null;
	return {
		path,
		cliOptions: {
			dryRun: hasFlag(argv, "--dry-run"),
			allowExec: hasFlag(argv, "--allow-exec"),
			json: hasFlag(argv, "--json")
		}
	};
}
/** Parse `openclaw models list` filters for the lightweight model catalog route. */
function parseModelsListRouteArgs(argv) {
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath: ["models", "list"],
		booleanFlags: [
			"--all",
			"--local",
			"--json",
			"--plain"
		],
		valueFlags: ["--provider"]
	});
	if (!positionals || positionals.length !== 0) return null;
	const provider = parseOptionalFlagValue(argv, "--provider");
	if (!provider.ok) return null;
	return {
		provider: provider.value,
		all: hasFlag(argv, "--all"),
		local: hasFlag(argv, "--local"),
		json: hasFlag(argv, "--json"),
		plain: hasFlag(argv, "--plain")
	};
}
function parseModelsRootStatusRouteArgs(argv) {
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath: ["models"],
		booleanFlags: MODELS_PARENT_BOOLEAN_FLAGS,
		valueFlags: MODELS_PARENT_VALUE_FLAGS
	});
	if (!positionals || positionals.length !== 0) return null;
	const agent = parseOptionalFlagValue(argv, "--agent");
	if (!agent.ok) return null;
	return {
		agent: agent.value,
		json: hasFlag(argv, "--json") || hasFlag(argv, "--status-json"),
		plain: hasFlag(argv, "--status-plain")
	};
}
/** Parse both parent aliases and `openclaw models status` through one status owner. */
function parseModelsStatusRouteArgs(argv) {
	const rootArgs = parseModelsRootStatusRouteArgs(argv);
	if (rootArgs) return rootArgs;
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath: ["models", "status"],
		booleanFlags: [
			"--json",
			"--plain",
			"--check",
			"--probe"
		],
		valueFlags: [
			"--probe-provider",
			"--probe-timeout",
			"--probe-concurrency",
			"--probe-max-tokens",
			"--probe-profile",
			"--agent"
		]
	});
	if (!positionals || positionals.length !== 0) return null;
	const probeProvider = parseOptionalFlagValue(argv, "--probe-provider");
	if (!probeProvider.ok) return null;
	const probeTimeout = parseOptionalFlagValue(argv, "--probe-timeout");
	if (!probeTimeout.ok) return null;
	const probeConcurrency = parseOptionalFlagValue(argv, "--probe-concurrency");
	if (!probeConcurrency.ok) return null;
	const probeMaxTokens = parseOptionalFlagValue(argv, "--probe-max-tokens");
	if (!probeMaxTokens.ok) return null;
	const agent = parseOptionalFlagValue(argv, "--agent");
	if (!agent.ok) return null;
	const probeProfileValues = parseRepeatedFlagValues(argv, "--probe-profile");
	if (probeProfileValues === null) return null;
	const probeProfile = probeProfileValues.length === 0 ? void 0 : probeProfileValues.length === 1 ? probeProfileValues[0] : probeProfileValues;
	return {
		probeProvider: probeProvider.value,
		probeTimeout: probeTimeout.value,
		probeConcurrency: probeConcurrency.value,
		probeMaxTokens: probeMaxTokens.value,
		agent: agent.value,
		probeProfile,
		json: hasFlag(argv, "--json"),
		plain: hasFlag(argv, "--plain"),
		check: hasFlag(argv, "--check"),
		probe: hasFlag(argv, "--probe")
	};
}
/** Parse `openclaw channels list` display flags for the route-first list path. */
function parseChannelsListRouteArgs(argv) {
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath: ["channels", "list"],
		booleanFlags: ["--json", "--all"]
	});
	if (!positionals || positionals.length !== 0) return null;
	return {
		json: hasFlag(argv, "--json"),
		all: hasFlag(argv, "--all")
	};
}
/** Parse `openclaw channels status` probe flags without full CLI registration. */
function parseChannelsStatusRouteArgs(argv) {
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath: ["channels", "status"],
		booleanFlags: ["--json", "--probe"],
		valueFlags: ["--timeout", "--channel"]
	});
	if (!positionals || positionals.length !== 0) return null;
	const timeout = parseOptionalFlagValue(argv, "--timeout");
	const channel = parseOptionalFlagValue(argv, "--channel");
	if (!timeout.ok) return null;
	if (!channel.ok) return null;
	return {
		channel: channel.value,
		json: hasFlag(argv, "--json"),
		probe: hasFlag(argv, "--probe"),
		timeout: timeout.value
	};
}
/** Parse `openclaw plugins list` flags for the metadata-only inventory path. */
function parsePluginsListRouteArgs(argv) {
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath: ["plugins", "list"],
		booleanFlags: [
			"--json",
			"--enabled",
			"--verbose"
		]
	});
	if (!positionals || positionals.length !== 0) return null;
	return {
		json: hasFlag(argv, "--json"),
		enabled: hasFlag(argv, "--enabled"),
		verbose: hasFlag(argv, "--verbose")
	};
}
function parseTasksListRouteArgsForCommandPath(argv, commandPath) {
	if (!hasFlag(argv, "--json")) return null;
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath,
		booleanFlags: ["--json"],
		valueFlags: ["--runtime", "--status"]
	});
	if (!positionals || positionals.length !== 0) return null;
	const runtime = parseOptionalFlagValue(argv, "--runtime");
	if (!runtime.ok) return null;
	const status = parseOptionalFlagValue(argv, "--status");
	if (!status.ok) return null;
	return {
		json: true,
		runtime: runtime.value,
		status: status.value
	};
}
/** Parse both `openclaw tasks --json` and `openclaw tasks list --json` aliases. */
function parseTasksListRouteArgs(argv) {
	return parseTasksListRouteArgsForCommandPath(argv, ["tasks"]) ?? parseTasksListRouteArgsForCommandPath(argv, ["tasks", "list"]);
}
/** Parse JSON-only `openclaw tasks audit` filters for the route-first audit path. */
function parseTasksAuditRouteArgs(argv) {
	if (!hasFlag(argv, "--json")) return null;
	const positionals = getRoutedCommandPositionals(argv, {
		commandPath: ["tasks", "audit"],
		booleanFlags: ["--json"],
		valueFlags: [
			"--severity",
			"--code",
			"--limit"
		]
	});
	if (!positionals || positionals.length !== 0) return null;
	const severity = parseOptionalFlagValue(argv, "--severity");
	if (!severity.ok) return null;
	const code = parseOptionalFlagValue(argv, "--code");
	if (!code.ok) return null;
	const rawLimit = getFlagValue(argv, "--limit");
	if (rawLimit === null) return null;
	const limit = rawLimit === void 0 ? void 0 : parseStrictPositiveInteger(rawLimit);
	if (rawLimit !== void 0 && limit === void 0) return null;
	return {
		json: true,
		severity: severity.value,
		code: code.value,
		limit
	};
}
//#endregion
//#region src/cli/program/routed-command-definitions.ts
function defineRoutedCommand(definition) {
	return (argv) => {
		const args = definition.parseArgs(argv);
		return args === null ? null : () => definition.runParsedArgs(args);
	};
}
const loadConfigCli = createLazyPromise(() => import("./config-cli-Dx1jX6Rt.mjs"));
const loadAgentsListCommand = createLazyPromise(() => import("./agents.commands.list-DZoECwNc.mjs"));
const loadModelsListCommand = createLazyPromise(() => import("./list.list-command-BVS_Vywi.mjs"));
const loadModelsStatusCommand = createLazyPromise(() => import("./list.status-command-7qG87sia.mjs"));
const loadTasksJsonCommand = createLazyPromise(() => import("./tasks-json-B00bB9eF.mjs"));
/** Route id to lazy parser/runner definition. */
const routedCommandDefinitions = {
	health: defineRoutedCommand({
		parseArgs: parseHealthRouteArgs,
		runParsedArgs: async (args) => {
			const { healthCommand } = await import("./health-fawA9MaE.mjs");
			await healthCommand(args, defaultRuntime);
		}
	}),
	status: defineRoutedCommand({
		parseArgs: parseStatusRouteArgs,
		runParsedArgs: async (args) => {
			if (args.json) {
				const { statusJsonCommand } = await import("./status-json-vnj1gkO3.mjs");
				await statusJsonCommand({
					deep: args.deep,
					all: args.all,
					usage: args.usage,
					...args.agent !== void 0 ? { agent: args.agent } : {},
					timeoutMs: args.timeoutMs
				}, defaultRuntime);
				return;
			}
			const { statusCommand } = await import("./status-CZW-sJlY.mjs");
			await statusCommand(args, defaultRuntime);
		}
	}),
	"gateway-status": defineRoutedCommand({
		parseArgs: parseGatewayStatusRouteArgs,
		runParsedArgs: async (args) => {
			const { runDaemonStatus } = await import("./status-BgYiOYTg.mjs");
			await runDaemonStatus(args);
		}
	}),
	"gateway-health": defineRoutedCommand({
		parseArgs: parseGatewayHealthRouteArgs,
		runParsedArgs: async (args) => {
			const { runGatewayHealthJsonRoute } = await import("./health-route-D6ZgTxrx.mjs");
			await runGatewayHealthJsonRoute(args, defaultRuntime);
		}
	}),
	sessions: defineRoutedCommand({
		parseArgs: parseSessionsRouteArgs,
		runParsedArgs: async (args) => {
			const { sessionsCommand } = await import("./sessions-CKHQrt43.mjs");
			await sessionsCommand(args, defaultRuntime);
		}
	}),
	"agents-list": defineRoutedCommand({
		parseArgs: parseAgentsListRouteArgs,
		runParsedArgs: async (args) => {
			const { agentsListCommand } = await loadAgentsListCommand();
			await agentsListCommand(args, defaultRuntime);
		}
	}),
	"config-get": defineRoutedCommand({
		parseArgs: parseConfigGetRouteArgs,
		runParsedArgs: async (args) => {
			const { runConfigGet } = await loadConfigCli();
			await runConfigGet(args);
		}
	}),
	"config-unset": defineRoutedCommand({
		parseArgs: parseConfigUnsetRouteArgs,
		runParsedArgs: async (args) => {
			const { runConfigUnset } = await loadConfigCli();
			await runConfigUnset(args);
		}
	}),
	"models-list": defineRoutedCommand({
		parseArgs: parseModelsListRouteArgs,
		runParsedArgs: async (args) => {
			const { modelsListCommand } = await loadModelsListCommand();
			await modelsListCommand(args, defaultRuntime);
		}
	}),
	"models-status": defineRoutedCommand({
		parseArgs: parseModelsStatusRouteArgs,
		runParsedArgs: async (args) => {
			const { modelsStatusCommand } = await loadModelsStatusCommand();
			await modelsStatusCommand(args, defaultRuntime);
		}
	}),
	"tasks-list": defineRoutedCommand({
		parseArgs: parseTasksListRouteArgs,
		runParsedArgs: async (args) => {
			const { tasksListJsonCommand } = await loadTasksJsonCommand();
			await tasksListJsonCommand(args, defaultRuntime);
		}
	}),
	"tasks-audit": defineRoutedCommand({
		parseArgs: parseTasksAuditRouteArgs,
		runParsedArgs: async (args) => {
			const { tasksAuditJsonCommand } = await loadTasksJsonCommand();
			await tasksAuditJsonCommand(args, defaultRuntime);
		}
	}),
	"channels-list": defineRoutedCommand({
		parseArgs: parseChannelsListRouteArgs,
		runParsedArgs: async (args) => {
			const { channelsListCommand } = await import("./list-DRJeJafq.mjs");
			await channelsListCommand(args, defaultRuntime);
		}
	}),
	"channels-status": defineRoutedCommand({
		parseArgs: parseChannelsStatusRouteArgs,
		runParsedArgs: async (args) => {
			const { channelsStatusCommand } = await import("./status-JxMILFRO.mjs");
			await channelsStatusCommand(args, defaultRuntime);
		}
	}),
	"plugins-list": defineRoutedCommand({
		parseArgs: parsePluginsListRouteArgs,
		runParsedArgs: async (args) => {
			const { runPluginsListCommand } = await import("./plugins-list-command-BdjO7sNJ.mjs");
			await runPluginsListCommand(args, defaultRuntime);
		}
	})
};
//#endregion
//#region src/cli/program/routes.ts
/** Bind validated arguments before startup; defer command imports and execution until afterward. */
function findRoutedCommand(path, argv) {
	for (const entry of cliCommandCatalog) {
		if (!entry.route || !matchesCommandPath(path, entry.commandPath, { exact: entry.exact })) continue;
		const run = routedCommandDefinitions[entry.route.id](argv);
		if (run) return run;
	}
	return null;
}
//#endregion
//#region src/cli/route.ts
const LOG_LEVEL_FLAG = "--log-level";
const LOG_LEVEL_EQUALS_PREFIX = `${LOG_LEVEL_FLAG}=`;
function resolveRoutedCliLogLevel(argv) {
	const args = argv.slice(2);
	let logLevel;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") break;
		if (arg === LOG_LEVEL_FLAG) {
			const value = args[index + 1];
			if (!isValueToken(value)) return null;
			const parsed = tryParseLogLevel(value);
			if (!parsed) return null;
			logLevel = parsed;
			index += 1;
			continue;
		}
		if (arg.startsWith(LOG_LEVEL_EQUALS_PREFIX)) {
			const parsed = tryParseLogLevel(arg.slice(LOG_LEVEL_EQUALS_PREFIX.length));
			if (!parsed) return null;
			logLevel = parsed;
		}
	}
	return logLevel;
}
/** Try a lightweight route-first command before falling back to the full CLI program. */
async function tryRouteCli(argv, options = {}) {
	if (isTruthyEnvValue(process.env.OPENCLAW_DISABLE_ROUTE_FIRST)) return false;
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion) return false;
	if (!invocation.commandPath[0]) return false;
	const run = findRoutedCommand(invocation.commandPath, argv);
	if (!run) return false;
	const logLevel = resolveRoutedCliLogLevel(argv);
	if (logLevel === null) return false;
	if (logLevel) process.env.OPENCLAW_LOG_LEVEL = logLevel;
	const startupPolicy = resolveCliStartupPolicy({
		argv,
		commandPath: invocation.commandPath,
		jsonOutputMode: options.machineOutput === true || hasFlag(argv, "--json")
	});
	const { VERSION } = await import("./version-ATx9WpZZ.mjs");
	await applyCliExecutionStartupPresentation({
		argv,
		startupPolicy,
		showBanner: process.stdout.isTTY && !startupPolicy.suppressDoctorStdout,
		version: VERSION
	});
	await ensureCliExecutionBootstrap({
		runtime: defaultRuntime,
		commandPath: invocation.commandPath,
		startupPolicy
	});
	await run();
	return true;
}
//#endregion
export { tryRouteCli };
