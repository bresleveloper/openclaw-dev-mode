/** Return whether a user message is an internal heartbeat prompt. */
export declare function isHeartbeatUserMessage(message: {
    role: string;
    content?: unknown;
}, heartbeatPrompt?: string): boolean;
/** Return whether an assistant message is only a heartbeat acknowledgement. */
export declare function isHeartbeatOkResponse(message: {
    role: string;
    content?: unknown;
}, ackMaxChars?: number): boolean;
/** Remove heartbeat-only prompt, ack, and silent tool artifacts from a transcript. */
export declare function filterHeartbeatTranscriptArtifacts<T extends {
    role: string;
    content?: unknown;
}>(messages: T[], ackMaxChars?: number, heartbeatPrompt?: string): T[];
