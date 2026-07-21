import { l as ImageGenerationProvider } from "../../types-DTbLcOj0.js";
import { a as fetchWithSsrFGuard } from "../../fetch-guard-BKvfwdRa.js";
//#region extensions/fal/image-generation-provider.d.ts
declare function setFalFetchGuardForTesting(impl: typeof fetchWithSsrFGuard | null): void;
declare function buildFalImageGenerationProvider(): ImageGenerationProvider;
//#endregion
export { buildFalImageGenerationProvider, setFalFetchGuardForTesting };