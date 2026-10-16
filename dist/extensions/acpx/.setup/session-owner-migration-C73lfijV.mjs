import { t as runtime_doctor_migrations_exports } from "./runtime-doctor-migrations-hxP-CXX7.mjs";
import { c as renderAgentCommand, t as resolveAcpxPluginConfig, u as splitCommandParts } from "./config-76krYh6C.mjs";
import path from "node:path";
import { asFiniteNumber, asOptionalObjectRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { movePathWithCopyFallback } from "openclaw/plugin-sdk/security-runtime";
//#region extensions/acpx/src/state.ts
const ACPX_PROCESS_LEASE_NAMESPACE = "process-leases";
const ACPX_PROCESS_LEASE_MAX_ENTRIES = 4096;
const ACPX_GATEWAY_INSTANCE_NAMESPACE = "gateway-instance";
const ACPX_GATEWAY_INSTANCE_KEY = "current";
function normalizeAcpxGatewayInstanceRecord(value) {
	const record = asOptionalObjectRecord(value);
	const instanceId = normalizeOptionalString(record?.instanceId);
	if (!instanceId) return;
	return {
		instanceId,
		createdAt: Math.trunc(asFiniteNumber(record?.createdAt) ?? 0)
	};
}
//#endregion
//#region extensions/acpx/src/process-lease.ts
const OPENCLAW_ACPX_LEASE_ID_ARG = "--openclaw-acpx-lease-id";
const OPENCLAW_GATEWAY_INSTANCE_ID_ARG = "--openclaw-gateway-instance-id";
/** Synthetic session identity for generated-wrapper health probes. */
const ACPX_PROBE_LEASE_SESSION_KEY = "openclaw:acpx:probe";
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
	const record = asOptionalObjectRecord(value);
	if (!record || typeof record.leaseId !== "string" || typeof record.gatewayInstanceId !== "string" || typeof record.sessionKey !== "string" || typeof record.wrapperRoot !== "string" || typeof record.wrapperPath !== "string" || typeof record.rootPid !== "number" || typeof record.commandHash !== "string" || typeof record.startedAt !== "number" || ![
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
function openAcpxProcessLeaseStateStore(openKeyedStore) {
	return openKeyedStore({
		namespace: ACPX_PROCESS_LEASE_NAMESPACE,
		maxEntries: ACPX_PROCESS_LEASE_MAX_ENTRIES,
		overflowPolicy: "reject-new"
	});
}
function createAcpxProcessLeaseStore(params) {
	let updateQueue = Promise.resolve();
	async function update(mutator) {
		const run = updateQueue.then(mutator);
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
//#region extensions/acpx/src/session-owner-migration.ts
function openStateDirectoryMarker(input) {
	return input.openKeyedStore({
		namespace: "state-directory-migration",
		maxEntries: 1
	});
}
async function directoryEntries(directory) {
	return fs.readdir(directory).catch((error) => {
		if ((0, runtime_doctor_migrations_exports.asObjectRecord)(error)?.code === "ENOENT") return [];
		throw error;
	});
}
function legacyStateDirectory(input) {
	const explicit = (0, runtime_doctor_migrations_exports.asObjectRecord)(input.rawConfig)?.stateDir;
	return typeof explicit === "string" && explicit.trim() ? void 0 : path.resolve(input.workspaceDir?.trim() || process.cwd(), "state");
}
async function hasLegacyState(input) {
	const source = legacyStateDirectory(input);
	return Boolean(source && source !== input.stateDir && (await directoryEntries(input.stateDir)).length === 0 && await hasSessionData(source));
}
async function hasSessionData(directory) {
	return (await directoryEntries(path.join(directory, "sessions"))).some((name) => name.endsWith(".json"));
}
/** Startup and offline Doctor share this one-time relocation of the former default. */
async function adoptAcpxStateDirectory(input) {
	const result = {
		stateDir: input.stateDir,
		changes: [],
		warnings: []
	};
	const source = legacyStateDirectory(input);
	if (!source || source === input.stateDir) return result;
	let published = false;
	let legacyFallback = false;
	try {
		const marker = openStateDirectoryMarker(input);
		const previous = await marker.lookup("workspace-state-v1");
		if (previous?.destination === input.stateDir && previous.completed) return result;
		const destinationEmpty = (await directoryEntries(input.stateDir)).length === 0;
		if (destinationEmpty) {
			legacyFallback = true;
			legacyFallback = await hasSessionData(source);
		}
		if (previous?.destination === input.stateDir) {
			if (await hasSessionData(input.stateDir)) {
				published = true;
				await marker.register("workspace-state-v1", {
					destination: input.stateDir,
					completed: true
				}, { assertCurrent: input.assertCurrent });
				result.changes.push(`Completed ACPX session state adoption at ${input.stateDir}.`);
				if ((await directoryEntries(source)).length > 0) result.warnings.push(`ACPX uses ${input.stateDir}; a legacy copy remains at ${source}. Verify the migrated sessions before removing that copy.`);
				return result;
			}
			if (!destinationEmpty) {
				legacyFallback = true;
				legacyFallback = await hasSessionData(source);
				throw new Error("Destination became occupied before ACPX state adoption completed");
			}
		}
		if (!destinationEmpty || !legacyFallback) return result;
		if (!(await fs.lstat(source)).isDirectory() || input.stateDir.startsWith(`${source}${path.sep}`)) throw new Error("Legacy state must be a directory outside the new state directory");
		input.assertCurrent?.();
		await fs.mkdir(path.dirname(input.stateDir), { recursive: true });
		await marker.register("workspace-state-v1", {
			destination: input.stateDir,
			completed: false
		}, { assertCurrent: input.assertCurrent });
		await movePathWithCopyFallback({
			from: source,
			to: input.stateDir,
			assertBeforeMutation: input.assertCurrent,
			onDestinationPublished() {
				published = true;
			}
		});
		result.changes.push(`Migrated ACPX session state from ${source} to ${input.stateDir}.`);
		await marker.register("workspace-state-v1", {
			destination: input.stateDir,
			completed: true
		}, { assertCurrent: input.assertCurrent });
	} catch (error) {
		result.stateDir = !published && legacyFallback ? source : input.stateDir;
		result.warnings.push(published ? `ACPX state adopted at ${input.stateDir}; migration cleanup needs attention: ${String(error)}. Run openclaw doctor --fix.` : legacyFallback ? `ACPX state migration failed: ${String(error)}. Using ${source} for this process; set plugins.entries.acpx.config.stateDir to ${JSON.stringify(source)} to keep the old location.` : `ACPX state migration could not be inspected: ${String(error)}. Keeping ${input.stateDir}; run openclaw doctor --fix.`);
	}
	return result;
}
function stateDirectoryInput(input) {
	return {
		rawConfig: input.config.plugins?.entries?.acpx?.config,
		workspaceDir: input.serviceWorkspaceDir,
		stateDir: path.dirname(sessionDirectory(input)),
		openKeyedStore: input.context.openPluginStateKeyedStore
	};
}
function sessionDirectory(input) {
	if (!input.serviceWorkspaceDir) throw new Error("ACP ownership repair requires the Gateway service workspace; upgrade OpenClaw Doctor.");
	return path.join(resolveAcpxPluginConfig({
		rawConfig: input.config.plugins?.entries?.acpx?.config,
		workspaceDir: input.serviceWorkspaceDir,
		stateDir: input.stateDir
	}).stateDir, "sessions");
}
async function legacyRecords(input, directory = sessionDirectory(input)) {
	const ids = (await directoryEntries(directory)).filter((name) => name.endsWith(".json")).map((name) => decodeURIComponent(name.slice(0, -5))).filter((id) => !id.startsWith("agent:") && !id.startsWith(".openclaw-owner-"));
	if (ids.length === 0) return {
		directory,
		ids
	};
	const { resolveAcpxSessionResource } = await import("./session-resource-DKJsUJPu.mjs").then((n) => n.n);
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
		if ((0, runtime_doctor_migrations_exports.asObjectRecord)(error)?.code === "ESRCH") return;
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
	const raw = (0, runtime_doctor_migrations_exports.asObjectRecord)(JSON.parse(sourceBytes));
	if (!raw || raw.acpx_record_id !== oldId || typeof raw.name !== "string" || !raw.name.trim() || raw.name !== oldId && !oldId.startsWith(`${raw.name}:oneshot:`)) throw new Error("record ID/name is not a recognized ACPX locator");
	requireStoppedPid(raw.pid);
	const { resolveAcpxSessionResource } = await import("./session-resource-DKJsUJPu.mjs").then((n) => n.n);
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
			if ((0, runtime_doctor_migrations_exports.asObjectRecord)(error)?.code === "ENOENT") return;
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
		if (!oneshot) await (0, runtime_doctor_migrations_exports.archiveLegacyStateSource)({
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
	collectBackupResources(input) {
		const destination = sessionDirectory(input);
		const explicit = (0, runtime_doctor_migrations_exports.asObjectRecord)(input.config.plugins?.entries?.acpx?.config)?.stateDir;
		return [path.dirname(destination), ...!explicit && input.serviceWorkspaceDir ? [path.join(input.serviceWorkspaceDir, "state")] : []].map((directory) => ({
			path: directory,
			kind: "directory"
		}));
	},
	async detectLegacyState(input) {
		try {
			const directoryInput = stateDirectoryInput(input);
			const marker = legacyStateDirectory(directoryInput) ? await openStateDirectoryMarker(directoryInput).lookup("workspace-state-v1") : void 0;
			const matchingMarker = marker?.destination === directoryInput.stateDir;
			if (!(matchingMarker && marker.completed) && (matchingMarker && !marker.completed || await hasLegacyState(directoryInput))) return { preview: ["ACPX session state in <workspace>/state will be migrated automatically to the OpenClaw state directory."] };
		} catch (error) {
			return { preview: [`ACPX legacy state could not be inspected: ${String(error)}. Run openclaw doctor --fix.`] };
		}
		const { ids } = await legacyRecords(input);
		return ids.length ? { preview: [`ACP backend has ${ids.length} unqualified record(s). Stop the Gateway and run openclaw doctor --fix; ambiguous histories remain intact.`] } : null;
	},
	async migrateLegacyState(input) {
		const { stateDir, changes, warnings } = await adoptAcpxStateDirectory(stateDirectoryInput(input));
		if (warnings.length) return {
			changes,
			warnings,
			warningDisposition: "recoverable"
		};
		if (!input.context.inspectAcpSessionClaims || !input.context.updateAcpSessionIdentity) return {
			changes,
			warnings: ["ACP owner repair requires current offline Doctor maintenance authority."]
		};
		const { directory, ids } = await legacyRecords(input, path.join(stateDir, "sessions"));
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
export { hashAcpxProcessCommand as a, acpxSessionOwnerMigration, adoptAcpxStateDirectory, withAcpxLeaseArgs as c, normalizeAcpxGatewayInstanceRecord as d, createAcpxProcessLeaseStore as i, ACPX_GATEWAY_INSTANCE_KEY as l, OPENCLAW_ACPX_LEASE_ID_ARG as n, openAcpxProcessLeaseStateStore as o, OPENCLAW_GATEWAY_INSTANCE_ID_ARG as r, readAcpxProcessLeaseIdentity as s, ACPX_PROBE_LEASE_SESSION_KEY as t, ACPX_GATEWAY_INSTANCE_NAMESPACE as u };
