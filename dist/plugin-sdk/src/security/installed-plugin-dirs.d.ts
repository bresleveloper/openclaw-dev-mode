/**
 * Decide whether an installed-plugin directory should be skipped by security audits.
 * This filters generated install debris while keeping real plugin roots visible to scans.
 */
export declare function shouldIgnoreInstalledPluginDirName(name: string): boolean;
