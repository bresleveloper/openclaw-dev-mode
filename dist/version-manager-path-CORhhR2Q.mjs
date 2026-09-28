import path from "node:path";
//#region src/shared/version-manager-path.ts
const COMMON_VERSION_MANAGER_MARKERS = [
	"/.nvm/",
	"/.fnm/",
	"/.local/share/fnm/",
	"/.volta/",
	"/.asdf/",
	"/.n/",
	"/.nodenv/",
	"/.nodebrew/",
	"/nvs/"
];
/** Classify the selected executable, not merely an installed manager in the environment. */
function resolveNodeVersionManager(executable, env) {
	const normalized = path.posix.normalize(executable.replaceAll("\\", "/")).toLowerCase();
	for (const [manager, key] of [
		["nvm", "NVM_DIR"],
		["fnm", "FNM_DIR"],
		["volta", "VOLTA_HOME"]
	]) {
		const root = env[key] ? path.posix.normalize(env[key].replaceAll("\\", "/")).replace(/\/$/, "").toLowerCase() : void 0;
		if (root && normalized.startsWith(`${root}/`)) return manager;
		if (COMMON_VERSION_MANAGER_MARKERS.some((marker) => marker.includes(manager) && normalized.includes(marker))) return manager;
	}
	if (normalized.includes("/library/application support/fnm/")) return "fnm";
	return matchesVersionManagerPath(normalized, "daemon-runtime") ? "other" : "system";
}
function matchesVersionManagerPath(path, profile) {
	return COMMON_VERSION_MANAGER_MARKERS.some((marker) => path.includes(marker)) || profile !== "service-path" && path.includes("/.local/share/mise/") || profile === "linux-ca" && path.includes("/.nvs/") || profile === "daemon-runtime" && path.includes("/library/application support/fnm/");
}
//#endregion
export { resolveNodeVersionManager as n, matchesVersionManagerPath as t };
