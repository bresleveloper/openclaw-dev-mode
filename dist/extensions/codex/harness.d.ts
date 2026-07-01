import { Da as AgentHarness } from "../../types-BVLQjFJF.js";
import { n as CodexAppServerModel, r as CodexAppServerModelListResult, t as CodexAppServerListModelsOptions } from "../../models-CgmKSmcG.js";

//#region extensions/codex/harness.d.ts
/**
 * Creates the Codex app-server harness used for attempts, side questions,
 * compaction, reset, and disposal.
 */
declare function createCodexAppServerAgentHarness(options?: {
  id?: string;
  label?: string;
  providerIds?: Iterable<string>;
  pluginConfig?: unknown;
  resolvePluginConfig?: () => unknown;
}): AgentHarness;
//#endregion
export { type CodexAppServerListModelsOptions, type CodexAppServerModel, type CodexAppServerModelListResult, createCodexAppServerAgentHarness };