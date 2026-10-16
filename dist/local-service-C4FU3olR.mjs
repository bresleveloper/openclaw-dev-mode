import { a as getResolvedLoggerSettings, l as toPinoLikeLogger, r as getChildLogger } from "./logger-Mnn26Jj7.mjs";
import { t as GatewayScheduler } from "./gateway-scheduler-BYbkpAYn.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { C as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { o as isAgentDeletionBlocked } from "./agent-lifecycle-registry-kGv3atS9.mjs";
import { t as resolveCronJobsStorePath } from "./paths-C7ju4So0.mjs";
import "./store-ChPMJI5O.mjs";
import { t as CronService } from "./service-BDq06CD2.mjs";
//#region src/cron/local-service.ts
async function withLocalAgentCronJobsRemoved(agentId, getRuntimeConfig, commit) {
	const cfg = getRuntimeConfig();
	const storePath = resolveCronJobsStorePath();
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
		isAgentAvailable: (id, database, facts) => !(facts?.deletionBlocked ?? isAgentDeletionBlocked(id, {}, database)) && listAgentIds(getRuntimeConfig()).some((configuredId) => normalizeAgentId(configuredId) === id),
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
