import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { DoctorPrompter } from "./doctor-prompter.js";
export declare const MEMORY_SYSTEM_PROMPT: string;
/** Returns true when the workspace appears to lack canonical memory guidance. */
export declare function shouldSuggestMemorySystem(workspaceDir: string): Promise<boolean>;
export type RootMemoryFilesDetection = {
    workspaceDir: string;
    canonicalPath: string;
    legacyPath: string;
    canonicalExists: boolean;
    legacyExists: boolean;
    canonicalBytes?: number;
    legacyBytes?: number;
};
/** Detects canonical and legacy root memory files in a workspace. */
export declare function detectRootMemoryFiles(workspaceDir: string): Promise<RootMemoryFilesDetection>;
/** Formats the warning for split canonical/legacy root memory files. */
export declare function formatRootMemoryFilesWarning(detection: RootMemoryFilesDetection): string | null;
export type RootMemoryMigrationResult = {
    changed: boolean;
    canonicalPath: string;
    legacyPath: string;
    removedLegacy: boolean;
    mergedLegacy: boolean;
    archivedLegacyPath?: string;
    copiedBytes?: number;
};
/** Archives and merges a legacy root memory file into canonical memory. */
export declare function migrateLegacyRootMemoryFile(workspaceDir: string): Promise<RootMemoryMigrationResult>;
/** Emits workspace root-memory health warnings. */
export declare function noteWorkspaceMemoryHealth(cfg: OpenClawConfig): Promise<void>;
/** Prompts to merge legacy root memory into canonical memory when both files exist. */
export declare function maybeRepairWorkspaceMemoryHealth(params: {
    cfg: OpenClawConfig;
    prompter: DoctorPrompter;
}): Promise<void>;
