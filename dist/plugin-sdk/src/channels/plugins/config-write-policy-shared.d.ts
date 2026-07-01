type ConfigWritePolicyConfig = {
    channels?: Record<string, unknown>;
};
/**
 * Channel/account scope used to evaluate config write policy.
 */
export type ConfigWriteScopeLike<TChannelId extends string = string> = {
    channelId?: TChannelId | null;
    accountId?: string | null;
};
/**
 * Target affected by a config write command.
 */
export type ConfigWriteTargetLike<TChannelId extends string = string> = {
    kind: "global";
} | {
    kind: "channel";
    scope: {
        channelId: TChannelId;
    };
} | {
    kind: "account";
    scope: {
        channelId: TChannelId;
        accountId: string;
    };
} | {
    kind: "ambiguous";
    scopes: ConfigWriteScopeLike<TChannelId>[];
};
/**
 * Authorization result for a config write under channel configWrites policy.
 */
export type ConfigWriteAuthorizationResultLike<TChannelId extends string = string> = {
    allowed: true;
} | {
    allowed: false;
    reason: "ambiguous-target" | "origin-disabled" | "target-disabled";
    blockedScope?: {
        kind: "origin" | "target";
        scope: ConfigWriteScopeLike<TChannelId>;
    };
};
/**
 * Resolves whether config writes are enabled for a channel/account scope.
 */
export declare function resolveChannelConfigWritesShared(params: {
    cfg: ConfigWritePolicyConfig;
    channelId?: string | null;
    accountId?: string | null;
}): boolean;
/**
 * Authorizes a channel-initiated config write against origin and target policy.
 */
export declare function authorizeConfigWriteShared<TChannelId extends string>(params: {
    cfg: ConfigWritePolicyConfig;
    origin?: ConfigWriteScopeLike<TChannelId>;
    target?: ConfigWriteTargetLike<TChannelId>;
    allowBypass?: boolean;
}): ConfigWriteAuthorizationResultLike<TChannelId>;
/**
 * Resolves an explicit channel/account scope into a config write target.
 */
export declare function resolveExplicitConfigWriteTargetShared<TChannelId extends string>(scope: ConfigWriteScopeLike<TChannelId>): ConfigWriteTargetLike<TChannelId>;
/**
 * Infers the config write target from a config path.
 */
export declare function resolveConfigWriteTargetFromPathShared<TChannelId extends string>(params: {
    path: string[];
    normalizeChannelId: (raw: string) => TChannelId | null | undefined;
}): ConfigWriteTargetLike<TChannelId>;
/**
 * Checks whether an internal admin client can bypass channel config write policy.
 */
export declare function canBypassConfigWritePolicyShared(params: {
    channel?: string | null;
    gatewayClientScopes?: string[] | null;
    isInternalMessageChannel: (channel?: string | null) => boolean;
}): boolean;
/**
 * Formats the user-facing denial message for a blocked config write.
 */
export declare function formatConfigWriteDeniedMessageShared<TChannelId extends string>(params: {
    result: Exclude<ConfigWriteAuthorizationResultLike<TChannelId>, {
        allowed: true;
    }>;
    fallbackChannelId?: TChannelId | null;
}): string;
export {};
