import type { OpenClawConfig } from "../../config/types.openclaw.js";
export declare class AutoReplyConfigMutationError extends Error {
}
/** Extracts user-facing mutation error text from config command failures. */
export declare function formatAutoReplyConfigMutationError(error: unknown): string | null;
/** Removes a config path and returns whether anything changed. */
export declare function unsetConfigPath(path: string[]): Promise<boolean>;
/** Sets and validates a config path in the source config file. */
export declare function setConfigPath(path: string[], value: unknown): Promise<void>;
/** Toggles plugin enablement from a chat command and returns the committed config. */
export declare function setPluginEnabledFromCommand(params: {
    pluginId: string;
    enabled: boolean;
    action: "enable" | "disable";
}): Promise<OpenClawConfig>;
type AllowlistConfigEditResult = {
    kind?: "ok" | "invalid-entry";
    changed?: boolean;
} | null | undefined;
type MaybePromise<T> = T | Promise<T>;
type ApplyAllowlistConfigEdit = (params: {
    cfg: OpenClawConfig;
    parsedConfig: Record<string, unknown>;
    accountId?: string | null;
    scope: "dm" | "group";
    action: "add" | "remove";
    entry: string;
}) => MaybePromise<AllowlistConfigEditResult>;
/** Applies a channel allowlist edit through a plugin-provided config mutation hook. */
export declare function applyAllowlistConfigMutation(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    scope: "dm" | "group";
    action: "add" | "remove";
    entry: string;
    applyConfigEdit: ApplyAllowlistConfigEdit;
}): Promise<void>;
export {};
