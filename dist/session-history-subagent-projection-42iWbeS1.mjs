import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-D-WNA1Ka.mjs";
import { t as createBoundSessionHistorySubagentProjection } from "./session-history-readonly-reader-BFu_QUcS.mjs";
import { t as prepareGatewaySessionStoreReadSources } from "./session-utils-store-sources-CEhwSBBh.mjs";
//#region src/gateway/session-history-subagent-projection.ts
/** Bind host-owned stores and retain their admission for one display operation. */
function createSessionHistorySubagentProjection(scope, options = {}) {
	const databaseOptions = toDatabaseOptions(resolveSqliteTranscriptReadScope(scope));
	const currentSource = {
		agentId: databaseOptions.agentId,
		path: resolveOpenClawAgentSqlitePath(databaseOptions)
	};
	const context = captureOpenClawStateWorkerContext();
	const sourceReads = prepareGatewaySessionStoreReadSources({
		cfg: getRuntimeConfig(),
		currentSource,
		env: process.env,
		registryPath: context.admission.databasePath,
		deferSources: options.deferSources
	});
	const bound = createBoundSessionHistorySubagentProjection((read) => withCurrentProjectionSnapshot(scope, read, { readOnly: true }), {
		path: context.admission.databasePath,
		environment: context.environment,
		coordinatorRuntime: context.coordinatorRuntime
	}, () => sourceReads.sources);
	const assertCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		sourceReads.assertCurrent();
	};
	const readCurrent = (read) => {
		assertCurrent();
		const result = read();
		assertCurrent();
		return result;
	};
	return {
		assertCurrent,
		isSubagentSession: (sessionKey) => readCurrent(() => bound.isSubagentSession(sessionKey)),
		isSubagentRunMessage: (runId, messageSeq) => readCurrent(() => bound.isSubagentRunMessage(runId, messageSeq))
	};
}
//#endregion
export { createSessionHistorySubagentProjection as t };
