import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugin-sdk/codex-client-version-handoff.internal.ts
/**
* Parent-to-worker handoff for the Codex client version. The process that runs
* Codex turns owns the decision; catalog workers report the value their parent
* captured for the request instead of selecting a Codex binary themselves.
*/
const handedOff = resolveGlobalSingleton(Symbol.for("openclaw.codexClientVersionHandoff"), () => new AsyncLocalStorage());
/** Runs worker work with the parent's decision; undefined means the bundled pin. */
function withHandedOffCodexClientVersion(version, operation) {
	return handedOff.run({ version }, operation);
}
function readHandedOffCodexClientVersion() {
	return handedOff.getStore();
}
//#endregion
export { withHandedOffCodexClientVersion as n, readHandedOffCodexClientVersion as t };
