import { Mg as PluginRuntime } from "./config-contracts-CY87ANNp.js";
//#region extensions/a2a/src/runtime.d.ts
declare const { setRuntime: setA2aChannelRuntime, getRuntime: getA2aChannelRuntime }: {
  setRuntime: (next: PluginRuntime) => void;
  clearRuntime: () => void;
  tryGetRuntime: () => PluginRuntime | null;
  getRuntime: () => PluginRuntime;
};
//#endregion
export { setA2aChannelRuntime as n, getA2aChannelRuntime as t };