import "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import "./subsystem-CkDRqDzV.js";
import "./boolean-DTgd5CzD.js";
import "./auth-profiles-CIqoN6FN.js";
import "./agent-scope-BAb0j1gt.js";
import "./utils-DMInpDZe.js";
import "./boundary-file-read-DM07oBuv.js";
import "./logger-GQFppKMT.js";
import "./exec-DDBrWr4H.js";
import "./github-copilot-token-B_S63apr.js";
import "./env-overrides-BD1bOZrq.js";
import "./version-BvA7WhZA.js";
import "./runtime-overrides-CGfXKBb_.js";
import "./registry-DznR2BDN.js";
import "./skills-DZCrHNdp.js";
import "./frontmatter-D1I3WE8J.js";
import "./plugins-CjLMQbHJ.js";
import "./windows-spawn-D2jCT_tt.js";
import "./redact-DnTfDLlu.js";
import "./path-alias-guards-BAfWVs88.js";
import "./errors-D6OHuY6d.js";
import "./paths-B52CESY4.js";
import "./chat-envelope-DZwp6OvC.js";
import "./call-B28h9L2b.js";
import "./onboard-helpers-Dxc5qfRZ.js";
import "./prompt-style-DjT2g1_v.js";
import "./note-V9Ncupme.js";
import "./daemon-install-plan.shared-DhoIhEeS.js";
import "./runtime-guard-dTn-df9-.js";
import { n as buildGatewayInstallPlan, r as gatewayInstallErrorHint, t as resolveGatewayInstallToken } from "./gateway-install-token-Bu9du9z5.js";
import { r as isGatewayDaemonRuntime } from "./daemon-runtime-D1tp6nTC.js";
import { i as isSystemdUserServiceAvailable } from "./systemd-Bh02taAa.js";
import { n as resolveGatewayService } from "./service-D6xYLXBx.js";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-kucERJ7Z.js";
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
