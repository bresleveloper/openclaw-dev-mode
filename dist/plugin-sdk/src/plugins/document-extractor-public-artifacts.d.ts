import type { PluginDocumentExtractorEntry } from "./document-extractor-types.js";
/** Loads document extractor entries from a bundled plugin public artifact module. */
export declare function loadBundledDocumentExtractorEntriesFromDir(params: {
    dirName: string;
    pluginId: string;
}): PluginDocumentExtractorEntry[] | null;
