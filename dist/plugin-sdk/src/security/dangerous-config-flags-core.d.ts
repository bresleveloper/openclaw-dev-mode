import type { OpenClawConfig } from "../config/types.openclaw.js";
type DangerousFlagValue = string | number | boolean | null;
type DangerousFlagContract = {
    path: string;
    equals: DangerousFlagValue;
};
type PluginConfigContractMetadata = {
    configContracts: {
        dangerousFlags?: DangerousFlagContract[];
    };
};
type PluginConfigContractMatch = {
    path: string;
    value: unknown;
};
type CollectPluginConfigContractMatches = (input: {
    pathPattern: string;
    root: Record<string, unknown>;
}) => Iterable<PluginConfigContractMatch>;
/**
 * Plugin config contract data used to extend core dangerous-flag detection.
 * Tests and snapshot callers can inject prepared contracts to avoid manifest discovery.
 */
export type DangerousConfigFlagContractInputs = {
    configContractsById?: ReadonlyMap<string, PluginConfigContractMetadata>;
    collectPluginConfigContractMatches?: CollectPluginConfigContractMatches;
};
/**
 * Return every enabled dangerous flag from core config plus plugin config contracts.
 * The returned strings are stable audit/report labels, not user-edited config paths.
 */
export declare function collectEnabledInsecureOrDangerousFlagsFromContracts(cfg: OpenClawConfig, inputs?: DangerousConfigFlagContractInputs): string[];
export {};
