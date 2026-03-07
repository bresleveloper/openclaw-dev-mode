import "./paths-BJV7vkaX.js";
import "./globals-BozXJ-QJ.js";
import "./utils-BzWe_IKB.js";
import "./agent-scope-BJ-A8vSB.js";
import "./subsystem-DEHxNIeh.js";
import "./openclaw-root-pxEnyCPl.js";
import "./logger-CybQ0xau.js";
import "./exec-BpxsjP05.js";
import "./model-selection-CX4C7NZp.js";
import "./github-copilot-token-BQoM_VEX.js";
import "./boolean-D8Ha5nYV.js";
import "./env-ZTsIDHVm.js";
import "./host-env-security-8lfqCQOD.js";
import "./runtime-overrides-CzZbXh6c.js";
import "./registry-CAMKAMjq.js";
import "./manifest-registry-CWvKZnOp.js";
import "./dock-Comp2gJ6.js";
import "./message-channel-DQep2kbh.js";
import "./plugins-C0pOwMtf.js";
import "./sessions-HiopsrVS.js";
import "./tailscale-Cb--SHEE.js";
import "./tailnet-CjKuOt5U.js";
import "./ws-BeoXlzsZ.js";
import "./auth-32YLiXaF.js";
import "./accounts-82c5Tbng.js";
import "./accounts-CvmhVLij.js";
import "./logging-T8IDvLh2.js";
import "./accounts-CoSHDMaf.js";
import "./paths-CrgdtCHd.js";
import "./chat-envelope-DyXtQzoD.js";
import "./client-CaaDgxx2.js";
import "./call-Ch1eylWu.js";
import "./pairing-token-BiCaqjaN.js";
import "./onboard-helpers-XgRedRg8.js";
import "./prompt-style-DwgYrBLh.js";
import "./runtime-guard-XHQ65dbS.js";
import "./note-Bjck-fwK.js";
import { n as gatewayInstallErrorHint, t as buildGatewayInstallPlan } from "./daemon-install-helpers-Co-yNbPZ.js";
import { r as isGatewayDaemonRuntime } from "./daemon-runtime-d8cwMM7i.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-BDTCM6Co.js";
import { r as isSystemdUserServiceAvailable } from "./systemd-__G_1Jlx.js";
import { t as resolveGatewayService } from "./service-D3g0qh4H.js";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-kh3ClclC.js";
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
