import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ProviderModelPickerEntry } from "../plugins/provider-wizard.js";
import type { FlowContribution } from "./types.js";
type ProviderModelPickerFlowEntry = ProviderModelPickerEntry;
type ProviderModelPickerFlowContribution = FlowContribution & {
    kind: "provider";
    surface: "model-picker";
    providerId: string;
    option: ProviderModelPickerFlowEntry;
    source: "runtime";
};
/** Resolves provider model-picker options without exposing contribution metadata. */
export declare function resolveProviderModelPickerFlowEntries(params?: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): ProviderModelPickerFlowEntry[];
/** Resolves provider model-picker contributions with docs metadata for setup UIs. */
export declare function resolveProviderModelPickerFlowContributions(params?: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): ProviderModelPickerFlowContribution[];
export {};
