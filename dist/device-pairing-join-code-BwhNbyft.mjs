import { i as generateSecureToken } from "./secure-random-DxCgeORs.mjs";
import { n as executeDevicePairingMutation } from "./device-pairing-worker-DLHLJ4yt.mjs";
import { t as isDevicePairingJoinCode } from "./join-code-B_OfdZ-j.mjs";
import { n as decodePairingSetupCode, r as encodePairingSetupCode } from "./setup-code-CNtEQo_X.mjs";
//#region src/infra/device-pairing-join-code.ts
/** Register one setup payload under a random 128-bit shortcode. */
async function registerDevicePairingJoinCode(params) {
	const createdAtMs = Date.now();
	const expiresAtMs = params.expiresAtMs;
	const assertCallerCurrent = params.assertCurrent;
	const assertCurrent = () => {
		assertCallerCurrent?.();
		if (!Number.isSafeInteger(expiresAtMs) || expiresAtMs <= Date.now()) throw new Error("Device pairing join code requires a future expiry.");
	};
	assertCurrent();
	const payloadJson = JSON.stringify(decodePairingSetupCode(encodePairingSetupCode(params.payload)));
	const shortcode = generateSecureToken(16);
	await executeDevicePairingMutation({
		type: "devicePairing.registerJoinCode",
		input: {
			shortcode,
			payloadJson,
			createdAtMs,
			expiresAtMs
		}
	}, {
		context: params.context,
		assertCurrent
	});
	assertCurrent();
	return shortcode;
}
/** Atomically burn one live shortcode and return its validated setup payload. */
async function redeemDevicePairingJoinCode(params) {
	const shortcode = params.shortcode.trim();
	if (!isDevicePairingJoinCode(shortcode)) return null;
	const row = await executeDevicePairingMutation({
		type: "devicePairing.redeemJoinCode",
		input: { shortcode }
	}, {
		context: params.context,
		assertCurrent: params.assertCurrent
	});
	const nowMs = Date.now();
	if (!row || row.expires_at_ms <= nowMs) return null;
	try {
		return decodePairingSetupCode(Buffer.from(row.payload_json, "utf8").toString("base64url"), { nowMs });
	} catch {
		return null;
	}
}
//#endregion
export { registerDevicePairingJoinCode as n, redeemDevicePairingJoinCode as t };
