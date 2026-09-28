import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { s as INGRESS_CLAIM_LEASE_MS } from "./ingress-retry-policy-B_OLaMKs.mjs";
import { i as openChannelIngressDatabase, n as getChannelIngressKysely } from "./ingress-queue-D-wMlCUi.mjs";
//#region src/channels/message/ingress-queue-health.ts
/** Redacted health diagnostics for durable channel ingress queues. */
/** Count failed channel ingress events per channel account for operator health surfaces. */
function countFailedChannelIngressQueueEntries(stateDir) {
	const database = openChannelIngressDatabase(stateDir);
	const queueDb = getChannelIngressKysely(database.db);
	return executeSqliteQuerySync(database.db, queueDb.selectFrom("channel_ingress_events").select((eb) => [
		"channel_id as channelId",
		"account_id as accountId",
		eb.fn.countAll().as("count"),
		eb.fn.min("failed_at").as("oldestFailedAt")
	]).where("status", "=", "failed").groupBy(["channel_id", "account_id"]).orderBy("channel_id", "asc").orderBy("account_id", "asc")).rows.map(({ oldestFailedAt, ...row }) => oldestFailedAt == null ? row : Object.assign(row, { oldestFailedAt }));
}
/** Aggregate active lanes whose retry or claim state can block later ingress. */
function countChannelIngressQueuePressure(stateDir) {
	const database = openChannelIngressDatabase(stateDir);
	const queueDb = getChannelIngressKysely(database.db);
	const staleClaimCutoff = Date.now() - INGRESS_CLAIM_LEASE_MS;
	const laneTotals = queueDb.selectFrom("channel_ingress_events").select((eb) => [
		"channel_id",
		"account_id",
		eb.fn.countAll().as("activeCount"),
		eb.fn.countAll().filterWhere("status", "=", "pending").as("pendingCount"),
		eb.fn.countAll().filterWhere("status", "=", "claimed").as("claimedCount"),
		eb.fn.min("received_at").as("oldestReceivedAt")
	]).where("status", "in", ["pending", "claimed"]).where("lane_key", "is not", null).groupBy([
		"queue_name",
		"lane_key",
		"channel_id",
		"account_id"
	]).having((eb) => eb.or([eb(eb.fn.countAll().filterWhere((filter) => filter.and([filter("attempts", ">=", 8), filter("last_error", "is not", null)])), ">", 0), eb(eb.fn.countAll().filterWhere((filter) => filter.and([filter("status", "=", "claimed"), filter("claimed_at", "<=", staleClaimCutoff)])), ">", 0)])).as("lanes");
	return executeSqliteQuerySync(database.db, queueDb.selectFrom(laneTotals).select((eb) => [
		"lanes.channel_id as channelId",
		"lanes.account_id as accountId",
		eb.fn.countAll().as("laneCount"),
		eb.fn.sum("lanes.pendingCount").as("pendingCount"),
		eb.fn.sum("lanes.claimedCount").as("claimedCount"),
		eb(eb.fn.sum("lanes.activeCount"), "-", eb.fn.countAll()).as("blockedCount"),
		eb.fn.min("lanes.oldestReceivedAt").as("oldestReceivedAt")
	]).groupBy(["lanes.channel_id", "lanes.account_id"]).orderBy("lanes.channel_id", "asc").orderBy("lanes.account_id", "asc")).rows;
}
//#endregion
export { countFailedChannelIngressQueueEntries as n, countChannelIngressQueuePressure as t };
