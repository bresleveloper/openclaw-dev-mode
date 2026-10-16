import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { t as pathMayExistSync } from "./path-existence-O1bMV6vh.mjs";
import { a as maintenanceStartupReasons, i as inspectGatewayCrashLoopBreakerInDatabase, r as buildGatewayCrashLoopBreakerDecision } from "./gateway-boot-lifecycle.kernel-DCfqqKmh.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/gateway-boot-lifecycle.ts
const GATEWAY_BOOT_LIFECYCLE_RETENTION_MS = 864e5;
const GATEWAY_SIGNAL_REPEAT_WINDOW_MS = 3e5;
function formatGatewayRepeatedSignalHint(signal, count, observation = "received") {
	return `${observation} ${signal} ${count} times in 5 min: another supervisor may be managing this Gateway — see \`openclaw gateway status --deep\``;
}
/**
* The breaker only self-clears after the full window drains. Operator surfaces name the manual
* override command, not the internal RPC. Account hints carry accountId to avoid starting a
* different default account than the warning named.
*/
function formatGatewayCrashLoopManualChannelStartHint(target) {
	const params = JSON.stringify({
		channel: target?.channelId ?? "<id>",
		...target?.accountId ? { accountId: target.accountId } : {}
	});
	return `Start a channel manually with: ${formatCliCommand("openclaw gateway call channels.start")} --params '${params}'`;
}
const gatewayLifecycleLog = createSubsystemLogger("gateway/lifecycle");
function readGatewayLastShutdown(env = process.env) {
	try {
		return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
			const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("gateway_boot_lifecycle").select(["reason", "completed_at_ms as completedAtMs"]).where("outcome", "in", [
				"clean_stop",
				"planned_restart",
				"forced_stop"
			]).where("completed_at_ms", "is not", null).orderBy("completed_at_ms", "desc").limit(1));
			return row?.completedAtMs == null ? void 0 : {
				...row,
				completedAtMs: row.completedAtMs
			};
		}, { env });
	} catch {
		return;
	}
}
function readGatewayLastInstallationReplacement(env = process.env) {
	const lastShutdown = readGatewayLastShutdown(env);
	if (!lastShutdown?.reason?.startsWith("gateway.installation_replaced:")) return;
	return {
		reason: lastShutdown.reason,
		completedAtMs: lastShutdown.completedAtMs
	};
}
function inspectGatewayCrashLoopBreaker(env = process.env, nowMs = Date.now()) {
	try {
		const { db } = openOpenClawStateDatabase({ env });
		return inspectGatewayCrashLoopBreakerInDatabase(db, nowMs);
	} catch (err) {
		gatewayLifecycleLog.warn(`crash-loop breaker state unavailable; fail-open: ${String(err)}`);
		return buildGatewayCrashLoopBreakerDecision({ uncleanBoots: 0 });
	}
}
/** Runtime readers share the boot owner's decision without opening SQLite on the main thread. */
async function inspectGatewayCrashLoopBreakerAsync(env = process.env, nowMs = Date.now(), signal) {
	const reply = await executeExistingOpenClawStateRead({ env }, {
		type: "gatewayBoot.breaker",
		input: nowMs
	}, {
		signal,
		current: true
	});
	if (reply && (!reply.ok || reply.type !== "gatewayBoot.breaker")) throw new Error("Unexpected Gateway crash-loop breaker result");
	return reply?.decision ?? buildGatewayCrashLoopBreakerDecision({ uncleanBoots: 0 });
}
function recordGatewayBootStart(env = process.env, nowMs = Date.now(), reason) {
	const bootId = randomUUID();
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const kysely = getNodeSqliteKysely(db);
			executeSqliteQuerySync(db, kysely.deleteFrom("gateway_boot_lifecycle").where("started_at_ms", "<", nowMs - GATEWAY_BOOT_LIFECYCLE_RETENTION_MS));
			executeSqliteQuerySync(db, kysely.insertInto("gateway_boot_lifecycle").values({
				boot_id: bootId,
				pid: process.pid,
				started_at_ms: nowMs,
				completed_at_ms: null,
				outcome: null,
				startup_reason: reason ?? null,
				reason: null
			}));
		}, { env });
		return bootId;
	} catch (err) {
		gatewayLifecycleLog.warn(`failed to persist gateway boot start; fail-open: ${String(err)}`);
		return;
	}
}
/**
* Split a stable safe-mode lifetime before channel autostart resumes. A fresh
* open row makes a process death during recovered channel startup count toward
* the next breaker decision instead of aging out with the original boot.
*/
async function recordGatewayCrashLoopRecovery(bootId, env = process.env, nowMs, assertCurrent) {
	try {
		const context = captureOpenClawStateWorkerContext({ env });
		return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "gatewayBoot.recover",
			input: {
				bootId,
				nowMs
			}
		}), {
			assertCurrent,
			createAdmission: createSqliteWorkerWriteAdmission(() => {
				context.admission.assertCurrent();
				assertCurrent?.();
			}, [context.admission.databasePath])
		});
	} catch (err) {
		gatewayLifecycleLog.warn(`failed to persist gateway crash-loop recovery; fail-safe: ${String(err)}`);
		return;
	}
}
function completeGatewayBootLifecycle(bootId, completion, env = process.env, nowMs = Date.now()) {
	if (!bootId) return;
	const signal = completion.outcome !== "clean_stop" ? void 0 : completion.reason === "stop (SIGTERM)" ? "SIGTERM" : completion.reason === "stop (SIGINT)" ? "SIGINT" : void 0;
	try {
		const recentStops = runOpenClawStateWriteTransaction(({ db }) => {
			const kysely = getNodeSqliteKysely(db);
			executeSqliteQuerySync(db, kysely.updateTable("gateway_boot_lifecycle").set({
				completed_at_ms: nowMs,
				outcome: completion.outcome,
				...completion.startupReason ? { startup_reason: completion.startupReason } : {},
				reason: completion.reason ?? null
			}).where("boot_id", "=", bootId));
			return signal ? executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("gateway_boot_lifecycle").select((eb) => eb.fn.countAll().as("count")).where("outcome", "=", "clean_stop").where("reason", "=", completion.reason ?? null).where("completed_at_ms", ">=", nowMs - GATEWAY_SIGNAL_REPEAT_WINDOW_MS))?.count : void 0;
		}, { env });
		if (signal && recentStops !== void 0 && recentStops >= 3) gatewayLifecycleLog.warn(formatGatewayRepeatedSignalHint(signal, recentStops, "stopped after"));
	} catch (err) {
		gatewayLifecycleLog.warn(`failed to persist gateway boot outcome; fail-open: ${String(err)}`);
	}
}
function repairGatewayMaintenanceStartupFailures(env = process.env) {
	if (!pathMayExistSync(resolveOpenClawStateSqlitePath(env))) return 0;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			const kysely = getNodeSqliteKysely(db);
			const result = executeSqliteQuerySync(db, kysely.updateTable("gateway_boot_lifecycle").set({ outcome: "startup_failure_repaired" }).where("outcome", "=", "startup_failed").where("startup_reason", "in", maintenanceStartupReasons));
			return Number(result.numAffectedRows ?? 0);
		}, { env });
	} catch (err) {
		gatewayLifecycleLog.warn(`failed to repair maintenance startup history; fail-open: ${String(err)}`);
		return 0;
	}
}
//#endregion
export { inspectGatewayCrashLoopBreaker as a, readGatewayLastShutdown as c, repairGatewayMaintenanceStartupFailures as d, formatGatewayRepeatedSignalHint as i, recordGatewayBootStart as l, completeGatewayBootLifecycle as n, inspectGatewayCrashLoopBreakerAsync as o, formatGatewayCrashLoopManualChannelStartHint as r, readGatewayLastInstallationReplacement as s, GATEWAY_SIGNAL_REPEAT_WINDOW_MS as t, recordGatewayCrashLoopRecovery as u };
