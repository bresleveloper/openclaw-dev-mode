type BrewResolutionOptions = {
    homeDir?: string;
    /**
     * @deprecated No-op compatibility field for plugin SDK callers. Homebrew
     * env vars are ignored for resolution because workspace env can be untrusted.
     */
    env?: NodeJS.ProcessEnv;
};
/** Returns standard Homebrew bin directories suitable for PATH augmentation. */
export declare function resolveBrewPathDirs(opts?: BrewResolutionOptions): string[];
/** Resolves an executable `brew` path from trusted PATH entries or standard install roots. */
export declare function resolveBrewExecutable(opts?: BrewResolutionOptions): string | undefined;
export {};
