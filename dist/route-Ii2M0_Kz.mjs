import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { a as getCommandPositionalsWithRootOptions, s as isValueToken } from "./cli-root-options-DGcy1qRg.mjs";
import { i as MODELS_PARENT_VALUE_FLAGS, r as MODELS_PARENT_BOOLEAN_FLAGS } from "./config-output-mode-COOwgYEB.mjs";
import { i as getPositiveIntFlagValue, o as getVerboseFlag, r as getFlagValue, s as hasFlag } from "./argv-C7hqFLn5.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CJfjJu7L.mjs";
import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { a as tryParseLogLevel } from "./levels-C8pIGBKG.mjs";
import { t as parseGatewayPortOption } from "./gateway-port-option-C-xAMj5k.mjs";
import { i as cliCommandCatalog, r as matchesCommandPath } from "./command-path-policy-u5WGwKHZ.mjs";
import { t as resolveCliStartupPolicy } from "./command-startup-policy-_d9_K0F3.mjs";
import { n as ensureCliExecutionBootstrap, t as applyCliExecutionStartupPresentation } from "./command-execution-startup-CVTKe0ke.mjs";
//#region src/cli/program/route-args.ts
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
function parseRoutedValueFlags(argv, shape) {
	if (getRoutedCommandPositionals(argv, shape)?.length !== 0) return null;
	const values = /* @__PURE__ */ new Map();
	for (const flag of shape.valueFlags ?? []) {
		const value = getFlagValue(argv, flag);
		if (value === null) return null;
		values.set(flag, value);
	}
	return values;
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
		verbose: getVerboseFlag(argv),
		timeoutMs
	};
}
/** Parse `openclaw status` flags without registering the full command tree. */
function parseStatusRouteArgs(argv) {
	const values = parseRoutedValueFlags(argv, {
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
	if (!values) return null;
	const timeoutMs = getPositiveIntFlagValue(argv, "--timeout");
	if (timeoutMs === null) return null;
	const agent = values.get("--agent");
	return {
		json: hasFlag(argv, "--json"),
		deep: hasFlag(argv, "--deep"),
		all: hasFlag(argv, "--all"),
		usage: hasFlag(argv, "--usage"),
		...agent !== void 0 ? { agent } : {},
		verbose: getVerboseFlag(argv),
		timeoutMs
	};
}
/** Parse `openclaw gateway status` RPC-only flags accepted by the fast route. */
function parseGatewayStatusRouteArgs(argv) {
	const values = parseRoutedValueFlags(argv, {
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
	if (!values) return null;
	if (values.get("--ssh") !== void 0 || values.get("--ssh-identity") !== void 0 || hasFlag(argv, "--ssh-auto")) return null;
	return {
		rpc: {
			url: values.get("--url"),
			token: values.get("--token"),
			password: values.get("--password"),
			timeout: values.get("--timeout")
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
	const values = parseRoutedValueFlags(argv, {
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
	if (!values) return null;
	const url = values.get("--url");
	const timeout = values.get("--timeout");
	const port = values.get("--port");
	if (timeout !== void 0 && parseStrictPositiveInteger(timeout) === void 0) return null;
	let localPortOverride;
	if (port !== void 0) {
		try {
			localPortOverride = parseGatewayPortOption(port);
		} catch {
			return null;
		}
		if (localPortOverride === void 0) return null;
	}
	if (url && localPortOverride !== void 0) return null;
	return {
		rpc: {
			url,
			token: values.get("--token"),
			password: values.get("--password"),
			timeout: timeout ?? "10000",
			expectFinal: hasFlag(argv, "--expect-final"),
			json: true
		},
		localPortOverride
	};
}
/** Parse `openclaw sessions` filters for JSON/list route execution. */
function parseSessionsRouteArgs(argv) {
	const values = parseRoutedValueFlags(argv, {
		commandPath: ["sessions"],
		booleanFlags: ["--json", "--all-agents"],
		valueFlags: [
			"--agent",
			"--store",
			"--active",
			"--limit"
		]
	});
	if (!values) return null;
	return {
		json: hasFlag(argv, "--json"),
		allAgents: hasFlag(argv, "--all-agents"),
		agent: values.get("--agent"),
		store: values.get("--store"),
		active: values.get("--active"),
		limit: values.get("--limit")
	};
}
/** Parse `openclaw agents list` display switches for route-first execution. */
function parseAgentsListRouteArgs(argv) {
	return [["agents", "list"], ["agents"]].some((commandPath) => getRoutedCommandPositionals(argv, {
		commandPath,
		booleanFlags: [
			"--json",
			"--bindings",
			"--tree"
		]
	})?.length === 0) ? {
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
	const values = parseRoutedValueFlags(argv, {
		commandPath: ["models", "list"],
		booleanFlags: [
			"--all",
			"--local",
			"--json",
			"--plain"
		],
		valueFlags: ["--provider"]
	});
	if (!values) return null;
	return {
		provider: values.get("--provider"),
		all: hasFlag(argv, "--all"),
		local: hasFlag(argv, "--local"),
		json: hasFlag(argv, "--json"),
		plain: hasFlag(argv, "--plain")
	};
}
/** Parse both parent aliases and `openclaw models status` through one status owner. */
function parseModelsStatusRouteArgs(argv) {
	const rootValues = parseRoutedValueFlags(argv, {
		commandPath: ["models"],
		booleanFlags: MODELS_PARENT_BOOLEAN_FLAGS,
		valueFlags: MODELS_PARENT_VALUE_FLAGS
	});
	if (rootValues) return {
		agent: rootValues.get("--agent"),
		json: hasFlag(argv, "--json") || hasFlag(argv, "--status-json"),
		plain: hasFlag(argv, "--status-plain")
	};
	const values = parseRoutedValueFlags(argv, {
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
	if (!values) return null;
	const probeProfileValues = parseRepeatedFlagValues(argv, "--probe-profile");
	if (probeProfileValues === null) return null;
	const probeProfile = probeProfileValues.length === 0 ? void 0 : probeProfileValues.length === 1 ? probeProfileValues[0] : probeProfileValues;
	return {
		probeProvider: values.get("--probe-provider"),
		probeTimeout: values.get("--probe-timeout"),
		probeConcurrency: values.get("--probe-concurrency"),
		probeMaxTokens: values.get("--probe-max-tokens"),
		agent: values.get("--agent"),
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
	const values = parseRoutedValueFlags(argv, {
		commandPath: ["channels", "status"],
		booleanFlags: ["--json", "--probe"],
		valueFlags: ["--timeout", "--channel"]
	});
	if (!values) return null;
	return {
		channel: values.get("--channel"),
		json: hasFlag(argv, "--json"),
		probe: hasFlag(argv, "--probe"),
		timeout: values.get("--timeout")
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
//#endregion
//#region src/cli/program/routed-command-definitions.ts
function defineRoutedCommand(parseArgs, runParsedArgs) {
	return (argv) => {
		const args = parseArgs(argv);
		return args === null ? null : () => runParsedArgs(args);
	};
}
const routedCommandDefinitions = {
	health: defineRoutedCommand(parseHealthRouteArgs, async (args) => {
		const { healthCommand } = await import("./health-CEVl3-dw.mjs");
		await healthCommand(args, defaultRuntime);
	}),
	status: defineRoutedCommand(parseStatusRouteArgs, async (args) => {
		if (args.json) {
			const { statusJsonCommand } = await import("./status-json-YNTgk8d_.mjs");
			await statusJsonCommand({
				deep: args.deep,
				all: args.all,
				usage: args.usage,
				...args.agent !== void 0 ? { agent: args.agent } : {},
				timeoutMs: args.timeoutMs
			}, defaultRuntime);
			return;
		}
		const { statusCommand } = await import("./status-k6TGucJA.mjs");
		await statusCommand(args, defaultRuntime);
	}),
	"gateway-status": defineRoutedCommand(parseGatewayStatusRouteArgs, async (args) => {
		const { runDaemonStatus } = await import("./status-CL-pgx7L.mjs");
		await runDaemonStatus(args);
	}),
	"gateway-health": defineRoutedCommand(parseGatewayHealthRouteArgs, async (args) => {
		const { runGatewayHealthJsonRoute } = await import("./health-route-Dn9xH_nH.mjs");
		await runGatewayHealthJsonRoute(args, defaultRuntime);
	}),
	sessions: defineRoutedCommand(parseSessionsRouteArgs, async (args) => {
		const { sessionsCommand } = await import("./sessions-28wEOphV.mjs");
		await sessionsCommand(args, defaultRuntime);
	}),
	"agents-list": defineRoutedCommand(parseAgentsListRouteArgs, async (args) => {
		const { agentsListCommand } = await import("./agents.commands.list-D7O9LaCf.mjs");
		await agentsListCommand(args, defaultRuntime);
	}),
	"config-get": defineRoutedCommand(parseConfigGetRouteArgs, async (args) => {
		const { runConfigGet } = await import("./config-cli-DQyQ7Zxo.mjs");
		await runConfigGet(args);
	}),
	"config-unset": defineRoutedCommand(parseConfigUnsetRouteArgs, async (args) => {
		const { routeConfigMutationToOwner, runConfigUnset } = await import("./config-cli-DQyQ7Zxo.mjs");
		const runLocal = () => runConfigUnset(args);
		if (args.cliOptions?.dryRun) return runLocal();
		const { runWithLocalStateOwner } = await import("./local-state-owner-DLqjNnxj.mjs");
		const { quoteCliArg } = await import("./quote-cli-arg-s6fnG64n.mjs");
		await runWithLocalStateOwner({
			method: "config unset",
			params: {},
			target: args.path,
			recoveryCommand: `openclaw config get ${quoteCliArg(args.path)}`,
			onForeignOwner: routeConfigMutationToOwner((commit) => runConfigUnset({
				...args,
				commit
			}), "config unset"),
			runLocal
		});
	}),
	"models-list": defineRoutedCommand(parseModelsListRouteArgs, async (args) => {
		const { modelsListCommand } = await import("./list.list-command-D9gf5jIE.mjs");
		await modelsListCommand(args, defaultRuntime);
	}),
	"models-status": defineRoutedCommand(parseModelsStatusRouteArgs, async (args) => {
		const { modelsStatusCommand } = await import("./list.status-command-C5t-eV_7.mjs");
		await modelsStatusCommand(args, defaultRuntime);
	}),
	"channels-list": defineRoutedCommand(parseChannelsListRouteArgs, async (args) => {
		const { channelsListCommand } = await import("./list-Bb7SHvTZ.mjs");
		await channelsListCommand(args, defaultRuntime);
	}),
	"channels-status": defineRoutedCommand(parseChannelsStatusRouteArgs, async (args) => {
		const { channelsStatusCommand } = await import("./status-B6dShbk4.mjs");
		await channelsStatusCommand(args, defaultRuntime);
	}),
	"plugins-list": defineRoutedCommand(parsePluginsListRouteArgs, async (args) => {
		const { runPluginsListCommand } = await import("./plugins-list-command-D7k8zx6K.mjs");
		await runPluginsListCommand(args, defaultRuntime);
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
		let value;
		if (arg === LOG_LEVEL_FLAG) {
			value = args[++index];
			if (!isValueToken(value)) return null;
		} else if (arg.startsWith(LOG_LEVEL_EQUALS_PREFIX)) value = arg.slice(LOG_LEVEL_EQUALS_PREFIX.length);
		else continue;
		const parsed = tryParseLogLevel(value);
		if (!parsed) return null;
		logLevel = parsed;
	}
	return logLevel;
}
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
	const { VERSION } = await import("./version-Dhb_IK_3.mjs");
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
