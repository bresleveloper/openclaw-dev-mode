import { n as ApiRegistry } from "./api-registry-BXYnCOIR.mjs";

//#region packages/ai/src/providers/register-builtins.d.ts
/** Source id used for built-in API provider registrations. */
declare const BUILT_IN_API_PROVIDER_SOURCE_ID = "core:built-in";
/** Registers every built-in API provider in one runtime registry. */
declare function registerBuiltInApiProviders(registry: ApiRegistry): void;
/** Restores the built-in provider registry state for tests. */
declare function resetApiProviders(registry: ApiRegistry): void;
//#endregion
export { BUILT_IN_API_PROVIDER_SOURCE_ID, registerBuiltInApiProviders, resetApiProviders };