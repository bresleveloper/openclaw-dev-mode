type SendPolicyOverride = "allow" | "deny";
/** Parses /send commands and maps user-facing aliases to allow, deny, or inherit. */
export declare function parseSendPolicyCommand(raw?: string): {
    hasCommand: boolean;
    mode?: SendPolicyOverride | "inherit";
};
export {};
