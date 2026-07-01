import type { OpenClawPluginApi } from "./plugin-runtime.js";
/** Partial plugin API overrides accepted by the SDK test helper. */
export type TestPluginApiInput = Partial<OpenClawPluginApi>;
/** Create a minimal plugin API object for plugin-sdk contract and unit tests. */
export declare function createTestPluginApi(api?: TestPluginApiInput): OpenClawPluginApi;
