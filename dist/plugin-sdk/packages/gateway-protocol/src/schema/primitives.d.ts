import { Type } from "typebox";
/** Non-empty string primitive for protocol fields that reject blank values. */
export declare const NonEmptyString: Type.TString;
/** Maximum stable session key length accepted by chat-send protocol requests. */
export declare const CHAT_SEND_SESSION_KEY_MAX_LENGTH = 512;
/** Chat-send session key string primitive with bounded length. */
export declare const ChatSendSessionKeyString: Type.TString;
/** Human-readable session label primitive with bounded display length. */
export declare const SessionLabelString: Type.TString;
/** Provenance marker for content copied from another user/session/system source. */
export declare const InputProvenanceSchema: Type.TObject<{
    kind: Type.TString;
    originSessionId: Type.TOptional<Type.TString>;
    sourceSessionKey: Type.TOptional<Type.TString>;
    sourceChannel: Type.TOptional<Type.TString>;
    sourceTool: Type.TOptional<Type.TString>;
}>;
/** Closed gateway client id schema aligned with `GATEWAY_CLIENT_IDS`. */
export declare const GatewayClientIdSchema: Type.TEnum<["openclaw-android", "cli", "openclaw-control-ui", "fingerprint", "gateway-client", "openclaw-ios", "openclaw-macos", "node-host", "openclaw-probe", "test", "openclaw-tui", "webchat", "webchat-ui"]>;
/** Closed gateway client mode schema aligned with `GATEWAY_CLIENT_MODES`. */
export declare const GatewayClientModeSchema: Type.TEnum<["backend", "cli", "node", "probe", "test", "ui", "webchat"]>;
/** Supported secret reference backing stores for protocol SecretRef payloads. */
export declare const SecretRefSourceSchema: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"file">, Type.TLiteral<"exec">]>;
/** Structured secret reference accepted by config and channel protocol payloads. */
export declare const SecretRefSchema: Type.TUnion<[Type.TObject<{
    source: Type.TLiteral<"env">;
    provider: Type.TString;
    id: Type.TString;
}>, Type.TObject<{
    source: Type.TLiteral<"file">;
    provider: Type.TString;
    id: Type.TUnsafe<string>;
}>, Type.TObject<{
    source: Type.TLiteral<"exec">;
    provider: Type.TString;
    id: Type.TString;
}>]>;
/** Secret input value: either an inline string or a structured SecretRef. */
export declare const SecretInputSchema: Type.TUnion<[Type.TString, Type.TUnion<[Type.TObject<{
    source: Type.TLiteral<"env">;
    provider: Type.TString;
    id: Type.TString;
}>, Type.TObject<{
    source: Type.TLiteral<"file">;
    provider: Type.TString;
    id: Type.TUnsafe<string>;
}>, Type.TObject<{
    source: Type.TLiteral<"exec">;
    provider: Type.TString;
    id: Type.TString;
}>]>]>;
