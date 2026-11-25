import { l as MemorySearchResponse } from "../types-D2yUynI0.js";
import { t as ControlUiSettingsPlacement } from "../plugin-control-ui-settings-Wx3FLi3x.js";
import { At as BoardGetParams, On as SessionsListParams, Z as ChannelsStatusResult, nt as AgentsWorkspaceGetResult, rt as AgentSummary } from "../index-DSy-_0fC.js";
import { a as SessionRow } from "../sessions-row-09BvoTD5.js";
import { n as DoctorMemoryStatusPayload } from "../doctor-memory-BDagPv_v.js";
import { t as PluginJsonValue } from "../host-hook-json-B1L3lIHs.js";
/** Semantic host components available to native Control UI plugins. */
type ControlUiComponentHandle<T> = {
  update: (props: T) => void;
  dispose: () => void;
};
type ControlUiDialogProps = {
  label: string;
  description?: string;
  className?: string;
  style?: string;
  /** The plugin retains rendering ownership of this node. */
  content: HTMLElement;
  returnFocusTarget?: HTMLElement | null;
  /** Returning false keeps the dialog open, for example during a pending save. */
  onCancel: () => boolean | void;
};
type ControlUiAgentAvatarProps = {
  /** An empty string uses the host's default agent. */
  agentId: string;
  label: string;
};
type ControlUiAgentPickerProps = {
  options: readonly {
    value: string;
    label: string;
    description?: string;
    badge?: string;
    disabled?: boolean;
    agent?: {
      id: string;
    };
    icon?: "bot" | "users";
  }[];
  value: string;
  placeholder?: string;
  accessibleLabel: string;
  menuLabel?: string;
  variant?: "default" | "compact";
  disabled?: boolean;
  onSelect: (value: string) => void;
};
type ControlUiSessionSummaryProps = {
  session: BoardGetParams;
  presented: boolean;
};
type ControlUiDashboardProps = {
  session: BoardGetParams;
  canMutate: boolean;
  canGrant: boolean;
  presented?: boolean;
};
type ControlUiSelectPickerProps = {
  options: readonly {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }[];
  value: string;
  accessibleLabel: string;
  searchable?: boolean;
  disabled?: boolean;
  onSelect: (value: string) => void;
};
type ControlUiAppearanceGlyphProps = {
  icon: string | null;
  color: string | null;
  fallback: string;
};
type ControlUiAppearancePickerProps = {
  icon: string | null;
  color: string | null;
  disabled?: boolean;
  /** Disable clearing when the owner's existing storage contract requires a value. */
  clearable?: boolean;
  onChange: (appearance: {
    icon: string | null;
    color: string | null;
  }) => void;
};
type ControlUiComponents = {
  /** Resolve a shared palette or custom hex color; invalid or cleared values return an empty string. */
  resolveAppearanceColor: (value: string | null | undefined) => string;
  mountAgentAvatar: (container: HTMLElement, props: ControlUiAgentAvatarProps) => ControlUiComponentHandle<ControlUiAgentAvatarProps>;
  mountAppearancePicker: (container: HTMLElement, props: ControlUiAppearancePickerProps) => ControlUiComponentHandle<ControlUiAppearancePickerProps>;
  mountAppearanceGlyph: (container: HTMLElement, props: ControlUiAppearanceGlyphProps) => ControlUiComponentHandle<ControlUiAppearanceGlyphProps>;
  mountDialog: (container: HTMLElement, props: ControlUiDialogProps) => ControlUiComponentHandle<ControlUiDialogProps>;
  mountAgentPicker: (container: HTMLElement, props: ControlUiAgentPickerProps) => ControlUiComponentHandle<ControlUiAgentPickerProps>;
  mountSelectPicker: (container: HTMLElement, props: ControlUiSelectPickerProps) => ControlUiComponentHandle<ControlUiSelectPickerProps>;
  mountSessionSummary: (container: HTMLElement, props: ControlUiSessionSummaryProps) => ControlUiComponentHandle<ControlUiSessionSummaryProps>;
  mountDashboard: (container: HTMLElement, props: ControlUiDashboardProps) => ControlUiComponentHandle<ControlUiDashboardProps>;
};
type SessionHeaderLink = {
  url: string;
  label: string;
};
type SessionHeaderLinkContext = {
  signal: AbortSignal;
  presented: boolean;
  props: BoardGetParams & {
    session?: {
      conversationLink?: SessionHeaderLink;
    };
  };
};
type SessionHeaderLinkMount = (container: HTMLElement, initialContext: SessionHeaderLinkContext) => {
  update?: (context: SessionHeaderLinkContext) => void;
  dispose?: () => void;
} | void;
/**
 * A plugin-owned accessory with the standard header link appearance and direct navigation.
 *
 * @deprecated Retained only so plugins built against OpenClaw 2026.10.1 still load; hosts no
 * longer supply `props.session` to session-header accessories, so the link never renders.
 * Render a custom accessory instead. Removal is tracked by `plugin-sdk-session-header-link`.
 */
export declare function createSessionHeaderLink(resolve: (session: NonNullable<SessionHeaderLinkContext["props"]["session"]>) => SessionHeaderLink | undefined): SessionHeaderLinkMount;
type TranslationMap = {
  readonly [key: string]: string | TranslationMap;
};
/** Translate plugin-owned messages without owning their loading, state, or locale. */
export declare function translateControlUiMessage(messages: (locale: string) => TranslationMap | undefined, locale: string, key: string, params?: Record<string, string>): string;
type ControlUiSettingsSnapshot = {
  readonly agentId: string | null;
  readonly agentsLoading: boolean;
  readonly agentsError: string | null;
  readonly engine: {
    readonly kind: "default" | "off" | "pinned";
    readonly id: string | null;
    readonly availability: "enabled" | "disabled" | "missing" | "loading" | "unknown";
  };
  readonly connected: boolean;
  /** Gateway-advertised methods; absent until the connection publishes its catalog. */
  readonly advertisedMethods?: readonly string[];
  readonly connectionEpoch: number;
  readonly routeIntent: string;
  readonly locale: string;
};
type Content = string | HTMLElement;
type SectionProps = {
  title: string;
  content: HTMLElement;
};
type RowProps = {
  title: string;
  description?: Content;
  control?: Content;
};
type StatusProps = {
  kind: "ok" | "warn" | "danger" | "accent" | "muted";
  label: string;
};
type ValueProps = {
  value: string | number;
  mono?: boolean;
};
type NavProps = {
  title: string;
  onClick: () => void;
};
type PetProps = {
  seed: string;
  sleeping?: boolean;
  reading?: boolean;
  grumpy?: boolean;
  standalone?: boolean;
};
/** Consumed by Settings presentations; the shipped ControlUiComponents contract is unchanged. */
type ControlUiSettingsComponents = {
  mountSection: (container: HTMLElement, props: SectionProps) => ControlUiComponentHandle<SectionProps>;
  mountRow: (container: HTMLElement, props: RowProps) => ControlUiComponentHandle<RowProps>;
  mountStatus: (container: HTMLElement, props: StatusProps) => ControlUiComponentHandle<StatusProps>;
  mountValue: (container: HTMLElement, props: ValueProps) => ControlUiComponentHandle<ValueProps>;
  mountNavigation: (container: HTMLElement, props: NavProps) => ControlUiComponentHandle<NavProps>;
  mountLobster: (container: HTMLElement, props: PetProps) => ControlUiComponentHandle<PetProps>;
};
type ControlUiSettingsContext = {
  readonly signal: AbortSignal;
  readonly props: ControlUiSettingsSnapshot;
  readonly components: ControlUiSettingsComponents;
  /** Existing authenticated operator RPC authority, bound to this Settings lifetime. */
  request: <T = unknown>(method: string, params?: unknown) => Promise<T>;
  navigate: (destination: "overview" | "memories" | "dreams" | "settings") => void;
  refreshAgents: () => void;
  formatRelativeTimestamp: (timestamp: number) => string;
  formatError: (error: unknown) => string;
};
type ControlUiSettingsView = {
  readonly placement: Extract<ControlUiSettingsPlacement, {
    section: "memory";
  }>;
  mount: (container: HTMLElement, context: ControlUiSettingsContext) => {
    update: (props: ControlUiSettingsSnapshot) => void;
    dispose: () => void;
  };
};
type ControlUiChannelSettingsSnapshot = {
  readonly channelId: string;
  readonly status: unknown;
  readonly defaultAccountId?: string;
  readonly login?: {
    readonly message: string | null;
    readonly qrDataUrl: string | null;
    readonly connected: boolean | null;
    readonly busy: boolean;
  };
  readonly accounts: readonly ChannelsStatusResult["channelAccounts"][string][number][];
  readonly connected: boolean;
  readonly canAdmin: boolean;
  readonly connectionEpoch: number;
  readonly locale: string;
  /** Detaching the channel detail does not end this page-owned editor lifetime. */
  readonly presented: boolean;
};
type ControlUiChannelSettingsContext = {
  readonly signal: AbortSignal;
  readonly props: ControlUiChannelSettingsSnapshot;
  readonly components: ControlUiSettingsComponents;
  /** Authenticated JSON under this channel's account namespace; no credentials leave the host. */
  request: (request: {
    accountId: string;
    path: readonly string[];
    method: "PUT" | "POST";
    body: unknown;
    signal: AbortSignal;
  }) => Promise<{
    ok: boolean;
    status: number;
    data: Record<string, unknown> | null;
    errorMessage: string;
  }>;
  /** Shared login owner, available only for the declaring channel's existing login flow. */
  login?: {
    start: (force: boolean) => Promise<void>;
    wait: () => Promise<void>;
    /** Capture the current account before an awaited operator decision. */
    captureLogout: () => {
      readonly accountId: string;
      logout: () => Promise<void>;
    } | null;
  };
  confirm?: (options: {
    title: string;
    message: string;
    confirmLabel: string;
    danger?: boolean;
  }) => Promise<boolean>;
  formatPhoneNumber?: (value: string) => string;
  formatDuration?: (milliseconds: number) => string;
  mountConfig: (container: HTMLElement) => () => void;
  refresh: (probe: boolean) => Promise<void>;
  formatRelativeTimestamp: (timestamp: number | null | undefined) => string;
  formatError: (error: unknown) => string;
  formatExternalText: (text: string) => string;
};
type ControlUiChannelSettingsView = {
  readonly placement: Extract<ControlUiSettingsPlacement, {
    section: "channels";
  }>;
  mount: (container: HTMLElement, context: ControlUiChannelSettingsContext) => {
    update: (props: ControlUiChannelSettingsSnapshot) => void;
    dispose: () => void;
  };
};
export type ControlUiDisposer = () => void;
/** Tab-local recovery data bound to this authenticated Gateway account and plugin. */
export type ControlUiRecoveryStorageV1 = {
  readonly version: 1;
  /** Throws after account, connection, activation, or view retirement. */
  assertCurrent: () => void;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};
export type ControlUiConnection = {
  connected: boolean;
  canRead: boolean;
  canWrite: boolean;
  canGrant: boolean;
  canAdmin: boolean;
  assistantAgentId: string | null;
};
export type ControlUiSession = Readonly<SessionRow & {
  /** Live activity from the Control UI session owner; absent while activity is unknown. */
  hasActiveRun?: boolean;
}>;
export type ControlUiSessionListQuery = Readonly<Pick<SessionsListParams, "agentId" | "search" | "archived" | "limit" | "configuredAgentsOnly" | "includeGlobal" | "includeUnknown" | "excludeDock" | "includeDerivedTitles" | "includeLastMessage">>;
export type ControlUiSessionListResult = {
  readonly sessions: readonly ControlUiSession[];
  readonly hasMore?: boolean;
  readonly nextOffset?: number | null;
  readonly totalCount?: number;
};
export type ControlUiSessionListSnapshot = {
  readonly result: ControlUiSessionListResult | null;
  readonly loading: boolean;
  readonly error: string | null;
};
export type ControlUiSessionListSubscription = {
  /** Fetch again; rejects on failure or when this query's lifetime has ended. */
  refresh: () => Promise<void>;
  dispose: ControlUiDisposer;
};
export type ControlUiAgent = Readonly<AgentSummary>;
export type ControlUiPageTarget = {
  id: string;
  params?: Readonly<Record<string, string>>;
  /** Unescaped path segments for a page with an advertised native route placement. */
  path?: readonly string[];
};
export type ControlUiPageNavigationOptions = {
  /** Replace the current history entry when canonicalizing a page or changing its filters. */
  replace?: boolean;
  /** Retain the current query, with target parameters taking precedence. */
  preserveSearch?: boolean;
};
export type ControlUiSurfaceProps = {
  "session-list": BoardGetParams & {
    sessions: readonly ControlUiSession[];
  };
  composer: BoardGetParams & {
    agentId: string;
    draft: string;
    canSend: boolean;
    sending: boolean;
    disabledReason: string | null;
    setDraft: (text: string) => void;
    /** Resolves true on admission, false on rejection, or void for a local command/no submit. */
    send: () => Promise<boolean | void>;
    abort?: () => void;
  };
  workspace: BoardGetParams & {
    routeId: string;
  };
  transcript: BoardGetParams & {
    messages: readonly unknown[];
    stream: string | null;
    loading: boolean;
  };
  "tool-result": BoardGetParams & {
    toolName: string;
    toolCallId: string;
    input: unknown;
    output: unknown;
    expanded: boolean;
  };
};
export type ControlUiSurface = keyof ControlUiSurfaceProps;
export type ControlUiViewContext<T = Readonly<Record<string, string>>> = {
  readonly host: ControlUiHost;
  readonly signal: AbortSignal;
  readonly props: T;
  /** Report a fatal mount failure; the host disposes this instance and offers Retry. */
  reportError?: (error: unknown) => void;
  /** Presentation can pause a retained view without ending its host lifetime. */
  readonly presented: boolean;
  /** Mount the host's built-in view inside a replacement; it keeps receiving host updates. */
  mountDefault: (container: HTMLElement) => ControlUiDisposer;
};
export type ControlUiView<T = Readonly<Record<string, string>>> = (container: HTMLElement, context: ControlUiViewContext<T>) => {
  update?: (context: ControlUiViewContext<T>) => void;
  focus?: () => void;
  dispose?: ControlUiDisposer;
} | void;
export type ControlUiPage = {
  id: string;
  label: string;
  mount: ControlUiView;
};
type ControlUiNavigationAction = {
  id: string;
  label: string;
  icon?: string;
  destructive?: boolean;
  run: () => void | Promise<void>;
};
export type ControlUiNavigationItem = {
  id: string;
  /** Navigation item ID in this plugin whose active section displays this child. */
  parent?: string;
  label: string;
  page: ControlUiPageTarget;
  icon?: string;
  order?: number;
  /** False offers the destination in the pin editor without adding it to the sidebar. */
  defaultVisible?: boolean;
  /** Context menu actions, available by right-click or the keyboard menu shortcut. */
  actions?: ControlUiNavigationAction[];
};
/** A predefined installed renderer. Payload is data, never a generated template. */
type ControlUiInlineView = {
  id: string;
  /** Exact component/payload interface version (1–65535), not the package version. */
  version: number;
  mount: ControlUiView<BoardGetParams & {
    payload: PluginJsonValue;
    toolCallId: string;
    toolName: string;
  }>;
};
export type ControlUiPanel = {
  id: string;
  label: string;
  /** Fixed host icon-registry name; unknown/omitted names fall back to plug. Manifest SVG artwork takes precedence. */
  icon?: string;
  mount: ControlUiView<BoardGetParams>;
};
export type ControlUiAction = {
  id: string;
  label: string;
  placement: "composer" | "header" | "session";
  resolve?: (context: BoardGetParams & {
    session?: ControlUiSession;
  }) => {
    label?: string;
    disabled?: boolean;
    hidden?: boolean;
  };
  run: (context: BoardGetParams & {
    session?: ControlUiSession;
    host: ControlUiHost;
    signal: AbortSignal;
  }) => void | Promise<void>;
};
export type ControlUiAccessory = {
  id: string;
  placement: "session-header";
  mount: ControlUiView<BoardGetParams>;
};
export type ControlUiWidget = {
  id: string;
  label: string;
  mount: ControlUiView<BoardGetParams & {
    widget: {
      name: string;
      props?: Readonly<Record<string, unknown>>;
    };
    canMutate: boolean;
    canGrant: boolean;
  }>;
};
export type ControlUiReplacement<S extends ControlUiSurface = ControlUiSurface> = { [Surface in S]: {
  id: string;
  label: string;
  surface: Surface;
  mount: ControlUiView<ControlUiSurfaceProps[Surface]>;
}; }[S];
export type ControlUiHost = {
  readonly apiVersion: 1;
  readonly pluginId: string;
  readonly signal: AbortSignal;
  readonly basePath: string;
  readonly locale: string;
  redact: (text: string) => string;
  readonly connection: ControlUiConnection;
  /** Absent or null until the authenticated recovery owner is available. Storage errors throw. */
  readonly recoveryStorage?: ControlUiRecoveryStorageV1 | null;
  readonly components: ControlUiComponents;
  /**
   * Native modules share the operator's authenticated Gateway authority.
   * The Gateway enforces connection scopes, not a per-plugin RPC allowlist.
   */
  request: <T = unknown>(method: string, params?: Record<string, unknown>) => Promise<T>;
  /**
   * `session.message` listeners receive complete message bodies. Registration is
   * synchronous, but delivery starts after the Gateway acknowledges full-body
   * interest. In-flight roster events without bodies are skipped during admission;
   * the host never delivers a bodyless `session.message` to a plugin listener.
   */
  onEvent: (event: string, listener: (payload: unknown) => void) => ControlUiDisposer;
  subscribe: (listener: () => void) => ControlUiDisposer;
  sessions: {
    /** The current application roster may be filtered and paginated. */
    readonly rows: readonly ControlUiSession[];
    readonly selectedKey: string;
    normalizeKey: (sessionKey: string) => string;
    refresh: () => Promise<void>;
    /** Fetch and observe an independent query; the first snapshot may have no result. */
    observe: (query: ControlUiSessionListQuery, listener: (snapshot: ControlUiSessionListSnapshot) => void) => ControlUiSessionListSubscription;
    open: (session: BoardGetParams) => void;
    create: (params?: {
      agentId?: string;
      label?: string;
      /** Presentation title without a unique label claim. */
      displayName?: string;
      /** Immutable dock surface; preserves the authenticated operator's creator identity. */
      surface?: "plugin-dock";
    }) => Promise<string | null>;
    patch: (session: BoardGetParams, patch: {
      label?: string;
      model?: string | null;
    }) => Promise<void>;
  };
  agents: {
    readonly rows: readonly ControlUiAgent[];
    readonly selectedId: string | null;
    readonly defaultId: string | null;
    readonly scopeId: string | null;
    select: (agentId: string) => void;
    setScope: (agentId: string | null) => void;
    refresh: () => Promise<void>;
  };
  dock?: {
    /** Dock a conversation beside the current page; replaces a conversation dock already open. */
    openSession: (params: {
      sessionKey: string;
      agentId: string;
      /** Dock tab title. */
      label: string;
      /** Untrusted ambient reference data, never instructions or access authority. */
      context?: {
        page: string;
        detail?: Readonly<Record<string, string>>;
      };
    }) => void;
    close: () => void;
    readonly openSessionKey: string | null;
  };
  navigation: {
    openPage: (target: ControlUiPageTarget, options?: ControlUiPageNavigationOptions) => void;
    pageHref: (target: ControlUiPageTarget, options?: Pick<ControlUiPageNavigationOptions, "preserveSearch">) => string;
  };
  ui: {
    /** Refresh contributions whose presentation depends on plugin-owned state. */
    invalidate: () => void;
    registerPage: (page: ControlUiPage) => ControlUiDisposer;
    registerNavigation: (item: ControlUiNavigationItem) => ControlUiDisposer;
    /** Pin an already registered navigation item once; unknown or pinned IDs are a no-op. */
    pinNavigation: (id: string) => void;
    /** Remove this plugin's saved navigation pin; an absent pin is a no-op. */
    unpinNavigation: (id: string) => void;
    /** Whether this plugin's navigation ID is in the saved sidebar entries. */
    isNavigationPinned: (id: string) => boolean;
    registerPanel: (panel: ControlUiPanel) => ControlUiDisposer;
    /** Open an owned registered panel beside the supplied or currently selected session. */
    openPanel: (id: string, session?: BoardGetParams) => void;
    registerAction: (action: ControlUiAction) => ControlUiDisposer;
    registerAccessory: (accessory: ControlUiAccessory) => ControlUiDisposer;
    registerWidget: (widget: ControlUiWidget) => ControlUiDisposer;
    registerInlineView: (view: ControlUiInlineView) => ControlUiDisposer;
    registerReplacement: (replacement: ControlUiReplacement) => ControlUiDisposer;
    /** Select an owned replacement, or restore the built-in view for this surface. */
    selectReplacement: (surface: ControlUiSurface, id: string | null) => void;
  };
};
export type ControlUiPlugin = {
  id: string;
  activate: (host: ControlUiHost) => void | ControlUiDisposer | Promise<void | ControlUiDisposer>;
};
export declare function defineControlUiPlugin(plugin: ControlUiPlugin): ControlUiPlugin;
export type { AgentsWorkspaceGetResult, ControlUiAgentPickerProps, ControlUiChannelSettingsContext, ControlUiChannelSettingsSnapshot, ControlUiChannelSettingsView, ControlUiComponentHandle, ControlUiComponents, ControlUiDashboardProps, ControlUiDialogProps, ControlUiSettingsComponents, ControlUiSettingsContext, ControlUiSettingsPlacement, ControlUiSettingsSnapshot, ControlUiSettingsView, DoctorMemoryStatusPayload, MemorySearchResponse };