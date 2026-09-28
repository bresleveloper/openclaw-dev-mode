import "./agent-harness-runtime-CWL0fcg5.js";
import { u as ChannelConfigUiHint } from "./zod-schema.implicit-mentions-Du1YLL_X.js";
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
declare function createChannelConfigUiHints(params: {
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
export { createChannelConfigUiHints as t };