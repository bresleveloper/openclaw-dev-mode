import type { OpenClawConfig } from "../../../config/types.js";
/** Apply legacy migrations and validate the resulting OpenClaw config shape when possible. */
export declare function migrateLegacyConfig(raw: unknown): {
    config: OpenClawConfig | null;
    changes: string[];
    partiallyValid?: boolean;
};
