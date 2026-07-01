/**
 * Global Plugin Hook Runner
 *
 * Singleton hook runner that's initialized when plugins are loaded
 * and can be called from anywhere in the codebase.
 *
 * The runner is created once and resolves hooks live on every dispatch from a
 * composed view of the registries that are currently live: the most recently
 * initialized registry, the active registry, and the pinned channel/http-route
 * surfaces. Freezing one registry caused scoped mid-run activations (harness
 * and memory ensures) to rebind the runner to a narrow registry and silently
 * drop other plugins' tool-call hooks (#91918). Composing live also preserves
 * the older contract that hooks pushed into a registry after initialization
 * (e.g. the SDK `addTestHook` helper) dispatch immediately.
 */
import type { GlobalHookRunnerRegistry } from "./hook-registry.types.js";
import type { PluginHookGatewayContext, PluginHookGatewayStopEvent } from "./hook-types.js";
import { type HookRunner } from "./hooks.js";
/**
 * Initialize the global hook runner with a plugin registry.
 * Called on every plugin registry activation and by SDK consumers. The runner
 * instance stays stable so references captured mid-run keep seeing current
 * hooks; the passed registry becomes the highest-precedence composition source.
 */
export declare function initializeGlobalHookRunner(registry: GlobalHookRunnerRegistry): void;
/**
 * Get the global hook runner.
 * Returns null if plugins haven't been loaded yet.
 */
export declare function getGlobalHookRunner(): HookRunner | null;
/**
 * Get the registry from the most recent activation or explicit initialization.
 * Returns null if plugins haven't been loaded yet. Hook dispatch does not use
 * this single registry; the runner resolves hooks from the live composed view.
 */
export declare function getGlobalPluginRegistry(): GlobalHookRunnerRegistry | null;
/**
 * Check if any hooks are registered for a given hook name.
 */
export declare function hasGlobalHooks(hookName: Parameters<HookRunner["hasHooks"]>[0]): boolean;
export declare function runGlobalGatewayStopSafely(params: {
    event: PluginHookGatewayStopEvent;
    ctx: PluginHookGatewayContext;
    onError?: (err: unknown) => void;
}): Promise<void>;
/**
 * Reset the global hook runner (for testing).
 */
export declare function resetGlobalHookRunner(): void;
