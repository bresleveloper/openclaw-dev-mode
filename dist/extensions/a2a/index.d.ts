import { Cn as ChannelOutboundAdapter, bn as ChannelPlugin, r as OpenClawPluginApi$1 } from "../../runtime-api-QiF8aK_Q.js";
import { Q as ChannelConfigSchema } from "../../types.openclaw-BsXQib09.js";
import { createJiti } from "jiti";
//#region src/plugins/jiti-factory.d.ts
/** Keep Babel's lazy require inside Jiti's CJS module, where native resolver hooks retain its parent. */
declare const createJiti$1: typeof createJiti;
//#endregion
//#region src/plugins/plugin-module-loader-cache.d.ts
type PluginModuleLoaderFactory = typeof createJiti$1;
//#endregion
//#region src/plugin-sdk/channel-entry-contract.types.d.ts
/** Test hook for swapping the source-module loader used by bundled entry imports. */
type BundledEntryModuleLoadOptions = {
  createLoaderForTest?: PluginModuleLoaderFactory;
};
//#endregion
//#region src/plugin-sdk/channel-entry-contract.d.ts
type OpenClawPluginApi = OpenClawPluginApi$1;
type BundledChannelRuntime = unknown;
/** Feature flags exposed by full bundled channel entries. */
type BundledChannelEntryFeatures = {
  accountInspect?: boolean;
};
/** Runtime contract returned by a bundled channel's main entrypoint definition. */
type BundledChannelEntryContract<TPlugin = ChannelPlugin> = {
  kind: "bundled-channel-entry";
  id: string;
  name: string;
  description: string;
  configSchema: ChannelConfigSchema;
  features?: BundledChannelEntryFeatures;
  register: (api: OpenClawPluginApi) => void;
  loadChannelPlugin: (options?: BundledEntryModuleLoadOptions) => TPlugin;
  loadChannelOutbound?: (options?: BundledEntryModuleLoadOptions) => ChannelOutboundAdapter | undefined;
  loadChannelSecrets?: (options?: BundledEntryModuleLoadOptions) => ChannelPlugin["secrets"] | undefined;
  loadChannelAccountInspector?: (options?: BundledEntryModuleLoadOptions) => NonNullable<ChannelPlugin["config"]["inspectAccount"]>;
  setChannelRuntime?: (runtime: BundledChannelRuntime) => void;
};
//#endregion
//#region extensions/a2a/index.d.ts
declare const _default: BundledChannelEntryContract<ChannelPlugin>;
//#endregion
export { _default as default };