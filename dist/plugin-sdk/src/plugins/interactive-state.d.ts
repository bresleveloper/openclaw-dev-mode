import type { PluginInteractiveHandlerRegistration } from "./types.js";
/** Registered interactive handler with owning plugin metadata. */
export type RegisteredInteractiveHandler = PluginInteractiveHandlerRegistration & {
    pluginId: string;
    pluginName?: string;
    pluginRoot?: string;
};
/** Returns the process-global plugin interactive handler registry. */
export declare function getPluginInteractiveHandlersState(): Map<string, RegisteredInteractiveHandler>;
/** Claims an interactive callback dedupe key while the callback is in flight. */
export declare function claimPluginInteractiveCallbackDedupe(dedupeKey: string | undefined, now?: number): boolean;
/** Commits an interactive callback dedupe key after successful handling. */
export declare function commitPluginInteractiveCallbackDedupe(dedupeKey: string | undefined, now?: number): void;
/** Releases an in-flight interactive callback dedupe claim without committing it. */
export declare function releasePluginInteractiveCallbackDedupe(dedupeKey: string | undefined): void;
/** Clears plugin interactive handlers and callback dedupe state. */
export declare function clearPluginInteractiveHandlersState(): void;
/** Clears only plugin interactive handler registrations. */
export declare function clearPluginInteractiveHandlerRegistrationsState(): void;
