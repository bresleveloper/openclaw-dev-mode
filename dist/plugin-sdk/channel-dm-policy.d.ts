import { M as OpenClawConfig } from "../types-D7I_F5Ux.js";
import { d as DmPolicy } from "../types.base-6bKsSmWG.js";
import { PE as ChannelSetupDmPolicy, wA as ChannelId } from "../config-contracts-CY87ANNp.js";
import { d as ChannelSetupAdapter } from "../manifest-registry-DcAsDGQ5.js";
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