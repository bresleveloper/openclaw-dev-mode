import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { CronDeliveryPreview, CronJob } from "./types.js";
/** Builds the user-visible cron delivery preview for one job without sending anything. */
export declare function resolveCronDeliveryPreview(params: {
    cfg: OpenClawConfig;
    defaultAgentId?: string;
    job: CronJob;
}): Promise<CronDeliveryPreview>;
/** Builds cron delivery previews keyed by job id. */
export declare function resolveCronDeliveryPreviews(params: {
    cfg: OpenClawConfig;
    defaultAgentId?: string;
    jobs: CronJob[];
}): Promise<Record<string, CronDeliveryPreview>>;
