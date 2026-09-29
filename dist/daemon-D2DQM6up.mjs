import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { _ as resolveNodeSystemdServiceName, h as resolveNodeLaunchAgentLabel, v as resolveNodeWindowsTaskName } from "./constants-CJCmIHb-.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as colorize } from "./theme-DzaUZY4q.mjs";
import { w as isSystemdUserServiceAvailable } from "./systemd-service-files-tGuARbbA.mjs";
import { a as resolveManagedGatewayServiceCommand } from "./service-types-d44oynyj.mjs";
import { r as resolveNodeProgramArguments } from "./program-args-Pr-IOsMq.mjs";
import { n as buildNodeServiceEnvironment } from "./service-env-DqHelw1y.mjs";
import { o as resolvePinnedDaemonRuntimePath } from "./runtime-paths-DifTYoyV.mjs";
import { n as resolveDaemonInstallRuntimeInputs, r as resolveDaemonRuntimeBinDir, t as emitDaemonInstallRuntimeWarning } from "./daemon-install-plan.shared-Bot_5Vrf.mjs";
import { i as resolveGatewayDaemonRuntime, r as isGatewayDaemonRuntime } from "./daemon-runtime-D15REPfs.mjs";
import { i as resolveSystemdUserServiceAccount } from "./systemd-user-transport-ZcY1z7CT.mjs";
import { o as readDaemonRuntimePinForInstall } from "./runtime-pin-state-Bz2yXWLQ.mjs";
import { i as readSystemdUserLingerStatus } from "./systemd-j8mO8n69.mjs";
import { n as formatInvalidConfigPort, r as formatInvalidPortOption } from "./error-format-B21fL1a_.mjs";
import { i as formatRuntimeStatus, n as buildPlatformRuntimeLogHints, r as buildPlatformServiceStartHints } from "./runtime-hints-DEzqKgi3.mjs";
import { c as projectDaemonServiceForJson, f as resolveRuntimeStatusColor, m as buildDaemonServiceSnapshot, n as createDaemonInstallActionContext, t as createCliStatusTextStyles, u as resolveDaemonInstallBlockMessage, y as installDaemonServiceAndEmit } from "./shared-Ba-Zp0iU.mjs";
import { i as runServiceUninstall, n as runServiceStart, r as runServiceStop, t as runServiceRestart } from "./lifecycle-core-btQYXbqQ.mjs";
import { a as loadNodeHostConfig } from "./config-DLlmgxee.mjs";
import { t as resolveNodeService } from "./node-service-C4fy4gdx.mjs";
import { t as resolveNodeGatewayOptions } from "./gateway-options-CQ_n8bsS.mjs";
//#region src/commands/node-daemon-install-helpers.ts
/** Managed node-host install plan builder. */
function buildNodeInstallEnvironmentValueSources() {
	return {
		OPENCLAW_GATEWAY_TOKEN: "file",
		OPENCLAW_GATEWAY_PASSWORD: "file",
		CF_ACCESS_CLIENT_ID: "file",
		CF_ACCESS_CLIENT_SECRET: "file"
	};
}
/** Builds launch arguments, environment, and metadata for a managed node-host service install. */
async function buildNodeInstallPlan(params) {
	const wrapperPath = params.wrapperPath ?? params.env["OPENCLAW_WRAPPER"];
	const { devMode, runtimePath } = await resolveDaemonInstallRuntimeInputs({
		env: params.env,
		runtime: params.runtime,
		devMode: params.devMode,
		runtimePath: params.runtimePath,
		pinnedRuntimePath: params.pinnedRuntimePath,
		wrapperPath
	});
	const { programArguments, workingDirectory } = await resolveNodeProgramArguments({
		host: params.host,
		port: params.port,
		contextPath: params.contextPath,
		tls: params.tls,
		tlsFingerprint: params.tlsFingerprint,
		nodeId: params.nodeId,
		displayName: params.displayName,
		installedAppsSharing: params.installedAppsSharing,
		commands: params.commands,
		allCommands: params.allCommands,
		dev: devMode,
		runtime: params.runtime,
		runtimePath,
		wrapperPath
	});
	await emitDaemonInstallRuntimeWarning({
		env: params.env,
		runtime: params.runtime,
		programArguments,
		warn: params.warn,
		title: "Node daemon runtime"
	});
	return {
		programArguments,
		workingDirectory,
		environment: buildNodeServiceEnvironment({
			env: params.env,
			runtime: params.runtime,
			extraPathDirs: resolveDaemonRuntimeBinDir(runtimePath)
		}),
		environmentValueSources: buildNodeInstallEnvironmentValueSources(),
		description: "OpenClaw Node Host"
	};
}
//#endregion
//#region src/cli/node-cli/daemon.ts
function renderNodeServiceStartHints() {
	return buildPlatformServiceStartHints({
		installHint: formatCliCommand("openclaw node install"),
		startCommand: formatCliCommand("openclaw node start"),
		launchAgentPlistPath: `~/Library/LaunchAgents/${resolveNodeLaunchAgentLabel()}.plist`,
		systemdServiceName: resolveNodeSystemdServiceName(),
		windowsTaskName: resolveNodeWindowsTaskName()
	});
}
function buildNodeRuntimeHints(env = process.env) {
	return buildPlatformRuntimeLogHints({
		env,
		systemdServiceName: resolveNodeSystemdServiceName(),
		windowsTaskName: resolveNodeWindowsTaskName()
	});
}
/**
* Warns (does NOT auto-enable) when systemd user lingering is disabled.
* The installed user-level node service stops when the last SSH session ends
* unless `loginctl enable-linger <user>` has been run. Read-only: this never
* changes host state, matching the operator-consent policy used elsewhere.
*/
async function warnIfSystemdUserLingerDisabled(warn) {
	if (process.platform !== "linux") return;
	if (!await isSystemdUserServiceAvailable()) return;
	const user = resolveSystemdUserServiceAccount(process.env);
	if (!user) return;
	const status = await readSystemdUserLingerStatus({
		env: process.env,
		user
	});
	if (!status || status.linger === "yes") return;
	warn(`Systemd lingering is disabled for ${status.user}. The node service will stop when you log out. Run: sudo loginctl enable-linger ${status.user}`);
}
async function runNodeDaemonInstall(opts) {
	const { json, stdout, warnings, warn, emit, emitMessage, fail } = createDaemonInstallActionContext(opts.json);
	const installBlock = resolveDaemonInstallBlockMessage("node");
	if (installBlock) {
		fail(installBlock);
		return;
	}
	const config = await loadNodeHostConfig();
	let gatewayOptions;
	try {
		gatewayOptions = resolveNodeGatewayOptions(opts, config);
	} catch (error) {
		fail(error instanceof Error ? error.message : String(error));
		return;
	}
	const { host, port, contextPath, tls, tlsFingerprint, cloudflareAccess } = gatewayOptions;
	if (!Number.isFinite(port ?? NaN) || (port ?? 0) <= 0 || (port ?? 0) > 65535) {
		fail(opts.port !== void 0 ? formatInvalidPortOption("--port") : formatInvalidConfigPort("node.gateway.port"));
		return;
	}
	if (opts.tls === false && opts.tlsFingerprint !== void 0) {
		fail("--no-tls cannot be combined with --tls-fingerprint");
		return;
	}
	if (cloudflareAccess && tls !== true) {
		fail("Cloudflare Access credentials require --tls for the node Gateway connection");
		return;
	}
	const service = resolveNodeService();
	let existingServiceCommand;
	try {
		existingServiceCommand = await service.readCommand(process.env);
	} catch (error) {
		fail(`Node service inspection failed: ${formatErrorMessage(error)}`);
		return;
	}
	const existingManagedCommand = resolveManagedGatewayServiceCommand(existingServiceCommand);
	const installEnv = {
		...process.env,
		OPENCLAW_WRAPPER: process.env.OPENCLAW_WRAPPER ?? existingManagedCommand?.environment?.OPENCLAW_WRAPPER
	};
	let pinSnapshot;
	try {
		pinSnapshot = readDaemonRuntimePinForInstall({
			kind: "node",
			env: installEnv
		}, existingServiceCommand, opts.runtime !== void 0 || opts.runtimePath !== void 0);
	} catch (error) {
		fail(`Runtime pin inspection failed: ${formatErrorMessage(error)}`);
		return;
	}
	let pinnedRuntimePath = opts.runtimePath ?? (opts.runtime ? void 0 : pinSnapshot.pin?.path);
	const runtimeRaw = opts.runtime || resolveGatewayDaemonRuntime([pinnedRuntimePath ?? ""]);
	if (!isGatewayDaemonRuntime(runtimeRaw)) {
		fail("Invalid --runtime (use \"node\" or \"bun\")");
		return;
	}
	try {
		if (!installEnv.OPENCLAW_WRAPPER?.trim() || opts.runtimePath !== void 0) pinnedRuntimePath = await resolvePinnedDaemonRuntimePath(pinnedRuntimePath, runtimeRaw, installEnv);
	} catch (error) {
		fail(`Invalid runtime pin: ${formatErrorMessage(error)}`);
		return;
	}
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (err) {
		fail(`Node service check failed: ${formatErrorMessage(err)}`);
		return;
	}
	if (loaded && !opts.force) {
		await warnIfSystemdUserLingerDisabled(warn);
		emitMessage({
			ok: true,
			result: "already-installed",
			message: `Node service already ${service.loadedText}.`,
			service: buildDaemonServiceSnapshot(service, loaded),
			warnings: warnings.length ? warnings : void 0
		});
		if (!json) defaultRuntime.log(`Reinstall with: ${formatCliCommand("openclaw node install --force")}`);
		return;
	}
	const { programArguments, workingDirectory, environment, environmentValueSources, description } = await buildNodeInstallPlan({
		env: installEnv,
		host,
		port: port ?? 18789,
		contextPath,
		tls: Boolean(tls),
		tlsFingerprint,
		nodeId: opts.nodeId,
		displayName: opts.displayName,
		installedAppsSharing: opts.shareInstalledApps,
		commands: opts.commands,
		allCommands: opts.allCommands,
		runtime: runtimeRaw,
		pinnedRuntimePath,
		warn
	});
	await installDaemonServiceAndEmit({
		serviceNoun: "Node",
		service,
		warnings,
		emit,
		fail,
		install: async () => {
			await service.install({
				runtimePinUpdate: {
					expected: pinSnapshot,
					pin: pinnedRuntimePath ? {
						runtime: runtimeRaw,
						path: pinnedRuntimePath
					} : void 0
				},
				env: installEnv,
				stdout,
				warn,
				programArguments,
				workingDirectory,
				environment,
				environmentValueSources,
				description
			});
		},
		onVerified: async () => {
			await warnIfSystemdUserLingerDisabled(warn);
		}
	});
}
async function runNodeDaemonUninstall(opts = {}) {
	return await runServiceUninstall({
		serviceNoun: "Node",
		service: resolveNodeService(),
		opts,
		stopBeforeUninstall: false,
		assertNotLoadedAfterUninstall: false
	});
}
async function runNodeDaemonStart(opts = {}) {
	return await runServiceStart({
		serviceNoun: "Node",
		service: resolveNodeService(),
		renderStartHints: renderNodeServiceStartHints,
		opts
	});
}
async function runNodeDaemonRestart(opts = {}) {
	await runServiceRestart({
		serviceNoun: "Node",
		service: resolveNodeService(),
		renderStartHints: renderNodeServiceStartHints,
		opts
	});
}
async function runNodeDaemonStop(opts = {}) {
	return await runServiceStop({
		serviceNoun: "Node",
		service: resolveNodeService(),
		opts
	});
}
async function runNodeDaemonStatus(opts = {}) {
	const json = Boolean(opts.json);
	const service = resolveNodeService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (error) {
		const message = `Node service check failed: ${formatErrorMessage(error)}`;
		if (json) throw new Error(message, { cause: error });
		defaultRuntime.error(message);
		defaultRuntime.exit(1);
		return;
	}
	const [command, runtime] = await Promise.all([service.readCommand(process.env).catch(() => null), service.readRuntime(process.env).catch((err) => ({
		status: "unknown",
		detail: formatErrorMessage(err)
	}))]);
	const payload = { service: {
		...buildDaemonServiceSnapshot(service, loaded),
		command,
		runtime
	} };
	if (json) {
		defaultRuntime.writeJson({ service: projectDaemonServiceForJson(payload.service, { includeDefinitionPaths: true }) });
		return;
	}
	const { rich, label, accent, infoText, okText, warnText, errorText } = createCliStatusTextStyles();
	const serviceStatus = loaded ? okText(service.loadedText) : warnText(service.notLoadedText);
	defaultRuntime.log(`${label("Service:")} ${accent(service.label)} (${serviceStatus})`);
	if (command?.programArguments?.length) defaultRuntime.log(`${label("Command:")} ${infoText(command.programArguments.join(" "))}`);
	if (command?.sourcePath) defaultRuntime.log(`${label("Service file:")} ${infoText(command.sourcePath)}`);
	if (command?.workingDirectory) defaultRuntime.log(`${label("Working dir:")} ${infoText(command.workingDirectory)}`);
	const runtimeLine = formatRuntimeStatus(runtime);
	if (runtimeLine) {
		const runtimeColor = resolveRuntimeStatusColor(runtime?.status);
		defaultRuntime.log(`${label("Runtime:")} ${colorize(rich, runtimeColor, runtimeLine)}`);
	}
	if (!loaded) {
		defaultRuntime.log("");
		for (const hint of renderNodeServiceStartHints()) defaultRuntime.log(`${warnText("Start with:")} ${infoText(hint)}`);
		return;
	}
	const baseEnv = {
		...process.env,
		...command?.environment ?? void 0
	};
	const hintEnv = {
		...baseEnv,
		OPENCLAW_LOG_PREFIX: baseEnv.OPENCLAW_LOG_PREFIX ?? "node"
	};
	if (runtime?.missingUnit) {
		defaultRuntime.error(errorText("Service unit not found."));
		for (const hint of buildNodeRuntimeHints(hintEnv)) defaultRuntime.log(errorText(hint));
		return;
	}
	if (runtime?.status === "stopped") {
		defaultRuntime.error(errorText("Service is loaded but not running."));
		for (const hint of buildNodeRuntimeHints(hintEnv)) defaultRuntime.log(errorText(hint));
	}
}
//#endregion
export { runNodeDaemonStop as a, runNodeDaemonStatus as i, runNodeDaemonRestart as n, runNodeDaemonUninstall as o, runNodeDaemonStart as r, runNodeDaemonInstall as t };
