import "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission, d as hasPendingSqliteDatabaseSchemaMutation } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { _ as schemaAdmission, i as getAdmittedSqliteSchemaFacts, t as admitSqliteSchema, u as isSqliteSchemaAdmissionCold } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { l as prepareSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as getPostgresPhysicalFacts } from "./physical-facts-Cvtfrs3r.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-BnRd2KGO.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as readSqliteUserVersion, n as createNewerSqliteSchemaVersionError } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { r as normalizeOpenClawStateSchemaReadError } from "./openclaw-state-db-schema-migration-required-DmM7omMC.mjs";
//#region src/state/openclaw-state-db-admission.ts
function getStateSchemaFacts(database) {
	return isPostgresSqlConnection(database) ? getPostgresPhysicalFacts(database) : getAdmittedSqliteSchemaFacts(database);
}
const versionKey = {
	name: "state.schema-version",
	schemaDependent: true,
	read(value) {
		if (typeof value === "object" && value !== null && "userVersion" in value && typeof value.userVersion === "number" && "contentVersion" in value && typeof value.contentVersion === "number") return {
			userVersion: value.userVersion,
			contentVersion: value.contentVersion
		};
	}
};
/** Row-backed metadata is valid only for its admitted schema, even if replacement DDL has the same shape. */
function createStateSchemaAdmission(name, read) {
	const key = {
		name,
		schemaDependent: true,
		read(input) {
			if (typeof input !== "object" || input === null || !("value" in input) || !("admissionId" in input) || typeof input.admissionId !== "string") return;
			const value = read(input.value);
			return value === void 0 ? void 0 : {
				value,
				admissionId: input.admissionId
			};
		}
	};
	return {
		get(database) {
			if (hasPendingSqliteDatabaseSchemaMutation(database)) return;
			const admitted = getSqliteDatabaseAdmission(database, key);
			if (!admitted) return;
			const schema = getStateSchemaFacts(database);
			return admitted.admissionId === schema?.admissionId ? admitted.value : void 0;
		},
		publish(database, value) {
			if (!isPostgresSqlConnection(database) && isSqliteSchemaAdmissionCold(database)) admitSqliteSchema(database);
			const schema = getStateSchemaFacts(database);
			if (!schema || !isPostgresSqlConnection(database) && getSqliteDatabaseAdmission(database, schemaAdmission)?.admissionId !== schema.admissionId) return;
			getStateSchemaVersionAdmission(database);
			const admitted = {
				value,
				admissionId: schema.admissionId
			};
			publishSqliteDatabaseAdmission(database, key, admitted);
		}
	};
}
const runtimeAdmission = createStateSchemaAdmission("state.runtime-schema", (value) => typeof value === "object" && value !== null && "startupReady" in value && typeof value.startupReady === "boolean" ? { startupReady: value.startupReady } : void 0);
const connectionVersions = /* @__PURE__ */ new WeakMap();
function rememberConnectionVersion(database, value) {
	const previous = connectionVersions.get(database);
	const install = (entry) => {
		if (entry) connectionVersions.set(database, entry);
		else connectionVersions.delete(database);
	};
	if (!stageSqliteTransactionState(database, {
		stage: () => install(value),
		commit: () => {},
		rollback: () => install(previous)
	})) install(value);
}
function schemaVersionKey(admissionId) {
	return {
		name: `state.schema-version:${admissionId}`,
		read: versionKey.read
	};
}
function getStateSchemaVersionAdmission(database) {
	const schema = getStateSchemaFacts(database);
	if (!schema) return;
	const retained = connectionVersions.get(database);
	if (retained?.schema === schema) return retained.facts;
	const history = getSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId));
	const currentSchema = history ? void 0 : getSqliteDatabaseAdmission(database, schemaAdmission);
	if (!history && !isPostgresSqlConnection(database) && currentSchema?.admissionId !== schema.admissionId) return;
	const facts = history ?? getSqliteDatabaseAdmission(database, versionKey);
	if (facts) {
		rememberConnectionVersion(database, {
			schema,
			facts
		});
		if (!history) publishSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId), facts);
	}
	return facts;
}
/** A cold snapshot may discover historical facts without replacing a newer publication. */
function rememberStateSchemaVersionAdmission(database, facts) {
	const schema = getStateSchemaFacts(database);
	if (!schema) return;
	rememberConnectionVersion(database, {
		schema,
		facts
	});
	const current = getSqliteDatabaseAdmission(database, schemaAdmission);
	if (!isPostgresSqlConnection(database) && current?.admissionId !== schema.admissionId) return;
	publishSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId), facts);
	publishSqliteDatabaseAdmission(database, versionKey, facts);
}
function publishStateSchemaVersionAdmission(database, facts) {
	publishSqliteDatabaseAdmission(database, versionKey, facts);
	const schema = getStateSchemaFacts(database);
	if (schema) {
		rememberConnectionVersion(database, {
			schema,
			facts
		});
		publishSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId), facts);
	} else rememberConnectionVersion(database);
}
/** Runtime shape and integrity are physical-file facts, independent of live write authority. */
function getStateRuntimeSchemaAdmission(database) {
	return runtimeAdmission.get(database);
}
function publishStateRuntimeSchemaAdmission(database, startupReady) {
	runtimeAdmission.publish(database, { startupReady });
}
//#endregion
//#region src/state/openclaw-state-db-schema-version.ts
const CONTENT_VERSION_KEY = "state.schema.contentVersion";
const contentVersionQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, () => getNodeSqliteKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", CONTENT_VERSION_KEY)));
/** Content and its marker commit together, even while older readers retain their version floor. */
function readStateSchemaContentVersion(db, published, readRow = readStateSchemaContentVersionRow) {
	if (isPostgresSqlConnection(db)) {
		const facts = getStateSchemaVersionAdmission(db);
		if (!facts) throw new Error("Missing PostgreSQL state schema admission; use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.");
		return Math.max(published ?? facts.userVersion, facts.contentVersion);
	}
	const admitted = getStateSchemaVersionAdmission(db);
	if (admitted) return Math.max(published ?? admitted.userVersion, admitted.contentVersion);
	const version = getAdmittedSqliteSchemaFacts(db)?.userVersion ?? readSqliteUserVersion(db);
	const contentVersion = parseContentVersion(tableExists(db, "config_machine_state") ? readRow(db)?.value_json : void 0);
	rememberStateSchemaVersionAdmission(db, {
		userVersion: version,
		contentVersion
	});
	return Math.max(published ?? version, contentVersion);
}
function readStateSchemaContentVersionRow(db) {
	return contentVersionQuery(db)().rows[0];
}
function parseContentVersion(valueJson) {
	if (valueJson === void 0) return 0;
	let contentVersion;
	try {
		contentVersion = valueJson === null ? null : JSON.parse(valueJson);
	} catch (cause) {
		throw new SqliteSchemaMismatchError(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`, { cause });
	}
	if (typeof contentVersion !== "number" || !Number.isSafeInteger(contentVersion) || contentVersion < 0) throw new SqliteSchemaMismatchError(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`);
	return contentVersion;
}
/** Refuse newer headers before catalog inspection, then share one physical schema capture. */
function admitStateSchemaFacts(database, pathname) {
	if (isPostgresSqlConnection(database)) {
		if (!getPostgresPhysicalFacts(database)) throw new Error("Missing PostgreSQL physical schema admission");
		return;
	}
	try {
		admitSqliteSchema(database, (userVersion) => assertSupportedStateSchemaVersion(database, pathname, {
			userVersion,
			contentVersion: userVersion
		}));
	} catch (error) {
		let version;
		try {
			version = readSqliteUserVersion(database);
		} catch {
			throw normalizeOpenClawStateSchemaReadError(error, pathname);
		}
		if (version > 22) throw createNewerSqliteSchemaVersionError("OpenClaw state database", pathname, version, 22);
		throw normalizeOpenClawStateSchemaReadError(error, pathname);
	}
}
function assertSupportedStateSchemaVersion(db, pathname, prepared, readRow) {
	if (isPostgresSqlConnection(db)) return readStateSchemaContentVersion(db);
	try {
		const userVersion = prepared?.userVersion ?? getStateSchemaVersionAdmission(db)?.userVersion ?? getAdmittedSqliteSchemaFacts(db)?.userVersion ?? readSqliteUserVersion(db);
		const contentVersion = prepared?.contentVersion ?? (userVersion > 22 ? userVersion : readStateSchemaContentVersion(db, userVersion, readRow));
		if (contentVersion > 22) throw createNewerSqliteSchemaVersionError("OpenClaw state database", pathname, contentVersion, 22);
		return userVersion;
	} catch (error) {
		throw normalizeOpenClawStateSchemaReadError(error, pathname);
	}
}
//#endregion
export { createStateSchemaAdmission as a, publishStateRuntimeSchemaAdmission as c, readStateSchemaContentVersion as i, publishStateSchemaVersionAdmission as l, admitStateSchemaFacts as n, getStateRuntimeSchemaAdmission as o, assertSupportedStateSchemaVersion as r, getStateSchemaVersionAdmission as s, CONTENT_VERSION_KEY as t };
