import "./agent-scope-config-IQKOEtZ4.mjs";
import "./model-selection-shared-0uvJbX1M.mjs";
import "./agent-scope-CTuYDtny.mjs";
import "./model-selection-config-DZ4sk4C2.mjs";
import "./provider-auth-aliases-DKt99_dy.mjs";
import "./model-auth-markers-BfYDKFYI.mjs";
import "./model-catalog-Ct9wqlAa.mjs";
import "./auth-profiles-BIemDmO2.mjs";
import "./model-auth-C2GOGHO-.mjs";
import "./model-selection-QUeDLfPD.mjs";
import { t as resolveThinkingDefaultWithRuntimeCatalogCore } from "./model-thinking-default-BQDdsH3k.mjs";
import { d as readPreparedModelCatalog, n as getPreparedModelCatalogSnapshot } from "./prepared-model-catalog-iMDa4Tyc.mjs";
import "./common-XfKigJno.mjs";
import "./identity-DdUdpaIE.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
import "./embedded-agent-utils-C9EyRsVl.mjs";
import "./embedded-agent-block-chunker-G-Ecjp62.mjs";
import "./tts-DOZf8eb4.mjs";
import "./identity-avatar-lNEPE9JK.mjs";
import "./agent-command-CwlcSroL.mjs";
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
	if (cacheOnly) return getPreparedModelCatalogSnapshot(preparedParams)?.entries ?? [];
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
