type PathNode = Record<string, unknown>;
/** Parses CLI/config dot-notation paths and rejects unsafe object-key segments. */
export declare function parseConfigPath(raw: string): {
    ok: boolean;
    path?: string[];
    error?: string;
};
/** Sets a value at a validated config path, creating missing plain-object parents. */
export declare function setConfigValueAtPath(root: PathNode, path: string[], value: unknown): void;
/** Removes a value at a config path and prunes empty parent objects created by setters. */
export declare function unsetConfigValueAtPath(root: PathNode, path: string[]): boolean;
/** Reads a value from a config path, stopping at the first non-plain-object parent. */
export declare function getConfigValueAtPath(root: PathNode, path: string[]): unknown;
export {};
