import { D as classifyGatewayOwnerProcessNamespace, E as GatewayProcessNamespaceSchema } from "./openclaw-state-read-worker-cpu-DxXDPrAN.mjs";
import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { n as safeParseJsonRecord } from "./openclaw-state-read-json-coercion-CYFfIS_L.mjs";
import "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { a as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./openclaw-state-read-pid-alive-BppTQRNj.mjs";
import "./openclaw-state-read-openclaw-state-db-schema-helpers-Cgf5rJqc.mjs";
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
//#region src/infra/gateway-owner-lease.read.ts
const gatewayOwnerKey = {
	scope: "gateway-owner",
	key: "global"
};
function parseSupervisor(value) {
	if (value === null) return null;
	if (!isRecord(value) || value.kind !== "launchd" && value.kind !== "systemd" && value.kind !== "schtasks" && value.kind !== "external" || value.name !== null && (typeof value.name !== "string" || !value.name.trim())) throw new Error("Gateway owner lease supervisor could not be verified");
	return {
		kind: value.kind,
		name: value.name
	};
}
function decodeGatewayOwnerLease(row, port) {
	if (!row) return;
	const processOwner = parseStateLeaseProcessOwner(row.payloadJson);
	const payload = safeParseJsonRecord(row.payloadJson ?? "");
	if (!processOwner || !payload || typeof payload.port !== "number" || !Number.isInteger(payload.port) || payload.port <= 0 || payload.port > 65535 || payload.mode !== "foreground" && payload.mode !== "supervised") throw new Error("Gateway owner lease identity could not be verified");
	if (port !== void 0 && payload.port !== port) return;
	const supervisor = parseSupervisor(payload.supervisor);
	if (payload.mode === "foreground" !== (supervisor === null)) throw new Error("Gateway owner lease supervisor does not match its listener mode");
	return {
		...processOwner,
		owner: row.owner,
		heartbeatAt: row.heartbeatAt ?? row.createdAt,
		port: payload.port,
		mode: payload.mode,
		supervisor,
		...typeof payload.listeningAt === "number" ? { listeningAt: payload.listeningAt } : {},
		state: readStateLeaseProcessOwnerStatus(processOwner, row.heartbeatAt ?? row.createdAt),
		expired: row.expiresAt === null || row.expiresAt <= Date.now()
	};
}
//#endregion
export { gatewayOwnerKey as n, decodeGatewayOwnerLease as t };
