import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { a as inspectDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { r as resolveDatabasePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-BEC3zbaw.mjs";
import "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly, t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { r as readRegisteredAgentDatabaseRows } from "./openclaw-agent-db-registry.read-DUQ6FrvR.mjs";
import { lstatSync, statSync } from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-agent-db-registry-listing.ts
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
				schemaVersion: source.schemaVersion ?? 24
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
/** Stage exact registry facts at the same native transaction boundary as their rows. */
function recordOpenClawAgentDatabaseRegistryMutation(database, kind, sources) {
	const operation = Symbol("agent-registry-mutation");
	const mutation = captureRegistryMutation(kind, sources);
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
/** Fence native registration settlement under its original shared generation. */
function captureOpenClawAgentDatabaseRegistration(params) {
	const options = { path: params.admission.databasePath };
	const operation = Symbol("agent-registry-registration");
	const mutation = captureRegistryMutation("upsert", [{
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
	return options.includeIncompatibleSchemaVersions ? cloned : cloned.filter((entry) => entry.schemaVersion === 24);
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
		return options.includeIncompatibleSchemaVersions ? entries : entries.filter((entry) => entry.schemaVersion === 24);
	};
	return artifactPreserving ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(read, options).then(finish) : finish(withExistingOpenClawStateDatabaseReadOnly(read, options));
}
/** Inspect a copied registry without creating SQLite artifacts or runtime memo state. */
async function inspectOpenClawRegisteredAgentDatabases(options = {}) {
	return readRegisteredAgentDatabases(options, true);
}
/** List agent databases recorded in the shared OpenClaw state registry. */
function listOpenClawRegisteredAgentDatabases(options = {}) {
	const memo = activateRegisteredAgentDatabasesMemo(options);
	return cloneRegisteredAgentDatabases(memo.entries ??= readRegisteredAgentDatabases({
		...options,
		includeIncompatibleSchemaVersions: true
	}, false), options);
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
				context.admission.assertCurrent();
				const current = registry.memo;
				if (invalidated) throw new AgentDatabaseRegistryChangedError();
				if (unchangedBy && [...registry.pending.values()].some((pending) => pending.pathname === options.path && !followedRegistrations.has(pending.operation) && !unchanged(pending.mutation))) throw new AgentDatabaseRegistryChangedError("Agent database registry ownership is changing during discovery");
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
				context.admission.assertCurrent();
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
		let assertPreparedCurrent = scopedWitness?.assertCurrent ?? (() => context.admission.assertCurrent());
		return {
			assertCurrent: () => assertPreparedCurrent(),
			async read(signal) {
				signal?.throwIfAborted();
				context.admission.assertCurrent();
				const witness = scopedWitness ?? captureWitness();
				const { memo, assertCurrent, followRegistration } = witness;
				assertPreparedCurrent = assertCurrent;
				assertCurrent();
				if (!memo.entries) {
					const reply = await inCapturedScope(() => executeExistingOpenClawStateRead(options, { type: "agentDatabaseRegistry.read" }, { signal }));
					if (reply && (!reply.ok || reply.type !== "agentDatabaseRegistry.read")) throw new Error("Unexpected agent database registry read result");
					const result = reply?.result;
					witness.acceptEntries(result?.status === "available" ? result.entries : []);
					assertCurrent();
					if (result?.status === "unavailable" || result === void 0 && hasUnavailableMissingSqlitePath(options.path)) return {
						result: { status: "unavailable" },
						assertCurrent,
						followRegistration
					};
					memo.entries ??= result?.entries ?? [];
				}
				const entries = cloneRegisteredAgentDatabases(memo.entries, options);
				assertCurrent();
				return {
					result: {
						status: "available",
						entries
					},
					assertCurrent,
					followRegistration
				};
			}
		};
	} catch (error) {
		return {
			assertCurrent() {
				throw error;
			},
			async read() {
				throw error;
			}
		};
	}
}
//#endregion
export { invalidateRegisteredAgentDatabasesMemo as a, prepareOpenClawAgentDatabaseRegistrySnapshotRead as c, recordOpenClawAgentDatabaseRegistryMutation as d, inspectOpenClawRegisteredAgentDatabases as i, readOpenClawAgentDatabaseRegistryToken as l, captureOpenClawAgentDatabaseRegistration as n, isOpenClawAgentDatabaseRegistryChange as o, emitOpenClawAgentDatabaseRegistryChange as r, listOpenClawRegisteredAgentDatabases as s, AgentDatabaseRegistryChangedError as t, readRegisteredAgentDatabases as u };
