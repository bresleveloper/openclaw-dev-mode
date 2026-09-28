import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { m as DmPolicy } from "./types.base-CA0_JvyZ.js";
import { d as SecretInput } from "./types.secrets-BR-Cncxg.js";
import { d as ChannelSetupAdapter } from "./manifest-registry-CMnhqUB6.js";
import { a as ChannelSetupWizardCredential, c as PromptAccountId, n as ChannelSetupWizard, o as ChannelSetupWizardStatus, p as WizardPrompter, s as ChannelSetupWizardTextInput, t as ChannelSetupDmPolicy } from "./setup-wizard-types-B39o8fS3.js";
import { u as ChannelSetupPromotionSurface } from "./setup-helpers-CsmtHi6m.js";
//#region src/wizard/i18n/types.d.ts
type WizardLocale = "en" | "zh-CN" | "zh-TW";
type WizardI18nParams = Record<string, boolean | number | string | null | undefined>;
//#endregion
//#region src/wizard/i18n/index.d.ts
type SetupTranslator = (key: string, params?: WizardI18nParams) => string;
declare function createSetupTranslator(options?: {
  locale?: WizardLocale;
  keyPrefix?: string;
}): SetupTranslator;
//#endregion
//#region src/channels/plugins/setup-wizard-helpers.d.ts
declare const promptAccountId: PromptAccountId;
declare function addWildcardAllowFrom(allowFrom?: ReadonlyArray<string | number> | null): string[];
declare function mergeAllowFromEntries(current: Array<string | number> | null | undefined, additions: Array<string | number>): string[];
declare function splitSetupEntries(raw: string): string[];
type ParsedSetupEntry = {
  value: string;
} | {
  error: string;
};
declare function parseSetupEntriesWithParser(raw: string, parseEntry: (entry: string) => ParsedSetupEntry): {
  entries: string[];
  error?: string;
};
declare function parseSetupEntriesAllowingWildcard(raw: string, parseEntry: (entry: string) => ParsedSetupEntry): {
  entries: string[];
  error?: string;
};
declare function parseMentionOrPrefixedId(params: {
  value: string;
  mentionPattern: RegExp;
  prefixPattern?: RegExp;
  idPattern: RegExp;
  normalizeId?: (id: string) => string;
}): string | null;
declare function normalizeAllowFromEntries(entries: Array<string | number>, normalizeEntry?: (value: string) => string | null | undefined): string[];
declare function createStandardChannelSetupStatus(params: {
  channelLabel: string;
  configuredLabel: string;
  unconfiguredLabel: string;
  configuredHint?: string;
  unconfiguredHint?: string;
  configuredScore?: number;
  unconfiguredScore?: number;
  includeStatusLine?: boolean;
  resolveConfigured: ChannelSetupWizardStatus["resolveConfigured"];
  resolveExtraStatusLines?: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    configured: boolean;
  }) => string[] | Promise<string[]>;
}): ChannelSetupWizardStatus;
declare function resolveSetupAccountId(params: {
  accountId?: string;
  defaultAccountId: string;
}): string;
declare function setAccountAllowFromForChannel(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId: string;
  allowFrom: string[];
  setupSurface?: ChannelSetupAdapter | ChannelSetupPromotionSurface;
}): OpenClawConfig;
declare function patchTopLevelChannelConfigSection(params: {
  cfg: OpenClawConfig;
  channel: string;
  enabled?: boolean;
  clearFields?: string[];
  patch: Record<string, unknown>;
}): OpenClawConfig;
declare function setTopLevelChannelDmPolicyWithAllowFrom(params: {
  cfg: OpenClawConfig;
  channel: string;
  dmPolicy: DmPolicy;
  getAllowFrom?: (cfg: OpenClawConfig) => Array<string | number> | undefined;
}): OpenClawConfig;
declare function createTopLevelChannelDmPolicy(params: {
  label: string;
  channel: string;
  policyKey: string;
  allowFromKey: string;
  getCurrent: (cfg: OpenClawConfig) => DmPolicy;
  promptAllowFrom?: ChannelSetupDmPolicy["promptAllowFrom"];
  getAllowFrom?: (cfg: OpenClawConfig) => Array<string | number> | undefined;
}): ChannelSetupDmPolicy;
declare function createTopLevelChannelDmPolicySetter(params: {
  channel: string;
  getAllowFrom?: (cfg: OpenClawConfig) => Array<string | number> | undefined;
}): (cfg: OpenClawConfig, dmPolicy: DmPolicy) => OpenClawConfig;
declare function createTopLevelChannelAllowFromSetter(params: {
  channel: string;
  enabled?: boolean;
}): (cfg: OpenClawConfig, allowFrom: string[]) => OpenClawConfig;
declare function createTopLevelChannelGroupPolicySetter(params: {
  channel: string;
  enabled?: boolean;
}): (cfg: OpenClawConfig, groupPolicy: "open" | "allowlist" | "disabled") => OpenClawConfig;
declare function createAccountScopedAllowFromSection(params: {
  channel: string;
  credentialInputKey?: NonNullable<ChannelSetupWizard["allowFrom"]>["credentialInputKey"];
  helpTitle?: string;
  helpLines?: string[];
  message: string;
  placeholder: string;
  invalidWithoutCredentialNote: string;
  parseId: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["parseId"]>;
  resolveEntries: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["resolveEntries"]>;
}): NonNullable<ChannelSetupWizard["allowFrom"]>;
declare function createAccountScopedGroupAccessSection<TResolved>(params: {
  channel: string;
  label: string;
  placeholder: string;
  helpTitle?: string;
  helpLines?: string[];
  skipAllowlistEntries?: boolean;
  currentPolicy: NonNullable<ChannelSetupWizard["groupAccess"]>["currentPolicy"];
  currentEntries: NonNullable<ChannelSetupWizard["groupAccess"]>["currentEntries"];
  updatePrompt: NonNullable<ChannelSetupWizard["groupAccess"]>["updatePrompt"];
  resolveAllowlist?: NonNullable<NonNullable<ChannelSetupWizard["groupAccess"]>["resolveAllowlist"]>;
  fallbackResolved: (entries: string[]) => TResolved;
  applyAllowlist: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    resolved: TResolved;
  }) => OpenClawConfig;
}): NonNullable<ChannelSetupWizard["groupAccess"]>;
type AccountScopedChannel = string;
declare function setSetupChannelEnabled(cfg: OpenClawConfig, channel: string, enabled: boolean): OpenClawConfig;
declare function patchChannelConfigForAccount(params: {
  cfg: OpenClawConfig;
  channel: AccountScopedChannel;
  accountId: string;
  patch: Record<string, unknown>;
  setupSurface?: ChannelSetupAdapter | ChannelSetupPromotionSurface;
}): OpenClawConfig;
declare function buildSingleChannelSecretPromptState(params: {
  accountConfigured: boolean;
  hasConfigToken: boolean;
  allowEnv: boolean;
  envValue?: string;
}): {
  accountConfigured: boolean;
  hasConfigToken: boolean;
  canUseEnv: boolean;
};
type SingleChannelSecretInputPromptResult = {
  action: "keep";
} | {
  action: "use-env";
} | {
  action: "set";
  value: SecretInput;
  resolvedValue: string;
};
declare function runSingleChannelSecretStep(params: {
  cfg: OpenClawConfig;
  prompter: Pick<WizardPrompter, "confirm" | "text" | "select" | "note">;
  providerHint: string;
  credentialLabel: string;
  secretInputMode?: "plaintext" | "ref";
  accountConfigured: boolean;
  hasConfigToken: boolean;
  allowEnv: boolean;
  envValue?: string;
  envPrompt: string;
  keepPrompt: string;
  inputPrompt: string;
  preferredEnvVar?: string;
  onMissingConfigured?: () => Promise<void>;
  applyUseEnv?: (cfg: OpenClawConfig) => OpenClawConfig | Promise<OpenClawConfig>;
  applySet?: (cfg: OpenClawConfig, value: SecretInput, resolvedValue: string) => OpenClawConfig | Promise<OpenClawConfig>;
}): Promise<{
  cfg: OpenClawConfig;
  action: SingleChannelSecretInputPromptResult["action"];
  resolvedValue?: string;
}>;
declare function promptSingleChannelSecretInput(params: {
  cfg: OpenClawConfig;
  prompter: Pick<WizardPrompter, "confirm" | "text" | "select" | "note">;
  providerHint: string;
  credentialLabel: string;
  secretInputMode?: "plaintext" | "ref";
  accountConfigured: boolean;
  canUseEnv: boolean;
  hasConfigToken: boolean;
  envPrompt: string;
  keepPrompt: string;
  inputPrompt: string;
  preferredEnvVar?: string;
}): Promise<SingleChannelSecretInputPromptResult>;
type ParsedAllowFromResult = {
  entries: string[];
  error?: string;
};
declare function promptParsedAllowFromForAccount<TConfig extends OpenClawConfig>(params: {
  cfg: TConfig;
  accountId?: string;
  defaultAccountId: string;
  prompter: Pick<WizardPrompter, "note" | "text">;
  noteTitle?: string;
  noteLines?: string[];
  message: string;
  placeholder: string;
  parseEntries: (raw: string) => ParsedAllowFromResult;
  getExistingAllowFrom: (params: {
    cfg: TConfig;
    accountId: string;
  }) => Array<string | number>;
  mergeEntries?: (params: {
    existing: Array<string | number>;
    parsed: string[];
  }) => string[];
  applyAllowFrom: (params: {
    cfg: TConfig;
    accountId: string;
    allowFrom: string[];
  }) => TConfig | Promise<TConfig>;
}): Promise<TConfig>;
declare function createPromptParsedAllowFromForAccount<TConfig extends OpenClawConfig>(params: {
  defaultAccountId: string | ((cfg: TConfig) => string);
  noteTitle?: string;
  noteLines?: string[];
  message: string;
  placeholder: string;
  parseEntries: (raw: string) => ParsedAllowFromResult;
  getExistingAllowFrom: (params: {
    cfg: TConfig;
    accountId: string;
  }) => Array<string | number>;
  mergeEntries?: (params: {
    existing: Array<string | number>;
    parsed: string[];
  }) => string[];
  applyAllowFrom: (params: {
    cfg: TConfig;
    accountId: string;
    allowFrom: string[];
  }) => TConfig | Promise<TConfig>;
}): NonNullable<ChannelSetupDmPolicy["promptAllowFrom"]>;
declare function createTopLevelChannelParsedAllowFromPrompt(params: {
  channel: string;
  defaultAccountId: string | ((cfg: OpenClawConfig) => string);
  enabled?: boolean;
  noteTitle?: string;
  noteLines?: string[];
  message: string;
  placeholder: string;
  parseEntries: (raw: string) => ParsedAllowFromResult;
  getExistingAllowFrom?: (cfg: OpenClawConfig) => Array<string | number>;
  mergeEntries?: (params: {
    existing: Array<string | number>;
    parsed: string[];
  }) => string[];
}): NonNullable<ChannelSetupDmPolicy["promptAllowFrom"]>;
declare function createAllowFromSection(params: {
  helpTitle?: string;
  helpLines?: string[];
  credentialInputKey?: NonNullable<ChannelSetupWizard["allowFrom"]>["credentialInputKey"];
  message: string;
  placeholder: string;
  invalidWithoutCredentialNote: string;
  parseInputs?: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["parseInputs"]>;
  parseId: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["parseId"]>;
  resolveEntries?: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["resolveEntries"]>;
  apply: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["apply"]>;
}): NonNullable<ChannelSetupWizard["allowFrom"]>;
declare function noteChannelLookupSummary(params: {
  prompter: Pick<WizardPrompter, "note">;
  label: string;
  resolvedSections: Array<{
    title: string;
    values: string[];
  }>;
  unresolved?: string[];
}): Promise<void>;
declare function noteChannelLookupFailure(params: {
  prompter: Pick<WizardPrompter, "note">;
  label: string;
  error: unknown;
}): Promise<void>;
type AllowFromResolution = {
  input: string;
  resolved: boolean;
  id?: string | null;
};
declare function resolveEntriesWithOptionalToken<TResult>(params: {
  token?: string | null;
  entries: string[];
  buildWithoutToken: (input: string) => TResult;
  resolveEntries: (params: {
    token: string;
    entries: string[];
  }) => Promise<TResult[]>;
}): Promise<TResult[]>;
declare function promptResolvedAllowFrom(params: {
  prompter: WizardPrompter;
  existing: Array<string | number>;
  token?: string | null;
  message: string;
  placeholder: string;
  label: string;
  parseInputs: (value: string) => string[];
  parseId: (value: string) => string | null;
  invalidWithoutTokenNote: string;
  resolveEntries: (params: {
    token: string;
    entries: string[];
  }) => Promise<AllowFromResolution[]>;
}): Promise<string[]>;
//#endregion
//#region src/channels/plugins/setup-wizard-proxy.d.ts
type PromptAllowFromParams = Parameters<NonNullable<ChannelSetupDmPolicy["promptAllowFrom"]>>[0];
type ResolveAllowFromEntriesParams = Parameters<NonNullable<ChannelSetupWizard["allowFrom"]>["resolveEntries"]>[0];
type ResolveAllowFromEntriesResult = Awaited<ReturnType<NonNullable<ChannelSetupWizard["allowFrom"]>["resolveEntries"]>>;
type ResolveGroupAllowlistParams = Parameters<NonNullable<NonNullable<ChannelSetupWizard["groupAccess"]>["resolveAllowlist"]>>[0];
type DelegatedStatusBase = Omit<ChannelSetupWizard["status"], "resolveConfigured" | "resolveStatusLines" | "resolveSelectionHint" | "resolveQuickstartScore">;
/**
 * Creates a setup wizard facade with selected hooks delegated to a lazy wizard.
 */
declare function createDelegatedSetupWizardProxy(params: {
  channel: string;
  loadWizard: () => Promise<ChannelSetupWizard>;
  status: DelegatedStatusBase;
  credentials?: ChannelSetupWizard["credentials"];
  textInputs?: ChannelSetupWizard["textInputs"];
  completionNote?: ChannelSetupWizard["completionNote"];
  dmPolicy?: ChannelSetupWizard["dmPolicy"];
  disable?: ChannelSetupWizard["disable"];
  resolveShouldPromptAccountIds?: ChannelSetupWizard["resolveShouldPromptAccountIds"];
  onAccountRecorded?: ChannelSetupWizard["onAccountRecorded"];
  delegatePrepare?: boolean;
  delegateFinalize?: boolean;
}): ChannelSetupWizard;
/**
 * Creates a setup wizard proxy that delegates allowlist resolution when available.
 */
declare function createAllowlistSetupWizardProxy<TGroupResolved>(params: {
  loadWizard: () => Promise<ChannelSetupWizard>;
  createBase: (handlers: {
    promptAllowFrom: (params: PromptAllowFromParams) => Promise<OpenClawConfig>;
    resolveAllowFromEntries: (params: ResolveAllowFromEntriesParams) => Promise<ResolveAllowFromEntriesResult>;
    resolveGroupAllowlist: (params: ResolveGroupAllowlistParams) => Promise<TGroupResolved>;
  }) => ChannelSetupWizard;
  fallbackResolvedGroupAllowlist: (entries: string[]) => TGroupResolved;
}): ChannelSetupWizard;
//#endregion
//#region src/channels/plugins/setup-wizard-binary.d.ts
type SetupTextInputParams = Parameters<NonNullable<ChannelSetupWizardTextInput["currentValue"]>>[0];
/**
 * Creates setup status resolvers for channels backed by a required local binary.
 */
declare function createDetectedBinaryStatus(params: {
  channelLabel: string;
  binaryLabel: string;
  configuredLabel: string;
  unconfiguredLabel: string;
  configuredHint: string;
  unconfiguredHint: string;
  configuredScore: number;
  unconfiguredScore: number;
  resolveConfigured: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
  }) => boolean | Promise<boolean>;
  resolveBinaryPath: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
  }) => string;
  detectBinary?: (path: string) => Promise<boolean>;
}): ChannelSetupWizardStatus;
/**
 * Creates a setup text input that records or reuses a CLI path.
 */
declare function createCliPathTextInput(params: {
  inputKey: ChannelSetupWizardTextInput["inputKey"];
  message: string;
  resolvePath: (params: SetupTextInputParams) => string | undefined;
  shouldPrompt: NonNullable<ChannelSetupWizardTextInput["shouldPrompt"]>;
  helpTitle?: string;
  helpLines?: string[];
}): ChannelSetupWizardTextInput;
/**
 * Delegates a text input's `shouldPrompt` check to a lazily loaded setup wizard.
 */
declare function createDelegatedTextInputShouldPrompt(params: {
  loadWizard: () => Promise<ChannelSetupWizard>;
  inputKey: ChannelSetupWizardTextInput["inputKey"];
}): NonNullable<ChannelSetupWizardTextInput["shouldPrompt"]>;
//#endregion
//#region src/plugin-sdk/setup-credential.d.ts
type ResolvedCredentialAccount = {
  config: object;
};
type CredentialPatchParams<TAccount extends ResolvedCredentialAccount> = {
  cfg: OpenClawConfig;
  accountId: string;
  account: TAccount;
  mode: "set" | "env";
  patch: Record<string, unknown>;
  clearFields: string[];
};
type TokenCredentialParams<TAccount extends ResolvedCredentialAccount> = Omit<ChannelSetupWizardCredential, "inspect" | "applySet" | "applyUseEnv"> & {
  configKey: string;
  configuredFields?: string[];
  resolveAccount: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => TAccount;
  accountConfigured?: (account: TAccount) => boolean;
  hasConfiguredValue?: (account: TAccount) => boolean;
  resolvedValue?: (account: TAccount) => string | undefined;
  envValue?: (params: {
    accountId: string;
  }) => string | undefined;
  patchAccount?: (params: CredentialPatchParams<TAccount>) => OpenClawConfig | Promise<OpenClawConfig>;
  set?: {
    clearFields?: string[];
    value?: "input" | "resolved";
  };
  useEnv?: {
    clearFields?: string[];
    patch?: (account: TAccount) => Record<string, unknown>;
  };
};
/** Build a declarative token/secret setup step while preserving channel-owned patch semantics. */
declare function defineTokenCredential<TAccount extends ResolvedCredentialAccount>(params: TokenCredentialParams<TAccount>): ChannelSetupWizardCredential;
type BaseUrlTextInputParams<TAccount> = Omit<ChannelSetupWizardTextInput, "currentValue" | "initialValue" | "validate" | "normalizeValue" | "applySet"> & {
  configKey: string;
  resolveAccount: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => TAccount;
  currentValue: (account: TAccount) => string | undefined;
  includeInitialValue?: boolean;
  validate: (value: string) => string | undefined;
  normalize: (value: string) => string;
  patchAccount: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    patch: Record<string, unknown>;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
};
/** Build a base-URL setup input with shared read, validation, normalization, and patch wiring. */
declare function baseUrlTextInput<TAccount>(params: BaseUrlTextInputParams<TAccount>): ChannelSetupWizardTextInput;
//#endregion
export { promptParsedAllowFromForAccount as A, SetupTranslator as B, noteChannelLookupSummary as C, patchChannelConfigForAccount as D, parseSetupEntriesWithParser as E, runSingleChannelSecretStep as F, WizardI18nParams as H, setAccountAllowFromForChannel as I, setSetupChannelEnabled as L, promptSingleChannelSecretInput as M, resolveEntriesWithOptionalToken as N, patchTopLevelChannelConfigSection as O, resolveSetupAccountId as P, setTopLevelChannelDmPolicyWithAllowFrom as R, noteChannelLookupFailure as S, parseSetupEntriesAllowingWildcard as T, createSetupTranslator as V, createTopLevelChannelDmPolicySetter as _, createDetectedBinaryStatus as a, mergeAllowFromEntries as b, addWildcardAllowFrom as c, createAccountScopedGroupAccessSection as d, createAllowFromSection as f, createTopLevelChannelDmPolicy as g, createTopLevelChannelAllowFromSetter as h, createDelegatedTextInputShouldPrompt as i, promptResolvedAllowFrom as j, promptAccountId as k, buildSingleChannelSecretPromptState as l, createStandardChannelSetupStatus as m, defineTokenCredential as n, createAllowlistSetupWizardProxy as o, createPromptParsedAllowFromForAccount as p, createCliPathTextInput as r, createDelegatedSetupWizardProxy as s, baseUrlTextInput as t, createAccountScopedAllowFromSection as u, createTopLevelChannelGroupPolicySetter as v, parseMentionOrPrefixedId as w, normalizeAllowFromEntries as x, createTopLevelChannelParsedAllowFromPrompt as y, splitSetupEntries as z };