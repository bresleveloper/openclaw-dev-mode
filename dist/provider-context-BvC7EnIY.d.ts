import { Ot as ModelInferenceCapabilities, St as ModelCatalogStatus, _ as ModelCompatConfig, g as ModelApi, r as OpenClawConfig, yt as ModelCatalogContextWindowOption } from "./types.openclaw-D8uW-XQA.js";
import { N as ModelDataMediaInputConfig, u as Model, w as ThinkingLevelMap } from "./types-B1zI2CfC.js";
import { t as CyberAccessProgram } from "./sessions-row-09BvoTD5.js";
import { s as ProviderSyntheticAuthResult } from "./provider-request-config.types-BDimJcpZ.js";
type ProviderCatalogOutcome = {
  provider: string;
  /** Auth profile tested by discovery; omission means provider-wide auth. */
  profileId?: string;
  /** Limits an auth rejection to catalog discovery rather than model execution. */
  rejectionScope?: "catalog";
  status: "ready" | "auth-rejected" | "unavailable";
  /** Accepted selections advertised by this authenticated account, never static model support. */
  modelAccessPrograms?: readonly {
    modelId: string;
    runtimeId: string;
    /** Physical route for host-owned credentials; native observations stay harness-scoped. */
    api?: string;
    baseUrl?: string;
    cyber: readonly CyberAccessProgram[];
  }[];
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
  /** Declared task support for the exact physical route; not authorization or readiness. */
  inference?: ModelInferenceCapabilities;
  /** Private transport provenance for route matching; never project directly to clients. */
  baseUrl?: string;
  contextWindow?: number;
  contextWindows?: ModelCatalogContextWindowOption[];
  contextWindowDefault?: string;
  contextTokens?: number;
  /** Provider/catalog-declared total parameter count. */
  parameterCount?: number;
  /** Provider/catalog-declared developer lineage for this exact route; never inferred from ids. */
  family?: string;
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
  mediaInput?: ModelDataMediaInputConfig;
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
  /** Failed discovery scopes, never errors, credentials, endpoints, or account/profile ids. */
  refreshFailures?: readonly {
    acquisition: "provider" | "native";
    /** Omitted when the failed acquisition could not identify its provider scope. */
    provider?: string;
  }[];
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
type ResolvedProviderAuth = {
  apiKey?: string;
  profileId?: string;
  source: string;
  mode: "api-key" | "oauth" | "token" | "aws-sdk";
  /** Provider-owned OAuth grant family; distinct from credential renewal mode. */
  authFlow?: string;
  nativeAuth?: ProviderSyntheticAuthResult["nativeAuth"];
};
declare function requireApiKey(auth: ResolvedProviderAuth, provider: string): string;
/** Evidence and shared question shapes used by both Decision contracts. */
type JsonValue = null | boolean | number | string | readonly JsonValue[] | {
  readonly [key: string]: JsonValue;
};
type DecisionEntry = string | null | readonly JsonValue[] | {
  readonly [key: string]: JsonValue;
};
type DecisionQuestion = {
  readonly type: "choice";
  readonly instructions?: DecisionEntry;
  readonly criteria: Readonly<Record<string, DecisionEntry>>;
} | {
  readonly type: "score";
  readonly instructions?: DecisionEntry;
  readonly criteria: readonly DecisionEntry[];
} | {
  readonly type: "boolean";
  readonly instructions?: DecisionEntry;
  readonly criteria?: {
    readonly true?: DecisionEntry;
    readonly false?: DecisionEntry;
  } | null;
};
/** Provider-declared execution mode; omission leaves the provider default unchanged. */
type DecisionReasoning = "auto" | "off" | "on";
type DecisionExecutionLifetime = {
  /** Composed by host from caller, per-call deadline, and retirement. */
  readonly signal: AbortSignal;
  /** Deadline on the same process-local performance.now() time base. */
  readonly deadlineMonotonicMs: number;
};
type DecisionExecutionContext = DecisionExecutionLifetime & {
  /** Check synchronously when each request starts, and again after a queue wait or before a retry.
   * False closes this request; a thrown caller authority assertion remains terminal. */
  readonly isAdmissible: () => boolean;
};
type DecisionEvaluateOptions = {
  /** Omit for the default role; agent-owned work supplies its owner agent. */
  readonly agentId?: string;
  readonly purpose: string;
  /** Defaults to requested; optional work leaves capacity for requested evaluations. */
  readonly priority?: "requested" | "optional";
  readonly rubricVersion: string;
  /** Budget includes preparation; provider cleanup remains physically awaited. */
  readonly timeoutMs: number;
  readonly signal: AbortSignal;
  /**
   * Caller-owned authority (for example a revocable data grant). The host calls it
   * before preparation, at every physical dispatch and retry, and before completion;
   * a throw ends the request and rejects with that error.
   */
  readonly assertCurrent?: () => void;
};
/** Adds only provider-declared reasoning to the established caller contract. */
type DecisionEvaluateOptionsV2 = DecisionEvaluateOptions & {
  readonly reasoning?: DecisionReasoning | undefined;
};
/** Explicit evidence supplied by the caller; the host collects no additional context. */
type DecisionContentV2 = {
  readonly type: "text";
  readonly text: string;
} | {
  readonly type: "json";
  readonly value: JsonValue;
} | {
  readonly type: "image";
  readonly dataUri: string;
  readonly text?: string;
} | {
  readonly type: "list";
  readonly items: readonly {
    readonly id: string;
    readonly content: DecisionEntry;
  }[];
};
type DecisionQuestionV2 = DecisionQuestion | {
  readonly type: "sort";
  readonly instructions?: DecisionEntry;
} | {
  readonly type: "box";
  readonly instructions: Exclude<DecisionEntry, null>;
} | {
  readonly type: "tags";
  readonly instructions?: DecisionEntry;
  readonly criteria: Readonly<Record<string, DecisionEntry>>;
};
type DecisionBatchV2 = {
  readonly state: DecisionContentV2;
  readonly questions: Readonly<Record<string, DecisionQuestionV2>>;
};
type DecisionAnswerV2 = ((({
  readonly type: "boolean";
} & ({
  /** Native P(true), independent from any explicit answer. */
  readonly probabilityTrue: number;
  readonly answer?: boolean | null;
} | {
  /** At least answer or probabilityTrue is required; null is explicit abstention. */
  readonly answer: boolean | null;
  readonly probabilityTrue?: number;
})) | {
  readonly type: "choice";
  readonly choice: string | null;
  /** Route-declared estimates; independent maps may be all-zero. Never normalized. */
  readonly probabilities?: Readonly<Record<string, number>>;
  /** Selected provider estimate, not derived from the map. */
  readonly probability?: number | null;
  readonly confidence?: number | null;
} | {
  readonly type: "score";
  readonly score: number;
  /** An absent distribution must not be synthesized. */
  readonly probabilities?: readonly number[];
  readonly confidence?: number | null;
} | {
  readonly type: "box";
  /** Edges normalized to image width/height, measured from the top-left corner. */
  readonly box: {
    readonly top: number;
    readonly bottom: number;
    readonly left: number;
    readonly right: number;
  };
  readonly confidence?: number | null;
} | {
  readonly type: "sort";
  readonly order: readonly string[];
  readonly confidence?: number | null;
} | {
  readonly type: "tags";
  readonly tags: readonly {
    readonly id: string;
    readonly probability?: number;
    readonly applies: boolean | null;
  }[];
}) & {
  readonly metadata?: Readonly<Record<string, JsonValue>>;
}) | {
  readonly type: "error";
  readonly code: "unsupported-input" | "invalid-input" | "provider-error";
  readonly providerCode?: string;
};
type DecisionBatchResultV2 = {
  readonly model: string;
  readonly answers: Readonly<Record<string, DecisionAnswerV2>>;
  readonly usage?: {
    readonly inputTokens?: number;
    readonly outputTokens?: number;
    readonly costUsd?: number;
    readonly units?: {
      readonly unit: "decision-units" | "requests";
      readonly amount: number;
    };
    readonly raw?: JsonValue;
  };
  readonly metadata?: Readonly<Record<string, JsonValue>>;
};
type DecisionBatch = {
  readonly state: DecisionEntry;
  readonly questions: Readonly<Record<string, DecisionQuestion>>;
};
type DecisionAnswer = {
  readonly type: "choice";
  /** Provider-reported label; not required to be the rounded distribution's argmax. */
  readonly choice: string;
  /** Provider-reported estimates in [0, 1]; rounding may make their sum differ from one. */
  readonly probabilities: Readonly<Record<string, number>>;
  /** Provider-specific distribution metric, not correctness probability. */
  readonly confidence?: number;
} | {
  readonly type: "score";
  /** Provider's fractional zero-based rubric estimate, bounded by its first and last positions. */
  readonly score: number;
  /** Index-aligned estimates in [0, 1]; may be rounded independently of the score. */
  readonly probabilities: readonly number[];
  readonly confidence?: number;
} | {
  readonly type: "boolean";
  readonly probabilityTrue: number;
};
type DecisionBatchResult = {
  /** Resolved vendor model identity, not a host conversational-model record. */
  readonly model: string;
  readonly answers: Readonly<Record<string, DecisionAnswer>>;
  readonly usage?: {
    readonly inputTokens?: number;
    readonly outputTokens?: number;
  };
};
type ProviderFailureReason = "credentials-unavailable" | "authentication" | "rate-limited" | "transport" | "unsupported-input" | "invalid-response";
type ProviderDecisionOutcome = {
  readonly status: "ok";
  readonly result: DecisionBatchResult;
} | {
  readonly status: "unavailable";
  readonly reason: ProviderFailureReason;
  /** Validated and bounded by host; does not cause an automatic retry. */
  readonly retryAfterMs?: number;
};
type ProviderDecisionOutcomeV2 = {
  readonly status: "ok";
  readonly result: DecisionBatchResultV2;
} | Extract<ProviderDecisionOutcome, {
  status: "unavailable";
}>;
/** Private prepared facts supplied only to the selected executor; never projected in results. */
type DecisionProviderContextV2 = DecisionExecutionContext & {
  readonly model: Omit<ModelCatalogEntry, "api"> & Partial<Pick<Model, "api" | "headers">>;
  readonly config: OpenClawConfig;
  readonly agentId?: string;
  readonly workspaceDir?: string;
  readonly auth: Readonly<Pick<ResolvedProviderAuth, "apiKey" | "mode" | "profileId">>;
  readonly reasoning?: DecisionReasoning;
};
export { ModelCatalogEntry as C, requireApiKey as S, ProviderCatalogOutcome as T, DecisionEntry as _, DecisionAnswer as a, JsonValue as b, DecisionAnswerV2 as c, DecisionContentV2 as d, DecisionQuestionV2 as f, DecisionExecutionLifetime as g, DecisionExecutionContext as h, ProviderFailureReason as i, DecisionBatchResultV2 as l, DecisionEvaluateOptionsV2 as m, ProviderDecisionOutcome as n, DecisionBatch as o, DecisionEvaluateOptions as p, ProviderDecisionOutcomeV2 as r, DecisionBatchResult as s, DecisionProviderContextV2 as t, DecisionBatchV2 as u, DecisionQuestion as v, ModelCatalogSnapshot as w, ResolvedProviderAuth as x, DecisionReasoning as y };