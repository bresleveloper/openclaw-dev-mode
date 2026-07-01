import { a as fetchWithSsrFGuard } from "../../fetch-guard-BKvfwdRa.js";
import { o as VideoGenerationProvider } from "../../video-generation-DLchKlHz.js";
//#region extensions/fal/video-generation-provider.d.ts
declare function setFalVideoFetchGuardForTesting(impl: typeof fetchWithSsrFGuard | null): void;
declare function buildFalVideoGenerationProvider(): VideoGenerationProvider;
//#endregion
export { buildFalVideoGenerationProvider, setFalVideoFetchGuardForTesting };