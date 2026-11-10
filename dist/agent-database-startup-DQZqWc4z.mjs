import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { d as sleepWithAbort, o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as withAgentDatabasePreparationContext } from "./agent-database-preparation-context-DK375nya.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { s as getOrLoadSqliteDatabaseAdmissionForPath, v as prepareSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { _ as schemaAdmission } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { r as readSqliteIntegrityFileIdentity } from "./sqlite-file-generation-Cmk6kG35.mjs";
import { _ as withSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as isSameOpenClawAgentDatabasePath, n as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import "./worker-task-pool-D6ogd941.mjs";
import "./session-key-CSDERtm3.mjs";
import { o as readAgentDeletionJournalStatusInWorker } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { _ as readAgentDatabaseAdmissionRefusal, c as createAgentDatabaseInspectionRefusal, g as preparePendingAgentDatabase, m as listAgentDatabaseAdmissionRefusals, u as failPendingAgentDatabase } from "./agent-database-admission-CeDA0ojh.mjs";
import "./backoff-N5Hi0doU.mjs";
import { t as retryAsync } from "./retry-DwDRpCWu.mjs";
import { t as createPermitPool } from "./permit-pool-DWNEROq5.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/agent-database-startup.ts
const PREPARATION_PROGRESS_INTERVAL_MS = 6e4;
const STARTUP_PUBLICATION_ATTEMPTS = 4;
function recoveryTiming(recovery, now = performance.now()) {
	return {
		elapsedMs: Math.round(now - recovery.startedAt),
		phaseDurationsMs: {
			...recovery.phaseDurationsMs,
			[recovery.phase]: Math.round((recovery.phaseDurationsMs[recovery.phase] ?? 0) + now - recovery.phaseStartedAt)
		}
	};
}
function matchesInspectionPath(paths, target, samePath = isSameOpenClawAgentDatabasePath) {
	return paths.some((pathname) => {
		try {
			return samePath(pathname, target);
		} catch {
			return false;
		}
	});
}
const log = createSubsystemLogger("state/agent-admission");
const startupAdmission = new AsyncLocalStorage();
var AgentDatabaseStartupSupersededError = class extends Error {
	constructor(agentId, subject) {
		super(`Agent ${agentId} ${subject} preparation was superseded`);
		this.name = "AgentDatabaseStartupSupersededError";
	}
};
/** Startup owns readers until the Gateway adopts them; only the Gateway activates agents. */
var AgentDatabaseStartupAdmission = class {
	constructor(deferInspections = true) {
		this.deferInspections = deferInspections;
		this.controller = new AbortController();
		this.activation = createDeferredCore();
		this.work = /* @__PURE__ */ new Set();
		this.pending = /* @__PURE__ */ new Map();
		this.adopted = false;
		this.activated = false;
		this.stopped = false;
		this.publication = Promise.resolve();
		this.opening = createPermitPool(2);
		this.migrating = createPermitPool(4);
		this.journalReads = createPermitPool(8);
	}
	get signal() {
		return this.controller.signal;
	}
	get isStopped() {
		return this.stopped;
	}
	startProgress() {
		this.progressTimer ??= setInterval(() => {
			const now = performance.now();
			for (const [agentId, recovery] of this.pending) log.warn("agent database startup preparation still running", {
				agentId,
				phase: recovery.phase,
				elapsedMs: Math.round(now - recovery.startedAt),
				phaseElapsedMs: Math.round(now - recovery.phaseStartedAt),
				...recovery.phase === "publication-wait" ? { publishingAgentId: this.publishingAgentId } : {}
			});
		}, PREPARATION_PROGRESS_INTERVAL_MS);
		this.progressTimer.unref();
	}
	clearProgress() {
		clearInterval(this.progressTimer);
		this.progressTimer = void 0;
	}
	/** Bootstrap reuses this startup's compatibility headers; writable opens retain admission. */
	prepareSchemaHeaders(env) {
		const prepared = {
			statePath: resolveOpenClawStateSqlitePath(env),
			headers: /* @__PURE__ */ new Map()
		};
		this.preparedSchemaHeaders = prepared;
		return (pathname) => {
			return ({ version, writerAppVersion, agentSchemaMeta }) => {
				if (!this.stopped && this.preparedSchemaHeaders === prepared && version === 27) prepared.headers.set(pathname, {
					version,
					writerAppVersion,
					agentSchemaMeta
				});
			};
		};
	}
	takePreparedSchemaHeaders(env) {
		const prepared = this.preparedSchemaHeaders;
		this.preparedSchemaHeaders = void 0;
		return (pathname, supportedVersion) => {
			const header = prepared?.headers.get(pathname);
			return !this.stopped && prepared?.statePath === resolveOpenClawStateSqlitePath(env) && header?.version === supportedVersion ? header : void 0;
		};
	}
	recordStateSchemaPreparation(env) {
		const prepared = this.preparedSchemaHeaders;
		if (this.stopped || prepared?.statePath !== resolveOpenClawStateSqlitePath(env)) return;
		const schema = getOrLoadSqliteDatabaseAdmissionForPath(prepared.statePath, schemaAdmission, () => void 0);
		const identity = prepareSqliteDatabaseAdmission(prepared.statePath);
		if (schema && identity) prepared.state = {
			identity,
			schemaAdmissionId: schema.admissionId
		};
	}
	takePreparedStateSchema(env) {
		const prepared = this.preparedSchemaHeaders;
		const state = prepared?.state;
		if (!prepared || !state || prepared.statePath !== resolveOpenClawStateSqlitePath(env)) return;
		const assertCurrent = () => {
			const schema = getOrLoadSqliteDatabaseAdmissionForPath(prepared.statePath, schemaAdmission, () => void 0);
			if (this.stopped || prepareSqliteDatabaseAdmission(prepared.statePath) !== state.identity || schema?.admissionId !== state.schemaAdmissionId) throw new Error("Prepared startup state schema changed before source inspection");
		};
		try {
			assertCurrent();
			return assertCurrent;
		} catch {
			return;
		}
	}
	/** Joins startup work already scheduled before a background consumer begins. */
	get pendingPreparation() {
		return this.work.size > 0 ? Promise.allSettled(this.work) : void 0;
	}
	get hasPendingAgents() {
		return this.pending.size > 0;
	}
	/** Join only the current agent preparation, without holding channel startup or healthy agents. */
	waitForAgentPreparation(agentId, options = {}) {
		const pending = this.pending.get(normalizeAgentId(agentId));
		if (!pending || readAgentDatabaseAdmissionRefusal(agentId, options) !== pending.refusal) return;
		return racePromiseWithAbortSignal(pending.completion, options.signal ? AbortSignal.any([this.signal, options.signal]) : this.signal);
	}
	track(work) {
		this.work.add(work);
		work.then(() => this.work.delete(work), () => this.work.delete(work));
	}
	scheduling(env, runtimePaths, runtimeAgentIds) {
		const samePath = createOpenClawAgentDatabasePathMatcher();
		return {
			signal: this.signal,
			canDefer: (target) => this.deferInspections && target.agentId !== void 0 && runtimeAgentIds.has(target.agentId) && matchesInspectionPath(runtimePaths, target.path, samePath),
			track: (work) => this.track(work),
			defer: (inspections, reason) => this.defer({
				env,
				inspections,
				reason
			})
		};
	}
	recordInspectionFailure(target, inspection, error) {
		this.signal.throwIfAborted();
		if (!target.agentId) return false;
		(inspection.agentRefusals ??= []).push(createAgentDatabaseInspectionRefusal({
			agentId: target.agentId,
			paths: [target.path],
			reason: formatErrorMessage(error),
			cause: error
		}));
		return true;
	}
	captureRefusals(env) {
		return new Map(listAgentDatabaseAdmissionRefusals({ env }).filter((refusal) => this.pending.get(refusal.agentId)?.refusal === refusal).map((refusal) => [refusal.agentId, refusal]));
	}
	reuseRefusal(target, inspection, priorRefusals) {
		const refusal = target.agentId && priorRefusals?.get(target.agentId);
		if (!refusal || !matchesInspectionPath(refusal.paths, target.path)) return false;
		(inspection.agentRefusals ??= []).push(refusal);
		return true;
	}
	defer(params) {
		this.signal.throwIfAborted();
		const env = cloneEnvWithPlatformSemantics(params.env);
		const grouped = /* @__PURE__ */ new Map();
		for (const inspection of params.inspections) {
			const agentId = inspection.target.agentId;
			if (!agentId) throw new Error(`Cannot defer a database without an agent owner: ${inspection.target.path}`);
			grouped.set(agentId, [...grouped.get(agentId) ?? [], inspection]);
		}
		const refusals = [];
		for (const [agentId, inspections] of grouped) {
			const paths = [...new Set(inspections.map(({ target }) => target.path))];
			const refusal = createAgentDatabaseInspectionRefusal({
				agentId,
				paths,
				pending: true,
				reason: `Agent ${agentId} has not completed startup inspection and preparation. ${params.reason}`
			});
			const startedAt = performance.now();
			const completion = createDeferredCore();
			const recovery = {
				refusal,
				completion: completion.promise,
				startedAt,
				phase: "inspection",
				phaseStartedAt: startedAt,
				phaseDurationsMs: {}
			};
			const phase = (name) => {
				const now = performance.now();
				recovery.phaseDurationsMs = recoveryTiming(recovery, now).phaseDurationsMs;
				recovery.phase = name;
				recovery.phaseStartedAt = now;
			};
			this.pending.set(agentId, recovery);
			this.startProgress();
			refusals.push(refusal);
			log.info(refusal.reason, {
				agentId,
				paths
			});
			const witnesses = paths.map((pathname) => {
				try {
					return {
						pathname,
						identity: readSqliteIntegrityFileIdentity(pathname)
					};
				} catch (error) {
					return {
						pathname,
						error
					};
				}
			});
			const checked = Promise.allSettled(inspections.map(({ result }) => result));
			const work = runInDetachedAsyncContext(async () => {
				const publicationComplete = createDeferredCore();
				const preparation = {};
				try {
					const results = await checked;
					phase("activation");
					const activation = await this.activation.promise;
					if (!activation || this.stopped) return;
					const assertCurrent = () => {
						this.signal.throwIfAborted();
						if (!activation.isCurrent() || this.pending.get(agentId) !== recovery) throw new Error(`Gateway no longer owns preparation for agent ${agentId}`);
						for (const witness of witnesses) {
							if (!witness.identity) throw witness.error;
							readSqliteIntegrityFileIdentity(witness.pathname, witness.identity);
						}
					};
					const assertNotDeleted = async () => {
						const deletion = await retryAsync(async () => {
							const release = await this.journalReads.acquire({ signal: this.signal });
							try {
								assertCurrent();
								return await readAgentDeletionJournalStatusInWorker(agentId, { env }, this.signal);
							} finally {
								release?.();
							}
						}, {
							attempts: 4,
							minDelayMs: 500,
							maxDelayMs: 8e3,
							jitter: .2,
							sleep: (ms) => sleepWithAbort(ms, this.signal),
							shouldRetry: (error) => error instanceof WorkerTaskError && error.code === "overloaded"
						});
						assertCurrent();
						if (deletion !== "absent") throw new Error(`Agent ${agentId} was deleted during startup inspection`);
					};
					assertCurrent();
					for (const result of results) {
						if (result.status === "rejected") throw result.reason;
						const inspection = result.value;
						if (inspection.incompatible.length || inspection.indeterminate.length || inspection.agentRefusals?.length || inspection.pendingMigrations?.length) throw new Error(inspection.agentRefusals?.map((entry) => entry.reason).join("; ") || inspection.indeterminate.map((entry) => entry.reason).join("; ") || `Agent ${agentId} database requires Doctor before preparation`);
					}
					phase("readiness");
					await racePromiseWithAbortSignal(activation.preparationReady, this.signal);
					assertCurrent();
					await withSqliteReadOnlyWorkerScope(async () => {
						await assertNotDeleted();
						await preparePendingAgentDatabase(refusal, {
							env,
							assertCurrent
						}, async () => {
							const input = {
								agentId,
								paths,
								env,
								signal: this.signal,
								assertCurrent,
								phase
							};
							const retryLockedPreparation = async (run) => {
								let preparationAttempts = 0;
								await retryAsync(async () => {
									if (preparationAttempts++ > 0) await assertNotDeleted();
									assertCurrent();
									await run();
								}, {
									attempts: 4,
									minDelayMs: 500,
									maxDelayMs: 8e3,
									jitter: .2,
									sleep: (ms) => sleepWithAbort(ms, this.signal),
									shouldRetry: isSqliteLockError,
									onRetry: ({ attempt }) => log.warn("agent database startup locked; retrying preparation", {
										agentId,
										phase: recovery.phase,
										attempt
									})
								});
							};
							await retryLockedPreparation(async () => {
								phase("open-wait");
								const release = await this.opening.acquire({ signal: this.signal });
								try {
									assertCurrent();
									phase("open");
									await activation.openAgent(input);
								} finally {
									release?.();
								}
							});
							await retryLockedPreparation(async () => {
								phase("migration-wait");
								const releaseMigration = await this.migrating.acquire({ signal: this.signal });
								try {
									assertCurrent();
									phase("migration");
									const migrated = await activation.migrateAgent(input);
									preparation.maintenance = migrated ? migrated.maintain : void 0;
								} finally {
									releaseMigration?.();
								}
							});
							phase("publication-wait");
							const previous = this.publication;
							this.publication = publicationComplete.promise;
							await previous;
							assertCurrent();
							this.publishingAgentId = agentId;
							for (let attempt = 1;; attempt++) try {
								await activation.publishAgent(input);
								break;
							} catch (error) {
								if (!(error instanceof AgentDatabaseStartupSupersededError) || attempt >= STARTUP_PUBLICATION_ATTEMPTS) throw error;
								log.warn("agent database startup preparation was superseded; retrying", {
									agentId,
									attempt
								});
								await assertNotDeleted();
							}
							phase("publication");
							await assertNotDeleted();
						});
					}, {
						signal: this.signal,
						deadlineOwnedByCaller: true
					});
					log.info("agent database recovered after background inspection and preparation", {
						agentId,
						paths,
						...recoveryTiming(recovery)
					});
				} catch (error) {
					if (!this.stopped) {
						const reason = formatErrorMessage(error);
						failPendingAgentDatabase(refusal, error, { env });
						log.warn("agent database remains degraded", {
							agentId,
							paths,
							reason,
							repairHint: readAgentDatabaseAdmissionRefusal(agentId, { env })?.repairHint,
							...recoveryTiming(recovery)
						});
					}
				} finally {
					if (this.pending.get(agentId) === recovery) this.pending.delete(agentId);
					if (this.pending.size === 0) this.clearProgress();
					if (this.publishingAgentId === agentId) this.publishingAgentId = void 0;
					publicationComplete.resolve();
					completion.resolve();
				}
				if (!readAgentDatabaseAdmissionRefusal(agentId, { env }) && !this.stopped) try {
					await preparation.maintenance?.();
				} catch (error) {
					if (!this.stopped) log.warn("agent database background maintenance failed", {
						agentId,
						reason: formatErrorMessage(error)
					});
				}
			});
			this.track(work);
		}
		return refusals;
	}
	adopt() {
		this.signal.throwIfAborted();
		if (this.adopted) throw new Error("Agent database startup admission already belongs to a Gateway");
		this.adopted = true;
		return { stop: () => this.stop() };
	}
	activate(activation) {
		if (!this.adopted || this.stopped || this.activated) return;
		this.activated = true;
		this.activation.resolve(activation);
	}
	async releaseStartup() {
		if (!this.adopted) await this.stop();
	}
	stop() {
		return this.stopping ??= (async () => {
			this.stopped = true;
			this.clearProgress();
			this.preparedSchemaHeaders = void 0;
			this.controller.abort(/* @__PURE__ */ new Error("Gateway stopped during agent database inspection"));
			this.activation.resolve(void 0);
			while (this.work.size > 0) await Promise.allSettled(this.work);
		})();
	}
};
function getAgentDatabaseStartupAdmission() {
	const scope = startupAdmission.getStore();
	return scope?.isStopped ? void 0 : scope;
}
async function withAgentDatabaseStartupAdmission(run, options = {}) {
	const admission = getAgentDatabaseStartupAdmission() ?? new AgentDatabaseStartupAdmission(options.deferInspections);
	try {
		return await startupAdmission.run(admission, () => withAgentDatabasePreparationContext(() => admission, () => run(admission)));
	} finally {
		await admission.releaseStartup();
	}
}
//#endregion
export { getAgentDatabaseStartupAdmission as n, withAgentDatabaseStartupAdmission as r, AgentDatabaseStartupSupersededError as t };
