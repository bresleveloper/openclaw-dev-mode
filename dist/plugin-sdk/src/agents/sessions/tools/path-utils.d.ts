/**
 * Resolve a path relative to the given cwd.
 * Handles ~ expansion and absolute paths.
 */
export declare function resolveToCwd(filePath: string, cwd: string): string;
export declare function resolveReadPath(filePath: string, cwd: string): string;
