import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { _ as resolveNodeLaunchAgentLabel, b as resolveNodeWindowsTaskName, y as resolveNodeSystemdServiceName } from "./constants-BLghGsId.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { t as colorize } from "./theme-DzaUZY4q.mjs";
import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { o as resolveManagedGatewayServiceCommand } from "./service-types-CPk6CBn6.mjs";
import { i as resolveSystemdUserServiceAccount } from "./systemd-user-transport-ChnCBaMi.mjs";
import { G as isSystemdUserServiceAvailable } from "./systemd-service-files-C3V-PDoO.mjs";
import { T as resolveNodeProgramArguments } from "./schtasks-Cm91eO2_.mjs";
import { o as buildPlatformRuntimeLogHints, s as buildPlatformServiceStartHints, t as formatRuntimeStatus } from "./runtime-format-BBnSbkJD.mjs";
import { c as projectDaemonServiceForJson, f as resolveRuntimeStatusColor, g as installDaemonServiceAndEmit, m as buildDaemonServiceSnapshot, n as createDaemonInstallActionContext, t as createCliStatusTextStyles, u as resolveDaemonInstallBlockMessage } from "./shared-BiNxJvE7.mjs";
import { n as collectPackageDistContentInventoryErrors } from "./package-dist-inventory-_17OXIG1.mjs";
import { d as resolveGlobalInstallTarget, g as createGlobalInstallEnv, r as collectInstalledGlobalPackageErrors } from "./update-global-BlXQRfes.mjs";
import { a as resolveNpmGlobalPrefixLayoutFromPrefix } from "./update-npm-prefix-DY4dJ1W0.mjs";
import { a as runStep } from "./update-runner-command-DETznIV7.mjs";
import { n as loadDeviceIdentityIfPresent } from "./device-identity-8y_iX6az.mjs";
import { s as resolvePinnedDaemonRuntimePath, u as resolveRecordedDaemonRuntime } from "./runtime-paths-v6m7qRRF.mjs";
import { i as readSystemdUserLingerStatus } from "./systemd-BoxHLGdw.mjs";
import { o as readDaemonRuntimePinForInstall } from "./runtime-pin-state-_Q5AuEC0.mjs";
import { t as runGlobalPackageUpdateSteps } from "./package-update-steps-CyYbYiYK.mjs";
import { n as formatInvalidConfigPort, r as formatInvalidPortOption } from "./error-format-Cd0oOG4L.mjs";
import { a as loadNodeHostConfig } from "./config-JeTOF5Uw.mjs";
import { t as canReuseNodeHostDeviceToken } from "./gateway-auth-DdSopJKp.mjs";
import { i as resolveGatewayDaemonRuntime, r as isGatewayDaemonRuntime } from "./daemon-runtime-BIJk2T-m.mjs";
import { n as buildNodeServiceEnvironment } from "./service-env-DDchOnF1.mjs";
import { n as resolveDaemonInstallRuntimeInputs, r as resolveDaemonRuntimeBinDir, t as emitNodeRuntimeWarning } from "./daemon-install-runtime-warning-CSWT5swP.mjs";
import { t as resolveNodeService } from "./node-service-BRYuh5C5.mjs";
import { n as resolveRestoreServiceCli, t as assertExpectedRuntimePin } from "./install-restore-cli-jBDKIPEc.mjs";
import { i as runServiceUninstall, n as runServiceStart, r as runServiceStop, t as runServiceRestart } from "./lifecycle-core-DDOU2WR0.mjs";
import { n as inspectServiceRuntimeIntent } from "./status.runtime-intent-Xe8ZHP-n.mjs";
import { t as resolveNodeGatewayOptions } from "./gateway-options-DnTeb9Ph.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/daemon/npx-service-install.ts
/** npm exec owns its cache, so only a managed npm prefix may own a node service. */
async function resolveDurableNodeEntrypoint(env, entrypoint = process.argv[1]) {
	if (!entrypoint) return;
	const resolved = await fs.realpath(entrypoint).catch(() => path.resolve(entrypoint));
	if (!resolved.split(path.sep).includes("_npx")) return;
	const sourceRoot = await resolveOpenClawPackageRoot({ argv1: resolved });
	const version = sourceRoot ? await readPackageVersion(sourceRoot) : null;
	if (!version) throw new Error("Cannot determine the npm exec OpenClaw version for node service installation.");
	const layout = resolveNpmGlobalPrefixLayoutFromPrefix(path.join(resolveStateDir(env), "npm"));
	const packageRoot = path.join(layout.globalRoot, "openclaw");
	if (!((await collectInstalledGlobalPackageErrors({
		packageRoot,
		expectedVersion: version
	})).length === 0 && await collectPackageDistContentInventoryErrors(packageRoot).then((contentErrors) => contentErrors.length === 0, () => false))) {
		const installEnv = await createGlobalInstallEnv(env, { manager: "npm" });
		const target = await resolveGlobalInstallTarget({
			manager: "npm",
			runCommand: runCommandWithTimeout,
			timeoutMs: 3e4,
			env: installEnv
		});
		await fs.mkdir(layout.globalRoot, { recursive: true });
		const result = await runGlobalPackageUpdateSteps({
			installTarget: {
				...target,
				globalRoot: layout.globalRoot,
				packageRoot
			},
			installSpec: `openclaw@${version}`,
			requirePackageReplacement: true,
			packageName: "openclaw",
			packageRoot,
			runCommand: runCommandWithTimeout,
			runStep: (step) => runStep({
				...step,
				cwd: step.cwd ?? process.cwd(),
				runCommand: runCommandWithTimeout,
				stepIndex: 0,
				totalSteps: 0
			}),
			timeoutMs: 3e4,
			workTimeoutMs: null,
			env: installEnv
		});
		if (result.failedStep) throw new Error(`Cannot install durable OpenClaw ${version}: ${result.failedStep.stderrTail || result.failedStep.name}`);
	}
	return path.join(packageRoot, "openclaw.mjs");
}
//#endregion
//#region src/commands/node-daemon-install-helpers.ts
/** Managed node-host install plan builder. */
/** Builds launch arguments, environment, and metadata for a managed node-host service install. */
async function buildNodeInstallPlan(params) {
	const wrapperPath = params.wrapperPath ?? params.env["OPENCLAW_WRAPPER"];
	const { devMode, runtime, runtimePath } = await resolveDaemonInstallRuntimeInputs({
		...params,
		devMode: params.serviceCli ? false : params.devMode,
		wrapperPath
	});
	const cliEntrypoint = params.serviceCli?.entrypoint ?? (!devMode && !wrapperPath ? await resolveDurableNodeEntrypoint(params.env) : void 0);
	const { programArguments, workingDirectory } = await resolveNodeProgramArguments({
		cliEntrypoint,
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
	if (params.gatewayAuthFromEnv) programArguments.push("--auth-from-env");
	await emitNodeRuntimeWarning({
		env: params.env,
		runtime,
		nodeProgram: programArguments[0],
		warn: params.warn,
		title: "Node daemon runtime"
	});
	const environment = buildNodeServiceEnvironment({
		env: params.env,
		execPath: params.serviceCli?.executable,
		runtime,
		extraPathDirs: resolveDaemonRuntimeBinDir(runtimePath)
	});
	if (!params.gatewayAuthFromEnv) {
		const savedGateway = (await loadNodeHostConfig(params.env))?.gateway;
		const identity = savedGateway ? loadDeviceIdentityIfPresent({ env: params.env }) : null;
		if (identity && await canReuseNodeHostDeviceToken({
			savedGateway,
			gatewayCandidates: [{
				host: params.host,
				port: params.port,
				contextPath: params.contextPath,
				tls: params.tls
			}],
			deviceId: identity.deviceId,
			env: params.env
		})) {
			delete environment.OPENCLAW_GATEWAY_TOKEN;
			delete environment.OPENCLAW_GATEWAY_PASSWORD;
		}
	}
	return {
		programArguments,
		installationMessage: [
			`OpenClaw ${VERSION}`,
			`Runtime: ${runtime} (${programArguments[0]})`,
			`Service command: ${programArguments.map(quoteCliArg).join(" ")}`,
			`Update this node: ${formatCliCommand("openclaw node install --force", params.env).replace("openclaw", "npx -y openclaw@latest")}`
		].join("\n"),
		workingDirectory,
		environment,
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
	let restoreServiceCli;
	let restoredRuntimePath;
	try {
		if (opts.expectedRuntimePin !== void 0) assertExpectedRuntimePin(opts.expectedRuntimePin, pinSnapshot, "Node");
		if (opts.restoreServiceCli !== void 0) ({serviceCli: restoreServiceCli, runtimePath: restoredRuntimePath} = await resolveRestoreServiceCli(opts.restoreServiceCli, opts, installEnv));
	} catch (error) {
		fail(error instanceof Error ? error.message : String(error));
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
	const installPlan = await buildNodeInstallPlan({
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
		gatewayAuthFromEnv: opts.authFromEnv,
		runtime: retainedRuntime?.runtime ?? runtimeRaw,
		runtimeExplicit: opts.runtime !== void 0 || opts.runtimePath !== void 0,
		runtimePath: restoredRuntimePath ?? retainedRuntime?.path,
		pinnedRuntimePath,
		serviceCli: restoreServiceCli,
		warn
	});
	if (!json && installPlan.installationMessage) defaultRuntime.log(installPlan.installationMessage);
	await installDaemonServiceAndEmit({
		serviceNoun: "Node",
		service,
		warnings,
		emit: (payload) => emit({
			...payload,
			message: installPlan.installationMessage
		}),
		fail,
		install: async () => {
			await service.install({
				runtimePinUpdate: {
					expected: pinSnapshot,
					pin: pinnedRuntimePath ? {
						runtime: runtimeRaw,
						path: pinnedRuntimePath
					} : void 0,
					...opts.expectedRuntimePin !== void 0 ? {
						requireDefinitionMatch: true,
						...!restoreServiceCli && pinSnapshot.definition !== void 0 ? { requireRunning: true } : {}
					} : {}
				},
				env: installEnv,
				stdout,
				warn,
				...installPlan,
				...restoreServiceCli ? { workingDirectory: existingManagedCommand?.workingDirectory } : {}
			});
		},
		onVerified: () => warnIfSystemdUserLingerDisabled(warn)
	});
}
async function runNodeDaemonLifecycle(action, opts = {}) {
	const params = {
		serviceNoun: "Node",
		service: resolveNodeService(),
		renderFailureHints: () => [`Run ${formatCliCommand("openclaw node status")} to inspect the service, then retry.`],
		opts
	};
	if (action === "uninstall") return await runServiceUninstall({
		...params,
		stopBeforeUninstall: false,
		assertNotLoadedAfterUninstall: false
	});
	if (action === "stop") return await runServiceStop(params);
	await (action === "start" ? runServiceStart : runServiceRestart)({
		...params,
		renderStartHints: renderNodeServiceStartHints
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
	let inspectionKnown = true;
	const [command, runtime] = await Promise.all([service.readCommand(process.env).catch(() => {
		inspectionKnown = false;
		return null;
	}), service.readRuntime(process.env).catch((err) => ({
		status: "unknown",
		detail: formatErrorMessage(err)
	}))]);
	if (json) {
		const runtimeIntent = await inspectServiceRuntimeIntent({
			kind: "node",
			service,
			command,
			env: process.env,
			serviceEnv: {
				...process.env,
				...command?.environment
			},
			inspectionKnown
		});
		defaultRuntime.writeJson({ service: projectDaemonServiceForJson({
			...buildDaemonServiceSnapshot(service, loaded),
			command,
			runtime,
			...runtimeIntent
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
export { runNodeDaemonLifecycle as n, runNodeDaemonStatus as r, runNodeDaemonInstall as t };
