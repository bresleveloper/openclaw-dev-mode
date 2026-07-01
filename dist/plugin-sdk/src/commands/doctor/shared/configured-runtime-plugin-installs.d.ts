import { type ConfiguredAgentHarnessRuntimeOptions } from "../../../agents/harness-runtimes.js";
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { PluginPackageInstall } from "../../../plugins/manifest.js";
type ConfiguredRuntimePluginInstallCandidate = {
    /** Runtime/plugin id used in config and plugin installation records. */
    pluginId: string;
    /** Human-readable plugin label for prompts and notes. */
    label: string;
    /** npm package spec for an official runtime plugin install. */
    npmSpec?: string;
    /** ClawHub install spec when the runtime plugin is sourced from ClawHub. */
    clawhubSpec?: string;
    /** True when the install source is trusted to link official runtime support. */
    trustedSourceLinkedOfficialInstall?: boolean;
    /** Default installer choice when multiple official sources are available. */
    defaultChoice?: PluginPackageInstall["defaultChoice"];
};
export declare const CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES: readonly ConfiguredRuntimePluginInstallCandidate[];
/** Resolve the official install candidate for a configured runtime id. */
export declare function resolveConfiguredRuntimePluginInstallCandidate(runtimeId: string): ConfiguredRuntimePluginInstallCandidate | undefined;
/** Collect runtime plugin ids implied by configured harness runtimes and ACPX settings. */
export declare function collectConfiguredRuntimePluginIds(cfg: OpenClawConfig, options?: ConfiguredAgentHarnessRuntimeOptions): string[];
export {};
