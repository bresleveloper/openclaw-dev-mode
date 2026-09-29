import { l as copyInternalToolResultState, t as acknowledgeInternalToolResult } from "../internal-hooks-DUPhyX-W.mjs";
import { t as consumeTrustedToolNoStartError } from "../tool-result-error-CWadvCKd.mjs";
import { r as getCoreTtsToolResultMediaUrls } from "../tts-tool-result-provenance-z42MPFVT.mjs";
import { t as runWithAsyncWorkResources } from "../async-work-resources-CUDFzL8J.mjs";
import { i as normalizeAcceptedSessionSpawnResult } from "../accepted-session-spawn-4qfWSWlu.mjs";
import { t as createAgentHarnessToolSurfaceRuntimeCore } from "../tool-surface-bridge-D5MBEJLb.mjs";
//#region src/plugin-sdk/agent-harness-tool-runtime.ts
function createAgentHarnessToolSurfaceRuntime(params) {
	const runtime = createAgentHarnessToolSurfaceRuntimeCore(params);
	const catalog = runtime;
	return {
		codeModeControlsEnabled: runtime.codeModeControlsEnabled,
		config: runtime.config,
		includeToolSearchControls: runtime.includeToolSearchControls,
		runtimeToolAllowlist: runtime.runtimeToolAllowlist,
		toolSearchCatalogExecutor: catalog.toolSearchCatalogExecutor,
		toolSearchCatalogRef: catalog.toolSearchCatalogRef,
		toolSearchControlsEnabled: runtime.toolSearchControlsEnabled,
		cleanup: runtime.cleanup,
		compactTools: (tools, { hookContext, localModelLeanApplied } = {}) => {
			const { tools: compacted, promptToolPolicy } = runtime.compactTools(tools, {
				hookContext,
				localModelLeanApplied
			});
			return {
				tools: compacted,
				promptToolPolicy
			};
		}
	};
}
//#endregion
export { acknowledgeInternalToolResult, consumeTrustedToolNoStartError, copyInternalToolResultState, createAgentHarnessToolSurfaceRuntime, getCoreTtsToolResultMediaUrls, normalizeAcceptedSessionSpawnResult, runWithAsyncWorkResources };
