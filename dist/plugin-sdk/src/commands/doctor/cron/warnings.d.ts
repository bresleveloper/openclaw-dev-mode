import type { OpenClawConfig } from "../../../config/types.openclaw.js";
type CrontabReader = () => Promise<{
    stdout?: unknown;
    stderr?: unknown;
}>;
/** Emit a note when cron jobs pin models instead of inheriting the default model. */
export declare function noteCronModelOverrides(params: {
    cfg: OpenClawConfig;
    jobs: Array<Record<string, unknown>>;
    storePath: string;
}): void;
/** Return a warning when the user's crontab still runs the old WhatsApp health script. */
export declare function collectLegacyWhatsAppCrontabHealthWarning(params?: {
    platform?: NodeJS.Platform;
    readCrontab?: CrontabReader;
}): Promise<string | null>;
/** Emit the legacy WhatsApp crontab warning when present. */
export declare function noteLegacyWhatsAppCrontabHealthCheck(params?: {
    platform?: NodeJS.Platform;
    readCrontab?: CrontabReader;
}): Promise<void>;
export {};
