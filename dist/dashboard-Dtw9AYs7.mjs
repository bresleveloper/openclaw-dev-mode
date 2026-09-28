import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { n as isWSL2Sync } from "./wsl-BqZ6SFne.mjs";
import { r as promptYesNo } from "./prompt-BU90Lld0.mjs";
import { n as openUrl, t as detectBrowserOpenSupport } from "./browser-open-4uUcM1Wd.mjs";
import { i as formatControlUiSshHint } from "./onboard-helpers-0ZuVvEiw.mjs";
import { t as isRemoteEnvironment } from "./remote-env-Dkn0ouel.mjs";
import { l as gatewayProbeResultSawGateway } from "./gateway-health-auth-diagnostic-m-h-zwWu.mjs";
import { i as waitForControlUiDocument, n as issueControlUiBrowserHandoff, r as resolveControlUiHandoffTarget, t as hasVerifiedControlUiLoopbackAlias } from "./control-ui-handoff-B0MNDPak.mjs";
import { Buffer } from "node:buffer";
//#region src/infra/clipboard.ts
const WSL_CLIPBOARD_ARGV = [
	"/bin/sh",
	"-c",
	"exec /mnt/c/Windows/System32/clip.exe"
];
const POWERSHELL_CLIPBOARD_ARGV = [
	"powershell",
	"-NoProfile",
	"-NonInteractive",
	"-Command",
	"$encoded = [Console]::In.ReadToEnd(); $bytes = [Convert]::FromBase64String($encoded); Set-Clipboard -Value ([Text.Encoding]::UTF8.GetString($bytes))"
];
async function copyToClipboard(value) {
	const attempts = [
		...isWSL2Sync() ? [{
			argv: WSL_CLIPBOARD_ARGV,
			input: value
		}] : [],
		{
			argv: ["pbcopy"],
			input: value
		},
		{
			argv: [
				"xclip",
				"-selection",
				"clipboard"
			],
			input: value
		},
		{
			argv: ["wl-copy"],
			input: value
		},
		{
			argv: ["clip.exe"],
			input: value
		},
		{
			argv: POWERSHELL_CLIPBOARD_ARGV,
			input: Buffer.from(value, "utf8").toString("base64")
		}
	];
	for (const attempt of attempts) try {
		const result = await runCommandWithTimeout(attempt.argv, {
			timeoutMs: 3e3,
			input: attempt.input
		});
		if (result.code === 0 && !result.killed) return true;
	} catch {}
	return false;
}
//#endregion
//#region src/commands/gateway-readiness.ts
const daemonStatusModuleLoader = createLazyImportLoader(() => import("./status.gather-DaaVU1XJ.mjs"));
const daemonInstallModuleLoader = createLazyImportLoader(() => import("./install.runtime-0u4Mm8Wk.mjs"));
const daemonLifecycleModuleLoader = createLazyImportLoader(() => import("./lifecycle-DZNMYI0l.mjs"));
async function defaultGatherStatus(params) {
	const { gatherDaemonStatus } = await daemonStatusModuleLoader.load();
	return gatherDaemonStatus({
		rpc: params.probeUrl ? { url: params.probeUrl } : {},
		probe: true,
		requireRpc: params.requireRpc,
		deep: false
	});
}
function activeProbePortStatus(status) {
	const probeUrl = status.rpc?.url ?? status.gateway?.probeUrl;
	const probePort = probeUrl ? (() => {
		try {
			return Number(new URL(probeUrl).port);
		} catch {
			return NaN;
		}
	})() : NaN;
	if (Number.isFinite(probePort) && status.portCli?.port === probePort) return status.portCli;
	return status.port;
}
function gatewayIsReady(status, readyWhenReachable) {
	return status.rpc?.ok === true || readyWhenReachable === true && activeProbePortStatus(status)?.status === "busy" && Boolean(status.rpc && gatewayProbeResultSawGateway(status.rpc));
}
function gatewayLooksStopped(status) {
	if (status.rpc && gatewayProbeResultSawGateway(status.rpc)) return false;
	const port = activeProbePortStatus(status);
	if (port?.status === "busy") return false;
	if (port?.status === "free") return true;
	if (status.service.runtime?.status === "stopped") return true;
	const error = status.rpc?.error ?? "";
	return /\bECONNREFUSED\b|couldn't connect|connection refused/i.test(error);
}
function gatewayServiceIsInstalled(status) {
	return Boolean(status.service.command || status.service.loadState.status === "loaded");
}
function nativeServiceTargetsGateway(status) {
	return status.service.targetRole !== "diagnostic-only";
}
function readinessFailureReason(status) {
	if (gatewayLooksStopped(status)) return "Gateway is not running.";
	return status.rpc?.error ? `Gateway probe failed: ${status.rpc.error}` : "Gateway is not healthy.";
}
function printGatewayNotReadyHints(runtime, reason, canStartService = true) {
	runtime.log(reason);
	runtime.log("Run `openclaw gateway status --deep` for details.");
	if (!canStartService) {
		runtime.log("Use the owning environment or supervisor to start or repair the selected Gateway.");
		return;
	}
	runtime.log("Run `openclaw gateway start` to start a managed gateway.");
	runtime.log("Run `openclaw gateway run` for a foreground gateway.");
}
async function confirmRecovery(params) {
	if (params.yes) return true;
	if (!(params.interactive ?? process.stdin.isTTY)) return false;
	return params.confirm(params.message, true);
}
async function waitForGatewayReady(params) {
	const attempts = params.attempts ?? 20;
	const delayMs = params.delayMs ?? 500;
	let latest = await params.gatherStatus();
	for (let attempt = 1; attempt < attempts && !gatewayIsReady(latest, params.readyWhenReachable); attempt += 1) {
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
		latest = await params.gatherStatus();
	}
	return latest;
}
/** Checks readiness and, when approved, recovers by installing or starting the gateway. */
async function ensureGatewayReadyForOperation(options) {
	const requireRpc = options.requireRpc ?? false;
	const gatherStatus = options.deps?.gatherStatus ?? (() => defaultGatherStatus({
		requireRpc,
		probeUrl: options.probeUrl
	}));
	const confirm = options.deps?.confirm ?? promptYesNo;
	const installGateway = options.deps?.installGateway ?? (async () => {
		const { runDaemonInstall } = await daemonInstallModuleLoader.load();
		await runDaemonInstall({ json: false });
	});
	const startGateway = options.deps?.startGateway ?? (async () => {
		const { runDaemonStart } = await daemonLifecycleModuleLoader.load();
		await runDaemonStart({ json: false });
	});
	const initialStatus = await gatherStatus();
	if (gatewayIsReady(initialStatus, options.readyWhenReachable)) return {
		ready: true,
		status: initialStatus,
		recovered: false
	};
	const reason = readinessFailureReason(initialStatus);
	const nativeServiceCanRecover = nativeServiceTargetsGateway(initialStatus);
	if (!gatewayLooksStopped(initialStatus) || !nativeServiceCanRecover) {
		printGatewayNotReadyHints(options.runtime, reason, false);
		return {
			ready: false,
			status: initialStatus,
			reason,
			recoverable: false
		};
	}
	const shouldInstall = !gatewayServiceIsInstalled(initialStatus);
	if (shouldInstall && options.allowInstall === false) {
		printGatewayNotReadyHints(options.runtime, reason);
		return {
			ready: false,
			status: initialStatus,
			reason,
			recoverable: false
		};
	}
	if (!await confirmRecovery({
		message: shouldInstall ? `No background Gateway service was detected for this profile. Install and start one to ${options.operation}?` : `The background Gateway service is not running. Start it to ${options.operation}?`,
		yes: options.yes,
		interactive: options.interactive,
		confirm
	})) {
		printGatewayNotReadyHints(options.runtime, reason);
		return {
			ready: false,
			status: initialStatus,
			reason,
			recoverable: true
		};
	}
	if (shouldInstall) await installGateway();
	else await startGateway();
	const recoveredStatus = await waitForGatewayReady({
		gatherStatus,
		readyWhenReachable: options.readyWhenReachable
	});
	if (gatewayIsReady(recoveredStatus, options.readyWhenReachable)) return {
		ready: true,
		status: recoveredStatus,
		recovered: true
	};
	const recoveredReason = readinessFailureReason(recoveredStatus);
	const recoverable = gatewayLooksStopped(recoveredStatus) && nativeServiceTargetsGateway(recoveredStatus);
	printGatewayNotReadyHints(options.runtime, recoveredReason, recoverable);
	return {
		ready: false,
		status: recoveredStatus,
		reason: recoveredReason,
		recoverable
	};
}
//#endregion
//#region src/commands/dashboard.ts
const quietRuntime = {
	log: () => {},
	error: () => {},
	exit: () => {}
};
const gatewayPasswordJsonKey = ["gateway", "Password"].join("");
async function resolveDashboardTarget() {
	const snapshot = await readConfigFileSnapshot();
	if (snapshot.exists && !snapshot.valid) throw new Error(`OpenClaw config is invalid: ${snapshot.path}. Run \`openclaw doctor --fix\` or \`openclaw config validate\`.`);
	return await resolveControlUiHandoffTarget({
		config: snapshot.valid ? snapshot.sourceConfig ?? snapshot.config : {},
		env: process.env
	});
}
async function ensureDashboardTargetReady(params) {
	return ensureGatewayReadyForOperation({
		runtime: params.runtime,
		operation: "open the dashboard",
		yes: params.yes,
		probeUrl: params.target.probeUrl,
		readyWhenReachable: true,
		...params.allowRecovery === false ? {
			allowInstall: false,
			interactive: false
		} : {}
	});
}
function dashboardJsonFailure(runtime, reason) {
	writeRuntimeJson(runtime, {
		ok: false,
		reason
	}, 0);
	runtime.exit(1);
}
async function dashboardJsonCommand(runtime) {
	try {
		const target = await resolveDashboardTarget();
		const readiness = await ensureDashboardTargetReady({
			target,
			runtime: quietRuntime,
			allowRecovery: false
		});
		if (!readiness.ready) {
			dashboardJsonFailure(runtime, readiness.reason);
			return;
		}
		if (!await hasVerifiedControlUiLoopbackAlias(target)) {
			dashboardJsonFailure(runtime, "Dashboard loopback listener could not be verified as the configured Gateway.");
			return;
		}
		const document = await waitForControlUiDocument({
			url: target.documentUrl,
			tlsConfig: target.tlsConfig,
			waitForPending: false
		});
		if (!document.ready) {
			dashboardJsonFailure(runtime, document.reason);
			return;
		}
		const browserHandoff = await issueControlUiBrowserHandoff(target.links);
		writeRuntimeJson(runtime, {
			ok: true,
			url: target.dashboardUrl,
			httpUrl: target.links.httpUrl,
			wsUrl: target.links.wsUrl,
			port: target.port,
			tokenIncluded: target.includeTokenInUrl,
			browserUrl: browserHandoff.browserUrl,
			browserBootstrapExpiresAtMs: browserHandoff.expiresAtMs,
			...target.gatewayAuthHandoff ? { [gatewayPasswordJsonKey]: target.gatewayAuthHandoff } : {},
			...document.tlsFingerprint ? { tlsFingerprint: document.tlsFingerprint } : {}
		}, 0);
	} catch (err) {
		dashboardJsonFailure(runtime, (err instanceof Error ? err.message : String(err)) || "Dashboard target resolution failed.");
	}
}
/** Open or print the Control UI dashboard URL after ensuring the Gateway is reachable. */
async function dashboardCommand(runtime = defaultRuntime, options = {}) {
	if (options.json) {
		await dashboardJsonCommand(runtime);
		return;
	}
	let initialTarget;
	try {
		initialTarget = await resolveDashboardTarget();
	} catch (error) {
		runtime.error(error instanceof Error ? error.message : String(error));
		runtime.exit(1);
		return;
	}
	const readiness = await ensureDashboardTargetReady({
		target: initialTarget,
		runtime,
		yes: options.yes
	});
	if (!readiness.ready) return;
	const target = readiness.recovered ? await resolveDashboardTarget() : initialTarget;
	const recoveryChangedProbe = target.probeUrl !== initialTarget.probeUrl;
	if (readiness.recovered && recoveryChangedProbe) {
		if (!(await ensureDashboardTargetReady({
			target,
			runtime,
			allowRecovery: false
		})).ready) return;
	}
	if (!await hasVerifiedControlUiLoopbackAlias(target)) {
		runtime.error("Dashboard loopback listener could not be verified as the configured Gateway; refusing to copy or open an authenticated URL.");
		runtime.log("Restart the Gateway, then run `openclaw gateway status --deep` for details.");
		return;
	}
	const document = await waitForControlUiDocument({
		url: target.documentUrl,
		tlsConfig: target.tlsConfig,
		onPending: () => runtime.log("Control UI assets are preparing; waiting for the dashboard…")
	});
	if (!document.ready) {
		runtime.error(document.reason);
		runtime.log("Run `openclaw gateway status --deep` for details.");
		runtime.exit(1);
		return;
	}
	let browserUrl;
	try {
		browserUrl = (await issueControlUiBrowserHandoff(target.links)).browserUrl;
	} catch (error) {
		runtime.error(`Could not create a one-time browser pairing link: ${error instanceof Error ? error.message : String(error)}`);
		runtime.log("Run `openclaw doctor`, then retry `openclaw dashboard`.");
		return;
	}
	const { port, basePath, links, includeTokenInUrl, tlsConfig } = target;
	runtime.log(`Dashboard URL: ${links.httpUrl}`);
	runtime.log("One-time browser pairing included in browser/clipboard URL.");
	const copied = await copyToClipboard(browserUrl).catch(() => false);
	runtime.log(copied ? "Copied to clipboard." : "Copy to clipboard unavailable.");
	let opened = false;
	let hint;
	if (!options.noOpen) {
		if ((await detectBrowserOpenSupport()).ok) {
			opened = await openUrl(browserUrl);
			if (!opened && !copied && isRemoteEnvironment()) hint = formatControlUiSshHint({
				port,
				basePath,
				tlsEnabled: tlsConfig?.enabled === true
			});
			else hint = opened ? void 0 : copied ? "Browser launch failed. Open the one-time pairing URL copied to clipboard." : "Browser launch failed. Open the Dashboard URL above manually.";
		} else hint = formatControlUiSshHint({
			port,
			basePath,
			tlsEnabled: tlsConfig?.enabled === true
		});
	} else hint = copied ? "Browser launch disabled (--no-open). One-time browser pairing URL copied to clipboard." : "Browser launch disabled (--no-open). Use the URL above.";
	const handoffDeliveryFailed = !copied && !opened;
	const fallbackToManualAuth = handoffDeliveryFailed && includeTokenInUrl;
	const fallbackToJsonHandoff = handoffDeliveryFailed && !includeTokenInUrl;
	const suppressNoOpenHint = options.noOpen === true && (fallbackToManualAuth || fallbackToJsonHandoff);
	if (opened) runtime.log("Opened in your browser. Keep that tab to control OpenClaw.");
	else if (hint && !suppressNoOpenHint) runtime.log(hint);
	if (fallbackToManualAuth) runtime.log("Token auto-auth not delivered. Append your gateway token (from OPENCLAW_GATEWAY_TOKEN or gateway.auth.token) as a URL fragment with key `token` to authenticate.");
	else if (fallbackToJsonHandoff) runtime.log("One-time pairing URL not delivered. Run `openclaw dashboard --json` and open its `browserUrl` within ten minutes.");
}
//#endregion
export { dashboardCommand };
