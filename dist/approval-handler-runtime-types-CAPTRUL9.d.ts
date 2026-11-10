import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import { _ as ApprovalScope, a as SystemAgentApprovalApplicationStatus, b as ExecApprovalRequest, d as PluginApprovalRequest, j as CommandExplanationSummary, n as ApprovalResolved, o as SystemAgentApprovalRequest, r as ChannelApprovalKind, t as ApprovalRequestInput, y as ExecApprovalDecision } from "./approval-types-faKMZQ8q.js";
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
  intent: "show-providers";
  cursor?: string;
} | {
  intent: "show-models";
  providerToken: string;
  cursor?: string;
} | {
  intent: "show-recents";
  cursor?: string;
} | {
  intent: "choose-model";
  providerToken: string;
  modelToken: string;
} | {
  intent: "choose-runtime";
  providerToken: string;
  modelToken: string;
  runtimeToken: string;
} | {
  intent: "reset";
} | {
  intent: "cancel";
}) & {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
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
//#region src/channels/plugins/approval-native.types.d.ts
type ChannelApprovalNativeSurface = "origin" | "approver-dm";
type ChannelApprovalNativeTarget = {
  to: string;
  threadId?: string | number | null;
};
type ChannelApprovalNativeContext = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  approvalKind: ChannelApprovalKind;
  request: ExecApprovalRequest | PluginApprovalRequest | SystemAgentApprovalRequest;
};
type ChannelApprovalNativeAdapter = {
  describeDeliveryCapabilities: (params: ChannelApprovalNativeContext) => {
    enabled: boolean;
    preferredSurface: ChannelApprovalNativeSurface | "both";
    supportsOriginSurface: boolean;
    supportsApproverDmSurface: boolean;
    notifyOriginWhenDmOnly?: boolean;
  };
  resolveOriginTarget?: (params: ChannelApprovalNativeContext) => ChannelApprovalNativeTarget | null | Promise<ChannelApprovalNativeTarget | null>;
  resolveApproverDmTargets?: (params: ChannelApprovalNativeContext) => ChannelApprovalNativeTarget[] | Promise<ChannelApprovalNativeTarget[]>;
};
/** Native delivery discovery that can await worker-owned account state. */
type ChannelApprovalNativeAdapterAsync = Omit<ChannelApprovalNativeAdapter, "describeDeliveryCapabilities"> & {
  describeDeliveryCapabilities: (params: ChannelApprovalNativeContext) => Promise<ReturnType<ChannelApprovalNativeAdapter["describeDeliveryCapabilities"]>>;
};
//#endregion
//#region src/infra/approval-native-delivery.d.ts
/** One native approval delivery target selected by the channel adapter plan. */
type ChannelApprovalNativePlannedTarget = {
  surface: ChannelApprovalNativeSurface;
  target: ChannelApprovalNativeTarget;
  reason: "preferred" | "fallback";
};
//#endregion
//#region src/infra/approval-native-runtime-types.d.ts
/** Prepared delivery target plus the stable key used to avoid duplicate native messages. */
type PreparedChannelNativeApprovalTarget<TPreparedTarget> = {
  dedupeKey: string;
  target: TPreparedTarget;
};
/** Channel hooks that prepare adapter targets and deliver pending approval content. */
type ChannelNativeApprovalTransportSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest> = {
  prepareTarget: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
  }) => PreparedChannelNativeApprovalTarget<TPreparedTarget> | null | Promise<PreparedChannelNativeApprovalTarget<TPreparedTarget> | null>;
  deliverTarget: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: TPreparedTarget;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
  }) => TPendingEntry | null | Promise<TPendingEntry | null>;
};
/** Optional observer hooks for per-target native approval delivery outcomes. */
type ChannelNativeApprovalDeliveryCallbacks<TPendingEntry, TPreparedTarget, TPendingContent, TRequest> = {
  onDeliveryError?: (params: {
    error: unknown;
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
  }) => void;
  onDuplicateSkipped?: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
  }) => void;
  onDelivered?: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
    entry: TPendingEntry;
  }) => void;
};
//#endregion
//#region src/infra/exec-approval-action.types.d.ts
type ExecApprovalActionDescriptor = {
  decision: ExecApprovalDecision;
  label: string;
  style: NonNullable<MessagePresentationButton["style"]>;
  /** Optional semantic action; omitted by the shipped command-backed builders. */
  action?: MessagePresentationAction;
  /** Copyable text fallback retained for non-interactive approval surfaces. */
  command: string;
};
//#endregion
//#region src/infra/approval-view-model.types.d.ts
type ApprovalPhase = "pending" | "resolved" | "expired";
type ApprovalActionView = ExecApprovalActionDescriptor & {
  kind?: "command" | "decision";
};
type ApprovalMetadataView = {
  label: string;
  value: string;
};
type ApprovalViewBase = {
  approvalId: string;
  approvalKind: ChannelApprovalKind;
  phase: ApprovalPhase;
  title: string;
  description?: string | null;
  metadata: ApprovalMetadataView[];
};
type ExecApprovalViewBase = ApprovalViewBase & {
  approvalKind: "exec";
  ask?: string | null;
  agentId?: string | null;
  warningText?: string | null;
  commandAnalysis?: CommandExplanationSummary | null;
  commandText: string;
  commandPreview?: string | null;
  cwd?: string | null;
  envKeys?: readonly string[];
  host?: string | null;
  nodeId?: string | null;
  scope?: ApprovalScope | null;
  sessionKey?: string | null;
};
type PendingApprovalState = {
  phase: "pending";
  actions: ApprovalActionView[];
  expiresAtMs: number;
};
type ExecApprovalPendingView = ExecApprovalViewBase & PendingApprovalState;
type ExecApprovalResolvedView = ExecApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
};
type ExecApprovalExpiredView = ExecApprovalViewBase & {
  phase: "expired";
};
type PluginApprovalViewBase = ApprovalViewBase & {
  approvalKind: "plugin";
  agentId?: string | null;
  pluginId?: string | null;
  scope?: ApprovalScope | null;
  toolName?: string | null;
  severity: "info" | "warning" | "critical";
};
type PluginApprovalPendingView = PluginApprovalViewBase & PendingApprovalState;
type PluginApprovalResolvedView = PluginApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
};
type PluginApprovalExpiredView = PluginApprovalViewBase & {
  phase: "expired";
};
type SystemAgentApprovalViewBase = ApprovalViewBase & {
  approvalKind: "system-agent";
  agentId?: string | null;
  scope?: null;
  commandText: string;
  commandPreview?: string | null;
  ask?: string | null;
  cwd?: string | null;
  envKeys?: readonly string[];
  host?: string | null;
  nodeId?: string | null;
  sessionKey?: string | null;
  operationSummary: string;
};
type SystemAgentApprovalPendingView = SystemAgentApprovalViewBase & PendingApprovalState;
type SystemAgentApprovalResolvedView = SystemAgentApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  applicationStatus?: SystemAgentApprovalApplicationStatus;
  terminalStatus?: "expired" | "cancelled";
};
type SystemAgentApprovalExpiredView = SystemAgentApprovalViewBase & {
  phase: "expired";
};
type PendingApprovalView = ExecApprovalPendingView | PluginApprovalPendingView | SystemAgentApprovalPendingView;
type ResolvedApprovalView = ExecApprovalResolvedView | PluginApprovalResolvedView | SystemAgentApprovalResolvedView;
type ExpiredApprovalView = ExecApprovalExpiredView | PluginApprovalExpiredView | SystemAgentApprovalExpiredView;
type ApprovalViewModel = PendingApprovalView | ResolvedApprovalView | ExpiredApprovalView;
//#endregion
//#region src/infra/approval-handler-runtime-types.d.ts
/** Backward-compatible approval request accepted by public plugin callbacks. */
type ApprovalRequest = ApprovalRequestInput;
type ChannelApprovalCapabilityHandlerContext = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  gatewayUrl?: string;
  context?: unknown;
};
type ApprovalRequestContext = ChannelApprovalCapabilityHandlerContext & {
  request: ApprovalRequest;
  /** Payload-derived owner; channel adapters must not infer ownership from the id. */
  approvalKind: ChannelApprovalKind;
};
type PendingApprovalContext<TView extends PendingApprovalView, TPayload> = ApprovalRequestContext & {
  view: TView;
  pendingPayload: TPayload;
};
type FinalApprovalEntryContext<TEntry> = ChannelApprovalCapabilityHandlerContext & {
  entry: TEntry;
  phase: "resolved" | "expired";
};
type ChannelApprovalNativeFinalAction<TPayload> = {
  kind: "update";
  payload: TPayload;
} | {
  kind: "delete";
} | {
  kind: "clear-actions";
} | {
  kind: "leave";
};
/** Synchronous eligibility for adapters whose availability is already in memory. */
type ChannelApprovalNativeAvailabilityAdapter = {
  isConfigured: (params: ChannelApprovalCapabilityHandlerContext) => boolean;
  shouldHandle: (params: ApprovalRequestContext) => boolean;
};
/** Eligibility may prepare account state through its owning worker. */
type ChannelApprovalNativeAvailabilityAdapterAsync = {
  isConfigured: (params: ChannelApprovalCapabilityHandlerContext) => boolean | Promise<boolean>;
  shouldHandle: (params: ApprovalRequestContext) => boolean | Promise<boolean>;
};
type ChannelApprovalNativePresentationAdapterForView<TPendingPayload = unknown, TFinalPayload = unknown, TPendingEntry = unknown, TPendingView extends PendingApprovalView = PendingApprovalView, TResolvedView extends ResolvedApprovalView = ResolvedApprovalView, TExpiredView extends ExpiredApprovalView = ExpiredApprovalView> = {
  buildPendingPayload: (params: ApprovalRequestContext & {
    nowMs: number;
    view: TPendingView;
  }) => TPendingPayload | Promise<TPendingPayload>;
  buildResolvedResult: (params: ChannelApprovalCapabilityHandlerContext & {
    request: ApprovalRequest;
    resolved: ApprovalResolved;
    view: TResolvedView;
    entry: TPendingEntry;
  }) => ChannelApprovalNativeFinalAction<TFinalPayload> | Promise<ChannelApprovalNativeFinalAction<TFinalPayload>>;
  buildExpiredResult: (params: ChannelApprovalCapabilityHandlerContext & {
    request: ApprovalRequest;
    view: TExpiredView;
    entry: TPendingEntry;
  }) => ChannelApprovalNativeFinalAction<TFinalPayload> | Promise<ChannelApprovalNativeFinalAction<TFinalPayload>>;
};
type ChannelApprovalNativePresentationAdapter<TPendingPayload = unknown, TFinalPayload = unknown> = ChannelApprovalNativePresentationAdapterForView<TPendingPayload, TFinalPayload>;
type ChannelApprovalNativeTransportAdapterForView<TPreparedTarget = unknown, TPendingEntry = unknown, TPendingPayload = unknown, TFinalPayload = unknown, TPendingView extends PendingApprovalView = PendingApprovalView> = {
  prepareTarget: (params: PendingApprovalContext<TPendingView, TPendingPayload> & {
    plannedTarget: ChannelApprovalNativePlannedTarget;
  }) => PreparedChannelNativeApprovalTarget<TPreparedTarget> | null | Promise<PreparedChannelNativeApprovalTarget<TPreparedTarget> | null>;
  deliverPending: (params: PendingApprovalContext<TPendingView, TPendingPayload> & {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: TPreparedTarget;
  }) => TPendingEntry | null | Promise<TPendingEntry | null>;
  updateEntry?: (params: ApprovalRequestContext & FinalApprovalEntryContext<TPendingEntry> & {
    payload: TFinalPayload;
  }) => Promise<void>;
  deleteEntry?: (params: FinalApprovalEntryContext<TPendingEntry>) => Promise<void>;
};
type ChannelApprovalNativeTransportAdapter<TPreparedTarget = unknown, TPendingEntry = unknown, TPendingPayload = unknown, TFinalPayload = unknown> = ChannelApprovalNativeTransportAdapterForView<TPreparedTarget, TPendingEntry, TPendingPayload, TFinalPayload>;
type ChannelApprovalNativeInteractionAdapterForView<TPendingEntry = unknown, TBinding = unknown, TPendingPayload = unknown, TPendingView extends PendingApprovalView = PendingApprovalView> = {
  bindPending?: (params: PendingApprovalContext<TPendingView, TPendingPayload> & {
    entry: TPendingEntry;
  }) => TBinding | null | Promise<TBinding | null>;
  unbindPending?: (params: ApprovalRequestContext & {
    entry: TPendingEntry;
    binding: TBinding;
  }) => Promise<void> | void;
  clearPendingActions?: (params: FinalApprovalEntryContext<TPendingEntry>) => Promise<void>;
  cancelDelivered?: (params: ApprovalRequestContext & {
    entry: TPendingEntry;
  }) => Promise<void> | void;
};
type ChannelApprovalNativeInteractionAdapter<TPendingEntry = unknown, TBinding = unknown> = ChannelApprovalNativeInteractionAdapterForView<TPendingEntry, TBinding>;
type ChannelApprovalNativeObserveAdapterForView<TPreparedTarget = unknown, TPendingPayload = unknown, TPendingEntry = unknown, TPendingView extends PendingApprovalView = PendingApprovalView> = {
  onDeliveryError?: (params: PendingApprovalContext<TPendingView, TPendingPayload> & {
    error: unknown;
    plannedTarget: ChannelApprovalNativePlannedTarget;
  }) => void;
  onDuplicateSkipped?: (params: PendingApprovalContext<TPendingView, TPendingPayload> & {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
  }) => void;
  onDelivered?: (params: PendingApprovalContext<TPendingView, TPendingPayload> & {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    entry: TPendingEntry;
  }) => void;
  /** Runs after every terminal entry for one approval has been finalized. */
  onFinalized?: (params: ApprovalRequestContext & {
    phase: "resolved" | "expired";
  }) => void;
};
type ChannelApprovalNativeObserveAdapter<TPreparedTarget = unknown, TPendingPayload = unknown, TPendingEntry = unknown> = ChannelApprovalNativeObserveAdapterForView<TPreparedTarget, TPendingPayload, TPendingEntry>;
type ChannelApprovalNativeRuntimeOptions = {
  eventKinds?: readonly ChannelApprovalKind[];
  /**
   * Trusted legacy ownership override retained for compatibility.
   * @deprecated Omit this so core derives approval ownership from the request payload.
   */
  resolveApprovalKind?: (request: ApprovalRequest) => ChannelApprovalKind;
  availability: ChannelApprovalNativeAvailabilityAdapter;
};
/**
 * Runtime adapter consumed by core after a plugin's strongly typed spec has been erased.
 */
type ChannelApprovalNativeRuntimeAdapter<TPendingPayload = unknown, TPreparedTarget = unknown, TPendingEntry = unknown, TBinding = unknown, TFinalPayload = unknown> = ChannelApprovalNativeRuntimeOptions & {
  presentation: ChannelApprovalNativePresentationAdapter<TPendingPayload, TFinalPayload>;
  transport: ChannelApprovalNativeTransportAdapter<TPreparedTarget, TPendingEntry, TPendingPayload, TFinalPayload>;
  interactions?: ChannelApprovalNativeInteractionAdapter<TPendingEntry, TBinding>;
  observe?: ChannelApprovalNativeObserveAdapter;
};
/**
 * Strongly typed plugin spec used to build a channel-native approval runtime adapter.
 */
type ChannelApprovalNativeRuntimeSpec<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding = unknown, TFinalPayload = unknown, TPendingView extends PendingApprovalView = PendingApprovalView, TResolvedView extends ResolvedApprovalView = ResolvedApprovalView, TExpiredView extends ExpiredApprovalView = ExpiredApprovalView> = ChannelApprovalNativeRuntimeOptions & {
  presentation: ChannelApprovalNativePresentationAdapterForView<TPendingPayload, TFinalPayload, TPendingEntry, TPendingView, TResolvedView, TExpiredView>;
  transport: ChannelApprovalNativeTransportAdapterForView<TPreparedTarget, TPendingEntry, TPendingPayload, TFinalPayload, TPendingView>;
  interactions?: ChannelApprovalNativeInteractionAdapterForView<TPendingEntry, TBinding, TPendingPayload, TPendingView>;
  observe?: ChannelApprovalNativeObserveAdapterForView<TPreparedTarget, TPendingPayload, TPendingEntry, TPendingView>;
};
type ChannelApprovalNativeRuntimeAdapterAsync<TPendingPayload = unknown, TPreparedTarget = unknown, TPendingEntry = unknown, TBinding = unknown, TFinalPayload = unknown> = Omit<ChannelApprovalNativeRuntimeAdapter<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding, TFinalPayload>, "availability"> & {
  availability: ChannelApprovalNativeAvailabilityAdapterAsync;
};
type ChannelApprovalNativeRuntimeSpecAsync<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding = unknown, TFinalPayload = unknown, TPendingView extends PendingApprovalView = PendingApprovalView, TResolvedView extends ResolvedApprovalView = ResolvedApprovalView, TExpiredView extends ExpiredApprovalView = ExpiredApprovalView> = Omit<ChannelApprovalNativeRuntimeSpec<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding, TFinalPayload, TPendingView, TResolvedView, TExpiredView>, "availability"> & {
  availability: ChannelApprovalNativeAvailabilityAdapterAsync;
};
//#endregion
export { MessagePresentationDividerBlock as $, ChannelApprovalNativeAdapterAsync as A, resolveMessagePresentationButtonAction as At, LegacyInteractiveReplyOption as B, PluginApprovalPendingView as C, reduceLegacyInteractiveReply as Ct, ChannelNativeApprovalDeliveryCallbacks as D, resolveInteractiveTextFallback as Dt, ExecApprovalActionDescriptor as E, renderMessagePresentationTableFallbackText as Et, InteractiveReplyButton as F, MessagePresentationBlock as G, LegacyInteractiveReplyTextBlock as H, InteractiveReplyOption as I, MessagePresentationButtonsBlock as J, MessagePresentationButton as K, LegacyInteractiveReply as L, InteractiveButtonStyle as M, resolveMessagePresentationOptionAction as Mt, InteractiveReply as N, ChannelNativeApprovalTransportSpec as O, resolveLegacyInteractiveTextFallback as Ot, InteractiveReplyBlock as P, MessagePresentationContextBlock as Q, LegacyInteractiveReplyBlock as R, PluginApprovalExpiredView as S, presentationToInteractiveReply as St, ResolvedApprovalView as T, renderMessagePresentationFallbackText as Tt, MessagePresentation as U, LegacyInteractiveReplySelectBlock as V, MessagePresentationAction as W, MessagePresentationChartSegment as X, MessagePresentationChartBlock as Y, MessagePresentationChartSeries as Z, ExecApprovalExpiredView as _, legacyInteractiveReplyToPresentation as _t, ChannelApprovalNativeFinalAction as a, MessagePresentationTextBlock as at, ExpiredApprovalView as b, normalizeMessagePresentation as bt, ChannelApprovalNativePresentationAdapter as c, ReplyPayloadDelivery as ct, ChannelApprovalNativeRuntimeSpec as d, hasLegacyInteractiveReplyBlocks as dt, MessagePresentationInteractiveBlock as et, ChannelApprovalNativeRuntimeSpecAsync as f, hasMessagePresentationBlocks as ft, ApprovalViewModel as g, isMessagePresentationInteractiveBlock as gt, ApprovalMetadataView as h, interactiveReplyToPresentation as ht, ChannelApprovalNativeAvailabilityAdapterAsync as i, MessagePresentationTableCell as it, ChannelApprovalNativeTarget as j, resolveMessagePresentationControlValue as jt, ChannelApprovalNativeAdapter as k, resolveMessagePresentationActionValue as kt, ChannelApprovalNativeRuntimeAdapter as l, ReplyPayloadDeliveryPin as lt, ApprovalActionView as m, hasReplyContent as mt, ChannelApprovalCapabilityHandlerContext as n, MessagePresentationSelectBlock as nt, ChannelApprovalNativeInteractionAdapter as o, MessagePresentationTone as ot, ChannelApprovalNativeTransportAdapter as p, hasReplyChannelData as pt, MessagePresentationButtonStyle as q, ChannelApprovalNativeAvailabilityAdapter as r, MessagePresentationTableBlock as rt, ChannelApprovalNativeObserveAdapter as s, ModelPickerAction as st, ApprovalRequest as t, MessagePresentationOption as tt, ChannelApprovalNativeRuntimeAdapterAsync as u, hasInteractiveReplyBlocks as ut, ExecApprovalPendingView as v, normalizeInteractiveReply as vt, PluginApprovalResolvedView as w, renderMessagePresentationChartFallbackText as wt, PendingApprovalView as x, presentationToInteractiveControlsReply as xt, ExecApprovalResolvedView as y, normalizeLegacyInteractiveReply as yt, LegacyInteractiveReplyButton as z };