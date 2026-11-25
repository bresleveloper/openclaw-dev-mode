import { $O as loadConfig } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
/** @deprecated Use readRuntimeConfig after awaiting captureRuntimeConfigAsyncReader()(). Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function getRuntimeConfig(options?: Parameters<typeof loadConfig>[0]): OpenClawConfig;
export { getRuntimeConfig as t };