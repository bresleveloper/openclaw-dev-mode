import type { ChannelId } from "../channels/plugins/types.public.js";
import type { NativeCommandsSetting } from "./types.js";
import type { OpenClawConfig } from "./types.openclaw.js";
export { isCommandFlagEnabled, isRestartEnabled } from "./commands.flags.js";
/** Resolves native skill exposure for a provider, with provider config overriding global config. */
export declare function resolveNativeSkillsEnabled(params: {
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
export declare function resolveNativeCommandsEnabled(params: {
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
export declare function isNativeCommandsExplicitlyDisabled(params: {
    providerSetting?: NativeCommandsSetting;
    globalSetting?: NativeCommandsSetting;
}): boolean;
