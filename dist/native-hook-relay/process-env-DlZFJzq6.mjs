//#region src/infra/process-env.ts
/** Read one environment value using the same Windows key precedence as child_process. */
function resolveEnvironmentValue(env, name, platform = process.platform) {
	if (!env) return;
	if (platform !== "win32") return env[name] ?? (name === "PATH" ? env.Path : void 0);
	const normalizedName = name.toUpperCase();
	const key = Object.keys(env).toSorted().find((candidate) => candidate.toUpperCase() === normalizedName);
	return key === void 0 ? void 0 : env[key];
}
/** Merge child environments while preserving Node's platform-specific key semantics. */
function mergeProcessEnv(sources, platform = process.platform) {
	const merged = {};
	for (const source of sources) {
		if (!source) continue;
		const keys = Object.keys(source);
		const sourceKeys = /* @__PURE__ */ new Set();
		for (const key of platform === "win32" ? keys.toSorted() : keys) {
			if (platform === "win32") {
				const normalizedKey = key.toUpperCase();
				if (sourceKeys.has(normalizedKey)) continue;
				sourceKeys.add(normalizedKey);
				for (const previousKey of Object.keys(merged)) if (previousKey.toUpperCase() === normalizedKey) delete merged[previousKey];
			}
			const value = source[key];
			if (value === void 0) delete merged[key];
			else merged[key] = value;
		}
	}
	return merged;
}
const DIAGNOSTIC_PROCESS_ENV_KEYS = /* @__PURE__ */ new Set([
	"PATH",
	"Path",
	"HOME",
	"USER",
	"LOGNAME",
	"TMPDIR",
	"TMP",
	"TEMP",
	"LANG",
	"LANGUAGE",
	"TZ",
	"LC_ALL",
	"LC_COLLATE",
	"LC_CTYPE",
	"LC_MESSAGES",
	"LC_MONETARY",
	"LC_NUMERIC",
	"LC_TIME",
	"LC_ADDRESS",
	"LC_IDENTIFICATION",
	"LC_MEASUREMENT",
	"LC_NAME",
	"LC_PAPER",
	"LC_TELEPHONE",
	"SYSTEMROOT",
	"WINDIR",
	"COMSPEC",
	"PATHEXT",
	"SYSTEMDRIVE",
	"USERPROFILE",
	"HOMEDRIVE",
	"HOMEPATH",
	"USERNAME",
	"USERDOMAIN",
	"APPDATA",
	"LOCALAPPDATA",
	"PROGRAMDATA",
	"ALLUSERSPROFILE",
	"PROGRAMFILES",
	"PROGRAMFILES(X86)",
	"PROGRAMW6432",
	"COMMONPROGRAMFILES",
	"COMMONPROGRAMFILES(X86)",
	"COMMONPROGRAMW6432",
	"PSMODULEANALYSISCACHEPATH"
]);
/** Project only native port/process diagnostic context; never mutate the parent environment. */
function resolveDiagnosticProcessEnv(env = process.env, platform = process.platform) {
	return Object.fromEntries(Object.entries(mergeProcessEnv([env], platform)).filter(([key]) => DIAGNOSTIC_PROCESS_ENV_KEYS.has(platform === "win32" ? key.toUpperCase() : key)));
}
//#endregion
export { resolveDiagnosticProcessEnv as n, resolveEnvironmentValue as r, mergeProcessEnv as t };
