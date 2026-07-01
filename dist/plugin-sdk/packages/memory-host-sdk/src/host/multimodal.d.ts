declare const MEMORY_MULTIMODAL_SPECS: {
    readonly image: {
        readonly labelPrefix: "Image file";
        readonly extensions: readonly [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"];
    };
    readonly audio: {
        readonly labelPrefix: "Audio file";
        readonly extensions: readonly [".mp3", ".wav", ".ogg", ".opus", ".m4a", ".aac", ".flac"];
    };
};
/** Supported multimodal memory modality. */
export type MemoryMultimodalModality = keyof typeof MEMORY_MULTIMODAL_SPECS;
/** All supported multimodal memory modalities in stable config order. */
export declare const MEMORY_MULTIMODAL_MODALITIES: MemoryMultimodalModality[];
/** User selection for one modality or all modalities. */
export type MemoryMultimodalSelection = MemoryMultimodalModality | "all";
/** Normalized multimodal memory ingestion settings. */
export type MemoryMultimodalSettings = {
    enabled: boolean;
    modalities: MemoryMultimodalModality[];
    maxFileBytes: number;
};
/** Default max bytes for one multimodal memory file. */
export declare const DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES: number;
/** Normalize user modality selections to supported modalities. */
export declare function normalizeMemoryMultimodalModalities(raw: MemoryMultimodalSelection[] | undefined): MemoryMultimodalModality[];
/** Normalize user multimodal settings, including disabled-state empty modality list. */
export declare function normalizeMemoryMultimodalSettings(raw: {
    enabled?: boolean;
    modalities?: MemoryMultimodalSelection[];
    maxFileBytes?: number;
}): MemoryMultimodalSettings;
/** Return true when multimodal memory ingestion has at least one enabled modality. */
export declare function isMemoryMultimodalEnabled(settings: MemoryMultimodalSettings): boolean;
/** Return accepted file extensions for a modality. */
export declare function getMemoryMultimodalExtensions(modality: MemoryMultimodalModality): readonly string[];
/** Build the text label that accompanies embedded multimodal file content. */
export declare function buildMemoryMultimodalLabel(modality: MemoryMultimodalModality, normalizedPath: string): string;
/** Build a glob that matches an extension case-insensitively for QMD sources. */
export declare function buildCaseInsensitiveExtensionGlob(extension: string): string;
/** Classify a file path into a supported multimodal modality under current settings. */
export declare function classifyMemoryMultimodalPath(filePath: string, settings: MemoryMultimodalSettings): MemoryMultimodalModality | null;
export {};
