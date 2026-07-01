import { clearPluginCommands, clearPluginCommandsForPlugin, type RegisteredPluginCommand } from "./command-registry-state.js";
import { type OpenClawPluginCommandDefinition } from "./types.js";
/** Result returned when a plugin command registration succeeds or fails validation. */
export type CommandRegistrationResult = {
    ok: boolean;
    error?: string;
};
/** Returns true when a command name is owned by built-in OpenClaw command handling. */
export declare function isReservedCommandName(name: string): boolean;
/** Validates user-visible command names before plugin registration accepts them. */
export declare function validateCommandName(name: string, opts?: {
    allowReservedCommandNames?: boolean;
}): string | null;
/**
 * Validate a plugin command definition without registering it.
 * Returns an error message if invalid, or null if valid.
 * Shared by both the global registration path and snapshot (non-activating) loads.
 */
export declare function validatePluginCommandDefinition(command: OpenClawPluginCommandDefinition, opts?: {
    allowReservedCommandNames?: boolean;
}): string | null;
export declare function listPluginInvocationKeys(command: OpenClawPluginCommandDefinition): string[];
export declare function pluginCommandSupportsChannel(command: OpenClawPluginCommandDefinition, channel?: string): boolean;
export declare function registerPluginCommand(pluginId: string, command: OpenClawPluginCommandDefinition, opts?: {
    pluginName?: string;
    pluginRoot?: string;
    allowReservedCommandNames?: boolean;
    allowOwnerStatusExposure?: boolean;
}): CommandRegistrationResult;
export { clearPluginCommands, clearPluginCommandsForPlugin };
export type { RegisteredPluginCommand };
