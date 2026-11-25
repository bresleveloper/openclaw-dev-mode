import { Fn as NodeSession, Gt as OpenClawPluginApi, Xl as DecisionRuntimeV2, wn as GatewayRequestHandlers } from "../../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../../types.openclaw-D8uW-XQA.js";
import { i as resolveExistingPathsWithinRoot } from "../../security-runtime-HqxvRL4S.js";
import "../../web-media-B8Te5SZ2.js";
import { n as AnyAgentTool } from "../../common-SasPqPvU.js";
import "../../decisions-CuLalOOr.js";
import "../../gateway-runtime-D_zQvTfF.js";
import { Type } from "typebox";
import "@openclaw/fs-safe/advanced";
declare const definitions: {
  readonly doctor: {
    readonly lifecycle: true;
  };
  readonly status: {
    readonly lifecycle: true;
  };
  readonly start: {
    readonly lifecycle: true;
  };
  readonly stop: {
    readonly lifecycle: true;
  };
  readonly profiles: {
    readonly lifecycle: true;
  };
  readonly importprofile: {
    readonly lifecycle: true;
  };
  readonly tabs: {
    readonly tabBoundOrder: 14;
  };
  readonly open: {};
  readonly focus: {
    readonly tabBoundOrder: 9;
  };
  readonly close: {
    readonly tabBoundOrder: 1;
  };
  readonly snapshot: {
    readonly tabBoundOrder: 13;
  };
  readonly screenshot: {
    readonly tabBoundOrder: 12;
    readonly capability: "supportsScreenshots";
    readonly path: true;
  };
  readonly navigate: {
    readonly tabBoundOrder: 10;
  };
  readonly console: {
    readonly tabBoundOrder: 2;
    readonly capability: "supportsConsole";
  };
  readonly requests: {
    readonly tabBoundOrder: 3;
    readonly capability: "supportsRequests";
  };
  readonly errors: {
    readonly tabBoundOrder: 4;
    readonly capability: "supportsErrors";
  };
  readonly text: {
    readonly tabBoundOrder: 5;
    readonly capability: "supportsPageText";
  };
  readonly judge: {
    readonly tabBoundOrder: 17;
    readonly capability: "supportsPageText";
  };
  readonly emulate: {
    readonly tabBoundOrder: 6;
    readonly capability: "supportsEmulation";
  };
  readonly pdf: {
    readonly tabBoundOrder: 11;
    readonly capability: "supportsPdf";
    readonly path: true;
  };
  readonly download: {
    readonly tabBoundOrder: 8;
    readonly capability: "supportsDownloads";
    readonly path: true;
  };
  readonly waitfordownload: {
    readonly tabBoundOrder: 16;
    readonly capability: "supportsDownloads";
    readonly path: true;
  };
  readonly upload: {
    readonly tabBoundOrder: 15;
    readonly capability: "supportsUploads";
  };
  readonly dialog: {
    readonly tabBoundOrder: 7;
    readonly capability: "supportsDialogs";
  };
  readonly act: {
    readonly tabBoundOrder: 0;
  };
};
type BrowserToolAction = keyof typeof definitions;
declare const BROWSER_TOOL_ACTIONS: BrowserToolAction[];
declare const BROWSER_MODEL_ACT_KINDS: ("batch" | "click" | "clickCoords" | "close" | "drag" | "evaluate" | "fill" | "hover" | "press" | "resize" | "scrollIntoView" | "select" | "type" | "wait")[];
type BrowserToolCapabilities = {
  actions: readonly (typeof BROWSER_TOOL_ACTIONS)[number][];
  actKinds: readonly (typeof BROWSER_MODEL_ACT_KINDS)[number][];
  tabBound: boolean;
  supportsNativeSnapshots?: boolean;
};
/** Lazy registration and execution expose exactly the same configured tool. */
export declare function createBrowserToolDefinition(opts: {
  runToolBinding?: unknown;
  toolCapabilities?: BrowserToolCapabilities;
  sandboxBridgeUrl?: string;
  allowHostControl?: boolean;
  agentId?: string;
  decisions?: DecisionRuntimeV2;
} | undefined, getConfig: () => OpenClawConfig | undefined): {
  binding: {
    kind: "tab";
    tabId: number;
    target: "host" | "node";
    node?: string;
    profile: string;
    targetId: string;
  } | undefined;
  capabilities: BrowserToolCapabilities;
  metadata: {
    label: string;
    name: string;
    resultContentSource: "network";
    description: string;
    parameters: import("typebox").TObject<{
      targetId: import("typebox").TOptional<import("typebox").TString>;
      ref: import("typebox").TOptional<import("typebox").TString>;
      actions: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{}>>>;
      stopOnError: import("typebox").TOptional<import("typebox").TBoolean>;
      doubleClick: import("typebox").TOptional<import("typebox").TBoolean>;
      button: import("typebox").TOptional<import("typebox").TString>;
      modifiers: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      x?: import("typebox").TOptional<import("typebox").TNumber> | undefined;
      y?: import("typebox").TOptional<import("typebox").TNumber> | undefined;
      text: import("typebox").TOptional<import("typebox").TString>;
      submit: import("typebox").TOptional<import("typebox").TBoolean>;
      slowly: import("typebox").TOptional<import("typebox").TBoolean>;
      key: import("typebox").TOptional<import("typebox").TString>;
      delayMs: import("typebox").TOptional<import("typebox").TInteger>;
      startRef?: import("typebox").TOptional<import("typebox").TString> | undefined;
      endRef?: import("typebox").TOptional<import("typebox").TString> | undefined;
      values: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      fields: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{}>>>;
      width?: import("typebox").TOptional<import("typebox").TInteger> | undefined;
      height?: import("typebox").TOptional<import("typebox").TInteger> | undefined;
      timeMs: import("typebox").TOptional<import("typebox").TInteger>;
      selector?: import("typebox").TOptional<import("typebox").TString> | undefined;
      url: import("typebox").TOptional<import("typebox").TString>;
      loadState: import("typebox").TOptional<import("typebox").TString>;
      textGone: import("typebox").TOptional<import("typebox").TString>;
      timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
      fn?: import("typebox").TOptional<import("typebox").TString> | undefined;
      action: import("typebox").TEnum<("act" | "close" | "console" | "dialog" | "doctor" | "download" | "emulate" | "errors" | "focus" | "importprofile" | "judge" | "navigate" | "open" | "pdf" | "profiles" | "requests" | "screenshot" | "snapshot" | "start" | "status" | "stop" | "tabs" | "text" | "upload" | "waitfordownload")[]> | import("typebox").TUnsafe<"act" | "close" | "console" | "dialog" | "doctor" | "download" | "emulate" | "errors" | "focus" | "importprofile" | "judge" | "navigate" | "open" | "pdf" | "profiles" | "requests" | "screenshot" | "snapshot" | "start" | "status" | "stop" | "tabs" | "text" | "upload" | "waitfordownload">;
      target: import("typebox").TOptional<import("typebox").TEnum<("host" | "node" | "sandbox")[]> | import("typebox").TUnsafe<"host" | "node" | "sandbox">>;
      dashboard?: import("typebox").TOptional<import("typebox").TString> | undefined;
      node: import("typebox").TOptional<import("typebox").TString>;
      profile: import("typebox").TOptional<import("typebox").TString>;
      browser: import("typebox").TOptional<import("typebox").TString>;
      systemProfile: import("typebox").TOptional<import("typebox").TString>;
      into: import("typebox").TOptional<import("typebox").TString>;
      domains: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      targetUrl: import("typebox").TOptional<import("typebox").TString>;
      label: import("typebox").TOptional<import("typebox").TString>;
      limit: import("typebox").TOptional<import("typebox").TInteger>;
      maxChars: import("typebox").TOptional<import("typebox").TInteger>;
      mode: import("typebox").TOptional<import("typebox").TEnum<"efficient"[]> | import("typebox").TUnsafe<"efficient">>;
      snapshotFormat: import("typebox").TOptional<import("typebox").TEnum<("ai" | "aria")[]> | import("typebox").TUnsafe<"ai" | "aria">>;
      refs: import("typebox").TOptional<import("typebox").TEnum<("aria" | "role")[]> | import("typebox").TUnsafe<"aria" | "role">>;
      interactive: import("typebox").TOptional<import("typebox").TBoolean>;
      compact: import("typebox").TOptional<import("typebox").TBoolean>;
      depth: import("typebox").TOptional<import("typebox").TInteger>;
      frame?: import("typebox").TOptional<import("typebox").TString> | undefined;
      labels?: import("typebox").TOptional<import("typebox").TBoolean> | undefined;
      fullPage?: import("typebox").TOptional<import("typebox").TBoolean> | undefined;
      element?: import("typebox").TOptional<import("typebox").TString> | undefined;
      type?: import("typebox").TOptional<import("typebox").TEnum<("jpeg" | "png")[]> | import("typebox").TUnsafe<"jpeg" | "png">> | undefined;
      urls: import("typebox").TOptional<import("typebox").TBoolean>;
      path?: import("typebox").TOptional<import("typebox").TString> | undefined;
      level: import("typebox").TOptional<import("typebox").TString>;
      filter: import("typebox").TOptional<import("typebox").TString>;
      clear: import("typebox").TOptional<import("typebox").TBoolean>;
      query: import("typebox").TOptional<import("typebox").TString>;
      device?: import("typebox").TOptional<import("typebox").TString> | undefined;
      colorScheme?: import("typebox").TOptional<import("typebox").TEnum<("dark" | "light" | "no-preference" | "none")[]> | import("typebox").TUnsafe<"dark" | "light" | "no-preference" | "none">> | undefined;
      timezoneId?: import("typebox").TOptional<import("typebox").TString> | undefined;
      locale?: import("typebox").TOptional<import("typebox").TString> | undefined;
      paths?: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>> | undefined;
      inputRef?: import("typebox").TOptional<import("typebox").TString> | undefined;
      dialogId?: import("typebox").TOptional<import("typebox").TString> | undefined;
      accept?: import("typebox").TOptional<import("typebox").TBoolean> | undefined;
      promptText?: import("typebox").TOptional<import("typebox").TString> | undefined;
      kind: import("typebox").TOptional<import("typebox").TEnum<("batch" | "click" | "clickCoords" | "close" | "drag" | "evaluate" | "fill" | "hover" | "press" | "resize" | "scrollIntoView" | "select" | "type" | "wait")[]> | import("typebox").TUnsafe<"batch" | "click" | "clickCoords" | "close" | "drag" | "evaluate" | "fill" | "hover" | "press" | "resize" | "scrollIntoView" | "select" | "type" | "wait">>;
      request: import("typebox").TOptional<import("typebox").TObject<{
        targetId: import("typebox").TOptional<import("typebox").TString>;
        ref: import("typebox").TOptional<import("typebox").TString>;
        actions: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{}>>>;
        stopOnError: import("typebox").TOptional<import("typebox").TBoolean>;
        doubleClick: import("typebox").TOptional<import("typebox").TBoolean>;
        button: import("typebox").TOptional<import("typebox").TString>;
        modifiers: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        x?: import("typebox").TOptional<import("typebox").TNumber> | undefined;
        y?: import("typebox").TOptional<import("typebox").TNumber> | undefined;
        text: import("typebox").TOptional<import("typebox").TString>;
        submit: import("typebox").TOptional<import("typebox").TBoolean>;
        slowly: import("typebox").TOptional<import("typebox").TBoolean>;
        key: import("typebox").TOptional<import("typebox").TString>;
        delayMs: import("typebox").TOptional<import("typebox").TInteger>;
        startRef?: import("typebox").TOptional<import("typebox").TString> | undefined;
        endRef?: import("typebox").TOptional<import("typebox").TString> | undefined;
        values: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        fields: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{}>>>;
        width?: import("typebox").TOptional<import("typebox").TInteger> | undefined;
        height?: import("typebox").TOptional<import("typebox").TInteger> | undefined;
        timeMs: import("typebox").TOptional<import("typebox").TInteger>;
        selector?: import("typebox").TOptional<import("typebox").TString> | undefined;
        url: import("typebox").TOptional<import("typebox").TString>;
        loadState: import("typebox").TOptional<import("typebox").TString>;
        textGone: import("typebox").TOptional<import("typebox").TString>;
        timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
        fn?: import("typebox").TOptional<import("typebox").TString> | undefined;
        kind: import("typebox").TEnum<("batch" | "click" | "clickCoords" | "close" | "drag" | "evaluate" | "fill" | "hover" | "press" | "resize" | "scrollIntoView" | "select" | "type" | "wait")[]> | import("typebox").TUnsafe<"batch" | "click" | "clickCoords" | "close" | "drag" | "evaluate" | "fill" | "hover" | "press" | "resize" | "scrollIntoView" | "select" | "type" | "wait">;
      }>>;
    }>;
    outputSchema: import("typebox").TObject<{
      ok: import("typebox").TOptional<import("typebox").TBoolean>;
      targetId: import("typebox").TOptional<import("typebox").TString>;
      url: import("typebox").TOptional<import("typebox").TString>;
      format: import("typebox").TOptional<import("typebox").TEnum<("ai" | "aria")[]> | import("typebox").TUnsafe<"ai" | "aria">>;
      snapshot: import("typebox").TOptional<import("typebox").TString>;
      text: import("typebox").TOptional<import("typebox").TString>;
      refs: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TNumber, import("typebox").TRecord<"^.*$", import("typebox").TUnknown>]>>;
      stats: import("typebox").TOptional<import("typebox").TObject<{
        lines: import("typebox").TNumber;
        chars: import("typebox").TNumber;
        refs: import("typebox").TNumber;
        interactive: import("typebox").TNumber;
      }>>;
      truncated: import("typebox").TOptional<import("typebox").TBoolean>;
      observation: import("typebox").TOptional<import("typebox").TObject<{
        chars: import("typebox").TNumber;
        truncated: import("typebox").TBoolean;
      }>>;
      judgment: import("typebox").TOptional<import("typebox").TObject<{
        status: import("typebox").TEnum<("ok" | "unavailable")[]> | import("typebox").TUnsafe<"ok" | "unavailable">;
        reason: import("typebox").TOptional<import("typebox").TString>;
        result: import("typebox").TOptional<import("typebox").TObject<{
          model: import("typebox").TString;
          answers: import("typebox").TRecord<"^.*$", import("typebox").TUnknown>;
        }>>;
      }>>;
      newElements: import("typebox").TOptional<import("typebox").TNumber>;
      tabs: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
        suggestedTargetId: import("typebox").TOptional<import("typebox").TString>;
        tabId: import("typebox").TOptional<import("typebox").TString>;
        webExtensionTabId: import("typebox").TOptional<import("typebox").TInteger>;
        label: import("typebox").TOptional<import("typebox").TString>;
        targetId: import("typebox").TOptional<import("typebox").TString>;
        title: import("typebox").TOptional<import("typebox").TString>;
        url: import("typebox").TOptional<import("typebox").TString>;
        urlUnavailableReason: import("typebox").TOptional<import("typebox").TEnum<("navigation_blocked" | "navigation_check_failed")[]> | import("typebox").TUnsafe<"navigation_blocked" | "navigation_check_failed">>;
        type: import("typebox").TOptional<import("typebox").TString>;
      }>>>;
      tabCount: import("typebox").TOptional<import("typebox").TNumber>;
      results: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
        ok: import("typebox").TBoolean;
        error: import("typebox").TOptional<import("typebox").TString>;
        navigated: import("typebox").TOptional<import("typebox").TLiteral<true>>;
        url: import("typebox").TOptional<import("typebox").TString>;
      }>>>;
      aborted: import("typebox").TOptional<import("typebox").TObject<{
        reason: import("typebox").TEnum<("closed" | "navigation")[]> | import("typebox").TUnsafe<"closed" | "navigation">;
        afterAction: import("typebox").TNumber;
        url: import("typebox").TString;
        skipped: import("typebox").TNumber;
      }>>;
      pageState: import("typebox").TOptional<import("typebox").TObject<{}>>;
      enabled: import("typebox").TOptional<import("typebox").TBoolean>;
      running: import("typebox").TOptional<import("typebox").TBoolean>;
      profile: import("typebox").TOptional<import("typebox").TString>;
      driver: import("typebox").TOptional<import("typebox").TString>;
      transport: import("typebox").TOptional<import("typebox").TString>;
      pid: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TNumber, import("typebox").TNull]>>;
      cdpPort: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TNumber, import("typebox").TNull]>>;
      cdpUrl: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    }>;
  };
};
type AttachedBrowserToolRuntime = {
  tool: AnyAgentTool;
  dispose: () => Promise<void>;
};
type CreateAttachedBrowserToolRuntimeParams = {
  cdpUrl: string;
  ensureAttachTarget: () => Promise<void>;
  agentSessionKey?: string;
  agentDir?: string;
  workspaceDir: string;
};
/** Create a normal Browser agent tool pinned to one raw, attach-only CDP profile. */
export declare function createAttachedBrowserToolRuntime(params: CreateAttachedBrowserToolRuntimeParams): Promise<AttachedBrowserToolRuntime>;
type BrowserGatewayNode = Pick<NodeSession, "nodeId" | "displayName" | "platform" | "deviceFamily" | "caps" | "commands" | "declaredCommands">;
type BrowserGatewayRequest = Parameters<GatewayRequestHandlers["browser.request"]>[0];
type BrowserGatewayRequestOptions = Omit<BrowserGatewayRequest, "context"> & {
  context: {
    nodeRegistry: Pick<BrowserGatewayRequest["context"]["nodeRegistry"], "invoke"> & {
      listConnected(): BrowserGatewayNode[];
    };
  };
};
declare function handleBrowserGatewayRequest({ params, respond, context, client, signal: invocationSignal, hasCurrentClientAuthority }: BrowserGatewayRequestOptions): Promise<void>;
export declare const browserHandlers: {
  "browser.request": typeof handleBrowserGatewayRequest;
};
export { type AttachedBrowserToolRuntime, type CreateAttachedBrowserToolRuntimeParams, type OpenClawPluginApi, resolveExistingPathsWithinRoot };