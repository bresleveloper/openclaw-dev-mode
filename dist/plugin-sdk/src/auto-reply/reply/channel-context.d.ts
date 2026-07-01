import type { OpenClawConfig } from "../../config/types.openclaw.js";
type CommandSurfaceParams = {
    ctx: {
        OriginatingChannel?: string;
        Surface?: string;
        Provider?: string;
        AccountId?: string;
    };
    command: {
        channel?: string;
    };
};
type ChannelAccountParams = {
    cfg: OpenClawConfig;
    ctx: {
        OriginatingChannel?: string;
        Surface?: string;
        Provider?: string;
        AccountId?: string;
    };
    command: {
        channel?: string;
    };
};
/** Resolves the command surface channel from inbound context and command state. */
export declare function resolveCommandSurfaceChannel(params: CommandSurfaceParams): string;
/** Resolves command account id, falling back to plugin default account config. */
export declare function resolveChannelAccountId(params: ChannelAccountParams): string;
export {};
