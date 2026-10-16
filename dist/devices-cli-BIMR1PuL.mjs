import { N as isDevicesMachineOutput } from "./argv-D_Nxd_3s.mjs";
import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-udre-2i5.mjs";
import { n as setCommandJsonMode } from "./json-mode-e6DlzpSi.mjs";
import { Option } from "commander";
//#region src/cli/devices-cli.ts
const DEFAULT_DEVICES_TIMEOUT_MS = 1e4;
const loadDevicesRuntime = createLazyRuntimeModule(() => import("./devices-cli.runtime.js"));
const deviceAction = createLazyRuntimeMethodBinder(loadDevicesRuntime);
const devicesCallOpts = (cmd) => cmd.option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--password <password>", "Gateway password (password auth)").option("--timeout <ms>", "Timeout in ms", String(DEFAULT_DEVICES_TIMEOUT_MS)).option("--json", "Output JSON", false);
function registerDevicesCli(program) {
	const devices = program.command("devices").description("Device pairing and auth tokens (for mobile app setup codes, use `openclaw qr` instead)");
	devicesCallOpts(devices.command("list").description("List pending and paired devices").action(deviceAction((runtime) => runtime.runDevicesListCommand)));
	devicesCallOpts(devices.command("join-code").description("Mint a single-use node onboarding URL (not a mobile app setup code; use `openclaw qr` for that)").action(deviceAction((runtime) => runtime.runDevicesJoinCodeCommand)));
	devicesCallOpts(devices.command("remove").description("Remove a paired device entry").argument("<deviceId>", "Paired device id").action(deviceAction((runtime) => runtime.runDevicesRemoveCommand)));
	devicesCallOpts(devices.command("clear").description("Clear paired devices from the gateway table").option("--pending", "Also reject all pending pairing requests", false).option("--yes", "Confirm destructive clear", false).action(deviceAction((runtime) => runtime.runDevicesClearCommand)));
	devicesCallOpts(devices.command("approve").description("Approve a pending device pairing request").argument("[requestId]", "Pending request id").option("--latest", "Show the most recent pending request to approve explicitly", false).action(deviceAction((runtime) => runtime.runDevicesApproveCommand)));
	devicesCallOpts(devices.command("reject").description("Reject a pending device pairing request").argument("<requestId>", "Pending request id").action(deviceAction((runtime) => runtime.runDevicesRejectCommand)));
	devicesCallOpts(devices.command("rename").description("Assign an operator label to a paired device").requiredOption("--device <id>", "Device id").requiredOption("--name <label>", "Operator-assigned label (max 64 characters)").action(deviceAction((runtime) => runtime.runDevicesRenameCommand)));
	devicesCallOpts(devices.command("rotate").description("Rotate a device token for a role").requiredOption("--device <id>", "Device id").requiredOption("--role <role>", "Role name").option("--scope <scope...>", "Scopes to attach to the token (repeatable)").addOption(new Option("--no-scopes", "Rotate with an empty scope set").conflicts("scope")).action(deviceAction((runtime) => runtime.runDevicesRotateCommand)));
	devicesCallOpts(devices.command("revoke").description("Revoke a device token for a role").requiredOption("--device <id>", "Device id").requiredOption("--role <role>", "Role name").action(deviceAction((runtime) => runtime.runDevicesRevokeCommand)));
	setCommandJsonMode(devices, "output", ({ argv }) => isDevicesMachineOutput(argv));
	applyParentDefaultHelpAction(devices);
}
//#endregion
export { registerDevicesCli };
