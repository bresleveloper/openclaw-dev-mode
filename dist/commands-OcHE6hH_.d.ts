import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { R as NativeCommandsSetting } from "./types.slack-Bjt70WfQ.js";
import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
//#region src/config/commands.d.ts
/** Resolves native skill exposure for a provider, with provider config overriding global config. */
declare function resolveNativeSkillsEnabled(params: {
  providerId: ChannelId;
  providerSetting?: NativeCommandsSetting;
  globalSetting?: NativeCommandsSetting;
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  workspaceDir?: string;
  config?: OpenClawConfig;
  autoDefault?: boolean;
}): boolean;
/** Resolves native command exposure for a provider, with provider config overriding global config. */
declare function resolveNativeCommandsEnabled(params: {
  providerId: ChannelId;
  providerSetting?: NativeCommandsSetting;
  globalSetting?: NativeCommandsSetting;
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  workspaceDir?: string;
  config?: OpenClawConfig;
  autoDefault?: boolean;
}): boolean;
/** Returns true only when native commands are explicitly disabled by provider or inherited global config. */
declare function isNativeCommandsExplicitlyDisabled(params: {
  providerSetting?: NativeCommandsSetting;
  globalSetting?: NativeCommandsSetting;
}): boolean;
//#endregion
export { resolveNativeCommandsEnabled as n, resolveNativeSkillsEnabled as r, isNativeCommandsExplicitlyDisabled as t };