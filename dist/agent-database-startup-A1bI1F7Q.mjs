import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { f as withSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-CmkAsqCm.mjs";
import { i as sameFileMutationFingerprint } from "./file-descriptor-C_0BsNDD.mjs";
import { n as readSqliteIntegrityFileIdentity } from "./sqlite-file-generation-bF3ZcoQs.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import "./openclaw-agent-db-contract-DzsRD6Fl.mjs";
import { i as createAgentDatabaseInspectionRefusal, l as listAgentDatabaseAdmissionRefusals, o as failPendingAgentDatabase, u as preparePendingAgentDatabase } from "./agent-database-admission-BFwcs62N.mjs";
import { o as readAgentDeletionJournal } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { statSync } from "node:fs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/agent-database-startup.ts
function readSchemaSourceWitness(pathname) {
	try {
		const files = [
			"",
			"-wal",
			"-journal"
		].map((suffix) => statSync(`${pathname}${suffix}`, {
			bigint: true,
			throwIfNoEntry: false
		}));
		return files[0] && files.every((file) => !file || file.isFile()) ? files : void 0;
	} catch {
		return;
	}
}
function matchesSchemaSourceWitness(before, after) {
	return Boolean(after && before.every((file, index) => {
		const current = after[index];
		return file ? current && sameFileMutationFingerprint(file, current) : !current;
	}));
}
const log = createSubsystemLogger("state/agent-admission");
const startupAdmission = new AsyncLocalStorage();
/** Startup owns readers until the Gateway adopts them; only the Gateway activates agents. */
var AgentDatabaseStartupAdmission = class {
	constructor() {
		this.controller = new AbortController();
		this.activation = createDeferredCore();
		this.work = /* @__PURE__ */ new Set();
		this.pending = /* @__PURE__ */ new Map();
		this.adopted = false;
		this.activated = false;
		this.stopped = false;
		this.preparation = Promise.resolve();
	}
	get signal() {
		return this.controller.signal;
	}
	get isStopped() {
		return this.stopped;
	}
	/** Full readiness stays fresh; only unchanged compatibility headers cross into bootstrap. */
	prepareSchemaHeaders(env) {
		const prepared = {
			statePath: resolveOpenClawStateSqlitePath(env),
			headers: /* @__PURE__ */ new Map()
		};
		this.preparedSchemaHeaders = prepared;
		return (pathname) => {
			const before = readSchemaSourceWitness(pathname);
			return (version) => {
				if (!this.stopped && this.preparedSchemaHeaders === prepared && before && version === 23 && matchesSchemaSourceWitness(before, readSchemaSourceWitness(pathname))) prepared.headers.set(pathname, {
					version,
					witness: before
				});
			};
		};
	}
	takePreparedSchemaHeaders(env) {
		const prepared = this.preparedSchemaHeaders;
		this.preparedSchemaHeaders = void 0;
		return (pathname, supportedVersion) => {
			const header = prepared?.headers.get(pathname);
			return !this.stopped && prepared?.statePath === resolveOpenClawStateSqlitePath(env) && header?.version === supportedVersion && matchesSchemaSourceWitness(header.witness, readSchemaSourceWitness(pathname)) ? { version: header.version } : void 0;
		};
	}
	track(work) {
		this.work.add(work);
		work.then(() => this.work.delete(work), () => this.work.delete(work));
	}
	scheduling(env) {
		return {
			signal: this.signal,
			path: (target) => target.path,
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
			reason: formatErrorMessage(error)
		}));
		return true;
	}
	captureRefusals(env) {
		return new Map(listAgentDatabaseAdmissionRefusals({ env }).filter((refusal) => this.pending.get(refusal.agentId) === refusal).map((refusal) => [refusal.agentId, refusal]));
	}
	reuseRefusal(target, inspection, priorRefusals) {
		const refusal = target.agentId && priorRefusals?.get(target.agentId);
		if (!refusal) return false;
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
			this.pending.set(agentId, refusal);
			refusals.push(refusal);
			log.warn(refusal.reason, {
				agentId,
				paths,
				repairHint: refusal.repairHint
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
			const recovery = (async () => {
				const results = await checked;
				const activation = await this.activation.promise;
				if (!activation || this.stopped) return;
				const prepare = async () => {
					const assertCurrent = () => {
						this.signal.throwIfAborted();
						if (!activation.isCurrent() || this.pending.get(agentId) !== refusal) throw new Error(`Gateway no longer owns preparation for agent ${agentId}`);
						if (readAgentDeletionJournal(agentId, { env })) throw new Error(`Agent ${agentId} was deleted during startup inspection`);
						for (const witness of witnesses) {
							if (!witness.identity) throw witness.error;
							readSqliteIntegrityFileIdentity(witness.pathname, witness.identity);
						}
					};
					try {
						assertCurrent();
						for (const result of results) {
							if (result.status === "rejected") throw result.reason;
							const inspection = result.value;
							if (inspection.incompatible.length || inspection.indeterminate.length || inspection.agentRefusals?.length || inspection.pendingMigrations?.length) throw new Error(inspection.agentRefusals?.map((entry) => entry.reason).join("; ") || inspection.indeterminate.map((entry) => entry.reason).join("; ") || `Agent ${agentId} database requires Doctor before preparation`);
						}
						await withSqliteReadOnlyWorkerScope(() => preparePendingAgentDatabase(refusal, {
							env,
							assertCurrent
						}, () => activation.prepareAgent({
							agentId,
							paths,
							env,
							signal: this.signal,
							assertCurrent
						})), {
							signal: this.signal,
							deadlineOwnedByCaller: true
						});
						log.info("agent database recovered after background inspection and preparation", {
							agentId,
							paths
						});
					} catch (error) {
						if (!this.stopped) {
							const reason = formatErrorMessage(error);
							failPendingAgentDatabase(refusal, reason, { env });
							log.warn("agent database remains degraded", {
								agentId,
								paths,
								reason
							});
						}
					} finally {
						if (this.pending.get(agentId) === refusal) this.pending.delete(agentId);
					}
				};
				const prepared = this.preparation.then(prepare);
				this.preparation = prepared.catch(() => {});
				await prepared;
			})();
			this.track(recovery);
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
async function withAgentDatabaseStartupAdmission(run) {
	const admission = getAgentDatabaseStartupAdmission() ?? new AgentDatabaseStartupAdmission();
	try {
		return await startupAdmission.run(admission, () => run(admission));
	} finally {
		await admission.releaseStartup();
	}
}
//#endregion
export { withAgentDatabaseStartupAdmission as n, getAgentDatabaseStartupAdmission as t };
