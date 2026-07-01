import type { AgentMessage } from "../../runtime/index.js";
import type { ExtensionContext } from "../../sessions/index.js";
import type { EffectiveContextPruningSettings } from "./settings.js";
/** Returns a pruned message array when configured thresholds are exceeded, otherwise original. */
export declare function pruneContextMessages(params: {
    messages: AgentMessage[];
    settings: EffectiveContextPruningSettings;
    ctx: Pick<ExtensionContext, "model">;
    isToolPrunable?: (toolName: string) => boolean;
    contextWindowTokensOverride?: number;
    dropThinkingBlocksForEstimate?: boolean;
}): AgentMessage[];
