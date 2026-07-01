import type { ActivePluginChannelRegistration } from "../plugins/channel-registry-state.types.js";
type RegisteredChannelPluginEntry = ActivePluginChannelRegistration & {
    plugin: ActivePluginChannelRegistration["plugin"] & {
        id?: string | null;
        meta?: {
            aliases?: readonly string[];
            markdownCapable?: boolean;
        } | null;
    };
};
/** Lists active channel plugin registrations from the current registry snapshot. */
export declare function listRegisteredChannelPluginEntries(): RegisteredChannelPluginEntry[];
/** Finds an active channel plugin registration by normalized id or alias. */
export declare function findRegisteredChannelPluginEntry(normalizedKey: string): RegisteredChannelPluginEntry | undefined;
/** Finds an active channel plugin registration by its canonical plugin id. */
export declare function findRegisteredChannelPluginEntryById(id: string): RegisteredChannelPluginEntry | undefined;
export {};
