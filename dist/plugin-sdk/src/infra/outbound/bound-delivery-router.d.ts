import { type ConversationRef, type SessionBindingRecord, type SessionBindingService } from "./session-binding-service.js";
/** Session-bound delivery lookup input for routing task completion messages. */
export type BoundDeliveryRouterInput = {
    eventKind: "task_completion";
    targetSessionKey: string;
    requester?: ConversationRef;
    failClosed: boolean;
};
/** Resolved session binding or the fallback reason used by delivery callers. */
export type BoundDeliveryRouterResult = {
    binding: SessionBindingRecord | null;
    mode: "bound" | "fallback";
    reason: string;
};
/** Router facade that maps a target session/requester pair to a bound conversation. */
export type BoundDeliveryRouter = {
    resolveDestination: (input: BoundDeliveryRouterInput) => BoundDeliveryRouterResult;
};
/** Creates a router that resolves task-completion delivery through active session bindings. */
export declare function createBoundDeliveryRouter(service?: SessionBindingService): BoundDeliveryRouter;
