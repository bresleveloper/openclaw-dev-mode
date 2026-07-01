import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type DeliveryContext } from "../utils/delivery-context.shared.js";
import type { CronDelivery } from "./types.js";
/** Converts an active delivery context into cron announce delivery config. */
export declare function cronDeliveryFromContext(context?: DeliveryContext): CronDelivery | null;
/** Recovers delivery context from a stored session key captured when the cron job was created. */
export declare function resolveCronStoredDeliveryContext(params: {
    cfg: OpenClawConfig;
    sessionKey?: string;
}): DeliveryContext | undefined;
/** Resolves initial cron delivery, preferring the live context before falling back to session storage. */
export declare function resolveCronCreationDelivery(params: {
    cfg: OpenClawConfig;
    currentDeliveryContext?: DeliveryContext;
    agentSessionKey?: string;
}): CronDelivery | null;
