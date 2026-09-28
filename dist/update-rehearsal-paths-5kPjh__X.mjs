import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import path from "node:path";
//#region src/infra/update-rehearsal-paths.ts
/** Declare the private filesystem namespace shared by every rehearsal child. */
function buildUpdateRehearsalPathEnv(root) {
	return {
		HOME: root,
		USERPROFILE: root,
		TMPDIR: root,
		TMP: root,
		TEMP: root,
		XDG_CONFIG_HOME: path.join(root, "config"),
		XDG_CACHE_HOME: path.join(root, "cache"),
		XDG_DATA_HOME: path.join(root, "data"),
		XDG_STATE_HOME: path.join(root, "state"),
		OPENCLAW_HOME: root,
		OPENCLAW_STATE_DIR: root,
		OPENCLAW_CONFIG_PATH: path.join(root, "openclaw.json"),
		OPENCLAW_WORKSPACE_DIR: path.join(root, "workspace"),
		OPENCLAW_SKIP_CHANNELS: "1",
		OPENCLAW_SKIP_PROVIDERS: "1",
		OPENCLAW_SKIP_CRON: "1",
		OPENCLAW_SKIP_GMAIL_WATCHER: "1",
		OPENCLAW_SKIP_CANVAS_HOST: "1",
		OPENCLAW_SKIP_BROWSER_CONTROL_SERVER: "1",
		OPENCLAW_SKIP_STARTUP_MODEL_PREWARM: "1",
		OPENCLAW_NO_AUTO_UPDATE: "1",
		NODE_DISABLE_COMPILE_CACHE: "1"
	};
}
/** Recognize the complete 9.3+ driver contract; update-in-progress alone is also used by live Doctor. */
function resolveUpdateRehearsalRoot(env) {
	const root = env.OPENCLAW_STATE_DIR;
	if (!root || !path.isAbsolute(root) || !["0", "1"].includes(env.OPENCLAW_UPDATE_IN_PROGRESS ?? "") || Object.entries(buildUpdateRehearsalPathEnv(root)).some(([key, value]) => env[key] !== value) || env.OPENCLAW_SERVICE_REPAIR_POLICY !== "external" || env.OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR !== "0" || env.OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION !== "0" || Boolean(env.OPENCLAW_COMPATIBILITY_HOST_VERSION)) return;
	return path.resolve(root);
}
/** Uncopied absolute locators remain inventory; they cannot grant writes outside the private root. */
function isUpdateRehearsalReadOnlyPath(filePath, env) {
	const root = resolveUpdateRehearsalRoot(env);
	if (!root) return false;
	const resolved = path.resolve(filePath);
	return !isPathInside(root, resolved) || !isPathInside(resolveIdentityPathViaExistingAncestorSync(root), resolveIdentityPathViaExistingAncestorSync(resolved));
}
//#endregion
export { isUpdateRehearsalReadOnlyPath as n, resolveUpdateRehearsalRoot as r, buildUpdateRehearsalPathEnv as t };
