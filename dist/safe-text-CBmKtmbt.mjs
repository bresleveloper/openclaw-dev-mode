import { i as stripAnsi } from "./ansi-CWsy0bu4.mjs";
//#region packages/terminal-core/src/safe-text.ts
/** Return whether text contains C0 or C1 terminal control characters. */
function hasTerminalControl(input) {
	return input.search(/\p{Cc}/u) !== -1;
}
/**
* Normalize untrusted text for single-line terminal/log rendering.
*/
function sanitizeTerminalText(input) {
	return stripAnsi(input).replace(/\p{Cc}/gu, (control) => control === "\r" ? "\\r" : control === "\n" ? "\\n" : control === "	" ? "\\t" : "");
}
//#endregion
export { sanitizeTerminalText as n, hasTerminalControl as t };
