//#region src/cli/terminal-interactivity.ts
function isTerminalInteractive(output = process.stdout) {
	return process.stdin.isTTY ? output.isTTY === true : false;
}
const NON_INTERACTIVE_GATEWAY_STOP_MESSAGE = "This stops the operator's running gateway service. Use an isolated dev gateway (openclaw gateway run --dev, or --profile <name> with a free port) for testing, or re-run with --force if you really mean it.";
const NON_INTERACTIVE_GATEWAY_RUN_FORCE_MESSAGE = "Refusing to kill the operator's running gateway service from a non-interactive shell. Use an isolated dev gateway (openclaw gateway run --dev, or --profile <name> with a free port) for testing.";
//#endregion
export { NON_INTERACTIVE_GATEWAY_STOP_MESSAGE as n, isTerminalInteractive as r, NON_INTERACTIVE_GATEWAY_RUN_FORCE_MESSAGE as t };
