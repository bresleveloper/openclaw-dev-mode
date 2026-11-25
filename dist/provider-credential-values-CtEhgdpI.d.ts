import { f as SecretRefSource } from "./types.secrets-D_jefub3.js";
/** Resolve the API-key placeholder for a non-env secret-ref source. */
declare function resolveNonEnvSecretRefApiKeyMarker(_source: SecretRefSource): string;
declare function readProviderEnvValue(envVars: string[]): string | undefined;
export { resolveNonEnvSecretRefApiKeyMarker as n, readProviderEnvValue as t };