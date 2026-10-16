import { c as PluginRuntime } from "../../net-CNd-dg0-.js";
import "../../flow-tKggAzpf.js";
//#region extensions/reef/src/runtime.d.ts
declare const { setRuntime: setReefRuntime, tryGetRuntime: getOptionalReefRuntime, getRuntime: getReefRuntime }: {
  setRuntime: (next: PluginRuntime) => void;
  clearRuntime: () => void;
  tryGetRuntime: () => PluginRuntime | null;
  getRuntime: () => PluginRuntime;
};
//#endregion
export { setReefRuntime };