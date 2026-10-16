import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { f as DmPolicy } from "../types.base-D8MIFbSh.js";
import "../types-C-BtfS0H.js";
import { d as ChannelSetupAdapter } from "../manifest-registry-Bj1Q7bnt.js";
import "../types.core-Bra2QBA5.js";
import { t as ChannelId } from "../channel-id.types-CM2F8b5e.js";
import "../types.adapters-Bo2TMZGx.js";
import { t as ChannelSetupDmPolicy } from "../setup-wizard-types-nN6P9WIn.js";
//#region src/plugin-sdk/channel-dm-policy.d.ts
type DmPolicyAccountConfig = {
  dmPolicy?: DmPolicy;
  allowFrom?: ReadonlyArray<string | number> | null;
};
type ResolvedDmPolicyAccount<TConfig extends DmPolicyAccountConfig> = {
  accountId: string;
  config: TConfig;
};
type DmPolicyContext<TConfig extends DmPolicyAccountConfig> = {
  cfg: OpenClawConfig;
  requestedAccountId?: string;
  account: ResolvedDmPolicyAccount<TConfig>;
};
type DmPolicyPatchContext<TConfig extends DmPolicyAccountConfig> = DmPolicyContext<TConfig> & {
  policy: DmPolicy;
  allowFrom?: string[];
};
type CreateChannelDmPolicyParams<TConfig extends DmPolicyAccountConfig> = {
  label: string;
  channel: ChannelId;
  policyKey?: string;
  allowFromKey?: string;
  policyPath?: string;
  allowFromPath?: string;
  resolveAccount: (cfg: OpenClawConfig, accountId?: string) => ResolvedDmPolicyAccount<TConfig>;
  resolveConfigKeys?: (context: DmPolicyContext<TConfig>) => {
    policyKey: string;
    allowFromKey: string;
  };
  resolveAllowFrom?: (context: DmPolicyPatchContext<TConfig>) => string[] | undefined;
  buildPatch?: (context: DmPolicyPatchContext<TConfig>) => Record<string, unknown>;
  applyPatch?: (context: DmPolicyContext<TConfig> & {
    patch: Record<string, unknown>;
  }) => OpenClawConfig;
  setupSurface?: ChannelSetupAdapter | (() => ChannelSetupAdapter);
  promptAllowFrom: NonNullable<ChannelSetupDmPolicy["promptAllowFrom"]>;
};
/** Build an account-aware DM policy descriptor for channel setup flows. */
export declare function createChannelDmPolicy<TConfig extends DmPolicyAccountConfig>(params: CreateChannelDmPolicyParams<TConfig>): ChannelSetupDmPolicy & {
  promptAllowFrom: NonNullable<ChannelSetupDmPolicy["promptAllowFrom"]>;
};
//#endregion