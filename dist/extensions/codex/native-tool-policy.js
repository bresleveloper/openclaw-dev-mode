//#region extensions/codex/native-tool-policy.ts
/** Capabilities exposed together by Codex native code mode. */
const CODEX_NATIVE_TOOL_REQUIREMENTS = [
	"exec",
	"process",
	"read",
	"write",
	"edit",
	"apply_patch"
];
const CODEX_TOOL_POLICY_SAFE_DENY_NAMES = [
	"web_fetch",
	"x_search",
	"memory_search",
	"memory_get",
	"dashboard",
	"canvas",
	"show_widget",
	"message",
	"heartbeat_respond",
	"automations",
	"gateway",
	"agents_list",
	"openclaw",
	"session_status",
	"progress_card",
	"skill_workshop",
	"image_generate",
	"music_generate",
	"video_generate",
	"tts"
];
//#endregion
export { CODEX_NATIVE_TOOL_REQUIREMENTS, CODEX_TOOL_POLICY_SAFE_DENY_NAMES };
