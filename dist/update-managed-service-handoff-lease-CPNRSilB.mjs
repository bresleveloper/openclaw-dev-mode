import { T as positiveSecondsToSafeMilliseconds } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { b as managedHandoffBootSchema, v as createManagedHandoffBootIdentityReader, x as parseManagedHandoffLeasePayload, y as isRetiredManagedHandoffLeasePayload } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { i as tryResolvePathCaseInsensitive } from "./path-case-BjTaHmBw.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-BITMm5ft.mjs";
import { n as isChildProcessTreeAlive } from "./child-process-tree-D-7VKvs_.mjs";
import { a as createManagedHandoffLeaseDatabase, c as prepareManagedHandoffLeaseDatabase, i as captureManagedUpdateLeaseDatabaseIdentity, o as leaseQueries, s as managedHandoffLeaseBinding, u as readManagedHandoffRepairMetadata } from "./update-managed-service-handoff-database-DQAEU12_.mjs";
import { a as triageFailureSchema, i as managedHandoffLeaseText, n as createManagedHandoffLeaseRows, o as readBorrowedLegacyHandoffParent, r as managedHandoffLeaseRow, t as createManagedHandoffProcessIdentityReader } from "./update-managed-service-handoff-process-BULCClsA.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { spawnSync } from "node:child_process";
//#region src/infra/update-managed-service-handoff-children.ts
function managedCommandCustody(lease) {
	return lease?.version === 2 && lease.action.kind === "update" ? lease.action.custody : void 0;
}
/** Tracked command reservations outlive their helper; only group extinction closes a binding. */
function managedCommandUnsettled(lease) {
	return managedCommandCustody(lease) !== "bound" || process.platform === "win32" || isChildProcessTreeAlive(lease.executor);
}
function managedCommandAllowsBinding(lease, action, executor) {
	const custody = managedCommandCustody(lease);
	return custody ? custody === "reserved" && action.kind === "update" && action.custody === "bound" && executor !== void 0 && executor.pid !== lease.helper.pid : action.kind !== "update" || !action.custody;
}
function createManagedHandoffChildReader(deps) {
	function readChildren(parent, connection) {
		const inspect = (db) => deps.descendants(db, typeof parent === "string" ? { key: parent } : parent);
		return connection ? inspect(connection) : deps.withDatabase(false, inspect);
	}
	return {
		hasUnsettledChildren: (parent, connection) => {
			if (typeof parent !== "string" && (parent.version === 3 || parent.version === 4)) return true;
			return readChildren(parent, connection).some((entry) => {
				const child = deps.handle(entry.install_root, entry);
				const unbound = child.version === 2 && child.action.kind === "update" && !child.action.mutationProtocol && child.executor.pid === child.helper.pid && child.executor.startIdentity === child.helper.startIdentity;
				return managedCommandCustody(child) ? managedCommandUnsettled(child) : child.version === 3 || child.version === 4 || deps.processState(child.helper) !== "dead" || deps.processState(child.executor) !== "dead" || !unbound && process.platform !== "win32" && isChildProcessTreeAlive(child.executor);
			});
		},
		readCommandChildren: (roots, connection) => {
			const inspect = (db) => [...new Map(roots.flatMap((root) => readChildren(root, db)).map((entry) => deps.handle(entry.install_root, entry)).filter((lease) => managedCommandCustody(lease)).map((lease) => [lease.key, lease])).values()];
			return connection ? inspect(connection) : deps.withDatabase(false, inspect);
		}
	};
}
//#endregion
//#region src/infra/update-managed-service-handoff-original-owner.ts
function managedHandoffOriginalGeneration({ key, owner, payload, updatedAt }) {
	return {
		key,
		owner,
		payload,
		updatedAt
	};
}
/** Validate the unchanged acquisition object, never a decoded or copied row. */
function readManagedHandoffOriginalAdmission(original, admissions, existingIdentity, processState) {
	const receipt = admissions.get(original);
	if (!receipt || !existingIdentity || receipt.database.databasePath !== existingIdentity.databasePath || receipt.database.databaseIdentity !== existingIdentity.databaseIdentity || receipt.database.parentIdentity !== existingIdentity.parentIdentity || !isDeepStrictEqual(receipt.original, original) || original.version !== 2 || original.mutationOriginal || original.action.kind !== "update" || original.action.mutationProtocol !== "original-cancellation-v1" || original.key.includes("/.openclaw-update-child-") || original.helper.pid !== process.pid || !isDeepStrictEqual(original.helper, original.executor) || processState(original.helper) !== "live") return;
	return receipt;
}
/** Generic release, rebind and process-death reclamation cannot erase a bound
* original generation or remove its cancellation protocol. */
function hasOriginalUpdateExecutorCustody(lease, action = lease.action) {
	return lease.version === 2 && lease.action.kind === "update" && lease.action.mutationProtocol === "original-cancellation-v1" && !lease.key.includes("/.openclaw-update-child-") && (!isDeepStrictEqual(lease.helper, lease.executor) || action.kind !== "update" || action.mutationProtocol !== "original-cancellation-v1");
}
/** Query existing native lineage, not a second authority registry. Top-level
* occupied slots are not child-name aliases and must settle before generation changes. */
function readOriginalUpdateDependents(lease, db) {
	const original = managedHandoffOriginalGeneration(lease);
	return executeSqliteQuerySync(db, leaseQueries(db).selectFrom("managed_update_handoffs").select(["install_root", "payload_json"])).rows.flatMap((entry) => {
		const payload = parseManagedHandoffLeasePayload(entry.payload_json);
		return payload?.version === 2 && isDeepStrictEqual(payload.mutationOriginal, original) ? [entry.install_root] : [];
	});
}
//#endregion
//#region src/infra/update-managed-service-handoff-cancellation.ts
function createManagedHandoffCancellation(deps) {
	const { existingIdentity, originalUpdateAdmissions, withDatabase, transact, mutationCurrent, storedCurrent, childAliases, canRelease, row, handle, descendants, updateRow, deleteRow, processState } = deps;
	const cancellations = /* @__PURE__ */ new WeakMap();
	function cancelUpdate(original, retained) {
		const admission = readManagedHandoffOriginalAdmission(original, originalUpdateAdmissions, existingIdentity, processState);
		if (!admission) return null;
		const lease = admission.original;
		if (retained && (retained.key === lease.key || retained.key.includes("/.openclaw-update-child-") || retained.version !== 2 || retained.mutationOriginal || retained.action.kind !== "update" || retained.helper.pid !== process.pid || !isDeepStrictEqual(retained.helper, retained.executor) || processState(retained.helper) !== "live")) return null;
		const previous = cancellations.get(original);
		if (previous) return withDatabase(true, (db) => transact(db, () => isDeepStrictEqual(previous.retainedOriginal, retained) && storedCurrent(previous.lease, db) && (!previous.retained || storedCurrent(previous.retained, db)))) ? previous : null;
		const nativeCommand = (child, db) => {
			if (managedCommandCustody(child) !== "bound" || !/\/\.openclaw-update-child-[a-f0-9-]{36}-command$/.test(child.key)) return false;
			const aliases = childAliases(child.key, db);
			if (!aliases.includes(child.key)) return false;
			return aliases.every((key) => {
				const entry = row(db, key);
				if (!entry) return false;
				const peer = handle(key, entry);
				return peer.version === 2 && peer.owner === child.owner && isDeepStrictEqual(peer.action, child.action) && isDeepStrictEqual(peer.helper, child.helper) && isDeepStrictEqual(peer.executor, child.executor);
			});
		};
		const transitioned = withDatabase(true, (db) => transact(db, () => {
			if (!mutationCurrent(lease, db) || retained && !mutationCurrent(retained, db)) return null;
			const originalChildren = descendants(db, lease);
			if (originalChildren.some((entry) => {
				const child = handle(entry.install_root, entry);
				return child.version !== 2 || child.action.kind !== "update" || (managedCommandCustody(child) ? !nativeCommand(child, db) : child.action.mutationProtocol !== "original-cancellation-v1");
			})) return null;
			const originalKeys = new Set(originalChildren.map((entry) => entry.install_root));
			if (retained && descendants(db, retained).some((entry) => {
				const child = handle(entry.install_root, entry);
				return child.version !== 2 || child.action.kind !== "update" || managedCommandCustody(child) && !nativeCommand(child, db) || !childAliases(child.key, db).some((key) => originalKeys.has(key));
			})) return null;
			const transition = (currentRow) => {
				const payload = JSON.stringify({
					version: 4,
					helper: currentRow.helper,
					executor: currentRow.executor,
					action: currentRow.action,
					cancellation: managedHandoffOriginalGeneration(currentRow)
				});
				if (!parseManagedHandoffLeasePayload(payload)) throw new Error("Original cancellation payload is invalid");
				const updatedAt = Math.max(Date.now(), currentRow.updatedAt + 1);
				if (!updateRow(db, currentRow, {
					payload_json: payload,
					updated_at: updatedAt
				})) throw new Error("Original cancellation generation changed");
				return handle(currentRow.key, {
					owner: currentRow.owner,
					payload_json: payload,
					updated_at: updatedAt
				});
			};
			return {
				lease: transition(lease),
				retained: retained ? transition(retained) : void 0
			};
		}));
		if (!transitioned) return null;
		const generations = [transitioned.lease, ...transitioned.retained ? [transitioned.retained] : []];
		const successor = {
			...transitioned,
			retainedOriginal: retained ? structuredClone(retained) : void 0,
			release: (paired = []) => withDatabase(true, (db) => transact(db, () => {
				if (processState(lease.helper) !== "live" || [lease, ...retained ? [retained] : []].some((parent) => readOriginalUpdateDependents(parent, db).some((key) => !paired.some((item) => item.key === key))) || new Set([...generations, ...paired].map((item) => item.key)).size !== generations.length + paired.length || paired.some((item) => item.version !== 2 || !isDeepStrictEqual(item.mutationOriginal, managedHandoffOriginalGeneration(lease)) || !canRelease(item) || !storedCurrent(item, db) || descendants(db, item).length > 0 || readOriginalUpdateDependents(item, db).length > 0) || generations.some((generation) => !storedCurrent(generation, db) || descendants(db, generation).length > 0)) return false;
				for (const generation of [...generations, ...paired]) if (!deleteRow(db, generation.key, managedHandoffLeaseRow(generation))) throw new Error("Original cancellation settlement changed");
				return true;
			}))
		};
		cancellations.set(original, successor);
		return successor;
	}
	return cancelUpdate;
}
/** A dead original can no longer join and release its cancellation. Explicit
* repair settles exactly what that original fenced: the generations its process
* transitioned, rows bound to those generations, and their descendants. */
function readCancelledUpdateFamily(db, origin, deps) {
	const rows = executeSqliteQuerySync(db, leaseQueries(db).selectFrom("managed_update_handoffs").select([
		"install_root",
		"owner",
		"payload_json",
		"updated_at"
	])).rows.flatMap((row) => {
		const payload = parseManagedHandoffLeasePayload(row.payload_json);
		return payload ? [{
			row,
			payload
		}] : [];
	});
	const generations = rows.flatMap(({ row, payload }) => payload.version === 4 && isDeepStrictEqual(payload.helper, origin.helper) && isDeepStrictEqual(payload.executor, origin.executor) ? [deps.handle(row.install_root, row)] : []);
	const cancelled = generations.flatMap((lease) => lease.version === 4 ? [lease.cancellation] : []);
	const dependents = rows.flatMap(({ row, payload }) => payload.version === 2 && cancelled.some((generation) => isDeepStrictEqual(payload.mutationOriginal, generation)) ? [deps.handle(row.install_root, row)] : []);
	const roots = [...generations, ...dependents];
	const family = new Map(roots.map((lease) => [lease.key, lease]));
	for (const root of roots) for (const entry of deps.descendants(db, root)) family.set(entry.install_root, deps.handle(entry.install_root, entry));
	for (const lease of family.values()) if (lease.version === 3 || lease.action.kind !== "update" || deps.childAliases(lease.key, db).some((key) => !family.has(key))) throw new Error(`Cancelled update custody includes unsupported custody at ${lease.key}; keep the handoff database and retained artifacts.`);
	return [...family.values()].toSorted((left, right) => left.key < right.key ? -1 : left.key > right.key ? 1 : 0);
}
//#endregion
//#region src/infra/update-managed-service-handoff-mutation.ts
/** Original cancellation's row/lineage checks over the receiver's existing store. */
function createManagedHandoffMutationReader(deps) {
	const { row, handle, sameRow, currentLegacyParent, withDatabase } = deps;
	function storedCurrent(lease, db) {
		if (lease.version === 1) return currentLegacyParent(lease, db);
		const value = row(db, lease.key);
		return Boolean(value && sameRow(managedHandoffLeaseRow(lease), value) && isDeepStrictEqual(handle(lease.key, value), lease));
	}
	function originalAllowsMutation(lease, db) {
		if (lease.version !== 2 || !lease.mutationOriginal) return true;
		const original = lease.mutationOriginal;
		return sameRow(managedHandoffLeaseRow(original), row(db, original.key));
	}
	function ancestorsAllowMutation(key, db, orphanCommand = false) {
		let marker = key.indexOf("/.openclaw-update-child-");
		while (marker >= 0) {
			const ancestorKey = key.slice(0, marker);
			const ancestor = row(db, ancestorKey);
			if (!ancestor) {
				if (!orphanCommand) return false;
			} else if (!isRetiredManagedHandoffLeasePayload(ancestor.payload_json)) {
				const lease = handle(ancestorKey, ancestor);
				if (lease.version === 4 || !originalAllowsMutation(lease, db)) return false;
			}
			marker = key.indexOf("/.openclaw-update-child-", marker + 1);
		}
		return true;
	}
	function childAliases(key, db) {
		const marker = "/.openclaw-update-child-";
		const index = key.lastIndexOf(marker);
		const childName = index < 0 ? "" : key.slice(index + 24);
		if (!/^[a-f0-9-]{36}-(?:lineage-[a-f0-9]{64}|command)$/.test(childName)) return [];
		return executeSqliteQuerySync(db, leaseQueries(db).selectFrom("managed_update_handoffs").select("install_root").where("install_root", "like", `%${marker}${childName}`)).rows.map((entry) => entry.install_root);
	}
	function mutationCurrent(lease, db) {
		if (lease.version === 4 || !storedCurrent(lease, db) || !originalAllowsMutation(lease, db) || !ancestorsAllowMutation(lease.key, db, Boolean(managedCommandCustody(lease)))) return false;
		return !childAliases(lease.key, db).some((key) => !ancestorsAllowMutation(key, db, Boolean(managedCommandCustody(lease))));
	}
	function current(lease) {
		try {
			return withDatabase(false, (db) => mutationCurrent(lease, db));
		} catch {
			return false;
		}
	}
	return {
		storedCurrent,
		originalAllowsMutation,
		childAliases,
		mutationCurrent,
		current
	};
}
//#endregion
//#region src/infra/update-managed-service-handoff-original-acquisition.ts
/** Cancellation-aware acquisition uses the original receiver admission transaction. */
function createManagedHandoffOriginalAcquisition(deps) {
	const { options, acquirePinnedOriginal, withDatabase, processIdentity, read, admit, originalUpdateAdmissions } = deps;
	const { databasePath } = options;
	return function acquire(root, owner, requestedAction, transition = false, legacyParent, originalParent) {
		let action = requestedAction;
		const originalUpdateOwner = options.originalUpdateKey === root && !originalParent && !legacyParent && !transition && !root.includes("/.openclaw-update-child-") && action.kind === "update";
		if (originalUpdateOwner && action.kind === "update") action = {
			...action,
			mutationProtocol: "original-cancellation-v1"
		};
		if (originalUpdateOwner && !options.existingIdentity) return withDatabase(true, () => {
			const existingIdentity = captureManagedUpdateLeaseDatabaseIdentity(databasePath);
			return acquirePinnedOriginal({
				...options,
				databasePath: existingIdentity.databasePath,
				existingIdentity
			}, root, owner, action);
		});
		const helper = processIdentity();
		const mutationOriginal = !root.includes("/.openclaw-update-child-") && originalParent?.version === 2 && originalParent.action.kind === "update" && originalParent.action.mutationProtocol === "original-cancellation-v1" ? managedHandoffOriginalGeneration(originalParent) : void 0;
		const payload = JSON.stringify({
			version: 2,
			executor: helper,
			helper,
			action,
			...mutationOriginal ? { mutationOriginal } : {}
		});
		if (!managedHandoffLeaseText.safeParse(root).success || !managedHandoffLeaseText.safeParse(owner).success || !parseManagedHandoffLeasePayload(payload)) throw new Error("managed handoff admission is invalid");
		if (transition) {
			if (legacyParent) throw new Error("Borrowed legacy authority cannot transition a lease");
			const result = read(root);
			if (result.kind !== "current" || result.lease.owner !== owner || result.lease.payload !== payload || action.kind !== "triage" || action.phase !== "reserved" || action.lifetime.kind !== "native" || action.lifetime.placement.kind !== "pending") throw new Error("managed triage transition lost its current lease");
			return {
				kind: "acquired",
				lease: result.lease
			};
		}
		const result = admit(root, owner, payload, void 0, legacyParent, originalParent);
		if (result.kind === "acquired" && originalUpdateOwner && options.existingIdentity) {
			const originalDatabaseIdentity = Object.freeze({ ...options.existingIdentity });
			originalUpdateAdmissions.set(result.lease, {
				database: originalDatabaseIdentity,
				original: structuredClone(result.lease)
			});
			return {
				...result,
				originalDatabaseIdentity
			};
		}
		return result;
	};
}
//#endregion
//#region src/infra/update-managed-service-handoff-cleanup.ts
/** v1 shipped in 2026.8.2. This proves cleanup eligibility, never v2 authority. */
function canCleanupLegacyManagedHandoff(payload, processState) {
	const value = safeParseJson(payload);
	return isRecord(value) && Object.keys(value).length === 3 && value.version === 1 && typeof value.pid === "number" && Number.isInteger(value.pid) && value.pid > 0 && typeof value.startIdentity === "string" && Number.isSafeInteger(Number(value.startIdentity)) && Number(value.startIdentity) >= 0 && String(Number(value.startIdentity)) === value.startIdentity && processState({
		pid: value.pid,
		startIdentity: value.startIdentity
	}) === "dead";
}
const MANAGED_SERVICE_UPDATE_HANDOFF_TEMP_PREFIX = "openclaw-update-run-handoff-";
const MANAGED_SERVICE_UPDATE_HANDOFF_STALE_TTL_MS = 864e5;
async function cleanupStaleManagedServiceUpdateHandoffs(params) {
	const tmpDir = params?.tmpDir ?? os.tmpdir();
	const nowMs = params?.nowMs ?? Date.now();
	const ttlMs = params?.ttlMs ?? MANAGED_SERVICE_UPDATE_HANDOFF_STALE_TTL_MS;
	let entries;
	try {
		entries = await fs$1.readdir(tmpDir, { withFileTypes: true });
	} catch {
		return 0;
	}
	let removed = 0;
	for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name))) {
		if (!entry.isDirectory() || !entry.name.startsWith("openclaw-update-run-handoff-")) continue;
		const dir = path.join(tmpDir, entry.name);
		try {
			if (nowMs - (await fs$1.stat(dir)).mtimeMs < ttlMs) continue;
			await fs$1.rm(dir, {
				recursive: true,
				force: true
			});
			removed += 1;
		} catch {}
	}
	return removed;
}
async function inspectManagedHandoffRepairFacts(previous, discovered, retained) {
	const facts = {
		runIds: [.../* @__PURE__ */ new Set([...retained?.runIds ?? [], ...discovered.runIds])],
		artifactPaths: [.../* @__PURE__ */ new Set([...retained?.artifactPaths ?? [], ...discovered.artifactPaths])],
		timeoutMs: Math.max(retained?.timeoutMs ?? 0, discovered.timeoutMs ?? 0) || null
	};
	const grace = Math.max(27e5, facts.timeoutMs ?? 0);
	if (Date.now() - previous.updatedAt < grace) throw new Error(`Handoff was last recorded at ${new Date(previous.updatedAt).toISOString()}; its recovery grace ends at ${new Date(previous.updatedAt + grace).toISOString()}. Retry openclaw update repair then.`);
	const { inspectOtherOpenClawProcesses } = await import("./openclaw-process-census-_IZI5lAh.mjs");
	for (const runId of facts.runIds) {
		const census = inspectOtherOpenClawProcesses({
			runId,
			artifactPaths: facts.artifactPaths
		});
		const pids = [.../* @__PURE__ */ new Set([...census.matchingPids, ...census.unverifiedPids])];
		if (pids.length || census.error) throw new Error(`Handoff descendants remain alive or unverified${pids.length ? `: PID ${pids.join(", ")}` : ""}. ${census.error || "Stop the named work through its owning terminal or service, verify process-inspection permissions, then run openclaw update repair."}`);
	}
	return facts;
}
async function readManagedHandoffRepairFacts(lease, env, boundRunId) {
	const { readSecureFile } = await import("./fs-safe-MZ5T9fjO.mjs");
	const { listUpdateRunsAsync } = await import("./update-run-reader-qYXGmbxF.mjs");
	const { recordedUpdateRunDrivers } = await import("./update-run-activity-WgkOEzlW.mjs");
	const { sameUpdateRunDriver } = await import("./update-run-driver-Cih6MONA.mjs");
	const { assertUpdateRecoveryAdmission } = await import("./update-run-recovery-admission-nVfaN_W7.mjs");
	const { resolveStateDir } = await import("./paths-DrzAhjmf.mjs");
	const { resolveUpdateCaptureRoot } = await import("./update-capture-paths-Bx3JwOAv.mjs");
	const runIds = new Set(boundRunId ? [boundRunId] : []);
	const artifactPaths = /* @__PURE__ */ new Set();
	let timeoutMs = 0;
	const root = await fs$1.realpath(os.tmpdir());
	for (const entry of await fs$1.readdir(root, { withFileTypes: true })) {
		if (!entry.isDirectory() || !entry.name.startsWith("openclaw-update-run-handoff-")) continue;
		const directory = path.join(root, entry.name);
		let value;
		try {
			const file = await readSecureFile({
				filePath: path.join(directory, "handoff.json"),
				trust: { trustedDirs: [directory] },
				io: { maxBytes: 1048576 },
				inject: { env }
			});
			if (file.realPath !== path.join(directory, "handoff.json")) throw new Error("Handoff artifact path changed");
			value = JSON.parse(file.buffer.toString("utf8"));
		} catch {
			value = void 0;
		}
		if (!isRecord(value) || typeof value.updateLeaseOwner !== "string" || typeof value.updateLeaseKey !== "string") {
			artifactPaths.add(directory);
			artifactPaths.add(lease.key);
			continue;
		}
		if (value.updateLeaseOwner !== lease.owner || value.updateLeaseKey !== lease.key) continue;
		if (typeof value.runId === "string" && value.runId.length > 0 && value.runId.length <= 4096) runIds.add(value.runId);
		artifactPaths.add(directory);
		for (const candidate of [value.cwd, value.triageContextPath]) if (typeof candidate === "string" && candidate.length <= 4096 && path.isAbsolute(candidate)) artifactPaths.add(candidate);
		const timeouts = [value.recoveryTimeoutMs, value.parentExitTimeoutMs];
		const argv = Array.isArray(value.commandArgv) && value.commandArgv.every((arg) => typeof arg === "string") ? value.commandArgv : [];
		for (const [index, arg] of argv.entries()) {
			const seconds = arg === "--timeout" ? argv[index + 1] : arg.match(/^--timeout=(.*)$/u)?.[1];
			timeouts.push(positiveSecondsToSafeMilliseconds(seconds?.trim()));
		}
		for (const candidate of timeouts) if (typeof candidate === "number" && Number.isSafeInteger(candidate) && candidate > 0) timeoutMs = Math.max(timeoutMs, candidate);
	}
	const runs = await listUpdateRunsAsync({
		limit: 100,
		includeRunId: [...runIds][0] ?? lease.owner
	}, { env });
	const host = os.hostname();
	const owners = [lease.helper, lease.executor].map(({ pid, startIdentity }) => ({
		pid,
		startIdentity,
		host
	}));
	for (const run of runs) if (run.runId === lease.owner || recordedUpdateRunDrivers(run).some((driver) => owners.some((owner) => sameUpdateRunDriver(driver, owner)))) runIds.add(run.runId);
	const runId = [...runIds][0];
	const original = runs.find((run) => run.runId === runId);
	if (!runId || !original || runIds.size !== 1) throw new Error("Cannot identify handoff run; use the original profile and state overrides.");
	const capture = original.origin.updateRecoveryCapture;
	if (capture && !capture.restored && !capture.forwardResolution && !capture.retirement) throw new Error(`Update ${runId} retains restoration; run openclaw doctor --fix.`);
	await assertUpdateRecoveryAdmission({ env });
	if (!capture) {
		const { resolvePublicUpdateStepId } = await import("./update-step-identity-DCnnMBuT.mjs");
		const { isVerifiedUpdateRollback } = await import("./update-outcome-6qEz7Eim.mjs");
		const rollback = original.steps.filter(({ step, status }) => {
			const id = resolvePublicUpdateStepId(step);
			return status !== "skipped" && (id === "package-rollback" || id === "config-rollback" || id === "git-runtime-rollback" || id === "previous-generation-restoration" || id?.startsWith("git-rollback-") && id !== "git-rollback-delete-branch" || step === "git-rollback-source");
		});
		const outcome = original.verification.rollbackOutcome?.status;
		const completed = outcome === "succeeded" || original.status === "rolled-back" && isVerifiedUpdateRollback({ recovery: original.verification.recovery ?? void 0 });
		if (outcome === "failed" || rollback.some((step) => step.status === "failed" || step.status === "in_progress") || rollback.length > 0 && !completed) {
			const { loadUpdateRecovery } = await import("./update-run-recovery-BrRoNEkc.mjs");
			const { isUpdateRecoveryPending } = await import("./update-run-recovery-schema-BOFyUXD3.mjs");
			const recovery = loadUpdateRecovery(runId, { env });
			if (!recovery?.terminal || isUpdateRecoveryPending(recovery)) throw new Error(`Update ${runId} retains an unverified rollback of its installation or configuration. Keep its artifacts, inspect openclaw update status --json, and complete the recorded restoration before retrying openclaw update repair.`);
		}
	}
	if (path.basename(runId) === runId && runId !== "." && runId !== "..") {
		const capturePath = path.join(resolveUpdateCaptureRoot(resolveStateDir(env)), runId);
		const canonical = await fs$1.realpath(capturePath).catch(() => null);
		if (canonical) {
			artifactPaths.add(capturePath);
			artifactPaths.add(canonical);
		}
	}
	return {
		runIds: [runId],
		artifactPaths: artifactPaths.size ? [...artifactPaths] : [lease.key],
		timeoutMs: timeoutMs || null
	};
}
//#endregion
//#region src/infra/update-managed-service-handoff-reclamation.ts
function createManagedHandoffReclaimability({ bootIdentity, processState, nativeClosed, hasUnsettledChildren, withDatabase, transact }) {
	return function reclaimable(lease, db) {
		if (lease.version === 3 || lease.version === 4 || hasOriginalUpdateExecutorCustody(lease)) return false;
		const action = lease.action;
		if (managedCommandCustody(lease)) return !managedCommandUnsettled(lease) && !hasUnsettledChildren(lease, db);
		if (action.kind === "triage" && action.lifetime.kind === "foreground") {
			const boot = bootIdentity();
			if (boot.platform === action.lifetime.boot.platform && boot.identity !== action.lifetime.boot.identity) {
				const repair = (connection) => readManagedHandoffRepairMetadata(connection, lease, (operation) => transact(connection, operation));
				return action.phase === "closed" || !(db ? repair(db) : withDatabase(true, repair));
			}
			if (!["reserved", "closed"].includes(action.phase)) return false;
		}
		if (processState(lease.helper) !== "dead" || processState(lease.executor) !== "dead") return false;
		return !hasUnsettledChildren(lease, db) && (action.kind !== "triage" || action.lifetime.kind !== "native" || nativeClosed(action.lifetime));
	};
}
/** Retire dead command claims and original mirrors with the replacing admission.
* A shipped parent cannot settle candidate custody after Doctor dies. Retained
* bound claims must not survive successful repair and fence an older reader. */
function observeManagedHandoffReclamation(root, original, db, deps) {
	const generation = original?.version === 2 && !original.mutationOriginal && original.action.kind === "update" && original.action.mutationProtocol === "original-cancellation-v1" ? managedHandoffOriginalGeneration(original) : void 0;
	const readPairs = () => generation ? executeSqliteQuerySync(db, leaseQueries(db).selectFrom("managed_update_handoffs").select([
		"install_root",
		"owner",
		"payload_json",
		"updated_at"
	]).orderBy("install_root")).rows.flatMap((row) => {
		const payload = parseManagedHandoffLeasePayload(row.payload_json);
		return payload?.version === 2 && isDeepStrictEqual(payload.mutationOriginal, generation) ? [{
			row,
			lease: deps.handle(row.install_root, row)
		}] : [];
	}) : [];
	const observed = readPairs();
	const roots = [root, ...observed.map(({ lease }) => lease.key)];
	const readCommands = () => deps.readCommandChildren(roots, db).toSorted((a, b) => a.key.localeCompare(b.key));
	const commands = readCommands();
	const commandSettled = (lease) => managedCommandCustody(lease) === "bound" && deps.processState(lease.helper) === "dead" && !managedCommandUnsettled(lease);
	const dead = observed.every(({ lease }) => deps.reclaimable(lease, db)) && commands.every(commandSettled);
	return () => {
		const current = readPairs();
		if (!dead || !isDeepStrictEqual(current, observed) || !isDeepStrictEqual(readCommands(), commands) || !commands.every(commandSettled) || current.some(({ lease }) => deps.hasUnsettledChildren(lease, db))) return false;
		for (const lease of commands) if (!deps.deleteRow(db, lease.key, managedHandoffLeaseRow(lease))) throw new Error("Managed command custody changed during reclamation");
		for (const { row } of current) if (!deps.deleteRow(db, row.install_root, row)) throw new Error("Original update mirror changed during reclamation");
		return true;
	};
}
function readManagedHandoffAdmissionLease(root, value, handle, processState) {
	const legacyDead = value && managedHandoffLeaseText.safeParse(value.owner).success && Number.isSafeInteger(value.updated_at) && value.updated_at >= 0 && canCleanupLegacyManagedHandoff(value.payload_json, processState);
	return value && !legacyDead ? handle(root, value) : null;
}
function describeCancelledCustody(lease) {
	return {
		key: lease.key,
		owner: lease.owner,
		leaseVersion: lease.version,
		lastActivityAt: new Date(lease.updatedAt).toISOString()
	};
}
/** Repair left cancelled custody in place; its caller still finishes maintenance. */
var ManagedHandoffCustodyRetainedError = class extends Error {
	constructor(lease, cause) {
		const custody = {
			...describeCancelledCustody(lease),
			reason: cause instanceof Error ? cause.message : String(cause)
		};
		super(`Cancelled update custody remains at ${custody.key} (owner ${custody.owner}, lease version ${custody.leaseVersion}, last activity ${custody.lastActivityAt}): ${custody.reason}`, { cause });
		this.name = "ManagedHandoffCustodyRetainedError";
		this.custody = custody;
	}
};
function liveOwnersError(owners) {
	return /* @__PURE__ */ new Error(`Handoff owners are live or unverified: PID ${[...new Set(owners.map((owner) => owner.pid))].join(", ")}. Wait for their updater or stop it through its owning terminal; verify process-inspection permissions using the original OS account, then run openclaw update repair.`);
}
const unsettledDescendantsMessage = "Handoff descendants remain live or unverified. Wait for their updater and verify process-inspection permissions, then run openclaw update repair.";
function cancelledCustodySettlement(origin, keys) {
	return `cancelled update custody settled: updater PID ${origin.helper.pid} and its descendants proven exited, custody last recorded at ${new Date(origin.updatedAt).toISOString()}, no referencing processes. Settled keys: ${keys.join(", ")}. Current-installation repair completed.`;
}
async function prepareManagedHandoffRepair(store, context, root, env, timeoutMs) {
	const { rows, withDatabase, processState, reclaimable } = context;
	const found = store.read(root);
	if (found.kind === "unreadable") throw new Error("Handoff state is unreadable; retain managed-update-handoffs.sqlite and run openclaw doctor --fix.");
	const readChildren = (db) => rows.descendants(db, { key: root }).map((entry) => rows.handle(entry.install_root, entry));
	const children = withDatabase(true, readChildren);
	const previous = found.kind === "current" ? found.lease : children[0];
	if (!previous) return null;
	if (previous.version === 4) try {
		return await prepareCancelledCustodyRepair(store, context, root, previous, env, timeoutMs);
	} catch (error) {
		throw new ManagedHandoffCustodyRetainedError(previous, error);
	}
	const legacyUpdateChild = (lease) => lease.key.startsWith(`${root}/.openclaw-update-child-`) && lease.version === 2 && !lease.mutationOriginal && lease.action.kind === "update" && !lease.action.custody && !lease.action.mutationProtocol;
	if (previous.version !== 2 || previous.mutationOriginal || !legacyUpdateChild(previous) && (previous.action.kind !== "triage" || previous.action.lifetime.kind !== "foreground" || !["running", "uncertain"].includes(previous.action.phase))) return null;
	const metadata = withDatabase(true, (db) => readManagedHandoffRepairMetadata(db, previous, (operation) => store.transact(db, operation)));
	if (previous.action.kind === "triage" && previous.action.phase !== "uncertain" && !metadata) return null;
	const source = metadata?.source ?? managedHandoffLeaseRow(previous);
	const sourceLease = rows.handle(previous.key, source);
	const resume = async () => {
		const assertDead = () => {
			const owners = [previous, ...children].flatMap((lease) => [lease.helper, lease.executor]).filter((owner) => processState(owner) !== "dead");
			if (owners.length) throw liveOwnersError(owners);
		};
		assertDead();
		const assertChildrenSettled = (db) => {
			if (store.hasUnsettledChildren(root, db) || children.some((child) => !legacyUpdateChild(child) || !reclaimable(child, db))) throw new Error(unsettledDescendantsMessage);
		};
		withDatabase(false, assertChildrenSettled);
		const discovered = await readManagedHandoffRepairFacts(sourceLease, env, metadata?.facts.runIds[0]);
		let facts = await inspectManagedHandoffRepairFacts(sourceLease.version === 4 ? sourceLease : previous, discovered, metadata?.facts);
		const retainedChildren = children.filter((child) => child.key !== previous.key);
		for (const child of retainedChildren) facts = await inspectManagedHandoffRepairFacts(child, await readManagedHandoffRepairFacts(child, env), facts);
		if (previous.key !== root && !facts.artifactPaths.includes(previous.key)) facts.artifactPaths.push(previous.key);
		facts.timeoutMs = Math.max(facts.timeoutMs ?? 0, timeoutMs ?? 0) || null;
		const settledKeys = [previous.key, ...retainedChildren.map((child) => child.key)];
		return await claimManagedHandoffRepair(store, context, root, previous, source, facts, env, {
			unchanged: (db) => {
				assertDead();
				assertChildrenSettled(db);
				return isDeepStrictEqual(readChildren(db), children) && (previous.key === root || !rows.row(db, root));
			},
			retained: retainedChildren,
			settled: (db, retained) => {
				assertChildrenSettled(db);
				if (!isDeepStrictEqual(readChildren(db), retained)) throw new Error("Handoff children changed; retry openclaw update repair.");
			},
			...sourceLease.version === 4 ? {
				cancelled: sourceLease,
				settlement: cancelledCustodySettlement(sourceLease, settledKeys)
			} : { settlement: `legacy handoff lease reclaimed: owners proven dead, lease last recorded at ${new Date(previous.updatedAt).toISOString()}, no verified live descendants or runtime holders. Reclaimed keys: ${settledKeys.join(", ")}. Current-installation repair completed.` }
		});
	};
	if (sourceLease.version !== 4) return await resume();
	try {
		return await resume();
	} catch (error) {
		throw new ManagedHandoffCustodyRetainedError(sourceLease, error);
	}
}
/** Settle a dead original's cancellation through the same explicit claim and
* receipt. Its generations, dependents and descendants must all be proven
* exited; the claim replaces the original and retires the rest atomically. */
async function prepareCancelledCustodyRepair(store, context, root, origin, env, timeoutMs) {
	const { rows, withDatabase, processState, childAliases } = context;
	const readFamily = (db) => readCancelledUpdateFamily(db, origin, {
		handle: rows.handle,
		descendants: rows.descendants,
		childAliases
	});
	const family = withDatabase(false, readFamily);
	if (!family.some((lease) => isDeepStrictEqual(lease, origin))) throw new Error("Handoff ownership changed; retry openclaw update repair.");
	const assertDead = () => {
		const owners = family.flatMap((lease) => [lease.helper, lease.executor]).filter((owner) => processState(owner) !== "dead");
		if (owners.length) throw liveOwnersError(owners);
	};
	const assertSettled = (db) => {
		if (family.some((lease) => store.hasUnsettledChildren(lease.key, db)) || process.platform !== "win32" && family.some((lease) => isChildProcessTreeAlive(lease.executor))) throw new Error(unsettledDescendantsMessage);
	};
	assertDead();
	withDatabase(false, assertSettled);
	const discovered = await readManagedHandoffRepairFacts(origin, env);
	const facts = await inspectManagedHandoffRepairFacts(family.reduce((latest, lease) => lease.updatedAt > latest.updatedAt ? lease : latest), {
		...discovered,
		artifactPaths: [.../* @__PURE__ */ new Set([...discovered.artifactPaths, ...family.map((lease) => lease.key)])]
	});
	facts.timeoutMs = Math.max(facts.timeoutMs ?? 0, timeoutMs ?? 0) || null;
	const retired = family.filter((lease) => lease.key !== origin.key);
	withDatabase(true, (db) => readManagedHandoffRepairMetadata(db, origin, (operation) => store.transact(db, operation)));
	return await claimManagedHandoffRepair(store, context, root, origin, managedHandoffLeaseRow(origin), facts, env, {
		unchanged: (db) => {
			assertDead();
			assertSettled(db);
			return isDeepStrictEqual(readFamily(db), family);
		},
		retire: (db) => retired.every((lease) => rows.deleteRow(db, lease.key, managedHandoffLeaseRow(lease))),
		retained: [],
		settled: (db) => {
			if (store.hasUnsettledChildren(root, db)) throw new Error(unsettledDescendantsMessage);
		},
		cancelled: origin,
		settlement: cancelledCustodySettlement(origin, family.map((lease) => lease.key))
	});
}
/** Replace verified custody with this process's foreground repair claim. Recovery
* metadata keeps the source and facts until the settlement receipt is durable. */
async function claimManagedHandoffRepair(store, { rows, withDatabase }, root, previous, source, facts, env, claim) {
	const { recordUpdateRunStep } = await import("./update-run-ledger-BNpLktkl.mjs");
	const helper = store.processIdentity();
	const action = {
		kind: "triage",
		phase: "running",
		lifetime: {
			kind: "foreground",
			boot: managedHandoffBootSchema.parse(store.bootIdentity())
		}
	};
	let next = rows.handle(root, {
		owner: randomUUID(),
		payload_json: JSON.stringify({
			version: 2,
			executor: helper,
			helper,
			action
		}),
		updated_at: Math.max(Date.now(), previous.updatedAt + 1)
	});
	const recovery = (lease) => JSON.stringify({
		version: 3,
		binding: managedHandoffLeaseBinding(lease),
		source,
		facts
	});
	withDatabase(true, (db) => store.transact(db, () => {
		if (!claim.unchanged(db) || !rows.updateRow(db, previous, {
			install_root: root,
			owner: next.owner,
			payload_json: next.payload,
			updated_at: next.updatedAt,
			recovery_json: recovery(next)
		}) || claim.retire && !claim.retire(db)) throw new Error("Handoff ownership changed; retry openclaw update repair.");
	}));
	let retained = claim.retained;
	const assertCurrent = (db) => {
		if (!store.owns(next)) throw new Error("Handoff repair lost ownership; retry openclaw update repair.");
		if (db) claim.settled(db, retained);
		else withDatabase(false, (connection) => claim.settled(connection, retained));
	};
	const transition = (nextAction) => {
		const changed = rows.handle(root, {
			...managedHandoffLeaseRow(next),
			payload_json: JSON.stringify({
				version: 2,
				executor: next.executor,
				helper: next.helper,
				action: nextAction
			}),
			updated_at: Math.max(Date.now(), next.updatedAt + 1)
		});
		withDatabase(true, (db) => store.transact(db, () => {
			assertCurrent(db);
			if (!rows.updateRow(db, next, {
				payload_json: changed.payload,
				updated_at: changed.updatedAt,
				recovery_json: recovery(changed)
			})) throw new Error("Handoff repair lost ownership; retry openclaw update repair.");
		}));
		next = changed;
	};
	return {
		...claim.cancelled ? { cancelledCustody: describeCancelledCustody(claim.cancelled) } : {},
		assertCurrent,
		bindRun(runId) {
			facts.runIds.push(runId);
			transition(action);
		},
		complete(runId) {
			assertCurrent();
			if (!facts.runIds.includes(runId)) throw new Error("Handoff settlement requires its bound repair run.");
			if ((recordUpdateRunStep(runId, {
				step: "finalize:handoff-settlement",
				status: "completed",
				endedAtMs: Date.now(),
				detail: claim.settlement
			}, { env })?.steps.find((step) => step.step === "finalize:handoff-settlement"))?.status !== "completed") throw new Error("Handoff settlement was not recorded; retry openclaw update repair.");
			if (retained.length) {
				withDatabase(true, (db) => store.transact(db, () => {
					assertCurrent(db);
					for (const child of retained) if (!rows.deleteRow(db, child.key, managedHandoffLeaseRow(child))) throw new Error("Handoff children changed; retry openclaw update repair.");
				}));
				retained = [];
			}
			const closed = store.settle(next, "closed");
			if (!closed || !store.release(closed)) throw new Error("Handoff repair completed but its lease remains; retry openclaw update repair.");
		},
		[Symbol.dispose]() {
			if (store.owns(next)) transition({
				...action,
				phase: "uncertain"
			});
		}
	};
}
//#endregion
//#region src/infra/update-managed-service-handoff-retained-custody.ts
function sourceKey(resource) {
	const absolute = path.resolve(resource);
	try {
		return path.join(fs.realpathSync(path.dirname(absolute)), path.basename(absolute));
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return absolute;
		throw error;
	}
}
function fileIdentity(file) {
	try {
		return fs.statSync(file, { bigint: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
function normalizationInsensitive(directory) {
	try {
		const names = fs.readdirSync(directory);
		for (const name of names) {
			const nfc = name.normalize("NFC");
			const nfd = name.normalize("NFD");
			if (nfc === nfd) continue;
			const originalPath = path.join(directory, name);
			const alternate = name === nfc ? nfd : nfc;
			const original = fs.lstatSync(originalPath, { bigint: true });
			if (original.ino === 0n) return;
			let insensitive;
			try {
				const other = fs.lstatSync(path.join(directory, alternate), { bigint: true });
				if (other.ino === 0n) return;
				insensitive = !names.includes(alternate) && original.dev === other.dev && original.ino === other.ino;
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) return;
				insensitive = false;
			}
			const current = fs.lstatSync(originalPath, { bigint: true });
			return current.dev === original.dev && current.ino === original.ino ? insensitive : void 0;
		}
	} catch {}
}
function sameSource(left, right) {
	if (left === right) return true;
	let distinct = false;
	for (const suffix of ["", ".lock"]) {
		const a = fileIdentity(left + suffix);
		const b = fileIdentity(right + suffix);
		if (a && b) {
			if (a.ino !== 0n && a.dev === b.dev && a.ino === b.ino) return true;
			if (a.ino !== 0n && b.ino !== 0n && (a.ino !== b.ino || a.dev !== b.dev)) distinct = true;
		}
	}
	if (distinct || path.dirname(left) !== path.dirname(right)) return false;
	const leftName = path.basename(left);
	const rightName = path.basename(right);
	const leftFolded = leftName.toLowerCase();
	const rightFolded = rightName.toLowerCase();
	if (leftFolded.normalize("NFC") !== rightFolded.normalize("NFC")) return false;
	if (leftFolded !== rightFolded) {
		const insensitive = normalizationInsensitive(path.dirname(right));
		if (insensitive === void 0) throw new Error("Source resource Unicode alias identity is unavailable.");
		if (!insensitive) return false;
	}
	if (leftName.normalize("NFC") === rightName.normalize("NFC")) return true;
	const insensitive = tryResolvePathCaseInsensitive(right, { allowTemporaryProbe: false });
	if (insensitive === void 0) throw new Error("Source resource alias identity is unavailable.");
	return insensitive;
}
/** Read-only compatibility for preserved v3 records. No current producer mints them. */
function assertNoRetainedSourceBorrower(resource, rows) {
	const key = sourceKey(resource);
	for (const lease of rows) if (lease.version === 3 && [lease.nativeBorrower.source.serviceKey, ...lease.nativeBorrower.source.configPaths].some((reserved) => sameSource(reserved, key))) throw new Error("Source resource has unresolved native custody.");
}
//#endregion
//#region src/infra/update-managed-service-handoff-scope.ts
function procCgroupMembershipMatches(cgroupFile, controlGroup) {
	if (!controlGroup) return false;
	return cgroupFile.split("\n").some((line) => {
		const systemd = /^[1-9][0-9]*:name=systemd:(.*)$/.exec(line);
		return line === "0::" + controlGroup || systemd?.[1] === controlGroup;
	});
}
/** Inspect the native scope through the same captured service-manager environment. */
function createManagedHandoffScopeReader(serviceManagerEnv) {
	const control = (command, args, timeout = 5e3) => spawnSync(command, args, {
		env: serviceManagerEnv,
		encoding: "utf8",
		timeout,
		killSignal: "SIGKILL",
		windowsHide: true,
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		]
	});
	function properties(stdout) {
		return Object.fromEntries(String(stdout || "").trim().split(/\r?\n/).map((line) => {
			const i = line.indexOf("=");
			return [line.slice(0, i), line.slice(i + 1)];
		}));
	}
	function nativeScope(life) {
		const result = control("systemctl", [
			"--user",
			"show",
			life.scope,
			"--property=Id,LoadState,ActiveState,InvocationID,ControlGroup"
		]);
		const scope = properties(result.stdout);
		return !result.error && (result.status === 0 || scope.LoadState === "not-found") ? scope : null;
	}
	function isInNativeScope(life, scope = nativeScope(life)) {
		if (!scope || scope.Id !== life.scope || scope.LoadState !== "loaded" || !scope.ControlGroup || life.placement.kind === "attached" && scope.InvocationID !== life.placement.invocation) return false;
		return procCgroupMembershipMatches(fs.readFileSync("/proc/self/cgroup", "utf8"), scope.ControlGroup);
	}
	function nativeClosed(life, scope = nativeScope(life)) {
		return Boolean(scope && scope.Id === life.scope && (scope.LoadState === "not-found" || scope.LoadState === "loaded" && ["inactive", "failed"].some((state) => state === scope.ActiveState) && scope.ControlGroup === "" && (life.placement.kind === "pending" || scope.InvocationID === life.placement.invocation)));
	}
	return {
		control,
		properties,
		nativeScope,
		isInNativeScope,
		nativeClosed
	};
}
//#endregion
//#region src/infra/update-managed-service-handoff-lease.ts
const originalUpdateAdmissions = /* @__PURE__ */ new WeakMap();
function resolveManagedUpdateLeaseDatabasePath() {
	const uid = process.getuid?.();
	const preferredDir = path.join(os.tmpdir(), uid === void 0 ? "openclaw" : `openclaw-${uid}`);
	return path.join(resolvePreferredOpenClawTmpDir({ preferredDir }), "managed-update-handoffs.sqlite");
}
/** One lease implementation, preloaded normally and sealed before package replacement. */
function createManagedHandoffLeaseStore(options = {
	databasePath: resolveManagedUpdateLeaseDatabasePath(),
	serviceManagerEnv: resolveServiceManagerEnv()
}, logger) {
	return createLeaseStore(options, logger, createManagedHandoffLeaseDatabase(options.databasePath, options.existingIdentity));
}
/** Current writers prepare cross-process admission; the synchronous factory remains for shipped readers/helpers. */
async function prepareManagedHandoffLeaseStore(options = {
	databasePath: resolveManagedUpdateLeaseDatabasePath(),
	serviceManagerEnv: resolveServiceManagerEnv()
}, logger) {
	const database = await prepareManagedHandoffLeaseDatabase(options.databasePath, options.existingIdentity);
	return createLeaseStore({
		...options,
		databasePath: database.databasePath
	}, logger, database);
}
function createLeaseStore(options, logger, withDatabase) {
	const { serviceManagerEnv } = options;
	const bootIdentity = createManagedHandoffBootIdentityReader(serviceManagerEnv);
	const { isPidAlive, readProcessStartIdentity, processIdentity, processState, inspectProcessIdentity, isProcessIdentityCurrent, validateDarwinAncestorProcesses, acceptSelfIdentity } = createManagedHandoffProcessIdentityReader({
		env: serviceManagerEnv,
		onWarning: options.onProcessIdentityWarning ?? ((pid, message) => logger?.warn(message, { pid }))
	});
	const { control, properties, nativeScope, isInNativeScope, nativeClosed } = createManagedHandoffScopeReader(serviceManagerEnv);
	const { row, handle, descendants, deleteRow, updateRow, read, readLegacyParent, readRetainedSources, currentLegacyParent, sameRow } = createManagedHandoffLeaseRows(options, withDatabase, {
		isProcessIdentityCurrent,
		validateDarwinAncestorProcesses
	});
	function transact(db, operation) {
		return withDatabase.transact(db, operation, { logger });
	}
	const { hasUnsettledChildren, readCommandChildren } = createManagedHandoffChildReader({
		withDatabase,
		handle,
		descendants,
		processState
	});
	const reclaimable = createManagedHandoffReclaimability({
		bootIdentity,
		processState,
		nativeClosed,
		hasUnsettledChildren,
		withDatabase,
		transact
	});
	function admit(root, owner, payload, source, legacyParent, originalParent) {
		const custody = managedCommandCustody(parseManagedHandoffLeasePayload(payload));
		if (custody && (custody !== "reserved" || !root.includes("/.openclaw-update-child-"))) throw new Error("Managed command custody requires a child reservation");
		return withDatabase(true, (db) => {
			const observed = row(db, root);
			const destination = readManagedHandoffAdmissionLease(root, observed, handle, processState);
			const canReplace = !destination || destination.owner !== owner && reclaimable(destination, db);
			const reclaim = canReplace ? observeManagedHandoffReclamation(root, destination ?? void 0, db, {
				handle,
				deleteRow,
				reclaimable,
				hasUnsettledChildren,
				readCommandChildren,
				processState
			}) : void 0;
			return transact(db, () => {
				if (originalParent && !mutationCurrent(originalParent, db)) return {
					kind: "busy",
					owner: originalParent.owner
				};
				if (destination && !originalAllowsMutation(destination, db)) return {
					kind: "busy",
					owner: destination.owner
				};
				if (source && !sameRow(managedHandoffLeaseRow(source), row(db, source.key))) throw new Error("managed triage source changed during admission");
				if (source && (!mutationCurrent(source, db) || hasUnsettledChildren(source, db))) return {
					kind: "busy",
					owner: source.owner
				};
				const childMarker = root.indexOf("/.openclaw-update-child-");
				if (childMarker >= 0) {
					const parentKey = root.slice(0, childMarker);
					const parent = row(db, parentKey);
					if (legacyParent) {
						if (legacyParent.key !== parentKey || !currentLegacyParent(legacyParent, db)) throw new Error("Borrowed legacy update parent changed during child admission");
						if (root.lastIndexOf("/.openclaw-update-child-") === childMarker && hasUnsettledChildren(legacyParent, db)) return {
							kind: "busy",
							owner: legacyParent.owner
						};
					} else if (parent ? !(custody && isRetiredManagedHandoffLeasePayload(parent.payload_json)) && (!mutationCurrent(handle(parentKey, parent), db) || handle(parentKey, parent).version === 3) : custody !== "reserved") return {
						kind: "busy",
						owner: parent?.owner ?? owner
					};
				} else if (legacyParent) throw new Error("Borrowed legacy update authority admits only child rows");
				const latest = row(db, root);
				if (!sameRow(observed, latest)) {
					if (latest) return {
						kind: "busy",
						owner: handle(root, latest).owner
					};
					throw new Error("managed handoff lease changed during admission");
				}
				const previous = destination ?? readBorrowedLegacyHandoffParent(root, observed);
				if (!canReplace || hasUnsettledChildren(previous ?? root, db)) return {
					kind: "busy",
					owner: previous?.owner ?? owner
				};
				if (!reclaim?.()) return {
					kind: "busy",
					owner: destination?.owner ?? owner
				};
				if (observed) deleteRow(db, root, observed);
				const updatedAt = Math.max(Date.now(), (source?.updatedAt ?? 0) + 1);
				if (source) {
					if (!updateRow(db, source, {
						install_root: root,
						payload_json: payload,
						updated_at: updatedAt
					})) throw new Error("managed triage source changed during transfer");
				} else executeSqliteQuerySync(db, leaseQueries(db).insertInto("managed_update_handoffs").values({
					install_root: root,
					owner,
					payload_json: payload,
					updated_at: updatedAt
				}));
				return {
					kind: "acquired",
					lease: handle(root, {
						owner,
						payload_json: payload,
						updated_at: updatedAt
					})
				};
			});
		});
	}
	const acquire = createManagedHandoffOriginalAcquisition({
		options,
		acquirePinnedOriginal: (pinnedOptions, root, owner, action) => createLeaseStore(pinnedOptions, logger, withDatabase.forExisting(pinnedOptions.existingIdentity)).acquire(root, owner, action),
		withDatabase,
		processIdentity,
		read,
		admit,
		originalUpdateAdmissions
	});
	const { storedCurrent, originalAllowsMutation, childAliases, mutationCurrent, current } = createManagedHandoffMutationReader({
		withDatabase,
		row,
		handle,
		sameRow,
		currentLegacyParent
	});
	const cancelUpdate = createManagedHandoffCancellation({
		existingIdentity: options.existingIdentity,
		originalUpdateAdmissions,
		withDatabase,
		transact,
		mutationCurrent,
		storedCurrent,
		childAliases,
		canRelease,
		row,
		handle,
		descendants,
		updateRow,
		deleteRow,
		processState
	});
	function owns(lease, role = "helper") {
		return current(lease) && !(lease.action.kind === "triage" && [
			"closing",
			"closed",
			"uncertain"
		].includes(lease.action.phase)) && lease[role].pid === process.pid && isProcessIdentityCurrent(lease.helper) && acceptSelfIdentity(lease[role]);
	}
	function acceptParentBoundExecutor(lease) {
		return current(lease) && lease.version === 2 && lease.action.kind === "update" && lease.helper.pid === process.ppid && lease.executor.pid === process.pid && isProcessIdentityCurrent(lease.helper) && acceptSelfIdentity(lease.executor, true);
	}
	const cas = (lease, action, executor, recovery) => {
		if (lease.version === 3 || lease.version === 4 || hasOriginalUpdateExecutorCustody(lease, action) || !managedCommandAllowsBinding(lease, action, executor)) return null;
		const payload = JSON.stringify({
			...parseManagedHandoffLeasePayload(lease.payload),
			action,
			...executor ? {
				executor,
				helper: lease.helper
			} : {}
		});
		const decoded = parseManagedHandoffLeasePayload(payload);
		if (!decoded) return null;
		return withDatabase(true, (db) => transact(db, () => {
			if (!mutationCurrent(lease, db) || hasUnsettledChildren(lease, db)) return null;
			const updatedAt = Math.max(Date.now(), lease.updatedAt + 1);
			const next = {
				...lease,
				...decoded,
				payload,
				updatedAt
			};
			return updateRow(db, lease, {
				payload_json: payload,
				updated_at: updatedAt,
				...recovery ? { recovery_json: recovery(next) } : {}
			}) ? next : null;
		}));
	};
	function bind(lease, pid, action = lease.action, argv) {
		if (!owns(lease)) return null;
		const previous = lease.action;
		if (previous.kind === "triage") {
			if (previous.phase !== "reserved" || action.kind !== "triage" || action.phase !== "reserved" || lease.executor.pid !== lease.helper.pid) return null;
			const lifetime = previous.lifetime.kind === "native" && action.lifetime.kind === "native" && previous.lifetime.placement.kind === "pending" ? {
				...previous.lifetime,
				placement: action.lifetime.placement
			} : previous.lifetime;
			if (JSON.stringify(lifetime) !== JSON.stringify(action.lifetime)) return null;
		} else if (action.kind !== "update") return null;
		return cas(lease, action, processIdentity(pid, argv));
	}
	function bindUpdateChildren(leases, executor) {
		if (!leases.length || new Set(leases.map((lease) => lease.key)).size !== leases.length || leases.some((lease) => lease.version !== 2 || lease.action.kind !== "update" || managedCommandCustody(lease) === "bound" || !lease.key.includes("/.openclaw-update-child-") || !owns(lease) || !isDeepStrictEqual(lease.helper, lease.executor))) return null;
		const custody = managedCommandCustody(leases[0]);
		if (leases.some((lease) => managedCommandCustody(lease) !== custody) || custody && executor.pid === process.pid) return null;
		return withDatabase(true, (db) => transact(db, () => {
			if (leases.some((lease) => !mutationCurrent(lease, db) || hasUnsettledChildren(lease, db))) return null;
			return leases.map((lease) => {
				const payload = JSON.stringify({
					version: 2,
					helper: lease.helper,
					executor,
					action: custody ? {
						...lease.action,
						custody: "bound"
					} : lease.action
				});
				const updatedAt = Math.max(Date.now(), lease.updatedAt + 1);
				if (!updateRow(db, lease, {
					payload_json: payload,
					updated_at: updatedAt
				})) throw new Error("Candidate process binding changed.");
				return handle(lease.key, {
					owner: lease.owner,
					payload_json: payload,
					updated_at: updatedAt
				});
			});
		}));
	}
	function retarget(lease, root, action) {
		if (lease.version !== 2 || managedCommandCustody(lease) || lease.action.kind === "update" && lease.action.mutationProtocol === "original-cancellation-v1" || hasUnsettledChildren(lease) || !owns(lease, "executor") || lease.helper.pid !== process.pid || lease.action.kind !== "update" || action.kind !== "triage" || action.phase !== "reserved" || action.lifetime.kind !== "native" || action.lifetime.placement.kind !== "pending") return null;
		const payload = JSON.stringify({
			version: 2,
			executor: lease.helper,
			helper: lease.helper,
			action,
			...lease.mutationOriginal ? { mutationOriginal: lease.mutationOriginal } : {}
		});
		if (!managedHandoffLeaseText.safeParse(root).success || !parseManagedHandoffLeasePayload(payload) || fs.realpathSync(root) !== root) throw new Error("managed triage destination is not canonical");
		if (root === lease.key) {
			const next = cas(lease, action, lease.helper);
			return next ? {
				kind: "acquired",
				lease: next
			} : null;
		}
		return admit(root, lease.owner, payload, lease);
	}
	function activate(lease) {
		if (!owns(lease) || processState(lease.executor) !== "live" || lease.executor.pid === lease.helper.pid || lease.action.kind !== "triage" || lease.action.phase !== "reserved") return null;
		return cas(lease, {
			...lease.action,
			phase: "running"
		});
	}
	function readGeneration(lease) {
		const result = read(lease.key);
		if (result.kind !== "current") return null;
		const active = result.lease;
		return lease.version === 2 && active.version === 2 && lease.action.kind === "triage" && active.action.kind === "triage" && lease.owner === active.owner && JSON.stringify(lease.helper) === JSON.stringify(active.helper) && JSON.stringify(lease.executor) === JSON.stringify(active.executor) && JSON.stringify(lease.action.lifetime) === JSON.stringify(active.action.lifetime) ? {
			...active,
			action: active.action
		} : null;
	}
	function settle(lease, phase) {
		const active = readGeneration(lease);
		if (!active) return null;
		const actor = active.helper.pid === process.pid && phase !== "closed" ? active.helper : active.executor;
		if (actor.pid !== process.pid || processState(actor) !== "live") return null;
		if (phase === "closed") {
			if (!["running", "closing"].includes(active.action.phase)) return null;
		} else if (active.action.phase === "uncertain" || phase === "closing" && ["closing", "closed"].includes(active.action.phase)) return active;
		return cas(active, {
			...active.action,
			phase
		});
	}
	function canRelease(lease, settledReservation = false) {
		if (lease.version === 4 || hasOriginalUpdateExecutorCustody(lease) || !withDatabase(false, (db) => storedCurrent(lease, db)) || hasUnsettledChildren(lease) || lease.key.includes("/.openclaw-update-child-") && lease.executor.pid !== lease.helper.pid && process.platform !== "win32" && isChildProcessTreeAlive(lease.executor)) return false;
		const localHelper = lease.helper.pid === process.pid && processState(lease.helper) === "live";
		if (managedCommandCustody(lease)) return managedCommandCustody(lease) === "reserved" ? localHelper && settledReservation : !managedCommandUnsettled(lease);
		const action = lease.action;
		const executorClosed = lease.executor.pid === process.pid || processState(lease.executor) === "dead";
		return localHelper ? action.kind === "update" ? executorClosed : action.lifetime.kind === "foreground" ? ["reserved", "closed"].includes(action.phase) && executorClosed : nativeClosed(action.lifetime) : reclaimable(lease);
	}
	function releaseAll(leases, settledReservation = false) {
		if (!leases.length || new Set(leases.map((lease) => lease.key)).size !== leases.length || leases.some((lease) => !canRelease(lease, settledReservation))) return false;
		return withDatabase(true, (db) => transact(db, () => {
			if (leases.some((lease) => hasUnsettledChildren(lease, db) || lease.version === 2 && lease.action.kind === "update" && (lease.action.mutationProtocol === "original-cancellation-v1" || managedCommandCustody(lease) === "bound") && [...childAliases(lease.key, db), ...readOriginalUpdateDependents(lease, db)].some((key) => !leases.some((paired) => paired.key === key)) || !storedCurrent(lease, db))) return false;
			for (const lease of leases) if (!deleteRow(db, lease.key, managedHandoffLeaseRow(lease))) {
				if (leases.length === 1) return false;
				throw new Error("Update executor release changed.");
			}
			return true;
		}));
	}
	function assertSourceUnborrowed(resource) {
		assertNoRetainedSourceBorrower(resource, readRetainedSources());
	}
	function stopNative(lease, ownPlacement = false) {
		const life = lease.action.kind === "triage" && lease.action.lifetime;
		if (!life || life.kind !== "native" || life.placement.kind !== "attached" && !ownPlacement || !ownPlacement && !current(lease)) return false;
		const scope = nativeScope(life);
		if (ownPlacement && (![lease.helper.pid, lease.executor.pid].includes(process.pid) || processState(lease.helper.pid === process.pid ? lease.helper : lease.executor) !== "live" || !isInNativeScope(life, scope))) return false;
		if (nativeClosed(life, scope)) return true;
		if (!scope || scope.Id !== life.scope || life.placement.kind === "attached" && scope.InvocationID !== life.placement.invocation || !ownPlacement && !current(lease)) return false;
		const result = control("systemctl", [
			"--user",
			...ownPlacement ? ["--no-block"] : [],
			"stop",
			life.scope
		], 3e4);
		return !result.error && result.status === 0 && (ownPlacement || nativeClosed(life));
	}
	const store = {
		retainReadConnection: withDatabase.retainReadConnection,
		transact,
		read,
		readLegacyParent,
		acquire,
		bind,
		bindUpdateChildren,
		cancelUpdate,
		releaseAll: (leases) => releaseAll(leases),
		retarget,
		activate,
		owns,
		hasUnsettledChildren,
		readCommandChildren,
		acceptParentBoundExecutor,
		current,
		readGeneration,
		settle,
		release: (lease) => releaseAll([lease]),
		releaseCommandReservation: (lease) => managedCommandCustody(lease) === "reserved" && releaseAll([lease], true),
		assertSourceUnborrowed,
		stopNative,
		isInNativeScope,
		processIdentity,
		inspectProcessIdentity,
		isProcessIdentityCurrent,
		readProcessStartIdentity,
		isPidAlive,
		bootIdentity,
		properties,
		validFailure: (value) => triageFailureSchema.safeParse(value).success
	};
	const prepareRepair = prepareManagedHandoffRepair.bind(null, store, {
		rows: {
			handle,
			updateRow,
			deleteRow,
			row,
			descendants
		},
		withDatabase,
		processState,
		reclaimable,
		childAliases
	});
	return Object.assign(store, { prepareRepair });
}
//#endregion
export { MANAGED_SERVICE_UPDATE_HANDOFF_TEMP_PREFIX as a, ManagedHandoffCustodyRetainedError as i, prepareManagedHandoffLeaseStore as n, cleanupStaleManagedServiceUpdateHandoffs as o, resolveManagedUpdateLeaseDatabasePath as r, managedCommandCustody as s, createManagedHandoffLeaseStore as t };
