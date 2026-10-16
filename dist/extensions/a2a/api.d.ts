import { ro as OpenClawConfig } from "../../agent-scope-Dajnzfj6.js";
import { d as setA2aChannelRuntime, p as ChannelPlugin, u as getA2aChannelRuntime } from "../../channel-core-Dw23qZdV.js";
import { z } from "zod";
//#region src/routing/account-id.d.ts
export declare const DEFAULT_ACCOUNT_ID = "default";
//#endregion
//#region extensions/a2a/src/config-schema.d.ts
declare const a2aPeerConfigSchema: z.ZodObject<{
  token: z.ZodString;
  url: z.ZodOptional<z.ZodIntersection<z.ZodString, z.ZodString>>;
  outboundToken: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
declare const a2aChannelConfigSchema: z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  advertisedUrl: z.ZodOptional<z.ZodIntersection<z.ZodString, z.ZodString>>;
  replyTimeoutMs: z.ZodOptional<z.ZodNumber>;
  rateLimitPerMinute: z.ZodOptional<z.ZodNumber>;
  exposeAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
  peers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    token: z.ZodString;
    url: z.ZodOptional<z.ZodIntersection<z.ZodString, z.ZodString>>;
    outboundToken: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>>;
}, z.core.$strict>;
type A2aPeerConfig = z.input<typeof a2aPeerConfigSchema>;
type A2aChannelConfig = z.input<typeof a2aChannelConfigSchema>;
//#endregion
//#region extensions/a2a/src/types.d.ts
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
  /** Peers withheld from `config` because their inbound token reference did not resolve. */
  unresolvedPeers: string[];
  /** Peers kept for inbound auth whose authored `outboundToken` reference did not resolve. */
  unresolvedOutboundPeers: string[];
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
export { type A2aChannelConfig, type A2aCoreConfig, type A2aPeerConfig, type ResolvedA2aChannelAccount, getA2aChannelRuntime, setA2aChannelRuntime };