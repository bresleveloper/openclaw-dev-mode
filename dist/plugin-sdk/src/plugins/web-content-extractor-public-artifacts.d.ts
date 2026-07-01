import type { PluginWebContentExtractorEntry } from "./web-content-extractor-types.js";
/** Loads bundled web content extractor entries from public plugin artifacts. */
export declare function loadBundledWebContentExtractorEntriesFromDir(params: {
    dirName: string;
    pluginId: string;
}): PluginWebContentExtractorEntry[] | null;
