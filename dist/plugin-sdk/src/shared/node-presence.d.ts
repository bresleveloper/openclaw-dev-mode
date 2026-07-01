/** Gateway event name used by node hosts to refresh their last-seen presence. */
export declare const NODE_PRESENCE_ALIVE_EVENT = "node.presence.alive";
/** Reasons accepted from native/background node presence events. */
declare const NODE_PRESENCE_ALIVE_REASONS: readonly ["background", "silent_push", "bg_app_refresh", "significant_location", "manual", "connect"];
/** Canonical trigger reason stored with node presence updates. */
type NodePresenceAliveReason = (typeof NODE_PRESENCE_ALIVE_REASONS)[number];
/** Normalizes untrusted presence trigger values, defaulting unknown input to background. */
export declare function normalizeNodePresenceAliveReason(value: unknown): NodePresenceAliveReason;
export {};
