import "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./provider-auth-aliases-15nvbxqy.mjs";
import "./model-selection-shared-BZeDVoch.mjs";
import "./model-selection-config-DYd_ufXT.mjs";
import "./model-auth-markers-Cuz_bq6T.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { t as resolveThinkingDefaultWithRuntimeCatalogCore } from "./model-thinking-default-B8jMQwyw.mjs";
import "./auth-profiles-DqHEfJ-y.mjs";
import "./model-catalog-B5tSuR_i.mjs";
import "./model-auth-DfAz5WFK.mjs";
import { d as readPreparedModelCatalog, f as refreshExpiredPreparedModelCatalog } from "./prepared-model-catalog-DB_HuZmL.mjs";
import "./common-Dyxcwsy8.mjs";
import "./identity-uzCeiPuC.mjs";
import "./agent-scope-runtime-DMJYuX7c.mjs";
import "./embedded-agent-utils-BYhIvAvm.mjs";
import "./tts-qjq0DyCN.mjs";
import "./embedded-agent-block-chunker-Ca5Et6c-.mjs";
import "./identity-avatar-dF8y1aAa.mjs";
import "./agent-command-CFAOMl1G.mjs";
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
