type PluginManifestMetadataRecord = {
    pluginDir: string;
    manifest: Record<string, unknown>;
    origin?: string;
};
/** Lists plugin manifest metadata from installed, bundled, and global plugin roots. */
export declare function listOpenClawPluginManifestMetadata(env?: NodeJS.ProcessEnv): PluginManifestMetadataRecord[];
export {};
