import { r as STATE_DIR } from "./paths-DehQwyE0.mjs";
import { t as CHANNEL_IDS } from "./ids-NACrHrny.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.mjs";
import path from "node:path";
//#region src/agents/sandbox/constants.ts
/**
* Sandbox defaults and state paths.
*
* Centralizes image names, container prefixes, workspace paths, browser ports, and registry locations.
*/
const DEFAULT_SANDBOX_WORKSPACE_ROOT = path.join(STATE_DIR, "sandboxes");
const DEFAULT_SANDBOX_IMAGE = "openclaw-sandbox:bookworm-slim";
const DEFAULT_SANDBOX_CONTAINER_PREFIX = "openclaw-sbx-";
const DEFAULT_SANDBOX_WORKDIR = "/workspace";
const DEFAULT_SANDBOX_IDLE_HOURS = 24;
const DEFAULT_SANDBOX_MAX_AGE_DAYS = 7;
const SANDBOX_COMMAND_MAX_BUFFER_BYTES = 104857600;
const DEFAULT_TOOL_ALLOW = [
	"exec",
	"process",
	"read",
	"ls",
	"write",
	"edit",
	"apply_patch",
	"view_image",
	"sessions_list",
	"sessions_history",
	"sessions_search",
	"sessions_send",
	"sessions_spawn",
	"sessions_yield",
	"subagents",
	"session_status"
];
const DEFAULT_TOOL_DENY = [
	"browser",
	"canvas",
	"computer",
	"mobile_ui",
	"nodes",
	AUTOMATIONS_TOOL_NAME,
	"gateway",
	...CHANNEL_IDS
];
const DEFAULT_SANDBOX_BROWSER_IMAGE = "openclaw-sandbox-browser:bookworm-slim";
const DEFAULT_SANDBOX_COMMON_IMAGE = "openclaw-sandbox-common:bookworm-slim";
const SANDBOX_BROWSER_SECURITY_HASH_EPOCH = "2026-05-12-cdp-relay-auth";
const SANDBOX_BROWSER_IMAGE_CONTRACT_EPOCH = "2026-05-12-cdp-relay-auth";
const SANDBOX_DOCKER_CREATE_ARGS_EPOCH = "2026-08-25-container-env-file";
const DEFAULT_SANDBOX_BROWSER_PREFIX = "openclaw-sbx-browser-";
const DEFAULT_SANDBOX_BROWSER_CDP_PORT = 9222;
const DEFAULT_SANDBOX_BROWSER_VNC_PORT = 5900;
const DEFAULT_SANDBOX_BROWSER_NOVNC_PORT = 6080;
const DEFAULT_SANDBOX_BROWSER_AUTOSTART_TIMEOUT_MS = 12e3;
const SANDBOX_AGENT_WORKSPACE_MOUNT = "/agent";
const SANDBOX_STATE_DIR = path.join(STATE_DIR, "sandbox");
const SANDBOX_REGISTRY_PATH = path.join(SANDBOX_STATE_DIR, "containers.json");
const SANDBOX_BROWSER_REGISTRY_PATH = path.join(SANDBOX_STATE_DIR, "browsers.json");
const SANDBOX_CONTAINERS_DIR = path.join(SANDBOX_STATE_DIR, "containers");
const SANDBOX_BROWSERS_DIR = path.join(SANDBOX_STATE_DIR, "browsers");
//#endregion
export { SANDBOX_DOCKER_CREATE_ARGS_EPOCH as C, SANDBOX_CONTAINERS_DIR as S, SANDBOX_STATE_DIR as T, SANDBOX_BROWSERS_DIR as _, DEFAULT_SANDBOX_BROWSER_PREFIX as a, SANDBOX_BROWSER_SECURITY_HASH_EPOCH as b, DEFAULT_SANDBOX_CONTAINER_PREFIX as c, DEFAULT_SANDBOX_MAX_AGE_DAYS as d, DEFAULT_SANDBOX_WORKDIR as f, SANDBOX_AGENT_WORKSPACE_MOUNT as g, DEFAULT_TOOL_DENY as h, DEFAULT_SANDBOX_BROWSER_NOVNC_PORT as i, DEFAULT_SANDBOX_IDLE_HOURS as l, DEFAULT_TOOL_ALLOW as m, DEFAULT_SANDBOX_BROWSER_CDP_PORT as n, DEFAULT_SANDBOX_BROWSER_VNC_PORT as o, DEFAULT_SANDBOX_WORKSPACE_ROOT as p, DEFAULT_SANDBOX_BROWSER_IMAGE as r, DEFAULT_SANDBOX_COMMON_IMAGE as s, DEFAULT_SANDBOX_BROWSER_AUTOSTART_TIMEOUT_MS as t, DEFAULT_SANDBOX_IMAGE as u, SANDBOX_BROWSER_IMAGE_CONTRACT_EPOCH as v, SANDBOX_REGISTRY_PATH as w, SANDBOX_COMMAND_MAX_BUFFER_BYTES as x, SANDBOX_BROWSER_REGISTRY_PATH as y };
