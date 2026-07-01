/** Visit object-shaped content blocks in an assistant/user message payload. */
export declare function visitObjectContentBlocks(message: unknown, visitor: (block: Record<string, unknown>) => void): void;
