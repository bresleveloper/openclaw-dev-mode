import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { isRecord, normalizeBoundedOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import os from "node:os";
//#region extensions/acpx/src/pi-session-catalog-shared.ts
const PI_SESSIONS_LIST_COMMAND = "acpx.pi.sessions.list.v1";
const PI_SESSION_READ_COMMAND = "acpx.pi.sessions.read.v1";
const PI_TERMINAL_RESUME_COMMAND = "acpx.pi.terminal.resume.v1";
const PI_SESSIONS_CAPABILITY = "pi-sessions";
const PI_LOCAL_SESSION_HOST_ID = "gateway";
const PI_SESSION_ID_PATTERN = /^(?!-)[A-Za-z0-9._:-]{1,256}$/u;
//#endregion
//#region extensions/acpx/src/pi-session-paths.ts
function piHome(env) {
	return (process.platform === "win32" ? env.USERPROFILE?.trim() : env.HOME?.trim()) || os.homedir();
}
function isPiSessionCatalogPathAbsolute(value, platform = process.platform) {
	if (platform !== "win32") return path.posix.isAbsolute(value);
	const root = path.win32.parse(value).root;
	return path.win32.isAbsolute(value) && root !== "\\" && root !== "/";
}
function resolveConfiguredPath(value, env, relativeBase) {
	const home = piHome(env);
	let resolved = value;
	if (value === "~") resolved = home;
	if (value.startsWith("~/") || value.startsWith("~\\")) resolved = path.join(home, value.slice(2));
	if (!isPiSessionCatalogPathAbsolute(resolved)) {
		if (relativeBase) return path.resolve(relativeBase, resolved);
		throw new Error("Pi session catalog requires absolute or home-relative storage paths");
	}
	return path.resolve(resolved);
}
function settingsSessionDir(file) {
	try {
		const value = JSON.parse(readFileSync(file, "utf8"));
		return isRecord(value) ? normalizeBoundedOptionalString(value.sessionDir, 4096) : void 0;
	} catch {
		return;
	}
}
function piSessionStore(env, cwd = process.cwd()) {
	const customSessionDir = env.PI_CODING_AGENT_SESSION_DIR?.trim();
	if (customSessionDir) return {
		root: resolveConfiguredPath(customSessionDir, env),
		flat: true,
		usesProcessHomeFallback: false
	};
	const home = piHome(env);
	const customAgentDir = env.PI_CODING_AGENT_DIR?.trim();
	const agentDir = customAgentDir ? resolveConfiguredPath(customAgentDir, env) : path.join(home, ".pi", "agent");
	const projectSessionDir = settingsSessionDir(path.join(cwd, ".pi", "settings.json"));
	if (projectSessionDir) return {
		root: resolveConfiguredPath(projectSessionDir, env, path.join(cwd, ".pi")),
		flat: true,
		usesProcessHomeFallback: false
	};
	const globalSessionDir = settingsSessionDir(path.join(agentDir, "settings.json"));
	if (globalSessionDir) return {
		root: resolveConfiguredPath(globalSessionDir, env, agentDir),
		flat: true,
		usesProcessHomeFallback: false
	};
	return {
		root: path.join(agentDir, "sessions"),
		flat: false,
		usesProcessHomeFallback: !customAgentDir
	};
}
/** Store root scanned by pi-acp@0.0.26 when resolving a native session id. */
function piAcpSessionStoreRoot(env) {
	const configuredAgentDir = env.PI_CODING_AGENT_DIR?.trim();
	if (configuredAgentDir && !isPiSessionCatalogPathAbsolute(configuredAgentDir)) return;
	const agentDir = configuredAgentDir ? path.resolve(configuredAgentDir) : path.join(piHome(env), ".pi", "agent");
	return path.join(agentDir, "sessions");
}
function piSessionStoreAvailable(env, store) {
	try {
		return statSync((store ?? piSessionStore(env)).root).isDirectory();
	} catch {
		return false;
	}
}
//#endregion
export { PI_SESSIONS_CAPABILITY as a, PI_SESSION_READ_COMMAND as c, PI_LOCAL_SESSION_HOST_ID as i, PI_TERMINAL_RESUME_COMMAND as l, piSessionStore as n, PI_SESSIONS_LIST_COMMAND as o, piSessionStoreAvailable as r, PI_SESSION_ID_PATTERN as s, piAcpSessionStoreRoot as t };
