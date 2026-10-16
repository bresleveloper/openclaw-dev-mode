import { Ct as PluginRuntime, Sn as OpenClawPluginGatewayEvents, Tt as NodeSession, Ut as PluginStateKeyedStore, n as OpenClawPluginApi, wn as AnyAgentTool, wt as GatewayRequestHandlers } from "../../agent-harness-runtime-Du4B564s.js";
import { X as OpenClawConfig } from "../../runtime-types-LI_BBveH.js";
import "../../ssrf-runtime-DBBZ0Uv6.js";
import { z } from "zod";
import { Type } from "typebox";
import { DatabaseSync } from "node:sqlite";
import { resolveExistingPathsWithinRoot } from "@openclaw/fs-safe/advanced";
import { Selectable } from "kysely";
import "@openclaw/fs-safe/path";
import "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/store";
import { Command } from "commander";
import "@openclaw/fs-safe/atomic";
import "@openclaw/fs-safe/permissions";
import "@openclaw/fs-safe/durability";
import "@openclaw/fs-safe/watch";
import "playwright-core";
import "@modelcontextprotocol/sdk/client/index.js";
import "@modelcontextprotocol/sdk/client/stdio.js";
import "@openclaw/fs-safe/json";
//#region extensions/browser/src/browser-tool.schema.d.ts
declare const BROWSER_ACT_KINDS: readonly ["batch", "click", "clickCoords", "type", "press", "hover", "scrollIntoView", "drag", "select", "fill", "resize", "wait", "evaluate", "close"];
declare const BROWSER_TOOL_ACTIONS: readonly ["doctor", "status", "start", "stop", "profiles", "importprofile", "tabs", "open", "focus", "close", "snapshot", "screenshot", "navigate", "console", "requests", "errors", "text", "emulate", "pdf", "download", "waitfordownload", "upload", "dialog", "act"];
type BrowserToolCapabilities = {
  actions: readonly (typeof BROWSER_TOOL_ACTIONS)[number][];
  actKinds: readonly (typeof BROWSER_ACT_KINDS)[number][];
  tabBound: boolean;
  supportsNativeSnapshots?: boolean;
};
//#endregion
//#region extensions/browser/src/browser-tool-description.d.ts
/** Lazy registration and execution expose exactly the same configured tool. */
export declare function createBrowserToolDefinition(opts: {
  runToolBinding?: unknown;
  toolCapabilities?: BrowserToolCapabilities;
  sandboxBridgeUrl?: string;
  allowHostControl?: boolean;
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
      action: import("typebox").TEnum<("act" | "close" | "console" | "dialog" | "doctor" | "download" | "emulate" | "errors" | "focus" | "importprofile" | "navigate" | "open" | "pdf" | "profiles" | "requests" | "screenshot" | "snapshot" | "start" | "status" | "stop" | "tabs" | "text" | "upload" | "waitfordownload")[]> | import("typebox").TUnsafe<"act" | "close" | "console" | "dialog" | "doctor" | "download" | "emulate" | "errors" | "focus" | "importprofile" | "navigate" | "open" | "pdf" | "profiles" | "requests" | "screenshot" | "snapshot" | "start" | "status" | "stop" | "tabs" | "text" | "upload" | "waitfordownload">;
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
      refs: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TNumber, import("typebox").TRecord<"^.*$", import("typebox").TUnknown>]>>;
      stats: import("typebox").TOptional<import("typebox").TObject<{
        lines: import("typebox").TNumber;
        chars: import("typebox").TNumber;
        refs: import("typebox").TNumber;
        interactive: import("typebox").TNumber;
      }>>;
      truncated: import("typebox").TOptional<import("typebox").TBoolean>;
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
//#endregion
//#region extensions/browser/src/browser/pw-session-page.types.d.ts
/** A created page and the exact cleanup operation transferred to its adopting owner. */
type PlaywrightOwnedPage = {
  targetId: string;
  title: string;
  url: string;
  type: string;
  close: () => Promise<void>;
  isCurrent: () => boolean;
};
//#endregion
//#region extensions/browser/src/browser-dashboard.types.d.ts
type BrowserDashboardIdentity = {
  sessionKey: string;
  agentId: string;
  name: string;
  instanceId: string;
  url: string;
  profile: string;
};
type BrowserDashboardDefinition = BrowserDashboardIdentity & {
  revision: number;
  title?: string;
};
type SessionBrowserAuthority = NonNullable<Parameters<GatewayRequestHandlers[string]>[0]["sessionAccessAuthority"]>;
/** One isolated context belongs to one exact session incarnation and board instance. */
type SessionBrowserDashboard = {
  definition: BrowserDashboardDefinition;
  session: SessionBrowserAuthority["target"];
  paused: boolean;
  page?: PlaywrightOwnedPage;
  signal: AbortSignal;
  assertCurrent: () => void;
  assertDefinitionCurrent: () => Promise<void>;
  definitionChanged: () => void;
  close: () => Promise<void>;
};
//#endregion
//#region extensions/browser/src/browser-runtime-state.d.ts
type BrowserDashboardOperation = {
  promise: Promise<unknown>;
  readonly materializationFailure?: {
    error: unknown;
    definition: BrowserDashboardDefinition;
    callerCancelled: boolean;
  };
};
type BrowserDashboardRegistration = {
  kind: "dashboard-registration";
  targetId: string;
  profile: string | undefined;
  closeDispatched?: true;
};
type BrowserSessionTabOperationKey = string | symbol | BrowserDashboardRegistration;
type BrowserStateRuntime = {
  sessionTabs: PluginStateKeyedStore<unknown>;
  sessionTabInitialization?: Promise<void>;
  sessionTabOperations: Map<BrowserSessionTabOperationKey, Promise<void>>;
  gateway?: PluginRuntime["gateway"];
  dashboardOperations: Map<string, BrowserDashboardOperation>;
  dashboardEvents?: OpenClawPluginGatewayEvents;
  sessionDashboards?: Map<string, SessionBrowserDashboard>;
};
declare const { setRuntime: setBrowserStateRuntime, getRuntime: getBrowserStateRuntime, tryGetRuntime: getOptionalBrowserStateRuntime }: {
  setRuntime: (next: BrowserStateRuntime) => void;
  clearRuntime: () => void;
  tryGetRuntime: () => BrowserStateRuntime | null;
  getRuntime: () => BrowserStateRuntime;
};
//#endregion
//#region extensions/browser/src/attached-browser-tool-runtime.d.ts
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
//#endregion
//#region extensions/browser/src/gateway/browser-request.d.ts
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
//#endregion
export { type AttachedBrowserToolRuntime, type CreateAttachedBrowserToolRuntimeParams, type OpenClawPluginApi, resolveExistingPathsWithinRoot };