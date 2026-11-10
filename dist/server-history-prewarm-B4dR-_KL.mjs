import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { C as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { i as prepareSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { c as maintenanceLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { n as prewarmSessionHistoryWorker, t as isSessionHistoryWorkerCold } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import fs from "node:fs/promises";
//#region src/gateway/server-history-prewarm.ts
const log = createSubsystemLogger("gateway");
async function prewarmGatewaySessionHistory(config, options = {}) {
	try {
		if (options.onlyIfCold && !isSessionHistoryWorkerCold() && (!options.includeMaintenance || !isSessionHistoryWorkerCold(maintenanceLane))) return;
		for (const agentId of listConfiguredSessionStoreAgentIds(config)) {
			if (options.isCancelled?.()) return;
			try {
				const storePath = resolveSessionStorePathCore(config.session?.store, { agentId });
				const database = await prepareSqliteTargetFromSessionStorePath(storePath, {
					agentId,
					defaultAgentId: resolveSessionStoreCompatibilityAgentId(config)
				});
				if (await fs.stat(database.path).then((stat) => stat.isFile(), (error) => {
					if (hasErrnoCode(error, "ENOENT")) return false;
					throw error;
				}) && !options.isCancelled?.()) {
					const target = {
						...database,
						agentId: database.agentId ?? agentId
					};
					await prewarmSessionHistoryWorker(target);
					if (options.includeMaintenance && !options.isCancelled?.()) await prewarmSessionHistoryWorker(target, maintenanceLane);
				}
			} catch (error) {
				log.debug(`Session history prewarm failed for ${agentId}: ${String(error)}`);
			}
		}
	} catch (error) {
		log.debug(`Session history prewarm failed: ${String(error)}`);
	}
}
//#endregion
export { prewarmGatewaySessionHistory };
