import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { _ as updateSessionGoalObjective, f as clearSessionGoal, h as getSessionGoal, m as formatSessionGoalStatus, p as createSessionGoal, v as updateSessionGoalStatus } from "./sessions-DE4llkPV.mjs";
import { n as applyCommandTextToParams } from "./command-context-rewrite-DyA5NUca.mjs";
import { n as commandReply, r as defineAuthorizedTextCommand } from "./command-gates-DqpLd5XK.mjs";
//#region src/auto-reply/reply/command-session-metadata.ts
const commandSessionMetadataChanges = /* @__PURE__ */ new WeakMap();
function addChange(target, change) {
	const changes = commandSessionMetadataChanges.get(target) ?? [];
	if (!changes.some((candidate) => candidate.sessionKey === change.sessionKey && candidate.agentId === change.agentId && candidate.reason === change.reason)) changes.push(change);
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
	const targets = /* @__PURE__ */ new Set();
	if (params.rootCtx && typeof params.rootCtx === "object") targets.add(params.rootCtx);
	if (params.ctx && typeof params.ctx === "object") targets.add(params.ctx);
	for (const target of targets) addChange(target, change);
}
function takeCommandSessionMetadataChanges(target) {
	const changes = commandSessionMetadataChanges.get(target);
	commandSessionMetadataChanges.delete(target);
	return changes && changes.length > 0 ? changes : void 0;
}
function takeCommandSessionMetadataChangesFromTargets(targets) {
	const changes = [];
	const seen = /* @__PURE__ */ new Set();
	for (const target of new Set(targets)) for (const change of takeCommandSessionMetadataChanges(target) ?? []) {
		const key = JSON.stringify([
			change.sessionKey,
			change.agentId ?? null,
			change.reason
		]);
		if (seen.has(key)) continue;
		seen.add(key);
		changes.push(change);
	}
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
	const trimmed = raw.trim();
	const commandEnd = trimmed.search(/\s/);
	const commandToken = commandEnd === -1 ? trimmed : trimmed.slice(0, commandEnd);
	if (normalizeOptionalLowercaseString(commandToken) !== GOAL_COMMAND_PREFIX) return null;
	const argText = commandEnd === -1 ? "" : trimmed.slice(commandEnd).trim();
	if (!argText) return {
		action: "status",
		text: ""
	};
	const actionEnd = argText.search(/\s/);
	const actionRaw = actionEnd === -1 ? argText : argText.slice(0, actionEnd);
	const action = normalizeOptionalLowercaseString(actionRaw) ?? "status";
	if (!GOAL_ACTIONS.has(action)) return {
		action: "start",
		text: argText
	};
	return {
		action,
		text: actionEnd === -1 ? "" : argText.slice(actionEnd).trim()
	};
}
function syncGoalSessionEntry(params) {
	if (!params.sessionStore || !params.sessionKey) return;
	const entry = loadSessionEntry({
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
function goalContinuation() {
	return { shouldContinue: true };
}
function goalErrorReply(error) {
	const message = error instanceof Error ? error.message : String(error);
	return commandReply(`Goal error: ${message}`);
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
		case "create": {
			const objective = normalizeOptionalString(params.parsed.text);
			if (!objective) return {
				text: "Usage: /goal start <objective>",
				changed: false
			};
			const goal = await createSessionGoal({
				...common,
				objective,
				fallbackEntry: params.fallbackEntry
			});
			return {
				text: `Goal started: ${goal.objective}`,
				continuationPrompt: formatGoalContinuationPrompt(goal.objective),
				changed: true
			};
		}
		case "edit": {
			const objective = normalizeOptionalString(params.parsed.text);
			if (!objective) return {
				text: "Usage: /goal edit <objective>",
				changed: false
			};
			return {
				text: `Goal updated: ${(await updateSessionGoalObjective({
					...common,
					objective
				})).objective}`,
				changed: true
			};
		}
		case "pause": return {
			text: `Goal paused: ${(await updateSessionGoalStatus({
				...common,
				status: "paused",
				...note
			})).objective}`,
			changed: true
		};
		case "resume": return {
			text: `Goal resumed: ${(await updateSessionGoalStatus({
				...common,
				status: "active",
				...note
			})).objective}`,
			continuationPrompt: formatGoalResumeContinuationPrompt(params.parsed.text),
			changed: true
		};
		case "complete":
		case "done": {
			const goal = await updateSessionGoalStatus({
				...common,
				status: "complete",
				...note
			});
			return {
				text: `Goal complete: ${goal.objective}\nTokens used: ${goal.tokensUsed}`,
				changed: true
			};
		}
		case "block":
		case "blocked": return {
			text: `Goal blocked: ${(await updateSessionGoalStatus({
				...common,
				status: "blocked",
				...note
			})).objective}`,
			changed: true
		};
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
		if (result.changed || parsed.action === "status" || parsed.action === "clear") syncGoalSessionEntry(params);
		if (result.changed) markCommandSessionMetadataChanged(params);
		if (result.continuationPrompt) {
			applyCommandTextToParams(params, result.continuationPrompt);
			return goalContinuation();
		}
		return commandReply(result.text);
	} catch (error) {
		return goalErrorReply(error);
	}
});
//#endregion
export { markCommandSessionMetadataChanged as a, parseGoalCommand as i, handleGoalCommand as n, takeCommandSessionMetadataChanges as o, isFormattedGoalContinuationPrompt as r, takeCommandSessionMetadataChangesFromTargets as s, executeSessionGoalCommand as t };
