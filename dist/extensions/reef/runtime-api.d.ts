import { Mg as PluginRuntime } from "../../config-contracts-CY87ANNp.js";
import "../../flow-BGnvCpn_.js";
//#region extensions/reef/src/runtime.d.ts
declare const { setRuntime: setReefRuntime, tryGetRuntime: getOptionalReefRuntime, getRuntime: getReefRuntime }: {
  setRuntime: (next: PluginRuntime) => void;
  clearRuntime: () => void;
  tryGetRuntime: () => PluginRuntime | null;
  getRuntime: () => PluginRuntime;
};
//#endregion
export { setReefRuntime };