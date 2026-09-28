import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
//#region src/process/pty-terminal-name.ts
const DEFAULT_PTY_TERMINAL_NAME = "xterm-256color";
function readPtyTerminalName(env, platform) {
	return resolveEnvironmentValue(env, "TERM", platform);
}
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
export { resolvePtyTerminalName as n, setPtyTerminalName as r, readPtyTerminalName as t };
