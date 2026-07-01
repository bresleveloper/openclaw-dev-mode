import { i as OpenClawConfig } from "../../types.openclaw-DlpCUWMr.js";
import { h as ProviderRequestCapability } from "../../provider-request-config-Kai3Qa6I.js";
import { s as AuthProfileStore } from "../../types-CrmAJw_-.js";
import { h as resolveProviderHttpRequestConfig } from "../../provider-http-Bra7ohEz.js";
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