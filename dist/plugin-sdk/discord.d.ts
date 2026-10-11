import { Ju as emptyPluginConfigSchema, Ns as OpenClawPluginApi, ui as PluginRuntime } from "../agent-harness-runtime-wMciqZ6Z.js";
import { r as OpenClawConfig } from "../types.openclaw-Ccmw-oTa.js";
import { O as ChannelStatusIssue, d as ChannelGroupContext, h as ChannelMessageActionAdapter, r as ChannelAccountSnapshot } from "../types.core-BfkZpaZ6.js";
import { S as MessageReceipt } from "../types-Cjozjt4T.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../account-id-Dh6XMgGH.js";
import { t as ChannelPlugin } from "../types.plugin-DWwKnMgs.js";
import { t as ChannelMessageActionName } from "../types.public-DBD5_XgT.js";
import "../channel-contract-DHSiPgPz.js";
import { i as buildChannelConfigSchema } from "../config-schema-edRW2Mnr.js";
import { o as migrateBaseNameToDefaultAccount, t as applyAccountNameToChannelSection } from "../setup-helpers-CulguIXb.js";
import "../channel-core-Bokbb1mt.js";
import "../channel-outbound-B339aBc0.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../pairing-message-CFs8lRw3.js";
import { t as getChatChannelMeta } from "../channel-plugin-common-CqA8Q2LE.js";
import { n as resolveConfiguredFromCredentialStatuses, t as projectCredentialSnapshotFields } from "../channel-status-PgOmPZap.js";
import { i as buildComputedAccountStatusSnapshot, s as buildTokenChannelStatusSummary } from "../status-helpers-B4gU952B.js";
import "../config-contracts-DBkfUWkX.js";
//#region src/plugin-sdk/discord.d.ts
/** Discord channel config shape for one account in OpenClaw config. */
export type DiscordAccountConfig = NonNullable<NonNullable<OpenClawConfig["channels"]>["discord"]>;
/** Component-message request accepted by the deprecated Discord SDK facade. */
export type DiscordComponentMessageSpec = {
  text?: string;
  reusable?: boolean;
  container?: {
    accentColor?: string | number;
    spoiler?: boolean;
  };
  blocks?: unknown[];
  modal?: unknown;
};
/** Built Discord component payload plus registration metadata. */
export type DiscordComponentBuildResult = {
  components: unknown[];
  entries: unknown[];
  modals: unknown[];
};
/** Send/edit options for Discord component messages. */
export type DiscordComponentSendOpts = {
  cfg: OpenClawConfig;
  accountId?: string;
  replyTo?: string;
  files?: unknown;
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  filename?: string;
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: unknown;
  chunkMode?: unknown;
  [key: string]: unknown;
};
/** Normalized Discord message result returned by component send/edit helpers. */
export type DiscordComponentSendResult = {
  messageId: string;
  channelId: string;
  receipt: MessageReceipt;
};
/** Resolved Discord account with token source metadata for status and runtime checks. */
export type ResolvedDiscordAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  token: string;
  tokenSource: "env" | "config" | "none";
  config: DiscordAccountConfig;
};
/** Normalized outbound target result for Discord channel ids and DM targets. */
export type DiscordOutboundTargetResolution = {
  ok: true;
  to: string;
} | {
  ok: false;
  error: Error;
};
/** Supported thread binding owners for Discord session routing. */
export type ThreadBindingTargetKind = "subagent" | "acp";
/** Persisted Discord thread-to-session binding record. */
export type ThreadBindingRecord = {
  accountId: string;
  threadId: string;
  channelId?: string;
  targetKind: ThreadBindingTargetKind;
  targetSessionKey: string;
  [key: string]: unknown;
};
type DirectoryConfigParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
};
type BuildDiscordComponentMessage = (params: {
  spec: DiscordComponentMessageSpec;
  fallbackText?: string;
  sessionKey?: string;
  agentId?: string;
  accountId?: string;
}) => DiscordComponentBuildResult;
type EditDiscordComponentMessage = (to: string, messageId: string, spec: DiscordComponentMessageSpec, opts: DiscordComponentSendOpts) => Promise<DiscordComponentSendResult>;
type RegisterBuiltDiscordComponentMessage = (params: {
  buildResult: DiscordComponentBuildResult;
  messageId: string;
}) => Promise<void>;
type DiscordApiFacadeModule = {
  collectDiscordStatusIssues: (accounts: ChannelAccountSnapshot[]) => ChannelStatusIssue[];
  buildDiscordComponentMessage: BuildDiscordComponentMessage;
  discordOnboardingAdapter?: NonNullable<ChannelPlugin<ResolvedDiscordAccount>["setup"]>;
  inspectDiscordAccount: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => unknown;
  listDiscordAccountIds: (cfg: OpenClawConfig) => string[];
  listDiscordDirectoryGroupsFromConfig: (params: DirectoryConfigParams) => unknown[] | Promise<unknown[]>;
  listDiscordDirectoryPeersFromConfig: (params: DirectoryConfigParams) => unknown[] | Promise<unknown[]>;
  looksLikeDiscordTargetId: (raw: string) => boolean;
  normalizeDiscordMessagingTarget: (raw: string) => string | undefined;
  normalizeDiscordOutboundTarget: (to?: string) => DiscordOutboundTargetResolution;
  resolveDefaultDiscordAccountId: (cfg: OpenClawConfig) => string;
  resolveDiscordAccount: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => ResolvedDiscordAccount;
  resolveDiscordGroupRequireMention: (params: ChannelGroupContext) => boolean | undefined;
  resolveDiscordGroupToolPolicy: (params: ChannelGroupContext) => unknown;
};
type DiscordRuntimeFacadeModule = {
  editDiscordComponentMessage: EditDiscordComponentMessage;
  registerBuiltDiscordComponentMessage: RegisterBuiltDiscordComponentMessage;
  autoBindSpawnedDiscordSubagent: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    channel?: string;
    to?: string;
    threadId?: string | number;
    childSessionKey: string;
    agentId: string;
    label?: string;
    boundBy?: string;
  }) => Promise<ThreadBindingRecord | null>;
  collectDiscordAuditChannelIds: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => unknown;
  listThreadBindingsBySessionKey: (params: {
    targetSessionKey: string;
    accountId?: string;
    targetKind?: ThreadBindingTargetKind;
  }) => ThreadBindingRecord[];
  unbindThreadBindingsBySessionKey: (params: {
    targetSessionKey: string;
    accountId?: string;
    targetKind?: ThreadBindingTargetKind;
    reason?: string;
    sendFarewell?: boolean;
    farewellText?: string;
  }) => ThreadBindingRecord[];
};
/** Lazy Discord setup adapter retained for deprecated subpath compatibility. */
export declare const discordOnboardingAdapter: {};
/** Collect Discord account status issues from account snapshots. */
export declare function collectDiscordStatusIssues(accounts: ChannelAccountSnapshot[]): ChannelStatusIssue[];
/** Build Discord component payloads without sending them. */
export declare const buildDiscordComponentMessage: DiscordApiFacadeModule["buildDiscordComponentMessage"];
/** Inspect one configured Discord account for setup/status output. */
export declare function inspectDiscordAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): unknown;
/** List configured Discord account ids from OpenClaw config. */
export declare function listDiscordAccountIds(cfg: OpenClawConfig): string[];
/** List Discord directory group records from static config. */
export declare function listDiscordDirectoryGroupsFromConfig(params: DirectoryConfigParams): unknown[] | Promise<unknown[]>;
/** List Discord directory peer records from static config. */
export declare function listDiscordDirectoryPeersFromConfig(params: DirectoryConfigParams): unknown[] | Promise<unknown[]>;
/** Check whether a raw value has Discord target-id shape. */
export declare function looksLikeDiscordTargetId(raw: string): boolean;
/** Normalize a Discord messaging target for send helpers. */
export declare function normalizeDiscordMessagingTarget(raw: string): string | undefined;
/** Normalize a Discord outbound target and return a typed error on failure. */
export declare function normalizeDiscordOutboundTarget(to?: string): DiscordOutboundTargetResolution;
/** Resolve the default Discord account id from config. */
export declare function resolveDefaultDiscordAccountId(cfg: OpenClawConfig): string;
/** Resolve a Discord account config plus token source for runtime use. */
export declare function resolveDiscordAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedDiscordAccount;
/** Resolve group mention policy for a Discord channel context. */
export declare function resolveDiscordGroupRequireMention(params: ChannelGroupContext): boolean | undefined;
/** Resolve group tool policy for a Discord channel context. */
export declare function resolveDiscordGroupToolPolicy(params: ChannelGroupContext): unknown;
/** Collect configured Discord audit channel ids for runtime status checks. */
export declare function collectDiscordAuditChannelIds(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): unknown;
/** Edit an already-sent Discord component message. */
export declare const editDiscordComponentMessage: DiscordRuntimeFacadeModule["editDiscordComponentMessage"];
/** Await callback registration after Discord assigns the built component message its id. */
export declare const registerBuiltDiscordComponentMessage: DiscordRuntimeFacadeModule["registerBuiltDiscordComponentMessage"];
/** Bind a spawned subagent session to the current Discord thread when possible. */
export declare function autoBindSpawnedDiscordSubagent(params: {
  cfg?: OpenClawConfig;
  accountId?: string;
  channel?: string;
  to?: string;
  threadId?: string | number;
  childSessionKey: string;
  agentId: string;
  label?: string;
  boundBy?: string;
}): Promise<ThreadBindingRecord | null>;
/** List Discord thread bindings for a target session key. */
export declare function listThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
}): ThreadBindingRecord[];
/** Remove Discord thread bindings for a target session key. */
export declare function unbindThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
  reason?: string;
  sendFarewell?: boolean;
  farewellText?: string;
}): ThreadBindingRecord[];
//#endregion
export { type ChannelMessageActionAdapter, type ChannelMessageActionName, type ChannelPlugin, DEFAULT_ACCOUNT_ID, type OpenClawConfig, type OpenClawPluginApi, PAIRING_APPROVED_MESSAGE, type PluginRuntime, applyAccountNameToChannelSection, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, buildTokenChannelStatusSummary, emptyPluginConfigSchema, getChatChannelMeta, migrateBaseNameToDefaultAccount, normalizeAccountId, projectCredentialSnapshotFields, resolveConfiguredFromCredentialStatuses };