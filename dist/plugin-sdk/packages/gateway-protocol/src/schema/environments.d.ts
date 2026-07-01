import { Type } from "typebox";
/**
 * Environment inventory protocol schemas.
 *
 * Environments are runtime targets such as local hosts, VMs, or remote workers;
 * this schema layer only describes their gateway-visible status summary.
 */
/** Runtime availability state for an environment target. */
export declare const EnvironmentStatusSchema: Type.TString;
/** Public environment summary shown in listings and status responses. */
export declare const EnvironmentSummarySchema: Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    label: Type.TOptional<Type.TString>;
    status: Type.TString;
    capabilities: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Empty request payload for listing known environments. */
export declare const EnvironmentsListParamsSchema: Type.TObject<{}>;
/** List response containing all gateway-visible environment summaries. */
export declare const EnvironmentsListResultSchema: Type.TObject<{
    environments: Type.TArray<Type.TObject<{
        id: Type.TString;
        type: Type.TString;
        label: Type.TOptional<Type.TString>;
        status: Type.TString;
        capabilities: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
}>;
/** Status lookup request for one environment id. */
export declare const EnvironmentsStatusParamsSchema: Type.TObject<{
    environmentId: Type.TString;
}>;
/** Status lookup result for one environment id. */
export declare const EnvironmentsStatusResultSchema: Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    label: Type.TOptional<Type.TString>;
    status: Type.TString;
    capabilities: Type.TOptional<Type.TArray<Type.TString>>;
}>;
