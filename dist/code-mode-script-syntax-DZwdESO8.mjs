import { parse } from "acorn";
//#region src/agents/code-mode-script-syntax.ts
/** Mirrors the worker's async-arrow body grammar so valid top-level await/return stay legal. */
function buildCodeModeScriptParseSource(code) {
	return {
		source: `(async () => {
${code}\n})`,
		codeOffset: 15
	};
}
function parseCodeModeScriptSyntax(code) {
	const { source } = buildCodeModeScriptParseSource(code);
	try {
		return {
			ok: true,
			program: parse(source, { ecmaVersion: "latest" })
		};
	} catch (error) {
		const syntaxError = error;
		return {
			ok: false,
			message: syntaxError.message.replace(/ \(\d+:\d+\)$/u, ""),
			line: syntaxError.loc.line - 1,
			column: syntaxError.loc.column
		};
	}
}
//#endregion
export { parseCodeModeScriptSyntax as n, buildCodeModeScriptParseSource as t };
