type ParsedExecApprovalCommand = {
    approvalId: string;
    decision: "allow-once" | "allow-always" | "deny";
};
export type UnsafeExecControlShellCommandKind = "approve" | "channel-login";
export declare function parseExecApprovalShellCommand(raw: string): ParsedExecApprovalCommand | null;
export declare function parseOpenClawChannelsLoginShellCommand(raw: string): boolean;
export declare function detectUnsafeExecControlShellCommand(command: string): Promise<UnsafeExecControlShellCommandKind | null>;
export declare function rejectUnsafeExecControlShellCommand(command: string): Promise<void>;
export {};
