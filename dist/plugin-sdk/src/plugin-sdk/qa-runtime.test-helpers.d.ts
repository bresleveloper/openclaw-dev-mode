import { vi } from "vitest";
type QaRuntimeModule = {
    loadQaRuntimeModule: () => unknown;
};
type SurfaceLoaderMock = ReturnType<typeof vi.fn>;
/** Removes temporary source roots created by QA runtime tests. */
export declare function cleanupTempDirs(tempDirs: string[]): void;
/** Restores the private QA CLI env flag after a test mutates it. */
export declare function restorePrivateQaCliEnv(originalPrivateQaCli: string | undefined): void;
/** Creates a minimal source checkout shape that enables private QA runtime loading. */
export declare function makePrivateQaSourceRoot(tempDirs: string[], prefix: string): string;
/** Asserts that the public QA Lab runtime facade loads from the bundled plugin surface. */
export declare function expectQaLabRuntimeSurfaceLoad(params: {
    importRuntime: () => Promise<QaRuntimeModule>;
    loadBundledPluginPublicSurfaceModuleSync: SurfaceLoaderMock;
}): Promise<void>;
/** Asserts private QA loading rewrites bundled plugin lookup to the source extensions root. */
export declare function expectPrivateQaLabRuntimeSurfaceLoad(params: {
    tempDirs: string[];
    importRuntime: () => Promise<QaRuntimeModule>;
    loadBundledPluginPublicSurfaceModuleSync: SurfaceLoaderMock;
    resolveOpenClawPackageRootSync: SurfaceLoaderMock;
}): Promise<void>;
export {};
