//#region extensions/codex/package.json
var version = "2026.9.6";
//#endregion
//#region extensions/codex/src/build-state.ts
/**
* Duplicate module copies share one immutable published version's state.
* In-process restarts retain old records and callbacks for their old owners.
* Local rebuilds without a version bump deliberately share the same state.
*/
function codexBuildSymbol(name) {
	return Symbol.for(`${name}@${version}`);
}
function defineCodexBuildState(name, create) {
	const key = codexBuildSymbol(name);
	const globalState = globalThis;
	return () => globalState[key] ??= create();
}
//#endregion
export { defineCodexBuildState as n, codexBuildSymbol as t };
