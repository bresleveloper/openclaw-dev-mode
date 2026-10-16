import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as readRepositoryWorkerProjectSnapshot } from "./repository-project-source-BDUCsCdT.mjs";
//#region src/gateway/worker-environments/prepared-pool-presence-store.worker.ts
const PREPARED_POOL_PRESENCE_STATE_KEY = "cloudWorkers.preparedPool.humanPresenceDemand";
function parsePresenceDemand(value) {
	if (!isRecord(value)) throw new Error("Prepared-pool presence demand is invalid");
	const candidate = value;
	const revision = candidate.revision;
	const profileId = candidate.profileId;
	const requestedRef = candidate.requestedRef;
	const preparationKey = candidate.preparationKey;
	const lastPresentAtMs = candidate.lastPresentAtMs;
	const retireAtMs = candidate.retireAtMs;
	let project;
	try {
		project = readRepositoryWorkerProjectSnapshot(candidate.project);
	} catch {
		throw new Error("Prepared-pool presence demand is invalid");
	}
	if (typeof revision !== "number" || !Number.isSafeInteger(revision) || revision < 1 || typeof profileId !== "string" || !/^[A-Za-z0-9_-]{1,128}$/u.test(profileId) || requestedRef !== null && (typeof requestedRef !== "string" || !requestedRef || requestedRef.length > 1024) || typeof preparationKey !== "string" || !/^[a-f0-9]{64}$/u.test(preparationKey) || !project || typeof lastPresentAtMs !== "number" || !Number.isSafeInteger(lastPresentAtMs) || lastPresentAtMs < 0 || retireAtMs !== null && (typeof retireAtMs !== "number" || !Number.isSafeInteger(retireAtMs) || retireAtMs < lastPresentAtMs)) throw new Error("Prepared-pool presence demand is invalid");
	return {
		revision,
		profileId,
		requestedRef,
		preparationKey,
		project,
		lastPresentAtMs,
		retireAtMs
	};
}
function writePreparedPoolPresenceDemandInDatabase(database, value) {
	const db = getNodeSqliteKysely(database);
	if (value === null) {
		executeSqliteQuerySync(database, db.deleteFrom("config_machine_state").where("state_key", "=", PREPARED_POOL_PRESENCE_STATE_KEY));
		return;
	}
	const prepared = parsePresenceDemand(value);
	const valueJson = JSON.stringify(prepared);
	executeSqliteQuerySync(database, db.insertInto("config_machine_state").values({
		state_key: PREPARED_POOL_PRESENCE_STATE_KEY,
		value_json: valueJson,
		updated_at_ms: Date.now()
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: valueJson,
		updated_at_ms: Date.now()
	})));
	return prepared;
}
//#endregion
//#region src/gateway/worker-environments/prepared-pool-presence.worker.ts
const preparedPoolPresenceOperations = { "preparedPoolPresence.write": (value, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => {
	requestSqliteWorkerOperationAdmission({
		stage: "transaction",
		facts: void 0
	});
	const result = writePreparedPoolPresenceDemandInDatabase(db, value);
	requestSqliteWorkerOperationAdmission({
		stage: "commit",
		facts: void 0
	});
	return result;
}, {
	database: open(),
	...stateOptions()
}, { operationLabel: "prepared-pool.presence-demand.write" }) };
//#endregion
export { preparedPoolPresenceOperations };
