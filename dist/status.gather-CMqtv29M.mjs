import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { g as resolveSecretInputRef } from "./types.secrets-Dgbd2kyP.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as parseTcpPortFromArgs } from "./tcp-port-B-4SirsX.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { b as resolveGatewayPort, m as resolveConfigPath, o as isDefaultInstallIdentity } from "./paths-orClZ-2Z.mjs";
import { f as resolveConfiguredLogFilePath } from "./logger-DR3u4tgD.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { n as safeParseWithSchema } from "./zod-parse-Bip-sZi_.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CO5zyEkR.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { d as sanitizeServiceInspectionError, s as findServiceOwnershipRefusal } from "./service-inspection-error-ozNMOrIE.mjs";
import { v as resolveGatewayRequiredListenHosts } from "./net-CjQwRK-V.mjs";
import { r as resolveBestEffortGatewayBindHostForDisplay, t as inspectBestEffortPrimaryTailnetIPv4 } from "./network-discovery-display-wYO8QESS.mjs";
import { r as trimToUndefined } from "./credential-planner-iEoiKPLJ.mjs";
import "./credentials-BPKYf2nk.mjs";
import { n as describeUnreadableStateDatabase } from "./state-repair-message-BvQp5mZ3.mjs";
import { i as readGatewayRestartHandoffSync } from "./restart-handoff-DGK45tDN.mjs";
import { c as summarizeGatewayServiceLayout } from "./service-layout-DcU2-cAg.mjs";
import { t as createServiceRuntimeInspectionFailure } from "./service-runtime-k_xhwppy.mjs";
import { n as inspectGatewayHeapLimit } from "./gateway-heap-DPLzOlX-.mjs";
import { r as formatPortDiagnostics } from "./ports-format-Bal9BDTl.mjs";
import { n as inspectPortUsage, r as inspectPortUsages, t as inspectPortConnections } from "./ports-inspect-BaO1UeCS.mjs";
import { r as projectGatewayUrlForDiagnostics } from "./connection-details-DtBQnYSj.mjs";
import { a as readGatewaySecretInputValue, t as ALL_GATEWAY_SECRET_INPUT_PATHS } from "./secret-input-paths-CLN9wOP7.mjs";
import { n as formatServiceLabel } from "./runtime-format-BBnSbkJD.mjs";
import { o as normalizeListenerAddress, s as pickProbeHostForBind } from "./shared-BiNxJvE7.mjs";
import { n as resolveGatewayLocalPortOverride } from "./gateway-port-option-C-xAMj5k.mjs";
import { n as resolveGatewayService, s as readGatewayServiceState } from "./service-CCmqtriJ.mjs";
import { n as hasOfficialPluginVersionCandidates, t as detectPluginVersionDrift } from "./plugin-version-drift-CDS-f9Kk.mjs";
import { t as gatewaySecretInputPathCanWin } from "./credentials-secret-inputs-B1O-0cQW.mjs";
import { i as resolveGatewayProbeCredentialConfig } from "./probe-auth-CPfuCbrp.mjs";
import { t as resolveAdvertisedControlUiLinks } from "./control-ui-links-ZxucSM6y.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DRdbYkg7.mjs";
import { n as readLastGatewayErrorLine } from "./diagnostics-C6iLfgwI.mjs";
import { s as readGatewayLastShutdown } from "./gateway-boot-lifecycle-B_E2PbYI.mjs";
import { n as inspectWindowsGatewayFirewall } from "./windows-gateway-firewall-diagnostics-C1hTTRQJ.mjs";
import fs from "node:fs/promises";
import JSON5 from "json5";
//#region src/cli/daemon-cli/status.config.ts
async function resolveInvalidStatusConfig(value) {
	const [{ GatewayConfigSchema }, { SecretsConfigSchema }, { LoggingConfigSchema }] = await Promise.all([
		import("./zod-schema.gateway-lYfkrfbd.mjs"),
		import("./zod-schema.core-BGd-sa9o.mjs"),
		import("./zod-schema.logging-DRuYdV30.mjs")
	]);
	const raw = asNonArrayRecord(value);
	const gateway = asNonArrayRecord(raw.gateway);
	const fields = GatewayConfigSchema.unwrap().shape;
	const secrets = SecretsConfigSchema.safeParse(raw.secrets);
	const logging = LoggingConfigSchema.safeParse(raw.logging);
	return {
		gateway: {
			mode: safeParseWithSchema(fields.mode, gateway.mode) ?? void 0,
			port: safeParseWithSchema(fields.port, gateway.port) ?? void 0,
			bind: safeParseWithSchema(fields.bind, gateway.bind) ?? void 0,
			customBindHost: safeParseWithSchema(fields.customBindHost, gateway.customBindHost) ?? void 0,
			auth: safeParseWithSchema(fields.auth, gateway.auth) ?? void 0,
			remote: safeParseWithSchema(fields.remote, gateway.remote) ?? void 0,
			tls: safeParseWithSchema(fields.tls, gateway.tls) ?? void 0,
			controlUi: safeParseWithSchema(fields.controlUi, gateway.controlUi) ?? void 0
		},
		...secrets.success ? { secrets: secrets.data } : {},
		...logging.success ? { logging: logging.data } : {}
	};
}
async function readFastStatusConfig(configPath, env) {
	let raw;
	try {
		raw = await fs.readFile(configPath, "utf8");
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) return null;
		return {
			summary: {
				path: configPath,
				exists: false,
				valid: true
			},
			cfg: {},
			mode: "fast"
		};
	}
	let parsed;
	try {
		parsed = JSON5.parse(raw);
	} catch (err) {
		return {
			summary: {
				path: configPath,
				exists: true,
				valid: false,
				issues: [{
					path: "",
					message: `JSON5 parse failed: ${String(err)}`
				}]
			},
			cfg: {},
			mode: "fast"
		};
	}
	if (raw.includes("$include") || raw.includes("${") || Object.hasOwn(asNonArrayRecord(parsed), "env")) return null;
	const { validateConfigObjectRaw } = await import("./validation-core-Cg0ZcYMQ.mjs");
	const validated = validateConfigObjectRaw(parsed, { env });
	const cfg = validated.ok ? validated.config : await resolveInvalidStatusConfig(parsed);
	return {
		summary: {
			path: configPath,
			exists: true,
			valid: validated.ok,
			...!validated.ok ? { issues: validated.issues } : {},
			controlUi: cfg.gateway?.controlUi
		},
		cfg,
		mode: "fast"
	};
}
async function readDaemonStatusConfig(params) {
	if (!params.deep) {
		const fast = await readFastStatusConfig(params.configPath, params.env);
		if (fast) return fast;
	}
	const { createConfigIO } = await import("./io.runtime.js");
	const snapshot = await createConfigIO({
		env: params.env,
		configPath: params.configPath,
		observe: false,
		pluginValidation: params.deep ? "full" : "skip",
		logger: {
			error: () => {},
			warn: () => {}
		}
	}).readConfigFileSnapshot().catch(() => null);
	const cfg = snapshot?.valid ? snapshot.runtimeConfig ?? snapshot.config : await resolveInvalidStatusConfig(snapshot?.config);
	return {
		summary: {
			path: snapshot?.path ?? params.configPath,
			exists: snapshot?.exists ?? false,
			valid: snapshot?.valid ?? false,
			...!snapshot ? { issues: [{
				path: "",
				message: "Configuration could not be read."
			}] } : {},
			...snapshot?.issues?.length ? { issues: snapshot.issues } : {},
			...snapshot?.warnings?.length ? { warnings: snapshot.warnings } : {},
			controlUi: cfg.gateway?.controlUi
		},
		cfg,
		mode: "full"
	};
}
//#endregion
//#region src/cli/daemon-cli/status.gateway.ts
function resolveGatewayStatusProbeConfig(params) {
	const { config, hasUrlOverride } = params;
	return {
		...config,
		gateway: {
			...config.gateway,
			mode: "local",
			remote: config.gateway?.remote ? {
				url: config.gateway.remote.url,
				edgeAuth: config.gateway.remote.edgeAuth,
				tlsFingerprint: config.gateway.remote.tlsFingerprint
			} : void 0,
			auth: !hasUrlOverride && config.gateway?.auth?.mode ? { mode: config.gateway.auth.mode } : void 0,
			tls: void 0
		}
	};
}
async function resolveGatewayStatusSummary(params) {
	const portFromArgs = parseTcpPortFromArgs(params.commandProgramArguments);
	const daemonPort = params.localPortOverride ?? portFromArgs ?? resolveGatewayPort(params.daemonCfg, params.mergedDaemonEnv);
	const portSource = params.localPortOverride !== void 0 ? "cli" : portFromArgs ? "service args" : "env/config";
	const bindMode = params.daemonCfg.gateway?.bind ?? "loopback";
	const customBindHost = params.daemonCfg.gateway?.customBindHost;
	const { bindHost, warning: bindHostWarning } = await resolveBestEffortGatewayBindHostForDisplay({
		bindMode,
		customBindHost,
		warningPrefix: "Status is using fallback network details because interface discovery failed"
	});
	const { tailnetIPv4, warning: tailnetWarning } = inspectBestEffortPrimaryTailnetIPv4({ warningPrefix: "Status could not inspect tailnet addresses" });
	const probeHost = params.localPortOverride !== void 0 ? "127.0.0.1" : pickProbeHostForBind(bindMode, tailnetIPv4, customBindHost);
	const probeUrlOverride = trimToUndefined(params.rpcUrlOverride) ?? null;
	const tlsEnabled = params.daemonCfg.gateway?.tls?.enabled === true;
	const probeUrl = probeUrlOverride ?? `${tlsEnabled ? "wss" : "ws"}://${probeHost}:${daemonPort}`;
	const diagnosticProbeUrl = projectGatewayUrlForDiagnostics(probeUrl);
	const controlUiLinks = params.daemonCfg.gateway?.controlUi?.enabled === false ? void 0 : await resolveAdvertisedControlUiLinks({
		port: daemonPort,
		bind: bindMode,
		customBindHost,
		basePath: params.daemonCfg.gateway?.controlUi?.basePath,
		tlsEnabled
	});
	const bindNote = !probeUrlOverride && bindMode === "lan" ? `bind=lan listens on 0.0.0.0 (all interfaces); checking via ${probeHost}.` : !probeUrlOverride && bindMode === "loopback" ? "Loopback-only gateway; only local clients can connect." : void 0;
	const probeNote = uniqueStrings([
		bindNote,
		bindHostWarning,
		tailnetWarning
	].filter((value) => Boolean(value?.trim()))).join(" ");
	return {
		gateway: {
			bindMode,
			bindHost,
			customBindHost,
			...tlsEnabled ? { tlsEnabled } : {},
			port: daemonPort,
			portSource,
			probeUrl: diagnosticProbeUrl,
			...controlUiLinks ? { controlUiLinks } : {},
			...probeNote ? { probeNote } : {}
		},
		daemonPort,
		cliPort: resolveGatewayPort(params.cliCfg, process.env),
		probeUrl,
		probeUrlOverride
	};
}
function toPortStatusSummary(diagnostics) {
	if (!diagnostics) return;
	return {
		port: diagnostics.port,
		status: diagnostics.status,
		listeners: diagnostics.listeners,
		hints: diagnostics.hints
	};
}
async function inspectDaemonPortStatuses(params) {
	const daemonProbeHosts = resolveGatewayRequiredListenHosts(params.daemonBindHost);
	if (params.cliPort === params.daemonPort) return {
		portStatus: toPortStatusSummary(await inspectPortUsage(params.daemonPort, { probeHosts: daemonProbeHosts }).catch(() => null)),
		portCliStatus: void 0
	};
	const portDiagnosticsByPort = await inspectPortUsages([params.daemonPort, params.cliPort], { probeHostsByPort: /* @__PURE__ */ new Map([[params.daemonPort, daemonProbeHosts]]) }).catch(() => /* @__PURE__ */ new Map());
	return {
		portStatus: toPortStatusSummary(portDiagnosticsByPort.get(params.daemonPort) ?? null),
		portCliStatus: toPortStatusSummary(portDiagnosticsByPort.get(params.cliPort) ?? null)
	};
}
//#endregion
//#region src/cli/daemon-cli/status.projection.ts
/** Fast status has only process-local identity; deep status admits the runtime inspection graph. */
async function projectDaemonRuntimeStatus(params) {
	const entrypoint = (params.argv ?? process.argv)[1]?.trim();
	const cli = {
		version: VERSION,
		...entrypoint ? { entrypoint } : {}
	};
	if (!params.deep) return { cli };
	const { inspectCliRuntime, inspectServiceRuntimeIntent } = await import("./status.runtime.js");
	const env = params.env ?? process.env;
	const { command, loadState, inspectionFailed, inspectionReason } = params.state;
	const runtimeIntent = await inspectServiceRuntimeIntent({
		kind: "gateway",
		service: params.service,
		command,
		env,
		serviceEnv: {
			...env,
			...command?.environment
		},
		inspectionKnown: loadState.status !== "unknown" && !inspectionFailed && !inspectionReason
	});
	return {
		cli: {
			...cli,
			runtime: await inspectCliRuntime()
		},
		runtimeIntent
	};
}
//#endregion
//#region src/cli/daemon-cli/status.service.ts
/** Status may report incomplete inspection, but it cannot override an observed owner. */
async function readDaemonServiceStatus(args) {
	const service = resolveGatewayService();
	return {
		service,
		state: await readGatewayServiceState(service, args).catch((error) => {
			if (hasCommandProcessCleanupError(error)) throw error;
			const refusal = findServiceOwnershipRefusal(error);
			if (refusal) throw refusal;
			const runtime = createServiceRuntimeInspectionFailure(sanitizeServiceInspectionError(error));
			return {
				inspectionFailed: true,
				command: null,
				env: args.env ?? process.env,
				loadState: {
					status: "unknown",
					detail: "Service installation could not be inspected."
				},
				runtime,
				inspectionReason: runtime.inspectionReason
			};
		})
	};
}
//#endregion
//#region src/cli/daemon-cli/status.gather.ts
async function loadDaemonConfigContext(serviceEnv, opts = {}) {
	const mergedDaemonEnv = {
		...process.env,
		...serviceEnv ?? void 0
	};
	const cliConfigPath = resolveConfigPath(process.env, resolveStateDir(process.env));
	const daemonConfigPath = resolveConfigPath(mergedDaemonEnv, resolveStateDir(mergedDaemonEnv));
	const sameConfigPath = cliConfigPath === daemonConfigPath;
	const cliConfigRead = await readDaemonStatusConfig({
		env: process.env,
		configPath: cliConfigPath,
		deep: opts.deep
	});
	const daemonConfigRead = sameConfigPath && (cliConfigRead.mode === "fast" || !serviceEnv) ? cliConfigRead : await readDaemonStatusConfig({
		env: mergedDaemonEnv,
		configPath: daemonConfigPath,
		deep: opts.deep
	});
	return {
		mergedDaemonEnv,
		cliCfg: cliConfigRead.cfg,
		daemonCfg: daemonConfigRead.cfg,
		cliConfigSummary: cliConfigRead.summary,
		daemonConfigSummary: daemonConfigRead.summary,
		configMismatch: cliConfigRead.summary.path !== daemonConfigRead.summary.path
	};
}
async function inspectEstablishedGatewayClients(params) {
	if (params.deep !== true || params.gatewayMode === "remote") return;
	const result = await inspectPortConnections(params.daemonPort).catch(() => null);
	const establishedClients = result?.connections.filter((connection) => connection.direction !== "server");
	if (!result || !establishedClients || establishedClients.length === 0) return;
	return {
		port: result.port,
		established: establishedClients
	};
}
function hasActiveGatewayExecProbeCredential(params) {
	const cfg = resolveGatewayProbeCredentialConfig({
		cfg: params.cfg,
		mode: params.mode
	});
	return ALL_GATEWAY_SECRET_INPUT_PATHS.some((path) => {
		if (!gatewaySecretInputPathCanWin({
			config: cfg,
			env: params.env,
			explicitAuth: params.explicitAuth,
			modeOverride: params.mode,
			path,
			remoteTokenFallback: "remote-only",
			remotePasswordFallback: "remote-only"
		})) return false;
		return resolveSecretInputRef({
			value: readGatewaySecretInputValue(cfg, path),
			defaults: cfg.secrets?.defaults
		}).ref?.source === "exec";
	});
}
async function gatherDaemonStatusImpl(opts) {
	const localPortOverride = resolveGatewayLocalPortOverride(opts.rpc);
	const timeoutMs = parseTimeoutMsWithFallback(opts.rpc.timeout, 1e4, { invalidType: "error" });
	const { service, state: serviceState } = await readDaemonServiceStatus({
		env: process.env,
		timeoutMs: process.platform === "win32" && opts.rpc.timeout === void 0 ? void 0 : timeoutMs
	});
	const { command, env: serviceEnv, loadState, runtime } = serviceState;
	const loaded = loadState.status === "loaded";
	const useNativeServiceTargetContext = !serviceState.inspectionFailed && localPortOverride === void 0 && serviceState.inspectionReason !== "service-manager-unavailable" && isDefaultInstallIdentity(process.env) && !isGatewayExternallySupervised(process.env);
	const targetServiceCommand = useNativeServiceTargetContext ? command : null;
	const serviceLayout = command ? await summarizeGatewayServiceLayout(command).catch(() => void 0) : void 0;
	if (opts.deep && !trimToUndefined(opts.rpc.url)) {
		const { preflightOpenClawDatabaseSchemas, OpenClawDatabaseSchemaPreflightError } = await import("./openclaw-database-preflight-D3lTU13W.mjs");
		const schemas = await preflightOpenClawDatabaseSchemas({
			env: {
				...process.env,
				...targetServiceCommand?.environment
			},
			scope: "state"
		});
		if (schemas.incompatible.length > 0) throw new OpenClawDatabaseSchemaPreflightError(schemas.incompatible);
		const unreadableStateDatabase = schemas.indeterminate.find((database) => database.kind === "state");
		if (unreadableStateDatabase) {
			const { problem, recovery } = describeUnreadableStateDatabase(unreadableStateDatabase.path, unreadableStateDatabase.reason);
			throw new Error(`${problem}. ${recovery}`);
		}
	}
	const restartHandoff = opts.deep ? readGatewayRestartHandoffSync(serviceEnv) : null;
	const configAudit = await import("./service-audit-C-_RSQkQ.mjs").then(({ auditGatewayServiceConfig }) => auditGatewayServiceConfig({
		env: process.env,
		command,
		timeoutMs
	}));
	const { mergedDaemonEnv, cliCfg, daemonCfg, cliConfigSummary, daemonConfigSummary, configMismatch } = await loadDaemonConfigContext(targetServiceCommand?.environment, { deep: opts.deep });
	const { gateway, daemonPort, cliPort, probeUrl, probeUrlOverride } = await resolveGatewayStatusSummary({
		cliCfg,
		daemonCfg,
		mergedDaemonEnv,
		commandProgramArguments: targetServiceCommand?.programArguments,
		rpcUrlOverride: opts.rpc.url,
		localPortOverride
	});
	const hasUrlOverride = Boolean(probeUrlOverride);
	const serviceTargetsProbe = useNativeServiceTargetContext && !hasUrlOverride;
	const shouldInspectLocalGateway = !hasUrlOverride;
	const lastShutdown = opts.deep && shouldInspectLocalGateway ? readGatewayLastShutdown(mergedDaemonEnv) : void 0;
	let duelingScopesWarning = null;
	if (opts.deep && serviceTargetsProbe && process.platform === "linux") {
		const { findSystemdGatewayInstallation, formatDuelingScopesWarning } = await import("./systemd-scope-DN9RLPH3.mjs");
		const installation = await findSystemdGatewayInstallation(serviceEnv).catch(() => null);
		duelingScopesWarning = installation ? formatDuelingScopesWarning(installation, daemonPort) : null;
	}
	const windowsFirewall = opts.deep === true && shouldInspectLocalGateway ? await inspectWindowsGatewayFirewall({
		bind: gateway.bindMode,
		mode: "quick",
		port: daemonPort,
		platform: process.platform
	}) : void 0;
	const { portStatus, portCliStatus } = await inspectDaemonPortStatuses({
		daemonPort,
		cliPort,
		daemonBindHost: gateway.bindHost
	});
	const establishedClients = await inspectEstablishedGatewayClients({
		daemonPort,
		deep: opts.deep,
		gatewayMode: shouldInspectLocalGateway ? "local" : "remote"
	});
	const extraServices = opts.deep ? await import("./inspect-bpNXsLyD.mjs").then(({ findExtraGatewayServices }) => findExtraGatewayServices(process.env, { deep: true })).then(({ services }) => services.filter((extra) => extra.platform !== "linux" || extra.scope !== runtime?.systemd?.scope || extra.label !== runtime?.systemd?.unit)).catch(() => []) : [];
	const launchdDiagnostics = process.platform === "darwin" ? await import("./status.launchd-BaMslehk.mjs").then(({ gatherLaunchdJobDiagnostics }) => gatherLaunchdJobDiagnostics(serviceEnv, Boolean(opts.deep))) : {};
	const tlsEnabled = daemonCfg.gateway?.tls?.enabled === true;
	const localCertificate = opts.probe && !probeUrlOverride && tlsEnabled ? await import("./gateway-ItaquleK.mjs").then(({ inspectGatewayTlsCertificate }) => inspectGatewayTlsCertificate(daemonCfg.gateway?.tls)) : void 0;
	let daemonProbeAuth;
	let rpcAuthWarning;
	let redactedProbeCredential = false;
	let allowRpcConfigCredentials = true;
	let skippedProbeAuthForDisabledExecSecretRef = false;
	if (opts.probe) {
		const explicitAuth = {
			token: trimToUndefined(opts.rpc.token),
			password: trimToUndefined(opts.rpc.password)
		};
		const canResolveProbeAuth = opts.allowExecSecretRefs !== false || !hasActiveGatewayExecProbeCredential({
			cfg: daemonCfg,
			env: mergedDaemonEnv,
			explicitAuth,
			mode: "local"
		});
		if (probeUrlOverride || explicitAuth.token || explicitAuth.password) daemonProbeAuth = explicitAuth;
		else if (daemonCfg.gateway?.auth?.mode === "none") daemonProbeAuth = {};
		else if (canResolveProbeAuth) {
			const probeAuthResolution = await import("./probe-auth-BXuP0IYS.mjs").then(({ resolveGatewayProbeAuthSafeWithSecretInputs }) => resolveGatewayProbeAuthSafeWithSecretInputs({
				cfg: daemonCfg,
				mode: "local",
				env: mergedDaemonEnv,
				explicitAuth
			}));
			daemonProbeAuth = probeAuthResolution.auth;
			rpcAuthWarning = probeAuthResolution.warning;
			redactedProbeCredential = probeAuthResolution.warningCode === "SECRET_REF_REDACTED_VALUE";
		} else {
			allowRpcConfigCredentials = false;
			skippedProbeAuthForDisabledExecSecretRef = true;
			rpcAuthWarning = "Gateway check auth skipped because gateway credentials use an exec SecretRef and exec SecretRefs are disabled for this status request.";
		}
	}
	const rpc = opts.probe ? await import("./probe-DEAaANVm.mjs").then(({ probeGatewayStatus }) => probeGatewayStatus({
		url: probeUrl,
		...probeUrlOverride ? { urlOverride: probeUrlOverride } : {},
		localPortOverride,
		token: daemonProbeAuth?.token,
		password: daemonProbeAuth?.password,
		config: resolveGatewayStatusProbeConfig({
			config: daemonCfg,
			hasUrlOverride
		}),
		tlsFingerprint: localCertificate?.ok ? localCertificate.value.fingerprintSha256 : void 0,
		timeoutMs,
		json: opts.rpc.json,
		requireRpc: opts.requireRpc,
		allowRpcConfigCredentials,
		configPath: daemonConfigSummary.path
	})) : void 0;
	if (rpc?.ok && !skippedProbeAuthForDisabledExecSecretRef && !redactedProbeCredential) rpcAuthWarning = void 0;
	const health = opts.probe && serviceTargetsProbe && loaded && rpc?.ok !== true ? await import("./restart-health-Kq1hDjYh.mjs").then(({ inspectGatewayRestart }) => inspectGatewayRestart({
		service,
		port: daemonPort,
		env: serviceEnv,
		probeHosts: resolveGatewayRequiredListenHosts(gateway.bindHost)
	})).catch(() => void 0) : void 0;
	const gatewayVersion = opts.probe ? (rpc && "server" in rpc ? rpc.server?.version : void 0) ?? (rpc && "version" in rpc ? rpc.version : void 0) ?? null : void 0;
	let lastError;
	if (shouldInspectLocalGateway && loaded && runtime?.status === "running" && portStatus && (portStatus.status !== "busy" || rpc?.ok === false)) lastError = await readLastGatewayErrorLine(mergedDaemonEnv) ?? void 0;
	let pluginVersionDrift;
	let pluginVersionRestartReadiness;
	if (shouldInspectLocalGateway) {
		const loadInstallRecords = () => loadInstalledPluginIndexInstallRecords({
			env: mergedDaemonEnv,
			artifactPreservingReadOnly: true
		});
		try {
			if (opts.pluginVersionTarget === "restart") {
				const runningGatewayVersion = gatewayVersion ?? void 0;
				if (!useNativeServiceTargetContext || !targetServiceCommand && !loaded) {} else {
					const installRecords = await loadInstallRecords();
					if (hasOfficialPluginVersionCandidates({
						installRecords,
						config: daemonCfg
					})) {
						if (!targetServiceCommand) pluginVersionRestartReadiness = {
							status: "unresolved",
							reason: "Gateway service command is unavailable, so the post-restart OpenClaw version is unknown.",
							...runningGatewayVersion ? { runningGatewayVersion } : {}
						};
						else {
							const layout = await summarizeGatewayServiceLayout(targetServiceCommand);
							if (!layout?.packageVersion) pluginVersionRestartReadiness = {
								status: "unresolved",
								reason: "Gateway service package version is unavailable, so the post-restart OpenClaw version is unknown.",
								...runningGatewayVersion ? { runningGatewayVersion } : {}
							};
							else pluginVersionRestartReadiness = {
								status: "resolved",
								report: detectPluginVersionDrift({
									gatewayVersion: layout.packageVersion,
									installRecords,
									config: daemonCfg
								}),
								...runningGatewayVersion ? { runningGatewayVersion } : {}
							};
						}
					}
				}
			} else {
				const installRecords = await loadInstallRecords();
				pluginVersionDrift = detectPluginVersionDrift({
					gatewayVersion: gatewayVersion ?? VERSION,
					installRecords,
					config: daemonCfg
				});
			}
		} catch {
			if (opts.pluginVersionTarget === "restart") pluginVersionRestartReadiness = {
				status: "unresolved",
				reason: "Plugin restart readiness could not be inspected, so post-restart compatibility is unknown.",
				...gatewayVersion ? { runningGatewayVersion: gatewayVersion } : {}
			};
			else pluginVersionDrift = void 0;
		}
	}
	const hostDesktop = await (await import("./host-source-DI2h8iZL.mjs")).inspectHostDesktop({ config: daemonCfg.desktop?.host });
	const targetRole = serviceTargetsProbe ? "target" : "diagnostic-only";
	const projection = await projectDaemonRuntimeStatus({
		deep: opts.deep,
		service,
		state: serviceState
	});
	return {
		cli: projection.cli,
		logFile: resolveConfiguredLogFilePath(cliCfg),
		service: {
			inspectionReason: serviceState.inspectionReason,
			label: formatServiceLabel(service.label, runtime),
			...serviceState.systemdInstallation ? { systemdInstallation: serviceState.systemdInstallation } : {},
			loaded: loadState.status === "unknown" ? null : loaded,
			loadState,
			loadedText: service.loadedText,
			notLoadedText: service.notLoadedText,
			targetRole,
			command,
			...projection.runtimeIntent,
			...serviceLayout ? { layout: serviceLayout } : {},
			runtime: runtime?.inspectionFailure ? {
				...runtime,
				detail: `${runtime.detail}; retry with openclaw gateway status --deep`
			} : runtime,
			configAudit,
			...command ? { gatewayHeap: inspectGatewayHeapLimit(command.environment?.NODE_OPTIONS, {}, command.programArguments) } : {},
			...restartHandoff ? { restartHandoff } : {},
			...launchdDiagnostics
		},
		config: {
			cli: cliConfigSummary,
			daemon: daemonConfigSummary,
			...configMismatch ? { mismatch: true } : {}
		},
		gateway: {
			...gateway,
			...lastShutdown ? { lastShutdown } : {},
			...duelingScopesWarning ? { duelingScopesWarning } : {},
			...windowsFirewall?.applies ? { windowsFirewall } : {},
			...opts.probe ? { version: gatewayVersion } : {}
		},
		hostDesktop: hostDesktop.status,
		port: portStatus,
		...portCliStatus ? { portCli: portCliStatus } : {},
		...establishedClients ? { connections: establishedClients } : {},
		lastError,
		...rpc ? { rpc: {
			...rpc,
			url: gateway.probeUrl,
			...rpcAuthWarning ? { authWarning: rpcAuthWarning } : {}
		} } : {},
		...health ? { health: {
			healthy: health.healthy,
			staleGatewayPids: health.staleGatewayPids
		} } : {},
		extraServices,
		...pluginVersionDrift ? { pluginVersionDrift } : {},
		...pluginVersionRestartReadiness ? { pluginVersionRestartReadiness } : {}
	};
}
async function gatherDaemonStatus(opts) {
	return gatherDaemonStatusImpl(opts);
}
function renderPortDiagnosticsForCli({ port }, rpcOk) {
	if (!port || port.status === void 0 || port.status === "free" || rpcOk === true) return [];
	return formatPortDiagnostics({
		port: port.port,
		status: port.status,
		listeners: port.listeners,
		hints: port.hints
	});
}
function resolvePortListeningAddresses(status) {
	return Array.from(new Set(status.port?.listeners?.map((l) => l.address ? normalizeListenerAddress(l.address) : "").filter((v) => Boolean(v)) ?? []));
}
//#endregion
export { renderPortDiagnosticsForCli as n, resolvePortListeningAddresses as r, gatherDaemonStatus as t };
