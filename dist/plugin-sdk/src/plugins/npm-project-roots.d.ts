/** Lists project-level npm roots managed below the plugin npm root. */
export declare function listManagedPluginNpmProjectRootsSync(npmRoot: string): string[];
/** Async variant of project-level managed npm root discovery. */
export declare function listManagedPluginNpmProjectRoots(npmRoot: string): Promise<string[]>;
/** Returns the root npm install plus all managed project npm roots. */
export declare function listManagedPluginNpmRootsSync(npmRoot: string): string[];
/** Async variant of managed npm root discovery. */
export declare function listManagedPluginNpmRoots(npmRoot: string): Promise<string[]>;
