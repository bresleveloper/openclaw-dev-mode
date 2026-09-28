import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON } from "./startup-maintenance-required-OfhrhQoQ.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as pathMayExistSync } from "./path-existence-ZQl5cy75.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/gateway-boot-lifecycle.ts
const maintenanceStartupReasons = [GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON, "gateway.agent_media_migration_required"];
const GATEWAY_BOOT_LOOP_UNCLEAN_THRESHOLD = 3;
const GATEWAY_BOOT_LOOP_WINDOW_MS = 3e5;
const GATEWAY_BOOT_LIFECYCLE_RETENTION_MS = 864e5;
const GATEWAY_CRASH_LOOP_BREAKER_REASON = "gateway.crash_loop_breaker";
const GATEWAY_CRASH_LOOP_RECOVERED_REASON = "gateway.crash_loop_recovered";
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
function buildGatewayCrashLoopBreakerDecision(params) {
	const windowMs = params.windowMs ?? GATEWAY_BOOT_LOOP_WINDOW_MS;
	const tripped = params.uncleanBoots >= GATEWAY_BOOT_LOOP_UNCLEAN_THRESHOLD;
	const hasUnrecoveredBreakerMarker = typeof params.latestBreakerStartedAtMs === "number" && (typeof params.latestRecoveryStartedAtMs !== "number" || params.latestRecoveryStartedAtMs < params.latestBreakerStartedAtMs);
	return {
		tripped,
		uncleanBoots: params.uncleanBoots,
		windowMs,
		shouldWriteStabilityBundle: tripped && !hasUnrecoveredBreakerMarker,
		recovered: !tripped && hasUnrecoveredBreakerMarker
	};
}
function inspectGatewayCrashLoopBreaker(env = process.env, nowMs = Date.now()) {
	try {
		const { db } = openOpenClawStateDatabase({ env });
		const kysely = getNodeSqliteKysely(db);
		const windowStartMs = nowMs - GATEWAY_BOOT_LOOP_WINDOW_MS;
		const uncleanRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("gateway_boot_lifecycle").select((eb) => eb.fn.countAll().as("count")).where((eb) => eb.or([eb("startup_reason", "is", null), eb("startup_reason", "not in", maintenanceStartupReasons)])).where((eb) => eb.or([eb.and([eb("completed_at_ms", "is", null), eb("started_at_ms", ">=", windowStartMs)]), eb.and([eb("outcome", "=", "startup_failed"), eb("completed_at_ms", ">=", windowStartMs)])])));
		const latestBreaker = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("gateway_boot_lifecycle").select("started_at_ms as startedAtMs").where("startup_reason", "=", GATEWAY_CRASH_LOOP_BREAKER_REASON).orderBy("started_at_ms", "desc").limit(1));
		const latestRecovery = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("gateway_boot_lifecycle").select("started_at_ms as startedAtMs").where("startup_reason", "=", GATEWAY_CRASH_LOOP_RECOVERED_REASON).orderBy("started_at_ms", "desc").limit(1));
		return buildGatewayCrashLoopBreakerDecision({
			uncleanBoots: uncleanRow?.count ?? 0,
			latestBreakerStartedAtMs: latestBreaker?.startedAtMs,
			latestRecoveryStartedAtMs: latestRecovery?.startedAtMs
		});
	} catch (err) {
		gatewayLifecycleLog.warn(`crash-loop breaker state unavailable; fail-open: ${String(err)}`);
		return buildGatewayCrashLoopBreakerDecision({ uncleanBoots: 0 });
	}
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
function recordGatewayCrashLoopRecovery(bootId, env = process.env, nowMs = Date.now()) {
	const recoveredBootId = randomUUID();
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const kysely = getNodeSqliteKysely(db);
			if (bootId) executeSqliteQuerySync(db, kysely.updateTable("gateway_boot_lifecycle").set({
				completed_at_ms: nowMs,
				outcome: "safe_mode_stable",
				reason: null
			}).where("boot_id", "=", bootId));
			executeSqliteQuerySync(db, kysely.insertInto("gateway_boot_lifecycle").values({
				boot_id: recoveredBootId,
				pid: process.pid,
				started_at_ms: nowMs,
				completed_at_ms: null,
				outcome: null,
				startup_reason: GATEWAY_CRASH_LOOP_RECOVERED_REASON,
				reason: null
			}));
		}, { env });
		return recoveredBootId;
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
export { formatGatewayCrashLoopManualChannelStartHint as a, readGatewayLastInstallationReplacement as c, recordGatewayCrashLoopRecovery as d, repairGatewayMaintenanceStartupFailures as f, completeGatewayBootLifecycle as i, readGatewayLastShutdown as l, GATEWAY_CRASH_LOOP_RECOVERED_REASON as n, formatGatewayRepeatedSignalHint as o, GATEWAY_SIGNAL_REPEAT_WINDOW_MS as r, inspectGatewayCrashLoopBreaker as s, GATEWAY_CRASH_LOOP_BREAKER_REASON as t, recordGatewayBootStart as u };
