import { Type, type Static } from "typebox";
/**
 * Secret-provider protocol schemas.
 *
 * These payloads request secret materialization from the gateway while keeping
 * caller scope, allowed paths, and provider overrides explicit.
 */
/** Empty request payload for reloading configured secret providers. */
export declare const SecretsReloadParamsSchema: Type.TObject<{}>;
/** Request payload for resolving the secrets needed by one command invocation. */
export declare const SecretsResolveParamsSchema: Type.TObject<{
    commandName: Type.TString;
    targetIds: Type.TArray<Type.TString>;
    allowedPaths: Type.TOptional<Type.TArray<Type.TString>>;
    forcedActivePaths: Type.TOptional<Type.TArray<Type.TString>>;
    optionalActivePaths: Type.TOptional<Type.TArray<Type.TString>>;
    providerOverrides: Type.TOptional<Type.TObject<{
        webSearch: Type.TOptional<Type.TString>;
        webFetch: Type.TOptional<Type.TString>;
    }>>;
}>;
/** Static type for secret resolution requests. */
export type SecretsResolveParams = Static<typeof SecretsResolveParamsSchema>;
/** One resolved secret assignment path plus its provider-owned value. */
export declare const SecretsResolveAssignmentSchema: Type.TObject<{
    path: Type.TOptional<Type.TString>;
    pathSegments: Type.TArray<Type.TString>;
    value: Type.TUnknown;
}>;
/** Secret resolution response with assignments and safe diagnostics. */
export declare const SecretsResolveResultSchema: Type.TObject<{
    ok: Type.TOptional<Type.TBoolean>;
    assignments: Type.TOptional<Type.TArray<Type.TObject<{
        path: Type.TOptional<Type.TString>;
        pathSegments: Type.TArray<Type.TString>;
        value: Type.TUnknown;
    }>>>;
    diagnostics: Type.TOptional<Type.TArray<Type.TString>>;
    inactiveRefPaths: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Static type for secret resolution responses. */
export type SecretsResolveResult = Static<typeof SecretsResolveResultSchema>;
