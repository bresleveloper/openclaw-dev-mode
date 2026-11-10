import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { C as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-BtDOU_3j.mjs";
import { _ as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-CeDA0ojh.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-ugPrOKRi.mjs";
import { t as resolveAgentSessionDirs } from "./session-dirs-BbI9oEef.mjs";
import { i as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { t as prepareSessionStoreTargetInventoryRead } from "./session-store-target-runtime-D11id0W-.mjs";
import "./sessions-CnzPI1yx.mjs";
import path from "node:path";
//#region src/agents/main-session-recovery/main-session-restart-recovery-shared.ts
const mainSessionRecoveryLog = createSubsystemLogger("main-session-restart-recovery");
const DEFAULT_RECOVERY_DELAY_MS = 5e3;
function readInterruptedRunId(entry) {
	const runs = entry.restartRecoveryRuns;
	if (!runs?.length) return normalizeOptionalString(entry.lifecycleRunId);
	return runs.length === 1 ? runs[0]?.runId : void 0;
}
function resolveRestartRecoveryTerminalClientRunId(entry) {
	return entry.restartRecoverySourceIngress === "control-ui" || entry.restartRecoverySourceIngress === "internal" ? normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) : void 0;
}
async function discoverRestartRecoveryStoreTargets(params) {
	if (params.shouldContinue?.() === false) return [];
	const storeTargets = [];
	const stateDir = params.stateDir ?? resolveStateDir(process.env);
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	};
	if (params.cfg) {
		const configuredAgentIds = listConfiguredSessionStoreAgentIds(params.cfg);
		const selectedAgentIds = configuredAgentIds.filter((agentId) => !params.agentIds || params.agentIds.has(agentId));
		const configuredStorePaths = new Set(configuredAgentIds.map((agentId) => path.resolve(resolveSessionStorePathCore(params.cfg?.session?.store, {
			agentId,
			env
		}))));
		const configuredAgentIdSet = new Set(configuredAgentIds);
		const targets = await prepareSessionStoreTargetInventoryRead(prepareSessionStoreTargetInventory(params.cfg, isPerAgentSessionStoreConfig(params.cfg.session?.store) ? selectedAgentIds : [.../* @__PURE__ */ new Set([...configuredAgentIds, ...params.agentIds ?? []])], env, "recovery")).withRead(async (snapshot) => snapshot.agents.flatMap(({ result }) => result.available ? result.targets : []));
		if (params.shouldContinue?.() === false) return [];
		for (const target of targets) {
			const storePath = path.resolve(target.storePath);
			if (!configuredAgentIdSet.has(target.agentId) && !configuredStorePaths.has(storePath)) continue;
			if (params.agentIds && !params.agentIds.has(target.agentId)) continue;
			storeTargets.push({
				...target,
				storePath
			});
		}
	} else for (const sessionsDir of await resolveAgentSessionDirs(stateDir)) {
		const storePath = path.join(sessionsDir, "sessions.json");
		storeTargets.push({
			agentId: resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath).agentId ?? "main",
			storePath
		});
	}
	if (params.shouldContinue?.() === false) return [];
	return storeTargets.filter((target) => (params.cfg !== void 0 || !params.agentIds || params.agentIds.has(target.agentId)) && !readAgentDatabaseAdmissionRefusal(target.agentId, { env })).toSorted((a, b) => a.storePath.localeCompare(b.storePath) || a.agentId.localeCompare(b.agentId));
}
/** A killed row may release fences only after the store owner proves there is no live work. */
function isKilledMainSessionRecoveryFenceOnly(entry) {
	const state = entry.mainRestartRecovery;
	return Boolean(entry.status === "killed" && entry.restartRecoveryRuns?.length && !entry.pendingFinalDelivery && !entry.restartRecoveryDeliveryRunId && !entry.restartRecoveryHarnessCompletion && !state?.reservation && !state?.foregroundClaims && !state?.tombstone);
}
//#endregion
export { readInterruptedRunId as a, mainSessionRecoveryLog as i, discoverRestartRecoveryStoreTargets as n, resolveRestartRecoveryTerminalClientRunId as o, isKilledMainSessionRecoveryFenceOnly as r, DEFAULT_RECOVERY_DELAY_MS as t };
