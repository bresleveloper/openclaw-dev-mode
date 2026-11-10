import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { G as isSystemdUserServiceAvailable } from "./systemd-service-files-C3V-PDoO.mjs";
import { n as resolveGatewayService } from "./service-CCmqtriJ.mjs";
import "./systemd-BoxHLGdw.mjs";
import { n as gatewayInstallErrorHint } from "./daemon-install-helpers-BDrCsNgM.mjs";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-DyOTRJlC.mjs";
import { n as prepareGatewayServiceInstall, t as resolveGatewaySetupRuntime } from "./gateway-setup-runtime-CS1najlR.mjs";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-CxZZny4y.mjs";
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
