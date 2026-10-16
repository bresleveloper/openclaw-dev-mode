import { g as resolveGatewayWindowsTaskName, m as resolveGatewaySystemdServiceName, u as resolveGatewayLaunchAgentLabel } from "./constants-BLghGsId.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as parseTcpPort } from "./tcp-port-8uSpDbMY.mjs";
import { C as resolveIsNixMode } from "./paths-DGIwWbpu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { c as resolveDaemonContainerContext, i as renderSystemdUnavailableHints, r as isSystemdUnavailableDetail, s as buildPlatformServiceStartHints } from "./runtime-format-C0Herh-B.mjs";
import { n as hasSudoToRootSystemdUserManagerMismatch, o as classifySystemdUnavailableDetail } from "./systemd-user-transport-vKPIfcG5.mjs";
import { s as resolveGatewayServiceMutationError } from "./gateway-supervision-CUdBruRD.mjs";
import { n as currentGatewayServiceRebindReceipt } from "./service-rebind-CQbm-oeP.mjs";
import { t as isWSL } from "./wsl-DAucJ7y0.mjs";
import { t as createNullWriter } from "./null-writer-Bd3sgUAj.mjs";
//#region src/cli/daemon-cli/response.ts
function classifyDaemonHintText(text) {
	if (/\b(gateway|node) install\b/u.test(text) || text.startsWith("Service not installed. Run:")) return "install";
	if (text.startsWith("Restart the container or the service that manages it for ")) return "container-restart";
	if (text.startsWith("systemd user services are unavailable;")) return "systemd-unavailable";
	if (text.startsWith("On a headless server (SSH/no desktop session):") || text.startsWith("Also ensure XDG_RUNTIME_DIR is set:")) return "systemd-headless";
	if (text.startsWith("If you're in a container, run the gateway in the foreground instead of")) return "container-foreground";
	if (text.startsWith("WSL2 needs systemd enabled:") || text.startsWith("Then run: wsl --shutdown") || text.startsWith("Verify: systemctl --user status")) return "wsl-systemd";
	return "generic";
}
function buildDaemonServiceSnapshot(service, loaded) {
	return {
		label: service.label,
		loaded,
		loadedText: service.loadedText,
		notLoadedText: service.notLoadedText
	};
}
function createDaemonActionContext(params) {
	const warnings = [];
	const stdout = params.json ? createNullWriter() : process.stdout;
	const emit = (payload) => {
		if (!params.json) return;
		const definitionBackup = params.definitionBackup?.();
		const payloadWithContext = {
			action: params.action,
			...definitionBackup ? { definitionBackup } : {},
			...payload,
			hintItems: payload.hintItems ?? (payload.hints?.length ? payload.hints.map((text) => ({
				kind: classifyDaemonHintText(text),
				text
			})) : void 0),
			warnings: payload.warnings ?? (warnings.length ? warnings : void 0)
		};
		const rebind = currentGatewayServiceRebindReceipt();
		defaultRuntime.writeJson({
			...payloadWithContext,
			...rebind ? { rebind } : {}
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
	const servicePort = port ?? parseTcpPort(env.OPENCLAW_GATEWAY_PORT);
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
function resolveRuntimeStatusColor(status) {
	const runtimeStatus = status ?? "unknown";
	return runtimeStatus === "running" ? theme.success : runtimeStatus === "stopped" ? theme.error : runtimeStatus === "unknown" ? theme.muted : theme.warn;
}
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
function safeDaemonEnv(env) {
	return Object.entries(filterDaemonEnv(env)).map(([key, value]) => `${key}=${value}`);
}
function normalizeListenerAddress(raw) {
	return raw.trim().replace(/^TCP\s+/i, "").replace(/\s+\(LISTEN\)\s*$/i, "").trim();
}
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
function filterContainerGenericHints(hints, env = process.env) {
	if (!resolveDaemonContainerContext(env)) return hints;
	return hints.filter((hint) => !hint.includes("If you're in a container, run the gateway in the foreground instead of") && !hint.includes("systemd user services are unavailable; install/enable systemd"));
}
//#endregion
export { formatGatewayServiceInstallationDrift as a, projectDaemonServiceForJson as c, resolveDaemonServiceInstallGuidance as d, resolveRuntimeStatusColor as f, installDaemonServiceAndEmit as g, createDaemonActionContext as h, formatDaemonServiceInstallCommand as i, renderGatewayServiceStartHints as l, buildDaemonServiceSnapshot as m, createDaemonInstallActionContext as n, normalizeListenerAddress as o, safeDaemonEnv as p, filterContainerGenericHints as r, pickProbeHostForBind as s, createCliStatusTextStyles as t, resolveDaemonInstallBlockMessage as u };
