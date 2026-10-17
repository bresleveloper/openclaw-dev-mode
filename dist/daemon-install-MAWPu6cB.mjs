import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { G as isSystemdUserServiceAvailable } from "./systemd-service-files-D_ieSNFm.mjs";
import { n as resolveGatewayService } from "./service-Cw6bpVrf.mjs";
import "./systemd-Dcb-WwA6.mjs";
import { n as gatewayInstallErrorHint } from "./daemon-install-helpers-C3yIkpN-.mjs";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-C82ZD713.mjs";
import { n as prepareGatewayServiceInstall, t as resolveGatewaySetupRuntime } from "./gateway-setup-runtime-H3_HBJeo.mjs";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-GJY5Bj4R.mjs";
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
