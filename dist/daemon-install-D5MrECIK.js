import "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import "./subsystem-D-lLN9nd.js";
import "./boolean-DTgd5CzD.js";
import "./auth-profiles-gyYFUuWS.js";
import "./agent-scope-Cp0IkEKB.js";
import "./utils-DMInpDZe.js";
import "./openclaw-root-D_NGSHjv.js";
import "./logger-lJby90xW.js";
import "./exec-9-lXnoNH.js";
import "./github-copilot-token-CcBrBN3h.js";
import "./host-env-security-BnQcDbLl.js";
import "./version-Bxx5bg6l.js";
import "./runtime-overrides-BrDRV8AG.js";
import "./registry-XwiWGUVE.js";
import "./manifest-registry-DpwUhr6x.js";
import "./dock-DXYDVeNl.js";
import "./accounts-CCmToVwr.js";
import "./plugins-BlxnRrWB.js";
import "./logging-DE_Gv8EN.js";
import "./accounts-D9cGmSBd.js";
import "./message-channel-CBxyiPG1.js";
import "./tailscale-DUAiX-L-.js";
import "./tailnet-_7OomAtX.js";
import "./ws-skc9U6x4.js";
import "./auth-yZ8XbKKh.js";
import "./sessions-BzabF1Rs.js";
import "./accounts-B9MZJeQz.js";
import "./paths-m-ckvfYo.js";
import "./chat-envelope-BCgyDMmT.js";
import "./client-x1tOQWHk.js";
import "./call-CT_1cdY_.js";
import "./pairing-token-B2YLkyDu.js";
import "./onboard-helpers-BTGTJOdS.js";
import "./prompt-style-Dnaodfgg.js";
import "./note-C1niKQJi.js";
import { n as gatewayInstallErrorHint, t as buildGatewayInstallPlan } from "./daemon-install-helpers-DtFOsxdB.js";
import "./runtime-guard-vBGm4L6l.js";
import { r as isGatewayDaemonRuntime } from "./daemon-runtime-CakxZ6WR.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-Bzk-rTVx.js";
import { r as isSystemdUserServiceAvailable } from "./systemd-D433hbaR.js";
import { t as resolveGatewayService } from "./service-C3EJt_cG.js";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-DMutfzjg.js";
//#region src/commands/onboard-non-interactive/local/daemon-install.ts
async function installGatewayDaemonNonInteractive(params) {
	const { opts, runtime, port } = params;
	if (!opts.installDaemon) return;
	const daemonRuntimeRaw = opts.daemonRuntime ?? "node";
	const systemdAvailable = process.platform === "linux" ? await isSystemdUserServiceAvailable() : true;
	if (process.platform === "linux" && !systemdAvailable) {
		runtime.log("Systemd user services are unavailable; skipping service install.");
		return;
	}
	if (!isGatewayDaemonRuntime(daemonRuntimeRaw)) {
		runtime.error("Invalid --daemon-runtime (use node or bun)");
		runtime.exit(1);
		return;
	}
	const service = resolveGatewayService();
	const tokenResolution = await resolveGatewayInstallToken({
		config: params.nextConfig,
		env: process.env
	});
	for (const warning of tokenResolution.warnings) runtime.log(warning);
	if (tokenResolution.unavailableReason) {
		runtime.error([
			"Gateway install blocked:",
			tokenResolution.unavailableReason,
			"Fix gateway auth config/token input and rerun onboarding."
		].join(" "));
		runtime.exit(1);
		return;
	}
	const { programArguments, workingDirectory, environment } = await buildGatewayInstallPlan({
		env: process.env,
		port,
		token: tokenResolution.token,
		runtime: daemonRuntimeRaw,
		warn: (message) => runtime.log(message),
		config: params.nextConfig
	});
	try {
		await service.install({
			env: process.env,
			stdout: process.stdout,
			programArguments,
			workingDirectory,
			environment
		});
	} catch (err) {
		runtime.error(`Gateway service install failed: ${String(err)}`);
		runtime.log(gatewayInstallErrorHint());
		return;
	}
	await ensureSystemdUserLingerNonInteractive({ runtime });
}
//#endregion
export { installGatewayDaemonNonInteractive };
