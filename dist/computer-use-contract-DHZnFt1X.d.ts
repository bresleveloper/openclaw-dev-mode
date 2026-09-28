import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { Static, TSchema, Type } from "typebox";
//#region src/plugins/types.node-host.d.ts
type OpenClawPluginNodeHostCommandAvailabilityContext = {
  /** Node-local configuration used to build this host's Gateway declaration. */
  config: OpenClawConfig;
  /** Node-host process environment. */
  env: NodeJS.ProcessEnv;
};
type OpenClawPluginNodeHostCommandIo = {
  emitChunk(chunk: string): Promise<void>;
  onInput(callback: (payloadJSON: string) => void): void;
  /** Complete binary messages; available when the node host dispatches a duplex command. */
  frames?: {
    send(message: Uint8Array): Promise<void>;
    onMessage(listener: (message: Uint8Array) => void | Promise<void>): () => void;
  };
  signal: AbortSignal;
};
type OpenClawPluginNodeWorkspace = {
  workspaceDir: string;
  environmentId: string;
  sessionId: string;
  ownerEpoch: number;
  sessionKey: string;
};
type OpenClawPluginNodeHostCommandContext = {
  /** Emit one node-owned event through the active Gateway connection. */
  sendNodeEvent(event: string, payload: unknown): Promise<unknown>;
  /** Agent session that owns this invocation, when the caller supplied one. */
  sessionKey?: string;
  /** Aborts when the Gateway cancels this specific node-host invocation. */
  signal?: AbortSignal;
  /** Prepare local exec policy; call the returned guard synchronously immediately before spawn. */
  prepareExecAuthorization?: (source: "human-approved" | "session-full") => () => void;
  /** Protect one exact node-owned placement workspace for this invocation's lifetime. */
  acquireManagedWorkspace?: (request: OpenClawPluginNodeWorkspace) => {
    workspaceDir: string;
    /** Stable HOME owned and validated by this exact prepared workspace binding. */
    homeDir?: string;
    release: () => void;
  };
};
type OpenClawPluginNodeHostCommandBase = {
  command: string;
  cap?: string;
  dangerous?: boolean;
  /** Settle node-local startup before the initial capability declaration; registration stays synchronous. */
  prepare?: (context: OpenClawPluginNodeHostCommandAvailabilityContext) => Promise<void> | void;
  /** Return false to omit this command and capability from the node declaration. */
  isAvailable?: (context: OpenClawPluginNodeHostCommandAvailabilityContext) => boolean;
  /** Watch node-local availability and request a fresh Gateway declaration. */
  watchAvailability?: (context: OpenClawPluginNodeHostCommandAvailabilityContext, onChange: () => void) => (() => void) | void;
  /** Release command-owned state when the active Gateway connection closes. */
  onDisconnect?: () => Promise<void> | void;
  /** Return false only when retained work and cleanup are idle; an absent hook defers auto-update. */
  hasActiveWork?: () => boolean;
  /** Optional Computer Use declaration published with this command's node manifest. */
  computerUse?: (context: OpenClawPluginNodeHostCommandAvailabilityContext) => unknown;
  agentTool?: {
    name: string;
    description: string;
    parameters?: Record<string, unknown>;
    /** Platforms where this tool is allowlisted by default; omit for explicit config only. */
    defaultPlatforms?: Array<"ios" | "android" | "macos" | "windows" | "linux" | "unknown">;
    mcp?: {
      server: string;
      tool: string;
    };
  };
};
type OpenClawPluginNodeHostCommand = OpenClawPluginNodeHostCommandBase & {
  duplex?: boolean | "optional";
  handle: (paramsJSON?: string | null, io?: OpenClawPluginNodeHostCommandIo, context?: OpenClawPluginNodeHostCommandContext) => Promise<string>;
};
//#endregion
//#region src/plugins/computer-use-contract.d.ts
declare const COMPUTER_USE_V2_ACTION_NAMES: readonly ["screenshot", "left_click", "right_click", "middle_click", "double_click", "triple_click", "mouse_move", "left_click_drag", "left_mouse_down", "left_mouse_up", "scroll", "type", "key", "hold_key", "wait", "list_apps", "list_windows", "get_accessibility_tree", "get_cursor_position", "get_window_state", "launch_app", "kill_app", "bring_to_front", "set_value", "zoom", "get_browser_state", "browser_prepare", "browser_navigate", "browser_click", "browser_type", "browser_dialog", "browser_set_input_files", "browser_download", "browser_pointer", "escalate_scope", "get_recording_state", "start_recording", "stop_recording", "replay_trajectory", "invoke_menu"];
type ComputerUseV2ActionName = (typeof COMPUTER_USE_V2_ACTION_NAMES)[number];
/** Canonical inner payload accepted by the `computer.act` node command. */
declare const ComputerActParamsSchema: Type.TUnion<[Type.TObject<{
  action: Type.TEnum<["left_click", "right_click", "middle_click", "double_click", "triple_click", "mouse_move"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly screenIndex: Type.TOptional<Type.TInteger>;
  readonly refWidth: Type.TOptional<Type.TInteger>;
  readonly windowRef: Type.TOptional<Type.TString>;
  readonly elementRef: Type.TOptional<Type.TString>;
  readonly observationId: Type.TOptional<Type.TString>;
  readonly deliveryMode: Type.TOptional<Type.TEnum<["background", "foreground"]>>;
  readonly displayFrameId: Type.TOptional<Type.TString>;
  readonly x: Type.TOptional<Type.TNumber>;
  readonly y: Type.TOptional<Type.TNumber>;
  readonly modifiers: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  action: Type.TEnum<["left_click_drag"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly screenIndex: Type.TOptional<Type.TInteger>;
  readonly refWidth: Type.TOptional<Type.TInteger>;
  readonly windowRef: Type.TOptional<Type.TString>;
  readonly elementRef: Type.TOptional<Type.TString>;
  readonly observationId: Type.TOptional<Type.TString>;
  readonly deliveryMode: Type.TOptional<Type.TEnum<["background", "foreground"]>>;
  readonly displayFrameId: Type.TOptional<Type.TString>;
  readonly x: Type.TOptional<Type.TNumber>;
  readonly y: Type.TOptional<Type.TNumber>;
  readonly fromX: Type.TOptional<Type.TNumber>;
  readonly fromY: Type.TOptional<Type.TNumber>;
  readonly durationMs: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
  action: Type.TEnum<["left_mouse_down", "left_mouse_up"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly screenIndex: Type.TOptional<Type.TInteger>;
  readonly refWidth: Type.TOptional<Type.TInteger>;
  readonly windowRef: Type.TOptional<Type.TString>;
  readonly elementRef: Type.TOptional<Type.TString>;
  readonly observationId: Type.TOptional<Type.TString>;
  readonly deliveryMode: Type.TOptional<Type.TEnum<["background", "foreground"]>>;
  readonly displayFrameId: Type.TOptional<Type.TString>;
  readonly x: Type.TOptional<Type.TNumber>;
  readonly y: Type.TOptional<Type.TNumber>;
  readonly modifiers: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  action: Type.TEnum<["scroll"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly screenIndex: Type.TOptional<Type.TInteger>;
  readonly refWidth: Type.TOptional<Type.TInteger>;
  readonly windowRef: Type.TOptional<Type.TString>;
  readonly elementRef: Type.TOptional<Type.TString>;
  readonly observationId: Type.TOptional<Type.TString>;
  readonly deliveryMode: Type.TOptional<Type.TEnum<["background", "foreground"]>>;
  readonly displayFrameId: Type.TOptional<Type.TString>;
  readonly x: Type.TOptional<Type.TNumber>;
  readonly y: Type.TOptional<Type.TNumber>;
  readonly modifiers: Type.TOptional<Type.TString>;
  readonly scrollDirection: Type.TOptional<Type.TEnum<["up", "down", "left", "right"]>>;
  readonly scrollAmount: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
  action: Type.TEnum<["type"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly screenIndex: Type.TOptional<Type.TInteger>;
  readonly refWidth: Type.TOptional<Type.TInteger>;
  readonly windowRef: Type.TOptional<Type.TString>;
  readonly elementRef: Type.TOptional<Type.TString>;
  readonly observationId: Type.TOptional<Type.TString>;
  readonly deliveryMode: Type.TOptional<Type.TEnum<["background", "foreground"]>>;
  readonly text: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  action: Type.TEnum<["key"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly screenIndex: Type.TOptional<Type.TInteger>;
  readonly refWidth: Type.TOptional<Type.TInteger>;
  readonly windowRef: Type.TOptional<Type.TString>;
  readonly elementRef: Type.TOptional<Type.TString>;
  readonly observationId: Type.TOptional<Type.TString>;
  readonly deliveryMode: Type.TOptional<Type.TEnum<["background", "foreground"]>>;
  readonly keys: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  action: Type.TEnum<["hold_key"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly screenIndex: Type.TOptional<Type.TInteger>;
  readonly refWidth: Type.TOptional<Type.TInteger>;
  readonly windowRef: Type.TOptional<Type.TString>;
  readonly elementRef: Type.TOptional<Type.TString>;
  readonly observationId: Type.TOptional<Type.TString>;
  readonly deliveryMode: Type.TOptional<Type.TEnum<["background", "foreground"]>>;
  readonly keys: Type.TOptional<Type.TString>;
  readonly durationMs: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
  action: Type.TEnum<["list_apps", "list_windows", "get_cursor_position"]>;
  executionId: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  action: Type.TEnum<["get_accessibility_tree"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly windowRef: Type.TOptional<Type.TString>;
  readonly query: Type.TOptional<Type.TString>;
  readonly depth: Type.TOptional<Type.TInteger>;
  readonly maxElements: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
  action: Type.TEnum<["get_window_state"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly windowRef: Type.TString;
  readonly includeScreenshot: Type.TOptional<Type.TBoolean>;
  readonly query: Type.TOptional<Type.TString>;
  readonly depth: Type.TOptional<Type.TInteger>;
  readonly maxElements: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
  action: Type.TEnum<["launch_app", "kill_app"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly app: Type.TString;
}>, Type.TObject<{
  action: Type.TEnum<["bring_to_front"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly windowRef: Type.TString;
}>, Type.TObject<{
  action: Type.TEnum<["set_value"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly windowRef: Type.TString;
  readonly elementRef: Type.TString;
  readonly observationId: Type.TString;
  readonly value: Type.TString;
  readonly deliveryMode: Type.TOptional<Type.TEnum<["background", "foreground"]>>;
}>, Type.TObject<{
  action: Type.TEnum<["invoke_menu"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly windowRef: Type.TString;
  readonly path: Type.TArray<Type.TString>;
  readonly deliveryMode: Type.TOptional<Type.TEnum<["background", "foreground"]>>;
}>, Type.TObject<{
  action: Type.TEnum<["zoom"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly windowRef: Type.TString;
  readonly observationId: Type.TString;
  readonly x1: Type.TNumber;
  readonly y1: Type.TNumber;
  readonly x2: Type.TNumber;
  readonly y2: Type.TNumber;
}>, Type.TObject<{
  action: Type.TEnum<["get_browser_state"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly windowRef: Type.TString;
}>, Type.TObject<{
  action: Type.TEnum<["get_browser_state"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly browserRef: Type.TString;
  readonly pageRef: Type.TString;
  readonly snapshotFormat: Type.TOptional<Type.TEnum<["dom_refs_v1", "semantic_v2"]>>;
  readonly elementRef: Type.TOptional<Type.TString>;
  readonly observationId: Type.TOptional<Type.TString>;
  readonly query: Type.TOptional<Type.TString>;
  readonly continuation: Type.TOptional<Type.TString>;
  readonly includeScreenshot: Type.TOptional<Type.TBoolean>;
}>, Type.TObject<{
  action: Type.TEnum<["browser_prepare"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly windowRef: Type.TString;
  readonly profile: Type.TOptional<Type.TEnum<["isolated_new", "isolated_named"]>>;
  readonly profileName: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  action: Type.TEnum<["browser_navigate"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly browserRef: Type.TString;
  readonly pageRef: Type.TString;
  readonly url: Type.TString;
}>, Type.TObject<{
  action: Type.TEnum<["browser_click"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly browserRef: Type.TString;
  readonly pageRef: Type.TString;
  readonly observationId: Type.TString;
  readonly elementRef: Type.TOptional<Type.TString>;
  readonly x: Type.TOptional<Type.TNumber>;
  readonly y: Type.TOptional<Type.TNumber>;
  readonly inputRoute: Type.TOptional<Type.TEnum<["trusted", "dom_event"]>>;
}>, Type.TObject<{
  action: Type.TEnum<["browser_type"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly browserRef: Type.TString;
  readonly pageRef: Type.TString;
  readonly observationId: Type.TString;
  readonly elementRef: Type.TString;
  readonly text: Type.TString;
  readonly mode: Type.TOptional<Type.TEnum<["insert_text", "keystrokes"]>>;
  readonly replace: Type.TOptional<Type.TBoolean>;
}>, Type.TObject<{
  action: Type.TEnum<["browser_dialog"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly browserRef: Type.TString;
  readonly pageRef: Type.TString;
  readonly dialogAction: Type.TLiteral<"inspect">;
}>, Type.TObject<{
  action: Type.TEnum<["browser_dialog"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly browserRef: Type.TString;
  readonly pageRef: Type.TString;
  readonly dialogAction: Type.TLiteral<"accept">;
  readonly dialogRef: Type.TString;
  readonly promptText: Type.TOptional<Type.TString>;
  readonly deliveryMode: Type.TOptional<Type.TEnum<["background", "foreground"]>>;
}>, Type.TObject<{
  action: Type.TEnum<["browser_dialog"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly browserRef: Type.TString;
  readonly pageRef: Type.TString;
  readonly dialogAction: Type.TLiteral<"dismiss">;
  readonly dialogRef: Type.TString;
  readonly deliveryMode: Type.TOptional<Type.TEnum<["background", "foreground"]>>;
}>, Type.TObject<{
  action: Type.TEnum<["browser_set_input_files"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly browserRef: Type.TString;
  readonly pageRef: Type.TString;
  readonly observationId: Type.TString;
  readonly elementRef: Type.TString;
  readonly resourceHandles: Type.TArray<Type.TString>;
}>, Type.TObject<{
  action: Type.TEnum<["browser_download"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly browserRef: Type.TString;
  readonly pageRef: Type.TString;
  readonly observationId: Type.TString;
  readonly elementRef: Type.TString;
}>, Type.TObject<{
  action: Type.TEnum<["browser_pointer"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly browserRef: Type.TString;
  readonly pageRef: Type.TString;
  readonly observationId: Type.TString;
  readonly pointerAction: Type.TEnum<["hover", "right_click", "double_click", "scroll", "drag"]>;
  readonly inputRoute: Type.TOptional<Type.TEnum<["trusted", "dom_event"]>>;
  readonly elementRef: Type.TOptional<Type.TString>;
  readonly x: Type.TOptional<Type.TNumber>;
  readonly y: Type.TOptional<Type.TNumber>;
  readonly destinationElementRef: Type.TOptional<Type.TString>;
  readonly toX: Type.TOptional<Type.TNumber>;
  readonly toY: Type.TOptional<Type.TNumber>;
  readonly deltaX: Type.TOptional<Type.TNumber>;
  readonly deltaY: Type.TOptional<Type.TNumber>;
}>, Type.TObject<{
  action: Type.TEnum<["escalate_scope"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly reason: Type.TEnum<["ax_tree_pixel_mismatch", "background_delivery_failed", "foreground_ineffective", "no_window_target", "other"]>;
}>, Type.TObject<{
  action: Type.TEnum<["get_recording_state", "stop_recording"]>;
  executionId: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  action: Type.TEnum<["start_recording"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly recordVideo: Type.TOptional<Type.TBoolean>;
}>, Type.TObject<{
  action: Type.TEnum<["replay_trajectory"]>;
  executionId: Type.TOptional<Type.TString>;
} & {
  readonly resourceHandle: Type.TString;
  readonly delayMs: Type.TOptional<Type.TInteger>;
  readonly stopOnError: Type.TOptional<Type.TBoolean>;
}>]>;
declare const ComputerActResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  effect: Type.TOptional<Type.TEnum<["confirmed", "unverifiable", "suspected_noop"]>>;
  observation: Type.TOptional<Type.TObject<{
    kind: Type.TEnum<["window", "screen", "browser"]>;
    base64: Type.TOptional<Type.TString>;
    format: Type.TOptional<Type.TEnum<["jpeg", "png"]>>;
    width: Type.TOptional<Type.TInteger>;
    height: Type.TOptional<Type.TInteger>;
    observationId: Type.TOptional<Type.TString>;
    elements: Type.TOptional<Type.TArray<Type.TObject<{
      elementRef: Type.TString;
      role: Type.TString;
      label: Type.TOptional<Type.TString>;
      value: Type.TOptional<Type.TString>;
      bounds: Type.TObject<{
        x: Type.TNumber;
        y: Type.TNumber;
        width: Type.TNumber;
        height: Type.TNumber;
      }>;
    }>>>;
  }>>;
  escalation: Type.TOptional<Type.TObject<{
    recommended: Type.TEnum<["window-pixel", "foreground", "desktop"]>;
    reasonCode: Type.TString;
  }>>;
  details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
}>;
declare const ComputerUseCapabilityDescriptorSchema: Type.TObject<{
  contractVersion: Type.TLiteral<2>;
  provider: Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    generation: Type.TString;
  }>;
  actions: Type.TArray<Type.TEnum<["screenshot", "left_click", "right_click", "middle_click", "double_click", "triple_click", "mouse_move", "left_click_drag", "left_mouse_down", "left_mouse_up", "scroll", "type", "key", "hold_key", "wait", "list_apps", "list_windows", "get_accessibility_tree", "get_cursor_position", "get_window_state", "launch_app", "kill_app", "bring_to_front", "set_value", "zoom", "get_browser_state", "browser_prepare", "browser_navigate", "browser_click", "browser_type", "browser_dialog", "browser_set_input_files", "browser_download", "browser_pointer", "escalate_scope", "get_recording_state", "start_recording", "stop_recording", "replay_trajectory", "invoke_menu"]>>;
  targets: Type.TArray<Type.TEnum<["screen", "window", "element", "browser"]>>;
  deliveryModes: Type.TArray<Type.TEnum<["background", "foreground"]>>;
  observations: Type.TArray<Type.TEnum<["image", "accessibility", "browser"]>>;
  features: Type.TObject<{
    recording: Type.TBoolean;
    agentCursor: Type.TBoolean;
    multiDisplay: Type.TBoolean;
  }>;
}>;
/** Canonical inner payload accepted by the `screen.snapshot` node command. */
declare const ScreenSnapshotParamsSchema: Type.TObject<{
  executionId: Type.TOptional<Type.TString>;
  screenIndex: Type.TOptional<Type.TInteger>;
  maxWidth: Type.TOptional<Type.TInteger>;
  quality: Type.TOptional<Type.TNumber>;
  format: Type.TOptional<Type.TEnum<["jpeg", "png"]>>;
}>;
/** Canonical inner payload returned by the `screen.snapshot` node command. */
declare const ScreenSnapshotResultSchema: Type.TObject<{
  format: Type.TEnum<["jpeg", "png"]>;
  base64: Type.TString;
  displayFrameId: Type.TOptional<Type.TString>;
  screenIndex: Type.TOptional<Type.TNumber>;
  width: Type.TOptional<Type.TNumber>;
  height: Type.TOptional<Type.TNumber>;
  capturedAtMs: Type.TOptional<Type.TInteger>;
}>;
type ComputerActParams = Static<typeof ComputerActParamsSchema>;
type ComputerActResult = Static<typeof ComputerActResultSchema>;
type ComputerUseCapabilityDescriptor = Static<typeof ComputerUseCapabilityDescriptorSchema>;
type ScreenSnapshotParams = Static<typeof ScreenSnapshotParamsSchema>;
type ScreenSnapshotResult = Static<typeof ScreenSnapshotResultSchema>;
type ComputerUseValidator<Value> = (value: unknown) => value is Value;
/** Compile one Computer Use wire schema into a reusable type-guard validator. */
declare function compileComputerUseValidator<const Schema extends TSchema>(schema: Schema): ComputerUseValidator<Static<Schema>>;
declare function parseComputerActParamsJSON(paramsJSON: string | null | undefined): ComputerActParams;
declare function parseScreenSnapshotParamsJSON(paramsJSON: string | null | undefined): ScreenSnapshotParams;
type ComputerUseExecution = {
  snapshot(paramsJSON: string | null | undefined, signal?: AbortSignal): Promise<string>;
  act(paramsJSON: string | null | undefined, signal?: AbortSignal): Promise<string>;
  close(reason: string): Promise<void>;
};
type ComputerUseProvider = {
  id: string;
  label: string;
  capabilities(): ComputerUseCapabilityDescriptor;
  isAvailable(): boolean;
  prepare?: (context: OpenClawPluginNodeHostCommandAvailabilityContext) => Promise<void> | void;
  watchAvailability?: (context: OpenClawPluginNodeHostCommandAvailabilityContext, onChange: () => void) => (() => void) | void;
  openExecution(context: {
    executionId: string;
    sessionKey?: string;
  }): Promise<ComputerUseExecution>;
};
type ComputerUseRegistrationApi = {
  registerNodeHostCommand(command: OpenClawPluginNodeHostCommand): void;
};
/** Register the canonical node-host command pair for one node-local provider. */
declare function registerComputerUseProvider(api: ComputerUseRegistrationApi, provider: ComputerUseProvider): void;
//#endregion
export { registerComputerUseProvider as _, ComputerActResultSchema as a, OpenClawPluginNodeWorkspace as b, ComputerUseProvider as c, ScreenSnapshotParamsSchema as d, ScreenSnapshotResult as f, parseScreenSnapshotParamsJSON as g, parseComputerActParamsJSON as h, ComputerActResult as i, ComputerUseV2ActionName as l, compileComputerUseValidator as m, ComputerActParams as n, ComputerUseCapabilityDescriptor as o, ScreenSnapshotResultSchema as p, ComputerActParamsSchema as r, ComputerUseCapabilityDescriptorSchema as s, COMPUTER_USE_V2_ACTION_NAMES as t, ScreenSnapshotParams as u, OpenClawPluginNodeHostCommand as v, OpenClawPluginNodeHostCommandAvailabilityContext as y };