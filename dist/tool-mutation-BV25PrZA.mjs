import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as isAutomationsToolName } from "./automations-tool-name-DBMZPbPL.mjs";
import { s as isComputerObservationAction } from "./computer-tool-shared-B6dQ6PvX.mjs";
//#region src/agents/tool-mutation.ts
/** Tool mutation and replay-safety classification. */
const READ_ONLY_ACTIONS = /* @__PURE__ */ new Set([
	"get",
	"list",
	"read",
	"status",
	"show",
	"fetch",
	"search",
	"query",
	"view",
	"poll",
	"log",
	"inspect",
	"check",
	"probe",
	"runs"
]);
const PROCESS_MUTATING_ACTIONS = /* @__PURE__ */ new Set([
	"write",
	"send_keys",
	"submit",
	"paste",
	"kill",
	"clear",
	"remove"
]);
const PROCESS_REPLAY_SAFE_ACTIONS = /* @__PURE__ */ new Set(["list", "log"]);
const MESSAGE_READ_ONLY_ACTIONS = /* @__PURE__ */ new Set([
	"reactions",
	"read",
	"list_pins",
	"permissions",
	"thread_list",
	"search",
	"sticker_search",
	"member_info",
	"role_info",
	"emoji_list",
	"channel_info",
	"channel_list",
	"voice_status",
	"event_list"
]);
const REPLAY_SAFE_TOOL_NAMES = /* @__PURE__ */ new Set([
	"agents_list",
	"conversations_list",
	"find",
	"get_goal",
	"glob",
	"grep",
	"view_image",
	"ls",
	"memory_get",
	"pdf",
	"read",
	"search",
	"sessions_history",
	"sessions_list",
	"sessions_search",
	"tool_describe",
	"tool_search",
	"web_fetch",
	"web_search",
	"x_search"
]);
const BROWSER_READ_ONLY_ACTIONS = /* @__PURE__ */ new Set([
	"console",
	"profiles",
	"snapshot",
	"status",
	"tabs"
]);
const MOBILE_UI_REPLAY_SAFE_ACTIONS = /* @__PURE__ */ new Set(["observe"]);
const GATEWAY_REPLAY_SAFE_ACTIONS = /* @__PURE__ */ new Set(["config.get", "config.schema.lookup"]);
const NODES_REPLAY_SAFE_ACTIONS = /* @__PURE__ */ new Set([
	"status",
	"describe",
	"pending"
]);
const READ_ONLY_SHELL_COMMANDS = /* @__PURE__ */ new Set([
	"cat",
	"grep",
	"head",
	"ls",
	"pwd",
	"rg",
	"stat",
	"tail",
	"wc"
]);
const READ_ONLY_GH_PR_SUBCOMMANDS = /* @__PURE__ */ new Set([
	"checks",
	"diff",
	"list",
	"status",
	"view"
]);
const READ_ONLY_GH_ISSUE_SUBCOMMANDS = /* @__PURE__ */ new Set([
	"list",
	"status",
	"view"
]);
const UNSAFE_RG_FLAGS = /* @__PURE__ */ new Set([
	"--hostname-bin",
	"--pre",
	"--pre-glob",
	"--search-zip",
	"-z"
]);
const UNSAFE_RG_VALUE_FLAGS = [
	"--hostname-bin",
	"--pre",
	"--pre-glob"
];
const SHELL_EXPANSION_CHARS = /* @__PURE__ */ new Set([
	"$",
	"*",
	"?",
	"[",
	"]",
	"{",
	"}",
	"~"
]);
function normalizeActionName(value) {
	return normalizeOptionalLowercaseString(value)?.replace(/[\s-]+/g, "_") || void 0;
}
function readShellCommand(record) {
	const command = record?.command ?? record?.cmd;
	if (typeof command !== "string") return;
	return command.trim() || void 0;
}
function tokenizeSimpleShellCommand(command) {
	if (/[;&|<>\n\r`]/.test(command) || command.includes("\\")) return;
	for (const char of SHELL_EXPANSION_CHARS) if (command.includes(char)) return;
	const tokens = [];
	let current = "";
	let quote;
	for (const char of command) {
		if (quote) {
			if (char === quote) quote = void 0;
			else current += char;
			continue;
		}
		if (char === "'" || char === "\"") {
			quote = char;
			continue;
		}
		if (/\s/.test(char)) {
			if (current) {
				tokens.push(current);
				current = "";
			}
			continue;
		}
		current += char;
	}
	if (quote) return;
	if (current) tokens.push(current);
	return tokens.length > 0 ? tokens : void 0;
}
function isReadOnlySedCommand(tokens) {
	const args = tokens.slice(1);
	if (args.some((token) => token === "--in-place" || token.startsWith("--in-place="))) return false;
	if (args.some((token) => token.startsWith("-") && token !== "-" && token.includes("i"))) return false;
	if (args.some((token) => token === "-e" || token === "--expression")) return false;
	let sawSuppressAutoPrint = false;
	let expression;
	for (const token of args) {
		if (token === "--in-place" || token.startsWith("--in-place=")) return false;
		if (token === "--quiet" || token === "--silent") {
			sawSuppressAutoPrint = true;
			continue;
		}
		if (token.startsWith("-") && token !== "-") {
			if (token.includes("i")) return false;
			if (token.includes("n")) sawSuppressAutoPrint = true;
			continue;
		}
		expression ??= token;
		break;
	}
	return sawSuppressAutoPrint && expression != null && /^(\d+|\$)(,(\d+|\$))?p$/.test(expression);
}
function hasUnsafeRipgrepFlag(tokens) {
	return tokens.some((token) => {
		const normalized = normalizeLowercaseStringOrEmpty(token);
		return UNSAFE_RG_FLAGS.has(normalized) || UNSAFE_RG_VALUE_FLAGS.some((flag) => normalized.startsWith(`${flag}=`));
	});
}
function isReadOnlyGhCommand(tokens) {
	if (tokens.some((token) => {
		const normalized = normalizeLowercaseStringOrEmpty(token);
		return normalized === "--web" || normalized.startsWith("--web=") || /^-[a-z]*w[a-z]*(?:=.*)?$/.test(normalized);
	})) return false;
	const area = normalizeLowercaseStringOrEmpty(tokens[1]);
	const action = normalizeLowercaseStringOrEmpty(tokens[2]);
	if (area === "search") return action.length > 0;
	if (area === "pr") return READ_ONLY_GH_PR_SUBCOMMANDS.has(action);
	if (area === "issue") return READ_ONLY_GH_ISSUE_SUBCOMMANDS.has(action);
	return false;
}
function isPlainReadOnlyShellCommand(command) {
	if (!command) return false;
	const tokens = tokenizeSimpleShellCommand(command);
	if (!tokens) return false;
	const executable = normalizeLowercaseStringOrEmpty(tokens[0]);
	if (executable === "rg" && hasUnsafeRipgrepFlag(tokens)) return false;
	if (READ_ONLY_SHELL_COMMANDS.has(executable)) return true;
	if (executable === "sed") return isReadOnlySedCommand(tokens);
	if (executable === "gh") return isReadOnlyGhCommand(tokens);
	return false;
}
function isMutatingToolCall(toolName, args) {
	const normalized = normalizeLowercaseStringOrEmpty(toolName);
	const record = asOptionalObjectRecord(args);
	const action = normalizeActionName(record?.action);
	switch (normalized) {
		case "write":
		case "edit":
		case "apply_patch":
		case "sessions_spawn":
		case "sessions_send":
		case "conversations_send":
		case "conversations_turn":
		case "create_goal":
		case "update_goal": return true;
		case "exec":
		case "bash": return !isPlainReadOnlyShellCommand(readShellCommand(record));
		case "process": return action != null && PROCESS_MUTATING_ACTIONS.has(action);
		case "message": return action == null || !MESSAGE_READ_ONLY_ACTIONS.has(action);
		case "sessions": return action !== "group_list";
		case "computer": return !isComputerObservationAction(action, record?.dialogAction);
		case "mobile_ui": return action == null || !MOBILE_UI_REPLAY_SAFE_ACTIONS.has(action);
		case "subagents": return action === "cancel" || action === "kill" || action === "steer";
		case "session_status": return typeof record?.model === "string" && record.model.trim().length > 0;
		case "gateway": return action == null || !GATEWAY_REPLAY_SAFE_ACTIONS.has(action);
		case "portal": return action !== "list";
		case "theme": return action !== "list" && action !== "get";
		case "nodes": return action == null || !NODES_REPLAY_SAFE_ACTIONS.has(action);
		default:
			if (isAutomationsToolName(normalized) || normalized === "canvas") return action == null || !READ_ONLY_ACTIONS.has(action);
			if (normalized.endsWith("_actions")) return action == null || !READ_ONLY_ACTIONS.has(action);
			if (normalized.startsWith("message_") || normalized.includes("send")) return true;
			return false;
	}
}
/** Return true only for tool calls whose structured contract proves replay safety. */
function isReplaySafeToolCall(toolName, args) {
	const normalized = normalizeLowercaseStringOrEmpty(toolName);
	const record = asOptionalObjectRecord(args);
	const action = normalizeActionName(record?.action);
	if (REPLAY_SAFE_TOOL_NAMES.has(normalized)) return true;
	switch (normalized) {
		case "exec":
		case "bash": return false;
		case "process": return action != null && PROCESS_REPLAY_SAFE_ACTIONS.has(action);
		case "message": return action != null && MESSAGE_READ_ONLY_ACTIONS.has(action);
		case "subagents": return action == null || action === "list";
		case "sessions": return action === "group_list";
		case "session_status": return !isMutatingToolCall(normalized, args);
		case "browser": return action != null && BROWSER_READ_ONLY_ACTIONS.has(action);
		case "computer": return isComputerObservationAction(action, record?.dialogAction);
		case "mobile_ui": return action != null && MOBILE_UI_REPLAY_SAFE_ACTIONS.has(action);
		case "skill_workshop": return action === "list" || action === "inspect" || action === "read";
		case "transcripts": return action === "status";
		case "gateway": return action != null && GATEWAY_REPLAY_SAFE_ACTIONS.has(action);
		case "portal": return action === "list";
		case "theme": return action === "list" || action === "get";
		case "nodes": return action != null && NODES_REPLAY_SAFE_ACTIONS.has(action);
		default:
			if (isAutomationsToolName(normalized) || normalized === "canvas") return action != null && READ_ONLY_ACTIONS.has(action);
			return false;
	}
}
function buildToolMutationState(toolName, args, options) {
	const ownerDeclaredMutation = options?.ownerKey !== void 0;
	return {
		mutatingAction: ownerDeclaredMutation || isMutatingToolCall(toolName, args),
		replaySafe: ownerDeclaredMutation ? false : isReplaySafeToolCall(toolName, args)
	};
}
//#endregion
export { isMutatingToolCall as n, isReplaySafeToolCall as r, buildToolMutationState as t };
