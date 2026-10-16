import { Qt as NativeCommandsSetting, r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import "../types-C-BtfS0H.js";
import { t as ChannelId } from "../channel-id.types-CM2F8b5e.js";
import "../types.public-DpLTXZT0.js";
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