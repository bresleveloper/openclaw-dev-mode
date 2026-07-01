import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Return whether config can load any internal hooks, including legacy handlers. */
export declare function hasConfiguredInternalHooks(config: OpenClawConfig): boolean;
/** Resolve explicitly configured internal hook names; null means all/discovered hooks may load. */
export declare function resolveConfiguredInternalHookNames(config: OpenClawConfig): Set<string> | null;
