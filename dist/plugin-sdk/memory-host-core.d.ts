import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { r as resolveSessionTranscriptsDirForAgent } from "../paths-BfUTg5dU.js";
import "../config-Dpca5-xX.js";
import { Cl as buildMemoryPromptSection, Dl as registerMemoryCapability, El as listActiveMemoryPublicArtifacts, Ol as registerMemoryCorpusSupplement, Tl as getMemoryCapabilityRegistration, gl as MemoryPluginPublicArtifact, hl as MemoryPluginCapability, vl as MemoryPromptSectionBuilder, wl as clearMemoryPluginState } from "../agent-harness-runtime-DZjstJNb.js";
import { f as resolveDefaultAgentId } from "../agent-scope-CQBriA71.js";
import { t as resolveSessionAgentIdCompatibility } from "../agent-scope-runtime-rNgrwLoo.js";
//#region src/plugin-sdk/memory-host-core.d.ts
/** Lists public memory artifacts across all configured memory workspaces. */
export declare function listMemoryHostPublicArtifacts(params: {
  cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]>;
//#endregion
export { type MemoryPluginCapability, type MemoryPluginPublicArtifact, type MemoryPromptSectionBuilder, buildMemoryPromptSection as buildActiveMemoryPromptSection, clearMemoryPluginState, getMemoryCapabilityRegistration, listActiveMemoryPublicArtifacts, registerMemoryCapability, registerMemoryCorpusSupplement, resolveDefaultAgentId, resolveSessionAgentIdCompatibility as resolveSessionAgentId, resolveSessionTranscriptsDirForAgent };