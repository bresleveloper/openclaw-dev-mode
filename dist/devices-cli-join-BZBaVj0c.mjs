import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import "./method-scopes-Bcx3NDQr.mjs";
import { r as callGatewayFromCliWithTransport } from "./gateway-rpc-Wcwajg7Y.mjs";
//#region src/cli/devices-cli-join.ts
async function runDevicesJoinCodeCommand(opts) {
	const result = await callGatewayFromCliWithTransport("device.pair.setupCode", opts, {
		bootstrapProfile: "node",
		includeQr: false,
		joinUrl: true
	}, {
		label: "Devices device.pair.setupCode",
		defaultTimeoutMs: 1e4,
		scopes: [ADMIN_SCOPE],
		sharedStateMode: "read-only"
	});
	const joinUrl = normalizeOptionalString(result.joinUrl);
	if (!joinUrl) throw new Error("Gateway did not return a device join URL.");
	const command = normalizeOptionalString(result.command);
	const serviceCommand = normalizeOptionalString(result.serviceCommand);
	const installedCommand = normalizeOptionalString(result.installedCommand);
	const versionNote = normalizeOptionalString(result.versionNote);
	if (!command || !serviceCommand || !installedCommand) throw new Error("Gateway did not return device join commands. Update the Gateway and try again.");
	if (opts.json) {
		defaultRuntime.writeJson({
			joinUrl,
			command,
			serviceCommand,
			installedCommand,
			...versionNote ? { versionNote } : {}
		});
		return;
	}
	defaultRuntime.log(joinUrl);
	defaultRuntime.log(command);
	defaultRuntime.log("Installs a background node service that can run agent sessions.");
	defaultRuntime.log(`Command-only node: ${serviceCommand}`);
	defaultRuntime.log(`Already have OpenClaw installed? Run: ${installedCommand}`);
	if (versionNote) defaultRuntime.log(versionNote);
}
//#endregion
export { runDevicesJoinCodeCommand };
