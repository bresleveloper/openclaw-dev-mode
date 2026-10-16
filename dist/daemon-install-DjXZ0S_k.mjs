import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { G as isSystemdUserServiceAvailable } from "./systemd-service-files-BXSBYnK_.mjs";
import { n as resolveGatewayService } from "./service-CCUynFdj.mjs";
import "./systemd-C4RkjiSR.mjs";
import { n as gatewayInstallErrorHint } from "./daemon-install-helpers-r4uiFPBV.mjs";
import { t as resolveGatewayInstallToken } from "./gateway-install-token--3y4gr0t.mjs";
import { n as prepareGatewayServiceInstall, t as resolveGatewaySetupRuntime } from "./gateway-setup-runtime-DSIrI1Lm.mjs";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-CpQYYc_S.mjs";
//#region src/commands/onboard-non-interactive/local/daemon-install.ts
/** Installs the managed gateway daemon when non-interactive setup requested it. */
async function installGatewayDaemonNonInteractive(params) {
	const { opts, runtime, port } = params;
	const systemdAvailable = process.platform === "linux" ? await isSystemdUserServiceAvailable() : true;
	if (process.platform === "linux" && !systemdAvailable) {
		runtime.log("Systemd user services are unavailable; skipping service install. Use a direct shell run (`openclaw gateway run`) or rerun without --install-daemon on this session.");
		return {
			installed: false,
			skippedReason: "systemd-user-unavailable"
		};
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
			"Fix gateway auth config/token input and rerun setup."
		].join(" "));
		runtime.exit(1);
		return { installed: false };
	}
	const existingCommand = await service.readCommand(process.env);
	const selection = await resolveGatewaySetupRuntime({
		env: process.env,
		existingCommand,
		runtime: opts.daemonRuntime
	});
	const installation = await prepareGatewayServiceInstall({
		service,
		selection,
		port,
		existingCommand,
		warn: (message) => runtime.log(message),
		config: params.nextConfig
	});
	try {
		await installation.install();
	} catch (err) {
		runtime.error(`Gateway service install failed: ${formatErrorMessage(err)}`);
		runtime.log(gatewayInstallErrorHint());
		return { installed: false };
	}
	await ensureSystemdUserLingerNonInteractive({ runtime });
	return { installed: true };
}
//#endregion
export { installGatewayDaemonNonInteractive };
