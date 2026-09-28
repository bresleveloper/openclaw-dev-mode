import { a as getCommandPositionalsWithRootOptions } from "./cli-root-options-vGuJ5JgW.mjs";
//#region gateway-run-argv.mjs
const GATEWAY_RUN_VALUE_FLAGS = /* @__PURE__ */ new Set([
	"--port",
	"--bind",
	"--token",
	"--token-file",
	"--auth",
	"--password",
	"--password-file",
	"--tailscale",
	"--ws-log",
	"--raw-stream-path"
]);
const GATEWAY_RUN_BOOLEAN_FLAGS = /* @__PURE__ */ new Set([
	"--tailscale-reset-on-exit",
	"--allow-unconfigured",
	"--dev",
	"--ambient-channels",
	"--dev-ambient-channels",
	"--reset",
	"--update-canary",
	"--force",
	"--verbose",
	"--cli-backend-logs",
	"--claude-cli-logs",
	"--compact",
	"--raw-stream"
]);
function isForegroundGatewayRunArgv(argv) {
	const positionals = getCommandPositionalsWithRootOptions(argv, {
		commandPath: ["gateway"],
		booleanFlags: [...GATEWAY_RUN_BOOLEAN_FLAGS],
		valueFlags: [...GATEWAY_RUN_VALUE_FLAGS],
		mode: "command-path"
	});
	if (!positionals) return false;
	return positionals.length === 0 || positionals.length === 1 && positionals[0] === "run";
}
//#endregion
export { GATEWAY_RUN_VALUE_FLAGS as n, isForegroundGatewayRunArgv as r, GATEWAY_RUN_BOOLEAN_FLAGS as t };
