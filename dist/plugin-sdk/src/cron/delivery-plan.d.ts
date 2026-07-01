import type { CronFailureDestinationConfig } from "../config/types.cron.js";
import type { CronDeliveryMode, CronJob, CronMessageChannel } from "./types.js";
/** Normalized routing plan for a cron job's primary delivery behavior. */
export type CronDeliveryPlan = {
    mode: CronDeliveryMode;
    channel?: CronMessageChannel;
    to?: string;
    threadId?: string | number;
    /** Explicit channel account id from the delivery config, if set. */
    accountId?: string;
    source: "delivery";
    requested: boolean;
};
/** Returns whether a delivery plan names a concrete channel, recipient, thread, or account. */
export declare function hasExplicitCronDeliveryTarget(plan: CronDeliveryPlan): boolean;
/** Resolves primary delivery config into the runtime mode/channel/target plan. */
export declare function resolveCronDeliveryPlan(job: CronJob): CronDeliveryPlan;
/** Normalized destination for notifying about cron execution failures. */
export type CronFailureDeliveryPlan = {
    mode: "announce" | "webhook";
    channel?: CronMessageChannel;
    to?: string;
    accountId?: string;
};
/** Job-level failure destination override fields before global defaults are merged. */
export type CronFailureDestinationInput = {
    channel?: CronMessageChannel;
    to?: string;
    accountId?: string;
    mode?: "announce" | "webhook";
};
/** Resolves job-level failure notification routing layered over global defaults. */
export declare function resolveFailureDestination(job: CronJob, globalConfig?: CronFailureDestinationConfig): CronFailureDeliveryPlan | null;
