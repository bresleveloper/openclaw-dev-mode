import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Returns the plugin API id that owns a provider config when it is not core built-in. */
export declare function resolveProviderConfigApiOwnerHint(params: {
    provider: string;
    config?: OpenClawConfig;
}): string | undefined;
