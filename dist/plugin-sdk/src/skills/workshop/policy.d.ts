import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginHookBeforeToolCallResult } from "../../plugins/hook-before-tool-call-result.js";
/** Returns approval policy for skill workshop lifecycle tool calls. */
export declare function resolveSkillWorkshopToolApproval(params: {
    toolName: string;
    toolParams: unknown;
    config?: OpenClawConfig;
}): PluginHookBeforeToolCallResult | undefined;
