import { a as getNodeSqliteKysely, f as expressionBuilder, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as normalizeDeviceAuthScopes, t as normalizeDeviceAuthRole } from "./device-auth-DIR2dK9a.mjs";
//#region src/infra/device-auth-store.kernel.ts
function tokenTarget(params, origin) {
	const key = {
		device_id: params.deviceId,
		role: normalizeDeviceAuthRole(params.role)
	};
	const eb = expressionBuilder();
	const match = eb.and([
		...origin === void 0 ? [] : [eb("gateway_scope", "=", origin.gatewayScope)],
		eb("device_id", "=", key.device_id),
		eb("role", "=", key.role)
	]);
	return origin === void 0 ? {
		table: "device_auth_tokens",
		key,
		match
	} : {
		table: "gateway_origin_device_tokens",
		key: {
			gateway_scope: origin.gatewayScope,
			...key
		},
		match
	};
}
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
	return readTokenObservation(db, tokenTarget(params));
}
function readOriginDeviceTokenObservationFromDatabase(db, params) {
	return readTokenObservation(db, tokenTarget(params, params));
}
function readTokenObservation(db, target) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom(target.table).select([
		"token",
		"role",
		"scopes_json",
		"updated_at_ms"
	]).where(target.match));
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
	return storeToken(db, params, tokenTarget(params));
}
function storeOriginDeviceTokenInDatabase(db, params) {
	return storeToken(db, params, tokenTarget(params, params));
}
function storeToken(db, params, target) {
	const entry = createDeviceAuthEntry(params);
	const kysely = getNodeSqliteKysely(db);
	const values = {
		token: entry.token,
		scopes_json: JSON.stringify(entry.scopes),
		updated_at_ms: entry.updatedAtMs
	};
	return (params.expectedToken == null ? executeSqliteQuerySync(db, kysely.insertInto(target.table).values({
		...target.key,
		...values
	}).onConflict((conflict) => {
		const keyed = conflict.columns(target.table === "device_auth_tokens" ? ["device_id", "role"] : [
			"gateway_scope",
			"device_id",
			"role"
		]);
		return params.expectedToken === null ? keyed.doNothing() : keyed.doUpdateSet(values);
	})) : executeSqliteQuerySync(db, kysely.updateTable(target.table).set(values).where(target.match).where("token", "=", params.expectedToken))).numAffectedRows === 1n ? entry : null;
}
function clearDeviceAuthTokenFromDatabase(db, params) {
	return clearToken(db, params, tokenTarget(params));
}
function clearOriginDeviceTokenInDatabase(db, params) {
	return clearToken(db, params, tokenTarget(params, params));
}
function clearToken(db, params, target) {
	const baseQuery = getNodeSqliteKysely(db).deleteFrom(target.table).where(target.match);
	const query = params.expectedToken === void 0 ? baseQuery : params.observedToken !== void 0 && params.observedToken.trim() === params.expectedToken ? baseQuery.where("token", "in", [params.expectedToken, params.observedToken]) : baseQuery.where("token", "=", params.expectedToken);
	return executeSqliteQuerySync(db, query).numAffectedRows === 1n;
}
//#endregion
export { readDeviceAuthTokensFromDatabase as a, storeOriginDeviceTokenInDatabase as c, readDeviceAuthTokenObservationFromDatabase as i, clearOriginDeviceTokenInDatabase as n, readOriginDeviceTokenObservationFromDatabase as o, createDeviceAuthEntry as r, storeDeviceAuthTokenInDatabase as s, clearDeviceAuthTokenFromDatabase as t };
