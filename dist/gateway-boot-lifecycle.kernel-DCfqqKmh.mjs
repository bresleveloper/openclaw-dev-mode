import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON } from "./startup-maintenance-required-rkhEAmAi.mjs";
//#region src/infra/gateway-boot-lifecycle.kernel.ts
const GATEWAY_BOOT_LOOP_UNCLEAN_THRESHOLD = 3;
const GATEWAY_BOOT_LOOP_WINDOW_MS = 3e5;
const GATEWAY_CRASH_LOOP_BREAKER_REASON = "gateway.crash_loop_breaker";
const GATEWAY_CRASH_LOOP_RECOVERED_REASON = "gateway.crash_loop_recovered";
const maintenanceStartupReasons = [GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON, "gateway.agent_media_migration_required"];
function buildGatewayCrashLoopBreakerDecision(params) {
	const tripped = params.uncleanBoots >= GATEWAY_BOOT_LOOP_UNCLEAN_THRESHOLD;
	const hasUnrecoveredBreakerMarker = typeof params.latestBreakerStartedAtMs === "number" && (typeof params.latestRecoveryStartedAtMs !== "number" || params.latestRecoveryStartedAtMs < params.latestBreakerStartedAtMs);
	return {
		tripped,
		recoveryPausedUntilMs: hasUnrecoveredBreakerMarker && params.latestUncleanAtMs != null ? params.latestUncleanAtMs + GATEWAY_BOOT_LOOP_WINDOW_MS + 1 : void 0,
		uncleanBoots: params.uncleanBoots,
		windowMs: GATEWAY_BOOT_LOOP_WINDOW_MS,
		shouldWriteStabilityBundle: tripped && !hasUnrecoveredBreakerMarker,
		recovered: !tripped && hasUnrecoveredBreakerMarker
	};
}
function inspectGatewayCrashLoopBreakerInDatabase(db, nowMs) {
	const kysely = getNodeSqliteKysely(db);
	const windowStartMs = nowMs - GATEWAY_BOOT_LOOP_WINDOW_MS;
	const uncleanRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("gateway_boot_lifecycle").select((eb) => [eb.fn.countAll().as("count"), eb.fn.max(eb.fn.coalesce("completed_at_ms", "started_at_ms")).as("latestUncleanAtMs")]).where((eb) => eb.or([eb("startup_reason", "is", null), eb("startup_reason", "not in", maintenanceStartupReasons)])).where((eb) => eb.or([eb.and([eb("completed_at_ms", "is", null), eb("started_at_ms", ">=", windowStartMs)]), eb.and([eb("outcome", "=", "startup_failed"), eb("completed_at_ms", ">=", windowStartMs)])])));
	const latestBreaker = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("gateway_boot_lifecycle").select("started_at_ms as startedAtMs").where("startup_reason", "=", GATEWAY_CRASH_LOOP_BREAKER_REASON).orderBy("started_at_ms", "desc").limit(1));
	const latestRecovery = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("gateway_boot_lifecycle").select("started_at_ms as startedAtMs").where("startup_reason", "=", GATEWAY_CRASH_LOOP_RECOVERED_REASON).orderBy("started_at_ms", "desc").limit(1));
	return buildGatewayCrashLoopBreakerDecision({
		uncleanBoots: uncleanRow?.count ?? 0,
		latestUncleanAtMs: uncleanRow?.latestUncleanAtMs,
		latestBreakerStartedAtMs: latestBreaker?.startedAtMs,
		latestRecoveryStartedAtMs: latestRecovery?.startedAtMs
	});
}
//#endregion
export { maintenanceStartupReasons as a, inspectGatewayCrashLoopBreakerInDatabase as i, GATEWAY_CRASH_LOOP_RECOVERED_REASON as n, buildGatewayCrashLoopBreakerDecision as r, GATEWAY_CRASH_LOOP_BREAKER_REASON as t };
