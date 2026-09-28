import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { m as DmPolicy } from "./types.base-CA0_JvyZ.js";
import "./types-BnfxNjkF.js";
import { n as RuntimeEnv } from "./runtime-DlqUc5_p.js";
import { d as ChannelSetupAdapter, l as ChannelOwnedSetupContract } from "./manifest-registry-CMnhqUB6.js";
import { c as ChannelCapabilities, x as ChannelMeta } from "./types.core-D1MQo5ra.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
import { s as ChannelConfigAdapter } from "./types.adapters-dxHXA2rq.js";
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
  setupContract?: ChannelOwnedSetupContract;
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
  resolveSelectionHint?: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    configured: boolean;
  }) => string | undefined | Promise<string | undefined>;
  resolveQuickstartScore?: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    configured: boolean;
  }) => number | undefined | Promise<number | undefined>;
};
/** Snapshot of one credential before prompting or reusing existing config. */
type ChannelSetupWizardCredentialState = {
  accountConfigured: boolean;
  hasConfiguredValue: boolean;
  resolvedValue?: string;
  envValue?: string;
};
type ChannelSetupWizardCredentialValues = Partial<Record<string, string>>;
/** Optional explanatory note shown when its owning step is reached. */
type ChannelSetupWizardNote = {
  title: string;
  lines: string[];
  shouldShow?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => boolean | Promise<boolean>;
};
/** Lets a wizard configure an account entirely from existing environment. */
type ChannelSetupWizardEnvShortcut = {
  prompt: string;
  preferredEnvVar?: string;
  isAvailable: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => boolean;
  apply: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
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
  allowEnv?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => boolean;
  inspect: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => ChannelSetupWizardCredentialState;
  shouldPrompt?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    currentValue?: string;
    state: ChannelSetupWizardCredentialState;
  }) => boolean | Promise<boolean>;
  applyUseEnv?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
  applySet?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
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
  currentValue?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => string | undefined | Promise<string | undefined>;
  initialValue?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => string | undefined | Promise<string | undefined>;
  shouldPrompt?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    currentValue?: string;
  }) => boolean | Promise<boolean>;
  applyCurrentValue?: boolean;
  validate?: (params: {
    value: string;
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => string | undefined;
  normalizeValue?: (params: {
    value: string;
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => string;
  applySet?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
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
  resolveEntries: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    entries: string[];
  }) => Promise<ChannelSetupWizardAllowFromEntry[]>;
  apply: (params: {
    cfg: OpenClawConfig;
    accountId: string;
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
  currentPolicy: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => ChannelAccessPolicy;
  currentEntries: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => string[];
  updatePrompt: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => boolean;
  setPolicy: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    policy: ChannelAccessPolicy;
  }) => OpenClawConfig;
  resolveAllowlist?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    entries: string[];
    prompter: Pick<WizardPrompter, "note">;
  }) => Promise<unknown>;
  applyAllowlist?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    resolved: unknown;
  }) => OpenClawConfig;
};
/** Optional pre-step hook for deriving helper config or credential values. */
type ChannelSetupWizardPrepare = (params: {
  cfg: OpenClawConfig;
  accountId: string;
  credentialValues: ChannelSetupWizardCredentialValues;
  runtime: ChannelSetupConfigureContext["runtime"];
  prompter: WizardPrompter;
  options?: ChannelSetupConfigureContext["options"];
}) => {
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void | Promise<{
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void>;
/** Optional post-step hook for final validation, writes, or post prompts. */
type ChannelSetupWizardFinalize = (params: {
  cfg: OpenClawConfig;
  accountId: string;
  credentialValues: ChannelSetupWizardCredentialValues;
  runtime: ChannelSetupConfigureContext["runtime"];
  prompter: WizardPrompter;
  options?: ChannelSetupConfigureContext["options"];
  forceAllowFrom: boolean;
}) => {
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void | Promise<{
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void>;
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
type ChannelSetupConfigureContext = {
  cfg: OpenClawConfig;
  runtime: RuntimeEnv;
  prompter: WizardPrompter;
  options?: SetupChannelsOptions;
  accountOverrides: Partial<Record<ChannelId, string>>;
  shouldPromptAccountIds: boolean;
  forceAllowFrom: boolean;
};
/** Context passed after setup has written config to disk. */
type ChannelOnboardingPostWriteContext = {
  previousCfg: OpenClawConfig;
  cfg: OpenClawConfig;
  accountId: string;
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
  configureWhenConfigured?: (ctx: ChannelSetupInteractiveContext) => Promise<ChannelSetupConfiguredResult>;
  afterConfigWritten?: (ctx: ChannelOnboardingPostWriteContext) => Promise<void> | void;
  dmPolicy?: ChannelSetupDmPolicy;
  onAccountRecorded?: (accountId: string, options?: SetupChannelsOptions) => void;
  disable?: (cfg: OpenClawConfig) => OpenClawConfig;
};
//#endregion
export { ChannelSetupWizardCredential as a, PromptAccountId as c, WizardMultiSelectParams as d, WizardProgress as f, ChannelSetupWizardAllowFromEntry as i, promptChannelAccessConfig as l, WizardSelectParams as m, ChannelSetupWizard as n, ChannelSetupWizardStatus as o, WizardPrompter as p, ChannelSetupWizardAdapter as r, ChannelSetupWizardTextInput as s, ChannelSetupDmPolicy as t, WizardCancelledError as u };