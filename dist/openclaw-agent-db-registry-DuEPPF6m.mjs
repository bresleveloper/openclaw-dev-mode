import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { a as resolveOpenClawRegisteredAgentDatabasePath, i as resolveOpenClawAgentDatabaseStoredPath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as isSameOpenClawAgentDatabasePath, i as isPersistentOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { x as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { f as prepareAgentDeletionPathFence, n as assertAgentDeletionPathFence } from "./agent-deletion-journal-DpYVtbBb.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { n as emitOpenClawAgentDatabaseRegistryChange, p as recordOpenClawAgentDatabaseRegistryMutation } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { b as setOpenClawAgentDatabaseValidation, h as invalidateOpenClawAgentDatabaseValidationsForAgent, m as invalidateOpenClawAgentDatabaseValidation, t as adoptOpenClawAgentDatabaseSchema } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { statSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-agent-db-registry.ts
function resolveRegisteredAgentDatabaseStoredPath(database, params) {
	const storedPath = resolveOpenClawAgentDatabaseStoredPath(database.path, params.path);
	if (params.path !== resolveIdentityPathViaExistingAncestorSync(params.path)) return storedPath;
	const db = getNodeSqliteKysely(database.db);
	const { rows } = executeSqliteQuerySync(database.db, db.selectFrom("agent_databases").select("path").where("agent_id", "=", params.agentId));
	return rows.some((row) => row.path === storedPath) ? storedPath : rows.find((row) => isSameOpenClawAgentDatabasePath(resolveOpenClawRegisteredAgentDatabasePath(database.path, row.path), params.path))?.path ?? storedPath;
}
function registerOpenClawAgentDatabase(params, observer) {
	if (!isPersistentOpenClawAgentDatabasePath(params.path, params.env)) {
		if (params.admittedDb) setOpenClawAgentDatabaseValidation({
			...params,
			db: params.admittedDb
		});
		return;
	}
	const deletionFence = prepareAgentDeletionPathFence({
		agentId: params.agentId,
		path: params.path
	}, { env: params.env });
	let sizeBytes = null;
	try {
		sizeBytes = statSync(params.path).size;
	} catch {
		sizeBytes = null;
	}
	const lastSeenAt = Date.now();
	observer?.starting?.();
	runOpenClawStateWriteTransaction((database) => {
		assertAgentDeletionPathFence(database, deletionFence);
		const storedPath = resolveRegisteredAgentDatabaseStoredPath(database, params);
		const db = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, db.insertInto("agent_databases").values({
			agent_id: params.agentId,
			path: storedPath,
			schema_version: params.schemaVersion ?? 27,
			last_seen_at: lastSeenAt,
			size_bytes: sizeBytes
		}).onConflict((conflict) => conflict.columns(["agent_id", "path"]).doUpdateSet({
			schema_version: params.schemaVersion ?? 27,
			last_seen_at: lastSeenAt,
			size_bytes: sizeBytes
		})));
		recordOpenClawAgentDatabaseRegistryMutation(database, "upsert", [params]);
		const onCommitted = observer?.committed;
		if (onCommitted) {
			const receipt = Object.freeze({
				agentId: params.agentId,
				agentPath: params.path,
				stateDatabasePath: database.path,
				stateDatabaseIdentity: requireOpenClawStateDatabaseIdentity(database).key
			});
			if (!stageSqliteTransactionState(database.db, {
				stage() {},
				rollback() {},
				commit: () => onCommitted(receipt)
			})) throw new Error("Agent registration requires its canonical transaction publication scope");
		}
		emitOpenClawAgentDatabaseRegistryChange(params.agentId, database.db);
	}, {
		env: params.env,
		initializationAgentPaths: [params.path]
	});
	if (params.admittedDb) {
		const database = {
			...params,
			db: params.admittedDb
		};
		if (!adoptOpenClawAgentDatabaseSchema(database)) setOpenClawAgentDatabaseValidation(database);
	} else invalidateOpenClawAgentDatabaseValidation(params.path);
}
function unregisterOpenClawAgentDatabase(params) {
	runOpenClawStateWriteTransaction((database) => {
		const storedPath = resolveRegisteredAgentDatabaseStoredPath(database, params);
		const matchingPaths = [.../* @__PURE__ */ new Set([
			storedPath,
			params.path,
			path.resolve(params.path)
		])];
		const db = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, db.deleteFrom("agent_databases").where("agent_id", "=", params.agentId).where("path", "in", matchingPaths));
		recordOpenClawAgentDatabaseRegistryMutation(database, "remove", [params]);
		emitOpenClawAgentDatabaseRegistryChange(params.agentId, database.db);
	}, {
		env: params.env,
		initializationAgentPaths: [params.path]
	});
	invalidateOpenClawAgentDatabaseValidation(params.path);
}
/** Remove every durable database registration owned by a deleted agent. */
function unregisterOpenClawAgentDatabases(params) {
	const options = {
		env: params.env,
		...params.database ? {
			database: params.database,
			path: params.database.path
		} : {}
	};
	const removedPaths = runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const removed = executeSqliteQuerySync(database.db, db.deleteFrom("agent_databases").where("agent_id", "=", params.agentId).returning("path"));
		recordOpenClawAgentDatabaseRegistryMutation(database, "remove", removed.rows.map((row) => ({
			agentId: params.agentId,
			path: resolveOpenClawRegisteredAgentDatabasePath(database.path, row.path)
		})));
		emitOpenClawAgentDatabaseRegistryChange(params.agentId, database.db);
		return removed.rows.map((row) => resolveOpenClawRegisteredAgentDatabasePath(database.path, row.path));
	}, options);
	invalidateOpenClawAgentDatabaseValidationsForAgent(params.agentId, removedPaths);
}
//#endregion
export { unregisterOpenClawAgentDatabase as n, unregisterOpenClawAgentDatabases as r, registerOpenClawAgentDatabase as t };
