import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
//#region src/cli/help-format.ts
function formatDocsHelp(path) {
	return `\n${theme.muted("Docs:")} ${formatDocsLink(path, `docs.openclaw.ai${path}`)}\n`;
}
function formatHelpExamples(examples, inline = false) {
	return examples.map(([command, description]) => {
		const formattedCommand = `  ${theme.command(command)}`;
		if (inline) return description ? `${formattedCommand} ${theme.muted(`# ${description}`)}` : formattedCommand;
		return `${formattedCommand}\n    ${theme.muted(description)}`;
	}).join("\n");
}
//#endregion
export { formatHelpExamples as n, formatDocsHelp as t };
