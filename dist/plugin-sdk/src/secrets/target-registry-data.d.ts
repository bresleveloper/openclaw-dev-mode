import type { SecretTargetRegistryEntry } from "./target-registry-types.js";
/** Returns only core-owned secret target registry entries. */
/** Returns static core secret target registry entries without plugin-derived targets. */
export declare function getCoreSecretTargetRegistry(): SecretTargetRegistryEntry[];
/** Returns the process-cached registry including bundled plugin/channel metadata. */
/** Returns core plus plugin/channel secret target registry entries for the current metadata view. */
export declare function getSecretTargetRegistry(): SecretTargetRegistryEntry[];
/** Returns an uncached source-tree registry for docs/snapshot generation. */
export declare function getSourceSecretTargetRegistry(): SecretTargetRegistryEntry[];
