import ignore from "ignore";
export type IgnoreMatcher = ReturnType<typeof ignore>;
export declare function toPosixPath(pathValue: string): string;
/** Adds nested ignore-file rules to a matcher using paths relative to the scan root. */
export declare function addIgnoreRules(ig: IgnoreMatcher, dir: string, rootDir: string): void;
