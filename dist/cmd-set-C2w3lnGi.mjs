//#region src/daemon/cmd-set.ts
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
export { parseCmdSetAssignment as n, renderCmdSetAssignment as r, assertNoCmdLineBreak as t };
