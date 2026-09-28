import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { C as withStateDatabaseCoordinatorRuntimeDirectory } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { o as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-eRv24eIu.mjs";
import { c as withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync, t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import "./openclaw-agent-db-contract-DzsRD6Fl.mjs";
import { r as readRegisteredAgentDatabaseRows } from "./openclaw-agent-db-registry.read-CZdmnVd_.mjs";
import { lstatSync, statSync } from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-agent-db-registry-listing.ts
const registry = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseRegistryMemo"), () => ({}));
function resolveAgentDatabaseRegistryPath(options) {
	return path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
}
function activateRegisteredAgentDatabasesMemo(options) {
	const pathname = resolveAgentDatabaseRegistryPath(options);
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
	const pathname = resolveAgentDatabaseRegistryPath(options);
	if (registry.memo?.pathname === pathname) registry.memo = {
		pathname,
		token: Symbol(pathname)
	};
}
/** Publish only registration witnessed at COMMIT, under its original shared generation. */
function captureOpenClawAgentDatabaseRegistration(params) {
	const options = { path: params.admission.databasePath };
	let active = false;
	let committed = false;
	let finished = false;
	return {
		begin() {
			if (finished) throw new Error("Agent database registration admission is closed");
			if (!active) {
				active = true;
				invalidateRegisteredAgentDatabasesMemo(options);
			}
		},
		recordCommitted(receipt) {
			if (finished || !active || receipt.agentId !== params.agentId || receipt.agentPath !== params.agentPath || receipt.stateDatabasePath !== params.admission.databasePath || receipt.stateDatabaseIdentity !== params.admission.identity.key) throw new Error("Agent registration commit differs from its captured owner");
			committed = true;
		},
		finish() {
			if (finished) return;
			finished = true;
			try {
				params.admission.assertCurrent();
			} catch (error) {
				if (isStateDatabaseReadAdmissionInvalidatedError(error)) return;
				throw error;
			}
			if (active) invalidateRegisteredAgentDatabasesMemo(options);
			if (committed) sessionChanges.emit({
				all: true,
				scope: "stores"
			});
		}
	};
}
function cloneRegisteredAgentDatabases(entries) {
	return entries.map((entry) => ({ ...entry }));
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
function readRegisteredAgentDatabases(options, artifactPreserving) {
	const pathname = resolveAgentDatabaseRegistryPath(options);
	const read = ({ db }) => readRegisteredAgentDatabaseRows(db, pathname, artifactPreserving);
	const finish = (entries) => {
		if (entries === void 0) {
			if (hasUnavailableMissingSqlitePath(pathname)) throw new Error(`OpenClaw state database ${pathname} is unavailable.`);
			return [];
		}
		return options.includeIncompatibleSchemaVersions ? entries : entries.filter((entry) => entry.schemaVersion === 23);
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
	if (memo.entries) {
		const entries = cloneRegisteredAgentDatabases(memo.entries);
		return options.includeIncompatibleSchemaVersions ? entries : entries.filter((entry) => entry.schemaVersion === 23);
	}
	const entries = readRegisteredAgentDatabases({
		...options,
		includeIncompatibleSchemaVersions: true
	}, false);
	memo.entries = entries;
	const cloned = cloneRegisteredAgentDatabases(entries);
	return options.includeIncompatibleSchemaVersions ? cloned : cloned.filter((entry) => entry.schemaVersion === 23);
}
/** Capture authority now, but activate the canonical memo only if discovery needs it. */
function prepareOpenClawAgentDatabaseRegistrySnapshotRead(inputOptions = {}) {
	try {
		const env = cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env);
		env.OPENCLAW_STATE_DIR = resolveStateDir(env);
		const options = {
			...inputOptions,
			env,
			path: resolveAgentDatabaseRegistryPath({
				...inputOptions,
				env
			})
		};
		const context = captureOpenClawStateWorkerContext(options);
		const inCapturedScope = AsyncLocalStorage.snapshot();
		return { async read() {
			context.admission.assertCurrent();
			const memo = activateRegisteredAgentDatabasesMemo(options);
			const assertCurrent = () => {
				context.admission.assertCurrent();
				if (registry.memo !== memo) throw new Error("Agent database registry changed during discovery; retry the read.");
			};
			if (!memo.entries) {
				const reply = await inCapturedScope(() => withStateDatabaseCoordinatorRuntimeDirectory(context.coordinatorRuntime, () => executeExistingOpenClawStateRead(options, { type: "agentDatabaseRegistry.read" })));
				if (reply && (!reply.ok || reply.type !== "agentDatabaseRegistry.read")) throw new Error("Unexpected agent database registry read result");
				const result = reply?.result;
				assertCurrent();
				if (result?.status === "unavailable" || result === void 0 && hasUnavailableMissingSqlitePath(options.path)) return {
					result: { status: "unavailable" },
					assertCurrent
				};
				memo.entries ??= result?.entries ?? [];
			}
			const entries = cloneRegisteredAgentDatabases(memo.entries);
			assertCurrent();
			return {
				result: {
					status: "available",
					entries: options.includeIncompatibleSchemaVersions ? entries : entries.filter((entry) => entry.schemaVersion === 23)
				},
				assertCurrent
			};
		} };
	} catch (error) {
		return { async read() {
			throw error;
		} };
	}
}
//#endregion
export { prepareOpenClawAgentDatabaseRegistrySnapshotRead as a, listOpenClawRegisteredAgentDatabases as i, inspectOpenClawRegisteredAgentDatabases as n, readOpenClawAgentDatabaseRegistryToken as o, invalidateRegisteredAgentDatabasesMemo as r, readRegisteredAgentDatabases as s, captureOpenClawAgentDatabaseRegistration as t };
