//#region src/cli/tui-cli-options.ts
/** Add the shared Gateway connection flags used by terminal attach commands. */
function addTuiOptions(command) {
	return command.option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--password <password>", "Gateway password (if required)").option("--tls-fingerprint <sha256>", "Expected Gateway TLS certificate fingerprint");
}
//#endregion
export { addTuiOptions as t };
