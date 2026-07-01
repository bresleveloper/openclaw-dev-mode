import "./fs-safe-defaults.js";
export declare function saveJsonFile(pathname: string, data: unknown): void;
export declare function loadJsonFile<T = unknown>(pathname: string): T | undefined;
