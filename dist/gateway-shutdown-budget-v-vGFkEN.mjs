//#region gateway-shutdown-budget.mjs
const GATEWAY_RESTART_REPLACEMENT_TIMEOUT_MS = 6e4;
const GATEWAY_SHUTDOWN_RESERVE_MS = 1e4;
const GATEWAY_SUPERVISOR_EXIT_MARGIN_MS = 5e3;
const GATEWAY_SHUTDOWN_TIMEOUT_MS = 325e3;
const GATEWAY_SERVICE_STOP_TIMEOUT_MS = 33e4;
const GATEWAY_SUPERVISOR_EXIT_MARGIN_SHARE = .25;
const GATEWAY_SHUTDOWN_DRAIN_FLOOR_MS = 5e3;
const GATEWAY_SHUTDOWN_DRAIN_FLOOR_SHARE = .5;
/** The exit margin to hold back from a supervisor-enforced stop deadline. */
const resolveSupervisorExitMarginMs = (stopTimeoutMs) => Math.min(GATEWAY_SUPERVISOR_EXIT_MARGIN_MS, Math.floor(Math.max(0, stopTimeoutMs) * GATEWAY_SUPERVISOR_EXIT_MARGIN_SHARE));
/** The post-drain reserve to hold back from a resolved shutdown budget. */
const resolveShutdownReserveMs = (shutdownTimeoutMs) => {
	const budgetMs = Math.max(0, shutdownTimeoutMs);
	const drainFloorMs = Math.min(GATEWAY_SHUTDOWN_DRAIN_FLOOR_MS, Math.floor(budgetMs * GATEWAY_SHUTDOWN_DRAIN_FLOOR_SHARE));
	return Math.min(GATEWAY_SHUTDOWN_RESERVE_MS, budgetMs - drainFloorMs);
};
const RESPAWN_SIGNAL_EXIT_GRACE_MS = 1e3;
const RESPAWN_SIGNAL_FORCE_KILL_GRACE_MS = 1e3;
const RESPAWN_SIGNAL_HARD_EXIT_GRACE_MS = 1e3;
const resolveRespawnServiceStopTimeoutMs = (env, platform) => {
	const launchdService = env.OPENCLAW_LAUNCHD_LABEL?.trim();
	return platform === "darwin" && launchdService && env.XPC_SERVICE_NAME === launchdService ? 2e4 : GATEWAY_SERVICE_STOP_TIMEOUT_MS;
};
const RESPAWN_LAUNCHER_MARKER_ENV_VARS = [
	"OPENCLAW_NODE_UPDATE_RESPAWNED",
	"OPENCLAW_COMPILE_CACHE_DISABLED_RESPAWNED",
	"OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED"
];
/** Whether a `runRespawnedChild` parent started this process. */
const isRespawnedByLauncher = (env) => RESPAWN_LAUNCHER_MARKER_ENV_VARS.some((name) => env[name] === "1");
const resolveLauncherStopTimeoutMs = ({ env, platform, foreground }) => {
	const serviceStopTimeoutMs = resolveRespawnServiceStopTimeoutMs(env, platform);
	return (platform !== "win32" && foreground ? serviceStopTimeoutMs - RESPAWN_SIGNAL_FORCE_KILL_GRACE_MS - RESPAWN_SIGNAL_HARD_EXIT_GRACE_MS : RESPAWN_SIGNAL_EXIT_GRACE_MS) + RESPAWN_SIGNAL_FORCE_KILL_GRACE_MS;
};
//#endregion
export { GATEWAY_SUPERVISOR_EXIT_MARGIN_MS as a, isRespawnedByLauncher as c, resolveSupervisorExitMarginMs as d, GATEWAY_SHUTDOWN_TIMEOUT_MS as i, resolveLauncherStopTimeoutMs as l, GATEWAY_SERVICE_STOP_TIMEOUT_MS as n, RESPAWN_SIGNAL_FORCE_KILL_GRACE_MS as o, GATEWAY_SHUTDOWN_RESERVE_MS as r, RESPAWN_SIGNAL_HARD_EXIT_GRACE_MS as s, GATEWAY_RESTART_REPLACEMENT_TIMEOUT_MS as t, resolveShutdownReserveMs as u };
