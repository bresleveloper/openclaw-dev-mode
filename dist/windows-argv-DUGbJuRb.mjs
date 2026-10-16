import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
//#region src/cli/windows-argv.ts
const CONTROL_CHARS = new RegExp(String.raw`[\u0000-\u001f\u007f]`, "g");
/** Remove duplicated Windows node launcher argv entries while preserving normal POSIX argv. */
function normalizeWindowsArgv(argv, options = {}) {
	if ((options.platform ?? process.platform) !== "win32") return argv;
	if (argv.length < 2) return argv;
	const normalizeCandidate = (value) => value.replace(CONTROL_CHARS, "").replace(/^['"]+|['"]+$/g, "").trim().replace(/^\\\\\\?\\/, "");
	const basename = (value) => value.split(/[\\/]/).pop() ?? value;
	const execPath = normalizeCandidate(options.execPath ?? process.execPath);
	const execPathLower = normalizeLowercaseStringOrEmpty(execPath);
	const execBase = normalizeLowercaseStringOrEmpty(basename(execPath));
	const isExecPath = (value) => {
		if (!value) return false;
		const normalized = normalizeCandidate(value);
		if (!normalized) return false;
		const lower = normalizeLowercaseStringOrEmpty(normalized);
		const base = basename(lower);
		return lower === execPathLower || base === execBase || base === "node.exe";
	};
	const next = [...argv];
	while (isExecPath(next[1])) next.splice(1, 1);
	return next;
}
//#endregion
export { normalizeWindowsArgv as t };
