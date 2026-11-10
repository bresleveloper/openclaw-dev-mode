import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { b as resolveMemoryDreamingConfig, y as resolveMemoryDeepDreamingConfig } from "./dreaming-D2xE6WEV.mjs";
import { t as buildAgentSessionKey } from "./resolve-route-DvaXhzgP.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./memory-core-host-engine-storage-wV2XR0Rc.mjs";
import { i as readMemorySearchManagerStatus, s as resolveMemorySearchStaleness } from "./types-CGuNDIwt.mjs";
import "./routing-Dl7FngGa.mjs";
import "./memory-core-host-status-EFn_AMM-.mjs";
import { S as withMemoryMutationAuthority } from "./dreaming-state-D1mfF5St.mjs";
import { et as withMemoryWorkspaceLock } from "./dreaming-dreams-file-BFl4u8HC.mjs";
import { r as recordShortTermRecalls } from "./short-term-promotion-record-yyoZVODo.mjs";
import { t as captureMemoryRebuildNotice } from "./memory-rebuild-notice-C11wwQEg.mjs";
//#region extensions/memory-core/src/memory-search-operation.ts
/** Shared CLI search semantics, independent of transport and terminal rendering. */
async function searchMemoryForCli(params) {
	const { manager, cfg, agentId, query, assertCurrent } = params;
	assertCurrent?.();
	let readRebuildWarning = () => void 0;
	let results;
	try {
		readRebuildWarning = captureMemoryRebuildNotice(await readMemorySearchManagerStatus(manager));
		results = await manager.search(query, {
			maxResults: params.maxResults,
			minScore: params.minScore,
			sessionKey: buildAgentSessionKey({
				agentId,
				channel: "cli",
				peer: {
					kind: "direct",
					id: "memory-search"
				},
				dmScope: "per-channel-peer"
			})
		});
	} catch (error) {
		throw new Error([`Memory search failed: ${formatErrorMessage(error)}`, readRebuildWarning()].filter(Boolean).join(" "), { cause: error });
	}
	assertCurrent?.();
	const status = await readMemorySearchManagerStatus(manager);
	const staleness = resolveMemorySearchStaleness(status, agentId);
	const warning = [staleness?.warning, readRebuildWarning()].filter(Boolean).join(" ");
	const pluginConfig = asNullableRecord(cfg.plugins?.entries?.["memory-core"]?.config) ?? {};
	if (resolveMemoryDreamingConfig({
		cfg,
		pluginConfig
	}).enabled) {
		const dreaming = resolveMemoryDeepDreamingConfig({
			cfg,
			pluginConfig
		});
		const record = () => recordShortTermRecalls({
			workspaceDir: status.workspaceDir,
			query,
			results,
			timezone: dreaming.timezone
		});
		const workspaceDir = status.workspaceDir?.trim();
		await (assertCurrent && workspaceDir ? withMemoryWorkspaceLock(workspaceDir, () => withMemoryMutationAuthority(assertCurrent, record)) : record()).catch(() => {});
	}
	assertCurrent?.();
	return {
		results,
		...staleness,
		...warning ? { warning } : {}
	};
}
//#endregion
export { searchMemoryForCli as t };
