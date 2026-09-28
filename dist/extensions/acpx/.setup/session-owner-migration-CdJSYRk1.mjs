import { t as resolveAcpxPluginConfig } from "./config-CdPsIued.mjs";
import { a as hashAcpxProcessCommand, c as openAcpxProcessLeaseStateStore, l as readAcpxProcessLeaseIdentity, o as normalizeAcpxProcessLease } from "./process-lease-C3dNPtu8.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { archiveLegacyStateSource, asObjectRecord } from "openclaw/plugin-sdk/runtime-doctor-migrations";
import { isDeepStrictEqual } from "node:util";
//#region extensions/acpx/src/session-owner-migration.ts
function sessionDirectory(input) {
	if (!input.serviceWorkspaceDir) throw new Error("ACP ownership repair requires the Gateway service workspace; upgrade OpenClaw Doctor.");
	return path.join(resolveAcpxPluginConfig({
		rawConfig: input.config.plugins?.entries?.acpx?.config,
		workspaceDir: input.serviceWorkspaceDir
	}).stateDir, "sessions");
}
async function legacyRecords(input) {
	const directory = sessionDirectory(input);
	const ids = (await fs.readdir(directory).catch((error) => {
		if (asObjectRecord(error)?.code === "ENOENT") return [];
		throw error;
	})).filter((name) => name.endsWith(".json")).map((name) => decodeURIComponent(name.slice(0, -5))).filter((id) => !id.startsWith("agent:") && !id.startsWith(".openclaw-owner-"));
	if (ids.length === 0) return {
		directory,
		ids
	};
	const { resolveAcpxSessionResource } = await import("./session-resource-BaJ6bs5d.mjs").then((n) => n.n);
	const evidence = await input.context.inspectAcpSessionClaims?.();
	const { decodeAcpxRuntimeHandleState } = await import("acpx/runtime");
	return {
		directory,
		ids: ids.filter((id) => !evidence?.claims.some((claim) => {
			const locator = decodeAcpxRuntimeHandleState(claim.meta.runtimeSessionName);
			return evidence.incomplete.length === 0 && claim.meta.identity?.state === "resolved" && claim.meta.identity.acpxRecordId === id && locator?.acpxRecordId === id && locator.name === resolveAcpxSessionResource(claim);
		})).filter((id) => !id.includes(":oneshot:") || evidence?.claims.some((claim) => {
			const locator = decodeAcpxRuntimeHandleState(claim.meta.runtimeSessionName);
			return claim.meta.identity?.acpxRecordId === id && locator?.name !== resolveAcpxSessionResource(claim);
		})).toSorted()
	};
}
function requireStoppedPid(pid) {
	if (pid === void 0 || pid === null) return;
	if (typeof pid !== "number" || !Number.isSafeInteger(pid) || pid <= 0) throw new Error("record process identity is uncertain");
	try {
		process.kill(pid, 0);
	} catch (error) {
		if (asObjectRecord(error)?.code === "ESRCH") return;
		throw new Error("record process liveness cannot be verified", { cause: error });
	}
	throw new Error("record still has a live process; stop the harness before Doctor repair");
}
function recordPath(directory, recordId) {
	return path.join(directory, `${encodeURIComponent(recordId)}.json`);
}
function matchesClaimRecord(claim, raw, oldId, resource, decode) {
	const state = decode(claim.meta.runtimeSessionName);
	const identity = claim.meta.identity;
	if (!state || !identity || identity.state !== "resolved" || !identity.acpxSessionId && !identity.agentSessionId || state.mode !== claim.meta.mode) return false;
	const recordId = claim.meta.mode === "oneshot" ? oldId : resource;
	const oldLocator = state.name === raw.name && identity.acpxRecordId === oldId && state.acpxRecordId === oldId;
	const newLocator = state.name === resource && identity.acpxRecordId === recordId && state.acpxRecordId === recordId;
	return (oldLocator || newLocator) && state.agent === claim.meta.agent && (!identity.acpxSessionId || identity.acpxSessionId === raw.acp_session_id) && (!identity.agentSessionId || identity.agentSessionId === raw.agent_session_id) && (!state.backendSessionId || state.backendSessionId === raw.acp_session_id) && (!state.agentSessionId || state.agentSessionId === raw.agent_session_id);
}
async function migrateRecord(input, directory, oldId, claims, changes, warnings) {
	const sourcePath = recordPath(directory, oldId);
	const sourceBytes = await fs.readFile(sourcePath, "utf8");
	const raw = asObjectRecord(JSON.parse(sourceBytes));
	if (!raw || raw.acpx_record_id !== oldId || typeof raw.name !== "string" || !raw.name.trim() || raw.name !== oldId && !oldId.startsWith(`${raw.name}:oneshot:`)) throw new Error("record ID/name is not a recognized ACPX locator");
	requireStoppedPid(raw.pid);
	const { resolveAcpxSessionResource } = await import("./session-resource-BaJ6bs5d.mjs").then((n) => n.n);
	const { createFileSessionStore, decodeAcpxRuntimeHandleState, encodeAcpxRuntimeHandleState } = await import("acpx/runtime");
	const candidates = claims.filter((claim) => matchesClaimRecord(claim, raw, oldId, resolveAcpxSessionResource(claim), decodeAcpxRuntimeHandleState));
	if (candidates.length !== 1) throw new Error("exactly one current canonical owner claim is required");
	const claim = candidates[0];
	const resource = resolveAcpxSessionResource(claim);
	const oneshot = claim.meta.mode === "oneshot";
	if (oneshot !== (raw.name !== oldId)) throw new Error("canonical claim and backend record mode disagree");
	if (!oneshot && oldId === resource) return;
	const recordId = oneshot ? oldId : resource;
	const leaseStore = openAcpxProcessLeaseStateStore(input.context.openPluginStateKeyedStore);
	const leases = (await leaseStore.entries()).map((row) => ({
		row,
		lease: normalizeAcpxProcessLease(row.value)
	}));
	if (leases.some(({ lease }) => !lease)) throw new Error("process lease evidence is incomplete");
	const commandIdentity = typeof raw.agent_command === "string" ? readAcpxProcessLeaseIdentity(raw.agent_command) : void 0;
	const matchingLeases = leases.filter(({ lease }) => lease.sessionKey === raw.name || lease.sessionKey === resource);
	for (const { lease } of matchingLeases) {
		if (lease.state === "open" || lease.state === "closing") throw new Error("record has a live or uncertain process lease");
		requireStoppedPid(lease.rootPid || void 0);
		if (!commandIdentity || lease.leaseId !== commandIdentity.leaseId || lease.gatewayInstanceId !== commandIdentity.gatewayInstanceId || lease.commandHash !== hashAcpxProcessCommand(String(raw.agent_command))) throw new Error("record lease association does not match its persisted command");
	}
	const destinationPath = recordPath(directory, recordId);
	const candidate = oneshot ? raw : {
		...raw,
		acpx_record_id: resource,
		name: resource
	};
	const candidateBytes = `${JSON.stringify(candidate, null, 2)}\n`;
	const source = await createFileSessionStore({ stateDir: path.dirname(directory) }).load(oldId);
	if (!source) throw new Error("pinned ACPX reader rejected the source record");
	const temporaryDirectory = await fs.mkdtemp(path.join(directory, ".openclaw-owner-"));
	const temporarySessions = path.join(temporaryDirectory, "sessions");
	const temporaryPath = recordPath(temporarySessions, recordId);
	try {
		await fs.mkdir(temporarySessions, { mode: 448 });
		const file = await fs.open(temporaryPath, "wx", 384);
		try {
			await file.writeFile(candidateBytes);
			await file.sync();
		} finally {
			await file.close();
		}
		const interpreted = await createFileSessionStore({ stateDir: temporaryDirectory }).load(recordId);
		if (!interpreted || !isDeepStrictEqual(interpreted, oneshot ? source : {
			...source,
			acpxRecordId: resource,
			name: resource
		})) throw new Error("rekey would alter interpreted history/event references; source retained");
		const existing = await fs.readFile(destinationPath, "utf8").catch((error) => {
			if (asObjectRecord(error)?.code === "ENOENT") return;
			throw error;
		});
		const originalLocator = decodeAcpxRuntimeHandleState(claim.meta.runtimeSessionName);
		if (!oneshot && originalLocator.name === resource && existing === void 0) throw new Error("migrated metadata has no published destination; source retained");
		if (existing !== void 0 && !isDeepStrictEqual(JSON.parse(existing), candidate)) throw new Error("destination conflicts; no files were overwritten");
		if (existing === void 0) await fs.link(temporaryPath, destinationPath);
		const publicationDirectory = await fs.open(directory, "r");
		try {
			await publicationDirectory.sync();
		} finally {
			await publicationDirectory.close();
		}
		if (await fs.readFile(sourcePath, "utf8") !== sourceBytes) throw new Error("source changed during repair");
		if (!isDeepStrictEqual(JSON.parse(await fs.readFile(destinationPath, "utf8")), candidate)) throw new Error("destination changed during repair");
		for (const { row } of matchingLeases) {
			if (!isDeepStrictEqual(await leaseStore.lookup(row.key), row.value)) throw new Error("lease changed during repair");
			await leaseStore.register(row.key, {
				...row.value,
				sessionKey: resource
			});
		}
		const state = decodeAcpxRuntimeHandleState(claim.meta.runtimeSessionName);
		input.context.updateAcpSessionIdentity({
			claim,
			runtimeSessionName: encodeAcpxRuntimeHandleState({
				...state,
				name: resource,
				acpxRecordId: recordId
			}),
			acpxRecordId: recordId
		});
		const verified = await input.context.inspectAcpSessionClaims();
		if (verified.incomplete.length || !verified.claims.some((item) => item.agentId === claim.agentId && item.sessionKey === claim.sessionKey && item.meta.identity?.acpxRecordId === recordId && isDeepStrictEqual(item.binding, claim.binding))) throw new Error("canonical metadata verification failed; source retained for rerun");
		changes.push(`Migrated ACP backend history for ${claim.agentId}/${claim.sessionKey} to its owner-qualified resource.`);
		if (!oneshot) await archiveLegacyStateSource({
			filePath: sourcePath,
			label: "ACP owner record",
			changes,
			warnings
		});
	} finally {
		await fs.rm(temporaryDirectory, {
			recursive: true,
			force: true
		});
	}
}
const acpxSessionOwnerMigration = {
	id: "acpx-session-owner-resources",
	label: "ACP session owners",
	doctorOnly: true,
	phase: "after-session-repair",
	async detectLegacyState(input) {
		const { ids } = await legacyRecords(input);
		return ids.length ? { preview: [`ACP backend has ${ids.length} unqualified record(s). Stop the Gateway and run openclaw doctor --fix; ambiguous histories remain intact.`] } : null;
	},
	async migrateLegacyState(input) {
		const changes = [];
		const warnings = [];
		if (!input.context.inspectAcpSessionClaims || !input.context.updateAcpSessionIdentity) return {
			changes,
			warnings: ["ACP owner repair requires current offline Doctor maintenance authority."]
		};
		const { directory, ids } = await legacyRecords(input);
		const evidence = await input.context.inspectAcpSessionClaims();
		if (evidence.incomplete.length) return {
			changes,
			warnings: [`ACP owner evidence is incomplete; all records retained: ${evidence.incomplete.join("; ")}`]
		};
		for (const oldId of ids) try {
			const current = await input.context.inspectAcpSessionClaims();
			if (current.incomplete.length) throw new Error("canonical ownership evidence became incomplete");
			await migrateRecord(input, directory, oldId, current.claims, changes, warnings);
		} catch (error) {
			warnings.push(`ACP record ${oldId} retained: ${String(error)}`);
		}
		return {
			changes,
			warnings
		};
	}
};
//#endregion
export { acpxSessionOwnerMigration };
