import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { h as SecretRef } from "./types.secrets-C15Z_eLX.js";
import { n as PluginManifestRegistry } from "./manifest-registry-B03IrHXx.js";
import { h as SecretRefResolveCache } from "./runtime-shared-D5iTR4VR.js";

//#region src/secrets/resolve.d.ts
type ResolveSecretRefOptions = {
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  cache?: SecretRefResolveCache;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
};
/** Error for failures that affect an entire configured secret provider. */
/** Error emitted when a configured secret provider cannot resolve a ref. */
/** Resolves a batch of SecretRefs, grouped by provider for bounded provider concurrency. */
declare function resolveSecretRefValues(refs: SecretRef[], options: ResolveSecretRefOptions): Promise<Map<string, unknown>>;
//#endregion
export { resolveSecretRefValues as t };