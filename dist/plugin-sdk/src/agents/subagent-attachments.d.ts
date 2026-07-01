import type { OpenClawConfig } from "../config/types.openclaw.js";
export declare function decodeStrictBase64(value: string, maxDecodedBytes: number): Buffer | null;
export type SubagentInlineAttachment = {
    name: string;
    content: string;
    encoding?: "utf8" | "base64";
    mimeType?: string;
};
type AcpInlineImageAttachment = {
    mediaType: string;
    data: string;
};
export type SubagentAttachmentReceiptFile = {
    name: string;
    bytes: number;
    sha256: string;
};
type SubagentAttachmentReceipt = {
    count: number;
    totalBytes: number;
    files: SubagentAttachmentReceiptFile[];
    relDir: string;
};
type MaterializeSubagentAttachmentsResult = {
    status: "ok";
    receipt: SubagentAttachmentReceipt;
    absDir: string;
    rootDir: string;
    retainOnSessionKeep: boolean;
    systemPromptSuffix: string;
} | {
    status: "forbidden";
    error: string;
} | {
    status: "error";
    error: string;
};
export declare function resolveAcpSessionsSpawnImageAttachments(params: {
    config: OpenClawConfig;
    attachments?: SubagentInlineAttachment[];
}): {
    status: "ok";
    attachments: AcpInlineImageAttachment[];
} | {
    status: "forbidden";
    error: string;
} | {
    status: "error";
    error: string;
} | null;
export declare function materializeSubagentAttachments(params: {
    config: OpenClawConfig;
    targetAgentId: string;
    workspaceDir?: string;
    attachments?: SubagentInlineAttachment[];
    mountPathHint?: string;
}): Promise<MaterializeSubagentAttachmentsResult | null>;
export {};
