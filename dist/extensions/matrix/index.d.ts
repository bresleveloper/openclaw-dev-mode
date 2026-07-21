import { t as ChannelPlugin } from "../../types.plugin-DeFN_A48.js";
import { n as BundledChannelEntryContract, o as OpenClawPluginApi } from "../../channel-entry-contract-DJhMguHx.js";

//#region extensions/matrix/index.d.ts
declare function registerMatrixFullRuntime(api: OpenClawPluginApi): void;
declare const _default: BundledChannelEntryContract<ChannelPlugin>;
//#endregion
export { _default as default, registerMatrixFullRuntime };