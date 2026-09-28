import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/secret-ref-contract.ts
/** Canonical id for file secret providers that expose exactly one value. */
const SINGLE_VALUE_FILE_REF_ID = "value";
/** Shared alias grammar for env/file/exec/store secret provider names. */
const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
/** JSON-schema fragment that rejects invalid JSON-pointer escape sequences. */
const FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
/** JSON-schema pattern for exec secret ref ids, excluding dot-path traversal. */
const EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN = "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";
//#endregion
//#region packages/gateway-protocol/src/schema/primitives.ts
/**
* Shared schema primitives reused by gateway protocol request/result schemas.
*
* Keep these schemas small and transport-oriented; feature-specific validation
* belongs in the owning schema module or runtime handler.
*/
const ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
const INPUT_PROVENANCE_KIND_VALUES = [
	"external_user",
	"inter_session",
	"internal_system"
];
const SESSION_LABEL_MAX_LENGTH = 512;
/** Non-empty string primitive for protocol fields that reject blank values. */
const NonEmptyString = Type.String({ minLength: 1 });
const UserProfileIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
/** Chat-send session key string primitive with bounded length. */
const ChatSendSessionKeyString = Type.String({
	minLength: 1,
	maxLength: 512
});
/** Human-readable session label primitive with bounded display length. */
const SessionLabelString = Type.String({
	minLength: 1,
	maxLength: SESSION_LABEL_MAX_LENGTH
});
/** Provenance marker for content copied from another user/session/system source. */
const InputProvenanceSchema = closedObject({
	kind: Type.String({ enum: [...INPUT_PROVENANCE_KIND_VALUES] }),
	originSessionId: Type.Optional(Type.String()),
	sourceSessionKey: Type.Optional(Type.String()),
	sourceChannel: Type.Optional(Type.String()),
	sourceTool: Type.Optional(Type.String()),
	sourceRole: Type.Optional(Type.Literal("subagent")),
	sourcePromptPrefix: Type.Optional(Type.String()),
	jobId: Type.Optional(Type.String()),
	runId: Type.Optional(Type.String())
});
/** Closed gateway client id schema aligned with `GATEWAY_CLIENT_IDS`. */
const GatewayClientIdSchema = Type.Enum(GATEWAY_CLIENT_IDS);
/** Closed gateway client mode schema aligned with `GATEWAY_CLIENT_MODES`. */
const GatewayClientModeSchema = Type.Enum(GATEWAY_CLIENT_MODES);
const SecretProviderAliasString = Type.String({ pattern: SECRET_PROVIDER_ALIAS_PATTERN.source });
const EnvSecretRefSchema = closedObject({
	source: Type.Literal("env"),
	provider: SecretProviderAliasString,
	id: Type.String({ pattern: ENV_SECRET_REF_ID_RE.source })
});
const FileSecretRefIdSchema = Type.Unsafe({
	type: "string",
	anyOf: [{ const: SINGLE_VALUE_FILE_REF_ID }, { allOf: [{ pattern: "^/" }, { not: { pattern: FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN } }] }]
});
const FileSecretRefSchema = closedObject({
	source: Type.Literal("file"),
	provider: SecretProviderAliasString,
	id: FileSecretRefIdSchema
});
const ExecSecretRefSchema = closedObject({
	source: Type.Literal("exec"),
	provider: SecretProviderAliasString,
	id: Type.String({ pattern: EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN })
});
const StoreSecretRefSchema = closedObject({
	source: Type.Literal("store"),
	provider: SecretProviderAliasString,
	id: Type.String({ pattern: ENV_SECRET_REF_ID_RE.source })
});
/** Structured secret reference accepted by config and channel protocol payloads. */
const SecretRefSchema = Type.Union([
	EnvSecretRefSchema,
	FileSecretRefSchema,
	ExecSecretRefSchema,
	StoreSecretRefSchema
]);
/** Secret input value: either an inline string or a structured SecretRef. */
const SecretInputSchema = Type.Union([Type.String(), SecretRefSchema]);
//#endregion
export { NonEmptyString as a, UserProfileIdSchema as c, InputProvenanceSchema as i, GatewayClientIdSchema as n, SecretInputSchema as o, GatewayClientModeSchema as r, SessionLabelString as s, ChatSendSessionKeyString as t };
