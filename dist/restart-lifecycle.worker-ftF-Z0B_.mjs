import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
//#region src/infra/restart-lifecycle.worker.ts
const restartLifecycleOperations = {
	"restartLifecycle.consumeIntent": (_input, { write }) => write(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const stateDb = getNodeSqliteKysely(db);
		const row = executeSqliteQueryTakeFirstSync(db, stateDb.deleteFrom("gateway_restart_intent").where("intent_key", "=", "gateway-restart").returning([
			"kind",
			"pid",
			"created_at",
			"reason",
			"force",
			"wait_ms"
		]));
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		deferSqliteWorkerCommitReceipt(db, {
			kind: "restart-intent-consumed",
			row
		});
		return row;
	}, { operationLabel: "gateway.restart-intent.consume" }),
	"restartLifecycle.writeHandoff": (payload, { write }) => write(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const stateDb = getNodeSqliteKysely(db);
		const row = {
			kind: payload.kind,
			version: payload.version,
			intent_id: payload.intentId,
			pid: payload.pid,
			process_instance_id: payload.processInstanceId ?? null,
			created_at: payload.createdAt,
			expires_at: payload.expiresAt,
			reason: payload.reason ?? null,
			restart_trace_started_at: payload.restartTrace?.startedAt ?? null,
			restart_trace_last_at: payload.restartTrace?.lastAt ?? null,
			source: payload.source,
			restart_kind: payload.restartKind,
			supervisor_mode: payload.supervisorMode,
			updated_at_ms: Date.now()
		};
		executeSqliteQuerySync(db, stateDb.insertInto("gateway_restart_handoff").values({
			handoff_key: "current",
			...row
		}).onConflict((conflict) => conflict.column("handoff_key").doUpdateSet(row)));
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		deferSqliteWorkerCommitReceipt(db, payload);
	}, { operationLabel: "gateway.restart-handoff.write" })
};
//#endregion
export { restartLifecycleOperations };
