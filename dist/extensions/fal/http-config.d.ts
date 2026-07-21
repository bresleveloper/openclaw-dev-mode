import { i as OpenClawConfig } from "../../types.openclaw-B5gtuEn_.js";
import { _ as ProviderRequestCapability } from "../../provider-request-config-BCB9v_aj.js";
import { s as AuthProfileStore } from "../../types-Dd5DQ7z0.js";
import { h as resolveProviderHttpRequestConfig } from "../../provider-http-CPDH5NmX.js";
//#region extensions/fal/http-config.d.ts
type FalAuthenticatedRequest = {
  cfg?: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
};
declare function resolveFalHttpRequestConfig(params: {
  req: FalAuthenticatedRequest;
  baseUrl?: string;
  capability: ProviderRequestCapability;
}): Promise<ReturnType<typeof resolveProviderHttpRequestConfig>>;
//#endregion
export { resolveFalHttpRequestConfig };