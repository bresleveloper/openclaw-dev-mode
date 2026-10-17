import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
//#region src/agents/embedded-agent-runner/compact.runtime.ts
const compactRuntimeLoader = createLazyImportLoader(() => import("./compact-V8vPMMXj.mjs"));
async function compactEmbeddedAgentSessionOnDemand(params) {
	const { compactEmbeddedAgentSessionDirect } = await compactRuntimeLoader.load();
	return compactEmbeddedAgentSessionDirect(params);
}
//#endregion
export { compactEmbeddedAgentSessionOnDemand };
