import { loadGlobalRuntimeDotEnvFiles } from "./dotenv-global.js";
export declare function loadWorkspaceDotEnvFile(filePath: string, opts?: {
    quiet?: boolean;
}): void;
export { loadGlobalRuntimeDotEnvFiles };
export declare function loadDotEnv(opts?: {
    quiet?: boolean;
}): void;
