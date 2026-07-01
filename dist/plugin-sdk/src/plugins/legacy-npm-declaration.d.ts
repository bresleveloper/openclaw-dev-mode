/** Legacy declaration filename used by early npm-backed plugin installs. */
export declare const LEGACY_NPM_DECLARATION_FILE = "openclaw.extension.json";
/** Parsed legacy npm declaration stored beside an installed plugin. */
export type LegacyNpmPluginDeclaration = {
    pluginId: string;
    npmSpec: string;
    source: string;
};
/** Reads a legacy npm plugin declaration when a plugin directory still has one. */
export declare function readLegacyNpmPluginDeclaration(pluginDir: string): LegacyNpmPluginDeclaration | null;
