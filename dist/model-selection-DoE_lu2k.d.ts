import { $t as ThinkingLevelMap, B as ModelMediaInputConfig, G as ModelApi, M as OpenClawConfig, Oi as ModelCatalogContextWindowOption, R as ModelCompatConfig, bt as Model, ji as ModelCatalogStatus } from "./types-D7I_F5Ux.js";
import { t as PluginManifestRecord } from "./manifest-registry-DcAsDGQ5.js";
import { r as ModelFallbackRouteResolution } from "./model-fallback.types-BnTJx5Bt.js";
import { r as PluginMetadataSnapshot } from "./plugin-metadata-snapshot-C_ou8VB5.js";
import { n as ThinkLevel, r as ThinkingCatalogEntry } from "./thinking.shared-COcvrWJf.js";
//#region packages/model-catalog-core/src/model-catalog-refs.d.ts
type ProviderModelRef = {
  provider: string;
  model: string;
};
//#endregion
//#region src/plugins/manifest-model-id-normalization.d.ts
/** Caller-owned declarations or facts from an already selected metadata snapshot. */
type ManifestModelIdNormalizationSource = readonly (Pick<PluginManifestRecord, "modelIdNormalization"> & Partial<Pick<PluginManifestRecord, "providers">>)[] | {
  owners: Pick<PluginMetadataSnapshot["owners"], "modelIdNormalizationPolicies"> & Partial<Pick<PluginMetadataSnapshot["owners"], "providers">>;
};
//#endregion
//#region src/agents/model-ref-shared.d.ts
type ModelManifestNormalizationContext = {
  manifestPlugins?: ManifestModelIdNormalizationSource;
};
type ModelRefNormalizeOptions = ModelManifestNormalizationContext & {
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
};
/** Normalize a provider/model pair into a canonical model reference. */
declare function normalizeModelRef(provider: string, model: string, options?: ModelRefNormalizeOptions): ProviderModelRef;
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
   * Relative strength used to clamp execution when the selected model does not
   * support the requested level. The stored preference remains unchanged.
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
/** Prepared provider policy ownership, without the broader Gateway registry contract. */
type ProviderThinkingRegistry = {
  providers: ReadonlyArray<{
    provider: {
      id: string;
      aliases?: string[];
      hookAliases?: string[];
      resolveThinkingProfile?: (context: ProviderDefaultThinkingPolicyContext) => ProviderThinkingProfile | null | undefined;
    };
  }>;
};
type ProviderThinkingPolicySource = "active" | "active-or-bundled" | ProviderThinkingRegistry;
//#endregion
//#region src/auto-reply/thinking.d.ts
/** UI-facing thinking level option. */
type ThinkingLevelOption = {
  id: ThinkLevel;
  label: string;
};
type RankedThinkingLevelOption = ThinkingLevelOption & {
  rank: number;
};
type ResolvedThinkingProfile = {
  levels: RankedThinkingLevelOption[];
  defaultLevel?: ThinkLevel | null;
};
type ThinkingCatalogQuery = {
  provider?: string | null;
  model?: string | null;
};
type ThinkingProfileParams = ThinkingCatalogQuery & {
  catalog?: ThinkingCatalogEntry[];
  catalogResolver?: ThinkingCatalogResolver;
  agentRuntime?: string | null;
  configuredReasoning?: boolean;
  providerPolicySource?: ProviderThinkingPolicySource;
};
type ThinkingCatalogResolver = (params: ThinkingCatalogQuery) => ThinkingCatalogEntry | undefined;
/** Ultra is a harness mode, independent of a model's native reasoning controls. */
declare function resolveThinkingProfile(params: ThinkingProfileParams): ResolvedThinkingProfile;
/** List labeled thinking level options supported by provider/model. */
declare function listThinkingLevelOptions(provider?: string | null, model?: string | null, catalog?: ThinkingCatalogEntry[], agentRuntime?: string | null): ThinkingLevelOption[];
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
  /**
   * Private provenance: every model id a successful account listing returned, including hidden
   * rows; never projected publicly. Subscription routes for other ids are not entitled.
   */
  listedModelIds?: readonly string[];
  /** Private successful server listing for config advisories, independent of entitlement. */
  modelIdCatalog?: {
    baseUrl: string;
    modelIds: readonly string[];
    /** Provider-owned matching data, such as variant aliases omitted from picker rows. */
    aliases?: readonly string[];
  };
  /** Advisory only: configured ids absent from this successful server listing; never eligibility. */
  unlistedConfiguredModelIds?: readonly string[];
};
//#endregion
//#region src/agents/model-catalog.types.d.ts
type ModelInputType = "text" | "image" | "audio" | "video" | "document";
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
  /** Visible failed-acquisition starter; sizing comes from current static or accepted owner facts. */
  contextCapacitySource?: "unaccepted-starter";
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
/** Logical catalog rows plus the physical variants used for route selection. */
type ModelCatalogSnapshot = {
  entries: ModelCatalogEntry[];
  routeVariants: ModelCatalogEntry[];
  /** Provider-owned outcome of each live catalog request in this generation. */
  providerOutcomes?: readonly ProviderCatalogOutcome[];
  /** Previously accepted inventory remains bound to these provider/profile identities. */
  acceptedDiscoveryOrigins?: readonly Pick<ProviderCatalogOutcome, "provider" | "profileId">[];
  /** Native discovery facts belong to their harness, independently of API-provider auth. */
  nativeProviderOutcomes?: Readonly<Record<string, readonly ProviderCatalogOutcome[]>>;
  /** Untagged harness observations, before API donor enrichment; each runtime owns its scope. */
  nativeHostRows?: Readonly<Record<string, readonly ModelCatalogEntry[]>>;
  /** The current acquisition failed while this published inventory remained available. */
  refreshFailed?: boolean;
  /** Provider discovery is in progress; existing rows remain usable. */
  pendingProviders?: readonly string[];
  /** Static provider-hook rows captured alongside the full lifecycle generation. */
  staticEntries?: ModelCatalogEntry[];
  /**
   * `false` only when this snapshot came from a degraded load (discovery threw,
   * static or empty fallback). Absent/`true` means authoritative — consumers that
   * destroy durable state (e.g. resetting a pinned model override) must treat only
   * an explicit `false` as degraded, so unrelated hand-built snapshots stay safe.
   */
  authoritative?: boolean;
};
//#endregion
//#region src/agents/defaults.d.ts
declare const DEFAULT_PROVIDER = "openai";
declare const DEFAULT_MODEL = "gpt-6-astra";
//#endregion
//#region src/agents/model-selection-config.d.ts
declare function resolveDefaultModelForAgent(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): ProviderModelRef;
//#endregion
//#region src/agents/model-selection-shared.d.ts
type ModelManifestPlugins = ModelManifestNormalizationContext["manifestPlugins"];
type ModelSelectionParams = NonNullable<Parameters<typeof normalizeModelRef>[2]> & {
  cfg?: OpenClawConfig;
  agentId?: string;
  defaultProvider: string;
};
type ConfiguredModelSelectionParams = ModelSelectionParams & {
  cfg: OpenClawConfig;
};
type ParseModelRefParams = ModelSelectionParams & {
  raw: string;
};
type ModelAliasIndex = {
  byAlias: Map<string, {
    alias: string;
    ref: ProviderModelRef;
  }>;
  byProviderAlias?: Map<string, {
    alias: string;
    ref: ProviderModelRef;
  }>;
  byKey: Map<string, string[]>;
  disabledKeys?: Set<string>;
};
/** Build lookup maps from user-facing aliases to normalized model refs. */
declare function buildModelAliasIndex(params: ConfiguredModelSelectionParams): ModelAliasIndex;
declare function resolveModelRefFromString(params: ParseModelRefParams & {
  aliasIndex?: ModelAliasIndex;
}): {
  ref: ProviderModelRef;
  alias?: string;
} | null;
type AllowedModelSet = {
  allowAny: boolean;
  allowedCatalog: ModelCatalogEntry[];
  allowedKeys: Set<string>;
  allows: (ref: ProviderModelRef) => boolean;
};
/** Build explicit model override authorization without widening it for automatic fallbacks. */
declare function buildAllowedModelSet(params: {
  cfg: OpenClawConfig;
  catalog: ModelCatalogEntry[];
  defaultProvider: string;
  defaultModel?: string | ProviderModelRef;
  agentId?: string;
} & ModelManifestNormalizationContext): AllowedModelSet;
/** Status of a candidate model against catalog and configured allowlist state. */
type ModelRefStatus = {
  key: string;
  inCatalog: boolean;
  allowAny: boolean;
  allowed: boolean;
};
type ResolveAllowedModelRefResult = {
  ref: ProviderModelRef;
  key: string;
} | {
  error: string;
};
declare function getModelRefStatus(params: Parameters<typeof buildAllowedModelSet>[0] & {
  ref: ProviderModelRef;
}): ModelRefStatus;
/** Resolve a requested model string only if it is allowed by the supplied status check. */
declare function resolveAllowedModelRefFromAliasIndex(params: {
  cfg: OpenClawConfig;
  raw: string;
  defaultProvider: string;
  agentId?: string;
  aliasIndex: ModelAliasIndex;
  getStatus: (ref: ProviderModelRef) => ModelRefStatus;
} & ModelManifestNormalizationContext): ResolveAllowedModelRefResult;
/** Build catalog entries from configured provider model rows. */
declare function buildConfiguredModelCatalog(params: {
  cfg: OpenClawConfig;
  catalog?: readonly ModelCatalogEntry[];
  workspaceDir?: string;
  manifestPlugins?: ModelManifestPlugins;
}): ModelCatalogEntry[];
type ModelVisibilityPolicy = {
  allowAny: boolean;
  catalog: ModelCatalogEntry[];
  configuredCatalog: readonly ModelCatalogEntry[];
  allowedCatalog: ModelCatalogEntry[];
  allowedKeys: Set<string>;
  policyAliasIndex: ModelAliasIndex;
  selectionAliasIndex: ModelAliasIndex;
  configuredKeys: ReadonlySet<string>;
  retainedKeys: ReadonlySet<string>;
  exactModelRefs: readonly string[];
  providerWildcards: ReadonlySet<string>;
  hasConfiguredEntries: boolean;
  hasProviderWildcards: boolean;
  allowConfigPath?: string | null;
  allowRepairConfigPath: string;
  allows: (ref: {
    provider: string;
    model: string;
  }) => boolean;
  allowsByWildcard: (ref: {
    provider: string;
    model: string;
  }) => boolean;
  resolveSelection: (ref: ProviderModelRef & {
    routeResolution?: ModelFallbackRouteResolution;
  }) => ProviderModelRef | null;
  visibleCatalog: (params: {
    catalog: readonly ModelCatalogEntry[];
    defaultVisibleCatalog: readonly ModelCatalogEntry[];
    view?: "default" | "configured" | "all";
  }) => ModelCatalogEntry[];
};
//#endregion
//#region src/agents/model-selection-resolve.d.ts
/** Resolves a raw model string into an allowed model ref or an explanatory error. */
declare function resolveAllowedModelRefCore(params: Omit<Parameters<typeof getModelRefStatus>[0], "ref"> & {
  raw: string;
}): ReturnType<typeof resolveAllowedModelRefFromAliasIndex>;
//#endregion
//#region src/agents/model-thinking-default-core.d.ts
type ThinkingDefaultParams = {
  cfg: OpenClawConfig;
  provider: string;
  model: string;
  catalog?: ModelCatalogEntry[];
  agentRuntime?: string | null;
  agentId?: string;
  providerPolicySource?: ProviderThinkingPolicySource;
  catalogResolver?: ThinkingCatalogResolver;
};
declare function resolveThinkingDefaultCore(params: ThinkingDefaultParams): ThinkLevel;
//#endregion
//#region src/agents/model-thinking-default.d.ts
/** Resolves thinking default after loading runtime catalog only when needed. */
declare function resolveThinkingDefaultWithRuntimeCatalogCore(params: {
  cfg: OpenClawConfig;
  provider: string;
  model: string;
  agentId?: string;
  loadRuntimeCatalog: () => Promise<ModelCatalogEntry[]>;
  agentRuntime?: string | null;
}): Promise<ThinkLevel>;
//#endregion
//#region src/agents/model-selection-normalize.d.ts
/** Find a provider value by normalized provider ID. */
declare function findNormalizedProviderValue<T>(entries: Record<string, T> | undefined, provider: string): T | undefined;
/** Parse `provider/model` or bare model text using a default provider. */
declare function parseModelRef(raw: string, defaultProvider: string, options?: ModelRefNormalizeOptions): ProviderModelRef | null;
//#endregion
export { ProviderModelRef as C, ProviderThinkingRegistry as S, listThinkingLevelOptions as _, resolveAllowedModelRefCore as a, ProviderThinkingPolicyContext as b, buildModelAliasIndex as c, DEFAULT_MODEL as d, DEFAULT_PROVIDER as f, ProviderRuntimeModel as g, ProviderCatalogOutcome as h, resolveThinkingDefaultCore as i, resolveModelRefFromString as l, ModelCatalogSnapshot as m, parseModelRef as n, ModelVisibilityPolicy as o, ModelCatalogEntry as p, resolveThinkingDefaultWithRuntimeCatalogCore as r, buildConfiguredModelCatalog as s, findNormalizedProviderValue as t, resolveDefaultModelForAgent as u, resolveThinkingProfile as v, ProviderThinkingProfile as x, ProviderDefaultThinkingPolicyContext as y };