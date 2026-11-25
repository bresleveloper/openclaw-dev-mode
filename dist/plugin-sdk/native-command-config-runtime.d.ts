import "../config-contracts-hzlacViZ.js";
import { Cn as NativeCommandsSetting, r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import "../types-ACDCRjU-.js";
import { m as ChannelId } from "../manifest-registry-CNNq5Vj2.js";
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
export {};