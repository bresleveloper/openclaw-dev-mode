import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { l as buildChannelConfigSchema, v as ChannelConfigUiHint } from "../zod-schema.implicit-mentions-BfiN-dfC.js";
import { Fc as PluginCommandContext, Ss as OpenClawPluginApi, ma as PluginRuntime } from "../agent-harness-runtime-DZjstJNb.js";
import { n as ChannelPlugin } from "../types.plugin-BiZwy65L.js";
import { d as stripChannelTargetPrefix, f as stripTargetKindPrefix } from "../allowlist-match-Cfjke1wF.js";
import { r as parseOptionalDelimitedEntries } from "../helpers-gk1rbVRv.js";
import { t as clearAccountEntryFields } from "../config-helpers-B3C2dCc9.js";
import { a as buildThreadAwareOutboundSessionRoute, c as defineChannelPluginEntry, f as recoverCurrentThreadSessionId, i as buildChannelOutboundSessionRoute, l as defineSetupPluginEntry, o as createChannelPluginBase, s as createChatChannelPlugin, t as ChannelOutboundSessionRouteParams } from "../core-BDhYQ7DV.js";
import { c as tryReadSecretFileSync } from "../secret-file-DYBcTeIO.js";
//#region src/plugin-sdk/channel-config-ui-hints.d.ts
type HintMap = Record<string, ChannelConfigUiHint>;
declare const STREAMING_HINT_LABELS: {
  readonly "": "Streaming Mode";
  readonly mode: "Streaming Mode";
  readonly chunkMode: "Chunk Mode";
  readonly "block.enabled": "Block Streaming Enabled";
  readonly "block.coalesce": "Block Streaming Coalesce";
  readonly nativeTransport: "Native Streaming";
  readonly "preview.chunk.minChars": "Draft Chunk Min Chars";
  readonly "preview.chunk.maxChars": "Draft Chunk Max Chars";
  readonly "preview.chunk.breakPreference": "Draft Chunk Break Preference";
  readonly "preview.toolProgress": "Draft Tool Progress";
  readonly "preview.commandText": "Draft Command Text";
  readonly "progress.style": "Progress Style";
  readonly "progress.nativeTaskCards": "Native Progress Task Cards";
};
type StreamingHintKey = keyof typeof STREAMING_HINT_LABELS;
type StreamingHintValue = string | {
  label: string;
  help: string;
};
export declare function createChannelConfigUiHints(params: {
  channelLabel: string;
  dmPolicy?: {
    channelKey: string;
    includeLegacyNestedPolicy?: boolean;
    legacyNestedPolicyOrder?: "before" | "after";
  };
  configWrites?: boolean;
  mentionPatterns?: {
    targetDescription: string;
    policyTargetDescription?: string;
    policyNote?: string;
    denyNote?: string;
  };
  nativeCommands?: boolean;
  implicitMentions?: boolean;
  progress?: {
    includeCommentary?: boolean;
    commentaryOrder?: "before-command" | "after-command";
    labels?: "openclaw";
    titleWording?: boolean;
  };
  streaming?: Partial<Record<StreamingHintKey, StreamingHintValue>>;
  retry?: boolean;
}): HintMap;
//#endregion
export { type ChannelConfigUiHint, type ChannelOutboundSessionRouteParams, type ChannelPlugin, type OpenClawConfig, type OpenClawPluginApi, type PluginCommandContext, type PluginRuntime, buildChannelConfigSchema, buildChannelOutboundSessionRoute, buildThreadAwareOutboundSessionRoute, clearAccountEntryFields, createChannelPluginBase, createChatChannelPlugin, defineChannelPluginEntry, defineSetupPluginEntry, parseOptionalDelimitedEntries, recoverCurrentThreadSessionId, stripChannelTargetPrefix, stripTargetKindPrefix, tryReadSecretFileSync };