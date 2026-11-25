import { iA as ChannelPlugin } from "../../config-contracts-hzlacViZ.js";
import { t as DEFAULT_ACCOUNT_ID } from "../../account-id-Dn0dJeta.js";
import { r as OpenClawConfig } from "../../types.openclaw-D8uW-XQA.js";
import "../../zod-schema.implicit-mentions-C4-S3AOR.js";
import { n as setA2aChannelRuntime, t as getA2aChannelRuntime } from "../../runtime-BgNOJqdU.js";
import { z } from "zod";
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
export declare function listA2aChannelAccountIds(cfg: OpenClawConfig): string[];
export declare function resolveDefaultA2aChannelAccountId(): string;
export declare function resolveA2aChannelAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedA2aChannelAccount;
export declare const a2aChannelPlugin: ChannelPlugin<ResolvedA2aChannelAccount>;
export { type A2aChannelConfig, type A2aCoreConfig, type A2aPeerConfig, DEFAULT_ACCOUNT_ID, type ResolvedA2aChannelAccount, getA2aChannelRuntime, setA2aChannelRuntime };