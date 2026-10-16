import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as resolveDiagnosticProcessEnv, t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
//#region src/daemon/service-process-env.ts
const SERVICE_MANAGER_ENV_KEYS = /* @__PURE__ */ new Set([
	"TERM",
	"COLORTERM",
	"NO_COLOR",
	"DBUS_SESSION_BUS_ADDRESS",
	"DBUS_SYSTEM_BUS_ADDRESS",
	"XDG_RUNTIME_DIR",
	"XDG_CONFIG_HOME",
	"XDG_CONFIG_DIRS",
	"XDG_DATA_HOME",
	"XDG_DATA_DIRS",
	"SYSTEMD_UNIT_PATH",
	"SUDO_USER",
	"SUDO_UID",
	"SUDO_GID",
	"SYSTEMD_OFFLINE",
	"SYSTEMD_IN_CHROOT",
	"SYSTEMD_BUS_TIMEOUT"
]);
/** Native controls receive OS context; service definitions and payloads keep their own env. */
function resolveServiceManagerEnv(source = process.env) {
	const native = resolveDiagnosticProcessEnv(source);
	for (const [key, value] of Object.entries(mergeProcessEnv([source]))) if (SERVICE_MANAGER_ENV_KEYS.has(process.platform === "win32" ? key.toUpperCase() : key)) native[key] = value;
	return native;
}
function resolveTaskUser(env) {
	const username = env.USERNAME || env.USER || env.LOGNAME;
	if (!username) return null;
	const domain = env.USERDOMAIN;
	if (username.includes("\\") || !domain || normalizeLowercaseStringOrEmpty(domain) === "workgroup") return username;
	return `${domain}\\${username}`;
}
//#endregion
export { resolveTaskUser as n, resolveServiceManagerEnv as t };
