/**
 * Shared Gateway tool schema fragments.
 *
 * Keeps gateway URL/token/timeout parameters aligned across tools that call Gateway methods.
 */
import { Type } from "typebox";
/** Returns optional gateway URL/token/timeout schema properties for tool params. */
export declare function gatewayCallOptionSchemaProperties(): {
    gatewayUrl: Type.TOptional<Type.TString>;
    gatewayToken: Type.TOptional<Type.TString>;
    timeoutMs: Type.TOptional<Type.TInteger>;
};
