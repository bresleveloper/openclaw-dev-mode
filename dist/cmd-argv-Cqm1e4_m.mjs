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
	let out = "";
	for (let i = 0; i < value.length; i += 1) {
		const ch = value[i];
		const next = value[i + 1];
		if (ch === "^" && (next === "^" || next === "\"" || next === "!")) {
			out += next;
			i += 1;
			continue;
		}
		if (ch === "%" && next === "%") {
			out += "%";
			i += 1;
			continue;
		}
		out += ch;
	}
	return out;
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
//#endregion
export { renderCmdSetAssignment as a, parseCmdSetAssignment as i, quoteCmdScriptArg as n, assertNoCmdLineBreak as r, parseCmdScriptCommandLine as t };
