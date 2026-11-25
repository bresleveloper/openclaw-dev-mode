import { Bf as createSetupInputPresenceValidator, Rf as createEnvPatchedAccountSetupAdapter, _A as WizardPrompter, aA as ChannelSetupDmPolicy, cA as ChannelSetupWizardAllowFromEntry, dA as ChannelSetupWizardTextInput, lA as ChannelSetupWizardCredential, oA as ChannelSetupWizard, zf as createPatchedAccountSetupAdapter } from "../config-contracts-hzlacViZ.js";
import { t as DEFAULT_ACCOUNT_ID } from "../account-id-Dn0dJeta.js";
import { r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import { d as ChannelSetupAdapter } from "../manifest-registry-CNNq5Vj2.js";
import { A as promptParsedAllowFromForAccount, B as SetupTranslator, C as noteChannelLookupSummary, D as patchChannelConfigForAccount, H as WizardI18nParams, I as setAccountAllowFromForChannel, L as setSetupChannelEnabled, N as resolveEntriesWithOptionalToken, P as resolveSetupAccountId, S as noteChannelLookupFailure, T as parseSetupEntriesAllowingWildcard, V as createSetupTranslator, b as mergeAllowFromEntries, d as createAccountScopedGroupAccessSection, g as createTopLevelChannelDmPolicy, i as createDelegatedTextInputShouldPrompt, j as promptResolvedAllowFrom, m as createStandardChannelSetupStatus, n as defineTokenCredential, o as createAllowlistSetupWizardProxy, r as createCliPathTextInput, s as createDelegatedSetupWizardProxy, t as baseUrlTextInput, u as createAccountScopedAllowFromSection, w as parseMentionOrPrefixedId, z as splitSetupEntries } from "../setup-credential-6fwONHRi.js";
export declare function createClackPrompter(output?: NodeJS.WriteStream, signal?: AbortSignal): WizardPrompter;
/** @deprecated Compatibility for plugins published before setup policy became plugin-owned. */
export declare function createLegacyCompatChannelDmPolicy(params: {
  label: string;
  channel: string;
  promptAllowFrom?: ChannelSetupDmPolicy["promptAllowFrom"];
}): ChannelSetupDmPolicy;
/** @deprecated Compatibility for plugins published before setup allowlists became plugin-owned. */
export declare function promptLegacyChannelAllowFromForAccount<TAccount>(params: {
  cfg: OpenClawConfig;
  channel: string;
  prompter: WizardPrompter;
  accountId?: string;
  defaultAccountId: string;
  resolveAccount: (cfg: OpenClawConfig, accountId: string) => TAccount;
  resolveExisting: (account: TAccount, cfg: OpenClawConfig) => Array<string | number>;
  resolveToken: (account: TAccount) => string | null | undefined;
  noteTitle: string;
  noteLines: string[];
  message: string;
  placeholder: string;
  parseId: (value: string) => string | null;
  invalidWithoutTokenNote: string;
  resolveEntries: Parameters<typeof promptResolvedAllowFrom>[0]["resolveEntries"];
}): Promise<OpenClawConfig>;
export { type ChannelSetupAdapter, type ChannelSetupDmPolicy, type ChannelSetupWizard, type ChannelSetupWizardAllowFromEntry, type ChannelSetupWizardCredential, type ChannelSetupWizardTextInput, DEFAULT_ACCOUNT_ID, type OpenClawConfig, type SetupTranslator, type WizardI18nParams, type WizardPrompter, baseUrlTextInput, createAccountScopedAllowFromSection, createAccountScopedGroupAccessSection, createAllowlistSetupWizardProxy, createCliPathTextInput, createDelegatedSetupWizardProxy, createDelegatedTextInputShouldPrompt, createEnvPatchedAccountSetupAdapter, createPatchedAccountSetupAdapter, createSetupInputPresenceValidator, createSetupTranslator, createStandardChannelSetupStatus, createTopLevelChannelDmPolicy, defineTokenCredential, mergeAllowFromEntries, noteChannelLookupFailure, noteChannelLookupSummary, parseMentionOrPrefixedId, parseSetupEntriesAllowingWildcard, patchChannelConfigForAccount, promptParsedAllowFromForAccount, promptResolvedAllowFrom, resolveEntriesWithOptionalToken, resolveSetupAccountId, setAccountAllowFromForChannel, setSetupChannelEnabled, splitSetupEntries };