import { n as ResolvedBrowserConfig, r as ResolvedBrowserProfile, t as ManagedBrowserHeadlessSource } from "./config-BSORANS9.js";
import { t as BrowserExecutable } from "./chrome.executables-iLuG7AO2.js";
import { ChildProcess } from "node:child_process";
import { Server } from "node:http";

//#region extensions/browser/src/browser/chrome.d.ts
/** Running managed Chrome process and resolved control metadata. */
type RunningChrome = {
  pid: number;
  exe: BrowserExecutable;
  userDataDir: string;
  cdpPort: number;
  startedAt: number;
  proc: ChildProcess;
  headless?: boolean;
  headlessSource?: ManagedBrowserHeadlessSource;
  /**
   * @deprecated CDP managed-proxy bypasses are scoped at exact request URLs.
   * Kept so older in-memory callers can pass stale RunningChrome objects
   * through stopOpenClawChrome without type churn.
   */
  releaseCdpProxyBypass?: () => void;
};
//#endregion
//#region extensions/browser/src/browser/client.types.d.ts
/**
 * Browser client response types.
 *
 * Shared by the browser control client, CLI, and Browser agent tool.
 */
/** Browser transport backing the selected profile. */
type BrowserTransport = "cdp" | "chrome-mcp";
type BrowserHeadlessSource = "request" | "env" | "profile" | "config" | "linux-display-fallback" | "default";
/** Browser status response returned by the control server. */
type BrowserStatus = {
  enabled: boolean;
  profile?: string;
  driver?: "openclaw" | "existing-session";
  transport?: BrowserTransport;
  running: boolean;
  cdpReady?: boolean;
  cdpHttp?: boolean;
  /**
   * For Chrome MCP existing-session profiles, true only if a page-level tool
   * round-trip (`list_pages`) completes; for managed CDP profiles, mirrors
   * `cdpReady`. Distinguishes "transport handshake passed" from "page tools
   * are actually usable".
   */
  pageReady?: boolean;
  pid: number | null;
  cdpPort: number | null;
  cdpUrl?: string | null;
  chosenBrowser: string | null;
  detectedBrowser?: string | null;
  detectedExecutablePath?: string | null;
  detectError?: string | null;
  userDataDir: string | null;
  color: string;
  headless: boolean;
  headlessSource?: BrowserHeadlessSource;
  noSandbox?: boolean;
  executablePath?: string | null;
  attachOnly: boolean;
};
/** Browser tab record exposed by tab listing and tab mutation endpoints. */
type BrowserTab = {
  /** Best handle for agents to pass back as targetId: label, then tabId, then raw targetId. */suggestedTargetId?: string;
  targetId: string; /** Stable, human-friendly tab handle for this profile runtime (for example t1). */
  tabId?: string; /** Optional user-assigned tab label. */
  label?: string;
  title: string;
  url: string;
  wsUrl?: string;
  type?: string;
};
/** ARIA snapshot node exposed in structured snapshot responses. */
type SnapshotAriaNode = {
  ref: string;
  role: string;
  name: string;
  value?: string;
  description?: string;
  backendDOMNodeId?: number;
  depth: number;
};
//#endregion
//#region extensions/browser/src/browser/server-context.types.d.ts
/** Runtime state for a single profile's Chrome instance. */
type ProfileRuntimeState = {
  profile: ResolvedBrowserProfile;
  running: RunningChrome | null;
  ensureBrowserAvailable?: {
    key: string;
    promise: Promise<void>;
  } | null;
  managedLaunchFailure?: {
    consecutiveFailures: number;
    lastFailureAt: number;
    cooldownUntil?: number;
    lastError: string;
  }; /** Sticky tab selection when callers omit targetId (keeps snapshot+act consistent). */
  lastTargetId?: string | null; /** Stable, user-facing tab aliases scoped to this profile runtime. */
  tabAliases?: {
    nextTabNumber: number;
    byTargetId: Record<string, {
      tabId: string;
      label?: string;
      url?: string;
    }>;
  };
  reconcile?: {
    previousProfile: ResolvedBrowserProfile;
    reason: string;
  } | null;
};
/** Runtime state for the Browser control server. */
type BrowserServerState = {
  server?: Server | null;
  port: number;
  resolved: ResolvedBrowserConfig;
  profiles: Map<string, ProfileRuntimeState>;
  stopTrackedTabCleanup?: () => void;
  stopUnhandledRejectionHandler?: () => void;
};
type EnsureTabAvailableOptions = {
  /** Allow a target-id-only tab when the caller can continue through Playwright. */allowPlaywrightFallback?: boolean;
};
type BrowserProfileActions = {
  ensureBrowserAvailable: (opts?: {
    headless?: boolean;
  }) => Promise<void>;
  ensureTabAvailable: (targetId?: string, options?: EnsureTabAvailableOptions) => Promise<BrowserTab>;
  isHttpReachable: (timeoutMs?: number) => Promise<boolean>;
  isTransportAvailable: (timeoutMs?: number) => Promise<boolean>;
  isReachable: (timeoutMs?: number, options?: {
    ephemeral?: boolean;
    signal?: AbortSignal;
  }) => Promise<boolean>;
  listTabs: () => Promise<BrowserTab[]>;
  openTab: (url: string, opts?: {
    label?: string;
  }) => Promise<BrowserTab>;
  labelTab: (targetId: string, label: string) => Promise<BrowserTab>;
  focusTab: (targetId: string) => Promise<void>;
  closeTab: (targetId: string) => Promise<void>;
  stopRunningBrowser: () => Promise<{
    stopped: boolean;
  }>;
  resetProfile: () => Promise<{
    moved: boolean;
    from: string;
    to?: string;
  }>;
};
/** Profile-aware operations exposed to Browser route handlers. */
type BrowserRouteContext = {
  state: () => BrowserServerState;
  forProfile: (profileName?: string) => ProfileContext;
  listProfiles: () => Promise<ProfileStatus[]>;
  mapTabError: (err: unknown) => {
    status: number;
    message: string;
  } | null;
} & BrowserProfileActions;
/** Operations scoped to a single resolved Browser profile. */
type ProfileContext = {
  profile: ResolvedBrowserProfile;
} & BrowserProfileActions;
/** Status payload returned by Browser profile listing. */
type ProfileStatus = {
  name: string;
  transport: BrowserTransport;
  cdpPort: number | null;
  cdpUrl: string | null;
  color: string;
  driver: ResolvedBrowserProfile["driver"];
  running: boolean;
  tabCount: number;
  isDefault: boolean;
  isRemote: boolean;
  missingFromConfig?: boolean;
  reconcileReason?: string | null;
};
/** Inputs for creating a Browser route context. */
type ContextOptions = {
  getState: () => BrowserServerState | null;
  onEnsureAttachTarget?: (profile: ResolvedBrowserProfile) => Promise<void>;
  refreshConfigFromDisk?: boolean;
};
//#endregion
//#region extensions/browser/src/browser/server-context.d.ts
/** Creates the Browser route context used by control-server route handlers. */
declare function createBrowserRouteContext(opts: ContextOptions): BrowserRouteContext;
//#endregion
//#region extensions/browser/src/browser/bridge-server.d.ts
/** Running bridge server details returned to callers that manage its lifecycle. */
type BrowserBridge = {
  server: Server;
  port: number;
  baseUrl: string;
  state: BrowserServerState;
};
type ResolvedNoVncObserver = {
  noVncPort: number;
  password?: string;
};
/** Start an authenticated loopback browser bridge and register browser routes. */
declare function startBrowserBridgeServer(params: {
  resolved: ResolvedBrowserConfig;
  host?: string;
  port?: number;
  authToken?: string;
  authPassword?: string;
  onEnsureAttachTarget?: (profile: ProfileContext["profile"]) => Promise<void>;
  resolveSandboxNoVncToken?: (token: string) => ResolvedNoVncObserver | null;
  skipRouteRegistrationForTest?: boolean;
}): Promise<BrowserBridge>;
/** Stop a browser bridge server and clear its ephemeral port auth. */
declare function stopBrowserBridgeServer(server: Server): Promise<void>;
//#endregion
export { BrowserRouteContext as a, BrowserTab as c, createBrowserRouteContext as i, BrowserTransport as l, startBrowserBridgeServer as n, BrowserServerState as o, stopBrowserBridgeServer as r, BrowserStatus as s, BrowserBridge as t, SnapshotAriaNode as u };