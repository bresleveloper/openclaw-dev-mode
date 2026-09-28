import { a as renderAgentCommand, s as splitCommandParts } from "./command-line-CPBLOiZM.mjs";
import { createHash } from "node:crypto";
//#region extensions/acpx/src/state.ts
const ACPX_PROCESS_LEASE_NAMESPACE = "process-leases";
const ACPX_PROCESS_LEASE_MAX_ENTRIES = 4096;
const ACPX_LEGACY_PROCESS_LEASE_FILE = "process-leases.json";
const ACPX_GATEWAY_INSTANCE_NAMESPACE = "gateway-instance";
const ACPX_GATEWAY_INSTANCE_KEY = "current";
const ACPX_LEGACY_GATEWAY_INSTANCE_FILE = "gateway-instance-id";
function normalizeAcpxGatewayInstanceRecord(value) {
	if (typeof value !== "object" || value === null) return;
	const record = value;
	if (typeof record.instanceId !== "string" || !record.instanceId.trim()) return;
	const createdAt = typeof record.createdAt === "number" && Number.isFinite(record.createdAt) ? Math.trunc(record.createdAt) : 0;
	return {
		instanceId: record.instanceId.trim(),
		createdAt
	};
}
//#endregion
//#region extensions/acpx/src/process-lease.ts
/**
* Persistent lease store for ACPX wrapper processes. Leases let OpenClaw attach
* gateway/session identity to spawned ACP processes and clean them up later.
*/
/** CLI argument carrying the ACPX process lease id. */
const OPENCLAW_ACPX_LEASE_ID_ARG = "--openclaw-acpx-lease-id";
/** CLI argument carrying the owning gateway instance id. */
const OPENCLAW_GATEWAY_INSTANCE_ID_ARG = "--openclaw-gateway-instance-id";
/** Synthetic session identity for generated-wrapper health probes. */
const ACPX_PROBE_LEASE_SESSION_KEY = "openclaw:acpx:probe";
/** Read OpenClaw lease identity from a generated wrapper command. */
function readAcpxProcessLeaseIdentity(command) {
	const parts = typeof command === "string" ? Array.from(command.matchAll(/(?:^|\s)(--openclaw-(?:acpx-lease-id|gateway-instance-id))\s+(?:"([^"]*)"|'([^']*)'|(\S+))(?=\s|$)/g)).flatMap((match) => [match[1], match[2] ?? match[3] ?? match[4]]) : command ?? [];
	const leaseIndex = parts.lastIndexOf(OPENCLAW_ACPX_LEASE_ID_ARG);
	const gatewayIndex = parts.lastIndexOf(OPENCLAW_GATEWAY_INSTANCE_ID_ARG);
	const leaseId = leaseIndex >= 0 ? parts[leaseIndex + 1]?.trim() : "";
	const gatewayInstanceId = gatewayIndex >= 0 ? parts[gatewayIndex + 1]?.trim() : "";
	if (!leaseId || !gatewayInstanceId) return;
	return {
		leaseId,
		gatewayInstanceId
	};
}
function normalizeAcpxProcessLease(value) {
	if (typeof value !== "object" || value === null) return;
	const record = value;
	if (typeof record.leaseId !== "string" || typeof record.gatewayInstanceId !== "string" || typeof record.sessionKey !== "string" || typeof record.wrapperRoot !== "string" || typeof record.wrapperPath !== "string" || typeof record.rootPid !== "number" || typeof record.commandHash !== "string" || typeof record.startedAt !== "number" || ![
		"open",
		"closing",
		"closed",
		"lost"
	].includes(String(record.state))) return;
	return {
		leaseId: record.leaseId,
		gatewayInstanceId: record.gatewayInstanceId,
		sessionKey: record.sessionKey,
		wrapperRoot: record.wrapperRoot,
		wrapperPath: record.wrapperPath,
		rootPid: record.rootPid,
		...typeof record.processGroupId === "number" ? { processGroupId: record.processGroupId } : {},
		commandHash: record.commandHash,
		startedAt: record.startedAt,
		state: record.state
	};
}
function normalizeAcpxProcessLeaseFile(value) {
	const root = typeof value === "object" && value !== null ? value : {};
	return {
		version: 1,
		leases: Array.isArray(root.leases) ? root.leases.map(normalizeAcpxProcessLease).filter((lease) => Boolean(lease)) : []
	};
}
function openAcpxProcessLeaseStateStore(openKeyedStore) {
	return openKeyedStore({
		namespace: ACPX_PROCESS_LEASE_NAMESPACE,
		maxEntries: ACPX_PROCESS_LEASE_MAX_ENTRIES,
		overflowPolicy: "reject-new"
	});
}
/** Create a serialized SQLite-backed ACPX process lease store. */
function createAcpxProcessLeaseStore(params) {
	let updateQueue = Promise.resolve();
	async function update(mutator) {
		const run = updateQueue.then(async () => {
			await mutator();
		});
		updateQueue = run.catch(() => {});
		await run;
	}
	async function readCurrent() {
		await updateQueue;
		return (await params.store.entries()).map((entry) => normalizeAcpxProcessLease(entry.value)).filter((lease) => Boolean(lease));
	}
	return {
		async load(leaseId) {
			await updateQueue;
			return normalizeAcpxProcessLease(await params.store.lookup(leaseId));
		},
		async listOpen(gatewayInstanceId) {
			return (await readCurrent()).filter((lease) => (lease.state === "open" || lease.state === "closing") && (!gatewayInstanceId || lease.gatewayInstanceId === gatewayInstanceId));
		},
		async save(lease) {
			await update(async () => {
				await params.store.register(lease.leaseId, lease);
			});
		},
		async markState(leaseId, state) {
			await update(async () => {
				if (state === "closed" || state === "lost") {
					await params.store.delete(leaseId);
					return;
				}
				const lease = normalizeAcpxProcessLease(await params.store.lookup(leaseId));
				if (lease) await params.store.register(leaseId, {
					...lease,
					state
				});
			});
		}
	};
}
/** Hash a wrapper command so process leases can detect command drift. */
function hashAcpxProcessCommand(command) {
	return createHash("sha256").update(renderAgentCommand(command)).digest("hex");
}
/** Append portable wrapper arguments without changing the executable or argument bytes. */
function withAcpxLeaseArgs(params) {
	return [
		...splitCommandParts(params.command),
		OPENCLAW_ACPX_LEASE_ID_ARG,
		params.leaseId,
		OPENCLAW_GATEWAY_INSTANCE_ID_ARG,
		params.gatewayInstanceId
	];
}
//#endregion
export { hashAcpxProcessCommand as a, openAcpxProcessLeaseStateStore as c, ACPX_GATEWAY_INSTANCE_KEY as d, ACPX_GATEWAY_INSTANCE_NAMESPACE as f, normalizeAcpxGatewayInstanceRecord as h, createAcpxProcessLeaseStore as i, readAcpxProcessLeaseIdentity as l, ACPX_LEGACY_PROCESS_LEASE_FILE as m, OPENCLAW_ACPX_LEASE_ID_ARG as n, normalizeAcpxProcessLease as o, ACPX_LEGACY_GATEWAY_INSTANCE_FILE as p, OPENCLAW_GATEWAY_INSTANCE_ID_ARG as r, normalizeAcpxProcessLeaseFile as s, ACPX_PROBE_LEASE_SESSION_KEY as t, withAcpxLeaseArgs as u };
