import type { ConfigFileSnapshot, OpenClawConfig } from "./types.js";
/** Override env var for intentional older-binary destructive config actions. */
export declare const ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV = "OPENCLAW_ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS";
/** Block payload shown when an older binary would mutate newer-written config. */
export type FutureConfigActionBlock = {
    action: string;
    currentVersion: string;
    touchedVersion: string;
    message: string;
    hints: string[];
};
type FutureConfigGuardParams = {
    action: string;
    snapshot?: Pick<ConfigFileSnapshot, "config" | "sourceConfig"> | null;
    config?: Pick<OpenClawConfig, "meta"> | null;
    currentVersion?: string;
    env?: Record<string, string | undefined>;
};
/** Resolves whether a destructive action should be blocked by future config metadata. */
export declare function resolveFutureConfigActionBlock(params: FutureConfigGuardParams): FutureConfigActionBlock | null;
/** Formats a future-config action block for CLI/service error output. */
export declare function formatFutureConfigActionBlock(block: FutureConfigActionBlock): string;
export {};
