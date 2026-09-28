import "./types.secrets-BR-Cncxg.js";
//#region src/agents/model-auth-markers.d.ts
/** @deprecated MiniMax provider-owned marker; do not use from third-party plugins. */
declare const MINIMAX_OAUTH_MARKER = "minimax-oauth";
/** @deprecated Bundled local-provider marker; do not use from third-party plugins. */
declare const CUSTOM_LOCAL_AUTH_MARKER = "custom-local";
/** @deprecated Codex provider-owned marker; do not use from third-party plugins. */
declare const CODEX_APP_SERVER_AUTH_MARKER = "codex-app-server";
/** Return true for recognized env-var API-key placeholders, excluding AWS SDK markers. */
declare function isKnownEnvApiKeyMarker(value: string): boolean;
/** Build the persisted OAuth marker for one provider id. */
declare function resolveOAuthApiKeyMarker(providerId: string): string;
/** Return true for persisted non-secret placeholders that should not be treated as real keys. */
declare function isNonSecretApiKeyMarker(value: string, opts?: {
  includeEnvVarName?: boolean;
}): boolean;
//#endregion
export { isNonSecretApiKeyMarker as a, isKnownEnvApiKeyMarker as i, CUSTOM_LOCAL_AUTH_MARKER as n, resolveOAuthApiKeyMarker as o, MINIMAX_OAUTH_MARKER as r, CODEX_APP_SERVER_AUTH_MARKER as t };