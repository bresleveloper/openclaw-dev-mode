import { a as ENV_SECRET_REF_ID_RE, c as isValidExecSecretRefId, l as isValidFileSecretRefId, o as SECRET_PROVIDER_ALIAS_PATTERN, s as formatExecSecretRefIdValidationMessage } from "./types.secrets-pt3cVWr4.js";
import { a as discriminatedUnion, f as strictObject, h as union, p as string, s as literal, v as registry } from "./schemas-C5K39dqU.js";
//#region src/config/zod-schema.secret-input.ts
const SecretRefProviderSchema = string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\").");
function createSecretRefSchema(source, id) {
	return strictObject({
		source: literal(source),
		provider: SecretRefProviderSchema,
		id
	});
}
/** Config-level secret reference schema shared by model/provider/plugin credential fields. */
const SecretRefSchema = discriminatedUnion("source", [
	createSecretRefSchema("env", string().regex(ENV_SECRET_REF_ID_RE, "Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")),
	createSecretRefSchema("file", string().refine(isValidFileSecretRefId, "File secret reference id must be an absolute JSON pointer (example: \"/providers/openai/apiKey\"), or \"value\" for singleValue mode.")),
	createSecretRefSchema("exec", string().refine(isValidExecSecretRefId, formatExecSecretRefIdValidationMessage())),
	createSecretRefSchema("store", string().regex(ENV_SECRET_REF_ID_RE, "Store secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\")."))
]);
/** Accepts either legacy inline secret strings or structured secret references. */
const SecretInputSchema = union([string(), SecretRefSchema]);
//#endregion
//#region src/config/zod-schema.sensitive.ts
const sensitive = registry();
registry();
//#endregion
//#region src/plugin-sdk/secret-input-schema.ts
/**
* Returns the shared secret-input schema for plaintext values and env/file/exec/store refs.
* Reusing this singleton preserves sensitive-path registration for config redaction.
*/
function buildSecretInputSchema() {
	return secretInputSchema;
}
const [envRef, fileRef, execRef, storeRef] = SecretRefSchema.options;
const secretInputSchema = union([string(), discriminatedUnion("source", [
	envRef,
	storeRef,
	fileRef,
	execRef
])]).register(sensitive);
//#endregion
export { sensitive as n, SecretInputSchema as r, buildSecretInputSchema as t };
