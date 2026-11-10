import { t as splitArgsPreservingQuotes } from "./arg-split-B0qvCDwd.mjs";
import { t as assertNoCmdLineBreak } from "./cmd-set-C2w3lnGi.mjs";
//#region src/daemon/cmd-argv.ts
function quoteCmdScriptArg(value, options = {}) {
	assertNoCmdLineBreak(value, "Command argument");
	if (!value) return "\"\"";
	const quoted = value.replace(/"/g, "\\\"").replace(/%/g, "%%");
	const escaped = options.delayedExpansion === false ? quoted : quoted.replace(/!/g, "^!");
	if (!/[ \t"&|<>^()%!]/g.test(value)) return escaped;
	return `"${escaped}"`;
}
function parseCmdScriptCommandLine(value) {
	return splitArgsPreservingQuotes(value, { escapeMode: "backslash-quote-only" }).map((argument) => argument.replace(/\^!/g, "!").replace(/%%/g, "%"));
}
function stripTrailingCmdRedirections(commandLine) {
	const tokens = [];
	for (let index = 0; index < commandLine.length;) {
		if (/[ \t]/.test(commandLine.charAt(index))) {
			index++;
			continue;
		}
		let start = index;
		const operator = commandLine[index];
		if (operator === ">" || operator === "<") {
			const previous = tokens.at(-1);
			if (previous && !previous.redirect && previous.end === index) {
				const word = commandLine.slice(previous.start, previous.end);
				if (/\d$/.test(word)) {
					if (!/^\d$/.test(word)) return null;
					start = previous.start;
					tokens.pop();
				}
			}
			index++;
			let redirect = operator;
			if (operator === ">" && commandLine[index] === ">") {
				redirect = ">>";
				index++;
			}
			if (redirect === ">" && commandLine[index] === "&") {
				if (!/[0-9]/.test(commandLine[index + 1] ?? "")) return null;
				redirect = ">&";
				index += 2;
			}
			tokens.push({
				start,
				end: index,
				redirect
			});
			continue;
		}
		let quoted = false;
		while (index < commandLine.length) {
			const char = commandLine.charAt(index);
			if (char === "\r" || char === "\n" || char === "\\" && commandLine[index + 1] === "\"" || char === "^" && (!quoted || commandLine[index + 1] === "\"")) return null;
			if (char === "\"") quoted = !quoted;
			else if (!quoted) {
				if ("&|()".includes(char)) return null;
				if (/[ \t<>]/.test(char)) break;
			}
			index++;
		}
		if (quoted) return null;
		tokens.push({
			start,
			end: index
		});
	}
	const firstRedirect = tokens.findIndex((token) => token.redirect !== void 0);
	const firstToken = tokens[firstRedirect];
	if (!firstToken) return commandLine;
	for (let index = firstRedirect; index < tokens.length; index++) {
		const token = tokens[index];
		if (!token?.redirect) return null;
		if (token.redirect === ">&") continue;
		const target = tokens[++index];
		if (!target || target.redirect) return null;
		const value = commandLine.slice(target.start, target.end);
		if (value.includes("\"") && !/^"[^"]+"$/.test(value) || !value.includes("\"") && /[,;=%!]/.test(value) || token.redirect === "<" && !/^(?:NUL|"NUL")$/i.test(value)) return null;
	}
	return commandLine.slice(0, firstToken.start);
}
//#endregion
export { quoteCmdScriptArg as n, stripTrailingCmdRedirections as r, parseCmdScriptCommandLine as t };
