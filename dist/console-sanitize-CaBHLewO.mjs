//#region src/agents/console-sanitize.ts
/** Sanitize optional text for compact console output. */
function sanitizeForConsole(text, maxChars = 200) {
	const trimmed = text?.trim();
	if (!trimmed) return;
	const sanitized = trimmed.replace(/\p{Cc}/gu, (control) => "\r\n	".includes(control) ? " " : "").replace(/\s+/g, " ").trim();
	const codePoints = Array.from(sanitized);
	if (codePoints.length <= maxChars) return sanitized;
	return `${codePoints.slice(0, maxChars).join("")}…`;
}
//#endregion
export { sanitizeForConsole as t };
