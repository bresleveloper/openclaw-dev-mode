import { g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { t as isAbortError } from "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { o as readBestEffortConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { t as parseGatewayPortOption } from "./gateway-port-option-BtunGZyj.mjs";
import "./call-DnqhP17M.mjs";
import { r as resolveExplicitGatewayAuth } from "./credentials-lHQ7_oVm.mjs";
import { a as resolveGatewaySshRemotePort } from "./connection-details-BcuL3xPn.mjs";
import { n as ensureExplicitGatewayAuth } from "./client-bootstrap-D-pUrrKi.mjs";
import { r as probeGateway } from "./probe-B0qn0tgj.mjs";
import { r as withProgress } from "./progress-UTM8yfZa.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DXeKniz_.mjs";
import { a as resolveWideAreaDiscoveryDomain } from "./widearea-dns-DGEbA3Lo.mjs";
import { t as discoverGatewayBeacons } from "./bonjour-discovery-DnM1ztCd.mjs";
import { n as buildGatewayDiscoveryTarget, r as serializeGatewayDiscoveryBeacon } from "./gateway-discovery-targets-Cj-y7koN.mjs";
import { a as isProbeReachable, c as renderTargetHeader, d as resolveTargets, f as sanitizeSshTarget, i as isPostConnectProbeFailure, l as resolveAuthForTarget, n as buildNetworkHints, o as isScopeLimitedProbeFailure, p as summarizeGatewayProbeCapability, r as extractConfigSummary, s as renderProbeSummaryLine, t as pickGatewaySelfPresence, u as resolveProbeBudgetMs } from "./gateway-presence-Bzhf1Ns9.mjs";
//#region src/commands/gateway-status/discovery.ts
/** Discovery helpers for turning gateway remote URLs and Bonjour beacons into SSH targets. */
/** Infers a user@host SSH target from a configured remote websocket URL. */
function inferSshTargetFromRemoteUrl(rawUrl) {
	if (typeof rawUrl !== "string") return null;
	const trimmed = normalizeOptionalString(rawUrl) ?? "";
	if (!trimmed) return null;
	let host;
	try {
		host = new URL(trimmed).hostname || null;
	} catch {
		return null;
	}
	if (!host) return null;
	const user = normalizeOptionalString(process.env.USER) ?? "";
	return user ? `${user}@${host}` : host;
}
function buildSshTarget(input) {
	const host = normalizeOptionalString(input.host) ?? "";
	if (!host) return null;
	const user = normalizeOptionalString(input.user) ?? "";
	const base = user ? `${user}@${host}` : host;
	const port = input.port ?? 22;
	if (port && port !== 22) return `${base}:${port}`;
	return base;
}
/** Resolves an SSH target through ssh-config while preserving explicit identity choices. */
async function resolveSshTarget(params) {
	const [{ resolveSshConfig }, { parseSshTarget }] = await Promise.all([params.loadSshConfigModule(), params.loadSshTunnelModule()]);
	const parsed = parseSshTarget(params.rawTarget);
	if (!parsed) return null;
	const config = await resolveSshConfig(parsed, {
		identity: params.identity ?? void 0,
		timeoutMs: Math.min(800, params.overallTimeoutMs)
	});
	if (!config) return {
		target: params.rawTarget,
		identity: params.identity ?? void 0
	};
	const target = buildSshTarget({
		user: config.user ?? parsed.user,
		host: config.host ?? parsed.host,
		port: config.port ?? parsed.port
	});
	if (!target) return {
		target: params.rawTarget,
		identity: params.identity ?? void 0
	};
	return {
		target,
		identity: params.identity ?? config.identityFiles.find((entry) => normalizeOptionalString(entry)) ?? void 0
	};
}
/** Picks the first Bonjour-derived SSH target that parses as a valid tunnel target. */
function pickAutoSshTargetFromDiscovery(params) {
	for (const beacon of params.discovery) {
		const sshTarget = buildGatewayDiscoveryTarget(beacon, { sshUser: params.sshUser ?? void 0 }).sshTarget;
		if (!sshTarget) continue;
		if (params.parseSshTarget(sshTarget)) return sshTarget;
	}
	return null;
}
//#endregion
//#region src/commands/gateway-status/output.ts
const noReachableGatewayDiagnostic = "No gateway answered any probe and Bonjour discovery returned no local gateways. Run `openclaw gateway status --deep --require-rpc` to inspect service state, config paths, listener owners, and logs; include `ss -ltnp` or `lsof -nP -iTCP:<port> -sTCP:LISTEN` for the configured port when filing a report.";
function gatewaySelfIdentityKey(entry) {
	if (!entry.self) return null;
	const host = normalizeLowercaseStringOrEmpty(entry.self.host);
	const ip = normalizeLowercaseStringOrEmpty(entry.self.ip);
	const instanceId = normalizeLowercaseStringOrEmpty(entry.self.instanceId);
	const deviceId = normalizeLowercaseStringOrEmpty(entry.self.deviceId);
	const discriminator = instanceId ? `instance:${instanceId}` : deviceId ? `device:${deviceId}` : "";
	if (!host && !ip || !discriminator) return null;
	return `${host}\0${ip}\0${discriminator}`;
}
function hasMultipleReachableGatewayIdentities(reachable) {
	if (reachable.length <= 1) return false;
	const identityKeys = reachable.map(gatewaySelfIdentityKey);
	if (identityKeys.some((key) => key === null)) return true;
	return new Set(identityKeys).size > 1;
}
function pickPrimaryProbedTarget(probed) {
	const reachable = probed.filter((entry) => isProbeReachable(entry.probe));
	return reachable.find((entry) => entry.target.kind === "explicit") ?? reachable.find((entry) => entry.target.kind === "sshTunnel") ?? reachable.find((entry) => entry.target.kind === "configRemote") ?? reachable.find((entry) => entry.target.kind === "localLoopback") ?? null;
}
function buildGatewayStatusWarnings(params) {
	const reachable = params.probed.filter((entry) => isProbeReachable(entry.probe));
	const degradedScopeLimited = params.probed.filter((entry) => isScopeLimitedProbeFailure(entry.probe));
	const degradedDetailFailed = params.probed.filter((entry) => isPostConnectProbeFailure(entry.probe) && !isScopeLimitedProbeFailure(entry.probe));
	const warnings = [];
	if (params.sshTarget && !params.sshTunnelStarted) warnings.push({
		code: "ssh_tunnel_failed",
		message: params.sshTunnelError ? `SSH tunnel failed: ${params.sshTunnelError}` : "SSH tunnel failed to start; falling back to direct probes."
	});
	if (params.localTlsLoadError) warnings.push({
		code: "local_tls_runtime_unavailable",
		message: `Local gateway TLS is enabled but OpenClaw could not load the local certificate fingerprint: ${params.localTlsLoadError}`,
		targetIds: ["localLoopback"]
	});
	if (reachable.length === 0 && params.discoveryCount === 0) warnings.push({
		code: "no_gateway_reachable",
		message: noReachableGatewayDiagnostic,
		targetIds: params.probed.map((entry) => entry.target.id)
	});
	if (hasMultipleReachableGatewayIdentities(reachable)) warnings.push({
		code: "multiple_gateways",
		message: "Unconventional setup: multiple reachable gateway identities detected. Usually one gateway per network is recommended unless you intentionally run isolated profiles, like a rescue bot (see docs: /gateway#multiple-gateways-same-host).",
		targetIds: reachable.map((entry) => entry.target.id)
	});
	for (const result of params.probed) {
		if (result.authDiagnostics.length === 0 || isProbeReachable(result.probe)) continue;
		for (const diagnostic of result.authDiagnostics) warnings.push({
			code: "auth_secretref_unresolved",
			message: diagnostic,
			targetIds: [result.target.id]
		});
	}
	for (const result of degradedScopeLimited) warnings.push({
		code: "probe_scope_limited",
		message: "Read-probe diagnostics are limited by gateway scopes (missing operator.read). Connection succeeded, but read-only status calls are incomplete. Hint: pair device identity or use credentials with operator.read.",
		targetIds: [result.target.id]
	});
	for (const result of degradedDetailFailed) {
		const detail = result.probe.error ? `: ${result.probe.error}` : ".";
		warnings.push({
			code: "probe_detail_failed",
			message: `Gateway accepted the WebSocket connection, but follow-up read diagnostics failed${detail}`,
			targetIds: [result.target.id]
		});
	}
	return warnings;
}
function writeGatewayStatusJson(params) {
	const reachable = params.probed.filter((entry) => isProbeReachable(entry.probe));
	const degraded = params.probed.some((entry) => isPostConnectProbeFailure(entry.probe));
	const capability = summarizeGatewayProbeCapability(reachable.map((entry) => entry.probe));
	writeRuntimeJson(params.runtime, {
		ok: reachable.length > 0,
		degraded,
		capability,
		ts: Date.now(),
		durationMs: Date.now() - params.startedAt,
		timeoutMs: params.overallTimeoutMs,
		primaryTargetId: params.primaryTargetId,
		warnings: params.warnings,
		network: params.network,
		discovery: {
			timeoutMs: params.discoveryTimeoutMs,
			count: params.discovery.length,
			beacons: params.discovery.map(serializeGatewayDiscoveryBeacon)
		},
		targets: params.probed.map((entry) => ({
			id: entry.target.id,
			kind: entry.target.kind,
			url: entry.target.url,
			active: entry.target.active,
			tunnel: entry.target.tunnel ?? null,
			connect: {
				ok: isProbeReachable(entry.probe),
				rpcOk: entry.probe.ok,
				scopeLimited: isScopeLimitedProbeFailure(entry.probe),
				latencyMs: entry.probe.connectLatencyMs,
				error: entry.probe.error,
				close: entry.probe.close
			},
			auth: entry.probe.auth,
			server: entry.probe.server,
			self: entry.self,
			config: entry.configSummary,
			health: entry.probe.health,
			summary: entry.probe.status,
			presence: entry.probe.presence
		}))
	});
	if (reachable.length === 0) params.runtime.exit(1);
}
function writeGatewayStatusText(params) {
	const reachable = params.probed.filter((entry) => isProbeReachable(entry.probe));
	const ok = reachable.length > 0;
	const capability = summarizeGatewayProbeCapability(reachable.map((entry) => entry.probe));
	params.runtime.log(colorize(params.rich, theme.heading, "Gateway Status"));
	params.runtime.log(ok ? `${colorize(params.rich, theme.success, "Reachable")}: yes` : `${colorize(params.rich, theme.error, "Reachable")}: no`);
	params.runtime.log(`${colorize(params.rich, theme.info, "Capability")}: ${capability.replaceAll("_", "-")}`);
	params.runtime.log(colorize(params.rich, theme.muted, `Probe budget: ${params.overallTimeoutMs}ms`));
	if (params.warnings.length > 0) {
		params.runtime.log("");
		params.runtime.log(colorize(params.rich, theme.warn, "Warning:"));
		for (const warning of params.warnings) {
			params.runtime.log(`- ${warning.message}`);
			for (const detail of warning.details ?? []) params.runtime.log(`  ${detail}`);
		}
	}
	params.runtime.log("");
	params.runtime.log(colorize(params.rich, theme.heading, "Discovery (this machine)"));
	const discoveryDomains = params.wideAreaDomain ? `local. + ${params.wideAreaDomain}` : "local.";
	params.runtime.log(`Found ${params.discovery.length} ${params.discovery.length > 0 ? "gateway(s)" : "gateways"} via Bonjour (${discoveryDomains})`);
	if (params.discovery.length === 0) params.runtime.log(colorize(params.rich, theme.muted, "Tip: if the gateway is remote, mDNS won’t cross networks; use Wide-Area Bonjour (split DNS) or SSH tunnels."));
	params.runtime.log("");
	params.runtime.log(colorize(params.rich, theme.heading, "Targets"));
	for (const result of params.probed) {
		params.runtime.log(renderTargetHeader(result.target, params.rich));
		params.runtime.log(`  ${renderProbeSummaryLine(result.probe, params.rich)}`);
		if (result.target.tunnel?.kind === "ssh") params.runtime.log(`  ${colorize(params.rich, theme.muted, "ssh")}: ${colorize(params.rich, theme.command, result.target.tunnel.target)}`);
		if (result.probe.ok && result.self) {
			const host = result.self.host ?? "unknown";
			const ip = result.self.ip ? ` (${result.self.ip})` : "";
			const platform = result.self.platform ? ` · ${result.self.platform}` : "";
			const version = result.self.version ? ` · app ${result.self.version}` : "";
			params.runtime.log(`  ${colorize(params.rich, theme.info, "Gateway")}: ${host}${ip}${platform}${version}`);
		}
		if (result.configSummary) {
			const wideArea = result.configSummary.discovery.wideAreaEnabled === true ? "enabled" : result.configSummary.discovery.wideAreaEnabled === false ? "disabled" : "unknown";
			params.runtime.log(`  ${colorize(params.rich, theme.info, "Wide-area discovery")}: ${wideArea}`);
		}
		params.runtime.log("");
	}
	if (!ok) params.runtime.exit(1);
}
//#endregion
//#region src/commands/gateway-status/probe-run.ts
async function runGatewayStatusProbePass(params) {
	const discoveryPromise = discoverGatewayBeacons({
		timeoutMs: params.discoveryTimeoutMs,
		wideAreaDomain: params.wideAreaDomain
	});
	let sshTarget = params.sshTarget;
	let sshTunnelError = null;
	let sshTunnelStarted = false;
	const tryStartTunnel = async () => {
		if (!sshTarget) return null;
		if (params.signal?.aborted) {
			sshTunnelError = "Aborted";
			return null;
		}
		try {
			const { startSshPortForward } = await params.loadSshTunnelModule();
			const tunnel = await startSshPortForward({
				target: sshTarget,
				identity: params.sshIdentity ?? void 0,
				hostKeyPolicy: params.cfg.gateway?.remote?.sshHostKeyPolicy,
				localPortPreferred: params.remotePort,
				remotePort: params.remotePort,
				timeoutMs: Math.min(1500, params.overallTimeoutMs),
				signal: params.signal
			});
			sshTunnelStarted = true;
			return tunnel;
		} catch (err) {
			if (isAbortError(err)) {
				sshTunnelError = "Aborted";
				return null;
			}
			sshTunnelError = formatErrorMessage(err);
			return null;
		}
	};
	const discoveryTask = discoveryPromise.catch(() => []);
	const tunnelTask = sshTarget ? tryStartTunnel() : Promise.resolve(null);
	const [discovery, tunnelFirst] = await Promise.all([discoveryTask, tunnelTask]);
	if (!sshTarget && params.opts.sshAuto) {
		const { parseSshTarget } = await params.loadSshTunnelModule();
		sshTarget = pickAutoSshTargetFromDiscovery({
			discovery,
			parseSshTarget,
			sshUser: normalizeOptionalString(process.env.USER) ?? ""
		});
	}
	const tunnel = tunnelFirst || (sshTarget && !sshTunnelStarted && !sshTunnelError ? await tryStartTunnel() : null);
	const tunnelTarget = tunnel ? {
		id: "sshTunnel",
		kind: "sshTunnel",
		url: `ws://127.0.0.1:${tunnel.localPort}`,
		active: true,
		tunnel: {
			kind: "ssh",
			target: sshTarget ?? "",
			localPort: tunnel.localPort,
			remotePort: params.remotePort,
			pid: tunnel.pid
		}
	} : null;
	const targets = tunnelTarget ? [tunnelTarget, ...params.baseTargets.filter((target) => target.url !== tunnelTarget.url)] : params.baseTargets;
	try {
		return {
			discovery,
			probed: await Promise.all(targets.map(async (target) => {
				const authResolution = await resolveAuthForTarget(params.cfg, target, {
					token: readStringValue(params.opts.token),
					password: readStringValue(params.opts.password)
				});
				const probe = await probeGateway({
					url: target.url,
					config: params.cfg,
					configuredRemote: target.kind === "configRemote",
					...target.kind === "sshTunnel" ? {
						originScopedDeviceAuth: true,
						sshTunnel: {
							target: params.sshRouteTarget ?? sshTarget ?? "",
							remotePort: params.remotePort,
							...params.sshIdentity ? { identity: params.sshIdentity } : {}
						},
						preparedSshTunnel: tunnel ?? void 0
					} : target.kind !== "localLoopback" ? { originScopedDeviceAuth: true } : {},
					auth: {
						token: authResolution.token,
						password: authResolution.password
					},
					tlsFingerprint: target.kind === "localLoopback" && target.url.startsWith("wss://") ? params.localTlsFingerprint : void 0,
					timeoutMs: resolveProbeBudgetMs(params.overallTimeoutMs, target),
					signal: params.signal
				});
				return {
					target,
					probe,
					configSummary: probe.configSnapshot ? extractConfigSummary(probe.configSnapshot) : null,
					self: pickGatewaySelfPresence(probe.presence),
					authDiagnostics: authResolution.diagnostics ?? []
				};
			})),
			sshTarget,
			sshTunnelStarted,
			sshTunnelError
		};
	} finally {
		if (tunnel) try {
			await tunnel.stop();
		} catch {}
	}
}
//#endregion
//#region src/commands/gateway-status.ts
/** CLI entrypoint for `openclaw gateway probe`. */
const loadSshConfigModule = createLazyPromise(() => import("./ssh-config-D30jJRww.mjs"));
const loadSshTunnelModule = createLazyPromise(() => import("./ssh-tunnel-0JL9pPkS.mjs"));
const loadGatewayTlsModule = createLazyPromise(() => import("./gateway-C_8m90Qi.mjs"));
/** Resolves gateway status inputs, probes targets, then writes JSON or text output. */
async function gatewayStatusCommand(opts, runtime) {
	await ensureExplicitGatewayAuth({
		urlOverride: opts.url?.trim(),
		urlOverrideSource: "cli",
		explicitAuth: resolveExplicitGatewayAuth(opts),
		errorHint: "Fix: pass --token or --password with --url."
	});
	const startedAt = Date.now();
	const cfg = await readBestEffortConfig();
	const rich = isRich() && opts.json !== true;
	const overallTimeoutMs = parseTimeoutMsWithFallback(opts.timeout, 3e3, { invalidType: "error" });
	const portOverride = parseGatewayPortOption(opts.port);
	const wideAreaDomain = resolveWideAreaDiscoveryDomain({ configDomain: cfg.discovery?.wideArea?.domain });
	const baseTargets = resolveTargets(cfg, opts.url, portOverride);
	const network = buildNetworkHints(cfg, portOverride);
	const remotePort = portOverride ?? resolveGatewaySshRemotePort(cfg);
	const discoveryTimeoutMs = Math.min(1200, overallTimeoutMs);
	const hasExplicitUrl = typeof opts.url === "string" && opts.url.trim().length > 0;
	const useConfiguredRemoteTargets = portOverride === void 0 || hasExplicitUrl;
	let sshTarget = sanitizeSshTarget(opts.ssh) ?? (useConfiguredRemoteTargets ? sanitizeSshTarget(cfg.gateway?.remote?.sshTarget) : null);
	let sshIdentity = sanitizeSshTarget(opts.sshIdentity) ?? (useConfiguredRemoteTargets ? sanitizeSshTarget(cfg.gateway?.remote?.sshIdentity) : null);
	if (!sshTarget && useConfiguredRemoteTargets) sshTarget = inferSshTargetFromRemoteUrl(cfg.gateway?.remote?.url);
	const sshRouteTarget = sshTarget;
	if (sshTarget) {
		const resolved = await resolveSshTarget({
			rawTarget: sshTarget,
			identity: sshIdentity,
			overallTimeoutMs,
			loadSshConfigModule,
			loadSshTunnelModule
		});
		if (resolved) {
			sshTarget = resolved.target;
			if (!sshIdentity && resolved.identity) sshIdentity = resolved.identity;
		}
	}
	const localCertificate = cfg.gateway?.tls?.enabled === true ? await loadGatewayTlsModule().then(({ inspectGatewayTlsCertificate }) => inspectGatewayTlsCertificate(cfg.gateway?.tls)) : void 0;
	const controller = new AbortController();
	let abortSignal;
	const onSigInt = () => {
		if (!abortSignal) {
			abortSignal = "SIGINT";
			controller.abort();
		}
	};
	const onSigTerm = () => {
		if (!abortSignal) {
			abortSignal = "SIGTERM";
			controller.abort();
		}
	};
	process.on("SIGINT", onSigInt);
	process.on("SIGTERM", onSigTerm);
	const probePass = await (async () => {
		try {
			return await withProgress({
				label: "Inspecting gateways…",
				indeterminate: true,
				enabled: opts.json !== true
			}, async () => await runGatewayStatusProbePass({
				cfg,
				opts,
				overallTimeoutMs,
				discoveryTimeoutMs,
				wideAreaDomain,
				baseTargets,
				remotePort,
				sshTarget,
				sshRouteTarget,
				sshIdentity,
				loadSshTunnelModule,
				localTlsFingerprint: localCertificate?.ok ? localCertificate.value.fingerprintSha256 : void 0,
				signal: controller.signal
			}));
		} finally {
			process.off("SIGINT", onSigInt);
			process.off("SIGTERM", onSigTerm);
		}
	})();
	if (abortSignal) {
		runtime.exit(abortSignal === "SIGINT" ? 130 : 143);
		return;
	}
	const warnings = buildGatewayStatusWarnings({
		probed: probePass.probed,
		sshTarget: probePass.sshTarget,
		sshTunnelStarted: probePass.sshTunnelStarted,
		sshTunnelError: probePass.sshTunnelError,
		discoveryCount: probePass.discovery.length,
		localTlsLoadError: localCertificate && !localCertificate.ok ? localCertificate.error : null
	});
	const primary = pickPrimaryProbedTarget(probePass.probed);
	if (opts.json) {
		writeGatewayStatusJson({
			runtime,
			startedAt,
			overallTimeoutMs,
			discoveryTimeoutMs,
			network,
			discovery: probePass.discovery,
			probed: probePass.probed,
			warnings,
			primaryTargetId: primary?.target.id ?? null
		});
		return;
	}
	writeGatewayStatusText({
		runtime,
		rich,
		overallTimeoutMs,
		wideAreaDomain,
		discovery: probePass.discovery,
		probed: probePass.probed,
		warnings
	});
}
//#endregion
export { gatewayStatusCommand };
