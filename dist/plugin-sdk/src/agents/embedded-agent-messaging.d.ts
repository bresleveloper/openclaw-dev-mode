/** Return true when a message action sends or uploads user-visible content. */
export declare function isMessageToolSendActionName(action: unknown): boolean;
/** Return true when a message action creates a visible destination conversation. */
export declare function isMessageToolConversationCreateActionName(action: unknown): boolean;
/** Return true for core or channel-plugin messaging tool names. */
export declare function isMessagingTool(toolName: string): boolean;
/** Return true when the specific tool invocation is an outbound send. */
export declare function isMessagingToolSendAction(toolName: string, args: Record<string, unknown>): boolean;
/** Return true when a visible delivery has one target worth recording as evidence. */
export declare function isMessagingToolTargetEvidenceAction(toolName: string, args: Record<string, unknown>): boolean;
/** Return true when a messaging invocation can create visible outbound delivery. */
export declare function isMessagingToolDeliveryAction(toolName: string, args: Record<string, unknown>): boolean;
