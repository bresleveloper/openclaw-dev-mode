/** Conversation shape supported by the synthetic QA channel bus. */
export type QaBusConversationKind = "direct" | "channel" | "group";
/** Addressable conversation used by QA bus messages and thread state. */
export type QaBusConversation = {
    id: string;
    kind: QaBusConversationKind;
    title?: string;
};
/** Media/file attachment fixture accepted by QA bus message APIs. */
export type QaBusAttachment = {
    id: string;
    kind: "image" | "video" | "audio" | "file";
    mimeType: string;
    fileName?: string;
    inline?: boolean;
    url?: string;
    contentBase64?: string;
    width?: number;
    height?: number;
    durationMs?: number;
    altText?: string;
    transcript?: string;
};
/** Tool-call fixture attached to QA messages for agent-runtime tests. */
export type QaBusToolCall = {
    name: string;
    arguments?: Record<string, unknown>;
};
/** Stored QA bus message after defaults, reactions, and account ids are normalized. */
export type QaBusMessage = {
    id: string;
    accountId: string;
    direction: "inbound" | "outbound";
    conversation: QaBusConversation;
    senderId: string;
    senderName?: string;
    text: string;
    timestamp: number;
    threadId?: string;
    threadTitle?: string;
    replyToId?: string;
    deleted?: boolean;
    editedAt?: number;
    attachments?: QaBusAttachment[];
    toolCalls?: QaBusToolCall[];
    reactions: Array<{
        emoji: string;
        senderId: string;
        timestamp: number;
    }>;
};
/** Synthetic thread record created inside a QA bus conversation. */
export type QaBusThread = {
    id: string;
    accountId: string;
    conversationId: string;
    title: string;
    createdAt: number;
    createdBy: string;
};
/** Ordered event emitted by QA bus polling and state snapshots. */
export type QaBusEvent = {
    cursor: number;
    kind: "inbound-message";
    accountId: string;
    message: QaBusMessage;
} | {
    cursor: number;
    kind: "outbound-message";
    accountId: string;
    message: QaBusMessage;
} | {
    cursor: number;
    kind: "thread-created";
    accountId: string;
    thread: QaBusThread;
} | {
    cursor: number;
    kind: "message-edited";
    accountId: string;
    message: QaBusMessage;
} | {
    cursor: number;
    kind: "message-deleted";
    accountId: string;
    message: QaBusMessage;
} | {
    cursor: number;
    kind: "reaction-added";
    accountId: string;
    message: QaBusMessage;
    emoji: string;
    senderId: string;
};
/** Input for injecting an inbound message from a synthetic user/channel. */
export type QaBusInboundMessageInput = {
    accountId?: string;
    conversation: QaBusConversation;
    senderId: string;
    senderName?: string;
    text: string;
    timestamp?: number;
    threadId?: string;
    threadTitle?: string;
    replyToId?: string;
    attachments?: QaBusAttachment[];
    toolCalls?: QaBusToolCall[];
};
/** Input for recording an outbound message sent by an OpenClaw runtime. */
export type QaBusOutboundMessageInput = {
    accountId?: string;
    to: string;
    senderId?: string;
    senderName?: string;
    text: string;
    timestamp?: number;
    threadId?: string;
    replyToId?: string;
    attachments?: QaBusAttachment[];
    toolCalls?: QaBusToolCall[];
};
/** Input for creating a synthetic QA bus thread. */
export type QaBusCreateThreadInput = {
    accountId?: string;
    conversationId: string;
    title: string;
    createdBy?: string;
    timestamp?: number;
};
/** Input for adding a reaction event to an existing QA bus message. */
export type QaBusReactToMessageInput = {
    accountId?: string;
    messageId: string;
    emoji: string;
    senderId?: string;
    timestamp?: number;
};
/** Input for editing an existing QA bus message. */
export type QaBusEditMessageInput = {
    accountId?: string;
    messageId: string;
    text: string;
    timestamp?: number;
};
/** Input for marking an existing QA bus message as deleted. */
export type QaBusDeleteMessageInput = {
    accountId?: string;
    messageId: string;
    timestamp?: number;
};
/** Search filter accepted by QA bus message lookup helpers. */
export type QaBusSearchMessagesInput = {
    accountId?: string;
    query?: string;
    conversationId?: string;
    threadId?: string;
    limit?: number;
};
/** Lookup key for reading one QA bus message. */
export type QaBusReadMessageInput = {
    accountId?: string;
    messageId: string;
};
/** Cursor and timeout options used by QA bus polling. */
export type QaBusPollInput = {
    accountId?: string;
    cursor?: number;
    timeoutMs?: number;
    limit?: number;
};
/** Poll response containing the next cursor and ordered events. */
export type QaBusPollResult = {
    cursor: number;
    events: QaBusEvent[];
};
/** Complete QA bus state snapshot exposed to tests and diagnostics. */
export type QaBusStateSnapshot = {
    cursor: number;
    conversations: QaBusConversation[];
    threads: QaBusThread[];
    messages: QaBusMessage[];
    events: QaBusEvent[];
};
/** Sanitize arbitrary tool-call arguments before storing them in QA bus messages. */
export declare function sanitizeQaBusToolCallArguments(value: unknown): Record<string, unknown> | undefined;
/** Normalize and redact a bounded list of tool calls from untrusted QA input. */
export declare function sanitizeQaBusToolCalls(value: unknown): QaBusToolCall[] | undefined;
/** Predicate input used by QA helpers that wait for bus events or messages. */
export type QaBusWaitForInput = {
    timeoutMs?: number;
    kind: "event-kind";
    eventKind: QaBusEvent["kind"];
} | {
    timeoutMs?: number;
    kind: "message-text";
    textIncludes: string;
    direction?: QaBusMessage["direction"];
} | {
    timeoutMs?: number;
    kind: "thread-id";
    threadId: string;
};
