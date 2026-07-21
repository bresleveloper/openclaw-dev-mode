import { execFile } from "node:child_process";
//#region src/daemon/exec-file.ts
/** Child-process wrapper used by daemon installers to preserve stdout/stderr on failure. */
/** Runs a child process as UTF-8 and returns exit data instead of throwing on nonzero exit. */
async function execFileUtf8(command, args, options = {}) {
	return await new Promise((resolve) => {
		execFile(command, args, {
			...options,
			encoding: "utf8"
		}, (error, stdout, stderr) => {
			if (!error) {
				resolve({
					stdout: stdout ?? "",
					stderr: stderr ?? "",
					code: 0
				});
				return;
			}
			const e = error;
			resolve({
				stdout: stdout ?? "",
				stderr: (stderr ?? "") || (typeof e.message === "string" ? e.message : typeof error === "string" ? error : ""),
				code: typeof e.code === "number" ? e.code : 1
			});
		});
	});
}
//#endregion
export { execFileUtf8 as t };
