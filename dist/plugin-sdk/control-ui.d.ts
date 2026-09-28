import { D as SessionsListParams, Nt as BoardGetParams, jt as SessionRow, rt as AgentSummary } from "../index-hVvy_KTe.js";
//#region src/plugin-sdk/control-ui-components.d.ts
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
//#endregion
//#region src/plugin-sdk/control-ui.d.ts
export type ControlUiDisposer = () => void;
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
export type ControlUiSessionListQuery = Readonly<Pick<SessionsListParams, "agentId" | "search" | "archived" | "limit" | "configuredAgentsOnly" | "includeGlobal" | "includeUnknown" | "includeDerivedTitles" | "includeLastMessage">>;
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
export type ControlUiNavigationItem = {
  id: string;
  label: string;
  page: ControlUiPageTarget;
  icon?: string;
  order?: number;
  /** False offers the destination in the pin editor without adding it to the sidebar. */
  defaultVisible?: boolean;
};
export type ControlUiPanel = {
  id: string;
  label: string;
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
  readonly components: ControlUiComponents;
  /**
   * Native modules share the operator's authenticated Gateway authority.
   * The Gateway enforces connection scopes, not a per-plugin RPC allowlist.
   */
  request: <T = unknown>(method: string, params?: Record<string, unknown>) => Promise<T>;
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
  navigation: {
    openPage: (target: ControlUiPageTarget, options?: ControlUiPageNavigationOptions) => void;
    pageHref: (target: ControlUiPageTarget, options?: Pick<ControlUiPageNavigationOptions, "preserveSearch">) => string;
  };
  ui: {
    /** Refresh contributions whose presentation depends on plugin-owned state. */
    invalidate: () => void;
    registerPage: (page: ControlUiPage) => ControlUiDisposer;
    registerNavigation: (item: ControlUiNavigationItem) => ControlUiDisposer;
    registerPanel: (panel: ControlUiPanel) => ControlUiDisposer;
    registerAction: (action: ControlUiAction) => ControlUiDisposer;
    registerAccessory: (accessory: ControlUiAccessory) => ControlUiDisposer;
    registerWidget: (widget: ControlUiWidget) => ControlUiDisposer;
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
//#endregion
export type { ControlUiAgentPickerProps, ControlUiComponentHandle, ControlUiComponents, ControlUiDashboardProps, ControlUiDialogProps };