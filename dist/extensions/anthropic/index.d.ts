import { A as OpenClawPluginDefinition } from "../../types-BVLQjFJF.js";
import { v as OpenClawPluginConfigSchema, y as OpenClawPluginDefinition$1 } from "../../plugin-entry-DpILbQ7M.js";
//#region extensions/anthropic/index.d.ts
/** Provider entry for Anthropic API and Claude CLI runtime surfaces. */
declare const _default: {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema;
  register: NonNullable<OpenClawPluginDefinition$1["register"]>;
} & Pick<OpenClawPluginDefinition, "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors">;
//#endregion
export { _default as default };