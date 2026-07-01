import type { EmbeddedAgentSubscribeContext, EmbeddedAgentSubscribeEvent } from "./embedded-agent-subscribe.handlers.types.js";
/** Create the serialized event dispatcher for subscribed embedded-agent sessions. */
export declare function createEmbeddedAgentSessionEventHandler(ctx: EmbeddedAgentSubscribeContext): (evt: EmbeddedAgentSubscribeEvent) => void;
