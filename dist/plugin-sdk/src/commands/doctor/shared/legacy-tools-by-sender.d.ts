import type { OpenClawConfig } from "../../../config/types.openclaw.js";
export type LegacyToolsBySenderKeyHit = {
    /** Path parts pointing to the containing toolsBySender object. */
    toolsBySenderPath: Array<string | number>;
    /** Formatted config path for user-facing warnings. */
    pathLabel: string;
    /** Original untyped sender key. */
    key: string;
    /** Typed replacement key using the id: namespace. */
    targetKey: string;
};
/** Find untyped toolsBySender keys that should be migrated to explicit id: keys. */
export declare function scanLegacyToolsBySenderKeys(cfg: OpenClawConfig): LegacyToolsBySenderKeyHit[];
/** Format doctor warnings for legacy untyped toolsBySender keys. */
export declare function collectLegacyToolsBySenderWarnings(params: {
    hits: LegacyToolsBySenderKeyHit[];
    doctorFixCommand: string;
}): string[];
/** Migrate untyped toolsBySender keys to typed id: keys where possible. */
export declare function maybeRepairLegacyToolsBySenderKeys(cfg: OpenClawConfig): {
    config: OpenClawConfig;
    changes: string[];
};
