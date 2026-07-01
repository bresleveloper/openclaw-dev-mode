import { type ConfigSchemaResponse } from "./schema.js";
/** Builds the config schema from the active runtime config and plugin metadata. */
export declare function loadGatewayRuntimeConfigSchema(): ConfigSchemaResponse;
export declare function readBestEffortRuntimeConfigSchema(): Promise<ConfigSchemaResponse>;
