import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { r as clearOpenClawAgentDatabaseValidationCache } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { c as withSqliteIntegrityWorkerScope } from "./openclaw-agent-db-schema-kFBuwbLx.mjs";
import { a as assertNoOpenClawAgentDatabaseLeases, t as AGENT_DATABASE_MAINTENANCE_LEASE, v as runWithAgentDatabaseMaintenanceAuthority } from "./openclaw-agent-db-lease-D8zYIRzn.mjs";
import { s as closeOpenClawAgentDatabasesAsync } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-CdKflcqg.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-agent-db-maintenance-lease.ts
const activeMaintenance = new AsyncLocalStorage();
async function runMaintenanceScope(databasePath, owner, run, ancestors = []) {
	const scope = {
		databasePath,
		owner,
		ancestors,
		active: true,
		accepting: true,
		pending: [],
		ownership: ancestors[0]?.ownership ?? {}
	};
	const assertCurrent = () => {
		if (!scope.active || ancestors.some((parent) => !parent.active)) throw new Error("Agent database maintenance scope is closed");
		if (scope.ownership.failure) throw scope.ownership.failure.error;
		try {
			owner.assertOwned();
		} catch (error) {
			scope.ownership.failure = { error };
			throw error;
		}
	};
	const assertAdmission = () => {
		assertCurrent();
		if (!scope.accepting) throw new Error("Agent database maintenance admission is closed");
	};
	const lease = {
		signal: owner.signal,
		assertOwned: assertCurrent,
		assertOwnedInTransaction(database) {
			assertCurrent();
			owner.assertOwnedInTransaction(database);
		},
		...owner.renew ? { renew() {
			assertAdmission();
			owner.renew();
		} } : {}
	};
	try {
		return await withSqliteIntegrityWorkerScope(assertCurrent, () => activeMaintenance.run(scope, () => runWithAgentDatabaseMaintenanceAuthority(lease, databasePath, async () => {
			let outcome;
			try {
				assertCurrent();
				outcome = { value: await run(lease) };
			} catch (error) {
				outcome = { error };
			}
			scope.accepting = false;
			const errors = "error" in outcome ? [outcome.error] : [];
			let joined = 0;
			while (joined < scope.pending.length) {
				const admitted = scope.pending.slice(joined);
				joined += admitted.length;
				for (const result of await Promise.allSettled(admitted)) if (result.status === "rejected" && !errors.includes(result.reason)) errors.push(result.reason);
			}
			try {
				assertCurrent();
			} catch (error) {
				if (!errors.includes(error)) errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, "Agent maintenance and nested work failed");
			if ("error" in outcome) throw outcome.error;
			return outcome.value;
		})));
	} finally {
		scope.active = false;
	}
}
/** Retain one real lease through nested Doctor work; serialized selectors grant no authority. */
function withAgentDatabaseMaintenanceLease(options, run) {
	const databasePath = path.resolve(resolveOpenClawStateSqlitePath(options.env));
	const active = activeMaintenance.getStore();
	if (active) {
		if (!active.active || !active.accepting) return Promise.reject(/* @__PURE__ */ new Error("Agent database maintenance admission is closed"));
		if (active.databasePath !== databasePath) return Promise.reject(/* @__PURE__ */ new Error("Nested agent maintenance cannot switch its state database"));
		const admitted = runMaintenanceScope(databasePath, active.owner, run, [...active.ancestors, active]);
		active.pending.push(admitted);
		admitted.catch(() => void 0);
		return admitted;
	}
	return withOpenClawStateLease({
		...AGENT_DATABASE_MAINTENANCE_LEASE,
		database: {
			scope: "shared",
			options,
			schemaPolicy: options.schemaPolicy
		},
		leaseMs: options.leaseMs ?? 6e4,
		waitMs: 5e3,
		prepareDatabase: true,
		heartbeat: "worker",
		processBound: options.processBound,
		leaseLabel: "agent database maintenance lease",
		operationLabel: "agent.database.maintenance.lease"
	}, (maintenance) => runMaintenanceScope(databasePath, maintenance, async (lease) => {
		await closeOpenClawAgentDatabasesAsync();
		assertNoOpenClawAgentDatabaseLeases(lease, options);
		clearOpenClawAgentDatabaseValidationCache();
		return run(lease);
	}));
}
//#endregion
export { withAgentDatabaseMaintenanceLease as t };
