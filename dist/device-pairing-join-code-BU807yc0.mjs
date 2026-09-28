import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { _ as ensureDevicePairingJoinCodeSchema, c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as generateSecureToken } from "./secure-random-BJtJxP9Y.mjs";
import { n as encodePairingSetupCode, t as decodePairingSetupCode } from "./setup-code-BNyr2Ilv.mjs";
import { t as isDevicePairingJoinCode } from "./join-code-B_OfdZ-j.mjs";
//#region src/infra/device-pairing-join-code.ts
const initializedDatabases = /* @__PURE__ */ new WeakSet();
function ensureJoinCodeSchema(database) {
	if (initializedDatabases.has(database)) return;
	ensureDevicePairingJoinCodeSchema(database);
	initializedDatabases.add(database);
}
function validatePairingSetupPayload(payload) {
	return decodePairingSetupCode(encodePairingSetupCode(payload));
}
/** Register one setup payload under a random 128-bit shortcode. */
function registerDevicePairingJoinCode(params) {
	const createdAtMs = Date.now();
	if (!Number.isSafeInteger(params.expiresAtMs) || params.expiresAtMs <= createdAtMs) throw new Error("Device pairing join code requires a future expiry.");
	const payloadJson = JSON.stringify(validatePairingSetupPayload(params.payload));
	const shortcode = generateSecureToken(16);
	runOpenClawStateWriteTransaction(({ db }) => {
		ensureJoinCodeSchema(db);
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_join_codes").where("expires_at_ms", "<=", createdAtMs));
		executeSqliteQuerySync(db, kysely.insertInto("device_pairing_join_codes").values({
			shortcode,
			payload_json: payloadJson,
			created_at_ms: createdAtMs,
			expires_at_ms: params.expiresAtMs
		}));
	}, params.database);
	return shortcode;
}
/** Atomically burn one live shortcode and return its validated setup payload. */
function redeemDevicePairingJoinCode(params) {
	const shortcode = params.shortcode.trim();
	if (!isDevicePairingJoinCode(shortcode)) return null;
	const nowMs = Date.now();
	const payloadJson = runOpenClawStateWriteTransaction(({ db }) => {
		ensureJoinCodeSchema(db);
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_join_codes").where("expires_at_ms", "<=", nowMs));
		const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("device_pairing_join_codes").select("payload_json").where("shortcode", "=", shortcode));
		executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_join_codes").where("shortcode", "=", shortcode));
		return row?.payload_json;
	}, params.database);
	if (typeof payloadJson !== "string") return null;
	try {
		return decodePairingSetupCode(Buffer.from(payloadJson, "utf8").toString("base64url"), { nowMs });
	} catch {
		return null;
	}
}
//#endregion
export { registerDevicePairingJoinCode as n, redeemDevicePairingJoinCode as t };
