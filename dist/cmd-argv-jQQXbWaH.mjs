import { t as splitArgsPreservingQuotes } from "./arg-split-CR3xkHmb.mjs";
//#region src/daemon/cmd-set.ts
/** Rejects line breaks before rendering values into Windows cmd scripts. */
function assertNoCmdLineBreak(value, field) {
	if (/[\r\n]/.test(value)) throw new Error(`${field} cannot contain CR or LF in Windows task scripts.`);
}
function escapeCmdSetAssignmentComponent(value, delayedExpansion) {
	return (delayedExpansion ? value.replace(/\^/g, "^^").replace(/!/g, "^!") : value).replace(/%/g, "%%").replace(/"/g, "^\"");
}
function unescapeCmdSetAssignmentComponent(value) {
	return value.replace(/\^([\^"!])|%%/g, (_match, escaped) => escaped ?? "%");
}
function parseCmdSetAssignment(line, requireLiteral = false) {
	const raw = requireLiteral ? line.trimStart() : line.trim();
	if (!raw) return null;
	const quoted = raw.startsWith("\"") && raw.endsWith("\"") && raw.length >= 2;
	const assignment = quoted ? raw.slice(1, -1) : raw;
	const index = assignment.indexOf("=");
	if (index <= 0) return null;
	const key = assignment.slice(0, index).trim();
	const value = requireLiteral ? assignment.slice(index + 1) : assignment.slice(index + 1).trim();
	if (!key) return null;
	if (requireLiteral && (key !== assignment.slice(0, index) || /[%!^"]/.test(assignment.replace(/%%/g, "")) || !quoted && (assignment.startsWith("/") || /[&|<>()]/.test(assignment)))) return null;
	if (!quoted && !requireLiteral) return {
		key,
		value
	};
	return {
		key: unescapeCmdSetAssignmentComponent(requireLiteral ? key.toUpperCase() : key),
		value: unescapeCmdSetAssignmentComponent(value)
	};
}
function renderCmdSetAssignment(key, value, options = {}) {
	assertNoCmdLineBreak(key, "Environment variable name");
	assertNoCmdLineBreak(value, "Environment variable value");
	return `set "${escapeCmdSetAssignmentComponent(key, options.delayedExpansion !== false)}=${escapeCmdSetAssignmentComponent(value, options.delayedExpansion !== false)}"`;
}
//#endregion
//#region src/daemon/cmd-argv.ts
/** Windows cmd argument quoting and parser mirror used by service tests. */
function quoteCmdScriptArg(value, options = {}) {
	assertNoCmdLineBreak(value, "Command argument");
	if (!value) return "\"\"";
	const quoted = value.replace(/"/g, "\\\"").replace(/%/g, "%%");
	const escaped = options.delayedExpansion === false ? quoted : quoted.replace(/!/g, "^!");
	if (!/[ \t"&|<>^()%!]/g.test(value)) return escaped;
	return `"${escaped}"`;
}
function unescapeCmdScriptArg(value) {
	return value.replace(/\^!/g, "!").replace(/%%/g, "%");
}
function parseCmdScriptCommandLine(value) {
	return splitArgsPreservingQuotes(value, { escapeMode: "backslash-quote-only" }).map(unescapeCmdScriptArg);
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
export { parseCmdSetAssignment as a, assertNoCmdLineBreak as i, quoteCmdScriptArg as n, renderCmdSetAssignment as o, stripTrailingCmdRedirections as r, parseCmdScriptCommandLine as t };
