import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { s as SessionEntry } from "./types-r7E6AIEo.js";
import { ha as SessionsPatchParams } from "./schema-DtyqV_v0.js";
import { t as CliDeps } from "./deps.types-BdV6g6qp.js";

//#region src/agents/workspace.d.ts
declare const DEFAULT_AGENTS_FILENAME = "AGENTS.md";
declare const DEFAULT_SOUL_FILENAME = "SOUL.md";
declare const DEFAULT_TOOLS_FILENAME = "TOOLS.md";
declare const DEFAULT_IDENTITY_FILENAME = "IDENTITY.md";
declare const DEFAULT_USER_FILENAME = "USER.md";
declare const DEFAULT_HEARTBEAT_FILENAME = "HEARTBEAT.md";
declare const DEFAULT_BOOTSTRAP_FILENAME = "BOOTSTRAP.md";
declare const DEFAULT_MEMORY_FILENAME = "MEMORY.md";
type WorkspaceBootstrapFileName = typeof DEFAULT_AGENTS_FILENAME | typeof DEFAULT_SOUL_FILENAME | typeof DEFAULT_TOOLS_FILENAME | typeof DEFAULT_IDENTITY_FILENAME | typeof DEFAULT_USER_FILENAME | typeof DEFAULT_HEARTBEAT_FILENAME | typeof DEFAULT_BOOTSTRAP_FILENAME | typeof DEFAULT_MEMORY_FILENAME;
type WorkspaceBootstrapFile = {
  name: WorkspaceBootstrapFileName;
  path: string;
  content?: string;
  missing: boolean;
};
declare function ensureAgentWorkspace(params?: {
  dir?: string;
  ensureBootstrapFiles?: boolean;
  /**
   * List of optional bootstrap filenames to skip writing.
   * Applies only to SOUL.md, USER.md, HEARTBEAT.md, IDENTITY.md.
   * Required workspace setup such as AGENTS.md and TOOLS.md still runs.
   */
  skipOptionalBootstrapFiles?: string[];
}): Promise<{
  dir: string;
  agentsPath?: string;
  soulPath?: string;
  toolsPath?: string;
  identityPath?: string;
  userPath?: string;
  heartbeatPath?: string;
  bootstrapPath?: string;
  identityPathCreated?: boolean;
}>;
//#endregion
//#region src/hooks/internal-hook-types.d.ts
type InternalHookEventType = "command" | "session" | "agent" | "gateway" | "message";
interface InternalHookEvent {
  /** The type of event (command, session, agent, gateway, etc.) */
  type: InternalHookEventType;
  /** The specific action within the type (e.g., 'new', 'reset', 'stop') */
  action: string;
  /** The session key this event relates to */
  sessionKey: string;
  /** Additional context specific to the event */
  context: Record<string, unknown>;
  /** Timestamp when the event occurred */
  timestamp: Date;
  /** Messages to send back to the user (hooks can push to this array) */
  messages: string[];
}
type InternalHookHandler = (event: InternalHookEvent) => Promise<void> | void;
//#endregion
//#region src/hooks/internal-hooks.d.ts
type AgentBootstrapHookContext = {
  workspaceDir: string;
  bootstrapFiles: WorkspaceBootstrapFile[];
  cfg?: OpenClawConfig;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
};
type AgentBootstrapHookEvent = InternalHookEvent & {
  type: "agent";
  action: "bootstrap";
  context: AgentBootstrapHookContext;
};
type GatewayStartupHookContext = {
  cfg?: OpenClawConfig;
  deps?: CliDeps;
  workspaceDir?: string;
};
type GatewayStartupHookEvent = InternalHookEvent & {
  type: "gateway";
  action: "startup";
  context: GatewayStartupHookContext;
};
type MessageReceivedHookContext = {
  /** Sender identifier (e.g., phone number, user ID) */from: string; /** Message content */
  content: string; /** Unix timestamp when the message was received */
  timestamp?: number; /** Channel identifier (for example "chat" or "support-chat") */
  channelId: string; /** Provider account ID for multi-account setups */
  accountId?: string; /** Conversation/chat ID */
  conversationId?: string; /** Message ID from the provider */
  messageId?: string; /** Additional provider-specific metadata */
  metadata?: Record<string, unknown>;
};
type MessageReceivedHookEvent = InternalHookEvent & {
  type: "message";
  action: "received";
  context: MessageReceivedHookContext;
};
type MessageSentHookContext = {
  /** Recipient identifier */to: string; /** Message content */
  content: string; /** Whether the message was sent successfully */
  success: boolean; /** Error message if sending failed */
  error?: string; /** Channel identifier (for example "chat" or "support-chat") */
  channelId: string; /** Provider account ID for multi-account setups */
  accountId?: string; /** Conversation/chat ID */
  conversationId?: string; /** Message ID returned by the provider */
  messageId?: string; /** Whether this message was sent in a group/channel context */
  isGroup?: boolean; /** Group or channel identifier, if applicable */
  groupId?: string;
};
type MessageSentHookEvent = InternalHookEvent & {
  type: "message";
  action: "sent";
  context: MessageSentHookContext;
};
type MessageEnrichedBodyHookContext = {
  /** Sender identifier (e.g., phone number, user ID) */from?: string; /** Recipient identifier */
  to?: string; /** Original raw message body (e.g., "🎤 [Audio]") */
  body?: string; /** Enriched body shown to the agent, including transcript */
  bodyForAgent?: string; /** Unix timestamp when the message was received */
  timestamp?: number; /** Channel identifier (for example "chat" or "support-chat") */
  channelId: string; /** Conversation/chat ID */
  conversationId?: string; /** Message ID from the provider */
  messageId?: string; /** Sender user ID */
  senderId?: string; /** Sender display name */
  senderName?: string; /** Sender username */
  senderUsername?: string; /** Provider name */
  provider?: string; /** Surface name */
  surface?: string; /** Path to the media file that was transcribed */
  mediaPath?: string; /** MIME type of the media */
  mediaType?: string;
};
type MessageTranscribedHookContext = MessageEnrichedBodyHookContext & {
  /** The transcribed text from audio */transcript: string;
};
type MessageTranscribedHookEvent = InternalHookEvent & {
  type: "message";
  action: "transcribed";
  context: MessageTranscribedHookContext;
};
type MessagePreprocessedHookContext = MessageEnrichedBodyHookContext & {
  /** Transcribed audio text, if the message contained audio */transcript?: string; /** Whether this message was sent in a group/channel context */
  isGroup?: boolean; /** Group or channel identifier, if applicable */
  groupId?: string;
};
type MessagePreprocessedHookEvent = InternalHookEvent & {
  type: "message";
  action: "preprocessed";
  context: MessagePreprocessedHookContext;
};
type SessionPatchHookContext = {
  sessionEntry: SessionEntry;
  patch: SessionsPatchParams;
  cfg: OpenClawConfig;
};
type SessionPatchHookEvent = InternalHookEvent & {
  type: "session";
  action: "patch";
  context: SessionPatchHookContext;
};
/**
 * Register a hook handler for a specific event type or event:action combination
 *
 * @param eventKey - Event type (e.g., 'command') or specific action (e.g., 'command:new')
 * @param handler - Function to call when the event is triggered
 *
 * @example
 * ```ts
 * // Listen to all command events
 * registerInternalHook('command', async (event) => {
 *   console.log('Command:', event.action);
 * });
 *
 * // Listen only to /new commands
 * registerInternalHook('command:new', async (event) => {
 *   await saveSessionToMemory(event);
 * });
 * ```
 */
declare function registerInternalHook(eventKey: string, handler: InternalHookHandler): void;
/**
 * Unregister a specific hook handler
 *
 * @param eventKey - Event key the handler was registered for
 * @param handler - The handler function to remove
 */
declare function unregisterInternalHook(eventKey: string, handler: InternalHookHandler): void;
/**
 * Clear all registered hooks (useful for testing)
 */
declare function clearInternalHooks(): void;
declare function setInternalHooksEnabled(enabled: boolean): void;
/**
 * Get all registered event keys (useful for debugging)
 */
declare function getRegisteredEventKeys(): string[];
declare function hasInternalHookListeners(type: InternalHookEventType, action: string): boolean;
/**
 * Trigger a hook event
 *
 * Calls all handlers registered for:
 * 1. The general event type (e.g., 'command')
 * 2. The specific event:action combination (e.g., 'command:new')
 *
 * Handlers are called in registration order. Errors are caught and logged
 * but don't prevent other handlers from running.
 *
 * @param event - The event to trigger
 */
declare function triggerInternalHook(event: InternalHookEvent): Promise<void>;
/**
 * Create a hook event with common fields filled in
 *
 * @param type - The event type
 * @param action - The action within that type
 * @param sessionKey - The session key
 * @param context - Additional context
 */
declare function createInternalHookEvent(type: InternalHookEventType, action: string, sessionKey: string, context?: Record<string, unknown>): InternalHookEvent;
declare function isAgentBootstrapEvent(event: InternalHookEvent): event is AgentBootstrapHookEvent;
declare function isGatewayStartupEvent(event: InternalHookEvent): event is GatewayStartupHookEvent;
declare function isMessageReceivedEvent(event: InternalHookEvent): event is MessageReceivedHookEvent;
declare function isMessageSentEvent(event: InternalHookEvent): event is MessageSentHookEvent;
declare function isMessageTranscribedEvent(event: InternalHookEvent): event is MessageTranscribedHookEvent;
declare function isMessagePreprocessedEvent(event: InternalHookEvent): event is MessagePreprocessedHookEvent;
declare function isSessionPatchEvent(event: InternalHookEvent): event is SessionPatchHookEvent;
//#endregion
export { InternalHookEvent as A, isMessageSentEvent as C, setInternalHooksEnabled as D, registerInternalHook as E, InternalHookHandler as M, WorkspaceBootstrapFile as N, triggerInternalHook as O, ensureAgentWorkspace as P, isMessageReceivedEvent as S, isSessionPatchEvent as T, getRegisteredEventKeys as _, MessagePreprocessedHookContext as a, isGatewayStartupEvent as b, MessageReceivedHookEvent as c, MessageTranscribedHookContext as d, MessageTranscribedHookEvent as f, createInternalHookEvent as g, clearInternalHooks as h, GatewayStartupHookEvent as i, InternalHookEventType as j, unregisterInternalHook as k, MessageSentHookContext as l, SessionPatchHookEvent as m, AgentBootstrapHookEvent as n, MessagePreprocessedHookEvent as o, SessionPatchHookContext as p, GatewayStartupHookContext as r, MessageReceivedHookContext as s, AgentBootstrapHookContext as t, MessageSentHookEvent as u, hasInternalHookListeners as v, isMessageTranscribedEvent as w, isMessagePreprocessedEvent as x, isAgentBootstrapEvent as y };