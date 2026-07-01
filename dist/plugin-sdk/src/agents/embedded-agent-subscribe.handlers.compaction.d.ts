import type { EmbeddedAgentSubscribeContext } from "./embedded-agent-subscribe.handlers.types.js";
import type { AgentSessionEvent } from "./sessions/index.js";
type SessionCompactionStartEvent = Extract<AgentSessionEvent, {
    type: "compaction_start";
}>;
type SessionCompactionEndEvent = Extract<AgentSessionEvent, {
    type: "compaction_end";
}>;
type CompactionStartEvent = SessionCompactionStartEvent | {
    type: "compaction_start";
    reason?: unknown;
};
type CompactionEndEvent = SessionCompactionEndEvent | {
    type: "compaction_end";
    reason?: unknown;
    willRetry?: unknown;
    result?: unknown;
    aborted?: unknown;
};
/** Handles compaction start events from an embedded agent session. */
export declare function handleCompactionStart(ctx: EmbeddedAgentSubscribeContext, evt: CompactionStartEvent): void;
/** Handles compaction completion, retry, and incomplete events. */
export declare function handleCompactionEnd(ctx: EmbeddedAgentSubscribeContext, evt: CompactionEndEvent): void;
export {};
