import { type SystemdUnavailableKind } from "./systemd-unavailable.js";
type SystemdUnavailableHintOptions = {
    wsl?: boolean;
    kind?: SystemdUnavailableKind | null;
    container?: boolean;
};
/** Detects details that should get systemd availability repair hints. */
export declare function isSystemdUnavailableDetail(detail?: string): boolean;
export declare function renderSystemdUnavailableHints(options?: SystemdUnavailableHintOptions): string[];
export {};
