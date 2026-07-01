//#region packages/terminal-core/src/terminal-link.ts
/** Format a clickable terminal link when supported, otherwise return a readable fallback. */
function formatTerminalLink(label, url, opts) {
	const esc = "\x1B";
	const safeLabel = label.replaceAll(esc, "");
	const safeUrl = url.replaceAll(esc, "");
	if (!(opts?.force === true ? true : opts?.force === false ? false : process.stdout.isTTY)) return opts?.fallback ?? `${safeLabel} (${safeUrl})`;
	return `\u001b]8;;${safeUrl}\u0007${safeLabel}\u001b]8;;\u0007`;
}
//#endregion
export { formatTerminalLink as t };
