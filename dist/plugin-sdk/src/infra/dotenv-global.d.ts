type DotEnvEntry = {
    key: string;
    value: string;
};
type LoadedDotEnvFile = {
    filePath: string;
    entries: DotEnvEntry[];
};
type GlobalRuntimeDotEnvOptions = {
    additionalEnvPaths?: string[];
    entryFilter?: (key: string, value: string) => boolean;
    quiet?: boolean;
    stateEnvPath?: string;
};
export declare function readDotEnvFile(params: {
    entryFilter?: (key: string, value: string) => boolean;
    filePath: string;
    quiet?: boolean;
}): LoadedDotEnvFile | null;
/** Load global runtime dotenv files into `process.env` with first-wins precedence. */
export declare function loadGlobalRuntimeDotEnvFiles(opts?: GlobalRuntimeDotEnvOptions): {
    stateEnvAppliedKeys: string[];
    gatewayEnvAppliedKeys: string[];
};
export {};
