import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as pathMayExistSync } from "./path-existence-O1bMV6vh.mjs";
import { a as inspectGatewayCrashLoopBreakerInDatabase, i as buildGatewayCrashLoopBreakerDecision, o as maintenanceStartupReasons } from "./gateway-boot-lifecycle.kernel-BKdHuusn.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/gateway-boot-lifecycle.ts
const GATEWAY_BOOT_LIFECYCLE_RETENTION_MS = 864e5;
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
	return (await executeExistingOpenClawStateRead({ env }, {
		type: "gatewayBoot.breaker",
		input: nowMs
	}, {
		signal,
		current: true
	}))?.decision ?? buildGatewayCrashLoopBreakerDecision({ uncleanBoots: 0 });
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
async function completeGatewayBootLifecycle(bootId, completion, env = process.env, nowMs = Date.now()) {
	if (!bootId) return;
	const signal = completion.outcome !== "clean_stop" ? void 0 : completion.reason === "stop (SIGTERM)" ? "SIGTERM" : completion.reason === "stop (SIGINT)" ? "SIGINT" : void 0;
	try {
		const context = captureOpenClawStateWorkerContext({ env });
		const recentStops = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "gatewayBoot.complete",
			input: {
				bootId,
				completion,
				nowMs,
				countSignalStops: signal !== void 0
			}
		}));
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
export { inspectGatewayCrashLoopBreakerAsync as a, recordGatewayBootStart as c, inspectGatewayCrashLoopBreaker as i, recordGatewayCrashLoopRecovery as l, formatGatewayCrashLoopManualChannelStartHint as n, readGatewayLastInstallationReplacement as o, formatGatewayRepeatedSignalHint as r, readGatewayLastShutdown as s, completeGatewayBootLifecycle as t, repairGatewayMaintenanceStartupFailures as u };
