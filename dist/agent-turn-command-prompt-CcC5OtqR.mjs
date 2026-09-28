import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as isRuntimeToolAllowed } from "./tool-policy-match-Bv2XOvEF.mjs";
//#region src/cron/agent-turn-command-prompt.ts
const COMMAND_MARKER_RE = /\bCommand to run\s*:/iu;
const COMMAND_FIELD_RE = /^\s*-\s*(command|workdir|timeout)\s*:\s*(.*?)\s*$/iu;
const SHELL_COMMAND_MESSAGE_RE = /\b(?:bash|command|execute|exec|process|run|shell)\b[\s\S]{0,240}\b(?:python3?|node|bun|pnpm|npm|npx|yarn|sh|bash|sudo|cd|\.\/|\/[A-Za-z0-9._/-]+)\b/iu;
function parsePositiveInteger(value) {
	const trimmed = value.trim();
	if (!/^\d+$/u.test(trimmed)) return;
	const parsed = Number.parseInt(trimmed, 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : void 0;
}
/** Parses the legacy structured command block used by isolated agent prompts. */
function parseCronAgentTurnCommandPrompt(value) {
	const message = normalizeOptionalString(value);
	if (!message || !COMMAND_MARKER_RE.test(message)) return null;
	let command = "";
	let cwd;
	let timeoutSeconds;
	for (const line of message.split(/\r?\n/u)) {
		const match = COMMAND_FIELD_RE.exec(line);
		if (!match) continue;
		const key = match[1]?.toLowerCase();
		const fieldValue = match[2]?.trim() ?? "";
		if (key === "command" && fieldValue && !command) command = fieldValue;
		else if (key === "workdir" && fieldValue && !cwd) cwd = fieldValue;
		else if (key === "timeout" && fieldValue && timeoutSeconds === void 0) timeoutSeconds = parsePositiveInteger(fieldValue);
	}
	return command ? {
		command,
		...cwd ? { cwd } : {},
		...timeoutSeconds ? { timeoutSeconds } : {}
	} : null;
}
/** Returns whether an agent-turn cap explicitly permits a shell/process tool. */
function hasCronShellToolAccess(toolsAllow) {
	if (toolsAllow === void 0) return true;
	if (!Array.isArray(toolsAllow)) return false;
	if (!toolsAllow.every((tool) => typeof tool === "string")) return false;
	if (toolsAllow.some((tool) => tool.trim().length === 0)) return false;
	return isRuntimeToolAllowed("exec", toolsAllow) || isRuntimeToolAllowed("process", toolsAllow);
}
/** Classifies only command-like agent turns that need cron operator attention. */
function classifyCronAgentTurnShellPrompt(payload) {
	if (payload.kind !== "agentTurn") return null;
	const message = normalizeOptionalString(payload.message);
	if (!message) return null;
	const parsed = parseCronAgentTurnCommandPrompt(message);
	const shellToolAccess = hasCronShellToolAccess(payload.toolsAllow);
	if (parsed && !shellToolAccess) return "commandPromptWithoutShellAccess";
	if (shellToolAccess && SHELL_COMMAND_MESSAGE_RE.test(message)) return "shellToolPrompt";
	return null;
}
//#endregion
export { hasCronShellToolAccess as n, parseCronAgentTurnCommandPrompt as r, classifyCronAgentTurnShellPrompt as t };
