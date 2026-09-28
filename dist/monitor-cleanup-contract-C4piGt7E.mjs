import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { Fn as object, Jn as string, Lt as boolean, Nt as array, kt as _null, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { E as listAgentEntries, a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, t as compileSqliteQueryBindings } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { f as resolveSessionTranscriptsDirForAgent } from "./paths-CcMbq5NY.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { o as unregisterOpenClawAgentDatabases } from "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { n as DEFAULT_BOOTSTRAP_FILENAME } from "./workspace-bootstrap-policy-DSEIbIS8.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-BRjL0YJr.mjs";
import { a as readWorkspaceStateSnapshot, i as prepareWorkspaceStateDeletion, n as deleteWorkspaceState } from "./workspace-state-store-DTZ2RTNw.mjs";
import { c as resolveWorkspaceBootstrapStatus } from "./workspace-mlzi3k1x.mjs";
import { d as removeLegacyWorkspaceStateForReset, u as prepareLegacyWorkspaceStateReset } from "./workspace-legacy-state-6xtqRcEJ.mjs";
import { r as deleteCachedClawInstallSchemaVersion } from "./provenance-runtime-read-Di4oRDaq.mjs";
import { o as loadedCronStoreFromRows } from "./row-codec-mXerryYi.mjs";
import { t as normalizeCronJobCreate } from "./normalize-_k1oAXPq.mjs";
import { n as createTrustedCronScheduledToolPolicy } from "./scheduled-tool-policy-pqnwO5x1.mjs";
import { t as applyDefaultCronToolsAllow } from "./tools-allow-BSqnFkMT.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DtL_Z8FS.mjs";
import "./sessions-Cesa3L0p.mjs";
import { i as pruneAgentConfig } from "./agents.config-BnlRDoFW.mjs";
import { i as moveToTrash } from "./cleanup-utils-MkYk5me2.mjs";
import { i as isSystemMonitorDeclaration } from "./system-owned-declaration-CIFRO5mv.mjs";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-Ci4iwiZS.mjs";
import { a as readAgentDeleteDatabaseRegistry, o as resolveSurvivingDatabaseFilePaths, r as isPathOwnedBySurvivingAgent } from "./agent-delete-databases-CY5IIYgH.mjs";
import { t as cronJobDefinitionFromReadView } from "./job-read-view-BK1e7S7U.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
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
function schedulerJobByDeclarationKey(value, declarationKey) {
	const match = schedulerJobRecordByDeclarationKey(value, declarationKey);
	return match ? { id: match.id } : void 0;
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
				result = { id: listedJob.id };
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
			if (options.gateway.list) result = schedulerJobByDeclarationKey(await options.gateway.list(plan.agent.finalId), pending.declarationKey);
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
	const walk = async (absoluteDir, relativeDir = "") => {
		const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
		for (const entry of entries) {
			const relativeEntry = path.join(relativeDir, entry.name);
			if (entry.isDirectory() && !entry.isSymbolicLink()) {
				if (!trackedDirectories.has(path.normalize(relativeEntry))) return true;
				if (await walk(path.join(absoluteDir, entry.name), relativeEntry)) return true;
				continue;
			}
			if (!tracked.has(path.normalize(relativeEntry))) return true;
		}
		return false;
	};
	try {
		return await walk(workspaceRoot);
	} catch (error) {
		const filesystemError = error;
		return filesystemError.code !== "ENOENT" || filesystemError.path !== workspaceRoot;
	}
}
/** Applies canonical post-config filesystem cleanup and reports every failed effect. */
async function cleanupClawAgentFilesystem(params) {
	const errors = [];
	const trashPath = (pathname, runtime) => {
		params.assertCurrent();
		return params.trashPath ? params.trashPath(pathname, runtime) : moveToTrash(pathname, runtime, params.assertCurrent);
	};
	const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(readAgentDeleteDatabaseRegistry(params.stateDatabase), params.agentId, params.stateDatabase?.env);
	const sharedWithSurvivor = (pathname) => isPathOwnedBySurvivingAgent(params.nextConfig, params.agentId, pathname, survivingDatabaseFilePaths, params.stateDatabase?.env);
	if (params.targets.workspaceDir && !params.retainWorkspace && !sharedWithSurvivor(params.targets.workspaceDir)) {
		const legacyPlan = prepareLegacyWorkspaceStateReset(params.targets.workspaceDir);
		const statePlan = prepareWorkspaceStateDeletion(params.targets.workspaceDir);
		if (await trashPath(params.targets.workspaceDir, params.runtime)) try {
			const legacyCleanup = await removeLegacyWorkspaceStateForReset(legacyPlan, { assertCurrent: params.assertCurrent });
			for (const warning of legacyCleanup.warnings) params.runtime.log(warning);
			params.assertCurrent();
			await deleteWorkspaceState(statePlan, { assertCurrent: params.assertCurrent });
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
		return { state: `sha256:${createHash("sha256").update(content).digest("hex")}` === record.contentDigest ? "unchanged" : "modified" };
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
async function removeClawWorkspaceFile(record, assertCurrent, maxBytes = 1048576) {
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
		const stagedPath = `${record.path}.openclaw-claw-remove-${randomUUID()}`;
		assertCurrent();
		await workspace.move(record.path, stagedPath, { overwrite: false });
		let outcome;
		try {
			const content = await workspace.readBytes(stagedPath, { maxBytes });
			assertCurrent();
			if (`sha256:${createHash("sha256").update(content).digest("hex")}` === record.contentDigest) {
				await workspace.remove(stagedPath);
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
			await workspace.move(stagedPath, record.path, { overwrite: false });
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
function releaseClawRemoveRows(agentId, files, cleanupErrors, assertCurrent, completeDeletion, options) {
	const complete = cleanupErrors.length === 0;
	try {
		runOpenClawStateWriteTransaction((database) => {
			assertCurrent(database);
			if (complete) unregisterOpenClawAgentDatabases({
				agentId,
				env: options.env,
				database
			});
			const { db } = database;
			const query = getNodeSqliteKysely(db);
			if (tableExists(db, "claw_workspace_files")) for (const file of files.filter((candidate) => candidate.action !== "error")) executeSqliteQuerySync(db, query.deleteFrom("claw_workspace_files").where("agent_id", "=", agentId).where("target_path", "=", file.path));
			if (!complete) return;
			if (tableExists(db, "claw_package_refs")) executeSqliteQuerySync(db, query.deleteFrom("claw_package_refs").where("agent_id", "=", agentId));
			if (tableExists(db, "claw_installs")) executeSqliteQuerySync(db, query.deleteFrom("claw_installs").where("agent_id", "=", agentId));
			completeDeletion(database);
		}, options);
		if (complete) deleteCachedClawInstallSchemaVersion(agentId, options);
	} catch (error) {
		if (complete) throw error;
		cleanupErrors.push(coerceErrorMessage(error));
	}
	return complete;
}
//#endregion
//#region src/claws/monitor-cleanup-contract.ts
const text = string().min(1).max(4096);
const clawMonitorCleanupBindingSchema = object({
	configPath: text,
	statePath: text,
	cronStorePath: text
}).strict();
const clawMonitorSnapshotSchema = object({
	id: text,
	name: string(),
	enabled: boolean(),
	agentId: text,
	ownerAgentId: _null(),
	storeKey: text,
	declarationKey: text,
	revision: text
}).strict();
const clawMonitorInventorySchema = object({ monitors: array(clawMonitorSnapshotSchema).max(2) }).strict();
const clawMonitorDrainSchema = object({ drained: literal(true) }).strict();
//#endregion
export { installClawCronJobs as C, upsertClawCronRef as E, deleteClawCronRef as S, readClawCronRefs as T, CLAW_CRON_REF_SCHEMA_VERSION as _, ClawRemoveError as a, clawCronGatewayJobMatchesRef as b, deletionEffects as c, readAttachedCronJobs as d, readClawRemoveCronInventory as f, workspaceContainsUntrackedEntries as g, synthesizeOrphanInstall as h, clawMonitorSnapshotSchema as i, inspectClawBootstrap as l, removeClawWorkspaceFile as m, clawMonitorDrainSchema as n, clawRemoveQuietRuntime as o, releaseClawRemoveRows as p, clawMonitorInventorySchema as r, cleanupClawAgentFilesystem as s, clawMonitorCleanupBindingSchema as t, inspectClawWorkspaceFile as u, ClawCronInstallError as v, markClawCronRefRemoved as w, clawCronSchedulerJobFromResult as x, clawCronGatewayInput as y };
