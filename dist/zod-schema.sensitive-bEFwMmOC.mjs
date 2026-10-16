import { d as isValidFileSecretRefId, n as ENV_SECRET_REF_ID_RE, o as formatExecSecretRefIdValidationMessage, r as SECRET_PROVIDER_ALIAS_PATTERN, u as isValidExecSecretRefId } from "./ref-contract-D0kWy5jy.mjs";
import { et as registry } from "./json-schema-processors-C6KO_BFy.mjs";
import { Jn as string, Yt as discriminatedUnion, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
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
const configUiMetadata = registry();
//#endregion
export { SecretRefSchema as i, sensitive as n, SecretInputSchema as r, configUiMetadata as t };
