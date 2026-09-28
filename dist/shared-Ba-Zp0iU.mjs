import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { l as resolveGatewayLaunchAgentLabel, m as resolveGatewayWindowsTaskName, p as resolveGatewaySystemdServiceName } from "./constants-CJCmIHb-.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { x as resolveIsNixMode } from "./paths-DehQwyE0.mjs";
import { s as resolveGatewayServiceMutationError } from "./gateway-supervision-dG8swyHC.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { n as hasSudoToRootSystemdUserManagerMismatch, u as classifySystemdUnavailableDetail } from "./systemd-user-transport-ZcY1z7CT.mjs";
import { n as currentGatewayServiceRebindReceipt } from "./service-rebind-CZ92-EFp.mjs";
import { t as parsePort } from "./parse-port-BGoDUr--.mjs";
import { c as resolveDaemonContainerContext, o as isSystemdUnavailableDetail, r as buildPlatformServiceStartHints, s as renderSystemdUnavailableHints } from "./runtime-hints-DEzqKgi3.mjs";
import { t as isWSL } from "./wsl-BqZ6SFne.mjs";
import { Writable } from "node:stream";
//#region src/cli/daemon-cli/response.ts
function emitDaemonActionJson(payload) {
	const rebind = currentGatewayServiceRebindReceipt();
	defaultRuntime.writeJson({
		...payload,
		...rebind ? { rebind } : {}
	});
}
function classifyDaemonHintText(text) {
	if (/\b(gateway|node) install\b/u.test(text) || text.startsWith("Service not installed. Run:")) return "install";
	if (text.startsWith("Restart the container or the service that manages it for ")) return "container-restart";
	if (text.startsWith("systemd user services are unavailable;")) return "systemd-unavailable";
	if (text.startsWith("On a headless server (SSH/no desktop session):") || text.startsWith("Also ensure XDG_RUNTIME_DIR is set:")) return "systemd-headless";
	if (text.startsWith("If you're in a container, run the gateway in the foreground instead of")) return "container-foreground";
	if (text.startsWith("WSL2 needs systemd enabled:") || text.startsWith("Then run: wsl --shutdown") || text.startsWith("Verify: systemctl --user status")) return "wsl-systemd";
	return "generic";
}
/** Classify plain-text hints for JSON daemon responses. */
function buildDaemonHintItems(hints) {
	if (!hints?.length) return;
	return hints.map((text) => ({
		kind: classifyDaemonHintText(text),
		text
	}));
}
/** Build the service metadata snapshot embedded in JSON action responses. */
function buildDaemonServiceSnapshot(service, loaded) {
	return {
		label: service.label,
		loaded,
		loadedText: service.loadedText,
		notLoadedText: service.notLoadedText
	};
}
/** Emit the no-op success returned when a service is already running. */
function emitDaemonAlreadyRunning(params) {
	const message = params.pid === void 0 ? `${params.serviceNoun} service already running.` : `${params.serviceNoun} service already running (pid ${params.pid}).`;
	params.emitMessage({
		ok: true,
		result: "already-running",
		message,
		service: buildDaemonServiceSnapshot(params.service, true),
		warnings: params.warnings.length ? params.warnings : void 0
	});
}
/** Emit a service-manager restart that has been accepted but not completed. */
function emitDaemonScheduledRestart(params) {
	params.emitMessage({
		ok: true,
		result: params.result,
		message: params.message,
		service: buildDaemonServiceSnapshot(params.service, params.loaded),
		warnings: params.warnings.length ? params.warnings : void 0
	});
	return true;
}
/** Writable sink used when JSON output should suppress service command stdout. */
function createNullWriter() {
	return new Writable({ write(_chunk, _encoding, callback) {
		callback();
	} });
}
/** Create stdout/warning/emit/fail helpers for one daemon lifecycle action. */
function createDaemonActionContext(params) {
	const warnings = [];
	const stdout = params.json ? createNullWriter() : process.stdout;
	const emit = (payload) => {
		if (!params.json) return;
		const definitionBackup = params.definitionBackup?.();
		emitDaemonActionJson({
			action: params.action,
			...definitionBackup ? { definitionBackup } : {},
			...payload,
			hintItems: payload.hintItems ?? buildDaemonHintItems(payload.hints),
			warnings: payload.warnings ?? (warnings.length ? warnings : void 0)
		});
	};
	const emitMessage = (payload) => {
		emit(payload);
		if (!params.json && payload.message) defaultRuntime.log(payload.message);
	};
	const fail = (message, hints, result) => {
		if (params.json) emit({
			ok: false,
			error: message,
			hints,
			...result ? { result } : {}
		});
		else {
			defaultRuntime.error(message);
			if (hints?.length) for (const hint of hints) defaultRuntime.log(`Tip: ${hint}`);
		}
		defaultRuntime.exit(result === "still-starting" ? 2 : 1);
	};
	return {
		stdout,
		warnings,
		emit,
		emitMessage,
		fail
	};
}
async function buildInstallFailureHints(error) {
	const detail = String(error);
	if (process.platform !== "linux" || !isSystemdUnavailableDetail(detail)) return;
	return renderSystemdUnavailableHints({
		wsl: await isWSL(),
		kind: classifySystemdUnavailableDetail(detail)
	});
}
/** Install a service, convert platform install failures to hints, and emit the final response. */
async function installDaemonServiceAndEmit(params) {
	try {
		await params.install();
	} catch (err) {
		params.fail(`${params.serviceNoun} install failed: ${String(err)}`, await buildInstallFailureHints(err));
		return;
	}
	let installed;
	try {
		installed = await params.service.isLoaded({ env: process.env });
	} catch (err) {
		params.fail(`${params.serviceNoun} install verification failed: ${String(err)}`, await buildInstallFailureHints(err));
		return;
	}
	if (!installed) {
		params.fail(`${params.serviceNoun} install verification failed: service is not ${params.service.loadedText}.`);
		return;
	}
	if (params.onVerified) try {
		await params.onVerified();
	} catch (err) {
		params.fail(`${params.serviceNoun} post-install check failed: ${String(err)}`);
		return;
	}
	params.emit({
		ok: true,
		result: "installed",
		...params.successMessage ? { message: params.successMessage } : {},
		service: buildDaemonServiceSnapshot(params.service, installed),
		warnings: params.warnings.length ? params.warnings : void 0
	});
}
//#endregion
//#region src/cli/daemon-cli/shared.ts
/** Create install action context with JSON flag normalization. */
function createDaemonInstallActionContext(jsonFlag, definitionBackup) {
	const json = Boolean(jsonFlag);
	const context = createDaemonActionContext({
		action: "install",
		json,
		definitionBackup
	});
	return {
		json,
		...context,
		warn: (message) => {
			if (json) context.warnings.push(message);
			else defaultRuntime.log(message);
		}
	};
}
/** Resolve installation refusal before service or state inspection. */
function resolveDaemonInstallBlockMessage(service, env = process.env) {
	if (resolveIsNixMode(env)) return "Nix mode detected; service install is disabled.";
	if (service === "node") return;
	const mutationError = resolveGatewayServiceMutationError("install or rewrite the gateway service", env);
	if (mutationError) return `Gateway install blocked: ${String(mutationError)}`;
	if (process.platform === "linux" && hasSudoToRootSystemdUserManagerMismatch(env)) return "Gateway install blocked: Refusing a sudo-to-root systemd user-service install because OpenClaw state and service files would belong to root while systemctl targets the invoking user's manager. Rerun the same command without sudo. If [unsafe-permissions] blocked the non-sudo command, repair the reported directory with `chmod go-w <path>` and retry; do not use sudo or --force to bypass it. See https://docs.openclaw.ai/cli/gateway#install-identity.";
}
function formatDaemonServiceInstallCommand(env, port) {
	const servicePort = port ?? parsePort(env.OPENCLAW_GATEWAY_PORT);
	return formatCliCommand(`openclaw gateway install --force${servicePort ? ` --port ${servicePort}` : ""}`, env);
}
function resolveDaemonServiceInstallGuidance(targetRole, env = process.env, service) {
	if (targetRole === "diagnostic-only") return;
	return resolveDaemonInstallBlockMessage("gateway", env) ?? (service?.stopped ? `Stopped service definitions are preserved; run \`${formatDaemonServiceInstallCommand(env, service.port)}\` from the active CLI. Installation may start the service.` : `Run \`${formatCliCommand("openclaw doctor --fix", env)}\` or \`${formatDaemonServiceInstallCommand(env, service?.port)}\` from the active CLI.`);
}
function formatGatewayServiceInstallationDrift(drift, targetRole, env = process.env, service) {
	const { serviceRoot, serviceVersion, activeRoot, activeVersion } = drift;
	const facts = `Gateway service targets a different OpenClaw install: ${serviceRoot} (${serviceVersion ?? "version unknown"}); active CLI: ${activeRoot} (${activeVersion ?? "version unknown"}).`;
	const guidance = resolveDaemonServiceInstallGuidance(targetRole, env, service);
	return guidance ? `${facts} ${guidance}` : facts;
}
/** Build terminal style helpers for status output with no-color fallback. */
function createCliStatusTextStyles() {
	const rich = isRich();
	return {
		rich,
		label: (value) => colorize(rich, theme.muted, value),
		accent: (value) => colorize(rich, theme.accent, value),
		infoText: (value) => colorize(rich, theme.info, value),
		okText: (value) => colorize(rich, theme.success, value),
		warnText: (value) => colorize(rich, theme.warn, value),
		errorText: (value) => colorize(rich, theme.error, value)
	};
}
/** Pick the color function for a runtime status label. */
function resolveRuntimeStatusColor(status) {
	const runtimeStatus = status ?? "unknown";
	return runtimeStatus === "running" ? theme.success : runtimeStatus === "stopped" ? theme.error : runtimeStatus === "unknown" ? theme.muted : theme.warn;
}
/** Pick the best local probe host for a configured Gateway bind mode. */
function pickProbeHostForBind(bindMode, tailnetIPv4, customBindHost) {
	if (bindMode === "custom" && customBindHost?.trim()) return customBindHost.trim();
	if (bindMode === "tailnet") return tailnetIPv4 ?? "127.0.0.1";
	return "127.0.0.1";
}
const SAFE_DAEMON_ENV_KEYS = [
	"OPENCLAW_PROFILE",
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_GATEWAY_PORT",
	"OPENCLAW_CONFIG_READONLY",
	"OPENCLAW_NIX_MODE"
];
/** Keep only daemon env keys safe to print in diagnostics. */
function filterDaemonEnv(env) {
	if (!env) return {};
	const filtered = {};
	for (const key of SAFE_DAEMON_ENV_KEYS) {
		const value = env[key];
		if (!value?.trim()) continue;
		filtered[key] = value.trim();
	}
	return filtered;
}
function projectDaemonServiceForJson(service, { includeDefinitionPaths }) {
	const command = service.command;
	if (!command) return service;
	const environment = filterDaemonEnv(command.environment);
	const publicCommand = {
		...command,
		environment: Object.keys(environment).length > 0 ? environment : void 0
	};
	delete publicCommand.managedDefinition;
	delete publicCommand.managedOverrides;
	if (!includeDefinitionPaths) delete publicCommand.definitionPaths;
	return {
		...service,
		command: publicCommand
	};
}
/** Format safe daemon env entries for status output. */
function safeDaemonEnv(env) {
	const filtered = filterDaemonEnv(env);
	return Object.entries(filtered).map(([key, value]) => `${key}=${value}`);
}
/** Normalize listener address strings from platform socket tools. */
function normalizeListenerAddress(raw) {
	let value = raw.trim();
	if (!value) return value;
	value = value.replace(/^TCP\s+/i, "");
	value = value.replace(/\s+\(LISTEN\)\s*$/i, "");
	return value.trim();
}
/** Render install/start hints for the current service platform/container context. */
function renderGatewayServiceStartHints(env = process.env) {
	const container = resolveDaemonContainerContext(env);
	if (container) return [`Restart the container or the service that manages it for ${container}.`];
	const profile = env.OPENCLAW_PROFILE;
	const installHint = resolveDaemonInstallBlockMessage("gateway", env) ?? formatCliCommand("openclaw gateway install", env);
	return buildPlatformServiceStartHints({
		installHint,
		startCommand: formatCliCommand("openclaw gateway start", env),
		launchAgentPlistPath: `~/Library/LaunchAgents/${resolveGatewayLaunchAgentLabel(profile)}.plist`,
		systemdServiceName: resolveGatewaySystemdServiceName(profile),
		windowsTaskName: resolveGatewayWindowsTaskName(profile)
	});
}
/** Drop generic systemd hints when a container-specific hint is clearer. */
function filterContainerGenericHints(hints, env = process.env) {
	if (!resolveDaemonContainerContext(env)) return hints;
	return hints.filter((hint) => !hint.includes("If you're in a container, run the gateway in the foreground instead of") && !hint.includes("systemd user services are unavailable; install/enable systemd"));
}
//#endregion
export { emitDaemonAlreadyRunning as _, formatGatewayServiceInstallationDrift as a, projectDaemonServiceForJson as c, resolveDaemonServiceInstallGuidance as d, resolveRuntimeStatusColor as f, createNullWriter as g, createDaemonActionContext as h, formatDaemonServiceInstallCommand as i, renderGatewayServiceStartHints as l, buildDaemonServiceSnapshot as m, createDaemonInstallActionContext as n, normalizeListenerAddress as o, safeDaemonEnv as p, filterContainerGenericHints as r, pickProbeHostForBind as s, createCliStatusTextStyles as t, resolveDaemonInstallBlockMessage as u, emitDaemonScheduledRestart as v, installDaemonServiceAndEmit as y };
