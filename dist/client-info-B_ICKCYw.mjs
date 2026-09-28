import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
//#region packages/gateway-protocol/src/client-info.ts
/**
* Shared gateway client identity contract.
*
* These values cross the WebSocket handshake boundary, so additions must stay
* aligned with protocol schemas and server policy checks.
*/
/** Canonical client ids accepted in gateway hello/connect payloads. */
const GATEWAY_CLIENT_IDS = {
	WEBCHAT_UI: "webchat-ui",
	CONTROL_UI: "openclaw-control-ui",
	BROWSER_COPILOT: "openclaw-browser-copilot",
	TUI: "openclaw-tui",
	WEBCHAT: "webchat",
	CLI: "cli",
	GATEWAY_CLIENT: "gateway-client",
	MACOS_APP: "openclaw-macos",
	LINUX_APP: "openclaw-linux",
	IOS_APP: "openclaw-ios",
	WATCHOS_APP: "openclaw-watchos",
	ANDROID_APP: "openclaw-android",
	NODE_HOST: "node-host",
	WORKER: "openclaw-worker",
	TEST: "test",
	FINGERPRINT: "fingerprint",
	PROBE: "openclaw-probe"
};
const GATEWAY_CLIENT_NAMES = GATEWAY_CLIENT_IDS;
/** Coarse modes let policy group clients without matching every product id. */
const GATEWAY_CLIENT_MODES = {
	WEBCHAT: "webchat",
	CLI: "cli",
	UI: "ui",
	BACKEND: "backend",
	NODE: "node",
	WORKER: "worker",
	PROBE: "probe",
	TEST: "test"
};
/** Capability flags a client may advertise during the gateway handshake. */
const GATEWAY_CLIENT_CAPS = {
	AGENT_KIND: "agent-kind",
	APPROVALS: "approvals",
	EXEC_APPROVALS: "exec-approvals",
	INLINE_WIDGETS: "inline-widgets",
	MODEL_CATALOG_SNAPSHOT: "model-catalog-snapshot",
	MODEL_SELECTION_POLICY: "model-selection-policy",
	RUN_TOOL_BINDINGS: "run-tool-bindings",
	SESSION_SCOPED_EVENTS: "session-scoped-events",
	SKILL_CURATOR_LIVE_INVENTORY: "skill-curator-live-inventory",
	PLUGIN_APPROVALS: "plugin-approvals",
	TASK_SUGGESTIONS: "task-suggestions",
	TERMINAL_OFFSET_SEQ: "terminal-offset-seq",
	TERMINAL_SESSION_METADATA: "terminal-session-metadata",
	TERMINAL_UPLOAD_PATH_STYLE: "terminal-upload-path-style",
	TOOL_EVENTS: "tool-events",
	UI_COMMANDS: "ui-commands",
	USAGE_REFRESHING: "usage-refreshing"
};
const GATEWAY_CLIENT_ID_SET = new Set(Object.values(GATEWAY_CLIENT_IDS));
const GATEWAY_CLIENT_MODE_SET = new Set(Object.values(GATEWAY_CLIENT_MODES));
/** Normalizes untrusted client ids and rejects unknown values. */
function normalizeGatewayClientId(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return;
	return GATEWAY_CLIENT_ID_SET.has(normalized) ? normalized : void 0;
}
/** Normalizes legacy client-name fields through the canonical client-id registry. */
function normalizeGatewayClientName(raw) {
	return normalizeGatewayClientId(raw);
}
/** Normalizes untrusted client modes and rejects unknown values. */
function normalizeGatewayClientMode(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return;
	return GATEWAY_CLIENT_MODE_SET.has(normalized) ? normalized : void 0;
}
/** Checks a client-advertised capability list without treating missing caps as errors. */
function hasGatewayClientCap(caps, cap) {
	if (!Array.isArray(caps)) return false;
	return caps.includes(cap);
}
//#endregion
export { hasGatewayClientCap as a, normalizeGatewayClientName as c, GATEWAY_CLIENT_NAMES as i, GATEWAY_CLIENT_IDS as n, normalizeGatewayClientId as o, GATEWAY_CLIENT_MODES as r, normalizeGatewayClientMode as s, GATEWAY_CLIENT_CAPS as t };
