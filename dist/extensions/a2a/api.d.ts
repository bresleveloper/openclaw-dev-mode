import { Fn as DEFAULT_ACCOUNT_ID, bn as ChannelPlugin, ln as getA2aChannelRuntime, un as setA2aChannelRuntime } from "../../runtime-api-CHs6AUp7.js";
import { n as OpenClawConfig } from "../../types.openclaw-BsXQib09.js";
//#region extensions/a2a/src/types.d.ts
type A2aPeerConfig = {
  token: string;
  url?: string;
  outboundToken?: string;
};
type A2aChannelConfig = {
  enabled?: boolean;
  configWrites?: boolean;
  advertisedUrl?: string;
  replyTimeoutMs?: number;
  rateLimitPerMinute?: number;
  exposeAgents?: string[];
  peers?: Record<string, A2aPeerConfig>;
};
type A2aCoreConfig = OpenClawConfig & {
  channels?: OpenClawConfig["channels"] & {
    a2a?: A2aChannelConfig;
  };
};
type ResolvedA2aChannelAccount = {
  accountId: string;
  enabled: boolean;
  configured: boolean;
  config: A2aChannelConfig;
};
//#endregion
//#region extensions/a2a/src/accounts.d.ts
export declare function listA2aChannelAccountIds(cfg: OpenClawConfig): string[];
export declare function resolveDefaultA2aChannelAccountId(): string;
export declare function resolveA2aChannelAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedA2aChannelAccount;
//#endregion
//#region extensions/a2a/src/channel.d.ts
export declare const a2aChannelPlugin: ChannelPlugin<ResolvedA2aChannelAccount>;
//#endregion
export { type A2aChannelConfig, type A2aCoreConfig, type A2aPeerConfig, DEFAULT_ACCOUNT_ID, type ResolvedA2aChannelAccount, getA2aChannelRuntime, setA2aChannelRuntime };