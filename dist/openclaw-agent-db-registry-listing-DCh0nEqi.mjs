import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { o as inspectDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { a as resolveOpenClawRegisteredAgentDatabasePath, r as resolveDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { b as publishSqliteDatabaseAdmission, s as getOrLoadSqliteDatabaseAdmissionForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { c as withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync, t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as STATE_SCHEMA_MIGRATION_READ_TABLES, c as detectOpenClawStateDatabaseSchemaMigrationsFromDatabase, o as assertCanonicalAgentDatabasesPrimaryKey } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { lstatSync, statSync } from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-agent-db-registry.read.ts
const readableSchemas = /* @__PURE__ */ new WeakSet();
/** Read durable registrations from an already opened live or captured database. */
function readOpenClawAgentDatabaseRegistryRows(database, pathname) {
	const db = getNodeSqliteKysely(database);
	const schema = getAdmittedSqliteSchemaFacts(database);
	const registryTable = isPostgresSqlConnection(database) ? tableExists(database, "agent_databases") ? { type: "table" } : void 0 : schema ? schema.tables.has("agent_databases") ? { type: "table" } : schema.views.has("agent_databases") || schema.indexes.has("agent_databases") || schema.triggers.has("agent_databases") ? { type: "invalid" } : void 0 : executeSqliteQueryTakeFirstSync(database, db.selectFrom("sqlite_master").select("type").where("name", "=", "agent_databases"));
	if (!registryTable) return [];
	if (registryTable.type !== "table") throw new Error(`OpenClaw state database ${pathname} has an invalid agent registry.`);
	return executeSqliteQuerySync(database, db.selectFrom("agent_databases").selectAll().orderBy("agent_id", "asc").orderBy("path", "asc")).rows;
}
function readAgentDatabasePreflightTargets(database, registryPath) {
	return readOpenClawAgentDatabaseRegistryRows(database, registryPath).flatMap((row) => typeof row.agent_id === "string" && typeof row.path === "string" ? [{
		agentId: row.agent_id,
		path: resolveOpenClawRegisteredAgentDatabasePath(registryPath, row.path)
	}] : []);
}
function readRegisteredAgentDatabaseRows(database, pathname, artifactPreserving) {
	if (isPostgresSqlConnection(database)) {
		if (artifactPreserving) requireNativeDatabaseFile("postgres", "file-snapshot");
	} else if (artifactPreserving) assertCanonicalAgentDatabasesPrimaryKey(database, pathname);
	else {
		const schema = getAdmittedSqliteSchemaFacts(database);
		if (!schema || !readableSchemas.has(schema)) {
			if (detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(database, pathname).some(({ kind }) => STATE_SCHEMA_MIGRATION_READ_TABLES[kind].includes("agent_databases"))) throw new Error(`OpenClaw state database ${pathname} has a legacy agent database registry schema; run openclaw doctor --fix to migrate it.`);
			if (schema) readableSchemas.add(schema);
		}
	}
	return readOpenClawAgentDatabaseRegistryRows(database, pathname).map((row) => ({
		agentId: normalizeAgentId(row.agent_id),
		path: resolveOpenClawRegisteredAgentDatabasePath(pathname, row.path),
		schemaVersion: row.schema_version,
		lastSeenAt: row.last_seen_at,
		sizeBytes: row.size_bytes
	}));
}
//#endregion
//#region src/state/openclaw-agent-db-registry-listing.ts
function registeredPathKey(source) {
	return {
		name: `agent.registry:${JSON.stringify([
			source.agentId,
			path.resolve(source.path),
			source.identity,
			source.schemaVersion ?? 27
		])}`,
		read: (value) => typeof value === "boolean" ? value : void 0
	};
}
/** Physical schema admission does not register a newly used lexical alias. */
function hasRegisteredOpenClawAgentDatabasePath(database, options) {
	const { identity } = readOpenClawAgentDatabaseIdentity(database);
	return typeof identity === "string" && getOrLoadSqliteDatabaseAdmissionForPath(resolveDatabasePath(options), registeredPathKey({
		...database,
		identity: `file:${identity}`
	}), () => void 0) === true;
}
const registry = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseRegistryMemo"), () => ({
	pending: /* @__PURE__ */ new Map(),
	publications: /* @__PURE__ */ new WeakSet()
}));
/** Registry facts retain their owner through deferred COMMIT publication. */
function emitOpenClawAgentDatabaseRegistryChange(agentId, database) {
	const change = {
		all: true,
		scope: {
			agentId,
			topology: true
		}
	};
	registry.publications.add(change);
	sessionChanges.emit(change, database);
}
function isOpenClawAgentDatabaseRegistryChange(change) {
	return registry.publications.has(change);
}
function activateRegisteredAgentDatabasesMemo(options) {
	const pathname = resolveDatabasePath(options);
	if (registry.memo?.pathname !== pathname) registry.memo = {
		pathname,
		token: Symbol(pathname)
	};
	return registry.memo;
}
/** Return the process-stable generation for the active agent database registry. */
function readOpenClawAgentDatabaseRegistryToken(options = {}) {
	return activateRegisteredAgentDatabasesMemo(options).token;
}
function invalidateRegisteredAgentDatabasesMemo(options) {
	return advanceRegisteredAgentDatabasesMemo(resolveDatabasePath(options));
}
function advanceRegisteredAgentDatabasesMemo(pathname, transition) {
	if (transition?.phase === "begin") registry.pending.set(transition.operation, {
		...transition,
		pathname
	});
	else if (transition?.phase === "finish") registry.pending.delete(transition.operation);
	const previous = registry.memo;
	if (previous?.pathname !== pathname) return;
	const memo = {
		pathname,
		token: Symbol(pathname)
	};
	previous.next = {
		memo,
		transition
	};
	registry.memo = memo;
	return {
		previous: previous.token,
		current: memo.token
	};
}
function captureRegistryMutation(kind, sources) {
	try {
		const captured = [];
		for (const source of sources) {
			const identity = inspectDatabasePathIdentitySync(source.path);
			if (!identity) return;
			captured.push({
				agentId: source.agentId,
				path: path.resolve(source.path),
				physicalPath: identity.canonicalPath,
				identity: identity.key,
				schemaVersion: source.schemaVersion ?? 27
			});
		}
		return {
			kind,
			sources: captured
		};
	} catch {
		return;
	}
}
/** Retain physical sources before deletion removes their files; COMMIT still owns publication. */
async function prepareOpenClawAgentDatabaseRegistryRemoval(agentId, options) {
	const read = await prepareOpenClawAgentDatabaseRegistrySnapshotRead({
		...options,
		includeIncompatibleSchemaVersions: true
	}).read();
	read.assertCurrent();
	if (read.result.status !== "available") throw new Error("OpenClaw agent database registry is unavailable during deletion.");
	const sources = read.result.entries.filter((entry) => entry.agentId === agentId);
	const mutation = sources.length > 0 ? captureRegistryMutation("remove", sources) : void 0;
	const pathname = resolveDatabasePath(options);
	return () => {
		advanceRegisteredAgentDatabasesMemo(pathname, {
			operation: Symbol("agent-registry-removal"),
			mutation,
			phase: "commit"
		});
		emitOpenClawAgentDatabaseRegistryChange(agentId);
	};
}
/** Stage exact registry facts at the same native transaction boundary as their rows. */
function recordOpenClawAgentDatabaseRegistryMutation(database, kind, sources) {
	const operation = Symbol("agent-registry-mutation");
	const mutation = captureRegistryMutation(kind, sources);
	for (const source of mutation?.sources ?? []) publishSqliteDatabaseAdmission(database.db, registeredPathKey(source), kind === "upsert");
	const advance = (phase) => advanceRegisteredAgentDatabasesMemo(database.path, {
		operation,
		mutation,
		phase
	});
	if (!stageSqliteTransactionState(database.db, {
		stage: () => advance("begin"),
		commit: () => {
			advance("commit");
			advance("finish");
		},
		rollback: () => advance("finish")
	})) throw new Error("Registry mutation requires its canonical transaction publication scope");
}
async function settleAgentRegistration(registration, operation) {
	let result;
	try {
		result = {
			ok: true,
			value: await operation()
		};
	} catch (error) {
		result = {
			ok: false,
			error
		};
	}
	try {
		registration.finish(await registration.nativeSettlement);
	} catch (error) {
		if (!result.ok) throw createSqliteLifecycleAggregateError([result.error, error], "Agent open and registration publication failed", result.error);
		throw error;
	}
	if (!result.ok) throw result.error;
	return result.value;
}
/** Fence native registry settlement under its original shared generation. */
function captureOpenClawAgentDatabaseRegistration(params) {
	const options = { path: params.admission.databasePath };
	const operation = Symbol("agent-registry-registration");
	const mutation = captureRegistryMutation(params.kind ?? "upsert", [{
		agentId: params.agentId,
		path: params.agentPath
	}]);
	const advance = (phase) => {
		const change = advanceRegisteredAgentDatabasesMemo(options.path, {
			operation,
			mutation,
			phase
		});
		if (change) params.onRegistryChange?.(change);
	};
	let active = false;
	let committed = false;
	let finished = false;
	const publishChange = () => {
		try {
			(params.assertPublicationCurrent ?? params.admission.assertCurrent)();
		} catch (error) {
			if (isStateDatabaseReadAdmissionInvalidatedError(error)) return;
			throw error;
		}
		emitOpenClawAgentDatabaseRegistryChange(params.agentId);
	};
	return {
		begin() {
			if (finished) throw new Error("Agent database registration admission is closed");
			if (!active) {
				active = true;
				advance("begin");
			}
		},
		recordCommitted(receipt) {
			if (finished || !active || receipt.agentId !== params.agentId || receipt.agentPath !== params.agentPath || receipt.stateDatabasePath !== params.admission.databasePath || receipt.stateDatabaseIdentity !== params.admission.identity.key) throw new Error("Agent registration commit differs from its captured owner");
			committed = true;
			try {
				params.admission.assertCurrent();
			} catch (error) {
				invalidateRegisteredAgentDatabasesMemo(options);
				if (isStateDatabaseReadAdmissionInvalidatedError(error)) return;
				throw error;
			}
			advance("commit");
		},
		finish(settlement) {
			if (finished) return;
			finished = true;
			const uncertain = active && !committed && settlement?.kind === "unknown";
			const failures = [];
			try {
				try {
					if (uncertain) {
						const change = invalidateRegisteredAgentDatabasesMemo(options);
						if (change) params.onRegistryChange?.(change);
					}
					params.admission.assertCurrent();
				} catch (error) {
					if (isStateDatabaseReadAdmissionInvalidatedError(error)) return;
					throw error;
				} finally {
					registry.pending.delete(operation);
				}
				if (active && !uncertain) advance("finish");
			} catch (error) {
				failures.push(error);
			} finally {
				if (committed || uncertain) try {
					publishChange();
				} catch (error) {
					failures.push(error);
				}
				throwSqliteLifecycleErrors(failures, "Agent registration settlement failed");
			}
		}
	};
}
function cloneRegisteredAgentDatabases(entries, options) {
	const cloned = entries.map((entry) => ({ ...entry }));
	return options.includeIncompatibleSchemaVersions ? cloned : cloned.filter((entry) => entry.schemaVersion === 27);
}
function hasUnavailableMissingSqlitePath(pathname) {
	for (const candidate of resolveSqliteDatabaseFilePaths(pathname)) try {
		lstatSync(candidate);
		return true;
	} catch (error) {
		if (error.code !== "ENOENT") return true;
	}
	let ancestor = path.dirname(pathname);
	while (true) {
		try {
			const stat = lstatSync(ancestor);
			if (!stat.isSymbolicLink()) return !stat.isDirectory();
			try {
				return !statSync(ancestor).isDirectory();
			} catch {
				return true;
			}
		} catch (error) {
			if (error.code !== "ENOENT") return true;
		}
		const parent = path.dirname(ancestor);
		if (parent === ancestor) return false;
		ancestor = parent;
	}
}
var AgentDatabaseRegistryChangedError = class extends Error {
	constructor(message = "Agent database registry changed during discovery; retry the read.") {
		super(message);
		this.name = "AgentDatabaseRegistryChangedError";
	}
};
function readRegisteredAgentDatabases(options, artifactPreserving) {
	const pathname = resolveDatabasePath(options);
	const read = ({ db }) => readRegisteredAgentDatabaseRows(db, pathname, artifactPreserving);
	const finish = (entries) => {
		if (entries === void 0) {
			if (hasUnavailableMissingSqlitePath(pathname)) throw new Error(`OpenClaw state database ${pathname} is unavailable.`);
			return [];
		}
		return options.includeIncompatibleSchemaVersions ? entries : entries.filter((entry) => entry.schemaVersion === 27);
	};
	return artifactPreserving ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(read, options).then(finish) : finish(withExistingOpenClawStateDatabaseReadOnly(read, options));
}
/** Inspect a copied registry without creating SQLite artifacts or runtime memo state. */
async function inspectOpenClawRegisteredAgentDatabases(options = {}) {
	return readRegisteredAgentDatabases(options, true);
}
function listOpenClawRegisteredAgentDatabases(options = {}) {
	const memo = activateRegisteredAgentDatabasesMemo(options);
	return cloneRegisteredAgentDatabases(memo.entries ??= readRegisteredAgentDatabases({
		...options,
		includeIncompatibleSchemaVersions: true
	}, false), options);
}
/** Runtime discovery loads the registry through its existing read worker. */
async function listOpenClawRegisteredAgentDatabasesAsync(options = {}) {
	const snapshot = await prepareOpenClawAgentDatabaseRegistrySnapshotRead(options).read();
	if (snapshot.result.status !== "available") throw new Error(`OpenClaw state database ${resolveDatabasePath(options)} is unavailable.`);
	return snapshot.result.entries;
}
/** Scoped publication witnesses are immediate; native registry rows remain demand-driven. */
function prepareOpenClawAgentDatabaseRegistrySnapshotRead(inputOptions = {}, unchangedBy) {
	try {
		const env = cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env);
		env.OPENCLAW_STATE_DIR = resolveStateDir(env);
		const options = {
			...inputOptions,
			env,
			path: resolveDatabasePath({
				...inputOptions,
				env
			})
		};
		const context = captureOpenClawStateWorkerContext(options);
		const assertAdmissionCurrent = () => context.admission.assertCurrent();
		const inCapturedScope = AsyncLocalStorage.snapshot();
		const captureWitness = () => {
			const memo = activateRegisteredAgentDatabasesMemo(options);
			let cursor = memo;
			let invalidated = false;
			let referenceEntries = memo.entries;
			const followedRegistrations = /* @__PURE__ */ new Set();
			const unchanged = (mutation) => {
				if (!mutation || !unchangedBy) return false;
				return unchangedBy(mutation, referenceEntries);
			};
			const assertCurrent = () => {
				assertAdmissionCurrent();
				const current = registry.memo;
				if (invalidated) throw new AgentDatabaseRegistryChangedError();
				if ((unchangedBy ? [...registry.pending.values()].filter((registration) => registration.pathname === options.path && !followedRegistrations.has(registration.operation) && !unchanged(registration.mutation)) : []).length > 0) throw new AgentDatabaseRegistryChangedError("Agent database registry ownership is changing during discovery");
				while (cursor !== current) {
					const next = cursor.next;
					if (!unchangedBy || !next?.transition || next.transition.phase === "commit" && !unchanged(next.transition.mutation)) {
						invalidated = true;
						throw new AgentDatabaseRegistryChangedError();
					}
					cursor = next.memo;
				}
			};
			const followRegistration = (change) => {
				assertAdmissionCurrent();
				if (invalidated || cursor.token !== change.previous || registry.memo?.pathname !== cursor.pathname || registry.memo.token !== change.current) {
					invalidated = true;
					throw new Error("Agent registration cannot replace an invalidated registry read");
				}
				const operation = cursor.next?.transition?.operation;
				if (operation) followedRegistrations.add(operation);
				cursor = registry.memo;
			};
			return {
				memo,
				assertCurrent,
				followRegistration,
				acceptEntries(entries) {
					referenceEntries = entries;
				}
			};
		};
		const scopedWitness = unchangedBy ? captureWitness() : void 0;
		let preparedWitness = scopedWitness;
		return {
			assertAdmissionCurrent,
			assertCurrent: () => (preparedWitness?.assertCurrent ?? assertAdmissionCurrent)(),
			followRegistration(change) {
				if (!preparedWitness) throw new Error("Agent registration requires a captured registry witness");
				preparedWitness.followRegistration(change);
			},
			async read(signal) {
				for (;;) {
					signal?.throwIfAborted();
					assertAdmissionCurrent();
					const witness = scopedWitness ?? captureWitness();
					const { memo, assertCurrent, followRegistration } = witness;
					const assertReadCurrent = scopedWitness ? assertCurrent : assertAdmissionCurrent;
					preparedWitness = witness;
					assertReadCurrent();
					let entries = options.fresh ? void 0 : memo.entries;
					if (!entries) {
						const reply = await inCapturedScope(() => executeExistingOpenClawStateRead(options, { type: "agentDatabaseRegistry.read" }, {
							signal,
							current: options.fresh
						}));
						if (reply && (!reply.ok || reply.type !== "agentDatabaseRegistry.read")) throw new Error("Unexpected agent database registry read result");
						const result = reply?.result;
						assertAdmissionCurrent();
						if (!scopedWitness && memo.next) continue;
						witness.acceptEntries(result?.status === "available" ? result.entries : []);
						assertReadCurrent();
						if (result?.status === "unavailable" || result === void 0 && hasUnavailableMissingSqlitePath(options.path)) return {
							result: { status: "unavailable" },
							assertCurrent,
							followRegistration
						};
						entries = options.fresh ? result?.entries ?? [] : memo.entries ??= result?.entries ?? [];
					}
					assertReadCurrent();
					return {
						result: {
							status: "available",
							entries: cloneRegisteredAgentDatabases(entries, options)
						},
						assertCurrent,
						followRegistration
					};
				}
			}
		};
	} catch (error) {
		const rethrow = () => {
			throw error;
		};
		return {
			assertAdmissionCurrent: rethrow,
			assertCurrent: rethrow,
			followRegistration: rethrow,
			read: async () => rethrow()
		};
	}
}
//#endregion
export { readRegisteredAgentDatabaseRows as _, invalidateRegisteredAgentDatabasesMemo as a, listOpenClawRegisteredAgentDatabasesAsync as c, readOpenClawAgentDatabaseRegistryToken as d, readRegisteredAgentDatabases as f, readOpenClawAgentDatabaseRegistryRows as g, readAgentDatabasePreflightTargets as h, inspectOpenClawRegisteredAgentDatabases as i, prepareOpenClawAgentDatabaseRegistryRemoval as l, settleAgentRegistration as m, emitOpenClawAgentDatabaseRegistryChange as n, isOpenClawAgentDatabaseRegistryChange as o, recordOpenClawAgentDatabaseRegistryMutation as p, hasRegisteredOpenClawAgentDatabasePath as r, listOpenClawRegisteredAgentDatabases as s, captureOpenClawAgentDatabaseRegistration as t, prepareOpenClawAgentDatabaseRegistrySnapshotRead as u };
