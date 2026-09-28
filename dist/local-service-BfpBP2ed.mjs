import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, b as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { i as tryGetLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { a as getResolvedLoggerSettings, l as toPinoLikeLogger, r as getChildLogger } from "./logger--ALOusOG.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { a as isAgentDeletionBlocked } from "./agent-lifecycle-registry-D47RUurT.mjs";
import { t as resolveCronJobsStorePath } from "./paths-Bz2goYfd.mjs";
import "./store-CV1wrdMb.mjs";
import { t as CronService } from "./service-DqDFGGs1.mjs";
//#region src/cron/local-service.ts
async function withLocalAgentCronJobsRemoved(agentId, getRuntimeConfig, commit) {
	const cfg = getRuntimeConfig();
	const storePath = resolveCronJobsStorePath();
	const service = new CronService({
		storePath,
		cronEnabled: cfg.cron?.enabled !== false,
		cronConfig: cfg.cron,
		log: toPinoLikeLogger(getChildLogger({
			module: "cron",
			storeKey: storePath
		}), getResolvedLoggerSettings().level),
		defaultAgentId: tryResolveAmbientOwnerAgentId(cfg),
		legacyDefaultAgentId: tryGetLegacyDefaultAgentId(cfg),
		resolveDefaultAgentId: () => tryResolveAmbientOwnerAgentId(getRuntimeConfig()),
		isAgentAvailable: (id) => !isAgentDeletionBlocked(id) && listAgentIds(getRuntimeConfig()).some((configuredId) => normalizeAgentId(configuredId) === id),
		enqueueSystemEvent: () => false,
		requestHeartbeat: () => {},
		runIsolatedAgentJob: async () => {
			throw new Error("Cron execution is unavailable in local service context.");
		}
	});
	try {
		return await service.removeAgentJobsTransactional(agentId, commit);
	} finally {
		service.stop();
	}
}
//#endregion
export { withLocalAgentCronJobsRemoved as t };
