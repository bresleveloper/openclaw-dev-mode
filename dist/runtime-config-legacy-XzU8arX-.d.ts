import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import "./config-contracts-CY87ANNp.js";
import { o as loadConfig } from "./config-S5Zm-Svf.js";
//#region src/plugin-sdk/runtime-config-legacy.d.ts
/** @deprecated Use readRuntimeConfig after awaiting captureRuntimeConfigAsyncReader()(). Final compatibility day: 2026-12-31. */
declare function getRuntimeConfig(options?: Parameters<typeof loadConfig>[0]): OpenClawConfig;
//#endregion
export { getRuntimeConfig as t };