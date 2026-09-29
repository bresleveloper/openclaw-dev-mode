import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-DspuXlEe.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { n as isGatewaySecretRefUnavailableError } from "./credentials-CyW929E5.mjs";
import { o as isLoopbackGatewayUrl } from "./net-DU4aWKLv.mjs";
import { a as buildGatewayProbeConnectionDetails, i as buildGatewayConnectionDetails, o as callGateway, p as isGatewayCredentialsRequiredError } from "./call-C_MP4_Gs.mjs";
import { n as GatewayProtocolRequestTimeoutError } from "./protocol-request-BMUN1re6.mjs";
import { r as DEFAULT_RESTART_HEALTH_TIMEOUT_MS } from "./restart-health.constants-BnbTHsGr.mjs";
import { c as readGatewayLastInstallationReplacement } from "./gateway-boot-lifecycle-DZNz5cof.mjs";
import { h as redactSecretDegradationReason, t as SECRET_DEGRADATION_RETRY_HINT } from "./runtime-degraded-state-DVMYGogL.mjs";
import { i as formatDurationSeconds } from "./format-duration-CeDWULoS.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import { t as probeGatewayStatus } from "./probe-CbOBoJaE.mjs";
import { i as inspectInstalledGatewayStatePaths, r as compareCliGatewayStateDirs, t as GATEWAY_SERVICE_PATHS_UNVERIFIED } from "./state-dir-gateway-check-B7djfEVq.mjs";
import { t as waitForGatewayDiagnostic } from "./gateway-diagnostic-readiness-CLD5f6AN.mjs";
import { t as collectChannelStatusIssues } from "./channels-status-issues-YkUebnBD.mjs";
import { i as formatHealthCheckFailure, n as formatGatewayClosedDiagnostic } from "./health-format-dbbKwHdv.mjs";
import { c as gatewayConnectErrorWasRateLimited, i as GATEWAY_HEALTH_RATE_LIMITED_TITLE, l as gatewayProbeResultSawGateway, n as GATEWAY_HEALTH_CREDENTIALS_REQUIRED_TITLE, r as GATEWAY_HEALTH_RATE_LIMITED_MESSAGE, t as GATEWAY_HEALTH_CREDENTIALS_REQUIRED_MESSAGE, u as gatewayProbeResultWasRateLimited } from "./gateway-health-auth-diagnostic-m-h-zwWu.mjs";
import { t as hasActiveGatewayExecCredential } from "./doctor-gateway-exec-credential-B1VJk7ba.mjs";
import { t as formatSqliteWalHealthWarning } from "./sqlite-wal-health-C1o54iaE.mjs";
import { t as formatTelemetryExporterSummary } from "./telemetry-exporter-summary-Cg5uJuLi.mjs";
//#region src/commands/doctor-secret-runtime-degradation.ts
const DOCTOR_SECRET_OWNER_ID_MAX_CHARS = 96;
const DOCTOR_SECRET_OWNER_PATH_MAX_CHARS = 120;
const DOCTOR_SECRET_OWNER_VISIBLE_PATHS = 3;
function safeDoctorSecretOwnerText(value, maxChars) {
	const safe = sanitizeTerminalText(redactSensitiveUrlLikeString(value));
	return safe.length <= maxChars ? safe : `${truncateUtf16Safe(safe, maxChars - 1)}…`;
}
/** Projects Gateway-owned secret degradation into the shared bounded Doctor display shape. */
function projectDoctorSecretRuntimeDegradations(status) {
	const findings = (status.degradedSecretOwners ?? []).map((owner) => {
		const ownerId = safeDoctorSecretOwnerText(owner.ownerId, DOCTOR_SECRET_OWNER_ID_MAX_CHARS);
		const target = `${owner.ownerKind}:${ownerId}`;
		const visiblePaths = owner.paths.slice(0, DOCTOR_SECRET_OWNER_VISIBLE_PATHS).map((configPath) => safeDoctorSecretOwnerText(configPath, DOCTOR_SECRET_OWNER_PATH_MAX_CHARS));
		const omittedPaths = owner.paths.length - visiblePaths.length;
		const paths = visiblePaths.join(", ") + (omittedPaths > 0 ? ` (+${omittedPaths} paths omitted)` : "");
		return {
			message: `${owner.degradationState ?? "cold"} ${target} (${paths || "no affected paths reported"}): ${redactSecretDegradationReason(owner.reason)}`,
			path: visiblePaths[0] ?? "gateway",
			target,
			retryHint: SECRET_DEGRADATION_RETRY_HINT
		};
	});
	if (status.secretEgressProxy?.state !== "degraded") return findings;
	return [...findings, {
		message: "Secret egress proxy: " + safeDoctorSecretOwnerText(status.secretEgressProxy.message ?? "TLS certificate preparation unavailable. Check Gateway logs.", 512),
		path: "secrets.egressProxy.enabled",
		target: "capability:secret-egress-proxy",
		retryHint: "Correct the reported certificate or clock problem before retrying the request."
	}];
}
//#endregion
//#region src/commands/doctor-gateway-health.ts
/** Gateway health probes used by doctor before deeper daemon and memory diagnostics. */
function formatGatewayHealthDiagnostic(value) {
	const raw = value instanceof Error ? value.message : String(value);
	return scrubDoctorErrorMessage(sanitizeTerminalText(redactSensitiveUrlLikeString(raw)));
}
function readLocalInstallationReplacement(cfg, env) {
	const replacement = cfg.gateway?.mode === "remote" ? void 0 : readGatewayLastInstallationReplacement(env);
	return replacement ? `Previous installation replacement (${new Date(replacement.completedAtMs).toISOString()}): ${formatGatewayHealthDiagnostic(replacement.reason)}` : void 0;
}
async function collectGatewayHealthFindings(ctx) {
	const mode = ctx.cfg.gateway?.mode === "remote" ? "remote" : "local";
	const gatewayPath = mode === "remote" ? "gateway.remote.url" : "gateway.mode";
	const replacement = readLocalInstallationReplacement(ctx.cfg, ctx.env);
	const historyFindings = replacement ? [{
		checkId: "core/doctor/gateway-health",
		severity: "info",
		message: replacement,
		path: "gateway.mode"
	}] : [];
	let probeDetails;
	const warning = (message, fixHint) => ({
		checkId: "core/doctor/gateway-health",
		severity: "warning",
		message,
		path: probeDetails || mode === "remote" ? gatewayPath : "gateway",
		...probeDetails ? { target: formatGatewayHealthDiagnostic(probeDetails.url) } : {},
		fixHint
	});
	try {
		probeDetails = await buildGatewayProbeConnectionDetails({
			config: ctx.cfg,
			configPath: ctx.configPath
		});
		if (ctx.allowExecSecretRefs !== true && await hasActiveGatewayExecCredential({
			cfg: ctx.cfg,
			env: ctx.env,
			targetUrl: probeDetails.url
		})) return [...historyFindings, warning("Authenticated Gateway health inspection was intentionally skipped because an active credential uses an exec SecretRef.", "Rerun `openclaw doctor --lint --only core/doctor/gateway-health --allow-exec` to permit configured secret execution.")];
		const status = await callGateway({
			method: "status",
			params: { includeChannelSummary: false },
			timeoutMs: 3e3,
			sharedStateMode: "read-only",
			config: ctx.cfg,
			configPath: ctx.configPath,
			tlsFingerprint: probeDetails.tlsFingerprint,
			preauthHandshakeTimeoutMs: probeDetails.preauthHandshakeTimeoutMs
		});
		const findings = projectDoctorSecretRuntimeDegradations(status).map((owner) => ({
			checkId: "core/doctor/gateway-health",
			severity: "warning",
			message: `Secret runtime degradation: ${owner.message}`,
			path: owner.path,
			target: owner.target,
			fixHint: `Retry: ${owner.retryHint}`
		}));
		const sqliteWalWarning = formatSqliteWalHealthWarning(status.sqliteWal);
		if (sqliteWalWarning) findings.push(warning(`SQLite WAL: ${sqliteWalWarning}`, "Inspect openclaw status --deep output."));
		if (status.installationReplacementWarning) findings.push(warning(formatGatewayHealthDiagnostic(status.installationReplacementWarning), "Wait for the service manager to restart the Gateway; for a foreground Gateway, run `openclaw gateway run` again after it exits."));
		return [...historyFindings, ...findings];
	} catch (error) {
		if (!probeDetails) return [...historyFindings, warning(`Gateway health inspection could not be prepared: ${formatGatewayHealthDiagnostic(error)}`, "Fix Gateway connection configuration, then rerun `openclaw doctor --lint --only core/doctor/gateway-health`.")];
		const diagnostic = gatewayConnectErrorWasRateLimited(error) ? {
			message: GATEWAY_HEALTH_RATE_LIMITED_MESSAGE,
			fixHint: "Wait for the temporary authentication lockout to expire, then rerun doctor."
		} : isGatewayCredentialsRequiredError(error) || isGatewaySecretRefUnavailableError(error) ? {
			message: "Gateway status could not be inspected because this CLI has no usable token/password or paired device token for read-scope RPCs.",
			fixHint: "Configure the Gateway token/password or pair this device, then rerun the selected health check."
		} : {
			message: `Gateway status could not be inspected: ${formatGatewayHealthDiagnostic(error)}`,
			fixHint: mode === "remote" ? "Verify the remote Gateway URL, network path, TLS settings, and credentials." : "Inspect the service with `openclaw gateway status --deep`, or run `openclaw doctor` for guided checks."
		};
		return [...historyFindings, warning(diagnostic.message, diagnostic.fixHint)];
	}
}
function isGatewayCallTimeout(message) {
	return /^gateway timeout after \d+ms(?:\n|$)/.test(message);
}
function resolveGatewayDiagnosticsTimeouts(timeoutMs, statusElapsedMs) {
	const transportMs = Math.ceil(statusElapsedMs) + 1e3;
	const diagnosticsTimeoutMs = Math.min(3e4, Math.max(timeoutMs, 5e3 + transportMs, Math.ceil(statusElapsedMs * 3)));
	return {
		diagnosticsTimeoutMs,
		channelProbeTimeoutMs: Math.max(1, diagnosticsTimeoutMs - transportMs)
	};
}
function isGatewayHealthAuthUnavailableError(error) {
	return isGatewayCredentialsRequiredError(error) || isGatewaySecretRefUnavailableError(error);
}
function noteCliGatewayVersionSkew(status) {
	const gatewayVersion = status?.runtimeVersion?.trim();
	if (!gatewayVersion || gatewayVersion === VERSION) return;
	note([
		`This command is OpenClaw ${VERSION}; the running Gateway is OpenClaw ${gatewayVersion}.`,
		"Check `openclaw --version`, `which openclaw`, and `openclaw gateway status --deep`.",
		"If this mismatch is unexpected, update PATH so `openclaw` points to the version you want, or reinstall the Gateway service from that same OpenClaw install."
	].join("\n"), "OpenClaw version mismatch");
}
function noteGatewayStateDirectory(snapshot, source) {
	if (!snapshot.stateDir) return;
	const comparison = compareCliGatewayStateDirs({
		cliStateDir: resolveStateDir(process.env),
		cliConfigPath: resolveConfigPath(process.env),
		gatewayStateDir: snapshot.stateDir,
		gatewayConfigPath: snapshot.configPath,
		source,
		mode: "warn"
	});
	if (comparison.kind === "warn") note(`${comparison.message}\nRun plugin inspection and doctor --fix with the Gateway's OPENCLAW_STATE_DIR and OPENCLAW_CONFIG_PATH. To change the managed service, run \`openclaw gateway install --force\` from the intended profile and review operator-owned service overrides.`, "Gateway state directory mismatch");
}
async function noteInstalledGatewayStateDirectory(cfg, timeoutMs) {
	if (cfg.gateway?.mode === "remote") return;
	try {
		if (!isLoopbackGatewayUrl(buildGatewayConnectionDetails({ config: cfg }).url)) return;
		const paths = await inspectInstalledGatewayStatePaths(Math.min(timeoutMs, 3e3));
		if (paths.kind === "known") noteGatewayStateDirectory(paths, "installed Gateway service");
		else if (paths.kind === "unknown") note(GATEWAY_SERVICE_PATHS_UNVERIFIED, "Gateway state directory");
	} catch {
		note(GATEWAY_SERVICE_PATHS_UNVERIFIED, "Gateway state directory");
	}
}
/**
* Probes gateway status and reports user-facing connection/auth/channel warnings.
*
* A credentials-required gateway still counts as healthy but unauthenticated when the preauth
* probe confirms the server is reachable.
*/
async function checkGatewayHealth(params) {
	const replacement = readLocalInstallationReplacement(params.cfg);
	if (replacement) note(replacement, "Previous Gateway installation replacement");
	const { bindAgentToolGatewayRequest } = await import("./in-process-gateway-CSMvBDM8.mjs");
	const requestGateway = bindAgentToolGatewayRequest({ hostedOnly: true });
	const timeoutMs = typeof params.timeoutMs === "number" && params.timeoutMs > 0 ? params.timeoutMs : DEFAULT_RESTART_HEALTH_TIMEOUT_MS;
	let healthOk = false;
	let status;
	let gatewaySnapshot;
	try {
		const remainingMs = await waitForGatewayDiagnostic({
			config: params.cfg,
			timeoutMs
		}, params.runtime);
		if (remainingMs === void 0) return {
			healthOk: true,
			authenticated: false
		};
		const statusStartedAt = performance.now();
		status = await callGateway({
			method: "status",
			params: { includeChannelSummary: false },
			timeoutMs: remainingMs,
			config: params.cfg,
			onHelloOk: ({ snapshot }) => {
				gatewaySnapshot = snapshot;
				noteGatewayStateDirectory(snapshot, "live Gateway");
			}
		});
		const statusElapsedMs = performance.now() - statusStartedAt;
		const { diagnosticsTimeoutMs, channelProbeTimeoutMs } = resolveGatewayDiagnosticsTimeouts(timeoutMs, statusElapsedMs);
		const slowDiagnosticNote = (diagnostic) => `Gateway answered status in ${formatDurationSeconds(statusElapsedMs)}; ${diagnostic} diagnostics did not finish within ${formatDurationSeconds(diagnosticsTimeoutMs)}. The host may be slow; this does not mark the Gateway unhealthy.`;
		healthOk = true;
		noteCliGatewayVersionSkew(status);
		if (status.startupMigrationWarning) note(sanitizeTerminalText(status.startupMigrationWarning), "Startup migration warnings");
		const sqliteWalWarning = formatSqliteWalHealthWarning(status.sqliteWal);
		if (sqliteWalWarning) note(sqliteWalWarning, "SQLite WAL");
		if (status.startupRecoveryWarning) note(sanitizeTerminalText(status.startupRecoveryWarning), "Startup session recovery");
		if (status.installationReplacementWarning) note(sanitizeTerminalText(status.installationReplacementWarning), "Installation replaced");
		const secretDegradations = projectDoctorSecretRuntimeDegradations(status);
		if (secretDegradations.length > 0) note(secretDegradations.map((owner) => `- ${owner.message}\n  Retry: ${owner.retryHint}`).join("\n"), "Secret runtime degradation");
		if (status.degradedPlugins && status.degradedPlugins.length > 0) note(status.degradedPlugins.map((plugin) => `- ${plugin.pluginId} (${plugin.diagnostic.reason}): ${plugin.diagnostic.detail}`).join("\n"), "Plugins configured unavailable");
		const [channelsResult, exporterResult] = await Promise.allSettled([callGateway({
			method: "channels.status",
			params: {
				probe: true,
				timeoutMs: channelProbeTimeoutMs
			},
			timeoutMs: diagnosticsTimeoutMs,
			config: params.cfg
		}), requestGateway({
			method: "diagnostics.stability",
			params: {
				type: "telemetry.exporter",
				limit: 1e3
			},
			timeoutMs: diagnosticsTimeoutMs,
			config: params.cfg
		})]);
		if (channelsResult.status === "fulfilled") {
			const issues = collectChannelStatusIssues(channelsResult.value);
			if (issues.length > 0) note(issues.map((issue) => `- ${issue.channel} ${issue.accountId}: ${issue.message}${issue.fix ? ` (${issue.fix})` : ""}`).join("\n"), "Channel warnings");
		} else note([isGatewayCallTimeout(formatErrorMessage(channelsResult.reason)) ? slowDiagnosticNote("channel") : `Channel status probe failed: ${sanitizeTerminalText(formatErrorMessage(channelsResult.reason))}`, `Retry: ${formatCliCommand("openclaw channels status --probe")}`].join("\n"), "Channel warnings");
		if (exporterResult.status === "fulfilled") {
			const exporterSummary = formatTelemetryExporterSummary(exporterResult.value);
			if (exporterSummary) note(exporterSummary.lines.join("\n"), exporterSummary.title);
		} else note([exporterResult.reason instanceof GatewayProtocolRequestTimeoutError || isGatewayCallTimeout(formatErrorMessage(exporterResult.reason)) ? slowDiagnosticNote("exporter") : `Exporter diagnostics failed: ${sanitizeTerminalText(formatErrorMessage(exporterResult.reason))}`, `Retry: ${formatCliCommand("openclaw gateway stability --type telemetry.exporter")}`].join("\n"), "Telemetry exporters");
		return {
			healthOk,
			authenticated: true,
			status
		};
	} catch (err) {
		if (!gatewaySnapshot?.stateDir) await noteInstalledGatewayStateDirectory(params.cfg, timeoutMs);
		if (gatewayConnectErrorWasRateLimited(err)) {
			note(GATEWAY_HEALTH_RATE_LIMITED_MESSAGE, GATEWAY_HEALTH_RATE_LIMITED_TITLE);
			return {
				healthOk: true,
				authenticated: false
			};
		}
		if (isGatewayHealthAuthUnavailableError(err)) {
			const probeDetails = await buildGatewayProbeConnectionDetails({ config: params.cfg });
			const probe = await probeGatewayStatus({
				url: probeDetails.url,
				timeoutMs,
				tlsFingerprint: probeDetails.tlsFingerprint,
				preauthHandshakeTimeoutMs: probeDetails.preauthHandshakeTimeoutMs,
				config: params.cfg,
				json: true
			});
			if (gatewayProbeResultSawGateway(probe)) {
				if (gatewayProbeResultWasRateLimited(probe)) note(GATEWAY_HEALTH_RATE_LIMITED_MESSAGE, GATEWAY_HEALTH_RATE_LIMITED_TITLE);
				else note(GATEWAY_HEALTH_CREDENTIALS_REQUIRED_MESSAGE, GATEWAY_HEALTH_CREDENTIALS_REQUIRED_TITLE);
				healthOk = true;
				return {
					healthOk,
					authenticated: false
				};
			}
		}
		const closedDiagnostic = formatGatewayClosedDiagnostic(err);
		if (closedDiagnostic) {
			const gatewayDetails = buildGatewayConnectionDetails({ config: params.cfg });
			note(closedDiagnostic, "Gateway");
			note(gatewayDetails.message, "Gateway connection");
		} else params.runtime.error(formatHealthCheckFailure(err));
	}
	return {
		healthOk,
		authenticated: false,
		status
	};
}
/** Probes gateway memory readiness without forcing deep embedding checks. */
async function probeGatewayMemoryStatus(params) {
	const { bindAgentToolGatewayRequest } = await import("./in-process-gateway-CSMvBDM8.mjs");
	const requestGateway = bindAgentToolGatewayRequest({ hostedOnly: true });
	const timeoutMs = typeof params.timeoutMs === "number" && params.timeoutMs > 0 ? params.timeoutMs : 8e3;
	try {
		const payload = await requestGateway({
			method: "doctor.memory.status",
			params: { probe: false },
			timeoutMs,
			config: params.cfg
		});
		const gatewayChecked = payload.embedding.checked !== false;
		return {
			checked: gatewayChecked,
			ready: payload.embedding.ok,
			error: payload.embedding.error,
			...payload.embeddingRuntime ? { runtimeFacts: payload.embeddingRuntime } : {},
			skipped: !gatewayChecked
		};
	} catch (err) {
		const message = formatErrorMessage(err);
		if (isGatewayCallTimeout(message)) return {
			checked: false,
			ready: false,
			error: `gateway memory probe timed out: ${message}`,
			skipped: false
		};
		return {
			checked: true,
			ready: false,
			error: `gateway memory probe unavailable: ${message}`,
			skipped: false
		};
	}
}
//#endregion
export { checkGatewayHealth, collectGatewayHealthFindings, probeGatewayMemoryStatus };
