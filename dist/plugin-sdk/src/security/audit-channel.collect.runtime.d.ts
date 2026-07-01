type CollectChannelSecurityFindings = typeof import("./audit-channel.js").collectChannelSecurityFindings;
/** Runtime facade for channel security collection, kept mockable for audit tests. */
export declare function collectChannelSecurityFindings(...args: Parameters<CollectChannelSecurityFindings>): ReturnType<CollectChannelSecurityFindings>;
export {};
