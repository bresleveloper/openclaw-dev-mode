import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
//#region src/cli/windows-argv.ts
/** Remove duplicated Windows node launcher argv entries while preserving normal POSIX argv. */
function normalizeWindowsArgv(argv, options = {}) {
	if ((options.platform ?? process.platform) !== "win32") return argv;
	if (argv.length < 2) return argv;
	const stripControlChars = (value) => {
		let out = "";
		for (let i = 0; i < value.length; i += 1) {
			const code = value.charCodeAt(i);
			if (code >= 32 && code !== 127) out += value[i];
		}
		return out;
	};
	const normalizeArg = (value) => stripControlChars(value).replace(/^['"]+|['"]+$/g, "").trim();
	const normalizeCandidate = (value) => normalizeArg(value).replace(/^\\\\\\?\\/, "");
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
		return lower === execPathLower || base === execBase || lower.endsWith("\\node.exe") || lower.endsWith("/node.exe") || base === "node.exe";
	};
	const next = [...argv];
	for (const i = 1; i < next.length;) {
		if (isExecPath(next[i])) {
			next.splice(i, 1);
			continue;
		}
		break;
	}
	return next;
}
//#endregion
export { normalizeWindowsArgv as t };
