import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { a as clearSessionGoal, c as getSessionGoal, d as updateSessionGoalStatus, o as createSessionGoal, s as formatSessionGoalStatus, u as updateSessionGoalObjective } from "./sessions-CnzPI1yx.mjs";
import { r as matchSlashCommandToken, s as splitCommandAction } from "./commands-registry.data-CPKKYobJ.mjs";
import { n as applyCommandTextToParams } from "./command-context-rewrite-mIwqCJE8.mjs";
import { n as commandReply, r as defineAuthorizedTextCommand } from "./command-gates-Dcr0LjaJ.mjs";
//#region src/auto-reply/reply/command-session-metadata.ts
const commandSessionMetadataChanges = /* @__PURE__ */ new WeakMap();
function addChange(target, change) {
	const changes = commandSessionMetadataChanges.get(target) ?? [];
	if (!changes.some((candidate) => candidate.sessionKey === change.sessionKey && candidate.agentId === change.agentId)) changes.push(change);
	commandSessionMetadataChanges.set(target, changes);
}
function markCommandSessionMetadataChanged(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return;
	const change = {
		sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		reason: "command-metadata"
	};
	if (params.rootCtx && params.rootCtx !== params.ctx) addChange(params.rootCtx, change);
	addChange(params.ctx, change);
}
function takeCommandSessionMetadataChanges(target) {
	const changes = commandSessionMetadataChanges.get(target);
	commandSessionMetadataChanges.delete(target);
	return changes && changes.length > 0 ? changes : void 0;
}
function takeCommandSessionMetadataChangesFromTargets(targets) {
	const changes = dedupeByKey([...new Set(targets)].flatMap((target) => takeCommandSessionMetadataChanges(target) ?? []), (change) => JSON.stringify([
		change.sessionKey,
		change.agentId ?? null,
		change.reason
	]));
	return changes.length > 0 ? changes : void 0;
}
//#endregion
//#region src/auto-reply/reply/commands-goal.ts
/** Handles /goal session objective commands and continuation prompt formatting. */
const GOAL_COMMAND_PREFIX = "/goal";
const GOAL_CONTINUATION_PROMPT_PREFIX = "Pursue this goal exactly as written from this JSON string:";
const GOAL_RESUME_NOTE_PROMPT_PREFIX = "Continue pursuing the current goal. Interpret this JSON string as the resume note:";
const GOAL_ACTIONS = /* @__PURE__ */ new Set([
	"block",
	"blocked",
	"clear",
	"complete",
	"create",
	"done",
	"edit",
	"pause",
	"resume",
	"set",
	"start",
	"status"
]);
/** Parses /goal action text, defaulting unknown actions to goal creation. */
function parseGoalCommand(raw) {
	const argText = matchSlashCommandToken(raw, GOAL_COMMAND_PREFIX);
	if (argText === null) return null;
	const { action, args } = splitCommandAction(argText, "status");
	if (!GOAL_ACTIONS.has(action)) return {
		action: "start",
		text: argText
	};
	return {
		action,
		text: args
	};
}
async function refreshGoalSessionEntry(params) {
	if (!params.sessionStore || !params.sessionKey) return;
	const entry = await readSessionEntryReadOnlyInWorker({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	if (!entry) return;
	params.sessionStore[params.sessionKey] = entry;
	params.sessionEntry = entry;
}
function hasCommandLikeGoalText(trimmed) {
	return /(?:^|\s)\//.test(trimmed) || trimmed.startsWith("!");
}
function encodeGoalJsonString(trimmed) {
	return JSON.stringify(trimmed).replaceAll("/", "\\/");
}
function formatGoalContinuationPrompt(objective) {
	const trimmed = objective.trim();
	return hasCommandLikeGoalText(trimmed) ? `${GOAL_CONTINUATION_PROMPT_PREFIX} ${encodeGoalJsonString(trimmed)}` : trimmed;
}
function formatGoalResumeContinuationPrompt(note) {
	const trimmed = note.trim();
	if (!trimmed) return "Continue pursuing the current goal.";
	return hasCommandLikeGoalText(trimmed) ? `${GOAL_RESUME_NOTE_PROMPT_PREFIX} ${encodeGoalJsonString(trimmed)}` : `Continue pursuing the current goal. Note: ${trimmed}`;
}
/** Returns true for internally generated goal continuation prompts. */
function isFormattedGoalContinuationPrompt(message) {
	const trimmed = message.trim();
	return trimmed.startsWith(GOAL_CONTINUATION_PROMPT_PREFIX) || trimmed.startsWith(GOAL_RESUME_NOTE_PROMPT_PREFIX);
}
/** Execute goal storage policy once for auto-reply, Gateway, and embedded callers. */
async function executeSessionGoalCommand(params) {
	const common = {
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		actor: { type: "human" },
		agentId: params.agentId
	};
	const note = params.parsed.text ? { note: params.parsed.text } : {};
	switch (params.parsed.action) {
		case "status": {
			const snapshot = await getSessionGoal({
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				...params.readOnlyStatus ? {
					fallbackEntry: params.fallbackEntry,
					persist: false
				} : {}
			});
			return {
				text: formatSessionGoalStatus(snapshot.goal),
				changed: false
			};
		}
		case "start":
		case "set":
		case "create":
		case "edit": {
			const editing = params.parsed.action === "edit";
			const objective = normalizeOptionalString(params.parsed.text);
			if (!objective) return {
				text: `Usage: /goal ${editing ? "edit" : "start"} <objective>`,
				changed: false
			};
			const goal = editing ? await updateSessionGoalObjective({
				...common,
				objective
			}) : await createSessionGoal({
				...common,
				objective,
				fallbackEntry: params.fallbackEntry
			});
			return {
				text: `Goal ${editing ? "updated" : "started"}: ${goal.objective}`,
				...editing ? {} : { continuationPrompt: formatGoalContinuationPrompt(goal.objective) },
				changed: true
			};
		}
		case "pause":
		case "resume":
		case "complete":
		case "done":
		case "block":
		case "blocked": {
			const nextStatus = {
				pause: "paused",
				resume: "active",
				complete: "complete",
				done: "complete",
				block: "blocked",
				blocked: "blocked"
			}[params.parsed.action];
			const goal = await updateSessionGoalStatus({
				...common,
				status: nextStatus,
				...note
			});
			return {
				text: `Goal ${nextStatus === "active" ? "resumed" : nextStatus}: ${goal.objective}${nextStatus === "complete" ? `\nTokens used: ${goal.tokensUsed}` : ""}`,
				...nextStatus === "active" ? { continuationPrompt: formatGoalResumeContinuationPrompt(params.parsed.text) } : {},
				changed: true
			};
		}
		case "clear": {
			const removed = await clearSessionGoal(common);
			return {
				text: removed ? "Goal cleared." : "No goal to clear.",
				changed: removed
			};
		}
		default: return {
			text: "Usage: /goal <objective> | /goal [status] | /goal start <objective> | /goal edit <objective> | /goal pause|resume|complete|block|clear",
			changed: false
		};
	}
}
/** Command handler for /goal lifecycle commands. */
const handleGoalCommand = defineAuthorizedTextCommand({
	label: "/goal",
	match: parseGoalCommand
}, async (params, parsed) => {
	try {
		const result = await executeSessionGoalCommand({
			parsed,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			fallbackEntry: params.sessionEntry,
			agentId: params.agentId,
			readOnlyStatus: true
		});
		if (result.changed || parsed.action === "status" || parsed.action === "clear") await refreshGoalSessionEntry(params);
		if (result.changed) markCommandSessionMetadataChanged(params);
		if (result.continuationPrompt) {
			applyCommandTextToParams(params, result.continuationPrompt);
			return { shouldContinue: true };
		}
		return commandReply(result.text);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return commandReply(`Goal error: ${message}`);
	}
});
//#endregion
export { markCommandSessionMetadataChanged as a, parseGoalCommand as i, handleGoalCommand as n, takeCommandSessionMetadataChanges as o, isFormattedGoalContinuationPrompt as r, takeCommandSessionMetadataChangesFromTargets as s, executeSessionGoalCommand as t };
