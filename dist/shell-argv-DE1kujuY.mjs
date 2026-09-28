//#region src/utils/shell-argv.ts
const DOUBLE_QUOTE_ESCAPES = /* @__PURE__ */ new Set([
	"\\",
	"\"",
	"$",
	"`",
	"\n",
	"\r"
]);
function isDoubleQuoteEscape(next) {
	return Boolean(next && DOUBLE_QUOTE_ESCAPES.has(next));
}
/** Returns whether a shell string contains an unquoted command separator or pipeline operator. */
function hasTopLevelShellControlOperator(raw) {
	let quote;
	let escaped = false;
	let wordStart = true;
	for (let i = 0; i < raw.length; i += 1) {
		const ch = raw.charAt(i);
		if (escaped) {
			escaped = false;
			wordStart = false;
			continue;
		}
		if (quote) {
			if (quote === "\"" && ch === "\\" && isDoubleQuoteEscape(raw[i + 1])) i += 1;
			else if (ch === quote) quote = void 0;
			continue;
		}
		if (ch === "\\") {
			escaped = true;
			continue;
		}
		if (ch === "'" || ch === "\"") {
			quote = ch;
			wordStart = false;
			continue;
		}
		if (ch === "#" && wordStart) return /[\r\n]/u.test(raw.slice(i + 1));
		if (ch === "&" && (raw[i - 1] === ">" || raw[i - 1] === "<")) {
			wordStart = false;
			continue;
		}
		if (ch === ";" || ch === "&" || ch === "|" || ch === "\n" || ch === "\r") return true;
		wordStart = /\s/u.test(ch);
	}
	return false;
}
/** Splits a shell-like argv string into tokens, returning null for unterminated quotes or escapes. */
function splitShellArgs(raw) {
	return splitQuotedArgs(raw, "shell");
}
function splitCommandArgs(raw, options) {
	return splitQuotedArgs(raw, "command", options?.allowUnclosedQuotes);
}
function splitQuotedArgs(raw, syntax, allowUnclosedQuotes = false) {
	const backslashEscapes = syntax === "shell";
	const tokens = [];
	let buf = "";
	let inSingle = false;
	let inDouble = false;
	let escaped = false;
	const pushToken = () => {
		if (buf.length > 0) {
			tokens.push(buf);
			buf = "";
		}
	};
	for (let i = 0; i < raw.length; i += 1) {
		const ch = raw.charAt(i);
		if (escaped) {
			buf += ch;
			escaped = false;
			continue;
		}
		if (backslashEscapes && !inSingle && !inDouble && ch === "\\") {
			escaped = true;
			continue;
		}
		if (inSingle) {
			if (ch === "'") inSingle = false;
			else buf += ch;
			continue;
		}
		if (inDouble) {
			const next = raw[i + 1];
			if (backslashEscapes && ch === "\\" && isDoubleQuoteEscape(next)) {
				buf += next;
				i += 1;
				continue;
			}
			if (ch === "\"") inDouble = false;
			else buf += ch;
			continue;
		}
		if (ch === "'") {
			inSingle = true;
			continue;
		}
		if (ch === "\"") {
			inDouble = true;
			continue;
		}
		if (syntax === "shell" && ch === "#" && buf.length === 0) break;
		if (/\s/.test(ch)) {
			pushToken();
			continue;
		}
		buf += ch;
	}
	if (escaped || !allowUnclosedQuotes && (inSingle || inDouble)) return null;
	pushToken();
	return tokens;
}
//#endregion
export { splitCommandArgs as n, splitShellArgs as r, hasTopLevelShellControlOperator as t };
