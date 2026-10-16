//#region packages/terminal-core/src/terminal-link.ts
function stripTerminalLinkControls(value) {
	return value.replace(/\p{Cc}/gu, "");
}
/** Format a clickable terminal link when supported, otherwise return a readable fallback. */
function formatTerminalLink(label, url, opts) {
	const allow = opts?.force === true ? true : opts?.force === false ? false : process.stdout.isTTY;
	if (!allow && opts?.fallback !== void 0) return stripTerminalLinkControls(opts.fallback);
	const safeLabel = stripTerminalLinkControls(label);
	const safeUrl = stripTerminalLinkControls(url);
	if (!allow) return `${safeLabel} (${safeUrl})`;
	return `\u001b]8;;${safeUrl}\u0007${safeLabel}\u001b]8;;\u0007`;
}
//#endregion
export { formatTerminalLink as t };
