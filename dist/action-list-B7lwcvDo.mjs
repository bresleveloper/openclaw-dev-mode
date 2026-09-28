import { n as commandReply } from "./command-gates-DqpLd5XK.mjs";
import { r as readSubagentListSessionEntries, t as buildSubagentList } from "./subagent-list-1B8K5zqX.mjs";
import "./shared-CBqrl8ni.mjs";
//#region src/auto-reply/reply/commands-subagents/action-list.ts
function handleSubagentsListAction(ctx) {
	const { params, readContext } = ctx;
	const list = buildSubagentList({
		context: readContext.list,
		sessionEntries: readSubagentListSessionEntries(params.cfg, readContext.list),
		taskMaxChars: 110
	});
	const lines = ["active subagents:", "-----"];
	if (list.active.length === 0) lines.push("(none)");
	else lines.push(list.active.map((entry) => entry.line).join("\n"));
	lines.push("", `recent subagents (last 30m):`, "-----");
	if (list.recent.length === 0) lines.push("(none)");
	else lines.push(list.recent.map((entry) => entry.line).join("\n"));
	return commandReply(lines.join("\n"));
}
//#endregion
export { handleSubagentsListAction };
