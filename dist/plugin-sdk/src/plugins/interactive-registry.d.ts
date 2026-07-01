import { type RegisteredInteractiveHandler } from "./interactive-state.js";
import type { PluginInteractiveHandlerRegistration } from "./types.js";
/** Registration result for plugin interactive namespace handlers. */
export type InteractiveRegistrationResult = {
    ok: boolean;
    error?: string;
};
/** Resolves a channel payload to a registered plugin interactive namespace handler. */
export declare function resolvePluginInteractiveNamespaceMatch(channel: string, data: string): {
    registration: RegisteredInteractiveHandler;
    namespace: string;
    payload: string;
} | null;
/** Registers one plugin interactive namespace for a channel. */
export declare function registerPluginInteractiveHandler(pluginId: string, registration: PluginInteractiveHandlerRegistration, opts?: {
    pluginName?: string;
    pluginRoot?: string;
}): InteractiveRegistrationResult;
/** Clears all active plugin interactive handlers. */
export declare function clearPluginInteractiveHandlers(): void;
/** Clears stored plugin interactive handler registrations. */
export declare function clearPluginInteractiveHandlerRegistrations(): void;
/** Clears active interactive handlers owned by one plugin. */
export declare function clearPluginInteractiveHandlersForPlugin(pluginId: string): void;
/** Lists active plugin interactive handlers. */
export declare function listPluginInteractiveHandlers(): RegisteredInteractiveHandler[];
/** Restores active plugin interactive handlers from a saved registry snapshot. */
export declare function restorePluginInteractiveHandlers(registrations: readonly RegisteredInteractiveHandler[]): void;
