import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { s as ensureDevicePairingJoinCodeSchema } from "./openclaw-state-db-schema-additive-CzAgdzE5.mjs";
import { i as generateSecureToken } from "./secure-random-Dimnnrm0.mjs";
import { n as decodePairingSetupCode, r as encodePairingSetupCode } from "./setup-code-DQhRCoLc.mjs";
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
