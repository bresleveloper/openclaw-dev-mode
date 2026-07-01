/**
 * Configuration normalization for transcript capture/import.
 *
 * Raw config can contain optional auto-start provider locators; resolution
 * returns bounded defaults and drops malformed entries before runtime startup.
 */
/** Raw auto-start transcript source entry from config. */
type TranscriptsAutoStartConfig = {
    providerId: string;
    sessionId?: string;
    title?: string;
    accountId?: string;
    guildId?: string;
    channelId?: string;
    meetingUrl?: string;
};
/** Normalized auto-start source entry consumed by transcript runtime code. */
export type ResolvedTranscriptsAutoStartConfig = {
    providerId: string;
    sessionId?: string;
    title?: string;
    accountId?: string;
    guildId?: string;
    channelId?: string;
    meetingUrl?: string;
};
/** Raw transcripts config block. */
export type TranscriptsConfig = {
    enabled?: boolean;
    maxUtterances?: number;
    autoStart?: TranscriptsAutoStartConfig[];
};
/** Resolved transcripts config with defaults applied. */
type ResolvedTranscriptsConfig = {
    enabled: boolean;
    maxUtterances: number;
    autoStart: ResolvedTranscriptsAutoStartConfig[];
};
/** Normalize raw transcripts config into runtime settings. */
export declare function resolveTranscriptsConfig(raw: unknown): ResolvedTranscriptsConfig;
export {};
