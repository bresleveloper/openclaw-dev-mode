import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as NodeHostStatsPayloadSchema } from "./nodes-CEMeSm8v.mjs";
import { Value } from "typebox/value";
//#region src/shared/node-host-stats.ts
const NODE_HOST_STATS_EVENT = "node.host.stats";
const NODE_HOST_STATS_INTERVAL_MS = 6e4;
/** Validate a saved or projected snapshot without replacing its Gateway receipt time. */
function isNodeHostStats(value) {
	if (!isRecord(value)) return false;
	const { updatedAtMs, ...stats } = value;
	return typeof updatedAtMs === "number" && Number.isSafeInteger(updatedAtMs) && updatedAtMs >= 0 && Value.Check(NodeHostStatsPayloadSchema, stats);
}
//#endregion
export { NODE_HOST_STATS_INTERVAL_MS as n, isNodeHostStats as r, NODE_HOST_STATS_EVENT as t };
