//#region packages/gateway-protocol/src/client-info.d.ts
/** Canonical client ids accepted in gateway hello/connect payloads. */
declare const GATEWAY_CLIENT_IDS: {
  readonly WEBCHAT_UI: "webchat-ui";
  readonly CONTROL_UI: "openclaw-control-ui";
  readonly BROWSER_COPILOT: "openclaw-browser-copilot";
  readonly TUI: "openclaw-tui";
  readonly WEBCHAT: "webchat";
  readonly CLI: "cli";
  readonly GATEWAY_CLIENT: "gateway-client";
  readonly MACOS_APP: "openclaw-macos";
  readonly LINUX_APP: "openclaw-linux";
  readonly IOS_APP: "openclaw-ios";
  readonly WATCHOS_APP: "openclaw-watchos";
  readonly ANDROID_APP: "openclaw-android";
  readonly NODE_HOST: "node-host";
  readonly WORKER: "openclaw-worker";
  readonly TEST: "test";
  readonly FINGERPRINT: "fingerprint";
  readonly PROBE: "openclaw-probe";
};
type GatewayClientId = (typeof GATEWAY_CLIENT_IDS)[keyof typeof GATEWAY_CLIENT_IDS];
/** Compatibility alias for internal callers that still use "name" terminology. */
type GatewayClientName = GatewayClientId;
/** Coarse modes let policy group clients without matching every product id. */
declare const GATEWAY_CLIENT_MODES: {
  readonly WEBCHAT: "webchat";
  readonly CLI: "cli";
  readonly UI: "ui";
  readonly BACKEND: "backend";
  readonly NODE: "node";
  readonly WORKER: "worker";
  readonly PROBE: "probe";
  readonly TEST: "test";
};
type GatewayClientMode = (typeof GATEWAY_CLIENT_MODES)[keyof typeof GATEWAY_CLIENT_MODES];
type GatewayClientInfo = {
  id: GatewayClientId;
  /** Human-readable label for diagnostics; not used for policy decisions. */
  displayName?: string;
  /** Client app or package version reported by the connecting process. */
  version: string;
  /** Exact immutable artifact identity when the client can report one. */
  buildId?: string;
  /** Runtime platform string, such as `darwin`, `ios`, `android`, or `web`. */
  platform: string;
  /** Optional device family used by native clients for display and routing hints. */
  deviceFamily?: string;
  /** Native hardware/model identifier when available. */
  modelIdentifier?: string;
  /** Self-reported IANA time zone, such as `Europe/Vienna`, for presence display. */
  timeZone?: string;
  mode: GatewayClientMode;
  /** Per-installation or per-process id used to distinguish same-product clients. */
  instanceId?: string;
};
/** Capability flags a client may advertise during the gateway handshake. */
declare const GATEWAY_CLIENT_CAPS: {
  readonly AGENT_KIND: "agent-kind";
  readonly APPROVALS: "approvals";
  readonly CHAT_ONLY_ASSISTANT_TEXT: "chat-only-assistant-text";
  readonly EXEC_APPROVALS: "exec-approvals";
  readonly INLINE_WIDGETS: "inline-widgets";
  readonly MODEL_CATALOG_SNAPSHOT: "model-catalog-snapshot";
  readonly MODEL_SELECTION_POLICY: "model-selection-policy";
  readonly RUN_TOOL_BINDINGS: "run-tool-bindings";
  readonly SESSION_SCOPED_EVENTS: "session-scoped-events";
  readonly PLUGIN_APPROVALS: "plugin-approvals";
  readonly TASK_SUGGESTIONS: "task-suggestions";
  readonly TERMINAL_OFFSET_SEQ: "terminal-offset-seq";
  readonly TERMINAL_SESSION_METADATA: "terminal-session-metadata";
  readonly TERMINAL_UPLOAD_PATH_STYLE: "terminal-upload-path-style";
  readonly TOOL_EVENTS: "tool-events";
  readonly UI_AGENT_GITHUB_SETTINGS: "ui-agent-github-settings";
  readonly UI_COMMANDS: "ui-commands";
  readonly ULTRAFAST: "ultrafast";
  readonly USAGE_REFRESHING: "usage-refreshing";
};
type GatewayClientCap = (typeof GATEWAY_CLIENT_CAPS)[keyof typeof GATEWAY_CLIENT_CAPS];
//#endregion
export { GatewayClientMode as a, GatewayClientInfo as i, GatewayClientCap as n, GatewayClientName as o, GatewayClientId as r, GATEWAY_CLIENT_IDS as t };