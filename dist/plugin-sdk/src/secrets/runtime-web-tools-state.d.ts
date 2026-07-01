/** Stores active web-tool metadata for the secrets runtime snapshot. */
import type { RuntimeWebToolsMetadata } from "./runtime-web-tools.types.js";
/**
 * Clears active web-tool metadata when the secrets runtime snapshot is reset.
 */
export declare function clearActiveRuntimeWebToolsMetadata(): void;
/**
 * Stores web-tool metadata with clone isolation from caller-owned objects.
 */
export declare function setActiveRuntimeWebToolsMetadata(metadata: RuntimeWebToolsMetadata): void;
/**
 * Returns active web-tool metadata without exposing mutable runtime state.
 */
export declare function getActiveRuntimeWebToolsMetadata(): RuntimeWebToolsMetadata | null;
