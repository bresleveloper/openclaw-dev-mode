import { n as ChannelApprovalKind } from "./approval-types-DIxuby8L.js";
//#region src/interactive/payload.d.ts
type InteractiveButtonStyle = "primary" | "secondary" | "success" | "danger";
/** Visual tone for a portable message presentation. */
type MessagePresentationTone = "info" | "success" | "warning" | "danger" | "neutral";
/** Button style hint for renderers that support styled actions. */
type MessagePresentationButtonStyle = InteractiveButtonStyle;
type QuestionPresentationAction = {
  /** Resolve one declared choice. */
  type: "question";
  questionId: string;
  optionValue: string;
} | {
  /** Switch this question to its free-text answer path. */
  type: "question";
  questionId: string;
  intent: "custom-input";
};
/** Core-owned model-picker action; channels serialize it only inside private envelopes. */
type ModelPickerAction = ({
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "show-providers";
  cursor?: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "show-models";
  providerToken: string;
  cursor?: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "show-recents";
  cursor?: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "choose-model";
  providerToken: string;
  modelToken: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "choose-runtime";
  providerToken: string;
  modelToken: string;
  runtimeToken: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "reset";
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "cancel";
}) & {
  /** Legacy command/callback payload fields are deliberately unavailable on picker actions. */
  readonly command?: never;
  readonly value?: never;
};
/** Portable typed action behind a button or select option. */
type MessagePresentationAction = {
  /** Run a core/plugin slash command through the target channel's native command path. */
  type: "command";
  command: string;
} | {
  /** Opaque callback value interpreted by the target channel/plugin. */
  type: "callback";
  value: string;
} | ModelPickerAction | {
  /** Resolve one durable operator approval without exposing transport callback data. */
  type: "approval";
  approvalId: string;
  approvalKind: ChannelApprovalKind;
  decision: "allow-once" | "allow-always" | "deny";
} | QuestionPresentationAction | {
  /** Open a normal external link. */
  type: "url";
  url: string;
} | {
  /** Launch a channel-native web app. */
  type: "web-app";
  /** External web app URL for channels that launch web apps by URL. */
  url: string;
  /** OpenClaw hosted-widget ID whose launch mechanics are owned by the channel. */
  widgetId?: string;
} | {
  /** Launch a channel-native web app. */
  type: "web-app";
  /** External web app URL for channels that launch web apps by URL. */
  url?: string;
  /** OpenClaw hosted-widget ID whose launch mechanics are owned by the channel. */
  widgetId: string;
};
type LegacyMessagePresentationAction = Exclude<MessagePresentationAction, ModelPickerAction>;
/** Portable action control rendered as a button or link by channel adapters. */
type MessagePresentationButton = {
  /** User-visible button label. */
  label: string;
  /** Typed action sent when the button is pressed. */
  action?: MessagePresentationAction;
  /**
   * Legacy opaque callback value sent when the button is pressed.
   * Prefer action for new presentation controls.
   * @deprecated Use action.
   */
  value?: string;
  /** @deprecated Use an action with type "url". */
  url?: string;
  /** @deprecated Use an action with type "web-app". */
  webApp?: {
    url: string;
  };
  /**
   * @deprecated Use an action with type "web-app". Accepted for legacy JSON payloads only.
   */
  web_app?: {
    url: string;
  };
  /** Higher-priority buttons are kept first when channel limits require truncation. */
  priority?: number;
  /** Disable the button when the target channel supports disabled controls. */
  disabled?: boolean;
  /** Keep this action available after a successful interaction when the target channel supports it. */
  reusable?: boolean;
  /** Optional visual style hint; unsupported channels ignore or normalize it. */
  style?: InteractiveButtonStyle;
};
/** Portable select/menu option. */
type MessagePresentationOption = {
  /** User-visible option label. */
  label: string;
  /** Typed action sent when the option is selected. */
  action?: Extract<MessagePresentationAction, {
    type: "command" | "callback" | "model-picker";
  }>;
  /** @deprecated Use action. */
  value?: string;
};
declare function resolveMessagePresentationActionValue(action: MessagePresentationAction | undefined): string | undefined;
declare function resolveMessagePresentationControlValue(control: {
  action?: MessagePresentationAction;
  value?: string;
}): string | undefined;
/** Resolve a canonical button action, including deprecated boundary inputs. */
declare function resolveMessagePresentationButtonAction(button: Pick<MessagePresentationButton, "action" | "url" | "value" | "webApp" | "web_app">, options: {
  modelPicker: true;
}): MessagePresentationAction | undefined;
declare function resolveMessagePresentationButtonAction(button: Pick<MessagePresentationButton, "action" | "url" | "value" | "webApp" | "web_app">): LegacyMessagePresentationAction | undefined;
/** Resolve a canonical select action, including the deprecated value input. */
declare function resolveMessagePresentationOptionAction(option: Pick<MessagePresentationOption, "action" | "value">, options: {
  modelPicker: true;
}): Extract<MessagePresentationAction, {
  type: "command" | "callback" | "model-picker";
}> | undefined;
declare function resolveMessagePresentationOptionAction(option: Pick<MessagePresentationOption, "action" | "value">): Extract<LegacyMessagePresentationAction, {
  type: "command" | "callback";
}> | undefined;
type LegacyInteractiveReplyButton = MessagePresentationButton;
/** @deprecated Use MessagePresentationButton. */
type InteractiveReplyButton = LegacyInteractiveReplyButton;
type LegacyInteractiveReplyOption = MessagePresentationOption;
/** @deprecated Use MessagePresentationOption. */
type InteractiveReplyOption = LegacyInteractiveReplyOption;
type LegacyInteractiveReplyTextBlock = {
  type: "text";
  text: string;
};
type LegacyInteractiveReplySelectBlock = {
  type: "select";
  placeholder?: string;
  options: LegacyInteractiveReplyOption[];
};
type LegacyInteractiveReplyBlock = LegacyInteractiveReplyTextBlock | MessagePresentationButtonsBlock | LegacyInteractiveReplySelectBlock;
/** @deprecated Use MessagePresentationBlock. */
type InteractiveReplyBlock = LegacyInteractiveReplyBlock;
type LegacyInteractiveReply = {
  blocks: LegacyInteractiveReplyBlock[];
};
declare function reduceLegacyInteractiveReply<TState>(interactive: LegacyInteractiveReply | undefined, initialState: TState, reduce: (state: TState, block: LegacyInteractiveReplyBlock, index: number) => TState): TState;
/** @deprecated Use MessagePresentation. */
type InteractiveReply = LegacyInteractiveReply;
type MessagePresentationTextBlock = {
  type: "text";
  /** Primary markdown-ish text rendered in the message body. */
  text: string;
};
type MessagePresentationContextBlock = {
  type: "context";
  /** Lower-emphasis contextual text, or normal text on channels without context support. */
  text: string;
};
type MessagePresentationDividerBlock = {
  type: "divider";
};
type MessagePresentationButtonsBlock = {
  type: "buttons";
  /** Button row candidates; core may split or truncate them for channel limits. */
  buttons: MessagePresentationButton[];
};
type MessagePresentationSelectBlock = {
  type: "select";
  /** Optional prompt shown above or inside the select control. */
  placeholder?: string;
  /** Menu options; core may truncate them for channel limits. */
  options: MessagePresentationOption[];
};
type MessagePresentationChartSegment = {
  /** Category label shown in the chart legend. */
  label: string;
  /** Positive segment magnitude. */
  value: number;
};
type MessagePresentationChartSeries = {
  /** Unique series name shown in the chart legend. */
  name: string;
  /** One finite value for each chart category, in category order. */
  values: number[];
};
type MessagePresentationChartBlock = {
  type: "chart";
  chartType: "pie";
  /** Short chart heading. */
  title: string;
  segments: MessagePresentationChartSegment[];
} | {
  type: "chart";
  chartType: "bar" | "area" | "line";
  /** Short chart heading. */
  title: string;
  /** Ordered categories shared by every series. */
  categories: string[];
  series: MessagePresentationChartSeries[];
  xLabel?: string;
  yLabel?: string;
};
/** Scalar cell value supported by portable table presentations. */
type MessagePresentationTableCell = string | number;
/** Portable table rendered natively where supported and linearly elsewhere. */
type MessagePresentationTableBlock = {
  type: "table";
  /** Short table heading used by native renderers and fallback text. */
  caption: string;
  /** Unique ordered column labels shared by every row. */
  headers: string[];
  /** Rows whose width exactly matches the header count. */
  rows: MessagePresentationTableCell[][];
  /** Optional column whose cells should be rendered as row headers. */
  rowHeaderColumnIndex?: number;
};
type MessagePresentationInteractiveBlock = MessagePresentationButtonsBlock | MessagePresentationSelectBlock;
type MessagePresentationBlock = MessagePresentationTextBlock | MessagePresentationContextBlock | MessagePresentationDividerBlock | MessagePresentationButtonsBlock | MessagePresentationSelectBlock | MessagePresentationChartBlock | MessagePresentationTableBlock;
type MessagePresentation = {
  /** Optional short heading rendered before blocks when the channel supports it. */
  title?: string;
  /** Optional severity/status tone for renderers that support toned presentations. */
  tone?: MessagePresentationTone;
  /** Ordered portable blocks rendered or downgraded by the target channel adapter. */
  blocks: MessagePresentationBlock[];
};
type ReplyPayloadDeliveryPin = {
  enabled: boolean;
  notify?: boolean;
  required?: boolean;
};
type ReplyPayloadDelivery = {
  pin?: boolean | ReplyPayloadDeliveryPin;
};
declare function normalizeLegacyInteractiveReply(raw: unknown): LegacyInteractiveReply | undefined;
/** @deprecated Use normalizeMessagePresentation. */
declare const normalizeInteractiveReply: typeof normalizeLegacyInteractiveReply;
declare function normalizeMessagePresentation(raw: unknown): MessagePresentation | undefined;
/**
 * @deprecated Use hasMessagePresentationBlocks.
 */
declare const hasInteractiveReplyBlocks: typeof hasLegacyInteractiveReplyBlocks;
declare function hasLegacyInteractiveReplyBlocks(value: unknown): value is LegacyInteractiveReply;
declare function hasMessagePresentationBlocks(value: unknown): value is MessagePresentation;
/**
 * @deprecated Avoid producing InteractiveReply payloads; send MessagePresentation directly.
 */
declare function presentationToInteractiveReply(presentation: MessagePresentation): InteractiveReply | undefined;
declare function isMessagePresentationInteractiveBlock(block: MessagePresentationBlock): block is MessagePresentationInteractiveBlock;
/**
 * @deprecated Avoid producing InteractiveReply payloads; send MessagePresentation directly.
 */
declare function presentationToInteractiveControlsReply(presentation: MessagePresentation): InteractiveReply | undefined;
declare function legacyInteractiveReplyToPresentation(interactive: LegacyInteractiveReply): MessagePresentation | undefined;
/**
 * @deprecated Legacy bridge for old InteractiveReply payloads. New producers should send MessagePresentation.
 */
declare const interactiveReplyToPresentation: typeof legacyInteractiveReplyToPresentation;
/**
 * Render presentation blocks as plain-text fallback for channels that do not
 * support native interactive controls.
 *
 * Text and context blocks are rendered as-is. Buttons with a `command`-typed
 * action render as `label: \`command\`` so the value is copyable. URL and web
 * app actions include their user-facing URL. Approval, question, callback,
 * legacy value, and select actions render label-only to keep transport data
 * private. Disabled buttons render label-only regardless of action type.
 *
 * Downstream consumers should not claim a manual command is available unless
 * they verify one was actually rendered.
 *
 * Exported through the plugin SDK for channel adapters.
 */
declare function renderMessagePresentationChartFallbackText(block: MessagePresentationChartBlock): string;
declare function renderMessagePresentationTableFallbackText(block: MessagePresentationTableBlock): string;
declare function renderMessagePresentationFallbackText(params: {
  presentation?: MessagePresentation;
  emptyFallback?: string | null;
  text?: string | null;
}): string;
declare function hasReplyChannelData(value: unknown): value is Record<string, unknown>;
declare function hasReplyContent(params: {
  text?: string | null;
  mediaUrl?: string | null;
  mediaUrls?: ReadonlyArray<string | null | undefined>;
  interactive?: unknown;
  presentation?: unknown;
  hasChannelData?: boolean;
  extraContent?: boolean;
}): boolean;
declare function resolveLegacyInteractiveTextFallback(params: {
  text?: string;
  interactive?: LegacyInteractiveReply;
}): string | undefined;
/** @deprecated Use renderMessagePresentationFallbackText with MessagePresentation. */
declare const resolveInteractiveTextFallback: typeof resolveLegacyInteractiveTextFallback;
//#endregion
export { resolveMessagePresentationButtonAction as $, ModelPickerAction as A, legacyInteractiveReplyToPresentation as B, MessagePresentationInteractiveBlock as C, MessagePresentationTableCell as D, MessagePresentationTableBlock as E, hasMessagePresentationBlocks as F, presentationToInteractiveReply as G, normalizeLegacyInteractiveReply as H, hasReplyChannelData as I, renderMessagePresentationFallbackText as J, reduceLegacyInteractiveReply as K, hasReplyContent as L, ReplyPayloadDeliveryPin as M, hasInteractiveReplyBlocks as N, MessagePresentationTextBlock as O, hasLegacyInteractiveReplyBlocks as P, resolveMessagePresentationActionValue as Q, interactiveReplyToPresentation as R, MessagePresentationDividerBlock as S, MessagePresentationSelectBlock as T, normalizeMessagePresentation as U, normalizeInteractiveReply as V, presentationToInteractiveControlsReply as W, resolveInteractiveTextFallback as X, renderMessagePresentationTableFallbackText as Y, resolveLegacyInteractiveTextFallback as Z, MessagePresentationButtonsBlock as _, InteractiveReplyOption as a, MessagePresentationChartSeries as b, LegacyInteractiveReplyButton as c, LegacyInteractiveReplyTextBlock as d, resolveMessagePresentationControlValue as et, MessagePresentation as f, MessagePresentationButtonStyle as g, MessagePresentationButton as h, InteractiveReplyButton as i, ReplyPayloadDelivery as j, MessagePresentationTone as k, LegacyInteractiveReplyOption as l, MessagePresentationBlock as m, InteractiveReply as n, LegacyInteractiveReply as o, MessagePresentationAction as p, renderMessagePresentationChartFallbackText as q, InteractiveReplyBlock as r, LegacyInteractiveReplyBlock as s, InteractiveButtonStyle as t, resolveMessagePresentationOptionAction as tt, LegacyInteractiveReplySelectBlock as u, MessagePresentationChartBlock as v, MessagePresentationOption as w, MessagePresentationContextBlock as x, MessagePresentationChartSegment as y, isMessagePresentationInteractiveBlock as z };