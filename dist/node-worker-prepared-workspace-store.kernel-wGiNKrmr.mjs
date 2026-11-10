import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { p as ensureNodeWorkerPreparedWorkspaceSchema } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as nodePreparedWorkspacePublication } from "./node-worker-prepared-workspace-publication-BVABEP6T.mjs";
//#region src/node-host/node-worker-prepared-workspace-store.kernel.ts
const TABLE = "node_worker_prepared_workspaces";
function query(db) {
	return getNodeSqliteKysely(db);
}
function selectRow(db, preparationKey) {
	return executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(TABLE).selectAll().where("preparation_key", "=", preparationKey));
}
function requireUnchanged(row, expected) {
	if (!row || JSON.stringify(row) !== JSON.stringify(expected)) throw new Error("INVALID_REQUEST: prepared workspace ownership changed");
	return row;
}
/** One fresh dedicated node owns one immutable registration and one session binding. */
var NodeWorkerPreparedWorkspaceKernel = class {
	constructor(options) {
		this.options = options;
	}
	write(operationLabel, operation) {
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: { kind: "node-worker-journal" }
			});
			const { result, receipt } = nodePreparedWorkspacePublication.capture(db, () => operation(db));
			deferSqliteWorkerCommitReceipt(db, {
				kind: "node-prepared-workspace",
				receipt: nodePreparedWorkspacePublication.bound(receipt)
			}, receipt.facts.size === 0 ? "settlement" : "commit");
			return result;
		}, this.options, { operationLabel });
	}
	find(environmentId) {
		return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
			if (!tableExists(db, TABLE)) return;
			const rows = executeSqliteQuerySync(db, query(db).selectFrom(TABLE).selectAll().limit(2)).rows;
			if (rows.length > 1 || rows[0] && rows[0].environment_id !== environmentId) throw new Error("INVALID_REQUEST: this prepared node belongs to another environment");
			return rows[0];
		}, this.options);
	}
	list(gatewayNamespace) {
		return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
			if (!tableExists(db, TABLE)) return [];
			return executeSqliteQuerySync(db, query(db).selectFrom(TABLE).selectAll().where("gateway_namespace", "=", gatewayNamespace)).rows;
		}, this.options) ?? [];
	}
	register(input) {
		return this.write("prepared-workspace.register", (db) => {
			ensureNodeWorkerPreparedWorkspaceSchema(db);
			const existing = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(TABLE).selectAll().limit(1));
			if (existing) {
				if (existing.state !== "available" || existing.preparation_key !== input.preparationKey || existing.cache_key !== input.cacheKey || existing.gateway_namespace !== input.gatewayNamespace || existing.environment_id !== input.environmentId || existing.workspace_dir !== input.workspaceDir || existing.home_dir !== input.homeDir || existing.source_manifest_ref !== input.sourceManifestRef || existing.prepared_manifest_ref !== input.preparedManifestRef) throw new Error("INVALID_REQUEST: this node already owns a prepared workspace");
				return existing;
			}
			const row = {
				preparation_key: input.preparationKey,
				cache_key: input.cacheKey,
				gateway_namespace: input.gatewayNamespace,
				environment_id: input.environmentId,
				workspace_dir: input.workspaceDir,
				home_dir: input.homeDir,
				source_manifest_ref: input.sourceManifestRef,
				prepared_manifest_ref: input.preparedManifestRef,
				state: "available",
				session_id: null,
				session_key: null,
				owner_epoch: null,
				created_at_ms: Date.now(),
				bound_at_ms: null,
				retired_at_ms: null
			};
			executeSqliteQuerySync(db, query(db).insertInto(TABLE).values(row));
			nodePreparedWorkspacePublication.stagePostimages(db, [row]);
			return row;
		});
	}
	bind(input) {
		return this.write("prepared-workspace.bind", (db) => {
			if (!tableExists(db, TABLE)) throw new Error("INVALID_REQUEST: prepared workspace registration is missing");
			const row = selectRow(db, input.preparationKey);
			if (!row || row.cache_key !== input.cacheKey || row.gateway_namespace !== input.gatewayNamespace || row.environment_id !== input.environmentId) throw new Error("INVALID_REQUEST: prepared workspace registration does not match this environment");
			if (row.state === "bound" && row.session_id === input.sessionId && row.session_key === input.sessionKey && row.owner_epoch === input.ownerEpoch) return row;
			if (row.state !== "available" || row.session_id !== null || row.session_key !== null || row.owner_epoch !== null || row.bound_at_ms !== null) throw new Error("INVALID_REQUEST: prepared workspace has already been consumed");
			const bound = {
				...row,
				state: "bound",
				session_id: input.sessionId,
				session_key: input.sessionKey,
				owner_epoch: input.ownerEpoch,
				bound_at_ms: Math.max(Date.now(), row.created_at_ms)
			};
			executeSqliteQuerySync(db, query(db).updateTable(TABLE).set(bound).where("preparation_key", "=", input.preparationKey));
			nodePreparedWorkspacePublication.stagePostimages(db, [bound]);
			return bound;
		});
	}
	completeMutation(retiring) {
		this.write("prepared-workspace.finish-mutation", (db) => {
			requireUnchanged(selectRow(db, retiring.preparation_key), retiring);
			executeSqliteQuerySync(db, query(db).updateTable(TABLE).set({ state: "bound" }).where("preparation_key", "=", retiring.preparation_key));
			nodePreparedWorkspacePublication.stagePostimages(db, [{
				...retiring,
				state: "bound"
			}]);
		});
	}
	retire(expected, completed = false) {
		return this.write("prepared-workspace.retire", (db) => {
			const row = requireUnchanged(selectRow(db, expected.preparation_key), expected);
			if (row.state === "retired") return row;
			const retired = {
				...row,
				state: completed ? "retired" : "retiring",
				retired_at_ms: completed ? Math.max(Date.now(), row.bound_at_ms ?? row.created_at_ms) : null
			};
			executeSqliteQuerySync(db, query(db).updateTable(TABLE).set(retired).where("preparation_key", "=", row.preparation_key));
			nodePreparedWorkspacePublication.stagePostimages(db, [retired]);
			return retired;
		});
	}
};
//#endregion
export { NodeWorkerPreparedWorkspaceKernel as t };
