import { n as createWindowsJobBindings } from "../service-child-windows-job-native-DZ9lDQG9.mjs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
//#region scripts/lib/direct-run.mjs
/**
* Return whether a direct-run path points at the current module path.
* @internal Directly tested script implementation detail.
* @param {string | undefined} directPath
* @param {string | undefined} modulePath
* @param {NodeJS.Platform} [platform]
* @returns {boolean}
*/
function isDirectRunPath(directPath, modulePath, platform = process.platform) {
	if (!directPath || !modulePath) return false;
	const pathImpl = platform === "win32" ? path.win32 : path;
	/** @type {(value: string) => string} */
	const normalize = platform === "win32" ? (value) => pathImpl.resolve(value).toLowerCase() : (value) => pathImpl.resolve(value);
	return normalize(directPath) === normalize(modulePath);
}
/**
* Return whether a direct-run path points at the current module URL.
* @param {string | undefined} directPath
* @param {string} moduleUrl
* @param {NodeJS.Platform} [platform]
* @returns {boolean}
*/
function isDirectRunUrl(directPath, moduleUrl, platform = process.platform) {
	return isDirectRunPath(directPath, fileURLToPath(moduleUrl), platform);
}
//#endregion
//#region scripts/lib/managed-windows-job-launcher.mts
const name = process.argv[2];
const send = (message) => process.send?.({
	job: name,
	...message
});
const fail = (error, type = "error") => {
	process.exitCode = 1;
	if (process.connected) process.send?.({
		job: name,
		type,
		error: error instanceof Error ? error.message : String(error),
		...error && typeof error === "object" && "code" in error ? { code: error.code } : {}
	}, () => process.disconnect?.());
};
if (isDirectRunUrl(process.argv[1], import.meta.url)) try {
	if (!name || !process.connected) throw new Error("Windows command Job handoff is missing");
	const koffi = createRequire(import.meta.url)("koffi");
	const api = createWindowsJobBindings(koffi);
	api.assertLayouts();
	const job = api.requireHandle(api.OpenJobObjectW(1, 0, name), "OpenJobObjectW(tooling)");
	const assignmentError = api.AssignProcessToJobObject(job, api.GetCurrentProcess()) ? void 0 : api.lastError("AssignProcessToJobObject(tooling launcher)");
	const closed = api.CloseHandle(job);
	if (assignmentError) throw assignmentError;
	if (!closed) throw api.lastError("CloseHandle(launcher Job copy)");
	process.once("message", (launch) => {
		try {
			const child = spawn(launch.command, launch.args, {
				...launch.options,
				stdio: launch.stdio
			});
			child.once("error", fail);
			child.once("spawn", () => {
				process.send?.({
					job: name,
					type: "spawned",
					pid: child.pid
				}, (error) => {
					if (error) fail(error);
					else if (!launch.stdio.includes("ipc")) process.disconnect?.();
				});
			});
			child.once("exit", (code) => {
				process.exitCode = code ?? 1;
			});
			if (launch.stdio.includes("ipc")) {
				process.on("message", (message) => {
					if (message !== null && child.connected) child.send(message, (error) => error && fail(error));
				});
				child.on("message", (message) => {
					if (process.connected) process.send?.(message, (error) => error && fail(error));
				});
				process.once("disconnect", () => child.connected && child.disconnect());
				child.once("disconnect", () => process.connected && process.disconnect?.());
			}
		} catch (error) {
			fail(error);
		}
	});
	send({ type: "ready" });
} catch (error) {
	fail(error, "job-error");
}
//#endregion
export {};
