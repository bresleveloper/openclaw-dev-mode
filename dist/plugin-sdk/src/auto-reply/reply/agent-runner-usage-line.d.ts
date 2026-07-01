/** Formats and appends token/cost usage lines to reply payloads. */
import { type ModelCostConfig } from "../../utils/usage-format.js";
import type { ReplyPayload } from "../types.js";
/** Formats the optional usage/cost summary appended to agent replies. */
export declare const formatResponseUsageLine: (params: {
    usage?: {
        input?: number;
        output?: number;
        cacheRead?: number;
        cacheWrite?: number;
    };
    showCost: boolean;
    costConfig?: ModelCostConfig;
}) => string | null;
/** Appends a usage line to the last text payload while preserving payload metadata. */
export declare const appendUsageLine: (payloads: ReplyPayload[], line: string) => ReplyPayload[];
