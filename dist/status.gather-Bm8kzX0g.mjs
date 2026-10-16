import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { g as resolveSecretInputRef } from "./types.secrets-DsPRn9Dz.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as parseTcpPortFromArgs } from "./tcp-port-8uSpDbMY.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { b as resolveGatewayPort, m as resolveConfigPath, o as isDefaultInstallIdentity } from "./paths-DGIwWbpu.mjs";
import { f as resolveConfiguredLogFilePath } from "./logger-Mnn26Jj7.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { n as safeParseWithSchema } from "./zod-parse-Bip-sZi_.mjs";
import { n as formatServiceLabel } from "./runtime-format-C0Herh-B.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { o as findServiceOwnershipRefusal, u as sanitizeServiceInspectionError } from "./service-inspection-error-Bsltcpi4.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CUdBruRD.mjs";
import { o as normalizeListenerAddress, s as pickProbeHostForBind } from "./shared-DejcqFfy.mjs";
import { t as createServiceRuntimeInspectionFailure } from "./service-runtime-Cbp6mAbj.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { n as resolveGatewayLocalPortOverride } from "./gateway-port-option-BtunGZyj.mjs";
import { c as summarizeGatewayServiceLayout } from "./service-layout-BNLNn9Ng.mjs";
import { v as resolveGatewayRequiredListenHosts } from "./net-C6WEu3pd.mjs";
import { i as readGatewayServiceState, n as resolveGatewayService } from "./service-CCUynFdj.mjs";
import { r as formatPortDiagnostics } from "./ports-format-B_qarAEO.mjs";
import { n as inspectPortUsage, r as inspectPortUsages, t as inspectPortConnections } from "./ports-inspect-54fwKbFD.mjs";
import { n as inspectGatewayHeapLimit } from "./gateway-heap-DTqeZ8TX.mjs";
import { n as hasOfficialPluginVersionCandidates, t as detectPluginVersionDrift } from "./plugin-version-drift-BsJ4AHQ4.mjs";
import { r as trimToUndefined } from "./credential-planner-qXtujUeq.mjs";
import "./credentials-lHQ7_oVm.mjs";
import { a as readGatewaySecretInputValue, t as ALL_GATEWAY_SECRET_INPUT_PATHS } from "./secret-input-paths-C2PsvPdU.mjs";
import { r as projectGatewayUrlForDiagnostics } from "./connection-details-BcuL3xPn.mjs";
import { t as gatewaySecretInputPathCanWin } from "./credentials-secret-inputs-DxDUO_P2.mjs";
import { a as resolveGatewayProbeCredentialConfig } from "./probe-auth-CUiOEilG.mjs";
import { r as readGatewayRestartHandoffSync } from "./restart-handoff-HHx3Pddl.mjs";
import { r as resolveBestEffortGatewayBindHostForDisplay, t as inspectBestEffortPrimaryTailnetIPv4 } from "./network-discovery-display-N9b25Tou.mjs";
import { t as resolveAdvertisedControlUiLinks } from "./control-ui-links-CvxEAkDu.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DXeKniz_.mjs";
import { n as readLastGatewayErrorLine } from "./diagnostics-BEnEelkI.mjs";
import { c as readGatewayLastShutdown } from "./gateway-boot-lifecycle-d7mP4u6P.mjs";
import { n as inspectWindowsGatewayFirewall } from "./windows-gateway-firewall-diagnostics-DktfF5Yz.mjs";
import fs from "node:fs/promises";
import JSON5 from "json5";
//#region src/cli/daemon-cli/status.config.ts
const loadConfigIoRuntime = createLazyPromise(() => import("./io.runtime.js"));
async function resolveInvalidStatusConfig(value) {
	const [{ GatewayConfigSchema }, { SecretsConfigSchema }, { LoggingConfigSchema }] = await Promise.all([
		import("./zod-schema.gateway-CuD9XBU3.mjs"),
		import("./zod-schema.core-xawOzYxV.mjs"),
		import("./zod-schema.logging-CmyXqfiE.mjs")
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
	const { validateConfigObjectRaw } = await import("./validation-core-DYk_zOU7.mjs");
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
async function readFullStatusConfig(params) {
	const { createConfigIO } = await loadConfigIoRuntime();
	const snapshot = await createConfigIO({
		env: params.env,
		configPath: params.configPath,
		observe: false,
		pluginValidation: params.pluginValidation ?? "skip",
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
async function readDaemonStatusConfig(params) {
	return (params.deep ? null : await readFastStatusConfig(params.configPath, params.env)) ?? await readFullStatusConfig({
		env: params.env,
		configPath: params.configPath,
		pluginValidation: params.deep ? "full" : "skip"
	});
}
//#endregion
//#region src/cli/daemon-cli/status.gateway.ts
function appendProbeNote(existing, extra) {
	const values = [existing, extra].filter((value) => Boolean(value?.trim()));
	if (values.length === 0) return;
	return uniqueStrings(values).join(" ");
}
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
	let probeNote = !probeUrlOverride && bindMode === "lan" ? `bind=lan listens on 0.0.0.0 (all interfaces); probing via ${probeHost}.` : !probeUrlOverride && bindMode === "loopback" ? "Loopback-only gateway; only local clients can connect." : void 0;
	probeNote = appendProbeNote(probeNote, bindHostWarning);
	probeNote = appendProbeNote(probeNote, tailnetWarning);
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
	const { inspectCliRuntime, inspectServiceRuntimeIntent } = await import("./status.runtime-intent-BDH6xrHu.mjs");
	const env = params.env ?? process.env;
	const { command, loadState, inspectionFailed, inspectionReason } = params.state;
	const runtimeIntent = await inspectServiceRuntimeIntent({
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
const loadGatewayProbeAuthModule = createLazyPromise(() => import("./probe-auth-HTbbclNq.mjs"));
const loadDaemonInspectModule = createLazyPromise(() => import("./inspect-CiXQNdQv.mjs"));
const loadLaunchdDiagnosticsModule = createLazyPromise(() => import("./status.launchd-BtXGTpoV.mjs"));
const loadServiceAuditModule = createLazyPromise(() => import("./service-audit-C-SwzbMH.mjs"));
const loadGatewayTlsModule = createLazyPromise(() => import("./gateway-C_8m90Qi.mjs"));
const loadDaemonProbeModule = createLazyPromise(() => import("./probe-CdkP63qK.mjs"));
const loadRestartHealthModule = createLazyPromise(() => import("./restart-health-BpknVvYH.mjs"));
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
		const { preflightOpenClawDatabaseSchemas, OpenClawDatabaseSchemaPreflightError } = await import("./openclaw-database-preflight-ClnnU5e8.mjs");
		const schemas = await preflightOpenClawDatabaseSchemas({
			env: {
				...process.env,
				...targetServiceCommand?.environment
			},
			scope: "state"
		});
		if (schemas.incompatible.length > 0) throw new OpenClawDatabaseSchemaPreflightError(schemas.incompatible);
	}
	const restartHandoff = opts.deep ? readGatewayRestartHandoffSync(serviceEnv) : null;
	const configAudit = await loadServiceAuditModule().then(({ auditGatewayServiceConfig }) => auditGatewayServiceConfig({
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
		const { findSystemdGatewayInstallation, formatDuelingScopesWarning } = await import("./systemd-scope-BR366_81.mjs");
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
	const extraServices = opts.deep ? await loadDaemonInspectModule().then(({ findExtraGatewayServices }) => findExtraGatewayServices(process.env, { deep: true })).then(({ services }) => services.filter((extra) => extra.platform !== "linux" || extra.scope !== runtime?.systemd?.scope || extra.label !== runtime?.systemd?.unit)).catch(() => []) : [];
	const launchdDiagnostics = process.platform === "darwin" ? await loadLaunchdDiagnosticsModule().then(({ gatherLaunchdJobDiagnostics }) => gatherLaunchdJobDiagnostics(serviceEnv, Boolean(opts.deep))) : {};
	const tlsEnabled = daemonCfg.gateway?.tls?.enabled === true;
	const localCertificate = opts.probe && !probeUrlOverride && tlsEnabled ? await loadGatewayTlsModule().then(({ inspectGatewayTlsCertificate }) => inspectGatewayTlsCertificate(daemonCfg.gateway?.tls)) : void 0;
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
			const probeAuthResolution = await loadGatewayProbeAuthModule().then(({ resolveGatewayProbeAuthSafeWithSecretInputs }) => resolveGatewayProbeAuthSafeWithSecretInputs({
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
			rpcAuthWarning = "Gateway probe auth skipped because gateway credentials use an exec SecretRef and exec SecretRefs are disabled for this status request.";
		}
	}
	const rpc = opts.probe ? await loadDaemonProbeModule().then(({ probeGatewayStatus }) => probeGatewayStatus({
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
	const health = opts.probe && serviceTargetsProbe && loaded && rpc?.ok !== true ? await loadRestartHealthModule().then(({ inspectGatewayRestart }) => inspectGatewayRestart({
		service,
		port: daemonPort,
		env: serviceEnv,
		probeHosts: resolveGatewayRequiredListenHosts(gateway.bindHost)
	})).catch(() => void 0) : void 0;
	const gatewayVersion = opts.probe ? (rpc && "server" in rpc ? rpc.server?.version : void 0) ?? (rpc && "version" in rpc ? rpc.version : void 0) ?? null : void 0;
	let lastError;
	if (shouldInspectLocalGateway && loaded && runtime?.status === "running" && portStatus && (portStatus.status !== "busy" || rpc?.ok === false)) lastError = await readLastGatewayErrorLine(mergedDaemonEnv, { requirePatternMatch: portStatus.status === "busy" }) ?? void 0;
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
	const hostDesktop = await (await import("./host-source-DETvs-6O.mjs")).inspectHostDesktop({ config: daemonCfg.desktop?.host });
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
