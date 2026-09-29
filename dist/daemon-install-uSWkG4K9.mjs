import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { w as isSystemdUserServiceAvailable } from "./systemd-service-files-tGuARbbA.mjs";
import { n as gatewayInstallErrorHint, t as buildGatewayInstallPlan } from "./daemon-install-helpers-Bky3P_UA.mjs";
import { r as isGatewayDaemonRuntime } from "./daemon-runtime-D15REPfs.mjs";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-DvAunsR_.mjs";
import { a as resolveGatewayService } from "./service-BCULlL85.mjs";
import "./systemd-j8mO8n69.mjs";
import { t as resolveGatewaySetupRuntime } from "./gateway-setup-runtime-CE2bR8AJ.mjs";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-BtC6vBIB.mjs";
//#region src/commands/onboard-non-interactive/local/daemon-install.ts
/** Installs the managed gateway daemon when non-interactive setup requested it. */
async function installGatewayDaemonNonInteractive(params) {
	const { opts, runtime, port } = params;
	if (!opts.installDaemon) return { installed: false };
	const daemonRuntimeRaw = opts.daemonRuntime ?? "node";
	const systemdAvailable = process.platform === "linux" ? await isSystemdUserServiceAvailable() : true;
	if (process.platform === "linux" && !systemdAvailable) {
		runtime.log("Systemd user services are unavailable; skipping service install. Use a direct shell run (`openclaw gateway run`) or rerun without --install-daemon on this session.");
		return {
			installed: false,
			skippedReason: "systemd-user-unavailable"
		};
	}
	if (!isGatewayDaemonRuntime(daemonRuntimeRaw)) {
		runtime.error("Invalid --daemon-runtime. Use \"node\" or \"bun\".");
		runtime.exit(1);
		return { installed: false };
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
	const plan = await buildGatewayInstallPlan({
		env: selection.env,
		port,
		runtime: selection.runtime,
		pinnedRuntimePath: selection.pinnedRuntimePath,
		existingCommand,
		warn: (message) => runtime.log(message),
		config: params.nextConfig
	});
	try {
		await service.install({
			env: process.env,
			stdout: process.stdout,
			...plan,
			runtimePinUpdate: selection.runtimePinUpdate
		});
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
