import { J as PluginRuntime } from "../../config-contracts-hzlacViZ.js";
import "../../flow-Bcs9ntqX.js";
declare const { setRuntime: setReefRuntime, tryGetRuntime: getOptionalReefRuntime, getRuntime: getReefRuntime }: {
  setRuntime: (next: PluginRuntime) => void;
  clearRuntime: () => void;
  tryGetRuntime: () => PluginRuntime | null;
  getRuntime: () => PluginRuntime;
};
export { setReefRuntime };