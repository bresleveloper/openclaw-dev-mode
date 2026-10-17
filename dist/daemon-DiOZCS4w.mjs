import { _ as resolveNodeLaunchAgentLabel, b as resolveNodeWindowsTaskName, y as resolveNodeSystemdServiceName } from "./constants-BLghGsId.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as colorize } from "./theme-DzaUZY4q.mjs";
import { o as buildPlatformRuntimeLogHints, s as buildPlatformServiceStartHints, t as formatRuntimeStatus } from "./runtime-format-C0Herh-B.mjs";
import { i as resolveSystemdUserServiceAccount } from "./systemd-user-transport-vKPIfcG5.mjs";
import { c as projectDaemonServiceForJson, f as resolveRuntimeStatusColor, g as installDaemonServiceAndEmit, m as buildDaemonServiceSnapshot, n as createDaemonInstallActionContext, t as createCliStatusTextStyles, u as resolveDaemonInstallBlockMessage } from "./shared-DejcqFfy.mjs";
import { C as resolveNodeProgramArguments } from "./schtasks-B_YCch7R.mjs";
import { o as resolveManagedGatewayServiceCommand } from "./service-types-CPk6CBn6.mjs";
import { G as isSystemdUserServiceAvailable } from "./systemd-service-files-D_ieSNFm.mjs";
import { o as readDaemonRuntimePinForInstall } from "./runtime-pin-state-DhiHLAN-.mjs";
import { i as readSystemdUserLingerStatus } from "./systemd-Dcb-WwA6.mjs";
import { s as resolvePinnedDaemonRuntimePath, u as resolveRecordedDaemonRuntime } from "./runtime-paths-D7k3lrcM.mjs";
import { n as formatInvalidConfigPort, r as formatInvalidPortOption } from "./error-format-BaRMqGR7.mjs";
import { a as loadNodeHostConfig } from "./config-BO4n0NZx.mjs";
import { i as resolveGatewayDaemonRuntime, r as isGatewayDaemonRuntime } from "./daemon-runtime-DLyccFUz.mjs";
import { n as buildNodeServiceEnvironment } from "./service-env-6WPxGura.mjs";
import { n as resolveDaemonInstallRuntimeInputs, r as resolveDaemonRuntimeBinDir, t as emitNodeRuntimeWarning } from "./daemon-install-runtime-warning-D95FO_9s.mjs";
import { t as resolveNodeService } from "./node-service-DvnkYyPn.mjs";
import { i as runServiceUninstall, n as runServiceStart, r as runServiceStop, t as runServiceRestart } from "./lifecycle-core-ChiNkL_o.mjs";
import { t as resolveNodeGatewayOptions } from "./gateway-options-DyhpCjjI.mjs";
//#region src/commands/node-daemon-install-helpers.ts
/** Managed node-host install plan builder. */
/** Builds launch arguments, environment, and metadata for a managed node-host service install. */
async function buildNodeInstallPlan(params) {
	const wrapperPath = params.wrapperPath ?? params.env["OPENCLAW_WRAPPER"];
	const { devMode, runtime, runtimePath } = await resolveDaemonInstallRuntimeInputs({
		env: params.env,
		runtime: params.runtime,
		runtimeExplicit: params.runtimeExplicit,
		devMode: params.devMode,
		runtimePath: params.runtimePath,
		pinnedRuntimePath: params.pinnedRuntimePath,
		wrapperPath,
		warn: params.warn
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
		runtime,
		runtimePath,
		wrapperPath
	});
	await emitNodeRuntimeWarning({
		env: params.env,
		runtime,
		nodeProgram: programArguments[0],
		warn: params.warn,
		title: "Node daemon runtime"
	});
	return {
		programArguments,
		workingDirectory,
		environment: buildNodeServiceEnvironment({
			env: params.env,
			runtime,
			extraPathDirs: resolveDaemonRuntimeBinDir(runtimePath)
		}),
		environmentValueSources: {
			OPENCLAW_GATEWAY_TOKEN: "file",
			OPENCLAW_GATEWAY_PASSWORD: "file",
			CF_ACCESS_CLIENT_ID: "file",
			CF_ACCESS_CLIENT_SECRET: "file"
		},
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
/**
* User-level node services stop with the last SSH session unless lingering is enabled.
* Diagnose this without changing the operator's login policy.
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
	if (port === null || !Number.isFinite(port) || port <= 0 || port > 65535) {
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
	const recordedRuntime = opts.runtime === void 0 && !pinnedRuntimePath && !installEnv.OPENCLAW_WRAPPER?.trim() ? await resolveRecordedDaemonRuntime(existingManagedCommand?.programArguments[0], installEnv) : void 0;
	const retainedRuntime = recordedRuntime?.status === "supported" ? recordedRuntime : void 0;
	const { programArguments, workingDirectory, environment, environmentValueSources, description } = await buildNodeInstallPlan({
		env: installEnv,
		host,
		port,
		contextPath,
		tls: Boolean(tls),
		tlsFingerprint,
		nodeId: opts.nodeId,
		displayName: opts.displayName,
		installedAppsSharing: opts.shareInstalledApps,
		commands: opts.commands,
		allCommands: opts.allCommands,
		runtime: retainedRuntime?.runtime ?? runtimeRaw,
		runtimeExplicit: opts.runtime !== void 0 || opts.runtimePath !== void 0,
		runtimePath: retainedRuntime?.path,
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
		onVerified: () => warnIfSystemdUserLingerDisabled(warn)
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
	if (json) {
		defaultRuntime.writeJson({ service: projectDaemonServiceForJson({
			...buildDaemonServiceSnapshot(service, loaded),
			command,
			runtime
		}, { includeDefinitionPaths: true }) });
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
		...command?.environment
	};
	const hintEnv = {
		...baseEnv,
		OPENCLAW_LOG_PREFIX: baseEnv.OPENCLAW_LOG_PREFIX ?? "node"
	};
	if (runtime?.missingUnit || runtime?.status === "stopped") {
		defaultRuntime.error(errorText(runtime.missingUnit ? "Service unit not found." : "Service is loaded but not running."));
		for (const hint of buildPlatformRuntimeLogHints({
			env: hintEnv,
			systemdServiceName: resolveNodeSystemdServiceName(),
			windowsTaskName: resolveNodeWindowsTaskName()
		})) defaultRuntime.log(errorText(hint));
	}
}
//#endregion
export { runNodeDaemonStop as a, runNodeDaemonStatus as i, runNodeDaemonRestart as n, runNodeDaemonUninstall as o, runNodeDaemonStart as r, runNodeDaemonInstall as t };
