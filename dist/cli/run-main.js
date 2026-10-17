import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../string-coerce-1VuiLaaR.mjs";
import { a as getCommandPositionalsWithRootOptions, r as consumeRootOptionToken, s as isValueToken } from "../cli-root-options-DGcy1qRg.mjs";
import { A as isGatewayRunInvocationArgv, B as getCoreCliParentDefaultHelpCommands, L as getCoreCliCommandDescriptors, M as resolveGatewayRunPreBootstrapOptions, O as consumeGatewayFastPathRootOptionToken, R as getCoreCliCommandNamesCore, U as isMachineOutputStdoutTTY, f as isSimpleCommandHelpInvocation, g as normalizeRootNoColorArgv, h as normalizeRootLogLevelArgv, j as resolveGatewayCatalogCommandPath, k as consumeGatewayRunOptionToken, m as normalizeRootHelpTargetArgv, p as normalizeGeneratedHelpCommandArgv, v as getSubCliEntriesCore, y as getSubCliParentDefaultHelpCommands } from "../argv-D_Nxd_3s.mjs";
import { C as retirePluginCache, D as withPluginCache, a as createPluginCache, o as getPluginCache } from "../plugin-cache-BABafcXD.mjs";
import { t as resolveCliArgvInvocation } from "../argv-invocation-CV_-dmd8.mjs";
import { n as tryProcessCwd } from "../safe-cwd-DOxDm8mD.mjs";
import { n as parseCliProfileArgs, t as applyCliProfileEnv } from "../profile-DEgnfd3z.mjs";
import { n as tryRunUpdateAdmissionBeforeStartup } from "../run-main-update-admission-BobnKS48.mjs";
import { i as normalizeEnv, n as isTruthyEnvValue } from "../env-BBJTTIuE.mjs";
import { i as createGatewayDispatchStartupTrace, n as configureGatewayStartupTraceConsoleFormatting, t as configureCliStartupDiagnostics } from "../startup-trace-C4xndCPa.mjs";
import { r as truncateUtf16Safe } from "../utf16-slice-D_ngcYKd.mjs";
import { n as parseCliContainerArgs, t as maybeRunCliInContainer } from "../container-target-Bj4zLvq3.mjs";
import { t as tryOutputPrecomputedCommandHelp } from "../precomputed-help-bBDqtMtk.mjs";
import { t as normalizeWindowsArgv } from "../windows-argv-DUGbJuRb.mjs";
import { n as sanitizeTerminalText } from "../safe-text-SY_CvCi3.mjs";
import { i as formatInvalidConfigDetails, r as createInvalidConfigError } from "../io.invalid-config-BzeD3bi5.mjs";
import { r as resolveStateDir } from "../state-dir-BHJORNly.mjs";
import { b as resolveGatewayPort } from "../paths-DGIwWbpu.mjs";
import { i as registerSignalExitBarrier, l as waitForSignalExitBarriers } from "../signal-exit-barrier-BFniU76K.mjs";
import { r as runCliDisposer, t as closeCliResources } from "../runtime-cleanup-CiSdbQbb.mjs";
import { n as requestExitAfterOneShotOutput } from "../one-shot-exit-Bd4757D_.mjs";
import { n as pluginSourceCaptureMaintenance } from "../plugin-source-capture-context-B9nV7ZEy.mjs";
import { n as withDeferredDebugProxyCapture } from "../runtime-deferral-Bdhp4T3g.mjs";
import { a as withCliCommandCleanup } from "../runtime-cleanup-scope-Dno3Ssrr.mjs";
import { t as normalizeWebSocketProtocol } from "../websocket-protocol-MDxbNIbL.mjs";
import { s as isLoopbackHost, u as isSecureWebSocketUrl } from "../net-C6WEu3pd.mjs";
import { a as withConsoleLogsRoutedToStderrForJson, i as withConsoleLogsRoutedToStderr, n as hasJsonOutputFlag, r as isJsonOutputModeActive } from "../json-output-mode-DhC0xNZP.mjs";
import { r as shouldSkipPluginCommandRegistration, t as isReservedNonPluginCommandRoot } from "../command-registration-policy-BO2dweLS.mjs";
import { n as resolveCliNetworkProxyPolicy, t as resolveCliCommandPathPolicy } from "../command-path-policy-Cfb4tLrw.mjs";
import { t as resolveCliStartupPolicy } from "../command-startup-policy-BnA40z2t.mjs";
import { t as tryRunGatewayServiceUpdateCapabilityProbe } from "../update-capability-DfwTNPJU.mjs";
import { n as shouldStartLocalOnboarding } from "../fresh-install-config-Bi-9QLEM.mjs";
import { existsSync } from "node:fs";
import process$1 from "node:process";
import path from "node:path";
//#region src/cli/run-main-plugin-cache.ts
/** Executable commands own their inventory until Gateway publication adopts it. */
async function withCliPluginInvocation(gatewayRun, run) {
	return await withCliCommandCleanup(gatewayRun, async (cleanup) => {
		if (gatewayRun) return run();
		const cache = createPluginCache();
		cleanup?.pluginResources?.adopt({ async release() {
			if (cache.kind === "operation") {
				const result = await retirePluginCache(cache);
				if (result.failures.length > 0) throw new AggregateError(result.failures.map((failure) => failure.error), "CLI plugin inventory cleanup failed");
			}
		} });
		const invoke = () => withPluginCache(cache, () => run(cleanup));
		if (!cleanup?.pluginResources) return invoke();
		const resources = cleanup.pluginResources;
		return pluginSourceCaptureMaintenance.run({
			scheduler: cleanup.scheduler,
			run: (operation) => resources.run(operation)
		}, invoke);
	});
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
function rewriteUpdateFlagArgv(argv) {
	const updateIndex = argv.indexOf("--update");
	if (updateIndex === -1) return argv;
	for (let i = 2; i < argv.length; i++) {
		const arg = argv[i];
		if (!arg || arg === "--") return argv;
		if (i === updateIndex) return argv.toSpliced(updateIndex, 1, "update");
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
async function tryRunGatewayRunFastPath(argv, startupTrace) {
	if (!isGatewayRunFastPathArgv(argv)) return false;
	const [{ Command }, { addGatewayRunCommand }, { VERSION }, { emitCliBanner }, { ensureCliExecutionBootstrap }, { defaultRuntime }] = await startupTrace.measure("gateway-run-imports", () => Promise.all([
		import("commander"),
		import("../run-command-CW1iPdq3.mjs"),
		import("../version-Rz_KSRMi.mjs"),
		import("../banner-NaYRd5Rd.mjs"),
		import("../command-execution-startup-CYqAUcYI.mjs"),
		import("../runtime-C3rISTtF.mjs")
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
		let beforeStatePreparation;
		if (!await startupTrace.measure("gateway-run-pre-bootstrap", async () => {
			const { prepareGatewayRunBootstrap, recheckGatewayRunBootstrap } = await import("../pre-bootstrap-rNa78Qif.mjs");
			const prepared = await prepareGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime
			});
			if (prepared) beforeStatePreparation = (snapshot) => recheckGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime,
				...snapshot ? { snapshot } : {}
			});
			return prepared;
		})) return;
		await startupTrace.measure("gateway-run-bootstrap", async () => {
			await ensureCliExecutionBootstrap({
				runtime: defaultRuntime,
				commandPath,
				startupPolicy,
				loadPlugins: false,
				...beforeStatePreparation ? { beforeStatePreparation } : {}
			});
			const { reloadTrustedGatewayRunEnvironment } = await import("../pre-bootstrap-rNa78Qif.mjs");
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
	const { listAgentIds, resolveAgentEffectiveModelPrimary } = await import("../agent-scope-BbGZA7Yc.mjs");
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
	const { probeGatewayConfiguredModel } = await import("../onboard-helpers-DBHfpUEl.mjs");
	let missingModelGateway;
	let reachableUnverifiedGateway;
	let configuredGateway;
	for (const target of targets) {
		if (!isSafeGatewayProbeTarget(target)) continue;
		if (options.hasConfiguredGateway && !configuredGateway) configuredGateway = toReachableGateway(target, auth);
		const probeOptions = {
			url: target.url,
			...target.scope === "remote" ? {
				config,
				originScopedDeviceAuth: true,
				configuredRemote: true
			} : {}
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
		const { resolveGatewayClientBootstrap } = await import("../client-bootstrap-BDUFNle9.mjs");
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
		import("../control-ui-links-Bv-ALn05.mjs"),
		import("../client-bootstrap-BDUFNle9.mjs"),
		import("../gateway-lock-C0JnIOLH.mjs")
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
		const { hasEnvHttpProxyAgentConfigured } = await import("../proxy-env-CL06D9G0.mjs");
		if (!hasEnvHttpProxyAgentConfigured()) return;
		const { ensureGlobalUndiciEnvProxyDispatcher } = await import("../undici-global-dispatcher-Bc52ZoF-.mjs");
		ensureGlobalUndiciEnvProxyDispatcher();
	} catch {}
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
	const { loadPluginCliDescriptors } = await import("../cli-registry-loader-BOhzwv6C.mjs");
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
		const { resolvePluginCliRootOwnerIds } = await import("../cli-registry-loader-BOhzwv6C.mjs");
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
	const { resolveManifestCliCommandSurfaceOwner } = await import("../manifest-command-aliases.runtime-WCURGLz0.mjs");
	const manifestOwner = resolveManifestCliCommandSurfaceOwner({
		command: params.primary,
		config: params.config,
		env: process$1.env
	});
	if (manifestOwner) return manifestOwner;
	try {
		const { resolvePluginCliRootOwnerIds } = await import("../cli-registry-loader-BOhzwv6C.mjs");
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
	const { createCliUnknownCommandError } = await import("../error-output-DYq54TB8.mjs");
	throw createCliUnknownCommandError(displayPrimary, {
		argv: params.argv,
		...displayPrimary === primary ? {} : { commandNames: [] }
	});
}
async function resolveExpectedPluginPolicyError(params) {
	const { resolveManifestCommandAliasOwner, resolveManifestToolOwner } = await import("../manifest-command-aliases.runtime-WCURGLz0.mjs");
	const cliCommandSurfaceOwner = await resolveCliCommandSurfaceOwner(params);
	const message = resolveMissingPluginCommandMessage(params.primary, params.config, {
		resolveCommandAliasOwner: resolveManifestCommandAliasOwner,
		resolveToolOwner: resolveManifestToolOwner,
		resolveCliCommandSurfaceOwner: () => cliCommandSurfaceOwner
	});
	if (!message) return;
	const { ExpectedCliError } = await import("../failure-output-CKN7Q5cE.mjs");
	return new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
async function bootstrapCliProxyCaptureAndDispatcher(startupTrace, options = {}) {
	if (isDebugProxyCaptureEnvEnabled()) {
		const [{ initializeDebugProxyCaptureAsync }, { maybeWarnAboutDebugProxyCoverage }] = await startupTrace.measure("proxy-imports", () => Promise.all([import("../runtime-2lyKvCKF.mjs"), import("../coverage-DBZAifxg.mjs")]));
		await initializeDebugProxyCaptureAsync("cli");
		maybeWarnAboutDebugProxyCoverage(void 0, (message) => console.warn(message));
	}
	if (options.ensureDispatcher !== false) await startupTrace.measure("proxy-dispatcher", () => ensureCliEnvProxyDispatcher());
}
async function runCli(argv = process$1.argv, options = {}) {
	const runtimeRecoveryEnv = options.runtimeRecoveryEnv ?? { ...process$1.env };
	const originalArgv = normalizeWindowsArgv(argv);
	if (await tryRunUpdateAdmissionBeforeStartup(resolveCliArgvInvocation(originalArgv))) return;
	const builtInMachineOutput = resolveBuiltInMachineOutput(originalArgv);
	const invoke = () => withConsoleLogsRoutedToStderrForJson(originalArgv, () => {
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
					const { handleGatewayStartupMaintenance } = await import("../startup-maintenance-C82g8-6H.mjs");
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
	const invocation = resolveCliArgvInvocation(rewriteUpdateFlagArgv(originalArgv));
	return !invocation.hasHelpOrVersion && (invocation.primary === "update" || invocation.primary === "doctor") ? await withDeferredDebugProxyCapture(invoke) : await invoke();
}
async function runCliWithPreparedOutputMode(originalArgv, options) {
	const startupTrace = createGatewayDispatchStartupTrace(originalArgv, "cli.main");
	const earlyProfile = parseCliProfileArgs(originalArgv);
	if (earlyProfile.ok && earlyProfile.profile) applyCliProfileEnv({ profile: earlyProfile.profile });
	const originalInvocation = resolveCliArgvInvocation(originalArgv);
	let consoleCaptureInstalled = false;
	const installConsoleCapture = async () => {
		if (consoleCaptureInstalled) return;
		const { enableConsoleCapture } = await import("../console-CJ4r5qzf.mjs");
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
	const { assertSupportedRuntime, isCurrentRuntimeSupported } = await import("../runtime-guard-Du_GbNsi.mjs");
	await assertSupportedRuntime(void 0, void 0, normalizedArgv, true, options.runtimeRecoveryEnv);
	if (await tryRunGatewayServiceUpdateCapabilityProbe(normalizedArgv)) return;
	if (!isHelpOrVersionInvocation && (isGatewayRunInvocation || normalizedInvocation.primary === "worker" || normalizedInvocation.primary === "node" && (normalizedInvocation.commandPath[1] === "run" || normalizedInvocation.commandPath[1] === "worker"))) {
		const { initializeSqliteRuntimeCapabilities } = await import("../infra/bun-sqlite-library.js");
		await initializeSqliteRuntimeCapabilities();
	}
	if (!isHelpOrVersionInvocation && !isDatabaseInvocation && !isAgentExecInvocation(normalizedInvocation.commandPath) && shouldLoadCliDotEnv(loadGlobalEnv)) await startupTrace.measure("dotenv", async () => {
		if (isRemoteAgentDispatchInvocation(normalizedArgv, normalizedInvocation.primary)) {
			const { loadGatewayDispatchCliDotEnv } = await import("../gateway-dispatch-dotenv-DnWGoTJq.mjs");
			await loadGatewayDispatchCliDotEnv({ quiet: true });
		} else {
			const { loadCliDotEnv } = await import("../dotenv-DprAYqRb.mjs");
			loadCliDotEnv({
				loadGlobalEnv,
				quiet: true
			});
		}
	});
	let doctorDatabasePreflight;
	if (!isHelpOrVersionInvocation && normalizedInvocation.primary === "doctor") {
		const { preflightUpdateDoctorCli } = await import("../commands/doctor-update-schema-guard.js");
		doctorDatabasePreflight = await preflightUpdateDoctorCli({ json: options.builtInMachineOutput });
	}
	await configureStartupTraces();
	if (!isHelpOrVersionInvocation && isGatewayRunInvocation) await startupTrace.measure("gateway-run-select-environment", async () => {
		const [{ selectGatewayRunEnvironment }, { defaultRuntime }] = await Promise.all([import("../pre-bootstrap-rNa78Qif.mjs"), import("../runtime-C3rISTtF.mjs")]);
		await selectGatewayRunEnvironment({
			opts: resolveGatewayRunPreBootstrapOptions(normalizedArgv) ?? {},
			runtime: defaultRuntime
		});
	});
	normalizeEnv();
	if (shouldEnsureCliPath(normalizedArgv)) {
		const { ensureOpenClawCliOnPath } = await import("../path-env-qfYY__eE.mjs");
		ensureOpenClawCliOnPath();
	}
	const mayContainBareSessionUrl = normalizedArgv.slice(2).some((arg) => arg.includes("://"));
	const bareSessionInvocation = !isHelpOrVersionInvocation && mayContainBareSessionUrl ? (await import("../session-ref-BPxUbLfi.mjs")).parseBareSessionInvocation(normalizedArgv) : null;
	let proxyHandle = null;
	let proxyStopPromise;
	let onSigterm = null;
	let onSigint = null;
	let onExit = null;
	let unregisterProxySignalExitBarrier = null;
	let bestEffortConfigPromise = null;
	let pluginCliSession;
	const getPluginCliSession = async () => {
		pluginCliSession ??= (await import("../cli-registry-loader-BOhzwv6C.mjs")).createPluginCliLoadSession(getPluginCache());
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
		if (!bestEffortConfigPromise) bestEffortConfigPromise = import("../io-BM-qEheD.mjs").then(async (configIo) => {
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
				const { stopProxy } = await import("../proxy-lifecycle-iIyXJK5-.mjs");
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
		const { startProxy } = await import("../proxy-lifecycle-iIyXJK5-.mjs");
		proxyHandle = await startProxy(config);
		proxyStopPromise = void 0;
		installProxySignalHandlers();
	};
	let uninstallGatewayRunRuntimeHooks = null;
	let unhandledRejectionHandlerInstalled = false;
	try {
		if (!isDatabaseInvocation) await configureCliStartupDiagnostics([startupTrace, options.additionalStartupTrace], isGatewayRunInvocation ? readBestEffortCliConfig : void 0);
		if (!isHelpOrVersionInvocation && !bareSessionInvocation && normalizedInvocation.primary && !isKnownBuiltInCommandRoot(normalizedInvocation.primary)) {
			const config = await withConsoleLogsRoutedToStderr(readBestEffortCliConfig);
			if (await withConsoleLogsRoutedToStderr(() => resolvePluginMachineOutput({
				argv: normalizedArgv,
				config,
				session: pluginCliSession
			}))) {
				const { routeLogsToStderr } = await import("../console-CJ4r5qzf.mjs");
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
				releaseManagedProxy: stopStartedProxy,
				refreshManagedProxy: replaceStartedProxy
			});
		}
		if (shouldUseRootHelpFastPath(normalizedArgv)) {
			const { loadRootHelpRenderOptionsForConfigSensitivePlugins } = await import("../root-help-live-config-DLFpCf-w.mjs");
			const liveRootHelpOptions = await loadRootHelpRenderOptionsForConfigSensitivePlugins(process$1.env);
			if (!liveRootHelpOptions) {
				const { outputPrecomputedRootHelpText } = await import("../root-help-metadata-DJawK_mA.mjs");
				if (outputPrecomputedRootHelpText()) return;
			}
			const { outputRootHelp } = await import("../root-help-C2WFuewn.mjs");
			await outputRootHelp(liveRootHelpOptions ?? void 0);
			return;
		}
		if (await tryOutputPrecomputedCommandHelp(normalizedArgv)) return;
		if (shouldUseSetupOnboardConfigureHelpFastPath(normalizedArgv)) {
			const { tryOutputSetupOnboardConfigureHelp } = await import("../setup-onboard-configure-help-fast-path-B-gEZvBw.mjs");
			if (await tryOutputSetupOnboardConfigureHelp(normalizedArgv)) return;
		}
		await installConsoleCapture();
		if (bareSessionInvocation) {
			if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
				console.error("OpenClaw TUI needs an interactive TTY. Use `openclaw agent --local ...` for automation.");
				process$1.exitCode = 1;
				return;
			}
			const { runTuiCliAction } = await import("../tui-cli-CzHxDjBn.mjs");
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
		const bareRootLaunchTarget = shouldRunBareRootCommand ? await resolveBareRootLaunchTarget(normalizedArgv) : null;
		if (bareRootLaunchTarget) {
			if (bareRootLaunchTarget.kind === "remote-gateway-inference") {
				if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
					console.error("Remote Gateway inference setup needs an interactive TTY. Re-run `openclaw` in a terminal connected to this Gateway.");
					process$1.exitCode = 1;
					return;
				}
				const { runRemoteGatewayInferenceOnboarding } = await import("../onboard-remote-gateway-CoTkCNhI.mjs");
				await runRemoteGatewayInferenceOnboarding(bareRootLaunchTarget.target);
				return;
			}
			if (bareRootLaunchTarget.kind === "onboarding") {
				if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
					console.error(bareRootLaunchTarget.classic ? "OpenClaw config is invalid. Run `openclaw doctor --fix` before onboarding." : "Onboarding needs an interactive TTY. Use `openclaw onboard --non-interactive --accept-risk ...` for automation.");
					process$1.exitCode = 1;
					return;
				}
				const { setupWizardCommand } = await import("../onboard-BswwR9YZ.mjs");
				await setupWizardCommand(bareRootLaunchTarget.classic ? { classic: true } : {});
				return;
			}
			if (bareRootLaunchTarget.kind === "tui") {
				if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
					console.error("OpenClaw TUI needs an interactive TTY. Use `openclaw agent --local ...` for automation.");
					process$1.exitCode = 1;
					return;
				}
				const { runTui } = await import("../tui-DtltMYnf.mjs");
				await runTui({
					...bareRootLaunchTarget.local ? {
						deliver: false,
						local: true
					} : {
						deliver: false,
						config: bareRootLaunchTarget.config,
						boundGateway: {
							url: bareRootLaunchTarget.gatewayUrl,
							...bareRootLaunchTarget.configuredRemote ? { configuredRemote: true } : {},
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
			const { installUnhandledRejectionHandler } = await startupTrace.measure("unhandled-rejection-handler-import", () => import("../unhandled-rejections-B3DEjwQf.mjs"));
			installUnhandledRejectionHandler();
			unhandledRejectionHandlerInstalled = true;
		}
		if (!bootstrapProxyBeforeFastPath && await tryRunGatewayRunFastPath(normalizedArgv, startupTrace)) return;
		if (!isHelpOrVersionInvocation && !isDatabaseInvocation) await bootstrapCliProxyCaptureAndDispatcher(startupTrace, { ensureDispatcher: shouldUseCliEnvProxy });
		if (bootstrapProxyBeforeFastPath && await tryRunGatewayRunFastPath(normalizedArgv, startupTrace)) return;
		if (!isHelpOrVersionInvocation) {
			const route = await startupTrace.measure("route-import", () => import("../route-BraLqAT9.mjs"));
			if (await startupTrace.measure("route", () => options.builtInMachineOutput ? route.tryRouteCli(normalizedArgv, { machineOutput: true }) : route.tryRouteCli(normalizedArgv), { timeline: false })) return;
		}
		let parseArgv = normalizeGeneratedHelpCommandArgv(normalizedArgv);
		const suppressStartupProgress = options.builtInMachineOutput || hasJsonOutputFlag(parseArgv);
		const { createCliProgress } = await import("../progress-NhZUfSPr.mjs");
		const startupProgress = createCliProgress({
			label: "Loading OpenClaw CLI…",
			indeterminate: true,
			delayMs: 0,
			...suppressStartupProgress ? { enabled: false } : {}
		});
		try {
			const [{ buildProgram }, { formatUncaughtError }, { formatCliFailureLines, formatCliJsonFailure }, { runFatalErrorHooks }, { installUnhandledRejectionHandler, isBenignUncaughtExceptionError, isUncaughtExceptionHandled }, { defaultRuntime, restoreRuntimeTerminalState }] = await startupTrace.measure("core-imports", () => Promise.all([
				import("../build-program-34l02Qhn.mjs"),
				import("../infra/errors.js"),
				import("../failure-output-CKN7Q5cE.mjs"),
				import("../fatal-error-hooks-Q7ktJSt7.mjs"),
				import("../unhandled-rejections-B3DEjwQf.mjs"),
				import("../runtime-C3rISTtF.mjs")
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
					const { registerCoreCliByName } = await import("../command-registry-core-CXb1NsHL.mjs");
					await registerCoreCliByName(program, ctx, primary);
				}
				const { registerSubCliByName } = await import("../register.subclis-DVaMJmfw.mjs");
				await registerSubCliByName(program, primary, parseArgv);
			});
			const hasBuiltinPrimary = primary !== null && findSubcommand(program, primary) !== void 0;
			if (!shouldSkipPluginCommandRegistration({
				argv: parseArgv,
				primary,
				hasBuiltinPrimary
			})) {
				const config = await startupTrace.measure("register-plugin-commands", async () => {
					const { registerPluginCliCommandsFromValidatedConfig } = await import("../cli-B7tSx_Vn.mjs");
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
			parseArgv = normalizeRootLogLevelArgvForProgram(normalizeRootNoColorArgvForProgram(parseArgv, program), program);
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
		const resources = options.harnessCleanup?.pluginResources;
		await runCliDisposer("managed-proxy", stopStartedProxy, resources?.runCleanup);
		await closeCliResources(options.harnessCleanup);
		if (!resources) pauseNonTtyStdinForCliExit();
	}
}
//#endregion
export { runCli, shouldStartOnboardingForFreshInstall };
