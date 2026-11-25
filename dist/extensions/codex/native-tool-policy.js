// extensions/codex/native-tool-policy.ts
/** Capabilities exposed together by Codex native code mode. */
const CODEX_NATIVE_TOOL_REQUIREMENTS = [
	"exec",
	"process",
	"read",
	"write",
	"edit",
	"apply_patch"
];
/** OpenClaw tools whose denial is enforced by disabling Codex native delegation. */
const CODEX_NATIVE_DELEGATION_DENY_NAMES = [
	"sessions_send",
	"sessions_list",
	"sessions_history",
	"sessions_search",
	"sessions_spawn",
	"subagents",
	"conversations_list",
	"conversations_send",
	"conversations_turn"
];
const CODEX_NATIVE_DELEGATION_DENY_SET = new Set(CODEX_NATIVE_DELEGATION_DENY_NAMES);
/** True when a safe-denied tool requires native delegation to be disabled for the run. */
function deniesCodexNativeDelegation(safeDeniedTools) {
	return safeDeniedTools?.some((name) => CODEX_NATIVE_DELEGATION_DENY_SET.has(name)) === true;
}
const CODEX_TOOL_POLICY_SAFE_DENY_NAMES = [
	"web_fetch",
	"x_search",
	"memory_search",
	"memory_get",
	"dashboard",
	"canvas",
	"show_widget",
	"message",
	"automations",
	"gateway",
	"agents_list",
	"openclaw",
	"session_status",
	"progress_card",
	"skill_workshop",
	"skill_library",
	"image_generate",
	"music_generate",
	"video_generate",
	"tts",
	...CODEX_NATIVE_DELEGATION_DENY_NAMES
];
export { CODEX_NATIVE_TOOL_REQUIREMENTS, CODEX_TOOL_POLICY_SAFE_DENY_NAMES, deniesCodexNativeDelegation };
