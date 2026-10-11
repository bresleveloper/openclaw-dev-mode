import { Au as MemoryPromptSectionBuilder, Bu as buildMemoryPromptSection, Du as MemoryPluginCapability, Gu as registerMemoryCorpusSupplement, Hu as getMemoryCapabilityRegistration, Ou as MemoryPluginPublicArtifact, Uu as listActiveMemoryPublicArtifacts, Vu as clearMemoryPluginState, Wu as registerMemoryCapability } from "../agent-harness-runtime-wMciqZ6Z.js";
import { r as OpenClawConfig } from "../types.openclaw-Ccmw-oTa.js";
import { r as resolveSessionTranscriptsDirForAgent } from "../paths-UINMFCfh.js";
import "../config-Dt1SOlIN.js";
import { f as resolveDefaultAgentId } from "../agent-scope-BV0uIQk3.js";
import { t as resolveSessionAgentIdCompatibility } from "../agent-scope-runtime-CR9EEnU3.js";
//#region src/plugin-sdk/memory-host-core.d.ts
/** Lists public memory artifacts across all configured memory workspaces. */
export declare function listMemoryHostPublicArtifacts(params: {
  cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]>;
//#endregion
export { type MemoryPluginCapability, type MemoryPluginPublicArtifact, type MemoryPromptSectionBuilder, buildMemoryPromptSection as buildActiveMemoryPromptSection, clearMemoryPluginState, getMemoryCapabilityRegistration, listActiveMemoryPublicArtifacts, registerMemoryCapability, registerMemoryCorpusSupplement, resolveDefaultAgentId, resolveSessionAgentIdCompatibility as resolveSessionAgentId, resolveSessionTranscriptsDirForAgent };