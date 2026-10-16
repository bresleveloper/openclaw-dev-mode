import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { f as DmPolicy } from "./types.base-D8MIFbSh.js";
import "./types-C-BtfS0H.js";
import { n as RuntimeEnv } from "./runtime-DlqUc5_p.js";
import { d as ChannelSetupAdapter, l as ChannelOwnedSetupContract } from "./manifest-registry-Bj1Q7bnt.js";
import { c as ChannelCapabilities, x as ChannelMeta } from "./types.core-Bra2QBA5.js";
import { t as ChannelId } from "./channel-id.types-CM2F8b5e.js";
import { s as ChannelConfigAdapter } from "./types.adapters-Bo2TMZGx.js";
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
declare class WizardCancelledError extends Error {
  constructor(message?: string);
}
//#endregion
//#region src/channels/plugins/setup-group-access.d.ts
/**
 * Group access policy selected during channel setup.
 */
type ChannelAccessPolicy = "allowlist" | "open" | "disabled";
/**
 * Prompts for the full group access config, including allowlist entries when needed.
 */
declare function promptChannelAccessConfig(params: {
  prompter: WizardPrompter;
  label: string;
  currentPolicy?: ChannelAccessPolicy;
  currentEntries?: string[];
  placeholder?: string;
  allowOpen?: boolean;
  allowDisabled?: boolean;
  skipAllowlistEntries?: boolean;
  defaultPrompt?: boolean;
  updatePrompt?: boolean;
}): Promise<{
  policy: ChannelAccessPolicy;
  entries: string[];
} | null>;
//#endregion
//#region src/channels/plugins/setup-wizard-types.d.ts
type ChannelSetupPlugin = {
  id: ChannelId;
  meta: ChannelMeta;
  capabilities: ChannelCapabilities;
  config: ChannelConfigAdapter<unknown>;
  /** Channel-owned typed setup contract. Preferred over the legacy shared input adapter. */
  setupContract?: ChannelOwnedSetupContract;
  /** @deprecated Use setupContract for new plugins. */
  setup?: ChannelSetupAdapter;
  setupWizard?: ChannelSetupWizard | ChannelSetupWizardAdapter;
};
/** Status block shown before users select channels during setup. */
type ChannelSetupWizardStatus = {
  configuredLabel: string;
  unconfiguredLabel: string;
  configuredHint?: string;
  unconfiguredHint?: string;
  configuredScore?: number;
  unconfiguredScore?: number;
  resolveConfigured: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
  }) => boolean | Promise<boolean>;
  resolveStatusLines?: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    configured: boolean;
  }) => string[] | Promise<string[]>;
  resolveSelectionHint?: (params: Parameters<NonNullable<ChannelSetupWizardStatus["resolveStatusLines"]>>[0]) => string | undefined | Promise<string | undefined>;
  resolveQuickstartScore?: (params: Parameters<NonNullable<ChannelSetupWizardStatus["resolveStatusLines"]>>[0]) => number | undefined | Promise<number | undefined>;
};
/** Snapshot of one credential before prompting or reusing existing config. */
type ChannelSetupWizardCredentialState = {
  accountConfigured: boolean;
  hasConfiguredValue: boolean;
  resolvedValue?: string;
  envValue?: string;
};
type ChannelSetupWizardCredentialValues = Partial<Record<string, string>>;
type ChannelSetupWizardAccountContext = {
  cfg: OpenClawConfig;
  accountId: string;
};
type ChannelSetupWizardStepContext = ChannelSetupWizardAccountContext & {
  credentialValues: ChannelSetupWizardCredentialValues;
};
/** Optional explanatory note shown when its owning step is reached. */
type ChannelSetupWizardNote = {
  title: string;
  lines: string[];
  shouldShow?: (params: ChannelSetupWizardStepContext) => boolean | Promise<boolean>;
};
/** Lets a wizard configure an account entirely from existing environment. */
type ChannelSetupWizardEnvShortcut = {
  prompt: string;
  preferredEnvVar?: string;
  isAvailable: (params: ChannelSetupWizardAccountContext) => boolean;
  apply: (params: ChannelSetupWizardAccountContext) => OpenClawConfig | Promise<OpenClawConfig>;
};
/** Declarative secret/input step for a channel account credential. */
type ChannelSetupWizardCredential = {
  /** Plugin-owned key written into the runtime setup input. */
  inputKey: string;
  providerHint: string;
  credentialLabel: string;
  preferredEnvVar?: string;
  helpTitle?: string;
  helpLines?: string[];
  envPrompt: string;
  keepPrompt: string;
  inputPrompt: string;
  allowEnv?: (params: ChannelSetupWizardAccountContext) => boolean;
  inspect: (params: ChannelSetupWizardAccountContext) => ChannelSetupWizardCredentialState;
  shouldPrompt?: (params: ChannelSetupWizardStepContext & {
    currentValue?: string;
    state: ChannelSetupWizardCredentialState;
  }) => boolean | Promise<boolean>;
  applyUseEnv?: ChannelSetupWizardEnvShortcut["apply"];
  applySet?: (params: ChannelSetupWizardStepContext & {
    value: unknown;
    resolvedValue: string;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
};
/** Declarative text step that can depend on resolved credentials. */
type ChannelSetupWizardTextInput = {
  /** Plugin-owned key written into the runtime setup input. */
  inputKey: string;
  message: string;
  placeholder?: string;
  /** Mask input and keep any configured value server-side. */
  sensitive?: boolean;
  required?: boolean;
  applyEmptyValue?: boolean;
  helpTitle?: string;
  helpLines?: string[];
  confirmCurrentValue?: boolean;
  keepPrompt?: string | ((value: string) => string);
  currentValue?: (params: ChannelSetupWizardStepContext) => string | undefined | Promise<string | undefined>;
  initialValue?: NonNullable<ChannelSetupWizardTextInput["currentValue"]>;
  shouldPrompt?: (params: ChannelSetupWizardStepContext & {
    currentValue?: string;
  }) => boolean | Promise<boolean>;
  applyCurrentValue?: boolean;
  validate?: (params: ChannelSetupWizardStepContext & {
    value: string;
  }) => string | undefined;
  normalizeValue?: (params: ChannelSetupWizardStepContext & {
    value: string;
  }) => string;
  applySet?: (params: ChannelSetupWizardAccountContext & {
    value: string;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
};
type ChannelSetupWizardAllowFromEntry = {
  input: string;
  resolved: boolean;
  id: string | null;
};
/** Channel-specific resolver for user-entered allowlist targets. */
type ChannelSetupWizardAllowFrom = {
  helpTitle?: string;
  helpLines?: string[];
  credentialInputKey?: string;
  message: string;
  placeholder: string;
  invalidWithoutCredentialNote: string;
  parseInputs?: (raw: string) => string[];
  parseId: (raw: string) => string | null;
  resolveEntries: (params: ChannelSetupWizardStepContext & {
    entries: string[];
  }) => Promise<ChannelSetupWizardAllowFromEntry[]>;
  apply: (params: ChannelSetupWizardAccountContext & {
    allowFrom: string[];
  }) => OpenClawConfig | Promise<OpenClawConfig>;
};
/** Declarative group/DM access policy step used by interactive setup. */
type ChannelSetupWizardGroupAccess = {
  label: string;
  placeholder: string;
  helpTitle?: string;
  helpLines?: string[];
  skipAllowlistEntries?: boolean;
  currentPolicy: (params: ChannelSetupWizardAccountContext) => ChannelAccessPolicy;
  currentEntries: (params: ChannelSetupWizardAccountContext) => string[];
  updatePrompt: (params: ChannelSetupWizardAccountContext) => boolean;
  setPolicy: (params: ChannelSetupWizardAccountContext & {
    policy: ChannelAccessPolicy;
  }) => OpenClawConfig;
  resolveAllowlist?: (params: ChannelSetupWizardStepContext & {
    entries: string[];
    prompter: Pick<WizardPrompter, "note">;
  }) => Promise<unknown>;
  applyAllowlist?: (params: ChannelSetupWizardAccountContext & {
    resolved: unknown;
  }) => OpenClawConfig;
};
type ChannelSetupWizardHookContext = ChannelSetupWizardStepContext & {
  runtime: ChannelSetupConfigureContext["runtime"];
  prompter: WizardPrompter;
  options?: ChannelSetupConfigureContext["options"];
};
type ChannelSetupWizardHookResult = {
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void;
/** Optional pre-step hook for deriving helper config or credential values. */
type ChannelSetupWizardPrepare = (params: ChannelSetupWizardHookContext) => ChannelSetupWizardHookResult | Promise<ChannelSetupWizardHookResult>;
/** Optional post-step hook for final validation, writes, or post prompts. */
type ChannelSetupWizardFinalize = (params: ChannelSetupWizardHookContext & {
  forceAllowFrom: boolean;
}) => ChannelSetupWizardHookResult | Promise<ChannelSetupWizardHookResult>;
/** Full declarative setup wizard consumed by the generic setup adapter. */
type ChannelSetupWizard = {
  channel: string;
  status: ChannelSetupWizardStatus;
  introNote?: ChannelSetupWizardNote;
  envShortcut?: ChannelSetupWizardEnvShortcut;
  resolveAccountIdForConfigure?: (params: {
    cfg: OpenClawConfig;
    prompter: WizardPrompter;
    options?: ChannelSetupConfigureContext["options"];
    accountOverride?: string;
    shouldPromptAccountIds: boolean;
    listAccountIds: ChannelSetupPlugin["config"]["listAccountIds"];
    defaultAccountId: string;
  }) => string | Promise<string>;
  resolveShouldPromptAccountIds?: (params: {
    cfg: OpenClawConfig;
    options?: ChannelSetupConfigureContext["options"];
    shouldPromptAccountIds: boolean;
  }) => boolean;
  prepare?: ChannelSetupWizardPrepare;
  stepOrder?: "credentials-first" | "text-first";
  credentials: ChannelSetupWizardCredential[];
  textInputs?: ChannelSetupWizardTextInput[];
  finalize?: ChannelSetupWizardFinalize;
  completionNote?: ChannelSetupWizardNote;
  dmPolicy?: ChannelSetupDmPolicy;
  allowFrom?: ChannelSetupWizardAllowFrom;
  groupAccess?: ChannelSetupWizardGroupAccess;
  disable?: (cfg: OpenClawConfig) => OpenClawConfig;
  onAccountRecorded?: ChannelSetupWizardAdapter["onAccountRecorded"];
};
/** Runtime options for selecting and configuring one or more channels. */
type SetupChannelsOptions = {
  /** Workspace already selected by the caller, used for trusted plugin discovery. */
  workspaceDir?: string;
  allowDisable?: boolean;
  allowIMessageInstall?: boolean;
  allowSignalInstall?: boolean;
  /** Revalidate host authority immediately before an installer or other durable effect. */
  beforePersistentEffect?: () => Promise<void>;
  /** Pure live setup-owner check after asynchronous preparation and at the final write grant. */
  assertPersistentEffectCurrent?: () => void;
  onSelection?: (selection: ChannelId[]) => void;
  onPostWriteHook?: (hook: ChannelOnboardingPostWriteHook) => void;
  accountIds?: Partial<Record<ChannelId, string>>;
  onAccountId?: (channel: ChannelId, accountId: string) => void;
  onResolvedPlugin?: (channel: ChannelId, plugin: ChannelSetupPlugin) => void;
  promptAccountIds?: boolean;
  forceAllowFromChannels?: ChannelId[];
  deferStatusUntilSelection?: boolean;
  /**
   * The controlling client finishes device linking itself after config is
   * written (e.g. Control UI renders the WhatsApp QR via web.login.*), so
   * setup surfaces must skip terminal-interactive login/link prompts.
   */
  deferDeviceLinkToClient?: boolean;
  skipStatusNote?: boolean;
  skipDmPolicyPrompt?: boolean;
  skipConfirm?: boolean;
  quickstartDefaults?: boolean;
  initialSelection?: ChannelId[];
  /** Finish after the explicitly targeted channel is configured or paused. */
  finishAfterInitialSelection?: boolean;
  secretInputMode?: "plaintext" | "ref";
};
type PromptAccountIdParams = {
  cfg: OpenClawConfig;
  prompter: WizardPrompter;
  label: string;
  currentId?: string;
  listAccountIds: (cfg: OpenClawConfig) => string[];
  defaultAccountId: string;
};
type PromptAccountId = (params: PromptAccountIdParams) => Promise<string>;
type ChannelSetupStatus = {
  channel: ChannelId;
  configured: boolean;
  statusLines: string[];
  selectionHint?: string;
  quickstartScore?: number;
};
/** Shared context for status checks before channel selection. */
type ChannelSetupStatusContext = {
  cfg: OpenClawConfig;
  options?: SetupChannelsOptions;
  accountOverrides: Partial<Record<ChannelId, string>>;
};
/** Shared context for applying setup changes for a selected channel. */
type ChannelSetupConfigureContext = ChannelSetupStatusContext & {
  runtime: RuntimeEnv;
  prompter: WizardPrompter;
  shouldPromptAccountIds: boolean;
  forceAllowFrom: boolean;
};
/** Context passed after setup has written config to disk. */
type ChannelOnboardingPostWriteContext = ChannelSetupWizardAccountContext & {
  previousCfg: OpenClawConfig;
  runtime: RuntimeEnv;
};
/** Deferred hook for channel work that must run after config persistence. */
type ChannelOnboardingPostWriteHook = {
  channel: ChannelId;
  accountId: string;
  run: (ctx: {
    cfg: OpenClawConfig;
    runtime: RuntimeEnv;
  }) => Promise<void> | void;
};
type ChannelSetupResult = {
  cfg: OpenClawConfig;
  accountId?: string;
  completion?: "configured";
} | {
  cfg: OpenClawConfig;
  /** Paused setup is persisted without configured-account hooks or routing. */
  completion: "paused";
  accountId?: never;
};
type ChannelSetupConfiguredResult = ChannelSetupResult | "skip";
type ChannelSetupInteractiveContext = ChannelSetupConfigureContext & {
  configured: boolean;
  label: string;
};
/** Optional direct-message policy contract exposed by setup adapters. */
type ChannelSetupDmPolicy = {
  label: string;
  channel: ChannelId;
  policyKey: string;
  allowFromKey: string;
  resolveConfigKeys?: (cfg: OpenClawConfig, accountId?: string) => {
    policyKey: string;
    allowFromKey: string;
  };
  getCurrent: (cfg: OpenClawConfig, accountId?: string) => DmPolicy;
  setPolicy: (cfg: OpenClawConfig, policy: DmPolicy, accountId?: string) => OpenClawConfig;
  promptAllowFrom?: (params: {
    cfg: OpenClawConfig;
    prompter: WizardPrompter;
    accountId?: string;
  }) => Promise<OpenClawConfig>;
};
/** Imperative adapter consumed by onboarding and setup flows. */
type ChannelSetupWizardAdapter = {
  channel: ChannelId;
  getStatus: (ctx: ChannelSetupStatusContext) => Promise<ChannelSetupStatus>;
  configure: (ctx: ChannelSetupConfigureContext) => Promise<ChannelSetupResult>;
  configureInteractive?: (ctx: ChannelSetupInteractiveContext) => Promise<ChannelSetupConfiguredResult>;
  configureWhenConfigured?: NonNullable<ChannelSetupWizardAdapter["configureInteractive"]>;
  afterConfigWritten?: (ctx: ChannelOnboardingPostWriteContext) => Promise<void> | void;
  dmPolicy?: ChannelSetupDmPolicy;
  onAccountRecorded?: (accountId: string, options?: SetupChannelsOptions) => void;
  disable?: (cfg: OpenClawConfig) => OpenClawConfig;
};
//#endregion
export { ChannelSetupWizardAllowFromEntry as a, ChannelSetupWizardTextInput as c, WizardCancelledError as d, WizardMultiSelectParams as f, WizardSelectParams as h, ChannelSetupWizardAdapter as i, PromptAccountId as l, WizardPrompter as m, ChannelSetupPlugin as n, ChannelSetupWizardCredential as o, WizardProgress as p, ChannelSetupWizard as r, ChannelSetupWizardStatus as s, ChannelSetupDmPolicy as t, promptChannelAccessConfig as u };