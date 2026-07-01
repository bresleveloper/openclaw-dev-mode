/** True when a package entrypoint needs built JavaScript candidates. */
export declare function isTypeScriptPackageEntry(entryPath: string): boolean;
/** Lists built runtime entry candidates for a TypeScript package entrypoint. */
export declare function listBuiltRuntimeEntryCandidates(entryPath: string): string[];
