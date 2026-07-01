import type { FastMode } from "@openclaw/normalization-core/string-coerce";
export declare const DEFAULT_FAST_MODE_AUTO_ON_SECONDS = 60;
export type FastModeSource = "session" | "agent" | "config" | "default";
export type FastModeAutoProgressState = {
    offAnnounced: boolean;
    resetAnnounced: boolean;
};
type FastModeModelConfig = {
    params?: Record<string, unknown>;
};
type FastModeConfig = {
    agents?: {
        defaults?: {
            models?: Record<string, FastModeModelConfig | undefined>;
        };
    };
};
export declare function resolveFastModeModelParams(params: {
    cfg: FastModeConfig | undefined;
    provider?: string;
    model?: string;
}): Record<string, unknown> | undefined;
export declare function normalizeFastModeAutoOnSeconds(value: unknown): number | undefined;
export declare function resolveFastModeModelAutoOnSeconds(params: {
    cfg: FastModeConfig | undefined;
    provider?: string;
    model?: string;
}): number;
export declare function resolveFastModeForElapsed(params: {
    mode?: FastMode;
    startedAtMs: number;
    fastAutoOnSeconds?: number;
    nowMs?: number;
}): {
    mode: FastMode | undefined;
    enabled: boolean;
    elapsedSeconds: number;
    fastAutoOnSeconds: number;
};
export declare function formatFastModeAutoProgressText(params: {
    enabled: boolean;
    elapsedSeconds: number;
    fastAutoOnSeconds?: number;
}): string;
export declare function formatFastModeValue(mode: FastMode | undefined): "auto" | "on" | "off";
export declare function formatFastModeAutoLabel(params?: {
    fastAutoOnSeconds?: number;
}): string;
export declare function formatFastModeStatusValue(params: {
    mode: FastMode | undefined;
    fastAutoOnSeconds?: number;
}): string;
export declare function formatFastModeCommandOptions(params?: {
    fastAutoOnSeconds?: number;
}): string;
export declare function normalizeFastModeSource(value: unknown): FastModeSource | undefined;
export declare function formatFastModeSourceSuffix(source: FastModeSource | undefined): string;
export declare function formatFastModeCurrentStatus(params: {
    mode: FastMode | undefined;
    source?: FastModeSource;
    fastAutoOnSeconds?: number;
    label?: string;
}): string;
export {};
