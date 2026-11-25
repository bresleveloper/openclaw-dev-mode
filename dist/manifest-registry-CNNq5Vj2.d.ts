import { F as PluginBundleFormat, I as PluginConfigUiHint, L as PluginDiagnostic, R as PluginFormat, S as PluginInstallRecord, V as PluginManifestChannelCommandDefaults, nt as ChannelAccountKeyPolicy, r as OpenClawConfig, z as PluginManifest } from "./types.openclaw-D8uW-XQA.js";
import "./types-ACDCRjU-.js";
import { n as RuntimeEnv } from "./runtime-C7vMCRi6.js";
import { t as ThemeDefinition } from "./themes-1UJp4kWv.js";
import { t as Result } from "./result-CJ6jzG61.js";
import { t as PluginOrigin } from "./plugin-origin.types-DXhBLlII.js";
import "@openclaw/fs-safe/advanced";
/**
 * Channel id accepted by plugin helpers, covering built-in chat ids and external plugin ids.
 */
type ChannelId = string | (string & {});
/** User-facing metadata used in docs, pickers, and setup surfaces. */
type ChannelMeta = {
  id: ChannelId;
  label: string;
  selectionLabel: string;
  docsPath: string;
  docsLabel?: string;
  blurb: string;
  order?: number;
  aliases?: readonly string[];
  selectionDocsPrefix?: string;
  selectionDocsOmitLabel?: boolean;
  selectionExtras?: readonly string[];
  detailLabel?: string;
  systemImage?: string;
  markdownCapable?: boolean;
  exposure?: {
    configured?: boolean;
    setup?: boolean;
    docs?: boolean;
  };
  quickstartAllowFrom?: boolean;
  forceAccountBinding?: boolean;
  preferSessionLookupForAnnounceTarget?: boolean;
  preferOver?: readonly string[];
};
type ChannelSetupEnvelope = {
  name?: string;
  token?: string;
  tokenFile?: string;
  useEnv?: boolean;
  defaultTo?: string;
  allowFrom?: string[];
};
/**
 * Compatibility fields with known published readers in the 2026-07-22 registry sweep.
 * Each field is deleted as soon as no published plugin reads it; no version boundary is needed.
 */
type DeprecatedChannelSetupFields = {
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  privateKey?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  secret?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  botToken?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  appToken?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  signingSecret?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  mode?: "socket" | "http" | "relay";
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  cliPath?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  authDir?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  httpUrl?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  httpPort?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  webhookPath?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  webhookUrl?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  userId?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  accessToken?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  password?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  deviceName?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  url?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  baseUrl?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  code?: string;
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  groupChannels?: string[];
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  dmAllowlist?: string[];
  /** @deprecated Declare this field in the owning plugin's setup input type: https://docs.openclaw.ai/plugins/sdk-setup#channel-owned-setup-input-fields. Removed once no published plugin reads it. */
  autoDiscoverChannels?: boolean;
};
/** Generic setup envelope used by CLI, onboarding, and channel-owned setup adapters. */
type ChannelSetupInput = ChannelSetupEnvelope & DeprecatedChannelSetupFields;
type ChannelSetupAdapter<Input extends {
  name?: string;
} = ChannelSetupInput> = {
  /** Prepared plugin-owned policy for setup outside a published Gateway metadata generation. */
  accountKeyPolicy?: ChannelAccountKeyPolicy;
  /** Keep root config as an independent identity when the host adds named accounts. */
  configPromotion?: "preserve-root";
  resolveAccountId?: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    input?: Input;
  }) => string;
  prepareAccountConfigInput?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    input: Input;
    runtime: RuntimeEnv;
  }) => Promise<Input> | Input;
  resolveBindingAccountId?: (params: {
    cfg: OpenClawConfig;
    agentId: string;
    accountId?: string;
  }) => string | undefined;
  applyAccountName?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    name?: string;
  }) => OpenClawConfig;
  applyAccountConfig: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    input: Input;
  }) => OpenClawConfig;
  afterAccountConfigWritten?: (params: {
    previousCfg: OpenClawConfig;
    cfg: OpenClawConfig;
    accountId: string;
    input: Input;
    runtime: RuntimeEnv;
  }) => Promise<void> | void;
  validateInput?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    input: Input;
  }) => string | null;
  singleAccountKeysToMove?: readonly string[];
  namedAccountPromotionKeys?: readonly string[];
  resolveSingleAccountPromotionTarget?: (params: {
    channel: Record<string, unknown>;
  }) => string | undefined;
};
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
type ChannelSetupFieldValue<Field extends ChannelSetupField> = Field extends {
  kind: "boolean";
} ? boolean : Field extends {
  kind: "integer";
} ? number : Field extends {
  kind: "string-list";
} ? string[] : Field extends {
  kind: "choice";
  choices: infer Choices extends readonly string[];
} ? Choices[number] : string;
type ChannelSetupInputForFields<Fields extends Record<string, ChannelSetupField>> = {
  name?: string;
} & { [Key in keyof Fields]?: ChannelSetupFieldValue<Fields[Key]>; };
type ChannelSetupParseResult = Result<unknown, string>;
type ChannelSetupContractAdapterParams<Fields extends Record<string, ChannelSetupField>> = {
  adapter: ChannelSetupAdapter<ChannelSetupInputForFields<Fields>>;
  legacyAdapter?: never;
} | {
  adapter?: never;
  legacyAdapter: ChannelSetupAdapter;
};
type ChannelOwnedSetupContract = Omit<ChannelSetupAdapter<{
  name?: string;
}>, "resolveAccountId" | "prepareAccountConfigInput" | "applyAccountConfig" | "afterAccountConfigWritten" | "validateInput"> & {
  kind: "channel-owned";
  metadata: ChannelSetupMetadata;
  parseInput: (input: unknown) => ChannelSetupParseResult;
  resolveAccountId?: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    input?: unknown;
  }) => string;
  prepareAccountConfigInput?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    input: unknown;
    runtime: RuntimeEnv;
  }) => Promise<object> | object;
  applyAccountConfig: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    input: unknown;
  }) => OpenClawConfig;
  afterAccountConfigWritten?: (params: {
    previousCfg: OpenClawConfig;
    cfg: OpenClawConfig;
    accountId: string;
    input: unknown;
    runtime: RuntimeEnv;
  }) => Promise<void> | void;
  validateInput?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    input: unknown;
  }) => string | null;
};
declare function defineChannelSetupContract<const Fields extends Record<string, ChannelSetupField>>(params: {
  fields: Fields;
} & ChannelSetupContractAdapterParams<Fields>): ChannelOwnedSetupContract;
/** Canonical metadata key shared by package manifests and plugin catalogs. */
declare const MANIFEST_KEY: "openclaw";
/** package.json OpenClaw metadata used for plugin setup and catalog discovery. */
type PluginPackageChannel = Partial<Omit<ChannelMeta, "id">> & {
  id?: string;
  /** Closed manifest flags for approval behavior available before the channel runtime loads. */
  approvalFlags?: readonly "native"[];
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
    /** Awaited checker preferred by runtime discovery; the synchronous export remains for older hosts. */
    exportNameAsync?: string;
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
type PluginPackageChannelCliOption = ChannelSetupMetadata["fields"][number]["cli"] & {
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
/** Dependency name-to-version map from a plugin package manifest. */
type PluginDependencySpecMap = Record<string, string>;
type PluginDependencyEntry = {
  name: string;
  spec: string;
  installed: boolean;
  optional: boolean;
  resolvedPath?: string;
};
type PluginDependencyStatus = {
  hasDependencies: boolean;
  installed: boolean;
  requiredInstalled: boolean;
  optionalInstalled: boolean;
  missing: string[];
  missingOptional: string[];
  dependencies: PluginDependencyEntry[];
  optionalDependencies: PluginDependencyEntry[];
};
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
/** Captured beside the trust decision; consumers never rediscover installation facts. */
type PluginTrust = {
  reason: "bundled" | "trusted-official" | "record-missing" | "owner-ambiguous" | "origin-path" | "install-path-mismatch" | "provenance-missing" | "provenance-invalid" | "third-party-npm";
  registryPath: string | null;
  origin: PluginOrigin | "unknown";
  installSource?: PluginInstallRecord["source"];
  installSpec?: string;
};
type PluginManifestRecordStatic = Omit<PluginManifest, "capabilityCatalogEntry" | "channels" | "cliBackends" | "configSchema" | "enabledByDefaultOnPlatforms" | "providerCatalogEntry" | "providers" | "requiresPlugins" | "skills" | "uiHints">;
type PluginThemeArtwork = {
  icons?: Record<string, {
    svg: string;
  }>;
  hats?: Record<string, {
    svg: string;
  }>;
  critters?: Record<string, {
    svg: string;
    title?: string;
    crossMs?: number;
  }>;
  /** Base64 keeps the bytes immutable inside frozen metadata snapshots, which cannot freeze Buffers. */
  backgrounds?: Partial<Record<"light" | "dark", {
    base64: string;
  }>>;
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
  agentSkillsDir?: string;
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
export { PluginDependencyStatus as a, PluginPackageInstall as c, ChannelSetupAdapter as d, ChannelSetupInput as f, PluginDiscoveryResult as i, ChannelOwnedSetupContract as l, ChannelId as m, PluginManifestRegistry as n, OpenClawPackageBuild as o, ChannelMeta as p, PluginTrust as r, PluginPackageChannel as s, PluginManifestRecord as t, defineChannelSetupContract as u };