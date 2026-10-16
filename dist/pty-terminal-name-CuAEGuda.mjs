//#region src/process/pty-terminal-name.ts
const DEFAULT_PTY_TERMINAL_NAME = "xterm-256color";
function resolvePtyTerminalName(value) {
	const normalized = value?.trim();
	return !normalized || normalized.toLowerCase() === "dumb" ? DEFAULT_PTY_TERMINAL_NAME : normalized;
}
function setPtyTerminalName(params) {
	if (params.platform === "win32") {
		for (const key of Object.keys(params.env)) if (key !== "TERM" && key.toLowerCase() === "term") delete params.env[key];
	}
	params.env.TERM = params.name;
}
//#endregion
export { setPtyTerminalName as n, resolvePtyTerminalName as t };
