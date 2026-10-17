import "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./provider-auth-aliases-15nvbxqy.mjs";
import "./model-selection-shared-DKlQ1p0S.mjs";
import "./model-selection-config-CsO-mXVD.mjs";
import "./model-auth-markers-Cuz_bq6T.mjs";
import "./model-selection-D3_rVb38.mjs";
import { t as resolveThinkingDefaultWithRuntimeCatalogCore } from "./model-thinking-default-CZnoMXD6.mjs";
import "./auth-profiles-BIPn3mmc.mjs";
import "./model-catalog-CwZMTjpw.mjs";
import "./model-auth-efmtIdn2.mjs";
import { d as readPreparedModelCatalog, f as refreshExpiredPreparedModelCatalog } from "./prepared-model-catalog-5NeF8DiP.mjs";
import "./common-Dyxcwsy8.mjs";
import "./identity-uzCeiPuC.mjs";
import "./agent-scope-runtime-DMJYuX7c.mjs";
import "./embedded-agent-utils-BYhIvAvm.mjs";
import "./tts-B6u94w1F.mjs";
import "./embedded-agent-block-chunker-Ca5Et6c-.mjs";
import "./identity-avatar-dF8y1aAa.mjs";
import "./agent-command-CgCo7NDi.mjs";
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
