import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
//#region src/daemon/output.ts
const normalizeWindowsPathSeparators = (value) => value.replace(/\\/g, "/");
function formatLine(label, value) {
	const rich = isRich();
	return `${colorize(rich, theme.muted, `${label}:`)} ${colorize(rich, theme.command, value)}`;
}
function writeFormattedLines(stdout, lines) {
	stdout.write("\n");
	for (const line of lines) stdout.write(`${formatLine(line.label, line.value)}\n`);
}
//#endregion
export { normalizeWindowsPathSeparators as n, writeFormattedLines as r, formatLine as t };
