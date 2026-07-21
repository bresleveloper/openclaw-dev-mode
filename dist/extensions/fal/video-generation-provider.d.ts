import { a as fetchWithSsrFGuard } from "../../fetch-guard-BKvfwdRa.js";
import { o as VideoGenerationProvider } from "../../video-generation-DWgK4UE2.js";
//#region extensions/fal/video-generation-provider.d.ts
declare function setFalVideoFetchGuardForTesting(impl: typeof fetchWithSsrFGuard | null): void;
declare function buildFalVideoGenerationProvider(): VideoGenerationProvider;
//#endregion
export { buildFalVideoGenerationProvider, setFalVideoFetchGuardForTesting };