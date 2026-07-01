import type { ChannelPlugin } from "../channels/plugins/types.plugin.js";
import type { QaBusAttachment, QaBusInboundMessageInput, QaBusMessage, QaBusPollResult, QaBusSearchMessagesInput, QaBusStateSnapshot, QaBusThread, QaBusToolCall } from "./qa-channel-protocol.js";
export type * from "./qa-channel-protocol.js";
type QaTargetParts = {
    chatType: "direct" | "channel";
    conversationId: string;
    threadId?: string;
};
type FacadeModule = {
    buildQaTarget: (params: QaTargetParts & {
        threadId?: string | null;
    }) => string;
    formatQaTarget: (params: QaTargetParts & {
        threadId?: string | null;
    }) => string;
    createQaBusThread: (params: {
        baseUrl: string;
        accountId: string;
        conversationId: string;
        title: string;
        createdBy?: string;
    }) => Promise<{
        thread: QaBusThread;
    }>;
    deleteQaBusMessage: (params: {
        baseUrl: string;
        accountId: string;
        messageId: string;
    }) => Promise<{
        message: QaBusMessage;
    }>;
    editQaBusMessage: (params: {
        baseUrl: string;
        accountId: string;
        messageId: string;
        text: string;
    }) => Promise<{
        message: QaBusMessage;
    }>;
    getQaBusState: (baseUrl: string) => Promise<QaBusStateSnapshot>;
    injectQaBusInboundMessage: (params: {
        baseUrl: string;
        input: QaBusInboundMessageInput;
    }) => Promise<{
        message: QaBusMessage;
    }>;
    normalizeQaTarget: (raw: string) => string | undefined;
    parseQaTarget: (raw: string) => QaTargetParts;
    pollQaBus: (params: {
        baseUrl: string;
        accountId: string;
        cursor: number;
        timeoutMs: number;
        signal?: AbortSignal;
    }) => Promise<QaBusPollResult>;
    qaChannelPlugin: ChannelPlugin;
    reactToQaBusMessage: (params: {
        baseUrl: string;
        accountId: string;
        messageId: string;
        emoji: string;
        senderId?: string;
    }) => Promise<{
        message: QaBusMessage;
    }>;
    readQaBusMessage: (params: {
        baseUrl: string;
        accountId: string;
        messageId: string;
    }) => Promise<{
        message: QaBusMessage;
    }>;
    searchQaBusMessages: (params: {
        baseUrl: string;
        input: QaBusSearchMessagesInput;
    }) => Promise<{
        messages: QaBusMessage[];
    }>;
    sendQaBusMessage: (params: {
        baseUrl: string;
        accountId: string;
        to: string;
        text: string;
        senderId?: string;
        senderName?: string;
        threadId?: string;
        replyToId?: string;
        attachments?: QaBusAttachment[];
        toolCalls?: QaBusToolCall[];
    }) => Promise<{
        message: QaBusMessage;
    }>;
    setQaChannelRuntime: (runtime: unknown) => void;
};
/** Build a QA bus target string from conversation and optional thread parts. */
export declare const buildQaTarget: FacadeModule["buildQaTarget"];
/** Format a QA bus target string for display and CLI output. */
export declare const formatQaTarget: FacadeModule["buildQaTarget"];
/** Create a QA bus thread through the bundled QA channel facade. */
export declare const createQaBusThread: FacadeModule["createQaBusThread"];
/** Delete a QA bus message through the bundled QA channel facade. */
export declare const deleteQaBusMessage: FacadeModule["deleteQaBusMessage"];
/** Edit a QA bus message through the bundled QA channel facade. */
export declare const editQaBusMessage: FacadeModule["editQaBusMessage"];
/** Read the current QA bus state snapshot. */
export declare const getQaBusState: FacadeModule["getQaBusState"];
/** Inject an inbound QA bus message for channel and gateway tests. */
export declare const injectQaBusInboundMessage: FacadeModule["injectQaBusInboundMessage"];
/** Normalize a user-provided QA target string when possible. */
export declare const normalizeQaTarget: FacadeModule["normalizeQaTarget"];
/** Parse a QA target string into chat type, conversation id, and optional thread id. */
export declare const parseQaTarget: FacadeModule["parseQaTarget"];
/** Poll the QA bus for new messages from a cursor. */
export declare const pollQaBus: FacadeModule["pollQaBus"];
/** Lazy QA channel plugin object used by plugin loader tests. */
export declare const qaChannelPlugin: FacadeModule["qaChannelPlugin"];
/** Add a reaction to a QA bus message. */
export declare const reactToQaBusMessage: FacadeModule["reactToQaBusMessage"];
/** Read one QA bus message by id. */
export declare const readQaBusMessage: FacadeModule["readQaBusMessage"];
/** Search QA bus messages using the bundled channel facade. */
export declare const searchQaBusMessages: FacadeModule["searchQaBusMessages"];
/** Send an outbound QA bus message with optional attachments and tool calls. */
export declare const sendQaBusMessage: FacadeModule["sendQaBusMessage"];
/** Install a test runtime implementation into the bundled QA channel facade. */
export declare const setQaChannelRuntime: FacadeModule["setQaChannelRuntime"];
