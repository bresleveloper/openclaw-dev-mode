export type LegacyDebugProxyCaptureDetection = {
    sourcePath: string;
    blobDir: string;
    hasLegacy: boolean;
};
export declare function detectLegacyDebugProxyCaptureSidecar(stateDir: string, env?: NodeJS.ProcessEnv): LegacyDebugProxyCaptureDetection;
export declare function migrateLegacyDebugProxyCaptureSidecar(params: {
    stateDir: string;
    detected?: LegacyDebugProxyCaptureDetection;
}): {
    changes: string[];
    warnings: string[];
};
