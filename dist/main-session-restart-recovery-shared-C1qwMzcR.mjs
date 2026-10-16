import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { S as listConfiguredSessionStoreAgentIds, w as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./openclaw-state-db-D1jWDzK3.mjs";
import { g as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-dWNS6Rcs.mjs";
import { t as resolveAgentSessionDirs } from "./session-dirs-SATsXf4g.mjs";
import { y as prepareSessionStoreTargetInventoryRead } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { r as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { c as hasSessionEntriesByStatusReadOnly } from "./session-accessor.entry-Di4jQk7u.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import "./sessions-DNhLX2Ep.mjs";
import path from "node:path";
//#region src/agents/main-session-recovery/main-session-restart-recovery-shared.ts
const mainSessionRecoveryLog = createSubsystemLogger("main-session-restart-recovery");
const DEFAULT_RECOVERY_DELAY_MS = 5e3;
function resolveRestartRecoveryTerminalClientRunId(entry) {
	return entry.restartRecoverySourceIngress === "control-ui" ? normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) : void 0;
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
		const configuredStorePaths = new Set(configuredAgentIds.map((agentId) => path.resolve(resolveSessionStorePathCore(params.cfg?.session?.store, {
			agentId,
			env
		}))));
		const configuredAgentIdSet = new Set(configuredAgentIds);
		const targets = await prepareSessionStoreTargetInventoryRead(prepareSessionStoreTargetInventory(params.cfg, configuredAgentIds, env, "recovery")).withRead(async (snapshot) => snapshot.agents.flatMap(({ result }) => result.available ? result.targets : []));
		if (params.shouldContinue?.() === false) return [];
		for (const target of targets) {
			const storePath = path.resolve(target.storePath);
			if (!configuredAgentIdSet.has(target.agentId) && !configuredStorePaths.has(storePath)) continue;
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
	const eligibleTargets = [];
	for (const target of storeTargets) {
		if (params.shouldContinue?.() === false) return [];
		if (readAgentDatabaseAdmissionRefusal(target.agentId, { env })) continue;
		const hasStatus = !params.statuses || await hasSessionEntriesByStatusReadOnly({
			...target,
			env
		}, params.statuses);
		if (params.shouldContinue?.() === false) return [];
		if (hasStatus) eligibleTargets.push(target);
	}
	return eligibleTargets.filter((target) => !readAgentDatabaseAdmissionRefusal(target.agentId, { env })).toSorted((a, b) => a.storePath.localeCompare(b.storePath) || a.agentId.localeCompare(b.agentId));
}
//#endregion
export { resolveRestartRecoveryTerminalClientRunId as i, discoverRestartRecoveryStoreTargets as n, mainSessionRecoveryLog as r, DEFAULT_RECOVERY_DELAY_MS as t };
