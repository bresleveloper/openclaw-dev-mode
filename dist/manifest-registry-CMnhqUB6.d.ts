import { en as PluginBundleFormat, in as PluginManifest, j as PluginInstallRecord, nn as PluginDiagnostic, on as PluginManifestChannelCommandDefaults, r as OpenClawConfig, rn as PluginFormat, tn as PluginConfigUiHint, yn as ChannelAccountKeyPolicy } from "./types.openclaw-LzSbb55e.js";
import "./types-BnfxNjkF.js";
import { n as RuntimeEnv } from "./runtime-DlqUc5_p.js";
import { t as PluginOrigin } from "./plugin-origin.types-DOQEvsWL.js";
import "./fs-safe-defaults-ypw0M2Xi.js";
import "@openclaw/fs-safe/advanced";
//#region src/channels/plugins/setup-input.d.ts
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
//#endregion
//#region src/channels/plugins/setup-adapter.types.d.ts
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
//#endregion
//#region src/channels/plugins/setup-contract.d.ts
type ChannelSetupCliOption = {
  flags: string;
  negatedFlags?: string;
  description: string;
  defaultValue?: boolean | string;
};
type ChannelSetupStringField = {
  kind: "string";
  sensitive?: boolean;
  cli: ChannelSetupCliOption;
};
type ChannelSetupBooleanField = {
  kind: "boolean";
  cli: ChannelSetupCliOption;
  envVars?: readonly string[];
  envVarMode?: "all" | "any";
};
type ChannelSetupIntegerField = {
  kind: "integer";
  cli: ChannelSetupCliOption;
};
type ChannelSetupStringListField = {
  kind: "string-list";
  sensitive?: boolean;
  cli: ChannelSetupCliOption;
};
type ChannelSetupChoiceField<Choices extends readonly string[] = readonly string[]> = {
  kind: "choice";
  choices: Choices;
  cli: ChannelSetupCliOption;
};
type ChannelSetupField = ChannelSetupStringField | ChannelSetupBooleanField | ChannelSetupIntegerField | ChannelSetupStringListField | ChannelSetupChoiceField;
type ChannelSetupFieldMetadataFor<Field extends ChannelSetupField> = Field extends ChannelSetupField ? Field & {
  key: string;
} : never;
type ChannelSetupFieldMetadata = ChannelSetupFieldMetadataFor<ChannelSetupField>;
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
type ChannelSetupParseResult = {
  ok: true;
  value: unknown;
} | {
  ok: false;
  error: string;
};
type ChannelSetupContractAdapterParams<Fields extends Record<string, ChannelSetupField>> = {
  adapter: ChannelOwnedSetupAdapterShape<ChannelSetupInputForFields<Fields>>;
  legacyAdapter?: never;
} | {
  adapter?: never;
  legacyAdapter: ChannelOwnedSetupAdapterShape<ChannelSetupInput>;
};
type ChannelOwnedSetupAdapterShape<Input extends {
  name?: string;
}> = ChannelSetupAdapter<Input>;
type ChannelOwnedSetupContract = {
  kind: "channel-owned";
  accountKeyPolicy?: ChannelSetupAdapter["accountKeyPolicy"];
  configPromotion?: ChannelSetupAdapter["configPromotion"];
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
  resolveBindingAccountId?: ChannelOwnedSetupAdapterShape<{
    name?: string;
  }>["resolveBindingAccountId"];
  applyAccountName?: ChannelOwnedSetupAdapterShape<{
    name?: string;
  }>["applyAccountName"];
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
  singleAccountKeysToMove?: readonly string[];
  namedAccountPromotionKeys?: readonly string[];
  resolveSingleAccountPromotionTarget?: ChannelOwnedSetupAdapterShape<{
    name?: string;
  }>["resolveSingleAccountPromotionTarget"];
};
declare function defineChannelSetupContract<const Fields extends Record<string, ChannelSetupField>>(params: {
  fields: Fields;
} & ChannelSetupContractAdapterParams<Fields>): ChannelOwnedSetupContract;
//#endregion
//#region src/compat/legacy-names.d.ts
declare const MANIFEST_KEY: "openclaw";
//#endregion
//#region src/plugins/package-manifest.types.d.ts
/** package.json OpenClaw metadata used for plugin setup and catalog discovery. */
type PluginPackageChannelApprovalFlag = "native";
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
  approvalFlags?: readonly PluginPackageChannelApprovalFlag[];
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
type ManifestKey = typeof MANIFEST_KEY;
type PackageManifest = {
  name?: string;
  version?: string;
  description?: string;
  dependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
} & Partial<Record<ManifestKey, OpenClawPackageManifest>>;
//#endregion
//#region src/plugins/status-dependencies.types.d.ts
/** Dependency name-to-version map from a plugin package manifest. */
type PluginDependencySpecMap = Record<string, string>;
/** Installation status for one plugin dependency. */
type PluginDependencyEntry = {
  name: string;
  spec: string;
  installed: boolean;
  optional: boolean;
  resolvedPath?: string;
};
/** Aggregate installation status for required and optional plugin dependencies. */
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
export { PluginDependencyStatus as a, PluginPackageInstall as c, ChannelSetupAdapter as d, ChannelSetupInput as f, PluginDiscoveryResult as i, ChannelOwnedSetupContract as l, PluginManifestRegistry as n, OpenClawPackageBuild as o, PluginTrust as r, PluginPackageChannel as s, PluginManifestRecord as t, defineChannelSetupContract as u };