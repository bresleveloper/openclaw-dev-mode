import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { S as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { i as prepareSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { r as prewarmSessionHistoryWorker, t as isSessionHistoryWorkerCold } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import fs from "node:fs/promises";
//#region src/gateway/server-history-prewarm.ts
const log = createSubsystemLogger("gateway");
async function prewarmGatewaySessionHistory(config, options = {}) {
	try {
		if (options.onlyIfCold && !isSessionHistoryWorkerCold()) return;
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
				}) && !options.isCancelled?.()) await prewarmSessionHistoryWorker({
					...database,
					agentId: database.agentId ?? agentId
				});
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
