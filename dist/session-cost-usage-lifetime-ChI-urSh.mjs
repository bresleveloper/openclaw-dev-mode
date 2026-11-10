import { t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as getActiveRemoteModelCatalog } from "./remote-overlay-ClWDV070.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { _ as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-CeDA0ojh.mjs";
import { i as onInternalSessionTranscriptUpdate } from "./transcript-events-D3brcRJS.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { t as listGatewayAgentsBasic } from "./agent-list-CCh58b5o.mjs";
import { i as registerPreparedModelRuntimePublicationListener } from "./prepared-model-runtime.publication-events-cMcm_IYL.mjs";
import { i as requestCostUsageCacheRefresh } from "./session-cost-usage-cache-runtime-CYTPw1GD.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/session-cost-usage-lifetime.ts
/** Committed publications feed the existing worker queue even when no report is open. */
function startSessionCostUsageProjectionLifetime(params) {
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const work = new AsyncWorkScope();
	const refreshAgent = (agentId, storePath, sessionFiles, coalesce = false) => inOwnerContext(() => {
		if (work.isClosing || readAgentDatabaseAdmissionRefusal(agentId)) return;
		const config = params.getConfig();
		work.run(() => requestCostUsageCacheRefresh({
			config,
			agentId,
			storePath: storePath ?? resolveSessionStorePathForScope({ agentId }, config),
			sessionFiles,
			coalesce
		}));
	});
	const refreshAll = () => inOwnerContext(() => {
		if (work.isClosing) return;
		work.track(async () => {
			const { agents } = await listGatewayAgentsBasic(params.getConfig());
			for (const agent of agents) refreshAgent(agent.id);
		}).catch((error) => {
			if (!work.isClosing) params.warn(`Usage projection backfill could not start: ${String(error)}`);
		});
	});
	const offTranscript = onInternalSessionTranscriptUpdate((update) => {
		const target = update.target;
		if (!target || isIncognitoSessionKey(target.sessionKey)) return;
		if (isRecord(update.message) && !update.message.usage) {
			const role = update.message.role;
			if (role === "user" || role === "system" || role === "toolResult" || role === "custom") return;
		}
		const storePath = target.storePath ?? resolveSessionStorePathForScope({
			agentId: target.agentId,
			sessionKey: target.sessionKey
		}, params.getConfig());
		refreshAgent(target.agentId, storePath, [update.sessionFile ?? formatSqliteSessionFileMarker({
			...target,
			storePath
		})], true);
	});
	const offRows = sessionChanges.subscribeFacts((change) => {
		if ("all" in change) {
			if (change.scope === "config" || change.scope === "stores" || typeof change.scope === "object") refreshAll();
		} else if (change.facts?.kind === "removed" && !isIncognitoSessionKey(change.sessionKey)) {
			if (change.agentId) refreshAgent(change.agentId, change.storePath);
			else refreshAll();
		}
	});
	let pricingRevision = getActiveRemoteModelCatalog(params.getConfig())?.revision;
	const offModels = registerPreparedModelRuntimePublicationListener((event) => {
		if (event.phase === "published" || event.phase === "catalog-published") {
			const next = getActiveRemoteModelCatalog(params.getConfig())?.revision;
			if (next === pricingRevision) return;
			pricingRevision = next;
			refreshAll();
		}
	});
	refreshAll();
	return { async stop() {
		offTranscript();
		offRows();
		offModels();
		work.beginClose();
		await work.drain();
	} };
}
//#endregion
export { startSessionCostUsageProjectionLifetime };
