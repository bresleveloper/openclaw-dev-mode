import { M as isDevicesMachineOutput } from "./argv-IYTsfFsq.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.mjs";
import { n as setCommandJsonMode } from "./json-mode-BYKm3vNF.mjs";
import { Option } from "commander";
//#region src/cli/devices-cli.ts
const DEFAULT_DEVICES_TIMEOUT_MS = 1e4;
const loadDevicesRuntime = createLazyRuntimeModule(() => import("./devices-cli.runtime.js"));
const devicesCallOpts = (cmd, defaults) => cmd.option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--password <password>", "Gateway password (password auth)").option("--timeout <ms>", "Timeout in ms", String(defaults?.timeoutMs ?? DEFAULT_DEVICES_TIMEOUT_MS)).option("--json", "Output JSON", false);
function registerDevicesCli(program) {
	const devices = program.command("devices").description("Device pairing and auth tokens (for mobile app setup codes, use `openclaw qr` instead)");
	devicesCallOpts(devices.command("list").description("List pending and paired devices").action(async (opts) => {
		const { runDevicesListCommand } = await loadDevicesRuntime();
		await runDevicesListCommand(opts);
	}));
	devicesCallOpts(devices.command("join-code").description("Mint a single-use node onboarding URL (not a mobile app setup code; use `openclaw qr` for that)").action(async (opts) => {
		const { runDevicesJoinCodeCommand } = await loadDevicesRuntime();
		await runDevicesJoinCodeCommand(opts);
	}));
	devicesCallOpts(devices.command("remove").description("Remove a paired device entry").argument("<deviceId>", "Paired device id").action(async (deviceId, opts) => {
		const { runDevicesRemoveCommand } = await loadDevicesRuntime();
		await runDevicesRemoveCommand(deviceId, opts);
	}));
	devicesCallOpts(devices.command("clear").description("Clear paired devices from the gateway table").option("--pending", "Also reject all pending pairing requests", false).option("--yes", "Confirm destructive clear", false).action(async (opts) => {
		const { runDevicesClearCommand } = await loadDevicesRuntime();
		await runDevicesClearCommand(opts);
	}));
	devicesCallOpts(devices.command("approve").description("Approve a pending device pairing request").argument("[requestId]", "Pending request id").option("--latest", "Show the most recent pending request to approve explicitly", false).action(async (requestId, opts) => {
		const { runDevicesApproveCommand } = await loadDevicesRuntime();
		await runDevicesApproveCommand(requestId, opts);
	}));
	devicesCallOpts(devices.command("reject").description("Reject a pending device pairing request").argument("<requestId>", "Pending request id").action(async (requestId, opts) => {
		const { runDevicesRejectCommand } = await loadDevicesRuntime();
		await runDevicesRejectCommand(requestId, opts);
	}));
	devicesCallOpts(devices.command("rename").description("Assign an operator label to a paired device").requiredOption("--device <id>", "Device id").requiredOption("--name <label>", "Operator-assigned label (max 64 characters)").action(async (opts) => {
		const { runDevicesRenameCommand } = await loadDevicesRuntime();
		await runDevicesRenameCommand(opts);
	}));
	devicesCallOpts(devices.command("rotate").description("Rotate a device token for a role").requiredOption("--device <id>", "Device id").requiredOption("--role <role>", "Role name").option("--scope <scope...>", "Scopes to attach to the token (repeatable)").addOption(new Option("--no-scopes", "Rotate with an empty scope set").conflicts("scope")).action(async (opts) => {
		const { runDevicesRotateCommand } = await loadDevicesRuntime();
		await runDevicesRotateCommand(opts);
	}));
	devicesCallOpts(devices.command("revoke").description("Revoke a device token for a role").requiredOption("--device <id>", "Device id").requiredOption("--role <role>", "Role name").action(async (opts) => {
		const { runDevicesRevokeCommand } = await loadDevicesRuntime();
		await runDevicesRevokeCommand(opts);
	}));
	setCommandJsonMode(devices, "output", ({ argv }) => isDevicesMachineOutput(argv));
	applyParentDefaultHelpAction(devices);
}
//#endregion
export { registerDevicesCli };
