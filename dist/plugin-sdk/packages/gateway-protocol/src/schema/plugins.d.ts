import { Type } from "typebox";
/**
 * Plugin control-surface protocol schemas.
 *
 * These payloads let the gateway expose plugin-provided UI actions without
 * baking plugin-specific payload shapes into the core protocol.
 */
/** Arbitrary plugin-owned JSON payload carried opaquely through the gateway. */
export declare const PluginJsonValueSchema: Type.TUnknown;
/** Descriptor for one plugin-provided control UI action or surface. */
export declare const PluginControlUiDescriptorSchema: Type.TObject<{
    id: Type.TString;
    pluginId: Type.TString;
    pluginName: Type.TOptional<Type.TString>;
    surface: Type.TUnion<[Type.TLiteral<"session">, Type.TLiteral<"tool">, Type.TLiteral<"run">, Type.TLiteral<"settings">]>;
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    placement: Type.TOptional<Type.TString>;
    schema: Type.TOptional<Type.TUnknown>;
    requiredScopes: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Empty request payload for listing plugin UI descriptors. */
export declare const PluginsUiDescriptorsParamsSchema: Type.TObject<{}>;
/** Response payload containing all plugin UI descriptors visible to the client. */
export declare const PluginsUiDescriptorsResultSchema: Type.TObject<{
    ok: Type.TLiteral<true>;
    descriptors: Type.TArray<Type.TObject<{
        id: Type.TString;
        pluginId: Type.TString;
        pluginName: Type.TOptional<Type.TString>;
        surface: Type.TUnion<[Type.TLiteral<"session">, Type.TLiteral<"tool">, Type.TLiteral<"run">, Type.TLiteral<"settings">]>;
        label: Type.TString;
        description: Type.TOptional<Type.TString>;
        placement: Type.TOptional<Type.TString>;
        schema: Type.TOptional<Type.TUnknown>;
        requiredScopes: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
}>;
/** Request payload for invoking one plugin-owned session action. */
export declare const PluginsSessionActionParamsSchema: Type.TObject<{
    pluginId: Type.TString;
    actionId: Type.TString;
    sessionKey: Type.TOptional<Type.TString>;
    payload: Type.TOptional<Type.TUnknown>;
}>;
/** Successful plugin action result, optionally continuing the agent turn. */
export declare const PluginsSessionActionSuccessResultSchema: Type.TObject<{
    ok: Type.TLiteral<true>;
    result: Type.TOptional<Type.TUnknown>;
    continueAgent: Type.TOptional<Type.TBoolean>;
    reply: Type.TOptional<Type.TUnknown>;
}>;
/** Failed plugin action result with plugin-owned detail payload. */
export declare const PluginsSessionActionFailureResultSchema: Type.TObject<{
    ok: Type.TLiteral<false>;
    error: Type.TString;
    code: Type.TOptional<Type.TString>;
    details: Type.TOptional<Type.TUnknown>;
}>;
/** Discriminated plugin action result returned to gateway clients. */
export declare const PluginsSessionActionResultSchema: Type.TUnion<[Type.TObject<{
    ok: Type.TLiteral<true>;
    result: Type.TOptional<Type.TUnknown>;
    continueAgent: Type.TOptional<Type.TBoolean>;
    reply: Type.TOptional<Type.TUnknown>;
}>, Type.TObject<{
    ok: Type.TLiteral<false>;
    error: Type.TString;
    code: Type.TOptional<Type.TString>;
    details: Type.TOptional<Type.TUnknown>;
}>]>;
