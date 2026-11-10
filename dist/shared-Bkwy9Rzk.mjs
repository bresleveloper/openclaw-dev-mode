import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as commandReply } from "./command-gates-Dcr0LjaJ.mjs";
import { t as formatRunLabel } from "./subagents-utils-DV33DlwQ.mjs";
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
	const matchLabel = (prefix) => {
		const matches = (value) => {
			const label = normalizeLowercaseStringOrEmpty(value);
			return prefix ? label.startsWith(lowered) : label === lowered;
		};
		const ambiguity = `Ambiguous subagent label${prefix ? " prefix" : ""}`;
		return match(numericOrder.filter((entry) => matches(entry.taskName)), ambiguity) ?? match(latest.filter((entry) => matches(formatRunLabel(entry))), ambiguity);
	};
	return matchLabel(false) ?? matchLabel(true) ?? match(latest.filter((entry) => entry.runId.startsWith(trimmed)), "Ambiguous run id prefix") ?? fail(`Unknown subagent id: ${trimmed}`);
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
export { resolveSubagentEntryForToken as n, buildSubagentsHelp as t };
