import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as resolveOpenClawStateDirForDatabasePath, r as resolveDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, x as requireOpenClawStateDatabaseIdentity, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import "./session-key-CSDERtm3.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { c as AgentDeletionAuthorityRollbackError, l as AgentDeletionCommitUncertainError } from "./agent-lifecycle-registry-DCaIqk-e.mjs";
import { n as maxAsk, r as minSecurity } from "./exec-approvals-policy-Cd5JaUxb.mjs";
import { i as createFailClosedExecApprovalsFallback, l as parsePersistedExecApprovals, u as resolveExecApprovalsDisplayPath } from "./exec-approvals-config-JiuCEgOc.mjs";
import { t as resolveExecApprovalsFromFileInternal } from "./exec-approvals-resolver-BYbI_zvO.mjs";
import { n as assertNoPendingLegacyExecApprovals, t as ExecApprovalsMigrationRequiredError } from "./exec-approvals-migration-gate-uz_Dsb9e.mjs";
import { n as withExecApprovalsPublication, t as execApprovalsPublication } from "./exec-approvals-publication-BPITitc6.mjs";
import { c as snapshotFromExecApprovalsDatabase, d as writeExecApprovalsConfigRow, l as snapshotFromExecApprovalsRow, n as assertExecApprovalsMutationAllowed, s as serializeExecApprovals, u as warnFailClosed } from "./exec-approvals-sqlite-BKYjiJeV.mjs";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/exec-approvals-cron-policy.ts
const cronPolicyUses = resolveGlobalSingleton(Symbol.for("openclaw.execApprovalsCronPolicyUses"), () => /* @__PURE__ */ new Map());
const pendingPolicyPublications = resolveGlobalSingleton(Symbol.for("openclaw.execApprovalsPendingPolicyPublications"), () => /* @__PURE__ */ new Map());
function retainCronPolicyPublication(key, file) {
	const affected = [...cronPolicyUses.get(key) ?? []].filter((use) => !use.accepts(file));
	if (affected.some((use) => use.initiating)) throw new Error("Exec policy change refused while cron native launch acknowledgement is pending; retry after command startup settles.");
	const pending = pendingPolicyPublications.get(key) ?? /* @__PURE__ */ new Set();
	pendingPolicyPublications.set(key, pending);
	pending.add(file);
	for (const use of affected) use.retired = true;
	let unregister = () => {};
	const release = () => {
		pending.delete(file);
		if (!pending.size && pendingPolicyPublications.get(key) === pending) pendingPolicyPublications.delete(key);
		unregister();
	};
	unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
		if (!identity || identity.key === key) release();
	} });
	return release;
}
/** Live uses retain eligibility, not policy snapshots; native writers publish before returning. */
async function prepareCronExecHostPolicyUse(context, params) {
	context.admission.assertCurrent();
	const requested = { ...params };
	const key = context.admission.identity.key;
	const uses = cronPolicyUses.get(key) ?? /* @__PURE__ */ new Set();
	cronPolicyUses.set(key, uses);
	const use = {
		ready: false,
		retired: false,
		pending: 0,
		initiating: false,
		accepts(file) {
			const current = resolveExecApprovalsFromFileInternal({
				file,
				agentId: requested.agentId,
				overrides: requested
			}).agent;
			const security = requested.bypassHostApprovalFloors ? requested.security : minSecurity(requested.security, current.security);
			const ask = requested.bypassHostApprovalFloors ? requested.ask : maxAsk(requested.ask, current.ask);
			return security !== "deny" && ask !== "always";
		}
	};
	use.retired = [...pendingPolicyPublications.get(key) ?? []].some((file) => !use.accepts(file));
	uses.add(use);
	let unregister = () => {};
	const release = () => {
		use.retired = true;
		if (use.initiating) return;
		uses.delete(use);
		if (uses.size === 0 && cronPolicyUses.get(key) === uses) cronPolicyUses.delete(key);
		unregister();
	};
	const assertCurrent = () => {
		context.admission.assertCurrent();
		if (!use.ready || use.retired || use.pending > 0) throw new Error("Exec approval policy changed before cron execution");
	};
	try {
		unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
			if (!identity || identity.key === key) {
				use.initiating = false;
				release();
			}
		} });
		assertNoPendingLegacyExecApprovals({ env: context.environment });
		const reply = await executeExistingOpenClawStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, { type: "exec-approvals.read" }, {
			context,
			current: true
		});
		if (!reply?.ok || reply.type !== "exec-approvals.read") throw new Error("Exec approval policy snapshot is unavailable");
		const file = snapshotFromExecApprovalsRow({
			path: resolveExecApprovalsDisplayPath(context.environment),
			row: reply.row
		}).file;
		use.retired ||= !use.accepts(file);
		use.ready = true;
		assertCurrent();
		return {
			assertCurrent,
			release,
			initiate(effect, settlement) {
				assertCurrent();
				use.retired = true;
				use.initiating = true;
				if (settlement) settlement.then(() => {
					use.initiating = false;
					release();
				}, () => {});
				try {
					return effect();
				} finally {
					if (!settlement) use.initiating = false;
					release();
				}
			}
		};
	} catch (error) {
		release();
		throw error;
	}
}
function stageCronExecHostPolicyPublication(db, file) {
	if (cronPolicyUses.size === 0) return;
	const key = requireOpenClawStateDatabaseIdentity({ db }).key;
	const affected = [...cronPolicyUses.get(key) ?? []].filter((use) => !use.accepts(file));
	if (affected.length === 0) return;
	if (affected.some((use) => use.initiating)) throw new Error("Exec policy change refused while cron native launch acknowledgement is pending; retry after command startup settles.");
	const retire = () => {
		for (const use of affected) {
			use.pending--;
			use.retired = true;
		}
	};
	if (!stageSqliteTransactionState(db, {
		stage() {
			for (const use of affected) use.pending++;
		},
		commit: retire,
		rollback: retire
	})) throw new Error("Exec approval policy publication requires its native transaction owner");
}
//#endregion
//#region src/infra/exec-approvals-store.ts
var ExecApprovalsStoreUnavailableError = class extends Error {
	constructor(cause) {
		super(`Exec approvals SQLite state is unavailable: ${String(cause)}`, { cause });
		this.name = "ExecApprovalsStoreUnavailableError";
	}
};
const preparedSnapshots = resolveGlobalMap(Symbol.for("openclaw.execApprovalsPreparedSnapshots"), "close-and-restart");
const currentPolicies = resolveGlobalMap(Symbol.for("openclaw.execApprovalsCurrentPolicies"), "close-and-restart");
execApprovalsPublication.subscribeFacts((change) => {
	const identity = change.kind === "committed" ? change.receipt.source.identity : change.identity;
	if (typeof identity === "string") {
		let policy = currentPolicies.get(identity);
		if (!policy) {
			policy = { pending: /* @__PURE__ */ new Set() };
			currentPolicies.set(identity, policy);
		}
		if (change.kind === "pending") policy.pending.add(change.operationId);
		else if (change.kind === "settled") policy.pending.delete(change.operationId);
		else if (change.kind === "unknown") currentPolicies.set(identity, { pending: policy.pending });
		else if (change.kind === "committed") {
			const fact = change.receipt.facts.get("current");
			if (fact?.kind === "postimage") policy.file = fact.value.file;
			else if (fact?.kind === "absent") policy.file = snapshotFromExecApprovalsRow({ path: "" }).file;
			else if (fact?.kind === "unknown") currentPolicies.set(identity, { pending: policy.pending });
		}
	}
	for (const [key, entry] of preparedSnapshots) if (entry.identity === identity) preparedSnapshots.delete(key);
});
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened") {
		if (event.identity) currentPolicies.delete(event.identity.key);
		else currentPolicies.clear();
		for (const [key, entry] of preparedSnapshots) if (entry.path === (event.identity?.canonicalPath ?? event.path)) preparedSnapshots.delete(key);
	}
});
/** Preparation reuses policy facts; execution retains its direct current-row guard. */
async function readPreparedExecApprovals(context) {
	const options = {
		path: context.admission.databasePath,
		env: context.environment
	};
	const read = async () => {
		const reply = await executeExistingOpenClawStateRead(options, { type: "exec-approvals.read" }, {
			context,
			current: true
		});
		context.admission.assertCurrent();
		return snapshotFromReadReply(reply, () => resolveExecApprovalsDisplayPath(context.environment));
	};
	if (isArtifactPreservingStateRead() || getOpenClawDatabaseMaintenanceScope() || getActiveOpenClawStateDatabaseReadSnapshot(options)) return read();
	const key = context.admission.coordinationKey;
	let entry = preparedSnapshots.get(key);
	if (entry && entry.identity !== context.admission.identity.key) {
		preparedSnapshots.delete(key);
		entry = void 0;
	}
	if (!entry) {
		entry = {
			identity: context.admission.identity.key,
			path: context.admission.identity.canonicalPath,
			snapshot: read()
		};
		preparedSnapshots.set(key, entry);
		if (preparedSnapshots.size > 64) preparedSnapshots.delete(preparedSnapshots.keys().next().value);
	}
	try {
		const snapshot = await entry.snapshot;
		context.admission.assertCurrent();
		return structuredClone(snapshot);
	} catch (error) {
		if (preparedSnapshots.get(key) === entry) preparedSnapshots.delete(key);
		throw error;
	}
}
function readExecApprovalsSnapshot() {
	try {
		assertNoPendingLegacyExecApprovals();
		return snapshotFromExecApprovalsDatabase(openOpenClawStateDatabase().db);
	} catch (error) {
		if (error instanceof ExecApprovalsMigrationRequiredError) throw error;
		throw new ExecApprovalsStoreUnavailableError(error);
	}
}
function snapshotFromReadReply(reply, displayPath) {
	if (reply && (!reply.ok || reply.type !== "exec-approvals.read")) throw new Error("Unexpected exec approvals read result");
	return snapshotFromExecApprovalsRow({
		path: displayPath(),
		row: reply?.row,
		onMalformed: () => warnFailClosed("exec approvals SQLite row is malformed; denying host execution")
	});
}
async function readExecApprovalsSnapshotAsync(context = captureOpenClawStateWorkerContext()) {
	try {
		assertNoPendingLegacyExecApprovals({ env: context.environment });
		return await readPreparedExecApprovals(context);
	} catch (error) {
		if (error instanceof ExecApprovalsMigrationRequiredError) throw error;
		throw new ExecApprovalsStoreUnavailableError(error);
	}
}
function loadExecApprovals() {
	try {
		return readExecApprovalsSnapshot().file;
	} catch (error) {
		if (!(error instanceof ExecApprovalsStoreUnavailableError)) throw error;
		warnFailClosed("exec approvals SQLite state is unavailable; denying host execution", error);
		return createFailClosedExecApprovalsFallback();
	}
}
/** Loads exec approvals without creating or migrating shared state. */
function loadExecApprovalsReadOnly() {
	try {
		assertNoPendingLegacyExecApprovals();
		const displayPath = resolveExecApprovalsDisplayPath();
		return (withExistingOpenClawStateDatabaseReadOnly(({ db }) => snapshotFromExecApprovalsDatabase(db, displayPath)) ?? snapshotFromExecApprovalsRow({ path: displayPath })).file;
	} catch (error) {
		if (error instanceof ExecApprovalsMigrationRequiredError) throw error;
		warnFailClosed("exec approvals SQLite state is unavailable; denying host execution", error);
		return createFailClosedExecApprovalsFallback();
	}
}
/** A committed policy view keeps the final execution guard synchronous and free of SQL. */
function retainExecApprovalsCurrentRead(context) {
	const key = context.admission.identity.key;
	let policy = currentPolicies.get(key);
	if (!policy) {
		policy = { pending: /* @__PURE__ */ new Set() };
		currentPolicies.set(key, policy);
	}
	return {
		seed(file) {
			if (currentPolicies.get(key) === policy && !policy.file) policy.file = file;
		},
		read() {
			context.admission.assertCurrent();
			const current = currentPolicies.get(key);
			if (!current?.file || current.pending.size) throw new Error("Exec approval policy is unavailable or changing before execution");
			return structuredClone(current.file);
		}
	};
}
/** Prepare node-local launch policy before invoking a synchronous plugin callback. */
async function prepareExecApprovalsCurrentRead(context) {
	const policy = retainExecApprovalsCurrentRead(context);
	policy.seed((await readExecApprovalsSnapshotAsync(context)).file);
	return () => policy.read();
}
/** Capture the policy owner before yielding; reads never initialize or migrate state. */
async function loadExecApprovalsReadOnlyAsync(options = {}) {
	return (await readExecApprovalsPolicyReadOnlyAsync(options)).file;
}
/** The revision includes the physical policy owner; unavailable reads cannot seed caches. */
async function readExecApprovalsPolicyReadOnlyAsync(options = {}) {
	const stateDbPath = resolveDatabasePath(options);
	const owner = {
		path: stateDbPath,
		env: { OPENCLAW_STATE_DIR: resolveOpenClawStateDirForDatabasePath(stateDbPath) }
	};
	try {
		assertNoPendingLegacyExecApprovals({ env: owner.env });
		const snapshot = isArtifactPreservingStateRead() || getOpenClawDatabaseMaintenanceScope() || getActiveOpenClawStateDatabaseReadSnapshot(owner) ? snapshotFromReadReply(await executeExistingOpenClawStateRead(owner, { type: "exec-approvals.read" }), () => resolveExecApprovalsDisplayPath(owner.env)) : await readPreparedExecApprovals(captureOpenClawStateWorkerContext(owner));
		return {
			file: snapshot.file,
			revision: JSON.stringify([stateDbPath, snapshot.hash])
		};
	} catch (error) {
		if (error instanceof ExecApprovalsMigrationRequiredError) throw error;
		warnFailClosed("exec approvals SQLite state is unavailable; denying host execution", error);
		return { file: createFailClosedExecApprovalsFallback() };
	}
}
/** Doctor retains its synchronous native migration transaction. Runtime edits use the writer. */
function updateExecApprovalsForMaintenance(params, options = {}) {
	assertNoPendingLegacyExecApprovals();
	return runOpenClawStateWriteTransaction(({ db }) => {
		params.assertCurrent?.();
		const current = snapshotFromExecApprovalsDatabase(db);
		if (params.baseHash !== void 0 && current.hash !== params.baseHash) return null;
		const next = params.update(structuredClone(current.file));
		if (next === null) return current;
		assertExecApprovalsMutationAllowed({
			db,
			current: current.file,
			next
		});
		const raw = serializeExecApprovals(next);
		if (current.exists && current.raw === raw) return current;
		const persistedRaw = writeExecApprovalsConfigRow({
			db,
			file: next
		});
		const snapshot = snapshotFromExecApprovalsRow({
			path: current.path,
			row: { raw_json: persistedRaw }
		});
		stageCronExecHostPolicyPublication(db, snapshot.file);
		params.assertCurrent?.();
		return snapshot;
	}, options, { operationLabel: "exec-approvals.update" });
}
async function mutateExecPolicy(context, command, assertCurrent, assertPreparationCurrent = assertCurrent) {
	assertNoPendingLegacyExecApprovals({ env: context.environment });
	const captured = structuredClone(command);
	pendingAuthorizationBatches.length = 0;
	let publicationSettled;
	try {
		return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(captured), {
			assertCurrent: assertPreparationCurrent,
			createAdmission: withExecApprovalsPublication((operation, onCommitAdmitted) => {
				let transaction = false;
				let staged;
				let release;
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					context.admission.assertCurrent();
					assertCurrent?.();
					if (request.stage === "transaction" && !transaction) transaction = true;
					else if (request.stage === "commit" && transaction) {
						transaction = false;
						if (request.facts !== void 0) {
							if (!isRecord(request.facts) || request.facts.kind !== "exec-policy-publication") throw new Error("Exec policy mutation omitted its publication");
							const parsed = parsePersistedExecApprovals(JSON.stringify(request.facts.file));
							if (!parsed.ok || release) throw new Error("Exec policy mutation returned an invalid publication");
							staged = request.facts;
							release = retainCronPolicyPublication(context.admission.identity.key, parsed.value);
						}
					} else throw new Error("Exec policy mutation requested authority out of order");
					if (!grant()) throw new Error("Exec policy mutation lost admission");
					if (request.stage === "commit") onCommitAdmitted();
				});
				publicationSettled = operation.settled.then((settlement) => {
					const receipt = admission.committed?.facts;
					if (receipt !== void 0 && !isDeepStrictEqual(receipt, staged)) throw new Error("Exec policy receipt changed its prepared publication");
					if (settlement.kind !== "unknown" || receipt !== void 0) release?.();
				});
				publicationSettled.catch(() => void 0);
				return {
					admission,
					nativeLocations: [context.admission.databasePath]
				};
			}, context)
		});
	} finally {
		await publicationSettled;
	}
}
function updateExecApprovals(params, context = captureOpenClawStateWorkerContext()) {
	return mutateExecPolicy(context, {
		type: "execApprovals.update",
		input: {
			baseHash: params.baseHash,
			update: params.update
		}
	}, params.assertCurrent, params.assertPreparationCurrent);
}
const pendingAuthorizationBatches = [];
/** Coalesce this turn's authorizations; the shared-state actor owns ordered settlement. */
function commitExecAuthorizations(input, assertCurrent, context = captureOpenClawStateWorkerContext()) {
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	return maintenance ? maintenance.run(() => enqueueExecAuthorization(input, assertCurrent, context)) : enqueueExecAuthorization(input, assertCurrent, context);
}
function enqueueExecAuthorization(input, assertCurrent, context = captureOpenClawStateWorkerContext()) {
	assertNoPendingLegacyExecApprovals({ env: context.environment });
	const completion = createDeferredCore();
	const policy = retainExecApprovalsCurrentRead(context);
	const request = {
		input: structuredClone(input),
		context,
		signal: getAsyncWorkSignal(),
		resolve: completion.resolve,
		reject: completion.reject,
		assertCurrent,
		policy
	};
	let batch = pendingAuthorizationBatches.at(-1);
	if (batch) {
		const owner = batch[0].context;
		if (batch[0].assertCurrent !== assertCurrent || batch[0].signal !== request.signal || batch.length >= 64 || owner.admission.identity.key !== context.admission.identity.key || owner.maintenanceScope !== context.maintenanceScope || owner.existingSchemaPath !== context.existingSchemaPath || owner.environment.OPENCLAW_SUPERVISOR_MODE !== context.environment.OPENCLAW_SUPERVISOR_MODE) batch = void 0;
	}
	if (!batch) {
		batch = [request];
		pendingAuthorizationBatches.push(batch);
		const pending = batch;
		const assertBatchCurrent = () => {
			for (const item of pending) {
				item.context.admission.assertCurrent();
				item.assertCurrent?.();
			}
		};
		queueMicrotask(() => {
			const index = pendingAuthorizationBatches.indexOf(pending);
			if (index >= 0) pendingAuthorizationBatches.splice(index, 1);
		});
		runOpenClawStateWorkerOperation(context, async (scope) => {
			const results = await scope.execute({
				type: "execApprovals.commitAuthorizations",
				input: { items: pending.map((item) => item.input) }
			});
			return pending.map((item, index) => {
				const result = results[index];
				if (!result?.ok) return () => item.reject(new Error(result?.message ?? "Missing exec authorization result"));
				item.policy.seed(result.snapshot.file);
				return () => item.resolve({
					snapshot: result.snapshot,
					readCurrent: () => {
						item.signal?.throwIfAborted();
						item.assertCurrent?.();
						return item.policy.read();
					}
				});
			});
		}, {
			assertCurrent: assertBatchCurrent,
			createAdmission: withExecApprovalsPublication((operation, onCommitAdmitted) => createSqliteWorkerWriteAdmission((admissionRequest) => {
				assertBatchCurrent();
				if (admissionRequest.stage === "commit") onCommitAdmitted();
			}, [context.admission.databasePath])(operation), context, pending)
		}).then((settlements) => settlements.forEach((settle) => settle()), (error) => pending.forEach((item) => item.reject(error)));
	} else batch.push(request);
	return completion.promise;
}
/** Remove only the captured deletion operation's policies; restore them after a definite failure. */
async function withAgentExecApprovalsRemoved(agentId, commit, authority) {
	const key = normalizeAgentId(agentId);
	const mutate = async (input) => {
		pendingAuthorizationBatches.length = 0;
		const nonce = crypto.randomUUID();
		let operationId;
		let committed = false;
		let uncertain = false;
		let releasePublication;
		let publication;
		try {
			return await authority.runWithWorker((scope, guard) => {
				if (guard.predicate.agentId !== key) throw new Error("Exec approval retirement differs from its deletion owner");
				operationId = guard.predicate.operationId;
				return scope.execute({
					type: "execApprovals.retireAgent",
					input: {
						...input,
						guard,
						nonce
					}
				});
			}, {
				onAdmission(request, identityKey) {
					publication ??= execApprovalsPublication.begin({
						identity: identityKey,
						assertCurrent: authority.assertCurrentHost
					});
					if (request.stage !== "commit") return;
					const facts = isRecord(request.facts) ? request.facts.domainFacts : void 0;
					if (!isRecord(facts) || facts.kind !== "exec-approvals-retirement" || facts.nonce !== nonce || facts.agentId !== key || facts.operationId !== operationId || facts.action !== input.action || facts.raw !== null && typeof facts.raw !== "string" || releasePublication) throw new Error("Exec approval retirement publication differs from its command");
					if (facts.raw !== null) releasePublication = retainCronPolicyPublication(identityKey, snapshotFromExecApprovalsRow({
						path: "",
						row: { raw_json: facts.raw }
					}).file);
				},
				onCommitted(facts) {
					if (!isRecord(facts) || facts.kind !== "exec-approvals-retirement" || facts.nonce !== nonce || facts.action !== input.action) throw new Error("Exec approval retirement receipt differs from its command");
					committed = true;
					publication?.committed(facts.execFacts);
				}
			});
		} catch (error) {
			uncertain = hasSqliteWorkerOutcomeUnknown(error);
			if (committed || uncertain) throw new AgentDeletionAuthorityRollbackError([error], `Exec approvals retirement outcome is uncertain for agent ${key}.`, { cause: error });
			throw error;
		} finally {
			publication?.finish(committed && !uncertain);
			if (!uncertain) releasePublication?.();
		}
	};
	const removedPolicyEntries = await mutate({ action: "remove" });
	try {
		authority.assertCurrentHost();
		return await commit();
	} catch (error) {
		if (error instanceof AgentDeletionCommitUncertainError) throw error;
		if (removedPolicyEntries.length > 0) try {
			await mutate({
				action: "restore",
				entries: removedPolicyEntries
			});
		} catch (rollbackError) {
			throw new AgentDeletionAuthorityRollbackError([error, rollbackError], `Failed to roll back exec approvals deletion for agent ${key}.`, { cause: error });
		}
		throw error;
	}
}
function restoreExecApprovalsSnapshotLocked(snapshot, baseHash, context = captureOpenClawStateWorkerContext(), assertCurrent) {
	return mutateExecPolicy(context, {
		type: "execApprovals.restoreSnapshot",
		input: {
			snapshot,
			baseHash
		}
	}, assertCurrent);
}
function ensureExecApprovalsSnapshot(assertCurrent, assertPreparationCurrent = assertCurrent) {
	return mutateExecPolicy(captureOpenClawStateWorkerContext(), {
		type: "execApprovals.ensureSnapshot",
		input: void 0
	}, assertCurrent, assertPreparationCurrent);
}
//#endregion
export { loadExecApprovalsReadOnlyAsync as a, readExecApprovalsSnapshot as c, updateExecApprovals as d, updateExecApprovalsForMaintenance as f, loadExecApprovalsReadOnly as i, readExecApprovalsSnapshotAsync as l, prepareCronExecHostPolicyUse as m, ensureExecApprovalsSnapshot as n, prepareExecApprovalsCurrentRead as o, withAgentExecApprovalsRemoved as p, loadExecApprovals as r, readExecApprovalsPolicyReadOnlyAsync as s, commitExecAuthorizations as t, restoreExecApprovalsSnapshotLocked as u };
