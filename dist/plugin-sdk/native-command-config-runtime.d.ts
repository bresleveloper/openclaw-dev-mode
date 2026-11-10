import { $r as NativeCommandsSetting, M as OpenClawConfig } from "../types-D7I_F5Ux.js";
import { wA as ChannelId } from "../config-contracts-CY87ANNp.js";
//#region src/config/commands.d.ts
type NativeCommandSettingParams = {
  providerId: ChannelId;
  providerSetting?: NativeCommandsSetting;
  globalSetting?: NativeCommandsSetting;
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  workspaceDir?: string;
  config?: OpenClawConfig;
  autoDefault?: boolean;
};
/** Resolves native skill exposure for a provider, with provider config overriding global config. */
export declare function resolveNativeSkillsEnabled(params: NativeCommandSettingParams): boolean;
/** Resolves native command exposure for a provider, with provider config overriding global config. */
export declare function resolveNativeCommandsEnabled(params: NativeCommandSettingParams): boolean;
/** Returns true only when native commands are explicitly disabled by provider or inherited global config. */
export declare function isNativeCommandsExplicitlyDisabled(params: {
  providerSetting?: NativeCommandsSetting;
  globalSetting?: NativeCommandsSetting;
}): boolean;
//#endregion