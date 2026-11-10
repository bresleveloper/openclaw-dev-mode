import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../string-coerce-1VuiLaaR.mjs";
import { a as getCommandPositionalsWithRootOptions, s as isValueToken } from "../cli-root-options-DGcy1qRg.mjs";
import { A as consumeGatewayRunOptionToken, M as resolveGatewayCatalogCommandPath, N as resolveGatewayRunPreBootstrapOptions, R as getCoreCliCommandDescriptors, V as getCoreCliParentDefaultHelpCommands, W as isMachineOutputStdoutTTY, _ as rewriteUpdateFlagArgv, b as getSubCliParentDefaultHelpCommands, f as isSimpleCommandHelpInvocation, g as normalizeRootNoColorArgv, h as normalizeRootLogLevelArgv, j as isGatewayRunInvocationArgv, k as consumeGatewayFastPathRootOptionToken, m as normalizeRootHelpTargetArgv, p as normalizeGeneratedHelpCommandArgv, y as getSubCliEntriesCore } from "../argv-C7hqFLn5.mjs";
import { c as getPluginCache } from "../plugin-cache-BbahpD-b.mjs";
import { t as resolveCliArgvInvocation } from "../argv-invocation-CJfjJu7L.mjs";
import { n as tryProcessCwd } from "../safe-cwd-DOxDm8mD.mjs";
import { n as parseCliProfileArgs, t as applyCliProfileEnv } from "../profile-Dw600tcl.mjs";
import { n as tryRunUpdateAdmissionBeforeStartup } from "../run-main-update-admission-p8v6RIi-.mjs";
import { i as normalizeEnv, n as isTruthyEnvValue } from "../env-DbG527wb.mjs";
import { i as createGatewayDispatchStartupTrace, n as configureGatewayStartupTraceConsoleFormatting, t as configureCliStartupDiagnostics } from "../startup-trace-AW_r3L-l.mjs";
import { r as truncateUtf16Safe } from "../utf16-slice-D_ngcYKd.mjs";
import { n as parseCliContainerArgs, t as maybeRunCliInContainer } from "../container-target-DzrX5jVY.mjs";
import { t as tryOutputPrecomputedCommandHelp } from "../precomputed-help-DJl_rjz7.mjs";
import { t as normalizeWindowsArgv } from "../windows-argv-YUCPtVGt.mjs";
import { r as resolveStateDir } from "../state-dir-C8s3cOPX.mjs";
import { b as resolveGatewayPort } from "../paths-orClZ-2Z.mjs";
import { i as registerSignalExitBarrier, t as exitAfterSignalExitBarriers } from "../signal-exit-barrier-DtR3X_NN.mjs";
import { n as sanitizeTerminalText } from "../safe-text-BjmWJADa.mjs";
import { i as formatInvalidConfigDetails, r as createInvalidConfigError } from "../io.invalid-config-CsqYoW4w.mjs";
import { t as normalizeWebSocketProtocol } from "../websocket-protocol-MDxbNIbL.mjs";
import { s as isLoopbackHost, u as isSecureWebSocketUrl } from "../net-CjQwRK-V.mjs";
import { n as withDeferredDebugProxyCapture } from "../runtime-deferral-Bdhp4T3g.mjs";
import { r as runCliDisposer, t as closeCliResources } from "../runtime-cleanup-DQlcWeTy.mjs";
import { n as requestExitAfterOneShotOutput } from "../one-shot-exit-DmuNrGrj.mjs";
import { a as withConsoleLogsRoutedToStderrForJson, i as withConsoleLogsRoutedToStderr, n as hasJsonOutputFlag, r as isJsonOutputModeActive } from "../json-output-mode-CjwEBwVY.mjs";
import { r as shouldSkipPluginCommandRegistration, t as isReservedNonPluginCommandRoot } from "../command-registration-policy-Bsx-L4oT.mjs";
import { n as resolveCliNetworkProxyPolicy, t as resolveCliCommandPathPolicy } from "../command-path-policy-u5WGwKHZ.mjs";
import { t as resolveCliStartupPolicy } from "../command-startup-policy-_d9_K0F3.mjs";
import { t as tryRunGatewayServiceUpdateCapabilityProbe } from "../update-capability-D9eYwsHU.mjs";
import { n as shouldStartLocalOnboarding } from "../fresh-install-config-Bi-9QLEM.mjs";
import { t as withCliPluginInvocation } from "../run-main-plugin-cache-BUJVO30q.mjs";
import { existsSync } from "node:fs";
import process$1 from "node:process";
import path from "node:path";
//#region src/cli/run-main-options.ts
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
//#endregion
//#region src/cli/run-main-policy.ts
const ROOT_HELP_ALIASES = /* @__PURE__ */ new Set(["tools", "help"]);
const SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS = /* @__PURE__ */ new Set([
	"setup",
	"onboard",
	"configure"
]);
const BARE_PARENT_DEFAULT_HELP_COMMANDS = /* @__PURE__ */ new Set([...getCoreCliParentDefaultHelpCommands(), ...getSubCliParentDefaultHelpCommands()]);
const CLI_PROXY_ENV_KEYS = [
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"ALL_PROXY",
	"http_proxy",
	"https_proxy",
	"all_proxy"
];
function shouldLoadCliDotEnv(loadGlobalEnv) {
	const cwd = tryProcessCwd();
	if (cwd && existsSync(path.join(cwd, ".env"))) return true;
	return loadGlobalEnv && existsSync(path.join(resolveStateDir(), ".env"));
}
function isGatewayRunFastPathArgv(argv) {
	if (resolveCliArgvInvocation(argv).hasHelpOrVersion) return false;
	const args = argv.slice(2);
	let sawGateway = false;
	let sawRun = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") return false;
		const rootConsumed = consumeGatewayFastPathRootOptionToken(args, index);
		if (rootConsumed > 0) {
			index += rootConsumed - 1;
			continue;
		}
		if (!sawGateway) {
			if (arg !== "gateway") return false;
			sawGateway = true;
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
function isRemoteAgentDispatchInvocation(argv, primary) {
	return primary === "agent" && !argv.includes("--local");
}
function isAgentExecInvocation(commandPath) {
	return commandPath[0] === "agent" && commandPath[1] === "exec";
}
function isBareParentDefaultHelpArgv(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	const [primary, extra] = invocation.commandPath;
	return !invocation.hasHelpOrVersion && primary !== void 0 && extra === void 0 ? BARE_PARENT_DEFAULT_HELP_COMMANDS.has(primary) : false;
}
function shouldEnsureCliPath(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || shouldHandleBareRoot(argv) || isBareParentDefaultHelpArgv(argv)) return false;
	return resolveCliCommandPathPolicy(invocation.commandPath).ensureCliPath;
}
function shouldUseRootHelpFastPath(argv, env = process.env) {
	const invocation = resolveCliArgvInvocation(argv);
	return env.OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH !== "1" && (invocation.isRootHelpInvocation || invocation.commandPath.length === 1 && ROOT_HELP_ALIASES.has(invocation.commandPath[0] ?? "") && invocation.hasHelpOrVersion);
}
function shouldUseSetupOnboardConfigureHelpFastPath(argv, env = process.env) {
	if (env.OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH === "1") return false;
	return isSimpleCommandHelpInvocation(argv, SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS);
}
function shouldHandleBareRoot(argv) {
	return getCommandPositionalsWithRootOptions(argv, {
		commandPath: [],
		maxPositionals: 1,
		mode: "command-path"
	})?.length === 0;
}
function shouldStartProxyForCli(argv) {
	const policyArgv = rewriteUpdateFlagArgv(argv);
	const invocation = resolveCliArgvInvocation(policyArgv);
	const [primary] = invocation.commandPath;
	if (invocation.hasHelpOrVersion || !primary) return false;
	if (isBareParentDefaultHelpArgv(policyArgv)) return false;
	return resolveCliNetworkProxyPolicy(policyArgv) === "default";
}
function isDebugProxyCaptureEnvEnabled(env = process.env) {
	return isTruthyEnvValue(env.OPENCLAW_DEBUG_PROXY_ENABLED) || isTruthyEnvValue(env.OPENCLAW_DEBUG_PROXY_REQUIRE);
}
function shouldBootstrapCliProxyBeforeFastPath(env = process.env) {
	if (isDebugProxyCaptureEnvEnabled(env)) return true;
	return CLI_PROXY_ENV_KEYS.some((key) => normalizeOptionalString(env[key]) !== void 0);
}
function formatExcludedPluginCommand(command, owner) {
	return owner === command ? `The \`openclaw ${command}\` command is unavailable because \`plugins.allow\` excludes "${command}". Add "${command}" to \`plugins.allow\` if you want that bundled plugin CLI surface.` : `"${command}" is not a plugin; it is a command provided by the "${owner}" plugin. Add "${owner}" to \`plugins.allow\` instead of "${command}".`;
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
		if (allow.length > 0 && !allow.includes(parentPluginId)) return formatExcludedPluginCommand(normalizedPluginId, parentPluginId);
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
		return formatExcludedPluginCommand(normalizedPluginId, normalizedCliCommandSurfaceOwner);
	}
	if (config?.plugins?.entries?.[normalizedPluginId]?.enabled === false) return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.entries.${normalizedPluginId}.enabled=false\`. Re-enable that entry if you want the bundled plugin CLI surface.`;
	return null;
}
//#endregion
//#region src/cli/run-main.ts
const UNKNOWN_COMMAND_DISPLAY_LIMIT = 128;
const TUI_REQUIRES_TTY = "OpenClaw TUI needs an interactive TTY. Use `openclaw agent --local ...` for automation.";
function requireInteractiveTty(message) {
	if (process$1.stdin.isTTY && process$1.stdout.isTTY) return true;
	console.error(message);
	process$1.exitCode = 1;
	return false;
}
async function tryRunGatewayRunFastPath(argv, startupTrace) {
	if (!isGatewayRunFastPathArgv(argv)) return false;
	const [{ Command }, { addGatewayRunCommand, bootstrapGatewayRun }, { VERSION }, { emitCliBanner }, { defaultRuntime }] = await startupTrace.measure("gateway-run-imports", () => Promise.all([
		import("commander"),
		import("../run-command-Y2dyEL5E.mjs"),
		import("../version-Dhb_IK_3.mjs"),
		import("../banner-fhBKtVQL.mjs"),
		import("../runtime-DqKM42HJ.mjs")
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
	const beforeRun = (opts) => bootstrapGatewayRun({
		opts,
		runtime: defaultRuntime,
		commandPath,
		startupPolicy,
		startupTrace
	});
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
async function resolveBareRootLaunchTarget() {
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
	if (gatewayResolution.kind !== "unreachable") {
		const { url, remote, ...auth } = gatewayResolution.gateway;
		const target = {
			config,
			gatewayUrl: url,
			...remote ? { configuredRemote: true } : {},
			...auth
		};
		if (gatewayResolution.kind !== "missing-configured-model") return {
			kind: "tui",
			local: false,
			...target
		};
		return remote ? {
			kind: "remote-gateway-inference",
			target
		} : { kind: "onboarding" };
	}
	const { listAgentIds, resolveAgentEffectiveModelPrimary } = await import("../agent-scope-B7r8PTbp.mjs");
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
	const { probeGatewayConfiguredModel } = await import("../onboard-helpers-G-2HeHvm.mjs");
	let missingModelGateway;
	let reachableUnverifiedGateway;
	let configuredGateway;
	for (const target of targets) {
		if (!isSafeGatewayProbeTarget(target)) continue;
		const gateway = toReachableGateway(target, auth);
		if (options.hasConfiguredGateway && !configuredGateway) configuredGateway = gateway;
		const { remote, ...connection } = gateway;
		const probe = await probeGatewayConfiguredModel({
			...connection,
			...remote ? {
				config,
				originScopedDeviceAuth: true,
				configuredRemote: true
			} : {},
			...config.gateway?.remote?.edgeAuth ? { config } : {},
			...target.preauthHandshakeTimeoutMs ? { preauthHandshakeTimeoutMs: target.preauthHandshakeTimeoutMs } : {}
		});
		if (probe.kind === "configured") return {
			kind: "configured",
			gateway
		};
		if (probe.kind === "missing-configured-model") {
			missingModelGateway ??= gateway;
			continue;
		}
		if (probe.kind === "reachable-unverified" && !reachableUnverifiedGateway) reachableUnverifiedGateway = gateway;
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
		const { resolveGatewayClientBootstrap } = await import("../client-bootstrap-DwQYrVeV.mjs");
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
	if (isLoopbackHost(parsed.hostname.replace(/\.+$/, ""))) return true;
	return process$1.env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1" && isSecureWebSocketUrl(url, { allowPrivateWs: true });
}
async function resolveLocalGatewayProbeTargets(config) {
	const [{ resolveControlUiLinks }, { resolveGatewayClientBootstrap }, { readActiveGatewayLockPort }] = await Promise.all([
		import("../control-ui-links-L6dgq0Eo.mjs"),
		import("../client-bootstrap-DwQYrVeV.mjs"),
		import("../gateway-lock-BLFQD0F1.mjs")
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
function isCommanderParseExit(error) {
	if (!error || typeof error !== "object") return false;
	const candidate = error;
	return typeof candidate.exitCode === "number" && Number.isInteger(candidate.exitCode) && typeof candidate.code === "string" && candidate.code.startsWith("commander.");
}
async function ensureCliEnvProxyDispatcher() {
	try {
		const { hasEnvHttpProxyAgentConfigured } = await import("../proxy-env-BLBPNhCH.mjs");
		if (!hasEnvHttpProxyAgentConfigured()) return;
		const { ensureGlobalUndiciEnvProxyDispatcher } = await import("../undici-global-dispatcher-BEHy_gBa.mjs");
		ensureGlobalUndiciEnvProxyDispatcher();
	} catch {}
}
function findBuiltInCommandDescriptor(primary) {
	return [...getCoreCliCommandDescriptors(), ...getSubCliEntriesCore()].find((entry) => entry.name === primary);
}
function resolvesMachineOutput(descriptor, argv) {
	return descriptor.machineOutput?.({
		argv,
		stdoutIsTTY: isMachineOutputStdoutTTY()
	}) ?? false;
}
function resolveBuiltInMachineOutput({ argv, primary }) {
	const descriptor = primary ? findBuiltInCommandDescriptor(primary) : void 0;
	return descriptor ? resolvesMachineOutput(descriptor, argv) : false;
}
async function resolvePluginMachineOutput(params) {
	const { primary } = resolveCliArgvInvocation(params.argv);
	if (!primary || findBuiltInCommandDescriptor(primary)) return false;
	const { loadPluginCliDescriptors } = await import("../cli-registry-loader-oT9ljgF8.mjs");
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
		const { resolvePluginCliRootOwnerIds } = await import("../cli-registry-loader-oT9ljgF8.mjs");
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
	const { resolveManifestCliCommandSurfaceOwner } = await import("../manifest-command-aliases.runtime-D8jQx_Vk.mjs");
	const manifestOwner = resolveManifestCliCommandSurfaceOwner({
		command: params.primary,
		config: params.config,
		env: process$1.env
	});
	if (manifestOwner) return manifestOwner;
	try {
		const { resolvePluginCliRootOwnerIds } = await import("../cli-registry-loader-oT9ljgF8.mjs");
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
	if (!primary || primary === "help" || isReservedNonPluginCommandRoot(primary) || findBuiltInCommandDescriptor(primary)) return null;
	return primary;
}
async function assertCliPrimaryOwned(params) {
	const primary = resolveUnownedCliPrimaryCandidate(params.argv);
	if (!primary) return;
	if (await isPluginCliRoot({
		primary,
		config: params.config,
		session: params.session
	}) !== false) return;
	const pluginPolicyError = await resolveExpectedPluginPolicyError({
		primary,
		config: params.config
	});
	if (pluginPolicyError) throw pluginPolicyError;
	const sanitizedPrimary = sanitizeTerminalText(primary);
	const displayPrimary = sanitizedPrimary.length <= UNKNOWN_COMMAND_DISPLAY_LIMIT ? sanitizedPrimary : `${truncateUtf16Safe(sanitizedPrimary, 127)}…`;
	const { createCliUnknownCommandError } = await import("../error-output-DZ7xteQj.mjs");
	throw createCliUnknownCommandError(displayPrimary, {
		argv: params.argv,
		...displayPrimary === primary ? {} : { commandNames: [] }
	});
}
async function resolveExpectedPluginPolicyError(params) {
	const { resolveManifestCommandAliasOwner, resolveManifestToolOwner } = await import("../manifest-command-aliases.runtime-D8jQx_Vk.mjs");
	const cliCommandSurfaceOwner = await resolveCliCommandSurfaceOwner(params);
	const message = resolveMissingPluginCommandMessage(params.primary, params.config, {
		resolveCommandAliasOwner: resolveManifestCommandAliasOwner,
		resolveToolOwner: resolveManifestToolOwner,
		resolveCliCommandSurfaceOwner: () => cliCommandSurfaceOwner
	});
	if (!message) return;
	const { ExpectedCliError } = await import("../failure-output-DuWfXOiW.mjs");
	return new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
async function bootstrapCliProxyCaptureAndDispatcher(startupTrace, ensureDispatcher) {
	if (isDebugProxyCaptureEnvEnabled()) {
		const [{ initializeDebugProxyCaptureAsync }, { maybeWarnAboutDebugProxyCoverage }] = await startupTrace.measure("proxy-imports", () => Promise.all([import("../runtime-DBg_d6LY.mjs"), import("../coverage-CA05t8fP.mjs")]));
		await initializeDebugProxyCaptureAsync("cli");
		maybeWarnAboutDebugProxyCoverage(void 0, (message) => console.warn(message));
	}
	if (ensureDispatcher) await startupTrace.measure("proxy-dispatcher", () => ensureCliEnvProxyDispatcher());
}
async function runCli(argv = process$1.argv, options = {}) {
	const runtimeRecoveryEnv = options.runtimeRecoveryEnv ?? { ...process$1.env };
	const originalArgv = normalizeWindowsArgv(argv);
	const originalInvocation = resolveCliArgvInvocation(originalArgv);
	if (await tryRunUpdateAdmissionBeforeStartup(originalInvocation)) return;
	const builtInMachineOutput = resolveBuiltInMachineOutput(originalInvocation);
	const invoke = () => withConsoleLogsRoutedToStderrForJson(originalArgv, () => {
		const run = async (harnessCleanup) => {
			let gatewayCleanup;
			try {
				const invokeCommand = () => runCliWithPreparedOutputMode(originalArgv, {
					...options,
					runtimeRecoveryEnv,
					builtInMachineOutput,
					harnessCleanup,
					onGatewayResourcesSettled: (outcome) => {
						gatewayCleanup = outcome;
					}
				});
				const resources = harnessCleanup?.pluginResources;
				return await (resources ? resources.run(invokeCommand) : invokeCommand());
			} catch (error) {
				if (isGatewayRunInvocationArgv(originalArgv) && !originalInvocation.hasHelpOrVersion) {
					const { handleGatewayStartupMaintenance } = await import("../startup-maintenance-DZ2dgGeZ.mjs");
					if (await handleGatewayStartupMaintenance(error)) return;
				}
				throw error;
			} finally {
				const resources = harnessCleanup?.pluginResources;
				try {
					if (gatewayCleanup === void 0) await closeCliResources(harnessCleanup);
				} finally {
					if (resources) await runCliDisposer("plugin-registration-resources", async () => {
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
		const gatewayRun = isGatewayRunInvocationArgv(originalArgv);
		return withCliPluginInvocation(gatewayRun, run);
	}, {
		machineOutput: builtInMachineOutput,
		restoreChanges: true,
		retainRoutingUntilProcessExit: options.retainConsoleRoutingUntilProcessExit
	});
	const invocation = resolveCliArgvInvocation(rewriteUpdateFlagArgv(originalArgv));
	return !invocation.hasHelpOrVersion && [
		"update",
		"doctor",
		"proxy"
	].includes(invocation.primary ?? "") ? await withDeferredDebugProxyCapture(invoke) : await invoke();
}
async function runCliWithPreparedOutputMode(originalArgv, options) {
	const startupTrace = createGatewayDispatchStartupTrace(originalArgv, "cli.main");
	const earlyProfile = parseCliProfileArgs(originalArgv);
	if (earlyProfile.ok && earlyProfile.profile) applyCliProfileEnv({ profile: earlyProfile.profile });
	const originalInvocation = resolveCliArgvInvocation(originalArgv);
	let consoleCaptureInstalled = false;
	const installConsoleCapture = async () => {
		if (consoleCaptureInstalled) return;
		const { enableConsoleCapture } = await import("../console-UDkTq6wd.mjs");
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
	const { assertSupportedRuntime, isCurrentRuntimeSupported } = await import("../runtime-guard-BZ53YTeZ.mjs");
	await assertSupportedRuntime(void 0, void 0, normalizedArgv, true, options.runtimeRecoveryEnv);
	if (await tryRunGatewayServiceUpdateCapabilityProbe(normalizedArgv)) return;
	if (!isHelpOrVersionInvocation && (isGatewayRunInvocation || normalizedInvocation.primary === "worker" || normalizedInvocation.primary === "node" && (normalizedInvocation.commandPath[1] === "run" || normalizedInvocation.commandPath[1] === "worker"))) {
		const { initializeSqliteRuntimeCapabilities } = await import("../infra/bun-sqlite-library.js");
		await initializeSqliteRuntimeCapabilities();
	}
	if (!isHelpOrVersionInvocation && !isDatabaseInvocation && !isAgentExecInvocation(normalizedInvocation.commandPath) && shouldLoadCliDotEnv(loadGlobalEnv)) await startupTrace.measure("dotenv", async () => {
		if (isRemoteAgentDispatchInvocation(normalizedArgv, normalizedInvocation.primary)) {
			const { loadGatewayDispatchCliDotEnv } = await import("../gateway-dispatch-dotenv-CRX68qav.mjs");
			await loadGatewayDispatchCliDotEnv({ quiet: true });
		} else {
			const { loadCliDotEnv } = await import("../dotenv-Dr6nhquT.mjs");
			loadCliDotEnv({
				loadGlobalEnv,
				quiet: true
			});
		}
	});
	let doctorDatabasePreflight;
	if (!isHelpOrVersionInvocation && normalizedInvocation.primary === "doctor") {
		const { prepareDoctorCliStartup } = await import("../run-main-doctor-startup-CTy1ncEk.mjs");
		const startup = await prepareDoctorCliStartup(normalizedArgv, { json: options.builtInMachineOutput });
		if (startup.handled) return;
		doctorDatabasePreflight = startup.preflight;
	}
	await configureStartupTraces();
	if (!isHelpOrVersionInvocation && isGatewayRunInvocation) await startupTrace.measure("gateway-run-select-environment", async () => {
		const [{ selectGatewayRunEnvironment }, { defaultRuntime }] = await Promise.all([import("../pre-bootstrap-B-l2TRKm.mjs"), import("../runtime-DqKM42HJ.mjs")]);
		await selectGatewayRunEnvironment({
			opts: resolveGatewayRunPreBootstrapOptions(normalizedArgv) ?? {},
			runtime: defaultRuntime
		});
	});
	normalizeEnv();
	if (shouldEnsureCliPath(normalizedArgv)) {
		const { ensureOpenClawCliOnPath } = await import("../path-env-DzvKJeXC.mjs");
		ensureOpenClawCliOnPath();
	}
	const mayContainBareSessionUrl = normalizedArgv.slice(2).some((arg) => arg.includes("://"));
	const bareSessionInvocation = !isHelpOrVersionInvocation && mayContainBareSessionUrl ? (await import("../session-ref-BFQpKBvG.mjs")).parseBareSessionInvocation(normalizedArgv) : null;
	let proxyHandle = null;
	let proxyStopPromise;
	let proxySignalHandlers = [];
	let unregisterProxySignalExitBarrier = null;
	let bestEffortConfigPromise = null;
	let pluginCliSession;
	const getPluginCliSession = async () => {
		pluginCliSession ??= (await import("../cli-registry-loader-oT9ljgF8.mjs")).createPluginCliLoadSession(getPluginCache());
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
		if (!bestEffortConfigPromise) bestEffortConfigPromise = import("../io-Cwio_qp9.mjs").then(async (configIo) => {
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
		for (const [signal, handler] of proxySignalHandlers) process$1.off(signal, handler);
		proxySignalHandlers = [];
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
				const { stopProxy } = await import("../proxy-lifecycle-6hW7_X56.mjs");
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
		if (!proxyHandle || proxySignalHandlers.length > 0) return;
		unregisterProxySignalExitBarrier = registerSignalExitBarrier(stopStartedProxy);
		const shutdown = (exitCode) => exitAfterSignalExitBarriers(exitCode);
		proxySignalHandlers = [
			["SIGTERM", () => shutdown(143)],
			["SIGINT", () => shutdown(130)],
			["exit", killStartedProxy]
		];
		for (const [signal, handler] of proxySignalHandlers) process$1.once(signal, handler);
	};
	const replaceStartedProxy = async (config) => {
		await stopStartedProxy();
		const { startProxy } = await import("../proxy-lifecycle-6hW7_X56.mjs");
		proxyHandle = await startProxy(config);
		proxyStopPromise = void 0;
		installProxySignalHandlers();
	};
	let uninstallGatewayRunRuntimeHooks = null;
	let unhandledRejectionHandlerInstalled = false;
	if (options.harnessCleanup) options.harnessCleanup.releaseManagedProxy = stopStartedProxy;
	try {
		if (!isDatabaseInvocation) await configureCliStartupDiagnostics([startupTrace, options.additionalStartupTrace], isGatewayRunInvocation ? readBestEffortCliConfig : void 0);
		if (!isHelpOrVersionInvocation && !bareSessionInvocation && normalizedInvocation.primary && !findBuiltInCommandDescriptor(normalizedInvocation.primary)) {
			const config = await withConsoleLogsRoutedToStderr(readBestEffortCliConfig);
			if (await withConsoleLogsRoutedToStderr(() => resolvePluginMachineOutput({
				argv: normalizedArgv,
				config,
				session: pluginCliSession
			}))) {
				const { routeLogsToStderr } = await import("../console-UDkTq6wd.mjs");
				routeLogsToStderr();
			}
		}
		if (!isHelpOrVersionInvocation && shouldStartProxyForCli(normalizedArgv)) {
			const config = await withConsoleLogsRoutedToStderr(readBestEffortCliConfig);
			if (!bareSessionInvocation) await assertCliPrimaryOwned({
				argv: normalizedArgv,
				config,
				session: pluginCliSession
			});
			await replaceStartedProxy(config?.proxy ?? void 0);
		}
		if (!isHelpOrVersionInvocation && isGatewayRunInvocation) {
			const { installGatewayRunRuntimeHooks } = await import("../runtime-hooks-Bt4RacGS.mjs");
			uninstallGatewayRunRuntimeHooks = installGatewayRunRuntimeHooks({
				onProcessResourcesSettled: options.onGatewayResourcesSettled,
				releaseManagedProxy: stopStartedProxy,
				refreshManagedProxy: replaceStartedProxy
			});
		}
		if (shouldUseRootHelpFastPath(normalizedArgv)) {
			const { loadRootHelpRenderOptionsForConfigSensitivePlugins } = await import("../root-help-live-config-DLFpCf-w.mjs");
			const liveRootHelpOptions = await loadRootHelpRenderOptionsForConfigSensitivePlugins(process$1.env);
			if (!liveRootHelpOptions) {
				const { outputPrecomputedRootHelpText } = await import("../root-help-metadata-D_5fa834.mjs");
				if (outputPrecomputedRootHelpText()) return;
			}
			const { outputRootHelp } = await import("../root-help-dZP3gIy2.mjs");
			await outputRootHelp(liveRootHelpOptions ?? void 0);
			return;
		}
		if (await tryOutputPrecomputedCommandHelp(normalizedArgv)) return;
		if (shouldUseSetupOnboardConfigureHelpFastPath(normalizedArgv)) {
			const { tryOutputSetupOnboardConfigureHelp } = await import("../setup-onboard-configure-help-fast-path-CQw4XYyc.mjs");
			if (await tryOutputSetupOnboardConfigureHelp(normalizedArgv)) return;
		}
		await installConsoleCapture();
		if (bareSessionInvocation) {
			if (!requireInteractiveTty(TUI_REQUIRES_TTY)) return;
			const { runTuiCliAction } = await import("../tui-cli-Duu1YtK_.mjs");
			await runTuiCliAction(bareSessionInvocation.target, bareSessionInvocation.options);
			return;
		}
		if (resolveUnownedCliPrimaryCandidate(normalizedArgv)) await assertCliPrimaryOwned({
			argv: normalizedArgv,
			config: await readBestEffortCliConfig(),
			session: pluginCliSession
		});
		const shouldRunBareRootCommand = shouldHandleBareRoot(normalizedArgv);
		if (shouldRunBareRootCommand) await ensureCliEnvProxyDispatcher();
		const bareRootLaunchTarget = shouldRunBareRootCommand ? await resolveBareRootLaunchTarget() : null;
		if (bareRootLaunchTarget) {
			if (!requireInteractiveTty(bareRootLaunchTarget.kind === "remote-gateway-inference" ? "Remote Gateway inference setup needs an interactive TTY. Re-run `openclaw` in a terminal connected to this Gateway." : bareRootLaunchTarget.kind === "onboarding" ? bareRootLaunchTarget.classic ? "OpenClaw config is invalid. Run `openclaw doctor --fix` before onboarding." : "Onboarding needs an interactive TTY. Use `openclaw onboard --non-interactive --accept-risk ...` for automation." : TUI_REQUIRES_TTY)) return;
			if (bareRootLaunchTarget.kind === "remote-gateway-inference") {
				const { runRemoteGatewayInferenceOnboarding } = await import("../onboard-remote-gateway-_C0K1naM.mjs");
				await runRemoteGatewayInferenceOnboarding(bareRootLaunchTarget.target);
				return;
			}
			if (bareRootLaunchTarget.kind === "onboarding") {
				const { setupWizardCommand } = await import("../onboard-CDhx-kla.mjs");
				await setupWizardCommand(bareRootLaunchTarget.classic ? { classic: true } : {});
				return;
			}
			const { runTui } = await import("../tui-DmDiZrKy.mjs");
			await runTui({
				deliver: false,
				...bareRootLaunchTarget.local ? { local: true } : {
					config: bareRootLaunchTarget.config,
					boundGateway: {
						url: bareRootLaunchTarget.gatewayUrl,
						...bareRootLaunchTarget.configuredRemote ? { configuredRemote: true } : {},
						...bareRootLaunchTarget.token ? { token: bareRootLaunchTarget.token } : {},
						...bareRootLaunchTarget.password ? { password: bareRootLaunchTarget.password } : {},
						...bareRootLaunchTarget.tlsFingerprint ? { tlsFingerprint: bareRootLaunchTarget.tlsFingerprint } : {}
					}
				}
			});
			return;
		}
		const shouldUseCliEnvProxy = !isHelpOrVersionInvocation && shouldStartProxyForCli(normalizedArgv);
		const bootstrapProxyBeforeFastPath = shouldUseCliEnvProxy && shouldBootstrapCliProxyBeforeFastPath();
		if (isGatewayRunFastPathArgv(normalizedArgv)) {
			const { installUnhandledRejectionHandler } = await startupTrace.measure("unhandled-rejection-handler-import", () => import("../unhandled-rejections-DvTkjUPI.mjs"));
			installUnhandledRejectionHandler();
			unhandledRejectionHandlerInstalled = true;
		}
		if (!bootstrapProxyBeforeFastPath && await tryRunGatewayRunFastPath(normalizedArgv, startupTrace)) return;
		if (!isHelpOrVersionInvocation && !isDatabaseInvocation) await bootstrapCliProxyCaptureAndDispatcher(startupTrace, shouldUseCliEnvProxy);
		if (bootstrapProxyBeforeFastPath && await tryRunGatewayRunFastPath(normalizedArgv, startupTrace)) return;
		if (!isHelpOrVersionInvocation) {
			const route = await startupTrace.measure("route-import", () => import("../route-Ii2M0_Kz.mjs"));
			if (await startupTrace.measure("route", () => options.builtInMachineOutput ? route.tryRouteCli(normalizedArgv, { machineOutput: true }) : route.tryRouteCli(normalizedArgv), { timeline: false })) return;
		}
		let parseArgv = normalizeGeneratedHelpCommandArgv(normalizedArgv);
		const suppressStartupProgress = options.builtInMachineOutput || hasJsonOutputFlag(parseArgv);
		const { createCliProgress } = await import("../progress-CGxL4jR6.mjs");
		const startupProgress = createCliProgress({
			label: "Loading OpenClaw CLI…",
			indeterminate: true,
			delayMs: 0,
			...suppressStartupProgress ? { enabled: false } : {}
		});
		try {
			const [{ buildProgram }, { formatUncaughtError }, { formatCliFailureLines, formatCliJsonFailure }, { runFatalErrorHooks }, { installUnhandledRejectionHandler, isBenignUncaughtExceptionError, isUncaughtExceptionHandled }, { defaultRuntime, restoreRuntimeTerminalState }] = await startupTrace.measure("core-imports", () => Promise.all([
				import("../build-program-FdQrglm2.mjs"),
				import("../infra/errors.js"),
				import("../failure-output-DuWfXOiW.mjs"),
				import("../fatal-error-hooks-DGD-L3B8.mjs"),
				import("../unhandled-rejections-DvTkjUPI.mjs"),
				import("../runtime-DqKM42HJ.mjs")
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
				exitAfterSignalExitBarriers(1, "uncaught exception");
			});
			const invocation = resolveCliArgvInvocation(parseArgv);
			const { primary } = invocation;
			if (primary) await startupTrace.measure("register-primary", async () => {
				const { getProgramContext } = await import("../program-context-BkTbBC43.mjs");
				const ctx = getProgramContext(program);
				if (ctx) {
					const { registerCoreCliByName } = await import("../command-registry-core-BtXPEt_0.mjs");
					await registerCoreCliByName(program, ctx, primary);
				}
				const { registerSubCliByName } = await import("../register.subclis-0u7B8IKn.mjs");
				await registerSubCliByName(program, primary, parseArgv);
			});
			const hasBuiltinPrimary = primary !== null && findSubcommand(program, primary) !== void 0;
			if (!shouldSkipPluginCommandRegistration({
				argv: parseArgv,
				primary,
				hasBuiltinPrimary
			})) {
				const config = await startupTrace.measure("register-plugin-commands", async () => {
					const { registerPluginCliCommandsFromValidatedConfig } = await import("../cli-_FnfqMvN.mjs");
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
				if (primary && !findSubcommand(program, primary)) {
					const error = await resolveExpectedPluginPolicyError({
						primary,
						config
					});
					if (error) throw error;
				}
			}
			parseArgv = normalizeRootLogLevelArgv(normalizeRootNoColorArgvForProgram(parseArgv, program), { shouldPreserveLogLevel: ({ remainingArgs, logLevelIndex }) => resolveRootOptionRole(program, remainingArgs, logLevelIndex) !== "root" });
			startupProgress.done();
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
			startupProgress.done();
		}
	} finally {
		pluginCliSession?.close();
		uninstallGatewayRunRuntimeHooks?.();
		if (!options.harnessCleanup) await runCliDisposer("managed-proxy", stopStartedProxy);
	}
}
//#endregion
export { runCli };
