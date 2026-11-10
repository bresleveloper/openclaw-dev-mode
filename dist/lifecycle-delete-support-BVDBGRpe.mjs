import { n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely, t as compileSqliteQueryBindings } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { d as resolveSessionTranscriptsDirForAgent } from "./paths-YgcBNLgG.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as createTrustedCronScheduledToolPolicy } from "./scheduled-tool-policy-Bjq61U8o.mjs";
import { t as applyDefaultCronToolsAllow } from "./tools-allow-BHyxEpHd.mjs";
import "./sessions-CnzPI1yx.mjs";
import { n as DEFAULT_BOOTSTRAP_FILENAME } from "./workspace-bootstrap-policy-wM0DWL3B.mjs";
import { i as pruneAgentConfig } from "./agents.config-B7znCYIL.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-ClACC-rY.mjs";
import { l as resolveWorkspaceBootstrapStatus } from "./workspace-3xrXOvoY.mjs";
import { l as prepareLegacyWorkspaceStateReset, u as removeLegacyWorkspaceStateForReset } from "./workspace-legacy-state-CUN3bghH.mjs";
import { a as readWorkspaceStateSnapshot, i as prepareWorkspaceStateDeletion, n as deleteWorkspaceState } from "./workspace-state-store-CAqLogDE.mjs";
import { r as deleteCachedClawInstallSchemaVersion } from "./provenance-runtime-read-CG_KY8mE.mjs";
import { i as isSystemMonitorDeclaration } from "./system-owned-declaration-BdxGzmHz.mjs";
import { s as loadedCronStoreFromRows } from "./row-codec-Cnnqjh5r.mjs";
import { t as normalizeCronJobCreate } from "./normalize-D_B-pqo1.mjs";
import { t as digestClawBytes } from "./digest-CI8Suvd7.mjs";
import { n as moveToTrash } from "./cleanup-utils-BtHoq0Ha.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-lawlsaMs.mjs";
import { n as cronJobDefinitionFromReadView } from "./job-read-view-BBk7z_Xr.mjs";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-C-K2bAs7.mjs";
import { c as resolveSurvivingDatabaseFilePaths, i as isPathOwnedBySurvivingAgent, s as readAgentDeleteDatabaseRegistry } from "./agent-delete-databases-CDNa7990.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { statRegularFileSync } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { root } from "@openclaw/fs-safe/root";
//#region src/claws/cron.ts
const CLAW_CRON_REF_SCHEMA_VERSION = "openclaw.clawCronRef.v1";
var ClawCronInstallError = class extends Error {
	constructor(code, message, cronJobs) {
		super(message);
		this.code = code;
		this.cronJobs = cronJobs;
		this.name = "ClawCronInstallError";
	}
};
function rowToRef(row) {
	return {
		schemaVersion: CLAW_CRON_REF_SCHEMA_VERSION,
		agentId: row.agent_id,
		manifestId: row.manifest_id,
		declarationKey: row.declaration_key,
		...row.scheduler_job_id ? { schedulerJobId: row.scheduler_job_id } : {},
		status: row.status,
		job: JSON.parse(row.job_json),
		...row.error ? { error: row.error } : {},
		createdAtMs: coerceRequiredSqliteNumber(row.created_at_ms),
		updatedAtMs: coerceRequiredSqliteNumber(row.updated_at_ms)
	};
}
function refToRow(ref) {
	return {
		schema_version: ref.schemaVersion,
		agent_id: ref.agentId,
		manifest_id: ref.manifestId,
		declaration_key: ref.declarationKey,
		scheduler_job_id: ref.schedulerJobId ?? null,
		status: ref.status,
		job_json: JSON.stringify(ref.job),
		error: ref.error ?? null,
		created_at_ms: ref.createdAtMs,
		updated_at_ms: ref.updatedAtMs
	};
}
function persistPendingRef(plan, job, options) {
	const nowMs = options.nowMs ?? Date.now();
	const declarationKey = `claw:${plan.agent.finalId}:${job.id}`;
	const database = openOpenClawStateDatabase(options);
	const query = getNodeSqliteKysely(database.db).selectFrom("claw_cron_refs").selectAll().where("agent_id", "=", plan.agent.finalId).where("manifest_id", "=", job.id).compile();
	const existing = database.db.prepare(query.sql).get(...query.parameters);
	if (existing) {
		const ref = rowToRef(existing);
		if (ref.declarationKey !== declarationKey || JSON.stringify(ref.job) !== JSON.stringify(job)) throw new ClawCronInstallError("cron_provenance_conflict", `Cron declaration ${JSON.stringify(job.id)} differs from its pending ownership record.`, [ref]);
		if (ref.status === "complete") return ref;
		return updateRef(ref, { status: "pending" }, options);
	}
	const record = {
		schemaVersion: CLAW_CRON_REF_SCHEMA_VERSION,
		agentId: plan.agent.finalId,
		manifestId: job.id,
		declarationKey,
		status: "pending",
		job,
		createdAtMs: nowMs,
		updatedAtMs: nowMs
	};
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("claw_cron_refs").values(refToRow(record)));
	}, options);
	return record;
}
function updateRef(ref, update, options) {
	const { schedulerJobId: _schedulerJobId, error: _error, ...retained } = ref;
	const updated = {
		...retained,
		...update,
		updatedAtMs: options.nowMs ?? Date.now()
	};
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("claw_cron_refs").set({
			scheduler_job_id: updated.schedulerJobId ?? null,
			status: updated.status,
			error: updated.error ?? null,
			updated_at_ms: updated.updatedAtMs
		}).where("agent_id", "=", ref.agentId).where("manifest_id", "=", ref.manifestId));
	}, options);
	return updated;
}
function clawCronSchedulerJobFromResult(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	if (typeof record.id === "string" && record.id) return { id: record.id };
	const job = record.job;
	if (job && typeof job === "object" && typeof job.id === "string") return { id: job.id };
}
function schedulerJobRecordByDeclarationKey(value, declarationKey) {
	if (!value || typeof value !== "object") return;
	const jobs = value.jobs;
	if (!Array.isArray(jobs)) return;
	const matches = jobs.filter((job) => Boolean(job) && typeof job === "object" && job.declarationKey === declarationKey && typeof job.id === "string");
	return matches.length === 1 ? matches[0] : void 0;
}
function clawCronGatewayInput(agentId, ref) {
	const job = ref.job;
	return {
		name: job.name ?? job.id,
		declarationKey: ref.declarationKey,
		...job.name ? { displayName: job.name } : {},
		owner: { agentId },
		enabled: true,
		agentId,
		schedule: {
			kind: "cron",
			expr: job.schedule.cron,
			...job.schedule.timezone ? { tz: job.schedule.timezone } : {}
		},
		sessionTarget: job.session === "main" ? `session:agent:${agentId}:main` : job.session,
		wakeMode: "now",
		payload: {
			kind: "agentTurn",
			message: job.message
		},
		delivery: job.delivery ? {
			mode: job.delivery.mode,
			...job.delivery.channel ? { channel: job.delivery.channel } : {}
		} : { mode: "none" }
	};
}
function clawCronGatewayJobMatchesRef(agentId, ref, value) {
	if (!value || typeof value !== "object") return false;
	const live = cronJobDefinitionFromReadView(value);
	const expected = normalizeCronJobCreate(clawCronGatewayInput(agentId, ref));
	if (!expected || typeof live.id !== "string" || typeof live.createdAtMs !== "number" || typeof live.updatedAtMs !== "number" || !live.state) return false;
	const comparableLive = {
		...live,
		payload: { ...live.payload }
	};
	applyDefaultCronToolsAllow(expected);
	applyDefaultCronToolsAllow(comparableLive);
	const expectedWithPolicy = {
		...expected,
		...comparableLive.scheduledToolPolicy ? { scheduledToolPolicy: createTrustedCronScheduledToolPolicy() } : {}
	};
	try {
		return resolveCronJobConfigRevision({
			...expectedWithPolicy,
			id: live.id,
			createdAtMs: live.createdAtMs,
			updatedAtMs: live.updatedAtMs,
			state: live.state
		}) === resolveCronJobConfigRevision(comparableLive);
	} catch {
		return false;
	}
}
async function installClawCronJobs(plan, options = {}) {
	const actions = plan.actions.filter((action) => action.kind === "cronJob");
	if (actions.length === 0) return [];
	if (!options.gateway) throw new ClawCronInstallError("cron_gateway_required", "Claw automations require the gateway-owned cron.add API.", []);
	const refs = [];
	let agentAvailable = false;
	for (const action of actions) {
		const details = action.details;
		if (!details?.id) throw new ClawCronInstallError("cron_plan_invalid", `Cron action ${action.id} is invalid.`, refs);
		const pending = persistPendingRef(plan, {
			id: details.id,
			...details.name ? { name: details.name } : {},
			schedule: details.schedule,
			session: details.session,
			message: details.message,
			...details.delivery ? { delivery: details.delivery } : {}
		}, options);
		refs.push(pending);
		let result;
		if (pending.status === "complete" && pending.schedulerJobId) {
			if (!options.gateway.list) continue;
			if (!agentAvailable) {
				await options.gateway.waitUntilAgentAvailable?.(plan.agent.finalId);
				agentAvailable = true;
			}
			const listedJob = schedulerJobRecordByDeclarationKey(await options.gateway.list(plan.agent.finalId), pending.declarationKey);
			if (listedJob) {
				if (!clawCronGatewayJobMatchesRef(plan.agent.finalId, pending, listedJob)) throw new ClawCronInstallError("cron_reconcile_conflict", `Cron declaration ${JSON.stringify(pending.manifestId)} changed after installation.`, refs);
				result = listedJob;
				if (result.id !== pending.schedulerJobId) refs[refs.length - 1] = updateRef(pending, {
					status: "complete",
					schedulerJobId: result.id
				}, options);
				continue;
			}
			throw new ClawCronInstallError("cron_reconcile_conflict", `Cron declaration ${JSON.stringify(pending.manifestId)} is missing; remove and add the Claw again to recreate it safely.`, refs);
		}
		try {
			if (!agentAvailable) {
				await options.gateway.waitUntilAgentAvailable?.(plan.agent.finalId);
				agentAvailable = true;
			}
			if (options.gateway.list) result = schedulerJobRecordByDeclarationKey(await options.gateway.list(plan.agent.finalId), pending.declarationKey);
			result ??= clawCronSchedulerJobFromResult(await options.gateway.add(clawCronGatewayInput(plan.agent.finalId, pending)));
			if (!result) throw new Error("cron.add returned no scheduler job id");
		} catch (error) {
			const message = coerceErrorMessage(error);
			refs[refs.length - 1] = updateRef(pending, {
				status: "pending",
				error: message
			}, options);
			throw new ClawCronInstallError("cron_install_failed", message, refs);
		}
		try {
			refs[refs.length - 1] = updateRef(pending, {
				status: "complete",
				schedulerJobId: result.id
			}, options);
		} catch (error) {
			throw new ClawCronInstallError("cron_provenance_failed", `cron.add succeeded, but its scheduler id could not be persisted: ${coerceErrorMessage(error)}`, refs);
		}
	}
	return refs;
}
function readClawCronRefs(agentId, options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (options.readOnly && !database.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'claw_cron_refs'").get()) return [];
	const query = getNodeSqliteKysely(database.db).selectFrom("claw_cron_refs").selectAll().where("agent_id", "=", agentId).orderBy("manifest_id").compile();
	return database.db.prepare(query.sql).all(...query.parameters).map(rowToRef);
}
function deleteClawCronRef(agentId, manifestId, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("claw_cron_refs").where("agent_id", "=", agentId).where("manifest_id", "=", manifestId));
	}, options);
}
function markClawCronRefRemoved(agentId, manifestId, options = {}) {
	const ref = readClawCronRefs(agentId, options).find((candidate) => candidate.manifestId === manifestId);
	return ref ? updateRef(ref, { status: "removed" }, options) : void 0;
}
function upsertClawCronRef(ref, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("claw_cron_refs").values(refToRow(ref)).onConflict((conflict) => conflict.columns(["agent_id", "manifest_id"]).doUpdateSet((eb) => ({
			schema_version: eb.ref("excluded.schema_version"),
			declaration_key: eb.ref("excluded.declaration_key"),
			scheduler_job_id: eb.ref("excluded.scheduler_job_id"),
			status: eb.ref("excluded.status"),
			job_json: eb.ref("excluded.job_json"),
			error: eb.ref("excluded.error"),
			updated_at_ms: eb.ref("excluded.updated_at_ms")
		}))));
	}, options);
}
//#endregion
//#region src/claws/lifecycle-delete-support.ts
var ClawRemoveError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "ClawRemoveError";
	}
};
function synthesizeOrphanInstall(params) {
	const updatedAtMs = params.updatedAtMs ?? 0;
	return {
		schemaVersion: "openclaw.clawInstallRecord.v1",
		claw: {
			kind: "development",
			name: params.clawName ?? `orphan:${params.agentId}`,
			version: "0.0.0",
			packageRoot: "",
			manifestPath: "",
			integrityKind: "development-snapshot",
			integrity: "sha256:orphan",
			byteLength: 0
		},
		manifestSchemaVersion: 1,
		planIntegrity: "sha256:orphan",
		agentId: params.agentId,
		workspace: params.workspace ?? "",
		agentConfigDigest: "sha256:missing",
		agentOrigin: "created",
		agentOwnedPaths: [],
		status: "partial",
		addedAtMs: updatedAtMs,
		updatedAtMs
	};
}
function deletionEffects(config, agentId, fallbackWorkspace = "", env) {
	const agent = listAgentEntries(config).find((candidate) => candidate.id === agentId);
	const pruned = pruneAgentConfig(config, agentId);
	const workspace = agent?.workspace ?? fallbackWorkspace;
	return {
		pruned,
		workspace,
		agentDir: resolveAgentDir(config, agentId, env),
		sessionsDir: resolveSessionTranscriptsDirForAgent(agentId, env),
		workspaceSharedWith: workspace ? findOverlappingWorkspaceAgentIds(config, agentId, workspace, env) : []
	};
}
/** Inventories cron jobs that would retain a reference to a removed agent. */
function readAttachedCronJobs(agentId, options) {
	const { db } = openOpenClawStateDatabase(options);
	if (!tableExists(db, "cron_jobs")) return [];
	const { compiled, bind } = compileSqliteQueryBindings((parameter) => {
		const boundAgentId = parameter((value) => value);
		return getNodeSqliteKysely(db).selectFrom("cron_jobs").selectAll().where((eb) => eb.or([eb("agent_id", "=", boundAgentId), eb("owner_agent_id", "=", boundAgentId)])).orderBy("job_id").orderBy("store_key");
	});
	return db.prepare(compiled.sql).all(...bind(agentId)).map((row) => {
		const job = loadedCronStoreFromRows([row]).store.jobs[0];
		return {
			id: row.job_id,
			name: row.name,
			enabled: row.enabled === 1,
			agentId: row.agent_id,
			ownerAgentId: row.owner_agent_id,
			storeKey: row.store_key,
			declarationKey: row.declaration_key,
			revision: job ? resolveCronJobConfigRevision(job) : void 0
		};
	});
}
/** Offline preview keeps local blockers; only a serving owner can make a monitor removable. */
async function readClawRemoveCronInventory(agentId, options) {
	let attachedJobs = readAttachedCronJobs(agentId, options);
	let monitors = [];
	let inspectionUnavailable = false;
	if (attachedJobs.some((job) => isSystemMonitorDeclaration(job.declarationKey ?? void 0))) {
		inspectionUnavailable = true;
		if (options.monitorGateway) {
			try {
				monitors = await options.monitorGateway.inspect(agentId);
				inspectionUnavailable = false;
			} catch {}
			attachedJobs = readAttachedCronJobs(agentId, options);
		}
	}
	return {
		attachedJobs,
		monitors,
		inspectionUnavailable
	};
}
/** Returns true when removing a workspace would discard anything outside Claw provenance. */
async function workspaceContainsUntrackedEntries(workspaceRoot, trackedPaths) {
	const tracked = new Set(trackedPaths.map((entry) => path.normalize(entry)));
	const trackedDirectories = /* @__PURE__ */ new Set();
	for (const trackedPath of tracked) {
		let parent = path.dirname(trackedPath);
		while (parent && parent !== ".") {
			trackedDirectories.add(parent);
			const next = path.dirname(parent);
			if (next === parent) break;
			parent = next;
		}
	}
	try {
		await fs.stat(workspaceRoot);
		const workspace = await root(workspaceRoot);
		for await (const entry of workspace.walk("", { symlinkPolicy: "include" })) if (!(entry.kind === "directory" ? trackedDirectories : tracked).has(path.normalize(entry.relativePath))) return true;
		return false;
	} catch (error) {
		const filesystemError = error;
		return filesystemError.code !== "ENOENT" || filesystemError.path !== workspaceRoot;
	}
}
/** Applies canonical post-config filesystem cleanup and reports every failed effect. */
async function cleanupClawAgentFilesystem(params) {
	const errors = [];
	const { deletion } = params;
	const trashPath = (pathname, runtime) => {
		if (params.trashPath) {
			deletion.assertCurrentFinal();
			return params.trashPath(pathname, runtime, deletion.assertCurrentFinal);
		}
		return moveToTrash(pathname, runtime, deletion.assertCurrentFinal);
	};
	const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(await readAgentDeleteDatabaseRegistry(params.stateDatabase), params.agentId, params.stateDatabase?.env);
	const sharedWithSurvivor = (pathname) => isPathOwnedBySurvivingAgent(params.nextConfig, params.agentId, pathname, survivingDatabaseFilePaths, params.stateDatabase?.env);
	if (params.targets.workspaceDir && !params.retainWorkspace && !sharedWithSurvivor(params.targets.workspaceDir)) {
		const legacyPlan = prepareLegacyWorkspaceStateReset(params.targets.workspaceDir);
		const statePlan = prepareWorkspaceStateDeletion(params.targets.workspaceDir);
		if (await trashPath(params.targets.workspaceDir, params.runtime)) try {
			const legacyCleanup = await removeLegacyWorkspaceStateForReset(legacyPlan, { assertCurrent: deletion.assertCurrentFinal });
			for (const warning of legacyCleanup.warnings) params.runtime.log(warning);
			await deletion.assertCurrentAsync();
			await deleteWorkspaceState(statePlan, {
				...params.stateDatabase,
				deletion
			});
		} catch (error) {
			errors.push(coerceErrorMessage(error));
		}
		else errors.push(`Could not trash workspace ${params.targets.workspaceDir}.`);
	}
	if (!sharedWithSurvivor(params.targets.agentDir) && !await trashPath(params.targets.agentDir, params.runtime)) errors.push(`Could not trash agent state ${params.targets.agentDir}.`);
	if (!sharedWithSurvivor(params.targets.sessionsDir) && !await trashPath(params.targets.sessionsDir, params.runtime)) errors.push(`Could not trash session transcripts ${params.targets.sessionsDir}.`);
	return errors;
}
const clawRemoveQuietRuntime = {
	log: (..._args) => void 0,
	error: (..._args) => void 0,
	exit: (code) => {
		throw new Error(`Unexpected exit during Claw removal cleanup: ${code ?? 1}`);
	}
};
async function inspectDigestOwnedWorkspaceFile(record, maxBytes = 1048576) {
	try {
		const workspace = await root(record.workspace, {
			hardlinks: "reject",
			maxBytes,
			symlinks: "reject"
		});
		if (!await workspace.exists(record.path)) return { state: "missing" };
		const content = await workspace.readBytes(record.path, { maxBytes });
		return { state: digestClawBytes(content) === record.contentDigest ? "unchanged" : "modified" };
	} catch (error) {
		if (error.code === "ENOENT") return { state: "missing" };
		return {
			state: "unsafe",
			message: coerceErrorMessage(error)
		};
	}
}
async function inspectClawWorkspaceFile(record) {
	return {
		...record,
		...await inspectDigestOwnedWorkspaceFile(record)
	};
}
async function inspectClawBootstrap(install, options) {
	const nativeState = await resolveWorkspaceBootstrapStatus(install.workspace, options);
	const setupState = (await readWorkspaceStateSnapshot(install.workspace, options)).setup;
	const base = {
		workspace: install.workspace,
		path: DEFAULT_BOOTSTRAP_FILENAME,
		...install.bootstrap
	};
	const nativeBootstrapConsumed = typeof setupState.setupCompletedAt === "string" || typeof setupState.bootstrapSeededAt === "string";
	if (nativeState === "complete" && (!install.bootstrap || nativeBootstrapConsumed)) return {
		...base,
		state: "complete"
	};
	if (!install.bootstrap) return {
		...base,
		state: nativeState
	};
	const bootstrapSeedingPending = install.status === "pending" || install.status === "partial" || install.status === "workspace_ready";
	if (bootstrapSeedingPending) try {
		await fs.lstat(install.workspace);
	} catch (error) {
		if (error.code === "ENOENT") return {
			...base,
			state: "missing"
		};
	}
	const inspected = await inspectDigestOwnedWorkspaceFile({
		workspace: install.workspace,
		path: DEFAULT_BOOTSTRAP_FILENAME,
		contentDigest: install.bootstrap.contentDigest
	}, MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES);
	if (inspected.state === "unchanged") return {
		...base,
		state: "pending"
	};
	if (inspected.state === "modified" || inspected.state === "unsafe") return {
		...base,
		state: inspected.state,
		...inspected.message ? { message: inspected.message } : {}
	};
	if (bootstrapSeedingPending) return {
		...base,
		state: "missing"
	};
	return {
		...base,
		state: "unknown",
		message: "BOOTSTRAP.md disappeared during inspection."
	};
}
async function removeClawWorkspaceFile(record, deletion, maxBytes = 1048576) {
	if (record.state === "missing") return {
		path: record.path,
		action: "missing"
	};
	if (record.state === "modified") return {
		path: record.path,
		action: "retainedModified"
	};
	try {
		const workspace = await root(record.workspace, {
			hardlinks: "reject",
			maxBytes,
			symlinks: "reject"
		});
		if (!await workspace.exists(record.path)) return {
			path: record.path,
			action: "missing"
		};
		const moveFile = (source, target, restoring = false) => workspace.move(source, target, {
			overwrite: false,
			assertBeforeMutation: () => {
				if (!restoring) deletion.assertCurrentFinal();
				if (statRegularFileSync(path.join(workspace.rootReal, source)).missing) throw new Error("Claw workspace file no longer exists");
			}
		});
		const stagedPath = `${record.path}.openclaw-claw-remove-${randomUUID()}`;
		await moveFile(record.path, stagedPath);
		let outcome;
		try {
			const content = await workspace.readBytes(stagedPath, { maxBytes });
			deletion.assertCurrentFinal();
			if (digestClawBytes(content) === record.contentDigest) {
				await workspace.remove(stagedPath, { assertBeforeMutation: deletion.assertCurrentFinal });
				return {
					path: record.path,
					action: "deleted"
				};
			}
			outcome = ok(void 0);
		} catch (error) {
			outcome = err(error);
		}
		try {
			await moveFile(stagedPath, record.path, true);
		} catch (error) {
			throw new AggregateError([...outcome.ok ? [] : [outcome.error], error], `Could not restore ${record.path} from ${stagedPath}: ${String(error)}`, { cause: error });
		}
		if (!outcome.ok) throw outcome.error;
		return {
			path: record.path,
			action: "retainedModified"
		};
	} catch (error) {
		return {
			path: record.path,
			action: "error",
			message: error instanceof FsSafeError ? `${error.code}: ${error.message}` : String(error)
		};
	}
}
async function releaseClawRemoveRows(deletion, files, cleanupErrors, options) {
	const complete = cleanupErrors.length === 0;
	try {
		await deletion.releaseClawRows({
			files,
			complete
		});
		if (complete) deleteCachedClawInstallSchemaVersion(deletion.entry.agentId, options);
	} catch (error) {
		if (complete) throw error;
		cleanupErrors.push(coerceErrorMessage(error));
	}
	return complete;
}
//#endregion
export { upsertClawCronRef as S, clawCronSchedulerJobFromResult as _, inspectClawBootstrap as a, markClawCronRefRemoved as b, readClawRemoveCronInventory as c, synthesizeOrphanInstall as d, workspaceContainsUntrackedEntries as f, clawCronGatewayJobMatchesRef as g, clawCronGatewayInput as h, deletionEffects as i, releaseClawRemoveRows as l, ClawCronInstallError as m, clawRemoveQuietRuntime as n, inspectClawWorkspaceFile as o, CLAW_CRON_REF_SCHEMA_VERSION as p, cleanupClawAgentFilesystem as r, readAttachedCronJobs as s, ClawRemoveError as t, removeClawWorkspaceFile as u, deleteClawCronRef as v, readClawCronRefs as x, installClawCronJobs as y };
