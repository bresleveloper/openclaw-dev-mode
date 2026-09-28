import { n as isNodeRuntime } from "./runtime-binary-Cy5Lhult.mjs";
import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { t as resolveNodeStartupTlsEnvironment } from "./node-startup-env-CE_a1k52.mjs";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { a as normalizeEnvVarKey, n as isDangerousHostEnvOverrideVarName, r as isDangerousHostEnvVarName } from "./host-env-security-D7wdDMke.mjs";
import { v as resolveFutureConfigActionBlock } from "./config-env-vars-BHI12YH5.mjs";
import { n as SUPPORTED_NODE_VERSIONS } from "./node-version-DdJ6cN09.mjs";
import { l as sanitizeServiceInspectionError } from "./service-inspection-error-axo4k_qi.mjs";
import { u as readConfigFileSnapshotForWrite } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { r as replaceConfigFile } from "./mutate-CdmDoEFy.mjs";
import { _ as isNonFatalSystemdInstallProbeError } from "./systemd-service-files-tGuARbbA.mjs";
import { i as assertGatewayServiceUpdateCurrent, o as isUpdateOwnedGatewayServiceCommand } from "./service-update-authority-DujRnzx9.mjs";
import { a as resolveManagedGatewayServiceCommand, t as assertServiceDefinitionWritable } from "./service-types-d44oynyj.mjs";
import { i as resolveOpenClawWrapperPath, t as OPENCLAW_WRAPPER_ENV_KEY } from "./program-args-Pr-IOsMq.mjs";
import { t as buildGatewayInstallPlan } from "./daemon-install-helpers-C4SsU1qw.mjs";
import { a as resolveNodeRuntimeInfo, c as resolvePreferredNodePath, o as resolvePinnedDaemonRuntimePath } from "./runtime-paths-DifTYoyV.mjs";
import { i as resolveGatewayDaemonRuntime, r as isGatewayDaemonRuntime } from "./daemon-runtime-D15REPfs.mjs";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-DdUza9cW.mjs";
import { g as resolveGatewayBindHost, s as isLoopbackHost, t as defaultGatewayBindMode } from "./net-DU4aWKLv.mjs";
import { n as resolveGatewayAuth } from "./auth-resolve-BeCTtDNQ.mjs";
import "./auth-CRxiLJL8.mjs";
import { o as readDaemonRuntimePinForInstall } from "./runtime-pin-state-Bz2yXWLQ.mjs";
import { a as readEmbeddedGatewayToken } from "./service-audit-Bj8Y2WTD.mjs";
import { n as mergeGatewayServiceEnv } from "./gateway-service-probe-hosts-D3Br9aVM.mjs";
import { a as resolveGatewayService } from "./service-YFvztZiz.mjs";
import { t as reconcileGatewayServiceDefinition } from "./service-reconciliation-C6L3QHv8.mjs";
import { n as formatInvalidConfigPort, r as formatInvalidPortOption } from "./error-format-B21fL1a_.mjs";
import { t as parsePort } from "./parse-port-BGoDUr--.mjs";
import { m as buildDaemonServiceSnapshot, n as createDaemonInstallActionContext, u as resolveDaemonInstallBlockMessage, y as installDaemonServiceAndEmit } from "./shared-Ba-Zp0iU.mjs";
import { constants } from "node:fs";
import fs$1 from "node:fs/promises";
//#region src/cli/daemon-cli/install.ts
function resolveGatewayInstallBindMode(cfg) {
	return cfg.gateway?.bind ?? defaultGatewayBindMode(cfg.gateway?.tailscale?.mode ?? "off");
}
function formatNoAuthNonLoopbackInstallBlock(params) {
	const auth = resolveGatewayAuth({
		authConfig: params.config.gateway?.auth,
		env: params.env,
		tailscaleMode: params.config.gateway?.tailscale?.mode ?? "off"
	});
	const bindCanExposeNetwork = params.bind === "tailnet" || !isLoopbackHost(params.bindHost);
	if (auth.mode !== "none" || !bindCanExposeNetwork) return;
	const hints = [`${params.bind === "tailnet" && isLoopbackHost(params.bindHost) ? `gateway.bind=tailnet currently resolves to ${params.bindHost} but can later resolve to a Tailnet interface` : `gateway.bind=${params.bind} resolves to ${params.bindHost}`}, but gateway.auth.mode=none disables Gateway auth.`];
	if (normalizeOptionalString(auth.token)) hints.push(`This config already has gateway.auth.token; run ${formatCliCommand("openclaw config set gateway.auth.mode token")} and then rerun ${formatCliCommand("openclaw gateway install --force")}.`);
	else if (normalizeOptionalString(auth.password)) hints.push(`This config already has gateway.auth.password; run ${formatCliCommand("openclaw config set gateway.auth.mode password")} and then rerun ${formatCliCommand("openclaw gateway install --force")}.`);
	else hints.push(`Configure token/password auth, use trusted-proxy auth, or set ${formatCliCommand("openclaw config set gateway.bind loopback")} before installing the managed service.`);
	return hints.join(" ");
}
/** Merge safe existing service environment into the current install invocation environment. */
function mergeInstallInvocationEnv(params) {
	const platform = params.platform ?? process.platform;
	const normalizeInstallEnvKey = (key) => platform === "win32" ? key.toUpperCase() : key;
	const currentEnv = {};
	for (const [rawKey, rawValue] of Object.entries(params.env)) {
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (!key || isDangerousHostEnvVarName(key)) continue;
		currentEnv[normalizeInstallEnvKey(key)] = rawValue;
	}
	if (!params.existingServiceEnv || Object.keys(params.existingServiceEnv).length === 0) return currentEnv;
	const preservedServiceEnv = {};
	for (const [rawKey, rawValue] of Object.entries(params.existingServiceEnv)) {
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (!key) continue;
		const upper = key.toUpperCase();
		if (upper === "OPENCLAW_WRAPPER") {
			const value = rawValue.trim();
			if (value) preservedServiceEnv[normalizeInstallEnvKey(upper)] = value;
			continue;
		}
		if (upper === "HOME" || upper === "PATH" || upper === "TMPDIR" || upper === "HOMEBREW_PREFIX" || upper.startsWith("OPENCLAW_")) continue;
		if (isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key) && upper !== "NODE_EXTRA_CA_CERTS") continue;
		const value = rawValue.trim();
		if (!value) continue;
		preservedServiceEnv[normalizeInstallEnvKey(key)] = value;
	}
	return {
		...preservedServiceEnv,
		...currentEnv
	};
}
/** Install or refresh the managed Gateway service. */
async function runDaemonInstall(opts) {
	let definitionBackup;
	const { json, stdout, warnings, warn, emit, emitMessage, fail } = createDaemonInstallActionContext(opts.json, () => definitionBackup);
	const installBlock = resolveDaemonInstallBlockMessage("gateway");
	if (installBlock) {
		fail(installBlock);
		return;
	}
	const service = resolveGatewayService();
	let existingServiceCommand;
	try {
		existingServiceCommand = await service.readCommand(process.env, { requireEffective: true });
	} catch (error) {
		fail(sanitizeServiceInspectionError(error).message);
		return;
	}
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (error) {
		if (!isNonFatalSystemdInstallProbeError(error)) {
			fail(`Gateway service check failed: ${String(error)}`);
			return;
		}
		loaded = false;
	}
	const existingManagedCommand = resolveManagedGatewayServiceCommand(existingServiceCommand);
	const existingServiceEnv = existingManagedCommand?.environment;
	const installEnv = mergeInstallInvocationEnv({
		env: process.env,
		existingServiceEnv
	});
	let pinSnapshot;
	try {
		pinSnapshot = readDaemonRuntimePinForInstall({
			kind: "gateway",
			env: installEnv
		}, existingServiceCommand, opts.runtime !== void 0 || opts.runtimePath !== void 0);
	} catch (error) {
		fail(`Runtime pin inspection failed: ${String(error)}`);
		return;
	}
	let pinnedRuntimePath = opts.runtimePath ?? (opts.runtime ? void 0 : pinSnapshot.pin?.path);
	const effectiveServiceEnv = mergeGatewayServiceEnv(process.env, existingServiceCommand);
	const assertWritable = async () => {
		try {
			for (const environment of [effectiveServiceEnv, installEnv]) {
				const capability = await service.readDefinitionMutationCapability?.({
					env: process.env,
					environment
				}).catch(() => ({
					kind: "unknown",
					reason: "inspection-failed"
				}));
				if (capability) assertServiceDefinitionWritable(capability);
			}
			return true;
		} catch (error) {
			fail(`Gateway install blocked: ${String(error)}`);
			return false;
		}
	};
	if ((opts.force || !loaded) && !await assertWritable()) return;
	let { snapshot: configSnapshot, writeOptions: configWriteOptions } = await readConfigFileSnapshotForWrite();
	const futureBlock = resolveFutureConfigActionBlock({
		action: "install or rewrite the gateway service",
		snapshot: configSnapshot
	});
	if (futureBlock) {
		fail(`Gateway install blocked: ${futureBlock.message}`, futureBlock.hints);
		return;
	}
	let cfg = configSnapshot.valid ? configSnapshot.sourceConfig : configSnapshot.config;
	const portOverride = parsePort(opts.port);
	if (opts.port !== void 0 && portOverride === null) {
		fail(formatInvalidPortOption("--port"));
		return;
	}
	const port = portOverride ?? resolveGatewayPort(cfg);
	if (!Number.isFinite(port) || port <= 0 || port > 65535) {
		fail(formatInvalidConfigPort("gateway.port"));
		return;
	}
	const runtimeRaw = opts.runtime || resolveGatewayDaemonRuntime([pinnedRuntimePath ?? ""]);
	if (!isGatewayDaemonRuntime(runtimeRaw)) {
		fail("Invalid --runtime (use \"node\" or \"bun\")");
		return;
	}
	let wrapperPath;
	if (opts.wrapper !== void 0) try {
		wrapperPath = await resolveOpenClawWrapperPath(opts.wrapper);
		if (!wrapperPath) {
			fail("Invalid --wrapper");
			return;
		}
	} catch (err) {
		fail(`Invalid --wrapper: ${String(err)}`);
		return;
	}
	if (!wrapperPath) try {
		wrapperPath = await resolveOpenClawWrapperPath(installEnv[OPENCLAW_WRAPPER_ENV_KEY]);
	} catch (err) {
		fail(`Invalid ${OPENCLAW_WRAPPER_ENV_KEY}: ${String(err)}`);
		return;
	}
	let runtimePath;
	try {
		if (!wrapperPath || opts.runtimePath !== void 0) pinnedRuntimePath = await resolvePinnedDaemonRuntimePath(pinnedRuntimePath, runtimeRaw, installEnv);
		runtimePath = wrapperPath ? void 0 : pinnedRuntimePath;
	} catch (error) {
		fail(`Invalid runtime pin: ${String(error)}`);
		return;
	}
	const installBind = resolveGatewayInstallBindMode(cfg);
	const noAuthNonLoopbackBlock = formatNoAuthNonLoopbackInstallBlock({
		bind: installBind,
		bindHost: await resolveGatewayBindHost(installBind, cfg.gateway?.customBindHost),
		config: cfg,
		env: installEnv
	});
	if (noAuthNonLoopbackBlock) {
		fail(`Gateway install blocked: ${noAuthNonLoopbackBlock}`);
		return;
	}
	let autoRefreshMessage;
	const recordedNode = existingManagedCommand?.programArguments[0];
	if (runtimeRaw === "node" && !wrapperPath && !runtimePath && recordedNode && isNodeRuntime(recordedNode)) {
		const recordedRuntime = await resolveNodeRuntimeInfo(recordedNode, installEnv);
		if (recordedRuntime.status !== "probe-failed") {
			const diagnostic = recordedRuntime.capabilityError ?? recordedRuntime.note;
			if (diagnostic) warn(diagnostic);
		}
		const replacement = recordedRuntime.status === "probe-failed" && await fs$1.access(recordedNode, constants.X_OK).then(() => false, (error) => isMissingPathError(error) || hasErrnoCode(error, "EACCES")) ? `missing Gateway service Node (${recordedNode})` : recordedRuntime.status === "unsupported" ? `unsupported Gateway service Node ${recordedRuntime.version} (${recordedNode})` : void 0;
		if (replacement) {
			try {
				runtimePath = await resolvePreferredNodePath({
					env: installEnv,
					runtime: "node",
					preferCurrentExecPath: true
				});
				if (!runtimePath) {
					fail(`No supported Node runtime is available. Install Node ${SUPPORTED_NODE_VERSIONS}, then rerun openclaw gateway install.`);
					return;
				}
			} catch (error) {
				fail(`Gateway runtime selection failed: ${String(error)}`);
				return;
			}
			autoRefreshMessage = `Replacing ${replacement} with ${runtimePath}; refreshing the install.`;
		} else if (recordedRuntime.status === "probe-failed" && !opts.force) {
			fail(`${recordedRuntime.error.message} Reinstall with: ${formatCliCommand("openclaw gateway install --force")}.`);
			return;
		} else if (recordedRuntime.status === "supported" && opts.runtime === void 0) runtimePath = recordedNode;
	}
	if (loaded && !opts.force) {
		autoRefreshMessage ??= await getGatewayServiceAutoRefreshMessage({
			allowUnconfigured: opts.allowUnconfigured,
			currentCommand: existingServiceCommand,
			env: process.env,
			installEnv,
			port,
			runtime: runtimeRaw,
			wrapperPath,
			pinnedRuntimePath,
			pinChanged: opts.runtime !== void 0 || opts.runtimePath !== void 0,
			existingEnvironment: existingServiceEnv,
			existingEnvironmentValueSources: existingManagedCommand?.environmentValueSources,
			config: cfg
		});
		if (autoRefreshMessage) {
			if (!await assertWritable()) return;
		}
	}
	if (autoRefreshMessage) warn(autoRefreshMessage);
	if (configSnapshot.valid && cfg.gateway?.mode === void 0) {
		const baseConfig = configSnapshot.sourceConfig ?? configSnapshot.config;
		await replaceConfigFile({
			sourceConfig: {
				...baseConfig,
				gateway: {
					...baseConfig.gateway,
					mode: "local"
				}
			},
			snapshot: configSnapshot,
			writeOptions: {
				baseSnapshot: configSnapshot,
				...configWriteOptions,
				...isUpdateOwnedGatewayServiceCommand() ? { assertCurrent: () => {
					configWriteOptions.assertCurrent?.();
					assertGatewayServiceUpdateCurrent();
				} } : {},
				skipRuntimeSnapshotRefresh: true
			},
			afterWrite: { mode: "auto" }
		});
		const refreshed = await readConfigFileSnapshotForWrite();
		configSnapshot = refreshed.snapshot;
		configWriteOptions = refreshed.writeOptions;
		cfg = configSnapshot.valid ? configSnapshot.sourceConfig : configSnapshot.config;
		warn("No gateway.mode found. Set gateway.mode=local for managed gateway install.");
	}
	if (loaded && !opts.force && !autoRefreshMessage) {
		emitMessage({
			ok: true,
			result: "already-installed",
			message: `Gateway service already ${service.loadedText}.`,
			service: buildDaemonServiceSnapshot(service, loaded)
		});
		if (!json) defaultRuntime.log(`Reinstall with: ${formatCliCommand("openclaw gateway install --force")}`);
		return;
	}
	const tokenResolution = await resolveGatewayInstallToken({
		config: cfg,
		env: installEnv,
		explicitToken: opts.token,
		generateIfMissing: {
			snapshot: configSnapshot,
			writeOptions: configWriteOptions
		}
	});
	if (tokenResolution.unavailableReason) {
		fail(`Gateway install blocked: ${tokenResolution.unavailableReason}`);
		return;
	}
	for (const warning of tokenResolution.warnings) warn(warning);
	const { programArguments, workingDirectory, environment, environmentValueSources } = await buildGatewayInstallPlan({
		allowUnconfigured: opts.allowUnconfigured,
		env: installEnv,
		port,
		runtime: runtimeRaw,
		runtimePath,
		pinnedRuntimePath,
		wrapperPath,
		existingCommand: existingServiceCommand,
		existingEnvironment: existingServiceEnv,
		existingEnvironmentValueSources: existingManagedCommand?.environmentValueSources,
		warn,
		config: cfg
	});
	const install = async (definitionTransaction) => {
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
			definitionTransaction
		});
	};
	const successMessage = `Gateway service installed. Runtime readiness has not been checked; startup may still be in progress. Check with ${formatCliCommand("openclaw gateway status")} and ${formatCliCommand("openclaw health")}.`;
	await installDaemonServiceAndEmit({
		serviceNoun: "Gateway",
		service,
		successMessage,
		onVerified: async () => {
			if (!json) defaultRuntime.log(successMessage);
		},
		warnings,
		emit,
		fail,
		install: async () => {
			if (isUpdateOwnedGatewayServiceCommand() || isTruthyEnvValue(process.env.OPENCLAW_UPDATE_IN_PROGRESS)) definitionBackup = await reconcileGatewayServiceDefinition({
				env: installEnv,
				root: await resolveOpenClawPackageRoot({ moduleUrl: import.meta.url }) ?? void 0,
				command: existingServiceCommand,
				expectedCommand: {
					programArguments,
					workingDirectory,
					environment,
					environmentValueSources
				},
				install,
				warn
			});
			else await install();
		}
	});
}
async function getGatewayServiceAutoRefreshMessage(params) {
	try {
		const currentCommand = resolveManagedGatewayServiceCommand(params.currentCommand);
		if (!currentCommand) return;
		if (params.pinChanged) return "Gateway runtime selection changed; refreshing the install.";
		const getPlannedInstall = createLazyPromise(() => buildGatewayInstallPlan({
			allowUnconfigured: params.allowUnconfigured,
			env: params.installEnv,
			port: params.port,
			runtime: params.runtime,
			wrapperPath: params.wrapperPath,
			pinnedRuntimePath: params.pinnedRuntimePath,
			existingCommand: params.currentCommand,
			existingEnvironment: params.existingEnvironment,
			existingEnvironmentValueSources: params.existingEnvironmentValueSources,
			warn: () => void 0,
			config: params.config
		}));
		const currentAllowsUnconfigured = currentCommand.programArguments.includes("--allow-unconfigured");
		if (currentAllowsUnconfigured || params.allowUnconfigured) {
			if (currentAllowsUnconfigured !== (await getPlannedInstall()).programArguments.includes("--allow-unconfigured")) return "Gateway service start-mode argument differs from the current install plan; refreshing the install.";
		}
		const currentEmbeddedToken = readEmbeddedGatewayToken(currentCommand);
		if (currentEmbeddedToken) {
			const plannedInstall = await getPlannedInstall();
			if (currentEmbeddedToken !== normalizeOptionalString(plannedInstall.environment.OPENCLAW_GATEWAY_TOKEN)) return "Gateway service OPENCLAW_GATEWAY_TOKEN differs from the current install plan; refreshing the install.";
		}
		if (Boolean(params.wrapperPath || normalizeOptionalString(params.installEnv["OPENCLAW_WRAPPER"])) || params.pinnedRuntimePath) {
			const plannedInstall = await getPlannedInstall();
			if (plannedInstall.programArguments.join("\0") !== currentCommand.programArguments.join("\0")) return "Gateway service command differs from the current runtime/wrapper install plan; refreshing the install.";
			if (normalizeOptionalString(plannedInstall.environment["OPENCLAW_WRAPPER"]) !== normalizeOptionalString(currentCommand.environment?.["OPENCLAW_WRAPPER"])) return `Gateway service ${OPENCLAW_WRAPPER_ENV_KEY} differs from the current wrapper install plan; refreshing the install.`;
		}
		const currentExecPath = currentCommand.programArguments[0]?.trim();
		if (!currentExecPath) return;
		const currentEnvironment = currentCommand.environment ?? {};
		const currentNodeExtraCaCerts = currentEnvironment.NODE_EXTRA_CA_CERTS?.trim();
		const expectedNodeExtraCaCerts = resolveNodeStartupTlsEnvironment({
			env: {
				...params.env,
				...currentEnvironment,
				NODE_EXTRA_CA_CERTS: void 0
			},
			execPath: currentExecPath,
			includeDarwinDefaults: false
		}).NODE_EXTRA_CA_CERTS;
		if (!expectedNodeExtraCaCerts) return;
		if (currentNodeExtraCaCerts !== expectedNodeExtraCaCerts) return "Gateway service is missing the nvm TLS CA bundle; refreshing the install.";
		return;
	} catch {
		return;
	}
}
//#endregion
export { runDaemonInstall as n, mergeInstallInvocationEnv as t };
