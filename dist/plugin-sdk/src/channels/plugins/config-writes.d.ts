import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type ConfigWriteAuthorizationResultLike, type ConfigWriteScopeLike, type ConfigWriteTargetLike } from "./config-write-policy-shared.js";
import type { ChannelId } from "./types.core.js";
/**
 * Channel/account scope used by channel config write checks.
 */
export type ConfigWriteScope = ConfigWriteScopeLike;
/**
 * Target affected by a channel config write.
 */
export type ConfigWriteTarget = ConfigWriteTargetLike;
/**
 * Authorization result for a channel config write.
 */
export type ConfigWriteAuthorizationResult = ConfigWriteAuthorizationResultLike;
/**
 * Resolves whether config writes are enabled for a channel/account scope.
 */
export declare function resolveChannelConfigWrites(params: {
    cfg: OpenClawConfig;
    channelId?: ChannelId | null;
    accountId?: string | null;
}): boolean;
/**
 * Authorizes a channel config write under origin and target policy.
 */
export declare function authorizeConfigWrite(params: {
    cfg: OpenClawConfig;
    origin?: ConfigWriteScope;
    target?: ConfigWriteTarget;
    allowBypass?: boolean;
}): ConfigWriteAuthorizationResult;
/**
 * Resolves an explicit channel/account scope into a config write target.
 */
export declare function resolveExplicitConfigWriteTarget(scope: ConfigWriteScope): ConfigWriteTarget;
/**
 * Infers the channel config write target from a config path.
 */
export declare function resolveConfigWriteTargetFromPath(path: string[]): ConfigWriteTarget;
/**
 * Checks whether a gateway client can bypass channel config write policy.
 */
export declare function canBypassConfigWritePolicy(params: {
    channel?: string | null;
    gatewayClientScopes?: string[] | null;
}): boolean;
/**
 * Formats the user-facing denial message for a blocked channel config write.
 */
export declare function formatConfigWriteDeniedMessage(params: {
    result: Exclude<ConfigWriteAuthorizationResult, {
        allowed: true;
    }>;
    fallbackChannelId?: ChannelId | null;
}): string;
