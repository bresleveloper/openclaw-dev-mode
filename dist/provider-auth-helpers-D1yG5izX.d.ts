import { cS as SecretInputMode, lx as OAuthCredentials } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { d as SecretRef, u as SecretInput } from "./types.secrets-D_jefub3.js";
type ApiKeyStorageOptions = {
  secretInputMode?: SecretInputMode;
  config?: OpenClawConfig;
};
type WriteOAuthCredentialsOptions = {
  syncSiblingAgents?: boolean;
  profileName?: string;
  displayName?: string;
};
declare function buildApiKeyCredential(provider: string, input: SecretInput, metadata?: Record<string, string>, options?: ApiKeyStorageOptions): {
  type: "api_key";
  provider: string;
  key?: string;
  keyRef?: SecretRef;
  metadata?: Record<string, string>;
};
/** @deprecated Use upsertApiKeyProfileAsync. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function upsertApiKeyProfile(params: {
  provider: string;
  input: SecretInput;
  agentDir?: string;
  options?: ApiKeyStorageOptions;
  profileId?: string;
  metadata?: Record<string, string>;
}): string;
declare function upsertApiKeyProfileAsync(params: Parameters<typeof upsertApiKeyProfile>[0]): Promise<string>;
declare function applyAuthProfileConfig(cfg: OpenClawConfig, params: {
  profileId: string;
  provider: string;
  mode: "api_key" | "aws-sdk" | "oauth" | "token";
  email?: string;
  displayName?: string;
  preferProfileFirst?: boolean;
}): OpenClawConfig;
declare function writeOAuthCredentials(provider: string, creds: OAuthCredentials, agentDir?: string, options?: WriteOAuthCredentialsOptions): Promise<string>;
export { upsertApiKeyProfile as a, buildApiKeyCredential as i, WriteOAuthCredentialsOptions as n, upsertApiKeyProfileAsync as o, applyAuthProfileConfig as r, writeOAuthCredentials as s, ApiKeyStorageOptions as t };