import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { a as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { f as GatewayProcessNamespaceSchema, m as classifyGatewayOwnerProcessNamespace } from "./gateway-state-owner-record-DMIM5DCR.mjs";
//#region src/infra/state-lease-process-owner.ts
function parseStateLeaseProcessOwner(payloadJson) {
	const owner = safeParseJsonRecord(payloadJson ?? "")?.owner;
	if (!isRecord(owner)) return null;
	const { pid, host, startedAt } = owner;
	if (typeof pid !== "number" || !Number.isSafeInteger(pid) || pid <= 0 || typeof host !== "string" || !host || startedAt !== null && (typeof startedAt !== "number" || !Number.isSafeInteger(startedAt) || startedAt < 0)) return null;
	return {
		pid,
		host,
		startedAt,
		...owner.processNamespace === void 0 ? {} : { processNamespace: GatewayProcessNamespaceSchema.safeParse(owner.processNamespace).data ?? null }
	};
}
function readStateLeaseProcessOwnerStatus(owner, heartbeatAt) {
	if (!owner) return "unknown";
	const namespace = classifyGatewayOwnerProcessNamespace(owner.processNamespace, {
		ownerHost: owner.host,
		readHeartbeatAt: () => heartbeatAt
	});
	if (namespace !== "same") return namespace;
	if (isPidDefinitelyDead(owner.pid)) return "dead";
	const currentStartedAt = getFileLockProcessStartTime(owner.pid);
	if (owner.startedAt === null || currentStartedAt === null) return "unknown";
	return currentStartedAt === owner.startedAt ? "live" : "dead";
}
//#endregion
export { readStateLeaseProcessOwnerStatus as n, parseStateLeaseProcessOwner as t };
