import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
//#region src/daemon/constants.ts
/** Cross-platform daemon service names, labels, and profile-aware descriptions. */
const GATEWAY_LAUNCH_AGENT_LABEL = "ai.openclaw.gateway";
const GATEWAY_SYSTEMD_SERVICE_NAME = "openclaw-gateway";
const GATEWAY_WINDOWS_TASK_NAME = "OpenClaw Gateway";
const GATEWAY_SERVICE_MARKER = "openclaw";
const GATEWAY_SERVICE_KIND = "gateway";
const GATEWAY_SERVICE_RUNTIME_PID_ENV = "OPENCLAW_GATEWAY_SERVICE_PID";
const GATEWAY_SERVICE_SELECTOR_ENV_KEYS = [
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_PROFILE",
	"OPENCLAW_GATEWAY_PORT",
	"OPENCLAW_LAUNCHD_LABEL",
	"OPENCLAW_SYSTEMD_UNIT",
	"OPENCLAW_WINDOWS_TASK_NAME"
];
function isGatewayServiceEnv(env) {
	if (env.OPENCLAW_SERVICE_MARKER?.trim() !== "openclaw") return false;
	const serviceKind = env.OPENCLAW_SERVICE_KIND?.trim();
	return !serviceKind || serviceKind === "gateway";
}
const NODE_LAUNCH_AGENT_LABEL = "ai.openclaw.node";
const NODE_SYSTEMD_SERVICE_NAME = "openclaw-node";
const NODE_WINDOWS_TASK_NAME = "OpenClaw Node";
const NODE_SERVICE_MARKER = "openclaw";
const NODE_SERVICE_KIND = "node";
const NODE_WINDOWS_TASK_SCRIPT_NAME = "node.cmd";
const LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES = ["clawdbot-gateway"];
function normalizeGatewayProfile(profile) {
	const trimmed = profile?.trim();
	if (!trimmed || normalizeLowercaseStringOrEmpty(trimmed) === "default") return null;
	return trimmed;
}
function resolveGatewayProfileSuffix(profile) {
	const normalized = normalizeGatewayProfile(profile);
	return normalized ? `-${normalized}` : "";
}
function resolveGatewayLaunchAgentLabel(profile) {
	const normalized = normalizeGatewayProfile(profile);
	if (!normalized) return GATEWAY_LAUNCH_AGENT_LABEL;
	return `ai.openclaw.${normalized}`;
}
function resolveGatewaySystemdServiceName(profile) {
	return `${GATEWAY_SYSTEMD_SERVICE_NAME}${resolveGatewayProfileSuffix(profile)}`;
}
function isAmbiguousLegacyGatewayCandidate(legacyName) {
	return legacyName === NODE_SYSTEMD_SERVICE_NAME || legacyName === GATEWAY_SYSTEMD_SERVICE_NAME || legacyName.startsWith(`${GATEWAY_SYSTEMD_SERVICE_NAME}-`);
}
/**
* Service-name candidates for a profile, preferred order.
*
* Current installs use `openclaw-gateway[-profile]`. Older multi-agent hosts
* used `openclaw-<profile>` (no "gateway" segment). Doctor/runtime resolution
* must try both for the same profile before scanning unrelated units.
*/
function resolveGatewaySystemdServiceNameCandidates(profile) {
	const canonical = resolveGatewaySystemdServiceName(profile);
	const suffix = resolveGatewayProfileSuffix(profile);
	if (!suffix) return [canonical, "openclaw"];
	const legacy = `openclaw${suffix}`;
	if (isAmbiguousLegacyGatewayCandidate(legacy)) return [canonical];
	return [canonical, legacy];
}
function resolveGatewayWindowsTaskName(profile) {
	const normalized = normalizeGatewayProfile(profile);
	if (!normalized) return GATEWAY_WINDOWS_TASK_NAME;
	return `OpenClaw Gateway (${normalized})`;
}
function normalizeWindowsTaskIdentity(value) {
	return value.replace(/^\\+/, "").toLowerCase();
}
function resolveGatewayNativeServiceIdentityConflict(env, platform = process.platform) {
	const profile = normalizeGatewayProfile(env.OPENCLAW_PROFILE);
	if (!profile) return null;
	if (platform === "darwin") {
		const envKey = "OPENCLAW_LAUNCHD_LABEL";
		const actual = env[envKey]?.trim();
		const expected = resolveGatewayLaunchAgentLabel(profile);
		return actual && actual !== expected ? {
			envKey,
			expected
		} : null;
	}
	if (platform === "linux") {
		const envKey = "OPENCLAW_SYSTEMD_UNIT";
		const actual = env[envKey]?.trim();
		const normalizedActual = actual?.endsWith(".service") ? actual : actual && `${actual}.service`;
		const expected = `${resolveGatewaySystemdServiceName(profile)}.service`;
		return normalizedActual && normalizedActual !== expected ? {
			envKey,
			expected
		} : null;
	}
	if (platform === "win32") {
		const envKey = "OPENCLAW_WINDOWS_TASK_NAME";
		const actual = env[envKey]?.trim();
		const expected = resolveGatewayWindowsTaskName(profile);
		return actual && normalizeWindowsTaskIdentity(actual) !== normalizeWindowsTaskIdentity(expected) ? {
			envKey,
			expected
		} : null;
	}
	return null;
}
function formatGatewayServiceDescription(profile) {
	const normalized = normalizeGatewayProfile(profile);
	if (!normalized) return "OpenClaw Gateway";
	return `OpenClaw Gateway (profile: ${normalized})`;
}
function resolveGatewayServiceDescription(params) {
	return params.description ?? formatGatewayServiceDescription(params.env.OPENCLAW_PROFILE);
}
function resolveNodeLaunchAgentLabel() {
	return NODE_LAUNCH_AGENT_LABEL;
}
function resolveNodeSystemdServiceName() {
	return NODE_SYSTEMD_SERVICE_NAME;
}
function resolveNodeWindowsTaskName() {
	return NODE_WINDOWS_TASK_NAME;
}
function resolveNodeServiceIdentityEnvironment() {
	return {
		OPENCLAW_LAUNCHD_LABEL: resolveNodeLaunchAgentLabel(),
		OPENCLAW_SYSTEMD_UNIT: resolveNodeSystemdServiceName(),
		OPENCLAW_WINDOWS_TASK_NAME: resolveNodeWindowsTaskName(),
		OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER: "1",
		OPENCLAW_TASK_SCRIPT_NAME: NODE_WINDOWS_TASK_SCRIPT_NAME,
		OPENCLAW_LOG_PREFIX: "node",
		OPENCLAW_SERVICE_MARKER: NODE_SERVICE_MARKER,
		OPENCLAW_SERVICE_KIND: NODE_SERVICE_KIND
	};
}
//#endregion
export { resolveNodeLaunchAgentLabel as _, GATEWAY_SERVICE_SELECTOR_ENV_KEYS as a, resolveNodeWindowsTaskName as b, isGatewayServiceEnv as c, resolveGatewayNativeServiceIdentityConflict as d, resolveGatewayProfileSuffix as f, resolveGatewayWindowsTaskName as g, resolveGatewaySystemdServiceNameCandidates as h, GATEWAY_SERVICE_RUNTIME_PID_ENV as i, normalizeWindowsTaskIdentity as l, resolveGatewaySystemdServiceName as m, GATEWAY_SERVICE_KIND as n, LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES as o, resolveGatewayServiceDescription as p, GATEWAY_SERVICE_MARKER as r, NODE_SERVICE_KIND as s, GATEWAY_LAUNCH_AGENT_LABEL as t, resolveGatewayLaunchAgentLabel as u, resolveNodeServiceIdentityEnvironment as v, resolveNodeSystemdServiceName as y };
