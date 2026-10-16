import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { d as ensureMcpOAuthPendingSchema } from "./openclaw-state-db-schema-additive-CzAgdzE5.mjs";
import { n as assertOpenClawStateLeaseWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-Bfyut3YB.mjs";
import { i as replaceMcpOAuthStoreInDatabase, r as readMcpOAuthStoreInDatabase, t as MCP_OAUTH_PENDING_STATE_TTL_MS } from "./mcp-oauth-store.kernel-C3O_QZCi.mjs";
import { n as applyMcpOAuthMutation } from "./mcp-oauth-store.mutations-DmXh16Gm.mjs";
//#region src/agents/mcp-oauth-store.worker.ts
function assertStoreLease(database, input, stage = "transaction") {
	if (input.identity.scope !== "core:mcp-oauth" || input.identity.key !== input.storeKey) throw new Error("MCP OAuth mutation requires its exact store lease");
	assertOpenClawStateLeaseWorkerOwnedInTransaction(database, input.identity, "write", stage);
}
const pendingSchemaDatabases = /* @__PURE__ */ new WeakSet();
function ensurePendingSchema(database) {
	if (pendingSchemaDatabases.has(database)) return;
	ensureMcpOAuthPendingSchema(database);
	deferSqlitePostCommitPublication(database, () => pendingSchemaDatabases.add(database));
}
function ownedWrite(operation, pending = false) {
	return (input, { open }) => {
		const database = open();
		return runOpenClawStateWriteTransaction(({ db }) => {
			const assertOwned = () => assertStoreLease(db, input);
			if (pending) {
				assertOwned();
				ensurePendingSchema(db);
			}
			const result = operation(db, input, assertOwned);
			assertStoreLease(db, input, "commit");
			return result;
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		});
	};
}
function deletePending(database, storeKey, assertOwned) {
	assertOwned();
	executeSqliteQuerySync(database, getNodeSqliteKysely(database).deleteFrom("mcp_oauth_pending_authorizations").where("store_key", "=", storeKey));
}
const mcpOAuthOperations = {
	"mcpOAuth.read": (input, { open }) => readMcpOAuthStoreInDatabase(open().db, input),
	"mcpOAuth.mutate": ownedWrite((database, input, assertOwned) => {
		const result = applyMcpOAuthMutation(readMcpOAuthStoreInDatabase(database, input.storeKey), input.mutation);
		replaceMcpOAuthStoreInDatabase(database, input.storeKey, result.store, assertOwned);
		return result;
	}),
	"mcpOAuth.consumePending": ownedWrite((database, input, assertOwned) => {
		assertOwned();
		return executeSqliteQuerySync(database, getNodeSqliteKysely(database).deleteFrom("mcp_oauth_pending_authorizations").where("store_key", "=", input.storeKey).where("state", "=", input.state).where("create_time", ">", Date.now() - MCP_OAUTH_PENDING_STATE_TTL_MS)).numAffectedRows === 1n;
	}, true),
	"mcpOAuth.writePending": ownedWrite((database, input, assertOwned) => {
		const kysely = getNodeSqliteKysely(database);
		const now = Date.now();
		assertOwned();
		executeSqliteQuerySync(database, kysely.deleteFrom("mcp_oauth_pending_authorizations").where("create_time", "<=", now - MCP_OAUTH_PENDING_STATE_TTL_MS));
		deletePending(database, input.storeKey, assertOwned);
		assertOwned();
		executeSqliteQuerySync(database, kysely.insertInto("mcp_oauth_pending_authorizations").values({
			state: input.state,
			store_key: input.storeKey,
			create_time: now
		}));
	}, true),
	"mcpOAuth.deletePending": ownedWrite((database, input, assertOwned) => deletePending(database, input.storeKey, assertOwned), true),
	"mcpOAuth.clear": ownedWrite((database, input, assertOwned) => {
		replaceMcpOAuthStoreInDatabase(database, input.storeKey, { credentialState: "cleared" }, assertOwned);
		deletePending(database, input.storeKey, assertOwned);
	}, true),
	"mcpOAuth.clearPendingPrefix": (input, { open }) => {
		const database = open();
		runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			ensurePendingSchema(db);
			executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("mcp_oauth_pending_authorizations").where("store_key", "like", `${input}%`));
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		});
	}
};
//#endregion
export { mcpOAuthOperations };
