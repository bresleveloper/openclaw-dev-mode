import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { R as revokeSqliteDatabaseAdmissions, b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { f as registerSqliteSchemaMutationListener } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { o as getStateRuntimeSchemaAdmission } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { a as readTrackedStateDatabaseIdentity } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
//#region src/state/openclaw-state-db-integrity-admission.ts
const bindings = resolveGlobalSingleton(Symbol.for("openclaw.stateIntegrityBindings"), () => /* @__PURE__ */ new WeakMap());
const integrityKey = {
	name: "state.integrity",
	read: (value) => value === true ? true : void 0
};
function hasStateDatabaseIntegrityAdmission(database) {
	return Boolean(getStateRuntimeSchemaAdmission(database) || getSqliteDatabaseAdmission(database, integrityKey));
}
/** Ordinary opens share physical-file proof; Doctor calls the uncached integrity owner. */
function assertStateDatabaseIntegrityOnce(database, pathname) {
	if (!hasStateDatabaseIntegrityAdmission(database)) {
		assertSqliteIntegrity(database, pathname);
		publishSqliteDatabaseAdmission(database, integrityKey, true);
	}
}
function invalidate(revision) {
	let previous = Atomics.load(revision, 0);
	while (previous >= 0n) {
		const observed = Atomics.compareExchange(revision, 0, previous, previous + 1n);
		if (observed === previous) return;
		previous = observed;
	}
}
/** Corruption observed in an isolate revokes the exact host proof borrowed by its native handle. */
function invalidateOpenClawStateRuntimeIntegrity(database) {
	revokeSqliteDatabaseAdmissions(database);
	const bound = bindings.get(database);
	if (bound) {
		invalidate(new BigInt64Array(bound.revision));
		invalidate(new BigInt64Array(bound.lifetimeRevision));
	}
}
/** Native bindings revoke borrowed proof; the host generation alone owns its lifetime. */
function bind(database, admission) {
	if (bindings.get(database)?.revision === admission.revision) return;
	bindings.get(database)?.release();
	const revision = new BigInt64Array(admission.revision);
	const unobserve = registerSqliteSchemaMutationListener(database, () => invalidate(revision));
	const release = () => {
		unobserve();
		unregister();
	};
	const unregister = registerNodeSqliteDisposeCallback(database, (reason) => {
		if (reason === "replace") {
			invalidate(revision);
			invalidate(new BigInt64Array(admission.lifetime.revision));
		}
		release();
	});
	bindings.set(database, {
		revision: admission.revision,
		lifetimeRevision: admission.lifetime.revision,
		release
	});
}
/** Reuse only completed integrity proof; shape and mutable metadata retain their admission owners. */
function assertOpenClawStateRuntimeIntegrity(database, pathname, schema, admission, policy = "verify") {
	const identity = admission && readTrackedStateDatabaseIdentity(database);
	if (!admission || !identity || !identity.key.startsWith("file:") || identity.key !== admission.identity.key || identity.birthtime !== admission.identity.birthtime) {
		if (policy === "require-proof") throw new Error("Shared-state reader requires current worker integrity proof");
		assertStateDatabaseIntegrityOnce(database, pathname);
		return;
	}
	bind(database, admission);
	const revision = new BigInt64Array(admission.revision);
	const proof = new BigInt64Array(admission.proof);
	const metadata = BigInt.asIntN(64, BigInt(schema.userVersion >>> 0) << 32n | BigInt(schema.schemaVersion >>> 0));
	const observed = Atomics.load(proof, 0);
	if (Atomics.load(revision, 0) === admission.epoch && observed !== -1n) {
		if (observed === metadata && Atomics.load(revision, 0) === admission.epoch && hasStateDatabaseIntegrityAdmission(database)) return;
		invalidate(revision);
	}
	if (policy === "require-proof") throw new Error("Shared-state reader requires current worker integrity proof");
	assertStateDatabaseIntegrityOnce(database, pathname);
	const publish = () => {
		if (Atomics.load(revision, 0) === admission.epoch) Atomics.store(proof, 0, metadata);
	};
	return () => {
		if (database.isTransaction) stageSqliteTransactionState(database, {
			stage() {},
			rollback() {},
			commit: publish
		});
		else publish();
	};
}
//#endregion
export { assertStateDatabaseIntegrityOnce as n, invalidateOpenClawStateRuntimeIntegrity as r, assertOpenClawStateRuntimeIntegrity as t };
