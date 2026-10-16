import { A as SchemaContract, B as PluginManifestProviderRequestProvider, C as ModelApi, D as PluginInstallRecord, E as ThinkingLevelMap, F as PluginManifest, H as ChannelAccountKeyPolicy, I as PluginManifestChannelCommandDefaults, L as PluginManifestModelIdNormalizationProvider, M as PluginConfigUiHint, N as PluginDiagnostic, O as TalkProviderConfig, P as PluginFormat, R as PluginManifestOnboardingScope, T as StreamFn$1, U as ModelCatalogContextWindowOption, V as PluginManifestSetupProvider, W as ModelCatalogStatus, _ as ModelCompatConfig, a as AgentMessage, b as ModelProviderAuthMode, c as AgentToolUpdateCallback, d as AuthProfileCredential, f as AuthProfileCredentialSource, g as OpenClawConfig, h as RuntimeAuthProfileStore, i as ReplyPayload, j as PluginBundleFormat, k as ResolvedTtsPersona, l as StreamFn, m as OAuthCredential, n as OpenClawAgentDatabase, o as AgentTool, p as AuthProfileStore, r as OpenClawStateDatabase, s as AgentToolResult, t as ThinkLevel, u as ApiKeyCredential, w as Model, x as ModelProviderConfig, y as ModelMediaInputConfig, z as PluginManifestProviderEndpoint } from "./group-policy-Dw25VUD2.js";
import { Static, TSchema, Type as Type$1 } from "typebox";
import { z } from "zod";
import { DatabaseSync } from "node:sqlite";
import "@openclaw/fs-safe/advanced";
import "kysely";
import "@openclaw/ai/validation";
import "undici";
import "execa";
import "ws";
import "@openclaw/fs-safe/errors";
import "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/store";
import "@openclaw/fs-safe/temp";
import "@openclaw/fs-safe/path";
import "@openclaw/fs-safe/secure-file";
import "@openclaw/fs-safe/walk";
import "json5";
import "@modelcontextprotocol/sdk/types.js";
import "typebox/error";
import { TUI_KEYBINDINGS } from "@earendil-works/pi-tui";
import "@openclaw/ai";
import "@openclaw/ai/internal/runtime";
import "@openclaw/ai/internal/shared";
import "minimatch";
import "rastermill";
import "@openclaw/fs-safe/file-lock";
import "commander";
import "@openclaw/ai/internal/tool-schema";
//#region src/agents/provider-request-config.types.d.ts
/** Auth override accepted from sanitized provider/model request config. */
type ProviderRequestAuthOverride = {
  mode: "provider-default";
} | {
  mode: "authorization-bearer";
  token: string;
} | {
  mode: "header";
  headerName: string;
  value: string;
  prefix?: string;
};
/** TLS override accepted from sanitized provider/model request config. */
type ProviderRequestTlsOverride = {
  ca?: string;
  cert?: string;
  key?: string;
  passphrase?: string;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
/** Proxy override accepted from sanitized provider/model request config. */
type ProviderRequestProxyOverride = {
  mode: "env-proxy";
  tls?: ProviderRequestTlsOverride;
} | {
  mode: "explicit-proxy";
  url: string;
  tls?: ProviderRequestTlsOverride;
};
/** Transport override block shared by provider and model request config. */
type ProviderRequestTransportOverrides = {
  headers?: Record<string, string>;
  auth?: ProviderRequestAuthOverride;
  proxy?: ProviderRequestProxyOverride;
  tls?: ProviderRequestTlsOverride;
};
/** Model-scoped transport overrides, including private-network policy. */
type ModelProviderRequestTransportOverrides$1 = ProviderRequestTransportOverrides & {
  allowPrivateNetwork?: boolean;
};
//#endregion
//#region packages/gateway-protocol/src/theme.d.ts
declare const THEME_COLOR_KEYS: readonly ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground", "primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "muted-foreground", "accent", "accent-foreground", "destructive", "destructive-foreground", "border", "input", "ring"];
declare const THEME_FONT_KEYS: readonly ["font-sans", "font-mono"];
declare const THEME_MASCOT_VALUES: readonly ["claw", "none"];
type ThemeMascot = (typeof THEME_MASCOT_VALUES)[number];
type ThemePalette = Record<(typeof THEME_COLOR_KEYS)[number], string> & Partial<Record<(typeof THEME_FONT_KEYS)[number], string>>;
type ThemeDefinition = {
  name: string;
  description: string;
  mascot?: ThemeMascot;
  workingPhrases?: string[];
  critters?: string[];
  avatarHat?: string;
  light?: ThemePalette;
  dark?: ThemePalette;
};
//#endregion
//#region src/agents/failover/signal.d.ts
/** Persisted and wire-visible failover reason codes. Spellings are frozen. */
declare const FAILOVER_REASONS: readonly ["auth", "auth_permanent", "format", "rate_limit", "overloaded", "billing", "server_error", "timeout", "tls_certificate", "context_overflow", "model_not_found", "session_expired", "empty_response", "no_error_details", "unclassified", "unknown"];
type FailoverReason = (typeof FAILOVER_REASONS)[number];
//#endregion
//#region src/runtime.d.ts
type RuntimeExitOptions = {
  /** Route ANSI terminal-reset bytes away from structured stdout when needed. */
  resetStream?: NodeJS.WriteStream;
};
type RuntimeEnv = {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  /**
   * Exit the process after restoring terminal state.
   * Pass `resetStream` to route the ANSI reset sequence to a specific
   * stream (e.g. stderr) when structured output on stdout must stay clean.
   */
  exit: (code: number, opts?: RuntimeExitOptions) => void;
};
//#endregion
//#region src/channels/plugins/setup-contract.d.ts
type ChannelSetupCliOption = {
  flags: string;
  negatedFlags?: string;
  description: string;
  defaultValue?: boolean | string;
};
type ChannelSetupField = {
  cli: ChannelSetupCliOption;
} & ({
  kind: "string";
  sensitive?: boolean;
} | {
  kind: "boolean";
  envVars?: readonly string[];
  envVarMode?: "all" | "any";
} | {
  kind: "integer";
} | {
  kind: "string-list";
  sensitive?: boolean;
} | {
  kind: "choice";
  choices: readonly string[];
});
type ChannelSetupFieldMetadata = ChannelSetupField & {
  key: string;
};
type ChannelSetupMetadata = {
  fields: readonly ChannelSetupFieldMetadata[];
};
//#endregion
//#region src/compat/legacy-names.d.ts
/** Canonical metadata key shared by package manifests and plugin catalogs. */
declare const MANIFEST_KEY: "openclaw";
//#endregion
//#region src/plugins/package-manifest.types.d.ts
/** package.json OpenClaw metadata used for plugin setup and catalog discovery. */
type PluginPackageChannel = {
  id?: string;
  label?: string;
  selectionLabel?: string;
  detailLabel?: string;
  docsPath?: string;
  docsLabel?: string;
  blurb?: string;
  order?: number;
  aliases?: readonly string[];
  preferOver?: readonly string[];
  systemImage?: string;
  selectionDocsPrefix?: string;
  selectionDocsOmitLabel?: boolean;
  selectionExtras?: readonly string[];
  markdownCapable?: boolean;
  /** Closed manifest flags for approval behavior available before the channel runtime loads. */
  approvalFlags?: readonly "native"[];
  exposure?: {
    configured?: boolean;
    setup?: boolean;
    docs?: boolean;
  };
  quickstartAllowFrom?: boolean;
  forceAccountBinding?: boolean;
  preferSessionLookupForAnnounceTarget?: boolean;
  commands?: PluginManifestChannelCommandDefaults;
  configuredState?: {
    specifier?: string;
    exportName?: string;
    env?: {
      allOf?: readonly string[];
      anyOf?: readonly string[];
    };
  };
  persistedAuthState?: {
    specifier?: string;
    exportName?: string;
    backingStore?: "plugin-state";
  };
  doctorCapabilities?: PluginPackageChannelDoctorCapabilities;
  /** Typed, serializable setup fields available before plugin runtime load. */
  setup?: ChannelSetupMetadata;
  /** @deprecated Use setup.fields. */
  cliAddOptions?: readonly PluginPackageChannelCliOption[];
};
type PluginPackageChannelDoctorCapabilities = {
  dmAllowFromMode?: "topOnly" | "topOrNested" | "nestedOnly";
  /** Whether dmPolicy="open" requires an explicit "*" in allowFrom. Defaults to true. */
  openDmRequiresAllowFromWildcard?: boolean;
  groupModel?: "sender" | "route" | "hybrid";
  groupAllowFromFallbackToAllowFrom?: boolean;
  warnOnEmptyGroupSenderAllowlist?: boolean;
};
type PluginPackageChannelCliOption = {
  flags: string;
  negatedFlags?: string;
  description: string;
  defaultValue?: boolean | string;
  valueType?: "int" | "list";
};
type PluginPackageInstall = {
  clawhubSpec?: string;
  npmSpec?: string;
  localPath?: string;
  defaultChoice?: "clawhub" | "npm" | "local";
  minHostVersion?: string;
  expectedIntegrity?: string;
  allowInvalidConfigRecovery?: boolean;
  requiredPlatformPackages?: string[];
};
type OpenClawPackageSetupFeatures = {
  configPromotion?: boolean | "preserve-root";
  /**
   * @deprecated Declare doctorContract.stateMigrations in openclaw.plugin.json instead.
   * Removal plan: remove the setup-entry adapter after the 2027.1 external-plugin migration window.
   */
  legacyStateMigrations?: boolean;
  legacySessionSurfaces?: boolean;
};
type OpenClawPackageCompat = {
  pluginApi?: string;
  minGatewayVersion?: string;
};
type OpenClawPackageBuild = {
  bundledDist?: boolean;
  openclawVersion?: string;
  pluginSdkVersion?: string;
};
type OpenClawPackageManifest = {
  extensions?: string[];
  runtimeExtensions?: string[];
  setupEntry?: string;
  runtimeSetupEntry?: string;
  controlUi?: string;
  setupFeatures?: OpenClawPackageSetupFeatures;
  plugin?: {
    id?: string;
    label?: string;
  };
  channel?: PluginPackageChannel;
  compat?: OpenClawPackageCompat;
  install?: PluginPackageInstall;
  build?: OpenClawPackageBuild;
};
type PackageManifest = {
  name?: string;
  version?: string;
  description?: string;
  dependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
} & Partial<Record<typeof MANIFEST_KEY, OpenClawPackageManifest>>;
//#endregion
//#region src/plugins/plugin-origin.types.d.ts
/** Origin class for plugin discovery and runtime trust decisions. */
type PluginOrigin = "bundled" | "global" | "workspace" | "config";
//#endregion
//#region src/plugins/status-dependencies.types.d.ts
/** Dependency name-to-version map from a plugin package manifest. */
type PluginDependencySpecMap = Record<string, string>;
//#endregion
//#region src/plugins/discovery.types.d.ts
/** One potential plugin root discovered before manifest validation and registry normalization. */
type PluginCandidate = {
  idHint: string;
  /** Discovery-owned identity for one entry in a multi-entry package pack. */
  effectivePluginId?: string;
  diagnosticIdHint?: string;
  source: string;
  setupSource?: string;
  rootDir: string;
  origin: PluginOrigin;
  /** Retains explicit load-path precedence when physical aliases merge their provenance. */
  configSelected?: true;
  /** An intentional source overlay must not execute its packaged peer. */
  sourcePreferred?: true;
  format?: PluginFormat;
  bundleFormat?: PluginBundleFormat;
  workspaceDir?: string;
  packageName?: string;
  packageVersion?: string;
  packageDescription?: string;
  packageDir?: string;
  packageManifest?: OpenClawPackageManifest;
  packageDependencies?: PluginDependencySpecMap;
  packageOptionalDependencies?: PluginDependencySpecMap;
  bundledManifestId?: string;
  bundledManifest?: PluginManifest;
  bundledManifestPath?: string;
  requiredPluginIds?: string[];
  requiredPluginSource?: string;
  rawPackageManifest?: PackageManifest;
};
/** Discovery candidates plus warnings/errors emitted while scanning roots. */
type PluginDiscoveryResult = {
  candidates: PluginCandidate[];
  diagnostics: PluginDiagnostic[];
};
//#endregion
//#region src/plugins/plugin-trust.d.ts
/** Captured beside the trust decision; consumers never rediscover installation facts. */
type PluginTrust = {
  reason: "bundled" | "trusted-official" | "record-missing" | "owner-ambiguous" | "origin-path" | "install-path-mismatch" | "provenance-missing" | "provenance-invalid";
  registryPath: string | null;
  origin: PluginOrigin | "unknown";
  installSource?: PluginInstallRecord["source"];
  installSpec?: string;
};
//#endregion
//#region src/plugins/manifest-registry.types.d.ts
type PluginManifestRecordStatic = Omit<PluginManifest, "capabilityCatalogEntry" | "channels" | "cliBackends" | "configSchema" | "enabledByDefaultOnPlatforms" | "providerCatalogEntry" | "providers" | "requiresPlugins" | "skills" | "uiHints">;
type PluginThemeArtwork = {
  hats?: Record<string, {
    svg: string;
  }>;
  critters?: Record<string, {
    svg: string;
    title?: string;
    crossMs?: number;
  }>;
};
type PluginManifestRecord = PluginManifestRecordStatic & {
  /** Validated palettes and artwork captured by the immutable metadata generation. */
  themeDefinitions?: Array<{
    id: string;
    definition: ThemeDefinition;
    artwork?: PluginThemeArtwork;
  }>;
  /** Process-local source selection, never persisted in the installed index. */
  sourcePreferred?: true;
  iconPath?: string;
  activityIconPath?: string;
  toolActivityIconPaths?: Record<string, string>;
  packageName?: string;
  packageVersion?: string;
  packageDescription?: string;
  enabledByDefaultOnPlatforms?: string[];
  format?: PluginFormat;
  bundleFormat?: PluginBundleFormat;
  bundleCapabilities?: string[];
  /** Packaged, plugin-relative setup skill; invoked only by an explicit user action. */
  onboardingSkill?: string;
  channels: string[];
  providers: string[];
  providerDiscoverySource?: string;
  /** Undefined is undeclared; null retains a rejected declaration without enabling full-entry fallback. */
  capabilityCatalogSource?: string | null;
  cliBackends: string[];
  packageManifest?: OpenClawPackageManifest;
  packageDependencies?: PluginDependencySpecMap;
  packageOptionalDependencies?: PluginDependencySpecMap;
  packageChannel?: PluginPackageChannel;
  packageInstall?: PluginPackageInstall;
  trustedOfficialInstall?: boolean;
  trust?: PluginTrust;
  skills: string[];
  settingsFiles?: string[];
  hooks: string[];
  origin: PluginOrigin;
  workspaceDir?: string;
  rootDir: string;
  source: string;
  setupSource?: string;
  manifestPath: string;
  schemaCacheKey?: string;
  configSchema?: Record<string, unknown>;
  configUiHints?: Record<string, PluginConfigUiHint>;
  channelCatalogMeta?: {
    id: string;
    label?: string;
    blurb?: string;
    preferOver?: readonly string[];
    commands?: PluginManifestChannelCommandDefaults;
  };
};
type PluginManifestRegistry = {
  plugins: PluginManifestRecord[];
  diagnostics: PluginDiagnostic[];
};
//#endregion
//#region src/wizard/prompts.d.ts
type WizardSelectOption<T = string> = {
  value: T;
  label: string;
  hint?: string;
};
type WizardPromptNavigation = {
  canGoBack?: boolean;
  canGoForward?: boolean;
};
type WizardSelectParams<T = string> = {
  message: string;
  options: Array<WizardSelectOption<T>>;
  initialValue?: T;
  searchable?: boolean;
  navigation?: WizardPromptNavigation;
};
type WizardMultiSelectParams<T = string> = {
  message: string;
  options: Array<WizardSelectOption<T>>;
  initialValues?: T[];
  searchable?: boolean;
  navigation?: WizardPromptNavigation;
};
type WizardTextParams = {
  message: string;
  initialValue?: string;
  placeholder?: string;
  validate?: (value: string) => string | undefined;
  signal?: AbortSignal;
  sensitive?: boolean;
  navigation?: WizardPromptNavigation;
};
type WizardConfirmParams = {
  message: string;
  initialValue?: boolean;
  layout?: "inline" | "vertical";
  navigation?: WizardPromptNavigation;
};
type WizardProgress = {
  update: (message: string) => void;
  stop: (message?: string) => void;
};
type WizardDeviceCodeParams = {
  title: string;
  code: string;
  expiresInMinutes?: number;
  message?: string;
};
type WizardPrompter = {
  /** End a hosted flow after a required choice is declined. */
  cancel?: (message: string) => never;
  intro: (title: string) => Promise<void>;
  outro: (message: string) => Promise<void>;
  note: (message: string, title?: string) => Promise<void>;
  /** Present a browser device code as structured UI when the client supports it. */
  deviceCode?: (params: WizardDeviceCodeParams) => Promise<void>;
  plain?: (message: string) => Promise<void>;
  select: <T>(params: WizardSelectParams<T>) => Promise<T>;
  multiselect: <T>(params: WizardMultiSelectParams<T>) => Promise<T[]>;
  text: (params: WizardTextParams) => Promise<string>;
  confirm: (params: WizardConfirmParams) => Promise<boolean>;
  progress: (label: string) => WizardProgress;
  /** Queue an explicit browser destination for the next client step or browser-wait progress. */
  openUrl?: (url: string) => Promise<void>;
  disableBackNavigation?: () => void;
};
//#endregion
//#region src/agents/tools/common.d.ts
type AgentToolWithMeta<TParameters extends TSchema, TResult> = AgentTool<TParameters, TResult> & {
  displaySummary?: string;
  /** Keep this tool model-visible; hidden catalog bridges cannot preserve its result contract. */
  catalogMode?: "direct-only";
  /** Gateway client capabilities required before this tool can be assembled. */
  requiredClientCaps?: string[];
  /** Tool-owned execution and transport wait budget, before any harness completion grace. */
  getExecutionTimeoutMs?: (args: unknown) => number | undefined;
  prepareBeforeToolCallParams?: (params: unknown, ctx: {
    toolCallId?: string;
    hookContext?: unknown;
    signal?: AbortSignal;
  }) => unknown;
  finalizeBeforeToolCallParams?: (params: unknown, preparedParams: unknown) => unknown;
};
type ErasedAgentToolExecute = {
  execute(this: void, toolCallId: string, params: unknown, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback): Promise<AgentToolResult<unknown>>;
};
type AnyAgentTool = Omit<AgentToolWithMeta<TSchema, unknown>, "execute"> & ErasedAgentToolExecute;
//#endregion
//#region src/infra/heartbeat-wake-contracts.d.ts
type HeartbeatRunResult = {
  status: "ran";
  durationMs: number;
} | {
  status: "skipped";
  reason: string;
  retryAtMs?: number;
} | {
  status: "failed";
  reason: string;
};
type HeartbeatWakeIntent = "scheduled" | "task" | "event" | "immediate" | "manual";
type HeartbeatWakeSource = "interval" | "manual" | "exec-event" | "notifications-event" | "cron" | "hook" | "background-task" | "background-task-blocked" | "acp-spawn" | "session-state" | "cli-watchdog" | "restart-sentinel" | "retry" | "other";
type HeartbeatWakeOverride = {
  target?: string;
  to?: string | undefined;
  accountId?: string | undefined;
};
/** Cron-owned periodic work carried directly into a guarded heartbeat turn. */
type HeartbeatScheduledTask = {
  jobId: string;
  name: string;
  prompt: string;
};
type HeartbeatWakeRequest = {
  source: HeartbeatWakeSource;
  intent: HeartbeatWakeIntent;
  reason?: string;
  agentId?: string;
  sessionKey?: string;
  sessionStorePath?: string | null;
  heartbeat?: HeartbeatWakeOverride;
  /** Persisted cron monitor cadence carried with a scheduled heartbeat tick. */
  scheduledEveryMs?: number;
  tasks?: readonly HeartbeatScheduledTask[];
  /** Internal marker for work retained after a spacing/cooldown deferral. */
  retainedWork?: boolean;
};
//#endregion
//#region src/infra/session-event-wake.d.ts
type SessionEventWakeResult = HeartbeatRunResult;
type SessionEventWakeRequest = HeartbeatWakeRequest;
type WakeHandler = (request: SessionEventWakeRequest, signal: AbortSignal) => Promise<SessionEventWakeResult>;
type SessionEventWakeWaitOptions = {
  abortSignal?: AbortSignal;
  /** Called when the queue starts an attempt for this waiter. */
  onAttemptStarted?: () => void;
  /** Called whenever this waiter enters the queue, including retained retries. */
  onQueued?: () => void;
  /** Detach this waiter while the queue retains the wake at its retry deadline. */
  stopWaitingOnRetry?: (result: Extract<SessionEventWakeResult, {
    status: "skipped";
  }>, retryAtMs: number) => boolean;
};
type RequestOptions = Omit<SessionEventWakeRequest, "retainedWork"> & {
  coalesceMs?: number;
};
declare const { setSessionEventWakeHandler, requestSessionEventWake, requestSessionEventWakeAndWait, getSessionEventWakeAbortSignal, markSessionEventWakeWorkStarted, deferSessionEventWakePoll, isSessionEventWakePollDeferred, areSessionEventWakesEnabled, setSessionEventWakesEnabled }: {
  setSessionEventWakeHandler: (next: WakeHandler | null) => () => void;
  requestSessionEventWake: (options: RequestOptions) => void;
  requestSessionEventWakeAndWait: (options: RequestOptions, lifecycle?: SessionEventWakeWaitOptions) => Promise<SessionEventWakeResult>;
  getSessionEventWakeAbortSignal: () => AbortSignal | undefined;
  markSessionEventWakeWorkStarted: () => void;
  deferSessionEventWakePoll: () => boolean;
  isSessionEventWakePollDeferred: () => boolean;
  areSessionEventWakesEnabled: () => boolean;
  setSessionEventWakesEnabled: (value: boolean) => void;
};
//#endregion
//#region src/infra/net/ssrf.d.ts
type SsrFPolicy = {
  allowPrivateNetwork?: boolean;
  dangerouslyAllowPrivateNetwork?: boolean;
  allowRfc2544BenchmarkRange?: boolean;
  /**
   * Exempt addresses in `fc00::/7` (IPv6 Unique Local Address block, RFC 4193)
   * from the SSRF private-IP block. Companion to
   * `allowRfc2544BenchmarkRange` for fake-ip proxy stacks (sing-box, Clash,
   * Surge) that resolve foreign domains to ULA addresses alongside the IPv4
   * 198.18.0.0/15 range. See #74351.
   */
  allowIpv6UniqueLocalRange?: boolean;
  allowedHostnames?: string[];
  /**
   * Exact HTTP origins that may promote only the current request hostname into
   * `allowedHostnames`. Evaluated per URL inside the redirect loop.
   */
  allowedOrigins?: string[];
  hostnameAllowlist?: string[];
  /** Deny exact hosts or wildcard subdomains; "*.example.com" excludes the apex. */
  blockedHostnames?: string[];
};
//#endregion
//#region src/image-generation/types.d.ts
/** Non-empty binary image asset returned by an image-generation provider. */
type GeneratedImageAsset = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  revisedPrompt?: string;
  metadata?: Record<string, unknown>;
};
type ImageGenerationResolution = "1K" | "2K" | "4K";
type ImageGenerationQuality = "low" | "medium" | "high" | "xhigh" | "max" | "auto";
type ImageGenerationOutputFormat = "png" | "jpeg" | "webp";
type ImageGenerationBackground = "transparent" | "opaque" | "auto";
type ImageGenerationOpenAIBackground = ImageGenerationBackground;
type ImageGenerationOpenAIModeration = "low" | "auto";
type ImageGenerationOpenAIOptions = {
  background?: ImageGenerationOpenAIBackground;
  moderation?: ImageGenerationOpenAIModeration;
  outputCompression?: number;
  user?: string;
};
type ImageGenerationProviderOptions = Record<string, unknown> & {
  openai?: ImageGenerationOpenAIOptions;
};
type ImageGenerationSourceImage = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};
type ImageGenerationProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  agentDir?: string;
};
/** Runtime request passed to an image-generation provider implementation. */
type ImageGenerationRequest = {
  provider: string;
  model: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
  count?: number;
  size?: string;
  aspectRatio?: string;
  resolution?: ImageGenerationResolution;
  quality?: ImageGenerationQuality;
  outputFormat?: ImageGenerationOutputFormat;
  background?: ImageGenerationBackground;
  inputImages?: ImageGenerationSourceImage[];
  providerOptions?: ImageGenerationProviderOptions;
  ssrfPolicy?: SsrFPolicy;
};
type ImageGenerationResult = {
  images: GeneratedImageAsset[];
  model?: string;
  metadata?: Record<string, unknown>;
};
type ImageGenerationModeCapabilities = {
  maxCount?: number;
  supportsSize?: boolean;
  supportsAspectRatio?: boolean;
  supportsResolution?: boolean;
};
type ImageGenerationEditCapabilities = ImageGenerationModeCapabilities & {
  enabled: boolean;
  maxInputImages?: number;
  maxInputImagesByModel?: Readonly<Record<string, number>>;
  maxInputImagesByModelPrefix?: Readonly<Record<string, number>>;
};
type ImageGenerationGeometryCapabilities = {
  sizes?: string[];
  sizesByModel?: Record<string, string[]>;
  aspectRatios?: string[];
  aspectRatiosByModel?: Record<string, string[]>;
  resolutions?: ImageGenerationResolution[];
  resolutionsByModel?: Record<string, ImageGenerationResolution[]>;
};
type ImageGenerationOutputCapabilities = {
  qualities?: ImageGenerationQuality[];
  qualitiesByModel?: Record<string, ImageGenerationQuality[]>;
  formats?: ImageGenerationOutputFormat[];
  formatsByModel?: Record<string, ImageGenerationOutputFormat[]>;
  backgrounds?: ImageGenerationBackground[];
  backgroundsByModel?: Record<string, ImageGenerationBackground[]>;
};
type ImageGenerationProviderCapabilities = {
  generate: ImageGenerationModeCapabilities;
  edit: ImageGenerationEditCapabilities;
  geometry?: ImageGenerationGeometryCapabilities;
  output?: ImageGenerationOutputCapabilities;
};
type ImageGenerationProvider = {
  id: string;
  aliases?: string[];
  label?: string;
  defaultModel?: string;
  /** Default provider operation timeout in milliseconds when caller/config omit timeoutMs. */
  defaultTimeoutMs?: number;
  models?: string[];
  capabilities: ImageGenerationProviderCapabilities;
  isConfigured?: (ctx: ImageGenerationProviderConfiguredContext) => boolean;
  generateImage: (req: ImageGenerationRequest) => Promise<ImageGenerationResult>;
};
//#endregion
//#region src/music-generation/types.d.ts
/**
 * Public music generation provider contracts.
 *
 * Providers implement these request/result/capability shapes so the core
 * runtime can normalize prompts, options, assets, and fallback diagnostics.
 */
/** Audio output formats currently understood by music generation providers. */
type MusicGenerationOutputFormat = "mp3" | "wav";
/** Non-empty in-memory audio asset returned from a music generation provider. */
type GeneratedMusicAsset = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};
/** Optional source image passed to image-conditioned music edit models. */
type MusicGenerationSourceImage = {
  url?: string;
  buffer?: Buffer;
  mimeType?: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};
type MusicGenerationProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  agentDir?: string;
};
/** Provider request after runtime fallback and override normalization. */
type MusicGenerationRequest = {
  provider: string;
  model: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
  lyrics?: string;
  instrumental?: boolean;
  durationSeconds?: number;
  format?: MusicGenerationOutputFormat;
  inputImages?: MusicGenerationSourceImage[];
};
/** Provider result before runtime fallback metadata is attached. */
type MusicGenerationResult = {
  tracks: GeneratedMusicAsset[];
  model?: string;
  lyrics?: string[];
  metadata?: Record<string, unknown>;
};
/** Capability block for prompt-only music generation. */
type MusicGenerationModeCapabilities = {
  maxTracks?: number;
  maxDurationSeconds?: number;
  supportsLyrics?: boolean;
  supportsLyricsByModel?: Readonly<Record<string, boolean>>;
  supportsInstrumental?: boolean;
  supportsInstrumentalByModel?: Readonly<Record<string, boolean>>;
  supportsDuration?: boolean;
  supportsFormat?: boolean;
  supportedFormats?: readonly MusicGenerationOutputFormat[];
  supportedFormatsByModel?: Readonly<Record<string, readonly MusicGenerationOutputFormat[]>>;
};
/** Capability block for image-conditioned music generation. */
type MusicGenerationEditCapabilities = MusicGenerationModeCapabilities & {
  enabled: boolean;
  maxInputImages?: number;
};
/** Provider capability declaration, including optional mode-specific overrides. */
type MusicGenerationProviderCapabilities = MusicGenerationModeCapabilities & {
  maxInputImages?: number;
  generate?: MusicGenerationModeCapabilities;
  edit?: MusicGenerationEditCapabilities;
};
/** Provider implementation contract consumed by the music generation runtime. */
type MusicGenerationProvider = {
  id: string;
  aliases?: string[];
  label?: string;
  defaultModel?: string;
  models?: string[];
  capabilities: MusicGenerationProviderCapabilities;
  isConfigured?: (ctx: MusicGenerationProviderConfiguredContext) => boolean;
  generateMusic: (req: MusicGenerationRequest) => Promise<MusicGenerationResult>;
};
//#endregion
//#region src/tts/provider-types.d.ts
/** Canonical speech provider identifier after provider registry normalization. */
type SpeechProviderId = string;
/** Output context requested from a speech provider. */
type SpeechSynthesisTarget = "audio-file" | "voice-note" | "telephony";
/** Provider-owned normalized config map. */
type SpeechProviderConfig = Record<string, unknown>;
/** Provider-owned per-request directive/persona overrides. */
type SpeechProviderOverrides = Record<string, unknown>;
/** Policy controlling which [[tts:*]] directive fields can affect synthesis. */
type SpeechModelOverridePolicy = {
  enabled: boolean;
  allowText: boolean;
  allowProvider: boolean;
  allowVoice: boolean;
  allowModelId: boolean;
  allowVoiceSettings: boolean;
  allowNormalization: boolean;
  allowSeed: boolean;
};
/** Context for checking whether a provider has enough config to synthesize. */
type SpeechProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  timeoutMs: number;
};
/** Request for buffered speech synthesis. */
type SpeechSynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  target: SpeechSynthesisTarget;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};
/** Buffered speech synthesis result plus file/voice-note compatibility metadata. */
type SpeechSynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
};
type SpeechSynthesisStreamRequest = SpeechSynthesisRequest;
/** Streaming speech synthesis result; release frees provider transport resources. */
type SpeechSynthesisStreamResult = Omit<SpeechSynthesisResult, "audioBuffer"> & {
  audioStream: ReadableStream<Uint8Array>;
  release?: () => Promise<void>;
};
/** Telephony synthesis request for provider output that needs a fixed sample rate. */
type SpeechTelephonySynthesisRequest = Omit<SpeechSynthesisRequest, "target">;
/** Telephony synthesis result with sample-rate metadata for call transports. */
type SpeechTelephonySynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  sampleRate: number;
};
/** Provider hook input for applying persona/config before synthesis. */
type SpeechProviderPrepareSynthesisContext = SpeechSynthesisRequest & {
  persona?: ResolvedTtsPersona;
  personaProviderConfig?: SpeechProviderConfig;
};
/** Optional provider-prepared synthesis overrides. */
type SpeechProviderPreparedSynthesis = {
  text?: string;
  providerConfig?: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
};
/** Voice metadata returned by provider list-voices hooks. */
type SpeechVoiceOption = {
  id: string;
  name?: string;
  category?: string;
  description?: string;
  locale?: string;
  gender?: string;
  personalities?: string[];
};
/** Provider voice-listing request with optional direct auth/URL overrides. */
type SpeechListVoicesRequest = {
  cfg?: OpenClawConfig;
  providerConfig?: SpeechProviderConfig;
  apiKey?: string;
  baseUrl?: string;
  /** Core-resolved request timeout after config and provider defaults. */
  timeoutMs?: number;
};
/** Provider hook input for resolving normalized config from raw OpenClaw config. */
type SpeechProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: Record<string, unknown>;
  timeoutMs: number;
};
/** One parsed directive key/value plus current provider override state. */
type SpeechDirectiveTokenParseContext = {
  key: string;
  value: string;
  policy: SpeechModelOverridePolicy;
  selectedProvider?: SpeechProviderId;
  providerConfig?: SpeechProviderConfig;
  currentOverrides?: SpeechProviderOverrides;
};
/** Provider directive parser result. */
type SpeechDirectiveTokenParseResult = {
  handled: boolean;
  overrides?: SpeechProviderOverrides;
  warnings?: string[];
};
/** Provider hook input for resolving talk-command speech config. */
type SpeechProviderResolveTalkConfigContext = {
  cfg: OpenClawConfig;
  baseTtsConfig: Record<string, unknown>;
  talkProviderConfig: TalkProviderConfig;
  timeoutMs: number;
};
/** Provider hook input for per-call talk-command overrides. */
type SpeechProviderResolveTalkOverridesContext = {
  talkProviderConfig: TalkProviderConfig;
  params: Record<string, unknown>;
};
//#endregion
//#region src/plugins/capability-provider.types.d.ts
/** Speech capability registered by a plugin. */
type SpeechProviderPlugin = {
  id: SpeechProviderId;
  label: string;
  aliases?: string[];
  autoSelectOrder?: number;
  /** Default provider operation timeout in milliseconds when caller/config omit timeoutMs. */
  defaultTimeoutMs?: number;
  defaultModel?: string;
  models?: readonly string[];
  voices?: readonly string[];
  resolveConfig?: (ctx: SpeechProviderResolveConfigContext) => SpeechProviderConfig;
  parseDirectiveToken?: (ctx: SpeechDirectiveTokenParseContext) => SpeechDirectiveTokenParseResult;
  resolveTalkConfig?: (ctx: SpeechProviderResolveTalkConfigContext) => SpeechProviderConfig;
  resolveTalkOverrides?: (ctx: SpeechProviderResolveTalkOverridesContext) => SpeechProviderConfig | undefined;
  prepareSynthesis?: (ctx: SpeechProviderPrepareSynthesisContext) => SpeechProviderPreparedSynthesis | undefined | Promise<SpeechProviderPreparedSynthesis | undefined>;
  isConfigured: (ctx: SpeechProviderConfiguredContext) => boolean;
  synthesize: (req: SpeechSynthesisRequest) => Promise<SpeechSynthesisResult>;
  streamSynthesize?: (req: SpeechSynthesisStreamRequest) => Promise<SpeechSynthesisStreamResult>;
  synthesizeTelephony?: (req: SpeechTelephonySynthesisRequest) => Promise<SpeechTelephonySynthesisResult>;
  listVoices?: (req: SpeechListVoicesRequest) => Promise<SpeechVoiceOption[]>;
};
//#endregion
//#region src/gateway/worker-environments/workspace-hash-memo.d.ts
declare const { workspaceStatIdentity, selectWorkerWorkspaceHashMemoEntries }: {
  workspaceStatIdentity: (owner: "gateway" | "worker", stats: {
    dev: bigint;
    ino: bigint;
    size: bigint;
    mtimeNs: bigint;
    ctimeNs: bigint;
  }) => string;
  selectWorkerWorkspaceHashMemoEntries: (memo: ReadonlyMap<string, string>, maxEntries: number, maxBytes: number) => Array<[string, string]>;
};
//#endregion
//#region src/media/staged-inputs.d.ts
declare const { stagedInputPathDirectory, isStagedInputPath, stagedInputDirectoriesFromEntries }: {
  stagedInputPathDirectory: (relativePath: string) => string | undefined;
  isStagedInputPath: (relativePath: string, directories: ReadonlySet<string>) => boolean;
  stagedInputDirectoriesFromEntries: (entries: readonly {
    path: string;
    type: string;
    size?: number;
    sha256?: string;
  }[]) => Set<string>;
};
//#endregion
//#region src/plugins/compat/registry-records.d.ts
declare const PLUGIN_COMPAT_RECORDS: readonly [{
  readonly code: "mention-inbox-sync-persistence";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-03";
  readonly deprecated: "2026-10-03";
  readonly warningStarts: "2026-10-03";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Await mentionInbox.listAsync(client, publish), mentionInbox.dismissAsync(client, ids, publish), mentionInbox.recordCommittedInputAsync(input), and mentionInbox.invalidateAsync(sessionKey). Publish list/dismiss responses synchronously inside the supplied callback. Retain synchronous methods only for shipped third-party contracts until the next Plugin SDK major and explicit breaking-release approval.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-mention-inbox-operations";
  readonly surfaces: readonly ["GatewayRequestHandlerOptions.context.mentionInbox.list", "GatewayRequestHandlerOptions.context.mentionInbox.dismiss", "GatewayRequestHandlerOptions.context.mentionInbox.recordCommittedInput", "GatewayRequestHandlerOptions.context.mentionInbox.invalidate", "getPluginRuntimeGatewayRequestScope().context.mentionInbox"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and one DEP_SESSION_PERSISTENCE warning per plugin and method per process; unscoped callers warn once per method"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugins/compat/mention-inbox-deprecation.test.ts", "src/plugin-sdk/gateway-mention-inbox-compat.test.ts", "src/gateway/mention-inbox.test.ts", "src/gateway/mention-inbox.compat.test.ts"];
  readonly releaseNote: "Mention Inbox reads, dismissals, recording, and invalidation expose awaited worker-backed methods. Synchronous plugin methods retain their existing return values and completion timing until the next Plugin SDK major; stored data, retention, and update behavior are unchanged.";
}, {
  readonly code: "workspace-mutation-guard-callback";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-02";
  readonly deprecated: "2026-10-02";
  readonly warningStarts: "2026-10-02";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Await database preparation before ensureAgentWorkspace and use SQL-free guard.assertHost for live authority. Internal recovery predicates run on the worker transaction connection.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#workspace-mutation-guards";
  readonly surfaces: readonly ["api.runtime.agent.ensureAgentWorkspace.beforePersistentApply"];
  readonly diagnostics: readonly ["@deprecated JSDoc and one DEP_WORKSPACE_MUTATION_GUARD warning per process", "Warning explains before-dispatch timing and deprecated but allowed synchronous OpenClaw DB access"];
  readonly tests: readonly ["src/plugins/runtime/runtime-agent.workspace.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Released callbacks and their synchronous OpenClaw DB access remain supported. The legacy check runs once before worker dispatch, outside admission grants; use the typed guard for live revocation at commit. Removal requires the next Plugin SDK major.";
}, {
  readonly code: "native-session-generation-sync-authority";
  readonly status: "deprecated";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-09-22";
  readonly deprecated: "2026-10-03";
  readonly warningStarts: "2026-10-03";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Await prepareNativeSessionGenerationAuthority, resolveNativeSessionBindingWithAuthority, and reclaimNativeSessionGenerationWithAuthority with NativeSessionGenerationOperationsV2. Retain released synchronous capture and two-argument mutation callbacks until published official harness readers migrate and a breaking release is explicitly approved.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#native-session-generation-authority";
  readonly surfaces: readonly ["captureNativeSessionGenerationAuthority", "resolveNativeSessionBinding", "reclaimNativeSessionGeneration", "NativeSessionGenerationOperations"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and migration documentation; no runtime warnings"];
  readonly tests: readonly ["src/plugin-sdk/agent-harness-session-compat.test.ts", "src/agents/harness/native-session/binding-generation.test.ts", "src/agents/harness/native-session/binding-generation-authority.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Native harnesses can admit binding operations through worker-backed session authority. Released official harness plugins retain synchronous authority capture and lineage-checking mutation callbacks across host upgrades.";
}, {
  readonly code: "session-manager-sync-persistence";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-01";
  readonly deprecated: "2026-10-01";
  readonly warningStarts: "2026-10-01";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Await the matching Async-suffixed SessionManager method, including the returned rewrite commit. Retain synchronous adapters only for shipped third-party contracts until the next Plugin SDK major and explicit breaking-release approval.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-session-transcript-persistence";
  readonly surfaces: readonly ["SessionManager.appendMessage", "SessionManager.appendMessageWithTranscriptAnchor", "SessionManager.appendCompaction", "SessionManager.appendResetBoundary", "SessionManager.appendCustomEntry", "SessionManager.appendSessionInfo", "SessionManager.appendCustomMessageEntry", "SessionManager.appendLeafControl", "SessionManager.appendLabelChange", "SessionManager.branch", "SessionManager.branchWithSummary", "SessionManager.removeTrailingEntries", "SessionManager.persist", "SessionManager.prepareTranscriptRewrite", "SessionManager.appendMessageToTranscript", "SessionManager.open", "SessionManager.openBounded", "SessionManager.openDetachedBounded", "SessionManager.openModelContext", "SessionManager.setSessionTarget", "SessionManager.reloadPersistedTranscript"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming awaited twins", "one runtime DEP_SESSION_PERSISTENCE warning per method per process"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/agents/sessions/session-manager-async-entries.test.ts", "src/agents/sessions/session-manager-async-message.test.ts", "src/agents/sessions/session-manager-maintenance-async.test.ts"];
  readonly releaseNote: "Plugins can await SessionManager transcript mutations through the existing SQLite worker. Synchronous methods retain their shipped return values as deprecated third-party adapters until the next Plugin SDK major; storage formats and update behavior are unchanged.";
}, {
  readonly code: "extension-session-sync-persistence";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-01";
  readonly deprecated: "2026-10-01";
  readonly warningStarts: "2026-10-01";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Await ExtensionAPI.appendEntryAsync, setSessionNameAsync, and setLabelAsync, and AgentSession.setSessionNameAsync. Existing synchronous third-party methods retain their void return contract until the next Plugin SDK major and explicit breaking-release approval.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-extension-session-changes";
  readonly surfaces: readonly ["ExtensionAPI.appendEntry", "ExtensionAPI.setSessionName", "ExtensionAPI.setLabel", "AgentSession.setSessionName"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations, migration guide, and once-per-method DEP_SESSION_PERSISTENCE warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/agents/sessions/sdk.metadata-admission.test.ts"];
  readonly releaseNote: "Extensions can await transcript entries, session names, and labels; the shipped synchronous methods remain third-party compatibility adapters through the next Plugin SDK major.";
}, {
  readonly code: "provider-replay-sync-persistence";
  readonly status: "deprecated";
  readonly owner: "provider";
  readonly introduced: "2026-10-01";
  readonly deprecated: "2026-10-01";
  readonly warningStarts: "2026-10-01";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Use ProviderPlugin.sanitizeReplayHistoryAsync with ProviderSanitizeReplayHistoryContextV2 and await ProviderReplaySessionStateV2.appendCustomEntryAsync; use sanitizeGoogleGeminiReplayHistoryAsync for the shared Gemini implementation. Retain legacy third-party contexts and hooks until the next Plugin SDK major and explicit breaking-release approval.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-provider-replay-metadata";
  readonly surfaces: readonly ["ProviderPlugin.sanitizeReplayHistory", "ProviderReplaySessionState.appendCustomEntry", "sanitizeGoogleGeminiReplayHistory"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations, versioned migration guide, and once-per-method DEP_SESSION_PERSISTENCE warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugins/provider-replay-helpers.test.ts", "src/plugins/provider-runtime.test.ts", "src/plugin-sdk/provider-model-shared.test.ts"];
  readonly releaseNote: "Provider replay hooks can await committed transcript metadata through additive V2 context types. Legacy hooks, context types, and the synchronous Gemini helper remain available for third-party migration through the next Plugin SDK major.";
}, {
  readonly code: "agent-list-runtime-projection";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-07-27";
  readonly deprecated: "2026-10-02";
  readonly warningStarts: "2026-10-02";
  readonly removeAfter: "2027-01-02";
  readonly replacement: "Canonical `cfg.agents.entries`, or `listAgentIds` / `resolveAgentConfig` from `openclaw/plugin-sdk/agent-runtime`";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#agent-roster-config";
  readonly surfaces: readonly ["non-enumerable runtime OpenClawConfig.agents.list projection"];
  readonly diagnostics: readonly ["plugin compatibility registry and migration documentation; no runtime warnings"];
  readonly tests: readonly ["src/config/runtime-overrides.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The runtime agents.list projection introduced in #113146 remains untyped compatibility for plugins built against stable SDK releases through 2026.9.x; authored configs use agents.entries without default markers.";
}, {
  readonly code: "watched-sessions-sync-harness-context";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-07-29";
  readonly deprecated: "2026-10-03";
  readonly warningStarts: "2026-10-03";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Await prepareWatchedSessionsHarnessContext with an assertCurrent callback bound to the current host capability. The released buildWatchedSessionsHarnessContext retains its synchronous string-or-undefined result until the next Plugin SDK major and explicit breaking-release approval.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#watched-session-harness-context";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-harness-runtime.buildWatchedSessionsHarnessContext"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and migration documentation; no runtime warnings"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugin-sdk/agent-harness-runtime-watched-sessions.test.ts", "src/agents/watched-sessions-prompt.test.ts"];
  readonly releaseNote: "Harness plugins can await watched-session prompt preparation from worker reads. Bundled harnesses use the awaited helper; the synchronous SDK result remains supported for third-party plugins. Prompt bytes, stored data, and update behavior are unchanged.";
}, {
  readonly code: "gateway-placement-sync-results";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-09-07";
  readonly deprecated: "2026-10-02";
  readonly warningStarts: "2026-10-02";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Await listPendingWorkspaceResultsAsync, getWorkspaceResultReconcilingSessionIdsAsync, and deferOrphanedRequestsAsync on the Gateway context. Released synchronous methods retain their return values and completion timing until the next Plugin SDK major and explicit breaking-release approval.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#gateway-placement-and-publication-readers";
  readonly surfaces: readonly ["GatewayRequestHandlerOptions.context.workerSessionPlacementService.listPendingWorkspaceResults", "GatewayRequestHandlerOptions.context.workerSessionPlacementService.getWorkspaceResultReconcilingSessionIds", "GatewayRequestHandlerOptions.context.githubPublicationService.deferOrphanedRequests", "getPluginRuntimeGatewayRequestScope().context"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and migration documentation; no runtime warnings"];
  readonly tests: readonly ["src/plugin-sdk/gateway-placement-compat.test.ts", "src/gateway/worker-environments/placement-store.test.ts", "src/gateway/github-publication-boundaries.test.ts", "src/gateway/github-repository-publication.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Placement result readers and GitHub orphan deferral expose awaited methods while retaining the synchronous Gateway-context contracts shipped to plugins in 2026.9.7. Internal placement readers use the SQLite worker; stored data and update behavior are unchanged.";
}, {
  readonly code: "memory-session-sync-inventory";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-08-09";
  readonly deprecated: "2026-10-01";
  readonly warningStarts: "2026-10-01";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Await loadArchivedSessionsAsync and resolveMemorySessionTargetsAsync from memory-core-host-engine-sessions. Synchronous readers retain their existing signatures and results until the next Plugin SDK major.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#memory-session-inventory-readers";
  readonly surfaces: readonly ["loadArchivedSessions", "resolveMemorySessionTargets"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and migration documentation; no runtime warnings"];
  readonly tests: readonly ["src/plugin-sdk/memory-core-host-engine-sessions.test.ts", "src/plugins/compat/registry.test.ts", "extensions/memory-core/src/memory-forget.participants.test.ts"];
  readonly releaseNote: "Memory archive discovery and forget target selection can be awaited through worker-backed SDK readers; synchronous readers remain compatible until the next Plugin SDK major.";
}, {
  readonly code: "channel-webhook-listener-config-inputs";
  readonly status: "deprecated";
  readonly owner: "config";
  readonly introduced: "2026-09-26";
  readonly deprecated: "2026-09-26";
  readonly warningStarts: "2026-09-26";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Use legacyWebhook for canonical listener config. Doctor migrates stored webhookPort/webhookHost and webhook.port inputs; deprecated optional TypeScript properties preserve config producer source compatibility until an approved SDK major removal.";
  readonly docsPath: "/gateway/doctor/config-migrations#channel-webhook-listeners";
  readonly surfaces: readonly ["TelegramAccountConfig.webhookPort", "TelegramAccountConfig.webhookHost", "FeishuConfig.webhookPort", "FeishuConfig.webhookHost", "FeishuAccountConfig.webhookPort", "FeishuAccountConfig.webhookHost", "MSTeamsWebhookConfig.port", "NextcloudTalkAccountConfig.webhookPort", "NextcloudTalkAccountConfig.webhookHost"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and plugin-owned Doctor migration"];
  readonly tests: readonly ["extensions/telegram/src/doctor.test.ts", "extensions/feishu/src/doctor-contract.test.ts", "extensions/msteams/config-doctor-api.test.ts", "extensions/nextcloud-talk/src/doctor-contract.test.ts"];
}, {
  readonly code: "conversation-binding-sync-mutations";
  readonly status: "deprecated";
  readonly owner: "channel";
  readonly introduced: "2026-09-20";
  readonly deprecated: "2026-09-20";
  readonly warningStarts: "2026-09-20";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Await getSessionBindingService().inspectByConversationAsync, resolveByConversationAsync, touchAsync, resolveRuntimeConversationBindingRouteAsync, and the Async-suffixed thread-binding lifecycle setters. Project prepared inspection facts with inspectRuntimeConversationBindingRoute. Async dispatch retains an explicit synchronous fallback for legacy external adapters; remaining bind/unbind and other storage operations are separate migration work.";
  readonly docsPath: "/plugins/sdk-runtime/channel#awaited-conversation-binding-mutations";
  readonly surfaces: readonly ["SessionBindingService.touch", "SessionBindingService.resolveByConversation", "SessionBindingAdapter.touch", "SessionBindingAdapter.resolveByConversation", "resolveRuntimeConversationBindingRoute", "ChannelConversationBindingSupport.setIdleTimeoutBySessionKey", "ChannelConversationBindingSupport.setMaxAgeBySessionKey", "api.runtime.channel.threadBindings.setIdleTimeoutBySessionKey", "api.runtime.channel.threadBindings.setMaxAgeBySessionKey"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on synchronous methods; resolver migration is recorded here and in docs while its broad barrel remains deprecated; no runtime warnings"];
  readonly tests: readonly ["src/infra/outbound/session-binding-service.test.ts", "src/channels/plugins/binding-routing.test.ts", "src/channels/plugins/conversation-bindings.test.ts"];
  readonly releaseNote: "Plugins can expose explicitly awaited binding mutations and pure ownership inspection; synchronous public methods remain supported while callers and persistence owners migrate.";
}, ...({
  code: "plugin-sdk-agent-config-primitives-subpath" | "plugin-sdk-channel-lifecycle-subpath" | "plugin-sdk-channel-logging-subpath" | "plugin-sdk-channel-message-subpath" | "plugin-sdk-channel-reply-pipeline-subpath" | "plugin-sdk-channel-secret-runtime-subpath" | "plugin-sdk-channel-streaming-subpath" | "plugin-sdk-config-runtime-subpath" | "plugin-sdk-group-access-subpath" | "plugin-sdk-inbound-reply-dispatch-subpath" | "plugin-sdk-infra-runtime-subpath" | "plugin-sdk-matrix-subpath" | "plugin-sdk-text-runtime-subpath" | "plugin-sdk-zod-subpath";
  owner: "channel" | "config" | "sdk";
  introduced: string;
  replacement: "`api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`" | "`openclaw/plugin-sdk/channel-config-schema`" | "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`" | "`openclaw/plugin-sdk/channel-ingress-runtime`" | "`openclaw/plugin-sdk/channel-outbound`" | "`openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`" | "`openclaw/plugin-sdk/channel-secret-basic-runtime` and `openclaw/plugin-sdk/channel-secret-tts-runtime`" | "`openclaw/plugin-sdk/logging-core`, `openclaw/plugin-sdk/text-chunking`, `openclaw/plugin-sdk/text-utility-runtime`, and `openclaw/plugin-sdk/string-coerce-runtime`" | "`openclaw/plugin-sdk/run-command`" | "focused typed subpaths including `openclaw/plugin-sdk/system-event-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/approval-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`; use injected runtime APIs for host operations without a public subpath" | "the direct `zod` package import";
  docsPath: string;
  surfaces: string[];
  tests: string[];
  status: "removed";
  diagnostics: string[];
  releaseNote: "The deprecated `agent-config-primitives` Plugin SDK subpath was removed; plugins now use maintained config-schema primitives." | "The deprecated `channel-lifecycle` Plugin SDK facade was removed by the approved September 30 retirement; migrate to `openclaw/plugin-sdk/channel-outbound`." | "The deprecated `channel-logging` Plugin SDK subpath was removed; channel logging helpers now come from the inbound and outbound channel surfaces." | "The deprecated `channel-message` Plugin SDK facade was removed by the approved September 30 retirement; migrate to `openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`." | "The deprecated `channel-reply-pipeline` Plugin SDK facade was removed by the approved September 30 retirement; migrate to `openclaw/plugin-sdk/channel-outbound`." | "The deprecated `channel-secret-runtime` Plugin SDK subpath was removed; plugins now use the focused basic and TTS secret-runtime subpaths." | "The deprecated `channel-streaming` Plugin SDK subpath was removed; plugins now import channel streaming helpers from `channel-outbound`." | "The deprecated `config-runtime` Plugin SDK facade was removed by the approved September 30 retirement; migrate to `api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`." | "The deprecated `group-access` Plugin SDK subpath was removed; plugins now resolve message admission through `channel-ingress-runtime`." | "The deprecated `infra-runtime` Plugin SDK facade was removed by the approved September 30 retirement; migrate to focused typed subpaths including `openclaw/plugin-sdk/system-event-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/approval-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`; use injected runtime APIs for host operations without a public subpath." | "The deprecated `matrix` Plugin SDK facade was removed; command execution now uses the generic `run-command` subpath." | "The deprecated `text-runtime` Plugin SDK facade was removed; plugins now import logging, chunking, text utility, and string coercion helpers from their focused subpaths." | "The deprecated `zod` Plugin SDK re-export was removed; plugins now import `zod` directly.";
} | {
  code: "plugin-sdk-agent-config-primitives-subpath" | "plugin-sdk-channel-lifecycle-subpath" | "plugin-sdk-channel-logging-subpath" | "plugin-sdk-channel-message-subpath" | "plugin-sdk-channel-reply-pipeline-subpath" | "plugin-sdk-channel-secret-runtime-subpath" | "plugin-sdk-channel-streaming-subpath" | "plugin-sdk-config-runtime-subpath" | "plugin-sdk-group-access-subpath" | "plugin-sdk-inbound-reply-dispatch-subpath" | "plugin-sdk-infra-runtime-subpath" | "plugin-sdk-matrix-subpath" | "plugin-sdk-text-runtime-subpath" | "plugin-sdk-zod-subpath";
  owner: "channel" | "config" | "sdk";
  introduced: string;
  replacement: "`api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`" | "`openclaw/plugin-sdk/channel-config-schema`" | "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`" | "`openclaw/plugin-sdk/channel-ingress-runtime`" | "`openclaw/plugin-sdk/channel-outbound`" | "`openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`" | "`openclaw/plugin-sdk/channel-secret-basic-runtime` and `openclaw/plugin-sdk/channel-secret-tts-runtime`" | "`openclaw/plugin-sdk/logging-core`, `openclaw/plugin-sdk/text-chunking`, `openclaw/plugin-sdk/text-utility-runtime`, and `openclaw/plugin-sdk/string-coerce-runtime`" | "`openclaw/plugin-sdk/run-command`" | "focused typed subpaths including `openclaw/plugin-sdk/system-event-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/approval-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`; use injected runtime APIs for host operations without a public subpath" | "the direct `zod` package import";
  docsPath: string;
  surfaces: string[];
  tests: string[];
  status: "deprecated" | "removed";
  deprecated: string;
  warningStarts: string;
  removalGate: "next-plugin-sdk-major" | undefined;
  diagnostics: string[];
} | {
  status: "removal-pending";
  removeAfter: "2026-09-30";
  replacement: "`api.registerMediaUnderstandingProvider(...)` with provider-owned request helpers and types from `openclaw/plugin-sdk/plugin-entry`; retain the public subpath through the 2026-09-30 window while official plugin consumers migrate";
  docsPath: "/plugins/architecture";
  code: "plugin-sdk-media-understanding-public-demotion" | "plugin-sdk-memory-host-core-public-demotion" | "plugin-sdk-plugin-config-runtime-public-demotion" | "plugin-sdk-tool-plugin-public-demotion";
  owner: "sdk";
  introduced: string;
  deprecated: string;
  warningStarts: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
} | {
  status: "removal-pending";
  removeAfter: "2026-09-30";
  replacement: "host-prepared memory prompts via `openclaw/plugin-sdk/core` and memory capability registration through the injected plugin API; retain the facade through the 2026-09-30 window and until a focused public-artifact read seam exists";
  docsPath: "/plugins/architecture-internals#context-engine-plugins";
  code: "plugin-sdk-media-understanding-public-demotion" | "plugin-sdk-memory-host-core-public-demotion" | "plugin-sdk-plugin-config-runtime-public-demotion" | "plugin-sdk-tool-plugin-public-demotion";
  owner: "sdk";
  introduced: string;
  deprecated: string;
  warningStarts: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
} | {
  status: "removal-pending";
  removeAfter: "2026-12-01";
  replacement: "`api.pluginConfig`, runtime tool context config, and focused `config-contracts`, `runtime-config-snapshot`, or `config-mutation` subpaths; retain the public subpath through the 2026-12-01 window while official plugin consumers migrate";
  docsPath: "/plugins/sdk-runtime";
  code: "plugin-sdk-media-understanding-public-demotion" | "plugin-sdk-memory-host-core-public-demotion" | "plugin-sdk-plugin-config-runtime-public-demotion" | "plugin-sdk-tool-plugin-public-demotion";
  owner: "sdk";
  introduced: string;
  deprecated: string;
  warningStarts: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
} | {
  status: "deprecated";
  replacement: "retain the public subpath until plugin authoring has a nonexecuting static metadata replacement for `defineToolPlugin`; `getToolPluginMetadata` currently reads metadata only from an already-executed entry";
  docsPath: "/plugins/tool-plugins";
  code: "plugin-sdk-media-understanding-public-demotion" | "plugin-sdk-memory-host-core-public-demotion" | "plugin-sdk-plugin-config-runtime-public-demotion" | "plugin-sdk-tool-plugin-public-demotion";
  owner: "sdk";
  introduced: string;
  deprecated: string;
  warningStarts: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
})[], {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "plugin-sdk-channel-setup-input-fields";
  readonly owner: "channel";
  readonly replacement: "plugin-local setup input intersections that declare each owning channel field; retain each field until a new published-plugin artifact sweep finds no reader";
  readonly docsPath: "/plugins/sdk-migration#published-channel-setup-compatibility";
  readonly surfaces: readonly ["ChannelSetupInput.privateKey", "ChannelSetupInput.secret", "ChannelSetupInput.botToken", "ChannelSetupInput.appToken", "ChannelSetupInput.signingSecret", "ChannelSetupInput.mode", "ChannelSetupInput.cliPath", "ChannelSetupInput.authDir", "ChannelSetupInput.httpUrl", "ChannelSetupInput.httpPort", "ChannelSetupInput.webhookPath", "ChannelSetupInput.webhookUrl", "ChannelSetupInput.userId", "ChannelSetupInput.accessToken", "ChannelSetupInput.password", "ChannelSetupInput.deviceName", "ChannelSetupInput.url", "ChannelSetupInput.baseUrl", "ChannelSetupInput.code", "ChannelSetupInput.groupChannels", "ChannelSetupInput.dmAllowlist", "ChannelSetupInput.autoDiscoverChannels"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on the reader-backed ChannelSetupInput compatibility tier", "published-plugin artifact reader sweep required before field removal"];
  readonly tests: readonly ["src/plugin-sdk/channel-setup.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "ChannelSetupInput keeps its reader-backed channel fields through the dated migration window while plugins move them into plugin-local input types.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "plugin-sdk-broad-runtime-barrels";
  readonly owner: "sdk";
  readonly replacement: "focused plugin SDK subpaths for each runtime capability; retain until bundled and published plugins no longer import any of the seven broad barrels";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-runtime", "openclaw/plugin-sdk/agent-runtime loadModelCatalog params.useCache", "openclaw/plugin-sdk/agent-runtime loadModelCatalog params.cacheOnly", "openclaw/plugin-sdk/agent-runtime loadModelCatalog params.metadataSnapshot", "openclaw/plugin-sdk/agent-runtime loadModelCatalog", "openclaw/plugin-sdk/cli-runtime", "openclaw/plugin-sdk/conversation-runtime", "openclaw/plugin-sdk/hook-runtime", "openclaw/plugin-sdk/media-runtime", "openclaw/plugin-sdk/media-runtime buildAgentMediaPayload", "openclaw/plugin-sdk/plugin-runtime", "openclaw/plugin-sdk/security-runtime"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on broad plugin SDK barrels", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/contracts/plugin-sdk-subpaths.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Broad agent, CLI, conversation, hook, media, plugin, and security runtime barrels remain available while bundled and external plugins migrate to focused subpaths.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "plugin-sdk-provider-owned-helper-shims";
  readonly owner: "provider";
  readonly replacement: "provider-local auth, model, replay, OAuth, and stream helper APIs; retain until every helper is migrated in official providers and absent from published plugins";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["openclaw/plugin-sdk/provider-stream MOONSHOT_THINKING_STREAM_HOOKS", "openclaw/plugin-sdk/provider-stream-shared defaultToolStreamExtraParams", "openclaw/plugin-sdk/provider-stream-shared stripTrailingAnthropicAssistantPrefillWhenThinking", "openclaw/plugin-sdk/provider-stream-shared createAnthropicThinkingPrefillPayloadWrapper", "openclaw/plugin-sdk/provider-stream-shared OpenAICompatibleThinkingLevel", "openclaw/plugin-sdk/provider-stream-shared isOpenAICompatibleThinkingEnabled", "openclaw/plugin-sdk/provider-stream-shared DeepSeekV4ThinkingLevel", "openclaw/plugin-sdk/provider-stream-shared DeepSeekV4ReasoningEffort", "openclaw/plugin-sdk/provider-stream-shared createDeepSeekV4OpenAICompatibleThinkingWrapper", "openclaw/plugin-sdk/provider-stream-shared createThinkingOnlyFinalTextWrapper", "openclaw/plugin-sdk/provider-stream-shared createGoogleThinkingPayloadWrapper", "openclaw/plugin-sdk/provider-stream-shared createGoogleThinkingStreamWrapper", "openclaw/plugin-sdk/provider-model-shared isProxyReasoningUnsupportedModelHint", "openclaw/plugin-sdk/provider-model-shared NATIVE_ANTHROPIC_REPLAY_HOOKS", "openclaw/plugin-sdk/provider-model-shared PASSTHROUGH_GEMINI_REPLAY_HOOKS", "openclaw/plugin-sdk/provider-auth toFormUrlEncoded", "openclaw/plugin-sdk/provider-auth generatePkceVerifierChallenge", "openclaw/plugin-sdk/provider-oauth-runtime OAuthProvider", "openclaw/plugin-sdk/provider-oauth-runtime OAuthProviderInfo"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming provider-local replacements", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/contracts/plugin-sdk-subpaths.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Provider-specific auth, model, replay, OAuth, and stream shortcuts remain as deprecated SDK shims while providers move to their local APIs.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "message-presentation-legacy-bridges";
  readonly owner: "channel";
  readonly replacement: "MessagePresentation values and channel presentation renderers; retain until reply producers and official channel packages no longer emit or read legacy interactive replies";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["InteractiveReplyButton.value", "InteractiveReplyButton.url", "InteractiveReplyButton.webApp", "InteractiveReplyButton.web_app", "InteractiveReplyOption.value", "InteractiveReplyButton", "InteractiveReplyOption", "InteractiveReplyBlock", "InteractiveReply", "normalizeInteractiveReply", "hasInteractiveReplyBlocks", "presentationToInteractiveReply", "presentationToInteractiveControlsReply", "interactiveReplyToPresentation", "resolveInteractiveTextFallback", "src/auto-reply ReplyPayload.interactive", "openclaw/plugin-sdk/reply-payload ReplyPayload.interactive", "reduceInteractiveReply", "@openclaw/discord buildDiscordInteractiveComponents", "@openclaw/slack buildSlackInteractiveBlocks"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming MessagePresentation replacements", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/interactive/payload.test.ts", "src/plugin-sdk/reply-payload.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Legacy interactive reply values and channel-specific rendering bridges remain available while producers migrate to MessagePresentation.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "plugin-sdk-focused-compat-aliases";
  readonly owner: "sdk";
  readonly replacement: "the focused replacement named by each TypeScript @deprecated annotation; retain until every enumerated alias has zero bundled and published readers";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["openclaw/plugin-sdk/acp-runtime __testing", "openclaw/plugin-sdk/channel-inbound BuildChannelTurnContextParams", "openclaw/plugin-sdk/channel-inbound BuiltChannelTurnContext", "openclaw/plugin-sdk/channel-inbound buildChannelTurnContext", "openclaw/plugin-sdk/channel-inbound finalizeChannelInboundContext", "openclaw/plugin-sdk/channel-inbound filterChannelTurnSupplementalContext", "openclaw/plugin-sdk/channel-send-result ChannelSendRawResult", "openclaw/plugin-sdk/keyed-async-queue KeyedAsyncQueue.getTailMapForTesting", "openclaw/plugin-sdk/persistent-dedupe PersistentDedupeLegacyPathOptions.lockOptions", "openclaw/plugin-sdk/retry-runtime createTelegramRetryRunner", "openclaw/plugin-sdk/ssrf-policy SsrfPolicyOptions.allowPrivateNetwork", "openclaw/plugin-sdk/ssrf-policy ssrfPolicyFromAllowPrivateNetwork", "openclaw/plugin-sdk/tts-runtime TtsSynthesisStreamResult", "openclaw/plugin-sdk/tts-runtime TtsRuntimeFacade._test"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming focused replacements", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugin-sdk/channel-inbound.test.ts", "src/plugin-sdk/ssrf-policy.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Focused SDK compatibility aliases remain available through a dated window while callers adopt their annotated replacements.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "agent-harness-terminal-result-aliases";
  readonly owner: "agent-runtime";
  readonly replacement: "AgentHarnessAttemptResult.terminal and AgentHarnessDeliveryDefaults.visibleReplies; retain until harness migration verifies that legacy terminal fields and sourceVisibleReplies are unread";
  readonly docsPath: "/plugins/sdk-agent-harness";
  readonly surfaces: readonly ["AgentHarnessAttemptResult.aborted", "AgentHarnessAttemptResult.externalAbort", "AgentHarnessAttemptResult.timedOut", "AgentHarnessAttemptResult.idleTimedOut", "AgentHarnessAttemptResult.timedOutDuringCompaction", "AgentHarnessAttemptResult.timedOutDuringToolExecution", "AgentHarnessAttemptResult.timedOutByRunBudget", "AgentHarnessAttemptResult.promptError", "AgentHarnessAttemptResult.promptErrorSource", "AgentHarnessDeliveryDefaults.sourceVisibleReplies"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on agent harness result and delivery defaults", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/agents/harness/settled-turn-finalization-result.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Agent harness result booleans and sourceVisibleReplies remain available while harnesses migrate to terminal outcomes and visibleReplies.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "official-plugin-export-aliases";
  readonly owner: "channel";
  readonly replacement: "MessagePresentation renderers and host-owned timeout/runtime behavior; retain until minimum supported official plugin packages no longer import these aliases";
  readonly docsPath: "/plugins/compatibility#current-compatibility-areas";
  readonly surfaces: readonly ["@openclaw/discord buildDiscordInteractiveComponents", "@openclaw/discord normalizeDiscordListenerTimeoutMs", "@openclaw/discord normalizeDiscordInboundWorkerTimeoutMs", "@openclaw/discord isAbortError", "@openclaw/discord runDiscordTaskWithTimeout", "@openclaw/slack buildSlackInteractiveBlocks"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on published official-plugin exports", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Published channel presentation and Discord timeout aliases remain available while consumers move to their canonical exports and host-owned behavior.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "memory-host-compatibility-aliases";
  readonly owner: "sdk";
  readonly replacement: "canonical memory cache/FTS tables; retain until supported memory integrations are verified to use canonical tables without overrides and legacy table data remains preserved";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["@openclaw/memory-host-sdk ensureMemoryIndexSchema.embeddingCacheTable", "@openclaw/memory-host-sdk ensureMemoryIndexSchema.ftsTable"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on memory-host SDK compatibility fields", "plugin boundary report memory-host SDK summary"];
  readonly tests: readonly ["packages/memory-host-sdk/src/host/memory-schema.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Memory-host table overrides remain available until supported artifact usage and legacy data preservation are verified.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "plugin-runtime-api-compat-aliases";
  readonly owner: "plugin-execution";
  readonly replacement: "the namespaced plugin API and focused runtime methods named per surface; retain until all enumerated flat API and runtime aliases have no readers";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["OpenClawPluginApi.registerSessionExtension", "OpenClawPluginApi.enqueueNextTurnInjection", "OpenClawPluginApi.registerControlUiDescriptor", "OpenClawPluginApi.registerRuntimeLifecycle", "OpenClawPluginApi.registerAgentEventSubscription", "OpenClawPluginApi.emitAgentEvent", "OpenClawPluginApi.setRunContext", "OpenClawPluginApi.getRunContext", "OpenClawPluginApi.clearRunContext", "OpenClawPluginApi.registerSessionSchedulerJob", "OpenClawPluginApi.registerSessionAction", "OpenClawPluginApi.sendSessionAttachment", "OpenClawPluginApi.scheduleSessionTurn", "OpenClawPluginApi.unscheduleSessionTurnsByTag", "PluginHookContext.senderExternalId", "PluginAttachmentChannelHints.telegram", "PluginAttachmentChannelHints.slack", "AgentPromptSurfaceKind pi_main", "PluginRuntime.channel.reply.createReplyDispatcherWithTyping", "PluginRuntime.channel.reply.resolveHumanDelayConfig", "PluginRuntime.channel.reply.dispatchReplyFromConfig", "PluginRuntime.channel.reply.finalizeInboundContext", "PluginRuntime.channel.media.fetchRemoteMedia", "PluginRuntime.channel.session.resolveStorePath", "PluginRuntime.channel.session.recordInboundSession", "PluginRuntime.channel.inbound.runPreparedReply", "PluginRuntime.channel.turn", "PluginRuntime.system.requestHeartbeatNow"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on plugin API and runtime aliases", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/captured-registration.test.ts", "src/plugins/runtime/index.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Flat plugin registration and broad runtime aliases remain available while plugins migrate to namespaced APIs and focused runtime methods.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "plugin-provider-manifest-compat-aliases";
  readonly owner: "provider";
  readonly replacement: "manifest-owned plugin kind/setup metadata and model catalog registration; retain until providers no longer publish runtime kind or legacy catalog hooks";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["DefinePluginEntryOptions.kind", "SingleProviderPluginOptions.kind", "OpenClawPluginDefinition.kind", "PluginPackageChannel.cliAddOptions", "ProviderPlugin.catalog", "ProviderPlugin.staticCatalog", "ProviderPlugin.suppressBuiltInModel", "ProviderPlugin.augmentModelCatalog", "ProviderBuiltInModelSuppressionContext"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on plugin manifest and provider catalog aliases", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/contracts/package-manifest.contract.test.ts", "src/plugins/contracts/provider-catalog-deprecation.contract.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Runtime plugin kind/setup metadata and provider catalog hooks remain available while plugins migrate ownership into manifests and catalog registrations.";
}, {
  readonly code: "media-legacy-projection";
  readonly status: "removal-pending";
  readonly owner: "sdk";
  readonly introduced: "2026-07-24";
  readonly deprecated: "2026-07-24";
  readonly warningStarts: "2026-07-24";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "ordered `MsgContext.media` / `InboundMediaFacts[]`; typed hook `media` and `originalMedia`; `Attachment*` template variables; and `openclaw/plugin-sdk/media-local-roots`; retain until a clean published-plugin artifact sweep verifies that the legacy media surfaces have no readers";
  readonly docsPath: "/plugins/sdk-migration#media-legacy-projection";
  readonly surfaces: readonly ["MsgContext MediaPath/MediaUrl/MediaType and plural/staging fields", "openclaw/plugin-sdk/agent-media-payload", "ChannelInboundMediaPayload and buildChannelInboundMediaPayload", "MediaPayload and buildMediaPayload", "message hook mediaPath/mediaUrl/mediaType and plural/original metadata aliases", "MediaPath/MediaUrl/MediaType/MediaDir template variables"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming the facts-first replacement", "plugin boundary report compatibility inventory with the approved removeAfter date", "SDK, hook, and media template migration documentation"];
  readonly tests: readonly ["src/sessions/user-turn-transcript.media.test.ts", "src/hooks/message-hook-mappers.test.ts", "src/media-understanding/runner.cli-audio.test.ts", "src/plugins/compat/registry.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"];
  readonly releaseNote: "Legacy parallel media projections remain available as deprecated compatibility while plugins move to ordered facts, typed hook media, Attachment templates, and the focused media-local-roots SDK.";
}, {
  readonly code: "node-workspace-sync-acquisition";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-08-21";
  readonly deprecated: "2026-09-15";
  readonly warningStarts: "2026-09-15";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Await context.acquireManagedWorkspaceAsync(request) and release the returned lease in finally. Retain synchronous acquisition for supported external plugins until explicit breaking-release approval.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#managed-node-workspace-acquisition";
  readonly surfaces: readonly ["OpenClawPluginNodeHostCommandContext.acquireManagedWorkspace"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and migration documentation; no runtime warnings"];
  readonly tests: readonly ["src/node-host/invoke-workspace.test.ts", "src/node-host/node-worker-workspace-retention.test.ts", "extensions/codex/src/node-exec-server.test.ts"];
  readonly releaseNote: "Node-host plugins can await managed workspace acquisition while existing synchronous callers retain their immediate lease contract.";
}, {
  readonly code: "plugin-state-sync-keyed-store";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-05-29";
  readonly deprecated: "2026-09-11";
  readonly warningStarts: "2026-09-11";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "`api.runtime.state.openKeyedStore` and `PluginStateKeyedStore`; await operations while keeping transactional callbacks synchronous. Retain the sync adapter until a supported external-plugin migration and explicit breaking-release approval.";
  readonly docsPath: "/plugins/sdk-runtime/state-and-system#synchronous-keyed-store-migration";
  readonly surfaces: readonly ["api.runtime.state.openSyncKeyedStore", "PluginStateSyncKeyedStore", "createPluginStateSyncKeyedStore", "PluginStateKeyedStore.update", "PluginStateKeyedStore.deleteIf"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and state-store migration documentation", "plugin compatibility inventory; no new runtime warnings"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugin-state/plugin-state-store.test.ts", "src/plugin-state/plugin-state-store.runtime.test.ts", "test/type-contracts/plugin-state-store-runtime.ts", "src/plugins/loader.runtime-registry.test.ts"];
  readonly releaseNote: "Synchronous plugin keyed stores remain supported through the next Plugin SDK major while plugins migrate to awaited keyed-store operations; trust eligibility and transactional callbacks are unchanged.";
}, {
  readonly code: "memory-read-result-statusless-success";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly deprecated: "2026-08-19";
  readonly warningStarts: "2026-08-19";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: '`MemoryReadResult` with explicit `status: "ok" | "not_found"`';
  readonly docsPath: "/plugins/sdk-migration#memory-read-missing-results";
  readonly surfaces: readonly ["statusless external memory manager read results"];
  readonly diagnostics: readonly ["host memory-manager acquisition adapter"];
  readonly tests: readonly ["src/plugins/memory-runtime.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "External memory managers must return explicit not-found status for absence; statusless results retain legacy successful-read semantics through the next Plugin SDK major.";
}, {
  readonly code: "context-engine-legacy-host-param-default";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-07-29";
  readonly replacement: "`ContextEngineInfo.acceptedHostParams` for restricted projection; omitted declarations receive full host params";
  readonly docsPath: "/concepts/context-engine#the-contextengine-interface";
  readonly surfaces: readonly ["ContextEngineInfo.acceptedHostParams and undeclared-engine default projection"];
  readonly diagnostics: readonly ["plugin compatibility registry and context engine guide"];
  readonly tests: readonly ["src/context-engine/host-param-projection.test.ts"];
  readonly releaseNote: "The undeclared context-engine host-parameter compatibility default was removed; engines without `acceptedHostParams` now receive all current host fields.";
}, {
  readonly code: "removed-global-api-provider-publication";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-05-27";
  readonly replacement: "provider plugins via `api.registerProvider(...)`; host/runtime code registers against its lifecycle-owned `ApiRegistry`";
  readonly docsPath: "/plugins/sdk-migration#process-global-api-provider-publication";
  readonly surfaces: readonly ["openclaw/plugin-sdk/llm registerApiProvider", "openclaw/plugin-sdk/llm unregisterApiProviders"];
  readonly diagnostics: readonly ["plugin SDK compatibility registry and migration guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The process-global API-provider publication facade was removed; provider plugins now publish through their lifecycle-owned registration, and host runtimes register directly on their prepared ApiRegistry.";
}, {
  readonly code: "legacy-deactivate-hook-alias";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-05-16";
  readonly replacement: "`gateway_stop` hook";
  readonly docsPath: "/plugins/sdk-migration#deactivate-hook-alias";
  readonly surfaces: readonly ["api.on(\"deactivate\", ...)", "plugin typed hook registration"];
  readonly diagnostics: readonly ["plugin compatibility registry and migration guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: 'The deprecated `api.on("deactivate", ...)` hook alias was removed; plugins must register cleanup with `gateway_stop`.';
}, {
  readonly code: "legacy-subagent-spawning-hook";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-05-30";
  readonly replacement: "`subagent_spawned` for post-launch observation; core session-binding adapters for thread routing";
  readonly docsPath: "/plugins/hooks#upcoming-deprecations";
  readonly surfaces: readonly ["api.on(\"subagent_spawning\", ...)", "PluginHookSubagentSpawningEvent", "PluginHookSubagentSpawningResult", "SubagentLifecycleHookRunner.runSubagentSpawning"];
  readonly diagnostics: readonly ["plugin compatibility registry and migration guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: '`api.on("subagent_spawning", ...)` was removed; core now owns thread-bound subagent routing, and `subagent_spawned` remains available for observation.';
}, {
  readonly code: "hook-only-plugin-shape";
  readonly status: "active";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly replacement: "explicit capability registration";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["plugin shape inspection", "plugins inspect", "status diagnostics"];
  readonly diagnostics: readonly ["plugin compatibility notice"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/contracts/shape.contract.test.ts"];
}, {
  readonly code: "deprecated-memory-embedding-provider-api";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-05-21";
  readonly replacement: "`api.registerEmbeddingProvider(...)` and `contracts.embeddingProviders`";
  readonly docsPath: "/plugins/sdk-migration#memory-embedding-provider-api";
  readonly surfaces: readonly ["api.registerMemoryEmbeddingProvider(...)", "contracts.memoryEmbeddingProviders", "openclaw/plugin-sdk/memory-core-host-engine-embeddings registerMemoryEmbeddingProvider", "plugin compatibility registry and migration guide"];
  readonly diagnostics: readonly ["plugin compatibility registry and migration guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Memory-specific embedding provider registration was removed; plugins now use the generic embedding provider contract.";
}, {
  readonly code: "deprecated-session-store-beta5-api";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-05-21";
  readonly deprecated: "2026-07-12";
  readonly warningStarts: "2026-07-12";
  readonly replacement: "Use `getSessionEntry(...)` and `listSessionEntries(...)` for reads; `patchSessionEntry(...)`, `upsertSessionEntry(...)`, and `deleteSessionEntry(...)` for row mutations; and session identity with `session-transcript-runtime` for active transcripts. The supported-plugin cutoff excludes v2026.7.1-beta.5 and other packages importing the retired bridge.";
  readonly docsPath: "/plugins/sdk-migration/removed-surfaces#removed-session-and-transcript-file-apis";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-store-runtime loadSessionStore", "openclaw/plugin-sdk/session-store-runtime updateSessionStore", "openclaw/plugin-sdk/session-store-runtime resolveSessionFilePath", "openclaw/plugin-sdk/session-store-runtime resolveSessionStoreEntry", "openclaw/plugin-sdk/session-store-runtime LoadSessionStoreOptions", "openclaw/plugin-sdk/session-store-runtime UpdateSessionStoreOptions", "openclaw package root loadSessionStore", "openclaw package root saveSessionStore"];
  readonly diagnostics: readonly ["plugin compatibility registry and migration guide"];
  readonly tests: readonly ["src/plugin-sdk/session-store-runtime.test.ts", "src/index.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The September 30, 2026 approved cutoff retired the beta.5 session-store bridge, its option types, and package-root loadSessionStore/saveSessionStore aliases ahead of the former October 12 window. Plugins must use scoped row APIs and identity-backed transcript APIs; the session-store-runtime subpath and resolveStorePath remain available.";
}, {
  readonly code: "plugin-sdk-session-agent-resolution-aliases";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-08-29";
  readonly deprecated: "2026-08-29";
  readonly warningStarts: "2026-08-29";
  readonly removeAfter: "2026-11-29";
  readonly replacement: "`resolveSessionAgentIdsStrict` and `resolveSessionAgentIdStrict` with an explicit agent, agent-scoped session key, prepared fallback, or persisted owner";
  readonly docsPath: "/plugins/compatibility#session-agent-resolution-aliases";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-scope-runtime resolveSessionAgentIds and resolveSessionAgentId", "openclaw/plugin-sdk/agent-runtime session-agent resolver aliases", "openclaw/plugin-sdk/agent-harness-runtime session-agent resolver aliases", "openclaw/plugin-sdk/memory-core-host-runtime-core session-agent resolver alias", "openclaw/plugin-sdk/memory-host-core session-agent resolver alias"];
  readonly diagnostics: readonly ["TypeScript deprecated SDK alias annotations", "plugin compatibility registry"];
  readonly tests: readonly ["src/plugin-sdk/agent-scope-runtime.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Legacy Plugin SDK session-agent resolver names preserve ambient system-agent fallback while published plugins migrate to strict owner-required aliases.";
}, {
  readonly code: "agent-harness-credential-prompt-string-argument";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-08-08";
  readonly deprecated: "2026-09-09";
  readonly warningStarts: "2026-09-09";
  readonly removeAfter: "2026-11-30";
  readonly replacement: "options object `{ controlToolsAvailable }`";
  readonly docsPath: "/plugins/sdk-migration/removed-surfaces#credential-prompt-builder";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-harness-runtime buildCredentialSafetyPrompt string argument"];
  readonly diagnostics: readonly ["JSDoc parameter deprecation", "plugin compatibility registry"];
  readonly tests: readonly ["src/agents/credential-safety-prompt.test.ts"];
  readonly releaseNote: "The credential prompt helper remains available with private login-code handoff and capability-aware terminal setup guidance; its ignored legacy string argument is supported through 2026-11-30.";
}, {
  readonly code: "removed-session-transcript-file-api";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-07-01";
  readonly replacement: "session identity (`sessionKey`/`sessionId`), `SessionTranscriptUpdate.target`, and Gateway/runtime session helpers";
  readonly docsPath: "/plugins/sdk-migration#removed-session-and-transcript-file-apis";
  readonly surfaces: readonly ["saveSessionStore", "resolveSessionTranscriptPathInDir", "resolveAndPersistSessionFile", "readLatestAssistantTextFromSessionTranscript", "SessionTranscriptUpdate.sessionFile", "sessionFiles", "transcriptPath", "sessionFile", "plugins inspect compatibility notices"];
  readonly diagnostics: readonly ["plugin compatibility notice"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Session/transcript file APIs were removed with the SQLite session storage flip; plugins now use session identity and Gateway/runtime session helpers.";
}, {
  readonly code: "hook.before_tool_call.terminal-block-approval";
  readonly status: "active";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/hooks";
  readonly surfaces: readonly ["before_tool_call block result", "before_tool_call approval result"];
  readonly diagnostics: readonly ["hook runner contract probe"];
  readonly tests: readonly ["src/agents/agent-tools.before-tool-call.e2e.test.ts"];
}, {
  readonly code: "hook.llm-observer.privacy-payload";
  readonly status: "active";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/hooks";
  readonly surfaces: readonly ["llm_input", "llm_output", "agent_end", "allowConversationAccess"];
  readonly diagnostics: readonly ["conversation access hook contract probe"];
  readonly tests: readonly ["src/agents/cli-runner.reliability.test.ts", "src/config/schema.help.quality.test.ts"];
}, {
  readonly code: "api.capture.runtime-registrars";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/architecture-internals";
  readonly surfaces: readonly ["createCapturedPluginRegistration", "capturePluginRegistration", "OpenClawPluginApi"];
  readonly diagnostics: readonly ["runtime registration capture contract probe"];
  readonly tests: readonly ["src/plugins/captured-registration.test.ts"];
}, {
  readonly code: "channel.runtime.envelope-config-metadata";
  readonly status: "active";
  readonly owner: "channel";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/sdk-channel-plugins";
  readonly surfaces: readonly ["api.registerChannel", "channel setup metadata", "channel message envelope"];
  readonly diagnostics: readonly ["channel runtime contract probe"];
  readonly tests: readonly ["src/plugin-sdk/channel-entry-contract.test.ts", "src/plugins/captured-registration.test.ts"];
}, {
  readonly code: "whatsapp-web-inbound-flat-message-aliases";
  readonly status: "removed";
  readonly owner: "channel";
  readonly introduced: "2026-05-30";
  readonly replacement: "WhatsApp `WebInboundCallbackMessage` nested contexts: `event`, `payload`, `quote`, `group`, and `platform`";
  readonly docsPath: "/plugins/compatibility";
  readonly surfaces: readonly ["@openclaw/whatsapp WebInboundMessage flat fields", "WhatsApp monitorWebInbox onMessage callback", "WhatsApp monitorWebChannel listenerFactory injected messages"];
  readonly diagnostics: readonly ["plugin compatibility registry and compatibility guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "WhatsApp WebInboundMessage flat fields were removed; callbacks now receive only nested inbound contexts.";
}, {
  readonly code: "whatsapp-web-inbound-admission-top-level-fields";
  readonly status: "removed";
  readonly owner: "channel";
  readonly introduced: "2026-06-14";
  readonly replacement: "WhatsApp `WebInboundMessage.admission` fields: `conversation.id`, `accountId`, `ingress.decision`, and `conversation.kind`";
  readonly docsPath: "/plugins/compatibility";
  readonly surfaces: readonly ["@openclaw/whatsapp WebInboundMessage top-level admission fields", "WhatsApp monitorWebInbox onMessage callback", "WhatsApp monitorWebChannel listenerFactory injected messages"];
  readonly diagnostics: readonly ["plugin compatibility registry and compatibility guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "WhatsApp WebInboundMessage top-level admission fields were removed; callbacks now read the canonical admission envelope.";
}, {
  readonly code: "sdk-untrusted-context-identifier-aliases";
  readonly status: "removal-pending";
  readonly owner: "sdk";
  readonly introduced: "2026-07-22";
  readonly deprecated: "2026-07-22";
  readonly warningStarts: "2026-07-22";
  readonly removeAfter: "2026-09-08";
  readonly replacement: "`MsgContext.ChannelPromptContext`, `MsgContext.ChannelStructuredContext`, `ChannelStructuredContextEntry`, `SupplementalContextFacts.channelStructuredContext`, and `buildChannelMetadata`; retain the aliases until migration of published plugin readers is verified and explicit breaking-release approval is granted";
  readonly docsPath: "/plugins/compatibility";
  readonly surfaces: readonly ["openclaw/plugin-sdk reply-runtime MsgContext.UntrustedContext and UntrustedStructuredContext", "openclaw/plugin-sdk reply-runtime UntrustedStructuredContextEntry", "openclaw/plugin-sdk channel-inbound SupplementalContextFacts.untrustedContext", "openclaw/plugin-sdk security-runtime buildUntrustedChannelMetadata"];
  readonly diagnostics: readonly ["TypeScript deprecated SDK alias annotations"];
  readonly tests: readonly ["src/auto-reply/reply/inbound-context.test.ts"];
  readonly releaseNote: "Untrusted-named prompt-context SDK identifiers remain wired as deprecated aliases of the channel-named fields while plugins migrate.";
}, {
  readonly code: "channel-explicit-target-parser";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly replacement: "`messaging.targetResolver` for target normalization and `messaging.resolveOutboundSessionRoute` for session/thread identity";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["ChannelMessagingAdapter.parseExplicitTarget", "openclaw/plugin-sdk/channel-route ChannelRouteExplicitTarget", "openclaw/plugin-sdk/channel-route ChannelRouteExplicitTargetParser", "openclaw/plugin-sdk/channel-route resolveChannelRouteTargetWithParser"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/channels/plugins/contracts/test-helpers/surface-contract-suite.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated channel explicit-target parser was removed; plugins must normalize targets with `messaging.targetResolver` and project session identity with `messaging.resolveOutboundSessionRoute`.";
}, {
  readonly code: "channel-messaging-targets-subpath";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly replacement: "`openclaw/plugin-sdk/channel-targets`";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/plugin-sdk/messaging-targets"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"];
  readonly releaseNote: "The deprecated `openclaw/plugin-sdk/messaging-targets` subpath was removed; import target helpers from `openclaw/plugin-sdk/channel-targets`.";
}, {
  readonly code: "bundled-plugin-allowlist";
  readonly status: "active";
  readonly owner: "config";
  readonly introduced: "2026-04-24";
  readonly replacement: "manifest-owned plugin enablement and scoped load plans";
  readonly docsPath: "/plugins/architecture";
  readonly surfaces: readonly ["plugins.allow", "bundled provider startup", "plugins status"];
  readonly diagnostics: readonly ["plugin status report"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/config-state.test.ts"];
}, {
  readonly code: "bundled-plugin-enablement";
  readonly status: "active";
  readonly owner: "config";
  readonly introduced: "2026-04-24";
  readonly replacement: "manifest-owned plugin defaults and scoped load plans";
  readonly docsPath: "/plugins/architecture";
  readonly surfaces: readonly ["plugins.entries", "bundled provider startup", "plugins status"];
  readonly diagnostics: readonly ["plugin status report"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/config-state.test.ts"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
  readonly code: "activation-agent-harness-hint";
  readonly replacement: "top-level `cliBackends[]` for CLI aliases and future `agentRuntime` ownership metadata";
  readonly surfaces: readonly ["activation.onAgentHarnesses", "activation planner"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
  readonly code: "activation-provider-hint";
  readonly replacement: "`providers[]` manifest ownership";
  readonly surfaces: readonly ["activation.onProviders", "activation planner"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
  readonly code: "activation-channel-hint";
  readonly replacement: "`channels[]` manifest ownership";
  readonly surfaces: readonly ["activation.onChannels", "activation planner"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
  readonly code: "activation-command-hint";
  readonly replacement: "`commandAliases` or command contribution metadata";
  readonly surfaces: readonly ["activation.onCommands", "activation planner"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
  readonly code: "activation-route-hint";
  readonly replacement: "HTTP route contribution metadata";
  readonly surfaces: readonly ["activation.onRoutes", "activation planner"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly code: "activation-config-path-hint";
  readonly introduced: "2026-04-27";
  readonly replacement: "manifest contribution ownership for root config surfaces";
  readonly surfaces: readonly ["activation.onConfigPaths", "startup plugin selection"];
  readonly tests: readonly ["src/plugins/channel-plugin-ids.test.ts"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
  readonly code: "activation-capability-hint";
  readonly replacement: "manifest contribution ownership";
  readonly surfaces: readonly ["activation.onCapabilities", "activation planner"];
}, {
  readonly code: "agent-harness-sdk-alias";
  readonly status: "deprecated";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-25";
  readonly warningStarts: "2026-04-25";
  readonly replacement: "none yet; retain until a harness subpath ships and external migration is proven";
  readonly docsPath: "/plugins/sdk-agent-harness";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-harness", "openclaw/plugin-sdk/agent-harness-runtime"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/contracts/plugin-sdk-subpaths.test.ts"];
}, {
  readonly code: "embedded-pi-agent-sdk-aliases";
  readonly status: "removed";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-05-21";
  readonly replacement: "`runEmbeddedAgent` and `EmbeddedAgent*` SDK/runtime names";
  readonly docsPath: "/plugins/sdk-runtime";
  readonly surfaces: readonly ["api.runtime.agent.runEmbeddedPiAgent", "openclaw/extension-api runEmbeddedPiAgent", "openclaw/plugin-sdk/agent-harness-runtime EmbeddedPi* aliases"];
  readonly diagnostics: readonly ["plugin SDK compatibility registry"];
  readonly tests: readonly ["src/plugins/runtime/index.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"];
  readonly releaseNote: "The legacy `runEmbeddedPiAgent` and `EmbeddedPi*` plugin aliases were removed; plugins must use the neutral embedded-agent names.";
}, {
  readonly code: "plugin-sdk-shipped-channel-setup-exports";
  readonly status: "deprecated";
  readonly owner: "channel";
  readonly introduced: "2026-07-23";
  readonly deprecated: "2026-07-23";
  readonly warningStarts: "2026-07-23";
  readonly replacement: "retain until supported published packages migrate to plugin-owned config schemas plus generic `openclaw/plugin-sdk/channel-config-schema` and `openclaw/plugin-sdk/setup-runtime` primitives";
  readonly docsPath: "/plugins/sdk-migration#published-channel-setup-compatibility";
  readonly surfaces: readonly ["openclaw/plugin-sdk/bundled-channel-config-schema SlackConfigSchema", "openclaw/plugin-sdk/bundled-channel-config-schema DiscordConfigSchema", "openclaw/plugin-sdk/bundled-channel-config-schema SignalConfigSchema", "openclaw/plugin-sdk/bundled-channel-config-schema MSTeamsConfigSchema", "openclaw/plugin-sdk/setup-runtime createLegacyCompatChannelDmPolicy", "openclaw/plugin-sdk/setup-runtime promptLegacyChannelAllowFromForAccount"];
  readonly diagnostics: readonly ["repository deprecated API usage guard for core and bundled plugins; no external runtime import warning"];
  readonly tests: readonly ["src/plugin-sdk/shipped-channel-compat.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Published OpenClaw channel packages through 2026.7.1 remain loadable while they migrate to plugin-owned config and setup helpers.";
}, {
  readonly code: "generated-bundled-channel-config-fallback";
  readonly status: "active";
  readonly owner: "channel";
  readonly introduced: "2026-04-24";
  readonly replacement: "manifest registry `channelConfigs` metadata";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["generated bundled channel config metadata", "channel config validation"];
  readonly diagnostics: readonly ["channel config metadata fallback"];
  readonly tests: readonly ["src/plugins/contracts/config-footprint-guardrails.test.ts"];
}, {
  readonly code: "setup-runtime-fallback";
  readonly status: "active";
  readonly owner: "setup";
  readonly introduced: "2026-04-24";
  readonly replacement: "`setup.requiresRuntime: false` with complete setup descriptors";
  readonly docsPath: "/plugins/manifest/setup-and-auth#setup-reference";
  readonly surfaces: readonly ["setup-api runtime fallback", "setup.requiresRuntime omitted"];
  readonly diagnostics: readonly ["setup registry runtime diagnostic"];
  readonly tests: readonly ["src/plugins/setup-registry.test.ts", "src/plugins/setup-registry.runtime.test.ts"];
}];
//#endregion
//#region src/plugins/compat/registry.d.ts
type PluginCompatCode = (typeof PLUGIN_COMPAT_RECORDS)[number]["code"];
//#endregion
//#region src/infra/npm-registry-spec.d.ts
/**
 * Parsed registry-only npm spec accepted by plugin install flows.
 * Selectors are limited to exact versions and dist-tags; URL/git/file specs
 * are rejected before they can execute on the gateway host.
 */
type ParsedRegistryNpmSpec = {
  name: string;
  raw: string;
  selector?: string;
  selectorKind: "none" | "exact-version" | "tag";
  selectorIsPrerelease: boolean;
};
//#endregion
//#region src/plugins/install-source-info.types.d.ts
/** Warning emitted while describing plugin package install source metadata. */
type PluginInstallSourceWarning = "invalid-clawhub-spec" | "invalid-npm-spec" | "invalid-default-choice" | "default-choice-missing-source" | "clawhub-spec-floating" | "npm-integrity-without-source" | "npm-spec-floating" | "npm-spec-missing-integrity" | "npm-spec-package-name-mismatch";
/** Pinning state for npm plugin install metadata. */
type PluginInstallNpmPinState = "exact-with-integrity" | "exact-without-integrity" | "floating-with-integrity" | "floating-without-integrity";
/** Parsed npm install source metadata for a plugin package. */
type PluginInstallNpmSourceInfo = {
  spec: string;
  packageName: string;
  expectedPackageName?: string;
  selector?: string;
  selectorKind: ParsedRegistryNpmSpec["selectorKind"];
  exactVersion: boolean;
  expectedIntegrity?: string;
  pinState: PluginInstallNpmPinState;
};
/** Parsed ClawHub install source metadata for a plugin package. */
type PluginInstallClawHubSourceInfo = {
  spec: string;
  packageName: string;
  version?: string;
  exactVersion: boolean;
};
/** Parsed plugin install sources plus validation warnings. */
type PluginInstallSourceInfo = {
  defaultChoice?: PluginPackageInstall["defaultChoice"];
  clawhub?: PluginInstallClawHubSourceInfo;
  npm?: PluginInstallNpmSourceInfo;
  local?: {
    path: string;
  };
  warnings: readonly PluginInstallSourceWarning[];
};
//#endregion
//#region src/plugins/installed-plugin-index-hash.d.ts
/** File metadata signature used to skip unchanged installed plugin files. */
type InstalledPluginFileSignature = {
  size: number;
  mtimeMs: number;
  ctimeMs?: number;
};
//#endregion
//#region src/plugins/plugin-source-admission.types.d.ts
declare const SourceAdmissionReceiptSchema: z.ZodObject<{
  signature: z.ZodString;
  sourceDigest: z.ZodString;
  nativeArtifacts: z.ZodRecord<z.ZodString, z.ZodObject<{
    sourceIdentity: z.ZodString;
    contentHash: z.ZodString;
    sizeBytes: z.ZodNumber;
    capturedPath: z.ZodString;
    namespace: z.ZodString;
    capturedIdentity: z.ZodString;
  }, z.core.$strip>>;
  nativeNamespaces: z.ZodRecord<z.ZodString, z.ZodObject<{
    sourceDirectory: z.ZodString;
    capturedRoot: z.ZodString;
    managed: z.ZodBoolean;
    referenceRoot: z.ZodOptional<z.ZodString>;
    members: z.ZodRecord<z.ZodString, z.ZodObject<{
      source: z.ZodString;
      sourceIdentity: z.ZodString;
      capturedIdentity: z.ZodString;
      boundaryChecked: z.ZodBoolean;
      contentHash: z.ZodOptional<z.ZodString>;
      sizeBytes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
  }, z.core.$strip>>;
}, z.core.$strip>;
type PluginSourceAdmissionReceipt = SchemaContract<z.infer<typeof SourceAdmissionReceiptSchema>>;
//#endregion
//#region src/plugins/installed-plugin-index-types.d.ts
/** Schema version for installed plugin index files. */
declare const INSTALLED_PLUGIN_INDEX_VERSION = 1;
declare const INSTALLED_PLUGIN_INDEX_MIGRATION_VERSION = 1;
type InstalledPluginIndexRefreshReason = "missing" | "stale-manifest" | "stale-package" | "source-changed" | "policy-changed" | "migration" | "host-contract-changed" | "compat-registry-changed" | "manual";
type InstalledPluginStartupInfo = {
  sidecar: boolean;
  memory: boolean;
  agentHarnesses: readonly string[];
  /**
   * Manifest activation.onConfigPaths copied into the installed index for
   * pre-manifest startup scoping. Missing on older persisted index files.
   */
  configPaths?: readonly string[];
};
type InstalledPluginContributionInfo = {
  channels: readonly string[];
  channelConfigs: readonly string[];
  providers: readonly string[];
  modelCatalogProviders: readonly string[];
  modelSupportPrefixes: readonly string[];
  modelSupportPatterns: readonly string[];
  autoEnableProviderIds: readonly string[];
  commandAliases: readonly string[];
  contracts: Readonly<Record<string, readonly string[]>>;
};
type InstalledPluginInstallRecordInfo = PluginInstallRecord;
type InstalledPluginPackageChannelInfo = PluginPackageChannel;
/** One manifest-backed plugin entry in the generated installed plugin index. */
type InstalledPluginIndexRecord = {
  pluginId: string;
  packageName?: string;
  packageVersion?: string;
  /** Hash of the top-level installRecords entry; used to detect source-changed invalidation. */
  installRecordHash?: string;
  /** Native source admissions survive process restarts while the install owner is unchanged. */
  sourceAdmissions?: Record<string, PluginSourceAdmissionReceipt>;
  /**
   * Package-authored openclaw.install metadata. This describes catalog/package
   * install intent and must not be treated as the durable install record.
   */
  packageInstall?: PluginInstallSourceInfo;
  packageChannel?: InstalledPluginPackageChannelInfo;
  packageBuild?: OpenClawPackageBuild;
  manifestPath: string;
  manifestHash: string;
  /** Hash of the doctor-contract artifact selected by the runtime resolver. */
  doctorContractHash?: string;
  doctorContractFile?: InstalledPluginFileSignature;
  manifestFile?: InstalledPluginFileSignature;
  format?: PluginManifestRecord["format"];
  bundleFormat?: PluginManifestRecord["bundleFormat"];
  source?: string;
  setupSource?: string;
  packageJson?: {
    path: string;
    hash: string;
    fileSignature?: InstalledPluginFileSignature;
  };
  rootDir: string;
  origin: PluginManifestRecord["origin"];
  enabled: boolean;
  enabledByDefault?: boolean;
  enabledByDefaultOnPlatforms?: readonly string[];
  syntheticAuthRefs?: readonly string[];
  startup: InstalledPluginStartupInfo;
  contributions?: InstalledPluginContributionInfo;
  compat: readonly PluginCompatCode[];
};
/** Full installed-index payload used by control-plane plugin registry loading. */
type InstalledPluginIndex = {
  version: typeof INSTALLED_PLUGIN_INDEX_VERSION;
  warning?: string;
  hostContractVersion: string;
  compatRegistryVersion: string;
  migrationVersion: typeof INSTALLED_PLUGIN_INDEX_MIGRATION_VERSION;
  policyHash: string;
  generatedAtMs: number;
  /** Selected workspace used to build this index. Missing for omitted and legacy scopes. */
  workspaceDir?: string;
  refreshReason?: InstalledPluginIndexRefreshReason;
  installRecords: Readonly<Record<string, InstalledPluginInstallRecordInfo>>;
  plugins: readonly InstalledPluginIndexRecord[];
  diagnostics: readonly PluginDiagnostic[];
};
//#endregion
//#region src/plugins/plugin-registry-snapshot.types.d.ts
/** Source class for plugin registry snapshots used by diagnostics and cache decisions. */
type PluginRegistrySnapshotSource = "provided" | "persisted" | "derived";
/** Which registry facts differ for one plugin; the sources alone can be identical. */
type PluginRegistryDifferenceFacet = "record" | "install" | "diagnostics";
type PluginRegistryDifference = {
  pluginId: string;
  changed: readonly PluginRegistryDifferenceFacet[];
  persistedSource: string | null;
  derivedSource: string | null;
};
type PluginRegistrySnapshotDiagnostic = {
  level: "info" | "warn";
  code: "persisted-registry-missing" | "persisted-registry-stale-policy" | "persisted-registry-stale-source";
  message: string;
  differences?: readonly PluginRegistryDifference[];
};
//#endregion
//#region src/plugins/provider-owner-index.d.ts
type DeclaredProviderOwnerIndex = ReadonlyMap<string, ReadonlySet<string>>;
//#endregion
//#region src/plugins/plugin-metadata-snapshot.types.d.ts
type PluginProviderAuthAliasCandidate = {
  plugin: PluginManifestRecord;
  target: string;
  baseUrls?: readonly string[];
  /** First eligible declaration owns public map order, even if a later candidate wins. */
  order: number;
};
type PluginProviderAuthContribution = {
  plugin: PluginManifestRecord;
  envProviders: readonly PluginManifestSetupProvider[];
  evidenceProviders: readonly PluginManifestSetupProvider[];
  fallbackProviderRefs: readonly string[];
};
type PluginMetadataSnapshotOwnerMaps = {
  channels: ReadonlyMap<string, readonly string[]>;
  channelAccountKeyPolicies?: ReadonlyMap<string, ChannelAccountKeyPolicy>;
  channelConfigs: ReadonlyMap<string, readonly string[]>;
  providers: ReadonlyMap<string, readonly string[]>;
  modelCatalogProviders: ReadonlyMap<string, readonly string[]>;
  cliBackends: ReadonlyMap<string, readonly string[]>;
  setupProviders: ReadonlyMap<string, readonly string[]>;
  commandAliases: ReadonlyMap<string, readonly string[]>;
  contracts: ReadonlyMap<string, readonly string[]>;
  /** Empty views must not fall through to process-current model normalization policies. */
  modelIdNormalizationPolicies: ReadonlyMap<string, PluginManifestModelIdNormalizationProvider>;
  providerAuthContributions: readonly PluginProviderAuthContribution[];
  providerAuthAliases?: ReadonlyMap<string, readonly PluginProviderAuthAliasCandidate[]>;
  providerEndpoints?: readonly PluginManifestProviderEndpoint[];
  providerRequests?: ReadonlyMap<string, PluginManifestProviderRequestProvider>;
};
type PluginMetadataSnapshotMetrics = {
  registrySnapshotMs: number;
  manifestRegistryMs: number;
  ownerMapsMs: number;
  totalMs: number;
  indexPluginCount: number;
  manifestPluginCount: number;
};
type PluginMetadataSnapshot = {
  policyHash: string;
  configFingerprint?: string;
  pluginIds?: readonly string[];
  registrySource?: PluginRegistrySnapshotSource;
  workspaceDir?: string;
  index: InstalledPluginIndex;
  /** The original workspace-scoped index described by registrySource, before runtime unions. */
  registryIndex: InstalledPluginIndex;
  registryDiagnostics: readonly PluginRegistrySnapshotDiagnostic[];
  manifestRegistry: PluginManifestRegistry;
  /** Independently validated bundled owners, including packages shadowed by active plugins. */
  bundledManifestRegistry?: PluginManifestRegistry;
  plugins: readonly PluginManifestRecord[];
  diagnostics: readonly PluginDiagnostic[];
  byPluginId: ReadonlyMap<string, PluginManifestRecord>;
  normalizePluginId: (pluginId: string) => string;
  owners: PluginMetadataSnapshotOwnerMaps;
  /** Strict first-winner literal/setup ownership, separate from public alias maps. */
  declaredProviderOwners: DeclaredProviderOwnerIndex;
  metrics: PluginMetadataSnapshotMetrics;
  discovery?: PluginDiscoveryResult;
};
type PluginMetadataRegistryView = Pick<PluginMetadataSnapshot, "index" | "manifestRegistry" | "discovery" | "workspaceDir"> & Partial<Pick<PluginMetadataSnapshot, "declaredProviderOwners">>;
//#endregion
//#region src/plugins/provider-catalog-outcome.d.ts
type ProviderCatalogOutcome = {
  provider: string;
  /** Auth profile tested by discovery; omission means provider-wide auth. */
  profileId?: string;
  /** Limits an auth rejection to catalog discovery rather than model execution. */
  rejectionScope?: "catalog";
  status: "ready" | "auth-rejected" | "unavailable";
  /** Private account-scoped observations from successful discovery, never static model hints. */
  modelServiceTiers?: readonly {
    modelId: string;
    runtimeId: string;
    api: string;
    baseUrl: string;
    serviceTiers: readonly string[];
  }[];
  /** Optional successful discovery order for models already present in the catalog. */
  modelOrder?: readonly string[];
};
//#endregion
//#region src/agents/model-catalog.types.d.ts
/** Input modalities a catalog entry can advertise. */
type ModelInputType = "text" | "image" | "audio" | "video" | "document";
/** Normalized model metadata exposed by the agent model catalog. */
type ModelCatalogEntry = {
  /** Native catalog owner, not a physical provider route or transferable readiness fact. */
  nativeRuntime?: string;
  id: string;
  name: string;
  provider: string;
  /** Provider-owned strongest-first picker order; internal and never projected to clients. */
  providerOrder?: number;
  alias?: string;
  api?: ModelApi;
  /** Private transport provenance for route matching; never project directly to clients. */
  baseUrl?: string;
  contextWindow?: number;
  contextWindows?: ModelCatalogContextWindowOption[];
  contextWindowDefault?: string;
  contextTokens?: number;
  /** Provider-declared unknown-model estimate; not an authored or curated static limit. */
  contextWindowSource?: "synthetic";
  reasoning?: boolean;
  /** Config-authored reasoning override; internal provenance, never project to clients. */
  configuredReasoning?: boolean;
  /** Concrete runtime owner of thinking policy; internal and never project to clients. */
  thinkingPolicyProvider?: string;
  /** Provider-owned effort support for this exact physical model route. */
  thinkingLevelMap?: ThinkingLevelMap;
  input?: ModelInputType[];
  params?: Record<string, unknown>;
  compat?: ModelCompatConfig;
  mediaInput?: ModelMediaInputConfig;
  status?: ModelCatalogStatus;
  statusReason?: string;
  replaces?: string[];
  replacedBy?: string;
};
//#endregion
//#region src/plugins/provider-thinking.types.d.ts
/**
 * Provider-owned thinking policy input.
 *
 * Used by shared `/think`, ACP controls, and directive parsing to ask a
 * provider whether a model supports special reasoning UX such as adaptive,
 * xhigh, max, or a binary on/off toggle.
 */
type ProviderThinkingPolicyContext = {
  provider: string;
  modelId: string;
};
type ProviderThinkingModelCompat = {
  thinkingFormat?: string;
  supportsReasoningEffort?: boolean;
  supportedReasoningEfforts?: readonly string[] | null;
  reasoningEffortMap?: Record<string, string>;
};
/**
 * Provider-owned default thinking policy input.
 *
 * `reasoning` is the merged catalog hint for the selected model when one is
 * available. Providers can use it to keep "reasoning model => low" behavior
 * without re-reading the catalog themselves.
 *
 * `compat` carries model-level request contract facts for the selected model
 * when available. Providers can use it to expose model-specific thinking
 * profiles only when the configured payload style supports them.
 */
type ProviderDefaultThinkingPolicyContext = ProviderThinkingPolicyContext & {
  /** Effective agent runtime selected for this model, when known. */
  agentRuntime?: string | null;
  /** API adapter id from the selected catalog route, when known. */
  api?: string | null;
  /** Base URL from the selected catalog route, when known. */
  baseUrl?: string | null;
  reasoning?: boolean;
  /** Thinking-to-wire mapping from the selected model route. */
  thinkingLevelMap?: ThinkingLevelMap;
  params?: Record<string, unknown>;
  compat?: ProviderThinkingModelCompat | null;
};
type ProviderThinkingLevelId = ThinkLevel;
type ProviderThinkingLevel = {
  id: ProviderThinkingLevelId;
  /**
   * Optional display label. Use this when the stored value differs from the
   * provider-facing UX, for example binary providers storing `low` but showing
   * `on`.
   */
  label?: string;
  /**
   * Relative strength used when downgrading a stored level that the selected
   * model no longer supports.
   */
  rank?: number;
};
type ProviderThinkingProfile = {
  levels: ProviderThinkingLevel[] | ReadonlyArray<ProviderThinkingLevel>;
  defaultLevel?: ProviderThinkingLevelId | null;
  /**
   * Some bundled providers have model-specific thinking contracts that are more
   * current than cached generic catalog metadata. Keep this opt-in so
   * `reasoning: false` remains authoritative for ordinary catalog entries.
   */
  preserveWhenCatalogReasoningFalse?: boolean;
};
//#endregion
//#region src/agents/auth-profiles/external-cli-discovery.d.ts
/** External CLI auth discovery mode used while loading auth profile stores. */
type ExternalCliAuthDiscovery = {
  mode: "none";
  allowKeychainPrompt?: false;
  config?: OpenClawConfig;
} | {
  mode: "existing";
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
} | {
  mode: "scoped";
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  providerIds?: Iterable<string>;
  profileIds?: Iterable<string>;
};
//#endregion
//#region src/agents/auth-profiles/path-resolve.d.ts
type SharedAuthStoreOwnership = {
  location: "legacy-main";
} | {
  location: "state-db";
};
/** Pure producer facts; capturing a supplied runtime snapshot must not open SQLite. */
type AuthProfileOwnerScope = {
  stateDir: string;
  sharedMainDir: string;
};
//#endregion
//#region src/plugins/provider-auth-types.d.ts
/** Provider secret input modes: inline plaintext or external secret reference. */
type SecretInputMode = "plaintext" | "ref";
//#endregion
//#region src/plugins/provider-external-auth.types.d.ts
type ProviderAuthOptionBag = {
  token?: string;
  tokenProvider?: string;
  secretInputMode?: SecretInputMode;
  [key: string]: unknown;
};
/** Context for resolving synthetic provider credentials from config. */
type ProviderResolveSyntheticAuthContext = {
  config?: OpenClawConfig;
  provider: string;
  providerConfig?: ModelProviderConfig;
};
/** Synthetic provider credential returned by plugin auth helpers. */
type ProviderSyntheticAuthResult = {
  apiKey: string;
  source: string;
  mode: Exclude<ModelProviderAuthMode, "aws-sdk">;
  expiresAt?: number;
  /** Native presence authorizes only this runtime, never a provider bearer request. */
  nativeAuth?: {
    runtime: string;
    mode: "api-key" | "oauth" | "token";
  };
};
/** Context for resolving external provider auth profiles. */
type ProviderResolveExternalAuthProfilesContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  store: AuthProfileStore;
};
/** External auth profile credential resolved for a provider. */
type ProviderExternalAuthProfile = {
  profileId: string;
  credential: OAuthCredential;
  persistence?: "runtime-only" | "persisted";
};
/** Internal synchronous resolver shared by provider hooks and auth-store overlays. */
type ProviderExternalAuthProfileResolver = (params: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderResolveExternalAuthProfilesContext;
}) => ProviderExternalAuthProfile[];
//#endregion
//#region src/agents/auth-profiles/legacy-source-files.d.ts
type LegacyAuthProfileSourceKind = "auth-profiles" | "auth-state" | "legacy-auth" | "legacy-oauth";
type LegacyAuthProfileSource = {
  kind: LegacyAuthProfileSourceKind;
  path: string;
};
//#endregion
//#region src/agents/auth-profiles/sqlite.d.ts
type AuthProfileDatabase = OpenClawAgentDatabase | OpenClawStateDatabase;
/** Internal prepared ownership, carried through commit publication and compensation. */
type AuthProfileStoreOwner = {
  databasePath: string;
  sharedDatabasePath: string;
  location: SharedAuthStoreOwnership["location"];
};
type PreparedAuthProfileStoreOwner = AuthProfileStoreOwner & {
  env: NodeJS.ProcessEnv;
};
//#endregion
//#region src/agents/auth-profiles/runtime-read.d.ts
type LoadAuthProfileStoreOptions = {
  /** Limit a credential-read refusal to the provider being resolved; writes stay owner-wide. */
  migrationProvider?: string;
  deferScopedMigrationRefusals?: boolean;
  onReadOwner?: (owner: AuthProfileReadOwner) => void;
  /** Materialize only this explicitly selected personal account into the returned view. */
  profileId?: string;
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  database?: AuthProfileDatabase;
  externalCli?: ExternalCliAuthDiscovery;
  inheritedAuthDir?: string;
  readOnly?: boolean;
  syncExternalCli?: boolean;
  externalCliProviderIds?: Iterable<string>;
  externalCliProfileIds?: Iterable<string>;
};
type AuthProfileReadOwner = {
  databasePath: string;
  candidates: LegacyAuthProfileSource[];
  readStore: () => AuthProfileStore | null;
};
//#endregion
//#region src/agents/auth-profiles/runtime-snapshot-owner.d.ts
type RuntimeAuthProfileLegacyCandidates = {
  local: LegacyAuthProfileSource[];
  shared: LegacyAuthProfileSource[];
};
/** Core lifecycle receipt; the public SDK snapshot shape intentionally stays unchanged. */
type OwnedRuntimeAuthProfileStoreSnapshotEntry = {
  databasePath: string;
  agentDir: string;
  store: RuntimeAuthProfileStore;
  owner: RuntimeAuthSharedOwner;
  legacyCandidates?: RuntimeAuthProfileLegacyCandidates;
};
type RuntimeAuthSharedOwner = ({
  kind: "resolved";
} & Pick<AuthProfileStoreOwner, "sharedDatabasePath" | "location">) | {
  kind: "unresolved";
  scope: AuthProfileOwnerScope;
};
//#endregion
//#region src/agents/auth-profiles/store-save.d.ts
type SaveAuthProfileStoreOptions = {
  filterExternalAuthProfiles?: boolean;
  preserveOrderProfileIds?: Iterable<string>;
  preserveStateProfileIds?: Iterable<string>;
  pruneOrderProfileIds?: Iterable<string>;
  sharedStoreWrite?: boolean;
  syncExternalCli?: boolean;
};
//#endregion
//#region src/agents/auth-profiles/store.d.ts
/** Find a persisted credential in the scoped store, falling back to the main store. */
declare function findPersistedAuthProfileCredential(params: {
  agentDir?: string;
  profileId: string;
}): AuthProfileStore["profiles"][string] | undefined;
//#endregion
//#region src/agents/auth-profiles/store-runtime.d.ts
declare const { createAuthProfileStoreReadScope, updateAuthProfileStoreWithLock, loadAuthProfileStore, loadAuthProfileStoreForRuntime, loadAuthProfileStoreForRuntimeAsync, loadAuthProfileStoreForSecretsRuntime, loadAuthProfileStoreWithoutExternalProfiles, ensureAuthProfileStore, ensureAuthProfileStoreWithoutExternalProfiles, ensureAuthProfileStoreForLocalUpdate, saveAuthProfileStore, saveAuthProfileStoreWithPreparedOwner, saveAuthProfileStoreIfPersistenceSnapshotMatches }: Readonly<{
  prepareAuthProfileStoreForModelRuntime: (agentDir: string, options: {
    config: OpenClawConfig;
    inheritedAuthDir?: string;
    skipCredentials?: boolean;
  }, assertCurrent: () => void, env?: NodeJS.ProcessEnv) => Promise<AuthProfileStore | undefined>;
  createAuthProfileStoreReadScope: (agentDir: string, config: OpenClawConfig | undefined) => {
    agentDir: string;
    store: AuthProfileStore;
    read: () => AuthProfileStore;
    getRuntimeSnapshots: () => RuntimeAuthProfileStore[];
    assertCredentialReady: (source: AuthProfileCredentialSource, baseUrl?: string) => void;
    assertProviderReady: (provider?: string, baseUrl?: string) => void;
  };
  updateAuthProfileStoreWithLock: (params: {
    agentDir?: string;
    profileId?: string;
    sharedStoreWrite?: boolean;
    stateDir?: string;
    saveOptions?: SaveAuthProfileStoreOptions;
    updater: (store: AuthProfileStore, owner?: PreparedAuthProfileStoreOwner) => boolean;
  }) => Promise<AuthProfileStore | null>;
  loadAuthProfileStore: () => AuthProfileStore;
  loadAuthProfileStoreForRuntime: (agentDir?: string, options?: LoadAuthProfileStoreOptions, env?: NodeJS.ProcessEnv) => AuthProfileStore;
  loadAuthProfileStoreForRuntimeAsync: (agentDir?: string, options?: {
    migrationProvider?: string;
    deferScopedMigrationRefusals?: boolean;
    profileId?: string;
    allowKeychainPrompt?: boolean;
    config?: OpenClawConfig;
    externalCli?: ExternalCliAuthDiscovery;
    inheritedAuthDir?: string;
    readOnly?: boolean;
    externalCliProviderIds?: Iterable<string>;
    externalCliProfileIds?: Iterable<string>;
  }) => Promise<AuthProfileStore>;
  loadAuthProfileStoreForSecretsRuntime: (agentDir?: string, options?: Pick<LoadAuthProfileStoreOptions, "config" | "profileId" | "externalCli" | "externalCliProviderIds" | "externalCliProfileIds" | "inheritedAuthDir">) => AuthProfileStore;
  loadAuthProfileStoreWithoutExternalProfiles: (agentDir?: string, loadOptions?: Pick<LoadAuthProfileStoreOptions, "allowKeychainPrompt" | "inheritedAuthDir" | "profileId">) => AuthProfileStore;
  ensureAuthProfileStore: (agentDir?: string, options?: {
    migrationProvider?: string;
    profileId?: string;
    allowKeychainPrompt?: boolean;
    config?: OpenClawConfig;
    externalCli?: ExternalCliAuthDiscovery;
    externalCliProviderIds?: Iterable<string>;
    externalCliProfileIds?: Iterable<string>;
    inheritedAuthDir?: string;
    readOnly?: boolean;
    syncExternalCli?: boolean;
  }) => AuthProfileStore;
  ensureAuthProfileStoreWithoutExternalProfiles: (agentDir?: string, options?: {
    migrationProvider?: string;
    config?: OpenClawConfig;
    profileId?: string;
    allowKeychainPrompt?: boolean;
    inheritedAuthDir?: string;
    readOnly?: boolean;
    syncExternalCli?: boolean;
  }) => AuthProfileStore;
  ensureAuthProfileStoreForLocalUpdate: (agentDir?: string) => AuthProfileStore;
  saveAuthProfileStore: (store: AuthProfileStore, agentDir?: string, options?: SaveAuthProfileStoreOptions, database?: AuthProfileDatabase) => void;
  saveAuthProfileStoreWithPreparedOwner: (store: AuthProfileStore, agentDir: string | undefined, options: SaveAuthProfileStoreOptions | undefined, database: AuthProfileDatabase, owner: AuthProfileStoreOwner | PreparedAuthProfileStoreOwner) => void;
  saveAuthProfileStoreIfPersistenceSnapshotMatches: (params: {
    store: AuthProfileStore;
    snapshot: {
      owner: PreparedAuthProfileStoreOwner;
      credentialsRaw: unknown;
      stateRaw: unknown;
      runtimeCaptured: boolean;
      runtimeRevision?: number;
      runtimeRevisionAtSaveEdge?: number;
      runtimeRevisionBeforePublication?: number;
      runtimeEntry?: OwnedRuntimeAuthProfileStoreSnapshotEntry;
      derivedRuntimeStores?: Array<OwnedRuntimeAuthProfileStoreSnapshotEntry & {
        runtimeRevision: number;
      }>;
      derivedRuntimeRevisionsAtSaveEdge?: Array<{
        databasePath: string;
        agentDir: string;
        runtimeRevision: number;
      }>;
      derivedRuntimeRevisionsBeforePublication?: Array<{
        databasePath: string;
        agentDir: string;
        runtimeRevision: number;
      }>;
    };
    agentDir?: string;
    options?: SaveAuthProfileStoreOptions;
    stateDir?: string;
  }) => {
    owned: {
      owner: PreparedAuthProfileStoreOwner;
      credentialsRaw: unknown;
      stateRaw: unknown;
      runtimeCaptured: boolean;
      runtimeRevision?: number;
      runtimeRevisionAtSaveEdge?: number;
      runtimeRevisionBeforePublication?: number;
      runtimeEntry?: OwnedRuntimeAuthProfileStoreSnapshotEntry;
      derivedRuntimeStores?: Array<OwnedRuntimeAuthProfileStoreSnapshotEntry & {
        runtimeRevision: number;
      }>;
      derivedRuntimeRevisionsAtSaveEdge?: Array<{
        databasePath: string;
        agentDir: string;
        runtimeRevision: number;
      }>;
      derivedRuntimeRevisionsBeforePublication?: Array<{
        databasePath: string;
        agentDir: string;
        runtimeRevision: number;
      }>;
    };
    publishRuntimeSnapshots: () => boolean;
  };
  findPersistedAuthProfileCredential: typeof findPersistedAuthProfileCredential;
}>;
//#endregion
//#region src/model-catalog/remote-overlay.d.ts
type RemoteCatalogPublicationResult = "published" | "unchanged" | "superseded";
//#endregion
//#region src/plugins/provider-auth-availability.d.ts
declare const { isProviderApiKeyConfigured, listUsableProviderAuthProfileIds, isProviderAuthProfileConfigured, resolveProviderAuthProfileApiKey }: Readonly<{
  isProviderApiKeyConfigured: (params: {
    provider: string;
    cfg?: OpenClawConfig;
    agentDir?: string;
    profileTypes?: readonly AuthProfileCredential["type"][];
    capability?: string;
    acceptsApiKey?: (apiKey: string) => boolean;
  }) => boolean;
  listUsableProviderAuthProfileIds: (params: {
    provider: string;
    cfg?: OpenClawConfig;
    agentDir?: string;
    profileTypes?: readonly AuthProfileCredential["type"][];
    capability?: string;
    allowKeychainPrompt?: boolean;
    includeExternalCliAuth?: boolean;
  }) => {
    agentDir: string;
    profileIds: string[];
  };
  isProviderAuthProfileConfigured: (params: {
    provider: string;
    cfg?: OpenClawConfig;
    agentDir?: string;
    profileTypes?: readonly AuthProfileCredential["type"][];
    capability?: string;
    allowKeychainPrompt?: boolean;
    includeExternalCliAuth?: boolean;
  }) => boolean;
  resolveProviderAuthProfileApiKey: (params: {
    provider: string;
    cfg?: OpenClawConfig;
    agentDir?: string;
    profileTypes?: readonly AuthProfileCredential["type"][];
    capability?: string;
    allowKeychainPrompt?: boolean;
    includeExternalCliAuth?: boolean;
  }) => Promise<string | undefined>;
}>;
//#endregion
//#region src/agents/system-prompt-contribution.d.ts
/**
 * Provider-owned system prompt contribution types.
 * Separates cache-stable prefixes, dynamic suffixes, and section overrides for
 * runtime prompt assembly.
 */
/** Core system-prompt sections that providers may replace. */
type ProviderSystemPromptSectionId = "interaction_style" | "tool_call_style" | "execution_bias";
/** Provider guidance merged into the assembled agent system prompt. */
type ProviderSystemPromptContribution = {
  /**
   * Cache-stable provider guidance inserted above the system-prompt cache boundary.
   *
   * Use this for static provider/model-family instructions that should preserve
   * KV cache reuse across turns.
   */
  stablePrefix?: string;
  /**
   * Provider guidance inserted below the cache boundary.
   *
   * Use this only for genuinely dynamic text that is expected to vary across
   * runs or sessions.
   */
  dynamicSuffix?: string;
  /**
   * Whole-section replacements for selected core prompt sections.
   *
   * Values should contain the complete rendered section, including any desired
   * heading such as `## Tool Call Style`.
   */
  sectionOverrides?: Partial<Record<ProviderSystemPromptSectionId, string>>;
};
//#endregion
//#region src/infra/provider-usage.types.d.ts
/** One quota window reported by a provider usage endpoint. */
type UsageWindow = {
  label: string;
  groupLabel?: string;
  usedPercent: number;
  resetAt?: number;
};
/** Provider-reported monetary or credit facts. Units may be ISO currencies or provider credits. */
type ProviderUsageBilling = {
  type: "balance";
  label?: string;
  amount: number;
  unit: string;
} | {
  type: "spend";
  label?: string;
  amount: number;
  unit: string;
  period?: string;
  resetAt?: number;
} | {
  type: "budget";
  label?: string;
  used: number;
  limit: number;
  unit: string;
  period?: string;
  resetAt?: number;
};
/** Provider-reported daily cost and token totals. Costs are actual provider billing, not estimates. */
type ProviderUsageCostDaily = {
  date: string;
  amount: number;
  requests?: number;
  inputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  outputTokens: number;
  totalTokens: number;
};
/** Aggregate model activity for the provider history window. */
type ProviderUsageModelBreakdown = Omit<ProviderUsageCostDaily, "date" | "amount"> & {
  name: string;
};
/** Aggregate provider billing category for the history window. */
type ProviderUsageCostBreakdown = {
  name: string;
  amount: number;
};
/** Provider-reported cost history and attribution for one bounded UTC window. */
type ProviderUsageCostHistory = {
  unit: string;
  periodDays: number;
  scope?: string;
  daily: ProviderUsageCostDaily[];
  models: ProviderUsageModelBreakdown[];
  categories: ProviderUsageCostBreakdown[];
};
type ProviderUsageSnapshot = {
  provider: UsageProviderId;
  displayName: string;
  windows: UsageWindow[];
  billing?: ProviderUsageBilling[];
  costHistory?: ProviderUsageCostHistory;
  summary?: string;
  plan?: string;
  /** Account identity (email) the usage was fetched under, when known. */
  accountEmail?: string;
  error?: string;
};
/** Normalized provider id. Usage providers are discovered from plugin hooks at runtime. */
type UsageProviderId = string;
//#endregion
//#region src/plugin-sdk/provider-model-types.d.ts
/** Private selected-request facts; omission means the host cannot establish applicability. */
type ProviderFastModePolicyContext = {
  provider: string;
  modelId: string;
  api?: string;
  baseUrl?: string;
  authMode?: string;
  runtimeId?: string;
  modelParams?: Record<string, unknown>;
  params?: Record<string, unknown>;
  requestCapabilities: {
    endpointClass: string;
    allowsAnthropicServiceTier: boolean;
  };
};
//#endregion
//#region src/plugin-sdk/provider-oauth-runtime.d.ts
/** Normalized OAuth credential bundle persisted by provider auth profiles. */
type OAuthCredentials = {
  /** Refresh token or provider-equivalent long-lived credential. */
  refresh: string;
  /** Access token or provider-equivalent bearer credential. */
  access: string;
  /** Absolute epoch milliseconds when the access token should be considered expired. */
  expires: number;
  [key: string]: unknown;
};
/** Manual input prompt shown during OAuth login flows. */
type OAuthPrompt$1 = {
  /** Prompt text shown to the operator. */
  message: string;
  /** Optional placeholder for manual text entry. */
  placeholder?: string;
  /** Whether empty input should be accepted instead of reprompting. */
  allowEmpty?: boolean;
};
/** Authorization URL and optional instructions shown before OAuth completion. */
type OAuthAuthInfo = {
  /** Provider authorization URL shown to the user. */
  url: string;
  /** Optional provider-specific instruction text for manual flows. */
  instructions?: string;
};
/** One selectable OAuth login option. */
type OAuthSelectOption = {
  /** Stable option id returned when the operator selects this entry. */
  id: string;
  /** Human-readable option label shown in the selector. */
  label: string;
};
/** Selector prompt used when a provider offers multiple OAuth login choices. */
type OAuthSelectPrompt = {
  /** Prompt text shown above the selectable options. */
  message: string;
  /** Options available for the operator to choose from. */
  options: OAuthSelectOption[];
};
/** UI/runtime callbacks used by provider OAuth login implementations. */
interface OAuthLoginCallbacks {
  /** Emits authorization URL/instructions to the UI before waiting for completion. */
  onAuth: (info: OAuthAuthInfo) => void;
  /** Prompts for manual input such as pasted callback URLs or authorization codes. */
  onPrompt: (prompt: OAuthPrompt$1) => Promise<string>;
  /** Reports human-readable login progress without exposing secrets. */
  onProgress?: (message: string) => void;
  /** Optional direct manual-code entry hook used when callback-server flows cannot complete. */
  onManualCodeInput?: () => Promise<string>;
  /** Show an interactive selector and return the selected option id, or undefined on cancel. */
  onSelect?: (prompt: OAuthSelectPrompt) => Promise<string | undefined>;
  /** Cancels pending OAuth waits and prompts when aborted. */
  signal?: AbortSignal;
}
//#endregion
//#region src/plugins/cli-backend.types.d.ts
type PluginTextReplacement = {
  from: string | RegExp;
  to: string;
};
type PluginTextTransforms = {
  /** Rewrites applied to outbound prompt text before provider/CLI transport. */
  input?: PluginTextReplacement[];
  /** Rewrites applied to inbound assistant text before OpenClaw consumes it. */
  output?: PluginTextReplacement[];
};
//#endregion
//#region src/agents/system-prompt.types.d.ts
type PromptMode = "full" | "minimal" | "none";
//#endregion
//#region src/plugins/provider-oauth-flow.d.ts
/** Prompt payload used when OAuth flow code entry needs user input. */
type OAuthPrompt = {
  message: string;
  placeholder?: string;
};
/** Creates OAuth callbacks that use local browser auth locally and manual code entry on VPS hosts. */
declare function createVpsAwareOAuthHandlers(params: {
  isRemote: boolean;
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
  spin: ReturnType<WizardPrompter["progress"]>;
  openUrl: (url: string) => Promise<unknown>;
  localBrowserMessage: string;
  manualPromptMessage?: string;
  manualPromptSignal?: AbortSignal;
}): {
  onAuth: (event: {
    url: string;
  }) => Promise<void>;
  onPrompt: (prompt: OAuthPrompt) => Promise<string>;
};
//#endregion
//#region src/plugins/provider-authentication.types.d.ts
type ProviderAuthKind = "oauth" | "api_key" | "token" | "device_code" | "custom";
type ProviderAuthSecretStorage = {
  /** Final persistence target. The inline credential remains available for staged validation. */
  kind: "store";
  /** Environment-style prefix used for the host-owned secret-store entry. */
  namePrefix: string;
};
type ProviderAuthProfile = {
  profileId: string;
  credential: AuthProfileCredential;
  /** Request host-owned SecretRef materialization at the final persistence boundary. */
  secretStorage?: ProviderAuthSecretStorage;
};
/** Standard result payload returned by provider auth methods. */
type ProviderAuthResult = {
  profiles: ProviderAuthProfile[];
  /**
   * Optional config patch to merge after credentials are written.
   *
   * Use this for provider-owned onboarding defaults such as
   * `models.providers.<id>` entries, default aliases, or agent model helpers.
   * The caller still persists auth-profile bindings separately.
   */
  configPatch?: Partial<OpenClawConfig>;
  defaultModel?: string;
  notes?: string[];
  /**
   * Opt in to replace `agents.defaults.models` wholesale with the patch map.
   * Default behavior merges the map so other providers' entries survive.
   * Set only from migrations that intentionally rename/remove model keys.
   */
  replaceDefaultModels?: boolean;
};
/** Interactive auth context passed to provider login/setup methods. */
type ProviderAuthContext = {
  config: OpenClawConfig;
  /** Host-authorized profiles available for reconnect; personal flows supply only their owner's selection. */
  existingProfiles?: readonly ProviderAuthProfile[];
  /** Save connection credentials without discovering or selecting a starter model. */
  credentialOnly?: boolean;
  env?: NodeJS.ProcessEnv;
  agentDir?: string;
  workspaceDir?: string;
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
  /** Cancels browser callbacks, device polling, and other app-owned auth work. */
  signal?: AbortSignal;
  /** Personal-account methods must recheck live caller authority immediately before external effects. */
  assertCurrent?: () => void;
  /**
   * Optional onboarding CLI options that triggered this auth flow.
   *
   * Present for setup/configure/auth-choice flows so provider methods can
   * honor preseeded flags like `--openai-api-key` or generic
   * `--token/--token-provider` pairs. Direct `models auth login` usually
   * leaves this undefined.
   */
  opts?: ProviderAuthOptionBag;
  /**
   * Onboarding secret persistence preference.
   *
   * Interactive wizard flows set this when the caller explicitly requested
   * plaintext or env/file/exec/store ref storage. Ad-hoc `models auth login` flows
   * usually leave it undefined.
   */
  secretInputMode?: SecretInputMode;
  /**
   * Whether the provider auth flow should offer the onboarding secret-storage
   * mode picker when `secretInputMode` is unset.
   *
   * This is true for onboarding/configure flows and false for direct
   * `models auth` commands, which should keep a tighter, provider-owned prompt
   * surface.
   */
  allowSecretRefPrompt?: boolean;
  isRemote: boolean;
  openUrl: (url: string) => Promise<void>;
  oauth: {
    createVpsAwareHandlers: typeof createVpsAwareOAuthHandlers;
    authorize?: (params: {
      state: string;
      timeoutMs: number;
      buildAuthorizationUrl: (redirectUrl: string) => string;
    }) => Promise<{
      code: string;
      state: string;
    }>;
  };
};
type ProviderNonInteractiveApiKeyResult = {
  key: string;
  source: "profile" | "env" | "flag";
  envVarName?: string;
};
type ProviderResolveNonInteractiveApiKeyParams = {
  provider: string;
  flagValue?: string;
  flagName: `--${string}`;
  envVar: string;
  envVarName?: string;
  allowProfile?: boolean;
  required?: boolean;
};
type ProviderNonInteractiveApiKeyCredentialParams = {
  provider: string;
  resolved: ProviderNonInteractiveApiKeyResult;
  email?: string;
  metadata?: Record<string, string>;
};
type ProviderAuthMethodNonInteractiveContext = {
  authChoice: string;
  config: OpenClawConfig;
  baseConfig: OpenClawConfig;
  opts: ProviderAuthOptionBag;
  runtime: RuntimeEnv;
  agentDir?: string;
  workspaceDir?: string;
  resolveApiKey: (params: ProviderResolveNonInteractiveApiKeyParams) => Promise<ProviderNonInteractiveApiKeyResult | null>;
  toApiKeyCredential: (params: ProviderNonInteractiveApiKeyCredentialParams) => ApiKeyCredential | null;
};
type ProviderAuthMethodNonInteractiveValidationContext = Omit<ProviderAuthMethodNonInteractiveContext, "toApiKeyCredential">;
/** Read-only context for app-guided discovery of already available inference. */
type ProviderAppGuidedSetupContext = {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  workspaceDir?: string;
  signal?: AbortSignal;
};
type ProviderAppGuidedSetupCandidate = {
  /** Canonical provider/model reference returned unchanged during activation. */
  modelRef: string;
  /** Optional provider-owned detail shown beside the auth-choice label. */
  detail?: string;
};
type ProviderAppGuidedSetup = {
  /**
   * Report whether the provider's local service is reachable, even when no
   * model is suitable for automatic activation. This probe must be read-only.
   */
  detectAvailability?: (ctx: ProviderAppGuidedSetupContext) => Promise<boolean>;
  /** Detection is read-only: no model pull, download, login, or config write. */
  detect: (ctx: ProviderAppGuidedSetupContext) => Promise<ProviderAppGuidedSetupCandidate | null>;
  /** Recheck one detected model and return the config required for a live probe. */
  prepare: (ctx: ProviderAppGuidedSetupContext & {
    modelRef: string;
  }) => Promise<ProviderAuthResult | null>;
};
type ProviderAuthMethod = {
  id: string;
  label: string;
  hint?: string;
  kind: ProviderAuthKind;
  /** Provider-owned model used to validate app-guided secret setup. */
  starterModel?: string;
  /** One-time import attempted only after the user starts this login method. */
  credentialImport?: {
    migrationProviderId: string;
    itemId: string;
    credentialKind: "oauth" | "api_key" | "token";
  };
  /**
   * Optional wizard/onboarding metadata for this specific auth method.
   *
   * Use this when one provider exposes multiple setup entries (for example API
   * key + OAuth, or region-specific login flows). OpenClaw uses this to expose
   * method-specific auth choices while keeping the provider id stable.
   */
  wizard?: ProviderPluginWizardSetup;
  /** Proven provider identity for reconnecting an owned personal account; absent means a new slot. */
  matchesPersonalAccount?: (credential: AuthProfileCredential, existing: AuthProfileCredential) => boolean;
  run: (ctx: ProviderAuthContext) => Promise<ProviderAuthResult>;
  runNonInteractive?: (ctx: ProviderAuthMethodNonInteractiveContext) => Promise<OpenClawConfig | null>;
  /** Side-effect-free prerequisite validation used before destructive reset handling. */
  validateNonInteractive?: (ctx: ProviderAuthMethodNonInteractiveValidationContext) => Promise<boolean>;
  /** Provider-owned local model discovery for the shared guided setup ladder. */
  appGuidedSetup?: ProviderAppGuidedSetup;
};
type ProviderPluginWizardSetup = {
  modelTarget?: "utility";
  choiceId?: string;
  choiceLabel?: string;
  choiceHint?: string;
  assistantPriority?: number;
  assistantVisibility?: "visible" | "manual-only" | "detected-only";
  onboardingFeatured?: boolean;
  groupId?: string;
  groupLabel?: string;
  groupHint?: string;
  methodId?: string;
  /**
   * Interactive onboarding surfaces where this auth choice should appear.
   * Defaults to `["text-inference"]` when omitted.
   */
  onboardingScopes?: PluginManifestOnboardingScope[];
  /**
   * Optional model-allowlist prompt policy applied after this auth choice is
   * selected in configure/onboarding flows.
   *
   * Keep this UI-facing and static. Provider logic that needs runtime state
   * should stay in `run`/`runNonInteractive`.
   */
  modelAllowlist?: {
    allowedKeys?: string[];
    initialSelections?: string[];
    loadCatalog?: boolean;
    message?: string;
  };
  /**
   * Optional default-model prompt policy for this auth/setup choice.
   *
   * Use this when selecting the auth choice should still force a model picker
   * even if the choice was preseeded via CLI/configure, or when "keep current"
   * would skip required provider-owned post-selection work.
   */
  modelSelection?: {
    promptWhenAuthChoiceProvided?: boolean;
    allowKeepCurrent?: boolean;
  };
};
/** Optional model-picker metadata shown in interactive provider selection flows. */
type ProviderPluginWizardModelPicker = {
  label?: string;
  hint?: string;
  methodId?: string;
};
/** UI metadata that lets provider plugins appear in onboarding and configure flows. */
type ProviderPluginWizard = {
  setup?: ProviderPluginWizardSetup;
  modelPicker?: ProviderPluginWizardModelPicker;
};
type ProviderOAuthProfileIdRepair = {
  /**
   * Legacy OAuth profile id to migrate away from.
   *
   * When omitted, OpenClaw falls back to `<provider>:default`.
   */
  legacyProfileId?: string;
  /**
   * Optional custom doctor prompt label.
   *
   * Defaults to the provider label when omitted.
   */
  promptLabel?: string;
};
type ProviderModelSelectedContext = {
  config: OpenClawConfig;
  model: string;
  prompter: WizardPrompter;
  agentDir?: string;
  workspaceDir?: string;
};
type ProviderDeferSyntheticProfileAuthContext = {
  config?: OpenClawConfig;
  provider: string;
  providerConfig?: ModelProviderConfig;
  resolvedApiKey?: string;
};
type ProviderSystemPromptContributionContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  promptMode: PromptMode;
  runtimeChannel?: string;
  runtimeCapabilities?: string[];
  agentId?: string;
  trigger?: "cron" | "heartbeat" | "manual" | "memory" | "overflow" | "user";
};
type ProviderTransformSystemPromptContext = ProviderSystemPromptContributionContext & {
  systemPrompt: string;
};
//#endregion
//#region src/plugins/provider-catalog.types.d.ts
type ProviderCatalogOrder = "simple" | "profile" | "paired" | "late";
type ProviderCatalogContext = {
  /** Acquisition lifetime; release awaited work and join its cleanup when aborted. */
  signal?: AbortSignal;
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  /** Normalized provider identities selected for this catalog owner; absent means the full catalog. */
  providerIds?: readonly string[];
  resolveProviderApiKey: (providerId?: string) => {
    apiKey: string | undefined;
    discoveryApiKey?: string;
    profileId?: string;
    /** Credential kind from this lookup when known; never infer it from another selection. */
    mode?: "api_key" | "oauth" | "token";
  };
  resolveProviderAuth: (providerId?: string, options?: {
    oauthMarker?: string;
  }) => {
    apiKey: string | undefined;
    discoveryApiKey?: string;
    mode: "api_key" | "aws-sdk" | "oauth" | "token" | "none";
    source: "env" | "profile" | "none";
    profileId?: string;
    /** Credential preparation exhausted its candidates; not an unconfigured provider. */
    preparationFailed?: boolean;
    authFlow?: string;
  };
};
type ProviderCatalogResult = {
  provider: ModelProviderConfig;
  outcomes?: readonly ProviderCatalogOutcome[];
} | {
  providers: Record<string, ModelProviderConfig>;
  outcomes?: readonly ProviderCatalogOutcome[];
} | null | undefined;
type ProviderPluginCatalog = {
  order?: ProviderCatalogOrder;
  run: (ctx: ProviderCatalogContext) => Promise<ProviderCatalogResult>;
};
/**
 * Built-in model suppression hook context.
 *
 * @deprecated Use manifest `modelCatalog.suppressions`. Runtime suppression
 * hooks are no longer called by model resolution.
 */
type ProviderBuiltInModelSuppressionContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  modelId: string;
  baseUrl?: string;
};
type ProviderBuiltInModelSuppressionResult = {
  suppress: boolean;
  errorMessage?: string;
};
/**
 * Provider-owned "modern model" policy input.
 *
 * Live smoke/model-profile selection uses this to keep provider-specific
 * inclusion/exclusion rules out of core.
 */
type ProviderModernModelPolicyContext = {
  provider: string;
  modelId: string;
};
/**
 * Final catalog augmentation hook.
 *
 * Runs after OpenClaw loads the discovered model catalog and merges configured
 * opt-in providers. Use this for forward-compat rows or vendor-owned synthetic
 * entries that should appear in `models list` and model pickers even when the
 * upstream registry has not caught up yet.
 */
type ProviderAugmentModelCatalogContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  resolveProviderApiKey?: ProviderCatalogContext["resolveProviderApiKey"];
  entries: ModelCatalogEntry[];
};
//#endregion
//#region src/plugins/provider-config-context.types.d.ts
/**
 * Provider-owned config normalization for `models.providers.<id>` entries.
 *
 * Use this for provider-specific config cleanup that should stay with the
 * plugin rather than in core config-policy tables.
 */
type ProviderNormalizeConfigContext = {
  provider: string;
  providerConfig: ModelProviderConfig;
};
/**
 * Provider-owned env/config auth marker resolution for `models.providers`.
 *
 * Use this when a provider resolves auth from env vars that do not follow the
 * generic API-key conventions.
 */
type ProviderResolveConfigApiKeyContext = {
  provider: string;
  env: NodeJS.ProcessEnv;
};
/**
 * Provider-owned config-default application input.
 *
 * Use this when a provider needs to add global config defaults that depend on
 * provider auth mode or provider-specific model families.
 */
type ProviderApplyConfigDefaultsContext = {
  provider: string;
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
};
//#endregion
//#region src/plugins/provider-runtime-model.types.d.ts
/**
 * Fully-resolved runtime model shape used after provider/plugin-owned
 * discovery, overrides, and compat normalization.
 */
type ProviderRuntimeModel = Omit<Model, "compat"> & {
  compat?: ModelCompatConfig;
  contextWindows?: ModelCatalogContextWindowOption[];
  contextWindowDefault?: string;
  contextTokens?: number;
  /** Unknown-model estimate, replaceable only by accepted same-route account metadata. */
  contextWindowSource?: "synthetic";
  /** Host-resolved provenance for the top-level wire output cap. */
  maxTokensSource?: "configured" | "discovered";
  params?: Record<string, unknown>;
  requestTimeoutMs?: number;
  /** Provider/host-prepared tool discovery preference for this attempt; never persisted. */
  toolSearchMode?: "tools" | false;
  /** Provider-prepared default for embedded compaction; explicit compaction config wins. */
  compactionThinkingDefault?: NonNullable<ProviderThinkingProfile["defaultLevel"]>;
  mediaInput?: ModelMediaInputConfig;
};
//#endregion
//#region src/plugins/provider-replay.types.d.ts
type ProviderReplaySanitizeMode = "full" | "images-only";
type ProviderReplayToolCallIdMode = "strict" | "strict9";
type ProviderReasoningOutputMode = "native" | "tagged";
/**
 * Provider-owned replay/compaction transcript policy.
 *
 * These values are consumed by shared history replay and compaction logic.
 * Return only the fields the provider wants to override; core fills the rest
 * with its default policy.
 */
type ProviderReplayPolicy = {
  sanitizeMode?: ProviderReplaySanitizeMode;
  sanitizeToolCallIds?: boolean;
  toolCallIdMode?: ProviderReplayToolCallIdMode;
  duplicateToolCallIdStyle?: "openai";
  preserveNativeAnthropicToolUseIds?: boolean;
  preserveSignatures?: boolean;
  /** Keep per-turn runtime context in place to preserve signed thinking prefixes. */
  appendOnlyRuntimeContext?: boolean;
  /** Append system-authority updates instead of rewriting the stable prompt prefix. */
  inHistorySystemUpdates?: boolean;
  sanitizeThoughtSignatures?: {
    allowBase64Only?: boolean;
    includeCamelCase?: boolean;
  };
  dropThinkingBlocks?: boolean;
  dropReasoningFromHistory?: boolean;
  repairToolUseResultPairing?: boolean;
  applyAssistantFirstOrderingFix?: boolean;
  validateGeminiTurns?: boolean;
  validateAnthropicTurns?: boolean;
  allowSyntheticToolResults?: boolean;
};
/**
 * Provider-owned replay/compaction policy input.
 *
 * Use this when transcript replay rules depend on provider/model transport
 * behavior and should stay with the provider plugin instead of core tables.
 */
type ProviderReplayPolicyContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  provider: string;
  modelId?: string;
  modelApi?: string | null;
  model?: ProviderRuntimeModel;
  /** Host-resolved model, endpoint, and authentication eligibility. */
  inHistorySystemUpdates?: boolean;
};
type ProviderReplaySessionEntry = {
  customType: string;
  data?: unknown;
};
type ProviderReplaySessionState = {
  getCustomEntries(): ProviderReplaySessionEntry[];
  /** @deprecated Use ProviderReplaySessionStateV2.appendCustomEntryAsync; removed at the next Plugin SDK major. */
  appendCustomEntry(customType: string, data: unknown): void;
};
/** Worker-backed host state. The legacy synchronous adapter remains available for its deprecation window. */
type ProviderReplaySessionStateV2 = ProviderReplaySessionState & {
  appendCustomEntryAsync(customType: string, data: unknown): Promise<string>;
};
/**
 * Provider-owned replay-history sanitization input.
 *
 * Runs after core applies generic transcript cleanup so plugins can make
 * provider-specific replay rewrites without owning the whole compaction flow.
 */
type ProviderSanitizeReplayHistoryContext = ProviderReplayPolicyContext & {
  sessionId: string;
  messages: AgentMessage[];
  allowedToolNames?: Iterable<string>;
  sessionState?: ProviderReplaySessionState;
};
/** Replay input with required worker-backed persistence when session state is present. */
type ProviderSanitizeReplayHistoryContextV2 = Omit<ProviderSanitizeReplayHistoryContext, "sessionState"> & {
  sessionState?: ProviderReplaySessionStateV2;
};
/**
 * Provider-owned final replay-turn validation input.
 *
 * Use this for providers that require strict turn ordering or additional
 * replay-time transcript validation beyond generic sanitation.
 */
type ProviderValidateReplayTurnsContext = ProviderReplayPolicyContext & {
  sessionId?: string;
  messages: AgentMessage[];
  sessionState?: ProviderReplaySessionState;
};
/**
 * Provider-owned tool-schema normalization input.
 *
 * Runs before tool registration for replay/compaction/inference so providers
 * can rewrite schema keywords that their transport family does not support.
 */
type ProviderNormalizeToolSchemasContext = ProviderReplayPolicyContext & {
  tools: AnyAgentTool[];
};
type ProviderToolSchemaDiagnostic = {
  toolName: string;
  toolIndex?: number;
  violations: string[];
};
/**
 * Provider-owned reasoning output mode input.
 *
 * Use this when a provider requires a specific reasoning-output contract, such
 * as text tags instead of native structured reasoning fields.
 */
type ProviderReasoningOutputModeContext = ProviderReplayPolicyContext;
//#endregion
//#region src/llm/model-registry.d.ts
/** Registry abstraction used by model pickers and provider availability checks. */
type ModelRegistry = {
  getAll(): Model[];
  getAvailable(): Model[];
  find(provider: string, modelId: string): Model | undefined;
  hasConfiguredAuth(model: Model): boolean;
};
//#endregion
//#region src/plugins/provider-runtime.types.d.ts
type ModelProviderRequestTransportOverrides = ModelProviderRequestTransportOverrides$1;
type ProviderRuntimeProviderConfig = {
  baseUrl?: string;
  api?: ModelProviderConfig["api"];
  auth?: ModelProviderConfig["auth"];
  models?: ModelProviderConfig["models"];
  headers?: unknown;
};
/**
 * Sync hook for provider-owned model ids that are not present in the local
 * registry/catalog yet.
 *
 * Use this for pass-through providers or provider-specific forward-compat
 * behavior. The hook should be cheap and side-effect free; async refreshes
 * belong in `prepareDynamicModel`.
 */
type ProviderResolveDynamicModelContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  agentRuntimeId?: string;
  provider: string;
  modelId: string;
  modelRegistry: ModelRegistry;
  providerConfig?: ProviderRuntimeProviderConfig;
  authProfileId?: string;
  authProfileMode?: AuthProfileCredential["type"] | "aws-sdk";
};
/**
 * Optional async preparation for dynamic model resolution.
 *
 * Called only from async model resolution paths. Providers can return the
 * requested model directly or refresh reusable metadata before the sync retry.
 */
type ProviderPrepareDynamicModelContext = ProviderResolveDynamicModelContext;
type ProviderPreferRuntimeResolvedModelContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
};
/**
 * Last-chance rewrite hook for provider-owned transport normalization.
 *
 * Runs after OpenClaw resolves an explicit/discovered/dynamic model and before
 * the embedded runner uses it. Typical uses: swap API ids, fix base URLs, or
 * patch provider-specific compat bits.
 */
type ProviderNormalizeResolvedModelContext = ProviderPreferRuntimeResolvedModelContext & {
  model: ProviderRuntimeModel;
};
/**
 * Provider-owned model-id normalization before config/runtime lookup.
 *
 * Use this for provider-specific alias cleanup that should stay with the
 * plugin rather than in core string tables.
 */
type ProviderNormalizeModelIdContext = {
  provider: string;
  modelId: string;
};
/**
 * Provider-owned transport normalization for arbitrary provider/model config.
 *
 * Use this when transport cleanup depends on API/baseUrl rather than the
 * owning provider id, for example custom providers that still target a
 * plugin-owned transport family.
 */
type ProviderNormalizeTransportContext = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  provider: string;
  modelId?: string;
  api?: string | null;
  baseUrl?: string;
};
/**
 * Runtime auth input for providers that need an extra exchange step before
 * inference. The incoming `apiKey` is the raw credential resolved from auth
 * profiles/env/config. The returned value should be the actual token/key to use
 * for the request.
 */
type ProviderPrepareRuntimeAuthContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  modelId: string;
  model: ProviderRuntimeModel;
  apiKey: string;
  authMode: string;
  profileId?: string;
};
/**
 * Result of `prepareRuntimeAuth`.
 *
 * `apiKey` is required and becomes the runtime credential stored in auth
 * storage. `baseUrl` is optional and lets providers like GitHub Copilot swap to
 * an entitlement-specific endpoint at request time. `expiresAt` enables generic
 * background refresh in long-running turns.
 */
type ProviderPreparedRuntimeAuth = {
  apiKey: string;
  baseUrl?: string;
  request?: ModelProviderRequestTransportOverrides;
  expiresAt?: number;
};
/**
 * Usage/billing auth input for providers that expose quota/usage endpoints.
 *
 * This hook is intentionally separate from `prepareRuntimeAuth`: usage
 * snapshots often need a different credential source than live inference
 * requests, and they run outside the embedded runner.
 *
 * The helper methods cover the common OpenClaw auth resolution paths:
 *
 * - `resolveApiKeyFromConfigAndStore`: env/config/plain token/api_key profiles
 * - `resolveOAuthToken`: oauth/token profiles resolved through the auth store,
 *   optionally for an explicit provider override
 *
 * Plugins can still do extra provider-specific work on top (for example parse a
 * token blob, read a legacy credential file, or pick between aliases).
 */
type ProviderResolveUsageAuthContext = {
  /** Cancel provider-owned work when the usage collection deadline expires. */
  signal?: AbortSignal;
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  resolveApiKeyFromConfigAndStore: (params?: {
    providerIds?: string[];
    envDirect?: Array<string | undefined>;
  }) => string | undefined;
  /** Ordered API-key/token candidates, including resolved SecretRefs, for credential classification. */
  resolveApiKeyCandidatesFromConfigAndStore?: (params?: {
    providerIds?: string[];
    envDirect?: Array<string | undefined>;
  }) => Promise<string[]>;
  resolveOAuthToken: (params?: {
    provider?: string;
    excludeProfileIds?: string[];
  }) => Promise<ProviderUsageAuthToken | null>;
};
type ProviderUsageAuthToken = {
  token: string;
  /** Provider-owned grant family used to authorize the usage endpoint. */
  authFlow?: string;
  accountId?: string;
  /** Non-secret plan metadata from the resolved credential (e.g. Claude "max"). */
  subscriptionType?: string;
  rateLimitTier?: string;
  /** Account email captured on the resolved credential, when known. */
  email?: string;
};
/**
 * Result of `resolveUsageAuth`.
 *
 * Two shapes are supported:
 * - `{ token: string; accountId?: string }` — use this token for provider usage endpoints.
 * - `{ handled: true }` — this provider handled the request but has no usable
 *   usage token; core must skip further fallback (generic API-key/OAuth fallback
 *   must not run).
 *
 * Returning `null` or `undefined` means "not handled by this provider"; core
 * proceeds to generic fallback resolution.
 */
type ProviderResolvedUsageAuth = ProviderUsageAuthToken | {
  handled: true;
};
/**
 * Usage/quota snapshot input for providers that own their usage endpoint
 * fetch/parsing behavior.
 *
 * This hook runs after `resolveUsageAuth` succeeds. Core still owns summary
 * fan-out, timeout wrapping, filtering, and formatting; the provider plugin
 * owns the provider-specific HTTP request + response normalization.
 */
type ProviderFetchUsageSnapshotContext = ProviderUsageAuthToken & {
  /** Custom transports must preserve this signal; fetchFn already includes it. */
  signal?: AbortSignal;
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  authProfileId?: string;
  timeoutMs: number;
  fetchFn: typeof fetch;
};
/**
 * Provider-owned auth-doctor hint input.
 *
 * Called when OAuth refresh fails and OpenClaw wants a provider-specific repair
 * hint to append to the generic re-auth message. Use this for legacy profile-id
 * migrations or other provider-owned auth-store cleanup guidance.
 */
type ProviderAuthDoctorHintContext = {
  config?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  profileId?: string;
};
/**
 * Provider-owned extra-param normalization before OpenClaw builds its generic
 * stream option wrapper.
 *
 * Use this to set provider defaults or rewrite provider-specific config keys
 * into the merged `extraParams` object. Return the full next extraParams object.
 */
/** Provider-facing effort after OpenClaw lowers orchestration-only modes. */
type ProviderTransportThinkingLevel = Exclude<ThinkLevel, "ultra">;
type ProviderPrepareExtraParamsContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  agentId?: string;
  /** Selected credential facts; excludes credential material. */
  auth?: {
    mode: string;
    authFlow?: string;
  };
  nativeWebSearchAllowedByToolPolicy?: boolean;
  provider: string;
  modelId: string;
  model?: ProviderRuntimeModel;
  extraParams?: Record<string, unknown>;
  thinkingLevel?: ProviderTransportThinkingLevel;
};
type ProviderExtraParamsForTransportContext = Omit<ProviderPrepareExtraParamsContext, "extraParams"> & {
  model?: ProviderRuntimeModel;
  transport?: "sse" | "websocket" | "websocket-cached" | "auto";
  extraParams: Record<string, unknown>;
};
type ProviderExtraParamsForTransportResult = {
  patch?: Record<string, unknown> | null;
};
type ProviderResolvePromptOverlayContext = ProviderSystemPromptContributionContext & {
  baseOverlay?: ProviderSystemPromptContribution;
};
type ProviderFollowupFallbackRouteContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  payload: ReplyPayload;
  originatingChannel?: string;
  originatingTo?: string;
  originRoutable: boolean;
  dispatcherAvailable: boolean;
};
type ProviderFollowupFallbackRouteResult = {
  route?: "origin" | "dispatcher" | "drop";
  reason?: string;
};
type ProviderResolveAuthProfileIdContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  preferredProfileId?: string;
  lockedProfileId?: string;
  profileOrder: string[];
  authStore: AuthProfileStore;
};
//#endregion
//#region src/agents/provider-local-service-reconcile.d.ts
type ProviderLocalServiceReconcileContext = {
  baseUrl: string;
  signal?: AbortSignal;
};
//#endregion
//#region src/plugins/provider-transport.types.d.ts
/**
 * Provider-owned transport creation.
 *
 * Use this when the provider needs to replace shared model runtime's default transport with a
 * custom StreamFn (for example a native API transport that cannot be expressed
 * as a wrapper around `streamSimple`).
 */
type ProviderCreateStreamFnContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  model: ProviderRuntimeModel;
};
/**
 * Provider-owned stream wrapper hook after OpenClaw applies its generic
 * transport-independent wrappers.
 *
 * Use this for provider-specific payload/header/model mutations that still run
 * through the normal `shared model runtime` stream path.
 */
type ProviderWrapStreamFnContext = ProviderPrepareExtraParamsContext & {
  model?: ProviderRuntimeModel;
  /** Wire-format API before simple completion projects an internal transport alias. */
  sourceApi?: ProviderRuntimeModel["api"];
  streamFn?: StreamFn;
};
/** Healthy local service boundary before the provider request is sent. */
type ProviderReconcileLocalServiceContext = ProviderLocalServiceReconcileContext;
/**
 * Provider-owned WebSocket session policy.
 */
type ProviderWebSocketSessionPolicy = {
  headers?: Record<string, string>;
  degradeCooldownMs?: number;
};
/**
 * Provider-owned transport turn state.
 *
 * Use this for provider-native request headers or metadata that should stay
 * stable across retries while still being attached by generic core transports.
 */
type ProviderTransportTurnState = {
  headers?: Record<string, string>;
  metadata?: Record<string, string>;
  websocket?: ProviderWebSocketSessionPolicy;
};
/**
 * Provider-owned request identity for transport turns.
 *
 * Use this when the provider exposes native request/session metadata that must
 * be attached by both HTTP and WebSocket transports.
 */
type ProviderResolveTransportTurnStateContext = {
  provider: string;
  modelId: string;
  model?: ProviderRuntimeModel;
  sessionId?: string;
  turnId: string;
  attempt: number;
  transport: "stream" | "websocket";
};
/**
 * Provider-owned WebSocket session policy input.
 */
type ProviderResolveWebSocketSessionPolicyContext = {
  provider: string;
  modelId: string;
  model?: ProviderRuntimeModel;
  sessionId?: string;
};
/**
 * Provider-owned failover error classification input.
 *
 * Use this when provider-specific transport or API errors need classification
 * hints that generic string matching cannot express safely.
 */
type ProviderFailoverErrorContext = {
  provider?: string;
  modelId?: string;
  errorMessage: string;
  status?: number;
  code?: string;
  errorType?: string;
};
/**
 * Generic embedding provider shape returned by provider plugins.
 *
 * Keep this aligned with the memory embedding contract without forcing the
 * plugin system to import memory internals directly.
 */
type PluginEmbeddingProvider = {
  id: string;
  model: string;
  maxInputTokens?: number;
  embedQuery: (text: string, options?: {
    signal?: AbortSignal;
  }) => Promise<number[]>;
  embedBatch: (texts: string[], options?: {
    signal?: AbortSignal;
  }) => Promise<number[][]>;
  embedBatchInputs?: (inputs: unknown[], options?: {
    signal?: AbortSignal;
  }) => Promise<number[][]>;
  client?: unknown;
};
/**
 * Provider-owned embedding transport creation.
 *
 * Use this when a provider wants memory embeddings to live with the provider
 * plugin instead of the core memory switchboard.
 */
type ProviderCreateEmbeddingProviderContext = {
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  model: string;
  remote?: {
    baseUrl?: string;
    apiKey?: unknown;
    headers?: Record<string, string>;
  };
  providerApiKey?: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  outputDimensionality?: number;
  taskType?: string;
};
/**
 * Provider-owned prompt-cache eligibility.
 *
 * Return `true` or `false` to override OpenClaw's built-in provider cache TTL
 * detection for this provider. Return `undefined` to fall back to core rules.
 */
type ProviderCacheTtlEligibilityContext = {
  provider: string;
  modelId: string;
  modelApi?: string;
  baseUrl?: string;
  supportsPromptCacheKey?: boolean;
};
/**
 * Provider-owned missing-auth message override.
 *
 * Runs only after OpenClaw exhausts normal env/profile/config auth resolution
 * for the requested provider. Return a custom message to replace the generic
 * "No API key found" error.
 */
type ProviderBuildMissingAuthMessageContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  listProfileIds: (providerId: string) => string[];
};
/**
 * Provider-owned unknown-model hint override.
 *
 * Runs after catalog/runtime lookup misses for the requested provider. Return a
 * hint suffix that OpenClaw should append to the generic `Unknown model`
 * error.
 */
type ProviderBuildUnknownModelHintContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  modelId: string;
  baseUrl?: string;
};
//#endregion
//#region src/plugins/provider-plugin.types.d.ts
type ProviderPlugin = {
  id: string;
  pluginId?: string;
  /** Loader-owned dependency root, shared by lightweight and full registration. */
  pluginRoot?: string;
  label: string;
  docsPath?: string;
  aliases?: string[];
  /**
   * Internal-only aliases used for runtime/config hook lookup.
   *
   * Unlike `aliases`, these values are not treated as user-facing provider ids
   * for auth/setup surfaces. Use them for legacy config keys or compat-only
   * hook routing.
   */
  hookAliases?: string[];
  /**
   * Provider-related env vars shown in setup/search/help surfaces.
   *
   * Keep entries in preferred display order. This can include direct auth env
   * vars or setup inputs such as OAuth client id/secret vars.
   */
  envVars?: string[];
  auth: ProviderAuthMethod[];
  /**
   * Legacy text-provider catalog hook.
   *
   * @deprecated New catalog/control-plane surfaces should use
   * `api.registerModelCatalogProvider`. This hook remains the text runtime
   * source until the unified loader fully replaces it.
   * Returns provider config/model definitions that merge into models.providers.
   */
  catalog?: ProviderPluginCatalog;
  /**
   * Legacy offline text-provider catalog hook for display-only surfaces.
   *
   * @deprecated New static rows should be registered with
   * `api.registerModelCatalogProvider`.
   *
   * Unlike `catalog`, this hook must not perform network I/O or require real
   * credentials. Use it for bundled/static rows that can be shown before auth is
   * configured.
   */
  staticCatalog?: ProviderPluginCatalog;
  /**
   * Show catalog row labels as the literal `<provider>/<entry.id>`
   * composition instead of the canonical (deduped) key.
   *
   * `modelKey` strips a duplicate `<provider>/` prefix so storage and
   * lookups stay stable. This flag only changes the picker label — the
   * option value and persisted config remain canonical.
   *
   * Set when the leading `<provider>/` segment in the native model id is
   * a meaningful vendor namespace (e.g. NVIDIA's `nvidia/nemotron-...`
   * alongside `moonshotai/kimi-k2.5`).
   */
  preserveLiteralProviderPrefix?: boolean;
  /**
   * Sync runtime fallback for model ids not present in the local catalog.
   *
   * Hook order:
   * 1. discovered/static model lookup
   * 2. plugin `resolveDynamicModel`
   * 3. core fallback heuristics
   * 4. generic provider-config fallback
   *
   * Keep this hook cheap and deterministic. Async model discovery belongs in
   * `prepareDynamicModel`, which can return the prepared model directly.
   */
  resolveDynamicModel?: (ctx: ProviderResolveDynamicModelContext) => ProviderRuntimeModel | null | undefined;
  /**
   * Optional async preparation for dynamic model resolution.
   *
   * OpenClaw calls this only from async model resolution paths. Return the
   * requested model directly, or return nothing to retry `resolveDynamicModel`.
   */
  prepareDynamicModel?: (ctx: ProviderPrepareDynamicModelContext) => Promise<ProviderRuntimeModel | void>;
  /**
   * Lets a provider plugin opt exact configured models into a runtime
   * metadata comparison pass before the embedded runner returns the explicit
   * entry unchanged.
   */
  preferRuntimeResolvedModel?: (ctx: ProviderPreferRuntimeResolvedModelContext) => boolean;
  /**
   * Provider-owned transport normalization.
   *
   * Use this to rewrite a resolved model without forking the generic runner:
   * swap API ids, update base URLs, or adjust compat flags for a provider's
   * transport quirks.
   */
  normalizeResolvedModel?: (ctx: ProviderNormalizeResolvedModelContext) => ProviderRuntimeModel | null | undefined;
  /**
   * Provider-owned model-id normalization.
   *
   * Runs before model lookup/canonicalization. Use this for alias cleanup such
   * as provider-owned preview/legacy model ids.
   */
  normalizeModelId?: (ctx: ProviderNormalizeModelIdContext) => string | null | undefined;
  /**
   * Provider-owned transport-family normalization before generic model
   * assembly.
   *
   * Use this for API/baseUrl cleanup that may apply to custom provider ids
   * which still target the provider's transport family.
   */
  normalizeTransport?: (ctx: ProviderNormalizeTransportContext) => {
    api?: string | null;
    baseUrl?: string;
  } | null | undefined;
  /**
   * Provider-owned config normalization for `models.providers.<id>`.
   *
   * Use this for provider-specific baseUrl/model-id cleanup that should stay
   * with the plugin rather than in core config-policy tables.
   */
  normalizeConfig?: (ctx: ProviderNormalizeConfigContext) => ModelProviderConfig | null | undefined;
  /**
   * Provider-owned final native-streaming compat pass for config providers.
   *
   * Use this when a provider opts specific native base URLs into
   * `supportsUsageInStreaming` or similar transport compatibility flags.
   */
  applyNativeStreamingUsageCompat?: (ctx: ProviderNormalizeConfigContext) => ModelProviderConfig | null | undefined;
  /**
   * Provider-owned config apiKey/env marker resolution.
   *
   * Use this when a provider resolves auth from env vars such as AWS/GCP
   * markers rather than a normal API-key env var.
   */
  resolveConfigApiKey?: (ctx: ProviderResolveConfigApiKeyContext) => string | null | undefined;
  /**
   * Provider-owned replay/compaction policy override.
   *
   * Use this when transcript replay or compaction should follow provider-owned
   * rules that are more expressive than the static `capabilities` bag.
   */
  buildReplayPolicy?: (ctx: ProviderReplayPolicyContext) => ProviderReplayPolicy | null | undefined;
  /**
   * @deprecated Use sanitizeReplayHistoryAsync; removed at the next Plugin SDK major.
   * Provider-owned replay-history sanitization.
   *
   * Runs after OpenClaw performs generic transcript cleanup. Use this for
   * provider-specific replay rewrites that should stay with the provider
   * plugin rather than in shared core compaction helpers.
   */
  sanitizeReplayHistory?: (ctx: ProviderSanitizeReplayHistoryContext) => Promise<AgentMessage[] | null | undefined> | AgentMessage[] | null | undefined;
  /** Replay hook with worker-backed persistence; preferred over the legacy hook when both exist. */
  sanitizeReplayHistoryAsync?: (ctx: ProviderSanitizeReplayHistoryContextV2) => Promise<AgentMessage[] | null | undefined> | AgentMessage[] | null | undefined;
  /**
   * Provider-owned final replay-turn validation.
   *
   * Use this when provider transports need stricter replay-time validation or
   * turn reshaping after generic sanitation. Returning a non-null value
   * replaces the built-in replay validators rather than composing with them.
   */
  validateReplayTurns?: (ctx: ProviderValidateReplayTurnsContext) => Promise<AgentMessage[] | null | undefined> | AgentMessage[] | null | undefined;
  /**
   * Provider-owned tool-schema normalization.
   *
   * Use this for transport-family schema cleanup before OpenClaw registers
   * tools with the embedded runner.
   */
  normalizeToolSchemas?: (ctx: ProviderNormalizeToolSchemasContext) => AnyAgentTool[] | null | undefined;
  /**
   * Provider-owned tool-schema diagnostics after normalization.
   *
   * Use this when a provider wants to surface transport-specific schema
   * warnings without teaching core about provider-specific keyword rules.
   */
  inspectToolSchemas?: (ctx: ProviderNormalizeToolSchemasContext) => ProviderToolSchemaDiagnostic[] | null | undefined;
  /**
   * Provider-owned reasoning output mode.
   *
   * Use this when a provider requires tagged reasoning/final output instead of
   * native structured reasoning fields.
   */
  resolveReasoningOutputMode?: (ctx: ProviderReasoningOutputModeContext) => ProviderReasoningOutputMode | null | undefined;
  /**
   * Provider-owned extra-param normalization before generic stream option
   * wrapping.
   *
   * Typical uses: set provider-default `transport`, map provider-specific
   * config aliases, or inject extra request metadata sourced from
   * `agents.defaults.models.<provider>/<model>.params`.
   */
  prepareExtraParams?: (ctx: ProviderPrepareExtraParamsContext) => Record<string, unknown> | null | undefined;
  /**
   * Provider-owned request params after transport/model resolution.
   *
   * Use this for transport-family request knobs that should be keyed by the
   * resolved model API/transport rather than a hardcoded core allowlist.
   */
  extraParamsForTransport?: (ctx: ProviderExtraParamsForTransportContext) => ProviderExtraParamsForTransportResult | null | undefined;
  /**
   * Provider-owned transport factory.
   *
   * Use this when the provider needs a fully custom StreamFn instead of a
   * wrapper around the normal `streamSimple` path.
   */
  createStreamFn?: (ctx: ProviderCreateStreamFnContext) => StreamFn | null | undefined;
  /**
   * Opt custom streams into the internal stable/dynamic system-prompt boundary.
   * The transport must consume the boundary before sending its provider payload.
   * Otherwise the host strips it before invoking the custom stream.
   */
  supportsSystemPromptCacheBoundary?: boolean;
  /**
   * Provider-owned stream wrapper applied after generic OpenClaw wrappers.
   *
   * Typical uses: provider attribution headers, request-body rewrites, or
   * provider-specific compat payload patches that do not justify a separate
   * transport implementation.
   */
  wrapStreamFn?: (ctx: ProviderWrapStreamFnContext) => StreamFn | null | undefined;
  /**
   * Provider-owned wrapper for direct `completeSimple` callers.
   *
   * Opt in only when the provider must enforce the same wire contract outside
   * the embedded agent runtime.
   * The factory runs once per prepared model; its returned stream retains
   * wrapper-local state and reads per-request options on each invocation.
   */
  wrapSimpleCompletionStreamFn?: (ctx: ProviderWrapStreamFnContext) => StreamFn | null | undefined;
  /** Cheap, idempotent provider repair after local-service health and before each request. */
  reconcileLocalService?: (ctx: ProviderReconcileLocalServiceContext) => Promise<void>;
  /**
   * Provider-owned native transport turn identity.
   *
   * Use this when a provider wants generic transports to attach provider-native
   * request headers or metadata on each turn without hardcoding vendor logic in
   * core.
   */
  resolveTransportTurnState?: (ctx: ProviderResolveTransportTurnStateContext) => ProviderTransportTurnState | null | undefined;
  /**
   * Provider-owned WebSocket session policy.
   *
   * @deprecated Return `websocket` from `resolveTransportTurnState`. When both
   * hooks provide a field, the new hook takes precedence.
   */
  resolveWebSocketSessionPolicy?: (ctx: ProviderResolveWebSocketSessionPolicyContext) => ProviderWebSocketSessionPolicy | null | undefined;
  /**
   * Provider-owned embedding provider factory.
   *
   * Use this when memory embedding behavior belongs with the provider plugin
   * rather than the core embedding switchboard.
   */
  createEmbeddingProvider?: (ctx: ProviderCreateEmbeddingProviderContext) => Promise<PluginEmbeddingProvider | null | undefined> | PluginEmbeddingProvider | null | undefined;
  /**
   * Runtime auth exchange hook.
   *
   * Called after OpenClaw resolves the raw configured credential but before the
   * runner stores it in runtime auth storage. This lets plugins exchange a
   * source credential (for example a GitHub token) into a short-lived runtime
   * token plus optional base URL override.
   */
  prepareRuntimeAuth?: (ctx: ProviderPrepareRuntimeAuthContext) => Promise<ProviderPreparedRuntimeAuth | null | undefined>;
  /**
   * Usage/billing auth resolution hook.
   *
   * Called by provider-usage surfaces (`/usage`, status snapshots, reporting).
   * Use this when a provider's usage endpoint needs provider-owned token
   * extraction, blob parsing, or alias handling.
   */
  resolveUsageAuth?: (ctx: ProviderResolveUsageAuthContext) => Promise<ProviderResolvedUsageAuth | null | undefined> | ProviderResolvedUsageAuth | null | undefined;
  /**
   * Usage/quota snapshot fetch hook.
   *
   * Called after `resolveUsageAuth` by `/usage` and related reporting surfaces.
   * Use this when the provider's usage endpoint or payload shape is
   * provider-specific and you want that logic to live with the provider plugin
   * instead of the core switchboard.
   */
  fetchUsageSnapshot?: (ctx: ProviderFetchUsageSnapshotContext) => Promise<ProviderUsageSnapshot | null | undefined> | ProviderUsageSnapshot | null | undefined;
  /**
   * Provider-owned failover context-overflow matcher.
   *
   * Return true when the provider recognizes the raw error as a context-window
   * overflow shape that generic heuristics would miss.
   */
  matchesContextOverflowError?: (ctx: ProviderFailoverErrorContext) => boolean | undefined;
  /**
   * Provider-owned failover error classification.
   *
   * Return a failover reason when the provider recognizes a provider-specific
   * raw error shape. Return undefined to fall back to generic classification.
   */
  classifyFailoverReason?: (ctx: ProviderFailoverErrorContext) => FailoverReason | null | undefined;
  /**
   * Provider-owned cache TTL eligibility.
   *
   * Use this when a proxy provider supports Anthropic-style prompt caching for
   * only a subset of upstream models.
   */
  isCacheTtlEligible?: (ctx: ProviderCacheTtlEligibilityContext) => boolean | undefined;
  /**
   * Provider-owned missing-auth message override.
   *
   * Return a custom message when the provider wants a more specific recovery
   * hint than OpenClaw's generic auth-store guidance.
   */
  buildMissingAuthMessage?: (ctx: ProviderBuildMissingAuthMessageContext) => string | null | undefined;
  /**
   * Provider-owned unknown-model hint override.
   *
   * Return a suffix when the provider wants a more specific recovery hint than
   * OpenClaw's generic `Unknown model` error after catalog/runtime lookup
   * fails.
   */
  buildUnknownModelHint?: (ctx: ProviderBuildUnknownModelHintContext) => string | null | undefined;
  /**
   * Provider-owned built-in model suppression.
   *
   * Return `{ suppress: true }` to hide a stale upstream row. Include
   * `errorMessage` when OpenClaw should surface a provider-specific hint for
   * direct model resolution failures.
   *
   * @deprecated Use manifest `modelCatalog.suppressions`. Runtime suppression
   * hooks are no longer called by model resolution.
   */
  suppressBuiltInModel?: (ctx: ProviderBuiltInModelSuppressionContext) => ProviderBuiltInModelSuppressionResult | null | undefined;
  /**
   * Provider-owned final catalog augmentation.
   *
   * @deprecated Use `api.registerModelCatalogProvider` for supplemental catalog
   * rows. This hook is kept only for existing text-provider runtime
   * compatibility during the migration window.
   *
   * Return extra rows to append to the final catalog after discovery/config
   * merging. OpenClaw deduplicates by `provider/id`, so plugins only need to
   * describe the desired supplemental rows.
   */
  augmentModelCatalog?: (ctx: ProviderAugmentModelCatalogContext) => Array<ModelCatalogEntry> | ReadonlyArray<ModelCatalogEntry> | Promise<Array<ModelCatalogEntry> | ReadonlyArray<ModelCatalogEntry> | null | undefined> | null | undefined;
  /**
   * Provider-owned thinking level profile.
   *
   * Prefer this over the individual thinking capability hooks when a provider
   * or model exposes a custom set of thinking levels. OpenClaw stores the
   * canonical `id`, shows `label` when provided, and downgrades stale stored
   * values by profile rank.
   */
  resolveThinkingProfile?: (ctx: ProviderDefaultThinkingPolicyContext) => ProviderThinkingProfile | null | undefined;
  /** Whether Fast can affect this selected request; undefined retains existing unknown behavior. */
  resolveFastModeSupport?: (ctx: ProviderFastModePolicyContext) => boolean | undefined;
  /**
   * Provider-owned system-prompt contribution.
   *
   * Use this when a provider/model family needs cache-aware prompt tuning
   * without replacing the full OpenClaw-owned system prompt.
   */
  resolveSystemPromptContribution?: (ctx: ProviderSystemPromptContributionContext) => ProviderSystemPromptContribution | null | undefined;
  /**
   * Provider-owned GPT/model prompt overlay seam.
   *
   * Runs after OpenClaw's built-in overlay is resolved and before the
   * provider's regular system-prompt contribution is merged.
   */
  resolvePromptOverlay?: (ctx: ProviderResolvePromptOverlayContext) => ProviderSystemPromptContribution | null | undefined;
  /**
   * Provider-owned fallback route override for model/profile failure handling.
   *
   * Return undefined/null to keep OpenClaw's default fallback policy.
   */
  followupFallbackRoute?: (ctx: ProviderFollowupFallbackRouteContext) => ProviderFollowupFallbackRouteResult | null | undefined;
  /**
   * Provider-owned auth profile resolver.
   *
   * Return a profile id from the supplied order to prefer it for this attempt;
   * invalid or missing ids are ignored by core.
   */
  resolveAuthProfileId?: (ctx: ProviderResolveAuthProfileIdContext) => string | null | undefined;
  /**
   * Provider-owned final system-prompt transform.
   *
   * Use this sparingly when a provider transport needs small compatibility
   * rewrites after OpenClaw has assembled the complete prompt. Return
   * `undefined`/`null` to leave the prompt unchanged.
   */
  transformSystemPrompt?: (ctx: ProviderTransformSystemPromptContext) => string | null | undefined;
  /**
   * Provider-owned bidirectional text replacements.
   *
   * `input` applies to system prompts and text message content before transport.
   * `output` applies to assistant text deltas/final text before OpenClaw handles
   * its own control markers or channel delivery.
   */
  textTransforms?: PluginTextTransforms;
  /**
   * Provider-owned global config defaults.
   *
   * Use this when config materialization needs provider-specific defaults that
   * depend on auth mode, env, or provider model-family semantics.
   */
  applyConfigDefaults?: (ctx: ProviderApplyConfigDefaultsContext) => OpenClawConfig | null | undefined;
  /**
   * Provider-owned "modern model" matcher used by live profile/smoke filters.
   *
   * Return true when the given provider/model ref should be treated as a
   * preferred modern model candidate.
   */
  isModernModelRef?: (ctx: ProviderModernModelPolicyContext) => boolean | undefined;
  wizard?: ProviderPluginWizard;
  /**
   * Provider-owned auth-profile API-key formatter.
   *
   * OpenClaw uses this when a stored auth profile is already valid and needs to
   * be converted into the runtime `apiKey` string expected by the provider. Use
   * this for providers whose auth profile stores extra metadata alongside the
   * bearer token (for example Gemini CLI's `{ token, projectId }` payload).
   */
  formatApiKey?: (cred: AuthProfileCredential) => string;
  /**
   * Provider-owned OAuth login adapter for the session SDK AuthStorage API.
   *
   * This keeps the public callback-based login contract usable without seeding
   * provider implementations into core. Modern setup flows should use `auth`.
   */
  loginOAuth?: (callbacks: OAuthLoginCallbacks) => Promise<OAuthCredentials>;
  /**
   * Legacy auth-profile ids that generic auth must ignore and `openclaw doctor` should remove.
   *
   * Use this when a provider plugin replaces an older core-managed profile id
   * and wants cleanup/migration messaging to live with the provider instead of
   * in hardcoded doctor tables. A runtime-only external CLI profile remains usable by its exact
   * provider when it intentionally reuses a retired id.
   */
  deprecatedProfileIds?: string[];
  /**
   * Legacy OAuth profile-id migrations that `openclaw doctor` should offer.
   *
   * Use this when a provider moved from a legacy default OAuth profile id to a
   * newer identity-based id and wants doctor to own the config rewrite without
   * another core-specific migration branch.
   */
  oauthProfileIdRepairs?: ProviderOAuthProfileIdRepair[];
  /**
   * Provider-owned OAuth refresh.
   *
   * OpenClaw calls this before falling back to the shared `shared model runtime` OAuth
   * refreshers. Use it when the provider has a custom refresh endpoint, or when
   * the provider needs custom refresh-failure behavior that should stay out of
   * core auth-profile code. The optional second argument is the caller's
   * effective config; prefer it over reading global runtime config.
   */
  refreshOAuth?: (cred: OAuthCredential, config?: OpenClawConfig) => Promise<OAuthCredential>;
  /**
   * Provider-owned auth-doctor hint.
   *
   * Return a multiline repair hint when OAuth refresh fails and the provider
   * wants to steer users toward a specific auth-profile migration or recovery
   * path. Return nothing to keep OpenClaw's generic error text.
   */
  buildAuthDoctorHint?: (ctx: ProviderAuthDoctorHintContext) => string | Promise<string | null | undefined> | null | undefined;
  /**
   * Provider-owned config-backed auth resolution.
   *
   * Providers own any provider-specific fallback secret rules here so core
   * auth/discovery code can stay generic and avoid parsing provider-private
   * config layouts.
   *
   * The returned `apiKey` may be:
   * - a real credential from the active runtime snapshot, suitable for runtime use
   * - a non-secret marker (for example a managed SecretRef marker), suitable only
   *   for discovery/bootstrap callers
   *
   * Runtime callers must not treat non-secret markers as runnable credentials;
   * they should retry against the active runtime snapshot when available.
   *
   * Use this when the provider can operate without a real secret for certain
   * configured local/self-hosted cases and wants auth resolution to treat that
   * config as available.
   */
  resolveSyntheticAuth?: (ctx: ProviderResolveSyntheticAuthContext) => ProviderSyntheticAuthResult | null | undefined;
  /**
   * Prepare external availability before synchronous synthetic-auth reads.
   * Keep process/network I/O here; OpenClaw publishes the completed result for this generation.
   */
  prepareSyntheticAuth?: (ctx: ProviderResolveSyntheticAuthContext & {
    env?: NodeJS.ProcessEnv;
    signal?: AbortSignal;
    pluginRoot?: string;
  }) => Promise<ProviderSyntheticAuthResult | null | undefined>;
  /**
   * Provider-owned external auth profile discovery.
   *
   * Use this when credentials are managed by an external tool and should be visible
   * to runtime auth resolution without being written back into `auth-profiles.json`
   * by core.
   */
  resolveExternalAuthProfiles?: (ctx: ProviderResolveExternalAuthProfilesContext) => Array<ProviderExternalAuthProfile> | ReadonlyArray<ProviderExternalAuthProfile> | null | undefined;
  /**
   * Provider-owned precedence rule for stored synthetic auth profiles.
   *
   * Return true when a stored profile API key is only a provider-owned
   * synthetic placeholder and should yield to env/config-backed auth before
   * OpenClaw falls back to that stored profile.
   */
  shouldDeferSyntheticProfileAuth?: (ctx: ProviderDeferSyntheticProfileAuthContext) => boolean | undefined;
  onModelSelected?: (ctx: ProviderModelSelectedContext) => Promise<void>;
};
//#endregion
//#region src/plugins/provider-hook-runtime-core.d.ts
type ProviderRuntimePluginLookupParams = {
  provider: string;
  providerOwner?: string;
  modelId?: string | null;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  applyAutoEnable?: boolean;
  pluginMetadataSnapshot?: PluginMetadataRegistryView;
};
type ProviderRuntimePluginHandle = ProviderRuntimePluginLookupParams & {
  plugin?: ProviderPlugin;
};
//#endregion
//#region src/agents/prepared-model-runtime.d.ts
declare const { applyRemoteModelCatalogUpdate, advancePreparedModelRuntimeConfig }: {
  applyRemoteModelCatalogUpdate: (getConfig: () => OpenClawConfig, signal?: AbortSignal | undefined) => Promise<RemoteCatalogPublicationResult>;
  advancePreparedModelRuntimeConfig: (config: OpenClawConfig) => void;
  cancel: (reason: Error) => void;
};
//#endregion
//#region src/plugins/provider-hook-runtime.d.ts
declare const { attachModelProviderRuntimePluginHandle, getModelProviderRuntimePluginHandle, resolveLoadedProviderPluginsForHooks, resolveProviderPluginsForHooks, resolveProviderRuntimePlugin, resolveLoadedProviderRuntimePlugin, resolveProviderHookPlugin, resolveProviderRuntimePluginHandle, ensureProviderRuntimePluginHandle, resolveProviderAuthProfileId, resolveProviderFollowupFallbackRoute, wrapProviderSimpleCompletionStreamFn }: Readonly<{
  attachModelProviderRuntimePluginHandle: <TModel extends object>(model: TModel, runtimeHandle: ProviderRuntimePluginHandle) => TModel;
  getModelProviderRuntimePluginHandle: (model: object | undefined) => ProviderRuntimePluginHandle | undefined;
  resolveLoadedProviderPluginsForHooks: (params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    onlyPluginIds?: string[];
    providerRefs?: readonly string[];
    modelRefs?: readonly string[];
    applyAutoEnable?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
  }) => ProviderPlugin[] | undefined;
  resolveProviderPluginsForHooks: (params: Parameters<(params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    onlyPluginIds?: string[];
    providerRefs?: readonly string[];
    modelRefs?: readonly string[];
    applyAutoEnable?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
  }) => ProviderPlugin[] | undefined>[0]) => ProviderPlugin[];
  resolveProviderRuntimePlugin: (params: {
    provider: string;
    providerOwner?: string;
    modelId?: string | null;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    applyAutoEnable?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
  }) => ProviderPlugin | undefined;
  resolveLoadedProviderRuntimePlugin: (params: {
    provider: string;
    providerOwner?: string;
    modelId?: string | null;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    applyAutoEnable?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
  }) => ProviderPlugin | undefined;
  resolveProviderHookPlugin: (params: {
    provider: string;
    modelId?: string | null;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
  }) => ProviderPlugin | undefined;
  resolveProviderRuntimePluginHandle: (params: {
    provider: string;
    providerOwner?: string;
    modelId?: string | null;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    applyAutoEnable?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
  }) => ProviderRuntimePluginHandle;
  ensureProviderRuntimePluginHandle: (params: {
    provider: string;
    providerOwner?: string;
    modelId?: string | null;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    applyAutoEnable?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
  } & {
    runtimeHandle?: ProviderRuntimePluginHandle;
  }) => ProviderRuntimePluginHandle;
  resolveProviderAuthProfileId: (params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    runtimeHandle?: ProviderRuntimePluginHandle;
    context: ProviderResolveAuthProfileIdContext;
  }) => string | undefined;
  resolveProviderFollowupFallbackRoute: (params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    runtimeHandle?: ProviderRuntimePluginHandle;
    context: ProviderFollowupFallbackRouteContext;
  }) => ProviderFollowupFallbackRouteResult | undefined;
  wrapProviderSimpleCompletionStreamFn: (params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    runtimeHandle?: ProviderRuntimePluginHandle;
    context: ProviderWrapStreamFnContext;
  }) => StreamFn$1 | undefined;
}>;
//#endregion
//#region src/plugins/provider-external-auth.d.ts
declare const { resolveExternalAuthProfilesWithPlugins }: Readonly<{
  resolveExternalAuthProfilesWithPlugins: (params: Parameters<ProviderExternalAuthProfileResolver>[0]) => ReturnType<ProviderExternalAuthProfileResolver>;
}>;
//#endregion
//#region src/agents/sessions/keybindings.d.ts
/** OpenClaw-specific key ids added to the shared pi-tui keybinding registry. */
type AppKeybindings = Record<Exclude<keyof typeof KEYBINDINGS, keyof typeof TUI_KEYBINDINGS>, true>;
declare module "@earendil-works/pi-tui" {
  interface Keybindings extends AppKeybindings {}
}
/** Complete keybinding definition map consumed by the TUI keybinding manager. */
declare const KEYBINDINGS: {
  readonly "tui.editor.cursorUp": {
    readonly defaultKeys: "up";
    readonly description: "Move cursor up";
  };
  readonly "tui.editor.cursorDown": {
    readonly defaultKeys: "down";
    readonly description: "Move cursor down";
  };
  readonly "tui.editor.historyPrevious": {
    readonly defaultKeys: [];
    readonly description: "Select previous prompt history entry";
  };
  readonly "tui.editor.historyNext": {
    readonly defaultKeys: [];
    readonly description: "Select next prompt history entry";
  };
  readonly "tui.editor.cursorLeft": {
    readonly defaultKeys: ["left", "ctrl+b"];
    readonly description: "Move cursor left";
  };
  readonly "tui.editor.cursorRight": {
    readonly defaultKeys: ["right", "ctrl+f"];
    readonly description: "Move cursor right";
  };
  readonly "tui.editor.cursorWordLeft": {
    readonly defaultKeys: ["alt+left", "ctrl+left", "alt+b"];
    readonly description: "Move cursor word left";
  };
  readonly "tui.editor.cursorWordRight": {
    readonly defaultKeys: ["alt+right", "ctrl+right", "alt+f"];
    readonly description: "Move cursor word right";
  };
  readonly "tui.editor.cursorLineStart": {
    readonly defaultKeys: ["home", "ctrl+home", "ctrl+a"];
    readonly description: "Move to line start";
  };
  readonly "tui.editor.cursorLineEnd": {
    readonly defaultKeys: ["end", "ctrl+end", "ctrl+e"];
    readonly description: "Move to line end";
  };
  readonly "tui.editor.jumpForward": {
    readonly defaultKeys: "ctrl+]";
    readonly description: "Jump forward to character";
  };
  readonly "tui.editor.jumpBackward": {
    readonly defaultKeys: "ctrl+alt+]";
    readonly description: "Jump backward to character";
  };
  readonly "tui.editor.pageUp": {
    readonly defaultKeys: ["pageUp", "ctrl+pageUp"];
    readonly description: "Page up";
  };
  readonly "tui.editor.pageDown": {
    readonly defaultKeys: ["pageDown", "ctrl+pageDown"];
    readonly description: "Page down";
  };
  readonly "tui.editor.deleteCharBackward": {
    readonly defaultKeys: "backspace";
    readonly description: "Delete character backward";
  };
  readonly "tui.editor.deleteCharForward": {
    readonly defaultKeys: ["delete", "ctrl+d"];
    readonly description: "Delete character forward";
  };
  readonly "tui.editor.deleteWordBackward": {
    readonly defaultKeys: ["ctrl+w", "alt+backspace"];
    readonly description: "Delete word backward";
  };
  readonly "tui.editor.deleteWordForward": {
    readonly defaultKeys: ["alt+d", "alt+delete"];
    readonly description: "Delete word forward";
  };
  readonly "tui.editor.deleteToLineStart": {
    readonly defaultKeys: "ctrl+u";
    readonly description: "Delete to line start";
  };
  readonly "tui.editor.deleteToLineEnd": {
    readonly defaultKeys: "ctrl+k";
    readonly description: "Delete to line end";
  };
  readonly "tui.editor.yank": {
    readonly defaultKeys: "ctrl+y";
    readonly description: "Yank";
  };
  readonly "tui.editor.yankPop": {
    readonly defaultKeys: "alt+y";
    readonly description: "Yank pop";
  };
  readonly "tui.editor.undo": {
    readonly defaultKeys: "ctrl+-";
    readonly description: "Undo";
  };
  readonly "tui.input.newLine": {
    readonly defaultKeys: ["shift+enter", "ctrl+j"];
    readonly description: "Insert newline";
  };
  readonly "tui.input.submit": {
    readonly defaultKeys: "enter";
    readonly description: "Submit input";
  };
  readonly "tui.input.tab": {
    readonly defaultKeys: "tab";
    readonly description: "Tab / autocomplete";
  };
  readonly "tui.input.copy": {
    readonly defaultKeys: "ctrl+c";
    readonly description: "Copy selection";
  };
  readonly "tui.select.up": {
    readonly defaultKeys: "up";
    readonly description: "Move selection up";
  };
  readonly "tui.select.down": {
    readonly defaultKeys: "down";
    readonly description: "Move selection down";
  };
  readonly "tui.select.pageUp": {
    readonly defaultKeys: "pageUp";
    readonly description: "Selection page up";
  };
  readonly "tui.select.pageDown": {
    readonly defaultKeys: "pageDown";
    readonly description: "Selection page down";
  };
  readonly "tui.select.confirm": {
    readonly defaultKeys: "enter";
    readonly description: "Confirm selection";
  };
  readonly "tui.select.cancel": {
    readonly defaultKeys: ["escape", "ctrl+c"];
    readonly description: "Cancel selection";
  };
  readonly "tui.altScreen.pageUp": {
    readonly defaultKeys: "pageUp";
    readonly description: "Scroll viewport up one page";
  };
  readonly "tui.altScreen.pageDown": {
    readonly defaultKeys: "pageDown";
    readonly description: "Scroll viewport down one page";
  };
  readonly "tui.altScreen.halfPageUp": {
    readonly defaultKeys: [];
    readonly description: "Scroll viewport up half a page";
  };
  readonly "tui.altScreen.halfPageDown": {
    readonly defaultKeys: [];
    readonly description: "Scroll viewport down half a page";
  };
  readonly "tui.altScreen.lineUp": {
    readonly defaultKeys: [];
    readonly description: "Scroll viewport up one line";
  };
  readonly "tui.altScreen.lineDown": {
    readonly defaultKeys: [];
    readonly description: "Scroll viewport down one line";
  };
  readonly "tui.altScreen.previousPrompt": {
    readonly defaultKeys: ["ctrl+shift+up", "ctrl+up"];
    readonly description: "Jump to previous semantic prompt";
  };
  readonly "tui.altScreen.nextPrompt": {
    readonly defaultKeys: ["ctrl+shift+down", "ctrl+down"];
    readonly description: "Jump to next semantic prompt";
  };
  readonly "tui.altScreen.search": {
    readonly defaultKeys: "ctrl+shift+f";
    readonly description: "Search the primary scroll view";
  };
  readonly "tui.altScreen.searchNext": {
    readonly defaultKeys: ["enter", "ctrl+g"];
    readonly description: "Select the next search match";
  };
  readonly "tui.altScreen.searchPrevious": {
    readonly defaultKeys: ["shift+enter", "ctrl+shift+g"];
    readonly description: "Select the previous search match";
  };
  readonly "tui.altScreen.searchClose": {
    readonly defaultKeys: "escape";
    readonly description: "Close transcript search";
  };
  readonly "tui.altScreen.top": {
    readonly defaultKeys: "home";
    readonly description: "Scroll viewport to top";
  };
  readonly "tui.altScreen.bottom": {
    readonly defaultKeys: "end";
    readonly description: "Scroll viewport to bottom";
  };
  readonly "app.interrupt": {
    readonly defaultKeys: "escape";
    readonly description: "Cancel or abort";
  };
  readonly "app.clear": {
    readonly defaultKeys: "ctrl+c";
    readonly description: "Clear editor";
  };
  readonly "app.exit": {
    readonly defaultKeys: "ctrl+d";
    readonly description: "Exit when editor is empty";
  };
  readonly "app.suspend": {
    readonly defaultKeys: "ctrl+z" | never[];
    readonly description: "Suspend to background";
  };
  readonly "app.thinking.cycle": {
    readonly defaultKeys: "shift+tab";
    readonly description: "Cycle thinking level";
  };
  readonly "app.model.cycleForward": {
    readonly defaultKeys: "ctrl+p";
    readonly description: "Cycle to next model";
  };
  readonly "app.model.cycleBackward": {
    readonly defaultKeys: "shift+ctrl+p";
    readonly description: "Cycle to previous model";
  };
  readonly "app.model.select": {
    readonly defaultKeys: "ctrl+l";
    readonly description: "Open model selector";
  };
  readonly "app.tools.expand": {
    readonly defaultKeys: "ctrl+o";
    readonly description: "Toggle tool output";
  };
  readonly "app.thinking.toggle": {
    readonly defaultKeys: "ctrl+t";
    readonly description: "Toggle thinking blocks";
  };
  readonly "app.session.toggleNamedFilter": {
    readonly defaultKeys: "ctrl+n";
    readonly description: "Toggle named session filter";
  };
  readonly "app.editor.external": {
    readonly defaultKeys: "ctrl+g";
    readonly description: "Open external editor";
  };
  readonly "app.message.followUp": {
    readonly defaultKeys: "alt+enter";
    readonly description: "Queue follow-up message";
  };
  readonly "app.message.dequeue": {
    readonly defaultKeys: "alt+up";
    readonly description: "Restore queued messages";
  };
  readonly "app.clipboard.pasteImage": {
    readonly defaultKeys: "alt+v" | "ctrl+v";
    readonly description: "Paste image from clipboard";
  };
  readonly "app.session.new": {
    readonly defaultKeys: [];
    readonly description: "Start a new session";
  };
  readonly "app.session.tree": {
    readonly defaultKeys: [];
    readonly description: "Open session tree";
  };
  readonly "app.session.fork": {
    readonly defaultKeys: [];
    readonly description: "Fork current session";
  };
  readonly "app.session.resume": {
    readonly defaultKeys: [];
    readonly description: "Resume a session";
  };
  readonly "app.tree.foldOrUp": {
    readonly defaultKeys: ["ctrl+left", "alt+left"];
    readonly description: "Fold tree branch or move up";
  };
  readonly "app.tree.unfoldOrDown": {
    readonly defaultKeys: ["ctrl+right", "alt+right"];
    readonly description: "Unfold tree branch or move down";
  };
  readonly "app.tree.editLabel": {
    readonly defaultKeys: "shift+l";
    readonly description: "Edit tree label";
  };
  readonly "app.tree.toggleLabelTimestamp": {
    readonly defaultKeys: "shift+t";
    readonly description: "Toggle tree label timestamps";
  };
  readonly "app.session.togglePath": {
    readonly defaultKeys: "ctrl+p";
    readonly description: "Toggle session path display";
  };
  readonly "app.session.toggleSort": {
    readonly defaultKeys: "ctrl+s";
    readonly description: "Toggle session sort mode";
  };
  readonly "app.session.rename": {
    readonly defaultKeys: "ctrl+r";
    readonly description: "Rename session";
  };
  readonly "app.session.delete": {
    readonly defaultKeys: "ctrl+d";
    readonly description: "Delete session";
  };
  readonly "app.session.deleteNoninvasive": {
    readonly defaultKeys: "ctrl+backspace";
    readonly description: "Delete session when query is empty";
  };
  readonly "app.models.save": {
    readonly defaultKeys: "ctrl+s";
    readonly description: "Save model selection";
  };
  readonly "app.models.enableAll": {
    readonly defaultKeys: "ctrl+a";
    readonly description: "Enable all models";
  };
  readonly "app.models.clearAll": {
    readonly defaultKeys: "ctrl+x";
    readonly description: "Clear all models";
  };
  readonly "app.models.toggleProvider": {
    readonly defaultKeys: "ctrl+p";
    readonly description: "Toggle all models for provider";
  };
  readonly "app.models.reorderUp": {
    readonly defaultKeys: "alt+up";
    readonly description: "Move model up in order";
  };
  readonly "app.models.reorderDown": {
    readonly defaultKeys: "alt+down";
    readonly description: "Move model down in order";
  };
  readonly "app.tree.filter.default": {
    readonly defaultKeys: "ctrl+d";
    readonly description: "Tree filter: default view";
  };
  readonly "app.tree.filter.noTools": {
    readonly defaultKeys: "ctrl+t";
    readonly description: "Tree filter: hide tool results";
  };
  readonly "app.tree.filter.userOnly": {
    readonly defaultKeys: "ctrl+u";
    readonly description: "Tree filter: user messages only";
  };
  readonly "app.tree.filter.labeledOnly": {
    readonly defaultKeys: "ctrl+l";
    readonly description: "Tree filter: labeled entries only";
  };
  readonly "app.tree.filter.all": {
    readonly defaultKeys: "ctrl+a";
    readonly description: "Tree filter: show all entries";
  };
  readonly "app.tree.filter.cycleForward": {
    readonly defaultKeys: "ctrl+o";
    readonly description: "Tree filter: cycle forward";
  };
  readonly "app.tree.filter.cycleBackward": {
    readonly defaultKeys: "shift+ctrl+o";
    readonly description: "Tree filter: cycle backward";
  };
};
//#endregion
export { ProviderAppGuidedSetupContext as a, SecretInputMode as c, ImageGenerationProvider as d, SsrFPolicy as f, ProviderCatalogResult as i, SpeechProviderPlugin as l, ProviderRuntimeModel as n, ProviderAuthMethodNonInteractiveContext as o, WizardPrompter as p, ProviderCatalogContext as r, ProviderAuthResult as s, ProviderPrepareDynamicModelContext as t, MusicGenerationProvider as u };