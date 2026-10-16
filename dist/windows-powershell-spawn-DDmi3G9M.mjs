import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
//#region src/infra/windows-powershell-spawn.ts
const WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS = 6e4;
function sanitizePowerShellOutputText(text) {
	return truncateUtf16Safe(text.split(/\r?\n/u).filter((line) => !line.toLowerCase().includes("encodedcommand")).join("\n").trim(), 1e3);
}
function buildPowerShellFailureCause(error) {
	const failure = error && typeof error === "object" ? error : {};
	const status = [
		typeof failure.status === "number" ? `status=${failure.status}` : "",
		typeof failure.code === "number" ? `exit=${failure.code}` : typeof failure.code === "string" ? `code=${failure.code}` : "",
		typeof failure.killed === "boolean" ? `killed=${failure.killed}` : "",
		typeof failure.signal === "string" ? `signal=${failure.signal}` : ""
	].filter(Boolean);
	const stderr = typeof failure.stderr === "string" ? sanitizePowerShellOutputText(failure.stderr) : "";
	const stdout = typeof failure.stdout === "string" ? sanitizePowerShellOutputText(failure.stdout) : "";
	const detail = stderr ? `stderr: ${stderr}` : stdout ? `stdout: ${stdout}` : "";
	return /* @__PURE__ */ new Error(`PowerShell failed${status.length ? ` (${status.join(", ")})` : ""}${detail ? `; ${detail}` : ""}`);
}
function buildEncodedPowerShellArgs(command) {
	return [
		"-NoLogo",
		"-NoProfile",
		"-NonInteractive",
		"-EncodedCommand",
		Buffer.from(command, "utf16le").toString("base64")
	];
}
//#endregion
export { buildEncodedPowerShellArgs as n, buildPowerShellFailureCause as r, WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS as t };
