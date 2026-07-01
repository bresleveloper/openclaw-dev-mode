import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginInstallRecord } from "../config/types.plugins.js";
import { type NpmSpecResolution } from "../infra/install-source-utils.js";
/** Plugin install record update with the target plugin id attached. */
export type PluginInstallUpdate = PluginInstallRecord & {
    pluginId: string;
};
/** Builds install record fields from resolved npm package metadata. */
export declare function buildNpmResolutionInstallFields(resolution?: NpmSpecResolution): Pick<PluginInstallRecord, "resolvedName" | "resolvedVersion" | "resolvedSpec" | "integrity" | "shasum" | "resolvedAt">;
export declare function resolveNpmInstallRecordSpec(params: {
    requestedSpec?: string;
    resolution?: NpmSpecResolution;
    pinResolvedRegistrySpec?: boolean;
}): string | undefined;
/** Records or updates a plugin install record in OpenClaw config. */
export declare function recordPluginInstall(cfg: OpenClawConfig, update: PluginInstallUpdate): OpenClawConfig;
