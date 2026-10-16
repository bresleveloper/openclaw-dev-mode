import { n as commandReply } from "./command-gates-BzqqR9SG.mjs";
import { r as readSubagentListSessionEntries, t as buildSubagentList } from "./subagent-list-DsOn_KXT.mjs";
import "./shared-BZfsOBpm.mjs";
//#region src/auto-reply/reply/commands-subagents/action-list.ts
async function handleSubagentsListAction(ctx) {
	const { params, readContext } = ctx;
	const list = buildSubagentList({
		context: readContext.list,
		sessionEntries: await readSubagentListSessionEntries(params.cfg, readContext.list),
		taskMaxChars: 110
	});
	const formatRows = (rows) => rows.length ? rows.map((entry) => entry.line).join("\n") : "(none)";
	return commandReply([
		"active subagents:",
		"-----",
		formatRows(list.active),
		"",
		`recent subagents (last 30m):`,
		"-----",
		formatRows(list.recent)
	].join("\n"));
}
//#endregion
export { handleSubagentsListAction };
