import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as normalizeDeviceAuthScopes, t as normalizeDeviceAuthRole } from "./device-auth-C-STNejO.mjs";
//#region src/infra/device-auth-store.kernel.ts
function fromRow(row) {
	try {
		const scopes = JSON.parse(row.scopes_json);
		if (!Array.isArray(scopes)) return null;
		return {
			token: row.token,
			role: row.role,
			scopes: normalizeDeviceAuthScopes(scopes),
			updatedAtMs: row.updated_at_ms
		};
	} catch {
		return null;
	}
}
function readDeviceAuthTokenObservationFromDatabase(db, params) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("device_auth_tokens").select([
		"token",
		"role",
		"scopes_json",
		"updated_at_ms"
	]).where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role)));
	return {
		entry: row ? fromRow(row) : null,
		expectedToken: row ? row.token : null
	};
}
function readOriginDeviceTokenObservationFromDatabase(db, params) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("gateway_origin_device_tokens").select([
		"token",
		"role",
		"scopes_json",
		"updated_at_ms"
	]).where("gateway_scope", "=", params.gatewayScope).where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role)));
	return {
		entry: row ? fromRow(row) : null,
		expectedToken: row ? row.token : null
	};
}
function createDeviceAuthEntry(params) {
	return {
		token: params.token,
		role: normalizeDeviceAuthRole(params.role),
		scopes: normalizeDeviceAuthScopes(params.scopes),
		updatedAtMs: params.updatedAtMs ?? Date.now()
	};
}
function readDeviceAuthTokensFromDatabase(db, params) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("device_auth_tokens").select([
		"token",
		"role",
		"scopes_json",
		"updated_at_ms"
	]).where("device_id", "=", params.deviceId).orderBy("role")).rows.flatMap((row) => {
		const entry = fromRow(row);
		return entry ? [entry] : [];
	});
}
function storeDeviceAuthTokenInDatabase(db, params) {
	const entry = createDeviceAuthEntry(params);
	const kysely = getNodeSqliteKysely(db);
	return (params.expectedToken == null ? executeSqliteQuerySync(db, kysely.insertInto("device_auth_tokens").values({
		device_id: params.deviceId,
		role: entry.role,
		token: entry.token,
		scopes_json: JSON.stringify(entry.scopes),
		updated_at_ms: entry.updatedAtMs
	}).onConflict((conflict) => params.expectedToken === null ? conflict.columns(["device_id", "role"]).doNothing() : conflict.columns(["device_id", "role"]).doUpdateSet({
		token: entry.token,
		scopes_json: JSON.stringify(entry.scopes),
		updated_at_ms: entry.updatedAtMs
	}))) : executeSqliteQuerySync(db, kysely.updateTable("device_auth_tokens").set({
		token: entry.token,
		scopes_json: JSON.stringify(entry.scopes),
		updated_at_ms: entry.updatedAtMs
	}).where("device_id", "=", params.deviceId).where("role", "=", entry.role).where("token", "=", params.expectedToken))).numAffectedRows === 1n ? entry : null;
}
function clearDeviceAuthTokenFromDatabase(db, params) {
	const baseQuery = getNodeSqliteKysely(db).deleteFrom("device_auth_tokens").where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role));
	const query = params.expectedToken === void 0 ? baseQuery : params.observedToken !== void 0 && params.observedToken.trim() === params.expectedToken ? baseQuery.where("token", "in", [params.expectedToken, params.observedToken]) : baseQuery.where("token", "=", params.expectedToken);
	return executeSqliteQuerySync(db, query).numAffectedRows === 1n;
}
function storeOriginDeviceTokenInDatabase(db, params) {
	const entry = createDeviceAuthEntry(params);
	const kysely = getNodeSqliteKysely(db);
	return (params.expectedToken == null ? executeSqliteQuerySync(db, kysely.insertInto("gateway_origin_device_tokens").values({
		gateway_scope: params.gatewayScope,
		device_id: params.deviceId,
		role: entry.role,
		token: entry.token,
		scopes_json: JSON.stringify(entry.scopes),
		updated_at_ms: entry.updatedAtMs
	}).onConflict((conflict) => params.expectedToken === null ? conflict.columns([
		"gateway_scope",
		"device_id",
		"role"
	]).doNothing() : conflict.columns([
		"gateway_scope",
		"device_id",
		"role"
	]).doUpdateSet({
		token: entry.token,
		scopes_json: JSON.stringify(entry.scopes),
		updated_at_ms: entry.updatedAtMs
	}))) : executeSqliteQuerySync(db, kysely.updateTable("gateway_origin_device_tokens").set({
		token: entry.token,
		scopes_json: JSON.stringify(entry.scopes),
		updated_at_ms: entry.updatedAtMs
	}).where("gateway_scope", "=", params.gatewayScope).where("device_id", "=", params.deviceId).where("role", "=", entry.role).where("token", "=", params.expectedToken))).numAffectedRows === 1n ? entry : null;
}
function clearOriginDeviceTokenInDatabase(db, params) {
	const baseQuery = getNodeSqliteKysely(db).deleteFrom("gateway_origin_device_tokens").where("gateway_scope", "=", params.gatewayScope).where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role));
	const query = params.expectedToken === void 0 ? baseQuery : params.observedToken !== void 0 && params.observedToken.trim() === params.expectedToken ? baseQuery.where("token", "in", [params.expectedToken, params.observedToken]) : baseQuery.where("token", "=", params.expectedToken);
	return executeSqliteQuerySync(db, query).numAffectedRows === 1n;
}
//#endregion
export { readDeviceAuthTokensFromDatabase as a, storeOriginDeviceTokenInDatabase as c, readDeviceAuthTokenObservationFromDatabase as i, clearOriginDeviceTokenInDatabase as n, readOriginDeviceTokenObservationFromDatabase as o, createDeviceAuthEntry as r, storeDeviceAuthTokenInDatabase as s, clearDeviceAuthTokenFromDatabase as t };
