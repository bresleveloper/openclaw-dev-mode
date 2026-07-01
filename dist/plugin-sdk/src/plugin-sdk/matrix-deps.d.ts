import type { RuntimeEnv } from "../runtime.js";
type FacadeModule = {
    ensureMatrixSdkInstalled: (params: {
        runtime: RuntimeEnv;
        confirm?: (message: string) => Promise<boolean>;
    }) => Promise<void>;
    isMatrixSdkAvailable: () => boolean;
};
/** Ensure Matrix plugin runtime dependencies are available before Matrix setup/use. */
export declare const ensureMatrixSdkInstalled: FacadeModule["ensureMatrixSdkInstalled"];
/** Returns whether Matrix SDK dependencies are currently importable. */
export declare const isMatrixSdkAvailable: FacadeModule["isMatrixSdkAvailable"];
export {};
