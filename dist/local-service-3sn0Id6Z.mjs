import { a as getResolvedLoggerSettings, l as toPinoLikeLogger, r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { t as GatewayScheduler } from "./gateway-scheduler-DzQtXKjV.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { w as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as resolveCronJobsStorePathAsync } from "./paths-C7jZRDkL.mjs";
import "./store-HF7PvtRl.mjs";
import { t as CronService } from "./service-BD8QmFYE.mjs";
//#region src/cron/local-service.ts
async function withLocalAgentCronJobsRemoved(agentId, getRuntimeConfig, commit) {
	const cfg = getRuntimeConfig();
	const storePath = await resolveCronJobsStorePathAsync();
	const scheduler = new GatewayScheduler();
	const service = new CronService({
		scheduler,
		storePath,
		cronEnabled: cfg.cron?.enabled ?? true,
		cronConfig: cfg.cron,
		log: toPinoLikeLogger(getChildLogger({
			module: "cron",
			storeKey: storePath
		}), getResolvedLoggerSettings().level),
		defaultAgentId: tryResolveAmbientOwnerAgentId(cfg),
		resolveDefaultAgentId: () => tryResolveAmbientOwnerAgentId(getRuntimeConfig()),
		isAgentAvailable: (id, facts) => !facts.deletionBlocked && listAgentIds(getRuntimeConfig()).some((configuredId) => normalizeAgentId(configuredId) === id),
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
		await scheduler.stop();
	}
}
//#endregion
export { withLocalAgentCronJobsRemoved as t };
