import { i as PluginRuntime } from "../../cli-backend.types-kTOThe9I.js";
import { n as ReviewApprovalStore, r as ReefFriendManager, t as ReefMessageFlow } from "../../flow-DHgGYNGA.js";
//#region extensions/reef/src/runtime.d.ts
type ActiveReef = {
  flow: ReefMessageFlow;
  friends: ReefFriendManager;
  reviews: ReviewApprovalStore;
};
declare const setReefRuntime: (next: PluginRuntime) => void, getOptionalReefRuntime: () => PluginRuntime | null, getReefRuntime: () => PluginRuntime;
export declare function getActiveReef(): ActiveReef;
//#endregion
export { getReefRuntime, setReefRuntime };