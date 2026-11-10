import "./agent-scope-config-fjA2T9Gz.mjs";
import "./provider-auth-aliases-DCRcDae6.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./model-selection-shared-CVU_V2PQ.mjs";
import "./model-selection-config-CrboVKXT.mjs";
import "./common-BofcG96e.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { t as resolveThinkingDefaultWithRuntimeCatalogCore } from "./model-thinking-default-BKqBSSHy.mjs";
import "./model-catalog-vYmFg90_.mjs";
import "./model-auth-markers-Clx9vUna.mjs";
import "./identity-VQc9B4RO.mjs";
import "./identity-avatar-B5Z875Ch.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { d as readPreparedModelCatalog, f as refreshExpiredPreparedModelCatalog } from "./prepared-model-catalog-B9Dr8wIV.mjs";
import "./agent-scope-runtime-Dld1eD8B.mjs";
import "./model-auth-CMoPmop7.mjs";
import "./embedded-agent-utils-Bl20r92X.mjs";
import "./tts-C0gbbadU.mjs";
import "./embedded-agent-block-chunker-Cq8C8pJJ.mjs";
import "./agent-command-TuJMy8YP.mjs";
//#region src/plugin-sdk/agent-runtime.ts
/** Preserves the public SDK's writable default while internal catalog reads stay passive. */
async function loadPreparedModelCatalog(params = {}) {
	return await readPreparedModelCatalog({
		...params,
		readOnly: params.readOnly ?? false
	});
}
/** @deprecated Use loadPreparedModelCatalog or getPreparedModelCatalogSnapshot. */
async function loadModelCatalog(params = {}) {
	const { agentId, agentDir, cacheOnly, config, env, readOnly, refreshFullCatalog, workspaceDir } = params;
	const preparedParams = {
		...agentId ? { agentId } : {},
		...agentDir ? { agentDir } : {},
		...config ? { config } : {},
		...env ? { env } : {},
		...readOnly !== void 0 ? { readOnly } : {},
		...refreshFullCatalog !== void 0 ? { refreshFullCatalog } : {},
		...workspaceDir ? { workspaceDir } : {}
	};
	if (cacheOnly) return refreshExpiredPreparedModelCatalog(preparedParams)?.entries ?? [];
	return await loadPreparedModelCatalog(preparedParams);
}
function resolveThinkingDefaultWithRuntimeCatalog(params) {
	const { loadModelCatalog: loadRuntimeCatalog, ...rest } = params;
	return resolveThinkingDefaultWithRuntimeCatalogCore({
		...rest,
		loadRuntimeCatalog
	});
}
//#endregion
export { loadPreparedModelCatalog as n, resolveThinkingDefaultWithRuntimeCatalog as r, loadModelCatalog as t };
