import type { ChatAttachment } from "../chat-attachments.js";
/** RPC attachment payload shape accepted by chat-like gateway methods. */
export type RpcAttachmentInput = {
    type?: unknown;
    mimeType?: unknown;
    fileName?: unknown;
    content?: unknown;
    source?: unknown;
};
/** Convert permissive RPC attachment payloads into the bounded chat attachment shape. */
export declare function normalizeRpcAttachmentsToChatAttachments(attachments: RpcAttachmentInput[] | undefined): ChatAttachment[];
