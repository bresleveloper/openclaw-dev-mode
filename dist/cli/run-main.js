import { r as consumeRootOptionToken, s as isValueToken } from "../cli-root-options-vGuJ5JgW.mjs";
import { A as resolveGatewayCatalogCommandPath, H as isMachineOutputStdoutTTY, I as getCoreCliCommandDescriptors, L as getCoreCliCommandNamesCore, O as consumeGatewayFastPathRootOptionToken, f as isSimpleCommandHelpInvocation, g as normalizeRootNoColorArgv, h as normalizeRootLogLevelArgv, j as resolveGatewayRunPreBootstrapOptions, k as consumeGatewayRunOptionToken, m as normalizeRootHelpTargetArgv, p as normalizeGeneratedHelpCommandArgv, v as getSubCliEntriesCore, y as getSubCliParentDefaultHelpCommands, z as getCoreCliParentDefaultHelpCommands } from "../argv-IYTsfFsq.mjs";
import { C as retirePluginCache, D as withPluginCache, a as createPluginCache, o as getPluginCache } from "../plugin-cache-A1nT2dqa.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "../utf16-slice-D_ngcYKd.mjs";
import { t as resolveCliArgvInvocation } from "../argv-invocation-DszZF2nA.mjs";
import { n as parseCliContainerArgs, t as maybeRunCliInContainer } from "../container-target-QMB0jS0E.mjs";
import { a as closeCliResources, n as requestExitAfterOneShotOutput, s as runCliDisposer } from "../one-shot-exit-maXyqxro.mjs";
import { n as registerSignalExitBarrier, o as waitForSignalExitBarriers } from "../signal-exit-barrier-BG0KH3HC.mjs";
import { t as tryOutputPrecomputedCommandHelp } from "../precomputed-help-CjXdQ-GT.mjs";
import { n as tryProcessCwd } from "../safe-cwd-DOxDm8mD.mjs";
import { n as parseCliProfileArgs, t as applyCliProfileEnv } from "../profile-wa21S6WO.mjs";
import { a as withCliCommandCleanup } from "../runtime-cleanup-scope-C0g6_AIJ.mjs";
import { i as normalizeEnv, n as isTruthyEnvValue } from "../env-C4a8LL2I.mjs";
import { r as createGatewayDispatchStartupTrace, t as configureGatewayStartupTraceConsoleFormatting } from "../startup-trace-DgSoCXij.mjs";
import { t as normalizeWindowsArgv } from "../windows-argv-C3HwI-HD.mjs";
import { E as resolveStateDir, v as resolveGatewayPort } from "../paths-DehQwyE0.mjs";
import { n as sanitizeTerminalText } from "../safe-text-CBmKtmbt.mjs";
import { n as formatInvalidConfigDetails, t as createInvalidConfigError } from "../io.invalid-config-Deld-wtR.mjs";
import { t as normalizeWebSocketProtocol } from "../websocket-protocol-MDxbNIbL.mjs";
import { a as isLoopbackAddress, u as isSecureWebSocketUrl } from "../net-DU4aWKLv.mjs";
import { a as withConsoleLogsRoutedToStderrForJson, i as withConsoleLogsRoutedToStderr, n as hasJsonOutputFlag, r as isJsonOutputModeActive } from "../json-output-mode-DRPBa2uN.mjs";
import { r as shouldSkipPluginCommandRegistration, t as isReservedNonPluginCommandRoot } from "../command-registration-policy-DXto_g8D.mjs";
import { n as resolveCliNetworkProxyPolicy, t as resolveCliCommandPathPolicy } from "../command-path-policy-CrthWODq.mjs";
import { t as resolveCliStartupPolicy } from "../command-startup-policy-gB_2DGw2.mjs";
import { t as tryRunGatewayServiceUpdateCapabilityProbe } from "../update-capability-BmokDcYV.mjs";
import { n as shouldStartLocalOnboarding } from "../fresh-install-config-Bi-9QLEM.mjs";
import { existsSync } from "node:fs";
import process$1 from "node:process";
import path from "node:path";
//#region src/cli/run-main-plugin-cache.ts
/** Executable commands own their inventory until Gateway publication adopts it. */
function withCliPluginInvocation(gatewayRun, run) {
	return withCliCommandCleanup(gatewayRun, (cleanup) => {
		if (gatewayRun) return run();
		const cache = createPluginCache();
		cleanup?.pluginResources?.adopt({ async release() {
			if (cache.kind === "operation") {
				const result = await retirePluginCache(cache);
				if (result.failures.length > 0) throw new AggregateError(result.failures.map((failure) => failure.error), "CLI plugin inventory cleanup failed");
			}
		} });
		return withPluginCache(cache, () => run(cleanup));
	});
}
//#endregion
//#region src/cli/run-main-policy.ts
const ROOT_HELP_ALIASES = /* @__PURE__ */ new Set(["tools"]);
const SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS = /* @__PURE__ */ new Set([
	"setup",
	"onboard",
	"configure"
]);
const BARE_PARENT_DEFAULT_HELP_COMMANDS = /* @__PURE__ */ new Set([...getCoreCliParentDefaultHelpCommands(), ...getSubCliParentDefaultHelpCommands()]);
function isBareParentDefaultHelpArgv(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	const [primary, extra] = invocation.commandPath;
	return !invocation.hasHelpOrVersion && primary !== void 0 && extra === void 0 ? BARE_PARENT_DEFAULT_HELP_COMMANDS.has(primary) : false;
}
function rewriteUpdateFlagArgv(argv) {
	const updateIndex = argv.indexOf("--update");
	if (updateIndex === -1) return argv;
	for (let i = 2; i < argv.length; i++) {
		const arg = argv[i];
		if (!arg || arg === "--") return argv;
		if (i === updateIndex) {
			const next = [...argv];
			next.splice(updateIndex, 1, "update");
			return next;
		}
		const consumed = consumeRootOptionToken(argv, i);
		if (consumed > 0) {
			i += consumed - 1;
			continue;
		}
		if (!arg.startsWith("-")) return argv;
	}
	return argv;
}
function shouldEnsureCliPath(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || shouldHandleBareRoot(argv) || isBareParentDefaultHelpArgv(argv)) return false;
	return resolveCliCommandPathPolicy(invocation.commandPath).ensureCliPath;
}
function shouldUseRootHelpFastPath(argv, env = process.env) {
	const invocation = resolveCliArgvInvocation(argv);
	return env.OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH !== "1" && (invocation.isRootHelpInvocation || invocation.commandPath.length === 1 && ROOT_HELP_ALIASES.has(invocation.commandPath[0] ?? "") && invocation.hasHelpOrVersion || invocation.commandPath.length === 1 && invocation.commandPath[0] === "help" && invocation.hasHelpOrVersion);
}
function shouldUseSetupOnboardConfigureHelpFastPath(argv, env = process.env) {
	if (env.OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH === "1") return false;
	return isSimpleCommandHelpInvocation(argv, SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS);
}
function shouldHandleBareRoot(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	return invocation.commandPath.length === 0 && !invocation.hasHelpOrVersion;
}
function shouldStartProxyForCli(argv) {
	const policyArgv = rewriteUpdateFlagArgv(argv);
	const invocation = resolveCliArgvInvocation(policyArgv);
	const [primary] = invocation.commandPath;
	if (invocation.hasHelpOrVersion || !primary) return false;
	if (isBareParentDefaultHelpArgv(policyArgv)) return false;
	return resolveCliNetworkProxyPolicy(policyArgv) === "default";
}
function resolveMissingPluginCommandMessage(pluginId, config, options) {
	const normalizedPluginId = normalizeLowercaseStringOrEmpty(pluginId);
	if (!normalizedPluginId) return null;
	const allow = Array.isArray(config?.plugins?.allow) && config.plugins.allow.length > 0 ? config.plugins.allow.filter((entry) => typeof entry === "string").map((entry) => normalizeOptionalLowercaseString(entry)).filter(Boolean) : [];
	const commandAlias = options?.resolveCommandAliasOwner?.({
		command: normalizedPluginId,
		config
	});
	const parentPluginId = commandAlias?.pluginId;
	if (parentPluginId) {
		if (allow.length > 0 && !allow.includes(parentPluginId)) {
			if (parentPluginId === normalizedPluginId) return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.allow\` excludes "${normalizedPluginId}". Add "${normalizedPluginId}" to \`plugins.allow\` if you want that bundled plugin CLI surface.`;
			return `"${normalizedPluginId}" is not a plugin; it is a command provided by the "${parentPluginId}" plugin. Add "${parentPluginId}" to \`plugins.allow\` instead of "${normalizedPluginId}".`;
		}
		if (config?.plugins?.entries?.[parentPluginId]?.enabled === false) return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.entries.${parentPluginId}.enabled=false\`. Re-enable that entry if you want the bundled plugin command surface.`;
		if (commandAlias.kind !== "runtime-slash" && commandAlias.enabledByDefault !== true && config?.plugins?.entries?.[parentPluginId]?.enabled !== true) return `The \`openclaw ${normalizedPluginId}\` command is provided by the "${parentPluginId}" plugin, but that bundled plugin is disabled by default. Run \`openclaw plugins enable ${parentPluginId}\` to enable that CLI surface.`;
		if (commandAlias.kind === "runtime-slash") return `"${normalizedPluginId}" is a runtime slash command (/${normalizedPluginId}), not a CLI command. It is provided by the "${parentPluginId}" plugin. ${commandAlias.cliCommand ? `Use \`openclaw ${commandAlias.cliCommand}\` for related CLI operations, or ` : "Use "}\`/${normalizedPluginId}\` in a chat session.`;
	}
	if (isReservedNonPluginCommandRoot(normalizedPluginId)) return null;
	const toolOwner = options?.resolveToolOwner?.({
		toolName: normalizedPluginId,
		config
	});
	if (toolOwner) {
		if (config?.plugins?.entries?.[toolOwner.pluginId]?.enabled !== false && (allow.length === 0 || allow.includes(toolOwner.pluginId))) {
			if (toolOwner.availability === "manifest-only") return `"${normalizedPluginId}" may be provided by the "${toolOwner.pluginId}" plugin as an agent tool, not a CLI subcommand. Run \`openclaw --help\` to see available CLI subcommands.`;
			return `"${normalizedPluginId}" is an agent tool available from the "${toolOwner.pluginId}" plugin, not a CLI subcommand. Use it from an agent turn (model tool-use), not the CLI. Run \`openclaw --help\` to see available CLI subcommands.`;
		}
	}
	if (allow.length > 0 && !allow.includes(normalizedPluginId)) {
		if (parentPluginId && allow.includes(parentPluginId)) return null;
		const cliCommandSurfaceOwner = options?.resolveCliCommandSurfaceOwner?.({
			command: normalizedPluginId,
			config
		});
		const normalizedCliCommandSurfaceOwner = normalizeOptionalLowercaseString(cliCommandSurfaceOwner);
		if (!normalizedCliCommandSurfaceOwner) return null;
		if (allow.includes(normalizedCliCommandSurfaceOwner)) return null;
		if (normalizedCliCommandSurfaceOwner !== normalizedPluginId) return `"${normalizedPluginId}" is not a plugin; it is a command provided by the "${normalizedCliCommandSurfaceOwner}" plugin. Add "${normalizedCliCommandSurfaceOwner}" to \`plugins.allow\` instead of "${normalizedPluginId}".`;
		return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.allow\` excludes "${normalizedPluginId}". Add "${normalizedPluginId}" to \`plugins.allow\` if you want that bundled plugin CLI surface.`;
	}
	if (config?.plugins?.entries?.[normalizedPluginId]?.enabled === false) return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.entries.${normalizedPluginId}.enabled=false\`. Re-enable that entry if you want the bundled plugin CLI surface.`;
	return null;
}
//#endregion
//#region src/cli/run-main.ts
const CLI_PROXY_ENV_KEYS = [
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"ALL_PROXY",
	"http_proxy",
	"https_proxy",
	"all_proxy"
];
const UNKNOWN_COMMAND_DISPLAY_LIMIT = 128;
const loadRootHelpLiveConfigModule = async () => await import("../root-help-live-config-DLFpCf-w.mjs");
const loadRootHelpMetadataModule = async () => await import("../root-help-metadata-DoWAQ8F9.mjs");
const loadLoggingModule = async () => await import("../console-Bu4DkpzH.mjs");
const loadCliRegistryLoaderModule = async () => await import("../cli-registry-loader-D3SYak4M.mjs");
const loadManifestCommandAliasesRuntimeModule = async () => await import("../manifest-command-aliases.runtime-DJ56q6FD.mjs");
const loadProxyLifecycleModule = async () => await import("../proxy-lifecycle-DlUTQmRi.mjs");
const loadProgressModule = async () => await import("../progress-CeixKJk_.mjs");
function isRemoteAgentDispatchInvocation(argv, primary) {
	return primary === "agent" && !argv.includes("--local");
}
function isGatewayRunFastPathArgv(argv) {
	if (resolveCliArgvInvocation(argv).hasHelpOrVersion) return false;
	const args = argv.slice(2);
	let sawGateway = false;
	let sawRun = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") return false;
		if (!sawGateway) {
			const consumed = consumeGatewayFastPathRootOptionToken(args, index);
			if (consumed > 0) {
				index += consumed - 1;
				continue;
			}
			if (arg !== "gateway") return false;
			sawGateway = true;
			continue;
		}
		const rootConsumed = consumeGatewayFastPathRootOptionToken(args, index);
		if (rootConsumed > 0) {
			index += rootConsumed - 1;
			continue;
		}
		const consumed = consumeGatewayRunOptionToken(args, index);
		if (consumed > 0) {
			index += consumed - 1;
			continue;
		}
		if (!sawRun && arg === "run") {
			sawRun = true;
			continue;
		}
		return false;
	}
	return sawGateway;
}
function isGatewayRunInvocationArgv(argv) {
	const commandPath = resolveGatewayCatalogCommandPath(argv);
	return commandPath?.length === 1 || commandPath?.length === 2 && commandPath[0] === "gateway" && commandPath[1] === "run";
}
async function tryRunGatewayRunFastPath(argv, startupTrace) {
	if (!isGatewayRunFastPathArgv(argv)) return false;
	const [{ Command }, { addGatewayRunCommand }, { VERSION }, { emitCliBanner }, { ensureCliExecutionBootstrap }, { defaultRuntime }] = await startupTrace.measure("gateway-run-imports", () => Promise.all([
		import("commander"),
		import("../run-command-CxRfBKe-.mjs"),
		import("../version-ATx9WpZZ.mjs"),
		import("../banner-BtsIrLkD.mjs"),
		import("../command-execution-startup-8DRMlTDV.mjs"),
		import("../runtime-pvh-jBbt.mjs")
	]));
	const commandPath = resolveGatewayCatalogCommandPath(argv) ?? ["gateway"];
	const startupPolicy = resolveCliStartupPolicy({
		argv,
		commandPath,
		jsonOutputMode: hasJsonOutputFlag(argv)
	});
	if (!startupPolicy.hideBanner) emitCliBanner(VERSION, { argv });
	const program = new Command();
	program.name("openclaw");
	program.enablePositionalOptions();
	program.option("--no-color", "Disable ANSI colors", false);
	program.exitOverride((err) => {
		process$1.exitCode = typeof err.exitCode === "number" ? err.exitCode : 1;
		throw err;
	});
	const beforeRun = async (opts) => {
		let beforeStateMigrations;
		let skipPristineStartupStateMigrations = false;
		let skipPristineCoreStateMigrations = false;
		if (!await startupTrace.measure("gateway-run-pre-bootstrap", async () => {
			const { prepareGatewayRunBootstrap, recheckGatewayRunBootstrap, wasPreparedGatewayRunCoreStatePristine, wasPreparedGatewayRunStatePristine } = await import("../pre-bootstrap-CorugINi.mjs");
			const prepared = await prepareGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime
			});
			if (prepared) {
				skipPristineStartupStateMigrations = wasPreparedGatewayRunStatePristine();
				skipPristineCoreStateMigrations = wasPreparedGatewayRunCoreStatePristine();
				beforeStateMigrations = (snapshot) => recheckGatewayRunBootstrap({
					opts,
					runtime: defaultRuntime,
					...snapshot ? { snapshot } : {}
				});
			}
			return prepared;
		})) return;
		await startupTrace.measure("gateway-run-bootstrap", async () => {
			await ensureCliExecutionBootstrap({
				runtime: defaultRuntime,
				commandPath,
				startupPolicy,
				loadPlugins: false,
				...beforeStateMigrations ? { beforeStateMigrations } : {},
				...skipPristineStartupStateMigrations ? { skipPristineStartupStateMigrations: true } : {},
				...skipPristineCoreStateMigrations ? { skipPristineCoreStateMigrations: true } : {}
			});
			const { reloadTrustedGatewayRunEnvironment } = await import("../pre-bootstrap-CorugINi.mjs");
			await reloadTrustedGatewayRunEnvironment({ runtime: defaultRuntime });
		});
	};
	addGatewayRunCommand(addGatewayRunCommand(program.command("gateway").description("Run, inspect, and query the WebSocket Gateway"), { beforeRun }).command("run").description("Run the WebSocket Gateway (foreground)"), { beforeRun });
	const parseArgv = normalizeRootNoColorArgvForProgram(argv, program);
	try {
		await startupTrace.measure("gateway-run-parse", () => program.parseAsync(parseArgv), { timeline: false });
	} catch (error) {
		if (!isCommanderParseExit(error)) throw error;
		process$1.exitCode = error.exitCode;
	}
	return true;
}
async function shouldStartOnboardingForFreshInstall(argv) {
	if (!shouldHandleBareRoot(argv)) return false;
	const { readConfigFileSnapshot } = await import("../config/config.js");
	const snapshot = await readConfigFileSnapshot();
	return shouldStartLocalOnboarding(snapshot);
}
async function resolveBareRootLaunchTarget(argv) {
	if (!shouldHandleBareRoot(argv)) return null;
	const { readConfigFileSnapshot } = await import("../config/config.js");
	const snapshot = await readConfigFileSnapshot();
	if (await shouldStartLocalOnboarding(snapshot)) return { kind: "onboarding" };
	if (!snapshot.valid) return {
		kind: "onboarding",
		classic: true
	};
	return resolveConfiguredTuiLaunchTarget(snapshot.config ?? snapshot.sourceConfig, { hasConfiguredGateway: snapshot.sourceConfig.gateway !== void 0 });
}
async function resolveConfiguredTuiLaunchTarget(config, options) {
	const gatewayResolution = await resolveReachableGateway(config, options);
	if (gatewayResolution.kind === "configured" || gatewayResolution.kind === "reachable-unverified" || gatewayResolution.kind === "configured-unreachable") {
		const gateway = gatewayResolution.gateway;
		const target = {
			kind: "tui",
			local: false,
			config,
			gatewayUrl: gateway.url
		};
		if (gateway.token) target.token = gateway.token;
		if (gateway.password) target.password = gateway.password;
		if (gateway.tlsFingerprint) target.tlsFingerprint = gateway.tlsFingerprint;
		return target;
	}
	if (gatewayResolution.kind === "missing-configured-model") {
		if (gatewayResolution.gateway.remote) return {
			kind: "remote-gateway-inference",
			target: {
				config,
				gatewayUrl: gatewayResolution.gateway.url,
				...gatewayResolution.gateway.token ? { token: gatewayResolution.gateway.token } : {},
				...gatewayResolution.gateway.password ? { password: gatewayResolution.gateway.password } : {},
				...gatewayResolution.gateway.tlsFingerprint ? { tlsFingerprint: gatewayResolution.gateway.tlsFingerprint } : {}
			}
		};
		return { kind: "onboarding" };
	}
	const { listAgentIds, resolveAgentEffectiveModelPrimary } = await import("../agent-scope-C4CYkKyC.mjs");
	if (!listAgentIds(config).some((agentId) => resolveAgentEffectiveModelPrimary(config, agentId))) return { kind: "onboarding" };
	return {
		kind: "tui",
		local: true
	};
}
function toReachableGateway(target, auth) {
	return {
		url: target.url,
		remote: target.scope === "remote",
		...auth.token ? { token: auth.token } : {},
		...auth.password ? { password: auth.password } : {},
		...target.tlsFingerprint ? { tlsFingerprint: target.tlsFingerprint } : {}
	};
}
async function resolveReachableGateway(config, options) {
	const { targets, auth } = await resolveGatewayProbePlan(config);
	if (targets.length === 0) return { kind: "unreachable" };
	const { probeGatewayConfiguredModel } = await import("../onboard-helpers-Bs3xm5rG.mjs");
	let missingModelGateway;
	let reachableUnverifiedGateway;
	let configuredGateway;
	for (const target of targets) {
		if (!isSafeGatewayProbeTarget(target)) continue;
		if (options.hasConfiguredGateway && !configuredGateway) configuredGateway = toReachableGateway(target, auth);
		const probeOptions = {
			url: target.url,
			...target.scope === "remote" ? { originScopedDeviceAuth: true } : {}
		};
		if (config.gateway?.remote?.edgeAuth) probeOptions.config = config;
		if (auth.token) probeOptions.token = auth.token;
		if (auth.password) probeOptions.password = auth.password;
		if (target.tlsFingerprint) probeOptions.tlsFingerprint = target.tlsFingerprint;
		if (target.preauthHandshakeTimeoutMs) probeOptions.preauthHandshakeTimeoutMs = target.preauthHandshakeTimeoutMs;
		const probe = await probeGatewayConfiguredModel(probeOptions);
		if (probe.kind === "configured") return {
			kind: "configured",
			gateway: toReachableGateway(target, auth)
		};
		if (probe.kind === "missing-configured-model") {
			missingModelGateway ??= toReachableGateway(target, auth);
			continue;
		}
		if (probe.kind === "reachable-unverified" && !reachableUnverifiedGateway) reachableUnverifiedGateway = toReachableGateway(target, auth);
	}
	if (missingModelGateway) return {
		kind: "missing-configured-model",
		gateway: missingModelGateway
	};
	if (reachableUnverifiedGateway) return {
		kind: "reachable-unverified",
		gateway: reachableUnverifiedGateway
	};
	if (configuredGateway) return {
		kind: "configured-unreachable",
		gateway: configuredGateway
	};
	return { kind: "unreachable" };
}
async function resolveGatewayProbePlan(config) {
	const remoteUrl = normalizeOptionalString(config.gateway?.remote?.url);
	if (normalizeOptionalString(config.gateway?.mode) === "remote" && remoteUrl) try {
		const { resolveGatewayClientBootstrap } = await import("../client-bootstrap-DFsOcSzX.mjs");
		const bootstrap = await resolveGatewayClientBootstrap({
			config,
			authPolicy: "probe",
			modeOverride: "remote",
			ignoreEnvUrlOverride: true
		});
		return {
			targets: [{
				url: bootstrap.url,
				scope: "remote",
				...bootstrap.tlsFingerprint ? { tlsFingerprint: bootstrap.tlsFingerprint } : {}
			}],
			auth: bootstrap.auth
		};
	} catch {
		return {
			targets: [],
			auth: {}
		};
	}
	return resolveLocalGatewayProbeTargets(config);
}
function isSafeGatewayProbeTarget(target) {
	if (target.scope === "remote") return isSafeRemoteGatewayProbeUrl(target.url);
	return isSecureWebSocketUrl(target.url, { allowPrivateWs: process$1.env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1" });
}
function isSafeRemoteGatewayProbeUrl(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return false;
	}
	const protocol = normalizeWebSocketProtocol(parsed.protocol);
	if (protocol === "wss:") return true;
	if (protocol !== "ws:") return false;
	if (isLoopbackGatewayHost(parsed.hostname)) return true;
	return process$1.env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1" && isSecureWebSocketUrl(url, { allowPrivateWs: true });
}
function isLoopbackGatewayHost(hostname) {
	const normalized = hostname.toLowerCase().replace(/\.+$/, "");
	if (normalized === "localhost") return true;
	const hostForIpCheck = normalized.startsWith("[") && normalized.endsWith("]") ? normalized.slice(1, -1) : normalized;
	return isLoopbackAddress(hostForIpCheck);
}
async function resolveLocalGatewayProbeTargets(config) {
	const [{ resolveControlUiLinks }, { resolveGatewayClientBootstrap }, { readActiveGatewayLockPort }] = await Promise.all([
		import("../control-ui-links-CLd-5Gpl.mjs"),
		import("../client-bootstrap-DFsOcSzX.mjs"),
		import("../gateway-lock-Iihe0f2N.mjs")
	]);
	const gateway = config.gateway;
	const configuredPort = resolveGatewayPort(config);
	const port = (Boolean(normalizeOptionalString(process$1.env.OPENCLAW_GATEWAY_PORT)) ? void 0 : await readActiveGatewayLockPort()) ?? configuredPort;
	const connection = await resolveGatewayClientBootstrap({
		config,
		authPolicy: "probe",
		modeOverride: "local",
		ignoreEnvUrlOverride: true,
		localPortOverride: port
	});
	const baseParams = {
		port,
		basePath: gateway?.controlUi?.basePath,
		tlsEnabled: gateway?.tls?.enabled === true
	};
	const sharedTarget = {
		...connection.tlsFingerprint ? { tlsFingerprint: connection.tlsFingerprint } : {},
		...connection.preauthHandshakeTimeoutMs ? { preauthHandshakeTimeoutMs: connection.preauthHandshakeTimeoutMs } : {}
	};
	const loopbackTarget = {
		...sharedTarget,
		url: connection.url,
		scope: "local-loopback"
	};
	const bind = gateway?.bind;
	if (bind !== "tailnet" && bind !== "custom") return {
		targets: [loopbackTarget],
		auth: connection.auth
	};
	const configuredLinks = resolveControlUiLinks({
		...baseParams,
		bind,
		customBindHost: gateway?.customBindHost
	});
	return {
		targets: configuredLinks.wsUrl === connection.url ? [loopbackTarget] : [loopbackTarget, {
			...sharedTarget,
			url: configuredLinks.wsUrl,
			scope: "local-configured"
		}],
		auth: connection.auth
	};
}
function pauseNonTtyStdinForCliExit() {
	const stdin = process$1.stdin;
	if (stdin.isTTY) return;
	try {
		stdin.pause();
	} catch {}
}
function shouldLoadCliDotEnv(loadGlobalEnv, env = process$1.env) {
	const cwd = tryProcessCwd();
	if (cwd && existsSync(path.join(cwd, ".env"))) return true;
	return loadGlobalEnv && existsSync(path.join(resolveStateDir(env), ".env"));
}
function isAgentExecInvocation(commandPath) {
	return commandPath[0] === "agent" && commandPath[1] === "exec";
}
function isCommanderParseExit(error) {
	if (!error || typeof error !== "object") return false;
	const candidate = error;
	return typeof candidate.exitCode === "number" && Number.isInteger(candidate.exitCode) && typeof candidate.code === "string" && candidate.code.startsWith("commander.");
}
function findCommandOption(command, token) {
	const equalsIndex = token.indexOf("=");
	const flag = equalsIndex === -1 ? token : token.slice(0, equalsIndex);
	return command.options.find((option) => option.long === flag || option.short === flag);
}
function findSubcommand(command, name) {
	return command.commands.find((subcommand) => subcommand.name() === name || subcommand.aliases().includes(name));
}
function shouldOptionConsumeFollowingToken(option, token, next) {
	if (!option || token.includes("=")) return false;
	if (option.required) return true;
	return option.optional && isValueToken(next);
}
function resolveRootOptionRole(program, remainingArgs, optionIndex) {
	let command = program;
	let pendingValue = false;
	for (let index = 0; index < optionIndex; index += 1) {
		const arg = remainingArgs[index];
		if (!arg || arg === "--") return "root";
		if (pendingValue) {
			pendingValue = false;
			continue;
		}
		if (arg.startsWith("-")) {
			const option = findCommandOption(command, arg);
			if (!option && index === optionIndex - 1 && !arg.includes("=")) return "value";
			pendingValue = shouldOptionConsumeFollowingToken(option, arg, remainingArgs[index + 1]);
			continue;
		}
		command = findSubcommand(command, arg) ?? command;
	}
	if (pendingValue) return "value";
	const arg = remainingArgs[optionIndex];
	return command !== program && arg !== void 0 && findCommandOption(command, arg) !== void 0 ? "command" : "root";
}
function normalizeRootNoColorArgvForProgram(argv, program) {
	return normalizeRootNoColorArgv(argv, { shouldPreserveNoColor: ({ remainingArgs, noColorIndex }) => resolveRootOptionRole(program, remainingArgs, noColorIndex) === "value" });
}
function normalizeRootLogLevelArgvForProgram(argv, program) {
	return normalizeRootLogLevelArgv(argv, { shouldPreserveLogLevel: ({ remainingArgs, logLevelIndex }) => resolveRootOptionRole(program, remainingArgs, logLevelIndex) !== "root" });
}
async function ensureCliEnvProxyDispatcher() {
	try {
		const { hasEnvHttpProxyAgentConfigured } = await import("../proxy-env-B46lrXG-.mjs");
		if (!hasEnvHttpProxyAgentConfigured()) return;
		const { ensureGlobalUndiciEnvProxyDispatcher } = await import("../undici-global-dispatcher-1FrNSK-e.mjs");
		ensureGlobalUndiciEnvProxyDispatcher();
	} catch {}
}
function isDebugProxyCaptureEnvEnabled(env = process$1.env) {
	return isTruthyEnvValue(env.OPENCLAW_DEBUG_PROXY_ENABLED) || isTruthyEnvValue(env.OPENCLAW_DEBUG_PROXY_REQUIRE);
}
function shouldBootstrapCliProxyBeforeFastPath(env = process$1.env) {
	if (isDebugProxyCaptureEnvEnabled(env)) return true;
	return CLI_PROXY_ENV_KEYS.some((key) => {
		const value = env[key];
		return typeof value === "string" && value.trim().length > 0;
	});
}
function isKnownBuiltInCommandRoot(primary) {
	return getCoreCliCommandNamesCore().includes(primary) || getSubCliEntriesCore().some((entry) => entry.name === primary);
}
function resolvesMachineOutput(descriptor, argv) {
	return descriptor.machineOutput?.({
		argv,
		stdoutIsTTY: isMachineOutputStdoutTTY()
	}) ?? false;
}
function resolveBuiltInMachineOutput(argv) {
	const { primary } = resolveCliArgvInvocation(argv);
	if (!primary) return false;
	const descriptor = [...getCoreCliCommandDescriptors(), ...getSubCliEntriesCore()].find((entry) => entry.name === primary);
	return descriptor ? resolvesMachineOutput(descriptor, argv) : false;
}
async function resolvePluginMachineOutput(params) {
	const { primary } = resolveCliArgvInvocation(params.argv);
	if (!primary || isKnownBuiltInCommandRoot(primary)) return false;
	const { loadPluginCliDescriptors } = await loadCliRegistryLoaderModule();
	const descriptor = (await loadPluginCliDescriptors({
		cfg: params.config,
		env: process$1.env,
		primaryCommand: primary,
		session: params.session
	})).find((entry) => entry.name === primary);
	const resolveOutput = () => descriptor ? resolvesMachineOutput(descriptor, params.argv) : false;
	return params.session ? params.session.withCache(resolveOutput) : resolveOutput();
}
async function isPluginCliRoot(params) {
	try {
		const { resolvePluginCliRootOwnerIds } = await loadCliRegistryLoaderModule();
		const ownerIds = await resolvePluginCliRootOwnerIds({
			cfg: params.config,
			env: process$1.env,
			primaryCommand: params.primary,
			session: params.session
		});
		return ownerIds === null ? null : ownerIds.length > 0;
	} catch {
		return null;
	}
}
function createAllowlistAgnosticCliLookupConfig(config) {
	if (!Array.isArray(config.plugins?.allow) || config.plugins.allow.length === 0) return config;
	return {
		...config,
		plugins: {
			...config.plugins,
			allow: []
		}
	};
}
async function resolveCliCommandSurfaceOwner(params) {
	const { resolveManifestCliCommandSurfaceOwner } = await loadManifestCommandAliasesRuntimeModule();
	const manifestOwner = resolveManifestCliCommandSurfaceOwner({
		command: params.primary,
		config: params.config,
		env: process$1.env
	});
	if (manifestOwner) return manifestOwner;
	try {
		const { resolvePluginCliRootOwnerIds } = await loadCliRegistryLoaderModule();
		return (await resolvePluginCliRootOwnerIds({
			cfg: createAllowlistAgnosticCliLookupConfig(params.config),
			env: process$1.env,
			primaryCommand: params.primary
		}))?.[0];
	} catch {
		return;
	}
}
function resolveUnownedCliPrimaryCandidate(argv) {
	const { primary } = resolveCliArgvInvocation(rewriteUpdateFlagArgv(argv));
	if (!primary || primary === "help" || isReservedNonPluginCommandRoot(primary) || isKnownBuiltInCommandRoot(primary)) return null;
	return primary;
}
async function resolveUnownedCliPrimary(params) {
	const primary = resolveUnownedCliPrimaryCandidate(params.argv);
	if (!primary) return null;
	if (await isPluginCliRoot({
		primary,
		config: params.config,
		session: params.session
	}) !== false) return null;
	return primary;
}
async function resolveUnownedCliPrimaryError(params) {
	const { resolveManifestCommandAliasOwner, resolveManifestToolOwner } = await loadManifestCommandAliasesRuntimeModule();
	const cliCommandSurfaceOwner = await resolveCliCommandSurfaceOwner(params);
	const pluginPolicyMessage = resolveMissingPluginCommandMessage(params.primary, params.config, {
		resolveCommandAliasOwner: resolveManifestCommandAliasOwner,
		resolveToolOwner: resolveManifestToolOwner,
		resolveCliCommandSurfaceOwner: () => cliCommandSurfaceOwner
	});
	if (pluginPolicyMessage) return await createExpectedPluginPolicyError(pluginPolicyMessage);
	const sanitizedPrimary = sanitizeTerminalText(params.primary);
	const displayPrimary = sanitizedPrimary.length <= UNKNOWN_COMMAND_DISPLAY_LIMIT ? sanitizedPrimary : `${truncateUtf16Safe(sanitizedPrimary, 127)}…`;
	const { createCliUnknownCommandError } = await import("../error-output-hCRGhi6j.mjs");
	return createCliUnknownCommandError(displayPrimary, {
		argv: params.argv,
		...displayPrimary === params.primary ? {} : { commandNames: [] }
	});
}
async function createExpectedPluginPolicyError(message) {
	const { ExpectedCliError } = await import("../failure-output-Tnld8e4L.mjs");
	return new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
async function bootstrapCliProxyCaptureAndDispatcher(startupTrace, options = {}) {
	if (isDebugProxyCaptureEnvEnabled()) {
		const [{ initializeDebugProxyCapture, finalizeDebugProxyCapture }, { maybeWarnAboutDebugProxyCoverage }] = await startupTrace.measure("proxy-imports", () => Promise.all([import("../runtime-DyhdZuIn.mjs"), import("../coverage-DY3oM99K.mjs")]));
		initializeDebugProxyCapture("cli");
		process$1.once("exit", () => {
			finalizeDebugProxyCapture();
		});
		maybeWarnAboutDebugProxyCoverage(void 0, (message) => console.warn(message));
	}
	if (options.ensureDispatcher !== false) await startupTrace.measure("proxy-dispatcher", () => ensureCliEnvProxyDispatcher());
}
async function runCli(argv = process$1.argv, options = {}) {
	const runtimeRecoveryEnv = options.runtimeRecoveryEnv ?? { ...process$1.env };
	const originalArgv = normalizeWindowsArgv(argv);
	const builtInMachineOutput = resolveBuiltInMachineOutput(originalArgv);
	return await withConsoleLogsRoutedToStderrForJson(originalArgv, () => {
		const run = async (harnessCleanup) => {
			try {
				return await runCliWithPreparedOutputMode(originalArgv, {
					...options,
					runtimeRecoveryEnv,
					builtInMachineOutput,
					harnessCleanup
				});
			} catch (error) {
				if (isGatewayRunInvocationArgv(originalArgv) && !resolveCliArgvInvocation(originalArgv).hasHelpOrVersion) {
					const { handleGatewayStartupMaintenance } = await import("../startup-maintenance-DTE_kIwV.mjs");
					if (await handleGatewayStartupMaintenance(error)) return;
				}
				throw error;
			} finally {
				const resources = harnessCleanup?.pluginResources;
				if (resources) {
					await runCliDisposer("plugin-registration-resources", async () => {
						try {
							await resources.release();
						} catch (error) {
							console.error(`Plugin CLI resource disposal failed: ${String(error)}`);
							throw error;
						}
					});
					pauseNonTtyStdinForCliExit();
				}
			}
		};
		return withCliPluginInvocation(isGatewayRunInvocationArgv(originalArgv), run);
	}, {
		machineOutput: builtInMachineOutput,
		restoreChanges: true,
		retainRoutingUntilProcessExit: options.retainConsoleRoutingUntilProcessExit
	});
}
async function runCliWithPreparedOutputMode(originalArgv, options) {
	const startupTrace = createGatewayDispatchStartupTrace(originalArgv, "cli.main");
	const earlyProfile = parseCliProfileArgs(originalArgv);
	if (earlyProfile.ok && earlyProfile.profile) applyCliProfileEnv({ profile: earlyProfile.profile });
	const originalInvocation = resolveCliArgvInvocation(originalArgv);
	let consoleCaptureInstalled = false;
	const installConsoleCapture = async () => {
		if (consoleCaptureInstalled) return;
		const { enableConsoleCapture } = await loadLoggingModule();
		enableConsoleCapture();
		consoleCaptureInstalled = true;
	};
	const configureStartupTraces = async () => {
		await configureGatewayStartupTraceConsoleFormatting(startupTrace);
		if (options.additionalStartupTrace) await configureGatewayStartupTraceConsoleFormatting(options.additionalStartupTrace);
	};
	const parsedContainer = parseCliContainerArgs(originalArgv);
	if (!parsedContainer.ok) {
		await installConsoleCapture();
		await configureStartupTraces();
		throw new Error(parsedContainer.error);
	}
	const parsedProfile = parseCliProfileArgs(parsedContainer.argv);
	const containerTargetName = parsedContainer.container ?? normalizeOptionalString(process$1.env.OPENCLAW_CONTAINER) ?? null;
	const hasPreHelpValidationError = !parsedProfile.ok || containerTargetName !== null && parsedProfile.profile !== null;
	if (!originalInvocation.hasHelpOrVersion || containerTargetName !== null || hasPreHelpValidationError) await installConsoleCapture();
	if (!parsedProfile.ok) {
		await configureStartupTraces();
		throw new Error(parsedProfile.error);
	}
	if (parsedProfile.profile) applyCliProfileEnv({ profile: parsedProfile.profile });
	if (containerTargetName && parsedProfile.profile) {
		await configureStartupTraces();
		throw new Error("--container cannot be combined with --profile/--dev");
	}
	let containerTarget;
	try {
		containerTarget = maybeRunCliInContainer(originalArgv);
	} catch (error) {
		await configureStartupTraces();
		throw error;
	}
	if (containerTarget.handled) {
		await configureStartupTraces();
		if (containerTarget.exitCode !== 0) process$1.exitCode = containerTarget.exitCode;
		return;
	}
	const normalizedArgv = rewriteUpdateFlagArgv(normalizeRootHelpTargetArgv(normalizeRootNoColorArgv(parsedProfile.argv)));
	const normalizedInvocation = resolveCliArgvInvocation(normalizedArgv);
	const isHelpOrVersionInvocation = normalizedInvocation.hasHelpOrVersion;
	const isGatewayRunInvocation = isGatewayRunInvocationArgv(normalizedArgv);
	const isDatabaseInvocation = normalizedInvocation.commandPath[0] === "database";
	const loadGlobalEnv = !isGatewayRunInvocation;
	startupTrace.mark("argv");
	const { assertSupportedRuntime, isCurrentRuntimeSupported } = await import("../runtime-guard-ynPCG7W5.mjs");
	await assertSupportedRuntime(void 0, void 0, normalizedArgv, true, options.runtimeRecoveryEnv);
	if (await tryRunGatewayServiceUpdateCapabilityProbe(normalizedArgv)) return;
	if (!isHelpOrVersionInvocation && !isDatabaseInvocation && !isAgentExecInvocation(normalizedInvocation.commandPath) && shouldLoadCliDotEnv(loadGlobalEnv)) await startupTrace.measure("dotenv", async () => {
		if (isRemoteAgentDispatchInvocation(normalizedArgv, normalizedInvocation.primary)) {
			const { loadGatewayDispatchCliDotEnv } = await import("../gateway-dispatch-dotenv-DJESnCWo.mjs");
			await loadGatewayDispatchCliDotEnv({ quiet: true });
		} else {
			const { loadCliDotEnv } = await import("../dotenv-CBg4mACh.mjs");
			loadCliDotEnv({
				loadGlobalEnv,
				quiet: true
			});
		}
	});
	let doctorDatabasePreflight;
	if (!isHelpOrVersionInvocation && normalizedInvocation.primary === "doctor") {
		const { preflightUpdateDoctorCli } = await import("../doctor-update-schema-guard-BWe_oNWT.mjs");
		doctorDatabasePreflight = await preflightUpdateDoctorCli({ json: options.builtInMachineOutput });
	}
	await configureStartupTraces();
	if (!isHelpOrVersionInvocation && isGatewayRunInvocation) await startupTrace.measure("gateway-run-select-environment", async () => {
		const [{ selectGatewayRunEnvironment }, { defaultRuntime }] = await Promise.all([import("../pre-bootstrap-CorugINi.mjs"), import("../runtime-pvh-jBbt.mjs")]);
		await selectGatewayRunEnvironment({
			opts: resolveGatewayRunPreBootstrapOptions(normalizedArgv) ?? {},
			runtime: defaultRuntime
		});
	});
	normalizeEnv();
	if (shouldEnsureCliPath(normalizedArgv)) {
		const { ensureOpenClawCliOnPath } = await import("../path-env-eS0ZGP9u.mjs");
		ensureOpenClawCliOnPath();
	}
	const mayContainBareSessionUrl = normalizedArgv.slice(2).some((arg) => arg.includes("://"));
	const bareSessionInvocation = !isHelpOrVersionInvocation && mayContainBareSessionUrl ? (await import("../session-ref-DG7qGgGg.mjs")).parseBareSessionInvocation(normalizedArgv) : null;
	let proxyHandle = null;
	let proxyStopPromise;
	let onSigterm = null;
	let onSigint = null;
	let onExit = null;
	let unregisterProxySignalExitBarrier = null;
	let bestEffortConfigPromise = null;
	let pluginCliSession;
	const getPluginCliSession = async () => {
		pluginCliSession ??= (await loadCliRegistryLoaderModule()).createPluginCliLoadSession(getPluginCache());
		return pluginCliSession;
	};
	const isolateProxyConfigEnv = isGatewayRunInvocation;
	const bestEffortConfigStartupPolicy = resolveCliStartupPolicy({
		argv: normalizedArgv,
		commandPath: normalizedInvocation.commandPath,
		jsonOutputMode: options.builtInMachineOutput || hasJsonOutputFlag(normalizedArgv),
		env: process$1.env
	});
	const useSourceOnlyBestEffortConfig = !await isCurrentRuntimeSupported() || normalizedInvocation.primary === "update" || normalizedInvocation.primary === "doctor";
	const readBestEffortCliConfig = async () => {
		if (!bestEffortConfigPromise) bestEffortConfigPromise = import("../io-CPLwHuZl.mjs").then(async (configIo) => {
			if (useSourceOnlyBestEffortConfig) return configIo.readSourceConfigBestEffort();
			const readOptions = {
				observe: false,
				...isolateProxyConfigEnv ? { isolateEnv: true } : {},
				...bestEffortConfigStartupPolicy.validateConfigOnly || isGatewayRunInvocation ? { pluginValidation: "core-only" } : { skipPluginValidation: true }
			};
			if (!resolveUnownedCliPrimaryCandidate(normalizedArgv)) return configIo.readBestEffortConfig(readOptions);
			const snapshot = await (await getPluginCliSession()).readConfig(() => configIo.readBestEffortConfigSnapshot(readOptions));
			if (snapshot.configDiagnostics) {
				const { path: configPath, issues } = snapshot.configDiagnostics;
				throw createInvalidConfigError(configPath, formatInvalidConfigDetails(issues));
			}
			return snapshot.config;
		});
		return await bestEffortConfigPromise;
	};
	const uninstallProxySignalHandlers = () => {
		if (onSigterm) {
			process$1.off("SIGTERM", onSigterm);
			onSigterm = null;
		}
		if (onSigint) {
			process$1.off("SIGINT", onSigint);
			onSigint = null;
		}
		if (onExit) {
			process$1.off("exit", onExit);
			onExit = null;
		}
	};
	const stopStartedProxy = () => {
		if (proxyStopPromise) return proxyStopPromise;
		unregisterProxySignalExitBarrier?.();
		unregisterProxySignalExitBarrier = null;
		uninstallProxySignalHandlers();
		const handle = proxyHandle;
		proxyHandle = null;
		const stop = async () => {
			if (handle) {
				const { stopProxy } = await loadProxyLifecycleModule();
				await stopProxy(handle);
			}
		};
		const resources = options.harnessCleanup?.pluginResources;
		proxyStopPromise = Promise.resolve().then(() => resources ? resources.runCleanup(stop) : stop());
		return proxyStopPromise;
	};
	const killStartedProxy = () => {
		const handle = proxyHandle;
		proxyHandle = null;
		handle?.kill("SIGTERM");
	};
	const installProxySignalHandlers = () => {
		if (!proxyHandle || onSigterm || onSigint || onExit) return;
		unregisterProxySignalExitBarrier = registerSignalExitBarrier(stopStartedProxy);
		const shutdown = (exitCode) => {
			waitForSignalExitBarriers().finally(() => {
				process$1.exit(exitCode);
			});
		};
		onSigterm = () => shutdown(143);
		onSigint = () => shutdown(130);
		onExit = () => killStartedProxy();
		process$1.once("SIGTERM", onSigterm);
		process$1.once("SIGINT", onSigint);
		process$1.once("exit", onExit);
	};
	const replaceStartedProxy = async (config) => {
		await stopStartedProxy();
		const { startProxy } = await loadProxyLifecycleModule();
		proxyHandle = await startProxy(config);
		proxyStopPromise = void 0;
		installProxySignalHandlers();
	};
	let uninstallGatewayRunRuntimeHooks = null;
	let unhandledRejectionHandlerInstalled = false;
	try {
		const startupTraces = [startupTrace, options.additionalStartupTrace].filter((trace) => Boolean(trace));
		if (!isDatabaseInvocation && (await Promise.all(startupTraces.map((trace) => trace.requiresDiagnosticsConfig()))).some(Boolean)) {
			const config = await withConsoleLogsRoutedToStderr(readBestEffortCliConfig);
			await Promise.all(startupTraces.map((trace) => trace.configureDiagnosticsTimeline(config)));
		}
		if (!isHelpOrVersionInvocation && !bareSessionInvocation && normalizedInvocation.primary && !isKnownBuiltInCommandRoot(normalizedInvocation.primary)) {
			const config = await withConsoleLogsRoutedToStderr(readBestEffortCliConfig);
			if (await withConsoleLogsRoutedToStderr(() => resolvePluginMachineOutput({
				argv: normalizedArgv,
				config,
				session: pluginCliSession
			}))) {
				const { routeLogsToStderr } = await loadLoggingModule();
				routeLogsToStderr();
			}
		}
		if (!isHelpOrVersionInvocation && shouldStartProxyForCli(normalizedArgv)) {
			const config = await withConsoleLogsRoutedToStderr(readBestEffortCliConfig);
			if (!bareSessionInvocation) {
				const unownedPrimary = await resolveUnownedCliPrimary({
					argv: normalizedArgv,
					config,
					session: pluginCliSession
				});
				if (unownedPrimary) throw await resolveUnownedCliPrimaryError({
					argv: normalizedArgv,
					primary: unownedPrimary,
					config
				});
			}
			await replaceStartedProxy(config?.proxy ?? void 0);
		}
		if (!isHelpOrVersionInvocation && isGatewayRunInvocation) {
			const { installGatewayRunRuntimeHooks } = await import("../runtime-hooks-Bt4RacGS.mjs");
			uninstallGatewayRunRuntimeHooks = installGatewayRunRuntimeHooks({
				releaseManagedProxy: stopStartedProxy,
				refreshManagedProxy: replaceStartedProxy
			});
		}
		if (shouldUseRootHelpFastPath(normalizedArgv)) {
			const { loadRootHelpRenderOptionsForConfigSensitivePlugins } = await loadRootHelpLiveConfigModule();
			const liveRootHelpOptions = await loadRootHelpRenderOptionsForConfigSensitivePlugins(process$1.env);
			if (!liveRootHelpOptions) {
				const { outputPrecomputedRootHelpText } = await loadRootHelpMetadataModule();
				if (outputPrecomputedRootHelpText()) return;
			}
			const { outputRootHelp } = await import("../root-help-5In6uMzS.mjs");
			await outputRootHelp(liveRootHelpOptions ?? void 0);
			return;
		}
		if (await tryOutputPrecomputedCommandHelp(normalizedArgv)) return;
		if (shouldUseSetupOnboardConfigureHelpFastPath(normalizedArgv)) {
			const { tryOutputSetupOnboardConfigureHelp } = await import("../setup-onboard-configure-help-fast-path-CtKpnmIi.mjs");
			if (await tryOutputSetupOnboardConfigureHelp(normalizedArgv)) return;
		}
		await installConsoleCapture();
		if (bareSessionInvocation) {
			if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
				console.error("OpenClaw TUI needs an interactive TTY. Use `openclaw agent --local ...` for automation.");
				process$1.exitCode = 1;
				return;
			}
			const { runTuiCliAction } = await import("../tui-cli-BbHWfDH1.mjs");
			await runTuiCliAction(bareSessionInvocation.target, bareSessionInvocation.options);
			return;
		}
		if (resolveUnownedCliPrimaryCandidate(normalizedArgv)) {
			const config = await readBestEffortCliConfig();
			const unownedPrimary = await resolveUnownedCliPrimary({
				argv: normalizedArgv,
				config,
				session: pluginCliSession
			});
			if (unownedPrimary) throw await resolveUnownedCliPrimaryError({
				argv: normalizedArgv,
				primary: unownedPrimary,
				config
			});
		}
		const shouldRunBareRootCommand = shouldHandleBareRoot(normalizedArgv);
		if (shouldRunBareRootCommand) await ensureCliEnvProxyDispatcher();
		const bareRootLaunchTarget = shouldRunBareRootCommand ? await resolveBareRootLaunchTarget(normalizedArgv) : null;
		if (bareRootLaunchTarget) {
			if (bareRootLaunchTarget.kind === "remote-gateway-inference") {
				if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
					console.error("Remote Gateway inference setup needs an interactive TTY. Re-run `openclaw` in a terminal connected to this Gateway.");
					process$1.exitCode = 1;
					return;
				}
				const { runRemoteGatewayInferenceOnboarding } = await import("../onboard-remote-gateway-BVkWYF1v.mjs");
				await runRemoteGatewayInferenceOnboarding(bareRootLaunchTarget.target);
				return;
			}
			if (bareRootLaunchTarget.kind === "onboarding") {
				if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
					console.error(bareRootLaunchTarget.classic ? "OpenClaw config is invalid. Run `openclaw doctor --fix` before onboarding." : "Onboarding needs an interactive TTY. Use `openclaw onboard --non-interactive --accept-risk ...` for automation.");
					process$1.exitCode = 1;
					return;
				}
				const { setupWizardCommand } = await import("../onboard-DdmoiyHl.mjs");
				await setupWizardCommand(bareRootLaunchTarget.classic ? { classic: true } : {});
				return;
			}
			if (bareRootLaunchTarget.kind === "tui") {
				if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
					console.error("OpenClaw TUI needs an interactive TTY. Use `openclaw agent --local ...` for automation.");
					process$1.exitCode = 1;
					return;
				}
				const { runTui } = await import("../tui-CpM7h_qw.mjs");
				await runTui({
					...bareRootLaunchTarget.local ? {
						deliver: false,
						local: true
					} : {
						deliver: false,
						config: bareRootLaunchTarget.config,
						boundGateway: {
							url: bareRootLaunchTarget.gatewayUrl,
							...bareRootLaunchTarget.token ? { token: bareRootLaunchTarget.token } : {},
							...bareRootLaunchTarget.password ? { password: bareRootLaunchTarget.password } : {},
							...bareRootLaunchTarget.tlsFingerprint ? { tlsFingerprint: bareRootLaunchTarget.tlsFingerprint } : {}
						}
					},
					forceProcessExitOnReturn: true
				});
				return;
			}
		}
		const shouldUseCliEnvProxy = !isHelpOrVersionInvocation && shouldStartProxyForCli(normalizedArgv);
		const bootstrapProxyBeforeFastPath = shouldUseCliEnvProxy && shouldBootstrapCliProxyBeforeFastPath();
		if (isGatewayRunFastPathArgv(normalizedArgv)) {
			const { installUnhandledRejectionHandler } = await startupTrace.measure("unhandled-rejection-handler-import", () => import("../unhandled-rejections-BrGfFgus.mjs"));
			installUnhandledRejectionHandler();
			unhandledRejectionHandlerInstalled = true;
		}
		if (!bootstrapProxyBeforeFastPath && await tryRunGatewayRunFastPath(normalizedArgv, startupTrace)) return;
		if (!isHelpOrVersionInvocation && !isDatabaseInvocation) await bootstrapCliProxyCaptureAndDispatcher(startupTrace, { ensureDispatcher: shouldUseCliEnvProxy });
		if (bootstrapProxyBeforeFastPath && await tryRunGatewayRunFastPath(normalizedArgv, startupTrace)) return;
		if (!isHelpOrVersionInvocation) {
			const route = await startupTrace.measure("route-import", () => import("../route-Bsj6mAYi.mjs"));
			if (await startupTrace.measure("route", () => options.builtInMachineOutput ? route.tryRouteCli(normalizedArgv, { machineOutput: true }) : route.tryRouteCli(normalizedArgv), { timeline: false })) return;
		}
		let parseArgv = normalizeGeneratedHelpCommandArgv(normalizedArgv);
		const suppressStartupProgress = options.builtInMachineOutput || hasJsonOutputFlag(parseArgv);
		const { createCliProgress } = await loadProgressModule();
		const startupProgress = createCliProgress({
			label: "Loading OpenClaw CLI…",
			indeterminate: true,
			delayMs: 0,
			...suppressStartupProgress ? { enabled: false } : {}
		});
		let startupProgressStopped = false;
		const stopStartupProgress = () => {
			if (startupProgressStopped) return;
			startupProgressStopped = true;
			startupProgress.done();
		};
		try {
			const [{ buildProgram }, { formatUncaughtError }, { formatCliFailureLines, formatCliJsonFailure }, { runFatalErrorHooks }, { installUnhandledRejectionHandler, isBenignUncaughtExceptionError, isUncaughtExceptionHandled }, { defaultRuntime, restoreRuntimeTerminalState }] = await startupTrace.measure("core-imports", () => Promise.all([
				import("../program-DD8zl5mP.mjs"),
				import("../infra/errors.js"),
				import("../failure-output-Tnld8e4L.mjs"),
				import("../fatal-error-hooks-CCSjrmQf.mjs"),
				import("../unhandled-rejections-BrGfFgus.mjs"),
				import("../runtime-pvh-jBbt.mjs")
			]));
			const program = await startupTrace.measure("build-program", () => buildProgram({
				doctorDatabasePreflight,
				runtimeRecoveryEnv: options.runtimeRecoveryEnv
			}));
			await options.harnessCleanup?.pluginResources?.waitForRegistrations();
			if (!unhandledRejectionHandlerInstalled) installUnhandledRejectionHandler();
			process$1.on("uncaughtException", (error) => {
				if (isUncaughtExceptionHandled(error)) return;
				if (isBenignUncaughtExceptionError(error)) {
					console.warn("[openclaw] Non-fatal uncaught exception (continuing):", formatUncaughtError(error));
					return;
				}
				if (isJsonOutputModeActive(normalizedArgv)) defaultRuntime.writeJson(formatCliJsonFailure(error));
				for (const line of formatCliFailureLines({
					title: "OpenClaw hit an unexpected runtime error.",
					error,
					argv: normalizedArgv
				})) console.error(line);
				for (const message of runFatalErrorHooks({
					reason: "uncaught_exception",
					error
				})) console.error("[openclaw]", message);
				restoreRuntimeTerminalState("uncaught exception", { resumeStdinIfPaused: false });
				process$1.exit(1);
			});
			const invocation = resolveCliArgvInvocation(parseArgv);
			const { primary } = invocation;
			if (primary) await startupTrace.measure("register-primary", async () => {
				const { getProgramContext } = await import("../program-context-Dmi_zvNV.mjs");
				const ctx = getProgramContext(program);
				if (ctx) {
					const { registerCoreCliByName } = await import("../command-registry-DLQhAE50.mjs");
					await registerCoreCliByName(program, ctx, primary);
				}
				const { registerSubCliByName } = await import("../register.subclis-C7VCfgl1.mjs");
				await registerSubCliByName(program, primary, parseArgv);
			});
			const hasBuiltinPrimary = primary !== null && program.commands.some((command) => command.name() === primary || command.aliases().includes(primary));
			if (!shouldSkipPluginCommandRegistration({
				argv: parseArgv,
				primary,
				hasBuiltinPrimary
			})) {
				const config = await startupTrace.measure("register-plugin-commands", async () => {
					const { registerPluginCliCommandsFromValidatedConfig } = await import("../cli-BINL6Puk.mjs");
					const startupPolicy = resolveCliStartupPolicy({
						argv: parseArgv,
						commandPath: invocation.commandPath,
						jsonOutputMode: suppressStartupProgress
					});
					return await registerPluginCliCommandsFromValidatedConfig(program, void 0, void 0, {
						mode: "lazy",
						primary,
						skipPluginValidation: startupPolicy.skipConfigGuard,
						session: await getPluginCliSession()
					});
				});
				if (primary && !program.commands.some((command) => command.name() === primary || command.aliases().includes(primary))) {
					const { resolveManifestCommandAliasOwner, resolveManifestToolOwner } = await loadManifestCommandAliasesRuntimeModule();
					const cliCommandSurfaceOwner = await resolveCliCommandSurfaceOwner({
						primary,
						config
					});
					const missingPluginCommandMessage = resolveMissingPluginCommandMessage(primary, config, {
						resolveCommandAliasOwner: resolveManifestCommandAliasOwner,
						resolveToolOwner: resolveManifestToolOwner,
						resolveCliCommandSurfaceOwner: () => cliCommandSurfaceOwner
					});
					if (missingPluginCommandMessage) throw await createExpectedPluginPolicyError(missingPluginCommandMessage);
				}
			}
			parseArgv = normalizeRootLogLevelArgvForProgram(normalizeRootNoColorArgvForProgram(parseArgv, program), program);
			stopStartupProgress();
			let completedHelpOrVersion = false;
			try {
				const resources = options.harnessCleanup?.pluginResources;
				await resources?.waitForRegistrations();
				pluginCliSession?.close();
				const parse = () => startupTrace.measure("parse", () => program.parseAsync(parseArgv), { timeline: false });
				await (resources ? resources.run(parse) : parse());
				await resources?.waitForRegistrations();
				completedHelpOrVersion = isHelpOrVersionInvocation;
			} catch (error) {
				if (!isCommanderParseExit(error)) throw error;
				if (isJsonOutputModeActive(parseArgv) && error.exitCode !== 0) throw error;
				process$1.exitCode = error.exitCode;
				completedHelpOrVersion = isHelpOrVersionInvocation && error.exitCode === 0;
			}
			if (completedHelpOrVersion) requestExitAfterOneShotOutput();
		} finally {
			stopStartupProgress();
		}
	} finally {
		pluginCliSession?.close();
		uninstallGatewayRunRuntimeHooks?.();
		const resources = options.harnessCleanup?.pluginResources;
		await runCliDisposer("managed-proxy", stopStartedProxy, resources?.runCleanup);
		await closeCliResources(options.harnessCleanup);
		if (!resources) pauseNonTtyStdinForCliExit();
	}
}
//#endregion
export { isGatewayRunFastPathArgv, rewriteUpdateFlagArgv, runCli, shouldEnsureCliPath, shouldHandleBareRoot, shouldStartOnboardingForFreshInstall, shouldStartProxyForCli, shouldUseRootHelpFastPath, shouldUseSetupOnboardConfigureHelpFastPath };
