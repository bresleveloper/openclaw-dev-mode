import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { i as inspectGatewayCrashLoopBreakerInDatabase, n as GATEWAY_CRASH_LOOP_RECOVERED_REASON } from "./gateway-boot-lifecycle.kernel-DCfqqKmh.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/gateway-boot-lifecycle.worker.ts
const gatewayBootOperations = { "gatewayBoot.recover": (input, context) => runOpenClawStateWriteTransaction(({ db }) => {
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
}, context.stateOptions()) };
//#endregion
export { gatewayBootOperations };
