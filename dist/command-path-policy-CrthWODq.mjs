import { a as resolveCliParentCommandPath } from "./config-output-mode-DrhJ7F5x.mjs";
import { A as resolveGatewayCatalogCommandPath, n as getCommandPathWithRootOptions, s as hasFlag } from "./argv-IYTsfFsq.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
//#region src/cli/command-catalog.ts
function hasCliOption(argv, name) {
	for (const arg of argv.slice(2)) {
		if (arg === "--") return false;
		if (arg === name || arg.startsWith(`${name}=`)) return true;
	}
	return false;
}
const PASSIVE_STARTUP_POLICY = {
	configGuard: "skip",
	loadPlugins: "never",
	ensureCliPath: false,
	networkProxy: "bypass"
};
/** Command path registry used before Commander registration has loaded all plugins. */
const cliCommandCatalog = [
	{
		commandPath: ["setup"],
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			ensureCliPath: false
		}
	},
	{
		commandPath: ["qa"],
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["database"],
		policy: {
			...PASSIVE_STARTUP_POLICY,
			hideBanner: true
		}
	},
	{
		commandPath: ["crestodian"],
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			ensureCliPath: false
		}
	},
	{
		commandPath: ["agent"],
		policy: {
			configGuard: ({ argv }) => hasFlag(argv, "--local") ? "run" : "skip",
			loadPlugins: ({ argv }) => hasFlag(argv, "--local"),
			pluginRegistry: { scope: "all" },
			networkProxy: ({ argv }) => hasFlag(argv, "--local") ? "default" : "bypass"
		}
	},
	{
		commandPath: ["agent", "exec"],
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			ownsProtocolStdout: true,
			hideBanner: true,
			networkProxy: "default"
		}
	},
	{
		commandPath: ["transcripts"],
		policy: {
			ownsProtocolStdout: true,
			hideBanner: true
		}
	},
	{
		commandPath: ["message"],
		policy: { loadPlugins: "never" }
	},
	{
		commandPath: ["docs"],
		policy: { configGuard: "skip" }
	},
	{
		commandPath: ["reset"],
		policy: { configGuard: "skip" }
	},
	{
		commandPath: ["uninstall"],
		policy: { configGuard: "skip" }
	},
	{
		commandPath: ["channels"],
		policy: {
			loadPlugins: "always",
			pluginRegistry: { scope: "configured-channels" }
		}
	},
	{
		commandPath: ["directory"],
		policy: { loadPlugins: "always" }
	},
	{
		commandPath: ["sandbox"],
		policy: {
			loadPlugins: ({ argv, commandPath }) => !((commandPath[1] === "list" || commandPath[1] === "recreate") && hasFlag(argv, "--browser")),
			pluginRegistry: { scope: "sandbox-backends" }
		}
	},
	{
		commandPath: ["sandbox", "list"],
		policy: { pluginRegistry: { scope: "sandbox-management" } }
	},
	{
		commandPath: ["sandbox", "recreate"],
		policy: { pluginRegistry: { scope: "sandbox-management" } }
	},
	{
		commandPath: ["agents"],
		policy: {
			loadPlugins: "always",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["agents"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		},
		route: { id: "agents-list" }
	},
	{
		commandPath: ["agents", "bind"],
		exact: true,
		policy: { loadPlugins: "never" }
	},
	{
		commandPath: ["agents", "bindings"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never"
		}
	},
	{
		commandPath: ["agents", "unbind"],
		exact: true,
		policy: { loadPlugins: "never" }
	},
	{
		commandPath: ["agents", "set-identity"],
		exact: true,
		policy: { loadPlugins: "never" }
	},
	{
		commandPath: ["agents", "delete"],
		exact: true,
		policy: { loadPlugins: "never" }
	},
	{
		commandPath: ["configure"],
		policy: {
			configGuard: "skip",
			stateStoreGuard: "run",
			loadPlugins: "never"
		}
	},
	{
		commandPath: ["config"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	...[
		"create",
		"validate",
		"build",
		"dev"
	].map((subcommand) => ({
		commandPath: ["claws", subcommand],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	})),
	{
		commandPath: ["migrate"],
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["status"],
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			pluginRegistry: { scope: "channels" },
			ensureCliPath: false,
			networkProxy: "bypass"
		},
		route: { id: "status" }
	},
	{
		commandPath: ["telemetry"],
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["health"],
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			pluginRegistry: { scope: "channels" },
			ensureCliPath: false,
			networkProxy: "bypass"
		},
		route: { id: "health" }
	},
	{
		commandPath: ["audit"],
		policy: { ...PASSIVE_STARTUP_POLICY }
	},
	{
		commandPath: ["gateway"],
		policy: { networkProxy: ({ commandPath }) => commandPath.length === 1 || commandPath[1] === "run" ? "default" : "bypass" }
	},
	{
		commandPath: ["gateway", "status"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		},
		route: { id: "gateway-status" }
	},
	...[
		"call",
		"restart",
		"suspend",
		"resume"
	].map((subcommand) => ({
		commandPath: ["gateway", subcommand],
		exact: true,
		policy: {
			configGuard: "validate",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	})),
	{
		commandPath: ["gateway", "diagnostics"],
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["gateway", "discover"],
		exact: true,
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["gateway", "health"],
		exact: true,
		policy: {
			configGuard: "skip",
			networkProxy: "bypass"
		},
		route: { id: "gateway-health" }
	},
	{
		commandPath: ["gateway", "install"],
		exact: true,
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["gateway", "probe"],
		exact: true,
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["gateway", "stability"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["gateway", "start"],
		exact: true,
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["gateway", "stop"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["gateway", "uninstall"],
		exact: true,
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["gateway", "usage-cost"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["sessions"],
		exact: true,
		policy: {
			configGuard: "skip",
			ensureCliPath: false,
			ownsProtocolStdout: true,
			networkProxy: "bypass"
		},
		route: { id: "sessions" }
	},
	{
		commandPath: ["agents", "list"],
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		},
		route: { id: "agents-list" }
	},
	{
		commandPath: ["config", "file"],
		exact: true,
		policy: {
			configGuard: "skip",
			ensureCliPath: false,
			loadPlugins: "never",
			ownsProtocolStdout: true,
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["config", "get"],
		exact: true,
		policy: {
			configGuard: "skip",
			ensureCliPath: false,
			networkProxy: "bypass"
		},
		route: { id: "config-get" }
	},
	{
		commandPath: ["config", "unset"],
		exact: true,
		policy: {
			configGuard: "run",
			ensureCliPath: false,
			networkProxy: "bypass"
		},
		route: { id: "config-unset" }
	},
	{
		commandPath: ["models"],
		exact: true,
		policy: { ...PASSIVE_STARTUP_POLICY },
		route: { id: "models-status" }
	},
	...[
		"refresh",
		"set",
		"set-image",
		"aliases",
		"fallbacks",
		"image-fallbacks",
		"scan"
	].map((subcommand) => ({ commandPath: ["models", subcommand] })),
	{
		commandPath: ["models", "auth"],
		policy: { stateStoreGuard: "run" }
	},
	{
		commandPath: ["models", "accounts"],
		policy: { ...PASSIVE_STARTUP_POLICY }
	},
	{
		commandPath: ["models", "list"],
		exact: true,
		policy: {
			configGuard: "skip",
			ensureCliPath: false,
			networkProxy: "bypass"
		},
		route: { id: "models-list" }
	},
	{
		commandPath: ["models", "status"],
		exact: true,
		policy: {
			ensureCliPath: false,
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: ({ argv }) => hasFlag(argv, "--probe") ? "default" : "bypass"
		},
		route: { id: "models-status" }
	},
	{
		commandPath: ["tasks", "list"],
		exact: true,
		policy: {
			configGuard: "skip",
			ensureCliPath: false,
			loadPlugins: "never",
			networkProxy: "bypass"
		},
		route: { id: "tasks-list" }
	},
	{
		commandPath: ["tasks", "audit"],
		exact: true,
		policy: {
			configGuard: "skip",
			ensureCliPath: false,
			loadPlugins: "never",
			networkProxy: "bypass"
		},
		route: { id: "tasks-audit" }
	},
	{
		commandPath: ["tasks"],
		policy: {
			configGuard: "skip",
			ensureCliPath: false,
			loadPlugins: "never",
			networkProxy: "bypass"
		},
		route: { id: "tasks-list" }
	},
	{
		commandPath: ["tool"],
		policy: {
			loadPlugins: "never",
			ensureCliPath: false,
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["tools"],
		policy: {
			loadPlugins: "never",
			ensureCliPath: false,
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["acp"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["acp"],
		exact: true,
		policy: { ownsProtocolStdout: true }
	},
	{
		commandPath: ["approvals"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["approvals", "pending"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["automations"],
		policy: {
			configGuard: "skip",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["backup"],
		policy: {
			configGuard: "skip",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["chat"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["config"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["cron"],
		policy: {
			configGuard: "skip",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["dashboard"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["daemon"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["devices"],
		policy: {
			configGuard: "validate",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["worktrees"],
		policy: {
			configGuard: "validate",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["fleet"],
		policy: {
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["doctor"],
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: ({ argv }) => hasCliOption(argv, "--state-sqlite") ? "bypass" : "default"
		}
	},
	{
		commandPath: ["triage"],
		policy: {
			configGuard: "skip",
			loadPlugins: "never"
		}
	},
	{
		commandPath: ["exec-approvals"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["exec-policy"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["hooks"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["hooks"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["hooks", "list"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["hooks", "info"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["hooks", "check"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["logs"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["mcp"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["mcp", "serve"],
		exact: true,
		policy: { ownsProtocolStdout: true }
	},
	{
		commandPath: ["browser", "extension"],
		policy: {
			configGuard: "validate",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: [
			"browser",
			"extension",
			"native-host"
		],
		exact: true,
		policy: {
			...PASSIVE_STARTUP_POLICY,
			hideBanner: true,
			ownsProtocolStdout: true
		}
	},
	{
		commandPath: ["node"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["node", "identity"],
		exact: true,
		policy: PASSIVE_STARTUP_POLICY
	},
	{
		commandPath: ["node", "worker"],
		exact: true,
		policy: {
			configGuard: "validate",
			hideBanner: true,
			loadPlugins: "never",
			ownsProtocolStdout: true,
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["node", "run"],
		exact: true,
		policy: { networkProxy: "default" }
	},
	{
		commandPath: ["connect"],
		exact: true,
		policy: { networkProxy: "default" }
	},
	{
		commandPath: ["worker"],
		exact: true,
		policy: {
			configGuard: "skip",
			hideBanner: true,
			loadPlugins: "never",
			ownsProtocolStdout: true,
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["nodes"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["nodes", "status"],
		exact: true,
		policy: { configGuard: "skip" }
	},
	{
		commandPath: ["nodes", "list"],
		exact: true,
		policy: { configGuard: "skip" }
	},
	...[
		"describe",
		"pending",
		"approve",
		"reject",
		"remove",
		"rename",
		"invoke",
		"notify",
		"push",
		"camera",
		"screen",
		"location"
	].map((subcommand) => ({
		commandPath: ["nodes", subcommand],
		policy: { configGuard: "validate" }
	})),
	{
		commandPath: ["pairing"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["proxy"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["qr"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["reset"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["completion"],
		policy: {
			configGuard: "skip",
			hideBanner: true,
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["secrets"],
		policy: {
			configGuard: "skip",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["security"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["system"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["resume"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["terminal"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["tui"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["uninstall"],
		policy: { networkProxy: "bypass" }
	},
	{
		commandPath: ["update", "cleanup"],
		exact: true,
		policy: {
			...PASSIVE_STARTUP_POLICY,
			hideBanner: true
		}
	},
	{
		commandPath: ["update"],
		policy: {
			configGuard: "skip",
			hideBanner: true
		}
	},
	{
		commandPath: ["config", "validate"],
		exact: true,
		policy: {
			configGuard: "skip",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["config", "schema"],
		exact: true,
		policy: {
			configGuard: "skip",
			ownsProtocolStdout: true,
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["plugins", "update"],
		exact: true,
		policy: { hideBanner: true }
	},
	{
		commandPath: ["plugins", "list"],
		exact: true,
		policy: {
			configGuard: "skip",
			ensureCliPath: false,
			loadPlugins: "never",
			networkProxy: "bypass"
		},
		route: { id: "plugins-list" }
	},
	{
		commandPath: ["plugins", "build"],
		exact: true,
		policy: { configGuard: "skip" }
	},
	{
		commandPath: ["plugins", "validate"],
		exact: true,
		policy: { configGuard: "skip" }
	},
	{
		commandPath: ["plugins", "init"],
		exact: true,
		policy: { configGuard: "skip" }
	},
	{
		commandPath: ["onboard"],
		exact: true,
		policy: { loadPlugins: "never" }
	},
	{
		commandPath: ["onboard", "recommendations"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: [
			"onboard",
			"recommendations",
			"acknowledge"
		],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: [
			"onboard",
			"recommendations",
			"refresh"
		],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["channels", "add"],
		exact: true,
		policy: {
			stateStoreGuard: "run",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["channels", "login"],
		exact: true,
		policy: { stateStoreGuard: "run" }
	},
	{
		commandPath: ["channels", "logs"],
		exact: true,
		policy: {
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["channels", "remove"],
		exact: true,
		policy: {
			pluginRegistry: { scope: "configured-channels" },
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["channels", "resolve"],
		exact: true,
		policy: {
			pluginRegistry: { scope: "configured-channels" },
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["channels", "status"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: ({ argv }) => hasFlag(argv, "--probe") ? "default" : "bypass"
		},
		route: { id: "channels-status" }
	},
	{
		commandPath: ["channels", "list"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		},
		route: { id: "channels-list" }
	},
	{
		commandPath: ["skills"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["skills", "check"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["skills", "info"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["skills", "install"],
		exact: true
	},
	{
		commandPath: ["skills", "list"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never",
			networkProxy: "bypass"
		}
	},
	{
		commandPath: ["skills", "search"],
		exact: true,
		policy: {
			configGuard: "skip",
			loadPlugins: "never"
		}
	},
	{
		commandPath: ["memory"],
		policy: {
			loadPlugins: "always",
			pluginRegistry: { scope: "memory" }
		}
	},
	{
		commandPath: ["memory", "search"],
		exact: true,
		policy: { configGuard: "skip" }
	},
	{
		commandPath: ["memory", "status"],
		exact: true,
		policy: { configGuard: ({ argv }) => hasFlag(argv, "--index") || hasFlag(argv, "--fix") ? "run" : "skip" }
	},
	{
		commandPath: ["skills", "update"],
		exact: true
	},
	{
		commandPath: ["skills", "verify"],
		exact: true
	}
];
//#endregion
//#region src/cli/command-path-matches.ts
/** Matches a command path prefix, or the full path when `exact` is requested. */
function matchesCommandPath(commandPath, pattern, params) {
	if (pattern.some((segment, index) => commandPath[index] !== segment)) return false;
	return !params?.exact || commandPath.length === pattern.length;
}
//#endregion
//#region src/cli/command-path-policy.ts
const DEFAULT_CLI_COMMAND_PATH_POLICY = {
	configGuard: "run",
	stateStoreGuard: "skip",
	loadPlugins: "never",
	pluginRegistry: { scope: "all" },
	ownsProtocolStdout: false,
	hideBanner: false,
	ensureCliPath: true,
	networkProxy: "default"
};
function resolveCliCommandPathPolicy(commandPath) {
	const resolvedPolicy = { ...DEFAULT_CLI_COMMAND_PATH_POLICY };
	for (const entry of cliCommandCatalog) {
		if (!entry.policy) continue;
		if (!matchesCommandPath(commandPath, entry.commandPath, { exact: entry.exact })) continue;
		Object.assign(resolvedPolicy, entry.policy);
	}
	return resolvedPolicy;
}
function isCommandPathPrefix(commandPath, pattern) {
	return pattern.every((segment, index) => commandPath[index] === segment);
}
function resolveCliCatalogCommandPath(argv) {
	const tokens = resolveGatewayCatalogCommandPath(argv) ?? resolveCliParentCommandPath(argv) ?? getCommandPathWithRootOptions(argv, argv.length);
	if (tokens.length === 0) return [];
	let bestMatch = null;
	for (const entry of cliCommandCatalog) {
		if (!isCommandPathPrefix(tokens, entry.commandPath)) continue;
		if (!bestMatch || entry.commandPath.length > bestMatch.length) bestMatch = entry.commandPath;
	}
	return bestMatch ? [...bestMatch] : [expectDefined(tokens[0], "tokens entry at 0")];
}
function resolveCliNetworkProxyPolicy(argv) {
	const commandPath = resolveCliCatalogCommandPath(argv);
	const networkProxy = resolveCliCommandPathPolicy(commandPath).networkProxy;
	return typeof networkProxy === "function" ? networkProxy({
		argv,
		commandPath
	}) : networkProxy;
}
//#endregion
export { cliCommandCatalog as i, resolveCliNetworkProxyPolicy as n, matchesCommandPath as r, resolveCliCommandPathPolicy as t };
