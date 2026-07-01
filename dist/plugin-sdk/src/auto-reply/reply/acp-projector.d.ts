import type { AcpRuntimeEvent, AcpSessionUpdateTag } from "@openclaw/acp-core/runtime/types";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ReplyPayload } from "../types.js";
import type { ReplyDispatchKind } from "./reply-dispatcher.types.js";
type AcpProjectedDeliveryMeta = {
    tag?: AcpSessionUpdateTag;
    toolCallId?: string;
    toolStatus?: string;
    allowEdit?: boolean;
};
type AcpReplyProjector = {
    onEvent: (event: AcpRuntimeEvent) => Promise<void>;
    flush: (force?: boolean) => Promise<void>;
};
export declare function createAcpReplyProjector(params: {
    cfg: OpenClawConfig;
    shouldSendToolSummaries: boolean;
    shouldSendToolSummariesNow?: () => boolean;
    deliver: (kind: ReplyDispatchKind, payload: ReplyPayload, meta?: AcpProjectedDeliveryMeta) => Promise<boolean>;
    onProgress?: () => void;
    provider?: string;
    accountId?: string;
}): AcpReplyProjector;
export {};
