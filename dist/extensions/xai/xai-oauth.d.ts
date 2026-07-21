import { c as OAuthCredential } from "../../types-Dd5DQ7z0.js";
import { jt as ProviderAuthResult } from "../../types-BpDhk2ev.js";
import { ft as ProviderAuthContext, mt as ProviderAuthMethod } from "../../plugin-entry-L7QTXRH5.js";
//#region extensions/xai/xai-oauth.d.ts
declare const XAI_OAUTH_METHOD_ID = "oauth";
declare const XAI_OAUTH_CHOICE_ID = "xai-oauth";
declare const XAI_DEVICE_CODE_METHOD_ID = "device-code";
declare const XAI_DEVICE_CODE_CHOICE_ID = "xai-device-code";
declare const XAI_OAUTH_CLIENT_ID = "b1a00492-073a-47ea-816f-4c329264a828";
declare const XAI_OAUTH_SCOPE = "openid profile email offline_access grok-cli:access api:access";
declare const XAI_OAUTH_ISSUER = "https://auth.x.ai";
declare const XAI_OAUTH_DISCOVERY_URL = "https://auth.x.ai/.well-known/openid-configuration";
type XaiOAuthDiscovery = {
  tokenEndpoint: string;
};
type XaiOAuthFetchOptions = {
  fetchImpl?: typeof fetch;
  now?: () => number;
};
declare function isTrustedXaiOAuthEndpoint(endpoint: string): boolean;
declare function fetchXaiOAuthDiscovery(options?: XaiOAuthFetchOptions): Promise<XaiOAuthDiscovery>;
declare function loginXaiDeviceCode(ctx: ProviderAuthContext): Promise<ProviderAuthResult>;
declare function refreshXaiOAuthCredential(credential: OAuthCredential, options?: XaiOAuthFetchOptions): Promise<OAuthCredential>;
declare function createXaiOAuthAuthMethod(): ProviderAuthMethod;
declare function createXaiDeviceCodeAuthMethod(): ProviderAuthMethod;
//#endregion
export { XAI_DEVICE_CODE_CHOICE_ID, XAI_DEVICE_CODE_METHOD_ID, XAI_OAUTH_CHOICE_ID, XAI_OAUTH_CLIENT_ID, XAI_OAUTH_DISCOVERY_URL, XAI_OAUTH_ISSUER, XAI_OAUTH_METHOD_ID, XAI_OAUTH_SCOPE, createXaiDeviceCodeAuthMethod, createXaiOAuthAuthMethod, fetchXaiOAuthDiscovery, isTrustedXaiOAuthEndpoint, loginXaiDeviceCode, refreshXaiOAuthCredential };