import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
//#region src/agents/embedded-agent-runner/compact.runtime.ts
/**
* Lazy-loads the embedded-agent compaction runtime.
*/
const compactRuntimeLoader = createLazyImportLoader(() => import("./compact-DLfhLrtY.mjs"));
function loadCompactRuntime() {
	return compactRuntimeLoader.load();
}
/** Loads the compaction runtime on demand and forwards the direct compaction call. */
async function compactEmbeddedAgentSessionOnDemand(params) {
	const { compactEmbeddedAgentSessionDirect } = await loadCompactRuntime();
	return compactEmbeddedAgentSessionDirect(params);
}
//#endregion
export { compactEmbeddedAgentSessionOnDemand };
