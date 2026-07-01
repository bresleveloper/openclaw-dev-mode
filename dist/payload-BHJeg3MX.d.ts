//#region src/interactive/payload.d.ts
type InteractiveButtonStyle = "primary" | "secondary" | "success" | "danger";
/** Visual tone for a portable message presentation. */
type MessagePresentationTone = "info" | "success" | "warning" | "danger" | "neutral";
/** Button style hint for renderers that support styled actions. */
type MessagePresentationButtonStyle = InteractiveButtonStyle;
/** Portable typed action behind a button or select option. */
type MessagePresentationAction = {
  /** Run a core/plugin slash command through the target channel's native command path. */type: "command";
  command: string;
} | {
  /** Opaque callback value interpreted by the target channel/plugin. */type: "callback";
  value: string;
};
/** Portable action control rendered as a button or link by channel adapters. */
type MessagePresentationButton = {
  /** User-visible button label. */label: string; /** Typed action sent when the button is pressed. */
  action?: MessagePresentationAction;
  /**
   * Legacy opaque callback value sent when the button is pressed.
   * Prefer action for new presentation controls.
   */
  value?: string; /** External URL opened by the button instead of sending a callback value. */
  url?: string; /** Telegram-style web app launch target. */
  webApp?: {
    url: string;
  };
  /**
   * @deprecated Use webApp. The snake_case alias is accepted for legacy JSON payloads only.
   */
  web_app?: {
    url: string;
  }; /** Higher-priority buttons are kept first when channel limits require truncation. */
  priority?: number; /** Disable the button when the target channel supports disabled controls. */
  disabled?: boolean; /** Keep this action available after a successful interaction when the target channel supports it. */
  reusable?: boolean; /** Optional visual style hint; unsupported channels ignore or normalize it. */
  style?: InteractiveButtonStyle;
};
/** Portable select/menu option. */
type MessagePresentationOption = {
  /** User-visible option label. */label: string; /** Typed action sent when the option is selected. */
  action?: MessagePresentationAction; /** Legacy opaque callback value sent when the option is selected. */
  value?: string;
};
declare function resolveMessagePresentationActionValue(action: MessagePresentationAction | undefined): string | undefined;
declare function resolveMessagePresentationControlValue(control: {
  action?: MessagePresentationAction;
  value?: string;
}): string | undefined;
/**
 * @deprecated Use MessagePresentationButton.
 */
type InteractiveReplyButton = MessagePresentationButton;
/**
 * @deprecated Use MessagePresentationOption.
 */
type InteractiveReplyOption = MessagePresentationOption;
/**
 * @deprecated Use MessagePresentationTextBlock.
 */
type InteractiveReplyTextBlock = {
  type: "text";
  text: string;
};
/**
 * @deprecated Use MessagePresentationButtonsBlock.
 */
type InteractiveReplyButtonsBlock = {
  type: "buttons";
  buttons: InteractiveReplyButton[];
};
/**
 * @deprecated Use MessagePresentationSelectBlock.
 */
type InteractiveReplySelectBlock = {
  type: "select";
  placeholder?: string;
  options: InteractiveReplyOption[];
};
/**
 * @deprecated Use MessagePresentationBlock.
 */
type InteractiveReplyBlock = InteractiveReplyTextBlock | InteractiveReplyButtonsBlock | InteractiveReplySelectBlock;
/**
 * @deprecated Use MessagePresentation.
 */
type InteractiveReply = {
  blocks: InteractiveReplyBlock[];
};
type MessagePresentationTextBlock = {
  type: "text"; /** Primary markdown-ish text rendered in the message body. */
  text: string;
};
type MessagePresentationContextBlock = {
  type: "context"; /** Lower-emphasis contextual text, or normal text on channels without context support. */
  text: string;
};
type MessagePresentationDividerBlock = {
  type: "divider";
};
type MessagePresentationButtonsBlock = {
  type: "buttons"; /** Button row candidates; core may split or truncate them for channel limits. */
  buttons: MessagePresentationButton[];
};
type MessagePresentationSelectBlock = {
  type: "select"; /** Optional prompt shown above or inside the select control. */
  placeholder?: string; /** Menu options; core may truncate them for channel limits. */
  options: MessagePresentationOption[];
};
type MessagePresentationInteractiveBlock = MessagePresentationButtonsBlock | MessagePresentationSelectBlock;
type MessagePresentationBlock = MessagePresentationTextBlock | MessagePresentationContextBlock | MessagePresentationDividerBlock | MessagePresentationButtonsBlock | MessagePresentationSelectBlock;
type MessagePresentation = {
  /** Optional short heading rendered before blocks when the channel supports it. */title?: string; /** Optional severity/status tone for renderers that support toned presentations. */
  tone?: MessagePresentationTone; /** Ordered portable blocks rendered or downgraded by the target channel adapter. */
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
/**
 * @deprecated Use normalizeMessagePresentation.
 */
declare function normalizeInteractiveReply(raw: unknown): InteractiveReply | undefined;
declare function normalizeMessagePresentation(raw: unknown): MessagePresentation | undefined;
/**
 * @deprecated Use hasMessagePresentationBlocks.
 */
declare function hasInteractiveReplyBlocks(value: unknown): value is InteractiveReply;
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
/**
 * @deprecated Legacy bridge for old InteractiveReply payloads. New producers should send MessagePresentation.
 */
declare function interactiveReplyToPresentation(interactive: InteractiveReply): MessagePresentation | undefined;
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
/**
 * @deprecated Use renderMessagePresentationFallbackText with MessagePresentation.
 */
declare function resolveInteractiveTextFallback(params: {
  text?: string;
  interactive?: InteractiveReply;
}): string | undefined;
//#endregion
export { normalizeMessagePresentation as A, hasInteractiveReplyBlocks as C, interactiveReplyToPresentation as D, hasReplyContent as E, resolveMessagePresentationActionValue as F, resolveMessagePresentationControlValue as I, presentationToInteractiveReply as M, renderMessagePresentationFallbackText as N, isMessagePresentationInteractiveBlock as O, resolveInteractiveTextFallback as P, ReplyPayloadDeliveryPin as S, hasReplyChannelData as T, MessagePresentationOption as _, InteractiveReplyOption as a, MessagePresentationTone as b, MessagePresentation as c, MessagePresentationButton as d, MessagePresentationButtonStyle as f, MessagePresentationInteractiveBlock as g, MessagePresentationDividerBlock as h, InteractiveReplyButton as i, presentationToInteractiveControlsReply as j, normalizeInteractiveReply as k, MessagePresentationAction as l, MessagePresentationContextBlock as m, InteractiveReply as n, InteractiveReplySelectBlock as o, MessagePresentationButtonsBlock as p, InteractiveReplyBlock as r, InteractiveReplyTextBlock as s, InteractiveButtonStyle as t, MessagePresentationBlock as u, MessagePresentationSelectBlock as v, hasMessagePresentationBlocks as w, ReplyPayloadDelivery as x, MessagePresentationTextBlock as y };