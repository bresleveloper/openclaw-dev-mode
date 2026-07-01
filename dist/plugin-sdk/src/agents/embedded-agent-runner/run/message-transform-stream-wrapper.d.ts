/**
 * Wraps stream functions with pre-call message transforms.
 */
import type { StreamFn } from "openclaw/plugin-sdk/agent-core";
import type { AgentMessage } from "../../runtime/index.js";
/**
 * Stream wrapper for applying message transforms immediately before provider dispatch.
 */
type MessageTransform = (messages: AgentMessage[], model: unknown) => AgentMessage[];
/** Wraps a stream function with a conditional message-list transform. */
export declare function wrapStreamFnWithMessageTransform(streamFn: StreamFn, transform: MessageTransform): StreamFn;
export {};
