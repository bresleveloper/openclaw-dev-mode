/**
 * Shared test helpers for browser facade delegation tests.
 */
import { vi } from "vitest";
type FacadeLoaderMock = ReturnType<typeof vi.fn>;
type ChromeExecutableFixture = {
    kind: string;
    path: string;
};
/** Installs a mocked browser host inspection public surface. */
export declare function mockBrowserHostInspectionFacade(loadBundledPluginPublicSurfaceModuleSync: FacadeLoaderMock, executable: ChromeExecutableFixture): void;
/** Asserts browser host inspection calls delegate through the browser public facade. */
export declare function expectBrowserHostInspectionDelegation(params: {
    executable: ChromeExecutableFixture;
    hostInspection: typeof import("./browser-host-inspection.js");
    loadBundledPluginPublicSurfaceModuleSync: FacadeLoaderMock;
}): void;
/** Asserts host inspection helpers surface facade load failures to callers. */
export declare function expectBrowserHostInspectionFacadeUnavailable(loadBundledPluginPublicSurfaceModuleSync: FacadeLoaderMock): Promise<void>;
export {};
