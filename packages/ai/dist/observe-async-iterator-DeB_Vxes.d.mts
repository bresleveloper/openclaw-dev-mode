type ClaudeModelRef = {
  id?: string;
  params?: Record<string, unknown>;
};
declare const CLAUDE_FABLE_5_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "medium";
  readonly preserveWhenCatalogReasoningFalse: true;
};
declare const CLAUDE_SONNET_5_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "off";
  }, {
    readonly id: "minimal";
  }, {
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "adaptive";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "high";
};
declare const CLAUDE_OPUS_5_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "off";
  }, {
    readonly id: "minimal";
  }, {
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "adaptive";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "high";
};
declare const CLAUDE_OPUS_55_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "medium";
  readonly preserveWhenCatalogReasoningFalse: true;
};
declare const CLAUDE_SONNET_55_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "off";
  }, {
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "high";
};
declare const CLAUDE_HAIKU_55_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "off";
  }, {
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "medium";
};
/** Resolve Haiku 5.5 through direct ids, cloud ids, aliases, or deployment metadata. */
declare function resolveClaudeHaiku55ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve the canonical normalized Claude model id for one runtime model ref. */
declare function resolveClaudeModelIdentity(ref: ClaudeModelRef): string;
/** Resolve Claude Fable 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeFable5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve Claude Mythos 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeMythos5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/**
 * Whether thinking blocks are valid only after the exact request prefix that
 * produced them, so runtime context must be appended instead of re-rendered.
 * Every Claude model is prefix-bound except the closed list of older generations.
 */
declare function bindsClaudeThinkingPrefix(ref: ClaudeModelRef): boolean;
/** Whether a Claude model follows the Claude 5 request contract (streamed refusals, adaptive by default). */
declare function usesClaude5RequestContract(ref: ClaudeModelRef): boolean;
/** Whether a Claude model rejects a trailing assistant prefill. */
declare function rejectsClaudeAssistantPrefill(ref: ClaudeModelRef): boolean;
/** Return whether Claude accepts operator instructions within conversation history. */
declare function supportsClaudeInHistorySystemMessages(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model requires adaptive thinking instead of manual budgets. */
declare function requiresClaudeMandatoryAdaptiveThinking(ref: ClaudeModelRef): boolean;
/** Resolve Claude Sonnet 5 through aliases, direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeSonnet5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve the Sonnet 5.5 contract without matching other Sonnet 5 generations. */
declare function resolveClaudeSonnet55ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Sonnet 5.5 replaces disabled thinking with between-tool progress updates. */
declare function requiresClaudeBetweenToolsThinking(ref: ClaudeModelRef): boolean;
/** Resolve Claude Opus 5 through aliases, direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeOpus5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve the Opus 5.5 contract without matching other Opus 5 generations. */
declare function resolveClaudeOpus55ModelIdentity(ref: ClaudeModelRef): string | undefined;
/**
 * Whether the id names a released Claude generation with adaptive thinking.
 * Unlike {@link supportsClaudeAdaptiveThinking}, unknown Claude ids answer false,
 * so providers can tell a released model from one they must map onto a template.
 */
declare function isReleasedAdaptiveClaudeGeneration(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports adaptive thinking. */
declare function supportsClaudeAdaptiveThinking(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model has a native 1M-token context window. */
declare function supportsClaude1MContext(ref: ClaudeModelRef): boolean;
/** Return whether Anthropic documents threshold compaction (`compact_20260112`) for a Claude model. */
declare function supportsClaudeServerCompaction(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports Anthropic's native fast mode. */
declare function supportsClaudeFastMode(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports native max effort. */
declare function supportsClaudeNativeMaxEffort(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports native xhigh effort. */
declare function supportsClaudeNativeXhighEffort(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model rejects caller-selected sampling parameters. */
declare function requiresClaudeDefaultSampling(ref: ClaudeModelRef): boolean;
/**
 * Fill native Claude effort mappings only when the provider did not publish a
 * narrower route-specific contract.
 */
declare function resolveClaudeNativeThinkingLevelMap(ref: ClaudeModelRef & {
  thinkingLevelMap?: Record<string, string | null | undefined>;
}): Record<string, string | null | undefined> | undefined;
type CloseReason = "return" | "throw" | "observer";
/**
 * Observe without a forwarding generator's per-event promises. Serial reads use
 * one stable continuation; overlapping operations retain generator FIFO/context.
 * The default close uses AsyncIteratorClose: source errors do not close, while
 * consumer/observer throws call return() and take precedence over cleanup errors.
 * onClose can retain a caller-owned cleanup policy; onFinally runs once after start.
 */
declare function observeAsyncIterator<T>(options: {
  iterator: () => AsyncIterator<T>;
  onStart?: () => void;
  onEvent: (event: T) => void;
  onDone?: () => void;
  onError?: (error: unknown) => void;
  onClose?: (iterator: AsyncIterator<T> | undefined, reason: CloseReason) => Promise<unknown> | void;
  onFinally?: () => void;
  /** Eagerly acquired iterators may need cleanup even before the first read. */
  onUnopenedReturn?: (value: unknown) => Promise<IteratorResult<T>>;
}): Required<AsyncIterableIterator<T>>;
export { usesClaude5RequestContract as A, supportsClaude1MContext as C, supportsClaudeNativeMaxEffort as D, supportsClaudeInHistorySystemMessages as E, supportsClaudeNativeXhighEffort as O, resolveClaudeSonnet5ModelIdentity as S, supportsClaudeFastMode as T, resolveClaudeMythos5ModelIdentity as _, CLAUDE_OPUS_5_THINKING_PROFILE as a, resolveClaudeOpus5ModelIdentity as b, bindsClaudeThinkingPrefix as c, requiresClaudeBetweenToolsThinking as d, requiresClaudeDefaultSampling as f, resolveClaudeModelIdentity as g, resolveClaudeHaiku55ModelIdentity as h, CLAUDE_OPUS_55_THINKING_PROFILE as i, supportsClaudeServerCompaction as k, isReleasedAdaptiveClaudeGeneration as l, resolveClaudeFable5ModelIdentity as m, CLAUDE_FABLE_5_THINKING_PROFILE as n, CLAUDE_SONNET_55_THINKING_PROFILE as o, requiresClaudeMandatoryAdaptiveThinking as p, CLAUDE_HAIKU_55_THINKING_PROFILE as r, CLAUDE_SONNET_5_THINKING_PROFILE as s, observeAsyncIterator as t, rejectsClaudeAssistantPrefill as u, resolveClaudeNativeThinkingLevelMap as v, supportsClaudeAdaptiveThinking as w, resolveClaudeSonnet55ModelIdentity as x, resolveClaudeOpus55ModelIdentity as y };