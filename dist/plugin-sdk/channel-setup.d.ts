import { d as ChannelSetupAdapter, f as ChannelSetupInput, u as defineChannelSetupContract } from "../manifest-registry-CMnhqUB6.js";
import "../types.adapters-dxHXA2rq.js";
import { t as DEFAULT_ACCOUNT_ID } from "../account-id-Dh6XMgGH.js";
import { n as ChannelSetupWizard, t as ChannelSetupDmPolicy } from "../setup-wizard-types-B39o8fS3.js";
import { L as setSetupChannelEnabled, g as createTopLevelChannelDmPolicy, n as defineTokenCredential, t as baseUrlTextInput, z as splitSetupEntries } from "../setup-credential-C1TqvFbP.js";
import { t as formatDocsLink } from "../links-CUrut3Wv.js";
import "../setup-Cpu8E62N.js";
//#region src/plugin-sdk/optional-channel-setup.d.ts
type OptionalChannelSetupParams$1 = {
  /** Channel id used by setup wizard status and routing. */
  channel: string;
  /** Human-readable plugin label shown in operator-facing install guidance. */
  label: string;
  /** Package spec operators should install before running real channel setup. */
  npmSpec?: string;
  /** Docs path linked from validation and wizard status messages. */
  docsPath?: string;
};
/**
 * Creates a setup adapter for optional channel plugins that are not installed.
 * Validation returns install guidance, while config mutation fails with the same
 * message so setup flows cannot silently create partial channel config.
 */
export declare function createOptionalChannelSetupAdapter(
/** Optional plugin metadata used to build setup validation guidance. */
params: OptionalChannelSetupParams$1): ChannelSetupAdapter;
/**
 * Creates a wizard surface for optional channel plugins that are not installed.
 * The wizard is always unconfigured and stops finalize with install guidance.
 */
export declare function createOptionalChannelSetupWizard(
/** Optional plugin metadata used to build setup wizard status guidance. */
params: OptionalChannelSetupParams$1): ChannelSetupWizard;
//#endregion
//#region src/plugin-sdk/channel-setup.d.ts
/** Metadata used to advertise an optional channel plugin during setup flows. */
type OptionalChannelSetupParams = {
  /** Channel id shown in setup status and wizard routing. */
  channel: string;
  /** Human-readable plugin name used in install guidance. */
  label: string;
  /** Package spec operators should install to enable the optional channel. */
  npmSpec?: string;
  /** Docs path linked from setup validation and wizard hints. */
  docsPath?: string;
};
/** Paired setup adapter + setup wizard for channels that may not be installed yet. */
export type OptionalChannelSetupSurface = {
  /** Adapter that fails validation with install guidance until the plugin is installed. */
  setupAdapter: ChannelSetupAdapter;
  /** Wizard status/finalize surface that points operators to the missing plugin. */
  setupWizard: ChannelSetupWizard;
};
/** Build both optional setup surfaces from one metadata object. */
export declare function createOptionalChannelSetupSurface(
/** Optional plugin metadata shared by the adapter and wizard. */
params: OptionalChannelSetupParams): OptionalChannelSetupSurface;
//#endregion
export { type ChannelSetupAdapter, type ChannelSetupDmPolicy, type ChannelSetupInput, type ChannelSetupWizard, DEFAULT_ACCOUNT_ID, baseUrlTextInput, createTopLevelChannelDmPolicy, defineChannelSetupContract, defineTokenCredential, formatDocsLink, setSetupChannelEnabled, splitSetupEntries };