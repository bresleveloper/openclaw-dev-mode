import { $n as PluginRuntime } from "../../types-BVLQjFJF.js";
import { t as synologyChatPlugin } from "../../channel-aNL49vbK.js";
import { t as collectSynologyChatSecurityAuditFindings } from "../../security-audit-9EGcNasg.js";

//#region extensions/synology-chat/src/runtime.d.ts
declare const setSynologyRuntime: (next: PluginRuntime) => void, getSynologyRuntime: () => PluginRuntime;
//#endregion
export { collectSynologyChatSecurityAuditFindings, setSynologyRuntime, synologyChatPlugin };