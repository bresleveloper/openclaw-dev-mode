import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
//#region src/daemon/output.ts
/** Shared terminal output formatting helpers for daemon install/control commands. */
/** Normalizes Windows separators for command output paths. */
const normalizeWindowsPathSeparators = (value) => value.replace(/\\/g, "/");
/** Formats a labeled daemon output line with terminal-aware styling. */
function formatLine(label, value) {
	const rich = isRich();
	return `${colorize(rich, theme.muted, `${label}:`)} ${colorize(rich, theme.command, value)}`;
}
function writeFormattedLines(stdout, lines, opts) {
	if (opts?.leadingBlankLine) stdout.write("\n");
	for (const line of lines) stdout.write(`${formatLine(line.label, line.value)}\n`);
}
//#endregion
export { normalizeWindowsPathSeparators as n, writeFormattedLines as r, formatLine as t };
