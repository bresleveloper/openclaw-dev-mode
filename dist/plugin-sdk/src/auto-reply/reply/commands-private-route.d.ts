import type { ExecApprovalRequest } from "../../infra/exec-approvals.js";
import type { ReplyPayload } from "../types.js";
import type { HandleCommandsParams } from "./commands-types.js";
/** Resolved private delivery target for command replies and approvals. */
export type PrivateCommandRouteTarget = {
    channel: string;
    to: string;
    accountId?: string | null;
    threadId?: string | number | null;
};
/** Resolves expiry timestamp for temporary private approval routes. */
export declare function resolvePrivateCommandApprovalRouteExpiresAtMs(nowMs?: number): number;
/** Finds private owner DM routes that can receive sensitive command replies. */
export declare function resolvePrivateCommandRouteTargets(params: {
    commandParams: HandleCommandsParams;
    request: ExecApprovalRequest;
}): Promise<PrivateCommandRouteTarget[]>;
/** Delivers a sensitive command reply to the resolved private targets. */
export declare function deliverPrivateCommandReply(params: {
    commandParams: HandleCommandsParams;
    targets: PrivateCommandRouteTarget[];
    reply: ReplyPayload;
}): Promise<boolean>;
/** Reads the command message thread id from command context. */
export declare function readCommandMessageThreadId(params: HandleCommandsParams): string | undefined;
/** Reads the best delivery target for command route resolution. */
export declare function readCommandDeliveryTarget(params: HandleCommandsParams): string | undefined;
