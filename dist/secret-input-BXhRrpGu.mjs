import "./types.secrets-DsPRn9Dz.mjs";
import { Jn as string, Nt as array, Yt as discriminatedUnion, or as union } from "./schemas-BOYIvvln.mjs";
import { i as SecretRefSchema, n as sensitive } from "./zod-schema.sensitive-bEFwMmOC.mjs";
//#region src/plugin-sdk/secret-input-schema.ts
/**
* Returns the shared secret-input schema for plaintext values and env/file/exec/store refs.
* Reusing this singleton preserves sensitive-path registration for config redaction.
*/
function buildSecretInputSchema() {
	return secretInputSchema;
}
/** Register a plugin-owned config schema leaf for redaction in host config projections. */
function registerSensitiveConfigSchema(schema) {
	sensitive.add(schema);
	return schema;
}
const [envRef, fileRef, execRef, storeRef] = SecretRefSchema.options;
const secretInputSchema = union([string(), discriminatedUnion("source", [
	envRef,
	storeRef,
	fileRef,
	execRef
])]).register(sensitive);
//#endregion
//#region src/plugin-sdk/secret-input.ts
/**
* Builds an optional secret-input schema for config fields that may be omitted.
* The inner schema stays shared so sensitive-path redaction still recognizes it.
*/
function buildOptionalSecretInputSchema() {
	return buildSecretInputSchema().optional();
}
/**
* Builds an array schema for provider/channel config that accepts multiple secret inputs.
* Each element uses the shared schema so plaintext and ref validation stay identical.
*/
function buildSecretInputArraySchema() {
	return array(buildSecretInputSchema());
}
//#endregion
export { registerSensitiveConfigSchema as i, buildSecretInputArraySchema as n, buildSecretInputSchema as r, buildOptionalSecretInputSchema as t };
