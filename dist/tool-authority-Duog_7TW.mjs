//#region src/worker/tool-authority.ts
const WORKER_REQUIRED_LOCAL_TOOL_NAMES = [
	"read",
	"write",
	"edit",
	"apply_patch",
	"exec",
	"process"
];
const WORKER_OPTIONAL_LOCAL_TOOL_NAMES = ["browser", "computer"];
const WORKER_LOCAL_TOOL_NAMES = [...WORKER_REQUIRED_LOCAL_TOOL_NAMES, ...WORKER_OPTIONAL_LOCAL_TOOL_NAMES];
/** Gateway-proxied tools exposed through the closed worker protocol. */
const WORKER_SESSION_TOOL_NAMES = [
	"skill_workshop",
	"sessions_spawn",
	"sessions_send",
	"portal"
];
const WORKER_TOOL_NAMES = [...WORKER_LOCAL_TOOL_NAMES, ...WORKER_SESSION_TOOL_NAMES];
const WORKER_TOOL_NAME_SET = new Set(WORKER_TOOL_NAMES);
function isWorkerToolName(value) {
	return typeof value === "string" && WORKER_TOOL_NAME_SET.has(value);
}
//#endregion
export { isWorkerToolName as a, WORKER_TOOL_NAMES as i, WORKER_REQUIRED_LOCAL_TOOL_NAMES as n, WORKER_SESSION_TOOL_NAMES as r, WORKER_LOCAL_TOOL_NAMES as t };
