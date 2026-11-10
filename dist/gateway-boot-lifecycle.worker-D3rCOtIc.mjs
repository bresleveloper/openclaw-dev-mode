import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { a as inspectGatewayCrashLoopBreakerInDatabase, n as GATEWAY_CRASH_LOOP_RECOVERED_REASON, r as GATEWAY_SIGNAL_REPEAT_WINDOW_MS } from "./gateway-boot-lifecycle.kernel-BKdHuusn.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/gateway-boot-lifecycle.worker.ts
const gatewayBootOperations = {
	"gatewayBoot.complete": (input, context) => runOpenClawStateWriteTransaction(({ db }) => {
		const { bootId, completion, nowMs } = input;
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.updateTable("gateway_boot_lifecycle").set({
			completed_at_ms: nowMs,
			outcome: completion.outcome,
			...completion.startupReason ? { startup_reason: completion.startupReason } : {},
			reason: completion.reason ?? null
		}).where("boot_id", "=", bootId));
		return input.countSignalStops ? executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("gateway_boot_lifecycle").select((eb) => eb.fn.countAll().as("count")).where("outcome", "=", "clean_stop").where("reason", "=", completion.reason ?? null).where("completed_at_ms", ">=", nowMs - GATEWAY_SIGNAL_REPEAT_WINDOW_MS))?.count : void 0;
	}, context.stateOptions()),
	"gatewayBoot.recover": (input, context) => runOpenClawStateWriteTransaction(({ db }) => {
		const nowMs = input.nowMs ?? Date.now();
		const decision = inspectGatewayCrashLoopBreakerInDatabase(db, nowMs);
		if (!decision.recovered || decision.uncleanBoots !== 0) return;
		const kysely = getNodeSqliteKysely(db);
		if (input.bootId) {
			if (executeSqliteQuerySync(db, kysely.updateTable("gateway_boot_lifecycle").set({
				completed_at_ms: nowMs,
				outcome: "safe_mode_stable",
				reason: null
			}).where("boot_id", "=", input.bootId).where("completed_at_ms", "is", null)).numAffectedRows !== 1n) return;
		}
		const recoveredBootId = randomUUID();
		executeSqliteQuerySync(db, kysely.insertInto("gateway_boot_lifecycle").values({
			boot_id: recoveredBootId,
			pid: process.pid,
			started_at_ms: nowMs,
			completed_at_ms: null,
			outcome: null,
			startup_reason: GATEWAY_CRASH_LOOP_RECOVERED_REASON,
			reason: null
		}));
		return recoveredBootId;
	}, context.stateOptions())
};
//#endregion
export { gatewayBootOperations };
