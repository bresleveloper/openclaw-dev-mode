import type { SecretRefSource } from "../config/types.secrets.js";
/** @deprecated MiniMax provider-owned marker; do not use from third-party plugins. */
export declare const MINIMAX_OAUTH_MARKER = "minimax-oauth";
/** Prefix for persisted OAuth-backed API-key marker values. */
export declare const OAUTH_API_KEY_MARKER_PREFIX = "oauth:";
/** Marker for local Ollama auth that does not use a real API key. */
export declare const OLLAMA_LOCAL_AUTH_MARKER = "ollama-local";
/** @deprecated Bundled local-provider marker; do not use from third-party plugins. */
export declare const CUSTOM_LOCAL_AUTH_MARKER = "custom-local";
/** @deprecated Codex provider-owned marker; do not use from third-party plugins. */
export declare const CODEX_APP_SERVER_AUTH_MARKER = "codex-app-server";
/** Marker for Google Vertex credentials resolved outside plain API-key env vars. */
export declare const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
/** Marker for a secret-ref-managed credential that is not stored as an env var. */
export declare const NON_ENV_SECRETREF_MARKER = "secretref-managed";
/** Prefix for secret-ref header markers that name an env-backed source. */
export declare const SECRETREF_ENV_HEADER_MARKER_PREFIX = "secretref-env:";
/** List non-secret auth markers known from core and bundled plugin manifests. */
export declare function listKnownNonSecretApiKeyMarkers(): string[];
/** Return true for AWS SDK env marker values that represent ambient auth. */
export declare function isAwsSdkAuthMarker(value: string): boolean;
/** Return true for recognized env-var API-key placeholders, excluding AWS SDK markers. */
export declare function isKnownEnvApiKeyMarker(value: string): boolean;
/** Build the persisted OAuth marker for one provider id. */
export declare function resolveOAuthApiKeyMarker(providerId: string): string;
/** Return true when a marker value points at provider OAuth auth. */
export declare function isOAuthApiKeyMarker(value: string): boolean;
/** Resolve the API-key placeholder for a non-env secret-ref source. */
export declare function resolveNonEnvSecretRefApiKeyMarker(_source: SecretRefSource): string;
/** Resolve the header-value placeholder for a non-env secret-ref source. */
export declare function resolveNonEnvSecretRefHeaderValueMarker(_source: SecretRefSource): string;
/** Resolve the header-value placeholder for an env-backed secret-ref source. */
export declare function resolveEnvSecretRefHeaderValueMarker(envVarName: string): string;
/** Return true for secret-ref placeholders used in auth header values. */
export declare function isSecretRefHeaderValueMarker(value: string): boolean;
/** Return true for persisted non-secret placeholders that should not be treated as real keys. */
export declare function isNonSecretApiKeyMarker(value: string, opts?: {
    includeEnvVarName?: boolean;
}): boolean;
