import { Type } from "typebox";
/** Empty request payload for reading the current raw config. */
export declare const ConfigGetParamsSchema: Type.TObject<{}>;
/** Full raw config replacement request with optional base hash guard. */
export declare const ConfigSetParamsSchema: Type.TObject<{
    raw: Type.TString;
    baseHash: Type.TOptional<Type.TString>;
}>;
/** Raw config apply request that may schedule a restart. */
export declare const ConfigApplyParamsSchema: Type.TObject<{
    readonly raw: Type.TString;
    readonly baseHash: Type.TOptional<Type.TString>;
    readonly sessionKey: Type.TOptional<Type.TString>;
    readonly deliveryContext: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TString>;
        to: Type.TOptional<Type.TString>;
        accountId: Type.TOptional<Type.TString>;
        threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    }>>;
    readonly note: Type.TOptional<Type.TString>;
    readonly restartDelayMs: Type.TOptional<Type.TInteger>;
}>;
/** Raw config patch request that may schedule a restart. */
export declare const ConfigPatchParamsSchema: Type.TObject<{
    raw: Type.TString;
    baseHash: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    deliveryContext: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TString>;
        to: Type.TOptional<Type.TString>;
        accountId: Type.TOptional<Type.TString>;
        threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    }>>;
    note: Type.TOptional<Type.TString>;
    restartDelayMs: Type.TOptional<Type.TInteger>;
    replacePaths: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Empty request payload for fetching the generated config schema. */
export declare const ConfigSchemaParamsSchema: Type.TObject<{}>;
/** Schema lookup request for one config path. */
export declare const ConfigSchemaLookupParamsSchema: Type.TObject<{
    path: Type.TString;
}>;
/** Empty request payload for checking update/restart status. */
export declare const UpdateStatusParamsSchema: Type.TObject<{}>;
/** Request payload for running an update/restart flow with optional channel delivery context. */
export declare const UpdateRunParamsSchema: Type.TObject<{
    sessionKey: Type.TOptional<Type.TString>;
    deliveryContext: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TString>;
        to: Type.TOptional<Type.TString>;
        accountId: Type.TOptional<Type.TString>;
        threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    }>>;
    note: Type.TOptional<Type.TString>;
    continuationMessage: Type.TOptional<Type.TString>;
    restartDelayMs: Type.TOptional<Type.TInteger>;
    timeoutMs: Type.TOptional<Type.TInteger>;
}>;
/** UI metadata attached to config schema paths. */
export declare const ConfigUiHintSchema: Type.TObject<{
    label: Type.TOptional<Type.TString>;
    help: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    group: Type.TOptional<Type.TString>;
    order: Type.TOptional<Type.TInteger>;
    advanced: Type.TOptional<Type.TBoolean>;
    sensitive: Type.TOptional<Type.TBoolean>;
    placeholder: Type.TOptional<Type.TString>;
    itemTemplate: Type.TOptional<Type.TUnknown>;
}>;
/** Full generated config schema response. */
export declare const ConfigSchemaResponseSchema: Type.TObject<{
    schema: Type.TUnknown;
    uiHints: Type.TRecord<"^.*$", Type.TObject<{
        label: Type.TOptional<Type.TString>;
        help: Type.TOptional<Type.TString>;
        tags: Type.TOptional<Type.TArray<Type.TString>>;
        group: Type.TOptional<Type.TString>;
        order: Type.TOptional<Type.TInteger>;
        advanced: Type.TOptional<Type.TBoolean>;
        sensitive: Type.TOptional<Type.TBoolean>;
        placeholder: Type.TOptional<Type.TString>;
        itemTemplate: Type.TOptional<Type.TUnknown>;
    }>>;
    version: Type.TString;
    generatedAt: Type.TString;
}>;
/** Child entry returned when looking up a config schema path. */
export declare const ConfigSchemaLookupChildSchema: Type.TObject<{
    key: Type.TString;
    path: Type.TString;
    type: Type.TOptional<Type.TUnion<[Type.TString, Type.TArray<Type.TString>]>>;
    required: Type.TBoolean;
    hasChildren: Type.TBoolean;
    reloadKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"restart">, Type.TLiteral<"hot">, Type.TLiteral<"none">]>>;
    hint: Type.TOptional<Type.TObject<{
        label: Type.TOptional<Type.TString>;
        help: Type.TOptional<Type.TString>;
        tags: Type.TOptional<Type.TArray<Type.TString>>;
        group: Type.TOptional<Type.TString>;
        order: Type.TOptional<Type.TInteger>;
        advanced: Type.TOptional<Type.TBoolean>;
        sensitive: Type.TOptional<Type.TBoolean>;
        placeholder: Type.TOptional<Type.TString>;
        itemTemplate: Type.TOptional<Type.TUnknown>;
    }>>;
    hintPath: Type.TOptional<Type.TString>;
}>;
/** Schema lookup response for one config path and its immediate children. */
export declare const ConfigSchemaLookupResultSchema: Type.TObject<{
    path: Type.TString;
    schema: Type.TUnknown;
    reloadKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"restart">, Type.TLiteral<"hot">, Type.TLiteral<"none">]>>;
    hint: Type.TOptional<Type.TObject<{
        label: Type.TOptional<Type.TString>;
        help: Type.TOptional<Type.TString>;
        tags: Type.TOptional<Type.TArray<Type.TString>>;
        group: Type.TOptional<Type.TString>;
        order: Type.TOptional<Type.TInteger>;
        advanced: Type.TOptional<Type.TBoolean>;
        sensitive: Type.TOptional<Type.TBoolean>;
        placeholder: Type.TOptional<Type.TString>;
        itemTemplate: Type.TOptional<Type.TUnknown>;
    }>>;
    hintPath: Type.TOptional<Type.TString>;
    children: Type.TArray<Type.TObject<{
        key: Type.TString;
        path: Type.TString;
        type: Type.TOptional<Type.TUnion<[Type.TString, Type.TArray<Type.TString>]>>;
        required: Type.TBoolean;
        hasChildren: Type.TBoolean;
        reloadKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"restart">, Type.TLiteral<"hot">, Type.TLiteral<"none">]>>;
        hint: Type.TOptional<Type.TObject<{
            label: Type.TOptional<Type.TString>;
            help: Type.TOptional<Type.TString>;
            tags: Type.TOptional<Type.TArray<Type.TString>>;
            group: Type.TOptional<Type.TString>;
            order: Type.TOptional<Type.TInteger>;
            advanced: Type.TOptional<Type.TBoolean>;
            sensitive: Type.TOptional<Type.TBoolean>;
            placeholder: Type.TOptional<Type.TString>;
            itemTemplate: Type.TOptional<Type.TUnknown>;
        }>>;
        hintPath: Type.TOptional<Type.TString>;
    }>>;
}>;
