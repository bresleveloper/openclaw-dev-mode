import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { t as GatewayControlUiIngressError } from "./gateway-ingress.types-Bor6uDqj.mjs";
import { createHash, createPrivateKey, createPublicKey, randomBytes, sign } from "node:crypto";
//#region extensions/mcp-relay/src/protocol.ts
const MAX_FRAME_BYTES = 1048576;
const MAX_RESULT_BYTES = 524288;
var RelayError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
};
function identityFromPrivateKey(privateKey) {
	const key = createPrivateKey({
		key: Buffer.from(privateKey, "base64url"),
		format: "der",
		type: "pkcs8"
	});
	if (key.asymmetricKeyType !== "ed25519") throw new Error("MCP relay identity is invalid. Restore the original plugin state from backup.");
	const publicKey = createPublicKey(key).export({ format: "jwk" }).x;
	if (!publicKey) throw new Error("MCP relay public key is missing. Restore the original plugin state from backup.");
	return {
		publicKey,
		gatewayId: `gw_${createHash("sha256").update(Buffer.from(publicKey, "base64url")).digest("base64url").slice(0, 22)}`,
		signChallenge: (nonce, relayHost) => sign(null, Buffer.from(`openclaw-mcp-relay/v1\n${nonce}\n${relayHost}`, "utf8"), key).toString("base64url")
	};
}
function normalizePairingCode(code) {
	return code.toUpperCase().replace(/[-\s]/g, "").replace(/O/g, "0").replace(/[IL]/g, "1");
}
function codeHash(code) {
	return createHash("sha256").update(`openclaw-mcp-relay-pair/v1:${normalizePairingCode(code)}`).digest("base64url");
}
function createPairingCode() {
	const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
	const code = Array.from(randomBytes(10), (byte) => alphabet[byte & 31]).join("");
	return `${code.slice(0, 5)}-${code.slice(5)}`;
}
function truncateText(text) {
	return text.length > 16e3 ? `${truncateUtf16Safe(text, 15999)}…` : text;
}
function capResult(result) {
	if (Buffer.byteLength(JSON.stringify(result), "utf8") >= MAX_RESULT_BYTES) throw new RelayError("too_large", "This result is too large. Request fewer conversations or messages.");
	return result;
}
function safeError(error) {
	if (error instanceof GatewayControlUiIngressError) return {
		code: "unavailable",
		message: error.message
	};
	return error instanceof RelayError ? {
		code: error.code,
		message: error.message
	} : {
		code: "internal",
		message: "OpenClaw could not complete this request. Check the Gateway logs and try again."
	};
}
function relayResponseError(error) {
	return isRecord(error) && error.code === "not_found" ? new RelayError("not_found", "This connection request is unknown, expired, or belongs to another Gateway. Start connecting again.") : new RelayError("unavailable", "The relay could not complete the request. Check openclaw mcp-relay status and try again.");
}
function readGrantCreation(params) {
	if (Object.keys(params).some((key) => ![
		"grantId",
		"codeHash",
		"client"
	].includes(key)) || typeof params.codeHash !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(params.codeHash) || !isRecord(params.client) || Object.keys(params.client).some((key) => !["id", "name"].includes(key)) || typeof params.client.id !== "string" || !params.client.id || params.client.id.length > 2e3 || typeof params.client.name !== "string" || !params.client.name || params.client.name.length > 2e3) throw new RelayError("invalid_params", "Supply a code hash and client id/name, then retry pairing.");
	return {
		codeHash: params.codeHash,
		client: {
			id: params.client.id,
			name: params.client.name
		}
	};
}
//#endregion
export { createPairingCode as a, relayResponseError as c, codeHash as i, safeError as l, RelayError as n, identityFromPrivateKey as o, capResult as r, readGrantCreation as s, MAX_FRAME_BYTES as t, truncateText as u };
