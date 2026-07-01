import type { EmbeddedAgentSubscribeContext } from "./embedded-agent-subscribe.handlers.types.js";
import type { AgentSessionEvent } from "./sessions/index.js";
export { handleCompactionEnd, handleCompactionStart, } from "./embedded-agent-subscribe.handlers.compaction.js";
export declare function handleAgentStart(ctx: EmbeddedAgentSubscribeContext): void;
export declare function handleAgentEnd(ctx: EmbeddedAgentSubscribeContext, evt?: Extract<AgentSessionEvent, {
    type: "agent_end";
}>): void | Promise<void>;
