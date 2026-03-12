import "./paths-BJV7vkaX.js";
import "./globals-BozXJ-QJ.js";
import "./utils-BzWe_IKB.js";
import "./model-selection-BRhJAUKb.js";
import "./agent-scope-Dx6t10xJ.js";
import "./subsystem-NSiOA8hi.js";
import "./openclaw-root-BgG4cyU3.js";
import "./logger-CX3t1bKz.js";
import "./exec-B1lVds_y.js";
import "./github-copilot-token-BD0SJwml.js";
import "./boolean-B6zcAynR.js";
import "./env-ChlBW8C4.js";
import "./env-overrides-C_5dHP8H.js";
import "./runtime-overrides-BlDGW6c7.js";
import "./registry-Bwq7RDwU.js";
import "./skills-B5bzQ_n_.js";
import "./frontmatter-CNhVfaKz.js";
import "./plugins-7t5A5YJP.js";
import "./windows-spawn-BAKAvVI9.js";
import "./redact-DWSz2XT_.js";
import "./path-alias-guards-CbtFbGMl.js";
import "./errors-Cvi_W98b.js";
import "./paths-B3fM69Ic.js";
import "./chat-envelope-DUjyuML-.js";
import "./call-CGmUC45G.js";
import "./onboard-helpers-JN2sbVho.js";
import "./prompt-style-fqsyersP.js";
import "./runtime-guard-NUIBQgL8.js";
import "./note-DUZmkXUD.js";
import "./daemon-install-plan.shared-CYN5AepX.js";
import { n as buildGatewayInstallPlan, r as gatewayInstallErrorHint, t as resolveGatewayInstallToken } from "./gateway-install-token-CG9nu18_.js";
import { r as isGatewayDaemonRuntime } from "./daemon-runtime-PDKGe0fy.js";
import { i as isSystemdUserServiceAvailable } from "./systemd-DTFIsPDY.js";
import { n as resolveGatewayService } from "./service-CjQa65BD.js";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-CZIQX4g4.js";
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
