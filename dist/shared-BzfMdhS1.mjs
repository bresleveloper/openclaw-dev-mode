import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as isNativeCommandTurn, c as resolveCommandTurnContext } from "./command-turn-context-B-DtktkV.mjs";
import { n as commandReply } from "./command-gates-BzqqR9SG.mjs";
import { a as resolveInternalSessionKey, o as resolveMainSessionAlias } from "./sessions-resolution-xzpaoE7C.mjs";
import "./sessions-helpers-CULwdUYq.mjs";
import { t as formatRunLabel } from "./subagents-utils-DtuM-aOJ.mjs";
//#region src/auto-reply/reply/commands-subagents/shared.ts
function resolveSubagentEntryForToken(view, token) {
	const fail = (message) => ({ reply: commandReply(`⚠️ ${message}`) });
	const trimmed = normalizeOptionalString(token);
	if (!trimmed) return fail("Missing subagent id.");
	const { latest, active, recent } = view;
	if (trimmed === "last") {
		const entry = latest[0];
		return entry ? { entry } : fail("Unknown subagent.");
	}
	const numericOrder = [...active, ...recent];
	if (/^\d+$/.test(trimmed)) {
		const entry = numericOrder[Number.parseInt(trimmed, 10) - 1];
		return entry ? { entry } : fail(`Invalid subagent index: ${trimmed}`);
	}
	if (trimmed.includes(":")) {
		const entry = latest.find((run) => run.childSessionKey === trimmed);
		return entry ? { entry } : fail(`Unknown subagent session: ${trimmed}`);
	}
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	const match = (entries, ambiguity) => {
		if (entries.length > 1) return fail(`${ambiguity}: ${trimmed}`);
		const entry = entries[0];
		return entry ? { entry } : void 0;
	};
	return match(numericOrder.filter((entry) => normalizeLowercaseStringOrEmpty(entry.taskName) === lowered), "Ambiguous subagent label") ?? match(latest.filter((entry) => normalizeLowercaseStringOrEmpty(formatRunLabel(entry)) === lowered), "Ambiguous subagent label") ?? match(numericOrder.filter((entry) => normalizeLowercaseStringOrEmpty(entry.taskName).startsWith(lowered)), "Ambiguous subagent label prefix") ?? match(latest.filter((entry) => normalizeLowercaseStringOrEmpty(formatRunLabel(entry)).startsWith(lowered)), "Ambiguous subagent label prefix") ?? match(latest.filter((entry) => entry.runId.startsWith(trimmed)), "Ambiguous run id prefix") ?? fail(`Unknown subagent id: ${trimmed}`);
}
function resolveRequesterSessionKey(params, opts) {
	const commandTarget = normalizeOptionalString(params.ctx.CommandTargetSessionKey);
	const commandSession = normalizeOptionalString(params.sessionKey);
	const raw = opts?.preferCommandTarget ?? isNativeCommandTurn(resolveCommandTurnContext(params.ctx)) ? commandTarget || commandSession : commandSession || commandTarget;
	if (!raw) return;
	const { alias } = resolveMainSessionAlias(params.cfg);
	return resolveInternalSessionKey({
		key: raw,
		alias
	});
}
function buildSubagentsHelp() {
	return [
		"Subagents",
		"Usage:",
		"- /subagents list",
		"- /subagents log <id|#> [limit] [tools]",
		"- /subagents info <id|#>",
		"- /session unbind",
		"- /agents",
		"- /session idle <duration|off>",
		"- /session max-age <duration|off>",
		"",
		"Ids: use the list index (#), runId/session prefix, label, or full session key."
	].join("\n");
}
//#endregion
export { resolveRequesterSessionKey as n, resolveSubagentEntryForToken as r, buildSubagentsHelp as t };
