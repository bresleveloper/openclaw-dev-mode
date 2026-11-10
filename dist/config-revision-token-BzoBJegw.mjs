import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { createHmac, randomBytes } from "node:crypto";
//#region src/gateway/config-revision-token.ts
const CONFIG_REVISION_KEY_BYTES = 32;
const CONFIG_REVISION_RAW_DOMAIN = "openclaw.gateway.config-revision.raw.v1";
const CONFIG_REVISION_RESOLVED_DOMAIN = "openclaw.gateway.config-revision.resolved.v1";
function registerConfigRevisionKeyForRedaction(key) {
	const bytes = Buffer.from(key);
	registerSecretValueForRedaction(bytes.toString("hex"));
	registerSecretValueForRedaction(bytes.toString("base64url"));
}
function parseConfigRevisionKey(key) {
	if (!(key instanceof Uint8Array) || key.byteLength !== CONFIG_REVISION_KEY_BYTES) throw new Error("config revision key is corrupt");
	const bytes = Buffer.from(key);
	registerConfigRevisionKeyForRedaction(bytes);
	return bytes;
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
/** Loads the durable installation key once for the Gateway request lifecycle. */
async function loadGatewayConfigRevisionProjector(options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	return createGatewayConfigRevisionProjector(parseConfigRevisionKey(await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "machineState.configRevisionKey",
		input: { candidateKey: randomBytes(CONFIG_REVISION_KEY_BYTES) }
	}))));
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
