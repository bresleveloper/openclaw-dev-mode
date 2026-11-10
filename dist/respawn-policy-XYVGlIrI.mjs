import { n as getCommandPathWithRootOptions } from "./argv-C7hqFLn5.mjs";
import { r as isForegroundGatewayRunArgv } from "./gateway-run-argv-uoU8-Fwk.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CJfjJu7L.mjs";
//#region src/cli/respawn-policy.ts
const INTERACTIVE_TTY_COMMANDS = /* @__PURE__ */ new Set([
	"tui",
	"terminal",
	"chat"
]);
/** Gmail owns a shutdown grace period longer than the generic respawn wrapper allows. */
function isForegroundGmailRunArgv(argv) {
	return getCommandPathWithRootOptions(argv, 3).join(" ") === "webhooks gmail run";
}
function isNativeHookRelayArgv(argv) {
	const { commandPath } = resolveCliArgvInvocation(argv);
	return commandPath[0] === "hooks" && commandPath[1] === "relay";
}
function shouldKeepNativeHookRelayInProcess(argv, platform) {
	return platform !== "win32" && isNativeHookRelayArgv(argv);
}
function isTerminalInteractiveRespawnArgv(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion) return false;
	return invocation.primary === null || INTERACTIVE_TTY_COMMANDS.has(invocation.primary);
}
/** Returns whether CLI startup should avoid the general respawn wrapper for this argv. */
function shouldSkipRespawnForArgv(argv, platform = process.platform) {
	const invocation = resolveCliArgvInvocation(argv);
	const isGatewayStatus = invocation.commandPath.length === 2 && invocation.commandPath[0] === "gateway" && invocation.commandPath[1] === "status";
	return shouldSkipStartupEnvironmentRespawnForArgv(argv, platform) || invocation.primary !== null && INTERACTIVE_TTY_COMMANDS.has(invocation.primary) || isGatewayStatus;
}
/** Returns whether startup-environment respawn should be skipped without suppressing TUI respawn policy. */
function shouldSkipStartupEnvironmentRespawnForArgv(argv, platform = process.platform) {
	const invocation = resolveCliArgvInvocation(argv);
	return invocation.hasHelpOrVersion || isForegroundGmailRunArgv(argv) || shouldKeepNativeHookRelayInProcess(argv, platform) || invocation.primary === "gateway" && isForegroundGatewayRunArgv(argv);
}
//#endregion
export { shouldSkipRespawnForArgv as a, shouldKeepNativeHookRelayInProcess as i, isNativeHookRelayArgv as n, shouldSkipStartupEnvironmentRespawnForArgv as o, isTerminalInteractiveRespawnArgv as r, isForegroundGmailRunArgv as t };
