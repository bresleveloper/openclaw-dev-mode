import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-DorVHn0l.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { i as ensureConfigRevisionKeySchema } from "./openclaw-state-db-schema-additive-CzAgdzE5.mjs";
import { createHmac, randomBytes } from "node:crypto";
//#region src/gateway/config-revision-token.ts
const CONFIG_REVISION_SINGLETON_ID = 1;
const CONFIG_REVISION_KEY_BYTES = 32;
const CONFIG_REVISION_RAW_DOMAIN = "openclaw.gateway.config-revision.raw.v1";
const CONFIG_REVISION_RESOLVED_DOMAIN = "openclaw.gateway.config-revision.resolved.v1";
function registerConfigRevisionKeyForRedaction(key) {
	const bytes = Buffer.from(key);
	registerSecretValueForRedaction(bytes.toString("hex"));
	registerSecretValueForRedaction(bytes.toString("base64url"));
}
function parseConfigRevisionKey(row) {
	if (!(row.hmac_key instanceof Uint8Array) || row.hmac_key.byteLength !== CONFIG_REVISION_KEY_BYTES) throw new Error("config revision key is corrupt");
	const key = Buffer.from(row.hmac_key);
	registerConfigRevisionKeyForRedaction(key);
	return key;
}
function loadOrCreateConfigRevisionKey(database, candidateKey) {
	const db = getNodeSqliteKysely(database);
	const existing = executeSqliteQueryTakeFirstSync(database, db.selectFrom("config_revision_keys").select("hmac_key").where("id", "=", CONFIG_REVISION_SINGLETON_ID));
	if (existing) return parseConfigRevisionKey(existing);
	executeSqliteQuerySync(database, db.insertInto("config_revision_keys").values({
		id: CONFIG_REVISION_SINGLETON_ID,
		hmac_key: candidateKey
	}).onConflict((conflict) => conflict.column("id").doNothing()));
	const stored = executeSqliteQueryTakeFirstSync(database, db.selectFrom("config_revision_keys").select("hmac_key").where("id", "=", CONFIG_REVISION_SINGLETON_ID));
	if (!stored) throw new Error("config revision key could not be created");
	return parseConfigRevisionKey(stored);
}
function projectRevision(key, domain, hash) {
	return `hmac-sha256:v1:${createHmac("sha256", key).update(JSON.stringify([domain, hash]), "utf8").digest("base64url")}`;
}
function createGatewayConfigRevisionProjector(key) {
	if (key.byteLength !== CONFIG_REVISION_KEY_BYTES) throw new Error("config revision key must be 32 bytes");
	return {
		projectRawHash: (hash) => projectRevision(key, CONFIG_REVISION_RAW_DOMAIN, hash),
		projectResolvedHash: (hash) => projectRevision(key, CONFIG_REVISION_RESOLVED_DOMAIN, hash),
		hashResponseSessionBearer: (bearer) => hashGatewayResponseSessionBearer(bearer, key)
	};
}
function loadGatewayConfigRevisionKey(options = {}) {
	const candidateKey = randomBytes(CONFIG_REVISION_KEY_BYTES);
	return runOpenClawStateWriteTransaction(({ db }) => {
		ensureConfigRevisionKeySchema(db);
		return loadOrCreateConfigRevisionKey(db, candidateKey);
	}, options, { operationLabel: "gateway.config-revision-key.load" });
}
/** Loads the durable installation key once for the Gateway request lifecycle. */
function loadGatewayConfigRevisionProjector(options = {}) {
	return createGatewayConfigRevisionProjector(loadGatewayConfigRevisionKey(options));
}
function hashGatewayResponseSessionBearer(bearer, key) {
	const scopeKey = createHmac("sha256", key).update("openresponses-session-scope", "utf8").digest();
	try {
		return `hmac-sha256:v1:${createHmac("sha256", scopeKey).update(bearer, "utf8").digest("hex")}`;
	} finally {
		scopeKey.fill(0);
	}
}
//#endregion
export { loadGatewayConfigRevisionProjector as t };
