import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { d as ChannelSetupAdapter } from "../manifest-registry-CMnhqUB6.js";
import "../config-CTir7RIz.js";
import "../types.adapters-dxHXA2rq.js";
import { t as DEFAULT_ACCOUNT_ID } from "../account-id-Dh6XMgGH.js";
import { a as ChannelSetupWizardCredential, i as ChannelSetupWizardAllowFromEntry, n as ChannelSetupWizard, p as WizardPrompter, s as ChannelSetupWizardTextInput, t as ChannelSetupDmPolicy } from "../setup-wizard-types-B39o8fS3.js";
import { a as createSetupInputPresenceValidator, i as createPatchedAccountSetupAdapter, r as createEnvPatchedAccountSetupAdapter } from "../setup-helpers-CsmtHi6m.js";
import { A as promptParsedAllowFromForAccount, B as SetupTranslator, C as noteChannelLookupSummary, D as patchChannelConfigForAccount, H as WizardI18nParams, I as setAccountAllowFromForChannel, L as setSetupChannelEnabled, N as resolveEntriesWithOptionalToken, P as resolveSetupAccountId, S as noteChannelLookupFailure, T as parseSetupEntriesAllowingWildcard, V as createSetupTranslator, b as mergeAllowFromEntries, d as createAccountScopedGroupAccessSection, g as createTopLevelChannelDmPolicy, i as createDelegatedTextInputShouldPrompt, j as promptResolvedAllowFrom, m as createStandardChannelSetupStatus, n as defineTokenCredential, o as createAllowlistSetupWizardProxy, r as createCliPathTextInput, s as createDelegatedSetupWizardProxy, t as baseUrlTextInput, u as createAccountScopedAllowFromSection, w as parseMentionOrPrefixedId, z as splitSetupEntries } from "../setup-credential-C1TqvFbP.js";
import "@clack/prompts";
//#region src/wizard/clack-prompter.d.ts
export declare function createClackPrompter(output?: NodeJS.WriteStream, signal?: AbortSignal): WizardPrompter;
//#endregion
//#region src/channels/plugins/setup-wizard-legacy-compat.d.ts
type AllowFromResolution = {
  input: string;
  resolved: boolean;
  id?: string | null;
};
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
  resolveEntries: (params: {
    token: string;
    entries: string[];
  }) => Promise<AllowFromResolution[]>;
}): Promise<OpenClawConfig>;
//#endregion
export { type ChannelSetupAdapter, type ChannelSetupDmPolicy, type ChannelSetupWizard, type ChannelSetupWizardAllowFromEntry, type ChannelSetupWizardCredential, type ChannelSetupWizardTextInput, DEFAULT_ACCOUNT_ID, type OpenClawConfig, type SetupTranslator, type WizardI18nParams, type WizardPrompter, baseUrlTextInput, createAccountScopedAllowFromSection, createAccountScopedGroupAccessSection, createAllowlistSetupWizardProxy, createCliPathTextInput, createDelegatedSetupWizardProxy, createDelegatedTextInputShouldPrompt, createEnvPatchedAccountSetupAdapter, createPatchedAccountSetupAdapter, createSetupInputPresenceValidator, createSetupTranslator, createStandardChannelSetupStatus, createTopLevelChannelDmPolicy, defineTokenCredential, mergeAllowFromEntries, noteChannelLookupFailure, noteChannelLookupSummary, parseMentionOrPrefixedId, parseSetupEntriesAllowingWildcard, patchChannelConfigForAccount, promptParsedAllowFromForAccount, promptResolvedAllowFrom, resolveEntriesWithOptionalToken, resolveSetupAccountId, setAccountAllowFromForChannel, setSetupChannelEnabled, splitSetupEntries };