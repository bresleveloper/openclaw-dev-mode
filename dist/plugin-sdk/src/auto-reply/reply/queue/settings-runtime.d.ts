import type { QueueSettings, ResolveQueueSettingsParams } from "./types.js";
/** Resolves queue settings with channel plugin defaults layered into core config. */
export declare function resolveQueueSettings(params: ResolveQueueSettingsParams): QueueSettings;
