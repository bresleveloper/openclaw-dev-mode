import type { PluginDiagnostic } from "./manifest-types.js";
/** File metadata signature used to skip unchanged installed plugin files. */
export type InstalledPluginFileSignature = {
    size: number;
    mtimeMs: number;
    ctimeMs?: number;
};
/** Hashes JSON-serializable data with SHA-256. */
export declare function hashJson(value: unknown): string;
/** Safely hashes a file, optionally recording required-file diagnostics. */
export declare function safeHashFile(params: {
    filePath: string;
    pluginId?: string;
    diagnostics: PluginDiagnostic[];
    required: boolean;
}): string | undefined;
/** Reads a safe file signature for installed plugin index freshness checks. */
export declare function safeFileSignature(filePath: string): InstalledPluginFileSignature | undefined;
/** Compares current file metadata with a stored installed-plugin file signature. */
export declare function fileSignatureMatches(filePath: string, signature: InstalledPluginFileSignature | undefined): boolean | undefined;
