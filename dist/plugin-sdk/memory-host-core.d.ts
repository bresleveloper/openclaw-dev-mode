import { M as OpenClawConfig } from "../types-D7I_F5Ux.js";
import { Bm as MemoryPromptSectionBuilder, Gl as registerMemoryCapability, Hl as clearMemoryPluginState, Im as MemoryPluginCapability, Kl as registerMemoryCorpusSupplement, Lm as MemoryPluginPublicArtifact, OA as resolveSessionTranscriptsDirForAgent, TT as resolveDefaultAgentId, Ul as getMemoryCapabilityRegistration, Vl as buildMemoryPromptSection, Wl as listActiveMemoryPublicArtifacts, hi as resolveSessionAgentIdCompatibility } from "../config-contracts-CY87ANNp.js";
import "../config-S5Zm-Svf.js";
//#region src/plugin-sdk/memory-host-core.d.ts
/** Lists public memory artifacts across all configured memory workspaces. */
export declare function listMemoryHostPublicArtifacts(params: {
  cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]>;
//#endregion
export { type MemoryPluginCapability, type MemoryPluginPublicArtifact, type MemoryPromptSectionBuilder, buildMemoryPromptSection as buildActiveMemoryPromptSection, clearMemoryPluginState, getMemoryCapabilityRegistration, listActiveMemoryPublicArtifacts, registerMemoryCapability, registerMemoryCorpusSupplement, resolveDefaultAgentId, resolveSessionAgentIdCompatibility as resolveSessionAgentId, resolveSessionTranscriptsDirForAgent };