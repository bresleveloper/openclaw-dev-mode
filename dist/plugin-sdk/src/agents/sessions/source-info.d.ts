/**
 * Source metadata helpers for session resources.
 *
 * Tracks where prompts, skills, and extension-provided assets came from for diagnostics and UI.
 */
import type { PathMetadata } from "./package-manager.js";
export type SourceScope = "user" | "project" | "temporary";
export type SourceOrigin = "package" | "top-level";
export interface SourceInfo {
    path: string;
    source: string;
    scope: SourceScope;
    origin: SourceOrigin;
    baseDir?: string;
}
/** Converts package-manager path metadata into the session source-info shape. */
export declare function createSourceInfo(path: string, metadata: PathMetadata): SourceInfo;
/** Builds source metadata for generated or synthetic session entries. */
export declare function createSyntheticSourceInfo(path: string, options: {
    source: string;
    scope?: SourceScope;
    origin?: SourceOrigin;
    baseDir?: string;
}): SourceInfo;
